import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Briefcase, Sparkles, ChevronLeft, 
  Rocket, Edit3, DollarSign, X, Check, Globe, 
  Layers, Target, Box, Plus, Tag, Link as LinkIcon, Megaphone,
  ChevronDown, Search, Languages, Users, UserPlus, UserMinus,
  ShoppingBag, Monitor, Smartphone, Layout, Facebook
} from 'lucide-react';

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
  'Fashion', 'E-commerce', 'Online Shopping', 'Luxury Goods', 
  'Beauty', 'Lifestyle', 'Travel', 'Technology', 'Fitness'
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
    <div className="w-full h-full bg-[#E2E8F0] p-4 flex flex-col gap-3 relative overflow-hidden group/dpa">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
        {/* Mock Product Items */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 duration-500">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
            <ShoppingBag size={16} className="text-blue-500" />
          </div>
          <div className="w-8 h-1 bg-slate-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-slate-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-75 duration-500">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
            <Monitor size={16} className="text-purple-500" />
          </div>
          <div className="w-8 h-1 bg-slate-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-slate-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-150 duration-500">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
            <Smartphone size={16} className="text-emerald-500" />
          </div>
          <div className="w-8 h-1 bg-slate-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-slate-50 rounded-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform transition-transform group-hover/dpa:scale-105 delay-200 duration-500">
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mb-1">
            <Layout size={16} className="text-rose-500" />
          </div>
          <div className="w-8 h-1 bg-slate-100 rounded-full mb-0.5" />
          <div className="w-5 h-1 bg-slate-50 rounded-full" />
        </div>
      </div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
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

  if (!isOpen || !adSet) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-none">编辑广告组配置</h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-2">Adset Level Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar pb-32">
          {/* Adset Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">广告组名称</label>
            <div className="relative group">
              <Edit3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                value={adSet.name} 
                onChange={e => onUpdateField('name', e.target.value)} 
                className="w-full h-14 pl-12 pr-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-indigo-600" />
                <h4 className="text-sm font-black text-slate-900">Audience 受众设置</h4>
              </div>
              
              <div className="flex items-center gap-3 bg-indigo-50/50 px-3 py-1.5 rounded-full border border-indigo-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-900">Advantage+</span>
                </div>
                <button 
                  onClick={() => onUpdateField('audienceType', adSet.audienceType === 'ADV' ? 'INT' : 'ADV')}
                  className={`w-10 h-5 rounded-full transition-all relative ${adSet.audienceType === 'ADV' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${adSet.audienceType === 'ADV' ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">年龄范围 (Age)</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">Min</span>
                    <input 
                      type="number" 
                      placeholder="18"
                      value={adSet.ageMin || ''} 
                      onChange={e => onUpdateField('ageMin', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="w-4 h-0.5 bg-slate-200 rounded-full" />
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">Max</span>
                    <input 
                      type="number" 
                      placeholder="65"
                      value={adSet.ageMax || ''} 
                      onChange={e => onUpdateField('ageMax', Number(e.target.value))} 
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">性别 (Gender)</label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {['All', 'Men', 'Women'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => onUpdateField('gender', g)} 
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${adSet.gender === g ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {g === 'Men' ? '男' : g === 'Women' ? '女' : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locations (Multi-select with tags) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">地理位置 (Locations)</label>
              <div className="relative">
                <div className="min-h-[3.5rem] p-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center focus-within:border-indigo-500 focus-within:bg-white transition-all cursor-text" onClick={() => setShowLocationDropdown(true)}>
                  <Globe size={16} className="text-slate-300 ml-2" />
                  {adSet.locations?.map(loc => (
                    <span key={loc} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-indigo-100 animate-in zoom-in-95">
                      {loc}
                      <X size={12} className="cursor-pointer hover:text-rose-500" onClick={(e) => { e.stopPropagation(); onToggleItem('locations', loc); }} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold min-w-[120px] px-2" 
                    placeholder={adSet.locations?.length > 0 ? "" : "搜索地理位置..."}
                    value={locationSearch}
                    onChange={e => { setLocationSearch(e.target.value); setShowLocationDropdown(true); }}
                    onFocus={() => setShowLocationDropdown(true)}
                  />
                </div>
                {showLocationDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowLocationDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[270] max-h-60 overflow-y-auto p-2 animate-in slide-in-from-top-2">
                      {AVAILABLE_LOCATIONS.filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase())).map(loc => {
                        const isSel = adSet.locations?.includes(loc.name);
                        return (
                          <div key={loc.id} onClick={() => onToggleItem('locations', loc.name)} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                            <span className={`text-xs font-bold ${isSel ? 'text-indigo-600' : 'text-slate-600'}`}>{loc.name}</span>
                            {isSel && <Check size={14} className="text-indigo-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interests (Multi-select with search) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">兴趣词 (Interests)</label>
              <div className="relative">
                <div className="min-h-[3.5rem] p-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center focus-within:border-indigo-500 focus-within:bg-white transition-all cursor-text" onClick={() => setShowInterestDropdown(true)}>
                  <Target size={16} className="text-slate-300 ml-2" />
                  {adSet.interests?.map(i => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-amber-100 animate-in zoom-in-95">
                      {i}
                      <X size={12} className="cursor-pointer hover:text-rose-500" onClick={(e) => { e.stopPropagation(); onToggleItem('interests', i); }} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold min-w-[120px] px-2" 
                    placeholder={adSet.interests?.length > 0 ? "" : "搜索兴趣词..."}
                    value={interestSearch}
                    onChange={e => { setInterestSearch(e.target.value); setShowInterestDropdown(true); }}
                    onFocus={() => setShowInterestDropdown(true)}
                  />
                </div>
                {showInterestDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowInterestDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[270] max-h-60 overflow-y-auto p-2 animate-in slide-in-from-top-2">
                      {AVAILABLE_INTERESTS.filter(i => i.toLowerCase().includes(interestSearch.toLowerCase())).map(i => {
                        const isSel = adSet.interests?.includes(i);
                        return (
                          <div key={i} onClick={() => onToggleItem('interests', i)} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                            <span className={`text-xs font-bold ${isSel ? 'text-amber-600' : 'text-slate-600'}`}>{i}</span>
                            {isSel && <Check size={14} className="text-amber-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Language (Single search select) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 tracking-widest">语言 (Language)</label>
              <div className="relative">
                <div onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Languages size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{adSet.language || 'All languages'}</span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </div>
                {showLanguageDropdown && (
                  <>
                    <div className="fixed inset-0 z-[260]" onClick={() => setShowLanguageDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[270] max-h-60 overflow-hidden flex flex-col animate-in slide-in-from-top-2">
                      <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                        <input 
                          autoFocus
                          type="text" 
                          className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 shadow-sm" 
                          placeholder="搜索语言..."
                          value={languageSearch}
                          onChange={e => setLanguageSearch(e.target.value)}
                        />
                      </div>
                      <div className="overflow-y-auto p-2">
                        {LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase())).map(l => (
                          <div key={l} onClick={() => { onUpdateField('language', l); setShowLanguageDropdown(false); setLanguageSearch(''); }} className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer mb-1 last:mb-0 transition-colors ${adSet.language === l ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
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

          <div className="h-px bg-slate-100" />

          {/* Custom Audience Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={16} className="text-purple-600" />
              <h4 className="text-sm font-black text-slate-900">自定义受众编辑</h4>
            </div>

            {/* Includes */}
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest">
                <UserPlus size={12} className="text-emerald-500" />
                Includes (包含受众)
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Audience Include */}
                <div className="space-y-3 relative">
                  <label className="text-[9px] font-bold text-slate-400 px-1">Custom Audience</label>
                  <div onClick={() => setShowCustomIncDropdown(!showCustomIncDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-indigo-300 transition-all shadow-sm">
                    {adSet.customInclude?.length > 0 ? adSet.customInclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black border border-indigo-100">
                        {CUSTOM_AUDIENCES.find(ca => ca.id === id)?.name}
                      </span>
                    )) : <span className="text-xs font-bold text-slate-300">选择自定义受众...</span>}
                  </div>
                  {showCustomIncDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowCustomIncDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">需要连接 Meta 以加载受众</p>
                            <button 
                              onClick={() => onAuthStatusChange?.(prev => ({ ...prev, meta: true }))}
                              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                            >
                              <Facebook size={12} /> 连接 Meta
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : (
                          CUSTOM_AUDIENCES.map(ca => {
                            const isSel = adSet.customInclude?.includes(ca.id);
                            return (
                              <div key={ca.id} onClick={() => onToggleItem('customInclude', ca.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group">
                                <span className={`text-[11px] font-bold ${isSel ? 'text-indigo-600' : 'text-slate-600'}`}>{ca.name}</span>
                                {isSel && <Check size={12} className="text-indigo-600" />}
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
                  <label className="text-[9px] font-bold text-slate-400 px-1">Lookalike Audience</label>
                  <div onClick={() => setShowLalIncDropdown(!showLalIncDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-purple-300 transition-all shadow-sm">
                    {adSet.lalInclude?.length > 0 ? adSet.lalInclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[9px] font-black border border-purple-100">
                        {LAL_AUDIENCES.find(la => la.id === id)?.name?.split(' ')[1] || 'LAL'}
                      </span>
                    )) : <span className="text-xs font-bold text-slate-300">选择 LAL 受众...</span>}
                  </div>
                  {showLalIncDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowLalIncDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">需要连接 Meta 以加载受众</p>
                            <button 
                              onClick={() => onAuthStatusChange?.(prev => ({ ...prev, meta: true }))}
                              className="w-full py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all"
                            >
                              <Facebook size={12} /> 连接 Meta
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : (
                          LAL_AUDIENCES.map(la => {
                            const isSel = adSet.lalInclude?.includes(la.id);
                            return (
                              <div key={la.id} onClick={() => onToggleItem('lalInclude', la.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 rounded-lg cursor-pointer group">
                                <span className={`text-[11px] font-bold ${isSel ? 'text-purple-600' : 'text-slate-600'}`}>{la.name}</span>
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
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest">
                <UserMinus size={12} className="text-rose-500" />
                Exclusions (排除受众)
              </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Audience Exclude */}
                <div className="space-y-3 relative">
                  <label className="text-[9px] font-bold text-slate-400 px-1">Custom Audience</label>
                  <div onClick={() => setShowCustomExcDropdown(!showCustomExcDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-indigo-300 transition-all shadow-sm">
                    {adSet.customExclude?.length > 0 ? adSet.customExclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[9px] font-black border border-slate-300">
                        {CUSTOM_AUDIENCES.find(ca => ca.id === id)?.name}
                      </span>
                    )) : <span className="text-xs font-bold text-slate-300">选择排除自定义受众...</span>}
                  </div>
                  {showCustomExcDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowCustomExcDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">需要连接 Meta 以加载受众</p>
                            <button 
                              onClick={() => onAuthStatusChange?.(prev => ({ ...prev, meta: true }))}
                              className="w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                              <Facebook size={12} /> 连接 Meta
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : (
                          CUSTOM_AUDIENCES.map(ca => {
                            const isSel = adSet.customExclude?.includes(ca.id);
                            return (
                              <div key={ca.id} onClick={() => onToggleItem('customExclude', ca.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group">
                                <span className={`text-[11px] font-bold ${isSel ? 'text-indigo-600' : 'text-slate-600'}`}>{ca.name}</span>
                                {isSel && <Check size={12} className="text-indigo-600" />}
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
                  <label className="text-[9px] font-bold text-slate-400 px-1">Lookalike Audience</label>
                  <div onClick={() => setShowLalExcDropdown(!showLalExcDropdown)} className="min-h-[3rem] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-purple-300 transition-all shadow-sm">
                    {adSet.lalExclude?.length > 0 ? adSet.lalExclude.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[9px] font-black border border-slate-300">
                        {LAL_AUDIENCES.find(la => la.id === id)?.name?.split(' ')[1] || 'LAL'}
                      </span>
                    )) : <span className="text-xs font-bold text-slate-300">选择排除 LAL 受众...</span>}
                  </div>
                  {showLalExcDropdown && (
                    <>
                      <div className="fixed inset-0 z-[260]" onClick={() => setShowLalExcDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl z-[270] max-h-48 overflow-y-auto p-1 animate-in zoom-in-95 duration-150">
                        {!authStatus?.meta ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">需要连接 Meta 以加载受众</p>
                            <button 
                              onClick={() => onAuthStatusChange?.(prev => ({ ...prev, meta: true }))}
                              className="w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                              <Facebook size={12} /> 连接 Meta
                            </button>
                          </div>
                        ) : !selectedAccount ? (
                          <div className="p-4 text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-3">请先选择广告账户</p>
                            <button 
                              onClick={onSelectAccount}
                              className="w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                              <Briefcase size={12} /> 选择账户
                            </button>
                          </div>
                        ) : (
                          LAL_AUDIENCES.map(la => {
                            const isSel = adSet.lalExclude?.includes(la.id);
                            return (
                              <div key={la.id} onClick={() => onToggleItem('lalExclude', la.id)} className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 rounded-lg cursor-pointer group">
                                <span className={`text-[11px] font-bold ${isSel ? 'text-purple-600' : 'text-slate-600'}`}>{la.name}</span>
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

        <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-end shrink-0 z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onClose} 
            className="px-16 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            保存修改
            <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignPreviewView = ({
  structure, budgetType, dailyBudget, initialAdsetAudiences, productCreativesMap, selectedProducts, brand, onBack, onPublish, campaignName, optimizationEvent, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, campaignType,
  estimatedTotalDaily, adSetGroupsCount, authStatus, selectedAccount, onAuthStatusChange, onSelectAccount
}) => {
  
  const [localAdSets, setLocalAdSets] = useState([]);
  const [editingAdSetIndex, setEditingAdSetIndex] = useState(null);
  const [editingAdInfo, setEditingAdInfo] = useState(null);
  
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
      } else if (structure.strategy === 'BY_AD_COUNT') {
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
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">编辑广告素材 (Ad)</h3>
            <button onClick={() => setEditingAdInfo(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">广告标题 (Headline)</label>
              <input type="text" value={ad.headline} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].headline = e.target.value; setLocalAdSets(next);
              }} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">广告正文 (Primary Text)</label>
              <textarea value={ad.primaryText} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].primaryText = e.target.value; setLocalAdSets(next);
              }} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold h-32 resize-none focus:border-indigo-600 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><Megaphone size={12} className="text-indigo-600"/> 行动号召 (CTA)</label>
              <div className="relative">
                <select 
                  value={ad.cta} 
                  onChange={e => {
                    const next = [...localAdSets]; next[asIndex].ads[adIndex].cta = e.target.value; setLocalAdSets(next);
                  }} 
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                >
                  {CTA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
            </div>

            {campaignType !== 'CATALOG' && (
              <>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><LinkIcon size={12} className="text-indigo-600"/> 落地页 URL</label>
                  <input 
                    type="text" 
                    value={ad.destinationUrl} 
                    onChange={e => {
                      const next = [...localAdSets]; next[asIndex].ads[adIndex].destinationUrl = e.target.value; setLocalAdSets(next);
                    }} 
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><Globe size={12} className="text-indigo-600"/> UTM 参数 (Tracking)</label>
                  <input 
                    type="text" 
                    placeholder="utm_source=meta&utm_medium=paid..."
                    value={ad.utmParams || ''} 
                    onChange={e => {
                      const next = [...localAdSets]; next[asIndex].ads[adIndex].utmParams = e.target.value; setLocalAdSets(next);
                    }} 
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>
              </>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><Tag size={12} className="text-indigo-600"/> 突显优惠 (Promo Offer)</label>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${ad.offerType === 'AUTO' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-300 border border-slate-100'}`}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">自动获取品牌优惠码</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">Auto-fetch: 90% OFF active</p>
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
                    className={`w-12 h-6 rounded-full transition-all relative ${ad.offerType === 'AUTO' ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ad.offerType === 'AUTO' ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onClick={() => setEditingAdInfo(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs">保存修改</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">发布方案预览</h2>
          <p className="text-sm text-slate-400 font-medium mt-1 tracking-widest">{campaignName} • {campaignType === 'CATALOG' ? '目录广告' : '商品广告'} 架构</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
          <ChevronLeft size={16} /> 返回修改配置
        </button>
      </div>

      <div className="space-y-16">
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-40 translate-x-40"></div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10"><Briefcase size={28} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 tracking-widest">Campaign Overview</p>
                <h3 className="text-2xl font-black">{campaignName}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 tracking-widest">总日消耗</p>
              <p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">投放国家</p>
              <p className="text-sm font-bold">{brand.country}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">优化目标</p>
              <p className="text-sm font-bold truncate">{optimizationEvent.split(' ')[0]}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">AdSets 数量</p>
              <p className="text-sm font-bold">{adSetGroupsCount || localAdSets.length}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">Campaign 类型</p>
              <p className="text-sm font-bold">{campaignType}</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {localAdSets.map((adSet, asIdx) => (
            <div key={asIdx} className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-black">AS{asIdx + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-black text-slate-400 tracking-widest">Ad Set</p>
                       <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded">{adSet.audienceType}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800">{adSet.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {adSet.interests.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
                      <Tag size={12} className="text-indigo-600" />
                      <span className="text-[9px] font-black text-indigo-600">{adSet.interests[0]} {adSet.interests.length > 1 ? `+${adSet.interests.length - 1}` : ''}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => setEditingAdSetIndex(asIdx)}
                    className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Edit3 size={14} /> 编辑配置
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {adSet.ads.map((ad, aIdx) => {
                  const product = selectedProducts.find(p => p.id === ad.productId);
                  return (
                    <div key={aIdx} className="group relative">
                      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 relative">
                        <button 
                          onClick={() => setEditingAdInfo({ asIndex: asIdx, adIndex: aIdx })}
                          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 shadow-lg"
                        >
                          <Edit3 size={14} />
                        </button>
                        <div className="p-4 bg-white border-b border-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">{brand.name.charAt(0)}</div>
                              <div><p className="text-[10px] font-bold text-slate-900">{brand.name}</p><p className="text-[8px] text-slate-400">Sponsored</p></div>
                            </div>
                            {ad.promoCode && (
                              <div className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                <Sparkles size={10} className="text-rose-500" />
                                <span className="text-[8px] font-black text-rose-600 tracking-tighter">{ad.promoCode}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-700 leading-relaxed line-clamp-2">{ad.primaryText}</p>
                        </div>
                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
                           {campaignType === 'CATALOG' ? (
                             <DPAPreviewCard />
                           ) : (
                             <img src={ad.imageUrl} className="w-full h-full object-cover" />
                           )}
                           {ad.isDynamic && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black tracking-widest">Dynamic Catalog Preview</div>}
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-slate-400 font-black truncate">{ad.destinationUrl.split('?')[0].split('/').slice(0,3).join('/')}</p>
                            <h6 className="text-[10px] font-black text-slate-900 truncate">{ad.headline}</h6>
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-800 shrink-0 tracking-tighter shadow-sm">{ad.cta}</div>
                        </div>
                        {product && (
                          <div className="p-2.5 bg-indigo-50/50 border-t border-indigo-100 flex items-center gap-2">
                             <img src={product.imageUrl} className="w-6 h-6 rounded-md object-cover border border-indigo-200" />
                             <div className="min-w-0 flex-1"><p className="text-[8px] font-black text-indigo-400 tracking-tighter">关联商品</p><p className="text-[9px] font-bold text-indigo-900 truncate">{product.name}</p></div>
                          </div>
                        )}
                        {ad.isDynamic && (
                           <div className="p-2.5 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2">
                              <Box size={14} className="text-emerald-400" />
                              <p className="text-[9px] font-bold text-emerald-900">使用目录动态字段渲染</p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-8 z-[100] border-t border-white/5 backdrop-blur-xl bg-opacity-95 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Layers size={24} /></div>
              <div><p className="text-[10px] font-black text-slate-400 tracking-widest">结构方案</p><p className="text-xl font-black">{adSetGroupsCount || localAdSets.length} Adsets • {campaignType === 'CATALOG' ? 'Dynamic' : localAdSets.reduce((acc, as) => acc + as.ads.length, 0)} Ads</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><DollarSign size={24} /></div>
              <div><p className="text-[10px] font-black text-slate-400 tracking-widest">预估日消耗</p><p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p></div>
            </div>
          </div>
          <button onClick={onPublish} className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-base shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-3">
            <Rocket size={20} className="text-indigo-600" /> 立即发布方案
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
