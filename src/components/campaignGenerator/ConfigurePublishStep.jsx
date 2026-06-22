import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronDown, Globe, MapPin, Target, Sparkles, ChevronRight, 
  ShoppingCart, Layout, Users, MousePointer2, Plus, Info, 
  ArrowRight, Zap, Image as ImageIcon, Link as LinkIcon, Trash2,
  Search, X, Check, Megaphone, Smartphone, ShoppingBag, ChevronLeft,
  CheckCircle2
} from 'lucide-react';

const PLATFORMS = [
  { id: 'meta', name: 'Meta', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', name: 'Google', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' },
  { id: 'tiktok', name: 'TikTok', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256', disabled: true },
  { id: 'bing', name: 'Bing', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256', disabled: true }
];

const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-danger-500', bg: 'bg-danger-50', description: 'Reach more people' },
  { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-info-500', bg: 'bg-info-50', description: 'Drive site visits' },
  { value: 'leads', label: 'Leads', icon: Users, color: 'text-warning-500', bg: 'bg-warning-50', description: 'Find prospects' },
  { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-success-500', bg: 'bg-success-50', description: 'Drive transactions' },
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

const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2 relative text-left">
      {label && <label className="text-[10px] font-bold text-neutral-400 tracking-wider">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-4 bg-neutral-50 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? 'border-primary-500 ring-2 ring-primary-500/10 bg-white shadow-sm' : 'border-transparent hover:bg-neutral-100'
        }`}
      >
        <span className="text-sm font-bold text-neutral-700">
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[150] top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${
                value === opt.value ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-50 text-neutral-600'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ConfigurePublishStep = ({ product, savedConfig, LOGO_LINKS, onBack, onConfirm }) => {
  // --- States ---
  const [selectedLocations, setSelectedLocations] = useState(savedConfig?.locations?.map(name => {
    const found = ALL_COUNTRIES.find(c => c.name === name);
    return found || { code: name.slice(0, 2).toUpperCase(), name };
  }) || [{ code: 'US', name: 'United States' }]);
  
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [objective, setObjective] = useState(savedConfig?.objective || 'sales_conversions');
  const [adsetGoal, setAdsetGoal] = useState(savedConfig?.adsetGoal || 'in_web_actions');
  const [event, setEvent] = useState(savedConfig?.event || 'Purchase');

  const [creatives, setCreatives] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400", isMain: true },
    { id: 2, url: "https://picsum.photos/seed/asset-1/300/400" },
    { id: 3, url: "https://picsum.photos/seed/asset-2/300/400" },
    { id: 4, url: "https://picsum.photos/seed/asset-3/300/400" },
    { id: 5, url: "https://picsum.photos/seed/asset-4/300/400" },
    { id: 6, url: "https://picsum.photos/seed/asset-5/300/400" },
    { id: 7, url: "https://picsum.photos/seed/asset-6/300/400" },
    { id: 8, url: "https://picsum.photos/seed/asset-7/300/400" },
  ]);

  const [adsetsCount, setAdsetsCount] = useState(3);
  const [adsPerSet, setAdsPerSet] = useState('6');
  const [budget, setBudget] = useState(50);
  const [budgetType, setBudgetType] = useState('CBO');

  // --- Dropdown States ---
  const [openDropdown, setOpenDropdown] = useState(null); // 'location', 'platform', 'objective', 'event'
  const [locationSearch, setLocationSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [objectiveStage, setObjectiveStage] = useState('goal'); // 'goal' or 'event'

  // --- Refs for Click Outside ---
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

  // --- Memos ---
  const totalCreatives = creatives.length;
  
  const campaignCount = useMemo(() => {
    if (adsPerSet === 'dynamic') return 1;
    const adsCountNum = Number(adsPerSet);
    return Math.ceil(totalCreatives / (adsetsCount * adsCountNum));
  }, [adsetsCount, adsPerSet, totalCreatives]);

  const estimatedDailyBudget = useMemo(() => {
    if (budgetType === 'CBO') return campaignCount * budget;
    return (campaignCount * adsetsCount) * budget;
  }, [budgetType, campaignCount, adsetsCount, budget]);

  const treeScale = useMemo(() => {
    const horizontalComplexity = campaignCount * adsetsCount;
    if (horizontalComplexity > 12) return 0.5;
    if (horizontalComplexity > 8) return 0.65;
    if (horizontalComplexity > 4) return 0.8;
    return 1;
  }, [campaignCount, adsetsCount]);

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(locationSearch.toLowerCase()) || 
    c.code.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredEvents = STANDARD_EVENTS.filter(ev => 
    ev.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === objective);
  const availableGoals = ADSET_GOALS_MAPPING[objective] || [];
  const currentGoalObj = availableGoals.find(g => g.value === adsetGoal);

  // --- Handlers ---
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newCreatives = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      isMain: false
    }));
    setCreatives(prev => [...prev, ...newCreatives]);
  };

  const removeCreative = (id) => {
    if (creatives.length <= 1) return;
    setCreatives(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* Top Configuration Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-[200]">
          
          {/* Location Selector */}
          <div className="relative" ref={openDropdown === 'location' ? dropdownRef : null}>
            <div 
              onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
              className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-200 transition-all h-full"
            >
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">Location</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-neutral-700 truncate">
                    {selectedLocations[0]?.name}
                    {selectedLocations.length > 1 && '...'}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-neutral-300 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
                {/* Left: Search & List */}
                <div className="w-1/2 border-r border-neutral-50 flex flex-col">
                  <div className="p-4 border-b border-neutral-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 w-3.5 h-3.5" />
                      <input 
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border-none rounded-xl text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-primary-500/10"
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredCountries.map(c => (
                      <button 
                        key={c.code}
                        onClick={() => toggleLocation(c)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                          selectedLocations.some(l => l.code === c.code) ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {c.name}
                        {selectedLocations.some(l => l.code === c.code) && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Right: Selected */}
                <div className="w-1/2 bg-neutral-50/30 flex flex-col">
                  <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-neutral-400 tracking-widest">Selected ({selectedLocations.length})</span>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-4 flex flex-wrap gap-2 content-start">
                    {selectedLocations.map(l => (
                      <div key={l.code} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-neutral-100 rounded-lg shadow-sm animate-in zoom-in">
                        <span className="text-[10px] font-black text-neutral-700">{l.code}</span>
                        <button onClick={() => toggleLocation(l)} className="text-neutral-300 hover:text-danger-500 transition-colors">
                          <X size={10} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Platform Selector */}
          <div className="relative" ref={openDropdown === 'platform' ? dropdownRef : null}>
            <div 
              onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
              className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-200 transition-all h-full"
            >
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">Platform</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={platform.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
                  <span className="text-sm font-bold text-neutral-700 truncate">{platform.name}</span>
                </div>
                <ChevronDown size={14} className={`text-neutral-300 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'platform' && (
              <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                {PLATFORMS.map(p => (
                  <button 
                    key={p.id}
                    disabled={p.disabled}
                    onClick={() => {
                      setPlatform(p);
                      setOpenDropdown(null);
                    }}
                    className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                      p.disabled ? 'opacity-40 cursor-not-allowed' : 
                      platform.id === p.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <img src={p.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
                    <span className="text-xs font-bold">{p.name}</span>
                    {p.disabled && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-neutral-900 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg">COMING SOON</div>
                      </div>
                    )}
                    {!p.disabled && platform.id === p.id && <Check size={12} className="ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Objective Selector */}
          <div className="relative" ref={openDropdown === 'objective' ? dropdownRef : null}>
            <div 
              onClick={() => {
                setOpenDropdown(openDropdown === 'objective' ? null : 'objective');
                setObjectiveStage('goal');
              }}
              className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-200 transition-all h-full"
            >
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">Objective</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Target size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm font-bold text-neutral-700 truncate">{currentObjectiveObj?.label}</span>
                </div>
                <ChevronDown size={14} className={`text-neutral-300 transition-transform ${openDropdown === 'objective' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'objective' && (
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black text-neutral-400 tracking-widest px-2">Select objective</p>
                <div className="space-y-1.5">
                  {CAMPAIGN_OBJECTIVES.map(obj => {
                    const Icon = obj.icon;
                    return (
                      <button 
                        key={obj.value}
                        onClick={() => {
                          setObjective(obj.value);
                          setAdsetGoal(ADSET_GOALS_MAPPING[obj.value][0].value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                          objective === obj.value ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-100 shadow-sm' : 'hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${objective === obj.value ? 'bg-primary-500 text-white' : obj.bg + ' ' + obj.color}`}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-none mb-1">{obj.label}</p>
                          <p className="text-[9px] font-medium opacity-60 truncate">{obj.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Event Selector (Cascading) */}
          <div className="relative" ref={openDropdown === 'event' ? dropdownRef : null}>
            <div 
              onClick={() => {
                setOpenDropdown(openDropdown === 'event' ? null : 'event');
                setObjectiveStage('goal');
              }}
              className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-primary-200 transition-all h-full"
            >
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">Conversion event</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Zap size={16} className="text-primary-500 shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-sm font-bold text-neutral-700 truncate">{currentGoalObj?.label}</span>
                    {event && <><ChevronRight size={10} className="text-neutral-300 shrink-0" /><span className="text-sm font-bold text-primary-600 truncate">{event}</span></>}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-neutral-300 transition-transform ${openDropdown === 'event' ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {openDropdown === 'event' && (
              <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                {objectiveStage === 'goal' ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-neutral-400 tracking-widest px-2">Select conversion event</p>
                    <div className="space-y-1">
                      {availableGoals.map(goal => (
                        <button
                          key={goal.value}
                          onClick={() => {
                            setAdsetGoal(goal.value);
                            if (goal.needsEvent) {
                              setObjectiveStage('event');
                            } else {
                              setEvent('');
                              setOpenDropdown(null);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                            adsetGoal === goal.value ? 'bg-neutral-900 text-white shadow-lg' : 'hover:bg-neutral-50 text-neutral-600'
                          }`}
                        >
                          {goal.label}
                          {goal.needsEvent ? <ArrowRight size={12} className="opacity-40 group-hover:translate-x-1 transition-all" /> : (adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setObjectiveStage('goal')} className="p-1.5 hover:bg-neutral-50 rounded-lg transition-colors text-neutral-400">
                        <ChevronLeft size={16} />
                      </button>
                      <p className="text-[10px] font-black text-neutral-400 tracking-widest">BACK</p>
                    </div>
                    <div className="relative px-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 w-3.5 h-3.5" />
                      <input 
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border-none rounded-xl text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-primary-500/10"
                        placeholder="Search events..."
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar px-1 space-y-1">
                      {filteredEvents.map(ev => (
                        <button
                          key={ev}
                          onClick={() => {
                            setEvent(ev);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                            event === ev ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'hover:bg-neutral-50 text-neutral-600'
                          }`}
                        >
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
        </div>

        {/* Landing Page & Creatives Section */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/20 overflow-hidden relative z-10">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-primary-600 border border-neutral-100 shadow-sm">
                  <ShoppingCart size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-neutral-900 leading-none">{product?.name || 'AIGC Recommended Creatives'}</h3>
                  <div className="flex items-center gap-1.5 text-primary-600 hover:underline cursor-pointer">
                    <LinkIcon size={14} />
                    <span className="text-xs font-medium">{product?.url || '/products/item-1'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creatives Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {creatives.map((creative) => (
                <div key={creative.id} className="aspect-[3/4] rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative group shadow-sm hover:shadow-lg transition-all">
                  <img src={creative.url} className="w-full h-full object-cover" alt="" />
                  {creative.isMain && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow-lg tracking-tighter">Main</div>
                  )}
                  {/* Delete Button on Hover */}
                  <button 
                    onClick={() => removeCreative(creative.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-danger-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm"
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {/* Add Button */}
              <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-300 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/30 transition-all group cursor-pointer">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-center leading-tight">Add creatives</span>
              </label>
            </div>
          </div>
        </div>

        {/* Campaign Structure & Budget Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-0">
          
          {/* Left: Structure & Tree - Removed overflow-hidden implicitly via no class, added high z-index for dropdowns */}
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/20 p-8 space-y-8 flex flex-col min-h-[500px] relative z-20">
            <h3 className="text-sm font-bold text-neutral-400 tracking-wider">Campaign structure</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <CustomSelect 
                label="Adsets"
                value={adsetsCount}
                onChange={(val) => setAdsetsCount(Number(val))}
                options={[1, 2, 3, 4, 5].map(n => ({ value: n, label: n.toString() }))}
              />
              <CustomSelect 
                label="Ads per set"
                value={adsPerSet}
                onChange={(val) => setAdsPerSet(val)}
                options={[
                  ...[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ value: n.toString(), label: n.toString() })),
                  { value: 'dynamic', label: 'Dynamic' }
                ]}
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary-50/50 rounded-2xl p-4 flex gap-3 border border-primary-100/50">
              <Info size={18} className="text-primary-500 shrink-0" />
              <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                {adsPerSet === 'dynamic' ? (
                  <>
                    AI will generate <span className="text-primary-600 font-bold">1 Campaign</span> where each of the <span className="text-primary-600 font-bold">{adsetsCount} Adsets</span> will use <span className="text-primary-600 font-bold">all {totalCreatives} creatives</span> (Dynamic mode).
                  </>
                ) : (
                  <>
                    AI will generate <span className="text-primary-600 font-bold">{campaignCount} Campaign</span> with a <span className="text-primary-600 font-bold">1:{adsetsCount}:{adsPerSet}</span> structure based on the <span className="text-primary-600 font-bold">{totalCreatives} creatives</span> provided.
                  </>
                )}
              </p>
            </div>

            {/* Dynamic Tree Visualization */}
            <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/30 rounded-2xl border border-neutral-100 relative overflow-hidden">
              <div 
                className="flex flex-col items-center gap-8 relative z-10 transition-transform duration-500 origin-center"
                style={{ transform: `scale(${treeScale})` }}
              >
                {/* Root Campaigns */}
                <div className="flex gap-16">
                  {[...Array(campaignCount)].map((_, ci) => (
                    <div key={ci} className="flex flex-col items-center group">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-xl relative z-20 transition-transform group-hover:scale-110">
                        <Layout size={20} />
                      </div>
                      <span className="text-[9px] font-bold mt-2 text-neutral-400">Camp {ci + 1}</span>
                      
                      {/* Connector down to Adsets */}
                      <div className="w-px h-8 bg-neutral-200 relative">
                        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-neutral-200 transition-all" 
                             style={{ 
                               width: adsetsCount > 1 ? `${(adsetsCount - 1) * 64}px` : '0px', 
                               height: '1px' 
                             }} 
                        />
                      </div>

                      {/* Level 2: Adsets */}
                      <div className="flex gap-8 mt-0">
                        {[...Array(adsetsCount)].map((_, ai) => (
                          <div key={ai} className="flex flex-col items-center">
                            <div className="w-9 h-9 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-primary-600 shadow-sm relative z-20 transition-all hover:border-primary-300">
                              <Users size={14} />
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-200" />
                            </div>
                            
                            {/* Level 3: Ads dots grid */}
                            <div 
                              className="mt-8 grid gap-1 px-1" 
                              style={{ 
                                gridTemplateColumns: `repeat(${adsPerSet === 'dynamic' ? Math.ceil(totalCreatives/3) : Math.ceil(Number(adsPerSet)/2)}, minmax(0, 1fr))` 
                              }}
                            >
                              {[...Array(adsPerSet === 'dynamic' ? totalCreatives : Number(adsPerSet))].map((_, di) => (
                                <div key={di} className="w-2 h-2 bg-primary-500 rounded-[2px] shadow-sm animate-in zoom-in" style={{ animationDelay: `${di * 50}ms` }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Budget & Estimated Spend */}
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/20 p-10 space-y-10 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 leading-none">Campaign budget (Daily)</h3>
              <div className="inline-flex p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                {['CBO', 'ABO'].map(type => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      budgetType === type ? 'bg-white text-primary-600 shadow-md' : 'text-neutral-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Budget Input */}
            <div className="bg-neutral-50 rounded-2xl p-8 flex items-center gap-6 group hover:bg-neutral-100/50 transition-colors border border-transparent hover:border-neutral-200">
              <span className="text-4xl font-bold text-neutral-300">$</span>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-6xl font-bold text-neutral-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-600 rounded-[2rem] p-6 text-white shadow-xl shadow-primary-200 transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-bold text-primary-100 tracking-wider mb-2">Daily spend (est.)</p>
                <div className="text-3xl font-bold">${estimatedDailyBudget}</div>
              </div>
              <div className="bg-neutral-900 rounded-[2rem] p-6 text-white shadow-xl transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2">Total campaigns</p>
                <div className="text-3xl font-bold">{campaignCount}</div>
              </div>
            </div>

            {/* Suggestion Box */}
            <div className="bg-neutral-50 rounded-[2rem] p-6 flex gap-4 border border-neutral-100 mt-auto">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm border border-neutral-100 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-neutral-900">AI testing advice</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Based on <span className="font-bold text-primary-600">{totalCreatives} creatives</span>, AI suggests using cross-testing mode. First round test duration is estimated to be <span className="font-bold text-primary-600">72 hours</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-[260px] right-0 h-24 bg-white/80 backdrop-blur-md border-t border-neutral-100 flex items-center justify-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <button 
          onClick={onBack}
          className="absolute left-12 px-8 py-3 bg-neutral-50 text-neutral-500 rounded-full text-xs font-bold hover:bg-neutral-100 transition-all border border-neutral-100"
        >
          Back
        </button>
        <button 
          onClick={() => onConfirm?.({
            campaignCount,
            adsetsCount,
            adsPerSet,
            budget,
            budgetType,
            totalCreatives,
            estimatedDailyBudget,
            creatives
          })}
          className="px-24 py-4 bg-neutral-900 text-white rounded-full text-sm font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 group">
          Confirm configuration & start AI building
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
