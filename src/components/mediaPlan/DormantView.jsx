import React from 'react'
import { PauseCircle, TrendingUp, DollarSign, Users, Clock, ArrowRight, Zap, Target, BarChart3 } from 'lucide-react'
import { DORMANT_DATA } from './mockData'

export default function DormantView({ onRestart, onPageChange }) {
  const { historicalPeak, pausedInfo, opportunityCost, restartRecommendation } = DORMANT_DATA

  // Format date for display
  const pausedDate = new Date(pausedInfo.pausedAt)
  const formattedDate = pausedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header Banner - Dormant Status */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <PauseCircle className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your ads are currently paused</h2>
            <p className="text-sm text-gray-500 mt-1">
              Paused for {pausedInfo.daysPaused} days · Last active on {formattedDate}
            </p>
            <p className="text-xs text-gray-400 mt-2">{pausedInfo.reason}</p>
          </div>
        </div>
      </div>

      {/* Core Content - 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Historical Performance */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-900">Historical Performance</h3>
          </div>

          <div className="space-y-4">
            {/* Peak ROAS */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Peak ROAS</span>
              <span className="text-sm font-semibold text-emerald-600">{historicalPeak.roas}</span>
            </div>

            {/* Peak CPA */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Best CPA</span>
              <span className="text-sm font-semibold text-emerald-600">${historicalPeak.cpa}</span>
            </div>

            {/* Total Conversions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Total Conversions</span>
              <span className="text-sm font-semibold text-gray-900">{historicalPeak.conversions.toLocaleString()}</span>
            </div>

            {/* Total Spend */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Total Spend</span>
              <span className="text-sm font-semibold text-gray-900">${historicalPeak.spend.toLocaleString()}</span>
            </div>

            {/* Days Active */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Days Active</span>
              <span className="text-sm font-semibold text-gray-900">{historicalPeak.daysActive} days</span>
            </div>
          </div>

          {/* Success Badge */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Target className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-xs text-emerald-700 font-medium">
                Proven track record of success
              </span>
            </div>
          </div>
        </div>

        {/* Center: Why Restart Now */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">{restartRecommendation.title}</h3>
          </div>

          <ul className="space-y-3">
            {restartRecommendation.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>

          {/* AI Analysis Badge */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-xs text-blue-700 font-medium">
                AI analyzed 28 top performers during downtime
              </span>
            </div>
          </div>
        </div>

        {/* Right: Opportunity Cost */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Opportunity Cost</h3>
          </div>

          <div className="space-y-4">
            {/* Lost Conversions */}
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700 font-medium">Estimated Lost Conversions</span>
              </div>
              <p className="text-lg font-bold text-amber-900">{opportunityCost.estimatedLostConversions}</p>
            </div>

            {/* Lost Revenue */}
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700 font-medium">Estimated Lost Revenue</span>
              </div>
              <p className="text-lg font-bold text-amber-900">${opportunityCost.estimatedLostRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
            {opportunityCost.note} based on {opportunityCost.basedOnIndustry} benchmarks
          </p>
        </div>
      </div>

      {/* Bottom: Quick Restart Options */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{restartRecommendation.quickStart.title}</h3>
            <p className="text-sm text-gray-500">Choose how you want to restart your campaigns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onPageChange?.('adManagerV3')}
            className="flex flex-col items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-gray-900">Resume Best Performer</span>
            </div>
            <span className="text-xs text-gray-500">{restartRecommendation.quickStart.options[0].desc}</span>
          </button>

          <button
            onClick={() => onPageChange?.('autoRegeneration')}
            className="flex flex-col items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-900">Start Fresh</span>
            </div>
            <span className="text-xs text-gray-500">{restartRecommendation.quickStart.options[1].desc}</span>
          </button>

          <button
            onClick={() => onPageChange?.('batchGenerateAds')}
            className="flex flex-col items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-900">Custom Restart</span>
            </div>
            <span className="text-xs text-gray-500">{restartRecommendation.quickStart.options[2].desc}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
