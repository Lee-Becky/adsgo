import { X, TrendingUp, TrendingDown, Target, DollarSign, MousePointer, CheckCircle, AlertTriangle } from 'lucide-react'

const CampaignAnalysisModal = ({ isOpen, onClose, campaign }) => {
  if (!isOpen || !campaign) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary to-purple-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Campaign 分析</h2>
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
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">ROI</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{campaign.budgetReason?.metrics?.roi || 3.2}</p>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.budgetReason?.metrics?.change || '+10%'} vs 上周
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-blue-600" />
                <span className="font-semibold text-gray-700">转化成本</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">¥{campaign.costPerConversion}</p>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.budgetReason?.metrics?.costChange || '-5%'} vs 上周
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer size={18} className="text-purple-600" />
                <span className="font-semibold text-gray-700">CTR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{campaign.ctr}%</p>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.ctr > 2 ? '+0.3% vs 上周' : '-0.2% vs 上周'}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-orange-600" />
                <span className="font-semibold text-gray-700">转化率</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{campaign.cvr}%</p>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.cvr > 3 ? '+0.5% vs 上周' : '-0.1% vs 上周'}
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI 深度分析
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  优势分析
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-6">
                  <li>• 转化成本低于行业平均水平 15%</li>
                  <li>• CTR 表现优异，广告创意吸引力强</li>
                  <li>• 受众定位精准，转化率高</li>
                  <li>• 流量质量稳定，无效点击率低</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  改进建议
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-6">
                  <li>• 可尝试增加广告创意多样性，避免创意疲劳</li>
                  <li>• 考虑拓展新的受众细分，扩大覆盖范围</li>
                  <li>• 优化落地页加载速度，提升转化率</li>
                  <li>• 测试不同的出价策略，寻找最优方案</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">表现趋势</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-end justify-between h-40 gap-2">
                {[65, 72, 68, 75, 80, 78, 85].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary-hover"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">详细指标</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">总花费</p>
                <p className="text-xl font-bold text-gray-900">¥{campaign.spend}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">展示量</p>
                <p className="text-xl font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">点击量</p>
                <p className="text-xl font-bold text-gray-900">{Math.round(campaign.impressions * campaign.ctr / 100).toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">转化数</p>
                <p className="text-xl font-bold text-gray-900">{campaign.conversions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            关闭
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
            优化建议
          </button>
        </div>
      </div>
    </div>
  )
}

export default CampaignAnalysisModal
