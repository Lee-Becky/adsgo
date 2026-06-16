import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle2,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
}

const borderColors = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  warning: 'border-l-amber-500',
  info:    'border-l-primary-500',
}

const iconColors = {
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-primary-500',
}

let toastId = 0

const ToastContext = createContext(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, title, message, duration, createdAt: Date.now() }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((opts) => addToast(typeof opts === 'string' ? { message: opts } : opts), [addToast])
  toast.success = (msg) => addToast({ type: 'success', message: msg })
  toast.error = (msg) => addToast({ type: 'error', message: msg })
  toast.warning = (msg) => addToast({ type: 'warning', message: msg })
  toast.info = (msg) => addToast({ type: 'info', message: msg })

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map((t, i) => (
            <ToastItem
              key={t.id}
              toast={t}
              index={i}
              total={toasts.length}
              onDismiss={() => removeToast(t.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

const ToastItem = ({ toast, index, total, onDismiss }) => {
  const [exiting, setExiting] = useState(false)
  const Icon = icons[toast.type] || icons.info

  useEffect(() => {
    if (toast.duration <= 0) return
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 200)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const isStacked = index < total - 1

  return (
    <div
      className={`
        w-[360px] bg-white rounded-xl shadow-lg border-l-4 p-4 pointer-events-auto
        flex items-start gap-3
        ${borderColors[toast.type] || borderColors.info}
        ${exiting ? 'animate-[toastOut_200ms_ease-in_forwards]' : 'animate-[toastIn_250ms_ease-out]'}
        ${isStacked ? 'scale-[0.98] opacity-80' : ''}
        transition-all duration-150
      `}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(onDismiss, 200) }}
        className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>

      {/* Auto-dismiss progress bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-300 rounded-full"
            style={{
              animation: `toastProgress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(50%); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  )
}

export default ToastProvider
