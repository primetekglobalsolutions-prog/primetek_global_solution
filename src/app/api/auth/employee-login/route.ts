import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json(); // 'email' field might actually contain employee_id

    const isEmail = email.includes('@');
    const query = supabaseAdmin
      .from('employees')
      .select('id, email, password_hash, status, name, role');
      
    const { data: employee, error } = await (isEmail 
      ? query.eq('email', email).single() 
      : query.eq('employee_id', email).single());

    if (error || !employee) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (employee.status !== 'Active') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    const isValidPassword = await bcrypt.compare(password, employee.password_hash);
    if (!isValidPassword) {
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
