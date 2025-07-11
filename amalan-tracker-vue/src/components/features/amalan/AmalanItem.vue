<!-- 📱 src/components/features/amalan/AmalanItem.vue - CLEAN TAILWIND + SAFE LOGIC -->
<template>
  <div class="glass rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md">
    <!-- Header -->
    <div class="flex justify-between items-start mb-3 sm:mb-4">
      <div class="flex-1 pr-3">
        <h4 class="font-medium text-charcoal-soft text-sm sm:text-base leading-tight">{{ name }}</h4>
        <!-- Dynamic target info -->
        <div class="text-xs text-charcoal-soft/60 mt-1">
          Target: {{ targetInfo }}
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg sm:text-xl font-bold text-dusty-rose">{{ displayValue }}</div>
        <div class="text-xs text-charcoal-soft/60">kali</div>
        <!-- Show if changed from saved value -->
        <div v-if="hasChanges" class="text-xs text-yellow-600 font-medium">
          (dari {{ savedValue }})
        </div>
      </div>
    </div>
    
    <!-- Input Controls -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Decrease Button -->
      <button
        @click="decrease"
        :disabled="displayValue <= 0"
        class="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-red-100 hover:bg-red-200 disabled:bg-moonstone text-red-600 disabled:text-charcoal-soft/40 border border-red-200 disabled:border-white/20 transition-colors flex items-center justify-center disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      
      <!-- Input Field -->
      <div class="flex-1">
        <input
          v-model="localValue"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          min="0"
          max="9999"
          class="w-full glass rounded-lg px-3 sm:px-4 py-3 text-center text-base sm:text-lg font-bold text-charcoal-soft border border-white/20 focus:border-dusty-rose focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-200 min-h-[44px]"
          @input="handleInput"
          @blur="handleBlur"
          @keypress.enter="$event.target.blur()"
          @focus="$event.target.select()"
        />
      </div>
      
      <!-- Increase Button -->
      <button
        @click="increase"
        class="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 transition-colors flex items-center justify-center"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
    
    <!-- Quick Add Buttons -->
    <div class="mt-3 flex gap-1 sm:gap-2">
      <!-- Smart quick add based on amalan type -->
      <button
        v-for="action in quickActions"
        :key="action.label"
        @click="quickAdd(action.value)"
        class="flex-1 px-2 py-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-charcoal-soft border border-white/20 rounded-lg transition-colors text-xs font-medium min-h-[36px]"
      >
        {{ action.label }}
      </button>
      
      <!-- Individual Save button - muncul kalau ada changes -->
      <button
        v-if="hasChanges"
        @click="saveThis"
        :disabled="props.isSaving"
        class="flex-1 px-2 py-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 disabled:from-gray-200 disabled:to-gray-300 text-green-700 disabled:text-gray-500 rounded-lg transition-colors text-xs font-medium min-h-[36px] border border-green-200"
      >
        <span v-if="props.isSaving" class="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></span>
        <span v-else>💾 Simpan</span>
      </button>
      
      <!-- Safe reset button - kembali ke saved value -->
      <button
        v-if="hasChanges"
        @click="resetToSaved"
        class="flex-1 px-2 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors text-xs font-medium min-h-[36px] border border-yellow-200"
      >
        ↶ Batal
      </button>
      
      <!-- Dangerous reset to zero (only show if no saved data and no changes) -->
      <button
        v-if="!hasChanges && displayValue > 0"
        @click="resetToZero"
        class="flex-1 px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-xs font-medium min-h-[36px] border border-red-200"
      >
        Reset
      </button>
    </div>
    
    <!-- Progress Bar (only show if has target) -->
    <div class="mt-3" v-if="weeklyTarget > 0">
      <div class="w-full h-1.5 sm:h-1 bg-moonstone rounded-full overflow-hidden">
        <div 
          :style="{ width: `${progressPercentage}%` }"
          :class="progressColorClass"
          class="h-full transition-all duration-300 rounded-full"
        ></div>
      </div>
      <div class="text-xs text-charcoal-soft/60 text-center mt-1">
        {{ displayValue }}/{{ weeklyTarget }} pekan ini ({{ Math.round(progressPercentage) }}%)
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  savedValue: {
    type: Number,
    default: 0
  },
  isSaving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'save'])

const localValue = ref(props.value.toString())

// 🎯 Dynamic target mapping
const targetMapping = {
  'Dzikir pagi/petang': { daily: '1x/hari', weekly: 7 },
  'Tilawah': { daily: '1 juz/hari', weekly: 7 },
  'Shalat tepat waktu': { daily: '5x/hari', weekly: 35 },
  'Shalat malam': { daily: '3x/pekan', weekly: 3 },
  'Shalat Dhuha': { daily: '3x/pekan', weekly: 3 },
  'Puasa Sunnah': { daily: '3x/pekan', weekly: 3 },
  'Istighfar': { daily: '100x/hari', weekly: 700 },
  'Shalawat': { daily: '100x/hari', weekly: 700 },
  'Membaca Baqiyatush-shalihat': { daily: '10x/hari', weekly: 70 },
  'Infaq Harian': { daily: '1x/hari', weekly: 7 },
  'Doa kemenangan dakwah dan umat islam': { daily: '1x/hari', weekly: 7 }
}

const displayValue = computed(() => {
  const num = parseInt(localValue.value) || 0
  return Math.max(0, Math.min(9999, num))
})

const targetInfo = computed(() => {
  const target = targetMapping[props.name]
  return target ? target.daily : '-'
})

const weeklyTarget = computed(() => {
  const target = targetMapping[props.name]
  return target ? target.weekly : 0
})

const progressPercentage = computed(() => {
  if (weeklyTarget.value === 0) return 0
  return Math.min((displayValue.value / weeklyTarget.value) * 100, 100)
})

const progressColorClass = computed(() => {
  const pct = progressPercentage.value
  if (pct >= 100) return 'bg-gradient-to-r from-emerald-500 to-teal-500'
  if (pct >= 75) return 'bg-gradient-to-r from-indigo-500 to-purple-500'
  if (pct >= 50) return 'bg-gradient-to-r from-dusty-rose to-lavender-mist'
  if (pct >= 25) return 'bg-gradient-to-r from-yellow-400 to-orange-400'
  return 'bg-gradient-to-r from-gray-400 to-gray-500'
})

// 🔒 SAFE: Check if current value differs from saved
const hasChanges = computed(() => {
  return displayValue.value !== props.savedValue
})

// 🚀 Smart quick actions based on amalan type
const quickActions = computed(() => {
  const target = targetMapping[props.name]
  if (!target) return [{ label: '+1', value: 1 }, { label: '+5', value: 5 }]
  
  const weekly = target.weekly
  
  if (weekly >= 100) {
    // High frequency (Istighfar, Shalawat)
    return [
      { label: '+10', value: 10 },
      { label: '+50', value: 50 },
      { label: '+100', value: 100 }
    ]
  } else if (weekly >= 10) {
    // Medium frequency (Shalat tepat waktu, Baqiyatush-shalihat)
    return [
      { label: '+1', value: 1 },
      { label: '+3', value: 3 },
      { label: '+5', value: 5 }
    ]
  } else {
    // Low frequency (Shalat malam, Dhuha, Puasa)
    return [
      { label: '+1', value: 1 },
      { label: '+2', value: 2 },
      { label: '+3', value: 3 }
    ]
  }
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

// 🔒 SAFE: Reset to last saved value
function resetToSaved() {
  localValue.value = props.savedValue.toString()
  emit('update', props.name, props.savedValue)
}

// 🗑️ DANGEROUS: Reset to zero (only when no saved data)
function resetToZero() {
  if (confirm(`Reset ${props.name} ke nol?`)) {
    localValue.value = '0'
    emit('update', props.name, 0)
  }
}

// 💾 Save individual amalan
function saveThis() {
  emit('save', props.name)
}
</script>

<style scoped>
/* Remove number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Better focus states */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #d97b7e;
  outline-offset: 2px;
}
</style>