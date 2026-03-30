import React from 'react'
import { TrendingUp, Award, Star, Zap, Target, Eye, MousePointer, DollarSign } from 'lucide-react'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

const METRIC_ICONS = {
  ROAS: DollarSign,
  CTR: MousePointer,
  CPC: DollarSign,
  CPM: Eye,
  CPA: Target,
  Conversions: Zap,
}

const METRIC_COLORS = {
  ROAS: 'text-emerald-600',
  CTR: 'text-blue-600',
  CPC: 'text-emerald-600',
  CPM: 'text-emerald-600',
  CPA: 'text-emerald-600',
  Conversions: 'text-purple-600',
}

const TYPE_STYLES = {
  adset: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Target,
    iconColor: 'text-blue-500',
  },
  ad: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: Star,
    iconColor: 'text-purple-500',
  },
  creative: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Award,
    iconColor: 'text-amber-500',
  },
  campaign: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: Target,
    iconColor: 'text-emerald-500',
  },
}

function ActionBenefits({ benefits }) {
  if (!benefits || benefits.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">Action Benefits</h4>
          <p className="text-[10px] text-gray-500">Impact from completed actions in past 7 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {benefits.map((benefit, idx) => {
          const Icon = METRIC_ICONS[benefit.metric] || TrendingUp
          const colorClass = METRIC_COLORS[benefit.metric] || 'text-emerald-600'
          const isPositive = benefit.change.includes('+') || !benefit.change.includes('-')

          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-700">{benefit.metric}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-lg font-bold ${colorClass}`}>
                  {benefit.change}
                </span>
                {isPositive && (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                )}
              </div>
              <p className="text-[10px] text-gray-500 leading-snug">{benefit.attribution}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HighlightItem({ highlight }) {
  const style = TYPE_STYLES[highlight.type] || TYPE_STYLES.ad
  const Icon = style.icon

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-3 flex items-start gap-3`}>
      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${style.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-800 truncate">{highlight.name}</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{highlight.date}</span>
        </div>
        <p className="text-xs text-gray-600 leading-snug">{highlight.achievement}</p>
      </div>
    </div>
  )
}

function Highlights({ highlights }) {
  if (!highlights || highlights.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <Award className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">Highlights</h4>
          <p className="text-[10px] text-gray-500">Top performers exceeding targets or benchmarks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highlights.map((highlight, idx) => (
          <HighlightItem key={idx} highlight={highlight} />
        ))}
      </div>
    </div>
  )
}

export default function HighlightsCard({ actionBenefits, highlights }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Highlights of the Past 7 Days</h3>
        <DevGuideButton title="Highlights" content={DEV_GUIDES.highlights} />
      </div>

      {/* Action Benefits Section */}
      <ActionBenefits benefits={actionBenefits} />

      {/* Divider */}
      {actionBenefits && actionBenefits.length > 0 && highlights && highlights.length > 0 && (
        <div className="border-t border-gray-200 my-4" />
      )}

      {/* Highlights Section */}
      <Highlights highlights={highlights} />

      {/* Empty State */}
      {(!actionBenefits || actionBenefits.length === 0) && (!highlights || highlights.length === 0) && (
        <div className="text-center py-8">
          <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">No highlights yet</p>
          <p className="text-xs text-gray-400 mt-0.5">Keep optimizing — achievements will appear here</p>
        </div>
      )}
    </div>
  )
}
