// 📄 src/composables/useSwipe.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useSwipe(element, options = {}) {
  const {
    threshold = 50,
    velocity = 0.3,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options
  
  const startX = ref(0)
  const startY = ref(0)
  const startTime = ref(0)
  const isSwiping = ref(false)
  
  function handleTouchStart(event) {
    const touch = event.touches[0]
    startX.value = touch.clientX
    startY.value = touch.clientY
    startTime.value = Date.now()
    isSwiping.value = true
  }
  
  function handleTouchMove(event) {
    if (!isSwiping.value) return
    
    // Prevent default scrolling on horizontal swipes
    const touch = event.touches[0]
    const deltaX = Math.abs(touch.clientX - startX.value)
    const deltaY = Math.abs(touch.clientY - startY.value)
    
    if (deltaX > deltaY) {
      event.preventDefault()
    }
  }
  
  function handleTouchEnd(event) {
    if (!isSwiping.value) return
    
    const touch = event.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()
    
    const deltaX = endX - startX.value
    const deltaY = endY - startY.value
    const deltaTime = endTime - startTime.value
    
    const velocityX = Math.abs(deltaX) / deltaTime
    const velocityY = Math.abs(deltaY) / deltaTime
    
    // Check if swipe meets threshold and velocity requirements
    if (Math.abs(deltaX) > threshold && velocityX > velocity) {
      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (Math.abs(deltaY) > threshold && velocityY > velocity) {
      if (deltaY > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }
    
    isSwiping.value = false
  }
  
  onMounted(() => {
    const el = element.value
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: false })
      el.addEventListener('touchmove', handleTouchMove, { passive: false })
      el.addEventListener('touchend', handleTouchEnd)
    }
  })
  
  onUnmounted(() => {
    const el = element.value
    if (el) {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  })
  
  return {
    isSwiping
  }
}