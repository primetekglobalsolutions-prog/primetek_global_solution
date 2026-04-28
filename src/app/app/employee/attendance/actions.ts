'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

import { calculateDistance } from '@/lib/utils';

// No constants needed here as they are fetched from DB or helper

// Helper to get current IST time
function getISTDate() {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(now.getTime() + offset);
}

export async function checkIn(lat: number, lng: number) {
  const session = await getSession();
  if (!session || !session.id) throw new Error('Unauthorized');

  // 1. Get Office Location (Default to Hyderabad if none active)
  const { data: office } = await supabaseAdmin
    .from('office_locations')
    .select('lat, lng, radius_meters')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  const officeLat = office?.lat || 17.3850;
  const officeLng = office?.lng || 78.4867;
  const radius = office?.radius_meters || 500;

  // 2. GPS Validation
  const distance = calculateDistance(lat, lng, Number(officeLat), Number(officeLng));
  if (distance > radius) {
    throw new Error(`Out of office radius. You are ${Math.round(distance)}m away from the office.`);
  }

  // 3. Check for existing record today (using IST date)
  const istNow = getISTDate();
  const todayStr = istNow.toISOString().split('T')[0]; // YYYY-MM-DD in IST

  const { data: existing } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('employee_id', session.id)
    .eq('date', todayStr)
    .maybeSingle();

  if (existing) {
    throw new Error('Already checked in today');
  }

  // 4. Determine Status (Late after 9:30 AM IST)
  // Get time part in IST
  const hours = istNow.getUTCHours();
  const minutes = istNow.getUTCMinutes();
  const isLate = hours > 9 || (hours === 9 && minutes > 30);

  const { error } = await supabaseAdmin
    .from('attendance')
    .insert({
      employee_id: session.id,
      date: todayStr,
      check_in: new Date().toISOString(), // Actual UTC timestamp for Supabase
      lat: lat,
      lng: lng,
      status: isLate ? 'Late' : 'Present',
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
      check_out: new Date().toISOString(),
      lat: lat,
      lng: lng,
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
