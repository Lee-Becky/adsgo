import { useState, useEffect } from 'react'
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  BarChart3,
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
  const metrics = [
    { key: 'spend', label: 'Spend', value: '$1,310', color: '#7033F5' },
    { key: 'cpm', label: 'CPM', value: '$8.50', color: '#D946EF' },
    { key: 'ctr', label: 'CTR', value: '2.1%', color: '#10B981' },
    { key: 'cost_conv', label: 'Cost/conv.', value: '$4.20', color: '#F59E0B' },
    { key: 'roas', label: 'ROAS', value: '4.2', color: '#3B82F6' },
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
                    : entry.name === 'CTR'
                      ? `${entry.value}%`
                      : entry.name === 'ROAS'
                        ? entry.value
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


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col">
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

            {/* Chart using Recharts 鈥?explicit height avoids Recharts width/height -1 in flex layout */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-[320px] min-h-[320px] min-w-0">
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
                          } else if (metricKey === 'ctr') {
                            return `${value.toFixed(1)}%`
                          } else if (metricKey === 'roas') {
                            return value.toFixed(1)
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
  )
}

export default Dashboard
