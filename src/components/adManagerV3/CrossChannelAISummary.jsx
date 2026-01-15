import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Zap, Cpu, BrainCircuit, ShieldCheck, AlertTriangle, Bot, Edit2, Target, 
  TrendingUp, TrendingDown, Minus, ArrowRight, Clock, RefreshCw, Coins, Infinity,
  User, Radar, Plus
} from 'lucide-react';

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
  onUpdateLastUpdated
}) => {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mockStats, setMockStats] = useState({
    increase: 7,
    decrease: 4,
    pause: 6,
    maintain: 1,
    totalCurrentBudget: 900,
    totalSuggestedBudget: 720
  });

  const handleManualAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
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
        summary: "品牌Hifami唯一Campaign已于01-12暂停，暂停前7日CPA=$0.69超目标37%，CTR提升至2.55%但CVR下滑至12.33%，ROAS=0存在归因异常需紧急修复",
        highlights: [
          "CTR从14日均1.97%提升至7日均2.55%，最高达2.88%，流量质量显著改善，增长29.4%",
          "7日累计转化1,093次，日均转化156次，数据量充足可支持决策优化",
          "CPA从14日均$0.71优化至7日均$0.69，成本控制有改善趋势但仍超目标37%",
          "预算利用率7日均95.84%，接近饱和，具备良好的投放基础"
        ],
        key_insights: [
          "ROAS持续为0存在技术性异常，购买事件未回传或归因配置错误，无法评估真实ROI，建议紧急排查SDK集成和归因窗口设置",
          "CVR从17.60%持续下滑至11.33%，降幅35.6%，与CTR提升形成反差，建议优化落地页加载速度和注册流程，A/B测试用户体验",
          "CPM从$1.80上涨至$2.44，涨幅35.6%，市场竞争加剧挤压利润空间，建议测试新流量渠道或调整投放时段降低成本",
          "CPA目标$0.5031过于激进，历史最优$0.65仍超标29%，建议调整目标至$0.65-$0.70或优化流量质量",
          "Campaign于01-12暂停，暂停前CPA=$0.70已是近期最优，建议修复ROAS归因后评估重启可行性，避免盲目暂停优质Campaign"
        ]
      };
    } else {
      return {
        summary: `AI 分析完成。当前账户表现稳定，建议总预算 ¥${mockStats.totalSuggestedBudget} 已生效。CTR 保持在 2.8% 左右，CPA 已优化至 ¥38.5。`,
        highlights: [
          `分析期间发现 ${mockStats.increase} 个 Campaign 具备扩容潜力，建议增加预算以获取更多转化。`,
          `当前转化成本相比 24 小时前下降了 12.5%，建议继续保持当前策略。`,
          "流量质量指数回升至 8.5/10，Meta 渠道表现尤为突出。",
          `预算利用率健康，主要集中在 ROAS > ${avgRoas} 的优质广告组。`
        ],
        key_insights: [
          "建议加大对 Google Search Ads 的投入，该渠道展现了更强的稳定性。",
          "部分广告组出现素材疲劳现象，建议下周更新创意素材。",
          "针对 CPA 超标的广告组已自动实施减预算策略，风险可控。",
          "系统正在持续监控实时竞价变动，确保预算分配在最优时段。"
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
      
      {/* Left Column: AI Summary (2/3 Width) */}
      <div className="lg:col-span-2 bg-slate-50/50 border border-blue-100 rounded-2xl p-4 shadow-sm flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              <div className="flex items-baseline gap-3">
                <h3 className="text-base font-black text-slate-800 tracking-wide">Today's Overview</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/50 rounded-full text-[11px] font-black text-blue-600 border border-blue-200">
                  <Clock size={10} />
                  <span>{lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 relative">
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredPlatform('meta')}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors">
                  <img src={META_ICON_URL} alt="Meta" className="w-4 h-4 rounded" />
                  Meta
                </div>
                {hoveredPlatform === 'meta' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
                    <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">Meta Accounts Connected</div>
                    {metaAccounts.map((account, index) => (
                      <div key={index} className="text-xs text-slate-600 py-1 flex justify-between">
                        <span>{account.name}</span>
                        <span className="text-slate-400">({account.id})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredPlatform('google')}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded text-xs font-bold text-red-700 cursor-pointer hover:bg-red-100 transition-colors">
                  <img src={GOOGLE_ICON_URL} alt="Google" className="w-4 h-4 rounded" />
                  Google
                </div>
                {hoveredPlatform === 'google' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
                    <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">Google Accounts Connected</div>
                    {googleAccounts.map((account, index) => (
                      <div key={index} className="text-xs text-slate-600 py-1 flex justify-between">
                        <span>{account.name}</span>
                        <span className="text-slate-400">({account.id})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Optimization Goal moved here - Removed Purple */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full shadow-sm">
              <Target size={12} className="text-blue-600" />
              <span className="text-[10px] font-bold text-slate-600">
                DailyBudget$500, Purchase, ROAS{'>'}5
              </span>
              <button 
                onClick={onEditBrandConfig}
                className="p-0.5 hover:bg-blue-50 rounded transition-colors text-slate-300 hover:text-blue-600"
                title="Edit Goal"
              >
                <Edit2 size={10} />
              </button>
            </div>

            <button 
              onClick={onRuleLibraryClick}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full transition-all shadow-sm border bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Zap size={10} className="text-blue-500" />
              <span className="text-[10px] font-black tracking-tight">Rule Library</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4 shrink-0">
          <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
            <p className="text-[11px] font-black text-slate-400 tracking-tight mb-1">Spend</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-500">¥</span>
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
              <span className="text-xs font-bold text-emerald-600/50">¥</span>
              <p className="text-lg font-black text-emerald-700 leading-none">{avgCpaEvent1.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
            <p className="text-[11px] font-black text-amber-500 tracking-tight mb-1">ROAS</p>
            <p className="text-lg font-black text-amber-700 leading-none">{avgRoas.toFixed(2)}x</p>
          </div>
        </div>

          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-1.5 mb-5 mt-2 shrink-0 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <BrainCircuit size={20} className="text-blue-600" />
                <span className="text-base font-black text-slate-900 tracking-wide">AI Summary</span>
              </div>
            </div>
          
          <div className="flex-grow overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {/* Summary Section */}
            <div className="mb-5">
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{aiInsights.summary}</p>
            </div>

            {/* Split Layout: Key Highlights & Potential Risks */}
            <div className="flex gap-4">
              {/* Key Highlights */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-3">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-xs font-black text-green-700 tracking-wide">Key Highlights</span>
                </div>
                <div className="space-y-2">
                  {aiInsights.highlights.map((highlight, index) => (
                    <div key={`highlight-${index}`} className="flex items-start gap-2">
                      <div className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-green-600" />
                      <p className="text-[11px] text-slate-700 font-semibold leading-normal">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider Line */}
              <div className="hidden lg:block">
                <div className="h-full border-r border-slate-200"></div>
              </div>

              {/* Potential Risks */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span className="text-xs font-black text-amber-700 tracking-wide">Potential Risks</span>
                </div>
                <div className="space-y-2">
                  {aiInsights.key_insights.map((insight, index) => (
                    <div key={`insight-${index}`} className="flex items-start gap-2">
                      <div className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-amber-600" />
                      <p className="text-[11px] text-slate-700 font-semibold leading-normal">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Optimize Goal & Auto-apply (1/3 Width) */}
      <div className="lg:col-span-1 h-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col">
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
            <div className="flex items-center gap-2">
              <div className="relative group/tooltip">
                <button 
                  onClick={handleManualAnalysis}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all shadow-sm group ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Sparkles size={12} className={`${isAnalyzing ? 'text-slate-300' : 'text-blue-500'} group-hover:scale-110 transition-transform`} />
                  <span className="text-[11px] font-bold text-slate-600">Manual Analysis</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  It will take about 3 minutes.
                </div>
              </div>
              <button 
                className={`p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all ${isAnalyzing ? 'text-blue-500 animate-spin bg-blue-50' : ''}`}
                disabled={isAnalyzing}
              >
                <RefreshCw size={14} />
              </button>
            </div>
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

          {/* Budget Allocation Section */}
          <div className="border border-slate-100 rounded-2xl p-4 mb-6 bg-slate-50/30">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="p-1 bg-amber-100/50 rounded text-amber-600">
                <Coins size={14} />
              </div>
              <span className="text-xs font-black text-slate-800 tracking-tight">Budget Optimization Allocation</span>
            </div>
            
            {/* Range Axis */}
            <div className="mb-6 relative pt-2">
              <div className="flex justify-between items-center mb-1 px-1">
                <span className="text-[9px] font-bold text-slate-400">Spend Limit Range</span>
                <span className="text-[9px] font-black text-slate-700">¥0 - ¥{budgetStats.totalCurrentBudget.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                {/* Yellow to Green Gradient Bar - NO PURPLE */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-emerald-400 to-emerald-500 opacity-80" />
                
                {/* Marker line for suggested - Widened and matching suggested card color */}
                <div 
                  className="absolute top-0 h-full w-1 bg-blue-600 z-10 shadow-[0_0_4px_rgba(37,99,235,0.5)]"
                  style={{ left: `${Math.min(suggestedBudgetPercentage, 100)}%`, transform: 'translateX(-50%)' }}
                />
              </div>
              {/* Scale points */}
              <div className="absolute top-[22px] left-[75%] w-px h-2.5 bg-slate-300" />
              <div className="absolute top-[22px] right-0 w-px h-2.5 bg-emerald-500" />
            </div>

            {/* Comparative Boxes */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 mb-1">Current</span>
                <span className="text-base font-black text-slate-800 tracking-tight">¥{budgetStats.totalCurrentBudget.toLocaleString()}</span>
              </div>
              
              <ArrowRight size={14} className="text-slate-300 shrink-0" />
              
              <div className="flex-[1.2] bg-white border-2 border-blue-600 rounded-xl p-3 flex flex-col shadow-lg shadow-blue-50">
                <span className="text-[9px] font-bold text-blue-600 mb-1">Optimized</span>
                <span className="text-base font-black text-slate-900 tracking-tight">¥{budgetStats.totalSuggestedBudget.toLocaleString()}</span>
              </div>
              
              <div className="flex-1 bg-slate-100/80 border border-slate-200 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 mb-1">Reserved</span>
                <span className="text-base font-black text-blue-600 tracking-tight">¥{remainingBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bottom Functional Grid */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {/* Copilot + Manual Card */}
            <div 
              className={`group relative border-2 rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-500 cursor-pointer overflow-hidden ${!autoApply ? 'bg-blue-50 border-blue-500 shadow-[0_10px_20px_rgba(59,130,246,0.1)] scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-200'}`}
              onClick={() => autoApply && onAutoApplyToggle()}
            >
              <div className={`mb-3 p-2 rounded-xl transition-all duration-500 relative z-10 flex items-center gap-1 ${!autoApply ? 'bg-white shadow-sm' : 'bg-blue-50'}`}>
                <User size={16} className={!autoApply ? 'text-blue-600' : 'text-blue-400'} />
                <Plus size={10} className="text-blue-300" />
                <Bot size={16} className={!autoApply ? 'text-blue-600' : 'text-blue-400'} />
              </div>
              
              <p className={`text-[13px] font-black mb-1.5 tracking-tight relative z-10 italic ${!autoApply ? 'text-blue-700' : 'text-slate-800'}`}>Copilot + Manual</p>
              <p className={`text-[9px] font-bold leading-snug mb-3 px-1 relative z-10 min-h-[36px] ${!autoApply ? 'text-blue-600/70' : 'text-slate-400'}`}>
                Daily analysis with suggested adjustments requiring your <span className={!autoApply ? 'text-blue-700 underline underline-offset-2' : ''}>Manual Approval</span>.
              </p>
              
              <div className={`mt-auto flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-500 relative z-10 ${!autoApply ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${!autoApply ? 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black tracking-widest">{!autoApply ? 'RUNNING' : 'STANDBY'}</span>
              </div>
            </div>

            {/* AI Autopilot Card */}
            <div 
              className={`group relative border-2 rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-500 cursor-pointer overflow-hidden ${autoApply ? 'bg-slate-900 border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.3)] scale-[1.05] z-10' : 'bg-white border-slate-100 hover:border-indigo-200 opacity-90'}`}
              onClick={() => !autoApply && onAutoApplyToggle()}
            >
              {/* Promotion Badge when not active */}
              {!autoApply && (
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce shadow-lg flex items-center gap-1">
                    <Infinity size={8} />
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
              
              <div className="mb-3 transition-all duration-500 relative z-10">
                <RealisticRadar active={autoApply} />
              </div>
              
              <p className={`text-[13px] font-black mb-1.5 tracking-tight relative z-10 italic ${autoApply ? 'text-white' : 'text-slate-800'}`}>AI Autopilot</p>
              <p className={`text-[9px] font-bold leading-snug mb-3 px-1 relative z-10 min-h-[36px] ${autoApply ? 'text-slate-400' : 'text-slate-400'}`}>
                Full <span className={autoApply ? 'text-indigo-400 underline underline-offset-2' : ''}>Autonomous Optimization</span> with 24/7 monitoring to maximize ROAS.
              </p>
              
              <div className={`mt-auto flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-500 relative z-10 ${autoApply ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${autoApply ? 'bg-green-400 animate-ping shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black tracking-widest">{autoApply ? 'RUNNING' : 'STANDBY'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChannelAISummary;
