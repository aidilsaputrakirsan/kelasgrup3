// 📄 src/utils/constants.js - MINIMAL UPDATE (Tambah ini saja)

export const MEMBERS = ['ATK', 'AYS', 'FTR', 'WIN', 'HMA']

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

export const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbxWi7obQu3HU4aB7zTtUpH3N0lg3ozmbfox9Xq1zB0mrChb9NfwpT36SbrCPauI_I60/exec',
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

export const AMALAN_CONFIG = {
  'Dzikir pagi/petang': { 
    dailyText: '1x/hari', 
    weeklyTarget: 7 
  },
  'Tilawah': { 
    dailyText: '1 juz/hari', 
    weeklyTarget: 7 
  },
  'Shalat tepat waktu': { 
    dailyText: '5x/hari', 
    weeklyTarget: 35 
  },
  'Shalat malam': { 
    dailyText: '3x/pekan', 
    weeklyTarget: 3 
  },
  'Shalat Dhuha': { 
    dailyText: '3x/pekan', 
    weeklyTarget: 3 
  },
  'Puasa Sunnah': { 
    dailyText: '3x/pekan', 
    weeklyTarget: 3 
  },
  'Istighfar': { 
    dailyText: '100x/hari', 
    weeklyTarget: 700 
  },
  'Shalawat': { 
    dailyText: '100x/hari', 
    weeklyTarget: 700 
  },
  'Membaca Buku': { 
    dailyText: '1x/pekan', 
    weeklyTarget: 1 
  },
  'Infaq Harian': { 
    dailyText: '1x/hari', 
    weeklyTarget: 7 
  },
  'Doa kemenangan dakwah dan umat islam': { 
    dailyText: '1x/hari', 
    weeklyTarget: 7 
  }
}