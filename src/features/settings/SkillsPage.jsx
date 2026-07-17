import { useMemo, useState } from 'react'
import {
  DollarSign, Palette, Users, MessageSquare, FileBarChart, ShieldAlert,
  Sparkles, LockKeyhole, Plus, X, PenLine, Copy, Check, Search, Settings2, BookOpen,
  Workflow, Activity,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import KnowledgePanel from './KnowledgePanel'
import useBrandStore from '@stores/brandStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import SkillCapabilityDetail from './SkillCapabilityDetail'
import EffectiveCapabilityPanel from './EffectiveCapabilityPanel'
import BrandUpgradeNotice from './BrandUpgradeNotice'

const ICONS = {
  budget: DollarSign,
  creative: Palette,
  audience: Users,
  message: MessageSquare,
  report: FileBarChart,
  alert: ShieldAlert,
}

const ICON_OPTIONS = [
  { key: 'budget', label: '预算', icon: DollarSign },
  { key: 'creative', label: '素材', icon: Palette },
  { key: 'audience', label: '受众', icon: Users },
  { key: 'message', label: '沟通', icon: MessageSquare },
  { key: 'report', label: '报告', icon: FileBarChart },
  { key: 'alert', label: '提醒', icon: ShieldAlert },
]

const EMPTY_FORM = { name: '', description: '', iconKey: 'alert', enabled: true }

const SkillModal = ({ selectedBrand, brands, brandSkills, industrySkills, editingSkill, onClose, onSave, onCopy }) => {
  const [mode, setMode] = useState(editingSkill ? 'custom' : 'custom')
  const [form, setForm] = useState(editingSkill ? {
    name: editingSkill.name,
    description: editingSkill.description,
    iconKey: editingSkill.iconKey,
    enabled: editingSkill.enabled,
  } : EMPTY_FORM)
  const [query, setQuery] = useState('')
  const [selectedCopies, setSelectedCopies] = useState([])
  const [error, setError] = useState('')

  const allSourceSkills = useMemo(() => [
    ...industrySkills.filter((skill) => skill.status === 'published').map((skill) => ({ ...skill, libraryType: 'industry', sourceName: skill.industry })),
    { id: 'brand-template-promo', name: '促销期预算保护', description: '为当前品牌配置促销阶段、受保护流量和人工确认条件。', iconKey: 'budget', enabled: true, libraryType: 'brand', sourceName: '品牌个性化模板' },
    { id: 'brand-template-report', name: '客户报告偏好', description: '根据当前品牌客户偏好调整结论顺序、表达方式与报告结构。', iconKey: 'report', enabled: true, libraryType: 'brand', sourceName: '品牌个性化模板' },
  ], [industrySkills])
  const sourceSkills = useMemo(() => allSourceSkills
    .filter((skill) => `${skill.name} ${skill.description} ${skill.sourceName}`.toLowerCase().includes(query.trim().toLowerCase())),
  [allSourceSkills, query])

  const submit = (event) => {
    event.preventDefault()
    if (mode === 'copy') {
      if (!selectedCopies.length) return setError('请至少选择一个需要复制的 Skill')
      onCopy(allSourceSkills.filter((skill) => selectedCopies.includes(`${skill.libraryType}:${skill.sourceName}:${skill.id}`)))
      return
    }
    if (!form.name.trim() || !form.description.trim()) return setError('请填写 Skill 名称和执行说明')
    onSave({ ...form, name: form.name.trim(), description: form.description.trim() })
  }

  const toggleCopy = (skill) => {
    const key = `${skill.libraryType}:${skill.sourceName}:${skill.id}`
    setSelectedCopies((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink-900/55 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="flex max-h-[min(760px,92vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={editingSkill ? '编辑 Skill' : '添加 Skill'}>
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-luna-violet">{selectedBrand}</p><h2 className="mt-1 font-heading text-lg font-semibold text-neutral-900">{editingSkill ? '编辑 Skill' : '添加品牌 Skill'}</h2></div>
          <button type="button" onClick={onClose} aria-label="关闭" className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"><X size={19} /></button>
        </header>

        {!editingSkill && (
          <div className="grid grid-cols-2 gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'custom'} onClick={() => { setMode('custom'); setError('') }} className={`focus-ring flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'custom' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}><PenLine size={16} />自定义创建</button>
            <button type="button" role="tab" aria-selected={mode === 'copy'} onClick={() => { setMode('copy'); setError('') }} className={`focus-ring flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'copy' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}><Copy size={16} />从 Skill 库中选择</button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {mode === 'custom' ? (
            <div className="space-y-5">
              <div><label htmlFor="skill-name" className="mb-1.5 block text-xs font-semibold text-neutral-700">Skill 名称</label><input id="skill-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="enhanced-input min-h-11" placeholder="例如：高消耗广告预警" autoFocus maxLength={40} /><p className="mt-1 text-right text-[10px] text-neutral-400">{form.name.length}/40</p></div>
              <div><label htmlFor="skill-description" className="mb-1.5 block text-xs font-semibold text-neutral-700">执行说明</label><textarea id="skill-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="enhanced-input min-h-28 resize-none" placeholder="描述触发条件、执行时间和期望动作" maxLength={240} /><p className="mt-1 text-right text-[10px] text-neutral-400">{form.description.length}/240</p></div>
              <fieldset><legend className="mb-2 text-xs font-semibold text-neutral-700">图标类型</legend><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{ICON_OPTIONS.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => setForm({ ...form, iconKey: key })} className={`focus-ring flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${form.iconKey === key ? 'border-luna-violet bg-luna-bg text-luna-violet' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'}`} aria-pressed={form.iconKey === key}><Icon size={18} />{label}</button>)}</div></fieldset>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"><span><span className="block text-sm font-semibold text-neutral-800">创建后立即启用</span><span className="mt-0.5 block text-xs text-neutral-500">关闭时仅保存配置，不会触发执行</span></span><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} className="h-4 w-4 accent-violet-600" /></label>
            </div>
          ) : (
            <div>
              <div className="relative mb-4"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><label htmlFor="copy-skill-search" className="sr-only">搜索 Skill 库</label><input id="copy-skill-search" value={query} onChange={(event) => setQuery(event.target.value)} className="enhanced-input min-h-11 pl-9" placeholder="搜索 Skill、行业或品牌" /></div>
              {sourceSkills.length > 0 ? <div className="space-y-2">{sourceSkills.map((skill) => { const key = `${skill.libraryType}:${skill.sourceName}:${skill.id}`; const selected = selectedCopies.includes(key); const Icon = ICONS[skill.iconKey] || ShieldAlert; const isIndustry = skill.libraryType === 'industry'; return <button key={key} type="button" onClick={() => toggleCopy(skill)} className={`focus-ring flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${selected ? 'border-luna-violet bg-luna-bg/60' : 'border-neutral-200 hover:bg-neutral-50'}`}><span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-luna-violet text-white' : 'bg-neutral-100 text-neutral-500'}`}>{selected ? <Check size={17} /> : <Icon size={17} />}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="font-heading text-sm font-semibold text-neutral-900">{skill.name}</span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${isIndustry ? 'border-info-200 bg-info-50 text-info-700' : 'border-luna-border bg-luna-bg text-luna-violet'}`}>{isIndustry ? '行业 Skill' : '品牌个性化 Skill'}</span><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">{skill.sourceName}</span></span><span className="mt-1 block text-xs leading-relaxed text-neutral-500">{skill.description}</span></span></button>})}</div> : <div className="rounded-xl border border-dashed border-neutral-300 px-5 py-12 text-center"><Copy size={24} className="mx-auto text-neutral-300" /><p className="mt-3 text-sm font-semibold text-neutral-700">暂无匹配的 Skill</p><p className="mt-1 text-xs text-neutral-500">Skill 库包含已发布的行业 Skill 与其他品牌个性化 Skill</p></div>}
            </div>
          )}
          {error && <p className="mt-4 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700" role="alert">{error}</p>}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4"><p className="hidden text-[11px] text-neutral-500 sm:block"><LockKeyhole size={12} className="mr-1 inline" />仅所有者与管理员可保存</p><div className="ml-auto flex gap-2"><button type="button" onClick={onClose} className="focus-ring min-h-11 cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">取消</button><button type="submit" className="focus-ring min-h-11 cursor-pointer rounded-xl bg-luna-violet px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">{mode === 'copy' ? `复制${selectedCopies.length ? ` (${selectedCopies.length})` : ''}` : '保存 Skill'}</button></div></footer>
      </form>
    </div>
  )
}

const SkillsPageContent = () => {
  const selectedBrand = useBrandStore((state) => state.selectedBrand)
  const brands = useBrandStore((state) => state.brands)
  const brandSkills = useBrandStore((state) => state.brandSkills)
  const industrySkills = useBrandStore((state) => state.industrySkills)
  const currentUser = useBrandStore((state) => state.currentUser)
  const navigate = useNavigate()
  const { brandId } = useParams()
  const skills = brandSkills[selectedBrand] || []
  const role = useBrandStore((state) => state.getCurrentRole)()
  const addBrandSkill = useBrandStore((state) => state.addBrandSkill)
  const updateBrandSkill = useBrandStore((state) => state.updateBrandSkill)
  const toggleBrandSkill = useBrandStore((state) => state.toggleBrandSkill)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [notice, setNotice] = useState('')
  const [activeModule, setActiveModule] = useState('skills')
  const [selectedCapability, setSelectedCapability] = useState(null)
  const activeCount = skills.filter((skill) => skill.enabled).length
  const tasks = useMarketingOpsStore((state) => state.tasks)
  const effects = useMarketingOpsStore((state) => state.effectTracks)
  const candidates = useMarketingOpsStore((state) => state.knowledgeCandidates)

  const openCreate = () => { setEditingSkill(null); setModalOpen(true) }
  const openEdit = (skill) => { setEditingSkill(skill); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingSkill(null) }
  const saveSkill = (skill) => {
    if (editingSkill) updateBrandSkill(editingSkill.id, skill)
    else addBrandSkill(skill)
    setNotice(editingSkill ? 'Skill 已更新' : 'Skill 已添加')
    closeModal()
  }
  const copySkills = (selected) => {
    selected.forEach(({ id, sourceName, libraryType, industry, status, version, ...skill }) => addBrandSkill({ ...skill, id: undefined, sourceType: libraryType, sourceSkillId: id }))
    setNotice(`已从 Skill 库添加 ${selected.length} 个 Skill 到 ${selectedBrand}`)
    closeModal()
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex w-full rounded-xl border border-neutral-200 bg-neutral-100 p-1 sm:w-auto" role="tablist" aria-label="品牌认知配置模块">
        <button type="button" role="tab" aria-selected={activeModule === 'skills'} onClick={() => setActiveModule('skills')} className={`focus-ring flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors sm:flex-none ${activeModule === 'skills' ? 'bg-white text-luna-violet shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}><Sparkles size={16} />Skill</button>
        <button type="button" role="tab" aria-selected={activeModule === 'knowledge'} onClick={() => setActiveModule('knowledge')} className={`focus-ring flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors sm:flex-none ${activeModule === 'knowledge' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}><BookOpen size={16} />知识库</button>
      </div>

      {activeModule === 'knowledge' ? <KnowledgePanel /> : <>
      <section className="relative overflow-hidden rounded-2xl border border-luna-border bg-white p-5 shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-52 luna-gradient-bg" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-luna" style={{ background: 'var(--luna-gradient)' }}><Sparkles size={20} /></div><div><p className="text-[11px] font-semibold uppercase tracking-wider text-luna-violet">{selectedBrand}</p><h2 className="mt-1 font-heading text-lg font-semibold text-neutral-900">品牌专属 Skill</h2><p className="mt-1 max-w-2xl text-sm text-neutral-500">这些能力仅作用于当前品牌，Luna 会按品牌目标和数据持续执行检查。</p></div></div>
          <div className="flex flex-wrap items-center gap-2">{currentUser.platformRole === 'platform_admin' && <button onClick={() => navigate(`/workspace/${encodeURIComponent(brandId || 'default')}/settings/skill-admin`)} className="focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"><Settings2 size={17} />管理后台</button>}<span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-600"><LockKeyhole size={13} />{role === 'owner' ? '所有者' : '管理员'}可管理</span><button onClick={openCreate} className="focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-luna-violet px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"><Plus size={17} />添加 Skill</button></div>
        </div>
      </section>

      {notice && <div className="flex items-center justify-between rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-xs font-medium text-success-700" role="status"><span className="flex items-center gap-2"><Check size={14} />{notice}</span><button onClick={() => setNotice('')} aria-label="关闭提示" className="focus-ring cursor-pointer rounded p-1 hover:bg-success-100"><X size={14} /></button></div>}
      <div className="flex items-center gap-3 rounded-xl border border-luna-border bg-luna-bg/50 px-4 py-3"><span className="text-caption font-semibold text-luna-violet tabular-nums">{activeCount}/{skills.length} 个 Skill 已开启</span><span className="text-caption text-neutral-400">— 预算生效仍需要优化师确认</span></div>

      {skills.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map((skill) => { const Icon = ICONS[skill.iconKey] || ShieldAlert; return <article key={skill.id} className={`rounded-xl border p-5 transition-all ${skill.enabled ? 'border-neutral-200 bg-white shadow-sm' : 'border-neutral-100 bg-neutral-50 opacity-70'}`}><div className="mb-3 flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${skill.enabled ? 'bg-luna-bg text-luna-violet' : 'bg-neutral-100 text-neutral-400'}`}><Icon size={20} /></div><div className="flex items-center gap-1"><button onClick={() => openEdit(skill)} aria-label={`编辑${skill.name}`} className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"><PenLine size={16} /></button><button onClick={() => toggleBrandSkill(skill.id)} aria-label={`${skill.enabled ? '关闭' : '开启'}${skill.name}`} className={`focus-ring relative h-6 w-11 cursor-pointer rounded-full transition-colors ${skill.enabled ? 'bg-luna-violet' : 'bg-neutral-300'}`}><span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${skill.enabled ? 'translate-x-5' : 'translate-x-0'}`} /></button></div></div><h3 className="mb-1 font-heading text-sm font-semibold text-neutral-900">{skill.name}</h3><p className="mb-3 text-caption leading-relaxed text-neutral-500">{skill.description}</p><div className="flex items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${skill.enabled ? 'border-success-200 bg-success-50 text-success-600' : 'border-neutral-200 bg-neutral-100 text-neutral-400'}`}><span className={`h-1.5 w-1.5 rounded-full ${skill.enabled ? 'bg-success-500' : 'bg-neutral-300'}`} />{skill.enabled ? 'Active' : 'Inactive'}</span><button onClick={()=>setSelectedCapability(skill)} className="rounded-lg border border-luna-border bg-luna-bg px-2.5 py-1.5 text-[11px] font-semibold text-luna-violet">能力详情</button></div></article>})}</div> : <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center"><Sparkles size={28} className="mx-auto text-neutral-300" /><h3 className="mt-3 font-heading text-sm font-semibold text-neutral-800">当前品牌还没有 Skill</h3><p className="mt-1 text-xs text-neutral-500">可自定义创建，或从 Skill 库选择行业及品牌个性化 Skill。</p><button onClick={openCreate} className="focus-ring mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-luna-violet px-4 text-sm font-semibold text-white hover:bg-violet-700"><Plus size={17} />添加 Skill</button></div>}

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Workflow size={17} className="text-luna-violet"/><h3 className="font-heading text-sm font-semibold">能力关系</h3></div><p className="mt-1 text-xs text-neutral-500">知识为 Skill 提供判断依据，Skill 被任务调用，运行结果继续形成效果验证与候选知识。</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{[['L1–L4 知识',industrySkills.filter(s=>s.status==='published').length + (brandSkills[selectedBrand]?.length ? 2 : 0),BookOpen],['启用 Skill',activeCount,Sparkles],['关联任务',tasks.length,Workflow],['验证/沉淀',effects.length + candidates.length,Activity]].map(([label,value,Icon])=><div key={label} className="rounded-xl bg-neutral-50 p-3"><Icon size={14} className="text-neutral-400"/><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-1 text-[11px] text-neutral-500">{label}</p></div>)}</div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500"><span className="rounded-lg border px-3 py-2">行业/品牌知识</span><span>→</span><span className="rounded-lg border border-luna-border bg-luna-bg px-3 py-2 text-luna-violet">品牌 Skill</span><span>→</span><span className="rounded-lg border px-3 py-2">定时任务</span><span>→</span><span className="rounded-lg border px-3 py-2">运行结果</span><span>→</span><span className="rounded-lg border px-3 py-2">候选知识</span></div></section>

      {modalOpen && <SkillModal selectedBrand={selectedBrand} brands={brands} brandSkills={brandSkills} industrySkills={industrySkills} editingSkill={editingSkill} onClose={closeModal} onSave={saveSkill} onCopy={copySkills} />}
      {selectedCapability && <SkillCapabilityDetail skill={selectedCapability} industrySkill={industrySkills.find(item=>item.id===selectedCapability.sourceSkillId)} onClose={()=>setSelectedCapability(null)} />}
      </>}
    </div>
  )
}

const SkillsPage = () => <div className="space-y-6"><BrandUpgradeNotice /><EffectiveCapabilityPanel /><SkillsPageContent /></div>
export default SkillsPage
