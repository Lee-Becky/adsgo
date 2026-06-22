import { useRef, useState, useEffect, useCallback } from 'react'

/* ── Size tokens ──────────────────────────────────────── */
const sizeStyles = {
  sm: { tab: 'text-xs h-8 px-3 gap-1.5', count: 'text-[10px] min-w-[16px] h-4 px-1' },
  md: { tab: 'text-sm h-9 px-4 gap-2', count: 'text-[10px] min-w-[18px] h-[18px] px-1.5' },
  lg: { tab: 'text-body h-10 px-5 gap-2', count: 'text-xs min-w-[20px] h-5 px-1.5' },
}

/* ────────────────────────────────────────────────────────
   Underline variant — thin colored indicator slides under active tab
   ──────────────────────────────────────────────────────── */
const UnderlineTabs = ({ items, activeKey, onChange, size = 'md', className }) => {
  const containerRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const dim = sizeStyles[size] || sizeStyles.md

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return
    const activeEl = containerRef.current.querySelector('[data-active="true"]')
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tabRect = activeEl.getBoundingClientRect()
      setIndicator({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [])

  useEffect(() => {
    updateIndicator()
  }, [activeKey, items, updateIndicator])

  // Observe container resize
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(updateIndicator)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [updateIndicator])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center border-b border-neutral-200 ${className || ''}`}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = item.key === activeKey
        const Icon = item.icon
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            data-active={isActive}
            onClick={() => onChange?.(item.key)}
            className={`
              relative inline-flex items-center justify-center font-medium
              transition-colors duration-fast whitespace-nowrap
              ${dim.tab}
              ${isActive
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
              }
            `.trim()}
          >
            {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
            {item.label}
            {item.count != null && (
              <span
                className={`
                  inline-flex items-center justify-center rounded-full font-semibold
                  ${dim.count}
                  ${isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-500'
                  }
                `.trim()}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}

      {/* Sliding indicator */}
      <span
        className="absolute bottom-0 h-0.5 bg-primary-500 rounded-full transition-all duration-normal"
        style={{
          left: `${indicator.left}px`,
          width: `${indicator.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Pills variant — rounded background on active tab
   ──────────────────────────────────────────────────────── */
const PillsTabs = ({ items, activeKey, onChange, size = 'md', className }) => {
  const dim = sizeStyles[size] || sizeStyles.md

  return (
    <div className={`flex items-center gap-1 ${className || ''}`} role="tablist">
      {items.map((item) => {
        const isActive = item.key === activeKey
        const Icon = item.icon
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange?.(item.key)}
            className={`
              inline-flex items-center justify-center font-medium rounded-lg
              transition-all duration-fast whitespace-nowrap
              ${dim.tab}
              ${isActive
                ? 'bg-primary-50 text-primary-700 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }
            `.trim()}
          >
            {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
            {item.label}
            {item.count != null && (
              <span
                className={`
                  inline-flex items-center justify-center rounded-full font-semibold
                  ${dim.count}
                  ${isActive
                    ? 'bg-primary-200 text-primary-800'
                    : 'bg-neutral-100 text-neutral-500'
                  }
                `.trim()}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Segment variant — connected toggle buttons with sliding background
   ──────────────────────────────────────────────────────── */
const SegmentTabs = ({ items, activeKey, onChange, size = 'md', className }) => {
  const containerRef = useRef(null)
  const [bg, setBg] = useState({ left: 0, width: 0 })
  const dim = sizeStyles[size] || sizeStyles.md

  const updateBg = useCallback(() => {
    if (!containerRef.current) return
    const activeEl = containerRef.current.querySelector('[data-active="true"]')
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tabRect = activeEl.getBoundingClientRect()
      setBg({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [])

  useEffect(() => {
    updateBg()
  }, [activeKey, items, updateBg])

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(updateBg)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [updateBg])

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center bg-neutral-100 rounded-lg p-0.5 ${className || ''}`}
      role="tablist"
    >
      {/* Sliding background */}
      <span
        className="absolute top-0.5 bottom-0.5 bg-white rounded-md shadow-sm transition-all duration-normal"
        style={{
          left: `${bg.left}px`,
          width: `${bg.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />

      {items.map((item) => {
        const isActive = item.key === activeKey
        const Icon = item.icon
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            data-active={isActive}
            onClick={() => onChange?.(item.key)}
            className={`
              relative inline-flex items-center justify-center font-medium rounded-md
              transition-colors duration-fast whitespace-nowrap z-[1]
              ${dim.tab}
              ${isActive
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-700'
              }
            `.trim()}
          >
            {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
            {item.label}
            {item.count != null && (
              <span
                className={`
                  inline-flex items-center justify-center rounded-full font-semibold
                  ${dim.count}
                  ${isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-200 text-neutral-500'
                  }
                `.trim()}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Main Tabs export — delegates to variant
   ──────────────────────────────────────────────────────── */
const Tabs = ({
  items = [],
  activeKey,
  onChange,
  variant = 'underline',
  size = 'md',
  className = '',
}) => {
  const commonProps = { items, activeKey, onChange, size, className }

  switch (variant) {
    case 'pills':
      return <PillsTabs {...commonProps} />
    case 'segment':
      return <SegmentTabs {...commonProps} />
    case 'underline':
    default:
      return <UnderlineTabs {...commonProps} />
  }
}

Tabs.displayName = 'Tabs'
export default Tabs
