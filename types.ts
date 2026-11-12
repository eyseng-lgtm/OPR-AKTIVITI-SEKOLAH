export interface ReportImage {
  id: string;
  url: string;
  caption: string;
}

export interface ReportData {
  namaSekolah: string;
  kodSekolah: string;
  alamatSekolah: string;
  logoSekolah: string;
  tahun: string;
  namaProgram: string;
  anjuran: string;
  tarikh: string;
  masa: string;
  tempat: string;
  sasaran: string;
  bilanganMurid: string;
  bilanganGuru?: string;
  objektif: string;
  aktiviti: string;
  kekuatan: string;
  kelemahan: string;
  penambahbaikan?: string;
  disediakanOleh: string;
  jawatanDisediakan: string;
  disahkanOleh: string;
  jawatanDisahkan: string;
  temaWarna: 'blue' | 'green' | 'maroon' | 'navy';
  fontSizeMode: 'normal' | 'compact';
}

export const INITIAL_REPORT_DATA: ReportData = {
  namaSekolah: 'SJK CHUNG HUA BAU',
  kodSekolah: 'YBC1303',
  alamatSekolah: 'Sekolah Jenis Kebangsaan Chung Hua Bau, 94000 Bau, Sarawak',
  logoSekolah: 'https://i.postimg.cc/x8kSSswX/7bau25-removebg-preview-(1).png',
  tahun: '2026',
  namaProgram: 'KEJOHANAN SUKAN TAHUNAN KALI KE-45',
  anjuran: 'Unit Kokurikulum SJK Chung Hua Bau',
  tarikh: '2026-06-18',
  masa: '7:30 Pagi - 12:30 Tengah Hari',
  tempat: 'Padang Sekolah SJK Chung Hua Bau',
  sasaran: 'Semua Murid Tahun 1 hingga Tahun 6 dan Prasekolah',
  bilanganMurid: '320',
  bilanganGuru: '28',
  objektif: '1. Memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan murid.\n2. Mencungkil bakat baharu murid dalam acara balapan dan padang.\n3. Mengukuhkan semangat kerjasama dan perpaduan antara murid, guru serta ibu bapa.',
  aktiviti: '1. Perbarisan lintas hormat rumah sukan (Merah, Biru, Hijau, Kuning).\n2. Ucapan perasmian oleh YDP PIBG dan Guru Besar.\n3. Acara balapan 50m, 100m, 4x100m dan sukaneka tahap 1.\n4. Acara jemputan ibu bapa dan penyampaian hadiah serta piala pusingan.',
  kekuatan: '1. Sambutan dan kehadiran murid serta ibu bapa amat menggalakkan.\n2. Kerjasama padu antara guru-guru dan pihak PIBG memastikan kelancaran acara.\n3. Keadaan cuaca yang baik dan peralatan sukan yang lengkap.',
  kelemahan: 'Kawasan tempat duduk penonton dan khemah murid terhad disebabkan faktor ruang padang.',
  penambahbaikan: 'Menyediakan khemah tambahan dan sistem pembesar suara tanpa wayar di setiap stesen sukaneka.',
  disediakanOleh: 'Cikgu Wong Siew Ling',
  jawatanDisediakan: 'Setiausaha Sukan SJK Chung Hua Bau',
  disahkanOleh: 'Encik Chong Lee Vun',
  jawatanDisahkan: 'Guru Besar SJK Chung Hua Bau',
  temaWarna: 'blue',
  fontSizeMode: 'normal',
};

export interface SamplePreset {
  title: string;
  subtitle: string;
  data: Partial<ReportData>;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    title: 'Kejohanan Sukan Tahunan',
    subtitle: 'Acara sukan dan balapan sekolah',
    data: {
      namaProgram: 'KEJOHANAN SUKAN TAHUNAN KALI KE-45',
      anjuran: 'Unit Kokurikulum & Panitia PJPK',
      masa: '7:30 Pagi - 12:30 Tengah Hari',
      tempat: 'Padang SJK Chung Hua Bau',
      sasaran: 'Semua Murid Tahun 1 - 6',
      bilanganMurid: '320',
      bilanganGuru: '28',
      objektif: '1. Memupuk semangat kesukanan dan gaya hidup sihat.\n2. Mencungkil bakat atlet cilik untuk MSSD Bau.\n3. Mengukuhkan silaturahim guru, murid dan ibu bapa.',
      aktiviti: '1. Perbarisan lintas hormat kontinjen rumah sukan.\n2. Upacara menaikkan bendera kejohanan dan ikrar sukan.\n3. Acara balapan 50m, 100m, 4x100m dan sukaneka.\n4. Acara pegawai & PIBG serta majlis penutupan.',
      kekuatan: 'Disiplin murid cemerlang dan sokongan PIBG yang sangat padu dari segi tajaan dan bantuan keselamatan.',
      kelemahan: 'Masa acara lari berganti-ganti sedikit lewat daripada jadual asal.',
      penambahbaikan: 'Penyelarasan masa pendaftaran peserta di khemah marshall perlu diperkemas.',
      disediakanOleh: 'Cikgu Wong Siew Ling',
      jawatanDisediakan: 'Setiausaha Sukan',
    },
  },
  {
    title: 'Program Motivasi & Kecemerlangan',
    subtitle: 'Bengkel teknik menjawab & sahsiah',
    data: {
      namaProgram: 'BENGKEL MOTIVASI DAN TEKNIK MENJAWAB SOALAN TAHUN 6',
      anjuran: 'Unit Bimbingan & Kaunseling bersama Panitia Bahasa Melayu & Matematik',
      masa: '8:00 Pagi - 1:00 Petang',
      tempat: 'Dewan Serbaguna Chung Hua Bau',
      sasaran: 'Semua Murid Tahun 6 (6A, 6B)',
      bilanganMurid: '58',
      bilanganGuru: '6',
      objektif: '1. Mendedahkan teknik menjawab format instrumen terkini PBD & UASA.\n2. Meningkatkan keyakinan diri dan motivasi murid sebelum peperiksaan.\n3. Membimbing kaedah pengurusan masa belajar di rumah.',
      aktiviti: '1. Ceramah motivasi kecemerlangan diri oleh penceramah jemputan JPN.\n2. Sesi bedah modul soalan berformat UASA bersama fasilitator.\n3. Latihan dalam kumpulan (LDK) dan pembentangan murid.',
      kekuatan: 'Murid memberi tumpuan sepenuhnya dan modul yang dibekalkan amat praktikal dan mudah difahami.',
      kelemahan: 'Masa bagi sesi soal jawab bersama penceramah agak suntuk.',
      penambahbaikan: 'Menambah slot bengkel lanjutan pada hari Sabtu akan datang.',
      disediakanOleh: 'Puan Cindy Tan Mei Hua',
      jawatanDisediakan: 'Guru Bimbingan & Kaunseling',
    },
  },
  {
    title: 'Sambutan Bulan Kemerdekaan',
    subtitle: 'Aktiviti patriotisme & kebudayaan',
    data: {
      namaProgram: 'SAMBUTAN BULAN KEMERDEKAAN KE-69 PERINGKAT SEKOLAH',
      anjuran: 'Panitia Sejarah & Panitia Pendidikan Seni Visual',
      masa: '8:00 Pagi - 11:30 Pagi',
      tempat: 'Dewan Terbuka SJK Chung Hua Bau',
      sasaran: 'Seluruh Warga Sekolah',
      bilanganMurid: '315',
      bilanganGuru: '26',
      objektif: '1. Menyemai semangat patriotisme dan cinta akan tanah air.\n2. Menghargai jasa tokoh perjuangan kemerdekaan negara.\n3. Mengasah kreativiti murid melalui pertandingan melukis poster.',
      aktiviti: '1. Nyanyian lagu Negaraku, Ibu Pertiwiku dan lagu patriotik Jalur Gemilang.\n2. Persembahan koir dan deklamasi sajak kemerdekaan.\n3. Pertandingan pakaian tradisional merdeka dan kuiz kemerdekaan.',
      kekuatan: 'Semangat perpaduan dan penyertaan murid berbilang kaum sangat membanggakan.',
      kelemahan: 'Sistem audio berhadapan gangguan teknikal kecil di awal majlis.',
      penambahbaikan: 'Ujian teknikal sistem pembesar suara perlu dilakukan sehari lebih awal.',
      disediakanOleh: 'Encik Lee Kok Keong',
      jawatanDisediakan: 'Ketua Panitia Sejarah',
    },
  },
  {
    title: 'Perkhemahan Badan Beruniform',
    subtitle: 'Unit beruniform Pengakap & Bulan Sabit Merah',
    data: {
      namaProgram: 'KEM KECEMERLANGAN BADAN BERUNIFORM 2026',
      anjuran: 'Unit Kokurikulum (Pasukan Pengakap Kanak-Kanak & BSMM)',
      masa: 'Jumaat 2:00 Petang - Sabtu 12:00 Tengah Hari',
      tempat: 'Tapak Perkhemahan Sekolah SJK Chung Hua Bau',
      sasaran: 'Murid Tahap 2 (Tahun 4, 5 dan 6)',
      bilanganMurid: '85',
      bilanganGuru: '15',
      objektif: '1. Membina ketahanan fizikal, mental dan disiplin murid.\n2. Menguasai kemahiran asas ikatan, gajet dan pertolongan cemas.\n3. Melatih sifat kepimpinan dan kerja berpasukan.',
      aktiviti: '1. Pemasangan khemah dan pertandingan membina gajet.\n2. Latihan kawad kaki asas dan ikatan tali temali.\n3. Malam kebudayaan dan unggun api bersama fasilitator.\n4. Ujian kembara malam dan kemas kini tapak kem.',
      kekuatan: 'Murid menunjukkan daya juang yang tinggi serta berdikari menguruskan keperluan diri.',
      kelemahan: 'Bekalan air di tapak perkhemahan agak perlahan pada waktu puncak pagi.',
      penambahbaikan: 'Menyediakan tong simpanan air kecemasan tambahan untuk perkhemahan akan datang.',
      disediakanOleh: 'Cikgu Brandon Bong',
      jawatanDisediakan: 'Penyelaras Badan Beruniform',
    },
  },
];
