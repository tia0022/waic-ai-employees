'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import JourneyPanel from '@/components/JourneyPanel'
import AgentChat from '@/components/AgentChat'
import DemoPanel, { DEMO_SCENES } from '@/components/DemoPanel'
import ProfitCalc from '@/components/ProfitCalc'

// Leaflet requires window — load client-side only
const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false })

type CenterTab = 'chat' | 'map'
type RightTab = 'demo' | 'profit'

export default function Home() {
  const [mode, setMode] = useState<'demo' | 'live'>('live')
  const [demoScene, setDemoScene] = useState(-1)
  const [centerTab, setCenterTab] = useState<CenterTab>('chat')
  const [rightTab, setRightTab] = useState<RightTab>('profit')
  const [mapPlaying, setMapPlaying] = useState(false)

  const activeScene = demoScene >= 0 && demoScene < DEMO_SCENES.length ? DEMO_SCENES[demoScene] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ── HEADER ── */}
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

      {/* ── MAIN 3-COLUMN ── */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '210px 1fr 248px' }}>

        {/* LEFT: Journey + Mode */}
        <JourneyPanel
          activeNodes={activeScene?.nodes ?? []}
          activeAgents={activeScene?.agents ?? []}
          mode={mode}
          onModeChange={setMode}
        />

        {/* CENTER: Tab — Chat | Map */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
          borderRight: '1px solid var(--border)' }}>

          {/* Center tab bar */}
          <div style={{
            height: 44, flexShrink: 0, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 4,
          }}>
            <TabBtn active={centerTab === 'chat'} onClick={() => setCenterTab('chat')} color="#6366f1">
              经营指挥台
            </TabBtn>
            <TabBtn active={centerTab === 'map'} onClick={() => setCenterTab('map')} color="#38bdf8">
              全球物流地图
            </TabBtn>
            {centerTab === 'map' && (
              <button onClick={() => setMapPlaying(p => !p)} style={{
                marginLeft: 'auto', fontSize: 10, padding: '3px 10px', borderRadius: 6,
                border: '1px solid rgba(56,189,248,0.3)', background: mapPlaying ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: '#38bdf8', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {mapPlaying ? '⏹ 停止' : '▶ 动画'}
              </button>
            )}
            {centerTab === 'chat' && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                {['经营评估','达人营销','合规审计','物流调度','分析师'].map((label, i) => {
                  const colors = ['#00c9a7','#f97316','#f59e0b','#38bdf8','#a78bfa']
                  return (
                    <span key={label} style={{
                      fontSize: 9, padding: '2px 7px', borderRadius: 4,
                      background: `${colors[i]}11`, border: `1px solid ${colors[i]}33`, color: colors[i],
                    }}>{label}</span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Center content */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: centerTab === 'chat' ? 'block' : 'none' }}>
            <AgentChat demoMode={mode === 'demo'} />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: centerTab === 'map' ? 'block' : 'none' }}>
            <WorldMap activeNode={activeScene ? activeScene.nodes[activeScene.nodes.length - 1] ?? -1 : -1} playing={mapPlaying} />
          </div>
        </div>

        {/* RIGHT: Tab — Demo | Profit */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', background: 'var(--bg2)' }}>
          
          {/* Right tab bar */}
          <div style={{
            height: 44, flexShrink: 0, borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 10px', gap: 4,
          }}>
            <TabBtn active={rightTab === 'profit'} onClick={() => setRightTab('profit')} color="#a78bfa">
              利润核算
            </TabBtn>
            <TabBtn active={rightTab === 'demo'} onClick={() => setRightTab('demo')} color="#6366f1">
              演示场景
            </TabBtn>
          </div>

          {/* Right content */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: rightTab === 'demo' ? 'flex' : 'none', flexDirection: 'column' }}>
            <DemoPanel currentScene={demoScene} onSceneChange={setDemoScene} />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: rightTab === 'profit' ? 'block' : 'none' }}>
            <ProfitCalc />
          </div>
        </div>
      </main>
    </div>
  )
}

function TabBtn({ active, onClick, color, children }: {
  active: boolean; onClick: () => void; color: string; children: React.ReactNode
}) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 11, fontWeight: active ? 700 : 500,
      background: active ? `${color}18` : 'transparent',
      color: active ? color : 'var(--muted)',
      borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )
}
