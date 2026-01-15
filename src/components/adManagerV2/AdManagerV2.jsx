import React, { useState, useEffect } from 'react';
import { MOCK_CAMPAIGNS, MOCK_GOALS, MOCK_RULES, Platform } from '../../services/adManager/mockData';
import DetailDrawer from './DetailDrawer';
import { 
  Calendar, Search, Filter, RefreshCw, Layers, BrainCircuit, 
  TrendingUp, TrendingDown, Eye, 
  Activity, Sparkles, AlertTriangle, ShieldCheck,
  Zap, Command, Cpu, Sigma, X,
  Briefcase, Target as TargetIcon, CheckCircle2, Maximize2,
  Bot, Check, ThumbsDown, ChevronDown, Monitor, UserCircle
} from 'lucide-react';

// Platform icon URLs
const META_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256';
const GOOGLE_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256';
const TIKTOK_ICON_URL = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256';

// 定义事件类型标签
const EVENT1_LABEL = 'Event1';
const EVENT2_LABEL = 'Event2';

// 表头显示名称映射
const TABLE_HEADERS = {
  event1s: `${EVENT1_LABEL}s`,
  cpaEvent1: `CPA-${EVENT1_LABEL}<br/><span className="text-[8px] font-normal">(CVR)</span>`,
  event2s: `${EVENT2_LABEL}s`,
  cpaEvent2: `CPA-${EVENT2_LABEL}<br/><span className="text-[8px] font-normal">(CTR)</span>`,
  purchases: 'Purchases',
  cpaPurchase: `CPA-Purchase<br/><span className="text-[8px] font-normal">(CVR)</span>`,
  purchaseValue: `Purchase Value<br/><span className="text-[8px] font-normal">(ROAS)</span>`
};

const AdManagerV2 = () => {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [rules, setRules] = useState(MOCK_RULES);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 新增筛选状态
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  
  // 排序状态
  const [sortField, setSortField] = useState('spend');
  const [sortDirection, setSortDirection] = useState('desc');

  const [showRules, setShowRules] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  
  // 轮播索引
  const [gainIndex, setGainIndex] = useState(0);
  const [riskIndex, setRiskIndex] = useState(0);
  const [goalIndex, setGoalIndex] = useState(0);

  const gainInsights = [
    { title: 'Key Highlights', content: 'US Meta CPA decreased by 12%', icon: <ShieldCheck size={14} className="text-green-600" /> },
    { title: 'Key Highlights', content: 'TikTok conversion rate increased by 8.5%', icon: <ShieldCheck size={14} className="text-green-600" /> },
    { title: 'Key Highlights', content: 'Google brand search share +15%', icon: <ShieldCheck size={14} className="text-green-600" /> },
  ];

  const riskInsights = [
    { title: 'Potential Risks', content: 'IN Google CPM surged by 25%', icon: <AlertTriangle size={14} className="text-amber-600" /> },
    { title: 'Potential Risks', content: 'Meta ad creative fatigue warning (Creative Set A)', icon: <AlertTriangle size={14} className="text-amber-600" /> },
    { title: 'Potential Risks', content: 'TikTok audience overlap too high', icon: <AlertTriangle size={14} className="text-amber-600" /> },
  ];

  const businessGoals = goals.filter(g => g.type === 'Business');
  const optimizationGoals = goals.filter(g => g.type === 'Optimization');

  // 提取唯一的账户列表
  const uniqueAccounts = Array.from(new Set(MOCK_CAMPAIGNS.map(c => c.accountName)));

  useEffect(() => {
    const timer = setInterval(() => {
      setGainIndex((prev) => (prev + 1) % gainInsights.length);
      setRiskIndex((prev) => (prev + 1) % riskInsights.length);
      setGoalIndex((prev) => (prev + 1) % (businessGoals.length || 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [gainInsights.length, riskInsights.length, businessGoals]);

  const refreshAIAdvice = async () => {
    setLoading(true);
    const updated = await Promise.all(campaigns.map(async (c) => {
      // Add AI advice to campaign
      const campaignWithAdvice = { 
        ...c, 
        aiAdvice: c.budgetReason ? {
          currentBudget: c.currentBudget,
          recommendedBudget: c.suggestedBudget,
          reasons: c.budgetReason.reasons,
          detailedAnalysis: c.budgetReason.detailedReason
        } : null
      };
      return campaignWithAdvice;
    }));
    setCampaigns(updated);
    setLoading(false);
  };

  useEffect(() => {
    refreshAIAdvice();
  }, []);

  // 排序逻辑
  const sortCampaigns = (campaignsToSort) => {
    return [...campaignsToSort].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'spend':
          aValue = a.todayMetrics.spend;
          bValue = b.todayMetrics.spend;
          break;
        case 'impressions':
          aValue = a.todayMetrics.impressions;
          bValue = b.todayMetrics.impressions;
          break;
        case 'cpm':
          aValue = a.todayMetrics.spend / a.todayMetrics.impressions * 1000;
          bValue = b.todayMetrics.spend / b.todayMetrics.impressions * 1000;
          break;
        case 'clicks':
          aValue = a.todayMetrics.clicks;
          bValue = b.todayMetrics.clicks;
          break;
        case 'cpc':
          aValue = a.todayMetrics.cpc;
          bValue = b.todayMetrics.cpc;
          break;
        case 'event1s':
          aValue = a.todayMetrics.event1s;
          bValue = b.todayMetrics.event1s;
          break;
        case 'cpaEvent1':
          aValue = a.todayMetrics.cpaEvent1;
          bValue = b.todayMetrics.cpaEvent1;
          break;
        case 'event2s':
          aValue = a.todayMetrics.event2s;
          bValue = b.todayMetrics.event2s;
          break;
        case 'cpaEvent2':
          aValue = a.todayMetrics.cpaEvent2;
          bValue = b.todayMetrics.cpaEvent2;
          break;
        case 'purchases':
          aValue = a.todayMetrics.purchases;
          bValue = b.todayMetrics.purchases;
          break;
        case 'cpaPurchase':
          aValue = a.todayMetrics.cpaPurchase;
          bValue = b.todayMetrics.cpaPurchase;
          break;
        case 'purchaseValue':
          aValue = a.todayMetrics.revenue;
          bValue = b.todayMetrics.revenue;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // 多维度过滤逻辑
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || c.platform === filterPlatform;
    const matchesAccount = filterAccount === 'All' || c.accountName === filterAccount;
    return matchesSearch && matchesPlatform && matchesAccount;
  });

  // 应用排序
  const sortedCampaigns = sortCampaigns(filteredCampaigns);

  const totalSpend = campaigns.reduce((acc, c) => acc + c.todayMetrics.spend, 0);
  const totalEvent1s = campaigns.reduce((acc, c) => acc + c.todayMetrics.event1s, 0);
  const avgCpaEvent1 = totalEvent1s > 0 ? totalSpend / totalEvent1s : 0;
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.todayMetrics.revenue, 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const aggregates = filteredCampaigns.reduce((acc, c) => {
    acc.budget += c.currentBudget;
    acc.spend += c.todayMetrics.spend;
    acc.impressions += c.todayMetrics.impressions;
    acc.clicks += c.todayMetrics.clicks;
    acc.event1s += c.todayMetrics.event1s;
    acc.event2s += c.todayMetrics.event2s;
    acc.purchases += c.todayMetrics.purchases;
    acc.revenue += c.todayMetrics.revenue;
    return acc;
  }, { budget: 0, spend: 0, impressions: 0, clicks: 0, event1s: 0, event2s: 0, purchases: 0, revenue: 0 });

  const aggCpm = aggregates.impressions > 0 ? (aggregates.spend / aggregates.impressions) * 1000 : 0;
  const aggCtr = aggregates.impressions > 0 ? (aggregates.clicks / aggregates.impressions) * 100 : 0;
  const aggCpc = aggregates.clicks > 0 ? aggregates.spend / aggregates.clicks : 0;
  const aggCpaEvent1 = aggregates.event1s > 0 ? aggregates.spend / aggregates.event1s : 0;
  const aggCvrEvent1 = aggregates.clicks > 0 ? (aggregates.event1s / aggregates.clicks) * 100 : 0;
  const aggCpaEvent2 = aggregates.event2s > 0 ? aggregates.spend / aggregates.event2s : 0;
  const aggCvrEvent2 = aggregates.clicks > 0 ? (aggregates.event2s / aggregates.clicks) * 100 : 0;
  const aggCpaPurchase = aggregates.purchases > 0 ? aggregates.spend / aggregates.purchases : 0;
  const aggCvrPurchase = aggregates.event1s > 0 ? (aggregates.purchases / aggregates.event1s) * 100 : 0;
  const aggRoasVal = aggregates.spend > 0 ? aggregates.revenue / aggregates.spend : 0;

  const getPlatformIcon = (platform) => {
    if (platform === Platform.META) return <img src={META_ICON_URL} alt="Meta" className="w-5 h-5 rounded" />;
    if (platform === Platform.GOOGLE) return <img src={GOOGLE_ICON_URL} alt="Google" className="w-5 h-5 rounded" />;
    return <img src={TIKTOK_ICON_URL} alt="TikTok" className="w-5 h-5 rounded" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <main className="max-w-[1800px] mx-auto px-8 pt-6">
        
        {/* Dashboard Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
          
          {/* Left Column: AI Summary (2/3 Width) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5 mb-2 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-500" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Cross-Channel AI Summary</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[8px] font-bold text-blue-700">
                    <img src={META_ICON_URL} alt="Meta" className="w-3 h-3 rounded" />
                    Meta
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 border border-red-100 rounded text-[8px] font-bold text-red-700">
                    <img src={GOOGLE_ICON_URL} alt="Google" className="w-3 h-3 rounded" />
                    Google
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setShowRules(!showRules)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all shadow-sm border ${showRules ? 'bg-purple-600 border-purple-700 text-white' : 'bg-white border-purple-100 text-purple-600 hover:bg-purple-50'}`}
                >
                  <Zap size={10} className={showRules ? 'fill-current' : ''} />
                  <span className="text-[9px] font-black uppercase tracking-tight">Rule Library</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3 shrink-0 py-1 bg-slate-50/50 rounded-lg px-3">
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">Spend</p>
                <p className="text-base font-black text-slate-900 leading-none">¥{totalSpend.toFixed(0)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">{EVENT1_LABEL}s</p>
                <p className="text-base font-black text-blue-600 leading-none">{totalEvent1s}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">CPA ({EVENT1_LABEL})</p>
                <p className="text-base font-black text-slate-800 leading-none">¥{avgCpaEvent1.toFixed(2)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">ROAS</p>
                <p className="text-base font-black text-slate-800 leading-none">{avgRoas.toFixed(2)}x</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 flex-grow overflow-hidden">
              <div className="col-span-3 flex flex-col border-r border-slate-100 pr-4 overflow-hidden h-full">
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <Cpu size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">Deep AI Analysis Insights</span>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  <div className="text-[12px] text-slate-600 leading-relaxed font-medium space-y-2.5">
                    <p>1. In the past 24 hours, Meta campaigns in the US market have shown excellent scaling potential, with ROAS stable above 3.5 without any signs of decline.</p>
                    <p>2. Through detailed analysis of the mid-funnel, we found that click-to-conversion efficiency has significantly improved, indicating high alignment between creatives and audience.</p>
                    <p>3. We recommend adopting a step-by-step budget increase strategy (15%-20% increase per step) in the upcoming cycle to capture high-intent unconverted traffic.</p>
                    <p>4. Based on the current cross-platform traffic distribution model, we suggest appropriately shifting budget towards TikTok to maintain sustained activity at the top of the brand funnel.</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex flex-col gap-2 h-full overflow-hidden pl-1">
                <div className="flex-[1.5] bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit size={12} className="text-blue-600" />
                      <h2 className="text-[9px] font-black uppercase tracking-tighter text-blue-700">Goal Matrix</h2>
                    </div>
                    <div className="flex gap-0.5">
                      {businessGoals.map((_, i) => (
                        <div key={i} className={`h-1 w-2 rounded-full transition-all ${i === goalIndex ? 'bg-blue-600' : 'bg-blue-200'}`} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center space-y-2">
                    <div key={`goal-${goalIndex}`} className="animate-in fade-in slide-in-from-right-1 duration-300">
                      <div className="bg-white border border-blue-100 rounded-lg px-2 py-1.5 flex items-center justify-between border-l-4 border-l-blue-600 shadow-sm mb-1.5">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <TargetIcon size={12} className="text-red-500 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-700 truncate">
                            {businessGoals[goalIndex]?.country}，DailyBudget${businessGoals[goalIndex]?.budget}，{businessGoals[goalIndex]?.targetMetric}{businessGoals[goalIndex]?.comparison}{businessGoals[goalIndex]?.targetValue}
                          </p>
                        </div>
                        <CheckCircle2 size={10} className="text-green-500 shrink-0 ml-1" />
                      </div>

                      {optimizationGoals.length > 0 && (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg px-2 py-1.5 flex items-center justify-between border-l-4 border-l-purple-600 shadow-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Bot size={12} className="text-purple-600 shrink-0" />
                            <p className="text-[10px] font-bold text-purple-800 truncate">
                              {optimizationGoals[0].country}，DailyBudget${optimizationGoals[0].budget}，{optimizationGoals[0].targetMetric}{optimizationGoals[0].comparison}{optimizationGoals[0].targetValue}
                            </p>
                          </div>
                          <Sparkles size={10} className="text-purple-400 shrink-0 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between group/switch cursor-pointer transition-all hover:border-blue-200"
                  onClick={() => setAutoApply(!autoApply)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <Bot size={18} className="text-slate-600" />
                      </div>
                      <Sparkles size={8} className="absolute -top-0.5 -right-0.5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 tracking-tight leading-none">Auto-apply<br/>AI Recs</span>
                  </div>
                  <div className={`relative w-9 h-5 transition-colors duration-300 rounded-full border-2 ${autoApply ? 'bg-green-500 border-green-500' : 'bg-slate-200 border-slate-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${autoApply ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights & Risks (1/3 Width) */}
          <div className="lg:col-span-1 h-full flex flex-col gap-4">
            <div className="flex-1 flex flex-col relative bg-green-50/50 border border-green-100 rounded-2xl p-4 overflow-hidden group shadow-sm">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <ShieldCheck size={18} className="text-green-600" />
                </div>
                <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">Key Highlights</span>
              </div>
              <div className="flex-grow flex items-center">
                <div key={`gain-${gainIndex}`} className="w-full animate-in fade-in slide-in-from-right-2 duration-300">
                  <p className="text-xs font-black text-green-800 leading-tight mb-2 uppercase tracking-tighter">Item {gainIndex + 1}/{gainInsights.length}</p>
                  <p className="text-base text-green-700 font-bold leading-snug">{gainInsights[gainIndex].content}</p>
                </div>
              </div>
              <div className="flex justify-start gap-1.5 mt-4 shrink-0 px-1">
                {gainInsights.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === gainIndex ? 'w-6 bg-green-500' : 'w-2 bg-green-200'}`} />
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col relative bg-amber-50/50 border border-amber-100 rounded-2xl p-4 overflow-hidden group shadow-sm">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <AlertTriangle size={18} className="text-amber-600" />
                </div>
                <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Potential Risks</span>
              </div>
              <div className="flex-grow flex items-center">
                <div key={`risk-${riskIndex}`} className="w-full animate-in fade-in slide-in-from-right-2 duration-300">
                  <p className="text-xs font-black text-amber-800 leading-tight mb-2 uppercase tracking-tighter">Risk {riskIndex + 1}/{riskInsights.length}</p>
                  <p className="text-base text-amber-700 font-bold leading-snug">{riskInsights[riskIndex].content}</p>
                </div>
              </div>
              <div className="flex justify-start gap-1.5 mt-4 shrink-0 px-1">
                {riskInsights.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === riskIndex ? 'w-6 bg-amber-500' : 'w-2 bg-amber-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4 flex-wrap">
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search campaigns..." 
                   className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>

               <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <Monitor size={14} className="text-slate-400 group-hover:text-blue-500" />
                  <select 
                    className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
                    value={filterPlatform}
                    onChange={e => setFilterPlatform(e.target.value)}
                  >
                    <option value="All">All Platforms</option>
                    <option value={Platform.META}>Meta</option>
                    <option value={Platform.GOOGLE}>Google</option>
                    <option value={Platform.TIKTOK}>TikTok</option>
                  </select>
               </div>

               <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <UserCircle size={14} className="text-slate-400 group-hover:text-blue-500" />
                  <select 
                    className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
                    value={filterAccount}
                    onChange={e => setFilterAccount(e.target.value)}
                  >
                    <option value="All">All Accounts</option>
                    {uniqueAccounts.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
               </div>
            </div>
            
            <div className="flex gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">
              <span>{sortedCampaigns.length} campaigns</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 tracking-wider">
                  <th className="px-4 py-4 whitespace-nowrap"><input type="checkbox" className="rounded" /></th>
                  <th className="px-4 py-4 whitespace-nowrap">Campaign</th>
                  <th className="px-4 py-4 whitespace-nowrap">Accounts</th>
                  <th className="px-4 py-4 text-center whitespace-nowrap">Locations</th>
                  <th className="px-4 py-4 text-center whitespace-nowrap">Conv. goal</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap">Daily budget</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50">Budget optimization</th>
                  <th className="px-4 py-4 min-w-[240px] text-purple-700 bg-purple-50">Optimize Reason</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('spend')}>Spend {getSortIcon('spend')}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('impressions')}>Impressions {getSortIcon('impressions')}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('cpm')}>CPM {getSortIcon('cpm')}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('clicks')}>Clicks {getSortIcon('clicks')}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('cpc')}>CPC<br/><span className="text-[8px] font-normal">(CTR)</span> {getSortIcon('cpc')}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50">{TABLE_HEADERS.event1s}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50 cursor-pointer hover:bg-purple-100" onClick={() => handleSort('cpaEvent1')} dangerouslySetInnerHTML={{ __html: TABLE_HEADERS.cpaEvent1 }}></th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50">{TABLE_HEADERS.event2s}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50 cursor-pointer hover:bg-purple-100" onClick={() => handleSort('cpaEvent2')} dangerouslySetInnerHTML={{ __html: TABLE_HEADERS.cpaEvent2 }}></th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50">{TABLE_HEADERS.purchases}</th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50 cursor-pointer hover:bg-purple-100" onClick={() => handleSort('cpaPurchase')} dangerouslySetInnerHTML={{ __html: TABLE_HEADERS.cpaPurchase }}></th>
                  <th className="px-4 py-4 text-right whitespace-nowrap text-purple-700 bg-purple-50 cursor-pointer hover:bg-purple-100" onClick={() => handleSort('purchaseValue')} dangerouslySetInnerHTML={{ __html: TABLE_HEADERS.purchaseValue }}></th>
                </tr>
              </thead>
              <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <tr>
                  <td className="px-4 py-3 text-center"><Sigma size={14} className="text-blue-400 inline" /></td>
                  <td className="px-4 py-3 text-[10px] tracking-widest font-black">Total Summary</td>
                  <td className="px-4 py-3 text-center text-[9px] text-slate-400">--</td>
                  <td className="px-4 py-3 text-center text-[9px] text-slate-400">--</td>
                  <td className="px-4 py-3 text-center text-[9px] text-slate-400">--</td>
                  <td className="px-4 py-3 text-right text-[10px]">¥{aggregates.budget.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[9px] text-slate-500 italic">--</td>
                  <td className="px-4 py-3 text-[9px] text-slate-500 italic">Multi-Dimensional Filter Summary</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">¥{aggregates.spend.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">{aggregates.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">¥{aggCpm.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">{aggregates.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">
                    ¥{aggCpc.toFixed(1)} <span className="text-[8px] text-blue-300/60">({aggCtr.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">{aggregates.event1s.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">
                    ¥{aggCpaEvent1.toFixed(1)} <span className="text-[8px] text-blue-300/60">({aggCvrEvent1.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">{aggregates.event2s.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">
                    ¥{aggCpaEvent2.toFixed(1)} <span className="text-[8px] text-blue-300/60">({aggCvrEvent2.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">{aggregates.purchases.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">
                    ¥{aggCpaPurchase.toFixed(1)} <span className="text-[8px] text-blue-300/60">({aggCvrPurchase.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[10px] font-mono">
                    ¥{aggregates.revenue.toFixed(0)} <span className="text-blue-400 font-black">({aggRoasVal.toFixed(1)}x)</span>
                  </td>
                </tr>
              </tfoot>
              <tbody className="divide-y divide-slate-50">
                {sortedCampaigns.map((c) => {
                  const m = c.todayMetrics;
                  const cpm = (m.spend / m.impressions) * 1000;
                  const ctr = (m.clicks / m.impressions) * 100;
                  const cvrEvent1 = (m.event1s / m.clicks) * 100;
                  const cvrEvent2 = (m.event2s / m.clicks) * 100;
                  const cvrPurchase = (m.purchases / m.event1s) * 100;

                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCampaign(c)}
                    >
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-4 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          {getPlatformIcon(c.platform)}
                          <div>
                            <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">{c.name}</p>
                            <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase ${c.status === 'active' ? 'text-green-500' : 'text-slate-400'}`}>
                              {c.status === 'active' ? 'Active' : 'Paused'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold text-slate-500">{c.accountName}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                           {c.country}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                         <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded text-[10px] font-bold text-blue-600">
                           {c.objective}
                         </span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-bold text-slate-700">¥{c.currentBudget}</td>
                      <td className="px-4 py-4 text-right">
                         {c.aiAdvice ? (
                            <div className="flex flex-col items-end gap-1.5">
                               <span className={`flex items-center gap-1 text-[11px] font-black ${c.aiAdvice.recommendedBudget > c.currentBudget ? 'text-green-600' : 'text-amber-600'}`}>
                                 {c.aiAdvice.recommendedBudget > c.currentBudget ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                 ¥{c.aiAdvice.recommendedBudget}
                               </span>
                               <div className="flex gap-2">
                                  <button 
                                    className="relative group/tooltip p-1.5 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                    onClick={(e) => { e.stopPropagation(); alert(`已采纳 ${c.name} 的建议`); }}
                                  >
                                    <Check size={12} strokeWidth={3} />
                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                      Accept Recommendation
                                    </span>
                                  </button>
                                  <button 
                                    className="relative group/tooltip p-1.5 bg-slate-50 text-slate-500 rounded border border-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                                    onClick={(e) => { e.stopPropagation(); alert('感谢您的反馈'); }}
                                  >
                                    <ThumbsDown size={12} strokeWidth={3} />
                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                      Not Accurate
                                    </span>
                                  </button>
                               </div>
                            </div>
                         ) : <span className="text-[10px] text-slate-300 italic animate-pulse">Analyzing...</span>}
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center justify-between gap-3 group/reason">
                            <div className="flex-grow">
                              {c.aiAdvice ? (
                                  <div className="space-y-0.5">
                                    {c.aiAdvice.reasons.map((reason, ri) => (
                                      <p key={ri} className="text-[9px] text-slate-500 line-clamp-1 italic flex items-start gap-1">
                                          <span className="text-blue-400 shrink-0">•</span> {reason}
                                      </p>
                                    ))}
                                  </div>
                              ) : <span className="text-[10px] text-slate-300">--</span>}
                            </div>
                            <button 
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover/reason:opacity-100 flex-shrink-0"
                              onClick={(e) => { e.stopPropagation(); setSelectedCampaign(c); }}
                            >
                              <Eye size={14} />
                            </button>
                         </div>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">¥{m.spend.toFixed(1)}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.impressions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">¥{cpm.toFixed(1)}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.clicks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        <div className="flex flex-col items-end">
                          <span>¥{m.cpc.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">({ctr.toFixed(1)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.event1s}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        <div className="flex flex-col items-end">
                          <span>¥{m.cpaEvent1.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">({cvrEvent1.toFixed(1)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.event2s}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        <div className="flex flex-col items-end">
                          <span>¥{m.cpaEvent2.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">({cvrEvent2.toFixed(1)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.purchases}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        <div className="flex flex-col items-end">
                          <span>¥{m.cpaPurchase.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">({cvrPurchase.toFixed(1)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-slate-800">
                        ¥{m.revenue.toFixed(0)} <span className="text-blue-600">({m.roas.toFixed(1)}x)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <p className="flex items-center gap-1.5"><Activity size={12} /> Data syncs automatically from media API every 15 minutes</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> KPI On Target</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> AI Scale Recommendation</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Strategy Under Review</span>
          </div>
        </div>
      </main>

      {selectedCampaign && (
        <DetailDrawer 
          campaign={selectedCampaign} 
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)} 
        />
      )}
    </div>
  );
};

export default AdManagerV2;
