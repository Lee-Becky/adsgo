import React from 'react'

const PHASES = [
  { key: 'new_user', label: '新用户' },
  { key: 'just_launched', label: '刚发布' },
  { key: 'running', label: '24H后' },
]

export default function DemoPhaseSwitch({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Demo</span>
      <div className="bg-gray-100 rounded-lg p-0.5 inline-flex">
        {PHASES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              value === key
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
