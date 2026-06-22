import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

const positionConfig = {
  top: {
    getCoords: (rect, tipRect) => ({
      top: rect.top - tipRect.height - 8,
      left: rect.left + rect.width / 2 - tipRect.width / 2,
    }),
    arrow: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
    arrowBorder: 'border-l-transparent border-r-transparent border-b-transparent border-t-ink-700',
    enterFrom: 'translate-y-1 opacity-0',
    enterTo: 'translate-y-0 opacity-100',
  },
  bottom: {
    getCoords: (rect) => ({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    }),
    arrow: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
    arrowBorder: 'border-l-transparent border-r-transparent border-t-transparent border-b-ink-700',
    enterFrom: '-translate-y-1 opacity-0',
    enterTo: 'translate-y-0 opacity-100',
  },
  left: {
    getCoords: (rect, tipRect) => ({
      top: rect.top + rect.height / 2 - tipRect.height / 2,
      left: rect.left - tipRect.width - 8,
    }),
    arrow: 'right-0 top-1/2 -translate-y-1/2 translate-x-full',
    arrowBorder: 'border-t-transparent border-b-transparent border-r-transparent border-l-ink-700',
    enterFrom: 'translate-x-1 opacity-0',
    enterTo: 'translate-x-0 opacity-100',
  },
  right: {
    getCoords: (rect, tipRect) => ({
      top: rect.top + rect.height / 2 - tipRect.height / 2,
      left: rect.right + 8,
    }),
    arrow: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
    arrowBorder: 'border-t-transparent border-b-transparent border-l-transparent border-r-ink-700',
    enterFrom: '-translate-x-1 opacity-0',
    enterTo: 'translate-x-0 opacity-100',
  },
}

const Tooltip = ({
  content,
  position = 'top',
  delay = 300,
  children,
  className = '',
}) => {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [entered, setEntered] = useState(false)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timerRef = useRef(null)

  const config = positionConfig[position] || positionConfig.top

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }, [delay])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    setEntered(false)
    // Allow exit animation before unmounting
    setTimeout(() => setVisible(false), 150)
  }, [])

  // Position the tooltip once visible
  useEffect(() => {
    if (!visible || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect()
      const tipEl = tooltipRef.current
      if (!tipEl) return

      const tipRect = tipEl.getBoundingClientRect()
      const pos = config.getCoords(rect, tipRect)

      // For bottom position, center by subtracting half tip width
      if (position === 'bottom') {
        pos.left = pos.left - tipRect.width / 2
      }

      // Clamp to viewport
      pos.left = Math.max(8, Math.min(pos.left, window.innerWidth - tipRect.width - 8))
      pos.top = Math.max(8, Math.min(pos.top, window.innerHeight - tipRect.height - 8))

      setCoords(pos)
    }

    // Use rAF to wait for paint
    requestAnimationFrame(() => {
      updatePosition()
      // Trigger enter animation after positioning
      requestAnimationFrame(() => setEntered(true))
    })
  }, [visible, config, position])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  if (!content) return children

  return (
    <>
      {/* Trigger wrapper */}
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex"
      >
        {children}
      </span>

      {/* Tooltip portal */}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={`
              fixed z-[700] pointer-events-none
              transition-all duration-fast
              ${entered ? config.enterTo : config.enterFrom}
              ${className}
            `.trim()}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            <div className="relative px-2.5 py-1.5 bg-ink-700 text-white text-xs font-medium rounded-md shadow-lg max-w-[240px] whitespace-pre-wrap">
              {content}

              {/* Arrow */}
              <span
                className={`absolute w-0 h-0 border-[4px] ${config.arrow} ${config.arrowBorder}`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
export default Tooltip
