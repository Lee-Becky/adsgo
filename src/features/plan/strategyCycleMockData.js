export const MOCK_AVAILABLE_VIEWS = [

  {

    id: 'view_meta_us_campaign',

    name: 'Meta US Campaign Performance',

    platform: 'Meta',

    dataset: 'LumaFit Meta Ads Daily',

    fields: ['date', 'campaign_name', 'spend', 'purchase_roas', 'cpa', 'purchases'],

    rowCount: 126,

    updatedAt: '2026-06-29 09:42',

    syncMode: 'auto',

    lastSync: '2026-06-29 09:42',

  },

  {

    id: 'view_google_search_us',

    name: 'Google Search US Purchase',

    platform: 'Google',

    dataset: 'LumaFit Google Search Daily',

    fields: ['date', 'campaign', 'cost', 'conversion_value', 'roas', 'cpa'],

    rowCount: 64,

    updatedAt: '2026-06-29 09:35',

    syncMode: 'auto',

    lastSync: '2026-06-29 09:35',

  },

  {

    id: 'view_creative_fatigue',

    name: 'Creative Fatigue Signals',

    platform: 'Creative',

    dataset: 'LumaFit Creative Asset Daily',

    fields: ['creative_name', 'frequency', 'ctr', 'cvr', 'spend', 'roas'],

    rowCount: 38,

    updatedAt: '2026-06-29 09:51',

    syncMode: 'auto',

    lastSync: '2026-06-29 09:51',

  },

]



export const MOCK_VIEW_SNAPSHOTS = {

  view_meta_us_campaign: {

    window: '2026-06-22 至 2026-06-28',

    fallback: false,

    rows: [

      ['US Prospecting Broad', '$980.00', '1.54x', '$58.60', '17', '突破 CPA 红线'],

      ['US Retargeting Purchase', '$1,260.00', '1.88x', '$41.50', '30', '接近 ROAS 红线'],

      ['US Lookalike 3%', '$676.90', '2.18x', '$34.20', '19', '低于目标但未破红线'],

    ],

  },

  view_google_search_us: {

    window: '2026-06-22 至 2026-06-28',

    fallback: false,

    rows: [

      ['Brand Search', '$310.20', '3.42x', '$18.70', '16', '稳定'],

      ['Leggings Non Brand', '$482.40', '2.06x', '$39.10', '12', '低于目标'],

      ['Competitor Intent', '$226.80', '1.62x', '$51.20', '5', '突破 CPA 红线'],

    ],

  },

  view_creative_fatigue: {

    window: '2026-06-22 至 2026-06-28',

    fallback: false,

    rows: [

      ['Core Legging Video V12', '$1,240.00', '1.38x', '4.7', '0.94%', '疲劳'],

      ['Customer Proof Carousel', '$880.00', '2.04x', '3.1', '1.88%', '观察'],

      ['Studio Static Set A', '$690.00', '1.69x', '3.8', '1.34%', '需要替换'],

    ],

  },

}



export const SCHEDULED_CYCLE_JOBS = [

  {

    id: 'cycle_job_weekly_pull',

    name: '上周数据自动拉取',

    schedule: '每周一 08:00',

    executor: 'luna',

    pdca: 'check',

    lastRun: '2026-06-23 08:00',

    nextRun: '2026-06-30 08:00',

    status: 'done',

    detail: '已载入 W26 周期 3 条已执行待办',

  },

  {

    id: 'cycle_job_daily_sync',

    name: '本周数据实时同步',

    schedule: '每 30 分钟',

    executor: 'luna',

    pdca: 'do',

    lastRun: '2026-06-29 10:12',

    nextRun: '2026-06-29 10:42',

    status: 'running',

    detail: 'Meta US + Creative Fatigue 视图已同步',

  },

  {

    id: 'cycle_job_budget_gate',

    name: '预算门检查',

    schedule: '每天 10:00',

    executor: 'luna',

    pdca: 'act',

    lastRun: '2026-06-29 10:00',

    nextRun: '2026-06-30 10:00',

    status: 'pending',

    detail: '待检查 US Prospecting 是否仍超 CPA 红线',

  },

]



export const TODO_TYPE_META = {

  gate_check: { label: '门检查', desc: '定时自动触发，达标则通过', color: 'bg-luna-bg text-luna-violet border-luna-border' },

  decision: { label: '决策节点', desc: '需人工确认后执行', color: 'bg-warning-50 text-warning-700 border-warning-200' },

  execution: { label: '执行动作', desc: '确认后标记完成', color: 'bg-primary-50 text-primary-700 border-primary-200' },

}



export const TODO_STATUS_META = {

  pending: { label: '待执行', color: 'text-neutral-500' },

  done: { label: '已完成', color: 'text-success-600' },

  overdue: { label: '已逾期', color: 'text-danger-600' },

}



export const MOCK_STRATEGY_CYCLE = {

  id: 'sc_lumafit_2026_w27',

  profile_id: 'lumafit',

  period_label: '第 27 周（2026-06-29 至 2026-07-05）',

  period_start: '2026-06-29',

  period_end: '2026-07-05',

  cycle_type: 'weekly',

  current_step: 2,

  media_plan_week: 'W1',

  media_plan_theme: '美国 ROAS 止血',

  auto_execute: true,

  settings_valid: true,

  targetBaseline: [

    ['US / All', 'ROAS >= 2.40', 'ROAS >= 1.80', 'CPA <= $38', 'CPA <= $45'],

    ['CA / All', 'ROAS >= 2.30', 'ROAS >= 1.90', 'CPA <= $34', 'CPA <= $42'],

  ],

  step1: {

    prev_cycle_id: 'sc_lumafit_2026_w26',

    loaded: true,

    auto_pulled_at: '2026-06-29 08:00',

    pulled_by: 'luna',

    summary: 'Luna 于周一 08:00 自动拉取上周待办。3 条中 1 条有效、1 条无效、1 条观察中。',

    verifications: [

      {

        id: 'verify_1',

        platform: 'Meta',

        strategy_title: '保留 US Retargeting 促销周曝光',

        verdict: 'effective',

        detail: '再营销预算保持后，购买量 26 → 30，ROAS 1.74 → 1.88，仍未达目标但方向改善。',

        kpi_before: { roas: '1.74x', cpa: '$46.20', purchases: 26 },

        kpi_after: { roas: '1.88x', cpa: '$41.50', purchases: 30 },

        executed_at: '2026-06-22 14:30',

        executed_by: 'human',

      },

      {

        id: 'verify_2',

        platform: 'Meta',

        strategy_title: '继续使用 Core Legging Video V12 冷启动',

        verdict: 'ineffective',

        detail: '频次上升到 4.7，CTR 下滑 28.4%，CPA 继续高于红线。',

        kpi_before: { roas: '1.71x', cpa: '$49.30', purchases: 14 },

        kpi_after: { roas: '1.54x', cpa: '$58.60', purchases: 17 },

        executed_at: '2026-06-23 10:00',

        executed_by: 'luna',

      },

      {

        id: 'verify_3',

        platform: 'Google',

        strategy_title: '提高 Brand Search 预算占比',

        verdict: 'in_progress',

        detail: 'Brand Search 仍稳定，但量级较小，需再观察 3 天。',

        kpi_before: { roas: '3.28x', cpa: '$19.40', purchases: 13 },

        kpi_after: { roas: '3.42x', cpa: '$18.70', purchases: 16 },

        executed_at: '2026-06-24 11:20',

        executed_by: 'human',

      },

    ],

  },

  step2: {

    selected_view_ids: ['view_meta_us_campaign', 'view_creative_fatigue'],

    time_filter: 'current',

    window_label: '本周期数据',

    queried_at: '2026-06-29 10:12',

    sync_status: 'synced',

    last_sync: '2026-06-29 10:12',

    next_sync: '2026-06-29 10:42',

  },

  step3: {

    generated_at: '2026-06-29 10:18',

    confirmed: false,

    triggered_by: 'human',

    summary_overall: '美国市场触及 CPA 红线，主要由 Meta 冷启动和疲劳素材拖累。本周先降低 US Prospecting 预算，保留 Retargeting 促销周曝光，并发布两条 UGC Hook 素材。',

    suggestions: [

      {

        id: 'sug_meta_1',

        platform: 'Meta',

        priority: 'high',

        title: 'US Prospecting Broad 降到 $95/day',

        detail: 'ROAS 1.54 低于红线 1.80，CPA $58.60 高于红线 $45；先收缩冷启动浪费。',

        metric_gaps: ['ROAS 1.54 < 1.80 红线', 'CPA $58.60 > $45 红线'],

        luna_execute_at: '2026-06-29 10:30（待人工确认）',

      },

      {

        id: 'sug_meta_2',

        platform: 'Meta',

        priority: 'medium',

        title: 'US Retargeting Purchase 保持 $180/day',

        detail: '该策略上周验证有效，促销周仍需保留高意向曝光，48 小时后复查。',

        metric_gaps: ['ROAS 1.88 > 1.80 红线', 'CPA $41.50 < $45 红线'],

        luna_execute_at: '2026-06-29 10:30（自动执行）',

      },

      {

        id: 'sug_creative_1',

        platform: 'Creative',

        priority: 'high',

        title: '替换 Core Legging Video V12',

        detail: '频次 4.7，CTR 0.94%，继续投放会压低冷启动效率。',

        metric_gaps: ['Frequency 4.7 > 4.5', 'CTR 0.94% 低于 1.2%'],

        luna_execute_at: '2026-06-30 09:00（待人工确认）',

      },

      {

        id: 'sug_google_1',

        platform: 'Google',

        priority: 'low',

        title: 'Competitor Intent 降价观察',

        detail: 'CPA $51.20 高于红线，但花费占比低，先降低出价 12% 观察。',

        metric_gaps: ['CPA $51.20 > $45 红线'],

        luna_execute_at: '2026-06-29 14:00（Luna 自动）',

      },

    ],

  },

  step4: {

    progress: { total: 8, done: 2 },

    todo_groups: [

      {

        platform: 'Meta',

        summary: '处理 US Prospecting 和 Retargeting 的预算动作。',

        todos: [

          {

            id: 'todo_gate_1',

            type: 'gate_check',

            description: '每日 10:00 检查 US Prospecting CPA 是否仍超 $45',

            target_object: 'Campaign / US Prospecting Broad',

            current_state: 'CPA $58.60，超红线',

            action: '超红线则自动降预算 10%',

            data_basis: '定时任务 · 预算门检查',

            expected_outcome: 'CPA 回落至红线内',

            executor: 'luna',

            scheduled_at: '每天 10:00',

            status: 'pending',

            done: false,

            completed_at: '',

          },

          {

            id: 'todo_decision_1',

            type: 'decision',

            description: '确认 US Prospecting Broad 日预算从 $140 调整到 $95',

            target_object: 'Campaign / US Prospecting Broad',

            current_state: 'ROAS 1.54，CPA $58.60',

            action: '降低日预算 $45',

            data_basis: 'AI 策略建议 #1',

            expected_outcome: '减少冷启动浪费花费',

            executor: 'human',

            scheduled_at: '2026-06-29 14:00 前确认',

            status: 'pending',

            done: false,

            completed_at: '',

          },

          {

            id: 'todo_exec_1',

            type: 'execution',

            description: 'US Retargeting 保持 $180 并设置 48 小时复查',

            target_object: 'Campaign / US Retargeting Purchase',

            current_state: 'ROAS 1.88，仍高于红线',

            action: '保留预算并添加复查提醒',

            data_basis: '上周验证有效 + 促销周',

            expected_outcome: '保留高意向访客覆盖',

            executor: 'luna',

            scheduled_at: '2026-06-29 10:30',

            status: 'done',

            done: true,

            completed_at: '2026-06-29 10:26',

          },

        ],

      },

      {

        platform: 'Creative',

        summary: '替换疲劳素材，给冷启动重新学习素材信号。',

        todos: [

          {

            id: 'todo_exec_2',

            type: 'execution',

            description: '发布 UGC Hook 01 - Compression Fit',

            target_object: 'Core Legging Prospecting Ad Set',

            current_state: 'Core Legging Video V12 频次 4.7',

            action: '替换主视频素材',

            data_basis: 'Creative Fatigue Signals',

            expected_outcome: '提高 CTR，降低 CPA 压力',

            executor: 'human',

            scheduled_at: '2026-06-29 18:00 前',

            status: 'done',

            done: true,

            completed_at: '2026-06-29 11:05',

          },

          {

            id: 'todo_decision_2',

            type: 'decision',

            description: '确认 UGC Hook 02 主文案和前三秒 Hook',

            target_object: '新素材草稿',

            current_state: '文案待确认',

            action: '完成主文案和前三秒 Hook',

            data_basis: 'Customer Proof Carousel 转化仍可用',

            expected_outcome: '准备第二条 A/B 测试素材',

            executor: 'human',

            scheduled_at: '2026-06-30 12:00 前',

            status: 'overdue',

            done: false,

            completed_at: '',

          },

        ],

      },

      {

        platform: 'Google',

        summary: '控制高 CPA 搜索词，保留品牌词效率。',

        todos: [

          {

            id: 'todo_gate_2',

            type: 'gate_check',

            description: 'Competitor Intent CPA 门检查',

            target_object: 'Google Search / Competitor Intent',

            current_state: 'CPA $51.20，ROAS 1.62',

            action: 'CPA > $45 则 Luna 自动降出价 12%',

            data_basis: '定时任务 · 每日 14:00',

            expected_outcome: '控制非品牌词 CPA',

            executor: 'luna',

            scheduled_at: '每天 14:00',

            status: 'pending',

            done: false,

            completed_at: '',

          },

          {

            id: 'todo_exec_3',

            type: 'execution',

            description: 'Brand Search 保持预算并记录为稳定来源',

            target_object: 'Google Search / Brand Search',

            current_state: 'ROAS 3.42，CPA $18.70',

            action: '保持预算',

            data_basis: 'Google Search US Purchase',

            expected_outcome: '保护稳定购买量',

            executor: 'human',

            scheduled_at: '2026-06-30',

            status: 'pending',

            done: false,

            completed_at: '',

          },

        ],

      },

    ],

  },

}


