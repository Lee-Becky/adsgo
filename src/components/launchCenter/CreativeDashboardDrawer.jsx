import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import DrawerShell from './DrawerShell'
import { CREATIVE_TESTING } from './mockData'

const barColors = ['#7033F5', '#9B6BFF', '#B794FF', '#D4BFFF', '#EDE5FF']

const statusStyles = {
  top: 'bg-success-50 text-success-700 border-success-200',
  active: 'bg-primary-50 text-primary-700 border-primary-200',
  paused: 'bg-gray-100 text-gray-500 border-gray-200'
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#F0F0F0] p-2.5 text-xs">
      <p className="font-medium text-gray-900">{payload[0]?.payload?.type}</p>
      <p className="text-primary-600">{payload[0]?.value}%</p>
    </div>
  )
}

const CreativeDashboardDrawer = ({ isOpen, onClose }) => {
  const { velocity, typeBreakdown, topPerformers } = CREATIVE_TESTING

  const velocityCards = [
    { label: 'Tested', value: velocity.tested, change: velocity.testedWow, color: 'text-primary-600' },
    { label: 'Active', value: velocity.active, change: velocity.activeWow, color: 'text-success-600' },
    { label: 'Paused', value: velocity.paused, color: 'text-gray-600' },
    { label: 'Winning', value: velocity.winning, color: 'text-warning-600' }
  ]

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="Creative Testing"
      subtitle="Testing velocity, type distribution, and top performers"
      guideModule="creative"
    >
      <div className="space-y-6">
        {/* Velocity Stats */}
        <div className="grid grid-cols-4 gap-3">
          {velocityCards.map((card) => (
            <div key={card.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-gray-500">{card.label}</span>
              <div className={`text-xl font-bold ${card.color} mt-0.5`}>{card.value}</div>
              {card.change && (
                <span className="text-[10px] text-success-600 font-medium">{card.change} WoW</span>
              )}
            </div>
          ))}
        </div>

        {/* Type Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Type Distribution</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={typeBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[0, 40]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                {typeBreakdown.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Performers</h4>
          <div className="space-y-3">
            {topPerformers.map((creative) => (
              <div key={creative.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{creative.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{creative.type}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[creative.status]}`}>
                    {creative.status === 'top' ? 'Top' : creative.status}
                  </span>
                </div>
                {/* Placeholder for creative preview */}
                <div className="w-full h-20 rounded-md bg-gradient-to-br from-primary-100 to-primary-50 mb-3 flex items-center justify-center">
                  <span className="text-xs text-primary-400">Preview</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">CTR </span>
                    <span className="font-medium text-gray-900">{creative.ctr}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ROAS </span>
                    <span className="font-medium text-gray-900">{creative.roas}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    {creative.daysTested}d tested
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerShell>
  )
}

export default CreativeDashboardDrawer
