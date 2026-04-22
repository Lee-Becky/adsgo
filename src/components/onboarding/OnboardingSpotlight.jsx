import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight } from 'lucide-react'

const PADDING = 10
const TOOLTIP_WIDTH = 300

export default function OnboardingSpotlight({ targetRef, title, body, onSkip, onNext, nextText = '下一步', stepLabel, renderActions, width = 300 }) {
  const [rect, setRect] = useState(null)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const update = () => {
      if (targetRef.current) {
        setRect(targetRef.current.getBoundingClientRect())
      }
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [targetRef])

  // Scroll into view and fade in on mount
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  if (!rect) return null

  const spotTop = rect.top - PADDING
  const spotLeft = rect.left - PADDING
  const spotW = rect.width + PADDING * 2
  const spotH = rect.height + PADDING * 2

  // Tooltip: prefer below, fall back to above
  const spaceBelow = window.innerHeight - rect.bottom
  const below = spaceBelow >= 180
  const tooltipTop = below
    ? rect.bottom + PADDING + 8
    : rect.top - PADDING - 8 - 160

  // Horizontally align with target, clamped to viewport
  const tooltipLeft = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))

  return createPortal(
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms ease' }}>
      {/* Spotlight hole — box-shadow creates the dark overlay */}
      <div
        style={{
          position: 'fixed',
          top: spotTop,
          left: spotLeft,
          width: spotW,
          height: spotH,
          borderRadius: 12,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          zIndex: 9990,
          pointerEvents: 'none',
          transition: 'top 200ms ease, left 200ms ease, width 200ms ease, height 200ms ease',
        }}
      />

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: width,
          zIndex: 9991,
          pointerEvents: 'auto',
          transition: 'top 200ms ease, left 200ms ease',
        }}
        className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4"
      >
        {stepLabel && (
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">
            步骤 {stepLabel}
          </div>
        )}
        <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{body}</p>
        {renderActions ? renderActions() : (
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              跳过引导
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {nextText}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
