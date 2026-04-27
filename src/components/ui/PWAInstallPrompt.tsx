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
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Only show if on login pages
      if (pathname.includes('/employee-login') || pathname.includes('/admin-login')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isEmployee = pathname.includes('/employee');
  const title = isEmployee ? "Install Employee Portal" : "Install Admin Dashboard";
  const desc = isEmployee 
    ? "Access your attendance, profile, and HR tools faster by installing the Primetek app." 
    : "Access the admin control center securely from your desktop or home screen.";

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-8 z-[100] max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
      <Card className="p-0 overflow-hidden shadow-2xl border-primary-100 ring-1 ring-black/5 bg-white">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-50 p-2.5 rounded-xl">
              <Logo className="w-24 h-auto" />
            </div>
            <button 
              onClick={() => setIsVisible(false)} 
              className="text-text-muted hover:text-navy-900 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="font-heading font-bold text-navy-900 text-lg mb-2">
            {title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            {desc}
          </p>
          
          <div className="flex items-center gap-3 mb-5 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5" /> Desktop</span>
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
            <span className="flex items-center gap-1 ml-auto">Free & Secure</span>
          </div>

          <Button 
            onClick={handleInstall}
            className="w-full shadow-lg shadow-primary-500/20"
          >
            <Download className="w-4 h-4 mr-2" /> Install Now
          </Button>
        </div>
        
        <div className="bg-surface-alt px-5 py-3 border-t border-border flex items-center justify-center">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
            Official Primetek Global App
          </p>
        </div>
      </Card>
    </div>
  );
}
