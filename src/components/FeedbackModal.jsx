import { useState } from 'react'
import { X } from 'lucide-react'

const FeedbackModal = ({ isOpen, onClose, onConfirm, title, buttonText }) => {
  const [feedback, setFeedback] = useState('')

  const handleConfirm = () => {
    if (feedback.trim()) {
      onConfirm(feedback.trim())
      setFeedback('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title || 'Feedback'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            Please tell me why you did not adopt my suggestion, and I will improve its quality in future optimizations based on your reason.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm min-h-[120px] resize-y"
            required
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-medium text-gray-700 bg-white border border-border hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!feedback.trim()}
            className="flex-1 py-3 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {buttonText || 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
