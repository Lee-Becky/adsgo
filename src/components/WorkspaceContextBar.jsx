import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const CONTEXTS=[
 {match:'ads/campaigns',role:'管理在投 Campaign、AdSet 与 Ad，并处理附着在广告对象上的建议。',links:[['查看今日建议','chat'],['查看执行效果','insight/operations-closure']]},
 {match:'create/draft',role:'集中暂存人工创编、AI 推荐、策略或素材换新产生的未发布 Campaign。',links:[['创建新广告','create/bulk-launch'],['查看素材库','creative/library']]},
 {match:'create/bulk-launch',role:'用于创建或编辑广告结构并完成发布检查；它不是所有 Campaign 的必经步骤。',links:[['查看草稿','create/draft'],['返回广告管理','ads/campaigns']]},
 {match:'creative/',role:'管理素材资产与生成方向，结果可以用于草稿、在投广告或策略任务。',links:[['查看草稿','create/draft'],['分析素材表现','insight/dashboard']]},
 {match:'insight/',role:'解释经营事实、验证动作效果并形成报告或可沉淀经验。',links:[['让 Luna 分析','chat'],['进入计划与策略','plan/media-plan']]},
 {match:'plan/',role:'围绕经营目标形成周期策略和团队待办，不替代具体广告或素材操作。',links:[['查看核心数据','insight/dashboard'],['打开今日工作','chat']]},
 {match:'settings/',role:'维护当前品牌的稳定上下文、能力和运营规则；普通日常工作从今日工作台开始。',links:[['返回今日工作','chat'],['查看计划与策略','plan/media-plan']]},
]

const WorkspaceContextBar=()=>{const location=useLocation(),navigate=useNavigate(),path=location.pathname.replace(/^\/workspace\/[^/]+\//,''),config=CONTEXTS.find(x=>path.includes(x.match));if(!config||path==='chat')return null;const prefix=location.pathname.match(/^\/workspace\/[^/]+/)?.[0]||'/workspace/default';return <div className="border-b border-neutral-200 bg-neutral-50/85 px-6 py-2.5"><div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between"><div className="flex min-w-0 items-center gap-2 text-xs text-neutral-500"><Compass size={14} className="shrink-0 text-primary-600"/><span className="truncate">{config.role}</span></div><div className="flex shrink-0 flex-wrap items-center gap-1.5"><span className="mr-1 hidden text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:inline">相关工作</span>{config.links.map(([label,target],i)=><button key={target} onClick={()=>navigate(`${prefix}/${target}`)} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 text-[11px] font-semibold text-neutral-600 hover:border-primary-200 hover:text-primary-700">{i===0&&target==='chat'?<Sparkles size={11}/>:null}{label}<ArrowRight size={11}/></button>)}</div></div></div>}
export default WorkspaceContextBar
