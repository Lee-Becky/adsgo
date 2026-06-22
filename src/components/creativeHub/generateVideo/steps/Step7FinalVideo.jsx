import { Download, Play, RefreshCw, Share2 } from 'lucide-react';
import { useWizard } from '../context';
import { SCENE_THUMBNAILS } from '../mock';
import {
  AlertSuccess,
  BtnDefault,
  BtnPrimary,
  cn,
  MetricTile,
  StepTransition,
  StickyFooter,
} from '../ui';
import { CARD_SHADOW } from '../shared';

export default function Step7FinalVideo() {
  const { state, dispatch, derived } = useWizard();
  const { step5, sourceUrl, finalVideoUrl, finalGeneratedAt } = state;
  const { finalMeta } = derived;

  const handleReset = () => dispatch({ type: 'RESET_ALL' });

  return (
    <StepTransition>
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-neutral-900 mb-1">最终成片</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Video player + scene thumbnails */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-neutral-900 via-primary-900/30 to-neutral-900 overflow-hidden flex items-center justify-center p-8 min-h-[400px] relative ring-1 ring-primary-500/10">
              <div className="w-full max-w-[260px] aspect-[9/16] rounded-xl bg-black border border-neutral-700/50 flex flex-col items-center justify-center text-white gap-4 relative group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 ring-2 ring-white/10">
                  <Play className="w-8 h-8 opacity-90 ml-1" />
                </div>
                <p className="text-xs text-neutral-400 px-4 text-center">
                  点击播放成片视频
                </p>
                <p className="text-[10px] text-neutral-600 px-4 text-center break-all">
                  {finalVideoUrl}
                </p>
              </div>
            </div>

            {/* Scene thumbnails */}
            <div className="flex gap-3">
              {SCENE_THUMBNAILS.map((sc) => (
                <div
                  key={sc.id}
                  className={cn(
                    'rounded-lg border border-[#F0F0F0] overflow-hidden flex-1 transition-all duration-300 hover:shadow-md',
                    CARD_SHADOW,
                  )}
                >
                  <img
                    src={sc.src}
                    alt={sc.label}
                    className="w-full aspect-video object-cover"
                  />
                  <p className="text-[10px] text-neutral-500 text-center py-1.5 font-medium bg-neutral-50">
                    {sc.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="space-y-5">
            <AlertSuccess title="视频生成完成！">
              您的 AI 营销视频已准备就绪，可以下载或分享。
            </AlertSuccess>

            {finalGeneratedAt && (
              <p className="text-xs text-neutral-500">
                生成时间：{finalGeneratedAt.toLocaleString('zh-CN')}
              </p>
            )}

            {/* Metric tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {finalMeta.map((m) => (
                <MetricTile key={m.label} label={m.label} value={m.value} />
              ))}
            </div>

            {sourceUrl && (
              <div className="text-xs">
                <span className="text-neutral-500">来源：</span>
                <a
                  href={sourceUrl}
                  className="text-primary-600 hover:text-primary-700 font-medium break-all"
                  target="_blank"
                  rel="noreferrer"
                >
                  {sourceUrl}
                </a>
              </div>
            )}

            {/* Voiceover review with brand accent */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <h4 className="text-xs font-semibold text-neutral-500 mb-2 tracking-wider">
                口播文案
              </h4>
              <p className="text-sm text-neutral-800 leading-relaxed">{step5.voiceover}</p>
            </div>

          </div>
        </div>

        <StickyFooter
          left={
            <BtnDefault type="button" onClick={handleReset}>
              <RefreshCw className="w-4 h-4" />
              重新创建新视频
            </BtnDefault>
          }
        >
          <BtnDefault type="button" disabled>
            <Share2 className="w-4 h-4" />
            分享视频
          </BtnDefault>
          <BtnPrimary
            type="button"
            onClick={() =>
              window.open(finalVideoUrl, '_blank', 'noopener,noreferrer')
            }
            disabled={!finalVideoUrl}
          >
            <Download className="w-4 h-4" />
            下载视频
          </BtnPrimary>
        </StickyFooter>
      </div>
    </StepTransition>
  );
}
