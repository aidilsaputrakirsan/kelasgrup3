<!-- 📄 src/views/ReportView.vue - FIXED WITH REAL DATA FROM GAS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header sama seperti sebelumnya -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <AppButton
            variant="ghost"
            size="sm"
            @click="$router.push('/dashboard')"
            class="text-gray-600 hover:text-pink-600"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </template>
            Dashboard
          </AppButton>
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg">📊</span>
            </div>
            <h1 class="text-lg font-bold text-gray-800">Laporan</h1>
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
      <!-- Period Selector -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🗓️</span> Pilih Periode
        </h3>
        
        <div class="space-y-4">
          <!-- Month Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              v-model="selectedMonth"
              class="w-full bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-700 border border-white/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
              @change="loadReportData"
            >
              <option v-for="month in 12" :key="month" :value="month">
                {{ getMonthName(month) }}
              </option>
            </select>
          </div>
          
          <!-- Year Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              v-model="selectedYear"
              class="w-full bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-700 border border-white/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
              @change="loadReportData"
            >
              <option v-for="year in yearRange" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Summary Cards - REAL DATA -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
          <div class="text-3xl font-bold mb-1">{{ reportStats.totalAmalan }}</div>
          <div class="text-sm opacity-90">Total Amalan</div>
          <div class="text-xs opacity-75 mt-1">Bulan ini</div>
        </div>
        
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
          <div class="text-3xl font-bold mb-1">{{ reportStats.averagePerMember }}</div>
          <div class="text-sm opacity-90">Rata-rata</div>
          <div class="text-xs opacity-75 mt-1">Per anggota</div>
        </div>
      </div>
      
      <!-- Top Performers - REAL DATA -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🏆</span> Anggota Teraktif
        </h3>
        
        <div class="space-y-3">
          <div
            v-for="(member, index) in topPerformers"
            :key="member.name"
            class="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
          >
            <!-- Rank Badge -->
            <div :class="getRankClasses(index)" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {{ index + 1 }}
            </div>
            
            <!-- Member Info -->
            <div class="flex-1">
              <div class="font-bold text-gray-800">{{ member.name }}</div>
              <div class="text-sm text-gray-600">{{ member.totalAmalan }} amalan dicatat</div>
              <div class="text-xs text-gray-500">Konsistensi: {{ member.consistency }}%</div>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-20">
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  :style="{ width: `${member.percentage}%` }"
                  :class="getProgressColor(index)"
                  class="h-full rounded-full transition-all duration-1000"
                ></div>
              </div>
              <div class="text-xs text-gray-500 text-center mt-1">{{ member.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Member Details - REAL DATA -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👥</span> Detail per Anggota
        </h3>
        
        <div class="space-y-4">
          <div
            v-for="member in MEMBERS"
            :key="member"
            class="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ member }}
                </div>
                <h4 class="font-bold text-gray-800">{{ member }}</h4>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-pink-600">{{ getMemberStats(member).totalAmalan }}</div>
                <div class="text-xs text-gray-500">total amalan</div>
              </div>
            </div>
            
            <!-- Top Amalan atau Amalan Terfavorit -->
            <div class="space-y-2">
              <div class="text-xs text-gray-600 font-medium">Amalan Terfavorit:</div>
              <div class="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span class="text-gray-700">{{ getMemberStats(member).topAmalan || 'Belum ada data' }}</span>
                <span class="font-medium text-gray-600">Konsistensi: {{ getMemberStats(member).consistency }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Export Actions -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📤</span> Ekspor & Bagikan
        </h3>
        
        <div class="space-y-3">
          <AppButton
            variant="primary"
            class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            @click="exportReport"
          >
            <template #icon>
              <span class="text-lg">📄</span>
            </template>
            Ekspor ke CSV
          </AppButton>
          
          <AppButton
            variant="outline"
            class="w-full bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200"
            @click="shareReport"
          >
            <template #icon>
              <span class="text-lg">📤</span>
            </template>
            Bagikan Laporan
          </AppButton>
        </div>
      </div>
      
      <!-- Islamic Quote -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
        <div class="text-center">
          <div class="text-2xl mb-3">📈</div>
          <p class="text-sm text-gray-700 font-medium leading-relaxed">
            "Dan bahwasanya seorang manusia tiada memperoleh selain apa yang telah diusahakannya."
          </p>
          <p class="text-xs text-gray-500 mt-2">- QS An-Najm: 39</p>
        </div>
      </div>
    </main>
    
    <!-- Loading -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 shadow-xl">
        <div class="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-soft mb-4">
          <span class="text-white text-xl">📊</span>
        </div>
        <div class="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-700 font-medium">Memuat laporan...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAmalanStore } from '@/stores/amalan'
import { useUiStore } from '@/stores/ui'
import { MEMBERS } from '@/utils/constants'
import { getMonthName, getCurrentMonth, getCurrentYear } from '@/utils/date'
import AppButton from '@/components/ui/AppButton.vue'

const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

// State
const selectedMonth = ref(getCurrentMonth())
const selectedYear = ref(getCurrentYear())
const isLoading = ref(false)

// Computed
const yearRange = computed(() => {
  const currentYear = getCurrentYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

// Real report stats dari store
const reportStats = computed(() => {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.summary) {
    return {
      totalAmalan: 0,
      averagePerMember: 0,
      mostActive: '-'
    }
  }
  
  return {
    totalAmalan: reportData.summary.totalAmalan || 0,
    averagePerMember: reportData.summary.avgPerMember || 0,
    mostActive: reportData.summary.mostActive || '-'
  }
})

const topPerformers = computed(() => {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.members) {
    return []
  }
  
  const performers = MEMBERS.map(member => {
    const memberData = reportData.members[member] || {}
    return {
      name: member,
      totalAmalan: memberData.totalAmalan || 0,
      consistency: memberData.consistency || 0
    }
  })
  
  // Sort by total amalan descending
  performers.sort((a, b) => b.totalAmalan - a.totalAmalan)
  
  // Calculate percentages based on highest performer
  const maxAmalan = performers[0]?.totalAmalan || 1
  
  return performers.map(performer => ({
    ...performer,
    percentage: Math.round((performer.totalAmalan / maxAmalan) * 100)
  }))
})

// Methods
async function loadReportData() {
  try {
    isLoading.value = true
    console.log('📊 Loading report data for:', selectedMonth.value, selectedYear.value)
    
    // Gunakan store method untuk load monthly report
    await amalanStore.loadMonthlyReport(selectedMonth.value, selectedYear.value)
    
    uiStore.showToast('Laporan berhasil dimuat', 'success')
  } catch (error) {
    console.error('❌ Failed to load report:', error)
    uiStore.showToast('Gagal memuat data laporan', 'error')
  } finally {
    isLoading.value = false
  }
}

function getMemberStats(member) {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.members || !reportData.members[member]) {
    return {
      totalAmalan: 0,
      topAmalan: '-',
      consistency: 0
    }
  }
  
  return reportData.members[member]
}

function getRankClasses(index) {
  const classes = [
    'bg-gradient-to-r from-yellow-400 to-orange-500', // Gold
    'bg-gradient-to-r from-gray-400 to-gray-500',     // Silver
    'bg-gradient-to-r from-orange-400 to-orange-500', // Bronze
    'bg-gradient-to-r from-blue-400 to-blue-500'      // Others
  ]
  return classes[index] || classes[3]
}

function getProgressColor(index) {
  const colors = [
    'bg-gradient-to-r from-yellow-400 to-orange-500',
    'bg-gradient-to-r from-gray-400 to-gray-500',
    'bg-gradient-to-r from-orange-400 to-orange-500',
    'bg-gradient-to-r from-blue-400 to-blue-500'
  ]
  return colors[index] || colors[3]
}

function exportReport() {
  try {
    const reportData = amalanStore.monthlyReportData
    if (!reportData) {
      uiStore.showToast('Tidak ada data untuk diekspor', 'error')
      return
    }
    
    let csvContent = `Anggota,Total Amalan,Amalan Terfavorit,Konsistensi\n`
    
    MEMBERS.forEach(member => {
      const stats = getMemberStats(member)
      csvContent += `${member},${stats.totalAmalan},${stats.topAmalan},${stats.consistency}%\n`
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-amalan-${getMonthName(selectedMonth.value)}-${selectedYear.value}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    uiStore.showToast('Laporan berhasil diekspor', 'success')
  } catch (error) {
    console.error('Export error:', error)
    uiStore.showToast('Gagal mengekspor laporan', 'error')
  }
}

async function shareReport() {
  const shareText = `📊 Laporan Amalan ${getMonthName(selectedMonth.value)} ${selectedYear.value}\n\n` +
    `Total Amalan: ${reportStats.value.totalAmalan}\n` +
    `Rata-rata per Anggota: ${reportStats.value.averagePerMember}\n\n` +
    `🏆 Anggota Teraktif: ${topPerformers.value[0]?.name || '-'}\n\n` +
    `Alhamdulillahi rabbil alameen 🤲`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Laporan Amalan Harian',
        text: shareText
      })
      uiStore.showToast('Laporan berhasil dibagikan', 'success')
    } catch (error) {
      // User cancelled sharing
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText)
      uiStore.showToast('Laporan disalin ke clipboard', 'success')
    } catch (error) {
      uiStore.showToast('Gagal menyalin laporan', 'error')
    }
  }
}

// Lifecycle
onMounted(async () => {
  await loadReportData()
})
</script>