import { useState, useMemo } from 'react'
import { X, Search, CheckSquare, Square, Check, AlertTriangle, ArrowRight } from 'lucide-react'
import DatasetWizard from './shared/DatasetWizard'
import SplitPatternConfig from './shared/SplitPatternConfig'
import FieldSelector from './shared/FieldSelector'
import { MEDIA_PLATFORMS, ATTRIBUTION_PLATFORMS, DIMENSION_FIELDS, METRIC_FIELDS, ATTRIBUTION_METRIC_FIELDS, mockAccountsForDataset } from './mockData'

const STEPS = ['Media Platform', 'Attribution', 'Split Config', 'Select Fields', 'Match Preview', 'Confirm']

const JoinedDatasetWizard = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [dataStartDate, setDataStartDate] = useState('')
  const [mediaPlatform, setMediaPlatform] = useState('meta')
  const [selectedAccountIds, setSelectedAccountIds] = useState([])
  const [accountSearch, setAccountSearch] = useState('')
  const [attributionPlatform, setAttributionPlatform] = useState('appsflyer')
  const [splitConfig, setSplitConfig] = useState({ separator: '_', dimensions: [] })
  const [selectedColumns, setSelectedColumns] = useState(['date', 'campaign_name', 'impressions', 'spend', 'conversions', 'roas'])
  const [selectedAttrColumns, setSelectedAttrColumns] = useState(['af_installs', 'af_revenue', 'af_roas'])

  const platformAccounts = mockAccountsForDataset.filter(a => a.platform === mediaPlatform)
  const filteredAccounts = platformAccounts.filter(a =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase())
  )

  const toggleAccount = (id) => {
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Mock match stats
  const matchStats = useMemo(() => {
    const total = Math.floor(Math.random() * 30) + 30
    const matched = Math.floor(total * (0.75 + Math.random() * 0.2))
    return { total, matched, matchRate: +((matched / total) * 100).toFixed(1) }
  }, [selectedAccountIds, mediaPlatform])

  const mockCampaigns = useMemo(() => {
    const campaigns = ['Product_US_Broad', 'Brand_EU_Retarget', 'Sale_JP_Lookalike', 'Product_KR_Interest', 'Brand_Global_CBO']
    return campaigns.map((name, i) => ({
      name,
      matched: i < 4,
      mediaSpend: +(Math.random() * 1000 + 50).toFixed(2),
      attrRevenue: i < 4 ? +(Math.random() * 3000 + 100).toFixed(2) : null,
    }))
  }, [])

  const getMatchRateColor = (rate) => {
    if (rate >= 80) return 'text-success-600'
    if (rate >= 50) return 'text-warning-600'
    return 'text-danger-600'
  }

  const filteredAttrFields = ATTRIBUTION_METRIC_FIELDS.filter(f =>
    !f.source || f.source === attributionPlatform
  )

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim() && dataStartDate && selectedAccountIds.length > 0
      case 1: return !!attributionPlatform
      case 2: return true
      case 3: return selectedColumns.length > 0
      case 4: return true
      case 5: return true
      default: return false
    }
  }

  const handleFinish = () => {
    const newDs = {
      id: `jds_${Date.now().toString(16)}`,
      name,
      mediaPlatform,
      accountIds: selectedAccountIds,
      attributionPlatform,
      dataStartDate,
      splitConfig: splitConfig.dimensions.length > 0 ? splitConfig : null,
      selectedColumns: [...selectedColumns, ...selectedAttrColumns],
      matchStats,
    }
    onCreate(newDs)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
          <h3 className="text-sm font-black text-neutral-900">New Joined Dataset</h3>
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
            {/* Step 1: Media Platform + Accounts */}
            {step === 0 && (
              <div className="px-8 py-6 space-y-5">
                <div>
                  <label className="text-xs font-black text-neutral-700 mb-1.5 block">Dataset Name</label>
                  <input
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 outline-none focus:border-primary-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Meta × AppsFlyer"
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
                    <label className="text-xs font-black text-neutral-700 mb-1.5 block">Media Platform</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {MEDIA_PLATFORMS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setMediaPlatform(p.id); setSelectedAccountIds([]) }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                            mediaPlatform === p.id ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                          }`}
                        >
                          <img src={p.icon} alt={p.name} className="w-3.5 h-3.5" />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-neutral-700 mb-1.5 block">Select Accounts</label>
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

            {/* Step 2: Attribution Platform */}
            {step === 1 && (
              <div className="px-8 py-6 space-y-5">
                <h4 className="text-xs font-black text-neutral-900">Select Attribution Platform</h4>
                <p className="text-[11px] text-neutral-400">Choose the attribution provider to join with your media data.</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {ATTRIBUTION_PLATFORMS.map(p => {
                    const isActive = attributionPlatform === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => setAttributionPlatform(p.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                          isActive
                            ? 'border-primary-500 bg-primary-50 shadow-lg'
                            : 'border-neutral-100 hover:border-primary-200 hover:bg-neutral-50'
                        }`}
                      >
                        {p.icon ? (
                          <img src={p.icon} alt={p.name} className="w-8 h-8 mb-3" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mb-3 text-neutral-400 text-xs font-black">
                            ×
                          </div>
                        )}
                        <span className={`text-sm font-black ${isActive ? 'text-primary-700' : 'text-neutral-700'}`}>{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Split Config */}
            {step === 2 && (
              <div className="px-8 py-6">
                <h4 className="text-xs font-black text-neutral-900 mb-1">Campaign Name Split</h4>
                <p className="text-[11px] text-neutral-400 mb-4">Parse campaign names into dimensions for matching and analysis.</p>
                <SplitPatternConfig config={splitConfig} onChange={setSplitConfig} />
              </div>
            )}

            {/* Step 4: Field Selection */}
            {step === 3 && (
              <div className="px-8 py-6 space-y-6">
                <FieldSelector
                  fields={[...DIMENSION_FIELDS, ...METRIC_FIELDS]}
                  selected={selectedColumns}
                  onChange={setSelectedColumns}
                  title="Media Fields"
                />
                {attributionPlatform !== 'none' && (
                  <div className="border-t border-neutral-100 pt-5">
                    <FieldSelector
                      fields={filteredAttrFields}
                      selected={selectedAttrColumns}
                      onChange={setSelectedAttrColumns}
                      title="Attribution Fields"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Match Preview */}
            {step === 4 && (
              <div className="px-8 py-6 space-y-5">
                <h4 className="text-xs font-black text-neutral-900">Campaign Match Preview</h4>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getMatchRateColor(matchStats.matchRate)} bg-opacity-10`}>
                  {matchStats.matchRate >= 80 ? <Check size={16} /> : <AlertTriangle size={16} />}
                  {matchStats.matched}/{matchStats.total} campaigns matched ({matchStats.matchRate}%)
                </div>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                  {mockCampaigns.map((c, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${c.matched ? 'bg-neutral-50' : 'bg-danger-50/50'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        c.matched ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-500'
                      }`}>
                        {c.matched ? <Check size={12} /> : <X size={12} />}
                      </div>
                      <span className="text-xs font-bold text-neutral-700 flex-1 font-mono">{c.name}</span>
                      <span className="text-[10px] text-neutral-400">${c.mediaSpend}</span>
                      {c.matched && (
                        <>
                          <ArrowRight size={12} className="text-neutral-300" />
                          <span className="text-[10px] text-success-600 font-bold">${c.attrRevenue}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Confirm */}
            {step === 5 && (
              <div className="px-8 py-6 space-y-4">
                <h4 className="text-xs font-black text-neutral-900">Configuration Summary</h4>
                <div className="bg-neutral-50 rounded-2xl p-6 space-y-3">
                  {[
                    ['Name', name],
                    ['Media Platform', MEDIA_PLATFORMS.find(p => p.id === mediaPlatform)?.name],
                    ['Attribution', ATTRIBUTION_PLATFORMS.find(p => p.id === attributionPlatform)?.name],
                    ['Accounts', `${selectedAccountIds.length} selected`],
                    ['Data Start', dataStartDate],
                    ['Media Fields', `${selectedColumns.length} selected`],
                    ['Attribution Fields', `${selectedAttrColumns.length} selected`],
                    ['Match Rate', `${matchStats.matchRate}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-500">{label}</span>
                      <span className="text-sm font-bold text-neutral-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DatasetWizard>
        </div>
      </div>
    </div>
  )
}

export default JoinedDatasetWizard
