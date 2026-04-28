import { Metadata } from 'next';
import UnifiedLoginForm from './UnifiedLoginForm';
import Logo from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: 'Portal Login | Primetek Global',
  description: 'Secure access to the Primetek Global portal.',
};

export default function UnifiedLoginPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 px-4 py-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 md:w-96 h-72 md:h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-72 md:w-96 h-72 md:h-96 bg-gold-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-sm md:max-w-md relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-block p-3 md:p-4 bg-white/5 rounded-2xl md:rounded-3xl backdrop-blur-md border border-white/10 mb-4 md:mb-6">
            <Logo className="w-36 md:w-48 h-auto" dark={true} />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
            Unified Portal
          </h1>
          <p className="text-gray-400 mt-1.5 text-[11px] md:text-sm uppercase tracking-[0.2em] font-semibold">
            Employee & Admin Access
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 border border-white/20">
          <UnifiedLoginForm />
        </div>
        
        <p className="text-center text-gray-600 text-[10px] mt-6 md:mt-8 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Primetek Global Solutions
        </p>
      </div>
    </div>
  );
}

