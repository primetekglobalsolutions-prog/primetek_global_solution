'use client';

import { useState, useRef } from 'react';
import { Save, Loader2, CheckCircle2, Camera } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { updateProfile, updateAvatar } from './actions';

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  avatar_url?: string;
  created_at?: string;
}

export default function ProfileClient({ employee }: { employee: EmployeeProfile }) {
  const [form, setForm] = useState({
    name: employee.name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    department: employee.department || '',
    designation: employee.designation || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(employee.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form.name, form.phone);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File must be under 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const res = await updateAvatar(formData);
      if (res.success) {
        setCurrentAvatarUrl(res.avatarUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const inputClasses = 'w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-navy-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <Card hover={false} className="p-8 text-center">
          <div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 relative group cursor-pointer overflow-hidden ring-4 ring-white shadow-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              employee.name ? employee.name.split(' ').map((n: string) => n[0]).join('') : 'U'
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {avatarUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </div>
          <h2 className="text-lg font-heading font-bold text-navy-900">{employee.name}</h2>
          <p className="text-sm text-text-secondary">{employee.designation}</p>
          <p className="text-xs text-text-muted mt-1">{employee.department}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-muted">Employee ID</p>
            <p className="text-sm font-mono font-medium text-navy-900">{employee.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div className="mt-3">
            <p className="text-xs text-text-muted">Joined</p>
            <p className="text-sm font-medium text-navy-900">{employee.created_at ? new Date(employee.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
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
