import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Globe, Monitor, Target, ShoppingBag, ChevronDown, Sparkles, Search, 
  Briefcase, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText, 
  Type, Calendar, Clock, Rocket, Facebook, Instagram, Hash, Loader2, 
  CheckCircle2, Layers, RefreshCw, MapPin, Zap, ArrowRight, ChevronLeft, 
  Megaphone, MousePointer2, Users, Smartphone, ChevronRight, Link2Off, AlertCircle
} from 'lucide-react';
import { Z_INDEX } from '../../constants/zIndex';
import { useZIndex } from '../../hooks/useZIndex';
import ProductSelector from './components/ProductSelector';
import CampaignPlanView from './components/CampaignPlanView';
import CampaignPreviewView from './components/CampaignPreviewView';
import ObjectiveSection from '../brand/optimizeGoals/ObjectiveSection';
import BudgetKPISection from '../brand/optimizeGoals/BudgetKPISection';

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

const MOCK_PAGES = [
  { id: 'page_123', name: 'Luminaire Vintage Official' },
  { id: 'page_456', name: 'Retro Fashion Daily' },
];

const PLATFORMS = [
  { id: 'meta', name: 'Meta', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', name: 'Google', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256', disabled: true },
  { id: 'tiktok', name: 'TikTok', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256', disabled: true },
  { id: 'bing', name: 'Bing', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256', disabled: true }
];

const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Reach more people' },
  { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site visits' },
  { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Find prospects' },
  { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive transactions' },
  { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-primary-500', bg: 'bg-primary-50', description: 'Install & usage' }
];

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

// AI Recommendation mock values
const AI_RECOMMENDED = {
  platform: PLATFORMS[0], // Meta
  objective: 'sales_conversions',
  adsetGoal: 'in_web_actions',
  event: 'Purchase',
  locations: [{ code: 'US', name: 'United States' }]
};

// Module-level flag: survives SPA navigation, resets on browser refresh
let _hasGeneratedOnce = false;

// Extracted Targeting & Channel Card component
const TargetingChannelCard = ({
  platform, setPlatform, objective, setObjective, adsetGoal, setAdsetGoal, event, setEvent,
  selectedLocations, setSelectedLocations, openDropdown, setOpenDropdown, dropdownRef,
  locationSearch, setLocationSearch, eventSearch, setEventSearch, objectiveStage, setObjectiveStage,
  filteredCountries, filteredEvents, toggleLocation, currentObjectiveObj, currentGoalObj, availableGoals,
  showAiRecommendation, allAnalysesComplete
}) => {
  const AiLabel = ({ field, recommendedLabel, onApply }) => {
    if (!showAiRecommendation) return null;
    if (!allAnalysesComplete) {
      return (
        <div className="flex items-center gap-1.5 mt-2 px-1">
          <Loader2 size={11} className="animate-spin text-amber-500" />
          <span className="text-xs font-medium text-amber-500">AI 分析推荐中...</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 mt-2 px-1">
        <span className="text-xs font-medium text-primary-500">✦ AI recommended：{recommendedLabel}</span>
        <button onClick={onApply} className="px-2 py-0.5 text-xs font-medium text-white bg-primary-500 rounded-tag hover:bg-primary-600 transition-colors">
          Apply
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><Target size={20} /></div>
        <h3 className="text-xl font-semibold text-gray-900">投放目标与渠道</h3>
        {showAiRecommendation && !allAnalysesComplete && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-500 rounded-tag text-xs font-medium">
            <Loader2 size={11} className="animate-spin" /> AI 智能推荐配置中...
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-[10]">
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
          <AiLabel field="location" recommendedLabel="United States" onApply={() => setSelectedLocations(AI_RECOMMENDED.locations)} />
        </div>

        {/* Platform Selector */}
        <div>
          <div className="relative" ref={openDropdown === 'platform' ? dropdownRef : null}>
            <div onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">投放渠道媒体</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {platform ? (
                    <><img src={platform.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" /><span className="text-sm font-bold text-gray-700 truncate">{platform.name}</span></>
                  ) : <span className="text-sm font-bold text-gray-300">待选择...</span>}
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'platform' && (
              <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-base shadow-xl border border-gray-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                {PLATFORMS.map(p => (
                  <div key={p.id} className="relative group">
                    <button disabled={p.disabled}
                      onClick={() => { if (!p.disabled) { setPlatform(p); setOpenDropdown(null); } }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-base transition-all ${
                        p.disabled ? 'opacity-40 cursor-not-allowed' : platform?.id === p.id ? 'bg-primary-50 text-primary-500' : 'hover:bg-gray-50 text-gray-600'}`}>
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
          <AiLabel field="platform" recommendedLabel="Meta" onApply={() => setPlatform(AI_RECOMMENDED.platform)} />
        </div>

        {/* Objective Selector */}
        <div>
          <div className="relative" ref={openDropdown === 'objective' ? dropdownRef : null}>
            <div onClick={() => { setOpenDropdown(openDropdown === 'objective' ? null : 'objective'); setObjectiveStage('goal'); }}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">核心投放目标</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Target size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 truncate">{currentObjectiveObj?.label || <span className="text-gray-300">待选择...</span>}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${openDropdown === 'objective' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'objective' && (
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-base shadow-xl border border-gray-100 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-medium text-gray-500 px-2">Select objective</p>
                <div className="space-y-1.5">
                  {CAMPAIGN_OBJECTIVES.map(obj => {
                    const Icon = obj.icon;
                    return (
                      <button key={obj.value} onClick={() => {
                        const firstGoal = ADSET_GOALS_MAPPING[obj.value][0];
                        setObjective(obj.value); setAdsetGoal(firstGoal.value); setEvent(firstGoal.needsEvent ? 'Purchase' : ''); setOpenDropdown(null);
                      }} className={`w-full text-left p-3 rounded-base transition-all flex items-center gap-3 ${
                        objective === obj.value ? 'bg-primary-50 text-primary-500 ring-1 ring-primary-500/20 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${objective === obj.value ? 'bg-primary-500 text-white' : obj.bg + ' ' + obj.color}`}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-none mb-1">{obj.label}</p>
                          <p className="text-xs font-medium opacity-60 truncate">{obj.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <AiLabel field="objective" recommendedLabel="Sales & Conversions" onApply={() => {
            setObjective(AI_RECOMMENDED.objective);
            setAdsetGoal(AI_RECOMMENDED.adsetGoal);
            setEvent(AI_RECOMMENDED.event);
          }} />
        </div>

        {/* Event Selector */}
        <div>
          <div className="relative" ref={openDropdown === 'event' ? dropdownRef : null}>
            <div onClick={() => { setOpenDropdown(openDropdown === 'event' ? null : 'event'); setObjectiveStage('goal'); }}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">转化优化事件</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Zap size={16} className="text-primary-500 shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-sm font-bold text-gray-700 truncate">{currentGoalObj?.label || <span className="text-gray-300">待选择...</span>}</span>
                    {event && <><ChevronRight size={10} className="text-gray-300 shrink-0" /><span className="text-sm font-bold text-primary-500 truncate">{event}</span></>}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${openDropdown === 'event' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'event' && (
              <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-base shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                {objectiveStage === 'goal' ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 px-2">Select conversion event</p>
                    <div className="space-y-1">
                      {availableGoals.map(goal => (
                        <button key={goal.value} onClick={() => {
                          setAdsetGoal(goal.value);
                          if (goal.needsEvent) { setObjectiveStage('event'); } else { setEvent(''); setOpenDropdown(null); }
                        }} className={`w-full text-left px-4 py-3 rounded-base text-xs font-bold transition-all flex items-center justify-between group ${
                          adsetGoal === goal.value ? 'bg-primary-500 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                          {goal.label}
                          {goal.needsEvent ? <ArrowRight size={12} className="opacity-40 group-hover:translate-x-1 transition-all" /> : (adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setObjectiveStage('goal')} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"><ChevronLeft size={16} /></button>
                      <p className="text-xs font-medium text-gray-500">BACK</p>
                    </div>
                    <div className="relative px-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                      <input className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-base text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/10"
                        placeholder="Search events..." value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} autoFocus />
                    </div>
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar px-1 space-y-1">
                      {filteredEvents.map(ev => (
                        <button key={ev} onClick={() => { setEvent(ev); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2.5 rounded-base text-xs font-bold transition-all flex items-center justify-between ${
                            event === ev ? 'bg-primary-500 text-white shadow-primary-focus' : 'hover:bg-gray-50 text-gray-600'}`}>
                          {ev}
                          {event === ev && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <AiLabel field="event" recommendedLabel="In-web actions → Purchase" onApply={() => {
            setAdsetGoal(AI_RECOMMENDED.adsetGoal);
            setEvent(AI_RECOMMENDED.event);
          }} />
        </div>
      </div>
    </div>
  );
};

const BatchGenerateAds = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productCreativesMap, setProductCreativesMap] = useState({});
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [authStatus, setAuthStatus] = useState({ shopify: false, meta: false, google: false });
  const [productReportsMap, setProductReportsMap] = useState({});
  const [productAnalyses, setProductAnalyses] = useState({});

  const [campaignType, setCampaignType] = useState('PRODUCT');

  const [lpType, setLpType] = useState('PRODUCT');
  const [lpTemplateUrl, setLpTemplateUrl] = useState('https://luminaire-style.com/collections/{{product_name}}');
  const [productLpUtm, setProductLpUtm] = useState('utm_source=meta&utm_medium=paid&utm_campaign=ai_batch_{{product_id}}');
  
  const [copyStrategy, setCopyStrategy] = useState('AI_CUSTOM');
  const [unifiedHeadline, setUnifiedHeadline] = useState('Limited Time Offer: Quality You Can Trust');
  const [unifiedBody, setUnifiedBody] = useState('Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.');

  const [scheduleType, setScheduleType] = useState('CONTINUOUS');
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

  const [openDropdown, setOpenDropdown] = useState(null); // 'location', 'platform', 'objective', 'event'
  const [locationSearch, setLocationSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [objectiveStage, setObjectiveStage] = useState('goal'); // 'goal' or 'event'

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

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(_hasGeneratedOnce);

  const [structure, setStructure] = useState({ 
    strategy: 'PER_PRODUCT',
    adsPerSet: 3,
    numAdsets: 3,
    numAdsetsPerProduct: 1
  });
  const [adsetAudiences, setAdsetAudiences] = useState(Array(50).fill('ADV'));
  const [lalOptions, setLalOptions] = useState([]);
  const [intOptions, setIntOptions] = useState([]);
  const [budgetType, setBudgetType] = useState('CBO');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [view, setView] = useState('config');

  const [showPublishModal, setShowPublishModal] = useState(false);

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

  const detectedBrand = {
    name: 'Luminaire Vintage',
    logo: 'https://picsum.photos/seed/logo1/100/100',
    url: 'luminaire-style.com',
    goal: currentObjectiveObj?.label || '',
    country: selectedLocations[0]?.name || ''
  };

  const handleUpdateProductCreatives = (productId, creativesOrUpdater) => {
    setProductCreativesMap(prev => {
      const currentCreatives = prev[productId] || [];
      const nextCreatives = typeof creativesOrUpdater === 'function' 
        ? creativesOrUpdater(currentCreatives) 
        : creativesOrUpdater;
      
      const creativesWithId = nextCreatives.map(c => ({ ...c, productId }));
      return { ...prev, [productId]: creativesWithId };
    });
  };

  const handleToggleAudienceType = (index) => {
    const types = ['ADV', 'LAL', 'INT'];
    setAdsetAudiences(prev => {
      const currentType = prev[index] || 'ADV';
      const nextType = types[(types.indexOf(currentType) + 1) % types.length];
      const next = [...prev];
      next[index] = nextType;
      return next;
    });
  };

  const handleToggleLalOption = (option) => {
    setLalOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleToggleIntOption = (option) => {
    setIntOptions(prev => {
      const exists = prev.find(o => o.id === option.id);
      if (exists) return prev.filter(o => o.id !== option.id);
      return [...prev, option];
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
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const adSetGroupsCount = useMemo(() => {
    if (structure.strategy === 'PER_PRODUCT') {
      const activeProducts = selectedProducts.filter(p => (productCreativesMap[p.id] || []).length > 0);
      return activeProducts.length * (structure.numAdsetsPerProduct || 1);
    } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
      return structure.numAdsets || 1;
    } else if (structure.strategy === 'BY_AD_COUNT') {
      return structure.adsPerSet || 1; // 智能拆组模式下 adsPerSet 存储的是组数
    }
    return 0;
  }, [structure, selectedProducts, productCreativesMap]);

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

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(locationSearch.toLowerCase()) || 
    c.code.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredEvents = STANDARD_EVENTS.filter(ev => 
    ev.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const handlePublishComplete = () => {
    setShowPublishModal(false);
    console.log('Publish complete, redirecting to Ad Manager');
    window.location.hash = '#/ad-manager-v3';
  };

  const CampaignSearchModal = () => {
    const zIndex = useZIndex(true);
    const [search, setSearch] = useState('');
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
                      // 触发 Meta 授权逻辑，并立即联动触发账号选择，不关闭当前弹窗
                      setAuthStatus(prev => ({ ...prev, meta: true }));
                      setShowAccountSelector(true);
                    }}
                    className="w-full inline-flex items-center justify-center bg-primary-500 text-white py-4 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed gap-3"
                  >
                    <Facebook size={18} /> 立即连接 Meta 以加载系列
                  </button>
                </div>
              ) : !selectedAccount ? (
                <div className="p-4">
                  <button 
                    onClick={() => {
                      setShowAccountSelector(true);
                      setShowCampaignModal(false);
                    }}
                    className="w-full inline-flex items-center justify-center bg-primary-500 text-white py-4 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed gap-3"
                  >
                    <Briefcase size={18} /> 选择广告账户
                  </button>
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
      google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
    };

    const [step, setStep] = useState(1);
    const [showAccountChoice, setShowAccountChoice] = useState(true);
    const [selectedAccountType, setSelectedAccountType] = useState('own');
    const [showAdsgoReminder, setShowAdsgoReminder] = useState(false);
    const [hideMainModal, setHideMainModal] = useState(false);
    const [connectedPlatform, setConnectedPlatform] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [platforms, setPlatforms] = useState({
      meta: { connected: false, email: 'alex.designer@meta.com' },
      google: { connected: false, email: 'alex.growth@google.com' }
    });

    const [selections, setSelections] = useState({
      adAccount: selectedAccount?.id || '',
      fbPage: '',
      pixel: '',
      event: '',
      conversionDataset: ''
    });

    const [activeDropdown, setActiveDropdown] = useState(null);

    const [publishProgress, setPublishProgress] = useState([
      { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
      { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
      { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
      { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
      { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
    ]);

    const initialBrandGoalData = useMemo(() => {
      const finalLocations = selectedLocations.map(loc => ({
        value: loc.code.toLowerCase(),
        label: loc.name
      }));

      return {
        campaignObjective: objective,
        adsetGoal: adsetGoal,
        event: event || 'Purchase',
        marketGroups: [
          {
            id: '1',
            targetLocations: finalLocations,
            budgetMode: 'unified',
            unifiedBudget: dailyBudget.toString(),
            kpiType: 'ROAS',
            kpiMode: 'unified',
            unifiedKPI: ''
          }
        ]
      };
    }, [selectedLocations, objective, adsetGoal, event, dailyBudget]);

    const [brandGoalData, setBrandGoalData] = useState(initialBrandGoalData);
    const [validation, setValidation] = useState({ objective: true, marketGroups: true });

    useEffect(() => {
      if (step === 3) {
        let currentIdx = 0;
        const interval = setInterval(() => {
          setPublishProgress(prev => prev.map((item, idx) => {
            if (idx === currentIdx) return { ...item, status: Math.random() > 0.1 ? 'Success' : 'Failure' };
            if (idx === currentIdx + 1) return { ...item, status: 'Publishing' };
            return item;
          }));
          currentIdx++;
          if (currentIdx === 5) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 1500);
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [step]);

    const handleConnect = (platform) => {
      setIsConnecting(platform);
      setTimeout(() => {
        setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: true } }));
        setIsConnecting(false);
        setConnectedPlatform(platform);
      }, 2000);
    };

    const handleDisconnect = (platform) => {
      setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: false } }));
      if (connectedPlatform === platform) setConnectedPlatform(null);
    };

    const CustomDropdown = ({ label, options, value, onChange, placeholder, isOpen, onToggle }) => {
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
              {options.map((opt) => (
                <div key={opt.value} onClick={() => { onChange(opt.value); onToggle(); }} className={`rounded-base px-3 py-2 text-sm font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-primary-50 text-primary-500' : 'hover:bg-gray-50 text-gray-600'}`}>{opt.label}</div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderStep1 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Meta Connection</span>
          </div>
          
          <div className="relative overflow-hidden group bg-white rounded-inner border border-gray-100 shadow-sm flex items-center transition-all h-16 hover:border-primary-500/15">
            <div className="flex items-center gap-4 px-6 flex-1 min-w-0">
              <div className="w-8 h-8 shrink-0 bg-gray-50 rounded-lg p-1.5 border border-gray-100"><img src={LOGO_LINKS.meta} alt="Meta" className="w-full h-full object-contain" /></div>
              <div className="flex items-center gap-10 w-full">
                <span className="text-sm font-semibold text-gray-800 shrink-0">Meta Ads</span>
                {platforms.meta.connected ? (
                  <span className="text-sm font-bold text-gray-400 truncate">{platforms.meta.email.split('@')[0]}</span>
                ) : (
                  <span className="text-sm font-bold text-gray-200">Not connected</span>
                )}
              </div>
            </div>
            
            <div className="h-full shrink-0 flex items-center pr-4">
              {platforms.meta.connected ? (
                <button 
                  onClick={() => handleDisconnect('meta')}
                  className="px-6 py-2 text-rose-500 text-xs font-semibold hover:bg-rose-50 rounded-base transition-colors flex items-center gap-2"
                >
                  <Link2Off size={14} /> Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => handleConnect('meta')}
                  disabled={!!isConnecting}
                  className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-2.5 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting === 'meta' ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
                </button>
              )}
            </div>

            {isConnecting === 'meta' && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-300">
                <p className="text-xs font-medium text-primary-500 animate-pulse">CONNECTING...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const renderStep2 = () => {
      const isMeta = connectedPlatform === 'meta';
      const canPublish = isMeta ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event) : (selections.adAccount && selections.conversionDataset && selections.event);
      const options = { adAccount: [{ value: '1', label: 'Main Business Account (129-382-991)' }, { value: '2', label: 'Backup Marketing (442-110-872)' }], fbPage: [{ value: '1', label: 'Eco-Friendly Brand' }, { value: '2', label: 'Daily Lifestyle Store' }], pixel: [{ value: '1', label: 'Primary Web Pixel (Active)' }], metaEvent: [{ value: 'purchase', label: 'Purchase' }, { value: 'add_to_cart', label: 'Add to Cart' }, { value: 'lead', label: 'Lead' }], conversionDataset: [{ value: '1', label: 'Primary Conversions' }, { value: '2', label: 'Secondary Goals' }], googleEvent: [{ value: 'sales', label: 'Sales' }, { value: 'signup', label: 'Signup' }] };
      const handleToggle = (key) => setActiveDropdown(activeDropdown === key ? null : key);
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-gray-50 rounded-inner p-6 space-y-6">
            <CustomDropdown label="Select ad account" options={options.adAccount} value={selections.adAccount} onChange={(val) => setSelections({...selections, adAccount: val})} placeholder="Select an account..." isOpen={activeDropdown === 'adAccount'} onToggle={() => handleToggle('adAccount')} />
            {isMeta ? (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Facebook page" options={options.fbPage} value={selections.fbPage} onChange={(val) => setSelections({...selections, fbPage: val})} placeholder="Select a page..." isOpen={activeDropdown === 'fbPage'} onToggle={() => handleToggle('fbPage')} /></div>)}{selections.fbPage && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Tracking pixel" options={options.pixel} value={selections.pixel} onChange={(val) => setSelections({...selections, pixel: val})} placeholder="Select a pixel..." isOpen={activeDropdown === 'pixel'} onToggle={() => handleToggle('pixel')} /></div>)}{selections.pixel && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Event" options={options.metaEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'metaEvent'} onToggle={() => handleToggle('metaEvent')} /></div>)}</>
            ) : (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Conversion dataset" options={options.conversionDataset} value={selections.conversionDataset} onChange={(val) => setSelections({...selections, conversionDataset: val})} placeholder="Select a dataset..." isOpen={activeDropdown === 'conversionDataset'} onToggle={() => handleToggle('conversionDataset')} /></div>)}{selections.conversionDataset && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Optimization event" options={options.googleEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'googleEvent'} onToggle={() => handleToggle('googleEvent')} /></div>)}</>
            )}
            {!canPublish && selections.adAccount && (<div className="flex items-center gap-2 p-3 bg-primary-50 text-primary-500 rounded-base text-xs font-medium animate-pulse"><AlertCircle size={14} />Please complete all required selections to proceed</div>)}
          </div>
        </div>
      );
    };

    const renderStep3 = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-gray-50 rounded-section p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div><h3 className="text-xl font-semibold text-gray-900 tracking-tight">Pushing campaigns</h3><p className="text-xs font-bold text-gray-400 mt-1">Status: {publishProgress.filter(p => p.status === 'Success').length}/5 Completed</p></div>
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center"><Loader2 size={24} className="text-primary-500 animate-spin" /></div>
          </div>
          <div className="space-y-3">
            {publishProgress.map((p) => (
              <div key={p.id} className="bg-white rounded-inner p-4 border border-gray-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${p.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : p.status === 'Failure' ? 'bg-red-50 text-red-600' : p.status === 'Publishing' ? 'bg-primary-50 text-primary-500' : 'bg-gray-50 text-gray-300'}`}>{p.status === 'Success' ? <Check size={20} /> : p.status === 'Failure' ? <AlertCircle size={20} /> : p.status === 'Publishing' ? <Loader2 size={20} className="animate-spin" /> : <Layout size={18} />}</div>
                  <div><h4 className="text-sm font-bold text-gray-800">{p.name}</h4><p className={`text-xs font-medium ${p.status === 'Success' ? 'text-emerald-500' : p.status === 'Failure' ? 'text-red-500' : p.status === 'Publishing' ? 'text-primary-500' : 'text-gray-400'}`}>{p.status}</p></div>
                </div>
                {p.status === 'Failure' && (<button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><RefreshCw size={14} /></button>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderStep4 = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 animate-bounce"><Check size={32} /></div>
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Publish successful!</h3>
          <p className="text-sm font-medium text-gray-500">Confirm your brand's optimize goal to activate AI optimization</p>
        </div>
        <div className="space-y-8 pr-2 pb-32">
          <div className="transform transition-all hover:shadow-md relative z-[100]"><BudgetKPISection formData={brandGoalData} updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))} updateFormDataDeep={(updates) => setBrandGoalData(p => ({...p, ...updates}))} validation={validation} setValidation={setValidation} /></div>
        </div>
      </div>
    );

    const renderAccountChoiceStep = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden">
        {/* 原本的选择逻辑保留在状态中，UI 按照新样式在 AccountChoiceModal 中重构 */}
      </div>
    );

    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden" style={{ zIndex }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPublishModal(false)} />
        {!hideMainModal && (
          <div className={`relative bg-white w-full ${step === 4 ? 'max-w-4xl' : 'max-w-xl'} rounded-section shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden`}>
            <div className="px-10 pt-10 pb-6 flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-tag text-xs font-medium ${step === 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>Step {step === 3 ? 1 : 2} of 2</span>
                  <div className="flex gap-1">{[3, 4].map((i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${i < step ? 'w-4 bg-emerald-500' : i === step ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'}`} />))}</div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{step === 3 && 'Publishing status'}{step === 4 && 'Confirm brand optimize goal'}</h2>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-gray-100 rounded-base text-gray-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">{step === 3 && renderStep3()}{step === 4 && renderStep4()}</div>
            {step === 4 && (
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-white/0 pt-16 z-[200]">
                <button onClick={handlePublishComplete} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full text-base font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-emerald-200/50">Confirm strategy & finish <ArrowRight size={20} /></button>
              </div>
            )}
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
      </div>
    );
  };

  return (
    <div className="bg-gray-50/50 min-h-full">
      {/* Top Sticky Account Info Card */}
      {selectedAccount && view === 'config' && (
        <div 
          className="sticky top-0 w-full px-4 md:px-8 py-2 animate-in slide-in-from-top-full duration-500"
          style={{ zIndex: Z_INDEX.HEADER }}
        >
          <div className="max-w-7xl mx-auto bg-gray-900 text-white rounded-section shadow-xl p-4 flex items-center justify-between border border-gray-800 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">当前投放广告账户</p>
                <p className="text-sm font-semibold truncate max-w-xs">{selectedAccount.name}</p>
              </div>
              <div className="h-8 w-px bg-gray-800 mx-2"></div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gray-400">账户 ID</p>
                <p className="text-xs font-bold text-primary-500/70">{selectedAccount.id}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAccountSelector(true)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-base text-sm font-medium transition-all flex items-center gap-2 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Change
            </button>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-7xl">
          
          {view === 'config' ? (
            <div className="space-y-8 animate-fade-in pb-20">

              {/* Card 1: Targeting & Objectives — only for non-first-time users */}
              {hasGeneratedOnce && (
                <TargetingChannelCard
                  platform={platform} setPlatform={setPlatform} objective={objective} setObjective={setObjective}
                  adsetGoal={adsetGoal} setAdsetGoal={setAdsetGoal} event={event} setEvent={setEvent}
                  selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations}
                  openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} dropdownRef={dropdownRef}
                  locationSearch={locationSearch} setLocationSearch={setLocationSearch}
                  eventSearch={eventSearch} setEventSearch={setEventSearch}
                  objectiveStage={objectiveStage} setObjectiveStage={setObjectiveStage}
                  filteredCountries={filteredCountries} filteredEvents={filteredEvents} toggleLocation={toggleLocation}
                  currentObjectiveObj={currentObjectiveObj} currentGoalObj={currentGoalObj} availableGoals={availableGoals}
                  showAiRecommendation={false} allAnalysesComplete={false}
                />
              )}

              {/* Card 2: Add Product */}
              <div className="bg-white rounded-section p-10 adsgo-card-shadow">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><ShoppingBag size={20} /></div>
                   <h3 className="text-xl font-semibold text-gray-900">添加投放产品</h3>
                </div>
                <ProductSelector
                  selectedProducts={selectedProducts}
                  onSelectProducts={setSelectedProducts}
                  productCreatives={productCreativesMap}
                  onUpdateCreatives={handleUpdateProductCreatives}
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
                    if (type === 'CATALOG') {
                      setStructure(prev => ({ ...prev, strategy: 'ALL_PRODUCTS_PER_SET' }));
                    }
                  }}
                  selectedAccount={selectedAccount}
                  onSelectAccount={setSelectedAccount}
                  productAnalyses={productAnalyses}
                  onProductAnalysesChange={setProductAnalyses}
                />
              </div>

              {/* Reminder Component when creatives are missing */}
              {allProductsReady && isAnyProductMissingCreatives && campaignType !== 'CATALOG' && (
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

              {/* Card 1.5: Targeting & Objectives — first-time users, gated like Card 3 */}
              {!hasGeneratedOnce && allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                <TargetingChannelCard
                  platform={platform} setPlatform={setPlatform} objective={objective} setObjective={setObjective}
                  adsetGoal={adsetGoal} setAdsetGoal={setAdsetGoal} event={event} setEvent={setEvent}
                  selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations}
                  openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} dropdownRef={dropdownRef}
                  locationSearch={locationSearch} setLocationSearch={setLocationSearch}
                  eventSearch={eventSearch} setEventSearch={setEventSearch}
                  objectiveStage={objectiveStage} setObjectiveStage={setObjectiveStage}
                  filteredCountries={filteredCountries} filteredEvents={filteredEvents} toggleLocation={toggleLocation}
                  currentObjectiveObj={currentObjectiveObj} currentGoalObj={currentGoalObj} availableGoals={availableGoals}
                  showAiRecommendation={true} allAnalysesComplete={allAnalysesComplete}
                />
              )}

              {/* Card 3: Strategy & Budget */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                 <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-top-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><Layers size={20} /></div>
                       <h3 className="text-xl font-semibold text-gray-900">架构策略与预算</h3>
                    </div>
                    <CampaignPlanView
                      structure={structure} onStructureChange={setStructure}
                      campaignType={campaignType}
                      budgetType={budgetType} onBudgetTypeChange={setBudgetType}
                      dailyBudget={dailyBudget} onBudgetChange={setDailyBudget}
                      adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                      lalOptions={lalOptions} onToggleLalOption={handleToggleLalOption}
                      intOptions={intOptions} onIntOptionsChange={setIntOptions} onToggleIntOption={handleToggleIntOption}
                      selectedProducts={selectedProducts}
                      productCreativesMap={productCreativesMap}
                      productAnalyses={productAnalyses}
                      allAnalysesComplete={allAnalysesComplete}
                      onApplyAiStrategy={handleApplyAiStrategy}
                      isExistingCampaign={!!selectedCampaignId}
                      selectedCampaign={selectedCampaign}
                      onSelectCampaign={() => setShowCampaignModal(true)}
                      selectedAccount={selectedAccount}
                      onSelectAccount={() => setShowAccountSelector(true)}
                      authStatus={authStatus}
                      handleAuthorize={(platformId) => { 
                        setAuthStatus(prev => ({ ...prev, [platformId]: true }));
                        if (platformId === 'meta') {
                          setShowAccountSelector(true);
                        }
                      }}
                    />
                 </div>
              )}

              {/* Card 4: Advanced Settings */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                 <div className="bg-white rounded-section adsgo-card-shadow overflow-hidden animate-in fade-in slide-in-from-top-8">
                    <button onClick={() => setAdvancedOpen(!advancedOpen)} className="w-full p-10 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500"><Settings size={20} /></div>
                           <h3 className="text-xl font-semibold text-gray-900">高级设置 (落地页 / 文案 / 排期)</h3>
                        </div>
                        <ChevronDown className={`transition-transform duration-300 ${advancedOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {advancedOpen && (
                        <div className="p-10 pt-0 space-y-12 border-t border-gray-50 mt-6">
                           
                           {/* Landing Page Strategy */}
                           <div className="space-y-6 pt-10">
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

                           {/* Ad Copy Strategy */}
                           <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-xs font-medium text-gray-500">广告文案标题策略</label>
                              <Info size={12} className="text-gray-300" />
                            </div>
                            
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
                                      <label className="text-xs font-medium text-gray-500 px-1">统一广告标题</label>
                                      <input 
                                        type="text"
                                        value={unifiedHeadline}
                                        onChange={(e) => setUnifiedHeadline(e.target.value)}
                                        placeholder="输入统一标题..."
                                        className="w-full h-14 px-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-xs font-medium text-gray-500 px-1">统一广告正文</label>
                                      <textarea 
                                        value={unifiedBody}
                                        onChange={(e) => setUnifiedBody(e.target.value)}
                                        placeholder="输入统一正文文案..."
                                        className="w-full p-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 h-28 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200 resize-none"
                                      />
                                    </div>
                                  </div>
                                )} 
                              </div>
                            </div>
                           </div>

                           {/* Schedule */}
                           <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-xs font-medium text-gray-500">广告投放排期</label>
                              <Info size={12} className="text-gray-300" />
                            </div>
                            
                            <div className="bg-gray-50/50 border border-gray-100 rounded-inner p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: 'CONTINUOUS', label: '长期投放', desc: 'No End Date', icon: <Clock size={18} /> },
                                  { id: 'SCHEDULED', label: '定期投放', desc: 'Custom Date Range', icon: <Calendar size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setScheduleType(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-base border-2 transition-all ${
                                      scheduleType === opt.id 
                                        ? 'bg-white border-primary-500 shadow-primary-focus' 
                                        : 'bg-transparent border-gray-100 hover:border-gray-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scheduleType === opt.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-semibold ${scheduleType === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</p>
                                      <p className="text-xs text-gray-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {scheduleType === 'CONTINUOUS' ? (
                                  <div className="p-8 bg-primary-50/50 rounded-section border border-primary-500/10 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm shrink-0">
                                          <Clock size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold text-gray-900 tracking-tight">常青投放模式</h4>
                                          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                                            广告发布后将立即开始投放，并且不设具体的结束日期，直至您手动暂停或预算消耗完毕。
                                          </p>
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                        <label className="text-xs font-medium text-gray-500 px-1">开始日期</label>
                                        <input 
                                          type="date"
                                          value={startDate}
                                          onChange={(e) => setStartDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                        />
                                      </div>
                                      <div className="space-y-3">
                                        <label className="text-xs font-medium text-gray-500 px-1">结束日期</label>
                                        <input 
                                          type="date"
                                          value={endDate}
                                          onChange={(e) => setEndDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-xs font-medium text-gray-500 px-1">快速设置时长</label>
                                      <div className="flex gap-3">
                                        {[3, 7, 14, 30].map(days => (
                                          <button
                                            key={days}
                                            onClick={() => handleQuickSchedule(days)}
                                            className="flex-1 py-3 bg-white border border-gray-200 rounded-base text-xs font-medium text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-all duration-200"
                                          >
                                            {days} 天
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )} 
                              </div>
                            </div>
                           </div>

                        </div>
                    )}
                 </div>
              )}

              {/* Preview Button */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => { setView('preview'); _hasGeneratedOnce = true; setHasGeneratedOnce(true); }}
                    className="group relative w-full max-w-4xl py-8 px-16 rounded-full font-bold text-2xl flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 shadow-xl transition-all"
                  >
                    <Sparkles size={28} className="mr-5" />
                    预览发布计划
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Preview View Wrapper - Keeping the original card style for the preview page
            <div className="bg-white rounded-section shadow-xl border border-gray-100 overflow-hidden relative mb-20 animate-fade-in">
              <div className="p-10 md:p-14">
                <CampaignPreviewView 
                  structure={structure}
                  budgetType={budgetType} 
                  dailyBudget={dailyBudget}
                  initialAdsetAudiences={adsetAudiences} 
                  productCreativesMap={productCreativesMap}
                  selectedProducts={selectedProducts}
                  brand={detectedBrand}
                  onBack={() => setView('config')}
                  onPublish={() => setShowPublishModal(true)}
                  campaignName={selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001'}
                  optimizationEvent={event}
                  landingPageType={lpType}
                  landingPageTemplate={lpTemplateUrl}
                  productUtm={productLpUtm}
                  copyStrategy={copyStrategy}
                  unifiedHeadline={unifiedHeadline}
                  unifiedBody={unifiedBody}
                  campaignType={campaignType}
                  estimatedTotalDaily={estimatedTotalDaily}
                  adSetGroupsCount={adSetGroupsCount}
                  authStatus={authStatus}
                  selectedAccount={selectedAccount}
                  onAuthStatusChange={setAuthStatus}
                  onSelectAccount={() => setShowAccountSelector(true)}
                />
              </div>
            </div>
          )}
          
        </div>
      </div>

      {showCampaignModal && <CampaignSearchModal />}
      {showPublishModal && <PublishModal />}
      
      {showAccountSelector && <AccountSelectorModal selectedAccount={selectedAccount} onSelect={setSelectedAccount} onClose={() => setShowAccountSelector(false)} />}

    </div>
  );
};

const AccountChoiceModal = ({ onSelect, onClose, selectedAccountType, setSelectedAccountType, renderStep1, renderStep2, connectedPlatform, selections }) => {
  const zIndex = useZIndex(true);
  const isMeta = connectedPlatform === 'meta';
  const canProceed = isMeta 
    ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
    : (selections.adAccount && selections.conversionDataset && selections.event);

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
                  ? 'Please connect your Meta account, and select a valid ad account and Facebook page to publish your ads.'
                  : "We've prepped everything for you : Stable ad accounts, professional Facebook Pages."}
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
                <div className="flex gap-1.5 pt-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
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

const AccountSelectorModal = ({ selectedAccount, onSelect, onClose }) => {
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
          {MOCK_ACCOUNTS.map(acc => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchGenerateAds;
