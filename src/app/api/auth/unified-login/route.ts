import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Try finding the user by email or employee_id
    const isEmail = email.includes('@');
    const query = supabaseAdmin
      .from('employees')
      .select('id, email, employee_id, password_hash, status, name, role');
      
    const { data: user, error } = await (isEmail 
      ? query.eq('email', email).single() 
      : query.eq('employee_id', email).single());

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'Active' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
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
