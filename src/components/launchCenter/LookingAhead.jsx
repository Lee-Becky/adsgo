import { Target, Lightbulb, ArrowRight } from 'lucide-react'
import { LOOKING_AHEAD } from './mockData'

const LookingAhead = () => {
  const { milestones, recommendations } = LOOKING_AHEAD

  return (
    <div>
      {/* Milestones — ROAS + CPA targets */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3 mb-4">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Target className="w-3.5 h-3.5 text-primary-500" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500">
                {m.metric}{m.eventName ? ` (${m.eventName})` : ''} Target
              </span>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-gray-900">
                  {m.unit || ''}{m.current}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="font-semibold text-primary-600">
                  {m.unit || ''}{m.target}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  expected in ~{m.expectedDays} days
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-gray-50/50 rounded-lg p-4 mb-4">
        <span className="text-[10px] font-semibold text-gray-400">Recommended Actions</span>
        <ul className="mt-2 space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <Lightbulb className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default LookingAhead
