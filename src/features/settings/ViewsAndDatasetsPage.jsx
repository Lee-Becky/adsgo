import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, BarChart3, Calculator, CalendarDays, ChevronDown, Copy, Database, Download, FilePlus2, Filter, LayoutGrid, Plus, Search, Settings2, Trash2, X } from 'lucide-react'
import { DatasetsPage } from '@components/brand/datasets'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'
import ViewUsagePanel from './ViewUsagePanel'

const rows = [
  ['Meta', '美国', '$128,420', '$286,210', '2.23x', '+12.4%'],
  ['Google', '美国', '$84,650', '$167,440', '1.98x', '+5.7%'],
  ['TikTok', '英国', '$42,180', '$72,960', '1.73x', '-8.2%'],
  ['Meta', '德国', '$36,750', '$81,220', '2.21x', '+16.1%'],
]

const ViewsAndDatasetsContent = ({ initialTab = 'views', analysisMode = false }) => {
  const [tab, setTab] = useState(initialTab)
  const canManage = useBrandStore(state => state.canManageBrand)()
  const views = useMarketingOpsStore((state) => state.views)
  const addView = useMarketingOpsStore((state) => state.addView)
  const updateView = useMarketingOpsStore((state) => state.updateView)
  const duplicateView = useMarketingOpsStore((state) => state.duplicateView)
  const removeView = useMarketingOpsStore((state) => state.removeView)
  const reportTemplates = useMarketingOpsStore((state) => state.reportTemplates)
  const addViewSnapshotToReport = useMarketingOpsStore((state) => state.addViewSnapshotToReport)
  const createDeliverable = useMarketingOpsStore((state) => state.createDeliverable)
  const [activeId, setActiveId] = useState(1)
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [advancedModal, setAdvancedModal] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [notice, setNotice] = useState('')
  const active = views.find(v => v.id === activeId) || views[0]
  const filtered = useMemo(() => views.filter(v => v.name.toLowerCase().includes(query.toLowerCase())), [views, query])

  const flash = message => {
    setNotice(message)
    setTimeout(() => setNotice(''), 1800)
  }

  const createView = event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next = {
      id: Date.now(),
      name: data.get('name') || '未命名视图',
      source: data.get('source'),
      dimensions: [data.get('dimension'), '市场'],
      metrics: ['花费', '收入', data.get('metric')],
      shared: false,
    }
    addView(next)
    setActiveId(next.id)
    setModal(false)
    flash('视图已保存')
  }

  return (
    <div className="space-y-5">
      {!analysisMode && <div className="flex w-fit rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
        {[['views', '多维视图', LayoutGrid], ['datasets', '数据集', Database]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === id ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>}

      {tab === 'datasets' ? <DatasetsPage /> : (
        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-neutral-200 bg-neutral-50/70 p-4 lg:border-b-0 lg:border-r">
            <button onClick={() => setModal(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"><Plus size={15}/>{canManage ? '新建共享视图' : '新建个人视图'}</button>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={15}/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索已保存视图" className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-neutral-400"/>
            </div>
            <p className="mb-2 mt-5 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">已保存视图 · {views.length}</p>
            <div className="space-y-1">
              {filtered.map(view => (
                <button key={view.id} onClick={() => setActiveId(view.id)} className={`w-full rounded-lg px-3 py-3 text-left ${activeId === view.id ? 'bg-white shadow-sm ring-1 ring-neutral-200' : 'hover:bg-white/70'}`}>
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold text-neutral-800">{view.name}</span>{view.shared && <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-600">共享</span>}</div>
                  <p className="mt-1 text-xs text-neutral-400">{view.source}</p>
                </button>
              ))}
            </div>
          </aside>

          {active && <main className="min-w-0">
            <header className="flex flex-col gap-4 border-b border-neutral-200 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div><h2 className="text-lg font-bold text-neutral-900">{active.name}</h2><p className="mt-1 text-xs text-neutral-500">{active.source} · 更新于 5 分钟前</p></div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { duplicateView(active.id); flash('已复制为新视图') }} className="rounded-lg border border-neutral-200 p-2 text-neutral-500 hover:bg-neutral-50"><Copy size={16}/></button>
                {canManage && <button onClick={() => { removeView(active.id); setActiveId(views.find(x => x.id !== active.id)?.id) }} className="rounded-lg border border-neutral-200 p-2 text-neutral-500 hover:text-danger-600"><Trash2 size={16}/></button>}
                <button onClick={() => setReportModal(true)} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"><FilePlus2 size={15}/>加入报告</button>
                <button onClick={() => {createDeliverable({name:`${active.name} · 2026-07-16.csv`,type:'数据导出',source:active.name});flash('CSV 已加入 Luna 交付物')}} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"><Download size={15}/>导出</button>
                {(canManage || !active.shared) && <button onClick={() => setAdvancedModal(true)} className="flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white"><Settings2 size={15}/>高级配置</button>}
              </div>
            </header>
            <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-3">
              <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs"><CalendarDays size={14}/>近 30 天<ChevronDown size={13}/></button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs">对比：上一周期<ChevronDown size={13}/></button>
              <button onClick={() => flash('筛选器已添加')} className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs text-neutral-500"><Filter size={14}/>添加筛选</button>
              {active.dimensions.map(item => <span key={item} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">{item}</span>)}
              {active.customMetric && <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-1 text-xs text-warning-700"><Calculator size={12}/>{active.customMetric.name}</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 xl:grid-cols-4">
              {[['总花费','$291,999','+6.2%'],['收入','$607,830','+9.8%'],['ROAS','2.08x','+3.4%'],['转化','8,942','-1.7%']].map(([label,value,delta]) => (
                <div key={label} className="rounded-xl border border-neutral-200 p-4"><p className="text-xs text-neutral-500">{label}</p><p className="mt-2 text-xl font-bold tabular-nums">{value}</p><p className={`mt-1 text-xs ${delta.startsWith('-') ? 'text-danger-600' : 'text-success-600'}`}>{delta} 较上期</p></div>
              ))}
            </div>
            <div className="mx-5 mb-5 overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[720px] text-sm"><thead className="bg-neutral-50 text-xs text-neutral-500"><tr>{['渠道','市场','花费','收入','ROAS','环比'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr></thead>
                <tbody>{rows.map((row,i) => <tr key={i} className="border-t border-neutral-100">{row.map((cell,j) => <td key={j} className={`px-4 py-3 ${j > 1 ? 'tabular-nums' : 'font-medium'} ${active.conditionalFormat && j === 4 ? (parseFloat(cell) < 1.8 ? 'bg-danger-50 font-semibold text-danger-700' : 'bg-success-50 text-success-700') : ''}`}>{cell}</td>)}</tr>)}</tbody>
                {active.subtotals && <tfoot className="border-t-2 border-neutral-200 bg-neutral-50 font-semibold"><tr>{['层级小计','全部市场','$291,999','$607,830','2.08x','+7.9%'].map((c,i) => <td key={i} className="px-4 py-3">{c}</td>)}</tr></tfoot>}
              </table>
            </div>
          </main>}
        </div>
      )}

      {notice && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-xl">{notice}</div>}
      {modal && <div className="fixed inset-0 z-[9998] grid place-items-center overflow-y-auto bg-neutral-950/40 p-4" onMouseDown={() => setModal(false)}>
        <form onSubmit={createView} onMouseDown={e => e.stopPropagation()} className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-5"><div><h3 className="font-bold">配置多维视图</h3><p className="mt-1 text-xs text-neutral-500">选择数据源、维度和核心指标</p></div><button type="button" onClick={() => setModal(false)}><X size={18}/></button></div>
          <div className="grid overflow-y-auto gap-4 p-5 sm:grid-cols-2">
            <label className="sm:col-span-2 text-sm">视图名称<input name="name" defaultValue={active?.name} className="mt-1.5 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary-500"/></label>
            <label className="text-sm">数据源<select name="source" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>归因数据集</option><option>广告账户数据</option><option>素材数据集</option><option>离线订单数据</option></select></label>
            <label className="text-sm">主维度<select name="dimension" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>渠道</option><option>Campaign</option><option>市场</option><option>素材</option></select></label>
            <label className="text-sm">核心指标<select name="metric" className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>ROAS</option><option>CPA</option><option>CTR</option><option>转化率</option></select></label>
            <label className="text-sm">聚合方式<select className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option>自动</option><option>求和</option><option>平均值</option></select></label>
          </div>
          <div className="flex justify-end gap-2 border-t p-4"><button type="button" onClick={() => setModal(false)} className="rounded-lg border px-4 py-2 text-sm">取消</button><button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">保存视图</button></div>
        </form>
      </div>}
      {advancedModal && <div className="fixed inset-0 z-[2000] grid place-items-center bg-neutral-950/40 p-4" onMouseDown={() => setAdvancedModal(false)}>
        <div onMouseDown={e=>e.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-5"><div><h3 className="font-bold">高级视图配置</h3><p className="mt-1 text-xs text-neutral-500">指标顺序、计算指标与表格呈现</p></div><button onClick={()=>setAdvancedModal(false)}><X size={18}/></button></div>
          <div className="space-y-5 p-5">
            <section><h4 className="text-sm font-semibold">指标排序</h4><div className="mt-2 space-y-2">{active.metrics.map((metric,index)=><div key={metric} className="flex items-center justify-between rounded-lg border px-3 py-2"><span className="text-sm">{index+1}. {metric}</span><div className="flex gap-1"><button disabled={index===0} onClick={()=>{const next=[...active.metrics];[next[index-1],next[index]]=[next[index],next[index-1]];updateView(active.id,{metrics:next})}} className="rounded border p-1.5 disabled:opacity-30"><ArrowUp size={13}/></button><button disabled={index===active.metrics.length-1} onClick={()=>{const next=[...active.metrics];[next[index+1],next[index]]=[next[index],next[index+1]];updateView(active.id,{metrics:next})}} className="rounded border p-1.5 disabled:opacity-30"><ArrowDown size={13}/></button></div></div>)}</div></section>
            <section className="grid gap-3 sm:grid-cols-2"><label className="text-sm">自定义指标名称<input id="custom-metric-name" defaultValue={active.customMetric?.name || ''} placeholder="例如：利润率" className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/></label><label className="text-sm">计算公式<input id="custom-metric-formula" defaultValue={active.customMetric?.formula || ''} placeholder="(收入 - 花费) / 收入" className="mt-1.5 w-full rounded-lg border px-3 py-2.5 font-mono text-xs"/></label></section>
            <div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center justify-between rounded-xl border p-4"><span><strong className="block text-sm">条件格式</strong><span className="text-xs text-neutral-500">自动标记异常与优秀指标</span></span><input type="checkbox" checked={!!active.conditionalFormat} onChange={e=>updateView(active.id,{conditionalFormat:e.target.checked})} className="h-4 w-4 accent-violet-600"/></label><label className="flex cursor-pointer items-center justify-between rounded-xl border p-4"><span><strong className="block text-sm">层级小计</strong><span className="text-xs text-neutral-500">按维度层级显示小计</span></span><input type="checkbox" checked={!!active.subtotals} onChange={e=>updateView(active.id,{subtotals:e.target.checked})} className="h-4 w-4 accent-violet-600"/></label></div>
          </div>
          <div className="flex justify-end gap-2 border-t p-4"><button onClick={()=>setAdvancedModal(false)} className="rounded-lg border px-4 py-2 text-sm">取消</button><button onClick={()=>{const name=document.getElementById('custom-metric-name').value.trim();const formula=document.getElementById('custom-metric-formula').value.trim();updateView(active.id,{customMetric:name&&formula?{name,formula}:null});setAdvancedModal(false);flash('高级配置已保存')}} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">保存配置</button></div>
        </div>
      </div>}
      {reportModal && <div className="fixed inset-0 z-[2000] grid place-items-center bg-neutral-950/40 p-4" onMouseDown={()=>setReportModal(false)}><div onMouseDown={e=>e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><h3 className="font-bold">加入报告</h3><p className="mt-1 text-xs text-neutral-500">以当前配置创建不可变视图快照，不受后续视图修改影响</p></div><button onClick={()=>setReportModal(false)}><X size={18}/></button></div><div className="space-y-2 p-5">{reportTemplates.map(report=><button key={report.id} onClick={()=>{addViewSnapshotToReport(active.id,report.id);setReportModal(false);flash(`已加入「${report.name}」`)}} className="flex w-full items-center justify-between rounded-xl border p-4 text-left hover:border-primary-300 hover:bg-primary-50/40"><div><p className="text-sm font-semibold">{report.name}</p><p className="mt-1 text-xs text-neutral-500">{report.type} · {report.source}</p></div><span className="text-xs text-primary-600">{report.viewSnapshots?.length || 0} 个视图</span></button>)}{reportTemplates.length===0&&<p className="py-8 text-center text-sm text-neutral-400">请先在报告中心创建模板</p>}</div></div></div>}
    </div>
  )
}

const ViewsAndDatasetsPage = (props) => <div className="space-y-5"><ViewsAndDatasetsContent {...props} /><ViewUsagePanel /></div>
export default ViewsAndDatasetsPage
