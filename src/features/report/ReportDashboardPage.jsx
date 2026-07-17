import { useState } from 'react'
import { CalendarDays, CheckCircle2, Copy, Download, Eye, FileBarChart, Mail, MoreHorizontal, Play, Plus, RefreshCw, Send, Star, X } from 'lucide-react'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import ReportPreferencePanel from './ReportPreferencePanel'

const ReportDashboardContent = () => {
  const [tab, setTab] = useState('templates')
  const templates = useMarketingOpsStore((state) => state.reportTemplates)
  const addReportTemplate = useMarketingOpsStore((state) => state.addReportTemplate)
  const updateReportTemplate = useMarketingOpsStore((state) => state.updateReportTemplate)
  const addNotification = useMarketingOpsStore((state) => state.addNotification)
  const history = useMarketingOpsStore((state) => state.reportHistory)
  const addReportHistory = useMarketingOpsStore((state) => state.addReportHistory)
  const rateReport = useMarketingOpsStore((state) => state.rateReport)
  const createDeliverable = useMarketingOpsStore((state) => state.createDeliverable)
  const [modal, setModal] = useState(null)
  const [generating, setGenerating] = useState(null)
  const [notice, setNotice] = useState('')
  const flash = message => { setNotice(message); setTimeout(()=>setNotice(''),1800) }
  const generate = template => {
    setGenerating(template.id)
    setTimeout(() => {
      addReportHistory({ name: `${template.name} · 2026/07/16`, template: template.name, snapshot: `${template.source} · 生成时快照${template.viewSnapshots?.length ? ` · 含 ${template.viewSnapshots.length} 个视图区块` : ''}` })
      createDeliverable({ name: `${template.name} · 2026-07-16.pdf`, type: '报告', source: template.name, generatedBy: 'Luna' })
      addNotification({ title: '报告生成完成', detail: `${template.name} 已生成，可预览或发送` })
      setGenerating(null); setTab('history'); flash('报告已生成，可预览或发送')
    }, 900)
  }
  const addTemplate = e => {
    e.preventDefault(); const data = new FormData(e.currentTarget)
    addReportTemplate({name:data.get('name'),type:data.get('type'),source:data.get('source'),schedule:data.get('schedule'),recipients:data.get('recipients') || '未配置'})
    setModal(null); flash('报告模板已创建')
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-lg font-bold">报告中心</h2><p className="mt-1 text-sm text-neutral-500">基于数据视图生成日报、周报与月报，支持定时发送</p></div>
      <button onClick={()=>setModal('create')} className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={15}/>新建报告模板</button>
    </div>
    <div className="flex w-fit rounded-xl border bg-white p-1 shadow-sm">{[['templates','报告模板'],['history','生成历史']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab===id?'bg-neutral-900 text-white':'text-neutral-500'}`}>{label}{id==='history' && ` · ${history.length}`}</button>)}</div>

    {tab === 'templates' ? <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{templates.map(template=><article key={template.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600"><FileBarChart size={19}/></div><button><MoreHorizontal size={18} className="text-neutral-400"/></button></div>
      <div className="mt-4 flex items-center gap-2"><h3 className="font-bold">{template.name}</h3><span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px]">{template.type}</span></div>
      <p className="mt-2 text-xs text-neutral-500">数据来源：{template.source}{template.viewSnapshots?.length ? ` · ${template.viewSnapshots.length} 个视图快照` : ''}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-3 text-xs"><div><p className="text-neutral-400">生成计划</p><p className="mt-1 font-medium">{template.schedule}</p></div><div><p className="text-neutral-400">接收人</p><p className="mt-1 font-medium">{template.recipients}</p></div></div>
      <div className="mt-4 flex items-center justify-between"><button onClick={()=>updateReportTemplate(template.id,{enabled:!template.enabled})} className={`text-xs font-medium ${template.enabled?'text-success-700':'text-neutral-400'}`}>{template.enabled?'● 定时发送已启用':'○ 定时发送未启用'}</button><span className="text-[11px] text-neutral-400">{template.updated}</span></div>
      <div className="mt-4 flex gap-2 border-t pt-4"><button onClick={()=>setModal(template)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs"><Eye size={14}/>预览</button><button onClick={()=>generate(template)} disabled={generating===template.id} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white">{generating===template.id?<RefreshCw size={14} className="animate-spin"/>:<Play size={14}/>}立即生成</button></div>
    </article>)}</div> : <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-neutral-50 text-xs text-neutral-500"><tr>{['报告','模板','生成时间','状态','质量反馈','操作'].map(h=><th key={h} className="px-5 py-3 text-left font-medium">{h}</th>)}</tr></thead><tbody>{history.map(item=><tr key={item.id} className="border-t">
        <td className="px-5 py-4 font-semibold">{item.name}<p className="mt-1 text-[11px] font-normal text-neutral-400">{item.snapshot}</p></td><td className="px-5 py-4 text-neutral-600">{item.template}</td><td className="px-5 py-4 text-neutral-500">{item.time}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs text-success-700"><CheckCircle2 size={13}/>{item.status}</span></td>
        <td className="px-5 py-4"><div className="flex">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>rateReport(item.id,n)}><Star size={14} className={n<=item.rating?'fill-warning-400 text-warning-400':'text-neutral-200'}/></button>)}</div></td>
        <td className="px-5 py-4"><div className="flex gap-1"><button onClick={()=>setModal(item)} className="rounded-lg border p-2"><Eye size={14}/></button><button onClick={()=>flash('测试邮件已发送（演示）')} className="rounded-lg border p-2"><Send size={14}/></button><button onClick={()=>{createDeliverable({name:`${item.name}.pdf`,type:'报告',source:item.template});flash('报告已加入 Luna 交付物')}} className="rounded-lg border p-2"><Download size={14}/></button></div></td>
      </tr>)}</tbody></table></div>
    </section>}

    {notice && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-xl">{notice}</div>}
    {modal === 'create' && <div className="fixed inset-0 z-[9998] grid place-items-center overflow-y-auto bg-neutral-950/40 p-4" onMouseDown={()=>setModal(null)}><form onSubmit={addTemplate} onMouseDown={e=>e.stopPropagation()} className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex justify-between border-b p-5"><div><h3 className="font-bold">新建报告模板</h3><p className="mt-1 text-xs text-neutral-500">选择报告结构、数据来源和发送计划</p></div><button type="button" onClick={()=>setModal(null)}><X size={18}/></button></div>
      <div className="grid overflow-y-auto gap-4 p-5 sm:grid-cols-2"><label className="sm:col-span-2 text-sm">模板名称<input required name="name" className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label><label className="text-sm">报告类型<select name="type" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>日报</option><option>周报</option><option>月报</option></select></label><label className="text-sm">数据来源<select name="source" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>渠道经营总览</option><option>Campaign 效率拆解</option><option>归因数据集</option></select></label><label className="text-sm">生成计划<select name="schedule" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>每天 09:30</option><option>每周一 10:00</option><option>每月 1 日</option></select></label><label className="text-sm">接收人<input name="recipients" placeholder="客户邮箱或成员组" className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label></div>
      <div className="flex justify-end gap-2 border-t p-4"><button type="button" onClick={()=>setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button><button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">创建模板</button></div>
    </form></div>}
    {modal && modal !== 'create' && <div className="fixed inset-0 z-[9998] grid place-items-center bg-neutral-950/40 p-4" onMouseDown={()=>setModal(null)}><div onMouseDown={e=>e.stopPropagation()} className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-auto rounded-2xl bg-neutral-100 shadow-2xl">
      <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4"><div><h3 className="font-bold">{modal.name}</h3><p className="text-xs text-neutral-500">客户可分享版本 · 自动生成预览</p></div><div className="flex gap-2"><button onClick={()=>flash('分享链接已复制（演示）')} className="rounded-lg border p-2"><Copy size={15}/></button><button onClick={()=>flash('邮件已发送（演示）')} className="rounded-lg border p-2"><Mail size={15}/></button><button onClick={()=>setModal(null)} className="p-2"><X size={18}/></button></div></div>
      <div className="m-5 space-y-5 rounded-xl bg-white p-7"><div className="flex justify-between border-b pb-5"><div><p className="text-xs text-neutral-400">LumaFit · 美国市场</p><h2 className="mt-2 text-2xl font-bold">投放经营报告</h2></div><div className="text-right text-xs text-neutral-500"><CalendarDays size={16} className="ml-auto mb-2"/>2026/07/16</div></div>
        <div className="grid grid-cols-4 gap-3">{[['花费','$9,846'],['收入','$20,480'],['ROAS','2.08x'],['转化','296']].map(([l,v])=><div key={l} className="rounded-lg bg-neutral-50 p-3"><p className="text-xs text-neutral-400">{l}</p><p className="mt-1 text-lg font-bold">{v}</p></div>)}</div>
        <section><h3 className="font-bold">核心结论</h3><p className="mt-2 text-sm leading-7 text-neutral-600">整体收入环比增长 9.8%，Meta 德国市场贡献主要增量；TikTok 英国市场 ROAS 低于目标，建议收紧预算并替换连续三日衰退的素材。</p></section>
        <section><h3 className="font-bold">下一步动作</h3><div className="mt-3 space-y-2">{['将 TikTok 英国市场日预算下调 15%','保留 Meta 德国高回报广告组','启动 2 组 UGC 素材换新测试'].map((x,i)=><div key={x} className="flex gap-3 rounded-lg bg-neutral-50 p-3 text-sm"><span className="font-bold text-primary-600">0{i+1}</span>{x}</div>)}</div></section>
      </div>
    </div></div>}
  </div>
}

const ReportDashboardPage = () => <div className="space-y-5"><ReportDashboardContent /><ReportPreferencePanel /></div>
export default ReportDashboardPage
