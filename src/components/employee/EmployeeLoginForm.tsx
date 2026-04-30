'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EmployeeLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [lockout, setLockout] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/employee-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        if (data.lockout) setLockout(true);
        if (data.showCaptcha) setShowCaptcha(true);
        setLoading(false);
        return;
      }

      if (data.requiresMFA) {
        setShowMFA(true);
        setLoading(false);
        return;
      }

      router.push('/employee');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/mfa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: mfaCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid verification code');
        setLoading(false);
        return;
      }

      router.push('/employee');
      router.refresh();
    } catch {
      setError('MFA verification failed');
      setLoading(false);
    }
  };

  if (showMFA) {
    return (
      <form onSubmit={handleMFAVerify} className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-navy-900 font-bold mb-2">Two-Step Verification</p>
          <p className="text-xs text-text-muted">Enter the code from your authenticator app.</p>
        </div>
        
        <input
          type="text"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
          placeholder="000000"
          className="w-full px-4 py-4 rounded-xl border border-border bg-white text-center font-mono text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-primary-400 focus:outline-none"
          required
          autoFocus
        />

        {error && (
          <div className="text-error text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="font-medium text-center">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading || mfaCode.length !== 6}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
          Verify & Sign In
        </Button>

        <button 
          type="button" 
          onClick={() => setShowMFA(false)} 
          className="w-full text-xs font-bold text-text-muted hover:text-navy-900 transition-colors py-2"
        >
          Back to Login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {lockout && (
        <div className="bg-red-900 text-white p-4 rounded-xl text-center space-y-2 mb-4 animate-in zoom-in-95">
          <p className="text-xs font-black uppercase tracking-widest">Account Locked</p>
          <p className="text-[11px] opacity-80">Security threshold exceeded. Please contact IT support to unlock your credentials.</p>
        </div>
      )}

      <div>
        <label htmlFor="emp-email" className="block text-[10px] font-black text-navy-900/40 uppercase tracking-widest mb-1.5 ml-1">
          Endpoint Identity
        </label>
        <input
          id="emp-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or Employee ID"
          required
          disabled={lockout}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="emp-password" className="block text-[10px] font-black text-navy-900/40 uppercase tracking-widest mb-1.5 ml-1">
          Access Key
        </label>
        <div className="relative">
          <input
            id="emp-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={lockout}
            className="w-full px-4 py-3 pr-11 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy-900 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showCaptcha && !lockout && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] font-bold">
          Multiple failed attempts. CAPTCHA required for next try.
        </div>
      )}

      {error && !lockout && (
        <div className="text-error text-sm bg-red-50 border border-red-200 rounded-lg p-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading || lockout}>
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Authenticating...</>
        ) : (
          <><LogIn className="w-5 h-5 mr-2" /> Sign In</>
        )}
      </Button>
    </form>
  );
}
