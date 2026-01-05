import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'

const BudgetEditModal = ({ isOpen, onClose, campaign, onSave, onUpdateBudgetStatus }) => {
  const [modificationReason, setModificationReason] = useState('')
  
  if (!isOpen || !campaign) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let newBudget = null
    let suggestedBudget = null
    let budgetData = null
    let mode = ''

    if (campaign.budgetLevel === 'campaign') {
      // 预算在 campaign 层：编辑单个 campaign 预算
      const formData = new FormData(e.target)
      newBudget = parseFloat(formData.get('budget'))
      suggestedBudget = campaign.suggestedBudget
      mode = 'campaign'
      
      onSave(campaign.id, newBudget, 'campaign')
      
      // 检查是否与建议预算不一致
      if (newBudget !== suggestedBudget) {
        // 更新状态为 invalid_modified
        if (onUpdateBudgetStatus) {
          onUpdateBudgetStatus(campaign.id, 'invalid_modified')
        }
      }
    } else if (campaign.adsets) {
      // 预算在 adset 层：需要判断是编辑 campaign 还是编辑单个 adset
      const formData = new FormData(e.target)
      
      // 检查是否是单个 adset 编辑（通过检查是否有 budget-${adset.id} 的输入）
      const adsetIds = campaign.adsets.map(a => a.id)
      const singleAdsetEdit = adsetIds.some(id => formData.get(`budget-${id}`) && !formData.get(`budget-all-${id}`))
      
      if (singleAdsetEdit) {
        // 编辑单个 adset
        const adsetBudgets = campaign.adsets.map(adset => {
          const newBudget = parseFloat(formData.get(`budget-${adset.id}`))
          return { id: adset.id, newBudget }
        })
        mode = 'single-adset'
        
        onSave(campaign.id, adsetBudgets, 'single-adset')
        
        // 检查是否与建议预算不一致
        campaign.adsets.forEach(adset => {
          const newBudget = parseFloat(formData.get(`budget-${adset.id}`))
          if (newBudget !== adset.suggestedBudget) {
            // 更新状态为 invalid_modified
            if (onUpdateBudgetStatus) {
              onUpdateBudgetStatus(adset.id, 'invalid_modified')
            }
          }
        })
      } else {
        // 编辑 campaign 下所有 adsets
        const adsetBudgets = campaign.adsets.map(adset => ({
          id: adset.id,
          newBudget: parseFloat(formData.get(`budget-all-${adset.id}`))
        }))
        mode = 'all-adsets'
        
        onSave(campaign.id, adsetBudgets, 'all-adsets')
        
        // 检查是否与建议预算不一致
        campaign.adsets.forEach(adset => {
          const newBudget = parseFloat(formData.get(`budget-all-${adset.id}`))
          if (newBudget !== adset.suggestedBudget) {
            // 更新状态为 invalid_modified
            if (onUpdateBudgetStatus) {
              onUpdateBudgetStatus(adset.id, 'invalid_modified')
            }
          }
        })
      }
    }
    
    setModificationReason('')
    onClose()
  }

  const formatCurrency = (value) => {
    return `¥${value.toFixed(2)}`
  }

  // 判断编辑模式
  const getEditMode = () => {
    if (campaign.budgetLevel === 'campaign') {
      return 'campaign'
    }
    // 对于 adset 层级，通过传入的 campaign 对象判断是编辑 campaign 还是单个 adset
    // 如果 campaign 对象是单个 adset，则编辑单个 adset
    if (campaign.isAdset) {
      return 'single-adset'
    }
    return 'all-adsets'
  }

  const currentEditMode = getEditMode()

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
              {currentEditMode === 'campaign' ? 'Edit Campaign Budget' : 
               currentEditMode === 'single-adset' ? 'Edit Adset Budget' : 
               'Edit Adset Budgets'}
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
                {currentEditMode === 'campaign' || currentEditMode === 'all-adsets' ? 'Campaign' : 'Adset'}
              </label>
              <p className="text-gray-900 font-medium">{campaign.campaign || campaign.name}</p>
            </div>

            {currentEditMode === 'campaign' ? (
              // 预算在 campaign 层：编辑单个 campaign 预算
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Daily Budget
                  </label>
                  <p className="text-gray-900 font-medium">{formatCurrency(campaign.dailyBudget)}</p>
                </div>

                <div className="mb-6">
                  <div className="flex gap-3 items-start">
                    <div className="w-[140px]">
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        New Daily Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          id="budget"
                          name="budget"
                          defaultValue={campaign.suggestedBudget || campaign.dailyBudget}
                          step="0.01"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex-1">
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
                  {campaign.suggestedBudget && campaign.suggestedBudget !== campaign.dailyBudget && (
                    <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-semibold text-primary">
                        Recommended budget: {formatCurrency(campaign.suggestedBudget)} /day
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : currentEditMode === 'single-adset' ? (
              // 编辑单个 adset 预算
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Daily Budget
                  </label>
                  <p className="text-gray-900 font-medium">{formatCurrency(campaign.dailyBudget)}</p>
                </div>

                <div className="mb-6">
                  <div className="flex gap-3 items-start">
                    <div className="w-[140px]">
                      <label htmlFor={`budget-${campaign.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                        New Daily Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          id={`budget-${campaign.id}`}
                          name={`budget-${campaign.id}`}
                          defaultValue={campaign.suggestedBudget || campaign.dailyBudget}
                          step="0.01"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex-1">
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
                  {campaign.suggestedBudget && campaign.suggestedBudget !== campaign.dailyBudget && (
                    <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-semibold text-primary">
                        Recommended budget: {formatCurrency(campaign.suggestedBudget)} /day
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 编辑 campaign 下所有 adsets 的预算
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Total Daily Budget
                  </label>
                  <p className="text-gray-900 font-medium">{formatCurrency(campaign.dailyBudget)}</p>
                </div>

                <div className="space-y-4 mb-6">
                  {campaign.adsets.map((adset, index) => (
                    <div key={adset.id} className="p-4 bg-gray-50 rounded-lg border border-border">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {adset.name}
                        </label>
                        <p className="text-xs text-gray-500">Current: {formatCurrency(adset.dailyBudget)}</p>
                      </div>

                      <div className="mb-3">
                        <div className="flex gap-3 items-start">
                          <div className="w-[140px]">
                            <label htmlFor={`budget-all-${adset.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                              New Daily Budget
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="number"
                                id={`budget-all-${adset.id}`}
                                name={`budget-all-${adset.id}`}
                                defaultValue={adset.suggestedBudget || adset.dailyBudget}
                                step="0.01"
                                min="0"
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label htmlFor={`reason-${adset.id}`} className="block text-xs text-gray-600 mb-2">
                              Reason for manual modification (optional)
                            </label>
                            <textarea
                              id={`reason-${adset.id}`}
                              placeholder="Enter reason..."
                              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs min-h-[60px] resize-y"
                            />
                          </div>
                        </div>
                      </div>

                      {adset.suggestedBudget && adset.suggestedBudget !== adset.dailyBudget && (
                        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-xs font-semibold text-primary">
                            Recommended budget: {formatCurrency(adset.suggestedBudget)} /day
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
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
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
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
