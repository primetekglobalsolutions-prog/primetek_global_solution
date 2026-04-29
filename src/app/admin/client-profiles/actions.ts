'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAllProfiles() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('application_profiles')
    .select(`
      *,
      assigned_employee:employees(id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProfile(formData: any) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    const { error } = await supabaseAdmin
      .from('application_profiles')
      .insert([formData]);

    if (error) {
      console.error('Create Profile Error:', error);
      return { error: error.message || 'Database error occurred' };
    }
    
    revalidatePath('/admin/client-profiles');
   
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Internal server error' };
  }
   
}

export async function updateProfile(id: string, formData: any) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    const { error } = await supabaseAdmin
      .from('application_profiles')
      .update(formData)
      .eq('id', id);

    if (error) {
      console.error('Update Profile Error:', error);
      return { error: error.message || 'Database error occurred' };
    }
   

    revalidatePath('/admin/client-profiles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Internal server error' };
  }
}

export async function deleteProfile(id: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('application_profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/admin/client-profiles');
  return { success: true };
}

export async function getAllEmployees() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('id, name')
    .eq('status', 'Active');

  if (error) throw error;
  return data;
}

export async function uploadClientResume(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    const file = formData.get('resume') as File | null;
    if (!file) return { error: 'No file provided' };

    if (file.size > 1 * 1024 * 1024) return { error: 'Resume must be under 1MB' };
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'docx') return { error: 'Only DOCX format is supported' };

    const fileName = `client-${Date.now()}.docx`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('resumes')
      .upload(fileName, buffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      return { error: uploadError.message || 'Failed to upload to storage' };
    }

    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from('resumes')
      .createSignedUrl(uploadData.path, 315360000); // 10 years
   

    if (signedError) return { error: 'Failed to generate secure link' };

    return { success: true, url: signedData.signedUrl };
  } catch (err: any) {
    console.error('Server Action Crash:', err);
    return { error: err.message || 'Internal server error' };
  }
}
