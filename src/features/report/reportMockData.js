/* ═══════════════════════════════════════════════════════════
   Report Mock Data — DailyBrief + Performance Table
   ═══════════════════════════════════════════════════════════ */

/* ── KPI Summary ───────────────────────────────────────────── */
export const KPI_SUMMARY = [
  { key: 'spend',     label: '美国花费',   value: 303.10,  trend: { value: 22.4, direction: 'up' },   format: 'currency' },
  { key: 'roas',      label: '美国 ROAS',  value: 1.82,    trend: { value: 30.0, direction: 'down' }, format: 'number' },
  { key: 'cpa',       label: '美国 CPA',   value: 42.80,   trend: { value: 18.6, direction: 'up' },   format: 'currency' },
  { key: 'ctr',       label: 'CTR',        value: 1.74,    trend: { value: 0.2, direction: 'up' },    format: 'percentage' },
  { key: 'cpc',       label: 'CPC',        value: 0.96,    trend: { value: 1.1, direction: 'down' },  format: 'currency' },
  { key: 'addToCart', label: '加购',       value: 84,      trend: { value: 6.0, direction: 'down' },  format: 'number' },
]

/* ── Trend data (7-day) for sparklines / charts ───────────── */
export const TREND_DATA = [
  { date: '6/23', spend: 244, roas: 2.60, cpa: 31.2, ctr: 1.68, purchases: 13 },
  { date: '6/24', spend: 256, roas: 2.44, cpa: 33.8, ctr: 1.71, purchases: 12 },
  { date: '6/25', spend: 271, roas: 2.21, cpa: 36.4, ctr: 1.75, purchases: 11 },
  { date: '6/26', spend: 286, roas: 2.05, cpa: 39.2, ctr: 1.78, purchases: 10 },
  { date: '6/27', spend: 298, roas: 1.94, cpa: 40.6, ctr: 1.72, purchases: 9 },
  { date: '6/28', spend: 306, roas: 1.88, cpa: 41.5, ctr: 1.69, purchases: 9 },
  { date: '6/29', spend: 303, roas: 1.82, cpa: 42.8, ctr: 1.74, purchases: 9 },
]

/* ── Luna AI Brief ─────────────────────────────────────────── */
export const LUNA_BRIEF = {
  summary: '美国市场今日 ROAS 1.82，低于 2.40 目标。CTR 基本稳定，主要问题是冷启动转化效率下降和主视频疲劳。',
  highlights: [
    { type: 'negative', text: 'US Prospecting Broad ROAS 1.54，花费 +22.4%，购买量 -6.1%。' },
    { type: 'warning',  text: 'Core Legging Video V12 频次 4.7，CTR 较峰值下降 28.4%。' },
    { type: 'positive', text: 'Customer Proof Carousel 在再营销中 ROAS 2.04，仍高于账户平均。' },
    { type: 'warning',  text: 'US Retargeting 因促销周保留 $180/day，进入 48 小时观察。' },
  ],
  recommendation: '今日执行：US Prospecting Broad 从 $140 降到 $95；US Retargeting 保留 $180；冷启动主视频进入换新草稿。',
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
  { id: 1, name: 'US Retargeting Purchase', platform: 'Meta', status: '投放中', spend: 126, impressions: 31200, clicks: 543, ctr: 1.74, cpc: 0.23, cpa: 42.80, roas: 1.82, purchases: 9, addToCart: 31, date: '2026-06-29' },
  { id: 2, name: 'US Prospecting Broad', platform: 'Meta', status: '待降预算', spend: 118, impressions: 47800, clicks: 578, ctr: 1.21, cpc: 0.20, cpa: 58.60, roas: 1.54, purchases: 6, addToCart: 24, date: '2026-06-29' },
  { id: 3, name: 'US 3 Percent Lookalike', platform: 'Meta', status: '学习期', spend: 97, impressions: 28100, clicks: 458, ctr: 1.63, cpc: 0.21, cpa: 34.20, roas: 2.18, purchases: 11, addToCart: 29, date: '2026-06-29' },
  { id: 4, name: 'CA Expansion Test', platform: 'TikTok', status: '投放中', spend: 63, impressions: 19600, clicks: 404, ctr: 2.06, cpc: 0.16, cpa: 29.40, roas: 2.71, purchases: 7, addToCart: 18, date: '2026-06-29' },
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
