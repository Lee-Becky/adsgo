import { Link, Rocket, Zap, Sparkles } from 'lucide-react'

const EmptyStateOverlay = ({ onConnectAccount }) => {
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-primary to-purple-600 p-6 rounded-full shadow-2xl">
              <Rocket size={48} className="text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          先处理今日美国市场异常
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
          LumaFit 美国 ROAS 1.82，冷启动预算、再营销曝光和疲劳素材需要今天完成处理。
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Zap size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-neutral-900 mb-2">预算动作</h3>
            <p className="text-sm text-neutral-600">US Prospecting 从 $140 调整到 $95</p>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Sparkles size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-neutral-900 mb-2">素材换新</h3>
            <p className="text-sm text-neutral-600">Core Legging Video V12 进入疲劳换新</p>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Link size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-neutral-900 mb-2">客户日报</h3>
            <p className="text-sm text-neutral-600">记录今日异常、处理动作和观察点</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConnectAccount}
            className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            进入广告管理
          </button>
          
          <button className="px-8 py-4 bg-white text-neutral-700 text-lg font-semibold rounded-xl border-2 border-neutral-200 hover:border-primary hover:text-primary transition-all">
            创建换新草稿
          </button>
        </div>

        {/* Business notice */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>预算变更需优化师确认后才会生效</p>
        </div>
      </div>
    </div>
  )
}

export default EmptyStateOverlay
