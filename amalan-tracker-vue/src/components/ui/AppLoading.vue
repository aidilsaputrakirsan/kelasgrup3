// 📄 src/components/ui/AppLoading.vue (BENAR - Tailwind v4)
<template>
  <div class="fixed inset-0 bg-warm-cream/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="glass rounded-2xl p-8 text-center max-w-sm mx-4">
      <!-- Animated logo -->
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto bg-gradient-to-br from-dusty-rose to-lavender-mist rounded-full flex items-center justify-center animate-bounce-soft">
          <span class="text-2xl text-white">📿</span>
        </div>
      </div>
      
      <!-- Loading spinner -->
      <div class="mb-4">
        <div class="w-8 h-8 border-3 border-dusty-rose/30 border-t-dusty-rose rounded-full animate-spin mx-auto"></div>
      </div>
      
      <!-- Loading text -->
      <p class="text-charcoal-soft font-medium">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  message: {
    type: String,
    default: 'Memuat data...'
  }
})
</script>