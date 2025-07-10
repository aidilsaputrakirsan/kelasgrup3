<!-- 📄 src/views/LoginView.vue - CONSISTENT DESIGN -->
<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <div class="w-full max-width-md animate-slide-up">
      <!-- Islamic Greeting -->
      <div class="text-center mb-8">
        <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 shadow-sm">
          <h1 class="text-2xl font-bold text-gray-800 mb-2 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </h1>
          <p class="text-gray-600 italic">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
        </div>
      </div>
      
      <!-- Login Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <!-- Header -->
        <div class="text-center p-6 bg-gradient-to-r from-pink-500 to-purple-600">
          <div class="w-16 h-16 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <span class="text-3xl text-white">📿</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Amalan Tracker</h2>
          <p class="text-pink-100">Silakan masuk untuk melanjutkan</p>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="p-6 space-y-6">
          <AppInput
            id="username"
            v-model="form.username"
            label="Username"
            placeholder="Masukkan username"
            :error="errors.username"
            required
            class="w-full"
          >
            
          </AppInput>
          
          <AppInput
            id="password"
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Masukkan password"
            :error="errors.password"
            required
            class="w-full"
          >
            
          </AppInput>
          
          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="rememberMe"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label for="rememberMe" class="ml-2 text-sm text-gray-700">
              Ingat saya
            </label>
          </div>
          
          <!-- Submit Button -->
          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Masuk
          </AppButton>
        </form>
        
        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600">Multi-device access tersedia</p>
            <div class="text-xs font-medium text-pink-600 tracking-wider">
              ATK • AYS • FTR • WIN
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isLoading = ref(false)
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})
const errors = reactive({
  username: '',
  password: ''
})

onMounted(() => {
  loadSavedCredentials()
})

function loadSavedCredentials() {
  const saved = localStorage.getItem('saved_credentials')
  if (saved) {
    try {
      const { username } = JSON.parse(saved)
      form.username = username
      form.rememberMe = true
    } catch (e) {
      // Ignore errors
    }
  }
}

async function handleLogin() {
  // Clear previous errors
  errors.username = ''
  errors.password = ''
  
  // Validate
  if (!form.username) {
    errors.username = 'Username wajib diisi'
    return
  }
  if (!form.password) {
    errors.password = 'Password wajib diisi'
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
      uiStore.showToast('Login berhasil!', 'success')
      router.push('/dashboard')
    } else {
      uiStore.showToast(result.message || 'Login gagal', 'error')
    }
  } catch (error) {
    uiStore.showToast('Terjadi kesalahan saat login', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>