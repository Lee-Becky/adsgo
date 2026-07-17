import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, FileText, FlaskConical, Play, UserRoundCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const META = {
  judge: { label: '需要判断', icon: AlertTriangle, tone: 'bg-warning-50 text-warning-700' },
  execute: { label: '等待执行', icon: CheckCircle2, tone: 'bg-primary-50 text-primary-700' },
  verify: { label: '观察验证', icon: FlaskConical, tone: 'bg-info-50 text-info-700' },
  delivery: { label: '定时交付', icon: Clock3, tone: 'bg-success-50 text-success-700' },
}

const TodayWorkQueue = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('judge')
  const [notice, setNotice] = useState('')
  const notifications = useMarketingOpsStore((s) => s.notifications)
  const actions = useMarketingOpsStore((s) => s.actions)
  const tasks = useMarketingOpsStore((s) => s.tasks)
  const updateNotification = useMarketingOpsStore((s) => s.updateNotification)
  const executeAction = useMarketingOpsStore((s) => s.executeAction)
  const updateTask = useMarketingOpsStore((s) => s.updateTask)
  const items = useMemo(() => ({
    judge: notifications.filter((x) => !x.read || x.status === '待处理').map((x) => ({ id: `n-${x.id}`, sourceId: x.id, title: x.title, detail: x.detail, meta: `${x.time} · ${x.assignee || '未指派'}`, type: 'notification' })),
    execute: actions.filter((x) => x.status === '待执行').map((x) => ({ id: `a-${x.id}`, sourceId: x.id, title: x.target, detail: x.action, meta: `${x.source} · ${x.approvedBy}`, type: 'action' })),
    verify: actions.filter((x) => x.status === '验证中').map((x) => ({ id: `v-${x.id}`, sourceId: x.id, title: x.target, detail: x.action, meta: `观察窗口 ${x.verificationWindow}`, type: 'verification' })),
    delivery: tasks.filter((x) => x.enabled).map((x) => ({ id: `t-${x.id}`, sourceId: x.id, title: x.name, detail: `${x.skill} · ${x.schedule}`, meta: `下次 ${x.next}`, type: 'task' })),
  }), [notifications, actions, tasks])
  const handle = (item) => {
    if (item.type === 'notification') { updateNotification(item.sourceId, { status: '处理中', assignee: '当前用户' }); setNotice('预警已由你接手'); return }
    if (item.type === 'action') { executeAction(item.sourceId); setNotice('动作已执行并进入验证窗口'); return }
    if (item.type === 'verification') { navigate('../insight/operations-closure'); return }
    updateTask(item.sourceId, { status: '成功', next: '按计划计算' }); setNotice('任务已立即运行（模拟）')
  }
  const active = items[tab]
  return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><header className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><FileText size={18} className="text-luna-violet"/><h3 className="font-bold">今日工作队列</h3></div><p className="mt-1 text-xs text-neutral-500">在 Luna 内直接接手、执行或进入验证，不再只看汇总数字</p></div><div className="flex max-w-full overflow-x-auto rounded-xl bg-neutral-100 p-1">{Object.entries(META).map(([id,m])=>{const Icon=m.icon;return <button key={id} onClick={()=>setTab(id)} className={`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-xs font-semibold ${tab===id?'bg-white text-neutral-900 shadow-sm':'text-neutral-500'}`}><Icon size={13}/>{m.label}<span className="rounded-full bg-neutral-200/70 px-1.5 py-0.5 text-[10px]">{items[id].length}</span></button>})}</div></header><div className="divide-y">{active.slice(0,5).map((item)=>{const meta=META[tab],Icon=meta.icon;return <article key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tone}`}><Icon size={16}/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-neutral-900">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-neutral-500">{item.detail}</p><p className="mt-1 text-[10px] text-neutral-400">{item.meta}</p></div><div className="flex gap-2"><button onClick={()=>handle(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-xs font-semibold text-white">{item.type==='notification'?<UserRoundCheck size={13}/>:<Play size={13}/>} {item.type==='notification'?'接手处理':item.type==='verification'?'查看验证':'立即推进'}</button><button onClick={()=>navigate(item.type==='task'?'../settings/automation':item.type==='notification'?'../notifications':'../insight/operations-closure')} className="grid h-9 w-9 place-items-center rounded-lg border text-neutral-500"><ArrowRight size={14}/></button></div></article>})}{active.length===0&&<div className="py-12 text-center"><CheckCircle2 size={24} className="mx-auto text-success-500"/><p className="mt-3 text-sm font-semibold">当前分类已处理完成</p><p className="mt-1 text-xs text-neutral-400">新的工作项会由预警、Skill 和执行结果自动进入</p></div>}</div>{notice&&<div className="border-t border-success-200 bg-success-50 px-5 py-3 text-xs font-semibold text-success-700">{notice}</div>}</section>
}
export default TodayWorkQueue
