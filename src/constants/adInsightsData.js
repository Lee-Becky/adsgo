// Ad Insights Mock Data
export const CAMPAIGN_CARDS = [
  {
    id: '01',
    hasImage: true,
    currentImgIndex: 0,
    selected: true,
    cta: 'Shop Now',
    headline: '🔴 BIG SALE | -30% On All Products!',
    text: '🔥For a short period of time, we will be selling ALL our products...',
    audience: 'Fashion Lovers',
    age: '18-45',
    gender: 'Female',
    interests: 'Fashion, Zara, H&M, Design, Art, Photography, Shopping, OOTD, Style, Trends, Luxury, Vogue'
  },
  {
    id: '02',
    hasImage: false,
    currentImgIndex: 0,
    selected: true,
    cta: 'Shop Now',
    headline: 'Free Shipping',
    text: 'Limited time offer...',
    audience: 'Tech Enthusiasts',
    age: '21-50',
    gender: 'All',
    interests: 'Gadgets, Apple, Tech, Coding, Python, Java, Startups, Innovation, Silicon Valley, AI, VR'
  },
  {
    id: '03',
    hasImage: true,
    currentImgIndex: 1,
    selected: true,
    cta: 'Shop Now',
    headline: 'New Arrivals',
    text: 'Check out our latest collection...',
    audience: 'Students',
    age: '18-24',
    gender: 'Female',
    interests: 'Books, Study, Campus, University, Exams, Library, Coffee, Notes'
  },
  {
    id: '04',
    hasImage: false,
    currentImgIndex: 0,
    selected: true,
    cta: 'Shop Now',
    headline: 'Best Sellers',
    text: 'Top rated products just for you...',
    audience: 'Parents',
    age: '30-60',
    gender: 'All',
    interests: 'Kids, Toys, Home, Family, Education, Baby, Parenting, Care'
  },
  {
    id: '05',
    hasImage: true,
    currentImgIndex: 2,
    selected: true,
    cta: 'Shop Now',
    headline: 'Exclusive Deal',
    text: 'Don\'t miss out on this amazing deal...',
    audience: 'Lookalike Audience',
    age: '18-35',
    gender: 'Male',
    interests: 'Soccer, NBA, Nike, Adidas, Gym, Fitness, Running, Health, Workout'
  }
];

export const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
];

export const AUDIENCE_INSIGHTS = [
  { name: 'Local Diners', tags: ['Neighborhood restaurants', 'Classic diners', 'Local comfort food', 'Family-owned eateries'], cpa: '2.8', spend: '455', campaigns: 11, value: 45 },
  { name: 'Fast Food Lovers', tags: ['Burger enthusiasts', 'Fried chicken fans', 'Street food lovers', 'Quick bites seekers', 'Pizza addicts'], cpa: '1.5', spend: '282', campaigns: 8, value: 30 },
  { name: 'Latino Community', tags: ['Hispanic culture', 'Latin music', 'Spanish language', 'Latino heritage', 'Latin American cuisine'], cpa: '2.2', spend: '101', campaigns: 9, value: 25 }
];

export const PAGE_INSIGHTS = [
  { url: 'https://www.goodkarmasj.com/', cvr: '1.88%', spend: '325', campaigns: 3, value: 60 },
  { url: 'https://www.goodkarmasj.com/s/order', cvr: '1.72%', spend: '675', campaigns: 2, value: 40 }
];

export const TOP_ADS = [
  {
    id: 1,
    ctr: '2.38%',
    cpa: '7.8',
    campaigns: 12,
    primaryText: 'Enjoy homestyle meals prepared with love at your neighborhood diners.',
    mediaUrl: 'https://moss-sin.oss-ap-southeast-1.aliyuncs.com/moss/ads-go/ming.liu%40cyberklick.com/dd7fd439-73ec-4e9a-a239-8e64c693c43a_1761804589151.png?Expires=2077164589&OSSAccessKeyId=LTAI5tKypoDZqosA5d64u2Ph&Signature=8ogiTputUbUCumH9fUUrIlytDTo%3D',
    footerBrand: 'Discover Local Diners Near You',
    footerDesc: 'Authentic Flavors & Cozy Atmosphere'
  },
  {
    id: 2,
    ctr: '6.95%',
    cpa: '3.7',
    campaigns: 10,
    primaryText: 'Craving something quick and tasty? Discover top-rated fast food spots near you.',
    mediaUrl: 'https://moss-sin.oss-ap-southeast-1.aliyuncs.com/moss/ads-go/ming.liu%40cyberklick.com/5bf3cf2a-9adf-4805-bd54-0e5169ef13eb_1761804588479.png?Expires=2077164588&OSSAccessKeyId=LTAI5tKypoDZqosA5d64u2Ph&Signature=Y52X1YBQ1jWpTmNnvDoH3cESZWo%3D',
    footerBrand: 'For True Fast Food Lovers',
    footerDesc: 'Grab Your Favorite Bite Anytime'
  },
  {
    id: 3,
    ctr: '6.12%',
    cpa: '5.6',
    campaigns: 7,
    primaryText: 'Join your local Latino community in celebrating culture, music, and food.',
    mediaUrl: 'https://moss-sin.oss-ap-southeast-1.aliyuncs.com/moss/ads-go/ming.liu%40cyberklick.com/94c0d1b1-e5b6-4e67-9e49-1343bb9d6feb_1761804586858.png?Expires=2077164587&OSSAccessKeyId=LTAI5tKypoDZqosA5d64u2Ph&Signature=0XBSEHrhAKFBnyqcrF3b7p0IHNU%3D',
    footerBrand: 'Celebrate Latino Culture',
    footerDesc: 'Discover Local Latino Events'
  }
];

export const SCATTER_DATA = [
  { x: 2.38, y: 7.8 }, { x: 6.95, y: 3.7 }, { x: 6.12, y: 5.6 },
  { x: 3.5, y: 6.2 }, { x: 4.8, y: 4.5 }, { x: 5.2, y: 5.1 },
  { x: 2.1, y: 8.5 }, { x: 7.5, y: 3.2 }, { x: 4.2, y: 5.8 }
];

export const PLATFORM_LOGOS = {
  'Meta': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
  'Google': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
  'TikTok': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
  'Bing': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256'
};
