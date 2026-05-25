import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '明心数智 · 跨赋AI平台 — WAIC 2026',
  description: '产业出海 · 全链路AI智能调度 · 景德镇茶杯的全球旅程',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
