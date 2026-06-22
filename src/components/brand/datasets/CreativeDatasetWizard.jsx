import { useState } from 'react'
import { X, Search, CheckSquare, Square, Lock, Zap, Sparkles, Wrench } from 'lucide-react'
import DatasetWizard from './shared/DatasetWizard'
import SplitPatternConfig from './shared/SplitPatternConfig'
import { MEDIA_PLATFORMS, CREATIVE_DIMENSION_FIELDS, CREATIVE_METRIC_FIELDS, mockAccountsForDataset, MOCK_EVENT_KEYS, EVENT_METRIC_TYPES } from './mockData'

const STEPS = ['Accounts & Type', 'Select Fields', 'Split Config']

const ASSET_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
]

// Fixed dimensions that are always included and cannot be unchecked
const FIXED_DIMENSIONS = [
  { key: 'day', label: 'Day' },
  { key: 'asset_name', label: 'Asset Name' },
  { key: 'ad_name', label: 'Ad Name' },
  { key: 'asset_type', label: 'Asset Type' },
  { key: 'asset_url', label: 'Asset URL' },
]

const FIXED_KEYS = new Set(FIXED_DIMENSIONS.map(f => f.key))

// Mock AI analysis result
const MOCK_AI_RESULT = {
  separator: '_',
  dimensions: [
    { index: 0, name: 'Theme', key: 'theme', confidence: 0.92 },
    { index: 1, name: 'Version', key: 'version', confidence: 0.87 },
  ],
  sampleParsed: [
    { original: 'Hero_v1.mp4', parts: ['Hero', 'v1.mp4'] },
    { original: 'Promo_Summer.jpg', parts: ['Promo', 'Summer.jpg'] },
    { original: 'UGC_Review_3.mp4', parts: ['UGC', 'Review_3.mp4'] },
  ],
}

const CreativeDatasetWizard = ({ onClose, onCreate, defaultPlatform = 'meta' }) => {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [dataStartDate, setDataStartDate] = useState('')
  const [platform, setPlatform] = useState(defaultPlatform)
  const [assetTypes, setAssetTypes] = useState(['all'])
  const [selectedAccountIds, setSelectedAccountIds] = useState([])
  const [accountSearch, setAccountSearch] = useState('')

  // Field selection (4 groups)
  const [optionalDimensions, setOptionalDimensions] = useState([])
  const [mediaMetrics, setMediaMetrics] = useState(['impressions', 'clicks', 'spend', 'ctr'])
  const [eventMetrics, setEventMetrics] = useState({})

  // Split config
  const [splitConfig, setSplitConfig] = useState({ separator: '_', dimensions: [] })
  const [splitTab, setSplitTab] = useState('manual') // 'manual' | 'ai'
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const platformAccounts = mockAccountsForDataset.filter(a => a.platform === platform)
  const filteredAccounts = platformAccounts.filter(a =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase())
  )

  const toggleAccount = (id) => {
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleAssetType = (t) => {
    if (t === 'all') {
      setAssetTypes(['all'])
    } else {
      setAssetTypes(prev => {
        const without = prev.filter(x => x !== 'all')
        const next = without.includes(t) ? without.filter(x => x !== t) : [...without, t]
        return next.length === 0 ? ['all'] : next
      })
    }
  }

  const toggleOptionalDim = (key) => {
    setOptionalDimensions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const toggleMediaMetric = (key) => {
    setMediaMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const toggleEventMetric = (eventKey, metricType) => {
    setEventMetrics(prev => {
      const current = prev[eventKey] || { actions: false, action_values: false }
      const updated = { ...current, [metricType]: !current[metricType] }
      if (!updated.actions && !updated.action_values) {
        const { [eventKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [eventKey]: updated }
    })
  }

  const handleAiAnalyze = () => {
    setAiAnalyzing(true)
    setTimeout(() => {
      setAiResult(MOCK_AI_RESULT)
      setAiAnalyzing(false)
    }, 1500)
  }

  const applyAiResult = () => {
    if (aiResult) {
      setSplitConfig({
        separator: aiResult.separator,
        dimensions: aiResult.dimensions.map(d => ({ index: d.index, name: d.name, key: d.key })),
      })
      setSplitTab('manual')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim() && dataStartDate && selectedAccountIds.length > 0
      case 1: return true // fixed dims always present
      case 2: return true // split is optional
      default: return false
    }
  }

  const handleFinish = () => {
    const selectedColumns = [
      ...FIXED_DIMENSIONS.map(f => f.key),
      ...optionalDimensions,
      ...mediaMetrics,
    ]
    const newDs = {
      id: `crd_${Date.now().toString(16)}`,
      name,
      platform,
      accountIds: selectedAccountIds,
      assetTypes,
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
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
          <h3 className="text-sm font-black text-neutral-900">New Creative Dataset</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X size={18} className="text-neutral-400" />
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
            {/* Step 0: Accounts & Type */}
            {step === 0 && (
              <div className="px-8 py-6 space-y-5">
                <div>
                  <label className="text-xs font-black text-neutral-700 mb-1.5 block">Dataset Name</label>
                  <input
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 outline-none focus:border-primary-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Meta Creatives US"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-neutral-700 mb-1.5 block">Data Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 outline-none focus:border-primary-400"
                      value={dataStartDate}
                      onChange={(e) => setDataStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-neutral-700 mb-1.5 block">Asset Type</label>
                    <div className="flex items-center gap-2">
                      {ASSET_TYPES.map(t => (
                        <button
                          key={t.value}
                          onClick={() => toggleAssetType(t.value)}
                          className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${
                            assetTypes.includes(t.value)
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-neutral-700 mb-1.5 block">Platform & Accounts</label>
                  <div className="flex items-center gap-2 mb-3">
                    {MEDIA_PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setPlatform(p.id); setSelectedAccountIds([]) }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                          platform === p.id ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                        }`}
                      >
                        <img src={p.icon} alt={p.name} className="w-3.5 h-3.5" />
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
                    <input
                      className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:border-primary-400"
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
                          <span key={id} className="px-2.5 py-1 text-[10px] font-bold bg-primary-50 text-primary-600 rounded-full flex items-center gap-1">
                            {acc?.name || id}
                            <button onClick={() => toggleAccount(id)} className="hover:text-danger-500 ml-0.5">×</button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div className="max-h-[160px] overflow-y-auto space-y-1">
                    {filteredAccounts.map(acc => {
                      const isSelected = selectedAccountIds.includes(acc.id)
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccount(acc.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                            isSelected ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50 border border-transparent'
                          }`}
                        >
                          {isSelected ? <CheckSquare size={13} className="text-primary-500" /> : <Square size={13} className="text-neutral-300" />}
                          <p className="text-xs font-semibold text-neutral-700 truncate">{acc.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Select Fields (4 groups) */}
            {step === 1 && (
              <div className="px-8 py-6 space-y-6">
                {/* Group 1: Fixed Dimensions */}
                <div>
                  <h4 className="text-[10px] font-black text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Lock size={10} />
                    Fixed Dimensions
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FIXED_DIMENSIONS.map(field => (
                      <div
                        key={field.key}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200 cursor-not-allowed"
                      >
                        <Lock size={11} className="text-neutral-400" />
                        <CheckSquare size={13} className="text-neutral-400" />
                        {field.label}
                        <span className="ml-auto text-[9px] font-bold text-neutral-400 bg-neutral-200 px-1.5 py-0.5 rounded">Fixed</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group 2: Optional Dimensions */}
                <div>
                  <h4 className="text-[10px] font-black text-neutral-400 mb-2">Optional Dimensions</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CREATIVE_DIMENSION_FIELDS.filter(f => !FIXED_KEYS.has(f.key)).map(field => {
                      const isSelected = optionalDimensions.includes(field.key)
                      return (
                        <button
                          key={field.key}
                          onClick={() => toggleOptionalDim(field.key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                            isSelected
                              ? 'bg-primary-50 text-primary-700 border border-primary-200'
                              : 'bg-neutral-50 text-neutral-600 border border-transparent hover:border-neutral-200'
                          }`}
                        >
                          {isSelected ? <CheckSquare size={13} className="text-primary-500" /> : <Square size={13} className="text-neutral-300" />}
                          {field.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Group 3: Media Metrics */}
                <div>
                  <h4 className="text-[10px] font-black text-neutral-400 mb-2">Media Metrics</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CREATIVE_METRIC_FIELDS.map(field => {
                      const isSelected = mediaMetrics.includes(field.key)
                      return (
                        <button
                          key={field.key}
                          onClick={() => toggleMediaMetric(field.key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                            isSelected
                              ? 'bg-success-50 text-success-700 border border-success-200'
                              : 'bg-neutral-50 text-neutral-600 border border-transparent hover:border-neutral-200'
                          }`}
                        >
                          {isSelected ? <CheckSquare size={13} className="text-success-500" /> : <Square size={13} className="text-neutral-300" />}
                          {field.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Group 4: Event Metrics */}
                <div>
                  <h4 className="text-[10px] font-black text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Zap size={10} className="text-warning-500" />
                    Event Metrics
                  </h4>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {MOCK_EVENT_KEYS.map(event => {
                      const current = eventMetrics[event.key] || { actions: false, action_values: false }
                      const isAnySelected = current.actions || current.action_values
                      return (
                        <div
                          key={event.key}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                            isAnySelected ? 'bg-warning-50 border border-warning-200' : 'bg-neutral-50 border border-transparent hover:border-neutral-200'
                          }`}
                        >
                          <span className={`text-xs font-bold flex-1 ${isAnySelected ? 'text-warning-700' : 'text-neutral-600'}`}>
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
                                    ? 'bg-warning-500 text-white'
                                    : 'bg-white text-neutral-400 border border-neutral-200 hover:border-warning-300'
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
                </div>

                {/* Summary */}
                <p className="text-[10px] text-neutral-400">
                  {FIXED_DIMENSIONS.length} fixed + {optionalDimensions.length} optional dims, {mediaMetrics.length} media metrics, {Object.keys(eventMetrics).length} event metrics
                </p>
              </div>
            )}

            {/* Step 2: Split Config with Manual/AI tabs */}
            {step === 2 && (
              <div className="px-8 py-6 space-y-5">
                <div>
                  <h4 className="text-xs font-black text-neutral-900 mb-1">Asset Name Split</h4>
                  <p className="text-[11px] text-neutral-400 mb-4">Parse asset names into dimensions for deeper analysis.</p>
                </div>

                {/* Manual / AI Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg w-fit">
                  <button
                    onClick={() => setSplitTab('manual')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[11px] font-bold transition-all ${
                      splitTab === 'manual'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Wrench size={12} />
                    Manual
                  </button>
                  <button
                    onClick={() => setSplitTab('ai')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[11px] font-bold transition-all ${
                      splitTab === 'ai'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Sparkles size={12} />
                    AI Analysis
                  </button>
                </div>

                {splitTab === 'manual' && (
                  <SplitPatternConfig
                    config={splitConfig}
                    onChange={setSplitConfig}
                    sampleNames={['Hero_v1.mp4', 'Promo_Summer.jpg', 'UGC_Review_3.mp4']}
                  />
                )}

                {splitTab === 'ai' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-neutral-700 mb-1.5 block">Describe your naming convention</label>
                      <textarea
                        className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-900 outline-none focus:border-violet-400 resize-none"
                        rows={3}
                        placeholder="e.g., Our creative names follow the pattern: Theme_Version_Format. Theme can be Hero, Promo, UGC, etc. Version is like v1, v2. Format is the file extension."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleAiAnalyze}
                      disabled={!aiPrompt.trim() || aiAnalyzing}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {aiAnalyzing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          Analyze
                        </>
                      )}
                    </button>

                    {/* AI Result */}
                    {aiResult && !aiAnalyzing && (
                      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-violet-700 flex items-center gap-1.5">
                            <Sparkles size={12} />
                            AI Suggestion
                          </h4>
                          <button
                            onClick={applyAiResult}
                            className="px-3 py-1.5 text-[10px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-all"
                          >
                            Apply to Manual Config
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-violet-600">Separator:</span>
                            <span className="px-2 py-0.5 bg-white text-sm font-mono font-bold text-violet-800 rounded border border-violet-200">
                              {aiResult.separator}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-violet-600 block mb-1.5">Detected Dimensions:</span>
                            <div className="space-y-1.5">
                              {aiResult.dimensions.map(d => (
                                <div key={d.index} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-violet-100">
                                  <span className="w-5 h-5 rounded bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center">
                                    {d.index + 1}
                                  </span>
                                  <span className="text-xs font-bold text-neutral-800">{d.name}</span>
                                  <span className="text-[10px] text-neutral-400 font-mono">{d.key}</span>
                                  <span className="ml-auto text-[10px] font-bold text-success-600">
                                    {Math.round(d.confidence * 100)}% confidence
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-violet-600 block mb-1.5">Sample Parsing:</span>
                            <div className="space-y-1">
                              {aiResult.sampleParsed.map((s, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px]">
                                  <span className="text-neutral-400 font-mono truncate max-w-[140px]">{s.original}</span>
                                  <span className="text-neutral-300">→</span>
                                  <div className="flex items-center gap-1">
                                    {s.parts.map((part, pi) => (
                                      <span key={pi} className="px-2 py-0.5 bg-violet-100 text-violet-700 font-bold rounded">
                                        {part}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DatasetWizard>
        </div>
      </div>
    </div>
  )
}

export default CreativeDatasetWizard
