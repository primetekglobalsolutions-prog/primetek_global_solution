'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toggleEmployeeStatus } from './actions';

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

  const filtered = employees.filter((emp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.department && emp.department.toLowerCase().includes(q))
    );
  });

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    // Optimistic UI
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    
    try {
      await toggleEmployeeStatus(id, currentStatus);
    } catch (err) {
      // Revert on fail
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: currentStatus } : e)));
      alert('Failed to update employee status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Employees</h1>
          <p className="text-text-secondary text-sm mt-1">Manage employee records.</p>
        </div>
        <Button size="sm" onClick={() => alert('Add employee functionality to be connected.')}><Plus className="w-4 h-4" /> Add Employee</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400" />
      </div>

      <Card hover={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
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
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy-900">{emp.name}</p>
                          <p className="text-xs text-text-muted">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary capitalize">{emp.role}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{emp.department || '—'}</td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{new Date(emp.join_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
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
    </div>
  );
}
