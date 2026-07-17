import { Activity, Bot, CheckCircle2, Clock3, FileDown, MessageSquareText, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLunaStore from '@stores/lunaStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'
import TodayWorkQueue from './TodayWorkQueue'
import LunaCommandCenter from './LunaCommandCenter'
import LunaDecisionWorkspace from './LunaDecisionWorkspace'

const ActivityWorkspace = () => {
  const [tab, setTab] = useState('recent')
  const chatHistory = useLunaStore((state) => state.chatHistory)
  const activity = useMarketingOpsStore((state) => state.activityLog)
  const deliverables = useMarketingOpsStore((state) => state.deliverables)
  const tabs = [
    ['recent', '最近会话', chatHistory.length],
    ['activity', '操作轨迹', activity.filter((item) => item.actor === 'Luna').length],
    ['deliverables', '交付物', deliverables.length],
  ]

  return (
    <section className="workspace-section">
      <header className="workspace-section-header">
        <div>
          <h2 className="text-sm font-semibold text-neutral-950">历史与交付</h2>
          <p className="mt-1 text-xs text-neutral-500">查看 Luna 的工作记录，以及已经生成的报告与文件。</p>
        </div>
        <div className="operational-tabs max-w-full overflow-x-auto">
          {tabs.map(([id, label, count]) => (
            <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap px-3 text-xs font-semibold ${tab === id ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'}`}>
              {label}<span className="ml-1.5 text-neutral-400">{count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="divide-y divide-neutral-200">
        {tab === 'recent' && chatHistory.slice(-5).reverse().map((item) => (
          <article key={item.id} className="flex gap-3 px-5 py-4 hover:bg-neutral-50">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.role === 'luna' ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-600'}`}>
              {item.role === 'luna' ? <Bot size={15} /> : <MessageSquareText size={15} />}
            </span>
            <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm text-neutral-700">{item.text}</p><p className="mt-1 text-xs text-neutral-400">{item.timestamp}</p></div>
          </article>
        ))}
        {tab === 'activity' && activity.filter((item) => item.actor === 'Luna').slice(0, 6).map((item) => (
          <article key={item.id} className="flex gap-3 px-5 py-4 hover:bg-neutral-50">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700"><Sparkles size={14} /></span>
            <div><p className="text-sm font-medium text-neutral-800">{item.action}</p><p className="mt-1 text-xs text-neutral-500">{item.object}</p><p className="mt-1 text-xs text-neutral-400">{item.time} · {item.module}</p></div>
          </article>
        ))}
        {tab === 'deliverables' && deliverables.map((item) => (
          <article key={item.id} className="flex items-center gap-3 px-5 py-4 hover:bg-neutral-50">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-700"><FileDown size={16} /></span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-neutral-900">{item.name}</p><p className="mt-1 text-xs text-neutral-400">{item.type} · {item.generatedBy} · {item.time}</p></div>
            <button className="h-9 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">模拟下载</button>
          </article>
        ))}
        {((tab === 'recent' && chatHistory.length === 0) || (tab === 'deliverables' && deliverables.length === 0)) && (
          <p className="py-12 text-center text-sm text-neutral-400">暂无记录</p>
        )}
      </div>
    </section>
  )
}

const LunaWorkspacePage = () => {
  const navigate = useNavigate()
  const openChat = useLunaStore((state) => state.openChat)
  const brand = useBrandStore((state) => state.selectedBrand)
  const role = useBrandStore((state) => state.getCurrentRole)()
  const switchRole = useBrandStore((state) => state.setDemoRole)
  const user = useBrandStore((state) => state.currentUser)
  const notifications = useMarketingOpsStore((state) => state.notifications)
  const actions = useMarketingOpsStore((state) => state.actions)
  const tasks = useMarketingOpsStore((state) => state.tasks)
  const isManager = ['owner', 'admin'].includes(role)
  const stats = [
    { label: '需要判断', value: notifications.filter((item) => !item.read || item.status === '待处理').length, icon: Activity, tone: 'text-danger-600' },
    { label: '等待执行', value: actions.filter((item) => item.status === '待执行').length, icon: CheckCircle2, tone: 'text-primary-600' },
    { label: '观察验证', value: actions.filter((item) => item.status === '验证中').length, icon: Clock3, tone: 'text-warning-600' },
    { label: '自动运行', value: tasks.filter((item) => item.enabled).length, icon: Sparkles, tone: 'text-success-600' },
  ]

  return (
    <div className="workspace-page space-y-4">
      <section className="workspace-section">
        <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="workspace-kicker">{brand} · {isManager ? '品牌治理视角' : '优化师工作视角'}</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-950">今天，从最重要的工作开始</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Luna 已按风险、到期时间和影响范围整理工作；复杂判断在这里确认，具体执行进入对应业务模块。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1" aria-label="演示身份">
              {[['brand_admin', '管理员'], ['optimizer', '优化师']].map(([id, label]) => {
                const active = (id === 'brand_admin' && role === 'admin') || (id === 'optimizer' && role === 'member')
                return <button key={id} onClick={() => switchRole(id)} className={`h-8 rounded-md px-3 text-xs font-semibold ${active ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'}`}>{label}</button>
              })}
              {user.platformRole === 'platform_admin' && <button onClick={() => navigate('/admin/capabilities')} className="h-8 rounded-md px-3 text-xs font-semibold text-neutral-500 hover:text-primary-700">平台后台</button>}
            </div>
            <button onClick={openChat} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700"><MessageSquareText size={16} />询问 Luna</button>
          </div>
        </div>
        <div className="grid border-t border-neutral-200 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }, index) => (
            <div key={label} className={`flex items-center gap-3 px-5 py-4 ${index ? 'border-t border-neutral-200 sm:border-l sm:border-t-0' : ''}`}>
              <Icon size={17} className={tone} /><div><p className="text-xl font-semibold tabular-nums text-neutral-950">{value}</p><p className="text-xs text-neutral-500">{label}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,.9fr)] xl:items-start">
        <TodayWorkQueue />
        <div id="luna-decision"><LunaDecisionWorkspace /></div>
      </div>
      <LunaCommandCenter />
      <ActivityWorkspace />
    </div>
  )
}

export default LunaWorkspacePage
