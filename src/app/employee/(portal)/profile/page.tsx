'use client';

import { useState } from 'react';
import { Save, UserCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { demoEmployees } from '@/lib/demo-data';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const employee = demoEmployees[0]; // Demo: emp-001
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000)); // Demo delay
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClasses = 'w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-navy-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <Card hover={false} className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {employee.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <h2 className="text-lg font-heading font-bold text-navy-900">{employee.name}</h2>
          <p className="text-sm text-text-secondary">{employee.designation}</p>
          <p className="text-xs text-text-muted mt-1">{employee.department}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-muted">Employee ID</p>
            <p className="text-sm font-mono font-medium text-navy-900">{employee.id.toUpperCase()}</p>
          </div>
          <div className="mt-3">
            <p className="text-xs text-text-muted">Joined</p>
            <p className="text-sm font-medium text-navy-900">{new Date(employee.joined_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </Card>

        {/* Edit Form */}
        <Card hover={false} className="lg:col-span-2 p-6 md:p-8">
          <h2 className="font-heading font-bold text-navy-900 mb-6">Edit Profile</h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Email</label>
                <input type="email" value={form.email} disabled className={`${inputClasses} bg-surface-alt cursor-not-allowed`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Department</label>
                <input type="text" value={form.department} disabled className={`${inputClasses} bg-surface-alt cursor-not-allowed`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Designation</label>
              <input type="text" value={form.designation} disabled className={`${inputClasses} bg-surface-alt cursor-not-allowed`} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
