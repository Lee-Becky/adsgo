import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Megaphone, TrendingUp, Sparkles, ChevronRight, X, Check, PartyPopper, CircleCheck } from 'lucide-react'
import { useOnboardingState } from './useOnboardingState'

const STEPS = [
  {
    title: '发布你的第一条Campaign',
    description: '通过AI智能分析你的产品页面，自动生成高转化广告素材与投放策略',
    highlights: [
      'AI自动分析产品卖点，生成广告文案',
      '一键生成多平台Campaign，节省90%时间',
      '智能匹配目标受众，精准触达潜在客户',
    ],
    ctaText: '立即创建Campaign',
    route: '/batchGenerateAds',
    icon: Megaphone,
  },
  {
    title: '开启7×24h智能预算优化',
    description: 'AI实时监控广告表现，全天候自动调整预算分配，让每一分钱花在刀刃上',
    highlights: [
      '实时监控ROAS，自动暂停低效广告',
      '智能预算再分配，提升整体投放ROI',
      '7×24h无人值守，告别手动盯盘',
    ],
    ctaText: '开启智能优化',
    route: '/aiOptimize/adManagerV3',
    icon: TrendingUp,
  },
  {
    title: '开启自动化发布推荐Campaigns',
    description: 'AI持续学习你的投放数据，自动生成并推荐高潜力Campaign方案',
    highlights: [
      'AI基于历史数据，推荐最优Campaign组合',
      '自动草拟新Campaign，一键审核发布',
      '持续迭代优化，广告效果越投越好',
    ],
    ctaText: '开启自动推荐',
    route: '/aiOptimize/autoRegeneration',
    icon: Sparkles,
  },
]

export default function OnboardingWidget({ selectedBrand }) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const { completedSteps, currentStepIndex, markStepCompleted, allDone, showCongrats } = useOnboardingState(selectedBrand)

  if (allDone && !showCongrats) return null

  const completedCount = completedSteps.length
  const currentStep = currentStepIndex !== null ? STEPS[currentStepIndex] : null

  const handleCTAClick = () => {
    if (currentStepIndex === null) return
    markStepCompleted(currentStepIndex)
    navigate(STEPS[currentStepIndex].route)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsExpanded(false)
    }, 250)
  }

  return (
    <>
      {/* Expanded card or closing animation */}
      {(isExpanded || isClosing) && !allDone && currentStep && (
        <div
          className={`fixed bottom-6 right-6 z-[850] w-80 sm:w-[22rem] origin-bottom-right ${
            isClosing ? 'animate-bubble-collapse' : 'animate-bubble-expand'
          }`}
        >
          <div className="rounded-xl shadow-2xl border border-border bg-white overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-900">快速入门</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Step {currentStepIndex + 1}/3</span>
                <button
                  onClick={handleClose}
                  className="p-0.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      completedSteps.includes(i) ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current step content */}
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <currentStep.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">{currentStep.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{currentStep.description}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-4 space-y-1.5 pl-1">
                {currentStep.highlights.map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CircleCheck className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCTAClick}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-primary-focus transition-shadow"
              >
                {currentStep.ctaText}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Completed count */}
            {completedCount > 0 && (
              <div className="px-4 pb-3 flex items-center gap-1.5 text-xs text-gray-400">
                <Check className="w-3 h-3 text-success" />
                <span>已完成 {completedCount}/3 步</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Congrats card */}
      {showCongrats && (
        <div className="fixed bottom-6 right-6 z-[850] w-80 sm:w-[22rem] animate-bubble-expand origin-bottom-right">
          <div className="rounded-xl shadow-2xl border border-border bg-white overflow-hidden p-6 text-center relative">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-50 to-purple-100 flex items-center justify-center">
              <PartyPopper className="w-7 h-7 text-primary" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">恭喜完成所有步骤!</h4>
            <p className="text-xs text-gray-500">你已掌握 AdsGo 核心功能</p>
            {/* Decorative confetti dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 rounded-full opacity-0 animate-[confettiFall_1.5s_ease-in_forwards]"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: '-8px',
                    animationDelay: `${i * 0.15}s`,
                    backgroundColor: ['#7033F5', '#9775fa', '#d0bfff', '#00b42a', '#ff7d00', '#f53f3f'][i],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble button — only when collapsed */}
      {!isExpanded && !isClosing && !allDone && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 z-[850] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary-focus flex items-center justify-center transition-all duration-200 animate-pulse-subtle"
        >
          <Compass className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center shadow-sm border border-primary-100">
            {Math.min(completedCount + 1, 3)}
          </span>
        </button>
      )}
    </>
  )
}
