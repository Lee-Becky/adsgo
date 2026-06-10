import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X, Globe, Monitor, ShoppingBag, ChevronDown, Sparkles, Search,
  Briefcase, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText,
  Type, Rocket, Facebook, Instagram, Hash, Loader2,
  CheckCircle2, Layers, RefreshCw, MapPin, Zap, ArrowRight, ChevronLeft,
  Megaphone, MousePointer2, Users, Smartphone, ChevronRight, Link2Off, AlertCircle,
  DollarSign, Database
} from 'lucide-react';
import { Z_INDEX } from '../../constants/zIndex';
import { useZIndex } from '../../hooks/useZIndex';
import { Popover } from '../common/Popover';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ProductSelector, { MOCK_CATALOGS, MOCK_CATALOG_PRODUCT_SETS, MOCK_CATALOG_PRODUCTS } from './components/ProductSelector';
import CampaignPlanView from './components/CampaignPlanView';
import useDropdownLoading from '../../hooks/useDropdownLoading';
import { authorizePlatform } from './services/authService';
import CampaignSection from './components/CampaignSection';
import AdSetSection from './components/AdSetSection';
import AdSection from './components/AdSection';
// Phase 2.J：UnifiedAdvancedSettings 已拆回各 Section 内部（SectionAdvancedFold）；保留文件以备回退
import StepConnector from './components/StepConnector';
import InitializationModeSelector from './components/InitializationModeSelector';
import ConfirmActionBar from './components/ConfirmActionBar';
import SaveStructureModal from './components/SaveStructureModal';
import SavedStructuresPicker from './components/SavedStructuresPicker';
import {
  listSavedStructures, saveStructure, deleteSavedStructure, applySavedStructure,
} from './utils/savedStructures';
import {
  deriveSectionDefaults,
  writeBudgetType, writeBudget, writeBidStrategy, writeBidAmount,
  writeAdType, writeObjective, writeOptGoal, writeLocations, writeLanguage, writeEvent,
  statusFieldName, publishStatusToSdk,
} from './utils/formDataAdapter';
import PublishConfirmModal from './components/PublishConfirmModal';
import { derivePlan, deriveStructureFromPlan } from './utils/campaignPlan';
import { getFieldDefs, validateAllLevels, pruneAllLevels, getDefaultLevelValues } from './fieldDefinitions';

const MOCK_EXISTING_CAMPAIGNS = [
  { id: '1202058341', name: 'US-Summer-Sales-CBO-001', budgetType: 'CBO', budget: 200 },
  { id: '1202059422', name: 'GLOBAL-Testing-ABO-V2', budgetType: 'ABO', budget: 20 },
  { id: '1202061553', name: 'US-Apparel-NewSeason-LAL', budgetType: 'CBO', budget: 500 },
  { id: '1202062774', name: 'CA-Accessories-Retargeting', budgetType: 'ABO', budget: 50 },
];

const MOCK_ACCOUNTS = [
  { id: 'act_2948192038', name: 'Luminaire Style - Global' },
  { id: 'act_1039582103', name: 'Performance Testing Acc' },
];

const MOCK_TIKTOK_ACCOUNTS = [
  { id: 'adv_8843921', name: 'AdsGo TikTok - Global' },
  { id: 'adv_5532918', name: 'AdsGo TikTok - APAC' },
];

const PLATFORM_ACCOUNTS = {
  meta: MOCK_ACCOUNTS,
  tiktok: MOCK_TIKTOK_ACCOUNTS,
};

const STRATEGY_OPTIONS = [
  { id: 'PER_PRODUCT',          label: 'Product 测试',  desc: '每款产品独立测试' },
  { id: 'ALL_PRODUCTS_PER_SET', label: 'Audience 测试', desc: '所有产品混合测试' },
  { id: 'BY_CREATIVE',          label: 'Creative 测试', desc: '按素材组拆分测试' },
];

const STRATEGY_ADSET_FIELD = {
  PER_PRODUCT: 'numAdsetsPerProduct',
  ALL_PRODUCTS_PER_SET: 'numAdsets',
  BY_CREATIVE: 'adsPerSet',
};

const STRATEGY_ADSET_LABEL = {
  PER_PRODUCT: 'Adset 数量',
  ALL_PRODUCTS_PER_SET: 'Adset 数量',
  BY_CREATIVE: 'Adset 数量',
};

const PLATFORM_PLACEMENTS = {
  meta: [
    { id: 'facebook_feed', label: 'Facebook Feed' },
    { id: 'instagram_feed', label: 'Instagram Feed' },
    { id: 'stories', label: 'Stories' },
    { id: 'reels', label: 'Reels' },
    { id: 'audience_network', label: 'Audience Network' },
    { id: 'messenger', label: 'Messenger' },
  ],
  tiktok: [
    { id: 'tiktok', label: 'TikTok' },
    { id: 'pangle', label: 'Pangle' },
    { id: 'global_app_bundle', label: 'Global App Bundle', sublabels: ['CapCut', 'Fizzo'] },
  ],
};

const MOCK_PAGES = [
  { id: 'page_123', name: 'Luminaire Vintage Official' },
  { id: 'page_456', name: 'Retro Fashion Daily' },
];

const PLATFORMS = [
  { id: 'meta', name: 'Meta', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', name: 'Google', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256', disabled: true },
  { id: 'tiktok', name: 'TikTok', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256' },
  { id: 'bing', name: 'Bing', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256', disabled: true }
];

const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Reach more people' },
  { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site visits' },
  { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Find prospects' },
  { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive transactions' },
  { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-primary-500', bg: 'bg-primary-50', description: 'Install & usage' }
];

// TikTok 仅支持 sales / app_promotion 两类目标。其他渠道沿用全集。
const TIKTOK_ALLOWED_OBJECTIVES = new Set(['sales_conversions', 'app_promotion']);
const getAvailableObjectives = (platformId) =>
  platformId === 'tiktok'
    ? CAMPAIGN_OBJECTIVES.filter(o => TIKTOK_ALLOWED_OBJECTIVES.has(o.value))
    : CAMPAIGN_OBJECTIVES;

// 竞价策略（仅 Meta 适用）。valueType 决定 adset 级金额输入的形态：
//   - 'none'     ：无需填写
//   - 'currency' ：USD 金额（cost cap / bid cap）
//   - 'roas'     ：ROAS 数值（非百分比，如 2.5 表示 250% ROAS）
const BID_STRATEGIES = [
  { value: 'highest_volume', label: 'Highest volume',       desc: '最大化转化量',   valueType: 'none' },
  { value: 'cost_cap',       label: 'Cost per result goal', desc: '单次结果成本上限', valueType: 'currency' },
  { value: 'roas',           label: 'ROAS goal',            desc: 'ROAS 目标',     valueType: 'roas' },
  { value: 'bid_cap',        label: 'Bid cap',              desc: '出价上限',       valueType: 'currency' },
];

// 受众预设数据（exported 共享给 CampaignPlanView / CampaignPreviewView 复用）
export const PRESET_LAL_AUDIENCES = [
  { id: 'lal1', name: 'LAL (US, 1%) - Purchase' },
  { id: 'lal2', name: 'LAL (US, 5%) - Purchase' },
  { id: 'lal3', name: 'LAL (UK, 1%) - Add to Cart' },
  { id: 'lal4', name: 'LAL (All, 10%) - Page View' },
];
export const PRESET_CUSTOM_AUDIENCES = [
  { id: 'ca1', name: 'Website Visitors - 30d' },
  { id: 'ca2', name: 'Purchasers - Last 180d' },
  { id: 'ca3', name: 'Lead Form Submissions' },
  { id: 'ca4', name: 'Video Viewers 50%' },
];

// 共享组件：包含/排除受众下拉，内部 LAL/Custom tab 切换，4 态授权 UI
// 用于 02 受众预设 / AdsetDetailPanel LAL 分支 / EditAdSetModal 三处。
export const IncludeExcludeAudienceDropdown = ({
  triggerLabel,           // 触发卡片标题 (e.g. '包含受众' / '排除受众')
  open, onToggle,         // 受控展开
  lalSelected = [], customSelected = [],
  onToggleLal, onToggleCustom,
  authStatus, platform,
  selectedAccount,
  onAuthorize, isAuthLoading,
  onPickAccount,
  triggerClassName = '',
  align = 'right',        // 'left' | 'right'
}) => {
  const [activeTab, setActiveTab] = useState('lal');
  const triggerRef = useRef(null);
  const platformId = platform?.id || 'meta';
  const platformName = platform?.name || 'Meta';
  const isAuthed = !!authStatus?.[platformId];
  const ConnectIcon = platformId === 'tiktok' ? Smartphone : Facebook;
  const total = (lalSelected?.length || 0) + (customSelected?.length || 0);
  return (
    <>
      <div ref={triggerRef} onClick={onToggle}
        className={`bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full ${triggerClassName}`}>
        <span className="text-xs font-medium text-gray-500">{triggerLabel}</span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Users size={16} className="text-primary-500 shrink-0" />
            <span className={`text-sm font-bold truncate ${total > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
              {total > 0 ? `已选 ${total} 项` : '不限制'}
            </span>
          </div>
          <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <Popover
        open={!!open}
        anchorRef={triggerRef}
        placement={align === 'left' ? 'bottom-start' : 'bottom-end'}
        onClose={() => onToggle?.()}
        className="w-[320px] bg-white rounded-base shadow-xl border border-gray-100 overflow-hidden"
      >
        {!isAuthed ? (
            <div className="p-4 space-y-3 text-center">
              <p className="text-xs font-medium text-gray-500">需要连接 {platformName} 以加载受众</p>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  // 1) 触发授权（父级 handleAuthorizeChannel 是 async）
                  await onAuthorize?.(platformId);
                  // 2) 授权完成后立刻引导用户选广告账户（省去用户再次点击的额外步骤）
                  if (!selectedAccount) onPickAccount?.();
                }}
                disabled={isAuthLoading}
                className="w-full py-2.5 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAuthLoading ? <Loader2 size={14} className="animate-spin" /> : <ConnectIcon size={14} />}
                {isAuthLoading ? '连接中...' : `连接 ${platformName}`}
              </button>
            </div>
          ) : !selectedAccount ? (
            <div className="p-4 space-y-3 text-center">
              <p className="text-xs font-medium text-gray-500">请先选择广告账户</p>
              <button
                onClick={(e) => { e.stopPropagation(); onPickAccount?.(); }}
                className="w-full py-2.5 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
              >
                <Briefcase size={14} /> 选择广告账户
              </button>
            </div>
          ) : (
            <>
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                {[
                  { id: 'lal',    label: 'Lookalike', count: lalSelected.length },
                  { id: 'custom', label: 'Custom',    count: customSelected.length },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${activeTab === t.id ? 'text-primary-600 border-b-2 border-primary-500 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    {t.label}
                    {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.id ? 'bg-primary-50' : 'bg-gray-200/60'}`}>{t.count}</span>}
                  </button>
                ))}
              </div>
              <div className="p-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                {activeTab === 'lal'
                  ? PRESET_LAL_AUDIENCES.map(la => {
                      const sel = lalSelected.includes(la.id);
                      return (
                        <button key={la.id} onClick={() => onToggleLal?.(la.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-base text-xs font-medium transition-all ${sel ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                          <span className="truncate">{la.name}</span>
                          {sel && <Check size={12} className="shrink-0" />}
                        </button>
                      );
                    })
                  : PRESET_CUSTOM_AUDIENCES.map(ca => {
                      const sel = customSelected.includes(ca.id);
                      return (
                        <button key={ca.id} onClick={() => onToggleCustom?.(ca.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-base text-xs font-medium transition-all ${sel ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                          <span className="truncate">{ca.name}</span>
                          {sel && <Check size={12} className="shrink-0" />}
                        </button>
                      );
                    })}
              </div>
            </>
          )}
      </Popover>
    </>
  );
};

const ADSET_GOALS_MAPPING = {
  awareness_engagement: [
    { value: 'impressions', label: 'Impressions' },
    { value: 'post_engagement', label: 'Post engagement' },
    { value: 'conversations', label: 'Conversations' }
  ],
  traffic: [
    { value: 'impressions', label: 'Impressions' },
    { value: 'link_clicks', label: 'Link clicks' },
    { value: 'page_views', label: 'Page views' }
  ],
  leads: [
    { value: 'leads_landing_page', label: 'Leads within landing-page', needsEvent: true },
    { value: 'instant_form_leads', label: 'Instant form leads' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'calls', label: 'Calls' }
  ],
  sales_conversions: [
    { value: 'in_web_actions', label: 'In-web actions', needsEvent: true }
  ],
  app_promotion: [
    { value: 'installs', label: 'Installs' },
    { value: 'in_app_actions', label: 'In-app actions', needsEvent: true }
  ]
};

const STANDARD_EVENTS = [
  'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', 
  'CompleteRegistration', 'SubmitApplication', 'Contact', 
  'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
  'Donate', 'FindLocation', 'Schedule', 'StartTrial'
];

const ALL_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' }
];

const ALL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ms', name: 'Malay' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' }
];

const COUNTRY_LANGUAGE_MAPPING = {
  US: ['en'],
  GB: ['en'],
  CA: ['en', 'fr'],
  AU: ['en'],
  DE: ['de'],
  FR: ['fr'],
  JP: ['ja'],
  SG: ['en', 'zh'],
  BR: ['pt'],
  IN: ['en', 'hi']
};

// AI Recommendation mock values
const AI_RECOMMENDED = {
  platform: PLATFORMS[0], // Meta
  objective: 'sales_conversions',
  adsetGoal: 'in_web_actions',
  event: 'Purchase',
  locations: [{ code: 'US', name: 'United States' }]
};

const PHONE_COUNTRY_CODES = [
  { code: '+1', country: 'United States', iso: 'us', digits: 10 },
  { code: '+86', country: 'China', iso: 'cn', digits: 11 },
  { code: '+44', country: 'United Kingdom', iso: 'uk', digits: 10 },
  { code: '+49', country: 'Germany', iso: 'de', digits: 11 },
  { code: '+33', country: 'France', iso: 'fr', digits: 9 },
  { code: '+81', country: 'Japan', iso: 'jp', digits: 10 },
  { code: '+82', country: 'South Korea', iso: 'kr', digits: 10 },
  { code: '+61', country: 'Australia', iso: 'au', digits: 9 },
  { code: '+65', country: 'Singapore', iso: 'sg', digits: 8 },
  { code: '+91', country: 'India', iso: 'in', digits: 10 },
  { code: '+55', country: 'Brazil', iso: 'br', digits: 11 },
  { code: '+52', country: 'Mexico', iso: 'mx', digits: 10 },
  { code: '+971', country: 'United Arab Emirates', iso: 'ae', digits: 9 }
];

const validatePhone = (phone, countryCode) => {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return '请输入有效的电话号码（7-15位数字）';
  const country = PHONE_COUNTRY_CODES.find(c => c.code === countryCode);
  if (country && digitsOnly.length !== country.digits) {
    return `${country.country} 号码需要 ${country.digits} 位数字`;
  }
  return '';
};

// Module-level flag: survives SPA navigation, resets on browser refresh
let _hasGeneratedOnce = false;

// Stepper — column layout (label top, controls bottom) to align with dropdown cards
const Stepper = ({ label, value, onChange, min = 1, max = 99, step = 1, hint }) => {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <div className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500 truncate">{label}</span>
        {hint && <span className="text-[10px] font-medium text-gray-400 truncate">{hint}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={atMin}
          onClick={dec}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${atMin ? 'bg-gray-50 text-gray-200 cursor-not-allowed' : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-500'}`}
        >
          <span className="text-sm font-bold leading-none">−</span>
        </button>
        <span className="text-base font-bold tabular-nums flex-1 text-center text-gray-700">{value}</span>
        <button
          type="button"
          disabled={atMax}
          onClick={inc}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${atMax ? 'bg-gray-50 text-gray-200 cursor-not-allowed' : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-500'}`}
        >
          <span className="text-sm font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );
};

// Channel header card (compact, top-pinned). Holds:
//   1) Channel (platform) dropdown
//   2) Account dropdown — 4-state machine driven by platform + authStatus + selectedAccount
//   The account selection here is the GLOBAL source of truth for selectedAccount.

// Phase 2.J：入场两段式 — ① 选媒体 → ② 选广告账号；选完二者后此组件 unmount，由左侧 sticky ChannelHeaderCard 接管。
const PLATFORM_TAGLINES = {
  meta:   'Facebook · Instagram · 全球最大社交广告',
  tiktok: '短视频 · 年轻流量主场',
  google: 'Search · YouTube · GDN',
  bing:   'Microsoft · 海外搜索补充',
};
const ChannelPickerHero = ({
  platforms, onPick, platform,
  selectedAccount, onPickAccount,
  availableAccounts = [],
  authStatus, onAuthorize, isAuthLoading,
}) => {
  const stage = platform ? 2 : 1;
  const isAuthed = !!authStatus?.[platform?.id];
  return (
    <section className="px-2 md:px-4 pt-10 pb-16 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 顶部：标题 + 进度提示 */}
      <header className="flex flex-col items-center text-center mb-10">
        <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(112,51,245,0.25)] mb-5 ring-4 ring-primary-50">
          <Monitor className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Get your campaign started</h1>
        <p className="text-sm text-gray-500 font-medium">先选择投放媒体，再选择广告账号 · 进入页面即可开始配置广告结构</p>
        <div className="mt-6 inline-flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${stage >= 1 ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>{platform ? <Check className="w-3 h-3" strokeWidth={3} /> : '1'}</span>
            <span className={`font-semibold ${stage >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>媒体</span>
          </div>
          <span className={`block w-12 h-px ${platform ? 'bg-primary-500' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${selectedAccount ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' : stage === 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>{selectedAccount ? <Check className="w-3 h-3" strokeWidth={3} /> : '2'}</span>
            <span className={`font-semibold ${selectedAccount ? 'text-gray-900' : stage === 2 ? 'text-gray-700' : 'text-gray-400'}`}>广告账号</span>
          </div>
        </div>
      </header>

      {/* Step 1 — 媒体 */}
      <section className="space-y-4 mb-10">
        <div className="flex items-baseline justify-between px-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">投放媒体</h2>
            <span className="text-xs text-gray-400 font-medium">Media Channel</span>
          </div>
          <span className="text-xs text-gray-400">选择 1 个 · 决定后续可用目标与素材规范</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map(p => {
            const tagline = PLATFORM_TAGLINES[p.id] || '';
            const isPicked = platform?.id === p.id;
            if (p.disabled) {
              return (
                <div key={p.id} className="relative flex flex-col gap-3 p-5 bg-white rounded-xl border border-[#F0F0F0] opacity-50 cursor-not-allowed select-none">
                  <div className="w-11 h-11 rounded-lg bg-gray-50 border border-[#F0F0F0] flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={p.logo} alt="" className="w-7 h-7 object-contain grayscale" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{tagline}</p>
                  </div>
                  <span className="absolute top-3 right-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">COMING SOON</span>
                </div>
              );
            }
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPick(p)}
                className={`group relative flex flex-col gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  isPicked
                    ? 'bg-primary-50/40 border-primary-500 shadow-[-2px_2px_16px_rgba(112,51,245,0.18)]'
                    : platform
                      ? 'bg-white border-[#F0F0F0] opacity-60 hover:opacity-100 hover:border-primary-500/40'
                      : 'bg-white border-[#F0F0F0] hover:border-primary-500 hover:shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border transition-colors ${isPicked ? 'bg-white border-primary-500/30' : 'bg-gray-50 border-[#F0F0F0] group-hover:border-primary-500/30 group-hover:bg-white'}`}>
                    <img src={p.logo} alt="" className="w-7 h-7 object-contain" />
                  </div>
                  {isPicked
                    ? <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" strokeWidth={2.5} />
                    : <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-1" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate transition-colors ${isPicked ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-500'}`}>{p.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2 — 广告账号（媒体选定后动态出现） */}
      {platform && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-baseline justify-between px-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">广告账号</h2>
              <span className="text-xs text-gray-400 font-medium">Ad Account</span>
            </div>
            <span className="text-xs text-gray-400">
              {!isAuthed
                ? `请先连接 ${platform.name}`
                : availableAccounts.length > 0
                  ? `${availableAccounts.length} 个可用 · 来自 ${platform.name}`
                  : '该平台暂无可用账号'}
            </span>
          </div>

          {!isAuthed ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
              <div className={`w-12 h-12 rounded-xl ${platform.id === 'tiktok' ? 'bg-gray-900' : 'bg-[#1877F2]'} text-white flex items-center justify-center mb-4`}>
                {platform.id === 'tiktok' ? <Smartphone size={24} /> : <Facebook size={24} />}
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">连接 {platform.name} 以加载账号列表</p>
              <p className="text-xs text-gray-500 mb-4">连接后会自动同步账号下的 Pixel / Audience / Catalog 等资源</p>
              <button
                type="button"
                disabled={isAuthLoading}
                onClick={() => onAuthorize?.(platform.id)}
                className={`inline-flex items-center gap-2 px-5 h-10 rounded-base text-sm font-semibold transition-all ${isAuthLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white shadow-md'}`}
              >
                {isAuthLoading ? <><Loader2 size={14} className="animate-spin" /> 连接中…</> : <>连接 {platform.name}</>}
              </button>
            </div>
          ) : availableAccounts.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-500">该平台暂无可用账号</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAccounts.map(acc => {
                const isPicked = selectedAccount?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => onPickAccount?.(acc)}
                    className={`group relative flex flex-col gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      isPicked
                        ? 'bg-primary-50/40 border-primary-500 shadow-[-2px_2px_16px_rgba(112,51,245,0.18)]'
                        : 'bg-white border-[#F0F0F0] hover:border-primary-500 hover:shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isPicked ? 'bg-primary-500 text-white shadow-md' : 'bg-primary-50 text-primary-500'}`}>
                        <Briefcase size={18} />
                      </div>
                      {isPicked
                        ? <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" strokeWidth={2.5} />
                        : <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-1" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate transition-colors ${isPicked ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-500'}`}>{acc.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-1 font-mono">{acc.id}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 底部辅助提示 */}
      <p className="text-xs text-gray-400 text-center mt-10 font-medium">
        {!platform
          ? '选择媒体后将解锁该平台的广告账号列表'
          : !selectedAccount
            ? '选择广告账号后即可进入广告结构配置'
            : '准备就绪，即将进入 Campaign 配置…'}
      </p>
    </section>
  );
};

const ChannelHeaderCard = ({
  platform, onChangePlatform,
  selectedAccount, onSelectAccount,
  availableAccounts,
  authStatus,
  onAuthorize, isAuthLoading,
  openDropdown, setOpenDropdown, dropdownRef,
  orientation = 'horizontal',
}) => {
  const isVertical = orientation === 'vertical';
  const platformTriggerRef = useRef(null);
  const accountTriggerRef = useRef(null);
  const accountState =
    !platform                          ? 'NO_PLATFORM' :
    !authStatus?.[platform.id]         ? 'NEED_AUTH'   :
    !selectedAccount                   ? 'NEED_PICK'   :
                                         'PICKED';

  const triggerDisabled = accountState === 'NO_PLATFORM';
  const handleTriggerClick = () => {
    if (triggerDisabled) return;
    setOpenDropdown(openDropdown === 'account' ? null : 'account');
  };

  // Confirm before changing platform (clears all downstream data)
  const handleChangePlatformWithConfirm = (p) => {
    if (platform && p.id !== platform.id) {
      const ok = window.confirm(`切换媒体渠道为 ${p.name} 后，已添加的所有信息（广告账号、产品、素材组、Adset 受众、Ads）将被清空，是否继续？`);
      if (!ok) return;
    }
    onChangePlatform(p);
  };
  // Confirm before switching account (resets account-bound assets)
  const handleSelectAccountWithConfirm = (acc) => {
    if (selectedAccount && selectedAccount.id !== acc.id) {
      const ok = window.confirm(`切换广告账号为 ${acc.name} 后，与账号强相关的资产（如 Catalog / Product Set / 已选 Ads 等）将重置清空，是否继续？`);
      if (!ok) return;
    }
    onSelectAccount(acc);
  };

  return (
    <div className={`bg-gray-900/95 text-white rounded-section shadow-xl border border-gray-800 backdrop-blur-md animate-in fade-in slide-in-from-top-2 ${
      isVertical ? 'p-5 flex flex-col gap-3' : 'px-8 py-5 flex items-center gap-6 flex-wrap'
    }`}>
      <div className={isVertical ? 'flex items-center gap-3' : 'flex items-center gap-3 shrink-0'}>
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shrink-0"><Monitor size={20} /></div>
        <div className={isVertical ? 'min-w-0' : 'min-w-[180px]'}>
          <h3 className="text-base font-semibold text-white">投放渠道媒体</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{isVertical ? '平台 · 账号' : '选择媒体平台与关联广告账号'}</p>
        </div>
      </div>
      {!isVertical && <div className="flex-1 min-w-[20px]" />}

      {/* Platform dropdown */}
      <div ref={platformTriggerRef} className={isVertical ? 'w-full' : 'shrink-0 min-w-[200px]'}>
        <div onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
          className="bg-gray-800 rounded-inner px-4 py-2.5 border border-gray-700 flex items-center justify-between gap-3 cursor-pointer hover:border-primary-500/50 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            {platform ? (
              <><img src={platform.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" /><span className="text-sm font-bold text-white truncate">{platform.name}</span></>
            ) : (<><Monitor size={16} className="text-primary-400 shrink-0" /><span className="text-sm font-bold text-gray-500">请选择渠道...</span></>)}
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform shrink-0 ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <Popover
        open={openDropdown === 'platform'}
        anchorRef={platformTriggerRef}
        placement="bottom-end"
        matchWidth
        onClose={() => setOpenDropdown(null)}
        className="bg-gray-900 rounded-base shadow-xl border border-gray-700 p-2 space-y-1 min-w-[200px]"
      >
        {PLATFORMS.map(p => (
          <div key={p.id} className="relative group">
            <button disabled={p.disabled}
              onClick={() => { if (!p.disabled) { handleChangePlatformWithConfirm(p); setOpenDropdown(null); } }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-base transition-all ${
                p.disabled ? 'opacity-40 cursor-not-allowed text-gray-500' : platform?.id === p.id ? 'bg-primary-500/15 text-primary-300' : 'hover:bg-gray-800 text-gray-200'}`}>
              <img src={p.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
              <span className="text-xs font-bold">{p.name}</span>
              {!p.disabled && platform?.id === p.id && <Check size={12} className="ml-auto" />}
            </button>
            {p.disabled && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded shadow-lg">COMING SOON</div>
              </div>
            )}
          </div>
        ))}
      </Popover>

      {/* Account dropdown — 4-state machine */}
      <div ref={accountTriggerRef} className={isVertical ? 'w-full' : 'shrink-0 min-w-[260px]'}>
        <div
          onClick={handleTriggerClick}
          className={`bg-gray-800 rounded-inner px-4 py-2.5 border border-gray-700 flex items-center justify-between gap-3 transition-all ${
            triggerDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-primary-500/50'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {accountState === 'NO_PLATFORM' && (
              <>
                <Briefcase size={16} className="text-gray-500 shrink-0" />
                <span className="text-sm font-bold text-gray-500 truncate">请先选择渠道...</span>
              </>
            )}
            {(accountState === 'NEED_AUTH' || accountState === 'NEED_PICK') && (
              <>
                <Briefcase size={16} className="text-primary-400 shrink-0" />
                <span className="text-sm font-bold text-gray-400 truncate">未选择 {platform.name} 账号（选填）</span>
              </>
            )}
            {accountState === 'PICKED' && (
              <>
                <Briefcase size={16} className="text-primary-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedAccount.name}</p>
                  <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{selectedAccount.id}</p>
                </div>
              </>
            )}
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform shrink-0 ${openDropdown === 'account' ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <Popover
        open={openDropdown === 'account' && !triggerDisabled}
        anchorRef={accountTriggerRef}
        placement="bottom-end"
        matchWidth
        onClose={() => setOpenDropdown(null)}
        className="bg-gray-900 rounded-base shadow-xl border border-gray-700 overflow-hidden min-w-[280px]"
      >
        {accountState === 'NEED_AUTH' ? (
          <div className="p-4 space-y-3">
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              使用 {platform?.name} 广告账户前，请先连接您的 {platform?.name} Ads 账号。
            </p>
            <button
              disabled={isAuthLoading}
              onClick={() => onAuthorize(platform.id)}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-base font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAuthLoading ? <Loader2 size={16} className="animate-spin" /> : (platform?.id === 'meta' ? <Facebook size={16} /> : <Smartphone size={16} />)}
              <span className="text-sm">{isAuthLoading ? '连接中...' : `Connect ${platform?.name} Ads`}</span>
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar">
            {availableAccounts.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-gray-400 font-medium">该渠道暂无可用账户</p>
              </div>
            ) : (
              availableAccounts.map(acc => {
                const isSelected = selectedAccount?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => { handleSelectAccountWithConfirm(acc); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-2.5 rounded-base transition-all flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-primary-500/15 text-primary-300' : 'hover:bg-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary-300' : 'text-white'}`}>{acc.name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{acc.id}</p>
                    </div>
                    {isSelected && <Check size={14} className="text-primary-300 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </Popover>
    </div>
  );
};


// 广告结构初始化设置卡 — 投放目标 + 广告结构数量 + Ad Format + 版位 + 每日预算 + 高级设置 collapsible
// ─────────────────────────────────────────────────────────────────────────────
const _genId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

const BulkLaunchTool = ({ onPageChange, onPublishSuccess }) => {
  const isLgUp = useMediaQuery('(min-width: 1024px)');
  const [selectedProducts, setSelectedProducts] = useState([]);
  // Source of truth: each product has 1+ creative groups, each with editable name + ads
  const [productCreativeGroupsMap, setProductCreativeGroupsMap] = useState({});
  // Phase 2.M：素材组级 ad copy 配置
  // shape: { [productId]: { [groupId]: { titles?: string[], bodies?: string[], ad_text?: string, link_url, call_to_action_type } } }
  const [creativeGroupCopyMap, setCreativeGroupCopyMap] = useState({});
  // CATALOG 系列级文案（无素材组场景）：每 catalog × product_set 一份独立 AdCopy
  // shape: { [catalogId]: { [productSetId]: AdCopy } }
  const [catalogCampaignCopyMap, setCatalogCampaignCopyMap] = useState({});
  // Derived flat map for downstream consumers (CampaignPlanView, preview, publish)
  const productCreativesMap = useMemo(() => {
    const out = {};
    Object.entries(productCreativeGroupsMap).forEach(([pid, groups]) => {
      out[pid] = (groups || []).flatMap(g => g.ads || []);
    });
    return out;
  }, [productCreativeGroupsMap]);
  // 全部素材组按产品 → 组的顺序拍平 — 用于「按素材组顺序」应用方式下逐组对应文案
  const allCreativeGroupsForCopy = useMemo(() => {
    const result = [];
    selectedProducts.forEach(p => {
      (productCreativeGroupsMap[p.id] || []).forEach(g => {
        result.push({
          key: `${p.id}::${g.id}`,
          productId: p.id,
          productName: p.name,
          groupId: g.id,
          groupName: g.name,
        });
      });
    });
    return result;
  }, [selectedProducts, productCreativeGroupsMap]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedProductSet, setSelectedProductSet] = useState('All Products');
  // Phase 2.G：多组目录-系列组合（仅 CATALOG 模式使用）
  // [{ catalog_id, catalog_name, product_set_ids: [], product_set_names: [] }, ...]
  const [catalogCombos, setCatalogCombos] = useState([]);
  // 派生兼容：取首组同步到旧 state，让 CampaignPlanView/CampaignPreviewView 等不改动
  useEffect(() => {
    const first = catalogCombos[0];
    if (first?.catalog_id) {
      setSelectedCatalog({ id: first.catalog_id, name: first.catalog_name, productCount: first.productCount });
      setSelectedProductSet(first.product_set_names?.[0] || 'All Products');
    }
  }, [catalogCombos]);
  const [adsetCatalogMap, setAdsetCatalogMap] = useState({}); // { [adsetIdx]: catalog | null }
  const [selectedAccount, setSelectedAccount] = useState(() =>
    _hasGeneratedOnce ? MOCK_ACCOUNTS[0] : null
  );
  const [authStatus, setAuthStatus] = useState(() =>
    _hasGeneratedOnce
      ? { shopify: false, meta: true, google: false, tiktok: false }
      : { shopify: false, meta: false, google: false, tiktok: false }
  );
  const [channelAuthLoading, setChannelAuthLoading] = useState(false);
  const handleAuthorizeChannel = async (platformId) => {
    setChannelAuthLoading(true);
    try {
      await authorizePlatform(platformId);
      setAuthStatus(prev => ({ ...prev, [platformId]: true }));
    } finally {
      setChannelAuthLoading(false);
    }
  };
  const [productReportsMap, setProductReportsMap] = useState({});
  const [productAnalyses, setProductAnalyses] = useState({});

  const [campaignType, setCampaignType] = useState('PRODUCT');

  const [lpType, setLpType] = useState('PRODUCT');
  const [lpTemplateUrl, setLpTemplateUrl] = useState('https://luminaire-style.com/collections/{{product_name}}');
  const [productLpUtm, setProductLpUtm] = useState('utm_source=meta&utm_medium=paid&utm_campaign=ai_batch_{{product_id}}');
  
  const [campaignNameTemplate, setCampaignNameTemplate] = useState('{Brand}-{location}-{date}');
  const [adsetNameTemplate, setAdsetNameTemplate] = useState('{location}-{audience_type}-{creative_type}-{date}');
  const [adNameTemplate, setAdNameTemplate] = useState('{Brand}-{creative_type}-{number}-{date}');

  const [copyStrategy, setCopyStrategy] = useState('AI_CUSTOM');
  // 每个文案组现在持有可选的多条标题 / 正文：
  //   - Meta：每组最多 5 条标题 + 5 条正文，组数无上限
  //   - TikTok：每组锁死 1 条标题 + 1 条正文（由 platform useEffect 强制裁剪），组数无上限
  const [unifiedCopyGroups, setUnifiedCopyGroups] = useState([{
    id: _genId(),
    headlines: ['Limited Time Offer: Quality You Can Trust'],
    bodies: ['Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.'],
  }]);
  const [unifiedCopyApplyMode, setUnifiedCopyApplyMode] = useState('AI_MATCH');
  // 「按素材组顺序」应用方式专用的 per-素材组文案覆写：key = `${productId}::${groupId}`
  // shape: { [key]: { headlines: string[], bodies: string[] } }
  // 与 unifiedCopyGroups 互独立，切换 AI_MATCH ↔ SEQUENTIAL 时彼此数据不丢
  const [creativeGroupCopyOverrides, setCreativeGroupCopyOverrides] = useState({});

  // 排期：直接展示开始/结束时间，无需 type 切换（结束时间留空 = 不限期）
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedLocations, setSelectedLocations] = useState(() =>
    _hasGeneratedOnce ? [{ code: 'US', name: 'United States' }] : []
  );
  const [platform, setPlatform] = useState(() =>
    _hasGeneratedOnce ? PLATFORMS[0] : null
  );
  const [objective, setObjective] = useState(() =>
    _hasGeneratedOnce ? 'sales_conversions' : ''
  );
  const [adsetGoal, setAdsetGoal] = useState(() =>
    _hasGeneratedOnce ? 'in_web_actions' : ''
  );
  const [event, setEvent] = useState(() =>
    _hasGeneratedOnce ? 'Purchase' : ''
  );

  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    _hasGeneratedOnce ? { code: 'en', name: 'English' } : null
  );
  const [languageSearch, setLanguageSearch] = useState('');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  // Phase 2.I：onboarding 阶段已移除（直接进 Card 2.6 由 CampaignSection 填 objective），删除 objectiveStage

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // TikTok 下每个文案组只允许 1 条标题 + 1 条正文（组数本身不再强制裁剪）。
  // 切到 TikTok 时把每组的 headlines / bodies 各自截断到 1 条。
  useEffect(() => {
    if (platform?.id !== 'tiktok') return;
    setUnifiedCopyGroups(prev => prev.map(g => {
      const firstHeadline = (g.headlines && g.headlines[0]) ?? '';
      const firstBody = (g.bodies && g.bodies[0]) ?? '';
      const sameHeadlines = g.headlines && g.headlines.length === 1 && g.headlines[0] === firstHeadline;
      const sameBodies = g.bodies && g.bodies.length === 1 && g.bodies[0] === firstBody;
      if (sameHeadlines && sameBodies) return g;
      return { ...g, headlines: [firstHeadline], bodies: [firstBody] };
    }));
  }, [platform?.id]);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [showMetaAccountPicker, setShowMetaAccountPicker] = useState(false);
  const campaignListLoading = useDropdownLoading('campaigns', authStatus?.meta);
  const accountSwitchLoading = useDropdownLoading('accountSwitch', authStatus?.meta);
  const accountPickLoading = useDropdownLoading('accountPick', authStatus?.meta);
  useEffect(() => { if (showCampaignModal && selectedAccount) campaignListLoading.triggerLoad(); }, [showCampaignModal]);
  useEffect(() => { if (showAccountSelector) accountSwitchLoading.triggerLoad(); }, [showAccountSelector]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(_hasGeneratedOnce);

  const [structure, setStructure] = useState({
    strategy: 'BY_CREATIVE',   // default 策略：每素材组 1 adset
    numCampaigns: 1,
    numAdsetsPerProduct: 1,    // active when strategy = PER_PRODUCT
    numAdsets: 3,              // active when strategy = ALL_PRODUCTS_PER_SET
    adsPerSet: 3,              // active when strategy = BY_CREATIVE
    numAdsPerAdset: 3,         // independent: how many ads per adset (UI display)
  });
  // 当从无产品 → 有产品（首次添加）时，按产品数同步默认 Adset 数（旧逻辑）。
  // 用 ref 锁初次同步，避免覆盖用户手动修改。
  const productAdsetSyncRef = useRef(false);
  useEffect(() => {
    const count = selectedProducts.length;
    if (count === 0) {
      productAdsetSyncRef.current = false;
      return;
    }
    if (productAdsetSyncRef.current) return;
    productAdsetSyncRef.current = true;
    setStructure(prev => ({
      ...prev,
      numAdsets: count,         // ALL_PRODUCTS_PER_SET 默认 = 产品数
      adsPerSet: count,         // BY_CREATIVE 默认 = 产品数
    }));
  }, [selectedProducts.length]);
  const [placementMode, setPlacementMode] = useState('AUTO');
  const [manualPlacements, setManualPlacements] = useState({
    meta: ['facebook_feed', 'instagram_feed', 'stories', 'reels'],
    tiktok: ['tiktok', 'pangle', 'global_app_bundle'],
  });
  const [adsetCreativeSelections, setAdsetCreativeSelections] = useState({});
  const [numByCreativeAdsets, setNumByCreativeAdsets] = useState(1);
  // 受众策略：稀疏数组（用户未触动则保持 undefined，由 getAudienceTypes 通过 02 globals + platform 决定 fallback）
  // 每个 campaign 用 stripe = 100 槽位（即 flatIdx = cIdx*100 + aIdx），最多 10 campaigns × 100 adsets。
  const [adsetAudiences, setAdsetAudiences] = useState(() => Array(1000));
  const [adType, setAdType] = useState('FLEXIBLE');
  const [creativesPerAd, setCreativesPerAd] = useState(3);
  const [isCollabAd, setIsCollabAd] = useState(false);
  const [collabValue, setCollabValue] = useState('');
  const [adsetAudienceDetails, setAdsetAudienceDetails] = useState({});
  // TikTok + APP 投放 + sales 目标场景，激活 Catalog / Product Range 配置链路
  const isTikTokAppSales = platform?.id === 'tiktok' && campaignType === 'APP' && objective === 'sales_conversions';
  const [budgetType, setBudgetType] = useState('CBO');
  const [dailyBudget, setDailyBudget] = useState(50);
  // 竞价策略 / 竞价目标：bidStrategy 仅 Meta 用；bidAmount 全平台共用（数字字符串）
  const [bidStrategy, setBidStrategy] = useState('highest_volume');
  const [bidAmount, setBidAmount] = useState('');
  // 受众预设（全局选填）— 仅含包含/排除 4 个字段；非空时 adset 默认 audienceTypes 自动加入 'LAL'
  const [globalAdsetLalInclude, setGlobalAdsetLalInclude] = useState([]);
  const [globalAdsetCustomInclude, setGlobalAdsetCustomInclude] = useState([]);
  const [globalAdsetLalExclude, setGlobalAdsetLalExclude] = useState([]);
  const [globalAdsetCustomExclude, setGlobalAdsetCustomExclude] = useState([]);
  // Phase 2.F: 广告结构初始化模式（manual=三级表单 / import=直接架构图）
  const [initMode, setInitMode] = useState(null);

  // Phase 2.H: 用户是否已确认应用结构（控制 Card 3 暴露）
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedStructures, setSavedStructures] = useState(() => listSavedStructures());
  // Phase 2.N: 发布二次确认
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const refreshSavedStructures = () => setSavedStructures(listSavedStructures());

  const handleSaveAndContinue = (name) => {
    saveStructure({
      name,
      channel: platform?.id,
      campaignType,
      formData,
      catalogCombos,
    });
    refreshSavedStructures();
    setShowSaveModal(false);
    setHasConfirmed(true);
  };

  const handleApplySaved = (item) => {
    applySavedStructure(item, {
      setPlatform, setCampaignType, setFormData, setCatalogCombos,
      platforms: PLATFORMS,
    });
    setHasConfirmed(true);
  };
  const handleDeleteSaved = (id) => {
    deleteSavedStructure(id);
    refreshSavedStructures();
  };

  // Phase 2.P：找到首个未填 / 错误字段，scroll + 红框呼吸闪烁提示。返回是否阻断（true=有错应阻断）
  const focusFirstFieldError = () => {
    const errs = validation?.errors || {};
    let target = null;
    for (const lvl of ['campaign', 'adset', 'ad']) {
      const fields = errs[lvl] || {};
      const firstName = Object.keys(fields)[0];
      if (firstName) { target = { level: lvl, name: firstName }; break; }
    }
    if (!target) return false;

    // 1) 让 GroupedFieldsRenderer 监听到事件后展开包含该字段的 group（若已折叠）
    window.dispatchEvent(new CustomEvent('bulk-launch:focus-field', { detail: target }));

    // 2) 等下一帧 group 展开 + DOM 渲染完，再 scroll + 加动画
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const sel = `[data-field-name="${target.level}::${target.name}"]`;
      const el = document.querySelector(sel);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 移除可能残留的高亮 → 重新触发动画（即便相邻两次错误是同一个字段）
      el.classList.remove('field-error-flash');
      // 强制 reflow，让浏览器重启动画
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
      el.classList.add('field-error-flash');
      window.setTimeout(() => {
        el.classList.remove('field-error-flash');
      }, 3000); // ~0.7s × 4 次 = 2.8s，略长留 0.2s 缓冲
    }));
    return true;
  };

  // Phase 2.N：发布确认 — 把 UI 选择的 PAUSED/ACTIVE 映射到渠道字段并写入三级 formData，再触发父级 onPublishSuccess
  const handlePublishConfirm = (statusUi) => {
    const fieldName = statusFieldName(platform?.id);
    const sdkStatus = publishStatusToSdk(platform?.id, statusUi);
    setFormData(prev => ({
      campaign: { ...(prev.campaign || {}), [fieldName]: sdkStatus },
      adset:    { ...(prev.adset    || {}), [fieldName]: sdkStatus },
      ad:       { ...(prev.ad       || {}), [fieldName]: sdkStatus },
    }));
    setShowPublishConfirm(false);
    onPublishSuccess?.({ channel: platform?.id, status: sdkStatus });
  };

  // Phase 2.A: 三级 SDK 字段统一 formData。
  const [formData, setFormData] = useState({ campaign: {}, adset: {}, ad: {} });
  const handleSectionFieldChange = (level) => (name, value) => {
    setFormData(prev => {
      const next = { ...prev, [level]: { ...(prev[level] || {}), [name]: value } };
      // Phase 2.C：上游字段（objective / destination_type / ad_format / placements 等）变更后，
      // 立即 prune 失效字段值（清理隐藏字段的旧值与不在选项内的旧值）
      if (['objective', 'objective_type', 'special_ad_categories', 'buying_type',
           'budget_optimize_on', 'campaign_product_source',
           'destination_type', 'optimization_goal', 'bid_strategy', 'bid_type',
           'budget_mode', 'placement_type', 'placements', 'is_dynamic_creative',
           'publisher_platforms', 'operating_systems', 'promotion_type',
           'ad_format', 'call_to_action_type', 'call_to_action', 'identity_type',
          ].includes(name)) {
        return pruneAllLevels(next, { getDefs: (lvl) => getFieldDefs(platform?.id, lvl) });
      }
      return next;
    });
  };
  // 切渠道时整体清理（platform 变更）+ 补默认值兜底（K3）
  useEffect(() => {
    if (!platform?.id) return;
    setFormData(prev => {
      const pruned = pruneAllLevels(prev, { getDefs: (lvl) => getFieldDefs(platform.id, lvl) });
      // 补默认值
      const next = { ...pruned };
      ['campaign', 'adset', 'ad'].forEach(lvl => {
        const defaults = getDefaultLevelValues(platform.id, lvl);
        next[lvl] = { ...defaults, ...(pruned[lvl] || {}) };
      });
      return next;
    });
  }, [platform?.id]);

  // Phase 2.G：派生 campaign / adset plan（catalogCombos 来自 ProductSelector / _app_list 来自 AdSet）
  const campaignPlan = useMemo(() => {
    const isCatalog = campaignType === 'CATALOG' || formData?.ad?.ad_format === 'DPA';
    const isApp = (platform?.id === 'meta' && formData?.adset?.destination_type === 'APP')
      || (platform?.id === 'tiktok' && formData?.campaign?.objective_type === 'APP_PROMOTION');
    return derivePlan({ catalogCombos, formData, channel: platform?.id, isCatalog, isApp });
  }, [
    catalogCombos, campaignType, platform?.id,
    formData?.ad?.ad_format,
    formData?.adset?.destination_type, formData?.adset?._app_list,
    formData?.campaign?.objective_type,
  ]);

  // 派生 structure（驱动 CampaignPlanView 倍增）
  useEffect(() => {
    if (initMode !== 'manual') return;
    const derived = deriveStructureFromPlan(campaignPlan);
    if (derived) setStructure(s => ({ ...s, ...derived }));
  }, [initMode, campaignPlan]);

  // 「广告结构策略」当前唯一选项 default：
  //   product → 每素材组 1 adset（BY_CREATIVE）
  //   catalog → 每 catalog 1 campaign / 每 product_set 1 adset（PER_PRODUCT）— 由 derivePlan 显式枚举
  //   app     → 每 app 1 campaign / 每素材组 1 adset（BY_CREATIVE）
  const planMode = (() => {
    if (campaignType === 'CATALOG' || formData?.ad?.ad_format === 'DPA') return 'catalog';
    const isApp = (platform?.id === 'meta' && formData?.adset?.destination_type === 'APP')
      || (platform?.id === 'tiktok' && formData?.campaign?.objective_type === 'APP_PROMOTION');
    return isApp ? 'app' : 'product';
  })();

  // ref：用于点击"预览发布计划"前命令式校验架构图，未填素材组的 adset 由 CampaignPlanView 自行高亮 + 滚动定位
  const campaignPlanRef = useRef(null);

  // 架构图 state 提升至 BulkLaunchTool 层，避免 view 切换 (config↔preview) 时 CampaignPlanView 卸载丢失：
  //   adsetAds：每 adset 已分配的 ads 列表（含拖入素材组拆分后的结果）
  //   campaignConfigs：每 campaign 的 locations / language / objective / budget 等（legacy 命名 — 用于架构图节点摘要展示）
  //   nodeOverrides：Phase 2.J — 每个节点的 SDK 字段 sparse override（与 campaignConfigs 平级；继承 vs 覆盖语义）
  const [adsetAds, setAdsetAds] = useState({});
  const [campaignConfigs, setCampaignConfigs] = useState({});
  const [nodeOverrides, setNodeOverrides] = useState({ campaign: {}, adset: {}, ad: {} });

  // Phase 2.J helper：写一个 SDK 字段到 nodeOverrides
  const setNodeOverride = (level, idx, fieldName, value) => {
    setNodeOverrides(prev => ({
      ...prev,
      [level]: {
        ...(prev[level] || {}),
        [idx]: {
          ...(prev[level]?.[idx] || {}),
          [fieldName]: value,
        },
      },
    }));
  };
  // 清除某节点某字段的 override → 恢复继承
  const clearNodeOverride = (level, idx, fieldName) => {
    setNodeOverrides(prev => {
      const lvl = { ...(prev[level] || {}) };
      const node = { ...(lvl[idx] || {}) };
      delete node[fieldName];
      if (Object.keys(node).length === 0) {
        delete lvl[idx];
      } else {
        lvl[idx] = node;
      }
      return { ...prev, [level]: lvl };
    });
  };

  // === TikTok 媒体渠道差异化纠偏 ===
  // TikTok 仅支持 sales_conversions / app_promotion 两类 objective；切到 TikTok
  // 时若用户已选择了不在白名单的 objective，自动降级到 sales_conversions。
  // 注：objective 为空时不要自动填——onboarding 已不再门控 objective，用户后续由 CampaignSection 填写。
  useEffect(() => {
    if (platform?.id !== 'tiktok') return;
    if (objective && !TIKTOK_ALLOWED_OBJECTIVES.has(objective)) {
      const nextObj = 'sales_conversions';
      const firstGoal = ADSET_GOALS_MAPPING[nextObj][0];
      setObjective(nextObj);
      setAdsetGoal(firstGoal?.value || '');
      setEvent(firstGoal?.needsEvent ? 'Purchase' : '');
    }
  }, [platform?.id]);

  // TikTok 不支持 Flexible Ad Format，强制为 SINGLE。
  useEffect(() => {
    if (platform?.id === 'tiktok' && adType !== 'SINGLE') {
      setAdType('SINGLE');
    }
  }, [platform?.id]);

  // TikTok 下不支持 Advantage+ 受众；从每个 adset 的策略数组里移除 ADV，
  // 移除后若变空则补 LAL。兼容旧 string 形态。
  useEffect(() => {
    if (platform?.id !== 'tiktok') return;
    setAdsetAudiences(prev => prev.map(raw => {
      const arr = Array.isArray(raw) ? raw : (raw ? [raw] : []);
      const filtered = arr.filter(x => x !== 'ADV');
      return filtered.length > 0 ? filtered : ['LAL'];
    }));
  }, [platform?.id]);

  // TikTok 下同样收敛架构图各 campaign 详情中已选的 objective。
  useEffect(() => {
    if (platform?.id !== 'tiktok') return;
    setCampaignConfigs(prev => {
      let mutated = false;
      const next = {};
      Object.entries(prev).forEach(([k, cfg]) => {
        if (cfg?.objective && !TIKTOK_ALLOWED_OBJECTIVES.has(cfg.objective)) {
          const nextObj = 'sales_conversions';
          const firstGoal = ADSET_GOALS_MAPPING[nextObj][0];
          next[k] = {
            ...cfg,
            objective: nextObj,
            adsetGoal: firstGoal?.value || '',
            event: firstGoal?.needsEvent ? 'Purchase' : '',
          };
          mutated = true;
        } else {
          next[k] = cfg;
        }
      });
      return mutated ? next : prev;
    });
  }, [platform?.id]);

  const selectedCampaign = useMemo(() =>
    MOCK_EXISTING_CAMPAIGNS.find(c => c.id === selectedCampaignId), 
  [selectedCampaignId]);

  const isMultiMode = selectedProducts.length > 1;

  const allAnalysesComplete = useMemo(() => {
    if (selectedProducts.length === 0) return false;
    return selectedProducts.every(p => productAnalyses[p.id]?.status === 'complete' || p.isFromHistory);
  }, [selectedProducts, productAnalyses]);

  const allProductsReady = useMemo(() => {
    if (campaignType === 'CATALOG') return analysisFinished;
    if (selectedProducts.length === 0) return false;
    return analysisFinished;
  }, [campaignType, selectedProducts, analysisFinished]);

  const isAnyProductMissingCreatives = useMemo(() => {
    if (campaignType === 'CATALOG') return false;
    if (selectedProducts.length === 0) return true;
    return selectedProducts.some(p => (productCreativesMap[p.id] || []).length === 0);
  }, [campaignType, selectedProducts, productCreativesMap]);

  useEffect(() => {
    if (selectedCampaign) {
      setBudgetType(selectedCampaign.budgetType);
      setDailyBudget(selectedCampaign.budget);
    } else {
      setBudgetType('CBO');
      setDailyBudget(50);
    }
  }, [selectedCampaign]);

  // Phase 2.B：用 formData 派生 sectionDefaults（legacy 命名），CampaignPlanView 与下游一切派生都基于此
  const derived = useMemo(
    () => deriveSectionDefaults(formData, platform?.id),
    [formData, platform]
  );

  const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === derived.objective);
  const availableGoals = ADSET_GOALS_MAPPING[derived.objective] || [];
  const currentGoalObj = availableGoals.find(g => g.value === derived.adsetGoal);

  // Phase 2.B：用 SDK schema 的 validateAllLevels 推导 isInitComplete。
  // platform 已选 + 三级所有可见必填字段都通过校验。
  const validation = useMemo(() => {
    if (!platform?.id) return { valid: false, errors: { campaign: {}, adset: {}, ad: {} } };
    return validateAllLevels(formData, {
      getDefs: (lvl) => getFieldDefs(platform.id, lvl),
    });
  }, [formData, platform]);
  const isInitComplete = !!platform?.id && validation.valid;
  const isTargetingComplete = isInitComplete;

  const detectedBrand = {
    name: 'Luminaire Vintage',
    logo: 'https://picsum.photos/seed/logo1/100/100',
    url: 'luminaire-style.com',
    goal: currentObjectiveObj?.label || '',
    country: selectedLocations[0]?.name || ''
  };

  // Ensure each selected product has at least one default creative group
  useEffect(() => {
    setProductCreativeGroupsMap(prev => {
      let changed = false;
      const next = { ...prev };
      selectedProducts.forEach(p => {
        if (!next[p.id] || next[p.id].length === 0) {
          next[p.id] = [{ id: _genId(), name: '素材组 1', ads: [] }];
          changed = true;
        }
      });
      // Drop entries for products that were removed
      Object.keys(next).forEach(pid => {
        if (!selectedProducts.some(p => p.id === pid)) {
          delete next[pid];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [selectedProducts]);

  const ensureProductGroups = (prev, productId) => {
    if (prev[productId] && prev[productId].length > 0) return prev[productId];
    return [{ id: _genId(), name: '素材组 1', ads: [] }];
  };

  const handleUpdateGroupAds = (productId, groupId, adsOrUpdater) => {
    setProductCreativeGroupsMap(prev => {
      const groups = ensureProductGroups(prev, productId);
      const nextGroups = groups.map(g => {
        if (g.id !== groupId) return g;
        const nextAds = typeof adsOrUpdater === 'function' ? adsOrUpdater(g.ads || []) : adsOrUpdater;
        return { ...g, ads: nextAds.map(c => ({ ...c, productId, groupId })) };
      });
      return { ...prev, [productId]: nextGroups };
    });
  };

  const handleAddProductGroup = (productId) => {
    setProductCreativeGroupsMap(prev => {
      const groups = ensureProductGroups(prev, productId);
      const nextGroups = [...groups, { id: _genId(), name: `素材组 ${groups.length + 1}`, ads: [] }];
      return { ...prev, [productId]: nextGroups };
    });
  };

  const handleRemoveProductGroup = (productId, groupId) => {
    setProductCreativeGroupsMap(prev => {
      const groups = ensureProductGroups(prev, productId);
      if (groups.length <= 1) return prev;
      return { ...prev, [productId]: groups.filter(g => g.id !== groupId) };
    });
  };

  const handleRenameProductGroup = (productId, groupId, name) => {
    setProductCreativeGroupsMap(prev => {
      const groups = ensureProductGroups(prev, productId);
      return {
        ...prev,
        [productId]: groups.map(g => (g.id === groupId ? { ...g, name } : g)),
      };
    });
  };

  // 多选 toggle：含 type 则移除（保底至少留 1 项），否则追加。
  // 首次操作 sparse undefined 槽位时，先按当前 02 globals + platform 物化默认，再 toggle。
  const handleToggleAudienceType = (index, type) => {
    setAdsetAudiences(prev => {
      const next = [...prev];
      const raw = next[index];
      let cur;
      if (Array.isArray(raw)) cur = [...raw];
      else if (typeof raw === 'string' && raw) cur = [raw];
      else {
        const isTikTokP = platform?.id === 'tiktok';
        const hasAudPreset = (globalAdsetLalInclude.length + globalAdsetCustomInclude.length
                            + globalAdsetLalExclude.length + globalAdsetCustomExclude.length) > 0;
        cur = isTikTokP ? ['LAL'] : (hasAudPreset ? ['ADV', 'LAL'] : ['ADV']);
      }
      const i = cur.indexOf(type);
      if (i >= 0) cur.splice(i, 1);
      else cur.push(type);
      if (cur.length === 0) cur.push(type === 'ADV' ? 'LAL' : 'ADV'); // 兜底
      next[index] = cur;
      return next;
    });
  };
  // 兼容旧 single-set API（被某些 AI 策略入口调用），转化为单元素数组
  const handleSetAudienceType = (index, type) => {
    setAdsetAudiences(prev => {
      const next = [...prev];
      next[index] = Array.isArray(type) ? type : [type];
      return next;
    });
  };

  const handleSaveAdsetAudienceDetails = (idx, details) => {
    setAdsetAudienceDetails(prev => ({ ...prev, [idx]: details }));
  };

  // 切换全局 Bid Strategy（仅 Meta 用）：清空全局 bidAmount 与所有 adset 级 bidAmount override，
  // 让其回落到新策略下的默认空值（用户需重新填写金额）。
  const handleChangeBidStrategy = (newStrategy) => {
    if (!newStrategy || newStrategy === bidStrategy) return;
    setBidStrategy(newStrategy);
    setBidAmount('');
    setAdsetAudienceDetails(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (v && v.bidAmount !== undefined) {
          const { bidAmount: _b, ...rest } = v;
          next[k] = rest;
        } else {
          next[k] = v;
        }
      });
      return next;
    });
  };

  // 切换全局 Campaign Objective：联动重置 conversion goal / event，并清掉所有 adset 的 per-adset override
  // （依据用户决策：objective 变更 → 所有 adset 的 conversion event 自动落到新 objective 下的第一个 goal/event）。
  const handleChangeObjective = (newObjective) => {
    if (!newObjective || newObjective === objective) return;
    const firstGoal = (ADSET_GOALS_MAPPING[newObjective] || [])[0];
    // 双写：保留 useState 给 ChannelHeaderCard 读，同时写入 formData 让 SDK Section / PlanView 联动
    setObjective(newObjective);
    setAdsetGoal(firstGoal?.value || '');
    setEvent(firstGoal?.needsEvent ? 'Purchase' : '');
    writeObjective(setFormData, platform?.id, newObjective);
    if (firstGoal) writeOptGoal(setFormData, platform?.id, firstGoal.value);
    if (firstGoal?.needsEvent) writeEvent(setFormData, platform?.id, 'Purchase');
    // 清空 adset 级别 conversion event override，使其回落到新全局默认
    setAdsetAudienceDetails(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (v && (v.adsetGoal !== undefined || v.event !== undefined)) {
          const { adsetGoal: _g, event: _e, ...rest } = v;
          next[k] = rest;
        } else {
          next[k] = v;
        }
      });
      return next;
    });
  };

  const handleApplyAiStrategy = (parsedConfig) => {
    // Structure is already set by CampaignPlanView via onStructureChange
    // Here we only handle audience assignment
    if (parsedConfig.audienceAssignment) {
      setAdsetAudiences(prev => {
        const next = [...prev];
        const perProduct = parsedConfig.numAdsetsPerProduct || 1;
        const productCount = selectedProducts.filter(p => (productCreativesMap[p.id] || []).length > 0).length;
        const totalAdsets = parsedConfig.strategy === 'PER_PRODUCT' ? productCount * perProduct : perProduct;
        if (parsedConfig.audienceAssignment === 'ALL_INT') {
          for (let i = 0; i < totalAdsets; i++) next[i] = 'INT';
        } else if (parsedConfig.audienceAssignment === 'ALL_LAL') {
          for (let i = 0; i < totalAdsets; i++) next[i] = 'LAL';
        } else if (parsedConfig.audienceAssignment === 'MIXED') {
          for (let i = 0; i < totalAdsets; i++) {
            next[i] = i < totalAdsets - 1 ? 'LAL' : 'INT';
          }
        }
        return next;
      });
    }
  };

  const handleQuickSchedule = (days) => {
    const pad = (n) => String(n).padStart(2, '0');
    const toLocal = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    setStartDate(toLocal(start));
    setEndDate(toLocal(end));
  };

  useEffect(() => {
    if (objective !== 'sales_conversions' && objective !== 'app_promotion') {
      setAdType('SINGLE');
    }
  }, [objective]);

  const handleStructureChange = (newStructure) => {
    if (newStructure.strategy !== 'BY_CREATIVE') {
      setAdsetCreativeSelections({});
      setNumByCreativeAdsets(1);
    }
    // 策略切换时一次性回填 Campaign 数量 / Adset 数量初始值（仅初始化，不维护后续关联性）：
    //   Product 测试  → campaigns=1, adsets=已添加产品数（兜底 1）
    //   Audience 测试 → campaigns=1, adsets=3
    //   Creative 测试 → campaigns=1, adsets=1
    const strategyChanged = newStructure.strategy && newStructure.strategy !== structure.strategy;
    let nextStructure = newStructure;
    if (strategyChanged) {
      const productCountSafe = Math.max(selectedProducts.length, 1);
      const STRATEGY_INIT = {
        PER_PRODUCT:          { numCampaigns: 1, numAdsets: productCountSafe },
        ALL_PRODUCTS_PER_SET: { numCampaigns: 1, numAdsets: 3 },
        BY_CREATIVE:          { numCampaigns: 1, numAdsets: 1 },
      };
      const init = STRATEGY_INIT[newStructure.strategy];
      if (init) nextStructure = { ...newStructure, ...init };
    }
    setStructure(nextStructure);
  };

  const handleSaveAdsetCreatives = (adsetIndex, selectedIds) => {
    setAdsetCreativeSelections(prev => ({
      ...prev,
      [adsetIndex]: new Set(selectedIds)
    }));
  };

  const handleAddByCreativeAdset = () => {
    setNumByCreativeAdsets(n => n + 1);
  };

  const adSetGroupsCount = useMemo(() => {
    if (structure.strategy === 'PER_PRODUCT') {
      const activeProducts = selectedProducts.filter(p => (productCreativesMap[p.id] || []).length > 0);
      return activeProducts.length * (structure.numAdsetsPerProduct || 1);
    } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
      return structure.numAdsets || 1;
    } else if (structure.strategy === 'BY_CREATIVE') {
      return numByCreativeAdsets;
    }
    return 0;
  }, [structure, selectedProducts, productCreativesMap, numByCreativeAdsets]);

  const estimatedTotalDaily = useMemo(() => {
    return budgetType === 'ABO' ? dailyBudget * adSetGroupsCount : dailyBudget;
  }, [budgetType, dailyBudget, adSetGroupsCount]);

  const toggleLocation = (country) => {
    const isSelected = selectedLocations.some(l => l.code === country.code);
    if (isSelected) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter(l => l.code !== country.code));
      }
    } else {
      setSelectedLocations([...selectedLocations, country]);
    }
  };

  useEffect(() => {
    const langCodes = new Set();
    selectedLocations.forEach(loc => {
      const codes = COUNTRY_LANGUAGE_MAPPING[loc.code] || [];
      codes.forEach(c => langCodes.add(c));
    });
    const firstCode = [...langCodes][0];
    if (firstCode) {
      const lang = ALL_LANGUAGES.find(l => l.code === firstCode);
      if (lang) setSelectedLanguage(lang);
    }
  }, [selectedLocations]);

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(locationSearch.toLowerCase()) || 
    c.code.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredLanguages = ALL_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const filteredEvents = STANDARD_EVENTS.filter(ev => 
    ev.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const CampaignSearchModal = () => {
    const zIndex = useZIndex(true);
    const [search, setSearch] = useState('');
    const [isMetaConnecting, setIsMetaConnecting] = useState(false);
    const filtered = MOCK_EXISTING_CAMPAIGNS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)
    );

    // 检查 Meta 平台是否已连接
    const isMetaConnected = authStatus.meta;

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
        style={{ zIndex }}
      >
        <div className="bg-white w-full max-w-xl rounded-section shadow-xl overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">选择已有投放系列</h3>
            <button onClick={() => setShowCampaignModal(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-300"><X size={24} /></button>
          </div>
          <div className="p-6 bg-gray-50/50 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" autoFocus placeholder="搜索系列名称或 ID..." 
                className="w-full pl-12 pr-4 h-9 bg-white border border-gray-200 rounded-base outline-none text-sm font-medium focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 no-scrollbar">
            {/* 本弹窗用于「为广告结构导入存量系列初始化配置」，不承担创建新系列入口 */}
            <div className="space-y-2">
              {!isMetaConnected ? (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setIsMetaConnecting(true);
                      setTimeout(() => {
                        setIsMetaConnecting(false);
                        setAuthStatus(prev => ({ ...prev, meta: true }));
                        accountPickLoading.triggerLoad();
                        setShowMetaAccountPicker(true);
                      }, 3000);
                    }}
                    disabled={isMetaConnecting}
                    className="w-full inline-flex items-center justify-center bg-primary-500 text-white py-4 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-70 disabled:cursor-not-allowed gap-3"
                  >
                    {isMetaConnecting ? <><Loader2 size={18} className="animate-spin" /> Connecting...</> : <><Facebook size={18} /> 立即连接 Meta 以加载系列</>}
                  </button>
                </div>
              ) : !selectedAccount ? (
                <div className="p-4">
                  <button 
                    onClick={() => {
                      setShowMetaAccountPicker(true);
                      setShowCampaignModal(false);
                    }}
                    className="w-full inline-flex items-center justify-center bg-primary-500 text-white py-4 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed gap-3"
                  >
                    <Briefcase size={18} /> 选择广告账户
                  </button>
                </div>
              ) : campaignListLoading.isLoading ? (
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin text-primary-500/70" />
                  <p className="text-xs font-medium text-gray-400 animate-pulse">Loading campaigns...</p>
                </div>
              ) : (
                filtered.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedCampaignId(c.id); setShowCampaignModal(false); }}
                    className="p-4 rounded-base hover:bg-primary-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs font-medium text-gray-400">ID: {c.id} • {c.budgetType}</p>
                    </div>
                    {selectedCampaignId === c.id && <Check size={18} className="text-primary-500" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Phase 2.J：左侧 sticky tab 渲染条件改为 platform + selectedAccount（不再依赖 objective）
  const channelHeaderShared = platform && selectedAccount ? (
    <ChannelHeaderCard
      platform={platform}
      onChangePlatform={(p) => {
        setPlatform(p);
        setSelectedAccount(null);
        setSelectedProducts([]);
        setProductCreativeGroupsMap({});
        setProductAnalyses({});
        setAnalysisFinished(false);
        setIsAnalyzing(false);
        setSelectedCatalog(null);
      }}
      selectedAccount={selectedAccount}
      onSelectAccount={setSelectedAccount}
      availableAccounts={platform ? (PLATFORM_ACCOUNTS[platform.id] || []) : []}
      authStatus={authStatus}
      onAuthorize={handleAuthorizeChannel}
      isAuthLoading={channelAuthLoading}
      openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} dropdownRef={dropdownRef}
    />
  ) : null;

  return (
    <div className="bg-gray-50/50 min-h-full">
      {/* 仅渲染一份 ChannelHeader：sm 顶部 sticky；lg+ 左侧 sidebar */}
      {channelHeaderShared && !isLgUp && (
        <div className="sticky top-0 w-full px-4 md:px-8 pt-4 animate-in slide-in-from-top-full duration-500" style={{ zIndex: Z_INDEX.HEADER }}>
          <div className="max-w-7xl mx-auto">
            {React.cloneElement(channelHeaderShared, { orientation: 'horizontal' })}
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 flex justify-center">
        <div className={`w-full ${channelHeaderShared && isLgUp ? 'max-w-7xl lg:max-w-[1680px] 2xl:max-w-[1880px] grid grid-cols-[280px_1fr] gap-6' : 'max-w-7xl'}`}>
          {channelHeaderShared && isLgUp && (
            <aside>
              <div className="sticky top-4">
                {React.cloneElement(channelHeaderShared, { orientation: 'vertical' })}
              </div>
            </aside>
          )}
          <div>

          {(
            (!platform || !selectedAccount) ? (
              // Phase 2.J：入场两段式 — 必选 媒体 + 广告账号
              <ChannelPickerHero
                platforms={PLATFORMS}
                onPick={(p) => {
                  if (platform && p.id !== platform.id) {
                    // 切媒体清空账号 + 下游
                    setSelectedAccount(null);
                    setSelectedProducts([]);
                    setProductCreativeGroupsMap({});
                    setProductAnalyses({});
                    setAnalysisFinished(false);
                    setIsAnalyzing(false);
                    setSelectedCatalog(null);
                  }
                  setPlatform(p);
                }}
                platform={platform}
                selectedAccount={selectedAccount}
                onPickAccount={setSelectedAccount}
                availableAccounts={platform ? (PLATFORM_ACCOUNTS[platform.id] || []) : []}
                authStatus={authStatus}
                onAuthorize={handleAuthorizeChannel}
                isAuthLoading={channelAuthLoading}
              />
            ) : (
            <div className="space-y-8 animate-fade-in pb-20">

              {/* Phase 2.J Card 1: 广告结构配置（移到投放产品之前；先骨架后内容；门控解除产品依赖） */}
              <div className="bg-gradient-to-b from-gray-50/40 to-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5 animate-in fade-in slide-in-from-top-4">
                {/* 模块标题区 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-md">
                      <Layers size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">广告结构配置</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        按所选媒体的 SDK 规范，按 <span className="font-medium text-gray-700">Campaign → AdSet → Ad</span> 三步配置。字段约束、必填、互斥、值域均已纳入实时校验。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    {platform?.id && (
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 font-semibold border border-primary-500/10">
                        {platform?.name} · {platform?.id === 'tiktok' ? 'v1.3' : 'v21'}
                      </span>
                    )}
                    <SavedStructuresPicker
                      items={savedStructures}
                      onApply={handleApplySaved}
                      onDelete={handleDeleteSaved}
                    />
                  </div>
                </div>

                {/* 模式选择：手动 / 导入 */}
                <InitializationModeSelector
                  value={initMode}
                  onChange={(m) => {
                    setInitMode(m);
                    if (m === 'import') {
                      setShowCampaignModal(true);
                    }
                  }}
                />

                {/* 导入模式：仅展示已选系列摘要 */}
                {initMode === 'import' && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    {selectedCampaign ? (
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                          <Database size={20} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">{selectedCampaign.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ID: <span className="font-mono">{selectedCampaign.id}</span> · {selectedCampaign.budgetType} ${selectedCampaign.budget}/天
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCampaignModal(true)}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-base transition-colors"
                        >
                          重新选择
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">尚未选择系列</p>
                        <button
                          type="button"
                          onClick={() => setShowCampaignModal(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-base bg-primary-50 hover:bg-primary-100 transition-colors"
                        >
                          <Database size={12} /> 选择已有系列
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 手动模式：三层 Step Card + 统一高级设置 + 状态条 */}
                {initMode === 'manual' && (<>
                <div>
                  <CampaignSection
                    channel={platform?.id || null}
                    rootFormData={formData}
                    onFieldChange={handleSectionFieldChange('campaign')}
                  />
                  <StepConnector />
                  <AdSetSection
                    channel={platform?.id || null}
                    rootFormData={formData}
                    onFieldChange={handleSectionFieldChange('adset')}
                  />
                  <StepConnector />
                  <AdSection
                    channel={platform?.id || null}
                    rootFormData={formData}
                    onFieldChange={handleSectionFieldChange('ad')}
                  />
                </div>

                {/* Phase 2.J：统一高级设置已拆分至各 Section 内部（SectionAdvancedFold） */}

                {/* 配置进度状态条 */}
                {platform?.id && (() => {
                  const flat = [];
                  ['campaign', 'adset', 'ad'].forEach(lvl => {
                    const errs = validation.errors[lvl] || {};
                    Object.entries(errs).forEach(([name, msg]) => {
                      flat.push({ level: lvl, name, msg });
                    });
                  });
                  const levelLabel = { campaign: '系列', adset: '广告组', ad: '广告' };
                  if (flat.length === 0) {
                    return (
                      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200/70">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                          <CheckCircle2 size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-emerald-800">广告结构配置已完成</p>
                          <p className="text-xs text-emerald-700/75 mt-0.5">下方添加投放产品，配置完成后查看 Campaign 结构预览 ↓</p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="flex items-start gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200/70">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <AlertCircle size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-800">还需补充 {flat.length} 项必填配置</p>
                        <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-700/85">
                          {flat.slice(0, 8).map((it, i) => (
                            <li key={i} className="truncate max-w-[280px] flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-amber-500/60 shrink-0" />
                              <span className="text-amber-600/70 font-medium">[{levelLabel[it.level]}]</span>
                              <span>{it.msg}</span>
                            </li>
                          ))}
                          {flat.length > 8 && <li className="text-amber-600/60">... 还有 {flat.length - 8} 项</li>}
                        </ul>
                      </div>
                    </div>
                  );
                })()}

                {/* Confirm Action Bar：始终显示在结构配置模块底部；点击其一才会显露下方"添加投放产品"模块
                    Phase 2.P：点击前先 focusFirstFieldError —— 有未填/错误字段则阻断并定位 */}
                <ConfirmActionBar
                  onSaveAndContinue={() => { if (focusFirstFieldError()) return; setShowSaveModal(true); }}
                  onUseOnce={() => { if (focusFirstFieldError()) return; setHasConfirmed(true); }}
                />
                </>)}
              </div>

              {/* Phase 2.J Card 2: Add Product （移到广告结构配置之后） — 仅在用户点击「保存策略 / 仅本次使用」之一后暴露 */}
              {((initMode === 'manual' && hasConfirmed) || (initMode === 'import' && !!selectedCampaignId)) && (
              <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><ShoppingBag size={20} /></div>
                   <h3 className="text-xl font-semibold text-gray-900">添加投放产品</h3>
                </div>
                <ProductSelector
                  platform={platform}
                  selectedProducts={selectedProducts}
                  onSelectProducts={setSelectedProducts}
                  productCreativeGroups={productCreativeGroupsMap}
                  onUpdateGroupAds={handleUpdateGroupAds}
                  onAddGroup={handleAddProductGroup}
                  onRemoveGroup={handleRemoveProductGroup}
                  onRenameGroup={handleRenameProductGroup}
                  // Phase 2.M：素材组级 ad copy
                  creativeGroupCopyMap={creativeGroupCopyMap}
                  onSaveGroupCopy={(productId, groupId, copy) => {
                    setCreativeGroupCopyMap(prev => ({
                      ...prev,
                      [productId]: { ...(prev[productId] || {}), [groupId]: copy },
                    }));
                  }}
                  authStatus={authStatus}
                  onAuthStatusChange={setAuthStatus}
                  onAnalysisStart={() => { setIsAnalyzing(true); setAnalysisFinished(false); }}
                  onAnalysisComplete={(reports) => {
                    setIsAnalyzing(false);
                    setAnalysisFinished(true);
                    setProductReportsMap(reports);
                  }}
                  onReset={() => {
                    setAnalysisFinished(false);
                    setIsAnalyzing(false);
                    setProductAnalyses({});
                    setIntOptions([]);
                  }}
                  hasGeneratedOnce={hasGeneratedOnce}
                  analysisFinished={analysisFinished}
                  isAnalyzing={isAnalyzing}
                  campaignType={campaignType}
                  onCampaignTypeChange={(type) => {
                    setCampaignType(type);
                    setAnalysisFinished(false);
                    setIsAnalyzing(false);
                    setProductAnalyses({});
                    setSelectedProducts([]);
                    if (type === 'CATALOG') {
                      setStructure(prev => ({ ...prev, strategy: 'ALL_PRODUCTS_PER_SET' }));
                    } else {
                      setStructure(prev => ({ ...prev, strategy: 'PER_PRODUCT' }));
                    }
                  }}
                  selectedAccount={selectedAccount}
                  onSelectAccount={setSelectedAccount}
                  productAnalyses={productAnalyses}
                  onProductAnalysesChange={setProductAnalyses}
                  onMetaAccountPick={() => { accountPickLoading.triggerLoad(); setShowMetaAccountPicker(true); }}
                  selectedCatalog={selectedCatalog}
                  onSelectCatalog={setSelectedCatalog}
                  selectedProductSet={selectedProductSet}
                  onSelectProductSet={setSelectedProductSet}
                  catalogCombos={catalogCombos}
                  onCatalogCombosChange={setCatalogCombos}
                  // CATALOG 系列级文案：每 product_set 一份；CatalogCombosField 内部 mount AdCopyEditor
                  catalogCampaignCopyMap={catalogCampaignCopyMap}
                  onSaveCatalogCopy={(catalogId, productSetId, copy) => {
                    setCatalogCampaignCopyMap(prev => ({
                      ...prev,
                      [catalogId]: { ...(prev[catalogId] || {}), [productSetId]: copy },
                    }));
                  }}
                  availableAccounts={platform ? (PLATFORM_ACCOUNTS[platform.id] || []) : []}
                />
              </div>
              )}

              {/* Reminder Component when creatives are missing */}
              {allProductsReady && isAnyProductMissingCreatives && campaignType !== 'CATALOG' && selectedProducts.length > 0 && (
                <div className="bg-white rounded-section p-16 adsgo-card-shadow flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4">
                  <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-200 mb-8">
                    <Plus size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">请先添加至少一个素材</h3>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed max-w-md">
                    点击上方产品的 “AI” 或 “上传” 按钮填充创意资产。完成后系统将自动开启 Campaign 架构生成模块。
                  </p>
                </div>
              )}


              {/* Phase 2.J：原 Card 2.6 已上移到 Card 2 之前 */}

              {/* Card 3: Strategy & Budget — manual 模式：必填完成 + 用户确认；import 模式：选了系列即可 */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG')
                && ((initMode === 'manual' && isInitComplete && hasConfirmed) || (initMode === 'import' && !!selectedCampaignId)) && (
                 <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-top-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><Layers size={20} /></div>
                       <h3 className="text-xl font-semibold text-gray-900">Campaign 结构预览</h3>
                    </div>
                    <CampaignPlanView
                      ref={campaignPlanRef}
                      platform={platform}
                      adsetAds={adsetAds} setAdsetAds={setAdsetAds}
                      campaignConfigs={campaignConfigs} setCampaignConfigs={setCampaignConfigs}
                      formData={formData}
                      nodeOverrides={nodeOverrides}
                      setNodeOverride={setNodeOverride}
                      clearNodeOverride={clearNodeOverride}
                      structure={structure} onStructureChange={handleStructureChange}
                      campaignType={campaignType}
                      plan={campaignPlan}
                      budgetType={derived.budgetType}
                      onBudgetTypeChange={(v) => writeBudgetType(setFormData, platform?.id, v)}
                      dailyBudget={derived.dailyBudget}
                      onBudgetChange={(v) => writeBudget(setFormData, platform?.id, derived.budgetType, v)}
                      adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                      onSetAudienceType={handleSetAudienceType}
                      adsetAudienceDetails={adsetAudienceDetails} onSaveAdsetAudienceDetails={handleSaveAdsetAudienceDetails}
                      adType={derived.adType}
                      onAdTypeChange={(v) => writeAdType(setFormData, platform?.id, v)}
                      objective={derived.objective}
                      selectedProducts={selectedProducts}
                      productCreativesMap={productCreativesMap}
                      productCreativeGroups={productCreativeGroupsMap}
                      sectionDefaults={derived}
                      targetingMeta={{
                        ALL_COUNTRIES,
                        ALL_LANGUAGES,
                        CAMPAIGN_OBJECTIVES: getAvailableObjectives(platform?.id),
                        ADSET_GOALS_MAPPING,
                        STANDARD_EVENTS,
                        COUNTRY_LANGUAGE_MAPPING,
                        BID_STRATEGIES,
                      }}
                      productAnalyses={productAnalyses}
                      allAnalysesComplete={allAnalysesComplete}
                      onApplyAiStrategy={handleApplyAiStrategy}
                      isExistingCampaign={!!selectedCampaignId}
                      selectedCampaign={selectedCampaign}
                      onSelectCampaign={() => setShowCampaignModal(true)}
                      selectedAccount={selectedAccount}
                      onSelectAccount={() => setShowMetaAccountPicker(true)}
                      authStatus={authStatus}
                      handleAuthorize={(platformId) => {
                        setAuthStatus(prev => ({ ...prev, [platformId]: true }));
                        if (platformId === 'meta' && !selectedAccount) {
                          accountPickLoading.triggerLoad();
                          setShowMetaAccountPicker(true);
                        }
                      }}
                      adsetCreativeSelections={adsetCreativeSelections}
                      numByCreativeAdsets={numByCreativeAdsets}
                      onSaveAdsetCreatives={handleSaveAdsetCreatives}
                      onAddByCreativeAdset={handleAddByCreativeAdset}
                      placementOptions={platform ? (PLATFORM_PLACEMENTS[platform.id] || []) : []}
                      defaultPlacements={platform ? (PLATFORM_PLACEMENTS[platform.id] || []).map(p => p.id) : []}
                      isTikTokAppSales={isTikTokAppSales}
                      globalCatalog={selectedCatalog}
                      catalogs={MOCK_CATALOGS}
                      adsetCatalogMap={adsetCatalogMap}
                      onSaveAdsetCatalog={(adsetIdx, catalog) => setAdsetCatalogMap(prev => {
                        const next = { ...prev };
                        if (catalog == null) delete next[adsetIdx];
                        else next[adsetIdx] = catalog;
                        return next;
                      })}
                      onAuthorizeChannel={handleAuthorizeChannel}
                      onOpenAccountPicker={() => { accountPickLoading.triggerLoad(); setShowMetaAccountPicker(true); }}
                      channelAuthLoading={channelAuthLoading}
                      planMode={planMode}
                      creativeGroupCopyMap={creativeGroupCopyMap}
                    />
                 </div>
              )}

              {/* Phase 2.N：发布入口 — 与 Campaign 结构预览同一可见门控 */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG')
                && ((initMode === 'manual' && isInitComplete && hasConfirmed)
                    || (initMode === 'import' && !!selectedCampaignId)) && (
                <div className="flex flex-col items-center pt-4">
                  <button
                    onClick={() => setShowPublishConfirm(true)}
                    className="group w-full max-w-2xl py-5 px-12 rounded-full font-bold text-lg flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 shadow-xl transition-all"
                  >
                    <Rocket size={22} className="mr-3" />
                    立即发布
                  </button>
                  {!validation.valid && (
                    <p className="text-[11px] text-amber-600 mt-2">⚠ 还有必填项未填，发布前请补全</p>
                  )}
                </div>
              )}

            </div>
            )
          )}

          </div>
        </div>
      </div>

      {showCampaignModal && <CampaignSearchModal />}
      
      {showAccountSelector && <AccountSelectorModal selectedAccount={selectedAccount} onSelect={setSelectedAccount} onClose={() => setShowAccountSelector(false)} isLoading={accountSwitchLoading.isLoading} />}

      {showMetaAccountPicker && <MetaAccountPickerModal selectedAccount={selectedAccount} onSelect={(acc) => { setSelectedAccount(acc); setShowMetaAccountPicker(false); }} onClose={() => setShowMetaAccountPicker(false)} isLoading={accountPickLoading.isLoading} />}

      {/* Phase 2.H 任务 1：保存广告结构模板 */}
      <SaveStructureModal
        open={showSaveModal}
        defaultName={`${platform?.name || ''} ${campaignType} ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`}
        onCancel={() => setShowSaveModal(false)}
        onConfirm={handleSaveAndContinue}
      />

      {/* Phase 2.N：发布二次确认 — 状态选择 + 校验提示 */}
      <PublishConfirmModal
        open={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        onConfirm={handlePublishConfirm}
        channel={platform?.id || 'meta'}
        channelName={platform?.name || 'Meta'}
        counts={{
          campaigns: Math.max(structure.numCampaigns || 1, 1),
          adsets: Object.keys(adsetAds || {}).length,
          ads: Object.values(adsetAds || {}).reduce((sum, list) => sum + (list?.length || 0), 0),
        }}
        errorCount={
          ['campaign', 'adset', 'ad'].reduce(
            (sum, lvl) => sum + Object.keys(validation.errors[lvl] || {}).length,
            0
          )
        }
      />

    </div>
  );
};

const AccountSelectorModal = ({ selectedAccount, onSelect, onClose, isLoading }) => {
  const zIndex = useZIndex(true);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      <div className="bg-white w-full max-w-xl rounded-section shadow-xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Briefcase size={24} /></div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">切换广告账户</h4>
              <p className="text-gray-400 text-xs font-bold mt-1">Select an active ad account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-300 transition-colors"><X size={24} /></button>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="animate-spin text-primary-500/70" />
              <p className="text-xs font-medium text-gray-400 animate-pulse">Loading accounts...</p>
            </div>
          ) : (
            MOCK_ACCOUNTS.map(acc => (
              <button
                key={acc.id}
                onClick={() => {
                  onSelect(acc);
                  onClose();
                }}
                className={`w-full p-6 rounded-inner border-2 flex items-center justify-between transition-all ${
                  selectedAccount?.id === acc.id ? 'border-primary-500 bg-primary-50 shadow-primary-focus' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-2 rounded-lg ${selectedAccount?.id === acc.id ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-400'}`}><Briefcase size={16} /></div>
                  <div>
                    <p className={`text-sm font-semibold ${selectedAccount?.id === acc.id ? 'text-primary-700' : 'text-gray-600'}`}>{acc.name}</p>
                    <p className="text-xs text-gray-400 font-bold">ID: {acc.id}</p>
                  </div>
                </div>
                {selectedAccount?.id === acc.id && <Check size={20} className="text-primary-500" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const MetaAccountPickerModal = ({ selectedAccount, onSelect, onClose, isLoading }) => {
  const zIndex = useZIndex(true);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      <div className="bg-white w-full max-w-xl rounded-section shadow-xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Facebook size={24} /></div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">选择 Meta 广告账户</h4>
              <p className="text-gray-400 text-xs font-bold mt-1">Select a Meta ad account to continue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-300 transition-colors"><X size={24} /></button>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="animate-spin text-primary-500/70" />
              <p className="text-xs font-medium text-gray-400 animate-pulse">Loading accounts...</p>
            </div>
          ) : (
            MOCK_ACCOUNTS.map(acc => (
              <button
                key={acc.id}
                onClick={() => onSelect(acc)}
                className={`w-full p-6 rounded-inner border-2 flex items-center justify-between transition-all ${
                  selectedAccount?.id === acc.id ? 'border-primary-500 bg-primary-50 shadow-primary-focus' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-2 rounded-lg ${selectedAccount?.id === acc.id ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-400'}`}><Briefcase size={16} /></div>
                  <div>
                    <p className={`text-sm font-semibold ${selectedAccount?.id === acc.id ? 'text-primary-700' : 'text-gray-600'}`}>{acc.name}</p>
                    <p className="text-xs text-gray-400 font-bold">ID: {acc.id}</p>
                  </div>
                </div>
                {selectedAccount?.id === acc.id && <Check size={20} className="text-primary-500" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkLaunchTool;
