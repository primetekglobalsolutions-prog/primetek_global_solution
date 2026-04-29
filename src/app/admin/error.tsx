'use client';

import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Route Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70dvh] px-4">
      <Card hover={false} className="max-w-md w-full p-8 md:p-10 text-center border-t-4 border-t-red-500 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-8 -mt-8">
          <AlertCircle className="w-48 h-48 text-navy-900" />
        </div>

        <div className="relative">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-heading font-black text-navy-900 mb-3 tracking-tight">
            Dashboard Error
          </h2>
          <p className="text-text-secondary text-sm mb-10 leading-relaxed font-medium">
            An unexpected error occurred in the Admin portal. This has been logged and our team will investigate.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={reset}
              className="rounded-2xl h-12 shadow-lg shadow-primary-500/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Recovery
            </Button>
            
            <Link href="/admin/dashboard" className="w-full">
              <Button 
                variant="outline" 
                fullWidth 
                className="rounded-2xl h-12"
              >
                <Home className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-[10px] font-mono text-text-muted uppercase tracking-widest">
            ID: {error.digest || 'unknown-error'}
          </p>
        </div>
      </Card>
    </div>
  );
}
