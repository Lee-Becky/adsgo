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
    businessScale: 'Annual Revenue: $10M - $50M',
    slogan: 'Care, Play, and Discover!',
    description: 'Neopets is an immersive virtual world where users create and care for virtual pets.',
    businessModel: ['Freemium', 'Virtual Goods'],
    nicheMarket: ['Millennial Nostalgia', 'Kids'],
    brandFeatures: ['Family-friendly', 'Collectible-driven', 'Community-centric'],
    audienceTags: ['Gamers', 'Collectors', 'Nostalgia Seekers'],
    brandLocation: 'cn',
    mediaPlatforms: [],
    // Brand Kits fields
    colors: [
      { id: 1, hex: '#5C3A21', label: 'Primary' },
      { id: 2, hex: '#A08E7E', label: 'Secondary 1' },
      { id: 3, hex: '#E5B27F', label: 'Secondary 2' }
    ],
    fonts: ['Noto Sans Display', 'Noto Serif Japanese', 'Jost', 'Arial'],
    visualStyle: 'Heritage-inspired designs with modern comfort',
    tone: 'Direct and informative, focusing on practical details',
    forbiddenWords: ['cheap', 'low quality'],
    preferredPhrases: ['Heritage', 'Timeless aesthetics', 'Functional clothing'],
    languagePreference: ['English (US)']
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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Top Floating Save Area */}
      <div className="sticky top-0 z-50 py-3 px-10 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-end">
          <button 
            onClick={handleSave} 
            className="pointer-events-auto bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Save Info
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-10 py-12">
          <FoundationTab data={formData} onChange={handleBaseChange} />
        </div>
      </main>
    </div>
  )
}

export default BasicInfo
