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
}
