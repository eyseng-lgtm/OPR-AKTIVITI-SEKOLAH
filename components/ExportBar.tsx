import React, { useState } from 'react';
import { Download, FileImage, Printer, Share2, Loader2, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  reportRef: React.RefObject<HTMLDivElement | null>;
  programName: string;
}

export const ExportBar: React.FC<Props> = ({ reportRef, programName }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getCleanFileName = (ext: string) => {
    const safeTitle = (programName || 'Laporan_OPR')
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 40);
    return `${safeTitle}_OPR_2026.${ext}`;
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Small pause to allow images to settle
      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2.5, // High resolution for crisp print
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
      pdf.save(getCleanFileName('pdf'));
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateImage = async () => {
    if (!reportRef.current) return;
    setIsGeneratingImg(true);

    try {
      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = getCleanFileName('png');
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Image Generation Error:', err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!reportRef.current) return;
    try {
      if (navigator.share) {
        setIsGeneratingImg(true);
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        canvas.toBlob(async (blob) => {
          setIsGeneratingImg(false);
          if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], getCleanFileName('png'), { type: 'image/png' })] })) {
            const file = new File([blob], getCleanFileName('png'), { type: 'image/png' });
            await navigator.share({
              title: `OPR: ${programName || 'Laporan Sekolah'}`,
              text: `Laporan Satu Muka Surat (OPR) 2026 - ${programName}`,
              files: [file],
            });
          } else {
            // Fallback text share
            await navigator.share({
              title: `OPR: ${programName || 'Laporan Sekolah'}`,
              text: `Laporan Satu Muka Surat (OPR) 2026 - ${programName}`,
              url: window.location.href,
            });
          }
        }, 'image/png');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }
    } catch (err) {
      console.warn('Share dismissed or failed', err);
      setIsGeneratingImg(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 no-print">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Eksport & Cetakan Laporan</h3>
          <p className="text-xs text-slate-500">Pilih format untuk simpan atau kongsi ke WhatsApp / Telegram</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* PDF Button */}
          <button
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
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

          {/* PNG Image Button */}
          <button
            onClick={generateImage}
            disabled={isGeneratingImg}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
            title="Simpan sebagai imej PNG untuk WhatsApp/Telegram"
          >
            {isGeneratingImg ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileImage className="w-4 h-4" />
            )}
            <span>Simpan Imej (PNG)</span>
          </button>

          {/* Print / AirPrint */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
            title="Cetak terus menggunakan printer atau AirPrint"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak A4</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 transition"
            title="Kongsi fail terus ke WhatsApp/Telegram"
          >
            {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copySuccess ? 'Pautan Disalin' : 'Kongsi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
