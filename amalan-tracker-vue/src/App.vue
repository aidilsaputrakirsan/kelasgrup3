// 📄 src/App.vue
<template>
  <div id="app" class="min-h-screen bg-warm-cream islamic-pattern">
    <!-- Toast notifications -->
    <AppToast />
    
    <!-- Loading overlay -->
    <AppLoading v-if="uiStore.isLoading" />
    
    <!-- Router view with transitions -->
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="route.meta.transition || 'fade'"
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AppToast from '@/components/ui/AppToast.vue'
import AppLoading from '@/components/ui/AppLoading.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

onMounted(() => {
  // Check existing session on app load
  authStore.checkSession()
  
  // Setup PWA install prompt
  setupPwaInstallPrompt()
  
  // Setup offline detection
  setupOfflineDetection()
})

function setupPwaInstallPrompt() {
  let deferredPrompt
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    uiStore.setPwaInstallPrompt(deferredPrompt)
  })
}

function setupOfflineDetection() {
  window.addEventListener('online', () => {
    uiStore.setOnlineStatus(true)
    uiStore.showToast('Koneksi kembali tersambung', 'success')
  })
  
  window.addEventListener('offline', () => {
    uiStore.setOnlineStatus(false)
    uiStore.showToast('Koneksi terputus', 'warning')
  })
}
</script>

<style>
/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Touch improvements */
@media (hover: none) and (pointer: coarse) {
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>