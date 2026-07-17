import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Sparkles } from 'lucide-react'
import { chartAxis, chartGrid, chartTooltip, getChartColors } from '@/lib/chartTheme'

const kpis = [
  ['花费', '$303.10', '+22.4%', 'up', false],
  ['ROAS', '1.82x', '-18.3%', 'down', true],
  ['CPA', '$42.80', '+14.9%', 'down', true],
  ['CTR', '1.24%', '-28.4%', 'down', true],
  ['CPC', '$1.18', '+9.6%', 'down', true],
  ['购买', '26', '-6.1%', 'down', true],
  ['CVR', '2.14%', '-11.2%', 'down', true],
  ['加购', '84', '+3.7%', 'up', false],
]

const trendData = [
  { date: '6/23', roas: 2.62, spend: 248, purchases: 34, ctr: 1.72 },
  { date: '6/24', roas: 2.48, spend: 262, purchases: 32, ctr: 1.64 },
  { date: '6/25', roas: 2.31, spend: 278, purchases: 30, ctr: 1.51 },
  { date: '6/26', roas: 2.16, spend: 286, purchases: 29, ctr: 1.42 },
  { date: '6/27', roas: 1.98, spend: 295, purchases: 27, ctr: 1.33 },
  { date: '6/28', roas: 1.91, spend: 301, purchases: 27, ctr: 1.28 },
  { date: '6/29', roas: 1.82, spend: 303, purchases: 26, ctr: 1.24 },
]

const audienceData = [
  { name: 'Broad Fitness Buyers', value: 118.2, cpa: 58.6, flag: '高 CPA' },
  { name: 'US 3% Lookalike', value: 96.7, cpa: 34.2, flag: '' },
  { name: 'Visitors 30D', value: 61.6, cpa: 41.5, flag: '' },
  { name: 'CA Expansion', value: 62.9, cpa: 29.4, flag: '稳定' },
]

const pageData = [
  { name: 'Core Legging PDP', value: 126.4, cvr: 2.1, flag: '' },
  { name: 'Compression Fit LP', value: 118.2, cvr: 1.4, flag: '低 CVR' },
  { name: 'Customer Proof LP', value: 42.3, cvr: 2.5, flag: '' },
  { name: 'CA Product Page', value: 62.9, cvr: 2.9, flag: '稳定' },
]

const creativeData = [
  { name: 'Core Legging Video V12', spend: 1240, cpa: 58.6, status: '疲劳' },
  { name: 'Customer Proof Carousel', spend: 880, cpa: 42.8, status: '' },
  { name: 'Studio Static Set A', spend: 690, cpa: 44.1, status: '' },
  { name: 'UGC Hook 01', spend: 120, cpa: 31.4, status: '测试中' },
  { name: 'Morning Routine UGC', spend: 86, cpa: 28.7, status: '测试中' },
]

const lunaAnalysis = [
  {
    dimension: '账户',
    finding: '美国 ROAS 连续 7 天下降，花费增速快于转化恢复，预算节奏需要收紧。',
    action: '优先处理 Prospecting 冷启动浪费，再评估是否恢复放量。',
  },
  {
    dimension: '受众',
    finding: 'Broad Fitness Buyers 花费占比最高但 CPA $58.60，高于红线；Lookalike 3% 仍是效率最好的扩量入口。',
    action: '收缩 Broad，保留 Lookalike，观察 Visitors 30D 再营销窗口。',
  },
  {
    dimension: '落地页',
    finding: 'Compression Fit LP CVR 仅 1.4%，明显低于 Customer Proof LP 的 2.5%。',
    action: '减少冷启动流量导向 Compression Fit LP，优先导流到 PDP 和 Proof LP。',
  },
  {
    dimension: '素材',
    finding: 'Core Legging Video V12 高花费高 CPA，已进入疲劳区间；新 UGC 素材尚未形成有效消耗。',
    action: '替换主视频，用 UGC Hook 01 进入 Prospecting 测试。',
  },
]

const Card = ({ title, children, action }) => (
  <section className="workspace-section p-5">
    <div className="mb-4 flex items-start justify-between gap-3">
      <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
      {action}
    </div>
    {children}
  </section>
)

const TrendCard = ({ title, dataKey, color, unit, target, avg }) => (
  <Card title={title}>
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid {...chartGrid} />
          <XAxis dataKey="date" tick={chartAxis} />
          <YAxis tick={chartAxis} tickFormatter={(v) => `${v}${unit || ''}`} />
          <Tooltip contentStyle={chartTooltip} formatter={(value) => [`${value}${unit || ''}`, title]} />
          {target && <ReferenceLine y={target} stroke="var(--primary-500)" strokeDasharray="4 4" label={{ value: '目标', position: 'right', fill: 'var(--primary-500)', fontSize: 10 }} />}
          {avg && <ReferenceLine y={avg} stroke="var(--neutral-400)" strokeDasharray="2 2" label={{ value: '均值', position: 'right', fill: 'var(--neutral-400)', fontSize: 10 }} />}
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
)

const DonutInsight = ({ title, data, valueKey, valueLabel }) => {
  const colors = useMemo(() => getChartColors(), [])

  return (
    <Card title={title}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr]">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltip} formatter={(value) => [`$${value}`, '花费']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-500">${item.value}</p>
              </div>
              <div className="ml-2 text-right">
                <p className="font-mono text-sm font-semibold text-neutral-900">
                  {valueKey === 'cpa' ? `$${item[valueKey]}` : `${item[valueKey]}%`}
                </p>
                {item.flag && (
                  <span className="text-[10px] font-medium text-danger-600">{item.flag}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

const InsightDashboardPage = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [analysisTab, setAnalysisTab] = useState('trend')

  return (
    <div className="workspace-page space-y-4 text-neutral-900">
        <header className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="workspace-kicker">Business health</p><h1 className="mt-1 text-xl font-semibold text-neutral-950">经营健康诊断</h1><p className="mt-2 text-sm text-neutral-500">先看目标差距和异常，再进入对应维度定位原因。</p></div>
          <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
            {['7d', '14d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  dateRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                近{range === '7d' ? '7天' : range === '14d' ? '14天' : '30天'}
              </button>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-neutral-200 bg-white md:grid-cols-4 xl:grid-cols-8">
          {kpis.map(([label, value, delta, , isBad]) => (
            <div key={label} className={`border-b border-r border-neutral-200 p-4 ${isBad ? 'bg-danger-50/30' : 'bg-white'}`}>
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="mt-1 font-mono text-lg font-semibold text-neutral-950">{value}</p>
              <p className={`mt-1 text-xs font-semibold ${isBad ? 'text-danger-600' : 'text-neutral-500'}`}>{delta}</p>
            </div>
          ))}
        </section>

        <Card
          title="Luna 诊断摘要"
          action={
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
              <Sparkles size={12} /> Luna
            </span>
          }
        >
          <div className="grid grid-cols-1 divide-y divide-neutral-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {lunaAnalysis.map((item) => (
              <div key={item.dimension} className="px-4 py-3 first:pl-0 last:pr-0">
                <p className="text-xs font-semibold text-neutral-500">{item.dimension}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-800">{item.finding}</p>
                <p className="mt-2 text-xs font-medium text-primary-700">→ {item.action}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="operational-tabs max-w-full overflow-x-auto">{[['trend','核心趋势'],['dimensions','受众与落地页'],['creative','素材诊断']].map(([id,label])=><button key={id} onClick={()=>setAnalysisTab(id)} className={`whitespace-nowrap px-4 text-sm font-semibold ${analysisTab===id?'bg-white text-neutral-950 shadow-xs':'text-neutral-500'}`}>{label}</button>)}</div>

        {analysisTab === 'trend' && <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <TrendCard title="ROAS 趋势" dataKey="roas" color="var(--primary-500)" unit="x" target={2.4} avg={2.31} />
          <TrendCard title="花费趋势" dataKey="spend" color="var(--chart-2)" unit="$" />
        </section>}

        {analysisTab === 'dimensions' && <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutInsight title="受众：花费分布与 CPA" data={audienceData} valueKey="cpa" valueLabel="CPA" />
          <DonutInsight title="落地页：花费分布与 CVR" data={pageData} valueKey="cvr" valueLabel="CVR" />
        </section>}

        {analysisTab === 'creative' && <Card title="素材：CPA vs 花费">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid {...chartGrid} />
                  <XAxis type="number" dataKey="spend" name="花费" tick={chartAxis} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="number" dataKey="cpa" name="CPA" tick={chartAxis} tickFormatter={(v) => `$${v}`} />
                  <ReferenceLine y={45} stroke="var(--danger-400)" strokeDasharray="4 4" label={{ value: 'CPA 红线', position: 'right', fill: 'var(--danger-400)', fontSize: 10 }} />
                  <Tooltip contentStyle={chartTooltip} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={creativeData} fill="var(--primary-500)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {creativeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">${item.spend} · CPA ${item.cpa}</p>
                  </div>
                  {item.status && (
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${item.status === '疲劳' ? 'bg-danger-100 text-danger-700' : 'bg-primary-100 text-primary-700'}`}>
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>}
    </div>
  )
}

export default InsightDashboardPage
