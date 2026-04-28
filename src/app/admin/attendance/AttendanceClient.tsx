'use client';

import { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  duration_hours: number;
  status: string;
  lat: number;
  lng: number;
}

const statusColors: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  late: 'bg-amber-50 text-amber-600 border-amber-200',
  absent: 'bg-red-50 text-red-600 border-red-200',
  'half-day': 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function AttendanceClient({
  initialAttendance,
  employees
}: {
  initialAttendance: AttendanceRecord[],
  employees: { id: string, name: string }[]
}) {
  const [search, setSearch] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return initialAttendance.filter((r) => {
      const matchesSearch = !search || r.employee_name.toLowerCase().includes(search.toLowerCase());
      const matchesEmployee = employeeFilter === 'all' || r.employee_id === employeeFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesEmployee && matchesStatus;
    });
  }, [initialAttendance, search, employeeFilter, statusFilter]);

  const exportCsv = () => {
    const headers = 'Employee,Date,Check In,Check Out,Hours,Status,Latitude,Longitude';
    const rows = filtered.map((r) =>
      `"${r.employee_name}","${r.date}","${r.check_in || ''}","${r.check_out || ''}",${r.duration_hours},"${r.status}",${r.lat},${r.lng}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `primetek-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option value="all">All Employees</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <Button size="sm" variant="outline" onClick={exportCsv} className="w-full sm:w-auto">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-navy-900">{filtered.length}</span> records
      </p>

      {/* Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check In</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check Out</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Hours</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted text-sm">No attendance records found.</td></tr>
              ) : (
                filtered.slice(0, 30).map((record) => (
                  <tr key={record.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-navy-900">{record.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{record.check_in || '—'}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{record.check_out || '—'}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{record.duration_hours > 0 ? `${record.duration_hours}h` : '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[record.status.toLowerCase()] || statusColors.present}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
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
