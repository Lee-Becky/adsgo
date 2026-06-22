import { useState } from 'react'
import { AlertTriangle, Target, Shield, Sparkles } from 'lucide-react'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import OptimizeGoals from '@components/brand/OptimizeGoals'
import { LunaAvatar } from '@components/luna'

/* ═══════════════════════════════════════════════════════════
   GoalsPage — OptimizeGoals + Red Line thresholds
   ═══════════════════════════════════════════════════════════ */

const DEFAULT_RED_LINES = {
  roasFloor: 2.5,
  cpaMax: 30,
  dailyBudgetMax: 5000,
  weeklySpendMax: 30000,
}

const GoalsPage = () => {
  const { markGoalConfigured } = useFeatureFlagsStore()
  const [redLines, setRedLines] = useState(DEFAULT_RED_LINES)
  const [saved, setSaved] = useState(false)

  const handleRedLineChange = (key, value) => {
    setRedLines(prev => ({ ...prev, [key]: parseFloat(value) || 0 }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Luna suggestion banner */}
      <div className="rounded-xl border border-luna-border bg-gradient-to-r from-luna-bg/40 to-white px-5 py-4 flex items-start gap-3">
        <LunaAvatar size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-caption text-neutral-700">
            <span className="font-semibold text-luna-violet">Luna suggests</span> setting your ROAS floor to 2.5x based on your current blended ROAS of 3.42x and market averages.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-2.5 py-1 rounded-lg text-caption font-semibold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors">
            Accept
          </button>
          <button className="px-2.5 py-1 rounded-lg text-caption font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
            Dismiss
          </button>
        </div>
      </div>

      {/* Existing OptimizeGoals component */}
      <OptimizeGoals onGoalSave={markGoalConfigured} />

      {/* Red Lines Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-danger-50 border border-danger-200 flex items-center justify-center">
            <Shield size={18} className="text-danger-500" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-neutral-900">Red Lines</h2>
            <p className="text-caption text-neutral-500">Alert thresholds — Luna will flag when metrics approach these limits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-neutral-600 flex items-center gap-1.5">
              <Target size={12} className="text-neutral-400" />
              ROAS Floor
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={redLines.roasFloor}
                onChange={(e) => handleRedLineChange('roasFloor', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-caption text-neutral-400">x</span>
            </div>
            <p className="text-[11px] text-neutral-400">Alert when blended ROAS drops below this value</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-neutral-600 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-neutral-400" />
              Max CPA
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-neutral-400">$</span>
              <input
                type="number"
                step="1"
                value={redLines.cpaMax}
                onChange={(e) => handleRedLineChange('cpaMax', e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-neutral-200 text-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 tabular-nums"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Alert when any campaign CPA exceeds this limit</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-neutral-600 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-neutral-400" />
              Daily Budget Cap
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-neutral-400">$</span>
              <input
                type="number"
                step="100"
                value={redLines.dailyBudgetMax}
                onChange={(e) => handleRedLineChange('dailyBudgetMax', e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-neutral-200 text-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 tabular-nums"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Maximum total daily spend across all campaigns</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-neutral-600 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-neutral-400" />
              Weekly Spend Limit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-neutral-400">$</span>
              <input
                type="number"
                step="1000"
                value={redLines.weeklySpendMax}
                onChange={(e) => handleRedLineChange('weeklySpendMax', e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-neutral-200 text-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 tabular-nums"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Hard stop for weekly spend — Luna pauses all campaigns if exceeded</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-caption font-medium text-success-600 flex items-center gap-1">
              <Sparkles size={12} /> Red lines saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-caption font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Save Red Lines
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalsPage
