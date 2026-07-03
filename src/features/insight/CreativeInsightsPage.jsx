import { useMemo } from 'react'
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { Palette } from 'lucide-react'
import { getChartColors, chartGrid, chartAxis, chartTooltip } from '@/lib/chartTheme'

/* ═══════════════════════════════════════════════════════════
   CreativeInsightsPage — Creative performance insights
   Scatter chart (CPA vs Spend) + ranked table
   ═══════════════════════════════════════════════════════════ */

const CREATIVE_DATA = [
  { name: 'Core Legging Video V12', spend: 1240, cpa: 58.60, roas: 1.38, impressions: 68400, ctr: 0.94 },
  { name: 'Customer Proof Carousel', spend: 880, cpa: 42.80, roas: 2.04, impressions: 41200, ctr: 1.88 },
  { name: 'Studio Static Set A', spend: 690, cpa: 44.10, roas: 1.69, impressions: 28600, ctr: 1.34 },
  { name: 'UGC Hook 01 - Compression Fit', spend: 0, cpa: 0, roas: 0, impressions: 0, ctr: 0 },
  { name: 'UGC Hook 02 - Morning Routine', spend: 0, cpa: 0, roas: 0, impressions: 0, ctr: 0 },
]

const sortedByCpa = [...CREATIVE_DATA].sort((a, b) => {
  if (a.cpa === 0) return 1
  if (b.cpa === 0) return -1
  return a.cpa - b.cpa
})

const cpaColor = (cpa) =>
  cpa <= 18 ? 'text-success-600' : cpa <= 24 ? 'text-warning-600' : 'text-danger-600'

const roasColor = (roas) =>
  roas >= 4 ? 'text-success-600' : roas >= 2.5 ? 'text-warning-600' : 'text-danger-600'

/* Custom tooltip for scatter chart */
const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-xl px-3 py-2 text-caption">
      <p className="font-semibold text-neutral-900 mb-1">{d.name}</p>
      <p className="text-neutral-600">花费：<span className="tabular-nums font-medium">${d.spend.toLocaleString()}</span></p>
      <p className="text-neutral-600">CPA: <span className="tabular-nums font-medium">${d.cpa.toFixed(2)}</span></p>
      <p className="text-neutral-600">ROAS: <span className="tabular-nums font-medium">{d.roas.toFixed(1)}x</span></p>
    </div>
  )
}

const CreativeInsightsPage = () => {
  const COLORS = useMemo(() => getChartColors(), [])

  return (
    <div className="space-y-6">
      {/* ── Scatter chart ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-1">素材 CPA 与花费</h3>
        <p className="text-caption text-neutral-400 mb-4">
          Core Legging Video V12 已进入疲劳区间；两条 UGC Hook 仍待发布。
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid {...chartGrid} />
            <XAxis
              type="number"
              dataKey="spend"
              name="花费"
              tick={chartAxis}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              label={{ value: '花费', position: 'insideBottomRight', offset: -5, fontSize: 11, fill: 'var(--neutral-500)' }}
            />
            <YAxis
              type="number"
              dataKey="cpa"
              name="CPA"
              tick={chartAxis}
              tickFormatter={(v) => `$${v}`}
              label={{ value: 'CPA', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: 'var(--neutral-500)' }}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter data={CREATIVE_DATA} fill={COLORS[0]}>
              {CREATIVE_DATA.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* ── Summary cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-caption text-neutral-500 mb-1">总花费</p>
          <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
            ${CREATIVE_DATA.reduce((s, d) => s + d.spend, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-caption text-neutral-500 mb-1">平均 CPA</p>
          <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
            ${(CREATIVE_DATA.reduce((s, d) => s + d.cpa, 0) / CREATIVE_DATA.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-caption text-neutral-500 mb-1">最低 CPA</p>
          <p className="font-heading text-lg font-bold text-success-600 tabular-nums">
            ${sortedByCpa[0].cpa.toFixed(2)}
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">{sortedByCpa[0].name}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-caption text-neutral-500 mb-1">平均 ROAS</p>
          <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
            {(CREATIVE_DATA.reduce((s, d) => s + d.roas, 0) / CREATIVE_DATA.length).toFixed(1)}x
          </p>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">
            素材 CPA 排名
          </h3>
          <span className="text-caption text-neutral-400">{CREATIVE_DATA.length} 个素材</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">素材</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">花费</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CPA</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">ROAS</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">曝光</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CTR</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCpa.map((d, i) => {
                const colorIndex = CREATIVE_DATA.findIndex((c) => c.name === d.name)
                return (
                  <tr key={d.name} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-neutral-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 text-neutral-800 font-medium flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[colorIndex] }} />
                      {d.name}
                    </td>
                    <td className="px-3 py-3 text-right text-neutral-700 tabular-nums">${d.spend.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      <span className={`font-semibold ${cpaColor(d.cpa)}`}>${d.cpa.toFixed(2)}</span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      <span className={`font-semibold ${roasColor(d.roas)}`}>{d.roas.toFixed(1)}x</span>
                    </td>
                    <td className="px-3 py-3 text-right text-neutral-600 tabular-nums">{d.impressions.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right text-neutral-600 tabular-nums">{d.ctr.toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CreativeInsightsPage
