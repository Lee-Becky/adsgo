import { Image, Sparkles } from 'lucide-react';
import { useWizard } from '../context';
import { runGenerateScripts, polishCoreSelling } from '../actions';
import {
  DURATIONS,
  LANG_OPTIONS,
  QUALITIES,
  RATIOS,
  RESOLUTIONS,
  SCRIPT_STYLES,
} from '../mock';
import {
  AlertInfo,
  BtnLink,
  BtnPrimary,
  CardAdsgo,
  cn,
  FieldLabel,
  GeneratingPanel,
  InputAdsgo,
  SelectAdsgo,
  StepTransition,
  StickyFooter,
  TextareaAdsgo,
} from '../ui';
import { AssetGrid, CARD_SHADOW, FormField, Pill } from '../shared';

export default function Step2ProductAnalysis() {
  const { state, dispatch, derived, busyRef } = useWizard();
  const { form, settings, selectedStyleKeys, selectedAssets, busy } = state;
  const { canGenerateScripts } = derived;

  const handleGenerateScripts = () => {
    if (!canGenerateScripts) return;
    runGenerateScripts(dispatch, state, busyRef);
  };

  const filledCount = [form.productName, form.audience, form.coreSelling].filter(
    (v) => v?.trim(),
  ).length;

  return (
    <StepTransition>
      <div className="space-y-5">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary-500 to-primary-400 shrink-0" />
            <h2 className="text-xl font-bold text-gray-900">请确认生成的视频内容</h2>
          </div>
          <p className="text-sm text-gray-500 ml-[18px]">
            确认商品信息与视频参数后，将基于当前配置生成 3 套创意脚本。
          </p>
        </div>

        {busy.analyzing ? (
          <GeneratingPanel
            title="商品分析中"
            message="正在从链接提取商品信息…"
            subMessage="预计数秒（演示已缩短）"
          />
        ) : (
          <CardAdsgo>
            <div className="space-y-5">
              <AlertInfo title="分析结果已就绪">
                已根据链接/填写内容提取商品信息，可在下方继续微调。创意素材请在右侧勾选 3–5 张。
              </AlertInfo>

              {/* Template C: 2/3 form + 1/3 asset sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left form area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Section 1: Product Info — left color bar */}
                  <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-primary-500 shrink-0" />
                      商品信息
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="品牌或者商品名称">
                        <InputAdsgo
                          value={form.productName}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_FORM',
                              payload: { productName: e.target.value },
                            })
                          }
                        />
                      </FormField>
                      <FormField label="目标用户">
                        <InputAdsgo
                          value={form.audience}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_FORM',
                              payload: { audience: e.target.value },
                            })
                          }
                        />
                      </FormField>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-end justify-between gap-3">
                        <FieldLabel>核心卖点描述</FieldLabel>
                        <BtnLink
                          type="button"
                          onClick={() => polishCoreSelling(dispatch, state)}
                          className="px-2 py-1"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI 润色
                        </BtnLink>
                      </div>
                      <TextareaAdsgo
                        rows={2}
                        value={form.coreSelling}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_FORM',
                            payload: { coreSelling: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="输出语种">
                        <SelectAdsgo
                          value={form.lang}
                          options={LANG_OPTIONS}
                          onChange={(v) =>
                            dispatch({ type: 'UPDATE_FORM', payload: { lang: v } })
                          }
                          placeholder="请选择"
                        />
                      </FormField>
                      <FormField label="折扣 / 促销">
                        <InputAdsgo
                          value={form.promotion}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_FORM',
                              payload: { promotion: e.target.value },
                            })
                          }
                        />
                      </FormField>
                      <FormField label="CTA 文案">
                        <InputAdsgo
                          value={form.cta}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_FORM',
                              payload: { cta: e.target.value },
                            })
                          }
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Section 2: Script & Video Parameters — lighter color bar */}
                  <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-primary-300 shrink-0" />
                      脚本与视频参数
                    </h4>
                    <FormField label="脚本风格（最多 3 项）">
                      <div className="flex flex-wrap gap-2">
                        {SCRIPT_STYLES.map((s) => (
                          <Pill
                            key={s}
                            active={selectedStyleKeys.includes(s)}
                            onClick={() =>
                              dispatch({ type: 'TOGGLE_STYLE', payload: s })
                            }
                          >
                            {s}
                          </Pill>
                        ))}
                      </div>
                    </FormField>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField label="视频时长">
                        <div className="flex flex-wrap gap-1.5">
                          {DURATIONS.map((d) => (
                            <Pill
                              key={d}
                              active={settings.duration === d}
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_SETTINGS',
                                  payload: { duration: d },
                                })
                              }
                            >
                              {d}
                            </Pill>
                          ))}
                        </div>
                      </FormField>
                      <FormField label="画面比例">
                        <div className="flex flex-wrap gap-1.5">
                          {RATIOS.map((r) => (
                            <Pill
                              key={r}
                              active={settings.ratio === r}
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_SETTINGS',
                                  payload: { ratio: r },
                                })
                              }
                            >
                              {r}
                            </Pill>
                          ))}
                        </div>
                      </FormField>
                      <FormField label="视频清晰度">
                        <div className="flex flex-wrap gap-1.5">
                          {RESOLUTIONS.map((r) => (
                            <Pill
                              key={r}
                              active={settings.resolution === r}
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_SETTINGS',
                                  payload: { resolution: r },
                                })
                              }
                            >
                              {r}
                            </Pill>
                          ))}
                        </div>
                      </FormField>
                      <FormField label="视频质量">
                        <div className="flex flex-wrap gap-1.5">
                          {QUALITIES.map((q) => (
                            <Pill
                              key={q}
                              active={settings.quality === q}
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_SETTINGS',
                                  payload: { quality: q },
                                })
                              }
                            >
                              {q}
                            </Pill>
                          ))}
                        </div>
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* Right: Asset sidebar with brand treatment */}
                <div className="lg:col-span-1">
                  <div
                    className={cn(
                      'lg:sticky lg:top-6 rounded-xl border border-primary-100/80 bg-gray-50 overflow-hidden max-h-[calc(100vh-12rem)] overflow-y-auto',
                      CARD_SHADOW,
                    )}
                  >
                    {/* Panel header with gradient */}
                    <div className="px-4 py-3 border-b border-[#F5F5F5] bg-gray-50/50 flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-semibold text-gray-900">素材库</span>
                      <span className={cn(
                        'ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold',
                        selectedAssets.size >= 3
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-500',
                      )}>
                        {selectedAssets.size} / 5
                      </span>
                    </div>
                    <div className="p-4">
                      <AssetGrid
                        selectedAssets={selectedAssets}
                        onToggle={(id) =>
                          dispatch({ type: 'TOGGLE_ASSET', payload: id })
                        }
                        compact
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardAdsgo>
        )}

        {!busy.analyzing && (
          <StickyFooter
            left={
              <>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        i < filledCount ? 'bg-primary-500' : 'bg-gray-200',
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  已完成 {filledCount}/3 必填项
                </span>
                {selectedAssets.size >= 3 && (
                  <span className="text-xs text-primary-600 font-medium">
                    · 素材 {selectedAssets.size} 张已选
                  </span>
                )}
              </>
            }
          >
            <BtnPrimary
              type="button"
              onClick={handleGenerateScripts}
              disabled={!canGenerateScripts}
              loading={busy.scripting}
            >
              <Sparkles className="w-4 h-4" />
              确认并生成脚本
            </BtnPrimary>
          </StickyFooter>
        )}
      </div>
    </StepTransition>
  );
}
