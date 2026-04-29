'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function PWAInstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

   
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Strict requirement: ONLY show on these two routes
      const allowedRoutes = ['/employee/login', '/admin/login'];
      if (allowedRoutes.includes(pathname)) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4 animate-in fade-in slide-in-from-top-10 duration-700">
      <Card className="p-0 overflow-hidden shadow-2xl border-primary-100 ring-1 ring-black/10 bg-white/95 backdrop-blur-xl">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Logo className="w-20 h-auto" />
            <button 
              onClick={() => setIsVisible(false)} 
              className="text-gray-400 hover:text-navy-900 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className="font-heading font-bold text-navy-900 text-sm mb-1 leading-tight">
            Primetek Global App
          </h3>
          <p className="text-text-secondary text-[11px] leading-snug mb-4">
            Install the standalone portal for secure and fast access to your dashboard.
          </p>
          
          <Button 
            onClick={handleInstall}
            size="sm"
            className="w-full py-2 h-auto text-xs font-bold shadow-lg shadow-primary-500/20"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> Install Standalone App
          </Button>
        </div>
      </Card>
    </div>
  );
}
