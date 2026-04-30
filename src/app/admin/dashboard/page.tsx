import { MessageSquare, Users, Clock, Briefcase, Plus, Settings, ArrowRight, CheckSquare } from 'lucide-react';
import Card from '@/components/ui/Card';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

export default async function AdminAppDashboard() {
  const [
    { count: inquiriesCount },
    { count: activeJobsCount },
    { count: employeesCount },
    { count: pendingLeavesCount },
    { count: pendingWFHCount },
    { data: recentInquiries }
  ] = await Promise.all([
    supabaseAdmin.from('inquiries').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('employees').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabaseAdmin.from('attendance').select('*', { count: 'exact', head: true }).eq('status', 'Pending WFH'),
    supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const totalPending = (pendingLeavesCount || 0) + (pendingWFHCount || 0);

  const stats = [
    { label: 'Inquiries', value: inquiriesCount || '0', icon: MessageSquare, color: 'text-primary-500', bg: 'bg-primary-50' },
    { label: 'Jobs', value: activeJobsCount || '0', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Staff', value: employeesCount || '0', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Approvals', value: totalPending.toString(), icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  const quickActions = [
    { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare, desc: 'Manage requests' },
    { href: '/admin/employees', label: 'Manage Staff', icon: Users, desc: 'Employee directory' },
    { href: '/admin/attendance', label: 'Attendance', icon: Clock, desc: 'View reports' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, desc: 'System config' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    contacted: 'bg-amber-50 text-amber-600 border-amber-200',
    qualified: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    closed: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  return (
    <div className="space-y-5">
      {/* Stats — compact 4-col */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-3 md:p-4 text-center border border-border/50 shadow-sm">
            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-lg md:text-2xl font-bold text-navy-900 leading-none">{stat.value}</p>
            <p className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts 
        attendanceData={[
          { label: 'Mon', value: 85 },
          { label: 'Tue', value: 92 },
          { label: 'Wed', value: 88 },
          { label: 'Thu', value: 95 },
          { label: 'Fri', value: 82 },
          { label: 'Sat', value: 45 },
          { label: 'Sun', value: 30 },
        ]}
        applicationData={[
          { label: 'Wk 1', value: 12 },
          { label: 'Wk 2', value: 18 },
          { label: 'Wk 3', value: 15 },
          { label: 'Wk 4', value: 24 },
        ]}
      />

      {/* Quick Actions — mobile-optimized grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm active:bg-surface-alt/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-navy-900" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-active:text-primary-500 transition-colors" />
              </div>
              <p className="text-sm font-bold text-navy-900 leading-tight">{action.label}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries — touch-friendly list */}
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-heading font-bold text-navy-900 text-sm">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
            All
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recentInquiries?.map((inq) => (
            <div key={inq.id} className="px-4 py-3.5 active:bg-surface-alt/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-navy-900 truncate mr-2">{inq.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${statusColors[inq.status] || statusColors.new}`}>
                  {inq.status?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-secondary truncate mb-1">{inq.message}</p>
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                {inq.company && <span>{inq.company}</span>}
                {inq.company && <span>•</span>}
                <span>{formatDate(inq.created_at)}</span>
              </div>
            </div>
          ))}
          {(!recentInquiries || recentInquiries.length === 0) && (
            <div className="px-4 py-10 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-text-muted">No inquiries yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
