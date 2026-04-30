'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(name: string, phone: string) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .update({ name, phone })
    .eq('id', session.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }

  revalidatePath('/employee/profile');
  revalidatePath('/employee/dashboard');
  return { success: true, employee: data };
}

export async function updateAvatar(formData: FormData) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const file = formData.get('avatar') as File | null;
  if (!file) throw new Error('No file provided');

  if (file.size > 2 * 1024 * 1024) throw new Error('Avatar must be under 2MB');
  if (!file.type.startsWith('image/')) throw new Error('Avatar must be an image');

  const fileExt = file.name.split('.').pop();
  const fileName = `${session.id}-${Date.now()}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to avatars bucket
  const { data: uploadData, error: uploadError } = await supabaseAdmin
    .storage
    .from('avatars')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true
    });

  if (uploadError) {
    console.error('Avatar upload error:', uploadError);
    throw new Error('Failed to upload avatar');
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin
    .storage
    .from('avatars')
    .getPublicUrl(uploadData.path);

  // Update employee record
  const { error: dbError } = await supabaseAdmin
    .from('employees')
    .update({ avatar_url: publicUrl })
    .eq('id', session.id);

  if (dbError) {
    console.error('Avatar DB update error:', dbError);
    throw new Error('Failed to save avatar URL');
  }

  revalidatePath('/employee/profile');
  revalidatePath('/employee/profile');
  return { success: true, avatarUrl: publicUrl };
}
