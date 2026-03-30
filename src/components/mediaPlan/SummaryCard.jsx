import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, DollarSign, Zap, LayoutDashboard } from 'lucide-react'
import { AreaChart, Area, XAxis, ReferenceLine, ResponsiveContainer } from 'recharts'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

const ICON_MAP = { TrendingUp, TrendingDown, Minus, Target, DollarSign, Zap }

const SENTIMENT_STYLES = {
  positive: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/60',
    accentBorder: 'border-l-emerald-400',
    iconBg: 'bg-emerald-100 text-emerald-600',
    iconRing: 'ring-emerald-100/50',
    headlineColor: 'text-emerald-800',
    strokeColor: '#10b981',
    fillColor: '#10b981',
  },
  caution: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/60',
    accentBorder: 'border-l-amber-400',
    iconBg: 'bg-amber-100 text-amber-600',
    iconRing: 'ring-amber-100/50',
    headlineColor: 'text-amber-800',
    strokeColor: '#f59e0b',
    fillColor: '#f59e0b',
  },
  neutral: {
    border: 'border-gray-200',
    bg: 'bg-gray-50/60',
    accentBorder: 'border-l-gray-300',
    iconBg: 'bg-gray-100 text-gray-500',
    iconRing: 'ring-gray-100/50',
    headlineColor: 'text-gray-700',
    strokeColor: '#6b7280',
    fillColor: '#6b7280',
  },
}

// ── Causal Factor Analysis ──
function identifyCausalFactors(spendData, kpiTrend, kpiType) {
  const factors = []

  if (spendData?.dailyTrend && spendData.dailyTrend.length >= 2) {
    const trend = spendData.dailyTrend
    const firstCPA = trend[0].spend / (trend[0].conversions || 1)
    const lastCPA = trend[trend.length - 1].spend / (trend[trend.length - 1].conversions || 1)
    const cpaChange = ((lastCPA - firstCPA) / firstCPA) * 100

    if (cpaChange < -10) {
      factors.push({ type: 'efficiency_gain', detail: `Cost-per-acquisition improved ${Math.abs(cpaChange).toFixed(0)}% as we concentrated budget on top performers` })
    } else if (cpaChange > 10) {
      factors.push({ type: 'efficiency_loss', detail: `Cost efficiency declined — new audiences in testing phase are naturally more expensive initially` })
    }
  }

  if (spendData?.creativeFatigueAdsets > 0) {
    factors.push({
      type: 'creative_fatigue',
      detail: `${spendData.creativeFatigueAdsets} adsets showing creative fatigue signals (running 14+ days with declining CTR)`,
    })
  }

  if (spendData?.topEvent) {
    factors.push({ type: 'event_attribution', detail: spendData.topEvent })
  }

  if (spendData?.daysSinceNewCreative > 5) {
    factors.push({
      type: 'creative_gap',
      detail: `No new creatives uploaded in ${spendData.daysSinceNewCreative} days — fresh assets could accelerate improvement`,
    })
  }

  return factors
}

// ── Main Narrative Generator ──
function generateSummary(kpiTrend, kpiType, currentKPI, kpiTarget, spendData, currentWeekPlan, topDimensions) {
  const n = kpiTrend.length
  if (n < 2) {
    return {
      sentiment: 'neutral',
      icon: 'Minus',
      headline: 'Building performance baseline',
      body: `Your ${kpiType} is currently ${kpiType === 'ROAS' ? `${currentKPI.toFixed(1)}x` : `$${currentKPI.toFixed(0)}`}. The system is gathering data to establish reliable patterns. Once we have 3+ days of data, this briefing will include trend analysis and specific recommendations.`,
    }
  }

  const firstValue = kpiTrend[0].kpiValue
  const lastValue = kpiTrend[n - 1].kpiValue
  const changePercent = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0
  const isImproving = kpiType === 'ROAS' ? changePercent > 0 : changePercent < 0
  const isSignificant = Math.abs(changePercent) > 5
  const absChange = Math.abs(changePercent).toFixed(1)

  const kpiFormatted = kpiType === 'ROAS' ? `${currentKPI.toFixed(1)}x` : `$${currentKPI.toFixed(0)}`
  const targetFormatted = kpiType === 'ROAS' ? `${kpiTarget}x` : `$${kpiTarget}`

  const gapPercent = kpiType === 'ROAS'
    ? (kpiTarget > 0 ? ((kpiTarget - currentKPI) / kpiTarget * 100).toFixed(0) : '0')
    : (currentKPI > 0 ? ((currentKPI - kpiTarget) / currentKPI * 100).toFixed(0) : '0')

  const factors = identifyCausalFactors(spendData, kpiTrend, kpiType)
  const targetAchieved = kpiType === 'ROAS' ? currentKPI >= kpiTarget : currentKPI <= kpiTarget

  const weakDimLabel = topDimensions?.[0]
    ? { budget_optimization: 'budget allocation', campaign_recommendation: 'campaign strategy', creative: 'creative quality', ad_structure: 'ad structure', media_asset: 'media assets', landing_page: 'landing page performance' }[topDimensions[0].id] || topDimensions[0].id
    : null

  const weekObjective = currentWeekPlan?.coreObjective || null
  const firstTodo = currentWeekPlan?.youNeedToDo?.find(t => !t.completed)?.text || null

  if (targetAchieved) {
    let body = `Your ${kpiType} of ${kpiFormatted} has reached your ${targetFormatted} target — that's a ${absChange}% improvement over the past 7 days.`
    if (factors.find(f => f.type === 'event_attribution')) {
      body += ` A key driver was: ${factors.find(f => f.type === 'event_attribution').detail}.`
    }
    if (factors.find(f => f.type === 'efficiency_gain')) {
      body += ` ${factors.find(f => f.type === 'efficiency_gain').detail}.`
    }
    body += ` Going forward, AdsGo will focus on gradual scaling while monitoring for audience saturation.`
    if (weekObjective) body += ` This week's direction: ${weekObjective.toLowerCase()}.`
    body += ` We'll keep optimizing the creative mix and expanding audiences to maintain performance.`
    return { sentiment: 'positive', icon: 'TrendingUp', headline: `${kpiType} target achieved — scaling while maintaining efficiency`, body }
  }

  if (isImproving && isSignificant) {
    let body = `Your ${kpiType} improved ${changePercent > 0 ? '+' : ''}${absChange}% over the past 7 days, moving from ${kpiType === 'ROAS' ? `${firstValue.toFixed(2)}x` : `$${firstValue.toFixed(0)}`} to ${kpiFormatted}. We're still ${gapPercent}% below the ${targetFormatted} target, but the trajectory is clearly positive.`
    if (factors.find(f => f.type === 'event_attribution')) {
      body += ` This improvement aligns with: ${factors.find(f => f.type === 'event_attribution').detail}.`
    }
    if (factors.find(f => f.type === 'efficiency_gain')) {
      body += ` ${factors.find(f => f.type === 'efficiency_gain').detail}.`
    }
    if (weakDimLabel) body += ` The biggest opportunity for further improvement is in ${weakDimLabel} — AdsGo is already working on this.`
    if (weekObjective) body += ` This week's focus: ${weekObjective.toLowerCase()}.`
    if (firstTodo) body += ` Your next recommended action: ${firstTodo.toLowerCase()}.`
    return { sentiment: 'positive', icon: 'TrendingUp', headline: `${kpiType} trending upward — ${gapPercent}% gap to target`, body }
  }

  if (!isImproving && isSignificant) {
    let body = `Your ${kpiType} ${kpiType === 'ROAS' ? 'declined' : 'increased'} ${absChange}% over the past 7 days (${kpiType === 'ROAS' ? `${firstValue.toFixed(2)}x → ${lastValue.toFixed(2)}x` : `$${firstValue.toFixed(0)} → $${lastValue.toFixed(0)}`}).`
    const causalFactors = factors.filter(f => f.type !== 'event_attribution')
    if (causalFactors.length > 0) {
      body += ` Analysis indicates: ${causalFactors[0].detail}.`
      if (causalFactors.length > 1) body += ` Additionally, ${causalFactors[1].detail}.`
    } else {
      body += ` This is common during the learning phase as new campaigns and audiences are being tested.`
    }
    body += ` AdsGo has already responded — underperforming ads have been paused and budget is being redirected to stronger performers.`
    if (weekObjective) body += ` The direction for this week: ${weekObjective.toLowerCase()}.`
    if (firstTodo) body += ` To help accelerate recovery: ${firstTodo.toLowerCase()}.`
    return { sentiment: 'caution', icon: 'TrendingDown', headline: `${kpiType} needs attention — here's what we're doing`, body }
  }

  let body = `Your ${kpiType} has been stable over the past 7 days at ${kpiFormatted} (within ${absChange}% variance). The system is actively testing new approaches to unlock the next performance level.`
  if (weakDimLabel) body += ` The area with the most untapped potential is ${weakDimLabel} — improving this could meaningfully shift overall results.`
  if (factors.find(f => f.type === 'creative_gap')) body += ` ${factors.find(f => f.type === 'creative_gap').detail}.`
  if (weekObjective) body += ` This week's plan: ${weekObjective.toLowerCase()}.`
  if (firstTodo) body += ` Consider: ${firstTodo.toLowerCase()}.`
  return { sentiment: 'neutral', icon: 'Minus', headline: `${kpiType} is stabilizing — working to break through`, body }
}

export default function SummaryCard({ kpiTrend, kpiType, currentKPI, kpiTarget, spendData, currentWeekPlan, topDimensions }) {
  const summary = useMemo(() => {
    return generateSummary(kpiTrend, kpiType, currentKPI, kpiTarget, spendData, currentWeekPlan, topDimensions)
  }, [kpiTrend, kpiType, currentKPI, kpiTarget, spendData, currentWeekPlan, topDimensions])

  const style = SENTIMENT_STYLES[summary.sentiment]
  const SummaryIcon = ICON_MAP[summary.icon]

  // Split body: first sentence bold, rest normal
  const bodyParts = useMemo(() => {
    const firstDot = summary.body.indexOf('.')
    if (firstDot === -1) return { lead: summary.body, rest: '' }
    return {
      lead: summary.body.slice(0, firstDot + 1),
      rest: summary.body.slice(firstDot + 1).trim(),
    }
  }, [summary.body])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="w-4.5 h-4.5 text-primary-500" />
          Summary
        </h3>
        <DevGuideButton title="Summary" content={DEV_GUIDES.summary} />
      </div>
      <div className={`rounded-xl border border-l-4 ${style.border} ${style.accentBorder} ${style.bg} p-5`}>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: Icon + Content */}
          <div className="flex-1 min-w-0 flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 ${style.iconBg} ${style.iconRing}`}>
              <SummaryIcon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-base font-bold ${style.headlineColor} mb-2`}>
                {summary.headline}
              </h4>
              <p className="text-xs leading-relaxed">
                <span className="font-medium text-gray-700">{bodyParts.lead}</span>
                {bodyParts.rest && <span className="text-gray-500"> {bodyParts.rest}</span>}
              </p>
            </div>
          </div>

          {/* Right: Trend chart */}
          {kpiTrend.length >= 2 && (
            <div className="lg:w-[35%] flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Past 7 days</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {kpiType === 'ROAS' ? `${kpiTrend[0].kpiValue.toFixed(2)}x` : `$${kpiTrend[0].kpiValue.toFixed(0)}`}
                  </span>
                  <span className="text-gray-300">&rarr;</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {kpiType === 'ROAS' ? `${kpiTrend[kpiTrend.length - 1].kpiValue.toFixed(2)}x` : `$${kpiTrend[kpiTrend.length - 1].kpiValue.toFixed(0)}`}
                  </span>
                </div>
              </div>
              <div className="w-full h-[100px]">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={kpiTrend}>
                    <defs>
                      <linearGradient id="summaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={style.fillColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={style.fillColor} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ReferenceLine
                      y={kpiTarget}
                      stroke="#d1d5db"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      label={{ value: `Target ${kpiType === 'ROAS' ? `${kpiTarget}x` : `$${kpiTarget}`}`, position: 'right', fontSize: 9, fill: '#9ca3af' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="kpiValue"
                      stroke={style.strokeColor}
                      strokeWidth={2.5}
                      fill="url(#summaryGrad)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
