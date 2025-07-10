// 📄 src/composables/useApi.js
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { api } from '@/utils/api'

export function useApi() {
  const uiStore = useUiStore()
  const loading = ref(false)
  const error = ref(null)
  
  async function execute(apiCall) {
    try {
      loading.value = true
      error.value = null
      const result = await apiCall()
      return result
    } catch (err) {
      error.value = err.message
      uiStore.showToast(err.message, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function authenticate(username, password) {
    return execute(() => api.authenticate(username, password))
  }
  
  async function getDashboardStats(week, month, year) {
    return execute(() => api.getDashboardStats(week, month, year))
  }
  
  async function getWeeklyData(member, week, month, year) {
    return execute(() => api.getWeeklyData(member, week, month, year))
  }
  
  async function updateAmalan(member, amalanName, jumlah, week, month, year) {
    return execute(() => api.updateAmalan(member, amalanName, jumlah, week, month, year))
  }
  
  async function syncData() {
    return execute(() => api.syncData())
  }
  
  return {
    loading,
    error,
    authenticate,
    getDashboardStats,
    getWeeklyData,
    updateAmalan,
    syncData
  }
}