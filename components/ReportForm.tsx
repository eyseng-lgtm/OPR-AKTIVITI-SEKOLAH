import React, { ChangeEvent, useRef } from 'react';
import { 
  ReportData, 
  ReportImage, 
  SAMPLE_PRESETS 
} from '../types';
import { compressImage } from '../imageUtils';
import { 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  Upload, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  RotateCcw,
  BookOpen,
  Camera,
  Layers,
  Palette,
  ShieldAlert
} from 'lucide-react';

interface Props {
  data: ReportData;
  setData: React.Dispatch<React.SetStateAction<ReportData>>;
  images: ReportImage[];
  setImages: React.Dispatch<React.SetStateAction<ReportImage[]>>;
  onReset: () => void;
  onApplyPreset: (presetIndex: number) => void;
}

export const ReportForm: React.FC<Props> = ({
  data,
  setData,
  images,
  setImages,
  onReset,
  onApplyPreset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = (Array.from(files) as File[]).slice(0, 4 - images.length);
    const newImages: ReportImage[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.82);
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          url: compressedBase64,
          caption: `Gambar ${images.length + i + 1}: ${file.name.replace(/\.[^/.]+$/, '').slice(0, 30)}`,
        });
      } catch (err) {
        console.error('Image compression failed', err);
      }
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages].slice(0, 4));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const logoBase64 = await compressImage(file, 400, 400, 0.9);
      setData(prev => ({ ...prev, logoSekolah: logoBase64 }));
    } catch (err) {
      console.error('Logo upload error', err);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCaptionChange = (index: number, newCaption: string) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], caption: newCaption };
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Preset Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Muat Templat Contoh Pantas
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Klik untuk isi borang automatik</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApplyPreset(idx)}
              className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 active:scale-98 transition group flex flex-col justify-between"
            >
              <div className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 leading-tight">
                {preset.title}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {preset.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Form Title & Style Customizer */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Kandungan Laporan OPR</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Isi butiran di bawah. Semua maklumat akan disusun kemas dalam satu muka surat A4.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Color Theme Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Palette className="w-3.5 h-3.5 text-slate-300" />
              <select
                name="temaWarna"
                value={data.temaWarna}
                onChange={handleInputChange}
                aria-label="Pilih Warna Tema Laporan"
                className="bg-transparent text-xs text-white outline-none font-medium cursor-pointer"
              >
                <option value="blue" className="bg-slate-800">Tema Biru Rasmi</option>
                <option value="green" className="bg-slate-800">Tema Hijau KPM</option>
                <option value="maroon" className="bg-slate-800">Tema Merah Marun</option>
                <option value="navy" className="bg-slate-800">Tema Hitam Putih Klasik</option>
              </select>
            </div>

            {/* Compact Toggle */}
            <button
              type="button"
              onClick={() => setData(prev => ({ 
                ...prev, 
                fontSizeMode: prev.fontSizeMode === 'normal' ? 'compact' : 'normal' 
              }))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                data.fontSizeMode === 'compact'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Aktifkan jika teks panjang supaya muat 1 muka surat"
            >
              {data.fontSizeMode === 'compact' ? 'Mod Padat (Aktif)' : 'Mod Normal'}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Section 1: Maklumat Sekolah & Asas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>1. Maklumat Sekolah & Program</span>
              </h3>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tukar Logo Sekolah</span>
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NAMA SEKOLAH
                </label>
                <input
                  name="namaSekolah"
                  value={data.namaSekolah}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: SJK CHUNG HUA BAU"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TAHUN LAPORAN
                </label>
                <input
                  name="tahun"
                  value={data.tahun}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="2026"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ALAMAT SEKOLAH
                </label>
                <input
                  name="alamatSekolah"
                  value={data.alamatSekolah}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Alamat penuh sekolah"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NAMA PROGRAM / AKTIVITI <span className="text-rose-500">*</span>
                </label>
                <input
                  name="namaProgram"
                  value={data.namaProgram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition uppercase"
                  placeholder="Contoh: KEJOHANAN OLAHRAGA TAHUNAN KALI KE-45"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ANJURAN
                </label>
                <input
                  name="anjuran"
                  value={data.anjuran}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Unit Kokurikulum / Panitia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TARIKH PROGRAM
                </label>
                <input
                  type="date"
                  name="tarikh"
                  value={data.tarikh}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MASA
                </label>
                <input
                  name="masa"
                  value={data.masa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: 7:30 Pagi - 12:30 T/Hari"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TEMPAT
                </label>
                <input
                  name="tempat"
                  value={data.tempat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: Dewan Serbaguna / Padang Sekolah"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  BILANGAN PESERTA (MURID / GURU)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bilanganMurid"
                    value={data.bilanganMurid}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Murid: 320"
                  />
                  <input
                    type="number"
                    name="bilanganGuru"
                    value={data.bilanganGuru || ''}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Guru: 28"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KUMPULAN SASARAN
                </label>
                <input
                  name="sasaran"
                  value={data.sasaran}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: Semua Murid Tahun 1 hingga Tahun 6 dan Guru-guru"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Objektif & Pengisian */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>2. Objektif, Aktiviti & Penilaian</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    OBJEKTIF PROGRAM
                  </label>
                  <span className="text-[11px] text-slate-400">Gunakan format nombor (1, 2, 3...)</span>
                </div>
                <textarea
                  name="objektif"
                  value={data.objektif}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-sans leading-relaxed"
                  placeholder="1. Memupuk semangat kesukanan..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    RINGKASAN AKTIVITI YANG DIJALANKAN
                  </label>
                  <span className="text-[11px] text-slate-400">Ringkas dan padat</span>
                </div>
                <textarea
                  name="aktiviti"
                  value={data.aktiviti}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-sans leading-relaxed"
                  placeholder="1. Pendaftaran peserta... 2. Majlis perasmian..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KEKUATAN PROGRAM
                  </label>
                  <textarea
                    name="kekuatan"
                    value={data.kekuatan}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Contoh: Kerjasama guru dan kehadiran murid cemerlang..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KELEMAHAN / KEKANGAN
                  </label>
                  <textarea
                    name="kelemahan"
                    value={data.kelemahan}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Contoh: Kawasan tempat duduk terhad..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CADANGAN PENAMBAHBAIKAN
                </label>
                <input
                  name="penambahbaikan"
                  value={data.penambahbaikan || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: Menambah khemah kanopi dan sistem pembesar suara tambahan..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Gambar Aktiviti (Maksimum 4 Keping) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>3. Gambar Aktiviti (Maksimum 4 Keping)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gambar akan dimampatkan secara automatik agar tidak membebankan telefon anda.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 4}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition ${
                    images.length >= 4
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil / Pilih Gambar ({images.length}/4)</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {images.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/40 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-slate-400 group-hover:text-blue-600 group-hover:scale-105 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-3 group-hover:text-blue-700">
                  Klik untuk Memuat Naik Gambar dari Galeri atau Kamera Telefon
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format JPG, PNG atau WEBP (Maksimum 4 keping gambar untuk susun atur A4)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div 
                    key={img.id || idx}
                    className="relative bg-slate-50 rounded-xl border border-slate-200 p-2 flex flex-col gap-2 group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                      <img 
                        src={img.url} 
                        alt={`Aktiviti ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        Foto {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded-md shadow-md transition"
                        title="Padam gambar ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleCaptionChange(idx, e.target.value)}
                        placeholder={`Kapsyen gambar ${idx + 1}...`}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Pengesahan & Pegawai */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>4. Tandatangan & Pengesahan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase">Disediakan Oleh</span>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Nama Pegawai / Guru</label>
                  <input
                    name="disediakanOleh"
                    value={data.disediakanOleh}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white font-medium"
                    placeholder="Nama Guru Penyelaras"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Jawatan</label>
                  <input
                    name="jawatanDisediakan"
                    value={data.jawatanDisediakan}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white"
                    placeholder="Contoh: Setiausaha Sukan / Penyelaras"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase">Disahkan Oleh</span>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Nama Pentadbir</label>
                  <input
                    name="disahkanOleh"
                    value={data.disahkanOleh}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white font-medium"
                    placeholder="Nama Guru Besar / PK"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Jawatan</label>
                  <input
                    name="jawatanDisahkan"
                    value={data.jawatanDisahkan}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white"
                    placeholder="Contoh: Guru Besar SJK Chung Hua Bau"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Reset & Local Save info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Draf disimpan secara automatik dalam memori peranti anda.</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula Borang (Kosongkan)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
