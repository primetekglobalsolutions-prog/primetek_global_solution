'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UnifiedLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/unified-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.role === 'admin') {
        router.push('/app/admin/dashboard');
      } else {
        router.push('/app/employee/dashboard');
      }
      
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="unified-email" className="text-[13px] font-semibold text-navy-900 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-primary-500" />
          Email or Employee ID
        </label>
        <input
          id="unified-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@primetek.com or PT-123"
          required
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all text-[15px]"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="unified-password" className="text-[13px] font-semibold text-navy-900 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
          Password
        </label>
        <div className="relative">
          <input
            id="unified-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all text-[15px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-red-600 text-[13px] bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full py-3.5 h-auto rounded-xl text-base font-bold shadow-xl shadow-primary-500/20 group" disabled={loading}>
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Authenticating...</>
        ) : (
          <>
            <LogIn className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" /> 
            Enter Portal
          </>
        )}
      </Button>
      
      <div className="pt-1 flex justify-between items-center text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
          Remember me
        </label>
        <a href="#" className="hover:text-primary-600 transition-colors font-medium">Forgot password?</a>
      </div>
    </form>
  );
}
