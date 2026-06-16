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
  { id: 'act_123456789', name: 'AdsGo Main Campaign', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_987654321', name: 'AdsGo Retargeting', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_111222333', name: 'Brand Awareness US', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_444555666', name: 'EU Expansion', platform: 'meta', source: 'cybermedia', status: 'paused' },
  { id: '123-456-7890', name: 'AdsGo Search Ads', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: '098-765-4321', name: 'AdsGo Shopping', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: '111-222-3333', name: 'Performance Max US', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: 'tt_001122334', name: 'TikTok Viral Campaign', platform: 'tiktok', source: 'cybermedia', status: 'active' },
  { id: 'tt_556677889', name: 'TikTok Shop Ads', platform: 'tiktok', source: 'cybermedia', status: 'active' },
  { id: 'bing_12345', name: 'Bing Search US', platform: 'bing', source: 'cybermedia', status: 'active' },
  { id: 'snap_00112', name: 'Snapchat Story Ads', platform: 'snapchat', source: 'cybermedia', status: 'active' },
]

// Initial linked accounts (pre-populated)
export const mockLinkedAccounts = [
  { id: 'act_123456789', name: 'AdsGo Main Campaign', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: 'act_987654321', name: 'AdsGo Retargeting', platform: 'meta', source: 'cybermedia', status: 'active' },
  { id: '123-456-7890', name: 'AdsGo Search Ads', platform: 'google', source: 'cybermedia', status: 'active' },
  { id: 'tt_001122334', name: 'TikTok Viral Campaign', platform: 'tiktok', source: 'cybermedia', status: 'active' },
]

// Connect methods
export const CONNECT_METHODS = [
  { id: 'cybermedia', label: 'From CyberMedia', icon: 'Database', description: 'Select from your CyberMedia account pool' },
  { id: 'meta', label: 'Facebook Connect', icon: 'meta', description: 'Connect via Facebook Business Manager', platform: 'meta' },
  { id: 'google', label: 'Google Connect', icon: 'google', description: 'Connect via Google Ads Manager', platform: 'google' },
  { id: 'tiktok', label: 'TikTok Connect', icon: 'tiktok', description: 'Connect via TikTok Business Center', platform: 'tiktok' },
]
