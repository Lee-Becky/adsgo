/* ═══════════════════════════════════════════════════════════
   v1 → v2 Route Redirects
   Maps flat routes to new workspace-nested structure
   ═══════════════════════════════════════════════════════════ */

export const V1_REDIRECT_MAP = {
  // Plan
  '/mediaPlan':           '/workspace/default/plan/media-plan',
  '/overview':            '/workspace/default/plan/media-plan',

  // Ads
  '/adManagerV3':         '/workspace/default/ads/campaigns',
  '/autoRegeneration':    '/workspace/default/create/draft',
  '/drafts':              '/workspace/default/create/draft',

  // Create
  '/batchGenerateAds':    '/workspace/default/create/campaign-gen',
  '/campaignGenerator':   '/workspace/default/create/campaign-gen',
  '/bulkLaunchTool':      '/workspace/default/create/bulk-launch',

  // Creative
  '/aiGenerate':          '/workspace/default/creative/ai-gen',
  '/generateVideo':       '/workspace/default/creative/ai-gen',
  '/creativeLibrary':     '/workspace/default/creative/library',

  // Insight
  '/insights360':         '/workspace/default/insight/dashboard',
  '/insights':            '/workspace/default/insight/dashboard',
  '/aiAnalysis':          '/workspace/default/insight/ai-analysis',
  '/audit360':            '/workspace/default/insight/dashboard',

  // Settings
  '/settings':            '/workspace/default/settings/brand-info',
  '/basicInfo':           '/workspace/default/settings/brand-info',
  '/brandProfile':        '/workspace/default/settings/brand-info',
  '/optimizeGoals':       '/workspace/default/settings/goals',
  '/adAccounts':          '/workspace/default/settings/accounts',
  '/datasets':            '/workspace/default/settings/datasets',
  '/products':            '/workspace/default/settings/brand-info',
  '/competitors':         '/workspace/default/settings/brand-info',
  '/productDetails':      '/workspace/default/settings/brand-info',

  // Dashboard legacy
  '/dashboard':           '/workspace/default/plan/media-plan',
}

/**
 * Given a v1 path, returns the v2 workspace path.
 * Returns null if no redirect is needed.
 */
export const getV2Redirect = (v1Path) => {
  return V1_REDIRECT_MAP[v1Path] || null
}

/**
 * Replaces 'default' brandId placeholder with actual brandId in a path
 */
export const resolveBrandPath = (path, brandId = 'default') => {
  return path.replace('/workspace/default/', `/workspace/${brandId}/`)
}
