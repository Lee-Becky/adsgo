import { useState } from 'react'
import { X, Plus, Lightbulb, AlertCircle, Info, Trash2, Loader2 } from 'lucide-react'

// Mock LLM validation - simulates API call to classify rule text
const mockValidateRule = async (text) => {
  await new Promise(r => setTimeout(r, 1500))
  const hasTimeRange = /\d+\s*(day|week|hour|month|d\b)/i.test(text)
  const hasCondition = /(below|above|less|more|under|over|<|>|exceed|if\b)/i.test(text)
  const hasAction = /(reduce|increase|pause|stop|close|cut|boost|raise|double|half)/i.test(text)
  const hasObject = /(campaign|ad\s*set|budget|bid|spend|adset|ad\b)/i.test(text)
  return (hasTimeRange && hasCondition && hasAction && hasObject) ? 'Rule' : 'Preference'
}

const RuleConfigModal = ({ isOpen, onClose, onSave }) => {
  const MAX_RULES = 10
  const MAX_RULE_LENGTH = 100

  const [rules, setRules] = useState([])
  const [newRule, setNewRule] = useState('')
  // editingRules: [{ text: string, type: 'Rule' | 'Preference' | null }]
  const [editingRules, setEditingRules] = useState([
    {
      text: 'If ROAS is below 1.5 in the last 3 days, then reduce budget by 50% for the adset or campaign.',
      type: 'Rule'
    }
  ])
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddRule = async () => {
    setErrorMessage('')

    if (editingRules.length >= MAX_RULES) {
      setErrorMessage(`Maximum ${MAX_RULES} rules allowed`)
      return
    }
    if (!newRule.trim()) {
      setErrorMessage('Please enter a rule')
      return
    }
    if (newRule.trim().length > MAX_RULE_LENGTH) {
      setErrorMessage(`Rule must be ${MAX_RULE_LENGTH} characters or less`)
      return
    }

    const ruleText = newRule.trim()
    const newIndex = editingRules.length
    // Add with type=null (validating)
    setEditingRules(prev => [...prev, { text: ruleText, type: null }])
    setNewRule('')

    // Mock LLM validation
    const type = await mockValidateRule(ruleText)
    setEditingRules(prev =>
      prev.map((r, i) => i === newIndex ? { ...r, type } : r)
    )
  }

  const handleDeleteRule = (index) => {
    setEditingRules(prev => prev.filter((_, i) => i !== index))
    setErrorMessage('')
  }

  const handleSave = async () => {
    let finalRules = [...editingRules]
    if (newRule.trim() && newRule.trim().length <= MAX_RULE_LENGTH && finalRules.length < MAX_RULES) {
      const ruleText = newRule.trim()
      finalRules = [...finalRules, { text: ruleText, type: null }]
      setEditingRules(finalRules)
      setNewRule('')
      // Run LLM validation for the pending rule
      const type = await mockValidateRule(ruleText)
      finalRules = finalRules.map((r, i) => i === finalRules.length - 1 ? { ...r, type } : r)
      setEditingRules(finalRules)
    }
    setRules(finalRules)
    setNewRule('')
    if (onSave) onSave(finalRules)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      <div className="relative bg-white rounded-section shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Optimize Rules</h2>
            <Info size={16} className="text-gray-400" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-base text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-grow space-y-6">
          {/* Active Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Active Rules</h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                {editingRules.length}/{MAX_RULES}
              </span>
            </div>

            {editingRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-inner border border-dashed border-gray-200 text-gray-400">
                <Info size={20} className="text-gray-300 mb-2" />
                <p className="text-xs font-medium">No rules yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[280px] overflow-y-auto pl-3 pt-3 pr-1">
                {editingRules.map((rule, index) => (
                  <div key={index} className="relative bg-gray-50 border border-gray-100 rounded-inner p-4 pr-10 group transition-all duration-200 hover:border-gray-200 overflow-visible">
                    {/* Type tag — absolute top-left corner */}
                    {rule.type === null ? (
                      <span className="absolute -top-2 -left-2 flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
                        <Loader2 size={10} className="animate-spin text-gray-400" />
                        <span className="text-[9px] font-medium text-gray-400">Checking</span>
                      </span>
                    ) : rule.type === 'Rule' ? (
                      <span className="absolute -top-2.5 -left-2.5 px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-sm">Rule</span>
                    ) : (
                      <span className="absolute -top-2.5 -left-2.5 px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm">Preference</span>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteRule(index)}
                      className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-base transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                    <p className="text-sm text-gray-700 leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Rules */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-gray-900">Add Rules</h3>
              <Lightbulb size={14} className="text-amber-400" />
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-base flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className={`relative border rounded-inner transition-all duration-200 ${
              editingRules.length >= MAX_RULES
                ? 'opacity-50 border-gray-200'
                : 'border-gray-200 focus-within:border-primary-500 focus-within:shadow-primary-focus'
            }`}>
              <textarea
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddRule(); } }}
                placeholder={editingRules.length >= MAX_RULES ? 'Maximum rules reached' : 'Add new optimization rules that you want...'}
                disabled={editingRules.length >= MAX_RULES}
                rows={4}
                className="w-full bg-transparent border-none p-4 pr-12 pb-8 resize-none focus:ring-0 focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 disabled:cursor-not-allowed"
              />
              {/* + button */}
              <button
                onClick={handleAddRule}
                disabled={editingRules.length >= MAX_RULES || !newRule.trim()}
                className={`absolute top-3 right-3 w-8 h-8 rounded-base border flex items-center justify-center transition-all duration-200 ${
                  editingRules.length >= MAX_RULES || !newRule.trim()
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 active:scale-95'
                }`}
              >
                <Plus size={16} />
              </button>
              {/* Character count */}
              <div className="absolute bottom-2.5 right-3.5 text-[11px] text-gray-400 font-medium">
                {newRule.length}/{MAX_RULE_LENGTH}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-200 text-gray-700 rounded-base text-sm font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-base text-sm font-semibold transition-all duration-200 focus:shadow-primary-focus"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default RuleConfigModal
