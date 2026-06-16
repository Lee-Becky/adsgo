import { useState } from 'react'
import { X, Search, CheckSquare, Square, Layers, Zap } from 'lucide-react'
import DatasetWizard from './shared/DatasetWizard'
import SplitPatternConfig from './shared/SplitPatternConfig'
import FieldSelector from './shared/FieldSelector'
import {
  MEDIA_PLATFORMS, DIMENSION_FIELDS, METRIC_FIELDS, mockAccountsForDataset,
  GRANULARITY_OPTIONS, MOCK_EVENT_KEYS, EVENT_METRIC_TYPES, MOCK_CAMPAIGN_NAMES,
} from './mockData'

const STEPS = ['Accounts', 'Split Config', 'Select Fields']

const AdDatasetWizard = ({ onClose, onCreate, defaultPlatform = 'meta' }) => {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [dataStartDate, setDataStartDate] = useState('')
  const [platform, setPlatform] = useState(defaultPlatform)
  const [granularity, setGranularity] = useState('campaign')
  const [selectedAccountIds, setSelectedAccountIds] = useState([])
  const [accountSearch, setAccountSearch] = useState('')
  const [splitConfig, setSplitConfig] = useState({ separator: '_', dimensions: [] })
  const [selectedColumns, setSelectedColumns] = useState(['date', 'campaign_name', 'impressions', 'clicks', 'spend'])

  // Event metrics state: { [eventKey]: { actions: bool, action_values: bool } }
  const [eventMetrics, setEventMetrics] = useState({})

  const platformAccounts = mockAccountsForDataset.filter(a => a.platform === platform)
  const filteredAccounts = platformAccounts.filter(a =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
    a.id.toLowerCase().includes(accountSearch.toLowerCase())
  )

  const toggleAccount = (id) => {
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleEventMetric = (eventKey, metricType) => {
    setEventMetrics(prev => {
      const current = prev[eventKey] || { actions: false, action_values: false }
      const updated = { ...current, [metricType]: !current[metricType] }
      // If both are false, remove the key entirely
      if (!updated.actions && !updated.action_values) {
        const { [eventKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [eventKey]: updated }
    })
  }

  // Filter dimension fields based on granularity
  const getFieldsForGranularity = () => {
    const dims = [...DIMENSION_FIELDS]
    if (granularity === 'campaign') {
      return dims.filter(f => !['adset_name', 'adset_id', 'ad_name', 'ad_id'].includes(f.key))
    }
    if (granularity === 'adset') {
      return dims.filter(f => !['ad_name', 'ad_id'].includes(f.key))
    }
    return dims // ad level: all fields
  }

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim() && dataStartDate && selectedAccountIds.length > 0
      case 1: return true // split config is optional
      case 2: return selectedColumns.length > 0
      default: return false
    }
  }

  const handleFinish = () => {
    const newDs = {
      id: `add_${Date.now().toString(16)}`,
      name,
      platform,
      granularity,
      accountIds: selectedAccountIds,
      dataStartDate,
      splitConfig: splitConfig.dimensions.length > 0 ? splitConfig : null,
      selectedColumns,
      eventMetrics,
    }
    onCreate(newDs)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">New Ad Dataset</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DatasetWizard
            steps={STEPS}
            currentStep={step}
            onStepClick={setStep}
            onNext={() => setStep(s => s + 1)}
            onPrev={() => setStep(s => s - 1)}
            onFinish={handleFinish}
            canProceed={canProceed()}
          >
            {step === 0 && (
              <div className="px-8 py-6 space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Dataset Name</label>
                  <input
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Meta US Campaigns Q2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Data Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-400"
                      value={dataStartDate}
                      onChange={(e) => setDataStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Platform</label>
                    <div className="flex items-center gap-2">
                      {MEDIA_PLATFORMS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setPlatform(p.id); setSelectedAccountIds([]) }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                            platform === p.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <img src={p.icon} alt={p.name} className="w-3.5 h-3.5" />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Granularity Selector */}
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Layers size={12} className="text-slate-400" />
                    Granularity
                  </label>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                    {GRANULARITY_OPTIONS.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setGranularity(g.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          granularity === g.id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {granularity === 'campaign' && 'Data aggregated at campaign level'}
                    {granularity === 'adset' && 'Data includes adset-level breakdowns'}
                    {granularity === 'ad' && 'Data includes individual ad-level breakdowns'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Select Accounts</label>
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-indigo-400"
                      placeholder="Search accounts..."
                      value={accountSearch}
                      onChange={(e) => setAccountSearch(e.target.value)}
                    />
                  </div>
                  {selectedAccountIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedAccountIds.map(id => {
                        const acc = mockAccountsForDataset.find(a => a.id === id)
                        return (
                          <span key={id} className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-full flex items-center gap-1">
                            {acc?.name || id}
                            <button onClick={() => toggleAccount(id)} className="hover:text-red-500 ml-0.5">×</button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {filteredAccounts.map(acc => {
                      const isSelected = selectedAccountIds.includes(acc.id)
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccount(acc.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                            isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          {isSelected ? <CheckSquare size={13} className="text-indigo-500" /> : <Square size={13} className="text-slate-300" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{acc.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{acc.id}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="px-8 py-6">
                <h4 className="text-xs font-black text-slate-900 mb-1">Campaign Name Split</h4>
                <p className="text-[11px] text-slate-400 mb-4">Configure how to parse campaign names into dimensions.</p>
                <SplitPatternConfig
                  config={splitConfig}
                  onChange={setSplitConfig}
                  sampleNames={MOCK_CAMPAIGN_NAMES}
                />
              </div>
            )}

            {step === 2 && (
              <div className="px-8 py-6 space-y-6">
                {/* Standard Fields */}
                <FieldSelector
                  fields={[...getFieldsForGranularity(), ...METRIC_FIELDS]}
                  selected={selectedColumns}
                  onChange={setSelectedColumns}
                  title="Select Columns"
                />

                {/* Event Metrics */}
                <div className="border-t border-slate-200 pt-5">
                  <h4 className="text-xs font-black text-slate-900 mb-1 flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-500" />
                    Event Metrics
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Select conversion events and their metric types to include in the dataset.
                  </p>

                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {MOCK_EVENT_KEYS.map(event => {
                      const current = eventMetrics[event.key] || { actions: false, action_values: false }
                      const isAnySelected = current.actions || current.action_values
                      return (
                        <div
                          key={event.key}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                            isAnySelected ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-transparent hover:border-slate-200'
                          }`}
                        >
                          <span className={`text-xs font-bold flex-1 ${isAnySelected ? 'text-amber-700' : 'text-slate-600'}`}>
                            {event.label}
                          </span>
                          {EVENT_METRIC_TYPES.map(mt => {
                            const isOn = current[mt.id]
                            return (
                              <button
                                key={mt.id}
                                onClick={() => toggleEventMetric(event.key, mt.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                                  isOn
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white text-slate-400 border border-slate-200 hover:border-amber-300'
                                }`}
                              >
                                {isOn ? <CheckSquare size={10} /> : <Square size={10} />}
                                {mt.label}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>

                  {Object.keys(eventMetrics).length > 0 && (
                    <p className="text-[10px] text-amber-600 mt-2 font-bold">
                      {Object.keys(eventMetrics).length} event(s) selected
                    </p>
                  )}
                </div>
              </div>
            )}
          </DatasetWizard>
        </div>
      </div>
    </div>
  )
}

export default AdDatasetWizard
