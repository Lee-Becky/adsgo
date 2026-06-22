import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Briefcase, Sparkles, ChevronLeft,
  Rocket, Edit3, DollarSign, X, Check, Globe,
  Layers, Target, Box, Plus, Tag, Link as LinkIcon, Megaphone,
  ChevronDown, Search, Languages, Users, UserPlus, UserMinus,
  ShoppingBag, Monitor, Smartphone, Layout, Facebook, Loader2, Trash2,
  Database, ListFilter, Info, Music, Upload
} from 'lucide-react';
import useDropdownLoading from '../../../hooks/useDropdownLoading';
import { IncludeExcludeAudienceDropdown } from '../BatchGenerateAds';
import { MOCK_CATALOGS, MOCK_PRODUCT_SETS } from './ProductSelector';
import { Popover } from '../../common/Popover';
import { Z_INDEX } from '../../../constants/zIndex';



const CTA_OPTIONS = [
  'Shop Now',
  'Learn More',
  'Sign Up',
  'Get Offer',
  'Book Now',
  'Contact Us',
  'Download',
  'Watch More'
];

const FEED_VARS = [
  { key: 'product.name',              label: '标题' },
  { key: 'product.brand',             label: '品牌' },
  { key: 'product.retailer_id',       label: '内容编号' },
  { key: 'product.description',       label: '简介' },
  { key: 'product.short_description', label: '简短描述' },
  { key: 'product.price',             label: '价格' },
  { key: 'product.current_price',     label: '当前价格' },
  { key: 'product.unit_price',        label: '单价' },
  { key: 'product.custom_label_0',    label: '自定义标签 0' },
  { key: 'product.custom_label_1',    label: '自定义标签 1' },
  { key: 'product.custom_label_2',    label: '自定义标签 2' },
  { key: 'product.custom_label_3',    label: '自定义标签 3' },
  { key: 'product.custom_label_4',    label: '自定义标签 4' },
  { key: 'product.custom_number_0',   label: '自定义数字 0' },
  { key: 'product.custom_number_1',   label: '自定义数字 1' },
  { key: 'product.custom_number_2',   label: '自定义数字 2' },
  { key: 'product.custom_number_3',   label: '自定义数字 3' },
  { key: 'product.custom_number_4',   label: '自定义数字 4' },
  { key: 'product.url',               label: '网址' },
];

const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const valueToHtml = (v) => {
  if (!v) return '';
  const parts = [];
  let rest = v;
  const re = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(v)) !== null) {
    if (m.index > lastIndex) parts.push(escapeHtml(v.slice(lastIndex, m.index)));
    parts.push(`<span contenteditable="false" data-var="${m[1]}" class="inline-flex items-center px-2 py-0.5 mx-0.5 bg-primary-50 text-primary-600 text-xs font-semibold rounded align-middle select-none">${escapeHtml(m[1])}</span>`);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < v.length) parts.push(escapeHtml(v.slice(lastIndex)));
  return parts.join('');
};

const domToValue = (el) => {
  let out = '';
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) out += node.textContent;
    else if (node.nodeType === 1 && node.dataset && node.dataset.var) out += `{{${node.dataset.var}}}`;
    else if (node.nodeType === 1) out += node.textContent;
  });
  return out;
};

const VariableTextInput = ({ value, onChange, placeholder, multiline = false, vars }) => {
  const divRef = useRef(null);
  const lastSyncedRef = useRef(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const insertBtnRef = useRef(null);

  useEffect(() => {
    if (!divRef.current) return;
    if ((value || '') !== lastSyncedRef.current) {
      divRef.current.innerHTML = valueToHtml(value || '');
      lastSyncedRef.current = value || '';
    }
  }, [value]);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML === '') {
      divRef.current.innerHTML = valueToHtml(value || '');
      lastSyncedRef.current = value || '';
    }
  }, []);

  const handleInput = () => {
    if (!divRef.current) return;
    const v = domToValue(divRef.current);
    lastSyncedRef.current = v;
    onChange(v);
  };

  const insertVarAtCursor = (key) => {
    if (!divRef.current) return;
    divRef.current.focus();
    const sel = window.getSelection();
    let range;
    if (sel && sel.rangeCount > 0 && divRef.current.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
      range.deleteContents();
    } else {
      range = document.createRange();
      range.selectNodeContents(divRef.current);
      range.collapse(false);
    }
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-var', key);
    span.className = 'inline-flex items-center px-2 py-0.5 mx-0.5 bg-primary-50 text-primary-600 text-xs font-semibold rounded align-middle select-none';
    span.textContent = key;
    range.insertNode(span);
    const after = document.createTextNode('\u00a0');
    span.parentNode.insertBefore(after, span.nextSibling);
    const newRange = document.createRange();
    newRange.setStartAfter(after);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    handleInput();
  };

  return (
    <div className="relative">
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`ce-input w-full ${multiline ? 'min-h-[8rem] p-5' : 'h-12 px-5 flex items-center'} pr-12 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all whitespace-pre-wrap break-words`}
      />
      <button
        ref={insertBtnRef}
        type="button"
        onMouseDown={e => e.preventDefault()}
        onClick={() => setShowDropdown(v => !v)}
        title="插入变量"
        className={`absolute ${multiline ? 'right-2 top-2' : 'right-2 top-1/2 -translate-y-1/2'} w-8 h-8 flex items-center justify-center border border-neutral-200 rounded text-neutral-400 bg-white hover:border-primary-400 hover:text-primary-500`}
      >
        <Plus size={14} />
      </button>
      <Popover
        open={showDropdown}
        anchorRef={insertBtnRef}
        placement="bottom-end"
        onClose={() => setShowDropdown(false)}
        className="w-44 bg-white rounded-base border border-neutral-200 shadow-xl max-h-64 overflow-auto py-1"
      >
        {vars.map(v => (
          <button
            key={v.key}
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => { insertVarAtCursor(v.key); setShowDropdown(false); }}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
          >
            {v.label}
          </button>
        ))}
      </Popover>
    </div>
  );
};

const AVAILABLE_LOCATIONS = [
  { id: 'US', name: 'United States' },
  { id: 'UK', name: 'United Kingdom' },
  { id: 'CA', name: 'Canada' },
  { id: 'AU', name: 'Australia' },
  { id: 'DE', name: 'Germany' },
  { id: 'FR', name: 'France' },
  { id: 'JP', name: 'Japan' },
];

const AVAILABLE_INTERESTS = [
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
  { id: 'int_21', name: 'Fashion', size: '600M-700M' },
  { id: 'int_22', name: 'Streetwear', size: '150M-200M' },
  { id: 'int_23', name: 'Jewelry', size: '250M-350M' },
  { id: 'int_24', name: 'Sports', size: '600M-800M' },
];

const AI_INTEREST_PACKS = [
  { id: 'pack-1', name: 'Fashion Enthusiasts', interests: ['Fashion accessories', 'Luxury goods', 'Streetwear', 'Jewelry', 'Fashion'] },
  { id: 'pack-2', name: 'Digital Shoppers', interests: ['Online shopping', 'E-commerce', 'Technology', 'Gaming', 'Photography'] },
  { id: 'pack-3', name: 'Health & Wellness', interests: ['Fitness', 'Wellness', 'Yoga', 'Skincare', 'Outdoor activities'] },
  { id: 'pack-4', name: 'Lifestyle & Home', interests: ['Home decor', 'Cooking', 'Lifestyle', 'Pet lovers', 'Music'] },
  { id: 'pack-5', name: 'Travel & Culture', interests: ['Travel', 'Sustainable fashion', 'Beauty', 'Sports', 'Streetwear'] },
];

const LANGUAGES = ['All languages', 'English', 'Chinese', 'Spanish', 'French', 'German', 'Japanese'];

const CUSTOM_AUDIENCES = [
  { id: 'ca1', name: 'Website Visitors - 30d' },
  { id: 'ca2', name: 'Purchasers - Last 180d' },
  { id: 'ca3', name: 'Lead Form Submissions' },
  { id: 'ca4', name: 'Video Viewers 50%' }
];

const LAL_AUDIENCES = [
  { id: 'lal1', name: 'LAL (US, 1%) - Purchase' },
  { id: 'lal2', name: 'LAL (US, 5%) - Purchase' },
  { id: 'lal3', name: 'LAL (UK, 1%) - Add to Cart' },
  { id: 'lal4', name: 'LAL (All, 10%) - Page View' }
];

// DPA Style Placeholder Component
const DPAPreviewCard = () => {
  return (
    <div className="w-full h-full bg-neutral-200 p-4 flex flex-col gap-3 relative overflow-hidden group/dpa">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
        {/* Mock Product Items */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 duration-500">
          <div className="w-8 h-8 bg-info-100 rounded-full flex items-center justify-center mb-1">
            <ShoppingBag size={16} className="text-info-500" />
          </div>
          <div className="w-8 h-1 bg-neutral-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-neutral-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-75 duration-500">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
            <Monitor size={16} className="text-purple-500" />
          </div>
          <div className="w-8 h-1 bg-neutral-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-neutral-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-150 duration-500">
          <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mb-1">
            <Smartphone size={16} className="text-success-500" />
          </div>
          <div className="w-8 h-1 bg-neutral-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-neutral-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-200 duration-500">
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mb-1">
            <Layout size={16} className="text-rose-500" />
          </div>
          <div className="w-8 h-1 bg-neutral-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-neutral-50 rounded-full" />
        </div>
      </div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute -left-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};

// Sub-component for Adset Editing to prevent parent re-renders and scroll resets
const EditAdSetModal = ({ isOpen, adSet, onUpdateField, onToggleItem, onClose, authStatus, selectedAccount, onAuthStatusChange, onSelectAccount, budgetType, dailyBudget, platform, effectiveBidStrategy = 'highest_volume', globalBidAmount = '', isTikTokAppSales = false, catalogs = [], onAuthorizeChannel, onOpenAccountPicker, channelAuthLoading = false }) => {
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // 旧 4 个独立 dropdown 已合并为 2 个：showAudInc / showAudExc
  const [showAudInc, setShowAudInc] = useState(false);
  const [showAudExc, setShowAudExc] = useState(false);

  const [isMetaConnecting, setIsMetaConnecting] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const catalogTriggerRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const interestTriggerRef = useRef(null);
  const languageTriggerRef = useRef(null);

  const platformId = platform?.id || 'meta';
  const platformName = platform?.name || 'Meta';
  const isPlatformAuthed = !!authStatus?.[platformId];
  const ConnectIcon = platformId === 'tiktok' ? Smartphone : Facebook;

  // 旧 loading hooks 不再需要 — 新共享组件内部依据 4 态自行展示

  // 返回 Promise，让外层 IncludeExcludeAudienceDropdown 的 await 在授权完成后再触发选账户。
  // 自身不再调用 onSelectAccount —— auto-pick 由外层组件根据 await 结果统一处理。
  const handleConnectMeta = () => new Promise((resolve) => {
    setIsMetaConnecting(true);
    setTimeout(() => {
      setIsMetaConnecting(false);
      onAuthStatusChange?.(prev => ({ ...prev, [platformId]: true }));
      resolve();
    }, 3000);
  });

  if (!isOpen || !adSet) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-section shadow-xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-inner flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900 leading-none">编辑广告组配置</h3>
              <p className="text-xs font-medium text-neutral-500 mt-2">Adset Level Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full text-neutral-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar pb-32">
          {/* Adset Name */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-neutral-500 px-1">广告组名称</label>
            <div className="relative group">
              <Edit3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                value={adSet.name}
                onChange={e => onUpdateField('name', e.target.value)}
                className="w-full h-14 pl-12 pr-5 border border-neutral-200 rounded-base px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
              />
            </div>
          </div>

          {/* Daily Budget — CBO readonly, ABO editable */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-neutral-500 px-1">Daily Budget</label>
            {budgetType === 'CBO' ? (
              <>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                  <input
                    type="text"
                    readOnly
                    value="Campaign Budget Optimize"
                    className="w-full h-14 pl-12 pr-5 border border-neutral-200 rounded-base text-sm font-medium text-neutral-500 bg-neutral-50 cursor-not-allowed outline-none"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 px-1">
                  当前 Campaign 采用 CBO，预算由广告系列统一分配，无法在广告组层级修改。
                </p>
              </>
            ) : (
              <>
                <div className="relative group">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={adSet.dailyBudget ?? dailyBudget}
                    onChange={e => onUpdateField('dailyBudget', Number(e.target.value))}
                    className="w-full h-14 pl-12 pr-16 border border-neutral-200 rounded-base text-sm text-neutral-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 pointer-events-none">/ day</span>
                </div>
                <p className="text-[11px] text-neutral-400 px-1">
                  初始值取自预览页顶部 Daily Budget；可在此广告组独立覆盖。
                </p>
              </>
            )}
          </div>

          {/* Catalog — 仅 TikTok APP Sales 场景；含授权三态 */}
          {isTikTokAppSales && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-500 px-1">Catalog（产品目录）</label>
              <div
                ref={catalogTriggerRef}
                onClick={() => {
                  if (!authStatus?.tiktok) { onAuthorizeChannel?.('tiktok'); return; }
                  if (!selectedAccount) { onOpenAccountPicker?.(); return; }
                  setShowCatalog(prev => !prev);
                }}
                className="bg-white rounded-base p-3 border border-neutral-200 flex items-center justify-between gap-2 cursor-pointer hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Database size={14} className="text-primary-500 shrink-0" />
                  {!authStatus?.tiktok ? (
                    <span className="text-sm font-semibold text-neutral-300 truncate">请连接 TikTok 加载 catalog</span>
                  ) : !selectedAccount ? (
                    <span className="text-sm font-semibold text-neutral-300 truncate">请选择 TikTok 账号</span>
                  ) : channelAuthLoading ? (
                    <span className="text-sm font-semibold text-neutral-400 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> 加载中…</span>
                  ) : adSet.catalog ? (
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-700 truncate">{adSet.catalog.name}</p>
                      <p className="text-[10px] text-neutral-400 font-medium truncate">ID {adSet.catalog.id} · {adSet.catalog.productCount} 件</p>
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
                zIndex={Z_INDEX.MODAL_BASE + 500}
                className="bg-white border border-neutral-100 rounded-base shadow-xl overflow-hidden p-1"
              >
                {catalogs.map(c => {
                  const isSel = adSet.catalog?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { onUpdateField('catalog', c); setShowCatalog(false); }}
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
                      {isSel && <Check size={12} className="text-primary-500 shrink-0" />}
                    </button>
                  );
                })}
              </Popover>
            </div>
          )}

          {/* 竞价目标 — Meta：按 effective bidStrategy 变形（highest_volume 隐藏）；TikTok：选填金额 */}
          {(() => {
            const isTikTokBid = platform?.id === 'tiktok';
            const bidValueType = isTikTokBid ? 'currency'
              : effectiveBidStrategy === 'cost_cap' || effectiveBidStrategy === 'bid_cap' ? 'currency'
              : effectiveBidStrategy === 'roas' ? 'roas'
              : 'none';
            if (bidValueType === 'none') return null;
            const bidLabel = isTikTokBid ? '竞价目标 (选填)'
              : bidValueType === 'roas' ? '目标 ROAS'
              : effectiveBidStrategy === 'cost_cap' ? '单次结果成本上限'
              : '出价上限';
            const effectiveAmount = adSet?.bidAmount !== undefined ? adSet.bidAmount : globalBidAmount;
            return (
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-500 px-1">{bidLabel}</label>
                <div className="relative group">
                  {bidValueType === 'roas' ? (
                    <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" />
                  ) : (
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" />
                  )}
                  <input
                    type="number"
                    min={0}
                    step={bidValueType === 'roas' ? 0.1 : 0.01}
                    value={effectiveAmount ?? ''}
                    onChange={e => onUpdateField('bidAmount', e.target.value)}
                    placeholder={bidValueType === 'roas' ? '如 2.5' : '0.00'}
                    className="w-full h-14 pl-12 pr-16 border border-neutral-200 rounded-base text-sm text-neutral-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 pointer-events-none">
                    {bidValueType === 'roas' ? '×' : 'USD'}
                  </span>
                </div>
                {isTikTokBid && (
                  <p className="text-[11px] text-neutral-400 px-1">留空 = 默认最大转化量</p>
                )}
              </div>
            );
          })()}

          <div className="h-px bg-neutral-100" />

          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-500" />
                <h4 className="text-sm font-semibold text-neutral-900">Audience 受众设置</h4>
              </div>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-500 px-1">年龄范围 (Age)</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500">Min</span>
                    <input 
                      type="number" 
                      placeholder="18"
                      value={adSet.ageMin || ''} 
                      onChange={e => onUpdateField('ageMin', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="w-4 h-0.5 bg-neutral-200 rounded-full" />
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500">Max</span>
                    <input 
                      type="number" 
                      placeholder="65"
                      value={adSet.ageMax || ''} 
                      onChange={e => onUpdateField('ageMax', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-500 px-1">性别 (Gender)</label>
                <div className="flex bg-neutral-50 p-1 rounded-inner border border-neutral-200">
                  {['All', 'Men', 'Women'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => onUpdateField('gender', g)} 
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${adSet.gender === g ? 'bg-white text-primary-500 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                    >
                      {g === 'Men' ? '男' : g === 'Women' ? '女' : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locations (Multi-select with tags) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-500 px-1">地理位置 (Locations)</label>
              <div className="relative">
                <div ref={locationTriggerRef} className="min-h-[3.5rem] p-2 border border-neutral-200 rounded-base flex flex-wrap gap-2 items-center focus-within:border-primary-500 focus-within:bg-white transition-all cursor-text" onClick={() => setShowLocationDropdown(true)}>
                  <Globe size={16} className="text-neutral-300 ml-2" />
                  {adSet.locations?.map(loc => (
                    <span key={loc} className="px-3 py-1 bg-primary-50 text-primary-500 rounded-tag text-xs font-medium flex items-center gap-1.5 border border-primary-500/15 animate-in zoom-in-95">
                      {loc}
                      <X size={12} className="cursor-pointer hover:text-rose-500" onClick={(e) => { e.stopPropagation(); onToggleItem('locations', loc); }} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium min-w-[120px] px-2" 
                    placeholder={adSet.locations?.length > 0 ? "" : "搜索地理位置..."}
                    value={locationSearch}
                    onChange={e => { setLocationSearch(e.target.value); setShowLocationDropdown(true); }}
                    onFocus={() => setShowLocationDropdown(true)}
                  />
                </div>
                <Popover
                  open={showLocationDropdown}
                  anchorRef={locationTriggerRef}
                  placement="bottom-start"
                  matchWidth
                  onClose={() => setShowLocationDropdown(false)}
                  zIndex={Z_INDEX.MODAL_BASE + 500}
                  className="bg-white border border-neutral-100 rounded-inner shadow-xl max-h-60 overflow-y-auto p-2"
                >
                  {AVAILABLE_LOCATIONS.filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase())).map(loc => {
                    const isSel = adSet.locations?.includes(loc.name);
                    return (
                      <div key={loc.id} onClick={() => onToggleItem('locations', loc.name)} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 rounded-inner cursor-pointer transition-colors group">
                        <span className={`text-xs font-medium ${isSel ? 'text-primary-500' : 'text-neutral-600'}`}>{loc.name}</span>
                        {isSel && <Check size={14} className="text-primary-500" />}
                      </div>
                    );
                  })}
                </Popover>
              </div>
            </div>

            {/* Interests (Dual-panel: search + AI packs) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-500 px-1">兴趣词 (Interests)</label>
              {/* Tags above trigger */}
              {adSet.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {adSet.interests.map(name => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning-50 text-warning-600 rounded-tag text-xs font-medium border border-warning-100">
                      {name}
                      <button onClick={(e) => { e.stopPropagation(); onToggleItem('interests', name); }} className="text-warning-300 hover:text-rose-500 transition-colors">
                        <X size={10} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div>
                {/* Trigger */}
                <div
                  ref={interestTriggerRef}
                  className="px-4 py-3 border border-neutral-200 rounded-base flex items-center justify-between cursor-pointer hover:border-warning-300 transition-all"
                  onClick={() => setShowInterestDropdown(!showInterestDropdown)}
                >
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-neutral-300" />
                    <span className="text-xs font-medium text-neutral-300">
                      {adSet.interests?.length > 0 ? '添加更多兴趣词...' : '点击选择兴趣词...'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-neutral-300 transition-transform ${showInterestDropdown ? 'rotate-180' : ''}`} />
                </div>
                {/* Dual-panel dropdown */}
                <Popover
                  open={showInterestDropdown}
                  anchorRef={interestTriggerRef}
                  placement="bottom-start"
                  onClose={() => setShowInterestDropdown(false)}
                  zIndex={Z_INDEX.MODAL_BASE + 500}
                  className="w-[540px] bg-white rounded-section shadow-xl border border-neutral-100 overflow-hidden flex"
                >
                      {/* Left: Search & List */}
                      <div className="w-[55%] border-r border-neutral-100 flex flex-col">
                        <div className="p-3 border-b border-neutral-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 w-3.5 h-3.5" />
                            <input
                              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-base text-sm text-neutral-700 bg-white focus:outline-none focus:border-primary-500 transition-all duration-200"
                              placeholder="搜索兴趣词..."
                              value={interestSearch}
                              onChange={e => setInterestSearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="flex-1 max-h-[320px] overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                          {!interestSearch.trim() ? (
                            <div className="h-full flex items-center justify-center py-12">
                              <p className="text-xs text-neutral-300 font-medium">请输入关键词查询</p>
                            </div>
                          ) : (
                            AVAILABLE_INTERESTS
                              .filter(i => i.name.toLowerCase().includes(interestSearch.toLowerCase()))
                              .map(interest => {
                                const isSel = adSet.interests?.includes(interest.name);
                                return (
                                  <button
                                    key={interest.id}
                                    onClick={() => onToggleItem('interests', interest.name)}
                                    className={`w-full text-left px-3 py-2 rounded-base text-xs font-medium transition-all flex items-center justify-between ${
                                      isSel ? 'bg-warning-50 text-warning-600' : 'text-neutral-600 hover:bg-neutral-50'
                                    }`}
                                  >
                                    <div>
                                      <span>{interest.name}</span>
                                      <span className="ml-2 text-neutral-400">{interest.size}</span>
                                    </div>
                                    {isSel && <Check size={12} />}
                                  </button>
                                );
                              })
                          )}
                        </div>
                      </div>
                      {/* Right: AI Recommended */}
                      <div className="w-[45%] bg-neutral-50/50 flex flex-col">
                        <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
                          <Sparkles size={12} className="text-primary-500" />
                          <span className="text-xs font-semibold text-neutral-700">AI Recommended</span>
                        </div>
                        <div className="flex-1 max-h-[320px] overflow-y-auto custom-scrollbar p-3 space-y-2">
                          {AI_INTEREST_PACKS.map(pack => {
                            const interests = adSet.interests || [];
                            const allIn = pack.interests.every(name => interests.includes(name));
                            return (
                              <button
                                key={pack.id}
                                onClick={() => {
                                  if (allIn) {
                                    pack.interests.forEach(name => {
                                      if (interests.includes(name)) onToggleItem('interests', name);
                                    });
                                  } else {
                                    pack.interests.forEach(name => {
                                      if (!interests.includes(name)) onToggleItem('interests', name);
                                    });
                                  }
                                }}
                                title={`${pack.name}: ${pack.interests.join(', ')}`}
                                className={`w-full text-left p-3 rounded-inner border transition-all ${
                                  allIn ? 'border-primary-500 bg-primary-50/50 shadow-sm' : 'border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-neutral-800 line-clamp-1">{pack.name}</span>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-2 ${allIn ? 'bg-primary-500 text-white' : 'border border-neutral-200'}`}>
                                    {allIn && <Check size={10} />}
                                  </div>
                                </div>
                                <p className="text-xs text-neutral-400 line-clamp-2">{pack.interests.join(', ')}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                </Popover>
              </div>
            </div>

            {/* Language (Single search select) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-500 px-1">语言 (Language)</label>
              <div>
                <div ref={languageTriggerRef} onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="w-full h-14 px-5 border border-neutral-200 rounded-base flex items-center justify-between cursor-pointer hover:border-neutral-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Languages size={18} className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-700">{adSet.language || 'All languages'}</span>
                  </div>
                  <ChevronDown size={16} className={`text-neutral-300 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </div>
                <Popover
                  open={showLanguageDropdown}
                  anchorRef={languageTriggerRef}
                  placement="bottom-start"
                  matchWidth
                  onClose={() => setShowLanguageDropdown(false)}
                  zIndex={Z_INDEX.MODAL_BASE + 500}
                  className="bg-white border border-neutral-100 rounded-inner shadow-xl max-h-60 overflow-hidden flex flex-col"
                >
                      <div className="p-3 border-b border-neutral-50 bg-neutral-50/50">
                        <input
                          autoFocus
                          type="text"
                          className="w-full h-10 px-4 border border-neutral-200 rounded-base text-xs text-neutral-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                          placeholder="搜索语言..."
                          value={languageSearch}
                          onChange={e => setLanguageSearch(e.target.value)}
                        />
                      </div>
                      <div className="overflow-y-auto p-2">
                        {LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase())).map(l => (
                          <div key={l} onClick={() => { onUpdateField('language', l); setShowLanguageDropdown(false); setLanguageSearch(''); }} className={`px-4 py-3 rounded-inner text-xs font-medium cursor-pointer mb-1 last:mb-0 transition-colors ${adSet.language === l ? 'bg-primary-50 text-primary-500' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                            {l}
                          </div>
                        ))}
                      </div>
                </Popover>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* 自定义受众 — 包含 / 排除（每个一个共享下拉，内部 Lookalike / Custom tab） */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={16} className="text-purple-600" />
              <h4 className="text-sm font-semibold text-neutral-900">自定义受众编辑</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncludeExcludeAudienceDropdown
                triggerLabel="包含受众"
                open={showAudInc}
                onToggle={() => setShowAudInc(!showAudInc)}
                lalSelected={adSet.lalInclude || []}
                customSelected={adSet.customInclude || []}
                onToggleLal={(id) => onToggleItem('lalInclude', id)}
                onToggleCustom={(id) => onToggleItem('customInclude', id)}
                authStatus={authStatus} platform={platform}
                selectedAccount={selectedAccount}
                onAuthorize={handleConnectMeta}
                isAuthLoading={isMetaConnecting}
                onPickAccount={onSelectAccount}
                align="left"
              />
              <IncludeExcludeAudienceDropdown
                triggerLabel="排除受众"
                open={showAudExc}
                onToggle={() => setShowAudExc(!showAudExc)}
                lalSelected={adSet.lalExclude || []}
                customSelected={adSet.customExclude || []}
                onToggleLal={(id) => onToggleItem('lalExclude', id)}
                onToggleCustom={(id) => onToggleItem('customExclude', id)}
                authStatus={authStatus} platform={platform}
                selectedAccount={selectedAccount}
                onAuthorize={handleConnectMeta}
                isAuthLoading={isMetaConnecting}
                onPickAccount={onSelectAccount}
                align="left"
              />
            </div>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 shrink-0 z-[300]">
          <button
            onClick={onClose}
            className="px-16 py-4 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center gap-3"
          >
            保存修改
            <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdSkeleton = () => (
  <div className="bg-white rounded-section border border-neutral-200 overflow-hidden shadow-adsgo-card relative">
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-neutral-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="space-y-2">
          <div className="w-20 h-2 bg-neutral-100 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="w-12 h-1.5 bg-neutral-50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-2 bg-neutral-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="w-4/5 h-2 bg-neutral-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
    <div className="aspect-square bg-neutral-50 relative overflow-hidden flex items-center justify-center">
      <div className="relative">
        <Sparkles className="text-primary-500/30 w-16 h-16 animate-[pulse_2s_infinite_ease-in-out]" />
        <Sparkles className="text-purple-500/40 w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_infinite_linear]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="w-24 h-1.5 bg-neutral-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="w-32 h-2.5 bg-neutral-100 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      <div className="w-16 h-8 bg-neutral-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
    <div className="p-3 bg-neutral-50/50 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-neutral-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="w-20 h-2 bg-neutral-100 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  </div>
);

const OBJECTIVE_CTA_MAPPING = {
  sales_conversions: 'Shop Now',
  traffic: 'Learn More',
  awareness_engagement: 'Learn More',
  leads: 'Sign Up',
  app_promotion: 'Download'
};

const CampaignPreviewView = ({
  structure, budgetType, dailyBudget, initialAdsetAudiences, productCreativesMap, selectedProducts, brand, onBack, onPublish, campaignName, optimizationEvent, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, campaignType,
  estimatedTotalDaily, adSetGroupsCount, adType = 'SINGLE', creativesPerAd = 1, adsetAudienceDetails = {},
  authStatus, selectedAccount, onAuthStatusChange, onSelectAccount,
  platform, onAuthorizeChannel, onOpenAccountPicker, channelAuthLoading,
  isExistingCampaign, campaignObjective, onBudgetChange, onBudgetTypeChange,
  bidStrategy = 'highest_volume', bidAmount = '',
  globalAgeMin = '', globalAgeMax = '', globalGender = 'All',
  globalInterests = [],
  globalLalInclude = [], globalCustomInclude = [],
  globalLalExclude = [], globalCustomExclude = [],
  campaignNameTemplate = '{Brand}-{location}-{date}',
  adsetNameTemplate = '{location}-{audience_type}-{creative_type}-{date}',
  adNameTemplate = '{Brand}-{creative_type}-{number}-{date}',
  selectedLocations = [],
  selectedCatalog = null,
  selectedProductSet = '',
  onSelectCatalog,
  onSelectProductSet,
  numCampaigns = 1,
  isTikTokAppSales = false,
  globalCatalog = null,
  catalogs = [],
  adsetCatalogMap = {},
  catalogProductSets = {},
  catalogProducts = {},
}) => {
  // 受众字段优先级解析：adset detail override → 02 全局预设 → savedAudience（如选） → 硬编码兜底
  const resolveAudience = (i) => {
    const det = adsetAudienceDetails[i] || {};
    const _sa = det.savedAudience || null;
    const pick = (a, b, c, d) => {
      if (a !== undefined && a !== '' && a !== null) return a;
      if (b !== undefined && b !== '' && b !== null) return b;
      if (c !== undefined && c !== null) return c;
      return d;
    };
    const pickArr = (a, b, c) => {
      if (Array.isArray(a)) return a;
      if (Array.isArray(b) && b.length > 0) return b;
      return c || [];
    };
    return {
      ageMin: pick(det.ageMin, globalAgeMin, _sa?.ageMin, 18),
      ageMax: pick(det.ageMax, globalAgeMax, _sa?.ageMax, 65),
      gender: pick(det.gender, globalGender, _sa?.gender, 'All'),
      interests: pickArr(det.interests, globalInterests.length ? globalInterests : null, _sa?.interests || ['Broad Shopping']),
      customInclude: pickArr(det.customInclude, globalCustomInclude, []),
      lalInclude: pickArr(det.lalInclude, globalLalInclude, []),
      customExclude: pickArr(det.customExclude, globalCustomExclude, []),
      lalExclude: pickArr(det.lalExclude, globalLalExclude, []),
    };
  };
  const isFlexible = adType === 'FLEXIBLE' && (campaignObjective === 'sales_conversions' || campaignObjective === 'app_promotion');

  const applyNameTemplate = (template, vars) =>
    template.replace(/\{(\w+)\}/g, (_, k) => {
      return vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : `{${k}}`;
    });

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const locStr = selectedLocations.length > 0
    ? selectedLocations.map(l => l.code || l.name).join('_')
    : 'ALL';

  const [localAdSets, setLocalAdSets] = useState([]);
  const [editingAdSetIndex, setEditingAdSetIndex] = useState(null);
  const [editingAdInfo, setEditingAdInfo] = useState(null);
  const [editAdCatalogOpen, setEditAdCatalogOpen] = useState(false);
  const [editAdSetOpen, setEditAdSetOpen] = useState(false);
  const [editAdCtaOpen, setEditAdCtaOpen] = useState(false);
  // Product Range（TikTok APP Sales）下拉与搜索
  const [adRangeSetOpen, setAdRangeSetOpen] = useState(false);
  const [adRangeProductsOpen, setAdRangeProductsOpen] = useState(false);
  const [adRangeSearch, setAdRangeSearch] = useState('');
  const [changeCreativeInfo, setChangeCreativeInfo] = useState(null);
  const [loadedAdsCount, setLoadedAdsCount] = useState(0);
  const [isEditingCampaignName, setIsEditingCampaignName] = useState(false);
  const [localCampaignName, setLocalCampaignName] = useState(() =>
    campaignNameTemplate
      ? applyNameTemplate(campaignNameTemplate, {
          Brand: brand || 'MyBrand',
          location: locStr,
          budget: '$500',
          device: 'Mobile',
          date: today,
          goal: 'Conversions',
          audience_type: 'LAL',
          creative_type: 'Video',
          theme: 'Summer',
          number: '001',
        })
      : campaignName
  );
  const [selectedCta, setSelectedCta] = useState(OBJECTIVE_CTA_MAPPING[campaignObjective] || 'Shop Now');
  const [isCtaOpen, setIsCtaOpen] = useState(false);
  const ctaTriggerRef = useRef(null);
  const [localBudget, setLocalBudget] = useState(dailyBudget);

  const totalAdsCount = useMemo(() => {
    return localAdSets.reduce((acc, as) => acc + (as.ads?.length || 0), 0);
  }, [localAdSets]);

  useEffect(() => {
    if (totalAdsCount > 0 && loadedAdsCount < totalAdsCount) {
      const timer = setTimeout(() => {
        setLoadedAdsCount(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadedAdsCount, totalAdsCount]);
  
  const getAdUrl = (p) => {
    if (landingPageType === 'PRODUCT') {
      let baseUrl = p.url;
      if (productUtm) {
        const utmProcessed = productUtm.replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name)).replace(/\{\{product_id\}\}/g, encodeURIComponent(p.id));
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${utmProcessed.replace(/^[?&]+/, '')}`;
      }
      return baseUrl;
    }
    return landingPageTemplate.replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name));
  };

  const getAdCopy = (p) => {
    if (copyStrategy === 'UNIFIED') {
      const headline = Array.isArray(unifiedHeadline) ? unifiedHeadline[0] || '' : unifiedHeadline;
      const body = Array.isArray(unifiedBody) ? unifiedBody[0] || '' : unifiedBody;
      return { headline, body };
    }
    return { headline: `Get your ${p.name} today!`, body: `Discover quality and style that lasts with our exclusive ${p.name}. Limited time offer.` };
  };

  // Build ads array for an adset — Flexible: ceil(N/10) ads with imageUrls[]; Single: 1 creative per ad
  const buildAds = (creatives, adSetIdx, namePrefix, resolveProduct) => {
    // FLEXIBLE / CAROUSEL：按 creativesPerAd 切分，每 ad 含多个素材（Meta 硬上限 10）
    const isMultiCreativeAd = adType === 'FLEXIBLE' || adType === 'CAROUSEL';
    if (isMultiCreativeAd && creatives.length > 0) {
      const chunkSize = Math.max(1, Math.min(10, Number(creativesPerAd) || 1));
      const formatLabel = adType === 'CAROUSEL' ? 'Carousel' : 'Flexible';
      const idPrefix = adType === 'CAROUSEL' ? 'car' : 'flex';
      const result = [];
      for (let j = 0; j < creatives.length; j += chunkSize) {
        const chunk = creatives.slice(j, j + chunkSize);
        const c0 = chunk[0];
        const p = resolveProduct(c0);
        const copy = p ? getAdCopy(p) : { headline: '', body: '' };
        result.push({
          id: `${adSetIdx}-${idPrefix}-${Math.floor(j / chunkSize)}`,
          name: applyNameTemplate(adNameTemplate, { Brand: brand?.name || 'MyBrand', creative_type: formatLabel, number: chunk.length, date: today }),
          headline: [copy.headline],
          primaryText: [copy.body],
          imageUrl: c0.url,
          imageUrls: chunk.map(c => c.url),
          adFormat: adType,
          cta: 'Shop Now',
          destinationUrl: p ? getAdUrl(p) : '',
          utmParams: '',
          productId: p?.id || '',
          productRange: 'All',
          productSetId: '',
          productIds: [],
          offerType: 'AUTO',
          promoCode: '90%OFF'
        });
      }
      return result;
    }
    // SINGLE：每素材一个 ad；若 adset 内素材 > 1，会被拆分为多 ad（卡片上 hover 提示）
    return creatives.map((c, cIdx) => {
      const p = resolveProduct(c);
      const copy = p ? getAdCopy(p) : { headline: '', body: '' };
      return {
        id: `${adSetIdx}-${cIdx}`,
        name: applyNameTemplate(adNameTemplate, { Brand: brand?.name || 'MyBrand', creative_type: 'Single', number: 1, date: today }),
        headline: [copy.headline],
        primaryText: [copy.body],
        imageUrl: c.url,
        adFormat: 'SINGLE',
        cta: 'Shop Now',
        destinationUrl: p ? getAdUrl(p) : '',
        utmParams: '',
        productId: p?.id || '',
        productRange: 'All',
        productSetId: '',
        productIds: [],
        offerType: 'AUTO',
        promoCode: '90%OFF'
      };
    });
  };

  useEffect(() => {
    let adSets = [];
    const targetAdSetCount = adSetGroupsCount || 0;

    if (campaignType === 'CATALOG') {
      for (let i = 0; i < targetAdSetCount; i++) {
        const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
        const aud0 = resolveAudience(i);
        adSets.push({
          name: applyNameTemplate(adsetNameTemplate, { location: locStr, audience_type: audienceType, creative_type: isFlexible ? 'Flexible' : 'Single', date: today }),
          audienceType,
          ageMin: aud0.ageMin, ageMax: aud0.ageMax, gender: aud0.gender,
          locations: ['United States'],
          interests: aud0.interests,
          language: 'All languages',
          customInclude: aud0.customInclude,
          lalInclude: aud0.lalInclude,
          customExclude: aud0.customExclude,
          lalExclude: aud0.lalExclude,
          placements: ['All'], optimizationEvent,
          ads: [{
            id: `cat-${i}`,
            name: `Dynamic Catalog Creative`,
            headline: ['{{product.name}}'],
            primaryText: ['Check out our latest arrivals. {{product.description}}'],
            imageUrl: 'https://img.clipp.io/img/ad_preview_dpa.png',
            cta: 'Shop Now',
            destinationUrl: '{{product.url}}',
            isDynamic: true,
            offerType: 'AUTO',
            promoCode: '90%OFF'
          }]
        });
      }
    } else {
      if (structure.strategy === 'PER_PRODUCT') {
        const activeProducts = selectedProducts.filter(p => (productCreativesMap[p.id] || []).length > 0);
        const adsetsPerProduct = structure.numAdsetsPerProduct || 1;
        
        activeProducts.forEach((p, pIdx) => {
          const creatives = productCreativesMap[p.id] || [];
          
          for (let i = 0; i < adsetsPerProduct; i++) {
            const adSetOverallIdx = (pIdx * adsetsPerProduct) + i;
            const audienceType = initialAdsetAudiences[adSetOverallIdx % initialAdsetAudiences.length] || 'ADV';
            
            const aud1 = resolveAudience(adSetOverallIdx);
            adSets.push({
              name: applyNameTemplate(adsetNameTemplate, { location: locStr, audience_type: audienceType, creative_type: isFlexible ? 'Flexible' : 'Single', date: today }),
              audienceType,
              ageMin: aud1.ageMin, ageMax: aud1.ageMax, gender: aud1.gender,
              locations: ['United States'],
              interests: aud1.interests,
              language: 'All languages',
              customInclude: aud1.customInclude,
              lalInclude: aud1.lalInclude,
              customExclude: aud1.customExclude,
              lalExclude: aud1.lalExclude,
              placements: ['Feed', 'Stories', 'Reels'], optimizationEvent,
              ads: buildAds(creatives, adSetOverallIdx, `AD - ${p.name}`, () => p)
            });
          }
        });
      } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
        const allCreativesPool = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        for (let i = 0; i < targetAdSetCount; i++) {
          const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
          const aud2 = resolveAudience(i);
          adSets.push({
            name: applyNameTemplate(adsetNameTemplate, { location: locStr, audience_type: audienceType, creative_type: isFlexible ? 'Flexible' : 'Single', date: today }),
            audienceType,
            ageMin: aud2.ageMin, ageMax: aud2.ageMax, gender: aud2.gender,
            locations: ['United States'],
            interests: aud2.interests,
            language: 'All languages',
            customInclude: aud2.customInclude,
            lalInclude: aud2.lalInclude,
            customExclude: aud2.customExclude,
            lalExclude: aud2.lalExclude,
            placements: ['Feed', 'Stories'], optimizationEvent,
            ads: buildAds(allCreativesPool, i, `AD - 混合组 ${i + 1}`, c => selectedProducts.find(prod => prod.id === c.productId))
          });
        }
      } else if (structure.strategy === 'BY_CREATIVE') {
        const allAdsPool = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        if (allAdsPool.length > 0) {
          const numGroups = targetAdSetCount;
          let currentIndex = 0;
          
          for (let i = 0; i < numGroups; i++) {
            const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
            const remainingAds = allAdsPool.length - currentIndex;
            const remainingGroups = numGroups - i;
            const currentGroupSize = Math.ceil(remainingAds / remainingGroups);
            const chunk = allAdsPool.slice(currentIndex, currentIndex + currentGroupSize);
            
            const aud3 = resolveAudience(i);
            adSets.push({
              name: applyNameTemplate(adsetNameTemplate, { location: locStr, audience_type: audienceType, creative_type: isFlexible ? 'Flexible' : 'Single', date: today }),
              audienceType,
              ageMin: aud3.ageMin, ageMax: aud3.ageMax, gender: aud3.gender,
              locations: ['United States'],
              interests: aud3.interests,
              language: 'All languages',
              customInclude: aud3.customInclude,
              lalInclude: aud3.lalInclude,
              customExclude: aud3.customExclude,
              lalExclude: aud3.lalExclude,
              placements: ['Feed'], optimizationEvent,
              ads: buildAds(chunk, i, `AD - G${i + 1}`, c => selectedProducts.find(prod => prod.id === c.productId))
            });
            currentIndex += currentGroupSize;
          }
        }
      }
    }
    // 注入 adset 级 catalog（仅 isTikTokAppSales 场景；其他场景写 null）
    adSets = adSets.map((as, i) => ({
      ...as,
      catalog: isTikTokAppSales ? (adsetCatalogMap[i] || globalCatalog || null) : null,
    }));
    // 合并：保留用户在预览页编辑过的 adset / ad 字段，避免依赖变更后被回滚
    setLocalAdSets(prev => {
      if (!prev || prev.length === 0) return adSets;
      return adSets.map((newAs, i) => {
        const prevAs = prev[i];
        if (!prevAs) return newAs;
        return {
          ...newAs,
          catalog: prevAs.catalog ?? newAs.catalog,
          ads: newAs.ads.map((newAd, j) => {
            const prevAd = prevAs.ads?.[j];
            if (!prevAd) return newAd;
            return {
              ...newAd,
              productRange: prevAd.productRange ?? newAd.productRange,
              productSetId: prevAd.productSetId ?? newAd.productSetId,
              productIds: prevAd.productIds ?? newAd.productIds,
            };
          }),
        };
      });
    });
  }, [campaignType, selectedProducts, structure, productCreativesMap, initialAdsetAudiences, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, optimizationEvent, adSetGroupsCount, isFlexible, adType, creativesPerAd, adsetNameTemplate, adNameTemplate, selectedLocations, selectedCta, isTikTokAppSales, globalCatalog, adsetCatalogMap]);

  const totalDailyBudget = (estimatedTotalDaily || (budgetType === 'CBO' ? dailyBudget : dailyBudget * localAdSets.length)) * Math.max(numCampaigns, 1);

  const handleUpdateField = (field, value) => {
    if (editingAdSetIndex === null) return;
    const next = [...localAdSets];
    next[editingAdSetIndex][field] = value;
    setLocalAdSets(next);
  };

  const handleToggleItem = (arrayField, item) => {
    if (editingAdSetIndex === null) return;
    const next = [...localAdSets];
    const currentArray = next[editingAdSetIndex][arrayField] || [];
    if (currentArray.includes(item)) {
      next[editingAdSetIndex][arrayField] = currentArray.filter(i => i !== item);
    } else {
      next[editingAdSetIndex][arrayField] = [...currentArray, item];
    }
    setLocalAdSets(next);
  };

  const EditAdModal = () => {
    if (!editingAdInfo) return null;
    const { asIndex, adIndex } = editingAdInfo;
    const ad = localAdSets[asIndex].ads[adIndex];
    const isCatalog = campaignType === 'CATALOG';
    const maxHeadlines = isCatalog ? 1 : 5;
    const maxPrimaryTexts = isCatalog ? 1 : 5;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-section shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h3 className="text-base font-semibold text-neutral-900">编辑广告素材 (Ad)</h3>
            <button onClick={() => setEditingAdInfo(null)} className="p-2 hover:bg-neutral-50 rounded-full text-neutral-300"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            {/* Headlines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-neutral-400">广告标题 (Headline)</label>
                {!isCatalog && (
                  <span className="text-xs text-neutral-400">{(Array.isArray(ad.headline) ? ad.headline : [ad.headline]).length}/{maxHeadlines}</span>
                )}
              </div>
              {(Array.isArray(ad.headline) ? ad.headline : [ad.headline]).map((val, i) => {
                const headlines = Array.isArray(ad.headline) ? ad.headline : [ad.headline];
                const useVarInput = isCatalog && i === 0;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      {useVarInput ? (
                        <VariableTextInput
                          value={val || ''}
                          onChange={v => {
                            const next = [...localAdSets];
                            const arr = Array.isArray(next[asIndex].ads[adIndex].headline)
                              ? [...next[asIndex].ads[adIndex].headline]
                              : [next[asIndex].ads[adIndex].headline];
                            arr[0] = v;
                            next[asIndex].ads[adIndex].headline = arr;
                            setLocalAdSets(next);
                          }}
                          placeholder={`标题 ${i + 1}...`}
                          multiline={false}
                          vars={FEED_VARS}
                        />
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={e => {
                            const next = [...localAdSets];
                            const arr = Array.isArray(next[asIndex].ads[adIndex].headline)
                              ? [...next[asIndex].ads[adIndex].headline]
                              : [next[asIndex].ads[adIndex].headline];
                            arr[i] = e.target.value;
                            next[asIndex].ads[adIndex].headline = arr;
                            setLocalAdSets(next);
                          }}
                          placeholder={`标题 ${i + 1}...`}
                          className="w-full h-12 px-5 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all"
                        />
                      )}
                    </div>
                    {!isCatalog && headlines.length > 1 && (
                      <button
                        onClick={() => {
                          const next = [...localAdSets];
                          next[asIndex].ads[adIndex].headline = headlines.filter((_, j) => j !== i);
                          setLocalAdSets(next);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-danger-400 hover:bg-danger-50 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              {(Array.isArray(ad.headline) ? ad.headline : [ad.headline]).length < maxHeadlines && (
                <button
                  onClick={() => {
                    const next = [...localAdSets];
                    const arr = Array.isArray(next[asIndex].ads[adIndex].headline)
                      ? [...next[asIndex].ads[adIndex].headline]
                      : [next[asIndex].ads[adIndex].headline];
                    next[asIndex].ads[adIndex].headline = [...arr, ''];
                    setLocalAdSets(next);
                  }}
                  className="flex items-center gap-2 text-xs text-primary-500 hover:text-primary-600 font-medium px-1 py-1 transition-colors"
                >
                  <Plus size={14} />
                  添加标题变体
                </button>
              )}
            </div>
            {/* Primary Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-neutral-400">广告正文 (Primary Text)</label>
                {!isCatalog && (
                  <span className="text-xs text-neutral-400">{(Array.isArray(ad.primaryText) ? ad.primaryText : [ad.primaryText]).length}/{maxPrimaryTexts}</span>
                )}
              </div>
              {(Array.isArray(ad.primaryText) ? ad.primaryText : [ad.primaryText]).map((val, i) => {
                const texts = Array.isArray(ad.primaryText) ? ad.primaryText : [ad.primaryText];
                const useVarInput = isCatalog && i === 0;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1 relative">
                      {useVarInput ? (
                        <VariableTextInput
                          value={val || ''}
                          onChange={v => {
                            const next = [...localAdSets];
                            const arr = Array.isArray(next[asIndex].ads[adIndex].primaryText)
                              ? [...next[asIndex].ads[adIndex].primaryText]
                              : [next[asIndex].ads[adIndex].primaryText];
                            arr[0] = v;
                            next[asIndex].ads[adIndex].primaryText = arr;
                            setLocalAdSets(next);
                          }}
                          placeholder={`正文 ${i + 1}...`}
                          multiline={true}
                          vars={FEED_VARS}
                        />
                      ) : (
                        <textarea
                          value={val}
                          onChange={e => {
                            const next = [...localAdSets];
                            const arr = Array.isArray(next[asIndex].ads[adIndex].primaryText)
                              ? [...next[asIndex].ads[adIndex].primaryText]
                              : [next[asIndex].ads[adIndex].primaryText];
                            arr[i] = e.target.value;
                            next[asIndex].ads[adIndex].primaryText = arr;
                            setLocalAdSets(next);
                          }}
                          placeholder={`正文 ${i + 1}...`}
                          className="w-full p-5 border border-neutral-200 rounded-base bg-white text-sm font-medium h-32 resize-none focus:border-primary-500 outline-none transition-all"
                        />
                      )}
                    </div>
                    {!isCatalog && texts.length > 1 && (
                      <button
                        onClick={() => {
                          const next = [...localAdSets];
                          const texts2 = Array.isArray(next[asIndex].ads[adIndex].primaryText)
                            ? next[asIndex].ads[adIndex].primaryText
                            : [next[asIndex].ads[adIndex].primaryText];
                          next[asIndex].ads[adIndex].primaryText = texts2.filter((_, j) => j !== i);
                          setLocalAdSets(next);
                        }}
                        className="w-8 h-8 mt-2 flex items-center justify-center rounded-full text-neutral-400 hover:text-danger-400 hover:bg-danger-50 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              {(Array.isArray(ad.primaryText) ? ad.primaryText : [ad.primaryText]).length < maxPrimaryTexts && (
                <button
                  onClick={() => {
                    const next = [...localAdSets];
                    const arr = Array.isArray(next[asIndex].ads[adIndex].primaryText)
                      ? [...next[asIndex].ads[adIndex].primaryText]
                      : [next[asIndex].ads[adIndex].primaryText];
                    next[asIndex].ads[adIndex].primaryText = [...arr, ''];
                    setLocalAdSets(next);
                  }}
                  className="flex items-center gap-2 text-xs text-primary-500 hover:text-primary-600 font-medium px-1 py-1 transition-colors"
                >
                  <Plus size={14} />
                  添加正文变体
                </button>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2">
                <Megaphone size={12} className="text-primary-500"/> 行动号召 (CTA)
                {platform?.id === 'tiktok' && <span className="text-[10px] font-medium text-neutral-300">支持多选</span>}
              </label>
              {platform?.id === 'tiktok' ? (() => {
                const ctaArr = Array.isArray(ad.cta) ? ad.cta : (ad.cta ? [ad.cta] : []);
                const updateCtaArr = (arr) => {
                  const next = [...localAdSets];
                  next[asIndex].ads[adIndex].cta = arr;
                  setLocalAdSets(next);
                };
                const toggleCta = (opt) => {
                  if (ctaArr.includes(opt)) {
                    if (ctaArr.length === 1) return;
                    updateCtaArr(ctaArr.filter(c => c !== opt));
                  } else {
                    updateCtaArr([...ctaArr, opt]);
                  }
                };
                return (
                  <>
                    {ctaArr.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {ctaArr.map(opt => (
                          <span key={opt} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700">
                            {opt}
                            {ctaArr.length > 1 && (
                              <button
                                type="button"
                                onClick={() => updateCtaArr(ctaArr.filter(c => c !== opt))}
                                className="text-primary-400 hover:text-primary-600"
                              ><X size={10} /></button>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setEditAdCtaOpen(v => !v)}
                        className="w-full h-12 px-5 flex items-center justify-between border border-neutral-200 rounded-base bg-white text-sm font-medium hover:border-primary-300 focus:border-primary-500 outline-none transition-all"
                      >
                        <span className={ctaArr.length > 0 ? 'text-neutral-800' : 'text-neutral-400'}>
                          {ctaArr.length > 0 ? `已选 ${ctaArr.length} 个 CTA，继续添加...` : '选择 CTA(可多选)...'}
                        </span>
                        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${editAdCtaOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {editAdCtaOpen && (
                        <>
                          <div className="fixed inset-0 z-[290]" onClick={() => setEditAdCtaOpen(false)} />
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-base border border-neutral-200 shadow-xl z-[300] max-h-72 overflow-auto py-1">
                            {CTA_OPTIONS.map(opt => {
                              const isSel = ctaArr.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleCta(opt)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all ${isSel ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}
                                >
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isSel ? 'bg-primary-500 border-primary-500' : 'border-neutral-200'}`}>
                                    {isSel && <Check size={10} className="text-white" strokeWidth={3} />}
                                  </div>
                                  <span className={`text-sm font-medium ${isSel ? 'text-primary-700' : 'text-neutral-700'}`}>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                );
              })() : (
                <div className="relative">
                  <select
                    value={Array.isArray(ad.cta) ? (ad.cta[0] || '') : ad.cta}
                    onChange={e => {
                      const next = [...localAdSets]; next[asIndex].ads[adIndex].cta = e.target.value; setLocalAdSets(next);
                    }}
                    className="w-full h-12 px-5 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all appearance-none"
                  >
                    {CTA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" />
                </div>
              )}
            </div>

            {platform?.id === 'tiktok' && (() => {
              const music = ad.music || null;
              const updateMusic = (m) => {
                const next = [...localAdSets];
                next[asIndex].ads[adIndex].music = m;
                setLocalAdSets(next);
              };
              const onPickFile = (file) => {
                if (!file) return;
                const isMp3 = file.type === 'audio/mpeg' || /\.mp3$/i.test(file.name);
                if (!isMp3) {
                  alert('仅支持 MP3 格式音乐文件');
                  return;
                }
                updateMusic({
                  name: file.name,
                  size: file.size,
                  url: URL.createObjectURL(file),
                });
              };
              return (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2">
                    <Music size={12} className="text-primary-500"/> 背景音乐 (Music)
                    <span className="text-[10px] font-medium text-neutral-300">仅支持 MP3</span>
                  </label>
                  {music ? (
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-base">
                      <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-inner flex items-center justify-center shrink-0">
                        <Music size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-800 truncate">{music.name}</p>
                        {music.url && (
                          <audio controls src={music.url} className="w-full h-7 mt-1" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => updateMusic(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-danger-400 hover:bg-danger-50 transition-colors shrink-0"
                        title="移除音乐"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full h-12 px-5 border border-dashed border-neutral-300 rounded-base bg-white text-sm font-medium text-neutral-500 hover:border-primary-400 hover:text-primary-500 cursor-pointer transition-all">
                      <Upload size={14} />
                      上传 MP3 文件
                      <input
                        type="file"
                        accept="audio/mpeg,.mp3"
                        className="hidden"
                        onChange={e => { onPickFile(e.target.files?.[0]); e.target.value = ''; }}
                      />
                    </label>
                  )}
                </div>
              );
            })()}

            {/* Product Range — 仅 TikTok APP Sales 显示，含授权回退 */}
            {isTikTokAppSales && (() => {
              const adsetCatalog = localAdSets[asIndex]?.catalog;
              const updateAd = (patch) => {
                const next = [...localAdSets];
                next[asIndex].ads[adIndex] = { ...next[asIndex].ads[adIndex], ...patch };
                setLocalAdSets(next);
              };
              const productRange = ad.productRange || 'All';
              const sets = adsetCatalog ? (catalogProductSets[adsetCatalog.id] || []) : [];
              const products = adsetCatalog ? (catalogProducts[adsetCatalog.id] || []) : [];
              const filteredSets = adRangeSearch ? sets.filter(s => s.name.toLowerCase().includes(adRangeSearch.toLowerCase())) : sets;
              const filteredProducts = adRangeSearch ? products.filter(p => p.name.toLowerCase().includes(adRangeSearch.toLowerCase()) || p.sku?.toLowerCase().includes(adRangeSearch.toLowerCase())) : products;
              const selectedSet = sets.find(s => s.id === ad.productSetId);
              const selectedProductObjs = (ad.productIds || []).map(id => products.find(p => p.id === id)).filter(Boolean);
              return (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><Layers size={12} className="text-primary-500"/> Product Range</label>
                  {!authStatus?.tiktok ? (
                    <div className="bg-warning-50 border border-warning-100 px-3 py-2.5 rounded-base flex items-center justify-between gap-2">
                      <span className="text-xs text-warning-700">请先连接 TikTok 加载 catalog</span>
                      <button type="button" disabled={channelAuthLoading}
                        onClick={() => onAuthorizeChannel?.('tiktok')}
                        className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-base hover:bg-primary-600 disabled:opacity-50">
                        {channelAuthLoading ? '连接中...' : '连接 TikTok'}
                      </button>
                    </div>
                  ) : !selectedAccount ? (
                    <div className="bg-warning-50 border border-warning-100 px-3 py-2.5 rounded-base flex items-center justify-between gap-2">
                      <span className="text-xs text-warning-700">请选择 TikTok 账号</span>
                      <button type="button" onClick={() => onSelectAccount?.()} className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-base hover:bg-primary-600">选择账号</button>
                    </div>
                  ) : !adsetCatalog ? (
                    <div className="bg-warning-50 border border-warning-100 px-3 py-2.5 rounded-base flex items-center justify-between gap-2">
                      <span className="text-xs text-warning-700">该 Adset 尚未配置 Catalog</span>
                      <button type="button"
                        onClick={() => { setEditingAdInfo(null); setEditingAdSetIndex(asIndex); }}
                        className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-base hover:bg-primary-600">去配置 Catalog</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex p-1 bg-neutral-100 rounded-base w-fit">
                        {[
                          { id: 'All', label: 'All Products' },
                          { id: 'ProductSet', label: 'Product Set' },
                          { id: 'SpecificProducts', label: 'Specific Products' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => { updateAd({ productRange: opt.id }); setAdRangeSearch(''); setAdRangeSetOpen(false); setAdRangeProductsOpen(false); }}
                            className={`px-4 py-1.5 rounded-base text-xs font-semibold transition-all ${productRange === opt.id ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                          >{opt.label}</button>
                        ))}
                      </div>

                      {productRange === 'ProductSet' && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setAdRangeSetOpen(v => !v); setAdRangeProductsOpen(false); setAdRangeSearch(''); }}
                            className="w-full h-12 px-5 flex items-center justify-between border border-neutral-200 rounded-base bg-white text-sm font-medium hover:border-primary-300 outline-none transition-all"
                          >
                            <span className={selectedSet ? 'text-neutral-800' : 'text-neutral-400'}>{selectedSet ? selectedSet.name : '搜索并选择 Product Set...'}</span>
                            <ChevronDown size={14} className={`text-neutral-400 transition-transform ${adRangeSetOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {adRangeSetOpen && (
                            <>
                              <div className="fixed inset-0 z-[290]" onClick={() => setAdRangeSetOpen(false)} />
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-base border border-neutral-200 shadow-xl z-[300] max-h-72 overflow-hidden flex flex-col">
                                <div className="p-2 border-b border-neutral-100">
                                  <input
                                    autoFocus
                                    value={adRangeSearch}
                                    onChange={e => setAdRangeSearch(e.target.value)}
                                    placeholder="搜索 product set..."
                                    className="w-full h-8 px-3 bg-neutral-50 border border-neutral-100 rounded text-xs outline-none focus:border-primary-500"
                                  />
                                </div>
                                <div className="overflow-y-auto custom-scrollbar p-1">
                                  {filteredSets.length === 0 ? (
                                    <p className="text-center text-xs text-neutral-400 py-4">无匹配 Product Set</p>
                                  ) : filteredSets.map(s => {
                                    const isSel = ad.productSetId === s.id;
                                    return (
                                      <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => { updateAd({ productSetId: s.id }); setAdRangeSetOpen(false); setAdRangeSearch(''); }}
                                        className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-all flex items-center justify-between ${isSel ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}
                                      >
                                        {s.name}
                                        {isSel && <Check size={12} />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {productRange === 'SpecificProducts' && (
                        <div className="space-y-2">
                          {selectedProductObjs.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProductObjs.map(p => (
                                <span key={p.id} className="inline-flex items-center gap-1 pl-1 pr-1.5 py-0.5 bg-primary-50 border border-primary-100 rounded-full">
                                  <img src={p.imageUrl} className="w-4 h-4 rounded-full object-cover" alt="" />
                                  <span className="text-xs font-medium text-primary-700 max-w-[120px] truncate">{p.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateAd({ productIds: (ad.productIds || []).filter(id => id !== p.id) })}
                                    className="text-primary-400 hover:text-primary-600"
                                  ><X size={10} /></button>
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => { setAdRangeProductsOpen(v => !v); setAdRangeSetOpen(false); setAdRangeSearch(''); }}
                              className="w-full h-12 px-5 flex items-center justify-between border border-neutral-200 rounded-base bg-white text-sm font-medium hover:border-primary-300 outline-none transition-all"
                            >
                              <span className="text-neutral-400">{(ad.productIds || []).length > 0 ? `已选 ${(ad.productIds || []).length} / ${products.length}，继续添加...` : '搜索并多选 Products...'}</span>
                              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${adRangeProductsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {adRangeProductsOpen && (
                              <>
                                <div className="fixed inset-0 z-[290]" onClick={() => setAdRangeProductsOpen(false)} />
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-base border border-neutral-200 shadow-xl z-[300] max-h-80 overflow-hidden flex flex-col">
                                  <div className="p-2 border-b border-neutral-100">
                                    <input
                                      autoFocus
                                      value={adRangeSearch}
                                      onChange={e => setAdRangeSearch(e.target.value)}
                                      placeholder="搜索名称或 SKU..."
                                      className="w-full h-8 px-3 bg-neutral-50 border border-neutral-100 rounded text-xs outline-none focus:border-primary-500"
                                    />
                                  </div>
                                  <div className="overflow-y-auto custom-scrollbar p-1">
                                    {filteredProducts.length === 0 ? (
                                      <p className="text-center text-xs text-neutral-400 py-4">无匹配 Product</p>
                                    ) : filteredProducts.map(p => {
                                      const isSel = (ad.productIds || []).includes(p.id);
                                      return (
                                        <button
                                          key={p.id}
                                          type="button"
                                          onClick={() => {
                                            const cur = ad.productIds || [];
                                            updateAd({ productIds: isSel ? cur.filter(id => id !== p.id) : [...cur, p.id] });
                                          }}
                                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all ${isSel ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}
                                        >
                                          <img src={p.imageUrl} className="w-7 h-7 rounded object-cover shrink-0" alt="" />
                                          <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-medium truncate ${isSel ? 'text-primary-700' : 'text-neutral-800'}`}>{p.name}</p>
                                            <p className="text-[10px] text-neutral-400 font-medium truncate">{p.sku}</p>
                                          </div>
                                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isSel ? 'bg-primary-500 border-primary-500' : 'border-neutral-200'}`}>
                                            {isSel && <Check size={10} className="text-white" strokeWidth={3} />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}

            {isCatalog ? (
              <>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><Database size={12} className="text-primary-500"/> 目录</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setEditAdCatalogOpen(v => !v); setEditAdSetOpen(false); }}
                      className="w-full h-12 px-5 flex items-center justify-between border border-neutral-200 rounded-base bg-white text-sm font-medium hover:border-primary-300 focus:border-primary-500 outline-none transition-all"
                    >
                      <span className={selectedCatalog ? 'text-neutral-800' : 'text-neutral-400'}>
                        {selectedCatalog?.name || '请选择目录'}
                      </span>
                      <ChevronDown size={14} className={`text-neutral-400 transition-transform ${editAdCatalogOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {editAdCatalogOpen && (
                      <>
                        <div className="fixed inset-0 z-[290]" onClick={() => setEditAdCatalogOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-base border border-neutral-200 shadow-xl z-[300] max-h-56 overflow-auto py-1">
                          {MOCK_CATALOGS.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => { onSelectCatalog?.(c); setEditAdCatalogOpen(false); }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 ${selectedCatalog?.id === c.id ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}
                            >
                              <div className="font-medium truncate">{c.name}</div>
                              <div className="text-[11px] text-neutral-400 mt-0.5">id: {c.id}</div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><ListFilter size={12} className="text-primary-500"/> 产品系列</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setEditAdSetOpen(v => !v); setEditAdCatalogOpen(false); }}
                      className="w-full h-12 px-5 flex items-center justify-between border border-neutral-200 rounded-base bg-white text-sm font-medium hover:border-primary-300 focus:border-primary-500 outline-none transition-all"
                    >
                      <span className={selectedProductSet ? 'text-neutral-800' : 'text-neutral-400'}>
                        {selectedProductSet || '请选择产品系列'}
                      </span>
                      <ChevronDown size={14} className={`text-neutral-400 transition-transform ${editAdSetOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {editAdSetOpen && (
                      <>
                        <div className="fixed inset-0 z-[290]" onClick={() => setEditAdSetOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-base border border-neutral-200 shadow-xl z-[300] max-h-56 overflow-auto py-1">
                          {MOCK_PRODUCT_SETS.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { onSelectProductSet?.(s); setEditAdSetOpen(false); }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 ${selectedProductSet === s ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><LinkIcon size={12} className="text-primary-500"/> 落地页 URL</label>
                <input
                  type="text"
                  value={ad.destinationUrl}
                  onChange={e => {
                    const next = [...localAdSets]; next[asIndex].ads[adIndex].destinationUrl = e.target.value; setLocalAdSets(next);
                  }}
                  className="w-full h-12 px-5 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><Globe size={12} className="text-primary-500"/> UTM 参数 (Tracking)</label>
              <input
                type="text"
                placeholder="utm_source=meta&utm_medium=paid..."
                value={ad.utmParams || ''}
                onChange={e => {
                  const next = [...localAdSets]; next[asIndex].ads[adIndex].utmParams = e.target.value; setLocalAdSets(next);
                }}
                className="w-full h-12 px-5 border border-neutral-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all"
              />
            </div>

            {platform?.id !== 'tiktok' && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-400 px-1 flex items-center gap-2"><Tag size={12} className="text-primary-500"/> 突显优惠 (Promo Offer)</label>
                <div className="p-5 bg-neutral-50 rounded-inner border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-inner flex items-center justify-center transition-colors ${ad.offerType === 'AUTO' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/10' : 'bg-white text-neutral-300 border border-neutral-100'}`}>
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">自动获取品牌优惠码</p>
                        <p className="text-xs font-medium text-neutral-500 mt-0.5">Auto-fetch: 90% OFF active</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = [...localAdSets];
                        const currentType = next[asIndex].ads[adIndex].offerType;
                        next[asIndex].ads[adIndex].offerType = currentType === 'AUTO' ? 'NONE' : 'AUTO';
                        next[asIndex].ads[adIndex].promoCode = next[asIndex].ads[adIndex].offerType === 'AUTO' ? '90%OFF' : '';
                        setLocalAdSets(next);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${ad.offerType === 'AUTO' ? 'bg-primary-500' : 'bg-neutral-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ad.offerType === 'AUTO' ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
            <button onClick={() => setEditingAdInfo(null)} className="px-10 py-4 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus">保存修改</button>
          </div>
        </div>
      </div>
    );
  };

  const ChangeCreativeModal = () => {
    if (!changeCreativeInfo) return null;
    const { asIndex, adIndex } = changeCreativeInfo;
    const ad = localAdSets[asIndex]?.ads[adIndex];
    if (!ad) return null;

    const isMultiCreativeAd = ad.adFormat === 'FLEXIBLE' || ad.adFormat === 'CAROUSEL' || Array.isArray(ad.imageUrls);
    const isFlexibleAd = isMultiCreativeAd; // 兼容下游引用
    // Meta 平台下所有 ad 均允许最多 10 个素材；其他平台仅多素材类型允许多选
    const maxCount = (platform?.id === 'meta' || isMultiCreativeAd) ? 10 : 1;

    // Flatten all available creatives, deduplicate by URL
    const allCreativesRaw = Object.values(productCreativesMap || {}).flat();
    const seenUrls = new Set();
    const allCreatives = allCreativesRaw.filter(c => {
      if (seenUrls.has(c.url)) return false;
      seenUrls.add(c.url);
      return true;
    });

    // Initial selection from current ad
    const initSelected = isFlexibleAd
      ? (ad.imageUrls || [ad.imageUrl]).map(url => allCreatives.find(c => c.url === url) || { id: url, url })
      : [allCreatives.find(c => c.url === ad.imageUrl) || { id: ad.imageUrl, url: ad.imageUrl }];

    const [activeTab, setActiveTab] = useState('LIBRARY');
    const [selected, setSelected] = useState(() => initSelected.filter(Boolean));
    const [uploadDragOver, setUploadDragOver] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null); // { type: 'info'|'warn', text }
    const uploadInputRef = useRef(null);

    const filesToCreatives = (files) => Array.from(files)
      .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .map(f => ({
        id: `upload-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(f),
        mediaType: f.type.startsWith('video/') ? 'video' : 'image',
        fileName: f.name,
      }));

    const ingestUploads = (fileList) => {
      const incoming = filesToCreatives(fileList);
      if (incoming.length === 0) {
        setUploadMessage({ type: 'warn', text: '未识别到有效的图片或视频文件' });
        return;
      }
      const remaining = Math.max(0, maxCount - selected.length);
      if (remaining === 0) {
        setUploadMessage({ type: 'warn', text: `已达 ${maxCount} 个素材上限，本次上传的 ${incoming.length} 个未加入` });
        return;
      }
      const accepted = incoming.slice(0, remaining);
      const dropped = incoming.length - accepted.length;
      setSelected(prev => [...prev, ...accepted]);
      if (dropped > 0) {
        setUploadMessage({ type: 'warn', text: `已添加 ${accepted.length} 个；超出上限 ${maxCount}，未加入 ${dropped} 个` });
      } else {
        setUploadMessage({ type: 'info', text: `已添加 ${accepted.length} 个素材到 Selected` });
      }
    };

    useEffect(() => {
      if (!uploadMessage) return;
      const t = setTimeout(() => setUploadMessage(null), 3500);
      return () => clearTimeout(t);
    }, [uploadMessage]);

    const tabs = [
      { id: 'AI', label: 'AI Generate', icon: <Sparkles size={13} /> },
      { id: 'LIBRARY', label: 'Creative Library', icon: <Layout size={13} /> },
      { id: 'ASSETS', label: 'Product Assets', icon: <ShoppingBag size={13} /> },
      { id: 'MEDIA', label: 'Media Creatives', icon: <Monitor size={13} /> },
      { id: 'UPLOAD', label: 'Upload', icon: <Plus size={13} /> },
    ];

    const mediaState =
      !platform ? 'NO_PLATFORM' :
      !authStatus?.[platform.id] ? 'NEED_AUTH' :
      !selectedAccount ? 'NEED_PICK' :
      'PICKED';

    const isSelected = (c) => selected.some(s => s.url === c.url);

    const toggle = (c) => {
      if (isSelected(c)) {
        if (selected.length === 1) return; // keep at least one
        setSelected(selected.filter(s => s.url !== c.url));
      } else {
        if (maxCount === 1) {
          setSelected([c]);
        } else if (selected.length < maxCount) {
          setSelected([...selected, c]);
        }
      }
    };

    const handleConfirm = () => {
      const next = [...localAdSets];
      const targetAd = { ...next[asIndex].ads[adIndex] };
      if (isFlexibleAd) {
        targetAd.imageUrl = selected[0]?.url || targetAd.imageUrl;
        targetAd.imageUrls = selected.map(c => c.url);
      } else {
        targetAd.imageUrl = selected[0]?.url || targetAd.imageUrl;
      }
      next[asIndex] = { ...next[asIndex], ads: next[asIndex].ads.map((a, i) => i === adIndex ? targetAd : a) };
      setLocalAdSets(next);
      setChangeCreativeInfo(null);
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-3xl rounded-section shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Change Creative</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Current campaign supports up to {maxCount} creative{maxCount > 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={() => setChangeCreativeInfo(null)} className="p-2 hover:bg-neutral-50 rounded-full text-neutral-300">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: tabs + grid */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-neutral-100">
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-neutral-100">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-all -mb-px ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'LIBRARY' ? (
                  allCreatives.length > 0 ? (
                    <div className="grid grid-cols-4 gap-1.5">
                      {allCreatives.map((c, i) => {
                        const sel = isSelected(c);
                        const selIdx = selected.findIndex(s => s.url === c.url);
                        return (
                          <div
                            key={c.id || i}
                            onClick={() => toggle(c)}
                            className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                              sel ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-neutral-300'
                            }`}
                          >
                            {c.mediaType === 'video' ? (
                              <video src={c.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                            ) : (
                              <img src={c.url} className="w-full h-full object-cover" alt="" />
                            )}
                            {sel && (
                              <div className="absolute inset-0 bg-primary-500/20" />
                            )}
                            {sel && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                                {selIdx + 1}
                              </div>
                            )}
                            {!sel && selected.length >= maxCount && (
                              <div className="absolute inset-0 bg-white/50" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
                      <Layout size={32} className="text-neutral-200" />
                      <p className="text-sm">暂无可用创意</p>
                    </div>
                  )
                ) : activeTab === 'MEDIA' ? (
                  mediaState === 'NO_PLATFORM' ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3 text-center px-6">
                      <div className="w-16 h-16 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-300"><Monitor size={32} /></div>
                      <p className="text-sm font-bold text-neutral-500">尚未选择媒体渠道</p>
                      <p className="text-xs text-neutral-400 max-w-xs">请返回上一步在"投放渠道媒体"中选择媒体平台并连接账号。</p>
                    </div>
                  ) : mediaState === 'NEED_AUTH' ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                      <div className="w-16 h-16 bg-neutral-50 rounded-xl flex items-center justify-center overflow-hidden">
                        {platform.logo ? <img src={platform.logo} alt="" className="w-10 h-10 object-contain" /> : <Monitor size={32} className="text-neutral-300" />}
                      </div>
                      <p className="text-sm font-bold text-neutral-500">连接 {platform.name} 后查看媒体素材</p>
                      <p className="text-xs text-neutral-400 max-w-xs">连接成功后将自动弹出账号选择，再选择目标账号即可加载该账号下的媒体素材。</p>
                      <button
                        onClick={() => onAuthorizeChannel?.(platform.id)}
                        disabled={channelAuthLoading}
                        className="mt-2 px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-all shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {channelAuthLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        {channelAuthLoading ? '连接中...' : `Connect ${platform.name} Ads`}
                      </button>
                    </div>
                  ) : mediaState === 'NEED_PICK' ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                      <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500"><Briefcase size={32} /></div>
                      <p className="text-sm font-bold text-neutral-500">已连接 {platform.name}，请选择广告账号</p>
                      <p className="text-xs text-neutral-400 max-w-xs">从已授权账户中选择一个，加载其媒体素材库。</p>
                      <button
                        onClick={() => onOpenAccountPicker?.()}
                        className="mt-2 px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-all shadow-md flex items-center gap-2"
                      >
                        <Briefcase size={14} /> 选择 {platform.name} 账号
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-100 rounded-md">
                        {platform.logo && <img src={platform.logo} alt="" className="w-4 h-4 object-contain shrink-0" />}
                        <p className="text-[11px] font-medium text-primary-700 truncate">
                          已连接 {platform.name} · 账号 <span className="font-bold">{selectedAccount.name}</span>
                        </p>
                      </div>
                      {allCreatives.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {allCreatives.map((c, i) => {
                            const sel = isSelected(c);
                            const selIdx = selected.findIndex(s => s.url === c.url);
                            return (
                              <div
                                key={`media-${c.id || i}`}
                                onClick={() => toggle(c)}
                                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                                  sel ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-neutral-300'
                                }`}
                              >
                                {c.mediaType === 'video' ? (
                                  <video src={c.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                                ) : (
                                  <img src={c.url} className="w-full h-full object-cover" alt="" />
                                )}
                                {sel && <div className="absolute inset-0 bg-primary-500/20" />}
                                {sel && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                                    {selIdx + 1}
                                  </div>
                                )}
                                {!sel && selected.length >= maxCount && (
                                  <div className="absolute inset-0 bg-white/50" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-2">
                          <Monitor size={32} className="text-neutral-200" />
                          <p className="text-sm">该账号下暂无媒体素材</p>
                        </div>
                      )}
                    </div>
                  )
                ) : activeTab === 'UPLOAD' ? (
                  <div className="h-full flex flex-col gap-3">
                    <div
                      onClick={() => uploadInputRef.current?.click()}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setUploadDragOver(true); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDragLeave={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        if (e.currentTarget.contains(e.relatedTarget)) return;
                        setUploadDragOver(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setUploadDragOver(false);
                        if (e.dataTransfer?.files?.length) ingestUploads(e.dataTransfer.files);
                      }}
                      className={`flex-1 min-h-[260px] flex flex-col items-center justify-center rounded-section border-2 border-dashed cursor-pointer transition-all ${
                        uploadDragOver
                          ? 'bg-primary-50/60 border-primary-500 scale-[1.01]'
                          : 'bg-neutral-50/40 border-neutral-200 hover:border-primary-500/60 hover:bg-primary-50/30'
                      }`}
                    >
                      <input
                        ref={uploadInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/mp4,video/quicktime,video/webm"
                        className="hidden"
                        onChange={(e) => { ingestUploads(e.target.files || []); e.target.value = ''; }}
                      />
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${uploadDragOver ? 'bg-primary-500 text-white' : 'bg-white text-primary-500 shadow-sm'}`}>
                        <Plus size={28} />
                      </div>
                      <p className="text-sm font-semibold text-neutral-700 mb-1">{uploadDragOver ? '松开鼠标即可上传' : '点击或拖拽文件到此处'}</p>
                      <p className="text-xs text-neutral-400 font-medium">支持图片 (jpg/png/webp) 与视频 (mp4/mov/webm)，可批量</p>
                      <p className="text-[11px] text-neutral-400 mt-2">当前可再添加 <span className="font-bold text-primary-500">{Math.max(0, maxCount - selected.length)}</span> / {maxCount} 个</p>
                    </div>
                    {uploadMessage && (
                      <div className={`px-3 py-2 rounded-base text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200 ${
                        uploadMessage.type === 'warn'
                          ? 'bg-warning-50 text-warning-700 border border-warning-100'
                          : 'bg-success-50 text-success-700 border border-success-100'
                      }`}>
                        {uploadMessage.type === 'warn' ? <Info size={12} /> : <Check size={12} />}
                        {uploadMessage.text}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'AI' ? (
                  (() => {
                    const aiAtLimit = selected.length >= maxCount;
                    const handleGenerate = () => {
                      if (aiAtLimit) return;
                      const placeholderId = `aigc-${Date.now()}-${Math.random()}`;
                      const placeholder = { id: placeholderId, url: '', mediaType: 'image', isGenerating: true, fileName: 'AI generating…' };
                      setSelected(prev => [...prev, placeholder]);
                      // 模拟 AI 生成（2.4s 后替换为真实 mock 素材）
                      setTimeout(() => {
                        const seed = Math.random().toString(36).slice(2, 8);
                        setSelected(prev => prev.map(c => c.id === placeholderId
                          ? { ...c, url: `https://picsum.photos/seed/${seed}/800/800`, isGenerating: false, fileName: `AIGC-${seed}.jpg` }
                          : c));
                      }, 2400);
                    };
                    return (
                      <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                          <Sparkles size={36} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-neutral-900">AI 一键生成创意</p>
                          <p className="text-xs text-neutral-400 font-medium">每点击一次按钮，立即往 Selected 添加一个生成中的占位，完成后自动替换为成品素材</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerate}
                          disabled={aiAtLimit}
                          className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-lg ${
                            aiAtLimit
                              ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95'
                          }`}
                        >
                          <Sparkles size={16} />
                          {aiAtLimit ? `已达上限 ${maxCount} 个` : '生成一张创意'}
                        </button>
                        <p className="text-[11px] text-neutral-400">已选 <span className="font-bold text-primary-500">{selected.length}</span> / {maxCount}</p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
                    <Sparkles size={32} className="text-neutral-200" />
                    <p className="text-sm font-medium text-neutral-400">{tabs.find(t => t.id === activeTab)?.label}</p>
                    <p className="text-xs text-neutral-300">即将推出</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: selected panel */}
            <div className="w-52 shrink-0 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <span className="text-xs font-semibold text-neutral-600">Selected</span>
                <span className="text-xs font-bold text-primary-500">{selected.length} / {maxCount}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {selected.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-2">
                    <div className="w-16 h-16 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center">
                      <Plus size={20} className="text-neutral-300" />
                    </div>
                    <p className="text-xs text-neutral-400">No creative selected</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {selected.map((c, i) => (
                      <div key={c.id || i} className="relative group/sel rounded-md overflow-hidden border border-neutral-100">
                        {c.isGenerating ? (
                          <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-100 via-primary-50 to-purple-50 animate-pulse">
                            <Sparkles size={18} className="text-primary-500/70" />
                            <span className="absolute bottom-1 left-1 right-1 text-[9px] text-center text-primary-600/80 font-semibold">AI 生成中…</span>
                          </div>
                        ) : c.mediaType === 'video' ? (
                          <video src={c.url} muted playsInline preload="metadata" className="w-full aspect-square object-cover" />
                        ) : (
                          <img src={c.url} className="w-full aspect-square object-cover" alt="" />
                        )}
                        <button
                          onClick={() => selected.length > 1 && setSelected(selected.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover/sel:opacity-100 transition-opacity"
                          title={c.isGenerating ? '取消生成' : '移除'}
                        >
                          <X size={10} />
                        </button>
                        <div className="absolute top-1 left-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-neutral-100 flex justify-end gap-3">
            <button
              onClick={() => setChangeCreativeInfo(null)}
              className="px-6 py-2.5 border border-neutral-200 text-neutral-600 rounded-base text-sm font-medium hover:bg-neutral-50 transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0 || selected.some(c => c.isGenerating)}
              title={selected.some(c => c.isGenerating) ? '等待 AI 生成完成后再应用' : undefined}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Confirm Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">发布方案预览</h2>
        </div>
        <button onClick={onBack} className="border border-primary-500 text-primary-500 rounded-base text-sm font-medium hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 px-6 py-3 flex items-center gap-2">
          <ChevronLeft size={16} /> 返回修改配置
        </button>
      </div>

      {numCampaigns >= 2 && (
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/85 backdrop-blur border-b border-neutral-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-neutral-400 shrink-0">快速跳转：</span>
          {Array.from({ length: numCampaigns }, (_, i) => (
            <button
              key={i}
              onClick={() => document.getElementById(`campaign-block-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="px-3 py-1.5 rounded-base text-xs font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-500 transition-colors"
            >
              Campaign {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-16">
        {Array.from({ length: numCampaigns }, (_, cIdx) => (
        <div id={`campaign-block-${cIdx}`} key={`campaign-block-${cIdx}`} className="space-y-16 scroll-mt-20">
        <div className={`flex items-center gap-3 px-1 ${cIdx === 0 ? 'mb-2' : '-my-4'}`} aria-hidden>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          <span className="text-[10px] font-semibold tracking-wider text-neutral-400">
            Campaign {cIdx + 1}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        </div>
        <div className="bg-neutral-900 p-6 rounded-section shadow-xl text-white relative overflow-visible">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -translate-y-40 translate-x-40 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary-500 rounded-inner flex items-center justify-center shadow-lg border-2 border-white/10"><Briefcase size={22} /></div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Campaign {cIdx + 1} Overview</p>
                {!isExistingCampaign ? (
                  isEditingCampaignName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        className="text-xl font-semibold bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white outline-none focus:border-primary-400 w-64"
                        value={localCampaignName}
                        onChange={e => setLocalCampaignName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') setIsEditingCampaignName(false); if (e.key === 'Escape') { setLocalCampaignName(campaignName); setIsEditingCampaignName(false); } }}
                      />
                      <button onClick={() => setIsEditingCampaignName(false)} className="text-success-400 hover:text-success-300"><Check size={16} /></button>
                      <button onClick={() => { setLocalCampaignName(campaignName); setIsEditingCampaignName(false); }} className="text-neutral-400 hover:text-neutral-300"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/name">
                      <h3 className="text-xl font-semibold">{localCampaignName}</h3>
                      <button onClick={() => setIsEditingCampaignName(true)} className="opacity-0 group-hover/name:opacity-100 transition-opacity text-neutral-400 hover:text-white">
                        <Edit3 size={15} />
                      </button>
                    </div>
                  )
                ) : (
                  <h3 className="text-xl font-semibold">{localCampaignName}</h3>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-neutral-500 tracking-widest">规模概览</p>
              <p className="text-xl font-semibold text-success-400">{adSetGroupsCount || localAdSets.length} Adsets · {localAdSets.reduce((s, as) => s + (as.ads?.length || 0), 0)} Ads</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">投放国家</p>
              <p className="text-sm font-medium">{brand.country}</p>
            </div>
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">优化目标</p>
              <p className="text-sm font-medium truncate">{optimizationEvent || '—'}</p>
            </div>
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">Daily Budget</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 shrink-0">
                  {['CBO', 'ABO'].map(mode => (
                    <button key={mode} disabled={isExistingCampaign}
                      onClick={() => { if (!isExistingCampaign && onBudgetTypeChange) onBudgetTypeChange(mode); }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        budgetType === mode ? 'bg-primary-500 text-white' : 'bg-white/10 text-neutral-400 hover:bg-white/20'
                      } ${isExistingCampaign ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white">$</span>
                  <input type="number" value={localBudget}
                    onChange={e => { const v = Number(e.target.value); setLocalBudget(v); if (onBudgetChange) onBudgetChange(v); }}
                    className="w-16 bg-white/10 border border-white/20 rounded px-2 py-0.5 text-sm font-medium text-white outline-none focus:border-primary-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            <div ref={ctaTriggerRef} className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">CTA</p>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsCtaOpen(!isCtaOpen)}>
                <p className="text-sm font-medium">{selectedCta}</p>
                <ChevronDown size={11} className={`text-neutral-500 transition-transform ml-auto ${isCtaOpen ? 'rotate-180' : ''}`} />
              </div>
              <Popover
                open={isCtaOpen}
                anchorRef={ctaTriggerRef}
                placement="bottom-start"
                onClose={() => setIsCtaOpen(false)}
                className="w-44 bg-white rounded-base shadow-xl border border-neutral-100 p-1.5"
              >
                {CTA_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => { setSelectedCta(opt); setIsCtaOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCta === opt ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}>
                    {opt}
                    {selectedCta === opt && <Check size={12} />}
                  </button>
                ))}
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {localAdSets.map((adSet, asIdx) => (
            <div key={asIdx} className="bg-white border border-neutral-100 rounded-section p-10 shadow-adsgo-card space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-inner flex items-center justify-center font-semibold">AS{asIdx + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-xs font-medium text-neutral-500">Ad Set</p>
                       <span className="px-1.5 py-0.5 bg-primary-50 text-primary-500 text-xs font-semibold rounded-tag">{adSet.audienceType}</span>
                    </div>
                    <h4 className="text-base font-semibold text-neutral-800">{adSet.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEditingAdSetIndex(asIdx)}
                    className="border border-primary-500 text-primary-500 rounded-base text-sm font-medium hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 px-4 py-2 flex items-center gap-2"
                  >
                    <Edit3 size={14} /> 编辑配置
                  </button>
                  {localAdSets.length > 1 && (
                    <button
                      onClick={() => setLocalAdSets(prev => prev.filter((_, i) => i !== asIdx))}
                      className="border border-neutral-200 text-neutral-400 rounded-base text-sm font-medium hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 px-3 py-2"
                      title="删除此广告组"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {adSet.ads.map((ad, aIdx) => {
                  const product = selectedProducts.find(p => p.id === ad.productId);
                  // Calculate global ad index
                  const previousAdsetsCount = localAdSets.slice(0, asIdx).reduce((acc, as) => acc + as.ads.length, 0);
                  const globalAdIdx = previousAdsetsCount + aIdx;
                  const isLoaded = globalAdIdx < loadedAdsCount;

                  if (!isLoaded) {
                    return <AdSkeleton key={aIdx} />;
                  }

                  const adFormatLabel = ad.adFormat === 'FLEXIBLE' ? 'Flexible'
                    : ad.adFormat === 'CAROUSEL' ? 'Carousel'
                    : 'Single';
                  const adFormatBadgeCls = ad.adFormat === 'FLEXIBLE' ? 'bg-violet-50 text-violet-600 border-violet-100'
                    : ad.adFormat === 'CAROUSEL' ? 'bg-warning-50 text-warning-600 border-warning-100'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200';
                  const isSingleSplit = ad.adFormat === 'SINGLE' && adSet.ads.length > 1;
                  return (
                    <div key={aIdx} className="group relative">
                      <div className="bg-white rounded-section border border-neutral-200 overflow-hidden shadow-adsgo-card transition-all hover:shadow-xl hover:border-primary-500/20 relative animate-in fade-in zoom-in-95 duration-500">
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => setEditingAdInfo({ asIndex: asIdx, adIndex: aIdx })}
                            className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-500 shadow-lg transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          {adSet.ads.length > 1 && (
                            <button
                              onClick={() => setLocalAdSets(prev => { const next = [...prev]; next[asIdx] = { ...next[asIdx], ads: next[asIdx].ads.filter((_, i) => i !== aIdx) }; return next; })}
                              className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-500 shadow-lg transition-colors"
                              title="删除此广告"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <div className="p-4 bg-white border-b border-neutral-50">
                          <div className="flex items-center justify-between mb-3 gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-medium text-white shrink-0">{brand.name.charAt(0)}</div>
                              <div className="min-w-0"><p className="text-xs font-medium text-neutral-900 truncate">{brand.name}</p><p className="text-xs text-neutral-500">Sponsored</p></div>
                            </div>
                            {/* Ad Format 徽标：放在 brand 右侧、与 sponsored 一行齐平，hover 编辑按钮在更外侧 */}
                            <div className="relative group/badge shrink-0 mr-9">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-tag text-[10px] font-bold tracking-wide border ${adFormatBadgeCls}`}>
                                {adFormatLabel}
                                {isSingleSplit && <Info size={9} className="opacity-70" />}
                              </span>
                              {isSingleSplit && (
                                <div className="absolute top-full right-0 mt-1 px-2.5 py-1.5 bg-neutral-900 text-white text-[10px] font-medium rounded shadow-lg whitespace-nowrap opacity-0 group-hover/badge:opacity-100 pointer-events-none transition-opacity duration-150 z-20">
                                  发布时将自动拆分为多个 Ad（adset 内每个素材独立成 ad）
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-700 leading-relaxed line-clamp-2">{Array.isArray(ad.primaryText) ? ad.primaryText[0] : ad.primaryText}</p>
                        </div>
                        <div className="aspect-square bg-neutral-100 relative overflow-hidden group/img">
                           {campaignType === 'CATALOG' ? (
                             <DPAPreviewCard />
                           ) : (
                             <img src={ad.imageUrl} className="w-full h-full object-cover" />
                           )}
                           {ad.isDynamic && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold tracking-widest">Dynamic Catalog Preview</div>}
                           {!ad.isDynamic && (
                             <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all flex items-center justify-center">
                               <button
                                 onClick={() => setChangeCreativeInfo({ asIndex: asIdx, adIndex: aIdx })}
                                 className="opacity-0 group-hover/img:opacity-100 transition-all flex items-center gap-1.5 bg-white text-neutral-800 text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-primary-500 hover:text-white"
                               >
                                 <Layout size={12} />
                                 Change Creative
                               </button>
                             </div>
                           )}
                        </div>
                        <div className="p-4 bg-neutral-50 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-500 font-semibold truncate">{ad.destinationUrl.split('?')[0].split('/').slice(0,3).join('/')}</p>
                            <h6 className="text-xs font-medium text-neutral-900 truncate">{Array.isArray(ad.headline) ? ad.headline[0] : ad.headline}</h6>
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded-md text-xs font-medium text-neutral-800 shrink-0 tracking-tighter shadow-sm">{selectedCta}</div>
                        </div>
                        {product && (
                          <div className="p-2.5 bg-primary-50/50 border-t border-primary-500/15 flex items-center gap-2">
                             <img src={product.imageUrl} className="w-6 h-6 rounded-md object-cover border border-primary-500/20" />
                             <div className="min-w-0 flex-1"><p className="text-xs font-medium text-primary-500/70 tracking-tighter">关联落地页</p><p className="text-xs font-medium text-primary-700 truncate">{product.name}</p></div>
                          </div>
                        )}
                        {ad.isDynamic && (
                           <div className="p-2.5 bg-success-50/50 border-t border-success-100 flex items-center gap-2">
                              <Box size={14} className="text-success-400" />
                              <p className="text-xs font-medium text-success-900">使用目录动态字段渲染</p>
                           </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-white px-8 py-4 z-[100] border-t border-white/5 backdrop-blur-xl bg-opacity-95 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-base flex items-center justify-center shadow-lg"><Layers size={20} /></div>
              <div><p className="text-xs font-medium text-neutral-500">结构方案</p><p className="text-base font-semibold">{numCampaigns} Campaigns • {(adSetGroupsCount || localAdSets.length) * numCampaigns} Adsets • {campaignType === 'CATALOG' ? 'Dynamic' : localAdSets.reduce((acc, as) => acc + as.ads.length, 0) * numCampaigns} Ads</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-600 rounded-base flex items-center justify-center shadow-lg"><DollarSign size={20} /></div>
              <div><p className="text-xs font-medium text-neutral-500">预估日消耗</p><p className="text-xl font-semibold text-success-400">${totalDailyBudget}</p></div>
            </div>
          </div>
          <button
            onClick={onPublish}
            disabled={loadedAdsCount < totalAdsCount}
            className={`px-10 py-3.5 rounded-base text-sm font-medium transition-all duration-200 flex items-center gap-3 focus:outline-none focus:shadow-primary-focus ${
              loadedAdsCount < totalAdsCount
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
            }`}
          >
            {loadedAdsCount < totalAdsCount ? (
              <>
                <Sparkles size={20} className="animate-spin text-primary-500/70" />
                AI 生成中... ({loadedAdsCount}/{totalAdsCount})
              </>
            ) : (
              <>
                <Rocket size={20} /> 立即发布方案
              </>
            )}
          </button>
        </div>
      </div>
      <EditAdSetModal
        isOpen={editingAdSetIndex !== null}
        adSet={editingAdSetIndex !== null ? localAdSets[editingAdSetIndex] : null}
        onUpdateField={handleUpdateField}
        onToggleItem={handleToggleItem}
        onClose={() => setEditingAdSetIndex(null)}
        authStatus={authStatus}
        selectedAccount={selectedAccount}
        onAuthStatusChange={onAuthStatusChange}
        onSelectAccount={onSelectAccount}
        budgetType={budgetType}
        dailyBudget={localBudget}
        platform={platform}
        effectiveBidStrategy={bidStrategy}
        globalBidAmount={bidAmount}
        isTikTokAppSales={isTikTokAppSales}
        catalogs={catalogs}
        onAuthorizeChannel={onAuthorizeChannel}
        onOpenAccountPicker={onOpenAccountPicker}
        channelAuthLoading={channelAuthLoading}
      />
      {EditAdModal()}
      <ChangeCreativeModal />
    </div>
  );
};

export default CampaignPreviewView;
