/* ═══════════════════════════════════════════════════════════
   Mock Luna AI Service
   Keyword-matching → preset responses with sync payloads.
   ═══════════════════════════════════════════════════════════ */

import { getSyncPayload } from './lunaSyncPayloads'

/* ── Response templates ──────────────────────────────────── */

const RESPONSES = {
  /* ── Performance / Analysis ────────────────────────────── */
  performance: {
    text: `美国市场近 7 天表现：\n\n• 花费：$303.1（+22.4%）\n• ROAS：1.82（目标 2.40）\n• CPA：$42.80（高于红线）\n• CTR：1.74%（基本稳定）\n• 购买：26\n\n核心判断：点击没有明显变差，问题主要是冷启动转化效率下降和主视频疲劳。`,
    type: 'analysis',
    syncTarget: null,
    dataCard: {
      title: '美国 Campaign 表现',
      rows: [
        { name: 'US Retargeting Purchase', spend: '$126.4', roas: '1.82', status: 'watch' },
        { name: 'US Prospecting Broad', spend: '$118.2', roas: '1.54', status: 'cut' },
        { name: 'US 3 Percent Lookalike', spend: '$96.7', roas: '2.18', status: 'hold' },
      ],
    },
  },

  budget: {
    text: `今日预算动作：\n\n1. **US Prospecting Broad**：$140 → $95，先减少冷启动浪费\n2. **US Retargeting Purchase**：保持 $180，促销周保留高意向曝光\n3. **US 3 Percent Lookalike**：保持 $120，等待新素材学习完成\n\n预计日预算净减少 $45，午间后继续观察购买量和 CPA。`,
    type: 'optimization',
    syncTarget: 'ads/campaigns',
    actionCard: {
      title: '查看预算处理',
      description: '进入广告管理确认 3 个 Campaign 的预算动作',
    },
  },

  roas: {
    text: `美国 ROAS 连续 7 天下滑：\n\n• 6/23：2.60\n• 6/25：2.21\n• 6/27：1.94\n• 6/29：1.82\n\nCTR 基本稳定，说明不是点击兴趣突然下降；主要风险来自转化效率和疲劳素材。`,
    type: 'analysis',
    syncTarget: 'insight/dashboard',
  },

  /* ── Campaign Creation ─────────────────────────────────── */
  campaign: {
    text: `已准备美国冷启动换新结构：\n\n**Campaign: US Prospecting Refresh**\n├── Broad Fitness Buyers Refresh：$55/day\n│   ├── UGC Hook 01 - Compression Fit\n│   └── UGC Hook 02 - Morning Routine\n└── Visitors 30D Proof Refresh：$40/day\n    └── Customer Proof Carousel Holdout\n\n总预算 $95/day，发布前还有 1 条文案需要确认。`,
    type: 'creation',
    syncTarget: 'create/draft',
    actionCard: {
      title: '打开草稿中心',
      description: '检查 UGC Hook、预算和发布前审核',
    },
  },

  creative: {
    text: `素材风险：\n\n• Core Legging Video V12：频次 4.7，CTR 下降 28.4%，需要从冷启动下线\n• Customer Proof Carousel：再营销 ROAS 2.04，继续保留\n• Studio Static Set A：CPA 上升，进入 48 小时观察\n\n建议：优先补两条 UGC Hook 替换冷启动主视频。`,
    type: 'analysis',
    syncTarget: 'creative/library',
  },

  /* ── Audience ──────────────────────────────────────────── */
  audience: {
    text: `美国受众拆解：\n\n• Broad Fitness Buyers：ROAS 1.54，CPA $58.60，今日先降预算\n• Visitors 7D Purchase Intent：ROAS 1.76，促销周保留曝光\n• Visitors 30D Value Stack：ROAS 1.88，进入 48 小时观察\n• US 3 Percent Lookalike：ROAS 2.18，CPC -11.8%，学习期继续保留\n\n结论：不要平均削减美国预算，先削减 Broad，保留再营销和 Lookalike 学习量。`,
    type: 'analysis',
    syncTarget: 'insight/dashboard',
  },

  /* ── Report ────────────────────────────────────────────── */
  report: {
    text: `我已根据「渠道经营总览」准备客户经营日报模板：\n\n• 指标：花费、收入、ROAS、转化\n• 内容：异常概览、渠道拆解、已执行动作、下一步建议\n• 计划：每天 09:30 生成\n\n确认后会写入报告中心。`,
    type: 'report',
    syncTarget: 'insight/reports',
    actionCard: {
      title: '创建客户经营日报模板',
      description: '每天 09:30 基于渠道经营总览生成',
      confirmLabel: '确认创建',
      operation: { kind: 'report', data: { name: 'Luna 客户经营日报', type: '日报', source: '渠道经营总览', schedule: '每天 09:30', recipients: '品牌所有者、管理员' } },
    },
  },

  scheduledTask: {
    text: `我已整理为定时任务：\n\n• 每天 09:00 检查美国市场\n• 调用「预算红线检查」Skill\n• 输出异常摘要与建议动作\n\n确认后会写入任务配置页。`,
    type: 'automation',
    syncTarget: 'automation/tasks',
    actionCard: { title: '创建定时任务', description: '每天 09:00 自动检查美国市场', confirmLabel: '确认创建', operation: { kind: 'task', data: { name: '每日美国市场健康检查', skill: '预算红线检查', schedule: '每天 09:00' } } },
  },

  alertRule: {
    text: `我已生成预警规则草稿：\n\n• 美国市场 ROAS < 1.8\n• 持续 2 小时\n• 高风险，站内与邮件通知\n\n确认后会启用；触发消息进入右上角通知中心。`,
    type: 'automation',
    syncTarget: 'automation/alerts',
    actionCard: { title: '创建 ROAS 预警规则', description: 'ROAS < 1.8 且持续 2 小时', confirmLabel: '确认启用', operation: { kind: 'alert', data: { title: '美国市场 ROAS 低于 1.8', level: '高', rule: 'ROAS < 1.8，持续 2 小时', scope: '美国市场', channel: '站内 + 邮件' } } },
  },

  dataView: {
    text: `我已整理为多维视图：\n\n• 名称：美国渠道 ROAS 诊断\n• 数据源：归因数据集\n• 维度：渠道、市场\n• 指标：花费、收入、ROAS、CPA\n\n确认后会保存到「多维分析」。`,
    type: 'analysis',
    syncTarget: 'insight/multidimensional',
    actionCard: { title: '保存多维分析视图', description: '美国渠道 ROAS 诊断', confirmLabel: '确认保存', operation: { kind: 'view', data: { name: '美国渠道 ROAS 诊断', source: '归因数据集', dimensions: ['渠道', '市场'], metrics: ['花费', '收入', 'ROAS', 'CPA'] } } },
  },

  knowledge: {
    text: `本次判断已引用：\n\n• 行业 Skill：电商预算健康检查\n• 品牌 Skill：预算红线检查\n• L2：广告投放基准与最佳实践\n• L4：品牌 KPI 与预算红线\n\nLuna 会优先使用已启用的行业 Skill、品牌私有 Skill 与 L1–L4 知识。`,
    type: 'knowledge',
    syncTarget: 'settings/skills',
    actionCard: { title: '查看 Skill 与知识库', description: '检查 Luna 当前可使用的品牌认知' },
  },

  /* ── Strategy ──────────────────────────────────────────── */
  strategy: {
    text: `本周策略任务：\n\n1. 确认 US Prospecting Broad 降到 $95\n2. US Retargeting 观察 48 小时\n3. 替换 Core Legging Video V12\n4. 确认 UGC Hook 02 首句卖点\n5. 周五给客户复盘预算调整结果\n\n这些任务已出现在策略中。`,
    type: 'strategy',
    syncTarget: 'plan/media-plan?tab=cycle',
    actionCard: {
      title: '打开策略',
      description: '查看本周预算动作和观察任务',
    },
  },

  /* ── Goals / Settings ──────────────────────────────────── */
  goal: {
    text: `LumaFit 当前目标红线：\n\n• Purchase ROAS 目标：2.40\n• 美国 CPA 红线：$42\n• 美国日预算红线：$300\n• 冷启动素材频次红线：4.5\n• CTR 观察线：1.2%\n\n今天 US Prospecting 同时触发 ROAS、CPA 和素材频次风险，应优先降预算并换新素材。`,
    type: 'settings',
    syncTarget: 'settings/goals',
    actionCard: {
      title: '打开目标与阶段',
      description: '查看今日触发的 ROAS、CPA 和频次红线',
    },
  },

  /* ── Generic / Greeting ────────────────────────────────── */
  greeting: {
    text: `今日重点：美国 ROAS 已低于目标。\n\n我可以直接处理：\n• 查美国 Campaign 表现\n• 确认预算调整\n• 查看疲劳素材\n• 生成客户日报\n• 跟踪本周任务\n\n你要先看哪一项？`,
    type: 'greeting',
  },

  fallback: {
    text: `当前最需要处理的是美国 ROAS 下滑。\n\n可继续查看：\n1. 哪些 Campaign 拉低 ROAS\n2. 今天该怎么调预算\n3. 哪个素材需要换新\n4. 客户日报怎么写\n5. 本周后续任务`,
    type: 'general',
  },
}

const buildAttachmentResponse = (attachments, userMessage) => {
  const names = attachments.map((a) => a.name).join('、')
  const hasImage = attachments.some((a) => a.type?.startsWith('image/'))
  return {
    text: `已收到 ${attachments.length} 个附件：${names}。\n\n${hasImage ? '我从图片中识别到素材/落地页相关元素，建议与 Core Legging Video V12 疲劳问题一并处理。' : '我会结合附件内容与账户数据继续分析。'}\n\n${userMessage ? `关于「${userMessage}」：` : ''}如需写入广告管理或策略待办，告诉我具体动作即可。`,
    type: 'analysis',
    syncTarget: hasImage ? 'creative/library' : null,
    actionCard: hasImage ? {
      title: '打开创意库',
      description: '查看 Luna 标记的疲劳素材与替换建议',
    } : null,
  }
}

/* ── Keyword → response mapping ──────────────────────────── */
const KEYWORD_MAP = [
  { keywords: ['hello', 'hi', 'hey', 'start', 'help', 'what can you', '你好', '帮助'], key: 'greeting' },
  { keywords: ['performance', 'overview', 'how are', 'how is', 'stats', 'summary', 'kpi', '表现', '今日', '美国'], key: 'performance' },
  { keywords: ['budget', 'spend', 'spending', 'allocat', 'increase budget', 'decrease budget', 'optimize budget', '预算', '花费'], key: 'budget' },
  { keywords: ['roas', 'return on ad', 'return on spend', '下滑', '衰退'], key: 'roas' },
  { keywords: ['campaign', 'create campaign', 'new campaign', 'launch', 'draft', '草稿', '创编', '结构'], key: 'campaign' },
  { keywords: ['creative', 'image', 'video', 'ad copy', 'fatigue', 'refresh', '素材', '疲劳', '换新'], key: 'creative' },
  { keywords: ['audience', 'targeting', 'segment', 'lookalike', 'retarget', '受众'], key: 'audience' },
  { keywords: ['alert rule', 'warning', '预警规则', '告警规则', '低于1.8', '低于 1.8'], key: 'alertRule' },
  { keywords: ['scheduled task', 'schedule task', '定时任务', '每天检查', '自动检查'], key: 'scheduledTask' },
  { keywords: ['data view', 'multidimensional', '多维视图', '保存视图', '分析视图'], key: 'dataView' },
  { keywords: ['skill', 'knowledge', '知识库', '品牌知识', '行业知识'], key: 'knowledge' },
  { keywords: ['report', 'brief', 'daily', 'client report', 'share', '日报', '客户', '报告'], key: 'report' },
  { keywords: ['strategy', 'plan', 'pdca', 'cycle', 'weekly', 'schedule', 'task', '策略', '任务', '本周'], key: 'strategy' },
  { keywords: ['goal', 'target', 'red line', 'threshold', 'setting', 'configure', '目标', '红线'], key: 'goal' },
]

const PROMPT_INTENT_MAP = {
  'perf-overview': 'performance',
  'budget-opt': 'budget',
  'campaign-draft': 'campaign',
  'daily-report': 'report',
  'creative-perf': 'creative',
  'audience-insights': 'audience',
  'weekly-strategy': 'strategy',
  'goal-recommend': 'goal',
  'create-task': 'scheduledTask',
  'create-alert': 'alertRule',
  'create-view': 'dataView',
}

/**
 * Match user input to a response key
 */
const matchIntent = (input) => {
  const lower = input.toLowerCase()
  for (const mapping of KEYWORD_MAP) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      return mapping.key
    }
  }
  return 'fallback'
}

/* ── Data sources that add context to responses ──────────── */
export const DATA_SOURCES = [
  { id: 'adPerformance', label: '广告表现', icon: 'BarChart3' },
  { id: 'creativeLibrary', label: '素材表现', icon: 'Palette' },
  { id: 'brandProfile', label: '品牌约束', icon: 'Building2' },
  { id: 'audienceData', label: '受众表现', icon: 'Users' },
  { id: 'competitorData', label: '竞品动态', icon: 'Eye' },
  { id: 'marketTrends', label: '市场趋势', icon: 'TrendingUp' },
  { id: 'savedViews', label: '已保存视图', icon: 'BarChart3' },
  { id: 'brandSkills', label: '品牌 Skill', icon: 'Zap' },
  { id: 'industrySkills', label: '行业 Skill', icon: 'Sparkles' },
  { id: 'knowledgeBase', label: '知识库 L1–L4', icon: 'Database' },
]

/* ── Quick prompts by category ───────────────────────────── */
export const QUICK_PROMPTS = [
  { id: 'perf-overview', label: '今日美国表现', category: 'analysis', icon: 'BarChart3' },
  { id: 'budget-opt', label: '预算怎么调', category: 'optimize', icon: 'DollarSign' },
  { id: 'campaign-draft', label: '生成换新草稿', category: 'create', icon: 'Zap' },
  { id: 'daily-report', label: '创建日报模板', category: 'report', icon: 'FileBarChart' },
  { id: 'create-task', label: '创建定时任务', category: 'strategy', icon: 'Target' },
  { id: 'create-alert', label: '创建预警规则', category: 'optimize', icon: 'Settings' },
  { id: 'create-view', label: '保存分析视图', category: 'analysis', icon: 'BarChart3' },
  { id: 'creative-perf', label: '查看疲劳素材', category: 'analysis', icon: 'Palette' },
  { id: 'audience-insights', label: '受众问题', category: 'analysis', icon: 'Users' },
  { id: 'weekly-strategy', label: '本周任务', category: 'strategy', icon: 'Target' },
  { id: 'goal-recommend', label: '目标红线', category: 'optimize', icon: 'Settings' },
]

/* ── Public API ───────────────────────────────────────────── */

/**
 * Send a message to mock Luna AI and get a response.
 * Returns a promise that resolves after a simulated delay.
 *
 * @param {string} userMessage — The user's text input
 * @param {string[]} dataSources — Active data source IDs
 * @param {function} [onChunk] — Optional streaming callback (receives partial text)
 * @returns {Promise<object>} — { text, type, syncTarget?, dataCard?, actionCard? }
 */
export const sendToLuna = async (userMessage, dataSources = [], attachments = [], onChunk) => {
  const intentKey = attachments.length > 0 ? 'attachment' : matchIntent(userMessage)
  const response = attachments.length > 0
    ? buildAttachmentResponse(attachments, userMessage)
    : RESPONSES[intentKey] || RESPONSES.fallback
  return sendToLunaWithResponse(response, dataSources, onChunk)
}

/**
 * Get a quick-prompt response (same as sendToLuna but maps prompt ID → text)
 */
export const sendQuickPrompt = (promptId, dataSources, onChunk) => {
  const intentKey = PROMPT_INTENT_MAP[promptId]
  if (intentKey) {
    const response = RESPONSES[intentKey]
    return sendToLunaWithResponse(response, dataSources, onChunk)
  }
  const prompt = QUICK_PROMPTS.find((p) => p.id === promptId)
  return sendToLuna(prompt ? prompt.label : 'Help me', dataSources, [], onChunk)
}

const sendToLunaWithResponse = async (response, _dataSources, onChunk) => {
  const thinkDelay = 800 + Math.random() * 1000
  await sleep(thinkDelay)
  if (onChunk) {
    const words = response.text.split(' ')
    let accumulated = ''
    for (let i = 0; i < words.length; i++) {
      accumulated += (i === 0 ? '' : ' ') + words[i]
      onChunk(accumulated)
      await sleep(15 + Math.random() * 25)
    }
  }
  return {
    text: response.text,
    type: response.type,
    syncTarget: response.syncTarget || null,
    dataCard: response.dataCard || null,
    actionCard: response.actionCard || null,
    operation: response.actionCard?.operation || null,
    payload: response.syncTarget ? getSyncPayload(response.syncTarget) : null,
  }
}

/* ── Helpers ──────────────────────────────────────────────── */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
