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

export const SENARAI_STAF: string[] = [
  'CHAI CHANG CHING',
  'KON SIEW CHOON',
  'TAY BOOM SENG',
  'BONG SZE LIANG',
  'BONG CHING CHING',
  'BONG FUI LING',
  'BONG SIAW CHIEN',
  'BONG SIEW BUI',
  'CHANG ZIANG CHENG',
  'CHIEN CHEN CHEN',
  'CHONG CHIEN PIN',
  'CHUA SIAW TING',
  'GOH LEE LING',
  'CHONG SWIN JOO',
  'KOH EE KIM',
  'LEE NYUK LIAN',
  'LEE TECK CHOO',
  'LIEW JOON LING',
  'LIEW MOY FOON',
  'LIEW SHEAU TYUG',
  'NURFARAH IZZATI BINTI ZAINUDIN',
  'HEE FUNG JIN',
  'TCHIN TZE LING',
  'TAN YEE YING',
  'JOYCE VOON ERN CZE',
  'PHANG KONG JAN',
  'ALVYIAN SONIA ANAK JUDO',
  'BONG KOK SIN',
  'ANGILIA JOSLINE ANAK TREN',
  'AUDREY ANAK MIDIN',
  'MARVIN ANAK JIOK',
];

export const INITIAL_REPORT_DATA: ReportData = {
  namaSekolah: 'SJK CHUNG HUA BAU',
  kodSekolah: 'YBC1303',
  alamatSekolah: 'Sekolah Jenis Kebangsaan Chung Hua Bau, 94000 Bau, Sarawak',
  logoSekolah: 'https://i.postimg.cc/x8kSSswX/7bau25-removebg-preview-(1).png',
  tahun: '2026',
  namaProgram: '',
  anjuran: '',
  tarikh: '',
  masa: '',
  tempat: '',
  sasaran: '',
  bilanganMurid: '',
  bilanganGuru: '',
  objektif: '',
  aktiviti: '',
  kekuatan: '',
  kelemahan: '',
  penambahbaikan: '',
  disediakanOleh: '',
  jawatanDisediakan: '',
  disahkanOleh: 'ENCIK CHAI CHANG CHING',
  jawatanDisahkan: 'Guru Besar SJK Chung Hua Bau',
  temaWarna: 'blue',
  fontSizeMode: 'normal',
};
