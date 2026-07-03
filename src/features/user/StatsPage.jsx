import {
  FileBarChart, Calendar,
  ExternalLink, Clock,
} from 'lucide-react'
import MetricCard from '@components/ui/MetricCard'

/* ═══════════════════════════════════════════════════════════
   StatsPage — User stats and recent activity
   ═══════════════════════════════════════════════════════════ */

const RECENT_REPORTS = [
  { id: 1, name: 'LumaFit — 美国 ROAS 下滑日报', period: '2026-06-29', createdAt: '10:30', type: 'Daily' },
  { id: 2, name: 'LumaFit — 素材疲劳处理记录', period: '2026-06-29', createdAt: '10:18', type: 'Campaign' },
  { id: 3, name: 'EcoHome Living — 周预算复盘', period: '2026-06-22 至 06-28', createdAt: '3 小时前', type: 'Weekly' },
  { id: 4, name: 'Luxe Fashion — 月度表现报告', period: '2026 年 6 月', createdAt: '2 天前', type: 'Monthly' },
  { id: 5, name: 'TechGear Pro — Campaign 分析', period: '2026-06-15 至 06-28', createdAt: '3 天前', type: 'Campaign' },
  { id: 6, name: 'EcoHome Living — 客户日报', period: '2026-06-28', createdAt: '4 天前', type: 'Daily' },
]

const TYPE_COLORS = {
  Daily: 'bg-primary-50 text-primary-700',
  Weekly: 'bg-success-50 text-success-700',
  Monthly: 'bg-warning-50 text-warning-700',
  Campaign: 'bg-info-50 text-info-700',
}

const StatsPage = () => {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="活跃客户"
          value={4}
          format="number"
          trend={{ value: 1, direction: 'up' }}
          trendLabel="本月"
        />
        <MetricCard
          label="Campaign 总数"
          value={44}
          format="number"
          trend={{ value: 12, direction: 'up' }}
          trendLabel="较上月"
        />
        <MetricCard
          label="已生成报告"
          value={28}
          format="number"
          trend={{ value: 8, direction: 'up' }}
          trendLabel="本月"
        />
        <MetricCard
          label="客户平均 ROAS"
          value={3.54}
          format="number"
          trend={{ value: 6.2, direction: 'up' }}
          trendLabel="较上月"
        />
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <FileBarChart size={16} className="text-neutral-400" />
            近期报告
          </h3>
          <span className="text-caption text-neutral-400">{RECENT_REPORTS.length} 份报告</span>
        </div>
        <div className="divide-y divide-neutral-50">
          {RECENT_REPORTS.map(report => (
            <div key={report.id} className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50/50 transition-colors group cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 group-hover:text-primary-700 transition-colors truncate">
                  {report.name}
                </p>
                <p className="text-caption text-neutral-500 flex items-center gap-2 mt-0.5">
                  <Calendar size={11} /> {report.period}
                </p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[report.type]}`}>
                {report.type}
              </span>
              <span className="text-caption text-neutral-400 shrink-0 flex items-center gap-1">
                <Clock size={11} /> {report.createdAt}
              </span>
              <ExternalLink size={14} className="text-neutral-300 group-hover:text-primary-400 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsPage
