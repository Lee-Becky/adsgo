import { Globe, Monitor, Target, DollarSign, Pencil } from 'lucide-react'
import { OBJECTIVE_OVERVIEW } from './mockData'

const platformIcons = {
  meta: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
  google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
  tiktok: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
  bing: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256'
}

const formatList = (items, maxShow = 2) => {
  if (!items || items.length === 0) return { text: 'Not set', sub: null }
  const shown = items.slice(0, maxShow).join(', ')
  const remaining = items.length - maxShow
  return {
    text: shown,
    sub: remaining > 0 ? `+${remaining} more` : null
  }
}

const MetricCard = ({ icon: Icon, label, children, bgClass, colorClass }) => (
  <div className="bg-white rounded-lg border border-primary-100 p-3.5">
    <div className="flex items-center gap-2.5 mb-2.5">
      <div className={`w-8 h-8 rounded-lg ${bgClass} ${colorClass} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    {children}
  </div>
)

const ObjectiveOverviewMini = ({ onEdit }) => {
  const data = OBJECTIVE_OVERVIEW
  const loc = formatList(data.locations, 2)
  const evt = formatList(data.conversionEvents, 1)

  return (
    <div className="bg-primary-50 rounded-[20px] border border-primary-200 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 rounded-full bg-primary-500" />
          <h3 className="text-base font-bold text-gray-900">Optimize Goal</h3>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="p-5 grid grid-cols-4 gap-3">
        {/* Target Locations */}
        <MetricCard icon={Globe} label="Target Locations" bgClass="bg-blue-50" colorClass="text-blue-500">
          <div className="text-sm font-semibold text-gray-900 truncate">{loc.text}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            {data.locations.length} locations{loc.sub && <span className="ml-1 text-primary-500 font-medium">{loc.sub}</span>}
          </div>
        </MetricCard>

        {/* Ad Platforms */}
        <MetricCard icon={Monitor} label="Ad Platforms" bgClass="bg-primary-50" colorClass="text-primary-500">
          <div className="flex items-center gap-1.5">
            {data.platforms.map(id => (
              <img key={id} src={platformIcons[id]} className="w-5 h-5 rounded border border-gray-200" alt={id} />
            ))}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{data.platforms.length} platform{data.platforms.length > 1 ? 's' : ''}</div>
        </MetricCard>

        {/* Conversion Events */}
        <MetricCard icon={Target} label="Conversion Events" bgClass="bg-error-50" colorClass="text-error-500">
          <div className="text-sm font-semibold text-gray-900 truncate">{evt.text}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            {data.conversionEvents.length} event{data.conversionEvents.length > 1 ? 's' : ''}{evt.sub && <span className="ml-1 text-primary-500 font-medium">{evt.sub}</span>}
          </div>
        </MetricCard>

        {/* Daily Budget */}
        <MetricCard icon={DollarSign} label="Daily Budget" bgClass="bg-success-50" colorClass="text-success-500">
          <div className="text-sm font-semibold text-gray-900">${data.totalDailyBudget.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Sum of all groups</div>
        </MetricCard>
      </div>
    </div>
  )
}

export default ObjectiveOverviewMini
