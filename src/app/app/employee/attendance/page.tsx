import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import AttendanceClient from './AttendanceClient';

export default async function EmployeeAppAttendancePage() {
  const session = await getSession();
  if (!session || !session.id) redirect('/app/login');

  const { data: records } = await supabaseAdmin
    .from('attendance')
    .select('*')
    .eq('employee_id', session.id)
    .order('check_in_time', { ascending: false });

  const empRecords = (records || []).map(r => {
    const checkIn = new Date(r.check_in_time);
    const checkOut = r.check_out_time ? new Date(r.check_out_time) : null;
    let durationHours = 0;
    if (checkOut) {
      durationHours = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) * 10) / 10;
    }
    return {
      id: r.id,
      date: r.check_in_time.split('T')[0],
      check_in_raw: r.check_in_time,
      check_in: checkIn.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      check_out: checkOut ? checkOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
      duration_hours: durationHours,
      status: r.status,
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-navy-900 tracking-tight">Attendance</h1>
        <p className="text-text-secondary text-sm">Clock in and out using GPS.</p>
      </div>
      <AttendanceClient initialRecords={empRecords} />
    </div>
  );
}
