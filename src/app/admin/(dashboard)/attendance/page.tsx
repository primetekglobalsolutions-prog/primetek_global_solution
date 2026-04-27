import { getAdminAttendance, getEmployeesList } from './actions';
import AttendanceClient from './AttendanceClient';

export default async function AdminAttendancePage() {
  const [attendance, employees] = await Promise.all([
    getAdminAttendance(),
    getEmployeesList()
  ]);

  return <AttendanceClient initialAttendance={attendance || []} employees={employees || []} />;
}
