<!-- 📄 src/views/DetailView.vue - CONSISTENT DESIGN -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <AppButton
            variant="ghost"
            size="sm"
            @click="$router.go(-1)"
            class="text-gray-600 hover:text-pink-600"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </template>
            Kembali
          </AppButton>
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ member }}</span>
            </div>
            <h1 class="text-lg font-bold text-gray-800">Detail Amalan</h1>
          </div>
          
          <AppButton
            variant="ghost"
            size="sm"
            @click="authStore.logout"
            class="text-gray-600 hover:text-pink-600"
          >
            Keluar
          </AppButton>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-md mx-auto p-4 space-y-6">
      <!-- Member Profile Card -->
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
            {{ member }}
          </div>
          <h2 class="text-xl font-bold mb-2">{{ member }}</h2>
          <div class="text-pink-100 text-sm">
            {{ weekRangeText }}
          </div>
          
          <!-- Streak Counter -->
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="text-yellow-300 text-xl">🔥</span>
            <span class="font-semibold">{{ streakDays }} hari berturut-turut</span>
          </div>
        </div>
      </div>
      
      <!-- Week Navigation -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span> Navigasi Pekan
        </h3>
        
        <div class="flex justify-between items-center">
          <AppButton
            variant="secondary"
            size="sm"
            @click="changeWeek(-1)"
            class="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </template>
            Sebelumnya
          </AppButton>
          
          <div class="text-center">
            <div class="font-bold text-gray-800">Pekan {{ amalanStore.currentWeek }}</div>
            <div class="text-sm text-gray-500">{{ monthYear }}</div>
          </div>
          
          <AppButton
            variant="secondary"
            size="sm"
            @click="changeWeek(1)"
            class="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200"
          >
            Selanjutnya
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </template>
          </AppButton>
        </div>
      </div>
      
      <!-- Progress Summary -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span> Ringkasan Progress
        </h3>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
            <div class="text-2xl font-bold text-pink-600">{{ totalAmalan }}</div>
            <div class="text-xs text-pink-500 uppercase tracking-wide">Total Amalan</div>
          </div>
          <div class="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div class="text-2xl font-bold text-purple-600">{{ completedAmalan }}</div>
            <div class="text-xs text-purple-500 uppercase tracking-wide">Tercatat</div>
          </div>
          <div class="text-center bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
            <div class="text-2xl font-bold text-indigo-600">{{ progressPercentage }}%</div>
            <div class="text-xs text-indigo-500 uppercase tracking-wide">Progress</div>
          </div>
        </div>
      </div>
      
      <!-- Amalan List -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span> Daftar Amalan
          </h3>
          <AppButton
            variant="primary"
            size="sm"
            :loading="isSaving"
            @click="saveAllAmalan"
            class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            💾 Simpan Semua
          </AppButton>
        </div>
        
        <div class="space-y-4">
          <AmalanItem
            v-for="(amalan, index) in DEFAULT_AMALAN"
            :key="amalan"
            :name="amalan"
            :value="amalanValues[amalan] || 0"
            @update="updateAmalanValue"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span> Aksi Cepat
        </h3>
        
        <div class="grid grid-cols-2 gap-3">
          <AppButton
            variant="outline"
            size="sm"
            @click="resetAllAmalan"
            class="w-full bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200"
          >
            🔄 Reset Pekan
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            @click="shareProgress"
            class="w-full bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700 hover:from-green-100 hover:to-green-200"
          >
            📤 Bagikan
          </AppButton>
        </div>
      </div>
      
      <!-- Islamic Quote -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
        <div class="text-center">
          <div class="text-2xl mb-3">🤲</div>
          <p class="text-sm text-gray-700 font-medium leading-relaxed">
            "Barangsiapa mengerjakan kebaikan seberat dzarrahpun, niscaya dia akan melihat (balasan)nya."
          </p>
          <p class="text-xs text-gray-500 mt-2">- QS Az-Zalzalah: 7</p>
        </div>
      </div>
    </main>
    
    <!-- Loading -->
    <div v-if="amalanStore.isLoading" class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 shadow-xl">
        <div class="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-soft mb-4">
          <span class="text-white text-xl">📿</span>
        </div>
        <div class="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-700 font-medium">Memuat data amalan...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAmalanStore } from '@/stores/amalan'
import { useUiStore } from '@/stores/ui'
import { DEFAULT_AMALAN } from '@/utils/constants'
import { getMonthName, getWeekRange } from '@/utils/date'
import AppButton from '@/components/ui/AppButton.vue'
import AmalanItem from '@/components/features/amalan/AmalanItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

const member = ref(route.params.member)
const amalanValues = ref({})
const isSaving = ref(false)
const hasUnsavedChanges = ref(false)

// Mock data
const streakDays = computed(() => Math.floor(Math.random() * 15) + 1)

// Computed
const weekRangeText = computed(() => {
  const range = getWeekRange(amalanStore.currentWeek, amalanStore.currentMonth, amalanStore.currentYear)
  const monthName = getMonthName(amalanStore.currentMonth)
  return `${range.startDate}-${range.endDate} ${monthName} ${amalanStore.currentYear}`
})

const monthYear = computed(() => {
  return `${getMonthName(amalanStore.currentMonth)} ${amalanStore.currentYear}`
})

const totalAmalan = computed(() => {
  return Object.values(amalanValues.value).reduce((sum, val) => sum + (val || 0), 0)
})

const completedAmalan = computed(() => {
  return Object.values(amalanValues.value).filter(val => val > 0).length
})

const progressPercentage = computed(() => {
  const total = DEFAULT_AMALAN.length
  return total > 0 ? Math.round((completedAmalan.value / total) * 100) : 0
})

// Methods
async function loadMemberData() {
  try {
    await amalanStore.loadMemberData(member.value)
    const memberData = amalanStore.memberData[member.value]
    if (memberData && memberData.amalan) {
      amalanValues.value = { ...memberData.amalan }
    }
  } catch (error) {
    uiStore.showToast('Gagal memuat data anggota', 'error')
  }
}

function updateAmalanValue(amalanName, value) {
  amalanValues.value[amalanName] = parseInt(value) || 0
  hasUnsavedChanges.value = true
}

async function saveAllAmalan() {
  try {
    isSaving.value = true
    
    for (const [amalanName, value] of Object.entries(amalanValues.value)) {
      await amalanStore.updateMemberAmalan(member.value, amalanName, value)
    }
    
    hasUnsavedChanges.value = false
    uiStore.showToast('Semua data berhasil disimpan', 'success')
  } catch (error) {
    uiStore.showToast('Gagal menyimpan data', 'error')
  } finally {
    isSaving.value = false
  }
}

function resetAllAmalan() {
  if (confirm('Yakin ingin mereset semua amalan pekan ini menjadi 0?')) {
    Object.keys(amalanValues.value).forEach(key => {
      amalanValues.value[key] = 0
    })
    hasUnsavedChanges.value = true
    uiStore.showToast('Amalan direset, jangan lupa simpan', 'warning')
  }
}

async function shareProgress() {
  const shareText = `Progress Amalan ${member.value} - ${weekRangeText.value}: ${totalAmalan.value} total amalan tercatat. Alhamdulillah! 🤲`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Progress Amalan Harian',
        text: shareText
      })
    } catch (error) {
      // User cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareText)
      uiStore.showToast('Progress disalin ke clipboard', 'success')
    } catch (error) {
      uiStore.showToast('Gagal membagikan progress', 'error')
    }
  }
}

async function changeWeek(direction) {
  if (hasUnsavedChanges.value) {
    if (!confirm('Ada perubahan yang belum disimpan. Lanjutkan?')) {
      return
    }
  }
  
  amalanStore.changeWeek(direction)
  await loadMemberData()
}

// Lifecycle
onMounted(async () => {
  if (!member.value || !['ATK', 'AYS', 'FTR', 'WIN'].includes(member.value)) {
    uiStore.showToast('Anggota tidak valid', 'error')
    router.push('/dashboard')
    return
  }
  
  if (route.query.week) {
    amalanStore.setCurrentWeek(parseInt(route.query.week))
  }
  if (route.query.month) {
    amalanStore.currentMonth = parseInt(route.query.month)
  }
  if (route.query.year) {
    amalanStore.currentYear = parseInt(route.query.year)
  }
  
  await loadMemberData()
})

watch(() => route.params.member, (newMember) => {
  if (newMember !== member.value) {
    member.value = newMember
    loadMemberData()
  }
})

window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Ada perubahan yang belum disimpan'
  }
})
</script>