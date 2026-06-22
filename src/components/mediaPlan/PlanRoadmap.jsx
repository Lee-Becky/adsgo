import React from 'react'
import { Search, Settings, TrendingUp, Check, Bot, User } from 'lucide-react'
import { PLAN_PHASES } from './mockData'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

const ICON_MAP = {
  Search, Settings, TrendingUp,
}

const PHASE_ORDER = ['exploring', 'optimizing', 'scaling']

export default function PlanRoadmap({ currentPhaseId }) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhaseId)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-neutral-900">The Plan</h3>
        <DevGuideButton title="The Plan" content={DEV_GUIDES.planRoadmap} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PLAN_PHASES.map((phase) => {
          const phaseIndex = PHASE_ORDER.indexOf(phase.id)
          let status = 'upcoming'
          if (phaseIndex < currentIndex) status = 'completed'
          else if (phaseIndex === currentIndex) status = 'active'

          const Icon = ICON_MAP[phase.icon] || Search

          const cardStyles = {
            completed: 'border-emerald-300 bg-emerald-50/50',
            active: 'border-primary-500 border-2 bg-primary-50/30',
            upcoming: 'border-neutral-200 bg-white',
          }

          const textDim = status === 'upcoming' ? 'opacity-50' : ''

          return (
            <div
              key={phase.id}
              className={`rounded-xl border p-5 relative transition-all ${cardStyles[status]}`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between mb-3 ${textDim}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                    status === 'active' ? 'bg-primary-100 text-primary-600' :
                    'bg-neutral-100 text-neutral-400'
                  }`}>
                    {status === 'completed' ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{phase.label}</div>
                    <div className="text-xs text-neutral-500">{phase.kpiRange}</div>
                  </div>
                </div>
                {status === 'active' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500 text-white">
                    You are here
                  </span>
                )}
              </div>

              {/* AI Does */}
              <div className={`mb-3 ${textDim}`}>
                <div className="flex items-center gap-1 mb-1.5">
                  <Bot className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs font-semibold text-neutral-700">AI does</span>
                </div>
                <ul className="space-y-1">
                  {phase.aiDoes.map((item, i) => (
                    <li key={i} className="text-xs text-neutral-600 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* You Do */}
              <div className={`mb-3 ${textDim}`}>
                <div className="flex items-center gap-1 mb-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-neutral-700">You do</span>
                </div>
                <ul className="space-y-1">
                  {phase.youDo.map((item, i) => (
                    <li key={i} className="text-xs text-neutral-600 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outcome */}
              <div className={`pt-3 border-t border-neutral-200/60 ${textDim}`}>
                <div className="text-xs text-neutral-500 flex items-start gap-1.5">
                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {phase.expectedOutcome}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
