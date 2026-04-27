import { NextRequest, NextResponse } from 'next/server';
import { demoEmployees } from '@/lib/demo-data';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const employee = demoEmployees.find(
      (e) => e.email === email && e.password === password && e.is_active
    );

    if (!employee) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: employee.id,
      email: employee.email,
      role: 'employee',
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
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
