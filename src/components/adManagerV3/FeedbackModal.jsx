import { useState } from 'react'
import { X, MessageCircle, Sparkles, CheckCircle2, Send } from 'lucide-react'

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in duration-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{title || 'Feedback'}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              aria-label="Close"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5 mb-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/80 rounded-xl shrink-0 shadow-sm">
                <Sparkles size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900 mb-1.5">Help us personalize your experience</h3>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Your feedback helps AdsGo understand your preferences and provide suggestions that better match your optimization goals and strategies.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              What's your reason? <span className="text-indigo-600 ml-1">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="E.g., This budget doesn't align with our current strategy, or we have other priorities..."
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm min-h-[120px] resize-y bg-slate-50 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
              required
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={12} />
              <span>Minimum 10 characters required</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <button
            onClick={handleConfirm}
            disabled={!feedback.trim() || feedback.trim().length < 10}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>{buttonText || 'Send Feedback'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
