import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { JOURNEY, KPI_SCORECARD, BRIEFING } from './mockData'

const phaseConfig = {
  completed: { bg: 'bg-success-500', animate: '' },
  active: { bg: 'bg-primary-500', animate: 'animate-pulse' },
  upcoming: { bg: 'bg-gray-200', animate: '' }
}

const KpiMini = ({ label, value, target, trend, up, progress }) => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        {target && (
          <>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{target}</span>
          </>
        )}
      </div>
      {progress != null && (
        <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
          <div
            className="h-1 bg-primary-500 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
    {trend && (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
        up ? 'text-success-600 bg-success-50' : 'text-error-600 bg-error-50'
      }`}>
        {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {trend}
      </span>
    )}
  </div>
)

const StatusBriefing = ({ onOpenJourney, onOpenKPI }) => {
  const { currentDay, phases } = JOURNEY
  const activePhase = phases.find(p => p.status === 'active')
  const { roas, conversions, cpa, spend } = KPI_SCORECARD
  const { grade, summary } = BRIEFING

  const roasProgress = Math.round((roas.current / roas.target) * 100)

  return (
    <div>
      {/* Journey Progress Bar */}
      <button
        onClick={onOpenJourney}
        className="w-full flex gap-1 mb-5 group cursor-pointer"
        title="View Brand Phases"
      >
        {phases.map((phase) => {
          const config = phaseConfig[phase.status]
          const flex = phase.weight || 1
          return (
            <div
              key={phase.id}
              className={`h-1.5 rounded-full ${config.bg} ${config.animate} group-hover:opacity-80 transition-opacity`}
              style={{ flex }}
              title={phase.label}
            />
          )
        })}
      </button>

      <div className="flex gap-5">
        {/* Grade Badge */}
        <button
          onClick={onOpenKPI}
          className="shrink-0 w-16 h-16 rounded-xl bg-primary-50 flex flex-col items-center justify-center hover:bg-primary-100 transition-colors cursor-pointer"
          title="View Performance Overview"
        >
          <span className="text-2xl font-bold text-primary-500">{grade}</span>
          <span className="text-[10px] text-gray-500">Grade</span>
        </button>

        {/* Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              Day {currentDay}
            </span>
            {activePhase && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                {activePhase.label} Phase
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Inline KPI Strip */}
      <div className="mt-4 pt-4 border-t border-[#F5F5F5] flex flex-wrap items-center gap-x-8 gap-y-3">
        <KpiMini
          label="ROAS"
          value={roas.current}
          target={roas.target}
          progress={roasProgress}
          trend={roas.wow}
          up
        />
        <KpiMini
          label={`Conversions (${conversions.eventName})`}
          value={conversions.current.toLocaleString()}
          trend={conversions.wow}
          up
        />
        <KpiMini
          label={`CPA (${cpa.eventName})`}
          value={`${cpa.unit}${cpa.current}`}
          target={`<${cpa.unit}${cpa.target}`}
          trend={cpa.wow}
          up
        />
        <KpiMini
          label="Spend"
          value={`${spend.unit}${(spend.current / 1000).toFixed(1)}K`}
          target={`${spend.unit}${(spend.budget / 1000).toFixed(1)}K cap`}
        />
      </div>
    </div>
  )
}

export default StatusBriefing
