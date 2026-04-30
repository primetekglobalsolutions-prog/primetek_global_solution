'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

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
        setError(result.error || 'Invalid credentials. Please check your email and password.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Email Address
        </label>
        <div className="relative group">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="name@primetek.com"
            {...register('email')}
            className={cn(
              "w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm font-medium",
              errors.email && "border-red-500/50 focus:ring-red-500/50"
            )}
          />
        </div>
        {errors.email && <p className="text-red-400 text-[10px] font-bold ml-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Secure Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
            className={cn(
              "w-full px-5 py-4 pr-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm font-medium",
              errors.password && "border-red-500/50 focus:ring-red-500/50"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-[10px] font-bold ml-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl py-5 shadow-xl shadow-primary-500/20 border-0 active:scale-[0.98] transition-all" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" /> 
            <span>Authenticate</span>
          </div>
        )}
      </Button>
    </form>
  );
}
