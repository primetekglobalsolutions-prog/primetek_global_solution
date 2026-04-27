'use client';

import { useState } from 'react';
import { Plus, Search, ToggleLeft, ToggleRight, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toggleEmployeeStatus, createEmployee } from './actions';

export interface EmployeeRecord {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  status: string;
  join_date: string;
  avatar_url: string | null;
}

export default function EmployeesClient({ initialEmployees }: { initialEmployees: EmployeeRecord[] }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(initialEmployees);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({ name: '', email: '', role: 'employee', department: '' });
  const [successMessage, setSuccessMessage] = useState<{ id: string; pass: string } | null>(null);

  const filtered = employees.filter((emp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.employee_id.toLowerCase().includes(q) ||
      (emp.department && emp.department.toLowerCase().includes(q))
    );
  });

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    
    try {
      await toggleEmployeeStatus(id, currentStatus);
    } catch (err) {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: currentStatus } : e)));
      alert('Failed to update employee status');
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const res = await createEmployee(newEmployeeData);
      setSuccessMessage({ id: res.employee_id, pass: res.password });
      // We don't instantly update the local state because we lack the UUID 'id' returned by DB. 
      // But revalidatePath runs, so a hard refresh or next navigation will show them.
      // For UX, we could just reload the page or fetch data again.
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload after 5 seconds to let them copy credentials
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Failed to create employee');
      } else {
        alert('Failed to create employee');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Employees</h1>
          <p className="text-text-secondary text-sm mt-1">Manage employee records.</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Add Employee</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search by ID, name, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400" />
      </div>

      <Card hover={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Emp ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">No employees found.</td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {emp.avatar_url ? (
                          <div className="relative w-9 h-9">
                            <Image src={emp.avatar_url} alt={emp.name} fill className="rounded-full object-cover" sizes="36px" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                            {emp.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-navy-900">{emp.name}</p>
                          <p className="text-xs text-text-muted">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-900">{emp.employee_id}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary capitalize">{emp.role}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{emp.department || '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggle(emp.id, emp.status)} className="flex items-center gap-1.5">
                        {emp.status === 'Active' ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                        <span className={`text-xs font-medium ${emp.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}>{emp.status}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-navy-900">Add New Employee</h3>
              <button onClick={() => { setIsModalOpen(false); setSuccessMessage(null); }} className="text-text-muted hover:text-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {successMessage ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-center space-y-3">
                  <h4 className="font-bold text-emerald-700 text-lg">Employee Created!</h4>
                  <p className="text-sm text-emerald-600">Please copy these credentials. They will not be shown again.</p>
                  <div className="bg-white p-3 rounded border border-emerald-100 mt-2 text-left space-y-1">
                    <p className="text-sm text-gray-600"><strong>Employee ID:</strong> {successMessage.id}</p>
                    <p className="text-sm text-gray-600"><strong>Initial Password:</strong> {successMessage.pass}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Page will reload automatically in a few seconds...</p>
                </div>
              ) : (
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-1">Full Name</label>
                    <input required type="text" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-1">Email Address</label>
                    <input required type="email" value={newEmployeeData.email} onChange={(e) => setNewEmployeeData({...newEmployeeData, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Role</label>
                      <select value={newEmployeeData.role} onChange={(e) => setNewEmployeeData({...newEmployeeData, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-400 focus:outline-none bg-white">
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Department</label>
                      <input required type="text" placeholder="e.g. Engineering" value={newEmployeeData.department} onChange={(e) => setNewEmployeeData({...newEmployeeData, department: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Employee
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
