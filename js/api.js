// API Module for Google Apps Script Communication

// Configuration
const API_CONFIG = {
    // URL deployment Google Apps Script terbaru
    BASE_URL: 'https://script.google.com/macros/s/AKfycbxoPA7qwGjlwz5-o3BpsZ6m3D5o2qCdpyyLafJaljrh5b9djCp96m34P__6ioSg81fy/exec',
    TIMEOUT: 30000, // 30 seconds
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000 // 1 second
};

// API Class
class AmalanAPI {
    constructor() {
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
    }

    /**
     * Make HTTP request with retry logic
     */
    async makeRequest(endpoint, data = {}, method = 'POST') {
        let lastError;
        
        for (let attempt = 1; attempt <= API_CONFIG.RETRY_COUNT; attempt++) {
            try {
                const response = await this._performRequest(endpoint, data, method);
                return response;
            } catch (error) {
                lastError = error;
                console.warn(`Request attempt ${attempt} failed:`, error.message);
                
                if (attempt < API_CONFIG.RETRY_COUNT) {
                    await this._delay(API_CONFIG.RETRY_DELAY * attempt);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Perform actual HTTP request using JSONP for CORS bypass
     */
    async _performRequest(endpoint, data, method) {
        const url = new URL(API_CONFIG.BASE_URL);
        
        // Add endpoint and data as URL parameters
        url.searchParams.set('action', endpoint);
        if (Object.keys(data).length > 0) {
            url.searchParams.set('data', JSON.stringify(data));
        }

        return new Promise((resolve, reject) => {
            // Create unique callback name with more randomness
            const callbackName = 'jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
            
            // Ensure callback name is unique
            while (window[callbackName]) {
                callbackName += '_' + Math.floor(Math.random() * 100);
            }
            
            // Add callback parameter
            url.searchParams.set('callback', callbackName);
            
            // Create timeout
            const timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('Request timeout'));
            }, API_CONFIG.TIMEOUT);
            
            // Cleanup function
            function cleanup() {
                clearTimeout(timeoutId);
                if (window[callbackName]) {
                    try {
                        delete window[callbackName];
                    } catch (e) {
                        window[callbackName] = undefined;
                    }
                }
                if (script && script.parentNode) {
                    try {
                        script.parentNode.removeChild(script);
                    } catch (e) {
                        // Ignore cleanup errors
                    }
                }
            }
            
            // Create global callback function
            window[callbackName] = function(response) {
                console.log('📨 JSONP Response received:', response);
                
                cleanup();
                
                try {
                    // Check if response has error
                    if (!response || !response.success) {
                        reject(new Error(response?.error || 'Request failed'));
                        return;
                    }
                    
                    // Return the data part of response
                    resolve(response.data || response);
                    
                } catch (error) {
                    reject(new Error('Invalid server response: ' + error.message));
                }
            };
            
            // Create script tag for JSONP
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            
            // Better error handling
            script.onerror = function(e) {
                console.error('❌ Script loading error:', e);
                cleanup();
                reject(new Error('Failed to load script'));
            };
            
            script.onload = function() {
                console.log('📡 Script loaded successfully');
                // Don't cleanup here, let the callback handle it
            };
            
            script.src = url.toString();
            console.log('📡 JSONP Request:', script.src);
            
            // Add script to DOM
            try {
                document.head.appendChild(script);
            } catch (e) {
                cleanup();
                reject(new Error('Failed to add script to DOM: ' + e.message));
            }
        });
    }

    /**
     * Add request to queue for batch processing
     */
    async queueRequest(endpoint, data = {}) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                data,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            this._processQueue();
        });
    }

    /**
     * Process request queue
     */
    async _processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                const result = await this.makeRequest(request.endpoint, request.data);
                request.resolve(result);
            } catch (error) {
                request.reject(error);
            }

            // Small delay between requests to avoid overwhelming the server
            await this._delay(200);
        }

        this.isProcessingQueue = false;
    }

    /**
     * Utility delay function
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cache management
     */
    _getCacheKey(endpoint, data) {
        return `${endpoint}_${JSON.stringify(data)}`;
    }

    _getFromCache(key, maxAge = 300000) { // 5 minutes default
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < maxAge) {
            return cached.data;
        }
        return null;
    }

    _setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // === API ENDPOINTS ===

    /**
     * Authenticate user
     */
    async authenticate(username, password) {
        try {
            console.log('🔐 Authenticating user:', username);
            
            const response = await this.makeRequest('auth', {
                username: username.trim(),
                password: password.trim()
            });

            console.log('🔐 Auth response:', response);

            // Response is already the data part from server
            if (response && response.success) {
                StorageUtils.set('auth_token', response.token);
                StorageUtils.set('auth_timestamp', Date.now());
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Login gagal' };
            }
        } catch (error) {
            console.error('Authentication error:', error);
            return { 
                success: false, 
                message: 'Terjadi kesalahan saat login. Silakan coba lagi.' 
            };
        }
    }

    /**
     * Get current week data
     */
    async getCurrentWeek() {
        const cacheKey = 'current_week';
        const cached = this._getFromCache(cacheKey, 60000); // 1 minute cache
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.makeRequest('getCurrentWeek');
            this._setCache(cacheKey, response);
            return response;
        } catch (error) {
            console.error('Get current week error:', error);
            throw new Error('Gagal mengambil data pekan saat ini');
        }
    }

    /**
     * Get weekly data for specific member
     */
    async getWeeklyData(member, week, month, year) {
        if (!ValidationUtils.isValidMember(member)) {
            throw new Error('Nama anggota tidak valid');
        }

        const cacheKey = this._getCacheKey('weekly_data', { member, week, month, year });
        const cached = this._getFromCache(cacheKey, 120000); // 2 minutes cache
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.makeRequest('getWeeklyData', {
                member,
                week,
                month,
                year
            });

            this._setCache(cacheKey, response);
            return response;
        } catch (error) {
            console.error('Get weekly data error:', error);
            throw new Error('Gagal mengambil data mingguan');
        }
    }

    /**
     * Update amalan data
     */
    async updateAmalan(member, amalanName, jumlah, week = null, month = null, year = null) {
        if (!ValidationUtils.isValidMember(member)) {
            throw new Error('Nama anggota tidak valid');
        }

        if (!ValidationUtils.isValidAmalanValue(jumlah)) {
            throw new Error('Jumlah amalan tidak valid');
        }

        // Use current date if not specified
        const currentWeek = week || DateUtils.getCurrentWeek();
        const currentMonth = month || DateUtils.getCurrentMonth();
        const currentYear = year || DateUtils.getCurrentYear();

        try {
            const response = await this.queueRequest('updateAmalan', {
                member,
                amalanName,
                jumlah: parseInt(jumlah),
                week: currentWeek,
                month: currentMonth,
                year: currentYear,
                timestamp: DateUtils.getCurrentDate()
            });

            // ✅ Clear cache untuk semua weeks di bulan ini (bukan hanya week yang diupdate)
            for (let w = 1; w <= 4; w++) {
                const cacheKey = `dashboard_stats_${w}_${currentMonth}_${currentYear}`;
                this.cache.delete(cacheKey);
            }
            
            // Clear old cache key juga
            this.cache.delete('dashboard_stats');

            return response;
        } catch (error) {
            console.error('Update amalan error:', error);
            throw new Error('Gagal menyimpan data amalan');
        }
    }

    /**
     * Get monthly report
     */
    async getMonthlyReport(month, year) {
        if (!ValidationUtils.isValidMonth(month) || !ValidationUtils.isValidYear(year)) {
            throw new Error('Bulan atau tahun tidak valid');
        }

        const cacheKey = this._getCacheKey('monthly_report', { month, year });
        const cached = this._getFromCache(cacheKey, 300000); // 5 minutes cache
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.makeRequest('getMonthlyReport', {
                month,
                year
            });

            this._setCache(cacheKey, response);
            return response;
        } catch (error) {
            console.error('Get monthly report error:', error);
            throw new Error('Gagal mengambil laporan bulanan');
        }
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(week = null, month = null, year = null) {
        // Gunakan parameter yang dikirim, atau fallback ke current date
        const targetWeek = week || DateUtils.getCurrentWeek();
        const targetMonth = month || DateUtils.getCurrentMonth();
        const targetYear = year || DateUtils.getCurrentYear();
        
        // Cache key harus include week/month/year agar tidak bentrok
        const cacheKey = `dashboard_stats_${targetWeek}_${targetMonth}_${targetYear}`;
        const cached = this._getFromCache(cacheKey, 180000);
        
        if (cached) {
            return cached;
        }

        try {
            console.log(`📊 Getting dashboard stats for Week ${targetWeek}, Month ${targetMonth}, Year ${targetYear}`);
            
            const response = await this.makeRequest('getDashboardStats', {
                week: targetWeek,      // ✅ Gunakan week yang dipilih user
                month: targetMonth,
                year: targetYear
            });

            this._setCache(cacheKey, response);
            return response;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw new Error('Gagal mengambil statistik dashboard');
        }
    }

    /**
     * Get all amalan list
     */
    async getAmalanList() {
        const cacheKey = 'amalan_list';
        const cached = this._getFromCache(cacheKey, 3600000); // 1 hour cache
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.makeRequest('getAmalanList');
            this._setCache(cacheKey, response);
            return response;
        } catch (error) {
            console.error('Get amalan list error:', error);
            
            // Return default amalan list as fallback
            const defaultAmalan = [
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
            ];

            return { amalan: defaultAmalan };
        }
    }

    /**
     * Sync data (force refresh cache)
     */
    async syncData() {
        try {
            // ✅ Clear ALL cache (termasuk semua week variants)
            this.cache.clear();
            
            // Get fresh data untuk week yang sedang aktif
            const currentWeek = AppState.currentWeek || DateUtils.getCurrentWeek();
            const currentMonth = AppState.currentMonth || DateUtils.getCurrentMonth();
            const currentYear = AppState.currentYear || DateUtils.getCurrentYear();

            const promises = [
                this.getCurrentWeek(),
                this.getDashboardStats(currentWeek, currentMonth, currentYear),
                this.getAmalanList()
            ];

            const results = await Promise.all(promises);
            
            if (typeof UIUtils !== 'undefined' && UIUtils.showToast) {
                UIUtils.showToast('Data berhasil disinkronkan', 'success');
            }
            return { success: true, data: results };
        } catch (error) {
            console.error('Sync data error:', error);
            if (typeof UIUtils !== 'undefined' && UIUtils.showToast) {
                UIUtils.showToast('Gagal sinkronisasi data', 'error');
            }
            throw error;
        }
    }

    /**
     * Check API health
     */
    async healthCheck() {
        try {
            const response = await this.makeRequest('health');
            return response;
        } catch (error) {
            console.error('Health check error:', error);
            return { healthy: false, error: error.message };
        }
    }

    /**
     * Clear all cache
     */
    clearCache() {
        this.cache.clear();
        if (typeof UIUtils !== 'undefined' && UIUtils.showToast) {
            UIUtils.showToast('Cache berhasil dibersihkan', 'success');
        }
    }
}

// Create global API instance
const api = new AmalanAPI();

// Export for use in other modules
window.AmalanAPI = AmalanAPI;
window.api = api;

// Connection status monitoring
window.addEventListener('online', () => {
    if (typeof UIUtils !== 'undefined' && UIUtils.showToast) {
        UIUtils.showToast('Koneksi tersambung kembali', 'success');
    }
});

window.addEventListener('offline', () => {
    if (typeof UIUtils !== 'undefined' && UIUtils.showToast) {
        UIUtils.showToast('Koneksi terputus', 'warning');
    }
});

// Export configuration for settings page
window.API_CONFIG = API_CONFIG;