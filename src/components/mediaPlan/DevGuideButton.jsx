import React, { useState } from 'react'
import { Code, X } from 'lucide-react'

export default function DevGuideButton({ title, content }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-primary-500 border border-neutral-200 hover:border-primary-300 rounded-md px-2 py-0.5 transition-all"
      >
        <Code className="w-3 h-3" />
        <span>Dev Guide</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-base font-semibold text-neutral-900">
                Dev Guide: {title}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-mono leading-relaxed">
                {content.trim()}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium shadow-sm hover:bg-neutral-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
