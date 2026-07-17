import { ArrowLeft, ArrowRight, Check, Compass, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'

const steps=[
 {title:'方法如何成为 Skill',detail:'进入独立平台后台，用结构化编辑器定义问题、数据、知识、步骤、输出、权限和验证。',role:'platform_admin',path:'/admin/capabilities?tab=skills'},
 {title:'新品牌如何获得能力',detail:'平台先完成分发，品牌管理员再确认行业能力、品牌目标和覆盖规则，形成最终生效能力。',role:'brand_admin',path:'/workspace/LumaFit/settings/skills',setup:true},
 {title:'Luna 如何组合上下文',detail:'查看 Skill 版本、数据视图、品牌目标、行业知识和 L4 品牌经验的规则合成过程。',role:'brand_admin',path:'/workspace/LumaFit/chat'},
 {title:'优化师如何控制判断',detail:'真实修改预算比例、选择拒绝原因，或设置观察窗口；高影响动作不会自动执行。',role:'optimizer',path:'/workspace/LumaFit/chat'},
 {title:'品牌如何越用越聪明',detail:'执行动作、填写验证结果，生成候选知识，再由品牌管理员审核进入 L4。',role:'brand_admin',path:'/workspace/LumaFit/insight/operations-closure'},
 {title:'经验如何升级为行业能力',detail:'平台只查看匿名聚合证据，将共性经验发布为行业知识或 Skill 新版本并再次分发。',role:'platform_admin',path:'/admin/capabilities?tab=candidates'},
]

const ProductStoryGuide=()=>{
 const navigate=useNavigate(),location=useLocation()
 const [open,setOpen]=useState(false),[index,setIndex]=useState(0),[done,setDone]=useState([])
 const switchRole=useBrandStore(s=>s.setDemoRole),setup=useBrandStore(s=>s.setCapabilitySetupOpen)
 const go=i=>{const step=steps[i];setIndex(i);switchRole(step.role);navigate(step.path);if(step.setup)setTimeout(()=>setup(true),80);setDone(x=>[...new Set([...x,i])])}
 const current=steps[index]
 return <div className="fixed bottom-24 right-6 z-[9000]">{!open?<button onClick={()=>setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-xs font-bold text-white shadow-2xl"><Compass size={16}/>了解产品闭环</button>:<section className="w-[min(390px,calc(100vw-3rem))] overflow-hidden rounded-2xl border bg-white shadow-2xl"><header className="flex items-start justify-between bg-slate-950 p-4 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-300">Product Story</p><h2 className="mt-1 text-sm font-bold">六步看懂 AdsGo Marketing OS</h2><p className="mt-1 text-[10px] text-slate-400">当前页面：{location.pathname.startsWith('/admin')?'平台能力后台':'品牌工作空间'}</p></div><button onClick={()=>setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-800"><X size={15}/></button></header><div className="p-4"><div className="flex gap-1">{steps.map((_,i)=><button key={i} onClick={()=>go(i)} className={`h-1.5 flex-1 rounded-full ${i===index?'bg-cyan-500':done.includes(i)?'bg-emerald-400':'bg-slate-200'}`} aria-label={`第${i+1}步`}/>)}</div><p className="mt-4 text-[10px] font-bold text-slate-400">0{index+1} / 0{steps.length}</p><h3 className="mt-1 font-bold">{current.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{current.detail}</p><button onClick={()=>go(index)} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white">进入本步页面<ArrowRight size={13}/></button></div><footer className="flex items-center justify-between border-t bg-slate-50 p-3"><button disabled={index===0} onClick={()=>go(index-1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-30"><ArrowLeft size={13}/>上一步</button>{index===steps.length-1?<button onClick={()=>{setDone(steps.map((_,i)=>i));setOpen(false)}} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><Check size={13}/>完成导览</button>:<button onClick={()=>go(index+1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold">下一步<ArrowRight size={13}/></button>}</footer></section>}</div>
}
export default ProductStoryGuide
