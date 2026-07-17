import { BookOpen, Building2, Check, CheckSquare2, History, Layers3, Send, Sparkles, Square } from 'lucide-react'
import { useMemo, useState } from 'react'
import useBrandStore from '@stores/brandStore'

const SelectCard = ({ checked, title, meta, onClick, type }) => (
  <button onClick={onClick} className={`flex w-full gap-2 rounded-lg border p-3 text-left ${checked ? type === 'skill' ? 'border-luna-border bg-luna-bg/50' : 'border-primary-200 bg-primary-50/50' : 'border-neutral-200'}`}>
    {checked ? <CheckSquare2 size={15} className={`mt-0.5 shrink-0 ${type === 'skill' ? 'text-luna-violet' : 'text-primary-700'}`} /> : <Square size={15} className="mt-0.5 shrink-0 text-neutral-300" />}
    <span><strong className="block text-xs">{title}</strong><span className="mt-1 block text-[10px] text-neutral-400">{meta}</span></span>
  </button>
)

const PlatformDistributionCenter = () => {
  const brands = useBrandStore(s => s.brands)
  const details = useBrandStore(s => s.brandDetails)
  const skills = useBrandStore(s => s.industrySkills)
  const knowledge = useBrandStore(s => s.industryKnowledge)
  const records = useBrandStore(s => s.distributionRecords)
  const distribute = useBrandStore(s => s.distributeIndustryAssets)
  const [targetMode, setTargetMode] = useState('industry')
  const [industry, setIndustry] = useState('电商')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [skillIds, setSkillIds] = useState([])
  const [knowledgeIds, setKnowledgeIds] = useState([])
  const [notice, setNotice] = useState('')
  const publishedSkills = useMemo(() => skills.filter(x => x.status === 'published'), [skills])
  const publishedKnowledge = useMemo(() => knowledge.filter(x => x.status === 'published'), [knowledge])
  const targets = targetMode === 'industry' ? brands.filter(brand => details[brand]?.industry === industry) : selectedBrands
  const toggle = (id, list, setter) => setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  const submit = () => {
    const result = distribute({ targetMode, industry, brandNames: selectedBrands, skillIds, knowledgeIds })
    setNotice(result.success ? `已向 ${result.targets.length} 个品牌分发 ${skillIds.length} 个 Skill、${knowledgeIds.length} 条知识` : '请至少选择一项能力和一个目标品牌')
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-info-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b bg-info-50/45 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-info-600 text-white"><Send size={18} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-info-700">Platform Distribution</p><h3 className="mt-1 font-bold">Skill 与知识分发</h3><p className="mt-1 text-xs text-neutral-500">按客户行业批量匹配，或自行单选、多选品牌进行分发</p></div></div>
        <div className="flex gap-4 text-center">{[[skills.length, 'Skill'], [knowledge.length, '知识'], [records.length, '分发记录']].map(([value, label]) => <div key={label}><p className="text-lg font-bold">{value}</p><p className="text-[10px] text-neutral-400">{label}</p></div>)}</div>
      </header>

      <div className="grid xl:grid-cols-[1.15fr_.85fr]">
        <div className="border-b p-5 xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Layers3 size={16} className="text-info-700" /><h4 className="text-sm font-bold">1. 选择分发内容</h4></div><span className="text-[10px] text-neutral-400">可同时分发 Skill 与知识</span></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-bold"><Sparkles size={14} className="text-luna-violet" />行业 Skill</p><button onClick={() => setSkillIds(skillIds.length === publishedSkills.length ? [] : publishedSkills.map(x => x.id))} className="text-[10px] font-semibold text-info-700">{skillIds.length === publishedSkills.length ? '取消全选' : '全选'}</button></div>
              <div className="mt-3 space-y-2">{publishedSkills.map(item => <SelectCard key={item.id} checked={skillIds.includes(item.id)} title={item.name} meta={`${item.industry} · ${item.version}`} type="skill" onClick={() => toggle(item.id, skillIds, setSkillIds)} />)}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-bold"><BookOpen size={14} className="text-primary-700" />公共知识</p><button onClick={() => setKnowledgeIds(knowledgeIds.length === publishedKnowledge.length ? [] : publishedKnowledge.map(x => x.id))} className="text-[10px] font-semibold text-info-700">{knowledgeIds.length === publishedKnowledge.length ? '取消全选' : '全选'}</button></div>
              <div className="mt-3 space-y-2">{publishedKnowledge.map(item => <SelectCard key={item.id} checked={knowledgeIds.includes(item.id)} title={item.title} meta={`${item.level} · ${item.industry}`} type="knowledge" onClick={() => toggle(item.id, knowledgeIds, setKnowledgeIds)} />)}</div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2"><Building2 size={16} className="text-info-700" /><h4 className="text-sm font-bold">2. 选择目标客户</h4></div>
          <div className="mt-4 grid grid-cols-2 rounded-xl bg-neutral-100 p-1">{[['industry', '按客户行业'], ['brands', '选择品牌']].map(([id, label]) => <button key={id} onClick={() => setTargetMode(id)} className={`min-h-10 rounded-lg text-xs font-semibold ${targetMode === id ? 'bg-white shadow-sm' : 'text-neutral-500'}`}>{label}</button>)}</div>
          {targetMode === 'industry' ? (
            <div className="mt-4">
              <label className="text-xs font-semibold">客户行业<select value={industry} onChange={e => setIndustry(e.target.value)} className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5">{['电商', '应用', '游戏', '金融', '教育'].map(x => <option key={x}>{x}</option>)}</select></label>
              <div className="mt-3 rounded-xl border bg-neutral-50 p-3"><p className="text-[10px] font-bold text-neutral-400">自动匹配 {targets.length} 个品牌</p><div className="mt-2 flex flex-wrap gap-2">{targets.map(brand => <span key={brand} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold">{brand}</span>)}{!targets.length && <span className="text-xs text-neutral-400">暂无该行业品牌</span>}</div></div>
            </div>
          ) : (
            <div className="mt-4 space-y-2">{brands.map(brand => { const checked = selectedBrands.includes(brand); return <button key={brand} onClick={() => toggle(brand, selectedBrands, setSelectedBrands)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${checked ? 'border-info-300 bg-info-50' : 'border-neutral-200'}`}><span><strong className="block text-xs">{brand}</strong><span className="mt-1 block text-[10px] text-neutral-400">{details[brand]?.industry || '未分类'}</span></span>{checked ? <Check size={15} className="text-info-700" /> : <Square size={15} className="text-neutral-300" />}</button> })}</div>
          )}
          <div className="mt-4 rounded-xl border border-info-200 bg-info-50 p-3 text-xs"><p className="font-semibold text-info-900">分发预览</p><p className="mt-1 text-info-800">{targets.length} 个品牌 · {skillIds.length} 个 Skill · {knowledgeIds.length} 条知识</p></div>
          <button onClick={submit} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-semibold text-white"><Send size={15} />确认分发</button>
          {notice && <p className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${notice.startsWith('已向') ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>{notice}</p>}
        </div>
      </div>

      {records.length > 0 && <footer className="border-t bg-neutral-50 p-4"><div className="flex items-center gap-2 text-xs font-bold"><History size={14} />最近分发</div><div className="mt-2 space-y-1">{records.slice(0, 3).map(record => <div key={record.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-[11px]"><span>{record.brands.join('、')}</span><span className="text-neutral-400">{record.skillIds.length} Skill · {record.knowledgeIds.length} 知识 · {record.createdAt}</span></div>)}</div></footer>}
    </section>
  )
}

export default PlatformDistributionCenter
