<!-- 📄 src/components/ui/AppButton.vue -->
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- Content -->
    <div :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot name="icon" />
      <span>{{ text || $slots.default?.[0]?.children }}</span>
      <slot />
    </div>
    
    <!-- Ripple effect -->
    <div class="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-xl"></div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: Boolean,
  loading: Boolean,
  text: String
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const variants = {
    primary: 'bg-gradient-to-r from-dusty-rose to-lavender-mist text-white shadow-lg hover:shadow-xl focus:ring-dusty-rose/50',
    secondary: 'glass text-charcoal-soft hover:bg-moonstone/50 focus:ring-lavender-mist/50',
    outline: 'border-2 border-dusty-rose text-dusty-rose hover:bg-dusty-rose hover:text-white focus:ring-dusty-rose/50',
    ghost: 'text-charcoal-soft hover:bg-moonstone/30 focus:ring-lavender-mist/50'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }
  
  return [variants[props.variant], sizes[props.size]]
})
</script>