import React, { useRef } from 'react'
import { Rocket, PartyPopper, Check } from 'lucide-react'
import { STATUS_BAR_DATA } from './mockData'
import LaunchProgress from './LaunchProgress'
import SetupChecklist from './SetupChecklist'
import ExpectTimeline from './ExpectTimeline'
import OptimizeGoalsSpotlight from './OptimizeGoalsSpotlight'
import { useOnboardingTour } from '../onboarding/useOnboardingTour'
import OnboardingSpotlight from '../onboarding/OnboardingSpotlight'

export default function JustLaunchedView({
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
  onPageChange,
  goalConfigured,
  setupAllDone,
}) {
  const { dailyBudget } = STATUS_BAR_DATA
  const { isActive, tourSubStep, endTour, advanceTourSubStep } = useOnboardingTour(5)
  const launchProgressRef = useRef(null)
  const setupChecklistRef = useRef(null)
  const expectTimelineRef = useRef(null)

  return (
    <>
    <div className="space-y-5">
      {/* Header banner */}
      <div className="bg-white rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Your ads are live!</h2>
            <p className="text-xs text-gray-500 mt-0.5">3 campaigns published — here's what's happening now.</p>
          </div>
        </div>
      </div>

      {/* Optimize Goals Spotlight */}
      <OptimizeGoalsSpotlight
        goalConfigured={goalConfigured}
        onPageChange={onPageChange}
      />

      {/* Section 1 & 2: Launch Progress + Complete Your Setup (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Launch Progress */}
        <div ref={launchProgressRef} className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Launch Progress</h3>
          <LaunchProgress />
        </div>

        {/* Complete Your Setup */}
        <div ref={setupChecklistRef} className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <SetupChecklist
            autoExecuteRecommendations={autoExecuteRecommendations}
            autoRegenEnabled={autoRegenEnabled}
            onAutoExecuteChange={onAutoExecuteChange}
            onAutoRegenChange={onAutoRegenChange}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* Setup complete celebration */}
      {setupAllDone && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <PartyPopper className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800">基础设置已完成！</h3>
              <p className="text-xs text-emerald-600 mt-0.5">
                你已完成广告发布和管理的基础配置，AdsGo AI 正在全力优化你的广告投放效果。
              </p>
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Section 3: What to Expect + Safety */}
      <div ref={expectTimelineRef} className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
        <ExpectTimeline dailyBudget={dailyBudget} />
      </div>
    </div>

    {isActive && tourSubStep === 1 && (
      <OnboardingSpotlight
        targetRef={launchProgressRef}
        stepLabel="2/4"
        title="广告发布进度"
        body="广告已提交！这里实时展示从提交到首次AI优化的5个关键节点。系统将在数小时内完成平台审核并开始投放，无需手动操作"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )}

    {isActive && tourSubStep === 2 && (
      <OnboardingSpotlight
        targetRef={setupChecklistRef}
        stepLabel="3/4"
        title="完成你的 AI 设置"
        body="发布后立即完成这3项设置，AI将在广告学习期结束后立即接管优化，确保每一分预算都花在刀刃上，避免错失最佳优化窗口"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )}

    {isActive && tourSubStep === 3 && (
      <OnboardingSpotlight
        targetRef={expectTimelineRef}
        stepLabel="4/4"
        title="投放成长曲线"
        body="广告投放分3个阶段：前7天AI探索受众并收集数据，7–14天针对ROI持续优化，14天后进入规模扩张。了解这条曲线，有助于合理设定每个阶段的预期"
        onSkip={endTour}
        onNext={endTour}
        nextText="我了解了"
      />
    )}
    </>
  )
}
