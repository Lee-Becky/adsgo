// ============================================================
// Media Plan — Mock Data
// All data sourced from existing pages or supplemental mock
// ============================================================

// --- Status Bar ---
export const STATUS_BAR_DATA = {
  kpiType: 'ROAS',          // 'ROAS' | 'CPA'
  kpiTarget: 4.5,
  dailyBudget: 3500,
}

// --- KPI Trend Data (past 7 days) ---
export const KPI_TREND_DATA = [
  { date: '03-24', kpiValue: 2.85 },
  { date: '03-25', kpiValue: 2.92 },
  { date: '03-26', kpiValue: 3.05 },
  { date: '03-27', kpiValue: 3.18 },
  { date: '03-28', kpiValue: 3.12 },
  { date: '03-29', kpiValue: 3.25 },
  { date: '03-30', kpiValue: 3.31 },
]

// --- Spend Data (past 7 days) ---
export const SPEND_DATA = {
  totalSpend: 18500,
  avgDailySpend: 2643,
  efficiency: 'improving',
  dailyTrend: [
    { date: '03-24', spend: 2400, conversions: 18, revenue: 6840 },
    { date: '03-25', spend: 2550, conversions: 21, revenue: 7446 },
    { date: '03-26', spend: 2700, conversions: 24, revenue: 8235 },
    { date: '03-27', spend: 2680, conversions: 26, revenue: 8522 },
    { date: '03-28', spend: 2750, conversions: 28, revenue: 8580 },
    { date: '03-29', spend: 2700, conversions: 27, revenue: 8775 },
    { date: '03-30', spend: 2720, conversions: 29, revenue: 9003 },
  ],
  topEvent: 'Approved budget suggestions on 03-25',
  creativeFatigueAdsets: 2,
  daysSinceNewCreative: 3,
}

// --- Summary Card Data ---
export const SUMMARY_DATA = {
  kpiTrend: KPI_TREND_DATA,
  kpiType: 'ROAS',
  currentKPI: 3.31,
  kpiTarget: 4.5,
  spendData: SPEND_DATA,
}

// --- Weekly Plan Data (5 weeks: past 2, current, future 2) ---
export const WEEKLY_PLANS = [
  {
    weekId: 'W-2',
    weekNumber: 11,
    label: 'Past Week 1',
    status: 'completed',
    dateRange: {
      start: '2026-03-10',
      end: '2026-03-16',
      startStr: '3/10',
      endStr: '3/16',
    },
    coreObjective: 'Establish baseline metrics and launch initial campaigns',
    aiPlan: [
      'Analyze initial performance data from 3 launched campaigns',
      'Test 5 audience segments for baseline CTR/CVR',
      'Identify top 2 performing creatives by CTR',
    ],
    youNeedToDo: [
      { id: 'w-2-1', text: 'Review initial campaign results', completed: true },
      { id: 'w-2-2', text: 'Approve tracking pixel verification', completed: true },
      { id: 'w-2-3', text: 'Upload 5 new creative variants', completed: false },
    ],
  },
  {
    weekId: 'W-1',
    weekNumber: 12,
    label: 'Past Week 2',
    status: 'completed',
    dateRange: {
      start: '2026-03-17',
      end: '2026-03-23',
      startStr: '3/17',
      endStr: '3/23',
    },
    coreObjective: 'Optimize budget allocation based on early winners',
    aiPlan: [
      'Reallocate budget from underperforming to winning adsets',
      'Pause 3 creatives with CTR below 1%',
      'Generate 5 new AI creatives based on top performers',
    ],
    youNeedToDo: [
      { id: 'w-1-1', text: 'Review and approve budget suggestions', completed: true },
      { id: 'w-1-2', text: 'Review AI-generated creatives', completed: true },
      { id: 'w-1-3', text: 'Set ROAS target adjustment if needed', completed: false },
    ],
  },
  {
    weekId: 'W0',
    weekNumber: 13,
    label: 'This Week',
    status: 'current',
    dateRange: {
      start: '2026-03-24',
      end: '2026-03-30',
      startStr: '3/24',
      endStr: '3/30',
    },
    coreObjective: 'Scale winning audiences while maintaining CPA efficiency',
    aiPlan: [
      'Scale LAL 1% audience budget by 25% if CPA stays under target',
      'Test new interest-based audiences (fitness, wellness)',
      'Auto-generate 3 video variants from top static creative',
      'Daily budget optimization across all active campaigns',
    ],
    youNeedToDo: [
      { id: 'w0-1', text: 'Review weekly performance summary', completed: false },
      { id: 'w0-2', text: 'Approve new audience tests', completed: false },
      { id: 'w0-3', text: 'Review video creative concepts', completed: false },
      { id: 'w0-4', text: 'Consider increasing overall budget by 15%', completed: false },
    ],
  },
  {
    weekId: 'W+1',
    weekNumber: 14,
    label: 'Next Week',
    status: 'upcoming',
    dateRange: {
      start: '2026-03-31',
      end: '2026-04-06',
      startStr: '3/31',
      endStr: '4/6',
    },
    coreObjective: 'Expand to new channels and test broader audiences',
    aiPlan: [
      'Launch Google Ads test campaign with $200/day budget',
      'Expand LAL to 5% audience segment',
      'A/B test new landing page variants',
      'Cross-channel budget optimization between Meta and Google',
    ],
    youNeedToDo: [
      { id: 'w+1-1', text: 'Review and approve Google Ads setup', completed: false },
      { id: 'w+1-2', text: 'Approve landing page A/B test design', completed: false },
      { id: 'w+1-3', text: 'Set weekly budget cap review', completed: false },
    ],
  },
  {
    weekId: 'W+2',
    weekNumber: 15,
    label: 'Week of Apr 7',
    status: 'upcoming',
    dateRange: {
      start: '2026-04-07',
      end: '2026-04-13',
      startStr: '4/7',
      endStr: '4/13',
    },
    coreObjective: 'Achieve target ROAS of 4.5x consistently',
    aiPlan: [
      'Optimize for ROAS 4.5x+ across all channels',
      'Identify and scale top 3 performing ad combinations',
      'Implement advanced bidding strategies',
      'Generate monthly performance report and recommendations',
    ],
    youNeedToDo: [
      { id: 'w+2-1', text: 'Review monthly performance report', completed: false },
      { id: 'w+2-2', text: 'Decide on budget increase for next month', completed: false },
      { id: 'w+2-3', text: 'Plan seasonal creative updates', completed: false },
    ],
  },
]

// --- Dimension Scores Data (for ScoreCard) ---
// 5 维度: Budget Optimization / Campaign Recommendation / Creative / Landing Page / KPI
// 每个维度: problem(诊断) → adsGoWillDo(AI处方) → yourActions(用户配合) → expectedImpact(预期收益)
// 维度内容与当前周计划 (W0) 高度关联:
// W0 目标: Scale winning audiences while maintaining CPA efficiency
// W0 AI Plan: Scale LAL 1% budget +25%, Test interest audiences, Auto-generate 3 video variants, Daily budget optimization
// W0 You Need To Do: Review weekly summary, Approve audience tests, Review video concepts, Consider +15% budget
export const DIMENSION_SCORES = [
  {
    id: 'budget_optimization',
    currentScore: 2.8,
    potentialScore: 1.8,
    problem: '3 adsets with ROAS below 1.5x are consuming 40% of your daily budget ($1,400/day wasted). Meanwhile, your top 2 winners — LAL 1% Purchasers (ROAS 5.2x) and Interest Fitness (ROAS 4.8x) — are budget-capped and cannot scale further. Auto-execute for budget optimization is currently OFF, blocking this week\'s plan to scale LAL 1% audience budget by 25%.',
    adsGoWillDo: [
      'Execute daily budget optimization: shift $480/day from 3 underperforming adsets to LAL 1% and Interest Fitness winners',
      'Scale LAL 1% audience budget by 25% this week if CPA stays under target (aligned with this week\'s AI plan)',
      'Pause adsets where CPA exceeds target by 30%+ for 48 consecutive hours',
    ],
    yourActions: [
      { id: 'bo-1', text: 'Consider increasing overall budget by 15% to support scaling (this week\'s recommended action)' },
      { id: 'bo-2', text: 'Enable auto-execute or manually approve 5 pending budget suggestions' },
    ],
    expectedImpact: 'Unlocks $480/day reallocation to winning audiences — projected to improve overall ROAS by 0.6x within 7 days while supporting this week\'s scaling objective',
  },
  {
    id: 'campaign_recommendation',
    currentScore: 3.5,
    potentialScore: 1.2,
    problem: 'AdsGo has generated 3 new campaigns ready to launch this week: a creative A/B test for video variants, a LAL 5% audience expansion to complement the LAL 1% scaling, and a retargeting campaign for cart abandoners. Auto-publish is currently OFF — these campaigns are waiting for your approval, delaying this week\'s plan to test new interest-based audiences.',
    adsGoWillDo: [
      'Launch LAL 5% expansion and interest-based audience tests (fitness, wellness) as planned for this week',
      'Only recommend campaigns with 85%+ predicted confidence score',
      'Auto-launch approved campaigns at optimal time-of-day for your audience',
    ],
    yourActions: [
      { id: 'cr-1', text: 'Approve new audience tests — LAL 5% and interest-based segments (this week\'s action item)' },
      { id: 'cr-2', text: 'Enable auto-publish or manually review and publish 3 pending campaigns' },
    ],
    expectedImpact: 'Launching these 3 campaigns is projected to increase daily conversions by 35% and expand reach to 120K new users — directly supporting this week\'s scaling goal',
  },
  {
    id: 'creative',
    currentScore: 2.5,
    potentialScore: 2.0,
    problem: 'Creative fatigue detected on 4 of 6 active adsets — CTR has dropped 22% over the past 7 days. You currently have only 8 creatives in rotation (recommended minimum: 20). This week\'s AI plan includes auto-generating 3 video variants from top static creatives, but more raw assets are needed to maintain testing velocity during the scaling phase.',
    adsGoWillDo: [
      'Auto-generate 3 video variants from your top-performing static creatives (this week\'s AI plan)',
      'Rotate fatigued creatives out and replace with fresh variants automatically',
      'A/B test new hooks, CTAs, and thumbnail combinations on existing winners',
    ],
    yourActions: [
      { id: 'cv-1', text: 'Review video creative concepts generated this week (pending your approval)' },
      { id: 'cv-2', text: 'Upload 5–10 new raw images or videos for AI to remix into additional variants' },
    ],
    expectedImpact: 'Fresh video creatives typically recover CTR within 3–5 days — projected to restore the 22% CTR decline and improve CPA by 15%, critical for sustaining this week\'s scaling momentum',
  },
  {
    id: 'landing_page',
    currentScore: 3.2,
    potentialScore: 1.5,
    problem: 'Your landing page loads in 3.8s on mobile (industry benchmark is under 2s) — every extra second costs ~7% in conversions. Your conversion tracking pixel only fires on 2 of 4 key events (missing "Add to Cart" and "Initiate Checkout"), which limits the system\'s ability to optimize for purchase intent. As audience scaling ramps up this week, these gaps will increasingly waste the additional budget.',
    adsGoWillDo: [
      'Monitor pixel firing status and alert immediately on tracking gaps',
      'Analyze landing page performance and generate optimization recommendations',
      'Track page load speed daily and flag regressions as traffic scales this week',
    ],
    yourActions: [
      { id: 'lp-1', text: 'Fix missing pixel on "Add to Cart" and "Initiate Checkout" events' },
      { id: 'lp-2', text: 'Optimize landing page load speed to under 2s on mobile' },
    ],
    expectedImpact: 'Fixing pixel gaps enables full-funnel optimization — projected to reduce CPA by 20%. Critical to fix before this week\'s audience scaling increases traffic volume',
  },
  {
    id: 'kpi',
    currentScore: 2.2,
    potentialScore: 2.5,
    problem: 'Your ROAS target of 4.5x is 80% above the industry benchmark of 2.5x for your vertical. This forces the system to restrict delivery to ~15% of your potential audience, directly conflicting with this week\'s objective to scale winning audiences. The LAL 1% budget increase and new interest audience tests cannot reach their full potential under this constrained target.',
    adsGoWillDo: [
      'Provide weekly updated industry benchmark data for your vertical',
      'Model projected delivery volume at different KPI targets — showing how scaling this week is limited by 4.5x',
      'Recommend an optimal phased target that balances this week\'s scaling goal with profitability',
    ],
    yourActions: [
      { id: 'kp-1', text: 'Review weekly performance summary to assess if 4.5x target is realistic at current scale' },
      { id: 'kp-2', text: 'Consider a phased target: 3.5x during scaling weeks, then increase as efficiency improves' },
    ],
    expectedImpact: 'Adjusting target to 3.5x is projected to double delivery volume and reduce learning period from 14 to 5 days — unlocking the full potential of this week\'s scaling plan',
  },
]

// --- Campaign Phase Distribution (for ScoreCard center) ---
// Learning ≥80% → Learning phase | 30–80% → Optimizing | <30% → Scaling
export const CAMPAIGN_PHASE_DATA = {
  totalActive: 6,
  learningCount: 2,
  learningPercent: 33,   // 2/6 = 33% → falls in Optimizing range
}

// --- Highlights Data (past 7 days) ---
export const HIGHLIGHTS_DATA = {
  actionBenefits: [
    {
      metric: 'ROAS',
      change: '+18%',
      attribution: 'After approving budget suggestions on 03-25',
    },
    {
      metric: 'CTR',
      change: '+23%',
      attribution: 'After AI-generated UGC creatives launched on 03-27',
    },
    {
      metric: 'CPA',
      change: '-15%',
      attribution: 'After pausing 3 underperforming adsets on 03-26',
    },
    {
      metric: 'Conversions',
      change: '+31%',
      attribution: 'Combined impact of all optimizations',
    },
  ],
  highlights: [
    {
      type: 'adset',
      name: 'LAL 1% - Purchasers',
      achievement: 'ROAS 5.2x (target 4.5x) · $1,240 spend',
      date: '03-28',
    },
    {
      type: 'ad',
      name: 'UGC Style - Product Demo',
      achievement: 'CTR 3.8% (industry avg 1.5%) · 284 clicks',
      date: '03-27',
    },
    {
      type: 'creative',
      name: 'Hero Image - Lifestyle',
      achievement: 'CPC $0.42 (best performer) · 12 conversions',
      date: '03-29',
    },
    {
      type: 'campaign',
      name: 'Retargeting - Cart Abandoners',
      achievement: 'CPA $12.50 (target $18) · 45 conversions',
      date: '03-26',
    },
  ],
}

// --- Plan Phases (static product content) ---
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

// --- Operations Data (used by other modules for daysSinceLastCreative etc.) ---
export const OPERATIONS_DATA = {
  lastSyncTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),          // 1h ago
  lastBudgetOptTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),     // 8h ago
  lastCreativeGenTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2d ago
  activeCreativeCount: 12,
}

// --- Past 36h Timeline Events (3 core actions only) ---
// type: 'budget_optimize' | 'regen_creative' | 'recommend_campaign'
export const OPERATIONS_TIMELINE = [
  {
    id: 'op-1',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    type: 'budget_optimize',
    title: 'Budget optimization completed',
    description: '5 increase · 3 decrease · 2 pause · 2 maintain',
  },
  {
    id: 'op-2',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    type: 'recommend_campaign',
    title: 'Generated 3 recommended campaigns',
    description: 'Lookalike audience · Interest testing · Retarget converters',
  },
  {
    id: 'op-3',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    type: 'regen_creative',
    title: 'Regenerated 5 creative variants',
    description: '3 Product Hero · 1 Lifestyle · 1 UGC style',
  },
  {
    id: 'op-4',
    timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    type: 'budget_optimize',
    title: 'Budget optimization completed',
    description: '4 increase · 2 decrease · 1 pause · 4 maintain',
  },
]

// --- Next 12h Upcoming Events (estimated, shown with dashed style) ---
export const OPERATIONS_UPCOMING = [
  {
    id: 'up-1',
    estimatedTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    type: 'budget_optimize',
    title: 'Budget optimization',
    description: 'Daily scheduled run',
  },
  {
    id: 'up-2',
    estimatedTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    type: 'regen_creative',
    title: 'Regenerate creative variants',
    description: 'If creative fatigue detected',
  },
  {
    id: 'up-3',
    estimatedTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    type: 'recommend_campaign',
    title: 'Campaign recommendations',
    description: 'If sufficient performance data available',
  },
]

// ============================================================
// Dormant State — Mock Data (for paused/dormant accounts)
// ============================================================

export const DORMANT_DATA = {
  // Historical Peak Performance
  historicalPeak: {
    roas: 4.2,              // Best ROAS achieved
    cpa: 18,                // Best CPA achieved
    conversions: 2847,      // Total conversions during active period
    spend: 48500,           // Total spend during active period
    daysActive: 45          // Days the account was actively running
  },

  // Pause Information
  pausedInfo: {
    pausedAt: '2026-03-28T10:00:00Z',  // When ads were paused
    pausedBy: 'user',                  // user | manual | system
    reason: 'Paused manually by user',
    daysPaused: 2                      // Days since pause
  },

  // Opportunity Cost (estimated lost potential)
  opportunityCost: {
    estimatedLostConversions: 156,     // Estimated missed conversions
    estimatedLostRevenue: 12500,       // Estimated missed revenue
    basedOnIndustry: 'E-commerce',     // Industry benchmark used
    note: 'Based on your historical performance and industry benchmarks'
  },

  // Restart Recommendation
  restartRecommendation: {
    title: 'Why Restart Now?',
    reasons: [
      'Your proven winning audiences are saved and ready to re-target',
      'New creative variants generated during pause period',
      'Industry CTR +15% this week — favorable market conditions',
      'AI has analyzed 28 top performers in your niche during downtime'
    ],
    quickStart: {
      title: 'Ready to Restart?',
      options: [
        { label: 'Resume Best Performer', desc: 'ROAS 4.2 campaign from Day 38' },
        { label: 'Start Fresh with AI', desc: '3 new campaigns ready' },
        { label: 'Custom Restart', desc: 'Pick and choose campaigns' }
      ]
    }
  }
}
