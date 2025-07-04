import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '签到打卡小程序',
  description: '简洁的月历签到与多任务打卡',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-200 font-['Microsoft YaHei', 'Noto Sans SC'] min-h-screen">{children}</body>
    </html>
  )
}