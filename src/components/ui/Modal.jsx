import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const sizeMap = {
  sm:   'max-w-modal-sm',   // 400px
  md:   'max-w-modal-md',   // 560px
  lg:   'max-w-modal-lg',   // 720px
  xl:   'max-w-modal-xl',   // 960px
  full: 'max-w-[90vw]',
}

/* ── Focus trap helper ────────────────────────────────────── */
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const Modal = ({
  isOpen = false,
  // Backward compat: accept "open" prop as alias
  open,
  onClose,
  title,
  subtitle,
  category,
  size = 'md',
  showClose = true,
  children,
  footer,
  className = '',
}) => {
  // Support both "isOpen" and legacy "open" prop
  const visible = isOpen || open || false
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)

  /* ── Escape key + body scroll lock ──────────────────────── */
  useEffect(() => {
    if (!visible) return

    // Save currently focused element to restore later
    previousFocusRef.current = document.activeElement

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    // Focus first focusable or the panel itself
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector(FOCUSABLE)
      if (first) first.focus()
      else panelRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
      // Restore previous focus
      previousFocusRef.current?.focus?.()
    }
  }, [visible, onClose])

  /* ── Focus trap ─────────────────────────────────────────── */
  const handleTabTrap = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return

    const focusable = panelRef.current.querySelectorAll(FOCUSABLE)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  /* ── Backdrop click ─────────────────────────────────────── */
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose?.()
  }, [onClose])

  if (!visible) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleTabTrap}
    >
      {/* Backdrop with blur */}
      <div
        className="
          absolute inset-0
          bg-neutral-950/40 backdrop-blur-lg
          animate-fade-in
        "
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`
          relative w-full
          bg-surface rounded-lg shadow-xl
          animate-scale-in
          outline-none
          flex flex-col max-h-[90vh]
          ${sizeMap[size] || sizeMap.md}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      >
        {/* Close button */}
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute top-4 right-4 z-10
              w-8 h-8 rounded-md
              flex items-center justify-center
              text-neutral-400
              hover:bg-neutral-100 hover:text-neutral-600
              transition-colors duration-fast
            "
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        {/* Header */}
        {(title || category) && (
          <div className="px-6 pt-6 pb-0 shrink-0">
            {category && (
              <p className="text-overline text-primary-500 mb-1 tracking-wide">
                {category}
              </p>
            )}
            {title && (
              <h2
                id="modal-title"
                className="font-heading text-h2 text-neutral-900 pr-8"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-body text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Body — scrollable */}
        <div className="px-6 py-5 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="
            px-6 py-4
            border-t border-neutral-200
            surface-nested rounded-b-lg
            flex items-center justify-end gap-2
            shrink-0
          ">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default Modal
