
import React, { useState, useEffect } from 'react';
import { Campaign, Platform, Goal, OptimizationRule } from './types';
import { MOCK_CAMPAIGNS, MOCK_GOALS, MOCK_RULES } from './services/mockData';
import { getCampaignAdvice } from './services/geminiService';
import DetailDrawer from './components/DetailDrawer';
import { 
  Calendar, Search, Filter, RefreshCw, Layers, BrainCircuit, 
  TrendingUp, TrendingDown, Eye, 
  Activity, Sparkles, AlertTriangle, ShieldCheck,
  Zap, Command, Cpu, Sigma, X,
  Briefcase, Target as TargetIcon, CheckCircle2, Maximize2,
  Bot, Check, ThumbsDown, ChevronDown, Monitor, UserCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [rules, setRules] = useState<OptimizationRule[]>(MOCK_RULES);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 新增筛选状态
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [filterAccount, setFilterAccount] = useState<string>('All');

  const [showRules, setShowRules] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  
  // 轮播索引
  const [gainIndex, setGainIndex] = useState(0);
  const [riskIndex, setRiskIndex] = useState(0);
  const [goalIndex, setGoalIndex] = useState(0);

  const gainInsights = [
    { title: '高亮收益', content: 'US Meta CPA 降低 12%', icon: <ShieldCheck size={14} className="text-green-600" /> },
    { title: '高亮收益', content: 'TikTok 转化率提升 8.5%', icon: <ShieldCheck size={14} className="text-green-600" /> },
    { title: '高亮收益', content: 'Google 品牌词搜索占有率 +15%', icon: <ShieldCheck size={14} className="text-green-600" /> },
  ];

  const riskInsights = [
    { title: '潜在风险', content: 'IN Google CPM 激增 25%', icon: <AlertTriangle size={14} className="text-amber-600" /> },
    { title: '潜在风险', content: 'Meta 广告素材疲劳预警 (素材组 A)', icon: <AlertTriangle size={14} className="text-amber-600" /> },
    { title: '潜在风险', content: 'TikTok 部分受众重合度过高', icon: <AlertTriangle size={14} className="text-amber-600" /> },
  ];

  const businessGoals = goals.filter(g => g.type === 'Business');
  const optimizationGoals = goals.filter(g => g.type === 'Optimization');

  // 提取唯一的账户列表
  const uniqueAccounts = Array.from(new Set(MOCK_CAMPAIGNS.map(c => c.accountName)));

  useEffect(() => {
    const timer = setInterval(() => {
      setGainIndex((prev) => (prev + 1) % gainInsights.length);
      setRiskIndex((prev) => (prev + 1) % riskInsights.length);
      setGoalIndex((prev) => (prev + 1) % businessGoals.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [gainInsights.length, riskInsights.length, businessGoals.length]);

  const refreshAIAdvice = async () => {
    setLoading(true);
    const updated = await Promise.all(campaigns.map(async (c) => {
      const advice = await getCampaignAdvice(c);
      return { ...c, aiAdvice: advice };
    }));
    setCampaigns(updated);
    setLoading(false);
  };

  useEffect(() => {
    refreshAIAdvice();
  }, []);

  // 多维度过滤逻辑
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || c.platform === filterPlatform;
    const matchesAccount = filterAccount === 'All' || c.accountName === filterAccount;
    return matchesSearch && matchesPlatform && matchesAccount;
  });

  const totalSpend = campaigns.reduce((acc, c) => acc + c.todayMetrics.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.todayMetrics.revenue, 0);
  const totalConv = campaigns.reduce((acc, c) => acc + c.todayMetrics.conversions, 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const aggregates = filteredCampaigns.reduce((acc, c) => {
    acc.budget += c.currentBudget;
    acc.spend += c.todayMetrics.spend;
    acc.impressions += c.todayMetrics.impressions;
    acc.clicks += c.todayMetrics.clicks;
    acc.conversions += c.todayMetrics.conversions;
    acc.purchases += c.todayMetrics.purchases;
    acc.revenue += c.todayMetrics.revenue;
    return acc;
  }, { budget: 0, spend: 0, impressions: 0, clicks: 0, conversions: 0, purchases: 0, revenue: 0 });

  const aggCpm = aggregates.impressions > 0 ? (aggregates.spend / aggregates.impressions) * 1000 : 0;
  const aggCtr = aggregates.impressions > 0 ? (aggregates.clicks / aggregates.impressions) * 100 : 0;
  const aggCpc = aggregates.clicks > 0 ? aggregates.spend / aggregates.clicks : 0;
  const aggCpa = aggregates.conversions > 0 ? aggregates.spend / aggregates.conversions : 0;
  const aggCvr1 = aggregates.clicks > 0 ? (aggregates.conversions / aggregates.clicks) * 100 : 0;
  const aggCpp = aggregates.purchases > 0 ? aggregates.spend / aggregates.purchases : 0;
  const aggCvr2 = aggregates.conversions > 0 ? (aggregates.purchases / aggregates.conversions) * 100 : 0;
  const aggRoasVal = aggregates.spend > 0 ? aggregates.revenue / aggregates.spend : 0;

  const getPlatformIcon = (platform: Platform) => {
    if (platform === Platform.META) return <span className="bg-blue-600 p-1 rounded-md text-white font-black text-[9px] w-5 h-5 flex items-center justify-center">M</span>;
    if (platform === Platform.GOOGLE) return <span className="bg-red-500 p-1 rounded-md text-white font-black text-[9px] w-5 h-5 flex items-center justify-center">G</span>;
    return <span className="bg-black p-1 rounded-md text-white font-black text-[9px] w-5 h-5 flex items-center justify-center">T</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-md">
              <Layers className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">OmniAd Professional</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">AI Marketing OS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              <Calendar size={14} className="text-slate-400" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none"
              />
            </div>
            <button 
              onClick={refreshAIAdvice}
              className={`p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} className="text-slate-500" />
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 p-0.5 cursor-pointer overflow-hidden">
               <img src="https://picsum.photos/40/40" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 pt-6">
        
        {/* Dashboard Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
          
          {/* Left Column: AI Summary (2/3 Width) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5 mb-2 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-500" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">全渠道智能摘要</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[8px] font-bold text-blue-700">
                    <span className="bg-blue-600 w-3 h-3 rounded-[2px] flex items-center justify-center text-white text-[7px]">M</span>
                    Meta
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 border border-red-100 rounded text-[8px] font-bold text-red-700">
                    <span className="bg-red-500 w-3 h-3 rounded-[2px] flex items-center justify-center text-white text-[7px]">G</span>
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
                  <span className="text-[9px] font-black uppercase tracking-tight">规则库</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3 shrink-0 py-1 bg-slate-50/50 rounded-lg px-3">
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">今日总消耗</p>
                <p className="text-base font-black text-slate-900 leading-none">¥{totalSpend.toFixed(0)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">今日总营收</p>
                <p className="text-base font-black text-blue-600 leading-none">¥{totalRevenue.toFixed(0)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">平均 ROAS</p>
                <p className="text-base font-black text-slate-800 leading-none">{avgRoas.toFixed(2)}x</p>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] font-black text-slate-400 uppercase">转化总量</p>
                <p className="text-base font-black text-slate-800 leading-none">{totalConv}</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 flex-grow overflow-hidden">
              <div className="col-span-3 flex flex-col border-r border-slate-100 pr-4 overflow-hidden h-full">
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <Cpu size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">深度 AI 分析建议</span>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  <div className="text-[12px] text-slate-600 leading-relaxed font-medium space-y-2.5">
                    <p>1. 过去 24 小时内，US 市场的 Meta 广告系列表现出极佳的扩展潜力，ROAS 稳定在 3.5 以上且无下滑迹象。</p>
                    <p>2. 通过对漏斗中层的细致分析，我们发现点击到转化的效率显著提升，表明创意与受众契合度高。</p>
                    <p>3. 建议在接下来的周期内，采取阶梯式预算上调策略（单次增幅 15%-20%），捕捉高意向未转化流量。</p>
                    <p>4. 基于当前的跨平台流量分布模型，建议适当向 TikTok 侧倾斜预算，以维持品牌漏斗顶端的持续活跃。</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex flex-col gap-2 h-full overflow-hidden pl-1">
                <div className="flex-[1.5] bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit size={12} className="text-blue-600" />
                      <h2 className="text-[9px] font-black uppercase tracking-tighter text-blue-700">目标看板 (Goal Matrix)</h2>
                    </div>
                    <div className="flex gap-0.5">
                      {businessGoals.map((_, i) => (
                        <div key={i} className={`h-1 w-2 rounded-full transition-all ${i === goalIndex ? 'bg-blue-600' : 'bg-blue-200'}`} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center space-y-2">
                    <div key={`goal-${goalIndex}`} className="animate-in fade-in slide-in-from-right-1 duration-300">
                      {/* Business Goal Message */}
                      <div className="bg-white border border-blue-100 rounded-lg px-2 py-1.5 flex items-center justify-between border-l-4 border-l-blue-600 shadow-sm mb-1.5">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <TargetIcon size={12} className="text-red-500 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-700 truncate">
                            {businessGoals[goalIndex].country}，DailyBudget${businessGoals[goalIndex].budget}，{businessGoals[goalIndex].targetMetric}{businessGoals[goalIndex].comparison}{businessGoals[goalIndex].targetValue}
                          </p>
                        </div>
                        <CheckCircle2 size={10} className="text-green-500 shrink-0 ml-1" />
                      </div>

                      {/* Optimization Goal Message (Purple) */}
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
                <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">高亮收益 (Highlights)</span>
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
                <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest">潜在风险 (Risks)</span>
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
               {/* 搜索框 */}
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="搜索广告系列..." 
                   className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>

               {/* 广告平台筛选 */}
               <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <Monitor size={14} className="text-slate-400 group-hover:text-blue-500" />
                  <select 
                    className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
                    value={filterPlatform}
                    onChange={e => setFilterPlatform(e.target.value)}
                  >
                    <option value="All">所有平台</option>
                    <option value={Platform.META}>Meta</option>
                    <option value={Platform.GOOGLE}>Google</option>
                    <option value={Platform.TIKTOK}>TikTok</option>
                  </select>
               </div>

               {/* 广告账户筛选 */}
               <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <UserCircle size={14} className="text-slate-400 group-hover:text-blue-500" />
                  <select 
                    className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
                    value={filterAccount}
                    onChange={e => setFilterAccount(e.target.value)}
                  >
                    <option value="All">所有账户</option>
                    {uniqueAccounts.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
               </div>
            </div>
            
            <div className="flex gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">
              <span>{filteredCampaigns.length} 个广告系列</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1750px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-4 w-10"><input type="checkbox" className="rounded" /></th>
                  <th className="px-4 py-4">广告系列</th>
                  <th className="px-4 py-4">广告账户</th>
                  <th className="px-4 py-4 text-center">国家</th>
                  <th className="px-4 py-4 text-center">目标</th>
                  <th className="px-4 py-4 text-right">预算</th>
                  <th className="px-4 py-4 text-right">AI 建议预算</th>
                  <th className="px-4 py-4 min-w-[240px]">调整原因与分析</th>
                  <th className="px-4 py-4 text-right">消耗</th>
                  <th className="px-4 py-4 text-right">Impression</th>
                  <th className="px-4 py-4 text-right">CPM</th>
                  <th className="px-4 py-4 text-right">Click</th>
                  <th className="px-4 py-4 text-right">CPC (CTR)</th>
                  <th className="px-4 py-4 text-right">Action</th>
                  <th className="px-4 py-4 text-right">CPA (CVR1)</th>
                  <th className="px-4 py-4 text-right">Purchase</th>
                  <th className="px-4 py-4 text-right">CPP (CVR2)</th>
                  <th className="px-4 py-4 text-right">Purchase Value (ROAS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCampaigns.map((c) => {
                  const m = c.todayMetrics;
                  const cpm = (m.spend / m.impressions) * 1000;
                  const ctr = (m.clicks / m.impressions) * 100;
                  const cvr1 = (m.conversions / m.clicks) * 100;
                  const cvr2 = (m.purchases / m.conversions) * 100;

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
                                      采纳建议
                                    </span>
                                  </button>
                                  <button 
                                    className="relative group/tooltip p-1.5 bg-slate-50 text-slate-500 rounded border border-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                                    onClick={(e) => { e.stopPropagation(); alert('感谢您的反馈'); }}
                                  >
                                    <ThumbsDown size={12} strokeWidth={3} />
                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                      建议不准
                                    </span>
                                  </button>
                               </div>
                            </div>
                         ) : <span className="text-[10px] text-slate-300 italic animate-pulse">分析中...</span>}
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
                        ¥{m.cpc.toFixed(1)} <span className="text-[10px] text-slate-400">({ctr.toFixed(1)}%)</span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.conversions}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        ¥{m.cpa.toFixed(1)} <span className="text-[10px] text-slate-400">({cvr1.toFixed(1)}%)</span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">{m.purchases}</td>
                      <td className="px-4 py-4 text-right text-xs font-mono text-slate-600">
                        ¥{m.cpp.toFixed(1)} <span className="text-[10px] text-slate-400">({cvr2.toFixed(1)}%)</span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-slate-800">
                        ¥{m.revenue.toFixed(0)} <span className="text-blue-600">({m.roas.toFixed(1)}x)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <tr>
                  <td className="px-4 py-5 text-center"><Sigma size={16} className="text-blue-400 inline" /></td>
                  <td className="px-4 py-5 text-xs uppercase tracking-widest font-black">合计汇总 (Totals)</td>
                  <td className="px-4 py-5 text-center text-[10px] text-slate-400">--</td>
                  <td className="px-4 py-5 text-center text-[10px] text-slate-400">--</td>
                  <td className="px-4 py-5 text-center text-[10px] text-slate-400">--</td>
                  <td className="px-4 py-5 text-right text-xs">¥{aggregates.budget.toLocaleString()}</td>
                  <td className="px-4 py-5 text-right text-[10px] text-slate-500 italic">--</td>
                  <td className="px-4 py-5 text-[10px] text-slate-500 italic">多维过滤汇总分析</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">¥{aggregates.spend.toFixed(1)}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">{aggregates.impressions.toLocaleString()}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">¥{aggCpm.toFixed(1)}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">{aggregates.clicks.toLocaleString()}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">
                    ¥{aggCpc.toFixed(1)} <span className="text-[9px] text-blue-300/60">({aggCtr.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-5 text-right text-xs font-mono">{aggregates.conversions.toLocaleString()}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">
                    ¥{aggCpa.toFixed(1)} <span className="text-[9px] text-blue-300/60">({aggCvr1.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-5 text-right text-xs font-mono">{aggregates.purchases.toLocaleString()}</td>
                  <td className="px-4 py-5 text-right text-xs font-mono">
                    ¥{aggCpp.toFixed(1)} <span className="text-[9px] text-blue-300/60">({aggCvr2.toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-5 text-right text-xs font-mono">
                    ¥{aggregates.revenue.toFixed(0)} <span className="text-blue-400 font-black">({aggRoasVal.toFixed(1)}x)</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <p className="flex items-center gap-1.5"><Activity size={12} /> 数据每 15 分钟自动从媒体 API 同步一次</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> KPI 达标</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> AI 建议扩量</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 策略观察中</span>
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

export default App;
