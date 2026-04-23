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
import useDropdownLoading from '../../hooks/useDropdownLoading';

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

// Extracted Targeting & Channel Card component
const TargetingChannelCard = ({
  platform, setPlatform, objective, setObjective, adsetGoal, setAdsetGoal, event, setEvent,
  selectedLocations, setSelectedLocations, openDropdown, setOpenDropdown, dropdownRef,
  locationSearch, setLocationSearch, eventSearch, setEventSearch, objectiveStage, setObjectiveStage,
  filteredCountries, filteredEvents, toggleLocation, currentObjectiveObj, currentGoalObj, availableGoals,
  showAiRecommendation, allAnalysesComplete,
  selectedLanguage, setSelectedLanguage, languageSearch, setLanguageSearch, filteredLanguages
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
          <AiLabel field="location" recommendedLabel="United States" onApply={() => setSelectedLocations(AI_RECOMMENDED.locations)} />
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
                  ) : (<><Monitor size={16} className="text-primary-500 shrink-0" /><span className="text-sm font-bold text-gray-300">待选择...</span></>)}
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

        {/* Promote Objective (3-level cascading dropdown) */}
        <div>
          <div className="relative" ref={openDropdown === 'objective' ? dropdownRef : null}>
            <div onClick={() => { setOpenDropdown(openDropdown === 'objective' ? null : 'objective'); setObjectiveStage('objective'); }}
              className="bg-white rounded-inner p-4 border border-gray-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-500/20 transition-all h-full">
              <span className="text-xs font-medium text-gray-500">Promote Objective</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Target size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {event || currentGoalObj?.label || <span className="text-gray-300">Select...</span>}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${openDropdown === 'objective' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'objective' && (
              <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-base shadow-xl border border-gray-100 p-3 animate-in fade-in zoom-in-95 duration-200 z-[20]">
                {objectiveStage === 'objective' && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 px-2">1. Campaign Objective</p>
                    <div className="grid grid-cols-1 gap-1">
                      {CAMPAIGN_OBJECTIVES.map(obj => {
                        const Icon = obj.icon;
                        return (
                          <button key={obj.value} onClick={() => {
                            const firstGoal = ADSET_GOALS_MAPPING[obj.value][0];
                            setObjective(obj.value);
                            setAdsetGoal(firstGoal?.value || '');
                            setEvent(firstGoal?.needsEvent ? 'Purchase' : '');
                            setObjectiveStage('goal');
                          }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                            objective === obj.value ? 'bg-gray-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'
                          }`}>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${objective === obj.value ? 'bg-primary-500 text-white' : `${obj.bg} ${obj.color}`}`}>
                              <Icon size={14} />
                            </div>
                            <span>{obj.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {objectiveStage === 'goal' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <button onClick={() => setObjectiveStage('objective')} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400"><ChevronLeft size={14} /></button>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest">2. Conversion Goal</p>
                    </div>
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
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest">3. Pixel Event</p>
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
          <AiLabel field="objective" recommendedLabel="In-web actions → Purchase" onApply={() => {
            setObjective(AI_RECOMMENDED.objective);
            setAdsetGoal(AI_RECOMMENDED.adsetGoal);
            setEvent(AI_RECOMMENDED.event);
          }} />
        </div>
      </div>
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

const BatchGenerateAds = ({ onPageChange, onPublishSuccess }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productCreativesMap, setProductCreativesMap] = useState({});
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedProductSet, setSelectedProductSet] = useState('All Products');
  const [selectedAccount, setSelectedAccount] = useState(() =>
    _hasGeneratedOnce ? MOCK_ACCOUNTS[0] : null
  );
  const [authStatus, setAuthStatus] = useState(() =>
    _hasGeneratedOnce
      ? { shopify: false, meta: true, google: false }
      : { shopify: false, meta: false, google: false }
  );
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
  const [unifiedHeadline, setUnifiedHeadline] = useState(['Limited Time Offer: Quality You Can Trust']);
  const [unifiedBody, setUnifiedBody] = useState(['Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.']);

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
    adsPerSet: 3,
    numAdsets: 3,
    numAdsetsPerProduct: 1
  });
  const [adsetCreativeSelections, setAdsetCreativeSelections] = useState({});
  const [numByCreativeAdsets, setNumByCreativeAdsets] = useState(1);
  const [adsetAudiences, setAdsetAudiences] = useState(Array(50).fill('ADV'));
  const [adType, setAdType] = useState('FLEXIBLE');
  const [adsetAudienceDetails, setAdsetAudienceDetails] = useState({});
  const [budgetType, setBudgetType] = useState('CBO');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [view, setView] = useState('config');

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

  const handleSaveAdsetAudienceDetails = (idx, details) => {
    setAdsetAudienceDetails(prev => ({ ...prev, [idx]: details }));
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
    setStructure(newStructure);
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
      google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
    };

    const [selectedAccountType, setSelectedAccountType] = useState('own');
    const [showAdsgoReminder, setShowAdsgoReminder] = useState(false);
    const [hideMainModal, setHideMainModal] = useState(false);
    const [connectedPlatform, setConnectedPlatform] = useState(
      authStatus?.meta ? 'meta' : authStatus?.google ? 'google' : null
    );
    const [isConnecting, setIsConnecting] = useState(false);
    const [platforms, setPlatforms] = useState({
      meta: { connected: !!authStatus?.meta, email: 'alex.designer@meta.com' },
      google: { connected: !!authStatus?.google, email: 'alex.growth@google.com' }
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
      const hasBaseSelections = isMeta ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event) : (selections.adAccount && selections.conversionDataset && selections.event);
      const isPhoneValid = selections.contactPhone && !validatePhone(selections.contactPhone, selections.phoneCountryCode);
      const canPublish = hasBaseSelections && isPhoneValid;
      const options = { adAccount: [{ value: '1', label: 'Main Business Account (129-382-991)' }, { value: '2', label: 'Backup Marketing (442-110-872)' }], fbPage: [{ value: '1', label: 'Eco-Friendly Brand' }, { value: '2', label: 'Daily Lifestyle Store' }], pixel: [{ value: '1', label: 'Primary Web Pixel (Active)' }], metaEvent: [{ value: 'purchase', label: 'Purchase' }, { value: 'add_to_cart', label: 'Add to Cart' }, { value: 'lead', label: 'Lead' }], conversionDataset: [{ value: '1', label: 'Primary Conversions' }, { value: '2', label: 'Secondary Goals' }], googleEvent: [{ value: 'sales', label: 'Sales' }, { value: 'signup', label: 'Signup' }] };
      const handleToggle = (key) => setActiveDropdown(activeDropdown === key ? null : key);
      const showPhone = isMeta ? !!selections.event : !!selections.event;
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-gray-50 rounded-inner p-6 space-y-6">
            <CustomDropdown label="Select ad account" options={options.adAccount} value={selections.adAccount} onChange={(val) => setSelections({...selections, adAccount: val})} placeholder="Select an account..." isOpen={activeDropdown === 'adAccount'} onToggle={() => handleToggle('adAccount')} isLoading={pubAdAccountLoading.isLoading} />
            {isMeta ? (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Facebook page" options={options.fbPage} value={selections.fbPage} onChange={(val) => { setSelections({...selections, fbPage: val}); setShowTosModal(true); }} placeholder="Select a page..." isOpen={activeDropdown === 'fbPage'} onToggle={() => handleToggle('fbPage')} isLoading={pubFbPageLoading.isLoading} /></div>)}{selections.fbPage && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Tracking pixel" options={options.pixel} value={selections.pixel} onChange={(val) => setSelections({...selections, pixel: val})} placeholder="Select a pixel..." isOpen={activeDropdown === 'pixel'} onToggle={() => handleToggle('pixel')} isLoading={pubPixelLoading.isLoading} /></div>)}{selections.pixel && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Event" options={options.metaEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'metaEvent'} onToggle={() => handleToggle('metaEvent')} isLoading={pubEventLoading.isLoading} /></div>)}</>
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
                  selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
                  languageSearch={languageSearch} setLanguageSearch={setLanguageSearch}
                  filteredLanguages={filteredLanguages}
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
                  onMetaAccountPick={() => { accountPickLoading.triggerLoad(); setShowMetaAccountPicker(true); }}
                  selectedCatalog={selectedCatalog}
                  onSelectCatalog={setSelectedCatalog}
                  selectedProductSet={selectedProductSet}
                  onSelectProductSet={setSelectedProductSet}
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
                  selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
                  languageSearch={languageSearch} setLanguageSearch={setLanguageSearch}
                  filteredLanguages={filteredLanguages}
                />
              )}

              {/* Card 3: Strategy & Budget */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (hasGeneratedOnce || isTargetingComplete) && (
                 <div className="bg-white rounded-section p-10 adsgo-card-shadow animate-in fade-in slide-in-from-top-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white"><Layers size={20} /></div>
                       <h3 className="text-xl font-semibold text-gray-900">架构策略与预算</h3>
                    </div>
                    <CampaignPlanView
                      structure={structure} onStructureChange={handleStructureChange}
                      campaignType={campaignType}
                      budgetType={budgetType} onBudgetTypeChange={setBudgetType}
                      dailyBudget={dailyBudget} onBudgetChange={setDailyBudget}
                      adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                      adsetAudienceDetails={adsetAudienceDetails} onSaveAdsetAudienceDetails={handleSaveAdsetAudienceDetails}
                      adType={adType} onAdTypeChange={setAdType} objective={objective}
                      selectedProducts={selectedProducts}
                      productCreativesMap={productCreativesMap}
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

              {/* Card 4: Advanced Settings */}
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (hasGeneratedOnce || isTargetingComplete) && (
                 <div className="bg-white rounded-section adsgo-card-shadow overflow-hidden animate-in fade-in slide-in-from-top-8">
                    <button onClick={() => setAdvancedOpen(!advancedOpen)} className="w-full p-10 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500"><Settings size={20} /></div>
                           <h3 className="text-xl font-semibold text-gray-900">高级设置 (广告命名规则 / 落地页 / 文案 / 排期)</h3>
                        </div>
                        <ChevronDown className={`transition-transform duration-300 ${advancedOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {advancedOpen && (
                        <div className="p-10 pt-0 space-y-12 border-t border-gray-50 mt-6">

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
                                    {/* Unified Headlines */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-medium text-gray-500">统一广告标题</label>
                                        <span className="text-xs text-gray-400">{unifiedHeadline.length}/5</span>
                                      </div>
                                      {unifiedHeadline.map((val, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={val}
                                            onChange={(e) => {
                                              const next = [...unifiedHeadline];
                                              next[i] = e.target.value;
                                              setUnifiedHeadline(next);
                                            }}
                                            placeholder={`标题 ${i + 1}...`}
                                            className="flex-1 h-14 px-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200"
                                          />
                                          {unifiedHeadline.length > 1 && (
                                            <button
                                              onClick={() => setUnifiedHeadline(unifiedHeadline.filter((_, j) => j !== i))}
                                              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                              <X size={14} />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                      {unifiedHeadline.length < 5 && (
                                        <button
                                          onClick={() => setUnifiedHeadline([...unifiedHeadline, ''])}
                                          className="flex items-center gap-2 text-xs text-primary-500 hover:text-primary-600 font-medium px-1 py-1 transition-colors"
                                        >
                                          <Plus size={14} />
                                          添加标题变体
                                        </button>
                                      )}
                                    </div>
                                    {/* Unified Body */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-medium text-gray-500">统一广告正文</label>
                                        <span className="text-xs text-gray-400">{unifiedBody.length}/5</span>
                                      </div>
                                      {unifiedBody.map((val, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                          <textarea
                                            value={val}
                                            onChange={(e) => {
                                              const next = [...unifiedBody];
                                              next[i] = e.target.value;
                                              setUnifiedBody(next);
                                            }}
                                            placeholder={`正文 ${i + 1}...`}
                                            className="flex-1 p-6 bg-white border border-gray-200 rounded-base outline-none text-sm text-gray-700 h-28 focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200 resize-none"
                                          />
                                          {unifiedBody.length > 1 && (
                                            <button
                                              onClick={() => setUnifiedBody(unifiedBody.filter((_, j) => j !== i))}
                                              className="w-8 h-8 mt-2 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                              <X size={14} />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                      {unifiedBody.length < 5 && (
                                        <button
                                          onClick={() => setUnifiedBody([...unifiedBody, ''])}
                                          className="flex items-center gap-2 text-xs text-primary-500 hover:text-primary-600 font-medium px-1 py-1 transition-colors"
                                        >
                                          <Plus size={14} />
                                          添加正文变体
                                        </button>
                                      )}
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
              {allProductsReady && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (hasGeneratedOnce || isTargetingComplete) && (
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
                  isExistingCampaign={!!selectedCampaignId}
                  campaignObjective={objective}
                  optimizationEvent={event || currentGoalObj?.label || currentObjectiveObj?.label || ''}
                  landingPageType={lpType}
                  landingPageTemplate={lpTemplateUrl}
                  productUtm={productLpUtm}
                  copyStrategy={copyStrategy}
                  unifiedHeadline={unifiedHeadline}
                  unifiedBody={unifiedBody}
                  campaignType={campaignType}
                  estimatedTotalDaily={estimatedTotalDaily}
                  adSetGroupsCount={adSetGroupsCount}
                  adType={adType}
                  adsetAudienceDetails={adsetAudienceDetails}
                  authStatus={authStatus}
                  selectedAccount={selectedAccount}
                  onAuthStatusChange={setAuthStatus}
                  onSelectAccount={() => setShowMetaAccountPicker(true)}
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
  const hasBaseSelections = isMeta
    ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
    : (selections.adAccount && selections.conversionDataset && selections.event);
  const canProceed = hasBaseSelections && selections.contactPhone && !validatePhone(selections.contactPhone, selections.phoneCountryCode);

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
