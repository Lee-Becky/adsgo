import { useState } from 'react'
import {
  Bot,
  ChevronRight,
  Clock,
  Play,
  Target,
  User,
} from 'lucide-react'
import {
  GLOBAL_GOALS,
  MARKET_ANALYSIS,
  SCHEDULED_JOBS,
  WEEKLY_PLAN,
} from './mediaPlanMockData'

const statusStyle = {
  修复: 'bg-danger-50 text-danger-700 border-danger-100',
  放量: 'bg-success-50 text-success-700 border-success-100',
  稳定: 'bg-primary-50 text-primary-700 border-primary-100',
  观察: 'bg-warning-50 text-warning-700 border-warning-100',
  测试: 'bg-neutral-100 text-neutral-600 border-neutral-200',
}

const priorityStyle = {
  P0: 'text-danger-600',
  P1: 'text-warning-600',
  P2: 'text-neutral-500',
  P3: 'text-neutral-400',
}

const weekStatusStyle = {
  current: 'border-primary-300 bg-primary-50/50 ring-2 ring-primary-100',
  upcoming: 'border-neutral-200 bg-white',
  past: 'border-neutral-100 bg-neutral-50 opacity-70',
}

export const MediaPlanPanel = ({ onSwitchToCycle }) => {
  const [jobs, setJobs] = useState(SCHEDULED_JOBS)

  const toggleJob = (id) => {
    setJobs((prev) => prev.map((job) => (
      job.id === id ? { ...job, enabled: !job.enabled, status: job.enabled ? 'paused' : 'active' } : job
    )))
  }

  return (
    <div className="space-y-5">
        {/* 整体目标 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary-500" />
            <h2 className="text-base font-semibold text-neutral-950">整体目标</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">ROAS 目标</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-neutral-950">≥ {GLOBAL_GOALS.roasTarget}</p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Purchase ROAS 目标</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-neutral-950">≥ {GLOBAL_GOALS.purchaseRoasTarget}</p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">月度预算</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-neutral-950">${(GLOBAL_GOALS.monthlyBudget / 1000).toFixed(0)}K</p>
              <p className="mt-1 text-xs text-neutral-400">已花 ${(GLOBAL_GOALS.monthlySpend / 1000).toFixed(1)}K ({GLOBAL_GOALS.spendPct}%)</p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">重点市场</p>
              <p className="mt-1 text-lg font-semibold text-neutral-950">{GLOBAL_GOALS.primaryMarkets.join(' · ')}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-600">{GLOBAL_GOALS.narrative}</p>
        </section>

        {/* 各市场分析 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">各市场分析</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">市场</th>
                  <th className="pb-3 pr-4 text-right font-medium">花费</th>
                  <th className="pb-3 pr-4 text-right font-medium">ROAS</th>
                  <th className="pb-3 pr-4 text-right font-medium">Purchase ROAS</th>
                  <th className="pb-3 pr-4 font-medium">状态</th>
                  <th className="pb-3 pr-4 font-medium">本周重点</th>
                  <th className="pb-3 font-medium">优先级</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_ANALYSIS.map((m) => (
                  <tr key={m.code} className="border-b border-neutral-50 last:border-0">
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-neutral-900">{m.code}</span>
                      <span className="ml-1.5 text-neutral-500">{m.name}</span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-neutral-700">${m.spend.toLocaleString()}</td>
                    <td className={`py-3 pr-4 text-right font-mono font-medium ${m.roas >= GLOBAL_GOALS.roasTarget ? 'text-success-600' : m.roas >= 2.0 ? 'text-warning-600' : 'text-danger-600'}`}>
                      {m.roas.toFixed(2)}x
                    </td>
                    <td className={`py-3 pr-4 text-right font-mono ${m.purchaseRoas >= GLOBAL_GOALS.purchaseRoasTarget ? 'text-success-600' : 'text-neutral-600'}`}>
                      {m.purchaseRoas.toFixed(2)}x
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyle[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{m.focus}</td>
                    <td className={`py-3 font-mono text-xs font-semibold ${priorityStyle[m.priority]}`}>{m.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* W1 → W4 周次任务 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">周次任务拆分</h2>
          <p className="mt-1 text-sm text-neutral-500">月度计划拆解为 W1 → W4，每周主题与关键任务对齐策略</p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {WEEKLY_PLAN.map((week) => (
              <div
                key={week.week}
                className={`rounded-xl border p-4 ${weekStatusStyle[week.status]}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-lg font-bold text-neutral-900">{week.week}</span>
                  {week.status === 'current' ? (
                    <button
                      onClick={onSwitchToCycle}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-primary-600"
                    >
                      本周策略
                      <ChevronRight size={10} />
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-neutral-500">{week.label}</p>
                <p className="mt-2 text-sm font-semibold text-neutral-900">{week.theme}</p>
                <div className="mt-3 space-y-2">
                  {week.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-xs">
                      {task.owner === 'luna' ? (
                        <Bot size={12} className="mt-0.5 shrink-0 text-luna-violet" />
                      ) : (
                        <User size={12} className="mt-0.5 shrink-0 text-neutral-400" />
                      )}
                      <div className="min-w-0">
                        <p className="text-neutral-800">{task.title}</p>
                        <p className="mt-0.5 text-neutral-400">{task.due}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 text-[10px] text-neutral-500">
                  <span>ROAS {week.kpis.roas}</span>
                  <span>·</span>
                  <span>{week.kpis.spend}</span>
                  <span>·</span>
                  <span>{week.kpis.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 定时任务调度 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-neutral-500" />
            <h2 className="text-base font-semibold text-neutral-950">定时任务调度</h2>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Luna 自动执行的任务带具体日期和时间；人工任务在策略中确认</p>
          <div className="mt-4 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  job.enabled ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Bot size={14} className="text-luna-violet" />
                    <h3 className="text-sm font-semibold text-neutral-900">{job.name}</h3>
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-600">
                      {job.schedule}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-neutral-600">{job.action}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-neutral-400">
                    <span>上次：{job.lastRun}</span>
                    <span>下次：{job.nextRun}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleJob(job.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                    job.enabled
                      ? 'border-success-200 bg-success-50 text-success-700'
                      : 'border-neutral-200 bg-white text-neutral-500'
                  }`}
                >
                  <Play size={12} />
                  {job.enabled ? '已启用' : '已暂停'}
                </button>
              </div>
            ))}
          </div>
        </section>
    </div>
  )
}

export default MediaPlanPanel
