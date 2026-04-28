'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

import { calculateDistance } from '@/lib/utils';

const OFFICE_LAT = 17.3850;
const OFFICE_LNG = 78.4867;
const MAX_RADIUS_METERS = 500;

export async function checkIn(lat: number, lng: number) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  // 1. GPS Validation
  const distance = calculateDistance(lat, lng, OFFICE_LAT, OFFICE_LNG);
  if (distance > MAX_RADIUS_METERS) {
    throw new Error(`Out of office radius. You are ${Math.round(distance)}m away from office.`);
  }

  // 2. Check for existing record today (using local date string to avoid timezone shifts)
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const { data: existing } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('employee_id', session.id)
    .gte('check_in_time', `${todayStr}T00:00:00Z`)
    .lte('check_in_time', `${todayStr}T23:59:59Z`)
    .maybeSingle();

  if (existing) {
    throw new Error('Already checked in today');
  }

  const today = new Date();
  const { error } = await supabaseAdmin
    .from('attendance')
    .insert({
      employee_id: session.id,
      check_in_time: today.toISOString(),
      check_in_location: { lat, lng },
      status: today.getHours() >= 10 ? 'late' : 'present',
    });

  if (error) {
    console.error('Check-in error:', error);
    throw new Error('Failed to check in');
  }

  revalidatePath('/app/employee/attendance');
  revalidatePath('/app/employee/dashboard');
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
  return { success: true };
}
