// TS definitions for PWA install prompt event
export {};

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}