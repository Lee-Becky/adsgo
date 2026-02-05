
export interface BrandInfo {
  name: string;
  logo: string;
  url: string;
  goal: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  spend?: number;
  conversions?: number;
  roas?: number;
  category?: string;
}

export interface AnalysisReport {
  summary: string;
  recommendedAudience: string;
  competitors: string[];
}

export interface Creative {
  id: string;
  url: string;
  productId?: string;
  isMain?: boolean;
}

export enum CreativeStrategy {
  NEW_24H = 'NEW_24H',
  UNUSED = 'UNUSED',
  TOP_7D = 'TOP_7D'
}

export enum AudienceType {
  LAL = 'LAL',
  INT = 'INT',
  ADVANTAGE = 'ADV'
}

export enum LalOption {
  PURCHASE_1 = 'US Purchase 1%',
  ATC_5 = 'US add to cart 5%',
  REG_30D = 'US register last30days 1%~3%'
}

export enum BudgetType {
  CBO = 'CBO',
  ABO = 'ABO'
}

export enum StructureStrategy {
  PER_PRODUCT = 'PER_PRODUCT',
  PER_CATEGORY = 'PER_CATEGORY',
  BY_AD_COUNT = 'BY_AD_COUNT'
}

export enum LandingPageType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY'
}

export enum AdCopyStrategy {
  AI_CUSTOM = 'AI_CUSTOM',
  UNIFIED = 'UNIFIED'
}

export enum CampaignCountry {
  US = 'United States (US)',
  GB = 'United Kingdom (GB)',
  BR = 'Brazil (BR)'
}

export enum CampaignMedia {
  META = 'Meta (FB/IG)',
  TIKTOK = 'TikTok'
}

export enum CampaignGoal {
  SALES = '销量 (Sales)',
  LEADS = '线索 (Leads)'
}

export enum OptimizationEvent {
  PURCHASE = '成功购买 (Purchase)',
  ADD_TO_CART = '加入购物车 (AddToCart)',
  REGISTER = '完成注册 (Register)'
}

export interface CampaignStructure {
  strategy: StructureStrategy;
  adsPerSet?: number;
}

export interface AdSetSettings {
  name: string;
  country: string;
  ageMin: number;
  ageMax: number;
  gender: 'All' | 'Men' | 'Women';
  interests: string[];
  optimizationEvent: string;
  audienceType: AudienceType;
}

export interface AdSettings {
  name: string;
  headline: string;
  primaryText: string;
  imageUrl: string;
  cta: string;
  destinationUrl: string;
  utmParams: string;
  productId: string;
}
