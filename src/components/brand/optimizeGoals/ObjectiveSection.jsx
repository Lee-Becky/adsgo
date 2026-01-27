import { useState, useEffect } from 'react'
import { Target, Sparkles, CheckCircle2, ChevronRight, Layout, Users, MousePointer2, Megaphone, Smartphone, ShoppingBag, Search, X } from 'lucide-react'

const ObjectiveSection = ({ formData, updateFormData, validation, setValidation }) => {
  const [isEventSearchOpen, setIsEventSelectOpen] = useState(false)
  const [eventSearch, setEventSearch] = useState('')

  const campaignObjectives = [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50' },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50' }
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
  const showEventSelection = currentGoal?.needsEvent

  useEffect(() => {
    const isValid = !!(formData.campaignObjective && formData.adsetGoal && (!showEventSelection || formData.event))
    setValidation(prev => ({ ...prev, objective: isValid }))
  }, [formData.campaignObjective, formData.adsetGoal, formData.event, showEventSelection, setValidation])

  return (
    <div className="animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <Target size={20} className="text-slate-900" />
          <h2 className="text-sm font-black text-slate-900">Objective</h2>
        </div>
        {validation.objective && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-12">
        <div className="space-y-6">
          <span className="text-sm font-bold text-slate-500 px-1">Campaign目标</span>
          <div className="grid grid-cols-3 gap-3">
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
                  }}
                  className={`relative group h-20 px-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    isActive 
                      ? 'border-indigo-600 bg-slate-900 text-white shadow-xl' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-200 hover:bg-white hover:text-slate-600'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-white text-slate-300 shadow-sm border border-slate-50'}`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-black text-left leading-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {obj.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {formData.campaignObjective && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pt-4 border-t border-slate-50">
            <span className="text-sm font-bold text-slate-500 px-1">adset成效目标</span>
            <div className="grid grid-cols-2 gap-3">
              {adsetGoals.map((goal) => {
                const isActive = formData.adsetGoal === goal.value
                return (
                  <button
                    key={goal.value}
                    onClick={() => {
                      updateFormData('adsetGoal', goal.value)
                      updateFormData('event', '')
                    }}
                    className={`px-6 h-16 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className={`text-xs font-black ${isActive ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {goal.label}
                    </span>
                    {isActive && <CheckCircle2 size={14} className="text-indigo-600" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {showEventSelection && formData.adsetGoal && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pt-4 border-t border-slate-50">
            <span className="text-sm font-bold text-slate-500 px-1">Event</span>
            <div className="relative z-[100] max-w-md">
              <div 
                onClick={() => setIsEventSelectOpen(!isEventSearchOpen)}
                className={`w-full flex items-center justify-between px-6 h-16 bg-slate-50 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.event ? 'border-indigo-500 bg-white shadow-md' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  {formData.event ? (
                    <>
                      <Sparkles size={16} className="text-indigo-500" />
                      <span className="text-xs font-black text-slate-900">{formData.event}</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-300">Choose conversion event...</span>
                    </>
                  )}
                </div>
                <ChevronRight size={18} className={`text-slate-300 transition-transform duration-300 ${isEventSearchOpen ? 'rotate-90' : ''}`} />
              </div>

              {isEventSearchOpen && (
                <div className="absolute z-[110] mt-3 w-full bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Search standard events..."
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-1">
                    {filteredEvents.map(ev => (
                      <button
                        key={ev}
                        onClick={(e) => {
                          e.stopPropagation()
                          updateFormData('event', ev)
                          setIsEventSelectOpen(false)
                        }}
                        className={`w-full text-left p-3.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group ${
                          formData.event === ev ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {ev}
                        {formData.event === ev && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ObjectiveSection
