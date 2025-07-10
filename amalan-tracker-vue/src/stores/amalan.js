// 📄 src/stores/amalan.js - FIXED VERSION (Backward Compatible)
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MEMBERS, DEFAULT_AMALAN } from '@/utils/constants'
import { getCurrentWeek, getCurrentMonth, getCurrentYear } from '@/utils/date'
import { api } from '@/utils/api' // Import API langsung

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
      
      // 🔧 FIX: Gunakan signature asli (individual parameters)
      const response = await api.getDashboardStats(
        currentWeek.value, 
        currentMonth.value, 
        currentYear.value
      )

      console.log('📊 Dashboard response:', response)

      if (response) {
        // Map response data structure dari GAS
        dashboardData.value = response
        console.log('✅ Dashboard data loaded successfully')
      } else {
        throw new Error('Empty response from getDashboardStats')
      }
    } catch (error) {
      console.error('💥 Dashboard data load error:', error)
      // Set fallback data structure
      dashboardData.value = {
        ...Object.fromEntries(MEMBERS.map(member => [member, { totalAmalan: 0, completedAmalan: 0 }])),
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
      
      // 🔧 VALIDATION: Pastikan member valid
      if (!MEMBERS.includes(member)) {
        throw new Error(`Invalid member: ${member}`)
      }
      
      // 🔧 FIX: Gunakan signature asli (individual parameters)
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
        lastUpdate: null
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateMemberAmalan(member, amalanName, jumlah) {
    try {
      console.log('💾 Updating amalan:', { member, amalanName, jumlah })
      
      // 🔧 VALIDATION: Pastikan parameter valid
      if (!MEMBERS.includes(member)) {
        throw new Error(`Invalid member: ${member}`)
      }
      
      if (!DEFAULT_AMALAN.includes(amalanName)) {
        throw new Error(`Invalid amalan: ${amalanName}`)
      }
      
      const numericValue = parseInt(jumlah) || 0
      if (numericValue < 0) {
        throw new Error('Jumlah amalan tidak boleh negatif')
      }
      
      // 🔧 FIX: Gunakan signature asli (individual parameters)
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
          memberData.value[member] = { amalan: {} }
        }
        if (!memberData.value[member].amalan) {
          memberData.value[member].amalan = {}
        }
        memberData.value[member].amalan[amalanName] = numericValue
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
      
      // 🔧 FIX: Gunakan signature asli (individual parameters)
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

  // 🆕 NEW: Sync method
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
    debugState
  }
})