import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const sizeMap = {
  sm: 'max-w-[360px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
}

const Drawer = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  size = 'md',
  showClose = true,
  children,
  footer,
  className = '',
}) => {
  const panelRef = useRef(null)
  const prevOpen = useRef(isOpen)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Focus trap: focus panel on open
  useEffect(() => {
    if (isOpen && !prevOpen.current && panelRef.current) {
      panelRef.current.focus()
    }
    prevOpen.current = isOpen
  }, [isOpen])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose?.()
  }, [onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex justify-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`
          relative flex flex-col w-full bg-white shadow-2xl
          animate-slide-in-right
          outline-none
          ${sizeMap[size] || sizeMap.md}
          ${className}
        `.trim()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-neutral-100">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="font-heading text-h2 font-semibold text-neutral-900 truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="
                  shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                  text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600
                  transition-colors duration-fast
                "
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
export default Drawer
