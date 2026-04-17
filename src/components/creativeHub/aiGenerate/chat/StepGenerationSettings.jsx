import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, RefreshCw, ArrowUpRight, Sparkles, Lock } from 'lucide-react';
import { CHAT_SUGGESTIONS, CHAT_IMG_RATIO_OPTIONS, CHAT_IMG_RATIO_MORE_OPTIONS, RatioBox } from '../constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function StepGenerationSettings({
  chatQuantity,
  chatRatios,
  chatRequirements,
  chatSuggestionPage,
  chatSelectedTemplates,
  onSetQuantity,
  onSetRatios,
  onSetRequirements,
  onSetSuggestionPage,
  onGenerate,
}) {
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [ratioOpen, setRatioOpen] = useState(false);
  const [ratioMoreOpen, setRatioMoreOpen] = useState(false);

  const currentRatio = [...chatRatios][0] ?? '1:1';
  const allRatioOptions = [...CHAT_IMG_RATIO_OPTIONS, ...CHAT_IMG_RATIO_MORE_OPTIONS];
  const currentRatioTip = allRatioOptions.find(r => r.v === currentRatio)?.tip ?? '';

  const handleSelectRatio = v => {
    onSetRatios(new Set([v]));
    setRatioOpen(false);
    setRatioMoreOpen(false);
  };

  const isMultiTemplate = chatSelectedTemplates.size > 1;

  const pageSuggestions = CHAT_SUGGESTIONS.slice(chatSuggestionPage * 3, chatSuggestionPage * 3 + 3);

  return (
    <div className="w-[520px] space-y-4">
      {/* Quantity + Ratio row */}
      <div className="flex gap-4">
        {/* Quantity */}
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium text-gray-700 block">Quantity</label>
          <div className="relative">
            {isMultiTemplate ? (
              <div className="relative group/locktip w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed select-none">
                <span>{chatSelectedTemplates.size} Image{chatSelectedTemplates.size > 1 ? 's' : ''}</span>
                <Lock size={13} className="text-gray-300" />
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover/locktip:block w-max max-w-[220px] bg-gray-900/90 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg leading-relaxed z-10">
                  <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900/90" />
                  As you chose {chatSelectedTemplates.size} templates, one image will be generated for each.
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setQuantityOpen(v => !v); setRatioOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all',
                    quantityOpen ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300'
                  )}
                >
                  <span>{chatQuantity} Image{chatQuantity > 1 ? 's' : ''}</span>
                  <ChevronDown size={14} className={cn('text-gray-400 transition-transform duration-200', quantityOpen && 'rotate-180')} />
                </button>
                {quantityOpen && (
                  <>
                    <div className="fixed inset-0" style={{ zIndex: 49 }} onClick={() => setQuantityOpen(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1" style={{ zIndex: 50 }}>
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          onClick={() => { onSetQuantity(val); setQuantityOpen(false); }}
                          className={cn(
                            'w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between',
                            chatQuantity === val ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {val} Image{val > 1 ? 's' : ''}
                          {chatQuantity === val && <Check size={13} className="text-primary-500 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Ratio */}
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium text-gray-700 block">Ratio</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => { setRatioOpen(v => !v); setQuantityOpen(false); }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all',
                ratioOpen ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300'
              )}
            >
              <span className="flex items-center gap-2">
                <RatioBox v={currentRatio} />
                <span className="font-medium">{currentRatio}</span>
                <span className="text-gray-400 text-xs">{currentRatioTip}</span>
              </span>
              <ChevronDown size={14} className={cn('text-gray-400 transition-transform duration-200', ratioOpen && 'rotate-180')} />
            </button>

            {ratioOpen && (
              <>
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 49 }}
                  onClick={() => { setRatioOpen(false); setRatioMoreOpen(false); }}
                />
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1" style={{ zIndex: 50 }}>
                  <div className="px-3 pt-1.5 pb-1">
                    <span className="text-xs font-medium text-gray-400">Commonly Used</span>
                  </div>
                  {CHAT_IMG_RATIO_OPTIONS.map(r => {
                    const isSelected = currentRatio === r.v;
                    return (
                      <button
                        key={r.v}
                        onClick={() => handleSelectRatio(r.v)}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2',
                          isSelected ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <RatioBox v={r.v} />
                        <span className="font-medium w-12 shrink-0">{r.v}</span>
                        <span className={cn('flex-1 text-xs', isSelected ? 'text-primary-400' : 'text-gray-400')}>{r.tip}</span>
                        {isSelected && <Check size={13} className="text-primary-500 shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="mx-2 my-1 border-t border-gray-100" />

                  {/* More Ratios flyout */}
                  <div className="relative">
                    <button
                      onClick={e => { e.stopPropagation(); setRatioMoreOpen(v => !v); }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between',
                        ratioMoreOpen ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <span className="font-medium">More Ratios</span>
                      <ChevronRight size={13} className={cn('transition-colors', ratioMoreOpen ? 'text-primary-400' : 'text-gray-400')} />
                    </button>
                    {ratioMoreOpen && (
                      <div
                        className="absolute bottom-0 left-full ml-1.5 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                        style={{ zIndex: 51 }}
                      >
                        <div className="px-3 pt-1.5 pb-1">
                          <span className="text-xs font-medium text-gray-400">More Ratios</span>
                        </div>
                        {CHAT_IMG_RATIO_MORE_OPTIONS.map(r => {
                          const isSelected = currentRatio === r.v;
                          return (
                            <button
                              key={r.v}
                              onClick={() => handleSelectRatio(r.v)}
                              className={cn(
                                'w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 whitespace-nowrap',
                                isSelected ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              <RatioBox v={r.v} />
                              <span className="font-medium w-12 shrink-0">{r.v}</span>
                              <span className={cn('flex-1 text-xs', isSelected ? 'text-primary-400' : 'text-gray-400')}>{r.tip}</span>
                              {isSelected && <Check size={13} className="text-primary-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Additional requirements */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Additional Requirements <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
        </div>
        <textarea
          placeholder="e.g. add a discount badge, holiday feel..."
          value={chatRequirements}
          onChange={e => onSetRequirements(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
        />

        {/* Suggestion chips */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-gray-400">Suggested</span>
          <button
            onClick={() => onSetSuggestionPage(p => (p + 1) % Math.ceil(CHAT_SUGGESTIONS.length / 3))}
            className="p-1 rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw size={12} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pageSuggestions.map(s => (
            <button
              key={s}
              onClick={() => onSetRequirements(s)}
              className="group px-2.5 py-1 rounded-full text-sm font-normal bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all inline-flex items-center gap-1.5"
            >
              <span>{s}</span>
              <ArrowUpRight size={12} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-6 h-10 bg-primary-500 text-white text-sm font-semibold rounded-full hover:bg-primary-600 active:bg-primary-700 shadow-sm shadow-primary-500/20 whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <Sparkles size={14} />
          Start Generation
        </button>
      </div>
    </div>
  );
}
