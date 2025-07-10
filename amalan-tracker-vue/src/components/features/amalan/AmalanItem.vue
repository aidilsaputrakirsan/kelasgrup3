<!-- 📄 src/components/features/amalan/AmalanItem.vue -->
<template>
  <div class="glass rounded-xl p-4 transition-all duration-200 hover:shadow-md">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h4 class="font-medium text-charcoal-soft">{{ name }}</h4>
      <div class="text-right">
        <div class="text-lg font-bold text-dusty-rose">{{ displayValue }}</div>
        <div class="text-xs text-charcoal-soft/60">kali</div>
      </div>
    </div>
    
    <!-- Input Controls -->
    <div class="flex items-center gap-3">
      <!-- Decrease Button -->
      <AppButton
        variant="secondary"
        size="sm"
        class="w-10 h-10 rounded-full p-0"
        @click="decrease"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </AppButton>
      
      <!-- Input Field -->
      <div class="flex-1">
        <input
          v-model="localValue"
          type="number"
          min="0"
          max="9999"
          class="w-full glass rounded-lg px-4 py-3 text-center text-lg font-bold text-charcoal-soft border border-white/20 focus:border-dusty-rose focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-200"
          @input="handleInput"
          @blur="handleBlur"
          @keypress.enter="$event.target.blur()"
        />
      </div>
      
      <!-- Increase Button -->
      <AppButton
        variant="secondary"
        size="sm"
        class="w-10 h-10 rounded-full p-0"
        @click="increase"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </AppButton>
    </div>
    
    <!-- Quick Add Buttons -->
    <div class="mt-3 flex gap-2">
      <AppButton
        variant="outline"
        size="sm"
        class="flex-1 text-xs"
        @click="quickAdd(1)"
      >
        +1
      </AppButton>
      <AppButton
        variant="outline"
        size="sm"
        class="flex-1 text-xs"
        @click="quickAdd(5)"
      >
        +5
      </AppButton>
      <AppButton
        variant="outline"
        size="sm"
        class="flex-1 text-xs"
        @click="quickAdd(10)"
      >
        +10
      </AppButton>
      <AppButton
        variant="ghost"
        size="sm"
        class="flex-1 text-xs"
        @click="reset"
      >
        Reset
      </AppButton>
    </div>
    
    <!-- Progress Bar -->
    <div class="mt-3">
      <div class="w-full h-1 bg-moonstone rounded-full overflow-hidden">
        <div 
          :style="{ width: `${Math.min(displayValue / 50 * 100, 100)}%` }"
          class="h-full bg-gradient-to-r from-dusty-rose to-lavender-mist transition-all duration-300 rounded-full"
        ></div>
      </div>
      <div class="text-xs text-charcoal-soft/60 text-center mt-1">
        Target: 50/hari
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update'])

const localValue = ref(props.value.toString())

const displayValue = computed(() => {
  const num = parseInt(localValue.value) || 0
  return Math.max(0, Math.min(9999, num))
})

// Watch for external value changes
watch(() => props.value, (newValue) => {
  if (parseInt(localValue.value) !== newValue) {
    localValue.value = newValue.toString()
  }
})

function handleInput(event) {
  const value = event.target.value
  
  // Allow empty input temporarily
  if (value === '') {
    localValue.value = ''
    return
  }
  
  // Validate and constrain value
  const numValue = parseInt(value) || 0
  const constrainedValue = Math.max(0, Math.min(9999, numValue))
  
  localValue.value = constrainedValue.toString()
  emit('update', props.name, constrainedValue)
}

function handleBlur() {
  // Ensure we have a valid number on blur
  if (localValue.value === '' || isNaN(parseInt(localValue.value))) {
    localValue.value = '0'
    emit('update', props.name, 0)
  }
}

function increase() {
  const newValue = Math.min(9999, displayValue.value + 1)
  localValue.value = newValue.toString()
  emit('update', props.name, newValue)
}

function decrease() {
  const newValue = Math.max(0, displayValue.value - 1)
  localValue.value = newValue.toString()
  emit('update', props.name, newValue)
}

function quickAdd(amount) {
  const newValue = Math.min(9999, displayValue.value + amount)
  localValue.value = newValue.toString()
  emit('update', props.name, newValue)
}

function reset() {
  localValue.value = '0'
  emit('update', props.name, 0)
}
</script>