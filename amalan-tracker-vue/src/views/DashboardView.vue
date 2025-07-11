<!-- 📄 src/views/DashboardView.vue - IMPROVED SMART DASHBOARD -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header dengan Islamic greeting -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
      <div class="max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white text-base sm:text-lg">📿</span>
            </div>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-gray-800">Amalan Tracker</h1>
              <p class="text-xs text-gray-500">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            </div>
          </div>
          
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- Sync Button -->
            <button
              :disabled="isSyncing"
              @click="handleSync"
              class="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'animate-spin': isSyncing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors text-xs sm:text-sm font-medium"
              >
                {{ authStore.user }}
              </button>
              
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-36 sm:w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-2 z-50"
              >
                <button
                  class="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                  @click="handleLogout"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-lg mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
      <!-- 🧠 SMART Today's Focus Card - Dynamic Content -->
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <h2 class="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
          <span>🌅</span> 
          <span>{{ currentPeriod }} ini</span>
        </h2>
        
        <div class="space-y-2">
          <!-- Dynamic focus items berdasarkan performance terrendah -->
          <div 
            v-for="focus in smartFocusItems" 
            :key="focus.text"
            class="flex items-center gap-2 text-sm sm:text-base"
          >
            <span class="text-yellow-300">{{ focus.icon }}</span>
            <span>{{ focus.text }}</span>
          </div>
        </div>
        
        <div class="mt-4 text-xs sm:text-sm opacity-90 flex justify-between">
          <span>Login: {{ loginTimeFormatted }}</span>
          <span v-if="weeklyStats">Target: {{ weeklyProgressText }}</span>
        </div>
      </div>

      <!-- Week Selector with better mobile spacing -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>📅</span> Pilih Pekan
        </h3>
        <WeekSelector
          :current-week="amalanStore.currentWeek"
          :current-month="amalanStore.currentMonth"
          :current-year="amalanStore.currentYear"
          @week-changed="handleWeekChange"
        />
      </div>
      
      <!-- Members Grid with better responsiveness -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
            <span>👥</span> Anggota Keluarga
          </h3>
          <p class="text-xs sm:text-sm text-gray-500">Tap untuk detail</p>
        </div>
        
        <!-- Loading state untuk members -->
        <div v-if="isLoadingMembers" class="grid grid-cols-2 gap-3 sm:gap-4">
          <div v-for="i in 4" :key="i" class="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
        
        <!-- Member cards with error handling -->
        <div v-else-if="membersData.length > 0" class="grid grid-cols-2 gap-3 sm:gap-4">
          <MemberCard
            v-for="member in MEMBERS"
            :key="member"
            :member="member"
            :data="getMemberData(member)"
            :is-loading="false"
            @click="navigateToDetail(member)"
          />
        </div>
        
        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <div class="text-4xl mb-2">📭</div>
          <p class="text-gray-500 text-sm">Belum ada data untuk pekan ini</p>
          <button 
            @click="handleSync"
            class="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-medium hover:bg-pink-600 transition-colors"
          >
            Muat Data
          </button>
        </div>
      </div>

      <!-- Quick Actions with better mobile layout -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>⚡</span> Aksi Cepat
        </h3>
        
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            @click="$router.push('/report')"
            class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-colors min-h-[80px] sm:min-h-[auto]"
          >
            <span class="text-lg sm:text-xl">📊</span>
            <span class="text-xs sm:text-sm font-medium text-center">Laporan Bulanan</span>
          </button>
          
          <button
            @click="handleSync"
            :disabled="isSyncing"
            class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 disabled:opacity-50 rounded-xl transition-colors min-h-[80px] sm:min-h-[auto]"
          >
            <span class="text-lg sm:text-xl" :class="{ 'animate-spin': isSyncing }">🔄</span>
            <span class="text-xs sm:text-sm font-medium text-center">{{ isSyncing ? 'Sync...' : 'Sinkronisasi' }}</span>
          </button>
        </div>
      </div>
      
      <div v-if="!isLoadingMembers" class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>🎯</span> Progress Hari Ini
        </h3>
        
        <!-- Daily Progress Cards -->
        <div class="space-y-3 sm:space-y-4">
          <!-- Family Progress -->
          <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200/50">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-pink-600">👨‍👩‍👧‍👦</span>
                <span class="font-medium text-gray-800 text-sm">Keluarga Hari Ini</span>
              </div>
              <span class="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                {{ familyTodayProgress }}% tercapai
              </span>
            </div>
            
            <!-- Progress bar -->
            <div class="w-full h-2 bg-pink-200 rounded-full overflow-hidden mb-2">
              <div 
                :style="{ width: `${familyTodayProgress}%` }"
                class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000"
              ></div>
            </div>
            
            <div class="text-xs text-gray-600">
              {{ familyProgressText }}
            </div>
          </div>
          
          <!-- Quick Win Suggestions -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="suggestion in quickWinSuggestions" 
              :key="suggestion.text"
              @click="suggestion.action"
              class="bg-white/50 border border-white/30 rounded-xl p-3 cursor-pointer hover:bg-white/70 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm">
                  {{ suggestion.icon }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-800 text-sm">{{ suggestion.title }}</div>
                  <div class="text-xs text-gray-600">{{ suggestion.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <!-- Recent Activity & Motivation - LEBIH PERSONAL -->
      <div v-if="recentActivities.length > 0" class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>⚡</span> Aktivitas Terbaru
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="activity in recentActivities.slice(0, 3)" 
            :key="activity.id"
            class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {{ activity.member }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-800 text-sm">
                {{ activity.member }} {{ activity.action }}
              </div>
              <div class="text-xs text-gray-600">
                {{ activity.amalan }} - {{ activity.timeAgo }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-indigo-600 text-sm">+{{ activity.jumlah }}</div>
            </div>
          </div>
        </div>
        
        <!-- Motivational insight -->
        <div class="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div class="flex items-center gap-2">
            <span class="text-yellow-600">💡</span>
            <span class="text-xs sm:text-sm text-yellow-800 font-medium">{{ motivationalInsight }}</span>
          </div>
        </div>
      </div>

      <!-- Islamic Inspiration -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 border border-emerald-200/50 shadow-sm">
        <div class="text-center">
          <div class="text-xl sm:text-2xl mb-3">🌙</div>
          <p class="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
            "{{ randomQuote.text }}"
          </p>
          <p class="text-xs text-gray-500 mt-2">{{ randomQuote.source }}</p>
        </div>
      </div>
    </main>
    
    <!-- Pull to Refresh indicator with better positioning -->
    <div v-if="isPulling" class="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg border border-white/20">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAmalanStore } from '@/stores/amalan'
import { useUiStore } from '@/stores/ui'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import { MEMBERS } from '@/utils/constants'
import WeekSelector from '@/components/features/dashboard/WeekSelector.vue'
import MemberCard from '@/components/features/dashboard/MemberCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

const showUserMenu = ref(false)
const isSyncing = ref(false)
const isLoadingMembers = ref(false)
const userMenuRef = ref(null)

const { isPulling } = usePullToRefresh(handleRefresh)

// 🧠 SMART computed properties
const currentPeriod = computed(() => {
  const now = new Date()
  const currentHour = now.getHours()
  
  if (currentHour < 12) return 'Pagi'
  if (currentHour < 15) return 'Siang'  
  if (currentHour < 18) return 'Sore'
  return 'Malam'
})

const loginTimeFormatted = computed(() => {
  if (!authStore.loginTime) return '-'
  return new Date(parseInt(authStore.loginTime)).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
})

const membersData = computed(() => {
  const data = amalanStore.dashboardData
  if (!data || typeof data !== 'object') return []
  
  return MEMBERS.map(member => ({
    name: member,
    data: data[member] || { totalAmalan: 0, completedAmalan: 0 }
  }))
})

const weeklyStats = computed(() => {
  const data = amalanStore.dashboardData
  if (!data || typeof data !== 'object') return null
  
  const members = Object.values(data)
  const total = members.reduce((sum, member) => sum + (member.totalAmalan || 0), 0)
  const average = members.length > 0 ? Math.round(total / members.length) : 0
  const topMember = members.reduce((top, member, index) => {
    return (member.totalAmalan || 0) > (top.totalAmalan || 0) ? 
      { ...member, name: MEMBERS[index] } : top
  }, {}).name || '-'
  
  return { total, average, topMember }
})

const weeklyProgressText = computed(() => {
  if (!weeklyStats.value) return '0%'
  
  // Realistic weekly target (simplified)
  const weeklyTarget = 200 // Adjusted realistic target
  const progress = Math.round((weeklyStats.value.total / weeklyTarget) * 100)
  return `${Math.min(progress, 100)}%`
})

// 🎯 SMART Focus Items - Dynamic berdasarkan data
const smartFocusItems = computed(() => {
  const data = amalanStore.dashboardData
  
  // Default focus items kalau tidak ada data
  const defaultItems = [
    { icon: '⭐', text: 'Dzikir pagi & petang' },
    { icon: '📖', text: 'Tilawah minimal 1 halaman' },
    { icon: '🤲', text: 'Istighfar 100x' }
  ]
  
  if (!data || !weeklyStats.value) return defaultItems
  
  // Smart recommendations berdasarkan performance
  const total = weeklyStats.value.total
  const average = weeklyStats.value.average
  
  if (total < 50) {
    return [
      { icon: '🚀', text: 'Mulai dengan amalan ringan' },
      { icon: '📖', text: 'Target: 3 jenis amalan hari ini' },
      { icon: '💪', text: 'Konsistensi lebih penting dari jumlah' }
    ]
  } else if (total < 150) {
    return [
      { icon: '🔥', text: 'Pertahankan momentum!' },
      { icon: '⭐', text: 'Tambah 2 jenis amalan baru' },
      { icon: '🎯', text: 'Target: 200 amalan pekan ini' }
    ]
  } else {
    return [
      { icon: '👑', text: 'Alhamdulillah, sangat baik!' },
      { icon: '📈', text: 'Fokus pada kualitas amalan' },
      { icon: '🤲', text: 'Doa untuk keluarga' }
    ]
  }
})

// 💡 Smart weekly insight
const weeklyInsight = computed(() => {
  if (!weeklyStats.value) return null
  
  const { total, average, topMember } = weeklyStats.value
  
  if (total === 0) {
    return 'Yuk mulai catat amalan hari ini! 🌱'
  } else if (total < 50) {
    return 'Pekan yang baik untuk membangun habit! 💪'
  } else if (total < 150) {
    return `Bagus! ${topMember} sedang memimpin pekan ini 🏆`
  } else if (total < 300) {
    return `MasyaAllah! Target 300 amalan hampir tercapai 🎯`
  } else {
    return `Subhanallah! Keluarga sangat aktif beramalan 🌟`
  }
})

const familyTodayProgress = computed(() => {
  if (!weeklyStats.value) return 0
  
  // Simple daily target (weekly target / 7)
  const dailyTarget = 30 // Realistic daily target for family
  const todayProgress = Math.min(weeklyStats.value.total, dailyTarget)
  
  return Math.round((todayProgress / dailyTarget) * 100)
})

const familyProgressText = computed(() => {
  if (!weeklyStats.value) return 'Belum ada aktivitas hari ini'
  
  const total = weeklyStats.value.total
  const topMember = weeklyStats.value.topMember
  
  if (total === 0) {
    return 'Yuk mulai amalan pertama hari ini! 🌱'
  } else if (total < 10) {
    return `Start yang bagus! ${topMember} memulai lebih dulu 👏`
  } else if (total < 25) {
    return `Alhamdulillah, momentum sedang terbangun 🔥`
  } else {
    return `MasyaAllah! Keluarga sangat aktif hari ini ⭐`
  }
})

const quickWinSuggestions = computed(() => {
  const suggestions = [
    {
      icon: '📖',
      title: 'Tilawah Cepat',
      text: 'Baca 1 halaman Al-Quran',
    //  action: () => router.push('/detail/ATK') // Navigate to most active member
    },
    {
      icon: '🤲',
      title: 'Dzikir Singkat',
      text: 'Istighfar 33x (2 menit)',
      //action: () => router.push('/detail/AYS')
    },
    {
      icon: '🕌',
      title: 'Shalat Sunnah',
      text: '2 rakaat shalat Dhuha',
      //action: () => router.push('/detail/FTR')
    },
    {
      icon: '💰',
      title: 'Sedekah Harian',
      text: 'Infaq seikhlasnya',
      //action: () => router.push('/detail/WIN')
    }
  ]
  
  // Return 2 random suggestions
  const shuffled = [...suggestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 2)
})

// Mock recent activities (nanti bisa ambil dari real data)
const recentActivities = computed(() => {
  // Nanti bisa ambil dari amalanStore.recentActivity
  return [
    {
      id: 1,
      member: 'ATK',
      action: 'menambah',
      amalan: 'Istighfar',
      jumlah: 50,
      timeAgo: '5 menit lalu'
    },
    {
      id: 2,
      member: 'AYS',
      action: 'mencatat',
      amalan: 'Tilawah',
      jumlah: 2,
      timeAgo: '15 menit lalu'
    },
    {
      id: 3,
      member: 'FTR',
      action: 'menyelesaikan',
      amalan: 'Shalat Dhuha',
      jumlah: 1,
      timeAgo: '1 jam lalu'
    }
  ].filter(Boolean) // Nanti filter berdasarkan data real
})

const motivationalInsight = computed(() => {
  if (!weeklyStats.value) return 'Mari mulai hari dengan bismillah 🌅'
  
  const { total, topMember } = weeklyStats.value
  const currentHour = new Date().getHours()
  
  if (currentHour < 10) {
    return total > 5 ? 'Pagi yang produktif! Lanjutkan sampai sore 💪' : 'Pagi adalah waktu terbaik untuk memulai amalan 🌅'
  } else if (currentHour < 15) {
    return total > 15 ? `${topMember} sedang konsisten hari ini! Yang lain menyusul ya 🏃‍♀️` : 'Masih ada waktu untuk kejar target siang ini ⏰'
  } else if (currentHour < 18) {
    return total > 25 ? 'Alhamdulillah, hari yang berkah! Tutup dengan amalan malam 🌙' : 'Sore yang tenang, waktu yang tepat untuk tilawah 📖'
  } else {
    return 'Malam adalah waktu terbaik untuk muhasabah dan dzikir 🌙'
  }
})

// 🔄 Random Islamic quotes
const islamicQuotes = [
  { text: "Dan ingatlah kepada Tuhanmu dalam hatimu dengan merendahkan diri dan rasa takut", source: "QS Al-A'raf: 205" },
  { text: "Dan sebutlah nama Tuhanmu pada waktu pagi dan petang", source: "QS Al-Insan: 25" },
  { text: "Dan bertasbihlah kepada-Nya pada sebagian malam dan setelah sujud", source: "QS Qaf: 40" },
  { text: "Maka ingatlah kepada-Ku, niscaya Aku ingat kepadamu", source: "QS Al-Baqarah: 152" },
  { text: "Dan bagi mereka yang beriman dan beramal saleh, bagi mereka maghfirah dan rizki yang mulia", source: "QS Al-Hajj: 50" }
]

const randomQuote = computed(() => {
  const index = Math.floor(Date.now() / (1000 * 60 * 60)) % islamicQuotes.length // Change every hour
  return islamicQuotes[index]
})

// Methods
onMounted(async () => {
  await loadData()
  setupClickOutside()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function loadData() {
  try {
    isLoadingMembers.value = true
    await amalanStore.loadDashboardData()
  } catch (error) {
    console.error('Dashboard load error:', error)
    uiStore.showToast('Gagal memuat data dashboard', 'error')
  } finally {
    isLoadingMembers.value = false
  }
}

async function handleRefresh() {
  await loadData()
  uiStore.showToast('Data berhasil diperbarui', 'success')
}

async function handleSync() {
  try {
    isSyncing.value = true
    const { api } = await import('@/utils/api')
    await api.syncData()
    await loadData()
    uiStore.showToast('Sinkronisasi berhasil', 'success')
  } catch (error) {
    console.error('Sync error:', error)
    uiStore.showToast('Gagal sinkronisasi', 'error')
  } finally {
    isSyncing.value = false
  }
}

async function handleWeekChange(week) {
  amalanStore.setCurrentWeek(week)
  await loadData()
}

function navigateToDetail(member) {
  router.push({
    name: 'detail',
    params: { member },
    query: {
      week: amalanStore.currentWeek,
      month: amalanStore.currentMonth,
      year: amalanStore.currentYear
    }
  })
}

function getMemberData(member) {
  const data = amalanStore.dashboardData
  return data?.[member] || { totalAmalan: 0, completedAmalan: 0 }
}

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
}

function setupClickOutside() {
  document.addEventListener('click', handleClickOutside)
}

function handleClickOutside(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}
</script>