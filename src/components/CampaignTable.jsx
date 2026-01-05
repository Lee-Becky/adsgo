import React, { useState } from 'react'
import { ToggleLeft, ToggleRight, ChevronDown, ChevronRight, Edit, ArrowRight } from 'lucide-react'
import AdsetDetailModal from './AdsetDetailModal'
import FeedbackModal from './FeedbackModal'

const CampaignTable = ({ budgetStatus, onBudgetStatusChange, onCampaignClick, onBudgetReasonClick, onBudgetEditClick, onMoreInsights }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackTarget, setFeedbackTarget] = useState(null)
  const [selectedAdset, setSelectedAdset] = useState(null)
  const [isAdsetDetailOpen, setIsAdsetDetailOpen] = useState(false)
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      enabled: true,
      platform: 'Google',
      campaign: 'Brand Promotion - Spring Campaign',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 500,
      suggestedBudget: 800,
      budgetReason: {
        type: 'increase',
        reasons: [
          'ROI increased from 3.2 to 4.2, up 31%',
          'Conversion cost decreased by 15%, efficiency significantly improved',
          'Traffic growth trend obvious, recommend increasing budget'
        ],
        detailedReason: 'The Campaign ROI increased from 3.2 to 4.2 in the past 7 days, conversion cost decreased by 15%. Traffic growth trend is obvious, recommend increasing daily budget from ¥500 to ¥800 to get more quality traffic.',
        metrics: { roi: 4.2, change: '+31%', costChange: '-15%' }
      },
      spend: 3240,
      impressions: 125000,
      cpm: 25.92,
      clicks: 3500,
      cpc: 0.92,
      ctr: 2.8,
      results: 90,
      costPerResult: 36,
      resultCvr: 3.5,
      resultValue: 27000,
      resultRoas: 8.33,
      expanded: false,
      adsets: [
        {
          id: '1-1',
          name: 'Adset 1 - Spring Promo',
          enabled: true,
          status: 'Active',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          spend: 1296,
          impressions: 50000,
          cpm: 25.92,
          clicks: 1400,
          cpc: 0.93,
          ctr: 2.8,
          results: 36,
          costPerResult: 36,
          resultCvr: 3.5,
          resultValue: 10800,
          resultRoas: 8.33
        },
        {
          id: '1-2',
          name: 'Adset 2 - Brand Awareness',
          enabled: true,
          status: 'Active',
          dailyBudget: 300,
          suggestedBudget: 300,
          budgetReason: null,
          spend: 1944,
          impressions: 75000,
          cpm: 25.92,
          clicks: 2100,
          cpc: 0.93,
          ctr: 2.8,
          results: 54,
          costPerResult: 36,
          resultCvr: 3.5,
          resultValue: 16200,
          resultRoas: 8.33
        }
      ]
    },
    {
      id: 2,
      enabled: true,
      platform: 'Google',
      campaign: 'Search Ads - Keyword Promotion',
      status: 'Active',
      budgetLevel: 'adset',
      dailyBudget: 300,
      suggestedBudget: 300,
      budgetReason: null,
      spend: 1890,
      impressions: 85000,
      cpm: 22.24,
      clicks: 1020,
      cpc: 1.85,
      ctr: 1.2,
      results: 53,
      costPerResult: 35.66,
      resultCvr: 2.8,
      resultValue: 14820,
      resultRoas: 7.84,
      expanded: false,
      adsets: [
        {
          id: '2-1',
          name: 'Adset 1 - Young Professionals',
          enabled: true,
          status: 'Active',
          dailyBudget: 150,
          suggestedBudget: 180,
          budgetReason: {
            type: 'increase',
            reasons: [
              'CTR improved by 15%, good performance',
              'Conversion rate increased to 3.2%',
              'Recommend increasing budget by 20%'
            ],
            detailedReason: 'Adset 1 shows excellent performance with improved CTR and conversion rate.',
            metrics: { roi: 3.2, change: '+20%', costChange: '-10%' }
          },
          spend: 945,
          impressions: 42500,
          cpm: 22.24,
          clicks: 510,
          cpc: 1.85,
          ctr: 1.2,
          results: 26,
          costPerResult: 36.35,
          resultCvr: 2.8,
          resultValue: 7410,
          resultRoas: 7.84
        },
        {
          id: '2-2',
          name: 'Adset 2 - Middle-aged Families',
          enabled: true,
          status: 'Active',
          dailyBudget: 150,
          suggestedBudget: 120,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'ROI below target at 2.1',
              'CPC higher than average',
              'Recommend reducing budget by 20%'
            ],
            detailedReason: 'Adset 2 performance is below target, consider reducing budget.',
            metrics: { roi: 2.1, change: '-15%', costChange: '+5%' }
          },
          spend: 945,
          impressions: 42500,
          cpm: 22.24,
          clicks: 510,
          cpc: 1.85,
          ctr: 1.2,
          results: 27,
          costPerResult: 35,
          resultCvr: 2.8,
          resultValue: 7410,
          resultRoas: 7.84
        }
      ]
    },
    {
      id: 3,
      enabled: true,
      platform: 'Google',
      campaign: 'Display Ads - Brand Exposure',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 400,
      suggestedBudget: 600,
      budgetReason: {
        type: 'increase',
        reasons: [
          'CVR reached 3.5%, far above industry average',
          'Impressions and clicks steadily growing',
          'ROI reached 3.5, recommend expanding brand exposure'
        ],
        detailedReason: 'The Campaign CVR reached 3.5%, far above industry average (2.0%). Impressions and clicks are steadily growing, ROI reached 3.5. Recommend increasing daily budget from ¥400 to ¥600 to expand brand exposure.',
        metrics: { roi: 3.5, change: '+20%', costChange: '-10%' }
      },
      spend: 2520,
      impressions: 180000,
      cpm: 14,
      clicks: 2700,
      cpc: 0.93,
      ctr: 1.5,
      results: 72,
      costPerResult: 35,
      resultCvr: 3.5,
      resultValue: 18900,
      resultRoas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '3-1',
          name: 'Adset 1 - Display A',
          enabled: true,
          status: 'Active',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          spend: 1260,
          impressions: 90000,
          cpm: 14,
          clicks: 1350,
          cpc: 0.93,
          ctr: 1.5,
          results: 36,
          costPerResult: 35,
          resultCvr: 3.5,
          resultValue: 9450,
          resultRoas: 7.5
        },
        {
          id: '3-2',
          name: 'Adset 2 - Display B',
          enabled: true,
          status: 'Active',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          spend: 1260,
          impressions: 90000,
          cpm: 14,
          clicks: 1350,
          cpc: 0.93,
          ctr: 1.5,
          results: 36,
          costPerResult: 35,
          resultCvr: 3.5,
          resultValue: 9450,
          resultRoas: 7.5
        }
      ]
    },
    {
      id: 4,
      enabled: false,
      platform: 'Meta',
      campaign: 'Facebook Ads - Retargeting',
      status: 'Paused',
      budgetLevel: 'adset',
      dailyBudget: 200,
      suggestedBudget: 200,
      budgetReason: null,
      spend: 1200,
      impressions: 45000,
      cpm: 26.67,
      clicks: 495,
      cpc: 2.5,
      ctr: 1.1,
      results: 18,
      costPerResult: 66.67,
      resultCvr: 1.5,
      resultValue: 4320,
      resultRoas: 3.6,
      expanded: false,
      adsets: [
        {
          id: '4-1',
          name: 'Adset 1 - Website Visitors',
          enabled: false,
          status: 'Paused',
          dailyBudget: 100,
          suggestedBudget: 80,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'ROI is 1.8, below target (2.0)',
              'CPC high (¥2.5), cost偏高',
              'Conversion rate low (1.5%), recommend reevaluating'
            ],
            detailedReason: 'The Adset ROI is 1.8, below target (2.0). CPC is high (¥2.5), conversion rate is low (1.5%).',
            metrics: { roi: 1.8, change: '-15%', costChange: '+25%' }
          },
          spend: 600,
          impressions: 22500,
          cpm: 26.67,
          clicks: 247,
          cpc: 2.43,
          ctr: 1.1,
          results: 9,
          costPerResult: 66.67,
          resultCvr: 1.5,
          resultValue: 2160,
          resultRoas: 3.6
        },
        {
          id: '4-2',
          name: 'Adset 2 - Previous Purchasers',
          enabled: false,
          status: 'Paused',
          dailyBudget: 100,
          suggestedBudget: 80,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'ROI is 1.8, below target (2.0)',
              'CPC high (¥2.5), cost偏高',
              'Conversion rate low (1.5%), recommend reevaluating'
            ],
            detailedReason: 'The Adset ROI is 1.8, below target (2.0). CPC is high (¥2.5), conversion rate is low (1.5%).',
            metrics: { roi: 1.8, change: '-15%', costChange: '+25%' }
          },
          spend: 600,
          impressions: 22500,
          cpm: 26.67,
          clicks: 248,
          cpc: 2.42,
          ctr: 1.1,
          results: 9,
          costPerResult: 66.67,
          resultCvr: 1.5,
          resultValue: 2160,
          resultRoas: 3.6
        }
      ]
    },
    {
      id: 5,
      enabled: true,
      platform: 'TikTok',
      campaign: 'TikTok Ads - Young Audience',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 350,
      suggestedBudget: 350,
      budgetReason: {
        type: 'maintain',
        reasons: [
          'CTR reached 3.2%, performance excellent',
          'ROI is 2.5, slightly below target',
          'Recommend maintaining current budget, observe for another week before deciding'
        ],
        detailedReason: 'The Campaign targets young audiences, CTR reached 3.2%, performance excellent. ROI is 2.5, slightly below target. Recommend maintaining current budget, observe for another week before deciding whether to adjust.',
        metrics: { roi: 2.5, change: '+5%', costChange: '-5%' }
      },
      spend: 2100,
      impressions: 95000,
      cpm: 22.11,
      clicks: 3040,
      cpc: 0.69,
      ctr: 3.2,
      results: 75,
      costPerResult: 28,
      resultCvr: 2.5,
      resultValue: 15750,
      resultRoas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '5-1',
          name: 'Adset 1 - Young A',
          enabled: true,
          status: 'Active',
          dailyBudget: 175,
          suggestedBudget: 175,
          budgetReason: null,
          spend: 1050,
          impressions: 47500,
          cpm: 22.11,
          clicks: 1520,
          cpc: 0.69,
          ctr: 3.2,
          results: 37,
          costPerResult: 28.38,
          resultCvr: 2.5,
          resultValue: 7875,
          resultRoas: 7.5
        },
        {
          id: '5-2',
          name: 'Adset 2 - Young B',
          enabled: true,
          status: 'Active',
          dailyBudget: 175,
          suggestedBudget: 175,
          budgetReason: null,
          spend: 1050,
          impressions: 47500,
          cpm: 22.11,
          clicks: 1520,
          cpc: 0.69,
          ctr: 3.2,
          results: 38,
          costPerResult: 27.63,
          resultCvr: 2.5,
          resultValue: 7875,
          resultRoas: 7.5
        }
      ]
    }
  ])

  const toggleCampaign = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ))
  }

  const toggleExpand = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, expanded: !c.expanded } : c
    ))
  }

  const handleApprove = (id) => {
    onBudgetStatusChange(prev => ({ ...prev, [id]: 'approved' }))
  }

  const handleReject = (id) => {
    setFeedbackTarget(id)
    setFeedbackOpen(true)
  }

  const handleFeedbackConfirm = (feedback) => {
    if (feedbackTarget) {
      onBudgetStatusChange(prev => ({ ...prev, [feedbackTarget]: 'rejected' }))
    }
    setFeedbackOpen(false)
    setFeedbackTarget(null)
  }

  const formatCurrency = (value) => {
    return `¥${value.toFixed(2)}`
  }

  const formatNumber = (value) => {
    return value.toLocaleString()
  }

  const getPlatformLogo = (platform) => {
    switch (platform) {
      case 'Google':
        return (
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs text-gray-600">{platform}</span>
          </div>
        )
      case 'Meta':
        return (
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1877F2"/>
            </svg>
            <span className="text-xs text-gray-600">{platform}</span>
          </div>
        )
      case 'TikTok':
        return (
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000"/>
            </svg>
            <span className="text-xs text-gray-600">{platform}</span>
          </div>
        )
      default:
        return <span className="text-xs text-gray-600">{platform}</span>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Approved</span>
      case 'rejected':
        return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Rejected</span>
      case 'invalid_modified':
        return <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Invalid (Modified)</span>
      default:
        return null
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[60px]">
                Off/On
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[180px]">
                Campaign
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[100px]">
                Daily Budget
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[320px]">
                <div className="flex flex-col items-center gap-1">
                  <span>Optimize</span>
                  <span className="text-[10px] text-gray-400">Updated: January 4, 2026, 13:24:56 (UTC-8)</span>
                </div>
              </th>
            <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[100px]">
              Conv. goal
            </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[90px]">
                Spend
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[100px]">
                Impressions
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[70px]">
                CPM
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[70px]">
                Clicks
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[70px]">
                CPC
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[60px]">
                CTR
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[70px]">
                Conversions
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[110px]">
                Cost/conv.
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[70px]">
                Conv. rate
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[100px]">
                Conv. value
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[70px]">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => {
              const status = budgetStatus[campaign.id] || 'pending'
              
              return (
                <React.Fragment key={campaign.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors ${!campaign.enabled ? 'opacity-50' : ''}`}
                  >
                    <td className="px-2 py-3">
                      <button
                        onClick={() => toggleCampaign(campaign.id)}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {campaign.enabled ? (
                          <ToggleRight size={32} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={32} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-3">
                      <div className="relative">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {campaign.platform && getPlatformLogo(campaign.platform)}
                          </div>
                          <button
                            onClick={() => onCampaignClick(campaign)}
                            className="font-medium text-gray-900 hover:text-primary transition-colors text-xs"
                          >
                            {campaign.campaign}
                          </button>
                          <div className="mt-1">
                            <span className={`badge ${
                              campaign.status === 'Active' ? 'badge-success' :
                              campaign.status === 'Paused' ? 'badge-warning' :
                              'badge-gray'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleExpand(campaign.id)}
                          className="absolute bottom-0 right-0 text-gray-400 hover:text-primary transition-colors"
                          title={campaign.expanded ? 'Collapse' : 'Expand'}
                        >
                          {campaign.expanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.dailyBudget)}</span>
                        <button
                          onClick={() => onBudgetEditClick && onBudgetEditClick(campaign)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      {campaign.budgetLevel === 'campaign' ? (
                        <div className={`space-y-2 ${status !== 'pending' ? 'opacity-50' : ''}`}>
                          <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="text-[10px] text-primary font-semibold mb-1">
                              Recommended budget
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-bold text-primary">
                                {formatCurrency(campaign.suggestedBudget)}
                              </div>
                              {campaign.status !== 'Paused' && status === 'pending' && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleReject(campaign.id)}
                                    className="text-[10px] bg-white text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-50 transition-colors"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleApprove(campaign.id)}
                                    className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded hover:bg-primary-hover transition-colors"
                                  >
                                    Approve
                                  </button>
                                </div>
                              )}
                              {status === 'approved' && (
                                <div className="flex items-center gap-1">
                                  {getStatusBadge(status)}
                                </div>
                              )}
                              {status === 'rejected' && (
                                <div className="flex items-center gap-1">
                                  {getStatusBadge(status)}
                                </div>
                              )}
                              {status === 'invalid_modified' && (
                                <div className="flex items-center gap-1">
                                  {getStatusBadge(status)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-border pt-1">
                            {campaign.budgetReason.reasons.map((reason, idx) => (
                              <div key={idx} className="text-[10px] text-gray-600 flex items-start gap-0.5 mb-0.5 leading-tight">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{reason}</span>
                              </div>
                            ))}
                            <div className="flex justify-end mt-1">
                              <button
                                onClick={() => onMoreInsights && onMoreInsights({ 
                                  ...campaign, 
                                  status, 
                                  handleApprove, 
                                  handleReject,
                                  onBudgetStatusChange 
                                })}
                                className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors"
                              >
                                More Insights
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-primary font-semibold italic p-2">
                          Please see the budget adjustment suggestions for adsets.
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      Sales
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {formatCurrency(campaign.spend)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatNumber(campaign.impressions)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatCurrency(campaign.cpm)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatNumber(campaign.clicks)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatCurrency(campaign.cpc)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {campaign.ctr}%
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {campaign.results}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatCurrency(campaign.costPerResult)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {campaign.resultCvr}%
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatCurrency(campaign.resultValue)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {campaign.resultRoas}
                    </td>
                  </tr>

                  {/* Adsets rows */}
                  {campaign.expanded && campaign.adsets.map((adset) => {
                    const adsetStatus = budgetStatus[adset.id] || 'pending'
                    return (
                      <tr key={adset.id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-2 py-2">
                          <button className="text-gray-400 hover:text-primary transition-colors">
                            {adset.enabled ? (
                              <ToggleRight size={24} className="text-green-500" />
                            ) : (
                              <ToggleLeft size={24} className="text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 border-l-2 border-b-2 border-gray-400 ml-2"></div>
                            <div>
                              <div className="font-medium text-gray-700 text-xs">{adset.name}</div>
                              <div className="mt-0.5">
                                <span className={`badge ${
                                  adset.status === 'Active' ? 'badge-success' :
                                  adset.status === 'Paused' ? 'badge-warning' :
                                  'badge-gray'
                                }`}>
                                  {adset.status}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedAdset(adset)
                                  setIsAdsetDetailOpen(true)
                                }}
                                className="text-xs text-primary hover:text-primary-hover transition-colors mt-1"
                              >
                                View detail
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          {campaign.budgetLevel === 'campaign' ? (
                            <span className="text-xs font-medium text-gray-700 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              CBO (Campaign Budget)
                            </span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.dailyBudget)}</span>
                              <button
                                onClick={() => onBudgetEditClick && onBudgetEditClick({ ...adset, isAdset: true, parentCampaign: campaign })}
                                className="text-gray-400 hover:text-primary transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {campaign.budgetLevel === 'campaign' ? (
                            <div className="text-xs text-gray-500 italic">
                              The ad platform automatically allocates more campaign budget to better-performing adsets.
                            </div>
                          ) : (
                            adset.budgetReason && (
                              <div className={`space-y-2 ${adsetStatus !== 'pending' ? 'opacity-50' : ''}`}>
                                <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                                  <div className="text-[10px] text-primary font-semibold mb-1">
                                    Recommended budget
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-bold text-primary">
                                      {formatCurrency(adset.suggestedBudget)}
                                    </div>
                                    {adset.status !== 'Paused' && adsetStatus === 'pending' && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleReject(adset.id)}
                                          className="text-[10px] bg-white text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-50 transition-colors"
                                        >
                                          Reject
                                        </button>
                                        <button
                                          onClick={() => handleApprove(adset.id)}
                                          className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded hover:bg-primary-hover transition-colors"
                                        >
                                          Approve
                                        </button>
                                      </div>
                                    )}
                                    {adsetStatus === 'approved' && (
                                      <div className="flex items-center gap-1">
                                        {getStatusBadge(adsetStatus)}
                                      </div>
                                    )}
                                    {adsetStatus === 'rejected' && (
                                      <div className="flex items-center gap-1">
                                        {getStatusBadge(adsetStatus)}
                                      </div>
                                    )}
                                    {adsetStatus === 'invalid_modified' && (
                                      <div className="flex items-center gap-1">
                                        {getStatusBadge(adsetStatus)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="border-t border-border pt-1">
                                  {adset.budgetReason.reasons.map((reason, idx) => (
                                    <div key={idx} className="text-[10px] text-gray-600 flex items-start gap-0.5 mb-0.5 leading-tight">
                                      <span className="text-primary mt-0.5">•</span>
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-end mt-1">
                                    <button
                                      onClick={() => onMoreInsights && onMoreInsights({ 
                                        ...adset, 
                                        status: adsetStatus, 
                                        handleApprove, 
                                        handleReject,
                                        onBudgetStatusChange 
                                      })}
                                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors"
                                    >
                                      More Insights
                                      <ArrowRight size={10} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          Max Conversions-Purchase
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {formatCurrency(adset.spend)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatNumber(adset.impressions)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatCurrency(adset.cpm)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatNumber(adset.clicks)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatCurrency(adset.cpc)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {adset.ctr}%
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {adset.results}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatCurrency(adset.costPerResult)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {adset.resultCvr}%
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatCurrency(adset.resultValue)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {adset.resultRoas}
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => {
          setFeedbackOpen(false)
          setFeedbackTarget(null)
        }}
        onConfirm={handleFeedbackConfirm}
        title="Feedback"
        buttonText="Confirm Reject"
      />

      {/* Adset Detail Modal */}
      <AdsetDetailModal
        isOpen={isAdsetDetailOpen}
        onClose={() => {
          setIsAdsetDetailOpen(false)
          setSelectedAdset(null)
        }}
        adset={selectedAdset}
      />
    </>
  )
}

export default CampaignTable
