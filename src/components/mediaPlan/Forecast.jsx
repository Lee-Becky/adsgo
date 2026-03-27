import React, { useMemo } from 'react'
import { LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

function calcTrend(kpiTrend, kpiType) {
  const n = kpiTrend.length
  if (n < 2) return { slope: 0, direction: 'stable', dailyChange: 0, weeklyChangePct: 0 }

  const xMean = (n - 1) / 2
  const yMean = kpiTrend.reduce((s, d) => s + d.kpiValue, 0) / n

  let numerator = 0
  let denominator = 0
  kpiTrend.forEach((d, i) => {
    numerator += (i - xMean) * (d.kpiValue - yMean)
    denominator += (i - xMean) ** 2
  })

  const slope = denominator !== 0 ? numerator / denominator : 0
  const isImproving = kpiType === 'ROAS' ? slope > 0 : slope < 0
  const direction = Math.abs(slope) < 0.01 ? 'stable' : (isImproving ? 'improving' : 'declining')

  const firstValue = kpiTrend[0].kpiValue
  const lastValue = kpiTrend[n - 1].kpiValue
  const weeklyChangePct = firstValue > 0
    ? ((lastValue - firstValue) / firstValue) * 100
    : 0

  return { slope, direction, dailyChange: slope, weeklyChangePct }
}

function estimateDaysToTarget(currentKPI, kpiTarget, dailyChange, kpiType) {
  const isMovingToward = kpiType === 'ROAS' ? dailyChange > 0 : dailyChange < 0
  if (!isMovingToward || Math.abs(dailyChange) < 0.001) return null

  const gap = kpiType === 'ROAS'
    ? kpiTarget - currentKPI
    : currentKPI - kpiTarget

  if (gap <= 0) return 0

  const days = Math.ceil(gap / Math.abs(dailyChange))
  return days <= 180 ? days : null
}

function generateForecast(direction, weeklyChangePct, estimatedDays, kpiType) {
  const kpiLabel = kpiType
  const changeText = `${weeklyChangePct > 0 ? '+' : ''}${weeklyChangePct.toFixed(1)}%`

  if (direction === 'improving') {
    return {
      sentiment: 'positive',
      icon: TrendingUp,
      headline: `${kpiLabel} is improving`,
      body: estimatedDays !== null
        ? `${kpiLabel} improved ${changeText} over the past 7 days. At this pace, you'll reach your target in approximately ${estimatedDays} days. The system is actively optimizing — continue monitoring and the AI will keep scaling what works.`
        : `${kpiLabel} improved ${changeText} over the past 7 days. Performance is trending in the right direction.`,
    }
  }

  if (direction === 'declining') {
    return {
      sentiment: 'caution',
      icon: TrendingDown,
      headline: `${kpiLabel} has dipped — here's what's happening`,
      body: `${kpiLabel} changed ${changeText} over the past 7 days. This is common when new campaigns are launched or when audience saturation occurs. The system has already responded: underperforming ads have reduced budgets, and optimization rules are being executed. Consider refreshing creatives or reviewing your budget suggestions in Ad Manager.`,
    }
  }

  return {
    sentiment: 'neutral',
    icon: Minus,
    headline: `${kpiLabel} is holding steady`,
    body: `${kpiLabel} has been stable over the past 7 days. The system is testing new approaches to push performance further. You may want to add fresh creatives or adjust KPI targets to unlock the next phase.`,
  }
}

const SENTIMENT_STYLES = {
  positive: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/60',
    iconBg: 'bg-emerald-100 text-emerald-600',
    headlineColor: 'text-emerald-800',
    strokeColor: '#10b981',
  },
  caution: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/60',
    iconBg: 'bg-amber-100 text-amber-600',
    headlineColor: 'text-amber-800',
    strokeColor: '#f59e0b',
  },
  neutral: {
    border: 'border-gray-200',
    bg: 'bg-gray-50/60',
    iconBg: 'bg-gray-100 text-gray-500',
    headlineColor: 'text-gray-700',
    strokeColor: '#6b7280',
  },
}

export default function Forecast({ kpiTrend, kpiType, currentKPI, kpiTarget }) {
  const forecast = useMemo(() => {
    const trend = calcTrend(kpiTrend, kpiType)
    const days = estimateDaysToTarget(currentKPI, kpiTarget, trend.dailyChange, kpiType)
    return {
      ...generateForecast(trend.direction, trend.weeklyChangePct, days, kpiType),
      trend,
    }
  }, [kpiTrend, kpiType, currentKPI, kpiTarget])

  const style = SENTIMENT_STYLES[forecast.sentiment]
  const ForecastIcon = forecast.icon

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Forecast</h3>
        <DevGuideButton title="Forecast" content={DEV_GUIDES.forecast} />
      </div>
      <div className={`rounded-xl border ${style.border} ${style.bg} p-5 flex items-start gap-5`}>
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}>
              <ForecastIcon className="w-4 h-4" />
            </div>
            <h4 className={`text-sm font-semibold ${style.headlineColor}`}>
              {forecast.headline}
            </h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {forecast.body}
          </p>
        </div>

        {/* Right: Trend chart */}
        {kpiTrend.length >= 2 && (
          <div className="flex-shrink-0">
            <LineChart width={140} height={56} data={kpiTrend}>
              <Line
                type="monotone"
                dataKey="kpiValue"
                stroke={style.strokeColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  )
}
