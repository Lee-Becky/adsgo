import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Wrench, CheckCircle2, ChevronRight } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

const BRAND_COLOR = '#7033F5'
const BRAND_LIGHT = '#f3f0ff'
const BRAND_MID = '#c4b5fd'

const DIMENSION_LABELS = {
  budget_optimization:     'Budget Optimization',
  campaign_recommendation: 'Campaign Recommendation',
  creative:                'Creative Quality',
  landing_page:            'Landing Page',
  kpi:                     'KPI Target',
}

function getPhaseLabel(learningPercent) {
  if (learningPercent >= 80) return { label: 'Learning', color: '#f59e0b' }
  if (learningPercent >= 30) return { label: 'Optimizing', color: BRAND_COLOR }
  return { label: 'Scaling', color: '#10b981' }
}

// ── Clickable radar axis labels ──
function AxisLabel(props) {
  const { x, y, payload, activeDimensionId, dimensions, onDimensionClick, cx: chartCx, cy: chartCy } = props
  const dim = dimensions.find(d => DIMENSION_LABELS[d.id] === payload.value)
  if (!dim) return null

  const isActive = dim.id === activeDimensionId

  const dx = x - (chartCx || 0), dy = y - (chartCy || 0)
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nudge = 14
  const nx = dist > 0 ? x + (dx / dist) * nudge : x
  const ny = dist > 0 ? y + (dy / dist) * nudge : y

  // Dynamic anchor: text always extends AWAY from radar center
  const anchor = dx > 15 ? 'start' : dx < -15 ? 'end' : 'middle'

  // foreignObject needs a fixed region; position label via CSS inside it
  const foW = 200, foH = 28
  const foX = anchor === 'start' ? nx : anchor === 'end' ? nx - foW : nx - foW / 2
  const foY = ny - foH / 2

  const justify = anchor === 'start' ? 'flex-start' : anchor === 'end' ? 'flex-end' : 'center'

  return (
    <foreignObject x={foX} y={foY} width={foW} height={foH} style={{ overflow: 'visible' }}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        onClick={() => onDimensionClick(dim.id)}
        style={{
          display: 'flex',
          justifyContent: justify,
          alignItems: 'center',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: isActive ? '3px 12px' : '3px 4px',
            borderRadius: 11,
            backgroundColor: isActive ? BRAND_LIGHT : 'transparent',
            border: isActive ? `1.5px solid ${BRAND_COLOR}50` : '1.5px solid transparent',
            fontSize: isActive ? 11 : 10,
            fontWeight: isActive ? 700 : 500,
            color: isActive ? BRAND_COLOR : '#9ca3af',
            whiteSpace: 'nowrap',
            lineHeight: '16px',
            outline: 'none',
          }}
        >
          {payload.value}
        </span>
      </div>
    </foreignObject>
  )
}

// ── Radar dot ──
function DotShape(props) {
  const { cx, cy, index, activeIdx } = props
  if (cx == null || cy == null) return null
  const isActive = index === activeIdx

  if (isActive) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={11} fill={BRAND_COLOR} fillOpacity={0.12} />
        <circle cx={cx} cy={cy} r={6} fill="white" stroke={BRAND_COLOR} strokeWidth={2.5} />
        <circle cx={cx} cy={cy} r={2.5} fill={BRAND_COLOR} />
      </g>
    )
  }
  return <circle cx={cx} cy={cy} r={3} fill="white" stroke="#d1d5db" strokeWidth={1.5} />
}

export default function ScoreCard({ dimensionsData, phaseData, onDimensionSelect }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const dims = useMemo(() => dimensionsData.slice(0, 5), [dimensionsData])

  useEffect(() => {
    if (isHovering) return
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % dims.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [dims.length, isHovering])

  const handleClick = useCallback((id) => {
    const idx = dims.findIndex(d => d.id === id)
    if (idx !== -1) { setActiveIndex(idx); onDimensionSelect?.(id) }
  }, [dims, onDimensionSelect])

  const active = dims[activeIndex]
  const phase = getPhaseLabel(phaseData?.learningPercent ?? 50)

  const chartData = useMemo(() => dims.map(d => ({
    subject: DIMENSION_LABELS[d.id],
    current: d.currentScore,
    potential: Math.min(d.currentScore + d.potentialScore, 5),
  })), [dims])

  return (
    <div
      className="bg-[#f8f7fc] rounded-xl p-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center mb-4">
        <div className="lg:w-[calc(50%-20px)] flex-shrink-0">
          <h4 className="text-sm font-semibold text-gray-800">Multi-dimensional Monitoring</h4>
        </div>
        <div className="hidden lg:flex flex-1 items-center pl-10">
          <h4 className="text-sm font-semibold text-gray-800">Optimize Detail</h4>
          <div className="ml-auto">
            <DevGuideButton title="Multi-dimensional Monitoring" content={DEV_GUIDES.optimizationScore} />
          </div>
        </div>
      </div>
        <div className="flex flex-col lg:flex-row gap-0">

          {/* ═══ Left 50%: Radar + Problem ═══ */}
          <div className="lg:w-[calc(50%-20px)] flex-shrink-0 flex flex-col items-center">

            {/* Radar Chart */}
            <div className="relative w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={
                      <AxisLabel
                        activeDimensionId={active.id}
                        dimensions={dims}
                        onDimensionClick={handleClick}
                      />
                    }
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 6]} tick={false} axisLine={false} />

                  {/* Potential layer — dashed */}
                  <Radar
                    dataKey="potential"
                    stroke={BRAND_MID}
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    fill={BRAND_LIGHT}
                    fillOpacity={0.12}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={400}
                  />
                  {/* Current layer — solid */}
                  <Radar
                    dataKey="current"
                    stroke={BRAND_COLOR}
                    strokeWidth={2.5}
                    fill={BRAND_COLOR}
                    fillOpacity={0.10}
                    dot={<DotShape activeIdx={activeIndex} dims={dims} />}
                    isAnimationActive={true}
                    animationDuration={400}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Center: Phase Status */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-sm font-bold" style={{ color: phase.color }}>{phase.label}</span>
                  <span className="block text-[9px] text-gray-400 font-medium leading-tight">
                    {phaseData?.learningPercent ?? 0}% in learning
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-1 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0 border-t-2" style={{ borderColor: BRAND_COLOR }} />
                <span className="text-[10px] text-gray-500">Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0 border-t-2 border-dashed" style={{ borderColor: BRAND_MID }} />
                <span className="text-[10px] text-gray-500">After optimization</span>
              </div>
            </div>

            {/* Active dimension problem — with left accent border */}
            <div
              className="w-full rounded-lg px-4 py-3 border-l-[3px]"
              style={{ backgroundColor: BRAND_LIGHT + '80', borderLeftColor: BRAND_COLOR }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND_COLOR }} />
                <span className="text-xs font-bold text-gray-800">{DIMENSION_LABELS[active.id]}</span>
                <span className="text-xs font-bold ml-auto" style={{ color: BRAND_COLOR }}>
                  {active.currentScore.toFixed(1)}<span className="text-gray-400 font-normal">/5</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{active.problem}</p>
            </div>
          </div>

          {/* ═══ Flow Connector (lg only) ═══ */}
          <div className="hidden lg:flex flex-col items-center justify-center px-3">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-purple-200 to-transparent" />
            <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center my-2">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-purple-200 to-transparent" />
          </div>

          {/* ═══ Right 50%: Detail Panel ═══ */}
          <div
            className="flex-1 min-w-0 rounded-xl mt-4 lg:mt-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND_LIGHT}50 0%, transparent 60%)`,
            }}
          >
            <div className="p-5">

              {/* Header — with left accent border matching problem area */}
              <div
                className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 border-l-[3px] pl-4 -ml-1 rounded-l"
                style={{ borderLeftColor: BRAND_COLOR }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: BRAND_LIGHT }}
                >
                  <span className="text-lg font-bold" style={{ color: BRAND_COLOR }}>
                    {active.currentScore.toFixed(1)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">{DIMENSION_LABELS[active.id]}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Current <strong style={{ color: BRAND_COLOR }}>{active.currentScore.toFixed(1)}</strong> → After optimization <strong className="text-emerald-600">{Math.min(active.currentScore + active.potentialScore, 5).toFixed(1)}</strong>
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-5">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((active.currentScore + active.potentialScore) / 5) * 100, 100)}%`,
                      backgroundColor: BRAND_LIGHT,
                      border: `1px dashed ${BRAND_MID}`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${(active.currentScore / 5) * 100}%`,
                      backgroundColor: BRAND_COLOR,
                    }}
                  />
                </div>
              </div>

              {/* AdsGo Will Do */}
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Wrench className="w-3.5 h-3.5" style={{ color: BRAND_COLOR }} />
                  <p className="text-[11px] font-semibold tracking-wide" style={{ color: BRAND_COLOR }}>AdsGo Will Do</p>
                </div>
                <ul className="space-y-2.5">
                  {active.adsGoWillDo.map((action, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2.5 leading-relaxed">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: BRAND_LIGHT }}
                      >
                        <span className="text-[10px] font-bold" style={{ color: BRAND_COLOR }}>{idx + 1}</span>
                      </div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Your Actions — display only, no interaction */}
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-[11px] font-semibold text-amber-600 tracking-wide">Your Actions</p>
                </div>
                <ul className="space-y-2.5">
                  {active.yourActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-500">{idx + 1}</span>
                      </div>
                      <span className="text-xs text-gray-700 leading-relaxed">{action.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Impact */}
              <div className="rounded-lg px-4 py-3 bg-emerald-50/60 border border-emerald-100">
                <p className="text-[11px] font-semibold text-emerald-700 tracking-wide mb-1.5">Expected Impact</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600">Score:</span>
                  <span className="text-xs font-bold" style={{ color: BRAND_COLOR }}>{active.currentScore.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">→</span>
                  <span className="text-xs font-bold text-emerald-600">{Math.min(active.currentScore + active.potentialScore, 5).toFixed(1)}</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{active.expectedImpact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
          {dims.map((dim, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={dim.id}
                onClick={() => { setActiveIndex(index); onDimensionSelect?.(dim.id) }}
                className="relative w-8 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: isActive ? BRAND_LIGHT : '#f3f4f6' }}
              >
                {isActive && !isHovering && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: BRAND_COLOR, animation: 'scoreProgress 5s linear' }}
                  />
                )}
                {isActive && isHovering && (
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: BRAND_COLOR }} />
                )}
              </button>
            )
          })}
        </div>

        <style>{`
          @keyframes scoreProgress { from { width: 0; } to { width: 100%; } }
        `}</style>
    </div>
  )
}
