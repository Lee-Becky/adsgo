/* ═══════════════════════════════════════════════════════════
   Media Plan Mock Data — 2.0 月度全球计划
   ═══════════════════════════════════════════════════════════ */

export const MEDIA_PLAN_MONTH = {
  label: '2026年7月',
  periodStart: '2026-07-01',
  periodEnd: '2026-07-31',
  brand: 'LumaFit',
  status: '执行中',
  currentWeek: 1,
}

export const GLOBAL_GOALS = {
  roasTarget: 2.40,
  purchaseRoasTarget: 2.20,
  monthlyBudget: 45000,
  monthlySpend: 12840,
  spendPct: 28.5,
  primaryMarkets: ['US', 'SG', 'AU'],
  narrative: '7月以美国 ROAS 修复为核心，东南亚维持放量，日韩测试观望。',
}

export const MARKET_ANALYSIS = [
  { code: 'US', name: '美国', spend: 8420, roas: 1.82, purchaseRoas: 1.76, status: '修复', focus: '冷启动降预算 + 素材换新', priority: 'P0' },
  { code: 'SG', name: '新加坡', spend: 2180, roas: 2.68, purchaseRoas: 2.41, status: '放量', focus: '维持 Lookalike 扩量', priority: 'P1' },
  { code: 'AU', name: '澳大利亚', spend: 1640, roas: 2.31, purchaseRoas: 2.12, status: '稳定', focus: '促销周再营销加码', priority: 'P1' },
  { code: 'MY', name: '马来西亚', spend: 980, roas: 2.54, purchaseRoas: 2.28, status: '观察', focus: '控制 Broad 花费占比', priority: 'P2' },
  { code: 'TH', name: '泰国', spend: 720, roas: 2.12, purchaseRoas: 1.94, status: '观察', focus: '落地页 CVR 优化', priority: 'P2' },
  { code: 'JP', name: '日本', spend: 540, roas: 1.68, purchaseRoas: 1.52, status: '测试', focus: '小预算素材测试', priority: 'P3' },
  { code: 'KR', name: '韩国', spend: 360, roas: 1.44, purchaseRoas: 1.31, status: '测试', focus: '暂停扩量，保留品牌词', priority: 'P3' },
]

export const WEEKLY_PLAN = [
  {
    week: 'W1',
    label: '7/1 – 7/6',
    status: 'current',
    theme: '美国 ROAS 止血',
    tasks: [
      { id: 'w1_1', title: 'US Prospecting 预算下调至 $95/day', owner: 'human', due: '7/1' },
      { id: 'w1_2', title: '发布 UGC Hook 01 替换疲劳主视频', owner: 'human', due: '7/2' },
      { id: 'w1_3', title: '每日 10:00 预算门检查（Luna 自动）', owner: 'luna', due: '每日' },
    ],
    kpis: { roas: '≥ 1.90', spend: '$12.8K', focus: 'US' },
  },
  {
    week: 'W2',
    label: '7/7 – 7/13',
    status: 'upcoming',
    theme: '素材 A/B 验证',
    tasks: [
      { id: 'w2_1', title: 'UGC Hook 02 上线 A/B 测试', owner: 'human', due: '7/8' },
      { id: 'w2_2', title: 'SG Lookalike 扩量 +15%', owner: 'human', due: '7/10' },
      { id: 'w2_3', title: '周一 09:00 生成周报并入策略', owner: 'luna', due: '7/7' },
    ],
    kpis: { roas: '≥ 2.00', spend: '$14K', focus: 'US + SG' },
  },
  {
    week: 'W3',
    label: '7/14 – 7/20',
    status: 'upcoming',
    theme: '促销周再营销',
    tasks: [
      { id: 'w3_1', title: 'AU/SG 再营销预算 +20%', owner: 'human', due: '7/14' },
      { id: 'w3_2', title: 'TH 落地页 CVR 优化上线', owner: 'human', due: '7/16' },
      { id: 'w3_3', title: '每日 10:00 预算优化 + 红线告警', owner: 'luna', due: '每日' },
    ],
    kpis: { roas: '≥ 2.10', spend: '$15K', focus: '促销周' },
  },
  {
    week: 'W4',
    label: '7/21 – 7/27',
    status: 'upcoming',
    theme: '月度复盘与 8 月计划',
    tasks: [
      { id: 'w4_1', title: '全市场 ROAS 月度复盘', owner: 'human', due: '7/24' },
      { id: 'w4_2', title: 'JP/KR 测试结论：扩量或暂停', owner: 'human', due: '7/25' },
      { id: 'w4_3', title: '7/28 自动生成 8 月媒体计划草案', owner: 'luna', due: '7/28' },
    ],
    kpis: { roas: '≥ 2.20', spend: '$16K', focus: '全球' },
  },
]

export const SCHEDULED_JOBS = [
  {
    id: 'job_budget_daily',
    name: '每日预算门检查',
    schedule: '每天 10:00',
    executor: 'luna',
    action: '拉取昨日花费与 ROAS，超红线自动降预算或生成待办',
    enabled: true,
    lastRun: '2026-06-29 10:00',
    nextRun: '2026-06-30 10:00',
    status: 'active',
  },
  {
    id: 'job_weekly_report',
    name: '周一策略周报',
    schedule: '每周一 09:00',
    executor: 'luna',
    action: '汇总上周数据验证结果，生成策略 Step 1 输入',
    enabled: true,
    lastRun: '2026-06-23 09:00',
    nextRun: '2026-06-30 09:00',
    status: 'active',
  },
  {
    id: 'job_creative_fatigue',
    name: '素材疲劳扫描',
    schedule: '每天 08:30',
    executor: 'luna',
    action: '检测频次 > 4.5 或 CTR 下滑 > 20% 的素材，推送换新建议',
    enabled: true,
    lastRun: '2026-06-29 08:30',
    nextRun: '2026-06-30 08:30',
    status: 'active',
  },
  {
    id: 'job_monthly_plan',
    name: '月末下月计划草案',
    schedule: '每月 28 日 14:00',
    executor: 'luna',
    action: '基于本月表现生成下月媒体计划 W1-W4 草案，待人工确认',
    enabled: true,
    lastRun: '2026-05-28 14:00',
    nextRun: '2026-07-28 14:00',
    status: 'active',
  },
]
