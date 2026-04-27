'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { demoEmployees } from '@/lib/demo-data';
import type { Employee } from '@/lib/demo-data';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [search, setSearch] = useState('');

  const filtered = employees.filter((emp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return emp.name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q) || emp.department.toLowerCase().includes(q);
  });

  const toggleActive = (id: string) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, is_active: !e.is_active } : e)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Employees</h1>
          <p className="text-text-secondary text-sm mt-1">Manage employee records.</p>
        </div>
        <Link href="/admin/employees/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Add Employee</Button>
        </Link>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Designation</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
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
                  <td className="px-6 py-4 text-sm text-text-secondary">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{emp.designation}</td>
                  <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{new Date(emp.joined_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(emp.id)} className="flex items-center gap-1.5">
                      {emp.is_active ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                      <span className={`text-xs font-medium ${emp.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>{emp.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
