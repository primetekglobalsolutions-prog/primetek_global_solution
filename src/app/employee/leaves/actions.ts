'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function applyForLeave(formData: {
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
}) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('leave_requests')
    .insert([{
      employee_id: session.id,
      type: formData.type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      status: 'Pending'
    }]);

  if (error) throw error;

  revalidatePath('/employee/leaves');
  return { success: true };
}

export async function getEmployeeLeaves() {
  const session = await getSession();
  if (!session || !session.id) return [];

  const { data, error } = await supabaseAdmin
    .from('leave_requests')
    .select('*')
    .eq('employee_id', session.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leaves:', error);
    return [];
  }

  return data;
}
export async function getLeaveBalances() {
  const session = await getSession();
  if (!session || !session.id) return [];

  const { data, error } = await supabaseAdmin
    .from('leave_balances')
    .select('*')
    .eq('employee_id', session.id);

  if (error) {
    console.error('Error fetching balances:', error);
    return [];
  }

  // If no balances exist, initialize them with defaults
  if (data.length === 0) {
    const defaults = [
      { employee_id: session.id, leave_type: 'Sick', total_days: 0, used_days: 0, remaining_days: 0 },
      { employee_id: session.id, leave_type: 'Casual', total_days: 0, used_days: 0, remaining_days: 0 },
      { employee_id: session.id, leave_type: 'Earned', total_days: 0, used_days: 0, remaining_days: 0 },
    ];

    const { data: newData, error: initError } = await supabaseAdmin
      .from('leave_balances')
      .insert(defaults)
      .select();

    if (initError) {
      console.error('Error initializing balances:', initError);
      return [];
    }
    return newData;
  }

  return data;
}
