'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PWAStandaloneGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Detect standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (navigator as any).standalone;

    if (isStandalone) {
      document.body.classList.add('pwa-standalone');
      
      // Strict requirement: Block access to any route outside /app/*
      // If user tries to access website pages while in standalone app, redirect to /app/login
      if (!pathname.startsWith('/app')) {
        router.replace('/app/login');
      }
    } else {
      document.body.classList.remove('pwa-standalone');
    }
  }, [pathname, router]);

  return null;
}
