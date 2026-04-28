import { redirect } from 'next/navigation';
import { Clock, CalendarCheck, CalendarX, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';

export default async function EmployeeAppDashboard() {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/app/login');
  }

  const { data: employee } = await supabaseAdmin
    .from('employees')
    .select('name')
    .eq('id', session.id)
    .single();

  const { data: records } = await supabaseAdmin
    .from('attendance')
    .select('*')
    .eq('employee_id', session.id)
    .order('check_in_time', { ascending: false });

  const empRecords = (records || []).map(r => {
    const checkIn = new Date(r.check_in_time);
    const checkOut = r.check_out_time ? new Date(r.check_out_time) : null;
    let durationHours = 0;
    if (checkOut) {
      durationHours = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) * 10) / 10;
    }
    return {
      id: r.id,
      date: r.check_in_time.split('T')[0],
      check_in: checkIn.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      check_out: checkOut ? checkOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
      duration_hours: durationHours,
      status: r.status,
    };
  });

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = empRecords.find((r) => r.date === today);

  const monthRecords = empRecords.filter(r => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const present = monthRecords.filter(r => r.status.toLowerCase() === 'present').length;
  const late = monthRecords.filter(r => r.status.toLowerCase() === 'late').length;
  const absent = monthRecords.filter(r => r.status.toLowerCase() === 'absent').length;
  const avgHours = monthRecords.filter(r => r.duration_hours > 0).length > 0
    ? (monthRecords.reduce((s, r) => s + r.duration_hours, 0) / monthRecords.filter(r => r.duration_hours > 0).length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Present', value: String(present), icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Late', value: String(late), icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Absent', value: String(absent), icon: CalendarX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Avg Hrs', value: avgHours, icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50' },
  ];

  const statusColors: Record<string, string> = {
    present: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    late: 'bg-amber-50 text-amber-600 border-amber-200',
    absent: 'bg-red-50 text-red-600 border-red-200',
  };

  const firstName = employee?.name?.split(' ')[0] || 'Employee';

  return (
    <div className="space-y-5">
      {/* Hero CTA — mobile-first card */}
      <Card className="p-0 overflow-hidden border-0 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 text-white">
        <div className="p-5 md:p-6">
          <p className="text-primary-300 text-xs font-bold uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-xl md:text-2xl font-heading font-bold mb-4 leading-tight">
            {firstName}&apos;s Dashboard
          </h1>
          
          {/* Today's Status Inline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            {todayRecord ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold mb-1">Today</p>
                  <p className="text-sm font-bold">
                    In: {todayRecord.check_in}
                    {todayRecord.check_out && <span className="text-gray-300"> → Out: {todayRecord.check_out}</span>}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[todayRecord.status.toLowerCase()] || statusColors.present}`}>
                  {todayRecord.status.toUpperCase()}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-300 italic">You haven&apos;t checked in yet today.</p>
            )}
          </div>

          <Link href="/app/employee/attendance" className="block">
            <Button className="w-full bg-white text-navy-900 hover:bg-gray-100 font-bold shadow-lg py-3 h-auto text-sm">
              <Clock className="w-4 h-4 mr-2" /> 
              {todayRecord ? 'View Attendance' : 'Clock In Now'}
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stats — 2x2 grid, compact on mobile */}
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

      {/* Recent Activity — optimized for touch */}
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-heading font-bold text-navy-900 text-sm">Recent History</h2>
          {empRecords.length > 5 && (
            <Link href="/app/employee/attendance" className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
              All
            </Link>
          )}
        </div>
        <div className="divide-y divide-border/50">
          {empRecords.slice(0, 5).map((record) => (
            <div key={record.id} className="px-4 py-3.5 flex items-center gap-3 active:bg-surface-alt/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-alt flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-bold text-navy-900 leading-none">
                  {new Date(record.date).getDate()}
                </span>
                <span className="text-[8px] text-text-muted uppercase font-bold leading-none mt-0.5">
                  {new Date(record.date).toLocaleDateString('en-IN', { month: 'short' })}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900">
                  {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {record.check_in} → {record.check_out || 'Active'}
                  {record.duration_hours > 0 && <span className="ml-1.5 text-text-secondary">• {record.duration_hours}h</span>}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${statusColors[record.status.toLowerCase()] || statusColors.present}`}>
                {record.status.toUpperCase()}
              </span>
            </div>
          ))}
          {empRecords.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-text-muted">No attendance records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
