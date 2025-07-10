<!-- 📄 Update src/components/features/dashboard/WeekSelector.vue -->
<!-- FIX KONTRAS WARNA + BETTER UX -->
<template>
  <div class="space-y-4">
    <!-- Week buttons dengan better contrast -->
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="week in 4"
          :key="week"
          :class="weekButtonClasses(week)"
          class="relative py-4 px-4 rounded-xl font-semibold transition-all duration-300 text-sm group overflow-hidden"
          @click="$emit('week-changed', week)"
        >
          <!-- Background gradient untuk active state -->
          <div 
            v-if="week === currentWeek"
            class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl animate-pulse-soft"
          ></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <div class="text-lg font-bold">W{{ week }}</div>
            <div class="text-xs opacity-80 mt-1">
              {{ getWeekDays(week) }}
            </div>
          </div>
          
          <!-- Hover effect -->
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
        </button>
      </div>
    </div>
    
    <!-- Current week info dengan Islamic quote -->
    <div class="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200/50">
      <p class="text-sm font-medium text-gray-700">{{ weekRangeText }}</p>
      <p class="text-xs text-gray-500 mt-2 italic">
        "وَاذْكُرْ رَبَّكَ كَثِيرًا" - Ingatlah Allah sebanyak-banyaknya
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getWeekRange, getMonthName } from '@/utils/date'

const props = defineProps({
  currentWeek: Number,
  currentMonth: Number,
  currentYear: Number
})

defineEmits(['week-changed'])

const weekRangeText = computed(() => {
  const range = getWeekRange(props.currentWeek, props.currentMonth, props.currentYear)
  const monthName = getMonthName(props.currentMonth)
  return `${range.startDate}-${range.endDate} ${monthName} ${props.currentYear}`
})

function weekButtonClasses(week) {
  if (week === props.currentWeek) {
    return 'text-white shadow-lg transform scale-105'
  }
  return 'text-gray-700 bg-white/50 hover:bg-white/70 hover:scale-102 shadow-sm'
}

function getWeekDays(week) {
  const range = getWeekRange(week, props.currentMonth, props.currentYear)
  return `${range.startDate}-${range.endDate}`
}
</script>