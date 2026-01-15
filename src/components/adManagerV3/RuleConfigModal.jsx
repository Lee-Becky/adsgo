import { useState } from 'react'
import { X, Minus, Plus, Lightbulb, ShieldCheck, AlertCircle, Info } from 'lucide-react'

const RuleConfigModal = ({ isOpen, onClose, onSave }) => {
  const MAX_RULES = 10
  const MAX_RULE_LENGTH = 100
  
  const [rules, setRules] = useState([])
  const [newRule, setNewRule] = useState('')
  const [editingRules, setEditingRules] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddRule = () => {
    setErrorMessage('')
    
    // Check if maximum rules reached
    if (editingRules.length >= MAX_RULES) {
      setErrorMessage(`Maximum ${MAX_RULES} rules allowed`)
      return
    }
    
    // Check if rule is empty
    if (!newRule.trim()) {
      setErrorMessage('Please enter a rule')
      return
    }
    
    // Check rule length
    if (newRule.trim().length > MAX_RULE_LENGTH) {
      setErrorMessage(`Rule must be ${MAX_RULE_LENGTH} characters or less`)
      return
    }
    
    const updatedRules = [...editingRules, newRule.trim()]
    setEditingRules(updatedRules)
    setNewRule('')
  }

  const handleDeleteRule = (index) => {
    const updatedRules = editingRules.filter((_, i) => i !== index)
    setEditingRules(updatedRules)
    setErrorMessage('')
  }

  const handleUpdateRule = (index, value) => {
    // Check rule length
    if (value.length > MAX_RULE_LENGTH) {
      setErrorMessage(`Rule must be ${MAX_RULE_LENGTH} characters or less`)
      return
    }
    
    const updatedRules = [...editingRules]
    updatedRules[index] = value
    setEditingRules(updatedRules)
    setErrorMessage('')
  }

  const handleSave = () => {
    let finalRules = [...editingRules]
    if (newRule.trim()) {
      finalRules = [...finalRules, newRule.trim()]
    }
    
    setRules(finalRules)
    setNewRule('')
    if (onSave) {
      onSave(finalRules)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal with refined styling */}
      <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-300">
        {/* Header - More premium feel */}
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between shrink-0 bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
                Rule Library
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Optimization Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-grow space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Example Rules - Refined Card Style - More Compact */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lightbulb size={60} className="text-blue-600" />
            </div>
            
            <h3 className="text-[10px] font-black text-blue-600 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Lightbulb size={12} />
              Optimization Templates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 relative z-10">
              <div className="flex flex-col gap-2 bg-white/60 hover:bg-white transition-colors rounded-xl p-3 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">1</div>
                <p className="text-[10px] text-slate-600 leading-tight font-medium">
                  <span className="font-bold text-slate-900">ROAS {'<'} 1.5</span> (3d), reduce <span className="font-bold text-blue-600">budget by 50%</span>
                </p>
              </div>
              
              <div className="flex flex-col gap-2 bg-white/60 hover:bg-white transition-colors rounded-xl p-3 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">2</div>
                <p className="text-[10px] text-slate-600 leading-tight font-medium">
                  <span className="font-bold text-slate-900">$100 spent</span> no <span className="font-bold text-slate-900 italic">ATC</span>, <span className="font-bold text-rose-600">close</span> campaign
                </p>
              </div>
              
              <div className="flex flex-col gap-2 bg-white/60 hover:bg-white transition-colors rounded-xl p-3 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">3</div>
                <p className="text-[10px] text-slate-600 leading-tight font-medium">
                  <span className="font-bold text-slate-900">CPL {'<'} $5.2</span> & low avg, increase <span className="font-bold text-emerald-600">+$10</span>
                </p>
              </div>
            </div>
          </div>

          {/* Your Rules Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Rules</h3>
                <div className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-500">
                  {editingRules.length} / {MAX_RULES}
                </div>
              </div>
              {editingRules.length > 0 && (
                <span className="text-[10px] font-bold text-slate-400 italic">Drag to reorder rules (coming soon)</span>
              )}
            </div>

            {editingRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 group hover:border-blue-100 transition-colors">
                <Info size={20} className="text-slate-300 group-hover:text-blue-400 transition-colors mb-2" />
                <p className="text-[10px] font-black uppercase tracking-wider">No custom rules yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {editingRules.map((rule, index) => (
                  <div key={index} className="group relative flex items-center gap-3 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm rounded-xl p-3 transition-all animate-in slide-in-from-left-2 duration-300">
                    <div className="shrink-0 text-slate-300 group-hover:text-blue-300 transition-colors cursor-grab">
                      <div className="grid grid-cols-2 gap-0.5">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-0.5 h-0.5 rounded-full bg-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(index, e.target.value)}
                        className={`w-full bg-transparent border-none p-0 focus:ring-0 text-[13px] font-semibold text-slate-700 placeholder:text-slate-300 pr-16 ${
                          rule.length > MAX_RULE_LENGTH ? 'text-rose-600' : ''
                        }`}
                      />
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-opacity ${rule.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className={`text-[9px] font-black tracking-tighter ${
                          rule.length > MAX_RULE_LENGTH ? 'text-rose-500' : 'text-slate-300'
                        }`}>
                          {rule.length}/{MAX_RULE_LENGTH}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRule(index)}
                      className="shrink-0 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                      title="Delete rule"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Rule Section - Compact */}
          <div className="pt-4 border-t border-slate-50">
            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <p className="text-[10px] text-rose-600 font-bold">{errorMessage}</p>
              </div>
            )}
            
            <div className={`relative flex items-center gap-2 bg-slate-50 border transition-all duration-300 p-1.5 pl-4 rounded-xl ${
              editingRules.length >= MAX_RULES 
                ? 'opacity-50 grayscale' 
                : 'hover:bg-white hover:shadow-md focus-within:bg-white focus-within:shadow-md focus-within:border-blue-200 border-transparent'
            }`}>
              <Plus size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                placeholder={editingRules.length >= MAX_RULES ? "Capacity reached" : "Add optimization logic..."}
                disabled={editingRules.length >= MAX_RULES}
                className="flex-grow bg-transparent border-none p-1.5 focus:ring-0 text-[13px] font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium disabled:cursor-not-allowed"
              />
              <div className="flex items-center gap-2 pr-1">
                {newRule.length > 0 && (
                  <span className={`text-[9px] font-black tabular-nums ${
                    newRule.length > MAX_RULE_LENGTH ? 'text-rose-500' : 'text-slate-300'
                  }`}>
                    {newRule.length}/{MAX_RULE_LENGTH}
                  </span>
                )}
                <button
                  onClick={handleAddRule}
                  disabled={editingRules.length >= MAX_RULES || !newRule.trim()}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95 shadow-sm ${
                    editingRules.length >= MAX_RULES || !newRule.trim()
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Visual Capacity Bar - Thinner */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">
                <span>Usage Efficiency</span>
                <span className={editingRules.length >= MAX_RULES ? 'text-rose-500' : 'text-blue-600'}>
                  {editingRules.length} / {MAX_RULES}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
                {[...Array(MAX_RULES)].map((_, i) => (
                  <div 
                    key={i}
                    className={`flex-1 mx-0.5 rounded-full transition-all duration-500 ${
                      i < editingRules.length 
                        ? (editingRules.length >= MAX_RULES ? 'bg-rose-500' : 'bg-blue-600')
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="px-6 py-4 border-t border-slate-50 bg-white shrink-0">
          <button
            onClick={handleSave}
            className="group relative w-full overflow-hidden py-3 rounded-xl font-black text-xs text-white bg-slate-900 hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 tracking-widest uppercase">Save Changes</span>
          </button>
          <p className="text-center mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-tight">Changes will take effect immediately upon saving</p>
        </div>
      </div>
    </div>
  )
}

export default RuleConfigModal
