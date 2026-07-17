import { useState } from 'react'
import { AlertCircle, BellRing, CheckCircle2, Clock3, History, MoreHorizontal, Play, Plus, RefreshCw, RotateCcw, Search, Settings2, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'
import { Switch } from '@components/ui'

const TasksAlertsPage = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTabState] = useState(initialTab || (searchParams.get('tab') === 'alerts' ? 'alerts' : 'tasks'))
  const canManage = useBrandStore(state => state.canManageBrand)()
  const tasks = useMarketingOpsStore((state) => state.tasks)
  const alerts = useMarketingOpsStore((state) => state.alertRules)
  const addTaskToStore = useMarketingOpsStore((state) => state.addTask)
  const updateTask = useMarketingOpsStore((state) => state.updateTask)
  const addAlertRule = useMarketingOpsStore((state) => state.addAlertRule)
  const updateAlertRule = useMarketingOpsStore((state) => state.updateAlertRule)
  const addNotification = useMarketingOpsStore((state) => state.addNotification)
  const taskRuns = useMarketingOpsStore((state) => state.taskRuns)
  const addTaskRun = useMarketingOpsStore((state) => state.addTaskRun)
  const [modal, setModal] = useState(null)
  const [editingRule, setEditingRule] = useState(null)
  const [running, setRunning] = useState(null)
  const [notice, setNotice] = useState('')
  const [historyTask, setHistoryTask] = useState(null)
  const setTab = next => {
    setTabState(next)
    setSearchParams({ tab: next })
  }

  const flash = message => {
    setNotice(message)
    setTimeout(() => setNotice(''), 1800)
  }
  const runTask = id => {
    setRunning(id)
    setTimeout(() => {
      updateTask(id, { status: '成功' })
      addTaskRun({ taskId: id, status: '成功', duration: '36 秒', input: '当前品牌 · 最新数据', result: '检查完成，生成 2 条优化建议', steps: ['读取数据源', '调用品牌 Skill', '比对目标红线', '生成建议与通知'] })
      addNotification({ title: '定时任务执行完成', detail: tasks.find(item => item.id === id)?.name || '任务已完成' })
      setRunning(null)
      flash('任务执行完成，已生成运行记录')
    }, 900)
  }
  const addTask = event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    addTaskToStore({ name: data.get('name'), skill: data.get('skill'), schedule: data.get('schedule') })
    setModal(null)
    flash('定时任务已创建')
  }
  const addRule = event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values = { title: data.get('name'), level: data.get('level'), rule: data.get('rule'), scope: data.get('scope'), channel: data.get('channel') }
    if (editingRule) updateAlertRule(editingRule.id, values)
    else addAlertRule(values)
    setModal(null)
    setEditingRule(null)
    flash(editingRule ? '预警规则已更新' : '预警规则已保存并启用')
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex rounded-xl bg-neutral-100 p-1">
        <button onClick={() => setTab('tasks')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'tasks' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><Clock3 size={15}/>定时任务</button>
        <button onClick={() => setTab('alerts')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'alerts' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><BellRing size={15}/>预警规则<span className="rounded-full bg-neutral-200 px-1.5 text-[10px] text-neutral-700">{alerts.filter(a => a.enabled).length}</span></button>
      </div>
      {canManage ? <button onClick={() => { setEditingRule(null); setModal(tab === 'tasks' ? 'task' : 'rule') }} className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={15}/>{tab === 'tasks' ? '新建任务' : '新建预警规则'}</button> : <span className="rounded-full bg-neutral-100 px-3 py-2 text-xs text-neutral-500">普通成员可运行和处理，不可修改自动化配置</span>}
    </div>

    {tab === 'tasks' ? <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b p-4"><div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-neutral-400"/><input placeholder="搜索任务" className="rounded-lg border py-2 pl-8 pr-3 text-sm"/></div><span className="text-xs text-neutral-400">已启用 {tasks.filter(t => t.enabled).length} / {tasks.length}</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead className="bg-neutral-50 text-xs text-neutral-500"><tr>{['任务名称','关联 Skill','执行频率','下次执行','最近状态','启用','操作'].map(h => <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>)}</tr></thead>
        <tbody>{tasks.map(task => <tr key={task.id} className="border-t border-neutral-100">
          <td className="px-5 py-4 font-semibold">{task.name}</td><td className="px-5 py-4"><span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-700">{task.skill}</span></td><td className="px-5 py-4 text-neutral-600">{task.schedule}</td><td className="px-5 py-4 text-neutral-600">{task.next}</td>
          <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs text-success-700"><CheckCircle2 size={13}/>{task.status}</span></td>
          <td className="px-5 py-4"><Switch disabled={!canManage} checked={task.enabled} onChange={enabled => updateTask(task.id, { enabled })} label={`${task.enabled ? '停用' : '启用'}${task.name}`}/></td>
          <td className="px-5 py-4"><div className="flex gap-1"><button disabled={running === task.id} onClick={() => runTask(task.id)} className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-neutral-50">{running === task.id ? <RefreshCw size={13} className="animate-spin"/> : <Play size={13}/>}立即运行</button><button onClick={() => setHistoryTask(task)} className="rounded-lg border p-1.5"><History size={14}/></button><button className="p-1.5"><MoreHorizontal size={15}/></button></div></td>
        </tr>)}</tbody></table></div>
    </section> : <section>
      <div className="mb-4 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-xs leading-5 text-primary-800">此处仅维护预警规则。规则触发后的预警消息会统一进入页面右上角的通知中心。</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alerts.map(alert => <article key={alert.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors ${alert.enabled ? 'border-neutral-200' : 'border-neutral-100 opacity-65'}`}>
          <div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl ${alert.level === '高' ? 'bg-danger-50 text-danger-600' : alert.level === '中' ? 'bg-warning-50 text-warning-600' : 'bg-primary-50 text-primary-600'}`}><BellRing size={18}/></div><Switch disabled={!canManage} checked={alert.enabled} onChange={enabled => updateAlertRule(alert.id, { enabled })} label={`${alert.enabled ? '停用' : '启用'}${alert.title}`}/></div>
          <div className="mt-4 flex items-center gap-2"><h3 className="text-sm font-bold text-neutral-900">{alert.title}</h3><span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">{alert.level}风险</span></div>
          <div className="mt-4 space-y-3 rounded-xl bg-neutral-50 p-3 text-xs"><div><p className="text-neutral-400">触发条件</p><p className="mt-1 font-medium text-neutral-700">{alert.rule}</p></div><div className="grid grid-cols-2 gap-3"><div><p className="text-neutral-400">监控范围</p><p className="mt-1 text-neutral-700">{alert.scope}</p></div><div><p className="text-neutral-400">通知方式</p><p className="mt-1 text-neutral-700">{alert.channel}</p></div></div></div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4"><span className={`text-xs font-medium ${alert.enabled ? 'text-success-700' : 'text-neutral-400'}`}>{alert.enabled ? '● 规则运行中' : '○ 已停用'}</span>{canManage&&<button onClick={() => { setEditingRule(alert); setModal('rule') }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"><Settings2 size={13}/>编辑</button>}</div>
        </article>)}
      </div>
    </section>}

    {notice && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-xl">{notice}</div>}
    {historyTask && <div className="fixed inset-0 z-[2000] flex justify-end bg-neutral-950/35" onMouseDown={()=>setHistoryTask(null)}><aside onMouseDown={e=>e.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white p-5"><div><h3 className="font-bold">{historyTask.name}</h3><p className="mt-1 text-xs text-neutral-500">运行记录与执行步骤</p></div><button onClick={()=>setHistoryTask(null)}><X size={18}/></button></div><div className="space-y-4 p-5">{taskRuns.filter(run=>run.taskId===historyTask.id).map(run=><article key={run.id} className="rounded-xl border p-4"><div className="flex items-center justify-between"><span className={`inline-flex items-center gap-1 text-xs font-semibold ${run.status==='成功'?'text-success-700':'text-danger-700'}`}>{run.status==='成功'?<CheckCircle2 size={14}/>:<AlertCircle size={14}/>} {run.status}</span><span className="text-xs text-neutral-400">{run.time} · {run.duration}</span></div><div className="mt-3 rounded-lg bg-neutral-50 p-3 text-xs"><p><span className="text-neutral-400">输入：</span>{run.input}</p><p className="mt-2"><span className="text-neutral-400">结果：</span>{run.result}</p></div><ol className="mt-3 space-y-2">{run.steps.map((step,index)=><li key={step} className="flex gap-2 text-xs text-neutral-600"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neutral-100 text-[10px]">{index+1}</span>{step}</li>)}</ol>{run.status==='失败'&&<button onClick={()=>runTask(historyTask.id)} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white"><RotateCcw size={13}/>重试本次任务</button>}</article>)}{taskRuns.filter(run=>run.taskId===historyTask.id).length===0&&<p className="py-16 text-center text-sm text-neutral-400">暂无运行记录</p>}</div></aside></div>}
    {modal && <div className="fixed inset-0 z-[9998] grid place-items-center overflow-y-auto bg-neutral-950/40 p-4" onMouseDown={() => setModal(null)}><form onSubmit={modal === 'task' ? addTask : addRule} onMouseDown={e=>e.stopPropagation()} className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex justify-between border-b p-5"><div><h3 className="font-bold">{modal === 'task' ? '新建定时任务' : editingRule ? '编辑预警规则' : '新建预警规则'}</h3><p className="mt-1 text-xs text-neutral-500">{modal === 'task' ? '按计划自动触发品牌 Skill' : '检测核心指标并通知相关成员'}</p></div><button type="button" onClick={()=>{setModal(null);setEditingRule(null)}}><X size={18}/></button></div>
      <div className="space-y-4 overflow-y-auto p-5">
        <label className="block text-sm">名称<input required name="name" defaultValue={editingRule?.title || ''} className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label>
        {modal === 'task' ? <><label className="block text-sm">关联 Skill<select name="skill" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>账户异常诊断</option><option>素材疲劳识别</option><option>经营报告生成</option></select></label><label className="block text-sm">执行频率<select name="schedule" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>每天 09:00</option><option>每周一 10:00</option><option>每月 1 日 08:30</option></select></label></> : <><label className="block text-sm">风险级别<select name="level" defaultValue={editingRule?.level || '高'} className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>高</option><option>中</option><option>低</option></select></label><label className="block text-sm">触发条件<input required name="rule" defaultValue={editingRule?.rule || ''} placeholder="例如：ROAS < 1.8，持续 2 小时" className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label><label className="block text-sm">监控范围<input name="scope" defaultValue={editingRule?.scope || '全部广告账户'} className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label><label className="block text-sm">通知方式<select name="channel" defaultValue={editingRule?.channel || '站内 + 邮件'} className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>站内 + 邮件</option><option>站内通知</option><option>邮件</option></select></label></>}
        <label className="block text-sm">通知成员<input defaultValue="品牌所有者、管理员" className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label>
      </div><div className="flex justify-end gap-2 border-t p-4"><button type="button" onClick={()=>{setModal(null);setEditingRule(null)}} className="rounded-lg border px-4 py-2 text-sm">取消</button><button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">{editingRule ? '保存修改' : '保存并启用'}</button></div>
    </form></div>}
  </div>
}

export default TasksAlertsPage
