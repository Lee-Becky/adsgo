import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Megaphone, TrendingUp, Sparkles, ChevronRight, ChevronDown, ChevronUp, X, Check, CircleCheck } from 'lucide-react'
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
    description: '开启后AI将7×24h自动执行预算调整，及时止损低效广告，放大高效投放效果',
    highlights: [
      '自动暂停低效广告，避免预算浪费',
      '实时放大高ROI广告的预算投入',
      '7×24h自动执行，无需人工干预',
    ],
    ctaText: '去开启自动优化',
    route: '/aiOptimize/adManagerV3',
    icon: TrendingUp,
  },
  {
    title: '开启自动化发布推荐Campaigns',
    description: '开启后AI将在最佳时间自动发布新Campaign，持续保持广告效果，规避创意衰退',
    highlights: [
      'AI选择最佳时机自动发布新Campaign',
      '持续补充新创意，规避广告效果衰退',
      '全自动执行，始终保持投放竞争力',
    ],
    ctaText: '去开启自动发布',
    route: '/aiOptimize/autoRegeneration',
    icon: Sparkles,
  },
]

export default function OnboardingWidget({ selectedBrand, isAutopilotEnabled, isAutoPublishEnabled }) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const [expandedStep, setExpandedStep] = useState(0)
  const { completedSteps, markStepCompleted, allDone, dismissed, dismiss } = useOnboardingState(selectedBrand)

  // Reactively complete Step 2 when AI Autopilot is enabled
  useEffect(() => {
    if (isAutopilotEnabled) markStepCompleted(1)
  }, [isAutopilotEnabled, markStepCompleted])

  // Reactively complete Step 3 when Auto Publish is enabled
  useEffect(() => {
    if (isAutoPublishEnabled) markStepCompleted(2)
  }, [isAutoPublishEnabled, markStepCompleted])

  // Auto-expand the first incomplete step
  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      if (!completedSteps.includes(i)) {
        setExpandedStep(i)
        return
      }
    }
  }, [completedSteps])

  if (dismissed) return null

  const completedCount = completedSteps.length

  const handleCTAClick = (index) => {
    // Step 1: mark completed on CTA click; Step 2/3: only navigate, completion is reactive
    if (index === 0) markStepCompleted(index)
    navigate(STEPS[index].route)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsExpanded(false)
    }, 250)
  }

  const handleComplete = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsExpanded(false)
      dismiss()
    }, 250)
  }

  const toggleStepExpand = (index) => {
    setExpandedStep(prev => prev === index ? -1 : index)
  }

  const isStepCompleted = (index) => completedSteps.includes(index)

  const renderStepIndicator = (index) => {
    if (isStepCompleted(index)) {
      return (
        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )
    }
    const isActive = expandedStep === index
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {index + 1}
      </div>
    )
  }

  const renderStepContent = (step, index) => {
    if (expandedStep !== index) return null

    return (
      <div className="mt-2.5 ml-9 animate-step-enter">
        <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.description}</p>

        {/* Highlights */}
        <div className="mb-3 space-y-1.5">
          {step.highlights.map((text, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CircleCheck className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
              <span className="text-[11px] text-gray-600 leading-relaxed">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        {!isStepCompleted(index) && (
          <button
            onClick={() => handleCTAClick(index)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-medium rounded-lg hover:shadow-primary-focus transition-shadow"
          >
            {step.ctaText}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Completed badge */}
        {isStepCompleted(index) && (
          <div className="flex items-center gap-1.5 text-xs text-success font-medium">
            <Check className="w-3.5 h-3.5" />
            已完成
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Expanded card */}
      {(isExpanded || isClosing) && (
        <div
          className={`fixed bottom-6 right-6 z-[850] w-80 sm:w-[22rem] origin-bottom-right ${
            isClosing ? 'animate-bubble-collapse' : 'animate-bubble-expand'
          }`}
        >
          <div className="rounded-xl shadow-2xl border border-border bg-white overflow-hidden max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-900">Getting Started</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{completedCount}/3</span>
                <button
                  onClick={handleClose}
                  className="p-0.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-3 flex-shrink-0">
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

            {/* Steps accordion */}
            <div className="px-4 py-3 space-y-1 overflow-y-auto flex-1">
              {STEPS.map((step, index) => (
                <div key={index} className="group">
                  {/* Step header row */}
                  <button
                    onClick={() => toggleStepExpand(index)}
                    className="w-full flex items-center gap-2.5 py-2 text-left hover:bg-gray-50 rounded-lg px-1 transition-colors"
                  >
                    {renderStepIndicator(index)}
                    <span className={`text-xs font-medium flex-1 ${
                      isStepCompleted(index) ? 'text-gray-900' : expandedStep === index ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                    {expandedStep === index ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Step expanded content */}
                  {renderStepContent(step, index)}

                  {/* Separator */}
                  {index < 2 && <div className="border-b border-gray-100 mx-1 mt-1" />}
                </div>
              ))}
            </div>

            {/* Complete button — only when all done */}
            {allDone && (
              <div className="px-4 pb-4 flex-shrink-0">
                <button
                  onClick={handleComplete}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-primary-focus transition-shadow"
                >
                  Complete Onboarding
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating bubble button — only when collapsed */}
      {!isExpanded && !isClosing && !dismissed && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 z-[850] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary-focus flex items-center justify-center transition-all duration-200 animate-pulse-subtle"
        >
          <Compass className="w-5 h-5" />
          {!allDone && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center shadow-sm border border-primary-100">
              {Math.min(completedCount + 1, 3)}
            </span>
          )}
        </button>
      )}
    </>
  )
}
