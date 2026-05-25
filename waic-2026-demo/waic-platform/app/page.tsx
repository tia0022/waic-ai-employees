'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import JourneyPanel from '@/components/JourneyPanel'
import AgentChat from '@/components/AgentChat'
import ProfitCalc from '@/components/ProfitCalc'
import { SCENES } from '@/lib/scenes'

const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false })

type CenterTab = 'chat' | 'map'
type RightTab = 'profit' | 'demo'

export interface DemoMessage {
  id: string
  cls: string
  av: string
  sender: string
  html: string
}

export interface DemoCard {
  id: string
  cls: string
  icon: string
  title: string
  badge: string
  body: string
}

export default function Home() {
  const [mode, setMode] = useState<'demo' | 'live'>('live')
  const [centerTab, setCenterTab] = useState<CenterTab>('chat')
  const [rightTab, setRightTab] = useState<RightTab>('profit')

  // Demo state
  const [demoScene, setDemoScene] = useState(-1)
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([])
  const [demoCards, setDemoCards] = useState<DemoCard[]>([])
  const [demoProgress, setDemoProgress] = useState(0)
  const [demoLabel, setDemoLabel] = useState('等待指令')
  const [demoRunning, setDemoRunning] = useState(false)
  const [mapPlaying, setMapPlaying] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearTimeouts = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = [] }

  const sleep = (ms: number) => new Promise<void>(r => {
    const t = setTimeout(r, ms)
    timeoutsRef.current.push(t)
  })

  const runScene = useCallback(async (idx: number) => {
    if (idx < 0 || idx >= SCENES.length) return
    const s = SCENES[idx]
    setDemoRunning(true)
    setDemoProgress(s.pct)
    setDemoLabel(s.label)
    setDemoScene(idx)
    if (centerTab !== 'chat') setCenterTab('chat')

    for (const m of s.msgs) {
      await sleep(m.delay || 600)
      // Show typing for a moment
      const typingId = `typing-${Date.now()}`
      setDemoMessages(prev => [...prev, {
        id: typingId, cls: m.cls + ' typing', av: m.av, sender: m.sender, html: ''
      }])
      await sleep(700 + Math.min(m.html.length * 0.8, 1200))
      setDemoMessages(prev => prev.map(msg =>
        msg.id === typingId ? { ...msg, id: typingId + '-done', cls: m.cls, html: m.html } : msg
      ))
    }

    for (const c of s.cards) {
      await sleep(200)
      setDemoCards(prev => [...prev, { ...c, id: `card-${Date.now()}-${Math.random()}` }])
    }

    setDemoRunning(false)
  }, [centerTab])

  const goToScene = useCallback(async (idx: number) => {
    if (idx === demoScene) return
    clearTimeouts()
    if (idx < demoScene || idx === 0) {
      // going back: fast replay from 0
      setDemoMessages([])
      setDemoCards([])
      setDemoProgress(0)
      setDemoLabel('等待指令')
      setDemoScene(-1)
      for (let i = 0; i <= idx; i++) {
        const s = SCENES[i]
        setDemoProgress(s.pct)
        setDemoLabel(s.label)
        setDemoScene(i)
        s.msgs.forEach(m => setDemoMessages(prev => [...prev, {
          id: `instant-${i}-${Math.random()}`, cls: m.cls, av: m.av, sender: m.sender, html: m.html
        }]))
        s.cards.forEach(c => setDemoCards(prev => [...prev, {
          ...c, id: `card-instant-${i}-${Math.random()}`
        }]))
      }
    } else {
      await runScene(idx)
    }
  }, [demoScene, runScene])

  const handleNext = useCallback(() => {
    if (demoRunning) return
    const next = demoScene + 1
    if (next < SCENES.length) runScene(next)
  }, [demoScene, demoRunning, runScene])

  const handlePrev = useCallback(() => {
    if (demoRunning) return
    const prev = demoScene - 1
    if (prev >= 0) goToScene(prev)
    else {
      clearTimeouts()
      setDemoMessages([]); setDemoCards([])
      setDemoProgress(0); setDemoLabel('等待指令'); setDemoScene(-1)
    }
  }, [demoScene, demoRunning, goToScene])

  const handleReset = useCallback(() => {
    clearTimeouts(); setDemoRunning(false)
    setDemoMessages([]); setDemoCards([])
    setDemoProgress(0); setDemoLabel('等待指令'); setDemoScene(-1)
  }, [])

  useEffect(() => () => clearTimeouts(), [])

  const activeScene = demoScene >= 0 && demoScene < SCENES.length ? SCENES[demoScene] : null
  const totalScenes = SCENES.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* HEADER */}
      <header style={{
        height: 52, flexShrink: 0, background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg, #6366f1, #00c9a7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
          }}>明</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>明心数智</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>跨赋AI平台</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>产业出海 · 全链路智能调度</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>贷款规模 <strong style={{ color: 'var(--supply)' }}>超1500亿元</strong></span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>中美海关 <strong style={{ color: 'var(--supply)' }}>100%</strong></span>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20,
            background: mode === 'demo' ? 'rgba(0,201,167,0.1)' : 'rgba(99,102,241,0.12)',
            border: `1px solid ${mode === 'demo' ? 'rgba(0,201,167,0.25)' : 'rgba(99,102,241,0.25)'}`,
            color: mode === 'demo' ? 'var(--supply)' : '#818cf8' }}>
            {mode === 'live' ? '实时AI · 在线' : demoScene >= 0 ? `演示 ${demoScene + 1}/${totalScenes}` : '演示模式'}
          </span>
          <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)',
            color: 'var(--supply)', letterSpacing: 1, fontWeight: 600 }}>WAIC 2026</span>
        </div>
      </header>

      {/* 3-COLUMN */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '210px 1fr 260px' }}>

        {/* LEFT */}
        <JourneyPanel
          activeNodes={activeScene?.journey ?? []}
          activeAgents={activeScene?.agents ?? []}
          mode={mode}
          onModeChange={m => { setMode(m); if (m === 'demo') setRightTab('demo') }}
        />

        {/* CENTER */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid var(--border)' }}>
          <div style={{
            height: 44, flexShrink: 0, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 4,
          }}>
            <TabBtn active={centerTab === 'chat'} onClick={() => setCenterTab('chat')} color="#6366f1">经营指挥台</TabBtn>
            <TabBtn active={centerTab === 'map'} onClick={() => setCenterTab('map')} color="#38bdf8">全球物流地图</TabBtn>
            {centerTab === 'map' && (
              <button onClick={() => setMapPlaying(p => !p)} style={{
                marginLeft: 8, fontSize: 10, padding: '3px 10px', borderRadius: 6,
                border: '1px solid rgba(56,189,248,0.3)', background: mapPlaying ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: '#38bdf8', cursor: 'pointer', fontFamily: 'inherit',
              }}>{mapPlaying ? '⏹ 停止' : '▶ 动画'}</button>
            )}
            {centerTab === 'chat' && mode === 'demo' && demoScene >= 0 && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--supply)' }}>
                {demoLabel}
              </span>
            )}
            {centerTab === 'chat' && mode === 'live' && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {['经营评估','达人营销','合规审计','物流调度','分析师'].map((l, i) => {
                  const c = ['#00c9a7','#f97316','#f59e0b','#38bdf8','#a78bfa'][i]
                  return <span key={l} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4,
                    background: `${c}11`, border: `1px solid ${c}33`, color: c }}>{l}</span>
                })}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minHeight: 0, display: centerTab === 'chat' ? 'block' : 'none', overflow: 'hidden' }}>
            {mode === 'live' ? (
              <AgentChat />
            ) : (
              <DemoChat
                messages={demoMessages}
                cards={demoCards}
                progress={demoProgress}
                label={demoLabel}
              />
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0, display: centerTab === 'map' ? 'block' : 'none', overflow: 'hidden' }}>
            <WorldMap
              activeNode={activeScene ? activeScene.journey[activeScene.journey.length - 1] ?? -1 : -1}
              playing={mapPlaying}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg2)' }}>
          <div style={{
            height: 44, flexShrink: 0, borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 10px', gap: 4,
          }}>
            <TabBtn active={rightTab === 'profit'} onClick={() => setRightTab('profit')} color="#a78bfa">利润核算</TabBtn>
            <TabBtn active={rightTab === 'demo'} onClick={() => setRightTab('demo')} color="#6366f1">演示控制</TabBtn>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: rightTab === 'profit' ? 'block' : 'none' }}>
            <ProfitCalc />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: rightTab === 'demo' ? 'flex' : 'none', flexDirection: 'column' }}>
            <DemoController
              currentScene={demoScene}
              totalScenes={totalScenes}
              running={demoRunning}
              progress={demoProgress}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              onJump={idx => goToScene(idx)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

/* ── Demo Chat view (scripted mode) ── */
function DemoChat({ messages, cards, progress, label }: {
  messages: DemoMessage[]
  cards: DemoCard[]
  progress: number
  label: string
}) {
  const msgsEndRef = useRef<HTMLDivElement>(null)
  const cardsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { cardsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [cards])

  const CLS_COLORS: Record<string, string> = {
    user: '#6366f1', orch: '#6366f1', supply: '#00c9a7', mkt: '#f97316',
    comp: '#f59e0b', log: '#38bdf8', ana: '#a78bfa', vault: '#34d399',
  }

  if (messages.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', color: 'var(--muted)', gap: 10 }}>
        <div style={{ fontSize: 28 }}>🚢</div>
        <div style={{ fontSize: 12, fontWeight: 600 }}>演示模式就绪</div>
        <div style={{ fontSize: 10, color: '#475569' }}>点击右侧「开始演示」启动 5 分钟展示流程</div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* progress bar */}
      <div style={{ height: 3, flexShrink: 0, background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #00c9a7)',
          transition: 'width 0.6s ease' }} />
      </div>

      {/* messages + cards split */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(m => {
            const isUser = m.cls === 'user'
            const isTyping = m.cls.includes('typing')
            const baseClass = m.cls.replace(' typing', '').split(' ')[0]
            const color = CLS_COLORS[baseClass] || '#6366f1'
            return (
              <div key={m.id} className="msg-appear"
                style={{ display: 'flex', gap: 8, alignItems: 'flex-start',
                  flexDirection: isUser ? 'row-reverse' : 'row' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  background: `${color}22`, color, border: `1px solid ${color}44` }}>
                  {m.av}
                </div>
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 3,
                  alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color }}>{m.sender}</span>
                  <div style={{
                    padding: '9px 13px',
                    borderRadius: isUser ? '12px 3px 12px 12px' : '3px 12px 12px 12px',
                    background: isUser ? 'rgba(99,102,241,0.15)' : 'var(--bg3)',
                    border: `1px solid ${isUser ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
                    fontSize: 12, lineHeight: 1.65,
                  }}>
                    {isTyping ? (
                      <span style={{ display: 'flex', gap: 4, color }}>
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: m.html }} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={msgsEndRef} />
        </div>

        {/* cards panel */}
        {cards.length > 0 && (
          <div style={{ width: 180, borderLeft: '1px solid var(--border)', overflowY: 'auto',
            padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', color: 'var(--muted)',
              textTransform: 'uppercase', padding: '2px 4px' }}>实时交付物</div>
            {cards.map(c => (
              <div key={c.id} className="msg-appear" style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <span style={{ fontSize: 12 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, flex: 1, color: 'var(--text)' }}>{c.title}</span>
                </div>
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(100,116,139,0.1)',
                  color: 'var(--muted)', marginBottom: 6, display: 'inline-block' }}>{c.badge}</span>
                <div dangerouslySetInnerHTML={{ __html: c.body }} />
              </div>
            ))}
            <div ref={cardsEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Demo Controller (right panel) ── */
function DemoController({ currentScene, totalScenes, running, progress, onNext, onPrev, onReset, onJump }: {
  currentScene: number; totalScenes: number; running: boolean; progress: number
  onNext: () => void; onPrev: () => void; onReset: () => void; onJump: (i: number) => void
}) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>
            {currentScene < 0 ? '就绪' : SCENES[currentScene].label}
          </span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>
            {currentScene < 0 ? '0' : currentScene + 1}/{totalScenes}
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2,
            background: 'linear-gradient(90deg, #6366f1, #00c9a7)', transition: 'width 0.5s ease' }} />
        </div>

        {/* Prev / Next / Reset */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button onClick={onPrev} disabled={running || currentScene < 0}
            style={ctrlBtnStyle(false, running || currentScene < 0)}>← 上一步</button>
          <button onClick={onNext} disabled={running || currentScene >= totalScenes - 1}
            style={ctrlBtnStyle(true, running || currentScene >= totalScenes - 1)}>
            {running ? '运行中…' : currentScene < 0 ? '▶ 开始' : '下一步 →'}
          </button>
          <button onClick={onReset} disabled={running}
            style={ctrlBtnStyle(false, running)}>重置</button>
        </div>
      </div>

      {/* Scene list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => !running && onJump(i)} disabled={running}
            style={{
              width: '100%', textAlign: 'left', cursor: running ? 'default' : 'pointer',
              background: currentScene === i ? 'rgba(99,102,241,0.08)' : 'transparent',
              border: `1px solid ${currentScene === i ? 'var(--brand)' : 'transparent'}`,
              borderRadius: 8, padding: '7px 10px', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: i <= currentScene ? s.agentColor : 'var(--border)',
                boxShadow: currentScene === i ? `0 0 6px ${s.agentColor}` : 'none',
              }} />
              <span style={{ fontSize: 11, fontWeight: currentScene === i ? 700 : 400,
                color: i <= currentScene ? 'var(--text)' : 'var(--muted)' }}>
                {s.shortLabel}
              </span>
              {currentScene === i && running && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: s.agentColor,
                  animation: 'blink 1s infinite' }}>●</span>
              )}
              {i < currentScene && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#00c9a7' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', marginLeft: 13, marginTop: 1 }}>{s.agentLabel}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ctrlBtnStyle(primary: boolean, disabled: boolean): React.CSSProperties {
  return {
    flex: primary ? 2 : 1, padding: '6px 0', borderRadius: 8,
    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
    background: disabled ? 'transparent' : primary ? 'rgba(99,102,241,0.2)' : 'var(--bg3)',
    color: disabled ? 'var(--border)' : primary ? '#818cf8' : 'var(--muted)',
    border: `1px solid ${disabled ? 'var(--border)' : primary ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
    transition: 'all 0.15s',
  }
}

function TabBtn({ active, onClick, color, children }: {
  active: boolean; onClick: () => void; color: string; children: React.ReactNode
}) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 11, fontWeight: active ? 700 : 400,
      background: active ? `${color}18` : 'transparent',
      color: active ? color : 'var(--muted)',
      borderBottom: `2px solid ${active ? color : 'transparent'}`,
      transition: 'all 0.15s',
    }}>{children}</button>
  )
}
