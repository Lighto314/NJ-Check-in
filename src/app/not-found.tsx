'use client';

import Link from 'next/link';
import { useLanguage } from '../hooks/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center text-center">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="text-3xl font-bold mb-4 text-white">404</h1>
        <p className="text-lg text-white mb-6">
          {t('pageNotFound') || '页面未找到'}
        </p>
        <p className="text-white mb-8 opacity-80">
          {t('pageNotFoundDesc') || '抱歉，您访问的页面不存在。'}
        </p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('backToHome') || '返回首页'}
        </Link>
      </div>
    </main>
  );
} 