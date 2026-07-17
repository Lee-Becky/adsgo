import { BookOpen, Factory, GitBranch, LogOut, Send, ShieldCheck } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'

const items = [
  { tab: 'skills', label: '行业 Skill', icon: Factory },
  { tab: 'knowledge', label: '公共知识库', icon: BookOpen },
  { tab: 'candidates', label: '行业候选能力', icon: GitBranch },
  { tab: 'distribution', label: '能力包与分发', icon: Send },
]

const PlatformAdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const brand = useBrandStore((s) => s.selectedBrand)
  const active = new URLSearchParams(location.search).get('tab') || 'skills'
  return <div className="min-h-screen bg-[#f3f5f7] text-neutral-950">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="border-b border-slate-800 px-6 py-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950"><ShieldCheck size={20}/></span><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-300">AdsGo Platform</p><h1 className="mt-1 text-sm font-bold">能力管理后台</h1></div></div><p className="mt-4 text-xs leading-5 text-slate-400">生产、审核和分发跨品牌复用的行业能力。</p></div>
      <nav className="flex-1 space-y-1 p-3">{items.map(({tab,label,icon:Icon})=><button key={tab} onClick={()=>navigate(`/admin/capabilities?tab=${tab}`)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold ${active===tab?'bg-cyan-400 text-slate-950':'text-slate-300 hover:bg-slate-900 hover:text-white'}`}><Icon size={17}/>{label}</button>)}</nav>
      <div className="border-t border-slate-800 p-3"><button onClick={()=>navigate(`/workspace/${encodeURIComponent(brand)}/settings/skills`)} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"><LogOut size={17}/>返回品牌工作区</button></div>
    </aside>
    <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b bg-white px-4 lg:ml-64 lg:px-8"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-700">独立平台空间</p><p className="mt-0.5 text-sm font-bold">行业能力生产与分发</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">平台管理员</span></header>
    <div className="flex gap-2 overflow-x-auto border-b bg-white p-3 lg:hidden">{items.map(({tab,label,icon:Icon})=><button key={tab} onClick={()=>navigate(`/admin/capabilities?tab=${tab}`)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${active===tab?'bg-slate-950 text-white':'bg-slate-100 text-slate-600'}`}><Icon size={14}/>{label}</button>)}</div>
    <main className="p-4 lg:ml-64 lg:p-8"><Outlet/></main>
  </div>
}

export default PlatformAdminLayout
