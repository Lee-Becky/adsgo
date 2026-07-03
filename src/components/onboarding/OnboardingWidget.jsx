import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  Compass, Megaphone, Target, TrendingUp, Sparkles, Palette, CalendarDays,
  ChevronRight, ChevronDown, ChevronUp, X, Check, CircleCheck, Lock, PartyPopper,
} from 'lucide-react'
import { useOnboardingState } from './useOnboardingState'
import { useOnboardingContext } from './OnboardingContext'
import { useTourSeen } from './useTourSeen'
import { Z_INDEX } from '../../constants/zIndex'

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
    route: 'create/bulk-launch',
    icon: Megaphone,
  },
  {
    title: '配置你的优化目标',
    description: '设定KPI目标和每日预算上限，这是AI优化你广告投放的基础',
    highlights: [
      '设定ROAS/CPA目标，AI据此决策优化方向',
      '配置每日预算上限，AI绝不超支',
      '选择投放市场和平台，精准定位你的目标',
    ],
    ctaText: '去配置目标',
    route: 'settings/goals',
    icon: Target,
  },
  {
    title: '开启自动优化（Recommend/Auto 任一）',
    description: '开启 Recommend 或 Auto 任一功能即可让 AI 接管关键优化动作并提升效率',
    highlights: [
      '自动暂停低效广告，避免预算浪费',
      '实时放大高ROI广告的预算投入',
      '7×24h自动执行，无需人工干预',
    ],
    ctaText: '去开启任一自动优化',
    route: 'ads/campaigns',
    icon: TrendingUp,
  },
  {
    title: '了解自动发布按钮位置与作用',
    description: '进入页面并了解自动发布按钮位置和作用，即可完成本步骤',
    highlights: [
      'AI选择最佳时机自动发布新Campaign',
      '持续补充新创意，规避广告效果衰退',
      '全自动执行，始终保持投放竞争力',
    ],
    ctaText: '去查看自动发布',
    route: 'create/draft',
    icon: Sparkles,
  },
  {
    title: '了解创意补充方式（上传/AI生成）',
    description: '进入创意页面并了解上传素材或 AI 生成的路径，即可完成本步骤',
    highlights: [
      'AI自动生成品牌化广告素材',
      '更多素材变体 = 更多测试机会',
      '持续补充新素材，规避创意疲劳',
    ],
    ctaText: '去查看创意入口',
    route: 'creative/library',
    tourScope: 'creative/',
    icon: Palette,
  },
  {
    title: '查看你的 Media Plan',
    description: '广告发布后24小时内，Media Plan 展示发布进度、AI设置清单和投放预期，帮助你快速进入状态',
    highlights: [
      '实时跟踪广告从提交到首次AI优化的5个关键节点',
      '3项关键设置，让AI在学习期结束后立即接管优化',
      '了解3阶段成长曲线，合理设定投放预期',
    ],
    ctaText: '去查看 Media Plan',
    route: 'plan/media-plan',
    icon: CalendarDays,
  },
]

export default function OnboardingWidget({
  selectedBrand,
  publishedAt,
  goalConfigured,
  isAutopilotEnabled,
  isAutoPublishEnabled,
  autoOptimizeConfirmed,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { brandId } = useParams()
  const { startTour, activeTourStep, endTour } = useOnboardingContext()

  // Build full workspace path from relative route
  const buildPath = (relativePath) => {
    const bid = brandId || 'default'
    return `/workspace/${encodeURIComponent(bid)}/${relativePath}`
  }

  // Extract workspace-relative path from current location
  const workspacePath = location.pathname.replace(/^\/workspace\/[^/]+\//, '')
  const activeTourStepRef = useRef(activeTourStep)
  useEffect(() => { activeTourStepRef.current = activeTourStep }, [activeTourStep])
  const { hasSeen, markSeen } = useTourSeen()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [expandedStep, setExpandedStep] = useState(0)
  const prevCompletedRef = useRef(0)

  const {
    completedSteps,
    markStepCompleted,
    allDone,
    dismissed,
    dismiss,
    currentStep,
    isStep1Done,
    totalSteps,
  } = useOnboardingState({
    selectedBrand,
    publishedAt,
    goalConfigured,
    isAutopilotEnabled,
    isAutoPublishEnabled,
    autoOptimizeConfirmed,
  })

  // If the user navigates away from the active tour step's target route (e.g. clicks
  // a different sidebar menu), end the tour so the spotlight doesn't linger or
  // re-fire on an unrelated page
  useEffect(() => {
    const step = activeTourStepRef.current
    if (step === null || step === undefined) return
    const scope = STEPS[step]?.tourScope || STEPS[step]?.route
    if (!scope) return
    if (!workspacePath.startsWith(scope)) {
      endTour()
    }
  }, [workspacePath, endTour])

  // Mutex with other floating panels (e.g. SupportBubble): when another panel opens,
  // collapse this one; when this one expands, dispatch so the other one closes.
  useEffect(() => {
    const onOtherOpen = (e) => {
      const id = e.detail?.id
      if (!id || id === 'onboarding') return
      if (id === 'support') setSupportOpen(true)
      setIsExpanded(prev => {
        if (!prev) return prev
        setIsClosing(true)
        setTimeout(() => setIsClosing(false), 250)
        return false
      })
    }
    const onOtherClose = (e) => {
      if (e.detail?.id === 'support') setSupportOpen(false)
    }
    window.addEventListener('adsgo:floatpanel:open', onOtherOpen)
    window.addEventListener('adsgo:floatpanel:close', onOtherClose)
    return () => {
      window.removeEventListener('adsgo:floatpanel:open', onOtherOpen)
      window.removeEventListener('adsgo:floatpanel:close', onOtherClose)
    }
  }, [])

  useEffect(() => {
    if (isExpanded && !isClosing) {
      window.dispatchEvent(new CustomEvent('adsgo:floatpanel:open', { detail: { id: 'onboarding' } }))
    } else if (!isExpanded) {
      window.dispatchEvent(new CustomEvent('adsgo:floatpanel:close', { detail: { id: 'onboarding' } }))
    }
  }, [isExpanded, isClosing])

  // First-visit auto-trigger: when a new user lands on an onboarding page directly
  // (not via the Getting Started CTA), run that step's tour once.
  useEffect(() => {
    if (activeTourStep !== null) return
    const idx = STEPS.findIndex(s => {
      const scope = s.tourScope || s.route
      return scope && workspacePath.startsWith(scope)
    })
    if (idx < 0) return
    if (hasSeen(idx)) return
    markSeen(idx)
    startTour(idx)
  }, [workspacePath, activeTourStep, hasSeen, markSeen, startTour])

  // Step 4: visiting draft page means user has learned the auto-publish location
  useEffect(() => {
    if (activeTourStep !== null) return
    if (workspacePath === 'create/draft') {
      markStepCompleted(3)
    }
  }, [workspacePath, markStepCompleted, activeTourStep])

  // Step 5: visiting creative pages means user has learned upload/AI generation entry
  useEffect(() => {
    if (activeTourStep !== null) return
    if (workspacePath === 'creative/ai-gen' || workspacePath === 'creative/library') {
      markStepCompleted(4)
    }
  }, [workspacePath, markStepCompleted, activeTourStep])

  // Step 6: visiting mediaPlan means user has learned the media plan overview
  useEffect(() => {
    if (activeTourStep !== null) return
    if (workspacePath === 'plan/media-plan') {
      markStepCompleted(5)
    }
  }, [workspacePath, markStepCompleted, activeTourStep])

  // Auto-expand to first incomplete step
  useEffect(() => {
    setExpandedStep(currentStep < totalSteps ? currentStep : totalSteps - 1)
  }, [currentStep, totalSteps])

  // Auto-expand widget when a new step is completed, and end any active page spotlight
  useEffect(() => {
    if (completedSteps.length > prevCompletedRef.current && completedSteps.length > 0) {
      setIsExpanded(true)
      endTour()
    }
    prevCompletedRef.current = completedSteps.length
  }, [completedSteps.length])

  if (dismissed) return null

  const completedCount = completedSteps.length

  const handleCTAClick = (index) => {
    markSeen(index)
    navigate(buildPath(STEPS[index].route))
    startTour(index)
    handleClose()
  }

  const handleAcknowledgeStep3 = () => {
    markStepCompleted(2)
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
    if (!isStep1Done && index > 0) return
    setExpandedStep(prev => prev === index ? -1 : index)
  }

  const isStepCompleted = (index) => completedSteps.includes(index)
  const isStepLocked = (index) => !isStep1Done && index > 0

  const renderStepIndicator = (index) => {
    if (isStepCompleted(index)) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 transition-all duration-300">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )
    }
    if (isStepLocked(index)) {
      return (
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <Lock className="w-3 h-3 text-neutral-300" />
        </div>
      )
    }
    const isActive = expandedStep === index
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-200 ${
        isActive ? 'bg-primary text-white ring-2 ring-primary/20' : 'bg-neutral-200 text-neutral-500'
      }`}>
        {index + 1}
      </div>
    )
  }

  const renderStepContent = (step, index) => {
    if (expandedStep !== index) return null
    if (isStepLocked(index)) return null

    return (
      <div className="mt-2.5 ml-9 animate-step-enter">
        <p className="text-xs text-neutral-500 leading-relaxed mb-2">{step.description}</p>

        <div className="mb-3 space-y-1.5">
          {step.highlights.map((text, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CircleCheck className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-[11px] text-neutral-600 leading-relaxed">{text}</span>
            </div>
          ))}
        </div>

        {!isStepCompleted(index) && (
          <div className="space-y-2">
            <button
              onClick={() => handleCTAClick(index)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
            >
              {step.ctaText}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {index === 2 && (
              <button
                onClick={handleAcknowledgeStep3}
                className="w-full text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                已了解功能，暂不需要
              </button>
            )}
          </div>
        )}

        {isStepCompleted(index) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              已完成
            </div>
            <button
              onClick={() => handleCTAClick(index)}
              className="text-[11px] text-neutral-400 hover:text-primary transition-colors"
            >
              重新查看引导
            </button>
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
          className={`fixed bottom-[96px] right-6 w-80 sm:w-[22rem] origin-bottom-right ${
            isClosing ? 'animate-bubble-collapse' : 'animate-bubble-expand'
          }`}
          style={{ zIndex: Z_INDEX.FLOATING_ACTION }}
        >
          <div className="rounded-xl shadow-xl border border-neutral-200 bg-white overflow-hidden max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-neutral-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-neutral-900">Getting Started</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">{completedCount}/{totalSteps}</span>
                <button
                  onClick={handleClose}
                  className="p-0.5 rounded hover:bg-white/60 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-3 flex-shrink-0">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      completedSteps.includes(i) ? 'bg-primary' : 'bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Steps accordion */}
            <div className="px-4 py-3 space-y-0.5 overflow-y-auto flex-1">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon
                const locked = isStepLocked(index)

                return (
                  <div key={index} className="group">
                    <button
                      onClick={() => toggleStepExpand(index)}
                      disabled={locked}
                      className={`w-full flex items-center gap-2.5 py-2 text-left rounded-lg px-1 transition-colors ${
                        locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {renderStepIndicator(index)}
                      <span className={`text-xs font-medium flex-1 ${
                        isStepCompleted(index)
                          ? 'text-neutral-900'
                          : expandedStep === index
                            ? 'text-neutral-900'
                            : locked
                              ? 'text-neutral-300'
                              : 'text-neutral-400'
                      }`}>
                        {step.title}
                      </span>
                      {!locked && (
                        expandedStep === index ? (
                          <ChevronUp className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        )
                      )}
                    </button>

                    {renderStepContent(step, index)}

                    {index < totalSteps - 1 && <div className="border-b border-neutral-100 mx-1 mt-1" />}
                  </div>
                )
              })}
            </div>

            {/* Complete button — only when all done */}
            {allDone && (
              <div className="px-4 pb-4 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <PartyPopper className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-medium text-neutral-700">
                    基础设置已完成，AdsGo 正在全力优化你的广告！
                  </span>
                </div>
                <button
                  onClick={handleComplete}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
                >
                  Complete Onboarding
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating bubble button — only when collapsed and support popover is not open */}
      {!isExpanded && !isClosing && !dismissed && !supportOpen && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-[96px] right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary-focus flex items-center justify-center transition-all duration-200 animate-pulse-subtle"
          style={{ zIndex: Z_INDEX.FLOATING_ACTION }}
        >
          <Compass className="w-5 h-5" />
          {!allDone && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center shadow-sm border border-primary-100">
              {completedCount + 1 <= totalSteps ? completedCount + 1 : totalSteps}
            </span>
          )}
          {allDone && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Check className="w-3 h-3" />
            </span>
          )}
        </button>
      )}
    </>
  )
}
