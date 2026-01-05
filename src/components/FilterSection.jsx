import { useState, useEffect } from 'react'
import { Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const FilterSection = () => {
  const [dataPeriod, setDataPeriod] = useState('Today')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)

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

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account
          </label>
          <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm">
            <option>All Accounts</option>
            <option>Account 1</option>
            <option>Account 2</option>
            <option>Account 3</option>
          </select>
        </div>

        {/* Campaign Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Status
          </label>
          <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm">
            <option>All Platforms</option>
            <option>Google Ads</option>
            <option>Facebook Ads</option>
            <option>TikTok Ads</option>
            <option>Display Ads</option>
          </select>
        </div>

        {/* Data Period - Last position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Period
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
  )
}

export default FilterSection
