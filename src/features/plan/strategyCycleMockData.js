/* ═══════════════════════════════════════════════════════════
   Strategy Cycle Mock Data — Weekly PDCA Loop
   ═══════════════════════════════════════════════════════════ */

/* ── Monthly global plan ──────────────────────────────────── */
export const MONTHLY_PLAN = {
  month: 'June 2025',
  overallGoals: {
    roas: { target: 3.0, current: 3.42, status: 'on-track' },
    purchaseRoas: { target: 2.5, current: 2.85, status: 'on-track' },
    monthlyBudget: { target: 50000, spent: 32580, remaining: 17420 },
  },
  markets: [
    { code: 'US', name: 'United States', allocation: 60, roas: 3.6, status: 'strong' },
    { code: 'UK', name: 'United Kingdom', allocation: 20, roas: 2.9, status: 'on-track' },
    { code: 'DE', name: 'Germany', allocation: 12, roas: 2.4, status: 'warning' },
    { code: 'JP', name: 'Japan', allocation: 8, roas: 1.8, status: 'critical' },
  ],
  weeklyBreakdown: [
    { week: 'W1', label: 'Jun 2-8', status: 'completed', focus: 'Launch summer campaigns' },
    { week: 'W2', label: 'Jun 9-15', status: 'completed', focus: 'Scale winners + creative refresh' },
    { week: 'W3', label: 'Jun 16-22', status: 'active', focus: 'Optimize underperformers + new markets' },
    { week: 'W4', label: 'Jun 23-29', status: 'upcoming', focus: 'Month-end push + reporting' },
  ],
}

/* ── Current week (W3) PDCA cycle ─────────────────────────── */
export const CURRENT_CYCLE = {
  week: 'W3',
  dateRange: 'Jun 16-22, 2025',
  status: 'in-progress',
  focus: 'Optimize underperformers + expand into new markets',

  /* ① Last week data verification */
  lastWeekVerification: {
    timestamp: '2025-06-16 09:00:00',
    status: 'verified',
    summary: {
      spend: 11920.30,
      roas: 3.25,
      purchases: 460,
      topCampaign: 'Summer Sale 2025 - Meta',
      topCampaignRoas: 4.1,
    },
  },

  /* ② This week data tracking */
  thisWeekTracking: {
    timestamp: '2025-06-16 10:30:00',
    status: 'live',
    daysSoFar: 1,
    metrics: {
      spend: 12847.50,
      roas: 3.42,
      purchases: 561,
      pacing: 'ahead', // ahead | on-track | behind
      projectedWeeklySpend: 28000,
    },
  },

  /* ③ AI strategy suggestions */
  aiSuggestions: {
    generatedAt: '2025-06-16 09:15:00',
    status: 'ready',
    items: [
      {
        id: 'sug-1',
        priority: 'high',
        title: 'Pause Google Shopping - Feed Optimized',
        description: 'ROAS 1.9x is below the 2.5x target for 3 consecutive days. Recommend pausing and reallocating budget.',
        impact: 'Save ~$500/week, improve blended ROAS by ~0.1x',
        action: 'pause-campaign',
      },
      {
        id: 'sug-2',
        priority: 'high',
        title: 'Scale Meta Summer Sale +25%',
        description: 'Consistently delivering 4.2x ROAS with room to scale. Current daily budget: $460. Suggest increasing to $575.',
        impact: 'Est. +$2,800 weekly revenue at similar ROAS',
        action: 'scale-budget',
      },
      {
        id: 'sug-3',
        priority: 'medium',
        title: 'Refresh TikTok Retargeting creatives',
        description: 'CPA spiked to $31.50 — creative fatigue likely. 3 new UGC variants ready in Creative Library.',
        impact: 'Expected CPA reduction to ~$25 based on similar refreshes',
        action: 'refresh-creative',
      },
      {
        id: 'sug-4',
        priority: 'low',
        title: 'Test DE market with Lookalike expansion',
        description: 'Germany showing 2.4x ROAS with limited spend. Lookalike from US top converters could unlock growth.',
        impact: 'Potential +15% monthly revenue from DE market',
        action: 'expand-market',
      },
    ],
  },

  /* ④ Execution tasks */
  tasks: [
    {
      id: 'task-1',
      type: 'gate-check',
      title: 'Morning budget optimization',
      schedule: 'Daily at 10:00 AM',
      nextRun: '2025-06-17 10:00:00',
      status: 'completed',
      completedAt: '2025-06-16 10:05:00',
      result: '3 campaigns adjusted, total +$180 daily budget shift',
    },
    {
      id: 'task-2',
      type: 'decision',
      title: 'Approve Google Shopping pause',
      description: 'Luna recommends pausing Shopping - Feed Optimized due to sustained low ROAS.',
      status: 'pending',
      options: ['Approve pause', 'Keep running 2 more days'],
      reasoning: null,
    },
    {
      id: 'task-3',
      type: 'action',
      title: 'Scale Meta Summer Sale budget to $575/day',
      status: 'pending',
      dueDate: '2025-06-17',
    },
    {
      id: 'task-4',
      type: 'action',
      title: 'Swap TikTok Retargeting creatives with new UGC batch',
      status: 'pending',
      dueDate: '2025-06-18',
    },
    {
      id: 'task-5',
      type: 'gate-check',
      title: 'Mid-week performance review',
      schedule: 'Wednesday at 2:00 PM',
      nextRun: '2025-06-18 14:00:00',
      status: 'upcoming',
    },
    {
      id: 'task-6',
      type: 'action',
      title: 'Launch DE Lookalike test campaign',
      status: 'pending',
      dueDate: '2025-06-19',
    },
    {
      id: 'task-7',
      type: 'gate-check',
      title: 'Weekly report generation',
      schedule: 'Friday at 5:00 PM',
      nextRun: '2025-06-20 17:00:00',
      status: 'upcoming',
    },
  ],

  /* Auto-scheduled recurring tasks */
  autoTasks: [
    { label: 'Budget optimization adjustment', schedule: 'Daily at 10:00 AM', enabled: true },
    { label: 'Performance anomaly scan', schedule: 'Daily at 6:00 PM', enabled: true },
    { label: 'Weekly analysis & report generation', schedule: 'Monday at 9:00 AM', enabled: true },
    { label: 'Creative fatigue check', schedule: 'Wednesday at 10:00 AM', enabled: true },
  ],
}
