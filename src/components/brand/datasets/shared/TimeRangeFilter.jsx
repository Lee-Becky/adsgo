import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { TIME_RANGE_OPTIONS } from '../mockData'

const TimeRangeFilter = ({ value, onChange }) => {
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handleSelect = (opt) => {
    if (opt.value === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      onChange({ type: 'preset', days: opt.value })
    }
  }

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      onChange({ type: 'custom', from: customFrom, to: customTo })
      setShowCustom(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
        {TIME_RANGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              (value?.type === 'preset' && value?.days === opt.value) || (opt.value === 'custom' && showCustom)
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {showCustom && (
        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="px-2.5 py-1.5 text-[11px] font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-indigo-400"
          />
          <span className="text-[10px] text-slate-400">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="px-2.5 py-1.5 text-[11px] font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-indigo-400"
          />
          <button
            onClick={handleCustomApply}
            disabled={!customFrom || !customTo}
            className="px-3 py-1.5 text-[10px] font-bold bg-slate-900 text-white rounded-lg disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export default TimeRangeFilter
