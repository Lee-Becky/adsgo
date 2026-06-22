import { ChevronDown, ChevronUp, GripVertical, Play, Plus, RefreshCw } from 'lucide-react';
import { useWizard } from '../context';
import { runComposeFinal } from '../actions';
import {
  BtnDashed,
  BtnDefault,
  BtnPrimary,
  cn,
  GeneratingPanel,
  StatusTagProcessing,
  StepTransition,
  StickyFooter,
} from '../ui';
import { CARD_SHADOW, StepPageHeader } from '../shared';

const CONTENT_TITLE = '视频片段预览';

export default function Step6ClipPreview() {
  const { state, dispatch, busyRef } = useWizard();
  const { clips, clipsGenerating, busy } = state;

  const handleCompose = () => {
    if (!clips.length || clipsGenerating) return;
    runComposeFinal(dispatch, busyRef);
  };

  const addClipPlaceholder = () => {
    dispatch({
      type: 'ADD_CLIP',
      payload: {
        id: `clip_upload_${Date.now()}`,
        title: `分镜 ${clips.length + 1}（上传）`,
        thumb: `https://picsum.photos/seed/upload${Date.now()}/360/640`,
      },
    });
  };

  return (
    <StepTransition>
      <div className="space-y-5">
        <StepPageHeader
          title={
            <span className="flex items-center gap-3">
              {CONTENT_TITLE}
              {clipsGenerating && <StatusTagProcessing>片段生成中</StatusTagProcessing>}
            </span>
          }
          description="AI 已生成分镜视频，您可以预览、替换、调整顺序以及重新生成不满意的视频"
        />

        {clipsGenerating ? (
          <GeneratingPanel
            title="视频片段生成"
            message="AI 正在根据分镜关键帧与口播生成各段视频…"
            subMessage="预计 3–5 分钟（演示已缩短）"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  'rounded-xl border border-[#F0F0F0] overflow-hidden bg-white transition-all duration-300',
                  'hover:shadow-md hover:border-primary-200 hover:-translate-y-1',
                  CARD_SHADOW,
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[9/16] max-h-[320px] bg-neutral-100 overflow-hidden">
                  <img src={c.thumb} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center text-primary-600 shadow-lg">
                      <Play className="w-5 h-5 ml-0.5" />
                    </span>
                  </div>
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {i + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-white text-[10px] font-semibold">
                      {c.title}
                    </span>
                  </div>
                </div>

                {/* Bottom controls */}
                <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 truncate">
                      {c.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-neutral-50 hover:bg-primary-50 text-neutral-400 hover:text-primary-600 flex items-center justify-center transition-all"
                      aria-label="上移"
                      onClick={() =>
                        dispatch({ type: 'MOVE_CLIP', payload: { index: i, dir: -1 } })
                      }
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-neutral-50 hover:bg-primary-50 text-neutral-400 hover:text-primary-600 flex items-center justify-center transition-all"
                      aria-label="下移"
                      onClick={() =>
                        dispatch({ type: 'MOVE_CLIP', payload: { index: i, dir: 1 } })
                      }
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <BtnDefault
                      type="button"
                      className="px-2 py-1 text-[11px] shrink-0"
                      disabled
                    >
                      <RefreshCw className="w-3 h-3" />
                      重新生成
                    </BtnDefault>
                  </div>
                </div>
              </div>
            ))}

            {/* Add clip placeholder */}
            <BtnDashed
              onClick={addClipPlaceholder}
              className="min-h-[200px] w-full flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-primary-200 hover:border-primary-400 text-neutral-400 hover:text-primary-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">添加视频片段</span>
              <span className="text-xs font-normal opacity-70">支持手动上传</span>
            </BtnDashed>
          </div>
        )}
        <StickyFooter
          left={
            clips.length > 0
              ? <span className="text-xs">{clips.length} 个片段就绪</span>
              : <span className="text-xs text-neutral-400">等待片段生成…</span>
          }
        >
          <BtnPrimary
            type="button"
            onClick={handleCompose}
            disabled={!clips.length || clipsGenerating || busy.finalCompose}
            loading={busy.finalCompose}
          >
            <Play className="w-4 h-4" />
            合成最终成片视频
          </BtnPrimary>
        </StickyFooter>
      </div>
    </StepTransition>
  );
}
