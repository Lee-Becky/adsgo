import { ArrowRight, BarChart3, BookOpen, CalendarClock, Database, FileBarChart, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLunaStore from '@stores/lunaStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'

const LunaCommandCenter = () => {
  const navigate = useNavigate()
  const [source, setSource] = useState('渠道经营总览')
  const [notice, setNotice] = useState('')
  const openChatWithBriefing = useLunaStore((s) => s.openChatWithBriefing)
  const setSyncData = useLunaStore((s) => s.setSyncData)
  const addTask = useMarketingOpsStore((s) => s.addTask)
  const addReportHistory = useMarketingOpsStore((s) => s.addReportHistory)
  const createDeliverable = useMarketingOpsStore((s) => s.createDeliverable)
  const brand = useBrandStore((s) => s.selectedBrand)
  const skills = useBrandStore((s) => s.brandSkills?.[brand] || [])
  const flash = (message) => { setNotice(message); setTimeout(() => setNotice(''), 2200) }
  const scenarios = [
    { title: '诊断今日异常', desc: '调用预算健康与异常波动 Skill，定位需要优先判断的账户。', icon: BarChart3, skill: '预算健康检查', action: () => openChatWithBriefing(`请基于「${source}」诊断今日异常，并引用品牌目标、知识和历史动作说明原因。`) },
    { title: '准备预算动作', desc: '生成可确认的预算建议，写入广告管理而不直接执行。', icon: ShieldCheck, skill: '预算红线检查', action: () => { setSyncData('ads/campaigns', { payload: { summary: '英国 TikTok 日预算建议下调 15%', suggestedBudget: 680, reason: 'ROAS 连续三日低于目标' } }); flash('预算建议已生成，等待确认'); navigate('../ads/campaigns') } },
    { title: '安排周期检查', desc: '把当前分析方法保存为每日自动任务。', icon: CalendarClock, skill: '异常波动诊断', action: () => { addTask({ name: 'Luna 每日经营健康检查', skill: '异常波动诊断', schedule: '每天 09:00', source }); flash('定时任务已创建') } },
    { title: '生成经营报告', desc: '使用当前数据口径、策略和动作效果生成报告。', icon: FileBarChart, skill: '周度经营报告', action: () => { const name = `${brand} 周度经营报告`; addReportHistory({ name, type: '周报' }); createDeliverable({ name: `${name}.pdf`, type: '经营报告', source, generatedBy: 'Luna', time: '刚刚' }); flash('报告已生成并加入交付物') } },
  ]
  return <section className="workspace-section"><header className="workspace-section-header"><div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-700"><WandSparkles size={18}/></span><div><h3 className="text-sm font-semibold text-neutral-950">让 Luna 开始工作</h3><p className="mt-1 text-xs text-neutral-500">选择数据口径，调用已经装配的 Skill。</p></div></div><div className="flex flex-wrap items-center gap-2"><label className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-600"><Database size={14}/><select value={source} onChange={(e)=>setSource(e.target.value)} className="bg-transparent outline-none"><option>渠道经营总览</option><option>Campaign 效率拆解</option><option>素材疲劳视图</option><option>归因数据集</option></select></label><span className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-neutral-50 px-3 text-xs text-neutral-500"><BookOpen size={14}/>{skills.filter((x)=>x.enabled).length || 4} 个 Skill 可用</span></div></header><div className="grid border-neutral-200 md:grid-cols-2 xl:grid-cols-4">{scenarios.map(({title,desc,icon:Icon,skill,action},index)=><button key={title} onClick={action} className={`group min-h-44 bg-white p-5 text-left transition-colors hover:bg-neutral-50 ${index ? 'border-t border-neutral-200 md:border-l md:border-t-0' : ''}`}><div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-primary-600 group-hover:text-white"><Icon size={16}/></span><ArrowRight size={15} className="text-neutral-300 transition group-hover:translate-x-1 group-hover:text-primary-600"/></div><h4 className="mt-4 text-sm font-semibold text-neutral-900">{title}</h4><p className="mt-1.5 text-xs leading-5 text-neutral-500">{desc}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-700"><Sparkles size={11}/>{skill}</span></button>)}</div>{notice&&<div role="status" className="border-t border-success-200 bg-success-50 px-5 py-3 text-xs font-medium text-success-800">{notice}</div>}</section>
}
export default LunaCommandCenter
