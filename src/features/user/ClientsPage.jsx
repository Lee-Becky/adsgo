import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Users, ExternalLink, Clock, MoreHorizontal,
} from 'lucide-react'
import MultiBrandCockpit from './MultiBrandCockpit'

/* ═══════════════════════════════════════════════════════════
   ClientsPage — Multi-workspace client overview
   ═══════════════════════════════════════════════════════════ */

const MOCK_CLIENTS = [
  {
    id: 1,
    name: 'LumaFit',
    platforms: ['Meta', 'Google'],
    status: '处理中',
    campaigns: 12,
    monthlySpend: 28500,
    roas: 1.82,
    lastUpdated: '10:30',
  },
  {
    id: 2,
    name: 'Luxe Fashion Co.',
    platforms: ['Meta', 'TikTok'],
    status: '投放中',
    campaigns: 8,
    monthlySpend: 15200,
    roas: 2.85,
    lastUpdated: '5 小时前',
  },
  {
    id: 3,
    name: 'TechGear Pro',
    platforms: ['Google', 'Bing'],
    status: '投放中',
    campaigns: 6,
    monthlySpend: 9800,
    roas: 4.10,
    lastUpdated: '1 天前',
  },
  {
    id: 4,
    name: 'FreshBite Meals',
    platforms: ['Meta'],
    status: '暂停',
    campaigns: 3,
    monthlySpend: 0,
    roas: 0,
    lastUpdated: '5 天前',
  },
  {
    id: 5,
    name: 'EcoHome Living',
    platforms: ['Meta', 'Google', 'TikTok'],
    status: '投放中',
    campaigns: 15,
    monthlySpend: 42000,
    roas: 3.78,
    lastUpdated: '30 分钟前',
  },
]

const PLATFORM_COLORS = {
  Meta: 'bg-blue-50 text-blue-700',
  Google: 'bg-red-50 text-red-700',
  TikTok: 'bg-neutral-100 text-neutral-800',
  Bing: 'bg-teal-50 text-teal-700',
}

const ClientsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClients = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <MultiBrandCockpit />
      {/* Search */}
      <div className="flex justify-end">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索客户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 text-body text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 w-64"
          />
        </div>
      </div>

      {/* Client cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            onClick={() => navigate(`/workspace/${encodeURIComponent(client.name)}/plan/media-plan`)}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                  <span className="text-lg">🐾</span>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                    {client.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                    client.status !== '暂停' ? 'text-success-600' : 'text-neutral-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      client.status !== '暂停' ? 'bg-success-500' : 'bg-neutral-300'
                    }`} />
                    {client.status}
                  </span>
                </div>
              </div>
              <ExternalLink size={14} className="text-neutral-300 group-hover:text-primary-400 transition-colors" />
            </div>

            {/* Platforms */}
            <div className="flex flex-wrap gap-1 mb-3">
              {client.platforms.map(p => (
                <span key={p} className={`text-[10px] font-semibold px-2 py-0.5 rounded ${PLATFORM_COLORS[p]}`}>
                  {p}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100">
              <div>
                <p className="text-[10px] text-neutral-400">Campaign</p>
                <p className="text-sm font-semibold text-neutral-800 tabular-nums">{client.campaigns}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400">月花费</p>
                <p className="text-sm font-semibold text-neutral-800 tabular-nums">
                  ${client.monthlySpend.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400">ROAS</p>
                <p className={`text-sm font-semibold tabular-nums ${
                  client.roas >= 3.5 ? 'text-success-600' : client.roas >= 2.5 ? 'text-warning-600' : client.roas > 0 ? 'text-danger-600' : 'text-neutral-400'
                }`}>
                  {client.roas > 0 ? `${client.roas}x` : '—'}
                </p>
              </div>
            </div>

            {/* Updated */}
            <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
              <Clock size={10} /> 更新 {client.lastUpdated}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsPage
