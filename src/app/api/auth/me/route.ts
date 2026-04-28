import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // If admin, they don't exist in employees table, so we use session data directly
    if (session.role === 'admin') {
      return NextResponse.json({
        user: {
          id: session.id,
          name: session.name || 'Administrator',
          role: 'admin',
          email: session.email
        }
      });
    }

    // Fetch latest employee info from DB
    const { data: user, error } = await supabaseAdmin
      .from('employees')
      .select('id, name, role, email')
      .eq('id', session.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Session error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
