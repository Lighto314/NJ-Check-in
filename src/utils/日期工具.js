import { format, getDaysInMonth } from 'date-fns'

// 获取某年某月的所有天数数组
export function getMonthDays(year, month) {
  const days = getDaysInMonth(new Date(year, month - 1))
  return Array.from({ length: days }, (_, i) => i + 1)
}

// 格式化日期 yyyy-MM-dd
export function formatDate(date) {
  if (typeof date === 'string') return date
  return format(date, 'yyyy-MM-dd')
}

// 格式化月份 yyyy-MM
export function formatMonth(year, month) {
  return `${year}-${month.toString().padStart(2, '0')}`
}

// 判断是否为今天
export function isToday(year, month, day) {
  const now = new Date()
  return now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day
}

// 获取今天日期对象
export function getToday() {
  const now = new Date()
  now.setHours(0,0,0,0)
  return now
}

// 优先级选项
export const PRIORITY_OPTIONS = ['高', '中', '低']
// 优先级颜色
export const PRIORITY_COLORS = {
  '高': '#FF4040',
  '中': '#FF9800',
  '低': '#2196F3'
} 