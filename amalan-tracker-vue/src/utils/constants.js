// 📄 src/utils/constants.js - MINIMAL UPDATE (Tambah ini saja)

export const MEMBERS = ['ATK', 'AYS', 'FTR', 'WIN']

export const DEFAULT_AMALAN = [
  'Dzikir pagi/petang',
  'Tilawah',
  'Shalat tepat waktu',
  'Shalat malam',
  'Shalat Dhuha',
  'Puasa Sunnah',
  'Istighfar',
  'Shalawat',
  'Membaca Baqiyatush-shalihat',
  'Infaq Harian',
  'Doa kemenangan dakwah dan umat islam'
]

export const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzGAvCi6chszYzYghXkSMngFBf4gtqUj0SELO_jWWuSFKpehiZ_FLu4h_BT2i0G92FW/exec',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  // 🆕 HANYA TAMBAHKAN INI - diperlukan oleh improved API
  CACHE_DURATION: {
    DASHBOARD: 180000,    // 3 minutes
    WEEKLY_DATA: 120000,  // 2 minutes  
    MONTHLY_REPORT: 300000, // 5 minutes
    AMALAN_LIST: 3600000, // 1 hour
    CURRENT_WEEK: 3600000 // 1 hour
  }
}

export const AUTH_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  TIMESTAMP_KEY: 'auth_timestamp',
  REMEMBER_KEY: 'auth_remember',
  CREDENTIALS_KEY: 'saved_credentials'
}

// 🆕 OPTIONAL - Nice to have tapi tidak critical
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard', 
  DETAIL: '/detail',
  REPORT: '/report'
}