import { Activity, ArrowRight, BrainCircuit, Check, CheckCircle2, Clock3, History, Play, X } from 'lucide-react'
import { useState } from 'react'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'
import ActionTracePanel from './ActionTracePanel'

const tabs = [['actions', '动作'], ['effects', '效果'], ['knowledge', '候选知识'], ['activity', '活动']]

const OperationsClosurePage = () => {
  const [tab, setTab] = useState('actions')
  const [verifying, setVerifying] = useState(null)
  const [notice, setNotice] = useState('')
  const actions = useMarketingOpsStore((state) => state.actions)
  const effects = useMarketingOpsStore((state) => state.effectTracks)
  const candidates = useMarketingOpsStore((state) => state.knowledgeCandidates)
  const activities = useMarketingOpsStore((state) => state.activityLog)
  const review = useMarketingOpsStore((state) => state.reviewKnowledgeCandidate)
  const execute = useMarketingOpsStore((state) => state.executeAction)
  const verify = useMarketingOpsStore((state) => state.verifyAction)
  const addBrandKnowledge = useBrandStore((state) => state.addBrandKnowledge)
  const accept = (item) => {
    addBrandKnowledge({ title: item.title, summary: item.summary, updateFrequency: '由效果验证持续更新', maintainer: 'Luna + 优化师', status: 'active', sourceType: '效果验证', sourceActionId: item.actionId, sourceRecommendationId: item.recommendationId })
    review(item.id, '已采纳')
    setNotice('候选经验已进入 L4 品牌知识；下一次同类 Luna 判断将引用它。')
  }

  return <div className="workspace-page space-y-4">
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="workspace-kicker">Learning loop</p><h1 className="mt-1 text-xl font-semibold text-neutral-950">效果与复盘</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">从实际动作验证效果，再决定是否沉淀为品牌经验。任何知识都能回溯到原始判断与数据。</p></div><div className="flex gap-4 text-xs text-neutral-500"><span><strong className="text-base text-neutral-950">{actions.filter((item) => item.status === '验证中').length}</strong> 验证中</span><span><strong className="text-base text-neutral-950">{candidates.filter((item) => item.status === '待审核').length}</strong> 待审核</span></div></section>
    <ActionTracePanel />
    {notice && <div role="status" className="flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-xs font-medium text-success-800"><CheckCircle2 size={14}/>{notice}</div>}
    <div className="operational-tabs max-w-full overflow-x-auto">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap px-4 text-sm font-semibold ${tab === id ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'}`}>{label}{id === 'knowledge' && <span className="ml-2 rounded-full bg-warning-100 px-1.5 py-0.5 text-[11px] text-warning-700">{candidates.filter((item) => item.status === '待审核').length}</span>}</button>)}</div>

    {tab === 'actions' && <section className="workspace-section"><div className="hidden grid-cols-[1.2fr_1fr_130px_150px] border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-semibold text-neutral-500 md:grid"><span>动作</span><span>依据与决策</span><span>状态</span><span className="text-right">下一步</span></div><div className="divide-y divide-neutral-200">{actions.map((item) => <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_130px_150px] md:items-center"><div><p className="text-xs font-medium text-primary-700">{item.type}</p><h3 className="mt-1 text-sm font-semibold text-neutral-900">{item.target}</h3><p className="mt-1 text-xs leading-5 text-neutral-500">{item.action}</p><p className="mt-1 text-xs text-neutral-400">执行前：{item.before}</p></div><div className="text-xs leading-5 text-neutral-500"><p>{item.source} · {item.proposedBy}</p><p>人工决策：{item.decision || '采纳'}</p>{item.difference && <p className="text-primary-700">差异：{item.difference}</p>}<p>审批：{item.approvedBy}</p></div><div><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === '已验证' ? 'bg-success-50 text-success-700' : item.status === '验证中' ? 'bg-warning-50 text-warning-700' : 'bg-neutral-100 text-neutral-600'}`}>{item.status === '已验证' ? <CheckCircle2 size={13}/> : <Clock3 size={13}/>} {item.status}</span></div><div className="flex justify-end gap-2">{item.status === '待执行' && <button onClick={() => { execute(item.id); setNotice('动作已执行，系统开始计算观察窗口。') }} className="inline-flex h-9 items-center gap-1 rounded-lg bg-neutral-900 px-3 text-xs font-semibold text-white"><Play size={13}/>标记执行</button>}{item.status === '验证中' && <button onClick={() => setVerifying(item)} className="h-9 rounded-lg bg-success-50 px-3 text-xs font-semibold text-success-700">填写结果</button>}{item.generatedCandidateId && <button onClick={() => setTab('knowledge')} className="h-9 rounded-lg border border-neutral-200 px-3 text-xs font-semibold">查看候选</button>}</div></article>)}</div></section>}

    {tab === 'effects' && <section className="workspace-section divide-y divide-neutral-200">{effects.map((item) => <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_160px] md:items-center"><div><div className="flex items-center gap-2"><Activity size={15} className="text-primary-600"/><h3 className="text-sm font-semibold text-neutral-900">{item.action}</h3></div><p className="mt-2 text-xs text-neutral-500">{item.window} · {item.owner}</p></div><div className="flex items-center gap-3 text-xs"><div><p className="text-neutral-400">执行前</p><p className="mt-1 text-neutral-700">{item.before}</p></div><ArrowRight size={15} className="text-neutral-400"/><div><p className="text-neutral-400">执行后</p><p className="mt-1 text-neutral-700">{item.after}</p></div></div><div className="text-right"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === '有效' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>{item.status}</span><p className="mt-2 text-lg font-semibold text-success-700">{item.change}</p></div></article>)}</section>}

    {tab === 'knowledge' && <section className="workspace-section divide-y divide-neutral-200">{candidates.map((item) => <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center"><div><div className="flex items-center gap-2"><BrainCircuit size={16} className="text-primary-600"/><h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3></div><p className="mt-2 text-sm leading-6 text-neutral-500">{item.summary}</p></div><div className="border-l border-neutral-200 pl-4 text-xs leading-5 text-neutral-500"><p><span className="text-neutral-400">来源：</span>{item.source}</p><p><span className="text-neutral-400">证据：</span>{item.evidence}</p><p><span className="text-neutral-400">建议：</span>{item.targetType}</p></div><div>{item.status === '待审核' ? <div className="flex gap-2"><button onClick={() => accept(item)} className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary-600 px-3 text-xs font-semibold text-white"><Check size={13}/>采纳</button><button onClick={() => review(item.id, '已忽略')} className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-xs font-semibold"><X size={13}/>忽略</button></div> : <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">{item.status}</span>}</div></article>)}</section>}

    {tab === 'activity' && <section className="workspace-section divide-y divide-neutral-200">{activities.map((item) => <article key={item.id} className="flex gap-4 px-5 py-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neutral-100"><History size={14}/></span><div><p className="text-sm text-neutral-800"><strong>{item.actor}</strong> · {item.action}</p><p className="mt-1 text-xs text-neutral-500">{item.object}</p><p className="mt-1 text-xs text-neutral-400">{item.time} · {item.module}</p></div></article>)}</section>}
    {verifying && (
      <VerifyModal
        item={verifying}
        onClose={() => setVerifying(null)}
        onConfirm={(effect, result) => {
          verify(verifying.id, effect, result)
          setVerifying(null)
          setNotice('效果已验证，并生成一条待审核的品牌候选知识。')
          setTab('knowledge')
        }}
      />
    )}
  </div>
}

const VerifyModal = ({ item, onClose, onConfirm }) => {
  const [effect, setEffect] = useState('有效')
  const [after, setAfter] = useState('ROAS 1.96 · CPA $45.80')
  const [reason, setReason] = useState('核心指标改善且购买量保持稳定，建议在相同条件下复用')
  return <div className="fixed inset-0 z-[2000] grid place-items-center bg-neutral-950/45 p-4" onMouseDown={onClose}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"><h3 className="text-base font-semibold text-neutral-950">验证动作效果</h3><p className="mt-1 text-xs text-neutral-500">{item.target} · 观察窗口 {item.verificationWindow}</p><div className="mt-4 grid grid-cols-3 gap-2">{['有效', '无效', '继续观察'].map((value) => <button key={value} onClick={() => setEffect(value)} className={`min-h-10 rounded-lg border text-xs font-semibold ${effect === value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600'}`}>{value}</button>)}</div><label className="mt-4 block text-xs font-semibold">执行后指标<input value={after} onChange={(event) => setAfter(event.target.value)} className="enhanced-input mt-1.5 min-h-11"/></label><label className="mt-4 block text-xs font-semibold">验证结论<textarea value={reason} onChange={(event) => setReason(event.target.value)} className="enhanced-input mt-1.5 min-h-24 py-2.5"/></label><div className="mt-4 rounded-lg bg-primary-50 p-3 text-xs leading-5 text-primary-800">确认后只生成候选知识，不会直接修改正式 Skill 或品牌规则。</div><div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="h-10 rounded-lg border border-neutral-200 px-4 text-sm font-semibold">取消</button><button onClick={() => onConfirm(effect, `${after}；${reason}`)} className="h-10 rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white">确认验证</button></div></div></div>
}

export default OperationsClosurePage
