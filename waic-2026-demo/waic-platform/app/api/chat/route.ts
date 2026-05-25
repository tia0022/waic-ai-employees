import { NextRequest } from 'next/server'
import { AGENTS, routeToAgent, AgentId } from '@/lib/agents'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { message, agentId, history = [] } = await req.json()

  const targetAgentId: AgentId = agentId || routeToAgent(message)
  const agent = AGENTS[targetAgentId]

  const baseUrl = process.env.AI_GATEWAY_BASE_URL
  const apiKey = process.env.AI_GATEWAY_API_KEY

  if (!baseUrl || !apiKey) {
    return new Response(JSON.stringify({ error: 'AI Gateway not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }

  const messages = [
    { role: 'system', content: agent.systemPrompt },
    ...history.slice(-6), // keep last 6 turns for context
    { role: 'user', content: message }
  ]

  const upstream = await fetch(`${baseUrl}/api/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4.5',
      messages,
      stream: true,
      max_tokens: 600,
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    return new Response(JSON.stringify({ error: err }), {
      status: upstream.status, headers: { 'Content-Type': 'application/json' }
    })
  }

  // Stream through SSE, prepending agent metadata on first chunk
  const encoder = new TextEncoder()
  let firstChunk = true

  const stream = new ReadableStream({
    async start(controller) {
      // Send agent info first
      controller.enqueue(encoder.encode(
        `data: ${JSON.stringify({ type: 'agent', agent: { id: targetAgentId, name: agent.name, avatar: agent.avatar, color: agent.color, product: agent.product } })}\n\n`
      ))

      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            return
          }
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              if (firstChunk) {
                firstChunk = false
              }
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`
              ))
            }
          } catch { /* skip malformed */ }
        }
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
