'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Login failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-navy-900 mb-1.5">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="admin@primetek.com"
          {...register('email')}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-navy-900 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register('password')}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy-900 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" /> Sign In
          </>
        )}
      </Button>

      {/* Demo hint */}
      <p className="text-center text-xs text-text-muted mt-4">
        Demo: admin@primetek.com / admin123
      </p>
    </form>
  );
}
