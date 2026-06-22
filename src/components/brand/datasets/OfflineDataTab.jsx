import { useState } from 'react'
import { Plus, Upload, HardDrive, MoreVertical, Trash2, Edit3, FileSpreadsheet, AlertTriangle, Table2, Eye, ScrollText, GripVertical, X, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import DatasetListSidebar from './shared/DatasetListSidebar'
import DataTable from './shared/DataTable'
import TimeRangeFilter from './shared/TimeRangeFilter'
import OfflineUploadModal from './OfflineUploadModal'
import { mockOfflineDatabases, mockOfflineRows } from './mockData'

// Mock logs data
const MOCK_LOGS = [
  { id: 'log_1', time: '2025-06-14 15:30:22', type: 'Upload', detail: 'sales_q1.csv uploaded (12,450 rows)', status: 'success' },
  { id: 'log_2', time: '2025-06-13 09:12:05', type: 'Overwrite', detail: 'Replaced 340 rows for 2025-03-01 ~ 2025-03-15', status: 'success' },
  { id: 'log_3', time: '2025-06-12 18:44:33', type: 'Upload', detail: 'crm_export_v2.xlsx uploaded (8,320 rows)', status: 'success' },
  { id: 'log_4', time: '2025-06-10 11:20:00', type: 'Delete', detail: 'Removed old_data_2024.csv', status: 'success' },
  { id: 'log_5', time: '2025-06-09 08:05:17', type: 'Upload', detail: 'broken_file.csv upload failed', status: 'failed' },
]

// Status badge for logs
const LogStatusBadge = ({ status }) => {
  if (status === 'success') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={10} /> Success
    </span>
  )
  if (status === 'failed') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-danger-500 bg-danger-50 px-2 py-0.5 rounded-full">
      <XCircle size={10} /> Failed
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-warning-600 bg-warning-50 px-2 py-0.5 rounded-full">
      <Loader2 size={10} className="animate-spin" /> Running
    </span>
  )
}

const CONTENT_TABS = [
  { key: 'source', label: 'Source', icon: Table2 },
  { key: 'views', label: 'Views', icon: Eye },
  { key: 'logs', label: 'Logs', icon: ScrollText },
]

// Mock pivot view fields
const PIVOT_FIELDS = [
  { key: 'date', label: 'Date', type: 'dimension' },
  { key: 'product_name', label: 'Product Name', type: 'dimension' },
  { key: 'region', label: 'Region', type: 'dimension' },
  { key: 'channel', label: 'Channel', type: 'dimension' },
  { key: 'revenue', label: 'Revenue', type: 'metric' },
  { key: 'units_sold', label: 'Units Sold', type: 'metric' },
]

const OfflineDataTab = () => {
  const [databases, setDatabases] = useState(mockOfflineDatabases)
  const [selectedId, setSelectedId] = useState(databases[0]?.id || null)
  const [timeRange, setTimeRange] = useState({ type: 'preset', days: 30 })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [contentTab, setContentTab] = useState('source')

  // Pivot view state
  const [pivotRows, setPivotRows] = useState([])
  const [pivotCols, setPivotCols] = useState([])
  const [pivotValues, setPivotValues] = useState([])

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(null) // { fileName, progress, status: 'running'|'done'|'failed' }

  const selectedDb = databases.find(db => db.id === selectedId)
  const rows = selectedDb ? (mockOfflineRows[selectedDb.id] || []) : []

  const handleCreate = (newDb) => {
    // Simulate upload progress
    setUploadProgress({ fileName: newDb.name, progress: 0, status: 'running' })
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 25 + 10
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setUploadProgress(prev => prev ? { ...prev, progress: 100, status: 'done' } : null)
      } else {
        setUploadProgress(prev => prev ? { ...prev, progress: Math.min(p, 99) } : null)
      }
    }, 400)

    setDatabases(prev => [...prev, newDb])
    setSelectedId(newDb.id)
    setShowUploadModal(false)
  }

  const handleDelete = (id) => {
    setDatabases(prev => prev.filter(db => db.id !== id))
    if (selectedId === id) setSelectedId(databases[0]?.id || null)
    setContextMenu(null)
  }

  const handleRename = (id) => {
    const db = databases.find(d => d.id === id)
    const name = prompt('Rename database:', db?.name)
    if (name) {
      setDatabases(prev => prev.map(d => d.id === id ? { ...d, name } : d))
    }
    setContextMenu(null)
  }

  const addToPivotZone = (field, zone) => {
    // Remove from other zones first
    setPivotRows(prev => prev.filter(f => f.key !== field.key))
    setPivotCols(prev => prev.filter(f => f.key !== field.key))
    setPivotValues(prev => prev.filter(f => f.key !== field.key))
    // Add to target zone
    if (zone === 'rows') setPivotRows(prev => [...prev, field])
    else if (zone === 'cols') setPivotCols(prev => [...prev, field])
    else if (zone === 'values') setPivotValues(prev => [...prev, field])
  }

  const removeFromPivot = (fieldKey, zone) => {
    if (zone === 'rows') setPivotRows(prev => prev.filter(f => f.key !== fieldKey))
    else if (zone === 'cols') setPivotCols(prev => prev.filter(f => f.key !== fieldKey))
    else if (zone === 'values') setPivotValues(prev => prev.filter(f => f.key !== fieldKey))
  }

  const usedPivotKeys = new Set([...pivotRows, ...pivotCols, ...pivotValues].map(f => f.key))

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex min-h-[500px]">
        {/* Left sidebar */}
        <DatasetListSidebar
          title="Databases"
          items={databases}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={() => setShowUploadModal(true)}
          renderItem={(item, isActive) => (
            <div
              className="relative"
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({ id: item.id, x: e.clientX, y: e.clientY })
              }}
            >
              <div className="flex items-center gap-2">
                <HardDrive size={12} className={isActive ? 'text-primary-500' : 'text-neutral-400'} />
                <p className={`text-xs font-bold truncate ${isActive ? 'text-primary-700' : 'text-neutral-700'}`}>{item.name}</p>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-400">
                <span>{item.rowCount.toLocaleString()} rows</span>
                <span>{item.size}</span>
              </div>
              <p className="text-[9px] text-neutral-300 mt-0.5">{item.uploadDate}</p>
            </div>
          )}
        />

        {/* Right content */}
        <div className="flex-1 flex flex-col">
          {selectedDb ? (
            <>
              {/* Toolbar with content tabs */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                  {/* Content Tabs */}
                  <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg">
                    {CONTENT_TABS.map(tab => {
                      const Icon = tab.icon
                      const isActive = contentTab === tab.key
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setContentTab(tab.key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                            isActive
                              ? 'bg-white text-neutral-900 shadow-sm'
                              : 'text-neutral-500 hover:text-neutral-700'
                          }`}
                        >
                          <Icon size={12} />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-500">
                    {selectedDb.rowCount.toLocaleString()} rows × {selectedDb.columns.length} cols
                  </span>
                </div>
                {contentTab === 'source' && (
                  <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
                )}
              </div>

              {/* Tab Content */}
              {contentTab === 'source' && (
                <div className="flex-1 overflow-auto">
                  <DataTable columns={selectedDb.columns} data={rows} showSummary />
                </div>
              )}

              {contentTab === 'views' && (
                <div className="flex-1 flex overflow-hidden">
                  {/* Left: Available fields */}
                  <div className="w-48 border-r border-neutral-100 p-4 flex flex-col gap-3 overflow-auto">
                    <h4 className="text-[10px] font-black text-neutral-400">Available Fields</h4>
                    <div className="space-y-1.5">
                      {PIVOT_FIELDS.filter(f => !usedPivotKeys.has(f.key)).map(field => (
                        <div
                          key={field.key}
                          className="flex items-center gap-2 px-2.5 py-2 bg-neutral-50 rounded-lg border border-neutral-100 cursor-grab hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                        >
                          <GripVertical size={10} className="text-neutral-300 group-hover:text-primary-400" />
                          <span className="text-[11px] font-bold text-neutral-700 flex-1">{field.label}</span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => addToPivotZone(field, 'rows')}
                              className="px-1.5 py-0.5 text-[8px] font-bold text-info-600 bg-info-50 rounded hover:bg-info-100"
                              title="Add to Rows"
                            >R</button>
                            <button
                              onClick={() => addToPivotZone(field, 'cols')}
                              className="px-1.5 py-0.5 text-[8px] font-bold text-success-600 bg-success-50 rounded hover:bg-success-100"
                              title="Add to Columns"
                            >C</button>
                            <button
                              onClick={() => addToPivotZone(field, 'values')}
                              className="px-1.5 py-0.5 text-[8px] font-bold text-violet-600 bg-violet-50 rounded hover:bg-violet-100"
                              title="Add to Values"
                            >V</button>
                          </div>
                        </div>
                      ))}
                      {PIVOT_FIELDS.filter(f => !usedPivotKeys.has(f.key)).length === 0 && (
                        <p className="text-[10px] text-neutral-400 italic">All fields assigned</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Drop zones */}
                  <div className="flex-1 p-5 space-y-4 overflow-auto">
                    <p className="text-[11px] text-neutral-400">Configure a pivot view by assigning fields to Rows, Columns, and Values zones.</p>

                    {/* Row zone */}
                    <div>
                      <h4 className="text-[10px] font-black text-info-500 mb-2">Rows</h4>
                      <div className="min-h-[48px] border-2 border-dashed border-info-200 rounded-xl p-2 flex flex-wrap gap-1.5 bg-info-50/30">
                        {pivotRows.length === 0 && <span className="text-[10px] text-info-300 italic m-auto">Drop dimension fields here</span>}
                        {pivotRows.map(f => (
                          <span key={f.key} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-info-100 text-info-700 rounded-md">
                            {f.label}
                            <button onClick={() => removeFromPivot(f.key, 'rows')} className="hover:text-danger-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Column zone */}
                    <div>
                      <h4 className="text-[10px] font-black text-success-500 mb-2">Columns</h4>
                      <div className="min-h-[48px] border-2 border-dashed border-success-200 rounded-xl p-2 flex flex-wrap gap-1.5 bg-success-50/30">
                        {pivotCols.length === 0 && <span className="text-[10px] text-success-300 italic m-auto">Drop dimension fields here</span>}
                        {pivotCols.map(f => (
                          <span key={f.key} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-success-100 text-success-700 rounded-md">
                            {f.label}
                            <button onClick={() => removeFromPivot(f.key, 'cols')} className="hover:text-danger-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Value zone */}
                    <div>
                      <h4 className="text-[10px] font-black text-violet-500 mb-2">Values</h4>
                      <div className="min-h-[48px] border-2 border-dashed border-violet-200 rounded-xl p-2 flex flex-wrap gap-1.5 bg-violet-50/30">
                        {pivotValues.length === 0 && <span className="text-[10px] text-violet-300 italic m-auto">Drop metric fields here</span>}
                        {pivotValues.map(f => (
                          <span key={f.key} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-md">
                            {f.label}
                            <button onClick={() => removeFromPivot(f.key, 'values')} className="hover:text-danger-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pivot preview placeholder */}
                    {(pivotRows.length > 0 || pivotCols.length > 0) && pivotValues.length > 0 && (
                      <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <h4 className="text-[10px] font-black text-neutral-500 mb-2">Preview</h4>
                        <p className="text-[11px] text-neutral-400">
                          Rows: {pivotRows.map(f => f.label).join(', ') || '—'} &nbsp;|&nbsp;
                          Columns: {pivotCols.map(f => f.label).join(', ') || '—'} &nbsp;|&nbsp;
                          Values: {pivotValues.map(f => f.label).join(', ')}
                        </p>
                        <div className="mt-3 bg-white rounded-lg border border-neutral-200 p-3">
                          <p className="text-[10px] text-neutral-300 italic text-center py-4">Pivot table preview will render here when connected to live data</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {contentTab === 'logs' && (
                <div className="flex-1 overflow-auto p-5">
                  <div className="space-y-2">
                    {MOCK_LOGS.map(log => (
                      <div key={log.id} className="flex items-center gap-4 px-4 py-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                        <span className="text-[11px] font-mono text-neutral-400 w-36 flex-shrink-0">{log.time}</span>
                        <span className="text-[11px] font-black text-neutral-600 w-20 flex-shrink-0">{log.type}</span>
                        <span className="text-[11px] font-medium text-neutral-600 flex-1 truncate">{log.detail}</span>
                        <LogStatusBadge status={log.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-16">
              <FileSpreadsheet size={40} className="text-neutral-200 mb-4" />
              <p className="text-sm font-bold text-neutral-500 mb-1">No database selected</p>
              <p className="text-xs text-neutral-400 mb-4">Create a new database to get started</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                <Upload size={14} />
                New Database
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-neutral-100 py-2 min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => handleRename(contextMenu.id)}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Edit3 size={12} />
              Rename
            </button>
            <button
              onClick={() => handleDelete(contextMenu.id)}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-danger-500 hover:bg-danger-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </>
      )}

      {/* Upload progress floating panel */}
      {uploadProgress && (
        <div className="fixed top-4 right-4 z-[9990] w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-neutral-700">Upload Progress</span>
            <button
              onClick={() => setUploadProgress(null)}
              className="p-0.5 hover:bg-neutral-100 rounded"
            >
              <X size={12} className="text-neutral-400" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet size={14} className="text-neutral-400 flex-shrink-0" />
            <span className="text-[11px] font-medium text-neutral-600 truncate">{uploadProgress.fileName}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                uploadProgress.status === 'failed' ? 'bg-danger-500' :
                uploadProgress.status === 'done' ? 'bg-success-500' : 'bg-primary-500'
              }`}
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-[10px] font-bold ${
              uploadProgress.status === 'failed' ? 'text-danger-500' :
              uploadProgress.status === 'done' ? 'text-success-600' : 'text-primary-600'
            }`}>
              {uploadProgress.status === 'running' && `${Math.floor(uploadProgress.progress)}%`}
              {uploadProgress.status === 'done' && 'Complete'}
              {uploadProgress.status === 'failed' && 'Failed'}
            </span>
            <div className="flex items-center gap-1.5">
              {uploadProgress.status === 'failed' && (
                <button className="text-[10px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                  <RefreshCw size={10} /> Retry
                </button>
              )}
              {uploadProgress.status === 'running' && (
                <button
                  onClick={() => setUploadProgress(prev => prev ? { ...prev, status: 'failed' } : null)}
                  className="text-[10px] font-bold text-danger-500 hover:text-danger-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      <OfflineUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default OfflineDataTab
