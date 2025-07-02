'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function DefaultCheckinPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // 如果用户未登录，跳转到登录页面
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // 加载任务列表
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('checkin-tasks');
        if (saved) {
          setTasks(JSON.parse(saved));
        }
      } catch (error) {
        console.error('加载任务失败:', error);
      }
    }
  }, []);

  // 添加新任务
  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        name: newTask.trim(),
        createdAt: new Date().toISOString()
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem('checkin-tasks', JSON.stringify(updatedTasks));
      setNewTask('');
    }
  };

  // 删除任务
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('checkin-tasks', JSON.stringify(updatedTasks));
  };

  // 编辑任务
  const editTask = (taskId, newName) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, name: newName } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('checkin-tasks', JSON.stringify(updatedTasks));
  };

  // 进入任务打卡
  const enterTask = (taskId) => {
    router.push(`/checkin/${taskId}`);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <main className="min-h-screen w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gray-900 px-2 py-8">
      {/* 顶部用户信息和退出按钮 */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        <span className="text-white text-sm px-3 py-1 bg-blue-600 rounded">
          {user.username || user.email}
        </span>
        <button 
          className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
          onClick={signOut}
        >
          退出
        </button>
      </div>

      {/* 标题 */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider font-lobster w-full text-center mb-4 sm:mb-8 leading-tight">
        NJ の Check-in
      </h1>

      {/* 任务列表 */}
      <div className="w-full flex flex-col gap-2 sm:gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex gap-2 sm:gap-4 items-center">
            <input 
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none text-sm sm:text-base md:text-lg" 
              value={task.name}
              onChange={(e) => editTask(task.id, e.target.value)}
              style={{minHeight: '40px'}}
            />
            <button 
              className="w-full max-w-[100px] bg-blue-600 text-white px-2 py-2 sm:px-4 sm:py-3 rounded flex items-center justify-center text-sm sm:text-base md:text-lg whitespace-nowrap hover:bg-blue-700"
              onClick={() => enterTask(task.id)}
              style={{minHeight: '40px', minWidth: '56px'}}
            >
              进入签到
            </button>
            <button 
              className="w-full max-w-[40px] bg-red-600 text-white px-2 py-2 sm:px-2 sm:py-3 rounded flex items-center justify-center text-sm sm:text-base md:text-lg whitespace-nowrap hover:bg-red-700"
              onClick={() => deleteTask(task.id)}
              style={{minHeight: '40px', minWidth: '40px'}}
              title="删除任务"
            >
              ❌
            </button>
          </div>
        ))}
        
        {/* 添加新任务 */}
        <div className="flex gap-2 sm:gap-4 items-center">
          <input 
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none text-sm sm:text-base md:text-lg" 
            placeholder="新任务名称"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            style={{minHeight: '40px'}}
          />
          <button 
            className="w-full max-w-[100px] bg-green-600 text-white px-2 py-2 sm:px-4 sm:py-3 rounded flex items-center justify-center text-sm sm:text-base md:text-lg whitespace-nowrap hover:bg-green-700"
            onClick={addTask}
            style={{minHeight: '40px', minWidth: '56px'}}
          >
            添加
          </button>
        </div>
      </div>

      {/* 欢迎信息 */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>欢迎回来，{user.username || user.email}！</p>
        <p className="mt-2">创建任务开始你的打卡之旅吧！</p>
      </div>
    </main>
  );
} 