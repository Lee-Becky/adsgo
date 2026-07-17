import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, Check, Database, LockKeyhole, PenLine, Plus, Search, Settings2, X } from 'lucide-react'
import useBrandStore from '@stores/brandStore'
import KnowledgeIntelligencePanel from './KnowledgeIntelligencePanel'

const EMPTY_FORM = { title: '', summary: '', updateFrequency: '实时更新', maintainer: 'Luna + 优化师', status: 'active' }
const LEVEL_STYLE = {
  L1: 'border-info-200 bg-info-50 text-info-700',
  L2: 'border-primary-200 bg-primary-50 text-primary-700',
  L3: 'border-warning-200 bg-warning-50 text-warning-700',
  L4: 'border-luna-border bg-luna-bg text-luna-violet',
}

const KnowledgeModal = ({ item, industryKnowledge, onClose, onSave, onImport }) => {
  const [mode, setMode] = useState(item ? 'custom' : 'custom')
  const [form, setForm] = useState(item ? { ...item } : EMPTY_FORM)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const library = useMemo(() => industryKnowledge.filter((entry) => entry.status === 'published' && `${entry.title} ${entry.summary} ${entry.industry}`.toLowerCase().includes(query.trim().toLowerCase())), [industryKnowledge, query])
  const submit = (event) => {
    event.preventDefault()
    if (mode === 'library') {
      if (!selected.length) return setError('请至少选择一条公共知识')
      onImport(industryKnowledge.filter((entry) => selected.includes(entry.id)))
      return
    }
    if (!form.title.trim() || !form.summary.trim()) return setError('请填写知识名称和内容摘要')
    onSave({ ...form, title: form.title.trim(), summary: form.summary.trim() })
  }
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink-900/55 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="flex max-h-[min(760px,92vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={item ? '编辑品牌知识' : '添加品牌知识'}>
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-luna-violet">L4 品牌私有</p><h2 className="mt-1 font-heading text-lg font-semibold text-neutral-900">{item ? '编辑知识' : '添加知识'}</h2></div><button type="button" onClick={onClose} aria-label="关闭" className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><X size={18} /></button></header>
        {!item && <div className="grid grid-cols-2 gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5"><button type="button" onClick={() => setMode('custom')} className={`focus-ring min-h-11 cursor-pointer rounded-lg text-sm font-semibold ${mode === 'custom' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}>自定义创建</button><button type="button" onClick={() => setMode('library')} className={`focus-ring min-h-11 cursor-pointer rounded-lg text-sm font-semibold ${mode === 'library' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}>从知识库中选择</button></div>}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {mode === 'custom' ? <div className="space-y-4"><div><label htmlFor="knowledge-title" className="mb-1.5 block text-xs font-semibold text-neutral-700">知识名称</label><input id="knowledge-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="enhanced-input min-h-11" placeholder="例如：品牌预算红线" autoFocus maxLength={50} /></div><div><label htmlFor="knowledge-summary" className="mb-1.5 block text-xs font-semibold text-neutral-700">内容摘要</label><textarea id="knowledge-summary" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} className="enhanced-input min-h-32 resize-none" placeholder="描述需要 Luna 长期记住的品牌知识" maxLength={300} /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="knowledge-frequency" className="mb-1.5 block text-xs font-semibold text-neutral-700">更新频率</label><select id="knowledge-frequency" value={form.updateFrequency} onChange={(event) => setForm({ ...form, updateFrequency: event.target.value })} className="enhanced-select min-h-11"><option>实时更新</option><option>对话中积累</option><option>每周更新</option><option>月度更新</option></select></div><div><label htmlFor="knowledge-maintainer" className="mb-1.5 block text-xs font-semibold text-neutral-700">维护者</label><input id="knowledge-maintainer" value={form.maintainer} onChange={(event) => setForm({ ...form, maintainer: event.target.value })} className="enhanced-input min-h-11" /></div></div></div> : <div><div className="relative mb-4"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="enhanced-input min-h-11 pl-9" aria-label="搜索公共知识库" placeholder="搜索知识、行业或层级" /></div><div className="space-y-2">{library.map((entry) => { const checked = selected.includes(entry.id); return <button key={entry.id} type="button" onClick={() => setSelected((current) => checked ? current.filter((id) => id !== entry.id) : [...current, entry.id])} className={`focus-ring flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left ${checked ? 'border-luna-violet bg-luna-bg/60' : 'border-neutral-200 hover:bg-neutral-50'}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked ? 'bg-luna-violet text-white' : 'bg-neutral-100 text-neutral-500'}`}>{checked ? <Check size={16} /> : <BookOpen size={16} />}</span><span><span className="flex flex-wrap items-center gap-2"><strong className="text-sm text-neutral-900">{entry.title}</strong><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_STYLE[entry.level]}`}>{entry.level}</span><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">{entry.industry}</span></span><span className="mt-1 block text-xs leading-relaxed text-neutral-500">{entry.summary}</span></span></button>})}</div>{library.length === 0 && <p className="py-12 text-center text-sm text-neutral-500">没有找到匹配的公共知识</p>}</div>}
          {error && <p className="mt-4 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700">{error}</p>}
        </div>
        <footer className="flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-6 py-4"><button type="button" onClick={onClose} className="focus-ring min-h-11 cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700">取消</button><button type="submit" className="focus-ring min-h-11 cursor-pointer rounded-xl bg-luna-violet px-5 text-sm font-semibold text-white">{mode === 'library' ? `添加${selected.length ? ` (${selected.length})` : ''}` : '保存知识'}</button></footer>
      </form>
    </div>
  )
}

const KnowledgePanelContent = () => {
  const selectedBrand = useBrandStore((state) => state.selectedBrand)
  const currentUser = useBrandStore((state) => state.currentUser)
  const items = useBrandStore((state) => state.brandKnowledge[selectedBrand] || [])
  const industryKnowledge = useBrandStore((state) => state.industryKnowledge)
  const addItem = useBrandStore((state) => state.addBrandKnowledge)
  const updateItem = useBrandStore((state) => state.updateBrandKnowledge)
  const navigate = useNavigate()
  const { brandId } = useParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [notice, setNotice] = useState('')
  const close = () => { setModalOpen(false); setEditing(null) }
  const save = (form) => { editing ? updateItem(editing.id, form) : addItem(form); setNotice(editing ? '知识已更新' : '知识已添加'); close() }
  const importItems = (selected) => { selected.forEach((item) => addItem({ title: item.title, summary: item.summary, updateFrequency: item.updateFrequency, maintainer: '品牌管理员', status: 'active', sourceLevel: item.level, sourceKnowledgeId: item.id })); setNotice(`已添加 ${selected.length} 条公共知识`); close() }
  return <div className="space-y-6"><section className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white"><Database size={20} /></span><div><p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">{selectedBrand}</p><h2 className="mt-1 font-heading text-lg font-semibold text-neutral-900">品牌知识库</h2><p className="mt-1 text-sm text-neutral-500">管理 L4 品牌私有知识，并从 L1–L3 公共知识库选择内容。</p></div></div><div className="flex flex-wrap gap-2">{currentUser.platformRole === 'platform_admin' && <button onClick={() => navigate(`/workspace/${encodeURIComponent(brandId || 'default')}/settings/skill-admin?tab=knowledge`)} className="focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"><Settings2 size={17} />管理后台</button>}<span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-200 px-3 text-xs font-semibold text-neutral-600"><LockKeyhole size={13} />L4 品牌私有</span><button onClick={() => setModalOpen(true)} className="focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700"><Plus size={17} />添加知识</button></div></div></section>{notice && <div className="flex items-center justify-between rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-xs font-medium text-success-700"><span className="flex items-center gap-2"><Check size={14} />{notice}</span><button onClick={() => setNotice('')} className="focus-ring cursor-pointer rounded p-1" aria-label="关闭提示"><X size={14} /></button></div>}<div className="grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700"><BookOpen size={18} /></span><button onClick={() => { setEditing(item); setModalOpen(true) }} aria-label={`编辑${item.title}`} className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><PenLine size={16} /></button></div><div className="mt-3 flex flex-wrap items-center gap-2"><h3 className="font-heading text-sm font-semibold text-neutral-900">{item.title}</h3><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_STYLE.L4}`}>L4 品牌私有</span>{item.sourceLevel && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">源自 {item.sourceLevel}</span>}</div><p className="mt-2 text-xs leading-relaxed text-neutral-500">{item.summary}</p><div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 text-[10px] text-neutral-500"><span>{item.updateFrequency}</span><span>·</span><span>{item.maintainer}</span></div></article>)}</div>{items.length === 0 && <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center"><BookOpen size={26} className="mx-auto text-neutral-300" /><p className="mt-3 text-sm font-semibold text-neutral-700">暂无品牌知识</p><button onClick={() => setModalOpen(true)} className="focus-ring mt-4 min-h-11 cursor-pointer rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white">添加知识</button></div>}{modalOpen && <KnowledgeModal item={editing} industryKnowledge={industryKnowledge} onClose={close} onSave={save} onImport={importItems} />}</div>
}

const KnowledgePanel = () => (
  <div className="space-y-6">
    <KnowledgePanelContent />
    <KnowledgeIntelligencePanel />
  </div>
)

export default KnowledgePanel
