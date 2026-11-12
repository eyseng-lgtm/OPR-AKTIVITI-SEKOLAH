import React, { useState } from 'react';
import { Smartphone, Apple, CheckCircle2, X, Share2, PlusSquare, ArrowUpRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'ios' | 'android';
}

export const InstallGuideModal: React.FC<Props> = ({ isOpen, onClose, defaultTab = 'android' }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pasang di Telefon Pintar</h3>
              <p className="text-xs text-blue-200 mt-0.5">Panduan Pemasangan Android & Apple iOS</p>
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
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'android'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Telefon Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-blue-800 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>Apple iOS (iPhone/iPad)</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'android' ? (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Aplikasi ini menyokong mod luar talian (offline) sepenuhnya selepas dipasang di Android.</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Buka di Pelayar Google Chrome</p>
                    <p className="text-xs text-slate-600 mt-0.5">Pastikan anda membuka pautan aplikasi ini menggunakan Google Chrome atau Samsung Internet di telefon Android anda.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Tekan Butang 'Pasang Aplikasi'</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tekan butang hijau <strong>"Pasang di Telefon"</strong> yang dipaparkan pada bar atas aplikasi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Pilihan Alternatif melalui Menu Chrome</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Jika butang tidak muncul, tekan butang <strong>Menu 3 Titik (⋮)</strong> di penjuru atas kanan pelayar Chrome, kemudian pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambah ke skrin Utama" (Add to Home screen)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Selesai!</p>
                    <p className="text-xs text-slate-600 mt-0.5">Ikon "OPR 2026" akan wujud di skrin utama telefon anda, sedia digunakan bila-bila masa walaupun tiada sambungan internet.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                <Apple className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <span>Untuk Apple iOS, pemasangan dilakukan dengan mudah melalui pelayar rasmi <strong>Safari</strong>.</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Buka Pautan dalam Safari</p>
                    <p className="text-xs text-slate-600 mt-0.5">Pastikan anda membuka laman ini dalam <strong>Safari</strong> di iPhone atau iPad anda (bukan di dalam in-app browser seperti WhatsApp/Facebook).</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <span>Tekan Ikon Kongsi (Share)</span>
                      <Share2 className="w-4 h-4 text-blue-600 inline" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Di bar bawah Safari iPhone (atau bar atas iPad), tekan ikon petak segi empat dengan anak panah ke atas (Share).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <span>Pilih 'Tambah ke Skrin Utama'</span>
                      <PlusSquare className="w-4 h-4 text-blue-600 inline" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Skrol ke bawah pada senarai tindakan dan pilih <strong>"Tambah ke Skrin Utama"</strong> (Add to Home Screen).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Tekan 'Tambah' (Add)</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tekan butang <strong>"Tambah"</strong> di sudut atas kanan. Aplikasi kini dipasang di skrin utama iPhone anda dan dibuka seperti aplikasi App Store sebenar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advantages Callout */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kelebihan Pemasangan di Telefon:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Boleh guna Offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Skrin Penuh (Tiada URL bar)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Simpan Draf Automatik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Pantas & Ringan (~1MB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition shadow"
          >
            Faham, Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
