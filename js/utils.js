// Utility Functions for Amalan Tracking App

// Date utilities
const DateUtils = {
    /**
     * Get current date in YYYY-MM-DD format
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Get current week number within the month (1-4)
     */
    getCurrentWeek() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfMonth = now.getDate();
        return Math.ceil(dayOfMonth / 7);
    },

    /**
     * Get current month (1-12)
     */
    getCurrentMonth() {
        return new Date().getMonth() + 1;
    },

    /**
     * Get current year
     */
    getCurrentYear() {
        return new Date().getFullYear();
    },

    /**
     * Get month name in Indonesian
     */
    getMonthName(month) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[month - 1] || '';
    },

    /**
     * Format date to Indonesian format
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = this.getMonthName(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    },

    /**
     * Get week range dates
     */
    getWeekRange(weekNumber, month, year) {
        const startDate = ((weekNumber - 1) * 7) + 1;
        const endDate = Math.min(weekNumber * 7, new Date(year, month, 0).getDate());
        return { startDate, endDate };
    }
};

// Storage utilities
const StorageUtils = {
    /**
     * Set item in localStorage with JSON encoding
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with JSON decoding
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// UI utilities
const UIUtils = {
    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastMessage) return;

        // Remove existing type classes
        toast.className = 'toast';
        
        // Add new type class
        if (type !== 'info') {
            toast.classList.add(type);
        }

        toastMessage.textContent = message;
        toast.classList.add('show');

        // Auto hide
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    /**
     * Set button loading state
     */
    setButtonLoading(button, loading = true) {
        if (!button) return;

        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.btn-text');

        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            if (spinner) spinner.style.display = 'block';
            if (text) text.style.opacity = '0';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (spinner) spinner.style.display = 'none';
            if (text) text.style.opacity = '1';
        }
    },

    /**
     * Validate form input
     */
    validateInput(input, rules = {}) {
        const value = input.value.trim();
        const errors = [];

        // Required validation
        if (rules.required && !value) {
            errors.push('Field ini wajib diisi');
        }

        // Minimum length validation
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Minimal ${rules.minLength} karakter`);
        }

        // Maximum length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Maksimal ${rules.maxLength} karakter`);
        }

        // Number validation
        if (rules.isNumber && value && isNaN(value)) {
            errors.push('Harus berupa angka');
        }

        // Minimum value validation
        if (rules.min && parseFloat(value) < rules.min) {
            errors.push(`Minimal ${rules.min}`);
        }

        // Maximum value validation
        if (rules.max && parseFloat(value) > rules.max) {
            errors.push(`Maksimal ${rules.max}`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Show input validation error
     */
    showInputError(input, message) {
        const group = input.closest('.input-group') || input.closest('.form-group');
        if (!group) return;

        // Remove existing error state
        this.clearInputError(input);

        // Add error class
        group.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        group.appendChild(errorElement);
    },

    /**
     * Clear input validation error
     */
    clearInputError(input) {
        const group = input.closest('.input-group') || input.closest('.form-group');
        if (!group) return;

        group.classList.remove('error');
        const existingError = group.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    },

    /**
     * Animate page transition
     */
    animatePageTransition(fromPage, toPage) {
        if (fromPage) {
            fromPage.classList.add('page-exit');
            setTimeout(() => {
                fromPage.style.display = 'none';
                fromPage.classList.remove('page-exit');
            }, 250);
        }

        if (toPage) {
            toPage.style.display = 'block';
            toPage.classList.add('page-enter');
            setTimeout(() => {
                toPage.classList.remove('page-enter');
            }, 250);
        }
    }
};

// Data formatting utilities
const FormatUtils = {
    /**
     * Format number with thousand separators
     */
    formatNumber(number) {
        return new Intl.NumberFormat('id-ID').format(number);
    },

    /**
     * Format percentage
     */
    formatPercentage(value, total) {
        if (total === 0) return '0%';
        const percentage = (value / total) * 100;
        return `${percentage.toFixed(1)}%`;
    },

    /**
     * Truncate text
     */
    truncateText(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Capitalize first letter
     */
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    /**
     * Generate random ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Validation utilities
const ValidationUtils = {
    /**
     * Validate member name
     */
    isValidMember(memberName) {
        const validMembers = ['ATK', 'AYS', 'FTR', 'WIN'];
        return validMembers.includes(memberName);
    },

    /**
     * Validate week number
     */
    isValidWeek(week) {
        return week >= 1 && week <= 4;
    },

    /**
     * Validate month
     */
    isValidMonth(month) {
        return month >= 1 && month <= 12;
    },

    /**
     * Validate year
     */
    isValidYear(year) {
        const currentYear = new Date().getFullYear();
        return year >= 2020 && year <= currentYear + 10;
    },

    /**
     * Validate amalan value
     */
    isValidAmalanValue(value) {
        return !isNaN(value) && value >= 0 && value <= 9999;
    }
};

// URL utilities
const URLUtils = {
    /**
     * Get URL parameter
     */
    getParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    /**
     * Set URL parameter
     */
    setParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },

    /**
     * Remove URL parameter
     */
    removeParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    },

    /**
     * Navigate to page with parameters
     */
    navigateTo(page, params = {}) {
        const url = new URL(page, window.location.origin);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        window.location.href = url.toString();
    }
};

// Network utilities
const NetworkUtils = {
    /**
     * Check if online
     */
    isOnline() {
        return navigator.onLine;
    },

    /**
     * Wait for network
     */
    async waitForNetwork(timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (this.isOnline()) {
                resolve(true);
                return;
            }

            const timer = setTimeout(() => {
                window.removeEventListener('online', onOnline);
                reject(new Error('Network timeout'));
            }, timeout);

            const onOnline = () => {
                clearTimeout(timer);
                window.removeEventListener('online', onOnline);
                resolve(true);
            };

            window.addEventListener('online', onOnline);
        });
    }
};

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other modules
window.DateUtils = DateUtils;
window.StorageUtils = StorageUtils;
window.UIUtils = UIUtils;
window.FormatUtils = FormatUtils;
window.ValidationUtils = ValidationUtils;
window.URLUtils = URLUtils;
window.NetworkUtils = NetworkUtils;
window.debounce = debounce;
window.throttle = throttle;