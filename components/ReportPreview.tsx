import React, { forwardRef } from 'react';
import { ReportData, ReportImage } from '../types';

interface Props {
  data: ReportData;
  images: ReportImage[];
  isPrintOnly?: boolean;
}

export const ReportPreview = forwardRef<HTMLDivElement, Props>(({ data, images, isPrintOnly = false }, ref) => {
  // Theme color styles
  const getThemeStyles = () => {
    switch (data.temaWarna) {
      case 'green':
        return {
          headerBg: 'bg-emerald-800 text-white',
          borderCol: 'border-emerald-900',
          tableHeaderBg: 'bg-emerald-50 text-emerald-950 font-bold',
          tableBorder: 'border-emerald-800',
          accentText: 'text-emerald-900',
          lineBorder: 'border-emerald-900',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'maroon':
        return {
          headerBg: 'bg-rose-950 text-white',
          borderCol: 'border-rose-950',
          tableHeaderBg: 'bg-rose-50 text-rose-950 font-bold',
          tableBorder: 'border-rose-900',
          accentText: 'text-rose-950',
          lineBorder: 'border-rose-950',
          badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        };
      case 'navy':
        return {
          headerBg: 'bg-slate-900 text-white',
          borderCol: 'border-black',
          tableHeaderBg: 'bg-slate-100 text-black font-bold',
          tableBorder: 'border-black',
          accentText: 'text-black',
          lineBorder: 'border-black',
          badgeBg: 'bg-gray-100 text-black border-gray-400',
        };
      case 'blue':
      default:
        return {
          headerBg: 'bg-blue-900 text-white',
          borderCol: 'border-blue-950',
          tableHeaderBg: 'bg-blue-50 text-blue-950 font-bold',
          tableBorder: 'border-blue-950',
          accentText: 'text-blue-950',
          lineBorder: 'border-blue-950',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        };
    }
  };

  const theme = getThemeStyles();
  const isCompact = data.fontSizeMode === 'compact';

  // Responsive padding & text size for compact vs normal
  const cellPadding = isCompact ? 'px-2 py-1' : 'px-2.5 py-1.5';
  const tableFontSize = isCompact ? 'text-[10px]' : 'text-[11px]';
  const headerFontSize = isCompact ? 'text-[13px]' : 'text-[15px]';
  const photoHeight = isCompact ? 'h-[92px]' : 'h-[105px]';

  return (
    <div
      ref={ref}
      id="report-paper-a4"
      className={`bg-white text-black mx-auto shadow-2xl print:shadow-none print:m-0 print:border-none ${
        isPrintOnly ? '' : 'border border-slate-300'
      }`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        maxHeight: '297mm',
        padding: isCompact ? '10mm 12mm' : '12mm 14mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
      }}
    >
      {/* Top Header Section */}
      <div>
        <div className={`flex items-center gap-4 pb-2.5 mb-2 border-b-2 ${theme.lineBorder}`}>
          {data.logoSekolah ? (
            <img
              src={data.logoSekolah}
              alt="School Logo"
              className="w-16 h-16 object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center font-bold">
              LOGO
            </div>
          )}

          <div className="flex-1 text-center pr-4">
            <h1 className={`font-black tracking-wide ${headerFontSize} ${theme.accentText}`}>
              {data.namaSekolah || 'SJK CHUNG HUA BAU'}
            </h1>
            <h2 className={`font-extrabold uppercase text-[12px] tracking-wider mt-0.5 ${theme.accentText}`}>
              LAPORAN SATU MUKA SURAT (OPR) {data.tahun || '2026'}
            </h2>
            <p className="text-[9px] text-slate-600 mt-0.5">
              {data.alamatSekolah || 'Sekolah Jenis Kebangsaan Chung Hua Bau, 94000 Bau, Sarawak'}
            </p>
          </div>
        </div>

        {/* Content Table */}
        <table 
          className={`w-full border-collapse border ${theme.tableBorder} ${tableFontSize} leading-tight`}
          style={{ tableLayout: 'fixed' }}
        >
          <tbody>
            {/* Row 1: Program Name */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`w-[26%] ${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Nama Program
              </td>
              <td 
                colSpan={3} 
                className={`font-black uppercase tracking-wide text-slate-900 ${cellPadding} ${isCompact ? 'text-[11px]' : 'text-[12px]'}`}
              >
                {data.namaProgram || '-'}
              </td>
            </tr>

            {/* Row 2: Anjuran */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Anjuran
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding} font-medium`}>
                {data.anjuran || '-'}
              </td>
            </tr>

            {/* Row 3: Tarikh & Masa */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Tarikh
              </td>
              <td className={`w-[30%] border-r ${theme.tableBorder} text-slate-900 ${cellPadding}`}>
                {data.tarikh || '-'}
              </td>
              <td className={`w-[18%] ${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Masa
              </td>
              <td className={`w-[26%] text-slate-900 ${cellPadding}`}>
                {data.masa || '-'}
              </td>
            </tr>

            {/* Row 4: Tempat & Bilangan */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Tempat
              </td>
              <td className={`border-r ${theme.tableBorder} text-slate-900 ${cellPadding}`}>
                {data.tempat || '-'}
              </td>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Kehadiran
              </td>
              <td className={`text-slate-900 ${cellPadding} font-medium`}>
                {data.bilanganMurid ? `${data.bilanganMurid} Murid` : ''}
                {data.bilanganGuru ? `, ${data.bilanganGuru} Guru` : ''}
                {!data.bilanganMurid && !data.bilanganGuru ? '-' : ''}
              </td>
            </tr>

            {/* Row 5: Sasaran */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Kumpulan Sasaran
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding}`}>
                {data.sasaran || '-'}
              </td>
            </tr>

            {/* Row 6: Objektif */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Objektif
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding} whitespace-pre-wrap leading-relaxed`}>
                {data.objektif || '-'}
              </td>
            </tr>

            {/* Row 7: Aktiviti */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Ringkasan Aktiviti
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding} whitespace-pre-wrap leading-relaxed`}>
                {data.aktiviti || '-'}
              </td>
            </tr>

            {/* Row 8: Kekuatan & Kelemahan */}
            <tr className={`border-b ${theme.tableBorder}`}>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Kekuatan Program
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding} whitespace-pre-wrap leading-relaxed`}>
                {data.kekuatan || '-'}
              </td>
            </tr>

            <tr>
              <td className={`${theme.tableHeaderBg} border-r ${theme.tableBorder} ${cellPadding} uppercase font-bold text-[10px]`}>
                Kekangan & Penambahbaikan
              </td>
              <td colSpan={3} className={`text-slate-900 ${cellPadding} whitespace-pre-wrap leading-relaxed`}>
                <div>
                  <span className="font-semibold text-slate-800">Kekangan: </span>
                  {data.kelemahan || '-'}
                </div>
                {data.penambahbaikan && (
                  <div className="mt-1">
                    <span className="font-semibold text-slate-800">Cadangan Penambahbaikan: </span>
                    {data.penambahbaikan}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Photo Gallery Grid (Maksimum 4 Keping) */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-[10px] font-black uppercase tracking-wider ${theme.accentText} flex items-center gap-1`}>
              <span>GAMBAR AKTIVITI / DOKUMENTASI</span>
            </h3>
            <span className="text-[9px] text-slate-500 italic">4 keping gambar pilihan</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((slotIdx) => {
              const img = images[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={`border ${theme.tableBorder} bg-slate-50 p-1 flex flex-col justify-between rounded-sm`}
                  style={{ minHeight: isCompact ? '105px' : '120px' }}
                >
                  <div className={`w-full ${photoHeight} bg-slate-200 overflow-hidden flex items-center justify-center relative`}>
                    {img ? (
                      <img
                        src={img.url}
                        alt={`Aktiviti ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <svg className="w-5 h-5 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[8px] font-medium block">Tiada Gambar {slotIdx + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-center">
                    <p className="text-[8px] font-bold text-slate-800 line-clamp-1">
                      {img ? img.caption : `Foto ${slotIdx + 1}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signatures & Footer Section */}
      <div className="pt-2">
        <div className="flex justify-between items-end px-4">
          {/* Disediakan oleh */}
          <div className="text-center w-[160px]">
            <p className="text-[9px] text-slate-600 mb-9">Disediakan oleh,</p>
            <div className={`border-b border-black w-full mb-1`}></div>
            <p className="text-[9.5px] font-bold text-slate-900 uppercase leading-none">
              {data.disediakanOleh || '(..................................................)'}
            </p>
            <p className="text-[8.5px] text-slate-600 mt-0.5 leading-tight">
              {data.jawatanDisediakan || 'Penyelaras Program'}
            </p>
          </div>

          {/* Official Stamp Box in middle */}
          <div className="text-center px-2 pb-1">
            <div className="w-20 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center text-[7.5px] text-slate-400">
              Cop Rasmi Sekolah
            </div>
          </div>

          {/* Disahkan oleh */}
          <div className="text-center w-[160px]">
            <p className="text-[9px] text-slate-600 mb-9">Disahkan oleh,</p>
            <div className={`border-b border-black w-full mb-1`}></div>
            <p className="text-[9.5px] font-bold text-slate-900 uppercase leading-none">
              {data.disahkanOleh || '(..................................................)'}
            </p>
            <p className="text-[8.5px] text-slate-600 mt-0.5 leading-tight">
              {data.jawatanDisahkan || 'Guru Besar'}
            </p>
          </div>
        </div>

        {/* Small School Footnote */}
        <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7.5px] text-slate-400">
          <span>Sistem Pelaporan OPR Sekolah Rendah & Menengah (PWA Mobile & Web)</span>
          <span>SJK CHUNG HUA BAU &bull; {data.tahun || '2026'}</span>
        </div>
      </div>
    </div>
  );
});

ReportPreview.displayName = 'ReportPreview';
