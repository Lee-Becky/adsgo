import { useState, useCallback } from 'react'
import { Link2, Plus, Search, Database, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import AdAccountSearchModal from './AdAccountSearchModal'
import { PLATFORMS, CONNECT_METHODS, mockLinkedAccounts } from './mockData'

const AdAccounts = () => {
  const [accounts, setAccounts] = useState(mockLinkedAccounts)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [connectingPlatform, setConnectingPlatform] = useState(null)
  const [expandedPlatforms, setExpandedPlatforms] = useState(() => {
    const grouped = {}
    mockLinkedAccounts.forEach(a => { grouped[a.platform] = true })
    return grouped
  })
  const [dragState, setDragState] = useState({ platformId: null, fromIdx: null })

  // Group accounts by platform
  const groupedAccounts = PLATFORMS.reduce((acc, p) => {
    const items = accounts.filter(a => a.platform === p.id)
    if (items.length > 0) acc[p.id] = items
    return acc
  }, {})

  const handleAddAccounts = (newAccounts) => {
    setAccounts(prev => {
      const existingIds = new Set(prev.map(a => a.id))
      const toAdd = newAccounts.filter(a => !existingIds.has(a.id))
      return [...prev, ...toAdd]
    })
  }

  const handleRemoveAccount = (accountId) => {
    setAccounts(prev => prev.filter(a => a.id !== accountId))
  }

  const handleConnectPlatform = (method) => {
    if (method.id === 'cybermedia') {
      setShowSearchModal(true)
      return
    }
    // Simulate OAuth connection
    setConnectingPlatform(method.id)
    setTimeout(() => {
      setConnectingPlatform(null)
      // Mock: add a demo account after "connecting"
      const platform = method.platform
      const mockAccount = {
        id: `direct_${Date.now()}`,
        name: `${method.label} Account`,
        platform,
        source: 'direct',
        status: 'active',
      }
      handleAddAccounts([mockAccount])
    }, 2000)
  }

  // Drag & drop within a platform group
  const handleDragStart = (platformId, idx) => {
    setDragState({ platformId, fromIdx: idx })
  }
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (platformId, toIdx) => {
    if (dragState.platformId !== platformId || dragState.fromIdx === null) return
    const fromIdx = dragState.fromIdx
    setAccounts(prev => {
      const platformAccounts = prev.filter(a => a.platform === platformId)
      const others = prev.filter(a => a.platform !== platformId)
      const [moved] = platformAccounts.splice(fromIdx, 1)
      platformAccounts.splice(toIdx, 0, moved)
      return [...others, ...platformAccounts]
    })
    setDragState({ platformId: null, fromIdx: null })
  }

  const togglePlatform = (pid) => {
    setExpandedPlatforms(prev => ({ ...prev, [pid]: !prev[pid] }))
  }

  const totalAccounts = accounts.length

  return (
    <div className="space-y-8">
      {/* Connect Methods */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <header className="px-10 py-6 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm">
              <Link2 size={16} />
            </div>
            <h2 className="text-sm font-black text-neutral-900">Connect Ad Accounts</h2>
          </div>
          <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full">
            {totalAccounts} connected
          </span>
        </header>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONNECT_METHODS.map(method => {
              const isConnecting = connectingPlatform === method.id
              const platformInfo = PLATFORMS.find(p => p.id === method.platform)
              return (
                <button
                  key={method.id}
                  onClick={() => handleConnectPlatform(method)}
                  disabled={isConnecting}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isConnecting
                      ? 'border-primary-300 bg-primary-50 opacity-70'
                      : 'border-neutral-100 bg-neutral-50/50 hover:border-primary-200 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-white shadow-sm border border-neutral-100">
                    {method.id === 'cybermedia' ? (
                      <Database size={22} className="text-primary-500" />
                    ) : (
                      <img src={platformInfo?.icon} alt={method.label} className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-xs font-black text-neutral-900 mb-1">{method.label}</p>
                  <p className="text-[10px] text-neutral-400 text-center leading-tight">{method.description}</p>
                  {isConnecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Linked Accounts by Platform */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <header className="px-10 py-6 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-neutral-900">Linked Accounts</h2>
          </div>
        </header>

        <div className="p-10">
          {Object.keys(groupedAccounts).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Link2 size={40} className="text-neutral-200 mb-4" />
              <p className="text-sm font-bold text-neutral-500 mb-1">No accounts connected</p>
              <p className="text-xs text-neutral-400">Choose a connection method above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {PLATFORMS.filter(p => groupedAccounts[p.id]).map(platform => {
                const items = groupedAccounts[platform.id]
                const isExpanded = expandedPlatforms[platform.id] !== false
                return (
                  <div key={platform.id} className="border border-neutral-100 rounded-2xl overflow-hidden">
                    {/* Platform header */}
                    <button
                      onClick={() => togglePlatform(platform.id)}
                      className="w-full flex items-center gap-3 px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <img src={platform.icon} alt={platform.name} className="w-5 h-5" />
                      <span className="text-sm font-black text-neutral-900">{platform.name}</span>
                      <span className="px-2 py-0.5 bg-white text-neutral-500 text-[10px] font-bold rounded-full border border-neutral-200">
                        {items.length}
                      </span>
                      <div className="ml-auto">
                        {isExpanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                      </div>
                    </button>

                    {/* Account list */}
                    {isExpanded && (
                      <div className="divide-y divide-neutral-50">
                        {items.map((account, idx) => (
                          <div
                            key={account.id}
                            draggable
                            onDragStart={() => handleDragStart(platform.id, idx)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(platform.id, idx)}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-50/50 group transition-colors"
                          >
                            <GripVertical size={14} className="text-neutral-200 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-800 truncate">{account.name}</p>
                              <p className="text-[11px] text-neutral-400 font-mono">{account.id}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              account.source === 'cybermedia'
                                ? 'bg-primary-50 text-primary-500'
                                : 'bg-success-50 text-success-500'
                            }`}>
                              {account.source === 'cybermedia' ? 'CyberMedia' : 'Direct'}
                            </span>
                            <button
                              onClick={() => handleRemoveAccount(account.id)}
                              className="p-1.5 text-neutral-300 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <AdAccountSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onAdd={handleAddAccounts}
        existingIds={accounts.map(a => a.id)}
      />
    </div>
  )
}

export default AdAccounts
