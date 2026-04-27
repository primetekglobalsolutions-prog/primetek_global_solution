import { MessageSquare, Users, TrendingUp, Clock, Briefcase, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';

// Demo data — replace with Supabase queries when DB is connected
const stats = [
  { label: 'Total Inquiries', value: '47', icon: MessageSquare, color: 'bg-primary-50 text-primary-500', trend: '+12%' },
  { label: 'Active Jobs', value: '10', icon: Briefcase, color: 'bg-amber-50 text-amber-500', trend: '3 departments' },
  { label: 'Employees', value: '5', icon: Users, color: 'bg-emerald-50 text-emerald-500', trend: '4 active' },
  { label: 'Attendance Today', value: '—', icon: Clock, color: 'bg-violet-50 text-violet-500', trend: 'Live tracking' },
];

const recentInquiries = [
  { id: 1, name: 'Rahul Mehra', company: 'TechVista', email: 'rahul@techvista.com', requirement: 'Need 5 React developers for a 6-month project', status: 'new', date: '2026-04-27' },
  { id: 2, name: 'Anita Rao', company: 'MedCore Healthcare', email: 'anita@medcore.com', requirement: 'Looking for healthcare IT consultants', status: 'contacted', date: '2026-04-26' },
  { id: 3, name: 'David Chen', company: 'FinServe Global', email: 'david@finserve.com', requirement: 'IT outsourcing for banking platform', status: 'qualified', date: '2026-04-25' },
  { id: 4, name: 'Priya Nair', company: 'RetailMax', email: 'priya@retailmax.com', requirement: 'UX designers and frontend developers', status: 'new', date: '2026-04-25' },
  { id: 5, name: 'James Wilson', company: 'AutoMfg Corp', email: 'james@automfg.com', requirement: 'Supply chain optimization consulting', status: 'closed', date: '2026-04-24' },
];

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminDashboard() {
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
          <a href="/admin/inquiries" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Requirement</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{inquiry.name}</p>
                      <p className="text-xs text-text-muted">{inquiry.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{inquiry.company}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">{inquiry.requirement}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inquiry.status]}`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{inquiry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
