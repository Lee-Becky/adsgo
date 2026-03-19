import { Check, CheckCircle2, RefreshCw } from 'lucide-react';
import { useWizard } from '../context';
import { selectActorAndAdvance } from '../actions';
import {
  BtnDefault,
  BtnPrimary,
  cn,
  GeneratingPanel,
  StepTransition,
  StickyFooter,
} from '../ui';
import { CARD_SHADOW, StepPageHeader } from '../shared';

export default function Step4ActorDesign() {
  const { state, dispatch } = useWizard();
  const { actors, selectedActorId, busy } = state;

  return (
    <StepTransition>
      <div className="space-y-5">
        <StepPageHeader
          title="数字演员选角"
          description="基于脚本角色设定，AI 生成了 3 位候选人，点击卡片选择"
        >
          <BtnDefault type="button" disabled className="shrink-0">
            <RefreshCw className="w-4 h-4" />
            重新设计人物形象
          </BtnDefault>
        </StepPageHeader>

        {busy.matching && actors.length === 0 ? (
          <GeneratingPanel
            title="人物形象匹配中"
            message="正在根据脚本角色设定匹配数字演员与场景…"
            subMessage="请稍候"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actors.map((a, idx) => {
              const isSelected = selectedActorId === a.id;
              const traits = a.desc.split(',').map((t) => t.trim());
              return (
                <div
                  key={a.id}
                  className={cn(
                    'text-left rounded-xl border overflow-hidden transition-all duration-300 group',
                    CARD_SHADOW,
                    'hover:-translate-y-1 hover:shadow-md',
                    isSelected
                      ? 'border-primary-500 shadow-primary-focus'
                      : 'border-[#F0F0F0] hover:border-primary-200',
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Top gradient bar for selected */}
                  <div
                    className={cn(
                      'h-1 transition-all duration-300',
                      isSelected
                        ? 'bg-gradient-to-r from-primary-500 to-primary-400'
                        : 'bg-transparent',
                    )}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: 'SELECT_ACTOR', payload: a.id })
                    }
                    className="w-full text-left focus:outline-none"
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      <img
                        src={a.cover}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Bottom gradient overlay */}
                      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                      {/* Name on overlay */}
                      <span className="absolute bottom-3 left-4 text-sm font-bold text-white drop-shadow-sm">
                        {a.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-3 left-3">
                          <CheckCircle2
                            className="w-6 h-6 text-primary-500 drop-shadow-sm"
                            fill="white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-white">
                      {/* Trait chips with alternating colors */}
                      <div className="flex flex-wrap gap-1.5">
                        {traits.map((trait, i) => (
                          <span
                            key={trait}
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium',
                              i % 2 === 0
                                ? 'bg-primary-50 text-primary-600'
                                : 'bg-gray-100 text-gray-600',
                            )}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Bottom accent bar */}
                  <div
                    className={cn(
                      'h-0.5 transition-all duration-300',
                      isSelected ? 'bg-primary-500' : 'bg-transparent',
                    )}
                  />

                </div>
              );
            })}
          </div>
        )}

        {actors.length > 0 && (
          <StickyFooter
            left={
              selectedActorId
                ? <span className="text-xs text-primary-600 font-medium">已选择演员，点击右侧确认</span>
                : <span className="text-xs text-gray-400">请从上方选择一位演员</span>
            }
          >
            <BtnPrimary
              type="button"
              onClick={() => selectActorAndAdvance(dispatch, selectedActorId)}
              disabled={!selectedActorId}
            >
              <Check className="w-4 h-4" />
              确认选择此人物
            </BtnPrimary>
          </StickyFooter>
        )}
      </div>
    </StepTransition>
  );
}
