import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { createToken } from '@/lib/auth';
import { z } from 'zod';

// Demo admin credentials (replace with Supabase lookup in production)
const DEMO_ADMIN = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@primetek.com',
  password: 'admin123',
  role: 'admin',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // TODO: Replace with Supabase user lookup + bcrypt comparison
    if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: DEMO_ADMIN.id, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
