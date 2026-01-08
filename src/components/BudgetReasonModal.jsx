import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Minus, Info, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import FeedbackModal from './FeedbackModal'

const BudgetReasonModal = ({ isOpen, onClose, campaign, reason }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  
  if (!isOpen || !campaign || !reason) return null

  const status = campaign.status || 'pending'

  const getTypeIcon = (type) => {
    switch (type) {
      case 'increase':
        return <TrendingUp size={20} className="text-green-600" />
      case 'decrease':
        return <TrendingDown size={20} className="text-red-600" />
      case 'maintain':
        return <Minus size={20} className="text-yellow-600" />
      default:
        return <Info size={20} className="text-gray-600" />
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'increase':
        return 'Recommend Increase Budget'
      case 'decrease':
        return 'Recommend Decrease Budget'
      case 'maintain':
        return 'Recommend Maintain Current Budget'
      default:
        return 'Budget Analysis'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'bg-green-50 border-green-200'
      case 'decrease':
        return 'bg-red-50 border-red-200'
      case 'maintain':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleApprove = () => {
    if (campaign.handleApprove && typeof campaign.handleApprove === 'function') {
      campaign.handleApprove(campaign.id)
    }
    onClose()
  }

  const handleReject = () => {
    setFeedbackOpen(true)
  }

  const handleFeedbackConfirm = (feedback) => {
    // 直接更新状态，不调用 campaign.handleReject
    // 因为 campaign.handleReject 会再次触发 Feedback 弹窗
    if (campaign.id) {
      // 这里我们需要一个回调来更新 App.jsx 中的 budgetStatus
      // 但由于 BudgetReasonModal 没有直接访问这个回调，我们需要通过 campaign 对象传递
      if (campaign.onBudgetStatusChange) {
        campaign.onBudgetStatusChange(prev => ({ ...prev, [campaign.id]: 'rejected' }))
      }
    }
    setFeedbackOpen(false)
    onClose()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-bold">Approved</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span className="font-bold">Rejected</span>
          </div>
        )
      case 'invalid_modified':
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle size={20} />
            <span className="font-bold">Invalid (Modified)</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Right Drawer */}
        <div className="absolute right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl overflow-y-auto transform transition-transform">
          {/* Header */}
          <div className={`px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10 ${getTypeColor(reason.type)}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                {getTypeIcon(reason.type)}
              </div>
              <div>
          <h2 className="text-xl font-bold text-gray-900">Optimization Detail</h2>
          <p className="text-gray-600 text-sm mt-1">{campaign.campaign || campaign.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className={`p-6 ${status !== 'pending' ? 'opacity-50' : ''}`}>
            {/* Budget Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Daily Budget</p>
                  <p className="text-2xl font-bold text-gray-900">¥{campaign.dailyBudget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recommended Budget</p>
                  <p className="text-2xl font-bold text-primary">¥{campaign.suggestedBudget}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Last 7 Days Spend</p>
                  <p className="text-xl font-semibold text-gray-900">¥{campaign.spend}</p>
                </div>
              </div>
            </div>

            {/* Performance Comparison vs Industry Average */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                Performance vs Industry Average
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-gray-600 mb-1">ROI</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">{reason.metrics?.roi || '-'}</p>
                    <span className={`text-xs font-semibold ${parseFloat(reason.metrics?.roi || 0) > 3 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(reason.metrics?.roi || 0) > 3 ? '↑ Above' : '↓ Below'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Industry: 3.0</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-gray-600 mb-1">CTR</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">2.8%</p>
                    <span className="text-xs font-semibold text-green-600">↑ Above</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Industry: 2.0%</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-gray-600 mb-1">CVR</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">3.5%</p>
                    <span className="text-xs font-semibold text-green-600">↑ Above</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Industry: 2.5%</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-gray-600 mb-1">CPA</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">¥36.00</p>
                    <span className="text-xs font-semibold text-green-600">↓ Better</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Industry: ¥42.00</p>
                </div>
              </div>
            </div>

            {/* Weekly Trend Analysis */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-blue-600" />
                7-Day Trend Analysis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-border rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Spend Trend</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">¥{campaign.spend}</p>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {reason.metrics?.change || '+15%'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs Last Week</p>
                </div>
                <div className="bg-white border border-border rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Impressions</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">{(campaign.impressions / 1000).toFixed(0)}K</p>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      +12%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Growth Rate</p>
                </div>
                <div className="bg-white border border-border rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Conversions</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">{campaign.results}</p>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      +18%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Growth Rate</p>
                </div>
                <div className="bg-white border border-border rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">ROAS</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">{campaign.resultRoas}</p>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      +23%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Improvement</p>
                </div>
              </div>
            </div>

            {/* AI Reason */}
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-600" />
                AI Budget Adjustment Reason
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {reason.detailedReason || reason.reason}
              </p>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Supporting Data
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 ml-7">
                  {reason.reasons && reason.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {reason.type !== 'maintain' && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-600" />
                    Risk Warning
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2 ml-7">
                    {reason.type === 'increase' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Monitor conversion cost closely after increasing budget to ensure ROI remains stable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Recommend gradual increase, no more than 20% per adjustment</span>
                        </li>
                      </>
                    )}
                    {reason.type === 'decrease' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Reducing budget may affect exposure, balance effectiveness with reach</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Consider optimizing ad creatives and audience targeting before adjusting budget</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Reject/Approve Buttons */}
          <div className="px-6 py-4 border-t border-border bg-gray-50 sticky bottom-0">
            {status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
            {status !== 'pending' && (
              <div className="flex items-center justify-center">
                {getStatusBadge(status)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onConfirm={handleFeedbackConfirm}
        title="Feedback"
        buttonText="Confirm Reject"
      />
    </>
  )
}

export default BudgetReasonModal
