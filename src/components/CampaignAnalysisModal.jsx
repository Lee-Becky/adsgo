import { X, TrendingUp, TrendingDown, Target, DollarSign, MousePointer, CheckCircle, AlertTriangle } from 'lucide-react'

const CampaignAnalysisModal = ({ isOpen, onClose, campaign }) => {
  if (!isOpen || !campaign) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary to-purple-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Campaign Analysis</h2>
            <p className="text-white/80 text-sm mt-1">{campaign.campaign}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-success-50 rounded-lg p-4 border border-success-200">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-success-600" />
                <span className="font-semibold text-neutral-700">ROI</span>
              </div>
              <p className="text-2xl font-bold text-success-600">{campaign.budgetReason?.metrics?.roi || 3.2}</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.budgetReason?.metrics?.change || '+10%'} vs last week
              </p>
            </div>

            <div className="bg-info-50 rounded-lg p-4 border border-info-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-info-600" />
                <span className="font-semibold text-neutral-700">Conversion Cost</span>
              </div>
              <p className="text-2xl font-bold text-info-600">¥{campaign.costPerConversion}</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.budgetReason?.metrics?.costChange || '-5%'} vs last week
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer size={18} className="text-purple-600" />
                <span className="font-semibold text-neutral-700">CTR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{campaign.ctr}%</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.ctr > 2 ? '+0.3% vs last week' : '-0.2% vs last week'}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-orange-600" />
                <span className="font-semibold text-neutral-700">Conversion Rate</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{campaign.cvr}%</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.cvr > 3 ? '+0.5% vs last week' : '-0.1% vs last week'}
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
            <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Deep Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-success-600" />
                  Strengths Analysis
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1 ml-6">
                  <li>• Conversion cost is 15% below industry average</li>
                  <li>• CTR performance is excellent, ad creative appeal is strong</li>
                  <li>• Audience targeting is precise, conversion rate is high</li>
                  <li>• Traffic quality is stable, invalid click rate is low</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning-600" />
                  Improvement Suggestions
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1 ml-6">
                  <li>• Try increasing ad creative diversity, avoid creative fatigue</li>
                  <li>• Consider expanding new audience segments, expand coverage</li>
                  <li>• Optimize landing page load speed, improve conversion rate</li>
                  <li>• Test different bidding strategies, find the optimal solution</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="mb-6">
            <h3 className="font-bold text-neutral-900 mb-3">Performance Trends</h3>
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-end justify-between h-40 gap-2">
                {[65, 72, 68, 75, 80, 78, 85].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary-hover"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-neutral-500 mt-2">Day {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div>
            <h3 className="font-bold text-neutral-900 mb-3">Detailed Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">Total Spend</p>
                <p className="text-xl font-bold text-neutral-900">¥{campaign.spend}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">Impressions</p>
                <p className="text-xl font-bold text-neutral-900">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">Clicks</p>
                <p className="text-xl font-bold text-neutral-900">{Math.round(campaign.impressions * campaign.ctr / 100).toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">Conversions</p>
                <p className="text-xl font-bold text-neutral-900">{campaign.conversions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-neutral-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
            Optimization Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

export default CampaignAnalysisModal
