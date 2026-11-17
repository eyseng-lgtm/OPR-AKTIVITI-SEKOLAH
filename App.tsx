import React, { useState, useRef, useEffect } from 'react';
import { 
  ReportData, 
  ReportImage, 
  INITIAL_REPORT_DATA 
} from './types';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ExportBar } from './components/ExportBar';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallGuideModal } from './components/InstallGuideModal';
import { usePWAInstall } from './usePWAInstall';
import { 
  FileText, 
  Eye, 
  Smartphone, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle,
  Download,
  FileCode
} from 'lucide-react';

const STORAGE_KEY_DATA = 'opr_report_data_clean_v1';
const STORAGE_KEY_IMAGES = 'opr_report_images_clean_v1';

const App: React.FC = () => {
  // Initialize state with localStorage data or defaults (all blank for user to type themselves)
  const [data, setData] = useState<ReportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_REPORT_DATA,
          ...parsed,
          disahkanOleh: 'ENCIK CHAI CHANG CHING',
          jawatanDisahkan: 'Guru Besar SJK Chung Hua Bau',
        };
      }
    } catch (e) {
      console.warn('Could not read saved data', e);
    }
    return INITIAL_REPORT_DATA;
  });

  const [images, setImages] = useState<ReportImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IMAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved images', e);
    }
    return [];
  });

  // Mobile navigation tab: 'form' | 'preview'
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  
  // Preview zoom scale (especially helpful on mobile phones)
  const [previewScale, setPreviewScale] = useState<number>(0.75);

  // Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { isIOS, isStandaloneFile } = usePWAInstall();

  // Hidden / live report refs
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfRenderRef = useRef<HTMLDivElement>(null);

  // Save to LocalStorage whenever data or images change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save report data to localStorage', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(images));
    } catch (e) {
      console.warn('Failed to save images to localStorage (storage limit may be reached)', e);
    }
  }, [images]);

  // Adjust preview zoom automatically based on screen width on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Mobile phone width
        setPreviewScale(Math.min(0.46, (window.innerWidth - 32) / 800));
      } else if (window.innerWidth < 1024) {
        // Tablet width
        setPreviewScale(0.65);
      } else {
        // Desktop
        setPreviewScale(0.85);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    if (window.confirm('Adakah anda pasti mahu mengosongkan borang dan memadam semua gambar?')) {
      setData({
        ...INITIAL_REPORT_DATA,
        namaProgram: '',
        disediakanOleh: '',
        disahkanOleh: 'ENCIK CHAI CHANG CHING',
        jawatanDisahkan: 'Guru Besar SJK Chung Hua Bau',
        objektif: '',
        aktiviti: '',
        kekuatan: '',
        kelemahan: '',
        penambahbaikan: '',
      });
      setImages([]);
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_IMAGES);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Top PWA Install Banner */}
      <PWAInstallBanner />

      {/* 2. Main School Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <img
              src={data.logoSekolah || '/logo-sekolah.png'}
              alt="School Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-blue-950 tracking-tight leading-tight">
                  {data.namaSekolah || 'SJK CHUNG HUA BAU'}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  OPR 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Sistem Penjana Laporan Satu Muka Surat (PWA Mudah Alih)
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Install Guide & HTML Download */}
            {!isStandaloneFile && (
              <>
                <a
                  href="/OPR-2026-SJK-Chung-Hua-Bau.html"
                  download="OPR-2026-SJK-Chung-Hua-Bau.html"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                  title="Muat turun aplikasi sebagai fail HTML tunggal (Offline)"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Muat Turun HTML</span>
                </a>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 border border-slate-200 transition"
                  title="Panduan pemasangan Android dan iOS"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden md:inline">Pasang di Telefon</span>
                </button>
              </>
            )}

            {/* Quick Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'form'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Borang</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratonton A4</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Export action bar */}
        <ExportBar
          reportRef={pdfRenderRef}
          programName={data.namaProgram}
        />

        {/* Desktop Split View / Mobile Tab View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Column */}
          <div className={`lg:col-span-6 xl:col-span-5 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <ReportForm
              data={data}
              setData={setData}
              images={images}
              setImages={setImages}
              onReset={handleReset}
            />
          </div>

          {/* Preview Column */}
          <div className={`lg:col-span-6 xl:col-span-7 ${activeTab === 'form' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
              {/* Preview Bar with Controls */}
              <div className="bg-slate-900 text-white p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-2 border-b border-slate-800 no-print">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-bold text-xs sm:text-sm">Pratonton Langsung Kertas A4</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
                    1 Muka Surat Sahaja
                  </span>
                </div>

                {/* Zoom / Scaling Controls for Mobile & Desktop */}
                <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setPreviewScale(prev => Math.max(0.35, prev - 0.08))}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                    title="Kecilkan Saiz"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-blue-200 w-11 text-center font-bold">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    onClick={() => setPreviewScale(prev => Math.min(1.2, prev + 0.08))}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                    title="Besarkan Saiz"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Canvas Container */}
              <div 
                className="p-4 sm:p-6 bg-slate-200/80 overflow-auto flex justify-center items-start min-h-[500px] max-h-[85vh]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div 
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                    marginBottom: `calc((297mm * ${previewScale}) - 297mm)`,
                  }}
                >
                  <ReportPreview
                    ref={reportRef}
                    data={data}
                    images={images}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Dedicated Offscreen Container for 100% Reliable PDF Generation (Always Active on Mobile & Desktop) */}
      <div 
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '210mm',
          height: '297mm',
          overflow: 'visible',
          zIndex: -9999,
          pointerEvents: 'none',
          visibility: 'visible',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <ReportPreview
          ref={pdfRenderRef}
          data={data}
          images={images}
          isPrintOnly={false}
        />
      </div>

      {/* 5. Print-Only Container (Active strictly during window.print()) */}
      <div className="hidden print:block print-only-container">
        <ReportPreview
          data={data}
          images={images}
          isPrintOnly={true}
        />
      </div>

      {/* 5. Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* 6. Phone Installation Guide Modal & Share/QR Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        defaultTab={isIOS ? 'ios' : 'android'}
      />

      {/* 7. Footer */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 SJK Chung Hua Bau. Sistem Pelaporan OPR Rasmi.</p>
          {!isStandaloneFile && (
            <div className="flex items-center gap-4 text-slate-500">
              <a
                href="/OPR-2026-SJK-Chung-Hua-Bau.html"
                download="OPR-2026-SJK-Chung-Hua-Bau.html"
                className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Muat Turun Fail HTML (Offline)</span>
              </a>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Panduan Pasang di Android & iOS</span>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
