import { useMemo } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts'

import { getChartColors, chartTooltip } from '@/lib/chartTheme'

/* ═══════════════════════════════════════════════════════════
   AudiencePage — Audience insights with spend donut + CPA table
   ═══════════════════════════════════════════════════════════ */

const AUDIENCE_DATA = [
  { segment: 'Broad Fitness Buyers',  spend: 118.2, cpa: 58.60, roas: 1.54, conversions: 6 },
  { segment: 'Visitors 7D Purchase Intent', spend: 64.8, cpa: 44.10, roas: 1.76, conversions: 4 },
  { segment: 'Visitors 30D Value Stack', spend: 61.6, cpa: 41.50, roas: 1.88, conversions: 5 },
  { segment: 'US 3 Percent Lookalike', spend: 96.7, cpa: 34.20, roas: 2.18, conversions: 11 },
  { segment: 'CA Expansion Fitness Buyers', spend: 62.9, cpa: 29.40, roas: 2.71, conversions: 7 },
]

const totalSpend = AUDIENCE_DATA.reduce((s, d) => s + d.spend, 0)

const sortedByCpa = [...AUDIENCE_DATA].sort((a, b) => a.cpa - b.cpa)

const cpaColor = (cpa) =>
  cpa <= 18 ? 'text-success-600' : cpa <= 24 ? 'text-warning-600' : 'text-danger-600'

const roasColor = (roas) =>
  roas >= 4 ? 'text-success-600' : roas >= 2.5 ? 'text-warning-600' : 'text-danger-600'

const AudiencePage = () => {
  const COLORS = useMemo(() => getChartColors(), [])

  return (
    <div className="space-y-6">
      {/* ── Chart + summary row ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4">受众花费分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={AUDIENCE_DATA}
                dataKey="spend"
                nameKey="segment"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                label={({ segment, percent }) => `${segment.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--neutral-300)' }}
              >
                {AUDIENCE_DATA.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`$${val.toLocaleString()}`, '花费']}
                contentStyle={chartTooltip}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">总花费</p>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              ${totalSpend.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">平均 CPA</p>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              ${(AUDIENCE_DATA.reduce((s, d) => s + d.cpa, 0) / AUDIENCE_DATA.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">最低 CPA</p>
            <p className="font-heading text-lg font-bold text-success-600 tabular-nums">
              ${sortedByCpa[0].cpa.toFixed(2)}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{sortedByCpa[0].segment}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">总转化</p>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              {AUDIENCE_DATA.reduce((s, d) => s + d.conversions, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">
            受众 CPA 排名
          </h3>
          <span className="text-caption text-neutral-400">{AUDIENCE_DATA.length} 个受众</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">受众</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">花费</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">占比</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CPA</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">ROAS</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">转化</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCpa.map((d, i) => (
                <tr key={d.segment} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-400 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3 text-neutral-800 font-medium">{d.segment}</td>
                  <td className="px-3 py-3 text-right text-neutral-700 tabular-nums">${d.spend.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-neutral-500 tabular-nums">
                    {((d.spend / totalSpend) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className={`font-semibold ${cpaColor(d.cpa)}`}>${d.cpa.toFixed(2)}</span>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className={`font-semibold ${roasColor(d.roas)}`}>{d.roas.toFixed(1)}x</span>
                  </td>
                  <td className="px-3 py-3 text-right text-neutral-700 tabular-nums">{d.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AudiencePage
