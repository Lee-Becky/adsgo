import { useState, useEffect } from 'react'
import { Target, Sparkles, CheckCircle2, ChevronRight, Layout, Users, MousePointer2, Megaphone, Smartphone, ShoppingBag, Search, X, Flag, Layers, ChevronLeft, ArrowRight } from 'lucide-react'

const ObjectiveSection = ({ formData, updateFormData, validation, setValidation }) => {
  const [isEventSelectOpen, setIsEventSelectOpen] = useState(false)
  const [eventSearch, setEventSearch] = useState('')
  const [selectorStage, setSelectorStage] = useState('goal') // 'goal' or 'event'

  const campaignObjectives = [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Reach more people' },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site visits' },
    { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Find prospects' },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive transactions' },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50', description: 'Install & usage' }
  ]

  const getAdsetGoals = (objective) => {
    const mapping = {
      awareness_engagement: [
        { value: 'impressions', label: 'Impressions' },
        { value: 'post_engagement', label: 'Post engagement' },
        { value: 'conversations', label: 'Conversations' }
      ],
      traffic: [
        { value: 'impressions', label: 'Impressions' },
        { value: 'link_clicks', label: 'Link clicks' },
        { value: 'page_views', label: 'Page views' }
      ],
      leads: [
        { value: 'leads_landing_page', label: 'Leads within landing-page', needsEvent: true },
        { value: 'instant_form_leads', label: 'Instant form leads' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'calls', label: 'Calls' }
      ],
      sales_conversions: [
        { value: 'in_web_actions', label: 'In-web actions', needsEvent: true }
      ],
      app_promotion: [
        { value: 'installs', label: 'Installs' },
        { value: 'in_app_actions', label: 'In-app actions', needsEvent: true }
      ]
    }
    return mapping[objective] || []
  }

  const allEvents = [
    'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', 
    'CompleteRegistration', 'SubmitApplication', 'Contact', 
    'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
    'Donate', 'FindLocation', 'Schedule', 'StartTrial'
  ]

  const filteredEvents = allEvents.filter(ev => ev.toLowerCase().includes(eventSearch.toLowerCase()))

  const adsetGoals = getAdsetGoals(formData.campaignObjective)
  const currentGoal = adsetGoals.find(g => g.value === formData.adsetGoal)
  const needsEvent = currentGoal?.needsEvent

  useEffect(() => {
    const isValid = !!(formData.campaignObjective && formData.adsetGoal && (!needsEvent || formData.event))
    setValidation(prev => ({ ...prev, objective: isValid }))
  }, [formData.campaignObjective, formData.adsetGoal, formData.event, needsEvent, setValidation])

  const handleGoalSelect = (goal) => {
    updateFormData('adsetGoal', goal.value)
    updateFormData('event', '')
    if (goal.needsEvent) {
      setSelectorStage('event')
    } else {
      setIsEventSelectOpen(false)
    }
  }

  const handleEventSelect = (ev) => {
    updateFormData('event', ev)
    setIsEventSelectOpen(false)
  }

  const resetSelector = () => {
    setSelectorStage('goal')
    setEventSearch('')
  }

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative z-[60] animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Target size={16} />
          </div>
          <h2 className="text-sm font-black text-slate-900">Promote Objective</h2>
        </div>
        {validation.objective && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-12">
        {/* Step 1: Objective Selection */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {campaignObjectives.map((obj) => {
              const Icon = obj.icon
              const isActive = formData.campaignObjective === obj.value
              return (
                <button
                  key={obj.value}
                  onClick={() => {
                    updateFormData('campaignObjective', obj.value)
                    updateFormData('adsetGoal', '')
                    updateFormData('event', '')
                    resetSelector()
                  }}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-indigo-600 bg-slate-900 text-white shadow-xl scale-105 z-10' 
                      : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-indigo-200 hover:bg-white hover:text-slate-600'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-4 shadow-sm ${
                    isActive ? 'bg-indigo-500 text-white shadow-lg' : `${obj.bg} ${obj.color}`
                  }`}>
                    <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black leading-tight mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {obj.label}
                    </p>
                    <p className={`text-[10px] font-medium leading-tight ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {obj.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Consolidated Conversion Event Selector */}
        {formData.campaignObjective && (
          <div className="space-y-8 animate-in slide-in-from-top-4 duration-500 pt-8 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="lg:w-[35%] space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-slate-900 tracking-widest">Conversion Event</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Define the specific event or outcome you want to track and optimize for your campaign.
              </p>
            </div>

            <div className="flex-1">
              <div className="relative z-[100] max-w-lg">
                <div 
                  onClick={() => {
                    setIsEventSelectOpen(!isEventSelectOpen)
                    resetSelector()
                  }}
                  className={`w-full flex items-center justify-between px-6 py-4 h-16 bg-slate-50 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.adsetGoal ? 'border-indigo-500 bg-white shadow-lg' : 'border-slate-100 hover:border-indigo-100 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {formData.adsetGoal ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Sparkles size={16} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{currentGoal?.label}</span>
                          {formData.event && (
                            <>
                              <ChevronRight size={12} className="text-slate-300" />
                              <span className="text-sm font-black text-indigo-600">{formData.event}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Search size={20} className="text-slate-300" />
                        <span className="text-sm font-bold text-slate-300">Choose event or outcome...</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={20} className={`text-slate-300 transition-transform duration-300 ${isEventSelectOpen ? 'rotate-90 text-indigo-500' : ''}`} />
                </div>

                {isEventSelectOpen && (
                  <div className="absolute z-[110] mt-3 w-full bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 animate-in fade-in zoom-in-95 duration-200">
                    
                    {selectorStage === 'goal' ? (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 px-2">Select conv. goal</p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {adsetGoals.map(goal => (
                            <button
                              key={goal.value}
                              onClick={() => handleGoalSelect(goal)}
                              className={`w-full text-left px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between group ${
                                formData.adsetGoal === goal.value ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <span>{goal.label}</span>
                              {goal.needsEvent ? <ArrowRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /> : (formData.adsetGoal === goal.value && <CheckCircle2 size={14} />)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <button onClick={() => setSelectorStage('goal')} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-900">
                            <ChevronLeft size={16} />
                          </button>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest">Back</p>
                        </div>
                        <div className="relative">
                          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Search standard events..."
                            value={eventSearch}
                            onChange={(e) => setEventSearch(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                          {filteredEvents.map(ev => (
                            <button
                              key={ev}
                              onClick={() => handleEventSelect(ev)}
                              className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between group ${
                                formData.event === ev ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              {ev}
                              {formData.event === ev && <CheckCircle2 size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ObjectiveSection
