import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data: employee, error } = await supabaseAdmin
      .from('employees')
      .select('id, email, password_hash, status, name, role')
      .eq('email', email)
      .single();

    if (error || !employee) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (employee.status !== 'Active') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    // Basic password check for demo purposes
    if (employee.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: employee.id,
      email: employee.email,
      role: employee.role || 'employee',
    });

    const response = NextResponse.json({ success: true, name: employee.name });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
