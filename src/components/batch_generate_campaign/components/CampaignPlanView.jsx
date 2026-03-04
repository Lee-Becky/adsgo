import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check, LayoutGrid, Facebook, Search, X, Loader2, Send, ChevronUp, MessageSquare, RefreshCw } from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';

const AUDIENCE_SHORT_LABELS = {
  LAL: 'LAL',
  INT: 'INT',
  ADV: 'Adv+'
};

// ~30 mock interests for fuzzy search
const MOCK_ALL_INTERESTS = [
  { id: 'int_1', name: 'Online shopping', size: '900M-1B' },
  { id: 'int_2', name: 'Fashion accessories', size: '500M-600M' },
  { id: 'int_3', name: 'Luxury goods', size: '200M-300M' },
  { id: 'int_4', name: 'E-commerce', size: '800M-900M' },
  { id: 'int_5', name: 'Beauty', size: '700M-800M' },
  { id: 'int_6', name: 'Fitness', size: '600M-700M' },
  { id: 'int_7', name: 'Travel', size: '700M-800M' },
  { id: 'int_8', name: 'Sustainable fashion', size: '150M-200M' },
  { id: 'int_9', name: 'Home decor', size: '400M-500M' },
  { id: 'int_10', name: 'Technology', size: '1B-1.2B' },
  { id: 'int_11', name: 'Wellness', size: '350M-400M' },
  { id: 'int_12', name: 'Lifestyle', size: '600M-700M' },
  { id: 'int_13', name: 'Skincare', size: '300M-400M' },
  { id: 'int_14', name: 'Yoga', size: '250M-300M' },
  { id: 'int_15', name: 'Outdoor activities', size: '400M-500M' },
  { id: 'int_16', name: 'Photography', size: '300M-400M' },
  { id: 'int_17', name: 'Gaming', size: '800M-1B' },
  { id: 'int_18', name: 'Cooking', size: '500M-600M' },
  { id: 'int_19', name: 'Pet lovers', size: '350M-450M' },
  { id: 'int_20', name: 'Music', size: '700M-900M' },
  { id: 'int_21', name: 'Reading', size: '250M-350M' },
  { id: 'int_22', name: 'DIY crafts', size: '200M-300M' },
  { id: 'int_23', name: 'Parenting', size: '300M-400M' },
  { id: 'int_24', name: 'Streetwear', size: '150M-200M' },
  { id: 'int_25', name: 'Vintage clothing', size: '100M-150M' },
  { id: 'int_26', name: 'Jewelry', size: '250M-350M' },
  { id: 'int_27', name: 'Sports', size: '600M-800M' },
  { id: 'int_28', name: 'Automotive', size: '400M-500M' },
  { id: 'int_29', name: 'Coffee culture', size: '200M-300M' },
  { id: 'int_30', name: 'Minimalism', size: '100M-150M' },
];

// Mock AI strategy parser
function mockParseStrategy(input) {
  const result = { strategy: 'PER_PRODUCT', numAdsetsPerProduct: 1, audienceAssignment: null };
  if (/混合|all\s*products/i.test(input)) result.strategy = 'ALL_PRODUCTS_PER_SET';
  if (/智能拆|split|smart/i.test(input)) result.strategy = 'BY_AD_COUNT';
  const numMatch = input.match(/(\d+)\s*组/);
  if (numMatch) result.numAdsetsPerProduct = Math.min(parseInt(numMatch[1]), 10);
  if (/LAL/i.test(input) && /INT|兴趣/i.test(input)) {
    result.audienceAssignment = 'MIXED';
  } else if (/全部.*INT|全.*兴趣|all.*INT/i.test(input)) {
    result.audienceAssignment = 'ALL_INT';
  } else if (/全部.*LAL|全.*LAL|all.*LAL/i.test(input)) {
    result.audienceAssignment = 'ALL_LAL';
  }
  return result;
}

// INT Interest Dual-Panel Component
const IntInterestSelector = ({ intOptions, onIntOptionsChange, productAnalyses, allAnalysesComplete, selectedProducts }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef(null);

  // Compute initial AI recommended interests (for "restore" button)
  const aiRecommendedInterests = useMemo(() => {
    const names = new Set();
    if (productAnalyses) {
      Object.values(productAnalyses).forEach(pa => {
        if (pa.recommendedInterests) {
          pa.recommendedInterests.forEach(name => names.add(name));
        }
      });
    }
    return [...names].map(name => {
      const found = MOCK_ALL_INTERESTS.find(i => i.name === name);
      return found ? { ...found, source: 'ai' } : { id: `ai_${name}`, name, source: 'ai', size: '100M-200M' };
    });
  }, [productAnalyses]);

  // Auto-append AI recommended interests once ALL analyses complete
  const lastAppendedRef = useRef(new Set());
  useEffect(() => {
    if (!productAnalyses || !allAnalysesComplete) {
      lastAppendedRef.current = new Set();
      return;
    }
    Object.entries(productAnalyses).forEach(([pid, pa]) => {
      if (pa.status === 'complete' && !lastAppendedRef.current.has(pid)) {
        lastAppendedRef.current.add(pid);
        if (pa.recommendedInterests) {
          const existingNames = new Set(intOptions.map(o => o.name));
          const newInterests = pa.recommendedInterests
            .filter(name => !existingNames.has(name))
            .map(name => {
              const found = MOCK_ALL_INTERESTS.find(i => i.name === name);
              return found ? { ...found, source: 'ai' } : { id: `ai_${name}`, name, source: 'ai', size: '100M-200M' };
            });
          if (newInterests.length > 0) {
            onIntOptionsChange([...intOptions, ...newInterests]);
          }
        }
      }
    });
  }, [productAnalyses, allAnalysesComplete]);

  const analyzingCount = productAnalyses ? Object.values(productAnalyses).filter(p => p.status === 'analyzing').length : 0;
  const totalCount = selectedProducts?.length || 0;
  const completeCount = totalCount - analyzingCount;

  const filteredInterests = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOCK_ALL_INTERESTS.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const isSelected = (interest) => intOptions.some(o => o.name === interest.name);

  const toggleInterest = (interest) => {
    if (isSelected(interest)) {
      onIntOptionsChange(intOptions.filter(o => o.name !== interest.name));
    } else {
      onIntOptionsChange([...intOptions, { ...interest, source: 'manual' }]);
    }
  };

  const removeInterest = (interest) => {
    onIntOptionsChange(intOptions.filter(o => o.name !== interest.name));
  };

  const restoreAiRecommended = () => {
    onIntOptionsChange(aiRecommendedInterests);
  };

  return (
    <div className="w-full mt-4 pt-4 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
      <div className="relative" ref={panelRef}>
        <label className="text-[9px] font-black text-slate-400 tracking-widest px-1 mb-2 block flex items-center gap-1.5 uppercase">
          <Target size={10} className="text-amber-500" />
          INT 兴趣定向
        </label>
        {/* Trigger button */}
        <div
          onClick={() => setShowPanel(!showPanel)}
          className="w-full p-4 bg-white border-2 border-amber-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[90%]">
            {intOptions.length === 0 ? (
              <span className="text-xs font-bold text-slate-300">点击选择兴趣词定向...</span>
            ) : (
              <>
                {intOptions.slice(0, 4).map(opt => (
                  <span key={opt.name} className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black tracking-tighter border border-amber-100">
                    {opt.name}
                  </span>
                ))}
                {intOptions.length > 4 && (
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black">
                    +{intOptions.length - 4}
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown size={14} className={`text-amber-300 transition-transform ${showPanel ? 'rotate-180' : ''}`} />
        </div>

        {/* Dual-panel dropdown */}
        {showPanel && (
          <>
            <div className="fixed inset-0 z-[190]" onClick={() => setShowPanel(false)} />
            <div
              className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
              style={{ zIndex: 200 }}
            >
              {/* Top bar: restore button + AI status */}
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <button
                  onClick={restoreAiRecommended}
                  className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  <RefreshCw size={11} /> 恢复至初始化AI推荐
                </button>
                {analyzingCount > 0 && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500">
                    <Loader2 size={11} className="animate-spin" /> AI 推荐中... ({completeCount}/{totalCount})
                  </span>
                )}
              </div>

              <div className="flex" style={{ height: '340px' }}>
                {/* Left: Search & List */}
                <div className="w-1/2 border-r border-slate-50 flex flex-col">
                  <div className="p-4 border-b border-slate-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
                      <input
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/10 outline-none"
                        placeholder="搜索兴趣词..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {!searchQuery.trim() ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-slate-300 font-bold">请输入关键词查询</p>
                      </div>
                    ) : filteredInterests.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-slate-300 font-bold">未找到匹配的兴趣词</p>
                      </div>
                    ) : (
                      filteredInterests.map(interest => {
                        const sel = isSelected(interest);
                        return (
                          <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                              sel ? 'bg-amber-50 text-amber-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <span>{interest.name}</span>
                              <span className="ml-2 text-[10px] text-slate-400">{interest.size}</span>
                            </div>
                            {sel && <Check size={12} />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                {/* Right: Selected */}
                <div className="w-1/2 bg-slate-50/30 flex flex-col">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest">Selected ({intOptions.length})</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-wrap gap-2 content-start">
                    {intOptions.map(opt => (
                      <div key={opt.name} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-amber-100 rounded-lg shadow-sm animate-in zoom-in">
                        <span className="text-[10px] font-black text-slate-700">{opt.name}</span>
                        <button onClick={() => removeInterest(opt)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <X size={10} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    {intOptions.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-xs text-slate-300 font-bold text-center">尚未选择兴趣词</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Collapsible think block for history messages
const CollapsibleThink = ({ thinkLines }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 bg-slate-50 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-indigo-400" />
          <span className="text-[10px] font-black text-slate-400 tracking-widest">&lt;think&gt;</span>
        </div>
        {collapsed ? <ChevronDown size={12} className="text-slate-300" /> : <ChevronUp size={12} className="text-slate-300" />}
      </div>
      {!collapsed && (
        <div className="px-3 py-2 space-y-1 border-t border-slate-100">
          {thinkLines.map((line, i) => (
            <p key={i} className="text-[11px] text-slate-500 font-medium">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// AI Strategy Dialog Component
const AiStrategyDialog = ({ onApplyStrategy, onApplied }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkLines, setThinkLines] = useState([]);
  const [thinkCollapsed, setThinkCollapsed] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, thinkLines, pendingResult]);

  const handleSend = () => {
    if (!inputValue.trim() || isThinking) return;
    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsThinking(true);
    setThinkLines([]);
    setThinkCollapsed(false);
    setPendingResult(null);

    // Mock think streaming
    const parsed = mockParseStrategy(userMsg);
    const thinkSteps = [
      '正在分析广告结构意图...',
      `识别到: ${parsed.strategy === 'PER_PRODUCT' ? '每款产品独立投放' : parsed.strategy === 'ALL_PRODUCTS_PER_SET' ? '所有产品混合投放' : '按素材数量智能拆组'}，每产品 ${parsed.numAdsetsPerProduct} 组 Adset`,
      `受众分配: ${parsed.audienceAssignment === 'MIXED' ? '混合模式 (LAL + INT)' : parsed.audienceAssignment === 'ALL_INT' ? '全部 INT' : parsed.audienceAssignment === 'ALL_LAL' ? '全部 LAL' : '默认 Adv+'}`,
      '解析完成 ✓'
    ];

    let stepIdx = 0;
    const thinkInterval = setInterval(() => {
      if (stepIdx < thinkSteps.length) {
        setThinkLines(prev => [...prev, thinkSteps[stepIdx]]);
        stepIdx++;
      } else {
        clearInterval(thinkInterval);
        setIsThinking(false);
        setPendingResult(parsed);
      }
    }, 500);
  };

  const handleApply = () => {
    if (!pendingResult) return;
    onApplyStrategy(pendingResult);
    setMessages(prev => [...prev, {
      role: 'ai_result',
      thinkLines: [...thinkLines],
      result: { ...pendingResult },
      appliedText: `已应用: ${strategyLabel(pendingResult.strategy)} / ${pendingResult.numAdsetsPerProduct} 组 Adset / ${audienceLabel(pendingResult.audienceAssignment)}`
    }]);
    setPendingResult(null);
    setThinkLines([]);
    if (onApplied) onApplied();
  };

  const strategyLabel = (s) => {
    if (s === 'PER_PRODUCT') return '每款产品多组 (PER_PRODUCT)';
    if (s === 'ALL_PRODUCTS_PER_SET') return '混合组包含全品 (ALL_PRODUCTS_PER_SET)';
    if (s === 'BY_AD_COUNT') return '总素材智能拆组 (BY_AD_COUNT)';
    return s;
  };

  const audienceLabel = (a) => {
    if (a === 'MIXED') return '混合模式 (前N-1组 LAL / 最后1组 INT)';
    if (a === 'ALL_INT') return '全部 INT';
    if (a === 'ALL_LAL') return '全部 LAL';
    return '默认 Adv+';
  };

  return (
    <div className="animate-in slide-in-from-top-2 duration-200 mt-4">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
        {/* Chat area */}
        <div ref={chatContainerRef} className="max-h-[360px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.length === 0 && !isThinking && (
            <div className="text-center py-8">
              <MessageSquare size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-bold">请在下方输入框描述你想要的广告结构策略，AI 将为你生成个性化广告结构策略方案</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-xs font-bold">
                  {msg.content}
                </div>
              ) : msg.role === 'ai_result' ? (
                <div className="w-full space-y-2">
                  <CollapsibleThink thinkLines={msg.thinkLines} />
                  <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-black text-emerald-700">已应用方案</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-600 font-bold pl-2 border-l-2 border-emerald-100">
                      <p>• 架构策略: {strategyLabel(msg.result.strategy)}</p>
                      <p>• 每产品 Adset 数: {msg.result.numAdsetsPerProduct}</p>
                      <p>• 受众分配: {audienceLabel(msg.result.audienceAssignment)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%] bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-md text-xs font-bold text-slate-500">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Think block */}
          {thinkLines.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2 bg-slate-50 cursor-pointer"
                onClick={() => setThinkCollapsed(!thinkCollapsed)}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-400 tracking-widest">&lt;think&gt;</span>
                </div>
                {thinkCollapsed ? <ChevronDown size={12} className="text-slate-300" /> : <ChevronUp size={12} className="text-slate-300" />}
              </div>
              {!thinkCollapsed && (
                <div className="px-3 py-2 space-y-1 border-t border-slate-100">
                  {thinkLines.map((line, i) => (
                    <p key={i} className="text-[11px] text-slate-500 font-medium animate-in fade-in slide-in-from-left-2">
                      {line}
                    </p>
                  ))}
                  {isThinking && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Loader2 size={10} className="animate-spin text-indigo-400" />
                      <span className="text-[10px] text-indigo-400 font-bold">思考中...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Result card */}
          {pendingResult && (
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-indigo-500" />
                <span className="text-xs font-black text-slate-800">广告结构方案</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600 font-bold pl-2 border-l-2 border-indigo-100">
                <p>• 架构策略: {strategyLabel(pendingResult.strategy)}</p>
                <p>• 每产品 Adset 数: {pendingResult.numAdsetsPerProduct}</p>
                <p>• 受众分配: {audienceLabel(pendingResult.audienceAssignment)}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Check size={12} /> 确认应用
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 p-3 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='例：每个产品创建3组adset，第1组和第2组用LAL受众，第3组用兴趣词受众'
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/10"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inputValue.trim() && !isThinking
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignPlanView = ({
  structure,
  onStructureChange,
  campaignType,
  budgetType,
  onBudgetTypeChange,
  dailyBudget,
  onBudgetChange,
  adsetAudiences,
  onToggleAudience,
  lalOptions,
  onToggleLalOption,
  intOptions,
  onToggleIntOption,
  onIntOptionsChange,
  selectedProducts,
  productCreativesMap,
  isExistingCampaign,
  selectedCampaign,
  onSelectCampaign,
  selectedAccount,
  onSelectAccount,
  authStatus,
  handleAuthorize,
  productAnalyses,
  allAnalysesComplete,
  onApplyAiStrategy
}) => {
  const [showLalDropdown, setShowLalDropdown] = useState(false);
  const [showNumAdsetsDropdown, setShowNumAdsetsDropdown] = useState(false);
  const [aiStrategyApplied, setAiStrategyApplied] = useState(false);

  // Reset aiStrategyApplied when switching away from AI_STRATEGY
  useEffect(() => {
    if (structure.strategy !== 'AI_STRATEGY') {
      setAiStrategyApplied(false);
    }
  }, [structure.strategy]);

  const getAdSetGroups = () => {
    let groups = [];

    if (structure.strategy === 'PER_PRODUCT' || structure.strategy === 'AI_STRATEGY') {
      const effectiveStrategy = structure.strategy === 'AI_STRATEGY' ? (structure._aiResolvedStrategy || 'PER_PRODUCT') : structure.strategy;

      if (effectiveStrategy === 'PER_PRODUCT') {
        selectedProducts.forEach(p => {
          const ads = productCreativesMap[p.id] || [];
          if (ads.length > 0) {
            const count = structure.numAdsetsPerProduct || 1;
            for (let i = 0; i < count; i++) {
              groups.push({
                name: count > 1 ? `${p.name} - 组 ${i + 1}` : p.name,
                ads
              });
            }
          }
        });
      } else if (effectiveStrategy === 'ALL_PRODUCTS_PER_SET') {
        const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
        const numAdsets = structure.numAdsets || 1;
        for (let i = 0; i < numAdsets; i++) {
          groups.push({
            name: `混合组 ${i + 1}`,
            ads: allAds
          });
        }
      } else if (effectiveStrategy === 'BY_AD_COUNT') {
        const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
        if (allAds.length > 0) {
          const numGroups = structure.adsPerSet || 1;
          let currentIndex = 0;
          for (let i = 0; i < numGroups; i++) {
            const remainingAds = allAds.length - currentIndex;
            const remainingGroups = numGroups - i;
            const currentGroupSize = Math.ceil(remainingAds / remainingGroups);
            groups.push({ name: `智能分组 ${i + 1}`, ads: allAds.slice(currentIndex, currentIndex + currentGroupSize) });
            currentIndex += currentGroupSize;
          }
        }
      }
    } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      const numAdsets = structure.numAdsets || 1;
      for (let i = 0; i < numAdsets; i++) {
        groups.push({
          name: campaignType === 'CATALOG' ? `DPA-${i + 1}` : `混合组 ${i + 1}`,
          ads: allAds
        });
      }
    } else if (structure.strategy === 'BY_AD_COUNT') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      if (allAds.length > 0) {
        const numGroups = structure.adsPerSet || 1;

        let currentIndex = 0;
        for (let i = 0; i < numGroups; i++) {
          const remainingAds = allAds.length - currentIndex;
          const remainingGroups = numGroups - i;
          const currentGroupSize = Math.ceil(remainingAds / remainingGroups);

          groups.push({
            name: `智能分组 ${i + 1}`,
            ads: allAds.slice(currentIndex, currentIndex + currentGroupSize)
          });
          currentIndex += currentGroupSize;
        }
      }
    }
    return groups;
  };

  const adSetGroups = getAdSetGroups();
  const estimatedTotalDaily = budgetType === 'ABO'
    ? dailyBudget * adSetGroups.length
    : dailyBudget;

  const hasLalAudience = adsetAudiences.slice(0, adSetGroups.length).some(a => a === 'LAL');
  const hasIntAudience = adsetAudiences.slice(0, adSetGroups.length).some(a => a === 'INT');

  const allAdsCount = selectedProducts.flatMap(p => productCreativesMap[p.id] || []).length;

  const handleApplyAiStrategyLocal = (parsed) => {
    // Apply strategy to structure
    const newStructure = {
      ...structure,
      strategy: 'AI_STRATEGY',
      _aiResolvedStrategy: parsed.strategy,
      numAdsetsPerProduct: parsed.numAdsetsPerProduct
    };
    if (parsed.strategy === 'ALL_PRODUCTS_PER_SET') {
      newStructure.numAdsets = parsed.numAdsetsPerProduct;
    }
    if (parsed.strategy === 'BY_AD_COUNT') {
      newStructure.adsPerSet = parsed.numAdsetsPerProduct;
    }
    onStructureChange(newStructure);

    // Apply audience assignment
    if (parsed.audienceAssignment && onApplyAiStrategy) {
      onApplyAiStrategy(parsed);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <h4 className="text-[11px] font-black text-slate-400 tracking-widest">Campaign 架构策略</h4>
          <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center cursor-help shadow-sm">
            <Info size={12} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest px-1">选择发布逻辑</label>
            <div className={`grid ${campaignType === 'CATALOG' ? 'grid-cols-1' : 'grid-cols-4'} gap-3`}>
              {(campaignType === 'CATALOG'
                ? [{ id: 'ALL_PRODUCTS_PER_SET', label: '每组均投放已选目录', desc: 'Each group uses selected catalog' }]
                : [
                    { id: 'PER_PRODUCT', label: '每款产品多组', desc: 'Multiple Adsets per SKU' },
                    { id: 'ALL_PRODUCTS_PER_SET', label: '混合组包含全品', desc: 'All SKU in every Adset' },
                    { id: 'BY_AD_COUNT', label: '总素材智能拆组', desc: 'Intelligently split all ads' },
                    { id: 'AI_STRATEGY', label: 'AI个性化策略', desc: 'Describe your ad structure' },
                  ]
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onStructureChange({ ...structure, strategy: opt.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    (structure.strategy === opt.id || campaignType === 'CATALOG')
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/10'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <p className={`text-[11px] font-black ${(structure.strategy === opt.id || campaignType === 'CATALOG') ? 'text-indigo-600' : 'text-slate-800'}`}>{opt.label}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Strategy Dialog */}
          {structure.strategy === 'AI_STRATEGY' && campaignType !== 'CATALOG' && (
            aiStrategyApplied ? (
              <div className="animate-in fade-in duration-200 mt-2">
                <button
                  onClick={() => {
                    setAiStrategyApplied(false);
                    onStructureChange({ ...structure, _aiResolvedStrategy: undefined });
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full text-xs font-black hover:bg-indigo-100 transition-all"
                >
                  <RefreshCw size={14} /> 重新生成策略
                </button>
              </div>
            ) : (
              <AiStrategyDialog
                onApplyStrategy={handleApplyAiStrategyLocal}
                onApplied={() => setAiStrategyApplied(true)}
              />
            )
          )}

          {/* Adset count selector (for non-AI strategies) */}
          {structure.strategy !== 'AI_STRATEGY' && (structure.strategy === 'PER_PRODUCT' || structure.strategy === 'ALL_PRODUCTS_PER_SET' || structure.strategy === 'BY_AD_COUNT') && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <label className="text-[10px] font-bold text-slate-400 tracking-widest px-1 mb-2 block">
                 {structure.strategy === 'PER_PRODUCT' ? '每款产品对应的 Adset 组数 (1-10)' : `Adset 组数 (1-${structure.strategy === 'BY_AD_COUNT' ? allAdsCount : 10})`}
               </label>
               <div className="relative max-w-[240px]">
                  <div
                    onClick={() => setShowNumAdsetsDropdown(!showNumAdsetsDropdown)}
                    className="w-full h-12 bg-white border-2 border-indigo-50 rounded-2xl px-5 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={16} className="text-indigo-500" />
                      <span className="text-sm font-black text-slate-700">
                        {structure.strategy === 'PER_PRODUCT' ? (structure.numAdsetsPerProduct || 1) : (structure.strategy === 'BY_AD_COUNT' ? (structure.adsPerSet || 1) : (structure.numAdsets || 1))} 组
                      </span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${showNumAdsetsDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {showNumAdsetsDropdown && (
                    <>
                      <div className="fixed inset-0 z-[190]" onClick={() => setShowNumAdsetsDropdown(false)} />
                      <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-indigo-50 rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 py-2"
                        style={{ zIndex: 200 }}
                      >
                        {Array.from({ length: structure.strategy === 'BY_AD_COUNT' ? allAdsCount : 10 }, (_, i) => i + 1).map((n) => {
                          const isSel = structure.strategy === 'PER_PRODUCT'
                            ? (structure.numAdsetsPerProduct || 1) === n
                            : (structure.strategy === 'BY_AD_COUNT' ? (structure.adsPerSet || 1) === n : (structure.numAdsets || 1) === n);
                          return (
                            <div
                              key={n}
                              onClick={() => {
                                let field = 'numAdsets';
                                if (structure.strategy === 'PER_PRODUCT') field = 'numAdsetsPerProduct';
                                else if (structure.strategy === 'BY_AD_COUNT') field = 'adsPerSet';

                                onStructureChange({
                                  ...structure,
                                  [field]: n
                                });
                                setShowNumAdsetsDropdown(false);
                              }}
                              className={`flex items-center justify-between px-5 py-3 hover:bg-indigo-50 cursor-pointer transition-colors group ${isSel ? 'bg-indigo-50/50' : ''}`}
                            >
                              <span className={`text-xs font-black ${isSel ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'}`}>{n} 组 Adsets</span>
                              {isSel && <Check size={14} className="text-indigo-600" />}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
               </div>
            </div>
          )}

          {(structure.strategy !== 'AI_STRATEGY' || aiStrategyApplied) && (
          <div className="bg-slate-50/50 rounded-[2rem] p-8 mt-6">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-10 relative">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl z-10 border-4 border-white">
                  <Briefcase size={28} />
                </div>
                <div className="absolute -bottom-6 flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 tracking-widest">Target Campaign</span>
                  <div className="w-[1px] h-6 bg-slate-200 mt-1"></div>
                </div>
              </div>

              <div className={`w-full flex ${adSetGroups.length > 4 ? 'justify-start' : 'justify-center'} gap-10 overflow-x-auto pb-4 no-scrollbar px-4`}>
                {adSetGroups.map((group, idx) => {
                  const audienceType = adsetAudiences[idx % adsetAudiences.length] || 'ADV';
                  return (
                    <div key={idx} className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => onToggleAudience(idx)}
                        className={`w-10 h-10 rounded-xl border shadow-sm flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 mb-2 relative group ${
                          audienceType === 'LAL' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          audienceType === 'INT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}
                        title="点击切换受众策略 (Adv+ / LAL / INT)"
                      >
                        <Users size={18} />
                        <span className="text-[7px] font-black mt-0.5">{AUDIENCE_SHORT_LABELS[audienceType]}</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">
                          {idx + 1}
                        </div>
                      </button>

                      <p className="text-[8px] font-black text-slate-400 truncate max-w-[80px] text-center mb-3">{group.name}</p>

                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                        {campaignType === 'CATALOG' ? (
                          <div className="w-16 h-20 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/30 flex flex-col items-center justify-center p-2 relative overflow-hidden group/catalog">
                            <div className="grid grid-cols-2 gap-1 opacity-40 group-hover/catalog:opacity-60 transition-opacity">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-4 h-4 rounded-sm bg-indigo-200" />
                              ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LayoutGrid size={24} className="text-indigo-400" />
                            </div>
                            <div className="absolute bottom-1 w-full flex justify-center">
                              <span className="text-[6px] font-black text-indigo-400 uppercase tracking-tighter">Dynamic Feed</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {group.ads.slice(0, 4).map((ad, adIdx) => (
                              <div key={adIdx} className="w-8 h-10 rounded-md border border-white shadow-sm overflow-hidden bg-white ring-1 ring-slate-100">
                                <img src={ad.url} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {group.ads.length > 4 && (
                              <div className="w-8 h-10 rounded-md border border-white shadow-sm flex items-center justify-center bg-slate-50 text-[8px] font-black text-slate-400">
                                +{group.ads.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasLalAudience && (
                <div className="w-full mt-8 pt-6 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest px-1 mb-2 block flex items-center gap-1.5">
                      <Sparkles size={10} className="text-purple-500" />
                      LAL 包含受众选项 (多选)
                    </label>
                    <div
                      onClick={() => setShowLalDropdown(!showLalDropdown)}
                      className="w-full p-4 bg-white border-2 border-purple-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
                    >
                      <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[90%]">
                        {(!selectedAccount || lalOptions.length === 0) ? (
                          <span className="text-xs font-bold text-slate-300">请选择 LAL 受众源...</span>
                        ) : (
                          lalOptions.map(opt => (
                            <span key={opt} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black tracking-tighter border border-purple-100">
                              {opt.split(' ')[1] || opt}
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown size={14} className={`text-purple-300 transition-transform ${showLalDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showLalDropdown && (
                      <>
                        <div className="fixed inset-0 z-[190]" onClick={() => setShowLalDropdown(false)} />
                        <div
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
                          style={{ zIndex: 200 }}
                        >
                          {!authStatus?.meta ? (
                            <div className="p-4">
                              <button
                                onClick={() => { handleAuthorize('meta'); setShowLalDropdown(false); }}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                <Facebook size={14} /> 立即连接 Meta
                              </button>
                            </div>
                          ) : !selectedAccount ? (
                            <div className="p-4">
                              <button
                                onClick={() => { onSelectAccount(); setShowLalDropdown(false); }}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                <Briefcase size={14} /> 选择广告账户
                              </button>
                            </div>
                          ) : (
                            ['US Purchase 1%', 'US add to cart 5%', 'US register last30days 1%~3%'].map((opt) => {
                              const isSel = lalOptions.includes(opt);
                              return (
                                <div
                                  key={opt}
                                  onClick={() => onToggleLalOption(opt)}
                                  className="flex items-center justify-between px-5 py-3 hover:bg-purple-50 cursor-pointer transition-colors"
                                >
                                  <span className={`text-[11px] font-bold ${isSel ? 'text-purple-700' : 'text-slate-600'}`}>{opt}</span>
                                  {isSel && <Check size={14} className="text-purple-600" />}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {hasIntAudience && (
                <IntInterestSelector
                  intOptions={intOptions}
                  onIntOptionsChange={onIntOptionsChange}
                  productAnalyses={productAnalyses}
                  allAnalysesComplete={allAnalysesComplete}
                  selectedProducts={selectedProducts}
                />
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 tracking-widest px-2">预算配置与预估消耗</h4>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">目标投放系列 (Campaign)</label>
              <button
                onClick={onSelectCampaign}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Edit3 size={12} />
                <span className="text-[10px] font-black">选择已有</span>
              </button>
            </div>
            <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${isExistingCampaign ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExistingCampaign ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 shadow-sm'}`}>
                <Briefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {selectedCampaign?.name || '创建全新系列 (Create New)'}
                </p>
                {isExistingCampaign && <p className="text-[9px] text-indigo-400 font-bold mt-0.5">ID: {selectedCampaign.id}</p>}
              </div>
              {isExistingCampaign && <Lock size={14} className="text-indigo-300 shrink-0" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-slate-800">投放预算模式</p>
              {isExistingCampaign && <Lock size={12} className="text-slate-300" />}
            </div>
            <div className={`flex p-1 bg-slate-100/80 rounded-xl border border-slate-100 ${isExistingCampaign ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
              <button
                onClick={() => onBudgetTypeChange('CBO')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${budgetType === 'CBO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                CBO (均衡)
              </button>
              <button
                onClick={() => onBudgetTypeChange('ABO')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${budgetType === 'ABO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                ABO (单组)
              </button>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
            <div className="flex items-center w-full">
              <DollarSign className="text-slate-300 absolute left-8 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={32} />
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-full bg-transparent border-none outline-none pl-16 pr-4 text-4xl font-black text-slate-800"
              />
              <span className="text-[10px] font-black text-slate-400 mr-4">
                {budgetType === 'ABO' ? 'Per AdSet' : 'Total Campaign'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-indigo-400" />
                <p className="text-[10px] font-black opacity-60 tracking-widest">预估日均消耗</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-white">${estimatedTotalDaily}</p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-1 tracking-widest">
                    {budgetType === 'ABO' ? `${dailyBudget} * ${adSetGroups.length} Adsets` : '系列全局消耗'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Layers size={14} className="text-indigo-400" />
                    <p className="text-xl font-black text-white">{adSetGroups.length}</p>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold tracking-widest">AdSets 数量</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlanView;
