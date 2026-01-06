import { Link, PlusCircle, ArrowRight, Sparkles } from 'lucide-react'

const DemoOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-10 flex items-center justify-center">
      <div className="max-w-5xl w-full px-6">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            <span>欢迎使用 AdsGo</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            解锁 AI 驱动的<br />广告优化体验
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            连接您的广告账户，或创建新的广告活动，开始智能管理您的投放效果
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Connect Account Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-1 group cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Link size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                连接活跃的广告账户
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                同步您现有的广告账户数据，立即开始分析和优化您的广告投放
              </p>
              <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:gap-3">
                立即连接
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Launch New Ad Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-1 group cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PlusCircle size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                启动新广告
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                从零开始创建新的广告活动，快速设置并投放您的第一个广告
              </p>
              <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:gap-3">
                开始创建
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-full text-sm">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
            <span>提示：左侧菜单栏随时可用，选择合适的路径开始您的广告管理之旅</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoOverlay
