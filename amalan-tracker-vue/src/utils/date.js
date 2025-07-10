// 📄 src/utils/date.js
export function getCurrentWeek() {
  const now = new Date()
  const dayOfMonth = now.getDate()
  return Math.ceil(dayOfMonth / 7)
}

export function getCurrentMonth() {
  return new Date().getMonth() + 1
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function getMonthName(month) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[month - 1] || ''
}

export function getWeekRange(weekNumber, month, year) {
  const startDate = ((weekNumber - 1) * 7) + 1
  const endDate = Math.min(weekNumber * 7, new Date(year, month, 0).getDate())
  return { startDate, endDate }
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = getMonthName(date.getMonth() + 1)
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}