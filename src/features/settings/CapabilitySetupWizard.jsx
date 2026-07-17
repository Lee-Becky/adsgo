import { ArrowRight, BookOpen, Check, Database, PackageCheck, ShieldAlert, Sparkles, Target, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import useBrandStore from '@stores/brandStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const CapabilitySetupWizard = () => {
  const open=useBrandStore(s=>s.capabilitySetupOpen)
  const close=useBrandStore(s=>s.setCapabilitySetupOpen)
  const brand=useBrandStore(s=>s.selectedBrand)
  const details=useBrandStore(s=>s.brandDetails)
  const skills=useBrandStore(s=>s.industrySkills)
  const knowledge=useBrandStore(s=>s.industryKnowledge)
  const install=useBrandStore(s=>s.installCapabilityPackage)
  const pendingSkillIds=useBrandStore(s=>s.brandPendingAssets[brand]||[])
  const pendingKnowledgeIds=useBrandStore(s=>s.brandPendingKnowledge[brand]||[])
  const updateDetail=useBrandStore(s=>s.updateBrandDetail)
  const addTask=useMarketingOpsStore(s=>s.addTask)
  const addAlert=useMarketingOpsStore(s=>s.addAlertRule)
  const [step,setStep]=useState(0)
  const [industry,setIndustry]=useState(details[brand]?.industry||'电商')
  const [goal,setGoal]=useState('ROAS ≥ 2.40')
  const [budget,setBudget]=useState('$300 / 日')
  const [promotion,setPromotion]=useState(true)
  const recommendedSkills=useMemo(()=>skills.filter(x=>x.status==='published'&&(pendingSkillIds.length?pendingSkillIds.includes(x.id):(x.industry===industry||x.industry==='全行业'))),[skills,industry,pendingSkillIds])
  const recommendedKnowledge=useMemo(()=>knowledge.filter(x=>x.status==='published'&&(pendingKnowledgeIds.length?pendingKnowledgeIds.includes(x.id):(x.industry===industry||x.industry==='全行业'))),[knowledge,industry,pendingKnowledgeIds])
  const [selectedSkillIds,setSelectedSkillIds]=useState(null)
  const selected=selectedSkillIds||recommendedSkills.map(x=>x.id)
  if(!open)return null
  const toggle=id=>setSelectedSkillIds((selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]))
  const finish=()=>{updateDetail(brand,{industry,isAnalyzed:true});install({brandName:brand,skillIds:selected,knowledgeIds:recommendedKnowledge.map(x=>x.id),packageName:`${industry}品牌运营能力包`,overrides:{goal,budget,promotionProtection:promotion}});addTask({name:`${brand} 每日经营健康检查`,skill:recommendedSkills[0]?.name||'账户健康检查',schedule:'每天 09:00',source:'品牌能力装配'});addAlert({title:'ROAS 低于品牌目标',level:'高',rule:`低于 ${goal}，持续 2 小时`,scope:'全部广告账户'});setStep(4)}
  const stages=['品牌基础','经营边界','推荐能力','适配确认']
  return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm"><div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#f7f8fa] shadow-2xl">
    <header className="flex items-start justify-between border-b bg-white p-5"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-violet-700">Brand Capability Setup</p><h2 className="mt-1 text-xl font-bold">为 {brand} 装配服务能力</h2><p className="mt-1 text-xs text-slate-500">平台分发决定品牌可获得什么；品牌管理员确认启用什么以及如何适配。</p></div><button onClick={()=>close(false)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100"><X size={18}/></button></header>
    {step<4&&<div className="flex gap-2 overflow-x-auto border-b bg-white p-3">{stages.map((x,i)=><button key={x} onClick={()=>i<=step&&setStep(i)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold ${i===step?'bg-slate-950 text-white':i<step?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-400'}`}><span>{i<step?'✓':i+1}</span>{x}</button>)}</div>}
    <main className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-7">
      {step===0&&<div className="mx-auto max-w-2xl"><h3 className="text-lg font-bold">确认品牌经营类型</h3><p className="mt-1 text-sm text-slate-500">系统将据此推荐行业 Skill、公共知识和运营模板。</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{['电商','应用','游戏'].map(x=><button key={x} onClick={()=>setIndustry(x)} className={`rounded-2xl border p-5 text-left ${industry===x?'border-violet-500 bg-violet-50':'bg-white'}`}><Database size={18} className={industry===x?'text-violet-700':'text-slate-400'}/><p className="mt-4 font-bold">{x}</p><p className="mt-1 text-xs text-slate-500">{x==='电商'?'商品销售、素材与转化效率':x==='应用'?'获客、留存与扩量':'付费、回收与素材迭代'}</p></button>)}</div></div>}
      {step===1&&<div className="mx-auto max-w-2xl"><h3 className="text-lg font-bold">设置品牌经营边界</h3><p className="mt-1 text-sm text-slate-500">这些品牌规则会覆盖行业默认阈值，但不会修改行业 Skill。</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-700">核心目标<input value={goal} onChange={e=>setGoal(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border px-3 text-sm"/></label><label className="text-xs font-bold text-slate-700">预算上限<input value={budget} onChange={e=>setBudget(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border px-3 text-sm"/></label></div><label className="mt-4 flex items-center justify-between rounded-xl border bg-white p-4"><span><strong className="text-sm">促销期保护再营销预算</strong><span className="mt-1 block text-xs text-slate-500">行业建议降低预算时，再营销先进入 48 小时观察</span></span><input type="checkbox" checked={promotion} onChange={e=>setPromotion(e.target.checked)} className="h-4 w-4 accent-violet-600"/></label></div>}
      {step===2&&<div className="mx-auto max-w-3xl"><h3 className="text-lg font-bold">推荐的 {industry} 服务能力包</h3><p className="mt-1 text-sm text-slate-500">根据品牌行业和经营目标推荐，可在启用前取消不需要的能力。</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{recommendedSkills.map(x=><button key={x.id} onClick={()=>toggle(x.id)} className={`rounded-xl border p-4 text-left ${selected.includes(x.id)?'border-violet-400 bg-violet-50':'bg-white opacity-60'}`}><div className="flex items-start justify-between"><Sparkles size={17} className="text-violet-700"/><span className="text-xs font-bold">{selected.includes(x.id)?'已选择':'未选择'}</span></div><p className="mt-3 text-sm font-bold">{x.name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{x.description}</p></button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-3">{[[recommendedKnowledge.length,'公共知识',BookOpen],[1,'数据视图模板',Database],[2,'任务与预警模板',ShieldAlert]].map(([n,l,I])=><div key={l} className="rounded-xl border bg-white p-4"><I size={16} className="text-slate-500"/><p className="mt-2 text-xl font-bold">{n}</p><p className="text-xs text-slate-500">{l}</p></div>)}</div></div>}
      {step===3&&<div className="mx-auto max-w-3xl"><h3 className="text-lg font-bold">确认最终生效逻辑</h3><p className="mt-1 text-sm text-slate-500">行业方法不会直接覆盖品牌规则，Luna 使用的是适配后的最终能力。</p><div className="mt-6 grid gap-3 lg:grid-cols-[1fr_36px_1fr_36px_1fr] lg:items-stretch"><div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold text-slate-400">行业默认</p><p className="mt-2 text-sm font-bold">低于行业目标时生成预算调整建议</p></div><ArrowRight className="m-auto text-slate-300"/><div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-[10px] font-bold text-amber-700">品牌覆盖</p><p className="mt-2 text-sm font-bold">{promotion?'促销期保护再营销':'不设置额外保护'}</p><p className="mt-1 text-xs text-slate-500">目标 {goal} · 上限 {budget}</p></div><ArrowRight className="m-auto text-slate-300"/><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-[10px] font-bold text-emerald-700">最终生效</p><p className="mt-2 text-sm font-bold">冷启动可调整，再营销观察，全部需人工确认</p></div></div><button onClick={finish} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white"><PackageCheck size={17}/>启用品牌服务能力</button></div>}
      {step===4&&<div className="mx-auto max-w-xl py-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={28}/></span><h3 className="mt-5 text-2xl font-bold">品牌能力已装配完成</h3><p className="mt-2 text-sm leading-6 text-slate-500">已启用 {selected.length} 个 Skill、{recommendedKnowledge.length} 条公共知识，并创建每日健康检查与 ROAS 预警。</p><div className="mt-6 grid gap-3 text-left sm:grid-cols-3">{[['Skill 与知识','查看最终生效规则',Sparkles],['自动化配置','查看任务和预警',ShieldAlert],['今日工作台','让 Luna 开始工作',Target]].map(([a,b,I])=><div key={a} className="rounded-xl border bg-white p-4"><I size={17} className="text-violet-700"/><p className="mt-3 text-sm font-bold">{a}</p><p className="mt-1 text-xs text-slate-500">{b}</p></div>)}</div><button onClick={()=>{setStep(0);close(false)}} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white">完成并进入品牌工作区</button></div>}
    </main>
    {step<4&&<footer className="flex justify-between border-t bg-white p-4"><button disabled={step===0} onClick={()=>setStep(x=>x-1)} className="rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-30">上一步</button>{step<3&&<button onClick={()=>setStep(x=>x+1)} className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">下一步</button>}</footer>}
  </div></div>
}

export default CapabilitySetupWizard
