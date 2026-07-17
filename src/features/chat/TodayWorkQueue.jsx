import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, FlaskConical, Play, UserRoundCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const META = {
  judge: { label: '需要判断', icon: AlertTriangle, tone: 'text-danger-600', dot: 'bg-danger-500' },
  execute: { label: '等待执行', icon: CheckCircle2, tone: 'text-primary-600', dot: 'bg-primary-500' },
  verify: { label: '观察验证', icon: FlaskConical, tone: 'text-warning-600', dot: 'bg-warning-500' },
  delivery: { label: '定时交付', icon: Clock3, tone: 'text-success-600', dot: 'bg-success-500' },
}

const TodayWorkQueue = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('judge')
  const [notice, setNotice] = useState('')
  const notifications = useMarketingOpsStore((state) => state.notifications)
  const actions = useMarketingOpsStore((state) => state.actions)
  const tasks = useMarketingOpsStore((state) => state.tasks)
  const updateNotification = useMarketingOpsStore((state) => state.updateNotification)
  const executeAction = useMarketingOpsStore((state) => state.executeAction)
  const updateTask = useMarketingOpsStore((state) => state.updateTask)
  const items = useMemo(() => ({
    judge: notifications.filter((item) => !item.read || item.status === '待处理').map((item) => ({ id: `n-${item.id}`, sourceId: item.id, title: item.title, detail: item.detail, meta: `${item.time} · ${item.assignee || '未指派'}`, type: 'notification' })),
    execute: actions.filter((item) => item.status === '待执行').map((item) => ({ id: `a-${item.id}`, sourceId: item.id, title: item.target, detail: item.action, meta: `${item.source} · ${item.approvedBy}`, type: 'action' })),
    verify: actions.filter((item) => item.status === '验证中').map((item) => ({ id: `v-${item.id}`, sourceId: item.id, title: item.target, detail: item.action, meta: `观察窗口 ${item.verificationWindow}`, type: 'verification' })),
    delivery: tasks.filter((item) => item.enabled).map((item) => ({ id: `t-${item.id}`, sourceId: item.id, title: item.name, detail: `${item.skill} · ${item.schedule}`, meta: `下次 ${item.next}`, type: 'task' })),
  }), [notifications, actions, tasks])

  const handle = (item) => {
    if (item.type === 'notification') { updateNotification(item.sourceId, { status: '处理中', assignee: '当前用户' }); setNotice('预警已由你接手，处理状态已同步到通知中心。'); return }
    if (item.type === 'action') { executeAction(item.sourceId); setNotice('动作已执行，系统已创建效果观察窗口。'); return }
    if (item.type === 'verification') { navigate('../insight/operations-closure'); return }
    updateTask(item.sourceId, { status: '成功', next: '按计划计算' }); setNotice('任务已运行，结果会进入今日工作台。')
  }

  const active = items[tab]
  return (
    <section className="workspace-section">
      <header className="workspace-section-header">
        <div><h2 className="text-sm font-semibold text-neutral-950">今日工作队列</h2><p className="mt-1 text-xs text-neutral-500">每一项都明确来源、状态与下一步。</p></div>
        <span className="text-xs font-medium text-neutral-500">共 {Object.values(items).flat().length} 项</span>
      </header>
      <div className="grid grid-cols-2 border-b border-neutral-200 bg-neutral-50 sm:grid-cols-4">
        {Object.entries(META).map(([id, meta]) => {
          const Icon = meta.icon
          return (
            <button key={id} onClick={() => setTab(id)} className={`relative flex min-h-14 items-center justify-center gap-2 border-neutral-200 px-3 text-xs font-semibold transition-colors sm:border-r ${tab === id ? 'bg-white text-neutral-950' : 'text-neutral-500 hover:bg-white/70'}`}>
              <Icon size={14} className={tab === id ? meta.tone : 'text-neutral-400'} />{meta.label}
              <span className="tabular-nums text-neutral-400">{items[id].length}</span>
              {tab === id && <span className={`absolute inset-x-3 bottom-0 h-0.5 ${meta.dot}`} />}
            </button>
          )
        })}
      </div>
      <div className="divide-y divide-neutral-200">
        {active.slice(0, 5).map((item) => (
          <article key={item.id} className="group flex flex-col gap-3 px-5 py-4 hover:bg-neutral-50 sm:flex-row sm:items-center">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${META[tab].dot}`} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3><span className="text-xs text-neutral-400">{item.meta}</span></div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{item.detail}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => handle(item)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-xs font-semibold text-white hover:bg-neutral-800">
                {item.type === 'notification' ? <UserRoundCheck size={13} /> : <Play size={13} />}{item.type === 'notification' ? '接手' : item.type === 'verification' ? '验证' : '推进'}
              </button>
              <button aria-label="打开详情" onClick={() => navigate(item.type === 'task' ? '../settings/automation' : item.type === 'notification' ? '../notifications' : '../insight/operations-closure')} className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-white hover:text-neutral-900"><ArrowRight size={14} /></button>
            </div>
          </article>
        ))}
        {active.length === 0 && <div className="py-12 text-center"><CheckCircle2 size={23} className="mx-auto text-success-500" /><p className="mt-3 text-sm font-semibold text-neutral-800">当前分类已处理完成</p><p className="mt-1 text-xs text-neutral-400">新事项会自动进入这里。</p></div>}
      </div>
      {notice && <div role="status" className="flex items-center gap-2 border-t border-success-200 bg-success-50 px-5 py-3 text-xs font-medium text-success-800"><CheckCircle2 size={14} />{notice}</div>}
    </section>
  )
}

export default TodayWorkQueue
