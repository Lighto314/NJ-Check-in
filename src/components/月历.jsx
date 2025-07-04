import React, { useRef } from 'react'
import { getMonthDays, formatDate, isToday } from '../utils/日期工具'

/**
 * 月历组件
 * @param {Object} props
 * @param {number} props.year 年份
 * @param {number} props.month 月份
 * @param {string[]} props.checkins 已签到日期（yyyy-MM-dd）
 * @param {(date: string) => void} props.onSelectDate 选择日期回调
 * @param {(date: string) => void=} props.onLongPressDate 长按日期回调（可选）
 * @param {Object} props.checkinCounts 签到次数
 * @param {string} props.taskId 任务ID
 * @param {string} props.lang 语言
 */
export default function Calendar({ year, month, checkins, onSelectDate, onLongPressDate, checkinCounts = {}, taskId, lang = 'zh' }) {
  const days = getMonthDays(year, month)
  // 计算本月第一天是星期几
  const firstDay = new Date(year, month - 1, 1).getDay()

  // 长按处理
  const longPressTimeout = useRef()
  const handleMouseDown = (dateStr) => {
    longPressTimeout.current = setTimeout(() => {
      if (onLongPressDate) onLongPressDate(dateStr)
    }, 500)
  }
  const handleMouseUp = () => {
    clearTimeout(longPressTimeout.current)
  }
  const handleMouseLeave = () => {
    clearTimeout(longPressTimeout.current)
  }
  
  // 移动端触摸处理
  const handleTouchStart = (dateStr) => {
    longPressTimeout.current = setTimeout(() => {
      if (onLongPressDate) onLongPressDate(dateStr)
    }, 500)
  }
  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current)
  }

  // 签到 emoji 列表
  const EMOJIS = [
    '🐺', '🌞', '🌪️', '🐊', '🪐', '🧿', '🫡', '🫠', '👹', '👾',
    '👽', '🫀', '💋', '🦧', '🐲', '🌊', '🍣', '🗿', '🗽', '🗼',
    '🌋', '⛩️', '🪬', '🧸'
  ]
  // 简单hash函数：将字符串转为数字
  function hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000000007
    }
    return hash
  }
  // 洗牌算法，taskId 作为种子
  function shuffle(arr, seed) {
    const a = arr.slice()
    let h = hashString(seed || '')
    for (let i = a.length - 1; i > 0; i--) {
      h = (h * 31 + i) % 1000000007
      const j = h % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  // 获取当前任务专属的 emoji 顺序
  const taskEmojis = shuffle(EMOJIS, taskId || '')

  // 星期标题
  const WEEKDAYS = lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['日','一','二','三','四','五','六']

  // 渲染日历格子
  const renderDays = () => {
    const cells = []
    // 补齐前导空格
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={'empty-' + i} />)
    }
    // 渲染每一天
    for (let d of days) {
      const dateStr = formatDate(new Date(year, month - 1, d))
      const checked = checkins.includes(dateStr)
      const isTodayDate = isToday(year, month, d)
      cells.push(
        <button
          key={dateStr}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex flex-col items-center justify-center rounded-full mb-1 text-white
            ${checked ? '' : isTodayDate ? 'border-2 border-primary' : 'opacity-50 cursor-not-allowed'}
            `}
          onClick={isTodayDate ? (() => onLongPressDate && onLongPressDate(dateStr)) : undefined}
          onMouseDown={isTodayDate ? (() => handleMouseDown(dateStr)) : undefined}
          onMouseUp={isTodayDate ? handleMouseUp : undefined}
          onMouseLeave={isTodayDate ? handleMouseLeave : undefined}
          onTouchStart={isTodayDate ? (() => handleTouchStart(dateStr)) : undefined}
          onTouchEnd={isTodayDate ? handleTouchEnd : undefined}
          style={{minHeight: '32px', minWidth: '32px'}}
          disabled={!isTodayDate}
        >
          {checked
            ? (
                <span style={{fontSize: '24px', display: 'inline-block', lineHeight: 1}} className="sm:text-3xl">
                  {taskEmojis[(hashString(dateStr) + (checkinCounts[dateStr] || 1) - 1) % taskEmojis.length]}
                </span>
              )
            : <span className="text-sm sm:text-base">{d}</span>}
        </button>
      )
    }
    return cells
  }

  return (
    <div className="grid grid-cols-7 gap-1 rounded-lg p-2 shadow w-full max-w-sm">
      {/* 星期标题 */}
      {WEEKDAYS.map(w => (
        <div key={w} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-center text-xs text-white leading-none">{w}</div>
      ))}
      {renderDays()}
    </div>
  )
} 