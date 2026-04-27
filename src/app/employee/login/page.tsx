import type { Metadata } from 'next';
import EmployeeLoginForm from '@/components/employee/EmployeeLoginForm';
import Logo from '@/components/ui/Logo';

export const metadata: Metadata = { title: 'Employee Login' };

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo className="w-48 h-auto" dark={true} />
          </div>
          <p className="text-gray-400 text-sm mt-1">Employee Portal</p>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <EmployeeLoginForm />
        </div>
      </div>
    </div>
  );
}
