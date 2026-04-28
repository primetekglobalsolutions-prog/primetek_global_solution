'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAssignedProfiles() {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('application_profiles')
    .select('*')
    .eq('assigned_to', session.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateProfileStatus(id: string, status: string) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('application_profiles')
    .update({ status })
    .eq('id', id)
    .eq('assigned_to', session.id);

  if (error) throw error;
  revalidatePath('/app/employee/assigned-profiles');
  return { success: true };
}
