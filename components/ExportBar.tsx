import React, { useState } from 'react';
import { Download, ExternalLink, Loader2, CheckCircle2, HardDrive, ArrowUpRight, Copy, Check, X, FolderUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  reportRef: React.RefObject<HTMLDivElement | null>;
  programName: string;
}

const GOOGLE_DRIVE_FOLDER_ID = '1vZlSBepCVUMdccjUgTw9v1I5DzFyK1Dq';
const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}?lfhs=2`;

export const ExportBar: React.FC<Props> = ({ reportRef, programName }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDriveActionActive, setIsDriveActionActive] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [generatedFileName, setGeneratedFileName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getCleanFileName = (ext: string) => {
    const safeTitle = (programName || 'Laporan_OPR')
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 40);
    return `${safeTitle || 'Laporan'}_OPR_2026.${ext}`;
  };

  const generatePDFBlob = async (): Promise<{ pdf: jsPDF; fileName: string }> => {
    const targetElement = reportRef.current;
    if (!targetElement) {
      throw new Error('Elemen laporan tidak ditemui.');
    }

    // Small delay to ensure all DOM images are rendered
    await new Promise(r => setTimeout(r, 250));

    // Ensure all images inside targetElement have loaded
    const imgElements = targetElement.querySelectorAll('img');
    await Promise.all(
      (Array.from(imgElements) as HTMLImageElement[]).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if an image fails
        });
      })
    );

    const canvas = await html2canvas(targetElement, {
      scale: 2, // 2x scale produces sharp print text while keeping memory light on mobile
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedTarget = clonedDoc.getElementById('report-paper-a4');
        if (clonedTarget) {
          clonedTarget.style.display = 'flex';
          clonedTarget.style.visibility = 'visible';
          clonedTarget.style.opacity = '1';
        }
      },
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Ralat saiz kanvas: Sila cuba sebentar lagi.');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    const fileName = getCleanFileName('pdf');
    return { pdf, fileName };
  };

  // 1. Download PDF directly
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);

    try {
      const { pdf, fileName } = await generatePDFBlob();
      pdf.save(fileName);
      setGeneratedFileName(fileName);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setErrorMessage(
        'Gagal menjana PDF: ' + (err?.message || 'Sila cuba lagi atau muat semula laman web.')
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Generate PDF and open Google Drive folder
  const handleSendToGoogleDrive = async () => {
    setIsDriveActionActive(true);
    setErrorMessage(null);

    // Open the Google Drive folder synchronously on user tap/click to prevent popup blocker blocking it
    const driveWindow = window.open(GOOGLE_DRIVE_FOLDER_URL, '_blank');

    try {
      const { pdf, fileName } = await generatePDFBlob();
      
      // Save the PDF file to user's device
      pdf.save(fileName);
      setGeneratedFileName(fileName);

      // If the window popup was blocked or closed, set location
      if (driveWindow && !driveWindow.closed) {
        driveWindow.focus();
      }

      // Show the guide modal for confirming upload into the Google Drive folder
      setShowDriveModal(true);
    } catch (err: any) {
      console.error('Google Drive Action Error:', err);
      setErrorMessage(
        'Gagal menjana fail PDF: ' + (err?.message || 'Sila cuba lagi.')
      );
      if (driveWindow && !driveWindow.closed) {
        driveWindow.focus();
      }
    } finally {
      setIsDriveActionActive(false);
    }
  };

  const copyDriveLink = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_DRIVE_FOLDER_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 no-print space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Tindakan Laporan OPR 2026</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                Google Drive Sekolah
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jana fail PDF dan simpan ke dalam folder Google Drive SJK Chung Hua Bau
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Main Action Button: Hantar & Simpan ke Google Drive */}
            <button
              onClick={handleSendToGoogleDrive}
              disabled={isDriveActionActive || isGeneratingPdf}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
              title="Jana fail PDF dan buka folder Google Drive untuk disimpan"
            >
              {isDriveActionActive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Sedang Menjana PDF...</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 text-emerald-200" />
                  <span>Hantar & Simpan ke Google Drive</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </button>

            {/* Secondary Button: Muat Turun PDF Sahaja */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf || isDriveActionActive}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
              title="Muat turun salinan fail PDF ke peranti"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menjana PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Muat Turun PDF</span>
                </>
              )}
            </button>

            {/* Direct Link to Google Drive Folder */}
            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition"
              title="Buka terus folder Google Drive di tab baharu"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Buka Folder Drive</span>
            </a>
          </div>
        </div>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between gap-2">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Target Drive Folder Information Box */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Folder Google Drive Sekolah: </span>
              <code className="bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold text-emerald-900">
                ID: {GOOGLE_DRIVE_FOLDER_ID}
              </code>
            </div>
          </div>

          <span className="text-[11px] text-emerald-700">
            Tekan <strong>"Hantar & Simpan ke Google Drive"</strong> untuk menjana PDF dan memuat naik ke folder ini.
          </span>
        </div>
      </div>

      {/* Google Drive Upload Guide Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                  <FolderUp className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Fail PDF Berjaya Dijana!</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">Sedia untuk disimpan ke Google Drive</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDriveModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-slate-700 text-xs sm:text-sm">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs sm:text-sm text-emerald-900">
                    Fail PDF telah disimpan ke peranti anda:
                  </p>
                  <p className="text-xs font-mono font-semibold text-emerald-800 mt-0.5">
                    {generatedFileName}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                  Langkah Menyimpan ke Google Drive Sekolah:
                </h4>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Buka Folder Google Drive Sekolah</p>
                    <p className="text-slate-600 mt-0.5">
                      Folder telah dibuka di tab pelayar anda. Jika belum terbuka, tekan butang di bawah:
                    </p>
                    <a
                      href={GOOGLE_DRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Buka Folder Google Drive Sekarang</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Muat Naik Fail PDF Tersebut</p>
                    <p className="text-slate-600 mt-0.5">
                      Di dalam Google Drive, tekan butang <strong>"+ New"</strong> atau <strong>"+"</strong> dan pilih <strong>"File upload"</strong> (atau seret fail <code>{generatedFileName}</code> yang baru dimuat turun ke dalam folder tersebut).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px] truncate max-w-[260px]">
                  ID: {GOOGLE_DRIVE_FOLDER_ID}
                </span>
                <button
                  onClick={copyDriveLink}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Pautan Disalin!' : 'Salin Pautan Folder'}</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowDriveModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
