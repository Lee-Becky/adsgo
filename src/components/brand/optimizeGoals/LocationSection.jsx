import { useState, useEffect } from 'react'
import { Globe, Plus, X, Search, CheckCircle2 } from 'lucide-react'

const LocationSection = ({ formData, updateFormData, validation, setValidation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const availableLocations = [
    { value: 'us', label: 'United States', region: 'North America' },
    { value: 'ca', label: 'Canada', region: 'North America' },
    { value: 'uk', label: 'United Kingdom', region: 'Europe' },
    { value: 'de', label: 'Germany', region: 'Europe' },
    { value: 'fr', label: 'France', region: 'Europe' },
    { value: 'au', label: 'Australia', region: 'Oceania' },
    { value: 'jp', label: 'Japan', region: 'Asia' },
    { value: 'kr', label: 'South Korea', region: 'Asia' },
    { value: 'sg', label: 'Singapore', region: 'Asia' },
    { value: 'cn', label: 'China', region: 'Asia' },
    { value: 'in', label: 'India', region: 'Asia' },
    { value: 'br', label: 'Brazil', region: 'South America' },
    { value: 'mx', label: 'Mexico', region: 'North America' },
    { value: 'ae', label: 'United Arab Emirates', region: 'Middle East' }
  ]

  const filteredLocations = availableLocations.filter(loc => 
    loc.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addLocation = (location) => {
    if (!formData.targetLocations.find(l => l.value === location.value)) {
      updateFormData('targetLocations', [...formData.targetLocations, location])
    }
    setShowLocationDropdown(false)
    setSearchQuery('')
  }

  const removeLocation = (locationValue) => {
    updateFormData('targetLocations', formData.targetLocations.filter(l => l.value !== locationValue))
  }

  useEffect(() => {
    const isValid = formData.targetLocations.length > 0
    setValidation(prev => ({ ...prev, locations: isValid }))
  }, [formData.targetLocations, setValidation])

  return (
    <div className="animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-slate-900" />
          <h2 className="text-sm font-black text-slate-900">Target Locations</h2>
        </div>
        {validation.locations && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-6">
        <div className="relative z-[100] group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowLocationDropdown(true)
            }}
            onFocus={() => setShowLocationDropdown(true)}
            placeholder="Search and add target regions..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          
          {showLocationDropdown && (
            <div className="absolute z-[110] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-h-64 overflow-y-auto animate-in zoom-in-95 duration-200">
              {filteredLocations.map((location) => {
                const isSelected = formData.targetLocations.find(l => l.value === location.value)
                return (
                  <button
                    key={location.value}
                    onClick={() => addLocation(location)}
                    disabled={isSelected}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-all flex items-center justify-between ${
                      isSelected ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black text-slate-900">{location.label}</p>
                      <p className="text-[10px] font-bold text-slate-400">{location.region}</p>
                    </div>
                    {!isSelected && <Plus size={16} className="text-slate-300" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.targetLocations.map((location) => (
            <span 
              key={location.value} 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 flex items-center gap-2 animate-in zoom-in duration-300 shadow-sm"
            >
              {location.label}
              <button onClick={() => removeLocation(location.value)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationSection
