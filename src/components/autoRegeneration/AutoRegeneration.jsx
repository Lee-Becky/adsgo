import React, { useState, useEffect } from 'react';
import {
  CAMPAIGN_CARDS,
  IMAGE_POOL,
  PLATFORM_LOGOS
} from './mockData';
import { Edit, Send, X, Check, Sparkles, Trash2, ChevronDown, Infinity, Clock, RefreshCw, ShieldCheck, GripVertical } from 'lucide-react';

// --- Sub Components ---

const RecommendationCard = ({ card, isExpanded, onToggle, onEdit, onPublish, status, cardIndex, onHide }) => {
  const isLookalike = card.audience === 'Lookalike Audience';
  const tagsArr = card.interests.split(',');
  const showExpandArrow = !isLookalike && tagsArr.length > 4;
  const isPublished = !!status;
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    let timer;
    if (isPublished) {
      if (countdown > 0) {
        timer = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        onHide(card.id);
      }
    }
    return () => clearInterval(timer);
  }, [isPublished, countdown, card.id, onHide]);

  const colors = {
    primary: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    lightBg: '#EFF6FF',
    lightBorder: '#DBEAFE',
    icon: '#3B82F6',
    shadow: 'rgba(59, 130, 246, 0.2)',
  };

  return (
    <div className="campaign-wrapper">
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
          <span className="campaign-subtitle">Campaign</span>
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
              style={{ background: colors.gradient }}
              onClick={() => onPublish(card.id)}
            >
              Publish
            </button>
          </div>
        )}
      </div>

      <div 
        className={`ad-card ${isPublished ? 'is-published' : ''}`}
        style={isPublished ? { '--card-gradient': colors.gradient } : {}}
      >
        {isPublished && (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-sm">
              <Check size={24} strokeWidth={3} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Published Successfully!</h4>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              This campaign has been published.<br />
              It will disappear in <span className="font-bold text-primary">{countdown}s</span>.<br />
              You can view it in the <span className="font-medium text-gray-900">Ad Manager</span> later.
            </p>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="ad-audience-top">
          {isLookalike ? (
            <>
              <div className="flex items-center gap-2 mb-2 min-w-0">
                <span className="aud-name flex-shrink-0">{card.audience}</span>
                <div className="aud-group aud-group-hover min-w-0 overflow-hidden">
                  <span className="aud-content-tag aud-content-tag-long" style={{ background: colors.lightBg, borderColor: colors.lightBorder, color: colors.primary }}>
                    US,3%to5% - AdsGo paid customers 
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
                <div onClick={() => onToggle(card.id)} className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`} style={{ '--hover-color': colors.primary }}>
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
                  <span className="aud-content-tag" style={{ background: colors.lightBg, borderColor: colors.lightBorder, color: colors.primary }}>{card.age}</span>
                </div>
                <div className="aud-group">
                  <i className={`fas fa-${card.gender === 'Male' ? 'mars' : card.gender === 'Female' ? 'venus' : 'venus-mars'} aud-icon-standalone`} style={{ color: colors.icon }}></i>
                  <span className="aud-content-tag" style={{ background: colors.lightBg, borderColor: colors.lightBorder, color: colors.primary }}>{card.gender}</span>
                </div>
              </div>
              <div className="aud-row-2">
                <i className="fas fa-bullseye aud-icon-interest"></i>
                <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <div className="aud-tags-container">
                    {tagsArr.map((tag, idx) => (
                      <span key={idx} className="aud-pill-tag" style={{ background: colors.lightBg, borderColor: colors.lightBorder, color: colors.primary }}>{tag.trim()}</span>
                    ))}
                  </div>
                </div>
                {showExpandArrow && (
                  <div onClick={() => onToggle(card.id)} className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`} style={{ '--hover-color': colors.primary }}>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="ad-header">
          <div className="ad-user-info">
            <div className="ad-avatar" style={{ background: colors.lightBg, color: colors.primary }}>
              <i className="fas fa-asterisk"></i>
            </div>
            <div className="ad-text-box">
              <h4>AdsGo.ai</h4>
              <p>Sponsored · <i className="fas fa-globe-americas"></i></p>
            </div>
          </div>
        </div>

        <div className="ad-body-text">
          <span className="ad-line">{card.headline}</span>
          <span className="ad-line">{card.text}</span>
        </div>

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

        <div className="ad-cta-section">
          <div className="cta-left">
            <h5>AdsGo.ai</h5>
            <p>FREE Shipping</p>
          </div>
          <div className="cta-wrapper">
            <button className="btn-shop-fixed">{card.cta}</button>
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
};

// --- Main Component ---

const AutoRegeneration = ({ onPageChange }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Meta');
  const [draftPlatformFilter, setDraftPlatformFilter] = useState('');
  const [autoRegen, setAutoRegen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [expandedTags, setExpandedTags] = useState({});
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState({});
  const [hiddenCards, setHiddenCards] = useState(new Set());
  // 记忆每个 campaign 的人工操作状态：null(无操作), true(人工开启), false(人工关闭)
  const [manualPublishOverrides, setManualPublishOverrides] = useState({});
  const [autoPublishCampaigns, setAutoPublishCampaigns] = useState({});
  
  // 统一初始化逻辑
  useEffect(() => {
    const initialOverrides = {};
    const initialStatus = {};
    
    draftCampaigns.forEach(campaign => {
      if (campaign.isRecommendation) {
        initialOverrides[campaign.id] = null; // AI 标签不带人工标签
        initialStatus[campaign.id] = autoRegen; // 随系统状态
      } else {
        initialOverrides[campaign.id] = false; // 非 AI 标签视为人工操作的关闭态
        initialStatus[campaign.id] = false;
      }
    });
    
    setManualPublishOverrides(initialOverrides);
    setAutoPublishCampaigns(initialStatus);
  }, []);
  
  // Merge campaign cards with draft campaigns
  const [draftCampaigns, setDraftCampaigns] = useState(() => {
    const formatDate = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    
    const nowStr = formatDate(new Date());

    const campaignCardsData = CAMPAIGN_CARDS.map(card => ({
      id: card.id,
      platform: 'Meta',
      campaignName: `${card.audience} Campaign ${card.id}`,
      dailyBudget: 100,
      audience: card.audience,
      creatives: [
        { id: `${card.id}-c1`, name: 'Creative 1', type: card.hasImage ? 'image' : 'text' }
      ],
      product: { type: 'url', value: 'https://example.com' },
      updateTime: nowStr,
      isRecommendation: true,
      originalCard: card
    }));
    
    return [
      ...campaignCardsData,
      {
        id: 'meta-extra-1',
        platform: 'Meta',
        campaignName: 'Fitness Apparel Launch',
        dailyBudget: 250,
        audience: 'Gym Enthusiasts (18-45)',
        creatives: [{ id: 'mc1', name: 'Fitness Video', type: 'video' }],
        product: { type: 'url', value: 'https://example.com/fitness' },
        updateTime: '2026-01-21 10:15:00',
        isRecommendation: true
      },
      {
        id: 'meta-extra-2',
        platform: 'Meta',
        campaignName: 'Eco-Friendly Home Decor',
        dailyBudget: 150,
        audience: 'Sustainable Living Seekers',
        creatives: [{ id: 'mc2', name: 'Product Carousel', type: 'carousel' }],
        product: { type: 'url', value: 'https://example.com/eco-home' },
        updateTime: '2026-01-21 09:45:00',
        isRecommendation: true
      },
      {
        id: 'meta-extra-3',
        platform: 'Meta',
        campaignName: 'Smart Watch Promotion',
        dailyBudget: 300,
        audience: 'Tech Early Adopters',
        creatives: [{ id: 'mc3', name: 'Watch Image 1', type: 'image' }],
        product: { type: 'url', value: 'https://example.com/smartwatch' },
        updateTime: '2026-01-21 08:30:00',
        isRecommendation: true
      },
      {
        id: 'meta-extra-4',
        platform: 'Meta',
        campaignName: 'Winter Clearance Sale',
        dailyBudget: 500,
        audience: 'Bargain Hunters',
        creatives: [{ id: 'mc4', name: 'Clearance Banner', type: 'image' }],
        product: { type: 'url', value: 'https://example.com/clearance' },
        updateTime: '2026-01-20 18:00:00',
        isRecommendation: false
      },
      {
        id: 'meta-extra-5',
        platform: 'Meta',
        campaignName: 'Organic Skincare Set',
        dailyBudget: 120,
        audience: 'Natural Beauty Fans',
        creatives: [{ id: 'mc5', name: 'Skincare Video', type: 'video' }],
        product: { type: 'url', value: 'https://example.com/skincare' },
        updateTime: '2026-01-20 16:20:00',
        isRecommendation: false
      },
      {
        id: 'meta-extra-6',
        platform: 'Meta',
        campaignName: 'Pet Tech Accessories',
        dailyBudget: 200,
        audience: 'Pet Owners (US)',
        creatives: [{ id: 'mc6', name: 'Pet Gadget Image', type: 'image' }],
        product: { type: 'url', value: 'https://example.com/pet-tech' },
        updateTime: '2026-01-20 14:10:00',
        isRecommendation: false
      },
      {
        id: 'meta-extra-7',
        platform: 'Meta',
        campaignName: 'Gaming Headset Launch',
        dailyBudget: 400,
        audience: 'Hardcore Gamers (15-30)',
        creatives: [{ id: 'mc7', name: 'Gaming Carousel', type: 'carousel' }],
        product: { type: 'url', value: 'https://example.com/gaming' },
        updateTime: '2026-01-20 11:55:00',
        isRecommendation: false
      },
      {
        id: 'meta-extra-8',
        platform: 'Meta',
        campaignName: 'Kitchenware Essential Kit',
        dailyBudget: 180,
        audience: 'Home Cooks',
        creatives: [{ id: 'mc8', name: 'Kitchen Video', type: 'video' }],
        product: { type: 'url', value: 'https://example.com/kitchen' },
        updateTime: '2026-01-20 09:30:00',
        isRecommendation: false
      },
      {
        id: 'google-extra-1',
        platform: 'Google',
        campaignName: 'Spring Sale 2026',
        dailyBudget: 500,
        audience: 'Young Professionals (25-35)',
        creatives: [
          { id: 'gc1', name: 'Banner A', type: 'image' },
          { id: 'gc2', name: 'Video B', type: 'video' }
        ],
        product: { type: 'feed', name: 'Electronics' },
        updateTime: '2026-01-06 14:30:00',
        isRecommendation: false
      },
      {
        id: 'google-extra-2',
        platform: 'Google',
        campaignName: 'Back to School Gear',
        dailyBudget: 600,
        audience: 'Students & Parents',
        creatives: [{ id: 'gc3', name: 'Search Ad Text', type: 'text' }],
        product: { type: 'url', value: 'https://example.com/school' },
        updateTime: '2026-01-05 11:00:00',
        isRecommendation: false
      },
      {
        id: 'google-extra-3',
        platform: 'Google',
        campaignName: 'Luxury Travel Packages',
        dailyBudget: 1200,
        audience: 'High Net Worth Individuals',
        creatives: [{ id: 'gc4', name: 'Luxury Video', type: 'video' }],
        product: { type: 'url', value: 'https://example.com/travel' },
        updateTime: '2026-01-04 15:45:00',
        isRecommendation: false
      }
    ];
  });
  const [editingBudget, setEditingBudget] = useState(null);
  const [tempBudget, setTempBudget] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [animatingInfo, setAnimatingInfo] = useState({ id: null, phase: 'idle', targetIndex: null });

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // 增加被拖拽元素的透明度
    e.currentTarget.classList.add('row-dragging');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || dragOverIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = (e, campaignId) => {
    const fromIndex = draggedIndex;
    const toIndex = dragOverIndex;

    // 清除状态
    setDraggedIndex(null);
    setDragOverIndex(null);
    e.currentTarget.classList.remove('row-dragging');
    
    if (fromIndex !== null && toIndex !== null && fromIndex !== toIndex) {
      const newDrafts = [...draftCampaigns];
      const [draggedItem] = newDrafts.splice(fromIndex, 1);
      newDrafts.splice(toIndex, 0, draggedItem);
      setDraftCampaigns(newDrafts);
    }

    // 拖拽结束后的视觉反馈
    // 1. 先定位
    setTimeout(() => {
      const element = document.getElementById(`campaign-row-${campaignId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // 2. 定位完成后开始闪烁（约600ms后）
      setTimeout(() => {
        setHighlightedRowId(campaignId);
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      }, 600);
    }, 50);
  };

  const handleToggleAutoPublish = (campaignId) => {
    const currentStatus = autoPublishCampaigns[campaignId];
    const newStatus = !currentStatus;
    
    // 记录人工操作偏好
    setManualPublishOverrides(prev => ({ ...prev, [campaignId]: newStatus }));

    // 1. 准备阶段：计算目标位置
    const currentDrafts = [...draftCampaigns];
    const currentItem = currentDrafts.find(c => c.id === campaignId);
    const otherDrafts = currentDrafts.filter(c => c.id !== campaignId);
    
    // 预估更新后的状态（用于计算位置）
    const predictedAutoPublishStatus = { ...autoPublishCampaigns, [campaignId]: newStatus };
    const enabledInOthers = otherDrafts.filter(c => predictedAutoPublishStatus[c.id]);
    
    let targetIdx = 0;
    if (enabledInOthers.length > 0) {
      const lastEnabledId = enabledInOthers[enabledInOthers.length - 1].id;
      targetIdx = otherDrafts.findIndex(c => c.id === lastEnabledId) + 1;
    }

    // 2. 开始动画阶段：拿起 (Pick up)
    setAnimatingInfo({ id: campaignId, phase: 'leaving', targetIndex: targetIdx });

    // 300ms 后执行位置挪动逻辑
    setTimeout(() => {
      // 更新开关状态
      setAutoPublishCampaigns(prev => ({ ...prev, [campaignId]: newStatus }));
      
      // 更新数组位置
      const reorderedDrafts = [...otherDrafts];
      reorderedDrafts.splice(targetIdx, 0, currentItem);
      setDraftCampaigns(reorderedDrafts);

      // 跨页处理：计算目标行所在的页码并自动跳转
      const targetPage = Math.floor(targetIdx / itemsPerPage) + 1;
      if (currentPage !== targetPage) {
        setCurrentPage(targetPage);
      }

      // 进入第二阶段
      setAnimatingInfo({ id: campaignId, phase: 'arriving', targetIndex: targetIdx });

      // 定位（给 React 一个渲染页面的缓冲时间）
      setTimeout(() => {
        const element = document.getElementById(`campaign-row-${campaignId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // 关键逻辑：等待定位完成后才开始闪烁
        setTimeout(() => {
          setHighlightedRowId(campaignId);
          // 结束动画和闪烁状态
          setTimeout(() => {
            setAnimatingInfo({ id: null, phase: 'idle', targetIndex: null });
            setHighlightedRowId(null);
          }, 3000);
        }, 600); // 滚动定位约需600ms
      }, 100);
    }, 400);
  };

  useEffect(() => {
    if (autoRegen) {
      const autoStatus = {};
      CAMPAIGN_CARDS.forEach(card => {
        if (!campaignStatus[card.id]) {
          autoStatus[card.id] = 'auto';
        }
      });
      if (Object.keys(autoStatus).length > 0) {
        setCampaignStatus(prev => ({ ...prev, ...autoStatus }));
      }
    }
  }, [autoRegen]);

  // 当主卡片状态 (autoRegen) 变更时，根据记忆恢复或关闭开关
  useEffect(() => {
    if (!autoRegen) {
      // 当 recommendations 激活时，所有开关自动关闭
      setAutoPublishCampaigns(prev => {
        const newStatus = {};
        Object.keys(prev).forEach(id => newStatus[id] = false);
        return newStatus;
      });
    } else {
      // 当 auto publish 重新激活时，根据记忆恢复状态
      setAutoPublishCampaigns(() => {
        const newStatus = {};
        draftCampaigns.forEach(campaign => {
          const override = manualPublishOverrides[campaign.id];
          if (override !== null && override !== undefined) {
            // 如果有人工操作记忆，优先应用
            newStatus[campaign.id] = override;
          } else {
            // 如果没有记忆且带 AI 标签，自动打开
            newStatus[campaign.id] = !!campaign.isRecommendation;
          }
        });
        return newStatus;
      });
    }
  }, [autoRegen, manualPublishOverrides, draftCampaigns]);

  const toggleTags = (cardId) => {
    setExpandedTags(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleEditCard = (cardId) => {
    setSelectedCardId(cardId);
    setEditDrawerOpen(true);
  };

  const handlePublishCard = (cardId) => {
    if (!campaignStatus[cardId]) {
      setCampaignStatus(prev => ({ ...prev, [cardId]: 'manual' }));
    }
  };

  const handleHideCard = (cardId) => {
    setHiddenCards(prev => new Set([...prev, cardId]));
    setDraftCampaigns(prev => prev.filter(campaign => campaign.id !== cardId));
  };

  // 获取未被手动关闭campaign开关的前3个campaign
  const getRecommendedCards = () => {
    // 根据当前激活的功能卡片决定使用哪个状态
    // 当recommendations功能卡片激活时（!autoRegen）：使用manualPublishOverrides（记忆的人工操作状态）
    // 当auto publish功能卡片激活时（autoRegen）：使用autoPublishCampaigns（真实的开关状态）
    const statusToUse = autoRegen ? autoPublishCampaigns : manualPublishOverrides;
    
    // 过滤出未被手动关闭的campaign
    // 对于recommendations模式：记忆状态为true或null（无操作）且带AI标签的campaign
    // 对于auto publish模式：开关状态为true的campaign
    const enabledCampaigns = draftCampaigns.filter(campaign => {
      const status = statusToUse[campaign.id];
      
      if (autoRegen) {
        // auto publish模式：只展示开关开启的campaign
        return status === true && !hiddenCards.has(campaign.id);
      } else {
        // recommendations模式：展示AI标签的campaign（记忆状态为true或null）
        // 如果有人工关闭记录（false），则不展示
        return campaign.isRecommendation && 
               status !== false && 
               !hiddenCards.has(campaign.id);
      }
    });
    
    // 取前3个，并转换为RecommendationCard需要的格式
    const top3 = enabledCampaigns.slice(0, 3);
    
    return top3.map((campaign, index) => {
      // 如果campaign有originalCard（来自CAMPAIGN_CARDS），使用它
      if (campaign.originalCard) {
        return campaign.originalCard;
      }
      
      // 否则，根据campaign数据创建一个card对象
      const hasImage = campaign.creatives.some(c => c.type === 'image' || c.type === 'carousel');
      const interests = campaign.audience.includes('(') 
        ? campaign.audience.substring(campaign.audience.indexOf('(') + 1, campaign.audience.indexOf(')'))
        : campaign.audience;
      
      return {
        id: campaign.id,
        hasImage: hasImage,
        currentImgIndex: 0,
        selected: true,
        cta: 'Shop Now',
        headline: `${campaign.campaignName} - Special Offer`,
        text: `Targeting ${campaign.audience} with optimized creatives.`,
        audience: campaign.audience,
        age: '18-45',
        gender: 'All',
        interests: interests
      };
    });
  };

  const displayedCards = getRecommendedCards();

  // Pagination Logic
  const totalPages = Math.ceil(draftCampaigns.length / itemsPerPage);
  const paginatedDrafts = draftCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditDraft = (id) => {
    const campaign = draftCampaigns.find(c => c.id === id);
    if (campaign) {
      setEditDrawerOpen(true);
    }
  };
  const handlePublishDraft = (id) => console.log('Publish draft:', id);
  const handleDelete = (id) => { setCampaignToDelete(id); setDeleteConfirmOpen(true); };
  const handleDeleteConfirm = () => {
    if (campaignToDelete !== null) {
      setDraftCampaigns(prev => prev.filter(campaign => campaign.id !== campaignToDelete));
      setHiddenCards(prev => new Set([...prev, campaignToDelete]));
      setCampaignToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };
  const handleDeleteCancel = () => { setCampaignToDelete(null); setDeleteConfirmOpen(false); };
  const handleBudgetEditStart = (id, currentBudget) => { setEditingBudget(id); setTempBudget(currentBudget.toString()); };
  const handleBudgetSave = (id) => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      setDraftCampaigns(prev => prev.map(campaign => campaign.id === id ? { ...campaign, dailyBudget: newBudget } : campaign));
    }
    setEditingBudget(null);
    setTempBudget('');
  };
  const handleBudgetCancel = () => { setEditingBudget(null); setTempBudget(''); };

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const getPlatformLogo = (platform) => {
    switch (platform) {
      case 'Google':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      case 'Meta':
        return <img src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=20" alt="Meta" width="20" height="20" className="inline-block" />;
      case 'TikTok':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000"/>
          </svg>
        );
      default:
        return <span className="text-xs text-gray-600">{platform}</span>;
    }
  };

  const getCreativeIcon = (type) => {
    switch (type) {
      case 'image':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        );
      case 'video':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        );
      case 'carousel':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 font-sans">
      <div className="flex-1 flex flex-col gap-4">
        {/* Meta Launch Recommendation Section */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 md:p-6">
          <div className="mb-6 px-2">
            <div className="bg-gray-100 p-0.5 rounded-full flex gap-1 w-fit">
              {['Meta', 'Google', 'TikTok', 'Bing'].map(p => (
                <div key={p} className="relative group">
                  <button
                    onClick={() => p === 'Meta' && setSelectedPlatform(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedPlatform === p 
                        ? 'bg-white shadow-sm text-[#141414]' 
                        : 'text-[#8c8c8c] opacity-40 grayscale'
                    }`}
                  >
                    <img src={PLATFORM_LOGOS[p]} alt={p} className="w-6 h-6" />
                    {p}
                  </button>
                  {p !== 'Meta' && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Coming soon
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
            <div className="pl-4 relative">
              <div className="absolute left-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-gradient-to-b from-[#c3a2fe] via-[#7135f4] to-[#0d031f]"></div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 leading-none">
                    Recommended publish waitlists
                  </h2>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-gray-200 group/time cursor-default">
                    <Clock size={12} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-600">2026-01-21 19:25</span>
                    <div className="w-px h-3 bg-gray-300 mx-0.5"></div>
                    <RefreshCw size={12} className="text-gray-400 group-hover/time:text-blue-500 group-hover/time:rotate-180 transition-all duration-500 cursor-pointer" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-none">
                Showcasing the top 3 campaigns for auto-publish order.
                </p>
              </div>
            </div>
          </div>

          <div className="py-2 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayedCards.map((card, index) => (
                <RecommendationCard
                  key={card.id}
                  card={card}
                  isExpanded={expandedTags[card.id]}
                  onToggle={toggleTags}
                  onEdit={handleEditCard}
                  onPublish={handlePublishCard}
                  onHide={handleHideCard}
                  status={campaignStatus[card.id]}
                  cardIndex={index}
                />
              ))}
              
              <div key="empty-placeholder" className="campaign-wrapper">
                <div className="campaign-external-header">
                  <div className="bg-[#f0f7ff] border border-blue-100 rounded-xl px-3 py-1.5 flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-blue-50">
                      <img src="https://www.adsgo.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frobot-active.7003b4d8.png&w=256&q=75" alt="AI Robot" className="w-5 h-5" />
                    </div>
                    <span className="text-[14px] font-black text-blue-600 tracking-tight">AI-Scaling Control Center</span>
                  </div>
                </div>
                <div className="ad-card flex flex-col items-stretch p-0 bg-gray-50/30 border-dashed border-2 border-gray-200 min-h-[550px] relative group shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-[240px] relative bg-white border-b border-dashed border-gray-200">
                      <div className="absolute inset-0 rounded-t-xl overflow-hidden" style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      }}>
                        <div className="absolute top-1/4 left-1/4 w-[150px] h-[150px] bg-white/10 rounded-full blur-[40px] animate-float-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[100px] h-[100px] bg-white/15 rounded-full blur-[30px] animate-float-slower"></div>
                        <div className="absolute inset-0 opacity-[0.08]" style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }}></div>

                        <div className="absolute inset-0 flex items-center justify-center scale-[0.7]">
                          <div className="relative z-[20] w-32 h-32 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-[28px] flex flex-col items-center justify-center shadow-2xl animate-pulse-slow">
                            <Sparkles className="w-14 h-14 text-white" />
                            <div className="text-[15px] text-white font-black mt-2 whitespace-nowrap tracking-wider">Regenerating</div>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            {[
                              { label: 'Ad copys', icon: 'fa-font', delay: '0s', r: '145px' },
                              { label: 'Age', icon: 'fa-birthday-cake', delay: '-1.66s', r: '135px' },
                              { label: 'Gender', icon: 'fa-venus-mars', delay: '-3.33s', r: '155px' },
                              { label: 'Creatives', icon: 'fa-image', delay: '-5s', r: '125px' },
                              { label: 'Locations', icon: 'fa-map-marker-alt', delay: '-6.66s', r: '150px' },
                              { label: 'Products', icon: 'fa-shopping-bag', delay: '-8.33s', r: '140px' },
                              { label: 'Cta', icon: 'fa-mouse-pointer', delay: '-10s', r: '160px' },
                              { label: 'Interests', icon: 'fa-bullseye', delay: '-11.66s', r: '120px' },
                              { label: 'Lookalike', icon: 'fa-user-friends', delay: '-13.33s', r: '165px' }
                            ].map((item, idx) => (
                              <div key={idx} className="absolute animate-spiral-card" style={{ animationDelay: item.delay, '--radius': item.r }}>
                                <div className="w-16 h-16 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl">
                                  <i className={`fas ${item.icon} text-xl mb-1.5`}></i>
                                  <span className="text-[11px] font-black tracking-tight leading-none">{item.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-1" style={{ top: '20%', left: '15%' }}></div>
                        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-2" style={{ top: '60%', right: '20%' }}></div>
                      </div>
                    </div>

                    <div className="flex-1 bg-[#f8faff] p-3 flex flex-col gap-3">
                      <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm space-y-2">
                        <div className="flex items-center gap-1.5 px-1">
                          <i className="fas fa-chart-line text-primary text-[8px]"></i>
                          <span className="text-[12px] font-black text-gray-700 tracking-tight">AI Regeneration Publishing</span>
                        </div>
                        <div className="flex gap-1.5 items-center px-0.5">
                          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-1.5 flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 leading-none mb-1">Recommendations</span>
                            <span className="text-sm font-black text-gray-900 leading-none">5</span>
                          </div>
                          <i className="fas fa-arrow-right text-[10px] text-gray-300"></i>
                          <div className="flex-1 bg-white border-2 border-primary rounded-lg p-1.5 flex flex-col relative shadow-sm">
                            <span className="text-[10px] font-bold text-primary leading-none mb-1">Published</span>
                            <span className="text-sm font-black text-gray-900 leading-none text-center">{String(Object.keys(campaignStatus).length + 1)}</span>
                          </div>
                        </div>
                        <div className="px-0.5">
                          <div className="w-full bg-[#eff6ff] border border-primary/10 rounded-lg p-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500">Reserved</span>
                            <span className="text-sm font-black text-primary leading-none">{String(5 - (Object.keys(campaignStatus).length + 1))}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto pt-1 relative">
                        <div 
                          onClick={() => setAutoRegen(false)}
                          className={`flex-1 border-2 rounded-2xl p-2 flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative ${!autoRegen ? 'bg-blue-50 border-blue-500 shadow-[0_8px_16px_rgba(59,130,246,0.12)] scale-[1.05] z-10' : 'bg-white border-slate-100 hover:border-blue-200 opacity-80 grayscale hover:grayscale-0'}`}
                        >
                          <div className="mb-1.5 relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-white shadow-md">
                            <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${!autoRegen ? 'text-blue-600' : 'text-blue-400'}`}>
                              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" stroke="currentColor" fill="none"/><path d="M16 2V6M8 2V6M3 10H21" strokeWidth="2" stroke="currentColor" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="currentColor" className={!autoRegen ? 'animate-pulse' : ''}/>
                            </svg>
                          </div>
                          <p className={`text-[14px] font-black mb-1.5 tracking-tight ${!autoRegen ? 'text-blue-700' : 'text-slate-800'}`}>Recommendations</p>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all duration-300 ${!autoRegen ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                            <div className={`w-1 h-1 rounded-full ${!autoRegen ? 'bg-white animate-pulse' : 'bg-slate-300'}`} /><span className="text-[9px] font-black tracking-wider">{!autoRegen ? 'Running' : 'Standby'}</span>
                          </div>
                        </div>

                        <div 
                          onClick={() => setAutoRegen(true)}
                          className={`flex-1 border-2 rounded-2xl p-2 flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${autoRegen ? 'bg-slate-900 border-slate-800 shadow-[0_12px_24px_rgba(0,0,0,0.25)] scale-[1.05] z-10' : 'bg-white border-slate-100 hover:border-indigo-200 opacity-80 grayscale hover:grayscale-0'}`}
                        >
                          {autoRegen && (
                            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.4)_20deg,transparent_40deg)] animate-[spin_3s_linear_infinite]" />
                            </div>
                          )}
                          <div className={`mb-1.5 relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${autoRegen ? 'bg-slate-800 shadow-md border border-slate-700' : 'bg-white shadow-sm'}`}>
                            <Infinity size={20} className={`${autoRegen ? 'text-indigo-400 animate-[spin_3s_linear_infinite]' : 'text-indigo-600'}`}/>
                          </div>
                          <p className={`text-[14px] font-black mb-1.5 tracking-tight relative z-10 ${autoRegen ? 'text-white' : 'text-slate-800'}`}>Auto Publish</p>
                          <div className={`relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all duration-300 ${autoRegen ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                            <div className={`w-1 h-1 rounded-full ${autoRegen ? 'bg-green-400 animate-ping' : 'bg-slate-300'}`} /><span className="text-[9px] font-black tracking-wider">{autoRegen ? 'Running' : 'Standby'}</span>
                          </div>
                          <div className="absolute top-1.5 right-1.5 z-20">
                            <div className={`bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md leading-tight shadow-sm flex items-center gap-0.5 animate-pulse`}><ShieldCheck size={14} className="text-[#7033f5]" /><span>7*24H</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="mt-8 px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between relative">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-gradient-to-b from-[#c3a2fe] via-[#7135f4] to-[#0d031f]"></div>
          
          <div className="pl-4 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 leading-none">
              More drafts awaiting publish
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-none">
            When Auto Publish is running, you can choose whether a campaign participates and set its publish order.
            </p>
          </div>

          <div className="relative">
            <select 
              value={draftPlatformFilter} 
              onChange={(e) => setDraftPlatformFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7033f5] focus:border-transparent cursor-pointer transition-all duration-200 min-w-[160px]"
            >
              <option value="">All Platforms</option>
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[140px]">Auto Publish Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[180px]">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[120px]">Daily Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[200px]">Audience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[150px]">Creatives</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[100px]">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[180px]">Update Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {paginatedDrafts
                  .filter(campaign => draftPlatformFilter === '' || campaign.platform === draftPlatformFilter)
                  .map((campaign, index) => {
                    const actualIndex = (currentPage - 1) * itemsPerPage + index;
                    
                    // 动态计算样式类
                    let rowClass = 'border-b border-border transition-all duration-500 ';
                    
                    if (draggedIndex === actualIndex) {
                      rowClass += 'opacity-40 bg-blue-50 border-2 border-dashed border-blue-200';
                    } else if (animatingInfo.id === campaign.id) {
                      if (animatingInfo.phase === 'leaving') {
                        rowClass += 'row-pickup-fade';
                      } else if (animatingInfo.phase === 'arriving') {
                        rowClass += 'row-highlight-flash';
                      }
                    } else if (highlightedRowId === campaign.id) {
                      rowClass += 'row-highlight-flash';
                    }

                    // 为腾位准备的偏移逻辑
                    let gapStyle = {};
                    
                    // 情况A：自动化换位中的腾位 (始终向下移)
                    if (animatingInfo.phase === 'leaving' && 
                        animatingInfo.targetIndex !== null && 
                        actualIndex >= animatingInfo.targetIndex &&
                        campaign.id !== animatingInfo.id) {
                      gapStyle = { transform: 'translateY(72px)', borderTop: '2px dashed rgba(59, 130, 246, 0.3)' };
                    }
                    
                    // 情况B：手动拖拽中的腾位
                    if (dragOverIndex !== null && draggedIndex !== null && campaign.id !== animatingInfo.id) {
                      if (dragOverIndex < draggedIndex) {
                        // 从后往前拖 (向上挪): 目标位置到原位置之间的行向下移动
                        if (actualIndex >= dragOverIndex && actualIndex < draggedIndex) {
                          gapStyle = { transform: 'translateY(72px)', borderTop: actualIndex === dragOverIndex ? '2px dashed rgba(59, 130, 246, 0.3)' : '' };
                        }
                      } else if (dragOverIndex > draggedIndex) {
                        // 从前往后拖 (向下挪): 原位置到目标位置之间的行向上移动
                        if (actualIndex > draggedIndex && actualIndex <= dragOverIndex) {
                          gapStyle = { transform: 'translateY(-72px)', borderBottom: actualIndex === dragOverIndex ? '2px dashed rgba(59, 130, 246, 0.3)' : '' };
                        }
                      }
                    }

                    return (
                  <tr 
                    key={campaign.id} 
                    id={`campaign-row-${campaign.id}`}
                    className={`hover:bg-gray-50 ${rowClass}`}
                    style={gapStyle}
                    draggable={(!autoRegen || !autoPublishCampaigns[campaign.id]) ? false : true}
                    onDragStart={(e) => (!autoRegen || !autoPublishCampaigns[campaign.id]) || handleDragStart(e, actualIndex)}
                    onDragOver={(e) => (!autoRegen || !autoPublishCampaigns[campaign.id]) || handleDragOver(e, actualIndex)}
                    onDragEnd={(e) => handleDragEnd(e, campaign.id)}
                  >
                    <td className={`px-4 py-4 ${!autoRegen ? 'bg-gray-100' : ''}`}>
                      <div className="flex items-start gap-3">
                        {autoRegen && autoPublishCampaigns[campaign.id] ? (
                          <div className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 transition-colors">
                            <GripVertical size={16} />
                          </div>
                        ) : (
                          <div className="w-4" /> /* 占位符，保持对齐 */
                        )}
                        <div className="flex flex-col gap-2 flex-1">
                          {(actualIndex + 1) <= 6 && autoPublishCampaigns[campaign.id] && (
                            <div className="w-fit px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[9px] font-black tracking-tight">
                              Sequence {actualIndex + 1}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-8 h-4 rounded-full p-0.5 transition-colors ${autoPublishCampaigns[campaign.id] ? 'bg-green-500' : 'bg-gray-300'} ${!autoRegen ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                              onClick={() => !autoRegen || handleToggleAutoPublish(campaign.id)}
                            >
                              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoPublishCampaigns[campaign.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <span className={`text-[10px] font-bold ${autoPublishCampaigns[campaign.id] ? 'text-green-600' : 'text-red-600'} ${!autoRegen ? 'opacity-50' : ''}`}>
                              {autoPublishCampaigns[campaign.id] ? 'Waiting' : 'Forbidden'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getPlatformLogo(campaign.platform)}
                          {campaign.isRecommendation && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold rounded-full">
                              <Sparkles size={10} /> AI Regeneration
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900 text-sm mb-1">{campaign.campaignName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {editingBudget === campaign.id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" value={tempBudget} onChange={(e) => setTempBudget(e.target.value)} className="w-24 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" autoFocus />
                          <button onClick={() => handleBudgetSave(campaign.id)} className="text-green-600 hover:text-green-700 transition-colors"><Check size={16} /></button>
                          <button onClick={handleBudgetCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{formatCurrency(campaign.dailyBudget)}</span>
                          <button onClick={() => handleBudgetEditStart(campaign.id, campaign.dailyBudget)} className="text-gray-400 hover:text-primary transition-colors"><Edit size={14} /></button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4"><div className="text-sm text-gray-600">{campaign.audience}</div></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {campaign.creatives.slice(0, 3).map((creative) => (
                          <div key={creative.id} className="relative group">{getCreativeIcon(creative.type)}</div>
                        ))}
                        {campaign.creatives.length > 3 && <div className="text-xs text-gray-500">+{campaign.creatives.length - 3} more</div>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {typeof campaign.product === 'object' ? (
                        campaign.product.type === 'url' ? (
                          <a href={campaign.product.value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover hover:underline">{campaign.product.value}</a>
                        ) : (
                          <span className="text-sm text-gray-600">Feeds: {campaign.product.name}</span>
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{campaign.product}</span>
                      )}
                    </td>
                    <td className="px-4 py-4"><div className="text-sm text-gray-600">{campaign.updateTime}</div></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditDraft(campaign.id)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-primary transition-all duration-200 cursor-pointer">
                          <Edit size={14} /> <span>Edit</span>
                        </button>
                        <button onClick={() => handlePublishDraft(campaign.id)} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover hover:shadow-md transition-all duration-200 cursor-pointer">
                          <Send size={14} /> <span>Publish</span>
                        </button>
                        <button onClick={() => handleDelete(campaign.id)} className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>

          {draftCampaigns.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-border flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, draftCampaigns.length)}</span> of{' '}
                    <span className="font-medium">{draftCampaigns.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {draftCampaigns.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 9 20 9"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
              <p className="text-sm text-gray-500">You haven't created any draft campaigns yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleDeleteCancel}></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete campaign draft</h3>
            <p className="text-gray-600 mb-6">Once deleted, it cannot be recovered. Confirm deletion?</p>
            <div className="flex justify-end gap-3">
              <button onClick={handleDeleteCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors">No</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drawer Modal */}
      {editDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end" onClick={() => setEditDrawerOpen(false)}>
          <div className="w-full max-w-full h-[95vh] bg-white rounded-t-2xl shadow-lg flex flex-col overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Campaign</h3>
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={() => setEditDrawerOpen(false)}>
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
              <img src="/ad edit.jpg" alt="Ad Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s ease; }
        .campaign-wrapper { display: flex; flex-direction: column; gap: 12px; transition: all 0.3s; }
        .campaign-external-header { display: flex; justify-content: space-between; align-items: center; padding: 0; margin-bottom: 4px; }
        .campaign-index-group { display: flex; align-items: center; gap: 10px; }
        .campaign-index-badge { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #F5F1FF 0%, #E0E7FF 100%); border: 1px solid #D1D5DB; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #7033f5; }
        .campaign-index-badge.is-published { background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-color: #10B981; color: #059669; }
        .campaign-subtitle { font-size: 11px; font-weight: 500; color: #9CA3AF; letter-spacing: 0.08em; text-transform: none; }
        .external-actions { display: flex; align-items: center; gap: 6px; }
        .btn-edit-ghost { width: 32px; height: 32px; border: 1px solid #E5E7EB; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6B7280; cursor: pointer; transition: all 0.2s; }
        .btn-edit-ghost:hover { background: #F3F4F6; color: #374151; }
        .btn-publish-external { background-size: 200% 200%; border: none; padding: 7px 18px; border-radius: 10px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); animation: gradient-pulse 3s ease infinite, initial-glow 0.6s ease-out; position: relative; overflow: hidden; }
        .btn-publish-external:hover { transform: translateY(-2px) scale(1.02); }
        @keyframes gradient-pulse { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes initial-glow { 0% { box-shadow: 0 0 0 0 rgba(112, 51, 245, 0.7); transform: scale(0.95); } 50% { box-shadow: 0 0 0 10px rgba(112, 51, 245, 0); transform: scale(1); } 100% { box-shadow: 0 2px 12px rgba(112, 51, 245, 0.2); transform: scale(1); } }
        .ad-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; overflow: visible; box-shadow: 0 4px 24px -4px rgba(0,0,0,0.06); display: flex; flex-direction: column; font-size: 12px; position: relative; height: 100%; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .ad-card:hover { box-shadow: 0 8px 32px -4px rgba(0,0,0,0.1); }
        .ad-card.is-published { background: white; border-color: #E0E7FF; opacity: 0.75; filter: grayscale(0.15) brightness(0.98); pointer-events: none; }
        .ad-card.is-published::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--card-gradient, linear-gradient(180deg, #7033f5 0%, #8B5CF6 100%)); border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
        .status-badge-tag { padding: 5px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
        .status-badge-tag.status-auto { background: #ECFDF5; border: 1px solid #D1FAE5; color: #059669; }
        .more-recommendations-card { height: 100%; }
        .ad-audience-top { background: #f8faff; padding: 14px 16px; border-bottom: 1px solid #eef2ff; border-top-left-radius: 16px; border-top-right-radius: 16px; }
        .ad-audience-top:hover { background: #f1f5ff; }
        .aud-name { font-size: 12px; font-weight: 500; color: #9CA3AF; margin-right: 4px; }
        .aud-group { display: flex; align-items: center; gap: 6px; }
        .aud-icon-standalone { font-size: 14px; }
        .aud-content-tag { font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; border-style: solid; border-width: 1px; }
        .aud-pill-text { font-size: 10px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aud-row-2 { display: flex; align-items: center; gap: 8px; position: relative; }
        .aud-tags-wrapper { flex: 1; transition: all 0.3s ease; overflow: hidden; }
        .aud-tags-wrapper.collapsed { max-height: 20px; }
        .aud-tags-wrapper.expanded { max-height: 500px; }
        .aud-tags-container { display: flex; flex-wrap: wrap; gap: 6px; }
        .aud-pill-tag { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; border-style: solid; border-width: 1px; }
        .aud-expand-btn { cursor: pointer; color: #9CA3AF; padding: 2px 6px; border-radius: 4px; font-size: 12px; transition: transform 0.2s; margin-top: 2px; }
        .aud-expand-btn:hover { background: #F3F4F6; color: var(--hover-color, #7033f5); }
        .aud-expand-btn.rotated { transform: rotate(180deg); }
        .ad-header { padding: 12px 12px 8px; display: flex; justify-content: space-between; align-items: flex-start; }
        .ad-user-info { display: flex; gap: 8px; }
        .ad-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .ad-text-box h4 { font-size: 13px; font-weight: 700; color: #111827; line-height: 1.2; }
        .ad-text-box p { font-size: 11px; color: #6B7280; margin-top: 1px; }
        .ad-body-text { padding: 4px 12px 12px; cursor: pointer; min-height: 60px; border: 1px solid transparent; border-radius: 8px; transition: all 0.2s; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ad-body-text:hover { background: #F9FAFB; border-color: #E5E7EB; }
        .ad-line { font-size: 13px; line-height: 1.4; color: #111827; margin-bottom: 4px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .media-empty { margin: 0 12px 12px; height: calc(100% - 12px); border: 2px dashed #D1D5DB; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; color: #6B7280; }
        .ad-cta-section { background: #F9FAFB; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; gap: 8px; }
        .cta-left { flex: 1; min-width: 0; }
        .cta-left h5 { font-size: 13px; font-weight: 700; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cta-left p { font-size: 11px; color: #6B7280; min-height: 14px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cta-wrapper { position: relative; flex-shrink: 0; }
        .btn-shop-fixed { background: white; border: 1px solid #D1D5DB; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #111827; cursor: default; white-space: nowrap; }
        .ad-social { padding: 10px 12px; display: flex; justify-content: space-between; border-top: 1px solid #F3F4F6; color: #6B7280; overflow: hidden; }
        .social-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; cursor: pointer; flex: 1; justify-content: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @keyframes float-slow { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(20px, 20px, 0); } }
        @keyframes float-slower { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(-15px, -15px, 0); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes particle-1 { 0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; } 50% { transform: translate3d(30px, -20px, 0); opacity: 0.6; } }
        @keyframes particle-2 { 0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; } 50% { transform: translate3d(-40px, 15px, 0); opacity: 0.6; } }
        @keyframes particle-3 { 0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; } 50% { transform: translate3d(20px, 40px, 0); opacity: 0.6; } }
        
        /* Corrected Orbit Animation: Dynamic depth scaling and absolute leveling */
        @keyframes orbit-move {
          0% { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg) scale(0.6); opacity: 0.2; z-index: 5; }
          25% { opacity: 0.8; }
          50% { transform: rotate(180deg) translateX(var(--radius)) rotate(-180deg) scale(1.3); opacity: 1; z-index: 30; }
          75% { opacity: 0.8; }
          100% { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg) scale(0.6); opacity: 0.2; z-index: 5; }
        }
        .animate-spiral-card {
          animation: orbit-move 15s linear infinite;
          will-change: transform, opacity;
        }

        @keyframes system-rotate-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 7s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 10s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 9s ease-in-out infinite; }
        .animate-system-rotate-slow { animation: system-rotate-slow 360s linear infinite; }

        @keyframes row-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.15); }
        }
        .row-highlight-flash {
          animation: row-flash 1s ease-in-out 3;
          position: relative;
          z-index: 10;
        }

        .row-pickup-fade {
          opacity: 0;
          transform: scale(0.95);
          filter: blur(4px);
          pointer-events: none;
        }

        /* 已移除 row-gap-opening 类，改用内联 style 动态计算方向 */

        .row-dragging {
          opacity: 0.5;
          background-color: #f8faff;
        }

        /* 确保表格行平滑过渡 */
        tr {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, filter 0.4s ease;
        }
      `}</style>
    </div>
  );
};

export default AutoRegeneration;
