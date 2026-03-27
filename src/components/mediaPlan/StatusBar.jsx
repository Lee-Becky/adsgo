import React, { useMemo } from 'react'
import { LineChart, Line } from 'recharts'
import { Search, Settings, TrendingUp } from 'lucide-react'

const PHASE_ICONS = { exploring: Search, optimizing: Settings, scaling: TrendingUp }

function getPhase(kpiAchievement) {
  if (kpiAchievement < 0.4) return { id: 'exploring', label: 'Exploring' }
  if (kpiAchievement < 0.8) return { id: 'optimizing', label: 'Optimizing' }
  return { id: 'scaling', label: 'Scaling' }
}

function buildKPITrend(activeCampaigns, kpiType) {
  const dailyMap = {}
  activeCampaigns.forEach(campaign => {
    ;(campaign.history || []).forEach(day => {
      if (!dailyMap[day.date]) {
        dailyMap[day.date] = { revenue: 0, spend: 0, conversions: 0 }
      }
      dailyMap[day.date].revenue += day.revenue
      dailyMap[day.date].spend += day.spend
      if (campaign.objective === 'Purchase') dailyMap[day.date].conversions += day.purchases
      else if (campaign.objective === 'Traffic') dailyMap[day.date].conversions += day.clicks
      else dailyMap[day.date].conversions += day.event1s
    })
  })

  return Object.entries(dailyMap)
    .map(([date, data]) => ({
      date,
      kpiValue: kpiType === 'ROAS'
        ? (data.spend > 0 ? data.revenue / data.spend : 0)
        : (data.conversions > 0 ? data.spend / data.conversions : 0),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
}

export default function StatusBar({ campaigns, kpiType, kpiTarget, dailyBudget }) {
  const computed = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active')

    const todaySpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
    const cappedSpend = Math.min(todaySpend, dailyBudget)

    let currentKPI = 0
    if (kpiType === 'ROAS') {
      const totalRevenue = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.revenue, 0)
      const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
      currentKPI = totalSpend > 0 ? totalRevenue / totalSpend : 0
    } else {
      const totalConversions = activeCampaigns.reduce((sum, c) => {
        if (c.objective === 'Purchase') return sum + c.todayMetrics.purchases
        if (c.objective === 'Traffic') return sum + c.todayMetrics.clicks
        return sum + c.todayMetrics.event1s
      }, 0)
      const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
      currentKPI = totalConversions > 0 ? totalSpend / totalConversions : 0
    }

    const kpiAchievement = kpiType === 'ROAS'
      ? (kpiTarget > 0 ? currentKPI / kpiTarget : 0)
      : (currentKPI > 0 ? kpiTarget / currentKPI : 0)

    const phase = getPhase(kpiAchievement)
    const kpiTrend = buildKPITrend(activeCampaigns, kpiType)

    const spendPercent = dailyBudget > 0 ? cappedSpend / dailyBudget : 0
    const spendColor =
      spendPercent < 0.7 ? 'text-gray-700' :
      spendPercent < 0.9 ? 'text-amber-600' :
      'text-rose-600'

    const isUptrend = kpiTrend.length >= 2 &&
      kpiTrend[kpiTrend.length - 1].kpiValue > kpiTrend[0].kpiValue

    return { currentKPI, kpiAchievement, phase, kpiTrend, cappedSpend, spendColor, isUptrend }
  }, [campaigns, kpiType, kpiTarget, dailyBudget])

  const { currentKPI, kpiAchievement, phase, kpiTrend, cappedSpend, spendColor, isUptrend } = computed
  const PhaseIcon = PHASE_ICONS[phase.id] || Search

  const kpiText = kpiType === 'ROAS'
    ? `${currentKPI.toFixed(1)}x → target ${kpiTarget}x`
    : `$${currentKPI.toFixed(0)} → target $${kpiTarget}`

  const achievementPct = Math.round(kpiAchievement * 100)

  const phaseColors = {
    exploring: 'bg-amber-100 text-amber-700 border-amber-200',
    optimizing: 'bg-primary-50 text-primary-700 border-primary-200',
    scaling: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] px-5 py-3.5 flex items-center justify-between gap-4">
      {/* Phase badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${phaseColors[phase.id]}`}>
        <PhaseIcon className="w-3.5 h-3.5" />
        {phase.label}
        <span className="opacity-70">({achievementPct}%)</span>
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-gray-200" />

      {/* KPI */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium text-gray-900">{kpiType}</span>
        <span className="text-gray-500">{kpiText}</span>
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-gray-200" />

      {/* Spend */}
      <div className={`text-sm font-medium ${spendColor}`}>
        ${cappedSpend.toLocaleString()} / ${dailyBudget.toLocaleString()} daily
      </div>

      {/* Sparkline */}
      {kpiTrend.length >= 2 && (
        <div className="ml-auto flex-shrink-0">
          <LineChart width={100} height={28} data={kpiTrend}>
            <Line
              type="monotone"
              dataKey="kpiValue"
              stroke={isUptrend ? '#10b981' : '#f43f5e'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      )}
    </div>
  )
}

// Export helpers for use by other modules
export { getPhase, buildKPITrend }
