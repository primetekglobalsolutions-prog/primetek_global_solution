import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { createToken } from '@/lib/auth';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for Admin in DB/Auth
    const { data: adminRecord } = await supabaseAdmin
      .from('admin_users')
      .select('id, email')
      .eq('email', cleanEmail)
      .single();

    const ADMIN_EMAIL_ENV = (process.env.ADMIN_EMAIL || 'admin@globalprimetek.com').trim().toLowerCase();
    
    if (adminRecord || cleanEmail === ADMIN_EMAIL_ENV) {
      const { data: authData, error: apiAuthError } = await supabaseAdmin.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!apiAuthError && authData?.user) {
        if (!adminRecord) {
          await supabaseAdmin.from('admin_users').upsert({ id: authData.user.id, email: cleanEmail });
        }

        const token = await createToken({
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          role: 'admin',
          name: authData.user.user_metadata?.full_name || 'Administrator',
        });

        const response = NextResponse.json({
          success: true,
          user: { id: authData.user.id, name: 'Administrator', role: 'admin' },
        });

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });

        return response;
      }
    }

    // 2. Check for Employee
    const { data: employee, error } = await supabaseAdmin
      .from('employees')
      .select('id, email, password_hash, name, role, status')
      .eq('email', cleanEmail)
      .single();

    if (!error && employee && employee.status === 'Active') {
      const isValidPassword = await bcrypt.compare(password, employee.password_hash);
      if (isValidPassword) {
        const token = await createToken({
          id: employee.id,
          email: employee.email,
          role: employee.role,
          name: employee.name,
        });

        const response = NextResponse.json({
          success: true,
          user: { id: employee.id, name: employee.name, role: employee.role },
        });

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });

        return response;
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.issues }, { status: 400 });
    }
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
