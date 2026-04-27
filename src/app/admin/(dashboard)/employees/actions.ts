'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getAdminEmployees() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin employees:', error);
    return [];
  }
  return data;
}

export async function toggleEmployeeStatus(id: string, currentStatus: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  const { error } = await supabaseAdmin
    .from('employees')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error toggling employee status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath('/admin/employees');
}
