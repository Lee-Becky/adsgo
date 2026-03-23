import { useState } from 'react'
import { ChevronDown, ChevronRight, User, Bot } from 'lucide-react'

const HowWeWork = ({ onOpenControlMatrix }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 md:px-8 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">How We Work Together</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 md:px-8 pb-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* You Control */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary-500" />
                </div>
                <span className="text-xs font-semibold text-gray-900">You Control</span>
              </div>
              <div className="space-y-1.5">
                {['Approve budget optimizations (or enable auto-apply)', 'Publish recommended campaigns (or enable auto-publish)', 'Adjust budget rules, brand budget & KPI targets', 'Upload custom creatives for campaign testing'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Handles */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded-full bg-success-50 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-success-500" />
                </div>
                <span className="text-xs font-semibold text-gray-900">AI Handles</span>
              </div>
              <div className="space-y-1.5">
                {['Budget optimization analysis & recommendations', 'Campaign generation & audience targeting', 'Creative generation, A/B testing & rotation', 'Rule evaluation & automatic execution'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1 h-1 rounded-full bg-success-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenControlMatrix()
              }}
              className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              See full control matrix <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HowWeWork
