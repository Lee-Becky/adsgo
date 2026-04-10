import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check, LayoutGrid, Facebook, Search, X, Loader2, Send, ChevronUp, MessageSquare, RefreshCw, Plus, Link } from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';
import useDropdownLoading from '../../../hooks/useDropdownLoading';

const MOCK_CUSTOM_AUDIENCES = [
  'VIP Members',
  'Email List Upload',
  'Website Visitors 180d',
  'App Users',
];

const MOCK_SAVED_AUDIENCES = [
  { id: 'sa1', name: 'High Value Customers',   ageMin: 25, ageMax: 55, gender: 'All',   interests: ['Shopping', 'Luxury Brands', 'Online Shopping'] },
  { id: 'sa2', name: 'Young Female Shoppers',  ageMin: 18, ageMax: 35, gender: 'Women', interests: ['Fashion', 'Beauty', 'Lifestyle'] },
  { id: 'sa3', name: 'Male Sports Fans',        ageMin: 20, ageMax: 45, gender: 'Men',   interests: ['Sports', 'Fitness', 'Outdoor Activities'] },
];

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
  if (/智能拆|split|smart/i.test(input)) result.strategy = 'BY_CREATIVE';
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

// AI Interest Packs - 5 audience persona packs
const AI_INTEREST_PACKS = [
  { id: 'pack-1', name: 'Fashion Enthusiasts', interests: ['Fashion accessories', 'Luxury goods', 'Streetwear', 'Vintage clothing', 'Jewelry'] },
  { id: 'pack-2', name: 'Digital Shoppers', interests: ['Online shopping', 'E-commerce', 'Technology', 'Gaming', 'Photography'] },
  { id: 'pack-3', name: 'Health & Wellness', interests: ['Fitness', 'Wellness', 'Yoga', 'Skincare', 'Outdoor activities'] },
  { id: 'pack-4', name: 'Lifestyle & Home', interests: ['Home decor', 'Cooking', 'DIY crafts', 'Coffee culture', 'Minimalism'] },
  { id: 'pack-5', name: 'Travel & Culture', interests: ['Travel', 'Sustainable fashion', 'Music', 'Reading', 'Pet lovers'] },
];

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
  const isAnalyzing = analyzingCount > 0;

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

  const removeInterest = (name) => {
    onIntOptionsChange(intOptions.filter(o => o.name !== name));
  };

  const togglePack = (pack) => {
    const allInPack = pack.interests.every(name => intOptions.some(o => o.name === name));
    if (allInPack) {
      onIntOptionsChange(intOptions.filter(o => !pack.interests.includes(o.name)));
    } else {
      const existingNames = new Set(intOptions.map(o => o.name));
      const newInterests = pack.interests
        .filter(name => !existingNames.has(name))
        .map(name => {
          const found = MOCK_ALL_INTERESTS.find(i => i.name === name);
          return found ? { ...found, source: 'ai' } : { id: `ai_${name}`, name, source: 'ai', size: '100M-200M' };
        });
      onIntOptionsChange([...intOptions, ...newInterests]);
    }
  };

  const isPackSelected = (pack) => pack.interests.every(name => intOptions.some(o => o.name === name));

  return (
    <div className="w-full mt-4 pt-4 border-t border-gray-200/50 animate-in fade-in slide-in-from-top-2">
      <div className="relative" ref={panelRef}>
        <label className="text-xs font-medium text-gray-500 px-1 mb-2 block flex items-center gap-1.5 uppercase">
          <Target size={10} className="text-amber-500" />
          INT 兴趣定向
        </label>

        {/* Tags area - always visible above trigger */}
        {intOptions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {intOptions.map(opt => (
              <span key={opt.name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-tag text-xs font-medium border border-amber-100">
                {opt.name}
                <button onClick={(e) => { e.stopPropagation(); removeInterest(opt.name); }} className="text-amber-300 hover:text-rose-500 transition-colors">
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Trigger button */}
        <div
          onClick={() => setShowPanel(!showPanel)}
          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-base flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <span className="text-xs font-medium text-gray-300">
            {intOptions.length === 0 ? '点击选择兴趣词定向...' : '添加更多兴趣词...'}
          </span>
          <ChevronDown size={14} className={`text-amber-300 transition-transform ${showPanel ? 'rotate-180' : ''}`} />
        </div>

        {/* Dual-panel dropdown */}
        {showPanel && (
          <>
            <div className="fixed inset-0 z-[190]" onClick={() => setShowPanel(false)} />
            <div
              className="absolute top-full left-0 mt-2 w-[560px] bg-white rounded-section shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
              style={{ zIndex: 200 }}
            >
              <div className="flex" style={{ height: '360px' }}>
                {/* Left: Search & List (~55%) */}
                <div className="w-[55%] border-r border-gray-100 flex flex-col">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                      <input
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-base text-sm text-gray-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                        placeholder="搜索兴趣词..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                    {!searchQuery.trim() ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-gray-300 font-medium">请输入关键词查询</p>
                      </div>
                    ) : filteredInterests.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-gray-300 font-medium">未找到匹配的兴趣词</p>
                      </div>
                    ) : (
                      filteredInterests.map(interest => {
                        const sel = isSelected(interest);
                        return (
                          <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest)}
                            className={`w-full text-left px-3 py-2 rounded-base text-xs font-medium transition-all flex items-center justify-between ${
                              sel ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <span>{interest.name}</span>
                              <span className="ml-2 text-gray-400">{interest.size}</span>
                            </div>
                            {sel && <Check size={12} />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                {/* Right: AI Recommended (~45%) */}
                <div className="w-[45%] bg-gray-50/50 flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Sparkles size={12} className="text-primary-500" />
                    <span className="text-xs font-semibold text-gray-700">AI recommends interest packs</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {isAnalyzing ? (
                      <div className="space-y-2">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="p-3 rounded-inner border border-gray-100 bg-white animate-pulse">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        ))}
                        <p className="text-xs text-gray-400 font-medium text-center pt-2">
                          <Loader2 size={12} className="inline animate-spin mr-1" />
                          AI 分析推荐中...
                        </p>
                      </div>
                    ) : (
                      AI_INTEREST_PACKS.map(pack => {
                        const selected = isPackSelected(pack);
                        return (
                          <button
                            key={pack.id}
                            onClick={() => togglePack(pack)}
                            title={`${pack.name}: ${pack.interests.join(', ')}`}
                            className={`w-full text-left p-3 rounded-inner border transition-all ${
                              selected ? 'border-primary-500 bg-primary-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-800 line-clamp-1">{pack.name}</span>
                              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-2 ${selected ? 'bg-primary-500 text-white' : 'border border-gray-200'}`}>
                                {selected && <Check size={10} />}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{pack.interests.join(', ')}</p>
                          </button>
                        );
                      })
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
    <div className="bg-white border border-gray-200 rounded-inner overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary-500/70" />
          <span className="text-xs font-medium text-gray-500">&lt;think&gt;</span>
        </div>
        {collapsed ? <ChevronDown size={12} className="text-gray-300" /> : <ChevronUp size={12} className="text-gray-300" />}
      </div>
      {!collapsed && (
        <div className="px-3 py-2 space-y-1 border-t border-gray-100">
          {thinkLines.map((line, i) => (
            <p key={i} className="text-sm text-gray-700 font-regular">{line}</p>
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
    if (s === 'PER_PRODUCT') return '受众测试 (PER_PRODUCT)';
    if (s === 'ALL_PRODUCTS_PER_SET') return '产品测试 (ALL_PRODUCTS_PER_SET)';
    if (s === 'BY_CREATIVE') return '创意测试 (BY_CREATIVE)';
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
      <div className="bg-gray-50 rounded-section border border-gray-100 overflow-hidden">
        {/* Chat area */}
        <div ref={chatContainerRef} className="max-h-[360px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.length === 0 && !isThinking && (
            <div className="text-center py-8">
              <MessageSquare size={24} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-300 font-bold">请在下方输入框描述你想要的广告结构策略，AI 将为你生成个性化广告结构策略方案</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] bg-primary-500 text-white px-4 py-2.5 rounded-base rounded-br-md text-sm font-medium">
                  {msg.content}
                </div>
              ) : msg.role === 'ai_result' ? (
                <div className="w-full space-y-2">
                  <CollapsibleThink thinkLines={msg.thinkLines} />
                  <div className="bg-white border-2 border-emerald-200 rounded-section p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">已应用方案</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 font-regular pl-2 border-l-2 border-emerald-100">
                      <p>• 架构策略: {strategyLabel(msg.result.strategy)}</p>
                      <p>• 每产品 Adset 数: {msg.result.numAdsetsPerProduct}</p>
                      <p>• 受众分配: {audienceLabel(msg.result.audienceAssignment)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%] bg-white border border-gray-100 px-4 py-2.5 rounded-base rounded-bl-md text-sm font-regular text-gray-700">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Think block */}
          {thinkLines.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-inner overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer"
                onClick={() => setThinkCollapsed(!thinkCollapsed)}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary-500/70" />
                  <span className="text-xs font-medium text-gray-500">&lt;think&gt;</span>
                </div>
                {thinkCollapsed ? <ChevronDown size={12} className="text-gray-300" /> : <ChevronUp size={12} className="text-gray-300" />}
              </div>
              {!thinkCollapsed && (
                <div className="px-3 py-2 space-y-1 border-t border-gray-100">
                  {thinkLines.map((line, i) => (
                    <p key={i} className="text-sm text-gray-700 font-regular animate-in fade-in slide-in-from-left-2">
                      {line}
                    </p>
                  ))}
                  {isThinking && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Loader2 size={10} className="animate-spin text-primary-500/70" />
                      <span className="text-xs text-primary-500/70 font-medium">思考中...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Result card */}
          {pendingResult && (
            <div className="bg-white border-2 border-primary-500/15 rounded-section p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-primary-500" />
                <span className="text-base font-semibold text-gray-900">广告结构方案</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-700 font-regular pl-2 border-l-2 border-primary-500/15">
                <p>• 架构策略: {strategyLabel(pendingResult.strategy)}</p>
                <p>• 每产品 Adset 数: {pendingResult.numAdsetsPerProduct}</p>
                <p>• 受众分配: {audienceLabel(pendingResult.audienceAssignment)}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus"
                >
                  <Check size={12} /> 确认应用
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='例：每个产品创建3组adset，第1组和第2组用LAL受众，第3组用兴趣词受众'
            className="flex-1 border border-gray-200 rounded-base px-4 py-2.5 text-sm text-gray-700 bg-white placeholder:text-gray-300 focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            className={`w-9 h-9 rounded-base flex items-center justify-center transition-all duration-200 ${
              inputValue.trim() && !isThinking
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:shadow-primary-focus'
                : 'bg-gray-200 text-gray-300'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CreativePickerModal = ({ adsetIndex, adsetName, allAds, currentSelection, onSave, onClose }) => {
  const initialSelected = currentSelection
    ? new Set(currentSelection)
    : new Set(allAds.map(a => a.id));
  const [selected, setSelected] = useState(initialSelected);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 300 }}>
      <div className="bg-white rounded-section shadow-2xl w-full max-w-[560px] max-h-[80vh] flex flex-col overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">修改本组创意 — {adsetName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">勾选的创意将出现在此 Adset，已选创意自动回显</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2.5">
            {allAds.map(ad => {
              const isChecked = selected.has(ad.id);
              return (
                <div
                  key={ad.id}
                  onClick={() => toggle(ad.id)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isChecked ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`relative w-full aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${
                    isChecked ? 'border-primary-500 shadow-[0_0_0_2px_#c7d2fe]' : 'border-gray-200'
                  }`}>
                    <img src={ad.url} className="w-full h-full object-cover" alt={ad.fileName || ad.id} />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white/30 border-white/80 backdrop-blur-sm'
                    }`}>
                      {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <p className="text-[9px] font-medium text-gray-600 w-full text-center truncate">
                    {ad.fileName || ad.id}
                  </p>
                  <p className="text-[8px] text-gray-400 w-full text-center truncate flex items-center justify-center gap-0.5">
                    <Link size={7} className="shrink-0 opacity-50" />
                    {ad.productUrl || ad.productId || '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            已选 <span className="font-semibold text-gray-700">{selected.size}</span> 个创意
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-base hover:bg-gray-200 transition-all"
            >
              取消
            </button>
            <button
              onClick={() => { onSave(adsetIndex, [...selected]); onClose(); }}
              className="px-4 py-2 text-xs font-medium text-white bg-primary-500 rounded-base hover:bg-primary-600 transition-all"
            >
              保存
            </button>
          </div>
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
  adsetAudienceDetails = {},
  onSaveAdsetAudienceDetails,
  adType = 'SINGLE',
  onAdTypeChange,
  objective = '',
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
  onApplyAiStrategy,
  adsetCreativeSelections = {},
  numByCreativeAdsets = 1,
  onSaveAdsetCreatives,
  onAddByCreativeAdset,
}) => {
  const [showLalDropdown, setShowLalDropdown] = useState(false);
  const [showCustomAudienceDropdown, setShowCustomAudienceDropdown] = useState(false);
  const [showSavedAudienceDropdown, setShowSavedAudienceDropdown] = useState(false);
  const [editingAdsetIndex, setEditingAdsetIndex] = useState(null);
  const [isMetaConnecting, setIsMetaConnecting] = useState(false);
  const lalLoading            = useDropdownLoading('lalAudiences',     authStatus?.meta);
  const customAudienceLoading = useDropdownLoading('customAudiences',  authStatus?.meta);
  const savedAudienceLoading  = useDropdownLoading('savedAudiences',   authStatus?.meta);
  useEffect(() => { if (showLalDropdown            && selectedAccount) lalLoading.triggerLoad();            }, [showLalDropdown]);
  useEffect(() => { if (showCustomAudienceDropdown && selectedAccount) customAudienceLoading.triggerLoad(); }, [showCustomAudienceDropdown]);
  useEffect(() => { if (showSavedAudienceDropdown  && selectedAccount) savedAudienceLoading.triggerLoad();  }, [showSavedAudienceDropdown]);
  const [showNumAdsetsDropdown, setShowNumAdsetsDropdown] = useState(false);
  const [showStrategyDropdown, setShowStrategyDropdown] = useState(false);
  const [structureOpen, setStructureOpen] = useState(false);
  const [focusedAdsetIdx, setFocusedAdsetIdx] = useState(0);
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
      } else if (effectiveStrategy === 'BY_CREATIVE') {
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
    } else if (structure.strategy === 'BY_CREATIVE') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      for (let i = 0; i < numByCreativeAdsets; i++) {
        const selection = adsetCreativeSelections[i];
        const ads = selection ? allAds.filter(ad => selection.has(ad.id)) : allAds;
        groups.push({ name: `素材组 ${i + 1}`, ads });
      }
    }
    return groups;
  };

  const adSetGroups = getAdSetGroups();
  const estimatedTotalDaily = budgetType === 'ABO'
    ? dailyBudget * adSetGroups.length
    : dailyBudget;

  const effectiveFocusedIdx = adSetGroups.length > 0 ? Math.min(focusedAdsetIdx, adSetGroups.length - 1) : 0;
  const focusedAudienceType = adsetAudiences[effectiveFocusedIdx] || 'ADV';
  const focusedDetails = adsetAudienceDetails[effectiveFocusedIdx] || {};
  const isFlexibleObjective = objective === 'sales_conversions' || objective === 'app_promotion';
  const strategyLabels = { PER_PRODUCT: '受众测试', ALL_PRODUCTS_PER_SET: '产品测试', BY_CREATIVE: '创意测试', AI_STRATEGY: 'AI策略' };
  const structureSummary = [
    strategyLabels[structure.strategy] || structure.strategy,
    `${adSetGroups.length} Adset`,
    isFlexibleObjective ? (adType === 'FLEXIBLE' ? 'Flexible' : 'Single') : null
  ].filter(Boolean).join(' · ');

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
    if (parsed.strategy === 'BY_CREATIVE') {
      newStructure.adsPerSet = parsed.numAdsetsPerProduct;
    }
    onStructureChange(newStructure);

    // Apply audience assignment
    if (parsed.audienceAssignment && onApplyAiStrategy) {
      onApplyAiStrategy(parsed);
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8">
      <div className="space-y-4 min-w-0">
        <div className="flex items-center gap-2 px-2">
          <h4 className="text-xl font-semibold text-gray-900">Campaign 架构策略</h4>
          <div className="w-5 h-5 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center cursor-help shadow-sm">
            <Info size={12} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-section adsgo-card-shadow space-y-6">
          {/* ▶ Ad Structure Config — collapsible */}
          <div className="border border-gray-100 rounded-inner">
            <button
              onClick={() => setStructureOpen(!structureOpen)}
              className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {structureOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                <span className="text-sm font-semibold text-gray-700">Ad Structure Config</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{structureSummary}</span>
            </button>

            {structureOpen && (
              <div className="p-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex gap-6 items-start">

                  {/* Left: strategy dropdown + adset count + AI dialog */}
                  <div className="flex-1 space-y-4 min-w-0 relative z-10">
                    {/* Strategy dropdown */}
                    <div>
                      <label className="text-xs font-medium text-gray-500 px-1 mb-2 block">选择 Campaign 策略</label>
                      {campaignType === 'CATALOG' ? (
                        <div className="h-10 px-4 flex items-center bg-gray-50 rounded-base border border-gray-100 text-sm font-medium text-gray-500">
                          每组均投放已选目录
                        </div>
                      ) : (
                        <div className="relative">
                          {showStrategyDropdown && <div className="fixed inset-0 z-[190]" onClick={() => setShowStrategyDropdown(false)} />}
                          <div
                            onClick={() => setShowStrategyDropdown(!showStrategyDropdown)}
                            className="w-full h-10 bg-white border border-gray-200 rounded-base px-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all duration-200"
                          >
                            <span className="text-sm font-medium text-gray-700">{strategyLabels[structure.strategy] || structure.strategy}</span>
                            <ChevronDown size={14} className={`text-gray-300 transition-transform duration-200 ${showStrategyDropdown ? 'rotate-180' : ''}`} />
                          </div>
                          {showStrategyDropdown && (
                            <div
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-base shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 py-1"
                              style={{ zIndex: 200 }}
                            >
                              {[
                                { id: 'PER_PRODUCT', label: '受众测试', desc: 'Multiple Adsets per SKU' },
                                { id: 'ALL_PRODUCTS_PER_SET', label: '产品测试', desc: 'All SKU in every Adset' },
                                { id: 'BY_CREATIVE', label: '创意测试', desc: 'Assign creatives per Adset' },
                                { id: 'AI_STRATEGY', label: 'AI个性化策略', desc: 'Describe your ad structure' },
                              ].map(opt => (
                                <div
                                  key={opt.id}
                                  onClick={() => { onStructureChange({ ...structure, strategy: opt.id }); setShowStrategyDropdown(false); }}
                                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors group ${structure.strategy === opt.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                >
                                  <div>
                                    <p className={`text-sm font-medium ${structure.strategy === opt.id ? 'text-primary-500' : 'text-gray-700'}`}>{opt.label}</p>
                                    <p className="text-xs text-gray-400">{opt.desc}</p>
                                  </div>
                                  {structure.strategy === opt.id && <Check size={13} className="text-primary-500 shrink-0 ml-2" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Adset count selector */}
                    {structure.strategy !== 'AI_STRATEGY' && (structure.strategy === 'PER_PRODUCT' || structure.strategy === 'ALL_PRODUCTS_PER_SET') && (
                      <div className="animate-in slide-in-from-top-2 duration-200">
                        <label className="text-xs font-medium text-gray-500 px-1 mb-2 block">
                          {structure.strategy === 'PER_PRODUCT' ? '每产品 Adset 组数' : 'Adset 组数'}
                        </label>
                        <div className="relative">
                          {showNumAdsetsDropdown && <div className="fixed inset-0 z-[190]" onClick={() => setShowNumAdsetsDropdown(false)} />}
                          <div
                            onClick={() => setShowNumAdsetsDropdown(!showNumAdsetsDropdown)}
                            className="w-full h-10 bg-white border border-gray-200 rounded-base px-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <Layers size={14} className="text-primary-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {structure.strategy === 'PER_PRODUCT' ? (structure.numAdsetsPerProduct || 1) : (structure.numAdsets || 1)} 组
                              </span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-300 transition-transform duration-200 ${showNumAdsetsDropdown ? 'rotate-180' : ''}`} />
                          </div>
                          {showNumAdsetsDropdown && (
                            <div
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-base shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 py-1"
                              style={{ zIndex: 200 }}
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                                const isSel = structure.strategy === 'PER_PRODUCT'
                                  ? (structure.numAdsetsPerProduct || 1) === n
                                  : (structure.numAdsets || 1) === n;
                                return (
                                  <div
                                    key={n}
                                    onClick={() => {
                                      const field = structure.strategy === 'PER_PRODUCT' ? 'numAdsetsPerProduct' : 'numAdsets';
                                      onStructureChange({ ...structure, [field]: n });
                                      setShowNumAdsetsDropdown(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2 hover:bg-primary-50 cursor-pointer transition-colors ${isSel ? 'bg-primary-50/50' : ''}`}
                                  >
                                    <span className={`text-sm font-medium ${isSel ? 'text-primary-500' : 'text-gray-700'}`}>{n} 组 Adsets</span>
                                    {isSel && <Check size={13} className="text-primary-500" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Strategy Dialog */}
                    {structure.strategy === 'AI_STRATEGY' && campaignType !== 'CATALOG' && (
                      aiStrategyApplied ? (
                        <div className="animate-in fade-in duration-200">
                          <button
                            onClick={() => {
                              setAiStrategyApplied(false);
                              onStructureChange({ ...structure, _aiResolvedStrategy: undefined });
                            }}
                            className="flex items-center gap-2 px-5 py-3 border border-primary-500 text-primary-500 rounded-base text-sm font-medium hover:bg-primary-50 active:bg-primary-100 transition-all duration-200"
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
                  </div>

                  {/* Right: Ad Format (sales_conversions / app_promotion only) */}
                  {isFlexibleObjective && (
                    <div className="w-48 shrink-0">
                      <label className="text-xs font-medium text-gray-500 px-1 mb-2 block">Ad Format</label>
                      <div className="space-y-2">
                        {[
                          { value: 'FLEXIBLE', label: 'Flexible 灵活广告', desc: '≤10 素材/ad · Meta 自动优化' },
                          { value: 'SINGLE', label: 'Single 单素材', desc: '每素材 1 个 ad' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => onAdTypeChange(opt.value)}
                            className={`w-full p-3 rounded-inner border text-left transition-all ${
                              adType === opt.value
                                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/10'
                                : 'border-gray-100 hover:border-gray-200 bg-white'
                            }`}
                          >
                            <p className={`text-xs font-semibold ${adType === opt.value ? 'text-primary-500' : 'text-gray-900'}`}>{opt.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Architecture diagram — always visible */}
          {(structure.strategy !== 'AI_STRATEGY' || aiStrategyApplied) && (
          <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-8">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-10 relative">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-section flex items-center justify-center shadow-xl z-10 border-4 border-white">
                  <Briefcase size={28} />
                </div>
                <div className="absolute -bottom-6 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">Target Campaign</span>
                  <div className="w-[1px] h-6 bg-gray-200 mt-1"></div>
                </div>
              </div>

              <div className={`w-full flex ${adSetGroups.length > 4 ? 'justify-start' : 'justify-center'} gap-10 overflow-x-auto pb-4 no-scrollbar px-4`}>
                {adSetGroups.map((group, idx) => {
                  const audienceType = adsetAudiences[idx % adsetAudiences.length] || 'ADV';
                  const isFocused = idx === effectiveFocusedIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setFocusedAdsetIdx(idx)}
                      className={`flex flex-col items-center shrink-0 rounded-xl px-3 pt-3 pb-2 border cursor-pointer transition-all ${
                        isFocused
                          ? audienceType === 'LAL' ? 'bg-purple-50 border-purple-200 shadow-md'
                          : audienceType === 'INT' ? 'bg-amber-50 border-amber-200 shadow-md'
                          : 'bg-primary-50 border-primary-200 shadow-md'
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleAudience(idx); setFocusedAdsetIdx(idx); }}
                        title="点击切换受众策略 (Adv+ / LAL / INT)"
                        className={`w-10 h-10 rounded-base border shadow-adsgo-card flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 mb-2 relative ${
                          audienceType === 'LAL' ? 'bg-white text-purple-600 border-purple-100' :
                          audienceType === 'INT' ? 'bg-white text-amber-600 border-amber-100' :
                          'bg-white text-primary-500 border-primary-200'
                        }`}
                        title="点击切换受众策略 (Adv+ / LAL / INT)"
                      >
                        <Users size={18} />
                        <span className="text-xs font-medium mt-0.5">{AUDIENCE_SHORT_LABELS[audienceType]}</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-xs font-medium flex items-center justify-center rounded-full border border-white">
                          {idx + 1}
                        </div>
                      </button>

                      <p className="text-xs font-medium text-gray-500 truncate max-w-[80px] text-center mb-3">{group.name}</p>

                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                        {campaignType === 'CATALOG' ? (
                          <div className="w-16 h-20 rounded-lg border-2 border-dashed border-primary-500/20 bg-primary-50/30 flex flex-col items-center justify-center p-2 relative overflow-hidden group/catalog">
                            <div className="grid grid-cols-2 gap-1 opacity-40 group-hover/catalog:opacity-60 transition-opacity">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-4 h-4 rounded-sm bg-primary-50" />
                              ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LayoutGrid size={24} className="text-primary-500/70" />
                            </div>
                            <div className="absolute bottom-1 w-full flex justify-center">
                              <span className="text-xs font-medium text-primary-500/70 uppercase">Dynamic Feed</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {group.ads.slice(0, 4).map((ad, adIdx) => (
                              <div key={adIdx} className="w-8 h-10 rounded-md border border-white shadow-sm overflow-hidden bg-white ring-1 ring-gray-100">
                                <img src={ad.url} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {group.ads.length > 4 && (
                              <div className="w-8 h-10 rounded-md border border-white shadow-adsgo-card flex items-center justify-center bg-gray-50 text-xs font-medium text-gray-500">
                                +{group.ads.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {structure.strategy === 'BY_CREATIVE' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingAdsetIndex(idx); }}
                          className="mt-2 flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-primary-500 bg-white hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-base px-2.5 py-1 transition-all"
                        >
                          <Edit3 size={10} /> 修改本组创意
                        </button>
                      )}
                    </div>
                  );
                })}
                {structure.strategy === 'BY_CREATIVE' && (
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={onAddByCreativeAdset}
                      className="w-10 h-10 rounded-base border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-all"
                    >
                      <Plus size={18} />
                    </button>
                    <p className="text-[10px] text-gray-400 font-medium mt-2 whitespace-nowrap">新增 Adset</p>
                  </div>
                )}
              </div>

              {/* Per-adset audience config */}
              {adSetGroups.length > 0 && (
                <div className="w-full mt-6 pt-6 border-t border-gray-200/50 animate-in fade-in duration-200">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-gray-600">Adset {effectiveFocusedIdx + 1} 受众配置</span>
                  </div>

                  {focusedAudienceType === 'ADV' && (
                    <p className="text-sm text-gray-400 font-medium px-1">
                      Advantage+ 自动扩展，无需额外配置
                    </p>
                  )}

                  {focusedAudienceType === 'LAL' && (
                    <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-150">

                      {/* ── Lookalike Audience ── */}
                      <div className="space-y-1.5 relative">
                        <p className="text-xs font-semibold text-purple-500 px-1">Lookalike Audience</p>
                        <div onClick={() => setShowLalDropdown(!showLalDropdown)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
                          <div className="flex flex-wrap gap-1 overflow-hidden">
                            {(focusedDetails.lalOptions || []).length === 0
                              ? <span className="text-xs font-bold text-gray-300">选择...</span>
                              : (focusedDetails.lalOptions || []).map(opt => <span key={opt} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium border border-purple-100">{opt.split(' ')[1] || opt}</span>)
                            }
                          </div>
                          <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showLalDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        {showLalDropdown && (
                          <>
                            <div className="fixed inset-0 z-[190]" onClick={() => setShowLalDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 z-[200]">
                              {!authStatus?.meta ? (
                                <div className="p-4"><button onClick={() => { setIsMetaConnecting(true); setTimeout(() => { setIsMetaConnecting(false); handleAuthorize('meta'); setShowLalDropdown(false); }, 3000); }} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><Facebook size={12} />立即连接 Meta</>}</button></div>
                              ) : !selectedAccount ? (
                                <div className="p-4"><button onClick={() => { onSelectAccount(); setShowLalDropdown(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2"><Briefcase size={12} />选择广告账户</button></div>
                              ) : lalLoading.isLoading ? (
                                <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-gray-400 animate-pulse">Loading...</p></div>
                              ) : (
                                ['US Purchase 1%', 'US add to cart 5%', 'US register last30days 1%~3%'].map(opt => {
                                  const cur = focusedDetails.lalOptions || [];
                                  const isSel = cur.includes(opt);
                                  return <div key={opt} onClick={() => { const next = isSel ? cur.filter(o => o !== opt) : [...cur, opt]; onSaveAdsetAudienceDetails(effectiveFocusedIdx, { ...focusedDetails, lalOptions: next }); }} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"><span className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-gray-700'}`}>{opt}</span>{isSel && <Check size={12} className="text-purple-600" />}</div>;
                                })
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* ── Custom Audience ── */}
                      <div className="space-y-1.5 relative">
                        <p className="text-xs font-semibold text-purple-500 px-1">Custom Audience</p>
                        <div onClick={() => setShowCustomAudienceDropdown(!showCustomAudienceDropdown)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
                          <div className="flex flex-wrap gap-1 overflow-hidden">
                            {(focusedDetails.customAudienceOptions || []).length === 0
                              ? <span className="text-xs font-bold text-gray-300">选择...</span>
                              : (focusedDetails.customAudienceOptions || []).map(opt => <span key={opt} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium border border-purple-100">{opt}</span>)
                            }
                          </div>
                          <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showCustomAudienceDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        {showCustomAudienceDropdown && (
                          <>
                            <div className="fixed inset-0 z-[190]" onClick={() => setShowCustomAudienceDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 z-[200]">
                              {!authStatus?.meta ? (
                                <div className="p-4"><button onClick={() => { setIsMetaConnecting(true); setTimeout(() => { setIsMetaConnecting(false); handleAuthorize('meta'); setShowCustomAudienceDropdown(false); }, 3000); }} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><Facebook size={12} />立即连接 Meta</>}</button></div>
                              ) : !selectedAccount ? (
                                <div className="p-4"><button onClick={() => { onSelectAccount(); setShowCustomAudienceDropdown(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2"><Briefcase size={12} />选择广告账户</button></div>
                              ) : customAudienceLoading.isLoading ? (
                                <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-gray-400 animate-pulse">Loading...</p></div>
                              ) : (
                                MOCK_CUSTOM_AUDIENCES.map(opt => {
                                  const cur = focusedDetails.customAudienceOptions || [];
                                  const isSel = cur.includes(opt);
                                  return <div key={opt} onClick={() => { const next = isSel ? cur.filter(o => o !== opt) : [...cur, opt]; onSaveAdsetAudienceDetails(effectiveFocusedIdx, { ...focusedDetails, customAudienceOptions: next }); }} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"><span className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-gray-700'}`}>{opt}</span>{isSel && <Check size={12} className="text-purple-600" />}</div>;
                                })
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* ── Saved Audience (single-select) ── */}
                      <div className="space-y-1.5 relative">
                        <p className="text-xs font-semibold text-purple-500 px-1">Saved Audience</p>
                        <div onClick={() => setShowSavedAudienceDropdown(!showSavedAudienceDropdown)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
                          <span className={`text-[10px] font-bold truncate ${focusedDetails.savedAudience ? 'text-purple-700' : 'text-gray-300'}`}>
                            {focusedDetails.savedAudience ? focusedDetails.savedAudience.name : '选择...'}
                          </span>
                          <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showSavedAudienceDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        {showSavedAudienceDropdown && (
                          <>
                            <div className="fixed inset-0 z-[190]" onClick={() => setShowSavedAudienceDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 z-[200]">
                              {!authStatus?.meta ? (
                                <div className="p-4"><button onClick={() => { setIsMetaConnecting(true); setTimeout(() => { setIsMetaConnecting(false); handleAuthorize('meta'); setShowSavedAudienceDropdown(false); }, 3000); }} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><Facebook size={12} />立即连接 Meta</>}</button></div>
                              ) : !selectedAccount ? (
                                <div className="p-4"><button onClick={() => { onSelectAccount(); setShowSavedAudienceDropdown(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2"><Briefcase size={12} />选择广告账户</button></div>
                              ) : savedAudienceLoading.isLoading ? (
                                <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-gray-400 animate-pulse">Loading...</p></div>
                              ) : (
                                MOCK_SAVED_AUDIENCES.map(sa => {
                                  const isSel = focusedDetails.savedAudience?.id === sa.id;
                                  return (
                                    <div key={sa.id} onClick={() => { onSaveAdsetAudienceDetails(effectiveFocusedIdx, { ...focusedDetails, savedAudience: isSel ? null : sa }); setShowSavedAudienceDropdown(false); }} className="flex items-start justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors">
                                      <div><p className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-gray-700'}`}>{sa.name}</p><p className="text-[10px] text-gray-400 mt-0.5">{sa.gender} · {sa.ageMin}–{sa.ageMax}</p></div>
                                      {isSel && <Check size={12} className="text-purple-600 shrink-0 mt-0.5" />}
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

                  {focusedAudienceType === 'INT' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-150">
                      <IntInterestSelector
                        intOptions={focusedDetails.intOptions || []}
                        onIntOptionsChange={(newOptions) => onSaveAdsetAudienceDetails(effectiveFocusedIdx, { ...focusedDetails, intOptions: newOptions })}
                        productAnalyses={null}
                        allAnalysesComplete={false}
                        selectedProducts={selectedProducts}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-gray-900 px-2">预算配置与预估消耗</h4>
        <div className="bg-white p-5 rounded-section adsgo-card-shadow flex flex-col gap-4 h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-medium text-gray-500 px-1">目标投放系列 (Campaign)</label>
              <button
                onClick={onSelectCampaign}
                className="flex items-center gap-1.5 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <Edit3 size={12} />
                <span className="text-xs font-medium">选择已有</span>
              </button>
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-inner border-2 transition-all ${isExistingCampaign ? 'bg-primary-50 border-primary-500/20' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-10 h-10 rounded-base flex items-center justify-center ${isExistingCampaign ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/15' : 'bg-white text-gray-400 shadow-adsgo-card'}`}>
                <Briefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {selectedCampaign?.name || '创建全新系列 (Create New)'}
                </p>
                {isExistingCampaign && <p className="text-xs text-primary-500/70 font-medium mt-0.5">ID: {selectedCampaign.id}</p>}
              </div>
              {isExistingCampaign && <Lock size={14} className="text-primary-500/40 shrink-0" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">投放预算模式</p>
              {isExistingCampaign && <Lock size={12} className="text-gray-300" />}
            </div>
            <div className={`flex p-1 bg-gray-100/80 rounded-base border border-gray-100 ${isExistingCampaign ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
              <button
                onClick={() => onBudgetTypeChange('CBO')}
                className={`px-4 py-1.5 rounded-base text-xs font-medium transition-all ${budgetType === 'CBO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500'}`}>
                CBO (均衡)
              </button>
              <button
                onClick={() => onBudgetTypeChange('ABO')}
                className={`px-4 py-1.5 rounded-base text-xs font-medium transition-all ${budgetType === 'ABO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500'}`}>
                ABO (单组)
              </button>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-inner p-4 flex flex-col items-center relative overflow-hidden group">
            <div className="flex items-center w-full">
              <DollarSign className="text-gray-300 absolute left-6 pointer-events-none group-focus-within:text-primary-500 transition-colors" size={24} />
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-full bg-transparent border-none outline-none pl-12 pr-4 text-3xl font-bold text-gray-900"
              />
              <span className="text-xs font-medium text-gray-500 mr-4">
                {budgetType === 'ABO' ? 'Per AdSet' : 'Total Campaign'}
              </span>
            </div>
          </div>

          <div className="bg-gray-900 p-5 rounded-section text-white shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-primary-500/70" />
                <p className="text-xs font-medium opacity-60">预估日均消耗</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">${estimatedTotalDaily}</p>
                  <p className="text-xs text-primary-500/70 font-medium mt-1">
                    {budgetType === 'ABO' ? `${dailyBudget} * ${adSetGroups.length} Adsets` : '系列全局消耗'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Layers size={14} className="text-primary-500/70" />
                    <p className="text-xl font-bold text-white">{adSetGroups.length}</p>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">AdSets 数量</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    {editingAdsetIndex !== null && (
      <CreativePickerModal
        adsetIndex={editingAdsetIndex}
        adsetName={`素材组 ${editingAdsetIndex + 1}`}
        allAds={selectedProducts.flatMap(p => productCreativesMap[p.id] || [])}
        currentSelection={adsetCreativeSelections[editingAdsetIndex]}
        onSave={onSaveAdsetCreatives}
        onClose={() => setEditingAdsetIndex(null)}
      />
    )}
    </>
  );
};

export default CampaignPlanView;
