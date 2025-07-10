// 📄 src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const { authenticate } = useApi()
  const router = useRouter()
  
  // State
  const token = ref(localStorage.getItem('auth_token'))
  const user = ref(localStorage.getItem('auth_user'))
  const loginTime = ref(localStorage.getItem('auth_timestamp'))
  const rememberMe = ref(localStorage.getItem('auth_remember') === 'true')
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const sessionAge = computed(() => {
    if (!loginTime.value) return 0
    return Date.now() - parseInt(loginTime.value)
  })
  
  // Actions
  async function login(credentials) {
    try {
      const response = await authenticate(credentials.username, credentials.password)
      
      if (response.success) {
        token.value = response.token || generateToken()
        user.value = credentials.username
        loginTime.value = Date.now().toString()
        rememberMe.value = credentials.rememberMe
        
        // Save to localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('auth_user', user.value)
        localStorage.setItem('auth_timestamp', loginTime.value)
        localStorage.setItem('auth_remember', rememberMe.value.toString())
        
        if (credentials.rememberMe) {
          localStorage.setItem('saved_credentials', JSON.stringify({
            username: credentials.username,
            timestamp: Date.now()
          }))
        }
        
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
  
  function logout() {
    token.value = null
    user.value = null
    loginTime.value = null
    rememberMe.value = false
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_timestamp')
    localStorage.removeItem('auth_remember')
    
    router.push('/login')
  }
  
  function checkSession() {
    if (!token.value || !loginTime.value) {
      logout()
      return false
    }
    
    const maxAge = rememberMe.value ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    
    if (sessionAge.value > maxAge) {
      logout()
      return false
    }
    
    // Update timestamp
    loginTime.value = Date.now().toString()
    localStorage.setItem('auth_timestamp', loginTime.value)
    return true
  }
  
  function generateToken() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  return {
    token,
    user,
    loginTime,
    rememberMe,
    isAuthenticated,
    sessionAge,
    login,
    logout,
    checkSession
  }
})
