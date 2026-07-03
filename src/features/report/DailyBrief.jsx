import { useState, useMemo } from 'react'
import {
  Calendar, Share2, Download, Filter, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Sparkles, Copy, ExternalLink,
  ChevronDown,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import MetricCard from '@components/ui/MetricCard'
import { LunaAvatar } from '@components/luna'
import {
  KPI_SUMMARY, TREND_DATA, LUNA_BRIEF, PLATFORM_SPEND, CAMPAIGN_PERFORMANCE,
} from './reportMockData'
import { demoAuditEvents, demoCampaigns, demoRecommendations } from '../../data/adsgo2DemoData'

/* ── Resolve platform CSS vars for Recharts fill ──────────── */
const PLATFORM_VAR_MAP = {
  Meta:   '--platform-meta',
  Google: '--platform-google',
  TikTok: '--platform-tiktok',
  Bing:   '--platform-bing',
}

const getPlatformColors = () => {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    Object.entries(PLATFORM_VAR_MAP).map(([k, v]) => [k, style.getPropertyValue(v).trim()])
  )
}

/* ═══════════════════════════════════════════════════════════
   DailyBrief — AI-generated daily performance summary
   ═══════════════════════════════════════════════════════════ */

/* ── Filter chip set ───────────────────────────────────────── */
const VIEW_FILTERS = [
  { id: 'all',       label: '全部' },
  { id: 'anomaly',   label: '只看异常' },
  { id: 'roas',      label: 'ROAS 趋势' },
  { id: 'creative',  label: '素材影响' },
]

/* ── Highlight type styling ────────────────────────────────── */
const HIGHLIGHT_STYLE = {
  positive: { icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200' },
  warning:  { icon: AlertTriangle, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200' },
  negative: { icon: TrendingDown, color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200' },
}

const REPORT_NARRATIVE = {
  title: '每日投放简报 · 6月29日',
  summary: '美国市场今日 ROAS 为 1.82，低于 2.40 目标。已将冷启动预算从 $140 降到 $95，再营销因促销周保留 $180，并进入 48 小时观察。',
  bullets: [
    '冷启动花费增长但购买量下降，今日优先削减浪费花费。',
    '再营销保留曝光是本周客户促销诉求，暂不继续下调。',
    'Core Legging Video V12 已进入疲劳区间，草稿中心准备两条 UGC Hook 替换。',
  ],
}

const ADS_MANAGER_EVENTS = demoRecommendations.map((recommendation) => {
  const campaign = demoCampaigns.find((item) => item.id === recommendation.entityId)

  return {
    ...recommendation,
    campaignName: campaign?.name || recommendation.entityId,
    roas: campaign?.roas,
    spend: campaign?.spend,
  }
})

const DailyBrief = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const platformColors = useMemo(() => getPlatformColors(), [])

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setShareMenuOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex justify-end items-center gap-2">
        {/* Date picker placeholder */}
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-caption font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
          <Calendar size={14} />
          <span>今日</span>
          <ChevronDown size={12} />
        </button>
        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setShareMenuOpen(!shareMenuOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-caption font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">分享</span>
          </button>
          {shareMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl z-20 py-1">
              <button onClick={handleCopyLink} className="w-full flex items-center gap-2 px-3 py-2 text-caption text-neutral-700 hover:bg-neutral-50">
                <Copy size={14} /> 复制链接
              </button>
              <button onClick={() => setShareMenuOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-caption text-neutral-700 hover:bg-neutral-50">
                <ExternalLink size={14} /> 打开分享视图
              </button>
              <button onClick={() => setShareMenuOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-caption text-neutral-700 hover:bg-neutral-50">
                <Download size={14} /> 导出 PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Luna AI Brief ────────────────────────────────────── */}
      <div className="rounded-xl border border-luna-border bg-gradient-to-br from-luna-bg/50 to-white p-5">
        <div className="flex items-start gap-3 mb-4">
          <LunaAvatar size="sm" showRing />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading text-sm font-semibold text-neutral-900">今日账户判断</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-luna-bg text-luna-violet text-[10px] font-semibold border border-luna-border">
                <Sparkles size={10} /> 已计算
              </span>
            </div>
            <p className="text-body text-neutral-600 leading-relaxed">{LUNA_BRIEF.summary}</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2 mb-4">
          {LUNA_BRIEF.highlights.map((h, i) => {
            const style = HIGHLIGHT_STYLE[h.type]
            const Icon = style.icon
            return (
              <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${style.bg} border ${style.border}`}>
                <Icon size={14} className={`shrink-0 mt-0.5 ${style.color}`} />
                <p className="text-caption text-neutral-700">{h.text}</p>
              </div>
            )
          })}
        </div>

        {/* Recommendation */}
        <div className="px-3 py-2.5 rounded-lg bg-primary-50 border border-primary-200">
          <p className="text-caption text-primary-800 font-medium flex items-start gap-2">
            <TrendingUp size={14} className="shrink-0 mt-0.5 text-primary-500" />
            <span><strong>今日动作：</strong>{LUNA_BRIEF.recommendation}</span>
          </p>
        </div>

        <p className="text-[10px] text-neutral-400 mt-3 text-right">更新时间 10:30</p>
      </div>

      {/* ── Client narrative from Ads Manager event chain ───── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-4">
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">客户日报摘要</p>
              <h3 className="font-heading text-base font-semibold text-neutral-900 mt-1">{REPORT_NARRATIVE.title}</h3>
              <p className="text-body text-neutral-600 leading-relaxed mt-3">{REPORT_NARRATIVE.summary}</p>
            </div>
            <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
              客户可读
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {REPORT_NARRATIVE.bullets.map((item) => (
              <div key={item} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                <p className="text-caption text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">今日预算处理</h3>
          <div className="mt-4 space-y-3">
            {ADS_MANAGER_EVENTS.map((event) => (
              <div key={event.id} className="border-t border-neutral-100 pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{event.campaignName}</p>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                    event.status === '已采纳'
                      ? 'bg-success-50 text-success-700 border-success-200'
                      : event.status === '人工调整'
                        ? 'bg-info-50 text-info-700 border-info-200'
                        : 'bg-warning-50 text-warning-700 border-warning-200'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-caption text-neutral-500 mt-1">
                  ROAS {event.roas?.toFixed(2)}x / Spend ${event.spend?.toFixed(1)} / {event.action}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_SUMMARY.map((kpi) => (
          <MetricCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            format={kpi.format}
            trendLabel="vs yesterday"
          />
        ))}
      </div>

      {/* ── View Filters ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-neutral-400" />
        {VIEW_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-caption font-medium transition-colors border ${
              activeFilter === f.id
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Charts row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ROAS + Spend trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4">美国 ROAS 与花费趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} />
              <YAxis yAxisId="spend" orientation="left" tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="roas" orientation="right" tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} tickFormatter={(v) => `${v}x`} />
              <RechartsTooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--neutral-200)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val, name) => [name === 'spend' ? `$${val}` : `${val}x`, name === 'spend' ? '花费' : 'ROAS']}
              />
              <Line yAxisId="spend" type="monotone" dataKey="spend" stroke="var(--primary-500)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line yAxisId="roas" type="monotone" dataKey="roas" stroke="var(--success-500)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform spend pie */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4">平台花费占比</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={PLATFORM_SPEND}
                dataKey="spend"
                nameKey="platform"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--neutral-300)' }}
              >
                {PLATFORM_SPEND.map((entry, i) => (
                  <Cell key={i} fill={platformColors[entry.platform] || entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(val) => [`$${val.toLocaleString()}`, '花费']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--neutral-200)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

        {/* ── Campaign Performance Table ─────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">Campaign 表现</h3>
          <span className="text-caption text-neutral-400">{CAMPAIGN_PERFORMANCE.length} 个 Campaign</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">Campaign</th>
                <th className="text-left px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">平台</th>
                <th className="text-center px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">状态</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">花费</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">曝光</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CTR</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CPA</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGN_PERFORMANCE.map((c) => (
                <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-800 font-medium max-w-[240px] truncate">{c.name}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.platform === 'Meta' ? 'bg-info-50 text-info-700' :
                      c.platform === 'Google' ? 'bg-danger-50 text-danger-700' :
                      c.platform === 'TikTok' ? 'bg-neutral-100 text-neutral-800' :
                      'bg-success-50 text-success-700'
                    }`}>
                      {c.platform}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${c.status !== '暂停' ? 'text-success-600' : 'text-neutral-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status !== '暂停' ? 'bg-success-500' : 'bg-neutral-300'}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-neutral-700 tabular-nums">${c.spend.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-neutral-600 tabular-nums">{c.impressions.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-neutral-600 tabular-nums">{c.ctr.toFixed(2)}%</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className={c.cpa > 28 ? 'text-danger-600 font-semibold' : 'text-neutral-700'}>${c.cpa.toFixed(2)}</span>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className={`font-semibold ${c.roas >= 3.5 ? 'text-success-600' : c.roas >= 2.5 ? 'text-warning-600' : 'text-danger-600'}`}>
                      {c.roas.toFixed(1)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Audit trail ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">报告依据</h3>
          <span className="text-caption text-neutral-400">来自今日广告管理处理记录</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {demoAuditEvents.map((event) => (
            <div key={event.id} className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="font-mono text-[10px] text-neutral-400">{event.at}</p>
              <p className="text-sm font-semibold text-neutral-900 mt-1">{event.event}</p>
              <p className="text-caption text-neutral-500 mt-1">{event.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyBrief
