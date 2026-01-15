import React, { useState, useEffect, useMemo } from 'react'
import { ToggleLeft, ToggleRight, ChevronDown, ChevronRight, Edit, ArrowRight, ChevronUp, ChevronDown as ChevronDownIcon, TrendingUp, TrendingDown, Minus, ThumbsDown, Eye } from 'lucide-react'
import AdsetDetailModal from './AdsetDetailModal'
import FeedbackModal from './FeedbackModal'

const CampaignTable = ({ budgetStatus, onBudgetStatusChange, onCampaignClick, onBudgetReasonClick, onBudgetEditClick, onMoreInsights, autoExecuteRecommendations }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackTarget, setFeedbackTarget] = useState(null)
  const [selectedAdset, setSelectedAdset] = useState(null)
  const [isAdsetDetailOpen, setIsAdsetDetailOpen] = useState(false)
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'spend',
    direction: 'desc' // 'asc' or 'desc'
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      enabled: true,
      platform: 'Google',
      campaign: 'Brand Promotion - Spring Campaign',
      adAccount: 'Google Ads Account (1234567890)',
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
      event1s: 45,
      cpaEvent1: 72,
      cvrEvent1: 1.29,
      event2s: 30,
      cpaEvent2: 108,
      cvrEvent2: 0.86,
      purchases: 15,
      cpaPurchase: 216,
      cvrPurchase: 0.43,
      purchaseValue: 27000,
      roas: 8.33,
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
          locations: ['US'],
          spend: 1296,
          impressions: 50000,
          cpm: 25.92,
          clicks: 1400,
          cpc: 0.93,
          ctr: 2.8,
          event1s: 18,
          cpaEvent1: 72,
          cvrEvent1: 1.29,
          event2s: 12,
          cpaEvent2: 108,
          cvrEvent2: 0.86,
          purchases: 6,
          cpaPurchase: 216,
          cvrPurchase: 0.43,
          purchaseValue: 10800,
          roas: 8.33
        },
        {
          id: '1-2',
          name: 'Adset 2 - Brand Awareness',
          enabled: true,
          status: 'Active',
          dailyBudget: 300,
          suggestedBudget: 300,
          budgetReason: null,
          locations: ['CA'],
          spend: 1944,
          impressions: 75000,
          cpm: 25.92,
          clicks: 2100,
          cpc: 0.93,
          ctr: 2.8,
          event1s: 27,
          cpaEvent1: 72,
          cvrEvent1: 1.29,
          event2s: 18,
          cpaEvent2: 108,
          cvrEvent2: 0.86,
          purchases: 9,
          cpaPurchase: 216,
          cvrPurchase: 0.43,
          purchaseValue: 16200,
          roas: 8.33
        }
      ]
    },
    {
      id: 2,
      enabled: true,
      platform: 'Google',
      campaign: 'Search Ads - Keyword Promotion',
      adAccount: 'Google Ads Account (1234567890)',
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
      event1s: 25,
      cpaEvent1: 75.6,
      cvrEvent1: 2.45,
      event2s: 18,
      cpaEvent2: 105,
      cvrEvent2: 1.76,
      purchases: 10,
      cpaPurchase: 189,
      cvrPurchase: 0.98,
      purchaseValue: 14820,
      roas: 7.84,
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
          locations: ['UK'],
          spend: 945,
          impressions: 42500,
          cpm: 22.24,
          clicks: 510,
          cpc: 1.85,
          ctr: 1.2,
          event1s: 13,
          cpaEvent1: 72.69,
          cvrEvent1: 2.55,
          event2s: 9,
          cpaEvent2: 105,
          cvrEvent2: 1.76,
          purchases: 5,
          cpaPurchase: 189,
          cvrPurchase: 0.98,
          purchaseValue: 7410,
          roas: 7.84
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
          locations: ['UK'],
          spend: 945,
          impressions: 42500,
          cpm: 22.24,
          clicks: 510,
          cpc: 1.85,
          ctr: 1.2,
          event1s: 12,
          cpaEvent1: 78.75,
          cvrEvent1: 2.35,
          event2s: 9,
          cpaEvent2: 105,
          cvrEvent2: 1.76,
          purchases: 5,
          cpaPurchase: 189,
          cvrPurchase: 0.98,
          purchaseValue: 7410,
          roas: 7.84
        }
      ]
    },
    {
      id: 3,
      enabled: true,
      platform: 'Google',
      campaign: 'Display Ads - Brand Exposure',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 400,
      suggestedBudget: 200,
      budgetReason: {
        type: 'decrease',
        reasons: [
          'CVR reached 3.5%, far above industry average',
          'Impressions and clicks steadily growing',
          'ROI reached 3.5, recommend expanding brand exposure'
        ],
        detailedReason: 'The Campaign CVR reached 3.5%, far above industry average (2.0%). Impressions and clicks are steadily growing, ROI reached 3.5. Recommend decreasing daily budget from ¥400 to ¥200 to optimize cost efficiency.',
        metrics: { roi: 3.5, change: '+20%', costChange: '-10%' }
      },
      spend: 2520,
      impressions: 180000,
      cpm: 14,
      clicks: 2700,
      cpc: 0.93,
      ctr: 1.5,
      event1s: 36,
      cpaEvent1: 70,
      cvrEvent1: 1.33,
      event2s: 24,
      cpaEvent2: 105,
      cvrEvent2: 0.89,
      purchases: 12,
      cpaPurchase: 210,
      cvrPurchase: 0.44,
      purchaseValue: 18900,
      roas: 7.5,
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
          locations: ['FR'],
          spend: 1260,
          impressions: 90000,
          cpm: 14,
          clicks: 1350,
          cpc: 0.93,
          ctr: 1.5,
          event1s: 18,
          cpaEvent1: 70,
          cvrEvent1: 1.33,
          event2s: 12,
          cpaEvent2: 105,
          cvrEvent2: 0.89,
          purchases: 6,
          cpaPurchase: 210,
          cvrPurchase: 0.44,
          purchaseValue: 9450,
          roas: 7.5
        },
        {
          id: '3-2',
          name: 'Adset 2 - Display B',
          enabled: true,
          status: 'Active',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          locations: ['DE'],
          spend: 1260,
          impressions: 90000,
          cpm: 14,
          clicks: 1350,
          cpc: 0.93,
          ctr: 1.5,
          event1s: 18,
          cpaEvent1: 70,
          cvrEvent1: 1.33,
          event2s: 12,
          cpaEvent2: 105,
          cvrEvent2: 0.89,
          purchases: 6,
          cpaPurchase: 210,
          cvrPurchase: 0.44,
          purchaseValue: 9450,
          roas: 7.5
        }
      ]
    },
    {
      id: 4,
      enabled: false,
      platform: 'Meta',
      campaign: 'Facebook Ads - Retargeting',
      adAccount: 'Meta Business Account (9876543210)',
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
      event1s: 9,
      cpaEvent1: 133.33,
      cvrEvent1: 1.82,
      event2s: 6,
      cpaEvent2: 200,
      cvrEvent2: 1.21,
      purchases: 3,
      cpaPurchase: 400,
      cvrPurchase: 0.61,
      purchaseValue: 4320,
      roas: 3.6,
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
          locations: ['JP'],
          spend: 600,
          impressions: 22500,
          cpm: 26.67,
          clicks: 247,
          cpc: 2.43,
          ctr: 1.1,
          event1s: 5,
          cpaEvent1: 120,
          cvrEvent1: 2.02,
          event2s: 3,
          cpaEvent2: 200,
          cvrEvent2: 1.21,
          purchases: 2,
          cpaPurchase: 300,
          cvrPurchase: 0.81,
          purchaseValue: 2160,
          roas: 3.6
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
          locations: ['JP'],
          spend: 600,
          impressions: 22500,
          cpm: 26.67,
          clicks: 248,
          cpc: 2.42,
          ctr: 1.1,
          event1s: 4,
          cpaEvent1: 150,
          cvrEvent1: 1.61,
          event2s: 3,
          cpaEvent2: 200,
          cvrEvent2: 1.21,
          purchases: 1,
          cpaPurchase: 600,
          cvrPurchase: 0.40,
          purchaseValue: 2160,
          roas: 3.6
        }
      ]
    },
    {
      id: 5,
      enabled: true,
      platform: 'TikTok',
      campaign: 'TikTok Ads - Young Audience',
      adAccount: 'TikTok Ads Account (5555555555)',
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
      event1s: 38,
      cpaEvent1: 55.26,
      cvrEvent1: 1.25,
      event2s: 25,
      cpaEvent2: 84,
      cvrEvent2: 0.82,
      purchases: 12,
      cpaPurchase: 175,
      cvrPurchase: 0.39,
      purchaseValue: 15750,
      roas: 7.5,
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
          locations: ['AU'],
          spend: 1050,
          impressions: 47500,
          cpm: 22.11,
          clicks: 1520,
          cpc: 0.69,
          ctr: 3.2,
          event1s: 19,
          cpaEvent1: 55.26,
          cvrEvent1: 1.25,
          event2s: 13,
          cpaEvent2: 80.77,
          cvrEvent2: 0.86,
          purchases: 6,
          cpaPurchase: 175,
          cvrPurchase: 0.39,
          purchaseValue: 7875,
          roas: 7.5
        },
        {
          id: '5-2',
          name: 'Adset 2 - Young B',
          enabled: true,
          status: 'Active',
          dailyBudget: 175,
          suggestedBudget: 175,
          budgetReason: null,
          locations: ['AU'],
          spend: 1050,
          impressions: 47500,
          cpm: 22.11,
          clicks: 1520,
          cpc: 0.69,
          ctr: 3.2,
          event1s: 19,
          cpaEvent1: 55.26,
          cvrEvent1: 1.25,
          event2s: 12,
          cpaEvent2: 87.5,
          cvrEvent2: 0.79,
          purchases: 6,
          cpaPurchase: 175,
          cvrPurchase: 0.39,
          purchaseValue: 7875,
          roas: 7.5
        }
      ]
    },
    {
      id: 6,
      enabled: true,
      platform: 'Google',
      campaign: 'YouTube Ads - Video Campaign',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 450,
      suggestedBudget: 600,
      budgetReason: {
        type: 'increase',
        reasons: [
          'Video completion rate increased by 25%',
          'CPV decreased from ¥0.15 to ¥0.12',
          'Strong engagement metrics observed'
        ],
        detailedReason: 'Video completion rate improved significantly, CPV decreased. Recommend increasing budget to maximize reach.',
        metrics: { roi: 3.8, change: '+25%', costChange: '-20%' }
      },
      spend: 2700,
      impressions: 135000,
      cpm: 20,
      clicks: 4050,
      cpc: 0.67,
      ctr: 3.0,
      event1s: 40,
      cpaEvent1: 67.5,
      cvrEvent1: 0.99,
      event2s: 28,
      cpaEvent2: 96.43,
      cvrEvent2: 0.69,
      purchases: 14,
      cpaPurchase: 192.86,
      cvrPurchase: 0.35,
      purchaseValue: 22680,
      roas: 8.4,
      expanded: false,
      adsets: [
        {
          id: '6-1',
          name: 'Adset 1 - Video A',
          enabled: true,
          status: 'Active',
          dailyBudget: 225,
          suggestedBudget: 225,
          budgetReason: null,
          locations: ['IN'],
          spend: 1350,
          impressions: 67500,
          cpm: 20,
          clicks: 2025,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 20,
          cpaEvent1: 67.5,
          cvrEvent1: 0.99,
          event2s: 14,
          cpaEvent2: 96.43,
          cvrEvent2: 0.69,
          purchases: 7,
          cpaPurchase: 192.86,
          cvrPurchase: 0.35,
          purchaseValue: 11340,
          roas: 8.4
        },
        {
          id: '6-2',
          name: 'Adset 2 - Video B',
          enabled: true,
          status: 'Active',
          dailyBudget: 225,
          suggestedBudget: 225,
          budgetReason: null,
          locations: ['BR'],
          spend: 1350,
          impressions: 67500,
          cpm: 20,
          clicks: 2025,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 20,
          cpaEvent1: 67.5,
          cvrEvent1: 0.99,
          event2s: 14,
          cpaEvent2: 96.43,
          cvrEvent2: 0.69,
          purchases: 7,
          cpaPurchase: 192.86,
          cvrPurchase: 0.35,
          purchaseValue: 11340,
          roas: 8.4
        }
      ]
    },
    {
      id: 7,
      enabled: true,
      platform: 'Meta',
      campaign: 'Instagram Ads - Visual Content',
      adAccount: 'Meta Business Account (9876543210)',
      status: 'Active',
      budgetLevel: 'adset',
      dailyBudget: 250,
      suggestedBudget: 250,
      budgetReason: null,
      spend: 1500,
      impressions: 60000,
      cpm: 25,
      clicks: 660,
      cpc: 2.27,
      ctr: 1.1,
      event1s: 12,
      cpaEvent1: 125,
      cvrEvent1: 1.82,
      event2s: 8,
      cpaEvent2: 187.5,
      cvrEvent2: 1.21,
      purchases: 4,
      cpaPurchase: 375,
      cvrPurchase: 0.61,
      purchaseValue: 5400,
      roas: 3.6,
      expanded: false,
      adsets: [
        {
          id: '7-1',
          name: 'Adset 1 - Stories',
          enabled: true,
          status: 'Active',
          dailyBudget: 125,
          suggestedBudget: 150,
          budgetReason: {
            type: 'increase',
            reasons: [
              'Stories completion rate 85%',
              'High engagement from younger audience',
              'Tap-through rate above average'
            ],
            detailedReason: 'Instagram Stories showing strong engagement metrics.',
            metrics: { roi: 4.0, change: '+18%', costChange: '-12%' }
          },
          locations: ['MX'],
          spend: 750,
          impressions: 30000,
          cpm: 25,
          clicks: 330,
          cpc: 2.27,
          ctr: 1.1,
          event1s: 6,
          cpaEvent1: 125,
          cvrEvent1: 1.82,
          event2s: 4,
          cpaEvent2: 187.5,
          cvrEvent2: 1.21,
          purchases: 2,
          cpaPurchase: 375,
          cvrPurchase: 0.61,
          purchaseValue: 2700,
          roas: 3.6
        },
        {
          id: '7-2',
          name: 'Adset 2 - Feed',
          enabled: true,
          status: 'Active',
          dailyBudget: 125,
          suggestedBudget: 100,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'Feed engagement lower than expected',
              'CPM slightly elevated',
              'Consider reallocating budget'
            ],
            detailedReason: 'Feed performance is below Stories performance.',
            metrics: { roi: 3.2, change: '-10%', costChange: '+8%' }
          },
          locations: ['MX'],
          spend: 750,
          impressions: 30000,
          cpm: 25,
          clicks: 330,
          cpc: 2.27,
          ctr: 1.1,
          event1s: 6,
          cpaEvent1: 125,
          cvrEvent1: 1.82,
          event2s: 4,
          cpaEvent2: 187.5,
          cvrEvent2: 1.21,
          purchases: 2,
          cpaPurchase: 375,
          cvrPurchase: 0.61,
          purchaseValue: 2700,
          roas: 3.6
        }
      ]
    },
    {
      id: 8,
      enabled: false,
      platform: 'TikTok',
      campaign: 'TikTok Ads - Influencer Campaign',
      adAccount: 'TikTok Ads Account (5555555555)',
      status: 'Paused',
      budgetLevel: 'campaign',
      dailyBudget: 400,
      suggestedBudget: 300,
      budgetReason: {
        type: 'decrease',
        reasons: [
          'Influencer engagement below KPI',
          'Cost per view higher than benchmark',
          'Recommend optimizing influencer selection'
        ],
        detailedReason: 'Influencer campaign performance is below expectations. Consider reducing budget and optimizing influencer partnerships.',
        metrics: { roi: 2.0, change: '-25%', costChange: '+15%' }
      },
      spend: 2400,
      impressions: 80000,
      cpm: 30,
      clicks: 3200,
      cpc: 0.75,
      ctr: 4.0,
      event1s: 32,
      cpaEvent1: 75,
      cvrEvent1: 1.0,
      event2s: 20,
      cpaEvent2: 120,
      cvrEvent2: 0.63,
      purchases: 8,
      cpaPurchase: 300,
      cvrPurchase: 0.25,
      purchaseValue: 12000,
      roas: 5.0,
      expanded: false,
      adsets: [
        {
          id: '8-1',
          name: 'Adset 1 - Influencer A',
          enabled: false,
          status: 'Paused',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          locations: ['SG'],
          spend: 1200,
          impressions: 40000,
          cpm: 30,
          clicks: 1600,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 16,
          cpaEvent1: 75,
          cvrEvent1: 1.0,
          event2s: 10,
          cpaEvent2: 120,
          cvrEvent2: 0.63,
          purchases: 4,
          cpaPurchase: 300,
          cvrPurchase: 0.25,
          purchaseValue: 6000,
          roas: 5.0
        },
        {
          id: '8-2',
          name: 'Adset 2 - Influencer B',
          enabled: false,
          status: 'Paused',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          locations: ['MY'],
          spend: 1200,
          impressions: 40000,
          cpm: 30,
          clicks: 1600,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 16,
          cpaEvent1: 75,
          cvrEvent1: 1.0,
          event2s: 10,
          cpaEvent2: 120,
          cvrEvent2: 0.63,
          purchases: 4,
          cpaPurchase: 300,
          cvrPurchase: 0.25,
          purchaseValue: 6000,
          roas: 5.0
        }
      ]
    },
    {
      id: 9,
      enabled: true,
      platform: 'Google',
      campaign: 'Shopping Ads - E-commerce',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'adset',
      dailyBudget: 350,
      suggestedBudget: 350,
      budgetReason: null,
      spend: 2100,
      impressions: 70000,
      cpm: 30,
      clicks: 2800,
      cpc: 0.75,
      ctr: 4.0,
      event1s: 35,
      cpaEvent1: 60,
      cvrEvent1: 1.25,
      event2s: 24,
      cpaEvent2: 87.5,
      cvrEvent2: 0.86,
      purchases: 16,
      cpaPurchase: 131.25,
      cvrPurchase: 0.57,
      purchaseValue: 24000,
      roas: 11.43,
      expanded: false,
      adsets: [
        {
          id: '9-1',
          name: 'Adset 1 - Product A',
          enabled: true,
          status: 'Active',
          dailyBudget: 175,
          suggestedBudget: 200,
          budgetReason: {
            type: 'increase',
            reasons: [
              'High conversion rate for Product A',
              'ROAS of 12.5X exceeds target',
              'Strong product demand'
            ],
            detailedReason: 'Product A showing exceptional performance with high ROAS.',
            metrics: { roi: 12.5, change: '+30%', costChange: '-15%' }
          },
          locations: ['NL'],
          spend: 1050,
          impressions: 35000,
          cpm: 30,
          clicks: 1400,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 18,
          cpaEvent1: 58.33,
          cvrEvent1: 1.29,
          event2s: 12,
          cpaEvent2: 87.5,
          cvrEvent2: 0.86,
          purchases: 8,
          cpaPurchase: 131.25,
          cvrPurchase: 0.57,
          purchaseValue: 12000,
          roas: 11.43
        },
        {
          id: '9-2',
          name: 'Adset 2 - Product B',
          enabled: true,
          status: 'Active',
          dailyBudget: 175,
          suggestedBudget: 150,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'Lower conversion rate for Product B',
              'ROAS of 10.0X still good but below target',
              'Consider optimizing product listing'
            ],
            detailedReason: 'Product B performance is solid but can be improved.',
            metrics: { roi: 10.0, change: '-5%', costChange: '+3%' }
          },
          locations: ['BE'],
          spend: 1050,
          impressions: 35000,
          cpm: 30,
          clicks: 1400,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 17,
          cpaEvent1: 61.76,
          cvrEvent1: 1.21,
          event2s: 12,
          cpaEvent2: 87.5,
          cvrEvent2: 0.86,
          purchases: 8,
          cpaPurchase: 131.25,
          cvrPurchase: 0.57,
          purchaseValue: 12000,
          roas: 11.43
        }
      ]
    },
    {
      id: 10,
      enabled: true,
      platform: 'Meta',
      campaign: 'Facebook Ads - Lead Generation',
      adAccount: 'Meta Business Account (9876543210)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 300,
      suggestedBudget: 300,
      budgetReason: {
        type: 'maintain',
        reasons: [
          'Lead cost stable at ¥25 per lead',
          'Quality leads above 85%',
          'Consistent performance maintained'
        ],
        detailedReason: 'Lead generation campaign performing consistently. Maintain current budget.',
        metrics: { roi: 3.0, change: '+0%', costChange: '+0%' }
      },
      spend: 1800,
      impressions: 72000,
      cpm: 25,
      clicks: 2160,
      cpc: 0.83,
      ctr: 3.0,
      event1s: 24,
      cpaEvent1: 75,
      cvrEvent1: 1.11,
      event2s: 18,
      cpaEvent2: 100,
      cvrEvent2: 0.83,
      purchases: 6,
      cpaPurchase: 300,
      cvrPurchase: 0.28,
      purchaseValue: 8100,
      roas: 4.5,
      expanded: false,
      adsets: [
        {
          id: '10-1',
          name: 'Adset 1 - Lead Form A',
          enabled: true,
          status: 'Active',
          dailyBudget: 150,
          suggestedBudget: 150,
          budgetReason: null,
          locations: ['ZA'],
          spend: 900,
          impressions: 36000,
          cpm: 25,
          clicks: 1080,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 12,
          cpaEvent1: 75,
          cvrEvent1: 1.11,
          event2s: 9,
          cpaEvent2: 100,
          cvrEvent2: 0.83,
          purchases: 3,
          cpaPurchase: 300,
          cvrPurchase: 0.28,
          purchaseValue: 4050,
          roas: 4.5
        },
        {
          id: '10-2',
          name: 'Adset 2 - Lead Form B',
          enabled: true,
          status: 'Active',
          dailyBudget: 150,
          suggestedBudget: 150,
          budgetReason: null,
          locations: ['NG'],
          spend: 900,
          impressions: 36000,
          cpm: 25,
          clicks: 1080,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 12,
          cpaEvent1: 75,
          cvrEvent1: 1.11,
          event2s: 9,
          cpaEvent2: 100,
          cvrEvent2: 0.83,
          purchases: 3,
          cpaPurchase: 300,
          cvrPurchase: 0.28,
          purchaseValue: 4050,
          roas: 4.5
        }
      ]
    },
    {
      id: 11,
      enabled: true,
      platform: 'Google',
      campaign: 'Performance Max - Multi-channel',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 500,
      suggestedBudget: 700,
      budgetReason: {
        type: 'increase',
        reasons: [
          'Cross-channel performance strong',
          'Conversion rate increased 20%',
          'AI optimization showing results'
        ],
        detailedReason: 'Performance Max campaign excelling across all channels. Increase budget to maximize performance.',
        metrics: { roi: 4.5, change: '+22%', costChange: '-18%' }
      },
      spend: 3000,
      impressions: 150000,
      cpm: 20,
      clicks: 4500,
      cpc: 0.67,
      ctr: 3.0,
      event1s: 54,
      cpaEvent1: 55.56,
      cvrEvent1: 1.2,
      event2s: 36,
      cpaEvent2: 83.33,
      cvrEvent2: 0.8,
      purchases: 18,
      cpaPurchase: 166.67,
      cvrPurchase: 0.4,
      purchaseValue: 32400,
      roas: 10.8,
      expanded: false,
      adsets: [
        {
          id: '11-1',
          name: 'Adset 1 - PM A',
          enabled: true,
          status: 'Active',
          dailyBudget: 250,
          suggestedBudget: 250,
          budgetReason: null,
          locations: ['SE'],
          spend: 1500,
          impressions: 75000,
          cpm: 20,
          clicks: 2250,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 27,
          cpaEvent1: 55.56,
          cvrEvent1: 1.2,
          event2s: 18,
          cpaEvent2: 83.33,
          cvrEvent2: 0.8,
          purchases: 9,
          cpaPurchase: 166.67,
          cvrPurchase: 0.4,
          purchaseValue: 16200,
          roas: 10.8
        },
        {
          id: '11-2',
          name: 'Adset 2 - PM B',
          enabled: true,
          status: 'Active',
          dailyBudget: 250,
          suggestedBudget: 250,
          budgetReason: null,
          locations: ['NO'],
          spend: 1500,
          impressions: 75000,
          cpm: 20,
          clicks: 2250,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 27,
          cpaEvent1: 55.56,
          cvrEvent1: 1.2,
          event2s: 18,
          cpaEvent2: 83.33,
          cvrEvent2: 0.8,
          purchases: 9,
          cpaPurchase: 166.67,
          cvrPurchase: 0.4,
          purchaseValue: 16200,
          roas: 10.8
        }
      ]
    },
    {
      id: 12,
      enabled: false,
      platform: 'Meta',
      campaign: 'Facebook Ads - App Install',
      adAccount: 'Meta Business Account (9876543210)',
      status: 'Paused',
      budgetLevel: 'adset',
      dailyBudget: 280,
      suggestedBudget: 280,
      budgetReason: null,
      spend: 1680,
      impressions: 67200,
      cpm: 25,
      clicks: 2016,
      cpc: 0.83,
      ctr: 3.0,
      event1s: 22,
      cpaEvent1: 76.36,
      cvrEvent1: 1.09,
      event2s: 15,
      cpaEvent2: 112,
      cvrEvent2: 0.74,
      purchases: 5,
      cpaPurchase: 336,
      cvrPurchase: 0.25,
      purchaseValue: 7560,
      roas: 4.5,
      expanded: false,
      adsets: [
        {
          id: '12-1',
          name: 'Adset 1 - iOS',
          enabled: false,
          status: 'Paused',
          dailyBudget: 140,
          suggestedBudget: 120,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'iOS install rate lower than Android',
              'ATT policy impact',
              'CPI higher than benchmark'
            ],
            detailedReason: 'iOS performance affected by ATT policy. Consider reducing budget.',
            metrics: { roi: 3.5, change: '-15%', costChange: '+10%' }
          },
          locations: ['PH'],
          spend: 840,
          impressions: 33600,
          cpm: 25,
          clicks: 1008,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 11,
          cpaEvent1: 76.36,
          cvrEvent1: 1.09,
          event2s: 8,
          cpaEvent2: 105,
          cvrEvent2: 0.79,
          purchases: 3,
          cpaPurchase: 280,
          cvrPurchase: 0.30,
          purchaseValue: 3780,
          roas: 4.5
        },
        {
          id: '12-2',
          name: 'Adset 2 - Android',
          enabled: false,
          status: 'Paused',
          dailyBudget: 140,
          suggestedBudget: 140,
          budgetReason: null,
          locations: ['VN'],
          spend: 840,
          impressions: 33600,
          cpm: 25,
          clicks: 1008,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 11,
          cpaEvent1: 76.36,
          cvrEvent1: 1.09,
          event2s: 7,
          cpaEvent2: 120,
          cvrEvent2: 0.69,
          purchases: 2,
          cpaPurchase: 420,
          cvrPurchase: 0.20,
          purchaseValue: 3780,
          roas: 4.5
        }
      ]
    },
    {
      id: 13,
      enabled: true,
      platform: 'TikTok',
      campaign: 'TikTok Ads - Brand Awareness',
      adAccount: 'TikTok Ads Account (5555555555)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 320,
      suggestedBudget: 400,
      budgetReason: {
        type: 'increase',
        reasons: [
          'Brand recall increased 40%',
          'Video view-through rate 85%',
          'Strong organic engagement'
        ],
        detailedReason: 'Brand awareness campaign showing excellent engagement metrics. Increase budget to maximize brand exposure.',
        metrics: { roi: 3.2, change: '+35%', costChange: '-20%' }
      },
      spend: 1920,
      impressions: 96000,
      cpm: 20,
      clicks: 2880,
      cpc: 0.67,
      ctr: 3.0,
      event1s: 29,
      cpaEvent1: 66.21,
      cvrEvent1: 1.01,
      event2s: 19,
      cpaEvent2: 101.05,
      cvrEvent2: 0.66,
      purchases: 10,
      cpaPurchase: 192,
      cvrPurchase: 0.35,
      purchaseValue: 14400,
      roas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '13-1',
          name: 'Adset 1 - Brand A',
          enabled: true,
          status: 'Active',
          dailyBudget: 160,
          suggestedBudget: 160,
          budgetReason: null,
          locations: ['TH'],
          spend: 960,
          impressions: 48000,
          cpm: 20,
          clicks: 1440,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 15,
          cpaEvent1: 64,
          cvrEvent1: 1.04,
          event2s: 10,
          cpaEvent2: 96,
          cvrEvent2: 0.69,
          purchases: 5,
          cpaPurchase: 192,
          cvrPurchase: 0.35,
          purchaseValue: 7200,
          roas: 7.5
        },
        {
          id: '13-2',
          name: 'Adset 2 - Brand B',
          enabled: true,
          status: 'Active',
          dailyBudget: 160,
          suggestedBudget: 160,
          budgetReason: null,
          locations: ['ID'],
          spend: 960,
          impressions: 48000,
          cpm: 20,
          clicks: 1440,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 14,
          cpaEvent1: 68.57,
          cvrEvent1: 0.97,
          event2s: 9,
          cpaEvent2: 106.67,
          cvrEvent2: 0.63,
          purchases: 5,
          cpaPurchase: 192,
          cvrPurchase: 0.35,
          purchaseValue: 7200,
          roas: 7.5
        }
      ]
    },
    {
      id: 14,
      enabled: true,
      platform: 'Google',
      campaign: 'Discovery Ads - New Products',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'adset',
      dailyBudget: 380,
      suggestedBudget: 380,
      budgetReason: null,
      spend: 2280,
      impressions: 76000,
      cpm: 30,
      clicks: 3040,
      cpc: 0.75,
      ctr: 4.0,
      event1s: 38,
      cpaEvent1: 60,
      cvrEvent1: 1.25,
      event2s: 26,
      cpaEvent2: 87.69,
      cvrEvent2: 0.86,
      purchases: 14,
      cpaPurchase: 162.86,
      cvrPurchase: 0.46,
      purchaseValue: 20520,
      roas: 9.0,
      expanded: false,
      adsets: [
        {
          id: '14-1',
          name: 'Adset 1 - Product Launch',
          enabled: true,
          status: 'Active',
          dailyBudget: 190,
          suggestedBudget: 220,
          budgetReason: {
            type: 'increase',
            reasons: [
              'New product launch successful',
              'High engagement on discovery placements',
              'Strong initial conversion rate'
            ],
            detailedReason: 'Product launch campaign showing strong performance.',
            metrics: { roi: 9.5, change: '+28%', costChange: '-16%' }
          },
          locations: ['DK'],
          spend: 1140,
          impressions: 38000,
          cpm: 30,
          clicks: 1520,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 19,
          cpaEvent1: 60,
          cvrEvent1: 1.25,
          event2s: 13,
          cpaEvent2: 87.69,
          cvrEvent2: 0.86,
          purchases: 7,
          cpaPurchase: 162.86,
          cvrPurchase: 0.46,
          purchaseValue: 10260,
          roas: 9.0
        },
        {
          id: '14-2',
          name: 'Adset 2 - Product Discovery',
          enabled: true,
          status: 'Active',
          dailyBudget: 190,
          suggestedBudget: 160,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'Discovery engagement lower than expected',
              'CPM slightly elevated',
              'Optimize creative assets'
            ],
            detailedReason: 'Discovery performance can be improved with better creatives.',
            metrics: { roi: 8.5, change: '-8%', costChange: '+5%' }
          },
          locations: ['FI'],
          spend: 1140,
          impressions: 38000,
          cpm: 30,
          clicks: 1520,
          cpc: 0.75,
          ctr: 4.0,
          event1s: 19,
          cpaEvent1: 60,
          cvrEvent1: 1.25,
          event2s: 13,
          cpaEvent2: 87.69,
          cvrEvent2: 0.86,
          purchases: 7,
          cpaPurchase: 162.86,
          cvrPurchase: 0.46,
          purchaseValue: 10260,
          roas: 9.0
        }
      ]
    },
    {
      id: 15,
      enabled: true,
      platform: 'Meta',
      campaign: 'Facebook Ads - Carousel Ads',
      adAccount: 'Meta Business Account (9876543210)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 260,
      suggestedBudget: 260,
      budgetReason: {
        type: 'maintain',
        reasons: [
          'Carousel swipe rate 65%',
          'Multiple cards showing good engagement',
          'Consistent performance across cards'
        ],
        detailedReason: 'Carousel campaign performing consistently well. Maintain current budget.',
        metrics: { roi: 3.8, change: '+5%', costChange: '-3%' }
      },
      spend: 1560,
      impressions: 62400,
      cpm: 25,
      clicks: 1872,
      cpc: 0.83,
      ctr: 3.0,
      event1s: 20,
      cpaEvent1: 78,
      cvrEvent1: 1.07,
      event2s: 14,
      cpaEvent2: 111.43,
      cvrEvent2: 0.75,
      purchases: 5,
      cpaPurchase: 312,
      cvrPurchase: 0.27,
      purchaseValue: 7020,
      roas: 4.5,
      expanded: false,
      adsets: [
        {
          id: '15-1',
          name: 'Adset 1 - Carousel A',
          enabled: true,
          status: 'Active',
          dailyBudget: 130,
          suggestedBudget: 130,
          budgetReason: null,
          locations: ['EG'],
          spend: 780,
          impressions: 31200,
          cpm: 25,
          clicks: 936,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 10,
          cpaEvent1: 78,
          cvrEvent1: 1.07,
          event2s: 7,
          cpaEvent2: 111.43,
          cvrEvent2: 0.75,
          purchases: 3,
          cpaPurchase: 260,
          cvrPurchase: 0.32,
          purchaseValue: 3510,
          roas: 4.5
        },
        {
          id: '15-2',
          name: 'Adset 2 - Carousel B',
          enabled: true,
          status: 'Active',
          dailyBudget: 130,
          suggestedBudget: 130,
          budgetReason: null,
          locations: ['SA'],
          spend: 780,
          impressions: 31200,
          cpm: 25,
          clicks: 936,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 10,
          cpaEvent1: 78,
          cvrEvent1: 1.07,
          event2s: 7,
          cpaEvent2: 111.43,
          cvrEvent2: 0.75,
          purchases: 2,
          cpaPurchase: 390,
          cvrPurchase: 0.21,
          purchaseValue: 3510,
          roas: 4.5
        }
      ]
    },
    {
      id: 16,
      enabled: false,
      platform: 'Google',
      campaign: 'Search Ads - Competitor Targeting',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Paused',
      budgetLevel: 'adset',
      dailyBudget: 290,
      suggestedBudget: 290,
      budgetReason: null,
      spend: 1740,
      impressions: 58000,
      cpm: 30,
      clicks: 1740,
      cpc: 1.0,
      ctr: 3.0,
      event1s: 21,
      cpaEvent1: 82.86,
      cvrEvent1: 1.21,
      event2s: 14,
      cpaEvent2: 124.29,
      cvrEvent2: 0.80,
      purchases: 6,
      cpaPurchase: 290,
      cvrPurchase: 0.34,
      purchaseValue: 13050,
      roas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '16-1',
          name: 'Adset 1 - Competitor A',
          enabled: false,
          status: 'Paused',
          dailyBudget: 145,
          suggestedBudget: 130,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'Competitor keywords expensive',
              'Conversion rate below target',
              'Focus on brand keywords instead'
            ],
            detailedReason: 'Competitor targeting showing diminishing returns.',
            metrics: { roi: 6.5, change: '-12%', costChange: '+8%' }
          },
          locations: ['CH'],
          spend: 870,
          impressions: 29000,
          cpm: 30,
          clicks: 870,
          cpc: 1.0,
          ctr: 3.0,
          event1s: 11,
          cpaEvent1: 79.09,
          cvrEvent1: 1.26,
          event2s: 7,
          cpaEvent2: 124.29,
          cvrEvent2: 0.80,
          purchases: 3,
          cpaPurchase: 290,
          cvrPurchase: 0.34,
          purchaseValue: 6525,
          roas: 7.5
        },
        {
          id: '16-2',
          name: 'Adset 2 - Competitor B',
          enabled: false,
          status: 'Paused',
          dailyBudget: 145,
          suggestedBudget: 145,
          budgetReason: null,
          locations: ['AT'],
          spend: 870,
          impressions: 29000,
          cpm: 30,
          clicks: 870,
          cpc: 1.0,
          ctr: 3.0,
          event1s: 10,
          cpaEvent1: 87,
          cvrEvent1: 1.15,
          event2s: 7,
          cpaEvent2: 124.29,
          cvrEvent2: 0.80,
          purchases: 3,
          cpaPurchase: 290,
          cvrPurchase: 0.34,
          purchaseValue: 6525,
          roas: 7.5
        }
      ]
    },
    {
      id: 17,
      enabled: true,
      platform: 'TikTok',
      campaign: 'TikTok Ads - Product Demo',
      adAccount: 'TikTok Ads Account (5555555555)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 330,
      suggestedBudget: 330,
      budgetReason: {
        type: 'maintain',
        reasons: [
          'Product demo videos getting high engagement',
          'Average watch time 45 seconds',
          'Consistent conversion rate'
        ],
        detailedReason: 'Product demo campaign performing steadily. Maintain current budget.',
        metrics: { roi: 3.5, change: '+8%', costChange: '-6%' }
      },
      spend: 1980,
      impressions: 99000,
      cpm: 20,
      clicks: 2970,
      cpc: 0.67,
      ctr: 3.0,
      event1s: 30,
      cpaEvent1: 66,
      cvrEvent1: 1.01,
      event2s: 20,
      cpaEvent2: 99,
      cvrEvent2: 0.67,
      purchases: 10,
      cpaPurchase: 198,
      cvrPurchase: 0.34,
      purchaseValue: 14850,
      roas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '17-1',
          name: 'Adset 1 - Demo A',
          enabled: true,
          status: 'Active',
          dailyBudget: 165,
          suggestedBudget: 165,
          budgetReason: null,
          locations: ['VN'],
          spend: 990,
          impressions: 49500,
          cpm: 20,
          clicks: 1485,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 15,
          cpaEvent1: 66,
          cvrEvent1: 1.01,
          event2s: 10,
          cpaEvent2: 99,
          cvrEvent2: 0.67,
          purchases: 5,
          cpaPurchase: 198,
          cvrPurchase: 0.34,
          purchaseValue: 7425,
          roas: 7.5
        },
        {
          id: '17-2',
          name: 'Adset 2 - Demo B',
          enabled: true,
          status: 'Active',
          dailyBudget: 165,
          suggestedBudget: 165,
          budgetReason: null,
          locations: ['PH'],
          spend: 990,
          impressions: 49500,
          cpm: 20,
          clicks: 1485,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 15,
          cpaEvent1: 66,
          cvrEvent1: 1.01,
          event2s: 10,
          cpaEvent2: 99,
          cvrEvent2: 0.67,
          purchases: 5,
          cpaPurchase: 198,
          cvrPurchase: 0.34,
          purchaseValue: 7425,
          roas: 7.5
        }
      ]
    },
    {
      id: 18,
      enabled: true,
      platform: 'Google',
      campaign: 'Local Services Ads - Lead Gen',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'adset',
      dailyBudget: 320,
      suggestedBudget: 320,
      budgetReason: null,
      spend: 1920,
      impressions: 64000,
      cpm: 30,
      clicks: 1920,
      cpc: 1.0,
      ctr: 3.0,
      event1s: 24,
      cpaEvent1: 80,
      cvrEvent1: 1.25,
      event2s: 16,
      cpaEvent2: 120,
      cvrEvent2: 0.83,
      purchases: 8,
      cpaPurchase: 240,
      cvrPurchase: 0.42,
      purchaseValue: 14400,
      roas: 7.5,
      expanded: false,
      adsets: [
        {
          id: '18-1',
          name: 'Adset 1 - Service A',
          enabled: true,
          status: 'Active',
          dailyBudget: 160,
          suggestedBudget: 180,
          budgetReason: {
            type: 'increase',
            reasons: [
              'High lead quality score',
              'Local search volume increased',
              'Strong conversion rate'
            ],
            detailedReason: 'Service A showing excellent lead generation performance.',
            metrics: { roi: 8.0, change: '+20%', costChange: '-12%' }
          },
          locations: ['PL'],
          spend: 960,
          impressions: 32000,
          cpm: 30,
          clicks: 960,
          cpc: 1.0,
          ctr: 3.0,
          event1s: 12,
          cpaEvent1: 80,
          cvrEvent1: 1.25,
          event2s: 8,
          cpaEvent2: 120,
          cvrEvent2: 0.83,
          purchases: 4,
          cpaPurchase: 240,
          cvrPurchase: 0.42,
          purchaseValue: 7200,
          roas: 7.5
        },
        {
          id: '18-2',
          name: 'Adset 2 - Service B',
          enabled: true,
          status: 'Active',
          dailyBudget: 160,
          suggestedBudget: 140,
          budgetReason: {
            type: 'decrease',
            reasons: [
              'Lead quality slightly lower',
              'Cost per lead elevated',
              'Optimize targeting parameters'
            ],
            detailedReason: 'Service B performance can be improved.',
            metrics: { roi: 7.0, change: '-10%', costChange: '+5%' }
          },
          locations: ['CZ'],
          spend: 960,
          impressions: 32000,
          cpm: 30,
          clicks: 960,
          cpc: 1.0,
          ctr: 3.0,
          event1s: 12,
          cpaEvent1: 80,
          cvrEvent1: 1.25,
          event2s: 8,
          cpaEvent2: 120,
          cvrEvent2: 0.83,
          purchases: 4,
          cpaPurchase: 240,
          cvrPurchase: 0.42,
          purchaseValue: 7200,
          roas: 7.5
        }
      ]
    },
    {
      id: 19,
      enabled: false,
      platform: 'Meta',
      campaign: 'Facebook Ads - Seasonal Sale',
      adAccount: 'Meta Business Account (9876543210)',
      status: 'Paused',
      budgetLevel: 'campaign',
      dailyBudget: 400,
      suggestedBudget: 320,
      budgetReason: {
        type: 'decrease',
        reasons: [
          'Seasonal sale ended',
          'Conversion rate dropped post-sale',
          'Reduce budget until next campaign'
        ],
        detailedReason: 'Seasonal sale campaign completed. Reduce budget.',
        metrics: { roi: 4.0, change: '-20%', costChange: '+10%' }
      },
      spend: 2400,
      impressions: 96000,
      cpm: 25,
      clicks: 2880,
      cpc: 0.83,
      ctr: 3.0,
      event1s: 29,
      cpaEvent1: 82.76,
      cvrEvent1: 1.01,
      event2s: 19,
      cpaEvent2: 126.32,
      cvrEvent2: 0.66,
      purchases: 8,
      cpaPurchase: 300,
      cvrPurchase: 0.28,
      purchaseValue: 10800,
      roas: 4.5,
      expanded: false,
      adsets: [
        {
          id: '19-1',
          name: 'Adset 1 - Sale A',
          enabled: false,
          status: 'Paused',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          locations: ['TR'],
          spend: 1200,
          impressions: 48000,
          cpm: 25,
          clicks: 1440,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 15,
          cpaEvent1: 80,
          cvrEvent1: 1.04,
          event2s: 10,
          cpaEvent2: 120,
          cvrEvent2: 0.69,
          purchases: 4,
          cpaPurchase: 300,
          cvrPurchase: 0.28,
          purchaseValue: 5400,
          roas: 4.5
        },
        {
          id: '19-2',
          name: 'Adset 2 - Sale B',
          enabled: false,
          status: 'Paused',
          dailyBudget: 200,
          suggestedBudget: 200,
          budgetReason: null,
          locations: ['GR'],
          spend: 1200,
          impressions: 48000,
          cpm: 25,
          clicks: 1440,
          cpc: 0.83,
          ctr: 3.0,
          event1s: 14,
          cpaEvent1: 85.71,
          cvrEvent1: 0.97,
          event2s: 9,
          cpaEvent2: 133.33,
          cvrEvent2: 0.63,
          purchases: 4,
          cpaPurchase: 300,
          cvrPurchase: 0.28,
          purchaseValue: 5400,
          roas: 4.5
        }
      ]
    },
    {
      id: 20,
      enabled: true,
      platform: 'Google',
      campaign: 'Smart Shopping - Automated',
      adAccount: 'Google Ads Account (1234567890)',
      status: 'Active',
      budgetLevel: 'campaign',
      dailyBudget: 480,
      suggestedBudget: 600,
      budgetReason: {
        type: 'increase',
        reasons: [
          'Smart bidding optimization working well',
          'ROAS increased to 9.5X',
          'Automated performance strong'
        ],
        detailedReason: 'Smart Shopping campaign showing excellent automated performance. Increase budget.',
        metrics: { roi: 9.5, change: '+25%', costChange: '-18%' }
      },
      spend: 2880,
      impressions: 144000,
      cpm: 20,
      clicks: 4320,
      cpc: 0.67,
      ctr: 3.0,
      event1s: 52,
      cpaEvent1: 55.38,
      cvrEvent1: 1.20,
      event2s: 35,
      cpaEvent2: 82.29,
      cvrEvent2: 0.81,
      purchases: 18,
      cpaPurchase: 160,
      cvrPurchase: 0.42,
      purchaseValue: 31200,
      roas: 10.83,
      expanded: false,
      adsets: [
        {
          id: '20-1',
          name: 'Adset 1 - Smart A',
          enabled: true,
          status: 'Active',
          dailyBudget: 240,
          suggestedBudget: 240,
          budgetReason: null,
          locations: ['HU'],
          spend: 1440,
          impressions: 72000,
          cpm: 20,
          clicks: 2160,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 26,
          cpaEvent1: 55.38,
          cvrEvent1: 1.20,
          event2s: 18,
          cpaEvent2: 80,
          cvrEvent2: 0.83,
          purchases: 9,
          cpaPurchase: 160,
          cvrPurchase: 0.42,
          purchaseValue: 15600,
          roas: 10.83
        },
        {
          id: '20-2',
          name: 'Adset 2 - Smart B',
          enabled: true,
          status: 'Active',
          dailyBudget: 240,
          suggestedBudget: 240,
          budgetReason: null,
          locations: ['RO'],
          spend: 1440,
          impressions: 72000,
          cpm: 20,
          clicks: 2160,
          cpc: 0.67,
          ctr: 3.0,
          event1s: 26,
          cpaEvent1: 55.38,
          cvrEvent1: 1.20,
          event2s: 17,
          cpaEvent2: 84.71,
          cvrEvent2: 0.79,
          purchases: 9,
          cpaPurchase: 160,
          cvrPurchase: 0.42,
          purchaseValue: 15600,
          roas: 10.83
        }
      ]
    }
  ])

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    const sorted = [...campaigns].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.direction === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
    return sorted
  }, [campaigns, sortConfig])

  // Get paginated campaigns
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedCampaigns.slice(startIndex, endIndex)
  }, [sortedCampaigns, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(campaigns.length / itemsPerPage)

  // Calculate summary data
  const summaryData = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.enabled)
    const activeAdsets = activeCampaigns.flatMap(c => c.adsets.filter(a => a.enabled))
    
    // Calculate total daily budget for active campaigns and adsets
    const totalDailyBudget = campaigns.reduce((sum, c) => {
      if (!c.enabled) return sum
      if (c.budgetLevel === 'campaign') {
        return sum + c.dailyBudget
      } else {
        const activeAdsetBudget = c.adsets
          .filter(a => a.enabled)
          .reduce((adsetSum, a) => adsetSum + a.dailyBudget, 0)
        return sum + activeAdsetBudget
      }
    }, 0)
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalSpend: campaigns.reduce((sum, c) => sum + c.spend, 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      avgCPM: campaigns.reduce((sum, c) => sum + c.cpm, 0) / campaigns.length,
      avgCPC: campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length,
      avgCTR: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
      totalEvent1s: campaigns.reduce((sum, c) => sum + c.event1s, 0),
      avgCPAEvent1: campaigns.reduce((sum, c) => sum + c.cpaEvent1, 0) / campaigns.length,
      avgCVREvent1: campaigns.reduce((sum, c) => sum + c.cvrEvent1, 0) / campaigns.length,
      totalEvent2s: campaigns.reduce((sum, c) => sum + c.event2s, 0),
      avgCPAEvent2: campaigns.reduce((sum, c) => sum + c.cpaEvent2, 0) / campaigns.length,
      avgCVREvent2: campaigns.reduce((sum, c) => sum + c.cvrEvent2, 0) / campaigns.length,
      totalPurchases: campaigns.reduce((sum, c) => sum + c.purchases, 0),
      avgCPAPurchase: campaigns.reduce((sum, c) => sum + c.cpaPurchase, 0) / campaigns.length,
      avgCVRPurchase: campaigns.reduce((sum, c) => sum + c.cvrPurchase, 0) / campaigns.length,
      totalPurchaseValue: campaigns.reduce((sum, c) => sum + c.purchaseValue, 0),
      avgROAS: campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length,
      totalDailyBudget
    }
  }, [campaigns])

  // Auto-apply all pending recommendations when autoExecuteRecommendations is enabled
  useEffect(() => {
    if (autoExecuteRecommendations) {
      campaigns.forEach(campaign => {
        const status = budgetStatus[campaign.id] || 'pending'
        if (status === 'pending' && campaign.status !== 'Paused') {
          onBudgetStatusChange(prev => ({ 
            ...prev, 
            [campaign.id]: 'auto_applied' 
          }))
        }
        
        // Auto-apply adset recommendations (for all adsets with budget recommendations)
        campaign.adsets.forEach(adset => {
          const adsetStatus = budgetStatus[adset.id] || 'pending'
          if (adsetStatus === 'pending' && adset.status !== 'Paused' && adset.budgetReason) {
            onBudgetStatusChange(prev => ({ 
              ...prev, 
              [adset.id]: 'auto_applied' 
            }))
          }
        })
      })
    }
  }, [autoExecuteRecommendations, budgetStatus])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const toggleCampaign = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { 
        ...c, 
        enabled: !c.enabled,
        status: c.enabled ? 'Paused' : 'Active',
        // Campaign 暂停时，自动暂停所有启用的 Ad Set，并标记为自动暂停
        // 已经手动暂停的 Ad Set 不设置标记
        // Campaign 启用时，只启用之前因为 Campaign 暂停而自动暂停的 Ad Set
        adsets: c.enabled 
          ? c.adsets.map(a => ({
              ...a,
              enabled: false,
              status: 'Paused',
              // 只对当前启用的 Ad Set 设置标记，手动暂停的不标记
              pausedByCampaign: a.enabled ? true : (a.pausedByCampaign || false)
            }))
          : c.adsets.map(a => ({
              ...a,
              // 只启用之前因为 Campaign 暂停而自动暂停的 Ad Set
              enabled: a.pausedByCampaign ? true : a.enabled,
              status: a.pausedByCampaign ? 'Active' : a.status,
              pausedByCampaign: false // 清除标记
            }))
      } : c
    ))
  }

  const toggleExpand = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, expanded: !c.expanded } : c
    ))
  }

  const toggleAdset = (campaignId, adsetId) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? {
            ...c,
            adsets: c.adsets.map(a => 
              a.id === adsetId ? { 
                ...a, 
                enabled: !a.enabled,
                status: a.enabled ? 'Paused' : 'Active'
              } : a
            )
          }
        : c
    ))
    // Ad Set 暂停时，不影响 Campaign 状态（不自动暂停 Campaign）
  }

  const handleApprove = (id) => {
    onBudgetStatusChange(prev => ({ 
      ...prev, 
      [id]: autoExecuteRecommendations ? 'auto_applied' : 'approved' 
    }))
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
      case 'auto_applied':
        return <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Auto-applied</span>
      case 'rejected':
        return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Rejected</span>
      case 'invalid_modified':
        return <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Invalid (Modified)</span>
      default:
        return null
    }
  }

  const getBudgetChangeInfo = (suggestedBudget, currentBudget) => {
    if (suggestedBudget > currentBudget) {
      return {
        icon: <TrendingUp size={14} className="text-red-600" />,
        colorClass: 'text-red-600 font-semibold',
        change: 'increase'
      }
    } else if (suggestedBudget < currentBudget) {
      return {
        icon: <TrendingDown size={14} className="text-green-600" />,
        colorClass: 'text-green-600 font-semibold',
        change: 'decrease'
      }
    } else {
      return {
        icon: <Minus size={14} className="text-gray-500" />,
        colorClass: 'text-gray-500 font-semibold',
        change: 'maintain'
      }
    }
  }

  const getCampaignLocations = (campaign) => {
    const allLocations = campaign.adsets.flatMap(adset => adset.locations || [])
    const uniqueLocations = [...new Set(allLocations)]
    return uniqueLocations
  }

  const LocationTags = ({ locations, maxVisible = 3 }) => {
    if (!locations || locations.length === 0) return <span className="text-xs text-gray-400">-</span>
    
    const visibleLocations = locations.slice(0, maxVisible)
    const hasMore = locations.length > maxVisible
    
    return (
      <div className="group relative">
        <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
          {visibleLocations.map((loc, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {loc}
            </span>
          ))}
          {hasMore && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
              +{locations.length - maxVisible}
            </span>
          )}
        </div>
        {hasMore && (
          <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs">
            <div className="flex flex-wrap gap-1">
              {locations.map((loc, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const ConversionGoalTag = ({ goal }) => {
    if (!goal) return <span className="text-xs text-gray-400">-</span>
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
        {goal}
      </span>
    )
  }

  // Component for displaying metric with secondary metric in parentheses
  const MetricDisplay = ({ primary, secondary, isPercentage = false, showAvgPrefix = false, isROAS = false }) => {
    return (
      <div className="flex flex-col items-start">
        <span className="font-medium text-gray-900 text-xs">
          {showAvgPrefix && 'Avg. '}{primary}
        </span>
        {secondary !== undefined && (
          <span className="text-[10px] text-gray-400">
            {isROAS ? `${secondary.toFixed(2)}X` : (isPercentage ? `${secondary.toFixed(2)}%` : secondary)}
          </span>
        )}
      </div>
    )
  }

  // Sortable header component - always show sort icon
  const SortableHeader = ({ children, sortKey, className }) => {
    const isSorted = sortConfig.key === sortKey
    const sortIcon = isSorted ? (
      sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDownIcon size={12} />
    ) : (
      <ChevronDownIcon size={12} className="text-gray-300" />
    )
    
    return (
      <th 
        onClick={() => handleSort(sortKey)}
        className={`${className} cursor-pointer hover:bg-gray-100 transition-colors select-none`}
      >
        <div className="flex items-center gap-1">
          {children}
          <span className={isSorted ? 'text-primary' : 'text-gray-300'}>{sortIcon}</span>
        </div>
      </th>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[60px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Off/On
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[180px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Campaign
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[200px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Ad Account
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[120px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Locations
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[100px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Conv. goal
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[100px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Daily Budget
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[100px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Recommended budget
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[250px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Optimize reason
              </th>
              <SortableHeader sortKey="spend" className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[90px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Spend
              </SortableHeader>
              <SortableHeader sortKey="impressions" className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[100px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Impressions
              </SortableHeader>
              <SortableHeader sortKey="cpm" className="px-2 py-2 text-center text-xs font-medium text-gray-600 min-w-[70px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                CPM
              </SortableHeader>
              <SortableHeader sortKey="clicks" className="px-2 py-2 text-left text-xs font-medium text-gray-600 min-w-[70px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Clicks
              </SortableHeader>
              <SortableHeader sortKey="cpc" className="px-2 py-2 text-center text-xs font-medium text-gray-600 min-w-[80px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                <div className="flex flex-col items-center">
                  <span>CPC</span>
                  <span className="text-[10px] text-gray-400">(CTR)</span>
                </div>
              </SortableHeader>
              <SortableHeader sortKey="event1s" className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[80px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Event1s
              </SortableHeader>
              <SortableHeader sortKey="cpaEvent1" className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[120px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                <div className="flex flex-col items-center">
                  <span>CPA-Event1</span>
                  <span className="text-[10px] text-gray-400">(CVR)</span>
                </div>
              </SortableHeader>
              <SortableHeader sortKey="event2s" className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[80px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Event2s
              </SortableHeader>
              <SortableHeader sortKey="cpaEvent2" className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[120px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                <div className="flex flex-col items-center">
                  <span>CPA-Event2</span>
                  <span className="text-[10px] text-gray-400">(CVR)</span>
                </div>
              </SortableHeader>
              <SortableHeader sortKey="purchases" className="px-2 py-2 text-left text-xs font-bold text-primary min-w-[80px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                Purchases
              </SortableHeader>
              <SortableHeader sortKey="cpaPurchase" className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[120px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                <div className="flex flex-col items-center">
                  <span>CPA-Purchase</span>
                  <span className="text-[10px] text-gray-400">(CVR)</span>
                </div>
              </SortableHeader>
              <SortableHeader sortKey="purchaseValue" className="px-2 py-2 text-center text-xs font-bold text-primary min-w-[130px] sticky top-0 bg-gray-50 z-10 shadow-sm">
                <div className="flex flex-col items-center">
                  <span>Purchase Value</span>
                  <span className="text-[10px] text-gray-400">(ROAS)</span>
                </div>
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Summary row */}
            <tr className="bg-primary/5 hover:bg-primary/10 transition-colors">
              <td className="px-2 py-2 font-bold text-primary text-xs">
                Totals
              </td>
              <td className="px-2 py-2 text-xs text-gray-600">
                {summaryData.activeCampaigns} / {summaryData.totalCampaigns} Active
              </td>
              <td className="px-2 py-2 text-xs text-gray-400">
                --
              </td>
              <td className="px-2 py-2 text-xs text-gray-400">
                --
              </td>
              <td className="px-2 py-2 text-xs text-gray-400">
                --
              </td>
              <td className="px-2 py-2 font-bold text-gray-900 text-xs">
                {formatCurrency(summaryData.totalDailyBudget)}
              </td>
              <td colSpan="2" className="px-2 py-2 text-center">
                <div className="flex flex-col items-center leading-[1.1]">
                  <span className="text-xs font-semibold italic">Real-time dynamic analysis</span>
                  <span className="text-[10px] text-gray-400">(Updated: January 4, 2026, 13:24:56)</span>
                </div>
              </td>
              <td className="px-2 py-2 font-bold text-gray-900 text-xs">
                {formatCurrency(summaryData.totalSpend)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600">
                {formatNumber(summaryData.totalImpressions)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[9px] text-gray-400">Avg.</span>
                  <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.avgCPM)}</span>
                </div>
              </td>
              <td className="px-2 py-2 text-xs text-gray-600">
                {formatNumber(summaryData.totalClicks)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-400">Avg.</span>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.avgCPC)}</span>
                    <span className="text-[10px] text-gray-400">{summaryData.avgCTR.toFixed(2)}%</span>
                  </div>
                </div>
              </td>
              <td className="px-2 py-2 font-bold text-gray-900 text-xs">
                {formatNumber(summaryData.totalEvent1s)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-400">Avg.</span>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.avgCPAEvent1)}</span>
                    <span className="text-[10px] text-gray-400">{summaryData.avgCVREvent1.toFixed(2)}%</span>
                  </div>
                </div>
              </td>
              <td className="px-2 py-2 font-bold text-gray-900 text-xs">
                {formatNumber(summaryData.totalEvent2s)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-400">Avg.</span>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.avgCPAEvent2)}</span>
                    <span className="text-[10px] text-gray-400">{summaryData.avgCVREvent2.toFixed(2)}%</span>
                  </div>
                </div>
              </td>
              <td className="px-2 py-2 font-bold text-gray-900 text-xs">
                {formatNumber(summaryData.totalPurchases)}
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-400">Avg.</span>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.avgCPAPurchase)}</span>
                    <span className="text-[10px] text-gray-400">{summaryData.avgCVRPurchase.toFixed(2)}%</span>
                  </div>
                </div>
              </td>
              <td className="px-2 py-2 text-xs text-gray-600 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-900 text-xs">{formatCurrency(summaryData.totalPurchaseValue)}</span>
                  <span className="text-[10px] text-gray-400">{summaryData.avgROAS.toFixed(2)}X</span>
                </div>
              </td>
            </tr>
            
            {paginatedCampaigns.map((campaign) => {
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
                    <td className="px-2 py-2">
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-0.5">
                          {campaign.platform && getPlatformLogo(campaign.platform)}
                        </div>
                        <span 
                          className="font-medium text-gray-900 text-xs truncate block max-w-[160px]"
                          title={campaign.campaign}
                        >
                          {campaign.campaign}
                        </span>
                        <div className="mt-0.5">
                          <span className={`badge ${
                            campaign.status === 'Active' ? 'badge-success' :
                            campaign.status === 'Paused' ? 'badge-warning' :
                            'badge-gray'
                          }`}>
                            {campaign.status}
                          </span>
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
                      <div className="text-xs text-gray-600 font-medium">
                        {campaign.adAccount}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <LocationTags locations={getCampaignLocations(campaign)} />
                    </td>
                    <td className="px-2 py-3">
                      <ConversionGoalTag goal="Sales" />
                    </td>
                    <td className="px-2 py-3">
                      {campaign.budgetLevel === 'campaign' ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.dailyBudget)}</span>
                          {campaign.status === 'Active' && (
                            <button
                              onClick={() => onBudgetEditClick && onBudgetEditClick(campaign)}
                              className="text-gray-400 hover:text-primary transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-gray-700 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          ABO (Adset Budget)
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      {campaign.budgetLevel === 'campaign' ? (
                        campaign.status === 'Paused' ? (
                          <div className="text-xs text-gray-400 font-semibold">
                            --
                          </div>
                        ) : (
                          <div className={`${status !== 'pending' ? 'opacity-50' : ''}`}>
                            {(() => {
                              const budgetChange = getBudgetChangeInfo(campaign.suggestedBudget, campaign.dailyBudget)
                              return (
                                <div className="flex flex-col items-start gap-2">
                                  <div className="flex items-center gap-1">
                                    {budgetChange.icon}
                                    <span className={`text-xs font-bold ${budgetChange.colorClass}`}>
                                      {formatCurrency(campaign.suggestedBudget)}
                                    </span>
                                  </div>
                                  {campaign.status !== 'Paused' && status === 'pending' && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => handleReject(campaign.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                        title="Reject"
                                      >
                                        <ThumbsDown size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleApprove(campaign.id)}
                                        className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded hover:bg-primary-hover transition-colors"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  )}
                                  {(status === 'approved' || status === 'auto_applied' || status === 'rejected' || status === 'invalid_modified') && (
                                    <div className="flex items-center gap-1">
                                      {getStatusBadge(status)}
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </div>
                        )
                      ) : (
                        <div className="text-[10px] text-primary font-semibold italic p-2">
                          Budget suggestions in adset
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      {campaign.budgetLevel === 'campaign' ? (
                        campaign.status === 'Paused' ? (
                          <div className="text-xs text-gray-400 font-semibold">
                            --
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="flex-1 space-y-2">
                              {campaign.budgetReason.reasons.map((reason, idx) => (
                                <div key={idx} className="text-[10px] text-gray-600 flex items-start gap-0.5 mb-0.5 leading-tight">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => onMoreInsights && onMoreInsights({ 
                                ...campaign, 
                                status, 
                                handleApprove, 
                                handleReject,
                                onBudgetStatusChange 
                              })}
                              className="text-primary hover:text-primary-hover transition-colors"
                              title="More Insights"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="text-xs text-gray-500 italic">
                          Budget adjustment suggestions are available at adset level.
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {formatCurrency(campaign.spend)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatNumber(campaign.impressions)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      {formatCurrency(campaign.cpm)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600">
                      {formatNumber(campaign.clicks)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.cpc)}</span>
                        <span className="text-[10px] text-gray-400">{campaign.ctr.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {formatNumber(campaign.event1s)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.cpaEvent1)}</span>
                        <span className="text-[10px] text-gray-400">{campaign.cvrEvent1.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {formatNumber(campaign.event2s)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.cpaEvent2)}</span>
                        <span className="text-[10px] text-gray-400">{campaign.cvrEvent2.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs">
                      {formatNumber(campaign.purchases)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.cpaPurchase)}</span>
                        <span className="text-[10px] text-gray-400">{campaign.cvrPurchase.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-600 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900 text-xs">{formatCurrency(campaign.purchaseValue)}</span>
                        <span className="text-[10px] text-gray-400">{campaign.roas.toFixed(2)}X</span>
                      </div>
                    </td>
                  </tr>

                  {/* Adsets rows */}
                  {campaign.expanded && campaign.adsets.map((adset) => {
                    const adsetStatus = budgetStatus[adset.id] || 'pending'
                    return (
                      <tr key={adset.id} className={`bg-gray-50 hover:bg-gray-100 ${!adset.enabled ? 'opacity-50' : ''}`}>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => toggleAdset(campaign.id, adset.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            {adset.enabled ? (
                              <ToggleRight size={24} className="text-green-500" />
                            ) : (
                              <ToggleLeft size={24} className="text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 border-l-2 border-b-2 border-gray-400 ml-2"></div>
                            <div>
                              <div 
                                className="font-medium text-gray-700 text-xs truncate block max-w-[140px]"
                                title={adset.name}
                              >
                                {adset.name}
                              </div>
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
                                className="text-xs text-primary hover:text-primary-hover transition-colors mt-0.5"
                              >
                                View detail
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="text-xs text-gray-500 font-medium">
                            {campaign.adAccount}
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <LocationTags locations={adset.locations || []} />
                        </td>
                        <td className="px-2 py-2">
                          <ConversionGoalTag goal="Max Conversions-Purchase" />
                        </td>
                        <td className="px-2 py-2">
                          {campaign.budgetLevel === 'campaign' ? (
                            <span className="text-xs font-medium text-gray-700 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              CBO (Campaign Budget)
                            </span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.dailyBudget)}</span>
                              {adset.status === 'Active' && (
                                <button
                                  onClick={() => onBudgetEditClick && onBudgetEditClick({ ...adset, isAdset: true, parentCampaign: campaign })}
                                  className="text-gray-400 hover:text-primary transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                              )}
                            </div>
                          )}  
                        </td>
                        <td className="px-2 py-2">
                          {campaign.budgetLevel === 'campaign' ? (
                            <div className="text-[10px] text-gray-500 italic">
                              Intelligent budget allocation to more advantageous adsets
                            </div>
                          ) : (
                            adset.status === 'Paused' ? (
                              <div className="text-xs text-gray-400 font-semibold">
                                --
                              </div>
                            ) : (
                              adset.budgetReason && (
                                <div className={`${adsetStatus !== 'pending' ? 'opacity-50' : ''}`}>
                                  {(() => {
                                    const budgetChange = getBudgetChangeInfo(adset.suggestedBudget, adset.dailyBudget)
                                    return (
                                      <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-center gap-1">
                                          {budgetChange.icon}
                                          <span className={`text-xs font-bold ${budgetChange.colorClass}`}>
                                            {formatCurrency(adset.suggestedBudget)}
                                          </span>
                                        </div>
                                        {adset.status !== 'Paused' && adsetStatus === 'pending' && (
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() => handleReject(adset.id)}
                                              className="text-gray-400 hover:text-red-600 transition-colors"
                                              title="Reject"
                                            >
                                              <ThumbsDown size={14} />
                                            </button>
                                            <button
                                              onClick={() => handleApprove(adset.id)}
                                              className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded hover:bg-primary-hover transition-colors"
                                            >
                                              Approve
                                            </button>
                                            </div>
                                        )}
                                        {(adsetStatus === 'approved' || adsetStatus === 'auto_applied' || adsetStatus === 'rejected' || adsetStatus === 'invalid_modified') && (
                                          <div className="flex items-center gap-1">
                                            {getStatusBadge(adsetStatus)}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              )
                            )
                          )}  
                        </td>
                        <td className="px-2 py-2">
                          {adset.status === 'Paused' ? (
                            <div className="text-xs text-gray-400 font-semibold">
                              --
                            </div>
                          ) : (
                            adset.budgetReason ? (
                              <div className="flex items-center gap-1">
                                <div className="flex-1 space-y-2">
                                  {adset.budgetReason.reasons.map((reason, idx) => (
                                    <div key={idx} className="text-[10px] text-gray-600 flex items-start gap-0.5 mb-0.5 leading-tight">
                                      <span className="text-primary mt-0.5">•</span>
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => onMoreInsights && onMoreInsights({ 
                                    ...adset, 
                                    status: adsetStatus, 
                                    handleApprove, 
                                    handleReject,
                                    onBudgetStatusChange 
                                  })}
                                  className="text-primary hover:text-primary-hover transition-colors"
                                  title="More Insights"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500 italic">
                                No budget adjustment suggestions.
                              </div>
                            )
                          )}
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {formatCurrency(adset.spend)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatNumber(adset.impressions)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          {formatCurrency(adset.cpm)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600">
                          {formatNumber(adset.clicks)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.cpc)}</span>
                            <span className="text-[10px] text-gray-400">{adset.ctr.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {formatNumber(adset.event1s)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.cpaEvent1)}</span>
                            <span className="text-[10px] text-gray-400">{adset.cvrEvent1.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {formatNumber(adset.event2s)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.cpaEvent2)}</span>
                            <span className="text-[10px] text-gray-400">{adset.cvrEvent2.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700 text-xs">
                          {formatNumber(adset.purchases)}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.cpaPurchase)}</span>
                            <span className="text-[10px] text-gray-400">{adset.cvrPurchase.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700 text-xs">{formatCurrency(adset.purchaseValue)}</span>
                            <span className="text-[10px] text-gray-400">{adset.roas.toFixed(2)}X</span>
                          </div>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, campaigns.length)} of {campaigns.length} campaigns
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
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
