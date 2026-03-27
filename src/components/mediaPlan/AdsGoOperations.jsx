import React, { useMemo } from 'react'
import { DollarSign, Sparkles, Layers } from 'lucide-react'
import { OPERATIONS_TIMELINE, OPERATIONS_UPCOMING } from './mockData'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

// ── Exported helpers (used by MediaPlan.jsx & YourActionItems.jsx) ──

export function aggregateBudgetSuggestions(campaigns) {
  const counts = { increase: 0, decrease: 0, pause: 0, maintain: 0 }
  campaigns.forEach(campaign => {
    if (campaign.budgetReason) counts[campaign.budgetReason.type]++
    campaign.adsets.forEach(adset => {
      if (adset.budgetReason) counts[adset.budgetReason.type]++
    })
  })
  return counts
}

export function formatBudgetSummary(counts) {
  const parts = []
  if (counts.increase > 0) parts.push(`${counts.increase} increase`)
  if (counts.decrease > 0) parts.push(`${counts.decrease} decrease`)
  if (counts.pause > 0) parts.push(`${counts.pause} pause`)
  return parts.length > 0 ? parts.join(' · ') : 'No adjustments needed'
}

// ── Event type config ──

const EVENT_STYLES = {
  budget_optimize:    { Icon: DollarSign, dotColor: 'bg-blue-500',   iconBg: 'bg-blue-50',   iconText: 'text-blue-500' },
  regen_creative:     { Icon: Sparkles,   dotColor: 'bg-purple-500', iconBg: 'bg-purple-50', iconText: 'text-purple-500' },
  recommend_campaign: { Icon: Layers,     dotColor: 'bg-amber-500',  iconBg: 'bg-amber-50',  iconText: 'text-amber-500' },
}

const SUMMARY_STATS = [
  { key: 'totalBudgetSuggestions', label: 'Budget Suggestions', Icon: DollarSign, iconBg: 'bg-blue-50', iconText: 'text-blue-500' },
  { key: 'creativesGenerated', label: 'Creatives Regenerated', Icon: Sparkles, iconBg: 'bg-purple-50', iconText: 'text-purple-500' },
  { key: 'campaignsRecommended', label: 'Campaigns Recommended', Icon: Layers, iconBg: 'bg-amber-50', iconText: 'text-amber-500' },
]

// ── Helpers ──

function formatTime(isoTimestamp, isEstimate = false) {
  const d = new Date(isoTimestamp)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  return isEstimate ? `~${time}` : time
}

function groupTimelineByDay(timeline) {
  const now = new Date()
  const todayStr = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  const today = []
  const yest = []

  const sorted = [...timeline].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  sorted.forEach(event => {
    const eventDate = new Date(event.timestamp).toDateString()
    if (eventDate === todayStr) today.push(event)
    else if (eventDate === yesterdayStr) yest.push(event)
  })

  const groups = []
  if (today.length > 0) groups.push({ label: 'Today', events: today })
  if (yest.length > 0) groups.push({ label: 'Yesterday', events: yest })
  return groups
}

function computeSummaryStats(timeline, campaigns) {
  const budgetCounts = aggregateBudgetSuggestions(campaigns)
  const totalBudgetSuggestions = budgetCounts.increase + budgetCounts.decrease + budgetCounts.pause

  const creativesGenerated = timeline
    .filter(e => e.type === 'regen_creative')
    .reduce((sum, e) => {
      const match = e.title.match(/(\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  const campaignsRecommended = timeline
    .filter(e => e.type === 'recommend_campaign')
    .reduce((sum, e) => {
      const match = e.title.match(/(\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  return { totalBudgetSuggestions, creativesGenerated, campaignsRecommended }
}

// ── Timeline event row ──

function TimelineEvent({ event, isEstimate = false, isLast = false }) {
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.budget_optimize
  const { Icon, dotColor, iconBg, iconText } = style
  const time = formatTime(isEstimate ? event.estimatedTime : event.timestamp, isEstimate)

  return (
    <div className="relative flex gap-3 pb-4">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className={`absolute left-[7px] top-[18px] bottom-0 w-[2px] ${
            isEstimate ? 'border-l-2 border-dashed border-gray-200' : 'bg-gray-200'
          }`}
        />
      )}

      {/* Dot */}
      <div className="relative z-10 flex-shrink-0 mt-[5px]">
        {isEstimate ? (
          <span className={`block w-[14px] h-[14px] rounded-full border-2 ${dotColor.replace('bg-', 'border-')} bg-white`} />
        ) : (
          <span className={`block w-[14px] h-[14px] rounded-full ${dotColor}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className={`w-3 h-3 ${iconText}`} />
          </div>
          <span className={`text-xs font-semibold truncate ${isEstimate ? 'text-gray-600' : 'text-gray-800'}`}>
            {event.title}
          </span>
          <span className={`text-[11px] flex-shrink-0 ${isEstimate ? 'text-gray-300' : 'text-gray-400'}`}>
            {time}
          </span>
        </div>
        <p className={`text-xs mt-0.5 ml-7 truncate ${isEstimate ? 'text-gray-400' : 'text-gray-500'}`}>
          {event.description}
        </p>
      </div>
    </div>
  )
}

// ── Main component ──

export default function AdsGoOperations({ campaigns }) {
  const stats = useMemo(() => computeSummaryStats(OPERATIONS_TIMELINE, campaigns), [campaigns])
  const historyGroups = useMemo(() => groupTimelineByDay(OPERATIONS_TIMELINE), [])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">AdsGo Operations</h4>
        <DevGuideButton title="AdsGo Operations" content={DEV_GUIDES.adsGoOperations} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {SUMMARY_STATS.map(({ key, label, Icon, iconBg, iconText }) => (
          <div key={key} className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-1`}>
              <Icon className={`w-3.5 h-3.5 ${iconText}`} />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">{stats[key]}</div>
            <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Data sync note */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        <span className="text-xs text-gray-400">Data synced every hour</span>
      </div>

      {/* Dual-column timeline */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Past 36 Hours */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Past 36 Hours
          </div>
          {historyGroups.map(group => (
            <div key={group.label}>
              <div className="text-[11px] font-medium text-gray-400 mb-1.5 mt-2 first:mt-0">
                {group.label}
              </div>
              {group.events.map((event, idx) => {
                const isLastInGroup = idx === group.events.length - 1
                const isLastGroup = group === historyGroups[historyGroups.length - 1]
                return (
                  <TimelineEvent
                    key={event.id}
                    event={event}
                    isLast={isLastInGroup && isLastGroup}
                  />
                )
              })}
            </div>
          ))}
          {historyGroups.length === 0 && (
            <p className="text-xs text-gray-400 italic">No events in the past 36 hours</p>
          )}
        </div>

        {/* Right: Next 12 Hours */}
        <div className="opacity-80">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Next 12 Hours
          </div>
          <div className="text-[11px] font-medium text-gray-400 mb-1.5">Upcoming</div>
          {OPERATIONS_UPCOMING.map((event, idx) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isEstimate
              isLast={idx === OPERATIONS_UPCOMING.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
