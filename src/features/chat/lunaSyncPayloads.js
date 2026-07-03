/* ═══════════════════════════════════════════════════════════
   Luna Sync Payloads — structured data pushed to GUI modules
   ═══════════════════════════════════════════════════════════ */

export const LUNA_SYNC_PAYLOADS = {
  'ads/campaigns': {
    moduleLabel: '广告管理',
    summary: 'Luna 已写入 3 条预算建议，待你在 GUI 确认',
    effects: [
      { label: 'US Prospecting Broad', detail: '日预算 $140 → $95，降预算' },
      { label: 'US Retargeting Purchase', detail: '维持 $180，48 小时观察' },
      { label: 'US 3% Lookalike', detail: '维持 $120，等待素材学习' },
    ],
    highlightIds: ['cmp-us-prospecting', 'cmp-us-retargeting', 'cmp-us-lookalike'],
    autoSelectIds: ['cmp-us-prospecting', 'cmp-us-retargeting'],
    markStatus: '待确认',
    source: 'Luna · 预算优化 · 2026-06-29 10:18',
  },

  'plan/media-plan': {
    moduleLabel: '媒体计划与策略',
    tab: 'cycle',
    step: 4,
    summary: 'Luna 已将 5 条任务写入本周策略待办',
    effects: [
      { label: '决策节点', detail: '确认 US Prospecting 预算 $140 → $95' },
      { label: '执行动作', detail: '发布 UGC Hook 01 替换疲劳主视频' },
      { label: '门检查', detail: '每日 10:00 CPA 门检查（Luna 自动）' },
    ],
    highlightTodoIds: ['todo_decision_1', 'todo_exec_2', 'todo_gate_1'],
    source: 'Luna · 本周策略 · 2026-06-29 10:22',
  },

  'report/daily-brief': {
    moduleLabel: '客户日报',
    summary: 'Luna 已更新今日客户日报草稿',
    effects: [
      { label: '今日结论', detail: '补充 ROAS 1.82 低于目标的原因说明' },
      { label: '今日处理', detail: '写入冷启动降预算、保留再营销、素材换新' },
      { label: '明日观察', detail: '追加 CPA 回落与 CTR 回升观察项' },
    ],
    highlightSections: ['conclusion', 'actions', 'watch'],
    source: 'Luna · 客户日报 · 2026-06-29 10:25',
  },

  'create/draft': {
    moduleLabel: '草稿中心',
    summary: 'Luna 已生成冷启动换新广告结构',
    effects: [
      { label: 'US Prospecting Refresh', detail: '2 条 UGC Hook 素材 + $95/day CBO' },
      { label: '待确认', detail: 'UGC Hook 02 首句卖点文案' },
    ],
    highlightDraftIds: ['draft-ugc-hook-01', 'draft-ugc-hook-02'],
    source: 'Luna · 广告创编 · 2026-06-29 10:28',
  },

  'insight/dashboard': {
    moduleLabel: '数据洞察看板',
    summary: 'Luna 已标记美国 ROAS 下滑相关维度',
    effects: [
      { label: '账户', detail: 'ROAS 连续 7 天下降，花费增速快于转化' },
      { label: '素材', detail: 'Core Legging Video V12 疲劳，CPA $58.60' },
      { label: '受众', detail: 'Broad Fitness Buyers 高花费高 CPA' },
    ],
    highlightKpis: ['ROAS', 'CPA', 'CTR'],
    source: 'Luna · 数据分析 · 2026-06-29 10:15',
  },

  'creative/library': {
    moduleLabel: '创意库',
    summary: 'Luna 已标记 3 个素材风险项',
    effects: [
      { label: 'Core Legging Video V12', detail: '频次 4.7，建议下线' },
      { label: 'Customer Proof Carousel', detail: '再营销 ROAS 2.04，保留' },
      { label: 'UGC Hook 01', detail: '测试中，待放量' },
    ],
    highlightCreativeIds: ['cr-v12', 'cr-proof', 'cr-ugc-01'],
    source: 'Luna · 素材分析 · 2026-06-29 10:20',
  },

  'settings/goals': {
    moduleLabel: '目标与阶段',
    summary: 'Luna 检测到 3 项红线同时触发',
    effects: [
      { label: 'ROAS', detail: '美国 1.82 < 目标 2.40' },
      { label: 'CPA', detail: 'Prospecting $58.60 > 红线 $45' },
      { label: '素材频次', detail: 'V12 频次 4.7 > 红线 4.5' },
    ],
    highlightGoals: ['roas', 'cpa', 'frequency'],
    source: 'Luna · 目标监控 · 2026-06-29 10:10',
  },
}

export const getSyncPayload = (syncTarget) => {
  const path = syncTarget?.split('?')[0]
  return LUNA_SYNC_PAYLOADS[path] || null
}

export const buildWorkspaceSyncPath = (brandId, syncTarget) => {
  const bid = brandId || 'default'
  const [path, query] = (syncTarget || '').split('?')
  return `/workspace/${encodeURIComponent(bid)}/${path}${query ? `?${query}` : ''}`
}

export const normalizeSyncKey = (syncTarget) => syncTarget?.split('?')[0] || syncTarget
