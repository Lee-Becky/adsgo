import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'

/* ── Type config ────────────────────────────────────────────── */
const typeConfig = {
  success: {
    Icon: CheckCircle2,
    border: 'border-l-success-500',
    icon:   'text-success-500',
    progress: 'bg-success-500',
  },
  error: {
    Icon: AlertCircle,
    border: 'border-l-danger-500',
    icon:   'text-danger-500',
    progress: 'bg-danger-500',
  },
  warning: {
    Icon: AlertTriangle,
    border: 'border-l-warning-500',
    icon:   'text-warning-500',
    progress: 'bg-warning-500',
  },
  info: {
    Icon: Info,
    border: 'border-l-info-500',
    icon:   'text-info-500',
    progress: 'bg-info-500',
  },
  luna: {
    Icon: Sparkles,
    border: '', // handled via inline gradient
    icon:   'text-luna-violet',
    progress: 'bg-luna-violet',
  },
}

/* ── Toast ID counter ───────────────────────────────────────── */
let toastId = 0

/* ── Context ────────────────────────────────────────────────── */
const ToastContext = createContext(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/* ── Provider ───────────────────────────────────────────────── */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({
    type = 'info',
    title,
    message,
    duration = 5000,
    action,
  }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, title, message, duration, action, createdAt: Date.now() }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /* Convenience API -- backward-compat with existing toast(string) usage */
  const toast = useCallback(
    (opts) => addToast(typeof opts === 'string' ? { message: opts } : opts),
    [addToast],
  )
  toast.success = (msg) => addToast({ type: 'success', message: msg })
  toast.error   = (msg) => addToast({ type: 'error',   message: msg })
  toast.warning = (msg) => addToast({ type: 'warning', message: msg })
  toast.info    = (msg) => addToast({ type: 'info',    message: msg })
  toast.luna    = (msg) => addToast({ type: 'luna',    message: msg })

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed left-4 right-4 top-4 z-[10000] flex flex-col items-end gap-2 sm:left-auto">
          {toasts.map((t) => (
            <ToastItem
              key={t.id}
              toast={t}
              onDismiss={() => removeToast(t.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

/* ── Single toast item ──────────────────────────────────────── */
const ToastItem = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false)
  const progressRef = useRef(null)

  const cfg = typeConfig[toast.type] || typeConfig.info
  const Icon = cfg.Icon
  const isLuna = toast.type === 'luna'

  /* Auto-dismiss */
  useEffect(() => {
    if (toast.duration <= 0) return
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 200)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const handleClose = () => {
    setExiting(true)
    setTimeout(onDismiss, 200)
  }

  return (
    <div
      className={[
        'relative w-full max-w-[380px] bg-white rounded-lg overflow-hidden pointer-events-auto',
        'flex items-start gap-3 p-4',
        'shadow-lg border border-neutral-100',
        !isLuna ? `border-l-[3px] ${cfg.border}` : '',
        exiting ? 'animate-slide-out-right' : 'animate-slide-in-right',
      ].filter(Boolean).join(' ')}
      style={isLuna ? {
        borderLeft: '3px solid transparent',
        borderImage: 'var(--luna-gradient) 1',
      } : undefined}
    >
      {/* Icon */}
      <Icon size={18} className={`shrink-0 mt-0.5 ${cfg.icon}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-body font-semibold text-neutral-900 leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-body text-neutral-600 ${toast.title ? 'mt-0.5' : ''}`}>
            {toast.message}
          </p>
        )}
        {/* Action button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-caption font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-fast"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="shrink-0 p-1 rounded-sm text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors duration-fast"
      >
        <X size={14} />
      </button>

      {/* Auto-dismiss progress bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100">
          <div
            ref={progressRef}
            className={`h-full rounded-full ${cfg.progress}`}
            style={{
              animation: `toastProgress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Inline keyframes (only rendered once per mount, deduplicated by browser) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}} />
    </div>
  )
}

export default ToastProvider
