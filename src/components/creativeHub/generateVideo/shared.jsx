import { Check, Plus } from 'lucide-react';
import { cn, FieldLabel } from './ui';
import { ASSET_LIBRARY } from './mock';

export const CARD_SHADOW = 'shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]';

/** Pill chip for style/setting selectors */
export function Pill({ active, children, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        disabled
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'cursor-pointer',
        !disabled && active
          ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm'
          : !disabled && 'bg-white text-gray-700 border-gray-200 hover:bg-primary-50/30 hover:border-primary-200 hover:text-primary-600',
      )}
    >
      {children}
    </button>
  );
}

/** Form field wrapper with label + optional hint */
export function FormField({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-end justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        {hint ? <span className="text-xs text-gray-500 shrink-0">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

/** Step page header with title, description, and optional action slot */
export function StepPageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary-500 to-primary-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/** Asset grid for creative material selection */
export function AssetGrid({ selectedAssets, onToggle, compact = false }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">创意素材资源</h4>
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold',
          selectedAssets.size >= 3
            ? 'bg-primary-50 text-primary-600'
            : 'bg-gray-100 text-gray-500',
        )}>
          {selectedAssets.size} / 5
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        选择 3–5 张不同角度图片，生成效果会更好。若包含人物模特图，生成时将优先参考。
      </p>
      <div
        className={cn(
          'grid',
          compact ? 'grid-cols-2 gap-2' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3',
        )}
      >
        <button
          type="button"
          className={cn(
            'aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 transition-all',
            'hover:border-primary-300 hover:bg-primary-50/30 text-gray-400 hover:text-primary-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          )}
        >
          <Plus className={cn(compact ? 'w-4 h-4' : 'w-5 h-5')} />
          <span className={cn('font-medium', compact ? 'text-[10px]' : 'text-xs')}>上传</span>
        </button>
        {ASSET_LIBRARY.map((a) => {
          const checked = selectedAssets.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              title={a.name}
              className={cn(
                'relative rounded-lg border overflow-hidden text-left transition-all group',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                checked
                  ? 'border-primary-300 ring-1 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300',
              )}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={a.src}
                  alt=""
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-300',
                    'group-hover:scale-105',
                  )}
                />
                {checked && (
                  <div className="absolute inset-0 bg-primary-500/25" />
                )}
              </div>
              <div className="absolute top-1.5 left-1.5">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                    compact && 'w-3.5 h-3.5',
                    checked
                      ? 'bg-primary-500 border-primary-500 shadow-sm'
                      : 'bg-white/90 border-gray-300',
                  )}
                >
                  {checked && (
                    <Check
                      className={cn('text-white', compact ? 'w-2.5 h-2.5' : 'w-3 h-3')}
                      strokeWidth={3}
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        已选 <span className="font-semibold text-gray-800">{selectedAssets.size}</span> / 5（至少 3 张可生成脚本）
      </p>
    </div>
  );
}
