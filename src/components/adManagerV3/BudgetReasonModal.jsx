import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Minus, Info, CheckCircle, AlertCircle, Lightbulb, Zap, Edit3, BarChart3, Table, Activity, Target, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react'
import FeedbackModal from './FeedbackModal'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BudgetReasonModal = ({ isOpen, onClose, campaign, reason }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [showRawTable, setShowRawTable] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)
  
  if (!isOpen || !campaign || !reason) return null

  const status = campaign.status || 'pending'

  const getTypeIcon = (type) => {
    switch (type) {
      case 'increase':
        return <TrendingUp size={20} className="text-success-600" />
      case 'decrease':
        return <TrendingDown size={20} className="text-danger-600" />
      case 'maintain':
        return <Minus size={20} className="text-warning-600" />
      default:
        return <Info size={20} className="text-neutral-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'bg-success-50 border-success-200'
      case 'decrease':
        return 'bg-danger-50 border-danger-200'
      case 'maintain':
        return 'bg-warning-50 border-warning-200'
      default:
        return 'bg-neutral-50 border-neutral-200'
    }
  }

  const handleApprove = () => {
    if (campaign.handleApprove && typeof campaign.handleApprove === 'function') {
      campaign.handleApprove(campaign.id)
    }
    onClose()
  }

  const handleReject = () => {
    setFeedbackOpen(true)
  }

  const handleFeedbackConfirm = (feedback) => {
    if (campaign.id) {
      if (campaign.onBudgetStatusChange) {
        campaign.onBudgetStatusChange(prev => ({ ...prev, [campaign.id]: 'rejected' }))
      }
    }
    setFeedbackOpen(false)
    onClose()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-success-600">
            <CheckCircle size={20} />
            <span className="font-bold">Approved</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-danger-600">
            <AlertCircle size={20} />
            <span className="font-bold">Rejected</span>
          </div>
        )
      case 'invalid_modified':
        return (
          <div className="flex items-center gap-2 text-warning-600">
            <AlertCircle size={20} />
            <span className="font-bold">Invalid (Modified)</span>
          </div>
        )
      default:
        return null
    }
  }

  // Generate mock history data for the last 14 days
  const generateHistoryData = () => {
    const history = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Generate random but realistic data based on campaign metrics
      const budget = campaign.dailyBudget || 500
      const spendRatio = 0.8 + Math.random() * 0.4
      const spend = budget * spendRatio
      const impressions = Math.max(1, Math.floor(spend * 40 + Math.random() * 10000))
      const clicks = Math.max(1, Math.floor(impressions * (0.02 + Math.random() * 0.02)))
      const conversions = Math.max(1, Math.floor(clicks * (0.01 + Math.random() * 0.02)))
      const purchases = Math.max(1, Math.floor(conversions * (0.3 + Math.random() * 0.4)))
      
      history.push({
        date: dateStr,
        budget: budget,
        spend: spend,
        impressions: impressions,
        cpm: (spend / impressions) * 1000,
        cpc: spend / clicks,
        ctr: (clicks / impressions) * 100,
        conversions: conversions,
        cpa: spend / conversions,
        purchases: purchases,
        cpp: spend / purchases,
        operation: i === 0 || i === 7 || i === 3 || i === 10 ? 'Budget Adjustment' : null
      })
    }
    return history
  }

  const history14 = generateHistoryData()

  // Calculate ROAS for each day
  const history14WithROAS = history14.map(d => ({
    ...d,
    roas: d.spend > 0 ? (d.purchases * 100) / d.spend : 0
  }))

  // Trend calculation: Linear regression (y = mx + b)
  const calculateLinearRegression = (data, key) => {
    const n = data.length
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0
    
    data.forEach((d, i) => {
      const val = d[key]
      sumX += i
      sumY += val
      sumXY += i * val
      sumXX += i * i
      sumYY += val * val
    })

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    const rNum = (n * sumXY - sumX * sumY)
    const rDen = Math.sqrt(Math.max(0, (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)))
    const rSquared = rDen === 0 ? 0 : Math.pow(rNum / rDen, 2)

    return { slope, rSquared, avg: sumY / n }
  }

  const trends = {
    cpm: calculateLinearRegression(history14, 'cpm'),
    cpa: calculateLinearRegression(history14, 'cpa'),
    roas: calculateLinearRegression(history14WithROAS, 'roas')
  }

  const getTrendIcon = (slope) => {
    if (slope > 0.05) return <TrendingUp size={14} className="text-danger-500" />
    if (slope < -0.05) return <TrendingDown size={14} className="text-success-500" />
    return <Minus size={14} className="text-neutral-400" />
  }

  const opHistoryAll = history14.filter(d => d.operation).sort((a, b) => new Date(b.date) - new Date(a.date)).map((op, idx) => {
    const opIndex = history14.findIndex(d => d.date === op.date)
    const getAvg = (start, end) => {
      const slice = history14.slice(Math.max(0, start), Math.min(history14.length, end))
      if (!slice.length) return { roas: 0, cpa: 0, conv: 0 }
      return {
        roas: slice.reduce((a, b) => a + ((b.purchases * 100) / b.spend), 0) / slice.length,
        cpa: slice.reduce((a, b) => a + b.cpa, 0) / slice.length,
        conv: slice.reduce((a, b) => a + b.conversions, 0) / slice.length,
      }
    }
    return {
      date: op.date.slice(5),
      action: op.operation,
      fromBudget: idx % 2 === 0 ? 1200 : 2000,
      toBudget: idx % 2 === 0 ? 1400 : 1200,
      changeAmt: idx % 2 === 0 ? '+$200' : '-$800',
      changePct: idx % 2 === 0 ? '+16.7%' : '-40.0%',
      before: getAvg(opIndex - 1, opIndex),
      after: getAvg(opIndex + 1, opIndex + 2)
    }
  })

  const opHistory = showAllHistory ? opHistoryAll : opHistoryAll.slice(0, 3)

  const calculatePeriodStats = (days) => {
    const periodData = history14.slice(-days)
    const sum = (key) => periodData.reduce((acc, d) => acc + (d[key] || 0), 0)
    const spend = sum('spend'), budget = periodData.reduce((acc, d) => acc + (d.budget || 0), 0), conv = sum('conversions')
    const clicks = sum('clicks'), impressions = sum('impressions')
    
    return {
      spendTotal: spend,
      spendAvg: spend / days,
      convTotal: conv,
      convAvg: conv / days,
      cpa: spend / conv,
      cpaAchievement: (18 / (spend / conv)) * 100,
      budgetUtilization: (spend / budget) * 100,
      ctr: (clicks / impressions) * 100,
      regRate: (conv / clicks) * 100,
      rank: Math.floor(Math.random() * 5) + 1,
    }
  }

  const periods = { 
    '14d': calculatePeriodStats(14), 
    '7d': calculatePeriodStats(7), 
    '3d': calculatePeriodStats(3), 
    '1d': calculatePeriodStats(1) 
  }

  const getPeriodicAnalysisInsights = () => {
    const insights = []
    const p1 = periods['1d']
    const p14 = periods['14d']
    const p7 = periods['7d']

    if (p1.budgetUtilization > 120) {
      insights.push({ icon: <AlertCircle className="text-warning-500" />, text: `Short-term budget overspending risk: Budget utilization in the last 24 hours reached ${p1.budgetUtilization.toFixed(1)}%, significantly higher than the 14-day average, recommend monitoring spend rate.` })
    } else if (p1.budgetUtilization < 80) {
      insights.push({ icon: <Info className="text-info-500" />, text: `Insufficient budget spend: Last 1 day spend only accounts for ${p1.budgetUtilization.toFixed(1)}% of budget, possibly affected by audience saturation or competitive environment.` })
    } else {
      insights.push({ icon: <CheckCircle className="text-success-500" />, text: `Healthy budget utilization: Spend pace highly aligned with budget setting, utilization maintained in the golden range of 90%-110%.` })
    }

    const cpaTrend = ((p1.cpa - p14.cpa) / p14.cpa) * 100
    if (cpaTrend < -10) {
      insights.push({ icon: <TrendingDown className="text-success-500" />, text: `CPA efficiency improvement: Last 1 day CPA ($${p1.cpa.toFixed(1)}) decreased by ${Math.abs(cpaTrend).toFixed(1)}% compared to 14-day average, model entered positive feedback cycle.` })
    } else if (cpaTrend > 10) {
      insights.push({ icon: <TrendingUp className="text-danger-500" />, text: `Core metric warning: Last 1 day CPA increased by ${cpaTrend.toFixed(1)}% compared to 14-day average, KPI achievement rate declined, need to check creative fatigue.` })
    }

    if (p1.regRate > p7.regRate) {
      insights.push({ icon: <Zap className="text-info-500" />, text: `Funnel efficiency optimization: Registration conversion rate (CVR1) showed stepwise growth, increasing from 7-day average of ${p7.regRate.toFixed(2)}% to today's ${p1.regRate.toFixed(2)}%.` })
    }

    if (p1.rank <= 3) {
      insights.push({ icon: <Target className="text-purple-500" />, text: `Category dominance: This series currently ranks in the top ${((p1.rank/12)*100).toFixed(0)}% winning zone under the same targeting and goal dimensions.` })
    }

    insights.push({ icon: <ShieldCheck size={14} className="text-success-600" />, text: "Anomaly monitoring: Core metrics did not trigger circuit breaker threshold, system running smoothly, no abnormal performance due to media policy or API jitter." })

    return insights.slice(0, 5)
  }

  const getFunnelMetrics = (data) => {
    const sum = (key) => data.reduce((acc, d) => acc + (d[key] || 0), 0)
    const s = sum('spend'), i = sum('impressions'), c = sum('clicks'), cv = sum('conversions'), p = sum('purchases')
    return { spend: s, cpm: (s / i) * 1000, cpc: s / c, ctr: (c / i) * 100, cpa: s / cv, cvr1: (cv / c) * 100, cpp: s / p, pRate: (p / cv) * 100 }
  }

  const campFunnel = getFunnelMetrics(history14)
  const benchFunnel = { spend: campFunnel.spend * 1.1, cpm: campFunnel.cpm * 0.95, cpc: campFunnel.cpc * 1.05, ctr: campFunnel.ctr * 0.9, cpa: campFunnel.cpa * 1.1, cvr1: campFunnel.cvr1 * 0.85, cpp: campFunnel.cpp * 1.05, pRate: campFunnel.pRate * 0.95 }

  const compare = (val, bench, lowerIsBetter = false) => {
    const diff = ((val - bench) / bench) * 100
    const isGood = lowerIsBetter ? val < bench : val > bench
    return { isGood, text: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%` }
  }

  const periodicInsights = getPeriodicAnalysisInsights()

  const comparisonRows = [
    { l: 'Total Spend (Daily Avg)', f: (p) => `$${p.spendTotal.toFixed(0)} (${p.spendAvg.toFixed(0)})` },
    { l: 'Total Conversions (Daily Avg)', f: (p) => `${p.convTotal.toFixed(0)} (${p.convAvg.toFixed(0)})` },
    { l: 'KPI Achievement (CPA/ROAS)', f: (p) => `$${p.cpa.toFixed(1)}` },
    { l: 'KPI Achievement Rate', f: (p) => `${p.cpaAchievement.toFixed(0)}%` },
    { l: 'KPI Achievement Rank', f: (p) => `${p.rank}/12 (Top ${((p.rank / 12) * 100).toFixed(0)}%)` },
    { l: 'CTR (vs Avg)', f: (p) => `${p.ctr.toFixed(2)}% (vs ${periods['14d'].ctr.toFixed(2)}%)` },
    { l: 'KPI CVR (vs Avg)', f: (p) => `${p.regRate.toFixed(2)}% (vs ${periods['14d'].regRate.toFixed(2)}%)` },
  ]

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`
  }

  const formatFullDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Right Drawer */}
        <div className="absolute right-0 top-0 h-full w-[40vw] min-w-[400px] max-w-[800px] bg-white shadow-2xl overflow-y-auto transform transition-transform">
          {/* Header */}
          <div className={`px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10 ${getTypeColor(reason.type)}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                {getTypeIcon(reason.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">Optimization Detail</h2>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-medium rounded-full border border-neutral-200">
                    Updated: {formatFullDateTime(new Date())}
                  </span>
                </div>
                <p className="text-neutral-600 text-sm mt-1">{campaign.campaign || campaign.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className={`p-6 ${status !== 'pending' ? 'opacity-50' : ''}`}>
            <div className="space-y-12 pb-32">
              
              <section className="space-y-6">
                <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4"><Zap className="text-warning-400" size={18} /><h3 className="font-bold">AI Decision Recommendation</h3></div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6">{reason.detailedReason || reason.reasons?.join(' ')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-neutral-400 font-black">Recommended Budget</p>
                      <p className="text-xl font-black text-success-400">${campaign.suggestedBudget || campaign.dailyBudget}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-neutral-400 font-black">Expected Improvement</p>
                      <p className="text-xl font-black text-info-400">{reason.metrics?.change || '12.5%'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-neutral-400 tracking-widest flex items-center gap-2"><Edit3 size={14} className="text-info-500" /> Last 14 Days Optimization History</h4>
                  <div className="grid gap-3">
                    {opHistory.length > 0 ? opHistory.map((op, i) => (
                      <div key={i} className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded font-black">{op.date}</span>
                            <span className="text-xs font-bold text-neutral-700">{op.action}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-500 italic">${op.fromBudget} ➔ ${op.toBudget}</span>
                            <span className="text-[10px] font-bold text-neutral-400">Change: <span className="text-info-600">{op.changeAmt} ({op.changePct})</span></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 divide-x divide-neutral-200">
                          <div>
                            <p className="text-[9px] text-neutral-400 font-bold mb-1">1 day before adjustment</p>
                            <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                              <span>ROAS: {op.before.roas.toFixed(1)}x</span>
                              <span>CPA: ${op.before.cpa.toFixed(0)}</span>
                              <span>Conv: {op.before.conv.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="pl-4">
                            <p className="text-[9px] text-neutral-400 font-bold mb-1">1 day after adjustment</p>
                            <div className="flex justify-between text-[10px] font-bold text-success-600">
                              <span>ROAS: {op.after.roas.toFixed(1)}x</span>
                              <span>CPA: ${op.after.cpa.toFixed(0)}</span>
                              <span>Conv: {op.after.conv.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <div className="py-4 text-center text-neutral-400 text-xs italic">No optimization history in the last 14 days</div>}
                    
                    {opHistoryAll.length > 3 && (
                      <button 
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="w-full py-2 flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 text-xs font-bold bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors border border-primary-100"
                      >
                        {showAllHistory ? (
                          <>Show less history <ChevronUp size={14} /></>
                        ) : (
                          <>View more history <ChevronDown size={14} /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setShowRawTable(!showRawTable)} className="w-full px-4 py-3 bg-neutral-50 flex items-center justify-between hover:bg-neutral-100 transition-all">
                    <span className="flex items-center gap-2 text-xs font-bold text-neutral-600"><Table size={14}/> Raw Data Details (Last 14 Days)</span>
                    {showRawTable ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </button>
                  {showRawTable && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] text-left">
                        <thead className="bg-neutral-50 text-neutral-400 font-bold border-b border-neutral-100">
                          <tr>
                            <th className="p-2 border-r border-neutral-100">Date</th><th className="p-2">Budget</th><th className="p-2">Spend</th><th className="p-2">CPM</th><th className="p-2">CPC</th><th className="p-2">CTR</th><th className="p-2">Action</th><th className="p-2">CPA</th><th className="p-2">CVR1</th><th className="p-2">Purch</th><th className="p-2">CPP</th><th className="p-2">CVR2</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                          {history14.map((d, i) => (
                            <tr key={i} className="hover:bg-info-50/30">
                              <td className="p-2 border-r border-neutral-100 font-medium">{d.date.slice(5)}</td>
                              <td className="p-2">${d.budget}</td><td className="p-2">${d.spend.toFixed(0)}</td><td className="p-2">${d.cpm.toFixed(1)}</td><td className="p-2">${d.cpc.toFixed(1)}</td><td className="p-2">{(d.clicks/d.impressions*100).toFixed(1)}%</td><td className="p-2">{d.conversions.toFixed(0)}</td><td className="p-2">${d.cpa.toFixed(1)}</td><td className="p-2">{(d.conversions/d.clicks*100).toFixed(1)}%</td><td className="p-2">{d.purchases.toFixed(0)}</td><td className="p-2">${d.cpp.toFixed(1)}</td><td className="p-2">{(d.purchases/d.conversions*100).toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-info-500" /> Multi-Dimensional Time Series Analysis</h4>
                <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50/80 text-neutral-400 font-black tracking-widest border-b border-neutral-100">
                      <tr><th className="p-3 border-r border-neutral-100">Dimension</th><th className="p-3">Last 14 Days</th><th className="p-3">Last 7 Days</th><th className="p-3">Last 3 Days</th><th className="p-3">Last 1 Day</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {comparisonRows.map((row, i) => (
                        <tr key={i} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3 font-bold text-neutral-500 bg-neutral-50/30 border-r border-neutral-100">{row.l}</td>
                          {Object.values(periods).map((p, idx) => (<td key={idx} className="p-3 font-medium text-neutral-700">{row.f(p)}</td>))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-info-50/40 border border-info-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} className="text-info-500" />
                    <h5 className="text-xs font-black text-info-700 tracking-widest">AI Periodic Data Performance Insights</h5>
                  </div>
                  <ul className="space-y-3">
                    {periodicInsights.map((insight, idx) => (
                      <li key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="mt-0.5 shrink-0">{insight.icon}</div>
                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">{insight.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2"><Activity size={16} className="text-info-500" /> 14-Day Key Metrics Trend (Detailed Dashboard)</h4>
                <div className="bg-white border border-neutral-100 rounded-2xl p-4 h-[340px] shadow-sm relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={history14WithROAS} margin={{ right: 20, left: -20, top: 10 }}>
                      <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={8} axisLine={false} tickLine={false} tickFormatter={v=>v.slice(8)} />
                      
                      <YAxis yAxisId="installs" orientation="left" stroke="#cbd5e1" fontSize={7} axisLine={false} tickLine={false} tickCount={6} />
                      <YAxis yAxisId="metrics" orientation="right" stroke="#94a3b8" fontSize={7} axisLine={false} tickLine={false} tickCount={6} />

                      <Tooltip 
                        contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        cursor={{ stroke: '#f1f5f9', strokeWidth: 20 }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '8px', paddingTop: '20px' }} />
                      
                      <Bar yAxisId="installs" dataKey="conversions" name="Daily Installs" fill="#f8fafc" barSize={22} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="metrics" type="monotone" dataKey="cpa" name="CPA ($)" stroke="#8b5cf6" strokeWidth={2} dot={{r:2, fill: '#8b5cf6', strokeWidth: 0}} />
                      <Line yAxisId="metrics" type="monotone" dataKey="roas" name="ROAS (x)" stroke="#3b82f6" strokeWidth={2} dot={{r:2, fill: '#3b82f6', strokeWidth: 0}} />
                      <Line yAxisId="metrics" type="monotone" dataKey="cpm" name="CPM ($)" stroke="#10b981" strokeWidth={2} dot={{r:2, fill: '#10b981', strokeWidth: 0}} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'CPM Trend Analysis', data: trends.cpm, color: 'text-success-600', prefix: '$' },
                    { label: 'CPA Trend Analysis', data: trends.cpa, color: 'text-purple-600', prefix: '$' },
                    { label: 'ROAS Trend Analysis', data: trends.roas, color: 'text-info-600', prefix: '' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-neutral-400 tracking-tighter">{item.label}</span>
                        {getTrendIcon(item.data.slope)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] text-neutral-400">Average:</span>
                          <span className={`text-xs font-bold text-neutral-700`}>{item.prefix}{item.data.avg.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] text-neutral-400">Slope:</span>
                          <span className={`text-[10px] font-mono font-bold ${item.data.slope > 0 ? 'text-danger-500' : 'text-success-600'}`}>
                            {item.data.slope > 0 ? '+' : ''}{item.data.slope.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] text-neutral-400">R²:</span>
                          <span className="text-[10px] font-mono text-neutral-600">{item.data.rSquared.toFixed(3)}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-neutral-200 text-[8px] text-neutral-400 italic">
                        {item.data.rSquared > 0.6 ? 'Strong trend correlation, highly reliable data' : 'High volatility, moderate trend correlation'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2"><Target size={16} className="text-info-500" /> Conversion Funnel Comparison (VS Brand benchmark)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 text-center">This Campaign Performance</p>
                    {[
                      { l: 'Spend', v: `$${campFunnel.spend.toFixed(0)}`, w: 'w-full', c: 'bg-primary-600' },
                      { l: 'Impressions (CPM)', v: `$${campFunnel.cpm.toFixed(1)}`, w: 'w-[90%]', c: 'bg-info-500', comp: compare(campFunnel.cpm, benchFunnel.cpm, true) },
                      { l: `Clicks (CPC/CTR)`, v: `$${campFunnel.cpc.toFixed(1)} / ${campFunnel.ctr.toFixed(1)}%`, w: 'w-[75%]', c: 'bg-info-400', comp: compare(campFunnel.ctr, benchFunnel.ctr) },
                      { l: `Conversions (CPA/CVR1)`, v: `$${campFunnel.cpa.toFixed(1)} / ${campFunnel.cvr1.toFixed(1)}%`, w: 'w-[60%]', c: 'bg-info-300', comp: compare(campFunnel.cvr1, benchFunnel.cvr1) },
                      { l: `Purchases (CPP/P.Rate)`, v: `$${campFunnel.cpp.toFixed(1)} / ${campFunnel.pRate.toFixed(1)}%`, w: 'w-[45%]', c: 'bg-info-200', comp: compare(campFunnel.pRate, benchFunnel.pRate) },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`${item.w} h-10 ${item.c} rounded flex items-center justify-center text-white font-bold text-[9px] relative shadow-sm`}>
                          <span className="px-2 truncate">{item.l}: {item.v}</span>
                          {item.comp && <div className={`absolute -right-2 top-0 translate-x-full px-1.5 py-0.5 rounded text-[8px] font-black ${item.comp.isGood ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}`}>{item.comp.text}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 opacity-40">
                    <p className="text-[10px] font-black text-neutral-400 text-center">Brand Same-Goal Campaign Benchmark Performance</p>
                    {[
                      { v: `$${benchFunnel.spend.toFixed(0)}`, w: 'w-full' }, { v: `$${benchFunnel.cpm.toFixed(1)}`, w: 'w-[90%]' }, { v: `$${benchFunnel.cpc.toFixed(1)} / ${benchFunnel.ctr.toFixed(1)}%`, w: 'w-[75%]' }, { v: `$${benchFunnel.cpa.toFixed(1)} / ${benchFunnel.cvr1.toFixed(1)}%`, w: 'w-[60%]' }, { v: `$${benchFunnel.cpp.toFixed(1)} / ${benchFunnel.pRate.toFixed(1)}%`, w: 'w-[45%]' },
                    ].map((item, idx) => (<div key={idx} className="flex flex-col items-center"><div className={`${item.w} h-10 bg-neutral-300 rounded flex items-center justify-center text-neutral-600 font-bold text-[9px]`}>{item.v}</div></div>))}
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* Footer - Disagree/Approve Buttons */}
          <div className="px-6 py-4 border-t border-border bg-neutral-50 sticky bottom-0">
            {status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 py-3 rounded-lg font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Disagree
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
            {status !== 'pending' && (
              <div className="flex items-center justify-center">
                {getStatusBadge(status)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onConfirm={handleFeedbackConfirm}
        title="Feedback"
        buttonText="Submit"
      />
    </>
  )
}

export default BudgetReasonModal
