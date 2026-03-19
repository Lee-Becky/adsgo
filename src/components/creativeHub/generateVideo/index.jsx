/**
 * Generate Video — 7-Step AI Marketing Video Wizard
 * Architecture: WizardShell + per-step components + useReducer context
 */
import { useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { VideoWizardProvider, useWizard } from './context';
import { FlowStepper } from './ui';
import Step1Landing from './steps/Step1Landing';
import Step2ProductAnalysis from './steps/Step2ProductAnalysis';
import Step3ScriptPlanning from './steps/Step3ScriptPlanning';
import Step4ActorDesign from './steps/Step4ActorDesign';
import Step5StoryboardDesign from './steps/Step5StoryboardDesign';
import Step6ClipPreview from './steps/Step6ClipPreview';
import Step7FinalVideo from './steps/Step7FinalVideo';

const FLOW_STEPS = [
  { id: 1, bar: '输入URL' },
  { id: 2, bar: '品牌及商品分析' },
  { id: 3, bar: '视频脚本策划' },
  { id: 4, bar: '人物形象设计' },
  { id: 5, bar: '视频分镜设计' },
  { id: 6, bar: '视频分镜预览' },
  { id: 7, bar: '最终成片生成' },
];

const STEP_COMPONENTS = [
  null,
  Step1Landing,
  Step2ProductAnalysis,
  Step3ScriptPlanning,
  Step4ActorDesign,
  Step5StoryboardDesign,
  Step6ClipPreview,
  Step7FinalVideo,
];

function WizardShell() {
  const { state, dispatch } = useWizard();
  const { activeStep, maxReached } = state;

  const goBack = useCallback(
    () => dispatch({ type: 'SET_STEP', payload: Math.max(1, activeStep - 1) }),
    [dispatch, activeStep],
  );

  const onStepClick = useCallback(
    (n) => {
      if (n >= 1 && n <= maxReached) {
        dispatch({ type: 'SET_STEP', payload: n });
      }
    },
    [dispatch, maxReached],
  );

  const resetAll = useCallback(
    () => dispatch({ type: 'RESET_ALL' }),
    [dispatch],
  );

  const StepComponent = STEP_COMPONENTS[activeStep];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 space-y-6">
        {activeStep > 1 && (
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <FlowStepper
              steps={FLOW_STEPS}
              activeStep={activeStep}
              maxReached={maxReached}
              onStepClick={onStepClick}
              onGoBack={goBack}
            />
            <button
              type="button"
              onClick={resetAll}
              className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-500 transition-colors ml-auto"
            >
              <RefreshCw className="w-3 h-3" />
              重新创建
            </button>
          </div>
        )}

        {StepComponent && <StepComponent />}
      </div>
    </div>
  );
}

export default function GenerateVideo() {
  return (
    <VideoWizardProvider>
      <WizardShell />
    </VideoWizardProvider>
  );
}
