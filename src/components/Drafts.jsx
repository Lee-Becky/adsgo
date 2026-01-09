import React, { useState, useEffect } from 'react'
import { Edit, Send, Filter, Calendar, ChevronLeft, ChevronRight, X, Check, Info, Sparkles, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'

const Drafts = () => {
  const [dataPeriod, setDataPeriod] = useState('Today')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [tempBudget, setTempBudget] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState(null)

  // Initialize with Today's dates
  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    setCustomStartDate(todayStr)
    setCustomEndDate(todayStr)
  }, [])

  const periodOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Last 3 days', value: 'Last 3 days' },
    { label: 'Last 7 days', value: 'Last 7 days' },
    { label: 'Last 14 days', value: 'Last 14 days' },
    { label: 'Last 30 days', value: 'Last 30 days' }
  ]

  const getPeriodDates = (period) => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (period) {
      case 'Today':
        return { start: todayStr, end: todayStr }
      case 'Last 3 days':
        const last3 = new Date(today)
        last3.setDate(last3.getDate() - 2)
        return { start: last3.toISOString().split('T')[0], end: todayStr }
      case 'Last 7 days':
        const last7 = new Date(today)
        last7.setDate(last7.getDate() - 6)
        return { start: last7.toISOString().split('T')[0], end: todayStr }
      case 'Last 14 days':
        const last14 = new Date(today)
        last14.setDate(last14.getDate() - 13)
        return { start: last14.toISOString().split('T')[0], end: todayStr }
      case 'Last 30 days':
        const last30 = new Date(today)
        last30.setDate(last30.getDate() - 29)
        return { start: last30.toISOString().split('T')[0], end: todayStr }
      default:
        return { start: '', end: '' }
    }
  }

  const handlePeriodClick = (period) => {
    setDataPeriod(period)
    const dates = getPeriodDates(period)
    setCustomStartDate(dates.start)
    setCustomEndDate(dates.end)
  }

  const formatDate = (date) => {
    if (!date) return 'Select date'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const generateCalendar = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = new Date(year, month, 1).getDay()
    
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isStart = dateStr === customStartDate
      const isEnd = dateStr === customEndDate
      const isInRange = customStartDate && customEndDate && dateStr > customStartDate && dateStr < customEndDate
      
      days.push(
        <button
          key={day}
          onClick={() => {
            if (!customStartDate) {
              setCustomStartDate(dateStr)
              setDataPeriod('Custom')
            } else if (!customEndDate && dateStr >= customStartDate) {
              setCustomEndDate(dateStr)
              setDataPeriod('Custom')
            } else {
              setCustomStartDate(dateStr)
              setCustomEndDate('')
              setDataPeriod('Custom')
            }
          }}
          className="relative p-1 text-sm rounded hover:bg-primary/10 transition-colors"
        >
          {day}
          {isStart && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">START</span>}
          {isEnd && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">END</span>}
          {isStart && !isEnd && <div className="absolute inset-0 bg-primary/20 rounded"></div>}
          {isEnd && <div className="absolute inset-0 bg-primary/20 rounded"></div>}
          {isInRange && <div className="absolute inset-0 bg-primary/5 rounded"></div>}
        </button>
      )
    }
    return days
  }
  
  const [draftCampaigns, setDraftCampaigns] = useState([
    {
      id: 1,
      platform: 'Google',
      campaignName: 'Spring Sale 2026',
      dailyBudget: 500,
      audience: 'Young Professionals (25-35)',
      audienceExpanded: true,
      creatives: [
        { id: 'c1', name: 'Banner A', type: 'image' },
        { id: 'c2', name: 'Video B', type: 'video' }
      ],
      product: { type: 'feed', name: 'Electronics' },
      autoScaling: 'Auto_Publish_Enable',
      updateTime: '2026-01-06 14:30:00',
      adsets: [
        {
          id: '1-1',
          name: 'Adset 1 - Spring Promo',
          audience: 'Young Professionals (25-35)',
          audienceExpanded: true,
          creatives: [
            { id: 'c1', name: 'Banner A', type: 'image' },
            { id: 'c2', name: 'Video B', type: 'video' }
          ],
          product: 'Electronics',
          updateTime: '2026-01-06 14:30:00'
        },
        {
          id: '1-2',
          name: 'Adset 2 - Brand Awareness',
          audience: 'Middle-aged Families (35-45)',
          audienceExpanded: true,
          creatives: [
            { id: 'c3', name: 'Banner C', type: 'image' }
          ],
          product: 'Electronics',
          updateTime: '2026-01-06 13:15:00'
        }
      ]
    },
    {
      id: 2,
      platform: 'Meta',
      campaignName: 'Summer Launch Campaign',
      dailyBudget: 800,
      audience: 'Fashion Enthusiasts',
      audienceExpanded: true,
      creatives: [
        { id: 'c4', name: 'Image Ad 1', type: 'image' },
        { id: 'c5', name: 'Carousel Ad', type: 'carousel' }
      ],
      product: { type: 'url', value: 'https://example.com/fashion-products' },
      autoScaling: 'Auto_Publish_Disable',
      updateTime: '2026-01-06 12:00:00',
      adsets: [
        {
          id: '2-1',
          name: 'Adset 1 - Young Adults',
          audience: 'Fashion Enthusiasts (18-24)',
          audienceExpanded: true,
          creatives: [
            { id: 'c4', name: 'Image Ad 1', type: 'image' },
            { id: 'c5', name: 'Carousel Ad', type: 'carousel' }
          ],
          product: 'Fashion',
          updateTime: '2026-01-06 12:00:00'
        },
        {
          id: '2-2',
          name: 'Adset 2 - Young Professionals',
          audience: 'Working Professionals (25-35)',
          audienceExpanded: true,
          creatives: [
            { id: 'c6', name: 'Video Ad 1', type: 'video' }
          ],
          product: 'Fashion',
          updateTime: '2026-01-06 11:30:00'
        }
      ]
    },
    {
      id: 3,
      platform: 'Google',
      campaignName: 'Back to School Promo',
      dailyBudget: 600,
      audience: 'Students & Parents',
      audienceExpanded: true,
      creatives: [
        { id: 'c7', name: 'Display Ad 1', type: 'image' }
      ],
      product: { type: 'feed', name: 'Stationery' },
      autoScaling: 'Auto_Publish_Enable',
      updateTime: '2026-01-05 16:45:00',
      adsets: [
        {
          id: '3-1',
          name: 'Adset 1 - Students',
          audience: 'College Students (18-25)',
          audienceExpanded: true,
          creatives: [
            { id: 'c7', name: 'Display Ad 1', type: 'image' }
          ],
          product: 'Stationery',
          updateTime: '2026-01-05 16:45:00'
        },
        {
          id: '3-2',
          name: 'Adset 2 - Parents',
          audience: 'Parents with Kids (30-45)',
          audienceExpanded: true,
          creatives: [
            { id: 'c8', name: 'Display Ad 2', type: 'image' }
          ],
          product: 'Stationery',
          updateTime: '2026-01-05 15:30:00'
        }
      ]
    }
  ])

  const handleEdit = (id) => {
    console.log('Edit draft:', id)
    // TODO: 实现编辑逻辑
  }

  const handlePublish = (id) => {
    console.log('Publish draft:', id)
    // TODO: 实现发布逻辑
  }

  const handleDelete = (id) => {
    setCampaignToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (campaignToDelete !== null) {
      setDraftCampaigns(prev => prev.filter(campaign => campaign.id !== campaignToDelete))
      setCampaignToDelete(null)
      setDeleteConfirmOpen(false)
    }
  }

  const handleDeleteCancel = () => {
    setCampaignToDelete(null)
    setDeleteConfirmOpen(false)
  }

  const handleBudgetEditStart = (id, currentBudget) => {
    setEditingBudget(id)
    setTempBudget(currentBudget.toString())
  }

  const handleBudgetSave = (id) => {
    const newBudget = parseFloat(tempBudget)
    if (!isNaN(newBudget) && newBudget > 0) {
      setDraftCampaigns(prev =>
        prev.map(campaign =>
          campaign.id === id ? { ...campaign, dailyBudget: newBudget } : campaign
        )
      )
    }
    setEditingBudget(null)
    setTempBudget('')
  }

  const handleBudgetCancel = () => {
    setEditingBudget(null)
    setTempBudget('')
  }

  const handleAutoScalingToggle = (id) => {
    setDraftCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === id ? {
          ...campaign,
          autoScaling: campaign.autoScaling === 'Auto_Publish_Enable' 
            ? 'Auto_Publish_Disable' 
            : 'Auto_Publish_Enable'
        } : campaign
      )
    )
  }

  const formatCurrency = (value) => {
    return `¥${value.toFixed(2)}`
  }

  const getPlatformLogo = (platform) => {
    switch (platform) {
      case 'Google':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )
      case 'Meta':
        return (
          <img 
            src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=20" 
            alt="Meta" 
            width="20" 
            height="20"
            className="inline-block"
          />
        )
      case 'TikTok':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000"/>
          </svg>
        )
      default:
        return <span className="text-xs text-gray-600">{platform}</span>
    }
  }

  const getCreativeIcon = (type) => {
    switch (type) {
      case 'image':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )
      case 'video':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )
      case 'carousel':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Update Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Time
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-left flex items-center justify-between"
              >
                <span>{customStartDate && customEndDate ? `${formatDate(customStartDate)} - ${formatDate(customEndDate)}` : dataPeriod}</span>
                <Calendar size={16} className="text-gray-400" />
              </button>

              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-lg p-4 z-10 w-96">
                  <div className="flex gap-4">
                    {/* Left: Quick Select Buttons */}
                    <div className="w-1/3 flex flex-col gap-2">
                      {periodOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePeriodClick(option.value)}
                          className={`px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                            dataPeriod === option.value
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {/* Right: Calendar */}
                    <div className="flex-1">
                      {/* Calendar Grid */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronLeft size={16} />
                          </button>
                          <span className="font-medium text-sm">
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                          <div>Su</div>
                          <div>Mo</div>
                          <div>Tu</div>
                          <div>We</div>
                          <div>Th</div>
                          <div>Fr</div>
                          <div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendar()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drafts Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[180px]">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-primary min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} />
                    <span>Auto-scaling</span>
                    <div className="relative group inline-block">
                      <Info size={12} className="text-gray-400 cursor-help" />
                      <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Control whether the campaign allows AI to automatically launch. When enabled, AI will automatically launch the campaign at an appropriate time based on performance and budget.
                      </div>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[120px]">
                  Daily Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[200px]">
                  Audience
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[150px]">
                  Creatives
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[100px]">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[180px]">
                  Update Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {draftCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getPlatformLogo(campaign.platform)}
                      </div>
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {campaign.campaignName}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                        <Sparkles size={10} />
                        AI-Auto
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                        campaign.autoScaling === 'Auto_Publish_Enable' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {campaign.autoScaling === 'Auto_Publish_Enable' ? 'Auto_Publish_Enable' : 'Auto_Publish_Disable'}
                      </span>
                      <button
                        onClick={() => handleAutoScalingToggle(campaign.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Toggle Auto-scaling"
                      >
                        {campaign.autoScaling === 'Auto_Publish_Enable' ? (
                          <ToggleRight size={28} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {editingBudget === campaign.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="w-24 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleBudgetSave(campaign.id)}
                          className="text-green-600 hover:text-green-700 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleBudgetCancel}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {formatCurrency(campaign.dailyBudget)}
                        </span>
                        <button
                          onClick={() => handleBudgetEditStart(campaign.id, campaign.dailyBudget)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600">
                      {campaign.audience}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {campaign.creatives.slice(0, 3).map((creative) => (
                        <div key={creative.id} className="relative group">
                          {getCreativeIcon(creative.type)}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {creative.name}
                          </div>
                        </div>
                      ))}
                      {campaign.creatives.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{campaign.creatives.length - 3} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {typeof campaign.product === 'object' ? (
                      campaign.product.type === 'url' ? (
                        <a
                          href={campaign.product.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary-hover hover:underline"
                        >
                          {campaign.product.value}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-600">
                          Feeds: {campaign.product.name}
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-gray-600">
                        {campaign.product}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600">
                      {campaign.updateTime}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(campaign.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublish(campaign.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors"
                      >
                        <Send size={14} />
                        Publish
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {draftCampaigns.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 9 20 9"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
            <p className="text-sm text-gray-500">You haven't created any draft campaigns yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleDeleteCancel}></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete campaign draft</h3>
            <p className="text-gray-600 mb-6">Once deleted, it cannot be recovered. Confirm deletion?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Drafts
