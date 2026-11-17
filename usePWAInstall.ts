import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

function getInitialEnv() {
  if (typeof window === 'undefined') {
    return {
      isStandalone: false,
      isStandaloneFile: false,
      isIOS: false,
      isAndroid: false,
      isInAppBrowser: false,
      isInIframe: false,
      deferredPrompt: null as BeforeInstallPromptEvent | null,
    };
  }

  let isInIframe = false;
  try {
    isInIframe = window.self !== window.top;
  } catch {
    isInIframe = true;
  }

  const isStandaloneFile =
    window.location.protocol === 'file:' ||
    Boolean((window as unknown as { __IS_STANDALONE_HTML__?: boolean }).__IS_STANDALONE_HTML__);

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const isInAppBrowser = /fban|fbav|instagram|line|micromessenger|whatsapp|telegram|snapchat|threads|tiktok/i.test(ua);

  return {
    isStandalone,
    isStandaloneFile,
    isIOS,
    isAndroid,
    isInAppBrowser,
    isInIframe,
    deferredPrompt: window.__pwaInstallPrompt || null,
  };
}

export function usePWAInstall() {
  const initial = getInitialEnv();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    initial.deferredPrompt
  );
  const [isInstalled, setIsInstalled] = useState(initial.isStandalone);
  const [isStandalone, setIsStandalone] = useState(initial.isStandalone);
  const [isStandaloneFile] = useState(initial.isStandaloneFile);
  const [isIOS] = useState(initial.isIOS);
  const [isAndroid] = useState(initial.isAndroid);
  const [isInAppBrowser] = useState(initial.isInAppBrowser);
  const [isInIframe] = useState(initial.isInIframe);

  useEffect(() => {
    // Pick up any prompt captured before mount
    if (window.__pwaInstallPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptReady = () => {
      if (window.__pwaInstallPrompt) {
        setDeferredPrompt(window.__pwaInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      window.__pwaInstallPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      if (e.matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-installed', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installed', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [deferredPrompt]);

  const install = async (): Promise<boolean> => {
    const activePrompt = deferredPrompt || window.__pwaInstallPrompt;
    if (!activePrompt) return false;
    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        window.__pwaInstallPrompt = null;
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    isStandaloneFile,
    isIOS,
    isAndroid,
    isInAppBrowser,
    isInIframe,
    install,
  };
}
