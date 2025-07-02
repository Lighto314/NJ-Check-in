'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function Home() {
  const { user, loading, error, signUp, signIn, signOut } = useSupabaseAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');

  // 用户登录成功后自动跳转到打卡界面
  useEffect(() => {
    if (user && !loading) {
      router.push('/checkin/default');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    
    if (!isLogin && password !== confirmPassword) {
      setMsg('两次输入的密码不一致！');
      return;
    }
    
    if (isLogin) {
      await signIn(username, password);
      setMsg('登录成功！');
    } else {
      await signUp(username, password);
      setMsg('注册成功！正在自动登录...');
    }
  };

  // 如果正在加载或用户已登录，显示加载状态
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-lg text-gray-700 bg-white/80 px-6 py-4 rounded-lg">
          {loading ? '加载中...' : '正在跳转...'}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
        <div className="text-3xl font-bold mb-6 text-white">NJ Check-in</div>
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="on">
            <input
              type="text"
              name="username"
              placeholder="用户名"
              className="border rounded px-3 py-2 w-full bg-white/50 text-gray-800 placeholder-gray-600"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="密码"
              className="border rounded px-3 py-2 w-full bg-white/50 text-gray-800 placeholder-gray-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="确认密码"
                className="border rounded px-3 py-2 w-full bg-white/50 text-gray-800 placeholder-gray-600"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >{isLogin ? '登录' : '注册'}</button>
            <button
              type="button"
              className="w-full text-white underline text-sm mt-1"
              onClick={() => {
                setIsLogin(!isLogin);
                setConfirmPassword('');
                setMsg('');
              }}
            >{isLogin ? '没有账号？注册' : '已有账号？登录'}</button>
            {error && <div className="text-red-300 text-sm mt-1">{error}</div>}
            {msg && <div className="text-green-300 text-sm mt-1">{msg}</div>}
          </form>
        </div>
      </main>
    );
  }
