// 📄 src/utils/validation.js
import { MEMBERS } from './constants'

export function isValidMember(memberName) {
  return MEMBERS.includes(memberName)
}

export function isValidWeek(week) {
  return week >= 1 && week <= 4
}

export function isValidMonth(month) {
  return month >= 1 && month <= 12
}

export function isValidYear(year) {
  const currentYear = new Date().getFullYear()
  return year >= 2020 && year <= currentYear + 10
}

export function isValidAmalanValue(value) {
  return !isNaN(value) && value >= 0 && value <= 9999
}