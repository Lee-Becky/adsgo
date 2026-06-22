import { useState } from 'react'
import { Plus, GitMerge, Check, AlertTriangle } from 'lucide-react'
import DataTable from './shared/DataTable'
import TimeRangeFilter from './shared/TimeRangeFilter'
import JoinedDatasetWizard from './JoinedDatasetWizard'
import { MEDIA_PLATFORMS, ATTRIBUTION_PLATFORMS, mockJoinedDatasets, mockJoinedDatasetRows, DIMENSION_FIELDS, METRIC_FIELDS, ATTRIBUTION_METRIC_FIELDS } from './mockData'

const JoinedDatasetTab = () => {
  const [datasets, setDatasets] = useState(mockJoinedDatasets)
  const [selectedId, setSelectedId] = useState(datasets[0]?.id || null)
  const [timeRange, setTimeRange] = useState({ type: 'preset', days: 30 })
  const [showWizard, setShowWizard] = useState(false)

  const selectedDs = datasets.find(ds => ds.id === selectedId)
  const rows = selectedDs ? (mockJoinedDatasetRows[selectedDs.id] || []) : []

  // Build table columns
  const allFields = [...DIMENSION_FIELDS, ...METRIC_FIELDS, ...ATTRIBUTION_METRIC_FIELDS]
  const tableColumns = selectedDs
    ? (selectedDs.selectedColumns || []).map(key => allFields.find(f => f.key === key)).filter(Boolean)
    : []

  const handleCreate = (newDs) => {
    setDatasets(prev => [...prev, newDs])
    setSelectedId(newDs.id)
    setShowWizard(false)
  }

  const getMatchRateColor = (rate) => {
    if (rate >= 80) return 'text-success-600 bg-success-50'
    if (rate >= 50) return 'text-warning-600 bg-warning-50'
    return 'text-danger-600 bg-danger-50'
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex flex-col min-h-[500px]">
        {/* Dataset tabs */}
        <div className="flex items-center gap-2 px-8 py-4 border-b border-neutral-100 overflow-x-auto">
          {datasets.map(ds => {
            const mediaPlatform = MEDIA_PLATFORMS.find(p => p.id === ds.mediaPlatform)
            return (
              <button
                key={ds.id}
                onClick={() => setSelectedId(ds.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold rounded-full whitespace-nowrap transition-all ${
                  selectedId === ds.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {mediaPlatform && <img src={mediaPlatform.icon} alt="" className="w-3.5 h-3.5" />}
                {ds.name}
              </button>
            )
          })}
          <button
            onClick={() => setShowWizard(true)}
            className="p-2 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-full transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        {selectedDs ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                {/* Media platform */}
                {(() => {
                  const mp = MEDIA_PLATFORMS.find(p => p.id === selectedDs.mediaPlatform)
                  return mp && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-info-50 text-info-600 rounded-full">
                      <img src={mp.icon} alt="" className="w-3 h-3" />
                      {mp.name}
                    </span>
                  )
                })()}
                {/* Attribution platform */}
                <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-50 text-purple-600 rounded-full">
                  {ATTRIBUTION_PLATFORMS.find(p => p.id === selectedDs.attributionPlatform)?.name || 'None'}
                </span>
                {/* Match rate */}
                {selectedDs.matchStats && (
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 ${getMatchRateColor(selectedDs.matchStats.matchRate)}`}>
                    {selectedDs.matchStats.matchRate >= 80 ? <Check size={10} /> : <AlertTriangle size={10} />}
                    {selectedDs.matchStats.matched}/{selectedDs.matchStats.total} campaigns ({selectedDs.matchStats.matchRate}%)
                  </span>
                )}
              </div>
              <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <DataTable columns={tableColumns} data={rows} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-16">
            <GitMerge size={40} className="text-neutral-200 mb-4" />
            <p className="text-sm font-bold text-neutral-500 mb-1">No attribution dataset</p>
            <p className="text-xs text-neutral-400 mb-4">Create a joined dataset to correlate media and attribution data</p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              New Joined Dataset
            </button>
          </div>
        )}
      </div>

      {showWizard && (
        <JoinedDatasetWizard
          onClose={() => setShowWizard(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

export default JoinedDatasetTab
