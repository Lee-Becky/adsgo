import React from 'react'
import { Search, TrendingUp, BarChart3, Shield, Radio } from 'lucide-react'

const TIMELINE_PHASES = [
  {
    id: 'explore',
    period: 'Day 1-3',
    label: 'Exploring',
    icon: Search,
    description: 'Testing audiences & creatives, collecting baseline data.',
    color: 'bg-blue-500',
    ringColor: 'ring-blue-200',
  },
  {
    id: 'optimize',
    period: 'Day 4-7',
    label: 'First Optimizations',
    icon: TrendingUp,
    description: 'Patterns emerge, AI adjusts budgets and pauses underperformers.',
    color: 'bg-amber-500',
    ringColor: 'ring-amber-200',
  },
  {
    id: 'trends',
    period: 'Day 7+',
    label: 'Meaningful Trends',
    icon: BarChart3,
    description: 'Dashboard comes alive with real insights and stable metrics.',
    color: 'bg-emerald-500',
    ringColor: 'ring-emerald-200',
  },
]

export default function ExpectTimeline({ dailyBudget = 3500 }) {
  return (
    <div>
      {/* Timeline */}
      <h4 className="text-sm font-semibold text-gray-900 mb-4">What to Expect</h4>

      <div className="relative">
        {/* Horizontal connector line */}
        <div className="absolute top-3 left-3 right-3 h-px bg-gray-200 hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIMELINE_PHASES.map((phase) => {
            const Icon = phase.icon
            return (
              <div key={phase.id} className="relative">
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full ${phase.color} ring-4 ${phase.ringColor} flex items-center justify-center mb-3 relative z-10 bg-white`}>
                  <div className={`w-6 h-6 rounded-full ${phase.color} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{phase.period}</span>
                  <h5 className="text-xs font-semibold text-gray-800 mt-0.5">{phase.label}</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Safety Reassurance */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-gray-600">
            Daily budget cap (${dailyBudget.toLocaleString()}) is active — AI never exceeds it.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-xs text-gray-600">
            Data syncs every hour — first insights within 24-48 hours.
          </span>
        </div>
      </div>
    </div>
  )
}
