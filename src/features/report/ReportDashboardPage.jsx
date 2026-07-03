import { useState } from 'react'
import { Calendar, ChevronDown, Copy, Download, Share2 } from 'lucide-react'
import useLunaSync from '@features/chat/useLunaSync'
import { CAMPAIGN_PERFORMANCE } from './reportMockData'

const REPORT_DATE = '2026年6月29日'
const BRAND = 'LumaFit'
const MARKET = '美国市场'

const snapshot = [
  { label: '花费', value: '$303', target: '预算内', delta: '较昨日 +22%', tone: 'neutral' },
  { label: 'ROAS', value: '1.82x', target: '目标 2.40', delta: '低于目标', tone: 'bad' },
  { label: 'CPA', value: '$42.80', target: '红线 $45', delta: '接近红线', tone: 'warn' },
  { label: '购买', value: '26', target: '昨日 28', delta: '较昨日 -7%', tone: 'bad' },
]

const whatHappened = [
  '美国市场整体 ROAS 下滑至 1.82，主要受冷启动 Campaign 转化效率下降影响。',
  '主视频 Core Legging Video V12 出现疲劳信号，CTR 较上周下降约 28%。',
  '再营销 Campaign 表现相对稳定，ROAS 1.88，促销周期间继续保留曝光。',
]

const whatWeDid = [
  {
    action: '下调冷启动预算',
    detail: 'US Prospecting Broad 日预算由 $140 调整为 $95，减少无效花费。',
  },
  {
    action: '保留再营销预算',
    detail: 'US Retargeting Purchase 维持 $180/日，保障促销周高意向用户触达。',
  },
  {
    action: '启动素材换新',
    detail: '两条 UGC Hook 素材已进入草稿，计划本周内替换疲劳主视频。',
  },
]

const watchTomorrow = [
  '冷启动降预算后，CPA 是否回落至 $45 以内。',
  '再营销 ROAS 能否稳定在 1.90 以上。',
  '新 UGC 素材发布后，冷启动 CTR 是否回升。',
]

const toneStyle = {
  bad: 'text-danger-700 bg-danger-50 border-danger-100',
  warn: 'text-warning-700 bg-warning-50 border-warning-100',
  good: 'text-success-700 bg-success-50 border-success-100',
  neutral: 'text-neutral-600 bg-neutral-50 border-neutral-100',
}

const ReportDashboardPage = () => {
  const [showDetail, setShowDetail] = useState(false)
  const [copied, setCopied] = useState(false)
  const [actionNotice, setActionNotice] = useState('')
  const { hasApplied } = useLunaSync('report/daily-brief')
  const lunaHighlight = hasApplied

  const handleCopy = () => {
    const text = [
      `${BRAND} 投放日报 · ${REPORT_DATE}`,
      '',
      `今日 ${MARKET} ROAS 1.82，低于目标 2.40。已下调冷启动预算，保留再营销曝光，并启动素材换新。`,
      '',
      '今日情况：',
      ...whatHappened.map((item, i) => `${i + 1}. ${item}`),
      '',
      '今日处理：',
      ...whatWeDid.map((item, i) => `${i + 1}. ${item.action}：${item.detail}`),
      '',
      '明日观察：',
      ...watchTomorrow.map((item, i) => `${i + 1}. ${item}`),
    ].join('\n')
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const flashAction = (message) => {
    setActionNotice(message)
    setTimeout(() => setActionNotice(''), 2200)
  }

  return (
    <div className="-mx-6 min-h-[100dvh] bg-neutral-100 px-6 py-6 lg:px-8">
      <article className="w-full space-y-6">
        {/* 报头 */}
        <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">{MARKET}</p>
            <p className="mt-1 text-sm text-neutral-500">{REPORT_DATE}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => flashAction('日期切换将在接入真实数据后开放')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <Calendar size={14} />
              今日
              <ChevronDown size={12} />
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <Copy size={14} />
              {copied ? '已复制' : '复制全文'}
            </button>
            <button
              type="button"
              onClick={() => flashAction('分享链接已复制到剪贴板（演示）')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <Share2 size={14} />
              分享
            </button>
            <button
              type="button"
              onClick={() => flashAction('PDF 导出任务已加入队列（演示）')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <Download size={14} />
              导出 PDF
            </button>
          </div>
          {actionNotice && (
            <p className="text-xs font-medium text-primary-600">{actionNotice}</p>
          )}
        </header>

        {/* 今日结论 */}
        <section className={`rounded-xl border bg-white p-6 shadow-sm ${lunaHighlight ? 'border-luna-border ring-1 ring-luna-violet/20' : 'border-neutral-200'}`}>
          <h2 className="text-base font-semibold text-neutral-950">今日结论</h2>
          <p className="mt-3 max-w-5xl text-[15px] leading-7 text-neutral-800">
            今日 {MARKET} ROAS 为 <strong>1.82</strong>，低于月度目标 2.40。
            主要问题是冷启动转化效率下降，叠加主视频疲劳。
            我们已将冷启动日预算从 $140 下调至 $95，再营销预算维持 $180 以保障促销周曝光，
            并启动 UGC 素材换新。
          </p>
        </section>

        {/* 核心指标 */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {snapshot.map((item) => (
            <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-950">{item.value}</p>
              <p className="mt-1 text-xs text-neutral-400">{item.target}</p>
              <span className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium ${toneStyle[item.tone]}`}>
                {item.delta}
              </span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 今日情况 */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">今日情况</h2>
          <ul className="mt-4 space-y-3">
            {whatHappened.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-6 text-neutral-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 今日处理 */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">今日处理</h2>
          <div className="mt-4 space-y-4">
            {whatWeDid.map((item) => (
              <div key={item.action} className="border-l-2 border-neutral-900 pl-4">
                <p className="text-sm font-semibold text-neutral-950">{item.action}</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 明日观察 */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">明日观察</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-6 text-neutral-700">
            {watchTomorrow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
        </div>

        {/* Campaign 简表 */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">Campaign 表现</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Campaign</th>
                  <th className="pb-3 pr-4 text-right font-medium">花费</th>
                  <th className="pb-3 pr-4 text-right font-medium">ROAS</th>
                  <th className="pb-3 text-right font-medium">CPA</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_PERFORMANCE.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-neutral-900">{row.name}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-neutral-700">${row.spend}</td>
                    <td className={`py-3 pr-4 text-right tabular-nums font-medium ${row.roas >= 2.4 ? 'text-success-600' : row.roas >= 1.8 ? 'text-warning-600' : 'text-danger-600'}`}>
                      {row.roas.toFixed(2)}x
                    </td>
                    <td className="py-3 text-right tabular-nums text-neutral-700">${row.cpa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 附录：明细数据（可展开） */}
        <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <span>附录：每日明细数据</span>
            <ChevronDown size={16} className={`transition-transform ${showDetail ? 'rotate-180' : ''}`} />
          </button>
          {showDetail && (
            <div className="border-t border-neutral-100 px-6 pb-6">
              <p className="py-3 text-xs text-neutral-400">以下为内部核对用明细，一般不放入客户分享版本。</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="pb-2 pr-3">Campaign</th>
                    <th className="pb-2 pr-3 text-right">曝光</th>
                    <th className="pb-2 pr-3 text-right">点击</th>
                    <th className="pb-2 pr-3 text-right">CTR</th>
                    <th className="pb-2 pr-3 text-right">加购</th>
                    <th className="pb-2 text-right">购买</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGN_PERFORMANCE.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-50">
                      <td className="py-2 pr-3 text-neutral-800">{row.name}</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-neutral-600">{row.impressions.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-neutral-600">{row.clicks}</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-neutral-600">{row.ctr}%</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-neutral-600">{row.addToCart}</td>
                      <td className="py-2 text-right tabular-nums text-neutral-600">{row.purchases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="pb-8 text-center text-xs text-neutral-400">
          由 AdsGo 自动生成 · {REPORT_DATE}
        </footer>
      </article>
    </div>
  )
}

export default ReportDashboardPage
