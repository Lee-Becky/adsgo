import { X, TrendingUp, TrendingDown, Target, DollarSign, MousePointer, CheckCircle, AlertTriangle } from 'lucide-react'

const CampaignAnalysisModal = ({ isOpen, onClose, campaign }) => {
  if (!isOpen || !campaign) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary to-purple-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Campaign 业务分析</h2>
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
                {campaign.budgetReason?.metrics?.change || '+10%'} 较上周
              </p>
            </div>

            <div className="bg-info-50 rounded-lg p-4 border border-info-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-info-600" />
                <span className="font-semibold text-neutral-700">转化成本</span>
              </div>
              <p className="text-2xl font-bold text-info-600">¥{campaign.costPerConversion}</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.budgetReason?.metrics?.costChange || '-5%'} 较上周
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer size={18} className="text-purple-600" />
                <span className="font-semibold text-neutral-700">CTR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{campaign.ctr}%</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.ctr > 2 ? '+0.3% 较上周' : '-0.2% 较上周'}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-orange-600" />
                <span className="font-semibold text-neutral-700">转化率</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{campaign.cvr}%</p>
              <p className="text-sm text-neutral-600 mt-1">
                {campaign.cvr > 3 ? '+0.5% 较上周' : '-0.1% 较上周'}
              </p>
            </div>
          </div>

          {/* Business analysis */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
            <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              预算与素材判断
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-success-600" />
                  继续保留的依据
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1 ml-6">
                  <li>• CTR 没有明显下滑，点击兴趣仍在</li>
                  <li>• 再营销访客仍高于账户平均转化</li>
                  <li>• Lookalike 仍处于学习期，不宜过早打断</li>
                  <li>• 促销周客户要求保留再营销曝光</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning-600" />
                  今日处理动作
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1 ml-6">
                  <li>• US Prospecting Broad 先降到 $95/day</li>
                  <li>• Core Legging Video V12 从冷启动下线</li>
                  <li>• 两条 UGC Hook 进入草稿中心</li>
                  <li>• US Retargeting 48 小时后复查</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="mb-6">
            <h3 className="font-bold text-neutral-900 mb-3">近 7 日趋势</h3>
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-end justify-between h-40 gap-2">
                {[65, 72, 68, 75, 80, 78, 85].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary-hover"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-neutral-500 mt-2">第 {index + 1} 天</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div>
            <h3 className="font-bold text-neutral-900 mb-3">指标明细</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">总花费</p>
                <p className="text-xl font-bold text-neutral-900">¥{campaign.spend}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">曝光</p>
                <p className="text-xl font-bold text-neutral-900">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">点击</p>
                <p className="text-xl font-bold text-neutral-900">{Math.round(campaign.impressions * campaign.ctr / 100).toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-1">转化</p>
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
            关闭
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
            查看预算动作
          </button>
        </div>
      </div>
    </div>
  )
}

export default CampaignAnalysisModal
