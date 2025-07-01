import React, { useState } from 'react'
import { PRIORITY_OPTIONS } from '../utils/日期工具'

/**
 * 任务表单组件
 * @param {object} task 编辑的任务（可选）
 * @param {function} onSave 保存回调
 * @param {function} onCancel 取消回调
 */
export default function TaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || '中')

  // 保存任务
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return alert('请输入任务标题')
    onSave({
      id: task?.id || Date.now().toString(),
      title,
      priority,
      done: task?.done || false
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-4 w-80" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">任务标题</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={30}
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">优先级</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="text-gray-500" onClick={onCancel}>取消</button>
          <button type="submit" className="bg-primary text-white px-4 py-1 rounded">保存</button>
        </div>
      </form>
    </div>
  )
} 