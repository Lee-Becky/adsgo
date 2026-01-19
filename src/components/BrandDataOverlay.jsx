import { 
  Database, 
  Rocket, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  ArrowRight
} from 'lucide-react'

const BrandDataOverlay = ({ 
  status = 'no-accounts', 
  onConnectAccount, 
  onCreateCampaign, 
  onRetry,
  onViewDemo,
  onViewError
}) => {
  // Status: 'no-accounts' | 'fetching' | 'no-data'
  
  if (status === 'no-accounts') {
    return (
      <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <div className="p-6 w-full h-full flex items-center justify-center">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                <Rocket size={20} />
                <span className="text-base font-bold">开始使用 AdsGo</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                连接广告账号，开启智能优化
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                选择您的开始方式，立即体验 AI 驱动的广告管理
              </p>
            </div>

            {/* Two Path Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Connect Account */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                onClick={onConnectAccount}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Database size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">连接广告账号</h2>
                    <p className="text-gray-500 text-sm">同步现有广告数据</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  已有 Google、Meta 或 TikTok 广告账号？立即连接，获取实时 AI 预算优化建议和性能洞察。
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>自动导入所有活跃广告系列</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>AI 分析历史表现数据</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>获取个性化预算建议</span>
                  </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white text-base font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
                  <span>立即连接</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Option 2: Create New Campaign */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                onClick={onCreateCampaign}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Rocket size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">新建广告系列</h2>
                    <p className="text-gray-500 text-sm">从零开始创建</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  准备开始新的广告活动？使用我们的 AI 助手，几分钟内即可设置并启动优化的广告系列。
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>AI 引导的广告系列设置向导</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>智能预算推荐</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>跨平台一键发布</span>
                  </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
                  <span>开始创建</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'fetching') {
    return (
      <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full px-6 text-center">
          {/* Loading Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              正在拉取数据
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-2">
              数据正在获取并分析中，请稍后...
            </p>
            <p className="text-sm text-gray-500">
              我们正在从连接的广告账号同步最新的广告数据
            </p>
          </div>

          {/* Loading Progress Indicator */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>数据同步中</span>
              <span className="animate-pulse">处理中...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={onViewDemo}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors group text-sm"
            >
              <span>View demo</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onViewError}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group text-sm"
            >
              <span>View error</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'no-data') {
    return (
      <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full px-6 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-full shadow-2xl">
                <AlertCircle size={48} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              数据获取异常
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-3">
              请检查连接账户是否有活跃中的广告
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-orange-700">若有活跃广告：</span>请点击重试按钮重新获取数据
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-orange-700">若无活跃广告：</span>请发布广告后即可查看数据
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white text-base font-semibold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>重新获取数据</span>
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default BrandDataOverlay
