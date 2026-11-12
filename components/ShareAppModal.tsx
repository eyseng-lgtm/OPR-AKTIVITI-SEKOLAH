import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  ExternalLink, 
  Globe, 
  Smartphone, 
  MessageCircle, 
  Download 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Current app URL
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}&margin=10`;

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Sila gunakan Sistem Penjana Laporan Satu Muka Surat (OPR 2026) ini secara percuma. Anda boleh pasang terus di telefon Android atau iPhone:\n\n${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(
      `Sistem Penjana Laporan Satu Muka Surat (OPR 2026) - Boleh dipasang di telefon & diguna offline:\n${appUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-blue-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Globe className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Terbitkan & Kongsi Aplikasi Percuma</h3>
              <p className="text-xs text-emerald-200 mt-0.5">Aplikasi anda sedia digunakan secara percuma</p>
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700">
          {/* Quick Explanation */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
            <p className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Aplikasi ini telah diterbitkan secara langsung (*Live*)!</span>
            </p>
            <p className="leading-relaxed">
              Pautan di bawah boleh dibuka oleh mana-mana guru atau pengguna di telefon Android, iPhone, tablet atau komputer tanpa perlu membayar apa-apa.
            </p>
          </div>

          {/* Copy URL Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pautan Rasmi Aplikasi (Live Web URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-100 border border-slate-300 rounded-xl text-slate-800 outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Disalin!' : 'Salin Pautan'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
              <img 
                src={qrUrl} 
                alt="QR Code Aplikasi" 
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-slate-900 text-sm">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Imbas Kod QR dengan Telefon</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guru boleh buka kamera telefon untuk imbas kod ini, dan terus pasang aplikasi ke skrin utama telefon secara percuma.
              </p>
              <a 
                href={qrUrl}
                download="QR_Code_OPR_2026.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-1"
              >
                <Download className="w-3 h-3" />
                <span>Muat Turun Imej Kod QR (untuk dicetak di bilik guru)</span>
              </a>
            </div>
          </div>

          {/* Quick Share to School Groups */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Kongsi Terus ke Kumpulan Sekolah
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Group</span>
              </button>
              <button
                onClick={shareToTelegram}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Telegram Sekolah</span>
              </button>
            </div>
          </div>

          {/* Additional Free Deployment Platforms */}
          <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">
              Pilihan Hos Percuma Alternatif (Jika Mahu Domain Khas):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Vercel / Netlify / Cloudflare Pages</strong>: Muat naik kod ke GitHub percuma, sambung ke Vercel untuk dapatkan pautan kekal seperti <code>opr-sekolah.vercel.app</code> tanpa kos.
              </li>
              <li>
                <strong>PWA Tanpa Yuran Gedung</strong>: Anda tidak perlu membayar yuran pendaftaran Google Play ($25) atau Apple App Store ($99/tahun) kerana aplikasi PWA ini dipasang terus daripada pelayar web!
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
