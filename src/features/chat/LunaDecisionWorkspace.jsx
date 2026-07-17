import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, ChevronRight, Database, Eye, GitMerge, PencilLine, Sparkles, Target, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import useBrandStore from '@stores/brandStore'

const LunaDecisionWorkspace = () => {
  const navigate = useNavigate()
  const scenario = useMarketingOpsStore((state) => state.serviceScenario)
  const createAction = useMarketingOpsStore((state) => state.createAction)
  const addLearning = useMarketingOpsStore((state) => state.addLearningRecord)
  const views = useMarketingOpsStore((state) => state.views)
  const brand = useBrandStore((state) => state.selectedBrand)
  const brandKnowledge = useBrandStore((state) => state.brandKnowledge[brand] || [])
  const industryKnowledge = useBrandStore((state) => state.industryKnowledge)
  const industrySkills = useBrandStore((state) => state.industrySkills)
  const installation = useBrandStore((state) => state.capabilityInstallations[brand])
  const [drawer, setDrawer] = useState(false)
  const [decision, setDecision] = useState(null)
  const [notice, setNotice] = useState('')
  const [reason, setReason] = useState('')
  const [reasonType, setReasonType] = useState('品牌特殊要求')
  const [percent, setPercent] = useState(10)
  const [target, setTarget] = useState('US Prospecting Broad')
  const [window, setWindow] = useState('72 小时')
  const skill = industrySkills.find((item) => item.id === scenario.skillIds[0])
  const view = views.find((item) => item.id === scenario.viewId)
  const usedKnowledge = [...industryKnowledge.filter((item) => scenario.knowledgeIds.includes(item.id)), ...brandKnowledge]

  const create = (kind) => {
    const modified = kind === 'modify'
    createAction({
      actionId: `action-${Date.now()}`, recommendationId: scenario.recommendationId, campaignId: scenario.campaignId,
      skillId: scenario.skillIds[0], skillVersion: skill?.version || 'v1.2', viewId: scenario.viewId,
      knowledgeIds: scenario.knowledgeIds, type: kind === 'observe' ? '观察任务' : '预算与素材组合动作',
      source: 'Luna 工作台', target, before: 'ROAS 1.82 · 主视频频次 4.7',
      originalSuggestion: '冷启动预算下调 15%，替换主视频；再营销保持',
      action: kind === 'observe' ? `保持当前预算，观察 ${window}` : `冷启动预算下调 ${modified ? percent : 15}%，替换主视频；再营销保持`,
      difference: modified ? `预算调整幅度 -15% → -${percent}%` : '无',
      decision: kind === 'observe' ? '暂时观察' : modified ? '修改后采纳' : '采纳',
      decisionReason: reason || undefined, approvedBy: '优化师', verificationWindow: window,
      status: kind === 'observe' ? '验证中' : '待执行',
    })
    setDecision(null); setReason('')
    setNotice(kind === 'observe' ? `已创建 ${window} 观察任务` : '已生成运营动作，等待在业务模块执行')
  }

  const reject = () => {
    if (!reason.trim()) return
    addLearning({ type: '拒绝原因', title: '本次不执行冷启动预算调整', detail: `${reasonType}：${reason}`, source: `Luna 建议 ${scenario.recommendationId}`, recommendationIds: [scenario.recommendationId], impacts: ['后续预算建议'], status: '候选' })
    setDecision(null); setReason(''); setNotice('拒绝原因已形成品牌学习候选，审核后才会生效')
  }

  return (
    <section className="workspace-section">
      <header className="workspace-section-header bg-primary-50/45">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700"><Sparkles size={14} />Luna 待确认判断</div>
          <h2 className="mt-1.5 text-base font-semibold text-neutral-950">{scenario.title}</h2>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{scenario.problem}</p>
        </div>
        <button onClick={() => setDrawer(true)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-700 hover:border-primary-200 hover:text-primary-700">查看依据<ChevronRight size={14} /></button>
      </header>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {[['数据事实', 'ROAS 1.82', '低于目标 24%'], ['素材信号', '频次 4.7', 'CTR 较峰值 -28.4%'], ['影响范围', '美国冷启动', '1 个 Campaign']].map(([label, value, detail]) => (
            <div key={label} className="border-l-2 border-neutral-200 pl-3"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 text-sm font-semibold text-neutral-950">{value}</p><p className="mt-0.5 text-xs text-neutral-400">{detail}</p></div>
          ))}
        </div>

        <div className="mt-5 border-t border-neutral-200 pt-5">
          <div className="flex items-start gap-3"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-warning-600" /><div><p className="text-xs font-semibold text-neutral-600">建议结论</p><p className="mt-1 text-sm leading-6 text-neutral-800">{scenario.conclusion}</p></div></div>
          <div className="mt-4 rounded-lg border border-success-200 bg-success-50 px-3 py-2.5 text-xs leading-5 text-success-800"><strong>品牌规则已生效：</strong>促销期保护再营销预算，因此仅调整冷启动并保留 48 小时观察。</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => create('accept')} className="h-10 rounded-lg bg-primary-600 px-3 text-xs font-semibold text-white hover:bg-primary-700">采纳建议</button>
          <button onClick={() => setDecision('modify')} className="h-10 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"><PencilLine size={13} className="mr-1 inline" />修改后采纳</button>
          <button onClick={() => setDecision('reject')} className="h-10 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-danger-700 hover:bg-danger-50"><X size={13} className="mr-1 inline" />拒绝并说明</button>
          <button onClick={() => setDecision('observe')} className="h-10 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"><Eye size={13} className="mr-1 inline" />暂时观察</button>
        </div>
      </div>

      {notice && <div role="status" className="border-t border-success-200 bg-success-50 px-5 py-3"><div className="flex items-start gap-2 text-xs font-medium text-success-800"><CheckCircle2 size={14} className="mt-0.5 shrink-0" /><span className="flex-1">{notice}</span></div><div className="mt-2 flex gap-4 pl-[22px] text-xs font-semibold text-success-800"><button onClick={() => navigate('../ads/campaigns')}>去执行</button><button onClick={() => navigate('../insight/operations-closure')} className="inline-flex items-center gap-1">查看动作链<ArrowRight size={12} /></button></div></div>}

      {drawer && <EvidenceDrawer skill={skill} view={view} installation={installation} usedKnowledge={usedKnowledge} onClose={() => setDrawer(false)} />}
      {decision && <DecisionModal type={decision} percent={percent} setPercent={setPercent} target={target} setTarget={setTarget} window={window} setWindow={setWindow} reason={reason} setReason={setReason} reasonType={reasonType} setReasonType={setReasonType} onClose={() => setDecision(null)} onConfirm={() => decision === 'reject' ? reject() : create(decision)} />}
    </section>
  )
}

const EvidenceDrawer = ({ skill, view, installation, usedKnowledge, onClose }) => {
  const evidence = [
    [Sparkles, '使用 Skill', `${skill?.name || '电商预算健康检查'} ${skill?.version || 'v1.2'}`, `${skill?.steps?.length || 5} 个判断步骤`],
    [Database, '使用数据', `${view?.name || 'Campaign 效率拆解'} · 近 7 天`, 'ROAS、CPA、频次数据完整'],
    [Target, '品牌目标', installation?.overrides?.goal || 'ROAS ≥ 2.40', `预算上限 ${installation?.overrides?.budget || '$300 / 日'}`],
    [BookOpen, '引用知识', `${usedKnowledge.length || 3} 条行业与品牌知识`, usedKnowledge.map((item) => item.title).join(' · ') || '投放基准 · 素材疲劳 · 促销保护'],
  ]
  return <div className="fixed inset-0 z-[2000] flex justify-end bg-neutral-950/40" onMouseDown={onClose}><aside onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-neutral-50 shadow-xl"><header className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-200 bg-white p-5"><div><p className="workspace-kicker">Decision evidence</p><h2 className="mt-1 text-lg font-semibold text-neutral-950">这次判断如何形成</h2><p className="mt-1 text-xs text-neutral-500">依据保留版本与快照，便于复盘。</p></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-neutral-100"><X size={17} /></button></header><div className="space-y-3 p-5">{evidence.map(([Icon, title, value, detail], index) => <section key={title} className="rounded-xl border border-neutral-200 bg-white p-4"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700"><Icon size={16} /></span><div><p className="text-xs font-medium text-neutral-500">0{index + 1} · {title}</p><p className="mt-1 text-sm font-semibold text-neutral-900">{value}</p><p className="mt-1 text-xs leading-5 text-neutral-500">{detail}</p></div></div></section>)}<section className="rounded-xl border border-neutral-200 bg-white p-4"><div className="flex items-center gap-2"><GitMerge size={16} className="text-primary-700" /><h3 className="text-sm font-semibold">规则合成</h3></div><div className="mt-4 space-y-0">{[['行业判断', '低于目标且素材疲劳，降低低效预算并换新'], ['品牌覆盖', '促销期保护高意向再营销预算'], ['最终建议', '冷启动 -15% 并换新；再营销保持并观察']].map(([title, value], index) => <div key={title} className="relative flex gap-3 pb-4 last:pb-0"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">{index + 1}</span><div><p className="text-xs font-semibold text-neutral-800">{title}</p><p className="mt-1 text-xs leading-5 text-neutral-500">{value}</p></div></div>)}</div></section></div></aside></div>
}

const DecisionModal = ({ type, percent, setPercent, target, setTarget, window, setWindow, reason, setReason, reasonType, setReasonType, onClose, onConfirm }) => <div className="fixed inset-0 z-[2000] grid place-items-center bg-neutral-950/45 p-4" onMouseDown={onClose}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"><h3 className="text-base font-semibold text-neutral-950">{type === 'modify' ? '修改后采纳' : type === 'reject' ? '拒绝 Luna 建议' : '设置观察任务'}</h3><p className="mt-1 text-xs text-neutral-500">系统会同时保存原建议、最终判断和原因。</p>{type === 'modify' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">执行对象<input value={target} onChange={(event) => setTarget(event.target.value)} className="enhanced-input mt-1.5 min-h-11" /></label><label className="text-xs font-semibold">预算下调比例<div className="mt-1.5 flex min-h-11 items-center rounded-lg border border-neutral-200 px-3"><input type="number" min="1" max="50" value={percent} onChange={(event) => setPercent(Number(event.target.value))} className="w-full outline-none" /><span>%</span></div></label></div>}{type === 'reject' && <label className="mt-4 block text-xs font-semibold">原因类型<select value={reasonType} onChange={(event) => setReasonType(event.target.value)} className="enhanced-select mt-1.5 min-h-11">{['数据判断不准确', '品牌特殊要求', '当前处于学习期', '客户明确要求', '风险过高', '其他'].map((item) => <option key={item}>{item}</option>)}</select></label>}{type === 'observe' && <label className="mt-4 block text-xs font-semibold">观察窗口<select value={window} onChange={(event) => setWindow(event.target.value)} className="enhanced-select mt-1.5 min-h-11">{['24 小时', '48 小时', '72 小时', '7 天'].map((item) => <option key={item}>{item}</option>)}</select></label>}<label className="mt-4 block text-xs font-semibold">{type === 'reject' ? '补充说明' : '判断原因'}<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="例如：需要保留更多学习量" className="enhanced-input mt-1.5 min-h-24 py-2.5" /></label><div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="h-10 rounded-lg border border-neutral-200 px-4 text-sm font-semibold text-neutral-700">取消</button><button disabled={type !== 'observe' && !reason.trim()} onClick={onConfirm} className="h-10 rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white disabled:opacity-30">确认并记录</button></div></div></div>

export default LunaDecisionWorkspace
