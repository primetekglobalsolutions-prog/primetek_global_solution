'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';

export async function getAdminAttendance() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('attendance')
    .select(`
      *,
      employees (
        name
      )
    `)
    .order('check_in_time', { ascending: false });

  if (error) {
    console.error('Error fetching admin attendance:', error);
    return [];
  }
  
  return data.map((record: any) => {
    const checkIn = new Date(record.check_in_time);
    const checkOut = record.check_out_time ? new Date(record.check_out_time) : null;
    let durationHours = 0;
    
    if (checkOut) {
      durationHours = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) * 10) / 10;
    }

    return {
      id: record.id,
      employee_id: record.employee_id,
      employee_name: record.employees?.name || 'Unknown',
      date: record.check_in_time.split('T')[0],
      check_in: checkIn.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      check_out: checkOut ? checkOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
      duration_hours: durationHours,
      status: record.status,
      lat: record.check_in_location?.lat || 0,
      lng: record.check_in_location?.lng || 0,
    };
  });
}

export async function getEmployeesList() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('id, name')
    .order('name', { ascending: true });
    
  if (error) return [];
  return data;
}
