import { useMemo, useState, useEffect } from 'react'
import {

  AlertTriangle,

  Bot,

  CheckCircle2,

  ChevronRight,

  Clock,

  Database,

  FilePenLine,

  Loader2,

  RefreshCw,

  Save,

  Sparkles,

  Trash2,

  User,

} from 'lucide-react'

import { LunaAvatar } from '@components/luna'

import useStrategyTaskStore from '@stores/strategyTaskStore'

import {

  MOCK_AVAILABLE_VIEWS,

  MOCK_STRATEGY_CYCLE,

  MOCK_VIEW_SNAPSHOTS,

  SCHEDULED_CYCLE_JOBS,

  TODO_STATUS_META,

  TODO_TYPE_META,

} from './strategyCycleMockData'



const STEPS = [
  { id: 1, title: '上周数据验证', desc: '系统自动拉取上周待办' },
  { id: 2, title: '本周数据追踪', desc: '实时同步多维视图' },
  { id: 3, title: 'AI 策略建议', desc: 'Luna 生成，一键触发' },
  { id: 4, title: '执行待办', desc: '门检查 / 决策 / 执行' },
]



const VERDICT_LABEL = { effective: '有效', ineffective: '无效', in_progress: '观察' }

const VERDICT_STYLE = {

  effective: 'border-success-200 bg-success-50 text-success-700',

  ineffective: 'border-danger-200 bg-danger-50 text-danger-700',

  in_progress: 'border-warning-200 bg-warning-50 text-warning-700',

}

const PRIORITY_STYLE = {

  high: 'border-danger-200 bg-danger-50 text-danger-700',

  medium: 'border-warning-200 bg-warning-50 text-warning-700',

  low: 'border-neutral-200 bg-neutral-50 text-neutral-600',

}



const ScheduledJobsPanel = ({ jobs }) => (

  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">

    <div className="flex items-center gap-2">

      <Clock size={14} className="text-neutral-500" />

      <h3 className="text-sm font-semibold text-neutral-900">定时策略任务</h3>

    </div>

    <div className="mt-3 space-y-2">

      {jobs.map((job) => (

        <div key={job.id} className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">

          <div className="flex items-center justify-between gap-2">

            <div className="flex items-center gap-1.5 min-w-0">

              <Bot size={12} className="shrink-0 text-luna-violet" />

              <span className="truncate text-xs font-semibold text-neutral-800">{job.name}</span>

            </div>

            <span className="shrink-0 font-mono text-[10px] text-neutral-500">{job.schedule}</span>

          </div>

          <p className="mt-1 text-[11px] text-neutral-500">{job.detail}</p>

          <div className="mt-1.5 flex gap-3 text-[10px] text-neutral-400">

            <span>上次 {job.lastRun}</span>

            <span>下次 {job.nextRun}</span>

          </div>

        </div>

      ))}

    </div>

  </div>

)



const StepShell = ({ cycle, activeStep, setActiveStep, onSwitchToPlan, children }) => (

  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">

    <aside className="space-y-4">

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">

        <div className="rounded-xl bg-neutral-950 p-4 text-white">

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">策略</p>

          <h2 className="mt-2 text-lg font-semibold">{cycle.period_label.replace(/（.*）/, '')}</h2>

          <p className="mt-1 text-caption text-neutral-300">{cycle.period_start} 至 {cycle.period_end}</p>

          <p className="mt-2 text-[11px] text-neutral-400">

            对齐媒体计划 {cycle.media_plan_week} · {cycle.media_plan_theme}

          </p>

        </div>



        <div className="mt-4 space-y-2">

          {STEPS.map((step) => {

            const isActive = activeStep === step.id

            const isDone = activeStep > step.id

            return (

              <button

                key={step.id}

                onClick={() => setActiveStep(step.id)}

                className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${

                  isActive ? 'border-primary-200 bg-primary-50' : isDone ? 'border-success-100 bg-success-50/50' : 'border-neutral-100 bg-white hover:bg-neutral-50'

                }`}

              >

                <div className="flex items-center gap-3">

                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${

                    isActive ? 'bg-primary-500 text-white' : isDone ? 'bg-success-500 text-white' : 'bg-neutral-100 text-neutral-500'

                  }`}>

                    {isDone ? <CheckCircle2 size={15} /> : step.id}

                  </span>

                  <span className="min-w-0 flex-1">

                    <span className="block text-sm font-semibold text-neutral-900">{step.title}</span>

                    <span className="block text-caption text-neutral-500">{step.desc}</span>

                  </span>

                </div>

              </button>

            )

          })}

        </div>



        <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3">

          <p className="text-caption font-semibold text-neutral-700">目标 / 红线</p>

          <div className="mt-2 space-y-2">

            {cycle.targetBaseline.map((row) => (

              <div key={row[0]} className="rounded-lg bg-white px-3 py-2 text-[11px] text-neutral-600">

                <p className="font-semibold text-neutral-900">{row[0]}</p>

                <p className="mt-1">{row[1]} / {row[2]}</p>

                <p>{row[3]} / {row[4]}</p>

              </div>

            ))}

          </div>

        </div>



        {onSwitchToPlan && (
          <button
            type="button"
            onClick={onSwitchToPlan}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
          >
            查看月度媒体计划 <ChevronRight size={12} />
          </button>
        )}

      </div>



      <ScheduledJobsPanel jobs={SCHEDULED_CYCLE_JOBS} />

    </aside>



    <main className="min-w-0 space-y-4">
      {children}
    </main>

  </div>

)



const StepHeader = ({ eyebrow, title, desc, action, meta }) => (

  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

    <div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{eyebrow}</p>

      <h2 className="mt-1 font-heading text-2xl font-semibold text-neutral-950">{title}</h2>

      {desc && <p className="mt-2 max-w-3xl text-caption leading-6 text-neutral-500">{desc}</p>}

      {meta && <p className="mt-2 text-[11px] text-neutral-400">{meta}</p>}

    </div>

    {action}

  </div>

)



const StepCard = ({ children }) => (

  <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">{children}</section>

)



const ExecutorBadge = ({ executor }) => (

  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${

    executor === 'luna' ? 'bg-luna-bg text-luna-violet' : 'bg-neutral-100 text-neutral-600'

  }`}>

    {executor === 'luna' ? <Bot size={10} /> : <User size={10} />}

    {executor === 'luna' ? 'Luna' : '人工'}

  </span>

)



const StrategyCyclePanel = ({ embedded = false, onSwitchToPlan, forcedStep, highlightTodoIds = [] }) => {

  const consumeImportedTodos = useStrategyTaskStore((s) => s.consumeImportedTodos)

  const [cycle, setCycle] = useState(MOCK_STRATEGY_CYCLE)

  const [activeStep, setActiveStep] = useState(MOCK_STRATEGY_CYCLE.current_step)

  const [selectedViews, setSelectedViews] = useState(MOCK_STRATEGY_CYCLE.step2.selected_view_ids)

  const [isQuerying, setIsQuerying] = useState(false)

  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)

  const [isGeneratingTodos, setIsGeneratingTodos] = useState(false)

  const [savedLabel, setSavedLabel] = useState('')

  const [editingSuggestionId, setEditingSuggestionId] = useState(null)

  const [editDraft, setEditDraft] = useState(null)

  useEffect(() => {
    if (forcedStep) setActiveStep(forcedStep)
  }, [forcedStep])

  useEffect(() => {
    const imported = consumeImportedTodos()
    if (!imported.length) return

    setCycle((prev) => {
      const metaIndex = prev.step4.todo_groups.findIndex((group) => group.platform === 'Meta')
      const targetIndex = metaIndex >= 0 ? metaIndex : 0

      return {
        ...prev,
        current_step: 4,
        step4: {
          ...prev.step4,
          todo_groups: prev.step4.todo_groups.map((group, groupIndex) => (
            groupIndex === targetIndex
              ? {
                ...group,
                summary: `${group.summary} · 新增 ${imported.length} 条来自广告管理的预算待办`,
                todos: [...imported, ...group.todos],
              }
              : group
          )),
        },
      }
    })
    setActiveStep(4)
  }, [consumeImportedTodos])



  const selectedSnapshots = useMemo(

    () => selectedViews.map((id) => ({

      view: MOCK_AVAILABLE_VIEWS.find((item) => item.id === id),

      snapshot: MOCK_VIEW_SNAPSHOTS[id],

    })).filter((item) => item.view && item.snapshot),

    [selectedViews],

  )



  const todoProgress = useMemo(() => {

    const todos = cycle.step4.todo_groups.flatMap((g) => g.todos)

    const done = todos.filter((t) => t.done).length

    return { done, total: todos.length, pct: todos.length ? Math.round((done / todos.length) * 100) : 0 }

  }, [cycle.step4.todo_groups])



  const flashSaved = (label) => {

    setSavedLabel(label)

    setTimeout(() => setSavedLabel(''), 1600)

  }



  const updateVerification = (id, verdict) => {

    setCycle((prev) => ({

      ...prev,

      step1: {

        ...prev.step1,

        verifications: prev.step1.verifications.map((item) => (item.id === id ? { ...item, verdict } : item)),

      },

    }))

  }



  const toggleView = (id) => {

    setSelectedViews((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  }



  const queryViews = () => {

    if (!selectedViews.length) return

    setIsQuerying(true)

    setTimeout(() => {

      setCycle((prev) => ({

        ...prev,

        step2: { ...prev.step2, selected_view_ids: selectedViews, queried_at: '2026-06-29 10:31', sync_status: 'synced' },

      }))

      setIsQuerying(false)

      flashSaved('多维视图数据已同步')

    }, 500)

  }



  const generateSuggestions = () => {

    setIsGeneratingSuggestions(true)

    setTimeout(() => {

      setIsGeneratingSuggestions(false)

      setCycle((prev) => ({

        ...prev,

        current_step: Math.max(prev.current_step, 3),
        step3: { ...prev.step3, generated_at: '2026-06-29 10:34' },

      }))

      setActiveStep(3)

      flashSaved('AI 策略建议已生成')

    }, 600)

  }



  const confirmSuggestions = () => {

    setCycle((prev) => ({

      ...prev,

      current_step: Math.max(prev.current_step, 4),

      step3: { ...prev.step3, confirmed: true },

    }))

    setActiveStep(4)

    flashSaved('建议已确认，可进入执行待办')

  }



  const startEditSuggestion = (suggestion) => {

    setEditingSuggestionId(suggestion.id)

    setEditDraft({

      title: suggestion.title,

      detail: suggestion.detail,

      luna_execute_at: suggestion.luna_execute_at,

      priority: suggestion.priority,

    })

  }



  const cancelEditSuggestion = () => {

    setEditingSuggestionId(null)

    setEditDraft(null)

  }



  const saveSuggestionEdit = () => {

    if (!editingSuggestionId || !editDraft) return

    setCycle((prev) => ({

      ...prev,

      step3: {

        ...prev.step3,

        confirmed: false,

        suggestions: prev.step3.suggestions.map((item) => (

          item.id === editingSuggestionId

            ? { ...item, ...editDraft, edited: true }

            : item

        )),

      },

    }))

    cancelEditSuggestion()

    flashSaved('策略建议已保存')

  }



  const generateTodos = () => {

    setIsGeneratingTodos(true)

    setTimeout(() => { setIsGeneratingTodos(false); flashSaved('执行待办已拆解') }, 600)

  }



  const toggleTodo = (groupIndex, todoIndex) => {

    setCycle((prev) => {

      const groups = prev.step4.todo_groups.map((group, gi) => ({

        ...group,

        todos: group.todos.map((todo, ti) => {

          if (gi !== groupIndex || ti !== todoIndex) return todo

          const done = !todo.done

          return { ...todo, done, status: done ? 'done' : 'pending', completed_at: done ? '2026-06-29 14:18' : '' }

        }),

      }))

      return { ...prev, step4: { ...prev.step4, todo_groups: groups } }

    })

  }



  const deleteTodo = (groupIndex, todoIndex) => {

    setCycle((prev) => ({

      ...prev,

      step4: {

        ...prev.step4,

        todo_groups: prev.step4.todo_groups.map((group, gi) => ({

          ...group,

          todos: gi === groupIndex ? group.todos.filter((_, ti) => ti !== todoIndex) : group.todos,

        })),

      },

    }))

  }



  return (

    <div className="space-y-5">

      <div className="rounded-2xl border border-luna-border bg-gradient-to-r from-luna-bg/50 to-white px-5 py-4">

        <div className="flex items-center gap-3">

          <LunaAvatar size="sm" />

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-neutral-900">{cycle.period_label} · 人机协同</p>

            <p className="text-caption text-neutral-600">

              Luna 负责定时拉取、同步和门检查；人工负责决策确认与关键执行。所有动作带具体日期时间，下周 Step 1 自动验证。

            </p>

          </div>

          {savedLabel && (

            <span className="rounded-full border border-success-200 bg-success-50 px-3 py-1 text-caption font-semibold text-success-700">

              {savedLabel}

            </span>

          )}

        </div>

      </div>



      <StepShell cycle={cycle} activeStep={activeStep} setActiveStep={setActiveStep} onSwitchToPlan={onSwitchToPlan}>

        {activeStep === 1 && (

          <StepCard>

            <StepHeader

              eyebrow="Step 1"

              title="上周数据验证"

              desc={cycle.step1.summary}

              meta={`Luna 自动拉取于 ${cycle.step1.auto_pulled_at}`}

              action={(

                <button onClick={() => flashSaved('上周待办已重新载入')} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-caption font-semibold text-neutral-700 hover:bg-neutral-50">

                  <RefreshCw size={14} /> 重新载入

                </button>

              )}

            />



            <div className="space-y-3">

              {cycle.step1.verifications.map((item) => (

                <div key={item.id} className="rounded-xl border border-neutral-200 p-4">

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">{item.platform}</span>

                        <ExecutorBadge executor={item.executed_by} />

                        <h3 className="text-sm font-semibold text-neutral-950">{item.strategy_title}</h3>

                      </div>

                      <p className="mt-2 text-caption leading-6 text-neutral-600">{item.detail}</p>

                      <p className="mt-1 text-[11px] text-neutral-400">执行于 {item.executed_at}</p>

                    </div>

                    <div className="flex shrink-0 gap-2">

                      {Object.keys(VERDICT_LABEL).map((verdict) => (

                        <button

                          key={verdict}

                          onClick={() => updateVerification(item.id, verdict)}

                          className={`rounded-lg border px-3 py-1.5 text-caption font-semibold ${

                            item.verdict === verdict ? VERDICT_STYLE[verdict] : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50'

                          }`}

                        >

                          {VERDICT_LABEL[verdict]}

                        </button>

                      ))}

                    </div>

                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">

                    {Object.keys(item.kpi_before).map((key) => (

                      <div key={key} className="rounded-lg bg-neutral-50 px-3 py-2 text-caption">

                        <p className="font-semibold uppercase text-neutral-500">{key}</p>

                        <p className="mt-1 font-mono text-sm text-neutral-900">{item.kpi_before[key]} → {item.kpi_after[key]}</p>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>



            <div className="mt-5 flex justify-end">

              <button

                onClick={() => { flashSaved('验证结果已保存'); setActiveStep(2) }}

                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-caption font-semibold text-white hover:bg-primary-600"

              >

                保存并进入本周数据追踪 <ChevronRight size={14} />

              </button>

            </div>

          </StepCard>

        )}



        {activeStep === 2 && (

          <StepCard>

            <StepHeader

              eyebrow="Step 2"

              title="本周数据追踪"

              desc="多维视图每 30 分钟自动同步。AI 建议和下周验证都基于这些视图。"

              meta={`上次同步 ${cycle.step2.last_sync} · 下次 ${cycle.step2.next_sync}`}

              action={(

                <button onClick={queryViews} disabled={!selectedViews.length || isQuerying} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-caption font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">

                  {isQuerying ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}

                  立即同步

                </button>

              )}

            />



            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

              {MOCK_AVAILABLE_VIEWS.map((view) => {

                const checked = selectedViews.includes(view.id)

                return (

                  <button

                    key={view.id}

                    onClick={() => toggleView(view.id)}

                    className={`rounded-xl border p-4 text-left transition-colors ${checked ? 'border-primary-200 bg-primary-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}

                  >

                    <div className="flex items-start gap-3">

                      <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${checked ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300'}`}>

                        {checked && <CheckCircle2 size={13} />}

                      </span>

                      <span>

                        <span className="block text-sm font-semibold text-neutral-950">{view.name}</span>

                        <span className="mt-1 block text-caption text-neutral-500">{view.platform} / {view.dataset}</span>

                        <span className="mt-2 block text-[11px] text-neutral-400">{view.rowCount} rows · 同步 {view.lastSync}</span>

                      </span>

                    </div>

                  </button>

                )

              })}

            </div>



            <div className="mt-5 space-y-4">

              {selectedSnapshots.map(({ view, snapshot }) => (

                <div key={view.id} className="overflow-hidden rounded-xl border border-neutral-200">

                  <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">

                    <div>

                      <p className="text-sm font-semibold text-neutral-900">{view.name}</p>

                      <p className="text-caption text-neutral-500">取数窗口：{snapshot.window}</p>

                    </div>

                    <span className="rounded-full border border-success-200 bg-success-50 px-2 py-1 text-[10px] font-semibold text-success-700">已同步</span>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full text-caption">

                      <tbody>

                        {snapshot.rows.map((row) => (

                          <tr key={row.join('-')} className="border-b border-neutral-50 last:border-0">

                            {row.map((cell, index) => (

                              <td key={cell} className={`px-4 py-3 ${index === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>{cell}</td>

                            ))}

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              ))}

            </div>



            <div className="mt-5 flex justify-end">

              <button onClick={generateSuggestions} disabled={!selectedViews.length || isGeneratingSuggestions} className="inline-flex items-center gap-2 rounded-lg bg-luna-violet px-4 py-2 text-caption font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">

                {isGeneratingSuggestions ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}

                生成 AI 策略建议

              </button>

            </div>

          </StepCard>

        )}



        {activeStep === 3 && (

          <StepCard>

            <StepHeader

              eyebrow="Step 3"

              title="AI 策略建议"

              desc={cycle.step3.summary_overall}

              meta={`Luna 生成于 ${cycle.step3.generated_at}`}

              action={(

                <button onClick={generateSuggestions} className="inline-flex items-center gap-2 rounded-lg border border-luna-border bg-luna-bg px-3 py-2 text-caption font-semibold text-luna-violet hover:bg-luna-bg/80">

                  <RefreshCw size={14} /> 重新生成

                </button>

              )}

            />



            <div className="space-y-3">

              {cycle.step3.suggestions.map((suggestion) => {

                const isEditing = editingSuggestionId === suggestion.id

                return (

                <div key={suggestion.id} className={`rounded-xl border p-4 ${isEditing ? 'border-luna-border bg-luna-bg/20' : 'border-neutral-200'}`}>

                  {isEditing && editDraft ? (

                    <div className="space-y-3">

                      <div className="flex items-center justify-between gap-2">

                        <p className="text-sm font-semibold text-neutral-900">编辑策略建议</p>

                        <span className="rounded-full bg-luna-bg px-2 py-0.5 text-[10px] font-semibold text-luna-violet">{suggestion.platform}</span>

                      </div>

                      <label className="block">

                        <span className="text-[11px] font-semibold text-neutral-500">标题</span>

                        <input

                          value={editDraft.title}

                          onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}

                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-luna-violet focus:ring-2 focus:ring-luna-violet/20"

                        />

                      </label>

                      <label className="block">

                        <span className="text-[11px] font-semibold text-neutral-500">说明</span>

                        <textarea

                          value={editDraft.detail}

                          onChange={(e) => setEditDraft((d) => ({ ...d, detail: e.target.value }))}

                          rows={3}

                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-luna-violet focus:ring-2 focus:ring-luna-violet/20"

                        />

                      </label>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <label className="block">

                          <span className="text-[11px] font-semibold text-neutral-500">计划执行</span>

                          <input

                            value={editDraft.luna_execute_at}

                            onChange={(e) => setEditDraft((d) => ({ ...d, luna_execute_at: e.target.value }))}

                            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-luna-violet focus:ring-2 focus:ring-luna-violet/20"

                          />

                        </label>

                        <label className="block">

                          <span className="text-[11px] font-semibold text-neutral-500">优先级</span>

                          <select

                            value={editDraft.priority}

                            onChange={(e) => setEditDraft((d) => ({ ...d, priority: e.target.value }))}

                            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-luna-violet focus:ring-2 focus:ring-luna-violet/20"

                          >

                            <option value="high">high</option>

                            <option value="medium">medium</option>

                            <option value="low">low</option>

                          </select>

                        </label>

                      </div>

                      <div className="flex justify-end gap-2">

                        <button type="button" onClick={cancelEditSuggestion} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-caption font-semibold text-neutral-600 hover:bg-neutral-50">

                          取消

                        </button>

                        <button type="button" onClick={saveSuggestionEdit} className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-caption font-semibold text-white hover:bg-primary-600">

                          <Save size={13} /> 保存

                        </button>

                      </div>

                    </div>

                  ) : (

                  <>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">{suggestion.platform}</span>

                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLE[suggestion.priority]}`}>{suggestion.priority}</span>

                        {suggestion.edited && (

                          <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">已编辑</span>

                        )}

                        <h3 className="text-sm font-semibold text-neutral-950">{suggestion.title}</h3>

                      </div>

                      <p className="mt-2 text-caption leading-6 text-neutral-600">{suggestion.detail}</p>

                      <p className="mt-2 flex items-center gap-1 text-[11px] text-luna-violet">

                        <Clock size={11} /> 计划执行：{suggestion.luna_execute_at}

                      </p>

                    </div>

                    <button

                      type="button"

                      onClick={() => startEditSuggestion(suggestion)}

                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-caption font-semibold text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800"

                    >

                      <FilePenLine size={13} /> 编辑

                    </button>

                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {suggestion.metric_gaps.map((gap) => (

                      <span key={gap} className="rounded-full bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600">{gap}</span>

                    ))}

                  </div>

                  </>

                  )}

                </div>

              )})}

            </div>



            <div className="mt-5 flex justify-end">

              <button onClick={confirmSuggestions} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-caption font-semibold text-white hover:bg-primary-600">

                确认建议，拆解执行待办 <ChevronRight size={14} />

              </button>

            </div>

          </StepCard>

        )}



        {activeStep === 4 && (

          <StepCard>

            <StepHeader

              eyebrow="Step 4"

              title="执行待办"

              desc="门检查由 Luna 定时触发；决策节点需人工确认；执行动作标记完成后进入下周验证。"

              action={(

                <button onClick={generateTodos} disabled={isGeneratingTodos} className="inline-flex items-center gap-2 rounded-lg border border-luna-border bg-luna-bg px-3 py-2 text-caption font-semibold text-luna-violet hover:bg-luna-bg/80 disabled:opacity-50">

                  {isGeneratingTodos ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}

                  重新拆解

                </button>

              )}

            />



            <div className="mb-4 flex flex-wrap gap-2">

              {Object.entries(TODO_TYPE_META).map(([key, meta]) => (

                <span key={key} className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${meta.color}`}>

                  {meta.label}：{meta.desc}

                </span>

              ))}

            </div>



            <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-neutral-900">完成进度 {todoProgress.done}/{todoProgress.total}</p>

                  <p className="text-caption text-neutral-500">已勾选待办将在下周一 08:00 自动进入 Step 1 验证。</p>

                </div>

                <span className="font-mono text-lg font-semibold text-neutral-900">{todoProgress.pct}%</span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-white">

                <div className="h-2 rounded-full bg-primary-500" style={{ width: `${todoProgress.pct}%` }} />

              </div>

            </div>



            <div className="space-y-4">

              {cycle.step4.todo_groups.map((group, groupIndex) => (

                <div key={group.platform} className="rounded-xl border border-neutral-200">

                  <div className="border-b border-neutral-100 px-4 py-3">

                    <p className="text-sm font-semibold text-neutral-950">{group.platform}</p>

                    <p className="mt-1 text-caption text-neutral-500">{group.summary}</p>

                  </div>

                  <div className="divide-y divide-neutral-100">

                    {group.todos.map((todo, todoIndex) => {

                      const typeMeta = TODO_TYPE_META[todo.type]

                      const statusMeta = TODO_STATUS_META[todo.status]

                      return (

                        <div key={todo.id} className={`p-4 ${
                          todo.done ? 'bg-success-50/30' : todo.status === 'overdue' ? 'bg-danger-50/20' : 'bg-white'
                        } ${highlightTodoIds.includes(todo.id) ? 'ring-2 ring-luna-violet/40 bg-luna-bg/20' : ''}`}>

                          <div className="flex items-start gap-3">

                            <button

                              onClick={() => toggleTodo(groupIndex, todoIndex)}

                              disabled={todo.type === 'gate_check'}

                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${

                                todo.done ? 'border-success-500 bg-success-500 text-white' : 'border-neutral-300 bg-white'

                              } ${todo.type === 'gate_check' ? 'cursor-not-allowed opacity-50' : ''}`}

                            >

                              {todo.done && <CheckCircle2 size={13} />}

                            </button>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-center gap-2">

                                <h4 className={`text-sm font-semibold ${todo.done ? 'text-neutral-500 line-through' : 'text-neutral-950'}`}>

                                  {todo.description}

                                </h4>

                                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeMeta.color}`}>{typeMeta.label}</span>

                                <ExecutorBadge executor={todo.executor} />

                                <span className={`text-[10px] font-semibold ${statusMeta.color}`}>{statusMeta.label}</span>
                                {todo.source === 'ads/campaigns' && (
                                  <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                                    来自广告管理
                                  </span>
                                )}

                              </div>

                              <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">

                                <Clock size={11} /> {todo.scheduled_at}

                              </p>

                              <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">

                                {[

                                  ['操作对象', todo.target_object],

                                  ['当前状态', todo.current_state],

                                  ['执行动作', todo.action],

                                  ['数据依据', todo.data_basis],

                                  ['预期效果', todo.expected_outcome],

                                  ['完成时间', todo.completed_at || '—'],

                                ].map(([label, value]) => (

                                  <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2 text-caption">

                                    <span className="font-semibold text-neutral-500">{label}</span>

                                    <span className="ml-2 text-neutral-800">{value}</span>

                                  </div>

                                ))}

                              </div>

                            </div>

                            <button onClick={() => deleteTodo(groupIndex, todoIndex)} className="shrink-0 rounded-lg border border-neutral-200 p-2 text-neutral-400 hover:border-danger-200 hover:bg-danger-50 hover:text-danger-600">

                              <Trash2 size={14} />

                            </button>

                          </div>

                        </div>

                      )

                    })}

                  </div>

                </div>

              ))}

            </div>



            <div className="mt-5 flex justify-end">

              <button onClick={() => flashSaved('执行待办已保存')} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-caption font-semibold text-white hover:bg-primary-600">

                <Save size={14} /> 保存待办

              </button>

            </div>

          </StepCard>

        )}



        {!cycle.settings_valid && (

          <StepCard>

            <div className="flex items-start gap-3">

              <AlertTriangle className="mt-0.5 text-warning-500" size={18} />

              <div>

                <p className="text-sm font-semibold text-neutral-900">当前客户策略配置已过期</p>

                <p className="mt-1 text-caption text-neutral-500">需要先更新客户信息、策略有效期和目标红线后再进入策略。</p>

              </div>

            </div>

          </StepCard>

        )}

      </StepShell>

    </div>

  )

}



export default StrategyCyclePanel
export { StrategyCyclePanel }


