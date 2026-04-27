'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const departments = ['Information Technology', 'Healthcare', 'Banking & Finance', 'Manufacturing', 'Retail & E-Commerce'];

export default function NewEmployeePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    console.log('New employee:', Object.fromEntries(fd));
    await new Promise((r) => setTimeout(r, 800));
    alert('Employee created (demo)');
    router.push('/admin/employees');
  };

  const inputClasses = 'w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Add Employee</h1>
        <p className="text-text-secondary text-sm mt-1">Create a new employee record.</p>
      </div>

      <Card hover={false} className="max-w-3xl">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Full Name <span className="text-error">*</span></label>
              <input name="name" type="text" required placeholder="Rajesh Kumar" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Email <span className="text-error">*</span></label>
              <input name="email" type="email" required placeholder="rajesh@primetek.com" className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Phone</label>
              <input name="phone" type="tel" placeholder="+91 98765 10001" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Department <span className="text-error">*</span></label>
              <select name="department" required className={inputClasses}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Designation <span className="text-error">*</span></label>
              <input name="designation" type="text" required placeholder="Senior Developer" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Temporary Password <span className="text-error">*</span></label>
              <input name="password" type="text" required defaultValue="employee123" className={inputClasses} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Save className="w-4 h-4" /> Create Employee</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
