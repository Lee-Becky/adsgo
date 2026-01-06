import { useState } from 'react'
import { ArrowLeft, Save, Plus, X, Globe, Building2, Users, DollarSign, TrendingUp, Target, Zap, Layers, Edit2, ChevronDown, Check, Star, Award, PieChart } from 'lucide-react'

const BrandDetailEdit = ({ brand, onSave, onCancel }) => {
  // 编辑状态
  const [formData, setFormData] = useState({
    // 品牌基本信息
    logo: brand.logo,
    name: brand.name,
    website: 'https://neopets.com',
    industry: brand.industry,
    description: 'Neopets is a virtual pet website where users can create and care for virtual pets.',
    
    // 企业概况
    lifecycle: 'Growth',
    companySize: '51-200',
    targetMarket: 'Global',
    businessModel: 'Freemium',
    
    // 品牌基因
    brandTone: ['Playful', 'Nostalgic', 'Community-driven'],
    keywords: ['virtual pets', 'gaming', 'community', 'nostalgia'],
    valueProposition: 'Create, care, and play with your virtual pets in a vibrant online world.',
    
    // 目标受众
    audiences: [
      {
        id: 1,
        name: 'Young Gamers',
        description: 'Children and teenagers who enjoy virtual pet games and online communities.',
        image: '🎮'
      },
      {
        id: 2,
        name: 'Nostalgic Users',
        description: 'Adults who grew up with Neopets and are returning for nostalgia.',
        image: '💭'
      }
    ],
    
    // 产品特性
    features: [
      {
        id: 1,
        name: 'Virtual Pet Creation',
        description: 'Users can create and customize their own virtual pets with unique appearances.'
      },
      {
        id: 2,
        name: 'Games & Activities',
        description: 'A wide variety of games and activities to keep pets happy and engaged.'
      }
    ],
    
    // 竞争对手
    competitors: ['Webkinz', 'Club Penguin', 'Moshi Monsters'],
    
    // 触达生态
    channels: [
      { name: 'Social Media', percentage: 35 },
      { name: 'Email Marketing', percentage: 25 },
      { name: 'Content Marketing', percentage: 20 },
      { name: 'Paid Advertising', percentage: 20 }
    ],
    
    // 影响力分析
    impact: {
      revenue: {
        score: 8,
        notes: 'Strong revenue from premium subscriptions and virtual goods'
      },
      cost: {
        score: 6,
        notes: 'Moderate operational costs for server infrastructure'
      },
      policy: {
        score: 7,
        notes: 'Compliant with child protection regulations'
      },
      technology: {
        score: 9,
        notes: 'Advanced gaming technology and AI integration'
      }
    }
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImpactChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      impact: {
        ...prev.impact,
        [category]: {
          ...prev.impact[category],
          [field]: value
        }
      }
    }))
  }

  const toggleBrandTone = (tone) => {
    setFormData(prev => ({
      ...prev,
      brandTone: prev.brandTone.includes(tone)
        ? prev.brandTone.filter(t => t !== tone)
        : [...prev.brandTone, tone]
    }))
  }

  const addAudience = () => {
    setFormData(prev => ({
      ...prev,
      audiences: [...prev.audiences, { id: Date.now(), name: '', description: '', image: '👤' }]
    }))
  }

  const updateAudience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      audiences: prev.audiences.map(a => a.id === id ? { ...a, [field]: value } : a)
    }))
  }

  const removeAudience = (id) => {
    setFormData(prev => ({
      ...prev,
      audiences: prev.audiences.filter(a => a.id !== id)
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { id: Date.now(), name: '', description: '' }]
    }))
  }

  const updateFeature = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, [field]: value } : f)
    }))
  }

  const removeFeature = (id) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id)
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl shadow-lg">
              {formData.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
              <p className="text-base text-gray-500 mt-1">Edit brand details and settings</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Basic Info */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe size={20} className="text-primary" />
              </div>
              Brand Information
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="Gaming">Gaming</option>
                    <option value="Technology">Technology</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Building2 size={20} className="text-blue-500" />
              </div>
              Company Overview
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lifecycle Stage</label>
                <select
                  value={formData.lifecycle}
                  onChange={(e) => handleChange('lifecycle', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="Startup">Startup</option>
                  <option value="Growth">Growth</option>
                  <option value="Mature">Mature</option>
                  <option value="Decline">Decline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleChange('companySize', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Market</label>
                <select
                  value={formData.targetMarket}
                  onChange={(e) => handleChange('targetMarket', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="National">National</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Model</label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => handleChange('businessModel', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="Freemium">Freemium</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Transaction">Transaction</option>
                  <option value="Advertising">Advertising</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand DNA */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Zap size={20} className="text-purple-500" />
              </div>
              Brand DNA
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Brand Tone</label>
              <div className="flex flex-wrap gap-3">
                {['Playful', 'Nostalgic', 'Community-driven', 'Professional', 'Innovative', 'Trustworthy'].map(tone => (
                  <button
                    key={tone}
                    onClick={() => toggleBrandTone(tone)}
                    className={`px-5 py-2.5 rounded-xl transition-all font-medium ${
                      formData.brandTone.includes(tone)
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.brandTone.includes(tone) && <Check size={14} className="inline mr-1" />}
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={formData.keywords.join(', ')}
                onChange={(e) => handleChange('keywords', e.target.value.split(',').map(k => k.trim()))}
                placeholder="Separate keywords with commas"
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Value Proposition</label>
              <textarea
                value={formData.valueProposition}
                onChange={(e) => handleChange('valueProposition', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Target Audiences */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Target size={20} className="text-green-500" />
              </div>
              Target Audiences
            </h2>
            
            <div className="space-y-4">
              {formData.audiences.map(audience => (
                <div key={audience.id} className="bg-white border-2 border-border rounded-xl p-5 relative shadow-sm">
                  <button
                    onClick={() => removeAudience(audience.id)}
                    className="absolute top-3 right-3 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <X size={18} className="text-gray-400 group-hover:text-red-500" />
                  </button>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
                      {audience.image}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Audience Name</label>
                        <input
                          type="text"
                          value={audience.name}
                          onChange={(e) => updateAudience(audience.id, 'name', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                          value={audience.description}
                          onChange={(e) => updateAudience(audience.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={addAudience}
              className="mt-5 flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add Audience</span>
            </button>
          </div>

          {/* Product Features */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Layers size={20} className="text-orange-500" />
              </div>
              Product Features
            </h2>
            
            <div className="space-y-4">
              {formData.features.map(feature => (
                <div key={feature.id} className="bg-white border-2 border-border rounded-xl p-5 relative shadow-sm">
                  <button
                    onClick={() => removeFeature(feature.id)}
                    className="absolute top-3 right-3 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <X size={18} className="text-gray-400 group-hover:text-red-500" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Feature Name</label>
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={addFeature}
              className="mt-5 flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add Feature</span>
            </button>
          </div>
        </div>

        {/* Right Column - Impact & Stats */}
        <div className="space-y-6">
          {/* Impact Analysis */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <PieChart size={20} className="text-red-500" />
              </div>
              Impact Analysis
            </h2>
            
            <div className="space-y-4">
              {Object.entries(formData.impact).map(([key, value]) => (
                <div key={key} className="bg-white border-2 border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 capitalize flex items-center gap-2">
                      <Award size={16} className="text-primary" />
                      {key}
                    </h3>
                    <div className={`w-12 h-12 rounded-xl ${getScoreColor(value.score)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {value.score}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Score (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={value.score}
                        onChange={(e) => handleImpactChange(key, 'score', parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                      <textarea
                        value={value.notes}
                        onChange={(e) => handleImpactChange(key, 'notes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitors */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-yellow-500" />
              </div>
              Competitors
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Competitor Names</label>
              <textarea
                value={formData.competitors.join('\n')}
                onChange={(e) => handleChange('competitors', e.target.value.split('\n').filter(c => c.trim()))}
                rows={6}
                placeholder="Enter each competitor on a new line"
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandDetailEdit
