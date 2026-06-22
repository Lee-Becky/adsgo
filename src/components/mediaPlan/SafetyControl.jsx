import React from 'react'
import { Shield, SlidersHorizontal, CheckCircle } from 'lucide-react'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

export default function SafetyControl({
  cappedSpend,
  dailyBudget,
  autoExecuteRecommendations,
  autoRegenEnabled,
}) {
  const spendPercent = dailyBudget > 0 ? Math.round((cappedSpend / dailyBudget) * 100) : 0
  const barColor =
    spendPercent < 70 ? 'bg-emerald-500' :
    spendPercent < 90 ? 'bg-amber-500' :
    'bg-rose-500'

  const badgeStyle = (isOn) => isOn
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-neutral-100 text-neutral-500'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-neutral-900">Safety & Control</h3>
        <DevGuideButton title="Safety & Control" content={DEV_GUIDES.safetyControl} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Budget Guard */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900">Budget Guard</h4>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(spendPercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-700">
              ${cappedSpend.toLocaleString()} / ${dailyBudget.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500">{spendPercent}%</span>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            AI strictly respects your daily budget cap. If performance drops, spend is reduced automatically — never beyond your limit.
          </p>
        </div>

        {/* Your Control */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary-600" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900">Your Control</h4>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">Budget Auto-apply</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle(autoExecuteRecommendations)}`}>
                {autoExecuteRecommendations ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">Campaign Auto-publish</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle(autoRegenEnabled)}`}>
                {autoRegenEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            You can pause or override AI decisions at any time. AdsGo works alongside your existing strategies — no hard switch needed.
          </p>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900">Compliance</h4>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-700">Meta Policy Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-700">Google Policy Compliant</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            All ads follow platform advertising policies. If an ad doesn't pass review, we'll flag it for you immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
