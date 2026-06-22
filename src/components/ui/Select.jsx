import { useState, useRef, useEffect, useCallback, useId, useMemo } from 'react'
import { ChevronDown, X, Search, Check } from 'lucide-react'

/* ── Chip for multi-select ────────────────────────────────── */
const Chip = ({ label, onRemove, disabled }) => (
  <span className="inline-flex items-center gap-1 h-6 px-2 rounded-base bg-primary-50 text-primary-700 text-caption font-medium max-w-[140px]">
    <span className="truncate">{label}</span>
    {!disabled && (
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="shrink-0 p-0.5 rounded-xs hover:bg-primary-100 transition-colors duration-fast"
        aria-label={`Remove ${label}`}
      >
        <X size={12} />
      </button>
    )}
  </span>
)

/* ── Option group label ───────────────────────────────────── */
const GroupLabel = ({ label }) => (
  <div className="px-3 py-1.5 text-overline text-neutral-400 select-none tracking-wide">
    {label}
  </div>
)

/* ── Main Select Component ────────────────────────────────── */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  searchable = false,
  placeholder = 'Select...',
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focusIndex, setFocusIndex] = useState(-1)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const id = useId()
  const hasError = !!error

  // Normalize options to {value, label, group?}
  const normalized = useMemo(() =>
    options.map(opt =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    ),
    [options]
  )

  // Build grouped structure
  const grouped = useMemo(() => {
    const filtered = search
      ? normalized.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
      : normalized

    const groups = new Map()
    filtered.forEach(opt => {
      const g = opt.group || '__default__'
      if (!groups.has(g)) groups.set(g, [])
      groups.get(g).push(opt)
    })
    return groups
  }, [normalized, search])

  // Flat list for keyboard nav
  const flatFiltered = useMemo(() => {
    const result = []
    grouped.forEach((opts) => result.push(...opts))
    return result
  }, [grouped])

  // Selected values as array
  const selectedArray = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : []
    return value !== undefined && value !== null && value !== '' ? [value] : []
  }, [value, multiple])

  // Get label for a value
  const getLabel = useCallback((val) => {
    const found = normalized.find(o => o.value === val)
    return found ? found.label : String(val)
  }, [normalized])

  /* ── Open / Close ───────────────────────────────────────── */
  const open = useCallback(() => {
    if (disabled) return
    setIsOpen(true)
    setSearch('')
    setFocusIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [disabled])

  const close = useCallback(() => {
    setIsOpen(false)
    setSearch('')
    setFocusIndex(-1)
  }, [])

  const toggle = useCallback(() => {
    isOpen ? close() : open()
  }, [isOpen, open, close])

  /* ── Selection ──────────────────────────────────────────── */
  const selectOption = useCallback((optValue) => {
    if (multiple) {
      const next = selectedArray.includes(optValue)
        ? selectedArray.filter(v => v !== optValue)
        : [...selectedArray, optValue]
      onChange?.(next)
    } else {
      onChange?.(optValue)
      close()
    }
  }, [multiple, selectedArray, onChange, close])

  const removeValue = useCallback((val) => {
    if (multiple) {
      onChange?.(selectedArray.filter(v => v !== val))
    }
  }, [multiple, selectedArray, onChange])

  /* ── Keyboard ───────────────────────────────────────────── */
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault()
        open()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusIndex(i => Math.min(i + 1, flatFiltered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusIndex >= 0 && focusIndex < flatFiltered.length) {
          selectOption(flatFiltered[focusIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      default:
        break
    }
  }, [isOpen, open, close, focusIndex, flatFiltered, selectOption])

  /* ── Click outside ──────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, close])

  /* ── Scroll focused option into view ────────────────────── */
  useEffect(() => {
    if (focusIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll('[data-option]')
    items[focusIndex]?.scrollIntoView({ block: 'nearest' })
  }, [focusIndex])

  /* ── Display value ──────────────────────────────────────── */
  const renderTriggerContent = () => {
    if (multiple && selectedArray.length > 0) {
      return (
        <div className="flex flex-wrap gap-1 py-0.5">
          {selectedArray.map(val => (
            <Chip
              key={val}
              label={getLabel(val)}
              onRemove={() => removeValue(val)}
              disabled={disabled}
            />
          ))}
        </div>
      )
    }

    if (!multiple && selectedArray.length > 0) {
      return (
        <span className="text-body text-neutral-800 truncate">
          {getLabel(selectedArray[0])}
        </span>
      )
    }

    return (
      <span className="text-body text-neutral-400">{placeholder}</span>
    )
  }

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-caption font-semibold text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div className="relative">
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={`
            w-full min-h-[40px] px-3 pr-9 rounded-md
            bg-surface border text-left
            flex items-center
            outline-none cursor-pointer
            transition-all duration-fast ease-default
            ${hasError
              ? 'border-danger-500 focus:border-danger-500 focus:shadow-error-focus'
              : isOpen
                ? 'border-primary-500 shadow-glow'
                : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:shadow-glow'
            }
            ${disabled
              ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed hover:border-neutral-200'
              : ''
            }
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        >
          <div className="flex-1 min-w-0">
            {renderTriggerContent()}
          </div>
        </button>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none
            transition-transform duration-fast
            ${isOpen ? 'rotate-180' : ''}
          `.replace(/\s+/g, ' ').trim()}
        />

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute z-50 w-full mt-1
              bg-surface border border-neutral-200
              rounded-md shadow-lg
              animate-scale-in origin-top
              overflow-hidden
            "
          >
            {/* Search input */}
            {searchable && (
              <div className="relative border-b border-neutral-100 p-2">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setFocusIndex(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="
                    w-full h-8 pl-8 pr-3 rounded-sm
                    bg-neutral-50 border-none outline-none
                    text-body text-neutral-800 placeholder:text-neutral-400
                    focus:bg-white
                    transition-colors duration-fast
                  "
                />
              </div>
            )}

            {/* Options list */}
            <div
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiple}
              className="max-h-60 overflow-y-auto custom-scrollbar py-1"
            >
              {flatFiltered.length === 0 && (
                <div className="px-3 py-4 text-body text-neutral-400 text-center">
                  No options found
                </div>
              )}

              {Array.from(grouped.entries()).map(([group, opts]) => (
                <div key={group}>
                  {group !== '__default__' && <GroupLabel label={group} />}
                  {opts.map((opt) => {
                    const isSelected = selectedArray.includes(opt.value)
                    const isFocused = flatFiltered[focusIndex]?.value === opt.value
                    return (
                      <div
                        key={opt.value}
                        data-option
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => selectOption(opt.value)}
                        className={`
                          flex items-center gap-2 px-3 py-2 cursor-pointer
                          text-body transition-colors duration-fast
                          ${isFocused ? 'bg-primary-50' : ''}
                          ${isSelected && !isFocused ? 'bg-neutral-50' : ''}
                          ${!isFocused && !isSelected ? 'hover:bg-neutral-50' : ''}
                          ${isSelected ? 'text-primary-700 font-medium' : 'text-neutral-700'}
                        `.replace(/\s+/g, ' ').trim()}
                      >
                        {multiple && (
                          <span className={`
                            w-4 h-4 rounded-checkbox border flex items-center justify-center shrink-0
                            transition-colors duration-fast
                            ${isSelected
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-neutral-300'
                            }
                          `.replace(/\s+/g, ' ').trim()}>
                            {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                          </span>
                        )}
                        <span className="truncate flex-1">{opt.label}</span>
                        {!multiple && isSelected && (
                          <Check size={14} className="text-primary-500 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-caption text-danger-500 mt-1 animate-slide-up">{error}</p>
      )}

      {/* Helper text */}
      {!hasError && helper && (
        <p className="text-caption text-neutral-500 mt-1">{helper}</p>
      )}
    </div>
  )
}

Select.displayName = 'Select'
export default Select
