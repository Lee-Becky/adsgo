import { useState } from 'react'
import { Plus, Image, Video, Layers } from 'lucide-react'
import DataTable from './shared/DataTable'
import TimeRangeFilter from './shared/TimeRangeFilter'
import CreativeDatasetWizard from './CreativeDatasetWizard'
import { MEDIA_PLATFORMS, mockCreativeDatasets, mockCreativeDatasetRows, CREATIVE_METRIC_FIELDS } from './mockData'

const ASSET_TYPE_ICONS = { video: Video, image: Image, all: Layers }

const CreativeDatasetTab = () => {
  const [datasets, setDatasets] = useState(mockCreativeDatasets)
  const [selectedPlatform, setSelectedPlatform] = useState('meta')
  const [selectedId, setSelectedId] = useState(datasets[0]?.id || null)
  const [timeRange, setTimeRange] = useState({ type: 'preset', days: 30 })
  const [showWizard, setShowWizard] = useState(false)

  const platformDatasets = datasets.filter(ds => ds.platform === selectedPlatform)
  const selectedDs = datasets.find(ds => ds.id === selectedId)
  const rows = selectedDs ? (mockCreativeDatasetRows[selectedDs.id] || []) : []

  // Build columns: asset_name, asset_type + selectedColumns
  const baseColumns = [
    { key: 'asset_name', label: 'Asset Name', type: 'dimension' },
    { key: 'asset_type', label: 'Type', type: 'dimension' },
  ]
  const metricCols = selectedDs
    ? (selectedDs.selectedColumns || []).map(key => CREATIVE_METRIC_FIELDS.find(f => f.key === key)).filter(Boolean)
    : []
  const tableColumns = [...baseColumns, ...metricCols]

  const handleCreate = (newDs) => {
    setDatasets(prev => [...prev, newDs])
    setSelectedId(newDs.id)
    setSelectedPlatform(newDs.platform)
    setShowWizard(false)
  }

  const platformCounts = {}
  datasets.forEach(ds => { platformCounts[ds.platform] = (platformCounts[ds.platform] || 0) + 1 })

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex min-h-[500px]">
        {/* Left: Platform list */}
        <div className="w-[192px] flex-shrink-0 border-r border-neutral-100">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h4 className="text-[10px] font-black text-neutral-400">Platforms</h4>
          </div>
          <div className="py-1">
            {MEDIA_PLATFORMS.map(p => {
              const isActive = selectedPlatform === p.id
              const count = platformCounts[p.id] || 0
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlatform(p.id)
                    const first = datasets.find(ds => ds.platform === p.id)
                    if (first) setSelectedId(first.id)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                    isActive ? 'bg-primary-50 border-r-2 border-primary-500' : 'hover:bg-neutral-50'
                  }`}
                >
                  <img src={p.icon} alt={p.name} className="w-4 h-4" />
                  <span className={`text-xs font-bold flex-1 text-left ${isActive ? 'text-primary-700' : 'text-neutral-700'}`}>{p.name}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 text-neutral-500 rounded-full">{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col">
          {/* Dataset tabs */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-100 overflow-x-auto">
            {platformDatasets.map(ds => (
              <button
                key={ds.id}
                onClick={() => setSelectedId(ds.id)}
                className={`px-4 py-2 text-[11px] font-bold rounded-full whitespace-nowrap transition-all ${
                  selectedId === ds.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {ds.name}
              </button>
            ))}
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
              <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {selectedDs.assetTypes.map(t => {
                      const Icon = ASSET_TYPE_ICONS[t] || Layers
                      return (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-bold bg-neutral-100 text-neutral-600 rounded-full flex items-center gap-1">
                          <Icon size={10} />
                          {t}
                        </span>
                      )
                    })}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-500">
                    {selectedDs.accountIds.length} accounts
                  </span>
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
              <Image size={40} className="text-neutral-200 mb-4" />
              <p className="text-sm font-bold text-neutral-500 mb-1">No creative dataset</p>
              <p className="text-xs text-neutral-400 mb-4">Create a new creative dataset to get started</p>
              <button
                onClick={() => setShowWizard(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                New Dataset
              </button>
            </div>
          )}
        </div>
      </div>

      {showWizard && (
        <CreativeDatasetWizard
          onClose={() => setShowWizard(false)}
          onCreate={handleCreate}
          defaultPlatform={selectedPlatform}
        />
      )}
    </div>
  )
}

export default CreativeDatasetTab
