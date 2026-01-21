import { useState, useMemo } from 'react'
import { X, MessageCircle, Sparkles, CheckCircle2, Send, ChevronRight, ChevronDown } from 'lucide-react'

const FEEDBACK_OPTIONS = [
  {
    id: 'data_error',
    label: 'Data Analysis Errors',
    children: [
      { id: 'metric_error', label: 'Incorrect key data/metrics (e.g., ROAS, Conversion Rate, etc.)' },
      { id: 'dimension_error', label: 'Unreasonable data comparison dimensions' }
    ]
  },
  {
    id: 'budget_unreasonable',
    label: 'Unreasonable Budget Adjustment Suggestions',
    children: [
      {
        id: 'direction_error',
        label: 'Incorrect Direction',
        children: [
          { id: 'should_increase', label: 'Should increase budget (AI suggests decrease or maintain)' },
          { id: 'should_decrease', label: 'Should decrease budget (AI suggests increase or maintain)' },
          { id: 'should_maintain', label: 'Should maintain budget (AI suggests increase or decrease)' }
        ]
      },
      {
        id: 'amplitude_unreasonable',
        label: 'Unreasonable Adjustment Range',
        children: [
          { id: 'too_large', label: 'Too large' },
          { id: 'too_small', label: 'Too small' }
        ]
      }
    ]
  },
  {
    id: 'logic_insufficient',
    label: 'Insufficient AI Analysis Logic/Reasoning',
    children: [
      { id: 'lack_support', label: 'Lacks key data support' },
      { id: 'too_vague', label: 'Analysis reasons are too vague' },
      { id: 'logical_error', label: 'Logical error' }
    ]
  },
  {
    id: 'other',
    label: 'Other',
    isOther: true
  }
]

const FeedbackModal = ({ isOpen, onClose, onConfirm, title, buttonText }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [otherText, setOtherText] = useState('')
  const [expandedIds, setExpandedIds] = useState(['data_error', 'budget_unreasonable', 'logic_insufficient', 'direction_error', 'amplitude_unreasonable'])

  const toggleSelection = (id, hasChildren) => {
    if (hasChildren) {
      toggleExpand(id)
      return
    }
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        // Ensure no parent IDs are ever added to selectedIds
        return [...prev, id]
      }
    })
  }

  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const isChildSelected = (option) => {
    if (!option.children) return selectedIds.includes(option.id)
    // Only check if actual leaf nodes in the children tree are selected
    return option.children.some(child => isChildSelected(child))
  }

  const handleConfirm = () => {
    const result = []
    
    const traverse = (options) => {
      options.forEach(opt => {
        if (selectedIds.includes(opt.id)) {
          if (opt.isOther) {
            if (otherText.trim()) result.push(`Other: ${otherText.trim()}`)
          } else {
            result.push(opt.label)
          }
        }
        if (opt.children) traverse(opt.children)
      })
    }
    
    traverse(FEEDBACK_OPTIONS)

    if (result.length > 0) {
      onConfirm(result.join('; '))
      setSelectedIds([])
      setOtherText('')
    }
  }

  const isStepValid = useMemo(() => {
    if (selectedIds.length === 0) return false
    if (selectedIds.includes('other') && !otherText.trim()) return false
    return true
  }, [selectedIds, otherText])

  if (!isOpen) return null

  const renderOption = (option, level = 0) => {
    const hasChildren = option.children && option.children.length > 0
    const isExpanded = expandedIds.includes(option.id)
    // A parent should NEVER be considered isSelected for visual purposes
    const isSelected = !hasChildren && selectedIds.includes(option.id)
    const hasActiveChild = hasChildren && isChildSelected(option)

    return (
      <div key={option.id} className="select-none">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all duration-200 ${
            isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => toggleSelection(option.id, hasChildren)}
        >
          {!hasChildren ? (
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
            }`}>
              {isSelected && <CheckCircle2 size={12} className="text-white" />}
            </div>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              {hasActiveChild && (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
              )}
            </div>
          )}
          
          <span className={`text-sm transition-colors ${
            isSelected ? 'text-indigo-900 font-bold' : 
            hasActiveChild ? 'text-slate-800 font-semibold' :
            'text-slate-600 font-normal'
          }`}>
            {option.label}
          </span>

          {hasChildren && (
            <div className="ml-auto p-1 hover:bg-slate-200 rounded transition-colors">
              {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 border-l border-slate-100 ml-2">
            {option.children.map(child => renderOption(child, level + 1))}
          </div>
        )}

        {option.isOther && isSelected && (
          <div className="mt-2 ml-6">
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Other reasons can be added."
              className="w-full px-3 py-2 border-b-2 border-slate-200 focus:border-indigo-500 outline-none text-sm bg-transparent transition-all placeholder:text-slate-400"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
        )}
      </div>
    )
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
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
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
            What are your reasons for disagreeing with this suggestion? <span className="text-indigo-600 ml-1">*</span>
            </label>
            
            <div className="space-y-1">
              {FEEDBACK_OPTIONS.map(opt => renderOption(opt))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
              <CheckCircle2 size={12} />
              <span>Please select at least one reason</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <button
            onClick={handleConfirm}
            disabled={!isStepValid}
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
