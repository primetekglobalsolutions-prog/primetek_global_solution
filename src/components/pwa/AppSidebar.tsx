'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Clock, UserCircle, LogOut, 
  MessageSquare, Briefcase, Users, FileUser,
  Settings, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

interface AppSidebarProps {
  role: 'admin' | 'employee';
  userName?: string;
}

export default function AppSidebar({ role, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const adminItems = [
    { href: '/app/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/app/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { href: '/app/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/app/admin/client-profiles', icon: FileUser, label: 'Client Profiles' },
    { href: '/app/admin/employees', icon: Users, label: 'Employees' },
    { href: '/app/admin/attendance', icon: Clock, label: 'Reports' },
    { href: '/app/admin/profile', icon: UserCircle, label: 'Profile' },
    { href: '/app/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const employeeItems = [
    { href: '/app/employee/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/app/employee/attendance', icon: Clock, label: 'Attendance' },
    { href: '/app/employee/assigned-profiles', icon: FileUser, label: 'Profiles' },
    { href: '/app/employee/profile', icon: UserCircle, label: 'My Profile' },
  ];

  const navItems = role === 'admin' ? adminItems : employeeItems;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/app/login');
    router.refresh();
  };

  return (
    <>
      {/* ─── Desktop Sidebar (hidden on mobile) ─── */}
      <aside className={cn(
        'hidden md:flex flex-col bg-navy-900 text-white transition-all duration-300 h-full border-r border-white/5',
        collapsed ? 'w-[68px]' : 'w-60'
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-16">
          {!collapsed && (
            <Link href={role === 'admin' ? '/app/admin/dashboard' : '/app/employee/dashboard'} className="flex items-center gap-2.5">
              <Logo className="w-32 h-auto" dark={true} />
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-3">
          {!collapsed && userName && (
            <div className="px-3 py-2">
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-0.5">Signed in</p>
              <p className="text-xs font-medium text-gray-300 truncate">{userName}</p>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ─── Mobile Bottom Navigation Bar ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-all',
                  isActive 
                    ? 'text-primary-500' 
                    : 'text-gray-400 active:text-gray-600'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-xl transition-all',
                  isActive && 'bg-primary-50'
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  'text-[10px] leading-none font-medium',
                  isActive && 'font-bold'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Logout in bottom nav */}
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-gray-400 active:text-red-500 transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none font-medium">Exit</span>
          </button>
        </div>
      </nav>
    </>
  );
}
