import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, CalendarRange, ListChecks } from 'lucide-react'
import useLunaSync from '@features/chat/useLunaSync'
import useStrategyTaskStore from '@stores/strategyTaskStore'
import MediaPlanPanel from './MediaPlanPage'
import StrategyCyclePanel from './StrategyCycle'
import StrategyEvidencePanel from './StrategyEvidencePanel'
import { MEDIA_PLAN_MONTH, WEEKLY_PLAN } from './mediaPlanMockData'
import { MOCK_STRATEGY_CYCLE } from './strategyCycleMockData'

const TABS = [
  { id: 'plan', label: '月度计划', desc: '全球目标 · 市场分析 · W1-W4', icon: CalendarRange },
  { id: 'cycle', label: '本周策略', desc: '验证 · 追踪 · 建议 · 待办', icon: ListChecks },
]

const PlanWorkspacePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabFromPath = location.pathname.includes('strategy-cycle') ? 'cycle' : null
  const tabFromQuery = searchParams.get('tab')
  const activeTab = tabFromPath || (tabFromQuery === 'cycle' ? 'cycle' : 'plan')

  const [tab, setTab] = useState(activeTab)

  useEffect(() => {
    setTab(activeTab)
  }, [activeTab])

  const currentWeek = useMemo(() => WEEKLY_PLAN.find((w) => w.status === 'current'), [])

  const {
    appliedEffect,
  } = useLunaSync('plan/media-plan')

  const [forcedStep, setForcedStep] = useState(null)
  const [highlightTodoIds, setHighlightTodoIds] = useState([])
  const [monthNotice, setMonthNotice] = useState('')
  const consumeNavigationIntent = useStrategyTaskStore((s) => s.consumeNavigationIntent)

  const switchTab = (next) => {
    setTab(next)
    if (location.pathname.includes('strategy-cycle')) {
      navigate(`../media-plan?tab=${next}`, { replace: true })
      return
    }
    setSearchParams(next === 'plan' ? {} : { tab: next }, { replace: true })
  }

  useEffect(() => {
    const intent = consumeNavigationIntent()
    if (!intent) return
    if (intent.tab) switchTab(intent.tab)
    if (intent.step) setForcedStep(intent.step)
    if (intent.highlightTodoIds?.length) setHighlightTodoIds(intent.highlightTodoIds)
  }, [])

  useEffect(() => {
    if (appliedEffect?.tab) switchTab(appliedEffect.tab)
    if (appliedEffect?.step) setForcedStep(appliedEffect.step)
    if (appliedEffect?.highlightTodoIds) setHighlightTodoIds(appliedEffect.highlightTodoIds)
  }, [appliedEffect])

  return (
    <div className="-mx-6 min-h-[100dvh] bg-neutral-50 px-6 py-6 lg:px-8">
      <div className="w-full space-y-5">
        <header className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-neutral-600">
                {MEDIA_PLAN_MONTH.periodStart} 至 {MEDIA_PLAN_MONTH.periodEnd}
                · 当前 {currentWeek?.week} {currentWeek?.theme}
                · {MOCK_STRATEGY_CYCLE.period_label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMonthNotice('当前周期固定为 ' + MEDIA_PLAN_MONTH.label)
                setTimeout(() => setMonthNotice(''), 2200)
              }}
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <Calendar size={14} />
              {MEDIA_PLAN_MONTH.label}
            </button>
          </div>
          {monthNotice && (
            <p className="mt-2 text-xs font-medium text-primary-600">{monthNotice}</p>
          )}

          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              切换工作视图
            </p>
            <div
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-1.5 rounded-2xl border-2 border-neutral-200 bg-neutral-100 p-1.5"
              role="tablist"
              aria-label="媒体计划与策略视图"
            >
              {TABS.map((item) => {
                const isActive = tab === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => switchTab(item.id)}
                    className={`rounded-xl px-4 py-3 text-left transition-all active:scale-[0.98] ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md'
                        : 'border border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? 'bg-white/15 text-white' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.label}</span>
                          {isActive && (
                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
                              当前
                            </span>
                          )}
                        </div>
                        <span className={`mt-0.5 block text-[11px] leading-snug ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        {tab === 'cycle' && <StrategyEvidencePanel />}
        {tab === 'plan' ? (
          <MediaPlanPanel onSwitchToCycle={() => switchTab('cycle')} />
        ) : (
          <StrategyCyclePanel
            embedded
            onSwitchToPlan={() => switchTab('plan')}
            forcedStep={forcedStep}
            highlightTodoIds={highlightTodoIds}
          />
        )}
      </div>
    </div>
  )
}

export default PlanWorkspacePage
