/* ═══════════════════════════════════════════════════════════
   Report Mock Data — DailyBrief + Performance Table
   ═══════════════════════════════════════════════════════════ */

/* ── KPI Summary ───────────────────────────────────────────── */
export const KPI_SUMMARY = [
  { key: 'spend',     label: 'Total Spend',   value: 12847.50,  trend: { value: 8.3, direction: 'up' },   format: 'currency' },
  { key: 'roas',      label: 'Blended ROAS',  value: 3.42,      trend: { value: 5.1, direction: 'up' },   format: 'number' },
  { key: 'cpa',       label: 'Avg. CPA',      value: 24.18,     trend: { value: 3.2, direction: 'down' }, format: 'currency' },
  { key: 'ctr',       label: 'CTR',            value: 2.87,      trend: { value: 0.4, direction: 'up' },   format: 'percentage' },
  { key: 'cpc',       label: 'Avg. CPC',       value: 0.82,      trend: { value: 1.1, direction: 'down' }, format: 'currency' },
  { key: 'addToCart', label: 'Add to Cart',    value: 1243,      trend: { value: 12.5, direction: 'up' },  format: 'number' },
]

/* ── Trend data (7-day) for sparklines / charts ───────────── */
export const TREND_DATA = [
  { date: 'Jun 10', spend: 1720, roas: 3.1, cpa: 26.5, ctr: 2.6, purchases: 65 },
  { date: 'Jun 11', spend: 1890, roas: 3.3, cpa: 25.2, ctr: 2.7, purchases: 72 },
  { date: 'Jun 12', spend: 1650, roas: 2.9, cpa: 27.1, ctr: 2.5, purchases: 58 },
  { date: 'Jun 13', spend: 1940, roas: 3.5, cpa: 23.8, ctr: 2.9, purchases: 81 },
  { date: 'Jun 14', spend: 2010, roas: 3.7, cpa: 22.4, ctr: 3.1, purchases: 89 },
  { date: 'Jun 15', spend: 1850, roas: 3.4, cpa: 24.6, ctr: 2.8, purchases: 75 },
  { date: 'Jun 16', spend: 1787, roas: 3.42, cpa: 24.18, ctr: 2.87, purchases: 72 },
]

/* ── Luna AI Brief ─────────────────────────────────────────── */
export const LUNA_BRIEF = {
  summary: `Overall performance improved compared to yesterday. ROAS climbed to 3.42x (+5.1%), driven primarily by strong results from the Summer Sale campaign on Meta. CPA decreased to $24.18 — below the $28 red line target.`,
  highlights: [
    { type: 'positive', text: 'Summer Sale campaign delivered ROAS 4.2x — highest in the past 14 days.' },
    { type: 'positive', text: 'New creative variant "Lifestyle-B" achieved CTR 3.8%, outperforming the average by 32%.' },
    { type: 'warning',  text: 'TikTok CPA spiked to $31.50 for Retargeting Warm audience — approaching red line.' },
    { type: 'negative', text: 'Google Search campaign ROAS dropped to 1.9x — below the 2.5x target for 3 consecutive days.' },
  ],
  recommendation: 'Consider reallocating 15% of Google Search budget to Meta Prospecting, which is showing strong unit economics. Luna has prepared a budget adjustment draft in Ads > Campaigns.',
}

/* ── Platform breakdown for pie chart ─────────────────────── */
export const PLATFORM_SPEND = [
  { platform: 'Meta',    spend: 7420, roas: 3.8, color: 'var(--platform-meta)' },
  { platform: 'Google',  spend: 3210, roas: 2.4, color: 'var(--platform-google)' },
  { platform: 'TikTok',  spend: 1840, roas: 3.1, color: 'var(--platform-tiktok)' },
  { platform: 'Bing',    spend: 377,  roas: 2.9, color: 'var(--platform-bing)' },
]

/* ── Campaign-level performance (for table) ───────────────── */
export const CAMPAIGN_PERFORMANCE = [
  { id: 1,  name: 'Summer Sale 2025 - Meta',        platform: 'Meta',   status: 'Active', spend: 3250, impressions: 485200, clicks: 14556, ctr: 3.00, cpc: 0.22, cpa: 19.80, roas: 4.20, purchases: 164, addToCart: 412, date: '2025-06-16' },
  { id: 2,  name: 'Retargeting - Warm Audience',     platform: 'Meta',   status: 'Active', spend: 2180, impressions: 312000, clicks: 8736,  ctr: 2.80, cpc: 0.25, cpa: 22.40, roas: 3.60, purchases: 97,  addToCart: 245, date: '2025-06-16' },
  { id: 3,  name: 'Lookalike - US Tier 1',           platform: 'Meta',   status: 'Active', spend: 1990, impressions: 267400, clicks: 6956,  ctr: 2.60, cpc: 0.29, cpa: 26.80, roas: 3.10, purchases: 74,  addToCart: 186, date: '2025-06-16' },
  { id: 4,  name: 'Performance Max - All Products',  platform: 'Google', status: 'Active', spend: 1820, impressions: 198300, clicks: 4958,  ctr: 2.50, cpc: 0.37, cpa: 28.10, roas: 2.80, purchases: 65,  addToCart: 132, date: '2025-06-16' },
  { id: 5,  name: 'Brand Search - Exact Match',      platform: 'Google', status: 'Active', spend: 890,  impressions: 42100,  clicks: 3368,  ctr: 8.00, cpc: 0.26, cpa: 14.20, roas: 5.20, purchases: 63,  addToCart: 89,  date: '2025-06-16' },
  { id: 6,  name: 'Shopping - Feed Optimized',       platform: 'Google', status: 'Paused', spend: 500,  impressions: 65800,  clicks: 1316,  ctr: 2.00, cpc: 0.38, cpa: 35.70, roas: 1.90, purchases: 14,  addToCart: 42,  date: '2025-06-16' },
  { id: 7,  name: 'Spark Ads - UGC Collection',      platform: 'TikTok', status: 'Active', spend: 1240, impressions: 387500, clicks: 9300,  ctr: 2.40, cpc: 0.13, cpa: 24.80, roas: 3.40, purchases: 50,  addToCart: 118, date: '2025-06-16' },
  { id: 8,  name: 'Retargeting - TikTok Warm',       platform: 'TikTok', status: 'Active', spend: 600,  impressions: 142000, clicks: 3550,  ctr: 2.50, cpc: 0.17, cpa: 31.50, roas: 2.60, purchases: 19,  addToCart: 48,  date: '2025-06-16' },
  { id: 9,  name: 'Bing Shopping - US',              platform: 'Bing',   status: 'Active', spend: 377,  impressions: 28900,  clicks: 751,   ctr: 2.60, cpc: 0.50, cpa: 25.10, roas: 2.90, purchases: 15,  addToCart: 31,  date: '2025-06-16' },
]

/* ── Daily historical data (for PerformanceTable) ─────────── */
export const DAILY_PERFORMANCE = [
  { date: '2025-06-16', spend: 12847.50, impressions: 1929200, clicks: 53491, ctr: 2.87, cpc: 0.82, cpa: 24.18, roas: 3.42, purchases: 561, addToCart: 1243 },
  { date: '2025-06-15', spend: 11920.30, impressions: 1812500, clicks: 49862, ctr: 2.75, cpc: 0.79, cpa: 25.90, roas: 3.25, purchases: 460, addToCart: 1102 },
  { date: '2025-06-14', spend: 13250.80, impressions: 2045300, clicks: 57268, ctr: 2.80, cpc: 0.81, cpa: 23.40, roas: 3.52, purchases: 566, addToCart: 1298 },
  { date: '2025-06-13', spend: 12450.60, impressions: 1925800, clicks: 53842, ctr: 2.82, cpc: 0.78, cpa: 24.80, roas: 3.38, purchases: 502, addToCart: 1180 },
  { date: '2025-06-12', spend: 10890.20, impressions: 1698400, clicks: 45668, ctr: 2.69, cpc: 0.76, cpa: 26.20, roas: 3.10, purchases: 416, addToCart: 985 },
  { date: '2025-06-11', spend: 12180.40, impressions: 1856200, clicks: 51284, ctr: 2.76, cpc: 0.80, cpa: 25.10, roas: 3.28, purchases: 485, addToCart: 1145 },
  { date: '2025-06-10', spend: 11350.70, impressions: 1742800, clicks: 47512, ctr: 2.73, cpc: 0.77, cpa: 25.80, roas: 3.15, purchases: 440, addToCart: 1058 },
  { date: '2025-06-09', spend: 10580.90, impressions: 1632500, clicks: 44078, ctr: 2.70, cpc: 0.74, cpa: 26.80, roas: 3.02, purchases: 395, addToCart: 945 },
  { date: '2025-06-08', spend: 9820.50,  impressions: 1512600, clicks: 40840, ctr: 2.70, cpc: 0.73, cpa: 27.50, roas: 2.95, purchases: 357, addToCart: 872 },
  { date: '2025-06-07', spend: 11680.30, impressions: 1798200, clicks: 49360, ctr: 2.74, cpc: 0.78, cpa: 25.60, roas: 3.20, purchases: 456, addToCart: 1090 },
  { date: '2025-06-06', spend: 12320.60, impressions: 1892400, clicks: 52108, ctr: 2.75, cpc: 0.80, cpa: 25.20, roas: 3.30, purchases: 489, addToCart: 1165 },
  { date: '2025-06-05', spend: 11890.40, impressions: 1825600, clicks: 50142, ctr: 2.75, cpc: 0.79, cpa: 25.40, roas: 3.22, purchases: 468, addToCart: 1120 },
  { date: '2025-06-04', spend: 10950.80, impressions: 1685200, clicks: 46136, ctr: 2.74, cpc: 0.76, cpa: 26.10, roas: 3.08, purchases: 420, addToCart: 1002 },
  { date: '2025-06-03', spend: 11420.20, impressions: 1758400, clicks: 48108, ctr: 2.74, cpc: 0.77, cpa: 25.90, roas: 3.18, purchases: 441, addToCart: 1052 },
]
