// 📄 src/composables/usePullToRefresh.js
import { ref, onMounted, onUnmounted } from 'vue'

export function usePullToRefresh(onRefresh, threshold = 80) {
  const isPulling = ref(false)
  const startY = ref(0)
  const currentY = ref(0)
  
  let isRefreshing = false
  
  function handleTouchStart(event) {
    if (window.scrollY === 0) {
      startY.value = event.touches[0].clientY
    }
  }
  
  function handleTouchMove(event) {
    if (window.scrollY === 0 && !isRefreshing) {
      currentY.value = event.touches[0].clientY
      const distance = currentY.value - startY.value
      
      if (distance > 10) {
        event.preventDefault()
        isPulling.value = distance > threshold
      }
    }
  }
  
  async function handleTouchEnd() {
    if (isPulling.value && !isRefreshing) {
      isRefreshing = true
      try {
        await onRefresh()
      } finally {
        isRefreshing = false
      }
    }
    
    isPulling.value = false
    startY.value = 0
    currentY.value = 0
  }
  
  onMounted(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  })
  
  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  })
  
  return {
    isPulling
  }
}