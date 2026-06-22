import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Search, Check, CheckSquare, Square, Loader2, Download, Upload } from 'lucide-react'
import { PLATFORMS, mockAccountPool } from './mockData'

const PLATFORM_TABS = [
  { key: 'all', label: 'All' },
  ...PLATFORMS.map(p => ({ key: p.id, label: p.name, icon: p.icon })),
  { key: 'other', label: 'Other' },
]

const AdAccountSearchModal = ({ isOpen, onClose, onAdd, existingIds = [] }) => {
  const [allAccounts, setAllAccounts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activePlatformTab, setActivePlatformTab] = useState('all')
  const [selected, setSelected] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [importMeta, setImportMeta] = useState(null)
  const fileInputRef = useRef(null)

  // Load all accounts on open
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setSearchQuery('')
      setActivePlatformTab('all')
      setSelected(new Set())
      setImportMeta(null)
      // Simulate paginated API fetch
      setTimeout(() => {
        setAllAccounts([...mockAccountPool])
        setIsLoading(false)
      }, 400)
    }
  }, [isOpen])

  // Filtered accounts (platform tab + search)
  const visibleAccounts = useMemo(() => {
    let list = allAccounts
    if (activePlatformTab !== 'all') {
      if (activePlatformTab === 'other') {
        const knownIds = PLATFORMS.map(p => p.id)
        list = list.filter(a => !knownIds.includes(a.platform))
      } else {
        list = list.filter(a => a.platform === activePlatformTab)
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
      )
    }
    return list
  }, [allAccounts, activePlatformTab, searchQuery])

  const selectableItems = visibleAccounts.filter(a => !existingIds.includes(a.id))
  const allSelected = selectableItems.length > 0 && selectableItems.every(a => selected.has(a.id))

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) {
        selectableItems.forEach(a => next.delete(a.id))
      } else {
        selectableItems.forEach(a => next.add(a.id))
      }
      return next
    })
  }

  const handleConfirm = () => {
    const toAdd = allAccounts.filter(a => selected.has(a.id))
    onAdd(toAdd)
    onClose()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Mock: simulate parsing Excel/CSV
    setTimeout(() => {
      const mockImported = mockAccountPool.slice(0, 3)
      setAllAccounts(prev => {
        const existingSet = new Set(prev.map(a => a.id))
        const newOnes = mockImported.filter(a => !existingSet.has(a.id))
        return [...prev, ...newOnes]
      })
      // Auto-select imported accounts
      setSelected(prev => {
        const next = new Set(prev)
        mockImported.forEach(a => next.add(a.id))
        return next
      })
      setImportMeta({ imported: 3, notFound: 1, invalid: 1 })
    }, 500)
    e.target.value = ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl border border-neutral-100 max-h-[84vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-success-50 flex items-center justify-center">
              <Check size={14} className="text-success-500" />
            </div>
            <h3 className="text-sm font-black text-neutral-900">Bind Ad Accounts</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={18} className="text-neutral-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto flex flex-col gap-2.5 px-8 py-5">
          {/* Hint */}
          <p className="text-[13px] text-neutral-500 m-0">
            Accounts below are from the CyberMedia permission system. Select the ones to bind with this customer.
          </p>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-[13px] text-neutral-900 outline-none focus:border-primary-400"
              placeholder="Search account name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Platform Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {PLATFORM_TABS.map(tab => {
              const isActive = activePlatformTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActivePlatformTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    isActive
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  {tab.icon && <img src={tab.icon} alt="" className="w-3.5 h-3.5" />}
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Select All + Count */}
          <div className="flex items-center justify-between text-[13px] text-neutral-500">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <button onClick={handleSelectAll} className="flex items-center">
                {allSelected
                  ? <CheckSquare size={15} className="text-primary-500" />
                  : <Square size={15} className="text-neutral-300" />
                }
              </button>
              <span className="text-xs font-medium">Select all current results</span>
            </label>
            <span className="text-xs font-bold">Selected: {selected.size}</span>
          </div>

          {/* Account List */}
          <div className="flex-1 overflow-auto min-h-[200px] border border-neutral-200 rounded-xl bg-neutral-50/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-neutral-400 text-[13px]">
                <Loader2 size={16} className="animate-spin mr-2" />
                Loading accounts...
              </div>
            ) : visibleAccounts.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-neutral-400 text-[13px]">
                No accounts found.
              </div>
            ) : (
              <div>
                {visibleAccounts.map(account => {
                  const isExisting = existingIds.includes(account.id)
                  const isSelected = selected.has(account.id)
                  const platform = PLATFORMS.find(p => p.id === account.platform)
                  return (
                    <label
                      key={account.id}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-neutral-100 last:border-b-0 transition-colors cursor-pointer ${
                        isExisting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        if (!isExisting) toggleSelect(account.id)
                      }}
                    >
                      {/* Checkbox */}
                      {isExisting ? (
                        <Check size={15} className="text-success-500 flex-shrink-0" />
                      ) : isSelected ? (
                        <CheckSquare size={15} className="text-primary-500 flex-shrink-0" />
                      ) : (
                        <Square size={15} className="text-neutral-300 flex-shrink-0" />
                      )}

                      {/* Platform icon */}
                      {platform && (
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: platform.color + '15' }}
                        >
                          <img src={platform.icon} alt={platform.name} className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Account info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-neutral-800 truncate">
                          {account.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {account.id} · {platform?.name || 'Unknown'}
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Batch Import Section */}
          <div className="border-t border-dashed border-neutral-200 pt-2.5">
            <p className="text-[12px] text-neutral-400 mb-2">
              Need batch import? Upload Excel / CSV with column <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">account_id</code> (max 1000 rows). Imported accounts will be merged into selection.
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => alert('Template download (mock)')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg bg-white text-neutral-600 text-[12px] font-medium hover:bg-neutral-50 transition-colors"
              >
                <Download size={13} />
                Download Template
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-violet-300 rounded-lg bg-violet-50 text-violet-700 text-[12px] font-medium hover:bg-violet-100 transition-colors"
              >
                <Upload size={13} />
                Upload Excel / CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              {importMeta && (
                <span className="text-[12px] text-neutral-500">
                  Imported <span className="font-bold text-success-600">{importMeta.imported}</span>,
                  not found <span className="font-bold text-warning-600">{importMeta.notFound}</span>,
                  invalid <span className="font-bold text-danger-500">{importMeta.invalid}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="px-6 py-2.5 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Confirm Bind
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdAccountSearchModal
