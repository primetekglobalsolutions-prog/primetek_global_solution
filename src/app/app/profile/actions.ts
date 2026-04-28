'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function changePassword(formData: any) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const validated = changePasswordSchema.parse(formData);

  if (session.role === 'admin') {
    // Admin uses native Supabase Auth
    const supabase = await createClient();
    
    // First, verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.email,
      password: validated.currentPassword,
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: validated.newPassword
    });

    if (updateError) {
      console.error('Admin password update error:', updateError);
      throw new Error('Failed to update password');
    }

    return { success: true };
  } else {
    // Employees use the custom employees table
    // 1. Get current password hash
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('employees')
      .select('password_hash')
      .eq('id', session.id)
      .single();

    if (fetchError || !user) {
      throw new Error('User not found');
    }

    // 2. Verify current password
    const isValid = await bcrypt.compare(validated.currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(validated.newPassword, salt);

    // 4. Update password
    const { error: updateError } = await supabaseAdmin
      .from('employees')
      .update({ password_hash: newHash })
      .eq('id', session.id);

    if (updateError) {
      console.error('Password update error:', updateError);
      throw new Error('Failed to update password');
    }

    return { success: true };
  }
}
