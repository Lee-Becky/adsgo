import { Lightbulb, TrendingUp, Target, Zap, ArrowRight } from 'lucide-react'

const AdInsights = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
            </div>
          </div>
        </div>

        {/* Placeholder Image */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-8 mb-6">
          <div className="flex items-center justify-center min-h-[500px] bg-gray-50 rounded-lg">
            <div className="text-center">
              <img 
                src="/ad insights.jpg" 
                alt="Ad Insights Placeholder" 
                className="max-w-full max-h-[450px] rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `
                    <div class="flex flex-col items-center gap-4">
                      <Lightbulb size={64} className="text-gray-400" />
                      <p class="text-gray-500 text-lg">Ad Insights 功能开发中</p>
                      <p class="text-gray-400 text-sm">此页面将显示广告洞察和建议的新campaigns</p>
                    </div>
                  `
                }}
              />
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">趋势分析</h3>
            </div>
            <p className="text-gray-600 text-sm">
              基于历史数据分析广告表现趋势，识别增长机会和潜在风险
            </p>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">智能推荐</h3>
            </div>
            <p className="text-gray-600 text-sm">
              AI 驱动的智能推荐系统，提供个性化的广告投放策略建议
            </p>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">快速部署</h3>
            </div>
            <p className="text-gray-600 text-sm">
              一键将推荐的 campaigns 部署到各个广告平台，快速上线
            </p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-primary/5 via-purple-50/50 to-blue-50/30 rounded-xl border border-primary/20 shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Zap className="text-primary" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">更多功能即将推出</h3>
              <p className="text-gray-600">
                我们正在开发更多强大的洞察功能，包括自动优化、竞品分析和跨平台数据整合
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              了解更多
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdInsights
