import { useState, useMemo } from 'react'
import { Scissors, X } from 'lucide-react'
import { SEPARATOR_PRESETS } from '../mockData'

const COLORS = [
  'bg-info-100 text-info-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
]

const SplitPatternConfig = ({ config, onChange, sampleNames = ['Product_US_Broad', 'Brand_EU_Lookalike', 'Sale_Global_Interest'] }) => {
  const separator = config?.separator || '_'
  const dimensions = config?.dimensions || []

  const preview = useMemo(() => {
    if (!separator || sampleNames.length === 0) return []
    return sampleNames.map(name => name.split(separator))
  }, [separator, sampleNames])

  const maxSegments = Math.max(...preview.map(p => p.length), 0)

  const handleSeparatorChange = (sep) => {
    onChange({ ...config, separator: sep, dimensions: [] })
  }

  const handleDimensionNameChange = (index, name) => {
    const key = name.toLowerCase().replace(/\s+/g, '_')
    const next = [...dimensions]
    const existing = next.findIndex(d => d.index === index)
    if (existing >= 0) {
      next[existing] = { ...next[existing], name, key }
    } else {
      next.push({ index, name, key })
    }
    onChange({ ...config, dimensions: next })
  }

  const removeDimension = (index) => {
    onChange({ ...config, dimensions: dimensions.filter(d => d.index !== index) })
  }

  const getDimensionName = (index) => {
    return dimensions.find(d => d.index === index)?.name || ''
  }

  return (
    <div className="space-y-5">
      {/* Separator selection */}
      <div>
        <h4 className="text-xs font-black text-neutral-900 mb-2 flex items-center gap-2">
          <Scissors size={14} className="text-neutral-400" />
          Separator
        </h4>
        <div className="flex items-center gap-2">
          {SEPARATOR_PRESETS.map(sep => (
            <button
              key={sep}
              onClick={() => handleSeparatorChange(sep)}
              className={`w-9 h-9 rounded-lg text-sm font-mono font-bold flex items-center justify-center transition-all ${
                separator === sep
                  ? 'bg-neutral-900 text-white shadow-lg'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-primary-300'
              }`}
            >
              {sep}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <h4 className="text-xs font-black text-neutral-900 mb-2">Preview</h4>
        <div className="space-y-2">
          {preview.map((segments, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-1 flex-wrap">
              {segments.map((seg, segIdx) => (
                <span
                  key={segIdx}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${COLORS[segIdx % COLORS.length]}`}
                >
                  {seg}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dimension naming */}
      <div>
        <h4 className="text-xs font-black text-neutral-900 mb-2">Dimension Names</h4>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: maxSegments }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-md text-[10px] font-black flex items-center justify-center ${COLORS[i % COLORS.length]}`}>
                {i + 1}
              </span>
              <input
                className="flex-1 px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg bg-white text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
                placeholder={`Segment ${i + 1} name`}
                value={getDimensionName(i)}
                onChange={(e) => handleDimensionNameChange(i, e.target.value)}
              />
              {getDimensionName(i) && (
                <button onClick={() => removeDimension(i)} className="p-1 text-neutral-300 hover:text-danger-500">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SplitPatternConfig
