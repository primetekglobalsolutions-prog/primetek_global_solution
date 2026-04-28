import { getAdminEmployees } from './actions';
import EmployeesClient from './EmployeesClient';

export default async function AdminAppEmployeesPage() {
  const employees = await getAdminEmployees();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-navy-900 tracking-tight">Staff Directory</h1>
        <p className="text-text-secondary text-sm">Manage employees and their status.</p>
      </div>
      <EmployeesClient initialEmployees={employees || []} />
    </div>
  );
}
