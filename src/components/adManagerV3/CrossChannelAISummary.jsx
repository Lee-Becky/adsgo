import React, { useState } from 'react';
import { 
  Sparkles, Zap, Cpu, BrainCircuit, ShieldCheck, AlertTriangle, Bot, Edit2, Target
} from 'lucide-react';

// Platform icon URLs
const META_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256';
const GOOGLE_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256';

const CrossChannelAISummary = ({ 
  totalSpend = 125000, 
  totalEvent1s = 3200, 
  avgCpaEvent1 = 39.06, 
  avgRoas = 3.8,
  onRuleLibraryClick,
  autoApply,
  onAutoApplyToggle,
  goals = [],
  onEditBrandConfig
}) => {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

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
  const gainInsights = [
    { title: 'Key Highlights', content: 'US Meta CPA decreased by 12%', dotColor: 'bg-green-600' },
    { title: 'Key Highlights', content: 'TikTok conversion rate increased by 8.5%', dotColor: 'bg-green-600' },
    { title: 'Key Highlights', content: 'Google brand search share +15%', dotColor: 'bg-green-600' },
  ];

  const riskInsights = [
    { title: 'Potential Risks', content: 'IN Google CPM surged by 25%', dotColor: 'bg-amber-600' },
    { title: 'Potential Risks', content: 'Meta ad creative fatigue warning (Creative Set A)', dotColor: 'bg-amber-600' },
    { title: 'Potential Risks', content: 'TikTok audience overlap too high', dotColor: 'bg-amber-600' },
  ];

  const optimizationGoals = goals.filter(g => g.type === 'Optimization') || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
      
      {/* Left Column: AI Summary (2/3 Width) */}
      <div className="lg:col-span-2 bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-sm flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-purple-100 pb-1.5 mb-2 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <h3 className="text-base font-black text-slate-800 tracking-wide">Cross-Channel Today's Overview</h3>
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
                    <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">Meta Accounts</div>
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
                    <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">Google Accounts</div>
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
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={onRuleLibraryClick}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full transition-all shadow-sm border bg-white border-purple-100 text-purple-600 hover:bg-purple-50"
            >
              <Zap size={10} />
              <span className="text-[9px] font-black uppercase tracking-tight">Rule Library</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3 shrink-0 py-1 bg-slate-50/50 rounded-lg px-3">
          <div className="flex flex-col">
            <p className="text-xs font-black text-slate-400 tracking-wide">Spend</p>
            <p className="text-base font-black text-slate-900 leading-none">¥{totalSpend.toFixed(0)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-slate-400 tracking-wide">Event1s</p>
            <p className="text-base font-black text-blue-600 leading-none">{totalEvent1s}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-slate-400 tracking-wide">CPA (Event1)</p>
            <p className="text-base font-black text-slate-800 leading-none">¥{avgCpaEvent1.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-slate-400 tracking-wide">ROAS</p>
            <p className="text-base font-black text-slate-800 leading-none">{avgRoas.toFixed(2)}x</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 flex-grow overflow-hidden">
            <div className="col-span-3 flex flex-col border-r border-slate-100 pr-4 overflow-hidden h-full">
              <div className="flex items-center justify-between gap-1.5 mb-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Cpu size={12} className="text-blue-500" />
                  <span className="text-xs font-black text-blue-600 tracking-wide">Deep AI Analysis Insights</span>
                </div>
                <span className="text-[8px] text-gray-400">Updated: January 4, 2026, 13:24:56</span>
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
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col overflow-hidden relative group">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <BrainCircuit size={12} className="text-blue-600" />
                  <h2 className="text-xs font-black tracking-wide text-blue-700">Optimize Goal</h2>
                </div>
                <button 
                  onClick={onEditBrandConfig}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors group/icon"
                  title="Edit Optimize Goal"
                >
                  <Edit2 size={12} className="text-slate-400 group-hover/icon:text-blue-600 transition-colors" />
                </button>
              </div>
              
              <div className="flex-grow flex flex-col justify-center space-y-2">
                {optimizationGoals.length > 0 && (
                  <div className="bg-purple-50 border border-purple-100 rounded-lg px-2 py-1.5 flex items-center justify-between border-l-4 border-l-purple-600 shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        <Target size={14} className="text-purple-600" />
                      </div>
                      <p className="text-[10px] font-bold text-purple-800 truncate">
                        DailyBudget$500, Purchase, ROAS>5
                      </p>
                    </div>
                    <Sparkles size={10} className="text-purple-400 shrink-0 ml-1" />
                  </div>
                )}
              </div>
            </div>

            <div 
              className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between group/switch cursor-pointer transition-all hover:border-blue-200"
              onClick={onAutoApplyToggle}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img 
                    src="https://www.adsgo.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frobot-active.7003b4d8.png&w=256&q=75" 
                    alt="AI Robot" 
                    width="24" 
                    height="24"
                    className="inline-block"
                  />
                  <Sparkles size={8} className="absolute -top-0.5 -right-0.5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-800 tracking-tight">Auto-apply Recommendations</span>
                  {autoApply && (
                    <span className="text-[8px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 mt-0.5">
                      ✓ Enabled - Recommended budget will be applied automatically.
                    </span>
                  )}
                </div>
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
            <span className="text-base font-black text-green-700 tracking-wide">Key Highlights</span>
          </div>
          <div className="flex-grow flex flex-col justify-center space-y-3">
            {gainInsights.map((insight, index) => (
              <div key={`gain-${index}`} className="flex items-start gap-2">
                <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${insight.dotColor}`} />
                <p className="text-sm text-green-700 font-bold leading-snug">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-amber-50/50 border border-amber-100 rounded-2xl p-4 overflow-hidden group shadow-sm">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <span className="text-base font-black text-amber-700 tracking-wide">Potential Risks</span>
          </div>
          <div className="flex-grow flex flex-col justify-center space-y-3">
            {riskInsights.map((insight, index) => (
              <div key={`risk-${index}`} className="flex items-start gap-2">
                <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${insight.dotColor}`} />
                <p className="text-sm text-amber-700 font-bold leading-snug">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChannelAISummary;
