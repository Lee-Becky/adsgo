import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight } from 'lucide-react'

const PADDING = 10
const EDGE_MARGIN = 16
const GAP = 16
const MAX_SPOT_WIDTH_RATIO = 0.95
const MAX_SPOT_HEIGHT_RATIO = 0.85
const FALLBACK_TOOLTIP_HEIGHT = 180

export default function OnboardingSpotlight({ targetRef, title, body, onSkip, onNext, nextText = '下一步', stepLabel, renderActions, width = 300 }) {
  const [rect, setRect] = useState(null)
  const [viewport, setViewport] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 0, h: typeof window !== 'undefined' ? window.innerHeight : 0 })
  const [tooltipHeight, setTooltipHeight] = useState(FALLBACK_TOOLTIP_HEIGHT)
  const [visible, setVisible] = useState(false)
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    const update = () => {
      if (targetRef.current) {
        setRect(targetRef.current.getBoundingClientRect())
      }
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [targetRef])

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const h = tooltipRef.current.getBoundingClientRect().height
      if (h && Math.abs(h - tooltipHeight) > 1) setTooltipHeight(h)
    }
  }, [title, body, stepLabel, renderActions, tooltipHeight])

  // Scroll into view and fade in on mount
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  // Lock body scroll while spotlight is active (after scrollIntoView settles)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const lockTimer = setTimeout(() => {
      document.body.style.overflow = 'hidden'
    }, 400)
    return () => {
      clearTimeout(lockTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // ESC to dismiss
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onSkip?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSkip])

  // Skip render when target is detached or hidden (0-sized rect)
  if (!rect || rect.width < 1 || rect.height < 1) return null

  const { w: vw, h: vh } = viewport

  // Cap spotlight size — if target is huge, show a centered crop instead of the full area
  const maxW = Math.max(80, vw * MAX_SPOT_WIDTH_RATIO)
  const maxH = Math.max(60, vh * MAX_SPOT_HEIGHT_RATIO)
  const desiredW = rect.width + PADDING * 2
  const desiredH = rect.height + PADDING * 2
  const spotW = Math.min(desiredW, maxW)
  const spotH = Math.min(desiredH, maxH)

  // Center spotlight around target center, then clamp into viewport
  const targetCX = rect.left + rect.width / 2
  const targetCY = rect.top + rect.height / 2
  let spotLeft = targetCX - spotW / 2
  let spotTop = targetCY - spotH / 2
  spotLeft = Math.max(EDGE_MARGIN, Math.min(spotLeft, vw - spotW - EDGE_MARGIN))
  spotTop = Math.max(EDGE_MARGIN, Math.min(spotTop, vh - spotH - EDGE_MARGIN))
  const spotBottom = spotTop + spotH

  // Tooltip: prefer below the spotlight, fall back to above, then force into viewport
  const spaceBelow = vh - spotBottom
  const below = spaceBelow >= tooltipHeight + GAP + EDGE_MARGIN
  let tooltipTop = below
    ? spotBottom + GAP
    : spotTop - GAP - tooltipHeight
  tooltipTop = Math.max(EDGE_MARGIN, Math.min(tooltipTop, vh - tooltipHeight - EDGE_MARGIN))

  // Horizontal: align with spotlight left, clamped to viewport
  const tooltipLeft = Math.max(EDGE_MARGIN, Math.min(spotLeft, vw - width - EDGE_MARGIN))

  return createPortal(
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms ease' }}>
      {/* Click-catcher: transparent full-screen layer that blocks stray clicks and
          dismisses the tour when the user clicks outside the spotlight hole */}
      <div
        onClick={onSkip}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9988,
          cursor: 'pointer',
        }}
        aria-label="关闭引导"
      />
      {/* Spotlight hole — box-shadow creates the dark overlay around the hole */}
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
        ref={tooltipRef}
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: width,
          maxWidth: `calc(100vw - ${EDGE_MARGIN * 2}px)`,
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
