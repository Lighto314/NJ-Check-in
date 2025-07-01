import { useState, useEffect } from 'react'
import { formatMonth, formatDate, getToday } from '../utils/日期工具'

// useLocalStorage 钩子：管理本地签到和任务数据
export default function useLocalStorage(current, setCurrent) {
  const [data, setData] = useState({ checkins: [], tasks: {} })

  // 读取本地数据
  useEffect(() => {
    const key = current.taskId
      ? `${current.taskId}-${formatMonth(current.year, current.month)}`
      : formatMonth(current.year, current.month)
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch {
        setData({ checkins: [], tasks: {} })
      }
    } else {
      setData({ checkins: [], tasks: {} })
    }
  }, [current])

  // 保存数据到本地
  const save = (newData) => {
    // 只允许今天的日期写入 checkins
    const todayStr = formatDate(getToday())
    let filteredData = { ...newData }
    if (Array.isArray(filteredData.checkins)) {
      filteredData.checkins = filteredData.checkins.filter(date => date === todayStr)
    }
    if (filteredData.checkinCounts) {
      Object.keys(filteredData.checkinCounts).forEach(date => {
        if (date !== todayStr) {
          delete filteredData.checkinCounts[date]
        }
      })
    }
    setData(filteredData)
    const key = current.taskId
      ? `${current.taskId}-${formatMonth(current.year, current.month)}`
      : formatMonth(current.year, current.month)
    localStorage.setItem(key, JSON.stringify(filteredData))
  }

  return [data, save]
} 