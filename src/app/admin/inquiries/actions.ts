'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getAdminInquiries() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin inquiries:', error);
    return [];
  }
  return data;
}

export async function updateInquiryStatus(id: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating inquiry status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath('/admin/inquiries');
}

export async function deleteInquiry(id: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inquiry:', error);
    throw new Error('Failed to delete inquiry');
  }

  revalidatePath('/admin/inquiries');
}
