// ============================================================
// Launch Center — Mock Data
// Aggregates from existing data sources + supplemental mock
// ============================================================

// --- Journey ---
export const JOURNEY = {
  currentDay: 18,
  phases: [
    {
      id: 'learning',
      label: 'Learning',
      typicalDays: 'Need 7–14 days',
      weight: 1,
      status: 'completed',
      systemActions: [
        'Collect audience, creative, copy, and location data for your product',
        'Continuously analyze high-converting combinations',
        'Validate ad performance of top combinations with low budget',
        'Establish baseline metrics (CPA, ROAS, CTR)'
      ],
      userActions: [
        { text: 'Review and approve budget optimization suggestions (if auto-apply OFF)', done: true },
        { text: 'Review and publish recommended campaigns (if auto-publish OFF)', done: true }
      ],
      metrics: { cpaStart: 52, cpaEnd: 38, roasStart: 1.2, roasEnd: 2.1 }
    },
    {
      id: 'optimization',
      label: 'Optimization',
      typicalDays: 'Need 14–30 days',
      weight: 2,
      status: 'active',
      systemActions: [
        'Intelligent budget optimization and management across campaigns',
        'Auto-build new campaigns with best audiences and high-converting creatives',
        'Continuously improve ad performance toward KPI targets',
        'Monitor and adjust bidding strategies based on real-time data'
      ],
      userActions: [
        { text: 'Review recent performance and adjust optimization rules or KPI targets as needed', done: false },
        { text: 'Review AI creatives and optionally upload your own for testing', done: false }
      ],
      metrics: { cpaStart: 38, cpaEnd: null, roasStart: 2.1, roasEnd: null }
    },
    {
      id: 'scaling',
      label: 'Scaling',
      typicalDays: 'Need 30+ days',
      weight: 2,
      status: 'upcoming',
      systemActions: [
        'Intelligent budget management for all active ads',
        'Data-driven insights to automatically create new campaigns',
        'Maintain stable ad conversions at scale',
        'Continuous performance monitoring and optimization'
      ],
      userActions: [
        { text: 'Monitor data performance and fine-tune brand budget or rules if needed', done: false },
        { text: 'Upload new creatives to refresh campaigns at scale', done: false }
      ],
      metrics: { cpaStart: null, cpaEnd: null, roasStart: null, roasEnd: null }
    }
  ],
  ifNotMeetingTargets: [
    'System auto-reduces budget to protect spend',
    'AI regenerates creative strategy with new angles',
    'You can pause & reconfigure anytime (no lock-in)'
  ]
}

// --- KPI Scorecard ---
export const KPI_SCORECARD = {
  roas: { current: 2.8, target: 4.5, wow: '+23%', direction: 'up' },
  conversions: { current: 1093, eventName: 'Purchase', wow: '+15%', direction: 'up' },
  cpa: { current: 38, target: 15, wow: '-12%', direction: 'up', unit: '$', eventName: 'Purchase' },
  spend: { current: 2800, budget: 3500, unit: '$' }
}

// --- Briefing ---
export const BRIEFING = {
  grade: 'B+',
  sentiment: 'improving',
  summary: 'ROAS grew 23% in the last 7 days to 2.8, tracking toward your 4.5 target in ~35 days. CPA down 12% to $38. Budget scaling on top performers.',
}

// --- Your Actions ---
export const PENDING_ACTIONS = [
  {
    id: 'act-1',
    type: 'budget_approval',
    title: 'Review budget optimization suggestions',
    campaign: 'Budget Optimization',
    description: 'Auto-apply is OFF. 2 budget adjustments pending your approval.',
    detail: '5 campaigns suggested increase · 3 suggested decrease · 2 suggested pause',
    timeAgo: '2h ago',
    priority: 'high'
  },
  {
    id: 'act-2',
    type: 'campaign_publish',
    title: '3 recommended campaigns ready to publish',
    campaign: 'Draft & Recom.',
    description: 'Auto-publish is OFF. AI generated 3 campaigns based on top performer patterns.',
    detail: 'Lookalike US, Retargeting 7d, Interest Expansion',
    timeAgo: '4h ago',
    priority: 'high'
  },
  {
    id: 'act-3',
    type: 'performance_review',
    title: 'Review recent performance data',
    campaign: 'All Campaigns',
    description: 'ROAS dropped 8% in the last 7 days. Consider adjusting budget rules, brand budget cap, or KPI targets.',
    detail: 'Current ROAS 2.8 → Target 4.5 · CPA $38 → Target $15',
    timeAgo: '1d ago',
    priority: 'medium'
  },
  {
    id: 'act-4',
    type: 'creative_review',
    title: 'Review AI-generated creatives',
    campaign: 'Creative Hub',
    description: '5 new AI creatives generated. Upload your own creatives for better results — recommended campaigns will auto-test them.',
    detail: '5 AI variants ready · Upload custom creatives to auto-build test campaigns',
    timeAgo: '2d ago',
    priority: 'low'
  }
]

// --- Performance Report (Last 7 Days) ---
export const WEEKLY_REPORT = {
  weekNumber: 3,
  dateRange: 'Mar 8 – Mar 14',
  grade: 'B+',
  summary: 'ROAS improved 23% WoW to 2.8. CPA decreased to $38 but still above $15 target. Budget utilization at 80%. System identified 5 campaigns for budget increase and 3 for decrease.',
  highlights: [
    'ROAS improved from 2.3 to 2.8, growing 23% over the last 7 days with consistent upward trend',
    '7-day cumulative conversions: 1,093 (Purchase), daily avg 156, sufficient data for optimization',
    'CPA optimized from $43 to $38, improving cost control but still 153% above $15 target',
    'Budget utilization at 80% ($2,800 of $3,500 cap), healthy room for scaling'
  ],
  keyInsights: [
    'Top 3 campaigns driving 72% of conversions at below-average CPA. Recommend increasing budget allocation.',
    'CPA target of $15 is aggressive for current optimization phase. Historical best is $36. Consider adjusting target to $30-35.',
    'Creative fatigue detected on 2 ad sets. Recommend refreshing creatives in the next 7 days.',
    'Budget decrease applied to 3 underperforming campaigns, saving $180/day with minimal conversion impact.'
  ],
  kpis: {
    roas: { current: 2.8, target: 4.5, wow: '+23%', direction: 'up' },
    conversions: { current: 1093, eventName: 'Purchase', wow: '+15%', direction: 'up' },
    cpa: { current: 38, target: 15, wow: '-12%', direction: 'up', eventName: 'Purchase' },
    spend: { current: 2800, budget: 3500 }
  },
  dailyData: [
    { day: 'Mar 8', roas: 2.4, cpa: 42 },
    { day: 'Mar 9', roas: 2.6, cpa: 40 },
    { day: 'Mar 10', roas: 2.7, cpa: 39 },
    { day: 'Mar 11', roas: 2.9, cpa: 37 },
    { day: 'Mar 12', roas: 3.0, cpa: 36 },
    { day: 'Mar 13', roas: 2.8, cpa: 38 },
    { day: 'Mar 14', roas: 2.5, cpa: 41 }
  ],
  aiActionsSummary: {
    budgetOptimize: { count: 12, detail: '8 campaigns · 4 adsets analyzed' },
    recommendedCampaigns: { count: 3, detail: 'Lookalike, Retargeting, Interest Expansion' },
    aiCreatives: { count: 5, detail: 'Product Hero, Lifestyle, UGC styles' }
  },
  nextOutlook: 'Predicted ROAS: 3.0–3.3. Recommend: enable auto-apply for budget optimization, increase brand daily budget to $4,000.'
}

// --- AI Actions (3 types) ---
export const AI_ACTIONS = [
  {
    id: 'ai-1',
    type: 'budget_optimize',
    title: 'Budget Optimize',
    description: 'Generated latest budget adjustment recommendations',
    detail: '3 campaigns analyzed · 2 budget changes suggested',
    timestamp: '2026-03-20T14:30:00'
  },
  {
    id: 'ai-2',
    type: 'recommend_ads',
    title: 'Recommend Ads',
    description: 'Generated recommended campaigns to publish',
    detail: '3 new campaigns ready · Based on top performer patterns',
    timestamp: '2026-03-20T08:15:00'
  },
  {
    id: 'ai-3',
    type: 'ai_creatives',
    title: 'AI Creatives',
    description: 'Generated multiple best creative variants',
    detail: '5 new variants · Product Hero, Lifestyle, UGC styles',
    timestamp: '2026-03-19T11:00:00'
  }
]

// --- Activity Log ---
export const ACTIVITY_LOG = [
  {
    id: 'log-1',
    timestamp: '2026-03-14T14:30:00',
    type: 'budget_analysis',
    title: 'Budget optimization analysis completed',
    description: 'Analyzed 12 campaigns and generated budget adjustment suggestions',
    detail: 'Active total budget: $2,800/day → Suggested total budget: $3,100/day. 5 increase · 3 decrease · 2 pause · 2 maintain.',
    result: 'Completed',
    platform: 'Meta'
  },
  {
    id: 'log-2',
    timestamp: '2026-03-14T14:30:00',
    type: 'budget_apply',
    title: 'Auto-apply budget optimization',
    description: 'Auto-apply is OFF. Please review and apply manually.',
    detail: '',
    result: 'Pending',
    disabled: true,
    platform: 'Meta'
  },
  {
    id: 'log-3',
    timestamp: '2026-03-14T10:00:00',
    type: 'recommend_campaign',
    title: 'Generated 3 recommended campaigns',
    description: 'Lookalike audience · New interest testing · High-converting audience copy',
    detail: 'Creatives: 2 new AI-generated · 1 high-converting copy. Audiences: Lookalike US 1%, Interest "fitness", Top converter retarget 7d.',
    result: 'Ready',
    platform: 'Meta'
  },
  {
    id: 'log-4',
    timestamp: '2026-03-14T10:00:00',
    type: 'recommend_publish',
    title: 'Auto-publish recommended campaigns',
    description: 'Auto-publish is OFF. Please review and publish manually.',
    detail: '',
    result: 'Pending',
    disabled: true,
    platform: 'Meta'
  },
  {
    id: 'log-5',
    timestamp: '2026-03-13T16:00:00',
    type: 'ai_creative',
    title: 'Generated 5 AI creatives for testing',
    description: '3 Product Hero · 1 Lifestyle · 1 UGC style',
    detail: 'Creatives queued as backup for recommended campaigns and A/B testing rotation.',
    result: 'Generated',
    platform: 'Meta'
  },
  {
    id: 'log-6',
    timestamp: '2026-03-13T09:00:00',
    type: 'budget_analysis',
    title: 'Budget optimization analysis completed',
    description: 'Analyzed 11 campaigns and generated budget adjustment suggestions',
    detail: 'Active total budget: $2,650/day → Suggested total budget: $2,800/day. 4 increase · 2 decrease · 1 pause · 4 maintain.',
    result: 'Completed',
    platform: 'Meta'
  },
  {
    id: 'log-7',
    timestamp: '2026-03-13T09:00:00',
    type: 'budget_apply',
    title: 'Auto-apply budget optimization',
    description: 'Auto-apply is OFF. Please review and apply manually.',
    detail: '',
    result: 'Pending',
    disabled: true,
    platform: 'Meta'
  }
]

// --- KPI Progress ---
export const KPI_PROGRESS = {
  primary: {
    metric: 'ROAS',
    current: 2.8,
    target: 4.5,
    confidence: 78,
    trend: [
      { day: 'Day 1', value: 0.8 },
      { day: 'Day 3', value: 1.0 },
      { day: 'Day 5', value: 1.2 },
      { day: 'Day 7', value: 1.5 },
      { day: 'Day 9', value: 1.8 },
      { day: 'Day 11', value: 2.0 },
      { day: 'Day 13', value: 2.1 },
      { day: 'Day 15', value: 2.3 },
      { day: 'Day 16', value: 2.5 },
      { day: 'Day 17', value: 2.6 },
      { day: 'Day 18', value: 2.8 }
    ]
  },
  secondary: [
    { metric: 'CPA', current: 38, target: 15, unit: '$', eventName: 'Purchase', status: 'improving', wow: '-12%' },
    { metric: 'CTR', current: 2.1, benchmark: 2.0, unit: '%', status: 'above', wow: '+5%' },
    { metric: 'CVR', current: 3.8, benchmark: 3.5, unit: '%', status: 'above', wow: '+8%' }
  ],
  targets: [
    { metric: 'ROAS', current: 2.8, target: 4.5, expectedDays: 35 },
    { metric: 'CPA', current: 38, target: 15, unit: '$', eventName: 'Purchase', expectedDays: 42 }
  ],
  diagnosis: {
    show: true,
    text: 'ROAS at 62% of target. Growth rate (+12% per 7 days) suggests reaching 4.5 in ~35 days. Main drag: "Brand Growth" campaign at 2.5 ROAS pulling down average.',
    recommendations: [
      'Refresh creatives on "Brand Growth" campaign (lowest ROAS)',
      'Shift 20% budget from IN market to US market (higher ROAS)',
      'Add rule: pause adsets with ROAS < 2.0 after 5 days'
    ]
  }
}

// --- Control Matrix ---
export const CONTROL_MATRIX = [
  { action: 'Brand Daily Budget', you: true, ai: false, shared: false, desc: 'You set the brand daily budget cap. AI never exceeds it.' },
  { action: 'Budget Optimization', you: false, ai: false, shared: true, desc: 'AI generates optimization suggestions. You approve manually, or enable auto-apply.' },
  { action: 'Recommended Campaigns', you: false, ai: false, shared: true, desc: 'AI builds new campaigns. You publish manually, or enable auto-publish.' },
  { action: 'KPI Targets', you: true, ai: false, shared: false, desc: 'You set and adjust KPI targets (ROAS, CPA, etc.).' },
  { action: 'Optimization Rules', you: true, ai: false, shared: false, desc: 'You configure rules in natural language. AI executes them.' },
  { action: 'Rule Execution', you: false, ai: true, shared: false, desc: 'AI evaluates and executes rules automatically.' },
  { action: 'Creative Generation', you: true, ai: true, shared: false, desc: 'Both AI and you can generate creatives. AI generates automatically; you can also create and upload your own.' },
  { action: 'Creative Upload', you: true, ai: false, shared: false, desc: 'You can upload your own creatives. Recommended campaigns auto-test them.' },
  { action: 'A/B Testing & Rotation', you: false, ai: true, shared: false, desc: 'AI manages testing, rotation, and pausing underperformers.' }
]

export const CONTROL_DETAILS = [
  {
    icon: 'Shield',
    title: 'Budget Safeguards',
    items: [
      'You set the brand daily budget cap — AI strictly respects your budget limit',
      'Prerequisite: ad accounts assigned to AdsGo should not be managed on other ad platforms simultaneously',
      'Budget optimization requires your approval (or enable auto-apply)',
      'AI allocates across campaigns by performance, you can override anytime'
    ]
  },
  {
    icon: 'CheckCircle',
    title: 'Creative Ownership',
    items: [
      'All AI-generated creatives belong to you',
      'Download anytime from Creative Library',
      'Use on any platform, even outside AdsGo'
    ]
  },
  {
    icon: 'Unlock',
    title: 'No Lock-In',
    items: [
      'Cancel anytime, no penalties',
      '30-day evaluation period recommended',
      'All your data and creatives are exportable'
    ]
  }
]

// --- Creative Testing ---
export const CREATIVE_TESTING = {
  velocity: { tested: 6, active: 5, paused: 2, winning: 2, testedWow: '+2', activeWow: '+1' },
  typeBreakdown: [
    { type: 'Product Hero', percentage: 35 },
    { type: 'Lifestyle', percentage: 28 },
    { type: 'UGC Style', percentage: 18 },
    { type: 'Carousel', percentage: 12 },
    { type: 'Video', percentage: 7 }
  ],
  topPerformers: [
    { id: 1, name: 'Summer V3', type: 'Product Hero', ctr: 3.2, roas: 4.1, status: 'top', daysTested: 5 },
    { id: 2, name: 'Lifestyle V2', type: 'Lifestyle', ctr: 2.8, roas: 3.5, status: 'active', daysTested: 3 },
    { id: 3, name: 'UGC Review #4', type: 'UGC Style', ctr: 2.1, roas: 2.8, status: 'active', daysTested: 6 }
  ]
}

// --- Objective Overview (Mini) ---
export const OBJECTIVE_OVERVIEW = {
  locations: ['United States', 'Canada', 'United Kingdom'],
  platforms: ['meta'],
  conversionEvents: ['Purchase', 'AddToCart'],
  totalDailyBudget: 3500,
  strategyGroups: 1
}

// --- Looking Ahead ---
export const LOOKING_AHEAD = {
  milestones: [
    { metric: 'ROAS', current: 2.8, target: 4.5, expectedDays: 35 },
    { metric: 'CPA', current: 38, target: 15, expectedDays: 42, eventName: 'Purchase' }
  ],
  recommendations: [
    'Enable auto-apply for budget optimization to accelerate performance improvements',
    'Increase brand daily budget from $3,500 to $5,000 to capture more conversion opportunities',
    'Lower CPA (Purchase) target from $15 to $30 — insufficient conversion data to sustain aggressive target'
  ]
}
