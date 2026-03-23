import { TrendingUp, TrendingDown, DollarSign, Layers, Sparkles, Lightbulb, Star } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import DrawerShell from './DrawerShell'
import { WEEKLY_REPORT } from './mockData'

const KpiCard = ({ label, value, target, wow, direction, unit = '' }) => {
  const isUp = direction === 'up'
  return (
    <div className="bg-gray-50 rounded-lg p-3.5">
      <span className="text-[10px] text-gray-500">{label}</span>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-lg font-bold text-gray-900">{unit}{value}</span>
        {target && <span className="text-xs text-gray-500 mb-0.5">/ {unit}{target}</span>}
      </div>
      {wow && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isUp ? 'text-success-600' : 'text-error-600'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {wow} WoW
        </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#F0F0F0] p-3 text-xs">
      <p className="font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.name === 'CPA' ? `$${entry.value}` : entry.value}
        </p>
      ))}
    </div>
  )
}

const aiActionIcons = {
  budgetOptimize: { icon: DollarSign, color: 'text-success-600', bg: 'bg-success-50', label: 'Budget Optimize' },
  recommendedCampaigns: { icon: Layers, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Recommended Campaigns' },
  aiCreatives: { icon: Sparkles, color: 'text-warning-600', bg: 'bg-warning-50', label: 'AI Creatives' }
}

const WeeklyReportDrawer = ({ isOpen, onClose }) => {
  const { dateRange, grade, summary, highlights, keyInsights, kpis, dailyData, aiActionsSummary, nextOutlook } = WEEKLY_REPORT

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="Performance Report"
      subtitle={dateRange}
      guideModule="weeklyReport"
    >
      <div className="space-y-6">
        {/* Grade + Summary */}
        <div className="flex gap-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-primary-500">{grade}</span>
            <span className="text-[9px] text-gray-500">Grade</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed flex-1">{summary}</p>
        </div>

        {/* KPI Scorecard */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="ROAS" value={kpis.roas.current} target={kpis.roas.target} wow={kpis.roas.wow} direction={kpis.roas.direction} />
          <KpiCard label={`Conversions (${kpis.conversions.eventName})`} value={kpis.conversions.current.toLocaleString()} wow={kpis.conversions.wow} direction={kpis.conversions.direction} />
          <KpiCard label={`CPA (${kpis.cpa.eventName})`} value={kpis.cpa.current} target={kpis.cpa.target} wow={kpis.cpa.wow} direction={kpis.cpa.direction} unit="$" />
          <KpiCard label="Spend" value={`${(kpis.spend.current / 1000).toFixed(1)}K`} target={`${(kpis.spend.budget / 1000).toFixed(1)}K`} unit="$" />
        </div>

        {/* Daily Chart — ROAS + CPA dual line */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Daily Performance</h4>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded-full bg-[#7033F5]" />
              <span className="text-[10px] text-gray-500">ROAS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded-full bg-[#FF7D00]" />
              <span className="text-[10px] text-gray-500">CPA</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[0, 5]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="roas" stroke="#7033F5" strokeWidth={2} dot={{ r: 3, fill: '#7033F5' }} name="ROAS" />
              <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3, fill: '#FF7D00' }} name="CPA" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights & Analysis */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Insights & Analysis</h4>
          <div className="space-y-4">
            {/* Highlights */}
            <div>
              <span className="text-[10px] font-semibold text-gray-400">Highlights</span>
              <ul className="mt-2 space-y-2">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <Star className="w-3.5 h-3.5 text-primary-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Key Insights */}
            <div>
              <span className="text-[10px] font-semibold text-gray-400">Key Insights</span>
              <ul className="mt-2 space-y-2">
                {keyInsights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <Lightbulb className="w-3.5 h-3.5 text-warning-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Actions (Last 7 Days) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Actions (Last 7 Days)</h4>
          <div className="space-y-2">
            {Object.entries(aiActionsSummary).map(([key, data]) => {
              const config = aiActionIcons[key]
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className={`shrink-0 w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{config.label}</p>
                    <p className="text-[10px] text-gray-500">{data.detail}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{data.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next 7 Days Outlook */}
        <div className="bg-primary-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Next 7 Days Outlook</h4>
          <p className="text-sm text-gray-700">{nextOutlook}</p>
        </div>
      </div>
    </DrawerShell>
  )
}

export default WeeklyReportDrawer
