import { useState, useEffect } from 'react'
import { ShieldCheck, Info, RefreshCw, Plus, GripVertical, CheckCircle2, X, Link2, Loader2, Search, Trash2, Link2Off, AlertTriangle } from 'lucide-react'
import { useZIndex } from '../../../hooks/useZIndex'

const AssetSection = ({ formData, updateFormData, validation, setValidation }) => {
  const [activePlatform, setActivePlatform] = useState('meta')
  const [isFetching, setIsFetching] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedItemIndex, setDraggedItemIndex] = useState(null)

  const zIndexAddModal = useZIndex(showAddModal);
  const zIndexDisconnectModal = useZIndex(showDisconnectConfirm);
  
  const platforms = [
    { id: 'meta', label: 'Meta', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256', enabled: true },
    { id: 'google', label: 'Google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256', enabled: true },
    { id: 'tiktok', label: 'TikTok', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256', enabled: false },
    { id: 'bing', label: 'Bing', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256', enabled: false }
  ]

  const [accounts, setAccounts] = useState([
    { id: '376753835223380', name: 'Ferad Lee', priority: 1 },
    { id: '785124190350534', name: '额度我单位', priority: 2 },
    { id: '111222333444555', name: 'Global Marketing Hub', priority: 3 },
    { id: '999888777666555', name: 'Agency Prime Account', priority: 4 }
  ])

  const availableAccountsPool = [
    { id: '444555666777888', name: 'Brand Strategy Node' },
    { id: '222333444555666', name: 'Venture Capital Lead' }
  ]

  const filteredPool = availableAccountsPool.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    acc.id.includes(searchQuery)
  )

  const handleConnect = () => {
    setIsFetching(true)
    setCountdown(10)
  }

  const handleDisconnect = () => {
    setIsAuthorized(false)
    setShowDisconnectConfirm(false)
    // Optional: clear accounts
    // setAccounts([])
  }

  const handleAddAccount = (acc) => {
    if (!accounts.find(a => a.id === acc.id)) {
      const newAccounts = [...accounts, { ...acc, priority: accounts.length + 1 }]
      setAccounts(newAccounts)
    }
    setShowAddModal(false)
    setSearchQuery('')
  }

  const handleRemoveAccount = (id) => {
    const filtered = accounts.filter(a => a.id !== id)
    const reordered = filtered.map((a, i) => ({ ...a, priority: i + 1 }))
    setAccounts(reordered)
  }

  // --- HTML5 Drag & Drop Logic ---
  const handleDragStart = (index) => {
    setDraggedItemIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === index) return

    const newAccounts = [...accounts]
    const itemToMove = newAccounts.splice(draggedItemIndex, 1)[0]
    newAccounts.splice(index, 0, itemToMove)
    
    const reordered = newAccounts.map((acc, i) => ({ ...acc, priority: i + 1 }))
    
    setAccounts(reordered)
    setDraggedItemIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedItemIndex(null)
  }

  // Countdown logic
  useEffect(() => {
    let timer
    if (isFetching && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (isFetching && countdown === 0) {
      setIsFetching(false)
      setIsAuthorized(true)
    }
    return () => clearInterval(timer)
  }, [isFetching, countdown])

  useEffect(() => {
    setValidation(prev => ({ ...prev, assets: isAuthorized && accounts.length > 0 }))
  }, [isAuthorized, accounts, setValidation])

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck size={16} />
          </div>
          <h2 className="text-sm font-black text-slate-900">Ad Scope (Assigned account)</h2>
        </div>
        {validation.assets && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-8">
        {/* Platform Tabs - Improved States */}
        <div className="bg-slate-50 p-1.5 rounded-[24px] flex gap-3">
          {platforms.map((p) => {
            const isActive = activePlatform === p.id
            const isEnabled = p.enabled
            return (
              <div key={p.id} className="flex-1 relative group/tab">
                <button
                  disabled={!isEnabled}
                  onClick={() => isEnabled && setActivePlatform(p.id)}
                  className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl transition-all duration-300 border-2 ${
                    isActive 
                      ? 'bg-white border-indigo-600 text-slate-900 shadow-xl shadow-indigo-100 scale-[1.02] z-10' 
                      : isEnabled 
                        ? 'bg-white/50 border-transparent text-slate-400 hover:bg-white hover:text-slate-600 hover:border-slate-200' 
                        : 'bg-transparent border-transparent text-slate-300 cursor-not-allowed opacity-40'
                  }`}
                >
                  <img 
                    src={p.icon} 
                    alt={p.label} 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'grayscale-0 scale-110' : isEnabled ? 'grayscale-[0.4] hover:grayscale-0' : 'grayscale'
                    }`} 
                  />
                  <span className={`text-sm font-black transition-colors ${isActive ? 'text-slate-900' : 'text-inherit'}`}>{p.label}</span>
                </button>
                {!isEnabled && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/tab:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 whitespace-nowrap">
                    Coming Soon
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {isFetching ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }} />
              <span className="text-xl font-black text-slate-900">{countdown}s</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-sm font-black text-slate-900">Fetching assets from {platforms.find(p => p.id === activePlatform)?.label}...</h3>
              <p className="text-[11px] font-bold text-slate-400">Please wait while we synchronize your advertising accounts</p>
            </div>
          </div>
        ) : !isAuthorized ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-50 transition-all shadow-sm"
            >
              <Link2 size={16} />
              Connect Ad Platform
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* User Profile Info */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                  <span className="text-2xl font-bold text-slate-300">FL</span>
                </div>
                <div>
                  <p className="text-base font-black text-slate-900">Ferad Lee</p>
                  <p className="text-xs font-medium text-slate-400">439596235886019</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDisconnectConfirm(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-rose-500 rounded-2xl font-bold text-xs hover:bg-rose-50 hover:border-rose-100 transition-all"
              >
                <Link2Off size={14} />
                Disconnect
              </button>
            </div>

            <div className="relative p-6 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-[24px] rounded-l-lg space-y-3">
              <p className="text-sm font-bold text-blue-900">Select Ad Account Range and Sort</p>
              <ul className="space-y-2">
                <li className="flex gap-2 text-xs font-medium text-blue-700/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  AdsGo AI will use the data of active campaigns in your connected account to assist AI optimization to maximize your ROAS.
                </li>
                <li className="flex gap-2 text-xs font-medium text-blue-700/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  The priority of the advertising accounts used when publishing the campaigns automatically created by AdsGo AI
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between px-1">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-bold text-xs hover:bg-indigo-50 transition-all shadow-sm"
              >
                <Plus size={14} strokeWidth={3} />
                Add Ad Account
              </button>
              <p className="text-xs font-bold text-slate-400">Selected: {accounts.length}</p>
            </div>

            <div className="border border-slate-100 rounded-[24px] overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400">Ad Accounts</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {accounts.map((acc, index) => (
                    <tr 
                      key={acc.id} 
                      draggable 
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group hover:bg-slate-50/50 transition-all cursor-move ${draggedItemIndex === index ? 'opacity-40 bg-indigo-50' : ''}`}
                    >
                      <td className="px-6 py-5 flex items-center justify-between group/row">
                        <div className="flex items-center gap-4">
                          <div className="p-2 text-slate-200 group-hover:text-slate-400 transition-colors">
                            <GripVertical size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{acc.id}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveAccount(acc.id)}
                          className="p-2 text-slate-200 hover:text-rose-500 transition-all opacity-0 group-hover/row:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-black text-slate-900">{acc.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Account Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center p-6"
            style={{ zIndex: zIndexAddModal }}
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-100">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Add Ad Account</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                    placeholder="Fuzzy search account name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  <span className="text-sm font-bold text-slate-500 px-1">Available accounts</span>
                  {filteredPool.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => handleAddAccount(acc)}
                      className="w-full text-left p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all flex items-center justify-between group"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{acc.name}</span>
                        <span className="text-xs font-medium text-slate-400">{acc.id}</span>
                      </div>
                      <Plus size={18} className="text-slate-200 group-hover:text-indigo-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disconnect Confirm Modal */}
        {showDisconnectConfirm && (
          <div 
            className="fixed inset-0 flex items-center justify-center p-6"
            style={{ zIndex: zIndexDisconnectModal }}
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDisconnectConfirm(false)} />
            <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <AlertTriangle size={40} strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Disconnection</h3>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    AdsGo will no longer be able to provide ads management and optimization services for these accounts. Are you sure you want to disconnect?
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    className="py-4 bg-rose-500 text-white rounded-2xl font-black text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetSection
