import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X, Globe, Monitor, Target, ShoppingBag, ChevronDown, Sparkles, Search,
  Briefcase, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText,
  Type, Rocket, Facebook, Instagram, Hash, Loader2,
  CheckCircle2, Layers, RefreshCw, MapPin, Zap, ArrowRight, ChevronLeft,
  Megaphone, MousePointer2, Users, Smartphone, ChevronRight, Link2Off, AlertCircle,
  DollarSign
} from 'lucide-react';
import { Z_INDEX } from '../../constants/zIndex';
import { useZIndex } from '../../hooks/useZIndex';
import ProductSelector from './components/ProductSelector';
import CampaignPlanView from './components/CampaignPlanView';
import CampaignPreviewView from './components/CampaignPreviewView';
import useDropdownLoading from '../../hooks/useDropdownLoading';
import { authorizePlatform } from './services/authService';

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
    { id: 'in_feed', label: 'In-Feed Ads' },
    { id: 'topview', label: 'TopView' },
    { id: 'spark_ads', label: 'Spark Ads' },
    { id: 'pangle', label: 'Pangle (Audience Network)' },
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
  const platformId = platform?.id || 'meta';
  const platformName = platform?.name || 'Meta';
  const isAuthed = !!authStatus?.[platformId];
  const ConnectIcon = platformId === 'tiktok' ? Smartphone : Facebook;
  const total = (lalSelected?.length || 0) + (customSelected?.length || 0);
  return (
    <div className="relative">
      <div onClick={onToggle}
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
      {open && (
        <div className={`absolute top-full ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-[320px] bg-white rounded-base shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 z-[20] overflow-hidden`}>
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
        </div>
      )}
    </div>
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

// ChannelPickerHero — 入场两步走：① 选媒体 → ② 动态露出该媒体可用的 Campaign Objective 卡片平铺；
// 二者齐全后自动 unmount，由 sticky ChannelHeaderCard 接管。
const PLATFORM_TAGLINES = {
  meta:   'Facebook · Instagram · 全球最大社交广告',
  tiktok: '短视频 · 年轻流量主场',
  google: 'Search · YouTube · GDN',
  bing:   'Microsoft · 海外搜索补充',
};
const ChannelPickerHero = ({ platforms, onPick, platform, objective, onPickObjective, availableObjectives = [] }) => {
  // 当前阶段：1 = 选媒体；2 = 选目标
  const stage = platform ? 2 : 1;
  return (
    <section className="px-2 md:px-4 pt-10 pb-16 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 顶部：标题 + 进度提示 */}
      <header className="flex flex-col items-center text-center mb-10">
        <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(112,51,245,0.25)] mb-5 ring-4 ring-primary-50">
          <Monitor className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Get your campaign started</h1>
        <p className="text-sm text-gray-500 font-medium">先选择投放媒体，再确定 Campaign 目标 · 系统将基于此自动匹配版位与素材规范</p>
        <div className="mt-6 inline-flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${stage >= 1 ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>{platform ? <Check className="w-3 h-3" strokeWidth={3} /> : '1'}</span>
            <span className={`font-semibold ${stage >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>媒体</span>
          </div>
          <span className={`block w-12 h-px ${platform ? 'bg-primary-500' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${objective ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30' : stage === 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>{objective ? <Check className="w-3 h-3" strokeWidth={3} /> : '2'}</span>
            <span className={`font-semibold ${objective ? 'text-gray-900' : stage === 2 ? 'text-gray-700' : 'text-gray-400'}`}>目标</span>
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

      {/* Step 2 — Campaign 目标 — 媒体选定后动态出现 */}
      {platform && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-baseline justify-between px-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">Campaign 目标</h2>
              <span className="text-xs text-gray-400 font-medium">Campaign Objective</span>
            </div>
            <span className="text-xs text-gray-400">
              {availableObjectives.length > 0
                ? `${availableObjectives.length} 个可用 · 来自 ${platform.name}`
                : '该平台暂无可用目标'}
            </span>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${availableObjectives.length >= 5 ? 'lg:grid-cols-5' : availableObjectives.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {availableObjectives.map(obj => {
              const Icon = obj.icon;
              const isPicked = objective === obj.value;
              return (
                <button
                  key={obj.value}
                  type="button"
                  onClick={() => onPickObjective?.(obj.value)}
                  className={`group relative flex flex-col gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                    isPicked
                      ? 'bg-primary-50/40 border-primary-500 shadow-[-2px_2px_16px_rgba(112,51,245,0.18)]'
                      : 'bg-white border-[#F0F0F0] hover:border-primary-500 hover:shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all ${isPicked ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25' : `${obj.bg} ${obj.color}`}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isPicked
                      ? <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" strokeWidth={2.5} />
                      : <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-1" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate transition-colors ${isPicked ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-500'}`}>{obj.label}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{obj.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 底部辅助提示 — 三段渐进式文案 */}
      <p className="text-xs text-gray-400 text-center mt-10 font-medium">
        {!platform
          ? '选择媒体后将解锁该平台可投放的 Campaign 目标'
          : !objective
            ? '选择 Campaign 目标后即可进入下一步配置 · 广告账户选填，可稍后再选'
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
  objective, onChangeObjective, availableObjectives = [],
}) => {
  const accountState =
    !platform                          ? 'NO_PLATFORM' :
    !authStatus?.[platform.id]         ? 'NEED_AUTH'   :
    !selectedAccount                   ? 'NEED_PICK'   :
                                         'PICKED';

  const objectiveDisabled = !platform;
  const currentObjectiveObj = availableObjectives.find(o => o.value === objective);

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
    <div className="bg-gray-900/95 text-white rounded-section px-8 py-5 shadow-xl border border-gray-800 backdrop-blur-md flex items-center gap-6 flex-wrap animate-in fade-in slide-in-from-top-2">
      <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shrink-0"><Monitor size={20} /></div>
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-base font-semibold text-white">投放渠道媒体</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">选择媒体平台与关联广告账号</p>
      </div>

      {/* Platform dropdown */}
      <div className="relative shrink-0 min-w-[200px]" ref={openDropdown === 'platform' ? dropdownRef : null}>
        <div onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
          className="bg-gray-800 rounded-inner px-4 py-2.5 border border-gray-700 flex items-center justify-between gap-3 cursor-pointer hover:border-primary-500/50 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            {platform ? (
              <><img src={platform.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" /><span className="text-sm font-bold text-white truncate">{platform.name}</span></>
            ) : (<><Monitor size={16} className="text-primary-400 shrink-0" /><span className="text-sm font-bold text-gray-500">请选择渠道...</span></>)}
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform shrink-0 ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'platform' && (
          <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-gray-900 rounded-base shadow-xl border border-gray-700 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200 z-[20]">
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
          </div>
        )}
      </div>

      {/* Campaign Objective dropdown — 媒体选定后必填，置于平台与账号之间。
          注意 dropdown key 必须与下方 TargetingChannelCard 的 Conversion Event ('objective') 错开，
          否则共享 openDropdown 状态会触发联动 bug。 */}
      <div className="relative shrink-0 min-w-[220px]" ref={openDropdown === 'campaignObjective' ? dropdownRef : null}>
        <div
          onClick={() => { if (!objectiveDisabled) setOpenDropdown(openDropdown === 'campaignObjective' ? null : 'campaignObjective'); }}
          className={`bg-gray-800 rounded-inner px-4 py-2.5 border border-gray-700 flex items-center justify-between gap-3 transition-all ${
            objectiveDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-500/50'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {objectiveDisabled ? (
              <>
                <Target size={16} className="text-gray-500 shrink-0" />
                <span className="text-sm font-bold text-gray-500 truncate">请先选择渠道...</span>
              </>
            ) : currentObjectiveObj ? (
              <>
                <Target size={16} className="text-primary-400 shrink-0" />
                <span className="text-sm font-bold text-white truncate">{currentObjectiveObj.label}</span>
              </>
            ) : (
              <>
                <Target size={16} className="text-primary-400 shrink-0" />
                <span className="text-sm font-bold text-gray-400 truncate">请选择目标 <span className="text-rose-400">*</span></span>
              </>
            )}
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform shrink-0 ${openDropdown === 'campaignObjective' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'campaignObjective' && !objectiveDisabled && (
          <div className="absolute top-full right-0 mt-2 w-full min-w-[260px] bg-gray-900 rounded-base shadow-xl border border-gray-700 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200 z-[20]">
            {availableObjectives.map(obj => {
              const Icon = obj.icon;
              const isActive = objective === obj.value;
              return (
                <button
                  key={obj.value}
                  onClick={() => { onChangeObjective?.(obj.value); setOpenDropdown(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-base transition-all text-left ${
                    isActive ? 'bg-primary-500/15 text-primary-300' : 'hover:bg-gray-800 text-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-base flex items-center justify-center ${isActive ? 'bg-primary-500 text-white' : `${obj.bg} ${obj.color}`}`}>
                    {Icon && <Icon size={14} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{obj.label}</p>
                    <p className="text-[10px] text-gray-400 truncate">{obj.description}</p>
                  </div>
                  {isActive && <Check size={12} className="ml-auto text-primary-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Account dropdown — 4-state machine */}
      <div className="relative shrink-0 min-w-[260px]" ref={openDropdown === 'account' ? dropdownRef : null}>
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

        {openDropdown === 'account' && !triggerDisabled && (
          <div className="absolute top-full right-0 mt-2 w-full min-w-[280px] bg-gray-900 rounded-base shadow-xl border border-gray-700 animate-in fade-in zoom-in-95 duration-200 z-[20] overflow-hidden">
            {accountState === 'NEED_AUTH' ? (
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                  使用 {platform.name} 广告账户前，请先连接您的 {platform.name} Ads 账号。
                </p>
                <button
                  disabled={isAuthLoading}
                  onClick={() => onAuthorize(platform.id)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-base font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAuthLoading ? <Loader2 size={16} className="animate-spin" /> : (platform.id === 'meta' ? <Facebook size={16} /> : <Smartphone size={16} />)}
                  <span className="text-sm">{isAuthLoading ? '连接中...' : `Connect ${platform.name} Ads`}</span>
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
          </div>
        )}
      </div>
    </div>
  );
};


// 广告结构初始化设置卡 — 投放目标 + 广告结构数量 + Ad Format + 版位 + 每日预算 + 高级设置 collapsible
const TargetingChannelCard = ({
  objective, setObjective, adsetGoal, setAdsetGoal, event, setEvent,
  selectedLocations, setSelectedLocations, openDropdown, setOpenDropdown, dropdownRef,
  locationSearch, setLocationSearch, eventSearch, setEventSearch, objectiveStage, setObjectiveStage,
  filteredCountries, filteredEvents, toggleLocation, currentObjectiveObj, currentGoalObj, availableGoals,
  selectedLanguage, setSelectedLanguage, languageSearch, setLanguageSearch, filteredLanguages,
  // New props for the consolidated init card
  structure, onStructureChange,
  adType, onAdTypeChange,
  placementMode, setPlacementMode, manualPlacements, setManualPlacements,
  platform, campaignType,
  dailyBudget, setDailyBudget,
  budgetType, setBudgetType,
  advancedOpen, setAdvancedOpen,
  productCount = 0,
  startDate, setStartDate, endDate, setEndDate, onQuickSchedule,
  bidStrategy, onChangeBidStrategy, bidAmount, setBidAmount,
  globalAdsetLalInclude, setGlobalAdsetLalInclude,
  globalAdsetCustomInclude, setGlobalAdsetCustomInclude,
  globalAdsetLalExclude, setGlobalAdsetLalExclude,
  globalAdsetCustomExclude, setGlobalAdsetCustomExclude,
  authStatus, onAuthorize, isAuthLoading, selectedAccount, onPickAccount,
  children,
}) => {
  const isFlexibleObjective = objective === 'sales_conversions' || objective === 'app_promotion';
  // Campaign 架构 现已无条件展示在最前；保留早期 isInitComplete 检查的语义已迁移到父
  // 组件层面（决定是否暴露 "预览发布计划" CTA），此处不再需要本地副本。
  const platformId = platform?.id;
  const placementOptions = platformId ? (PLATFORM_PLACEMENTS[platformId] || []) : [];
  const currentSelected = (platformId && manualPlacements[platformId]) || [];
  const togglePlacement = (placementId) => {
    if (!platformId) return;
    const next = currentSelected.includes(placementId)
      ? currentSelected.filter(p => p !== placementId)
      : [...currentSelected, placementId];
    setManualPlacements({ ...manualPlacements, [platformId]: next });
  };

  return (
    <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-top-4 flex flex-col gap-10">
      <div className="flex items-center gap-3" style={{ order: 0 }}>
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><Target size={20} /></div>
        <h3 className="text-xl font-semibold text-gray-900">广告结构初始化设置</h3>
      </div>

      {/* Section A: 优化目标与预算 — 现 02，视觉位于 Campaign 架构之下 */}
      <section className="border-t border-gray-100 pt-10" style={{ order: 2 }}>
        <div className="flex items-baseline gap-3 mb-5 px-1">
          <span className="text-xs font-bold text-primary-500/60 tabular-nums">02</span>
          <h4 className="text-base font-semibold text-gray-900 tracking-tight">优化目标与预算</h4>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-[10]">
        {/* Location Selector */}
        <div>
          <div className="relative" ref={openDropdown === 'location' ? dropdownRef : null}>
            <div onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">投放国家/地区</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {selectedLocations.length > 0 ? (<>{selectedLocations[0]?.name}{selectedLocations.length > 1 && '...'}</>) : <span className="text-gray-300">待选择...</span>}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-base shadow-xl border border-gray-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
                <div className="w-1/2 border-r border-gray-50 flex flex-col">
                  <div className="p-4 border-b border-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                      <input className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-base text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/10"
                        placeholder="Search locations..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} autoFocus />
                    </div>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredCountries.map(c => (
                      <button key={c.code} onClick={() => toggleLocation(c)}
                        className={`w-full text-left px-3 py-2 rounded-base text-xs font-bold transition-all flex items-center justify-between ${
                          selectedLocations.some(l => l.code === c.code) ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                        {c.name}
                        {selectedLocations.some(l => l.code === c.code) && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-1/2 bg-gray-50/30 flex flex-col">
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Selected ({selectedLocations.length})</span>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-4 flex flex-wrap gap-2 content-start">
                    {selectedLocations.map(l => (
                      <div key={l.code} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-100 rounded-tag shadow-sm animate-in zoom-in">
                        <span className="text-xs font-medium text-gray-700">{l.code}</span>
                        <button onClick={() => toggleLocation(l)} className="text-gray-300 hover:text-rose-500 transition-colors"><X size={10} strokeWidth={3} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language Selector (single-select) */}
        <div>
          <div className="relative" ref={openDropdown === 'language' ? dropdownRef : null}>
            <div onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">Language</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {selectedLanguage ? selectedLanguage.name : <span className="text-gray-300">Auto...</span>}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${openDropdown === 'language' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'language' && (
              <div className="absolute top-full left-0 mt-2 w-[260px] bg-white rounded-base shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                    <input className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-base text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/10"
                      placeholder="Search languages..." value={languageSearch} onChange={(e) => setLanguageSearch(e.target.value)} autoFocus />
                  </div>
                </div>
                <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                  {filteredLanguages.map(lang => (
                    <button key={lang.code} onClick={() => { setSelectedLanguage(lang); setOpenDropdown(null); }}
                      className={`w-full text-left px-3 py-2 rounded-base text-xs font-bold transition-all flex items-center justify-between ${
                        selectedLanguage?.code === lang.code ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {lang.name}
                      {selectedLanguage?.code === lang.code && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Event — 仅承载 conversion goal + pixel event 两级（campaign objective 已上提至顶部 ChannelHeaderCard）。
            objective 未选时禁用，并提示在顶部选择。 */}
        <div>
          <div className="relative" ref={openDropdown === 'objective' ? dropdownRef : null}>
            <div
              onClick={() => {
                if (!objective) return;
                setOpenDropdown(openDropdown === 'objective' ? null : 'objective');
                // 始终从 goal 进入（objective 已在顶部选过）
                setObjectiveStage('goal');
              }}
              className={`bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group transition-all h-full ${
                objective ? 'cursor-pointer hover:border-primary-500/20' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <span className="text-xs font-medium text-gray-500">Conversion Event</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Target size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {!objective
                      ? <span className="text-gray-300">请先在顶部选择 Campaign Objective</span>
                      : (event || currentGoalObj?.label || <span className="text-gray-300">Select...</span>)}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${openDropdown === 'objective' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'objective' && objective && (
              <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-base shadow-xl border border-gray-100 p-3 animate-in fade-in zoom-in-95 duration-200 z-[20]">
                {objectiveStage === 'goal' && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 px-2">Conversion Goal</p>
                    <div className="grid grid-cols-1 gap-1">
                      {availableGoals.map(goal => (
                        <button key={goal.value} onClick={() => {
                          setAdsetGoal(goal.value);
                          if (goal.needsEvent) { setObjectiveStage('event'); } else { setEvent(''); setOpenDropdown(null); }
                        }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                          adsetGoal === goal.value ? 'bg-gray-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'
                        }`}>
                          <span>{goal.label}</span>
                          {goal.needsEvent ? <ArrowRight size={12} className="opacity-30 group-hover:opacity-100" /> : (adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {objectiveStage === 'event' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <button onClick={() => setObjectiveStage('goal')} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400"><ChevronLeft size={14} /></button>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest">Pixel Event</p>
                    </div>
                    <div className="relative px-1">
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-base text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20"
                        placeholder="Search events..." value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} autoFocus />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
                      {filteredEvents.map(ev => (
                        <button key={ev} onClick={() => { setEvent(ev); setOpenDropdown(null); }}
                          className={`w-full text-left px-3 py-2 rounded-base text-xs font-bold transition-all flex items-center justify-between ${
                            event === ev ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'
                          }`}>
                          {ev}
                          {event === ev && <CheckCircle2 size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Daily Budget — 4th column, matches dropdown card visual */}
        <div>
          <div className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group focus-within:border-primary-500/30 transition-all h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500">每日预算</span>
              <div className="inline-flex items-center bg-gray-100 rounded-base p-0.5">
                <button
                  type="button"
                  onClick={() => setBudgetType('CBO')}
                  className={`px-2.5 py-0.5 rounded-base text-[10px] font-medium transition-all ${
                    budgetType === 'CBO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500'
                  }`}
                >CBO</button>
                <button
                  type="button"
                  onClick={() => setBudgetType('ABO')}
                  className={`px-2.5 py-0.5 rounded-base text-[10px] font-medium transition-all ${
                    budgetType === 'ABO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500'
                  }`}
                >ABO</button>
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <DollarSign size={16} className="text-primary-500 shrink-0" />
              <input
                type="number"
                min={0}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-bold text-gray-700 tabular-nums"
              />
              <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0">USD/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* 竞价 + 受众预设 — Meta: [策略 + 金额 + 包含 + 排除] 4col；TikTok: [金额 + 包含 + 排除] 3col */}
      {(() => {
        const isTikTok = platform?.id === 'tiktok';
        const currentBidStrategyObj = BID_STRATEGIES.find(s => s.value === bidStrategy);
        const valueType = currentBidStrategyObj?.valueType || 'none';
        const amountDisabled = !isTikTok && valueType === 'none';
        const amountLabel = isTikTok ? '竞价目标（空为最大转化量）'
          : valueType === 'roas' ? '目标 ROAS'
          : valueType === 'currency' ? (bidStrategy === 'cost_cap' ? '单次结果成本上限' : '出价上限')
          : '竞价目标';
        const amountSuffix = isTikTok ? 'USD' : valueType === 'roas' ? '×' : valueType === 'currency' ? 'USD' : '';
        const placeholder = amountDisabled ? '无需填写' : valueType === 'roas' ? '如 2.5' : '0.00';
        const toggleLal = (target) => target === 'inc'
          ? (id) => setGlobalAdsetLalInclude(globalAdsetLalInclude.includes(id) ? globalAdsetLalInclude.filter(x => x !== id) : [...globalAdsetLalInclude, id])
          : (id) => setGlobalAdsetLalExclude(globalAdsetLalExclude.includes(id) ? globalAdsetLalExclude.filter(x => x !== id) : [...globalAdsetLalExclude, id]);
        const toggleCustom = (target) => target === 'inc'
          ? (id) => setGlobalAdsetCustomInclude(globalAdsetCustomInclude.includes(id) ? globalAdsetCustomInclude.filter(x => x !== id) : [...globalAdsetCustomInclude, id])
          : (id) => setGlobalAdsetCustomExclude(globalAdsetCustomExclude.includes(id) ? globalAdsetCustomExclude.filter(x => x !== id) : [...globalAdsetCustomExclude, id]);
        return (
          <div className={`grid gap-4 mt-4 relative z-[5] grid-cols-1 md:grid-cols-2 ${isTikTok ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {!isTikTok && (
              <div className="relative" ref={openDropdown === 'bidStrategy' ? dropdownRef : null}>
                <div onClick={() => setOpenDropdown(openDropdown === 'bidStrategy' ? null : 'bidStrategy')}
                  className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
                  <span className="text-xs font-medium text-gray-500">竞价策略</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Target size={16} className="text-primary-500 shrink-0" />
                      <span className="text-sm font-bold text-gray-700 truncate">
                        {currentBidStrategyObj?.label || <span className="text-gray-300">Select...</span>}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${openDropdown === 'bidStrategy' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {openDropdown === 'bidStrategy' && (
                  <div className="absolute top-full right-0 mt-2 w-[300px] bg-white rounded-base shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 z-[20]">
                    {BID_STRATEGIES.map(s => (
                      <button key={s.value} onClick={() => { onChangeBidStrategy?.(s.value); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-2.5 rounded-base transition-all flex items-center justify-between gap-3 ${bidStrategy === s.value ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{s.label}</p>
                          <p className={`text-[10px] truncate ${bidStrategy === s.value ? 'text-gray-300' : 'text-gray-400'}`}>{s.desc}</p>
                        </div>
                        {bidStrategy === s.value && <Check size={12} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div>
              <div className={`bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 transition-all h-full ${amountDisabled ? 'opacity-60' : 'focus-within:border-primary-500/30'}`}>
                <span className="text-xs font-medium text-gray-500">{amountLabel}</span>
                <div className="flex items-center gap-2.5 min-w-0">
                  {valueType !== 'roas' && !isTikTok ? (
                    <DollarSign size={16} className="text-primary-500 shrink-0" />
                  ) : (
                    <Target size={16} className="text-primary-500 shrink-0" />
                  )}
                  <input
                    type="number"
                    min={0}
                    step={valueType === 'roas' ? 0.1 : 0.01}
                    disabled={amountDisabled}
                    value={bidAmount ?? ''}
                    onChange={(e) => setBidAmount?.(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-bold text-gray-700 tabular-nums disabled:cursor-not-allowed"
                  />
                  {amountSuffix && (
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0">{amountSuffix}</span>
                  )}
                </div>
              </div>
            </div>
            {/* 包含受众（选填） */}
            <IncludeExcludeAudienceDropdown
              triggerLabel="包含受众（选填）"
              open={openDropdown === 'audInclude'}
              onToggle={() => setOpenDropdown(openDropdown === 'audInclude' ? null : 'audInclude')}
              lalSelected={globalAdsetLalInclude}
              customSelected={globalAdsetCustomInclude}
              onToggleLal={toggleLal('inc')}
              onToggleCustom={toggleCustom('inc')}
              authStatus={authStatus} platform={platform}
              selectedAccount={selectedAccount}
              onAuthorize={onAuthorize} isAuthLoading={isAuthLoading}
              onPickAccount={onPickAccount}
            />
            {/* 排除受众（选填） */}
            <IncludeExcludeAudienceDropdown
              triggerLabel="排除受众（选填）"
              open={openDropdown === 'audExclude'}
              onToggle={() => setOpenDropdown(openDropdown === 'audExclude' ? null : 'audExclude')}
              lalSelected={globalAdsetLalExclude}
              customSelected={globalAdsetCustomExclude}
              onToggleLal={toggleLal('exc')}
              onToggleCustom={toggleCustom('exc')}
              authStatus={authStatus} platform={platform}
              selectedAccount={selectedAccount}
              onAuthorize={onAuthorize} isAuthLoading={isAuthLoading}
              onPickAccount={onPickAccount}
            />
          </div>
        );
      })()}

      </section>

      {/* Section B: Campaign 架构 — 现 01，视觉首位（CSS order 控制） */}
      <section className="space-y-6" style={{ order: 1 }}>
        <div className="flex items-baseline gap-3 px-1">
          <span className="text-xs font-bold text-primary-500/60 tabular-nums">01</span>
          <h4 className="text-base font-semibold text-gray-900 tracking-tight">Campaign 架构</h4>
        </div>

        {/* 一行 4 列：架构策略 + Campaign / Adset / Ads 数量（CATALOG 隐藏策略列，改 3 列） */}
        <div className={`grid gap-4 relative z-[5] ${campaignType === 'CATALOG' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* 架构策略 dropdown */}
          {campaignType !== 'CATALOG' && (
            <div>
              <div className="relative" ref={openDropdown === 'strategy' ? dropdownRef : null}>
                <div onClick={() => setOpenDropdown(openDropdown === 'strategy' ? null : 'strategy')}
                  className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
                  <span className="text-xs font-medium text-gray-500">架构策略</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers size={16} className="text-primary-500 shrink-0" />
                      <span className="text-sm font-bold text-gray-700 truncate">
                        {STRATEGY_OPTIONS.find(o => o.id === structure.strategy)?.label || 'Product 测试'}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${openDropdown === 'strategy' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {openDropdown === 'strategy' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-base shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[20]">
                    {STRATEGY_OPTIONS.map(opt => {
                      const active = structure.strategy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => { onStructureChange({ ...structure, strategy: opt.id }); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-start justify-between gap-3 ${active ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                        >
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${active ? 'text-primary-500' : 'text-gray-700'}`}>{opt.label}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{opt.desc}</p>
                          </div>
                          {active && <Check size={14} className="text-primary-500 shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <Stepper
            label="Campaign 数量"
            value={structure.numCampaigns}
            onChange={(v) => onStructureChange({ ...structure, numCampaigns: v })}
            min={1} max={10}
          />
          <Stepper
            label="Adset 数量（per campaign）"
            value={structure.numAdsets || Math.max(productCount, 1)}
            onChange={(v) => onStructureChange({ ...structure, numAdsets: v, numAdsetsPerProduct: Math.max(1, Math.round(v / Math.max(productCount, 1))), adsPerSet: v })}
            min={1}
            max={50}
            step={1}
          />
          <div className="bg-gray-50/60 rounded-inner p-4 border border-gray-100 flex flex-col gap-2 h-full">
            <span className="text-xs font-medium text-gray-500 truncate">Ads 数量（per adset）</span>
            <div className="flex items-center justify-center flex-1">
              <span className="text-xs font-semibold text-gray-400 italic">根据创意数量自动</span>
            </div>
          </div>
        </div>

        {/* Ad Format 已迁移至高级设置 → Ad 策略 子模块 */}
      </section>

      {/* Section C: 高级设置 inline collapsible (含版位 / 命名 / 落地页 / 文案 / 排期) */}
      <section className="border-t border-gray-100 pt-6" style={{ order: 3 }}>
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-baseline justify-between gap-3 px-1 py-3 group hover:opacity-80 transition-opacity"
        >
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="text-xs font-bold text-primary-500/60 tabular-nums">03</span>
            <h4 className="text-base font-semibold text-gray-900 tracking-tight">高级设置</h4>
            <span className="text-xs text-gray-400 font-medium truncate">版位与排期 / 命名 / 落地页 / Ad 策略</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 self-center ${advancedOpen ? 'rotate-180' : ''}`} />
        </button>
        {advancedOpen && (
          <div className="pt-6 space-y-12 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 版位与排期 — 高级设置的第一个子模块（合并原版位 + 投放排期），两列布局 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <label className="text-xs font-medium text-gray-500">版位与排期</label>
                <Info size={12} className="text-gray-300" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左：版位 */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-6 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 block">版位</span>
                  <div className="flex p-1 bg-gray-100/80 rounded-base border border-gray-100 w-fit">
                    <button
                      onClick={() => setPlacementMode('AUTO')}
                      className={`px-6 py-2.5 rounded-base text-xs font-medium transition-all ${placementMode === 'AUTO' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Auto Placement
                    </button>
                    <button
                      onClick={() => setPlacementMode('MANUAL')}
                      disabled={!platformId || !PLATFORM_PLACEMENTS[platformId]}
                      className={`px-6 py-2.5 rounded-base text-xs font-medium transition-all ${placementMode === 'MANUAL' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'}`}
                    >
                      Manual
                    </button>
                  </div>
                  {placementMode === 'AUTO' ? (
                    <p className="text-xs text-gray-400 leading-relaxed px-1">
                      系统将根据广告目标和受众智能分发到 {platform?.name || '所选平台'} 的最优版位组合。
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {placementOptions.length === 0 ? (
                        <p className="col-span-full text-xs text-gray-400 px-1">请先在顶部选择渠道。</p>
                      ) : placementOptions.map(p => {
                        const checked = currentSelected.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => togglePlacement(p.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-base border text-xs font-medium transition-all ${checked ? 'bg-primary-50 border-primary-500 text-primary-500' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}
                          >
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-all ${checked ? 'bg-primary-500 text-white' : 'border border-gray-300 bg-white'}`}>
                              {checked && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="truncate">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 右：排期 */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-6 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">排期</span>
                    <span className="text-[11px] text-gray-400">结束时间留空 = 不限期</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-gray-500 px-1">开始时间</label>
                      <input
                        type="datetime-local"
                        step="1"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-12 px-3 bg-white border border-gray-200 rounded-base outline-none text-xs text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-gray-500 px-1">结束时间</label>
                      <input
                        type="datetime-local"
                        step="1"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-12 px-3 bg-white border border-gray-200 rounded-base outline-none text-xs text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[3, 7, 14, 30].map(days => (
                      <button
                        key={days}
                        onClick={() => onQuickSchedule?.(days)}
                        className="flex-1 py-2 bg-white border border-gray-200 rounded-base text-xs font-medium text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-all duration-200"
                      >
                        {days} 天
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {children}
          </div>
        )}
      </section>
    </div>
  );
};

// ── Naming Strategy Section ──────────────────────────────────────────────────

const NAMING_VARS = [
  { key: 'Brand',         label: 'Brand' },
  { key: 'location',      label: 'Location' },
  { key: 'budget',        label: 'Budget' },
  { key: 'device',        label: 'Device' },
  { key: 'date',          label: 'Date' },
  { key: 'goal',          label: 'Goal' },
  { key: 'audience_type', label: 'Audience type' },
  { key: 'creative_type', label: 'Creative type' },
  { key: 'theme',         label: 'Theme' },
  { key: 'number',        label: '编号' },
];

const insertVar = (ref, template, setTemplate, varKey, separator = '') => {
  const el = ref.current;
  const insertion = (el ? (el.selectionStart ?? template.length) : template.length) > 0
    ? `${separator}{${varKey}}`
    : `{${varKey}}`;
  if (!el) {
    setTemplate(template + insertion);
    return;
  }
  const start = el.selectionStart ?? template.length;
  const end   = el.selectionEnd   ?? template.length;
  const next  = template.slice(0, start) + insertion + template.slice(end);
  setTemplate(next);
  requestAnimationFrame(() => {
    el.focus();
    const pos = start + insertion.length;
    el.setSelectionRange(pos, pos);
  });
};

const fmtVar = (k, v) => {
  if (k === 'creative_num' && v !== undefined) return `${v} ${v === 1 ? 'creative' : 'creatives'}`;
  return v;
};
const previewName = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (_, k) => fmtVar(k, vars[k]) ?? `{${k}}`);

const formatHistoryLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
  ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const CAMPAIGN_NAME_HISTORY_DEFAULTS = [
  { label: 'Apr 12, 2026, 3:45 PM', template: '{Brand}-{goal}-{location}-{date}' },
  { label: 'Apr 10, 2026, 11:20 AM', template: '{Brand}-{audience_type}-{date}' },
  { label: 'Default', template: '{Brand}-{location}-{date}' },
];

const ADSET_NAME_HISTORY_DEFAULTS = [
  { label: 'Apr 12, 2026, 3:45 PM', template: '{audience_type}-{location}-{date}' },
  { label: 'Apr 10, 2026, 11:20 AM', template: '{location}-{creative_type}-{date}' },
  { label: 'Default', template: '{location}-{audience_type}-{creative_type}-{date}' },
];

const AD_NAME_HISTORY_DEFAULTS = [
  { label: 'Apr 12, 2026, 3:45 PM', template: '{Brand}-{theme}-{number}-{date}' },
  { label: 'Apr 10, 2026, 11:20 AM', template: '{creative_type}-{theme}-{date}' },
  { label: 'Default', template: '{Brand}-{creative_type}-{number}-{date}' },
];

const NameField = ({
  fieldKey, label, template, setTemplate, inputRef, preview,
  history, setHistory, openHistoryFor, setOpenHistoryFor, onActivate,
}) => {
  const addToHistory = (val) => {
    if (!val.trim() || history.some(h => h.template === val)) return;
    const defaultEntries = history.filter(h => h.label === 'Default');
    const userEntries = history.filter(h => h.label !== 'Default');
    const newEntry = { label: formatHistoryLabel(new Date()), template: val };
    setHistory([[newEntry, ...userEntries].slice(0, 7), ...defaultEntries].flat());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <div className="relative">
          <button
            onClick={() => setOpenHistoryFor(openHistoryFor === fieldKey ? null : fieldKey)}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors px-2 py-0.5 rounded-md border ${
              openHistoryFor === fieldKey
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <RefreshCw size={10} />
            历史策略
            <ChevronDown size={10} className={`transition-transform ${openHistoryFor === fieldKey ? 'rotate-180' : ''}`} />
          </button>
          {openHistoryFor === fieldKey && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-base border border-gray-100 shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setTemplate(item.template); setOpenHistoryFor(null); }}
                  className={`w-full text-left px-3 py-2 transition-colors hover:bg-gray-50 ${
                    item.template === template ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {item.template === template && <Check size={9} className="shrink-0 text-primary-500" />}
                    <span className="text-[11px] font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="relative group">
                    <p className="text-[10px] text-gray-400 font-mono truncate">{item.template}</p>
                    <div className="absolute bottom-full left-0 hidden group-hover:block bg-gray-800 text-white text-[10px] font-mono rounded px-2 py-1 whitespace-nowrap z-[350] shadow-lg pointer-events-none">
                      {item.template}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={template}
        onChange={e => setTemplate(e.target.value)}
        onBlur={() => addToHistory(template)}
        onFocus={() => onActivate(fieldKey)}
        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-base outline-none text-xs text-gray-700 font-mono focus:border-primary-500 focus:shadow-primary-focus transition-all"
      />
      <p className="text-[11px] text-gray-400 px-1 font-mono truncate" title={preview}>
        预览: <span className="text-gray-600">{preview}</span>
      </p>
    </div>
  );
};

const NamingStrategySection = ({
  campaignNameTemplate, setCampaignNameTemplate,
  adsetNameTemplate, setAdsetNameTemplate,
  adNameTemplate, setAdNameTemplate,
  selectedLocations = [], selectedProducts = [],
}) => {
  const campaignInputRef = React.useRef(null);
  const adsetInputRef    = React.useRef(null);
  const adInputRef       = React.useRef(null);

  const [campaignHistory, setCampaignHistory] = useState(CAMPAIGN_NAME_HISTORY_DEFAULTS);
  const [adsetHistory, setAdsetHistory]       = useState(ADSET_NAME_HISTORY_DEFAULTS);
  const [adHistory, setAdHistory]             = useState(AD_NAME_HISTORY_DEFAULTS);
  const [openHistoryFor, setOpenHistoryFor]   = useState(null);

  // 共享状态
  const [activeFieldKey, setActiveFieldKey] = useState(null);

  // 全局分隔符（统一选择，所有插入共用）
  const [separator, setSeparator] = useState('-');

  // 自定义分隔符 popover 控制
  const [showCustomSepPopover, setShowCustomSepPopover] = useState(false);
  const [customSepDraft, setCustomSepDraft] = useState('');

  const SEP_OPTIONS = [
    { value: '-', label: '-' },
    { value: '_', label: '_' },
    { value: ' ', label: '空格' },
    { value: '',  label: 'none' },
  ];

  // 点击命名区域外部时取消激活
  React.useEffect(() => {
    const handler = () => {
      setActiveFieldKey(null);
      setShowCustomSepPopover(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const locStr = selectedLocations.length > 0
    ? selectedLocations.map(l => l.code || l.name).join('_')
    : 'US';

  const SAMPLE_VARS = {
    Brand: 'MyBrand', location: locStr, budget: '$500', device: 'Mobile',
    date: today, goal: 'Conversions', audience_type: 'LAL',
    creative_type: 'Video', theme: 'Summer', number: '001',
  };

  const campaignPreview = previewName(campaignNameTemplate, SAMPLE_VARS);
  const adsetPreview    = previewName(adsetNameTemplate,    SAMPLE_VARS);
  const adPreview       = previewName(adNameTemplate,       SAMPLE_VARS);

  const fields = [
    { key: 'campaign', label: 'Campaign 命名', template: campaignNameTemplate, setTemplate: setCampaignNameTemplate, inputRef: campaignInputRef, preview: campaignPreview, history: campaignHistory, setHistory: setCampaignHistory },
    { key: 'adset',    label: 'Adset 命名',    template: adsetNameTemplate,    setTemplate: setAdsetNameTemplate,    inputRef: adsetInputRef,    preview: adsetPreview,    history: adsetHistory,    setHistory: setAdsetHistory },
    { key: 'ad',       label: 'Ad 命名',       template: adNameTemplate,       setTemplate: setAdNameTemplate,       inputRef: adInputRef,       preview: adPreview,       history: adHistory,       setHistory: setAdHistory },
  ];

  const activeField = fields.find(f => f.key === activeFieldKey) ?? null;

  const handleChipClick = (v) => {
    if (!activeField) return;
    const pos = activeField.inputRef.current?.selectionStart ?? activeField.template.length;
    const sep = pos === 0 ? '' : separator;
    insertVar(activeField.inputRef, activeField.template, activeField.setTemplate, v.key, sep);
  };

  const handleConfirmCustomSep = () => {
    const val = customSepDraft;
    if (!val) return;
    setSeparator(val);
    setShowCustomSepPopover(false);
  };

  const isCustomSep = !SEP_OPTIONS.some(o => o.value === separator);

  return (
    <div className="space-y-6 pt-10" onClick={() => openHistoryFor && setOpenHistoryFor(null)}>
      <div className="flex items-center gap-2 px-1">
        <label className="text-xs font-medium text-gray-500">广告结构命名策略</label>
        <Info size={12} className="text-gray-300" />
      </div>
      <div
        className="bg-gray-50/50 border border-gray-100 rounded-inner p-6"
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex items-stretch gap-4">
          {/* 左侧：三层命名卡片 */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {fields.map((f) => (
              <div key={f.key} className="bg-white border border-gray-100 rounded-base p-5 shadow-sm flex-1">
                <NameField
                  fieldKey={f.key}
                  label={f.label}
                  template={f.template}
                  setTemplate={f.setTemplate}
                  inputRef={f.inputRef}
                  preview={f.preview}
                  history={f.history}
                  setHistory={f.setHistory}
                  openHistoryFor={openHistoryFor}
                  setOpenHistoryFor={setOpenHistoryFor}
                  onActivate={setActiveFieldKey}
                />
              </div>
            ))}
          </div>

          {/* 右侧：变量面板（贯穿三行等高） */}
          <div className={`w-44 flex-shrink-0 rounded-base flex flex-col transition-all ${
            activeField === null
              ? 'border border-dashed border-gray-300 opacity-60'
              : 'border border-primary-200 bg-white'
          }`}>
            {/* 状态标题 */}
            <div className="px-3 pt-3 pb-2 border-b border-gray-100">
              {activeField === null ? (
                <p className="text-[10px] text-gray-400 leading-relaxed">请先点击左侧命名框，再选择变量插入</p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  <p className="text-[10px] text-primary-500 font-semibold leading-tight">
                    插入到：{activeField.label}
                  </p>
                </div>
              )}
            </div>

            {/* 分隔符模块 */}
            <div className={`px-3 pt-2.5 pb-2.5 border-b border-dashed border-gray-200 ${activeField === null ? 'pointer-events-none' : ''}`}>
              <p className="text-[10px] text-gray-400 mb-1.5 font-medium">分隔符</p>
              <div className="flex flex-wrap gap-1 relative">
                {SEP_OPTIONS.map(opt => {
                  const isSelected = separator === opt.value && !isCustomSep;
                  return (
                    <button
                      key={opt.value}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setSeparator(opt.value); setShowCustomSepPopover(false); }}
                      disabled={activeField === null}
                      className={`px-2 py-0.5 text-[10px] font-mono border rounded transition-colors ${
                        isSelected
                          ? 'bg-primary-500 text-white border-primary-500'
                          : activeField === null
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setCustomSepDraft(isCustomSep ? separator : ''); setShowCustomSepPopover(v => !v); }}
                  disabled={activeField === null}
                  className={`px-2 py-0.5 text-[10px] font-mono border rounded transition-colors ${
                    isCustomSep
                      ? 'bg-primary-500 text-white border-primary-500'
                      : activeField === null
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {isCustomSep ? `自定义(${separator})` : '自定义'}
                </button>

                {showCustomSepPopover && (
                  <>
                    <div className="fixed inset-0 z-[290]" onClick={() => setShowCustomSepPopover(false)} />
                    <div
                      className="absolute right-full top-0 mr-1 w-52 bg-white rounded-base border border-gray-200 shadow-xl z-[300] p-3 animate-in fade-in zoom-in-95 duration-150"
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <p className="text-[11px] font-medium text-gray-500 mb-2">输入分隔符</p>
                      <input
                        autoFocus
                        type="text"
                        maxLength={5}
                        value={customSepDraft}
                        onChange={e => setCustomSepDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleConfirmCustomSep();
                          if (e.key === 'Escape') setShowCustomSepPopover(false);
                        }}
                        placeholder="如 :: 或 |"
                        className="w-full h-8 px-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-primary-500 mb-3"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setShowCustomSepPopover(false)} className="px-2 py-1 text-[11px] text-gray-400 hover:text-gray-600">取消</button>
                        <button
                          onClick={handleConfirmCustomSep}
                          disabled={!customSepDraft}
                          className="px-3 py-1 text-[11px] bg-primary-500 text-white rounded-md disabled:opacity-40 hover:bg-primary-600 transition-colors"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 变量标签列表 */}
            <div className={`flex flex-col gap-1.5 p-3 flex-1 ${activeField === null ? 'pointer-events-none' : ''}`}>
              {NAMING_VARS.map(v => (
                <div key={v.key}>
                  {activeField === null ? (
                    <span className="block w-full px-2 py-1 text-[11px] font-semibold rounded-md border text-center bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed">
                      {`{${v.key}}`}
                    </span>
                  ) : (
                    <button
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleChipClick(v)}
                      className="block w-full px-2 py-1 text-[11px] font-semibold rounded-md border text-center transition-colors bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100"
                    >
                      {`{${v.key}}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const MinimizedPublishIndicator = ({ campaignStatus, adsetProgress, onExpand, onClose }) => {
  const total = adsetProgress.length;
  const done = adsetProgress.filter(a => a.status === 'Success' || a.status === 'Failure').length;
  const successCount = adsetProgress.filter(a => a.status === 'Success').length;
  const failureCount = adsetProgress.filter(a => a.status === 'Failure').length;
  const currentAdset = adsetProgress.find(a => a.status === 'Publishing');
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const isAllDone = campaignStatus === 'Success' || campaignStatus === 'Partial';
  const hasFailure = failureCount > 0;
  const tone = !isAllDone ? 'publishing' : hasFailure ? 'partial' : 'success';

  const toneMap = {
    publishing: {
      grad: 'from-primary-500 to-purple-600',
      glow: 'shadow-primary-500/30',
      shadow: '-2px 2px 24px rgba(112,51,245,0.18)',
      Icon: Loader2,
      iconCls: 'animate-spin',
      barGrad: 'from-primary-500 via-purple-500 to-indigo-500',
      title: '广告发布中',
      subtitle: currentAdset ? `正在发布 ${currentAdset.name}` : '准备中…',
      percentCls: 'text-primary-600',
    },
    success: {
      grad: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/30',
      shadow: '-2px 2px 24px rgba(16,185,129,0.18)',
      Icon: Check,
      iconCls: '',
      barGrad: 'from-emerald-500 via-emerald-400 to-teal-500',
      title: '广告发布完成',
      subtitle: '全部广告已成功发布',
      percentCls: 'text-emerald-600',
    },
    partial: {
      grad: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/30',
      shadow: '-2px 2px 24px rgba(245,158,11,0.2)',
      Icon: AlertCircle,
      iconCls: '',
      barGrad: 'from-amber-500 via-amber-400 to-orange-500',
      title: '发布部分完成',
      subtitle: `${successCount} 成功 · ${failureCount} 失败`,
      percentCls: 'text-amber-600',
    },
  };
  const t = toneMap[tone];
  const { Icon } = t;

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isAllDone) return;
    const hideDelay = setTimeout(() => setIsClosing(true), 3000);
    return () => clearTimeout(hideDelay);
  }, [isAllDone]);

  useEffect(() => {
    if (!isClosing) return;
    const closeDelay = setTimeout(onClose, 300);
    return () => clearTimeout(closeDelay);
  }, [isClosing, onClose]);

  const handleManualClose = () => {
    setIsClosing(true);
  };

  return (
    <>
      <style>{`
        @keyframes adsgo-pub-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
      <div
        className={`fixed top-4 right-4 z-[860] w-[320px] bg-white rounded-2xl ring-1 ring-slate-900/5 p-4 space-y-3 ${
          isClosing
            ? 'animate-out fade-out slide-out-to-top-4 duration-300'
            : 'animate-in fade-in slide-in-from-top-4 duration-400'
        }`}
        style={{ boxShadow: t.shadow }}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            {tone === 'publishing' && (
              <span className="absolute inset-0 rounded-xl bg-primary-500/30 animate-ping" aria-hidden />
            )}
            {tone === 'success' && (
              <span
                className="absolute inset-0 rounded-xl ring-4 ring-emerald-400/40 animate-ping [animation-iteration-count:1] [animation-duration:600ms]"
                aria-hidden
              />
            )}
            <div
              className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center shadow-lg ${t.glow} ${
                tone === 'success' ? 'animate-in zoom-in-50 duration-500' : ''
              }`}
            >
              <Icon size={18} className={`text-white ${t.iconCls}`} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-semibold text-slate-900 tracking-tight leading-tight truncate">
              {t.title}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isAllDone && (
              <button
                onClick={onExpand}
                aria-label="展开查看详情"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              >
                <ChevronRight size={14} />
              </button>
            )}
            <button
              onClick={handleManualClose}
              aria-label="关闭"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${t.barGrad} transition-[width] duration-700 ease-out relative overflow-hidden`}
              style={{ width: `${percent}%` }}
            >
              {tone === 'publishing' && (
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ animation: 'adsgo-pub-shimmer 2s linear infinite' }}
                  aria-hidden
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tabular-nums ${t.percentCls}`}>{percent}%</span>
            <span className="text-[11px] text-slate-400 tabular-nums">
              {done} of {total} adsets
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const _genId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

const BatchGenerateAds = ({ onPageChange, onPublishSuccess }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  // Source of truth: each product has 1+ creative groups, each with editable name + ads
  const [productCreativeGroupsMap, setProductCreativeGroupsMap] = useState({});
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
  const [objectiveStage, setObjectiveStage] = useState('objective');

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
    strategy: 'PER_PRODUCT',
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
    tiktok: ['in_feed', 'topview', 'spark_ads'],
  });
  const [adsetCreativeSelections, setAdsetCreativeSelections] = useState({});
  const [numByCreativeAdsets, setNumByCreativeAdsets] = useState(1);
  // 受众策略：稀疏数组（用户未触动则保持 undefined，由 getAudienceTypes 通过 02 globals + platform 决定 fallback）
  // 每个 campaign 用 stripe = 100 槽位（即 flatIdx = cIdx*100 + aIdx），最多 10 campaigns × 100 adsets。
  const [adsetAudiences, setAdsetAudiences] = useState(() => Array(1000));
  const [adType, setAdType] = useState('FLEXIBLE');
  const [adsetAudienceDetails, setAdsetAudienceDetails] = useState({});
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
  const [view, setView] = useState('config');

  // ref：用于点击"预览发布计划"前命令式校验架构图，未填素材组的 adset 由 CampaignPlanView 自行高亮 + 滚动定位
  const campaignPlanRef = useRef(null);

  // 架构图 state 提升至 BatchGenerateAds 层，避免 view 切换 (config↔preview) 时 CampaignPlanView 卸载丢失：
  //   adsetAds：每 adset 已分配的 ads 列表（含拖入素材组拆分后的结果）
  //   campaignConfigs：每 campaign 的 locations / language / objective / budget 等
  const [adsetAds, setAdsetAds] = useState({});
  const [campaignConfigs, setCampaignConfigs] = useState({});

  // === TikTok 媒体渠道差异化纠偏 ===
  // TikTok 仅支持 sales_conversions / app_promotion 两类 objective；切到 TikTok
  // 时若用户已选择了不在白名单的 objective，自动降级到 sales_conversions。
  // 注意：onboarding 阶段 objective 为空字符串时不要自动填，否则用户会跳过 step 2 选择。
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

  const [showPublishModal, setShowPublishModal] = useState(false);

  // Publish flow state lifted out of PublishModal: PublishModal is defined inline
  // so each parent re-render gives it a new function identity → React remounts it
  // and would reset its local state. Keeping these here survives remounts.
  const [step, setStep] = useState(1);
  const [showAccountChoice, setShowAccountChoice] = useState(true);
  const [isPublishMinimized, setIsPublishMinimized] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState('Publishing');
  const [adsetProgress, setAdsetProgress] = useState([
    { id: 1, name: 'Adset name 1', totalAds: 3, completedAds: 0, status: 'Publishing' },
    { id: 2, name: 'Adset name 2', totalAds: 2, completedAds: 0, status: 'Waiting' },
    { id: 3, name: 'Adset name 3', totalAds: 4, completedAds: 0, status: 'Waiting' },
  ]);

  // Reset the publish flow every time the user re-opens the Publish modal
  useEffect(() => {
    if (!showPublishModal) return;
    setStep(1);
    setShowAccountChoice(true);
    setIsPublishMinimized(false);
    setCampaignStatus('Publishing');
    setAdsetProgress([
      { id: 1, name: 'Adset name 1', totalAds: 3, completedAds: 0, status: 'Publishing' },
      { id: 2, name: 'Adset name 2', totalAds: 2, completedAds: 0, status: 'Waiting' },
      { id: 3, name: 'Adset name 3', totalAds: 4, completedAds: 0, status: 'Waiting' },
    ]);
  }, [showPublishModal]);

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

  const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === objective);
  const availableGoals = ADSET_GOALS_MAPPING[objective] || [];
  const currentGoalObj = availableGoals.find(g => g.value === adsetGoal);

  const isTargetingComplete =
    selectedLocations.length > 0 &&
    selectedLanguage !== null &&
    platform !== null &&
    objective !== '' &&
    adsetGoal !== '' &&
    !(currentGoalObj?.needsEvent && !event);

  // 广告结构初始化设置完整：targeting 全选 + 日预算 > 0（与 TargetingChannelCard 内部 isInitComplete 保持一致，决定是否暴露 Campaign 结构预览）
  const isInitComplete = isTargetingComplete && Number(dailyBudget) > 0;

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
    setObjective(newObjective);
    setAdsetGoal(firstGoal?.value || '');
    setEvent(firstGoal?.needsEvent ? 'Purchase' : '');
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

  const handlePublishComplete = () => {
    setShowPublishModal(false);
  };

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
            <div 
              onClick={() => { setSelectedCampaignId(null); setShowCampaignModal(false); }}
              className="p-4 rounded-base hover:bg-gray-50 cursor-pointer flex items-center justify-between group border border-transparent hover:border-primary-500/15"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-500/70 rounded-lg flex items-center justify-center"><Plus size={20}/></div>
                <span className="text-sm font-semibold text-gray-400">创建全新系列 (Default)</span>
              </div>
              {!selectedCampaignId && <Check size={18} className="text-primary-500" />}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
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

  const PublishModal = () => {
    const zIndex = useZIndex(true);
    const LOGO_LINKS = {
      meta: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
      google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
      tiktok: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256'
    };

    // 顶部父组件已选的媒体渠道（platform）决定 publish 流程的品牌身份。
    // 若父级是 TikTok 则优先按 TikTok 走；否则沿用旧的 meta/google 优先级。
    const parentPlatformId = platform?.id;
    const parentPlatformName = platform?.name || 'Meta';

    const [selectedAccountType, setSelectedAccountType] = useState('own');
    const [showAdsgoReminder, setShowAdsgoReminder] = useState(false);
    const [hideMainModal, setHideMainModal] = useState(false);
    const [connectedPlatform, setConnectedPlatform] = useState(
      parentPlatformId === 'tiktok'
        ? (authStatus?.tiktok ? 'tiktok' : null)
        : authStatus?.meta ? 'meta' : authStatus?.google ? 'google' : null
    );
    const [isConnecting, setIsConnecting] = useState(false);
    const [platforms, setPlatforms] = useState({
      meta: { connected: !!authStatus?.meta, email: 'alex.designer@meta.com' },
      google: { connected: !!authStatus?.google, email: 'alex.growth@google.com' },
      tiktok: { connected: !!authStatus?.tiktok, email: 'creator@tiktok.com' }
    });

    const [selections, setSelections] = useState({
      adAccount: selectedAccount ? '1' : '',
      fbPage: '',
      pixel: '',
      event: '',
      conversionDataset: '',
      contactPhone: '',
      phoneCountryCode: '+1'
    });
    const [phoneError, setPhoneError] = useState('');
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showTosModal, setShowTosModal] = useState(false);
    const tosZIndex = useZIndex(showTosModal);

    const pubAdAccountLoading = useDropdownLoading('pub_adAccount', !!connectedPlatform);
    const pubFbPageLoading = useDropdownLoading('pub_fbPage', !!connectedPlatform);
    const pubPixelLoading = useDropdownLoading('pub_pixel', !!connectedPlatform);
    const pubEventLoading = useDropdownLoading('pub_event', !!connectedPlatform);

    useEffect(() => { if (activeDropdown === 'adAccount') pubAdAccountLoading.triggerLoad(); }, [activeDropdown]);
    useEffect(() => { if (activeDropdown === 'fbPage') pubFbPageLoading.triggerLoad(); }, [activeDropdown]);
    useEffect(() => { if (activeDropdown === 'pixel') pubPixelLoading.triggerLoad(); }, [activeDropdown]);
    useEffect(() => { if (activeDropdown === 'metaEvent' || activeDropdown === 'googleEvent') pubEventLoading.triggerLoad(); }, [activeDropdown]);

    const publishCampaignName = selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001';



    useEffect(() => {
      if (step === 3) {
        const interval = setInterval(() => {
          setAdsetProgress(prev => {
            const next = prev.map(item => ({ ...item }));
            const publishingIdx = next.findIndex(a => a.status === 'Publishing');
            if (publishingIdx === -1) return prev;

            const current = next[publishingIdx];
            if (current.completedAds < current.totalAds) {
              current.completedAds += 1;
            }
            if (current.completedAds >= current.totalAds) {
              current.status = Math.random() > 0.1 ? 'Success' : 'Failure';
              const nextWaiting = next.findIndex(a => a.status === 'Waiting');
              if (nextWaiting !== -1) {
                next[nextWaiting].status = 'Publishing';
              }
            }

            const allDone = next.every(a => a.status === 'Success' || a.status === 'Failure');
            if (allDone) {
              setCampaignStatus(next.every(a => a.status === 'Success') ? 'Success' : 'Partial');
            }
            return next;
          });
        }, 600);
        return () => clearInterval(interval);
      }
    }, [step]);

    const handleConnect = (platform) => {
      setIsConnecting(platform);
      setTimeout(() => {
        setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: true } }));
        setIsConnecting(false);
        setConnectedPlatform(platform);
        // 同步到父组件
        setAuthStatus(prev => ({ ...prev, [platform]: true }));
      }, 2000);
    };

    const handleDisconnect = (platform) => {
      setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: false } }));
      if (connectedPlatform === platform) setConnectedPlatform(null);
      // 同步到父组件
      setAuthStatus(prev => ({ ...prev, [platform]: false }));
    };

    const CustomDropdown = ({ label, options, value, onChange, placeholder, isOpen, onToggle, isLoading }) => {
      const selectedOption = options.find(opt => opt.value === value);
      return (
        <div className="space-y-2 relative">
          <label className="text-xs font-medium text-gray-500">{label}</label>
          <div onClick={onToggle} className={`w-full h-12 px-4 bg-white border rounded-base flex items-center justify-between cursor-pointer transition-all duration-200 ${isOpen ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-gray-200 hover:border-gray-300'}`}>
            <span className={`text-sm font-bold ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {isOpen && (
            <div className="absolute z-[150] top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-base shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
              {isLoading ? (
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin text-primary-500/70" />
                  <p className="text-xs font-medium text-gray-400 animate-pulse">Loading...</p>
                </div>
              ) : (
                options.map((opt) => (
                  <div key={opt.value} onClick={() => { onChange(opt.value); onToggle(); }} className={`rounded-base px-3 py-2 text-sm font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-primary-50 text-primary-500' : 'hover:bg-gray-50 text-gray-600'}`}>{opt.label}</div>
                ))
              )}
            </div>
          )}
        </div>
      );
    };

    const renderStep1 = () => {
      // 按顶部 platform 决定要展示哪个渠道的连接卡（Meta/TikTok/Google）。
      const stepPlatformId = parentPlatformId === 'tiktok' ? 'tiktok'
        : parentPlatformId === 'google' ? 'google'
        : 'meta';
      const stepPlatformName = stepPlatformId === 'tiktok' ? 'TikTok'
        : stepPlatformId === 'google' ? 'Google'
        : 'Meta';
      const stepLogo = LOGO_LINKS[stepPlatformId] || LOGO_LINKS.meta;
      const stepConnected = !!platforms[stepPlatformId]?.connected;
      const stepEmail = platforms[stepPlatformId]?.email || '';
      const isStepConnecting = isConnecting === stepPlatformId;

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{stepPlatformName} Connection</span>
            </div>

            <div className="relative overflow-hidden group bg-white rounded-inner border border-gray-100 shadow-sm flex items-center transition-all h-16 hover:border-primary-500/15">
              <div className="flex items-center gap-4 px-6 flex-1 min-w-0">
                <div className="w-8 h-8 shrink-0 bg-gray-50 rounded-lg p-1.5 border border-gray-100"><img src={stepLogo} alt={stepPlatformName} className="w-full h-full object-contain" /></div>
                <div className="flex items-center gap-10 w-full">
                  <span className="text-sm font-semibold text-gray-800 shrink-0">{stepPlatformName} Ads</span>
                  {stepConnected ? (
                    <span className="text-sm font-bold text-gray-400 truncate">{stepEmail.split('@')[0]}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-200">Not connected</span>
                  )}
                </div>
              </div>

              <div className="h-full shrink-0 flex items-center pr-4">
                {stepConnected ? (
                  <button
                    onClick={() => handleDisconnect(stepPlatformId)}
                    className="px-6 py-2 text-rose-500 text-xs font-semibold hover:bg-rose-50 rounded-base transition-colors flex items-center gap-2"
                  >
                    <Link2Off size={14} /> Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(stepPlatformId)}
                    disabled={!!isConnecting}
                    className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-2.5 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isStepConnecting ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
                  </button>
                )}
              </div>

              {isStepConnecting && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-300">
                  <p className="text-xs font-medium text-primary-500 animate-pulse">CONNECTING...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderStep2 = () => {
      const isMeta = connectedPlatform === 'meta';
      const isTikTok = connectedPlatform === 'tiktok';
      // Meta + TikTok 共用同一组身份字段（账户 → 身份 → pixel → event）；Google 走原 dataset 流。
      const usesIdentityFlow = isMeta || isTikTok;
      const hasBaseSelections = usesIdentityFlow
        ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
        : (selections.adAccount && selections.conversionDataset && selections.event);
      const isPhoneValid = selections.contactPhone && !validatePhone(selections.contactPhone, selections.phoneCountryCode);
      const canPublish = hasBaseSelections && isPhoneValid;
      const tiktokIdentities = [
        { value: '1', label: '@eco_friendly_brand · Verified' },
        { value: '2', label: '@daily_lifestyle_store · Business' },
      ];
      const options = {
        adAccount: [{ value: '1', label: 'Main Business Account (129-382-991)' }, { value: '2', label: 'Backup Marketing (442-110-872)' }],
        fbPage: isTikTok ? tiktokIdentities : [{ value: '1', label: 'Eco-Friendly Brand' }, { value: '2', label: 'Daily Lifestyle Store' }],
        pixel: [{ value: '1', label: 'Primary Web Pixel (Active)' }],
        metaEvent: [{ value: 'purchase', label: 'Purchase' }, { value: 'add_to_cart', label: 'Add to Cart' }, { value: 'lead', label: 'Lead' }],
        conversionDataset: [{ value: '1', label: 'Primary Conversions' }, { value: '2', label: 'Secondary Goals' }],
        googleEvent: [{ value: 'sales', label: 'Sales' }, { value: 'signup', label: 'Signup' }],
      };
      const identityLabel = isTikTok ? 'TikTok 身份' : 'Facebook page';
      const identityPlaceholder = isTikTok ? '选择身份账号...' : 'Select a page...';
      const handleToggle = (key) => setActiveDropdown(activeDropdown === key ? null : key);
      const showPhone = !!selections.event;
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-gray-50 rounded-inner p-6 space-y-6">
            <CustomDropdown label="Select ad account" options={options.adAccount} value={selections.adAccount} onChange={(val) => setSelections({...selections, adAccount: val})} placeholder="Select an account..." isOpen={activeDropdown === 'adAccount'} onToggle={() => handleToggle('adAccount')} isLoading={pubAdAccountLoading.isLoading} />
            {usesIdentityFlow ? (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label={identityLabel} options={options.fbPage} value={selections.fbPage} onChange={(val) => { setSelections({...selections, fbPage: val}); if (!isTikTok) setShowTosModal(true); }} placeholder={identityPlaceholder} isOpen={activeDropdown === 'fbPage'} onToggle={() => handleToggle('fbPage')} isLoading={pubFbPageLoading.isLoading} /></div>)}{selections.fbPage && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Tracking pixel" options={options.pixel} value={selections.pixel} onChange={(val) => setSelections({...selections, pixel: val})} placeholder="Select a pixel..." isOpen={activeDropdown === 'pixel'} onToggle={() => handleToggle('pixel')} isLoading={pubPixelLoading.isLoading} /></div>)}{selections.pixel && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Event" options={options.metaEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'metaEvent'} onToggle={() => handleToggle('metaEvent')} isLoading={pubEventLoading.isLoading} /></div>)}</>
            ) : (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Conversion dataset" options={options.conversionDataset} value={selections.conversionDataset} onChange={(val) => setSelections({...selections, conversionDataset: val})} placeholder="Select a dataset..." isOpen={activeDropdown === 'conversionDataset'} onToggle={() => handleToggle('conversionDataset')} isLoading={pubFbPageLoading.isLoading} /></div>)}{selections.conversionDataset && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Optimization event" options={options.googleEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'googleEvent'} onToggle={() => handleToggle('googleEvent')} isLoading={pubEventLoading.isLoading} /></div>)}</>
            )}
            {showPhone && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700">Contact Phone</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                        className={`h-12 px-3 flex items-center gap-2 bg-white border rounded-base text-sm font-medium transition-all min-w-[100px] ${isPhoneCodeOpen ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className="text-gray-900">{selections.phoneCountryCode}</span>
                        <ChevronDown size={14} className={`text-gray-300 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isPhoneCodeOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-base shadow-xl max-h-48 overflow-y-auto custom-scrollbar z-[120] animate-in fade-in zoom-in-95 duration-200">
                          {PHONE_COUNTRY_CODES.map(cc => (
                            <button
                              key={cc.code}
                              onClick={() => { setSelections({...selections, phoneCountryCode: cc.code}); setIsPhoneCodeOpen(false); setPhoneError(''); }}
                              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-all flex items-center justify-between ${
                                selections.phoneCountryCode === cc.code ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{cc.country}</span>
                              <span className="text-gray-400 font-bold">{cc.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={selections.contactPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        setSelections({...selections, contactPhone: val});
                        if (val) {
                          setPhoneError(validatePhone(val, selections.phoneCountryCode));
                        } else {
                          setPhoneError('');
                        }
                      }}
                      placeholder="Enter phone number..."
                      className={`flex-1 h-12 px-4 bg-white border rounded-base text-sm font-medium outline-none transition-all ${
                        phoneError ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10'
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} />{phoneError}
                    </p>
                  )}
                </div>
              </div>
            )}
            {!canPublish && selections.adAccount && (<div className="flex items-center gap-2 p-3 bg-primary-50 text-primary-500 rounded-base text-xs font-medium animate-pulse"><AlertCircle size={14} />Please complete all required selections to proceed</div>)}
          </div>
        </div>
      );
    };

    const renderStep3 = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-gray-50 rounded-section p-8 border border-gray-100">
          {/* Campaign Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${campaignStatus === 'Success' ? 'bg-emerald-50 text-emerald-600' : campaignStatus === 'Partial' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-500'}`}>
                {campaignStatus === 'Publishing' ? <Loader2 size={20} className="animate-spin" /> : campaignStatus === 'Success' ? <Check size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">{publishCampaignName}</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                  {adsetProgress.filter(a => a.status === 'Success').length}/{adsetProgress.length} Adsets · {adsetProgress.reduce((s, a) => s + a.completedAds, 0)}/{adsetProgress.reduce((s, a) => s + a.totalAds, 0)} Ads
                </p>
              </div>
            </div>
          </div>

          {/* Adset Progress List */}
          <div className="space-y-2.5 mt-5">
            {adsetProgress.map((a) => (
              <div key={a.id} className="bg-white rounded-inner p-3.5 border border-gray-100 flex items-center justify-between group transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${a.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : a.status === 'Failure' ? 'bg-red-50 text-red-600' : a.status === 'Publishing' ? 'bg-primary-50 text-primary-500' : 'bg-gray-50 text-gray-300'}`}>
                    {a.status === 'Success' ? <Check size={16} /> : a.status === 'Failure' ? <AlertCircle size={16} /> : a.status === 'Publishing' ? <Loader2 size={16} className="animate-spin" /> : <Layout size={14} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{a.name}</h4>
                    <p className={`text-[11px] font-medium ${a.status === 'Success' ? 'text-emerald-500' : a.status === 'Failure' ? 'text-red-500' : a.status === 'Publishing' ? 'text-primary-500' : 'text-gray-400'}`}>{a.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${a.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : a.status === 'Publishing' ? 'bg-primary-50 text-primary-500' : a.status === 'Failure' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                    {a.completedAds}/{a.totalAds} Ads
                  </span>
                  {a.status === 'Failure' && (<button className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><RefreshCw size={12} /></button>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setIsPublishMinimized(true);
            if (onPublishSuccess) onPublishSuccess();
          }}
          className="mt-2 w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          完成，后台继续发布
        </button>
      </div>
    );

    const renderAccountChoiceStep = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden">
        {/* 原本的选择逻辑保留在状态中，UI 按照新样式在 AccountChoiceModal 中重构 */}
      </div>
    );

    if (isPublishMinimized) {
      return (
        <MinimizedPublishIndicator
          campaignStatus={campaignStatus}
          adsetProgress={adsetProgress}
          onExpand={() => setIsPublishMinimized(false)}
          onClose={handlePublishComplete}
        />
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden" style={{ zIndex }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPublishModal(false)} />
        {!hideMainModal && (
          <div className="relative bg-white w-full max-w-xl rounded-section shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="px-10 pt-10 pb-6 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Publishing status</h2>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-gray-100 rounded-base text-gray-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">{renderStep3()}</div>
          </div>
        )}
        {showAccountChoice && <AccountChoiceModal onSelect={(type) => {
          if (type === 'adsgo') {
            setShowAccountChoice(false);
            setShowAdsgoReminder(true);
            setHideMainModal(true);
          } else {
            setShowAccountChoice(false);
            setStep(3); // 自有账号及资产确认后，直接进入发布进度步
          }
        }} onClose={() => { setShowAccountChoice(false); setShowPublishModal(false); }} selectedAccountType={selectedAccountType} setSelectedAccountType={setSelectedAccountType} renderAccountChoiceStep={renderAccountChoiceStep} renderStep1={renderStep1} renderStep2={renderStep2} connectedPlatform={connectedPlatform} selections={selections} />}
        {showAdsgoReminder && <AdsGoReminderModal onClose={() => { setShowAdsgoReminder(false); setShowPublishModal(false); }} setShowPublishModal={setShowPublishModal} />}

        {showTosModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" style={{ zIndex: tosZIndex }}>
            <div className="bg-white w-full max-w-lg rounded-section shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900 leading-snug">请确认您的账户已同意Meta ads的广告条款或政策</h4>
              </div>
              <div className="space-y-5">
                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Meta ads严格要求投放leads广告的主页必须同意《潜在客户广告条款》，请前往{' '}
                    <a href="https://www.facebook.com/legal/leadgen/tos/" target="_blank" rel="noopener noreferrer" className="text-primary-500 font-semibold hover:underline">meta ads tos</a>
                    {' '}确认同意后，回到本页面继续发布；【给开发的备注说明：仅目标为leads广告时出现，】
                  </p>
                </div>
                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Meta ads严格要求特殊行业广告投放必须同意《无歧视政策》，请前往{' '}
                    <a href="https://www.facebook.com/certification/nondiscrimination" target="_blank" rel="noopener noreferrer" className="text-primary-500 font-semibold hover:underline">meta ads nondiscrimination</a>
                    {' '}同意后，回到本页面继续发布；【给开发的备注说明：仅目标为特殊行业广告时出现】
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTosModal(false)}
                className="w-full py-3.5 bg-primary-500 text-white rounded-base text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus shadow-lg shadow-primary-500/20"
              >
                Confirmed to have been checked
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50/50 min-h-full">
      {/* Sticky Channel + Account header — 仅 onboarding 完成（platform + objective 均已选）后渲染，
          避免与入场两步选择卡片同屏出现导致重复操作 */}
      {view === 'config' && platform && objective && (
        <div className="sticky top-0 w-full px-4 md:px-8 pt-4 animate-in slide-in-from-top-full duration-500" style={{ zIndex: Z_INDEX.HEADER }}>
          <div className="max-w-7xl mx-auto">
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
              objective={objective}
              onChangeObjective={handleChangeObjective}
              availableObjectives={getAvailableObjectives(platform?.id)}
            />
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-7xl">

          {view === 'config' ? (
            (!platform || !objective) ? (
              <ChannelPickerHero
                platforms={PLATFORMS}
                onPick={(p) => setPlatform(p)}
                platform={platform}
                objective={objective}
                onPickObjective={handleChangeObjective}
                availableObjectives={getAvailableObjectives(platform?.id)}
              />
            ) : (
            <div className="space-y-8 animate-fade-in pb-20">

              {/* Card 2: Add Product */}
              <div className="bg-white rounded-section p-10 adsgo-card-shadow">
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
                  platform={platform}
                  availableAccounts={platform ? (PLATFORM_ACCOUNTS[platform.id] || []) : []}
                />
              </div>

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

              {/* Card 2.5: 广告结构初始化设置 — between workbench and strategy */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                <TargetingChannelCard
                  objective={objective} setObjective={setObjective}
                  adsetGoal={adsetGoal} setAdsetGoal={setAdsetGoal} event={event} setEvent={setEvent}
                  selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations}
                  openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} dropdownRef={dropdownRef}
                  locationSearch={locationSearch} setLocationSearch={setLocationSearch}
                  eventSearch={eventSearch} setEventSearch={setEventSearch}
                  objectiveStage={objectiveStage} setObjectiveStage={setObjectiveStage}
                  filteredCountries={filteredCountries} filteredEvents={filteredEvents} toggleLocation={toggleLocation}
                  currentObjectiveObj={currentObjectiveObj} currentGoalObj={currentGoalObj} availableGoals={availableGoals}
                  selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
                  languageSearch={languageSearch} setLanguageSearch={setLanguageSearch}
                  filteredLanguages={filteredLanguages}
                  structure={structure} onStructureChange={handleStructureChange}
                  adType={adType} onAdTypeChange={setAdType}
                  placementMode={placementMode} setPlacementMode={setPlacementMode}
                  manualPlacements={manualPlacements} setManualPlacements={setManualPlacements}
                  platform={platform} campaignType={campaignType}
                  dailyBudget={dailyBudget} setDailyBudget={setDailyBudget}
                  budgetType={budgetType} setBudgetType={setBudgetType}
                  productCount={selectedProducts.length}
                  advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen}
                  startDate={startDate} setStartDate={setStartDate}
                  endDate={endDate} setEndDate={setEndDate}
                  onQuickSchedule={handleQuickSchedule}
                  bidStrategy={bidStrategy} onChangeBidStrategy={handleChangeBidStrategy}
                  bidAmount={bidAmount} setBidAmount={setBidAmount}
                  globalAdsetLalInclude={globalAdsetLalInclude} setGlobalAdsetLalInclude={setGlobalAdsetLalInclude}
                  globalAdsetCustomInclude={globalAdsetCustomInclude} setGlobalAdsetCustomInclude={setGlobalAdsetCustomInclude}
                  globalAdsetLalExclude={globalAdsetLalExclude} setGlobalAdsetLalExclude={setGlobalAdsetLalExclude}
                  globalAdsetCustomExclude={globalAdsetCustomExclude} setGlobalAdsetCustomExclude={setGlobalAdsetCustomExclude}
                  authStatus={authStatus}
                  onAuthorize={handleAuthorizeChannel}
                  isAuthLoading={channelAuthLoading}
                  selectedAccount={selectedAccount}
                  onPickAccount={() => setShowMetaAccountPicker(true)}
                >
                  {/* Naming Strategy */}
                  <NamingStrategySection
                    campaignNameTemplate={campaignNameTemplate}
                    setCampaignNameTemplate={setCampaignNameTemplate}
                    adsetNameTemplate={adsetNameTemplate}
                    setAdsetNameTemplate={setAdsetNameTemplate}
                    adNameTemplate={adNameTemplate}
                    setAdNameTemplate={setAdNameTemplate}
                    selectedLocations={selectedLocations}
                    selectedProducts={selectedProducts}
                  />

                  {/* Landing Page Strategy */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <label className="text-xs font-medium text-gray-500">投放落地页策略</label>
                      <Info size={12} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-10 flex flex-col md:flex-row gap-10">
                      <div className="flex flex-col gap-3 w-full md:w-80">
                        {[
                          { id: 'PRODUCT', label: '投放单品落地页', desc: 'Direct Product SKU', icon: <Tag size={18} /> },
                          { id: 'CATEGORY', label: '投放类目落地页', desc: 'Collection / Search', icon: <Layout size={18} /> },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setLpType(opt.id)}
                            className={`flex items-center gap-4 p-5 rounded-base border-2 transition-all ${
                              lpType === opt.id
                                ? 'bg-white border-primary-500 shadow-primary-focus'
                                : 'bg-transparent border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${lpType === opt.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-400'}`}>
                              {opt.icon}
                            </div>
                            <div className="text-left">
                              <p className={`text-xs font-semibold ${lpType === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</p>
                              <p className="text-xs text-gray-400 font-bold mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        {lpType === 'PRODUCT' ? (
                          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                            <div className="p-6 bg-primary-50/50 rounded-section border border-primary-500/10 mb-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm shrink-0">
                                  <Target size={20} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-900 tracking-tight">自动路由至产品单页</h4>
                                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                                    系统将使用所选产品的原始落地页。您可以在下方为所有单品 URL 统一增加 UTM 追踪参数。
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-medium text-gray-500 px-1">统一 UTM 追踪参数</label>
                              <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors">
                                  <Settings size={22} />
                                </div>
                                <input
                                  type="text"
                                  value={productLpUtm}
                                  onChange={(e) => setProductLpUtm(e.target.value)}
                                  placeholder="utm_source=meta&utm_medium=paid&utm_campaign={{product_id}}"
                                  className="w-full h-14 pl-16 pr-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                            <div className="space-y-3">
                              <label className="text-xs font-medium text-gray-500 px-1">落地页模板 URL (支持动态参数)</label>
                              <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors">
                                  <Link2 size={24} />
                                </div>
                                <input
                                  type="text"
                                  value={lpTemplateUrl}
                                  onChange={(e) => setLpTemplateUrl(e.target.value)}
                                  placeholder="https://example.com/collections/{{product_name}}"
                                  className="w-full h-16 pl-16 pr-24 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ad 策略：父级 section 标题；下辖 Ad Format + 广告文案与标题 两个 sub-field（用 eyebrow 标签压低视觉权重，建立层级） */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <label className="text-xs font-medium text-gray-500">Ad 策略</label>
                      <Info size={12} className="text-gray-300" />
                    </div>

                    <div className="border-l-2 border-gray-100 pl-5 space-y-6">
                      {/* Ad Format — 仅在 sales_conversions / app_promotion 目标下显示；TikTok 强制 SINGLE，整段隐藏 */}
                      {(objective === 'sales_conversions' || objective === 'app_promotion') && platform?.id !== 'tiktok' && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 block">Ad Format</span>
                          <div className="flex p-1 bg-gray-100/80 rounded-base border border-gray-100 w-fit">
                            <button
                              onClick={() => setAdType('FLEXIBLE')}
                              className={`px-6 py-2.5 rounded-base text-xs font-medium transition-all ${adType === 'FLEXIBLE' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              Flexible Ad
                            </button>
                            <button
                              onClick={() => setAdType('SINGLE')}
                              className={`px-6 py-2.5 rounded-base text-xs font-medium transition-all ${adType === 'SINGLE' ? 'bg-white text-primary-500 shadow-adsgo-card' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              Single Ad
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 block">广告文案与标题</span>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-10 flex flex-col md:flex-row gap-10">
                      <div className="flex flex-col gap-3 w-full md:w-80">
                        {[
                          { id: 'AI_CUSTOM', label: 'AI 为每个产品定制', desc: 'Custom per SKU', icon: <Sparkles size={18} /> },
                          { id: 'UNIFIED', label: '为所有广告输入统一文案', desc: 'Unified Headlines & Text', icon: <FileText size={18} /> },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setCopyStrategy(opt.id)}
                            className={`flex items-center gap-4 p-5 rounded-base border-2 transition-all ${
                              copyStrategy === opt.id
                                ? 'bg-white border-primary-500 shadow-primary-focus'
                                : 'bg-transparent border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${copyStrategy === opt.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-400'}`}>
                              {opt.icon}
                            </div>
                            <div className="text-left">
                              <p className={`text-xs font-semibold ${copyStrategy === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</p>
                              <p className="text-xs text-gray-400 font-bold mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        {copyStrategy === 'AI_CUSTOM' ? (
                          <div className="p-8 bg-primary-50/50 rounded-section border border-primary-500/10 animate-in fade-in slide-in-from-left-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm shrink-0">
                                <Sparkles size={24} />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 tracking-tight">AI 智能深度定制文案</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                                  基于落地页分析报告，Agent 将为每一个产品自动撰写差异化的广告标题和正文，最大化转化率。
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 px-1">
                                <label className="text-xs font-medium text-gray-500">应用方式</label>
                                <Info size={12} className="text-gray-300" />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                  { id: 'AI_MATCH', label: 'AI 匹配', desc: 'AI 自动匹配文案到素材', icon: <Sparkles size={16} /> },
                                  { id: 'SEQUENTIAL', label: '按素材组顺序', desc: '按创意素材组顺序循环应用', icon: <Layers size={16} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setUnifiedCopyApplyMode(opt.id)}
                                    className={`flex items-center gap-3 p-4 rounded-base border-2 transition-all text-left ${
                                      unifiedCopyApplyMode === opt.id
                                        ? 'bg-white border-primary-500 shadow-primary-focus'
                                        : 'bg-transparent border-gray-100 hover:border-gray-200'
                                    }`}
                                  >
                                    <div className={`w-9 h-9 rounded-base flex items-center justify-center transition-colors ${unifiedCopyApplyMode === opt.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="min-w-0">
                                      <p className={`text-xs font-semibold ${unifiedCopyApplyMode === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</p>
                                      <p className="text-xs text-gray-400 font-medium truncate">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-medium text-gray-500">文案组（标题 + 正文）</label>
                                {platform?.id === 'tiktok' && (
                                  <span className="text-xs text-gray-400 font-medium">TikTok 每组仅 1 条标题 + 1 条正文</span>
                                )}
                              </div>
                              {(() => {
                                const isSequentialApply = unifiedCopyApplyMode === 'SEQUENTIAL';
                                // SEQUENTIAL：每个素材组对应一个文案组，标题用「素材组-{groupName}」，文案不可增删
                                // AI_MATCH：用户自管理 unifiedCopyGroups
                                const displayGroups = isSequentialApply
                                  ? allCreativeGroupsForCopy.map(cg => {
                                      const ov = creativeGroupCopyOverrides[cg.key] || {};
                                      return {
                                        id: cg.key,
                                        displayName: `${cg.productName} · ${cg.groupName}`,
                                        headlines: ov.headlines || [''],
                                        bodies: ov.bodies || [''],
                                        _onUpdate: (patch) => setCreativeGroupCopyOverrides(prev => {
                                          const cur = prev[cg.key] || { headlines: [''], bodies: [''] };
                                          return { ...prev, [cg.key]: { headlines: cur.headlines, bodies: cur.bodies, ...patch } };
                                        }),
                                        _onDelete: null,
                                        _canDelete: false,
                                      };
                                    })
                                  : unifiedCopyGroups.map((g, i) => ({
                                      id: g.id,
                                      displayName: `文案组 ${i + 1}`,
                                      headlines: g.headlines || [''],
                                      bodies: g.bodies || [''],
                                      _onUpdate: (patch) => setUnifiedCopyGroups(prev => prev.map(x => x.id === g.id ? { ...x, ...patch } : x)),
                                      _onDelete: () => setUnifiedCopyGroups(prev => prev.filter(x => x.id !== g.id)),
                                      _canDelete: unifiedCopyGroups.length > 1,
                                    }));

                                if (isSequentialApply && allCreativeGroupsForCopy.length === 0) {
                                  return (
                                    <div className="text-center py-8 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-inner">
                                      <p className="text-xs font-medium text-gray-400 leading-relaxed">
                                        请先在上方添加产品并配置素材组，<br/>文案组将自动按素材组数量与顺序生成。
                                      </p>
                                    </div>
                                  );
                                }

                                return (
                                  <>
                                    {isSequentialApply && (
                                      <p className="text-[11px] text-gray-400 font-medium px-1 leading-relaxed flex items-start gap-1">
                                        <Info size={10} className="text-gray-300 shrink-0 mt-0.5" />
                                        <span>已按素材组数量与顺序自动展开 — 每个文案组对应一个素材组，可独立定制内容</span>
                                      </p>
                                    )}
                                    {displayGroups.map(entry => {
                                      const isTikTok = platform?.id === 'tiktok';
                                      const maxItemsPerGroup = isTikTok ? 1 : 5;
                                      const headlines = entry.headlines;
                                      const bodies = entry.bodies;
                                      const updateGroup = entry._onUpdate;
                                      return (
                                        <div key={entry.id} className="bg-white border border-gray-100 rounded-inner p-5 space-y-4">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <FileText size={14} className="text-primary-500/70 shrink-0" />
                                              <span className="text-xs font-semibold text-gray-700 truncate">{entry.displayName}</span>
                                            </div>
                                            {entry._canDelete && entry._onDelete && (
                                              <button
                                                onClick={entry._onDelete}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                                                title="删除该文案组"
                                              >
                                                <X size={14} />
                                              </button>
                                            )}
                                          </div>

                                          {/* 标题列表 */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                              <label className="text-xs font-medium text-gray-400">统一广告标题</label>
                                              {!isTikTok && (
                                                <span className="text-xs text-gray-400">{headlines.length}/{maxItemsPerGroup}</span>
                                              )}
                                            </div>
                                            {headlines.map((h, hi) => (
                                              <div key={hi} className="flex items-center gap-2">
                                                <input
                                                  type="text"
                                                  value={h}
                                                  onChange={(e) => {
                                                    const next = [...headlines];
                                                    next[hi] = e.target.value;
                                                    updateGroup({ headlines: next });
                                                  }}
                                                  placeholder={`请输入广告标题${headlines.length > 1 ? ` ${hi + 1}` : ''}...`}
                                                  className="flex-1 h-12 px-4 bg-gray-50 border border-gray-100 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:bg-white focus:shadow-primary-focus transition-all"
                                                />
                                                {!isTikTok && headlines.length > 1 && (
                                                  <button
                                                    onClick={() => updateGroup({ headlines: headlines.filter((_, j) => j !== hi) })}
                                                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                                    title="删除该标题"
                                                  >
                                                    <X size={14} />
                                                  </button>
                                                )}
                                              </div>
                                            ))}
                                            {!isTikTok && headlines.length < maxItemsPerGroup && (
                                              <button
                                                onClick={() => updateGroup({ headlines: [...headlines, ''] })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-50 rounded-base transition-colors"
                                              >
                                                <Plus size={12} /> 添加标题
                                              </button>
                                            )}
                                          </div>

                                          {/* 正文列表 */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                              <label className="text-xs font-medium text-gray-400">统一广告正文</label>
                                              {!isTikTok && (
                                                <span className="text-xs text-gray-400">{bodies.length}/{maxItemsPerGroup}</span>
                                              )}
                                            </div>
                                            {bodies.map((b, bi) => (
                                              <div key={bi} className="flex items-start gap-2">
                                                <textarea
                                                  value={b}
                                                  onChange={(e) => {
                                                    const next = [...bodies];
                                                    next[bi] = e.target.value;
                                                    updateGroup({ bodies: next });
                                                  }}
                                                  placeholder={`请输入广告正文${bodies.length > 1 ? ` ${bi + 1}` : ''}...`}
                                                  className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-base outline-none text-sm text-gray-700 h-24 focus:border-primary-500 focus:bg-white focus:shadow-primary-focus transition-all resize-none"
                                                />
                                                {!isTikTok && bodies.length > 1 && (
                                                  <button
                                                    onClick={() => updateGroup({ bodies: bodies.filter((_, j) => j !== bi) })}
                                                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors mt-1"
                                                    title="删除该正文"
                                                  >
                                                    <X size={14} />
                                                  </button>
                                                )}
                                              </div>
                                            ))}
                                            {!isTikTok && bodies.length < maxItemsPerGroup && (
                                              <button
                                                onClick={() => updateGroup({ bodies: [...bodies, ''] })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-50 rounded-base transition-colors"
                                              >
                                                <Plus size={12} /> 添加正文
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {!isSequentialApply && (
                                      <button
                                        onClick={() => setUnifiedCopyGroups(prev => [
                                          ...prev,
                                          { id: _genId(), headlines: [''], bodies: [''] },
                                        ])}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary-500 hover:bg-primary-50 rounded-base transition-colors"
                                      >
                                        <Plus size={14} /> 添加文案组
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                      </div>
                    </div>
                  </div>

                  {/* 排期已合并到「版位与排期」子模块（在 TargetingChannelCard 内渲染） */}
                </TargetingChannelCard>
              )}

              {/* Card 3: Strategy & Budget — 仅当广告结构初始化设置完整且产品就绪后才暴露 */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && isInitComplete && (
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
                      structure={structure} onStructureChange={handleStructureChange}
                      campaignType={campaignType}
                      budgetType={budgetType} onBudgetTypeChange={setBudgetType}
                      dailyBudget={dailyBudget} onBudgetChange={setDailyBudget}
                      adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                      onSetAudienceType={handleSetAudienceType}
                      adsetAudienceDetails={adsetAudienceDetails} onSaveAdsetAudienceDetails={handleSaveAdsetAudienceDetails}
                      adType={adType} onAdTypeChange={setAdType} objective={objective}
                      selectedProducts={selectedProducts}
                      productCreativesMap={productCreativesMap}
                      productCreativeGroups={productCreativeGroupsMap}
                      sectionDefaults={{
                        selectedLocations,
                        selectedLanguage,
                        objective,
                        adsetGoal,
                        event,
                        dailyBudget,
                        budgetType,
                        bidStrategy,
                        bidAmount,
                        lalInclude: globalAdsetLalInclude,
                        customInclude: globalAdsetCustomInclude,
                        lalExclude: globalAdsetLalExclude,
                        customExclude: globalAdsetCustomExclude,
                      }}
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
                    />
                 </div>
              )}

              {/* Preview Button — 与 Campaign 结构预览一同出现，仅在结构初始化完成后暴露 */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && isInitComplete && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      const result = campaignPlanRef.current?.validateAdsets?.();
                      if (result && !result.ok) return; // 存在空 adset → CampaignPlanView 已自行高亮 + 滚动
                      setView('preview'); _hasGeneratedOnce = true; setHasGeneratedOnce(true);
                    }}
                    className="group relative w-full max-w-4xl py-8 px-16 rounded-full font-bold text-2xl flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 shadow-xl transition-all"
                  >
                    <Sparkles size={28} className="mr-5" />
                    预览发布计划
                  </button>
                </div>
              )}
            </div>
            )
          ) : (
            // Preview View Wrapper - Keeping the original card style for the preview page
            <div className="bg-white rounded-section shadow-xl border border-gray-100 overflow-hidden relative mb-20 animate-fade-in">
              <div className="p-10 md:p-14">
                <CampaignPreviewView
                  structure={structure}
                  numCampaigns={Math.max(structure.numCampaigns || 1, 1)}
                  budgetType={budgetType}
                  dailyBudget={dailyBudget}
                  initialAdsetAudiences={adsetAudiences} 
                  productCreativesMap={productCreativesMap}
                  selectedProducts={selectedProducts}
                  brand={detectedBrand}
                  onBack={() => setView('config')}
                  onPublish={() => setShowPublishModal(true)}
                  campaignName={selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001'}
                  isExistingCampaign={!!selectedCampaignId}
                  campaignObjective={objective}
                  bidStrategy={bidStrategy}
                  bidAmount={bidAmount}
                  globalLalInclude={globalAdsetLalInclude}
                  globalCustomInclude={globalAdsetCustomInclude}
                  globalLalExclude={globalAdsetLalExclude}
                  globalCustomExclude={globalAdsetCustomExclude}
                  optimizationEvent={event || currentGoalObj?.label || currentObjectiveObj?.label || ''}
                  landingPageType={lpType}
                  landingPageTemplate={lpTemplateUrl}
                  productUtm={productLpUtm}
                  copyStrategy={copyStrategy}
                  unifiedHeadline={unifiedCopyGroups.map(g => (g.headlines && g.headlines[0]) || '')}
                  unifiedBody={unifiedCopyGroups.map(g => (g.bodies && g.bodies[0]) || '')}
                  unifiedCopyGroups={unifiedCopyGroups}
                  unifiedCopyApplyMode={unifiedCopyApplyMode}
                  campaignType={campaignType}
                  estimatedTotalDaily={estimatedTotalDaily}
                  adSetGroupsCount={adSetGroupsCount}
                  adType={adType}
                  adsetAudienceDetails={adsetAudienceDetails}
                  platform={platform}
                  authStatus={authStatus}
                  selectedAccount={selectedAccount}
                  onAuthStatusChange={setAuthStatus}
                  onSelectAccount={() => setShowMetaAccountPicker(true)}
                  onAuthorizeChannel={async (platformId) => {
                    await handleAuthorizeChannel(platformId);
                    if ((platformId === 'meta' || platformId === 'tiktok' || platformId === 'google') && !selectedAccount) {
                      accountPickLoading.triggerLoad();
                      setShowMetaAccountPicker(true);
                    }
                  }}
                  onOpenAccountPicker={() => { accountPickLoading.triggerLoad(); setShowMetaAccountPicker(true); }}
                  channelAuthLoading={channelAuthLoading}
                  onBudgetChange={setDailyBudget}
                  onBudgetTypeChange={setBudgetType}
                  campaignNameTemplate={campaignNameTemplate}
                  adsetNameTemplate={adsetNameTemplate}
                  adNameTemplate={adNameTemplate}
                  selectedLocations={selectedLocations}
                  selectedCatalog={selectedCatalog}
                  selectedProductSet={selectedProductSet}
                  onSelectCatalog={setSelectedCatalog}
                  onSelectProductSet={setSelectedProductSet}
                />
              </div>
            </div>
          )}
          
        </div>
      </div>

      {showCampaignModal && <CampaignSearchModal />}
      {showPublishModal && <PublishModal />}
      
      {showAccountSelector && <AccountSelectorModal selectedAccount={selectedAccount} onSelect={setSelectedAccount} onClose={() => setShowAccountSelector(false)} isLoading={accountSwitchLoading.isLoading} />}

      {showMetaAccountPicker && <MetaAccountPickerModal selectedAccount={selectedAccount} onSelect={(acc) => { setSelectedAccount(acc); setShowMetaAccountPicker(false); }} onClose={() => setShowMetaAccountPicker(false)} isLoading={accountPickLoading.isLoading} />}

    </div>
  );
};

const AccountChoiceModal = ({ onSelect, onClose, selectedAccountType, setSelectedAccountType, renderStep1, renderStep2, connectedPlatform, selections }) => {
  const zIndex = useZIndex(true);
  const isMeta = connectedPlatform === 'meta';
  const isTikTok = connectedPlatform === 'tiktok';
  // Meta + TikTok 共用身份字段流；Google 走 conversion dataset 流。
  const usesIdentityFlow = isMeta || isTikTok;
  const hasBaseSelections = usesIdentityFlow
    ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
    : (selections.adAccount && selections.conversionDataset && selections.event);
  const canProceed = hasBaseSelections && selections.contactPhone && !validatePhone(selections.contactPhone, selections.phoneCountryCode);
  const platformLabel = isTikTok ? 'TikTok' : isMeta ? 'Meta' : 'Google';
  const identityLabel = isTikTok ? 'TikTok 身份' : isMeta ? 'Facebook page' : '转化数据集';
  const identityPlural = isTikTok ? 'TikTok 身份' : isMeta ? 'Facebook Pages' : '转化数据集';

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-section shadow-xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="px-10 pt-10 pb-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {selectedAccountType === 'own' ? 'Account Connection Needed' : 'Let AdsGo Handle Everything'}
              </h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-md">
                {selectedAccountType === 'own'
                  ? `Please connect your ${platformLabel} account, and select a valid ad account and ${identityLabel} to publish your ads.`
                  : `We've prepped everything for you : Stable ad accounts, professional ${identityPlural}.`}
              </p>
            </div>
            <button 
              onClick={() => setSelectedAccountType(selectedAccountType === 'own' ? 'adsgo' : 'own')}
              className="text-primary-500 hover:bg-primary-50 active:bg-primary-100 rounded-base text-sm font-medium transition-all duration-200 px-4 py-2 flex items-center gap-2 group shrink-0"
            >
              {selectedAccountType === 'own' ? "Use AdsGo's account" : "Use my own account"}
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {selectedAccountType === 'own' ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              {renderStep1()}
              {connectedPlatform && (
                <div className="pt-6 border-t border-gray-50 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6"><h4 className="text-sm font-semibold text-gray-900 mb-1">Select your assets</h4><p className="text-xs font-medium text-gray-500">Configure the ad account and tracking for this campaign</p></div>
                  {renderStep2()}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 p-1 relative group overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-500/10 to-primary-500/20 animate-pulse" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-12 flex flex-col items-center text-center space-y-6 shadow-xl shadow-emerald-100/50 animate-in zoom-in-95">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse" />
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 relative z-10">
                    <Briefcase size={36} />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-emerald-600/80 tracking-wide">Let AdsGo manage your advertising setup</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/50 shrink-0">
          <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-6 py-2 transition-colors font-sans">Cancel</button>
          <button 
            onClick={() => onSelect(selectedAccountType)} 
            disabled={selectedAccountType === 'own' ? !canProceed : false} 
            className="inline-flex items-center justify-center bg-primary-500 text-white px-12 py-4 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed gap-3"
          >
            {selectedAccountType === 'own' ? 'Confirm and Publish' : 'Confirm'} 
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdsGoReminderModal = ({ onClose, setShowPublishModal }) => {
  const zIndex = useZIndex(true);
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
      <div className="relative bg-white w-full max-w-md rounded-section shadow-xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-base text-gray-400 transition-colors"><X size={20} /></button>
        <div className="flex flex-col items-center text-center space-y-6 pt-4"><div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center animate-bounce"><Loader2 size={40} className="text-emerald-600 animate-spin" /></div><div className="space-y-3"><h3 className="text-lg font-semibold text-gray-900 tracking-tight">Setting up your dedicated ad account</h3><p className="text-sm font-medium text-gray-600 leading-relaxed">An advertising specialist will contact you at your registered email address shortly; please check your email. you can republish from the <button onClick={() => { setShowPublishModal(false); window.location.href = '/ai-optimize/autoRegeneration'; }} className="text-primary-500 hover:text-primary-600 underline transition-colors bg-transparent border-0 p-0 cursor-pointer">Draft & Recom.</button> page.</p><p className="text-xs font-bold text-gray-500">Contact us at<br/><a href="mailto:support@adsgo.ai" className="text-primary-500 hover:text-primary-600 transition-colors">support@adsgo.ai</a> for real-time updates</p></div></div>
      </div>
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

export default BatchGenerateAds;
