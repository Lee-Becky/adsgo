import { useState, useEffect } from 'react'
import { 
  Layout, 
  Target, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Activity, 
  Info, 
  Calendar, 
  ChevronDown, 
  Edit2,
  AlertCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Sparkles
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const Dashboard = ({ selectedBrand, onPageChange, onEditBrandConfig }) => {
  const [dataPeriod, setDataPeriod] = useState('Last 7 days')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState(['spend', 'roas'])
  const [autoBudgetTransfer, setAutoBudgetTransfer] = useState(false)
  const [autoCampaignLaunch, setAutoCampaignLaunch] = useState(false)
  const [autoBudgetEnabled, setAutoBudgetEnabled] = useState(false)
  const [dailyBudget, setDailyBudget] = useState('200')
  const [hoveredAccount, setHoveredAccount] = useState(null)

  // Initialize with Last 7 days
  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const last7 = new Date(today)
    last7.setDate(last7.getDate() - 6)
    const last7Str = last7.toISOString().split('T')[0]
    setCustomStartDate(last7Str)
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
  // Account data
  const accounts = {
    meta: {
      logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
      accounts: [
        { name: 'AdsGo 01', id: '12345678' },
        { name: 'AdsGo 02', id: '34523456' },
        { name: 'AdsGo 03', id: '56789012' },
        { name: 'AdsGo 04', id: '78901234' }
      ]
    },
    google: {
      logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
      accounts: [
        { name: 'AdsGo 01', id: '98765432' },
        { name: 'AdsGo 02', id: '87654321' },
        { name: 'AdsGo 03', id: '76543210' },
        { name: 'AdsGo 04', id: '65432109' },
        { name: 'AdsGo 05', id: '54321098' }
      ]
    }
  }

  const metrics = [
    { key: 'spend', label: 'Spend', value: '$1,310', color: '#7033F5' },
    { key: 'cpm', label: 'CPM', value: '$8.50', color: '#D946EF' },
    { key: 'ctr', label: 'CTR', value: '2.1%', color: '#10B981' },
    { key: 'cost_conv', label: 'Cost/conv.', value: '$4.20', color: '#F59E0B' },
    { key: 'roas', label: 'ROAS', value: '420%', color: '#3B82F6' },
  ]

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricKey)) {
        // Don't allow deselecting if only 1 metric is selected
        if (prev.length === 1) return prev
        return prev.filter(key => key !== metricKey)
      } else {
        // Don't allow selecting more than 5 metrics
        if (prev.length >= 5) return prev
        return [...prev, metricKey]
      }
    })
  }

  // Generate chart data for all metrics
  const generateChartData = () => {
    const days = 7
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      data.push({
        date: dateLabel,
        spend: Math.floor(150 + Math.random() * 100),
        cpm: (7 + Math.random() * 3).toFixed(2),
        ctr: (1.5 + Math.random() * 1.5).toFixed(1),
        cost_conv: (3 + Math.random() * 3).toFixed(2),
        roas: (3 + Math.random() * 3).toFixed(1)
      })
    }
    return data
  }

  const performanceChartData = generateChartData()

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200">
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">{entry.name}:</span>
                <span className="text-sm font-bold text-gray-900">
                  {entry.name === 'Spend' || entry.name === 'CPM' || entry.name === 'Cost/conv.' 
                    ? `$${entry.value}` 
                    : entry.name === 'CTR' || entry.name === 'ROAS'
                      ? `${entry.value}%`
                      : entry.value
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  const optimizationItems = [
    {
      id: 1,
      title: 'Brand Promotion Campaign',
      description: '建议增加预算至 $800/天',
      type: 'increase'
    },
    {
      id: 2,
      title: 'Retargeting Campaign',
      description: '建议暂停低效广告组',
      type: 'pause'
    },
    {
      id: 3,
      title: 'New Product Launch',
      description: '建议立即启动新广告组',
      type: 'launch'
    }
  ]

  // Generate daily performance data based on selected date range
  const generateDailyPerformanceData = () => {
    const startDate = customStartDate ? new Date(customStartDate) : new Date()
    const endDate = customEndDate ? new Date(customEndDate) : new Date()
    const data = []
    
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateLabel = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      
      // Generate random performance data
      const impressions = Math.floor(30000 + Math.random() * 40000)
      const clicks = Math.floor(impressions * (0.015 + Math.random() * 0.02))
      const spend = Math.floor(100 + Math.random() * 400)
      const cpm = (spend / impressions) * 1000
      const cpc = spend / clicks
      const ctr = (clicks / impressions) * 100
      const conversions = Math.floor(clicks * (0.03 + Math.random() * 0.05))
      const costConv = spend / conversions
      const convRate = (conversions / clicks) * 100
      const convValue = conversions * (10 + Math.random() * 5)
      const roas = convValue / spend
      
      data.push({
        date: dateLabel,
        dailyBudget: parseInt(dailyBudget),
        spend: spend.toFixed(2),
        impressions: impressions,
        cpm: cpm.toFixed(2),
        clicks: clicks,
        cpc: cpc.toFixed(2),
        ctr: ctr.toFixed(2),
        conversions: conversions,
        costConv: costConv.toFixed(2),
        convRate: convRate.toFixed(2),
        convValue: convValue.toFixed(2),
        roas: roas.toFixed(2)
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return data.reverse() // Show most recent dates first
  }

  const dailyPerformanceData = generateDailyPerformanceData()

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Top Banner - Intelligently optimized config */}
      <div className="bg-gradient-to-r from-primary/5 via-purple-50/50 to-blue-50/30 rounded-xl border border-primary/20 shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layout className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Intelligently optimized config</h2>
              <p className="text-sm text-gray-600 mt-1">AdsGo will monitor, analyze, and intelligently optimize based on the following configuration.</p>
            </div>
          </div>
          <button 
            onClick={onEditBrandConfig}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
          >
            <Edit2 size={14} />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold">Monitoring ad accounts</p>
            
            {/* Meta Accounts */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredAccount('meta')}
              onMouseLeave={() => setHoveredAccount(null)}
            >
              <div className="flex items-center gap-2 cursor-help">
                <img 
                  src={accounts.meta.logoUrl} 
                  alt="Meta" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {accounts.meta.accounts.slice(0, 2).map(acc => `${acc.name} (${acc.id})`).join(', ')}
                  {accounts.meta.accounts.length > 2 && '...'}
                </span>
              </div>
              
              {/* Hover Tooltip */}
              {hoveredAccount === 'meta' && (
                <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-border rounded-lg shadow-xl p-3 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                    <img 
                      src={accounts.meta.logoUrl} 
                      alt="Meta" 
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Meta Accounts</span>
                  </div>
                  <div className="space-y-1">
                    {accounts.meta.accounts.map((account, idx) => (
                      <div key={idx} className="text-xs text-gray-700">
                        {account.name} ({account.id})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Google Accounts */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredAccount('google')}
              onMouseLeave={() => setHoveredAccount(null)}
            >
              <div className="flex items-center gap-2 cursor-help">
                <img 
                  src={accounts.google.logoUrl} 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {accounts.google.accounts.slice(0, 2).map(acc => `${acc.name} (${acc.id})`).join(', ')}
                  {accounts.google.accounts.length > 2 && '...'}
                </span>
              </div>
              
              {/* Hover Tooltip */}
              {hoveredAccount === 'google' && (
                <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-border rounded-lg shadow-xl p-3 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                    <img 
                      src={accounts.google.logoUrl} 
                      alt="Google" 
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Google Accounts</span>
                  </div>
                  <div className="space-y-1">
                    {accounts.google.accounts.map((account, idx) => (
                      <div key={idx} className="text-xs text-gray-700">
                        {account.name} ({account.id})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Target className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Conv. goal</p>
              <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-2">
                Max conversions-purchase
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">KPI</p>
              <p className="text-sm font-medium text-gray-900 mt-1">ROAS 200%</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <DollarSign className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Daily Budget</p>
              <p className="text-sm font-medium text-gray-900 mt-1">200 USD</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Target Locations</p>
              <p className="text-sm font-medium text-gray-900 mt-1">US, UK, CA...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI Optimization Section - Left Column (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Ad Performance</h2>
              </div>
              
              {/* Data Period Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-left flex items-center justify-between bg-white min-w-[280px]"
                >
                  <span className="font-medium text-gray-900">
                    {customStartDate && customEndDate ? `${formatDate(customStartDate)} - ${formatDate(customEndDate)}` : dataPeriod}
                  </span>
                  <Calendar size={18} className="text-gray-400" />
                </button>

                {showCalendar && (
                  <div className="absolute top-full right-0 mt-2 bg-white border-2 border-border rounded-xl shadow-xl p-4 z-10 w-[400px]">
                    <div className="flex gap-4">
                      {/* Left: Quick Select Buttons */}
                      <div className="w-1/3 flex flex-col gap-2">
                        {periodOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handlePeriodClick(option.value)}
                            className={`px-3 py-2.5 text-sm rounded-xl text-left transition-all font-medium ${
                              dataPeriod === option.value
                                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
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
                          <div className="flex items-center justify-between mb-3">
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                              <ChevronLeft size={18} />
                            </button>
                            <span className="font-semibold text-sm">
                              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                              <ChevronRight size={18} />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2 font-medium">
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
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-xl hover:shadow-lg transition-all"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Metrics Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {metrics.map((metric) => {
                const isSelected = selectedMetrics.includes(metric.key)
                return (
                  <button
                    key={metric.key}
                    onClick={() => handleMetricToggle(metric.key)}
                    className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-opacity-100 shadow-lg'
                        : 'border-border bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                    style={isSelected ? { 
                      borderColor: metric.color,
                      backgroundColor: `${metric.color}08`,
                      boxShadow: `0 4px 12px ${metric.color}20`
                    } : {}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`text-xs font-semibold uppercase tracking-wide ${
                        isSelected ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {metric.label}
                      </p>
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 leading-tight">{metric.value}</p>
                    {isSelected && (
                      <div 
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: metric.color }}
                      >
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Chart using Recharts */}
            <div className="h-80 bg-white rounded-xl border border-gray-200 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceChartData}>
                  <defs>
                    {selectedMetrics.map(metricKey => {
                      const metric = metrics.find(m => m.key === metricKey)
                      return (
                        <linearGradient key={`grad-${metricKey}`} id={`gradient-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={metric.color} stopOpacity="0.3"/>
                          <stop offset="95%" stopColor={metric.color} stopOpacity="0"/>
                        </linearGradient>
                      )
                    })}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  {selectedMetrics.length <= 2 && selectedMetrics.map((metricKey, index) => {
                    const metric = metrics.find(m => m.key === metricKey)
                    return (
                      <YAxis
                        key={metricKey}
                        yAxisId={metricKey}
                        orientation={index % 2 === 0 ? 'left' : 'right'}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(value) => {
                          if (metricKey === 'spend' || metricKey === 'cpm' || metricKey === 'cost_conv') {
                            return `$${value.toFixed(2)}`
                          } else if (metricKey === 'ctr' || metricKey === 'roas') {
                            return `${value.toFixed(1)}%`
                          }
                          return value.toFixed(1)
                        }}
                      />
                    )
                  })}
                  <Tooltip content={<CustomTooltip />} />
                  {selectedMetrics.map(metricKey => {
                    const metric = metrics.find(m => m.key === metricKey)
                    return (
                      <Area
                        key={metricKey}
                        type="monotone"
                        dataKey={metricKey}
                        stroke={metric.color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#gradient-${metricKey})`}
                        yAxisId={metricKey}
                        name={metric.label}
                        dot={false}
                        activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                      />
                    )
                  })}
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {selectedMetrics.map(metricKey => {
                  const metric = metrics.find(m => m.key === metricKey)
                  return (
                    <div key={metricKey} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: metric.color }}
                      />
                      <span className="text-xs font-semibold text-gray-700">{metric.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Overview - Right Column (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Today's Overview</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Based on last 7 days data</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-600">Updated: January 4, 2026, 13:24:56</span>
            </div>

            <div className="space-y-3 flex-1">
              <p className="text-gray-700 leading-relaxed text-sm">
                Overall performance improved by <span className="text-green-600 font-semibold">23%</span> compared to yesterday, ROI increased from 3.2 to 4.2, and conversion cost decreased by 15%.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="pl-3 border-l-4 border-green-500">
                  <p className="text-xs font-semibold text-gray-900 mb-1">Today's Highlights</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>• Brand promotion Campaign ROI reached 4.2, exceeding target by 40%</li>
                    <li>• Display ad CVR reached 3.5%, industry leading</li>
                    <li>• TikTok Ads CTR increased to 3.2%, young audience response positive</li>
                  </ul>
                </div>

                <div className="pl-3 border-l-4 border-yellow-500">
                  <p className="text-xs font-semibold text-gray-900 mb-1">Key Insights</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>• Search ad CTR still below industry average (1.2% vs 2.5%), keywords need optimization</li>
                    <li>• Facebook Ads cost is high, recommend reevaluating投放 strategy</li>
                    <li>• Overall traffic quality stable, invalid click rate decreased by 8%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-4">
              <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              View budget adjustment suggestions
              </button>
              <button className="w-full py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
              View new campaign suggestions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Performance</h2>

        {/* Performance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Daily Budget</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Spend</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Impressions</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">CPM</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Clicks</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">CPC</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">CTR</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#7033F5' }}>Conversions</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#7033F5' }}>Cost/conv.</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#7033F5' }}>Conv. rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#7033F5' }}>Conv. value</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: '#7033F5' }}>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {dailyPerformanceData.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.dailyBudget}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.spend}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.impressions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.cpm}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.clicks.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.cpc}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.ctr}%</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.conversions}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.costConv}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.convRate}%</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${row.convValue}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
