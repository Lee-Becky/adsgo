import { useState } from 'react'
import { CheckCircle2, Edit3, Globe2, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react'

const initialProfile = {
  name: 'LumaFit',
  website: 'lumafit.example',
  industry: '运动健身 · DTC 电商',
  positioning: '面向都市女性的高性能日常运动服饰品牌',
  markets: '美国、加拿大、英国',
  audience: '25–40 岁、关注运动表现与日常穿着舒适度的女性',
  tone: '专业、可信、积极，不夸张承诺',
  values: '功能设计、真实体验、长期陪伴',
  redlines: '避免医疗功效承诺；避免贬低身材；折扣信息必须真实',
}

const BrandProfileSummaryPage = () => {
  const [profile,setProfile]=useState(initialProfile)
  const [editing,setEditing]=useState(false)
  const [analyzing,setAnalyzing]=useState(false)
  const analyze=()=>{setAnalyzing(true);setTimeout(()=>setAnalyzing(false),900)}
  const save=e=>{e.preventDefault();const data=new FormData(e.currentTarget);setProfile(Object.fromEntries(Object.keys(initialProfile).map(key=>[key,data.get(key)])));setEditing(false)}
  const fields=[['name','品牌名称'],['website','品牌官网'],['industry','行业分类'],['positioning','品牌定位'],['markets','核心市场'],['audience','目标受众概述'],['tone','品牌调性与语言风格'],['values','核心价值与卖点'],['redlines','品牌红线']]
  return <div className="space-y-5">
    <section className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold text-success-700"><CheckCircle2 size={15}/>品牌画像已分析完成</div><h2 className="mt-2 text-xl font-bold">品牌信息</h2><p className="mt-1 text-sm text-neutral-500">仅维护稳定的品牌身份与表达约束，为 Luna、Skill、策略和素材生成提供上下文。</p></div><div className="flex gap-2"><button onClick={analyze} disabled={analyzing} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><RefreshCw size={15} className={analyzing?'animate-spin':''}/>{analyzing?'正在分析':'重新分析'}</button><button onClick={()=>setEditing(true)} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"><Edit3 size={15}/>编辑画像</button></div></section>
    <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><article className="rounded-2xl border bg-white p-6 shadow-sm"><div className="flex items-start gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-600 text-xl font-bold text-white">L</span><div><h3 className="text-xl font-bold">{profile.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-neutral-500"><Globe2 size={14}/>{profile.website}</p><span className="mt-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{profile.industry}</span></div></div><div className="mt-6 rounded-xl bg-neutral-50 p-4"><p className="text-xs text-neutral-400">品牌定位</p><p className="mt-2 text-sm leading-6 text-neutral-700">{profile.positioning}</p></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{[['核心市场',profile.markets],['目标受众概述',profile.audience],['品牌调性',profile.tone],['核心价值',profile.values]].map(([label,value])=><div key={label}><p className="text-xs text-neutral-400">{label}</p><p className="mt-1 text-sm leading-6 text-neutral-700">{value}</p></div>)}</div></article><aside className="space-y-4"><div className="rounded-2xl border bg-white p-5 shadow-sm"><Sparkles size={18} className="text-luna-violet"/><h3 className="mt-3 font-bold">画像使用范围</h3><div className="mt-3 space-y-2 text-sm text-neutral-600">{['Luna 回答和建议','品牌 Skill 执行上下文','素材生成表达规范','策略与报告品牌背景'].map(x=><p key={x}>· {x}</p>)}</div></div><div className="rounded-2xl border border-danger-100 bg-danger-50/40 p-5"><ShieldCheck size={18} className="text-danger-600"/><h3 className="mt-3 font-bold">品牌红线</h3><p className="mt-2 text-sm leading-6 text-neutral-700">{profile.redlines}</p></div></aside></section>
    {editing&&<div className="fixed inset-0 z-[9998] grid place-items-center overflow-y-auto bg-neutral-950/40 p-4" onMouseDown={()=>setEditing(false)}><form onSubmit={save} onMouseDown={e=>e.stopPropagation()} className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b p-5"><div><h3 className="font-bold">编辑品牌画像</h3><p className="mt-1 text-xs text-neutral-500">动态产品、竞品和投放数据不在这里维护</p></div><button type="button" onClick={()=>setEditing(false)}><X size={18}/></button></header><div className="grid overflow-y-auto gap-4 p-5 sm:grid-cols-2">{fields.map(([key,label])=><label key={key} className={`text-sm ${['positioning','audience','tone','values','redlines'].includes(key)?'sm:col-span-2':''}`}>{label}{['positioning','audience','tone','values','redlines'].includes(key)?<textarea name={key} defaultValue={profile[key]} className="mt-1.5 min-h-20 w-full rounded-lg border px-3 py-2.5"/>:<input name={key} defaultValue={profile[key]} className="mt-1.5 w-full rounded-lg border px-3 py-2.5"/>}</label>)}</div><footer className="flex justify-end gap-2 border-t p-4"><button type="button" onClick={()=>setEditing(false)} className="rounded-lg border px-4 py-2 text-sm">取消</button><button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">保存画像</button></footer></form></div>}
  </div>
}
export default BrandProfileSummaryPage
