import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  CAMPAIGN_CARDS,
  IMAGE_POOL,
  AUDIENCE_INSIGHTS,
  PAGE_INSIGHTS,
  TOP_ADS,
  SCATTER_DATA,
  PLATFORM_LOGOS
} from '../constants/adInsightsData';
import { Icon, SvgIcons } from './AdInsightsIcons';
import BrandDataOverlay from './BrandDataOverlay';

// --- Sub Components ---

const SectionTitle = ({ children }) => (
  <div className="text-gray-900 text-xl font-bold mb-4 pl-4 relative before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full before:bg-gradient-to-b before:from-[#c3a2fe] before:via-[#7135f4] before:to-[#0d031f] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2">
    {children}
  </div>
);

const InsightBlock = ({ title, data, renderListItem, chartColors }) => (
  <div className="min-w-0">
    <SectionTitle>{title}</SectionTitle>
    <div className="flex flex-col p-2 gap-2 bg-[#fafafa] border border-[#f5f5f5] rounded-2xl">
      <div className="flex flex-col p-3 px-4 gap-3 bg-white rounded-xl">
        <div className="text-[#141414] text-base font-semibold">Spend Distribution</div>
        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col p-3 px-4 gap-4 bg-white rounded-xl">
        <div className="text-[#141414] text-base font-semibold">
          {title.includes('Audience') ? 'Top Audiences' : 'Top Pages'}
        </div>
        <div className="flex flex-col gap-5">
          {data.map((item, i) => renderListItem(item, i))}
        </div>
      </div>
    </div>
  </div>
);

const AudienceListItem = ({ item, i }) => (
  <div key={i} className="flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0">
    <div className="text-[#141414] text-sm font-medium">{item.name}</div>
    <div className="flex gap-1 overflow-hidden">
      {item.tags.map((t, j) => (
        <span key={j} className="px-3 py-1 bg-[#f5f5f5] text-[#666] rounded-full text-sm whitespace-nowrap">{t}</span>
      ))}
    </div>
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-[#7033f5] font-medium">{item.cpa} CPA</span>
      <span className="text-[#8c8c8c]">${item.spend} spend · {item.campaigns} campaigns</span>
    </div>
  </div>
);

const PageListItem = ({ item, i }) => (
  <div key={i} className="flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0">
    <div className="text-[#141414] text-sm font-medium truncate">{item.url}</div>
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-[#5969f7] font-medium">{item.cvr} CVR</span>
      <span className="text-[#8c8c8c]">${item.spend} spend · {item.campaigns} campaigns</span>
    </div>
  </div>
);

const RecommendationCard = ({ card, isExpanded, onToggle, onEdit, onPublish, status, cardIndex }) => {
  const isLookalike = card.audience === 'Lookalike Audience';
  const tagsArr = card.interests.split(',');
  const showExpandArrow = !isLookalike && tagsArr.length > 4;
  const isPublished = !!status;

  // 统一使用蓝色系
  const colors = {
    primary: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    lightBg: '#EFF6FF',
    lightBorder: '#DBEAFE',
    icon: '#3B82F6',
    shadow: 'rgba(59, 130, 246, 0.2)',
    shadowHover: 'rgba(59, 130, 246, 0.35)',
    shadowGlow: 'rgba(59, 130, 246, 0.15)'
  };

  return (
    <div className="campaign-wrapper">
      {/* External Header with Index Badge and Actions */}
      <div className="campaign-external-header">
        <div className="campaign-index-group">
          <div 
            className={`campaign-index-badge ${isPublished ? 'is-published' : ''}`}
            style={{
              background: isPublished ? '' : `linear-gradient(135deg, ${colors.lightBg} 0%, ${colors.lightBorder} 100%)`,
              borderColor: isPublished ? '' : colors.lightBorder,
              color: isPublished ? '' : colors.primary
            }}
          >
            {String(cardIndex + 1).padStart(2, '0')}
          </div>
          <span className="campaign-subtitle">CAMPAIGN</span>
        </div>
        {isPublished ? (
          <div className={`status-badge-tag ${status === 'manual' ? 'status-manual' : 'status-auto'}`}>
            {status === 'manual' ? 'Published (Manual)' : 'Published (Auto)'}
          </div>
        ) : (
          <div className="external-actions">
            <button className="btn-edit-ghost" onClick={() => onEdit(card.id)}>
              <i className="fas fa-pen"></i>
            </button>
            <button 
              className="btn-publish-external"
              style={{
                background: colors.gradient,
                boxShadow: `0 2px 12px ${colors.shadow}, 0 0 0 0 ${colors.primary}66`
              }}
              onClick={() => onPublish(card.id)}
            >
              Publish
            </button>
          </div>
        )}
      </div>

      <div 
        className={`ad-card ${isPublished ? 'is-published' : ''}`}
        style={isPublished ? {
          '--card-gradient': colors.gradient
        } : {}}
      >
        {/* Audience Info */}
        <div className="ad-audience-top">
          {isLookalike ? (
            <>
              <div className="flex items-center gap-2 mb-2 min-w-0">
                <span className="aud-name flex-shrink-0">{card.audience}</span>
                <div className="aud-group aud-group-hover min-w-0 overflow-hidden" title="类似受众 (US, 3% to 5%) - AdsGo已付费客户1222">
                  <span 
                    className="aud-content-tag aud-content-tag-long"
                    style={{
                      background: colors.lightBg,
                      borderColor: colors.lightBorder,
                      color: colors.primary
                    }}
                  >
                    类似受众 (US, 3% to 5%) - AdsGo已付费客户1222
                  </span>
                </div>
              </div>
              <div className="aud-row-2">
                <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <div className="aud-tags-container">
                    <span className="aud-pill-text" style={{ color: colors.primary }}>
                      Scaling up by using the highest potential lookalike audience
                    </span>
                  </div>
                </div>
                <div 
                  onClick={() => onToggle(card.id)} 
                  className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}
                  style={{ '--hover-color': colors.primary }}
                >
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="aud-name">{card.audience}</span>
                <div className="aud-group">
                  <i className="fas fa-birthday-cake aud-icon-standalone" style={{ color: colors.icon }}></i>
                  <span 
                    className="aud-content-tag"
                    style={{
                      background: colors.lightBg,
                      borderColor: colors.lightBorder,
                      color: colors.primary
                    }}
                  >
                    {card.age}
                  </span>
                </div>
                <div className="aud-group">
                  <i 
                    className={`fas fa-${card.gender === 'Male' ? 'mars' : card.gender === 'Female' ? 'venus' : 'venus-mars'} aud-icon-standalone`}
                    style={{ color: colors.icon }}
                  ></i>
                  <span 
                    className="aud-content-tag"
                    style={{
                      background: colors.lightBg,
                      borderColor: colors.lightBorder,
                      color: colors.primary
                    }}
                  >
                    {card.gender}
                  </span>
                </div>
              </div>
              <div className="aud-row-2">
                <i className="fas fa-bullseye aud-icon-interest"></i>
                <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <div className="aud-tags-container">
                    {tagsArr.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="aud-pill-tag"
                        style={{
                          background: colors.lightBg,
                          borderColor: colors.lightBorder,
                          color: colors.primary
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                {showExpandArrow && (
                  <div 
                    onClick={() => onToggle(card.id)} 
                    className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}
                    style={{ '--hover-color': colors.primary }}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Header - Simplified */}
        <div className="ad-header">
          <div className="ad-user-info">
            <div 
              className="ad-avatar"
              style={{
                background: colors.lightBg,
                color: colors.primary
              }}
            >
              <i className="fas fa-asterisk"></i>
            </div>
            <div className="ad-text-box">
              <h4>AdsGo.ai</h4>
              <p>Sponsored · <i className="fas fa-globe-americas"></i></p>
            </div>
          </div>
        </div>

        {/* Body - 2 lines only */}
        <div className="ad-body-text">
          <span className="ad-line">{card.headline}</span>
          <span className="ad-line">{card.text}</span>
        </div>

        {/* Media */}
        {card.hasImage ? (
          <div className="ad-media-area media-filled">
            <img src={IMAGE_POOL[card.currentImgIndex % IMAGE_POOL.length]} alt="Ad visual" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          </div>
        ) : (
          <div className="media-empty">
            <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
            <div className="text-[10px]">Click to upload</div>
          </div>
        )}

        {/* CTA */}
        <div className="ad-cta-section">
          <div className="cta-left">
            <h5>AdsGo.ai</h5>
            <p>FREE Shipping</p>
          </div>
          <div className="cta-wrapper">
            <button className="btn-shop-fixed">{card.cta}</button>
          </div>
        </div>

        {/* Social */}
        <div className="ad-social">
          <span className="social-item"><i className="far fa-thumbs-up"></i> Like</span>
          <span className="social-item"><i className="far fa-comment-alt"></i> Comment</span>
          <span className="social-item"><i className="fas fa-share"></i> Share</span>
        </div>
      </div>
    </div>
  );
};

const CreativeAdCard = ({ ad, index }) => (
  <div key={ad.id} className="flex-1 min-w-[320px] max-w-[360px] relative first:before:hidden before:content-[''] before:block before:w-px before:h-[90%] before:border-l before:border-dashed before:border-[#d9d9d9] before:absolute before:top-1/2 before:left-[-24px] before:-translate-y-1/2">
    <div className="flex items-center justify-center gap-2 mb-3 text-gray-500 text-sm">
      <span className="text-[#78a100] font-medium">{ad.ctr} CTR</span>
      <span></span>
      <span>{ad.cpa} CPA</span>
      <span>·</span>
      <span>{ad.campaigns} campaigns</span>
    </div>
    <div className="rounded-2xl border border-primary/30 overflow-hidden bg-white">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-gradient-to-r from-white to-[#f5f1ff] text-gray-900 text-base font-semibold">
        <Icon id="icon-Outlined_Eye" className="text-xl font-medium" />
        <span>Creative</span>
      </div>
      <div className="flex justify-between items-center px-2.5 py-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 p-1.5 flex justify-center items-center rounded-full border border-[#f5f5f5] bg-[#fafafa]">
            <img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256" alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-900 text-sm font-bold truncate max-w-[200px]">Goodkarma</span>
            <span className="text-gray-500 text-xs">Sponsored •</span>
          </div>
        </div>
        <div className="flex gap-2.5 text-xl font-semibold">
          <span>⋯</span>
          <Icon id="icon-Outlined_Close01" />
        </div>
      </div>
      <div className="px-2.5 pb-2 text-gray-900 text-xs font-medium leading-[17px] line-clamp-3">
        {ad.primaryText}
      </div>
      <div className="w-full aspect-square bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${ad.mediaUrl})` }} />
      <div className="p-3 flex justify-between items-center border-t border-border bg-gray-50 gap-3">
        <div className="flex-1 flex flex-col gap-1 text-gray-900 text-sm max-w-[240px]">
          <div className="font-bold truncate">{ad.footerBrand}</div>
          <div className="text-gray-500 text-xs font-medium truncate">{ad.footerDesc}</div>
        </div>
        <div className="h-8 px-1.5 flex justify-center items-center text-gray-900 text-xs font-semibold rounded-md bg-gray-200">
          Shop Now
        </div>
      </div>
      <div className="ad-social">
        <span className="social-item"><i className="far fa-thumbs-up"></i> Like</span>
        <span className="social-item"><i className="far fa-comment-alt"></i> Comment</span>
        <span className="social-item"><i className="fas fa-share"></i> Share</span>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const AdInsights = ({ onPageChange }) => {
  // Brand data status: 'no-accounts' | 'fetching' | 'no-data' | 'success'
  const [brandDataStatus, setBrandDataStatus] = useState('no-accounts');
  const [selectedPlatform, setSelectedPlatform] = useState('Meta');
  const [autoRegen, setAutoRegen] = useState(false);
  const [expandedTags, setExpandedTags] = useState({});
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState({});

  // Handle auto-launch switch
  useEffect(() => {
    if (autoRegen) {
      const autoStatus = {};
      CAMPAIGN_CARDS.filter(card => ['01', '03', '05'].includes(card.id)).forEach(card => {
        if (!campaignStatus[card.id]) {
          autoStatus[card.id] = 'auto';
        }
      });
      if (Object.keys(autoStatus).length > 0) {
        setCampaignStatus(prev => ({ ...prev, ...autoStatus }));
      }
    }
  }, [autoRegen]);

  const toggleTags = (cardId) => {
    setExpandedTags(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleEdit = (cardId) => {
    setSelectedCardId(cardId);
    setEditDrawerOpen(true);
  };

  const handlePublish = (cardId) => {
    if (!campaignStatus[cardId]) {
      setCampaignStatus(prev => ({ ...prev, [cardId]: 'manual' }));
    }
  };

  const displayedCards = CAMPAIGN_CARDS.filter(card => ['01', '03', '05'].includes(card.id));

  // Handle connect account
  const handleConnectAccount = () => {
    // TODO: Implement connect account logic
    console.log('Connect account clicked')
    // For demo, simulate fetching
    setBrandDataStatus('fetching')
  }

  // Handle create campaign
  const handleCreateCampaign = () => {
    // TODO: Implement create campaign logic
    console.log('Create campaign clicked')
    // For demo, simulate fetching
    setBrandDataStatus('fetching')
  }

  // Handle retry data fetch
  const handleRetry = () => {
    console.log('Retry data fetch')
    setBrandDataStatus('fetching')
    // Simulate data fetch
    setTimeout(() => {
      setBrandDataStatus('success')
    }, 2000)
  }

  // Handle view demo (normal state)
  const handleViewDemo = () => {
    console.log('View demo clicked')
    setBrandDataStatus('success')
  }

  // Handle view error
  const handleViewError = () => {
    console.log('View error clicked')
    setBrandDataStatus('no-data')
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 font-sans">
      <SvgIcons />
      
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 md:p-6">
          
          {/* Platform Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1 flex justify-start">
              <div className="bg-gray-100 p-0.5 rounded-full flex gap-1 flex-wrap justify-center sm:justify-start">
                {['Meta', 'Google', 'TikTok', 'Bing'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedPlatform === p 
                        ? 'bg-white shadow-sm text-[#141414]' 
                        : 'text-[#8c8c8c] opacity-40 grayscale pointer-events-none'
                    }`}
                  >
                    <img src={PLATFORM_LOGOS[p]} alt={p} className="w-6 h-6" />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Launch Recommendation */}
          <div className="py-6 md:py-8 px-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 px-2">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-1 h-[18px] rounded" style={{ background: 'linear-gradient(180deg, #8B5CF6, #4F46E5)' }}></div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">Launch Recommendation</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex items-center text-gray-700 text-sm font-semibold">
                    <img src="https://www.adsgo.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frobot-active.7003b4d8.png&w=256&q=75" alt="AI Robot" className="w-5 h-5 mr-1.5" />
                    Auto-launch:
                  </div>
                  <div 
                    className={`w-11 h-[22px] rounded-full p-[2px] cursor-pointer transition-colors ${autoRegen ? 'bg-[#7033f5]' : 'bg-gray-300'}`}
                    onClick={() => setAutoRegen(!autoRegen)}
                  >
                    <div className={`w-[18px] h-[18px] bg-white rounded-full transition-transform ${autoRegen ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-xs font-semibold ${autoRegen ? 'text-green-600' : 'text-gray-500'}`}>
                    {autoRegen 
                      ? 'Enabled - Recommended campaigns will be launched automatically.' 
                      : 'Disabled - Recommended campaigns need to be published manually.'
                    }
                  </span>
                </div>
              </div>

              {/* Campaign Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {displayedCards.map((card, index) => (
                  <RecommendationCard
                    key={card.id}
                    card={card}
                    isExpanded={expandedTags[card.id]}
                    onToggle={toggleTags}
                    onEdit={handleEdit}
                    onPublish={handlePublish}
                    status={campaignStatus[card.id]}
                    cardIndex={index}
                  />
                ))}

                {/* More Recommendations Card - optimized version */}
                <div className="campaign-wrapper">
                  <div 
                    onClick={() => onPageChange('drafts')}
                    className="ad-card more-recommendations-card cursor-pointer hover:shadow-lg transition-all overflow-hidden relative flex flex-col group"
                  >
                    {/* 优雅的渐变背景 */}
                    <div className="absolute inset-[8px] rounded-xl overflow-hidden" style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      zIndex: 0 
                    }}>
                      {/* 柔和的光晕效果 */}
                      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px] animate-float-slow"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-white/15 rounded-full blur-[50px] animate-float-slower"></div>
                      
                      {/* 网格背景 */}
                      <div className="absolute inset-0 opacity-[0.08]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                      }}></div>

                      {/* 中心内容区域 - 螺旋运动系统 */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        {/* 核心 AI Engine - 等比放大并确保文案不换行 */}
                        <div className="relative z-[20] w-28 h-28 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-[24px] flex flex-col items-center justify-center shadow-2xl animate-pulse-slow -translate-y-[60px]">
                          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
                          </svg>
                          <div className="text-[11px] text-white font-black mt-2 whitespace-nowrap px-4 tracking-wider">AI Regeneration</div>
                          {/* 核心发光效果 */}
                          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full -z-10 animate-pulse"></div>
                        </div>

                        {/* 螺旋环绕系统 - 同样向上偏移，保持与核心的相对位置 */}
                        <div className="absolute inset-0 flex items-center justify-center animate-system-rotate-slow -translate-y-[60px]">
                          {/* 1. Audience */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '0s', '--radius': '110px', '--start-scale': '0.4' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Age</div>
                            </div>
                          </div>

                          {/* 2. Creative */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-1s', '--radius': '100px', '--start-scale': '0.5' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Creatives</div>
                            </div>
                          </div>

                          {/* 3. Copy */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-2s', '--radius': '90px', '--start-scale': '0.6' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-green-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Ad Copys</div>
                            </div>
                          </div>

                          {/* 4. Landing */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-3s', '--radius': '105px', '--start-scale': '0.45' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">LandingPages</div>
                            </div>
                          </div>

                          {/* 5. Metrics */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-4s', '--radius': '95px', '--start-scale': '0.55' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Gender</div>
                            </div>
                          </div>

                          {/* 6. Schedule */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-5s', '--radius': '115px', '--start-scale': '0.35' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Interests</div>
                            </div>
                          </div>

                          {/* 7. Location */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-6s', '--radius': '85px', '--start-scale': '0.65' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-teal-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Locations</div>
                            </div>
                          </div>

                          {/* 8. Keyword */}
                          <div className="absolute animate-spiral-card" style={{ animationDelay: '-7s', '--radius': '120px', '--start-scale': '0.3' }}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center">
                              <svg className="w-5 h-5 text-orange-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                              </svg>
                              <div className="text-[10px] text-white/70 mt-1 font-medium">Keywords</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 微妙的粒子效果 */}
                      <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-1" style={{ top: '20%', left: '15%' }}></div>
                      <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-2" style={{ top: '60%', right: '20%' }}></div>
                      <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-3" style={{ bottom: '30%', left: '25%' }}></div>
                    </div>

                    {/* 内容层 - 放在底部，白色背景 */}
                    <div className="absolute bottom-0 left-0 right-0 z-[10] bg-white rounded-b-[16px] p-6 flex flex-col items-center justify-center border-t border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-2 whitespace-nowrap">View More AI-auto campaigns</h3>
                      <p className="text-sm text-gray-600 text-center mb-4">
                        More AI regeneration campaigns in drafts
                      </p>
                      <button className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-2.5 rounded-full hover:shadow-lg transition-all hover:scale-105 group-hover:scale-110">
                        Go to Drafts
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Section Divider - Full-width Bar */}
          <div className="section-divider-fullwidth">
            <div className="divider-bar-content">
              <span className="divider-bar-icon"><i className="fas fa-chart-line"></i></span>
              <span className="divider-bar-text">Last 3 days data analysis & insights</span>
            </div>
          </div>

          {/* Audience & Page Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 py-4 md:py-6 px-2">
            <InsightBlock
              title="Audience Insight"
              data={AUDIENCE_INSIGHTS}
              renderListItem={(item, i) => <AudienceListItem key={i} item={item} i={i} />}
              chartColors={['#7033f5', '#c3a2fe', '#ead9ff']}
            />
            <InsightBlock
              title="Page Insight"
              data={PAGE_INSIGHTS}
              renderListItem={(item, i) => <PageListItem key={i} item={item} i={i} />}
              chartColors={['#7033f5', '#c3a2fe']}
            />
          </div>

          {/* Creative Insight */}
          <div className="py-4 md:py-6 px-2">
            <SectionTitle>Creative Insight</SectionTitle>
            <div className="flex flex-col p-2 gap-2 bg-gray-50 border border-border rounded-2xl">
              <div className="w-full bg-white p-3 md:p-4 rounded-xl">
                <div className="text-gray-900 text-base font-bold mb-3">Creative Performance</div>
                <div className="w-full h-[280px] md:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" dataKey="x" name="CTR" unit="%" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                      <YAxis type="number" dataKey="y" name="CPA" unit="$" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Ads" data={SCATTER_DATA} fill="#7033f5" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col w-full p-3 md:p-4 gap-4 bg-white rounded-xl">
                <div className="text-gray-900 text-base font-bold">Top Ads</div>
                <div className="flex gap-6 md:gap-12 overflow-x-auto pb-4 no-scrollbar">
                  {TOP_ADS.map((ad, index) => (
                    <CreativeAdCard key={ad.id} ad={ad} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer Modal */}
      {editDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end" onClick={() => setEditDrawerOpen(false)}>
          <div className="w-full max-w-full h-[95vh] bg-white rounded-t-2xl shadow-lg flex flex-col overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Campaign</h3>
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                onClick={() => setEditDrawerOpen(false)}
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
              <img 
                src="/ad edit.jpg" 
                alt="Ad Preview" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease;
        }

        /* Ad Card Styles */
        .campaign-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s;
        }

        .campaign-external-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0;
          margin-bottom: 4px;
        }

        .campaign-index-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .campaign-index-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #F5F1FF 0%, #E0E7FF 100%);
          border: 1px solid #D1D5DB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #7033f5;
          letter-spacing: -0.02em;
        }

        .campaign-index-badge.is-published {
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
          border-color: #10B981;
          color: #059669;
        }

        .campaign-subtitle {
          font-size: 11px;
          font-weight: 500;
          color: #9CA3AF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .external-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-edit-ghost {
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          background: transparent;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit-ghost:hover {
          background: #F3F4F6;
          color: #374151;
          border-color: #D1D5DB;
        }

        .btn-publish-external {
          background-size: 200% 200%;
          border: none;
          padding: 7px 18px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: gradient-pulse 3s ease infinite, initial-glow 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .btn-publish-external::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-publish-external:hover::before {
          left: 100%;
        }

        .btn-publish-external:hover {
          transform: translateY(-2px) scale(1.02);
        }

        @keyframes gradient-pulse {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes initial-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(112, 51, 245, 0.7);
            transform: scale(0.95);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(112, 51, 245, 0);
            transform: scale(1);
          }
          100% {
            box-shadow: 0 2px 12px rgba(112, 51, 245, 0.2);
            transform: scale(1);
          }
        }

        .ad-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: visible;
          box-shadow: 0 4px 24px -4px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          font-size: 12px;
          position: relative;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ad-card:hover {
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.1);
        }

        .ad-card.is-published {
          background: white;
          border-color: #E0E7FF;
          opacity: 0.75;
          filter: grayscale(0.15) brightness(0.98);
          pointer-events: none;
        }

        .ad-card.is-published::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--card-gradient, linear-gradient(180deg, #7033f5 0%, #8B5CF6 100%));
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }

        .ad-card.is-published .ad-audience-top {
          background: #FAF9FF;
          border-bottom-color: #E5E7EB;
        }

        .ad-card.is-published .ad-cta-section {
          background: #FAF9FF;
        }

        .status-badge-tag {
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .status-badge-tag.status-auto {
          background: #ECFDF5;
          border: 1px solid #D1FAE5;
          color: #059669;
        }

        /* Section Divider - Full-width Bar */
        .section-divider-fullwidth {
          position: relative;
          margin: 40px -1rem 32px 0;
          padding: 0;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .section-divider-fullwidth {
            margin: 40px -1.5rem 32px 0;
          }
        }

        .section-divider-fullwidth::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(180deg, #F5F1FF 0%, #EDE7FF 100%);
          border-top: 1px solid #E0D5FF;
          border-bottom: 1px solid #E0D5FF;
        }

        .divider-bar-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1;
        }

        .divider-bar-icon {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: linear-gradient(135deg, #F5F1FF 0%, #E0E7FF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7033f5;
          font-size: 10px;
        }

        .divider-bar-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #64748B;
          text-transform: uppercase;
        }

        .more-recommendations-card {
          height: 100%;
        }

        .ad-audience-top {
          background: white;
          padding: 14px 16px;
          border-bottom: 1px solid #F3F4F6;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }

        .ad-audience-top:hover {
          background: #FAFBFC;
        }

        .aud-name {
          font-size: 12px;
          font-weight: 500;
          color: #9CA3AF;
          margin-right: 4px;
        }

        .aud-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .aud-icon-standalone {
          font-size: 14px;
        }

        .aud-content-tag {
          font-weight: 700;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          border-style: solid;
          border-width: 1px;
        }

        .aud-content-tag-long {
          max-width: 100%;
        }

        .aud-content-tag-long::after {
          content: attr(title);
          position: absolute;
          left: 0;
          top: 100%;
          margin-top: 4px;
          background: #1f2937;
          color: white;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility: 0.0s;
          pointer-events: none;
        }

        .aud-content-tag-long:hover::after {
          opacity: 1;
          visibility: visible;
        }

        .aud-pill-text {
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .aud-row-2 {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .aud-tags-wrapper {
          flex: 1;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .aud-tags-wrapper.collapsed {
          max-height: 20px;
        }

        .aud-tags-wrapper.expanded {
          max-height: 500px;
        }

        .aud-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .aud-pill-tag {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          border-style: solid;
          border-width: 1px;
        }

        .aud-expand-btn {
          cursor: pointer;
          color: #9CA3AF;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          transition: transform 0.2s;
          margin-top: 2px;
        }

        .aud-expand-btn:hover {
          background: #F3F4F6;
          color: var(--hover-color, #7033f5);
        }

        .aud-expand-btn.rotated {
          transform: rotate(180deg);
        }

        .ad-header {
          padding: 12px 12px 8px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .ad-user-info {
          display: flex;
          gap: 8px;
        }

        .ad-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ad-text-box h4 {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
        }

        .ad-text-box p {
          font-size: 11px;
          color: #6B7280;
          margin-top: 1px;
        }

        .ad-header-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          background: #F3F4F6;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #111827;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-edit:hover {
          background: #E5E7EB;
        }

        .status-badge {
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }

        .status-badge.status-auto {
          background: #ECFDF5;
          border: 1px solid #D1FAE5;
          color: #059669;
        }

        .ad-body-text {
          padding: 4px 12px 12px;
          cursor: pointer;
          min-height: 60px;
          border: 1px solid transparent;
          border-radius: 8px;
          transition: all 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ad-body-text:hover {
          background: #F9FAFB;
          border-color: #E5E7EB;
        }

        .ad-line {
          font-size: 13px;
          line-height: 1.4;
          color: #111827;
          margin-bottom: 4px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .media-empty {
          margin: 0 12px 12px;
          height: calc(100% - 12px);
          border: 2px dashed #D1D5DB;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          color: #6B7280;
        }

        .ad-cta-section {
          background: #F9FAFB;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          gap: 8px;
        }

        .cta-left {
          flex: 1;
          min-width: 0;
        }

        .cta-left h5 {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cta-left p {
          font-size: 11px;
          color: #6B7280;
          min-height: 14px;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cta-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .btn-shop-fixed {
          background: white;
          border: 1px solid #D1D5DB;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #111827;
          cursor: default;
          white-space: nowrap;
        }

        .ad-social {
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #F3F4F6;
          color: #6B7280;
          overflow: hidden;
        }

        .social-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 优化后的动效关键帧 */
        @keyframes float-slow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(20px, 20px, 0); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-15px, -15px, 0); }
        }
        @keyframes card-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; }
          50% { transform: translate3d(30px, -20px, 0); opacity: 0.6; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; }
          50% { transform: translate3d(-40px, 15px, 0); opacity: 0.6; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; }
          50% { transform: translate3d(20px, 40px, 0); opacity: 0.6; }
        }

        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-card-float { animation: card-float 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 7s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 10s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 9s ease-in-out infinite; }

        @keyframes spiral-move {
          0% {
            transform: rotate(0deg) translateX(var(--radius)) rotate(0deg) scale(var(--start-scale));
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg) scale(1.1);
            opacity: 0;
          }
        }

        .animate-spiral-card {
          animation: spiral-move 12s linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default AdInsights;
