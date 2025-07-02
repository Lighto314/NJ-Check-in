'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../hooks/useLanguage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // 记录错误到控制台
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-300">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center text-center">
        <div className="text-6xl mb-4">😱</div>
        <h1 className="text-3xl font-bold mb-4 text-white">
          {t('somethingWentWrong') || '出错了'}
        </h1>
        <p className="text-white mb-6 opacity-80">
          {t('errorOccurred') || '应用程序遇到了一个错误。'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {t('tryAgain') || '重试'}
          </button>
          <Link 
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {t('backToHome') || '返回首页'}
          </Link>
        </div>
      </div>
    </main>
  );
} 