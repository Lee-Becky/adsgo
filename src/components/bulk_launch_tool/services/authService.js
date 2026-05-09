class AuthService {
  constructor() {
    this.authStatus = {
      shopify: {
        isAuthorized: false,
        tokens: null,
        shop: null,
        lastUpdated: null
      },
      meta: {
        isAuthorized: false,
        tokens: null,
        userId: null,
        businessId: null,
        lastUpdated: null
      },
      google: {
        isAuthorized: false,
        tokens: null,
        merchantId: null,
        lastUpdated: null
      },
      tiktok: {
        isAuthorized: false,
        tokens: null,
        advertiserId: null,
        lastUpdated: null
      },
      bing: {
        isAuthorized: false,
        tokens: null,
        customerId: null,
        lastUpdated: null
      }
    };

    // 从localStorage恢复授权状态
    this.loadAuthStatus();
  }

  // 加载本地存储的授权状态
  loadAuthStatus() {
    try {
      const stored = localStorage.getItem('adsgo_auth_status');
      if (stored) {
        const parsedStatus = JSON.parse(stored);
        this.authStatus = { ...this.authStatus, ...parsedStatus };
      }
    } catch (error) {
      console.error('Failed to load auth status:', error);
    }
  }

  // 保存授权状态到本地存储
  saveAuthStatus() {
    try {
      localStorage.setItem('adsgo_auth_status', JSON.stringify(this.authStatus));
    } catch (error) {
      console.error('Failed to save auth status:', error);
    }
  }

  // 获取指定平台的授权状态
  getAuthStatus(platform) {
    return this.authStatus[platform] || { 
      isAuthorized: false, 
      tokens: null, 
      lastUpdated: null 
    };
  }

  // 获取所有平台的授权状态
  getAllAuthStatus() {
    return { ...this.authStatus };
  }

  // 检查平台是否已授权
  isAuthorized(platform) {
    return this.authStatus[platform]?.isAuthorized || false;
  }

  // 执行授权流程
  async authenticate(platform) {
    try {
      // 模拟授权流程
      await this.simulateAuthFlow(platform);
      
      // 更新授权状态
      this.authStatus[platform] = {
        ...this.authStatus[platform],
        isAuthorized: true,
        lastUpdated: new Date().toISOString()
      };

      // 根据平台设置特定的模拟数据
      switch (platform) {
        case 'shopify':
          this.authStatus[platform].shop = 'test-shop.myshopify.com';
          this.authStatus[platform].tokens = {
            accessToken: 'shopify_mock_token_' + Date.now(),
            scope: 'read_products,read_orders'
          };
          break;
        
        case 'meta':
          this.authStatus[platform].userId = 'mock_user_id_' + Date.now();
          this.authStatus[platform].businessId = 'mock_business_id_' + Date.now();
          this.authStatus[platform].tokens = {
            accessToken: 'meta_mock_token_' + Date.now(),
            scope: 'ads_management,pages_read_engagement'
          };
          break;
        
        case 'google':
          this.authStatus[platform].merchantId = 'mock_merchant_id_' + Date.now();
          this.authStatus[platform].tokens = {
            accessToken: 'google_mock_token_' + Date.now(),
            refreshToken: 'google_refresh_token_' + Date.now(),
            scope: 'https://www.googleapis.com/auth/content'
          };
          break;

        case 'tiktok':
          this.authStatus[platform].advertiserId = 'mock_advertiser_id_' + Date.now();
          this.authStatus[platform].tokens = {
            accessToken: 'tiktok_mock_token_' + Date.now(),
            scope: 'advertiser.read,campaign.read'
          };
          break;

        case 'bing':
          this.authStatus[platform].customerId = 'mock_customer_id_' + Date.now();
          this.authStatus[platform].tokens = {
            accessToken: 'bing_mock_token_' + Date.now(),
            refreshToken: 'bing_refresh_token_' + Date.now()
          };
          break;
      }

      // 保存到本地存储
      this.saveAuthStatus();

      // 触发授权状态变化事件
      this.emitAuthStatusChange(platform);

      return {
        success: true,
        platform,
        status: this.authStatus[platform]
      };
    } catch (error) {
      console.error(`Authentication failed for ${platform}:`, error);
      return {
        success: false,
        platform,
        error: error.message
      };
    }
  }

  // 模拟授权流程
  async simulateAuthFlow(platform) {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟和可能的失败
      setTimeout(() => {
        // 90% 成功率
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error(`${platform} authorization failed`));
        }
      }, 2000 + Math.random() * 1000);
    });
  }

  // 撤销授权
  async revokeAuth(platform) {
    try {
      // 这里可以添加实际的撤销API调用
      
      // 清除本地授权状态
      this.authStatus[platform] = {
        isAuthorized: false,
        tokens: null,
        lastUpdated: new Date().toISOString()
      };

      // 清除平台特定数据
      switch (platform) {
        case 'shopify':
          delete this.authStatus[platform].shop;
          break;
        case 'meta':
          delete this.authStatus[platform].userId;
          delete this.authStatus[platform].businessId;
          break;
        case 'google':
          delete this.authStatus[platform].merchantId;
          break;
        case 'tiktok':
          delete this.authStatus[platform].advertiserId;
          break;
        case 'bing':
          delete this.authStatus[platform].customerId;
          break;
      }

      // 保存到本地存储
      this.saveAuthStatus();

      // 触发授权状态变化事件
      this.emitAuthStatusChange(platform);

      return {
        success: true,
        platform
      };
    } catch (error) {
      console.error(`Failed to revoke auth for ${platform}:`, error);
      return {
        success: false,
        platform,
        error: error.message
      };
    }
  }

  // 刷新令牌
  async refreshToken(platform) {
    try {
      const currentAuth = this.authStatus[platform];
      if (!currentAuth?.isAuthorized) {
        throw new Error('Platform not authorized');
      }

      // 模拟令牌刷新
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新令牌（模拟）
      if (currentAuth.tokens) {
        currentAuth.tokens.accessToken = `${platform}_refreshed_token_` + Date.now();
        if (currentAuth.tokens.refreshToken) {
          currentAuth.tokens.refreshToken = `${platform}_refreshed_refresh_token_` + Date.now();
        }
      }

      currentAuth.lastUpdated = new Date().toISOString();

      // 保存到本地存储
      this.saveAuthStatus();

      return {
        success: true,
        platform,
        tokens: currentAuth.tokens
      };
    } catch (error) {
      console.error(`Failed to refresh token for ${platform}:`, error);
      return {
        success: false,
        platform,
        error: error.message
      };
    }
  }

  // 获取平台资源（如账号、目录等）
  async getPlatformResources(platform, resourceType, options = {}) {
    try {
      if (!this.isAuthorized(platform)) {
        throw new Error(`${platform} not authorized`);
      }

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // 根据平台和资源类型返回模拟数据
      switch (platform) {
        case 'meta':
          return this.getMetaResources(resourceType, options);
        case 'shopify':
          return this.getShopifyResources(resourceType, options);
        case 'google':
          return this.getGoogleResources(resourceType, options);
        case 'tiktok':
          return this.getTikTokResources(resourceType, options);
        case 'bing':
          return this.getBingResources(resourceType, options);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Failed to get ${resourceType} for ${platform}:`, error);
      throw error;
    }
  }

  // Meta平台资源
  getMetaResources(resourceType, options) {
    const mockData = {
      adAccounts: [
        { id: 'act_123456789', name: 'AdsGo Main Account', status: 'ACTIVE', currency: 'USD' },
        { id: 'act_987654321', name: 'AdsGo Test Account', status: 'ACTIVE', currency: 'USD' },
        { id: 'act_456789123', name: 'AdsGo Campaign Account', status: 'PAUSED', currency: 'EUR' }
      ],
      catalogs: [
        { id: 'catalog_1', name: 'Main Product Catalog', productCount: 150 },
        { id: 'catalog_2', name: 'Seasonal Products', productCount: 45 },
        { id: 'catalog_3', name: 'Sale Items', productCount: 23 }
      ],
      campaigns: [
        { id: 'campaign_1', name: 'Summer Collection', status: 'ACTIVE', objective: 'CONVERSIONS' },
        { id: 'campaign_2', name: 'Back to School', status: 'ACTIVE', objective: 'TRAFFIC' },
        { id: 'campaign_3', name: 'Holiday Special', status: 'PAUSED', objective: 'REACH' }
      ],
      pages: [
        { id: 'page_1', name: 'AdsGo Official', category: 'Business', followers: 15420 },
        { id: 'page_2', name: 'AdsGo Support', category: 'Support', followers: 3210 }
      ]
    };

    return mockData[resourceType] || [];
  }

  // Shopify平台资源
  getShopifyResources(resourceType, options) {
    const mockData = {
      products: [
        { id: 'prod_1', title: 'Wireless Headphones', handle: 'wireless-headphones', status: 'active', price: '99.99' },
        { id: 'prod_2', title: 'Smart Watch', handle: 'smart-watch', status: 'active', price: '299.99' },
        { id: 'prod_3', title: 'Phone Case', handle: 'phone-case', status: 'active', price: '19.99' }
      ],
      collections: [
        { id: 'coll_1', title: 'Electronics', handle: 'electronics', productCount: 25 },
        { id: 'coll_2', title: 'Accessories', handle: 'accessories', productCount: 18 }
      ],
      orders: [
        { id: 'order_1', name: '#1001', total_price: '119.98', financial_status: 'paid' },
        { id: 'order_2', name: '#1002', total_price: '299.99', financial_status: 'pending' }
      ]
    };

    return mockData[resourceType] || [];
  }

  // Google平台资源
  getGoogleResources(resourceType, options) {
    const mockData = {
      merchants: [
        { id: 'merch_1', name: 'AdsGo Store', country: 'US', status: 'verified' },
        { id: 'merch_2', name: 'AdsGo EU', country: 'DE', status: 'verified' }
      ],
      products: [
        { id: 'google_prod_1', title: 'Bluetooth Speaker', price: '$79.99', availability: 'in_stock' },
        { id: 'google_prod_2', title: 'Laptop Stand', price: '$45.99', availability: 'in_stock' }
      ]
    };

    return mockData[resourceType] || [];
  }

  // TikTok平台资源
  getTikTokResources(resourceType, options) {
    const mockData = {
      advertisers: [
        { id: 'adv_1', name: 'AdsGo TikTok', status: 'ENABLE', currency: 'USD' },
        { id: 'adv_2', name: 'AdsGo TikTok EU', status: 'ENABLE', currency: 'EUR' }
      ],
      campaigns: [
        { id: 'tt_campaign_1', name: 'Video Ads Campaign', status: 'ENABLE', objective: 'CONVERSIONS' },
        { id: 'tt_campaign_2', name: 'Brand Awareness', status: 'ENABLE', objective: 'REACH' }
      ]
    };

    return mockData[resourceType] || [];
  }

  // Bing平台资源
  getBingResources(resourceType, options) {
    const mockData = {
      customers: [
        { id: 'cust_1', name: 'AdsGo Bing Account', currency: 'USD', status: 'Active' }
      ],
      campaigns: [
        { id: 'bing_campaign_1', name: 'Search Campaign', status: 'Active', type: 'Search' },
        { id: 'bing_campaign_2', name: 'Shopping Campaign', status: 'Active', type: 'Shopping' }
      ]
    };

    return mockData[resourceType] || [];
  }

  // 触发授权状态变化事件
  emitAuthStatusChange(platform) {
    const event = new CustomEvent('authStatusChanged', {
      detail: {
        platform,
        status: this.authStatus[platform]
      }
    });
    window.dispatchEvent(event);
  }

  // 清除所有授权
  clearAllAuth() {
    Object.keys(this.authStatus).forEach(platform => {
      this.authStatus[platform] = {
        isAuthorized: false,
        tokens: null,
        lastUpdated: new Date().toISOString()
      };
    });
    
    this.saveAuthStatus();
    
    // 触发全局清除事件
    const event = new CustomEvent('authCleared');
    window.dispatchEvent(event);
  }

  // 检查令牌是否即将过期
  isTokenExpiringSoon(platform, thresholdMinutes = 30) {
    const auth = this.authStatus[platform];
    if (!auth?.tokens?.expiresAt) return false;
    
    const expiresAt = new Date(auth.tokens.expiresAt);
    const now = new Date();
    const diffMinutes = (expiresAt - now) / (1000 * 60);
    
    return diffMinutes <= thresholdMinutes;
  }

  // 获取授权URL（用于OAuth流程）
  getAuthUrl(platform, redirectUri = window.location.origin) {
    const baseUrls = {
      meta: 'https://www.facebook.com/v18.0/dialog/oauth',
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      tiktok: 'https://ads.tiktok.com/marketing_api/auth',
      shopify: 'https://myshopify.com/admin/oauth/authorize'
    };

    const params = new URLSearchParams({
      client_id: this.getClientId(platform),
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: this.getRequiredScopes(platform).join(' '),
      state: this.generateState()
    });

    return `${baseUrls[platform]}?${params.toString()}`;
  }

  // 获取客户端ID（实际应用中应从环境变量获取）
  getClientId(platform) {
    const clientIds = {
      meta: 'your_meta_app_id',
      google: 'your_google_client_id',
      tiktok: 'your_tiktok_app_id',
      shopify: 'your_shopify_app_id'
    };
    return clientIds[platform];
  }

  // 获取所需权限范围
  getRequiredScopes(platform) {
    const scopes = {
      meta: ['ads_management', 'pages_read_engagement', 'business_management'],
      google: ['https://www.googleapis.com/auth/content', 'https://www.googleapis.com/auth/adwords'],
      tiktok: ['advertiser.read', 'campaign.read', 'campaign.write'],
      shopify: ['read_products', 'read_orders', 'write_products']
    };
    return scopes[platform] || [];
  }

  // 生成状态参数（防CSRF）
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// 创建单例实例
const authService = new AuthService();

// 为了向后兼容，导出原来的 MOCK_ACCOUNTS 和 authorizePlatform
export const MOCK_ACCOUNTS = [
  { id: 'act_2948192038', name: 'Luminaire Style - Global' },
  { id: 'act_1039582103', name: 'Performance Testing Acc' },
];

export const authorizePlatform = async (platform) => {
  return await authService.authenticate(platform);
};

// 导出服务实例
export { authService };
export default authService;
