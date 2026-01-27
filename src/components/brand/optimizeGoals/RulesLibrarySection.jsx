import { useState } from 'react'
import { ListChecks, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react'

const RulesLibrarySection = ({ formData, updateFormData }) => {
  const [newRule, setNewRule] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editValue, setEditValue] = useState('')

  const ruleExamples = [
    'Pause when ROAS < 2.0',
    'Increase budget when CPA < $10',
    'Flag if CTR < 1%'
  ]

  const MAX_RULES = 10
  const MAX_CHARACTERS = 100

  const handleAddRule = () => {
    if (newRule.trim() && formData.optimizePreferences.length < MAX_RULES) {
      updateFormData('optimizePreferences', [...formData.optimizePreferences, newRule.trim()])
      setNewRule('')
    }
  }

  const handleDeleteRule = (index) => {
    updateFormData('optimizePreferences', formData.optimizePreferences.filter((_, i) => i !== index))
  }

  const handleStartEdit = (index, value) => {
    setEditingIndex(index)
    setEditValue(value)
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...formData.optimizePreferences]
      updated[editingIndex] = editValue.trim() || updated[editingIndex]
      updateFormData('optimizePreferences', updated)
      setEditingIndex(null)
    }
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <ListChecks size={20} className="text-rose-600" />
          <h2 className="text-sm font-black text-slate-900">Rules Library(Optimize Preferences)</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400">Limit: {MAX_RULES} rules</span>
          {formData.optimizePreferences.length > 0 && (
            <div className="text-emerald-500 animate-in zoom-in duration-500">
              <CheckCircle2 size={24} />
            </div>
          )}
        </div>
      </header>

      <div className="p-10 space-y-10">
        {/* Rule Examples - Read Only */}
        <div className="space-y-4">
          <span className="text-sm font-bold text-slate-500 px-1">Rule examples</span>
          <div className="flex flex-wrap gap-2">
            {ruleExamples.map((example, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 text-xs font-bold flex items-center gap-2 cursor-default select-none shadow-inner"
              >
                <Sparkles size={12} className="opacity-50" />
                {example}
              </div>
            ))}
          </div>
        </div>

        {/* Add Rule Input */}
        <div className="space-y-4">
          <span className="text-sm font-bold text-slate-500 px-1">Custom rule</span>
          <div className="relative group">
            <textarea
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add your optimization logic..."
              disabled={formData.optimizePreferences.length >= MAX_RULES}
              rows={2}
              className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-500 focus:bg-white transition-all shadow-inner resize-none`}
              maxLength={MAX_CHARACTERS}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300">{newRule.length}/{MAX_CHARACTERS}</span>
              <button
                onClick={handleAddRule}
                disabled={!newRule.trim() || formData.optimizePreferences.length >= MAX_RULES}
                className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-black transition-all disabled:opacity-20 shadow-lg"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Rules Stack with Inline Editing */}
        <div className="space-y-3">
          {formData.optimizePreferences.map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-500 transition-all shadow-sm">
              <div className="flex-1 flex items-center gap-4 overflow-hidden">
                <span className="text-[10px] font-black text-slate-200 shrink-0">#{(index + 1).toString().padStart(2, '0')}</span>
                
                {editingIndex === index ? (
                  <input 
                    className="flex-1 bg-slate-50 border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                    maxLength={MAX_CHARACTERS}
                  />
                ) : (
                  <p 
                    className="text-sm font-bold text-slate-900 cursor-text flex-1 truncate py-1"
                    onClick={() => handleStartEdit(index, rule)}
                  >
                    {rule}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => handleDeleteRule(index)} 
                className="p-1.5 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {formData.optimizePreferences.length === 0 && (
            <div className="p-10 text-center text-slate-300 text-xs italic font-bold">No custom rules added yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RulesLibrarySection
