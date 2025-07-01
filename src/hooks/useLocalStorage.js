import { useState, useEffect } from 'react'
import { formatMonth } from '../utils/日期工具'

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
    setData(newData)
    const key = current.taskId
      ? `${current.taskId}-${formatMonth(current.year, current.month)}`
      : formatMonth(current.year, current.month)
    localStorage.setItem(key, JSON.stringify(newData))
  }

  return [data, save]
} 