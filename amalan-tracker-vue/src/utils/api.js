// 📄 src/utils/api.js - FIXED VERSION (Backward Compatible)
import { API_CONFIG } from './constants'
import { MEMBERS } from './constants'

class AmalanAPI {
  constructor() {
    this.cache = new Map()
    this.requestQueue = []
    this.isProcessingQueue = false
  }

  async makeRequest(endpoint, data = {}, method = 'POST') {
    let lastError
    
    for (let attempt = 1; attempt <= API_CONFIG.RETRY_COUNT; attempt++) {
      try {
        const response = await this._performRequest(endpoint, data, method)
        return response
      } catch (error) {
        lastError = error
        console.warn(`Request attempt ${attempt} failed:`, error.message)
        
        if (attempt < API_CONFIG.RETRY_COUNT) {
          await this._delay(API_CONFIG.RETRY_DELAY * attempt)
        }
      }
    }
    
    throw lastError
  }

  async _performRequest(endpoint, data, method) {
    const url = new URL(API_CONFIG.BASE_URL)
    
    url.searchParams.set('action', endpoint)
    if (Object.keys(data).length > 0) {
      url.searchParams.set('data', JSON.stringify(data))
    }

    return new Promise((resolve, reject) => {
      let callbackName = 'jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000)
      
      while (window[callbackName]) {
        callbackName += '_' + Math.floor(Math.random() * 100)
      }
      
      url.searchParams.set('callback', callbackName)
      
      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error('Request timeout'))
      }, API_CONFIG.TIMEOUT)
      
      function cleanup() {
        clearTimeout(timeoutId)
        if (window[callbackName]) {
          try {
            delete window[callbackName]
          } catch (e) {
            window[callbackName] = undefined
          }
        }
        if (script && script.parentNode) {
          try {
            script.parentNode.removeChild(script)
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      }
      
      window[callbackName] = function(response) {
        cleanup()
        
        try {
          // 🔧 FIX: Kembalikan ke handling asli yang berfungsi
          if (!response || !response.success) {
            reject(new Error(response?.error || 'Request failed'))
            return
          }
          
          // 🔧 FIX: Return data langsung seperti kode asli
          resolve(response.data || response)
        } catch (error) {
          reject(new Error('Invalid server response: ' + error.message))
        }
      }
      
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      
      script.onerror = function(e) {
        cleanup()
        reject(new Error('Failed to load script'))
      }
      
      script.src = url.toString()
      
      try {
        document.head.appendChild(script)
      } catch (e) {
        cleanup()
        reject(new Error('Failed to add script to DOM: ' + e.message))
      }
    })
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  _getCacheKey(endpoint, data) {
    return `${endpoint}_${JSON.stringify(data)}`
  }

  _getFromCache(key, maxAge = 300000) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data
    }
    return null
  }

  _setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  _clearCacheByPattern(pattern) {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // 🔧 FIX: Kembalikan ke signature asli yang berfungsi
  async authenticate(username, password) {
    try {
      const response = await this.makeRequest('auth', {
        username: username.trim(),
        password: password.trim()
      })

      if (response && response.success) {
        return { success: true, message: response.message, token: response.token }
      } else {
        return { success: false, message: response.message || 'Login gagal' }
      }
    } catch (error) {
      console.error('🔐 Auth error:', error)
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat login. Silakan coba lagi.' 
      }
    }
  }

  // 🔧 FIX: Kembalikan ke signature asli (individual parameters)
  async getDashboardStats(week, month, year) {
    const targetWeek = week || this.getCurrentWeek()
    const targetMonth = month || this.getCurrentMonth()
    const targetYear = year || this.getCurrentYear()
    
    console.log('📊 getDashboardStats called with:', { targetWeek, targetMonth, targetYear })
    
    const cacheKey = `dashboard_stats_${targetWeek}_${targetMonth}_${targetYear}`
    const cached = this._getFromCache(cacheKey, 180000)
    
    if (cached) {
      console.log('📋 Returning cached dashboard data')
      return cached
    }

    try {
      const response = await this.makeRequest('getDashboardStats', {
        week: targetWeek,
        month: targetMonth,
        year: targetYear
      })

      console.log('📊 Dashboard stats response:', response)
      this._setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('❌ getDashboardStats error:', error)
      throw new Error('Gagal mengambil statistik dashboard')
    }
  }

  // 🔧 FIX: Kembalikan ke signature asli (individual parameters)
  async getWeeklyData(member, week, month, year) {
    console.log('📋 getWeeklyData called with:', { member, week, month, year })
    
    // 🔧 VALIDATION: Pastikan member valid
    if (!member || !MEMBERS.includes(member)) {
      throw new Error(`Invalid member: ${member}`)
    }
    
    const cacheKey = this._getCacheKey('weekly_data', { member, week, month, year })
    const cached = this._getFromCache(cacheKey, 120000)
    
    if (cached) {
      console.log('📋 Returning cached weekly data for', member)
      return cached
    }

    try {
      const response = await this.makeRequest('getWeeklyData', {
        member,
        week,
        month,
        year
      })

      console.log('📋 Weekly data response for', member, ':', response)
      this._setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('❌ getWeeklyData error for', member, ':', error)
      throw new Error('Gagal mengambil data mingguan')
    }
  }

  // 🔧 FIX: Kembalikan ke signature asli (individual parameters)
  async updateAmalan(member, amalanName, jumlah, week, month, year) {
    console.log('💾 updateAmalan called with:', { member, amalanName, jumlah, week, month, year })
    
    // 🔧 VALIDATION: Pastikan parameter valid
    if (!member || !['ATK', 'AYS', 'FTR', 'WIN', 'HMA'].includes(member)) {
      throw new Error(`Invalid member: ${member}`)
    }
    
    if (!amalanName || amalanName.trim() === '') {
      throw new Error(`Invalid amalan name: ${amalanName}`)
    }

    try {
      const response = await this.makeRequest('updateAmalan', {
        member,
        amalanName,
        jumlah: parseInt(jumlah) || 0,
        week,
        month,
        year,
        timestamp: new Date().toISOString()
      })

      console.log('💾 Update amalan response:', response)

      // Clear related caches
      this._clearCacheByPattern('dashboard_stats')
      this._clearCacheByPattern(`weekly_data_${member}`)

      return response
    } catch (error) {
      console.error('❌ updateAmalan error:', error)
      throw new Error('Gagal menyimpan data amalan')
    }
  }

  // 🆕 NEW: Monthly report (needed for Report View)
  async getMonthlyReport(month, year) {
    const targetMonth = month || this.getCurrentMonth()
    const targetYear = year || this.getCurrentYear()
    
    console.log('📈 getMonthlyReport called with:', { targetMonth, targetYear })
    
    const cacheKey = `monthly_report_${targetMonth}_${targetYear}`
    const cached = this._getFromCache(cacheKey, 300000)
    
    if (cached) {
      console.log('📈 Returning cached monthly report')
      return cached
    }

    try {
      const response = await this.makeRequest('getMonthlyReport', {
        month: targetMonth,
        year: targetYear
      })

      console.log('📈 Monthly report response:', response)
      this._setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('❌ getMonthlyReport error:', error)
      throw new Error('Gagal mengambil laporan bulanan')
    }
  }

  // Health check & utilities
  async healthCheck() {
    try {
      const response = await this.makeRequest('health')
      console.log('🏥 Health check response:', response)
      return response
    } catch (error) {
      console.error('❌ Health check error:', error)
      return { success: false, error: error.message }
    }
  }

  async syncData() {
    try {
      // Clear all caches
      this.cache.clear()
      console.log('🔄 Cache cleared for sync')
      
      // Test health check
      const health = await this.healthCheck()
      if (!health.success) {
        throw new Error('API health check failed')
      }

      console.log('✅ Data sync completed')
      return { success: true, message: 'Data berhasil disinkronisasi' }
    } catch (error) {
      console.error('❌ Sync error:', error)
      return { success: false, error: error.message }
    }
  }

  // Local utility methods
  getCurrentWeek() {
    const now = new Date()
    const dayOfMonth = now.getDate()
    return Math.ceil(dayOfMonth / 7)
  }

  getCurrentMonth() {
    return new Date().getMonth() + 1
  }

  getCurrentYear() {
    return new Date().getFullYear()
  }

  // Debug methods
  debugAPI() {
    console.log('🐛 API Debug Info:')
    console.log('Base URL:', API_CONFIG.BASE_URL)
    console.log('Current Week:', this.getCurrentWeek())
    console.log('Current Month:', this.getCurrentMonth())
    console.log('Current Year:', this.getCurrentYear())
    console.log('Cache Size:', this.cache.size)
    
    // Test health check
    this.healthCheck().then(response => {
      console.log('🏥 Health Check Result:', response)
    }).catch(error => {
      console.error('❌ Health Check Failed:', error)
    })
  }

  clearCache() {
    this.cache.clear()
    console.log('🗑️ Cache cleared')
  }
}

export const api = new AmalanAPI()