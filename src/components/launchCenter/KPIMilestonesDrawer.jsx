import { AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import DrawerShell from './DrawerShell'
import { KPI_PROGRESS } from './mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#F0F0F0] p-3 text-xs">
      <p className="font-medium text-gray-900 mb-1">{label}</p>
      <p className="text-primary-600">ROAS: {payload[0]?.value}</p>
    </div>
  )
}

const KPIMilestonesDrawer = ({ isOpen, onClose }) => {
  const { primary, secondary, targets, diagnosis } = KPI_PROGRESS
  const progress = Math.round((primary.current / primary.target) * 100)

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="KPI Progress"
      subtitle={`${primary.metric} ${primary.current} / ${primary.target} (${progress}%)`}
      guideModule="kpiMilestones"
    >
      <div className="space-y-6">
        {/* ROAS Trend Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {primary.metric} Trend
          </h4>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-gray-900">{primary.current}</span>
              <span className="text-sm text-gray-500">/ {primary.target}</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">
              {progress}%
            </div>
            <span className="text-xs text-gray-500">
              {primary.confidence}% confidence
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={primary.trend} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={primary.target} stroke="#7033F5" strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: `Target ${primary.target}`, position: 'right', fontSize: 10, fill: '#7033F5' }} />
              <Line type="monotone" dataKey="value" stroke="#7033F5" strokeWidth={2} dot={{ r: 3, fill: '#7033F5' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current → Target */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Target Progress</h4>
          <div className="space-y-3">
            {targets.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-[10px] text-gray-500">
                  {t.metric}{t.eventName ? ` (${t.eventName})` : ''}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-gray-900">
                    {t.unit || ''}{t.current}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-base font-bold text-primary-600">
                    {t.unit || ''}{t.target}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    expected in ~{t.expectedDays} days
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-1.5 bg-primary-500 rounded-full transition-all"
                    style={{ width: `${Math.min(Math.round((t.metric === 'CPA' ? t.target / t.current : t.current / t.target) * 100), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary KPIs */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Other Metrics</h4>
          <div className="space-y-2">
            {secondary.map((kpi) => (
              <div key={kpi.metric} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <span className="text-xs font-medium text-gray-900">
                    {kpi.metric}{kpi.eventName ? ` (${kpi.eventName})` : ''}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {kpi.unit === '$' ? `$${kpi.current}` : `${kpi.current}${kpi.unit}`}
                    {kpi.target ? ` / ${kpi.unit === '$' ? '$' : ''}${kpi.target}${kpi.unit !== '$' ? kpi.unit : ''}` : ''}
                    {kpi.benchmark ? ` (bench: ${kpi.benchmark}${kpi.unit})` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    kpi.status === 'improving' || kpi.status === 'above'
                      ? 'bg-success-50 text-success-600'
                      : 'bg-warning-50 text-warning-600'
                  }`}>
                    {kpi.wow}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis Panel */}
        {diagnosis.show && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
              <span className="text-sm font-semibold text-gray-900">Diagnosis</span>
            </div>
            <p className="text-xs text-gray-700 mb-3">{diagnosis.text}</p>
            <div className="space-y-1.5">
              {diagnosis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Lightbulb className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DrawerShell>
  )
}

export default KPIMilestonesDrawer
