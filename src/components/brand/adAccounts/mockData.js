// Platform definitions with brand colors
export const PLATFORMS = [
  { id: 'meta', name: 'Meta', color: '#1877F2', icon: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=32' },
  { id: 'google', name: 'Google', color: '#DB4437', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32' },
  { id: 'tiktok', name: 'TikTok', color: '#000000', icon: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=32' },
  { id: 'bing', name: 'Bing', color: '#008373', icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=32' },
  { id: 'snapchat', name: 'Snapchat', color: '#FFFC00', icon: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=32' },
]

// Platform ID mapping for marketing-main compatibility
export const PLATFORM_ID_MAP = {
  'meta': 1, 'google': 2, 'tiktok': 4, 'snapchat': 7, 'bing': 9
}

// Mock account pool for CyberMedia search
export const mockAccountPool = [
  { id: 'act_luma_us_001', name: 'LumaFit Meta US Main', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_luma_rt_002', name: 'LumaFit Meta Retargeting', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_luma_lookalike_003', name: 'LumaFit Meta Lookalike', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_luma_eu_004', name: 'LumaFit EU Expansion', platform: 'meta', source: 'cybermedia', status: 'paused' },
  { id: '456-110-9283', name: 'LumaFit Google Search', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: '456-110-9284', name: 'LumaFit Shopping Backup', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: '456-110-9285', name: 'LumaFit Performance Max', platform: 'google', source: 'cybermedia', status: 'paused' },
  { id: 'tt_luma_ca_001', name: 'LumaFit TikTok CA Test', platform: 'tiktok', source: 'cybermedia', status: 'active' },
  { id: 'tt_luma_ugc_002', name: 'LumaFit TikTok UGC Hooks', platform: 'tiktok', source: 'cybermedia', status: 'active' },
  { id: 'bing_luma_001', name: 'LumaFit Bing Search US', platform: 'bing', source: 'cybermedia', status: 'active' },
  { id: 'snap_luma_001', name: 'LumaFit Snapchat Story Test', platform: 'snapchat', source: 'cybermedia', status: 'paused' },
]

// Initial linked accounts (pre-populated)
export const mockLinkedAccounts = [
  { id: 'act_luma_us_001', name: 'LumaFit Meta US Main', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_luma_rt_002', name: 'LumaFit Meta Retargeting', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: '456-110-9283', name: 'LumaFit Google Search', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: 'tt_luma_ca_001', name: 'LumaFit TikTok CA Test', platform: 'tiktok', source: 'cybermedia', status: 'active' },
]

// Connect methods
export const CONNECT_METHODS = [
  { id: 'cybermedia', label: 'From CyberMedia', icon: 'Database', description: 'Select from your CyberMedia account pool' },
  { id: 'meta', label: 'Facebook Connect', icon: 'meta', description: 'Connect via Facebook Business Manager', platform: 'meta' },
  { id: 'google', label: 'Google Connect', icon: 'google', description: 'Connect via Google Ads Manager', platform: 'google' },
  { id: 'tiktok', label: 'TikTok Connect', icon: 'tiktok', description: 'Connect via TikTok Business Center', platform: 'tiktok' },
]
