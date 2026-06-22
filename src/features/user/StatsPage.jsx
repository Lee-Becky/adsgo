import {
  FileBarChart, Calendar,
  ExternalLink, Clock,
} from 'lucide-react'
import MetricCard from '@components/ui/MetricCard'

/* ═══════════════════════════════════════════════════════════
   StatsPage — User stats and recent activity
   ═══════════════════════════════════════════════════════════ */

const RECENT_REPORTS = [
  { id: 1, name: 'Demo Brand — Weekly Brief (Jun 9-15)', period: 'Jun 9-15, 2025', createdAt: '2 hours ago', type: 'Weekly' },
  { id: 2, name: 'EcoHome Living — Daily Brief', period: 'Jun 16, 2025', createdAt: '3 hours ago', type: 'Daily' },
  { id: 3, name: 'Luxe Fashion — Monthly Performance', period: 'May 2025', createdAt: '2 days ago', type: 'Monthly' },
  { id: 4, name: 'TechGear Pro — Campaign Analysis', period: 'Jun 1-14, 2025', createdAt: '3 days ago', type: 'Campaign' },
  { id: 5, name: 'Demo Brand — Daily Brief', period: 'Jun 14, 2025', createdAt: '4 days ago', type: 'Daily' },
  { id: 6, name: 'EcoHome Living — Weekly Brief (Jun 2-8)', period: 'Jun 2-8, 2025', createdAt: '1 week ago', type: 'Weekly' },
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
          label="Active Clients"
          value={4}
          format="number"
          trend={{ value: 1, direction: 'up' }}
          trendLabel="this month"
        />
        <MetricCard
          label="Total Campaigns"
          value={44}
          format="number"
          trend={{ value: 12, direction: 'up' }}
          trendLabel="vs last month"
        />
        <MetricCard
          label="Reports Generated"
          value={28}
          format="number"
          trend={{ value: 8, direction: 'up' }}
          trendLabel="this month"
        />
        <MetricCard
          label="Avg. Client ROAS"
          value={3.54}
          format="number"
          trend={{ value: 6.2, direction: 'up' }}
          trendLabel="vs last month"
        />
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <FileBarChart size={16} className="text-neutral-400" />
            Recent Reports
          </h3>
          <span className="text-caption text-neutral-400">{RECENT_REPORTS.length} reports</span>
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
