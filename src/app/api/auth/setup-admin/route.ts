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
      console.log('[Setup] User creation failed, checking if user already exists...', createError.message);
      
      // Handle "already registered" or "already exists" errors
      const isAlreadyExists = 
        createError.message.toLowerCase().includes('already registered') || 
        createError.message.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        // Find the user by email in the user list
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) throw listError;

        const existingUser = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          console.log('[Setup] Found existing user:', existingUser.id);
          
          // Force update password and confirm email
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: password,
            email_confirm: true,
            user_metadata: { full_name: 'Administrator' }
          });

          if (updateError) throw updateError;
          
          // Ensure they are in admin_users table for DB access
          const { error: dbError } = await supabaseAdmin.from('admin_users').upsert({ 
            id: existingUser.id, 
            email: email 
          });

          if (dbError) throw dbError;
          
          return NextResponse.json({ 
            success: true, 
            message: 'Existing Admin user detected. Password has been reset and account confirmed! You can now log in.' 
          });
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
