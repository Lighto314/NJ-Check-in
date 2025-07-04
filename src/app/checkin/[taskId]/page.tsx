// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Calendar from '../../../components/月历'
import TaskList from '../../../components/任务列表'
import 礼炮动画 from '../../../components/礼炮动画'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { getMonthDays, formatDate, getToday } from '../../../utils/日期工具'
import { useLanguage } from '../../../hooks/useLanguage'

const LANGS = {
  zh: {
    prev: '上月',
    next: '下月',
    reset: '重置',
    confirmReset: '确定要重置本月所有签到吗？',
    checkin: '签到',
    cancel: '取消',
    date: '日期：',
  },
  en: {
    prev: 'Prev',
    next: 'Next',
    reset: 'Reset',
    confirmReset: 'Are you sure to reset all check-ins this month?',
    checkin: 'Check In',
    cancel: 'Cancel',
    date: 'Date: ',
  }
}

export default function CheckinPage() {
  const { taskId } = useParams()
  const { lang, changeLang, t } = useLanguage()
  // 当前显示的年月
  const [current, setCurrent] = useState(() => {
    const today = getToday()
    return { year: today.getFullYear(), month: today.getMonth() + 1 }
  })
  // 选中的日期
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  // 本月数据（按 taskId 区分）
  const [data, setData] = useLocalStorage({ ...current, taskId }, setCurrent)
  // 签到弹窗
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [checkinDate, setCheckinDate] = useState<string | null>(null)
  const [taskName, setTaskName] = useState('')
  // 礼炮动画状态
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('checkin-tasks')
        if (saved) {
          const arr = JSON.parse(saved)
          const found = arr.find(t => String(t.id) === String(taskId))
          if (found) setTaskName(found.name)
        }
      } catch {}
    }
  }, [taskId])

  // 移除旧的语言切换逻辑，使用 useLanguage hook

  // 计算连续签到天数
  const calcStreak = () => {
    const checkins = data?.checkins || []
    let streak = 0
    let d = new Date()
    d.setHours(0,0,0,0)
    while (checkins.includes(formatDate(d))) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  // 切换月份
  const changeMonth = (offset: number) => {
    let { year, month } = current
    month += offset
    if (month < 1) { month = 12; year-- }
    if (month > 12) { month = 1; year++ }
    setCurrent({ ...current, year, month })
  }

  // 判断某日期是否为今天
  const isTodayDate = (dateStr: string) => {
    const today = getToday()
    const todayStr = formatDate(today)
    return dateStr === todayStr
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 px-2 py-4">
      {/* 语言切换按钮 */}
      <div className="fixed top-4 left-4 z-20 flex gap-2">
        <button 
          className={`px-3 py-1 rounded text-sm ${lang === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => changeLang('zh')}
        >
          中文
        </button>
        <button 
          className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => changeLang('en')}
        >
          EN
        </button>
      </div>
      
      <div className="w-full max-w-lg">
        {/* 顶部月份切换和重置按钮 */}
        <div className="grid grid-cols-3 items-center py-3 sm:py-4 w-full">
          <div className="flex justify-end">
            <button 
              className="text-white text-base sm:text-lg px-2 sm:px-3 py-2 sm:py-1.5" 
              onClick={() => changeMonth(-1)}
              style={{minHeight: '36px', minWidth: '50px'}}
            >{t.prev}</button>
          </div>
          <div className="flex justify-center">
            <span className="text-base sm:text-xl font-bold text-white text-center">{current.year}年{current.month}月</span>
          </div>
          <div className="flex justify-start gap-1 sm:gap-2">
            <button 
              className="text-white text-base sm:text-lg px-2 sm:px-3 py-2 sm:py-1.5" 
              onClick={() => changeMonth(1)}
              style={{minHeight: '36px', minWidth: '50px'}}
            >{t.next}</button>
            <button
              className="bg-red-600 text-white px-2 sm:px-4 py-2 sm:py-1.5 rounded text-sm sm:text-base hover:bg-red-700 ml-1 sm:ml-2"
              onClick={() => {
                if (window.confirm(t.confirmReset)) {
                  setData({ ...data, checkins: [], checkinCounts: {} })
                }
              }}
              style={{minHeight: '36px', minWidth: '60px'}}
            >{t.reset}</button>
          </div>
        </div>
        {/* 任务名展示 */}
        <div className="w-full flex justify-center mb-4 sm:mb-6">
          <span className="font-lobster text-2xl sm:text-3xl md:text-4xl text-white text-center leading-tight">{taskName}</span>
        </div>
        {/* 月历视图 */}
        <div className="w-full flex justify-center">
          <Calendar
            year={current.year}
            month={current.month}
            checkins={Array.isArray(data?.checkins) ? data.checkins : []}
            checkinCounts={data.checkinCounts || {}}
            taskId={taskId}
            lang={lang}
            onSelectDate={(date: string) => {
              // 只允许今天弹出任务详情弹窗
              if (isTodayDate(date)) {
                setSelectedDate(date)
              }
            }}
            onLongPressDate={(dateStr: string) => {
              // 只允许今天弹出签到弹窗
              if (isTodayDate(dateStr)) {
                setCheckinDate(dateStr)
                setShowCheckinModal(true)
              }
            }}
          />
        </div>
      </div>
      {/* 签到弹窗 */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-[280px] flex flex-col items-center">
            <div className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-black">{t.checkin}</div>
            <div className="mb-3 sm:mb-4 text-base sm:text-lg text-black text-center">{t.date}{checkinDate}</div>
            <button
              className="bg-gray-900 text-white px-4 sm:px-6 py-2 rounded mb-2 sm:mb-3 text-base sm:text-lg w-full"
              onClick={() => {
                // 再次校验，只允许今天签到
                if (!isTodayDate(checkinDate)) {
                  alert(t('onlyToday'))
                  return
                }
                // 记录签到
                let newCheckins = data.checkins
                if (!newCheckins.includes(checkinDate)) {
                  newCheckins = [...newCheckins, checkinDate]
                }
                // 记录签到次数
                const newCounts = { ...(data.checkinCounts || {}) }
                newCounts[checkinDate] = (newCounts[checkinDate] || 0) + 1
                setData({ ...data, checkins: newCheckins, checkinCounts: newCounts })
                setShowCheckinModal(false)
                // 触发礼炮动画
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 1000)
              }}
            >{t.checkin}</button>
            <button className="text-black text-sm sm:text-base" onClick={() => setShowCheckinModal(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
      {/* 任务列表弹窗 */}
      {typeof selectedDate === 'string' && selectedDate.length > 0 && (
        <TaskList
          date={selectedDate}
          data={data}
          setData={setData}
          onClose={() => setSelectedDate(null)}
        />
      )}
      {/* 礼炮动画 */}
      <礼炮动画 isVisible={showConfetti} />
    </main>
  )
} 