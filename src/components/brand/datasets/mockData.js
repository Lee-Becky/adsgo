// ============================================================
// Datasets Mock Data
// ============================================================

// --- Shared constants ---
export const MEDIA_PLATFORMS = [
  { id: 'meta', name: 'Meta', icon: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=32', color: '#1877F2' },
  { id: 'google', name: 'Google', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32', color: '#DB4437' },
  { id: 'tiktok', name: 'TikTok', icon: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=32', color: '#000000' },
  { id: 'snapchat', name: 'Snapchat', icon: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=32', color: '#FFFC00' },
  { id: 'bing', name: 'Bing', icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=32', color: '#008373' },
]

export const ATTRIBUTION_PLATFORMS = [
  { id: 'appsflyer', name: 'AppsFlyer', icon: 'https://www.google.com/s2/favicons?domain=appsflyer.com&sz=32' },
  { id: 'adjust', name: 'Adjust', icon: 'https://www.google.com/s2/favicons?domain=adjust.com&sz=32' },
  { id: 'none', name: 'None', icon: null },
]

export const TIME_RANGE_OPTIONS = [
  { label: '7d', value: 7 },
  { label: '14d', value: 14 },
  { label: '30d', value: 30 },
  { label: 'Custom', value: 'custom' },
]

export const PAGE_SIZE_OPTIONS = [20, 50, 100, 200]

// --- Common field definitions ---
export const DIMENSION_FIELDS = [
  { key: 'date', label: 'Date', type: 'dimension', group: 'Base' },
  { key: 'campaign_name', label: 'Campaign Name', type: 'dimension', group: 'Base' },
  { key: 'campaign_id', label: 'Campaign ID', type: 'dimension', group: 'Base' },
  { key: 'adset_name', label: 'Adset Name', type: 'dimension', group: 'Base' },
  { key: 'adset_id', label: 'Adset ID', type: 'dimension', group: 'Base' },
  { key: 'ad_name', label: 'Ad Name', type: 'dimension', group: 'Base' },
  { key: 'ad_id', label: 'Ad ID', type: 'dimension', group: 'Base' },
  { key: 'country', label: 'Country', type: 'dimension', group: 'Geo' },
  { key: 'region', label: 'Region', type: 'dimension', group: 'Geo' },
  { key: 'platform', label: 'Platform', type: 'dimension', group: 'Device' },
  { key: 'os', label: 'OS', type: 'dimension', group: 'Device' },
]

export const METRIC_FIELDS = [
  { key: 'impressions', label: 'Impressions', type: 'metric', group: 'Delivery' },
  { key: 'clicks', label: 'Clicks', type: 'metric', group: 'Delivery' },
  { key: 'ctr', label: 'CTR', type: 'metric', group: 'Delivery' },
  { key: 'spend', label: 'Spend', type: 'metric', group: 'Cost' },
  { key: 'cpc', label: 'CPC', type: 'metric', group: 'Cost' },
  { key: 'cpm', label: 'CPM', type: 'metric', group: 'Cost' },
  { key: 'conversions', label: 'Conversions', type: 'metric', group: 'Conversion' },
  { key: 'cpa', label: 'CPA', type: 'metric', group: 'Conversion' },
  { key: 'roas', label: 'ROAS', type: 'metric', group: 'Conversion' },
  { key: 'revenue', label: 'Revenue', type: 'metric', group: 'Conversion' },
  { key: 'purchase', label: 'Purchase', type: 'metric', group: 'Event' },
  { key: 'add_to_cart', label: 'Add to Cart', type: 'metric', group: 'Event' },
  { key: 'initiate_checkout', label: 'Initiate Checkout', type: 'metric', group: 'Event' },
  { key: 'view_content', label: 'View Content', type: 'metric', group: 'Event' },
]

export const CREATIVE_DIMENSION_FIELDS = [
  { key: 'country', label: 'Country', type: 'dimension' },
  { key: 'os', label: 'OS', type: 'dimension' },
  { key: 'platform', label: 'Platform', type: 'dimension' },
  { key: 'campaign_name', label: 'Campaign Name', type: 'dimension' },
  { key: 'adset_name', label: 'Adset Name', type: 'dimension' },
]

export const CREATIVE_METRIC_FIELDS = [
  { key: 'impressions', label: 'Impressions', type: 'metric', group: 'Delivery' },
  { key: 'clicks', label: 'Clicks', type: 'metric', group: 'Delivery' },
  { key: 'ctr', label: 'CTR', type: 'metric', group: 'Delivery' },
  { key: 'spend', label: 'Spend', type: 'metric', group: 'Cost' },
  { key: 'cpc', label: 'CPC', type: 'metric', group: 'Cost' },
  { key: 'cpm', label: 'CPM', type: 'metric', group: 'Cost' },
  { key: 'video_views', label: 'Video Views', type: 'metric', group: 'Video' },
  { key: 'video_p25', label: 'Video 25%', type: 'metric', group: 'Video' },
  { key: 'video_p50', label: 'Video 50%', type: 'metric', group: 'Video' },
  { key: 'video_p75', label: 'Video 75%', type: 'metric', group: 'Video' },
  { key: 'video_p100', label: 'Video 100%', type: 'metric', group: 'Video' },
  { key: 'conversions', label: 'Conversions', type: 'metric', group: 'Conversion' },
  { key: 'roas', label: 'ROAS', type: 'metric', group: 'Conversion' },
]

export const ATTRIBUTION_METRIC_FIELDS = [
  { key: 'af_installs', label: 'Installs (AF)', type: 'metric', group: 'Attribution', source: 'appsflyer' },
  { key: 'af_purchase', label: 'Purchases (AF)', type: 'metric', group: 'Attribution', source: 'appsflyer' },
  { key: 'af_revenue', label: 'Revenue (AF)', type: 'metric', group: 'Attribution', source: 'appsflyer' },
  { key: 'af_roas', label: 'ROAS (AF)', type: 'metric', group: 'Attribution', source: 'appsflyer' },
  { key: 'adj_installs', label: 'Installs (Adj)', type: 'metric', group: 'Attribution', source: 'adjust' },
  { key: 'adj_purchase', label: 'Purchases (Adj)', type: 'metric', group: 'Attribution', source: 'adjust' },
  { key: 'adj_revenue', label: 'Revenue (Adj)', type: 'metric', group: 'Attribution', source: 'adjust' },
]

// --- Granularity levels ---
export const GRANULARITY_OPTIONS = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'adset', label: 'Adset' },
  { id: 'ad', label: 'Ad' },
]

// --- Event Metrics (for event key discovery) ---
export const MOCK_EVENT_KEYS = [
  { key: 'purchase', label: 'Purchase' },
  { key: 'add_to_cart', label: 'Add to Cart' },
  { key: 'initiate_checkout', label: 'Initiate Checkout' },
  { key: 'view_content', label: 'View Content' },
  { key: 'add_payment_info', label: 'Add Payment Info' },
  { key: 'complete_registration', label: 'Complete Registration' },
  { key: 'lead', label: 'Lead' },
  { key: 'app_install', label: 'App Install' },
]

export const EVENT_METRIC_TYPES = [
  { id: 'actions', label: 'Actions (Count)' },
  { id: 'action_values', label: 'Action Values ($)' },
]

// --- Mock campaign names for split preview ---
export const MOCK_CAMPAIGN_NAMES = [
  'Product_US_Broad',
  'Brand_EU_Lookalike',
  'Sale_Global_Interest',
  'Retarget_US_Purchase',
  'Launch_JP_Video',
]

// --- Separator presets for split config ---
export const SEPARATOR_PRESETS = ['_', '-', '|', '/', '.', ':']

// --- 1. Offline Data ---
export const mockOfflineDatabases = [
  {
    id: 'db_001',
    name: 'Sales Revenue Q1',
    rowCount: 12450,
    size: '2.3 MB',
    uploadDate: '2025-03-15',
    dataStartDate: '2025-01-01',
    columns: [
      { key: 'date', label: 'Date', type: 'Date' },
      { key: 'product_id', label: 'Product ID', type: 'Text' },
      { key: 'product_name', label: 'Product Name', type: 'Text' },
      { key: 'revenue', label: 'Revenue', type: 'Number' },
      { key: 'units_sold', label: 'Units Sold', type: 'Number' },
      { key: 'region', label: 'Region', type: 'Text' },
      { key: 'channel', label: 'Channel', type: 'Text' },
    ],
  },
  {
    id: 'db_002',
    name: 'CRM Leads Data',
    rowCount: 8320,
    size: '1.1 MB',
    uploadDate: '2025-04-02',
    dataStartDate: '2025-01-15',
    columns: [
      { key: 'date', label: 'Date', type: 'Date' },
      { key: 'lead_id', label: 'Lead ID', type: 'Text' },
      { key: 'source', label: 'Source', type: 'Text' },
      { key: 'status', label: 'Status', type: 'Text' },
      { key: 'value', label: 'Value', type: 'Number' },
    ],
  },
]

// Generate mock table rows
const generateOfflineRows = (db) => {
  const rows = []
  for (let i = 0; i < 50; i++) {
    const row = {}
    db.columns.forEach(col => {
      if (col.type === 'Date') row[col.key] = `2025-0${1 + (i % 3)}-${String(1 + (i % 28)).padStart(2, '0')}`
      else if (col.type === 'Number') row[col.key] = +(Math.random() * 10000).toFixed(2)
      else row[col.key] = `${col.label}_${i + 1}`
    })
    rows.push(row)
  }
  return rows
}

export const mockOfflineRows = Object.fromEntries(
  mockOfflineDatabases.map(db => [db.id, generateOfflineRows(db)])
)

// --- 2. Ad Dataset ---
export const mockAdDatasets = [
  {
    id: 'add_a1b2c3d4e5f6',
    name: 'Meta US Campaigns',
    platform: 'meta',
    accountIds: ['act_123456789', 'act_987654321'],
    dataStartDate: '2025-01-01',
    splitConfig: {
      separator: '_',
      dimensions: [
        { index: 0, name: 'Product', key: 'product' },
        { index: 1, name: 'Region', key: 'region' },
        { index: 2, name: 'Audience', key: 'audience' },
      ],
    },
    selectedColumns: ['date', 'campaign_name', 'adset_name', 'impressions', 'clicks', 'spend', 'conversions', 'roas'],
  },
  {
    id: 'add_f6e5d4c3b2a1',
    name: 'Google Search Perf',
    platform: 'google',
    accountIds: ['123-456-7890'],
    dataStartDate: '2025-02-01',
    splitConfig: {
      separator: '-',
      dimensions: [
        { index: 0, name: 'Brand', key: 'brand' },
        { index: 1, name: 'Category', key: 'category' },
      ],
    },
    selectedColumns: ['date', 'campaign_name', 'impressions', 'clicks', 'spend', 'cpc', 'conversions', 'cpa'],
  },
]

// Generate mock ad dataset rows
const generateAdRows = (ds) => {
  const campaigns = ['Product_US_Broad', 'Product_EU_Lookalike', 'Brand_US_Retarget', 'Sale_Global_Interest']
  const rows = []
  for (let i = 0; i < 60; i++) {
    rows.push({
      date: `2025-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
      campaign_name: campaigns[i % campaigns.length],
      campaign_id: `camp_${100 + i}`,
      adset_name: `Adset_${(i % 4) + 1}`,
      adset_id: `as_${200 + i}`,
      ad_name: `Ad_${(i % 6) + 1}`,
      ad_id: `ad_${300 + i}`,
      impressions: Math.floor(Math.random() * 50000) + 1000,
      clicks: Math.floor(Math.random() * 2000) + 50,
      ctr: +(Math.random() * 5 + 0.5).toFixed(2),
      spend: +(Math.random() * 500 + 10).toFixed(2),
      cpc: +(Math.random() * 2 + 0.1).toFixed(2),
      cpm: +(Math.random() * 15 + 1).toFixed(2),
      conversions: Math.floor(Math.random() * 100),
      cpa: +(Math.random() * 30 + 2).toFixed(2),
      roas: +(Math.random() * 6 + 0.5).toFixed(2),
      revenue: +(Math.random() * 3000 + 100).toFixed(2),
    })
  }
  return rows
}

export const mockAdDatasetRows = Object.fromEntries(
  mockAdDatasets.map(ds => [ds.id, generateAdRows(ds)])
)

// --- 3. Creative Dataset ---
export const mockCreativeDatasets = [
  {
    id: 'crd_a1b2c3d4e5f6',
    name: 'Meta Creatives US',
    platform: 'meta',
    accountIds: ['act_123456789'],
    assetTypes: ['all'],
    dataStartDate: '2025-01-01',
    splitConfig: null,
    selectedColumns: ['date', 'impressions', 'clicks', 'spend', 'video_views', 'conversions', 'roas'],
  },
  {
    id: 'crd_f6e5d4c3b2a1',
    name: 'TikTok Video Ads',
    platform: 'tiktok',
    accountIds: ['tt_001122334'],
    assetTypes: ['video'],
    dataStartDate: '2025-02-15',
    splitConfig: {
      separator: '_',
      dimensions: [
        { index: 0, name: 'Theme', key: 'theme' },
        { index: 1, name: 'Version', key: 'version' },
      ],
    },
    selectedColumns: ['date', 'impressions', 'clicks', 'spend', 'video_views', 'video_p25', 'video_p50', 'video_p100'],
  },
]

const generateCreativeRows = () => {
  const assetNames = ['Hero_v1.mp4', 'Promo_Summer.jpg', 'UGC_Review_3.mp4', 'Product_Closeup.jpg', 'Lifestyle_v2.mp4']
  const assetTypes = ['video', 'image', 'video', 'image', 'video']
  const rows = []
  for (let i = 0; i < 40; i++) {
    const idx = i % assetNames.length
    rows.push({
      date: `2025-0${1 + (i % 4)}-${String(1 + (i % 28)).padStart(2, '0')}`,
      asset_name: assetNames[idx],
      asset_type: assetTypes[idx],
      asset_id: `asset_${400 + i}`,
      impressions: Math.floor(Math.random() * 30000) + 500,
      clicks: Math.floor(Math.random() * 1500) + 20,
      ctr: +(Math.random() * 4 + 0.3).toFixed(2),
      spend: +(Math.random() * 300 + 5).toFixed(2),
      cpc: +(Math.random() * 1.5 + 0.05).toFixed(2),
      cpm: +(Math.random() * 12 + 0.5).toFixed(2),
      video_views: assetTypes[idx] === 'video' ? Math.floor(Math.random() * 20000) + 200 : 0,
      video_p25: assetTypes[idx] === 'video' ? Math.floor(Math.random() * 15000) : 0,
      video_p50: assetTypes[idx] === 'video' ? Math.floor(Math.random() * 10000) : 0,
      video_p75: assetTypes[idx] === 'video' ? Math.floor(Math.random() * 7000) : 0,
      video_p100: assetTypes[idx] === 'video' ? Math.floor(Math.random() * 4000) : 0,
      conversions: Math.floor(Math.random() * 60),
      roas: +(Math.random() * 5 + 0.3).toFixed(2),
    })
  }
  return rows
}

export const mockCreativeDatasetRows = Object.fromEntries(
  mockCreativeDatasets.map(ds => [ds.id, generateCreativeRows()])
)

// --- 4. Joined (Attribution) Dataset ---
export const mockJoinedDatasets = [
  {
    id: 'jds_a1b2c3d4e5f6',
    name: 'Meta × AppsFlyer',
    mediaPlatform: 'meta',
    accountIds: ['act_123456789', 'act_987654321'],
    attributionPlatform: 'appsflyer',
    dataStartDate: '2025-01-01',
    splitConfig: {
      separator: '_',
      dimensions: [
        { index: 0, name: 'Product', key: 'product' },
        { index: 1, name: 'Region', key: 'region' },
      ],
    },
    selectedColumns: ['date', 'campaign_name', 'impressions', 'spend', 'conversions', 'roas', 'af_installs', 'af_revenue', 'af_roas'],
    matchStats: { total: 52, matched: 46, matchRate: 88.5 },
  },
]

const generateJoinedRows = () => {
  const campaigns = ['Product_US_Main', 'Product_EU_Scale', 'Brand_JP_Test', 'Retarget_Global']
  const rows = []
  for (let i = 0; i < 50; i++) {
    rows.push({
      date: `2025-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, '0')}`,
      campaign_name: campaigns[i % campaigns.length],
      campaign_id: `camp_${500 + i}`,
      impressions: Math.floor(Math.random() * 40000) + 800,
      clicks: Math.floor(Math.random() * 1800) + 40,
      spend: +(Math.random() * 400 + 8).toFixed(2),
      conversions: Math.floor(Math.random() * 80),
      roas: +(Math.random() * 5 + 0.5).toFixed(2),
      af_installs: Math.floor(Math.random() * 200) + 10,
      af_purchase: Math.floor(Math.random() * 50),
      af_revenue: +(Math.random() * 2000 + 50).toFixed(2),
      af_roas: +(Math.random() * 4 + 0.3).toFixed(2),
    })
  }
  return rows
}

export const mockJoinedDatasetRows = Object.fromEntries(
  mockJoinedDatasets.map(ds => [ds.id, generateJoinedRows()])
)

// Mock account list for dataset wizard account selection
export const mockAccountsForDataset = [
  { id: 'act_luma_us_001', name: 'LumaFit Meta US Main', platform: 'meta' },
  { id: 'act_luma_rt_002', name: 'LumaFit Meta Retargeting', platform: 'meta' },
  { id: 'act_luma_lookalike_003', name: 'LumaFit Meta Lookalike', platform: 'meta' },
  { id: '456-110-9283', name: 'LumaFit Google Search', platform: 'google' },
  { id: '456-110-9284', name: 'LumaFit Shopping Backup', platform: 'google' },
  { id: 'tt_luma_ca_001', name: 'LumaFit TikTok CA Test', platform: 'tiktok' },
  { id: 'tt_luma_ugc_002', name: 'LumaFit TikTok UGC Hooks', platform: 'tiktok' },
  { id: 'bing_luma_001', name: 'LumaFit Bing Search US', platform: 'bing' },
  { id: 'snap_luma_001', name: 'LumaFit Snapchat Story Test', platform: 'snapchat' },
]
