'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PWAStandaloneManager() {
  const pathname = usePathname();
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (navigator as any).standalone 
        || document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
      
      if (isStandaloneMode) {
        // Force isolation: If in standalone mode but not on portal routes, redirect to login
        const isPortalRoute = pathname.startsWith('/employee') || pathname.startsWith('/admin');

        if (!isPortalRoute) {
          // Smart redirection based on attempted path
          if (pathname.includes('admin')) {
            router.replace('/admin/login');
          } else {
            router.replace('/employee/login');
          }
        } // Apply global styles to hide public UI elements
        document.documentElement.classList.add('pwa-mode');
      } else {
        document.documentElement.classList.remove('pwa-mode');
      }
    };

    checkStandalone();
    
    // Listen for changes (though display-mode doesn't usually change mid-session)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);
    
    return () => mediaQuery.removeEventListener('change', checkStandalone);
  }, [pathname, router]);

  return null;
}
