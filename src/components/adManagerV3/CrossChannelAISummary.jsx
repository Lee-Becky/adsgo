import React, { useState, useMemo } from 'react';
import {
  Sparkles, Zap, Cpu, BrainCircuit, ShieldCheck, AlertTriangle, Bot, Edit2, Target,
  TrendingUp, TrendingDown, Minus, ArrowRight, Clock, RefreshCw, Coins, Infinity,
  User, Radar, Plus, ChevronDown, ChevronUp, X, Globe, Settings
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Platform icon URLs
const META_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256';
const GOOGLE_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256';

const RealisticRadar = ({ active }) => (
  <div className={`relative w-14 h-14 rounded-full border transition-colors duration-500 overflow-hidden ${active ? 'border-indigo-500/50 bg-black/40' : 'border-indigo-200 bg-indigo-50/50'}`}>
    {/* Concentric Circles */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`w-[75%] h-[75%] rounded-full border ${active ? 'border-indigo-500/20' : 'border-indigo-200/40'}`} />
      <div className={`w-[45%] h-[45%] rounded-full border ${active ? 'border-indigo-500/20' : 'border-indigo-200/40'}`} />
      <div className={`w-[15%] h-[15%] rounded-full border ${active ? 'border-indigo-500/20' : 'border-indigo-200/40'}`} />
    </div>
    {/* Crosshairs */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
      <div className={`w-full h-[1px] ${active ? 'bg-indigo-500' : 'bg-indigo-300'}`} />
      <div className={`w-[1px] h-full ${active ? 'bg-indigo-500' : 'bg-indigo-300'}`} />
    </div>
    {/* Sweep */}
    {active && (
      <div className="absolute inset-0 z-10 animate-[spin_3s_linear_infinite]">
        <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.4)_30deg,transparent_60deg)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)]" />
      </div>
    )}
    {/* Static Radar Icon in center when inactive */}
    {!active && (
      <div className="absolute inset-0 flex items-center justify-center text-indigo-300">
        <Radar size={20} />
      </div>
    )}
    {/* Blips (Targets) */}
    {active && (
      <>
        <div className="absolute top-[20%] left-[60%] w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
        <div className="absolute top-[60%] left-[25%] w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-1000 shadow-[0_0_5px_#10b981]" />
        <div className="absolute top-[40%] left-[45%] w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-500 shadow-[0_0_5px_#818cf8]" />
      </>
    )}
  </div>
);

const CrossChannelAISummary = ({ 
  totalSpend = 125000, 
  totalEvent1s = 3200, 
  avgCpaEvent1 = 39.06, 
  avgRoas = 3.8,
  onRuleLibraryClick,
  autoApply,
  onAutoApplyToggle,
  goals = [],
  onEditBrandConfig,
  campaigns = [],
  lastUpdated,
  onUpdateLastUpdated,
  isCollapsed = false,
  activeTab = 'meta',
  onPageChange,
  runSettings,
  onRunSettingClick,
  aiAnalysisRef,
  controlCenterRef,
}) => {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCooldown, setAnalysisCooldown] = useState(null);
  const [cooldownIntervalId, setCooldownIntervalId] = useState(null);
  const [tick, setTick] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mockStats, setMockStats] = useState({
    increase: 7,
    decrease: 4,
    pause: 6,
    maintain: 1,
    totalCurrentBudget: 900,
    totalSuggestedBudget: 720
  });

  const handleManualAnalysis = () => {
    if (isAnalyzing || analysisCooldown) return;
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Start 4-hour cooldown after analysis completes
      const cooldownEndTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      setAnalysisCooldown(cooldownEndTime);
      
      // Start countdown timer
      const intervalId = setInterval(() => {
        setTick(prev => prev + 1); // Force re-render every second
      }, 1000);
      
      setCooldownIntervalId(intervalId);
      
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      onUpdateLastUpdated?.(timeStr);
      
      // Randomly update mock data
      setMockStats(prev => ({
        increase: Math.max(0, prev.increase + Math.floor(Math.random() * 5) - 2),
        decrease: Math.max(0, prev.decrease + Math.floor(Math.random() * 3) - 1),
        pause: Math.max(0, prev.pause + Math.floor(Math.random() * 2) - 1),
        maintain: Math.max(0, prev.maintain + Math.floor(Math.random() * 2) - 1),
        totalCurrentBudget: 900, // Keep total same for simplicity
        totalSuggestedBudget: 700 + Math.floor(Math.random() * 100)
      }));
    }, 5000);
  };

  // Format cooldown time
  const formatCooldownTime = (endTime) => {
    if (!endTime) return null;
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      // Clear cooldown when time is up
      if (analysisCooldown) {
        setAnalysisCooldown(null);
        if (cooldownIntervalId) {
          clearInterval(cooldownIntervalId);
          setCooldownIntervalId(null);
        }
      }
      return null;
    }
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (cooldownIntervalId) {
        clearInterval(cooldownIntervalId);
      }
    };
  }, [cooldownIntervalId]);

  // Check if cooldown has expired
  React.useEffect(() => {
    if (analysisCooldown) {
      const remaining = analysisCooldown - Date.now();
      if (remaining <= 0) {
        setAnalysisCooldown(null);
        if (cooldownIntervalId) {
          clearInterval(cooldownIntervalId);
          setCooldownIntervalId(null);
        }
      }
    }
  }, [tick, analysisCooldown, cooldownIntervalId]);

  const metaAccounts = [
    { name: 'AdsGo Official', id: '1234567890' },
    { name: 'AdsGo Performance', id: '0987654321' },
    { name: 'AdsGo Retargeting', id: '1122334455' }
  ];

  const googleAccounts = [
    { name: 'AdsGo Search', id: 'GA-123456' },
    { name: 'AdsGo Display', id: 'GA-789012' },
    { name: 'AdsGo YouTube', id: 'GA-345678' }
  ];
  // Mock AI insights data with variation support
  const aiInsights = useMemo(() => {
    // Generate some variation based on lastUpdated or mockStats
    const isInitial = lastUpdated === '2026-01-15 13:29';
    
    if (isInitial) {
      return {
        summary: "The only Campaign for brand Hifami was paused on 01-12. Before pausing, the 7-day CPA was $0.69, exceeding the target by 37%. CTR improved to 2.55% but CVR dropped to 12.33%. ROAS is 0, indicating an attribution anomaly that needs urgent fixing.",
        highlights: [
          "CTR improved from 14-day average of 1.97% to 7-day average of 2.55%, reaching a high of 2.88%, with significant improvement in traffic quality, growing by 29.4%",
          "7-day cumulative conversions: 1,093, with daily average of 156 conversions, sufficient data volume to support optimization decisions",
          "CPA optimized from 14-day average of $0.71 to 7-day average of $0.69, showing improving cost control trend but still 37% above target",
          "Budget utilization rate at 7-day average of 95.84%, approaching saturation, with good foundation for ad delivery"
        ],
        key_insights: [
          "ROAS remains at 0, indicating a technical anomaly. Purchase events are not being tracked back or attribution configuration is incorrect, making it impossible to evaluate true ROI. Recommend urgently investigating SDK integration and attribution window settings",
          "CVR continuously declined from 17.60% to 11.33%, a drop of 35.6%, forming a contrast with CTR improvement. Recommend optimizing landing page load speed and registration process, A/B test user experience",
          "CPM increased from $1.80 to $2.44, a rise of 35.6%. Market competition intensified, squeezing profit margins. Recommend testing new traffic channels or adjusting ad delivery time slots to reduce costs",
          "CPA target of $0.5031 is too aggressive. Historical best of $0.65 still exceeds target by 29%. Recommend adjusting target to $0.65-$0.70 or optimizing traffic quality",
          "Campaign paused on 01-12. Before pausing, CPA of $0.70 was the recent optimal level. Recommend evaluating feasibility of restart after fixing ROAS attribution, avoid blindly pausing high-quality Campaigns"
        ]
      };
    } else {
      return {
        summary: `AI analysis complete. Current account performance is stable. Recommended total budget of $${mockStats.totalSuggestedBudget} is in effect. CTR remains around 2.8%, and CPA has been optimized to $38.5.`,
        highlights: [
          `${mockStats.increase} Campaigns identified with scaling potential during analysis period. Recommend increasing budget to get more conversions.`,
          `Current conversion cost decreased by 12.5% compared to 24 hours ago. Recommend maintaining current strategy.`,
          "Traffic quality index improved to 8.5/10, with Meta channel performing particularly well.",
          `Budget utilization is healthy, mainly concentrated on high-quality ad sets with ROAS > ${avgRoas}.`
        ],
        key_insights: [
          "Recommend increasing investment in Google Search Ads, which demonstrates stronger stability.",
          "Some ad sets show creative fatigue. Recommend updating creative assets next week.",
          "Budget reduction strategy has been automatically implemented for ad sets exceeding CPA targets, with controllable risk.",
          "System is continuously monitoring real-time bid changes to ensure budget allocation at optimal time slots."
        ]
      };
    }
  }, [lastUpdated, mockStats, avgRoas]);

  const optimizationGoals = goals.filter(g => g.type === 'Optimization') || [];

  // Calculate budget recommendation statistics
  const budgetStats = useMemo(() => {
    // Use the stateful mockStats instead of static object
    const stats = { ...mockStats };

    if (campaigns && campaigns.length > 0) {
      let realStats = { increase: 0, decrease: 0, pause: 0, maintain: 0, totalCurrentBudget: 0, totalSuggestedBudget: 0 };
      
      campaigns.forEach(campaign => {
        if (!campaign.enabled) return;

        if (campaign.budgetLevel === 'campaign') {
          if (campaign.status !== 'Paused' && campaign.budgetReason) {
            const type = campaign.budgetReason.type;
            if (type === 'increase') realStats.increase++;
            else if (type === 'decrease') realStats.decrease++;
            else if (type === 'pause') realStats.pause++;
            else if (type === 'maintain') realStats.maintain++;

            realStats.totalCurrentBudget += campaign.dailyBudget;
            realStats.totalSuggestedBudget += campaign.suggestedBudget;
          } else if (campaign.status !== 'Paused') {
            realStats.totalCurrentBudget += campaign.dailyBudget;
            realStats.totalSuggestedBudget += campaign.dailyBudget;
          }
        } else {
          campaign.adsets?.forEach(adset => {
            if (!adset.enabled) return;
            
            if (adset.status !== 'Paused' && adset.budgetReason) {
              const type = adset.budgetReason.type;
              if (type === 'increase') realStats.increase++;
              else if (type === 'decrease') realStats.decrease++;
              else if (type === 'pause') realStats.pause++;
              else if (type === 'maintain') realStats.maintain++;

              realStats.totalCurrentBudget += adset.dailyBudget;
              realStats.totalSuggestedBudget += adset.suggestedBudget;
            } else if (adset.status !== 'Paused') {
              realStats.totalCurrentBudget += adset.dailyBudget;
              realStats.totalSuggestedBudget += adset.dailyBudget;
            }
          });
        }
      });

      if (realStats.totalCurrentBudget > 0) {
        return realStats;
      }
    }

    return stats;
  }, [campaigns, mockStats]);

  const remainingBudget = budgetStats.totalCurrentBudget - budgetStats.totalSuggestedBudget;
  const suggestedBudgetPercentage = budgetStats.totalCurrentBudget > 0 
    ? (budgetStats.totalSuggestedBudget / budgetStats.totalCurrentBudget) * 100 
    : 0;

  return (
    <div className="mb-8 w-full overflow-hidden">
      {/* Collapsible Content */}
      <div 
        className={`grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch transition-all duration-500 ease-in-out ${
          isCollapsed ? 'opacity-0 max-h-0 overflow-hidden -translate-y-2' : 'opacity-100 max-h-[2000px]'
        }`}
      >
        {/* Left Column: AI Summary (2/3 Width) */}
      <div ref={aiAnalysisRef} className="xl:col-span-2 bg-slate-50/50 border border-blue-100 rounded-2xl p-4 shadow-sm flex flex-col h-full min-w-0">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" />
            <h3 className="text-base font-black text-slate-800 tracking-wide">Meta Ads Insights Brief</h3>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Time Tag - moved from title */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/50 rounded-full text-[11px] font-black text-blue-600 border border-blue-200">
              <Clock size={10} />
              <span>{lastUpdated}</span>
            </div>
            {/* Manual Analysis - moved from Optimize Control Center */}
            <div className="relative group/tooltip">
              <button
                onClick={handleManualAnalysis}
                disabled={isAnalyzing || analysisCooldown}
                className={`flex items-center gap-1.5 px-3 py-1 border border-slate-200 rounded-full bg-white hover:bg-slate-50 transition-all shadow-sm group relative overflow-hidden ${isAnalyzing ? 'opacity-70 cursor-wait' : ''} ${analysisCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={11} className="text-blue-500 animate-spin" />
                    <span className="text-[10px] font-bold text-slate-600">Analyzing...</span>
                  </>
                ) : analysisCooldown ? (
                  <>
                    <Clock size={11} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-600">{formatCooldownTime(analysisCooldown)}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={11} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-600">Manual Analysis</span>
                  </>
                )}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {isAnalyzing ? 'AI is analyzing your data...' : analysisCooldown ? 'Cooldown period' : 'It will take about 3 minutes.'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,60%)_minmax(0,40%)] gap-4 mb-4 shrink-0 relative">
          {/* Divider Line */}
          <div className="absolute left-[60%] top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>

          {/* Left Column: 4 Metric Cards + Summary */}
          <div className="flex flex-col gap-4 pr-4">
            {/* 4 Metric Cards - Single Row 4 Columns */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-slate-400 tracking-tight mb-1">Spend</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-slate-500">$</span>
                  <p className="text-lg font-black text-slate-900 leading-none">{totalSpend.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-blue-400 tracking-tight mb-1">Event1s</p>
                <p className="text-lg font-black text-blue-700 leading-none">{totalEvent1s.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-emerald-500 tracking-tight mb-1">CPA (Event1)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-emerald-600/50">$</span>
                  <p className="text-lg font-black text-emerald-700 leading-none">{avgCpaEvent1.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-amber-500 tracking-tight mb-1">ROAS</p>
                <p className="text-lg font-black text-amber-700 leading-none">{avgRoas.toFixed(2)}x</p>
              </div>
            </div>

            {/* Summary Section with Title */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 py-1">
                <BrainCircuit size={16} className="text-blue-600" />
                <span className="text-sm font-black text-slate-800 tracking-wide">AI Summary</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{aiInsights.summary}</p>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-sm">→</span>
                    <p className="text-xs text-slate-600 font-medium leading-snug flex-1">Budget optimization: Based on current CVR performance on Meta channel, AI recommends implementing tiered increments of 15%-25% for the top 20% high-performing series.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-sm">→</span>
                    <p className="text-xs text-slate-600 font-medium leading-snug flex-1">Risk warning: Detected fluctuations of over 10% in CPM for some series under Meta account. Recommend closely monitoring backend conversion stability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Highlights & Potential Risks (Vertical) */}
          <div className="pl-4 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {/* Key Highlights */}
            <div className="mb-4">
              <div className="bg-white border border-green-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-green-100 shrink-0">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-xs font-black text-green-700 tracking-wide">Key Highlights</span>
                </div>
                <div className="max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  <div className="space-y-2">
                    {aiInsights.highlights.map((highlight, index) => (
                      <div key={`highlight-${index}`} className="bg-green-50/50 border border-green-100 rounded-lg px-2 py-1.5 flex items-start gap-2">
                        <div className="mt-0.5 shrink-0 w-0.5 h-0.5 rounded-full bg-green-600" />
                        <p className="text-[9px] text-slate-700 font-semibold leading-snug flex-1">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Potential Risks */}
            <div>
              <div className="bg-white border border-amber-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-amber-100 shrink-0">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span className="text-xs font-black text-amber-700 tracking-wide">Potential Risks</span>
                </div>
                <div className="max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  <div className="space-y-2">
                    {aiInsights.key_insights.map((insight, index) => (
                      <div key={`insight-${index}`} className="bg-amber-50/50 border border-amber-100 rounded-lg px-2 py-1.5 flex items-start gap-2">
                        <div className="mt-0.5 shrink-0 w-0.5 h-0.5 rounded-full bg-amber-600" />
                        <p className="text-[9px] text-slate-700 font-semibold leading-snug flex-1">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Optimize Goal & Auto-apply (1/3 Width) */}
      <div className="xl:col-span-1 h-full">
        <div ref={controlCenterRef} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200/50">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-black tracking-tight text-slate-800">Optimize Control Center</h2>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 w-fit">
                  <Clock size={8} className="text-blue-500" />
                  <span>{lastUpdated}</span>
                </div>
              </div>
            </div>
            {/* Rules Library - moved from Header */}
            <button
              onClick={onRuleLibraryClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-sm border bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Zap size={10} className="text-blue-500" />
              <span className="text-[10px] font-black tracking-tight">Rules Library</span>
            </button>
          </div>
          
          {/* KPI Recommendation Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {/* Increase */}
            <div className="bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-black text-emerald-600 leading-none mb-1">{budgetStats.increase}</p>
              <p className="text-[9px] font-bold text-emerald-700/70 tracking-tight whitespace-nowrap">Increase</p>
            </div>

            {/* Decrease */}
            <div className="bg-orange-50/50 border-l-4 border-orange-400 rounded-r-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-black text-orange-500 leading-none mb-1">{budgetStats.decrease}</p>
              <p className="text-[9px] font-bold text-orange-700/70 tracking-tight whitespace-nowrap">Decrease</p>
            </div>

            {/* Pause */}
            <div className="bg-rose-50/50 border-l-4 border-rose-500 rounded-r-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-black text-rose-600 leading-none mb-1">{budgetStats.pause}</p>
              <p className="text-[9px] font-bold text-rose-700/70 tracking-tight whitespace-nowrap">Pause</p>
            </div>

            {/* Maintain */}
            <div className="bg-slate-50 border-l-4 border-slate-400 rounded-r-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-black text-slate-600 leading-none mb-1">{budgetStats.maintain}</p>
              <p className="text-[9px] font-bold text-slate-700/70 tracking-tight whitespace-nowrap">Maintain</p>
            </div>
          </div>

          {/* Budget Info - moved from Header */}
          <div className="mb-4">
            <button
              onClick={() => setShowBudgetModal(true)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2 bg-blue-50 border border-blue-100 rounded-xl shadow-sm hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Target size={13} className="text-blue-600" />
                <span className="text-[11px] font-bold text-slate-700">
                  US,UK; Budget500$; ROAS{'>'}5
                </span>
              </div>
              <Edit2 size={11} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>

          {/* Budget Allocation Section */}
          <div className="border border-slate-100 rounded-2xl p-4 mb-6 bg-slate-50/30">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="p-1 bg-amber-100/50 rounded text-amber-600">
                <Coins size={14} />
              </div>
              <span className="text-xs font-black text-slate-800 tracking-tight">Budget Optimization Allocation</span>
            </div>

            {/* Comparative Boxes */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 mb-1">Daily budget</span>
                <span className="text-base font-black text-slate-800 tracking-tight">${budgetStats.totalCurrentBudget.toLocaleString()}</span>
              </div>
              
              <ArrowRight size={14} className="text-slate-300 shrink-0" />
              
              <div className="flex-[1.2] bg-white border-2 border-blue-600 rounded-xl p-3 flex flex-col shadow-lg shadow-blue-50">
                <span className="text-[9px] font-bold text-blue-600 mb-1">AI Optimized</span>
                <span className="text-base font-black text-slate-900 tracking-tight">${budgetStats.totalSuggestedBudget.toLocaleString()}</span>
              </div>
              
              <div className="flex-1 bg-slate-100/80 border border-slate-200 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 mb-1">Reserved</span>
                <span className="text-base font-black text-blue-600 tracking-tight">${remainingBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Schedule Summary Strip */}
          <div
            onClick={onRunSettingClick}
            className={`mb-3 mt-auto flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              runSettings
                ? 'bg-[#f3f0ff] border border-[#e5dbff] hover:bg-[#e5dbff]'
                : 'bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={12} className={runSettings ? 'text-[#7033F5] shrink-0' : 'text-amber-500 shrink-0'} />
              <span className={`text-[11px] font-semibold truncate ${runSettings ? 'text-[#7033F5]' : 'text-amber-600'}`}>
                {(() => {
                  if (!runSettings) return 'Running Schedule not set up.';
                  const { frequency, customDays, timeSlots, timeSlot } = runSettings;
                  const slots = timeSlots || (timeSlot ? [timeSlot] : []);
                  let timeDisplay = '';
                  if (slots.length === 1) {
                    timeDisplay = slots[0];
                  } else {
                    let shown = slots[0];
                    let i = 1;
                    for (; i < slots.length; i++) {
                      const next = `${shown}; ${slots[i]}`;
                      if (next.length > 45) break;
                      shown = next;
                    }
                    timeDisplay = i < slots.length ? `${shown} +${slots.length - i}` : shown;
                  }
                  let label = '';
                  if (frequency === 'daily') {
                    label = 'Daily';
                  } else if (frequency === 'custom') {
                    label = `Every ${customDays} days`;
                  }
                  return `${label} · ${timeDisplay}`;
                })()}
              </span>
            </div>
            <Settings size={12} className={`shrink-0 ${runSettings ? 'text-[#7033F5]' : 'text-amber-500'}`} />
          </div>

          {/* Bottom Functional Grid */}
          <div className="grid grid-cols-2 gap-3 relative">
            {/* Daily Analysis Card */}
            <div 
              className={`group border-2 rounded-2xl p-2.5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer ${!autoApply ? 'bg-blue-50 border-blue-500 shadow-[0_10px_20px_rgba(59,130,246,0.1)] scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-200'}`}
              onClick={() => autoApply && onAutoApplyToggle()}
              onMouseEnter={() => setHoveredCard('daily')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Custom Animated Logo for Daily Analysis */}
              <div className={`mb-2 transition-all duration-300 relative z-10`}>
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center ${!autoApply ? 'bg-white shadow-lg shadow-blue-200/50' : 'bg-blue-50'}`}>
                  {/* Animated Calendar Icon */}
                  <div className={`absolute ${!autoApply ? 'animate-pulse' : ''}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`w-6 h-6 ${!autoApply ? 'text-blue-600' : 'text-blue-400'}`}
                      style={{ animation: !autoApply ? 'scalePulse 2s ease-in-out infinite' : 'none' }}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" stroke="currentColor" fill="none"/>
                      <path d="M16 2V6M8 2V6M3 10H21" strokeWidth="2" stroke="currentColor" strokeLinecap="round"/>
                      <circle cx="12" cy="16" r="3" strokeWidth="2" stroke="currentColor" fill="none" className={!autoApply ? 'animate-ping' : ''} opacity="0.5"/>
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" className={!autoApply ? 'animate-pulse' : ''}/>
                    </svg>
                  </div>
                  {/* Pulse Ring Effect */}
                  {!autoApply && (
                    <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ping opacity-20" />
                  )}
                </div>
              </div>
              
              <p className={`text-[13px] font-black mb-1 tracking-tight ${!autoApply ? 'text-blue-700' : 'text-slate-800'}`}>Daily Analysis</p>
              
              <div className={`mt-auto flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${!autoApply ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${!autoApply ? 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black tracking-widest">{!autoApply ? 'RUNNING' : 'STANDBY'}</span>
              </div>
            </div>

            {/* AI Autopilot Card */}
            <div 
              className={`group border-2 rounded-2xl p-2.5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer ${autoApply ? 'bg-slate-900 border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.3)] scale-[1.05] z-10' : 'bg-white border-slate-100 hover:border-indigo-200 opacity-90'}`}
              onClick={() => !autoApply && onAutoApplyToggle()}
              onMouseEnter={() => setHoveredCard('autopilot')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Promotion Badge when not active - Animated to attract attention */}
              {!autoApply && (
                <div className="absolute top-2 right-2 z-20 animate-pulse">
                  <div className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                    <svg 
                      viewBox="0 0 1024 1024" 
                      version="1.1" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-3 h-3"
                    >
                      <path 
                        d="M935.485542 139.264L524.329062 2.02752a39.19872 39.19872 0 0 0-24.7808 0L88.494182 139.28448A39.8336 39.8336 0 0 0 61.440102 177.13152v396.3904c0 43.88864 21.05344 94.94528 62.54592 151.7568 32.39936 44.29824 77.824 92.83584 131.35872 140.32896 46.53056 41.24672 97.36192 80.0768 143.11424 109.3632C475.136102 1024 502.906982 1024 512.020582 1024c9.1136 0 36.864 0 113.31584-48.14848 45.9776-28.95872 96.84992-67.3792 143.19616-108.21632 53.6576-47.22688 99.16416-95.66208 131.52256-140.288 41.472-56.9344 62.50496-108.70784 62.50496-153.8048V177.152c0-17.2032-10.91584-32.48128-27.07456-37.888z m-51.87584 434.2784c0 18.75968-7.8848 52.16256-45.7728 104.79616-28.18048 39.2192-68.608 82.6368-116.9408 125.56288-42.3936 37.6832-89.21088 73.48224-131.82976 100.82304-46.12096 29.61408-70.4512 38.35904-77.04576 39.5264-6.63552-1.20832-30.96576-10.17856-77.2096-40.3456-42.45504-27.72992-89.2928-64-131.87072-102.13376-100.352-89.86624-162.6112-177.29536-162.6112-228.20864v-367.616l371.65056-124.08832 371.65056 124.1088-0.02048 367.57504z" 
                        fill="currentColor"
                      />
                      <path 
                        d="M335.380582 489.10336a40.61184 40.61184 0 0 0-3.60448 41.5744c6.5536 13.43488 19.90656 21.9136 34.54976 21.93408h192.73728l-150.36416 202.752a40.61184 40.61184 0 0 0-4.95616 39.424c5.3248 13.1072 17.08032 22.30272 30.80192 24.08448a38.23616 38.23616 0 0 0 35.71712-15.38048l197.67296-266.52672a40.61184 40.61184 0 0 0 3.8912-41.71776 38.6048 38.6048 0 0 0-34.67264-22.07744h-193.59744l119.27552-163.90144a40.42752 40.42752 0 0 0-7.84384-55.6032 38.03136 38.03136 0 0 0-54.14912 8.04864l-165.4784 227.38944z" 
                        fill="currentColor"
                      />
                    </svg>
                    7*24H
                  </div>
                </div>
              )}

              {/* Radar Sweep Effect for active state - Dark mode version */}
              {autoApply && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.15)_20deg,transparent_40deg)] animate-[spin_3s_linear_infinite]" />
                </div>
              )}
              
              <div className="mb-2 transition-all duration-300 relative z-10">
                {/* Infinity Icon Logo for AI Autopilot */}
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center ${autoApply ? 'bg-slate-800 shadow-lg shadow-indigo-500/30' : 'bg-white shadow-lg shadow-indigo-200/50'}`}>
                  {/* Infinity Icon - Static when inactive, rotating when active */}
                  <div className={`relative ${autoApply ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                    <Infinity
                      size={24}
                      className={`${autoApply ? 'text-indigo-400' : 'text-indigo-600'}`}
                    />
                  </div>
                  {/* Glow Effect when active */}
                  {autoApply && (
                    <div className="absolute inset-0 rounded-xl bg-indigo-500/10 animate-pulse" />
                  )}
                </div>
              </div>
              
              <p className={`text-[13px] font-black mb-1 tracking-tight ${autoApply ? 'text-white' : 'text-slate-800'}`}>AI Autopilot</p>
              
              <div className={`mt-auto flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${autoApply ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${autoApply ? 'bg-green-400 animate-ping shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black tracking-widest">{autoApply ? 'RUNNING' : 'STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Floating Tooltips - Outside cards, above the grid */}
          <div className="absolute -top-16 left-0 right-0 flex justify-around pointer-events-none">
            {/* Daily Analysis Tooltip */}
            <div className={`transition-opacity duration-300 ${hoveredCard === 'daily' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-900 text-white text-[10px] font-medium rounded-xl whitespace-nowrap z-50 max-w-[250px] shadow-xl border border-slate-700">
                Daily analysis with suggested adjustments requiring your Manual Approval.
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* AI Autopilot Tooltip */}
            <div className={`transition-opacity duration-300 ${hoveredCard === 'autopilot' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-900 text-white text-[10px] font-medium rounded-xl whitespace-nowrap z-50 max-w-[250px] shadow-xl border border-slate-700">
                Full Autonomous Optimization with 24/7 monitoring to maximize ROAS.
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* Budget Goal Modal - moved from Header */}
      {showBudgetModal && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBudgetModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Target size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Optimization Goal</h3>
                    <p className="text-sm text-blue-100">Configure your budget strategy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-indigo-900">US,UK</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700">Budget</span>
                      <span className="text-sm font-bold text-indigo-900">$500/day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700">Target KPI</span>
                      <span className="text-sm font-bold text-green-600">ROAS {'>'} 5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={16} className="text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-900">Global</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">Budget</span>
                      <span className="text-sm font-bold text-emerald-900">$1000/day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">Target KPI</span>
                      <span className="text-sm font-bold text-green-600">Cost Per AddToCart {'<='} $20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowBudgetModal(false);
                  if (onPageChange) {
                    onPageChange('optimizeGoals');
                  }
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Go to modify
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CrossChannelAISummary;
