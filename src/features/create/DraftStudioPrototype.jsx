import { useMemo, useState } from 'react'
import { demoCreatives, demoDraftStructure, demoLaunchQa } from '../../data/adsgo2DemoData'

const statusStyle = {
  待发布: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  文案待确认: 'border-amber-200 bg-amber-50 text-amber-700',
  pass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
}

const findCreative = (creativeId) => demoCreatives.find((creative) => creative.id === creativeId)

const fieldLabels = {
  name: '名称',
  objective: '目标',
  budget: '预算',
  platform: '平台',
  audience: '受众',
  primaryText: '广告文案',
  status: '状态',
}

const qaStatusLabel = {
  pass: '通过',
  warning: '待确认',
}

const DraftTree = ({ selectedNodeId, onSelectNode }) => (
  <div className="space-y-3">
    <button
      onClick={() => onSelectNode(demoDraftStructure.campaign.id)}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors active:scale-[0.99] ${
        selectedNodeId === demoDraftStructure.campaign.id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">Campaign</p>
      <p className="mt-1 text-sm font-semibold">{demoDraftStructure.campaign.name}</p>
    </button>

    {demoDraftStructure.adsets.map((adset) => (
      <div key={adset.id} className="space-y-2 border-l border-slate-200 pl-4">
        <button
          onClick={() => onSelectNode(adset.id)}
          className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors active:scale-[0.99] ${
            selectedNodeId === adset.id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">AdSet</p>
          <p className="mt-1 text-sm font-semibold">{adset.name}</p>
        </button>
        {adset.ads.map((ad) => (
          <button
            key={ad.id}
            onClick={() => onSelectNode(ad.id)}
            className={`ml-4 w-[calc(100%-1rem)] rounded-2xl border px-4 py-3 text-left transition-colors active:scale-[0.99] ${
              selectedNodeId === ad.id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">Ad</p>
            <p className="mt-1 text-sm font-semibold">{ad.name}</p>
          </button>
        ))}
      </div>
    ))}
  </div>
)

const NodeEditor = ({ node }) => {
  if (!node) return null

  const creative = node.creativeId ? findCreative(node.creativeId) : null

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.2)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">当前审核对象</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{node.name}</h2>
        </div>
        {node.status && (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[node.status] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>
            {String(node.status).replaceAll('_', ' ')}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(node)
          .filter(([key]) => !['id', 'ads', 'creativeId'].includes(key))
          .map(([key, value]) => (
            <label key={key} className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{fieldLabels[key] || key}</span>
              <input
                value={String(value)}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
              />
            </label>
          ))}
      </div>

      {creative && (
        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">素材预览</p>
          <div className="mt-3 grid grid-cols-[96px_1fr] gap-4">
            <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-900 text-center text-xs font-semibold text-white">
              {creative.format}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{creative.name}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{creative.signal}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">CTR {creative.ctr.toFixed(2)}%</span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">Freq {creative.frequency.toFixed(1)}</span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{creative.lifecycle}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const LaunchQaPanel = () => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">发布审核</p>
    <h3 className="mt-1 text-lg font-semibold text-slate-950">发布前检查</h3>
    <div className="mt-4 space-y-3">
      {demoLaunchQa.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle[item.status]}`}>
              {qaStatusLabel[item.status] || item.status}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
        </div>
      ))}
    </div>
  </section>
)

const DraftStudioPrototype = () => {
  const defaultNodeId = demoDraftStructure.campaign.id
  const [selectedNodeId, setSelectedNodeId] = useState(defaultNodeId)

  const selectedNode = useMemo(() => {
    if (selectedNodeId === demoDraftStructure.campaign.id) return demoDraftStructure.campaign
    for (const adset of demoDraftStructure.adsets) {
      if (adset.id === selectedNodeId) return adset
      const ad = adset.ads.find((item) => item.id === selectedNodeId)
      if (ad) return ad
    }
    return demoDraftStructure.campaign
  }, [selectedNodeId])

  return (
    <div className="-mx-6 min-h-[100dvh] bg-slate-100 px-6 py-6 text-slate-900 lg:px-8">
      <div className="w-full space-y-5">
        <header className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.22)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{demoDraftStructure.name}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{demoDraftStructure.strategySummary}</p>
          </section>
          <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">换新策略</p>
            <h2 className="mt-2 text-xl font-semibold">疲劳视频被替换为两条 UGC Hook。</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Prospecting 使用新素材，Retargeting 继续保留客户证言轮播。
            </p>
          </section>
        </header>

        <main className="grid grid-cols-1 gap-5 xl:grid-cols-[330px_1fr_360px]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">投放结构</p>
            <div className="mt-4">
              <DraftTree selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
            </div>
          </section>

          <NodeEditor node={selectedNode} />

          <div className="space-y-5">
            <LaunchQaPanel />
            <section className="rounded-[28px] border border-sky-200 bg-sky-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">客户偏好</p>
              <p className="mt-3 text-sm leading-6 text-sky-950">
                促销周再营销保留客户证言素材。后续同类活动可默认保留该规则。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full bg-sky-950 px-3 py-1.5 text-xs font-semibold text-white active:scale-[0.98]">
                  记录为偏好
                </button>
                <button className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 active:scale-[0.98]">
                  跳过
                </button>
              </div>
            </section>
          </div>
        </main>

        <div className="sticky bottom-5 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">待发布检查</p>
              <p className="mt-1 text-xs text-slate-500">3 ads, 2 adsets, $95/day. 1 条文案仍需确认。</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]">
                保存草稿
              </button>
              <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]">
                查看发布影响
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DraftStudioPrototype
