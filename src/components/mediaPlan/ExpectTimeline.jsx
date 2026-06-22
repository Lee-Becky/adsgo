import React from 'react'
import { Search, TrendingUp, BarChart3, Shield, Radio } from 'lucide-react'

const TIMELINE_PHASES = [
  {
    id: 'learning',
    period: 'Day 1-7',
    label: 'Learning',
    icon: Search,
    description: 'Testing audiences & creatives — winning patterns emerge through data-driven elimination and new campaign creation.',
    color: 'bg-blue-500',
    ringColor: 'ring-blue-200',
  },
  {
    id: 'optimization',
    period: 'Day 7-14',
    label: 'Optimization',
    icon: TrendingUp,
    description: 'Comprehensive performance & potential evaluation — scaling profitable campaigns with intelligent budget allocation.',
    color: 'bg-amber-500',
    ringColor: 'ring-amber-200',
  },
  {
    id: 'scaling',
    period: 'Day 14+',
    label: 'Scaling',
    icon: BarChart3,
    description: 'Best campaign portfolio — stable performance through budget optimization and automated new campaign generation.',
    color: 'bg-emerald-500',
    ringColor: 'ring-emerald-200',
  },
]

export default function ExpectTimeline({ dailyBudget = 3500 }) {
  return (
    <div>
      {/* Timeline */}
      <h4 className="text-sm font-semibold text-neutral-900 mb-4">What to Expect</h4>

      <div className="relative">
        {/* Horizontal connector line */}
        <div className="absolute top-3 left-3 right-3 h-px bg-neutral-200 hidden sm:block" />

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
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{phase.period}</span>
                  <h5 className="text-xs font-semibold text-neutral-800 mt-0.5">{phase.label}</h5>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Safety Reassurance */}
      <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-neutral-600">
            Daily budget cap (${dailyBudget.toLocaleString()}) is active — AI never exceeds it.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-xs text-neutral-600">
            Data syncs every hour — first insights within 24-48 hours.
          </span>
        </div>
      </div>
    </div>
  )
}
