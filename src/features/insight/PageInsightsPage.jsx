import { useMemo } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts'

import { getChartColors, chartTooltip } from '@/lib/chartTheme'

/* ═══════════════════════════════════════════════════════════
   PageInsightsPage — Landing page performance insights
   ═══════════════════════════════════════════════════════════ */

const PAGE_DATA = [
  { page: 'Core Legging PDP', spend: 126.4, cvr: 2.1, clicks: 543, conversions: 9 },
  { page: 'Compression Fit LP', spend: 118.2, cvr: 1.4, clicks: 578, conversions: 6 },
  { page: 'Customer Proof LP', spend: 42.3, cvr: 2.5, clicks: 198, conversions: 5 },
  { page: 'Morning Routine LP', spend: 31.5, cvr: 1.8, clicks: 162, conversions: 3 },
  { page: 'CA Product Page', spend: 62.9, cvr: 2.9, clicks: 404, conversions: 7 },
]

const totalSpend = PAGE_DATA.reduce((s, d) => s + d.spend, 0)

const sortedByCvr = [...PAGE_DATA].sort((a, b) => b.cvr - a.cvr)

const cvrColor = (cvr) =>
  cvr >= 5 ? 'text-success-600' : cvr >= 3 ? 'text-warning-600' : 'text-danger-600'

const PageInsightsPage = () => {
  const COLORS = useMemo(() => getChartColors(), [])

  return (
    <div className="space-y-6">
      {/* ── Chart + summary row ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-4">落地页花费分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={PAGE_DATA}
                dataKey="spend"
                nameKey="page"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                label={({ page, percent }) => `${page.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--neutral-300)' }}
              >
                {PAGE_DATA.map((_, i) => (
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
            <p className="text-caption text-neutral-500 mb-1">平均 CVR</p>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              {(PAGE_DATA.reduce((s, d) => s + d.cvr, 0) / PAGE_DATA.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">最高 CVR</p>
            <p className="font-heading text-lg font-bold text-success-600 tabular-nums">
              {sortedByCvr[0].cvr.toFixed(1)}%
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{sortedByCvr[0].page}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-caption text-neutral-500 mb-1">总转化</p>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              {PAGE_DATA.reduce((s, d) => s + d.conversions, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900">
            落地页 CVR 排名
          </h3>
          <span className="text-caption text-neutral-400">{PAGE_DATA.length} 个页面</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap">落地页</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">花费</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">占比</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">CVR</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">点击</th>
                <th className="text-right px-3 py-3 font-semibold text-neutral-600 whitespace-nowrap">转化</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCvr.map((d, i) => (
                <tr key={d.page} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-400 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3 text-neutral-800 font-medium">{d.page}</td>
                  <td className="px-3 py-3 text-right text-neutral-700 tabular-nums">${d.spend.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-neutral-500 tabular-nums">
                    {((d.spend / totalSpend) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className={`font-semibold ${cvrColor(d.cvr)}`}>{d.cvr.toFixed(1)}%</span>
                  </td>
                  <td className="px-3 py-3 text-right text-neutral-600 tabular-nums">{d.clicks.toLocaleString()}</td>
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

export default PageInsightsPage
