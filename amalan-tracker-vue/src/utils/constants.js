// 📄 src/utils/constants.js - TAMBAH UNTUK HARI HALANGAN

export const MEMBERS = ['ATK', 'AYS', 'FTR', 'WIN', 'HMA']

// ✅ DEFAULT_AMALAN: TIDAK DIUBAH - Hari Halangan bukan amalan
export const DEFAULT_AMALAN = [
  'Dzikir pagi/petang',
  'Tilawah', 
  'Shalat tepat waktu',
  'Shalat malam',
  'Shalat Dhuha',
  'Puasa Sunnah',
  'Istighfar',
  'Shalawat',
  'Membaca Buku',
  'Infaq Harian',
  'Doa kemenangan dakwah dan umat islam'
]

// ✅ TAMBAH: Konstanta untuk Hari Halangan
export const HARI_HALANGAN = {
  FIELD_NAME: 'Hari Halangan',
  MAX_DAYS: 7,  // Maksimal 7 hari per pekan
  DESCRIPTION: 'Jumlah hari halangan dalam pekan ini'
}

export const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzO8f__fF7QJzQsCBRXAEMtQQhy41WFgj1vZVq_VJLL7XBsYKwiGp4u8AAlGV6ZWThG/exec',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  CACHE_DURATION: {
    DASHBOARD: 180000,
    WEEKLY_DATA: 120000,  
    MONTHLY_REPORT: 300000,
    AMALAN_LIST: 3600000,
    CURRENT_WEEK: 3600000
  }
}

export const AUTH_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000,
  REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000,
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user', 
  TIMESTAMP_KEY: 'auth_timestamp',
  REMEMBER_KEY: 'auth_remember',
  CREDENTIALS_KEY: 'saved_credentials'
}

export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  DETAIL: '/detail',
  REPORT: '/report'
}

// ✅ AMALAN_CONFIG: TIDAK DIUBAH - Hari Halangan tidak punya target
export const AMALAN_CONFIG = {
  'Dzikir pagi/petang': { dailyText: '1x/hari', weeklyTarget: 7 },
  'Tilawah': { dailyText: '1 juz/hari', weeklyTarget: 7 },
  'Shalat tepat waktu': { dailyText: '5x/hari', weeklyTarget: 35 },
  'Shalat malam': { dailyText: '3x/pekan', weeklyTarget: 3 },
  'Shalat Dhuha': { dailyText: '3x/pekan', weeklyTarget: 3 },
  'Puasa Sunnah': { dailyText: '3x/pekan', weeklyTarget: 3 },
  'Istighfar': { dailyText: '100x/hari', weeklyTarget: 700 },
  'Shalawat': { dailyText: '100x/hari', weeklyTarget: 700 },
  'Membaca Buku': { dailyText: '1x/pekan', weeklyTarget: 1 },
  'Infaq Harian': { dailyText: '1x/hari', weeklyTarget: 7 },
  'Doa kemenangan dakwah dan umat islam': { dailyText: '1x/hari', weeklyTarget: 7 }
}