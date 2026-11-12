import React, { useState } from 'react';
import { Download, Smartphone, Apple, HelpCircle, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and opened in standalone mode, show clean compact badge or hide
  if (isStandalone || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setGuideTab('ios');
      setShowGuide(true);
    } else {
      setGuideTab('android');
      setShowGuide(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left info badge */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-amber-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="font-bold text-xs sm:text-sm text-white">Pasang Aplikasi Dalam Telefon</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Android & iOS
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden sm:block">
                Gunakan seperti aplikasi native telefon anda: pantas, skrin penuh, dan boleh diguna luar talian (offline).
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {installSuccess ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow">
                <Check className="w-4 h-4" />
                <span>Berjaya Dipasang!</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang Sekarang (Android)</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => {
                  setGuideTab('ios');
                  setShowGuide(true);
                }}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all border border-blue-400/30"
              >
                <Apple className="w-3.5 h-3.5" />
                <span>Pasang di iPhone / iPad</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                setGuideTab(isIOS ? 'ios' : 'android');
                setShowGuide(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition border border-white/20"
              title="Lihat cara memasang di telefon"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>Panduan Pasang</span>
            </button>
          </div>
        </div>
      </div>

      <InstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        defaultTab={guideTab}
      />
    </>
  );
};
