import React, { useState, useEffect } from 'react';
import { 
  Link, 
  Check, 
  ArrowUp, 
  ChevronLeft, 
  ChevronRight,
  Fingerprint,
  Sparkle,
  Users,
  Zap,
  Swords,
  RadioTower,
  TrendingUp,
  Globe,
  Megaphone,
  MapPin,
  Star,
  ExternalLink,
  Trash2,
  Plus,
  Briefcase,
  Target,
  Tag as TagIcon,
  Phone,
  Mail,
  Quote,
  Upload,
  X,
  Layout,
  Sparkles,
  Palette,
  Shuffle,
  DollarSign,
  Play,
  LineChart,
  PieChart,
  Building2,
  Edit3,
  Layers,
  CreditCard,
  Search,
  Radio,
  Image as ImageIcon,
  MousePointer2,
  Info,
  Loader2
} from 'lucide-react';
import { mockProfile } from './mockData';
import BaseModal from './Common';

const industryOptions = [
  "时尚/配饰", "美妆/个护", "服装/鞋履", "体育/户外", "消费电子/3C",
  "电商/零售", "企业服务/Saas", "制造业", "金融科技", "医疗健康",
  "教育培训", "文娱传媒", "社交/社区", "游戏/电竞", "房地产/建筑",
  "交通物流", "餐饮/食品", "旅游/酒店", "家居/生活"
];

const BrandProfile = () => {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditMode, setIsEditMode] = useState(false);
  const [domainAtEditStart, setDomainAtEditStart] = useState("");
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(0);
  const [currentAudienceIndex, setCurrentAudienceIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(true);
  const [updateDomain, setUpdateDomain] = useState(mockProfile.domain || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync updateDomain with current profile.domain whenever modal is opened
  useEffect(() => {
    if (isUpdateModalOpen) {
      setUpdateDomain(profile.domain || '');
    }
  }, [isUpdateModalOpen, profile.domain]);

  const handleSave = () => {
    setIsEditMode(false);
    console.log('Profile saved:', profile);
    alert('Changes saved successfully!');
  };

  const handleEdit = () => {
    setDomainAtEditStart(profile.domain || "");
    setIsEditMode(true);
  };

  const handleColorChange = (id, hex) => {
    setProfile(prev => ({
      ...prev,
      colors: prev.colors?.map(c => c.id === id ? { ...c, hex } : c) || []
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let timer;
    if (isUpdating && elapsedTime < 10) {
      timer = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= 9) {
            setIsUpdating(false);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isUpdating, elapsedTime]);

  const handleStartUpdate = () => {
    setIsUpdateModalOpen(false);
    setIsUpdating(true);
    setElapsedTime(0);
    // Persist domain value from modal to profile state
    setProfile(prev => ({ ...prev, domain: updateDomain }));
  };

  const nextAudience = () => {
    const count = profile.customer_segments?.length || 0;
    if (count > 0) {
      setCurrentAudienceIndex((prev) => (prev + 1) % count);
    }
  };

  const prevAudience = () => {
    const count = profile.customer_segments?.length || 0;
    if (count > 0) {
      setCurrentAudienceIndex((prev) => (prev - 1 + count) % count);
    }
  };

  const formatMarketMaturity = (value) => {
    const map = { 'emerging': '新兴市场', 'growth': '成长期', 'mature': '成熟市场', 'declining': '衰退期' };
    return map[value] || value;
  };

  const formatPriceTier = (value) => {
    const map = { 'luxury': '奢侈品', 'premium': '高端', 'mid-range': '中端', 'value': '性价比', 'budget': '平价' };
    return map[value] || value;
  };

  const formatMarketingGoal = (value) => {
    const map = { 'awareness': '品牌认知', 'consideration': '购买考虑', 'conversion': '转化购买', 'retention': '用户留存', 'advocacy': '口碑传播' };
    return map[value] || value;
  };

  const getFeatureIcon = (index) => {
    const icons = [
      Megaphone, Layout, Sparkles, Palette, Shuffle, 
      Target, DollarSign, Play, LineChart, PieChart, Link
    ];
    const IconComp = icons[index % icons.length] || Star;
    return <IconComp size={index === 0 ? 24 : 20} />;
  };

  const SvgGraphic = ({ type, color = "currentColor", opacity = 0.1 }) => {
    if (type === 'wave') return (
      <svg className="absolute right-0 bottom-0 w-32 h-32 pointer-events-none opacity-20" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 Q 25 30 50 50 T 100 50 V 100 H 0 Z" fill={color} />
      </svg>
    );
    if (type === 'chart') return (
      <svg className="absolute right-4 bottom-4 w-24 h-16 pointer-events-none opacity-20" viewBox="0 0 100 100">
        <path d="M10 80 L30 40 L50 60 L70 20 L90 50" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="40" r="4" fill={color} />
        <circle cx="70" cy="20" r="4" fill={color} />
      </svg>
    );
    return null;
  };

  // Helper to parse strings like "Title (Description)"
  const parseItem = (str) => {
    if (!str) return { title: '', desc: '' };
    const match = str.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { title: match[1].trim(), desc: match[2].trim() };
    }
    return { title: str.trim(), desc: '' };
  };

  // Helper to format factors for editing
  const getFactorsText = (category) => {
    return profile.dimensions?.impact_analysis?.impact_factors
      ?.filter(f => f.category === category)
      ?.map(f => f.importance === '高' ? `${f.factor} (高)` : f.factor)
      ?.join(', ') || '';
  };

  // Helper to parse factors from editing
  const handleFactorsChange = (category, text) => {
    const items = text.split(',').map(s => s.trim()).filter(Boolean);
    const newFactors = items.map(item => {
      const { title, desc } = parseItem(item);
      return {
        category,
        factor: title,
        importance: desc === '高' ? '高' : '中'
      };
    });

    setProfile(prev => {
      const otherFactors = prev.dimensions?.impact_analysis?.impact_factors?.filter(f => f.category !== category) || [];
      return {
        ...prev,
        dimensions: {
          ...prev.dimensions,
          impact_analysis: {
            ...prev.dimensions?.impact_analysis,
            impact_factors: [...otherFactors, ...newFactors]
          }
        }
      };
    });
  };

  // Helper to highlight keywords in text
  const highlightText = (text) => {
    if (!text) return null;
    const keywords = [
      '创意分析', '受众优化', '自动化规则', '出价', '预算调度', 
      'Google Ads', '脚本', '预算分配', '出价策略', '企业级', 
      '自动化', '创意规模化', '自主学习', 'Ai生成', 'Ai视频/图片', 
      '政策变动', '竞品加剧'
    ];
    
    let parts = [text];
    keywords.forEach(kw => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const splitPart = part.split(kw);
          splitPart.forEach((sub, i) => {
            newParts.push(sub);
            if (i < splitPart.length - 1) {
              newParts.push(<strong key={sub+i} className="bg-amber-100/60 px-1 rounded mx-0.5 font-bold text-slate-800">{kw}</strong>);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    
    return parts;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans relative">
      <style>{`
        @media print { .no-print { display: none !important; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
      `}</style>

      <div className="sticky top-0 z-50 py-3 px-10 pointer-events-none no-print">
        <div className="max-w-[1400px] mx-auto flex justify-end gap-3">
          {!isEditMode ? (
            <>
              <button 
                onClick={() => setIsUpdateModalOpen(true)} 
                className="pointer-events-auto bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <MousePointer2 size={16} />
                One-click update
              </button>
              <button 
                onClick={handleEdit} 
                className="pointer-events-auto bg-white text-slate-900 border border-slate-200 px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-slate-100"
              >
                Edit profile
              </button>
            </>
          ) : (
            <button 
              onClick={handleSave} 
              className="pointer-events-auto bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Save
            </button>
          )}
        </div>
      </div>

      <main className="py-6 pb-24">
        <div className="max-w-[1280px] mx-auto px-8 space-y-12">
          
          {/* Brand Header Card */}
          <div className={`bg-white rounded-3xl p-10 border border-slate-200 shadow-sm animate-fadeIn relative transition-all ${isEditMode ? 'ring-2 ring-amber-500/10' : ''}`}>
            <div className="flex flex-col lg:flex-row gap-10 items-start mb-8 pb-8 border-b border-slate-100">
              
              {/* Logo Section */}
              <div className="shrink-0 space-y-4 w-32">
                <div className="relative group/main">
                  <div className="w-32 h-32 bg-white border border-slate-100 rounded-[24px] flex items-center justify-center text-5xl shadow-xl relative transition-all hover:scale-[1.02] ring-2 ring-indigo-500/10">
                    {profile.logos?.[selectedLogoIndex] || profile.logos?.[0] || '🚀'}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/5 rounded-[24px] opacity-0 group-hover/main:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Upload size={20} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5 px-0.5">
                  {profile.logos?.map((logo, i) => (
                    <div 
                      key={i} 
                      className={`relative group/sub w-9 h-9 bg-white border rounded-lg flex items-center justify-center text-base shadow-sm cursor-pointer transition-all ${i === selectedLogoIndex ? 'border-indigo-500 ring-2 ring-indigo-500/10 scale-105' : 'border-slate-100 hover:border-indigo-200'}`}
                      onClick={() => setSelectedLogoIndex(i)}
                    >
                      {logo}
                      {isEditMode && (
                        <button 
                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const newLogos = profile.logos.filter((_, idx) => idx !== i);
                            setProfile({...profile, logos: newLogos});
                            if (selectedLogoIndex >= newLogos.length) setSelectedLogoIndex(Math.max(0, newLogos.length - 1));
                          }}
                        >
                          <X size={8} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (profile.logos?.length || 0) < 5 && (
                    <div className="w-9 h-9 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                      <Plus size={14} />
                    </div>
                  )}
                </div>
              </div>

              {/* Core Info Section */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  {isEditMode ? (
                    <input 
                      type="text" 
                      value={profile.brand_name} 
                      onChange={(e) => setProfile({...profile, brand_name: e.target.value})}
                      placeholder="Enter brand name..."
                      className="text-4xl font-black text-slate-900 w-full border-b-2 border-slate-200 focus:border-amber-500 outline-none pb-2 bg-slate-50 px-4 py-2 rounded-xl"
                    />
                  ) : (
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.brand_name || 'Default Brand'}</h1>
                  )}
                  
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      {isEditMode ? (
                        <input 
                          type="text"
                          value={profile.domain}
                          disabled={!!domainAtEditStart}
                          onChange={e => {
                            setProfile({
                              ...profile, 
                              domain: e.target.value
                            });
                          }}
                          placeholder="Brand Domain"
                          className={`text-sm font-bold bg-slate-50 border-b border-slate-200 outline-none rounded px-2 py-0.5 transition-all w-64 ${
                            !!domainAtEditStart ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 focus:bg-white focus:border-amber-500'
                          }`}
                        />
                      ) : (
                        <a href={`https://${profile.domain}`} target="_blank" rel="noreferrer" className="group/link hover:opacity-80 transition-opacity">
                          <span className="text-base font-bold text-slate-400 group-hover/link:text-indigo-500 transition-colors border-b border-transparent group-hover/link:border-indigo-200">
                            {profile.domain || 'Brand URL required'}
                          </span>
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      {isEditMode ? (
                        <select 
                          value={profile.businessType} 
                          onChange={e => setProfile({...profile, businessType: e.target.value})}
                          className="text-sm font-bold text-slate-400 bg-slate-50 border-b border-slate-200 outline-none rounded px-2 py-0.5 transition-all focus:bg-white focus:border-amber-500"
                        >
                          <option value="">请选择行业</option>
                          {industryOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">{profile.businessType}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`bg-slate-50 p-6 rounded-2xl transition-all ${isEditMode ? 'ring-2 ring-amber-500/5 bg-white border border-amber-100 shadow-inner' : ''}`}>
                  {isEditMode ? (
                    <textarea 
                      value={profile.product_description}
                      onChange={(e) => setProfile({...profile, product_description: e.target.value})}
                      className="w-full min-h-[100px] bg-transparent text-slate-700 text-base leading-relaxed outline-none resize-none"
                      placeholder="Enter product description..."
                    />
                  ) : (
                    <p className="text-slate-700 text-base leading-relaxed font-medium">{profile.product_description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { label: 'Lifecycle', key: 'product_lifecycle' },
                { label: 'Scale', key: 'company_scale' },
                { label: 'Target region', key: 'target_region' },
                { label: 'Business model', key: 'business_model' },
                { label: 'Company location', key: 'company_location' }
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest opacity-50">{field.label}</span>
                  {isEditMode ? (
                    <input 
                      value={profile[field.key]} 
                      onChange={e => setProfile({...profile, [field.key]: e.target.value})} 
                      className="font-bold text-slate-800 bg-slate-50 border-b border-slate-200 outline-none w-full px-2 py-1 rounded transition-all focus:bg-white focus:border-amber-500" 
                    />
                  ) : (
                    <p className="font-bold text-slate-800">{profile[field.key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Tags area */}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-slate-50/50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-sm">
                  <Layers size={14} className="text-slate-400" />
                  Ai广告自动化Saas (跨渠道投放与优化: Meta/Google, 主打Smb快速上手与低成本替代代理)
                </span>
                <span className="px-5 py-2 bg-slate-50/50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-sm">
                  <CreditCard size={14} className="text-slate-400" />
                  {profile.business_model}
                </span>
                <span className="px-5 py-2 bg-slate-50/50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-sm">
                  <TrendingUp size={14} className="text-slate-400" />
                  {profile.product_lifecycle}
                </span>
                <span className="px-5 py-2 bg-slate-50/50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-sm">
                  <TagIcon size={14} className="text-slate-400" />
                  {profile.pricing_model}
                </span>
                <span className="px-5 py-2 bg-slate-50/50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2.5 transition-all hover:bg-white hover:shadow-sm">
                  <Target size={14} className="text-slate-400" />
                  {profile.marketing_goal}
                </span>
              </div>

              <div className="flex flex-wrap gap-8 pl-2">
                {profile.audience_tags?.map((tag, idx) => (
                  <span key={tag} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-8 h-full">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                  <Fingerprint size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Brand DNA</h2>
              </div>
              
              {/* Brand Colors Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 tracking-widest opacity-50">Brand Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {profile.colors?.map((color) => (
                    <div key={color.id} className="group relative flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-md">
                      <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-xl shadow-inner border border-black/5">
                        <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                        {isEditMode && (
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Edit3 size={14} className="text-white drop-shadow-sm" />
                            <input 
                              type="color" 
                              value={color.hex} 
                              onChange={(e) => handleColorChange(color.id, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold text-slate-400 truncate">{color.label}</div>
                        <div className="text-xs font-mono font-bold text-slate-700 select-none lowercase">
                          {color.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 tracking-widest opacity-50">Brand Tone</h3>
                {isEditMode ? (
                  <input 
                    value={profile.brand_tone?.join(', ')} 
                    onChange={e => setProfile({...profile, brand_tone: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-slate-50 border-b border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:bg-white focus:border-amber-500 transition-all"
                    placeholder="Tone (comma separated)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.brand_tone?.map((tone, idx) => (
                      <span key={tone} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-100 shadow-sm">
                        {tone}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 tracking-widest opacity-50">Market Keywords</h3>
                {isEditMode ? (
                  <input 
                    value={profile.market_keywords?.join(', ')} 
                    onChange={e => setProfile({...profile, market_keywords: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-slate-50 border-b border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:bg-white focus:border-amber-500 transition-all"
                    placeholder="Keywords (comma separated)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-4 items-baseline justify-center py-4">
                    {profile.market_keywords?.map((kw, idx) => (
                      <span key={kw} className="font-bold transition-all hover:scale-110" style={{ fontSize: `${14 + (idx % 3) * 6}px`, color: ['#0f172a', '#334155', '#475569', '#64748b'][idx % 4] }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-8 h-full">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <Sparkle size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Core Advantages</h2>
              </div>

              <div className={`bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500 transition-all ${isEditMode ? 'bg-white shadow-inner ring-2 ring-amber-500/5 border-amber-100' : ''}`}>
                <p className="text-sm font-bold text-slate-500 tracking-widest opacity-50 mb-2">Value Proposition</p>
                {isEditMode ? (
                  <textarea 
                    value={profile.unique_value_proposition} 
                    onChange={e => setProfile({...profile, unique_value_proposition: e.target.value})}
                    className="text-lg font-bold text-slate-800 leading-snug w-full bg-transparent outline-none resize-none min-h-[100px]"
                  />
                ) : (
                  <p className="text-lg font-bold text-slate-800 leading-snug">{profile.unique_value_proposition}</p>
                )}
              </div>

              <div className="space-y-3">
                {profile.dimensions?.differentiation_type?.map((type, idx) => (
                  <div key={type} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">{idx + 1}</div>
                    {isEditMode ? (
                      <input 
                        value={type} 
                        onChange={e => {
                          const newTypes = [...profile.dimensions.differentiation_type];
                          newTypes[idx] = e.target.value;
                          setProfile({...profile, dimensions: {...profile.dimensions, differentiation_type: newTypes}});
                        }}
                        className="text-sm font-bold text-slate-700 bg-transparent outline-none w-full"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-700">{type}</p>
                    )}
                  </div>
                )) || []}
              </div>
            </div>
          </div>

          {/* Product Features Section */}
          <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-sm border border-pink-100 shadow-pink-500/5">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Brand Feature</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-auto-flow-dense">
              {profile.product_features?.map((feature, idx) => {
                const parts = feature.text?.split(/[：:]/) || ['', ''];
                const title = parts[0];
                const desc = parts[1];
                
                let sizeClass = "";
                if (!isEditMode) {
                  if (idx === 0) sizeClass = "md:col-span-1 lg:col-span-1 md:row-span-2";
                  else if (idx === 3 || idx === 4) sizeClass = "lg:col-span-1";
                }

                const isDark = idx === 0 && !isEditMode;

                return (
                  <div 
                    key={idx} 
                    className={`${sizeClass} rounded-3xl p-8 border relative overflow-hidden group transition-all duration-500 ${
                      isDark 
                        ? 'bg-[#2D3748] text-white border-transparent shadow-xl' 
                        : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:translate-y-[-4px] hover:shadow-xl'
                    } ${isEditMode ? 'ring-2 ring-amber-500/5 border-amber-100 shadow-lg' : ''}`}
                  >
                    {!isDark && <SvgGraphic type={idx % 2 === 0 ? 'wave' : 'chart'} color={idx % 3 === 0 ? '#F59E0B' : '#3B82F6'} />}
                    
                    {isEditMode && (
                      <button onClick={() => {
                        const newFeatures = [...profile.product_features];
                        newFeatures.splice(idx, 1);
                        setProfile({...profile, product_features: newFeatures});
                      }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 z-20"><Trash2 size={14} /></button>
                    )}

                    <div className="relative z-10 space-y-6 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                        isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-pink-500 group-hover:text-white'
                      }`}>
                        {getFeatureIcon(idx)}
                      </div>

                      {isEditMode ? (
                        <div className="space-y-4 flex-1">
                          <input value={title} onChange={e => {
                            const newFeatures = [...profile.product_features];
                            newFeatures[idx].text = `${e.target.value}：${desc}`;
                            setProfile({...profile, product_features: newFeatures});
                          }} className="w-full font-black bg-transparent border-b border-slate-200 outline-none focus:border-amber-500 transition-all text-xl" />
                          <textarea value={desc} onChange={e => {
                            const newFeatures = [...profile.product_features];
                            newFeatures[idx].text = `${title}：${e.target.value}`;
                            setProfile({...profile, product_features: newFeatures});
                          }} className="w-full text-sm leading-relaxed font-medium bg-transparent outline-none min-h-[100px] resize-none" />
                        </div>
                      ) : (
                        <div className="space-y-4 flex-1">
                          <h3 className={`font-black leading-tight ${isDark ? 'text-3xl' : 'text-xl'}`}>{title}</h3>
                          <p className={`leading-relaxed font-medium ${isDark ? 'text-slate-300 text-base' : 'text-slate-500 text-sm'}`}>{desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isEditMode && (
                <button onClick={() => setProfile({...profile, product_features: [...profile.product_features, { text: '新特性：描述内容', keywords: [] }]})} className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:border-amber-500 hover:text-amber-500 transition-all flex flex-col items-center justify-center gap-4 min-h-[300px] shadow-sm"><Plus size={48} /> Add feature</button>
              )}
            </div>
          </div>

          <div className={`relative rounded-[40px] overflow-hidden min-h-[600px] flex border border-slate-200 shadow-xl no-print transition-all ${isEditMode ? 'bg-white p-10 flex-col space-y-8' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 items-center'}`}>
             <div className={`${isEditMode ? 'relative mb-4' : 'absolute top-10 left-10 z-20'} flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-emerald-500 border border-slate-100 shadow-emerald-500/10"><Users size={24} /></div>
                <h2 className="text-2xl font-black text-slate-900">Target audience</h2>
             </div>

             {isEditMode ? (
               <div className="space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar pr-4 w-full">
                 {profile.customer_segments?.map((segment, idx) => (
                   <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                     <button onClick={() => {
                       const newSegments = [...profile.customer_segments];
                       newSegments.splice(idx, 1);
                       setProfile({...profile, customer_segments: newSegments});
                     }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 tracking-widest opacity-50">Name</label>
                         <input value={segment.name} onChange={e => {
                           const newSegments = [...profile.customer_segments];
                           newSegments[idx].name = e.target.value;
                           setProfile({...profile, customer_segments: newSegments});
                         }} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 font-bold outline-none focus:border-amber-500 transition-all shadow-sm" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 tracking-widest opacity-50">Keywords</label>
                         <input value={segment.keywords?.join(', ') || ''} onChange={e => {
                           const newSegments = [...profile.customer_segments];
                           newSegments[idx].keywords = e.target.value.split(',').map(s => s.trim());
                           setProfile({...profile, customer_segments: newSegments});
                         }} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 font-bold outline-none focus:border-amber-500 transition-all shadow-sm" />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 tracking-widest opacity-50">Description</label>
                         <textarea value={segment.description} onChange={e => {
                           const newSegments = [...profile.customer_segments];
                           newSegments[idx].description = e.target.value;
                           setProfile({...profile, customer_segments: newSegments});
                         }} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 font-medium outline-none focus:border-amber-500 transition-all shadow-sm min-h-[80px]" />
                       </div>
                     </div>
                   </div>
                 ))}
                 <button onClick={() => setProfile({...profile, customer_segments: [...(profile.customer_segments || []), { name: 'New Segment', description: '', keywords: [] }]})} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2"><Plus size={20} /> Add segment</button>
               </div>
             ) : (
               <>
                 <div className="w-full max-w-[1100px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fadeIn" key={currentAudienceIndex}>
                      <div className="text-sm font-bold text-slate-400 tracking-widest opacity-50">Audience {String(currentAudienceIndex + 1).padStart(2, '0')}</div>
                      <h3 className="text-5xl font-black text-slate-900 leading-tight">{profile.customer_segments?.[currentAudienceIndex]?.name}</h3>
                      <p className="text-xl text-slate-700 leading-relaxed font-medium">{profile.customer_segments?.[currentAudienceIndex]?.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.customer_segments?.[currentAudienceIndex]?.keywords?.map((kw, i) => (
                          <span key={kw} className="px-4 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700 shadow-sm">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[360px] h-[360px] rounded-full overflow-hidden shadow-2xl border-4 border-white transition-transform duration-700 hover:scale-105">
                        <img src={`https://picsum.photos/seed/audience${currentAudienceIndex}/800/800`} alt="Audience" className="w-full h-full object-cover" />
                      </div>
                    </div>
                 </div>
                 <button onClick={prevAudience} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-slate-900 hover:scale-110 transition-all z-30 shadow-slate-900/5"><ChevronLeft size={28} /></button>
                 <button onClick={nextAudience} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-slate-900 hover:scale-110 transition-all z-30 shadow-slate-900/5"><ChevronRight size={28} /></button>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {profile.customer_segments?.map((_, i) => (
                      <div key={i} onClick={() => setCurrentAudienceIndex(i)} className={`h-2 transition-all duration-300 cursor-pointer rounded-full ${i === currentAudienceIndex ? 'w-10 bg-slate-900' : 'w-2 bg-slate-300'}`} />
                    ))}
                 </div>
               </>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-orange-500/5"><Swords size={24} /></div><h2 className="text-xl font-black text-slate-900">Competitors</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.competitors?.map((comp, idx) => (
                  <div key={comp.name} className={`rounded-2xl p-6 border group transition-all relative ${isEditMode ? 'bg-white border-amber-100 ring-2 ring-amber-500/5 shadow-lg' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-amber-200 shadow-sm'}`}>
                    {isEditMode && <button onClick={() => {
                      const newComps = [...profile.competitors];
                      newComps.splice(idx, 1);
                      setProfile({...profile, competitors: newComps});
                    }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>}
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-black text-lg shadow-sm ${['bg-cyan-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-purple-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500'][idx % 8]}`}>{comp.name?.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        {isEditMode ? (
                          <div className="space-y-2">
                            <input value={comp.name} onChange={e => {
                              const newComps = [...profile.competitors];
                              newComps[idx].name = e.target.value;
                              setProfile({...profile, competitors: newComps});
                            }} className="w-full font-bold text-slate-900 bg-transparent border-b border-slate-200 outline-none focus:border-amber-500 transition-all text-sm" />
                            <input value={comp.url} onChange={e => {
                              const newComps = [...profile.competitors];
                              newComps[idx].url = e.target.value;
                              setProfile({...profile, competitors: newComps});
                            }} className="w-full text-[10px] text-slate-400 bg-transparent outline-none focus:text-amber-500 transition-all" />
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base truncate">{comp.name}</h4>
                            <a href={comp.url} target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 font-bold flex items-center gap-1 hover:text-amber-500 transition-colors">
                              <ExternalLink size={10} /> 
                              <span className="truncate">{comp.url ? new URL(comp.url).hostname : ''}</span>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditMode ? (
                      <textarea value={comp.description} onChange={e => {
                        const newComps = [...profile.competitors];
                        newComps[idx].description = e.target.value;
                        setProfile({...profile, competitors: newComps});
                      }} className="w-full text-xs text-slate-500 bg-transparent outline-none resize-none min-h-[60px] focus:bg-slate-50/50 rounded transition-all" />
                    ) : (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 h-[4.5em] overflow-hidden">{highlightText(comp.description)}</p>
                    )}
                  </div>
                ))}
                {isEditMode && <button onClick={() => setProfile({...profile, competitors: [...(profile.competitors || []), { name: 'New Competitor', url: 'https://example.com', description: '' }]})} className="py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2 shadow-sm"><Plus size={20} /> Add competitor</button>}
              </div>
            </div>

            {/* Reach & Ecosystem Card - Matched to Image */}
            <div className="lg:col-span-1 bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-10 relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-indigo-500/5">
                  <RadioTower size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Reach & Ecosystem</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Megaphone size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-400 tracking-wider">营销渠道</h3>
                </div>
                
                {isEditMode ? (
                  <textarea 
                    value={profile.marketing_channels?.join(', ') || ''} 
                    onChange={e => setProfile({...profile, marketing_channels: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-600 outline-none focus:bg-white focus:border-amber-500 transition-all min-h-[150px]"
                    placeholder="Enter channels (comma separated, e.g. Name (Description), ...)"
                  />
                ) : (
                <div className="space-y-2">
                  {profile.marketing_channels?.map((chanStr, idx) => {
                    const { title, desc } = parseItem(chanStr);
                    return (
                      <div key={idx} className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          {idx % 3 === 0 ? <Search size={14} /> : idx % 3 === 1 ? <Radio size={14} /> : <ImageIcon size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 font-bold leading-normal text-xs break-words">
                            {title} <span className="text-slate-400 font-medium ml-0.5">({desc})</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Users size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-400 tracking-wider">客户聚集地</h3>
                </div>

                {isEditMode ? (
                  <textarea 
                    value={profile.customer_hangouts?.join(', ') || ''} 
                    onChange={e => setProfile({...profile, customer_hangouts: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-600 outline-none focus:bg-white focus:border-amber-500 transition-all min-h-[150px]"
                    placeholder="Enter hangouts (comma separated, e.g. Name (Description), ...)"
                  />
                ) : (
                  <div className="space-y-6 pl-2">
                    {profile.customer_hangouts?.map((placeStr, idx) => {
                      const { title, desc } = parseItem(placeStr);
                      return (
                        <div key={idx} className="flex items-start gap-4 group">
                          <div className="mt-1 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors">
                            <MapPin size={16} />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">
                              {title} {desc && <span className="text-slate-400 font-medium ml-1 text-xs">({desc})</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-10 pb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-emerald-500/5">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Impact Analysis</h2>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isEditMode ? 'bg-transparent' : ''}`}>
              {['收入端', '成本端', '政策端', '技术端'].map((cat) => (
                <div key={cat} className={`space-y-4 p-6 rounded-3xl transition-all ${isEditMode ? 'bg-slate-50 border border-slate-100' : 'bg-white'}`}>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                      cat === '收入端' ? 'bg-emerald-500' : 
                      cat === '成本端' ? 'bg-amber-500' : 
                      cat === '政策端' ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }`} />
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">{cat}</h4>
                  </div>

                  {isEditMode ? (
                    <textarea 
                      value={getFactorsText(cat)} 
                      onChange={e => handleFactorsChange(cat, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-600 outline-none focus:border-amber-500 transition-all min-h-[120px] resize-none"
                      placeholder="Factor (高), Factor, ..."
                    />
                  ) : (
                    <div className="space-y-2">
                      {profile.dimensions?.impact_analysis?.impact_factors
                        ?.filter(f => f.category === cat)
                        ?.map((factor, idx) => (
                          <div 
                            key={idx} 
                            className={`text-xs leading-normal px-3 py-2 rounded-lg transition-all ${
                              factor.importance === '高' 
                                ? 'bg-slate-50 text-slate-800 font-bold border border-slate-100/50 shadow-sm' 
                                : 'text-slate-400 font-bold opacity-70'
                            }`}
                          >
                            {factor.factor}
                          </div>
                        )) || []}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <button onClick={scrollToTop} className={`fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-[100] transition-all duration-300 no-print ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} hover:scale-110 active:scale-95`}><ArrowUp size={24} /></button>

      {/* One-click Update Modal */}
      <BaseModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[500px] flex flex-col animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">One-click update</h4>
            </div>
            <button 
              onClick={() => setIsUpdateModalOpen(false)} 
              className="p-2 hover:bg-slate-200 rounded-full transition-colors group"
            >
              <X size={20} className="text-slate-400 group-hover:text-slate-600" />
            </button>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <Info size={18} className="text-indigo-600" />
              </div>
              <p className="text-sm font-bold text-indigo-900 leading-relaxed">
                AI将在后台预计花费2-3分钟完成品牌画像的更新
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 tracking-widest flex items-center gap-2">
                <Globe size={12} />
                Brand Domain
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={updateDomain}
                  onChange={(e) => setUpdateDomain(e.target.value)}
                  disabled={!!profile.domain}
                  placeholder="e.g. https://www.adsgo.ai"
                  className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold transition-all ${
                    !!profile.domain 
                      ? 'text-slate-400 cursor-not-allowed bg-slate-100' 
                      : 'text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 focus:bg-white'
                  }`}
                />
                {!!profile.domain && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 bg-white/50 px-2 py-1 rounded text-[10px] font-bold border border-slate-100">
                    Read Only
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  handleEdit();
                  setIsUpdateModalOpen(false);
                }}
                className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                Manual Edit
              </button>
              <button 
                onClick={handleStartUpdate}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0"
              >
                <Check size={18} strokeWidth={3} />
                Start update
              </button>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Updating Floating Status */}
      {isUpdating && (
        <div className="fixed bottom-8 right-8 z-[110] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl flex items-center gap-5 min-w-[320px] ring-4 ring-indigo-500/10">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#F1F5F9" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#4F46E5" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  style={{ 
                    strokeDasharray: '283',
                    strokeDashoffset: 283 - (283 * elapsedTime) / 10,
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
              <Loader2 className="animate-spin text-indigo-600" size={24} />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 tracking-tight">AI Analyzing...</h4>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {elapsedTime}s
                </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000 linear"
                  style={{ width: `${(elapsedTime) * 10}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={() => setIsUpdating(false)} 
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-500 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandProfile;
