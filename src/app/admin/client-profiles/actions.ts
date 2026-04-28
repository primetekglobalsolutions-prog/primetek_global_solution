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
