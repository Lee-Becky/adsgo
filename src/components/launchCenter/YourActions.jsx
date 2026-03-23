import { DollarSign, Sparkles, CheckCircle, ChevronRight, Layers, TrendingUp } from 'lucide-react'
import { PENDING_ACTIONS } from './mockData'

const typeIcons = {
  budget_approval: { icon: DollarSign, color: 'text-success-600', bg: 'bg-success-50' },
  campaign_publish: { icon: Layers, color: 'text-primary-600', bg: 'bg-primary-50' },
  performance_review: { icon: TrendingUp, color: 'text-warning-600', bg: 'bg-warning-50' },
  creative_review: { icon: Sparkles, color: 'text-primary-600', bg: 'bg-primary-50' }
}

const navigateTargets = {
  budget_approval: 'adManagerV3',
  campaign_publish: 'autoRegeneration',
  performance_review: 'optimizeGoals',
  creative_review: 'aiGenerate'
}

const priorityStyles = {
  high: 'border-l-warning-500',
  medium: 'border-l-primary-300',
  low: 'border-l-gray-300'
}

const YourActions = ({ onPageChange }) => {
  return (
    <div>
      <div>
        {PENDING_ACTIONS.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-success-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">All caught up! No actions needed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {PENDING_ACTIONS.map((action) => {
              const typeConfig = typeIcons[action.type] || typeIcons.budget_approval
              const Icon = typeConfig.icon
              const target = navigateTargets[action.type]

              return (
                <div
                  key={action.id}
                  className={`border-l-[3px] ${priorityStyles[action.priority]} rounded-lg bg-gray-50/50 p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900">{action.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {action.campaign}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-0.5">{action.description}</p>
                      <p className="text-xs text-gray-500">{action.detail}</p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => target && onPageChange(target)}
                          className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
                        >
                          View Details <ChevronRight className="w-3 h-3" />
                        </button>
                        <span className="ml-auto text-[10px] text-gray-400">{action.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default YourActions
