import React, { useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check, LayoutGrid, Facebook, Smartphone, Search, X, Loader2, Send, ChevronUp, MessageSquare, RefreshCw, Plus, Link, Copy, CopyMinus, Trash2, Globe, MapPin, ChevronLeft, ArrowRight, CheckCircle2, MousePointerClick, Database } from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';
import BulkEditModal from './BulkEditModal';
import BulkEditPanel from './BulkEditPanel';
import useDropdownLoading from '../../../hooks/useDropdownLoading';
import { IncludeExcludeAudienceDropdown } from '../BulkLaunchTool';
import { Popover } from '../../common/Popover';
import { META_PIXELS, TIKTOK_PIXELS, getPixelEvents } from '../services/platformResources';
import LevelFieldsEditor from './LevelFieldsEditor';
import { getFieldDefs } from '../fieldDefinitions';
import { splitGroupByAdFormat, legacyAdTypeToSdkFormat } from '../utils/adFormatSplit';

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
        <label className="text-xs font-medium text-neutral-500 px-1 mb-2 block flex items-center gap-1.5">
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
          ref={triggerRef}
          onClick={() => setShowPanel(!showPanel)}
          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-base flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <span className="text-xs font-medium text-neutral-300">
            {intOptions.length === 0 ? '点击选择兴趣词定向...' : '添加更多兴趣词...'}
          </span>
          <ChevronDown size={14} className={`text-amber-300 transition-transform ${showPanel ? 'rotate-180' : ''}`} />
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
                          sel ? 'bg-amber-50 text-amber-600' : 'text-neutral-600 hover:bg-neutral-50'
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

/**
 * Phase 2.J: CampaignDetailPanel 已精简为 LevelFieldsEditor 的薄 wrapper —
 * 字段集 100% 与 Card 1 CampaignSection 一致；继承 / 覆盖语义通过 nodeOverrides 表达。
 *
 * 接收（多写法兼容）：
 *  - 单选模式：formData (global) + nodeOverrides + setNodeOverride + clearNodeOverride
 *  - 批量模式：levelData + onFieldChange + inheritanceMap （由父级合成跨节点 mixed/共同值）
 *  - onSelectExistingCampaign：保留作为 panel 顶部"选已有系列"快捷入口
 */
const CampaignDetailPanel = ({
  campaignIdx, platform, plan,
  onSelectExistingCampaign, selectedCampaign, isExistingCampaign,
  // 单选模式（首选）
  formData, nodeOverrides, setNodeOverride, clearNodeOverride,
  // 批量模式（fallback）
  levelData: levelDataProp, onFieldChange: onFieldChangeProp, inheritanceMap: inheritanceMapProp,
}) => {
  const planCampaignName = plan?.campaigns?.[campaignIdx]?.name;
  const defaultCampaignName = planCampaignName || `Campaign ${campaignIdx + 1}`;

  // 数据契约统一：单选模式合成 effective；批量模式直接接收 levelData
  const isSingleMode = !!formData && !!setNodeOverride;
  const overrideForNode = nodeOverrides?.campaign?.[campaignIdx] || {};
  const levelData = isSingleMode
    ? { ...(formData?.campaign || {}), ...overrideForNode }
    : (levelDataProp || {});
  const rootFormData = isSingleMode
    ? { ...formData, campaign: levelData }
    : { campaign: levelData };  // 批量模式不需要其他层
  const onFieldChange = isSingleMode
    ? (name, value) => setNodeOverride('campaign', campaignIdx, name, value)
    : onFieldChangeProp;
  const inheritanceMap = isSingleMode ? overrideForNode : (inheritanceMapProp || {});
  const onResetField = isSingleMode
    ? (name) => clearNodeOverride('campaign', campaignIdx, name)
    : undefined;

  return (
    <div className="space-y-5">
      {/* Header：Campaign 编号 + 名称（plan 优先；用户在下方"系列名称"字段编辑） */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xs font-bold text-primary-500/60 tabular-nums shrink-0">C{campaignIdx + 1}</span>
          <h4 className="text-sm font-semibold text-neutral-900 tracking-tight truncate">{levelData.name || defaultCampaignName}</h4>
        </div>
        {onSelectExistingCampaign && (
          <button
            onClick={onSelectExistingCampaign}
            className="flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors shrink-0"
          >
            <Edit3 size={11} />
            <span className="text-[11px] font-medium">{isExistingCampaign ? `已绑定 ${selectedCampaign?.name || ''}` : '选已有系列'}</span>
          </button>
        )}
      </div>

      {/* Phase 2.J：单一字段渲染入口 — 与 Card 1 CampaignSection 完全对齐 */}
      <LevelFieldsEditor
        channel={platform?.id}
        level="campaign"
        formData={levelData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        inheritanceMap={inheritanceMap}
        onResetField={onResetField}
        showAdvanced
        compact
      />
    </div>
  );
};

/**
 * Phase 2.J: AdsetDetailPanel 已精简为 LevelFieldsEditor 的薄 wrapper —
 * 字段集 100% 与 Card 1 AdSetSection 一致；继承 / 覆盖语义通过 nodeOverrides 表达。
 *
 * 接收（多写法兼容）：
 *  - 单选模式：formData (global) + nodeOverrides + setNodeOverride + clearNodeOverride + flatIdx
 *  - 批量模式：levelData + onFieldChange + inheritanceMap （由父级合成跨节点 mixed/共同值）
 */
const AdsetDetailPanel = ({
  platform, campaignIdx, adsetIdx, flatIdx,
  // 单选模式（首选）
  formData, nodeOverrides, setNodeOverride, clearNodeOverride,
  // 批量模式（fallback）
  levelData: levelDataProp, onFieldChange: onFieldChangeProp, inheritanceMap: inheritanceMapProp,
}) => {
  const isSingleMode = !!formData && !!setNodeOverride && flatIdx !== undefined;
  const overrideForNode = nodeOverrides?.adset?.[flatIdx] || {};
  const levelData = isSingleMode
    ? { ...(formData?.adset || {}), ...overrideForNode }
    : (levelDataProp || {});
  const rootFormData = isSingleMode
    ? { ...formData, adset: levelData }
    : { adset: levelData };
  const onFieldChange = isSingleMode
    ? (name, value) => setNodeOverride('adset', flatIdx, name, value)
    : onFieldChangeProp;
  const inheritanceMap = isSingleMode ? overrideForNode : (inheritanceMapProp || {});
  const onResetField = isSingleMode
    ? (name) => clearNodeOverride('adset', flatIdx, name)
    : undefined;

  const adsetLabel = `${campaignIdx + 1}.${adsetIdx + 1}`;
  const defaultName = `Adset ${adsetLabel}`;

  return (
    <div className="space-y-5">
      {/* Header：AdSet 编号 + 名称 */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-primary-500/60 tabular-nums shrink-0">A{adsetLabel}</span>
        <h4 className="text-sm font-semibold text-neutral-900 tracking-tight truncate">{levelData.name || defaultName}</h4>
      </div>

      {/* Phase 2.J：单一字段渲染入口 — 与 Card 1 AdSetSection 完全对齐 */}
      <LevelFieldsEditor
        channel={platform?.id}
        level="adset"
        formData={levelData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        inheritanceMap={inheritanceMap}
        onResetField={onResetField}
        showAdvanced
        compact
      />
    </div>
  );
};

// Phase 2.J: AdsetDetailPanel 的旧实现（含成效目标三段式 + 受众策略 + LAL/Custom 等 hand-coded UI）已删除——
// 全部入口统一收敛到 LevelFieldsEditor（字段集 = AdSetSection）。
// 受众策略 ADV/LAL/INT toggle、IncludeExcludeAudienceDropdown、IntInterestSelector、Saved Audience 等 UX 糖
// 不再以独立模块存在；用户通过 schema 中的 custom_audiences / lal_axiences / interests 等字段直接编辑。

/**
 * AdDetailPanel — 架构树点击 ad 卡时右侧渲染的字段编辑面板。
 * 与 CampaignDetailPanel / AdsetDetailPanel 一致：LevelFieldsEditor 薄 wrapper，level='ad'。
 * 字段集严格遵循 CORE_FIELDS_V2.ad（5/6 个 core）+ advanced 折叠卡（其余 schema 字段）。
 *
 * 双模式：
 *  - 单选：formData + nodeOverrides + setNodeOverride/clearNodeOverride + adId（per-ad override）
 *  - 批量：levelData + onFieldChange + inheritanceMap（父级合成 mixed）
 */
const AdDetailPanel = ({
  platform, campaignIdx, adsetIdx, adId, adRef, adsetFlatIdx,
  // 单选模式（首选）
  formData, nodeOverrides, setNodeOverride, clearNodeOverride,
  // 批量模式（fallback）
  levelData: levelDataProp, onFieldChange: onFieldChangeProp, inheritanceMap: inheritanceMapProp,
  // 素材组级 ad copy（productId → groupId → { title / body / link_url / call_to_action_type / ... }）
  creativeGroupCopyMap = {},
}) => {
  const isSingleMode = !!formData && !!setNodeOverride && !!adId;
  const overrideForNode = nodeOverrides?.ad?.[adId] || {};
  const adsetOverride = nodeOverrides?.adset?.[adsetFlatIdx] || {};
  const adsetEffective = { ...(formData?.adset || {}), ...adsetOverride };

  // 素材组级 copy 作为该 ad 的默认值（落地页 / 文案 / CTA），可被 per-ad override 覆盖
  const groupCopy = (adRef?.productId && adRef?.groupId)
    ? (creativeGroupCopyMap?.[adRef.productId]?.[adRef.groupId] || {})
    : {};

  // 单素材静态绑定（adRef.creatives[0] 或主图）：把 image_hash / video_id / image_url 等也注入展示
  const primaryCreative = adRef?.creatives?.[0];
  const creativeBindings = primaryCreative
    ? {
        ...(primaryCreative.mediaType === 'video'
          ? { video_id: primaryCreative.videoId || primaryCreative.id, image_url: primaryCreative.thumbnailUrl }
          : { image_hash: primaryCreative.imageHash, image_url: primaryCreative.url }),
      }
    : {};

  // ad_format 取值优先级：per-ad override > 该 adset 的 __adFormat > 'SINGLE_IMAGE'
  const inheritedFormat = adsetOverride?.__adFormat;
  const baseAd = formData?.ad || {};
  const levelData = isSingleMode
    ? {
        ...baseAd,
        ...creativeBindings,
        ...groupCopy,
        ...overrideForNode,
        ad_format: overrideForNode.ad_format ?? inheritedFormat ?? baseAd.ad_format ?? 'SINGLE_IMAGE',
      }
    : (levelDataProp || {});
  const rootFormData = isSingleMode
    ? { ...formData, adset: adsetEffective, ad: levelData }
    : { ad: levelData };
  const onFieldChange = isSingleMode
    ? (name, value) => setNodeOverride('ad', adId, name, value)
    : onFieldChangeProp;
  const inheritanceMap = isSingleMode ? overrideForNode : (inheritanceMapProp || {});
  const onResetField = isSingleMode
    ? (name) => clearNodeOverride('ad', adId, name)
    : undefined;

  const isCatalogPlaceholder = typeof adId === 'string' && adId.startsWith('dpa::');
  const adLabel = `${campaignIdx + 1}.${adsetIdx + 1}`;
  const shortAdId = isCatalogPlaceholder
    ? 'DPA'
    : (adId || '').split('-').slice(-1)[0]?.slice(0, 6) || '?';
  const headerName = levelData.name || levelData.ad_name || (isCatalogPlaceholder ? '动态目录广告' : `Ad ${shortAdId}`);
  const previews = (adRef?.creatives || []).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Header：Ad 编号 + 名称 + 创意缩略图 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-primary-500/60 tabular-nums shrink-0">Ad {adLabel}.{shortAdId}</span>
        <h4 className="text-sm font-semibold text-neutral-900 tracking-tight truncate flex-1 min-w-0">{headerName}</h4>
        {isCatalogPlaceholder ? (
          <div className="shrink-0 w-9 h-12 rounded border border-primary-500/20 bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
            <Database size={14} className="text-primary-600" />
          </div>
        ) : previews.length > 1 ? (
          <div className="shrink-0 w-9 h-12 rounded border border-neutral-100 bg-neutral-100 grid grid-cols-2 gap-px overflow-hidden">
            {previews.map((c, i) => (
              <div key={i} className="bg-neutral-100 overflow-hidden flex items-center justify-center">
                <img src={c.url} className="max-w-full max-h-full object-contain" alt="" />
              </div>
            ))}
          </div>
        ) : previews[0]?.url ? (
          <img src={previews[0].url} className="shrink-0 w-9 h-12 rounded border border-neutral-100 object-contain bg-neutral-100" alt="" />
        ) : null}
      </div>

      {/* 字段集 = ad 层全 schema（含 excludeFromCreate 的文案 / CTA / 落地页 / image_hash / video_id 等）；
          架构图详情面板需要展示完整 ad creative，不仅是 create-flow 中的核心字段 */}
      <LevelFieldsEditor
        channel={platform?.id}
        level="ad"
        formData={levelData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        inheritanceMap={inheritanceMap}
        onResetField={onResetField}
        showAdvanced
        showAllFields
        compact
      />
    </div>
  );
};

const CampaignPlanView = forwardRef(({
  platform,
  structure,
  onStructureChange,
  campaignType,
  plan,                  // Phase 2.G：catalog/app plan（含 campaigns[].name 与 adsets[].name）
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
  // Phase 2.J：节点级 SDK override 状态（继承 vs 覆盖语义）
  formData,
  nodeOverrides = { campaign: {}, adset: {}, ad: {} },
  setNodeOverride,
  clearNodeOverride,
  planMode = 'product',          // 'product' | 'catalog' | 'app' — 决定「广告结构策略」副标题
  // 素材组级 ad copy（productId → groupId → { title / body / link_url / call_to_action_type / ... }）— 仅 ad 详情面板渲染所用
  creativeGroupCopyMap = {},
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
  // adsetAds / campaignConfigs 由父组件 BulkLaunchTool 提供（state lifted up），
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

  // Phase 2.H 任务 3：批量编辑模式
  // bulkEditMode=true 时：节点出现勾选按钮 + detail panel 替换为 BulkEditPanel + 顶部出现 取消/保存
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState(() => new Set());
  const [bulkEditDraft, setBulkEditDraft] = useState({});

  const enterBulkEditMode = () => {
    setBulkEditMode(true);
    setBulkEditDraft({});
    // 主选作为基准已计入 — extras 由用户手动勾选
  };
  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setBulkEditDraft({});
    setSelectedExtras(new Set());
  };

  /**
   * 节点点击 handler（普通点击 = 单选，切换 detail panel）。
   * 多选靠节点上独立的勾选按钮触发，无需键盘。
   */
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    // 点击不同层级时清空多选（避免跨层级混选）
    setSelectedExtras(prev => {
      if (prev.size === 0) return prev;
      const sameLevel = Array.from(prev).every(key => {
        if (node.type === 'campaign' && key.startsWith('campaign:')) return true;
        if (node.type === 'adset' && key.startsWith('adset:')) return true;
        if (node.type === 'ad' && key.startsWith('ad:')) return true;
        return false;
      });
      return sameLevel ? prev : new Set();
    });
  };

  /**
   * 勾选按钮：toggle 加入/移出 selectedExtras（仅同层级）。
   */
  const toggleNodeSelection = (node, e) => {
    e?.stopPropagation();
    if (node.type !== selectedNode.type) {
      // 跨层级时把当前主选先转移为新节点（自然成为单层）
      setSelectedNode(node);
      setSelectedExtras(new Set());
      return;
    }
    const key = node.type === 'campaign'
      ? `campaign:${node.campaignIdx}`
      : node.type === 'adset'
        ? `adset:${node.campaignIdx}:${node.adsetIdx}`
        : `ad:${node.campaignIdx}:${node.adsetIdx}:${node.adId}`;
    const selKey = selectedNode.type === 'campaign'
      ? `campaign:${selectedNode.campaignIdx}`
      : selectedNode.type === 'adset'
        ? `adset:${selectedNode.campaignIdx}:${selectedNode.adsetIdx}`
        : `ad:${selectedNode.campaignIdx}:${selectedNode.adsetIdx}:${selectedNode.adId}`;
    if (key === selKey) return; // 主选不可勾掉自身
    setSelectedExtras(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 已选总数（含主 + extras）
  const selectionTotal = 1 + selectedExtras.size;
  const isMultiSelect = selectedExtras.size > 0;
  const clearMultiSelection = () => setSelectedExtras(new Set());

  // 批量编辑：合成字段当前值（mixed 检测）
  const getBulkFieldState = (fieldName) => {
    const N = adSetGroups.length || 1;
    const values = selectedAllNodes.map(n => {
      if (n.type === 'campaign') {
        const c = (campaignConfigs[n.campaignIdx]) || {};
        return c[fieldName];
      }
      if (n.type === 'ad') {
        const override = nodeOverrides?.ad?.[n.adId] || {};
        const base = formData?.ad || {};
        return Object.prototype.hasOwnProperty.call(override, fieldName) ? override[fieldName] : base[fieldName];
      }
      const flatIdx = n.campaignIdx * N + n.adsetIdx;
      return (adsetAudienceDetails[flatIdx] || {})[fieldName];
    });
    const uniq = [...new Set(values.map(v => JSON.stringify(v ?? null)))];
    if (uniq.length > 1) return { mixed: true, value: undefined };
    return { mixed: false, value: values[0] };
  };

  // 保存：把 draft 应用到所有已选节点
  const saveBulkEdit = () => {
    const N = adSetGroups.length || 1;
    Object.entries(bulkEditDraft).forEach(([fieldName, value]) => {
      selectedAllNodes.forEach(n => {
        if (n.type === 'campaign') {
          setCampaignConfigs(prev => ({
            ...prev,
            [n.campaignIdx]: { ...(prev[n.campaignIdx] || buildDefaultCampaignConfig()), [fieldName]: value },
          }));
        } else if (n.type === 'adset') {
          const flatIdx = n.campaignIdx * N + n.adsetIdx;
          const existing = adsetAudienceDetails[flatIdx] || {};
          onSaveAdsetAudienceDetails?.(flatIdx, { ...existing, [fieldName]: value });
        } else if (n.type === 'ad') {
          // ad 层走 nodeOverrides.ad[adId]（per-ad sparse SDK override）
          setNodeOverride?.('ad', n.adId, fieldName, value);
        }
      });
    });
    setBulkEditMode(false);
    setBulkEditDraft({});
    setSelectedExtras(new Set());
  };

  // 派生：所有已选节点的 idx 列表（用于批量同步 setter）
  const selectedAllNodes = (() => {
    const list = [{ ...selectedNode }];
    selectedExtras.forEach(key => {
      const parts = key.split(':');
      if (parts[0] === 'campaign') list.push({ type: 'campaign', campaignIdx: Number(parts[1]) });
      else if (parts[0] === 'adset') list.push({ type: 'adset', campaignIdx: Number(parts[1]), adsetIdx: Number(parts[2]) });
      else if (parts[0] === 'ad') {
        // 'ad:cIdx:aIdx:adId'，adId 可能含 ':'，取第 4 段及以后
        const adId = parts.slice(3).join(':');
        list.push({ type: 'ad', campaignIdx: Number(parts[1]), adsetIdx: Number(parts[2]), adId });
      }
    });
    return list;
  })();
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
        // Phase 2.G：plan 优先（catalog 系列名 / app 名）
        const planAdsetName = plan?.campaigns?.[0]?.adsets?.[i]?.name;
        groups.push({
          name: planAdsetName || (campaignType === 'CATALOG' ? `DPA-${i + 1}` : `混合组 ${i + 1}`),
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

  // ad_format（SDK 枚举）的可选项 + per-adset 当前值 helpers
  // 数据契约：nodeOverrides.adset[flatIdx].__adFormat 存 per-adset 覆盖；缺省退回 legacy adType。
  const adFormatOptions = useMemo(() => {
    const channelId = platform?.id;
    if (!channelId) return [];
    const def = getFieldDefs(channelId, 'ad').find(d => d.name === 'ad_format');
    return def?.options || [];
  }, [platform?.id]);

  // 注意：与 AdsetDetailPanel 共用 nodeOverrides.adset[flatIdx] 存储，必须用同一个 flatIdx 公式
  // （AdsetDetailPanel 在右侧详情面板传入的 flatIdx = cIdx * adSetGroups.length + aIdx）
  const adsetFlatIdxFor = useCallback((cIdx, aIdx) => cIdx * (adSetGroups.length || 1) + aIdx, [adSetGroups.length]);

  const getAdFormatFor = useCallback((cIdx, aIdx) => {
    const flat = adsetFlatIdxFor(cIdx, aIdx);
    const override = nodeOverrides?.adset?.[flat]?.__adFormat;
    if (override) return override;
    return legacyAdTypeToSdkFormat(platform?.id, adType);
  }, [nodeOverrides, platform?.id, adType, adsetFlatIdxFor]);

  // Per-(adset, productId, groupId) ad_format：每个素材组在每个 adset 内独立设置拆分方案
  // 数据契约：nodeOverrides.adset[flatIdx].__groupFormats = { 'productId::groupId': format }
  const getAdFormatForGroup = useCallback((cIdx, aIdx, productId, groupId) => {
    const flat = adsetFlatIdxFor(cIdx, aIdx);
    const groupKey = `${productId}::${groupId}`;
    const groupOverride = nodeOverrides?.adset?.[flat]?.__groupFormats?.[groupKey];
    if (groupOverride) return groupOverride;
    return getAdFormatFor(cIdx, aIdx);
  }, [nodeOverrides, adsetFlatIdxFor, getAdFormatFor]);

  const setAdFormatForGroup = useCallback((cIdx, aIdx, productId, groupId, format) => {
    const flat = adsetFlatIdxFor(cIdx, aIdx);
    const groupKey = `${productId}::${groupId}`;
    const cur = nodeOverrides?.adset?.[flat]?.__groupFormats || {};
    const next = { ...cur, [groupKey]: format };
    setNodeOverride?.('adset', flat, '__groupFormats', next);
    // 切换 format 触发该组已有 ads 重新拆分（仅该组，不影响同 adset 其它组）
    const adsetKey = `${cIdx}::${aIdx}`;
    const existing = (adsetAds[adsetKey] || []).filter(a => a.productId === productId && a.groupId === groupId);
    if (existing.length === 0) return;
    // 清掉该组 ads 的 per-ad overrides（v1 简化：format 切换重置该组所有 ad 字段编辑）
    existing.forEach(a => {
      const adOverride = nodeOverrides?.ad?.[a.id] || {};
      Object.keys(adOverride).forEach(name => clearNodeOverride?.('ad', a.id, name));
    });
    // 重拆分（handleDropGroupToAdset 读 getAdFormatForGroup，format 已经更新到位）
    setTimeout(() => {
      handleDropGroupToAdsetRef.current?.(cIdx, aIdx, { productId, groupId });
    }, 0);
  }, [adsetAds, nodeOverrides, setNodeOverride, clearNodeOverride, adsetFlatIdxFor]);

  // forward ref：handleDropGroupToAdset 在下方定义，但 setAdFormatForAdset 需要调它，所以用 ref 间接调用
  const handleDropGroupToAdsetRef = useRef(null);
  const numCampaigns = Math.max(structure.numCampaigns || 1, 1);
  const defaultAdsetsPerCampaign = Math.max(structure.numAdsets || adSetGroups.length || 1, 1);
  const getAdsetsForCampaign = (cIdx) =>
    Math.max(campaignConfigs[cIdx]?.adsetCount ?? defaultAdsetsPerCampaign, 1);
  const campaignTrees = Array.from({ length: numCampaigns }, (_, cIdx) => {
    const count = getAdsetsForCampaign(cIdx);
    const adsets = Array.from({ length: count }, (_, aIdx) => {
      const base = adSetGroups[aIdx] || { name: `混合组 ${aIdx + 1}`, ads: selectedProducts.flatMap(p => productCreativesMap[p.id] || []) };
      // Phase 2.G：plan 优先 — 用对应 catalog 系列名 / app 名替换默认 base.name
      const planName = plan?.campaigns?.[cIdx]?.adsets?.[aIdx]?.name;
      const named = planName ? { ...base, name: planName } : base;
      return { ...named, campaignIdx: cIdx, adsetIdx: aIdx, key: `${cIdx}::${aIdx}` };
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

  // Drop a creative group onto an adset → 按该 adset 当前 ad_format 拆分成 N 个 ad，prepend 到该 adset 的 ads 列表
  const handleDropGroupToAdset = (campaignIdx, adsetIdx, payload) => {
    if (!payload?.productId || !payload?.groupId) return;
    const groups = productCreativeGroups?.[payload.productId] || [];
    const group = groups.find(g => g.id === payload.groupId);
    if (!group) return;
    if (!group.ads || group.ads.length === 0) return;
    const format = getAdFormatForGroup(campaignIdx, adsetIdx, payload.productId, payload.groupId);
    const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newAds = splitGroupByAdFormat(group, format, baseId, payload);
    if (newAds.length === 0) return;
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
  // 把最新版 handler 挂到 ref，给 setAdFormatForAdset 在 format 切换后异步触发
  handleDropGroupToAdsetRef.current = handleDropGroupToAdset;

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
        {/* 广告结构策略 — 当前唯一选项 default，按 planMode 显示拆分语义 */}
        <div className="bg-white border border-neutral-100 rounded-inner p-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Layers size={14} className="text-primary-500/70" />
            <span className="text-xs font-semibold text-neutral-700">广告结构策略</span>
            <span className="text-xs text-neutral-400 font-medium">按媒体场景自动选择最优拆分逻辑</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-base bg-primary-50 border border-primary-500/30 text-primary-600">
              <Check size={13} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">default</p>
                <p className="text-[10px] text-primary-500/80 font-medium leading-tight mt-0.5">
                  {planMode === 'catalog'
                    ? '每目录组 1 campaign · 每系列 1 adset'
                    : planMode === 'app'
                      ? '每 app 1 campaign · 每素材组 1 adset'
                      : '每素材组 1 adset'}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium px-2 py-1 rounded-base bg-neutral-50 border border-neutral-100">
              更多策略 · 即将推出
            </span>
          </div>
        </div>

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

        {/* 批量编辑入口 / 模式工具条 */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {bulkEditMode ? (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold">{selectionTotal}</span>
                <p className="text-sm font-semibold text-primary-700">
                  批量编辑模式 · 已选 {selectionTotal} 个 {selectedNode.type === 'campaign' ? 'Campaign' : 'AdSet'}
                </p>
                <p className="text-xs text-neutral-400 hidden md:block">勾选要批量改的同层级节点 → 在右侧编辑 → 保存生效</p>
              </>
            ) : (
              <>
                <h4 className="text-sm font-semibold text-neutral-900">架构树</h4>
                <p className="text-xs text-neutral-400">点击节点单独编辑，或进入批量编辑模式同时改多个</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {bulkEditMode ? (
              <>
                <button
                  type="button"
                  onClick={cancelBulkEdit}
                  className="h-9 px-4 text-xs font-medium text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-200 hover:border-neutral-300 rounded-base transition-all"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveBulkEdit}
                  disabled={Object.keys(bulkEditDraft).length === 0}
                  className="h-9 px-4 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-all shadow-sm disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  保存到 {selectionTotal} 个
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={enterBulkEditMode}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-primary-600 bg-white border-2 border-primary-500/30 hover:border-primary-500 hover:bg-primary-50 rounded-base transition-all"
              >
                <Layers size={13} />
                批量编辑
              </button>
            )}
          </div>
        </div>

        {/* 横向架构图 + 右侧详情面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* Tree pane (left) */}
          <div className="bg-neutral-50/40 border border-neutral-100 rounded-inner p-6 max-h-[640px] overflow-auto custom-scrollbar">
            <div className="space-y-8 min-w-max">
              {campaignTrees.map(tree => {
                const cIdx = tree.campaignIdx;
                const isCampaignMain = selectedNode.type === 'campaign' && selectedNode.campaignIdx === cIdx;
                const isCampaignExtra = selectedExtras.has(`campaign:${cIdx}`);
                const isCampaignSelected = isCampaignMain || isCampaignExtra;
                return (
                  <div key={cIdx} className="grid grid-cols-[100px_1fr] gap-3 items-center">
                    {/* Campaign node — column layout: icon top, label below */}
                    <div className="relative group/cnode sticky top-0">
                      <button
                        onClick={() => handleNodeClick({ type: 'campaign', campaignIdx: cIdx })}
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
                      {/* 多选勾选按钮 — 仅在批量编辑模式下显示 */}
                      {bulkEditMode && (
                        <button
                          type="button"
                          onClick={(e) => toggleNodeSelection({ type: 'campaign', campaignIdx: cIdx }, e)}
                          title={isCampaignExtra ? '移出批量' : isCampaignMain ? '主选（不可移出）' : '加入批量编辑'}
                          className={`absolute top-1 left-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all z-10 ${
                            isCampaignExtra
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : isCampaignMain
                                ? 'bg-primary-500 border-primary-500 text-white opacity-80 cursor-not-allowed'
                                : 'bg-white border-neutral-300 text-transparent hover:border-primary-500 hover:text-primary-400'
                          }`}
                        >
                          {(isCampaignExtra || isCampaignMain) && <Check size={11} strokeWidth={3.5} />}
                        </button>
                      )}
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
                        const isAdsetMain = selectedNode.type === 'adset' && selectedNode.campaignIdx === cIdx && selectedNode.adsetIdx === aIdx;
                        const isAdsetExtra = selectedExtras.has(`adset:${cIdx}:${aIdx}`);
                        const isAdsetSelected = isAdsetMain || isAdsetExtra;
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
                            <div className="relative isolate h-full group/anode">
                              {/* 多选勾选按钮 — 仅在批量编辑模式下显示 */}
                              {bulkEditMode && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleNodeSelection({ type: 'adset', campaignIdx: cIdx, adsetIdx: aIdx }, e)}
                                  title={isAdsetExtra ? '移出批量' : isAdsetMain ? '主选（不可移出）' : '加入批量编辑'}
                                  className={`absolute top-1 left-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all z-10 ${
                                    isAdsetExtra
                                      ? 'bg-primary-500 border-primary-500 text-white'
                                      : isAdsetMain
                                        ? 'bg-primary-500 border-primary-500 text-white opacity-80 cursor-not-allowed'
                                        : 'bg-white border-neutral-300 text-transparent hover:border-primary-500 hover:text-primary-400'
                                  }`}
                                >
                                  {(isAdsetExtra || isAdsetMain) && <Check size={11} strokeWidth={3.5} />}
                                </button>
                              )}
                              <button
                                onClick={() => handleNodeClick({ type: 'adset', campaignIdx: cIdx, adsetIdx: aIdx })}
                                className={`w-full h-full flex flex-col items-center justify-center gap-1 p-2 rounded-base border-2 transition-all ${
                                  isAdsetSelected ? 'bg-primary-50 border-primary-500' : 'bg-white border-neutral-100 hover:border-primary-500/20'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-base flex items-center justify-center ${
                                  primaryType === 'LAL' ? 'bg-purple-50 text-purple-600' :
                                  primaryType === 'INT' ? 'bg-amber-50 text-amber-600' :
                                  'bg-primary-50 text-primary-500'
                                }`}>
                                  <Users size={14} />
                                </div>
                                <div className="text-center min-w-0 w-full">
                                  <p className="text-[11px] font-bold text-neutral-900 truncate leading-tight">Adset {cIdx + 1}.{aIdx + 1}</p>
                                  <p className="text-[9px] text-neutral-400 font-medium truncate leading-tight">{audienceLabel}</p>
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
                              {campaignType === 'CATALOG' ? (() => {
                                const dpaAdId = `dpa::${cIdx}::${aIdx}`;
                                const isDpaSelected = selectedNode.type === 'ad' && selectedNode.adId === dpaAdId;
                                const isDpaExtra = selectedExtras.has(`ad:${cIdx}:${aIdx}:${dpaAdId}`);
                                const isDpaActive = isDpaSelected || isDpaExtra;
                                return (
                                  <div className="relative shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNodeClick({ type: 'ad', campaignIdx: cIdx, adsetIdx: aIdx, adId: dpaAdId });
                                      }}
                                      className={`w-24 h-full rounded-base border-2 bg-gradient-to-br from-primary-50 to-purple-50 flex flex-col items-center justify-center gap-1 px-1.5 text-center transition-all ${
                                        isDpaActive ? 'border-primary-500 ring-2 ring-primary-500/40' : 'border-primary-500/20 hover:border-primary-500/40'
                                      }`}
                                      title="动态目录广告（Dynamic Product Ad）— 点击编辑 ad 字段"
                                    >
                                      <img src="https://img.clipp.io/img/ad_preview_dpa.png" className="w-7 h-7 object-contain" alt="DPA" />
                                      <span className="text-[10px] font-bold text-primary-600 leading-tight">动态目录广告</span>
                                      <span className="text-[8px] text-primary-500/70 font-medium leading-tight">DPA · 自动生成</span>
                                    </button>
                                    {bulkEditMode && (
                                      <button
                                        type="button"
                                        onClick={(e) => toggleNodeSelection({ type: 'ad', campaignIdx: cIdx, adsetIdx: aIdx, adId: dpaAdId }, e)}
                                        title={isDpaExtra ? '移出批量' : isDpaSelected ? '主选' : '加入批量'}
                                        className={`absolute top-1 left-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all z-10 ${
                                          isDpaExtra ? 'bg-primary-500 border-primary-500 text-white'
                                          : isDpaSelected ? 'bg-primary-500 border-primary-500 text-white opacity-80 cursor-not-allowed'
                                          : 'bg-white border-neutral-300 text-transparent hover:border-primary-500 hover:text-primary-400'
                                        }`}
                                      >
                                        {(isDpaExtra || isDpaSelected) && <Check size={11} strokeWidth={3.5} />}
                                      </button>
                                    )}
                                  </div>
                                );
                              })() : (() => {
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
                                  className="shrink-0 relative bg-neutral-50/60 border border-dashed border-neutral-200 rounded-base px-1.5 pt-1 pb-1 h-full flex flex-col group/group"
                                >
                                  {/* 头部 row 1：产品名 · 组名 + 右上 ad_format 切换 + 清空（hover 显示） */}
                                  <div className="flex items-center justify-between gap-1 mb-0.5 px-0.5 max-w-[240px] shrink-0">
                                    <span className="text-[9px] text-neutral-500 truncate leading-tight flex-1 min-w-0">
                                      <span className="text-neutral-400">{productNameById[group.productId] || '—'}</span>
                                      <span className="text-neutral-300 mx-1">·</span>
                                      <span className="text-neutral-600 font-semibold">{group.groupName}</span>
                                    </span>
                                    {/* per-group ad_format 切换器：仅本素材组在本 adset 内的拆分方案 */}
                                    <select
                                      value={getAdFormatForGroup(cIdx, aIdx, group.productId, group.groupId)}
                                      onChange={(e) => setAdFormatForGroup(cIdx, aIdx, group.productId, group.groupId, e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      disabled={campaignType === 'CATALOG'}
                                      title={campaignType === 'CATALOG' ? 'CATALOG 模式由系统自动选择' : '切换此素材组在该 adset 内的拆分 ad 方案'}
                                      className="shrink-0 text-[9px] border border-neutral-200 rounded px-1 py-0 bg-white max-w-[64px] truncate disabled:bg-neutral-50 disabled:text-neutral-400"
                                    >
                                      {adFormatOptions.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                      ))}
                                    </select>
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
                                      group.ads.map((ad, adIndex) => {
                                        const isAdMain = selectedNode.type === 'ad' && selectedNode.adId === ad.id;
                                        const isAdExtra = selectedExtras.has(`ad:${cIdx}:${aIdx}:${ad.id}`);
                                        const isAdActive = isAdMain || isAdExtra;
                                        return (
                                        <div key={ad.id} className="shrink-0 flex flex-col items-center gap-0.5">
                                        <div
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeClick({ type: 'ad', campaignIdx: cIdx, adsetIdx: aIdx, adId: ad.id });
                                          }}
                                          title={`Ad ${adIndex + 1} — 点击编辑 ad 字段`}
                                          className={`relative w-10 h-[68px] rounded-base border bg-neutral-100 shadow-adsgo-card overflow-hidden group/ad cursor-pointer transition-all ${
                                            isAdActive ? 'border-primary-500 ring-2 ring-primary-500/40' : 'border-neutral-100 hover:border-primary-500/40'
                                          }`}
                                        >
                                          {ad.creatives.length > 1 ? (
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
                                          {/* 多选 checkbox — 仅批量编辑模式 */}
                                          {bulkEditMode && (
                                            <button
                                              type="button"
                                              onClick={(e) => toggleNodeSelection({ type: 'ad', campaignIdx: cIdx, adsetIdx: aIdx, adId: ad.id }, e)}
                                              title={isAdExtra ? '移出批量' : isAdMain ? '主选' : '加入批量'}
                                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all z-10 ${
                                                isAdExtra ? 'bg-primary-500 border-primary-500 text-white'
                                                : isAdMain ? 'bg-primary-500 border-primary-500 text-white opacity-80 cursor-not-allowed'
                                                : 'bg-white/90 border-neutral-300 text-transparent hover:border-primary-500 hover:text-primary-400'
                                              }`}
                                            >
                                              {(isAdExtra || isAdMain) && <Check size={9} strokeWidth={3.5} />}
                                            </button>
                                          )}
                                          <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover/ad:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); removeAdFromAdset(cIdx, aIdx, ad.id); }} className="w-4 h-4 bg-white/90 rounded-full flex items-center justify-center text-neutral-500 hover:text-rose-500 shadow" title="删除此 ad">
                                              <X size={9} />
                                            </button>
                                          </div>
                                        </div>
                                        {/* Ad 序号标签 */}
                                        <span className={`text-[9px] font-bold leading-none tabular-nums ${isAdActive ? 'text-primary-600' : 'text-neutral-400'}`}>
                                          Ad{adIndex + 1}
                                        </span>
                                        </div>
                                        );
                                      })
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
          <div className="bg-white border border-neutral-100 rounded-inner p-4 self-start sticky top-4">
            {bulkEditMode ? (() => {
              // Phase 2.H 任务 3：批量编辑 = 复用单选 DetailPanel，字段集 100% 对齐
              // ad 层走 schema 全字段（CORE_FIELDS_V2 决定 core/advanced 分桶），其它两层用 hand-coded labels
              const isAdBulk = selectedNode.type === 'ad';
              const FIELD_LABELS = isAdBulk
                ? (() => {
                    const channelId = platform?.id;
                    if (!channelId) return {};
                    const defs = getFieldDefs(channelId, 'ad').filter(d => !d.hideInUi && !d.excludeFromCreate);
                    return defs.reduce((m, d) => { m[d.name] = d.label || d.name; return m; }, {});
                  })()
                : selectedNode.type === 'campaign' ? {
                    campaignName: '系列名称',
                    objective: '推广目标',
                    adsetGoal: '优化目标（默认）',
                    event: '标准事件（默认）',
                    bidStrategy: '系列出价策略',
                    budgetType: '预算类型',
                    dailyBudget: '日预算',
                  } : {
                    adsetName: '广告组名称',
                    adsetGoal: '成效目标',
                    pixel: 'Pixel',
                    event: '标准事件',
                    bidAmount: '出价金额',
                    selectedLocations: '投放国家/地区',
                    selectedLanguage: '语言',
                    lalInclude: 'LAL 包含',
                    customInclude: '自定义包含',
                    lalExclude: 'LAL 排除',
                    customExclude: '自定义排除',
                    lalOptions: 'LAL 选项',
                    customAudienceOptions: '自定义受众选项',
                    savedAudience: '已保存受众',
                    intOptions: '兴趣定向',
                  };
              const ARRAY_FIELDS = new Set(['selectedLocations', 'lalInclude', 'customInclude', 'lalExclude', 'customExclude', 'lalOptions', 'customAudienceOptions', 'intOptions']);
              const NULL_FIELDS = new Set(['selectedLanguage', 'savedAudience', 'pixel']);
              const mixedFields = [];
              const synth = {};
              Object.keys(FIELD_LABELS).forEach(field => {
                if (Object.prototype.hasOwnProperty.call(bulkEditDraft, field)) {
                  synth[field] = bulkEditDraft[field];
                } else {
                  const { mixed, value } = getBulkFieldState(field);
                  if (mixed) {
                    mixedFields.push(FIELD_LABELS[field]);
                    // ad 层：mixed 字段 levelData 留 undefined（让 DynamicFieldRenderer 自然显示为空），不强行填占位
                    synth[field] = isAdBulk ? undefined : (ARRAY_FIELDS.has(field) ? [] : NULL_FIELDS.has(field) ? null : '');
                  } else {
                    synth[field] = value;
                  }
                }
              });
              const interceptPatch = (patch) => setBulkEditDraft(prev => ({ ...prev, ...patch }));
              const layerLabel = selectedNode.type === 'campaign' ? 'Campaign' : selectedNode.type === 'adset' ? 'Ad Set' : 'Ad';
              return (
                <div className="space-y-3">
                  <div className="bg-amber-50/60 border border-amber-200/60 px-3 py-2 rounded-base">
                    <div className="flex items-center gap-2">
                      <Layers size={13} className="text-amber-600" />
                      <p className="text-xs font-semibold text-amber-700">
                        批量编辑 {selectionTotal} 个 {layerLabel}
                      </p>
                    </div>
                    <p className="text-[11px] text-amber-600 leading-relaxed mt-1">
                      {mixedFields.length > 0
                        ? <>共 <b>{mixedFields.length}</b> 个字段值不一致（显示为空，将以编辑后的值统一覆盖）：{mixedFields.join(' · ')}</>
                        : '所有已选节点字段值相同，可直接编辑。'}
                    </p>
                    <p className="text-[11px] text-amber-600 mt-0.5">改动后点击右上「保存到 {selectionTotal} 个」生效，或「取消」放弃修改。</p>
                  </div>
                  {selectedNode.type === 'campaign' ? (
                    <CampaignDetailPanel
                      campaignIdx={selectedNode.campaignIdx}
                      platform={platform}
                      plan={plan}
                      onSelectExistingCampaign={onSelectCampaign}
                      selectedCampaign={null}
                      isExistingCampaign={false}
                      // 批量模式：levelData = 合成 synth；onFieldChange = 拦截到 bulkEditDraft；inheritanceMap = draft 中的 key 集合
                      levelData={synth}
                      onFieldChange={(name, value) => interceptPatch({ [name]: value })}
                      inheritanceMap={Object.keys(bulkEditDraft || {}).reduce((m, k) => (m[k] = true, m), {})}
                    />
                  ) : selectedNode.type === 'adset' ? (
                    <AdsetDetailPanel
                      platform={platform}
                      campaignIdx={selectedNode.campaignIdx}
                      adsetIdx={selectedNode.adsetIdx}
                      levelData={synth}
                      onFieldChange={(name, value) => interceptPatch({ [name]: value })}
                      inheritanceMap={Object.keys(bulkEditDraft || {}).reduce((m, k) => (m[k] = true, m), {})}
                    />
                  ) : (
                    <AdDetailPanel
                      platform={platform}
                      campaignIdx={selectedNode.campaignIdx}
                      adsetIdx={selectedNode.adsetIdx}
                      adId={selectedNode.adId}
                      adsetFlatIdx={adsetFlatIdxFor(selectedNode.campaignIdx, selectedNode.adsetIdx)}
                      levelData={synth}
                      onFieldChange={(name, value) => interceptPatch({ [name]: value })}
                      inheritanceMap={Object.keys(bulkEditDraft || {}).reduce((m, k) => (m[k] = true, m), {})}
                    />
                  )}
                </div>
              );
            })() : selectedNode.type === 'campaign' ? (
              <CampaignDetailPanel
                campaignIdx={selectedNode.campaignIdx}
                platform={platform}
                plan={plan}
                onSelectExistingCampaign={onSelectCampaign}
                selectedCampaign={selectedCampaign}
                isExistingCampaign={isExistingCampaign}
                formData={formData}
                nodeOverrides={nodeOverrides}
                setNodeOverride={setNodeOverride}
                clearNodeOverride={clearNodeOverride}
              />
            ) : selectedNode.type === 'adset' ? (
              <AdsetDetailPanel
                platform={platform}
                campaignIdx={selectedNode.campaignIdx}
                adsetIdx={selectedNode.adsetIdx}
                flatIdx={adsetFlatIdxFor(selectedNode.campaignIdx, selectedNode.adsetIdx)}
                formData={formData}
                nodeOverrides={nodeOverrides}
                setNodeOverride={setNodeOverride}
                clearNodeOverride={clearNodeOverride}
              />
            ) : (() => {
              const adKey = `${selectedNode.campaignIdx}::${selectedNode.adsetIdx}`;
              const adsList = adsetAds[adKey] || [];
              const adRef = adsList.find(a => a.id === selectedNode.adId);
              const isCatalogPlaceholder = typeof selectedNode.adId === 'string' && selectedNode.adId.startsWith('dpa::');
              if (!adRef && !isCatalogPlaceholder) {
                return <p className="text-xs text-neutral-400">该 ad 不存在或已被删除，请重新选择。</p>;
              }
              return (
                <AdDetailPanel
                  platform={platform}
                  campaignIdx={selectedNode.campaignIdx}
                  adsetIdx={selectedNode.adsetIdx}
                  adId={selectedNode.adId}
                  adRef={adRef}
                  adsetFlatIdx={adsetFlatIdxFor(selectedNode.campaignIdx, selectedNode.adsetIdx)}
                  formData={formData}
                  nodeOverrides={nodeOverrides}
                  setNodeOverride={setNodeOverride}
                  clearNodeOverride={clearNodeOverride}
                  creativeGroupCopyMap={creativeGroupCopyMap}
                />
              );
            })()}
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

    {/* Phase 2.H 任务 3：旧的 modal 保留组件文件但不再 mount（替换为 inline BulkEditPanel） */}
    {false && <BulkEditModal
      open={false}
      onClose={() => {}}
      level={selectedNode.type}
      count={selectionTotal}
      fieldDefs={selectedNode.type === 'campaign' ? [
        { name: 'objective',    label: '推广目标',         type: 'select',
          options: (targetingMeta?.CAMPAIGN_OBJECTIVES || []).map(o => ({ value: o.value, label: o.label })) },
        { name: 'bidStrategy',  label: '系列出价策略',     type: 'select',
          options: (targetingMeta?.BID_STRATEGIES || []).map(b => ({ value: b.value, label: b.label })) },
        { name: 'budgetType',   label: '预算类型 (CBO/ABO)', type: 'select',
          options: [{ value: 'CBO', label: 'CBO（系列预算）' }, { value: 'ABO', label: 'ABO（广告组预算）' }] },
        { name: 'dailyBudget',  label: '日预算',           type: 'currency' },
        { name: 'campaignName', label: '系列名称',         type: 'text' },
      ] : [
        { name: 'adsetGoal',    label: '优化目标',         type: 'select',
          options: (targetingMeta?.ADSET_GOALS_MAPPING?.[objective] || []).map(g => ({ value: g.value, label: g.label })) },
        { name: 'event',        label: '标准事件',         type: 'select',
          options: (targetingMeta?.STANDARD_EVENTS || []).map(e => ({ value: e, label: e })) },
        { name: 'dailyBudget',  label: '日预算',           type: 'currency' },
        { name: 'bidAmount',    label: '出价金额',         type: 'currency' },
        { name: 'adsetName',    label: '广告组名称',       type: 'text' },
      ]}
      onApply={(fieldName, value) => {
        // 写入所有选中节点
        if (selectedNode.type === 'campaign') {
          const idxs = selectedAllNodes.filter(n => n.type === 'campaign').map(n => n.campaignIdx);
          setCampaignConfigs(prev => {
            const next = { ...prev };
            idxs.forEach(idx => {
              next[idx] = { ...(prev[idx] || buildDefaultCampaignConfig()), [fieldName]: value };
            });
            return next;
          });
        } else {
          // adset：写到 adsetAudienceDetails（per-flatIdx override）
          const N = adSetGroups.length || 1;
          selectedAllNodes
            .filter(n => n.type === 'adset')
            .forEach(n => {
              const flatIdx = n.campaignIdx * N + n.adsetIdx;
              const existing = adsetAudienceDetails[flatIdx] || {};
              onSaveAdsetAudienceDetails?.(flatIdx, { ...existing, [fieldName]: value });
            });
        }
        // 应用后保留主选，清空 extras 让用户看到结果
        setSelectedExtras(new Set());
      }}
    />}
    </>
  );
});

CampaignPlanView.displayName = 'CampaignPlanView';

export default CampaignPlanView;
