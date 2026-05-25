'use client'
import { useState, useMemo, useEffect, useRef } from 'react'

interface CostItem { label: string; value: number; color: string; editable?: boolean }

// Animated number hook
function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = useState(target)
  const start = useRef(target)
  const startTime = useRef<number | null>(null)
  const prev = useRef(target)

  useEffect(() => {
    if (target === prev.current) return
    start.current = prev.current
    startTime.current = null
    prev.current = target

    const animate = (now: number) => {
      if (!startTime.current) startTime.current = now
      const elapsed = now - startTime.current
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setDisplay(Math.round(start.current + (target - start.current) * ease))
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return display
}

export default function ProfitCalc() {
  const [salePrice, setSalePrice] = useState(68)  // USD
  const [factoryCost, setFactoryCost] = useState(120)  // CNY
  const [freightType, setFreightType] = useState<'sea' | 'air'>('sea')
  const [adSpend, setAdSpend] = useState(45)  // CNY per unit
  const [exchangeRate, setExchangeRate] = useState(7.2)  // CNY/USD
  const [warehouseCity, setWarehouseCity] = useState<'LA' | 'NY'>('LA')

  // Fixed costs by scenario
  const headFreight = freightType === 'sea' ? 18 : 42      // CNY
  const mainFreight = freightType === 'sea' ? 38 : 84      // CNY  
  const lastMile = warehouseCity === 'LA' ? 25 : 32        // CNY
  const salesTaxRate = warehouseCity === 'LA' ? 0.095 : 0.088

  const saleCNY = useMemo(() => salePrice * exchangeRate, [salePrice, exchangeRate])
  const salesTax = useMemo(() => saleCNY * salesTaxRate, [saleCNY, salesTaxRate])
  const fxLoss = useMemo(() => saleCNY * 0.012, [saleCNY])
  const platformFee = useMemo(() => saleCNY * 0.03, [saleCNY]) // TikTok ~3%
  const totalCost = useMemo(() =>
    factoryCost + headFreight + mainFreight + lastMile + adSpend + salesTax + fxLoss + platformFee,
    [factoryCost, headFreight, mainFreight, lastMile, adSpend, salesTax, fxLoss, platformFee]
  )
  const netProfit = useMemo(() => saleCNY - totalCost, [saleCNY, totalCost])
  const margin = useMemo(() => saleCNY > 0 ? (netProfit / saleCNY) * 100 : 0, [netProfit, saleCNY])

  const animProfit = useAnimatedNumber(Math.round(netProfit))
  const animMargin = useAnimatedNumber(Math.round(margin * 10) / 10)
  const animSaleCNY = useAnimatedNumber(Math.round(saleCNY))

  const profitColor = netProfit > 0 ? '#00c9a7' : netProfit > -20 ? '#f59e0b' : '#f87171'

  const COST_ITEMS: CostItem[] = [
    { label: '出厂成本', value: factoryCost, color: '#64748b' },
    { label: freightType === 'sea' ? '头程（德邦）' : '头程（德邦）', value: headFreight, color: '#64748b' },
    { label: freightType === 'sea' ? '海运干线' : '空运干线', value: mainFreight, color: '#38bdf8' },
    { label: '尾程派送（USPS）', value: lastMile, color: '#64748b' },
    { label: 'TikTok广告公耗', value: adSpend, color: '#f97316' },
    { label: `加州 Sales Tax (${(salesTaxRate * 100).toFixed(1)}%)`, value: Math.round(salesTax), color: '#f59e0b' },
    { label: '跨国汇损 (1.2%)', value: Math.round(fxLoss), color: '#64748b' },
    { label: 'TikTok平台佣金 (3%)', value: Math.round(platformFee), color: '#64748b' },
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      {/* Title */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>实时利润核算</div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>T+180s · 内部分析师小明</div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <InputRow label="洛杉矶售价 (USD)" value={salePrice} onChange={setSalePrice} min={10} max={500} step={1}
          suffix="$" hint={`≈ ¥${animSaleCNY}`} />

        <InputRow label="出厂成本 (CNY)" value={factoryCost} onChange={setFactoryCost} min={10} max={1000} step={5}
          suffix="¥" />

        <InputRow label="TikTok广告/件 (CNY)" value={adSpend} onChange={setAdSpend} min={0} max={200} step={5}
          suffix="¥" />

        <InputRow label="汇率 (CNY/USD)" value={exchangeRate} onChange={setExchangeRate} min={6} max={8} step={0.05}
          suffix="" isFloat />

        {/* Freight toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: 'var(--muted)' }}>运输方式</label>
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 6, padding: 2, gap: 2 }}>
            {(['sea', 'air'] as const).map(t => (
              <button key={t} onClick={() => setFreightType(t)} style={{
                flex: 1, padding: '4px 0', borderRadius: 4, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                background: freightType === t ? (t === 'sea' ? 'rgba(56,189,248,0.2)' : 'rgba(99,102,241,0.2)') : 'transparent',
                color: freightType === t ? (t === 'sea' ? '#38bdf8' : '#818cf8') : 'var(--muted)',
                transition: 'all 0.2s',
              }}>
                {t === 'sea' ? '🚢 海运 (13天)' : '✈️ 空运 (4天)'}
              </button>
            ))}
          </div>
          {freightType === 'air' && (
            <div style={{ fontSize: 9, color: '#f59e0b', background: 'rgba(245,158,11,0.08)',
              borderRadius: 4, padding: '3px 6px' }}>
              港口罢工应急模式 · 干线 +¥46/件
            </div>
          )}
        </div>

        {/* Destination toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: 'var(--muted)' }}>目标市场</label>
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 6, padding: 2, gap: 2 }}>
            {(['LA', 'NY'] as const).map(c => (
              <button key={c} onClick={() => setWarehouseCity(c)} style={{
                flex: 1, padding: '4px 0', borderRadius: 4, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                background: warehouseCity === c ? 'rgba(167,139,250,0.2)' : 'transparent',
                color: warehouseCity === c ? '#a78bfa' : 'var(--muted)',
                transition: 'all 0.2s',
              }}>
                {c === 'LA' ? '🌴 洛杉矶 (9.5%)' : '🗽 纽约 (8.8%)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>
          成本拆解
        </div>
        {COST_ITEMS.map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between',
            padding: '3px 0', borderBottom: '1px solid rgba(30,38,64,0.5)' }}>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{item.label}</span>
            <span style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>¥{item.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0 0', marginTop: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>总成本</span>
          <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>¥{Math.round(totalCost)}</span>
        </div>
      </div>

      {/* Net Profit display */}
      <div style={{
        background: netProfit > 0 ? 'rgba(0,201,167,0.06)' : 'rgba(248,113,113,0.06)',
        border: `1px solid ${profitColor}33`,
        borderRadius: 12, padding: 14, textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>单件净利润</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: profitColor, letterSpacing: -1 }}>
          {animProfit >= 0 ? '+' : ''}¥{animProfit}
        </div>
        <div style={{ fontSize: 12, color: profitColor, opacity: 0.8, marginTop: 2 }}>
          利润率 {animMargin}%
        </div>
        {netProfit > 0 && (
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>
            {netProfit > 100 ? '✓ 健康利润，建议扩大备货' : netProfit > 50 ? '⚡ 可接受，关注广告ROI' : '⚠️ 利润偏薄，建议优化运费'}
          </div>
        )}
      </div>

      {/* Action recommendations */}
      {netProfit > 0 && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', marginBottom: 7, letterSpacing: '0.5px' }}>
            今日行动清单 · 分析师小明
          </div>
          {[
            `加购 ${netProfit > 100 ? 300 : 150} 只至LA仓（ROI +${Math.round(netProfit / salePrice * 100 / 7)}%）`,
            `TikTok Spark Ads预算 ${adSpend > 60 ? '维持' : `上调至 ¥${adSpend + 15}/件`}`,
            `退税 ¥${Math.round(factoryCost * 0.13)} 预计当天到账，滚动复投`,
          ].map((action, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, padding: '3px 0', alignItems: 'flex-start' }}>
              <span style={{ color: '#a78bfa', fontSize: 10, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>{action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InputRow({ label, value, onChange, min, max, step, suffix, hint, isFloat }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step: number; suffix: string; hint?: string; isFloat?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</label>
        {hint && <span style={{ fontSize: 10, color: 'var(--supply)' }}>{hint}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(isFloat ? parseFloat(e.target.value) : parseInt(e.target.value))}
          style={{ flex: 1, accentColor: '#6366f1', height: 3 }} />
        <div style={{
          minWidth: 52, padding: '3px 6px', background: 'var(--bg3)',
          border: '1px solid var(--border)', borderRadius: 5,
          fontSize: 11, fontWeight: 700, color: 'var(--text)', textAlign: 'right',
        }}>
          {suffix}{isFloat ? value.toFixed(2) : value}
        </div>
      </div>
    </div>
  )
}
