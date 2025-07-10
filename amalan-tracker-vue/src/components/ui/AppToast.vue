<!-- 📄 src/components/ui/AppToast.vue -->
<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <transition-group
        name="toast"
        tag="div"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          :class="toastClasses(toast.type)"
          class="glass rounded-xl p-4 shadow-lg border border-white/20 backdrop-blur-sm cursor-pointer"
          @click="uiStore.removeToast(toast.id)"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <component :is="getIconComponent(toast.type)" class="w-5 h-5" />
            </div>
            
            <!-- Message -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium break-words">{{ toast.message }}</p>
            </div>
            
            <!-- Close button -->
            <button 
              class="flex-shrink-0 text-current/60 hover:text-current transition-colors p-1"
              @click.stop="uiStore.removeToast(toast.id)"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

function toastClasses(type) {
  const classes = {
    success: 'text-green-800 bg-green-50/90 border-green-200/50',
    error: 'text-red-800 bg-red-50/90 border-red-200/50',
    warning: 'text-amber-800 bg-amber-50/90 border-amber-200/50',
    info: 'text-dusty-rose bg-warm-cream/90 border-dusty-rose/20'
  }
  return classes[type] || classes.info
}

function getIconComponent(type) {
  // Return simple SVG components
  const icons = {
    success: {
      template: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>`
    },
    error: {
      template: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>`
    },
    warning: {
      template: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>`
    },
    info: {
      template: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>`
    }
  }
  
  return icons[type] || icons.info
}
</script>

<style scoped>
@media (max-width: 640px) {
  .fixed {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>