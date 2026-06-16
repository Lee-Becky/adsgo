import { useState } from 'react'
import { CheckSquare, Square, Search } from 'lucide-react'

const FieldSelector = ({ fields, selected, onChange, title = 'Select Fields' }) => {
  const [search, setSearch] = useState('')

  // Group fields by their group property
  const grouped = {}
  fields.forEach(f => {
    const group = f.group || 'Other'
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(f)
  })

  const filteredGroups = Object.entries(grouped).reduce((acc, [group, items]) => {
    const filtered = items.filter(f => f.label.toLowerCase().includes(search.toLowerCase()))
    if (filtered.length > 0) acc[group] = filtered
    return acc
  }, {})

  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key]
    onChange(next)
  }

  const selectAll = () => {
    const allKeys = fields.map(f => f.key)
    const allSelected = allKeys.every(k => selected.includes(k))
    onChange(allSelected ? [] : allKeys)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-900">{title}</h4>
        <button onClick={selectAll} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700">
          {fields.every(f => selected.includes(f.key)) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
          placeholder="Search fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
        {Object.entries(filteredGroups).map(([group, items]) => (
          <div key={group}>
            <p className="text-[10px] font-black text-slate-400 mb-2">{group}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map(field => {
                const isSelected = selected.includes(field.key)
                return (
                  <button
                    key={field.key}
                    onClick={() => toggle(field.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={13} className="text-indigo-500" /> : <Square size={13} className="text-slate-300" />}
                    {field.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400">{selected.length} of {fields.length} selected</p>
    </div>
  )
}

export default FieldSelector
