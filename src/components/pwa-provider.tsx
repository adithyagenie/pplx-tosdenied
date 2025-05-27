"use client";

import { useEffect } from "react";

export function PWAProvider() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    }

    // Prompt for PWA install when browser supports it
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    const onBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      deferredPrompt = e;
      // Show the install prompt immediately
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        console.log('PWA install choice:', choice.outcome);
        deferredPrompt = null;
      });
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  return null;
}
