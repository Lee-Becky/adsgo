import { CheckCircle2, RefreshCw, Settings2, Sparkles } from 'lucide-react';
import { useWizard } from '../context';
import { polishVoiceover, runSubmitStoryboard } from '../actions';
import {
  AlertInfo,
  BtnDefault,
  BtnLink,
  BtnPrimary,
  cn,
  FieldLabel,
  GeneratingPanel,
  PillTabs,
  StepTransition,
  StickyFooter,
  TextareaAdsgo,
  ToggleAdsgo,
} from '../ui';
import { CARD_SHADOW, FormField } from '../shared';

export default function Step5StoryboardDesign() {
  const { state, dispatch, derived, busyRef } = useWizard();
  const { step5, storyboardTab, busy } = state;
  const { keyframes, selectedActor, canGenerateStoryboard } = derived;

  const handleSubmit = () => {
    if (!canGenerateStoryboard) return;
    runSubmitStoryboard(dispatch, busyRef);
  };

  const voiceoverLen = step5.voiceover?.length || 0;

  return (
    <StepTransition>
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary-500 to-primary-400 shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">分镜与关键帧设计</h2>
          </div>
          <p className="text-sm text-neutral-500 ml-[18px]">
            选择各个分镜图片，以确保最终视频效果。
            {selectedActor ? ` · 演员：${selectedActor.name}` : ''}
          </p>
        </div>

        {busy.submittingStoryboard ? (
          <GeneratingPanel
            title="提交分镜任务"
            message="正在提交关键帧与口播配置，准备生成分镜视频…"
            subMessage="预计 1–3 分钟（演示已缩短）"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2/3: Storyboard keyframes */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                <PillTabs
                  tabs={[
                    { id: 'k1', label: '分镜 1 · 0–8s' },
                    { id: 'k2', label: '分镜 2 · 8–16s' },
                  ]}
                  activeId={storyboardTab}
                  onChange={(id) =>
                    dispatch({ type: 'SET_STORYBOARD_TAB', payload: id })
                  }
                />

                <div className="mt-5">
                  {storyboardTab === 'k2' ? (
                    <AlertInfo title="多分镜（演示）">
                      完整产品中可为每段分镜单独配置关键帧与口播；本演示沿用分镜 1 的数据结构。
                    </AlertInfo>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Required keyframe — semantic error color */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-error-500" />
                            首帧图（必选）
                          </h4>
                          <div className="bg-gradient-to-br from-error-50/40 to-white rounded-xl p-3 border border-error-100/60">
                            <div className="grid grid-cols-3 gap-2.5">
                              {keyframes.required.map((k) => {
                                const sel = step5.requiredKeyframeId === k.id;
                                return (
                                  <button
                                    key={k.id}
                                    type="button"
                                    onClick={() =>
                                      dispatch({
                                        type: 'UPDATE_STEP5',
                                        payload: { requiredKeyframeId: k.id },
                                      })
                                    }
                                    className={cn(
                                      'relative rounded-lg border overflow-hidden transition-all duration-300 group',
                                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                                      'hover:-translate-y-0.5',
                                      sel
                                        ? 'border-primary-500 border-2 ring-2 ring-primary-500/20 shadow-md'
                                        : 'border-neutral-200 hover:border-neutral-300',
                                    )}
                                  >
                                    <div className="aspect-[3/4] bg-neutral-200 overflow-hidden">
                                      <img
                                        src={k.src}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                    {sel && (
                                      <>
                                        <div className="absolute top-1.5 right-1.5">
                                          <CheckCircle2
                                            className="w-5 h-5 text-primary-500 drop-shadow-sm"
                                            fill="white"
                                          />
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-primary-500/90 text-white text-[10px] font-semibold text-center py-1">
                                          首帧图
                                        </div>
                                      </>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Optional keyframe — semantic warning color */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-warning-500" />
                            尾帧图（可选）
                          </h4>
                          <div className="bg-gradient-to-br from-warning-50/40 to-white rounded-xl p-3 border border-warning-100/60">
                            <div className="grid grid-cols-3 gap-2.5">
                              {keyframes.optional.map((k) => {
                                const sel = step5.optionalKeyframeId === k.id;
                                return (
                                  <button
                                    key={k.id}
                                    type="button"
                                    onClick={() =>
                                      dispatch({
                                        type: 'UPDATE_STEP5',
                                        payload: {
                                          optionalKeyframeId:
                                            step5.optionalKeyframeId === k.id ? '' : k.id,
                                        },
                                      })
                                    }
                                    className={cn(
                                      'relative rounded-lg border overflow-hidden transition-all duration-300 group',
                                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                                      'hover:-translate-y-0.5',
                                      sel
                                        ? 'border-primary-500 border-2 ring-2 ring-primary-500/20 shadow-md'
                                        : 'border-neutral-200 hover:border-neutral-300',
                                    )}
                                  >
                                    <div className="aspect-[3/4] bg-neutral-200 overflow-hidden">
                                      <img
                                        src={k.src}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                    {sel && (
                                      <>
                                        <div className="absolute top-1.5 right-1.5">
                                          <CheckCircle2
                                            className="w-5 h-5 text-primary-500 drop-shadow-sm"
                                            fill="white"
                                          />
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-primary-500/90 text-white text-[10px] font-semibold text-center py-1">
                                          尾帧图
                                        </div>
                                      </>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <BtnDefault type="button" disabled>
                          <RefreshCw className="w-4 h-4" />
                          重新生成图片
                        </BtnDefault>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1/3: Configuration panel with brand treatment */}
            <div className="lg:col-span-1 self-start">
              <div
                className={cn(
                  'lg:sticky lg:top-6 rounded-xl border border-primary-100/80 bg-neutral-50 overflow-hidden',
                  CARD_SHADOW,
                )}
              >
                {/* Panel header */}
                <div className="px-4 py-3 border-b border-[#F5F5F5] bg-neutral-50/50 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-neutral-900">配置面板</span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-end justify-between gap-3">
                      <FieldLabel>口播文案</FieldLabel>
                      <BtnLink
                        type="button"
                        onClick={() => polishVoiceover(dispatch, state)}
                        className="px-2 py-1"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI 润色
                      </BtnLink>
                    </div>
                    <TextareaAdsgo
                      rows={4}
                      value={step5.voiceover}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_STEP5',
                          payload: { voiceover: e.target.value },
                        })
                      }
                      placeholder="输入口播文案..."
                    />
                    <p className="text-[10px] text-neutral-400 text-right">
                      {voiceoverLen} 字
                    </p>
                  </div>

                  <FormField label="动作提示词">
                    <TextareaAdsgo
                      rows={3}
                      value={step5.actionPrompt}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_STEP5',
                          payload: { actionPrompt: e.target.value },
                        })
                      }
                      placeholder="描述人物动作..."
                    />
                  </FormField>

                  <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
                    <ToggleAdsgo
                      checked={step5.autoVoice}
                      onChange={(v) =>
                        dispatch({
                          type: 'UPDATE_STEP5',
                          payload: { autoVoice: v },
                        })
                      }
                      label="生成分镜口播与配音"
                    />
                  </div>

                  {/* Condition status */}
                  <div className="text-[11px] text-neutral-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          step5.requiredKeyframeId ? 'bg-success-500' : 'bg-neutral-300',
                        )}
                      />
                      首帧图 {step5.requiredKeyframeId ? '已选' : '未选'}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {!busy.submittingStoryboard && (
          <StickyFooter
            left={
              <span className="text-xs">
                首帧图：{step5.requiredKeyframeId ? <span className="text-primary-600 font-medium">已选</span> : <span className="text-neutral-400">未选</span>}
              </span>
            }
          >
            <BtnPrimary
              type="button"
              disabled={!canGenerateStoryboard}
              onClick={handleSubmit}
              loading={busy.submittingStoryboard}
            >
              <Sparkles className="w-4 h-4" />
              生成分镜视频
            </BtnPrimary>
          </StickyFooter>
        )}
      </div>
    </StepTransition>
  );
}
