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
  if (!session || !session.id) {
    console.error('Check-in failed: Unauthorized session');
    throw new Error('Unauthorized');
  }

  console.log(`Employee ${session.id} attempting check-in at ${lat}, ${lng}`);

  // 1. Get Office Location
  const { data: office, error: officeError } = await supabaseAdmin
    .from('office_locations')
    .select('name, lat, lng, radius_meters')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (officeError) {
    console.error('Error fetching office location:', officeError);
  }

  const officeLat = office?.lat || 17.3850;
  const officeLng = office?.lng || 78.4867;
  const radius = office?.radius_meters || 500;
  const officeName = office?.name || 'Default (Hyderabad)';

  console.log(`Validating against office: ${officeName} (Radius: ${radius}m)`);

  // 2. GPS Validation
  const distance = calculateDistance(lat, lng, Number(officeLat), Number(officeLng));
  console.log(`Calculated distance: ${Math.round(distance)}m`);

  if (distance > radius) {
    const errorMsg = `Out of office radius. You are ${Math.round(distance)}m away from ${officeName}. Required: within ${radius}m.`;
    console.warn(`Check-in rejected: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // 3. Check for existing record today (using IST date)
  const istNow = getISTDate();
  const todayStr = istNow.toISOString().split('T')[0];
  console.log(`Checking attendance for date: ${todayStr}`);

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('employee_id', session.id)
    .eq('date', todayStr)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing attendance:', existingError);
  }

  if (existing) {
    console.warn(`Employee ${session.id} already checked in for ${todayStr}`);
    throw new Error('Already checked in today');
  }

  // 4. Determine Status (Late after 9:30 AM IST)
  const hours = istNow.getUTCHours();
  const minutes = istNow.getUTCMinutes();
  const isLate = hours > 9 || (hours === 9 && minutes > 30);
  console.log(`Status determination: ${isLate ? 'Late' : 'Present'} (IST Time: ${hours}:${minutes})`);

  const { error: insertError } = await supabaseAdmin
    .from('attendance')
    .insert({
      employee_id: session.id,
      date: todayStr,
      check_in: new Date().toISOString(),
      lat: lat,
      lng: lng,
      status: isLate ? 'Late' : 'Present',
    });

  if (insertError) {
    console.error('Database error during check-in:', insertError);
    throw new Error(`Failed to record check-in: ${insertError.message}`);
  }

  console.log(`Successfully checked in employee ${session.id}`);

  revalidatePath('/employee/attendance');
  revalidatePath('/employee/dashboard');
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

  revalidatePath('/employee/attendance');
  revalidatePath('/employee/dashboard');
  return { success: true };
}
