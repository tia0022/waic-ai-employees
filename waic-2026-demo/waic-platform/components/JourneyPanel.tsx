'use client'

export type JourneyStatus = 'pending' | 'active' | 'done'

const NODES = [
  { id: 0, city: '景德镇', detail: '高白泥茶杯烧制\nSKU数字化 · 产融授信', tag: '供应链' },
  { id: 1, city: '深圳盐田港', detail: '海运出口报关\nHS Code · 退税申报', tag: '出境' },
  { id: 2, city: '太平洋干线', detail: '海运12-15天\n运踪GPT实时监控', tag: '在途' },
  { id: 3, city: '洛杉矶港', detail: 'FDA清关 · Sales Tax\n海外仓入库', tag: '进境' },
  { id: 4, city: '洛杉矶买家', detail: 'USPS/FedEx尾程\nTikTok达人交付', tag: 'C端' },
]

const AGENTS = [
  { id: 'supply', name: '经营评估小明', color: '#00c9a7' },
  { id: 'mkt', name: '达人营销小明', color: '#f97316' },
  { id: 'comp', name: '合规审计小明', color: '#f59e0b' },
  { id: 'log', name: '物流调度小明', color: '#38bdf8' },
  { id: 'ana', name: '内部分析师小明', color: '#a78bfa' },
]

interface Props {
  activeNodes?: number[]
  activeAgents?: string[]
  mode: 'demo' | 'live'
  onModeChange: (m: 'demo' | 'live') => void
}

export default function JourneyPanel({ activeNodes = [], activeAgents = [], mode, onModeChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg2)',
      borderRight: '1px solid var(--border)' }}>
      
      {/* Mode toggle */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 3, gap: 2 }}>
          {(['demo', 'live'] as const).map(m => (
            <button key={m} onClick={() => onModeChange(m)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                background: mode === m ? (m === 'demo' ? 'rgba(99,102,241,0.25)' : 'rgba(0,201,167,0.18)') : 'transparent',
                color: mode === m ? (m === 'demo' ? '#818cf8' : 'var(--supply)') : 'var(--muted)',
                transition: 'all 0.2s',
              }}>
              {m === 'demo' ? '演示模式' : '实时对话'}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 9, color: 'var(--muted)', marginTop: 5, textAlign: 'center', lineHeight: 1.4 }}>
          {mode === 'demo' ? '5分钟脚本演示 · WAIC展台专用' : '真实AI小明 · 可自由提问'}
        </p>
      </div>

      {/* Journey nodes */}
      <div style={{ padding: '8px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: 10 }}>全链路旅程</div>
        {NODES.map((node, i) => {
          const isActive = activeNodes.includes(node.id) && activeNodes[activeNodes.length - 1] === node.id
          const isDone = activeNodes.includes(node.id) && !isActive
          const isPending = !activeNodes.includes(node.id)
          return (
            <div key={node.id} style={{ display: 'flex', gap: 8, opacity: isPending ? 0.3 : 1, transition: 'opacity 0.4s' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 9, height: 9, borderRadius: '50%', marginTop: 3, transition: 'all 0.4s',
                  border: `2px solid ${isActive ? 'var(--supply)' : isDone ? 'var(--supply)' : 'var(--muted)'}`,
                  background: isActive ? 'var(--supply)' : isDone ? 'rgba(0,201,167,0.35)' : 'transparent',
                  boxShadow: isActive ? '0 0 8px var(--supply)' : 'none',
                }} />
                {i < NODES.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 14, background: 'var(--border)', margin: '3px 0' }} />}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text)' }}>{node.city}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2, whiteSpace: 'pre-line' }}>{node.detail}</div>
                <span style={{
                  display: 'inline-block', marginTop: 3, fontSize: 9, padding: '1px 5px', borderRadius: 3,
                  background: isActive ? 'rgba(0,201,167,0.15)' : isDone ? 'rgba(0,201,167,0.08)' : 'rgba(100,116,139,0.1)',
                  color: isActive ? 'var(--supply)' : isDone ? '#64a99a' : 'var(--muted)',
                }}>
                  {isActive ? 'ACTIVE' : isDone ? 'DONE' : 'PENDING'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI agents */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.2px', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: 8 }}>AI员工状态</div>
        {AGENTS.map(a => {
          const isActive = activeAgents.includes(a.id)
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 0' }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0,
                animation: isActive ? 'blink 1s infinite' : 'none',
                opacity: isActive ? 1 : 0.3,
              }} />
              <span style={{ fontSize: 11, color: isActive ? 'var(--text)' : 'var(--muted)', transition: 'color 0.3s' }}>{a.name}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 9, padding: '1px 5px', borderRadius: 3,
                background: isActive ? 'rgba(99,220,150,0.12)' : 'rgba(100,116,139,0.08)',
                color: isActive ? '#4ade80' : 'var(--muted)',
              }}>{isActive ? '运行中' : '待机'}</span>
            </div>
          )
        })}
      </div>

      {/* Bottom credit */}
      <div style={{ marginTop: 'auto', padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.6 }}>
          <div style={{ color: 'var(--supply)', fontWeight: 700, marginBottom: 3 }}>明心数智 · 明心跨赋</div>
          贷款规模 超1500亿元（零不良）<br />
          中美海关覆盖 100%<br />
          全球200+航司 · 50+船东
        </div>
      </div>
    </div>
  )
}
