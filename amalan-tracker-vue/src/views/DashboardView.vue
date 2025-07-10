<!-- 📄 src/views/DashboardView.vue - FIXED dengan Quick Actions -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header dengan Islamic greeting -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white text-lg">📿</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-800">Amalan Tracker</h1>
              <p class="text-xs text-gray-500">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Sync Button -->
            <AppButton
              variant="ghost"
              size="sm"
              :loading="isSyncing"
              @click="handleSync"
              class="text-gray-600 hover:text-pink-600"
            >
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </template>
            </AppButton>
            
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <AppButton
                variant="ghost"
                size="sm"
                @click="showUserMenu = !showUserMenu"
                class="text-gray-600 hover:text-pink-600"
              >
                {{ authStore.user }}
              </AppButton>
              
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-2 z-50"
              >
                <button
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-50 transition-colors"
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
    <main class="max-w-md mx-auto p-4 space-y-6">
      <!-- Today's Focus Card -->
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h2 class="text-xl font-bold mb-2">🌅 Focus Hari Ini</h2>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-yellow-300">⭐</span>
            <span>Dzikir pagi & petang</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-yellow-300">📖</span>
            <span>Tilawah 2 halaman</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-yellow-300">🤲</span>
            <span>Istighfar 100x</span>
          </div>
        </div>
        <div class="mt-4 text-sm opacity-90">
          Login: {{ loginTimeFormatted }}
        </div>
      </div>

      <!-- Week Selector -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span> Pilih Pekan
        </h3>
        <WeekSelector
          :current-week="amalanStore.currentWeek"
          :current-month="amalanStore.currentMonth"
          :current-year="amalanStore.currentYear"
          @week-changed="handleWeekChange"
        />
      </div>
      
      <!-- Members Grid -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span> Anggota Keluarga
          </h3>
          <p class="text-sm text-gray-500">Tap untuk detail</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <MemberCard
            v-for="member in MEMBERS"
            :key="member"
            :member="member"
            :data="amalanStore.dashboardData[member] || {}"
            @click="navigateToDetail(member)"
          />
        </div>
      </div>

      <!-- 🔥 QUICK ACTIONS - RESTORED -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span> Aksi Cepat
        </h3>
        
        <div class="grid grid-cols-2 gap-4">
          <AppButton
            variant="outline"
            class="w-full bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200"
            @click="$router.push('/report')"
          >
            <template #icon>
              <span class="text-lg">📊</span>
            </template>
            Laporan Bulanan
          </AppButton>
          
          <AppButton
            variant="secondary"
            class="w-full bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200"
            @click="handleSync"
            :loading="isSyncing"
          >
            <template #icon>
              <span class="text-lg">🔄</span>
            </template>
            Sinkronisasi
          </AppButton>
        </div>
      </div>
      
      <!-- Weekly Stats -->
      <div v-if="weeklyStats" class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span> Statistik Pekan Ini
        </h3>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
            <div class="text-2xl font-bold text-pink-600">{{ weeklyStats.total || 0 }}</div>
            <div class="text-xs text-pink-500 uppercase tracking-wide">Total Amalan</div>
          </div>
          <div class="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div class="text-2xl font-bold text-purple-600">{{ weeklyStats.average || 0 }}</div>
            <div class="text-xs text-purple-500 uppercase tracking-wide">Rata-rata</div>
          </div>
          <div class="text-center bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
            <div class="text-xl font-bold text-indigo-600">{{ weeklyStats.topMember || '-' }}</div>
            <div class="text-xs text-indigo-500 uppercase tracking-wide">Teraktif</div>
          </div>
        </div>
      </div>

      <!-- Islamic Inspiration -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
        <div class="text-center">
          <div class="text-2xl mb-3">🌙</div>
          <p class="text-sm text-gray-700 font-medium leading-relaxed">
            "Dan ingatlah kepada Tuhanmu dalam hatimu dengan merendahkan diri dan rasa takut"
          </p>
          <p class="text-xs text-gray-500 mt-2">- QS Al-A'raf: 205</p>
        </div>
      </div>
    </main>
    
    <!-- Pull to Refresh indicator -->
    <div v-if="isPulling" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/20">
        <svg class="w-6 h-6 animate-spin text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  </div>
</template>

<!-- Script tetap sama seperti sebelumnya -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAmalanStore } from '@/stores/amalan'
import { useUiStore } from '@/stores/ui'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import { MEMBERS } from '@/utils/constants'
import AppButton from '@/components/ui/AppButton.vue'
import WeekSelector from '@/components/features/dashboard/WeekSelector.vue'
import MemberCard from '@/components/features/dashboard/MemberCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

const showUserMenu = ref(false)
const isSyncing = ref(false)
const userMenuRef = ref(null)

const { isPulling } = usePullToRefresh(handleRefresh)

const loginTimeFormatted = computed(() => {
  if (!authStore.loginTime) return '-'
  return new Date(parseInt(authStore.loginTime)).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
})

const weeklyStats = computed(() => {
  const data = amalanStore.dashboardData
  if (!data || typeof data !== 'object') return null
  
  const members = Object.values(data)
  const total = members.reduce((sum, member) => sum + (member.totalAmalan || 0), 0)
  const average = members.length > 0 ? (total / members.length).toFixed(1) : 0
  const topMember = members.reduce((top, member, index) => {
    return (member.totalAmalan || 0) > (top.totalAmalan || 0) ? 
      { ...member, name: MEMBERS[index] } : top
  }, {}).name || '-'
  
  return { total, average, topMember }
})

onMounted(async () => {
  await loadData()
  setupClickOutside()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function loadData() {
  try {
    await amalanStore.loadDashboardData()
  } catch (error) {
    uiStore.showToast('Gagal memuat data dashboard', 'error')
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