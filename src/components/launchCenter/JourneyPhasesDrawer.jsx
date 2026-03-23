import { useState } from 'react'
import { CheckCircle, Circle, Loader2, ChevronDown, ChevronRight, AlertTriangle, Shield } from 'lucide-react'
import DrawerShell from './DrawerShell'
import { JOURNEY } from './mockData'

const statusConfig = {
  completed: { bg: 'bg-success-50', border: 'border-success-200', icon: <CheckCircle className="w-5 h-5 text-success-500" />, badge: 'bg-success-100 text-success-700' },
  active: { bg: 'bg-primary-50', border: 'border-primary-200', icon: <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />, badge: 'bg-primary-100 text-primary-700' },
  upcoming: { bg: 'bg-gray-50', border: 'border-gray-200', icon: <Circle className="w-5 h-5 text-gray-300" />, badge: 'bg-gray-100 text-gray-500' }
}

const JourneyPhasesDrawer = ({ isOpen, onClose }) => {
  const { currentDay, phases, ifNotMeetingTargets } = JOURNEY
  const [expandedPhase, setExpandedPhase] = useState(() => {
    const active = phases.find(p => p.status === 'active')
    return active?.id || phases[0]?.id
  })

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="Brand Phases"
      subtitle={`Day ${currentDay}`}
      guideModule="journeyPhases"
    >
      <div className="space-y-4">
        {/* Progress overview */}
        <div className="flex gap-1 mb-2">
          {phases.map((phase) => {
            return (
              <div key={phase.id} className="flex flex-col items-center" style={{ flex: phase.weight || 1 }}>
                <div className={`w-full h-2 rounded-full ${
                  phase.status === 'completed' ? 'bg-success-500' :
                  phase.status === 'active' ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
                <span className="text-[9px] text-gray-500 mt-1">{phase.label}</span>
              </div>
            )
          })}
        </div>

        {/* Phase Cards */}
        {phases.map((phase) => {
          const config = statusConfig[phase.status]
          const isExpanded = expandedPhase === phase.id

          return (
            <div key={phase.id} className={`rounded-lg border ${config.border} overflow-hidden`}>
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 ${config.bg} hover:opacity-90 transition-opacity`}
              >
                {config.icon}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{phase.label}</span>
                    {phase.typicalDays && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${config.badge}`}>
                        {phase.typicalDays}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {/* Phase Content */}
              {isExpanded && (
                <div className="px-4 py-4 bg-white space-y-4">
                  {/* System Actions */}
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400">System Actions</span>
                    <ul className="mt-2 space-y-1.5">
                      {phase.systemActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* User Actions */}
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400">Your Actions</span>
                    <ul className="mt-2 space-y-1.5">
                      {phase.userActions.map((action, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          {action.done ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success-500 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          )}
                          <span className={action.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{action.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  {phase.metrics && (phase.metrics.cpaStart || phase.metrics.roasStart) && (
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400">Metrics</span>
                      <div className="mt-2 flex gap-4">
                        {phase.metrics.cpaStart && (
                          <div className="text-xs text-gray-600">
                            CPA: ${phase.metrics.cpaStart}
                            {phase.metrics.cpaEnd && <> → ${phase.metrics.cpaEnd}</>}
                          </div>
                        )}
                        {phase.metrics.roasStart && (
                          <div className="text-xs text-gray-600">
                            ROAS: {phase.metrics.roasStart}
                            {phase.metrics.roasEnd && <> → {phase.metrics.roasEnd}</>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* If Not Meeting Targets */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning-500" />
            <span className="text-sm font-semibold text-gray-900">If Not Meeting Targets</span>
          </div>
          <div className="space-y-2">
            {ifNotMeetingTargets.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Shield className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerShell>
  )
}

export default JourneyPhasesDrawer
