import { useState } from 'react'
import { DollarSign, Sparkles, Layers, ChevronDown, ChevronRight } from 'lucide-react'
import DrawerShell from './DrawerShell'
import { ACTIVITY_LOG } from './mockData'

const typeConfig = {
  budget_analysis: { icon: DollarSign, color: 'text-success-600', bg: 'bg-success-50', label: 'Budget', filterGroup: 'Budget' },
  budget_apply: { icon: DollarSign, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Budget', filterGroup: 'Budget' },
  recommend_campaign: { icon: Layers, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Campaigns', filterGroup: 'Campaigns' },
  recommend_publish: { icon: Layers, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Campaigns', filterGroup: 'Campaigns' },
  ai_creative: { icon: Sparkles, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Creatives', filterGroup: 'Creatives' }
}

const filters = ['All', 'Budget', 'Campaigns', 'Creatives']

const filterMapping = {
  Budget: ['budget_analysis', 'budget_apply'],
  Campaigns: ['recommend_campaign', 'recommend_publish'],
  Creatives: ['ai_creative']
}

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  return {
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

const formatDateGroup = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const groupByDate = (logs) => {
  const groups = {}
  logs.forEach(log => {
    const key = formatDateGroup(log.timestamp)
    if (!groups[key]) groups[key] = []
    groups[key].push(log)
  })
  return groups
}

const ActivityLogDrawer = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = activeFilter === 'All'
    ? ACTIVITY_LOG
    : ACTIVITY_LOG.filter(log => filterMapping[activeFilter]?.includes(log.type))

  const grouped = groupByDate(filtered)

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="System Activity Log"
      guideModule="activityLog"
    >
      <div className="space-y-5">
        {/* Filter Pills */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grouped Timeline */}
        {Object.entries(grouped).map(([dateLabel, logs]) => (
          <div key={dateLabel}>
            <p className="text-[10px] font-semibold text-gray-400 mb-3">{dateLabel}</p>
            <div className="space-y-2">
              {logs.map((log) => {
                const isDisabled = log.disabled
                const config = typeConfig[log.type] || typeConfig.budget_analysis
                const Icon = config.icon
                const { time } = formatDateTime(log.timestamp)
                const isExpanded = expandedId === log.id

                return (
                  <div
                    key={log.id}
                    className={`rounded-lg overflow-hidden ${isDisabled ? 'bg-gray-50/50' : 'bg-gray-50'}`}
                  >
                    <button
                      onClick={() => !isDisabled && setExpandedId(isExpanded ? null : log.id)}
                      className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                        isDisabled ? 'cursor-default' : 'hover:bg-gray-100/50'
                      }`}
                    >
                      <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                        isDisabled ? 'bg-gray-100' : config.bg
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isDisabled ? 'text-gray-400' : config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>{log.title}</p>
                        <p className={`text-[10px] mt-0.5 truncate ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>{log.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className={`text-[10px] ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`}>{time}</span>
                        {!isDisabled && (
                          isExpanded
                            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        {isDisabled && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">OFF</span>
                        )}
                      </div>
                    </button>

                    {isExpanded && !isDisabled && log.detail && (
                      <div className="px-4 pb-3 pt-0 ml-10 border-t border-gray-200/50">
                        <div className="pt-2 space-y-1.5">
                          <p className="text-xs text-gray-700">{log.detail}</p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500">
                            <span>Platform: {log.platform}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              log.result === 'Completed' ? 'bg-success-50 text-success-600' :
                              log.result === 'Ready' ? 'bg-primary-50 text-primary-600' :
                              log.result === 'Generated' ? 'bg-warning-50 text-warning-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {log.result}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </DrawerShell>
  )
}

export default ActivityLogDrawer
