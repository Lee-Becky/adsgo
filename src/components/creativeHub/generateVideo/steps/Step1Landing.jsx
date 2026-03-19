import { CheckCircle2, Link2, Play, Sparkles } from 'lucide-react';
import { useWizard } from '../context';
import { runAnalyze } from '../actions';
import { VIDEO_EXAMPLES, VIDEO_TYPES, LANG_OPTIONS } from '../mock';
import {
  BtnLink,
  BtnPrimary,
  cn,
  InputAdsgo,
  PillTabs,
  SelectAdsgo,
  StepTransition,
  TextareaAdsgo,
} from '../ui';
import { CARD_SHADOW, FormField } from '../shared';

export default function Step1Landing() {
  const { state, dispatch, busyRef } = useWizard();
  const { inputMode, url, videoTypeId, form, busy } = state;

  const handleAnalyze = () => runAnalyze(dispatch, state, busyRef);

  return (
    <StepTransition>
      <div className="flex flex-col items-center pt-4 pb-6">
        {/* Hero section with brand gradient */}
        <div className="w-full flex flex-col items-center py-8 -mt-4 mb-2 rounded-2xl bg-gradient-to-b from-primary-50 via-primary-50/50 to-transparent">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold border border-primary-100 shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            快速生成高转化电商带货视频
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center leading-snug">
            开启您的 AI 营销视频生成
          </h1>
          <p className="text-sm text-gray-600 mt-3 text-center max-w-lg leading-relaxed">
            输入商品链接，AI 自动分析商品信息、生成脚本、匹配数字人，一键合成短视频。
          </p>
        </div>

        {/* Video type cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-3xl">
          {VIDEO_TYPES.map((vt) => {
            const selected = videoTypeId === vt.id;
            return (
              <button
                key={vt.id}
                type="button"
                onClick={() => dispatch({ type: 'SET_VIDEO_TYPE', payload: vt.id })}
                className={cn(
                  'relative text-left rounded-xl border overflow-hidden transition-all duration-300 group',
                  CARD_SHADOW,
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                  'hover:-translate-y-1 hover:shadow-md',
                  selected
                    ? 'border-primary-500 shadow-primary-focus bg-primary-50/20'
                    : 'border-[#F0F0F0] hover:border-primary-200',
                )}
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={vt.cover}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {selected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-6 h-6 text-primary-500 drop-shadow-sm" fill="white" />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-sm font-bold text-gray-900">{vt.title}</div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{vt.desc}</p>
                </div>
                {/* Bottom accent bar */}
                <div
                  className={cn(
                    'h-1 transition-all duration-300',
                    selected
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400'
                      : 'bg-gradient-to-r from-gray-200 to-gray-100',
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Input mode toggle */}
        <div className="mt-10 mb-4">
          <PillTabs
            tabs={[
              { id: 'url', label: 'URL 链接分析' },
              { id: 'manual', label: '手动输入信息' },
            ]}
            activeId={inputMode}
            onChange={(id) => dispatch({ type: 'SET_INPUT_MODE', payload: id })}
          />
        </div>

        {/* URL input mode — gradient border wrapper */}
        {inputMode === 'url' ? (
          <div className="w-full max-w-3xl bg-gradient-to-r from-primary-300/50 via-primary-200/30 to-primary-300/50 p-px rounded-2xl">
            <div className="bg-white rounded-[15px] p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <InputAdsgo
                    value={url}
                    onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
                    placeholder="请输入商品或者品牌的 URL 链接..."
                    className="pl-10 py-3 text-base"
                  />
                </div>
                <BtnLink
                  type="button"
                  className="shrink-0 whitespace-nowrap"
                  onClick={() =>
                    dispatch({
                      type: 'SET_URL',
                      payload: 'https://example.com/products/wireless-headphones',
                    })
                  }
                >
                  尝试 URL 示例
                </BtnLink>
                <BtnPrimary
                  type="button"
                  onClick={handleAnalyze}
                  loading={busy.analyzing}
                  className="shrink-0 px-8 py-3 rounded-xl text-base shadow-lg shadow-primary-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  开始创作视频
                  <Sparkles className="w-4 h-4 ml-1" />
                </BtnPrimary>
              </div>
            </div>
          </div>
        ) : (
          /* Manual input mode — gradient border wrapper */
          <div className="w-full max-w-3xl bg-gradient-to-r from-primary-300/50 via-primary-200/30 to-primary-300/50 p-px rounded-2xl">
            <div className="bg-white rounded-[15px] p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="商品名称">
                  <InputAdsgo
                    value={form.productName}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FORM', payload: { productName: e.target.value } })
                    }
                    placeholder="品牌或商品名称"
                  />
                </FormField>
                <FormField label="输出语种">
                  <SelectAdsgo
                    value={form.lang}
                    options={LANG_OPTIONS}
                    onChange={(v) => dispatch({ type: 'UPDATE_FORM', payload: { lang: v } })}
                    placeholder="请选择输出语种"
                  />
                </FormField>
                <FormField label="目标用户">
                  <TextareaAdsgo
                    value={form.audience}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FORM', payload: { audience: e.target.value } })
                    }
                    placeholder="描述您的目标受众"
                  />
                </FormField>
                <FormField label="核心卖点">
                  <TextareaAdsgo
                    value={form.coreSelling}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FORM', payload: { coreSelling: e.target.value } })
                    }
                    placeholder="输入产品核心卖点"
                  />
                </FormField>
              </div>
              <div className="flex justify-end">
                <BtnPrimary
                  type="button"
                  onClick={handleAnalyze}
                  loading={busy.analyzing}
                  className="px-8 py-3 rounded-xl text-base shadow-lg shadow-primary-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  开始创作视频
                  <Sparkles className="w-4 h-4 ml-1" />
                </BtnPrimary>
              </div>
            </div>
          </div>
        )}

        {/* Video examples */}
        <div className="w-full max-w-4xl mt-14">
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">视频案例</h3>
              <span className="text-xs text-gray-500">看看其他商家用 AI 生成的短视频效果</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {VIDEO_EXAMPLES.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={cn(
                    'rounded-xl border border-[#F0F0F0] overflow-hidden bg-white group cursor-pointer transition-all duration-300',
                    'hover:shadow-md hover:border-primary-200 hover:-translate-y-1',
                    CARD_SHADOW,
                  )}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="relative aspect-[9/16] bg-gray-100">
                    <img src={ex.thumb} alt={ex.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-primary-600 shadow-lg">
                        <Play className="w-4 h-4 ml-0.5" />
                      </span>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white text-[10px] font-medium">
                      {ex.duration}
                    </span>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-800 truncate">{ex.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StepTransition>
  );
}
