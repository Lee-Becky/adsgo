/* ═══════════════════════════════════════════════════════════
   Mock Luna AI Service
   Keyword-matching → preset responses with 1-2s delay.
   Simulates streaming via chunked callbacks.
   ═══════════════════════════════════════════════════════════ */

/* ── Response templates ──────────────────────────────────── */

const RESPONSES = {
  /* ── Performance / Analysis ────────────────────────────── */
  performance: {
    text: `Here's your performance overview for the past 7 days:\n\n• Total Spend: $12,450 (+8.2% WoW)\n• ROAS: 3.82 (target: 3.5 ✓)\n• CPA: $18.40 (-5.1% WoW)\n• CTR: 2.14% (+0.3pp)\n• CVR: 4.8% (stable)\n\nKey insight: Your top-performing campaign "Summer Collection - Lookalike" is driving 42% of total purchases at a CPA 35% below average. Consider scaling its budget by 20-30%.`,
    type: 'analysis',
    syncTarget: null,
    dataCard: {
      title: 'Top Campaigns by ROAS',
      rows: [
        { name: 'Summer Collection - Lookalike', spend: '$3,240', roas: '5.12', status: 'active' },
        { name: 'Retargeting - Cart Abandon', spend: '$1,890', roas: '4.67', status: 'active' },
        { name: 'Brand Awareness - US', spend: '$2,100', roas: '3.21', status: 'active' },
        { name: 'New Audience - Interest', spend: '$1,680', roas: '2.84', status: 'warning' },
      ],
    },
  },

  budget: {
    text: `Based on current performance data, here are my budget optimization recommendations:\n\n1. **Increase** "Summer Collection - Lookalike" by $500/day → ROAS 5.12 is well above target\n2. **Decrease** "New Audience - Interest" by $200/day → CPA trending 18% above target\n3. **Maintain** "Retargeting - Cart Abandon" → Performing at optimal efficiency\n\nProjected impact: +12% total ROAS, -8% blended CPA over next 7 days.`,
    type: 'optimization',
    syncTarget: 'ads/campaigns',
    actionCard: {
      title: 'Apply Budget Changes',
      description: 'Apply these 3 budget adjustments to your campaigns',
    },
  },

  roas: {
    text: `ROAS Analysis for the past 30 days:\n\nYour overall ROAS is 3.82, which is 9% above your target of 3.5.\n\n• Best day: June 8 (ROAS 4.91) — coincided with your flash sale creative\n• Worst day: June 2 (ROAS 2.14) — audience fatigue detected on broad targeting\n• Weekend ROAS averages 15% higher than weekdays\n\nRecommendation: Shift 10-15% of weekday budget to Friday-Sunday to capitalize on higher weekend conversion rates.`,
    type: 'analysis',
    syncTarget: 'insight/dashboard',
  },

  /* ── Campaign Creation ─────────────────────────────────── */
  campaign: {
    text: `I'll draft a campaign structure for you. Based on your brand profile and historical data:\n\n**Campaign: Summer Sale 2025**\n├── Ad Set 1: Lookalike (Purchase, 1%)\n│   ├── Ad: Carousel — Top 4 products\n│   └── Ad: Video — 15s product showcase\n├── Ad Set 2: Interest (Fashion + Shopping)\n│   ├── Ad: Single Image — Hero product\n│   └── Ad: Collection — Summer lookbook\n└── Ad Set 3: Retargeting (Website 7d)\n    ├── Ad: Dynamic — Viewed products\n    └── Ad: Video — Customer testimonial\n\nEstimated daily budget: $800 | Projected ROAS: 3.5-4.2`,
    type: 'creation',
    syncTarget: 'create/campaign-gen',
    actionCard: {
      title: 'Create Campaign Draft',
      description: 'Save this campaign structure as a draft for review',
    },
  },

  creative: {
    text: `Creative performance insights:\n\n**Top Performers (by CTR):**\n1. Video 15s — "Summer Vibes" → CTR 3.8%, CVR 6.2%\n2. Carousel — "Best Sellers" → CTR 3.2%, CVR 5.1%\n3. Single Image — "Hero Banner" → CTR 2.9%, CVR 4.8%\n\n**Fatigue Alert:**\n• "Spring Collection" carousel has been running 21 days — CTR dropped 40% from peak\n• Recommend refreshing with new imagery or testing UGC variants\n\n**AI Suggestion:** I can generate 3 new creative variants based on your top-performing assets. Want me to proceed?`,
    type: 'analysis',
    syncTarget: 'creative/library',
  },

  /* ── Audience ──────────────────────────────────────────── */
  audience: {
    text: `Audience analysis summary:\n\n**Highest-Value Segments:**\n1. Women 25-34, Fashion Interest → CPA $12.30, ROAS 5.4\n2. Lookalike (Purchase 1%) → CPA $15.80, ROAS 4.8\n3. Men 25-44, Shopping → CPA $19.20, ROAS 3.9\n\n**Underperforming:**\n• Broad targeting 18-65 → CPA $34.50 (88% above avg)\n• Recommend pausing and reallocating to top segments\n\n**New Opportunity:** Based on your customer data, a "High-Value Repeat Buyers" seed audience could yield an estimated 2.3x ROAS improvement.`,
    type: 'analysis',
    syncTarget: 'insight/audience',
  },

  /* ── Report ────────────────────────────────────────────── */
  report: {
    text: `Daily Performance Brief — June 16, 2025\n\n📊 **KPI Summary**\n• Spend: $1,780 (budget pacing: 92%)\n• Revenue: $6,810 (ROAS: 3.83)\n• Purchases: 94 (CPA: $18.94)\n• Clicks: 4,210 (CTR: 2.1%, CPC: $0.42)\n\n📈 **Trends**\n• ROAS trending up 3 consecutive days\n• CPA decreased 5% vs yesterday\n• New creative "Summer Sale V2" outperforming control by 28%\n\n⚠️ **Alerts**\n• Campaign "Broad Reach" approaching daily budget cap (96%)\n• Ad Set "Retargeting 30d" frequency at 4.2 (fatigue risk)\n\nWant me to generate a client-ready report with these insights?`,
    type: 'report',
    syncTarget: 'report/daily-brief',
    actionCard: {
      title: 'Generate Client Report',
      description: 'Create a shareable performance report for your client',
    },
  },

  /* ── Strategy ──────────────────────────────────────────── */
  strategy: {
    text: `Weekly Strategy Recommendation (W25):\n\n**Current Phase:** Growth\n**Overall Goal:** ROAS ≥ 3.5, Purchase ROAS ≥ 2.8\n\n**This Week's Focus:**\n1. ✅ Scale "Summer Collection - Lookalike" budget (+20%)\n2. 🔄 Test 3 new UGC video creatives\n3. ⏳ Launch "High-Value Buyers" lookalike audience\n4. 📊 Monitor CPA red line ($25) on new campaigns\n\n**Auto Tasks (scheduled):**\n• Daily 10:00 — Budget optimization check\n• Wed 09:00 — Mid-week performance review\n• Fri 17:00 — Weekly close-out analysis\n\nShall I add these tasks to your Strategy Cycle?`,
    type: 'strategy',
    syncTarget: 'plan/strategy-cycle',
    actionCard: {
      title: 'Apply to Strategy Cycle',
      description: 'Add these tasks and goals to your weekly PDCA cycle',
    },
  },

  /* ── Goals / Settings ──────────────────────────────────── */
  goal: {
    text: `Based on your historical performance (last 90 days), here are my recommended goal settings:\n\n• **Target ROAS:** 3.5 (current avg: 3.82)\n• **CPA Red Line:** $25.00 (current avg: $18.40)\n• **Daily Budget Cap:** $2,000\n• **Frequency Cap:** 3.0 per 7 days\n• **CTR Floor:** 1.5% (pause below this)\n\nThese are conservative targets that account for seasonal variations. Want me to apply these to your Goals & Red Lines settings?`,
    type: 'settings',
    syncTarget: 'settings/goals',
    actionCard: {
      title: 'Apply Goal Settings',
      description: 'Update your optimization goals with these recommended values',
    },
  },

  /* ── Generic / Greeting ────────────────────────────────── */
  greeting: {
    text: `Hi! I'm Luna, your AI advertising assistant. I can help you with:\n\n• **Analyze** — Performance data, trends, and anomalies\n• **Optimize** — Budget allocation, audience targeting, bidding\n• **Create** — Campaign structures, ad copy, creative briefs\n• **Report** — Daily briefs, client reports, insights\n• **Strategize** — Weekly PDCA cycles, goal setting\n\nWhat would you like to explore today?`,
    type: 'greeting',
  },

  fallback: {
    text: `I understand you're asking about that. Let me analyze the relevant data...\n\nBased on your current campaign performance:\n• Your overall account health is good (score: 82/100)\n• 3 campaigns are performing above target\n• 1 campaign needs attention (rising CPA)\n\nCould you be more specific? I can help with:\n1. Performance deep-dive for specific campaigns\n2. Budget optimization recommendations\n3. Creative refresh suggestions\n4. Audience analysis\n5. Strategy planning`,
    type: 'general',
  },
}

/* ── Keyword → response mapping ──────────────────────────── */
const KEYWORD_MAP = [
  { keywords: ['hello', 'hi', 'hey', 'start', 'help', 'what can you'], key: 'greeting' },
  { keywords: ['performance', 'overview', 'how are', 'how is', 'stats', 'summary', 'kpi'], key: 'performance' },
  { keywords: ['budget', 'spend', 'spending', 'allocat', 'increase budget', 'decrease budget', 'optimize budget'], key: 'budget' },
  { keywords: ['roas', 'return on ad', 'return on spend'], key: 'roas' },
  { keywords: ['campaign', 'create campaign', 'new campaign', 'launch', 'draft'], key: 'campaign' },
  { keywords: ['creative', 'image', 'video', 'ad copy', 'fatigue', 'refresh'], key: 'creative' },
  { keywords: ['audience', 'targeting', 'segment', 'lookalike', 'retarget'], key: 'audience' },
  { keywords: ['report', 'brief', 'daily', 'client report', 'share'], key: 'report' },
  { keywords: ['strategy', 'plan', 'pdca', 'cycle', 'weekly', 'schedule', 'task'], key: 'strategy' },
  { keywords: ['goal', 'target', 'red line', 'threshold', 'setting', 'configure'], key: 'goal' },
]

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
  { id: 'adPerformance', label: 'Ad Performance', icon: 'BarChart3' },
  { id: 'creativeLibrary', label: 'Creative Library', icon: 'Palette' },
  { id: 'brandProfile', label: 'Brand Profile', icon: 'Building2' },
  { id: 'audienceData', label: 'Audience Data', icon: 'Users' },
  { id: 'competitorData', label: 'Competitor Intel', icon: 'Eye' },
  { id: 'marketTrends', label: 'Market Trends', icon: 'TrendingUp' },
]

/* ── Quick prompts by category ───────────────────────────── */
export const QUICK_PROMPTS = [
  { id: 'perf-overview', label: "Today's performance overview", category: 'analysis', icon: 'BarChart3' },
  { id: 'budget-opt', label: 'Optimize my budgets', category: 'optimize', icon: 'DollarSign' },
  { id: 'campaign-draft', label: 'Draft a new campaign', category: 'create', icon: 'Zap' },
  { id: 'daily-report', label: 'Generate daily report', category: 'report', icon: 'FileBarChart' },
  { id: 'creative-perf', label: 'Creative performance check', category: 'analysis', icon: 'Palette' },
  { id: 'audience-insights', label: 'Audience insights', category: 'analysis', icon: 'Users' },
  { id: 'weekly-strategy', label: 'Weekly strategy plan', category: 'strategy', icon: 'Target' },
  { id: 'goal-recommend', label: 'Recommend goal settings', category: 'optimize', icon: 'Settings' },
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
export const sendToLuna = async (userMessage, dataSources = [], onChunk) => {
  const intentKey = matchIntent(userMessage)
  const response = RESPONSES[intentKey]

  // Simulate thinking delay (800-1800ms)
  const thinkDelay = 800 + Math.random() * 1000
  await sleep(thinkDelay)

  // Simulate streaming if callback provided
  if (onChunk) {
    const words = response.text.split(' ')
    let accumulated = ''
    for (let i = 0; i < words.length; i++) {
      accumulated += (i === 0 ? '' : ' ') + words[i]
      onChunk(accumulated)
      await sleep(15 + Math.random() * 25) // 15-40ms per word
    }
  }

  return {
    text: response.text,
    type: response.type,
    syncTarget: response.syncTarget || null,
    dataCard: response.dataCard || null,
    actionCard: response.actionCard || null,
  }
}

/**
 * Get a quick-prompt response (same as sendToLuna but maps prompt ID → text)
 */
export const sendQuickPrompt = (promptId, dataSources, onChunk) => {
  const prompt = QUICK_PROMPTS.find((p) => p.id === promptId)
  const text = prompt ? prompt.label : 'Help me'
  return sendToLuna(text, dataSources, onChunk)
}

/* ── Helpers ──────────────────────────────────────────────── */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
