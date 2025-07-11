<!-- 📄 src/components/features/dashboard/MemberCard.vue - IMPROVED -->
<template>
  <div
    :class="cardClasses"
    class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group overflow-hidden border border-white/20"
    @click="$emit('click')"
  >
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <div class="h-4 bg-gray-200 rounded mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
      <div class="grid grid-cols-2 gap-2">
        <div class="h-8 bg-gray-200 rounded"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -mr-10 -mt-10"></div>
      
      <!-- Member avatar dengan progress ring -->
      <div class="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
        <!-- Progress ring -->
        <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <!-- Background circle -->
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgb(230 227 232)" stroke-width="4"/>
          <!-- Progress circle -->
          <circle 
            cx="32" cy="32" r="28" 
            fill="none" 
            :stroke="progressColor"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="`${progressCircumference * progressPercentage / 100} ${progressCircumference}`"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <!-- Avatar -->
        <div class="relative z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
          {{ member }}
        </div>
      </div>
      
      <!-- Member name -->
      <h4 class="text-center font-bold text-gray-800 mb-2 text-sm sm:text-base">{{ member }}</h4>
      
      <!-- Activity Status - SMART INSTEAD OF FAKE STREAK -->
      <div class="flex items-center justify-center gap-1 mb-3 sm:mb-4">
        <span :class="activityStatusIcon.color" class="text-base sm:text-lg">{{ activityStatusIcon.icon }}</span>
        <span class="font-medium text-gray-700 text-xs sm:text-sm">{{ activityStatusText }}</span>
      </div>
      
      <!-- Progress percentage -->
      <div class="text-center mb-3">
        <div class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {{ progressPercentage }}%
        </div>
        <div class="text-xs text-gray-500">Progress pekan ini</div>
      </div>
      
      <!-- Stats breakdown - REAL DATA with better mobile layout -->
      <div class="grid grid-cols-2 gap-2 sm:gap-3 text-center">
        <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2 sm:p-3">
          <div class="font-bold text-pink-600 text-sm sm:text-base">{{ memberStats.totalAmalan }}</div>
          <div class="text-xs text-pink-500">Total</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 sm:p-3">
          <div class="font-bold text-purple-600 text-sm sm:text-base">{{ memberStats.completedAmalan }}</div>
          <div class="text-xs text-purple-500">Jenis</div>
        </div>
      </div>
      
      <!-- Achievement badge -->
      <div v-if="hasAchievement" class="absolute top-2 right-2 sm:top-3 sm:right-3">
        <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-xs">{{ achievementIcon }}</span>
        </div>
      </div>
      
      <!-- Hover glow effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DEFAULT_AMALAN } from '@/utils/constants'

const props = defineProps({
  member: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: () => ({
      totalAmalan: 0,
      completedAmalan: 0
    })
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// REAL member stats dari props.data
const memberStats = computed(() => ({
  totalAmalan: props.data.totalAmalan || 0,
  completedAmalan: props.data.completedAmalan || 0
}))

// 🎯 DYNAMIC weekly target based on actual amalan targets
const weeklyTarget = computed(() => {
  // Target mapping berdasarkan amalan yang realistic
  const amalanTargets = {
    'Dzikir pagi/petang': 7,          // 1x/hari = 7x/week
    'Tilawah': 7,                     // 1 juz/hari = 7x/week
    'Shalat tepat waktu': 35,         // 5x/hari = 35x/week
    'Shalat malam': 3,                // 3x/pekan
    'Shalat Dhuha': 3,                // 3x/pekan
    'Puasa Sunnah': 3,                // 3x/pekan
    'Istighfar': 700,                 // 100x/hari = 700x/week
    'Shalawat': 700,                  // 100x/hari = 700x/week
    'Membaca Baqiyatush-shalihat': 70, // 10x/hari = 70x/week
    'Infaq Harian': 7,                // 1x/hari = 7x/week
    'Doa kemenangan dakwah dan umat islam': 7 // 1x/hari = 7x/week
  }
  
  // Total target semua amalan
  return Object.values(amalanTargets).reduce((sum, target) => sum + target, 0) // = 1542
})

// Progress percentage berdasarkan realistic target
const progressPercentage = computed(() => {
  const completed = memberStats.value.totalAmalan
  const target = weeklyTarget.value
  
  if (target === 0) return 0
  
  const percentage = Math.round((completed / target) * 100)
  return Math.min(percentage, 100) // Cap at 100%
})

// 🧠 SMART activity status instead of fake streak
const activityStatusIcon = computed(() => {
  const total = memberStats.value.totalAmalan
  const types = memberStats.value.completedAmalan
  
  if (total === 0 && types === 0) {
    return { icon: '😴', color: 'text-gray-400' }
  } else if (types >= 8) {
    return { icon: '🔥', color: 'text-red-500' }
  } else if (types >= 5) {
    return { icon: '⚡', color: 'text-yellow-500' }
  } else if (types >= 3) {
    return { icon: '✨', color: 'text-blue-500' }
  } else if (types >= 1) {
    return { icon: '🌱', color: 'text-green-500' }
  } else {
    return { icon: '😴', color: 'text-gray-400' }
  }
})

const activityStatusText = computed(() => {
  const total = memberStats.value.totalAmalan
  const types = memberStats.value.completedAmalan
  
  if (total === 0 && types === 0) {
    return 'Belum aktif'
  } else if (types >= 8) {
    return 'Sangat aktif'
  } else if (types >= 5) {
    return 'Aktif'
  } else if (types >= 3) {
    return 'Cukup aktif'
  } else if (types >= 1) {
    return 'Mulai aktif'
  } else {
    return 'Kurang aktif'
  }
})

const progressCircumference = computed(() => 2 * Math.PI * 28) // r=28

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 80) return 'rgb(34 197 94)' // green
  if (percentage >= 60) return 'rgb(251 191 36)' // yellow  
  if (percentage >= 40) return 'rgb(249 115 22)' // orange
  return 'rgb(239 68 68)' // red
})

const hasAchievement = computed(() => {
  const percentage = progressPercentage.value
  const types = memberStats.value.completedAmalan
  return percentage >= 50 || types >= 7
})

const achievementIcon = computed(() => {
  const percentage = progressPercentage.value
  const types = memberStats.value.completedAmalan
  
  if (percentage >= 80) return '🏆'
  if (types >= 8) return '⭐'
  if (percentage >= 50) return '🎯'
  return '🏅'
})

const cardClasses = computed(() => ({
  'ring-2 ring-pink-300/50 shadow-pink-200/50': progressPercentage.value >= 60,
  'ring-2 ring-yellow-300/50 shadow-yellow-200/50': progressPercentage.value >= 40 && progressPercentage.value < 60
}))
</script>