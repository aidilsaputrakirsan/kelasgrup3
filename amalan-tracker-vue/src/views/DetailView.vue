<!-- 📱 src/views/DetailView.vue - WITH HARI HALANGAN FEATURE -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
      <div class="max-w-lg mx-auto px-3 py-3 sm:px-4 sm:py-4">
        <div class="flex items-center justify-between">
          <button
            @click="$router.go(-1)"
            class="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors -ml-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline font-medium">Kembali</span>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ member }}</span>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-lg font-bold text-gray-800">Input Amalan</h1>
            </div>
          </div>
          
          <button
            @click="authStore.logout"
            class="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors -mr-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline font-medium">Keluar</span>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-lg mx-auto p-3 sm:p-4 space-y-4 sm:space-y-5">
      
      <!-- Member Header Card -->
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
            {{ member }}
          </div>
          <div class="flex-1">
            <h2 class="text-xl sm:text-2xl font-bold mb-1">{{ member }}</h2>
            <div class="text-pink-100 text-sm sm:text-base">
              {{ weekRangeText }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Week Navigation -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>📅</span> Navigasi Pekan
        </h3>
        
        <div class="flex justify-between items-center gap-3">
          <button
            @click="changeWeek(-1)"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-colors flex-1 sm:flex-none min-h-[44px] justify-center"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Sebelumnya</span>
          </button>
          
          <div class="text-center px-2">
            <div class="font-bold text-gray-800 text-sm sm:text-base">Pekan {{ amalanStore.currentWeek }}</div>
            <div class="text-xs sm:text-sm text-gray-500">{{ monthYear }}</div>
          </div>
          
          <button
            @click="changeWeek(1)"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 rounded-lg transition-colors flex-1 sm:flex-none min-h-[44px] justify-center"
          >
            <span class="text-xs sm:text-sm font-medium">Selanjutnya</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Status Pekan Ini -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <span>⚡</span> Status Pekan Ini
        </h3>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold text-pink-600">{{ completedAmalan }}</div>
            <div class="text-xs text-pink-500">tercatat</div>
          </div>
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold text-purple-600">{{ DEFAULT_AMALAN.length - completedAmalan }}</div>
            <div class="text-xs text-purple-500">belum</div>
          </div>
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold text-indigo-600">{{ totalAmalan }}</div>
            <div class="text-xs text-indigo-500">total</div>
          </div>
        </div>
      </div>
      
      <!-- Amalan List -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 shadow-sm">
        <div class="flex justify-between items-center mb-4 sm:mb-5">
          <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
            <span>📝</span> Daftar Amalan
          </h3>
          
          <!-- Undo button - hanya muncul kalau ada unsaved changes -->
          <button
            v-if="hasUnsavedChanges"
            @click="undoAllChanges"
            class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-700 hover:from-yellow-100 hover:to-yellow-200 rounded-lg transition-colors text-xs sm:text-sm font-medium min-h-[36px]"
          >
            <span>↶</span>
            <span class="hidden sm:inline">Batal Semua</span>
            <span class="sm:hidden">Batal</span>
          </button>
        </div>
        
        <div class="space-y-3 sm:space-y-4">
          <AmalanItem
            v-for="(amalan, index) in DEFAULT_AMALAN"
            :key="amalan"
            :name="amalan"
            :value="amalanValues[amalan] || 0"
            :saved-value="savedAmalanValues[amalan] || 0"
            :is-saving="savingStates[amalan] || false"
            @update="updateAmalanValue"
            @save="saveIndividualAmalan"
          />
        </div>
      </div>

      <!-- ✅ NEW: Hari Halangan Section -->
      <div class="bg-gray-50/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-200/50 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="font-bold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
              <span>🌙</span> {{ HARI_HALANGAN.FIELD_NAME }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">{{ HARI_HALANGAN.DESCRIPTION }}</p>
          </div>
          
          <!-- Save button untuk halangan -->
          <button
            v-if="hasUnsavedHalanganChanges"
            @click="saveHariHalangan"
            :disabled="isSavingHalangan"
            class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors text-xs font-medium min-h-[36px]"
          >
            <span v-if="isSavingHalangan" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>💾</span>
            <span>{{ isSavingHalangan ? 'Menyimpan...' : 'Simpan' }}</span>
          </button>
        </div>
        
        <!-- Hari Halangan Input -->
        <div class="bg-white/70 rounded-xl p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm">🌙</span>
              </div>
              <div>
                <div class="font-medium text-gray-800 text-sm">{{ HARI_HALANGAN.FIELD_NAME }}</div>
                <div class="text-xs text-gray-500">Maksimal {{ HARI_HALANGAN.MAX_DAYS }} hari/pekan</div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <!-- Value display -->
              <div class="text-center">
                <div class="text-lg font-bold text-gray-600">{{ hariHalanganValue }}</div>
                <div class="text-xs text-gray-400">hari</div>
              </div>
              
              <!-- Input controls -->
              <div class="flex flex-col gap-1">
                <button
                  @click="adjustHariHalangan(1)"
                  :disabled="hariHalanganValue >= HARI_HALANGAN.MAX_DAYS"
                  class="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-gray-600 font-bold transition-colors"
                >
                  +
                </button>
                <button
                  @click="adjustHariHalangan(-1)"
                  :disabled="hariHalanganValue <= 0"
                  class="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-gray-600 font-bold transition-colors"
                >
                  −
                </button>
              </div>
            </div>
          </div>
          
          <!-- Status indicator -->
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500">
                Status: 
                <span :class="hasUnsavedHalanganChanges ? 'text-yellow-600' : 'text-green-600'">
                  {{ hasUnsavedHalanganChanges ? 'Belum disimpan' : 'Tersimpan' }}
                </span>
              </div>
              <div class="text-xs text-gray-400">
                Tersimpan: {{ savedHariHalanganValue }} hari
              </div>
            </div>
          </div>
        </div>
        
        <!-- Info note -->
        <div class="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
          <div class="text-xs text-blue-700">
            <strong>💡 Catatan:</strong> Hari halangan tidak dihitung dalam total amalan. 
            Data ini untuk membantu ustadzah memahami kondisi khusus dalam pekan ini.
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <span>⚡</span> Aksi Cepat
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            @click="resetToZero"
            class="flex items-center gap-2 justify-center px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <span>🗑️</span>
            <span>Reset ke Nol</span>
          </button>
          
          <button
            :disabled="!hasUnsavedChanges || isSaving"
            @click="saveAllChangedAmalan"
            class="flex items-center gap-2 justify-center px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <span v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>💾</span>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Semua' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Go to Report CTA -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-5 border border-indigo-200/50 shadow-sm">
        <div class="text-center">
          <div class="text-xl sm:text-2xl mb-2">📊</div>
          <p class="text-sm sm:text-base text-gray-700 font-medium mb-3">
            Lihat laporan lengkap dan statistik
          </p>
          <button
            @click="$router.push('/report')"
            class="flex items-center gap-2 justify-center px-4 py-2 bg-white/50 backdrop-blur-sm border border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors min-h-[44px] font-medium"
          >
            <span>📈</span>
            <span>Buka Laporan</span>
          </button>
        </div>
      </div>
    </main>
    
    <!-- Loading -->
    <div v-if="amalanStore.isLoading" class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border border-white/20 shadow-xl mx-4">
        <div class="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-soft mb-4">
          <span class="text-white text-xl">📿</span>
        </div>
        <div class="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-700 font-medium text-sm sm:text-base">Memuat data amalan...</p>
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
import { DEFAULT_AMALAN, HARI_HALANGAN } from '@/utils/constants'  // ✅ IMPORT HARI_HALANGAN
import { getMonthName, getWeekRange } from '@/utils/date'
import AmalanItem from '@/components/features/amalan/AmalanItem.vue'
import { MEMBERS } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

const member = ref(route.params.member)
const amalanValues = ref({})
const savedAmalanValues = ref({}) // 🔒 SAFE: Data yang sudah tersimpan
const isSaving = ref(false)
const savingStates = ref({}) // Track individual saving states

// ✅ NEW: Hari Halangan state
const hariHalanganValue = ref(0)
const savedHariHalanganValue = ref(0)
const isSavingHalangan = ref(false)

// Computed
const weekRangeText = computed(() => {
  const range = getWeekRange(amalanStore.currentWeek, amalanStore.currentMonth, amalanStore.currentYear)
  const monthName = getMonthName(amalanStore.currentMonth)
  return `${range.startDate}-${range.endDate} ${monthName} ${amalanStore.currentYear}`
})

const monthYear = computed(() => {
  return `${getMonthName(amalanStore.currentMonth)} ${amalanStore.currentYear}`
})

// ✅ UPDATE: Total amalan EXCLUDE hari halangan
const totalAmalan = computed(() => {
  return Object.values(amalanValues.value).reduce((sum, val) => sum + (val || 0), 0)
  // Hari halangan TIDAK masuk dalam total
})

// ✅ UPDATE: Completed amalan EXCLUDE hari halangan
const completedAmalan = computed(() => {
  return Object.values(amalanValues.value).filter(val => val > 0).length
  // Hari halangan TIDAK masuk dalam completed count
})

// 🔒 SAFE: Check if there are unsaved changes (amalan only)
const hasUnsavedChanges = computed(() => {
  for (const amalan of DEFAULT_AMALAN) {
    const current = amalanValues.value[amalan] || 0
    const saved = savedAmalanValues.value[amalan] || 0
    if (current !== saved) {
      return true
    }
  }
  return false
})

// ✅ NEW: Check unsaved halangan changes
const hasUnsavedHalanganChanges = computed(() => {
  return hariHalanganValue.value !== savedHariHalanganValue.value
})

// Methods
async function loadMemberData() {
  try {
    await amalanStore.loadMemberData(member.value)
    const memberData = amalanStore.memberData[member.value]
    
    if (memberData && memberData.amalan) {
      // Set amalan values
      amalanValues.value = { ...memberData.amalan }
      savedAmalanValues.value = { ...memberData.amalan }
      
      // ✅ NEW: Set hari halangan value
      hariHalanganValue.value = memberData.hariHalangan || 0
      savedHariHalanganValue.value = memberData.hariHalangan || 0
    } else {
      // Initialize empty
      const emptyData = {}
      DEFAULT_AMALAN.forEach(amalan => {
        emptyData[amalan] = 0
      })
      amalanValues.value = emptyData
      savedAmalanValues.value = { ...emptyData }
      
      // ✅ NEW: Initialize hari halangan
      hariHalanganValue.value = 0
      savedHariHalanganValue.value = 0
    }
    
    // Initialize saving states
    const emptySavingStates = {}
    DEFAULT_AMALAN.forEach(amalan => {
      emptySavingStates[amalan] = false
    })
    savingStates.value = emptySavingStates
    
  } catch (error) {
    uiStore.showToast('Gagal memuat data anggota', 'error')
  }
}

function updateAmalanValue(amalanName, value) {
  amalanValues.value[amalanName] = parseInt(value) || 0
}

// ✅ NEW: Adjust hari halangan dengan validation
function adjustHariHalangan(delta) {
  const newValue = hariHalanganValue.value + delta
  
  if (newValue >= 0 && newValue <= HARI_HALANGAN.MAX_DAYS) {
    hariHalanganValue.value = newValue
  }
}

// ✅ NEW: Save hari halangan
async function saveHariHalangan() {
  try {
    isSavingHalangan.value = true
    
    // Validation
    if (hariHalanganValue.value < 0 || hariHalanganValue.value > HARI_HALANGAN.MAX_DAYS) {
      uiStore.showToast(`Hari halangan harus antara 0-${HARI_HALANGAN.MAX_DAYS} hari`, 'error')
      return
    }
    
    // Call API dengan "Hari Halangan" sebagai amalanName
    await amalanStore.updateMemberAmalan(member.value, HARI_HALANGAN.FIELD_NAME, hariHalanganValue.value)
    
    // Update saved value after successful save
    savedHariHalanganValue.value = hariHalanganValue.value
    
    uiStore.showToast('Hari halangan berhasil disimpan', 'success')
  } catch (error) {
    console.error('❌ Save hari halangan error:', error)
    uiStore.showToast('Gagal menyimpan hari halangan', 'error')
  } finally {
    isSavingHalangan.value = false
  }
}

// Individual save per amalan - instant feedback
async function saveIndividualAmalan(amalanName) {
  try {
    savingStates.value[amalanName] = true
    
    const value = amalanValues.value[amalanName] || 0
    await amalanStore.updateMemberAmalan(member.value, amalanName, value)
    
    // Update saved value after successful save
    savedAmalanValues.value[amalanName] = value
    
    uiStore.showToast(`${amalanName} berhasil disimpan`, 'success')
  } catch (error) {
    uiStore.showToast(`Gagal menyimpan ${amalanName}`, 'error')
  } finally {
    savingStates.value[amalanName] = false
  }
}

// 🧠 Smart save all - hanya yang berubah (amalan only, exclude halangan)
async function saveAllChangedAmalan() {
  try {
    isSaving.value = true
    
    // 🎯 INTELLIGENT DIFF: Cari yang berubah aja (amalan only)
    const changedAmalan = []
    for (const amalan of DEFAULT_AMALAN) {
      const current = amalanValues.value[amalan] || 0
      const saved = savedAmalanValues.value[amalan] || 0
      if (current !== saved) {
        changedAmalan.push({ name: amalan, value: current })
      }
    }
    
    if (changedAmalan.length === 0) {
      uiStore.showToast('Tidak ada perubahan amalan untuk disimpan', 'info')
      return
    }
    
    console.log(`💾 Saving ${changedAmalan.length} changed amalan:`, changedAmalan.map(a => a.name))
    
    // Save yang berubah aja - parallel untuk speed
    const savePromises = changedAmalan.map(async ({ name, value }) => {
      await amalanStore.updateMemberAmalan(member.value, name, value)
      return { name, value }
    })
    
    const results = await Promise.all(savePromises)
    
    // Update saved values after successful saves
    results.forEach(({ name, value }) => {
      savedAmalanValues.value[name] = value
    })
    
    uiStore.showToast(`✅ ${changedAmalan.length} amalan berhasil disimpan`, 'success')
  } catch (error) {
    console.error('❌ Save all error:', error)
    uiStore.showToast('Gagal menyimpan beberapa data', 'error')
  } finally {
    isSaving.value = false
  }
}

// 🔒 SAFE: Undo to last saved state (include halangan)
function undoAllChanges() {
  const hasAmalanChanges = hasUnsavedChanges.value
  const hasHalanganChanges = hasUnsavedHalanganChanges.value
  
  if (!hasAmalanChanges && !hasHalanganChanges) {
    uiStore.showToast('Tidak ada perubahan untuk dibatalkan', 'info')
    return
  }
  
  if (confirm('Yakin ingin membatalkan semua perubahan yang belum disimpan?')) {
    // Undo amalan changes
    if (hasAmalanChanges) {
      amalanValues.value = { ...savedAmalanValues.value }
    }
    
    // ✅ NEW: Undo halangan changes
    if (hasHalanganChanges) {
      hariHalanganValue.value = savedHariHalanganValue.value
    }
    
    uiStore.showToast('Semua perubahan dibatalkan', 'info')
  }
}

// 🗑️ DANGEROUS: Reset to zero (with extra confirmation)
function resetToZero() {
  const hasChanges = hasUnsavedChanges.value || hasUnsavedHalanganChanges.value
  
  const message = hasChanges 
    ? 'PERINGATAN: Ini akan menghapus SEMUA data termasuk yang sudah disimpan! Yakin ingin reset ke nol?'
    : 'Yakin ingin reset semua data ke nol?'
    
  if (confirm(message)) {
    // Reset amalan
    Object.keys(amalanValues.value).forEach(key => {
      amalanValues.value[key] = 0
    })
    
    // ✅ NEW: Reset hari halangan
    hariHalanganValue.value = 0
    
    uiStore.showToast('Reset ke nol, jangan lupa simpan jika diinginkan', 'warning')
  }
}

async function changeWeek(direction) {
  const hasChanges = hasUnsavedChanges.value || hasUnsavedHalanganChanges.value
  
  if (hasChanges) {
    if (!confirm('Ada perubahan yang belum disimpan. Lanjutkan?')) {
      return
    }
  }
  
  amalanStore.changeWeek(direction)
  await loadMemberData()
}

// Lifecycle
onMounted(async () => {
  if (!member.value || !MEMBERS.includes(member.value)) {
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

// 🔒 SAFE: Warn before leaving with unsaved changes (include halangan)
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges.value || hasUnsavedHalanganChanges.value) {
    e.preventDefault()
    e.returnValue = 'Ada perubahan yang belum disimpan'
  }
})
</script>