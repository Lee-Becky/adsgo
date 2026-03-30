// ============================================================
// Dev Guide Content — Each module's real-data replacement guide
// 每个模块的完整开发指南：输入数据 → 处理逻辑 → 输出 → 真实数据替换步骤
// ============================================================

export const DEV_GUIDES = {
  statusBar: `
## Status Bar — 开发指南

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| campaigns | MOCK_CAMPAIGNS 数组 | adManagerV3/mockData.js | AdManagerV3 campaign 列表 API |
| kpiType | 'ROAS' | STATUS_BAR_DATA.kpiType (mediaPlan/mockData.js) | OptimizeGoals API: formData.marketGroups[0].kpiType |
| kpiTarget | 4.5 | STATUS_BAR_DATA.kpiTarget | OptimizeGoals API: formData.marketGroups[0].unifiedKPI |
| dailyBudget | 3500 | STATUS_BAR_DATA.dailyBudget | OptimizeGoals API: formData.marketGroups[0].unifiedBudget |

Mock 数据定义:
\`\`\`javascript
// mediaPlan/mockData.js
export const STATUS_BAR_DATA = {
  kpiType: 'ROAS',          // 'ROAS' | 'CPA'
  kpiTarget: 4.5,
  dailyBudget: 3500,
  // campaigns 直接 import from adManagerV3/mockData.js
}
\`\`\`

### 处理逻辑

**步骤 1: 从 campaigns 聚合 KPI 和 Spend**

\`\`\`javascript
// 只取 status === 'active' 的 campaign
const activeCampaigns = campaigns.filter(c => c.status === 'active')

// 今日总花费 = 所有 active campaign 的 todayMetrics.spend 之和
const todaySpend = activeCampaigns.reduce(
  (sum, c) => sum + c.todayMetrics.spend, 0
)
// 用 MOCK_CAMPAIGNS: 850 + 1800 + 2100 + 1200 = 5950
// 注意: mock 数据的 spend 之和可能大于 dailyBudget，
// 真实场景中系统会控制不超 dailyBudget，mock 阶段取 min(sum, dailyBudget)
const cappedSpend = Math.min(todaySpend, dailyBudget)

// 当前 KPI 值
if (kpiType === 'ROAS') {
  // ROAS = 总 revenue / 总 spend
  const totalRevenue = activeCampaigns.reduce(
    (sum, c) => sum + c.todayMetrics.revenue, 0
  )
  const totalSpend = activeCampaigns.reduce(
    (sum, c) => sum + c.todayMetrics.spend, 0
  )
  currentKPI = totalSpend > 0 ? (totalRevenue / totalSpend) : 0
  // 用 MOCK_CAMPAIGNS: (3200+4500+6800+4200) / (850+1800+2100+1200) = 18700/5950 = 3.14
}

if (kpiType === 'CPA') {
  // CPA = 总 spend / 总 conversion event count
  // conversion event 取 campaign 的 objective 对应字段:
  //   objective === 'Purchase' → todayMetrics.purchases
  //   objective === 'Traffic'  → todayMetrics.clicks
  //   其他 → todayMetrics.event1s
  const totalConversions = activeCampaigns.reduce((sum, c) => {
    if (c.objective === 'Purchase') return sum + c.todayMetrics.purchases
    if (c.objective === 'Traffic')  return sum + c.todayMetrics.clicks
    return sum + c.todayMetrics.event1s
  }, 0)
  const totalSpend = activeCampaigns.reduce(
    (sum, c) => sum + c.todayMetrics.spend, 0
  )
  currentKPI = totalConversions > 0 ? (totalSpend / totalConversions) : 0
}
\`\`\`

**步骤 2: 计算 KPI 达成率并判断阶段**

\`\`\`javascript
// KPI 达成率（0~1+，可能超过 1 表示超额达成）
// ROAS: 越高越好 → current / target
// CPA:  越低越好 → target / current
const kpiAchievement = kpiType === 'ROAS'
  ? (kpiTarget > 0 ? currentKPI / kpiTarget : 0)
  : (currentKPI > 0 ? kpiTarget / currentKPI : 0)
// 用 MOCK_CAMPAIGNS (ROAS): 3.14 / 4.5 = 0.698 → 69.8%

function getPhase(kpiAchievement) {
  if (kpiAchievement < 0.4)  return { id: 'exploring', label: 'Exploring' }
  if (kpiAchievement < 0.8)  return { id: 'optimizing', label: 'Optimizing' }
  return { id: 'scaling', label: 'Scaling' }
}
// 用 mock 数据: 0.698 → 'optimizing'

// 阶段可以双向变动：
// - 新发的 campaign 拉低整体 KPI → 可能从 Scaling 回退到 Optimizing
// - 整体效果提升 → 从 Exploring 升级到 Optimizing
\`\`\`

**步骤 3: 花费状态颜色**

\`\`\`javascript
const spendPercent = dailyBudget > 0 ? (cappedSpend / dailyBudget) : 0

const spendColor =
  spendPercent < 0.7  ? 'text-slate-600'   :  // 正常
  spendPercent < 0.9  ? 'text-amber-600'   :  // 接近上限
  'text-rose-600'                               // 已到上限
\`\`\`

**步骤 4: 提取 sparkline 数据（最近 7 天 KPI 趋势）**

\`\`\`javascript
// 输入: activeCampaigns 的 history 数组（每个 campaign 有 14 天历史数据）
// 处理: 按日期汇总所有 campaign 的 daily KPI

function buildKPITrend(activeCampaigns, kpiType) {
  const dailyMap = {}  // { '2026-03-20': { revenue, spend, conversions } }

  activeCampaigns.forEach(campaign => {
    campaign.history.forEach(day => {
      if (!dailyMap[day.date]) {
        dailyMap[day.date] = { revenue: 0, spend: 0, conversions: 0 }
      }
      dailyMap[day.date].revenue += day.revenue
      dailyMap[day.date].spend += day.spend
      if (campaign.objective === 'Purchase') dailyMap[day.date].conversions += day.purchases
      else if (campaign.objective === 'Traffic') dailyMap[day.date].conversions += day.clicks
      else dailyMap[day.date].conversions += day.event1s
    })
  })

  const sorted = Object.entries(dailyMap)
    .map(([date, data]) => ({
      date,
      kpiValue: kpiType === 'ROAS'
        ? (data.spend > 0 ? data.revenue / data.spend : 0)
        : (data.conversions > 0 ? data.spend / data.conversions : 0)
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)  // 最近 7 天

  return sorted  // [{ date, kpiValue }, ...]
}

const kpiTrend = buildKPITrend(activeCampaigns, kpiType)
// 输出示例: [{ date:'03-21', kpiValue:2.9 }, { date:'03-22', kpiValue:3.0 }, ...]
\`\`\`

### 输出

水平状态条，左侧文字信息 + 右侧 sparkline：

\`\`\`
┌───────────────────────────────────────────────────────────────┐
│ Optimizing (70%) · ROAS 3.1x → target 4.5x · $2,625/$3,500  │ ╱╲╱─╱
└───────────────────────────────────────────────────────────────┘  sparkline
\`\`\`

- 左侧: 阶段 \`\${phase.label} (\${Math.round(kpiAchievement * 100)}%)\` + KPI + Spend
- 右侧: Recharts \`<LineChart>\` 迷你图，宽 120px 高 32px，无坐标轴无标签
- sparkline 颜色: 趋势上升 → stroke-emerald-500，下降 → stroke-rose-500
- 趋势判断: kpiTrend[last].kpiValue > kpiTrend[0].kpiValue → 上升

KPI 格式化规则:
- ROAS: \`\${value.toFixed(1)}x → target \${target}x\`
- CPA: \`$\${value.toFixed(0)} → target $\${target}\`

### 真实数据替换步骤

1. 用真实 API 数据替换 STATUS_BAR_DATA 的 3 个字段 (kpiType, kpiTarget, dailyBudget)
2. 用真实 campaign 列表替换 MOCK_CAMPAIGNS
3. 处理逻辑和组件代码完全不变
`,

  planRoadmap: `
## The Plan (Roadmap) — 开发指南

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| currentPhaseId | 'optimizing' | 由 StatusBar.getPhase(kpiAchievement) 计算 | 同 Status Bar（取决于 KPI 数据） |
| PLAN_PHASES | 3 阶段静态数组 | mediaPlan/mockData.js | 产品定义的静态文案，不需要替换 |

PLAN_PHASES 定义:
\`\`\`javascript
export const PLAN_PHASES = [
  {
    id: 'exploring',
    label: 'Exploring',
    kpiRange: '0–40% of target',
    icon: 'Search',
    aiDoes: [
      'Sync ad performance data every hour',
      'Test audience segments and creative combinations',
      'Establish baseline metrics (CPA, ROAS, CTR)',
    ],
    youDo: [
      'Review initial ad performance',
      'Ensure tracking pixels are firing correctly',
    ],
    expectedOutcome: 'Finding winning patterns — baseline metrics established',
  },
  {
    id: 'optimizing',
    label: 'Optimizing',
    kpiRange: '40–80% of target',
    icon: 'Settings',
    aiDoes: [
      'Optimize budgets daily across campaigns',
      'Pause underperforming ads via your rules',
      'Generate new campaign recommendations',
    ],
    youDo: [
      'Review & approve budget suggestions',
      'Add fresh creatives when needed',
      'Adjust KPI targets if needed',
    ],
    expectedOutcome: 'CPA decreasing · ROAS climbing toward target',
  },
  {
    id: 'scaling',
    label: 'Scaling',
    kpiRange: '80%+ of target',
    icon: 'TrendingUp',
    aiDoes: [
      'Scale winning campaigns gradually',
      'Maintain cost stability at scale',
      'Continuously create new campaign recommendations',
    ],
    youDo: [
      'Monitor performance trends',
      'Increase budget when metrics are stable',
      'Review scaling recommendations',
    ],
    expectedOutcome: 'Predictable, consistent growth',
  },
]
\`\`\`

### 处理逻辑

\`\`\`javascript
// 输入: kpiAchievement（来自 Status Bar 步骤 2）
const currentPhaseId = getPhase(kpiAchievement).id
// 用 mock 数据: kpiAchievement=0.698 → 'optimizing'

const phaseOrder = ['exploring', 'optimizing', 'scaling']

// 对每个 phase 计算显示状态
const phasesWithStatus = PLAN_PHASES.map(phase => {
  const phaseIndex = phaseOrder.indexOf(phase.id)
  const currentIndex = phaseOrder.indexOf(currentPhaseId)

  let status
  if (phaseIndex < currentIndex) status = 'completed'     // 已经历
  else if (phaseIndex === currentIndex) status = 'active'  // 当前阶段
  else status = 'upcoming'                                  // 下一目标

  return { ...phase, status }
})

// 用 mock 数据 (currentPhaseId='optimizing'):
// exploring → completed (已经历)
// optimizing → active (当前)
// scaling → upcoming (下一目标)
\`\`\`

### 输出

3 列 grid 卡片，样式按 status 区分:

| status | 边框 | 背景 | 额外 |
|--------|------|------|------|
| completed | border-emerald-300 | bg-emerald-50 | 右上角 ✓ |
| active | border-primary-500 border-2 | bg-primary-50 | "You are here" badge |
| upcoming | border-slate-200 | bg-white | 文字 text-slate-400 |

每张卡片内部布局:
\`\`\`
Icon + Label + KPI Range
────────────────────────
AI does:
· bullet1
· bullet2
· bullet3
────────────────────────
You do:
· bullet1
· bullet2
────────────────────────
Expected: outcome text
[You are here] badge (仅 active)
\`\`\`

注意: 阶段可双向变动。新发 campaign 拉低整体 KPI → 可从 Scaling 回退到 Optimizing。

### 真实数据替换步骤

无需单独替换——PLAN_PHASES 是静态产品文案。当 Status Bar 使用真实数据后，kpiAchievement 自动正确，此模块跟着生效。
`,

  forecast: `
## Forecast — 开发指南

### 功能

回答用户最核心的预期管理问题: 效果在变好还是变差？预计多久达到目标？如果变差了是为什么？

### 输入数据

| 数据 | 当前来源 | 真实数据来源 |
|------|---------|-------------|
| kpiTrend | buildKPITrend(activeCampaigns, kpiType) — Status Bar 步骤 4 输出 | 同上（取决于 campaign history） |
| kpiType | STATUS_BAR_DATA.kpiType | OptimizeGoals API |
| currentKPI | Status Bar 步骤 1 聚合计算 | 同上 |
| kpiTarget | STATUS_BAR_DATA.kpiTarget | OptimizeGoals API |

### 处理逻辑

**步骤 1: 计算 7 天趋势方向和速率（简单线性回归）**

\`\`\`javascript
// 输入: kpiTrend = [{ date, kpiValue }, ...] 最近 7 天

function calcTrend(kpiTrend, kpiType) {
  const n = kpiTrend.length
  if (n < 2) return { slope: 0, direction: 'stable', dailyChange: 0, weeklyChangePct: 0 }

  // 简单线性回归: y = a + b*x, 其中 x=0,1,2,...,n-1
  const xMean = (n - 1) / 2
  const yMean = kpiTrend.reduce((s, d) => s + d.kpiValue, 0) / n

  let numerator = 0
  let denominator = 0
  kpiTrend.forEach((d, i) => {
    numerator += (i - xMean) * (d.kpiValue - yMean)
    denominator += (i - xMean) ** 2
  })

  const slope = denominator !== 0 ? numerator / denominator : 0
  // slope = 每天 KPI 变化量（ROAS 正值=变好，CPA 正值=变差）

  // 标准化方向（统一为 "好/差" 语义）
  const isImproving = kpiType === 'ROAS' ? slope > 0 : slope < 0
  const direction = Math.abs(slope) < 0.01
    ? 'stable'
    : (isImproving ? 'improving' : 'declining')

  // 周变化百分比
  const firstValue = kpiTrend[0].kpiValue
  const lastValue = kpiTrend[n - 1].kpiValue
  const weeklyChangePct = firstValue > 0
    ? ((lastValue - firstValue) / firstValue) * 100
    : 0

  return { slope, direction, dailyChange: slope, weeklyChangePct }
}

// 用 MOCK_CAMPAIGNS history 聚合后假设得到:
// kpiTrend = [2.8, 2.9, 3.0, 3.1, 3.0, 3.1, 3.14]
// slope ≈ +0.05/天, direction='improving', weeklyChangePct ≈ +12%
\`\`\`

**步骤 2: 预估达到目标的天数**

\`\`\`javascript
function estimateDaysToTarget(currentKPI, kpiTarget, dailyChange, kpiType) {
  // 如果趋势不朝目标方向 → 无法预估
  const isMovingToward = kpiType === 'ROAS'
    ? dailyChange > 0    // ROAS 需要增长
    : dailyChange < 0    // CPA 需要下降

  if (!isMovingToward || Math.abs(dailyChange) < 0.001) {
    return null  // 无法预估
  }

  const gap = kpiType === 'ROAS'
    ? kpiTarget - currentKPI     // ROAS: 还差多少
    : currentKPI - kpiTarget     // CPA: 还要降多少

  if (gap <= 0) return 0  // 已达标

  const days = Math.ceil(gap / Math.abs(dailyChange))
  return days <= 180 ? days : null  // 超过 180 天不靠谱
}

// 示例: currentKPI=3.14, target=4.5, dailyChange=0.05
// gap = 4.5 - 3.14 = 1.36
// days = 1.36 / 0.05 = 27.2 → 28 天
\`\`\`

**步骤 3: 生成预测文案**

\`\`\`javascript
function generateForecast(direction, weeklyChangePct, estimatedDays, kpiType) {
  const kpiLabel = kpiType  // 'ROAS' or 'CPA'
  const changeText = \`\${weeklyChangePct > 0 ? '+' : ''}\${weeklyChangePct.toFixed(1)}%\`

  if (direction === 'improving') {
    return {
      sentiment: 'positive',   // 绿色调
      icon: 'TrendingUp',
      headline: \`\${kpiLabel} is improving\`,
      body: estimatedDays !== null
        ? \`\${kpiLabel} improved \${changeText} over the past 7 days. At this pace, you'll reach your target in approximately \${estimatedDays} days. The system is actively optimizing — continue monitoring and the AI will keep scaling what works.\`
        : \`\${kpiLabel} improved \${changeText} over the past 7 days. Performance is trending in the right direction.\`,
    }
  }

  if (direction === 'declining') {
    return {
      sentiment: 'caution',    // 琥珀色调
      icon: 'TrendingDown',
      headline: \`\${kpiLabel} has dipped — here's what's happening\`,
      body: \`\${kpiLabel} changed \${changeText} over the past 7 days. This is common when new campaigns are launched or when audience saturation occurs. The system has already responded: underperforming ads have reduced budgets, and optimization rules are being executed. Consider refreshing creatives or reviewing your budget suggestions in Ad Manager.\`,
    }
  }

  return {
    sentiment: 'neutral',     // 灰色调
    icon: 'Minus',
    headline: \`\${kpiLabel} is holding steady\`,
    body: \`\${kpiLabel} has been stable over the past 7 days. The system is testing new approaches to push performance further. You may want to add fresh creatives or adjust KPI targets to unlock the next phase.\`,
  }
}
\`\`\`

**用 mock 数据的预期输出**（假设趋势 improving +12%）:
\`\`\`javascript
{
  sentiment: 'positive',
  headline: 'ROAS is improving',
  body: 'ROAS improved +12.0% over the past 7 days. At this pace, you\\'ll reach your target in approximately 28 days...'
}
\`\`\`

### 输出

单张卡片，水平布局，左侧内容 + 右侧趋势图:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ 📈 ROAS is improving                                 ╱╲    │
│                                                     ╱  ╲╱  │
│ ROAS improved +12.0% over the past 7 days.      ──╱       │
│ At this pace, you'll reach your target in                   │
│ approximately 28 days...                                    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

样式按 sentiment:
| sentiment | 边框 | icon 颜色 | 背景 |
|-----------|------|-----------|------|
| positive | border-emerald-200 | text-emerald-600 | bg-emerald-50 |
| caution | border-amber-200 | text-amber-600 | bg-amber-50 |
| neutral | border-gray-200 | text-gray-500 | bg-gray-50 |

右侧趋势图: 复用 kpiTrend 数据，Recharts LineChart 宽 140px 高 56px，线条颜色同 sentiment。

### 真实数据替换步骤

无需单独替换——所有输入来自 Status Bar 模块的计算结果。当 Status Bar 使用真实数据后自动生效。

可选升级: 用 AI agent 分析替代纯计算的 generateForecast，传入趋势数据让 LLM 生成更丰富的解读。
`,

  adsGoOperations: `
## AdsGo Operations — 开发指南

### 设计理念

48 小时时间线，以 36h 为分割点:
- 左栏: 过去 36h 的历史事件（已完成）→ 回答"系统做了什么"
- 右栏: 未来 12h 的预估事件（即将发生）→ 回答"系统接下来要做什么"
- 上方: 3 个累计汇总数字
- 仅包含 3 类核心动作: budget_optimize | regen_creative | recommend_campaign
- 数据同步不作为事件，单独一行说明 "Data synced every hour"

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| campaigns | MOCK_CAMPAIGNS | adManagerV3/mockData.js | AdManagerV3 campaign 列表 API |
| OPERATIONS_TIMELINE | 4 条过去 36h 历史事件 | mediaPlan/mockData.js 硬编码 | 系统操作日志 API |
| OPERATIONS_UPCOMING | 3 条未来 12h 预估事件 | mediaPlan/mockData.js 硬编码 | 后端调度器 API 或前端根据运行频率生成 |

Mock 数据定义:
\`\`\`javascript
// 过去 36h 历史事件（已发生，实线圆点）
export const OPERATIONS_TIMELINE = [
  {
    id: 'op-1',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),   // 8h ago
    type: 'budget_optimize',
    title: 'Budget optimization completed',
    description: '5 increase · 3 decrease · 2 pause · 2 maintain',
  },
  {
    id: 'op-2',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),  // 14h ago
    type: 'recommend_campaign',
    title: 'Generated 3 recommended campaigns',
    description: 'Lookalike audience · Interest testing · Retarget converters',
  },
  {
    id: 'op-3',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),  // 28h ago
    type: 'regen_creative',
    title: 'Regenerated 5 creative variants',
    description: '3 Product Hero · 1 Lifestyle · 1 UGC style',
  },
  {
    id: 'op-4',
    timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),  // 32h ago
    type: 'budget_optimize',
    title: 'Budget optimization completed',
    description: '4 increase · 2 decrease · 1 pause · 4 maintain',
  },
]

// 未来 12h 预估事件（虚线圆点，半透明样式）
export const OPERATIONS_UPCOMING = [
  {
    id: 'up-1',
    estimatedTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),   // +4h
    type: 'budget_optimize',
    title: 'Budget optimization',
    description: 'Daily scheduled run',
  },
  {
    id: 'up-2',
    estimatedTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),   // +8h
    type: 'regen_creative',
    title: 'Regenerate creative variants',
    description: 'If creative fatigue detected',
  },
  {
    id: 'up-3',
    estimatedTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),  // +10h
    type: 'recommend_campaign',
    title: 'Campaign recommendations',
    description: 'If sufficient performance data available',
  },
]
\`\`\`

API 返回格式建议:
\`\`\`json
// 历史事件
[{
  "id": "op-xxx",
  "timestamp": "2026-03-27T14:30:00Z",
  "type": "budget_optimize | regen_creative | recommend_campaign",
  "title": "事件标题",
  "description": "事件描述"
}]

// 预估事件
[{
  "id": "up-xxx",
  "estimatedTime": "2026-03-27T18:00:00Z",
  "type": "同上",
  "title": "预估事件标题",
  "description": "预估描述"
}]
\`\`\`

### 处理逻辑

**步骤 1: 计算汇总统计（Summary Stats）**

\`\`\`javascript
// 输入: OPERATIONS_TIMELINE（历史事件） + campaigns
// 输出: 3 个累计数字（仅统计历史事件，不含预估）

function computeSummaryStats(timeline, campaigns) {
  // 1. Budget Suggestions: 从 campaigns 聚合
  //    遍历每个 campaign 和其 adsets，统计 budgetReason.type
  const budgetCounts = aggregateBudgetSuggestions(campaigns)
  const totalBudgetSuggestions = budgetCounts.increase + budgetCounts.decrease + budgetCounts.pause

  // 2. Creatives Regenerated: 从历史时间线中统计 regen_creative 事件
  //    通过 regex 从 title 中提取数字（如 "Regenerated 5 creative variants" → 5）
  const creativesGenerated = timeline
    .filter(e => e.type === 'regen_creative')
    .reduce((sum, e) => {
      const match = e.title.match(/(\\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  // 3. Recommended Campaigns: 同理
  const campaignsRecommended = timeline
    .filter(e => e.type === 'recommend_campaign')
    .reduce((sum, e) => {
      const match = e.title.match(/(\\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  return { totalBudgetSuggestions, creativesGenerated, campaignsRecommended }
}
// mock 结果: { totalBudgetSuggestions: 4, creativesGenerated: 5, campaignsRecommended: 3 }
\`\`\`

**步骤 2: 左栏 — 历史事件按日期分组**

\`\`\`javascript
function groupTimelineByDay(timeline) {
  const now = new Date()
  const todayStr = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  const today = []
  const yest = []

  // 按时间降序（最新在前）
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  sorted.forEach(event => {
    const eventDate = new Date(event.timestamp).toDateString()
    if (eventDate === todayStr) today.push(event)
    else if (eventDate === yesterdayStr) yest.push(event)
  })

  const groups = []
  if (today.length > 0) groups.push({ label: 'Today', events: today })
  if (yest.length > 0) groups.push({ label: 'Yesterday', events: yest })
  return groups
}
\`\`\`

**步骤 3: 右栏 — 预估事件直接渲染**

\`\`\`javascript
// OPERATIONS_UPCOMING 已经是按时间排序的预估事件
// 直接渲染，统一标题 "Upcoming"
// 用 estimatedTime 字段，显示为 "~HH:mm" 格式（带 ~ 前缀表示预估）
\`\`\`

**步骤 4: 事件图标和颜色映射**

\`\`\`javascript
const EVENT_STYLES = {
  budget_optimize:    { Icon: DollarSign, dotColor: 'bg-blue-500',   iconBg: 'bg-blue-50',   iconText: 'text-blue-500' },
  regen_creative:     { Icon: Sparkles,   dotColor: 'bg-purple-500', iconBg: 'bg-purple-50', iconText: 'text-purple-500' },
  recommend_campaign: { Icon: Layers,     dotColor: 'bg-amber-500',  iconBg: 'bg-amber-50',  iconText: 'text-amber-500' },
}
\`\`\`

**时间格式化:**

\`\`\`javascript
function formatTime(isoTimestamp, isEstimate = false) {
  const d = new Date(isoTimestamp)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  return isEstimate ? \`~\${time}\` : time
}
\`\`\`

### 输出

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│  AdsGo Operations                                     </> Guide  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ 💰 4         │  │ 🎨 5         │  │ 📋 3         │           │
│  │ Budget       │  │ Creatives    │  │ Campaigns    │           │
│  │ Suggestions  │  │ Regenerated  │  │ Recommended  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  🟢 Data synced every hour                                       │
│                                                                   │
│  ┌─── Past 36 Hours ────────┬─── Next 12 Hours ────────┐        │
│  │                          │                            │        │
│  │  Today                   │  Upcoming                  │        │
│  │  ● 06:00  Budget optim.  │  ◐ ~18:00  Budget optimize │       │
│  │  │        5↑ 3↓ 2⏸      │  │         (daily run)     │       │
│  │  Yesterday               │  ◐ ~22:00  Regen creatives │       │
│  │  ● 10:00  3 campaigns    │  │         (if needed)     │       │
│  │  │        recommended    │  ◐ ~02:00  Campaign reco.  │       │
│  │  ● 08:00  5 AI creatives │            (if data ready) │       │
│  │  │        regenerated    │                            │        │
│  │  ● 02:00  Budget optim.  │                            │        │
│  │           4↑ 2↓ 1⏸      │                            │        │
│  └──────────────────────────┴────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

左栏样式: 实心圆点 ● + 实线竖线 + text-gray-800 标题
右栏样式: 空心圆点 ◐ (border-2 bg-white) + 虚线竖线 + text-gray-600 标题 + opacity-80

### 真实数据替换步骤

1. 用操作日志 API 替换 OPERATIONS_TIMELINE（返回过去 36h 的事件数组，格式同上）
2. OPERATIONS_UPCOMING 可由后端调度器 API 返回计划任务，或前端根据固定运行频率自动生成
3. Summary stats 的 creatives/campaigns 数字提取当前用 regex 解析 title，真实场景可改为 API 直接返回数值字段（避免 regex）
4. aggregateBudgetSuggestions 逻辑不变，输入改为真实 campaign 数据
5. 组件渲染逻辑不变
`,

  yourActions: `
## Your Actions — 开发指南

### 输入数据

不使用独立的 mock 数据——由处理逻辑根据条件**动态生成**。

需要的数据源（全部来自其他模块的处理结果或 props）:

| 数据 | 当前来源 | 真实数据来源 |
|------|---------|-------------|
| autoExecuteRecommendations | App.jsx state (props) | 用户设置 API（已是真实数据） |
| autoRegenEnabled | App.jsx state (props) | 用户设置 API（已是真实数据） |
| pendingBudgetCount | aggregateBudgetSuggestions(MOCK_CAMPAIGNS) 的 increase+decrease+pause | 真实 campaign 数据 |
| budgetSummaryText | formatBudgetSummary(counts) 如 "3 increase · 1 decrease" | 真实 campaign 数据 |
| draftCampaignCount | CAMPAIGN_CARDS.length (autoRegeneration/mockData.js) | 推荐 campaign API 返回的待审核数量 |
| daysSinceLastCreative | Math.floor((Date.now() - lastCreativeGenTime) / 86400000) | 操作日志 API 中最近 regen_creative 事件时间戳 |
| kpiAchievement | Status Bar 计算: ROAS→current/target, CPA→target/current | 同上 |
| kpiType | STATUS_BAR_DATA.kpiType | OptimizeGoals API |
| currentKPI | Status Bar 聚合计算 | 同上 |
| kpiTarget | STATUS_BAR_DATA.kpiTarget | OptimizeGoals API |
| spendPercent | cappedSpend / dailyBudget | 真实 campaign spend 聚合 |
| activeCreativeCount | OPERATIONS_DATA.activeCreativeCount (值: 12) | Creative Library API 返回活跃素材数 |

### 处理逻辑

\`\`\`javascript
function generateActions({
  autoExecuteRecommendations,
  autoRegenEnabled,
  pendingBudgetCount,
  budgetSummaryText,
  draftCampaignCount,
  daysSinceLastCreative,
  kpiAchievement,
  kpiType,
  currentKPI,
  kpiTarget,
  spendPercent,
  activeCreativeCount,
}) {
  const actions = []

  // ── 条件 1: 有待处理的预算建议 且 auto-apply 关闭 ──
  // pendingBudgetCount 来自 aggregateBudgetSuggestions(campaigns)
  // 遍历 campaign.budgetReason + campaign.adsets[].budgetReason 统计 type 数量
  if (pendingBudgetCount > 0 && !autoExecuteRecommendations) {
    actions.push({
      id: 'budget_review',
      priority: 'high',           // 高优先级 → 左边框 amber-500
      icon: 'DollarSign',
      title: \`Review \${pendingBudgetCount} budget suggestions\`,
      description: budgetSummaryText,  // 如 "3 increase · 1 decrease"
      targetPage: 'adManagerV3',       // 点击 View 跳转到 Ad Manager
      autoGuideText: 'Enable auto-apply to let AI handle budget adjustments',
      autoGuideKey: 'autoExecuteRecommendations',
    })
  }

  // ── 条件 2: 有推荐 campaign 且 auto-publish 关闭 ──
  if (draftCampaignCount > 0 && !autoRegenEnabled) {
    actions.push({
      id: 'campaign_review',
      priority: 'high',
      icon: 'Layers',
      title: \`Review \${draftCampaignCount} recommended campaigns\`,
      description: 'AI-generated campaigns ready for your review',
      targetPage: 'autoRegeneration',  // 跳转到 Draft & Recom.
      autoGuideText: 'Enable auto-publish to let AI launch recommended campaigns',
      autoGuideKey: 'autoRegenEnabled',
    })
  }

  // ── 条件 3: 超过 7 天没有新创意 ──
  if (daysSinceLastCreative >= 7) {
    actions.push({
      id: 'creative_refresh',
      priority: 'medium',           // 中优先级 → 左边框 blue-400
      icon: 'Sparkles',
      title: 'Consider refreshing creatives',
      description: \`No new creatives in \${daysSinceLastCreative} days. AI can generate branded creatives matching your brand colors, product features, and tone — typically 5 ads in ~4 minutes.\`,
      targetPage: 'aiGenerate',
      autoGuideText: null,           // 创意刷新没有 auto 开关
      autoGuideKey: null,
    })
  }

  // ── 条件 4: KPI 接近或已达到目标 → 建议调整 ──
  // kpiAchievement 已统一处理了 ROAS/CPA 方向差异
  if (kpiAchievement >= 0.9 && kpiTarget > 0) {
    const kpiFormatted = kpiType === 'ROAS'
      ? \`\${currentKPI.toFixed(1)}x\`
      : \`$\${currentKPI.toFixed(0)}\`
    const targetFormatted = kpiType === 'ROAS'
      ? \`\${kpiTarget}x\`
      : \`$\${kpiTarget}\`
    const direction = kpiType === 'ROAS' ? 'raising' : 'lowering'

    actions.push({
      id: 'kpi_review',
      priority: 'low',             // 低优先级 → 左边框 gray-300
      icon: 'TrendingUp',
      title: 'Review KPI targets',
      description: \`Current \${kpiType} \${kpiFormatted} is approaching your \${targetFormatted} target — consider \${direction} it\`,
      targetPage: 'optimizeGoals',
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  // ── 条件 5: 预算利用率高 → 建议增加 daily budget ──
  // spendPercent = cappedSpend / dailyBudget，在 MediaPlan.jsx 中计算
  if (spendPercent >= 0.85) {
    actions.push({
      id: 'increase_budget',
      priority: 'medium',
      icon: 'Wallet',
      title: 'Increase brand daily budget',
      description: \`Current spend is at \${Math.round(spendPercent * 100)}% of daily budget. Increasing the budget gives AI more room to scale winning campaigns and test new audiences.\`,
      targetPage: 'optimizeGoals',
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  // ── 条件 6: 可测试素材不足 → 建议上传或 AIGC ──
  // activeCreativeCount 来自 OPERATIONS_DATA.activeCreativeCount (mock: 12)
  if (activeCreativeCount < 15) {
    actions.push({
      id: 'more_creatives',
      priority: 'medium',
      icon: 'Sparkles',
      title: 'Provide more creatives for testing',
      description: \`Only \${activeCreativeCount} active creatives. More creative variants help the AI find winning combinations faster — upload your own or let AI generate them.\`,
      // 双按钮模式（非单个 targetPage）:
      buttons: [
        { label: 'Upload', icon: 'Upload', targetPage: 'creativeLibrary' },
        { label: 'AIGC',   icon: 'Wand2',  targetPage: 'aiGenerate' },
      ],
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  return actions
}
\`\`\`

**用 Mock 数据验证输出**:

以默认 mock 数据计算:
- pendingBudgetCount = 4, autoExecuteRecommendations = false → 条件1 ✓ → budget_review
- draftCampaignCount = 3, autoRegenEnabled = false → 条件2 ✓ → campaign_review
- daysSinceLastCreative = 2 → 条件3 ✗（< 7）
- kpiAchievement = 0.698 → 条件4 ✗（< 0.9）
- spendPercent = 3500/3500 = 1.0 → 条件5 ✓ → increase_budget
- activeCreativeCount = 12 → 条件6 ✓（< 15）→ more_creatives

最终输出 4 个 action items。

**auto-mode 引导交互**:

当用户点击 "Enable →" 按钮:
1. 调用 onAutoExecuteChange(true) 或 onAutoRegenChange(true)
2. App.jsx 的 state 更新 → props 变化 → generateActions 重新计算
3. 该 action 的条件不再满足 → 从列表中消失
4. 用户自然理解"AI 接管了这件事"

**Empty State**: 当 actions.length === 0:
\`\`\`
✓ All caught up — AdsGo is handling everything.
\`\`\`

### 输出

每张 action 卡片:

**普通卡片（单个 View 按钮）:**
\`\`\`
┌─────────────────────────────────────────────────────────┐
│▌💰 Review 4 budget suggestions                   [View] │
│▌ 3 increase · 1 decrease                                │
│▌ 💡 Enable auto-apply to let AI handle...    [Enable →] │
└─────────────────────────────────────────────────────────┘
\`\`\`

**双按钮卡片（Upload / AIGC）:**
\`\`\`
┌─────────────────────────────────────────────────────────┐
│▌✨ Provide more creatives for testing  [Upload] [AIGC]  │
│▌ Only 12 active creatives. More creative variants...    │
└─────────────────────────────────────────────────────────┘
\`\`\`

优先级左边框:
- high → border-l-4 border-amber-500
- medium → border-l-4 border-blue-400
- low → border-l-4 border-gray-300

### 真实数据替换步骤

1. pendingBudgetCount: 使用真实 campaign 数据计算（aggregateBudgetSuggestions 逻辑不变）
2. draftCampaignCount: 用推荐 campaign API 的 count 替换 CAMPAIGN_CARDS.length
3. daysSinceLastCreative: 用操作日志中最近 regen_creative 事件的时间戳计算天数差
4. auto toggle state: 已经是真实数据（App.jsx state）
5. spendPercent: 来自 cappedSpend / dailyBudget，当 Status Bar 使用真实数据后自动生效
6. activeCreativeCount: 用 Creative Library API 返回的活跃素材数量替换 OPERATIONS_DATA.activeCreativeCount
`,

  safetyControl: `
## Safety & Control — 开发指南

### 卡片 1: Budget Guard

**输入数据**: 复用 Status Bar 的 cappedSpend 和 dailyBudget

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| cappedSpend | min(todaySpend, 3500) = 3500 | Status Bar 步骤 1 计算 | 真实 campaign spend 聚合 |
| dailyBudget | 3500 | STATUS_BAR_DATA.dailyBudget | OptimizeGoals API |

**处理逻辑**:

\`\`\`javascript
const spendPercent = dailyBudget > 0
  ? Math.round((cappedSpend / dailyBudget) * 100)
  : 0

// 进度条颜色
const barColor =
  spendPercent < 70  ? 'bg-emerald-500' :   // 安全（绿色）
  spendPercent < 90  ? 'bg-amber-500'   :   // 接近上限（琥珀）
  'bg-rose-500'                              // 到上限（红色）
\`\`\`

**输出**:
\`\`\`
🛡 Budget Guard

████████████████████ 100%
$3,500 / $3,500 daily

"AI strictly respects your daily budget cap.
 If performance drops, spend is reduced
 automatically — never beyond your limit."
\`\`\`

### 卡片 2: Your Control

**输入数据**:

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| autoExecuteRecommendations | false | App.jsx state (props) | 用户设置 API（已是真实数据） |
| autoRegenEnabled | false | App.jsx state (props) | 用户设置 API（已是真实数据） |

**处理逻辑**: 无计算，直接渲染状态

\`\`\`javascript
// ON/OFF badge 样式
const badgeStyle = (isOn) => isOn
  ? 'bg-emerald-100 text-emerald-700'   // ON = 绿色
  : 'bg-gray-100 text-gray-500'          // OFF = 灰色
\`\`\`

**输出**:
\`\`\`
🎛 Your Control

Budget Auto-apply      [OFF]
Campaign Auto-publish  [OFF]

"You can pause or override AI decisions at
 any time. AdsGo works alongside your
 existing strategies — no hard switch needed."
\`\`\`

注意: 这里的 ON/OFF 是**只读状态标签**（不是可操作开关）。开关操作统一在 Your Actions 的 autoGuide "Enable" 按钮中。

### 卡片 3: Compliance

**输入数据**: 无（静态文案）

**处理逻辑**: 无

**输出**:
\`\`\`
✅ Compliance

✅ Meta Policy Compliant
✅ Google Policy Compliant

"All ads follow platform advertising policies.
 If an ad doesn't pass review, we'll flag it
 for you immediately."
\`\`\`

### 真实数据替换步骤

1. cappedSpend 和 dailyBudget 来自 Status Bar 模块的计算结果，当 Status Bar 使用真实数据后 Budget Guard 自动生效
2. auto toggle state 已经是真实数据（App.jsx state → props 传入）
3. Compliance 卡片当前为静态文案，后续可接入各 platform 广告审核状态 API，动态展示审核通过数/总数
`,

  summary: `
## Summary — 开发指南

### 核心目的

Summary 是 Media Plan 页面的"顶卡"，以自然语言形式向用户提供过去 7 天的投放总结。
核心价值：让非专业用户无需看图表就能理解——我的广告效果是好是差、为什么、接下来怎么办。
这不是简单的数据展示，而是**AI 分析师级别的叙事**。

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| kpiTrend | KPI_TREND_DATA (7 天) | mediaPlan/mockData.js | 从 campaign history 聚合（同 Status Bar 步骤 4） |
| kpiType | 'ROAS' | STATUS_BAR_DATA.kpiType | OptimizeGoals API |
| currentKPI | 3.31 | 计算值 | 同 Status Bar 当前 KPI 计算 |
| kpiTarget | 4.5 | STATUS_BAR_DATA.kpiTarget | OptimizeGoals API |
| spendData | SPEND_DATA 对象 | mediaPlan/mockData.js | 从 campaign spend 聚合 |
| currentWeekPlan | WEEKLY_PLANS 中 status='current' | mediaPlan/mockData.js | AI 每周计划 API |
| topDimensions | DIMENSION_SCORES 按 currentScore 升序前2 | mediaPlan/mockData.js | AI 多维度分析 API |

SPEND_DATA 扩展字段:
\`\`\`javascript
export const SPEND_DATA = {
  totalSpend: 18500,
  avgDailySpend: 2643,
  efficiency: 'improving',
  // 以下为叙事增强字段
  dailyTrend: [
    { date: '03-24', spend: 2400, conversions: 18, revenue: 6840 },
    // ... 7 天数据
  ],
  topEvent: 'Approved budget suggestions on 03-25',  // 过去 7 天最有影响力的用户行动
  creativeFatigueAdsets: 2,                           // 检测到创意疲劳的 adset 数量
  daysSinceNewCreative: 3,                            // 距上次上传新创意的天数
}
\`\`\`

### 处理逻辑

**步骤 1: 计算趋势变化**
\`\`\`javascript
const firstValue = kpiTrend[0].kpiValue
const lastValue = kpiTrend[n - 1].kpiValue
const changePercent = ((lastValue - firstValue) / firstValue) * 100
const isImproving = kpiType === 'ROAS' ? changePercent > 0 : changePercent < 0
const isSignificant = Math.abs(changePercent) > 5
\`\`\`

**步骤 2: 因果因素分析 (identifyCausalFactors)**
\`\`\`javascript
function identifyCausalFactors(spendData, kpiTrend, kpiType) {
  const factors = []

  // 花费效率趋势: 对比首日 vs 末日的 CPA
  const firstCPA = trend[0].spend / trend[0].conversions
  const lastCPA  = trend[6].spend / trend[6].conversions
  const cpaChange = ((lastCPA - firstCPA) / firstCPA) * 100
  if (cpaChange < -10) factors.push({ type: 'efficiency_gain', ... })
  if (cpaChange > 10)  factors.push({ type: 'efficiency_loss', ... })

  // 创意疲劳信号
  if (spendData.creativeFatigueAdsets > 0) factors.push({ type: 'creative_fatigue', ... })

  // 关键用户行动归因
  if (spendData.topEvent) factors.push({ type: 'event_attribution', ... })

  // 创意空白期
  if (spendData.daysSinceNewCreative > 5) factors.push({ type: 'creative_gap', ... })

  return factors
}
\`\`\`

**步骤 3: 组装叙事上下文**
\`\`\`javascript
// 最薄弱维度名称映射
const weakDimLabel = {
  budget_optimization: '预算分配',
  creative: '创意质量',
  media_asset: '媒体资产',
  landing_page: '落地页表现',
}[topDimensions[0].id]

// 本周核心目标
const weekObjective = currentWeekPlan?.coreObjective
// 用户待办
const firstTodo = currentWeekPlan?.youNeedToDo?.find(t => !t.completed)?.text
\`\`\`

**步骤 4: 生成自然语言总结 (4 个分支)**

| 分支 | 条件 | Sentiment | 叙事要素 |
|------|------|-----------|---------|
| 达标 | targetAchieved | positive | 达标数据 + 关键驱动因素 + 保持策略 + 本周方向 |
| 向好 | isImproving && isSignificant | positive | 改进百分比 + 归因事件 + 差距百分比 + 最弱维度 + 下步行动 |
| 向差 | !isImproving && isSignificant | caution | 下降数据 + 因果分析(创意疲劳/受众饱和) + AI已采取行动 + 本周方向 + 建议行动 |
| 稳定 | else | neutral | 稳定范围 + 最大潜力维度 + 创意空白期 + 本周计划 + 建议 |

叙事示例（向好分支）:
> Your ROAS improved +16.1% over the past 7 days, moving from 2.85x to 3.31x.
> We're still 26% below the 4.5x target, but the trajectory is clearly positive.
> This improvement aligns with: Approved budget suggestions on 03-25.
> Cost-per-acquisition improved 12% as we concentrated budget on top performers.
> The biggest opportunity for further improvement is in media assets — AdsGo is already working on this.
> This week's focus: scale winning audiences while maintaining CPA efficiency.
> Your next recommended action: review weekly performance summary.

**步骤 5: 情感样式映射**
\`\`\`javascript
const SENTIMENT_STYLES = {
  positive: { border: 'border-emerald-200', bg: 'bg-emerald-50/60', stroke: '#10b981' },
  caution:  { border: 'border-amber-200',   bg: 'bg-amber-50/60',   stroke: '#f59e0b' },
  neutral:  { border: 'border-gray-200',    bg: 'bg-gray-50/60',    stroke: '#6b7280' },
}
\`\`\`

### 输出

卡片结构：
- 顶部：Icon（TrendingUp/TrendingDown/Minus）+ headline（自然语言标题）
- 中部：body（多段自然语言叙述，包含因果分析 + 行动建议）
- 底部：7 天趋势折线图（Recharts ResponsiveContainer + LineChart）

### 边界条件

| 情况 | 处理方式 |
|------|---------|
| kpiTrend < 2 个点 | 返回 neutral "Building performance baseline"，不渲染折线图 |
| spendData 为空 | 跳过因果分析，仅使用 KPI 趋势数据生成基础叙事 |
| currentWeekPlan 为空 | 跳过 "This week's focus" 段落 |
| topDimensions 为空 | 跳过 "biggest opportunity" 段落 |
| firstValue === 0 | changePercent 设为 0，归入 neutral 分支 |
| KPI 类型切换 | isImproving 方向反转（CPA 下降=好，ROAS 上升=好） |

### 真实数据替换步骤

1. kpiTrend: 使用 buildKPITrend 函数从真实 campaign history 聚合 7 天数据
2. currentKPI: 复用 MediaPlan.jsx 中的 computed.currentKPI 计算逻辑
3. spendData.dailyTrend: 从广告平台 API 获取每日 spend/conversions/revenue
4. spendData.topEvent: 从用户行动日志中提取过去 7 天影响力最大的行动（按 KPI 变化幅度排序）
5. spendData.creativeFatigueAdsets: AI 分析 adset 级别 CTR 趋势，连续 3 天下降 + 运行 14+ 天 = 疲劳
6. currentWeekPlan: 从 AI 周计划 API 获取 status='current' 的周数据
7. topDimensions: 从 AI 多维度评分 API 获取，按 currentScore 升序取前 2
8. LineChart: 替换为 ResponsiveContainer 确保在任何容器宽度下自适应
`,

  weeklyPlan: `
## Weekly Plan — 开发指南

### 核心目的

5 周计划是用户粘性引擎。核心价值：
- **管理预期**: 让用户看到本阶段核心目标、AI 的计划方向
- **驱动配合**: 用户需要做什么、完成状态如何
- **时间感知**: 过去做了什么 → 当前在做什么 → 未来要做什么
- **自动更新**: 每周 AI 自动生成新的后续计划，形成持续参与闭环

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| weeksData | WEEKLY_PLANS (5 周) | mediaPlan/mockData.js | AI 每周自动生成新计划 API |
| onTodoToggle | 回调函数 | 本地 console.log | 用户行动追踪 API |

每周数据结构:
\`\`\`javascript
{
  weekId: 'W0',           // 标识符: W-2, W-1, W0, W+1, W+2
  weekNumber: 13,          // 年内第几周
  label: 'This Week',
  status: 'current',       // 'completed' | 'current' | 'upcoming'
  dateRange: {
    start: '2026-03-24',
    end: '2026-03-30',
    startStr: '3/24',      // 数字格式: M/D
    endStr: '3/30',
  },
  coreObjective: 'Scale winning audiences while maintaining CPA efficiency',
  aiPlan: [                // AI 本周将执行的计划, 最多 3 条显示
    'Scale LAL 1% audience budget by 25% if CPA stays under target',
    'Test new interest-based audiences (fitness, wellness)',
    'Auto-generate 3 video variants from top static creative',
  ],
  youNeedToDo: [           // 用户 Todo 列表，跟随完成状态更新
    { id: 'w0-1', text: 'Review weekly performance summary', completed: false },
    { id: 'w0-2', text: 'Approve new audience tests', completed: false },
  ],
}
\`\`\`

### 处理逻辑

**步骤 1: 计算每周日期范围（真实数据时使用）**
\`\`\`javascript
function getWeekRange(offsetWeeks) {
  const now = new Date()
  const currentDay = now.getDay()
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1

  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday + (offsetWeeks * 7))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    start: monday,
    end: sunday,
    startStr: \`\${monday.getMonth() + 1}/\${monday.getDate()}\`,  // 数字格式 M/D
    endStr: \`\${sunday.getMonth() + 1}/\${sunday.getDate()}\`,
  }
}
// 例: offsetWeeks=0 → 当前周 3/24 - 3/30
// 例: offsetWeeks=-2 → 两周前 3/10 - 3/16
\`\`\`

**步骤 2: 判断每周状态**
\`\`\`javascript
// Mock 阶段: 状态在 mockData 中硬编码
// 真实数据: 基于日期动态判断
function getWeekStatus(weekStart, weekEnd) {
  const now = new Date()
  if (now > weekEnd) return 'completed'
  if (now >= weekStart && now <= weekEnd) return 'current'
  return 'upcoming'
}
\`\`\`

**步骤 3: 布局方案**
\`\`\`
桌面端 (lg+): 5 列等宽 Grid
┌──────┬──────┬──────┬──────┬──────┐
│ W-2  │ W-1  │ W0   │ W+1  │ W+2  │
│ 已完  │ 已完  │ 本周  │ 下周  │ 后周  │
│ 成    │ 成   │ ring │      │      │
└──────┴──────┴──────┴──────┴──────┘

移动端 (<lg): 横向滚动，每卡片 min-w-[220px], w-[45%]
snap-x snap-mandatory 确保对齐
\`\`\`

\`\`\`jsx
// 桌面端
<div className="hidden lg:grid lg:grid-cols-5 gap-3">
  {weeksData.map(week => <WeekCard ... />)}
</div>

// 移动端
<div className="lg:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
  {weeksData.map(week => (
    <div className="min-w-[220px] w-[45%] flex-shrink-0 snap-start">
      <WeekCard ... />
    </div>
  ))}
</div>
\`\`\`

**步骤 4: Todo 完成状态更新**
\`\`\`javascript
const handleTodoToggle = (weekId, todoId) => {
  // 1. 更新本地 UI 状态（乐观更新）
  setWeeks(prev => prev.map(w =>
    w.weekId === weekId
      ? { ...w, youNeedToDo: w.youNeedToDo.map(t =>
          t.id === todoId ? { ...t, completed: !t.completed } : t
        )}
      : w
  ))
  // 2. 调用 API 持久化
  api.recordUserAction(weekId, todoId, true)
}
\`\`\`

**步骤 5: 每周自动更新机制**
\`\`\`
周一 00:00 触发 AI 计划生成:
1. 评估上周 KPI 变化和已完成行动
2. 重新评估多维度状态
3. 生成新的 W+2 周计划（核心目标 + AI Plan + 用户 Todo）
4. 更新 W+1 为更精确的计划（基于最新数据）
5. 将上周 W0 标记为 completed，归档 todo 完成率
\`\`\`

### 输出

5 列等宽卡片:
\`\`\`
每卡片包含:
┌─────────────────────┐
│ [Completed] / [This Week] / [Upcoming]  ← 状态标签
│ 3/24 - 3/30                             ← 日期范围（数字格式）
│                                         │
│ ⊕ CORE OBJECTIVE                        │
│ Scale winning audiences...              │
│                                         │
│ 🤖 AI PLAN                              │
│ • Scale LAL 1% audience...             │
│ • Test new interest-based...           │
│ • Auto-generate 3 video...            │
│                                         │
│ ☑ YOU NEED TO DO                        │
│ [✓] Review weekly performance           │
│ [ ] Approve new audience tests          │
└─────────────────────┘
\`\`\`

样式规则:
- completed: bg-emerald-50, border-emerald-200
- current: bg-primary-50, border-primary-300, ring-2 ring-primary-100（强调当前周）
- upcoming: bg-gray-50, border-gray-200
- AI Plan 最多展示 3 条（line-clamp-2 截断）
- Todo 复选框: 完成=emerald-500 + 删除线，未完成=白底灰框

### 边界条件

| 情况 | 处理方式 |
|------|---------|
| weeksData 少于 5 条 | 按实际数量渲染，grid 会自动留空 |
| 所有 todo 已完成 | 正常显示，全部带勾 + 删除线 |
| aiPlan 超过 3 条 | slice(0, 3) 截断 |
| 文本溢出卡片宽度 | line-clamp-2 + text-[11px] 确保紧凑 |
| 日期跨年 | getWeekRange 自动处理，M/D 格式不含年 |
| 没有 current 状态的周 | 所有卡片正常渲染，无 ring 强调效果 |

### 真实数据替换步骤

1. weeksData: 从 AI 周计划 API 获取，每周一 00:00 自动刷新
2. todo 状态: 从用户行动追踪 API 获取实时完成状态，支持乐观更新
3. 日期计算: getWeekRange 函数可在前端计算，也可从 API 直接返回
4. coreObjective: AI 基于当前 KPI 达成率、多维度评分、用户历史行动生成
5. aiPlan: AI 基于当前广告账户状态和优化策略自动生成
6. youNeedToDo: AI 根据优化需求生成，已完成项从行动追踪 API 同步
7. 周状态: 可前端计算（基于日期），也可 API 返回
`,

  optimizationScore: `
## Multi-dimensional Monitoring — 开发指南

### 核心目的

这个模块是广告效果的**诊断工具**，回答用户核心问题："我的广告效果不好，问题出在哪？我该做什么？"
不是展示评分的仪表盘——用户不需要看评分，而是需要看到**诊断结果**。
雷达图是手段，不是目的：让用户一眼看出哪个维度是短板。

每个维度是一条**因果链**：
维度有问题 → 影响了整体广告效果 → AdsGo 可以做什么 → 用户需要配合什么 → 做了之后预期提升多少

### 5 个维度定义

| 维度 ID | 名称 | 核心诊断问题 | 为什么影响效果 | 关键动作 |
|---------|------|-------------|--------------|---------|
| budget_optimization | Budget Optimization | 预算分配不合理：好 adset 花不出去、差的在烧钱 | 直接浪费预算在低效投放上 | 开启自动执行 / 手动审批 |
| campaign_recommendation | Campaign Recommendation | AI 已生成新 campaign 但未上线 | 错过扩量和测试机会 | 开启自动发布 / 手动审批 |
| creative | Creative Quality | 创意疲劳，CTR 持续下降 | 用户看腻了，点击率和转化率下滑 | 上传新素材让 AI remix |
| landing_page | Landing Page | 埋点缺失、加载慢、移动端转化低 | 点击了广告但无法转化 | 修复埋点、优化加载速度 |
| kpi | KPI Target | 目标设得过高，远超行业 benchmark | 系统为了达标被迫收窄投放 | 降低到合理区间 |

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| dimensionsData | DIMENSION_SCORES (5 维) | mediaPlan/mockData.js | AI 多维度诊断 API |
| phaseData | CAMPAIGN_PHASE_DATA | mediaPlan/mockData.js | Campaign 状态聚合 API |
| onDimensionSelect | 回调函数 | console.log | 分析事件追踪 |
| onActionClick | 回调函数 | console.log | 用户行动追踪 API |

每维度数据结构:
\`\`\`javascript
{
  id: 'budget_optimization',
  currentScore: 2.8,         // 0-5 分，AI 基于多维度数据评估
  potentialScore: 1.8,       // 执行所有建议后的预期提升分数
  problem: '3 adsets with ROAS below 1.5x are consuming 40% of daily budget...', // 一段完整的诊断叙述
  adsGoWillDo: [             // AI 计划采取的自动化行动（2-3 条）
    'Shift $480/day from underperforming adsets to top winners',
  ],
  yourActions: [             // 用户需要配合的行动（1-2 条）
    { id: 'bo-1', text: 'Enable auto-execute for budget optimization' },
  ],
  expectedImpact: 'Unlocks $480/day reallocation — projected to improve ROAS by 0.6x within 7 days',
}
\`\`\`

阶段数据结构:
\`\`\`javascript
// CAMPAIGN_PHASE_DATA
{
  totalActive: 6,        // 活跃 campaign 总数
  learningCount: 2,      // 处于学习期的 campaign 数
  learningPercent: 33,   // 学习期占比
}
\`\`\`

### 处理逻辑

**步骤 1: 统一色系**

所有维度使用品牌主色，不按维度分色:
\`\`\`javascript
const BRAND_COLOR = '#7033F5'   // 雷达实线、选中状态、右侧 border
const BRAND_LIGHT = '#f3f0ff'   // 选中标签背景、问题区域底色
const BRAND_MID   = '#c4b5fd'   // 虚线（优化后预期）
\`\`\`
设计原则: 颜色传达"品牌一致性"，而非"维度差异"。维度差异通过内容和位置区分。

**步骤 2: 雷达图 — 双层五边形**

\`\`\`javascript
// 两层 Radar:
// 1. 虚线层 = current + potential（优化后上限），填充 BRAND_LIGHT 12% 透明度
// 2. 实线层 = current 实际分数，填充 BRAND_COLOR 10% 透明度

const chartData = dims.map(d => ({
  subject: DIMENSION_LABELS[d.id],   // 完整维度名称
  current: d.currentScore,
  potential: Math.min(d.currentScore + d.potentialScore, 5),
}))
\`\`\`

雷达图尺寸: 350×350px, outerRadius 58%
维度标签: 可点击，选中时显示圆角药丸背景 + 品牌色文字
选中顶点: 三层光晕（外圈 r=11 透明 → 白色中圈 r=6 → 实色内核 r=2.5）

**步骤 3: 中心阶段状态**

雷达图中心显示账户整体阶段，基于活跃 campaign 的学习期占比:
\`\`\`javascript
function getPhaseLabel(learningPercent) {
  if (learningPercent >= 80) return { label: 'Learning', color: '#f59e0b' }   // 大部分在摸索
  if (learningPercent >= 30) return { label: 'Optimizing', color: '#7033F5' } // 多数已过学习期
  return { label: 'Scaling', color: '#10b981' }                               // 绝大多数已稳定
}
// 下方小字: "33% in learning"
\`\`\`

**步骤 4: 问题描述 (problem)**

位于雷达图下方，是一段完整的自然语言诊断叙述（不是 bullet list）。
像医生写诊断，不是列症状。每个维度的 problem 应包含:
- 问题现象（数据支撑）
- 根因分析
- 当前阻塞点（如 auto-execute OFF）

**步骤 5: 右侧详情面板 (50% 宽度)**

从上到下:
1. **Header**: 维度名 + 分数 + 当前→优化后对比
2. **Score Bar**: 实线条=当前, 虚线框=潜力上限
3. **AdsGo Will Do**: 编号列表，每条前有品牌色编号圆角方块
4. **Your Actions**: 可勾选 checkbox，用户配合事项
5. **Expected Impact**: 绿色底色卡片，显示分数变化 + 一句话预期收益

**步骤 6: 自动轮播 + 暂停**
\`\`\`javascript
// 每 5 秒自动切换维度
// 鼠标 hover 整个卡片时暂停
// 底部 5 个进度条指示器，active 的有 5s 填充动画
// 手动点击维度标签或底部指示器 → 立即切换
\`\`\`

### 输出布局

\`\`\`
┌──────────────────────────────────────────────────────────┐
│  Multi-dimensional Monitoring                              [Guide] │
│  ┌──────────── 50% ────────────┬──────── 50% ──────────┐│
│  │                              │                        ││
│  │     ┌──────────────┐        │  Budget Optimization   ││
│  │     │  Radar 350px │        │  ─────────────────────  ││
│  │     │  五边形       │        │  Score: 2.8/5          ││
│  │     │              │        │  ████████░░░░░ +1.8     ││
│  │     │  实线=当前    │        │                        ││
│  │     │  虚线=潜力    │        │  ADSGO WILL DO         ││
│  │     │              │        │  1. Shift $480/day..   ││
│  │     │  中心:       │        │  2. Pause adsets..     ││
│  │     │  Optimizing  │        │  3. Scale winners..    ││
│  │     │  33% learning │        │                        ││
│  │     └──────────────┘        │  YOUR ACTIONS          ││
│  │                              │  [ ] Enable auto..     ││
│  │  ─── 实线  ── ── 虚线       │  [ ] Or manually..     ││
│  │                              │                        ││
│  │  ┌──────────────────────┐   │  EXPECTED IMPACT       ││
│  │  │ ● Budget Optimization │   │  Score: 2.8 → 4.6     ││
│  │  │ 2.8/5                │   │  "Unlocks $480/day     ││
│  │  │ 3 adsets with ROAS   │   │   reallocation to      ││
│  │  │ below 1.5x are...   │   │   winning audiences"   ││
│  │  └──────────────────────┘   │                        ││
│  └──────────────────────────────┴────────────────────────┘│
│  ═══ ━━━ ━━━ ━━━ ━━━  ← 5个进度条指示器（品牌色）        │
└──────────────────────────────────────────────────────────┘
\`\`\`

### 边界条件

| 情况 | 处理方式 |
|------|---------|
| dimensions 少于 5 个 | 雷达图自动适应维度数，底部指示器减少 |
| 所有分数都是 5.0 | potentialScore 为 0，Expected Impact 显示"已达最优" |
| phaseData 缺失 | 中心默认显示 "Optimizing"，learningPercent 显示 0% |
| problem 为空 | 不渲染问题区域 |
| adsGoWillDo/yourActions 为空数组 | 对应区块不渲染 |
| 用户快速连续点击 | handleClick 直接设置 index，无节流 |
| 移动端 (< lg) | 左右堆叠为上下，雷达图在上，详情面板在下 |

### 真实数据替换步骤

1. dimensionsData: 从 AI 多维度诊断 API 获取，每次页面加载时请求
2. currentScore: AI 基于广告账户数据实时计算（0-5 分连续值）
3. potentialScore: AI 基于建议行动的预期效果评估
4. problem: AI 对维度当前问题的自然语言诊断（一段话，含数据支撑）
5. adsGoWillDo: 从优化引擎获取 AI 计划采取的自动化行动
6. yourActions: 从优化建议 API 获取需要用户配合的行动
7. expectedImpact: AI 对执行所有建议后的预期收益评估（一句话）
8. phaseData: 从 Campaign 状态 API 聚合，统计 learning/active 占比
9. 维度列表: 可根据账户情况动态调整（如无落地页不显示 landing_page）
10. 评分刷新: 建议每 6 小时重新计算，或在用户完成行动后立即更新
`,

  highlights: `
## Highlights of the Past 7 Days — 开发指南

### 核心目的

Highlights 卡片与左侧 AdsGo Operations 并排展示，形成"AI 做了什么 + 效果如何"的完整闭环。
两部分内容:
- **Action Benefits**: 用户按照建议完成 todo 后带来的实际收益 → 激励用户继续配合
- **Highlights**: 表现优秀的 adset/ad/creative/campaign → 展示 AdsGo 优化的实际成果

### 输入数据

| 字段 | Mock 值 | 当前来源 | 真实数据来源 |
|------|---------|---------|-------------|
| actionBenefits | 数组（4 项） | mediaPlan/mockData.js | 行动收益分析 API |
| highlights | 数组（4 项） | mediaPlan/mockData.js | 优秀表现记录 API |

Action Benefits 数据结构:
\`\`\`javascript
{
  metric: 'ROAS',                                    // 指标名: ROAS | CTR | CPA | CPC | CPM | Conversions
  change: '+18%',                                    // 变化值（含正负号）
  attribution: 'After approving budget suggestions on 03-25'  // 归因描述
}
\`\`\`

Highlights 数据结构:
\`\`\`javascript
{
  type: 'adset',                                     // 类型: adset | ad | creative | campaign
  name: 'LAL 1% - Purchasers',                      // 对象名称
  achievement: 'ROAS 5.2x (target 4.5x) · $1,240 spend',  // 成就描述
  date: '03-28',                                     // 达成日期
}
\`\`\`

### 处理逻辑

**步骤 1: Action Benefits 归因计算**
\`\`\`javascript
// 核心逻辑: 关联用户行动时间戳 → 行动后的 KPI 变化
function calculateActionBenefits(userActions, kpiHistory) {
  return userActions.map(action => {
    // 找到行动时间点
    const actionDate = action.completedAt
    // 取行动前 24h 的 KPI 基线
    const baselineKPI = getKPIAt(kpiHistory, actionDate, -24)
    // 取行动后 48h 的 KPI
    const afterKPI = getKPIAt(kpiHistory, actionDate, +48)
    // 计算变化
    const change = ((afterKPI - baselineKPI) / baselineKPI * 100)
    return {
      metric: action.relatedMetric,
      change: \`\${change > 0 ? '+' : ''}\${change.toFixed(0)}%\`,
      attribution: \`After \${action.description} on \${formatDate(actionDate)}\`,
    }
  })
}
\`\`\`

**步骤 2: Highlights 筛选规则**
\`\`\`javascript
function filterHighlights(adObjects, kpiTarget, benchmarks) {
  return adObjects.filter(obj => {
    const metrics = obj.past7DaysMetrics
    // 条件 1: 过去 7 天内任意时间点达成用户 KPI 目标
    const hitTarget = metrics.some(m =>
      kpiType === 'ROAS' ? m.roas >= kpiTarget : m.cpa <= kpiTarget
    )
    // 条件 2: 超出行业 benchmark
    const beatBenchmark = metrics.some(m =>
      m.ctr > benchmarks.ctr * 1.5 ||
      m.roas > benchmarks.roas * 1.2 ||
      m.cpa < benchmarks.cpa * 0.8
    )
    return hitTarget || beatBenchmark
  })
  .map(obj => ({
    type: obj.level,     // 'adset' | 'ad' | 'creative' | 'campaign'
    name: obj.name,
    achievement: formatAchievement(obj),  // 格式化成就描述
    date: formatDate(obj.bestPerformanceDate),
  }))
  .slice(0, 4)  // 最多展示 4 条
}
\`\`\`

**步骤 3: 指标格式化规则**

| 指标 | 方向 | 正面表述 | 图标 |
|------|------|---------|------|
| ROAS | 越高越好 | +18% | DollarSign (emerald) |
| CTR | 越高越好 | +23% | MousePointer (blue) |
| Conversions | 越高越好 | +31% | Zap (purple) |
| CPA | 越低越好 | -15% (显示为正面) | Target (emerald) |
| CPC | 越低越好 | -12% (显示为正面) | DollarSign (emerald) |
| CPM | 越低越好 | -8% (显示为正面) | Eye (emerald) |

\`\`\`javascript
// 判断变化方向是否为正面
const isPositive = benefit.change.includes('+') || !benefit.change.includes('-')
// 注: CPA/CPC/CPM 的 change 是负数但实际是好事
// 显示时统一用绿色 TrendingUp 图标，因为我们从 change 字符串判断而非语义
\`\`\`

**步骤 4: 类型样式映射**
\`\`\`javascript
const TYPE_STYLES = {
  adset:    { bg: 'bg-blue-50',   border: 'border-blue-200',   iconColor: 'text-blue-500' },
  ad:       { bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500' },
  creative: { bg: 'bg-amber-50',  border: 'border-amber-200',  iconColor: 'text-amber-500' },
  campaign: { bg: 'bg-emerald-50',border: 'border-emerald-200',iconColor: 'text-emerald-500' },
}
\`\`\`

### 输出

\`\`\`
┌────────────────────────────────────────┐
│  Highlights of the Past 7 Days [Guide] │
│                                        │
│  🟢 Action Benefits                    │
│  Impact from completed actions         │
│  ┌────────┬────────┬────────┬────────┐│
│  │ ROAS   │ CTR    │ CPA    │ Conv.  ││
│  │ +18%   │ +23%   │ -15%   │ +31%   ││
│  │ After..│ After..│ After..│ Combi..││
│  └────────┴────────┴────────┴────────┘│
│                                        │
│  ─────────── 分割线 ───────────────    │
│                                        │
│  🏆 Highlights                         │
│  Top performers exceeding targets      │
│  ┌──────────────────┬─────────────────┐│
│  │ 🎯 LAL 1%       │ ⭐ UGC Style    ││
│  │ ROAS 5.2x      │ CTR 3.8%       ││
│  │ 03-28           │ 03-27           ││
│  ├──────────────────┼─────────────────┤│
│  │ 🏅 Hero Image   │ 🎯 Retargeting  ││
│  │ CPC $0.42      │ CPA $12.50     ││
│  │ 03-29           │ 03-26           ││
│  └──────────────────┴─────────────────┘│
└────────────────────────────────────────┘
\`\`\`

注意: 此卡片外层 wrapper (bg-white rounded-xl border shadow p-5)
由组件自身管理，MediaPlan.jsx 中不再额外包裹。

### 边界条件

| 情况 | 处理方式 |
|------|---------|
| actionBenefits 为空 | 不渲染 Action Benefits 区块和分割线 |
| highlights 为空 | 不渲染 Highlights 区块 |
| 两者都为空 | 显示空状态: Award 图标 + "No highlights yet" + 鼓励文案 |
| actionBenefits 超过 4 个 | 网格自动换行: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 |
| highlights 超过 4 个 | 取前 4 个, grid-cols-1 sm:grid-cols-2 |
| 指标名未在 METRIC_ICONS 映射中 | fallback 到 TrendingUp 图标 |
| 类型未在 TYPE_STYLES 映射中 | fallback 到 ad 样式 |

### 真实数据替换步骤

1. actionBenefits: 从行动收益分析 API 获取
   - 输入: 用户过去 7 天完成的行动列表（来自用户行动追踪系统）
   - 处理: 对每个行动，比较行动前后 48h 的 KPI 变化
   - 输出: 按变化幅度排序，取 Top 4 指标
   - 注意: 归因窗口为 48h，避免短期波动误归因

2. highlights: 从优秀表现记录 API 获取
   - 输入: 所有 adset/ad/creative/campaign 的过去 7 天逐日指标
   - 筛选: KPI 达成目标 OR 超出行业 benchmark 50%+
   - 排序: 按达成幅度降序
   - 输出: Top 4 记录，包含名称、成就描述、达成日期

3. 行业 benchmark: 从行业基准 API 获取
   - 按用户所在行业（如 E-commerce）获取平均 CTR、CPA、ROAS
   - 缓存周期: 每周更新一次即可
   - 用于 Highlights 筛选的 benchmark 比较基准

4. 指标变化计算: 从广告平台 API 获取逐日指标数据
   - Meta Ads API: insights endpoint, 按 date_preset=last_7_days
   - Google Ads API: search endpoint, 按 segments.date 分组
`,
}
