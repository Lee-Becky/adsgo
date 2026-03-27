import React from 'react'
import { PartyPopper, Zap, ListChecks, Bot, Clock } from 'lucide-react'
import NarrativeStep from './NarrativeStep'
import LaunchProgress from '../mediaPlan/LaunchProgress'
import SetupChecklist from '../mediaPlan/SetupChecklist'
import ExpectTimeline from '../mediaPlan/ExpectTimeline'
import { STATUS_BAR_DATA } from '../mediaPlan/mockData'

const AI_ACTIONS = [
  'Sync ad performance data every hour',
  'Analyze audience, creative, and bid combinations',
  'Establish baseline metrics (CPA, ROAS, CTR)',
  'Identify winning combinations, pause underperformers',
  'Generate first optimization recommendations',
]

export default function JustLaunchedHome({
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
  onPageChange,
}) {
  const { dailyBudget } = STATUS_BAR_DATA

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-2">
        <PartyPopper className="w-5 h-5 text-amber-500" />
        <div>
          <h1 className="text-base font-bold text-gray-900">Your ads are live!</h1>
          <p className="text-xs text-gray-500">Here's your getting-started roadmap.</p>
        </div>
      </div>

      {/* Main narrative container */}
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Step 1: What's happening right now */}
          <NarrativeStep
            step={1}
            title="What's happening right now?"
            subtitle="Your campaigns are being submitted and reviewed"
            showLine
          >
            <LaunchProgress />
          </NarrativeStep>

          {/* Step 2: What should you do next */}
          <NarrativeStep
            step={2}
            title="What should you do next?"
            subtitle="Complete your setup while ads are being reviewed"
            showLine
          >
            <SetupChecklist
              autoExecuteRecommendations={autoExecuteRecommendations}
              autoRegenEnabled={autoRegenEnabled}
              onAutoExecuteChange={onAutoExecuteChange}
              onAutoRegenChange={onAutoRegenChange}
              onPageChange={onPageChange}
            />
          </NarrativeStep>

          {/* Step 3: What will AdsGo do */}
          <NarrativeStep
            step={3}
            title="What will AdsGo do for you?"
            subtitle="Automated actions in the next 24-48 hours"
            showLine
          >
            <div className="bg-gray-50/80 rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-semibold text-gray-700">AdsGo will automatically:</span>
              </div>
              <div className="space-y-2">
                {AI_ACTIONS.map((action, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </NarrativeStep>

          {/* Step 4: When will you see results */}
          <NarrativeStep
            step={4}
            title="When will you see results?"
            subtitle="Expected timeline and safety assurances"
          >
            <ExpectTimeline dailyBudget={dailyBudget} />
          </NarrativeStep>
        </div>
      </div>
    </div>
  )
}
