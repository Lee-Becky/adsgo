import React from 'react'
import { Globe, Monitor, Target, DollarSign, BarChart3, ChevronRight } from 'lucide-react'

const MetricCard = ({ icon: Icon, label, value, subValue, colorClass, bgClass }) => (
  <div className="flex-1 min-w-[180px] p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon size={20} />
      </div>
      <span className="text-[11px] font-black text-slate-400 tracking-wider">{label}</span>
    </div>
    <div className="space-y-1">
      <div className="text-lg font-black text-slate-900 truncate">{value || 'Not set'}</div>
      {subValue && <div className="text-[10px] font-bold text-slate-400 truncate">{subValue}</div>}
    </div>
  </div>
)

const ObjectiveOverview = ({ formData }) => {
  // Calculate unique locations
  const allLocations = formData.marketGroups.flatMap(g => g.targetLocations.map(l => l.label || l))
  const uniqueLocations = [...new Set(allLocations)]
  const locationText = uniqueLocations.length > 0 
    ? (uniqueLocations.length > 2 
        ? `${uniqueLocations[0]}, ${uniqueLocations[1]} +${uniqueLocations.length - 2}`
        : uniqueLocations.join(', '))
    : 'No locations'

  // Calculate total budget
  const totalDailyBudget = formData.marketGroups.reduce((acc, group) => {
    if (group.budgetMode === 'unified') {
      return acc + (parseFloat(group.unifiedBudget) || 0)
    } else {
      const splitTotal = Object.values(group.splitBudgets).reduce((s, b) => s + (parseFloat(b) || 0), 0)
      return acc + splitTotal
    }
  }, 0)

  // Platforms (Mocking for now as it's not in formData yet, or use connected status)
  const platforms = [
    { id: 'meta', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
    { id: 'google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' }
  ]

  // KPI Info
  const kpiType = formData.marketGroups[0]?.kpiType || 'ROAS'
  const kpiValue = formData.marketGroups[0]?.unifiedKPI || 'Not set'
  const kpiText = kpiValue !== 'Not set' ? `${kpiValue}${kpiType === 'ROAS' ? 'x' : '$'}` : 'Not set'

  // Objective Label
  const objectiveLabels = {
    'awareness_engagement': 'Awareness',
    'traffic': 'Traffic',
    'leads': 'Leads',
    'sales_conversions': 'Sales',
    'app_promotion': 'App Promo'
  }
  const objectiveLabel = objectiveLabels[formData.campaignObjective] || formData.campaignObjective || 'Objective'

  return (
    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 group/container">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black tracking-[0.2em]">Strategy Overview</div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-400 text-xs font-bold">{formData.campaignObjective ? '' : 'Drafting goal'}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            {objectiveLabel} Strategy
            <ChevronRight className="text-slate-700" size={28} />
          </h1>
        </div>

        <div className="flex items-center gap-6 bg-slate-800/50 backdrop-blur-md p-4 rounded-[24px] border border-white/5">
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard 
          icon={Globe}
          label="Target locations"
          value={uniqueLocations.length > 0 ? `${uniqueLocations.length} locations` : 'Global'}
          subValue={locationText}
          bgClass="bg-blue-50"
          colorClass="text-blue-600"
        />
        
        <MetricCard 
          icon={Monitor}
          label="Ad Platforms"
          value={
            <div className="flex items-center gap-2">
              {platforms.map(p => (
                <img key={p.id} src={p.icon} className="w-5 h-5 rounded-md" alt={p.id} />
              ))}
              <span className="text-xs ml-1 text-slate-400">+{platforms.length}</span>
            </div>
          }
          subValue="Cross-channel reach"
          bgClass="bg-indigo-50"
          colorClass="text-indigo-600"
        />

        <MetricCard 
          icon={Target}
          label="Conversion Events"
          value={formData.event || formData.adsetGoal || 'Purchase'}
          subValue={formData.adsetGoal ? `Goal: ${formData.adsetGoal}` : 'Primary event'}
          bgClass="bg-rose-50"
          colorClass="text-rose-600"
        />

        <MetricCard 
          icon={DollarSign}
          label="Total Daily Budget"
          value={`$${totalDailyBudget.toLocaleString()}`}
          subValue="Allocated across groups"
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600"
        />

        <MetricCard 
          icon={BarChart3}
          label="Target KPI"
          value={kpiText}
          subValue={`Min. target ${kpiType}`}
          bgClass="bg-amber-50"
          colorClass="text-amber-600"
        />
      </div>
    </div>
  )
}

export default ObjectiveOverview
