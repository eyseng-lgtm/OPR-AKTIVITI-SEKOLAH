import React, { useState } from 'react';
import { Download, Smartphone, HelpCircle, Check, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, isIOS, isInAppBrowser, isInIframe, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // If already installed and opened in standalone mode, do not show banner
  if (isStandalone || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 5000);
        return;
      }
    }
    // Fallback: open illustrated installation guide
    setGuideTab(isIOS ? 'ios' : 'android');
    setShowGuide(true);
  };

  const handleCopyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (err) {
      console.warn('Copy URL failed:', err);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left info badge */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-emerald-400 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-bold text-xs sm:text-sm text-white">Pasang Aplikasi Dalam Telefon</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                  Android & iOS
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Boleh diguna terus dari skrin telefon tanpa membuka pelayar web (boleh guna luar talian/offline).
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center">
            {installSuccess ? (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md">
                <Check className="w-4 h-4" />
                <span>Aplikasi Berjaya Dipasang!</span>
              </div>
            ) : isInIframe ? (
              <a
                href={typeof window !== 'undefined' ? window.location.href : '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg transition-all"
                title="Buka di tab penuh Chrome/Safari untuk memasang aplikasi"
              >
                <ExternalLink className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>Buka Tab Penuh Untuk Pasang</span>
              </a>
            ) : (
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg transition-all"
                title="Tekan untuk pasang ke telefon anda"
              >
                <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{isIOS ? 'Pasang di iPhone / iPad' : isInstallable ? 'Pasang Aplikasi Sekarang' : 'Pasang di Telefon'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setGuideTab(isIOS ? 'ios' : 'android');
                setShowGuide(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold px-3 py-2 rounded-xl text-xs transition border border-white/20"
              title="Lihat cara memasang di telefon"
            >
              <HelpCircle className="w-4 h-4 text-blue-300" />
              <span>Cara Pasang</span>
            </button>
          </div>
        </div>

        {/* Iframe notice */}
        {isInIframe && (
          <div className="bg-amber-500/95 text-slate-950 px-4 py-2 text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 text-center border-t border-amber-400">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-slate-950" />
              <span>
                Anda sedang melihat aplikasi dalam bingkai pratonton. Buka pautan dalam tab penuh <strong>Chrome (Android)</strong> atau <strong>Safari (iPhone)</strong> untuk memasang.
              </span>
            </div>
            <button
              onClick={handleCopyAppUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition flex-shrink-0"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUrl ? 'Pautan Disalin!' : 'Salin Pautan App'}</span>
            </button>
          </div>
        )}

        {/* WhatsApp / In-App browser alert if detected */}
        {!isInIframe && isInAppBrowser && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 text-center border-t border-amber-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-slate-950" />
            <span>
              Perhatian: Anda sedang membuka dalam aplikasi mesej (cth: WhatsApp). Sila tekan menu (⋮) di penjuru atas dan pilih "Buka dalam Chrome" (Android) atau "Buka dalam Safari" (iOS) untuk memasang.
            </span>
          </div>
        )}
      </div>

      <InstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        defaultTab={guideTab}
      />
    </>
  );
};
