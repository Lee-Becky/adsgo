import { AlertTriangle, ArrowRight, Check, GitCompareArrows, X } from 'lucide-react'
import { useState } from 'react'
import useBrandStore from '@stores/brandStore'

const BrandUpgradeNotice=()=>{
 const brand=useBrandStore(s=>s.selectedBrand)
 const upgrades=useBrandStore(s=>s.skillUpgrades)
 const review=useBrandStore(s=>s.reviewSkillUpgrade)
 const [selected,setSelected]=useState(null)
 const item=upgrades.find(x=>x.brand===brand&&x.status==='待确认')
 if(!item)return null
 return <><section className="flex flex-col gap-4 rounded-2xl border border-warning-200 bg-warning-50 p-4 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-warning-700"><GitCompareArrows size={18}/></span><div className="min-w-0 flex-1"><p className="text-xs font-bold text-warning-900">{brand} 有行业 Skill 新版本待适配</p><p className="mt-1 text-xs text-warning-800">{item.skill} {item.current} → {item.latest} · {item.conflict}</p></div><button onClick={()=>setSelected(item)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-xs font-semibold text-white">检查差异与冲突<ArrowRight size={13}/></button></section>{selected&&<div className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-950/50 p-4" onMouseDown={()=>setSelected(null)}><div onMouseDown={e=>e.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-info-700">Brand Upgrade Review</p><h3 className="mt-1 font-bold">{selected.skill} {selected.current} → {selected.latest}</h3><p className="mt-1 text-xs text-neutral-500">行业版本不会直接覆盖品牌规则，由品牌管理员确认最终生效方式。</p></div><button onClick={()=>setSelected(null)}><X size={18}/></button></div><div className="mt-4 space-y-2">{[['行业新增','促销阶段和高意向流量保护窗口'],['品牌覆盖',selected.conflict],['关联影响',(selected.impact||[]).join('、')],['最终生效','保留品牌促销规则，并采用新版验证指标']].map(([a,b],i)=><div key={a} className={`flex gap-3 rounded-xl border p-3 ${i===1?'border-warning-200 bg-warning-50':''}`}>{i===1?<AlertTriangle size={15} className="text-warning-700"/>:<Check size={15} className="text-success-700"/>}<div><p className="text-xs font-bold">{a}</p><p className="mt-1 text-xs text-neutral-500">{b}</p></div></div>)}</div><div className="mt-5 flex justify-end gap-2"><button onClick={()=>{review(selected.id,'暂缓升级');setSelected(null)}} className="rounded-xl border px-4 py-2.5 text-sm">暂缓</button><button onClick={()=>{review(selected.id,'已升级');setSelected(null)}} className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white">保留品牌规则并升级</button></div></div></div>}</>
}
export default BrandUpgradeNotice
