import { useState, useRef } from 'react'
import { X, Upload, FileSpreadsheet, Check, AlertCircle, Calendar, Loader2, AlertTriangle } from 'lucide-react'
import DatasetWizard from './shared/DatasetWizard'

const STEPS = ['Upload File', 'Parsing', 'Date Column', 'Confirm & Create']

const FIELD_TYPES = ['Text', 'Number', 'Date']

// Mock overwrite conflict data
const MOCK_CONFLICT_DATES = [
  { date: '2025-03-01', oldRows: 45, newRows: 52 },
  { date: '2025-03-02', oldRows: 43, newRows: 50 },
  { date: '2025-03-03', oldRows: 41, newRows: 48 },
  { date: '2025-03-04', oldRows: 44, newRows: 51 },
  { date: '2025-03-05', oldRows: 42, newRows: 49 },
]

const OfflineUploadModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [dateColumn, setDateColumn] = useState('')
  const [columns, setColumns] = useState([])
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false)
  const fileInputRef = useRef(null)

  const resetState = () => {
    setStep(0)
    setFile(null)
    setName('')
    setDateColumn('')
    setColumns([])
    setUploading(false)
    setParsing(false)
    setHasConflict(false)
    setShowOverwriteWarning(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  // Step 0: File selection
  const handleFileDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (!f) return
    setFile(f)
    setName(f.name.replace(/\.(csv|xlsx?)$/i, ''))
  }

  // Step 1: Auto-advance to parsing, then show parsed columns
  const startParsing = () => {
    setParsing(true)
    // Simulate parsing delay
    setTimeout(() => {
      const mockCols = [
        { key: 'date', label: 'Date', type: 'Date' },
        { key: 'product_name', label: 'Product Name', type: 'Text' },
        { key: 'revenue', label: 'Revenue', type: 'Number' },
        { key: 'units', label: 'Units', type: 'Number' },
        { key: 'region', label: 'Region', type: 'Text' },
      ]
      setColumns(mockCols)
      setDateColumn('date')
      setParsing(false)
      // Auto-advance to date column step
      setStep(2)
    }, 1200)
  }

  const handleColumnTypeChange = (index, type) => {
    setColumns(prev => prev.map((c, i) => i === index ? { ...c, type } : c))
  }

  const handleCreate = () => {
    setUploading(true)
    setTimeout(() => {
      const newDb = {
        id: `db_${Date.now()}`,
        name,
        rowCount: Math.floor(Math.random() * 10000) + 500,
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().slice(0, 10),
        dataStartDate: new Date().toISOString().slice(0, 10),
        columns,
      }
      onCreate(newDb)
      resetState()
    }, 1500)
  }

  const canProceed = () => {
    switch (step) {
      case 0: return file && name.trim()
      case 1: return !parsing // auto-proceeds when parsing is done
      case 2: return dateColumn && columns.length > 0
      case 3: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (step === 0) {
      // Move to parsing step and start parsing
      setStep(1)
      setTimeout(() => startParsing(), 100)
    } else if (step === 2) {
      // Check for conflicts before moving to confirm
      // Mock: randomly decide if there's a conflict
      setHasConflict(true)
      setStep(3)
    } else {
      setStep(s => s + 1)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">Create Offline Database</h3>
            <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Wizard */}
          <div className="flex-1 overflow-y-auto">
            <DatasetWizard
              steps={STEPS}
              currentStep={step}
              onStepClick={(s) => {
                // Only allow going back
                if (s < step) setStep(s)
              }}
              onNext={handleNext}
              onPrev={() => setStep(s => Math.max(0, s - 1))}
              onFinish={handleCreate}
              canProceed={canProceed()}
            >
              {/* Step 0: File Selection */}
              {step === 0 && (
                <div className="px-8 py-6 space-y-6">
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                      file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileDrop}
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileSpreadsheet size={24} className="text-emerald-500" />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Check size={18} className="text-emerald-500" />
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-bold text-slate-500">Drag & drop or click to upload</p>
                        <p className="text-[10px] text-slate-400 mt-1">Supports CSV, Excel (.xlsx, .xls)</p>
                      </>
                    )}
                  </div>

                  {file && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <label className="text-xs font-black text-slate-700 mb-1.5 block">Database Name</label>
                        <input
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-400"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter database name"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Parsing */}
              {step === 1 && (
                <div className="px-8 py-16 flex flex-col items-center justify-center">
                  {parsing ? (
                    <>
                      <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-sm font-bold text-slate-700">Parsing file...</p>
                      <p className="text-[11px] text-slate-400 mt-1">Detecting columns and data types</p>
                    </>
                  ) : (
                    <>
                      <Check size={32} className="text-emerald-500 mb-3" />
                      <p className="text-sm font-bold text-slate-700">Parsing complete</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Detected {columns.length} columns
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Date Column Confirmation */}
              {step === 2 && (
                <div className="px-8 py-6 space-y-5">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Select Date Column</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Choose which column serves as the date primary key for time-series data.</p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      Date Column
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-400 bg-white"
                      value={dateColumn}
                      onChange={(e) => setDateColumn(e.target.value)}
                    >
                      <option value="">Select date column...</option>
                      {columns.map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 mb-2">Configure Field Types</h4>
                    <p className="text-[11px] text-slate-400 mb-3">Review auto-detected types and adjust if needed.</p>
                    <div className="space-y-2">
                      {columns.map((col, idx) => (
                        <div key={col.key} className="flex items-center gap-4 px-4 py-3 bg-slate-50 rounded-xl">
                          <span className="text-xs font-bold text-slate-700 flex-1">{col.label}</span>
                          <select
                            className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-indigo-400"
                            value={col.type}
                            onChange={(e) => handleColumnTypeChange(idx, e.target.value)}
                          >
                            {FIELD_TYPES.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <span className="text-[10px] font-mono text-slate-300">{col.key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm & Create (with overwrite conflict) */}
              {step === 3 && (
                <div className="px-8 py-6 space-y-4">
                  <h4 className="text-xs font-black text-slate-900">Preview & Confirm</h4>

                  {/* Overwrite conflict warning */}
                  {hasConflict && (
                    <div className="border border-amber-200 bg-amber-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <span className="text-xs font-black text-amber-700">Date Overlap Detected</span>
                      </div>
                      <p className="text-[11px] text-amber-600 mb-3">
                        The uploaded data overlaps with existing dates. Rows on these dates will be replaced.
                      </p>
                      <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="bg-amber-50 text-amber-700">
                              <th className="px-3 py-2 text-left font-black">Date</th>
                              <th className="px-3 py-2 text-right font-black">Old Rows</th>
                              <th className="px-3 py-2 text-right font-black">New Rows</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-100">
                            {MOCK_CONFLICT_DATES.map(d => (
                              <tr key={d.date}>
                                <td className="px-3 py-1.5 text-slate-700 font-mono">{d.date}</td>
                                <td className="px-3 py-1.5 text-right text-red-500 font-bold">{d.oldRows}</td>
                                <td className="px-3 py-1.5 text-right text-emerald-600 font-bold">{d.newRows}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Name</span>
                      <span className="text-sm font-bold text-slate-900">{name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">File</span>
                      <span className="text-sm font-medium text-slate-700">{file?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Date Column</span>
                      <span className="text-sm font-medium text-slate-700">{dateColumn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Columns</span>
                      <span className="text-sm font-medium text-slate-700">{columns.length}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex flex-wrap gap-1.5">
                        {columns.map(col => (
                          <span key={col.key} className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded-md text-slate-600">
                            {col.label} ({col.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {uploading && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl animate-in fade-in duration-200">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-indigo-600">Uploading and processing...</span>
                    </div>
                  )}
                </div>
              )}
            </DatasetWizard>
          </div>
        </div>
      </div>
    </>
  )
}

export default OfflineUploadModal
