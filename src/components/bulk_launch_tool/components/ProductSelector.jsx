import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Link2, Search, History, ShoppingBag, X, ChevronRight,
  LayoutGrid, Wand2,
  Loader2, Globe, Tag, Target, Sparkles, Plus,
  Upload, Check,
  Trash2, PackageCheck, FileText, Layers, Database,
  Flame, Zap, Info, ChevronDown, ListFilter, Box,
  Facebook, Chrome, ExternalLink, RefreshCw, AlertCircle, ChevronUp,
  ArrowLeft, Edit2, User, Image as ImageIcon, Link2Off, Briefcase,
  AlertTriangle, Smartphone, Apple, Monitor, Play
} from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';
import { useZIndex } from '../../../hooks/useZIndex';
import { Popover } from '../../common/Popover';
import MediaPreviewModal from '../../common/MediaPreviewModal';
import { generateAIGCCreative } from '../services/mockAiService';
import { authorizePlatform, MOCK_ACCOUNTS } from '../services/authService';
import useDropdownLoading from '../../../hooks/useDropdownLoading';
import CatalogCombosField from './MergedFields/CatalogCombosField';
import AdCopyEditor from './MergedFields/AdCopyEditor';
import metaAdFieldDefs from '../fieldDefinitions/metaAdFields';
import tiktokAdFieldDefs from '../fieldDefinitions/tiktokAdFields';

export const MOCK_CATALOGS = [
  { id: 'cat_8820192', name: 'Luminaire official catalog 2024', productCount: 128 },
  { id: 'cat_1192837', name: 'Seasonal accessories feed', productCount: 47 },
  { id: 'cat_5543210', name: 'Best sellers - global', productCount: 312 },
];

export const MOCK_PRODUCT_SETS = ['All Products', 'Best Sellers', 'New Arrivals'];

// 每 catalog 内的 product sets（用于 Ad 编辑弹窗 Product Set 单选）
export const MOCK_CATALOG_PRODUCT_SETS = {
  cat_8820192: [
    { id: 'set_a1', name: 'All Products' },
    { id: 'set_a2', name: 'Best Sellers' },
    { id: 'set_a3', name: 'New Arrivals' },
    { id: 'set_a4', name: 'Limited Edition' },
  ],
  cat_1192837: [
    { id: 'set_b1', name: 'All Products' },
    { id: 'set_b2', name: 'Spring 2024' },
    { id: 'set_b3', name: 'Summer Capsule' },
  ],
  cat_5543210: [
    { id: 'set_c1', name: 'All Products' },
    { id: 'set_c2', name: 'Top 100' },
    { id: 'set_c3', name: 'Trending Now' },
    { id: 'set_c4', name: 'Promo Picks' },
  ],
};

// 每 catalog 内的 products（用于 Ad 编辑弹窗 Specific Products 多选）
export const MOCK_CATALOG_PRODUCTS = {
  cat_8820192: Array.from({ length: 12 }, (_, i) => ({
    id: `p_a_${i + 1}`,
    name: `Luminaire Item ${i + 1}`,
    sku: `LUM-${1000 + i}`,
    imageUrl: `https://picsum.photos/seed/lum${i}/80/80`,
  })),
  cat_1192837: Array.from({ length: 8 }, (_, i) => ({
    id: `p_b_${i + 1}`,
    name: `Accessory ${i + 1}`,
    sku: `ACC-${2000 + i}`,
    imageUrl: `https://picsum.photos/seed/acc${i}/80/80`,
  })),
  cat_5543210: Array.from({ length: 15 }, (_, i) => ({
    id: `p_c_${i + 1}`,
    name: `Bestseller ${i + 1}`,
    sku: `BST-${3000 + i}`,
    imageUrl: `https://picsum.photos/seed/bst${i}/80/80`,
  })),
};

export const MOCK_APPS = [
  { id: 'app_1001', name: 'Luminaire Shop', bundle: 'com.luminaire.shop', platform: 'iOS', icon: 'https://picsum.photos/seed/app1/200/200' },
  { id: 'app_1002', name: 'Luminaire Shop', bundle: 'com.luminaire.shop', platform: 'Android', icon: 'https://picsum.photos/seed/app1/200/200' },
  { id: 'app_2001', name: 'Retro Style Hub', bundle: 'com.retrostyle.hub', platform: 'iOS', icon: 'https://picsum.photos/seed/app2/200/200' },
  { id: 'app_3001', name: 'Vintage Daily', bundle: 'com.vintage.daily', platform: 'Android', icon: 'https://picsum.photos/seed/app3/200/200' },
  { id: 'app_4001', name: 'Coastal Living', bundle: 'com.coastal.living', platform: 'iOS', icon: 'https://picsum.photos/seed/app4/200/200' },
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

const PRODUCT_ASSET_LABELS = ['Main Shot', 'Detail View', 'Detail Close-up', 'Lifestyle 1', 'Lifestyle 2', 'Packaging', 'Environment'];
const PRODUCT_ASSET_SEEDS = ['prod_main', 'prod_detail1', 'prod_detail2', 'prod_ls1', 'prod_ls2', 'prod_pack', 'prod_env'];

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
  <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-primary-500/15 bg-primary-50/30 animate-pulse flex flex-col items-center justify-center gap-1">
    <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center">
      <Loader2 size={12} className="text-primary-500/70 animate-spin" />
    </div>
    <span className="text-xs font-medium text-primary-500/40 uppercase text-center px-1">Nano Banana</span>
    <span className="text-xs font-medium text-primary-50 uppercase text-center">Generating...</span>
  </div>
);

// --- Helper components ---

const TagEditor = ({ tags = [], onTagsChange, placeholder, label = "" }) => {
  const [val, setVal] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-tag text-xs font-medium text-primary-700 transition-all hover:bg-primary-100 animate-in zoom-in-95 duration-200 cursor-default group/tag shadow-sm">
          {t}<button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-rose-500 transition-colors"><X size={14} strokeWidth={3} /></button>
        </span>
      ))}
      <div className="relative group/input min-w-[120px]">
        <input className="bg-gray-50 border border-transparent hover:border-gray-200 rounded-base px-4 py-2 text-sm font-bold text-gray-500 outline-none w-full transition-all focus:bg-white focus:border-primary-500 focus:shadow-primary-focus shadow-inner placeholder:text-gray-300" placeholder={tags.length === 0 ? placeholder : `+ ${label}`} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { e.preventDefault(); if (!tags.includes(val.trim())) { onTagsChange([...tags, val.trim()]); } setVal(''); } }} />
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
      <div className="flex items-center justify-between"><div className="space-y-1"><div className="flex items-center gap-2"><div className="w-1 h-3 bg-blue-400 rounded-full" /><h5 className="text-sm font-medium text-gray-900">{title}</h5></div><p className="text-xs text-gray-400 font-medium leading-tight">{subtitle}</p></div></div>
      <div className={`flex flex-wrap gap-4 items-start ${isExpandable && !isExpanded ? 'overflow-hidden max-h-[140px]' : ''}`}>
        {assets.length < maxCount && (
          <div onClick={() => fileInputRef.current?.click()} className="w-[140px] aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-section flex items-center justify-center cursor-pointer hover:bg-primary-50 hover:border-primary-500/30 transition-all group active:scale-[0.97] shrink-0"><Plus size={32} className="text-gray-300 group-hover:text-primary-50 transition-colors" /></div>
        )}
        {displayAssets.map((asset, i) => (
          <div key={i} className="w-[140px] aspect-square bg-white border border-gray-100 rounded-section relative overflow-hidden group shadow-sm hover:shadow-md transition-all shrink-0">
            <img src={asset.url || `https://picsum.photos/seed/${title}${i}/300/300`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button onClick={() => onAssetsChange(assets.filter((_, idx) => idx !== i))} className="p-2 bg-white rounded-xl text-rose-500 shadow-lg hover:scale-110 active:scale-90 transition-all"><Trash2 size={14} /></button></div>
          </div>
        ))}
        {isExpandable && !isExpanded && assets.length > 4 && (
          <div onClick={onToggle} className="w-[140px] aspect-square bg-gray-900 rounded-section flex flex-col items-center justify-center cursor-pointer hover:bg-primary-600 transition-all shadow-xl group shrink-0"><span className="text-lg font-semibold text-white">{moreCount} more</span><span className="text-xs font-bold text-white/60 mt-1">assets</span></div>
        )}
        {isExpandable && isExpanded && (
          <div onClick={onToggle} className="w-[140px] aspect-square bg-gray-100 border border-gray-200 rounded-section flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all group shrink-0"><ChevronRight size={24} className="text-gray-400 rotate-180 mb-1" /><span className="text-xs font-semibold text-gray-50">collapse</span></div>
        )}
      </div>
    </div>
  );
};

const SearchableSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const triggerRef = useRef(null);
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={`w-full bg-white border rounded-base px-5 py-3.5 text-sm font-bold text-gray-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary-500 shadow-primary-focus' : error ? 'border-rose-400' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}><span className={!value ? 'text-gray-300' : ''}>{selectedOption ? selectedOption.label : placeholder}</span><ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></div>
      <Popover
        open={isOpen}
        anchorRef={triggerRef}
        placement="bottom-start"
        matchWidth
        onClose={() => setIsOpen(false)}
        zIndex={Z_INDEX.MODAL_BASE + 500}
        className="bg-white border border-gray-100 rounded-section shadow-xl overflow-hidden"
      >
        {isSearchable && (<div className="p-3 border-b border-gray-50 bg-gray-50/50"><input autoFocus className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary-500" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>)}
        <div className="max-h-[240px] overflow-y-auto p-2">{filteredOptions.map(opt => (<div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer mb-1 last:mb-0 ${value === opt.value ? 'bg-primary-50 text-primary-500' : 'hover:bg-gray-50'}`}>{opt.label}</div>))}</div>
      </Popover>
    </>
  );
};

const SearchableTreeSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredParent, setHoveredParent] = useState(null);
  const triggerRef = useRef(null);
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
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={`w-full bg-white border rounded-base px-5 py-3.5 text-sm font-bold text-gray-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary-500 shadow-primary-focus' : error ? 'border-rose-400' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}><span className={!value ? 'text-gray-300' : ''}>{getDisplayValue()}</span><ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></div>
      <Popover
        open={isOpen}
        anchorRef={triggerRef}
        placement="bottom-start"
        onClose={() => setIsOpen(false)}
        zIndex={Z_INDEX.MODAL_BASE + 500}
        className="w-[560px] bg-white border border-gray-100 rounded-section shadow-xl flex overflow-hidden h-[380px]"
      >
        <div className={`w-[240px] border-r border-gray-100 flex flex-col bg-gray-50/30`}>
          {isSearchable && (<div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -trangray-y-1/2 text-gray-400" /><input autoFocus className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-primary-500 transition-all" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>)}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">{filteredTree.map((parent) => (<div key={parent.value} onMouseEnter={() => setHoveredParent(parent)} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all mb-1 flex items-center justify-between group ${hoveredParent?.value === parent.value ? 'bg-white text-primary-500 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}><span className="truncate pr-2">{parent.label}</span>{parent.children?.length > 0 && <ChevronRight size={14} className={`transition-transform ${hoveredParent?.value === parent.value ? 'trangray-x-0.5 opacity-100' : 'opacity-30'}`} />}</div>))}</div>
        </div>
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-50"><h6 className="text-xs font-semibold text-gray-400">{hoveredParent ? hoveredParent.label : 'Select category'}</h6></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {hoveredParent?.children?.length > 0 ? (<div className="grid grid-cols-1 gap-1">{hoveredParent.children.map((child) => (<div key={child.value} onClick={() => { onChange(child.value); setIsOpen(false); setSearchTerm(''); }} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${value === child.value ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>{child.label}</div>))}</div>) : (<div className="h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3"><Layers size={20} className="opacity-20" /></div><p className="text-xs font-bold opacity-40">{hoveredParent ? 'No sub-categories' : 'Hover a category to view details'}</p></div>)}
          </div>
        </div>
      </Popover>
    </>
  );
};

// --- SelectionModal ---

const SelectionModal = ({
  type, onClose, authStatus, anyConnected, isAddModalOpen,
  handleAuthorize, isAuthLoading, setIsAddModalOpen,
  selectedProducts, onSelectProducts, onUpdateCreatives,
  productCreatives, modalContext, modalGroupId, onAddAdsToGroup,
  channelPlatform, channelSelectedAccount, onOpenChannelAccountPicker,
}) => {
  const zIndex = useZIndex(true);
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState(new Set());
  const [activePlatform, setActivePlatform] = useState('ALL');
  const [activeCreativeTab, setActiveCreativeTab] = useState('library'); // 'library' | 'product_assets'

  const handleTabSwitch = (tab) => {
    setActiveCreativeTab(tab);
    setLocalSelected(new Set());
  };

  const getProductAssets = () => {
    const product = selectedProducts.find(p => p.id === modalContext);
    const assets = PRODUCT_ASSET_SEEDS.map((seed, i) => ({
      id: `pa-${modalContext}-${seed}`,
      name: PRODUCT_ASSET_LABELS[i],
      url: `https://picsum.photos/seed/${product?.id || 'default'}_${seed}/400/400`,
    }));
    if (product?.imageUrl) {
      assets.unshift({ id: `pa-${modalContext}-cover`, name: 'Product Cover', url: product.imageUrl });
    }
    return assets;
  };
  
  const isCurrentPlatformConnected = activePlatform === 'ALL' ? anyConnected : authStatus[activePlatform];
  const skipFetching = type === 'history' || type === 'creative_lib';
  const [isFetchingProducts, setIsFetchingProducts] = useState(!skipFetching && isCurrentPlatformConnected && !isAddModalOpen);

  useEffect(() => {
    if (skipFetching) { setIsFetchingProducts(false); return; }
    if (isCurrentPlatformConnected && !isAddModalOpen) {
      setIsFetchingProducts(true);
      const timer = setTimeout(() => setIsFetchingProducts(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsFetchingProducts(false);
    }
  }, [activePlatform, isCurrentPlatformConnected, isAddModalOpen, skipFetching]);

  const getItems = () => {
    if (type !== 'shopify') {
      if (type === 'history') return HISTORY_PRODUCTS;
      if (type === 'creative_lib') return activeCreativeTab === 'library' ? CREATIVE_LIBRARY : getProductAssets();
      return CREATIVE_LIBRARY;
    }
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
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      <div className="bg-white w-full max-w-4xl rounded-section shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">{type === 'history' ? '历史分析产品库' : type === 'shopify' ? '请选择products' : '从创意素材库选择'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-300 transition-colors"><X size={24} /></button>
        </div>
        {type === 'creative_lib' && (
          <div className="px-8 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 shrink-0">
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              {[
                { id: 'library', label: '创意素材库' },
                { id: 'product_assets', label: 'Product Assets' },
                { id: 'media_creatives', label: 'Media Creatives' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeCreativeTab === tab.id ? 'bg-primary-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {type === 'shopify' && (
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4 shrink-0">
            {anyConnected && (<button onClick={() => setIsAddModalOpen(true)} className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-600 transition-all shrink-0 group" title="Connect product data source"><Plus size={20} className="group-hover:rotate-90 transition-transform" /></button>)}
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              {[{ id: 'ALL', label: '全部', icon: <Box size={14} /> }, { id: 'shopify', label: 'Shopify', icon: <ShoppingBag size={14} />, color: 'text-emerald-600' }, { id: 'meta', label: 'Facebook feeds', icon: <Facebook size={14} />, color: 'text-blue-600' }, { id: 'google', label: 'Google GMC', icon: <Chrome size={14} />, color: 'text-orange-500' }].map(p => (
                <button key={p.id} onClick={() => setActivePlatform(p.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activePlatform === p.id ? 'bg-primary-500 text-white shadow-md' : `${p.color || 'text-gray-400'} hover:bg-gray-50`} ${p.id !== 'ALL' && !authStatus[p.id] ? 'opacity-60' : ''}`}>{p.icon} {p.label}</button>
              ))}
            </div>
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -trangray-y-1/2 text-gray-400" size={16} /><input type="text" autoFocus placeholder="搜索商品名称、链接..." className="w-full pl-12 pr-4 h-11 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold focus:border-primary-500 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative min-h-[400px]">
          {type === 'creative_lib' && activeCreativeTab === 'media_creatives' ? (
            (() => {
              const mediaState =
                !channelPlatform ? 'NO_PLATFORM' :
                !authStatus[channelPlatform.id] ? 'NEED_AUTH' :
                !channelSelectedAccount ? 'NEED_PICK' :
                'PICKED';
              if (mediaState === 'NO_PLATFORM') {
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-6"><Monitor size={40} /></div>
                    <p className="text-sm text-gray-500 font-bold mb-2">尚未选择媒体渠道</p>
                    <p className="text-xs text-gray-400 max-w-sm">请先在页面顶部"投放渠道媒体"中选择媒体平台，连接账号后即可在此使用素材库。</p>
                  </div>
                );
              }
              if (mediaState === 'NEED_AUTH') {
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                      {channelPlatform.logo ? <img src={channelPlatform.logo} alt="" className="w-12 h-12 object-contain" /> : <Monitor size={40} className="text-gray-300" />}
                    </div>
                    <p className="text-sm text-gray-500 font-bold mb-2">连接 {channelPlatform.name} 后查看媒体素材</p>
                    <p className="text-xs text-gray-400 mb-6 max-w-sm">连接成功后将自动弹出账号选择，再选择目标账号即可加载该账号下的媒体素材。</p>
                    <button
                      onClick={() => handleAuthorize(channelPlatform.id)}
                      disabled={isAuthLoading}
                      className="px-10 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isAuthLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                      {isAuthLoading ? '连接中...' : `Connect ${channelPlatform.name} Ads`}
                    </button>
                  </div>
                );
              }
              if (mediaState === 'NEED_PICK') {
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-6"><Briefcase size={40} /></div>
                    <p className="text-sm text-gray-500 font-bold mb-2">已连接 {channelPlatform.name}，请选择广告账号</p>
                    <p className="text-xs text-gray-400 mb-6 max-w-sm">从该 {channelPlatform.name} 已授权账户中选择一个，加载其媒体素材库。</p>
                    <button
                      onClick={() => onOpenChannelAccountPicker?.()}
                      className="px-10 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10 flex items-center gap-3"
                    >
                      <Briefcase size={20} /> 选择 {channelPlatform.name} 账号
                    </button>
                  </div>
                );
              }
              // PICKED
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-100 rounded-base">
                    {channelPlatform.logo && <img src={channelPlatform.logo} alt="" className="w-4 h-4 object-contain shrink-0" />}
                    <p className="text-xs font-medium text-primary-700 truncate">
                      已连接 {channelPlatform.name} · 账号 <span className="font-bold">{channelSelectedAccount.name}</span>（{channelSelectedAccount.id}）
                    </p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {CREATIVE_LIBRARY.map((item) => {
                      const isSel = localSelected.has(item.id);
                      return (
                        <div key={item.id} onClick={() => toggleItem(item.id)} className={`relative p-3 bg-white border-2 rounded-section transition-all cursor-pointer group ${isSel ? 'border-primary-500 shadow-lg shadow-primary-50' : 'border-gray-100 hover:border-gray-300'}`}>
                          <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-gray-50">
                            <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${isSel ? 'bg-primary-500 border-primary-500' : 'bg-black/20 border-white/40'}`}>{isSel && <Check size={14} className="text-white" />}</div>
                          </div>
                          <p className="text-xs font-semibold text-gray-800 truncate px-1">{item.name || '未命名素材'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : isAuthLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[150] animate-in fade-in"><Loader2 size={48} className="text-primary-500 animate-spin mb-4" /><p className="text-sm font-medium text-gray-900">正在拉取并同步云端商品数据...</p></div>
          ) : isFetchingProducts ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 animate-in fade-in"><Loader2 size={48} className="text-primary-500 animate-spin mb-4" /><p className="text-sm font-medium text-gray-900">Fetching products data...</p></div>
          ) : needsConnection ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-200 mb-6"><ShoppingBag size={40} /></div>
              <p className="text-sm text-gray-400 font-bold mb-8 max-w-sm">Connect your store to sync products automatically or manually set up a product for analysis.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="px-10 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10 flex items-center gap-3"><Plus size={20} /> Connect product data source</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center opacity-40"><AlertCircle size={48} className="mb-4" /><p className="text-sm font-bold">未找到符合条件的产品</p></div>
          ) : type === 'history' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((item) => {
                const isSel = localSelected.has(item.id);
                return (
                  <div key={item.id} onClick={() => toggleItem(item.id)} className={`flex items-center gap-4 p-4 bg-white border-2 rounded-section transition-all cursor-pointer group ${isSel ? 'border-primary-500 shadow-lg shadow-primary-50' : 'border-gray-100 hover:border-gray-300 hover:shadow-md'}`}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm bg-gray-50">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><PackageCheck size={20} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name || '未命名产品'}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link2 size={10} className="shrink-0" />
                        <p className="text-xs text-gray-400 truncate">{item.url}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSel ? 'bg-primary-500 border-primary-500' : 'border-gray-200'}`}>
                      {isSel && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : type === 'shopify' ? (
            (() => {
              const selectedItems = items.filter(i => localSelected.has(i.id));
              const sorted = [...filtered].sort((a, b) => {
                const aSel = localSelected.has(a.id) ? 0 : 1;
                const bSel = localSelected.has(b.id) ? 0 : 1;
                return aSel - bSel;
              });
              const trimmed = search.trim();
              const highlightMatch = (text) => {
                if (!trimmed || !text) return text;
                const lower = String(text).toLowerCase();
                const q = trimmed.toLowerCase();
                const idx = lower.indexOf(q);
                if (idx === -1) return text;
                return (
                  <>
                    {text.slice(0, idx)}
                    <mark className="bg-primary-50 text-primary-600 px-0.5 rounded">{text.slice(idx, idx + trimmed.length)}</mark>
                    {text.slice(idx + trimmed.length)}
                  </>
                );
              };
              return (
                <div className="space-y-3">
                  {selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-400 self-center mr-1">已选 {selectedItems.length}：</span>
                      {selectedItems.map(item => (
                        <span key={item.id} className="inline-flex items-center gap-2 pl-1 pr-2 py-1 bg-primary-50 border border-primary-100 rounded-full">
                          {(item.imageUrl || item.url) ? (
                            <img src={item.imageUrl || item.url} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-primary-400"><PackageCheck size={10} /></div>
                          )}
                          <span className="text-xs font-medium text-primary-700 max-w-[140px] truncate">{item.name || '未命名产品'}</span>
                          <button onClick={() => toggleItem(item.id)} className="text-primary-400 hover:text-primary-600" title="取消选择"><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                    {sorted.map(item => {
                      const isSel = localSelected.has(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${isSel ? 'bg-primary-50/60 hover:bg-primary-50' : 'bg-white hover:bg-gray-50'}`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                            {(item.imageUrl || item.url)
                              ? <img src={item.imageUrl || item.url} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300"><PackageCheck size={16} /></div>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm truncate ${isSel ? 'font-semibold text-primary-700' : 'font-medium text-gray-800'}`}>{highlightMatch(item.name || '未命名产品')}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Link2 size={10} className="text-gray-300 shrink-0" />
                              <p className="text-[11px] font-medium text-gray-400 truncate">{highlightMatch(item.url || '')}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSel ? 'bg-primary-500 border-primary-500' : 'border-gray-200'}`}>
                            {isSel && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSel = localSelected.has(item.id);
                return (
                  <div key={item.id} onClick={() => toggleItem(item.id)} className={`relative p-3 bg-white border-2 rounded-section transition-all cursor-pointer group ${isSel ? 'border-primary-500 shadow-lg shadow-primary-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-gray-50">
                      {(item.imageUrl || item.url) ? (<img src={item.imageUrl || item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />) : (<div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300 bg-gray-50"><PackageCheck size={32} /><span className="text-xs font-medium">暂无预览图</span></div>)}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${isSel ? 'bg-primary-500 border-primary-500' : 'bg-black/20 border-white/40'}`}>{isSel && <Check size={14} className="text-white" />}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-800 truncate px-1">
                        {item.name || (type === 'creative_lib' ? '未命名创意' : '未命名产品')}
                      </p>
                      {type !== 'creative_lib' && (
                        <div className="flex items-center gap-1.5 px-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Link2 size={10} />
                          <p className="text-xs font-bold text-gray-400 truncate">{item.url}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0 sticky bottom-0 z-20">
          <div className="text-sm font-bold text-gray-400">
            {type === 'creative_lib' ? '已选 ' : '已选中 '}
            <span className="text-primary-500 font-semibold">{localSelected.size}</span> 
            {type === 'creative_lib' ? ' 个创意' : ' 个项目'}
          </div>
          <button disabled={localSelected.size === 0} onClick={() => {
            const randomSuffix = () => Math.random().toString(36).substring(2, 9);
            if (type === 'creative_lib') {
              const pool = activeCreativeTab === 'library' || activeCreativeTab === 'media_creatives' ? CREATIVE_LIBRARY : getProductAssets();
              const selectedCreatives = pool.filter(i => localSelected.has(i.id));
              const newCreatives = selectedCreatives.map(c => ({
                ...c,
                id: `${c.id}-${Date.now()}-${randomSuffix()}`,
                productId: modalContext
              }));
              if (modalGroupId && onAddAdsToGroup) {
                onAddAdsToGroup(modalContext, modalGroupId, newCreatives);
              } else {
                onUpdateCreatives(modalContext, prev => [...newCreatives, ...prev]);
              }
            } else {
              const pool = getItems();
              const toAdd = pool.filter(i => localSelected.has(i.id) && !selectedProducts.some(p => p.id === i.id))
                                .map(p => ({ ...p, isFromHistory: type === 'history' }));
              const remaining = 10 - selectedProducts.length;
              if (remaining <= 0) { alert('最多添加 10 个产品'); onClose(); return; }
              const trimmed = toAdd.slice(0, remaining);
              if (trimmed.length < toAdd.length) { alert(`最多添加 10 个产品，已自动选择前 ${trimmed.length} 个`); }
              onSelectProducts([...selectedProducts, ...trimmed]);
            }
            onClose();
          }} className={`px-10 py-4 rounded-base font-semibold shadow-xl transition-all ${localSelected.size === 0 ? 'bg-gray-200 text-white cursor-not-allowed shadow-none' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
            {type === 'creative_lib' ? '确认' : '确认选择产品'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ProductSelector component ---

// ── App Picker Section (for "投放 App 广告" tab) ──────────────────────────
const AppPickerSection = ({ platform, authStatus, isAuthLoading, handleAuthorize, selectedProducts, onSelectProducts, selectedAccount, onPickAccount }) => {
  const platformId = platform?.id;
  const requiresAuth = platformId === 'meta' || platformId === 'tiktok';
  const isAuthorized = requiresAuth ? !!authStatus?.[platformId] : false;
  const [appSearch, setAppSearch] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const appPickerRef = useRef(null);
  useEffect(() => {
    if (!isAppDropdownOpen) return;
    const handler = (e) => {
      if (appPickerRef.current && !appPickerRef.current.contains(e.target)) setIsAppDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isAppDropdownOpen]);

  if (!platform) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-base flex items-center justify-center shadow-sm"><AlertCircle size={32} /></div>
        <div className="max-w-md space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">请先在顶部选择投放渠道</h4>
          <p className="text-xs text-gray-400 font-bold leading-relaxed">App 广告需先在『投放目标与渠道』中选择 Meta 或 TikTok。</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !isAuthorized) {
    const isMeta = platformId === 'meta';
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center text-center space-y-6">
        <div className={`w-16 h-16 rounded-base flex items-center justify-center shadow-sm ${isMeta ? 'bg-blue-50 text-blue-600' : 'bg-gray-900 text-white'}`}>
          {isMeta ? <Facebook size={32} /> : <Smartphone size={32} />}
        </div>
        <div className="max-w-md space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">投放 App 广告需先授权 {isMeta ? 'Meta Ads' : 'TikTok Ads'}</h4>
          <p className="text-xs text-gray-400 font-bold leading-relaxed">
            我们需要访问您的 {isMeta ? 'Meta' : 'TikTok'} 广告账户以读取已绑定的 App 列表与投放权限。
          </p>
        </div>
        <button onClick={() => handleAuthorize(platformId)} disabled={isAuthLoading} className="px-12 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all shadow-xl flex items-center gap-3">
          {isAuthLoading ? <Loader2 size={20} className="animate-spin" /> : (isMeta ? <Facebook size={20} /> : <Smartphone size={20} />)}
          {isMeta ? 'Connect Meta Ads' : 'Connect TikTok Ads'}
        </button>
      </div>
    );
  }

  if (requiresAuth && isAuthorized && !selectedAccount) {
    const isMeta = platformId === 'meta';
    return (
      <div className="bg-primary-50/50 border-2 border-primary-500/15 rounded-xl p-10 flex items-center justify-between animate-in slide-in-from-top-4">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-base flex items-center justify-center text-primary-500 shadow-sm"><RefreshCw size={28} className="animate-spin-slow" /></div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">{isMeta ? 'Meta' : 'TikTok'} 已授权，请选择关联广告账户</h4>
            <p className="text-xs text-gray-400 font-bold mt-1">Found 2 available accounts</p>
          </div>
        </div>
        <button onClick={onPickAccount} className="px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10">选择广告账户</button>
      </div>
    );
  }

  const selectedAppIds = new Set(selectedProducts.filter(p => p.isApp).map(p => p.id));
  const toggleApp = (app) => {
    if (selectedAppIds.has(app.id)) {
      onSelectProducts(selectedProducts.filter(p => p.id !== app.id));
    } else {
      onSelectProducts([...selectedProducts, {
        id: app.id,
        name: `${app.name} · ${app.platform}`,
        url: app.bundle,
        imageUrl: app.icon,
        isApp: true,
      }]);
    }
  };

  const trimmed = appSearch.trim().toLowerCase();
  const filteredApps = trimmed
    ? MOCK_APPS.filter(a =>
        a.name.toLowerCase().includes(trimmed) ||
        a.bundle.toLowerCase().includes(trimmed) ||
        a.platform.toLowerCase().includes(trimmed)
      )
    : MOCK_APPS;
  const sortedApps = [...filteredApps].sort((a, b) => {
    const aSel = selectedAppIds.has(a.id) ? 0 : 1;
    const bSel = selectedAppIds.has(b.id) ? 0 : 1;
    return aSel - bSel;
  });
  const selectedApps = MOCK_APPS.filter(a => selectedAppIds.has(a.id));
  const highlightMatch = (text) => {
    if (!trimmed || !text) return text;
    const lower = String(text).toLowerCase();
    const idx = lower.indexOf(trimmed);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary-50 text-primary-600 px-0.5 rounded">{text.slice(idx, idx + trimmed.length)}</mark>
        {text.slice(idx + trimmed.length)}
      </>
    );
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Smartphone size={14} className="text-primary-500" />
          <h4 className="text-sm font-semibold text-gray-900">从已绑定的 App 列表中选择</h4>
        </div>
        <span className="text-xs font-medium text-gray-400">已选 {selectedAppIds.size} / {MOCK_APPS.length}</span>
      </div>

      <div ref={appPickerRef} className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={appSearch}
          onChange={(e) => { setAppSearch(e.target.value); if (!isAppDropdownOpen) setIsAppDropdownOpen(true); }}
          onFocus={() => setIsAppDropdownOpen(true)}
          onClick={() => setIsAppDropdownOpen(true)}
          placeholder={selectedAppIds.size > 0 ? `已选 ${selectedAppIds.size} 个 App，继续搜索/勾选...` : '点击展开下拉，或输入名称、包名、平台关键词搜索 App...'}
          className="w-full h-11 pl-9 pr-16 bg-white border border-gray-200 rounded-base outline-none text-xs font-medium text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {appSearch && (
            <button onMouseDown={(e) => { e.preventDefault(); setAppSearch(''); }} className="p-1 text-gray-400 hover:text-gray-600" title="清空搜索"><X size={14} /></button>
          )}
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${isAppDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <Popover
        open={isAppDropdownOpen}
        anchorRef={appPickerRef}
        placement="bottom-start"
        matchWidth
        onClose={() => setIsAppDropdownOpen(false)}
        className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto custom-scrollbar">
          {sortedApps.length === 0 ? (
            <div className="px-4 py-10 flex flex-col items-center justify-center text-gray-300">
              <AlertCircle size={28} className="mb-2" />
              <p className="text-xs font-medium">未找到匹配的 App</p>
            </div>
          ) : sortedApps.map(app => {
            const isSelected = selectedAppIds.has(app.id);
            return (
              <button
                key={app.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); toggleApp(app); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-left ${isSelected ? 'bg-primary-50/60 hover:bg-primary-50' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                  <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${isSelected ? 'font-semibold text-primary-700' : 'font-medium text-gray-800'}`}>{highlightMatch(app.name)}</p>
                  <p className="text-[11px] font-medium text-gray-400 truncate mt-0.5">{highlightMatch(app.bundle)}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-tag shrink-0 ${app.platform === 'iOS' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-600'}`}>{app.platform}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-200'}`}>
                  {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

const ProductSelector = ({ selectedProducts, onSelectProducts, productCreativeGroups, onUpdateGroupAds, onAddGroup, onRemoveGroup, onRenameGroup, onAnalysisStart, onAnalysisComplete, onReset, hasGeneratedOnce, analysisFinished, isAnalyzing, campaignType, onCampaignTypeChange, selectedAccount, onSelectAccount, productAnalyses, onProductAnalysesChange, authStatus, onAuthStatusChange, onMetaAccountPick, selectedCatalog: selectedCatalogProp, onSelectCatalog, selectedProductSet: selectedProductSetProp, onSelectProductSet, catalogCombos = [], onCatalogCombosChange, platform, availableAccounts = [], creativeGroupCopyMap = {}, onSaveGroupCopy }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reports, setReports] = useState({});
  const [showReportFor, setShowReportFor] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalContext, setModalContext] = useState(null);
  const [modalGroupId, setModalGroupId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // { productId, groupId }
  const [dragOverGroupKey, setDragOverGroupKey] = useState(null); // `${productId}::${groupId}`
  const catalogTriggerRef = useRef(null);
  const setTriggerRef = useRef(null);
  const [previewMedia, setPreviewMedia] = useState(null); // { url, mediaType, name? }
  // Phase 2.M：素材组级 ad copy 编辑入口
  const [copyEditorTarget, setCopyEditorTarget] = useState(null); // { productId, groupId, groupName }
  const ctaOptions = useMemo(() => {
    const channelKey = (platform === 'tiktok') ? 'tiktok' : 'meta';
    const defs = channelKey === 'meta' ? metaAdFieldDefs : tiktokAdFieldDefs;
    const fieldName = channelKey === 'meta' ? 'call_to_action_type' : 'call_to_action';
    const f = (defs || []).find(d => d?.name === fieldName);
    return Array.isArray(f?.options) ? f.options.map(o => ({ value: o.value, label: o.label })) : [];
  }, [platform]);
  const [flashAdId, setFlashAdId] = useState(null); // 临时视觉反馈：被点击的素材 id
  useEffect(() => {
    if (!flashAdId) return;
    const t = setTimeout(() => setFlashAdId(null), 220);
    return () => clearTimeout(t);
  }, [flashAdId]);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState(null);
  const [selectedCatalogLocal, setSelectedCatalogLocal] = useState(null);
  const [selectedProductSetLocal, setSelectedProductSetLocal] = useState('All Products');
  const selectedCatalog = selectedCatalogProp !== undefined ? selectedCatalogProp : selectedCatalogLocal;
  const setSelectedCatalog = onSelectCatalog || setSelectedCatalogLocal;
  const selectedProductSet = selectedProductSetProp !== undefined ? selectedProductSetProp : selectedProductSetLocal;
  const setSelectedProductSet = onSelectProductSet || setSelectedProductSetLocal;
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [setDropdownOpen, setSetDropdownOpen] = useState(false);
  const accountLoading = useDropdownLoading('accounts', authStatus?.meta);
  const catalogLoading = useDropdownLoading('catalogs', authStatus?.meta);
  const productSetLoading = useDropdownLoading('productSets', authStatus?.meta);
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

  // Compat shims: legacy code paths (AIGC, lib, upload) wrote to a flat creative list per product.
  // We now store creatives in groups; legacy writes append to the FIRST group, legacy reads flatten.
  const productCreatives = useMemo(() => {
    const out = {};
    Object.entries(productCreativeGroups || {}).forEach(([pid, groups]) => {
      out[pid] = (groups || []).flatMap(g => g.ads || []);
    });
    return out;
  }, [productCreativeGroups]);
  const onUpdateCreatives = useCallback((productId, creativesOrUpdater) => {
    const groups = productCreativeGroups?.[productId] || [];
    const firstGroupId = groups[0]?.id;
    if (!firstGroupId) return;
    if (typeof creativesOrUpdater === 'function') {
      onUpdateGroupAds(productId, firstGroupId, () => {
        const flat = (productCreativeGroups?.[productId] || []).flatMap(g => g.ads || []);
        return creativesOrUpdater(flat);
      });
    } else {
      onUpdateGroupAds(productId, firstGroupId, creativesOrUpdater);
    }
  }, [productCreativeGroups, onUpdateGroupAds]);

  // Group-aware add to a specific group (used by workbench)
  const addAdsToGroup = useCallback((productId, groupId, newAds) => {
    onUpdateGroupAds(productId, groupId, prev => [...newAds, ...prev]);
  }, [onUpdateGroupAds]);
  const removeAdFromGroup = useCallback((productId, groupId, adId) => {
    onUpdateGroupAds(productId, groupId, prev => prev.filter(a => a.id !== adId));
  }, [onUpdateGroupAds]);

  const [generatingCounts, setGeneratingCounts] = useState({});
  const [selectedMatchOptions, setSelectedMatchOptions] = useState(new Set(['24h']));

  // 下拉打开时触发loading
  useEffect(() => { if (activeModal === 'select_account') accountLoading.triggerLoad(); }, [activeModal]);
  useEffect(() => { if (catalogDropdownOpen) catalogLoading.triggerLoad(); }, [catalogDropdownOpen]);
  useEffect(() => { if (setDropdownOpen) productSetLoading.triggerLoad(); }, [setDropdownOpen]);

  const anyConnected = Object.values(authStatus).some(v => v);
  const isMultiMode = selectedProducts.length > 1;
  const multiAnalysisTimers = useRef({});

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      if (selectedProducts.length >= 10) {
        alert('最多添加 10 个产品');
        return;
      }
      const newP = {
        id: `manual-${Date.now()}`,
        name: `落地页产品 - ${selectedProducts.length + 1}`,
        url: urlInput,
        imageUrl: ''
      };
      onSelectProducts([...selectedProducts, newP]);
      setUrlInput('');
    }
  };
  
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
    if (selectedProducts.length >= 10) { alert('最多添加 10 个产品'); return; }
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
      onAuthStatusChange(prev => ({ ...prev, [platform]: true }));
      if (platform === 'shopify') setIsShopifyConnected(true);
      if (platform === 'meta' || platform === 'google') {
        setSyncStates(prev => ({ ...prev, [platform]: { isConnected: true, isConnecting: false, email: 'user@example.com' } }));
      }
      // 授权成功后，若尚未选择广告账号，立即弹出账户选择器（meta/tiktok/google 共用此规则）
      if ((platform === 'meta' || platform === 'tiktok' || platform === 'google') && !selectedAccount) {
        if (platform === 'meta' && onMetaAccountPick) {
          onMetaAccountPick();
        } else {
          setActiveModal('select_account');
        }
      }
    }
    setIsAuthLoading(false);
  };

  const removeProduct = (id) => {
    if (selectedProducts.length <= 1) return;
    if (multiAnalysisTimers.current[id]) {
      clearTimeout(multiAnalysisTimers.current[id]);
      delete multiAnalysisTimers.current[id];
    }
    onProductAnalysesChange(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    onSelectProducts(selectedProducts.filter(p => p.id !== id));
  };

  const analysisContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (analysisContainerRef.current) {
      analysisContainerRef.current.scrollTop = analysisContainerRef.current.scrollHeight;
    }
  };

  // Mock interest keywords per product category for AI recommendations
  const MOCK_PRODUCT_INTERESTS = [
    ['Online shopping', 'E-commerce', 'Fashion accessories', 'Luxury goods', 'Beauty'],
    ['Fitness', 'Travel', 'Sustainable fashion', 'Home decor', 'Technology'],
    ['Fashion accessories', 'Beauty', 'Lifestyle', 'Online shopping', 'Wellness'],
    ['Travel', 'Luxury goods', 'Technology', 'E-commerce', 'Home decor'],
    ['Fitness', 'Fashion accessories', 'Online shopping', 'Sustainable fashion', 'Beauty'],
  ];

  // Start per-product background analysis (multi mode)
  const startMultiAnalysis = (products) => {
    // Immediately tell parent to unlock flow
    const mockReports = {};
    products.forEach(p => {
      mockReports[p.id] = { summary: `${p.name} 网页核心卖点：高品质复古设计，适用于多种场景。`, recommendedAudience: "25-45 岁，对极简主义和高质感生活有追求的都市人群。", competitors: ["Lululemon", "Everlane", "Zara Home"] };
    });
    setReports(mockReports);
    onAnalysisComplete(mockReports);

    // Start per-product independent analysis timers
    products.forEach((p, idx) => {
      if (p.isFromHistory) {
        onProductAnalysesChange(prev => ({
          ...prev,
          [p.id]: { status: 'complete', currentStep: ANALYSIS_STEPS.length - 1, extractedName: p.name, urlSlug: p.url.split('/').pop()?.split('?')[0] || '', recommendedInterests: MOCK_PRODUCT_INTERESTS[idx % MOCK_PRODUCT_INTERESTS.length], productDescription: `High-quality ${p.name} for modern lifestyle.` }
        }));
        return;
      }

      // Set initial analyzing state
      onProductAnalysesChange(prev => ({
        ...prev,
        [p.id]: { status: 'analyzing', currentStep: 0, extractedName: p.name, urlSlug: p.url.split('/').pop()?.split('?')[0] || '', recommendedInterests: [], productDescription: '' }
      }));

      // Per-product step progression (random 400-800ms per step)
      let step = 0;
      const advanceStep = () => {
        step++;
        if (step >= ANALYSIS_STEPS.length) {
          onProductAnalysesChange(prev => ({
            ...prev,
            [p.id]: { ...prev[p.id], status: 'complete', currentStep: ANALYSIS_STEPS.length - 1, recommendedInterests: MOCK_PRODUCT_INTERESTS[idx % MOCK_PRODUCT_INTERESTS.length], productDescription: `High-quality ${p.name} for modern lifestyle.` }
          }));
          return;
        }
        onProductAnalysesChange(prev => ({
          ...prev,
          [p.id]: { ...prev[p.id], currentStep: step }
        }));
        multiAnalysisTimers.current[p.id] = setTimeout(advanceStep, 400 + Math.random() * 400);
      };
      multiAnalysisTimers.current[p.id] = setTimeout(advanceStep, 1000 + Math.random() * 2000);
    });
  };

  // Cleanup multi analysis timers
  useEffect(() => {
    return () => {
      Object.values(multiAnalysisTimers.current).forEach(t => clearTimeout(t));
    };
  }, []);

  // Single-product analysis (existing logic)
  useEffect(() => {
    if (isAnalyzing && !isMultiMode) {
      if (selectedProducts.length > 0) { setExpandedAnalysisId(selectedProducts[0].id); }

      // History product fast path: skip animation, complete immediately
      if (selectedProducts.length > 0 && selectedProducts[0].isFromHistory) {
        const p = selectedProducts[0];
        const mockReports = {};
        mockReports[p.id] = { summary: `${p.name} 网页核心卖点：高品质复古设计，适用于多种场景。`, recommendedAudience: "25-45 岁，对极简主义和高质感生活有追求的都市人群。", competitors: ["Lululemon", "Everlane", "Zara Home"] };
        setReports(mockReports);
        setCurrentStep(ANALYSIS_STEPS.length - 1);
        onAnalysisComplete(mockReports);
        return;
      }

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
    } else if (!isAnalyzing) { setCurrentStep(0); }
  }, [isAnalyzing, isMultiMode, onAnalysisComplete, selectedProducts]);

  useEffect(() => {
    if (isAnalyzing && !isMultiMode) scrollToBottom();
  }, [currentStep, isAnalyzing, isMultiMode]);

  const AnalysisReportModal = ({ productId, onClose }) => {
    const product = selectedProducts.find(p => p.id === productId);
    const zIndex = useZIndex(true);
    const productAnalysis = productAnalyses[productId];
    const isProductAnalyzing = isMultiMode && productAnalysis?.status === 'analyzing';
    const productCurrentStep = isProductAnalyzing ? (productAnalysis?.currentStep ?? 0) : ANALYSIS_STEPS.length - 1;
    const visibleSteps = ANALYSIS_STEPS.slice(0, productCurrentStep + 1);
    const modalScrollRef = useRef(null);

    useEffect(() => {
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
      }
    }, [productCurrentStep]);

    if (!product) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
        style={{ zIndex }}
      >
        <div className="bg-white w-full max-w-4xl rounded-section shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-base overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                <img src={product.imageUrl} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  产品分析报告
                  {isProductAnalyzing && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-500 rounded-tag text-xs font-semibold animate-pulse">
                      <Loader2 size={10} className="animate-spin" /> 分析中
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase">{product.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-300 transition-colors"><X size={24} /></button>
          </div>

          <div ref={modalScrollRef} className="flex-1 overflow-y-auto p-10 no-scrollbar bg-gray-50/30">
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-xl overflow-hidden">
              <div className="space-y-6">
                {visibleSteps.map((step, stepIdx) => {
                  let listIdx = 0;
                  if (step.type === 'ordered') {
                    listIdx = ANALYSIS_STEPS.slice(0, stepIdx + 1).filter(s => s.type === 'ordered').length;
                  }
                  
                  return (
                    <div key={stepIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {step.type === 'system' && (
                        <div className="pb-4 border-b border-gray-200 mb-4">
                          <p className="text-sm font-medium text-gray-600">
                            {step.text.split('https://www.cupshe.com').map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && <span className="text-primary-500 font-bold underline cursor-pointer">https://www.cupshe.com</span>}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      )}
                      {step.type === 'action_header' && (
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.text}</h4>
                      )}
                      {step.type === 'action' && (
                        <div className="flex items-start gap-3 pl-4 border-l-2 border-gray-50 mb-2">
                          <p className="text-sm font-medium text-gray-400">{step.text}</p>
                        </div>
                      )}
                      {step.type === 'image' && (
                        <div className="pl-4 mb-6">
                          <div className="rounded-section border border-gray-200 overflow-hidden shadow-xl max-w-2xl transition-all hover:scale-[1.01]">
                            <img src={step.url} alt="Captured UI" className="w-full h-auto" />
                          </div>
                        </div>
                      )}
                      {step.type === 'key_value' && (
                        <p className="text-sm leading-relaxed mb-2">
                          <span className="font-semibold text-gray-900">{step.text}</span>
                          <span className="text-gray-600 ml-1.5">{step.value}</span>
                        </p>
                      )}
                      {step.type === 'header' && (
                        <p className="text-sm font-medium text-gray-900 pt-2 mb-2">{step.text}</p>
                      )}
                      {step.type === 'bullet' && (
                        <div className="flex items-start gap-3 pl-4 mb-1.5">
                          <span className="text-gray-900 mt-1.5 text-xs font-medium">•</span>
                          <p className="text-sm font-medium text-gray-600 leading-relaxed">
                            {step.text.split('-').map((part, i) => (
                              i === 0 ? <span key={i} className="font-semibold text-gray-900">{part}</span> : <span key={i}>- {part}</span>
                            ))}
                          </p>
                        </div>
                      )}
                      {step.type === 'ordered' && (
                        <div className="flex items-start gap-3 pl-4 mb-1.5">
                          <span className="text-gray-900 text-sm font-medium">{listIdx}.</span>
                          <p className="text-sm font-medium text-gray-600 leading-relaxed">
                            {step.text.split('-').map((part, i) => (
                              i === 0 ? <span key={i} className="font-semibold text-gray-900">{part}</span> : <span key={i}>- {part}</span>
                            ))}
                          </p>
                        </div>
                      )}
                      {step.type === 'source' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-600 leading-relaxed">{step.text}</p>
                        </div>
                      )}
                      {step.type === 'footer' && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600 italic">{step.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-white border-t border-gray-200 flex justify-end shrink-0">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-primary-500 text-white rounded-base font-semibold hover:bg-primary-600 transition-all shadow-xl active:scale-95"
            >
              关闭报告
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleBatchAIGC = async () => {
    setActiveModal(null);
    const productsToGenerate = selectedProducts.filter(p => !batchAIGCExclusions.has(p.id));

    // Resolve target group (first group) for each product
    const targets = productsToGenerate.map(p => {
      const groups = productCreativeGroups?.[p.id] || [];
      const groupId = groups[0]?.id;
      return { p, groupId, key: groupId ? `${p.id}::${groupId}` : null };
    }).filter(t => t.groupId);

    setGeneratingCounts(prev => {
      const next = { ...prev };
      targets.forEach(t => { next[t.key] = (next[t.key] || 0) + batchAIGCCount; });
      return next;
    });

    await Promise.all(targets.map(async ({ p, groupId, key }) => {
      for (let i = 0; i < batchAIGCCount; i++) {
        try {
          const url = await generateAIGCCreative(`Batch generation ${i} for ${p.name}`);
          const newCreative = { id: `aigc-batch-${Date.now()}-${i}-${p.id}-${Math.random()}`, url, productId: p.id };
          addAdsToGroup(p.id, groupId, [newCreative]);
        } finally {
          setGeneratingCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 1) - 1) }));
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

  const handleAIGCForGroup = async (productId, groupId) => {
    const counterKey = `${productId}::${groupId}`;
    setGeneratingCounts(prev => ({ ...prev, [counterKey]: (prev[counterKey] || 0) + 1 }));
    try {
      const url = await generateAIGCCreative("Advertising product photography");
      const newCreative = { id: `aigc-${Date.now()}-${Math.random()}`, url, productId };
      addAdsToGroup(productId, groupId, [newCreative]);
    } finally {
      setGeneratingCounts(prev => ({ ...prev, [counterKey]: Math.max(0, (prev[counterKey] || 1) - 1) }));
    }
  };

  const filesToCreatives = (files, productId) => {
    return Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .map(file => ({
        id: `upload-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        productId,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      }));
  };

  const handleUploadForGroup = (productId, groupId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/mp4,video/quicktime,video/webm';
    input.onchange = (e) => {
      const newCreatives = filesToCreatives(e.target.files || [], productId);
      if (newCreatives.length) addAdsToGroup(productId, groupId, newCreatives);
    };
    input.click();
  };

  const handleDropForGroup = (e, productId, groupId) => {
    e.preventDefault();
    e.stopPropagation();
    const newCreatives = filesToCreatives(e.dataTransfer.files || [], productId);
    if (newCreatives.length) addAdsToGroup(productId, groupId, newCreatives);
  };

  const handleSyncConnect = (platform) => {
    setSyncStates(prev => ({ ...prev, [platform]: { ...prev[platform], isConnecting: true } }));
    setTimeout(() => { 
      setSyncStates(prev => ({ ...prev, [platform]: { isConnected: true, isConnecting: false, email: 'user@example.com' } })); 
      onAuthStatusChange(prev => ({ ...prev, [platform]: true }));
    }, 3000);
  };

  const handleSyncDisconnect = (platform) => {
    setSyncStates(prev => ({ ...prev, [platform]: { isConnected: false, isConnecting: false, email: '' } }));
    onAuthStatusChange(prev => ({ ...prev, [platform]: false }));
  };

  return (
    <div className="space-y-10">
      <div className={`relative transition-all duration-500 ${(analysisFinished || isAnalyzing) ? 'pointer-events-none select-none' : ''}`}>
        {(analysisFinished || isAnalyzing) && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer" onClick={onReset}>
            <button className="px-8 py-3 bg-primary-500 text-white rounded-xl font-semibold transform scale-95 group-hover:scale-100 transition-all flex items-center gap-2">
              <RefreshCw size={16} /> 重新添加产品
            </button>
          </div>
        )}
        <div className={(analysisFinished || isAnalyzing) ? 'opacity-40 grayscale-[0.5] blur-[0.5px]' : ''}>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100/50 p-1 rounded-base border border-gray-100 flex items-center shadow-sm">
              <button onClick={() => onCampaignTypeChange('PRODUCT')} className={`px-8 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${campaignType === 'PRODUCT' ? 'bg-white text-primary-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                <Tag size={14} /> 投放产品广告
              </button>
              <button onClick={() => onCampaignTypeChange('CATALOG')} className={`px-8 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${campaignType === 'CATALOG' ? 'bg-white text-primary-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                <Database size={14} /> 投放目录广告
              </button>
              <button onClick={() => onCampaignTypeChange('APP')} className={`px-8 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${campaignType === 'APP' ? 'bg-white text-primary-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                <Smartphone size={14} /> 投放 App 广告
              </button>
            </div>
          </div>
          {campaignType === 'PRODUCT' ? (
            <div className="space-y-6">
              <div className="relative">
                {hasGeneratedOnce && (
                  <div className="absolute -top-4 left-6 z-10">
                  </div>
                )}
                <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center gap-6 focus-within:bg-white focus-within:border-primary-500 transition-all ${selectedProducts.length > 0 ? 'border-gray-300' : ''}`}>
                  <div className="w-12 h-12 bg-white rounded-base flex items-center justify-center text-gray-300 shadow-sm border border-gray-100"><Link2 size={24} /></div>
                  <input 
                    type="text" 
                    placeholder="粘贴投放目标 URL，回车立即解析..." 
                    className="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-800 placeholder:text-gray-300" 
                    value={urlInput} 
                    onChange={(e) => setUrlInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl(); }} 
                  />
                  <button 
                    onClick={handleAddUrl}
                    className={`w-12 h-12 rounded-base flex items-center justify-center transition-all ${urlInput.trim() ? 'bg-primary-500 text-white shadow-lg hover:bg-primary-600 active:scale-95' : 'bg-white text-gray-200 border border-gray-100'}`}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 px-2">
                <button onClick={() => setActiveModal('history')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-400 hover:text-primary-500 hover:border-primary-500/15 transition-all shadow-sm"><History size={14} /> 从产品库选择历史产品</button>
                <button onClick={() => setActiveModal('shopify')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-400 hover:text-primary-500 hover:border-primary-500/15 transition-all shadow-sm"><ShoppingBag size={14} /> 从 Shopify 选择产品</button>
              </div>
            </div>
          ) : campaignType === 'APP' ? (
            <AppPickerSection
              platform={platform}
              authStatus={authStatus}
              isAuthLoading={isAuthLoading}
              handleAuthorize={handleAuthorize}
              selectedProducts={selectedProducts}
              onSelectProducts={onSelectProducts}
              selectedAccount={selectedAccount}
              onPickAccount={() => {
                if (platform?.id === 'meta' && onMetaAccountPick) onMetaAccountPick();
                else setActiveModal('select_account');
              }}
            />
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
              {!platform ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-base flex items-center justify-center shadow-sm"><AlertCircle size={32} /></div>
                  <div className="max-w-md space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">请先在顶部选择投放渠道</h4>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">投放目录广告需先在『投放目标与渠道』中选择 Meta 或 TikTok。</p>
                  </div>
                </div>
              ) : !authStatus[platform.id] ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center text-center space-y-6">
                  <div className={`w-16 h-16 rounded-base flex items-center justify-center shadow-sm ${platform.id === 'meta' ? 'bg-blue-50 text-blue-600' : 'bg-gray-900 text-white'}`}>
                    {platform.id === 'meta' ? <Facebook size={32} /> : <Smartphone size={32} />}
                  </div>
                  <div className="max-w-md space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">投放目录广告需先授权 {platform.name} {platform.id === 'meta' ? 'feeds' : 'Ads'}</h4>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">我们需要访问您的 {platform.name} 广告账户以获取目录（Catalog）及其关联的产品系列（Product Sets）数据。</p>
                  </div>
                  <button onClick={() => handleAuthorize(platform.id)} disabled={isAuthLoading} className="px-12 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-all shadow-xl flex items-center gap-3">
                    {isAuthLoading ? <Loader2 size={20} className="animate-spin" /> : (platform.id === 'meta' ? <Facebook size={20} /> : <Smartphone size={20} />)}
                    Connect {platform.name} Ads
                  </button>
                </div>
              ) : !selectedAccount ? (
                <div className="bg-primary-50/50 border-2 border-primary-500/15 rounded-xl p-10 flex items-center justify-between animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-base flex items-center justify-center text-primary-500 shadow-sm"><RefreshCw size={28} className="animate-spin-slow" /></div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{platform.name} 已授权，请选择关联广告账户</h4>
                      <p className="text-xs text-gray-400 font-bold mt-1">Found 2 available accounts</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal('select_account')} className="px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10">选择广告账户</button>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-primary-50/30 to-white border border-primary-500/15 rounded-2xl p-6 animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Database size={20} strokeWidth={2.2} /></div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">目录与商品系列组合</h4>
                      <p className="text-xs text-gray-500 mt-0.5">添加多组组合：每个目录将生成 1 个 Campaign，每个商品系列生成 1 个 AdSet。同一目录仅可选 1 次。</p>
                    </div>
                  </div>
                  <CatalogCombosField
                    channel={platform.id}
                    value={catalogCombos}
                    onChange={onCatalogCombosChange}
                  />
                </div>
              )}
            </div>
          )}
          {selectedProducts.length > 0 && campaignType !== 'CATALOG' && (!analysisFinished && !isAnalyzing) && (
            <div className="flex flex-col items-center pt-8 border-t border-gray-50 space-y-10 animate-in fade-in slide-in-from-bottom-6">
              <div className="w-full flex flex-col items-center space-y-8">
                <div className="w-full max-w-4xl space-y-4">
                  <div className="flex items-center justify-between px-6">
                    <h5 className="text-xs font-semibold text-gray-400 flex items-center gap-2"><Layers size={14} className="text-primary-500/70" /> {(analysisFinished || isAnalyzing) ? '产品清单' : '待解析产品清单'} ({selectedProducts.length})</h5>
                    <p className="text-xs text-gray-400 font-bold">{(analysisFinished || isAnalyzing) ? 'Add more products below' : 'Ready for agent deep scan'}</p>
                  </div>
                  <div className="w-full space-y-3 px-2">
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="group relative flex items-center justify-between bg-white border border-gray-100 rounded-base p-4 shadow-adsgo-card hover:shadow-md hover:border-primary-500/15 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 relative bg-gray-50 group-hover:bg-white transition-colors">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-1 border border-gray-100 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary-50/30" />
                                <div className="relative">
                                  <ImageIcon size={18} />
                                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <Link2 size={8} className="text-primary-500" />
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 uppercase relative z-10">{(analysisFinished || isAnalyzing) ? 'Analyzed' : 'Waiting...'}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{p.name || '未命名产品'}</p>
                            <div className="flex items-center gap-1.5 mt-1 opacity-60">
                              <Link2 size={12} className="shrink-0 text-gray-400" />
                              <p className="text-xs font-bold text-gray-400 truncate max-w-xs">{p.url}</p>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeProduct(p.id)} className="p-3 text-gray-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {!analysisFinished && !isAnalyzing && (
                  <button onClick={() => {
                    if (!platform) {
                      alert('请选择媒体渠道');
                      return;
                    }
                    onAnalysisStart();
                    if (isMultiMode) {
                      startMultiAnalysis(selectedProducts);
                    }
                  }} className="h-24 px-20 bg-primary-500 text-white rounded-section text-lg font-semibold flex items-center gap-6 hover:bg-primary-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group">
                    <Wand2 size={32} className="group-hover:rotate-12 transition-transform" /> 开启 {selectedProducts.length} 个产品的智能并行解析与生产 <ChevronRight size={32} />
                  </button>
                )}
              </div>
              {!analysisFinished && !isAnalyzing && (
                <p className="text-xs text-gray-400 font-bold">Next-gen media planning system</p>
              )}
            </div>
          )}
          {!analysisFinished && !isAnalyzing && campaignType === 'CATALOG' && catalogCombos.length > 0 && catalogCombos.every(c => c.catalog_id && c.product_set_ids?.length > 0) && (
            <div className="flex flex-col items-center pt-8 border-t border-gray-50 space-y-10 animate-in fade-in slide-in-from-bottom-6">
              <button onClick={() => onAnalysisComplete({})} className="h-24 px-16 bg-primary-500 text-white rounded-section text-lg font-semibold flex items-center gap-6 hover:bg-primary-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group">
                <Box size={32} className="group-hover:scale-110 transition-transform" />
                配置 {catalogCombos.length} 个目录组合（共 {catalogCombos.reduce((n, c) => n + (c.product_set_ids?.length || 0), 0)} 个 AdSet）的 feeds 广告结构
                <ChevronRight size={32} />
              </button>
              <p className="text-xs text-gray-400 font-bold">Next-gen media planning system</p>
            </div>
          )}
        </div>
      </div>
      {campaignType !== 'CATALOG' && (analysisFinished || isAnalyzing) && (
        <section className="animate-in fade-in duration-700">
          <div className="bg-gray-50/80 border border-gray-200/60 rounded-section overflow-hidden shadow-inner">
            <div className="p-8 md:p-10 bg-white border-b border-gray-200 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-base flex items-center justify-center shadow-lg shadow-primary-500/10"><Zap size={20} /></div>
                    <h3 className="text-xl font-semibold text-gray-900">智能素材生产工作台</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-bold">Orchestrate creative production at scale</p>
                </div>
                {allReady && (
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-base border border-gray-100">
                    <button onClick={() => setActiveModal('batch_match')} className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm group">
                      <Database size={16} className="group-hover:scale-110 transition-transform" /> 批量匹配素材库
                    </button>
                    <button onClick={() => setActiveModal('batch_aigc')} className="flex items-center gap-2.5 px-6 py-3.5 bg-primary-500 text-white rounded-xl text-xs font-medium hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/15 group">
                      <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> 批量 AIGC 生成
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {selectedProducts.map((p, idx) => {
                const groups = productCreativeGroups[p.id] || [];
                const totalCreatives = groups.reduce((sum, g) => sum + (g.ads?.length || 0), 0);
                const totalGenerating = groups.reduce((sum, g) => sum + (generatingCounts[`${p.id}::${g.id}`] || 0), 0);
                const isExpanded = expandedAnalysisId === p.id;
                const showAnalysisResult = analysisFinished || (isAnalyzing && p.isFromHistory);
                const isEditingThisProductGroup = editingGroup?.productId === p.id;

                return (
                  <div key={p.id} className="space-y-3">
                    <div className={`bg-white border rounded-section p-4 md:p-6 transition-all group ${totalCreatives === 0 && totalGenerating === 0 && showAnalysisResult ? 'border-amber-100 ring-2 ring-amber-500/5' : 'border-gray-100'}`}>
                      {/* Product header row */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm bg-gray-50">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-1">
                              <ImageIcon size={18} />
                              <span className="text-[9px] font-medium text-gray-300 uppercase">获取中</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{p.name}</h4>
                          {p.url && (
                            <div className="flex items-center gap-1 mt-0.5 max-w-[280px]">
                              <Link2 size={9} className="text-gray-300 shrink-0" />
                              <span className="text-[10px] text-gray-300 font-medium truncate">{p.url}</span>
                            </div>
                          )}
                          {(showAnalysisResult || (isMultiMode && (analysisFinished || isAnalyzing))) && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-tag ${totalCreatives > 0 ? 'bg-primary-50 text-primary-500' : 'bg-amber-50 text-amber-600'}`}>{totalCreatives} 素材 · {groups.length} 组</span>
                              {isMultiMode && productAnalyses[p.id]?.status === 'analyzing' ? (
                                <button onClick={() => setShowReportFor(p.id)} className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1">
                                  <Loader2 size={10} className="animate-spin" /> AI 分析产品中
                                </button>
                              ) : (
                                <button onClick={() => setShowReportFor(p.id)} className="text-xs font-medium text-gray-400 underline hover:text-primary-500">分析报告</button>
                              )}
                            </div>
                          )}
                        </div>
                        {(!showAnalysisResult && isAnalyzing && !p.isFromHistory) && (
                          <button onClick={() => setExpandedAnalysisId(isExpanded ? null : p.id)} className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-500 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors">
                            <Loader2 size={12} className="animate-spin" />Analyzing...{isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                        {showAnalysisResult && campaignType !== 'CATALOG' && (
                          <button
                            onClick={() => onAddGroup(p.id)}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary-500 hover:bg-primary-50 rounded-base transition-colors"
                            title="为该产品添加新的素材组"
                          >
                            <Plus size={14} /> 添加素材组
                          </button>
                        )}
                        {(!isAnalyzing || p.isFromHistory) && (
                          <button
                            onClick={() => removeProduct(p.id)}
                            disabled={selectedProducts.length <= 1}
                            title={selectedProducts.length <= 1 ? '至少保留 1 个产品' : '删除该产品'}
                            className={`shrink-0 p-3 transition-colors rounded-xl ${
                              selectedProducts.length <= 1
                                ? 'text-gray-200 cursor-not-allowed'
                                : 'text-gray-300 hover:text-rose-500 hover:bg-rose-50'
                            }`}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      {/* Creative groups */}
                      <div className="space-y-3">
                        {groups.map((group, gIdx) => {
                          const groupGenCount = generatingCounts[`${p.id}::${group.id}`] || 0;
                          const groupAds = group.ads || [];
                          const isThisGroupEditing = isEditingThisProductGroup && editingGroup?.groupId === group.id;
                          const groupKey = `${p.id}::${group.id}`;
                          const isDragOver = dragOverGroupKey === groupKey;
                          return (
                            <div
                              key={group.id}
                              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverGroupKey(groupKey); }}
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onDragLeave={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                if (e.currentTarget.contains(e.relatedTarget)) return;
                                setDragOverGroupKey(null);
                              }}
                              onDrop={(e) => { handleDropForGroup(e, p.id, group.id); setDragOverGroupKey(null); }}
                              className={`border rounded-inner p-4 transition-colors ${
                                isDragOver
                                  ? 'bg-primary-50/30 border-primary-500 border-dashed'
                                  : 'bg-gray-50/50 border-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3 gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Layers size={14} className="text-primary-500/70 shrink-0" />
                                  {isThisGroupEditing ? (
                                    <input
                                      autoFocus
                                      defaultValue={group.name}
                                      maxLength={30}
                                      onBlur={(e) => {
                                        const v = e.target.value.trim() || group.name;
                                        if (v !== group.name) onRenameGroup(p.id, group.id, v);
                                        setEditingGroup(null);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.currentTarget.blur(); }
                                        if (e.key === 'Escape') { setEditingGroup(null); }
                                      }}
                                      className="flex-1 px-2 py-1 text-sm font-semibold text-gray-900 bg-white border border-primary-500 rounded-base outline-none focus:shadow-primary-focus"
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setEditingGroup({ productId: p.id, groupId: group.id })}
                                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-primary-500 transition-colors group/name"
                                      title="点击重命名"
                                    >
                                      <span className="truncate max-w-[200px]">{group.name}</span>
                                      <Edit2 size={11} className="opacity-0 group-hover/name:opacity-100 transition-opacity text-gray-400" />
                                    </button>
                                  )}
                                  <span className="text-xs font-medium text-gray-400 shrink-0">· {groupAds.length} 素材</span>
                                  {(() => {
                                    const copy = creativeGroupCopyMap?.[p.id]?.[group.id] || {};
                                    const filled = Boolean(copy.title || copy.body || copy.link_url || copy.call_to_action_type);
                                    return filled ? (
                                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-tag shrink-0">已配置文案</span>
                                    ) : null;
                                  })()}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => setCopyEditorTarget({ productId: p.id, groupId: group.id, groupName: group.name })}
                                    className="flex items-center gap-1 px-2 h-7 text-[11px] font-medium text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 rounded-base transition-colors"
                                    title="编辑该素材组文案（标题 / 正文 / 落地页 / CTA）"
                                  >
                                    <FileText size={12} />
                                    文案
                                  </button>
                                  {groups.length > 1 && (
                                    <button
                                      onClick={() => onRemoveGroup(p.id, group.id)}
                                      className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-base transition-colors"
                                      title="删除该素材组"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 min-w-0">
                                {[...Array(groupGenCount)].map((_, i) => (
                                  <NanoBananaSkeleton key={`gen-${group.id}-${i}`} />
                                ))}
                                {groupAds.map(c => {
                                  const isFlashing = flashAdId === c.id;
                                  const handlePreview = (e) => {
                                    if (e) { e.preventDefault(); e.stopPropagation(); }
                                    console.log('[Thumbnail] click', c);
                                    setFlashAdId(c.id);
                                    setPreviewMedia({ url: c.url, mediaType: c.mediaType || 'image', name: c.fileName || c.id || '' });
                                    // 终极兜底：直接 DOM 操作渲染浮窗，完全绕开 React state / portal / 任何组件
                                    // 如果连这个都看不到，说明浏览器层面被拦截
                                    try {
                                      const existing = document.getElementById('__media_preview_overlay__');
                                      if (existing) existing.remove();
                                      const url = c.url;
                                      const isVideo = (c.mediaType || '') === 'video';
                                      const overlay = document.createElement('div');
                                      overlay.id = '__media_preview_overlay__';
                                      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:32px;cursor:zoom-out;';
                                      const closeOverlay = () => { overlay.remove(); document.removeEventListener('keydown', escHandler); };
                                      const escHandler = (ev) => { if (ev.key === 'Escape') closeOverlay(); };
                                      document.addEventListener('keydown', escHandler);
                                      overlay.onclick = closeOverlay;
                                      const inner = document.createElement('div');
                                      inner.style.cssText = 'background:#fff;border-radius:12px;padding:16px;max-width:90vw;max-height:85vh;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:default;position:relative;box-shadow:0 25px 60px rgba(0,0,0,0.6);';
                                      inner.onclick = (ev) => ev.stopPropagation();
                                      const closeBtn = document.createElement('button');
                                      closeBtn.type = 'button';
                                      closeBtn.textContent = '×';
                                      closeBtn.style.cssText = 'position:absolute;top:-14px;right:-14px;width:32px;height:32px;border-radius:50%;background:#fff;border:2px solid #e5e7eb;cursor:pointer;font-size:18px;line-height:1;';
                                      closeBtn.onclick = (ev) => { ev.stopPropagation(); closeOverlay(); };
                                      const media = document.createElement(isVideo ? 'video' : 'img');
                                      media.src = url || '';
                                      media.style.cssText = 'max-width:100%;max-height:75vh;border-radius:8px;object-fit:contain;background:#000;';
                                      if (isVideo) { media.controls = true; media.autoplay = true; media.playsInline = true; }
                                      const caption = document.createElement('p');
                                      caption.textContent = c.fileName || c.id || '';
                                      caption.style.cssText = 'font-size:12px;color:#6b7280;margin:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
                                      inner.appendChild(closeBtn);
                                      inner.appendChild(media);
                                      if (caption.textContent) inner.appendChild(caption);
                                      overlay.appendChild(inner);
                                      document.body.appendChild(overlay);
                                      console.log('[Preview] overlay injected to body, url=', url);
                                    } catch (err) {
                                      console.error('[Preview] DOM inject failed', err);
                                    }
                                  };
                                  return (
                                    <div
                                      key={c.id}
                                      className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-100 group/item shadow-sm bg-gray-100 hover:ring-2 hover:ring-primary-500/40 transition-all"
                                      style={isFlashing ? { boxShadow: '0 0 0 3px #f43f5e, 0 0 12px rgba(244,63,94,0.6)' } : undefined}
                                    >
                                      {c.mediaType === 'video' ? (
                                        <video src={c.url} muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                                      ) : (
                                        <img src={c.url} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                                      )}
                                      {/* 透明覆盖按钮：点击触发预览（onPointerDown + onClick 双保险） */}
                                      <button
                                        type="button"
                                        onPointerDown={handlePreview}
                                        onClick={handlePreview}
                                        title="点击预览"
                                        aria-label="预览素材"
                                        className="absolute inset-0 w-full h-full cursor-zoom-in"
                                        style={{ zIndex: 2 }}
                                      />
                                      {c.mediaType === 'video' && (
                                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center text-white pointer-events-none" style={{ zIndex: 4 }}>
                                          <Play size={8} fill="currentColor" />
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAdFromGroup(p.id, group.id, c.id); }}
                                        title="移除素材"
                                        className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all text-rose-500 shadow-md"
                                        style={{ zIndex: 5 }}
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  );
                                })}
                                <div className="sticky right-0 flex gap-2 shrink-0 bg-gray-50/0 pl-2" style={{ zIndex: 6 }}>
                                  <button onClick={() => { setModalContext(p.id); setModalGroupId(group.id); setActiveModal('creative_lib'); }} className="w-14 h-20 rounded-lg border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-primary-500 hover:text-primary-500/70 hover:bg-primary-50 transition-all gap-1" title="从素材库选择">
                                    <Database size={16} />
                                    <span className="text-xs font-medium">库</span>
                                  </button>
                                  <button onClick={() => handleAIGCForGroup(p.id, group.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-purple-100 flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all gap-1" title="AI 生成">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-medium">AI</span>
                                  </button>
                                  <button onClick={() => handleUploadForGroup(p.id, group.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all gap-1" title="本地上传">
                                    <Upload size={16} />
                                    <span className="text-xs font-medium">传</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {isAnalyzing && isExpanded && !p.isFromHistory && (
                      <div className="bg-white rounded-xl p-10 border border-gray-100 mx-4 animate-in slide-in-from-top-2 shadow-xl overflow-hidden">
                        <div ref={analysisContainerRef} className="h-[500px] overflow-y-auto custom-scrollbar pr-4 space-y-6">
                          {ANALYSIS_STEPS.slice(0, currentStep + 1).map((step, stepIdx) => {
                            let listIdx = 0;
                            if (step.type === 'ordered') {
                              listIdx = ANALYSIS_STEPS.slice(0, stepIdx + 1).filter(s => s.type === 'ordered').length;
                            }
                            
                            return (
                              <div key={stepIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {step.type === 'system' && (
                                  <div className="pb-4 border-b border-gray-200 mb-4">
                                    <p className="text-sm font-medium text-gray-600">
                                      {step.text.split('https://www.cupshe.com').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                          {part}
                                          {i < arr.length - 1 && <span className="text-primary-500 font-bold underline cursor-pointer">https://www.cupshe.com</span>}
                                        </React.Fragment>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'action_header' && (
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.text}</h4>
                                )}
                                {step.type === 'action' && (
                                  <div className="flex items-start gap-3 pl-4 border-l-2 border-gray-50 mb-2">
                                    <p className="text-sm font-medium text-gray-400">{step.text}</p>
                                  </div>
                                )}
                                {step.type === 'image' && (
                                  <div className="pl-4 mb-6">
                                    <div className="rounded-section border border-gray-200 overflow-hidden shadow-xl max-w-2xl transition-all hover:scale-[1.01]">
                                      <img src={step.url} alt="Captured UI" className="w-full h-auto" />
                                    </div>
                                  </div>
                                )}
                                {step.type === 'key_value' && (
                                  <p className="text-sm leading-relaxed mb-2">
                                    <span className="font-semibold text-gray-900">{step.text}</span>
                                    <span className="text-gray-600 ml-1.5">{step.value}</span>
                                  </p>
                                )}
                                {step.type === 'header' && (
                                  <p className="text-sm font-medium text-gray-900 pt-2 mb-2">{step.text}</p>
                                )}
                                {step.type === 'bullet' && (
                                  <div className="flex items-start gap-3 pl-4 mb-1.5">
                                    <span className="text-gray-900 mt-1.5 text-xs font-medium">•</span>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                      {step.text.split('-').map((part, i) => (
                                        i === 0 ? <span key={i} className="font-semibold text-gray-900">{part}</span> : <span key={i}>- {part}</span>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'ordered' && (
                                  <div className="flex items-start gap-3 pl-4 mb-1.5">
                                    <span className="text-gray-900 text-sm font-medium">{listIdx}.</span>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                      {step.text.split('-').map((part, i) => (
                                        i === 0 ? <span key={i} className="font-semibold text-gray-900">{part}</span> : <span key={i}>- {part}</span>
                                      ))}
                                    </p>
                                  </div>
                                )}
                                {step.type === 'source' && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{step.text}</p>
                                  </div>
                                )}
                                {step.type === 'footer' && (
                                  <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-600 italic">{step.text}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div />
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
          type={activeModal} onClose={() => { setActiveModal(null); setModalGroupId(null); }}
          authStatus={authStatus} anyConnected={anyConnected} isAddModalOpen={isAddModalOpen}
          handleAuthorize={handleAuthorize} isAuthLoading={isAuthLoading} setIsAddModalOpen={setIsAddModalOpen}
          selectedProducts={selectedProducts} onSelectProducts={onSelectProducts}
          onUpdateCreatives={onUpdateCreatives} productCreatives={productCreatives} modalContext={modalContext}
          modalGroupId={modalGroupId} onAddAdsToGroup={addAdsToGroup}
          channelPlatform={platform}
          channelSelectedAccount={selectedAccount}
          onOpenChannelAccountPicker={onMetaAccountPick}
        />
      )}
      {activeModal === 'batch_match' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-xl rounded-section shadow-xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-base flex items-center justify-center text-white shadow-lg"><Database size={24} /></div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">批量匹配素材库</h4>
                  <p className="text-gray-400 text-xs font-bold mt-1">智能分析并关联现有营销资产</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-50 rounded-full text-gray-300"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {[{ id: '24h', label: '智能匹配 24h 内上传素材', icon: <Sparkles size={16} /> }, { id: 'unused', label: '智能匹配历史从未投放过素材', icon: <FileText size={16} /> }, { id: 'top7d', label: '智能匹配近 7 天 TOP 素材', icon: <Flame size={16} /> }].map(opt => {
                const isSel = selectedMatchOptions.has(opt.id);
                return (
                  <button key={opt.id} onClick={() => {
                    const next = new Set(selectedMatchOptions);
                    if (next.has(opt.id)) next.delete(opt.id); else next.add(opt.id);
                    setSelectedMatchOptions(next);
                  }} className={`w-full p-6 rounded-base border-2 flex items-center justify-between transition-all group ${isSel ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isSel ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{opt.icon}</div>
                      <span className={`text-sm font-medium ${isSel ? 'text-primary-700' : 'text-gray-600'}`}>{opt.label}</span>
                    </div>
                    {isSel && <Check size={20} className="text-primary-500" />}
                  </button>
                );
              })}
            </div>
            <button onClick={handleBatchMatch} className="w-full py-5 rounded-base text-sm font-medium shadow-xl bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:shadow-primary-focus transition-all">确认并开始批量匹配</button>
          </div>
        </ModalWrapper>
      )}
      {activeModal === 'batch_aigc' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-2xl rounded-section shadow-xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-base flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">批量 AIGC 生成素材</h4>
                  <p className="text-gray-400 text-xs font-bold mt-1">为每个所选商品并行生成差异化创意</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-50 rounded-full text-gray-300"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400">每个商品生成的素材数量</label>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setBatchAIGCCount(n)} className={`h-12 rounded-xl font-semibold text-sm border-2 transition-all ${batchAIGCCount === n ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/10' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400">选择执行商品 ({selectedProducts.length - batchAIGCExclusions.size})</label>
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar pr-2">
                  {selectedProducts.map(p => (
                    <div key={p.id} onClick={() => { const next = new Set(batchAIGCExclusions); if (next.has(p.id)) next.delete(p.id); else next.add(p.id); setBatchAIGCExclusions(next); }} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${!batchAIGCExclusions.has(p.id) ? 'border-purple-100 bg-white' : 'border-gray-100 opacity-50 grayscale'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                        <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!batchAIGCExclusions.has(p.id) ? 'bg-primary-500 border-primary-500' : 'bg-transparent border-gray-200'}`}>
                        {!batchAIGCExclusions.has(p.id) && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleBatchAIGC} className="w-full py-5 bg-primary-500 text-white rounded-full font-semibold shadow-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3">
              <Sparkles size={20} /> 开始并行生成创意
            </button>
          </div>
        </ModalWrapper>
      )}
      {activeModal === 'select_account' && (
        <ModalWrapper>
          <div className="bg-white w-full max-w-xl rounded-section shadow-xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-base flex items-center justify-center text-white shadow-lg"><Briefcase size={24} /></div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">选择 {platform?.name || 'Meta'} 广告账户</h4>
                  <p className="text-gray-400 text-xs font-bold mt-1">关联广告账户并同步投放权限</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-50 rounded-full text-gray-300"><X size={24} /></button>
            </div>
            <div className="space-y-3">
              {accountLoading.isLoading ? (
                <div className="p-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="animate-spin text-primary-500/70" />
                  <p className="text-xs font-medium text-gray-400 animate-pulse">Loading accounts...</p>
                </div>
              ) : (
                (availableAccounts.length > 0 ? availableAccounts : MOCK_ACCOUNTS).map(acc => (
                  <button key={acc.id} onClick={() => { onSelectAccount(acc); setActiveModal(null); }} className={`w-full p-6 rounded-full border-2 flex items-center justify-between transition-all ${selectedAccount?.id === acc.id ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-2 rounded-lg ${selectedAccount?.id === acc.id ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-400'}`}><Briefcase size={16} /></div>
                      <div>
                        <p className={`text-sm font-medium ${selectedAccount?.id === acc.id ? 'text-primary-700' : 'text-gray-600'}`}>{acc.name}</p>
                        <p className="text-xs text-gray-400 font-bold">id: {acc.id}</p>
                      </div>
                    </div>
                    {selectedAccount?.id === acc.id && <Check size={20} className="text-primary-500" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </ModalWrapper>
      )}
      {showReportFor && (
        <AnalysisReportModal 
          productId={showReportFor} 
          onClose={() => setShowReportFor(null)} 
        />
      )}
      {isAddModalOpen && <AddProductModal onClose={closeAddModal} authStatus={authStatus} handleAuthorize={handleAuthorize} isAuthLoading={isAuthLoading} shopifyStoreName={shopifyStoreName} onAuthStatusChange={onAuthStatusChange} setIsShopifyConnected={setIsShopifyConnected} isShopifyConnected={isShopifyConnected} syncStates={syncStates} handleSyncConnect={handleSyncConnect} handleSyncDisconnect={handleSyncDisconnect} addStep={addStep} setAddStep={setAddStep} productUrl={productUrl} setProductUrl={setProductUrl} urlError={urlError} handleImportAnalyzeUrl={handleImportAnalyzeUrl} isImportAnalyzing={isImportAnalyzing} productForm={productForm} handleCreateProduct={handleCreateProduct} />}
    </div>
  );
};

const ModalWrapper = ({ children }) => {
  const zIndex = useZIndex(true);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      {children}
    </div>
  );
};

const AddProductModal = ({ onClose, authStatus, handleAuthorize, isAuthLoading, shopifyStoreName, onAuthStatusChange, setIsShopifyConnected, isShopifyConnected, syncStates, handleSyncConnect, handleSyncDisconnect, addStep, setAddStep, productUrl, setProductUrl, urlError, handleImportAnalyzeUrl, isImportAnalyzing, productForm, handleCreateProduct }) => {
  const zIndex = useZIndex(true);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex }}
    >
      <div className={`bg-white rounded-section w-full shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col relative transition-all duration-500 ${addStep === 'setup' ? 'max-w-4xl h-[90vh]' : 'max-w-2xl min-h-[400px]'}`}>
        {isImportAnalyzing && (
          <div className="absolute inset-0 z-[120] bg-white rounded-section flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-section bg-primary-50 flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-section border-4 border-primary-500/15 border-t-primary-500 animate-spin" />
              <Loader2 className="text-primary-500 animate-spin" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Analyzing product info...</h3>
            <p className="text-xs text-gray-400 font-medium mb-10 max-w-[320px] font-sans">We're fetching details from the URL. This might take a few moments.</p>
            <button onClick={onClose} className="px-10 py-3.5 bg-primary-500 text-white rounded-full font-bold text-sm hover:bg-primary-600 transition-all active:scale-95 shadow-lg shadow-gray-200 font-sans">Close and analyze in background</button>
          </div>
        )}
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            {addStep !== 'options' && (<button onClick={() => setAddStep('options')} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"><ArrowLeft size={20} /></button>)}
            <h3 className="text-xl font-bold text-gray-900 font-sans">{addStep === 'options' ? '请选择同步产品 data 方式' : addStep === 'url' ? 'Import from URL' : addStep === 'setup' ? 'Setup your product' : addStep === 'shopify' ? 'Sync from Shopify' : addStep === 'gmc' ? 'Sync from Google GMC' : 'Sync from Meta feeds'}</h3>
          </div>
          <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"><X size={20} /></button>
        </div>
        <div className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
          {addStep === 'options' && (
            <div className="space-y-4 pt-4">
              {ADD_OPTIONS.filter(opt => ['shopify', 'meta', 'gmc'].includes(opt.id)).map((option) => {
                const isConnected = option.id === 'shopify' ? authStatus.shopify : option.id === 'meta' ? authStatus.meta : authStatus.google;
                return (
                  <button key={option.id} onClick={() => setAddStep(option.id)} className="w-full group flex items-center gap-6 p-6 bg-gray-50 border border-gray-100 rounded-section hover:bg-white hover:shadow-xl hover:border-primary-500/15 transition-all text-left">
                    <div className="w-14 h-14 rounded-base bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary-50 group-hover:border-primary-50 group-hover:shadow-inner transition-all overflow-hidden p-3 shrink-0">
                      {option.logo ? <img src={option.logo} alt="" className="w-full h-full object-contain" /> : <option.icon size={26} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-base font-bold text-gray-700 font-sans">{option.title}</h4>
                        {isConnected && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">Connected</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-400 leading-relaxed font-sans">{option.subtitle}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500/70 group-hover:trangray-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
          {addStep === 'url' && (
            <div className="flex-1 flex flex-col pt-6 px-10 text-center">
              <div className="space-y-8 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight font-sans">Paste your <span className="text-primary-500">product link</span> to get product info</h2>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 font-sans">AdsGo supports</p>
                  <div className="flex items-center justify-center gap-4">
                    {PLATFORM_ICONS.map(icon => (<div key={icon.id} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:scale-110 transition-all cursor-default"><img src={icon.logo} alt={icon.id} className="w-full h-full object-contain" /></div>))}
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-sm">...</div>
                  </div>
                </div>
              </div>
              <div className="space-y-8 max-w-[520px] mx-auto w-full flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="relative group">
                    <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="e.g. amazon product link, shopify product link, etc." className={`w-full bg-gray-50 border-2 rounded-section px-8 py-6 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none transition-all duration-300 ${urlError ? 'border-rose-400 bg-rose-50/20' : 'border-gray-100 focus:bg-white focus:border-primary-500 focus:shadow-primary-focus shadow-inner'}`} />
                    {urlError && <div className="absolute -bottom-7 left-4 flex items-center gap-1.5 text-rose-500 font-bold text-xs animate-in slide-in-from-top-1"><AlertTriangle size={12} />{urlError}</div>}
                  </div>
                </div>
                <div className="mt-auto">
                  <button onClick={handleImportAnalyzeUrl} className="w-full bg-primary-500 text-white py-5 rounded-base font-bold text-base hover:bg-primary-600 shadow-xl shadow-primary-500/10 transition-all active:scale-[0.97] font-sans">Analyze URL</button>
                </div>
              </div>
            </div>
          )}
          {addStep === 'setup' && (<ProductSetupForm isOpen={true} initialData={productForm} onClose={() => setAddStep('options')} onCreate={handleCreateProduct} />)}
          {addStep === 'shopify' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
              {!isShopifyConnected ? (
                <>
                  <div className="w-20 h-20 rounded-section bg-gray-50 border border-gray-100 flex items-center justify-center p-4 shadow-inner">
                    <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="max-w-[320px] space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 font-sans">Connect to Shopify</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium font-sans">Link your Shopify store to automatically import products and keep assets in sync.</p>
                  </div>
                  <button onClick={() => handleAuthorize('shopify')} disabled={isAuthLoading} className="w-full max-w-[280px] bg-primary-500 text-white py-4 rounded-full font-bold text-sm hover:bg-primary-600 shadow-lg shadow-gray-200 transition-all active:scale-95 font-sans">Connect Shopify store</button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-section bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                      <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 font-sans">{shopifyStoreName}</h4>
                    <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-xs text-green-600 font-bold font-sans">Connected</p></div>
                  </div>
                  <div className="w-full pt-6">
                    <button onClick={() => { setIsShopifyConnected(false); onAuthStatusChange(p => ({ ...p, shopify: false })); }} className="px-8 py-3 bg-gray-50 border border-gray-100 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-bold text-sm transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"><Link2Off size={18} />Disconnect store</button>
                  </div>
                </>
              )}
            </div>
          )}
          {(addStep === 'gmc' || addStep === 'meta') && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
              {syncStates[addStep].isConnecting ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-section bg-primary-50 flex items-center justify-center shadow-inner">
                    <Loader2 className="text-primary-500 animate-spin" size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Fetching your assets...</p>
                </div>
              ) : !syncStates[addStep].isConnected ? (
                <>
                  <div className="w-20 h-20 rounded-section bg-gray-50 border border-gray-100 flex items-center justify-center p-4 shadow-inner">
                    <img src={addStep === 'gmc' ? 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="max-w-[320px] space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 font-sans">{addStep === 'gmc' ? 'Google GMC' : 'Meta feeds'}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium font-sans">{addStep === 'gmc' ? 'Connect to Google Merchant Center to sync your products.' : 'Connect to Meta Commerce Manager to sync your product feeds.'}</p>
                  </div>
                  <button onClick={() => handleSyncConnect(addStep)} className="w-full max-w-[280px] bg-primary-500 text-white py-4 rounded-full font-bold text-sm hover:bg-primary-600 shadow-lg shadow-gray-200 transition-all active:scale-95 font-sans">Connect</button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-section bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                      <img src={addStep === 'gmc' ? 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 font-sans">{syncStates[addStep].email}</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-xs text-green-600 font-bold font-sans">Connected</p>
                    </div>
                  </div>
                  <div className="w-full pt-6">
                    <button onClick={() => handleSyncDisconnect(addStep)} className="px-8 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-full font-bold text-sm transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"><Link2Off size={18} />Disconnect</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <MediaPreviewModal media={previewMedia} onClose={() => setPreviewMedia(null)} />
      {/* Phase 2.M：素材组级 ad copy 编辑器 */}
      <AdCopyEditor
        open={!!copyEditorTarget}
        onClose={() => setCopyEditorTarget(null)}
        productId={copyEditorTarget?.productId}
        groupId={copyEditorTarget?.groupId}
        groupName={copyEditorTarget?.groupName}
        channel={(platform === 'tiktok') ? 'tiktok' : 'meta'}
        value={copyEditorTarget ? (creativeGroupCopyMap?.[copyEditorTarget.productId]?.[copyEditorTarget.groupId] || {}) : {}}
        ctaOptions={ctaOptions}
        onSave={(next) => {
          if (!copyEditorTarget) return;
          onSaveGroupCopy?.(copyEditorTarget.productId, copyEditorTarget.groupId, next);
        }}
      />
      {/* Fallback 内联兜底浮窗：不走 portal、不依赖任何外部组件，确保点击素材一定可见。
          如果 MediaPreviewModal 没出现但这个出现了 → 是 portal/独立组件的问题。
          如果两者都没出现 → 是 setPreviewMedia state 没生效。 */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 2147483647,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              cursor: 'default',
            }}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreviewMedia(null); }}
              style={{
                position: 'absolute', top: -14, right: -14,
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff', border: '2px solid #e5e7eb',
                cursor: 'pointer', fontSize: 18, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="关闭预览"
            >×</button>
            {previewMedia.mediaType === 'video' ? (
              <video
                src={previewMedia.url}
                controls
                autoPlay
                style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: 8, background: '#000' }}
              />
            ) : (
              <img
                src={previewMedia.url}
                alt={previewMedia.name || 'preview'}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8 }}
              />
            )}
            {previewMedia.name && (
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {previewMedia.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductSetupForm = ({ isOpen, initialData, onClose, onCreate }) => {
  return null; // Placeholder
};

export default ProductSelector;
