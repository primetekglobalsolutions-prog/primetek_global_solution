'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      
      const allowedRoutes = ['/employee/login', '/admin/login', '/employee/dashboard'];
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] sm:w-[320px]"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-5 shadow-2xl shadow-navy-900/10 border border-white/40 ring-1 ring-black/5 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
            
            <div className="flex justify-between items-start mb-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
                <Smartphone className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setIsVisible(false)} 
                className="text-gray-400 hover:text-navy-900 transition-colors p-2 bg-surface-alt/50 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <h3 className="font-heading font-black text-navy-900 text-sm mb-1 uppercase tracking-tight">
                Install Portal App
              </h3>
              <p className="text-text-secondary text-[11px] font-medium leading-relaxed mb-5">
                For a faster, app-like experience with quick access to your dashboard and notifications.
              </p>
              
              <Button 
                onClick={handleInstall}
                size="sm"
                className="w-full bg-navy-900 text-white hover:bg-navy-800 font-bold rounded-xl py-3 border-0 shadow-lg shadow-navy-900/10"
              >
                <Download className="w-4 h-4 mr-2" /> Add to Home Screen
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
