/**
 * Platform Resources — 模拟"广告账号选定后通过接口拉取的资源"。
 * 每个 resourceType 返回 schema option 形态：[{ value, label, ... }]，可直接挂到 FieldDef.options。
 *
 * Phase 2.C：所有数据同步导出。后续可加异步 loader 与 useResourceLoader hook。
 */

// ─── 共享地理资源 ───
export const COUNTRIES = [
  { value: 'US', label: '美国 / United States' },
  { value: 'GB', label: '英国 / United Kingdom' },
  { value: 'CA', label: '加拿大 / Canada' },
  { value: 'AU', label: '澳大利亚 / Australia' },
  { value: 'DE', label: '德国 / Germany' },
  { value: 'FR', label: '法国 / France' },
  { value: 'JP', label: '日本 / Japan' },
  { value: 'SG', label: '新加坡 / Singapore' },
  { value: 'BR', label: '巴西 / Brazil' },
  { value: 'IN', label: '印度 / India' },
  { value: 'KR', label: '韩国 / Korea' },
  { value: 'NL', label: '荷兰 / Netherlands' },
  { value: 'SE', label: '瑞典 / Sweden' },
  { value: 'IT', label: '意大利 / Italy' },
  { value: 'ES', label: '西班牙 / Spain' },
  { value: 'MX', label: '墨西哥 / Mexico' },
  { value: 'AE', label: '阿联酋 / UAE' },
  { value: 'TH', label: '泰国 / Thailand' },
  { value: 'VN', label: '越南 / Vietnam' },
  { value: 'MY', label: '马来西亚 / Malaysia' },
  { value: 'ID', label: '印度尼西亚 / Indonesia' },
  { value: 'PH', label: '菲律宾 / Philippines' },
  { value: 'PL', label: '波兰 / Poland' },
  { value: 'TR', label: '土耳其 / Turkey' },
  { value: 'HK', label: '香港 / Hong Kong' },
  { value: 'TW', label: '台湾 / Taiwan' },
];

const REGIONS = {
  US: [
    { value: '3847', label: 'California, US' }, { value: '3856', label: 'New York, US' },
    { value: '3852', label: 'Texas, US' },      { value: '3825', label: 'Florida, US' },
    { value: '3863', label: 'Washington, US' }, { value: '3844', label: 'Massachusetts, US' },
  ],
  GB: [
    { value: '2335', label: 'England, GB' }, { value: '2336', label: 'Scotland, GB' },
    { value: '2337', label: 'Wales, GB' },   { value: '2338', label: 'N. Ireland, GB' },
  ],
  CA: [{ value: '4150', label: 'Ontario, CA' }, { value: '4147', label: 'Quebec, CA' }, { value: '4146', label: 'British Columbia, CA' }],
  DE: [{ value: '5200', label: 'Bavaria, DE' }, { value: '5201', label: 'Berlin, DE' }, { value: '5202', label: 'Hamburg, DE' }],
};

const CITIES = {
  US: [
    { value: '2418779', label: 'New York, NY' }, { value: '2420379', label: 'Los Angeles, CA' },
    { value: '2419533', label: 'Chicago, IL' }, { value: '2420409', label: 'Houston, TX' },
    { value: '2419046', label: 'San Francisco, CA' }, { value: '2418927', label: 'Seattle, WA' },
  ],
  GB: [
    { value: '2643743', label: 'London, GB' }, { value: '2655984', label: 'Manchester, GB' },
    { value: '2655603', label: 'Birmingham, GB' },
  ],
  JP: [{ value: '1850147', label: '東京 Tokyo' }, { value: '1853909', label: '大阪 Osaka' }, { value: '1850144', label: '横浜 Yokohama' }],
};

const ZIPS = {
  US: [
    { value: '10001', label: '10001 (New York, NY)' }, { value: '90001', label: '90001 (Los Angeles, CA)' },
    { value: '60601', label: '60601 (Chicago, IL)' },  { value: '94102', label: '94102 (San Francisco, CA)' },
  ],
};

// ─── Meta 资源 ───
// Phase 2.I：每个 pixel 携带其可用 events 列表（standard + custom 混合）。
// AdsetDetailPanel 三段式（成效目标 → Pixel → Event）从这里取每条 pixel 的 events。
const META_PIXELS = [
  {
    value: 'pix_001', label: 'Main Site Pixel — Luminaire',
    events: ['Purchase', 'AddToCart', 'InitiateCheckout', 'ViewContent', 'AddPaymentInfo', 'Search', 'CompleteRegistration'],
  },
  {
    value: 'pix_002', label: 'Mobile Web Pixel',
    events: ['Purchase', 'AddToCart', 'ViewContent', 'PageView', 'Lead'],
  },
  {
    value: 'pix_003', label: 'Checkout Pixel — Sales',
    events: ['Purchase', 'InitiateCheckout', 'AddPaymentInfo', 'AddToCart', 'CompleteRegistration', 'StartTrial', 'Subscribe'],
  },
  {
    value: 'pix_004', label: 'Lead Form Pixel',
    events: ['Lead', 'CompleteRegistration', 'Contact', 'SubmitApplication', 'Schedule', 'FindLocation'],
  },
  {
    value: 'pix_005', label: 'Brand Awareness Pixel',
    events: ['ViewContent', 'PageView', 'Search'],
  },
  {
    value: 'pix_006', label: 'Subscription Funnel Pixel',
    events: ['Subscribe', 'StartTrial', 'CompleteRegistration', 'AddPaymentInfo', 'Purchase'],
  },
];

const META_APPS = [
  { value: 'app_2814715', label: 'Luminaire iOS App' },
  { value: 'app_3820112', label: 'Luminaire Android App' },
  { value: 'app_4501277', label: 'Beauty Box iOS' },
  { value: 'app_4501288', label: 'Beauty Box Android' },
  { value: 'app_5611229', label: 'Wellness Pro' },
  { value: 'app_6710001', label: 'Pet Care Plus' },
];

const META_CATALOGS = [
  { value: 'cat_meta_1', label: 'Main Product Catalog (150 SKUs)' },
  { value: 'cat_meta_2', label: 'Seasonal Products (45 SKUs)' },
  { value: 'cat_meta_3', label: 'Sale Items (23 SKUs)' },
  { value: 'cat_meta_4', label: 'New Arrivals (12 SKUs)' },
];

const META_PRODUCT_SETS = [
  { value: 'pset_meta_1', label: 'All Products' },
  { value: 'pset_meta_2', label: 'Best Sellers' },
  { value: 'pset_meta_3', label: 'New Arrivals' },
  { value: 'pset_meta_4', label: 'High AOV (≥$100)' },
  { value: 'pset_meta_5', label: 'Sale Items' },
  { value: 'pset_meta_6', label: 'Out of Stock (Excl)' },
];

const META_PAGES = [
  { value: 'page_123', label: 'Luminaire Vintage Official' },
  { value: 'page_456', label: 'Retro Fashion Daily' },
  { value: 'page_789', label: 'Luminaire Support' },
  { value: 'page_801', label: 'Luminaire EU' },
  { value: 'page_812', label: 'Luminaire APAC' },
  { value: 'page_834', label: 'Wellness by Luminaire' },
];

const META_IG_ACCOUNTS = [
  { value: 'ig_1001', label: '@luminaire.official' },
  { value: 'ig_1002', label: '@luminaire.style' },
  { value: 'ig_1003', label: '@luminaire.eu' },
  { value: 'ig_1004', label: '@luminaire.beauty' },
  { value: 'ig_1005', label: '@retro.fashion.daily' },
  { value: 'ig_1006', label: '@wellness.pro' },
];

const META_VIDEOS = [
  { value: 'vid_meta_1', label: 'Summer Lookbook 2025 (15s)' },
  { value: 'vid_meta_2', label: 'New Arrivals Hero (30s)' },
  { value: 'vid_meta_3', label: 'Brand Story (60s)' },
  { value: 'vid_meta_4', label: 'Customer Testimonial (15s)' },
  { value: 'vid_meta_5', label: 'Black Friday Sale (10s)' },
  { value: 'vid_meta_6', label: 'How to Style (45s)' },
];

const META_IMAGES = [
  { value: 'img_meta_1', label: 'Hero Banner — Summer' },
  { value: 'img_meta_2', label: 'Product Grid — New In' },
  { value: 'img_meta_3', label: 'Lifestyle Shot — Beach' },
  { value: 'img_meta_4', label: 'Carousel Frame 1' },
  { value: 'img_meta_5', label: 'Carousel Frame 2' },
  { value: 'img_meta_6', label: 'Sale Sticker — 50% off' },
];

const META_CUSTOM_AUDIENCES = [
  { value: 'ca_meta_1', label: 'Website Visitors — 30d' },
  { value: 'ca_meta_2', label: 'Purchasers — Last 180d' },
  { value: 'ca_meta_3', label: 'Lead Form Submissions' },
  { value: 'ca_meta_4', label: 'Video Viewers 50%' },
  { value: 'ca_meta_5', label: 'Add to Cart — 7d' },
  { value: 'ca_meta_6', label: 'Email List Upload' },
  { value: 'ca_meta_7', label: 'App Users — 30d' },
  { value: 'ca_meta_8', label: 'Engagers — IG' },
];

const META_LAL_AUDIENCES = [
  { value: 'lal_meta_1', label: 'LAL (US, 1%) — Purchasers' },
  { value: 'lal_meta_2', label: 'LAL (US, 5%) — Purchasers' },
  { value: 'lal_meta_3', label: 'LAL (UK, 1%) — Add to Cart' },
  { value: 'lal_meta_4', label: 'LAL (Global, 10%) — Page View' },
  { value: 'lal_meta_5', label: 'LAL (CA, 3%) — Lead' },
];

const META_SAVED_AUDIENCES = [
  { value: 'sa_meta_1', label: 'High Value Customers (25-55, All)' },
  { value: 'sa_meta_2', label: 'Young Female Shoppers (18-35, F)' },
  { value: 'sa_meta_3', label: 'Male Sports Fans (20-45, M)' },
];

const META_INTERESTS = [
  { value: 'int_1', label: 'Online shopping (~900M)' },
  { value: 'int_2', label: 'Fashion accessories (~550M)' },
  { value: 'int_3', label: 'Luxury goods (~250M)' },
  { value: 'int_4', label: 'E-commerce (~850M)' },
  { value: 'int_5', label: 'Beauty (~750M)' },
  { value: 'int_6', label: 'Fitness (~650M)' },
  { value: 'int_7', label: 'Travel (~750M)' },
  { value: 'int_8', label: 'Sustainable fashion (~175M)' },
  { value: 'int_9', label: 'Home decor (~450M)' },
  { value: 'int_10', label: 'Technology (~1.1B)' },
  { value: 'int_11', label: 'Wellness (~375M)' },
  { value: 'int_12', label: 'Lifestyle (~650M)' },
  { value: 'int_13', label: 'Skincare (~350M)' },
  { value: 'int_14', label: 'Yoga (~275M)' },
  { value: 'int_15', label: 'Outdoor activities (~450M)' },
];

const META_BEHAVIORS = [
  { value: 'beh_1', label: 'Engaged Shoppers (Online buyers ≥1×/30d)' },
  { value: 'beh_2', label: 'Frequent Travelers' },
  { value: 'beh_3', label: 'Small business owners' },
  { value: 'beh_4', label: 'Tech early adopters' },
  { value: 'beh_5', label: 'Mobile device — high-end iOS' },
  { value: 'beh_6', label: 'Mobile device — high-end Android' },
  { value: 'beh_7', label: 'Returning from travel within 1 wk' },
];

const META_CONNECTIONS = [
  { value: 'conn_1', label: 'People who like Luminaire Vintage Official' },
  { value: 'conn_2', label: 'Friends of people who like Luminaire' },
  { value: 'conn_3', label: 'People who used Luminaire iOS App' },
  { value: 'conn_4', label: 'People who responded to Summer Sale event' },
];

const META_DEVICE_MODELS = [
  { value: 'iPhone_15_Pro_Max', label: 'iPhone 15 Pro Max' },
  { value: 'iPhone_15',          label: 'iPhone 15' },
  { value: 'iPhone_14_Pro',      label: 'iPhone 14 Pro' },
  { value: 'Galaxy_S24_Ultra',   label: 'Samsung Galaxy S24 Ultra' },
  { value: 'Galaxy_S23',         label: 'Samsung Galaxy S23' },
  { value: 'Pixel_8_Pro',        label: 'Google Pixel 8 Pro' },
  { value: 'iPad_Pro_M2',        label: 'iPad Pro (M2)' },
];

// ─── TikTok 资源 ───
const TIKTOK_IDENTITIES = [
  { value: 'tt_id_1', label: '@luminaire.official (TikTok user)' },
  { value: 'tt_id_2', label: '@luminaire.style (TikTok user)' },
  { value: 'tt_id_3', label: 'Luminaire Brand Account (Customized)' },
  { value: 'tt_id_4', label: 'Luminaire EU (BC-authorized)' },
  { value: 'tt_id_5', label: 'Wellness Pro (Customized)' },
  { value: 'tt_id_6', label: '@beauty.box.tt' },
];

const TIKTOK_BC_ACCOUNTS = [
  { value: 'bc_tt_1', label: 'Luminaire Business Center' },
  { value: 'bc_tt_2', label: 'Wellness Pro BC' },
  { value: 'bc_tt_3', label: 'Beauty Box BC' },
];

// TikTok pixel events 命名按 TikTok Business API（CONVERT/PURCHASE/PLACE_AN_ORDER 等）
const TIKTOK_PIXELS = [
  {
    value: 'tt_pix_1', label: 'Main Site Pixel — Luminaire (TikTok)',
    events: ['COMPLETE_PAYMENT', 'PLACE_AN_ORDER', 'INITIATE_CHECKOUT', 'ADD_TO_CART', 'VIEW_CONTENT', 'CLICK_BUTTON'],
  },
  {
    value: 'tt_pix_2', label: 'Checkout Pixel (TikTok)',
    events: ['COMPLETE_PAYMENT', 'PLACE_AN_ORDER', 'INITIATE_CHECKOUT', 'ADD_PAYMENT_INFO'],
  },
  {
    value: 'tt_pix_3', label: 'Lead Form Pixel (TikTok)',
    events: ['FORM', 'CONTACT', 'SUBMIT_FORM', 'COMPLETE_REGISTRATION'],
  },
  {
    value: 'tt_pix_4', label: 'Mobile Web Pixel (TikTok)',
    events: ['VIEW_CONTENT', 'CLICK_BUTTON', 'ADD_TO_CART', 'PLACE_AN_ORDER'],
  },
  {
    value: 'tt_pix_5', label: 'Brand Awareness Pixel (TikTok)',
    events: ['VIEW_CONTENT', 'CLICK_BUTTON'],
  },
];

const TIKTOK_APPS = [
  { value: 'tt_app_1', label: 'Luminaire iOS (TikTok-tracked)' },
  { value: 'tt_app_2', label: 'Luminaire Android (TikTok-tracked)' },
  { value: 'tt_app_3', label: 'Beauty Box iOS' },
  { value: 'tt_app_4', label: 'Beauty Box Android' },
  { value: 'tt_app_5', label: 'Wellness Pro Android' },
];

const TIKTOK_CATALOGS = [
  { value: 'tt_cat_1', label: 'TikTok Catalog — Main' },
  { value: 'tt_cat_2', label: 'TikTok Catalog — Sale' },
  { value: 'tt_cat_3', label: 'TikTok Catalog — New' },
  { value: 'tt_cat_4', label: 'TikTok Shop Catalog' },
];

const TIKTOK_STORES = [
  { value: 'tt_store_1', label: 'Luminaire TikTok Shop — US' },
  { value: 'tt_store_2', label: 'Luminaire TikTok Shop — UK' },
  { value: 'tt_store_3', label: 'Luminaire TikTok Shop — SG' },
];

const TIKTOK_PRODUCT_SETS = [
  { value: 'tt_pset_1', label: 'TikTok All Products' },
  { value: 'tt_pset_2', label: 'TikTok Best Sellers' },
  { value: 'tt_pset_3', label: 'TikTok New Arrivals' },
  { value: 'tt_pset_4', label: 'TikTok Live-Featured' },
];

const TIKTOK_VIDEOS = [
  { value: 'tt_vid_1', label: 'TikTok 9:16 Hero — Summer (15s)' },
  { value: 'tt_vid_2', label: 'TikTok 9:16 Product Showcase (30s)' },
  { value: 'tt_vid_3', label: 'TikTok 9:16 Tutorial (45s)' },
  { value: 'tt_vid_4', label: 'TikTok Spark — UGC #1 (15s)' },
  { value: 'tt_vid_5', label: 'TikTok Spark — UGC #2 (20s)' },
];

const TIKTOK_IMAGES = [
  { value: 'tt_img_1', label: 'TikTok 1:1 Hero Banner' },
  { value: 'tt_img_2', label: 'TikTok 9:16 Static Frame' },
  { value: 'tt_img_3', label: 'TikTok 1:1 Product Grid' },
  { value: 'tt_img_4', label: 'TikTok Logo Brand' },
];

const TIKTOK_MUSIC = [
  { value: 'tt_mus_1', label: 'Trending — Summer Vibes' },
  { value: 'tt_mus_2', label: 'Trending — Glow Up' },
  { value: 'tt_mus_3', label: 'Brand — Luminaire Original' },
  { value: 'tt_mus_4', label: 'Trending — Aesthetic Indie' },
  { value: 'tt_mus_5', label: 'Trending — Hip Pop' },
];

const TIKTOK_CARDS = [
  { value: 'tt_card_1', label: 'Display Card — Summer Sale 50%' },
  { value: 'tt_card_2', label: 'Gift Code Card — WELCOME10' },
  { value: 'tt_card_3', label: 'Countdown Sticker — Black Friday' },
  { value: 'tt_card_4', label: 'Voting Sticker — Style Quiz' },
];

const TIKTOK_AUDIENCES = [
  { value: 'tt_aud_1', label: 'Engagement (TT) — 30d' },
  { value: 'tt_aud_2', label: 'Video Viewers 50% (TT)' },
  { value: 'tt_aud_3', label: 'Site Visitors (TT) — 30d' },
  { value: 'tt_aud_4', label: 'Customer File Upload (TT)' },
  { value: 'tt_aud_5', label: 'LAL US 1% — Purchasers' },
  { value: 'tt_aud_6', label: 'LAL Global 5% — Engagers' },
  { value: 'tt_aud_7', label: 'App Users — Active 14d' },
];

const TIKTOK_INTEREST_KEYWORDS = [
  { value: 'tt_kw_1', label: '美妆 Beauty' },
  { value: 'tt_kw_2', label: '护肤 Skincare' },
  { value: 'tt_kw_3', label: '时尚 Fashion' },
  { value: 'tt_kw_4', label: '健身 Fitness' },
  { value: 'tt_kw_5', label: '旅行 Travel' },
  { value: 'tt_kw_6', label: '科技 Technology' },
  { value: 'tt_kw_7', label: '宠物 Pets' },
  { value: 'tt_kw_8', label: '游戏 Gaming' },
];

const TIKTOK_INTEREST_CATEGORIES = [
  { value: 'tt_cat_int_1', label: 'Beauty & Personal Care' },
  { value: 'tt_cat_int_2', label: 'Apparel & Accessories' },
  { value: 'tt_cat_int_3', label: 'Home & Garden' },
  { value: 'tt_cat_int_4', label: 'Sports & Outdoor' },
  { value: 'tt_cat_int_5', label: 'Food & Beverage' },
  { value: 'tt_cat_int_6', label: 'Pets' },
  { value: 'tt_cat_int_7', label: 'Travel & Hospitality' },
];

const TIKTOK_SPARK_POSTS = [
  { value: 'spark_1', label: '@luminaire.official · Summer Lookbook · 15s' },
  { value: 'spark_2', label: '@luminaire.style · How to Mix & Match · 30s' },
  { value: 'spark_3', label: '@beauty.box.tt · Get Ready With Me · 45s' },
  { value: 'spark_4', label: '@luminaire.official · Customer Reviews · 20s' },
];

const TIKTOK_INSTANT_PAGES = [
  { value: 'ip_1', label: 'Luminaire — Summer Collection Landing' },
  { value: 'ip_2', label: 'Luminaire — Lead Generation Form' },
  { value: 'ip_3', label: 'Luminaire — Product Showcase' },
];

const TIKTOK_PANGLE_AUDIENCE_PACKAGES = [
  { value: 'pan_pkg_1', label: 'Pangle — Premium Apps (Tier A)' },
  { value: 'pan_pkg_2', label: 'Pangle — Casual Games (Tier B)' },
  { value: 'pan_pkg_3', label: 'Pangle — News & Reading' },
];

const TIKTOK_OFFLINE_EVENT_SETS = [
  { value: 'oes_tt_1', label: 'Offline POS — In-Store Purchase' },
  { value: 'oes_tt_2', label: 'Offline — Showroom Visits' },
  { value: 'oes_tt_3', label: 'Offline — Phone Inquiries' },
];

const TIKTOK_BRAND_LOGOS = [
  { value: 'logo_tt_1', label: 'Luminaire Logo — White' },
  { value: 'logo_tt_2', label: 'Luminaire Logo — Black' },
  { value: 'logo_tt_3', label: 'Wellness Pro Logo' },
];

const TIKTOK_DEVICE_MODELS = [
  { value: 'iPhone15ProMax', label: 'iPhone 15 Pro Max' },
  { value: 'iPhone15',       label: 'iPhone 15' },
  { value: 'iPhone14Pro',    label: 'iPhone 14 Pro' },
  { value: 'GalaxyS24Ultra', label: 'Samsung Galaxy S24 Ultra' },
  { value: 'GalaxyS23',      label: 'Samsung Galaxy S23' },
  { value: 'Pixel8Pro',      label: 'Google Pixel 8 Pro' },
];

const TIKTOK_ISPS = [
  { value: 'isp_1', label: 'Comcast (US)' }, { value: 'isp_2', label: 'AT&T (US)' },
  { value: 'isp_3', label: 'Verizon (US)' }, { value: 'isp_4', label: 'BT (UK)' },
  { value: 'isp_5', label: 'Vodafone (Global)' },
];

const TIKTOK_CARRIERS = [
  { value: 'car_1', label: 'AT&T Mobility' }, { value: 'car_2', label: 'T-Mobile' },
  { value: 'car_3', label: 'Verizon Wireless' }, { value: 'car_4', label: 'EE (UK)' },
  { value: 'car_5', label: 'NTT Docomo (JP)' },
];

const TIKTOK_LOCATIONS = [
  { value: '6252001', label: '美国 / United States' },
  { value: '2635167', label: '英国 / United Kingdom' },
  { value: '6251999', label: '加拿大 / Canada' },
  { value: '2077456', label: '澳大利亚 / Australia' },
  { value: '2921044', label: '德国 / Germany' },
  { value: '3017382', label: '法国 / France' },
  { value: '1861060', label: '日本 / Japan' },
  { value: '1880251', label: '新加坡 / Singapore' },
  { value: '3469034', label: '巴西 / Brazil' },
  { value: '1269750', label: '印度 / India' },
  { value: '1814991', label: '中国 / China' },
  { value: '1835841', label: '韩国 / Korea' },
  { value: '1733045', label: '马来西亚 / Malaysia' },
  { value: '1819730', label: '香港 / Hong Kong' },
  { value: '1668284', label: '台湾 / Taiwan' },
];

// ─── Resource registry ───
const REGISTRY = {
  // 共享
  countries:       () => COUNTRIES,
  // Meta
  'meta:pixels':           () => META_PIXELS,
  'meta:apps':             () => META_APPS,
  'meta:catalogs':         () => META_CATALOGS,
  'meta:productSets':      () => META_PRODUCT_SETS,
  'meta:pages':            () => META_PAGES,
  'meta:igAccounts':       () => META_IG_ACCOUNTS,
  'meta:videos':           () => META_VIDEOS,
  'meta:images':           () => META_IMAGES,
  'meta:customAudiences':  () => META_CUSTOM_AUDIENCES,
  'meta:lalAudiences':     () => META_LAL_AUDIENCES,
  'meta:savedAudiences':   () => META_SAVED_AUDIENCES,
  'meta:interests':        () => META_INTERESTS,
  'meta:behaviors':        () => META_BEHAVIORS,
  'meta:connections':      () => META_CONNECTIONS,
  'meta:deviceModels':     () => META_DEVICE_MODELS,
  'meta:countries':        () => COUNTRIES,
  'meta:regions':          (ctx) => {
    const codes = ctx?.countries || Object.keys(REGIONS);
    return codes.flatMap(c => REGIONS[c] || []);
  },
  'meta:cities':           (ctx) => {
    const codes = ctx?.countries || Object.keys(CITIES);
    return codes.flatMap(c => CITIES[c] || []);
  },
  'meta:zips':             (ctx) => {
    const codes = ctx?.countries || Object.keys(ZIPS);
    return codes.flatMap(c => ZIPS[c] || []);
  },
  // TikTok
  'tiktok:identities':              () => TIKTOK_IDENTITIES,
  'tiktok:bcAccounts':              () => TIKTOK_BC_ACCOUNTS,
  'tiktok:pixels':                  () => TIKTOK_PIXELS,
  'tiktok:apps':                    () => TIKTOK_APPS,
  'tiktok:catalogs':                () => TIKTOK_CATALOGS,
  'tiktok:stores':                  () => TIKTOK_STORES,
  'tiktok:productSets':             () => TIKTOK_PRODUCT_SETS,
  'tiktok:videos':                  () => TIKTOK_VIDEOS,
  'tiktok:images':                  () => TIKTOK_IMAGES,
  'tiktok:music':                   () => TIKTOK_MUSIC,
  'tiktok:cards':                   () => TIKTOK_CARDS,
  'tiktok:audiences':               () => TIKTOK_AUDIENCES,
  'tiktok:interestKeywords':        () => TIKTOK_INTEREST_KEYWORDS,
  'tiktok:interestCategories':      () => TIKTOK_INTEREST_CATEGORIES,
  'tiktok:sparkPosts':              () => TIKTOK_SPARK_POSTS,
  'tiktok:instantPages':            () => TIKTOK_INSTANT_PAGES,
  'tiktok:pangleAudiencePackages':  () => TIKTOK_PANGLE_AUDIENCE_PACKAGES,
  'tiktok:offlineEventSets':        () => TIKTOK_OFFLINE_EVENT_SETS,
  'tiktok:brandLogos':              () => TIKTOK_BRAND_LOGOS,
  'tiktok:deviceModels':            () => TIKTOK_DEVICE_MODELS,
  'tiktok:isps':                    () => TIKTOK_ISPS,
  'tiktok:carriers':                () => TIKTOK_CARRIERS,
  'tiktok:locations':               () => TIKTOK_LOCATIONS,
};

/**
 * 获取资源选项数组，统一返回 [{value, label}]。
 * @param {string} key  形如 'meta:pixels' / 'tiktok:identities' / 'countries'
 * @param {object} [ctx]  可选上下文（如 { countries: ['US','GB'] }，让 cities/regions 派生）
 */
export function getResource(key, ctx) {
  const fn = REGISTRY[key];
  if (!fn) return [];
  return fn(ctx) || [];
}

/**
 * Phase 2.I：根据 channel + pixelId 取该 pixel 的事件列表。
 * 用于 AdsetDetailPanel 三段式（成效目标 → Pixel → Event）的第三段。
 * @param {'meta'|'tiktok'} channel
 * @param {string} pixelId
 * @returns {string[]}  事件名列表（不带 label，直接是 SDK event name）
 */
export function getPixelEvents(channel, pixelId) {
  if (!pixelId) return [];
  const pool = channel === 'tiktok' ? TIKTOK_PIXELS : META_PIXELS;
  const px = pool.find(p => p.value === pixelId);
  return px?.events || [];
}

// 直接导出常用集合（便于在 fields 文件中静态引用）
export {
  META_PIXELS, META_APPS, META_CATALOGS, META_PRODUCT_SETS, META_PAGES,
  META_IG_ACCOUNTS, META_VIDEOS, META_IMAGES, META_CUSTOM_AUDIENCES,
  META_LAL_AUDIENCES, META_SAVED_AUDIENCES, META_INTERESTS, META_BEHAVIORS,
  META_CONNECTIONS, META_DEVICE_MODELS,
  TIKTOK_IDENTITIES, TIKTOK_BC_ACCOUNTS, TIKTOK_PIXELS, TIKTOK_APPS,
  TIKTOK_CATALOGS, TIKTOK_STORES, TIKTOK_PRODUCT_SETS, TIKTOK_VIDEOS,
  TIKTOK_IMAGES, TIKTOK_MUSIC, TIKTOK_CARDS, TIKTOK_AUDIENCES,
  TIKTOK_INTEREST_KEYWORDS, TIKTOK_INTEREST_CATEGORIES, TIKTOK_SPARK_POSTS,
  TIKTOK_INSTANT_PAGES, TIKTOK_PANGLE_AUDIENCE_PACKAGES, TIKTOK_OFFLINE_EVENT_SETS,
  TIKTOK_BRAND_LOGOS, TIKTOK_DEVICE_MODELS, TIKTOK_ISPS, TIKTOK_CARRIERS,
  TIKTOK_LOCATIONS,
  REGIONS, CITIES, ZIPS,
};
