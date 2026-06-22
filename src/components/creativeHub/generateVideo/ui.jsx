/**
 * AdsGo UI Skill 对齐的局部基元（buttons / forms / navigation / feedback）
 * 参考：SKILL.md、components-core、components-forms、components-navigation、components-feedback
 */
import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, ChevronLeft, Info, Loader2 } from 'lucide-react';
import { getNextModalZIndex } from '../../../constants/zIndex';

export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** Primary — components-core §1 */
export function BtnPrimary({ children, className, loading, disabled, loadingText, ...props }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      {...props}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 transition-all inline-flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        loading && 'bg-primary-400 text-white cursor-wait',
        !loading && !isDisabled && 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        isDisabled && !loading && 'bg-neutral-100 text-neutral-400 border border-neutral-200 shadow-none cursor-not-allowed',
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white shrink-0" />
          {loadingText || '请稍候…'}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Default (outline) — components-core §1 */
export function BtnDefault({ children, className, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium shadow-sm transition-all',
        'hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500 active:bg-neutral-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:shadow-none disabled:cursor-not-allowed inline-flex items-center justify-center gap-2',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Text — components-core §1 */
export function BtnText({ children, className, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'px-4 py-2 bg-transparent text-neutral-700 rounded-lg text-sm font-medium transition-all',
        'hover:bg-neutral-100 active:bg-neutral-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Link — components-core §1 */
export function BtnLink({ children, className, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'px-4 py-2 bg-transparent text-primary-500 rounded-lg text-sm font-medium transition-colors',
        'hover:text-primary-600 active:text-primary-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Dashed — 用于「添加」类 — components-core §1 */
export function BtnDashed({ children, className, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'px-4 py-2 bg-white border border-dashed border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium transition-all',
        'hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Label — components-forms §4 */
export function FieldLabel({ children, htmlFor, className }) {
  return (
    <label htmlFor={htmlFor} className={cn('text-sm font-medium text-neutral-700', className)}>
      {children}
    </label>
  );
}

export function FieldHint({ children }) {
  return <p className="text-xs text-neutral-500 mt-1.5">{children}</p>;
}

/** 输入 — components-forms §4 */
export function InputAdsgo(props) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={cn(
        'w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 placeholder:text-neutral-400 transition-all',
        'hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        className,
      )}
    />
  );
}

export function TextareaAdsgo(props) {
  const { className, rows = 3, ...rest } = props;
  return (
    <textarea
      rows={rows}
      {...rest}
      className={cn(
        'w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 placeholder:text-neutral-400 transition-all resize-none',
        'hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        className,
      )}
    />
  );
}

/**
 * 下拉 — components-forms §6 absolute 变体（可滚动容器内）
 * 动态 z-index：getNextModalZIndex
 */
export function SelectAdsgo({ value, options, onChange, placeholder = '请选择', className }) {
  const [open, setOpen] = useState(false);
  const [z, setZ] = useState(1000);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const openMenu = () => {
    setZ(getNextModalZIndex());
    setOpen((o) => !o);
  };

  return (
    <div className={cn('relative', className)} ref={wrapRef}>
      <button
        type="button"
        onClick={openMenu}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm text-neutral-700 transition-all',
          open ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-neutral-300 hover:border-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn('w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ zIndex: z }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm transition-colors',
                opt === value ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-700 hover:bg-neutral-50',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Toggle — components-forms §9 */
export function ToggleAdsgo({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group w-full">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-5 rounded-full transition-colors shrink-0',
          checked ? 'bg-primary-500' : 'bg-neutral-200 group-hover:bg-neutral-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </label>
  );
}

/** Line Tabs — components-navigation §13 */
export function LineTabs({ tabs, activeId, onChange, className }) {
  return (
    <div className={cn('border-b border-neutral-200', className)}>
      <nav className="flex space-x-6">
        {tabs.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors -mb-px',
                active ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
              )}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/** Pill Tabs — components-navigation §14 */
export function PillTabs({ tabs, activeId, onChange, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-xl bg-neutral-100/80 border border-neutral-200/50',
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              'relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              active
                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/[0.04]'
                : 'text-neutral-400 hover:text-neutral-600',
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Status tag — components-feedback §27 Processing */
export function StatusTagProcessing({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary-50 text-primary-700 border-primary-200">
      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-1.5" />
      {children}
    </span>
  );
}

export function StatusTagSuccess({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-success-50 text-success-700 border-success-200">
      <span className="w-1.5 h-1.5 rounded-full bg-success-500 mr-1.5" />
      {children}
    </span>
  );
}

/** Success alert — components-feedback §26 */
export function AlertSuccess({ title, children }) {
  return (
    <div className="p-4 rounded-xl border flex items-start gap-3 bg-success-50 border-success-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-success-800">{title}</h4>
        {children && <p className="text-sm mt-1 text-success-600">{children}</p>}
      </div>
    </div>
  );
}

/** Info alert — components-feedback §26 */
export function AlertInfo({ title, children }) {
  return (
    <div className="p-4 rounded-xl border flex items-start gap-3 bg-primary-50 border-primary-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-primary-800">{title}</h4>
        {children && <p className="text-sm mt-1 text-primary-600">{children}</p>}
      </div>
    </div>
  );
}

/** Metric Card — components-core §2 */
export function MetricTile({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1 truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

/**
 * Steps / Progress Indicator — components-navigation §15
 * Circle nodes (w-8 h-8) + connecting lines + bottom labels.
 * Three states: completed (primary bg + check), current (primary ring), future (gray border).
 */
export function FlowStepper({ steps, activeStep, maxReached, onStepClick, onGoBack }) {
  return (
    <div className="flex items-center flex-1 min-w-0 overflow-x-auto scrollbar-hide">
      {onGoBack && activeStep > 1 && (
        <button
          type="button"
          onClick={onGoBack}
          className="shrink-0 flex items-center gap-1 px-2 py-1 mr-2 rounded-md text-xs text-neutral-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          返回
        </button>
      )}
      <div className="flex items-center flex-1 min-w-0">
        {steps.map((s, idx) => {
          const reached = maxReached >= s.id;
          const current = activeStep === s.id;
          const done = reached && activeStep > s.id;
          const clickable = reached && s.id !== activeStep;
          const isLast = idx === steps.length - 1;

          return (
            <div key={s.id} className="flex items-center min-w-0">
              {/* Step node: circle + inline label */}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(s.id)}
                className={cn(
                  'flex items-center gap-1.5 shrink-0 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                  clickable && 'cursor-pointer hover:bg-primary-50/60',
                  !clickable && 'cursor-default',
                  current ? 'pr-2.5' : 'pr-1',
                )}
              >
                {/* Circle */}
                <span
                  className={cn(
                    'rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                    current
                      ? 'w-6 h-6 text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/30'
                      : 'w-5 h-5 text-[10px]',
                    done && !current && 'bg-primary-500 text-white',
                    !done && !current && 'border-2 border-neutral-200 text-neutral-400 bg-white',
                  )}
                >
                  {done ? <Check className="w-3 h-3" /> : s.id}
                </span>
                {/* Label — always visible on sm+, only current on mobile */}
                <span
                  className={cn(
                    'text-[11px] whitespace-nowrap leading-none transition-colors',
                    current ? 'inline' : 'hidden sm:inline',
                    done && 'text-primary-600 font-medium',
                    current && 'text-neutral-900 font-semibold',
                    !done && !current && 'text-neutral-400',
                  )}
                >
                  {s.bar}
                </span>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'w-4 sm:w-6 h-px mx-0.5 sm:mx-1 shrink-0 rounded-full transition-colors duration-500',
                    done ? 'bg-primary-300' : 'bg-neutral-200',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 卡片外壳 — components-core §2 */
export function CardAdsgo({ title, subtitle, children, right, footer, className, bodyClassName }) {
  return (
    <div className={cn('bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] transition-all duration-300 overflow-hidden', className)}>
      {(title || right) && (
        <div className="px-5 py-4 border-b border-[#F5F5F5] bg-neutral-50/50 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h3 className="font-semibold text-neutral-900 text-base">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
      {footer && <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">{footer}</div>}
    </div>
  );
}

/** 生成中卡片 — components-feedback §31 Card-Level Generation */
export function GeneratingPanel({ title, message, subMessage }) {
  return (
    <div className="rounded-xl border border-primary-200 bg-gradient-to-b from-primary-50/40 to-white overflow-hidden">
      <div className="px-5 py-4 border-b border-primary-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
          <Loader2 className="animate-spin h-4 w-4 text-primary-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          <p className="text-[11px] text-primary-500 font-medium">Generating...</p>
        </div>
      </div>
      <div className="p-6 flex flex-col items-center justify-center py-10">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
          <Loader2 className="animate-spin h-7 w-7 text-primary-500" />
        </div>
        <p className="text-sm text-neutral-700 font-medium text-center">{message}</p>
        {subMessage && <p className="text-xs text-neutral-400 mt-1">{subMessage}</p>}
        {/* Progress bar */}
        <div className="w-full max-w-xs mt-5">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-progress-indeterminate" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mt-5 w-full max-w-xs">
          <div className="aspect-square bg-neutral-100 rounded-lg animate-pulse" />
          <div className="aspect-square bg-neutral-100 rounded-lg animate-pulse" style={{ animationDelay: '0.15s' }} />
          <div className="aspect-square bg-neutral-100 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="aspect-square bg-neutral-100 rounded-lg animate-pulse" style={{ animationDelay: '0.45s' }} />
        </div>
      </div>
    </div>
  );
}

/** Step content animation wrapper */
export function StepTransition({ children }) {
  return (
    <div className="animate-step-enter">
      {children}
    </div>
  );
}

/** Fixed footer bar for step CTAs — always at viewport bottom */
export function StickyFooter({ left, children }) {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind the fixed footer */}
      <div className="h-16" />
      <div
        className="fixed bottom-0 right-0 z-[50] px-6 py-3 bg-white/95 backdrop-blur-sm border-t border-neutral-200 flex items-center justify-between gap-4 transition-all duration-300"
        style={{ left: 'var(--sidebar-w, 256px)' }}
      >
        <div className="flex items-center gap-3 min-w-0 text-sm text-neutral-500">
          {left}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      </div>
    </>
  );
}
