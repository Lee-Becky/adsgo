// Platform enum
const Platform = {
  META: 'META',
  GOOGLE: 'GOOGLE',
  TIKTOK: 'TIKTOK'
};

const generateHistory = (days, baseBudget) => {
  const history = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const trendFactor = 1 + (Math.sin(i / 2) * 0.2); 
    const spend = (baseBudget * 0.8) + Math.random() * (baseBudget * 0.4);
    const impressions = spend * (40 + Math.random() * 20);
    const clicks = impressions * (0.01 + Math.random() * 0.015);
    
    // 新字段
    const event1s = clicks * (0.03 + Math.random() * 0.04) * trendFactor;
    const event2s = clicks * (0.02 + Math.random() * 0.03) * trendFactor;
    const purchases = event1s * (0.3 + Math.random() * 0.4);
    const revenue = purchases * (80 + Math.random() * 40);
    
    history.push({
      date: date.toISOString().split('T')[0],
      budget: baseBudget,
      spend,
      impressions,
      clicks,
      event1s,
      event2s,
      purchases,
      revenue,
      roas: revenue / spend,
      cpc: spend / clicks,
      cpaEvent1: spend / event1s,
      cpaEvent2: spend / event2s,
      cpaPurchase: spend / purchases,
      operation: i === 5 ? '预算提升 15%' : (i === 10 ? '受众扩量' : undefined)
    });
  }
  return history;
};

export const MOCK_CAMPAIGNS = [
  {
    id: 'c1',
    enabled: true,
    name: '夏季大促 - 核心受众',
    accountName: 'Meta_Global_Main',
    platform: Platform.META,
    status: 'active',
    budgetLevel: 'campaign',
    currentBudget: 1200,
    suggestedBudget: 1440,
    budgetReason: {
      type: 'increase',
      reasons: [
        '过去 72 小时内 ROAS 表现持续稳定且高于预期。',
        '在扩大目标受众范围的同时，点击成本 (CPC) 保持平稳。',
        '近期搜索查询扩展显示高转化意向用户显著增加。'
      ],
      detailedReason: '该广告系列表现出强劲的势头。当前 ROAS 比目标高出 15%。我们建议采用循序渐进的扩量策略，在保持 CPA 效率的同时捕捉更多高意向流量。漏斗中层点击到转化的效率显著提升，表明创意与受众契合度极高。'
    },
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 850, 
      impressions: 42000, 
      clicks: 1240, 
      event1s: 45, 
      event2s: 28, 
      purchases: 32, 
      revenue: 3200, 
      roas: 3.76, 
      cpc: 0.68, 
      cpaEvent1: 18.88, 
      cpaEvent2: 30.35, 
      cpaPurchase: 26.56
    },
    history: generateHistory(14, 1200),
    expanded: false,
    adsets: [
      {
        id: 'c1-a1',
        name: 'Adset 1 - 核心受众 A',
        enabled: true,
        status: 'active',
        dailyBudget: 600,
        suggestedBudget: 600,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 425, 
          impressions: 21000, 
          clicks: 620, 
          event1s: 22, 
          event2s: 14, 
          purchases: 16, 
          revenue: 1600, 
          roas: 3.76, 
          cpc: 0.68, 
          cpaEvent1: 19.32, 
          cpaEvent2: 30.35, 
          cpaPurchase: 26.56
        }
      },
      {
        id: 'c1-a2',
        name: 'Adset 2 - 核心受众 B',
        enabled: true,
        status: 'active',
        dailyBudget: 600,
        suggestedBudget: 600,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 425, 
          impressions: 21000, 
          clicks: 620, 
          event1s: 23, 
          event2s: 14, 
          purchases: 16, 
          revenue: 1600, 
          roas: 3.76, 
          cpc: 0.68, 
          cpaEvent1: 18.48, 
          cpaEvent2: 30.35, 
          cpaPurchase: 26.56
        }
      }
    ]
  },
  {
    id: 'c2',
    enabled: true,
    name: '品牌增长 - 潜在客户',
    accountName: 'Meta_Global_Main',
    platform: Platform.META,
    status: 'active',
    budgetLevel: 'adset',
    currentBudget: 2500,
    suggestedBudget: 2500,
    budgetReason: null,
    country: 'IN',
    objective: 'Traffic',
    todayMetrics: {
      spend: 1800, 
      impressions: 85000, 
      clicks: 3500, 
      event1s: 110, 
      event2s: 65, 
      purchases: 25, 
      revenue: 4500, 
      roas: 2.5, 
      cpc: 0.51, 
      cpaEvent1: 16.36, 
      cpaEvent2: 27.69, 
      cpaPurchase: 72.00
    },
    history: generateHistory(14, 2500),
    expanded: false,
    adsets: [
      {
        id: 'c2-a1',
        name: 'Adset 1 - 潜在客户 A',
        enabled: true,
        status: 'active',
        dailyBudget: 1250,
        suggestedBudget: 1500,
        budgetReason: {
          type: 'increase',
          reasons: [
            'CTR 提升了 15%，表现良好',
            '转化率提升至 3.2%',
            '建议增加预算 20%'
          ],
          detailedReason: 'Adset 1 表现出色，CTR 和转化率都有所提升。'
        },
        locations: ['IN'],
        todayMetrics: {
          spend: 900, 
          impressions: 42500, 
          clicks: 1750, 
          event1s: 55, 
          event2s: 32, 
          purchases: 12, 
          revenue: 2250, 
          roas: 2.5, 
          cpc: 0.51, 
          cpaEvent1: 16.36, 
          cpaEvent2: 28.12, 
          cpaPurchase: 75.00
        }
      },
      {
        id: 'c2-a2',
        name: 'Adset 2 - 潜在客户 B',
        enabled: true,
        status: 'active',
        dailyBudget: 1250,
        suggestedBudget: 1000,
        budgetReason: {
          type: 'decrease',
          reasons: [
            'ROI 低于目标，为 2.1',
            'CPC 高于平均水平',
            '建议减少预算 20%'
          ],
          detailedReason: 'Adset 2 表现低于目标，考虑减少预算。'
        },
        locations: ['IN'],
        todayMetrics: {
          spend: 900, 
          impressions: 42500, 
          clicks: 1750, 
          event1s: 55, 
          event2s: 33, 
          purchases: 13, 
          revenue: 2250, 
          roas: 2.5, 
          cpc: 0.51, 
          cpaEvent1: 16.36, 
          cpaEvent2: 27.27, 
          cpaPurchase: 69.23
        }
      }
    ]
  },
  {
    id: 'c3',
    enabled: true,
    name: '搜索词扩充计划',
    accountName: 'Google_Search_US',
    platform: Platform.GOOGLE,
    status: 'active',
    budgetLevel: 'campaign',
    currentBudget: 3000,
    suggestedBudget: 3600,
    budgetReason: {
      type: 'increase',
      reasons: [
        'CVR 达到 3.5%，远高于行业平均水平',
        '曝光量和点击稳步增长',
        'ROI 达到 3.5，建议扩大品牌曝光'
      ],
      detailedReason: '该广告系列的 CVR 达到 3.5%，远高于行业平均水平（2.0%）。曝光量和点击稳步增长，ROI 达到 3.5。建议将日预算从 ¥3000 增加到 ¥3600，以扩大品牌曝光。'
    },
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 2100, 
      impressions: 55000, 
      clicks: 4200, 
      event1s: 180, 
      event2s: 105, 
      purchases: 45, 
      revenue: 6800, 
      roas: 3.23, 
      cpc: 0.5, 
      cpaEvent1: 11.66, 
      cpaEvent2: 20.00, 
      cpaPurchase: 46.66
    },
    history: generateHistory(14, 3000),
    expanded: false,
    adsets: [
      {
        id: 'c3-a1',
        name: 'Adset 1 - 品牌词 A',
        enabled: true,
        status: 'active',
        dailyBudget: 1500,
        suggestedBudget: 1500,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 1050, 
          impressions: 27500, 
          clicks: 2100, 
          event1s: 90, 
          event2s: 52, 
          purchases: 22, 
          revenue: 3400, 
          roas: 3.23, 
          cpc: 0.5, 
          cpaEvent1: 11.66, 
          cpaEvent2: 20.19, 
          cpaPurchase: 47.72
        }
      },
      {
        id: 'c3-a2',
        name: 'Adset 2 - 品牌词 B',
        enabled: true,
        status: 'active',
        dailyBudget: 1500,
        suggestedBudget: 1500,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 1050, 
          impressions: 27500, 
          clicks: 2100, 
          event1s: 90, 
          event2s: 53, 
          purchases: 23, 
          revenue: 3400, 
          roas: 3.23, 
          cpc: 0.5, 
          cpaEvent1: 11.66, 
          cpaEvent2: 19.81, 
          cpaPurchase: 45.65
        }
      }
    ]
  },
  {
    id: 'c4',
    enabled: true,
    name: '新品首发视频',
    accountName: 'TikTok_Creator_Hub',
    platform: Platform.TIKTOK,
    status: 'active',
    budgetLevel: 'campaign',
    currentBudget: 1500,
    suggestedBudget: 1500,
    budgetReason: {
      type: 'maintain',
      reasons: [
        'CTR 达到 3.2%，表现优秀',
        'ROI 为 2.5，略低于目标',
        '建议保持当前预算，再观察一周后决定'
      ],
      detailedReason: '该广告系列针对年轻受众，CTR 达到 3.2%，表现优秀。ROI 为 2.5，略低于目标。建议保持当前预算，再观察一周后决定是否调整。'
    },
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 1200, 
      impressions: 250000, 
      clicks: 8500, 
      event1s: 240, 
      event2s: 140, 
      purchases: 60, 
      revenue: 4200, 
      roas: 3.5, 
      cpc: 0.14, 
      cpaEvent1: 5.0, 
      cpaEvent2: 8.57, 
      cpaPurchase: 20.0
    },
    history: generateHistory(14, 1500),
    expanded: false,
    adsets: [
      {
        id: 'c4-a1',
        name: 'Adset 1 - 年轻群体 A',
        enabled: true,
        status: 'active',
        dailyBudget: 750,
        suggestedBudget: 750,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 600, 
          impressions: 125000, 
          clicks: 4250, 
          event1s: 120, 
          event2s: 70, 
          purchases: 30, 
          revenue: 2100, 
          roas: 3.5, 
          cpc: 0.14, 
          cpaEvent1: 5.0, 
          cpaEvent2: 8.57, 
          cpaPurchase: 20.0
        }
      },
      {
        id: 'c4-a2',
        name: 'Adset 2 - 年轻群体 B',
        enabled: true,
        status: 'active',
        dailyBudget: 750,
        suggestedBudget: 750,
        budgetReason: null,
        locations: ['US'],
        todayMetrics: {
          spend: 600, 
          impressions: 125000, 
          clicks: 4250, 
          event1s: 120, 
          event2s: 70, 
          purchases: 30, 
          revenue: 2100, 
          roas: 3.5, 
          cpc: 0.14, 
          cpaEvent1: 5.0, 
          cpaEvent2: 8.57, 
          cpaPurchase: 20.0
        }
      }
    ]
  }
];

export const MOCK_GOALS = [
  { id: 'g1', type: 'Business', country: 'US', budget: 5000, targetMetric: 'ROAS', comparison: '>', targetValue: 4.5 },
  { id: 'g2', type: 'Business', country: 'IN', budget: 3000, targetMetric: 'ROAS', comparison: '≥', targetValue: 3.5 },
  { id: 'g3', type: 'Optimization', country: 'Global', budget: 10000, targetMetric: 'CPA', comparison: '≤', targetValue: 15.0 }
];

export const MOCK_RULES = [
  {
    id: 'r1',
    name: '低效闭环',
    condition: { metric: 'ROAS', period: '7d', operator: '<', value: 2.0 },
    action: { type: 'PAUSE' },
    isEnabled: true
  },
  {
    id: 'r2',
    name: '高成本预算惩罚',
    condition: { metric: 'CPA', period: 'Yesterday', operator: '>', value: 5.0 },
    action: { type: 'BUDGET_ADJUST', value: -30 },
    isEnabled: true
  }
];

export const GLOBAL_FUNNEL = [
  { name: '总花费', value: 10000 },
  { name: '曝光量', value: 500000 },
  { name: '点击量', value: 25000 },
  { name: '转化量', value: 1200 },
  { name: '购买量', value: 800 }
];

export { Platform };
