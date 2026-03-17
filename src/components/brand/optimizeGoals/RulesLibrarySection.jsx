import { useState } from 'react'
import { Plus, Lightbulb, Info, Trash2, Loader2, CheckCircle2, Sparkles } from 'lucide-react'

// Mock LLM validation with Chinese + English keyword support
const mockValidateRule = async (text) => {
  await new Promise(r => setTimeout(r, 1500))
  const hasCondition = /(below|above|less|more|under|over|<|>|exceed|if|小于|大于|低于|高于|超过|不足|当)/i.test(text)
  const hasAction = /(reduce|increase|pause|stop|close|cut|boost|raise|double|half|加|减|暂停|提高|降低|关闭|翻倍)/i.test(text)
  const hasTimeRange = /(\d+\s*(day|week|hour|month|d|天|周|小时|月))|近\d+/i.test(text)
  const hasObject = /(campaign|ad\s*set|budget|bid|spend|adset|ad\b|预算|广告|出价|花费)/i.test(text)

  if (hasCondition && hasAction && hasTimeRange && hasObject) {
    return { type: 'Rule' }
  }
  if (hasCondition && hasAction) {
    const improved = generateImprovedRule(text, hasTimeRange, hasObject)
    return { type: 'SemiRule', improved }
  }
  return { type: 'Preference' }
}

const generateImprovedRule = (text, hasTime, hasObj) => {
  const timePart = hasTime ? '' : '近7天'
  const objPart = hasObj ? '' : 'Campaign'
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return `${timePart}ROAS大于3的${objPart}，建议增加预算20%，以扩大高回报广告的投放规模`
  }
  return `For ${objPart}s with the condition "${text}" over the last 7 days, adjust budget accordingly to optimize performance.`
}

const RulesLibrarySection = ({ formData, updateFormData }) => {
  const [newRule, setNewRule] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [recommend, setRecommend] = useState(null)

  const MAX_RULES = 10
  const MAX_CHARACTERS = 500

  // Normalize: support both old string[] and new {text,type}[] format
  const rules = (formData.optimizePreferences || []).map(r =>
    typeof r === 'string' ? { text: r, type: 'Preference' } : r
  )

  const handleAddRule = async () => {
    if (!newRule.trim() || rules.length >= MAX_RULES || isValidating) return
    setRecommend(null)

    const ruleText = newRule.trim()
    setIsValidating(true)

    const result = await mockValidateRule(ruleText)
    setIsValidating(false)

    if (result.type === 'Rule') {
      updateFormData('optimizePreferences', [...rules, { text: ruleText, type: 'Rule' }])
      setNewRule('')
      setRecommend(null)
    } else if (result.type === 'SemiRule') {
      setRecommend({ original: ruleText, improved: result.improved })
    } else {
      updateFormData('optimizePreferences', [...rules, { text: ruleText, type: 'Preference' }])
      setNewRule('')
      setRecommend(null)
    }
  }

  const handleDeleteRule = (index) => {
    updateFormData('optimizePreferences', rules.filter((_, i) => i !== index))
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header */}
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black text-slate-900">Optimize Rules</h2>
          <Info size={16} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
            {rules.length}/{MAX_RULES}
          </span>
          {rules.length > 0 && (
            <div className="text-emerald-500 animate-in zoom-in duration-500">
              <CheckCircle2 size={24} />
            </div>
          )}
        </div>
      </header>

      <div className="p-10 space-y-8">
        {/* Active Rules */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Active Rules</h3>

          {rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-inner border border-dashed border-gray-200 text-gray-400">
              <Info size={20} className="text-gray-300 mb-2" />
              <p className="text-xs font-medium">No customize rules yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[280px] overflow-y-auto pl-3 pt-3 pr-1">
              {rules.map((rule, index) => (
                <div key={index} className="relative bg-gray-50 border border-gray-100 rounded-inner p-4 pr-10 group transition-all duration-200 hover:border-gray-200">
                  {/* Type tag — top-left corner */}
                  {rule.type === 'Rule' ? (
                    <span className="absolute -top-2.5 -left-2.5 px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-sm">Rule</span>
                  ) : (
                    <span className="absolute -top-2.5 -left-2.5 px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm">Preference</span>
                  )}
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteRule(index)}
                    className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-base transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                  <p className="text-sm text-gray-700 leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Rules */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-gray-900">Add Rules</h3>
            <Lightbulb size={14} className="text-amber-400" />
          </div>

          <div className={`relative border rounded-inner transition-all duration-200 ${
            rules.length >= MAX_RULES
              ? 'opacity-50 border-gray-200'
              : 'border-gray-200 focus-within:border-primary-500 focus-within:shadow-primary-focus'
          }`}>
            <textarea
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddRule(); } }}
              placeholder={rules.length >= MAX_RULES ? 'Maximum rules reached' : 'Add new optimization rules that you want...'}
              disabled={rules.length >= MAX_RULES || isValidating}
              rows={4}
              className="w-full bg-transparent border-none p-4 pr-12 pb-8 resize-none focus:ring-0 focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 disabled:cursor-not-allowed"
            />
            {/* + button */}
            <button
              onClick={handleAddRule}
              disabled={rules.length >= MAX_RULES || !newRule.trim() || isValidating}
              className={`absolute top-3 right-3 w-8 h-8 rounded-base border flex items-center justify-center transition-all duration-200 ${
                rules.length >= MAX_RULES || !newRule.trim() || isValidating
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 active:scale-95'
              }`}
            >
              <Plus size={16} />
            </button>
            {/* Bottom row: loading or char count */}
            <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between">
              {isValidating ? (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                  <Loader2 size={12} className="animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">Verifying compliance with spec...</span>
                </div>
              ) : (
                <div />
              )}
              <span className="text-[11px] text-gray-400 font-medium">
                {newRule.length}/{MAX_CHARACTERS}
              </span>
            </div>
          </div>

          {/* Recommend card */}
          {recommend && (
            <div
              className="bg-primary-50/50 border-l-4 border-primary-500 rounded-inner p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-bold text-primary-600">Recommend</span>
                <Sparkles size={12} className="text-amber-400" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{recommend.improved}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RulesLibrarySection
