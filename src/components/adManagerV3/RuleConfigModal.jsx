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
      <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-300">
        {/* Header - More premium feel */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
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
        <div className="p-8 overflow-y-auto flex-grow space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Example Rules - Refined Card Style */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lightbulb size={80} className="text-blue-600" />
            </div>
            
            <h3 className="text-xs font-black text-blue-600 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb size={14} />
              Best Practice Templates
            </h3>
            
            <div className="grid gap-3 relative z-10">
              <div className="flex items-start gap-4 bg-white/60 hover:bg-white transition-colors rounded-xl p-4 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">1</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 underline underline-offset-4 decoration-blue-200">ROAS {'<'} 1.5</span> in the last 3 days, reduce <span className="font-bold text-blue-600">adset/campaign budget by 50%</span>
                </p>
              </div>
              
              <div className="flex items-start gap-4 bg-white/60 hover:bg-white transition-colors rounded-xl p-4 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">2</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 underline underline-offset-4 decoration-blue-200">$100 spent</span> without any <span className="font-bold text-slate-900 italic">add to cart</span>, <span className="font-bold text-rose-600">directly close</span> the adset/campaign
                </p>
              </div>
              
              <div className="flex items-start gap-4 bg-white/60 hover:bg-white transition-colors rounded-xl p-4 border border-blue-100 shadow-sm group/item">
                <div className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm font-black border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">3</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 underline underline-offset-4 decoration-blue-200">CPL {'<'} $5.2</span> today & yesterday CPL is <span className="font-bold text-slate-900 italic">below average</span>, increase budget by <span className="font-bold text-emerald-600">+20% or +$10</span>
                </p>
              </div>
            </div>
          </div>

          {/* Your Rules Section */}
          <div className="space-y-4">
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
              <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 group hover:border-blue-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Info size={24} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider">No custom rules yet</p>
                <p className="text-[10px] mt-1 italic opacity-60">Add your first optimization logic below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editingRules.map((rule, index) => (
                  <div key={index} className="group relative flex items-center gap-3 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 rounded-2xl p-4 transition-all animate-in slide-in-from-left-2 duration-300">
                    <div className="shrink-0 text-slate-300 group-hover:text-blue-300 transition-colors cursor-grab">
                      <div className="grid grid-cols-2 gap-0.5">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(index, e.target.value)}
                        className={`w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-slate-700 placeholder:text-slate-300 pr-16 ${
                          rule.length > MAX_RULE_LENGTH ? 'text-rose-600' : ''
                        }`}
                      />
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-opacity ${rule.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className={`text-[10px] font-black tracking-tighter ${
                          rule.length > MAX_RULE_LENGTH ? 'text-rose-500' : 'text-slate-300'
                        }`}>
                          {rule.length}/{MAX_RULE_LENGTH}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRule(index)}
                      className="shrink-0 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                      title="Delete rule"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Rule Section */}
          <div className="pt-6 border-t border-slate-50">
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <p className="text-[11px] text-rose-600 font-bold">{errorMessage}</p>
              </div>
            )}
            
            <div className={`relative flex items-center gap-3 bg-slate-50 border transition-all duration-300 p-2 pl-5 rounded-2xl ${
              editingRules.length >= MAX_RULES 
                ? 'opacity-50 grayscale' 
                : 'hover:bg-white hover:shadow-lg hover:shadow-slate-100 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-50 focus-within:border-blue-200 border-transparent'
            }`}>
              <Plus size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                placeholder={editingRules.length >= MAX_RULES ? "Capacity reached" : "Enter new optimization logic..."}
                disabled={editingRules.length >= MAX_RULES}
                className="flex-grow bg-transparent border-none p-2 focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium disabled:cursor-not-allowed"
              />
              <div className="flex items-center gap-3 pr-2">
                {newRule.length > 0 && (
                  <span className={`text-[10px] font-black tabular-nums ${
                    newRule.length > MAX_RULE_LENGTH ? 'text-rose-500' : 'text-slate-300'
                  }`}>
                    {newRule.length}/{MAX_RULE_LENGTH}
                  </span>
                )}
                <button
                  onClick={handleAddRule}
                  disabled={editingRules.length >= MAX_RULES || !newRule.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg ${
                    editingRules.length >= MAX_RULES || !newRule.trim()
                      ? 'bg-slate-200 text-slate-400 shadow-none'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Visual Capacity Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                <span>Usage Efficiency</span>
                <span className={editingRules.length >= MAX_RULES ? 'text-rose-500' : 'text-blue-600'}>
                  {editingRules.length} / {MAX_RULES} RULES
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5">
                {[...Array(MAX_RULES)].map((_, i) => (
                  <div 
                    key={i}
                    className={`flex-1 mx-0.5 rounded-full transition-all duration-500 ${
                      i < editingRules.length 
                        ? (editingRules.length >= MAX_RULES ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]')
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 bg-white shrink-0">
          <button
            onClick={handleSave}
            className="group relative w-full overflow-hidden py-4 rounded-2xl font-black text-sm text-white bg-slate-900 hover:bg-black transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0"
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
