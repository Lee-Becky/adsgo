import React, { useState, useEffect, useRef } from 'react';
import { 
  Link2, Search, History, ShoppingBag, X, ChevronRight, 
  LayoutGrid, Wand2, 
  Loader2, Globe, Tag, Target, Sparkles, Plus,
  Upload, Check, 
  Trash2, PackageCheck, FileText, Layers, Database,
  Flame, Zap, Info, ChevronDown, ListFilter, Box,
  Facebook, Chrome, ExternalLink, RefreshCw, AlertCircle, ChevronUp,
  ArrowLeft, Edit2, User, Image as ImageIcon, Link2Off, Briefcase,
  AlertTriangle
} from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';
import { useZIndex } from '../../../hooks/useZIndex';
import { generateAIGCCreative } from '../services/mockAiService';
import { authorizePlatform, MOCK_ACCOUNTS } from '../services/authService';

const MOCK_CATALOGS = [
  { id: 'cat_8820192', name: 'Luminaire official catalog 2024' },
  { id: 'cat_1192837', name: 'Seasonal accessories feed' },
  { id: 'cat_5543210', name: 'Best sellers - global' },
];

const ANALYSIS_STEPS = [
  { text: "Task received: Analyzing https://www.cupshe.com with comprehensive product and audience analysis.", type: 'system' },
  { text: "Accessing website", type: 'action_header' },
  { text: "Intelligently capturing core content from the 'E-commerce website' homepage...", type: 'action' },
  { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426", type: 'image' },
  { text: "Analyzing product positioning, features, pricing and use cases", type: 'action_header' },
  { text: "Searching for 'Cupshe brand positioning and target market' analysis data...", type: 'action' },
  { text: "Retrieving 'affordable swimwear market' consumer behavior insights...", type: 'action' },
  { text: "Extracting 'Cupshe product characteristics' and user feedback data...", type: 'action' },
  { text: "Brand Positioning:", value: "Cupshe is an affordable fashion swimwear and resortwear brand targeting budget-conscious millennial and Gen Z women. Originally founded in Nanjing, China in 2015, the brand pivoted from general fast fashion to focus exclusively on swimwear in 2016 after identifying a market gap for stylish, affordable swimsuits in North America (Target audience: annual income $30k-70k / 18-45 years old, with core demographic 25-34 years).", type: 'key_value' },
  { text: "Business Type:", value: "Online Shopping", type: 'key_value' },
  { text: "Product Pricing:", value: "$25-$43 per item (budget-to-mid-range market). Bikini sets average $39, one-pieces $35-$43, resortwear/dresses $25-$32. This positions Cupshe significantly below premium brands like Victoria's Secret while maintaining higher quality than ultra-cheap competitors.", type: 'key_value' },
  { text: "Core Selling Points:", type: 'header' },
  { text: "Affordable trend-forward designs - Fashion-conscious styles at accessible price points", type: 'bullet' },
  { text: "Inclusive sizing - Up to 4X sizing for diverse body types", type: 'bullet' },
  { text: "Direct-to-consumer model - Leveraging China's supply chain advantages for cost efficiency", type: 'bullet' },
  { text: "Year-round collections - Beyond seasonal swimwear with resortwear, dresses, and shapewear", type: 'bullet' },
  { text: "Strong digital presence - 6M+ monthly website visitors, 2,000+ units/month on Amazon", type: 'bullet' },
  { text: "Use Cases:", type: 'header' },
  { text: "Beach vacations & resort holidays - Core swimwear and cover-ups for leisure travel", type: 'ordered' },
  { text: "Poolside lounging & water sports - Functional yet stylish swimwear for active use", type: 'ordered' },
  { text: "Everyday summer wear - Resortwear, dresses, and casual pieces for warm-weather lifestyle", type: 'ordered' },
  { text: "💡 Data Source: CJDropshipping brand analysis + Mordor Intelligence market research + Cupshe official website + Trustpilot customer reviews (4.3/5 rating, 22K+ reviews)", type: 'source' },
  { text: "AdsGo has created a brand profile based on your page. Please review the information — it'll be used in future ad generation and optimization.", type: 'footer' }
];

const HISTORY_PRODUCTS = [
  { id: 'h1', name: '意式复古灯芯绒外套', url: 'shop.com/products/vintage-coat', imageUrl: 'https://picsum.photos/seed/coat/400/400' },
  { id: 'h2', name: '极简主义皮靴', url: 'shop.com/products/boots', imageUrl: 'https://picsum.photos/seed/boots/400/400' },
  { id: 'h3', name: '真丝眼罩', url: 'shop.com/products/silk-mask', imageUrl: 'https://picsum.photos/seed/silk-mask/400/400' },
  { id: 'h4', name: '', url: 'shop.com/products/unknown', imageUrl: '' },
];

const SHOPIFY_PRODUCTS = [
  { id: 's1', name: 'Summer linen shirt', url: 'myshopify.com/linen-shirt', imageUrl: 'https://picsum.photos/seed/shirt/400/400' },
  { id: 's2', name: 'Canvas tote bag', url: 'myshopify.com/tote', imageUrl: 'https://picsum.photos/seed/tote/400/400' },
  { id: 's3', name: 'Leather sandals', url: 'myshopify.com/sandals', imageUrl: 'https://picsum.photos/seed/sandals/400/400' },
];

const META_PRODUCTS = [
  { id: 'm1', name: 'Facebook ad product 1', url: 'facebook.com/p1', imageUrl: 'https://picsum.photos/seed/meta1/400/400' },
  { id: 'm2', name: 'Facebook ad product 2', url: 'facebook.com/p2', imageUrl: 'https://picsum.photos/seed/meta2/400/400' },
];

const GOOGLE_PRODUCTS = [
  { id: 'g1', name: 'Google GMC product 1', url: 'google.com/p1', imageUrl: 'https://picsum.photos/seed/google1/400/400' },
  { id: 'g2', name: 'Google GMC product 2', url: 'google.com/p2', imageUrl: 'https://picsum.photos/seed/google2/400/400' },
];

const CREATIVE_LIBRARY = [
  { id: 'lib1', name: '夏日清爽饮品海报', url: 'https://picsum.photos/seed/creative1/400/600' },
  { id: 'lib2', name: '极简风格家居展示', url: 'https://picsum.photos/seed/creative2/400/600' },
  { id: 'lib3', name: '户外运动装备特写', url: 'https://picsum.photos/seed/creative3/400/600' },
  { id: 'lib4', name: '都市职场女性穿搭', url: 'https://picsum.photos/seed/creative4/400/600' },
  { id: 'lib5', name: '科技感电子产品渲染', url: 'https://picsum.photos/seed/creative5/400/600' },
  { id: 'lib6', name: '复古黑胶唱片包装', url: 'https://picsum.photos/seed/creative6/400/600' },
  { id: 'lib7', name: '高端护肤品宣传照', url: 'https://picsum.photos/seed/creative7/400/600' },
  { id: 'lib8', name: '自然有机食品摄影', url: 'https://picsum.photos/seed/creative8/400/600' },
];

const ADD_OPTIONS = [
  {
    id: 'shopify',
    title: 'Sync from Shopify',
    subtitle: 'Automatically import and update all your products from Shopify',
    logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg'
  },
  {
    id: 'meta',
    title: 'Sync from Meta feeds',
    subtitle: 'Import products directly from your Meta Commerce Manager',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'
  },
  {
    id: 'gmc',
    title: 'Sync from Google GMC',
    subtitle: 'Import products directly from your Google Merchant Center',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
  },
  {
    id: 'url',
    title: 'Import from URL',
    subtitle: 'Paste a product page link and we\'ll pull the details for you',
    icon: ExternalLink
  },
  {
    id: 'setup',
    title: 'Enter manually',
    subtitle: 'Manually enter all the product details',
    icon: Edit2,
    isManual: true
  }
];

const PLATFORM_ICONS = [
  { id: 'amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { id: 'shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
  { id: 'etsy', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg' },
  { id: 'ebay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ebay_logo.svg' },
  { id: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 'playstore', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg' },
  { id: 'wordpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Wordpress-Logo.svg' },
  { id: 'wix', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Wix.com_website_logo.svg' }
];

const NanoBananaSkeleton = () => (
  <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-indigo-100 bg-indigo-50/30 animate-pulse flex flex-col items-center justify-center gap-1">
    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
      <Loader2 size={12} className="text-indigo-400 animate-spin" />
    </div>
    <span className="text-[6px] font-black text-indigo-300 uppercase tracking-tighter text-center px-1">Nano Banana</span>
    <span className="text-[5px] font-bold text-indigo-200 uppercase text-center">Generating...</span>
  </div>
);

// --- Helper components ---

const TagEditor = ({ tags = [], onTagsChange, placeholder, label = "" }) => {
  const [val, setVal] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F4FF] border border-[#E0E7FF] rounded-2xl text-[13px] font-black text-[#312E81] transition-all hover:bg-[#E0E7FF] animate-in zoom-in-95 duration-200 cursor-default group/tag shadow-sm">
          {t}<button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="text-[#94A3B8] hover:text-[#EF4444] transition-colors"><X size={14} strokeWidth={3} /></button>
        </span>
      ))}
      <div className="relative group/input min-w-[120px]">
        <input className="bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-2xl px-4 py-2 text-[13px] font-bold text-[#64748B] outline-none w-full transition-all focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 shadow-inner placeholder:text-[#CBD5E1]" placeholder={tags.length === 0 ? placeholder : `+ ${label}`} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { e.preventDefault(); if (!tags.includes(val.trim())) { onTagsChange([...tags, val.trim()]); } setVal(''); } }} />
      </div>
    </div>
  );
};

const AssetGrid = ({ title, subtitle, assets = [], onAssetsChange, maxCount = 99, showExamples = false, isExpandable = false, isExpanded = false, onToggle }) => {
  const fileInputRef = useRef(null);
  const displayAssets = isExpandable && !isExpanded ? assets.slice(0, 3) : assets;
  const moreCount = assets.length - 3;
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newAssets = files.map(file => ({ url: URL.createObjectURL(file), file }));
    if (onAssetsChange) onAssetsChange([...assets, ...newAssets].slice(0, maxCount));
    e.target.value = '';
  };
  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} className="hidden" multiple={maxCount > 1} accept="image/*,video/*" onChange={handleFileChange} />
      <div className="flex items-center justify-between"><div className="space-y-1"><div className="flex items-center gap-2"><div className="w-1 h-3 bg-blue-400 rounded-full" /><h5 className="text-[13px] font-black text-slate-900">{title}</h5></div><p className="text-[10px] text-slate-400 font-medium leading-tight">{subtitle}</p></div></div>
      <div className={`flex flex-wrap gap-4 items-start ${isExpandable && !isExpanded ? 'overflow-hidden max-h-[140px]' : ''}`}>
        {assets.length < maxCount && (
          <div onClick={() => fileInputRef.current?.click()} className="w-[140px] aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group active:scale-[0.97] shrink-0"><Plus size={32} className="text-slate-300 group-hover:text-indigo-50 transition-colors" /></div>
        )}
        {displayAssets.map((asset, i) => (
          <div key={i} className="w-[140px] aspect-square bg-white border border-slate-100 rounded-[24px] relative overflow-hidden group shadow-sm hover:shadow-md transition-all shrink-0">
            <img src={asset.url || `https://picsum.photos/seed/${title}${i}/300/300`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button onClick={() => onAssetsChange(assets.filter((_, idx) => idx !== i))} className="p-2 bg-white rounded-xl text-rose-500 shadow-lg hover:scale-110 active:scale-90 transition-all"><Trash2 size={14} /></button></div>
          </div>
        ))}
        {isExpandable && !isExpanded && assets.length > 4 && (
          <div onClick={onToggle} className="w-[140px] aspect-square bg-slate-900 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-black transition-all shadow-xl group shrink-0"><span className="text-lg font-black text-white">{moreCount} more</span><span className="text-[10px] font-bold text-white/60 tracking-widest mt-1">assets</span></div>
        )}
        {isExpandable && isExpanded && (
          <div onClick={onToggle} className="w-[140px] aspect-square bg-slate-100 border border-slate-200 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all group shrink-0"><ChevronRight size={24} className="text-slate-400 rotate-180 mb-1" /><span className="text-[10px] font-black text-slate-50 tracking-widest">collapse</span></div>
        )}
      </div>
    </div>
  );
};

const SearchableSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/5' : error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}><span className={!value ? 'text-slate-300' : ''}>{selectedOption ? selectedOption.label : placeholder}</span><ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></div>
      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearchable && (<div className="p-3 border-b border-slate-50 bg-slate-50/50"><input autoFocus className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-400" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>)}
          <div className="max-h-[240px] overflow-y-auto p-2">{filteredOptions.map(opt => (<div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer mb-1 last:mb-0 ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'}`}>{opt.label}</div>))}</div>
        </div>
      )}
    </div>
  );
};

const SearchableTreeSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredParent, setHoveredParent] = useState(null);
  const filteredTree = options.map(parent => ({ ...parent, children: parent.children ? parent.children.filter(child => child.label.toLowerCase().includes(searchTerm.toLowerCase()) || parent.label.toLowerCase().includes(searchTerm.toLowerCase())) : [] })).filter(parent => (parent.children && parent.children.length > 0) || parent.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const getDisplayValue = () => {
    if (!value) return placeholder;
    for (const parent of options) {
      const child = parent.children?.find(c => c.value === value);
      if (child) return child.label;
      if (parent.value === value) return parent.label;
    }
    return placeholder;
  };
  useEffect(() => { if (value && !hoveredParent) { const parent = options.find(p => p.children?.some(c => c.value === value)); if (parent) setHoveredParent(parent); } }, [value, options, hoveredParent]);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/5' : error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}><span className={!value ? 'text-slate-300' : ''}>{getDisplayValue()}</span><ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></div>
      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-[560px] bg-white border border-slate-100 rounded-[24px] shadow-2xl flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 h-[380px]">
          <div className={`w-[240px] border-r border-slate-100 flex flex-col bg-slate-50/30`}>
            {isSearchable && (<div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input autoFocus className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>)}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">{filteredTree.map((parent) => (<div key={parent.value} onMouseEnter={() => setHoveredParent(parent)} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all mb-1 flex items-center justify-between group ${hoveredParent?.value === parent.value ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}><span className="truncate pr-2">{parent.label}</span>{parent.children?.length > 0 && <ChevronRight size={14} className={`transition-transform ${hoveredParent?.value === parent.value ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`} />}</div>))}</div>
          </div>
          <div className="flex-1 bg-white flex flex-col">
            <div className="p-4 border-b border-slate-50"><h6 className="text-[10px] font-black text-slate-400 tracking-widest">{hoveredParent ? hoveredParent.label : 'Select category'}</h6></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {hoveredParent?.children?.length > 0 ? (<div className="grid grid-cols-1 gap-1">{hoveredParent.children.map((child) => (<div key={child.value} onClick={() => { onChange(child.value); setIsOpen(false); setSearchTerm(''); }} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${value === child.value ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>{child.label}</div>))}</div>) : (<div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center"><div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3"><Layers size={20} className="opacity-20" /></div><p className="text-[10px] font-bold tracking-tighter opacity-40">{hoveredParent ? 'No sub-categories' : 'Hover a category to view details'}</p></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SelectionModal ---

const SelectionModal = ({ 
  type, onClose, authStatus, anyConnected, isAddModalOpen, 
  handleAuthorize, isAuthLoading, setIsAddModalOpen,
  selectedProducts, onSelectProducts, onUpdateCreatives,
  productCreatives, modalContext
}) => {
  const zIndex = useZIndex(true);
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState(new Set());
  const [activePlatform, setActivePlatform] = useState('ALL');
  
  const isCurrentPlatformConnected = activePlatform === 'ALL' ? anyConnected : authStatus[activePlatform];
  const [isFetchingProducts, setIsFetchingProducts] = useState(isCurrentPlatformConnected && !isAddModalOpen);

  useEffect(() => {
    if (isCurrentPlatformConnected && !isAddModalOpen) {
      setIsFetchingProducts(true);
      const timer = setTimeout(() => setIsFetchingProducts(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsFetchingProducts(false);
    }
  }, [activePlatform, isCurrentPlatformConnected, isAddModalOpen]);

  const getItems = () => {
    if (type !== 'shopify') return type === 'history' ? HISTORY_PRODUCTS : CREATIVE_LIBRARY;
    if (activePlatform === 'ALL') {
      let all = [];
      if (authStatus.shopify) all = [...all, ...SHOPIFY_PRODUCTS];
      if (authStatus.meta) all = [...all, ...META_PRODUCTS];
      if (authStatus.google) all = [...all, ...GOOGLE_PRODUCTS];
      return all;
    }
    if (activePlatform === 'shopify' && authStatus.shopify) return SHOPIFY_PRODUCTS;
    if (activePlatform === 'meta' && authStatus.meta) return META_PRODUCTS;
    if (activePlatform === 'google' && authStatus.google) return GOOGLE_PRODUCTS;
    return [];
  };

  const items = getItems();
  const filtered = items.filter(i => {
    if (type === 'creative_lib') return true;
    return i.name?.toLowerCase().includes(search.toLowerCase()) || i.url?.toLowerCase().includes(search.toLowerCase());
  });

  const toggleItem = (id) => {
    const next = new Set(localSelected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setLocalSelected(next);
  };

  const needsConnection = type === 'shopify' && !isCurrentPlatformConnected;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-xl font-black text-slate-900">{type === 'history' ? '历史分析产品库' : type === 'shopify' ? '请选择products' : '从创意素材库选择'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><X size={24} /></button>
        </div>
        {type === 'shopify' && (
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4 shrink-0">
            {anyConnected && (<button onClick={() => setIsAddModalOpen(true)} className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all shrink-0 group" title="Connect product data source"><Plus size={20} className="group-hover:rotate-90 transition-transform" /></button>)}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {[{ id: 'ALL', label: '全部', icon: <Box size={14} /> }, { id: 'shopify', label: 'Shopify', icon: <ShoppingBag size={14} />, color: 'text-emerald-600' }, { id: 'meta', label: 'Facebook feeds', icon: <Facebook size={14} />, color: 'text-blue-600' }, { id: 'google', label: 'Google GMC', icon: <Chrome size={14} />, color: 'text-orange-500' }].map(p => (
                <button key={p.id} onClick={() => setActivePlatform(p.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activePlatform === p.id ? 'bg-slate-900 text-white shadow-md' : `${p.color || 'text-slate-400'} hover:bg-slate-50`} ${p.id !== 'ALL' && !authStatus[p.id] ? 'opacity-60' : ''}`}>{p.icon} {p.label}</button>
              ))}
            </div>
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" autoFocus placeholder="搜索商品名称、链接..." className="w-full pl-12 pr-4 h-11 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold focus:border-indigo-500 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative min-h-[400px]">
          {isAuthLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[150] animate-in fade-in"><Loader2 size={48} className="text-indigo-600 animate-spin mb-4" /><p className="text-sm font-black text-slate-900 tracking-widest">正在拉取并同步云端商品数据...</p></div>
          ) : isFetchingProducts ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 animate-in fade-in"><Loader2 size={48} className="text-indigo-600 animate-spin mb-4" /><p className="text-sm font-black text-slate-900 tracking-widest">Fetching products data...</p></div>
          ) : needsConnection ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6"><ShoppingBag size={40} /></div>
              <p className="text-sm text-slate-400 font-bold mb-8 max-w-sm">Connect your store to sync products automatically or manually set up a product for analysis.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"><Plus size={20} /> Connect product data source</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center opacity-40"><AlertCircle size={48} className="mb-4" /><p className="text-sm font-bold">未找到符合条件的产品</p></div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSel = localSelected.has(item.id);
                return (
                  <div key={item.id} onClick={() => toggleItem(item.id)} className={`relative p-3 bg-white border-2 rounded-2xl transition-all cursor-pointer group ${isSel ? 'border-indigo-600 shadow-lg shadow-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-slate-50">
                      {(item.imageUrl || item.url) ? (<img src={item.imageUrl || item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />) : (<div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300 bg-slate-50"><PackageCheck size={32} /><span className="text-[8px] font-black">暂无预览图</span></div>)}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${isSel ? 'bg-indigo-600 border-indigo-600' : 'bg-black/20 border-white/40'}`}>{isSel && <Check size={14} className="text-white" />}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-800 truncate px-1">
                        {item.name || (type === 'creative_lib' ? '未命名创意' : '未命名产品')}
                      </p>
                      {type !== 'creative_lib' && (
                        <div className="flex items-center gap-1.5 px-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Link2 size={10} />
                          <p className="text-[8px] font-bold text-slate-400 truncate">{item.url}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 sticky bottom-0 z-20">
          <div className="text-sm font-bold text-slate-400">
            {type === 'creative_lib' ? '已选 ' : '已选中 '}
            <span className="text-indigo-600 font-black">{localSelected.size}</span> 
            {type === 'creative_lib' ? ' 个创意' : ' 个项目'}
          </div>
          <button disabled={localSelected.size === 0} onClick={() => {
            const randomSuffix = () => Math.random().toString(36).substring(2, 9);
            if (type === 'creative_lib') {
              const selectedCreatives = CREATIVE_LIBRARY.filter(i => localSelected.has(i.id));
              const newCreatives = selectedCreatives.map(c => ({ 
                ...c, 
                id: `${c.id}-${Date.now()}-${randomSuffix()}`, 
                productId: modalContext 
              }));
              onUpdateCreatives(modalContext, prev => [...prev, ...newCreatives]);
            } else {
              const pool = getItems();
              const toAdd = pool.filter(i => localSelected.has(i.id) && !selectedProducts.some(p => p.id === i.id))
                                .map(p => ({ ...p, isFromHistory: type === 'history' }));
              onSelectProducts([...selectedProducts, ...toAdd]);
            }
            onClose();
          }} className={`px-10 py-4 rounded-2xl font-black tracking-widest shadow-xl transition-all ${localSelected.size === 0 ? 'bg-slate-200 text-white cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-black'}`}>
            {type === 'creative_lib' ? '确认' : '确认选择产品'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ProductSelector component ---

const ProductSelector = ({ selectedProducts, onSelectProducts, productCreatives, onUpdateCreatives, onAnalysisStart, onAnalysisComplete, onReset, hasGeneratedOnce, analysisFinished, isAnalyzing, campaignType, onCampaignTypeChange, selectedAccount, onSelectAccount }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState({ shopify: false, meta: false, google: false });
  const [currentStep, setCurrentStep] = useState(0);
  const [reports, setReports] = useState({});
  const [showReportFor, setShowReportFor] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalContext, setModalContext] = useState(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedProductSet, setSelectedProductSet] = useState('All Products');
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [setDropdownOpen, setSetDropdownOpen] = useState(false);
  const [batchAIGCCount, setBatchAIGCCount] = useState(3);
  const [batchAIGCExclusions, setBatchAIGCExclusions] = useState(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState('options');
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [shopifyStoreName, setShopifyStoreName] = useState('My Awesome Store');
  const [productUrl, setProductUrl] = useState('');
  const [isImportAnalyzing, setIsImportAnalyzing] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [syncStates, setSyncStates] = useState({ gmc: { isConnected: false, isConnecting: false, email: '' }, meta: { isConnected: false, isConnecting: false, email: '' } });
  const [productForm, setProductForm] = useState({ name: '', url: '', category: '', description: '', priceRange: '', type: 'Non-type', usps: [''], positioning: { valueProposition: [], features: [], usageScenarios: [], painPoints: [], buyingMotivations: [] }, audience: [{ id: Date.now(), name: 'Audience name', age: '', gender: 'All', traits: [] }], assets: { main: [], detailed: [], demo: [], testimonial: [], lifestyle: [], painpoints: [], comparison: [], result: [], others: [], problem: [], intro: [], action: [], environment: [], team: [] } });

  const [generatingCounts, setGeneratingCounts] = useState({});
  const [selectedMatchOptions, setSelectedMatchOptions] = useState(new Set(['24h']));

  const anyConnected = Object.values(authStatus).some(v => v);
  
  // 判断是否所有产品都已就绪（分析完成或来自历史记录无需分析）
  const allReady = analysisFinished || (isAnalyzing && selectedProducts.length > 0 && selectedProducts.every(p => p.isFromHistory));

  const handleImportAnalyzeUrl = () => {
    if (!productUrl) { setUrlError('Please provide a valid product URL'); return; }
    setUrlError('');
    setIsImportAnalyzing(true);
    setProductForm(prev => ({ ...prev, name: 'AdsGo AI – Your 24/7 AI Ad Expert', url: productUrl, description: 'Start your campaign today to achieve these results with AdsGo AI.' }));
    setTimeout(() => { setIsImportAnalyzing(false); setAddStep('setup'); }, 5000);
  };

  const handleCreateProduct = (formData) => {
    const newProduct = { id: `manual-${Date.now()}`, name: formData.name, url: formData.url, imageUrl: formData.assets.main?.[0]?.url || `https://picsum.photos/seed/${Date.now()}/400/400` };
    onSelectProducts([...selectedProducts, newProduct]);
    closeAddModal();
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsImportAnalyzing(false);
    setProductUrl('');
    setUrlError('');
    setAddStep('options');
  };

  const handleAuthorize = async (platform) => {
    setIsAuthLoading(true);
    const success = await authorizePlatform(platform);
    if (success) { 
      setAuthStatus(prev => ({ ...prev, [platform]: true })); 
      if (platform === 'shopify') setIsShopifyConnected(true);
      if (platform === 'meta' || platform === 'google') {
        setSyncStates(prev => ({ ...prev, [platform]: { isConnected: true, isConnecting: false, email: 'user@example.com' } }));
        // 授权成功后，如果尚未选择账号，立即弹出选择账号弹窗
        if (!selectedAccount) {
          setActiveModal('select_account');
        }
      }
    }
    setIsAuthLoading(false);
  };

  const removeProduct = (id) => { onSelectProducts(selectedProducts.filter(p => p.id !== id)); };

  const analysisEndRef = useRef(null);
  const scrollToBottom = () => {
    analysisEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAnalyzing) {
      if (selectedProducts.length > 0) { setExpandedAnalysisId(selectedProducts[0].id); }
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= ANALYSIS_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              const mockReports = {};
              selectedProducts.forEach(p => { mockReports[p.id] = { summary: `${p.name} 网页核心卖点：高品质复古设计，适用于多种场景。`, recommendedAudience: "25-45 岁，对极简主义和高质感生活有追求的都市人群。", competitors: ["Lululemon", "Everlane", "Zara Home"] }; });
              setReports(mockReports);
              onAnalysisComplete(mockReports);
            }, 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(interval);
    } else { setCurrentStep(0); }
  }, [isAnalyzing, onAnalysisComplete, selectedProducts]);

  useEffect(() => {
    if (isAnalyzing) scrollToBottom();
  }, [currentStep, isAnalyzing]);

  const handleBatchAIGC = async () => {
    setActiveModal(null);
    const productsToGenerate = selectedProducts.filter(p => !batchAIGCExclusions.has(p.id));
    
    setGeneratingCounts(prev => {
      const next = { ...prev };
      productsToGenerate.forEach(p => { next[p.id] = (next[p.id] || 0) + batchAIGCCount; });
      return next;
    });

    // 并行处理每个产品，但产品内部的创意逐个生成并即时显示
    await Promise.all(productsToGenerate.map(async (p) => {
      for (let i = 0; i < batchAIGCCount; i++) {
        try {
          const url = await generateAIGCCreative(`Batch generation ${i} for ${p.name}`);
          const newCreative = { id: `aigc-batch-${Date.now()}-${i}-${p.id}-${Math.random()}`, url, productId: p.id };
          // 逐个更新，使用函数式更新确保不丢失前一个创意
          onUpdateCreatives(p.id, prev => [...prev, newCreative]);
        } finally {
          // 生成完成后减少骨架屏数量
          setGeneratingCounts(prev => ({ ...prev, [p.id]: Math.max(0, (prev[p.id] || 1) - 1) }));
        }
      }
    }));
  };

  const handleBatchMatch = () => {
    setActiveModal(null);
    selectedProducts.forEach(p => {
      const matched = CREATIVE_LIBRARY.slice(0, 2).map(c => ({
        ...c,
        id: `matched-${c.id}-${p.id}-${Date.now()}-${Math.random()}`,
        productId: p.id
      }));
      onUpdateCreatives(p.id, prev => [...prev, ...matched]);
    });
  };

  const handleAIGCForProduct = async (id) => {
    setGeneratingCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    try {
      const url = await generateAIGCCreative("Advertising product photography");
      const newCreative = { id: `aigc-${Date.now()}-${Math.random()}`, url, productId: id };
      onUpdateCreatives(id, prev => [...prev, newCreative]);
    } finally {
      setGeneratingCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 1) - 1) }));
    }
  };

  const handleUploadForProduct = (id) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const newCreative = { id: `upload-${Date.now()}-${Math.random()}`, url, productId: id };
        onUpdateCreatives(id, [...(productCreatives[id] || []), newCreative]);
      }
    };
    input.click();
  };

  const handleSyncConnect = (platform) => {
    setSyncStates(prev => ({ ...prev, [platform]: { ...prev[platform], isConnecting: true } }));
    setTimeout(() => { 
      setSyncStates(prev => ({ ...prev, [platform]: { isConnected: true, isConnecting: false, email: 'user@example.com' } })); 
      setAuthStatus(prev => ({ ...prev, [platform]: true }));
    }, 3000);
  };

  const handleSyncDisconnect = (platform) => {
    setSyncStates(prev => ({ ...prev, [platform]: { isConnected: false, isConnecting: false, email: '' } }));
    setAuthStatus(prev => ({ ...prev, [platform]: false }));
  };

  return (
    <div className="space-y-10">
      <div className={`relative transition-all duration-500 ${(analysisFinished || isAnalyzing) ? 'pointer-events-none select-none' : ''}`}>
        {(analysisFinished || isAnalyzing) && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] rounded-[2.5rem] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer" onClick={onReset}>
            <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black tracking-widest transform scale-95 group-hover:scale-100 transition-all flex items-center gap-2">
              <RefreshCw size={16} /> 重新添加产品
            </button>
          </div>
        )}
        <div className={(analysisFinished || isAnalyzing) ? 'opacity-40 grayscale-[0.5] blur-[0.5px]' : ''}>
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100/50 p-1 rounded-2xl border border-slate-100 flex items-center shadow-sm">
              <button onClick={() => onCampaignTypeChange('PRODUCT')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${campaignType === 'PRODUCT' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>投放产品广告</button>
              <button onClick={() => onCampaignTypeChange('CATALOG')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${campaignType === 'CATALOG' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>投放目录广告</button>
            </div>
          </div>
          {campaignType === 'PRODUCT' ? (
            <div className="space-y-6">
              <div className="relative">
                {hasGeneratedOnce && (
                  <div className="absolute -top-4 left-6 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full shadow-lg border border-white/20">
                      <PackageCheck size={12} className="text-indigo-200" />
                      <span className="text-[9px] font-black tracking-widest">出品</span>
                    </div>
                    <div className="w-[2px] h-4 bg-indigo-600 ml-5 opacity-50"></div>
                  </div>
                )}
                <div className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-6 flex items-center gap-6 focus-within:bg-white focus-within:border-indigo-500 transition-all ${selectedProducts.length > 0 ? 'border-slate-300' : ''}`}>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100"><Link2 size={24} /></div>
                  <input type="text" placeholder="粘贴投放目标 URL，回车立即解析..." className="flex-1 bg-transparent border-none outline-none text-base font-medium text-slate-800 placeholder:text-slate-300" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && urlInput) { const newP = { id: `manual-${Date.now()}`, name: `落地页商品 - ${selectedProducts.length + 1}`, url: urlInput, imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400` }; onSelectProducts([...selectedProducts, newP]); setUrlInput(''); } }} />
                </div>
              </div>
              <div className="flex gap-4 px-2">
                <button onClick={() => setActiveModal('history')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"><History size={14} /> 从产品库选择历史商品</button>
                <button onClick={() => setActiveModal('shopify')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"><ShoppingBag size={14} /> 从 Shopify 选择产品</button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
              {!authStatus.meta ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><Facebook size={32} /></div>
                  <div className="max-w-md space-y-2">
                    <h4 className="text-lg font-black text-slate-900">投放目录广告需先授权 Meta feeds</h4>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">我们需要访问您的 Meta 广告账户以获取目录（Catalog）及其关联的产品系列（Product Sets）数据。</p>
                  </div>
                  <button onClick={() => handleAuthorize('meta')} disabled={isAuthLoading} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-3">{isAuthLoading ? <Loader2 size={20} className="animate-spin" /> : <Facebook size={20} />}立即连接</button>
                </div>
              ) : !selectedAccount ? (
                <div className="bg-indigo-50/50 border-2 border-indigo-100 rounded-[2.5rem] p-10 flex items-center justify-between animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><RefreshCw size={28} className="animate-spin-slow" /></div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Meta 已授权，请选择关联广告账户</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">Found 2 available accounts</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal('select_account')} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">选择广告账户</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">选择目录 (catalog)</label>
                    <div onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)} className={`flex items-center justify-between p-6 bg-white border-2 rounded-[1.5rem] cursor-pointer hover:border-indigo-600 hover:shadow-lg transition-all ${catalogDropdownOpen ? 'border-indigo-600 shadow-lg' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Database size={22} /></div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{selectedCatalog?.name || '请选择一个目录...'}</p>
                          {selectedCatalog && <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">id: {selectedCatalog.id}</p>}
                        </div>
                      </div>
                      <ChevronDown size={14} className={`text-slate-300 transition-transform ${catalogDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {catalogDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {MOCK_CATALOGS.length > 0 ? (
                          MOCK_CATALOGS.map(c => (
                            <div key={c.id} onClick={() => { setSelectedCatalog(c); setCatalogDropdownOpen(false); }} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                              <div>
                                <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest">id: {c.id}</p>
                              </div>
                              {selectedCatalog?.id === c.id && <Check size={16} className="text-indigo-600" />}
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center space-y-4">
                            <AlertCircle size={32} className="mx-auto text-slate-200" /><p className="text-xs font-bold text-slate-400">暂无可用目录，请先在 Meta 后台创建</p>
                            <a href="#" className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-600 tracking-widest hover:underline"><ExternalLink size={12} /> 查看 Meta feeds 创建帮助文档</a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">产品系列 (Product set)</label>
                    <div onClick={() => setSetDropdownOpen(!setDropdownOpen)} className={`flex items-center justify-between p-6 bg-white border-2 rounded-[1.5rem] cursor-pointer hover:border-indigo-600 hover:shadow-lg transition-all ${setDropdownOpen ? 'border-indigo-600 shadow-lg' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><ListFilter size={22} /></div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{selectedProductSet || '选择产品系列...'}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">set criteria</p>
                        </div>
                      </div>
                      <ChevronDown size={14} className={`text-slate-300 transition-transform ${setDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {setDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {['All Products', 'Best Sellers', 'New Arrivals'].map(s => (
                          <div key={s} onClick={() => { setSelectedProductSet(s); setSetDropdownOpen(false); }} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{s}</p>
                            {selectedProductSet === s && <Check size={16} className="text-indigo-600" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {!analysisFinished && !isAnalyzing && selectedProducts.length > 0 && campaignType === 'PRODUCT' && (
            <div className="flex flex-col items-center pt-8 border-t border-slate-50 space-y-10 animate-in fade-in slide-in-from-bottom-6">
              <div className="w-full flex flex-col items-center space-y-8">
                <div className="w-full max-w-4xl space-y-4">
                  <div className="flex items-center justify-between px-6">
                    <h5 className="text-[10px] font-black text-slate-400 tracking-widest flex items-center gap-2"><Layers size={14} className="text-indigo-400" /> 待解析产品清单 ({selectedProducts.length})</h5>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">Ready for agent deep scan</p>
                  </div>
                  <div className="w-full space-y-3 px-2">
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="group relative flex items-center justify-between bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0 relative bg-slate-50">
                            {p.imageUrl ? (<img src={p.imageUrl} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={16} /></div>)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate max-w-xs">{p.name || '未命名产品'}</p>
                            <div className="flex items-center gap-1.5 mt-1 opacity-60">
                              <Link2 size={12} className="shrink-0 text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-400 truncate max-w-xs">{p.url}</p>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeProduct(p.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={onAnalysisStart} className="h-24 px-20 bg-slate-900 text-white rounded-[3rem] text-lg font-black tracking-widest flex items-center gap-6 hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group">
                  <Wand2 size={32} className="group-hover:rotate-12 transition-transform" /> 开启 {selectedProducts.length} 个产品的智能并行解析与生产 <ChevronRight size={32} />
                </button>
              </div>
              <p className="text-xs text-slate-400 font-bold tracking-[0.3em]">Next-gen media planning system</p>
            </div>
          )}
          {!analysisFinished && !isAnalyzing && campaignType === 'CATALOG' && selectedCatalog && (
            <div className="flex flex-col items-center pt-8 border-t border-slate-50 space-y-10 animate-in fade-in slide-in-from-bottom-6">
              <button onClick={() => onAnalysisComplete({})} className="h-24 px-20 bg-slate-900 text-white rounded-[3rem] text-lg font-black tracking-widest flex items-center gap-6 hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group"><Box size={32} className="group-hover:scale-110 transition-transform" /> 配置 {selectedProductSet} 的 feeds 广告结构 <ChevronRight size={32} /></button>
              <p className="text-xs text-slate-400 font-bold tracking-[0.3em]">Next-gen media planning system</p>
            </div>
          )}
        </div>
      </div>
      {campaignType === 'PRODUCT' && (analysisFinished || isAnalyzing) && (
        <section className="animate-in fade-in duration-700">
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-inner">
            <div className="p-8 md:p-10 bg-white border-b border-slate-100 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100"><Zap size={20} /></div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">智能素材生产工作台</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-bold tracking-widest">Orchestrate creative production at scale</p>
                </div>
                {allReady && (
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button onClick={() => setActiveModal('batch_match')} className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black tracking-widest text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm group">
                      <Database size={16} className="group-hover:scale-110 transition-transform" /> 批量匹配素材库
                    </button>
                    <button onClick={() => setActiveModal('batch_aigc')} className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group">
                      <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> 批量 AIGC 生成
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {selectedProducts.map((p, idx) => {
                const creatives = productCreatives[p.id] || [];
                const isExpanded = expandedAnalysisId === p.id;
                const showAnalysisResult = analysisFinished || (isAnalyzing && p.isFromHistory);
                const generatingCount = generatingCounts[p.id] || 0;
                
                return (
                  <div key={p.id} className="space-y-3">
                    <div className={`bg-white border rounded-[2rem] p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${creatives.length === 0 && generatingCount === 0 && showAnalysisResult ? 'border-amber-100 ring-2 ring-amber-500/5' : 'border-slate-100'}`}>
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex items-center gap-4 lg:w-72 shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-sm relative bg-slate-50">
                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                            {creatives.length === 0 && generatingCount === 0 && showAnalysisResult && (
                              <div className="absolute inset-0 bg-amber-500/80 flex items-center justify-center">
                                <Flame size={14} className="text-white animate-bounce" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-slate-800 truncate">{p.name}</h4>
                            {showAnalysisResult && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${creatives.length > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>{creatives.length} 素材</span>
                                <button onClick={() => setShowReportFor(p.id)} className="text-[9px] font-black text-slate-400 underline hover:text-indigo-600">分析报告</button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          {(!showAnalysisResult && isAnalyzing) ? (
                            <div className="w-full flex justify-end">
                              <button onClick={() => setExpandedAnalysisId(isExpanded ? null : p.id)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-widest hover:bg-indigo-100 transition-colors">
                                <Loader2 size={12} className="animate-spin" />Analyzing...{isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col md:flex-row items-center gap-6 overflow-hidden min-w-0">
                              <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-1 pr-4">
                                {creatives.map(c => (
                                  <div key={c.id} className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-100 group/item shadow-sm">
                                    <img src={c.url} className="w-full h-full object-cover" />
                                    <button onClick={() => onUpdateCreatives(p.id, creatives.filter(prev => prev.id !== c.id))} className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all text-rose-500 shadow-md">
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                                
                                {[...Array(generatingCount)].map((_, i) => (
                                  <NanoBananaSkeleton key={`gen-${i}`} />
                                ))}

                                {creatives.length < 10 && (
                                  <div className="flex gap-2 shrink-0 ml-2">
                                    <button onClick={() => { setModalContext(p.id); setActiveModal('creative_lib'); }} className="w-14 h-20 rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-400 hover:bg-indigo-50 transition-all gap-1" title="从素材库选择">
                                      <Database size={16} />
                                      <span className="text-[7px] font-black">库</span>
                                    </button>
                                    <button onClick={() => handleAIGCForProduct(p.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-purple-100 flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all gap-1" title="AI 生成">
                                      <Sparkles size={16} />
                                      <span className="text-[7px] font-black">AI</span>
                                    </button>
                                    <button onClick={() => handleUploadForProduct(p.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all gap-1" title="本地上传">
                                      <Upload size={16} />
                                      <span className="text-[7px] font-black">传</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {(!isAnalyzing || p.isFromHistory) && (
                          <div className="shrink-0 flex items-center">
                            <button onClick={() => removeProduct(p.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {isAnalyzing && isExpanded && !p.isFromHistory && (
                      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 mx-4 animate-in slide-in-from-top-2 shadow-xl overflow-hidden">
                        <div className="h-[500px] overflow-y-auto custom-scrollbar pr-4 space-y-6">
                          {ANALYSIS_STEPS.slice(0, currentStep + 1).map((step, stepIdx) => {
                            let listIdx = 0;
                            if (step.type === 'ordered') {
                              listIdx = ANALYSIS_STEPS.slice(0, stepIdx + 1).filter(s => s.type === 'ordered').length;
                            }
                            
                            return (
                              <div key={stepIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {step.type === 'system' && (
                                  <div className="pb-4 border-b border-slate-100 mb-4">
                                    <p className="text-[13px] font-medium text-slate-600">
                                      {step.text.split('https://www.cupshe.com').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                          {part}
                                          {i < arr.length - 1 && <span className="text-indigo-600 font-bold underline cursor-pointer">https://www.cupshe.com</span>}
                                        </React.Fragment>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'action_header' && (
                                  <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2">{step.text}</h4>
                                )}
                                {step.type === 'action' && (
                                  <div className="flex items-start gap-3 pl-4 border-l-2 border-slate-50 mb-2">
                                    <p className="text-[13px] font-medium text-slate-400">{step.text}</p>
                                  </div>
                                )}
                                {step.type === 'image' && (
                                  <div className="pl-4 mb-6">
                                    <div className="rounded-[2rem] border border-slate-200 overflow-hidden shadow-2xl max-w-2xl transition-all hover:scale-[1.01]">
                                      <img src={step.url} alt="Captured UI" className="w-full h-auto" />
                                    </div>
                                  </div>
                                )}
                                {step.type === 'key_value' && (
                                  <p className="text-[13px] leading-relaxed mb-2">
                                    <span className="font-black text-slate-900">{step.text}</span>
                                    <span className="text-slate-600 ml-1.5">{step.value}</span>
                                  </p>
                                )}
                                {step.type === 'header' && (
                                  <p className="text-[13px] font-black text-slate-900 pt-2 mb-2">{step.text}</p>
                                )}
                                {step.type === 'bullet' && (
                                  <div className="flex items-start gap-3 pl-4 mb-1.5">
                                    <span className="text-slate-900 mt-1.5 text-xs font-black">•</span>
                                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                      {step.text.split('-').map((part, i) => (
                                        i === 0 ? <span key={i} className="font-black text-slate-900">{part}</span> : <span key={i}>- {part}</span>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'ordered' && (
                                  <div className="flex items-start gap-3 pl-4 mb-1.5">
                                    <span className="text-slate-900 text-[13px] font-black">{listIdx}.</span>
                                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                      {step.text.split('-').map((part, i) => (
                                        i === 0 ? <span key={i} className="font-black text-slate-900">{part}</span> : <span key={i}>- {part}</span>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'source' && (
                                  <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{step.text}</p>
                                  </div>
                                )}
                                {step.type === 'footer' && (
                                  <div className="mt-4">
                                    <p className="text-[13px] font-medium text-slate-600 italic">{step.text}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div ref={analysisEndRef} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {activeModal && activeModal !== 'batch_match' && activeModal !== 'batch_aigc' && activeModal !== 'select_account' && (
        <SelectionModal 
          type={activeModal} onClose={() => setActiveModal(null)} 
          authStatus={authStatus} anyConnected={anyConnected} isAddModalOpen={isAddModalOpen} 
          handleAuthorize={handleAuthorize} isAuthLoading={isAuthLoading} setIsAddModalOpen={setIsAddModalOpen}
          selectedProducts={selectedProducts} onSelectProducts={onSelectProducts}
          onUpdateCreatives={onUpdateCreatives} productCreatives={productCreatives} modalContext={modalContext}
        />
      )}
      {activeModal === 'batch_match' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Database size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">批量匹配素材库</h4>
                  <p className="text-slate-400 text-xs font-bold tracking-widest mt-1">智能分析并关联现有营销资产</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {[{ id: '24h', label: '智能匹配 24h 内上传素材', icon: <Sparkles size={16} /> }, { id: 'unused', label: '智能匹配历史从未投放过素材', icon: <FileText size={16} /> }, { id: 'top7d', label: '智能匹配近 7 天 TOP 素材', icon: <Flame size={16} /> }].map(opt => {
                const isSel = selectedMatchOptions.has(opt.id);
                return (
                  <button key={opt.id} onClick={() => {
                    const next = new Set(selectedMatchOptions);
                    if (next.has(opt.id)) next.delete(opt.id); else next.add(opt.id);
                    setSelectedMatchOptions(next);
                  }} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all group ${isSel ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isSel ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{opt.icon}</div>
                      <span className={`text-sm font-black ${isSel ? 'text-indigo-900' : 'text-slate-600'}`}>{opt.label}</span>
                    </div>
                    {isSel && <Check size={20} className="text-indigo-600" />}
                  </button>
                );
              })}
            </div>
            <button onClick={handleBatchMatch} className="w-full py-5 rounded-2xl font-black tracking-widest shadow-xl bg-slate-900 text-white hover:bg-black transition-all">确认并开始批量匹配</button>
          </div>
        </ModalWrapper>
      )}
      {activeModal === 'batch_aigc' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">批量 AIGC 生成素材</h4>
                  <p className="text-slate-400 text-xs font-bold tracking-widest mt-1">为每个所选商品并行生成差异化创意</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 tracking-widest">每个商品生成的素材数量</label>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setBatchAIGCCount(n)} className={`h-12 rounded-xl font-black text-sm border-2 transition-all ${batchAIGCCount === n ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 tracking-widest">选择执行商品 ({selectedProducts.length - batchAIGCExclusions.size})</label>
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar pr-2">
                  {selectedProducts.map(p => (
                    <div key={p.id} onClick={() => { const next = new Set(batchAIGCExclusions); if (next.has(p.id)) next.delete(p.id); else next.add(p.id); setBatchAIGCExclusions(next); }} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${!batchAIGCExclusions.has(p.id) ? 'border-purple-100 bg-white' : 'border-slate-100 opacity-50 grayscale'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                        <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!batchAIGCExclusions.has(p.id) ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-slate-200'}`}>
                        {!batchAIGCExclusions.has(p.id) && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleBatchAIGC} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
              <Sparkles size={20} /> 开始并行生成创意
            </button>
          </div>
        </ModalWrapper>
      )}
      {activeModal === 'select_account' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Briefcase size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">选择 Meta 广告账户</h4>
                  <p className="text-slate-400 text-xs font-bold tracking-widest mt-1">关联目录并同步商品数据</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-3">
              {MOCK_ACCOUNTS.map(acc => (
                <button key={acc.id} onClick={() => { onSelectAccount(acc); setActiveModal(null); }} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedAccount?.id === acc.id ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="flex items-center gap-4 text-left">
                    <div className={`p-2 rounded-lg ${selectedAccount?.id === acc.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Briefcase size={16} /></div>
                    <div>
                      <p className={`text-sm font-black ${selectedAccount?.id === acc.id ? 'text-indigo-900' : 'text-slate-600'}`}>{acc.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest">id: {acc.id}</p>
                    </div>
                  </div>
                  {selectedAccount?.id === acc.id && <Check size={20} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        </ModalWrapper>
      )}
      {isAddModalOpen && <AddProductModal onClose={closeAddModal} authStatus={authStatus} handleAuthorize={handleAuthorize} isAuthLoading={isAuthLoading} shopifyStoreName={shopifyStoreName} setAuthStatus={setAuthStatus} setIsShopifyConnected={setIsShopifyConnected} isShopifyConnected={isShopifyConnected} syncStates={syncStates} handleSyncConnect={handleSyncConnect} handleSyncDisconnect={handleSyncDisconnect} addStep={addStep} setAddStep={setAddStep} productUrl={productUrl} setProductUrl={setProductUrl} urlError={urlError} handleImportAnalyzeUrl={handleImportAnalyzeUrl} isImportAnalyzing={isImportAnalyzing} productForm={productForm} handleCreateProduct={handleCreateProduct} />}
    </div>
  );
};

const ModalWrapper = ({ children }) => {
  const zIndex = useZIndex(true);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      {children}
    </div>
  );
};

const AddProductModal = ({ onClose, authStatus, handleAuthorize, isAuthLoading, shopifyStoreName, setAuthStatus, setIsShopifyConnected, isShopifyConnected, syncStates, handleSyncConnect, handleSyncDisconnect, addStep, setAddStep, productUrl, setProductUrl, urlError, handleImportAnalyzeUrl, isImportAnalyzing, productForm, handleCreateProduct }) => {
  const zIndex = useZIndex(true);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex }}
    >
      <div className={`bg-white rounded-[40px] w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col relative transition-all duration-500 ${addStep === 'setup' ? 'max-w-4xl h-[90vh]' : 'max-w-2xl min-h-[400px]'}`}>
        {isImportAnalyzing && (
          <div className="absolute inset-0 z-[120] bg-white rounded-[40px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-[32px] border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
              <Loader2 className="text-indigo-500 animate-spin" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">Analyzing product info...</h3>
            <p className="text-xs text-slate-400 font-medium mb-10 max-w-[320px] font-sans">We're fetching details from the URL. This might take a few moments.</p>
            <button onClick={onClose} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 font-sans">Close and analyze in background</button>
          </div>
        )}
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            {addStep !== 'options' && (<button onClick={() => setAddStep('options')} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><ArrowLeft size={20} /></button>)}
            <h3 className="text-xl font-bold text-slate-900 font-sans">{addStep === 'options' ? '请选择同步产品 data 方式' : addStep === 'url' ? 'Import from URL' : addStep === 'setup' ? 'Setup your product' : addStep === 'shopify' ? 'Sync from Shopify' : addStep === 'gmc' ? 'Sync from Google GMC' : 'Sync from Meta feeds'}</h3>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><X size={20} /></button>
        </div>
        <div className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
          {addStep === 'options' && (
            <div className="space-y-4 pt-4">
              {ADD_OPTIONS.filter(opt => ['shopify', 'meta', 'gmc'].includes(opt.id)).map((option) => {
                const isConnected = option.id === 'shopify' ? authStatus.shopify : option.id === 'meta' ? authStatus.meta : authStatus.google;
                return (
                  <button key={option.id} onClick={() => setAddStep(option.id)} className="w-full group flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-[28px] hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-50 group-hover:border-indigo-50 group-hover:shadow-inner transition-all overflow-hidden p-3 shrink-0">
                      {option.logo ? <img src={option.logo} alt="" className="w-full h-full object-contain" /> : <option.icon size={26} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-base font-bold text-slate-700 font-sans">{option.title}</h4>
                        {isConnected && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">Connected</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed font-sans">{option.subtitle}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
          {addStep === 'url' && (
            <div className="flex-1 flex flex-col pt-6 px-10 text-center">
              <div className="space-y-8 mb-12">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight font-sans">Paste your <span className="text-indigo-500">product link</span> to get product info</h2>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] font-sans">AdsGo supports</p>
                  <div className="flex items-center justify-center gap-4">
                    {PLATFORM_ICONS.map(icon => (<div key={icon.id} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:scale-110 transition-all cursor-default"><img src={icon.logo} alt={icon.id} className="w-full h-full object-contain" /></div>))}
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 font-bold text-sm">...</div>
                  </div>
                </div>
              </div>
              <div className="space-y-8 max-w-[520px] mx-auto w-full flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="relative group">
                    <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="e.g. amazon product link, shopify product link, etc." className={`w-full bg-slate-50 border-[1.5px] rounded-[24px] px-8 py-6 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none transition-all duration-300 ${urlError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-[8px] focus:ring-indigo-500/5 shadow-inner'}`} />
                    {urlError && <div className="absolute -bottom-7 left-4 flex items-center gap-1.5 text-rose-500 font-bold text-[10px] animate-in slide-in-from-top-1"><AlertTriangle size={12} />{urlError}</div>}
                  </div>
                </div>
                <div className="mt-auto">
                  <button onClick={handleImportAnalyzeUrl} className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-bold text-base hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.97] font-sans">Analyze URL</button>
                </div>
              </div>
            </div>
          )}
          {addStep === 'setup' && (<ProductSetupForm isOpen={true} initialData={productForm} onClose={() => setAddStep('options')} onCreate={handleCreateProduct} />)}
          {addStep === 'shopify' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
              {!isShopifyConnected ? (
                <>
                  <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-inner">
                    <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="max-w-[320px] space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 font-sans">Connect to Shopify</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium font-sans">Link your Shopify store to automatically import products and keep assets in sync.</p>
                  </div>
                  <button onClick={() => handleAuthorize('shopify')} disabled={isAuthLoading} className="w-full max-w-[280px] bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 font-sans">Connect Shopify store</button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[24px] bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                      <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 font-sans">{shopifyStoreName}</h4>
                    <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-xs text-green-600 font-bold tracking-wide font-sans">Connected</p></div>
                  </div>
                  <div className="w-full pt-6">
                    <button onClick={() => { setIsShopifyConnected(false); setAuthStatus(p => ({ ...p, shopify: false })); }} className="px-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-bold text-[13px] transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"><Link2Off size={18} />Disconnect store</button>
                  </div>
                </>
              )}
            </div>
          )}
          {(addStep === 'gmc' || addStep === 'meta') && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
              {syncStates[addStep].isConnecting ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center shadow-inner">
                    <Loader2 className="text-indigo-500 animate-spin" size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Fetching your assets...</p>
                </div>
              ) : !syncStates[addStep].isConnected ? (
                <>
                  <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-inner">
                    <img src={addStep === 'gmc' ? 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="max-w-[320px] space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 font-sans">{addStep === 'gmc' ? 'Google GMC' : 'Meta feeds'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium font-sans">{addStep === 'gmc' ? 'Connect to Google Merchant Center to sync your products.' : 'Connect to Meta Commerce Manager to sync your product feeds.'}</p>
                  </div>
                  <button onClick={() => handleSyncConnect(addStep)} className="w-full max-w-[280px] bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 font-sans">Connect</button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[24px] bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                      <img src={addStep === 'gmc' ? 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 font-sans">{syncStates[addStep].email}</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-xs text-green-600 font-bold tracking-wide font-sans">Connected</p>
                    </div>
                  </div>
                  <div className="w-full pt-6">
                    <button onClick={() => handleSyncDisconnect(addStep)} className="px-8 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl font-bold text-[13px] transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"><Link2Off size={18} />Disconnect</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductSetupForm = ({ isOpen, initialData, onClose, onCreate }) => {
  return null; // Placeholder
};

export default ProductSelector;
