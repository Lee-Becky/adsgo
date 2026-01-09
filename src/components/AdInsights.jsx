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

const RecommendationCard = ({ card, isExpanded, onToggle, onEdit, onPublish, status }) => {
  const isLookalike = card.audience === 'Lookalike Audience';
  const tagsArr = card.interests.split(',');
  const showExpandArrow = !isLookalike && tagsArr.length > 4;

  return (
    <div className="campaign-wrapper">
      <div className="ad-card">
        {/* Audience Info */}
        <div className="ad-audience-top">
          {isLookalike ? (
            <>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="aud-name">{card.audience}</span>
                <div className="aud-group aud-group-hover" title="类似受众 (US, 3% to 5%) - AdsGo已付费客户1222">
                  <span className="aud-content-tag aud-content-tag-long">类似受众 (US, 3% to 5%) - AdsGo已付费客户1222</span>
                </div>
              </div>
              <div className="aud-row-2">
                <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <div className="aud-tags-container">
                    <span className="aud-pill-text">Scaling up by using the highest potential lookalike audience</span>
                  </div>
                </div>
                <div onClick={() => onToggle(card.id)} className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="aud-name">{card.audience}</span>
                <div className="aud-group">
                  <i className="fas fa-birthday-cake aud-icon-standalone"></i>
                  <span className="aud-content-tag">{card.age}</span>
                </div>
                <div className="aud-group">
                  <i className={`fas fa-${card.gender === 'Male' ? 'mars' : card.gender === 'Female' ? 'venus' : 'venus-mars'} aud-icon-standalone`}></i>
                  <span className="aud-content-tag">{card.gender}</span>
                </div>
              </div>
              <div className="aud-row-2">
                <i className="fas fa-bullseye aud-icon-interest"></i>
                <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <div className="aud-tags-container">
                    {tagsArr.map((tag, idx) => (
                      <span key={idx} className="aud-pill-tag">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
                {showExpandArrow && (
                  <div onClick={() => onToggle(card.id)} className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Header */}
        <div className="ad-header">
          <div className="ad-user-info">
            <div className="ad-avatar"><i className="fas fa-asterisk"></i></div>
            <div className="ad-text-box">
              <h4>AdsGo.ai</h4>
              <p>Sponsored · <i className="fas fa-globe-americas"></i></p>
            </div>
          </div>
          {status ? (
            <div className="published-status">
              <span className={`status-badge ${status === 'manual' ? 'status-manual' : 'status-auto'}`}>
                Published({status === 'manual' ? 'Manual' : 'Auto'})
              </span>
            </div>
          ) : (
            <div className="ad-header-buttons">
              <button className="btn-edit" onClick={() => onEdit(card.id)}>
                <i className="fas fa-pen"></i> Edit
              </button>
              <button className="btn-publish-card" onClick={() => onPublish(card.id)}>
                Publish
              </button>
            </div>
          )}
        </div>

        {/* Body - 2 lines only */}
        <div className="ad-body-text">
          <span className="ad-line">{card.headline}</span>
          <span className="ad-line">{card.text}</span>
        </div>

        {/* Media */}
        {card.hasImage ? (
          <div className="ad-media-area media-filled">
            <img src={IMAGE_POOL[card.currentImgIndex % IMAGE_POOL.length]} alt="Ad visual" />
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

  const handlePublish = (cardId) => {
    if (!campaignStatus[cardId]) {
      setCampaignStatus(prev => ({ ...prev, [cardId]: 'manual' }));
    }
  };

  const displayedCards = CAMPAIGN_CARDS.filter(card => ['01', '03', '05'].includes(card.id));

  return (
    <div className="min-h-screen bg-background p-6 font-sans">
      <SvgIcons />
      
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          
          {/* Platform Selector */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 flex justify-start">
              <div className="bg-gray-100 p-0.5 rounded-full flex gap-1">
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
          <div className="py-6 px-2">
            <div className="flex items-center gap-2.5 mb-4 px-2">
              <div className="w-1 h-[18px] rounded" style={{ background: 'linear-gradient(180deg, #8B5CF6, #4F46E5)' }}></div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Launch Recommendation</h2>
              <div className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50">
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
                  {autoRegen ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCards.map((card) => (
                <RecommendationCard
                  key={card.id}
                  card={card}
                  isExpanded={expandedTags[card.id]}
                  onToggle={toggleTags}
                  onEdit={setSelectedCardId}
                  onPublish={handlePublish}
                  status={campaignStatus[card.id]}
                />
              ))}

              {/* More Recommendations Card - same height as other cards */}
              <div className="campaign-wrapper">
                <div 
                  onClick={() => onPageChange('drafts')}
                  className="ad-card more-recommendations-card cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[550px] p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7033f5] flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 whitespace-nowrap">View More AI-auto campaigns</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                    More AI regeneration campaigns in drafts
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#7033f5]">
                      Go to Drafts
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audience & Page Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 px-2">
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
          <div className="py-6 px-2">
            <SectionTitle>Creative Insight</SectionTitle>
            <div className="flex flex-col p-2 gap-2 bg-gray-50 border border-border rounded-2xl">
              <div className="w-full bg-white p-4 rounded-xl">
                <div className="text-gray-900 text-base font-bold mb-3">Creative Performance</div>
                <div className="w-full h-[320px]">
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

              <div className="flex flex-col w-full p-4 gap-4 bg-white rounded-xl">
                <div className="text-gray-900 text-base font-bold">Top Ads</div>
                <div className="flex gap-12 overflow-x-auto pb-4 no-scrollbar">
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
              <h3 className="text-lg font-bold">Edit Campaign {selectedCardId}</h3>
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
          gap: 8px;
          transition: all 0.3s;
        }

        .ad-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: visible;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          font-size: 12px;
          position: relative;
          min-height: 550px;
        }

        .ad-audience-top {
          background: #F8F9FF;
          padding: 12px 14px;
          border-bottom: 1px solid #E0E7FF;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
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
          color: #7033f5;
          font-size: 14px;
        }

        .aud-content-tag {
          background: #F5F1FF;
          border: 1px solid #E0E7FF;
          color: #7033f5;
          font-weight: 700;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .aud-content-tag-long {
          background: #F5F1FF;
          border: 1px solid #E0E7FF;
          color: #7033f5;
          font-weight: 700;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 6px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
          position: relative;
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
          transition: opacity 0.2s, visibility 0.2s;
          pointer-events: none;
        }

        .aud-content-tag-long:hover::after {
          opacity: 1;
          visibility: visible;
        }

        .aud-pill-text {
          color: #7033f5;
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
          background: #F5F1FF;
          border: 1px solid #E0E7FF;
          color: #7033f5;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
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
          color: #7033f5;
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
          background: #E0E7FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7033f5;
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
          cursor: default;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-publish-card {
          background: linear-gradient(90deg, #8B5CF6, #7033f5);
          border: none;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
          transition: all 0.2s;
        }

        .btn-publish-card:hover {
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
          transform: translateY(-1px);
        }

        .published-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.status-manual {
          background: #F5F1FF;
          border: 1px solid #E0E7FF;
          color: #7033f5;
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
        }

        .cta-left h5 {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        .cta-left p {
          font-size: 11px;
          color: #6B7280;
          min-height: 14px;
          margin-top: 2px;
        }

        .cta-wrapper {
          position: relative;
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
        }

        .ad-social {
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #F3F4F6;
          color: #6B7280;
        }

        .social-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AdInsights;
