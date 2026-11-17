import React, { useState, useRef } from 'react';
import { Download, ExternalLink, Loader2, CheckCircle2, HardDrive, ArrowUpRight, Copy, Check, X, CloudUpload } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { sanitizeDocumentColorsForHtml2Canvas } from '../pdfColorSanitizer';
import { ReportData } from '../types';

interface Props {
  reportRef: React.RefObject<HTMLDivElement | null>;
  programName: string;
  reportData: ReportData;
}

const GOOGLE_DRIVE_FOLDER_ID = '1vZlSBepCVUMdccjUgTw9v1I5DzFyK1Dq';
const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}?lfhs=2`;
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmrT4tVt-avRGWsYqRP_Wfoen3oeFq51tq-FihyAL3_99QKufEpk4R4EZanfNSzwI/exec';

export const ExportBar: React.FC<Props> = ({ reportRef, programName, reportData }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDriveActionActive, setIsDriveActionActive] = useState(false);
  const [driveStepText, setDriveStepText] = useState('Menghantar ke Google Drive...');
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [generatedFileName, setGeneratedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lastGeneratedPdfRef = useRef<{ pdf: jsPDF; fileName: string } | null>(null);

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
      onclone: (clonedDoc, clonedElement) => {
        const target = clonedElement || clonedDoc.getElementById('report-paper-a4');
        if (target) {
          target.style.display = 'flex';
          target.style.visibility = 'visible';
          target.style.opacity = '1';
          target.style.boxShadow = 'none';
        }
        sanitizeDocumentColorsForHtml2Canvas(clonedDoc, target);
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
      lastGeneratedPdfRef.current = { pdf, fileName };
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

  // 2. Generate PDF and automatically upload/save into Google Drive via Google Apps Script
  const handleSendToGoogleDrive = async () => {
    setIsDriveActionActive(true);
    setDriveStepText('Sedang Menjana PDF...');
    setErrorMessage(null);
    setUploadedFileUrl(null);

    try {
      const { pdf, fileName } = await generatePDFBlob();
      lastGeneratedPdfRef.current = { pdf, fileName };
      setGeneratedFileName(fileName);

      setDriveStepText('Menyimpan ke Google Drive...');

      const dataUri = pdf.output('datauristring');
      const pdfBase64 = dataUri.includes(',')
        ? dataUri.slice(dataUri.indexOf(',') + 1)
        : dataUri;

      const safeProgramTitle = (reportData.namaProgram || 'Laporan_OPR')
        .replace(/[\\/:*?"<>|]/g, '_')
        .trim() || 'Laporan_OPR';

      const weaknessesText = reportData.penambahbaikan
        ? `${reportData.kelemahan || '-'}\nCadangan Penambahbaikan: ${reportData.penambahbaikan}`
        : (reportData.kelemahan || '-');

      // Exact payload schema expected by the user's Google Apps Script doPost(e)
      const payload = JSON.stringify({
        timestamp: new Date().toLocaleString('ms-MY'),
        programName: safeProgramTitle,
        organizedBy: reportData.anjuran || '-',
        date: reportData.tarikh || '-',
        time: reportData.masa || '-',
        venue: reportData.tempat || '-',
        target: reportData.sasaran || '-',
        studentCount: reportData.bilanganMurid || '-',
        objectives: reportData.objektif || '-',
        activities: reportData.aktiviti || '-',
        strengths: reportData.kekuatan || '-',
        weaknesses: weaknessesText,
        pdfData: pdfBase64,
      });

      let fileViewUrl: string | null = null;

      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: payload,
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error(`Pelayan Google Drive memulangkan ralat HTTP ${response.status}.`);
        }

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
          throw new Error(
            'Google Apps Script tidak dapat diakses secara terus. Pastikan tetapan Deploy Web App diset kepada "Anyone" (Siapa sahaja).'
          );
        }

        try {
          const parsed = JSON.parse(responseText);
          if (parsed && parsed.status === 'error') {
            throw new Error(parsed.message || 'Gagal menyimpan fail ke folder Google Drive.');
          }
          if (parsed && parsed.ok === false) {
            throw new Error(parsed.error || 'Gagal menyimpan fail ke folder Google Drive.');
          }
          if (parsed && parsed.url === 'Tiada PDF') {
            throw new Error('Data PDF tidak diterima oleh Google Apps Script.');
          }
          if (parsed && parsed.url && parsed.url !== 'Tiada PDF') {
            fileViewUrl = parsed.url;
          } else if (parsed && parsed.id) {
            fileViewUrl = `https://drive.google.com/file/d/${parsed.id}/view`;
          }
        } catch (jsonErr: any) {
          if (jsonErr instanceof SyntaxError) {
            // Non-JSON plain success text from script
          } else {
            throw jsonErr;
          }
        }
      } catch (fetchErr: any) {
        // Fallback for environments where cross-origin redirect headers are blocked (e.g. file:// offline HTML)
        if (fetchErr instanceof TypeError) {
          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: payload,
          });
        } else {
          throw fetchErr;
        }
      }

      setUploadedFileUrl(fileViewUrl);
      setShowDriveModal(true);
    } catch (err: any) {
      console.error('Google Drive Upload Error:', err);
      setErrorMessage(
        'Gagal menghantar ke Google Drive: ' + (err?.message || 'Sila semak sambungan internet dan cuba lagi.')
      );
    } finally {
      setIsDriveActionActive(false);
    }
  };

  const handleSaveLocalCopy = () => {
    if (lastGeneratedPdfRef.current) {
      lastGeneratedPdfRef.current.pdf.save(lastGeneratedPdfRef.current.fileName);
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
            <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
              Google Drive Sekolah
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Jana fail PDF dan simpan secara automatik ke dalam folder Google Drive SJK Chung Hua Bau
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Main Action Button: Hantar & Simpan ke Google Drive */}
            <button
              onClick={handleSendToGoogleDrive}
              disabled={isDriveActionActive || isGeneratingPdf}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
              title="Jana fail PDF dan simpan terus ke dalam folder Google Drive"
            >
              {isDriveActionActive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{driveStepText}</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 text-emerald-100" />
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
              title="Buka folder Google Drive di tab baharu"
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
              className="text-rose-600 font-bold hover:underline flex-shrink-0"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Google Drive Upload Success Modal */}
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
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Berjaya Disimpan ke Google Drive!</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">Laporan PDF telah dihantar secara automatik</p>
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
                    Fail PDF telah berjaya dimuat naik ke Folder Google Drive Sekolah:
                  </p>
                  <p className="text-xs font-mono font-semibold text-emerald-800 mt-0.5 break-all">
                    {generatedFileName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {uploadedFileUrl && (
                  <a
                    href={uploadedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Fail PDF</span>
                  </a>
                )}

                <a
                  href={GOOGLE_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Buka Folder Google Drive</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleSaveLocalCopy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-bold text-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Muat Turun Salinan PDF</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end text-xs text-slate-500">
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
