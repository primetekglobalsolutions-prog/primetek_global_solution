import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const email = 'admin@globalprimetek.com';
    const password = '@globalps!admin_site2025#';

    // 1. Create user via API (This guarantees the password hash is 100% correct)
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: 'Administrator' }
    });

    if (createError) {
      // If user already exists, update their password via API to fix any bad SQL hashes
      if (createError.message.includes('already exists') || createError.message.includes('already registered')) {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = usersData.users.find(u => u.email === email);
        
        if (existingUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: password,
            email_confirm: true
          });
          
          // Ensure they are in admin_users
          await supabaseAdmin.from('admin_users').upsert({ id: existingUser.id, email: email });
          
          return NextResponse.json({ success: true, message: 'Existing user password fixed and admin rights granted! You can now log in.' });
        }
      }
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // 2. Add to admin_users table
    if (authData?.user) {
      const { error: dbError } = await supabaseAdmin.from('admin_users').upsert({ 
        id: authData.user.id, 
        email: email 
      });

      if (dbError) {
        return NextResponse.json({ error: 'User created but failed to grant admin rights: ' + dbError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Admin user perfectly created! You can now log in.' });
    }

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
