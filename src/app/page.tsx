// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TASKS_KEY = 'checkin-tasks'
const LANG_KEY = 'checkin-lang'
const LANGS = {
  zh: {
    headline: 'NJ の Check-in',
    task: '任务',
    addTask: '+ 添加任务',
    enter: '进入签到',
    inputTip: '请输入任务名称',
    delete: '❌',
  },
  en: {
    headline: 'NJ Check-in',
    task: 'Task',
    addTask: '+ Add Task',
    enter: 'Check In',
    inputTip: 'Please enter task name',
    delete: '❌',
  }
}

export default function HomePage() {
  // 初始化时从 localStorage 读取任务
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(TASKS_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return [
      { id: 1, name: '' },
      { id: 2, name: '' }
    ]
  })
  const router = useRouter()

  // 每次 tasks 变化时保存到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }
  }, [tasks])

  // 语言切换
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANG_KEY) || 'zh'
    }
    return 'zh'
  })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_KEY, lang)
    }
  }, [lang])
  const t = LANGS[lang]

  // 添加新任务
  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), name: '' }])
  }

  // 修改任务名
  const updateTask = (id, name) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, name } : t))
  }

  // 进入签到页
  const goCheckin = (id) => {
    const task = tasks.find(t => t.id === id)
    if (task && task.name.trim()) {
      router.push(`/checkin/${id}`)
    } else {
      alert(t.inputTip)
    }
  }

  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <main className="min-h-screen w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gray-900 px-2 py-8">
      {/* 右上角语言切换 */}
      <div className="fixed top-4 right-4 z-20 flex gap-1 sm:gap-2">
        <button
          className={`px-2 py-1 rounded text-sm sm:text-lg ${lang === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setLang('zh')}
          style={{minHeight: '32px', minWidth: '40px'}}
        >中文</button>
        <button
          className={`px-2 py-1 rounded text-sm sm:text-lg ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setLang('en')}
          style={{minHeight: '32px', minWidth: '40px'}}
        >EN</button>
      </div>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wider font-lobster w-full text-center mb-6 sm:mb-12 leading-tight">NJ の Check-in</h1>
      <div className="w-full flex flex-col gap-3 sm:gap-6">
        {tasks.map((task, idx) => (
          <div key={task.id} className="flex gap-2 sm:gap-4 items-center">
            <input
              className="w-full px-3 py-3 sm:px-6 sm:py-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none text-base sm:text-xl"
              placeholder={`${t.task}${idx + 1}`}
              value={task.name}
              onChange={e => updateTask(task.id, e.target.value)}
              style={{minHeight: '44px'}}
            />
            <button
              className="w-full max-w-[120px] bg-blue-600 text-white px-3 py-3 sm:px-6 sm:py-4 rounded flex items-center justify-center text-base sm:text-xl whitespace-nowrap"
              onClick={() => goCheckin(task.id)}
              style={{minHeight: '44px', minWidth: '60px'}}
            >{t.enter}</button>
            {idx >= 2 && (
              <button
                className="ml-1 sm:ml-2 flex items-center justify-center text-xl sm:text-2xl leading-none hover:bg-red-700 rounded max-w-[44px]"
                onClick={() => deleteTask(task.id)}
                title="删除任务"
                style={{padding: 0, minHeight: '44px', minWidth: '44px'}}
              >{t.delete}</button>
            )}
          </div>
        ))}
        <button 
          className="w-full mt-4 sm:mt-6 bg-white text-gray-900 px-4 py-3 sm:px-6 sm:py-4 rounded text-base sm:text-xl" 
          onClick={addTask}
          style={{minHeight: '44px'}}
        >{t.addTask}</button>
      </div>
    </main>
  )
} 