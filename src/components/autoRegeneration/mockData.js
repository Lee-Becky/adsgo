// Ad Regeneration Mock Data - 独立数据文件，实现闭环管理

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
    hasImage: true,
    currentImgIndex: 2,
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

export const PLATFORM_LOGOS = {
  'Meta': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
  'Google': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
  'TikTok': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
  'Bing': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256'
};
