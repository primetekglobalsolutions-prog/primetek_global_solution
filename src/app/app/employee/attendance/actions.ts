'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function checkIn(lat: number, lng: number) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const today = new Date();
  const { data: existing } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('employee_id', session.id)
    .gte('check_in_time', `${today.toISOString().split('T')[0]}T00:00:00Z`)
    .lte('check_in_time', `${today.toISOString().split('T')[0]}T23:59:59Z`)
    .maybeSingle();

  if (existing) {
    throw new Error('Already checked in today');
  }

  const { error } = await supabaseAdmin
    .from('attendance')
    .insert({
      employee_id: session.id,
      check_in_time: new Date().toISOString(),
      check_in_location: { lat, lng },
      status: today.getHours() >= 10 ? 'late' : 'present',
    });

  if (error) {
    console.error('Check-in error:', error);
    throw new Error('Failed to check in');
  }

  revalidatePath('/app/employee/attendance');
  revalidatePath('/app/employee/dashboard');
  revalidatePath('/employee/attendance');
  revalidatePath('/employee');
  return { success: true };
}

export async function checkOut(recordId: string, lat: number, lng: number) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('attendance')
    .update({
      check_out_time: new Date().toISOString(),
      check_out_location: { lat, lng },
    })
    .eq('id', recordId)
    .eq('employee_id', session.id);

  if (error) {
    console.error('Check-out error:', error);
    throw new Error('Failed to check out');
  }

  revalidatePath('/app/employee/attendance');
  revalidatePath('/app/employee/dashboard');
  revalidatePath('/employee/attendance');
  revalidatePath('/employee');
  return { success: true };
}
