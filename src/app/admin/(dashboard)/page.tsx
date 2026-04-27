import { MessageSquare, Users, Clock, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default async function AdminDashboard() {
  const [
    { count: inquiriesCount },
    { count: activeJobsCount },
    { count: employeesCount },
    { data: recentInquiries }
  ] = await Promise.all([
    supabaseAdmin.from('inquiries').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('employees').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const stats = [
    { label: 'Total Inquiries', value: inquiriesCount || '0', icon: MessageSquare, color: 'bg-primary-50 text-primary-500', trend: 'Live' },
    { label: 'Active Jobs', value: activeJobsCount || '0', icon: Briefcase, color: 'bg-amber-50 text-amber-500', trend: 'Live' },
    { label: 'Employees', value: employeesCount || '0', icon: Users, color: 'bg-emerald-50 text-emerald-500', trend: 'Live' },
    { label: 'Attendance Today', value: '—', icon: Clock, color: 'bg-violet-50 text-violet-500', trend: 'Live tracking' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome back. Here&apos;s your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover={false} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.trend}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Inquiries Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-bold text-navy-900">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Requirement</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {(!recentInquiries || recentInquiries.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">No recent inquiries.</td>
                </tr>
              ) : (
                recentInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-navy-900">{inq.name}</p>
                      <p className="text-xs text-text-muted">{inq.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{inq.company || '—'}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                      {inq.message}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inq.status] || statusColors.new}`}>
                        {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                      {formatDate(inq.created_at)}
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
