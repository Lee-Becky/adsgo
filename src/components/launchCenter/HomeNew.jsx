import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import NarrativeStep from './NarrativeStep'
import ObjectiveOverviewMini from './ObjectiveOverviewMini'
import StatusBriefing from './StatusBriefing'
import YourActions from './YourActions'
import ThisWeekRecap from './ThisWeekRecap'
import RecentAIActions from './RecentAIActions'
import LookingAhead from './LookingAhead'
import HowWeWork from './HowWeWork'
import WeeklyReportDrawer from './WeeklyReportDrawer'
import ActivityLogDrawer from './ActivityLogDrawer'
import KPIMilestonesDrawer from './KPIMilestonesDrawer'
import JourneyPhasesDrawer from './JourneyPhasesDrawer'
import ControlMatrixDrawer from './ControlMatrixDrawer'
import CreativeDashboardDrawer from './CreativeDashboardDrawer'
import DemoPhaseSwitch from '../mediaPlan/DemoPhaseSwitch'
import PrePublishHome from './PrePublishHome'
import JustLaunchedHome from './JustLaunchedHome'

const HomeNew = ({
  selectedBrand,
  onPageChange,
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
}) => {
  const [demoPhase, setDemoPhase] = useState('new_user')
  const [activeDrawer, setActiveDrawer] = useState(null)

  const openDrawer = (drawerName) => setActiveDrawer(drawerName)
  const closeDrawer = () => setActiveDrawer(null)

  // ── Pre-publish State ──
  if (demoPhase === 'new_user') {
    return (
      <div>
        <div className="px-6 pt-6">
          <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        </div>
        <PrePublishHome onPageChange={onPageChange} />
      </div>
    )
  }

  // ── Just Launched State ──
  if (demoPhase === 'just_launched') {
    return (
      <div>
        <div className="px-6 pt-6">
          <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        </div>
        <JustLaunchedHome
          autoExecuteRecommendations={autoExecuteRecommendations}
          autoRegenEnabled={autoRegenEnabled}
          onAutoExecuteChange={onAutoExecuteChange}
          onAutoRegenChange={onAutoRegenChange}
          onPageChange={onPageChange}
        />
      </div>
    )
  }

  // ── Running State (existing dashboard) ──
  return (
    <div className="p-6 space-y-4">
      <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />

      {/* Objective Overview — Independent Card */}
      <ObjectiveOverviewMini onEdit={() => onPageChange('optimizeGoals')} />

      {/* Single Document Container */}
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] overflow-hidden">

        {/* Narrative Steps */}
        <div className="p-6 md:p-8">
          <NarrativeStep
            step={1}
            title="How are your ads doing?"
            subtitle="Your daily AI briefing"
            showLine
            action={
              <button
                onClick={() => openDrawer('journey')}
                className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Brand Phases <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <StatusBriefing
              onOpenJourney={() => openDrawer('journey')}
              onOpenKPI={() => openDrawer('kpi')}
            />
          </NarrativeStep>

          <NarrativeStep
            step={2}
            title="What should you do?"
            subtitle="Pending actions that need your input"
            showLine
          >
            <YourActions onPageChange={onPageChange} />
          </NarrativeStep>

          <NarrativeStep
            step={3}
            title="What happened recently?"
            subtitle="Performance recap & system activity"
            showLine
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ThisWeekRecap
                onOpenWeeklyReport={() => openDrawer('weeklyReport')}
              />
              <RecentAIActions
                onOpenActivityLog={() => openDrawer('activityLog')}
              />
            </div>
          </NarrativeStep>

          <NarrativeStep
            step={4}
            title="What's coming next?"
            subtitle="Outlook, milestones & recommendations"
            action={
              <button
                onClick={() => openDrawer('kpi')}
                className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Performance Overview <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <LookingAhead />
          </NarrativeStep>
        </div>

        {/* Footer — How We Work (not numbered) */}
        <div className="border-t border-[#F5F5F5]">
          <HowWeWork
            onOpenControlMatrix={() => openDrawer('controlMatrix')}
          />
        </div>
      </div>

      {/* Drawers */}
      <WeeklyReportDrawer
        isOpen={activeDrawer === 'weeklyReport'}
        onClose={closeDrawer}
      />
      <ActivityLogDrawer
        isOpen={activeDrawer === 'activityLog'}
        onClose={closeDrawer}
      />
      <KPIMilestonesDrawer
        isOpen={activeDrawer === 'kpi'}
        onClose={closeDrawer}
      />
      <JourneyPhasesDrawer
        isOpen={activeDrawer === 'journey'}
        onClose={closeDrawer}
      />
      <ControlMatrixDrawer
        isOpen={activeDrawer === 'controlMatrix'}
        onClose={closeDrawer}
      />
      <CreativeDashboardDrawer
        isOpen={activeDrawer === 'creative'}
        onClose={closeDrawer}
      />
    </div>
  )
}

export default HomeNew
