import { useState } from 'react'
import { Compass, Calendar, Clock, Zap, FileText, Database, ChevronDown, AlertTriangle } from 'lucide-react'

const PHASE_OPTIONS = [
  { id: 'cold_start', label: '冷启动' },
  { id: 'acquisition', label: '拉新期' },
  { id: 'growth', label: '增长期' },
  { id: 'maturity', label: '成熟期' },
  { id: 'decline', label: '衰退期' },
  { id: 'custom', label: '自定义' },
]

const CYCLE_OPTIONS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Bi-weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
]

const DAYS_OF_WEEK = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
]

const DATA_SOURCE_CATEGORIES = [
  { key: 'offline', label: 'Offline Data', icon: Database, mockDatasets: [
    { id: 'off_1', name: 'Q1 Revenue Sheet' },
    { id: 'off_2', name: 'CRM Export 2025' },
  ]},
  { key: 'attribution', label: 'Attribution Data', icon: Database, mockDatasets: [
    { id: 'attr_1', name: 'Meta × AppsFlyer' },
    { id: 'attr_2', name: 'Google × Adjust' },
  ]},
  { key: 'adAccount', label: 'Ad Account Data', icon: Database, mockDatasets: [
    { id: 'ad_1', name: 'Meta Ads - Main' },
    { id: 'ad_2', name: 'Google Ads - Brand' },
  ]},
  { key: 'creative', label: 'Creative Data', icon: Database, mockDatasets: [
    { id: 'cr_1', name: 'Meta Video Assets' },
    { id: 'cr_2', name: 'Google Image Assets' },
  ]},
]

const StrategyPhaseSection = ({ strategy, onChange }) => {
  const [expandedSources, setExpandedSources] = useState([])

  const update = (key, value) => {
    onChange({ ...strategy, [key]: value })
  }

  const updateDataSources = (categoryKey, datasetId, datasetName) => {
    const current = strategy.dataSources[categoryKey] || []
    const exists = current.some(d => d.id === datasetId)
    const next = exists
      ? current.filter(d => d.id !== datasetId)
      : [...current, { id: datasetId, name: datasetName }]
    onChange({
      ...strategy,
      dataSources: { ...strategy.dataSources, [categoryKey]: next }
    })
  }

  const toggleSourceExpand = (key) => {
    setExpandedSources(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const showDayOfWeek = strategy.cycleType === 'weekly' || strategy.cycleType === 'biweekly'
  const showDayOfMonth = strategy.cycleType === 'monthly' || strategy.cycleType === 'quarterly'
  const showMonthInQuarter = strategy.cycleType === 'quarterly'

  // Check if strategy period has expired
  const isExpired = strategy.validTo && new Date(strategy.validTo) < new Date(new Date().toDateString())

  // Compute next execution datetime (only when autoExecute is on)
  const getNextExecution = () => {
    if (!strategy.autoExecute) return null
    const now = new Date()
    let start = new Date(now)
    if (strategy.validFrom) {
      const vf = new Date(strategy.validFrom)
      if (vf > now) start = new Date(vf)
    }
    const { cycleType, dayOfWeek, dayOfMonth, monthInQuarter, executionHour, executionMinute } = strategy
    const next = new Date(start)

    if (cycleType === 'weekly' || cycleType === 'biweekly') {
      // dayOfWeek: 0=Mon..6=Sun → JS getDay: 0=Sun..6=Sat
      const jsDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1
      let diff = jsDay - next.getDay()
      if (diff < 0) diff += 7
      if (diff === 0 && (next.getHours() > executionHour || (next.getHours() === executionHour && next.getMinutes() >= executionMinute))) {
        diff = cycleType === 'biweekly' ? 14 : 7
      }
      next.setDate(next.getDate() + diff)
    } else if (cycleType === 'monthly' || cycleType === 'quarterly') {
      if (cycleType === 'quarterly') {
        const qStart = Math.floor(next.getMonth() / 3) * 3
        next.setMonth(qStart + (monthInQuarter - 1))
      }
      next.setDate(dayOfMonth)
      if (next <= now) {
        next.setMonth(next.getMonth() + (cycleType === 'quarterly' ? 3 : 1))
      }
    }
    next.setHours(executionHour, executionMinute, 0, 0)
    const pad = n => String(n).padStart(2, '0')
    return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())} ${pad(executionHour)}:${pad(executionMinute)}`
  }
  const nextExecution = getNextExecution()

  // Validation helpers
  const hasPhase = !!strategy.phase
  const hasValidity = !!(strategy.validFrom && strategy.validTo)
  const hasObjectives = !!strategy.coreObjectives.trim()
  const totalDataSources = Object.values(strategy.dataSources).flat().length
  const hasDataSources = totalDataSources > 0

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
          <Compass size={16} className="text-violet-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900">Strategy Phase</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Define strategy lifecycle, execution cadence, and data sources</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-7">
        {/* Expired Banner */}
        {isExpired && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-700">Previous strategy period has expired.</p>
              <p className="text-[11px] text-amber-600 mt-0.5">Historical config has been archived. Please fill in new strategy.</p>
            </div>
          </div>
        )}

        {/* Phase Selection */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-2 block">
            Phase <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PHASE_OPTIONS.map(p => (
              <button
                key={p.id}
                onClick={() => update('phase', p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  strategy.phase === p.id
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {strategy.phase === 'custom' && (
            <input
              className="mt-3 w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400"
              placeholder="Enter custom phase name..."
              value={strategy.customPhase}
              onChange={(e) => update('customPhase', e.target.value)}
            />
          )}
          {!hasPhase && (
            <p className="text-[11px] text-red-500 mt-1.5">Please select a strategy phase</p>
          )}
        </div>

        {/* Validity Period */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            Validity Period <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="date"
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400"
              value={strategy.validFrom}
              onChange={(e) => update('validFrom', e.target.value)}
            />
            <span className="text-xs text-slate-400 font-bold">to</span>
            <input
              type="date"
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400"
              value={strategy.validTo}
              onChange={(e) => update('validTo', e.target.value)}
            />
          </div>
          {!hasValidity && (
            <p className="text-[11px] text-red-500 mt-1.5">Please set both start and end dates</p>
          )}
        </div>

        {/* Strategy Cycle */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            Strategy Cycle
          </label>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {CYCLE_OPTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => update('cycleType', c.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  strategy.cycleType === c.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Time */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
            <Zap size={13} className="text-slate-400" />
            Execution Time
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {showMonthInQuarter && (
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400 bg-white"
                  value={strategy.monthInQuarter}
                  onChange={(e) => update('monthInQuarter', +e.target.value)}
                >
                  <option value={1}>1st month</option>
                  <option value={2}>2nd month</option>
                  <option value={3}>3rd month</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
            {showDayOfWeek && (
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400 bg-white"
                  value={strategy.dayOfWeek}
                  onChange={(e) => update('dayOfWeek', +e.target.value)}
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
            {showDayOfMonth && (
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400 bg-white"
                  value={strategy.dayOfMonth}
                  onChange={(e) => update('dayOfMonth', +e.target.value)}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
            <div className="flex items-center gap-1">
              <input
                type="time"
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400"
                value={`${String(strategy.executionHour).padStart(2, '0')}:${String(strategy.executionMinute).padStart(2, '0')}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':').map(Number)
                  onChange({ ...strategy, executionHour: h || 0, executionMinute: m || 0 })
                }}
              />
              <span className="text-[10px] text-slate-400 font-bold ml-1">Beijing Time</span>
            </div>
          </div>
        </div>

        {/* Auto Execute */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div>
            <p className="text-xs font-black text-slate-700">Auto Execute</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {strategy.autoExecute
                ? 'Strategy will execute automatically at the scheduled time'
                : 'You will be notified and can manually approve each execution'}
            </p>
          </div>
          <button
            onClick={() => update('autoExecute', !strategy.autoExecute)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              strategy.autoExecute ? 'bg-violet-500' : 'bg-slate-300'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              strategy.autoExecute ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Next Execution Hint */}
        {nextExecution && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl -mt-4">
            <Clock size={13} className="text-indigo-500" />
            <span className="text-[11px] font-bold text-indigo-600">
              Next execution: {nextExecution} (Beijing Time)
            </span>
          </div>
        )}

        {/* Core Objectives */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400" />
            Core Objectives <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-violet-400 resize-none ${
              !hasObjectives ? 'border-slate-200' : 'border-slate-200'
            }`}
            rows={4}
            placeholder="Describe background info for this cycle: strategy goals (e.g., reduce CPA below $80), KPI priorities (ROAS > scale), current test direction (video vs. image), key markets or audiences, risks to avoid..."
            value={strategy.coreObjectives}
            onChange={(e) => update('coreObjectives', e.target.value)}
          />
          {!hasObjectives && (
            <p className="text-[11px] text-red-500 mt-1.5">Please describe the core objectives for this strategy phase</p>
          )}
        </div>

        {/* Data Sources */}
        <div>
          <label className="text-xs font-black text-slate-700 mb-3 flex items-center gap-1.5">
            <Database size={13} className="text-slate-400" />
            Data Sources <span className="text-red-500">*</span>
          </label>
          {!hasDataSources && (
            <p className="text-[11px] text-red-500 -mt-1 mb-2">Please select at least one data source</p>
          )}
          <div className="space-y-2">
            {DATA_SOURCE_CATEGORIES.map(cat => {
              const selected = strategy.dataSources[cat.key] || []
              const isExpanded = expandedSources.includes(cat.key)
              return (
                <div key={cat.key} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleSourceExpand(cat.key)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <cat.icon size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                      {selected.length > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-600 rounded-full">
                          {selected.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 space-y-1.5">
                      {cat.mockDatasets.map(ds => {
                        const isSelected = selected.some(s => s.id === ds.id)
                        return (
                          <button
                            key={ds.id}
                            onClick={() => updateDataSources(cat.key, ds.id, ds.name)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-violet-50 text-violet-700 border border-violet-200'
                                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-violet-500 border-violet-500' : 'border-slate-300'
                            }`}>
                              {isSelected && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            {ds.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {/* Selected datasets chips */}
          {Object.values(strategy.dataSources).flat().length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {Object.entries(strategy.dataSources).flatMap(([catKey, datasets]) =>
                datasets.map(ds => (
                  <span
                    key={ds.id}
                    className="px-2.5 py-1 text-[10px] font-bold bg-violet-50 text-violet-600 rounded-full flex items-center gap-1"
                  >
                    {ds.name}
                    <button
                      onClick={() => updateDataSources(catKey, ds.id, ds.name)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrategyPhaseSection
