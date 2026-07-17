import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

const Dropdown = ({
  trigger,
  items = [],
  align = 'left',
  className = '',
}) => {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, minWidth: 0 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const toggle = useCallback(() => {
    if (open) {
      close()
    } else {
      setOpen(true)
    }
  }, [open])

  const close = useCallback(() => {
    setEntered(false)
    setTimeout(() => setOpen(false), 150)
  }, [])

  // Position the menu
  useEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect()
      const menuEl = menuRef.current
      if (!menuEl) return

      const menuRect = menuEl.getBoundingClientRect()

      let top = rect.bottom + 4
      let left = align === 'right'
        ? rect.right - menuRect.width
        : rect.left

      // Clamp to viewport
      if (top + menuRect.height > window.innerHeight - 8) {
        top = rect.top - menuRect.height - 4
      }
      left = Math.max(8, Math.min(left, window.innerWidth - menuRect.width - 8))

      setCoords({ top, left, minWidth: rect.width })
    }

    requestAnimationFrame(() => {
      updatePosition()
      requestAnimationFrame(() => setEntered(true))
    })
  }, [open, align])

  // Close on outside click
  useEffect(() => {
    if (!open) return

    const handleClick = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) return
      close()
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, close])

  return (
    <>
      {/* Trigger */}
      <span
        ref={triggerRef}
        onClick={toggle}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </span>

      {/* Menu portal */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={`
              fixed z-[10000]
              transition-all duration-fast
              ${entered
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
              }
              origin-top
              ${className}
            `.trim()}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              minWidth: `${coords.minWidth}px`,
            }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-neutral-200 py-1 overflow-hidden">
              {items.map((item, idx) => {
                // Divider
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${idx}`}
                      className="my-1 border-t border-neutral-100"
                    />
                  )
                }

                const Icon = item.icon
                const isDanger = item.danger

                return (
                  <button
                    key={item.label || idx}
                    type="button"
                    onClick={() => {
                      item.onClick?.()
                      close()
                    }}
                    disabled={item.disabled}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left
                      transition-colors duration-fast
                      ${isDanger
                        ? 'text-danger-600 hover:bg-danger-50'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      }
                      ${item.disabled ? 'opacity-40 pointer-events-none' : ''}
                    `.trim()}
                  >
                    {Icon && (
                      <Icon
                        size={16}
                        className={`shrink-0 ${isDanger ? 'text-danger-500' : 'text-neutral-400'}`}
                      />
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-neutral-400 font-mono ml-4 shrink-0">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

Dropdown.displayName = 'Dropdown'
export default Dropdown
