'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { AGENTS, AgentId, routeToAgent } from '@/lib/agents'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentId?: AgentId
  agentName?: string
  agentAvatar?: string
  agentColor?: string
  agentProduct?: string
  streaming?: boolean
}

interface Props {
  demoMode?: boolean
}

export default function AgentChat({ demoMode }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好，我是明心跨赋AI平台。请描述你的出海目标，例如：\n\n「帮我把景德镇手工茶杯完美交付到洛杉矶C端买家，全链路合规」',
      agentId: 'orchestrator',
      agentName: '跨赋 · 跨境服务大模型',
      agentAvatar: '跨',
      agentColor: '#6366f1',
      agentProduct: '任务编排 · 路由分发',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null)
  const [history, setHistory] = useState<{role:string;content:string}[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg }
    const newHistory = [...history, { role: 'user', content: msg }]
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Predict which agent will respond
    const predicted = routeToAgent(msg)
    setActiveAgent(predicted)

    // Add typing placeholder
    const placeholderId = 'placeholder-' + Date.now()
    setMessages(prev => [...prev, {
      id: placeholderId,
      role: 'assistant',
      content: '',
      agentId: predicted,
      agentName: AGENTS[predicted].name,
      agentAvatar: AGENTS[predicted].avatar,
      agentColor: AGENTS[predicted].color,
      agentProduct: AGENTS[predicted].product,
      streaming: true,
    }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: newHistory }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let finalAgentId = predicted

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'agent') {
              finalAgentId = parsed.agent.id
              setActiveAgent(finalAgentId)
              setMessages(prev => prev.map(m => m.id === placeholderId ? {
                ...m,
                agentId: parsed.agent.id,
                agentName: parsed.agent.name,
                agentAvatar: parsed.agent.avatar,
                agentColor: parsed.agent.color,
                agentProduct: parsed.agent.product,
              } : m))
            } else if (parsed.type === 'delta') {
              fullContent += parsed.content
              setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: fullContent } : m))
            }
          } catch { /* skip */ }
        }
      }

      // Finalize message
      setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, streaming: false } : m))
      setHistory([...newHistory, { role: 'assistant', content: fullContent }])

    } catch (err) {
      setMessages(prev => prev.map(m => m.id === placeholderId ? {
        ...m, content: '连接异常，请重试。', streaming: false
      } : m))
    } finally {
      setLoading(false)
      setActiveAgent(null)
    }
  }, [input, loading, history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // Quick prompts
  const QUICK = [
    { label: '📦 采购 & 融资', text: '景德镇高白泥茶杯200件，工厂账期30天，有资金缺口怎么处理？' },
    { label: '📱 达人营销', text: '如何在TikTok找洛杉矶本地达人合作推广中式茶器？' },
    { label: '📋 报关合规', text: '陶瓷茶杯出口美国需要注意哪些FDA合规要求？HS Code是什么？' },
    { label: '🛳 物流方案', text: '景德镇到洛杉矶，海运还是空运？港口罢工怎么应对？' },
    { label: '💰 利润核算', text: '茶杯售价$68，帮我算全链路净利润和行动建议' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => (
          <div key={msg.id} className={msg.streaming ? '' : 'msg-appear'}
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800,
              background: msg.role === 'user' ? 'rgba(99,102,241,0.2)' : `${msg.agentColor}22`,
              color: msg.role === 'user' ? '#818cf8' : msg.agentColor,
              border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.3)' : msg.agentColor + '44'}`,
            }}>
              {msg.role === 'user' ? '你' : msg.agentAvatar}
            </div>
            {/* Bubble */}
            <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 4,
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: msg.agentColor }}>{msg.agentName}</span>
                  <span style={{ fontSize: 9, color: 'var(--muted)', background: 'rgba(255,255,255,0.04)',
                    padding: '1px 5px', borderRadius: 3 }}>{msg.agentProduct}</span>
                </div>
              )}
              <div style={{
                padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                background: msg.role === 'user' ? 'rgba(99,102,241,0.18)' : 'var(--bg3)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
                fontSize: 13, lineHeight: 1.65, color: 'var(--text)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {msg.content || (msg.streaming && (
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center', color: msg.agentColor }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {QUICK.map(q => (
            <button key={q.label} onClick={() => sendMessage(q.text)}
              style={{
                fontSize: 11, padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'; (e.target as HTMLElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--muted)' }}
            >{q.label}</button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{
        padding: '12px 20px 16px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="输入你的出海业务问题，按 Enter 发送…"
          rows={2}
          style={{
            flex: 1, resize: 'none', background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 13,
            fontFamily: 'inherit', outline: 'none', lineHeight: 1.5,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.45)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px', borderRadius: 10, cursor: loading ? 'default' : 'pointer',
            background: loading ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.22)',
            color: loading ? 'var(--muted)' : '#818cf8',
            fontSize: 13, fontFamily: 'inherit', fontWeight: 600,
            border: '1px solid ' + (loading ? 'var(--border)' : 'rgba(99,102,241,0.35)'),
            transition: 'all 0.2s',
          }}>
          {loading ? '…' : '发送'}
        </button>
      </div>
    </div>
  )
}
