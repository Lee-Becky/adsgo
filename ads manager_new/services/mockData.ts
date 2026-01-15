
import { Campaign, Platform, DailyData, Goal, OptimizationRule } from '../types';

const generateHistory = (days: number, baseBudget: number): DailyData[] => {
  const history: DailyData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const trendFactor = 1 + (Math.sin(i / 2) * 0.2); 
    const spend = (baseBudget * 0.8) + Math.random() * (baseBudget * 0.4);
    const impressions = spend * (40 + Math.random() * 20);
    const clicks = impressions * (0.01 + Math.random() * 0.015);
    const conversions = clicks * (0.05 + Math.random() * 0.05) * trendFactor;
    const purchases = conversions * (0.3 + Math.random() * 0.4);
    const revenue = purchases * (80 + Math.random() * 40);
    
    history.push({
      date: date.toISOString().split('T')[0],
      budget: baseBudget,
      spend,
      impressions,
      clicks,
      conversions,
      purchases,
      revenue,
      roas: revenue / spend,
      cpc: spend / clicks,
      cpa: spend / conversions,
      cpp: spend / purchases,
      operation: i === 5 ? '预算提升 15%' : (i === 10 ? '受众扩量' : undefined)
    });
  }
  return history;
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: '夏季大促 - 核心受众',
    accountName: 'Meta_Global_Main',
    platform: Platform.META,
    status: 'active',
    currentBudget: 1200,
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 850, impressions: 42000, clicks: 1240, conversions: 45, purchases: 32, revenue: 3200, roas: 3.76, cpc: 0.68, cpa: 18.88, cpp: 26.56
    },
    history: generateHistory(14, 1200)
  },
  {
    id: 'c2',
    name: '品牌增长 - 潜在客户',
    accountName: 'Meta_Global_Main',
    platform: Platform.META,
    status: 'active',
    currentBudget: 2500,
    country: 'IN',
    objective: 'Traffic',
    todayMetrics: {
      spend: 1800, impressions: 85000, clicks: 3500, conversions: 110, purchases: 25, revenue: 4500, roas: 2.5, cpc: 0.51, cpa: 16.36, cpp: 72.00
    },
    history: generateHistory(14, 2500)
  },
  {
    id: 'c3',
    name: '搜索词扩充计划',
    accountName: 'Google_Search_US',
    platform: Platform.GOOGLE,
    status: 'active',
    currentBudget: 3000,
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 2100, impressions: 55000, clicks: 4200, conversions: 180, purchases: 45, revenue: 6800, roas: 3.23, cpc: 0.5, cpa: 11.66, cpp: 46.66
    },
    history: generateHistory(14, 3000)
  },
  {
    id: 'c4',
    name: '新品首发视频',
    accountName: 'TikTok_Creator_Hub',
    platform: Platform.TIKTOK,
    status: 'active',
    currentBudget: 1500,
    country: 'US',
    objective: 'Purchase',
    todayMetrics: {
      spend: 1200, impressions: 250000, clicks: 8500, conversions: 240, purchases: 60, revenue: 4200, roas: 3.5, cpc: 0.14, cpa: 5.0, cpp: 20.0
    },
    history: generateHistory(14, 1500)
  }
];

export const MOCK_GOALS: Goal[] = [
  { id: 'g1', type: 'Business', country: 'US', budget: 5000, targetMetric: 'ROAS', comparison: '>', targetValue: 4.5 },
  { id: 'g2', type: 'Business', country: 'IN', budget: 3000, targetMetric: 'ROAS', comparison: '≥', targetValue: 3.5 },
  { id: 'g3', type: 'Optimization', country: 'Global', budget: 10000, targetMetric: 'CPA', comparison: '≤', targetValue: 15.0 }
];

export const MOCK_RULES: OptimizationRule[] = [
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
