import React, { useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check, LayoutGrid, Facebook, Smartphone, Search, X, Loader2, Send, ChevronUp, MessageSquare, RefreshCw, Plus, Link, Copy, CopyMinus, Trash2, Globe, MapPin, ChevronLeft, ArrowRight, CheckCircle2, MousePointerClick, Database } from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';
import useDropdownLoading from '../../../hooks/useDropdownLoading';
import { IncludeExcludeAudienceDropdown } from '../BatchGenerateAds';
import { Popover } from '../../common/Popover';

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
  const triggerRef = useRef(null);

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
    <div className="w-full mt-4 pt-4 border-t border-neutral-200/50 animate-in fade-in slide-in-from-top-2">
      <div>
        <label className="text-xs font-medium text-neutral-500 px-1 mb-2 block flex items-center gap-1.5 uppercase">
          <Target size={10} className="text-warning-500" />
          INT 兴趣定向
        </label>

        {/* Tags area - always visible above trigger */}
        {intOptions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {intOptions.map(opt => (
              <span key={opt.name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning-50 text-warning-600 rounded-tag text-xs font-medium border border-warning-100">
                {opt.name}
                <button onClick={(e) => { e.stopPropagation(); removeInterest(opt.name); }} className="text-warning-300 hover:text-rose-500 transition-colors">
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Trigger button */}
        <div
          ref={triggerRef}
          onClick={() => setShowPanel(!showPanel)}
          className="w-full px-4 py-3 bg-white border-2 border-warning-100 rounded-base flex items-center justify-between cursor-pointer hover:border-warning-300 transition-all"
        >
          <span className="text-xs font-medium text-neutral-300">
            {intOptions.length === 0 ? '点击选择兴趣词定向...' : '添加更多兴趣词...'}
          </span>
          <ChevronDown size={14} className={`text-warning-300 transition-transform ${showPanel ? 'rotate-180' : ''}`} />
        </div>

        {/* Dual-panel dropdown */}
        <Popover
          open={showPanel}
          anchorRef={triggerRef}
          placement="bottom-start"
          onClose={() => setShowPanel(false)}
          className="w-[560px] bg-white rounded-section shadow-xl border border-neutral-100 overflow-hidden flex flex-col"
        >
          <div className="flex" style={{ height: '360px' }}>
            {/* Left: Search & List (~55%) */}
            <div className="w-[55%] border-r border-neutral-100 flex flex-col">
              <div className="p-3 border-b border-neutral-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 w-3.5 h-3.5" />
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-base text-sm text-neutral-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
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
                    <p className="text-xs text-neutral-300 font-medium">请输入关键词查询</p>
                  </div>
                ) : filteredInterests.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-neutral-300 font-medium">未找到匹配的兴趣词</p>
                  </div>
                ) : (
                  filteredInterests.map(interest => {
                    const sel = isSelected(interest);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest)}
                        className={`w-full text-left px-3 py-2 rounded-base text-xs font-medium transition-all flex items-center justify-between ${
                          sel ? 'bg-warning-50 text-warning-600' : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <div>
                          <span>{interest.name}</span>
                          <span className="ml-2 text-neutral-400">{interest.size}</span>
                        </div>
                        {sel && <Check size={12} />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            {/* Right: AI Recommended (~45%) */}
            <div className="w-[45%] bg-neutral-50/50 flex flex-col">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
                <Sparkles size={12} className="text-primary-500" />
                <span className="text-xs font-semibold text-neutral-700">AI recommends interest packs</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {isAnalyzing ? (
                  <div className="space-y-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="p-3 rounded-inner border border-neutral-100 bg-white animate-pulse">
                        <div className="h-3 bg-neutral-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-neutral-100 rounded w-1/2"></div>
                      </div>
                    ))}
                    <p className="text-xs text-neutral-400 font-medium text-center pt-2">
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
                          selected ? 'border-primary-500 bg-primary-50/50 shadow-sm' : 'border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-neutral-800 line-clamp-1">{pack.name}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-2 ${selected ? 'bg-primary-500 text-white' : 'border border-neutral-200'}`}>
                            {selected && <Check size={10} />}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-2">{pack.interests.join(', ')}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
};

// Collapsible think block for history messages
const CollapsibleThink = ({ thinkLines }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="bg-white border border-neutral-200 rounded-inner overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 bg-neutral-50 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary-500/70" />
          <span className="text-xs font-medium text-neutral-500">&lt;think&gt;</span>
        </div>
        {collapsed ? <ChevronDown size={12} className="text-neutral-300" /> : <ChevronUp size={12} className="text-neutral-300" />}
      </div>
      {!collapsed && (
        <div className="px-3 py-2 space-y-1 border-t border-neutral-100">
          {thinkLines.map((line, i) => (
            <p key={i} className="text-sm text-neutral-700 font-regular">{line}</p>
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
    if (s === 'PER_PRODUCT') return 'Test by product group (PER_PRODUCT)';
    if (s === 'ALL_PRODUCTS_PER_SET') return 'Test by audience group (ALL_PRODUCTS_PER_SET)';
    if (s === 'BY_CREATIVE') return 'Test by creative group (BY_CREATIVE)';
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
      <div className="bg-neutral-50 rounded-section border border-neutral-100 overflow-hidden">
        {/* Chat area */}
        <div ref={chatContainerRef} className="max-h-[360px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.length === 0 && !isThinking && (
            <div className="text-center py-8">
              <MessageSquare size={24} className="text-neutral-200 mx-auto mb-2" />
              <p className="text-xs text-neutral-300 font-bold">请在下方输入框描述你想要的广告结构策略，AI 将为你生成个性化广告结构策略方案</p>
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
                  <div className="bg-white border-2 border-success-200 rounded-section p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-success-600" />
                      </div>
                      <span className="text-xs font-semibold text-success-700">已应用方案</span>
                    </div>
                    <div className="space-y-1 text-sm text-neutral-700 font-regular pl-2 border-l-2 border-success-100">
                      <p>• 架构策略: {strategyLabel(msg.result.strategy)}</p>
                      <p>• 每产品 Adset 数: {msg.result.numAdsetsPerProduct}</p>
                      <p>• 受众分配: {audienceLabel(msg.result.audienceAssignment)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%] bg-white border border-neutral-100 px-4 py-2.5 rounded-base rounded-bl-md text-sm font-regular text-neutral-700">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Think block */}
          {thinkLines.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-inner overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2 bg-neutral-50 cursor-pointer"
                onClick={() => setThinkCollapsed(!thinkCollapsed)}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary-500/70" />
                  <span className="text-xs font-medium text-neutral-500">&lt;think&gt;</span>
                </div>
                {thinkCollapsed ? <ChevronDown size={12} className="text-neutral-300" /> : <ChevronUp size={12} className="text-neutral-300" />}
              </div>
              {!thinkCollapsed && (
                <div className="px-3 py-2 space-y-1 border-t border-neutral-100">
                  {thinkLines.map((line, i) => (
                    <p key={i} className="text-sm text-neutral-700 font-regular animate-in fade-in slide-in-from-left-2">
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
                <span className="text-base font-semibold text-neutral-900">广告结构方案</span>
              </div>
              <div className="space-y-1.5 text-sm text-neutral-700 font-regular pl-2 border-l-2 border-primary-500/15">
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
        <div className="border-t border-neutral-100 p-3 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='例：每个产品创建3组adset，第1组和第2组用LAL受众，第3组用兴趣词受众'
            className="flex-1 border border-neutral-200 rounded-base px-4 py-2.5 text-sm text-neutral-700 bg-white placeholder:text-neutral-300 focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            className={`w-9 h-9 rounded-base flex items-center justify-center transition-all duration-200 ${
              inputValue.trim() && !isThinking
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:shadow-primary-focus'
                : 'bg-neutral-200 text-neutral-300'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CreativePickerModal = ({ adsetIndex, adsetName, allAds, currentSelection, onSave, onClose, availablePlacements = [], currentPlacements, onSavePlacements }) => {
  const initialSelected = currentSelection
    ? new Set(currentSelection)
    : new Set(allAds.map(a => a.id));
  const [selected, setSelected] = useState(initialSelected);
  const initialPlacements = (currentPlacements && currentPlacements.length > 0)
    ? currentPlacements
    : availablePlacements.map(p => p.id);
  const [placements, setPlacements] = useState(initialPlacements);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePlacement = (id) => {
    setPlacements(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 300 }}>
      <div className="bg-white rounded-section shadow-2xl w-full max-w-[560px] max-h-[80vh] flex flex-col overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">修改本组创意 — {adsetName}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">勾选的创意将出现在此 Adset，已选创意自动回显</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-all">
            <X size={16} />
          </button>
        </div>

        {availablePlacements.length > 0 && (
          <div className="px-6 pt-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-neutral-900">投放版位</h4>
              <span className="text-[10px] text-neutral-400 font-medium">
                {placements.length} / {availablePlacements.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availablePlacements.map(p => {
                const isOn = placements.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlacement(p.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      isOn
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {isOn && <Check size={10} strokeWidth={3} />}
                    {p.label}
                    {p.sublabels && (
                      <span className={`text-[9px] ${isOn ? 'text-primary-400' : 'text-neutral-400'} ml-0.5`}>
                        ({p.sublabels.join('·')})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2.5">
            {allAds.map(ad => {
              const isChecked = selected.has(ad.id);
              return (
                <div
                  key={ad.id}
                  onClick={() => toggle(ad.id)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isChecked ? 'bg-primary-50' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className={`relative w-full aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${
                    isChecked ? 'border-primary-500 shadow-[0_0_0_2px_#c7d2fe]' : 'border-neutral-200'
                  }`}>
                    {ad.mediaType === 'video' ? (
                      <video src={ad.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <img src={ad.url} className="w-full h-full object-cover" alt={ad.fileName || ad.id} />
                    )}
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white/30 border-white/80 backdrop-blur-sm'
                    }`}>
                      {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <p className="text-[9px] font-medium text-neutral-600 w-full text-center truncate">
                    {ad.fileName || ad.id}
                  </p>
                  <p className="text-[8px] text-neutral-400 w-full text-center truncate flex items-center justify-center gap-0.5">
                    <Link size={7} className="shrink-0 opacity-50" />
                    {ad.productUrl || ad.productId || '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            已选 <span className="font-semibold text-neutral-700">{selected.size}</span> 个创意
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-base hover:bg-neutral-200 transition-all"
            >
              取消
            </button>
            <button
              onClick={() => {
                onSave(adsetIndex, [...selected]);
                if (onSavePlacements) onSavePlacements(adsetIndex, placements);
                onClose();
              }}
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

// ── Right-side detail panels ─────────────────────────────────────────────────

const CampaignDetailPanel = ({ campaignIdx, config, onChange, onSelectExistingCampaign, selectedCampaign, isExistingCampaign, targetingMeta = {}, platform, globalBidStrategy = 'highest_volume' }) => {
  const { CAMPAIGN_OBJECTIVES = [], ADSET_GOALS_MAPPING = {}, BID_STRATEGIES: BID_STRATEGIES_META = [] } = targetingMeta;
  const [openDD, setOpenDD] = useState(null);   // 'obj' | 'bid' | null
  const objTriggerRef = useRef(null);
  const bidTriggerRef = useRef(null);

  const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === config.objective);
  // Bid Strategy 仅 Meta 渲染：effective = config 级 override 优先，否则全局
  const isMetaCampaign = platform?.id !== 'tiktok';
  const effectiveCampaignBidStrategy = config.bidStrategy !== undefined ? config.bidStrategy : globalBidStrategy;
  const currentBidStrategyObj = BID_STRATEGIES_META.find(s => s.value === effectiveCampaignBidStrategy);

  const defaultCampaignName = `Campaign ${campaignIdx + 1}`;
  const campaignNameValue = config.campaignName !== undefined ? config.campaignName : defaultCampaignName;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-primary-500/60 tabular-nums">C{campaignIdx + 1}</span>
        <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">Campaign {campaignIdx + 1} 配置</h4>
      </div>

      {/* Campaign 名称 — editable */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">Campaign 名称</label>
        <div className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center gap-2 focus-within:border-primary-500/30 transition-all">
          <Edit3 size={14} className="text-primary-500 shrink-0" />
          <input
            value={campaignNameValue}
            onChange={(e) => onChange({ campaignName: e.target.value })}
            placeholder={defaultCampaignName}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-neutral-700 placeholder-neutral-300"
          />
        </div>
      </div>

      {/* 投放国家/地区 与 Language 已下沉到 AdsetDetailPanel（适配每个 adset 独立 targeting） */}

      {/* Campaign Objective — 仅 level-1（goal/event 已下沉到 AdsetDetailPanel） */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">Campaign Objective</label>
        <div ref={objTriggerRef} onClick={() => setOpenDD(openDD === 'obj' ? null : 'obj')}
          className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Target size={14} className="text-primary-500 shrink-0" />
            <span className={`text-sm font-semibold truncate ${config.objective ? 'text-neutral-700' : 'text-neutral-300'}`}>
              {currentObjectiveObj?.label || 'Select...'}
            </span>
          </div>
          <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${openDD === 'obj' ? 'rotate-180' : ''}`} />
        </div>
        <Popover
          open={openDD === 'obj'}
          anchorRef={objTriggerRef}
          placement="bottom-start"
          matchWidth
          onClose={() => setOpenDD(null)}
          className="bg-white rounded-base shadow-xl border border-neutral-100 p-2"
        >
          <div className="space-y-1">
            {CAMPAIGN_OBJECTIVES.map(obj => {
              const Icon = obj.icon;
              return (
                <button key={obj.value} onClick={() => {
                  const firstGoal = (ADSET_GOALS_MAPPING[obj.value] || [])[0];
                  onChange({ objective: obj.value, adsetGoal: firstGoal?.value || '', event: firstGoal?.needsEvent ? 'Purchase' : '' });
                  setOpenDD(null);
                }} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-base text-xs font-medium transition-all ${config.objective === obj.value ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}>
                  <div className={`w-5 h-5 rounded-base flex items-center justify-center ${config.objective === obj.value ? 'bg-primary-500 text-white' : `${obj.bg} ${obj.color}`}`}>
                    {Icon && <Icon size={12} />}
                  </div>
                  <span className="truncate">{obj.label}</span>
                </button>
              );
            })}
          </div>
        </Popover>
      </div>

      {/* Bid Strategy — 仅 Meta 平台显示；选中时联动清空该 campaign 下所有 adset 的 bidAmount override */}
      {isMetaCampaign && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500 px-1">竞价策略</label>
          <div ref={bidTriggerRef} onClick={() => setOpenDD(openDD === 'bid' ? null : 'bid')}
            className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Target size={14} className="text-primary-500 shrink-0" />
              <span className={`text-sm font-semibold truncate ${currentBidStrategyObj ? 'text-neutral-700' : 'text-neutral-300'}`}>
                {currentBidStrategyObj?.label || 'Select...'}
              </span>
            </div>
            <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${openDD === 'bid' ? 'rotate-180' : ''}`} />
          </div>
          <Popover
            open={openDD === 'bid'}
            anchorRef={bidTriggerRef}
            placement="bottom-start"
            matchWidth
            onClose={() => setOpenDD(null)}
            className="bg-white rounded-base shadow-xl border border-neutral-100 p-2"
          >
            {BID_STRATEGIES_META.map(s => (
              <button key={s.value} onClick={() => { onChange({ bidStrategy: s.value }); setOpenDD(null); }}
                className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-base text-xs font-medium transition-all ${effectiveCampaignBidStrategy === s.value ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold truncate">{s.label}</p>
                  <p className={`text-[10px] truncate ${effectiveCampaignBidStrategy === s.value ? 'text-neutral-300' : 'text-neutral-400'}`}>{s.desc}</p>
                </div>
                {effectiveCampaignBidStrategy === s.value && <CheckCircle2 size={11} className="shrink-0" />}
              </button>
            ))}
          </Popover>
        </div>
      )}

      {/* Campaign select (新建 / 选已有) — 紧跟 Promote Objective 之后 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-medium text-neutral-500">目标投放系列</label>
          <button onClick={onSelectExistingCampaign} className="flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors">
            <Edit3 size={11} />
            <span className="text-[11px] font-medium">选已有</span>
          </button>
        </div>
        <div className={`flex items-center gap-3 p-3 rounded-inner border-2 transition-all ${isExistingCampaign ? 'bg-primary-50 border-primary-500/20' : 'bg-neutral-50 border-neutral-100'}`}>
          <div className={`w-8 h-8 rounded-base flex items-center justify-center ${isExistingCampaign ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 shadow-adsgo-card'}`}>
            <Briefcase size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{selectedCampaign?.name || '创建全新系列'}</p>
            {isExistingCampaign && <p className="text-[10px] text-primary-500/70 font-medium truncate">{selectedCampaign.id}</p>}
          </div>
        </div>
      </div>

      {/* Daily Budget — 标题 / 投放预算模式 / 数字 三段纵向（避免窄宽挤压） */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">每日预算</label>
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[10px] font-medium text-neutral-400">投放预算模式</span>
          <div className="flex p-0.5 bg-neutral-100/80 rounded-base border border-neutral-100">
            <button
              onClick={() => onChange({ budgetType: 'CBO' })}
              className={`px-2.5 py-0.5 rounded-base text-[10px] font-medium transition-all ${config.budgetType === 'CBO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-neutral-500'}`}
            >CBO</button>
            <button
              onClick={() => onChange({ budgetType: 'ABO' })}
              className={`px-2.5 py-0.5 rounded-base text-[10px] font-medium transition-all ${config.budgetType === 'ABO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-neutral-500'}`}
            >ABO</button>
          </div>
        </div>
        <div className="bg-neutral-50/80 border border-neutral-100 rounded-inner p-3 flex items-center gap-2">
          <DollarSign size={14} className="text-neutral-300 shrink-0" />
          <input
            type="number"
            min={0}
            value={config.dailyBudget ?? ''}
            onChange={(e) => onChange({ dailyBudget: Number(e.target.value) })}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-base font-bold tabular-nums text-neutral-700"
          />
          <span className="text-[10px] font-medium text-neutral-400 whitespace-nowrap">USD/day</span>
        </div>
        {config.budgetType === 'ABO' && (
          <p className="text-[11px] text-neutral-400 font-medium leading-relaxed px-1 flex items-start gap-1">
            <Info size={10} className="text-neutral-300 shrink-0 mt-0.5" />
            <span>ABO 模式下该预算将由 campaign 下所有 adset 均分</span>
          </p>
        )}
      </div>
    </div>
  );
};

const AdsetDetailPanel = ({
  platform,
  campaignIdx, adsetIdx, audienceTypes = ['ADV'], onSetAudienceType, onToggleAudienceType,
  details = {}, onSaveDetails,
  authStatus, handleAuthorize, selectedAccount, onSelectAccount,
  lalLoading, customAudienceLoading, savedAudienceLoading,
  selectedProducts,
  effectiveObjective = '',
  targetingMeta = {},
  globalAdsetGoal = '',
  globalEvent = '',
  globalLocations = [],
  globalLanguage = null,
  effectiveBidStrategy = 'highest_volume',
  globalBidAmount = '',
  globalAgeMin = '', globalAgeMax = '',
  globalGender = 'All',
  globalInterests = [],
  globalLalInclude = [], globalCustomInclude = [],
  globalLalExclude = [], globalCustomExclude = [],
  isTikTokAppSales = false,
  globalCatalog = null,
  catalogs = [],
  adsetCatalog = undefined,
  onSaveAdsetCatalog,
  onAuthorizeChannel,
  onOpenAccountPicker,
  channelAuthLoading = false,
}) => {
  const [showLal, setShowLal] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const catalogTriggerRef = useRef(null);
  const [isMetaConnecting, setIsMetaConnecting] = useState(false);
  const effectiveCatalog = adsetCatalog ?? globalCatalog;
  const isCatalogOverride = adsetCatalog != null && globalCatalog && adsetCatalog.id !== globalCatalog.id;
  // Conversion Event 下拉本地态
  const [showConvDropdown, setShowConvDropdown] = useState(false);
  const [convStage, setConvStage] = useState('goal');
  const [convEventSearch, setConvEventSearch] = useState('');
  // Locations / Language 下拉本地态
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [locSearch, setLocSearch] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const convTriggerRef = useRef(null);
  const locTriggerRef = useRef(null);
  const langTriggerRef = useRef(null);
  const lalTriggerRef = useRef(null);
  const customTriggerRef = useRef(null);
  const savedTriggerRef = useRef(null);

  const platformId = platform?.id || 'meta';
  const platformName = platform?.name || 'Meta';
  const isTikTokPlatform = platformId === 'tiktok';
  const ConnectIcon = isTikTokPlatform ? Smartphone : Facebook;
  const isPlatformAuthed = !!authStatus?.[platformId];

  // Conversion Event 派生：每个 adset 自己 override（details.adsetGoal / details.event），缺省回退到全局
  const { ADSET_GOALS_MAPPING = {}, STANDARD_EVENTS = [], ALL_COUNTRIES = [], ALL_LANGUAGES = [] } = targetingMeta;
  const availableConvGoals = ADSET_GOALS_MAPPING[effectiveObjective] || [];
  const effectiveAdsetGoal = details.adsetGoal !== undefined ? details.adsetGoal : globalAdsetGoal;
  const effectiveAdsetEvent = details.event !== undefined ? details.event : globalEvent;
  const currentConvGoalObj = availableConvGoals.find(g => g.value === effectiveAdsetGoal);
  const filteredConvEvents = STANDARD_EVENTS.filter(ev => ev.toLowerCase().includes(convEventSearch.toLowerCase()));

  // Locations / Language：每个 adset override，缺省回退到全局；toggle/select 通过 onSaveDetails 写回 details
  const effectiveAdsetLocations = details.selectedLocations !== undefined ? details.selectedLocations : globalLocations;
  const effectiveAdsetLanguage = details.selectedLanguage !== undefined ? details.selectedLanguage : globalLanguage;

  // 竞价目标 — Meta：按 effective 策略变形（highest_volume 不渲染）；TikTok：选填，留空 = 默认最大转化量
  const { BID_STRATEGIES: BID_STRATEGIES_META = [] } = targetingMeta;
  const currentBidStrategyMetaObj = BID_STRATEGIES_META.find(s => s.value === effectiveBidStrategy);
  const bidValueType = isTikTokPlatform ? 'currency' : (currentBidStrategyMetaObj?.valueType || 'none');
  const showBidAmountField = isTikTokPlatform || bidValueType !== 'none';
  const effectiveAdsetBidAmount = details.bidAmount !== undefined ? details.bidAmount : globalBidAmount;
  const bidAmountLabel = isTikTokPlatform ? '竞价目标 (选填)'
    : bidValueType === 'roas' ? '目标 ROAS'
    : effectiveBidStrategy === 'cost_cap' ? '单次结果成本上限'
    : '出价上限';
  const filteredAdsetCountries = ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(locSearch.toLowerCase()) || c.code.toLowerCase().includes(locSearch.toLowerCase()));
  const filteredAdsetLanguages = ALL_LANGUAGES.filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.code.toLowerCase().includes(langSearch.toLowerCase()));
  const toggleAdsetLoc = (c) => {
    const arr = effectiveAdsetLocations || [];
    const exists = arr.some(l => l.code === c.code);
    onSaveDetails?.({ selectedLocations: exists ? arr.filter(l => l.code !== c.code) : [...arr, c] });
  };

  const connectMeta = (closeFn) => {
    setIsMetaConnecting(true);
    setTimeout(() => {
      setIsMetaConnecting(false);
      handleAuthorize?.(platformId);
      closeFn?.();
    }, 1500);
  };

  const defaultAdsetName = `Adset ${campaignIdx + 1}.${adsetIdx + 1}`;
  const adsetNameValue = details.adsetName !== undefined ? details.adsetName : defaultAdsetName;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-primary-500/60 tabular-nums">A{campaignIdx + 1}.{adsetIdx + 1}</span>
        <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">Adset {campaignIdx + 1}.{adsetIdx + 1} 配置</h4>
      </div>

      {/* Adset 名称 — editable */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">Adset 名称</label>
        <div className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center gap-2 focus-within:border-primary-500/30 transition-all">
          <Edit3 size={14} className="text-primary-500 shrink-0" />
          <input
            value={adsetNameValue}
            onChange={(e) => onSaveDetails?.({ adsetName: e.target.value })}
            placeholder={defaultAdsetName}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-neutral-700 placeholder-neutral-300"
          />
        </div>
      </div>

      {/* Conversion Event — adset 级 override，objective 由 campaign 决定 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">Conversion Event</label>
        <div
          ref={convTriggerRef}
          onClick={() => {
            if (!effectiveObjective) return;
            setShowConvDropdown(prev => !prev);
            setConvStage('goal');
          }}
          className={`bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 transition-all ${
            effectiveObjective ? 'cursor-pointer hover:border-primary-500/30' : 'opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Target size={14} className="text-primary-500 shrink-0" />
            <span className={`text-sm font-semibold truncate ${effectiveObjective ? 'text-neutral-700' : 'text-neutral-300'}`}>
              {!effectiveObjective
                ? '需先选择 Campaign Objective'
                : (effectiveAdsetEvent || currentConvGoalObj?.label || 'Select...')}
            </span>
          </div>
          <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${showConvDropdown ? 'rotate-180' : ''}`} />
        </div>
        <Popover
          open={showConvDropdown && !!effectiveObjective}
          anchorRef={convTriggerRef}
          placement="bottom-start"
          matchWidth
          onClose={() => setShowConvDropdown(false)}
          className="bg-white rounded-base shadow-xl border border-neutral-100 p-2"
        >
          {convStage === 'goal' && (
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-neutral-400 tracking-widest mb-1 px-1">Conversion Goal</p>
              {availableConvGoals.map(g => (
                <button key={g.value} onClick={() => {
                  const patch = { adsetGoal: g.value, event: g.needsEvent ? (effectiveAdsetEvent || 'Purchase') : '' };
                  onSaveDetails?.(patch);
                  if (g.needsEvent) setConvStage('event'); else setShowConvDropdown(false);
                }} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-base text-xs font-medium transition-all ${effectiveAdsetGoal === g.value ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}>
                  <span className="truncate">{g.label}</span>
                  {g.needsEvent ? <ArrowRight size={10} className="opacity-30" /> : (effectiveAdsetGoal === g.value && <CheckCircle2 size={11} />)}
                </button>
              ))}
            </div>
          )}
          {convStage === 'event' && (
            <div className="space-y-1">
              <button onClick={() => setConvStage('goal')} className="flex items-center gap-1 px-1 py-1 text-[9px] font-bold text-neutral-400 tracking-widest hover:text-neutral-600">
                <ChevronLeft size={10} /> Pixel Event
              </button>
              <input value={convEventSearch} onChange={e => setConvEventSearch(e.target.value)} placeholder="搜索 event..." className="w-full px-2 py-1 bg-neutral-50 rounded-base text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-primary-500/20 mb-1" />
              <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                {filteredConvEvents.map(ev => (
                  <button key={ev} onClick={() => { onSaveDetails?.({ event: ev }); setShowConvDropdown(false); }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-base text-xs font-medium transition-all ${effectiveAdsetEvent === ev ? 'bg-primary-500 text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}>
                    <span>{ev}</span>
                    {effectiveAdsetEvent === ev && <CheckCircle2 size={11} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover>
      </div>

      {/* TikTok + APP + Sales 场景：Catalog adset-level override */}
      {isTikTokAppSales && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium text-neutral-500">Catalog</label>
            {isCatalogOverride && (
              <button
                type="button"
                onClick={() => onSaveAdsetCatalog?.(adsetIdx, null)}
                className="text-[10px] font-bold text-primary-500 hover:text-primary-600"
                title="清除该 adset 的 catalog override，恢复继承全局值"
              >
                恢复继承
              </button>
            )}
          </div>
          <div
            ref={catalogTriggerRef}
            onClick={() => {
              if (!authStatus?.tiktok) { onAuthorizeChannel?.('tiktok'); return; }
              if (!selectedAccount) { onOpenAccountPicker?.(); return; }
              setShowCatalog(prev => !prev);
            }}
            className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Database size={14} className="text-primary-500 shrink-0" />
              {!authStatus?.tiktok ? (
                <span className="text-sm font-semibold text-neutral-300 truncate">请连接 TikTok 加载 catalog</span>
              ) : !selectedAccount ? (
                <span className="text-sm font-semibold text-neutral-300 truncate">请选择 TikTok 账号</span>
              ) : channelAuthLoading ? (
                <span className="text-sm font-semibold text-neutral-400 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> 加载中…</span>
              ) : effectiveCatalog ? (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-700 truncate">{effectiveCatalog.name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium truncate">ID {effectiveCatalog.id} · {effectiveCatalog.productCount} 件 {isCatalogOverride ? '· override' : '· 继承全局'}</p>
                </div>
              ) : (
                <span className="text-sm font-semibold text-neutral-300">未选择</span>
              )}
            </div>
            <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${showCatalog ? 'rotate-180' : ''}`} />
          </div>
          <Popover
            open={showCatalog && !!authStatus?.tiktok && !!selectedAccount}
            anchorRef={catalogTriggerRef}
            placement="bottom-start"
            matchWidth
            onClose={() => setShowCatalog(false)}
            className="bg-white border border-neutral-100 rounded-base shadow-xl overflow-hidden p-1"
          >
            {catalogs.map(c => {
              const isSel = effectiveCatalog?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { onSaveAdsetCatalog?.(adsetIdx, c); setShowCatalog(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-base text-left transition-all ${isSel ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}
                >
                  <div className={`w-7 h-7 rounded-base flex items-center justify-center shrink-0 ${isSel ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500'}`}>
                    <Database size={12} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSel ? 'text-primary-600' : 'text-neutral-800'}`}>{c.name}</p>
                    <p className="text-[10px] text-neutral-400 font-medium truncate">ID {c.id}</p>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-tag bg-success-50 text-success-600 border border-success-100 shrink-0">{c.productCount}</span>
                  {isSel && <CheckCircle2 size={12} className="text-primary-500 shrink-0" />}
                </button>
              );
            })}
          </Popover>
        </div>
      )}

      {/* 竞价目标 — Meta：按 effective bidStrategy 变形（highest_volume 不渲染）；TikTok：选填金额 */}
      {showBidAmountField && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500 px-1">{bidAmountLabel}</label>
          <div className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center gap-2 focus-within:border-primary-500/30 transition-all">
            {bidValueType === 'roas' ? (
              <Target size={14} className="text-primary-500 shrink-0" />
            ) : (
              <DollarSign size={14} className="text-primary-500 shrink-0" />
            )}
            <input
              type="number"
              min={0}
              step={bidValueType === 'roas' ? 0.1 : 0.01}
              value={effectiveAdsetBidAmount ?? ''}
              onChange={(e) => onSaveDetails?.({ bidAmount: e.target.value })}
              placeholder={bidValueType === 'roas' ? '如 2.5' : '0.00'}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-neutral-700 tabular-nums"
            />
            <span className="text-[10px] font-medium text-neutral-400 whitespace-nowrap shrink-0">
              {bidValueType === 'roas' ? '×' : 'USD'}
            </span>
          </div>
          {isTikTokPlatform && (
            <p className="text-[11px] text-neutral-400 font-medium px-1">留空 = 默认最大转化量</p>
          )}
        </div>
      )}

      {/* 投放国家/地区 — 每个 adset 独立 override，缺省取全局值 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">投放国家/地区</label>
        <div ref={locTriggerRef} onClick={() => setShowLocDropdown(prev => !prev)}
          className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MapPin size={14} className="text-primary-500 shrink-0" />
            {(effectiveAdsetLocations || []).length > 0
              ? <span className="text-sm font-semibold text-neutral-700 truncate">{effectiveAdsetLocations[0].name}{effectiveAdsetLocations.length > 1 && ` +${effectiveAdsetLocations.length - 1}`}</span>
              : <span className="text-sm font-semibold text-neutral-300">待选择...</span>}
          </div>
          <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${showLocDropdown ? 'rotate-180' : ''}`} />
        </div>
        <Popover
          open={showLocDropdown}
          anchorRef={locTriggerRef}
          placement="bottom-start"
          matchWidth
          onClose={() => setShowLocDropdown(false)}
          className="bg-white rounded-base shadow-xl border border-neutral-100 overflow-hidden"
        >
          <div className="p-2 border-b border-neutral-50">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input value={locSearch} onChange={e => setLocSearch(e.target.value)} placeholder="搜索国家..." className="w-full pl-7 pr-2 py-1.5 bg-neutral-50 border-none rounded-base text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-primary-500/10" />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {filteredAdsetCountries.map(c => {
              const checked = (effectiveAdsetLocations || []).some(l => l.code === c.code);
              return (
                <button key={c.code} onClick={() => toggleAdsetLoc(c)} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-base text-xs font-medium transition-all ${checked ? 'bg-primary-50 text-primary-500' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                  {c.name}
                  {checked && <Check size={11} />}
                </button>
              );
            })}
          </div>
        </Popover>
      </div>

      {/* Language — 每个 adset 独立 override */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">Language</label>
        <div ref={langTriggerRef} onClick={() => setShowLangDropdown(prev => !prev)}
          className="bg-white rounded-inner p-3 border border-neutral-100 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Globe size={14} className="text-primary-500 shrink-0" />
            <span className={`text-sm font-semibold truncate ${effectiveAdsetLanguage ? 'text-neutral-700' : 'text-neutral-300'}`}>{effectiveAdsetLanguage?.name || 'Auto...'}</span>
          </div>
          <ChevronDown size={12} className={`text-neutral-300 shrink-0 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
        </div>
        <Popover
          open={showLangDropdown}
          anchorRef={langTriggerRef}
          placement="bottom-start"
          matchWidth
          onClose={() => setShowLangDropdown(false)}
          className="bg-white rounded-base shadow-xl border border-neutral-100 overflow-hidden"
        >
          <div className="p-2 border-b border-neutral-50">
            <input value={langSearch} onChange={e => setLangSearch(e.target.value)} placeholder="搜索语言..." className="w-full px-2 py-1.5 bg-neutral-50 border-none rounded-base text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-primary-500/10" />
          </div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {filteredAdsetLanguages.map(l => (
              <button key={l.code} onClick={() => { onSaveDetails?.({ selectedLanguage: l }); setShowLangDropdown(false); }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-base text-xs font-medium transition-all ${effectiveAdsetLanguage?.code === l.code ? 'bg-primary-50 text-primary-500' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                {l.name}
                {effectiveAdsetLanguage?.code === l.code && <Check size={11} />}
              </button>
            ))}
          </div>
        </Popover>
      </div>

      {/* 受众策略（多选）— 提到顶部，每勾选一项追加渲染对应子组件；TikTok 不支持 Advantage+ */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500 px-1">受众策略</label>
        <div className={`grid gap-2 ${isTikTokPlatform ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {[
            { id: 'ADV', label: 'Advantage+', cls: 'bg-primary-50 border-primary-500 text-primary-600' },
            { id: 'LAL', label: 'Lookalike',  cls: 'bg-purple-50 border-purple-500 text-purple-600' },
            { id: 'INT', label: 'Interest',   cls: 'bg-warning-50 border-warning-500 text-warning-600' },
          ].filter(opt => !(isTikTokPlatform && opt.id === 'ADV')).map(opt => {
            const active = (audienceTypes || []).includes(opt.id);
            return (
              <button key={opt.id}
                onClick={() => onToggleAudienceType?.(opt.id)}
                className={`p-2 rounded-base border-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${active ? opt.cls : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-200'}`}>
                {active && <Check size={11} strokeWidth={3} className="shrink-0" />}
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-neutral-400 px-1">可多选 · 每选 1 项将追加对应配置组件</p>
      </div>

      {/* ADV — 不需配置 */}
      {(audienceTypes || []).includes('ADV') && (
        <p className="text-xs text-neutral-400 font-medium leading-relaxed px-1">
          Advantage+ 自动扩展，无需额外配置。
        </p>
      )}

      {/* LAL — 包含 + 排除 + Saved Audience */}
      {(audienceTypes || []).includes('LAL') && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* 包含受众（Lookalike + Custom 合并 tab） */}
          <IncludeExcludeAudienceDropdown
            triggerLabel="包含受众"
            open={showLal}
            onToggle={() => setShowLal(!showLal)}
            lalSelected={details.lalInclude !== undefined ? details.lalInclude : globalLalInclude}
            customSelected={details.customInclude !== undefined ? details.customInclude : globalCustomInclude}
            onToggleLal={(id) => {
              const cur = details.lalInclude !== undefined ? details.lalInclude : globalLalInclude;
              const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
              onSaveDetails?.({ lalInclude: next });
            }}
            onToggleCustom={(id) => {
              const cur = details.customInclude !== undefined ? details.customInclude : globalCustomInclude;
              const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
              onSaveDetails?.({ customInclude: next });
            }}
            authStatus={authStatus} platform={platform}
            selectedAccount={selectedAccount}
            onAuthorize={(pid) => handleAuthorize?.(pid)}
            onPickAccount={onSelectAccount}
            align="left"
          />

          {/* 排除受众（Lookalike + Custom 合并 tab） */}
          <IncludeExcludeAudienceDropdown
            triggerLabel="排除受众"
            open={showCustom}
            onToggle={() => setShowCustom(!showCustom)}
            lalSelected={details.lalExclude !== undefined ? details.lalExclude : globalLalExclude}
            customSelected={details.customExclude !== undefined ? details.customExclude : globalCustomExclude}
            onToggleLal={(id) => {
              const cur = details.lalExclude !== undefined ? details.lalExclude : globalLalExclude;
              const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
              onSaveDetails?.({ lalExclude: next });
            }}
            onToggleCustom={(id) => {
              const cur = details.customExclude !== undefined ? details.customExclude : globalCustomExclude;
              const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
              onSaveDetails?.({ customExclude: next });
            }}
            authStatus={authStatus} platform={platform}
            selectedAccount={selectedAccount}
            onAuthorize={(pid) => handleAuthorize?.(pid)}
            onPickAccount={onSelectAccount}
            align="left"
          />

          {/* 旧 Lookalike Audience 段已被「包含受众」覆盖；以下保留 Saved Audience 不变 */}
          <div className="hidden space-y-1.5">
            <p className="text-xs font-semibold text-purple-500 px-1">Lookalike Audience</p>
            <div ref={lalTriggerRef} onClick={() => setShowLal(!showLal)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {(details.lalOptions || []).length === 0
                  ? <span className="text-xs font-bold text-neutral-300">选择...</span>
                  : (details.lalOptions || []).map(opt => <span key={opt} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium border border-purple-100">{opt.split(' ')[1] || opt}</span>)
                }
              </div>
              <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showLal ? 'rotate-180' : ''}`} />
            </div>
            <Popover
              open={showLal}
              anchorRef={lalTriggerRef}
              placement="bottom-start"
              matchWidth
              onClose={() => setShowLal(false)}
              className="bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden"
            >
              {!isPlatformAuthed ? (
                <div className="p-4">
                  <button onClick={() => connectMeta(() => setShowLal(false))} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><ConnectIcon size={12} />立即连接 {platformName}</>}
                  </button>
                </div>
              ) : !selectedAccount ? (
                <div className="p-4">
                  <button onClick={() => { onSelectAccount?.(); setShowLal(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                    <Briefcase size={12} />选择广告账户
                  </button>
                </div>
              ) : lalLoading?.isLoading ? (
                <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-neutral-400 animate-pulse">Loading...</p></div>
              ) : (
                ['US Purchase 1%', 'US add to cart 5%', 'US register last30days 1%~3%'].map(opt => {
                  const cur = details.lalOptions || [];
                  const isSel = cur.includes(opt);
                  return (
                    <div key={opt} onClick={() => { const next = isSel ? cur.filter(o => o !== opt) : [...cur, opt]; onSaveDetails({ lalOptions: next }); }} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors">
                      <span className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-neutral-700'}`}>{opt}</span>
                      {isSel && <Check size={12} className="text-purple-600" />}
                    </div>
                  );
                })
              )}
            </Popover>
          </div>

          {/* Custom Audience — legacy 段已被「包含受众」共享组件覆盖；隐藏待清理 */}
          <div className="hidden space-y-1.5">
            <p className="text-xs font-semibold text-purple-500 px-1">Custom Audience</p>
            <div ref={customTriggerRef} onClick={() => setShowCustom(!showCustom)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {(details.customAudienceOptions || []).length === 0
                  ? <span className="text-xs font-bold text-neutral-300">选择...</span>
                  : (details.customAudienceOptions || []).map(opt => <span key={opt} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium border border-purple-100">{opt}</span>)
                }
              </div>
              <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
            </div>
            <Popover
              open={showCustom}
              anchorRef={customTriggerRef}
              placement="bottom-start"
              matchWidth
              onClose={() => setShowCustom(false)}
              className="bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden"
            >
              {!isPlatformAuthed ? (
                <div className="p-4">
                  <button onClick={() => connectMeta(() => setShowCustom(false))} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><ConnectIcon size={12} />立即连接 {platformName}</>}
                  </button>
                </div>
              ) : !selectedAccount ? (
                <div className="p-4">
                  <button onClick={() => { onSelectAccount?.(); setShowCustom(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                    <Briefcase size={12} />选择广告账户
                  </button>
                </div>
              ) : customAudienceLoading?.isLoading ? (
                <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-neutral-400 animate-pulse">Loading...</p></div>
              ) : (
                MOCK_CUSTOM_AUDIENCES.map(opt => {
                  const cur = details.customAudienceOptions || [];
                  const isSel = cur.includes(opt);
                  return (
                    <div key={opt} onClick={() => { const next = isSel ? cur.filter(o => o !== opt) : [...cur, opt]; onSaveDetails({ customAudienceOptions: next }); }} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors">
                      <span className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-neutral-700'}`}>{opt}</span>
                      {isSel && <Check size={12} className="text-purple-600" />}
                    </div>
                  );
                })
              )}
            </Popover>
          </div>

          {/* Saved Audience —— TikTok 不支持，整段隐藏 */}
          {!isTikTokPlatform && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-purple-500 px-1">Saved Audience</p>
              <div ref={savedTriggerRef} onClick={() => setShowSaved(!showSaved)} className="w-full p-3 bg-white border-2 border-purple-100 rounded-base flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all min-h-[44px]">
                <span className={`text-[10px] font-bold truncate ${details.savedAudience ? 'text-purple-700' : 'text-neutral-300'}`}>
                  {details.savedAudience ? details.savedAudience.name : '选择...'}
                </span>
                <ChevronDown size={12} className={`text-purple-300 shrink-0 transition-transform ${showSaved ? 'rotate-180' : ''}`} />
              </div>
              <Popover
                open={showSaved}
                anchorRef={savedTriggerRef}
                placement="bottom-start"
                matchWidth
                onClose={() => setShowSaved(false)}
                className="bg-white border border-purple-100 rounded-section shadow-xl overflow-hidden"
              >
                {!isPlatformAuthed ? (
                  <div className="p-4">
                    <button onClick={() => connectMeta(() => setShowSaved(false))} disabled={isMetaConnecting} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                      {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" />Connecting...</> : <><ConnectIcon size={12} />立即连接 {platformName}</>}
                    </button>
                  </div>
                ) : !selectedAccount ? (
                  <div className="p-4">
                    <button onClick={() => { onSelectAccount?.(); setShowSaved(false); }} className="w-full py-3 bg-primary-500 text-white rounded-base text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                      <Briefcase size={12} />选择广告账户
                    </button>
                  </div>
                ) : savedAudienceLoading?.isLoading ? (
                  <div className="p-5 flex flex-col items-center gap-2"><Loader2 size={18} className="animate-spin text-purple-500/70" /><p className="text-xs text-neutral-400 animate-pulse">Loading...</p></div>
                ) : (
                  MOCK_SAVED_AUDIENCES.map(sa => {
                    const isSel = details.savedAudience?.id === sa.id;
                    return (
                      <div key={sa.id} onClick={() => { onSaveDetails({ savedAudience: isSel ? null : sa }); setShowSaved(false); }} className="flex items-start justify-between px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors">
                        <div>
                          <p className={`text-xs font-medium ${isSel ? 'text-purple-700' : 'text-neutral-700'}`}>{sa.name}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{sa.gender} · {sa.ageMin}–{sa.ageMax}</p>
                        </div>
                        {isSel && <Check size={12} className="text-purple-600 shrink-0 mt-0.5" />}
                      </div>
                    );
                  })
                )}
              </Popover>
            </div>
          )}
        </div>
      )}

      {/* INT — Interest selector */}
      {(audienceTypes || []).includes('INT') && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-150">
          <IntInterestSelector
            intOptions={details.intOptions || []}
            onIntOptionsChange={(next) => onSaveDetails({ intOptions: next })}
            productAnalyses={null}
            allAnalysesComplete={false}
            selectedProducts={selectedProducts}
          />
        </div>
      )}

    </div>
  );
};

const CampaignPlanView = forwardRef(({
  platform,
  structure,
  onStructureChange,
  campaignType,
  budgetType,
  onBudgetTypeChange,
  dailyBudget,
  onBudgetChange,
  adsetAudiences,
  onToggleAudience,
  onSetAudienceType,
  adsetAudienceDetails = {},
  onSaveAdsetAudienceDetails,
  adType = 'SINGLE',
  onAdTypeChange,
  objective = '',
  selectedProducts,
  productCreativesMap,
  productCreativeGroups = {},
  sectionDefaults = {},
  targetingMeta = {},
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
  adsetAds: adsetAdsProp,
  setAdsetAds: setAdsetAdsProp,
  campaignConfigs: campaignConfigsProp,
  setCampaignConfigs: setCampaignConfigsProp,
  placementOptions = [],
  defaultPlacements = [],
  isTikTokAppSales = false,
  globalCatalog = null,
  catalogs = [],
  adsetCatalogMap = {},
  onSaveAdsetCatalog,
  onAuthorizeChannel,
  onOpenAccountPicker,
  channelAuthLoading = false,
}, ref) => {
  const [adsetPlacementsMap, setAdsetPlacementsMap] = useState({});
  const [showLalDropdown, setShowLalDropdown] = useState(false);
  const [showCustomAudienceDropdown, setShowCustomAudienceDropdown] = useState(false);
  const [showSavedAudienceDropdown, setShowSavedAudienceDropdown] = useState(false);
  const [editingAdsetIndex, setEditingAdsetIndex] = useState(null);
  const [isMetaConnecting, setIsMetaConnecting] = useState(false);
  const planPlatformId        = platform?.id || 'meta';
  const lalLoading            = useDropdownLoading('lalAudiences',     authStatus?.[planPlatformId]);
  const customAudienceLoading = useDropdownLoading('customAudiences',  authStatus?.[planPlatformId]);
  const savedAudienceLoading  = useDropdownLoading('savedAudiences',   authStatus?.[planPlatformId]);
  useEffect(() => { if (showLalDropdown            && selectedAccount) lalLoading.triggerLoad();            }, [showLalDropdown]);
  useEffect(() => { if (showCustomAudienceDropdown && selectedAccount) customAudienceLoading.triggerLoad(); }, [showCustomAudienceDropdown]);
  useEffect(() => { if (showSavedAudienceDropdown  && selectedAccount) savedAudienceLoading.triggerLoad();  }, [showSavedAudienceDropdown]);
  const [showNumAdsetsDropdown, setShowNumAdsetsDropdown] = useState(false);
  const [focusedAdsetIdx, setFocusedAdsetIdx] = useState(0);

  // ── New state: multi-campaign tree + per-adset ad list + selected node + per-campaign config ──
  // adsetAds / campaignConfigs 由父组件 BatchGenerateAds 提供（state lifted up），
  // 避免 view 切到 preview 再返回时本地 state 被卸载而丢失已配置的 ads / configs。
  const [adsetAdsLocal, setAdsetAdsLocal] = useState({});
  const adsetAds = adsetAdsProp !== undefined ? adsetAdsProp : adsetAdsLocal;
  const setAdsetAds = setAdsetAdsProp || setAdsetAdsLocal;
  // shape: { [`${campaignIdx}::${adsetIdx}`]: [{ id, productId, groupId, groupName, creatives: [...] }] }
  const [hoveredAdsetKey, setHoveredAdsetKey] = useState(null);
  // 校验态：未添加素材组的 adset key 集合（`${cIdx}::${aIdx}`），由 validateAdsets() 触发，drop 后自动清除
  const [errorAdsetKeys, setErrorAdsetKeys] = useState({});
  const adsetRowRefs = useRef({});
  const [selectedNode, setSelectedNode] = useState({ type: 'campaign', campaignIdx: 0 });
  const [campaignConfigsLocal, setCampaignConfigsLocal] = useState({});
  const campaignConfigs = campaignConfigsProp !== undefined ? campaignConfigsProp : campaignConfigsLocal;
  const setCampaignConfigs = setCampaignConfigsProp || setCampaignConfigsLocal;
  // shape: { [campaignIdx]: { selectedLocations, selectedLanguage, objective, adsetGoal, event, dailyBudget, selectedCampaignId, budgetType } }
  const [campaignDropdown, setCampaignDropdown] = useState(null); // 'location' | 'language' | 'objective' | null
  const [campaignObjectiveStage, setCampaignObjectiveStage] = useState('objective');

  // Lazy fallback：未编辑过的 campaign idx 实时回退到当前 sectionDefaults，
  // 用户首次在 CampaignDetailPanel 编辑时才把值固化进 campaignConfigs。
  // 这样既满足"初始化透传顶部已选值"，又不破坏"已自定义 campaign 不被顶部覆盖"的语义。
  const buildDefaultCampaignConfig = useCallback(() => ({
    selectedLocations: [...(sectionDefaults.selectedLocations || [])],
    selectedLanguage: sectionDefaults.selectedLanguage || null,
    objective: sectionDefaults.objective || '',
    adsetGoal: sectionDefaults.adsetGoal || '',
    event: sectionDefaults.event || '',
    dailyBudget: sectionDefaults.dailyBudget ?? 50,
    budgetType: sectionDefaults.budgetType || 'CBO',
    selectedCampaignId: null,
  }), [sectionDefaults]);

  const getCampaignConfig = useCallback(
    (cIdx) => campaignConfigs[cIdx] || buildDefaultCampaignConfig(),
    [campaignConfigs, buildDefaultCampaignConfig]
  );

  // 当 numCampaigns 缩小时，清理被删除 idx 的残留 config（避免 stale state 占用内存）
  useEffect(() => {
    setCampaignConfigs(prev => {
      const N = Math.max(structure.numCampaigns || 1, 1);
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach(k => {
        if (Number(k) >= N) { delete next[k]; changed = true; }
      });
      return changed ? next : prev;
    });
  }, [structure.numCampaigns]);

  const updateCampaignConfig = (campaignIdx, patch) => {
    setCampaignConfigs(prev => ({
      ...prev,
      [campaignIdx]: { ...(prev[campaignIdx] || buildDefaultCampaignConfig()), ...patch },
    }));
    // Cascade：当 campaign objective 变更时，清空该 campaign 下所有 adset 的 adsetGoal / event override，
    // 让它们 fallback 到新 objective 的 first goal / first event（依据用户决策）。
    if (patch.objective !== undefined) {
      const N = adSetGroups.length || 1;
      for (let aIdx = 0; aIdx < N; aIdx++) {
        const flatIdx = campaignIdx * N + aIdx;
        const existing = adsetAudienceDetails[flatIdx] || {};
        if (existing.adsetGoal !== undefined || existing.event !== undefined) {
          const { adsetGoal: _g, event: _e, ...rest } = existing;
          onSaveAdsetAudienceDetails?.(flatIdx, rest);
        }
      }
    }
    // Cascade：当 campaign bidStrategy 变更时，清空该 campaign 下所有 adset 的 bidAmount override
    if (patch.bidStrategy !== undefined) {
      const N = adSetGroups.length || 1;
      for (let aIdx = 0; aIdx < N; aIdx++) {
        const flatIdx = campaignIdx * N + aIdx;
        const existing = adsetAudienceDetails[flatIdx] || {};
        if (existing.bidAmount !== undefined) {
          const { bidAmount: _b, ...rest } = existing;
          onSaveAdsetAudienceDetails?.(flatIdx, rest);
        }
      }
    }
  };

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

  // ── New: build N-Campaign tree — 每个 campaign adset 数支持 per-campaign override (campaignConfigs[c].adsetCount) ──
  // STRIPE = 100，避免不同 campaign override 时 flatIdx 重叠
  const STRIPE_PER_CAMPAIGN = 100;
  const flatIdxFor = (cIdx, aIdx) => cIdx * STRIPE_PER_CAMPAIGN + aIdx;
  const numCampaigns = Math.max(structure.numCampaigns || 1, 1);
  const defaultAdsetsPerCampaign = Math.max(structure.numAdsets || adSetGroups.length || 1, 1);
  const getAdsetsForCampaign = (cIdx) =>
    Math.max(campaignConfigs[cIdx]?.adsetCount ?? defaultAdsetsPerCampaign, 1);
  const campaignTrees = Array.from({ length: numCampaigns }, (_, cIdx) => {
    const count = getAdsetsForCampaign(cIdx);
    const adsets = Array.from({ length: count }, (_, aIdx) => {
      const base = adSetGroups[aIdx] || { name: `混合组 ${aIdx + 1}`, ads: selectedProducts.flatMap(p => productCreativesMap[p.id] || []) };
      return { ...base, campaignIdx: cIdx, adsetIdx: aIdx, key: `${cIdx}::${aIdx}` };
    });
    return { campaignIdx: cIdx, adsets };
  });
  const numAdsPerAdset = Math.max(structure.numAdsPerAdset || 1, 1);

  // 暴露 validateAdsets() 给父组件，用于"预览发布计划"前命令式校验。
  // 返回 { ok: boolean }；ok=false 时已自行将所有空 adset 标记为红框 + 滚动到第一个空 adset。
  useImperativeHandle(ref, () => ({
    validateAdsets: () => {
      // CATALOG（DPA）类型不需要素材，所有 adset 直接视为已就绪
      if (campaignType === 'CATALOG') {
        setErrorAdsetKeys({});
        return { ok: true };
      }
      const empties = [];
      campaignTrees.forEach(tree => {
        tree.adsets.forEach(adset => {
          const key = `${tree.campaignIdx}::${adset.adsetIdx}`;
          if (!(adsetAds[key] && adsetAds[key].length > 0)) {
            empties.push({ cIdx: tree.campaignIdx, aIdx: adset.adsetIdx, key });
          }
        });
      });
      if (empties.length === 0) {
        setErrorAdsetKeys({});
        return { ok: true };
      }
      const errMap = {};
      empties.forEach(e => { errMap[e.key] = true; });
      setErrorAdsetKeys(errMap);
      const firstEl = adsetRowRefs.current[empties[0].key];
      if (firstEl && typeof firstEl.scrollIntoView === 'function') {
        firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return { ok: false };
    },
  }), [campaignTrees, adsetAds]);

  // Drop a creative group onto an adset → 按 adType 拆分成 N 个 ad，prepend 到该 adset 的 ads 列表（左侧靠近 drop zone）
  const handleDropGroupToAdset = (campaignIdx, adsetIdx, payload) => {
    if (!payload?.productId || !payload?.groupId) return;
    const groups = productCreativeGroups?.[payload.productId] || [];
    const group = groups.find(g => g.id === payload.groupId);
    if (!group) return;
    const creatives = group.ads || [];
    if (creatives.length === 0) return;
    const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newAds = adType === 'FLEXIBLE'
      ? [{ id: `ad-${baseId}`, productId: payload.productId, groupId: payload.groupId, groupName: group.name, creatives }]
      : creatives.map((c, i) => ({ id: `ad-${baseId}-${i}-${c.id}`, productId: payload.productId, groupId: payload.groupId, groupName: group.name, creatives: [c] }));
    // 同 adset 内同 (productId, groupId) 重拖 = 覆盖：先清掉旧的、再 prepend 新的。
    // 这样用户在顶部素材组追加 / 删除创意后，只需把素材组重新拖一次即可"刷新"该 adset 的 ad 列表。
    setAdsetAds(prev => {
      const key = `${campaignIdx}::${adsetIdx}`;
      const oldList = prev[key] || [];
      const filtered = oldList.filter(a => !(a.productId === payload.productId && a.groupId === payload.groupId));
      return { ...prev, [key]: [...newAds, ...filtered] };
    });
    // 清除该 adset 的错误高亮（如果存在）
    setErrorAdsetKeys(prev => {
      const key = `${campaignIdx}::${adsetIdx}`;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const removeAdFromAdset = (campaignIdx, adsetIdx, adId) => {
    setAdsetAds(prev => ({
      ...prev,
      [`${campaignIdx}::${adsetIdx}`]: (prev[`${campaignIdx}::${adsetIdx}`] || []).filter(a => a.id !== adId),
    }));
  };
  // 一键清空一个 adset 中属于某 (productId, groupId) 的所有 ad（"清理掉这个素材组"操作）
  const removeAllAdsOfGroup = (campaignIdx, adsetIdx, productId, groupId) => {
    setAdsetAds(prev => ({
      ...prev,
      [`${campaignIdx}::${adsetIdx}`]: (prev[`${campaignIdx}::${adsetIdx}`] || []).filter(
        a => !(a.productId === productId && a.groupId === groupId)
      ),
    }));
  };
  // 注：ad 级别的"复制"按钮已下线 — 同一图片复制无意义，使用方需要"再来一份"应通过素材组层面操作。
  const getAdsForAdset = (campaignIdx, adsetIdx) => adsetAds[`${campaignIdx}::${adsetIdx}`] || [];
  // 渲染时把 adset 内的 ads 按 (productId, groupId) 聚合，每个素材组成为一张可视卡片
  const groupAdsByGroup = (ads) => {
    const map = new Map();
    (ads || []).forEach(ad => {
      const key = `${ad.productId}::${ad.groupId}`;
      if (!map.has(key)) {
        map.set(key, { productId: ad.productId, groupId: ad.groupId, groupName: ad.groupName, ads: [] });
      }
      map.get(key).ads.push(ad);
    });
    return Array.from(map.values());
  };
  // 反查产品名（素材组卡片头部显示用）
  const productNameById = useMemo(() => {
    const m = {};
    (selectedProducts || []).forEach(p => { if (p && p.id != null) m[p.id] = p.name; });
    return m;
  }, [selectedProducts]);

  // ── CRUD handlers — adset 数量统一由 structure.numAdsets 控制 ──

  const addCampaign = () => {
    onStructureChange({ ...structure, numCampaigns: numCampaigns + 1 });
  };
  // 删除任意 idx 的 campaign，后续 idx 整体前移
  const deleteCampaignAt = (delIdx) => {
    if (numCampaigns <= 1) return;
    setAdsetAds(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const [c, a] = k.split('::');
        const cn = Number(c);
        if (cn === delIdx) return;
        const newC = cn > delIdx ? cn - 1 : cn;
        next[`${newC}::${a}`] = prev[k];
      });
      return next;
    });
    setCampaignConfigs(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const idx = Number(k);
        if (idx === delIdx) return;
        next[idx > delIdx ? idx - 1 : idx] = prev[k];
      });
      return next;
    });
    if (selectedNode.type === 'campaign') {
      if (selectedNode.campaignIdx === delIdx) setSelectedNode({ type: 'campaign', campaignIdx: 0 });
      else if (selectedNode.campaignIdx > delIdx) setSelectedNode(prev => ({ ...prev, campaignIdx: prev.campaignIdx - 1 }));
    } else if (selectedNode.type === 'adset') {
      if (selectedNode.campaignIdx === delIdx) setSelectedNode({ type: 'campaign', campaignIdx: 0 });
      else if (selectedNode.campaignIdx > delIdx) setSelectedNode(prev => ({ ...prev, campaignIdx: prev.campaignIdx - 1 }));
    }
    onStructureChange({ ...structure, numCampaigns: numCampaigns - 1 });
  };
  const duplicateCampaign = (srcIdx, mode /* 'full' | 'structure' */) => {
    const newIdx = numCampaigns;
    const srcCfg = campaignConfigs[srcIdx];
    if (srcCfg) {
      setCampaignConfigs(prev => ({
        ...prev,
        [newIdx]: {
          ...srcCfg,
          selectedLocations: [...(srcCfg.selectedLocations || [])],
        },
      }));
    }
    if (mode === 'full') {
      setAdsetAds(prev => {
        const next = { ...prev };
        Object.keys(prev).forEach(k => {
          if (k.startsWith(`${srcIdx}::`)) {
            const tail = k.slice(`${srcIdx}::`.length);
            next[`${newIdx}::${tail}`] = (prev[k] || []).map(ad => ({ ...ad, id: `${ad.id}-clone-${newIdx}`, creatives: [...ad.creatives] }));
          }
        });
        return next;
      });
    }
    onStructureChange({ ...structure, numCampaigns: numCampaigns + 1 });
    setDuplicateMenuFor(null);
  };

  // 仅作用于该 campaign — 不再修改全局 structure.numAdsets（用户在某 campaign 点新增就只新增哪个）
  const addAdset = (cIdx = selectedNode.campaignIdx ?? 0) => {
    setCampaignConfigs(prev => {
      const cur = prev[cIdx] || {};
      const baseCount = cur.adsetCount ?? defaultAdsetsPerCampaign;
      return { ...prev, [cIdx]: { ...cur, adsetCount: baseCount + 1 } };
    });
  };
  // 仅删该 campaign 内的指定 adset；reindex 该 campaign 内的 ad list；其他 campaign 不动。
  const deleteAdsetAt = (cIdx, delAdsetIdx) => {
    const curCount = getAdsetsForCampaign(cIdx);
    if (curCount <= 1) return;
    setAdsetAds(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const [c, a] = k.split('::');
        const cn = Number(c), an = Number(a);
        if (cn === cIdx && an === delAdsetIdx) return; // drop deleted
        if (cn === cIdx && an > delAdsetIdx) {
          next[`${cn}::${an - 1}`] = prev[k]; // shift down within this campaign
        } else {
          next[k] = prev[k]; // other campaigns unchanged
        }
      });
      return next;
    });
    if (selectedNode.type === 'adset' && selectedNode.campaignIdx === cIdx) {
      if (selectedNode.adsetIdx === delAdsetIdx) setSelectedNode({ type: 'campaign', campaignIdx: cIdx });
      else if (selectedNode.adsetIdx > delAdsetIdx) setSelectedNode(prev => ({ ...prev, adsetIdx: prev.adsetIdx - 1 }));
    }
    setCampaignConfigs(prev => {
      const cur = prev[cIdx] || {};
      return { ...prev, [cIdx]: { ...cur, adsetCount: Math.max(curCount - 1, 1) } };
    });
  };
  const duplicateAdset = (cIdx, srcAdsetIdx) => {
    const newAdsetIdx = getAdsetsForCampaign(cIdx);
    setAdsetAds(prev => {
      const srcList = prev[`${cIdx}::${srcAdsetIdx}`] || [];
      const cloned = srcList.map(ad => ({ ...ad, id: `${ad.id}-clone-${newAdsetIdx}`, creatives: [...ad.creatives] }));
      return { ...prev, [`${cIdx}::${newAdsetIdx}`]: cloned };
    });
    setCampaignConfigs(prev => {
      const cur = prev[cIdx] || {};
      return { ...prev, [cIdx]: { ...cur, adsetCount: newAdsetIdx + 1 } };
    });
  };
  // 受众策略多选数组；兼容旧 string 形态。
  // 默认 fallback：当 adset 自身未设过策略时，根据平台 + 02 globals 决定初始值
  //   - Meta + 02 包含/排除非空 → ['ADV', 'LAL']
  //   - Meta + 02 包含/排除全空 → ['ADV']
  //   - TikTok + 02 包含/排除非空 → ['LAL']
  //   - TikTok + 02 包含/排除全空 → ['LAL']（TikTok 无 ADV）
  const getDefaultAudienceTypes = () => {
    const isTikTokP = platform?.id === 'tiktok';
    const hasAudPreset = (sectionDefaults?.lalInclude?.length || 0) > 0
                       || (sectionDefaults?.customInclude?.length || 0) > 0
                       || (sectionDefaults?.lalExclude?.length || 0) > 0
                       || (sectionDefaults?.customExclude?.length || 0) > 0;
    if (isTikTokP) return ['LAL'];
    return hasAudPreset ? ['ADV', 'LAL'] : ['ADV'];
  };
  const getAudienceTypes = (campaignIdx, adsetIdx) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    const raw = adsetAudiences[flatIdx];
    if (Array.isArray(raw)) return raw.length > 0 ? raw : getDefaultAudienceTypes();
    if (typeof raw === 'string' && raw) return [raw];
    return getDefaultAudienceTypes();
  };
  const toggleAudienceFor = (campaignIdx, adsetIdx) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    onToggleAudience(flatIdx);
  };
  const toggleAudienceTypeFor = (campaignIdx, adsetIdx, type) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    if (onToggleAudience) onToggleAudience(flatIdx, type);
  };
  const setAudienceTypeFor = (campaignIdx, adsetIdx, types) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    if (onSetAudienceType) onSetAudienceType(flatIdx, types);
  };
  const getAudienceDetails = (campaignIdx, adsetIdx) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    return adsetAudienceDetails[flatIdx] || {};
  };
  const saveAudienceDetailsFor = (campaignIdx, adsetIdx, patch) => {
    const flatIdx = flatIdxFor(campaignIdx, adsetIdx);
    onSaveAdsetAudienceDetails(flatIdx, { ...getAudienceDetails(campaignIdx, adsetIdx), ...patch });
  };

  // Flatten productCreativeGroups for the palette: [{ productId, productName, group }...]
  const paletteGroups = [];
  selectedProducts.forEach(p => {
    const groups = productCreativeGroups?.[p.id] || [];
    groups.forEach(g => paletteGroups.push({ productId: p.id, productName: p.name, group: g }));
  });

  const effectiveFocusedIdx = adSetGroups.length > 0 ? Math.min(focusedAdsetIdx, adSetGroups.length - 1) : 0;
  const focusedAudienceType = (() => {
    const raw = adsetAudiences[effectiveFocusedIdx];
    if (Array.isArray(raw)) return raw[0] || 'ADV';
    return raw || 'ADV';
  })();
  const focusedDetails = adsetAudienceDetails[effectiveFocusedIdx] || {};
  const isFlexibleObjective = objective === 'sales_conversions' || objective === 'app_promotion';
  const strategyLabels = { PER_PRODUCT: 'Test by product group', ALL_PRODUCTS_PER_SET: 'Test by audience group', BY_CREATIVE: 'Test by creative group', AI_STRATEGY: 'AI策略' };
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
    <div className="flex flex-col gap-8">
      <div className="space-y-4 min-w-0">
        {/* 顶部素材组 palette — 拖拽源 */}
        {paletteGroups.length > 0 && (
          <div className="bg-white border border-neutral-100 rounded-inner p-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Layers size={14} className="text-primary-500/70" />
              <span className="text-xs font-semibold text-neutral-700">素材组</span>
              <span className="text-xs text-neutral-400 font-medium">拖拽到下方任意 Ad slot</span>
            </div>
            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
              {paletteGroups.map(({ productId, productName, group }) => (
                <div
                  key={`${productId}::${group.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-creative-group', JSON.stringify({ productId, groupId: group.id }));
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="shrink-0 w-32 bg-neutral-50 border border-neutral-100 rounded-base p-2 cursor-grab active:cursor-grabbing hover:border-primary-500/40 hover:shadow-md transition-all"
                  title={`${productName} · ${group.name}`}
                >
                  <div className="grid grid-cols-2 gap-0.5 mb-2 h-16 rounded-sm overflow-hidden bg-neutral-100">
                    {(group.ads || []).slice(0, 4).map((ad, i) => (
                      <div key={i} className="bg-white overflow-hidden">
                        {ad.mediaType === 'video' ? (
                          <video src={ad.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                        ) : (
                          <img src={ad.url} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                    ))}
                    {(group.ads || []).length === 0 && (
                      <div className="col-span-2 row-span-2 flex items-center justify-center text-neutral-300">
                        <Layers size={20} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 truncate">{group.name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">{productName} · {(group.ads || []).length} 素材</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 横向架构图 + 右侧详情面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Tree pane (left) */}
          <div className="bg-neutral-50/40 border border-neutral-100 rounded-inner p-6 max-h-[640px] overflow-auto custom-scrollbar">
            <div className="space-y-8 min-w-max">
              {campaignTrees.map(tree => {
                const cIdx = tree.campaignIdx;
                const isCampaignSelected = selectedNode.type === 'campaign' && selectedNode.campaignIdx === cIdx;
                const cfg = getCampaignConfig(cIdx);
                return (
                  <div key={cIdx} className="grid grid-cols-[100px_1fr] gap-3 items-center">
                    {/* Campaign node — column layout: icon top, label below */}
                    <div className="relative group/cnode sticky top-0">
                      <button
                        onClick={() => setSelectedNode({ type: 'campaign', campaignIdx: cIdx })}
                        className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-base border-2 transition-all ${
                          isCampaignSelected ? 'bg-primary-50 border-primary-500' : 'bg-white border-neutral-100 hover:border-primary-500/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-base flex items-center justify-center text-white ${isCampaignSelected ? 'bg-primary-500' : 'bg-neutral-900'}`}>
                          <Briefcase size={16} />
                        </div>
                        <div className="text-center min-w-0 w-full">
                          <p className={`text-xs font-bold truncate ${isCampaignSelected ? 'text-primary-600' : 'text-neutral-900'}`}>Campaign {cIdx + 1}</p>
                          <p className="text-[10px] text-neutral-400 font-medium truncate">{tree.adsets.length} adset</p>
                        </div>
                      </button>
                      {/* CRUD toolbar — hover 显示在节点底部，节点选中时常驻 */}
                      <div className={`absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-1 bg-white border border-neutral-100 rounded-full shadow-md transition-opacity z-30 ${
                        isCampaignSelected ? 'opacity-100' : 'opacity-0 group-hover/cnode:opacity-100'
                      }`}>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); duplicateCampaign(cIdx, 'full'); }}
                          title="完整复制（配置 + 受众 + 已分配素材）"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); duplicateCampaign(cIdx, 'structure'); }}
                          title="仅复制结构（只拷配置，素材清空）"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                        >
                          <CopyMinus size={12} />
                        </button>
                        {numCampaigns > 1 && (
                          <>
                            <div className="w-px h-4 bg-neutral-100" />
                            <button
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); deleteCampaignAt(cIdx); }}
                              title="删除此 Campaign（含其下所有 Adset / Ad）"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Adsets + ads (right of campaign node) */}
                    <div className="space-y-3 pt-2">
                      {tree.adsets.length === 0 ? (
                        <p className="text-xs text-neutral-400 font-medium">该 Campaign 暂无 adset，请先添加产品并完成解析。</p>
                      ) : tree.adsets.map(adset => {
                        const aIdx = adset.adsetIdx;
                        const audienceTypes = getAudienceTypes(cIdx, aIdx);
                        const primaryType = audienceTypes[0] || 'ADV';
                        const audienceLabel = audienceTypes.map(t => AUDIENCE_SHORT_LABELS[t] || t).join(' · ');
                        const isAdsetSelected = selectedNode.type === 'adset' && selectedNode.campaignIdx === cIdx && selectedNode.adsetIdx === aIdx;
                        const hasError = !!errorAdsetKeys[adset.key];
                        return (
                          <div
                            key={adset.key}
                            ref={(el) => { if (el) adsetRowRefs.current[adset.key] = el; else delete adsetRowRefs.current[adset.key]; }}
                            className={`grid grid-cols-[100px_1fr] gap-3 items-stretch h-24 rounded-base transition-all ${
                              hasError ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-neutral-50/40 bg-rose-50/40 animate-pulse p-2 -m-2' : ''
                            }`}
                          >
                            {/* Adset node — 与 Campaign 同款结构：CRUD 按钮 absolute 右上角 */}
                            <div className="relative isolate h-full">
                              <button
                                onClick={() => setSelectedNode({ type: 'adset', campaignIdx: cIdx, adsetIdx: aIdx })}
                                className={`w-full h-full flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-base border-2 transition-all ${
                                  isAdsetSelected ? 'bg-primary-50 border-primary-500' : 'bg-white border-neutral-100 hover:border-primary-500/20'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-base flex items-center justify-center ${
                                  primaryType === 'LAL' ? 'bg-purple-50 text-purple-600' :
                                  primaryType === 'INT' ? 'bg-warning-50 text-warning-600' :
                                  'bg-primary-50 text-primary-500'
                                }`}>
                                  <Users size={16} />
                                </div>
                                <div className="text-center min-w-0 w-full">
                                  <p className="text-xs font-bold text-neutral-900 truncate">Adset {cIdx + 1}.{aIdx + 1}</p>
                                  <p className="text-[10px] text-neutral-400 font-medium truncate">{audienceLabel}</p>
                                </div>
                              </button>
                              {/* CRUD buttons — 复制 + 删除（绝对定位，与 Campaign 同款） */}
                              <div className="absolute top-1 right-1 flex gap-0.5 z-30">
                                <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); duplicateAdset(cIdx, aIdx); }} title="复制 Adset" className="w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-500 hover:border-primary-500 shadow-sm transition-colors">
                                  <Copy size={9} />
                                </button>
                                {tree.adsets.length > 1 && (
                                  <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); deleteAdsetAt(cIdx, aIdx); }} title="删除此 Adset（含其下所有 Ad）" className="w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:border-rose-300 shadow-sm transition-colors">
                                    <Trash2 size={9} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* 固定 drop zone（左）+ 动态 ad 列表（右，新加入靠左），单行；
                                items-stretch 让 drop zone 自动跟随组卡片高度（ad 卡为手机比例，
                                整体会比单纯 h-20 高）。 */}
                            <div className="flex flex-nowrap items-stretch gap-2">
                              {campaignType === 'CATALOG' ? (
                                <div
                                  className="shrink-0 w-24 h-full rounded-base border-2 border-primary-500/20 bg-gradient-to-br from-primary-50 to-purple-50 flex flex-col items-center justify-center gap-1 px-1.5 text-center"
                                  title="动态目录广告（Dynamic Product Ad）— 素材按 catalog 自动生成"
                                >
                                  <img src="https://img.clipp.io/img/ad_preview_dpa.png" className="w-7 h-7 object-contain" alt="DPA" />
                                  <span className="text-[10px] font-bold text-primary-600 leading-tight">动态目录广告</span>
                                  <span className="text-[8px] text-primary-500/70 font-medium leading-tight">DPA · 自动生成</span>
                                </div>
                              ) : (() => {
                                const adsetKey = `${cIdx}::${aIdx}`;
                                const isHovered = hoveredAdsetKey === adsetKey;
                                return (
                                  <div
                                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setHoveredAdsetKey(adsetKey); }}
                                    onDragLeave={() => setHoveredAdsetKey(null)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      try {
                                        const data = JSON.parse(e.dataTransfer.getData('application/x-creative-group') || '{}');
                                        handleDropGroupToAdset(cIdx, aIdx, data);
                                      } catch {}
                                      setHoveredAdsetKey(null);
                                    }}
                                    className={`shrink-0 w-24 h-full rounded-base border-2 border-dashed transition-all flex flex-col items-center justify-center gap-0.5 px-1.5 text-center ${
                                      isHovered ? 'border-primary-500 bg-primary-50 scale-105 shadow-md text-primary-500' :
                                      'border-neutral-200 bg-neutral-50/50 hover:border-primary-500/30 text-neutral-300'
                                    }`}
                                  >
                                    <MousePointerClick size={14} />
                                    <span className="text-[9px] font-semibold leading-tight">拖入素材组后<br/>自动拆分 ad</span>
                                  </div>
                                );
                              })()}
                              {/* 按 (productId, groupId) 聚合渲染 — 每个素材组一张可视卡片，
                                  头部单行展示「产品名 · 组名」+ 清空；ad 卡片仅保留删除（不再支持复制）。
                                  ad 卡 = 手机比例 (9:16 近似)，object-contain 保留素材原始比例不裁切。 */}
                              {groupAdsByGroup(getAdsForAdset(cIdx, aIdx)).map(group => (
                                <div
                                  key={`${group.productId}::${group.groupId}`}
                                  className="shrink-0 relative bg-neutral-50/60 border border-dashed border-neutral-200 rounded-base px-1.5 pt-0.5 pb-1 h-full flex flex-col group/group"
                                >
                                  {/* 头部单行：产品名 · 组名 + 清空（hover 显示） */}
                                  <div className="flex items-center justify-between gap-1.5 mb-1 px-0.5 max-w-[240px] shrink-0">
                                    <span className="text-[9px] text-neutral-500 truncate leading-tight">
                                      <span className="text-neutral-400">{productNameById[group.productId] || '—'}</span>
                                      <span className="text-neutral-300 mx-1">·</span>
                                      <span className="text-neutral-600 font-semibold">{group.groupName}</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); removeAllAdsOfGroup(cIdx, aIdx, group.productId, group.groupId); }}
                                      className="w-4 h-4 shrink-0 flex items-center justify-center rounded-full text-neutral-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover/group:opacity-100"
                                      title="清空此素材组下所有 ad"
                                    >
                                      <Trash2 size={9} />
                                    </button>
                                  </div>
                                  {/* ads 行 — ad 卡 w-12 h-[88px] (手机竖屏 9:16 近似)；
                                      object-contain + 灰底，保证横图 / 竖图 / 方图都不变形。 */}
                                  <div className="flex gap-1 items-start flex-1 min-h-0">
                                    {campaignType === 'CATALOG' ? (
                                      <div
                                        className="shrink-0 relative w-10 h-[68px] rounded-base border border-primary-500/20 bg-gradient-to-br from-primary-50 to-purple-50 shadow-adsgo-card overflow-hidden flex flex-col items-center justify-center gap-0.5"
                                        title="动态目录广告（Dynamic Product Ad）"
                                      >
                                        <img src="https://img.clipp.io/img/ad_preview_dpa.png" className="w-5 h-5 object-contain" alt="DPA" />
                                        <span className="text-[7px] font-bold text-primary-600 tracking-wide leading-none text-center px-0.5">DPA</span>
                                      </div>
                                    ) : (
                                      group.ads.map(ad => (
                                        <div key={ad.id} className="shrink-0 relative w-10 h-[68px] rounded-base border border-neutral-100 bg-neutral-100 shadow-adsgo-card overflow-hidden group/ad">
                                          {adType === 'FLEXIBLE' && ad.creatives.length > 1 ? (
                                            <div className="grid grid-cols-2 gap-0.5 w-full h-full bg-neutral-100">
                                              {ad.creatives.slice(0, 4).map((c, i) => (
                                                <div key={i} className="bg-neutral-100 overflow-hidden flex items-center justify-center">
                                                  <img src={c.url} className="max-w-full max-h-full object-contain" alt="" />
                                                </div>
                                              ))}
                                              {ad.creatives.length > 4 && (
                                                <div className="absolute bottom-0.5 right-0.5 bg-neutral-900/80 text-white text-[9px] font-bold px-1 py-0 rounded leading-none">+{ad.creatives.length - 4}</div>
                                              )}
                                            </div>
                                          ) : ad.creatives[0]?.url ? (
                                            <img src={ad.creatives[0].url} className="w-full h-full object-contain" alt="" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
                                              <Layers size={16} />
                                            </div>
                                          )}
                                          <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover/ad:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); removeAdFromAdset(cIdx, aIdx, ad.id); }} className="w-4 h-4 bg-white/90 rounded-full flex items-center justify-center text-neutral-500 hover:text-rose-500 shadow" title="删除此 ad">
                                              <X size={9} />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {/* Adset 列底部占位：新增 Adset — 只对当前 campaign 生效 */}
                      <div className="grid grid-cols-[100px_1fr] gap-3 items-center">
                        <button
                          onClick={() => addAdset(cIdx)}
                          className="w-full flex flex-col items-center gap-1 p-2 rounded-base border-2 border-dashed border-neutral-200 hover:border-primary-500/40 hover:bg-primary-50/30 text-neutral-400 hover:text-primary-500 transition-all"
                        >
                          <Plus size={14} />
                          <span className="text-[10px] font-semibold">新增 Adset</span>
                        </button>
                        <div></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Campaign 列底部占位：新增 Campaign */}
              <div className="grid grid-cols-[100px_1fr] gap-3 items-center">
                <button
                  onClick={() => addCampaign()}
                  className="w-full flex flex-col items-center gap-1 p-3 rounded-base border-2 border-dashed border-neutral-200 hover:border-primary-500/40 hover:bg-primary-50/30 text-neutral-400 hover:text-primary-500 transition-all"
                >
                  <Plus size={16} />
                  <span className="text-[11px] font-semibold">新增 Campaign</span>
                </button>
                <div></div>
              </div>
            </div>
          </div>

          {/* Detail pane (right) */}
          <div className="bg-white border border-neutral-100 rounded-inner p-5 self-start sticky top-4">
            {selectedNode.type === 'campaign' ? (
              <CampaignDetailPanel
                campaignIdx={selectedNode.campaignIdx}
                config={getCampaignConfig(selectedNode.campaignIdx)}
                onChange={(patch) => updateCampaignConfig(selectedNode.campaignIdx, patch)}
                openDropdown={campaignDropdown}
                setOpenDropdown={setCampaignDropdown}
                objectiveStage={campaignObjectiveStage}
                setObjectiveStage={setCampaignObjectiveStage}
                onSelectExistingCampaign={onSelectCampaign}
                selectedCampaign={selectedCampaign}
                isExistingCampaign={isExistingCampaign}
                targetingMeta={targetingMeta}
                platform={platform}
                globalBidStrategy={sectionDefaults?.bidStrategy || 'highest_volume'}
              />
            ) : (
              <AdsetDetailPanel
                platform={platform}
                campaignIdx={selectedNode.campaignIdx}
                adsetIdx={selectedNode.adsetIdx}
                audienceTypes={getAudienceTypes(selectedNode.campaignIdx, selectedNode.adsetIdx)}
                onToggleAudienceType={(t) => toggleAudienceTypeFor(selectedNode.campaignIdx, selectedNode.adsetIdx, t)}
                onSetAudienceType={(types) => setAudienceTypeFor(selectedNode.campaignIdx, selectedNode.adsetIdx, types)}
                details={getAudienceDetails(selectedNode.campaignIdx, selectedNode.adsetIdx)}
                onSaveDetails={(patch) => saveAudienceDetailsFor(selectedNode.campaignIdx, selectedNode.adsetIdx, patch)}
                effectiveObjective={(campaignConfigs[selectedNode.campaignIdx]?.objective) || sectionDefaults?.objective || ''}
                targetingMeta={targetingMeta}
                globalAdsetGoal={sectionDefaults?.adsetGoal || ''}
                globalEvent={sectionDefaults?.event || ''}
                globalLocations={sectionDefaults?.selectedLocations || []}
                globalLanguage={sectionDefaults?.selectedLanguage || null}
                effectiveBidStrategy={(campaignConfigs[selectedNode.campaignIdx]?.bidStrategy) ?? sectionDefaults?.bidStrategy ?? 'highest_volume'}
                globalBidAmount={sectionDefaults?.bidAmount ?? ''}
                globalAgeMin={sectionDefaults?.ageMin ?? ''}
                globalAgeMax={sectionDefaults?.ageMax ?? ''}
                globalGender={sectionDefaults?.gender ?? 'All'}
                globalLalInclude={sectionDefaults?.lalInclude ?? []}
                globalCustomInclude={sectionDefaults?.customInclude ?? []}
                globalLalExclude={sectionDefaults?.lalExclude ?? []}
                globalCustomExclude={sectionDefaults?.customExclude ?? []}
                authStatus={authStatus}
                handleAuthorize={handleAuthorize}
                selectedAccount={selectedAccount}
                onSelectAccount={onSelectAccount}
                lalLoading={lalLoading}
                customAudienceLoading={customAudienceLoading}
                savedAudienceLoading={savedAudienceLoading}
                selectedProducts={selectedProducts}
                isTikTokAppSales={isTikTokAppSales}
                globalCatalog={globalCatalog}
                catalogs={catalogs}
                adsetCatalog={adsetCatalogMap[selectedNode.adsetIdx]}
                onSaveAdsetCatalog={onSaveAdsetCatalog}
                onAuthorizeChannel={onAuthorizeChannel}
                onOpenAccountPicker={onOpenAccountPicker}
                channelAuthLoading={channelAuthLoading}
              />
            )}
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
        availablePlacements={placementOptions}
        currentPlacements={adsetPlacementsMap[editingAdsetIndex] || defaultPlacements}
        onSavePlacements={(idx, next) => setAdsetPlacementsMap(prev => ({ ...prev, [idx]: next }))}
      />
    )}
    </>
  );
});

CampaignPlanView.displayName = 'CampaignPlanView';

export default CampaignPlanView;
