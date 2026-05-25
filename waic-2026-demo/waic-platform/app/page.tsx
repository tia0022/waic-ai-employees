'use client'
import { useState } from 'react'
import JourneyPanel from '@/components/JourneyPanel'
import AgentChat from '@/components/AgentChat'
import DemoPanel, { DEMO_SCENES } from '@/components/DemoPanel'

export default function Home() {
  const [mode, setMode] = useState<'demo' | 'live'>('live')
  const [demoScene, setDemoScene] = useState(-1)

  const activeScene = demoScene >= 0 && demoScene < DEMO_SCENES.length ? DEMO_SCENES[demoScene] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        height: 52, flexShrink: 0, background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg, #6366f1, #00c9a7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
          }}>明</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>明心数智</span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 4,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8',
          }}>跨赋AI平台</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>产业出海 · 全链路智能调度</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>
            贷款规模 <strong style={{ color: 'var(--supply)' }}>超1500亿元</strong>
          </span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>
            中美海关覆盖 <strong style={{ color: 'var(--supply)' }}>100%</strong>
          </span>
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8',
          }}>
            {mode === 'live' ? '实时AI · 在线' : `演示中 ${demoScene >= 0 ? demoScene + 1 : 0}/${DEMO_SCENES.length}`}
          </span>
          <span style={{
            fontSize: 10, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)',
            color: 'var(--supply)', letterSpacing: 1, fontWeight: 600,
          }}>WAIC 2026</span>
        </div>
      </header>

      {/* Main 3-column layout */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '210px 1fr 220px' }}>
        {/* Left: Journey + Mode */}
        <JourneyPanel
          activeNodes={activeScene?.nodes ?? []}
          activeAgents={activeScene?.agents ?? []}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Center: Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {/* Top bar */}
          <div style={{
            height: 44, flexShrink: 0, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>跨赋经营指挥台</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {['经营评估','达人营销','合规审计','物流调度','分析师'].map((label, i) => {
                const colors = ['var(--supply)', 'var(--marketing)', 'var(--compliance)', 'var(--logistics)', 'var(--analyst)']
                return (
                  <span key={label} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                    background: `${colors[i]}11`, border: `1px solid ${colors[i]}33`, color: colors[i],
                  }}>{label}</span>
                )
              })}
            </div>
          </div>
          {/* Chat component */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <AgentChat demoMode={mode === 'demo'} />
          </div>
        </div>

        {/* Right: Demo scenes panel */}
        <DemoPanel currentScene={demoScene} onSceneChange={setDemoScene} />
      </main>
    </div>
  )
}
