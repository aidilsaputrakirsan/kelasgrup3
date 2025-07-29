<!-- 📄 src/views/ReportView.vue - DYNAMIC VERSION -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <!-- Header -->
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
      
      <!-- Summary Cards -->
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
      
      <!-- Tabel Data Amalan - DYNAMIC -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Tabel Data Amalan
        </h3>
        
        <!-- Responsive table wrapper -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <th class="border border-gray-300 px-3 py-2 text-left font-semibold">Nama Amalan</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-semibold bg-yellow-100 text-gray-800">Target</th>
                <th 
                  v-for="member in MEMBERS" 
                  :key="member"
                  class="border border-gray-300 px-2 py-2 text-center font-semibold"
                >
                  {{ member }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(amalan, index) in DEFAULT_AMALAN"
                :key="amalan"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="border border-gray-300 px-3 py-2 text-gray-800 font-medium">
                  {{ amalan }}
                </td>
                <td class="border border-gray-300 px-2 py-2 text-center text-xs bg-yellow-50 text-gray-700 font-medium">
                  {{ amalanTargets[amalan] || '-' }}
                </td>
                <td 
                  v-for="member in MEMBERS" 
                  :key="member"
                  class="border border-gray-300 px-2 py-2 text-center font-semibold" 
                  :class="getValueColorClass(getAmalanValue(amalan, member))"
                >
                  {{ getAmalanValue(amalan, member) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Info note -->
        <div class="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div class="text-xs text-amber-700">
            <strong>📋 Keterangan:</strong> Tabel ini menampilkan data yang sama dengan Excel export. 
            Warna hijau = ada progress, abu-abu = belum ada data.
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📤</span> Export Data
        </h3>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600 mb-4">
            Export laporan
          </div>
          
          <AppButton
            variant="primary"
            class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            :loading="isExporting"
            @click="exportToExcel"
          >
            <template #icon>
              <span class="text-lg">📊</span>
            </template>
            Export ke Excel (.xlsx)
          </AppButton>
        </div>
      </div>
      
      <!-- Top Performers -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Anggota Terkonsisten
          </h3>
          <div class="text-xs text-gray-500 text-right max-w-[180px]">
            Berdasarkan berapa jenis amalan yang rutin dilakukan
          </div>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(member, index) in topConsistentMembers"
            :key="member.name"
            class="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
          >
            <div :class="getRankClasses(index)" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {{ index + 1 }}
            </div>
            
            <div class="flex-1">
              <div class="font-bold text-gray-800">{{ member.name }}</div>
              <div class="text-sm text-gray-600">{{ member.activeTypes }}/{{ DEFAULT_AMALAN.length }} jenis amalan aktif</div>
              <div class="text-xs text-gray-500">Konsistensi: {{ member.consistency }}%</div>
            </div>
            
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
        
        <!-- Info Box -->
        <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="text-xs text-blue-700">
            <strong>💡 Cara Hitung:</strong> Dilihat dari berapa banyak jenis amalan yang dilakukan (bukan total angka). 
            Contoh: Yang melakukan 8 jenis amalan berbeda lebih konsisten daripada yang cuma fokus 3 jenis tapi total tinggi.
          </div>
        </div>
      </div>
      
      <!-- Member Details -->
      <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span> Detail per Anggota
          </h3>
          <div class="text-xs text-gray-500 text-right max-w-[150px]">
            Amalan terrutin = yang paling sering dilakukan
          </div>
        </div>
        
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
                <div class="text-xl font-bold text-pink-600">{{ getMemberActiveTypes(member) }}/{{ DEFAULT_AMALAN.length }}</div>
                <div class="text-xs text-gray-500">jenis amalan</div>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="text-xs text-gray-600 font-medium">Amalan Terrutin:</div>
              <div class="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span class="text-gray-700">{{ getMemberTopRoutine(member).name }}</span>
                <span class="font-medium text-gray-600">{{ getMemberTopRoutine(member).frequency }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Info Box -->
        <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div class="text-xs text-green-700">
            <strong>💡 Penjelasan:</strong> "Amalan Terrutin" dihitung dari frekuensi relatif per jenis amalan. 
            Contoh: Shalat 25x lebih rutin daripada Istighfar 100x (karena target Shalat 35x vs Istighfar 700x per pekan).
          </div>
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
    <div v-if="isLoading || isExporting" class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 shadow-xl">
        <div class="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-soft mb-4">
          <span class="text-white text-xl">{{ isExporting ? '📊' : '📊' }}</span>
        </div>
        <div class="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-700 font-medium">{{ isExporting ? 'Membuat file Excel...' : 'Memuat laporan...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAmalanStore } from '@/stores/amalan'
import { useUiStore } from '@/stores/ui'
import { MEMBERS, DEFAULT_AMALAN, AMALAN_CONFIG } from '@/utils/constants'
import { getMonthName, getCurrentMonth, getCurrentYear } from '@/utils/date'
import AppButton from '@/components/ui/AppButton.vue'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'

const authStore = useAuthStore()
const amalanStore = useAmalanStore()
const uiStore = useUiStore()

// State
const selectedMonth = ref(getCurrentMonth())
const selectedYear = ref(getCurrentYear())
const isLoading = ref(false)
const isExporting = ref(false)

// 🎯 DYNAMIC TARGETS dari AMALAN_CONFIG
const amalanTargets = computed(() => {
  const targets = {}
  Object.entries(AMALAN_CONFIG).forEach(([amalan, config]) => {
    targets[amalan] = config.dailyText
  })
  return targets
})

const amalanWeeklyTargets = computed(() => {
  const targets = {}
  Object.entries(AMALAN_CONFIG).forEach(([amalan, config]) => {
    targets[amalan] = config.weeklyTarget
  })
  return targets
})

// Computed
const yearRange = computed(() => {
  const currentYear = getCurrentYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

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

const topConsistentMembers = computed(() => {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.amalan) {
    return []
  }
  
  const members = MEMBERS.map(member => {
    // Hitung berapa jenis amalan yang aktif (> 0)
    let activeTypes = 0
    let totalAmalan = 0
    
    Object.entries(reportData.amalan).forEach(([amalanName, amalanData]) => {
      const memberValue = amalanData[member] || 0
      if (memberValue > 0) {
        activeTypes++
      }
      totalAmalan += memberValue
    })
    
    // Consistency percentage berdasarkan variety of amalan
    const consistency = Math.round((activeTypes / DEFAULT_AMALAN.length) * 100)
    
    return {
      name: member,
      activeTypes: activeTypes,
      totalAmalan: totalAmalan,
      consistency: consistency
    }
  })
  
  // Sort berdasarkan active types (consistency), bukan total amalan
  members.sort((a, b) => {
    if (b.activeTypes === a.activeTypes) {
      // Jika sama, baru lihat consistency percentage
      return b.consistency - a.consistency
    }
    return b.activeTypes - a.activeTypes
  })
  
  // Calculate percentage berdasarkan TOTAL AMALAN, bukan activeTypes tertinggi
  const totalAmalanTypes = DEFAULT_AMALAN.length
  
  return members.map(member => ({
    ...member,
    percentage: Math.round((member.activeTypes / totalAmalanTypes) * 100)
  }))
})

async function exportToExcel() {
  try {
    isExporting.value = true
    console.log('🎨 Creating beautiful Excel with ExcelJS...')
    
    const ExcelJS = (await import('exceljs')).default
    
    const reportData = amalanStore.monthlyReportData
    let amalanData = {}
    let useRealData = false
    
    // Check for real data
    if (reportData && reportData.amalan && Object.keys(reportData.amalan).length > 0) {
      console.log('✅ Using real data')
      amalanData = reportData.amalan
      useRealData = true
    } else {
      console.log('⚠️ Using sample data')
      DEFAULT_AMALAN.forEach(amalan => {
        const sampleData = {}
        MEMBERS.forEach(member => {
          const config = AMALAN_CONFIG[amalan]
          if (config) {
            const weekly = config.weeklyTarget
            if (weekly >= 100) {
              sampleData[member] = Math.floor(Math.random() * 200) + 50
            } else if (weekly >= 10) {
              sampleData[member] = Math.floor(Math.random() * weekly) + 5
            } else {
              sampleData[member] = Math.floor(Math.random() * weekly) + 1
            }
          } else {
            sampleData[member] = Math.floor(Math.random() * 10) + 1
          }
        })
        
        amalanData[amalan] = {
          ...sampleData,
          total: Object.values(sampleData).reduce((sum, val) => sum + val, 0)
        }
      })
    }
    
    const monthName = getMonthName(selectedMonth.value)
    
    // 🎨 CREATE BEAUTIFUL WORKBOOK dengan ExcelJS
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`📊 Laporan ${monthName}`, {
      properties: { 
        tabColor: { argb: 'FF4F46E5' }
      }
    })
    
    // 🎨 STYLING DEFINITIONS
    const headerStyle = {
      font: { 
        name: 'Calibri', 
        size: 16, 
        bold: true, 
        color: { argb: 'FFFFFFFF' } 
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' }
      },
      alignment: { 
        horizontal: 'center', 
        vertical: 'middle' 
      },
      border: {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      }
    }
    
    const subHeaderStyle = {
      font: { 
        name: 'Calibri', 
        size: 12, 
        bold: true, 
        color: { argb: 'FFFFFFFF' } 
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF7C3AED' }
      },
      alignment: { 
        horizontal: 'center', 
        vertical: 'middle' 
      }
    }
    
    const tableHeaderStyle = {
      font: { 
        name: 'Calibri', 
        size: 11, 
        bold: true, 
        color: { argb: 'FFFFFFFF' } 
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10B981' }
      },
      alignment: { 
        horizontal: 'center', 
        vertical: 'middle' 
      },
      border: {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      }
    }
    
    const totalCols = 2 + MEMBERS.length + 1  // Nama + Target + Members + Total
    const lastCol = String.fromCharCode(64 + totalCols)

    // 📍 HEADER SECTION
    worksheet.mergeCells(`A1:${lastCol}1`)
    worksheet.getCell('A1').value = '📊 LAPORAN AMALAN HARIAN'
    worksheet.getCell('A1').style = headerStyle
    worksheet.getRow(1).height = 30
    
    worksheet.mergeCells(`A2:${lastCol}2`)
    worksheet.getCell('A2').value = `📅 Periode: ${monthName} ${selectedYear.value}`
    worksheet.getCell('A2').style = subHeaderStyle
    worksheet.getRow(2).height = 25
    
    worksheet.mergeCells(`A3:${lastCol}3`)
    worksheet.getCell('A3').value = `📄 Tanggal Export: ${new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })}`
    worksheet.getCell('A3').style = {
      font: { 
        name: 'Calibri', 
        size: 10, 
        italic: true, 
        color: { argb: 'FF6B7280' } 
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' }
      },
      alignment: { 
        horizontal: 'center', 
        vertical: 'middle' 
      }
    }
    worksheet.getRow(3).height = 20
    
    // Empty rows
    worksheet.getRow(4).height = 10
    worksheet.getRow(5).height = 10
    
    // 🏆 TABLE HEADER - Row 6
    const headers = ['📋 NAMA AMALAN', '🎯 TARGET', ...MEMBERS.map(m => `🧕 ${m}`), '📊 TOTAL']
    const headerColors = ['FF10B981', 'FFF59E0B', ...MEMBERS.map(() => 'FF3B82F6'), 'FFEF4444']
    
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(6, index + 1)
      cell.value = header
      cell.style = {
        ...tableHeaderStyle,
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: headerColors[index] }
        }
      }
    })
    worksheet.getRow(6).height = 25
    
    // 📊 DATA ROWS - Starting from row 7
    let currentRow = 7
    DEFAULT_AMALAN.forEach((amalan, index) => {
      const data = amalanData[amalan] || {}
      const target = amalanTargets.value[amalan] || '-'
      const memberValues = MEMBERS.map(member => data[member] || 0)
      const total = memberValues.reduce((sum, val) => sum + val, 0)
      
      const row = worksheet.getRow(currentRow)
      
      // Set values
      row.getCell(1).value = amalan
      row.getCell(2).value = target
      MEMBERS.forEach((member, index) => {
        row.getCell(3 + index).value = data[member] || 0
      })
      row.getCell(3 + MEMBERS.length).value = total
      
      // Styling per cell
      const isEven = index % 2 === 0
      const bgColor = isEven ? 'FFF8FAFC' : 'FFFFFFFF'
      
      // Nama Amalan
      row.getCell(1).style = {
        font: { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1F2937' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        }
      }
      
      // Target
      row.getCell(2).style = {
        font: { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF92400E' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        }
      }
      
      // Member data
      for (let col = 3; col <= 2 + MEMBERS.length; col++) {
        const value = row.getCell(col).value
        const fontColor = value > 0 ? 'FF059669' : 'FF6B7280'
        const cellBg = value > 0 ? 'FFECFDF5' : bgColor
        
        row.getCell(col).style = {
          font: { name: 'Calibri', size: 10, bold: true, color: { argb: fontColor } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: cellBg } },
          alignment: { horizontal: 'center', vertical: 'middle' },
          border: {
            top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
          }
        }
      }
      
      // Total
      row.getCell(3 + MEMBERS.length).style = {
        font: { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        }
      }
      
      row.height = 20
      currentRow++
    })
    
    // 📈 SUMMARY SECTION
    currentRow += 2
    
    worksheet.getCell(currentRow, 1).value = '📈 RINGKASAN LAPORAN'
    worksheet.getCell(currentRow, 1).style = {
      font: { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } },
      alignment: { horizontal: 'left', vertical: 'middle' }
    }
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`)
    worksheet.getRow(currentRow).height = 25
    
    currentRow += 2
    
    // Calculate totals per member
    const memberTotals = {}
    MEMBERS.forEach(member => {
      let total = 0
      Object.entries(amalanData).forEach(([amalanName, amalanMemberData]) => {
        total += amalanMemberData[member] || 0
      })
      memberTotals[member] = total
    })
    
    // Add member summary with beautiful styling
    worksheet.getCell(currentRow, 1).value = '👥 TOTAL PER ANGGOTA:'
    worksheet.getCell(currentRow, 1).style = {
      font: { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF1F2937' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } }
    }
    currentRow++
    
    Object.entries(memberTotals).forEach(([member, total]) => {
      worksheet.getCell(currentRow, 1).value = `${member}:`
      worksheet.getCell(currentRow, 2).value = `${total} amalan`
      
      worksheet.getCell(currentRow, 1).style = {
        font: { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF3B82F6' } }
      }
      worksheet.getCell(currentRow, 2).style = {
        font: { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF10B981' } }
      }
      currentRow++
    })
    
    currentRow += 2
    
    // 📋 NOTES SECTION  
    worksheet.getCell(currentRow, 1).value = '📋 CATATAN:'
    worksheet.getCell(currentRow, 1).style = {
      font: { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } }
    }
    currentRow++
    
    const notes = [
      useRealData ? '✅ Data real dari database' : '⚠️ Data sample untuk testing',
      '📋 Target menunjukkan frekuensi ideal per amalan',
      `🎯 Total = ${MEMBERS.join(' + ')}`,
      '💡 Hijau = ada progress, Abu-abu = belum ada data'
    ]
    
    notes.forEach(note => {
      worksheet.getCell(currentRow, 1).value = note
      worksheet.getCell(currentRow, 1).style = {
        font: { name: 'Calibri', size: 10, color: { argb: 'FF374151' } }
      }
      currentRow++
    })
    
    // 📐 SET COLUMN WIDTHS
    worksheet.getColumn(1).width = 40 // Nama Amalan
    worksheet.getColumn(2).width = 15 // Target
    MEMBERS.forEach((member, index) => {
      worksheet.getColumn(3 + index).width = 10 // Member columns
    })
    worksheet.getColumn(3 + MEMBERS.length).width = 12 // TOTAL
    
    // 💾 DOWNLOAD FILE
    const fileName = `📊 Laporan_Amalan_${monthName}_${selectedYear.value}.xlsx`
    
    // Create buffer and download
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
    
    console.log('✨ Beautiful ExcelJS export completed successfully')
    uiStore.showToast('✨ Berhasil export Excel!', 'success')
    
  } catch (error) {
    console.error('❌ ExcelJS export error:', error)
    
    let errorMessage = 'Gagal export ke Excel'
    if (error.message && error.message.includes('ExcelJS')) {
      errorMessage = 'Library ExcelJS belum terinstall. Jalankan: npm install exceljs'
    }
    
    uiStore.showToast(errorMessage, 'error')
    
  } finally {
    isExporting.value = false
  }
}

// Other methods
async function loadReportData() {
  try {
    isLoading.value = true
    console.log('📊 Loading report data for:', selectedMonth.value, selectedYear.value)
    
    await amalanStore.loadMonthlyReport(selectedMonth.value, selectedYear.value)
    
    uiStore.showToast('Laporan berhasil dimuat', 'success')
  } catch (error) {
    console.error('❌ Failed to load report:', error)
    uiStore.showToast('Gagal memuat data laporan', 'error')
  } finally {
    isLoading.value = false
  }
}

function getMemberActiveTypes(member) {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.amalan) {
    return 0
  }
  
  let activeTypes = 0
  Object.entries(reportData.amalan).forEach(([amalanName, amalanData]) => {
    const memberValue = amalanData[member] || 0
    if (memberValue > 0) {
      activeTypes++
    }
  })
  
  return activeTypes
}

function getMemberTopRoutine(member) {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.amalan) {
    return { name: 'Belum ada data', frequency: '0%' }
  }
  
  let topAmalan = 'Belum ada data'
  let maxPercentage = 0
  
  Object.entries(reportData.amalan).forEach(([amalanName, amalanData]) => {
    const memberValue = amalanData[member] || 0
    const weeklyTarget = amalanWeeklyTargets.value[amalanName] || 1
    
    // Hitung percentage achievement relative to target
    const percentage = (memberValue / weeklyTarget) * 100
    
    if (percentage > maxPercentage && memberValue > 0) {
      maxPercentage = percentage
      topAmalan = amalanName
    }
  })
  
  const displayPercentage = maxPercentage > 0 ? `${Math.round(maxPercentage)}%` : '0%'
  
  return {
    name: topAmalan,
    frequency: displayPercentage
  }
}

function getAmalanValue(amalanName, memberName) {
  const reportData = amalanStore.monthlyReportData
  
  if (!reportData || !reportData.amalan || !reportData.amalan[amalanName]) {
    return 0
  }
  
  return reportData.amalan[amalanName][memberName] || 0
}

function getValueColorClass(value) {
  if (value > 0) {
    return 'text-green-600 bg-green-50'
  }
  return 'text-gray-400 bg-gray-50'
}

function getRankClasses(index) {
  const classes = [
    'bg-gradient-to-r from-yellow-400 to-orange-500',
    'bg-gradient-to-r from-gray-400 to-gray-500',
    'bg-gradient-to-r from-orange-400 to-orange-500',
    'bg-gradient-to-r from-blue-400 to-blue-500'
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

onMounted(async () => {
  await loadReportData()
})
</script> 

<style scoped>
/* Fix table borders untuk dynamic columns */
table {
  border-collapse: collapse !important;
}

table td,
table th {
  border: 1px solid #d1d5db !important;
}

/* Pastikan text alignment tetap center untuk member columns */
table td:nth-child(n+3):nth-last-child(n+2) {
  text-align: center !important;
}
</style>