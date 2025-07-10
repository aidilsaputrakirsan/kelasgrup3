<!-- 📄 src/components/ui/AppCard.vue -->
<template>
  <div 
    :class="cardClasses"
    class="glass rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
  >
    <!-- Header -->
    <div v-if="$slots.header" class="p-6 border-b border-white/10">
      <slot name="header" />
    </div>
    
    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" class="p-6 border-t border-white/10">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'p-6'
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'dark', 'gradient'].includes(value)
  }
})

const cardClasses = computed(() => ({
  'glass-dark': props.variant === 'dark',
  'bg-gradient-to-br from-dusty-rose/20 to-lavender-mist/20': props.variant === 'gradient'
}))

const bodyClasses = computed(() => props.padding)
</script>