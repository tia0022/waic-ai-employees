// Full scripted WAIC demo scenes — ported from waic-demo.html

export interface SceneMessage {
  cls: string
  av: string
  sender: string
  delay: number
  html: string
}

export interface SceneCard {
  cls: string
  icon: string
  title: string
  badge: string
  body: string
}

export interface Scene {
  id: number
  pct: number
  label: string
  shortLabel: string
  agentLabel: string
  agentColor: string
  journey: number[]
  agents: string[]
  chips: string[]
  hStatus: string
  msgs: SceneMessage[]
  cards: SceneCard[]
}

export const SCENES: Scene[] = [
  {
    id: 0, pct: 8, label: '解析经营目标…', shortLabel: '任务分发', agentLabel: '跨赋大模型', agentColor: '#6366f1',
    journey: [], agents: [], chips: [],
    hStatus: '任务分发中',
    msgs: [
      { cls: 'user', av: '你', sender: '经营者', delay: 0,
        html: '帮我把 <strong>景德镇手工茶杯</strong> 完美交付到 <strong>洛杉矶 C 端买家</strong>，全链路合规，T+180s 出净利润核算。' },
      { cls: 'orch', av: '跨', sender: '跨赋 · 跨境服务大模型', delay: 1100,
        html: '指令解析完成。调用<strong>明心跨境服务大模型</strong>，正在拆分任务包并分发至各 AI 员工…<br><br><div style="display:flex;flex-direction:column;gap:5px;margin-top:6px"><div style="display:flex;gap:8px;align-items:center"><span style="color:#00c9a7;font-size:11px;font-weight:700">经营评估小明</span><span style="font-size:10px;color:#64748b">产融方案Agent · 财务分析Agent</span><span style="font-size:9px;background:rgba(0,201,167,0.15);color:#00c9a7;padding:1px 5px;border-radius:3px">ACTIVE</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#f97316;font-size:11px;font-weight:700">达人营销小明</span><span style="font-size:10px;color:#64748b">达人匹配Agent · 视频Agent · 文案Agent</span><span style="font-size:9px;background:rgba(249,115,22,0.15);color:#f97316;padding:1px 5px;border-radius:3px">ACTIVE</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#f59e0b;font-size:11px;font-weight:700">合规小明</span><span style="font-size:10px;color:#64748b">商品归类Agent · 智能退税Agent</span><span style="font-size:9px;background:rgba(245,158,11,0.15);color:#f59e0b;padding:1px 5px;border-radius:3px">ACTIVE</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#38bdf8;font-size:11px;font-weight:700">物流小明</span><span style="font-size:10px;color:#64748b">物流线路Agent · 运踪GPT</span><span style="font-size:9px;background:rgba(56,189,248,0.12);color:#64748b;padding:1px 5px;border-radius:3px">STANDBY</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#a78bfa;font-size:11px;font-weight:700">分析师小明</span><span style="font-size:10px;color:#64748b">财务分析Agent · 全链路成本核算</span><span style="font-size:9px;background:rgba(167,139,250,0.12);color:#64748b;padding:1px 5px;border-radius:3px">STANDBY</span></div></div>' }
    ],
    cards: []
  },
  {
    id: 1, pct: 22, label: '供应链采购 · 景德镇端', shortLabel: '供应链', agentLabel: '经营评估小明', agentColor: '#00c9a7',
    journey: [0], agents: ['supply'], chips: ['ch-supply'],
    hStatus: '经营评估小明 · 运行中',
    msgs: [
      { cls: 'supply', av: '评', sender: '经营评估小明  ·  产融方案Agent', delay: 0,
        html: '正在对接景德镇供货工厂物联网数据接口（<code>DE-交易云</code>）…<br><br>✅ <strong>SKU 数字建模完成</strong><br><code>JDZ-CUP-WHT-260ML</code> · 高白泥 · 净重 180g · 8×9cm<br>含铅量检测 <span style="background:rgba(0,201,167,0.15);color:#00c9a7;padding:1px 6px;border-radius:3px;font-size:10px">PASS</span> — 符合 FDA 21 CFR 109.16 标准<br><br>✅ <strong>防碎包装规格</strong>：双层气泡膜 + 纸盒内衬，跌落测试通过' },
      { cls: 'supply', av: '评', sender: '经营评估小明  ·  产融方案Agent', delay: 1900,
        html: '<code>DE-监测云</code> 检测到资金垫付缺口：本批次 500 只，工厂账期 30 天，预计缺口 <strong>¥ 42,000</strong><br><br><div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:10px;margin-top:4px;display:flex;gap:8px;align-items:center"><span>🏦</span><span style="font-size:11px;flex:1">已将采购合同封装为数字信用资产，拟通过<strong>明心产融通道</strong>向合作银行申请贸易融资（合作贷款规模超1500亿元·零不良）</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:10px;padding:3px 8px;border-radius:5px;white-space:nowrap">✓ 已授权</span></div>' }
    ],
    cards: [
      { cls: 'dc-supply', icon: '📦', title: 'SKU 数字档案', badge: '经营评估',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">商品编号</span><span style="font-size:10px;font-weight:600">JDZ-CUP-WHT-260ML</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">含铅检测</span><span style="font-size:10px;color:#00c9a7;font-weight:600">PASS · FDA合规</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">物联采集</span><span style="font-size:10px;font-weight:600">DE-监测云 接入</span></div></div>' },
      { cls: 'dc-supply', icon: '💰', title: '贸易融资申请单', badge: '产融方案',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">缺口金额</span><span style="font-size:10px;font-weight:600">¥ 42,000</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">通道</span><span style="font-size:10px;font-weight:600">明心产融 · 总行直连</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">预计到账</span><span style="font-size:10px;color:#00c9a7;font-weight:600">T+4h</span></div></div>' }
    ]
  },
  {
    id: 2, pct: 40, label: '达人营销 · 洛杉矶端', shortLabel: '达人营销', agentLabel: '达人营销小明', agentColor: '#f97316',
    journey: [0, 4], agents: ['mkt', 'comp'], chips: ['ch-mkt'],
    hStatus: '达人营销 + 合规 · 并行',
    msgs: [
      { cls: 'mkt', av: '营', sender: '达人营销小明  ·  达人匹配Agent', delay: 0,
        html: '正在扫描 TikTok & Instagram 达人数据库，筛选条件：<code>美学生活 · 禅意茶道 · 手工艺</code> · 洛杉矶本土 · 粉丝 1w-50w…<br><br><strong>命中 17 位精准达人</strong>，Top-3 预览：<br><div style="display:flex;flex-direction:column;gap:4px;margin-top:6px"><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px">@zen.teahouse.la</span><span style="font-size:10px;color:#64748b">28.4w粉 · 互动率 6.2%</span><span style="background:rgba(249,115,22,0.15);color:#f97316;font-size:9px;padding:1px 5px;border-radius:3px">TOP</span></div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px">@artisan.lifestyle</span><span style="font-size:10px;color:#64748b">12.1w粉 · 互动率 8.9%</span></div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px">@la.ceramics.daily</span><span style="font-size:10px;color:#64748b">9.6w粉 · 互动率 11.2%</span></div></div>' },
      { cls: 'mkt', av: '营', sender: '达人营销小明  ·  文案Agent + 视频Agent', delay: 1700,
        html: '✅ <strong>文案Agent</strong> 已生成英文个性化 Brief，强调景德镇非遗工艺叙事<br>✅ <strong>视频Agent</strong> 已生成 TikTok 短视频脚本（60s）：禅意东方·手工烧制·跨越太平洋<br>✅ Shopify Listing 已生成，突出"千年瓷都·Song Dynasty Glaze"文化卖点<br><br><div style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:8px;padding:10px;display:flex;gap:8px;align-items:center"><span>🔒</span><span style="font-size:11px;flex:1">3 位达人已接受样品邀约，写入<strong>品牌中央资产库</strong>全局锁定，防止内部撞单</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:10px;padding:3px 8px;border-radius:5px;white-space:nowrap">✓ 已锁定</span></div>' }
    ],
    cards: [
      { cls: 'dc-mkt', icon: '📱', title: '达人匹配报告', badge: '达人营销',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">命中达人</span><span style="font-size:10px;font-weight:600">17 位</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">预计触达</span><span style="font-size:10px;font-weight:600">50w+ UV</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">平均互动率</span><span style="font-size:10px;color:#f97316;font-weight:600">8.8%</span></div></div>' },
      { cls: 'dc-mkt', icon: '🛍', title: 'Shopify Listing 草稿', badge: '文案Agent',
        body: '<div style="font-size:10px;color:#94a3b8;line-height:1.6">标题：Jingdezhen Hand-Thrown Tea Cup · Song Dynasty Glaze · Limited Edition<br><span style="color:#f97316">状态：待审核发布</span></div>' }
    ]
  },
  {
    id: 3, pct: 60, label: '报关清关 · 跨国合规', shortLabel: '报关合规', agentLabel: '合规审计小明', agentColor: '#f59e0b',
    journey: [0, 1, 3], agents: ['comp'], chips: ['ch-comp'],
    hStatus: '合规小明 · 三步法执行中',
    msgs: [
      { cls: 'comp', av: '规', sender: '合规小明  ·  商品归类Agent', delay: 0,
        html: '<strong>Step 1</strong> — AI智能归类：<code>6912.00</code>（陶瓷餐具·非骨瓷），<span style="background:rgba(245,158,11,0.15);color:#f59e0b;padding:1px 6px;border-radius:3px;font-size:10px">出口退税率 13%</span>，规避错报风险 ✅<br><br><strong>Step 2</strong> — AI退税"四单对碰"（明心疑点核查Agent扫描 1000+ 风险点）：<br>订单 ✅ · 运单 ✅ · 支付单 ✅ · 发票 ✅<br>退税处理：<strong>最快当天申报当天到账</strong>（行业基准 3-5 工作日）<br><br><strong>Step 3</strong> — 申报包推送 CTAIS / 金税系统 ✅' },
      { cls: 'comp', av: '规', sender: '合规小明  ·  纳税申报Agent', delay: 1900,
        html: '<strong>美国清关预审</strong>（100% 中美海关数据覆盖）：<br><br><span style="color:#f87171">🔴 核心风险识别</span>：陶瓷接触食品器皿须通过 FDA 铅/镉溶出量测试<br>（Pb ≤ 2.5μg/mL · Cd ≤ 0.25μg/mL）<br><br>✅ 前置核验 SGS 实验室报告：<span style="background:rgba(0,201,167,0.15);color:#00c9a7;padding:1px 6px;border-radius:3px;font-size:10px">COMPLIANT</span><br>✅ 加州 Nexus 经济关联判定触发，<strong>Sales Tax 9.5%</strong> 自动计算并申报入账<br>✅ 买家个人数据传输合规：中国数据出境安全评估 + 加州 CCPA ✓' }
    ],
    cards: [
      { cls: 'dc-comp', icon: '📋', title: 'AI出口退税申报包', badge: '智能退税Agent',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">退税金额（预估）</span><span style="font-size:10px;font-weight:600">¥ 18,200</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">处理时长</span><span style="font-size:10px;color:#f59e0b;font-weight:600">当天到账（↓97%）</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">状态</span><span style="font-size:10px;font-weight:600">已推送 CTAIS</span></div></div>' },
      { cls: 'dc-comp', icon: '🇺🇸', title: 'FDA 清关预审报告', badge: '合规小明',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">铅溶出</span><span style="font-size:10px;color:#00c9a7;font-weight:600">0.18μg/mL · PASS</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">镉溶出</span><span style="font-size:10px;color:#00c9a7;font-weight:600">0.04μg/mL · PASS</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">加州 Sales Tax</span><span style="font-size:10px;font-weight:600">9.5% · 已申报</span></div></div>' }
    ]
  },
  {
    id: 4, pct: 78, label: '全球物流调度 · 异常熔断', shortLabel: '物流调度', agentLabel: '物流调度小明', agentColor: '#38bdf8',
    journey: [0, 1, 2, 3], agents: ['log'], chips: ['ch-log'],
    hStatus: '物流小明 · 运踪GPT监控中',
    msgs: [
      { cls: 'log', av: '物', sender: '物流小明  ·  物流线路Agent + 运踪GPT', delay: 0,
        html: '接入明心物流数据库（全球200+航司 · 50+船东 · 100%北美内陆点 · 北美60+港口）…<br><br>头程：景德镇 → 深圳盐田港，<strong>德邦快运</strong>，次日达 ✅<br>干线：盐田 → 洛杉矶港，<strong>ONE海运·美西快线</strong>，预计 13 天 ✅<br>尾程：LA海外仓 → 买家公寓，<strong>USPS Priority</strong>，T+2 ✅<br><br>运踪GPT 实时监控 500+ 承运商轨迹，当前状态：<span style="background:rgba(0,201,167,0.12);color:#00c9a7;padding:1px 6px;border-radius:3px;font-size:10px">正常</span>' },
      { cls: 'log', av: '物', sender: '物流小明  ·  运力资源Agent', delay: 1700,
        html: '<div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);border-radius:8px;padding:10px;margin-bottom:10px"><div style="color:#f87171;font-size:11px;font-weight:700;margin-bottom:4px">🚨 异常预警 — 洛杉矶港工人罢工风险（T+7d）</div><div style="font-size:10px;color:#94a3b8">情报来源：LGB 码头工会谈判破裂，预计影响 14 天，波及 60% 海运货物。已调取 47 种非标知识库。</div></div><div style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.2);border-radius:8px;padding:10px;display:flex;gap:8px;align-items:center"><span>✈️</span><span style="font-size:11px;flex:1">建议 T+48h 内切换<strong>广州→LA 空运直飞</strong>。空运溢价 $12/kg，净利润仍为正，时效 13天→4天</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:10px;padding:3px 8px;border-radius:5px;white-space:nowrap">✓ 已切换</span></div>' }
    ],
    cards: [
      { cls: 'dc-log', icon: '🛳', title: '全链路物流追踪面板', badge: '运踪GPT',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">当前节点</span><span style="font-size:10px;font-weight:600">深圳盐田港·待装船</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">预计到港</span><span style="font-size:10px;font-weight:600">6月7日</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">异常预警</span><span style="font-size:10px;color:#f87171;font-weight:600">LGB港罢工风险</span></div></div>' },
      { cls: 'dc-log', icon: '📊', title: '空海运切换 ROI 决策单', badge: '运力资源Agent',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">空运溢价</span><span style="font-size:10px;font-weight:600">$12/kg (+¥320)</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">时效</span><span style="font-size:10px;color:#38bdf8;font-weight:600">13天→4天</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">净利润影响</span><span style="font-size:10px;color:#00c9a7;font-weight:600">仍为正 ✓</span></div></div>' }
    ]
  },
  {
    id: 5, pct: 95, label: '经营核算 · T+180s 出单', shortLabel: '经营核算', agentLabel: '分析师小明', agentColor: '#a78bfa',
    journey: [0, 1, 2, 3, 4], agents: ['ana'], chips: ['ch-ana'],
    hStatus: '分析师小明 · T+180s 核算中',
    msgs: [
      { cls: 'ana', av: '析', sender: '分析师小明  ·  财务分析Agent', delay: 0,
        html: '全链路数据收口完成，开始净利润核算…<br><br><div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:8px;padding:12px"><div style="font-size:11px;font-weight:700;color:#a78bfa;margin-bottom:8px">📈 景德镇茶杯 · 单件盈利拆解（LA售价 $68 · 约 ¥490）</div><div style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">出厂成本</span><span style="font-size:10px">¥ 120</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">头程物流（德邦）</span><span style="font-size:10px">¥ 18</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">空运干线（广州→LA）</span><span style="font-size:10px">¥ 52</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">尾程派送（USPS）</span><span style="font-size:10px">¥ 38</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">TikTok 广告公耗</span><span style="font-size:10px">¥ 45</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">加州 Sales Tax (9.5%)</span><span style="font-size:10px">¥ 47</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">跨国汇损 (1.2%)</span><span style="font-size:10px">¥ 6</span></div><div style="display:flex;justify-content:space-between;border-top:1px solid rgba(167,139,250,0.2);margin-top:4px;padding-top:6px"><span style="font-size:12px;font-weight:700;color:#a78bfa">净利润</span><span style="font-size:12px;font-weight:800;color:#00c9a7">¥ 164 · 利润率 33.5%</span></div></div></div>' },
      { cls: 'ana', av: '析', sender: '分析师小明  ·  今日行动清单', delay: 1900,
        html: '⚡ <strong>今日行动清单</strong>（T+180s 弹出）：<br><br><div style="display:flex;flex-direction:column;gap:5px;margin-top:4px"><div style="display:flex;gap:6px"><span style="color:#a78bfa;flex-shrink:0">①</span><span style="font-size:11px;color:#94a3b8">建议加购 <strong>200 只备货</strong>至美西海外仓，Black Friday 缓冲库存</span></div><div style="display:flex;gap:6px"><span style="color:#a78bfa;flex-shrink:0">②</span><span style="font-size:11px;color:#94a3b8">@zen.teahouse.la 接样后提升 Spark Ads 预算 <strong>+¥3,000/天</strong></span></div><div style="display:flex;gap:6px"><span style="color:#a78bfa;flex-shrink:0">③</span><span style="font-size:11px;color:#94a3b8">本批次退税 ¥18,200 预计当天到账，可滚动投入下批次采购</span></div><div style="display:flex;gap:6px"><span style="color:#a78bfa;flex-shrink:0">④</span><span style="font-size:11px;color:#94a3b8">产融授信剩余额度 70%，可承接下一批次</span></div></div>' },
      { cls: 'vault', av: '链', sender: '明心合规存证 · Compliance Vault', delay: 3400,
        html: '✅ 本次全链路存证完成，以下单据已附唯一哈希值写入 Compliance Vault：<br><br><code>报关单</code> · <code>FDA报告</code> · <code>银行流水</code> · <code>退税申报包</code> · <code>AI决策快照×5</code><br><br><div style="background:rgba(52,211,153,0.05);border:1px solid rgba(52,211,153,0.15);border-radius:6px;padding:8px;margin-top:8px;font-family:monospace;font-size:10px;color:#34d399;word-break:break-all">SHA-256: a3f7c2e8d1b04592f6...f9e6a1c3 · Block #8,847,291<br>存证时间: 2026-05-25 11:28:54 UTC · 不可篡改</div><br><span style="font-size:11px;color:#34d399">审计可追溯率 100% · 大模型决策幻觉风险归零</span>' }
    ],
    cards: [
      { cls: 'dc-ana', icon: '💰', title: '单品净利润核算', badge: '分析师小明',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">售价</span><span style="font-size:10px;font-weight:600">$68 (¥490)</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">全链路成本</span><span style="font-size:10px;font-weight:600">¥ 326</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">净利润</span><span style="font-size:14px;color:#00c9a7;font-weight:800">¥ 164 · 33.5%</span></div></div>' },
      { cls: 'dc-ana', icon: '📋', title: '今日行动清单', badge: '分析师小明',
        body: '<div style="font-size:10px;color:#94a3b8;line-height:1.7">① 加购200只备货至LA仓<br>② Spark Ads预算 +¥3k/d<br>③ 退税当天到账·滚动复投<br>④ 产融额度充足·下批可启</div>' },
      { cls: 'dc-vault', icon: '🔐', title: 'Compliance Vault 存证', badge: '白盒存证',
        body: '<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">存证文件数</span><span style="font-size:10px;font-weight:600">9 份</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">可审计率</span><span style="font-size:10px;color:#34d399;font-weight:600">100%</span></div><div style="font-family:monospace;font-size:9px;color:#34d399;background:rgba(52,211,153,0.05);padding:3px 5px;border-radius:3px;margin-top:2px;word-break:break-all">a3f7c2e8d1b04592...f9e6a1c3</div></div>' }
    ]
  },
  {
    id: 6, pct: 100, label: '全链路交付完成 ✓', shortLabel: '全部完成', agentLabel: '全员', agentColor: '#34d399',
    journey: [0, 1, 2, 3, 4], agents: [], chips: [],
    hStatus: '全链路完成 · 明心跨赋',
    msgs: [
      { cls: 'orch', av: '跨', sender: '跨赋 · 跨境服务大模型', delay: 0,
        html: '✅ <strong>全链路任务完成</strong>，5位AI员工协同完成一只景德镇茶杯的全球商业旅程：<div style="display:flex;flex-direction:column;gap:5px;margin-top:10px"><div style="display:flex;gap:8px;align-items:center"><span style="color:#00c9a7;font-size:11px;font-weight:700">经营评估小明</span><span style="font-size:10px;color:#64748b">SKU建模 · 质检 · 产融融资授信</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:9px;padding:1px 5px;border-radius:3px">✓</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#f97316;font-size:11px;font-weight:700">达人营销小明</span><span style="font-size:10px;color:#64748b">17位达人建联 · Listing · TikTok脚本</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:9px;padding:1px 5px;border-radius:3px">✓</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#f59e0b;font-size:11px;font-weight:700">合规小明</span><span style="font-size:10px;color:#64748b">退税当天到账 · FDA通关 · Sales Tax</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:9px;padding:1px 5px;border-radius:3px">✓</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#38bdf8;font-size:11px;font-weight:700">物流小明</span><span style="font-size:10px;color:#64748b">港口罢工熔断 · 空运切换ROI决策</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:9px;padding:1px 5px;border-radius:3px">✓</span></div><div style="display:flex;gap:8px;align-items:center"><span style="color:#a78bfa;font-size:11px;font-weight:700">分析师小明</span><span style="font-size:10px;color:#64748b">净利¥164 · 今日行动清单 · 全链存证</span><span style="background:rgba(0,201,167,0.15);color:#00c9a7;font-size:9px;padding:1px 5px;border-radius:3px">✓</span></div></div><br><span style="color:#64748b;font-size:10px">明心数智 · 创建共信产业生态 · AI赋能产业出海</span>' }
    ],
    cards: []
  }
]
