import React, { useState } from 'react';
import { Smartphone, Apple, CheckCircle2, X, Share2, PlusSquare, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'ios' | 'android';
}

export const InstallGuideModal: React.FC<Props> = ({ isOpen, onClose, defaultTab = 'android' }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(defaultTab);
  const { isInstallable, isInIframe, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Panduan Memasang di Telefon</h3>
              <p className="text-xs text-blue-200 mt-0.5">SJK Chung Hua Bau OPR 2026</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'android'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Telefon Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>Apple iOS (iPhone/iPad)</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Direct Install Action if browser prompt is ready */}
          {isInstallable && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <p className="font-bold">Peranti Anda Sedia Memasang!</p>
                <p className="text-emerald-800 mt-0.5">Tekan butang di sebelah untuk pasang terus ke skrin utama.</p>
              </div>
              <button
                onClick={async () => {
                  const ok = await install();
                  if (ok) onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex-shrink-0"
              >
                Pasang Sekarang
              </button>
            </div>
          )}

          {/* Iframe Notice */}
          {isInIframe && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
              <p className="font-bold">Buka Pautan di Luar Pratonton Dahulu:</p>
              <p className="leading-relaxed">
                Pelayar tidak membenarkan pemasangan aplikasi dari dalam tetingkap pratonton. Sila buka pautan aplikasi secara terus dalam <strong>Google Chrome</strong> atau <strong>Safari</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tab Penuh</span>
                </a>
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-lg font-bold text-xs hover:bg-blue-100"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Disalin!' : 'Salin Pautan'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Important WhatsApp / Social Browser Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Penting: Jangan pasang dari dalam WhatsApp!</p>
              <p className="leading-relaxed">
                Pelayar dalaman WhatsApp tidak membenarkan pemasangan aplikasi. Sila tekan ikon <strong>Menu 3 Titik (⋮)</strong> di atas skrin dan pilih <strong>"Buka dalam Chrome"</strong> (untuk Android) atau <strong>"Buka dalam Safari"</strong> (untuk iPhone).
              </p>
            </div>
          </div>

          {activeTab === 'android' ? (
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Langkah Pemasangan di Android (Google Chrome):
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Buka di Pelayar Google Chrome</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Buka pautan aplikasi di pelayar rasmi <strong>Chrome</strong> atau <strong>Samsung Internet</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Tekan Menu 3 Titik (⋮) Chrome</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Di penjuru kanan atas pelayar Chrome telefon anda, tekan butang <strong>Menu 3 Titik (⋮)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Pilih "Pasang Aplikasi" (Install App) atau "Tambah ke Skrin Utama"</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Skrol dan tekan pilihan <strong>"Pasang aplikasi" (Install app)</strong> atau <strong>"Tambah ke skrin Utama" (Add to Home screen)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Tekan "Pasang" (Install)</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Sahkan dengan menekan butang <strong>"Pasang"</strong>. Aplikasi OPR 2026 akan terus muncul di skrin telefon anda!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Langkah Pemasangan di Apple iOS (Safari):
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Buka Pautan dalam Safari</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Di iPhone / iPad, anda mesti membuka pautan menggunakan pelayar <strong>Safari</strong> (bukan Chrome atau WhatsApp).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>Tekan Ikon Kongsi (Share)</span>
                      <Share2 className="w-4 h-4 text-blue-600 inline" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tekan ikon petak dengan anak panah ke atas (Share) di bar alat bahagian bawah Safari iPhone anda.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>Pilih "Tambah ke Skrin Utama"</span>
                      <PlusSquare className="w-4 h-4 text-blue-600 inline" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Skrol senarai tindakan ke bawah dan tekan <strong>"Tambah ke Skrin Utama" (Add to Home Screen)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Tekan "Tambah" (Add)</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tekan butang <strong>"Tambah"</strong> di sudut kanan atas skrin. Aplikasi kini terpasang di skrin utama iPhone anda!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advantages Callout */}
          <div className="pt-2 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Boleh guna Offline (Tiada Internet)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Skrin Penuh macam App Native</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            Faham, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
