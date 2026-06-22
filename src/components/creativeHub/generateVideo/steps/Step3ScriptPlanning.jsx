import { RefreshCw, Sparkles } from 'lucide-react';
import { useWizard } from '../context';
import { runGenerateScripts, selectScriptAndMatch } from '../actions';
import {
  AlertInfo,
  BtnDefault,
  BtnPrimary,
  cn,
  GeneratingPanel,
  StepTransition,
  StickyFooter,
} from '../ui';
import { CARD_SHADOW, StepPageHeader } from '../shared';

const BAR_COLORS = ['from-primary-500 to-primary-400', 'from-primary-400 to-primary-300', 'from-primary-300 to-primary-200'];

export default function Step3ScriptPlanning() {
  const { state, dispatch, busyRef } = useWizard();
  const { scripts, selectedScriptId, busy } = state;

  const handleRegenerate = () => {
    dispatch({ type: 'TOGGLE_STYLE', payload: '' });
    runGenerateScripts(dispatch, state, busyRef);
  };

  const handleSelectScript = (scriptId) => {
    selectScriptAndMatch(dispatch, state, busyRef, scriptId);
  };

  return (
    <StepTransition>
      <div className="space-y-5">
        <StepPageHeader
          title="选择视频创意脚本"
          description="选择最符合目标的一套脚本，进入人物形象设计。"
        >
          <BtnDefault
            type="button"
            disabled={busy.scripting}
            onClick={handleRegenerate}
            className="shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            重新生成脚本
          </BtnDefault>
        </StepPageHeader>

        <AlertInfo title="消耗说明">
          每生成一批脚本将按账户策略扣减创意点数；失败自动退回。此处为前端模拟，无真实扣费。
        </AlertInfo>

        {busy.scripting && scripts.length === 0 ? (
          <GeneratingPanel
            title="创意脚本生成中"
            message="正在基于您的商品信息、素材与风格参数生成 3 套脚本…"
            subMessage="预计 1–2 分钟（演示已缩短）"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scripts.map((s, idx) => {
              const isSelected = selectedScriptId === s.id;
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => dispatch({ type: 'SELECT_SCRIPT', payload: s.id })}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    dispatch({ type: 'SELECT_SCRIPT', payload: s.id })
                  }
                  className={cn(
                    'rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col',
                    CARD_SHADOW,
                    'hover:-translate-y-1 hover:shadow-md',
                    isSelected
                      ? 'border-primary-500 shadow-primary-focus bg-primary-50/20'
                      : 'border-[#F0F0F0] hover:border-primary-200',
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Top gradient bar */}
                  <div className={cn('h-1 bg-gradient-to-r', BAR_COLORS[idx % 3])} />

                  <div className="flex flex-1">
                    <div className="p-5 flex flex-col flex-1">
                      {/* Style badge + selected indicator */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100/80 text-primary-600">
                          {s.style}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-step-enter">
                            已选
                          </span>
                        )}
                      </div>

                      {/* Title with timestamp badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-900 text-white">
                          0-8S
                        </span>
                        <span className="text-sm font-bold text-neutral-900">{s.title}</span>
                      </div>

                      {/* Script body */}
                      <pre className="mt-3 text-sm text-neutral-600 whitespace-pre-wrap font-sans leading-relaxed flex-1">
                        {s.body}
                      </pre>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {scripts.length > 0 && !busy.scripting && (
          <StickyFooter
            left={
              selectedScriptId
                ? <span className="text-xs text-primary-600 font-medium">已选择脚本，点击右侧确认</span>
                : <span className="text-xs text-neutral-400">请从上方选择一套脚本</span>
            }
          >
            <BtnPrimary
              type="button"
              onClick={() => handleSelectScript(selectedScriptId)}
              disabled={!selectedScriptId}
              loading={busy.matching}
            >
              <Sparkles className="w-4 h-4" />
              确认此脚本
            </BtnPrimary>
          </StickyFooter>
        )}
      </div>
    </StepTransition>
  );
}
