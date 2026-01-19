import { useState, useRef, useEffect } from 'react'
import { X, DollarSign, Sparkles, Info } from 'lucide-react'

const BudgetEditModal = ({ isOpen, onClose, campaign, onSave, onUpdateBudgetStatus }) => {
  const [budget, setBudget] = useState(0)
  const [modificationReason, setModificationReason] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  useEffect(() => {
    if (campaign) {
      setBudget(campaign.dailyBudget || 0)
    }
  }, [campaign])

  if (!isOpen || !campaign) return null

  const getEditMode = () => {
    if (campaign.budgetLevel === 'campaign') return 'campaign'
    return 'single-adset'
  }

  const currentEditMode = getEditMode()

  // Check if platform is NOT Meta (hide AI recommendations and reason for non-Meta platforms)
  const isNonMetaPlatform = campaign.platform !== 'Meta' && (campaign.parentCampaign?.platform !== 'Meta')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBudget = parseFloat(budget)
    const suggestedBudget = campaign.suggestedBudget
    
    onSave(campaign.id, newBudget, currentEditMode)
    
    if (newBudget !== suggestedBudget && onUpdateBudgetStatus) {
      onUpdateBudgetStatus(campaign.id, 'invalid_modified')
    }
    
    setModificationReason('')
    onClose()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(value)
  }

  const applyRecommendation = () => {
    if (campaign.suggestedBudget) {
      setBudget(campaign.suggestedBudget)
    }
  }

  const budgetDiff = budget - campaign.dailyBudget

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dim Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                {currentEditMode === 'campaign' ? 'Campaign Budget' : 'Ad Set Budget'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 line-clamp-1">
              {campaign.campaign || campaign.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Budget Input Area */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-600">Daily Budget</label>
              <span className="text-xs text-slate-400">Current: {formatCurrency(campaign.dailyBudget)}</span>
            </div>
            
            <div 
              className={`relative flex items-center transition-all duration-200 rounded-xl border-2 ${
                isFocused 
                ? 'border-indigo-500 bg-white ring-4 ring-indigo-50' 
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="pl-4 pr-2 text-slate-400">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                step="0.01"
                min="0"
                className="w-full bg-transparent py-4 text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                placeholder="0.00"
                required
                autoFocus
              />
              {budgetDiff !== 0 && (
                <div className={`absolute right-4 px-2 py-1 rounded text-[10px] font-bold ${budgetDiff > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {budgetDiff > 0 ? '+' : ''}{formatCurrency(budgetDiff)}
                </div>
              )}
            </div>

            {/* AI Recommendation - Subtle Version - Hide for non-Meta platforms */}
            {campaign.suggestedBudget && !isNonMetaPlatform && (
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Sparkles size={12} className="text-indigo-400" />
                  <span className="text-xs">Recommended: <span className="font-semibold text-slate-700">{formatCurrency(campaign.suggestedBudget)}</span></span>
                </div>
                <button
                  type="button"
                  onClick={applyRecommendation}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Apply AI Suggestion
                </button>
              </div>
            )}
          </div>

          {/* Reason Field - Simplified - Hide for non-Meta platforms */}
          {!isNonMetaPlatform && (
            <div className="mb-8">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <Info size={13} className="text-slate-400" />
                <label htmlFor="reason" className="text-xs font-medium text-slate-500">
                  Reason (Optional)
                </label>
              </div>
              <textarea
                id="reason"
                value={modificationReason}
                onChange={(e) => setModificationReason(e.target.value)}
                placeholder="Briefly state the reason for adjustment..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none min-h-[70px]"
              />
            </div>
          )}

          {/* Simplified Footer Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-sm font-semibold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetEditModal
