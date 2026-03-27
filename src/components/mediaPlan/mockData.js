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
