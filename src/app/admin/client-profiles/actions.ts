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

export async function createProfile(formData: any) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('application_profiles')
    .insert([formData]);

  if (error) throw error;
  revalidatePath('/admin/client-profiles');
  return { success: true };
}

export async function updateProfile(id: string, formData: any) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('application_profiles')
    .update(formData)
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/admin/client-profiles');
  return { success: true };
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
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const file = formData.get('resume') as File | null;
  if (!file) throw new Error('No file provided');

  if (file.size > 1 * 1024 * 1024) throw new Error('Resume must be under 1MB');
  if (!file.name.toLowerCase().endsWith('.docx') && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    throw new Error('Only DOCX format is supported');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `client-${Date.now()}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data: uploadData, error: uploadError } = await supabaseAdmin
    .storage
    .from('resumes')
    .upload(fileName, buffer, {
      contentType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      upsert: true
    });

  if (uploadError) {
    console.error('Resume upload error:', uploadError);
    throw new Error('Failed to upload resume');
  }

  const { data: { publicUrl } } = supabaseAdmin
    .storage
    .from('resumes')
    .getPublicUrl(uploadData.path);

  return { success: true, url: publicUrl };
}
