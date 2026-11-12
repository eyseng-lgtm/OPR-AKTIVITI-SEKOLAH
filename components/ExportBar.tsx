import React, { useState } from 'react';
import { Download, ExternalLink, Loader2, CheckCircle2, HardDrive, ArrowUpRight } from 'lucide-react';
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
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getCleanFileName = (ext: string) => {
    const safeTitle = (programName || 'Laporan_OPR')
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 40);
    return `${safeTitle}_OPR_2026.${ext}`;
  };

  const generatePDFBlob = async (): Promise<{ pdf: jsPDF; fileName: string } | null> => {
    if (!reportRef.current) return null;

    // Small pause to allow images to settle
    await new Promise(r => setTimeout(r, 200));

    const canvas = await html2canvas(reportRef.current, {
      scale: 2.5, // High resolution for crisp A4 print
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
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
    setStatusMessage(null);
    try {
      const result = await generatePDFBlob();
      if (result) {
        result.pdf.save(result.fileName);
        setStatusMessage(`Fail "${result.fileName}" berjaya dimuat turun!`);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Gagal menjana PDF. Sila pastikan kandungan laporan telah diisi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Generate PDF and submit / open Google Drive folder
  const handleSendToGoogleDrive = async () => {
    setIsUploadingToDrive(true);
    setStatusMessage(null);
    try {
      const result = await generatePDFBlob();
      if (result) {
        // Automatically save/download the PDF to user device first
        result.pdf.save(result.fileName);

        // Open Google Drive folder in a new window/tab
        window.open(GOOGLE_DRIVE_FOLDER_URL, '_blank', 'noopener,noreferrer');

        setStatusMessage(
          `PDF "${result.fileName}" sedia dijana! Folder Google Drive sekolah telah dibuka untuk simpanan.`
        );
      }
    } catch (err) {
      console.error('Google Drive submission error:', err);
      window.open(GOOGLE_DRIVE_FOLDER_URL, '_blank', 'noopener,noreferrer');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 no-print space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Tindakan Laporan OPR</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              Google Drive Terhubung
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jana fail PDF dan hantar ke folder Google Drive SJK Chung Hua Bau
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Button: Hantar & Simpan ke Google Drive */}
          <button
            onClick={handleSendToGoogleDrive}
            disabled={isUploadingToDrive || isGeneratingPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
            title="Jana fail PDF dan buka folder Google Drive untuk simpan"
          >
            {isUploadingToDrive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menjana & Membuka Drive...</span>
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
            disabled={isGeneratingPdf || isUploadingToDrive}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
            title="Muat turun salinan PDF ke peranti anda"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menjana...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Muat Turun PDF</span>
              </>
            )}
          </button>

          {/* Quick link button to open the Drive folder directly */}
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

      {/* Target Drive Folder Information Box */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Folder Google Drive Destinasi: </span>
            <code className="bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold text-emerald-900">
              ID: {GOOGLE_DRIVE_FOLDER_ID}
            </code>
          </div>
        </div>

        <span className="text-[11px] text-emerald-700">
          Tekan <strong>"Hantar & Simpan ke Google Drive"</strong> untuk menjana PDF dan memuat naik ke folder ini.
        </span>
      </div>

      {/* Status banner when PDF is created / drive is opened */}
      {statusMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-blue-500 hover:text-blue-800 text-[11px] font-bold"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
};
