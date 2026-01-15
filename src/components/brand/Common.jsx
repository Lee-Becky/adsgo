import { useState } from 'react'
import { X } from 'lucide-react'

// --- Specialized UI Row ---
export const InfoRow = ({ label, icon: Icon, children }) => (
  <div className="p-6 flex flex-col space-y-3">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-slate-900" strokeWidth={2.5} />
      <span className="text-[11px] font-bold text-slate-900 opacity-60">{label}</span>
    </div>
    <div className="w-full">{children}</div>
  </div>
)

// --- Dynamic Tag Input (Compact & Contrast) ---
export const TagInput = ({ tags, onTagsChange, color = 'indigo' }) => {
  const [val, setVal] = useState('')
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300',
    rose: 'bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300'
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((t, i) => (
        <span key={i} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 group/t shadow-sm ${colorMap[color]}`}>
          {t}
          <button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors">
            <X size={10} />
          </button>
        </span>
      ))}
      <input 
        className="bg-transparent border-none outline-none text-[11px] font-bold text-indigo-600 w-24 placeholder:text-slate-300"
        placeholder="+ Add"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && val) {
            onTagsChange([...tags, val])
            setVal('')
          }
        }}
      />
    </div>
  )
}
