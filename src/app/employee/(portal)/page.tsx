'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Clock, CalendarCheck, CalendarX, AlertTriangle, ArrowRight } from 'lucide-react';
import { demoAttendance } from '@/lib/demo-data';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function EmployeeDashboard() {
  // Demo: use emp-001's data
  const empId = 'emp-001';
  const empRecords = useMemo(() => demoAttendance.filter((r) => r.employee_id === empId), []);
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = empRecords.find((r) => r.date === today);

  const currentMonth = new Date().getMonth();
  const monthRecords = empRecords.filter((r) => new Date(r.date).getMonth() === currentMonth);
  const present = monthRecords.filter((r) => r.status === 'present').length;
  const late = monthRecords.filter((r) => r.status === 'late').length;
  const absent = monthRecords.filter((r) => r.status === 'absent').length;

  const recentRecords = empRecords.slice(0, 7);

  const stats = [
    { label: 'Days Present', value: String(present), icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-500' },
    { label: 'Late Arrivals', value: String(late), icon: AlertTriangle, color: 'bg-amber-50 text-amber-500' },
    { label: 'Days Absent', value: String(absent), icon: CalendarX, color: 'bg-red-50 text-red-500' },
    { label: 'Avg Hours', value: monthRecords.filter((r) => r.duration_hours > 0).length > 0 ? (monthRecords.reduce((sum, r) => sum + r.duration_hours, 0) / monthRecords.filter((r) => r.duration_hours > 0).length).toFixed(1) : '—', icon: Clock, color: 'bg-primary-50 text-primary-500' },
  ];

  const statusColors: Record<string, string> = {
    present: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    late: 'bg-amber-50 text-amber-600 border-amber-200',
    absent: 'bg-red-50 text-red-600 border-red-200',
    'half-day': 'bg-blue-50 text-blue-600 border-blue-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Welcome back, Rajesh.</p>
        </div>
        <Link href="/employee/attendance">
          <Button size="sm">
            <Clock className="w-4 h-4" /> {todayRecord ? 'View Attendance' : 'Check In'} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Today Status */}
      <Card hover={false} className="p-5 border-l-4 border-l-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Today&apos;s Status</p>
            {todayRecord ? (
              <>
                <p className="text-lg font-bold text-navy-900">
                  Checked in at {todayRecord.check_in}
                  {todayRecord.check_out && ` — Out at ${todayRecord.check_out}`}
                </p>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[todayRecord.status]}`}>
                  {todayRecord.status.charAt(0).toUpperCase() + todayRecord.status.slice(1)}
                </span>
              </>
            ) : (
              <p className="text-lg font-bold text-text-muted">Not checked in yet</p>
            )}
          </div>
        </div>
      </Card>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover={false} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent History */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-bold text-navy-900">Recent Attendance</h2>
          <Link href="/employee/attendance" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check In</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check Out</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Hours</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-navy-900 font-medium">{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.check_in || '—'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.check_out || '—'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.duration_hours > 0 ? `${record.duration_hours}h` : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[record.status]}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
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
