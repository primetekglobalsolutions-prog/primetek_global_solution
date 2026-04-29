import { redirect } from 'next/navigation';
import { Clock, CalendarCheck, CalendarX, AlertTriangle, ArrowRight, TrendingUp, Briefcase, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';

export default async function EmployeeAppDashboard() {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/admin/login');
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
    .order('check_in', { ascending: false });

  const empRecords = (records || []).map(r => {
    const checkIn = new Date(r.check_in);
    const checkOut = r.check_out ? new Date(r.check_out) : null;
    let durationHours = 0;
    if (checkOut) {
      durationHours = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) * 10) / 10;
    }
    return {
      id: r.id,
      date: r.date,
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
    <div className="space-y-6 pb-10">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 shadow-2xl shadow-navy-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight">
                Hello, {firstName}!
              </h1>
              <p className="text-primary-200/80 text-sm md:text-base max-w-md leading-relaxed">
                Track your attendance and manage your assigned profiles with ease.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/employee/attendance">
                <Button size="lg" className="w-full md:w-auto bg-white text-navy-900 hover:bg-white/90 font-black shadow-xl shadow-white/5 py-4 px-8 rounded-2xl transition-all active:scale-95">
                  <Clock className="w-5 h-5 mr-2" /> 
                  {todayRecord ? 'View Status' : 'Clock In Now'}
                  <ArrowRight className="w-5 h-5 ml-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Today's Stats Card - Glassmorphism */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
  {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-[10px] text-primary-200 uppercase tracking-widest font-bold">Today's Shift</p>
                <p className="text-lg font-bold text-white">
                  {todayRecord ? todayRecord.check_in : 'Not Started'}
                  {todayRecord?.check_out && <span className="text-primary-300/60 font-medium"> → {todayRecord.check_out}</span>}
                </p>
              </div>
              {todayRecord && (
                <div className="ml-auto">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${statusColors[todayRecord.status.toLowerCase()] || 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'}`}>
                    {todayRecord.status}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-[10px] text-primary-200 uppercase tracking-widest font-bold">Average Hours</p>
                <p className="text-lg font-bold text-white">{avgHours} <span className="text-xs font-normal text-primary-300/60">/ day</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary - New Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-white rounded-3xl p-5 border border-border/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-navy-900 tracking-tight leading-none mb-1">{stat.value}</p>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent History - Activity Stream Style */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-heading font-black text-navy-900 text-xl tracking-tight">Recent Activity</h2>
            <Link href="/employee/attendance" className="text-xs font-bold text-primary-500 hover:underline">View History</Link>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-sm overflow-hidden">
            <div className="divide-y divide-border/30">
              {empRecords.length === 0 ? (
                <div className="p-10 text-center text-text-muted italic">No recent activity found.</div>
              ) : (
                empRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="p-5 flex items-center gap-5 hover:bg-surface-alt/20 transition-colors">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-surface-alt border border-border/30 shrink-0">
                      <span className="text-lg font-black text-navy-900 leading-none">
                        {!isNaN(new Date(record.date).getTime()) ? new Date(record.date).getDate() : '—'}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase font-black tracking-tighter mt-1">
                        {!isNaN(new Date(record.date).getTime()) ? new Date(record.date).toLocaleDateString('en-IN', { month: 'short' }) : '—'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-navy-900 mb-0.5">
                        {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="flex items-center gap-1 font-medium">
                          <LogIn className="w-3 h-3" /> {record.check_in}
                        </span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <LogOut className="w-3 h-3" /> {record.check_out || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-navy-900">{record.duration_hours > 0 ? `${record.duration_hours}h` : '—'}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColors[record.status?.toLowerCase()] || statusColors.present}`}>
                        {record.status || 'Present'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {/* Quick Assignments Card */}
          <div className="relative overflow-hidden bg-primary-600 rounded-[2rem] p-6 text-white shadow-xl shadow-primary-500/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Briefcase className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-heading font-black mb-2">My Work</h3>
            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
              You have active profiles assigned to you. Review and update their status.
            </p>
            <Link href="/employee/assigned-profiles">
              <Button className="w-full bg-white text-primary-600 hover:bg-primary-50 font-black rounded-2xl py-4">
                View Profiles <ArrowRight className="w-5 h-5 ml-auto" />
              </Button>
            </Link>
          </div>

          {/* Productivity Tip or Status */}
          <Card className="rounded-[2rem] border-0 bg-emerald-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-emerald-900">Pro Tip</p>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Regular clock-ins and clock-outs help in accurate salary processing and performance tracking.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
