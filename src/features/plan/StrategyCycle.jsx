import { useState } from 'react'
import {
  Target, CheckCircle2, Circle, Clock, AlertTriangle, Zap,
  ChevronRight, Play, Pause, RotateCcw, Sparkles,
  Globe2, TrendingUp, ArrowRight, ToggleLeft, ToggleRight,
  MessageSquare, Timer,
} from 'lucide-react'
import { LunaAvatar } from '@components/luna'
import MetricCard from '@components/ui/MetricCard'
import { MONTHLY_PLAN, CURRENT_CYCLE } from './strategyCycleMockData'

/* ═══════════════════════════════════════════════════════════
   StrategyCycle — Weekly PDCA closed-loop strategy cycle
   ═══════════════════════════════════════════════════════════ */

/* ── Status colors ─────────────────────────────────────────── */
const STATUS_COLOR = {
  'on-track': 'text-success-600 bg-success-50 border-success-200',
  'strong':   'text-success-600 bg-success-50 border-success-200',
  'warning':  'text-warning-600 bg-warning-50 border-warning-200',
  'critical': 'text-danger-600 bg-danger-50 border-danger-200',
}

const TASK_STATUS = {
  completed: { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-50', label: 'Done' },
  pending:   { icon: Circle, color: 'text-warning-500', bg: 'bg-warning-50', label: 'Pending' },
  upcoming:  { icon: Clock, color: 'text-neutral-400', bg: 'bg-neutral-50', label: 'Upcoming' },
  overdue:   { icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50', label: 'Overdue' },
}

const PRIORITY_COLOR = {
  high:   'bg-danger-50 text-danger-700 border-danger-200',
  medium: 'bg-warning-50 text-warning-700 border-warning-200',
  low:    'bg-neutral-50 text-neutral-600 border-neutral-200',
}

const StrategyCycle = () => {
  const [activeTab, setActiveTab] = useState('cycle') // cycle | monthly
  const [taskDecisions, setTaskDecisions] = useState({})
  const [taskStatuses, setTaskStatuses] = useState(
    () => Object.fromEntries(CURRENT_CYCLE.tasks.map(t => [t.id, t.status]))
  )
  const [autoTaskToggles, setAutoTaskToggles] = useState(
    () => Object.fromEntries(CURRENT_CYCLE.autoTasks.map((t, i) => [`auto-${i}`, t.enabled]))
  )

  const handleDecision = (taskId, choice) => {
    setTaskDecisions(prev => ({ ...prev, [taskId]: choice }))
    setTaskStatuses(prev => ({ ...prev, [taskId]: 'completed' }))
  }

  const handleCompleteTask = (taskId) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: 'completed' }))
  }

  return (
    <div className="space-y-6">
      {/* ── Tab toggle ──────────────────────────────────────── */}
      <div className="flex justify-end">
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-4 py-2 text-caption font-semibold transition-colors ${
              activeTab === 'cycle' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            Weekly Cycle
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 text-caption font-semibold transition-colors ${
              activeTab === 'monthly' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            Monthly Plan
          </button>
        </div>
      </div>

      {/* ═══ Monthly Plan View ═══════════════════════════════ */}
      {activeTab === 'monthly' && (
        <div className="space-y-5">
          {/* Global goals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricCard
              label="Monthly ROAS Target"
              value={MONTHLY_PLAN.overallGoals.roas.current}
              format="number"
              trend={{ value: ((MONTHLY_PLAN.overallGoals.roas.current / MONTHLY_PLAN.overallGoals.roas.target - 1) * 100), direction: 'up' }}
              trendLabel={`target: ${MONTHLY_PLAN.overallGoals.roas.target}x`}
            />
            <MetricCard
              label="Purchase ROAS"
              value={MONTHLY_PLAN.overallGoals.purchaseRoas.current}
              format="number"
              trend={{ value: ((MONTHLY_PLAN.overallGoals.purchaseRoas.current / MONTHLY_PLAN.overallGoals.purchaseRoas.target - 1) * 100), direction: 'up' }}
              trendLabel={`target: ${MONTHLY_PLAN.overallGoals.purchaseRoas.target}x`}
            />
            <MetricCard
              label="Monthly Budget"
              value={MONTHLY_PLAN.overallGoals.monthlyBudget.spent}
              format="currency"
              trend={{ value: Math.round(MONTHLY_PLAN.overallGoals.monthlyBudget.remaining), direction: 'flat' }}
              trendLabel={`$${MONTHLY_PLAN.overallGoals.monthlyBudget.remaining.toLocaleString()} remaining`}
            />
          </div>

          {/* Market breakdown */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Globe2 size={16} className="text-neutral-400" />
              Market Analysis
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {MONTHLY_PLAN.markets.map(m => (
                <div key={m.code} className={`rounded-lg border px-4 py-3 ${STATUS_COLOR[m.status]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{m.code === 'US' ? '🇺🇸' : m.code === 'UK' ? '🇬🇧' : m.code === 'DE' ? '🇩🇪' : '🇯🇵'}</span>
                    <span className="font-semibold text-sm">{m.name}</span>
                  </div>
                  <p className="text-xs font-medium">{m.allocation}% allocation | ROAS {m.roas}x</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly breakdown timeline */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4">Weekly Breakdown</h3>
            <div className="space-y-2">
              {MONTHLY_PLAN.weeklyBreakdown.map((w, i) => (
                <div
                  key={w.week}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
                    w.status === 'active'
                      ? 'bg-primary-50 border-primary-200'
                      : w.status === 'completed'
                        ? 'bg-success-50/50 border-success-200'
                        : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    w.status === 'completed' ? 'bg-success-500 text-white' :
                    w.status === 'active' ? 'bg-primary-500 text-white' :
                    'bg-neutral-200 text-neutral-500'
                  }`}>
                    {w.status === 'completed' ? <CheckCircle2 size={16} /> :
                     w.status === 'active' ? <Play size={14} className="ml-0.5" /> :
                     <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-800">{w.week}: {w.label}</p>
                    <p className="text-caption text-neutral-500">{w.focus}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    w.status === 'completed' ? 'bg-success-100 text-success-700' :
                    w.status === 'active' ? 'bg-primary-100 text-primary-700' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>
                    {w.status === 'completed' ? 'Done' : w.status === 'active' ? 'Active' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Weekly Cycle View (PDCA) ═══════════════════════ */}
      {activeTab === 'cycle' && (
        <div className="space-y-5">
          {/* ① Last week verification */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-success-50 border border-success-200 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-success-600" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-neutral-900">Last Week Data Verified</h3>
                <p className="text-caption text-neutral-500">Auto-verified at {CURRENT_CYCLE.lastWeekVerification.timestamp}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ml-11">
              <div className="text-center px-3 py-2 rounded-lg bg-neutral-50">
                <p className="text-caption text-neutral-500">Spend</p>
                <p className="text-sm font-semibold text-neutral-800 tabular-nums">${CURRENT_CYCLE.lastWeekVerification.summary.spend.toLocaleString()}</p>
              </div>
              <div className="text-center px-3 py-2 rounded-lg bg-neutral-50">
                <p className="text-caption text-neutral-500">ROAS</p>
                <p className="text-sm font-semibold text-neutral-800 tabular-nums">{CURRENT_CYCLE.lastWeekVerification.summary.roas}x</p>
              </div>
              <div className="text-center px-3 py-2 rounded-lg bg-neutral-50">
                <p className="text-caption text-neutral-500">Purchases</p>
                <p className="text-sm font-semibold text-neutral-800 tabular-nums">{CURRENT_CYCLE.lastWeekVerification.summary.purchases}</p>
              </div>
              <div className="text-center px-3 py-2 rounded-lg bg-neutral-50">
                <p className="text-caption text-neutral-500">Top Campaign</p>
                <p className="text-sm font-semibold text-success-600 tabular-nums">{CURRENT_CYCLE.lastWeekVerification.summary.topCampaignRoas}x</p>
              </div>
            </div>
          </div>

          {/* ② This week tracking */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center">
                <TrendingUp size={16} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-sm font-semibold text-neutral-900">This Week — Live Tracking</h3>
                <p className="text-caption text-neutral-500">Day {CURRENT_CYCLE.thisWeekTracking.daysSoFar} of 7 | Updated {CURRENT_CYCLE.thisWeekTracking.timestamp}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                CURRENT_CYCLE.thisWeekTracking.metrics.pacing === 'ahead' ? 'bg-success-50 text-success-700 border border-success-200' :
                'bg-neutral-50 text-neutral-600 border border-neutral-200'
              }`}>
                <TrendingUp size={10} />
                Pacing {CURRENT_CYCLE.thisWeekTracking.metrics.pacing}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ml-11">
              <MetricCard label="Spend (Today)" value={CURRENT_CYCLE.thisWeekTracking.metrics.spend} format="currency" className="!p-3" />
              <MetricCard label="ROAS" value={CURRENT_CYCLE.thisWeekTracking.metrics.roas} format="number" className="!p-3" />
              <MetricCard label="Purchases" value={CURRENT_CYCLE.thisWeekTracking.metrics.purchases} format="number" className="!p-3" />
              <MetricCard label="Projected Weekly" value={CURRENT_CYCLE.thisWeekTracking.metrics.projectedWeeklySpend} format="currency" className="!p-3" />
            </div>
          </div>

          {/* ③ AI Strategy Suggestions */}
          <div className="bg-white rounded-xl border border-luna-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <LunaAvatar size="sm" showRing />
              <div className="flex-1">
                <h3 className="font-heading text-sm font-semibold text-neutral-900">AI Strategy Suggestions</h3>
                <p className="text-caption text-neutral-500">Generated at {CURRENT_CYCLE.aiSuggestions.generatedAt}</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption font-medium text-luna-violet bg-luna-bg border border-luna-border hover:bg-luna-bg/80 transition-colors">
                <RotateCcw size={12} />
                Regenerate
              </button>
            </div>
            <div className="space-y-3">
              {CURRENT_CYCLE.aiSuggestions.items.map(sug => (
                <div key={sug.id} className="rounded-lg border border-neutral-200 p-4 hover:border-primary-200 transition-colors">
                  <div className="flex items-start gap-3">
                    <Zap size={16} className="text-primary-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-semibold text-neutral-800">{sug.title}</h4>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${PRIORITY_COLOR[sug.priority]}`}>
                          {sug.priority}
                        </span>
                      </div>
                      <p className="text-caption text-neutral-600 mb-1.5">{sug.description}</p>
                      <p className="text-caption text-success-600 font-medium flex items-center gap-1">
                        <TrendingUp size={12} />
                        Impact: {sug.impact}
                      </p>
                    </div>
                    <button className="shrink-0 px-3 py-1.5 rounded-lg text-caption font-semibold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ④ Execution Tasks */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Target size={16} className="text-neutral-400" />
              Execution Tasks
            </h3>
            <div className="space-y-2">
              {CURRENT_CYCLE.tasks.map(task => {
                const currentStatus = taskStatuses[task.id] || task.status
                const statusCfg = TASK_STATUS[currentStatus]
                const StatusIcon = statusCfg.icon

                return (
                  <div key={task.id} className={`rounded-lg border px-4 py-3 transition-colors ${
                    currentStatus === 'completed' ? 'border-success-200 bg-success-50/30' :
                    currentStatus === 'pending' ? 'border-neutral-200 bg-white' :
                    'border-neutral-100 bg-neutral-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <StatusIcon size={18} className={`shrink-0 mt-0.5 ${statusCfg.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-semibold ${currentStatus === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-800'}`}>
                            {task.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            task.type === 'gate-check' ? 'bg-info-50 text-info-700 border-info-200' :
                            task.type === 'decision' ? 'bg-warning-50 text-warning-700 border-warning-200' :
                            'bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}>
                            {task.type === 'gate-check' ? 'Auto' : task.type === 'decision' ? 'Decision' : 'Action'}
                          </span>
                        </div>

                        {task.schedule && (
                          <p className="text-caption text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Timer size={11} /> {task.schedule}
                          </p>
                        )}

                        {task.description && currentStatus !== 'completed' && (
                          <p className="text-caption text-neutral-600 mt-1">{task.description}</p>
                        )}

                        {task.result && currentStatus === 'completed' && (
                          <p className="text-caption text-success-600 mt-1">{task.result}</p>
                        )}

                        {/* Decision buttons */}
                        {task.type === 'decision' && currentStatus === 'pending' && task.options && (
                          <div className="flex items-center gap-2 mt-2">
                            {task.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleDecision(task.id, opt)}
                                className={`px-3 py-1.5 rounded-lg text-caption font-semibold transition-colors ${
                                  i === 0
                                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {taskDecisions[task.id] && (
                          <p className="text-caption text-primary-600 font-medium mt-1 flex items-center gap-1">
                            <MessageSquare size={11} /> Decision: {taskDecisions[task.id]}
                          </p>
                        )}

                        {/* Complete action button */}
                        {task.type === 'action' && currentStatus === 'pending' && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="mt-2 px-3 py-1.5 rounded-lg text-caption font-semibold bg-success-50 text-success-700 border border-success-200 hover:bg-success-100 transition-colors"
                          >
                            Mark as done
                          </button>
                        )}
                      </div>

                      {task.dueDate && currentStatus !== 'completed' && (
                        <span className="text-caption text-neutral-400 shrink-0 whitespace-nowrap">Due {task.dueDate}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Auto-scheduled recurring tasks */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <RotateCcw size={16} className="text-neutral-400" />
              Auto-scheduled Tasks
            </h3>
            <div className="space-y-2">
              {CURRENT_CYCLE.autoTasks.map((task, i) => {
                const toggleKey = `auto-${i}`
                const enabled = autoTaskToggles[toggleKey]
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-200 hover:bg-neutral-50/50 transition-colors">
                    <button
                      onClick={() => setAutoTaskToggles(prev => ({ ...prev, [toggleKey]: !prev[toggleKey] }))}
                      className="shrink-0"
                    >
                      {enabled
                        ? <ToggleRight size={24} className="text-primary-500" />
                        : <ToggleLeft size={24} className="text-neutral-300" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${enabled ? 'text-neutral-800' : 'text-neutral-400'}`}>{task.label}</p>
                      <p className="text-caption text-neutral-500 flex items-center gap-1">
                        <Timer size={11} /> {task.schedule}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategyCycle
