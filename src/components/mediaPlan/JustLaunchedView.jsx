import React from 'react'
import { Rocket } from 'lucide-react'
import { STATUS_BAR_DATA } from './mockData'
import LaunchProgress from './LaunchProgress'
import SetupChecklist from './SetupChecklist'
import ExpectTimeline from './ExpectTimeline'

export default function JustLaunchedView({
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
  onPageChange,
}) {
  const { dailyBudget } = STATUS_BAR_DATA

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <div className="bg-white rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Your ads are live!</h2>
            <p className="text-xs text-gray-500 mt-0.5">3 campaigns published — here's what's happening now.</p>
          </div>
        </div>
      </div>

      {/* Section 1 & 2: Launch Progress + Complete Your Setup (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Launch Progress */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Launch Progress</h3>
          <LaunchProgress />
        </div>

        {/* Complete Your Setup */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <SetupChecklist
            autoExecuteRecommendations={autoExecuteRecommendations}
            autoRegenEnabled={autoRegenEnabled}
            onAutoExecuteChange={onAutoExecuteChange}
            onAutoRegenChange={onAutoRegenChange}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* Section 3: What to Expect + Safety */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
        <ExpectTimeline dailyBudget={dailyBudget} />
      </div>
    </div>
  )
}
