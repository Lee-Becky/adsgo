import { Check, Factory, Layers3, PenLine, Plus, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'
import AdminKnowledgePanel from './AdminKnowledgePanel'
import IndustryCandidatesPanel from './IndustryCandidatesPanel'
import SkillDistributionPanel from './SkillDistributionPanel'
import StructuredSkillEditor from './StructuredSkillEditor'

const meta = {
  skills: ['行业 Skill 工厂','把优秀优化师的方法沉淀为结构化、可验证、可分发的行业能力。'],
  knowledge: ['公共知识库','维护行业基础、投放知识与市场动态，为行业 Skill 提供判断依据。'],
  candidates: ['行业候选能力','审核多品牌脱敏证据，将共性经验升级为行业知识或 Skill 新版本。'],
  distribution: ['能力包与分发','将已发布的 Skill 与公共知识按行业或指定品牌进行分发。'],
}

const SkillAdminPage = () => {
  const [params]=useSearchParams()
  const active=['knowledge','candidates','distribution'].includes(params.get('tab'))?params.get('tab'):'skills'
  const skills=useBrandStore(s=>s.industrySkills)
  const add=useBrandStore(s=>s.addIndustrySkill)
  const update=useBrandStore(s=>s.updateIndustrySkill)
  const [query,setQuery]=useState('')
  const [editing,setEditing]=useState(null)
  const [open,setOpen]=useState(false)
  const [notice,setNotice]=useState('')
  const filtered=useMemo(()=>skills.filter(x=>`${x.name} ${x.description} ${x.industry}`.toLowerCase().includes(query.toLowerCase())),[skills,query])
  const save=(data)=>{editing?update(editing.id,data):add(data);setOpen(false);setEditing(null);setNotice(data.status==='published'?`${data.name} 已发布，可进入分发中心`:'Skill 草稿已保存')}
  if(active==='knowledge')return <AdminKnowledgePanel/>
  if(active==='candidates')return <IndustryCandidatesPanel/>
  if(active==='distribution')return <SkillDistributionPanel/>
  return <div className="mx-auto max-w-6xl space-y-5">
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-700">Capability Production</p><h2 className="mt-1 text-xl font-bold">{meta[active][0]}</h2><p className="mt-1 text-sm text-slate-500">{meta[active][1]}</p></div><button onClick={()=>{setEditing(null);setOpen(true)}} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white"><Plus size={16}/>从专家方法创建 Skill</button></div><div className="grid gap-px bg-slate-200 sm:grid-cols-3">{[[skills.length,'Skill 总数',Layers3],[skills.filter(x=>x.status==='published').length,'已发布',Check],[skills.reduce((n,x)=>n+(x.calls||18),0),'近 30 天调用',Sparkles]].map(([v,l,I])=><div key={l} className="bg-white p-4"><I size={15} className="text-cyan-700"/><p className="mt-2 text-2xl font-bold">{v}</p><p className="text-xs text-slate-500">{l}</p></div>)}</div></section>
    {notice&&<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">{notice}</div>}
    <section className="rounded-2xl border bg-white p-5 shadow-sm"><div className="relative max-w-sm"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索行业 Skill" className="min-h-11 w-full rounded-xl border pl-9 pr-3 text-sm outline-none focus:border-cyan-500"/></div><div className="mt-4 grid gap-3 md:grid-cols-2">{filtered.map(skill=><article key={skill.id} className="rounded-xl border p-4 hover:border-cyan-300"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{skill.name}</h3><span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-800">行业 Skill</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${skill.status==='published'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{skill.status==='published'?'已发布':'草稿'}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{skill.description}</p></div><button onClick={()=>{setEditing(skill);setOpen(true)}} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-slate-100"><PenLine size={15}/></button></div><div className="mt-4 flex flex-wrap gap-2 border-t pt-3 text-[10px] text-slate-500"><span>{skill.industry}</span><span>·</span><span>{skill.version}</span><span>·</span><span>{skill.steps?.length||5} 个方法步骤</span><span>·</span><span>{skill.verificationPolicy?'已定义验证':'待补验证'}</span></div></article>)}</div></section>
    {open&&<StructuredSkillEditor skill={editing} onClose={()=>{setOpen(false);setEditing(null)}} onSave={save}/>} 
  </div>
}

export default SkillAdminPage
