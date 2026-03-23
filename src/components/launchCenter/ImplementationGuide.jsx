import { FileText, Database, Monitor, BrainCircuit, Server, ArrowRight, Code } from 'lucide-react'

const GUIDE_DATA = {
  statusBriefing: {
    title: 'Status Briefing',
    goal: 'User opens homepage and knows within 2 seconds: "Are my ads doing well?"',
    dataInputs: [
      { label: 'Campaign created_at', source: 'API: campaign.created_at -> calculate current Day' },
      { label: 'Aggregated KPIs', source: 'API: campaign insights (ROAS / Conversions / CPA / Spend)' },
      { label: 'KPI targets', source: 'API: optimize_goal.target_value' },
      { label: 'Conversion event name', source: 'API: optimize_goal.event_name (e.g. Purchase)' },
      { label: 'WoW change', source: 'Frontend: last 7 days vs previous 7 days comparison' },
      { label: 'Pending count', source: 'API: pending actions count (based on automation settings)' }
    ],
    outputs: [
      'Journey progress bar (3 segments, weight-based flex: 1:2:2)',
      'Grade rating (A/B/C/D)',
      'One-sentence summary',
      'Inline KPI strip (4 metrics: ROAS / Conversions(event) / CPA(event) / Spend)'
    ],
    processingLogic: [
      'Grade algorithm: A = current >= target && trend up; B = current >= 70% target && trend up; C = current >= 50% target; D = < 50%',
      'Progress bar: 3 segments with flex = phase.weight (1:2:2). Colors: completed -> success-500, active -> primary-500 + animate-pulse, upcoming -> gray-200',
      'KPI strip: ROAS shows mini progress bar (current/target*100)%. Conversions and CPA labels include event name from optimize_goal.event_name',
      'WoW calculation: (last7daysValue - prev7daysValue) / prev7daysValue * 100. Direction "up" -> success color, "down" -> error color. For CPA, direction is inverted (lower is better)'
    ],
    backendLogic: {
      input: [
        'campaign 表：created_at（广告创建时间）、phase（当前阶段字段：learning/optimization/scaling）',
        'campaign_insights 表：最近 14 天的每日数据，字段包含 spend（花费）、revenue（收入）、conversions（转化数）、clicks（点击数）、impressions（展示量）',
        'optimize_goal 表：target_value（目标值，如 ROAS 4.5）、event_name（转化事件名称，如 Purchase）',
        'user_settings 表：auto_apply_budget（预算自动应用开关）、auto_publish_campaigns（推荐广告自动发布开关）',
        'pending_actions 表：待处理操作记录'
      ],
      processing: [
        '计算投放天数：currentDay = 当前日期 - campaign.created_at，单位为天',
        '读取 campaign.phase 字段，直接获取当前所处阶段（learning/optimization/scaling）',
        '聚合最近 7 天的 campaign_insights：按 brandId 过滤，SUM(spend) 得到总花费，SUM(revenue) 得到总收入，SUM(conversions) 得到总转化数。计算 ROAS = 总收入 / 总花费，CPA = 总花费 / 总转化数',
        '用同样逻辑聚合前 7 天（第 8~14 天）的数据，计算环比变化：WoW = (本期值 - 上期值) / 上期值 × 100%。注意 CPA 的方向判断是反向的——CPA 下降表示优化（direction 应为 up）',
        '读取 optimize_goal 表获取用户设定的 ROAS 目标值和 CPA 目标值，以及 event_name（如 Purchase），event_name 用于前端显示 "Conversions (Purchase)"、"CPA (Purchase)"',
        '读取 user_settings 表的两个开关字段；关联查询 pending_actions 表 COUNT(*) WHERE status=\'pending\'，得到待处理操作数量',
        'LLM 处理（可选）：将上述所有数据（currentDay、phase、各 KPI 当前值和目标值、WoW 变化率、pendingCount）组装为结构化 prompt，发送给 LLM。Prompt 要求 LLM 以广告投放顾问的角色，评估广告整体健康状况，输出一个等级评分和一句话总结。LLM 失败时的 fallback：用程序化 gradeAlgorithm 计算等级（A = 当前值 ≥ 目标值且趋势上升；B = ≥70%；C = ≥50%；D = <50%），用模板拼接 summary'
      ],
      output: `{
  "currentDay": 18,
  "phase": "optimization",
  "kpis": {
    "roas": { "current": 2.8, "target": 4.5, "wow": "+23%", "direction": "up" },
    "conversions": { "current": 1093, "eventName": "Purchase", "wow": "+15%", "direction": "up" },
    "cpa": { "current": 38, "target": 15, "wow": "-12%", "direction": "up", "unit": "$", "eventName": "Purchase" },
    "spend": { "current": 2800, "budget": 3500, "unit": "$" }
  },
  "grade": "B+",
  "summary": "ROAS grew 23% in the last 7 days to 2.8...",
  "sentiment": "improving",
  "pendingCount": 2
}`
    },
    llm: {
      promptLogic: 'Send current KPI snapshot + targets + trend data. Prompt asks LLM to assess overall ad health and generate a concise briefing.',
      input: '{ currentDay, phase, kpis: { roas, conversions, cpa, spend }, targets: { roas, cpa }, wowChange: { roas, cpa, conversions }, pendingCount }',
      output: '{ grade: "B+", summary: "ROAS grew 23% in the last 7 days to 2.8, tracking toward your 4.5 target in ~35 days.", sentiment: "improving" }',
      fallback: 'Template: "ROAS grew {wow}% in the last 7 days to {current}, tracking toward your {target} target in ~{expectedDays} days. CPA down {cpaWow}% to ${cpaCurrent}."'
    },
    apis: [
      'GET /api/dashboard/briefing?brandId={brandId}',
      'POST /api/llm/briefing (optional)'
    ],
    notes: [
      'Grade badge: w-16 h-16 rounded-xl bg-primary-50',
      'KpiMini: inline-flex, text-xs, mini progress bar + trend arrow',
      'Conversions and CPA display event name in label: "Conversions (Purchase)", "CPA (Purchase)"'
    ]
  },
  yourActions: {
    title: 'Your Actions',
    goal: 'Show user what they need to do based on their automation settings.',
    dataInputs: [
      { label: 'Pending budget approvals', source: 'API: GET /api/budget/pending (when auto-apply OFF)' },
      { label: 'Pending campaign publishes', source: 'API: GET /api/campaigns/recommended?status=pending (when auto-publish OFF)' },
      { label: 'Performance alerts', source: 'API: GET /api/alerts/performance (KPI changes needing attention)' },
      { label: 'AI creatives for review', source: 'API: GET /api/creatives?source=ai&status=new' }
    ],
    outputs: [
      'Action list: budget approval, campaign publish, performance review, creative review',
      'Each action links to relevant page via View Details',
      'Actions are conditional: budget/campaign items only show when auto-mode is OFF',
      'Budget approval: summary format (X increase / X decrease / X pause), no individual campaign names'
    ],
    processingLogic: [
      '4 action types, each maps to a navigateTarget page: budget_approval -> adManagerV3, campaign_publish -> autoRegeneration, performance_review -> optimizeGoals, creative_review -> aiGenerate',
      'budget_approval & campaign_publish only appear when auto_apply_budget / auto_publish_campaigns is OFF in user settings',
      'priority field determines left border color: high -> border-l-warning-500, medium -> border-l-primary-300, low -> border-l-gray-300',
      'Empty state: when PENDING_ACTIONS.length === 0, show CheckCircle icon + "All caught up! No actions needed."',
      'Each action card shows: type icon (with bg color) + title + campaign tag + description + detail + View Details button + timeAgo'
    ],
    backendLogic: {
      input: [
        'user_settings 表：auto_apply_budget、auto_publish_campaigns 两个布尔开关',
        'budget_suggestions 表：status 字段（pending/applied/rejected）、action_type 字段（increase/decrease/pause）',
        'recommended_campaigns 表：status 字段（pending/published/rejected）、campaign_name',
        'campaign_insights 表：最近 14 天的 ROAS、CPA 每日数据',
        'ai_creatives 表：source 字段（ai/user）、status 字段（new/reviewed/used）'
      ],
      processing: [
        '读取 user_settings 的两个开关值',
        '预算审批 action：仅当 auto_apply_budget = OFF 时生成。查询 budget_suggestions WHERE status=\'pending\'，按 action_type 分组 COUNT：得到 increase 数量、decrease 数量、pause 数量。组装 detail 文案如 "5 campaigns suggested increase · 3 suggested decrease · 2 suggested pause"。设 priority = high',
        '推荐广告发布 action：仅当 auto_publish_campaigns = OFF 时生成。查询 recommended_campaigns WHERE status=\'pending\'，COUNT 得到待发布数量，取各 campaign_name 拼接为 detail。设 priority = high',
        '绩效回顾 action：不依赖开关，始终检查。聚合 campaign_insights 最近 7 天和前 7 天的 ROAS 及 CPA，计算变化幅度。若任一指标变化绝对值 > 8%（阈值可配置），则生成此 action。detail 格式为 "Current ROAS {current} → Target {target} · CPA ${current} → Target ${target}"。设 priority = medium',
        '创意审核 action：查询 ai_creatives WHERE source=\'ai\' AND status=\'new\'，COUNT 得到新生成数量。若 count > 0，生成此 action。detail 格式为 "{count} AI variants ready · Upload custom creatives to auto-build test campaigns"。设 priority = low',
        '每个 action 都需要附带 timeAgo 字段：用当前时间减去对应数据的最近更新时间，格式化为 "2h ago"、"1d ago" 等相对时间'
      ],
      output: `[
  {
    "id": "act-1", "type": "budget_approval",
    "title": "Review budget optimization suggestions",
    "campaign": "Budget Optimization",
    "description": "Auto-apply is OFF. 2 budget adjustments pending your approval.",
    "detail": "5 campaigns suggested increase · 3 suggested decrease · 2 suggested pause",
    "timeAgo": "2h ago", "priority": "high"
  },
  { "id": "act-2", "type": "campaign_publish", ... },
  { "id": "act-3", "type": "performance_review", ... },
  { "id": "act-4", "type": "creative_review", ... }
]`
    },
    llm: null,
    apis: [
      'GET /api/actions/pending?brandId={brandId}'
    ],
    notes: [
      'Navigate targets map action type to specific page in the app',
      'budget_approval detail uses aggregated format: "5 campaigns suggested increase · 3 suggested decrease · 2 suggested pause"'
    ]
  },
  weeklyReport: {
    title: 'Performance Report',
    goal: 'Insights Brief format report with grade, KPI scorecard, daily ROAS+CPA chart, highlights & key insights, AI actions summary, and next-7-days outlook.',
    dataInputs: [
      { label: 'KPIs (last 7 days)', source: 'API: campaign insights aggregated by last 7 days' },
      { label: 'Daily breakdown', source: 'API: campaign insights daily (ROAS + CPA), X-axis as month-day format (Mar 8, Mar 9...)' },
      { label: 'Conversion events', source: 'API: optimize_goal event name (e.g. Purchase)' },
      { label: 'AI action log', source: 'API: system_action_log -> count by type (budget_optimize, recommend_ads, ai_creatives)' },
      { label: 'KPI targets', source: 'API: optimize_goal' }
    ],
    outputs: [
      'Grade + AI summary',
      'KPI scorecard (2x2): ROAS / Conversions(event) / CPA(event) / Spend with target & WoW',
      'LineChart: dual line ROAS (purple #7033F5) + CPA (orange #FF7D00), dual Y-axis, 7 days',
      'Insights & Analysis: highlights[] + keyInsights[]',
      'AI Actions summary: budget optimize count, recommended campaigns count, AI creatives count (plain number, no suffix)',
      'Next 7 Days outlook'
    ],
    processingLogic: [
      'Grade: same gradeAlgorithm as Status Briefing',
      'KPI Scorecard: 4 cards in grid-cols-2. Each card shows label (with eventName for Conversions/CPA), current value, target, WoW badge with direction arrow',
      'Daily Chart: Recharts LineChart with dual Y-axis. Left Y-axis for ROAS (domain [0,5]), right Y-axis for CPA. X-axis shows month-day dates (Mar 8, Mar 9...). Two Line components with dot markers',
      'AI Actions Summary: iterate aiActionsSummary object with 3 keys (budgetOptimize, recommendedCampaigns, aiCreatives). Each renders: icon + label + detail text + count number. Icon/color mapping: budgetOptimize -> DollarSign/success, recommendedCampaigns -> Layers/primary, aiCreatives -> Sparkles/warning'
    ],
    backendLogic: {
      input: [
        'campaign_insights 表：最近 14 天的每日明细数据（spend, revenue, conversions, clicks, impressions）',
        'optimize_goal 表：target_value、event_name',
        'system_action_log 表：最近 7 天的操作日志，字段包含 type（budget_optimize/recommend_ads/ai_creatives）、timestamp、related_ids'
      ],
      processing: [
        'KPI 聚合：聚合 campaign_insights 最近 7 天，SUM(spend/revenue/conversions)，计算 ROAS = SUM(revenue)/SUM(spend)，CPA = SUM(spend)/SUM(conversions)。同理聚合前 7 天，计算各 KPI 的 WoW 变化百分比',
        '每日明细：按 date GROUP BY，每天分别计算 ROAS = 当日revenue/当日spend，CPA = 当日spend/当日conversions。日期格式化为 "Mar 8"（月份缩写 + 日期）',
        '目标值：读取 optimize_goal 获取 ROAS target、CPA target、event_name',
        'AI 操作统计：查询 system_action_log 最近 7 天，按 type GROUP BY 后 COUNT：type=\'budget_optimize\' 的条数作为 budgetOptimize.count；type=\'recommend_ads\' 作为 recommendedCampaigns.count；type=\'ai_creatives\' 作为 aiCreatives.count。对每种 type，再通过 related_ids 关联查询获取 detail 说明：budget_optimize → 关联 budget_suggestions 表统计涉及的 campaigns 数和 adsets 数；recommend_ads → 关联 recommended_campaigns 表取 campaign 受众类型名称列表；ai_creatives → 关联 ai_creatives 表按 creative_type GROUP BY 得到各风格名称',
        'LLM 处理（可选）：将所有聚合数据（KPI 当前值 + 目标值 + WoW + 每日趋势 + AI 操作统计）组装为 prompt。Prompt 指示 LLM 以数据分析师角色，生成：(1) grade 等级评分 (2) summary 一段话总结 (3) highlights 数组——4 条亮点，每条基于具体数据指标（如 ROAS 增长百分比、转化数、CPA 变化、预算利用率）(4) keyInsights 数组——4 条洞察，每条给出具体建议 (5) nextOutlook 一句话展望',
        'LLM 失败时的 fallback：程序化模板拼接，基于 WoW 方向和幅度生成 highlights（如 "ROAS improved from {prev} to {current}, growing {wow}%"），基于目标达成率生成 insights（如 "CPA at {percent}% of target, consider adjusting target"）'
      ],
      output: `{
  "dateRange": "Mar 8 – Mar 14",
  "grade": "B+",
  "summary": "ROAS improved 23% WoW to 2.8...",
  "highlights": ["ROAS improved from 2.3 to 2.8...", ...],
  "keyInsights": ["Top 3 campaigns driving 72%...", ...],
  "kpis": {
    "roas": { "current": 2.8, "target": 4.5, "wow": "+23%", "direction": "up" },
    "conversions": { "current": 1093, "eventName": "Purchase", "wow": "+15%", "direction": "up" },
    "cpa": { "current": 38, "target": 15, "wow": "-12%", "direction": "up", "eventName": "Purchase" },
    "spend": { "current": 2800, "budget": 3500 }
  },
  "dailyData": [{ "day": "Mar 8", "roas": 2.4, "cpa": 42 }, ...],
  "aiActionsSummary": {
    "budgetOptimize": { "count": 12, "detail": "8 campaigns · 4 adsets analyzed" },
    "recommendedCampaigns": { "count": 3, "detail": "Lookalike, Retargeting, Interest Expansion" },
    "aiCreatives": { "count": 5, "detail": "Product Hero, Lifestyle, UGC styles" }
  },
  "nextOutlook": "Predicted ROAS: 3.0–3.3..."
}`
    },
    llm: {
      promptLogic: 'Send 7-day KPI data + targets + daily trend + AI action counts. Prompt asks LLM to generate a performance analysis brief with highlights, insights, and forward outlook.',
      input: '{ kpis: { roas, conversions, cpa, spend }, targets, wowChanges, dailyData: [{ day, roas, cpa }], aiActionCounts: { budgetOptimize, recommendedCampaigns, aiCreatives }, conversions: { eventName } }',
      output: '{ "grade": "B+", "summary": "ROAS improved 23% to 2.8...", "highlights": ["ROAS improved from 2.3 to 2.8...", "7-day cumulative conversions: 1,093...", "CPA optimized from $43 to $38...", "Budget utilization at 80%..."], "keyInsights": ["Top 3 campaigns driving 72%...", "CPA target of $15 is aggressive...", "Creative fatigue detected...", "Budget decrease applied..."], "nextOutlook": "Predicted ROAS: 3.0-3.3..." }',
      fallback: 'Template concatenation: KPI change summary + budget utilization percentage + AI action counts per type'
    },
    apis: [
      'GET /api/reports/performance?brandId={brandId}&days=7',
      'POST /api/llm/performance-report (optional)'
    ],
    notes: [
      'Drawer width w-[560px], shadow-2xl',
      'Insights format mirrors CrossChannelAISummary aiInsights structure from adManagerV3',
      'highlights rendered with Star icon (primary-400), keyInsights with Lightbulb icon (warning-400)'
    ]
  },
  activityLog: {
    title: 'Activity Log',
    goal: 'System activity log with 5 log types, date-grouped timeline, disabled styling for auto-mode OFF entries.',
    dataInputs: [
      { label: 'Action log', source: 'API: GET /api/actions/log?type=all&limit=50' }
    ],
    outputs: [
      'Filter pills (All / Budget / Campaigns / Creatives)',
      'Date-grouped timeline (Today / Yesterday / Mar 13 format, no weekday names)',
      'Each entry: time + type icon + title + summary, expandable for details',
      'Disabled (gray) entries for auto-apply OFF and auto-publish OFF status'
    ],
    processingLogic: [
      '5 log types: budget_analysis (DollarSign/success), budget_apply (DollarSign/gray when disabled), recommend_campaign (Layers/primary), recommend_publish (Layers/gray when disabled), ai_creative (Sparkles/warning)',
      'Filter mapping: Budget -> [budget_analysis, budget_apply], Campaigns -> [recommend_campaign, recommend_publish], Creatives -> [ai_creative]',
      'Date grouping: groupByDate(logs) converts timestamp to date key. Today/Yesterday detection via toDateString() comparison. Other dates formatted as "Mar 13" (month short + day, no weekday)',
      'Disabled entries (disabled: true): icon bg -> gray-100, all text -> text-gray-400, not expandable (onClick disabled), right side shows "OFF" badge instead of chevron',
      'Expanded detail shows: detail text + platform + result badge. Result badge colors: Completed -> success-50/600, Ready -> primary-50/600, Generated -> warning-50/600, other -> gray-100/600'
    ],
    backendLogic: {
      input: [
        'system_action_log 表：最近 7 天的所有操作日志（id, timestamp, type, title, description, related_ids）',
        'user_settings 表：auto_apply_budget、auto_publish_campaigns 两个布尔开关',
        'budget_suggestions 表：预算建议详情（活跃预算总额、建议预算总额、各操作类型数量）',
        'recommended_campaigns 表：推荐广告详情（campaign 数量、受众类型、创意来源）',
        'ai_creatives 表：AI 创意详情（creative_type 分类数量）'
      ],
      processing: [
        '查询 system_action_log 表：按 brandId 过滤，日期范围最近 7 天，ORDER BY timestamp DESC，LIMIT 50',
        '支持按 type 参数过滤，5 种日志类型：budget_analysis、budget_apply、recommend_campaign、recommend_publish、ai_creative',
        'budget_analysis 类型的处理：通过 related_ids 关联 budget_suggestions 表，聚合计算——当前活跃 campaign 的每日预算总和（SUM WHERE status=\'active\'），建议调整后的总预算，以及按 action_type 分组的数量统计（increase X 条、decrease X 条、pause X 条、maintain X 条）。组装 detail 文案如 "Active total budget: $2,800/day → Suggested total budget: $3,100/day. 5 increase · 3 decrease · 2 pause · 2 maintain."',
        'budget_apply 类型的处理：读取 user_settings.auto_apply_budget 的值。若为 OFF，设置 disabled = true，description 固定为 "Auto-apply is OFF. Please review and apply manually."，detail 为空，result 为 "Pending"。若为 ON，则正常记录应用结果',
        'recommend_campaign 类型的处理：通过 related_ids 关联 recommended_campaigns 表，获取本次推荐的 campaign 数量，以及每个 campaign 的受众类型描述（如 "Lookalike US 1%"）和创意来源描述（如 "2 new AI-generated"）。组装为 detail 文案',
        'recommend_publish 类型的处理：读取 user_settings.auto_publish_campaigns 的值。若为 OFF，设置 disabled = true，处理逻辑与 budget_apply 相同',
        'ai_creative 类型的处理：通过 related_ids 关联 ai_creatives 表，按 creative_type 字段 GROUP BY 并 COUNT，得到各风格的数量（如 "3 Product Hero · 1 Lifestyle · 1 UGC style"）。组装为 description'
      ],
      output: `[
  {
    "id": "log-1", "timestamp": "2026-03-14T14:30:00", "type": "budget_analysis",
    "title": "Budget optimization analysis completed",
    "description": "Analyzed 12 campaigns and generated budget adjustment suggestions",
    "detail": "Active total budget: $2,800/day → Suggested: $3,100/day. 5 increase · 3 decrease · 2 pause · 2 maintain.",
    "result": "Completed", "disabled": false, "platform": "Meta"
  },
  {
    "id": "log-2", "timestamp": "2026-03-14T14:30:00", "type": "budget_apply",
    "title": "Auto-apply budget optimization",
    "description": "Auto-apply is OFF. Please review and apply manually.",
    "detail": "", "result": "Pending", "disabled": true, "platform": "Meta"
  },
  ...
]`
    },
    llm: null,
    apis: [
      'GET /api/actions/log?brandId={brandId}&type={filter}&dateRange=last7days&limit=50'
    ],
    notes: [
      'budget_apply always follows budget_analysis with same timestamp',
      'recommend_publish always follows recommend_campaign with same timestamp',
      'Default view: last 7 days of logs'
    ]
  },
  kpiMilestones: {
    title: 'KPI Progress',
    goal: 'Visualize KPI progress with ROAS trend chart and Current -> Target display for ROAS and CPA(event).',
    dataInputs: [
      { label: 'KPI daily trend', source: 'API: campaign insights by day (14+ days)' },
      { label: 'KPI targets', source: 'API: optimize_goal' },
      { label: 'Conversion event name', source: 'API: optimize_goal.event_name' },
      { label: 'Per-campaign ROAS/CPA', source: 'API: per-campaign insights (for diagnosis)' }
    ],
    outputs: [
      'ROAS line chart + target reference line (dashed)',
      'Current -> Target display: ROAS + CPA(event) with expected days and progress bar',
      'Secondary KPIs: CTR / CVR with benchmark and WoW',
      'Conditional diagnosis panel with recommendations'
    ],
    processingLogic: [
      'ROAS Trend Chart: Recharts LineChart with ReferenceLine at target value (stroke dashed, opacity 0.5). X-axis "Day 1"..."Day 18". Y-axis domain [0, 5]',
      'Progress percentage: displayed as rounded badge (primary-50), calculated as Math.round(current / target * 100)',
      'Target Progress cards (2 cards: ROAS + CPA): each shows current -> target with ArrowRight icon + "expected in ~X days" text. Mini progress bar calculation differs by metric type:',
      '  - ROAS: Math.min(Math.round(current / target * 100), 100)% (higher is better)',
      '  - CPA: Math.min(Math.round(target / current * 100), 100)% (lower is better, use inverse ratio)',
      'Secondary KPIs: display current value + target or benchmark + WoW badge. Badge color: improving/above -> success-50/600, other -> warning-50/600',
      'Diagnosis Panel: only render when diagnosis.show === true. Displays warning bg + AlertTriangle icon + diagnosis text + Lightbulb recommendations list'
    ],
    backendLogic: {
      input: [
        'campaign_insights 表：最近 18 天以上的每日数据（spend, revenue, conversions, clicks, impressions），按 brandId 过滤',
        'optimize_goal 表：ROAS 目标值、CPA 目标值、event_name',
        'campaign_insights 表（按 campaign_id 维度）：用于诊断表现最差的 campaign'
      ],
      processing: [
        'ROAS 趋势构建：按日期聚合 campaign_insights，每天计算 ROAS = SUM(revenue)/SUM(spend)。构建 trend 数组，格式为 [{ day: "Day 1", value: 0.8 }, ...]。从第 1 天到当前天数，如果某天无数据则跳过',
        '预计达标天数计算：取最近 7 天的 ROAS 值，计算平均每日增长量 avgDailyGrowth = (最近一天ROAS - 7天前ROAS) / 7。若 avgDailyGrowth > 0，expectedDays = (target - current) / avgDailyGrowth，向上取整。若 avgDailyGrowth ≤ 0（趋势下降或停滞），返回 expectedDays = null，前端显示为 "stalled"',
        'CPA 的 expectedDays 方向相反：avgDailyDecline = (7天前CPA - 最近一天CPA) / 7，expectedDays = (current - target) / avgDailyDecline',
        '置信度计算：取最近 7 天的 ROAS 值，计算标准差 σ 和均值 μ。波动系数 CV = σ/μ。若 CV < 0.1 则 confidence = 90%；CV < 0.2 则 confidence = 80%；CV < 0.3 则 confidence = 65%；其他 confidence = 50%',
        '次要 KPI 计算：聚合最近 7 天——CTR = SUM(clicks)/SUM(impressions)×100，CVR = SUM(conversions)/SUM(clicks)×100。同理聚合前 7 天计算 WoW。与 benchmark 或行业数据对比判断 status（above/below/improving）',
        '诊断数据：按 campaign_id 维度聚合最近 7 天的 ROAS，找出 ROAS 最低的 campaign 及其名称和 ROAS 值，用于诊断面板展示',
        'LLM 处理（可选）：将 primary KPI 趋势数据 + 目标 + 表现最差 campaign 信息组装为 prompt。Prompt 指示 LLM 以广告优化顾问的角色，诊断当前绩效差距原因，给出 3 条具体可操作的建议（如 "刷新某 campaign 的创意"、"将预算从 A 市场转移到 B 市场"、"添加规则：暂停 ROAS < 2.0 的 adset"）。LLM 失败时 fallback：用模板 "ROAS at {progress}% of target. Growth rate suggests reaching {target} in ~{expectedDays} days."'
      ],
      output: `{
  "primary": { "metric": "ROAS", "current": 2.8, "target": 4.5, "confidence": 78, "trend": [{ "day": "Day 1", "value": 0.8 }, ...] },
  "secondary": [
    { "metric": "CPA", "current": 38, "target": 15, "unit": "$", "eventName": "Purchase", "status": "improving", "wow": "-12%" },
    { "metric": "CTR", "current": 2.1, "benchmark": 2.0, "unit": "%", "status": "above", "wow": "+5%" },
    { "metric": "CVR", "current": 3.8, "benchmark": 3.5, "unit": "%", "status": "above", "wow": "+8%" }
  ],
  "targets": [
    { "metric": "ROAS", "current": 2.8, "target": 4.5, "expectedDays": 35 },
    { "metric": "CPA", "current": 38, "target": 15, "unit": "$", "eventName": "Purchase", "expectedDays": 42 }
  ],
  "diagnosis": { "show": true, "text": "ROAS at 62% of target...", "recommendations": ["Refresh creatives...", "Shift 20% budget...", "Add rule..."] }
}`
    },
    llm: {
      promptLogic: 'Send primary KPI trend data + target + per-campaign breakdown. Prompt asks LLM to diagnose performance gap and recommend actions.',
      input: '{ metric: "ROAS", current: 2.8, target: 4.5, trend: [{ day, value }], worstCampaign: { name, roas }, activeRules: [...] }',
      output: '{ "diagnosis": "ROAS at 62% of target. Growth rate (+12% per 7 days) suggests reaching 4.5 in ~35 days. Main drag: Brand Growth campaign.", "recommendations": ["Refresh creatives on Brand Growth campaign", "Shift 20% budget from IN to US market", "Add rule: pause adsets with ROAS < 2.0 after 5 days"], "confidence": 78 }',
      fallback: 'Template: "ROAS at {progress}% of target. Growth rate suggests reaching {target} in ~{expectedDays} days."'
    },
    apis: [
      'GET /api/kpi/progress?brandId={brandId}',
      'POST /api/llm/kpi-diagnosis (optional)'
    ],
    notes: [
      'No milestones timeline — replaced with Current -> Target cards',
      'CPA label includes event name: "CPA (Purchase)"'
    ]
  },
  journeyPhases: {
    title: 'Brand Phases',
    goal: 'Show 3-phase campaign lifecycle. Phases are performance-based, not time-based.',
    dataInputs: [
      { label: 'Current Day + phase', source: 'Same as Status Briefing' },
      { label: 'Phase data', source: 'Campaign insights aggregated by phase date range' },
      { label: 'Automation settings', source: 'API: user settings (auto_apply_budget, auto_publish_campaigns)' }
    ],
    outputs: [
      '3 expandable phase cards (Learning / Optimization / Scaling)',
      'Each: system actions + user actions conditional on automation settings',
      'typicalDays as rough estimate (not fixed windows)',
      '"If not meeting targets" contingency panel'
    ],
    processingLogic: [
      'Progress bar: 3 segments with flex = phase.weight (Learning: 1, Optimization: 2, Scaling: 2). Colors by status: completed -> success-500, active -> primary-500, upcoming -> gray-200',
      'Default expanded phase: find first phase with status === "active". Use useState initialized to active phase id',
      'Phase card styling by status: completed -> bg-success-50 border-success-200, active -> bg-primary-50 border-primary-200, upcoming -> bg-gray-50 border-gray-200',
      'Phase icons: completed -> CheckCircle (success-500), active -> Loader2 (primary-500, animate-spin), upcoming -> Circle (gray-300)',
      'User actions render as checklist: done === true -> CheckCircle + line-through text-gray-400, done === false -> Circle + normal text-gray-700',
      'Metrics section: only render when phase.metrics.cpaStart or phase.metrics.roasStart is truthy. Shows "CPA: $X -> $Y" and "ROAS: X -> Y" format',
      '"If Not Meeting Targets" panel: always visible, bg-warning-50 border-warning-200, renders ifNotMeetingTargets array with Shield icons'
    ],
    backendLogic: {
      input: [
        'campaign 表：created_at（创建时间）',
        'campaign_insights 表：全周期每日数据（用于计算各阶段指标和判断阶段切换）',
        'optimize_goal 表：ROAS target、CPA target（用于阶段判断阈值）',
        'budget_approval_log 表：用户预算审批操作记录',
        'campaign_publish_log 表：用户广告发布操作记录'
      ],
      processing: [
        '计算 currentDay = 当前日期 - campaign.created_at，单位为天',
        '阶段判断（基于效果指标，非固定时间）：默认从 learning 阶段开始',
        'Learning → Optimization 的切换条件：(1) 已运行至少 5 天（有足够数据量）(2) CPA 波动趋于稳定——计算最近 5 天 CPA 的标准差/均值（CV 值），CV < 0.3 则认为 baseline metrics 已建立。两个条件同时满足则切换',
        'Optimization → Scaling 的切换条件：(1) ROAS 持续达到目标的 70% 以上——最近 5 天中至少 4 天 ROAS ≥ target × 0.7 (2) CPA 保持稳定——CV < 0.2。两个条件同时满足则切换',
        '若从未满足切换条件，则始终停留在当前阶段',
        '各阶段指标计算：对已完成和进行中的阶段，聚合该阶段日期范围内的 campaign_insights——cpaStart = 阶段第 1 天的 CPA，cpaEnd = 阶段最后一天的 CPA；roasStart = 阶段第 1 天的 ROAS，roasEnd = 阶段最后一天的 ROAS。未来阶段的 metrics 全部为 null',
        '系统操作列表（systemActions）：每个阶段返回预定义的静态文案数组（存储在配置中，非数据库），描述该阶段系统自动执行的操作',
        '用户操作列表（userActions）：每个阶段返回预定义的操作项文案，done 状态通过查询实际操作记录来判断——查询 budget_approval_log 是否有该阶段时间范围内的审批记录（对应 "approve budget" 的 done 值）；查询 campaign_publish_log 是否有发布记录（对应 "publish campaigns" 的 done 值）',
        '未达标应对措施（ifNotMeetingTargets）：返回预定义的静态文案数组'
      ],
      output: `{
  "currentDay": 18,
  "phases": [
    {
      "id": "learning", "label": "Learning", "typicalDays": "Need 7–14 days", "weight": 1, "status": "completed",
      "systemActions": ["Collect audience, creative...", ...],
      "userActions": [{ "text": "Review and approve budget...", "done": true }, ...],
      "metrics": { "cpaStart": 52, "cpaEnd": 38, "roasStart": 1.2, "roasEnd": 2.1 }
    },
    { "id": "optimization", "status": "active", ... },
    { "id": "scaling", "status": "upcoming", ... }
  ],
  "ifNotMeetingTargets": ["System auto-reduces budget...", ...]
}`
    },
    llm: null,
    apis: [
      'GET /api/campaign/{brandId}/lifecycle'
    ],
    notes: [
      'Phase transitions are performance-based, not time-based',
      'typicalDays displayed in badge position: "Need 7-14 days" (no parentheses)',
      'User actions reflect the 4 real user scenarios: approve budget, publish campaigns, review performance, upload creatives'
    ]
  },
  controlMatrix: {
    title: 'Control & Permissions',
    goal: 'Clear visualization of user vs AI control boundaries.',
    dataInputs: [
      { label: 'All static', source: 'No dynamic data needed' }
    ],
    outputs: [
      'Matrix table (9 rows x 3 columns: You / AI / Shared)',
      'Creative Generation: both You and AI checked (both can generate)',
      'Highlights: auto-apply and auto-publish as shared (configurable)',
      '3 detail cards: Budget Safeguards / Creative Ownership / No Lock-In'
    ],
    processingLogic: [
      'Matrix table: iterate CONTROL_MATRIX array. Each row has { action, you, ai, shared, desc }. Render CheckCircle (primary-500) when field is true, empty cell when false',
      'Creative Generation row: you=true AND ai=true (both checked) — desc explains both parties can generate',
      'Budget Optimization and Recommended Campaigns rows: shared=true — these are configurable via auto-apply/auto-publish toggles',
      'Detail cards: iterate CONTROL_DETAILS array. Each card has { icon, title, items[] }. Icon mapping: Shield -> Shield icon, CheckCircle -> CheckCircle icon, Unlock -> Unlock icon',
      'Budget Safeguards card includes prerequisite note about ad accounts not being managed on other platforms simultaneously'
    ],
    backendLogic: null,
    llm: null,
    apis: [],
    notes: [
      'Table: rounded-2xl overflow-hidden',
      'Purely static data — no API calls needed',
      'Detail cards: grid-cols-1 gap-4, bg-gray-50 rounded-lg p-5'
    ]
  },
  creative: {
    title: 'Creative Dashboard',
    goal: 'Show creative testing velocity, type distribution, and top performers. Standalone Drawer only (not in Performance Report).',
    dataInputs: [
      { label: 'Creative list', source: 'API: ad list + status + type' },
      { label: 'Creative performance', source: 'API: ad insights (CTR / CPA / ROAS)' }
    ],
    outputs: [
      'Velocity stats (4 mini cards): tested / active / paused / winning',
      'Type distribution bar chart (vertical)',
      'Top Performers card grid'
    ],
    processingLogic: [
      'Velocity: 4 cards in grid-cols-4. Each shows label + large number + optional WoW change badge. Color per card: tested -> primary-600, active -> success-600, paused -> gray-600, winning -> warning-600',
      'Type Distribution: Recharts BarChart with layout="vertical". X-axis shows percentage (0-40%), Y-axis shows creative type names. Bar colors use purple gradient array: [#7033F5, #9B6BFF, #B794FF, #D4BFFF, #EDE5FF]',
      'Top Performers: card list. Each card shows: name + type label + status badge + placeholder preview (purple gradient) + metrics row (CTR% / ROAS / daysTested). Status badge styles: top -> success-50/700, active -> primary-50/700, paused -> gray-100/500'
    ],
    backendLogic: {
      input: [
        'ad 表 + ad_creative 表：按 brandId 关联，包含 creative_id、status（active/paused）、performance_rank（top/normal）、creative_type（Product Hero/Lifestyle/UGC/Carousel/Video）、created_at',
        'ad_insights 表：每个广告的投放数据（clicks, impressions, spend, revenue, first_served_date）'
      ],
      processing: [
        '速度统计（velocity）：tested = COUNT(*) 全部 creative 总数；active = COUNT(*) WHERE status=\'active\'；paused = COUNT(*) WHERE status=\'paused\'；winning = COUNT(*) WHERE status=\'active\' AND performance_rank=\'top\'（表现最佳且仍在投放的创意）',
        'testedWoW = COUNT(created_at 在最近 7 天) - COUNT(created_at 在前 7 天)，表示本期比上期多测试了几个创意；activeWoW = 同理计算活跃创意的环比变化',
        '类型分布（typeBreakdown）：按 creative_type GROUP BY 并 COUNT，每种类型的百分比 = 该类型数量 / 总数 × 100，四舍五入到整数',
        '最佳表现（topPerformers）：关联 ad_insights 表，对每个 creative 聚合——CTR = SUM(clicks)/SUM(impressions)×100（保留一位小数），ROAS = SUM(revenue)/SUM(spend)（保留一位小数），daysTested = 当前日期 - first_served_date（天数）。按 ROAS 降序排列，取前 3 条',
        '每条 topPerformer 附带 status 判断：若 performance_rank=\'top\' 则 status=\'top\'，否则按原始 ad.status 赋值'
      ],
      output: `{
  "velocity": { "tested": 6, "active": 5, "paused": 2, "winning": 2, "testedWoW": "+2", "activeWoW": "+1" },
  "typeBreakdown": [
    { "type": "Product Hero", "percentage": 35 },
    { "type": "Lifestyle", "percentage": 28 },
    { "type": "UGC Style", "percentage": 18 },
    { "type": "Carousel", "percentage": 12 },
    { "type": "Video", "percentage": 7 }
  ],
  "topPerformers": [
    { "id": 1, "name": "Summer V3", "type": "Product Hero", "ctr": 3.2, "roas": 4.1, "status": "top", "daysTested": 5 },
    { "id": 2, "name": "Lifestyle V2", "type": "Lifestyle", "ctr": 2.8, "roas": 3.5, "status": "active", "daysTested": 3 }
  ]
}`
    },
    llm: null,
    apis: [
      'GET /api/creatives?brandId={brandId}&status=all',
      'GET /api/creatives/insights?brandId={brandId}'
    ],
    notes: [
      'Creative Performance removed from Performance Report Drawer — only in this standalone Drawer',
      'Bar chart: Recharts BarChart layout="vertical", barSize=20, radius [0,4,4,0]'
    ]
  }
}

const ImplementationGuide = ({ module }) => {
  const guide = GUIDE_DATA[module]
  if (!guide) return null

  return (
    <div className="space-y-5">
      {/* Goal */}
      <div className="bg-primary-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Monitor className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-semibold text-gray-900">Goal</span>
        </div>
        <p className="text-sm text-gray-700">{guide.goal}</p>
      </div>

      {/* Data Inputs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">Data Inputs</span>
        </div>
        <div className="space-y-2">
          {guide.dataInputs.map((input, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-gray-700">{input.label}</span>
                <span className="text-gray-500 ml-1">{input.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Processing Logic */}
      {guide.backendLogic && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Backend Processing Logic</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {/* Input */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Database className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs font-semibold text-gray-700">输入数据</span>
              </div>
              <div className="space-y-1.5">
                {guide.backendLogic.input.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                    <span className="font-mono leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Processing */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Server className="w-3.5 h-3.5 text-success-400" />
                <span className="text-xs font-semibold text-gray-700">处理逻辑</span>
              </div>
              <div className="space-y-1.5">
                {guide.backendLogic.processing.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-300 mt-1.5 shrink-0" />
                    <span className="font-mono leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Output */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-warning-400" />
                <span className="text-xs font-semibold text-gray-700">输出数据</span>
              </div>
              <pre className="text-[11px] text-gray-700 font-mono leading-relaxed bg-white rounded p-3 border border-gray-200 whitespace-pre-wrap">{guide.backendLogic.output}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Frontend Processing Logic */}
      {guide.processingLogic && guide.processingLogic.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Frontend Processing Logic</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {guide.processingLogic.map((logic, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                <span className="font-mono leading-relaxed">{logic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outputs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">UI Outputs</span>
        </div>
        <ul className="space-y-1.5">
          {guide.outputs.map((output, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
              {output}
            </li>
          ))}
        </ul>
      </div>

      {/* LLM Integration */}
      {guide.llm && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">LLM Integration (Optional)</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-3 text-xs">
            <div>
              <span className="text-gray-500 font-medium">Prompt Logic: </span>
              <span className="text-gray-700">{guide.llm.promptLogic}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Input: </span>
              <span className="text-gray-700 font-mono">{guide.llm.input}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Output JSON: </span>
              <pre className="text-gray-700 font-mono mt-1 whitespace-pre-wrap bg-white rounded p-2 border border-gray-200 text-[11px] leading-relaxed">{guide.llm.output}</pre>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Fallback (no LLM): </span>
              <span className="text-warning-600 font-mono">{guide.llm.fallback}</span>
            </div>
          </div>
        </div>
      )}

      {/* APIs */}
      {guide.apis.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Backend APIs</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            {guide.apis.map((api, i) => (
              <div key={i} className="text-xs font-mono text-gray-700">{api}</div>
            ))}
          </div>
        </div>
      )}

      {/* Frontend Notes */}
      {guide.notes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Frontend Notes</span>
          </div>
          <ul className="space-y-1.5">
            {guide.notes.map((note, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImplementationGuide
