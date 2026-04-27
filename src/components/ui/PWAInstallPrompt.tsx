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

  // Show prompt when on correct route AND we have a deferred prompt
  useEffect(() => {
    const isLoginPath = pathname.toLowerCase().includes('login');
    const isPortal = pathname.toLowerCase().includes('employee') || pathname.toLowerCase().includes('admin');
    
    if (isLoginPath && isPortal && deferredPrompt) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pathname, deferredPrompt]);

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
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:top-4 z-[100] max-w-[280px] animate-in fade-in slide-in-from-top-4 duration-500">
      <Card className="p-0 overflow-hidden shadow-xl border-primary-100 ring-1 ring-black/5 bg-white/95 backdrop-blur-md">
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <Logo className="w-20 h-auto" />
            <button 
              onClick={() => setIsVisible(false)} 
              className="text-text-muted hover:text-navy-900 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className="font-heading font-bold text-navy-900 text-sm mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-text-secondary text-[11px] leading-snug mb-3">
            {isEmployee ? "Fast access to attendance & HR tools." : "Secure dashboard control center."}
          </p>
          
          <Button 
            onClick={handleInstall}
            size="sm"
            className="w-full py-1.5 h-auto text-xs shadow-md shadow-primary-500/10"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Install App
          </Button>
        </div>
      </Card>
    </div>
  );
}
