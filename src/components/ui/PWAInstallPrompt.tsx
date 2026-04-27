'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Laptop, Smartphone } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import Card from './Card';

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW registration failed:', err));
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Show prompt when on correct route
  useEffect(() => {
    const isLoginPath = pathname.toLowerCase().includes('login');
    const isPortal = pathname.toLowerCase().includes('employee') || pathname.toLowerCase().includes('admin');
    
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isLoginPath && isPortal && !isStandalone) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [pathname]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      // Manual instruction fallback for iOS or browsers without prompt support
      alert("To install: \n1. Tap the Share icon (bottom of screen)\n2. Scroll down and tap 'Add to Home Screen'");
    }
  };

  if (!isVisible) return null;

  const isEmployee = pathname.includes('/employee');
  const title = isEmployee ? "Employee Portal App" : "Admin Dashboard App";

  return (
    <div className="fixed top-0 left-0 right-0 md:top-4 md:right-4 md:left-auto z-[9999] p-4 pointer-events-none">
      <div className="max-w-sm mx-auto md:mx-0 pointer-events-auto animate-in fade-in slide-in-from-top-10 duration-700">
        <Card className="p-0 overflow-hidden shadow-2xl border-primary-100 ring-1 ring-black/10 bg-white/95 backdrop-blur-lg">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Logo className="w-20 h-auto" />
              <button 
                onClick={() => setIsVisible(false)} 
                className="text-text-muted hover:text-navy-900 transition-colors p-1.5 bg-surface-alt rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-heading font-bold text-navy-900 text-sm mb-1 leading-tight">
              Install {title}
            </h3>
            <p className="text-text-secondary text-[11px] leading-snug mb-4">
              {isEmployee 
                ? "Get the app for faster attendance and HR updates." 
                : "Secure, standalone access to your control center."}
            </p>
            
            <Button 
              onClick={handleInstall}
              size="sm"
              className="w-full py-2 h-auto text-xs font-bold shadow-lg shadow-primary-500/20"
            >
              <Download className="w-3.5 h-3.5 mr-2" /> 
              {deferredPrompt ? "Install App Now" : "How to Install"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
