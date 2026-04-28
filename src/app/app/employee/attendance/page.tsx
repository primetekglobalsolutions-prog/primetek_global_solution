import AttendanceClient from '@/components/employee/AttendanceClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EmployeeAppAttendancePage() {
  const session = await getSession();
  if (!session) redirect('/app/login');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900 tracking-tight">Attendance Tracking</h1>
        <p className="text-text-secondary text-sm">Clock in and out using your GPS location.</p>
      </div>
      <AttendanceClient employeeId={session.id} />
    </div>
  );
}
