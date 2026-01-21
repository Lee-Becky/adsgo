import { useState } from 'react'
import { 
  Save, Upload, X, Plus, Globe, Briefcase, MapPin, Layers, Sparkles, 
  MessageSquare, UserSquare2, Megaphone, Check, ChevronDown, Fingerprint
} from 'lucide-react'
import FoundationTab from './brand/FoundationTab'

const BasicInfo = ({ onSave, onCancel }) => {
  console.log('BasicInfo component rendered')
  const [formData, setFormData] = useState({
    name: 'Neopets',
    logos: ['🐾', '🎨', '🚀'], 
    domain: 'neopets.com',
    businessType: 'online_shopping',
    subIndustry: 'Virtual Pets & Gaming',
    businessScale: '51-200 employees',
    websiteLanguage: [],
    slogan: 'Care, Play, and Discover!',
    description: 'Neopets is an immersive virtual world where users create and care for virtual pets.',
    businessModel: ['Freemium', 'Virtual Goods'],
    nicheMarket: 'Millennial Nostalgia & Kids',
    brandFeatures: ['Family-friendly', 'Collectible-driven', 'Community-centric'],
    audienceTags: ['Gamers', 'Collectors', 'Nostalgia Seekers'],
    mediaPlatforms: ['Meta', 'TikTok', 'Instagram'],
    brandLocation: 'cn'
  })

  const handleBaseChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Saving basic info:', formData)
    if (onSave) {
      onSave(formData)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-10 py-12">
          <FoundationTab data={formData} onChange={handleBaseChange} />
        </div>
      </main>

      {/* Bottom Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 py-4 px-10 shrink-0">
        <div className="max-w-[1400px] mx-auto flex justify-center">
          <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg">
            Save Assets
          </button>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo
