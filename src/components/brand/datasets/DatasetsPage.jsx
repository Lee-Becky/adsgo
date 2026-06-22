import { useState } from 'react'
import { Database, HardDrive, Monitor, Image, GitMerge } from 'lucide-react'
import OfflineDataTab from './OfflineDataTab'
import AdDatasetTab from './AdDatasetTab'
import CreativeDatasetTab from './CreativeDatasetTab'
import JoinedDatasetTab from './JoinedDatasetTab'

const TABS = [
  { id: 'offline', label: 'Offline Data', icon: HardDrive },
  { id: 'ad', label: 'Ad Account Data', icon: Monitor },
  { id: 'creative', label: 'Creative Data', icon: Image },
  { id: 'joined', label: 'Attribution Data', icon: GitMerge },
]

const DatasetsPage = () => {
  const [activeTab, setActiveTab] = useState('offline')

  const renderTab = () => {
    switch (activeTab) {
      case 'offline': return <OfflineDataTab />
      case 'ad': return <AdDatasetTab />
      case 'creative': return <CreativeDatasetTab />
      case 'joined': return <JoinedDatasetTab />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="px-10 py-4 flex items-center gap-2">
          <Database size={16} className="text-neutral-400 mr-2" />
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-lg'
                    : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active tab content */}
      {renderTab()}
    </div>
  )
}

export default DatasetsPage
