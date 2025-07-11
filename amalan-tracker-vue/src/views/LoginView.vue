<!-- 📄 src/views/LoginView.vue - COMPREHENSIVE IMPROVEMENTS -->
<template>
  <div class="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <div class="w-full max-w-md animate-fade-in">
      <!-- Islamic Greeting -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-arabic leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </h1>
          <p class="text-sm sm:text-base text-gray-600 italic">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
        </div>
      </div>
      
      <!-- Login Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 transform hover:shadow-2xl transition-shadow duration-300">
        <!-- Header -->
        <div class="text-center p-4 sm:p-6 bg-gradient-to-r from-pink-500 to-purple-600">
          <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 animate-pulse-soft">
            <span class="text-2xl sm:text-3xl text-white">📿</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Amalan Tracker</h2>
          <p class="text-pink-100 text-sm sm:text-base">Silakan masuk untuk melanjutkan</p>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="p-4 sm:p-6 space-y-4 sm:space-y-6" autocomplete="on">
          <!-- Username Input -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
              <span class="text-red-500" aria-label="required">*</span>
            </label>
            <div class="relative">
              <input
                id="username"
                v-model="form.username"
                type="text"
                autocomplete="username"
                :class="inputClasses('username')"
                class="w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm sm:text-base min-h-[44px]"
                placeholder="Masukkan username"
                :disabled="isLoading"
                :aria-invalid="!!errors.username"
                :aria-describedby="errors.username ? 'username-error' : undefined"
                @blur="validateField('username')"
                @input="clearFieldError('username')"
              />
              <div v-if="form.username" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span class="text-green-500">✓</span>
              </div>
            </div>
            <div v-if="errors.username" id="username-error" class="text-red-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <span>⚠️</span>
              <span>{{ errors.username }}</span>
            </div>
          </div>
          
          <!-- Password Input -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
              <span class="text-red-500" aria-label="required">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :class="inputClasses('password')"
                class="w-full px-4 py-3 pr-12 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm sm:text-base min-h-[44px]"
                placeholder="Masukkan password"
                :disabled="isLoading"
                :aria-invalid="!!errors.password"
                :aria-describedby="errors.password ? 'password-error' : undefined"
                @blur="validateField('password')"
                @input="clearFieldError('password')"
              />
              <!-- Password visibility toggle -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors rounded"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :disabled="isLoading"
                tabindex="0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <div v-if="errors.password" id="password-error" class="text-red-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <span>⚠️</span>
              <span>{{ errors.password }}</span>
            </div>
          </div>
          
          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="rememberMe"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded transition-colors"
                :disabled="isLoading"
              />
              <label for="rememberMe" class="ml-2 text-sm text-gray-700 cursor-pointer">
                Ingat saya
              </label>
            </div>
            
            <button
              type="button"
              @click="showForgotPassword"
              class="text-sm text-pink-600 hover:text-pink-700 hover:underline transition-colors"
              :disabled="isLoading"
            >
              Lupa password?
            </button>
          </div>
          
          <!-- Login Attempts Warning -->
          <div v-if="loginAttempts >= 3" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3" role="alert">
            <div class="flex items-center gap-2">
              <span class="text-yellow-600">⚠️</span>
              <span class="text-yellow-800 text-sm">
                Terlalu banyak percobaan login. Silakan tunggu sebentar.
              </span>
            </div>
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !canSubmit || isRateLimited"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 focus:ring-2 focus:ring-pink-500/20 min-h-[44px] text-sm sm:text-base"
            :aria-label="isLoading ? 'Sedang masuk...' : 'Masuk ke aplikasi'"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Sedang masuk...</span>
            </span>
            <span v-else>Masuk</span>
          </button>
          
          
        </form>
        
        
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center max-w-xs mx-4">
          <div class="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span class="text-white text-xl">📿</span>
          </div>
          <div class="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-700 font-medium">Memverifikasi akun...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isLoading = ref(false)
const showPassword = ref(false)
const loginAttempts = ref(0)
const lastAttemptTime = ref(0)

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: ''
})

// Computed properties
const canSubmit = computed(() => {
  return form.username.trim() && form.password && !isRateLimited.value
})

const isRateLimited = computed(() => {
  if (loginAttempts.value < 3) return false
  
  const timeSinceLastAttempt = Date.now() - lastAttemptTime.value
  return timeSinceLastAttempt < 30000 // 30 seconds rate limit
})

// Methods
onMounted(() => {
  loadSavedCredentials()
  // Focus username field for better UX
  document.getElementById('username')?.focus()
})

function loadSavedCredentials() {
  try {
    const saved = localStorage.getItem('saved_credentials')
    if (saved) {
      const { username } = JSON.parse(saved)
      form.username = username
      form.rememberMe = true
      // Focus password field if username is pre-filled
      setTimeout(() => {
        document.getElementById('password')?.focus()
      }, 100)
    }
  } catch (e) {
    console.warn('Failed to load saved credentials:', e)
  }
}

function inputClasses(field) {
  if (errors[field]) {
    return 'border-red-300 bg-red-50 focus:border-red-500'
  }
  if (form[field]) {
    return 'border-green-300 bg-green-50 focus:border-green-500'
  }
  return 'border-gray-300 bg-white'
}

function validateField(field) {
  errors[field] = ''
  
  if (field === 'username') {
    if (!form.username.trim()) {
      errors.username = 'Username wajib diisi'
    } else if (form.username.length < 3) {
      errors.username = 'Username minimal 3 karakter'
    }
  }
  
  if (field === 'password') {
    if (!form.password) {
      errors.password = 'Password wajib diisi'
    } else if (form.password.length < 6) {
      errors.password = 'Password minimal 6 karakter'
    }
  }
}

function clearFieldError(field) {
  if (errors[field]) {
    errors[field] = ''
  }
}

function validateForm() {
  validateField('username')
  validateField('password')
  return !errors.username && !errors.password
}

async function handleLogin() {
  if (!validateForm()) return
  if (isRateLimited.value) {
    uiStore.showToast('Terlalu banyak percobaan. Silakan tunggu sebentar.', 'warning')
    return
  }
  
  try {
    isLoading.value = true
    
    const result = await authStore.login({
      username: form.username.trim(),
      password: form.password,
      rememberMe: form.rememberMe
    })
    
    if (result.success) {
      // Reset attempts on success
      loginAttempts.value = 0
      uiStore.showToast('Login berhasil! Barakallahu fiik', 'success')
      
      // Smooth transition delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      // Increment login attempts
      loginAttempts.value++
      lastAttemptTime.value = Date.now()
      
      // Clear password for security
      form.password = ''
      
      // Enhanced error messages
      let errorMessage = result.message || 'Login gagal'
      if (result.message?.includes('password')) {
        errorMessage = 'Username atau password salah'
        errors.password = 'Periksa kembali password Anda'
      } else if (result.message?.includes('username')) {
        errors.username = 'Username tidak ditemukan'
      }
      
      uiStore.showToast(errorMessage, 'error')
      
      // Focus appropriate field
      if (errors.username) {
        document.getElementById('username')?.focus()
      } else {
        document.getElementById('password')?.focus()
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    uiStore.showToast('Terjadi kesalahan. Periksa koneksi internet Anda.', 'error')
    form.password = ''
  } finally {
    isLoading.value = false
  }
}

function showForgotPassword() {
  uiStore.showToast('Hubungi admin untuk reset password', 'info')
}

function quickFill() {
  
  // Clear any existing errors
  errors.username = ''
  errors.password = ''
  
  uiStore.showToast('Credentials demo telah diisi', 'info')
}
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes pulse-soft {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}

/* Focus management */
input:focus,
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-pulse-soft,
  .animate-spin {
    animation: none;
  }
  
  .transform {
    transform: none !important;
  }
}

/* Better mobile touch targets */
@media (max-width: 640px) {
  input, button {
    min-height: 44px;
  }
}
</style>