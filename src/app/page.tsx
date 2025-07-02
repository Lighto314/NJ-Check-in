'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function Home() {
  const { user, loading, error, signUp, signIn, signOut } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (isLogin) {
      await signIn(email, password);
      setMsg('登录成功！');
    } else {
      await signUp(email, password);
      setMsg('注册成功，请查收邮箱激活账号！');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">加载中...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
        <div className="text-3xl font-bold mb-6 text-blue-700">NJ Check-in</div>
        {user ? (
          <>
            <div className="mb-4 text-lg text-gray-800">你好，{user.email}</div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
              onClick={signOut}
            >退出登录</button>
            <div className="text-gray-500 text-sm">登录后可进行打卡和数据云同步</div>
          </>
        ) : (
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="邮箱"
              className="border rounded px-3 py-2 w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="密码"
              className="border rounded px-3 py-2 w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >{isLogin ? '登录' : '注册'}</button>
            <button
              type="button"
              className="w-full text-blue-600 underline text-sm mt-1"
              onClick={() => setIsLogin(!isLogin)}
            >{isLogin ? '没有账号？注册' : '已有账号？登录'}</button>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            {msg && <div className="text-green-600 text-sm mt-1">{msg}</div>}
          </form>
        )}
      </div>
    </main>
  );
}
