'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function Home() {
  const { user, loading, error, signUp, signIn, signOut } = useAuth();
  const { lang, changeLang, t } = useLanguage();
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
      setMsg(t('passwordMismatch'));
      return;
    }
    
    if (isLogin) {
      await signIn(username, password);
      setMsg(t('loginSuccess'));
    } else {
      await signUp(username, password);
      setMsg(t('registerSuccess'));
    }
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-lg text-gray-700 bg-white/80 px-6 py-4 rounded-lg">
          {t('checkingAuth')}
        </div>
      </div>
    );
  }

  // 如果用户已登录，显示跳转状态
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-lg text-gray-700 bg-white/80 px-6 py-4 rounded-lg">
          {t('redirecting')}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* 语言切换按钮 */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
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
      
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
        <div className="text-3xl font-bold mb-6 text-white">{t('title')}</div>
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="on">
            <input
              type="text"
              name="username"
              placeholder={t('username')}
              className="border rounded px-3 py-2 w-full bg-white/50 text-gray-800 placeholder-gray-600"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t('password')}
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
                placeholder={t('confirmPassword')}
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
            >{isLogin ? t('login') : t('register')}</button>
            <button
              type="button"
              className="w-full text-white underline text-sm mt-1"
              onClick={() => {
                setIsLogin(!isLogin);
                setConfirmPassword('');
                setMsg('');
              }}
            >{isLogin ? t('noAccount') : t('hasAccount')}</button>
            {error && <div className="text-red-300 text-sm mt-1">{error}</div>}
            {msg && <div className="text-green-300 text-sm mt-1">{msg}</div>}
          </form>
        </div>
      </main>
    );
  }
