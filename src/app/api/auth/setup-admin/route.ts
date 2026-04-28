import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const email = 'admin@globalprimetek.com';
    const password = '@globalps!admin_site2025#';

    // 1. Search for existing user first (More reliable than catching errors)
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('[Setup] Failed to list users:', listError.message);
      return NextResponse.json({ error: 'Failed to access Supabase Auth: ' + listError.message }, { status: 500 });
    }

    const existingUser = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    let userId: string;

    if (existingUser) {
      console.log('[Setup] Found existing user, updating...', existingUser.id);
      userId = existingUser.id;
      
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: password,
        email_confirm: true,
        user_metadata: { full_name: 'Administrator' }
      });

      if (updateError) throw updateError;
    } else {
      console.log('[Setup] No existing user found, creating new...');
      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: 'Administrator' }
      });

      if (createError) throw createError;
      userId = authData.user.id;
    }

    // 2. Add to admin_users table (Grant database rights)
    const { error: dbError } = await supabaseAdmin.from('admin_users').upsert({ 
      id: userId, 
      email: email 
    });

    if (dbError) {
      return NextResponse.json({ error: 'Auth fixed but failed to grant DB rights: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: existingUser 
        ? 'Admin credentials updated and confirmed! You can now log in.' 
        : 'New Admin account created and confirmed! You can now log in.' 
    });

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
