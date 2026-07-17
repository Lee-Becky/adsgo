import { ArrowRight, BookOpen, CheckCircle2, Database, MousePointerClick, Sparkles } from 'lucide-react'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const ActionTracePanel = () => {
  const actions = useMarketingOpsStore((state) => state.actions)
  const views = useMarketingOpsStore((state) => state.views)
  const item = actions[0]
  if (!item) return null
  const nodes = [
    ['发现', item.before || '经营指标异常', Database],
    ['判断', item.skillId ? '预算健康检查' : '人工判断', Sparkles],
    ['决策', `${item.decision || '采纳'}${item.decisionReason ? ` · ${item.decisionReason}` : ''}`, MousePointerClick],
    ['执行', item.action, ArrowRight],
    ['验证', item.result || `等待 ${item.verificationWindow} 验证`, CheckCircle2],
  ]
  return <section className="workspace-section"><header className="workspace-section-header"><div><p className="workspace-kicker">当前证据链</p><h2 className="mt-1 text-base font-semibold text-neutral-950">{item.target}</h2><p className="mt-1 text-xs text-neutral-500">来源建议 {item.recommendationId || '人工创建'} · 动作 ID {item.actionId || item.id}</p></div><span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{item.status}</span></header><div className="grid lg:grid-cols-5">{nodes.map(([label, value, Icon], index) => <div key={label} className={`relative min-h-28 p-4 ${index ? 'border-t border-neutral-200 lg:border-l lg:border-t-0' : ''}`}><div className="flex items-center gap-2"><span className="text-xs font-semibold text-neutral-400">0{index + 1}</span><Icon size={14} className="text-primary-600"/><span className="text-xs font-semibold text-neutral-700">{label}</span></div><p className="mt-3 text-xs font-medium leading-5 text-neutral-700">{value}</p></div>)}</div><footer className="flex flex-wrap gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500"><span className="inline-flex items-center gap-1"><Database size={12}/>{views.find((entry) => entry.id === item.viewId)?.name || '关联数据视图'}</span><span className="inline-flex items-center gap-1"><BookOpen size={12}/>{item.knowledgeIds?.length || 0} 条知识依据</span></footer></section>
}

export default ActionTracePanel
