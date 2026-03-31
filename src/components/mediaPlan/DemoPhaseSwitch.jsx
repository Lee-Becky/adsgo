import React from 'react'

const PHASES = [
  { key: 'new_user', label: '新用户（当前 brand 未发布过广告）' },
  { key: 'just_launched', label: '刚发布（当前 brand 有活跃中广告且 24H 内无消耗）' },
  { key: 'running', label: '24H 后（当前 brand 有活跃中广告且 24H 内有消耗）' },
  { key: 'dormant', label: '休眠期（当前无活跃中广告且历史有消耗数据）' },
]

export default function DemoPhaseSwitch({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-widest px-2 py-1 bg-gradient-to-r from-indigo-50 to-transparent rounded">
        Demo Mode
      </span>
      <div className="bg-white rounded-xl p-1 inline-flex shadow-md border border-gray-200">
        {PHASES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              value === key
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
