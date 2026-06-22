import { Sparkles, Check } from 'lucide-react';
import { CHAT_TEMPLATES } from '../constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TEMPLATE_CATEGORIES = ['Recommended', 'Minimal', 'Lifestyle', 'Bold', 'Fashion', 'E-Commerce', 'Sale', 'Product'];

export default function StepConfirmTemplate({
  chatTemplateCategory,
  chatSelectedTemplates,
  onSetTemplateCategory,
  onToggleTemplate,
  onConfirmStep,
  onChangeStep,
}) {
  const filteredTemplates = chatTemplateCategory === 'Recommended'
    ? CHAT_TEMPLATES.filter(t => t.recommended)
    : CHAT_TEMPLATES.filter(t => t.style === chatTemplateCategory);

  const selectedList = [...chatSelectedTemplates];
  const hasSelection = selectedList.length > 0;

  return (
    <div className="w-[520px] space-y-4">
      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {TEMPLATE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSetTemplateCategory(cat)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[13px] font-medium transition-all border shrink-0',
              chatTemplateCategory === cat
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-600'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-5 gap-2">
        {filteredTemplates.map((tmpl, i) => {
          const key = `${tmpl.style}-${i}-${tmpl.url}`;
          const isSelected = chatSelectedTemplates.has(key);
          return (
            <button
              key={key}
              onClick={() => onToggleTemplate(key)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                isSelected
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-transparent hover:border-neutral-300'
              )}
            >
              <img src={tmpl.url} alt="" className="w-full h-full object-cover" />
              {isSelected && (
                <div className="absolute inset-0 bg-primary-500/10 flex items-end justify-end p-1">
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
              {tmpl.recommended && (
                <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-bold bg-primary-500 text-white leading-none">
                  Rec
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA row */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onChangeStep(2)}
          className="px-6 h-10 bg-white border border-neutral-300 text-neutral-700 rounded-full text-sm font-medium hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500 transition-all"
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          {/* AI Auto-Generate option */}
          {!hasSelection && (
            <button
              onClick={() => onConfirmStep(3)}
              className="flex items-center gap-2 px-4 h-10 bg-white border border-neutral-200 rounded-full text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-600 transition-all"
            >
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                <Sparkles size={11} className="text-white" />
              </div>
              AI Auto-Generate
            </button>
          )}

          <button
            onClick={() => onConfirmStep(3)}
            className="flex items-center gap-2 px-6 h-10 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 shadow-sm shadow-primary-500/20 transition-all"
          >
            {hasSelection ? (
              <>
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles size={11} className="text-white" />
                </div>
                {selectedList.length === 1 ? 'Use This Template' : `Use These ${selectedList.length} Templates`}
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
