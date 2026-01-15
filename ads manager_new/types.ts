
export enum Platform {
  META = 'Meta',
  GOOGLE = 'Google',
  TIKTOK = 'TikTok'
}

export interface CampaignMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number; // Action (注册/表单)
  purchases: number;   // 购买
  revenue: number;
  roas: number;
  cpc: number;
  cpa: number;         // Action CPA
  cpp: number;         // Purchase CPP
}

export interface DailyData extends CampaignMetrics {
  date: string;
  budget: number;
  operation?: string; 
}

export interface AIAdvice {
  recommendedBudget: number;
  currentBudget: number;
  reasons: string[];
  detailedAnalysis: string;
}

export type ComparisonOperator = '≤' | '=' | '≥' | '<' | '>';

export interface Goal {
  id: string;
  type: 'Business' | 'Optimization';
  country: 'US' | 'IN' | 'Global';
  budget: number;
  targetMetric: string;
  comparison: ComparisonOperator;
  targetValue: number;
}

export interface OptimizationRule {
  id: string;
  name: string;
  condition: {
    metric: string;
    period: string;
    operator: ComparisonOperator;
    value: number;
  };
  action: {
    type: 'PAUSE' | 'BUDGET_ADJUST';
    value?: number; // 预算调整百分比，如 -30
  };
  isEnabled: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  accountName: string; // 增加账户名称
  platform: Platform;
  status: 'active' | 'paused';
  currentBudget: number;
  country: 'US' | 'IN';
  objective: 'Purchase' | 'Traffic' | 'Awareness';
  todayMetrics: CampaignMetrics;
  history: DailyData[];
  aiAdvice?: AIAdvice;
}
