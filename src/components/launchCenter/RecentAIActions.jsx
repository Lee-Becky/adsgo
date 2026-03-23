import { ChevronRight, DollarSign, Layers, Sparkles } from 'lucide-react'
import { AI_ACTIONS } from './mockData'

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const groupByDate = (actions) => {
  const groups = {}
  actions.forEach(action => {
    const dateKey = formatDate(action.timestamp)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(action)
  })
  return groups
}

const typeConfig = {
  budget_optimize: { icon: DollarSign, color: 'text-success-600', bg: 'bg-success-50', dot: 'bg-success-500', tagBg: 'bg-success-50', tagText: 'text-success-700', tagBorder: 'border-success-200', label: 'Budget' },
  recommend_ads: { icon: Layers, color: 'text-primary-600', bg: 'bg-primary-50', dot: 'bg-primary-500', tagBg: 'bg-primary-50', tagText: 'text-primary-700', tagBorder: 'border-primary-200', label: 'Recommend' },
  ai_creatives: { icon: Sparkles, color: 'text-warning-600', bg: 'bg-warning-50', dot: 'bg-warning-500', tagBg: 'bg-warning-50', tagText: 'text-warning-700', tagBorder: 'border-warning-200', label: 'Creative' }
}

const RecentAIActions = ({ onOpenActivityLog }) => {
  return (
    <div className="bg-gray-50/50 rounded-lg border border-[#F5F5F5] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#F5F5F5] flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">AI Actions</h3>
        <button
          onClick={onOpenActivityLog}
          className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Timeline */}
      <div className="px-4 py-3 flex-1">
        <div className="space-y-4">
          {Object.entries(groupByDate(AI_ACTIONS)).map(([dateLabel, actions]) => (
            <div key={dateLabel}>
              <p className="text-[10px] font-semibold text-gray-400 mb-2">{dateLabel}</p>
              <div className="space-y-3">
                {actions.map((action) => {
                  const config = typeConfig[action.type]
                  return (
                    <div key={action.id} className="flex items-start gap-3">
                      {/* Time + Dot */}
                      <div className="shrink-0 w-16 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        <span className="text-[10px] text-gray-400 font-mono">
                          {formatTime(action.timestamp)}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-900 leading-tight">{action.title}</p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${config.tagBg} ${config.tagText} ${config.tagBorder}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{action.description}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{action.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentAIActions
