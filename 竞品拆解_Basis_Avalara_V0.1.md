# 竞品拆解：财税垂直领域 Agent 产品（Basis & Avalara）

> **目的**：用 WAIC 项目的 7 维度框架（岗位职责/Skill/工作流/工具权限/KPI/审计链路/业务交付物）拆解两家标杆公司，提炼可借鉴的产品设计与商业化思路。
> **版本**：V0.1（2026-05-25）
> **适用对象**：天歌/小畅，作为设计我们自己"合规小明"和"经营分析小明"的对标参考。

---

## 一、Basis（新晋独角兽，估值 $1.15B）

### 1.0 公司概要

| 项 | 值 |
|---|---|
| 成立 | 2023 年 4 月（纽约） |
| 估值 | $1.15B（2026-02 Series B） |
| 融资 | Seed $3.6M → A $34M (Khosla) → B $100M (Accel + GV) |
| 核心团队 | Mitchell Troyanovsky (CEO), Matthew Harpe; 顾问包括 Jeff Dean、Larry Summers、Noam Brown |
| 客户 | Wiss、Baker Tilly（Top 10 美国会计师事务所）等 |
| 定位 | "Agent OS for Accounting Firms" — 异步 Agent 协同网络替代事务所重复性工作 |

---

### 1.1 岗位职责（Job Definition）

Basis 内部不以"Agent 名字"对外品牌化（公开资料无 Galleon/First Mate），而是**按业务实践域划分 Agent 覆盖范围**：

| Agent 实践域 | 对标我们的 | 核心职责 |
|---|---|---|
| Client Accounting Services (CAS) / 记账 | 合规小明（记账子域） | 自动交易处理、日记账、对账、月结 |
| Tax（税务） | 合规小明（退税/申报子域） | 合伙制税务工作簿、技术税务备忘录撰写 |
| Audit & Assurance | 经营评估小明 (DE) | 审计工作流支持 |
| Advisory / CFO Services | 经营分析小明 (COA) | 管理报告、预算预测、Post-Close Analysis |

**借鉴点**：Basis 把 Agent 按"事务所部门"划分，而非按"技术动作"。我们的"小明"按"跨境岗位角色"划分，逻辑一致。

---

### 1.2 Skill（能力原子）

| Basis 能力 | 我们的对标 Skill | 备注 |
|---|---|---|
| 多步 LLM 链式推理（DSPy 风格：Planning → Solving → Selecting） | 各小明的推理 Skill（如 CMP-Skill-01 归类推理） | Basis 把"世界上下文"和"目标规约"分离 |
| 异步长时任务执行（数小时级） | 我们当前未覆盖（单次 ≤5 分钟） | ⚠️ 我们在 V1.0 可借鉴：批量退税申报可跑 1h |
| 跨系统 RPA 登录操作 | CMP-Skill-07 (CTAIS 提交) | Basis 登录 QuickBooks/Xero 执行操作 |
| 自动对账（Multi-Source Reconciliation） | CMP-Skill-03 (四单对碰) | 本质相同 |
| 税务备忘录生成（Legal Memo Writing） | CMP-Skill-06 (审计底稿) | Basis 更重法律推理深度 |
| Bug 自动定位 (Clueso Agent) | 我们的工程内部工具，非业务 Agent | |

**六层上下文金字塔（Basis 工程架构）**：
1. Root AGENTS.md（~300行全局规则）
2. 嵌套 AGENTS.md（100+ 目录级规则）
3. Skills（可复用知识包）
4. Sub-agent Roles（.agents/roles/）
5. 统一 MCP Server（Linear/Slack/DB）
6. 自动化测试（Ruff/Pyright/ESLint）

**借鉴点**：我们也应设计"层级化 Prompt 上下文"——全局约束 → 岗位约束 → 场景约束 → 工具约束。

---

### 1.3 工作流

Basis 核心设计原则与我们的步骤经济性对照：

| Basis 原则 | 我们的对标 |
|---|---|
| Canonicality（每个 artifact 是唯一真相源） | 审计链路的"单一数据源"要求 |
| Localization（上下文就近放置） | 各小明的 Skill 嵌入式知识库 |
| Verifiability（Agent 自验证） | 我们的 HITL 节点 + 审计点 |
| Interoperability（多模型厂商可切） | 我们当前锁定单一 LLM ⚠️ |
| Default-no（新上下文需证明价值） | 步骤经济性的"每步需回答做/省/留" |

**关键差异**：Basis 允许 Agent 运行**数小时**（异步），我们的场景限制在 **4 分钟演示 / 30 分钟实操**。这是产品形态差异：Basis = 后台"数字雇员"，我们 = 前台"决策辅助 + 半自动执行"。

---

### 1.4 工具权限

| 权限类型 | Basis | 我们 |
|---|---|---|
| R（读取） | 全量——登录 QuickBooks/Xero/ERP 读数 | API 对接 Amazon/Shopify/ERP |
| W（写入） | 日记账、对账结果、税务工作簿 | Vault 写入、看板刷新 |
| X（执行） | 直接在客户系统中执行交易确认 | 需 HITL 前置签字（X 权限） |

**借鉴点**：Basis 的 X 权限更激进（直接执行），但面向会计师事务所（内部信任链长）；我们面向跨境电商客户（信任链短），HITL 前置是正确选择。

---

### 1.5 KPI

| Basis 公开指标 | 我们的对标 |
|---|---|
| Clueso：78% Bug 一次解决率 | — |
| 复杂支持响应时间 -50% | 处置方案生成时长 |
| 工程师 commit 速度 2.5x | — |
| Token 用量/工程师 5x ↑ | 步骤经济性（控制 token 成本）|

**借鉴点**：Basis 把"AI 用量 ↑"作为正面指标（因为它卖给事务所用），我们把"步骤 ↓"作为正面指标（因为我们要控客户成本）。两种视角都合理，取决于谁付费。

---

### 1.6 审计链路

Basis 的 Clueso Agent 日志设计：
- 保存工具调用结果到本地文件，对抗上下文压缩
- 维护"研究者风格日志"：假设 → 排除 → 证据 → 下一步
- 完整操作回放能力

**借鉴点**：我们的 Audit Log Service + Compliance Vault 设计与此一致，但可学习"假设-证据-排除"的结构化推理日志格式。

---

### 1.7 商业化模式

| 模式 | 细节 |
|---|---|
| 定价 | 不公开；Request-Access + 事务所级合同 |
| 推测模式 | Per-Agent Subscription（虚拟员工月费）+ Usage-Based（处理客户账套数/税务备忘录篇数） |
| GTM | "Deployed Intelligence" 团队驻场事务所做变革管理 |
| 对我们的启示 | 我们可以"按小明席位订阅 + 按申报单量/异常处理量阶梯计费" |

---

## 二、Avalara（税务合规巨头，Vista $8.4B 私有化）

### 2.0 公司概要

| 项 | 值 |
|---|---|
| 成立 | 2004 年（西雅图） |
| 规模 | 41,000+ 客户 / 54B+ API 年调用 / 4,700 员工 / 190+ 国家 |
| 私有化 | 2022 年 Vista Equity Partners $8.4B 收购 |
| 定位 | "Agentic Tax and Compliance™" — 从计算 API 进化为自主合规操作系统 |

---

### 2.1 岗位职责

Avalara 没有拟人化的"AI 员工"品牌，而是按**合规能力域**划分 Agent 产品：

| Agent / 产品 | 对标我们的 | 核心职责 |
|---|---|---|
| AvaTax（实时税率计算引擎） | CMP-Skill-04 (退税率匹配) | 12,000+ 美国辖区 + 190 国实时税率计算 |
| Avalara Returns Agent | CMP-Skill-05 (申报包生成) | 端到端申报准备 → 提交 → 缴款 |
| Item Classification AI | CMP-Skill-01 (HS 编码归类) | 产品税码自动归类 |
| Tariff Code Classification | CMP-Skill-01 (HS 编码归类) | 180+ 国 HS/HTS 编码分配 + 260 名人工分类师 |
| ECM/CertCapture | 合规小明（豁免管理子域） | 免税证书采集/验证/存储/审计 |
| E-Invoicing | — | 多国电子发票合规 + Peppol |
| Cross-Border (Landed Cost) | CMP-Skill-04 + 物流小明成本计算 | 关税+进口税实时计算 |
| AvaTax for AP | — | 采购端消费税合规 |

---

### 2.2 Skill（核心技术能力）

| Avalara 能力 | 技术亮点 | 我们可借鉴 |
|---|---|---|
| ALFA（AI Foundry） | 40+ AI 模型 + 60,000 数据源 + 训练于数十亿真实交易 | 我们的知识库更新（CMP-Skill-09）可对标 ALFA 数据层 |
| 地址验证 → 辖区映射 | 屋顶级 lat/long 精度确定税区 | 我们可在物流小明增加"关区自动映射" |
| MCP Server（开发者） | AI Agent 可直接调用 Avalara API | 我们的 MCP 集成设计可参考 |
| A2A（Agent-to-Agent 协议） | 第三方 Agent 可直接消费 Avalara 合规能力 | 对标我们的跨 Agent 协同总线设计 |
| 260 名人工分类师 | AI 低置信度时回退人工 | = 我们的 HITL-1（低置信度归类确认卡）|

---

### 2.3 工作流

Avalara 的 Observe → Advise → Execute 框架：

| 阶段 | 对应动作 | 对标我们 |
|---|---|---|
| **Observe** | 监听 ERP/POS/电商系统中的交易事件 | Step 1 数据采集 |
| **Advise** | 计算税率、归类、判断合规要求 | Step 2 对碰&计算 |
| **Execute** | 自动提交申报、生成证书、发送电子发票 | Step 3 封装&提交 |

**与我们的步骤经济性对比**：Avalara 也是 **3 阶段**——Observe/Advise/Execute 天然契合我们压缩后的 3 步工作流。

---

### 2.4 工具权限

| 权限 | Avalara 实现 |
|---|---|
| R | 连接 1,400+ 平台读取交易数据（Shopify/SAP/Oracle/NetSuite…） |
| W | 写入申报结果、证书状态、税率计算结果 |
| X | 自动提交申报到税务机关 + 自动缴款（高信任度模式） |

**关键差异**：Avalara 的 X 权限是**全自动**（无 HITL），因为：
1. 计算引擎是确定性的（不是 LLM 推理）
2. 覆盖的是 Sales Tax（金额小、频次高）
3. 已有 20 年 track record

对我们的启示：合规小明的 X 权限可以分层——高置信度 + 低金额 → 自动执行；低置信度 / 高金额 → HITL。

---

### 2.5 KPI

| Avalara 指标 | 数值 | 对标我们 |
|---|---|---|
| API 可用性 | 99.999% uptime | 系统可用性 SLA |
| 年 API 调用量 | 54B+ | — |
| 年申报单量 | 6M+ | 申报包处理量 |
| 免税证书管理量 | 31M+ | — |
| Cyber Week 峰值 | 999.5M API 调用/周 | 峰值处理能力 |

---

### 2.6 审计链路

| 层次 | 机制 |
|---|---|
| 交易级 | 每笔 API 调用返回完整计算明细（税区/税率/规则引用） |
| 申报级 | 申报包含完整 Transaction → Return 审计追踪 |
| 证书级 | ECM 存储原始证书影像 + 验证时间戳 |
| 合规认证 | ISO 27001 + SOC 2 Type II |

---

### 2.7 商业化模式

| 模式 | 描述 |
|---|---|
| **平台费** | 按模块年订阅（AvaTax / Returns / ECM 分开计费） |
| **交易抽成** | 按 API 调用次数 / 报税单量阶梯计费 |
| **混合定价** | 基础平台费 + 变量消耗抽成 |
| **免费入口** | 开发者免费层：5 单/分钟，1,000 单/天 |
| **SST 补贴** | 25 个州的 Streamlined Sales Tax 计划由州政府买单 |
| **对我们的启示** | 可设计"平台接入费（含基础 Skill 调用额度）+ 超额按量阶梯"模式 |

---

## 三、对我们项目的关键启示

### 3.1 产品设计

| 维度 | Basis 启示 | Avalara 启示 | 我们的行动项 |
|---|---|---|---|
| Agent 划分 | 按业务实践域（CAS/Tax/Audit/Advisory） | 按合规能力域（Calculate/File/Classify/Certify） | 维持"按岗位角色"划分，但内部能力可参考 Avalara 的"能力域"解耦 |
| 步骤设计 | 允许异步长时（小时级） | 3 阶段（Observe/Advise/Execute） | V0.1 保持 3 步；V1.0 可加"后台异步长任务"模式 |
| HITL | 关键决策点协作 | 几乎无 HITL（确定性计算） | 按置信度/金额分层：高信任自动、低信任 HITL |
| 工具集成 | 多系统 RPA 登录 | 1,400+ 标准 API 集成 | 优先走 API（成本低/可审计）；API 不可用时 RPA 兜底 |
| 知识库 | 六层上下文金字塔 | ALFA（40+ 模型 + 60K 数据源） | 设计"全局→岗位→场景→工具"四层上下文 |

### 3.2 商业化

| 模式 | 适用场景 | 对我们的映射 |
|---|---|---|
| Per-Agent 订阅 | 事务所/企业长期雇佣 | "合规小明月费 ¥X / 物流小明月费 ¥Y" |
| 按量阶梯 | 高频低价交易 | "¥Z/千次 API 调用 or ¥W/申报单" |
| 平台费+变量 | 中大型客户 | "基础平台 ¥A/月 含 N 次调用，超额 ¥B/次" |
| 驻场服务 | 大客户变革管理 | "Deployed Intelligence"模式 → 我们 V1.0 的"驻场数字顾问"？ |
| 免费入口 | 开发者/试用 | "免费体验 50 笔/月" |

### 3.3 技术架构

| 可借鉴 | 说明 | 优先级 |
|---|---|---|
| MCP Server | 让外部 AI Agent 可调用我们的合规/物流能力 | V1.0 |
| A2A 协议 | 跨平台 Agent 互操作 | V2.0 |
| DSPy 链式推理 | Planning → Solving → Selecting 分离 | V0.5 可试验 |
| 多模型切换 | 不锁定单一 LLM 厂商 | 架构设计原则 |
| 自验证 Agent | Agent 运行后自动 diff-test | V1.0 |

---

## 四、与我们"小明"的一句话定位对比

| 产品 | 一句话 |
|---|---|
| **Basis** | "会计师事务所的异步数字雇员——替你做完再让你审" |
| **Avalara** | "嵌入式合规计算引擎——交易发生的瞬间自动合规" |
| **我们的合规小明** | "跨境电商的合规决策辅助员——帮你看清风险、准备好材料、等你拍板再提交" |
| **我们的物流小明** | "跨境电商的供应链危机响应员——帮你发现问题、测算影响、推荐方案、等你拍板再执行" |

核心差异：Basis = 后台全自动；Avalara = 嵌入式计算；**我们 = 前台辅助+半自动执行**。这是由客户类型（跨境电商中小卖家 vs 大型事务所/企业）和信任建立阶段（V0.1 初创期需赢得信任）决定的。

---

## 附录：数据来源

- Basis: 官网 getbasis.ai、工程博客、OpenAI 客户案例、Forbes/Bloomberg 报道、AngelList 融资记录
- Avalara: 官网 avalara.com、开发者文档 developer.avalara.com、NEXT 2026 开发者大会议题、产品发布博客
- 行业分析：Gartner IDP Magic Quadrant 2025、Forrester Wave Document Mining 2024
