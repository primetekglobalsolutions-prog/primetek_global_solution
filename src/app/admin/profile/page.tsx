import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import Card from '@/components/ui/Card';
import { User, Mail, Shield } from 'lucide-react';

export default async function AdminProfilePage() {
  const session = await getSession();
  
  if (!session || !session.id || session.role !== 'admin') {
    redirect('/admin/login');
  }

  // Admin user data comes from the session/JWT which gets populated by Supabase Auth metadata
  const admin = {
    name: session.name || 'Administrator',
    email: session.email || 'admin@primetek.com',
    role: session.role
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900 tracking-tight">Admin Profile</h1>
        <p className="text-text-secondary text-sm">Manage your account and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <Card hover={false} className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-navy-900">Account Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Full Name</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-alt border border-border">
                <User className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium text-navy-900">{admin.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Email Address</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-alt border border-border">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium text-navy-900">{admin.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Role</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100">
                <Shield className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wide">{admin.role}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Password Change */}
        <Card hover={false} className="p-6 md:p-8">
          <PasswordChangeForm />
        </Card>
      </div>
    </div>
  );
}
