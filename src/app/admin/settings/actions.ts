'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getOfficeLocation() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('office_locations')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching office location:', error);
    return null;
  }
  return data;
}

export async function saveOfficeLocation(data: {
  name: string;
  lat: number;
  lng: number;
  radius_meters: number;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  // Deactivate existing locations
  await supabaseAdmin
    .from('office_locations')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy to match all

  // Insert or update
  const { error } = await supabaseAdmin
    .from('office_locations')
    .insert({
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      radius_meters: data.radius_meters,
      is_active: true
    });

  if (error) {
    console.error('Error saving office location:', error);
    throw new Error('Failed to save office location');
  }

  revalidatePath('/admin/settings');
  revalidatePath('/employee/attendance');
}
