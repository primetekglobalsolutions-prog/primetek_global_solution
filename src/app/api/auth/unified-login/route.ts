import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Simple in-memory rate limiter for serverless functions
// Note: In Vercel, this is scoped per isolate, so it's not a global limit,
// but it is enough to slow down automated brute force attacks against a single instance.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    // 1. Basic Security: Rate Limiting by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || (request as any).ip || 'unknown-ip';
    console.log(`[Auth] Attempt from IP: ${ip}`);

    const now = Date.now();
    const limitRecord = rateLimitMap.get(ip);
    
    if (limitRecord && (now - limitRecord.timestamp < RATE_LIMIT_WINDOW_MS)) {
      if (limitRecord.count >= MAX_ATTEMPTS_PER_WINDOW) {
        console.warn(`[Auth] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json({ error: 'Too many login attempts. Please try again in 60 seconds.' }, { status: 429 });
      }
      limitRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const { email, password } = await request.json();
    console.log(`[Auth] Login attempt for: ${email}`);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Input Sanitization: Trim whitespace to prevent accidental spaces
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const isEmail = cleanEmail.includes('@');

    let authError: any = null;

    // 3. Admin Check (Database-first for reliability)
    // First, check if this email exists in the admin_users table
    const { data: adminRecord } = await supabaseAdmin
      .from('admin_users')
      .select('id, email')
      .eq('email', cleanEmail)
      .single();

    const ADMIN_EMAIL_ENV = (process.env.ADMIN_EMAIL || 'admin@globalprimetek.com').trim().toLowerCase();
    const isAdmin = adminRecord || cleanEmail === ADMIN_EMAIL_ENV;

    if (isAdmin) {
      console.log(`[Auth] Admin detected (${cleanEmail}). Authenticating via Supabase Auth...`);
      
      const { data: authData, error: apiAuthError } = await supabaseAdmin.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (apiAuthError) {
        console.error('[Auth] Admin Auth failed:', apiAuthError.message);
        
        // Pass through specific errors that aren't just "wrong password"
        if (apiAuthError.message !== 'Invalid login credentials') {
          return NextResponse.json({ error: apiAuthError.message }, { status: 401 });
        }
        
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (authData?.user) {
        // Double check they have admin rights in DB if they weren't found earlier
        if (!adminRecord) {
          await supabaseAdmin.from('admin_users').upsert({ id: authData.user.id, email: cleanEmail });
        }

        const token = await createToken({
          id: authData.user.id,
          email: authData.user.email || email,
          role: 'admin',
          name: authData.user.user_metadata?.full_name || 'Administrator',
        });

        const response = NextResponse.json({ 
          success: true, 
          role: 'admin',
          name: authData.user.user_metadata?.full_name || 'Administrator' 
        });

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
      }
    }

    // 4. If not admin, try finding the user in the employees table
    const query = supabaseAdmin
      .from('employees')
      .select('id, email, employee_id, password_hash, status, name, role');
      
    const { data: user, error } = await (isEmail 
      ? query.eq('email', cleanEmail).single() 
      : query.eq('employee_id', cleanEmail).single());

    if (error || !user) {
      if (authError && authError.message !== 'Invalid login credentials') {
        return NextResponse.json({ error: `Supabase Auth Error: ${authError.message}` }, { status: 401 });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'Active') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    const isValidPassword = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({ 
      success: true, 
      role: user.role,
      name: user.name 
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    console.error('Unified Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
