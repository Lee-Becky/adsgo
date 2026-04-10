import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Briefcase, Sparkles, ChevronLeft,
  Rocket, Edit3, DollarSign, X, Check, Globe,
  Layers, Target, Box, Plus, Tag, Link as LinkIcon, Megaphone,
  ChevronDown, Search, Languages, Users, UserPlus, UserMinus,
  ShoppingBag, Monitor, Smartphone, Layout, Facebook, Loader2, Trash2
} from 'lucide-react';
import useDropdownLoading from '../../../hooks/useDropdownLoading';

const AUDIENCE_NAMES = {
  LAL: 'LAL 1% US Purchase',
  INT: 'INT Lifestyle & Design',
  ADV: 'Advantage+ Audience'
};

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
    <div className="w-full h-full bg-gray-200 p-4 flex flex-col gap-3 relative overflow-hidden group/dpa">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
        {/* Mock Product Items */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 duration-500">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
            <ShoppingBag size={16} className="text-blue-500" />
          </div>
          <div className="w-8 h-1 bg-gray-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-gray-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-75 duration-500">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
            <Monitor size={16} className="text-purple-500" />
          </div>
          <div className="w-8 h-1 bg-gray-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-gray-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-150 duration-500">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
            <Smartphone size={16} className="text-emerald-500" />
          </div>
          <div className="w-8 h-1 bg-gray-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-gray-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-200 duration-500">
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mb-1">
            <Layout size={16} className="text-rose-500" />
          </div>
          <div className="w-8 h-1 bg-gray-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-gray-50 rounded-full" />
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
const EditAdSetModal = ({ isOpen, adSet, onUpdateField, onToggleItem, onClose, authStatus, selectedAccount, onAuthStatusChange, onSelectAccount }) => {
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const [showCustomIncDropdown, setShowCustomIncDropdown] = useState(false);
  const [showLalIncDropdown, setShowLalIncDropdown] = useState(false);
  const [showCustomExcDropdown, setShowCustomExcDropdown] = useState(false);
  const [showLalExcDropdown, setShowLalExcDropdown] = useState(false);

  const [isMetaConnecting, setIsMetaConnecting] = useState(false);

  const customIncLoading = useDropdownLoading('customAudienceInc', authStatus?.meta);
  const lalIncLoading = useDropdownLoading('lalAudienceInc', authStatus?.meta);
  const customExcLoading = useDropdownLoading('customAudienceExc', authStatus?.meta);
  const lalExcLoading = useDropdownLoading('lalAudienceExc', authStatus?.meta);

  useEffect(() => { if (showCustomIncDropdown && selectedAccount) customIncLoading.triggerLoad(); }, [showCustomIncDropdown]);
  useEffect(() => { if (showLalIncDropdown && selectedAccount) lalIncLoading.triggerLoad(); }, [showLalIncDropdown]);
  useEffect(() => { if (showCustomExcDropdown && selectedAccount) customExcLoading.triggerLoad(); }, [showCustomExcDropdown]);
  useEffect(() => { if (showLalExcDropdown && selectedAccount) lalExcLoading.triggerLoad(); }, [showLalExcDropdown]);

  const handleConnectMeta = () => {
    setIsMetaConnecting(true);
    setTimeout(() => {
      setIsMetaConnecting(false);
      onAuthStatusChange?.(prev => ({ ...prev, meta: true }));
      if (!selectedAccount) onSelectAccount?.();
    }, 3000);
  };

  if (!isOpen || !adSet) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-section shadow-xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-inner flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 leading-none">编辑广告组配置</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">Adset Level Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar pb-32">
          {/* Adset Name */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-500 px-1">广告组名称</label>
            <div className="relative group">
              <Edit3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                value={adSet.name} 
                onChange={e => onUpdateField('name', e.target.value)} 
                className="w-full h-14 pl-12 pr-5 border border-gray-200 rounded-base px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200" 
              />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-500" />
                <h4 className="text-sm font-semibold text-gray-900">Audience 受众设置</h4>
              </div>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500 px-1">年龄范围 (Age)</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">Min</span>
                    <input 
                      type="number" 
                      placeholder="18"
                      value={adSet.ageMin || ''} 
                      onChange={e => onUpdateField('ageMin', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="w-4 h-0.5 bg-gray-200 rounded-full" />
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">Max</span>
                    <input 
                      type="number" 
                      placeholder="65"
                      value={adSet.ageMax || ''} 
                      onChange={e => onUpdateField('ageMax', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500 px-1">性别 (Gender)</label>
                <div className="flex bg-gray-50 p-1 rounded-inner border border-gray-200">
                  {['All', 'Men', 'Women'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => onUpdateField('gender', g)} 
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${adSet.gender === g ? 'bg-white text-primary-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {g === 'Men' ? '男' : g === 'Women' ? '女' : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locations (Multi-select with tags) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500 px-1">地理位置 (Locations)</label>
              <div className="relative">
                <div className="min-h-[3.5rem] p-2 border border-gray-200 rounded-base flex flex-wrap gap-2 items-center focus-within:border-primary-500 focus-within:bg-white transition-all cursor-text" onClick={() => setShowLocationDropdown(true)}>
                  <Globe size={16} className="text-gray-300 ml-2" />
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
                {showLocationDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowLocationDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-inner shadow-xl z-[270] max-h-60 overflow-y-auto p-2 animate-in slide-in-from-top-2">
                      {AVAILABLE_LOCATIONS.filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase())).map(loc => {
                        const isSel = adSet.locations?.includes(loc.name);
                        return (
                          <div key={loc.id} onClick={() => onToggleItem('locations', loc.name)} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-inner cursor-pointer transition-colors group">
                            <span className={`text-xs font-medium ${isSel ? 'text-primary-500' : 'text-gray-600'}`}>{loc.name}</span>
                            {isSel && <Check size={14} className="text-primary-500" />}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interests (Dual-panel: search + AI packs) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500 px-1">兴趣词 (Interests)</label>
              {/* Tags above trigger */}
              {adSet.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {adSet.interests.map(name => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-tag text-xs font-medium border border-amber-100">
                      {name}
                      <button onClick={(e) => { e.stopPropagation(); onToggleItem('interests', name); }} className="text-amber-300 hover:text-rose-500 transition-colors">
                        <X size={10} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                {/* Trigger */}
                <div
                  className="px-4 py-3 border border-gray-200 rounded-base flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
                  onClick={() => setShowInterestDropdown(!showInterestDropdown)}
                >
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-gray-300" />
                    <span className="text-xs font-medium text-gray-300">
                      {adSet.interests?.length > 0 ? '添加更多兴趣词...' : '点击选择兴趣词...'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-300 transition-transform ${showInterestDropdown ? 'rotate-180' : ''}`} />
                </div>
                {/* Dual-panel dropdown */}
                {showInterestDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowInterestDropdown(false)} />
                    <div className="absolute top-full left-0 mt-2 w-[540px] bg-white rounded-section shadow-xl border border-gray-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200 z-[270]">
                      {/* Left: Search & List */}
                      <div className="w-[55%] border-r border-gray-100 flex flex-col">
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                            <input
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-base text-sm text-gray-700 bg-white focus:outline-none focus:border-primary-500 transition-all duration-200"
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
                              <p className="text-xs text-gray-300 font-medium">请输入关键词查询</p>
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
                                      isSel ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div>
                                      <span>{interest.name}</span>
                                      <span className="ml-2 text-gray-400">{interest.size}</span>
                                    </div>
                                    {isSel && <Check size={12} />}
                                  </button>
                                );
                              })
                          )}
                        </div>
                      </div>
                      {/* Right: AI Recommended */}
                      <div className="w-[45%] bg-gray-50/50 flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                          <Sparkles size={12} className="text-primary-500" />
                          <span className="text-xs font-semibold text-gray-700">AI Recommended</span>
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
                                  allIn ? 'border-primary-500 bg-primary-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-gray-800 line-clamp-1">{pack.name}</span>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-2 ${allIn ? 'bg-primary-500 text-white' : 'border border-gray-200'}`}>
                                    {allIn && <Check size={10} />}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-2">{pack.interests.join(', ')}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Language (Single search select) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500 px-1">语言 (Language)</label>
              <div className="relative">
                <div onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="w-full h-14 px-5 border border-gray-200 rounded-base flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Languages size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{adSet.language || 'All languages'}</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-300 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </div>
                {showLanguageDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowLanguageDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-inner shadow-xl z-[270] max-h-60 overflow-hidden flex flex-col animate-in slide-in-from-top-2">
                      <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                        <input 
                          autoFocus
                          type="text" 
                          className="w-full h-10 px-4 border border-gray-200 rounded-base text-xs text-gray-700 bg-white focus:outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all duration-200" 
                          placeholder="搜索语言..."
                          value={languageSearch}
                          onChange={e => setLanguageSearch(e.target.value)}
                        />
                      </div>
                      <div className="overflow-y-auto p-2">
                        {LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase())).map(l => (
                          <div key={l} onClick={() => { onUpdateField('language', l); setShowLanguageDropdown(false); setLanguageSearch(''); }} className={`px-4 py-3 rounded-inner text-xs font-medium cursor-pointer mb-1 last:mb-0 transition-colors ${adSet.language === l ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Custom Audience Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={16} className="text-purple-600" />
              <h4 className="text-sm font-semibold text-gray-900">自定义受众编辑</h4>
            </div>

            {/* Includes */}
            <div className="p-6 bg-gray-50/50 rounded-inner border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <UserPlus size={12} className="text-emerald-500" />
                Includes (包含受众)
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Audience Include */}
                <div className="space-y-3 relative">
                  <label className="text-xs font-medium text-gray-500 px-1">Custom Audience</label>
                  <div onClick={() => setShowCustomIncDropdown(!showCustomIncDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-gray-200 rounded-base flex flex-wrap gap-2 items-center cursor-pointer hover:border-primary-500/30 transition-all shadow-sm">
                    {adSet.customInclude?.length > 0 ? adSet.customInclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-primary-50 text-primary-500 rounded-md text-xs font-medium border border-primary-500/15">
                        {CUSTOM_AUDIENCES.find(ca => ca.id === id)?.name}
                      </span>
                    )) : <span className="text-xs font-medium text-gray-300">选择自定义受众...</span>}
                  </div>
                  {showCustomIncDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowCustomIncDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-inner shadow-xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">需要连接 Meta 以加载受众</p>
                            <button
                              onClick={handleConnectMeta}
                              disabled={isMetaConnecting}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" /> Connecting...</> : <><Facebook size={12} /> 连接 Meta</>}
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : customIncLoading.isLoading ? (
                          <div className="p-6 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin text-primary-500/70" />
                            <p className="text-xs font-medium text-gray-400 animate-pulse">Loading audiences...</p>
                          </div>
                        ) : (
                          CUSTOM_AUDIENCES.map(ca => {
                            const isSel = adSet.customInclude?.includes(ca.id);
                            return (
                              <div key={ca.id} onClick={() => onToggleItem('customInclude', ca.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group">
                                <span className={`text-xs font-medium ${isSel ? 'text-primary-500' : 'text-gray-600'}`}>{ca.name}</span>
                                {isSel && <Check size={12} className="text-primary-500" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* LAL Include */}
                <div className="space-y-3 relative">
                  <label className="text-xs font-medium text-gray-500 px-1">Lookalike Audience</label>
                  <div onClick={() => setShowLalIncDropdown(!showLalIncDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-gray-200 rounded-base flex flex-wrap gap-2 items-center cursor-pointer hover:border-purple-300 transition-all shadow-sm">
                    {adSet.lalInclude?.length > 0 ? adSet.lalInclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-xs font-medium border border-purple-100">
                        {LAL_AUDIENCES.find(la => la.id === id)?.name?.split(' ')[1] || 'LAL'}
                      </span>
                    )) : <span className="text-xs font-medium text-gray-300">选择 LAL 受众...</span>}
                  </div>
                  {showLalIncDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowLalIncDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-inner shadow-xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">需要连接 Meta 以加载受众</p>
                            <button
                              onClick={handleConnectMeta}
                              disabled={isMetaConnecting}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" /> Connecting...</> : <><Facebook size={12} /> 连接 Meta</>}
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : lalIncLoading.isLoading ? (
                          <div className="p-6 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin text-purple-500/70" />
                            <p className="text-xs font-medium text-gray-400 animate-pulse">Loading audiences...</p>
                          </div>
                        ) : (
                          LAL_AUDIENCES.map(la => {
                            const isSel = adSet.lalInclude?.includes(la.id);
                            return (
                              <div key={la.id} onClick={() => onToggleItem('lalInclude', la.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 rounded-lg cursor-pointer group">
                                <span className={`text-xs font-medium ${isSel ? 'text-purple-600' : 'text-gray-600'}`}>{la.name}</span>
                                {isSel && <Check size={12} className="text-purple-600" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Exclusions */}
            <div className="p-6 bg-gray-50/50 rounded-inner border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <UserMinus size={12} className="text-rose-500" />
                Exclusions (排除受众)
              </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Audience Exclude */}
                <div className="space-y-3 relative">
                  <label className="text-xs font-medium text-gray-500 px-1">Custom Audience</label>
                  <div onClick={() => setShowCustomExcDropdown(!showCustomExcDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-gray-200 rounded-base flex flex-wrap gap-2 items-center cursor-pointer hover:border-primary-500/30 transition-all shadow-sm">
                    {adSet.customExclude?.length > 0 ? adSet.customExclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-md text-xs font-medium border border-gray-300">
                        {CUSTOM_AUDIENCES.find(ca => ca.id === id)?.name}
                      </span>
                    )) : <span className="text-xs font-medium text-gray-300">选择排除自定义受众...</span>}
                  </div>
                  {showCustomExcDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowCustomExcDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-inner shadow-xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">需要连接 Meta 以加载受众</p>
                            <button
                              onClick={handleConnectMeta}
                              disabled={isMetaConnecting}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" /> Connecting...</> : <><Facebook size={12} /> 连接 Meta</>}
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : customExcLoading.isLoading ? (
                          <div className="p-6 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin text-primary-500/70" />
                            <p className="text-xs font-medium text-gray-400 animate-pulse">Loading audiences...</p>
                          </div>
                        ) : (
                          CUSTOM_AUDIENCES.map(ca => {
                            const isSel = adSet.customExclude?.includes(ca.id);
                            return (
                              <div key={ca.id} onClick={() => onToggleItem('customExclude', ca.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group">
                                <span className={`text-xs font-medium ${isSel ? 'text-primary-500' : 'text-gray-600'}`}>{ca.name}</span>
                                {isSel && <Check size={12} className="text-primary-500" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* LAL Exclude */}
                <div className="space-y-3 relative">
                  <label className="text-xs font-medium text-gray-500 px-1">Lookalike Audience</label>
                  <div onClick={() => setShowLalExcDropdown(!showLalExcDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-gray-200 rounded-base flex flex-wrap gap-2 items-center cursor-pointer hover:border-purple-300 transition-all shadow-sm">
                    {adSet.lalExclude?.length > 0 ? adSet.lalExclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-md text-xs font-medium border border-gray-300">
                        {LAL_AUDIENCES.find(la => la.id === id)?.name?.split(' ')[1] || 'LAL'}
                      </span>
                    )) : <span className="text-xs font-medium text-gray-300">选择排除 LAL 受众...</span>}
                  </div>
                  {showLalExcDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowLalExcDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-inner shadow-xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">需要连接 Meta 以加载受众</p>
                            <button
                              onClick={handleConnectMeta}
                              disabled={isMetaConnecting}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {isMetaConnecting ? <><Loader2 size={12} className="animate-spin" /> Connecting...</> : <><Facebook size={12} /> 连接 Meta</>}
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus flex items-center justify-center gap-2"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : lalExcLoading.isLoading ? (
                          <div className="p-6 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin text-purple-500/70" />
                            <p className="text-xs font-medium text-gray-400 animate-pulse">Loading audiences...</p>
                          </div>
                        ) : (
                          LAL_AUDIENCES.map(la => {
                            const isSel = adSet.lalExclude?.includes(la.id);
                            return (
                              <div key={la.id} onClick={() => onToggleItem('lalExclude', la.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 rounded-lg cursor-pointer group">
                                <span className={`text-xs font-medium ${isSel ? 'text-purple-600' : 'text-gray-600'}`}>{la.name}</span>
                                {isSel && <Check size={12} className="text-purple-600" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0 z-[300]">
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
  <div className="bg-white rounded-section border border-gray-200 overflow-hidden shadow-adsgo-card relative">
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="space-y-2">
          <div className="w-20 h-2 bg-gray-100 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="w-12 h-1.5 bg-gray-50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-2 bg-gray-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="w-4/5 h-2 bg-gray-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
    <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center">
      <div className="relative">
        <Sparkles className="text-primary-500/30 w-16 h-16 animate-[pulse_2s_infinite_ease-in-out]" />
        <Sparkles className="text-purple-500/40 w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_infinite_linear]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="w-24 h-1.5 bg-gray-50 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="w-32 h-2.5 bg-gray-100 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      <div className="w-16 h-8 bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
    <div className="p-3 bg-gray-50/50 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="w-20 h-2 bg-gray-100 rounded relative overflow-hidden">
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
  estimatedTotalDaily, adSetGroupsCount, authStatus, selectedAccount, onAuthStatusChange, onSelectAccount,
  isExistingCampaign, campaignObjective, onBudgetChange, onBudgetTypeChange
}) => {

  const [localAdSets, setLocalAdSets] = useState([]);
  const [editingAdSetIndex, setEditingAdSetIndex] = useState(null);
  const [editingAdInfo, setEditingAdInfo] = useState(null);
  const [loadedAdsCount, setLoadedAdsCount] = useState(0);
  const [isEditingCampaignName, setIsEditingCampaignName] = useState(false);
  const [localCampaignName, setLocalCampaignName] = useState(campaignName);
  const [selectedCta, setSelectedCta] = useState(OBJECTIVE_CTA_MAPPING[campaignObjective] || 'Shop Now');
  const [isCtaOpen, setIsCtaOpen] = useState(false);
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
    if (copyStrategy === 'UNIFIED') return { headline: unifiedHeadline, body: unifiedBody };
    return { headline: `Get your ${p.name} today!`, body: `Discover quality and style that lasts with our exclusive ${p.name}. Limited time offer.` };
  };

  useEffect(() => {
    let adSets = [];
    const targetAdSetCount = adSetGroupsCount || 0;

    if (campaignType === 'CATALOG') {
      for (let i = 0; i < targetAdSetCount; i++) {
        const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
        adSets.push({
          name: `DPA-${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
          audienceType,
          ageMin: 18, ageMax: 65, gender: 'All', 
          locations: ['United States'],
          interests: ['Broad Shopping'], 
          language: 'All languages',
          customInclude: [],
          lalInclude: [],
          customExclude: [],
          lalExclude: [],
          placements: ['All'], optimizationEvent,
          ads: [{
            id: `cat-${i}`,
            name: `Dynamic Catalog Creative`,
            headline: '{{product.name}}',
            primaryText: 'Check out our latest arrivals. {{product.description}}',
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
          const copy = getAdCopy(p);
          
          for (let i = 0; i < adsetsPerProduct; i++) {
            const adSetOverallIdx = (pIdx * adsetsPerProduct) + i;
            const audienceType = initialAdsetAudiences[adSetOverallIdx % initialAdsetAudiences.length] || 'ADV';
            
            adSets.push({
              name: adsetsPerProduct > 1 ? `${p.name} - 组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}` : `${p.name} - ${AUDIENCE_NAMES[audienceType]}`,
              audienceType,
              ageMin: 18, ageMax: 65, gender: 'All', 
              locations: ['United States'],
              interests: ['E-commerce', 'Shopping'], 
              language: 'All languages',
              customInclude: [],
              lalInclude: [],
              customExclude: [],
              lalExclude: [],
              placements: ['Feed', 'Stories', 'Reels'], optimizationEvent,
              ads: creatives.map((c, cIdx) => ({
                id: `${p.id}-${i}-${cIdx}`,
                name: `AD - ${p.name} - ${c.id.slice(-4)}`,
                headline: copy.headline,
                primaryText: copy.body,
                imageUrl: c.url,
                cta: 'Shop Now',
                destinationUrl: getAdUrl(p),
                utmParams: ``,
                productId: p.id,
                offerType: 'AUTO',
                promoCode: '90%OFF'
              }))
            });
          }
        });
      } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
        const allCreativesPool = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        for (let i = 0; i < targetAdSetCount; i++) {
          const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
          adSets.push({
            name: `混合组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
            audienceType,
            ageMin: 18, ageMax: 65, gender: 'All', 
            locations: ['United States'],
            interests: ['E-commerce', 'Shopping'], 
            language: 'All languages',
            customInclude: [],
            lalInclude: [],
            customExclude: [],
            lalExclude: [],
            placements: ['Feed', 'Stories'], optimizationEvent,
            ads: allCreativesPool.map((c, cIdx) => {
              const p = selectedProducts.find(prod => prod.id === c.productId);
              const copy = getAdCopy(p);
              return {
                id: `${i}-${cIdx}`,
                name: `AD - ${p.name} - ${c.id.slice(-4)}`,
                headline: copy.headline,
                primaryText: copy.body,
                imageUrl: c.url,
                cta: 'Shop Now',
                destinationUrl: getAdUrl(p),
                utmParams: ``,
                productId: p.id,
                offerType: 'AUTO',
                promoCode: '90%OFF'
              };
            })
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
            
            adSets.push({
              name: `智能分组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
              audienceType,
              ageMin: 18, ageMax: 65, gender: 'All', 
              locations: ['United States'],
              interests: ['Fashion'], 
              language: 'All languages',
              customInclude: [],
              lalInclude: [],
              customExclude: [],
              lalExclude: [],
              placements: ['Feed'], optimizationEvent,
              ads: chunk.map((c, cIdx) => {
                const p = selectedProducts.find(prod => prod.id === c.productId);
                const copy = getAdCopy(p);
                return {
                  id: `${i}-${cIdx}`,
                  name: `AD - G${i + 1} - ${c.id.slice(-4)}`,
                  headline: copy.headline,
                  primaryText: copy.body,
                  imageUrl: c.url,
                  cta: 'Shop Now',
                  destinationUrl: getAdUrl(p),
                  utmParams: ``,
                  productId: p.id,
                  offerType: 'AUTO',
                  promoCode: '90%OFF'
                };
              })
            });
            currentIndex += currentGroupSize;
          }
        }
      }
    }
    setLocalAdSets(adSets);
  }, [campaignType, selectedProducts, structure, productCreativesMap, initialAdsetAudiences, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, optimizationEvent, adSetGroupsCount]);

  const totalDailyBudget = estimatedTotalDaily || (budgetType === 'CBO' ? dailyBudget : dailyBudget * localAdSets.length);

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
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-section shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">编辑广告素材 (Ad)</h3>
            <button onClick={() => setEditingAdInfo(null)} className="p-2 hover:bg-gray-50 rounded-full text-gray-300"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-400 px-1">广告标题 (Headline)</label>
              <input type="text" value={ad.headline} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].headline = e.target.value; setLocalAdSets(next);
              }} className="w-full h-12 px-5 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-400 px-1">广告正文 (Primary Text)</label>
              <textarea value={ad.primaryText} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].primaryText = e.target.value; setLocalAdSets(next);
              }} className="w-full p-5 border border-gray-200 rounded-base bg-white text-sm font-medium h-32 resize-none focus:border-primary-500 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-400 px-1 flex items-center gap-2"><Megaphone size={12} className="text-primary-500"/> 行动号召 (CTA)</label>
              <div className="relative">
                <select 
                  value={ad.cta} 
                  onChange={e => {
                    const next = [...localAdSets]; next[asIndex].ads[adIndex].cta = e.target.value; setLocalAdSets(next);
                  }} 
                  className="w-full h-12 px-5 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  {CTA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              </div>
            </div>

            {campaignType !== 'CATALOG' && (
              <>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 px-1 flex items-center gap-2"><LinkIcon size={12} className="text-primary-500"/> 落地页 URL</label>
                  <input 
                    type="text" 
                    value={ad.destinationUrl} 
                    onChange={e => {
                      const next = [...localAdSets]; next[asIndex].ads[adIndex].destinationUrl = e.target.value; setLocalAdSets(next);
                    }} 
                    className="w-full h-12 px-5 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 px-1 flex items-center gap-2"><Globe size={12} className="text-primary-500"/> UTM 参数 (Tracking)</label>
                  <input 
                    type="text" 
                    placeholder="utm_source=meta&utm_medium=paid..."
                    value={ad.utmParams || ''} 
                    onChange={e => {
                      const next = [...localAdSets]; next[asIndex].ads[adIndex].utmParams = e.target.value; setLocalAdSets(next);
                    }} 
                    className="w-full h-12 px-5 border border-gray-200 rounded-base bg-white text-sm font-medium focus:border-primary-500 outline-none transition-all" 
                  />
                </div>
              </>
            )}

            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-400 px-1 flex items-center gap-2"><Tag size={12} className="text-primary-500"/> 突显优惠 (Promo Offer)</label>
              <div className="p-5 bg-gray-50 rounded-inner border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-inner flex items-center justify-center transition-colors ${ad.offerType === 'AUTO' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/10' : 'bg-white text-gray-300 border border-gray-100'}`}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">自动获取品牌优惠码</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Auto-fetch: 90% OFF active</p>
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
                    className={`w-12 h-6 rounded-full transition-all relative ${ad.offerType === 'AUTO' ? 'bg-primary-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ad.offerType === 'AUTO' ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button onClick={() => setEditingAdInfo(null)} className="px-10 py-4 bg-primary-500 text-white rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus">保存修改</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">发布方案预览</h2>
          <p className="text-sm text-gray-400 font-medium mt-1 tracking-widest">{localCampaignName} • {campaignType === 'CATALOG' ? '目录广告' : '落地页广告'} 架构</p>
        </div>
        <button onClick={onBack} className="border border-primary-500 text-primary-500 rounded-base text-sm font-medium hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 px-6 py-3 flex items-center gap-2">
          <ChevronLeft size={16} /> 返回修改配置
        </button>
      </div>

      <div className="space-y-16">
        <div className="bg-gray-900 p-6 rounded-section shadow-xl text-white relative overflow-visible">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -translate-y-40 translate-x-40 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary-500 rounded-inner flex items-center justify-center shadow-lg border-2 border-white/10"><Briefcase size={22} /></div>
              <div>
                <p className="text-xs font-medium text-gray-500">Campaign Overview</p>
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
                      <button onClick={() => setIsEditingCampaignName(false)} className="text-emerald-400 hover:text-emerald-300"><Check size={16} /></button>
                      <button onClick={() => { setLocalCampaignName(campaignName); setIsEditingCampaignName(false); }} className="text-gray-400 hover:text-gray-300"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/name">
                      <h3 className="text-xl font-semibold">{localCampaignName}</h3>
                      <button onClick={() => setIsEditingCampaignName(true)} className="opacity-0 group-hover/name:opacity-100 transition-opacity text-gray-400 hover:text-white">
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
              <p className="text-xs font-medium text-gray-500 tracking-widest">规模概览</p>
              <p className="text-xl font-semibold text-emerald-400">{adSetGroupsCount || localAdSets.length} Adsets · {localAdSets.reduce((s, as) => s + (as.ads?.length || 0), 0)} Ads</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-gray-500 mb-0.5">投放国家</p>
              <p className="text-sm font-medium">{brand.country}</p>
            </div>
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-gray-500 mb-0.5">优化目标</p>
              <p className="text-sm font-medium truncate">{optimizationEvent || '—'}</p>
            </div>
            <div className="bg-white/5 rounded-inner p-3 border border-white/5">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Daily Budget</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 shrink-0">
                  {['CBO', 'ABO'].map(mode => (
                    <button key={mode} disabled={isExistingCampaign}
                      onClick={() => { if (!isExistingCampaign && onBudgetTypeChange) onBudgetTypeChange(mode); }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        budgetType === mode ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
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
            <div className="bg-white/5 rounded-inner p-3 border border-white/5 relative">
              <p className="text-xs font-medium text-gray-500 mb-0.5">CTA</p>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsCtaOpen(!isCtaOpen)}>
                <p className="text-sm font-medium">{selectedCta}</p>
                <ChevronDown size={11} className={`text-gray-500 transition-transform ml-auto ${isCtaOpen ? 'rotate-180' : ''}`} />
              </div>
              {isCtaOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-base shadow-xl border border-gray-100 p-1.5 animate-in fade-in zoom-in-95 duration-200" style={{ zIndex: 9999 }}>
                  {CTA_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSelectedCta(opt); setIsCtaOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                        selectedCta === opt ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      {opt}
                      {selectedCta === opt && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {localAdSets.map((adSet, asIdx) => (
            <div key={asIdx} className="bg-white border border-gray-100 rounded-section p-10 shadow-adsgo-card space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-inner flex items-center justify-center font-semibold">AS{asIdx + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-xs font-medium text-gray-500">Ad Set</p>
                       <span className="px-1.5 py-0.5 bg-primary-50 text-primary-500 text-xs font-semibold rounded-tag">{adSet.audienceType}</span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800">{adSet.name}</h4>
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
                      className="border border-gray-200 text-gray-400 rounded-base text-sm font-medium hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 px-3 py-2"
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

                  return (
                    <div key={aIdx} className="group relative">
                      <div className="bg-white rounded-section border border-gray-200 overflow-hidden shadow-adsgo-card transition-all hover:shadow-xl hover:border-primary-500/20 relative animate-in fade-in zoom-in-95 duration-500">
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => setEditingAdInfo({ asIndex: asIdx, adIndex: aIdx })}
                            className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-primary-500 shadow-lg transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          {adSet.ads.length > 1 && (
                            <button
                              onClick={() => setLocalAdSets(prev => { const next = [...prev]; next[asIdx] = { ...next[asIdx], ads: next[asIdx].ads.filter((_, i) => i !== aIdx) }; return next; })}
                              className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-lg transition-colors"
                              title="删除此广告"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <div className="p-4 bg-white border-b border-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-medium text-white">{brand.name.charAt(0)}</div>
                              <div><p className="text-xs font-medium text-gray-900">{brand.name}</p><p className="text-xs text-gray-500">Sponsored</p></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{ad.primaryText}</p>
                        </div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                           {campaignType === 'CATALOG' ? (
                             <DPAPreviewCard />
                           ) : (
                             <img src={ad.imageUrl} className="w-full h-full object-cover" />
                           )}
                           {ad.isDynamic && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold tracking-widest">Dynamic Catalog Preview</div>}
                        </div>
                        <div className="p-4 bg-gray-50 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold truncate">{ad.destinationUrl.split('?')[0].split('/').slice(0,3).join('/')}</p>
                            <h6 className="text-xs font-medium text-gray-900 truncate">{ad.headline}</h6>
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-800 shrink-0 tracking-tighter shadow-sm">{selectedCta}</div>
                        </div>
                        {product && (
                          <div className="p-2.5 bg-primary-50/50 border-t border-primary-500/15 flex items-center gap-2">
                             <img src={product.imageUrl} className="w-6 h-6 rounded-md object-cover border border-primary-500/20" />
                             <div className="min-w-0 flex-1"><p className="text-xs font-medium text-primary-500/70 tracking-tighter">关联落地页</p><p className="text-xs font-medium text-primary-700 truncate">{product.name}</p></div>
                          </div>
                        )}
                        {ad.isDynamic && (
                           <div className="p-2.5 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2">
                              <Box size={14} className="text-emerald-400" />
                              <p className="text-xs font-medium text-emerald-900">使用目录动态字段渲染</p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-8 py-4 z-[100] border-t border-white/5 backdrop-blur-xl bg-opacity-95 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-base flex items-center justify-center shadow-lg"><Layers size={20} /></div>
              <div><p className="text-xs font-medium text-gray-500">结构方案</p><p className="text-base font-semibold">{adSetGroupsCount || localAdSets.length} Adsets • {campaignType === 'CATALOG' ? 'Dynamic' : localAdSets.reduce((acc, as) => acc + as.ads.length, 0)} Ads</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-base flex items-center justify-center shadow-lg"><DollarSign size={20} /></div>
              <div><p className="text-xs font-medium text-gray-500">预估日消耗</p><p className="text-xl font-semibold text-emerald-400">${totalDailyBudget}</p></div>
            </div>
          </div>
          <button
            onClick={onPublish}
            disabled={loadedAdsCount < totalAdsCount}
            className={`px-10 py-3.5 rounded-base text-sm font-medium transition-all duration-200 flex items-center gap-3 focus:outline-none focus:shadow-primary-focus ${
              loadedAdsCount < totalAdsCount
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'
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
      />
      <EditAdModal />
    </div>
  );
};

export default CampaignPreviewView;
