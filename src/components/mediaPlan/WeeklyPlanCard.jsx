import React, { useState, useRef, useMemo } from 'react'
import { Target, Bot, CheckSquare, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

function getWeekRange(offsetWeeks) {
  const now = new Date()
  const currentDay = now.getDay()
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1

  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday + (offsetWeeks * 7))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    start: monday,
    end: sunday,
    startStr: `${monday.getMonth() + 1}/${monday.getDate()}`,
    endStr: `${sunday.getMonth() + 1}/${sunday.getDate()}`,
  }
}

function WeekCard({ week, isCurrentWeek, onTodoToggle }) {
  const statusStyles = {
    completed: 'bg-emerald-50/50 border-emerald-200/60 opacity-65 saturate-[0.6]',
    current: 'bg-gradient-to-br from-primary-50 via-white to-primary-50/30 border-primary-300 ring-2 ring-primary-200',
    upcoming: 'bg-gray-50/40 border-dashed border-gray-200 opacity-60',
  }

  const statusLabelStyles = {
    completed: 'bg-emerald-100 text-emerald-700',
    current: 'bg-primary-100 text-primary-700',
    upcoming: 'bg-gray-100 text-gray-600',
  }

  return (
    <div
      className={`rounded-xl border ${isCurrentWeek ? 'p-4' : 'p-3'} ${statusStyles[week.status]} flex flex-col h-full relative`}
      style={isCurrentWeek ? { animation: 'weekBreathe 3s ease-in-out infinite' } : undefined}
    >
      {/* Week Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusLabelStyles[week.status]}`}>
          {week.status === 'completed' ? 'Completed' : week.status === 'current' ? 'This Week' : 'Upcoming'}
        </span>
        {isCurrentWeek && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-semibold">
            <span style={{ display: 'inline-block', animation: 'infinityPulse 2s ease-in-out infinite', fontSize: '13px', lineHeight: 1 }}>∞</span>
            Running
          </span>
        )}
      </div>

      {/* Date Range */}
      <p className={`${isCurrentWeek ? 'text-xs' : 'text-[11px]'} font-medium text-gray-700 mb-2`}>
        {week.dateRange.startStr} - {week.dateRange.endStr}
      </p>

      {/* Core Objective */}
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <Target className="w-3 h-3 text-gray-500" />
          <span className="text-[9px] font-semibold text-gray-600 tracking-wide">Core Objective</span>
        </div>
        <p className={`${isCurrentWeek ? 'text-xs' : 'text-[11px]'} font-medium text-gray-800 leading-snug`}>{week.coreObjective}</p>
      </div>

      {/* AI Plan */}
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <Bot className="w-3 h-3 text-primary-500" />
          <span className="text-[9px] font-semibold text-primary-600 tracking-wide">AI Plan</span>
        </div>
        <ul className="space-y-0.5">
          {week.aiPlan.slice(0, 3).map((item, idx) => (
            <li key={idx} className="text-[11px] text-gray-600 leading-snug flex items-start gap-1">
              <span className="text-primary-400 mt-0.5 flex-shrink-0">•</span>
              <span className="line-clamp-2">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* You Need To Do */}
      <div className="mt-auto">
        <div className="flex items-center gap-1 mb-1">
          <CheckSquare className="w-3 h-3 text-amber-500" />
          <span className="text-[9px] font-semibold text-amber-600 tracking-wide">You Need To Do</span>
        </div>
        <ul className="space-y-1">
          {week.youNeedToDo.map((todo) => (
            <li key={todo.id} className="flex items-start gap-1.5">
              <button
                onClick={() => onTodoToggle(week.weekId, todo.id)}
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'bg-white border-gray-300 hover:border-primary-400'
                }`}
              >
                {todo.completed && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className={`text-[11px] leading-snug ${
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Downward arrow connector — only on current week */}
      {isCurrentWeek && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center shadow-sm">
            <ChevronDown className="w-3.5 h-3.5 text-primary-500" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function WeeklyPlanCard({ weeksData, onTodoToggle, hideTitle }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Show only 4 cards: 1 most recent completed + current + upcoming
  const displayWeeks = useMemo(() => {
    const completed = weeksData.filter(w => w.status === 'completed')
    const rest = weeksData.filter(w => w.status !== 'completed')
    const lastCompleted = completed.length > 0 ? [completed[completed.length - 1]] : []
    return [...lastCompleted, ...rest].slice(0, 4)
  }, [weeksData])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  const scrollBy = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 260, behavior: 'smooth' })
  }

  return (
    <div>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Weekly Strategy</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="lg:hidden w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              style={{ display: canScrollLeft ? undefined : 'none' }}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <DevGuideButton title="Weekly Strategy" content={DEV_GUIDES.weeklyPlan} />
            <button
              onClick={() => scrollBy(1)}
              className="lg:hidden w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              style={{ display: canScrollRight ? undefined : 'none' }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop: 5-column grid / Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="hidden lg:grid lg:grid-cols-4 gap-3"
      >
        {displayWeeks.map((week) => (
          <WeekCard
            key={week.weekId}
            week={week}
            isCurrentWeek={week.status === 'current'}
            onTodoToggle={onTodoToggle}
          />
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="lg:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
      >
        {displayWeeks.map((week) => (
          <div key={week.weekId} className="min-w-[220px] w-[45%] flex-shrink-0 snap-start">
            <WeekCard
              week={week}
              isCurrentWeek={week.status === 'current'}
              onTodoToggle={onTodoToggle}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes weekBreathe {
          0%, 100% { box-shadow: 0 0 20px rgba(112,51,245,0.08); }
          50%      { box-shadow: 0 0 30px rgba(112,51,245,0.18), 0 0 60px rgba(112,51,245,0.06); }
        }
        @keyframes infinityPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.25); }
        }
      `}</style>
    </div>
  )
}
