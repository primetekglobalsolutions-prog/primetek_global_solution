'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations';
import { changePassword } from '@/app/admin/profile/actions';
import Button from '@/components/ui/Button';

export default function PasswordChangeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await changePassword(data);
      setStatus('success');
      reset();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-navy-900 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary-500" />
        <h3 className="font-heading font-bold text-lg">Change Password</h3>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-sm mb-4 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <p>Password updated successfully!</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm mb-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary">Current Password</label>
          <input
            {...register('currentPassword')}
            type="password"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 font-medium">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary">New Password</label>
          <input
            {...register('newPassword')}
            type="password"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary">Confirm New Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Updating...
            </span>
          ) : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
