import React, { useMemo, useState } from 'react'
import { DollarSign, Sparkles, Layers, GitBranch, List } from 'lucide-react'
import { OPERATIONS_TIMELINE, OPERATIONS_UPCOMING } from './mockData'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

// ── Exported helpers ──

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
  budget_optimize: {
    Icon: DollarSign,
    svgFill: '#3b82f6', svgStroke: '#93c5fd', svgConn: '#bfdbfe',
    iconBg: 'bg-blue-50', iconText: 'text-blue-500',
    dotColor: 'bg-blue-500', outlineDot: 'border-blue-300',
    connector: 'bg-blue-200', connectorDash: '#bfdbfe',
  },
  regen_creative: {
    Icon: Sparkles,
    svgFill: '#a855f7', svgStroke: '#d8b4fe', svgConn: '#e9d5ff',
    iconBg: 'bg-purple-50', iconText: 'text-purple-500',
    dotColor: 'bg-purple-500', outlineDot: 'border-purple-300',
    connector: 'bg-purple-200', connectorDash: '#e9d5ff',
  },
  recommend_campaign: {
    Icon: Layers,
    svgFill: '#f59e0b', svgStroke: '#fcd34d', svgConn: '#fde68a',
    iconBg: 'bg-amber-50', iconText: 'text-amber-500',
    dotColor: 'bg-amber-500', outlineDot: 'border-amber-300',
    connector: 'bg-amber-200', connectorDash: '#fde68a',
  },
}

const SUMMARY_STATS = [
  { key: 'totalBudgetSuggestions', label: 'Budget Suggestions', Icon: DollarSign, iconBg: 'bg-blue-50', iconText: 'text-blue-500' },
  { key: 'creativesGenerated', label: 'Creatives Regenerated', Icon: Sparkles, iconBg: 'bg-purple-50', iconText: 'text-purple-500' },
  { key: 'campaignsRecommended', label: 'Campaigns Recommended', Icon: Layers, iconBg: 'bg-amber-50', iconText: 'text-amber-500' },
]

// ── Helpers ──

function fmt24(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function computeSummaryStats(timeline, campaigns) {
  const budgetCounts = aggregateBudgetSuggestions(campaigns)
  const totalBudgetSuggestions = budgetCounts.increase + budgetCounts.decrease + budgetCounts.pause
  const creativesGenerated = timeline.filter(e => e.type === 'regen_creative')
    .reduce((s, e) => { const m = e.title.match(/(\d+)/); return s + (m ? parseInt(m[1]) : 0) }, 0)
  const campaignsRecommended = timeline.filter(e => e.type === 'recommend_campaign')
    .reduce((s, e) => { const m = e.title.match(/(\d+)/); return s + (m ? parseInt(m[1]) : 0) }, 0)
  return { totalBudgetSuggestions, creativesGenerated, campaignsRecommended }
}

// Smooth Catmull-Rom → cubic bezier path
function smoothPathD(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)]
    const p1 = pts[i - 1]
    const p2 = pts[i]
    const p3 = pts[Math.min(pts.length - 1, i + 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

// ── Event type display config ──

const EVENT_TYPE_LABELS = {
  budget_optimize: 'Budget optimization',
  regen_creative: 'Regenerate creatives',
  recommend_campaign: 'Recommend ads',
}


function getFishboneDesc(ev) {
  const n = ev.title && ev.title.match(/\d+/)
  const count = n ? n[0] : null

  if (ev.type === 'recommend_campaign') {
    return count
      ? `${count} campaigns to amplify top performers`
      : 'New campaigns to amplify your advantage'
  }
  if (ev.type === 'regen_creative') {
    return count
      ? `${count} creatives to combat ad fatigue`
      : 'New creatives to prevent ad fatigue'
  }
  return ev.description
}

// ── FISHBONE (SVG wave) VIEW ──

function FishboneView() {
  const pastEvents = useMemo(() =>
    [...OPERATIONS_TIMELINE].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), [])

  const allEvents = useMemo(() => [
    ...pastEvents.map(e => ({ ...e, isPast: true, timeKey: e.timestamp })),
    ...OPERATIONS_UPCOMING.map(e => ({ ...e, isPast: false, timeKey: e.estimatedTime })),
  ], [pastEvents])

  const N = allEvents.length
  const PAST_N = pastEvents.length

  const PER_NODE = Math.max(52, Math.min(68, 380 / Math.max(N - 1, 1)))
  const VW = Math.round(PER_NODE * (N - 1)) + 80
  const VH = 182
  const CY = 93
  const AMP = 12
  const ARM = 18
  const LW = 76
  const LH = 64
  const PX = 40
  const UW = VW - PX * 2

  const pts = allEvents.map((_, i) => ({
    x: PX + (i / (N - 1)) * UW,
    y: CY + AMP * Math.sin((i / (N - 1)) * Math.PI * 1.5),
  }))

  const pastPathD = smoothPathD(pts.slice(0, PAST_N))
  const futurePathD = smoothPathD(pts.slice(PAST_N - 1))

  // Bezier segment from last past node → first future node (for animateMotion)
  const transSegD = (() => {
    const i = PAST_N
    const p0 = pts[Math.max(0, i - 2)]
    const p1 = pts[i - 1]
    const p2 = pts[i]
    const p3 = pts[Math.min(N - 1, i + 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    return `M ${p1.x.toFixed(1)},${p1.y.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  })()

  // Date boundaries: left endpoint + any midnight crossings between past events
  const leftDate = pastEvents.length > 0 ? (() => {
    const d = new Date(pastEvents[0].timestamp)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })() : null

  const dateBoundaries = []
  for (let i = 1; i < pastEvents.length; i++) {
    const d1 = new Date(pastEvents[i - 1].timestamp).toDateString()
    const d2 = new Date(pastEvents[i].timestamp).toDateString()
    if (d1 !== d2) {
      const d = new Date(pastEvents[i].timestamp)
      dateBoundaries.push({
        x: (pts[i - 1].x + pts[i].x) / 2,
        y: (pts[i - 1].y + pts[i].y) / 2,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
      })
    }
  }

  return (
    <>
      <div style={{ overflowX: N > 8 ? 'auto' : 'hidden', scrollbarWidth: 'thin' }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          style={{ display: 'block', width: N > 8 ? `${VW}px` : '100%' }}
        >
          {/* Transition segment path — used for animateMotion */}
          <path id="fb-trans-seg" d={transSegD} fill="none" stroke="none" />

          {/* Past path — solid */}
          <path d={pastPathD} fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
          {/* Future path — dashed */}
          <path d={futurePathD} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,4" strokeLinecap="round" />

          {/* Left date label */}
          {leftDate && (
            <text x={pts[0].x} y={pts[0].y + 13} textAnchor="middle" fontSize={6} fill="#9ca3af">
              {leftDate}
            </text>
          )}

          {/* Date boundary markers */}
          {dateBoundaries.map((db, i) => (
            <g key={i}>
              <line x1={db.x} y1={db.y - 5} x2={db.x} y2={db.y + 5} stroke="#e5e7eb" strokeWidth="1" />
              <text x={db.x} y={db.y + 14} textAnchor="middle" fontSize={6} fill="#9ca3af">{db.label}</text>
            </g>
          ))}

          {/* Chevron arrow — leads the dots */}
          <g opacity={0.9}>
            <polyline points="-5,-4 0,0 -5,4" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <animateMotion dur="1.8s" repeatCount="indefinite" begin="-0.55s" calcMode="linear" rotate="auto">
              <mpath href="#fb-trans-seg" />
            </animateMotion>
          </g>

          {/* Flowing dots: tightly staggered */}
          {[0, 1, 2].map((_, i) => (
            <circle key={i} r={1.5} fill="#22c55e" opacity={0.85}>
              <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${-i * 0.2}s`} calcMode="linear">
                <mpath href="#fb-trans-seg" />
              </animateMotion>
            </circle>
          ))}

          {/* Event nodes */}
          {allEvents.map((ev, i) => {
            const { x, y } = pts[i]
            const s = EVENT_STYLES[ev.type] || EVENT_STYLES.budget_optimize
            const { Icon } = s
            const isAbove = i % 2 === 0
            const connY1 = isAbove ? y - 4 : y + 4
            const connY2 = isAbove ? y - ARM + 3 : y + ARM - 3
            const labelY = isAbove ? y - ARM - LH + 2 : y + ARM - 2

            return (
              <g key={ev.id} opacity={ev.isPast ? 1 : 0.5}>
                {/* Connector */}
                <line
                  x1={x} y1={connY1} x2={x} y2={connY2}
                  stroke={ev.isPast ? s.svgConn : '#d1d5db'}
                  strokeWidth="1"
                  strokeDasharray={ev.isPast ? '' : '2.5,2.5'}
                />
                {/* Node dot — green */}
                {ev.isPast
                  ? <circle cx={x} cy={y} r={3} fill="#22c55e" />
                  : <circle cx={x} cy={y} r={3} fill="white" stroke="#d1d5db" strokeWidth="1.5" />
                }
                {/* Label */}
                <foreignObject x={x - LW / 2} y={labelY} width={LW} height={LH}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5px' }}>
                    <div
                      className={`flex items-center justify-center rounded ${s.iconBg}`}
                      style={{ width: 14, height: 14, flexShrink: 0 }}
                    >
                      <Icon style={{ width: 8, height: 8 }} className={s.iconText} />
                    </div>
                    <span
                      className="text-center font-semibold text-gray-700"
                      style={{ fontSize: 6.5, lineHeight: 1.25, maxWidth: LW - 4 }}
                    >
                      {EVENT_TYPE_LABELS[ev.type] || ev.title}
                    </span>
                    {getFishboneDesc(ev) && (
                      <span style={{ fontSize: 6, color: '#6b7280', lineHeight: 1.2, maxWidth: LW - 4, wordBreak: 'break-word', textAlign: 'center' }}>
                        {getFishboneDesc(ev)}
                      </span>
                    )}
                    <span style={{ fontSize: 6, color: '#9ca3af', lineHeight: 1.2 }}>
                      {ev.isPast ? fmt24(ev.timeKey) : `~${fmt24(ev.timeKey)}`}
                    </span>
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>

    </>
  )
}

// ── LIST VIEW ──

function groupTimelineByDay(timeline) {
  const now = new Date()
  const todayStr = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  const today = [], yest = []
  const sorted = [...timeline].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  sorted.forEach(ev => {
    const d = new Date(ev.timestamp).toDateString()
    if (d === todayStr) today.push(ev)
    else if (d === yesterdayStr) yest.push(ev)
  })
  const groups = []
  if (today.length > 0) groups.push({ label: 'Today', events: today })
  if (yest.length > 0) groups.push({ label: 'Yesterday', events: yest })
  return groups
}

function TimelineEvent({ ev, isEstimate = false, isLast = false }) {
  const s = EVENT_STYLES[ev.type] || EVENT_STYLES.budget_optimize
  const { Icon, dotColor, iconBg, iconText } = s
  const time = isEstimate ? `~${fmt24(ev.estimatedTime)}` : fmt24(ev.timestamp)
  return (
    <div className="relative flex gap-3 pb-4">
      {!isLast && (
        <div className={`absolute left-[7px] top-[18px] bottom-0 w-[2px] ${isEstimate ? 'border-l-2 border-dashed border-gray-200' : 'bg-gray-200'}`} />
      )}
      <div className="relative z-10 flex-shrink-0 mt-[5px]">
        {isEstimate
          ? <span className={`block w-[14px] h-[14px] rounded-full border-2 ${dotColor.replace('bg-', 'border-')} bg-white`} />
          : <span className={`block w-[14px] h-[14px] rounded-full ${dotColor}`} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className={`w-3 h-3 ${iconText}`} />
          </div>
          <span className={`text-xs font-semibold truncate ${isEstimate ? 'text-gray-600' : 'text-gray-800'}`}>{ev.title}</span>
          <span className={`text-[11px] flex-shrink-0 ${isEstimate ? 'text-gray-300' : 'text-gray-400'}`}>{time}</span>
        </div>
        <p className={`text-xs mt-0.5 ml-7 truncate ${isEstimate ? 'text-gray-400' : 'text-gray-500'}`}>{ev.description}</p>
      </div>
    </div>
  )
}

function ListView() {
  const historyGroups = useMemo(() => groupTimelineByDay(OPERATIONS_TIMELINE), [])
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-[11px] font-semibold text-gray-500 tracking-wider mb-2">Past 36 Hours</div>
        {historyGroups.map(group => (
          <div key={group.label}>
            <div className="text-[11px] font-medium text-gray-400 mb-1.5 mt-2 first:mt-0">{group.label}</div>
            {group.events.map((ev, idx) => (
              <TimelineEvent
                key={ev.id}
                ev={ev}
                isLast={idx === group.events.length - 1 && group === historyGroups[historyGroups.length - 1]}
              />
            ))}
          </div>
        ))}
        {historyGroups.length === 0 && <p className="text-xs text-gray-400 italic">No events in the past 36 hours</p>}
      </div>
      <div className="opacity-80">
        <div className="text-[11px] font-semibold text-gray-500 tracking-wider mb-2">Next 12 Hours</div>
        <div className="text-[11px] font-medium text-gray-400 mb-1.5">Upcoming</div>
        {OPERATIONS_UPCOMING.map((ev, idx) => (
          <TimelineEvent key={ev.id} ev={ev} isEstimate isLast={idx === OPERATIONS_UPCOMING.length - 1} />
        ))}
      </div>
    </div>
  )
}

// ── Main component ──

export default function AdsGoOperations({ campaigns }) {
  const [viewMode, setViewMode] = useState('fishbone')
  const stats = useMemo(() => computeSummaryStats(OPERATIONS_TIMELINE, campaigns), [campaigns])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">AdsGo Operations</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('fishbone')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${viewMode === 'fishbone' ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <GitBranch className="w-3 h-3" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${viewMode === 'list' ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-3 h-3" />
              List
            </button>
          </div>
          <DevGuideButton title="AdsGo Operations" content={DEV_GUIDES.adsGoOperations} />
        </div>
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

      {/* View content */}
      {viewMode === 'fishbone' ? <FishboneView /> : <ListView />}
    </div>
  )
}
