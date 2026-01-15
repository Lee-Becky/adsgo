import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'

const BudgetEditModal = ({ isOpen, onClose, campaign, onSave, onUpdateBudgetStatus }) => {
  const [modificationReason, setModificationReason] = useState('')
  
  if (!isOpen || !campaign) return null

  // 判断编辑模式
  const getEditMode = () => {
    if (campaign.budgetLevel === 'campaign') {
      return 'campaign'
    }
    // 对于 adset 层级，只支持编辑单个 adset
    if (campaign.isAdset) {
      return 'single-adset'
    }
    // 不再支持 all-adsets 模式，默认返回 single-adset
    return 'single-adset'
  }

  const currentEditMode = getEditMode()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    
    if (currentEditMode === 'campaign') {
      // 预算在 campaign 层：编辑单个 campaign 预算
      const newBudget = parseFloat(formData.get('budget'))
      const suggestedBudget = campaign.suggestedBudget
      
      onSave(campaign.id, newBudget, 'campaign')
      
      // 检查是否与建议预算不一致
      if (newBudget !== suggestedBudget) {
        // 更新状态为 invalid_modified
        if (onUpdateBudgetStatus) {
          onUpdateBudgetStatus(campaign.id, 'invalid_modified')
        }
      }
    } else {
      // 编辑单个 adset 预算
      const newBudget = parseFloat(formData.get(`budget-${campaign.id}`))
      const suggestedBudget = campaign.suggestedBudget
      
      onSave(campaign.id, newBudget, 'single-adset')
      
      // 检查是否与建议预算不一致
      if (newBudget !== suggestedBudget) {
        // 更新状态为 invalid_modified
        if (onUpdateBudgetStatus) {
          onUpdateBudgetStatus(campaign.id, 'invalid_modified')
        }
      }
    }
    
    setModificationReason('')
    onClose()
  }

  const formatCurrency = (value) => {
    return `¥${value.toFixed(2)}`
  }

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-gray-900">
              {currentEditMode === 'campaign' ? 'Edit Campaign Budget' : 'Edit Adset Budget'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentEditMode === 'campaign' ? 'Campaign' : 'Adset'}
              </label>
              <p className="text-gray-400 font-medium">{campaign.campaign || campaign.name}</p>
            </div>

            {currentEditMode === 'campaign' ? (
              // 预算在 campaign 层：编辑单个 campaign 预算
              <>
                <div className="mb-6">
                  <div className="mb-6">
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        defaultValue={campaign.dailyBudget}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        required
                      />
                    </div>
                    {campaign.suggestedBudget && campaign.suggestedBudget !== campaign.dailyBudget && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-indigo-600">
                          Recommended budget: {formatCurrency(campaign.suggestedBudget)} /day
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-xs text-gray-600 mb-2">
                      Reason for manual modification (optional)
                    </label>
                    <textarea
                      id="reason"
                      value={modificationReason}
                      onChange={(e) => setModificationReason(e.target.value)}
                      placeholder="Enter reason..."
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs min-h-[60px] resize-y"
                    />
                  </div>
                </div>
              </>
            ) : (
              // 编辑单个 adset 预算
              <>
                <div className="mb-6">
                  <div className="mb-6">
                    <label htmlFor={`budget-${campaign.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        id={`budget-${campaign.id}`}
                        name={`budget-${campaign.id}`}
                        defaultValue={campaign.dailyBudget}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        required
                      />
                    </div>
                    {campaign.suggestedBudget && campaign.suggestedBudget !== campaign.dailyBudget && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-indigo-600">
                          Recommended budget: {formatCurrency(campaign.suggestedBudget)} /day
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-xs text-gray-600 mb-2">
                      Reason for manual modification (optional)
                    </label>
                    <textarea
                      id="reason"
                      value={modificationReason}
                      onChange={(e) => setModificationReason(e.target.value)}
                      placeholder="Enter reason..."
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs min-h-[60px] resize-y"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}

export default BudgetEditModal
