import React from 'react'
import { Globe, Monitor, Target, DollarSign, ChevronRight } from 'lucide-react'

const MetricCard = ({ icon: Icon, label, value, subValue, colorClass, bgClass }) => (
  <div className="flex-1 min-w-[180px] p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon size={20} />
      </div>
      <span className="text-[11px] font-black text-slate-400">{label}</span>
    </div>
    <div className="space-y-1">
      <div className="text-lg font-black text-slate-900 truncate">
        {typeof value === 'string' || typeof value === 'number' ? (value || 'Not set') : value}
      </div>
      {subValue && <div className="text-[10px] font-bold text-slate-400 truncate">{subValue}</div>}
    </div>
  </div>
)

const ObjectiveOverview = ({ formData }) => {
  // Aggregate Locations
  const allLocations = formData.marketGroups.flatMap(g => g.targetLocations.map(l => l.label || l))
  const uniqueLocations = [...new Set(allLocations)]
  const locationText = uniqueLocations.length > 0 
    ? (uniqueLocations.length > 2 
        ? `${uniqueLocations[0]}, ${uniqueLocations[1]} +${uniqueLocations.length - 2}`
        : uniqueLocations.join(', '))
    : 'No locations'

  // Aggregate Platforms
  const platformIcons = {
    'meta': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
    'google': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
    'tiktok': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
    'bing': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256',
    'applovin': 'https://www.google.com/s2/favicons?domain=applovin.com&sz=128'
  }
  const allPlatforms = formData.marketGroups.flatMap(g => g.platforms || [])
  const uniquePlatforms = [...new Set(allPlatforms)]

  // Aggregate Conversion Events
  const allEvents = formData.marketGroups.map(g => g.event || g.adsetGoal).filter(Boolean)
  const uniqueEvents = [...new Set(allEvents)]
  const eventText = uniqueEvents.length > 0
    ? (uniqueEvents.length > 1 ? `${uniqueEvents[0]} +${uniqueEvents.length - 1}` : uniqueEvents[0])
    : 'No events'

  // Calculate total budget
  const totalDailyBudget = formData.marketGroups.reduce((acc, group) => {
    return acc + (parseFloat(group.budget ?? group.unifiedBudget) || 0)
  }, 0)

  // Objective Summary (based on first group or general)
  const firstGroup = formData.marketGroups[0] || {}
  const objectiveLabels = {
    'awareness_engagement': 'Awareness',
    'traffic': 'Traffic',
    'leads': 'Leads',
    'sales_conversions': 'Sales',
    'app_promotion': 'App Promo'
  }
  const objectiveLabel = objectiveLabels[firstGroup.campaignObjective] || firstGroup.campaignObjective || 'Strategy'

  return (
    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 group/container">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black">Strategy Overview</div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-400 text-xs font-bold">{formData.marketGroups.length} Strategy Groups</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {uniquePlatforms.map(id => (
                <img key={id} src={platformIcons[id]} className="w-5 h-5 rounded-md border border-white/10" alt={id} />
              ))}
              {uniquePlatforms.length === 0 && <span className="text-xs text-slate-400">None</span>}
            </div>
          }
          subValue={`${uniquePlatforms.length} ad platforms`}
          bgClass="bg-indigo-50"
          colorClass="text-indigo-600"
        />

        <MetricCard 
          icon={Target}
          label="Conversion Events"
          value={uniqueEvents.length > 0 ? `${uniqueEvents.length} events` : 'Not set'}
          subValue={eventText}
          bgClass="bg-rose-50"
          colorClass="text-rose-600"
        />

        <MetricCard 
          icon={DollarSign}
          label="Total Daily Budget"
          value={`$${totalDailyBudget.toLocaleString()}`}
          subValue="Sum of all groups"
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600"
        />
      </div>
    </div>
  )
}

export default ObjectiveOverview
