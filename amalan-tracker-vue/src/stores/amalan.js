// 📄 src/stores/amalan.js - FIXED VERSION with Hari Halangan Support
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MEMBERS, DEFAULT_AMALAN, HARI_HALANGAN } from '@/utils/constants'  // ✅ IMPORT HARI_HALANGAN
import { getCurrentWeek, getCurrentMonth, getCurrentYear } from '@/utils/date'
import { api } from '@/utils/api'

export const useAmalanStore = defineStore('amalan', () => {
  // State
  const currentWeek = ref(getCurrentWeek())
  const currentMonth = ref(getCurrentMonth())
  const currentYear = ref(getCurrentYear())
  const dashboardData = ref({})
  const memberData = ref({})
  const monthlyReportData = ref({})
  const isLoading = ref(false)

  // Getters
  const weekRange = computed(() => {
    const startDate = ((currentWeek.value - 1) * 7) + 1
    const endDate = Math.min(currentWeek.value * 7, new Date(currentYear.value, currentMonth.value, 0).getDate())
    return { startDate, endDate }
  })

  const weeklyStats = computed(() => {
    if (!dashboardData.value || !dashboardData.value.stats) {
      return { total: 0, average: 0, topMember: '-' }
    }
    
    return {
      total: dashboardData.value.stats.totalAmalan || 0,
      average: Math.round(dashboardData.value.stats.avgAmalan || 0),
      topMember: dashboardData.value.stats.topMember || '-'
    }
  })

  // Actions
  async function loadDashboardData() {
    try {
      isLoading.value = true
      console.log('🔄 Loading dashboard data for:', { 
        week: currentWeek.value, 
        month: currentMonth.value, 
        year: currentYear.value 
      })
      
      const response = await api.getDashboardStats(
        currentWeek.value, 
        currentMonth.value, 
        currentYear.value
      )

      console.log('📊 Dashboard response:', response)

      if (response) {
        dashboardData.value = response
        console.log('✅ Dashboard data loaded successfully')
      } else {
        throw new Error('Empty response from getDashboardStats')
      }
    } catch (error) {
      console.error('💥 Dashboard data load error:', error)
      // Set fallback data structure
      dashboardData.value = {
        ...Object.fromEntries(MEMBERS.map(member => [member, { totalAmalan: 0, completedAmalan: 0, hariHalangan: 0 }])),
        stats: { totalAmalan: 0, avgAmalan: 0, topMember: '-' },
        recentActivity: []
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadMemberData(member) {
    try {
      isLoading.value = true
      console.log('👤 Loading member data for:', member)
      
      if (!MEMBERS.includes(member)) {
        throw new Error(`Invalid member: ${member}`)
      }
      
      const response = await api.getWeeklyData(
        member,
        currentWeek.value,
        currentMonth.value,
        currentYear.value
      )

      console.log('📋 Member response for', member, ':', response)

      if (response) {
        memberData.value[member] = response
        console.log('✅ Member data loaded for', member)
      } else {
        throw new Error(`Empty response for member ${member}`)
      }
    } catch (error) {
      console.error('💥 Member data load error for', member, ':', error)
      // Set fallback data
      memberData.value[member] = {
        member: member,
        week: currentWeek.value,
        month: currentMonth.value,
        year: currentYear.value,
        amalan: {},
        hariHalangan: 0,  // ✅ TAMBAH: Default hari halangan
        lastUpdate: null
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ✅ FIXED: Update validation untuk support Hari Halangan
  async function updateMemberAmalan(member, amalanName, jumlah) {
    try {
      console.log('💾 Updating amalan:', { member, amalanName, jumlah })
      
      // Validate member
      if (!MEMBERS.includes(member)) {
        throw new Error(`Invalid member: ${member}`)
      }
      
      // ✅ FIXED: Include Hari Halangan dalam validasi
      const validAmalanNames = [...DEFAULT_AMALAN, HARI_HALANGAN.FIELD_NAME]
      if (!validAmalanNames.includes(amalanName)) {
        console.error('❌ Invalid amalan name:', amalanName)
        console.error('Valid amalan names:', validAmalanNames)
        throw new Error(`Invalid amalan: ${amalanName}`)
      }
      
      const numericValue = parseInt(jumlah) || 0
      
      // ✅ ADDED: Special validation untuk Hari Halangan
      if (amalanName === HARI_HALANGAN.FIELD_NAME) {
        if (numericValue < 0 || numericValue > HARI_HALANGAN.MAX_DAYS) {
          throw new Error(`Hari Halangan harus antara 0-${HARI_HALANGAN.MAX_DAYS} hari`)
        }
      } else {
        // Normal amalan validation
        if (numericValue < 0) {
          throw new Error('Jumlah amalan tidak boleh negatif')
        }
      }
      
      const response = await api.updateAmalan(
        member,
        amalanName,
        numericValue,
        currentWeek.value,
        currentMonth.value,
        currentYear.value
      )

      console.log('💾 Update response:', response)

      if (response) {
        // Update local member data
        if (!memberData.value[member]) {
          memberData.value[member] = { amalan: {}, hariHalangan: 0 }
        }
        
        // ✅ UPDATED: Handle hari halangan terpisah
        if (amalanName === HARI_HALANGAN.FIELD_NAME) {
          memberData.value[member].hariHalangan = numericValue
        } else {
          if (!memberData.value[member].amalan) {
            memberData.value[member].amalan = {}
          }
          memberData.value[member].amalan[amalanName] = numericValue
        }
        
        memberData.value[member].lastUpdate = new Date().toISOString()

        // Refresh dashboard data untuk update stats
        await loadDashboardData()
        
        console.log('✅ Amalan updated successfully')
      } else {
        throw new Error('Empty response from updateAmalan')
      }
    } catch (error) {
      console.error('💥 Update amalan error:', error)
      throw error
    }
  }

  async function loadMonthlyReport(month, year) {
    try {
      isLoading.value = true
      console.log('📊 Loading monthly report for:', { month, year })
      
      const response = await api.getMonthlyReport(
        month || currentMonth.value,
        year || currentYear.value
      )

      console.log('📈 Monthly report response:', response)

      if (response) {
        monthlyReportData.value = response
        console.log('✅ Monthly report loaded successfully')
        return response
      } else {
        throw new Error('Empty response from getMonthlyReport')
      }
    } catch (error) {
      console.error('💥 Monthly report load error:', error)
      // Set fallback data
      monthlyReportData.value = {
        month: month || currentMonth.value,
        year: year || currentYear.value,
        summary: { totalAmalan: 0, mostActive: '-', avgPerMember: 0 },
        members: Object.fromEntries(MEMBERS.map(member => [member, { totalAmalan: 0, topAmalan: '-', consistency: 0 }])),
        amalan: Object.fromEntries(DEFAULT_AMALAN.map(amalan => [amalan, { total: 0, ...Object.fromEntries(MEMBERS.map(member => [member, 0])) }])),
        weekly: {}
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentWeek(week) {
    if (week >= 1 && week <= 4) {
      currentWeek.value = week
      console.log('📅 Week changed to:', week)
    } else {
      console.warn('Invalid week:', week)
    }
  }

  function changeWeek(direction) {
    let newWeek = currentWeek.value + direction
    let newMonth = currentMonth.value
    let newYear = currentYear.value

    if (newWeek < 1) {
      newWeek = 4
      newMonth--
      if (newMonth < 1) {
        newMonth = 12
        newYear--
      }
    } else if (newWeek > 4) {
      newWeek = 1
      newMonth++
      if (newMonth > 12) {
        newMonth = 1
        newYear++
      }
    }

    currentWeek.value = newWeek
    currentMonth.value = newMonth
    currentYear.value = newYear
    
    console.log('📅 Week navigation to:', { week: newWeek, month: newMonth, year: newYear })
  }

  async function syncData() {
    try {
      console.log('🔄 Starting data sync...')
      
      // Clear local data
      dashboardData.value = {}
      memberData.value = {}
      
      // Call API sync
      const syncResult = await api.syncData()
      
      if (syncResult.success) {
        // Reload current data
        await loadDashboardData()
        console.log('✅ Data sync completed successfully')
        return { success: true, message: 'Data berhasil disinkronisasi' }
      } else {
        throw new Error(syncResult.error || 'Sync failed')
      }
    } catch (error) {
      console.error('💥 Sync error:', error)
      throw error
    }
  }

  // ✅ NEW: Helper methods untuk validation
  function isValidAmalanName(amalanName) {
    const validAmalanNames = [...DEFAULT_AMALAN, HARI_HALANGAN.FIELD_NAME]
    return validAmalanNames.includes(amalanName)
  }

  function getValidAmalanNames() {
    return [...DEFAULT_AMALAN, HARI_HALANGAN.FIELD_NAME]
  }

  // Debug function
  function debugState() {
    console.log('🐛 Amalan Store Debug:')
    console.log('Current Period:', { 
      week: currentWeek.value, 
      month: currentMonth.value, 
      year: currentYear.value 
    })
    console.log('Dashboard Data:', dashboardData.value)
    console.log('Member Data:', memberData.value)
    console.log('Monthly Report:', monthlyReportData.value)
    console.log('Is Loading:', isLoading.value)
    console.log('Weekly Stats:', weeklyStats.value)
    console.log('Valid Amalan Names:', getValidAmalanNames())  // ✅ ADDED
  }

  return {
    // State
    currentWeek,
    currentMonth,
    currentYear,
    dashboardData,
    memberData,
    monthlyReportData,
    isLoading,
    
    // Getters
    weekRange,
    weeklyStats,
    
    // Actions
    loadDashboardData,
    loadMemberData,
    updateMemberAmalan,
    loadMonthlyReport,
    setCurrentWeek,
    changeWeek,
    syncData,
    debugState,
    isValidAmalanName,  // ✅ NEW helper
    getValidAmalanNames  // ✅ NEW helper
  }
})