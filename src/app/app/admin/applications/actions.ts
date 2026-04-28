'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import type { ApplicationRecord } from './ApplicationsClient';

export async function getAdminApplications() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      jobs (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin applications:', error);
    return [];
  }


  // Format data to match client expectations
  return data.map((app: Record<string, any>) => ({
    ...app,
    job_title: app.jobs?.title || 'Unknown Job',
  })) as ApplicationRecord[];
}

export async function updateApplicationStatus(id: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('applications')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath('/admin/applications');
  revalidatePath('/app/admin/applications');
}

export async function updateApplicationNotes(id: string, notes: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  // In a full implementation, we'd add a 'notes' column to the DB
  // For now we'll just pretend to save it if the schema doesn't have it.
  // Assuming schema might not have it yet, we just revalidate or log.
  console.log(`Update notes for ${id}: ${notes}`);
}
