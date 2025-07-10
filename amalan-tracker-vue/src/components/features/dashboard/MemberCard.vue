<!-- 📄 src/components/features/dashboard/MemberCard.vue - FIXED WITH REAL DATA -->
<template>
  <div
    :class="cardClasses"
    class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group overflow-hidden border border-white/20"
    @click="$emit('click')"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -mr-10 -mt-10"></div>
    
    <!-- Member avatar dengan progress ring -->
    <div class="relative flex items-center justify-center w-16 h-16 mx-auto mb-4">
      <!-- Progress ring -->
      <svg class="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
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
      <div class="relative z-10 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {{ member }}
      </div>
    </div>
    
    <!-- Member name -->
    <h4 class="text-center font-bold text-gray-800 mb-2">{{ member }}</h4>
    
    <!-- Streak counter - REAL DATA atau 0 jika tidak ada -->
    <div class="flex items-center justify-center gap-1 mb-4">
      <span class="text-orange-500 text-lg">🔥</span>
      <span class="font-semibold text-gray-700">{{ streakDays }} hari</span>
    </div>
    
    <!-- Stats dengan better hierarchy -->
    <div class="space-y-3">
      <!-- Progress percentage -->
      <div class="text-center">
        <div class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {{ progressPercentage }}%
        </div>
        <div class="text-xs text-gray-500">Progress mingguan</div>
      </div>
      
      <!-- Stats breakdown - REAL DATA -->
      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2">
          <div class="font-bold text-pink-600">{{ memberStats.totalAmalan }}</div>
          <div class="text-xs text-pink-500">Total Amalan</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2">
          <div class="font-bold text-purple-600">{{ memberStats.completedAmalan }}</div>
          <div class="text-xs text-purple-500">Tercatat</div>
        </div>
      </div>
    </div>
    
    <!-- Achievement badge -->
    <div v-if="hasAchievement" class="absolute top-3 right-3">
      <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <span class="text-white text-xs">🏆</span>
      </div>
    </div>
    
    <!-- Hover glow effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
  }
})

defineEmits(['click'])

// REAL member stats dari props.data
const memberStats = computed(() => ({
  totalAmalan: props.data.totalAmalan || 0,
  completedAmalan: props.data.completedAmalan || 0
}))

// Target berdasarkan jumlah amalan default per minggu
const weeklyTarget = computed(() => {
  // Asumsi target per amalan per minggu = 7 (1x per hari)
  // Total target = jumlah amalan * 7 hari
  return DEFAULT_AMALAN.length * 7 // 11 amalan * 7 hari = 77
})

// Progress percentage berdasarkan data real
const progressPercentage = computed(() => {
  const completed = memberStats.value.totalAmalan
  const target = weeklyTarget.value
  
  if (target === 0) return 0
  
  const percentage = Math.round((completed / target) * 100)
  return Math.min(percentage, 100) // Cap at 100%
})

// Streak days - untuk sementara set 0, nanti bisa dihitung dari data real
const streakDays = computed(() => {
  // TODO: Hitung streak berdasarkan data consecutive days
  // Untuk sementara return 0 sampai implementasi streak calculation
  return 0
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
  return progressPercentage.value >= 90 || memberStats.value.totalAmalan >= 70
})

const cardClasses = computed(() => ({
  'ring-2 ring-pink-300/50 shadow-pink-200/50': progressPercentage.value >= 80
}))
</script>