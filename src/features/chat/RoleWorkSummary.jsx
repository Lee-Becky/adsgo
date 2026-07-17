import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, FlaskConical, Settings2, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const RoleWorkSummary=()=>{
 const navigate=useNavigate()
 const brand=useBrandStore(s=>s.selectedBrand)
 const user=useBrandStore(s=>s.currentUser)
 const role=useBrandStore(s=>s.getCurrentRole)()
 const switchRole=useBrandStore(s=>s.setDemoRole)
 const setup=useBrandStore(s=>s.setCapabilitySetupOpen)
 const upgrades=useBrandStore(s=>s.skillUpgrades).filter(x=>x.brand===brand&&x.status==='待确认')
 const installation=useBrandStore(s=>s.capabilityInstallations[brand])
 const candidates=useMarketingOpsStore(s=>s.knowledgeCandidates).filter(x=>x.status==='待审核')
 const actions=useMarketingOpsStore(s=>s.actions)
 const notifications=useMarketingOpsStore(s=>s.notifications)
 const isManager=['owner','admin'].includes(role)
 const managerItems=[
  {title:'能力装配与适配',detail:installation?.status==='complete'?`${installation.packageName} 已启用`:'当前品牌尚未完成行业能力装配',count:installation?.status==='complete'?0:1,icon:BrainCircuit,action:()=>setup(true),button:installation?.status==='complete'?'查看能力':'立即装配'},
  {title:'Skill 升级冲突',detail:upgrades[0]?.conflict||'当前没有待确认的行业能力升级',count:upgrades.length,icon:ShieldCheck,action:()=>navigate('../settings/skills'),button:'处理升级'},
  {title:'品牌经验审核',detail:candidates[0]?.title||'暂无待审核的品牌候选知识',count:candidates.length,icon:FlaskConical,action:()=>navigate('../insight/operations-closure'),button:'审核候选'},
  {title:'高影响动作确认',detail:'预算、关停和发布不会由 Luna 直接执行',count:actions.filter(x=>x.status==='待执行').length,icon:CheckCircle2,action:()=>navigate('../insight/operations-closure'),button:'查看动作'},
 ]
 const operatorItems=[
  {title:'最高优先级异常',detail:notifications.find(x=>!x.read)?.title||'当前没有未处理异常',count:notifications.filter(x=>!x.read).length,icon:AlertTriangle,action:()=>navigate('../notifications'),button:'查看异常'},
  {title:'Luna 待确认判断',detail:'美国冷启动 ROAS 下滑与主视频疲劳',count:1,icon:Sparkles,action:()=>document.getElementById('luna-decision')?.scrollIntoView({behavior:'smooth'}),button:'处理建议'},
  {title:'等待执行',detail:actions.find(x=>x.status==='待执行')?.action||'当前没有待执行动作',count:actions.filter(x=>x.status==='待执行').length,icon:CheckCircle2,action:()=>navigate('../insight/operations-closure'),button:'推进动作'},
  {title:'观察与验证',detail:'查看执行后指标是否达到预期',count:actions.filter(x=>x.status==='验证中').length,icon:FlaskConical,action:()=>navigate('../insight/operations-closure'),button:'开始验证'},
 ]
 const items=isManager?managerItems:operatorItems
 return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><header className="flex flex-col gap-4 border-b bg-slate-950 p-5 text-white lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-violet-300">{brand} · {isManager?'品牌治理视角':'优化师工作视角'}</div><h2 className="mt-2 text-xl font-bold">{isManager?'确保品牌能力正确运转':'今天最需要处理什么'}</h2><p className="mt-1 text-xs text-slate-400">{isManager?'处理能力装配、升级冲突、经验审核和高影响确认。':'从异常和 Luna 判断出发，完成决策、执行与效果验证。'}</p></div><div className="flex flex-wrap gap-1 rounded-xl bg-slate-900 p-1"><span className="px-2 py-2 text-[10px] text-slate-500">演示身份</span>{[['platform_admin','平台管理员'],['brand_admin','品牌管理员'],['optimizer','优化师']].map(([id,label])=><button key={id} onClick={()=>{switchRole(id);if(id==='platform_admin')navigate('/admin/capabilities')}} className={`rounded-lg px-3 py-2 text-xs font-semibold ${(id==='platform_admin'&&user.platformRole==='platform_admin')||(id==='brand_admin'&&role==='admin')||(id==='optimizer'&&role==='member')?'bg-white text-slate-950':'text-slate-300 hover:bg-slate-800'}`}>{label}</button>)}</div></header><div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">{items.map(({title,detail,count,icon:Icon,action,button})=><article key={title} className="flex min-h-48 flex-col bg-white p-5"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${count?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'}`}><Icon size={17}/></span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${count?'bg-amber-50 text-amber-700':'bg-slate-100 text-slate-500'}`}>{count?`${count} 项待处理`:'状态正常'}</span></div><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 flex-1 text-xs leading-5 text-slate-500">{detail}</p><button onClick={action} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-700">{button}<ArrowRight size={13}/></button></article>)}</div></section>
}
export default RoleWorkSummary
