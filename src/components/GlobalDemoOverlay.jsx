import { Sparkles, Rocket, Database, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

const GlobalDemoOverlay = ({ onConnect, onCreate }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 2000)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      onCreate()
    }, 2000)
  }

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-br from-white/60 via-purple-50/60 to-white/60 flex items-center justify-center">
      <div className="p-8 w-full h-full flex items-center justify-center">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <Sparkles size={24} />
              <span className="text-2xl font-bold">LumaFit 今日工作台</span>
            </div>
            <h1 className="text-5xl font-bold text-neutral-900 mb-4">
              美国 ROAS 1.82，先处理预算和素材
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              当前已有 3 个 Campaign 待处理，Core Legging Video V12 需要换新。
            </p>
          </div>

          {/* Two Path Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Connect Account */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Database size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">继续处理今日异常</h2>
                  <p className="text-neutral-500">查看预算动作和处理记录</p>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-6 leading-relaxed">
                进入广告管理，确认 US Prospecting 降预算、US Retargeting 保留曝光，以及 Lookalike 学习期观察。
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>US Prospecting Broad：$140 调整到 $95</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>US Retargeting Purchase：促销周保留 $180</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>US 3 Percent Lookalike：学习期继续保留</span>
                </li>
              </ul>

              <button
                onClick={handleConnect}
                disabled={isConnecting || isCreating}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <span>进入广告管理</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Create New Campaign */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <Rocket size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">创建换新草稿</h2>
                  <p className="text-neutral-500">替换疲劳冷启动素材</p>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-6 leading-relaxed">
                为美国冷启动准备两条 UGC Hook，保留再营销客户证言轮播，发布前确认预算和文案。
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>UGC Hook 01：Compression Fit</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>UGC Hook 02：Morning Routine</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>日预算合计 $95，低于美国红线</span>
                </li>
              </ul>

              <button
                onClick={handleCreate}
                disabled={isConnecting || isCreating}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold py-4 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <span>打开草稿中心</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Business status */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-primary/30 text-neutral-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <span>预算变更需优化师确认后生效，客户日报会记录本次处理结果</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalDemoOverlay
