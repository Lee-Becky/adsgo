import { ChevronRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { WEEKLY_REPORT } from './mockData'

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

const ThisWeekRecap = ({ onOpenWeeklyReport }) => {
  const { dateRange, dailyData } = WEEKLY_REPORT

  return (
    <div className="bg-gray-50/50 rounded-lg border border-[#F5F5F5] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#F5F5F5] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Last 7 Days</h3>
          <span className="text-xs text-gray-500">{dateRange}</span>
        </div>
        <button
          onClick={onOpenWeeklyReport}
          className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          Full Report <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart — dual line: ROAS + CPA */}
      <div className="px-4 pt-3 pb-2 flex-1">
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
        <ResponsiveContainer width="100%" height={180}>
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
    </div>
  )
}

export default ThisWeekRecap
