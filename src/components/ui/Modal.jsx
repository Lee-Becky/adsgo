import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const sizeMap = {
  sm:   'max-w-[400px]',
  md:   'max-w-[540px]',
  lg:   'max-w-[720px]',
  xl:   'max-w-[960px]',
  full: 'max-w-[1200px]',
}

const Modal = ({
  open = false,
  onClose,
  size = 'md',
  category,
  title,
  subtitle,
  footer,
  children,
  className = '',
}) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.()
      }}
    >
      {/* Overlay — glassmorphism */}
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-[12px] animate-[fadeIn_200ms_ease-out]" />

      {/* Container — spring animation */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl w-full
          animate-spring-in
          ${sizeMap[size] || sizeMap.md}
          ${className}
        `.trim()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        {(title || category) && (
          <div className="px-6 py-5">
            {category && (
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary-500 mb-1">
                {category}
              </p>
            )}
            {title && (
              <h2 className="font-display text-2xl font-bold text-gray-900 pr-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-surface-2 rounded-b-xl flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default Modal
