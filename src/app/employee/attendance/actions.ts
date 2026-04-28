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
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: 'Unauthorized' };
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

    const officeLat = Number(office?.lat || 17.3850);
    const officeLng = Number(office?.lng || 78.4867);
    const radius = Number(office?.radius_meters || 500);
    const officeName = office?.name || 'Default (Hyderabad)';

    // 2. GPS Validation
    const distance = calculateDistance(lat, lng, officeLat, officeLng);
    
    if (distance > radius) {
      return { 
        success: false, 
        error: `Out of office radius. You are ${Math.round(distance)}m away from ${officeName}.` 
      };
    }

    // 3. Check for existing record today (using IST date)
    const istNow = getISTDate();
    const todayStr = istNow.toISOString().split('T')[0];

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('attendance')
      .select('id')
      .eq('employee_id', session.id)
      .eq('date', todayStr)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Already checked in today' };
    }

    // 4. Determine Status
    const hours = istNow.getUTCHours();
    const minutes = istNow.getUTCMinutes();
    const isLate = hours > 9 || (hours === 9 && minutes > 30);

    const { error: insertError } = await supabaseAdmin
      .from('attendance')
      .insert([{
        employee_id: session.id,
        date: todayStr,
        check_in: new Date().toISOString(),
        lat: Number(lat),
        lng: Number(lng),
        status: isLate ? 'Late' : 'Present',
      }]);

    if (insertError) {
      console.error('Database error during check-in:', insertError);
      return { success: false, error: `Failed to record check-in: ${insertError.message}` };
    }

    revalidatePath('/employee/attendance');
    revalidatePath('/employee/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Check-in system error:', err);
    return { success: false, error: err.message || 'Internal server error' };
  }
}

export async function checkOut(recordId: string, lat: number, lng: number) {
  try {
    const session = await getSession();
    if (!session || !session.id) return { success: false, error: 'Unauthorized' };

    const { error } = await supabaseAdmin
      .from('attendance')
      .update({
        check_out: new Date().toISOString(),
        lat: Number(lat),
        lng: Number(lng),
      })
      .eq('id', recordId)
      .eq('employee_id', session.id);

    if (error) {
      console.error('Check-out error:', error);
      return { success: false, error: 'Failed to check out' };
    }

    revalidatePath('/employee/attendance');
    revalidatePath('/employee/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Internal server error' };
  }
}
