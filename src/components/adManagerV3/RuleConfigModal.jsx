import { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'

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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Configure Optimization Rules
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Example Rules - Always displayed as requested */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Example Rules
            </h3>
            <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-md p-3 border border-blue-200">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-700">ROAS {'<'} 1.5</span> in the last 3 days, reduce <span className="font-semibold text-blue-700">adset/campaign budget by 50%</span>
            </p>
          </div>
              <div className="flex items-start gap-3 bg-white rounded-md p-3 border border-blue-200">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-blue-700">$100 spent</span> without any <span className="font-semibold text-blue-700">add to cart</span>, <span className="font-semibold text-red-600">directly close</span> the adset/campaign
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-md p-3 border border-blue-200">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-blue-700">Cost Per Leads {'<'} $5.2</span> today AND yesterday's Cost Per Leads is <span className="font-semibold text-blue-700">below average</span>, increase budget by <span className="font-semibold text-green-600">+20% or +$10</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Your Rules</h3>
              <span className="text-xs text-slate-500 font-medium">
                {editingRules.length}/{MAX_RULES}
              </span>
            </div>
            {editingRules.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-gray-400 text-xs">
                No rules configured yet.
              </div>
            ) : (
              <div className="space-y-3">
                {editingRules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(index, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-sm pr-16 ${
                          rule.length > MAX_RULE_LENGTH 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-border focus:border-blue-600'
                        }`}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
                        rule.length > MAX_RULE_LENGTH ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {rule.length}/{MAX_RULE_LENGTH}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete rule"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Rule */}
          <div className="mt-4 pt-4 border-t border-border">
            {errorMessage && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                  placeholder="Add new optimization rule..."
                  disabled={editingRules.length >= MAX_RULES}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm pr-16 ${
                    editingRules.length >= MAX_RULES
                      ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
                      : newRule.length > MAX_RULE_LENGTH
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-600/20'
                      : 'border-border focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
                  newRule.length > MAX_RULE_LENGTH ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {newRule.length}/{MAX_RULE_LENGTH}
                </span>
              </div>
              <button
                onClick={handleAddRule}
                disabled={editingRules.length >= MAX_RULES || !newRule.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  editingRules.length >= MAX_RULES || !newRule.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Add rule"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    editingRules.length >= MAX_RULES 
                      ? 'bg-red-500' 
                      : editingRules.length >= MAX_RULES * 0.8
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${(editingRules.length / MAX_RULES) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {editingRules.length >= MAX_RULES 
                  ? 'Limit reached' 
                  : `${MAX_RULES - editingRules.length} remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-gray-50">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default RuleConfigModal
