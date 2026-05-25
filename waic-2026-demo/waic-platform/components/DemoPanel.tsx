'use client'
import { useState, useRef } from 'react'

// Re-export the full SCENES data from the original demo for the scripted flow
export const DEMO_SCENES = [
  { id: 0, label: '① 任务分发', shortLabel: '任务分发', agent: '跨赋大模型', color: '#6366f1', nodes: [], agents: [] },
  { id: 1, label: '② 供应链采购', shortLabel: '供应链', agent: '经营评估小明', color: '#00c9a7', nodes: [0], agents: ['supply'] },
  { id: 2, label: '③ 达人营销', shortLabel: '达人营销', agent: '达人营销小明', color: '#f97316', nodes: [0,4], agents: ['mkt', 'comp'] },
  { id: 3, label: '④ 报关清关', shortLabel: '报关', agent: '合规审计小明', color: '#f59e0b', nodes: [0,1,3], agents: ['comp'] },
  { id: 4, label: '⑤ 物流调度', shortLabel: '物流', agent: '物流调度小明', color: '#38bdf8', nodes: [0,1,2,3], agents: ['log'] },
  { id: 5, label: '⑥ 经营核算', shortLabel: '核算', agent: '分析师小明', color: '#a78bfa', nodes: [0,1,2,3,4], agents: ['ana'] },
  { id: 6, label: '⑦ 全链路完成', shortLabel: '完成', agent: '全员', color: '#34d399', nodes: [0,1,2,3,4], agents: [] },
]

interface Props {
  currentScene: number
  onSceneChange: (scene: number) => void
}

export default function DemoPanel({ currentScene, onSceneChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg2)',
      borderLeft: '1px solid var(--border)' }}>
      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: 2 }}>演示场景</div>
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>WAIC 5分钟展示流程</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {DEMO_SCENES.map(s => (
          <button key={s.id} onClick={() => onSceneChange(s.id)}
            className={`scene-card ${currentScene === s.id ? 'active' : ''}`}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: currentScene === s.id ? 'rgba(99,102,241,0.06)' : 'var(--bg3)',
              border: `1px solid ${currentScene === s.id ? 'var(--brand)' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 12px',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{s.shortLabel}</span>
              {currentScene === s.id && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--brand)', background: 'rgba(99,102,241,0.12)',
                  padding: '1px 5px', borderRadius: 3 }}>当前</span>
              )}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.agent}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
