import React, { useState } from 'react'
import TaskForm from './任务表单'
import { PRIORITY_COLORS } from '../utils/日期工具'

/**
 * 任务列表组件
 * @param {string} date 日期（yyyy-MM-dd）
 * @param {object} data 本月数据
 * @param {function} setData 设置数据
 * @param {function} onClose 关闭弹窗
 */
export default function TaskList({ date, data, setData, onClose }) {
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const tasks = data.tasks?.[date] || []

  // 添加或编辑任务
  const handleSave = (task) => {
    const newTasks = [...(data.tasks?.[date] || [])]
    if (editTask) {
      // 编辑
      const idx = newTasks.findIndex(t => t.id === editTask.id)
      if (idx > -1) newTasks[idx] = task
    } else {
      // 新增
      newTasks.push(task)
    }
    setData({
      ...data,
      tasks: { ...data.tasks, [date]: newTasks }
    })
    setShowForm(false)
    setEditTask(null)
  }

  // 删除任务
  const handleDelete = (id) => {
    const newTasks = (data.tasks?.[date] || []).filter(t => t.id !== id)
    setData({
      ...data,
      tasks: { ...data.tasks, [date]: newTasks }
    })
  }

  // 切换完成状态
  const toggleDone = (id) => {
    const newTasks = (data.tasks?.[date] || []).map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    )
    setData({
      ...data,
      tasks: { ...data.tasks, [date]: newTasks }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">{date} 的任务</div>
          <button className="text-primary" onClick={onClose}>关闭</button>
        </div>
        <button className="bg-primary text-white px-3 py-1 rounded mb-2" onClick={() => { setShowForm(true); setEditTask(null) }}>添加任务</button>
        {/* 任务列表 */}
        <ul>
          {tasks.length === 0 && <li className="text-gray-400">暂无任务</li>}
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between mb-1 p-2 rounded" style={{ background: task.done ? '#E8F5E9' : '#F5F5F5' }}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full inline-block`} style={{ background: PRIORITY_COLORS[task.priority] }} />
                <span className={task.done ? 'line-through text-green' : ''}>{task.title}</span>
              </div>
              <div className="flex gap-1">
                <button className="text-green" onClick={() => toggleDone(task.id)}>{task.done ? '撤销' : '完成'}</button>
                <button className="text-primary" onClick={() => { setEditTask(task); setShowForm(true) }}>编辑</button>
                <button className="text-red" onClick={() => handleDelete(task.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
        {/* 任务表单弹窗 */}
        {showForm && (
          <TaskForm
            task={editTask}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditTask(null) }}
          />
        )}
      </div>
    </div>
  )
} 