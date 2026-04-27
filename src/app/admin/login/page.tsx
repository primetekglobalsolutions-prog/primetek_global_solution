import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 px-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-2xl mb-4 shadow-xl shadow-primary-500/20">
            P
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">
            Primetek Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
