export const demoBrand = {
  id: 'brand-luma',
  name: 'LumaFit',
  industry: '运动服饰 DTC',
  primaryMarket: '美国',
  stage: '投放中',
  target: {
    metric: 'Purchase ROAS',
    value: 2.4,
    dailyBudgetCap: 300,
  },
  lastSyncAt: 'Jun 29, 2026 10:08',
}

export const demoScenarios = [
  {
    id: 'us-roas-decline',
    label: '美国 ROAS 下滑',
    summary: '美国 7 日 ROAS 从 2.60 降到 1.82，CTR 基本稳定，问题集中在转化效率和预算分配。',
    badge: '今日异常',
    brief: {
      eyebrow: '今日异常',
      title: '美国市场 ROAS 下滑处理',
      targetLabel: 'ROAS 目标',
      targetValue: '2.4',
      metrics: [
        ['7 日 ROAS', '1.82', '目标 2.40'],
        ['美国花费', '$303.1', '+22.4%'],
        ['受影响 Campaign', '3', '待处理'],
        ['待确认动作', '2', '预算决策'],
      ],
      strategyEyebrow: '预算重点',
      strategyTitle: '午间复盘前先完成美国预算重分配。',
      strategyPoints: [
        '冷启动先降预算，再营销因促销周继续保持曝光。',
        'US Retargeting 进入 48 小时观察，下一次预算点再判断是否继续下调。',
      ],
    },
    view: {
      defaultLevel: 'campaign',
      filters: {
        time: '近 7 天',
        market: '美国',
        status: '投放中 + 学习期',
        suggestion: '有预算动作',
        anomaly: 'ROAS 下滑',
      },
      rowIds: {
        campaign: ['cmp-us-retargeting', 'cmp-us-prospecting', 'cmp-us-lookalike'],
        adset: ['adset-us-retargeting-7d', 'adset-us-retargeting-30d', 'adset-us-prospecting-broad'],
        ad: ['ad-core-video-fatigue', 'ad-retargeting-proof', 'ad-lookalike-static'],
      },
    },
  },
  {
    id: 'creative-fatigue',
    label: '主视频疲劳',
    summary: 'Core Legging Video V12 频次升至 4.7，CTR 下滑 28.4%，Prospecting 需要替换新 Hook。',
    badge: '素材疲劳',
    brief: {
      eyebrow: '素材信号',
      title: '冷启动主视频进入疲劳区间',
      targetLabel: '频次红线',
      targetValue: '4.5',
      metrics: [
        ['主视频频次', '4.7', '超红线 4.5'],
        ['CTR 变化', '-28.4%', '较峰值'],
        ['受影响 Ad', '1', '待换新'],
        ['草稿就绪', '2', 'UGC Hook'],
      ],
      strategyEyebrow: '换新策略',
      strategyTitle: '先换 Prospecting 主视频，再营销素材保持。',
      strategyPoints: [
        'Core Legging Video V12 停止继续放量，改用 UGC Hook 01 进入测试。',
        'Customer Proof Carousel 继续服务再营销，促销周不替换。',
      ],
      action: { label: '前往草稿中心', path: '../create/draft' },
    },
    view: {
      defaultLevel: 'ad',
      filters: {
        time: '近 7 天',
        market: '美国',
        status: '投放中',
        suggestion: '需要换新',
        anomaly: '素材疲劳',
      },
      rowIds: {
        campaign: ['cmp-us-prospecting'],
        adset: ['adset-us-prospecting-broad'],
        ad: ['ad-core-video-fatigue'],
      },
    },
  },
  {
    id: 'new-client-launch',
    label: '新客户首月',
    summary: '新客户首月重点是目标、预算红线、素材节奏和每日报告口径的稳定建立。',
    badge: '首月启动',
    brief: {
      eyebrow: '首月启动',
      title: '新客户投放基建与口径建立',
      targetLabel: 'ROAS 目标',
      targetValue: '2.4',
      metrics: [
        ['已连接账号', '2', 'Meta + Google'],
        ['在投 Campaign', '4', '多国测试'],
        ['日报口径', '已建立', '可直接分享'],
        ['待完成配置', '3', 'Skills + 红线'],
      ],
      strategyEyebrow: '本周重点',
      strategyTitle: '先稳目标红线，再逐步放量。',
      strategyPoints: [
        '完成品牌目标、预算红线与 Skills 配置后再扩大冷启动预算。',
        '首月日报口径固定，便于客户每日同步投放进展。',
      ],
      action: { label: '查看媒体计划', path: '../plan/media-plan' },
    },
    view: {
      defaultLevel: 'campaign',
      filters: {
        time: '近 7 天',
        market: '全部',
        status: '全部',
        suggestion: '全部',
        anomaly: '全部',
      },
      rowIds: {
        campaign: ['cmp-us-retargeting', 'cmp-us-prospecting', 'cmp-us-lookalike', 'cmp-ca-expansion'],
        adset: ['adset-us-retargeting-7d', 'adset-us-retargeting-30d', 'adset-us-prospecting-broad'],
        ad: ['ad-core-video-fatigue', 'ad-retargeting-proof', 'ad-lookalike-static'],
      },
    },
  },
]

export const getScenarioById = (id) => demoScenarios.find((scenario) => scenario.id === id) || demoScenarios[0]

export const demoRecommendations = [
  {
    id: 'rec-us-retargeting-edit',
    entityId: 'cmp-us-retargeting',
    entityLevel: 'campaign',
    action: '降预算',
    suggestedBudget: 150,
    currentBudget: 180,
    risk: '中风险',
    confidence: 0.74,
    status: '人工调整',
    reason: '7 天内有 5 天低于目标，但再营销访客仍明显优于冷启动流量，本周客户要求保持促销曝光。',
    evidence: ['7 日 ROAS 1.82，目标 2.40', 'CVR 下降 18.6%', '客户要求促销周保留再营销曝光'],
    memoryPrompt: '你将 US-Retargeting 预算保留在 180，高于 Luna 建议的 150。是否因为客户要求保留再营销曝光？',
  },
  {
    id: 'rec-us-prospecting-down',
    entityId: 'cmp-us-prospecting',
    entityLevel: 'campaign',
    action: '降预算',
    suggestedBudget: 95,
    currentBudget: 140,
    risk: '低风险',
    confidence: 0.81,
    status: '待确认',
    reason: '花费增长但购买量没有同步增长，应先降低冷启动预算，等待 CVR 恢复后再放量。',
    evidence: ['7 日花费 +22.4%', '购买量 -6.1%', 'ROAS 1.54，目标 2.40'],
  },
  {
    id: 'rec-us-lookalike-hold',
    entityId: 'adset-us-lookalike-3pct',
    entityLevel: 'adset',
    action: '保持',
    suggestedBudget: 120,
    currentBudget: 120,
    risk: '低风险',
    confidence: 0.68,
    status: '已采纳',
    reason: 'ROAS 略低于目标，但 CPC 已下降，新素材仍在学习期，不应过早降预算。',
    evidence: ['CPC -11.8%', '学习期第 3 天', '未发现素材疲劳'],
  },
]

export const demoCampaigns = [
  {
    id: 'cmp-us-retargeting',
    name: 'US Retargeting Purchase',
    platform: 'Meta',
    market: 'US',
    objective: 'Purchase',
    status: '投放中',
    budgetType: 'CBO',
    dailyBudget: 180,
    suggestedBudget: 150,
    spend: 126.4,
    roas: 1.82,
    cpa: 42.8,
    ctr: 1.74,
    cvr: 2.1,
    purchases: 9,
    trend: 'down',
    anomaly: 'ROAS 下滑',
    recommendationId: 'rec-us-retargeting-edit',
  },
  {
    id: 'cmp-us-prospecting',
    name: 'US Prospecting Broad',
    platform: 'Meta',
    market: 'US',
    objective: 'Purchase',
    status: '投放中',
    budgetType: 'CBO',
    dailyBudget: 140,
    suggestedBudget: 95,
    spend: 118.2,
    roas: 1.54,
    cpa: 58.6,
    ctr: 1.21,
    cvr: 1.4,
    purchases: 6,
    trend: 'down',
    anomaly: '预算浪费',
    recommendationId: 'rec-us-prospecting-down',
  },
  {
    id: 'cmp-us-lookalike',
    name: 'US 3 Percent Lookalike',
    platform: 'Meta',
    market: 'US',
    objective: 'Purchase',
    status: '学习期',
    budgetType: 'ABO',
    dailyBudget: null,
    suggestedBudget: null,
    spend: 96.7,
    roas: 2.18,
    cpa: 34.2,
    ctr: 1.63,
    cvr: 2.6,
    purchases: 11,
    trend: 'mixed',
    anomaly: '观察中',
    recommendationId: null,
  },
  {
    id: 'cmp-ca-expansion',
    name: 'CA Expansion Test',
    platform: 'TikTok',
    market: 'CA',
    objective: 'Purchase',
    status: '投放中',
    budgetType: 'ABO',
    dailyBudget: null,
    suggestedBudget: null,
    spend: 62.9,
    roas: 2.71,
    cpa: 29.4,
    ctr: 2.06,
    cvr: 2.9,
    purchases: 7,
    trend: 'up',
    anomaly: '稳定',
    recommendationId: null,
  },
]

export const demoAdsets = [
  {
    id: 'adset-us-retargeting-7d',
    campaignId: 'cmp-us-retargeting',
    name: 'Visitors 7D Purchase Intent',
    platform: 'Meta',
    market: 'US',
    status: '投放中',
    dailyBudget: null,
    spend: 64.8,
    roas: 1.76,
    cpa: 44.1,
    ctr: 1.92,
    cvr: 2.0,
    recommendationId: null,
  },
  {
    id: 'adset-us-retargeting-30d',
    campaignId: 'cmp-us-retargeting',
    name: 'Visitors 30D Value Stack',
    platform: 'Meta',
    market: 'US',
    status: '投放中',
    dailyBudget: null,
    spend: 61.6,
    roas: 1.88,
    cpa: 41.5,
    ctr: 1.56,
    cvr: 2.2,
    recommendationId: null,
  },
  {
    id: 'adset-us-prospecting-broad',
    campaignId: 'cmp-us-prospecting',
    name: 'Broad Fitness Buyers',
    platform: 'Meta',
    market: 'US',
    status: '投放中',
    dailyBudget: null,
    spend: 118.2,
    roas: 1.54,
    cpa: 58.6,
    ctr: 1.21,
    cvr: 1.4,
    recommendationId: null,
  },
  {
    id: 'adset-us-lookalike-3pct',
    campaignId: 'cmp-us-lookalike',
    name: 'US 3% Lookalike Purchase',
    platform: 'Meta',
    market: 'US',
    status: '学习期',
    dailyBudget: 120,
    spend: 96.7,
    roas: 2.18,
    cpa: 34.2,
    ctr: 1.63,
    cvr: 2.6,
    recommendationId: 'rec-us-lookalike-hold',
  },
  {
    id: 'adset-ca-expansion-core',
    campaignId: 'cmp-ca-expansion',
    name: 'CA Core Product Test',
    platform: 'TikTok',
    market: 'CA',
    status: '投放中',
    dailyBudget: 80,
    spend: 62.9,
    roas: 2.71,
    cpa: 29.4,
    ctr: 2.06,
    cvr: 2.9,
    recommendationId: null,
  },
]

export const demoAds = [
  {
    id: 'ad-core-video-fatigue',
    adsetId: 'adset-us-prospecting-broad',
    campaignId: 'cmp-us-prospecting',
    name: 'Core Legging Video V12',
    creativeId: 'crt-legging-v12',
    status: '投放中',
    format: 'Video',
    spend: 64.7,
    roas: 1.38,
    ctr: 0.94,
    cvr: 1.2,
    frequency: 4.7,
  },
  {
    id: 'ad-retargeting-proof',
    adsetId: 'adset-us-retargeting-7d',
    campaignId: 'cmp-us-retargeting',
    name: 'Customer Proof Carousel',
    creativeId: 'crt-proof-carousel',
    status: '投放中',
    format: 'Carousel',
    spend: 42.3,
    roas: 2.04,
    ctr: 1.88,
    cvr: 2.5,
    frequency: 3.1,
  },
  {
    id: 'ad-lookalike-static',
    adsetId: 'adset-us-lookalike-3pct',
    campaignId: 'cmp-us-lookalike',
    name: 'Studio Static Set A',
    creativeId: 'crt-studio-static-a',
    status: '投放中',
    format: 'Image',
    spend: 31.5,
    roas: 1.69,
    ctr: 1.34,
    cvr: 1.8,
    frequency: 2.6,
  },
]

export const demoAdSuggestions = [
  {
    id: 'adsug-core-video',
    entityId: 'ad-core-video-fatigue',
    action: '建议关停',
    status: '待确认',
    reason: '频次 4.7 超红线，CTR 较峰值下降 28.4%，继续投放会拖累 AdSet CPA。',
  },
  {
    id: 'adsug-retargeting-proof',
    entityId: 'ad-retargeting-proof',
    action: '继续投放',
    status: '已确认',
    reason: '再营销转化高于账户均值，促销周需保留客户证言曝光。',
  },
  {
    id: 'adsug-lookalike-static',
    entityId: 'ad-lookalike-static',
    action: '观察',
    status: '待确认',
    reason: 'CPA 轻微上升但样本仍偏少，48 小时后再决定是否关停。',
  },
]

export const demoCreatives = [
  {
    id: 'crt-legging-v12',
    name: 'Core Legging Video V12',
    format: '视频',
    status: 'fatigue',
    spend: 1240,
    ctr: 0.94,
    cvr: 1.2,
    frequency: 4.7,
    useCount: 9,
    lifecycle: '疲劳',
    signal: '频次升至 4.7，CTR 较峰值下降 28.4%，冷启动继续放量会拉高 CPA。',
  },
  {
    id: 'crt-proof-carousel',
    name: 'Customer Proof Carousel',
    format: '轮播',
    status: 'stable',
    spend: 880,
    ctr: 1.88,
    cvr: 2.5,
    frequency: 3.1,
    useCount: 5,
    lifecycle: '稳定',
    signal: '再营销转化仍高于账户平均，本周促销期继续保留曝光。',
  },
  {
    id: 'crt-studio-static-a',
    name: 'Studio Static Set A',
    format: '图片',
    status: 'watch',
    spend: 690,
    ctr: 1.34,
    cvr: 1.8,
    frequency: 2.6,
    useCount: 4,
    lifecycle: '观察',
    signal: 'CPA 开始上升，但触达尚未饱和，先纳入 48 小时观察。',
  },
  {
    id: 'crt-ugc-refresh-01',
    name: 'UGC Refresh Hook 01',
    format: '视频',
    status: 'draft',
    spend: 0,
    ctr: 0,
    cvr: 0,
    frequency: 0,
    useCount: 0,
    lifecycle: '草稿',
    signal: '用于替换冷启动疲劳视频，首屏突出压缩贴合和晨间训练场景。',
  },
]

export const demoDraftStructure = {
  id: 'draft-us-creative-refresh',
  name: '美国冷启动素材换新',
  status: '待审核',
  sourceScenario: 'creative-fatigue',
  strategySummary: '冷启动替换两条 UGC Hook，再营销保留客户证言轮播，日预算控制在 $95。',
  campaign: {
    id: 'draft-cmp-us-refresh',
    name: 'US Prospecting Refresh',
    objective: 'Purchase',
    budget: 95,
    platform: 'Meta',
  },
  adsets: [
    {
      id: 'draft-adset-broad',
      name: 'Broad Fitness Buyers Refresh',
      audience: '美国泛运动服饰人群',
      budget: 55,
      ads: [
        {
          id: 'draft-ad-ugc-01',
          name: 'UGC Hook 01 - Compression Fit',
          creativeId: 'crt-ugc-refresh-01',
          primaryText: '前 3 秒展示压缩贴合测试，再切入真实用户评价。',
          status: '待发布',
        },
        {
          id: 'draft-ad-ugc-02',
          name: 'UGC Hook 02 - Morning Routine',
          creativeId: 'crt-ugc-refresh-01',
          primaryText: '从晨间训练场景切入，对比旧版静态产品角度。',
          status: '文案待确认',
        },
      ],
    },
    {
      id: 'draft-adset-retargeting',
      name: 'Visitors 30D Proof Refresh',
      audience: '美国 30 日访问人群',
      budget: 40,
      ads: [
        {
          id: 'draft-ad-proof',
          name: 'Customer Proof Carousel Holdout',
          creativeId: 'crt-proof-carousel',
          primaryText: '再营销继续保留客户证言素材，因为转化仍高于账户平均。',
          status: '待发布',
        },
      ],
    },
  ],
}

export const demoLaunchQa = [
  {
    id: 'qa-budget',
    label: '预算合计',
    status: 'pass',
    detail: '$95/day 低于美国市场今日预算红线。',
  },
  {
    id: 'qa-creative',
    label: '疲劳素材替换',
    status: 'pass',
    detail: 'Core Legging Video V12 不再用于冷启动广告。',
  },
  {
    id: 'qa-copy',
    label: '文案确认',
    status: 'warning',
    detail: 'UGC Hook 02 仍需确认首句卖点。',
  },
  {
    id: 'qa-tracking',
    label: '追踪参数',
    status: 'pass',
    detail: 'UTM 命名符合市场、位置、日期规则。',
  },
]

export const demoAuditEvents = [
  {
    id: 'audit-1',
    at: '10:18',
    actor: 'Luna',
    event: '发现美国 ROAS 下滑',
    detail: '3 个美国 Campaign 低于 Purchase ROAS 目标。',
  },
  {
    id: 'audit-2',
    at: '10:24',
    actor: 'Optimizer',
    event: '人工保留再营销预算',
    detail: 'US Retargeting 保持 $180，不降到 $150。',
  },
  {
    id: 'audit-3',
    at: '10:26',
    actor: 'Luna',
    event: '记录客户偏好',
    detail: '促销周需要保留再营销曝光。',
  },
]

export const getAdSuggestionForEntity = (entityId) =>
  demoAdSuggestions.find((item) => item.entityId === entityId) || null

export const getCampaignById = (campaignId) =>
  demoCampaigns.find((campaign) => campaign.id === campaignId)

export const getCampaignBudgetType = (campaignId) =>
  getCampaignById(campaignId)?.budgetType || 'CBO'

/** 当前层级是否展示/编辑日预算 */
export const rowHasEditableBudget = (row, level) => {
  if (level === 'ad') return false
  if (level === 'campaign') return (row.budgetType || 'CBO') === 'CBO'
  if (level === 'adset') return getCampaignBudgetType(row.campaignId) === 'ABO'
  return false
}

/** CBO / ABO 标签（预算不在本层时展示） */
export const getBudgetModeLabel = (row, level) => {
  if (level === 'ad') return null
  if (level === 'campaign' && row.budgetType === 'ABO') return 'ABO'
  if (level === 'adset' && getCampaignBudgetType(row.campaignId) === 'CBO') return 'CBO'
  return null
}

export const getBudgetScopeHint = (row, level) => {
  if (level === 'campaign' && row.budgetType === 'ABO') return '预算在 AdSet 层分配'
  if (level === 'adset' && getCampaignBudgetType(row.campaignId) === 'CBO') return '预算在 Campaign 层统一管理'
  if (level === 'ad') return '预算由上层 Campaign / AdSet 控制'
  return null
}

export const getRecommendationForEntity = (entityId, level) => {
  const recommendation = demoRecommendations.find((item) => item.entityId === entityId)
  if (!recommendation) return null
  if (level && recommendation.entityLevel !== level) return null
  return recommendation
}

export const getBudgetRecommendationForRow = (row, level) => (
  rowHasEditableBudget(row, level) ? getRecommendationForEntity(row.id, level) : null
)
