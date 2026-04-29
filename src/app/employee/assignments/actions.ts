'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';

export async function getEmployeeAssignments() {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      jobs (
        title
      )
    `)
    .eq('assigned_to', session.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching employee assignments:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((app: any) => ({
    id: app.id,
    client_name: app.name,
    client_email: app.email,
    client_phone: app.phone,
    job_title: app.jobs?.title || 'Unknown Job',
    status: app.status,
    created_at: app.created_at,
    resume_url: app.resume_url,
  }));
}
