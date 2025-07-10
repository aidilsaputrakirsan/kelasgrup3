// 📄 src/stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // State
  const isLoading = ref(false)
  const toasts = ref([])
  const isOnline = ref(navigator.onLine)
  const pwaInstallPrompt = ref(null)
  
  // Actions
  function setLoading(loading) {
    isLoading.value = loading
  }
  
  function showToast(message, type = 'info', duration = 3000) {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(toast.id)
    }, duration)
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function setOnlineStatus(online) {
    isOnline.value = online
  }
  
  function setPwaInstallPrompt(prompt) {
    pwaInstallPrompt.value = prompt
  }
  
  async function installPwa() {
    if (pwaInstallPrompt.value) {
      pwaInstallPrompt.value.prompt()
      const { outcome } = await pwaInstallPrompt.value.userChoice
      pwaInstallPrompt.value = null
      return outcome === 'accepted'
    }
    return false
  }
  
  return {
    isLoading,
    toasts,
    isOnline,
    pwaInstallPrompt,
    setLoading,
    showToast,
    removeToast,
    setOnlineStatus,
    setPwaInstallPrompt,
    installPwa
  }
})