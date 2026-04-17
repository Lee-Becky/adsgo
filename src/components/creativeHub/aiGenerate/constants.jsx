import { MOCK_PRODUCTS } from '../../brand/products/mockData';

// ─── Image Helpers (Picsum seed-based) ────────────────────
export function productImg(productIdx, angleIdx = 0) {
  return `https://picsum.photos/seed/p${productIdx}a${angleIdx}/300/300`;
}
export function templateImg(styleIdx) {
  return `https://picsum.photos/seed/tmpl${styleIdx}/300/300`;
}
export function resultImg(idx, w, h) {
  return `https://picsum.photos/seed/creative${idx}/${w}/${h}`;
}

export function buildResultUrls(qty, ratios, seedOffset) {
  const urls = [];
  ratios.forEach((ratio, ri) => {
    const [w, h] = ratio.split(':').map(Number);
    for (let i = 0; i < qty; i++) {
      urls.push({
        ratio,
        src: resultImg(seedOffset + ri * qty + i, 400, Math.round(400 * h / w)),
        w,
        h,
      });
    }
  });
  return urls;
}

// ─── Chat: Product Sources ────────────────────────────────
export const CHAT_SOURCES = [
  { id: 'url',        name: 'Product URL',         desc: 'Paste any product page link',               status: 'url' },
  { id: 'myproducts', name: 'My Products',          desc: 'Select from your products in AdsGo',        status: 'myproducts' },
  { id: 'thirdparty', name: 'Third-party Products', desc: 'Select from Shopify, Meta Catalog, Google MC', status: 'thirdparty' },
];

export const THIRD_PARTY_PLATFORMS = [
  { id: 'shopify', name: 'Shopify',      desc: 'mystore.myshopify.com', status: 'connected' },
  { id: 'meta',    name: 'Meta Catalog', desc: 'Not connected',         status: 'disconnected' },
  { id: 'gmc',     name: 'Google MC',    desc: 'Not connected',         status: 'disconnected' },
];

// ─── Chat: Products ───────────────────────────────────────
export const CHAT_PRODUCTS = [
  { name: 'Ceramic Face Wash',     cat: 'Skincare',     price: '$28',  pic: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop', url: 'mystore.com/products/ceramic-face-wash' },
  { name: 'Rose Gold Watch',       cat: 'Accessories',  price: '$299', pic: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop', url: 'mystore.com/products/rose-gold-watch' },
  { name: 'Minimalist Sneakers',   cat: 'Footwear',     price: '$120', pic: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', url: 'mystore.com/products/minimalist-sneakers' },
  { name: 'Polarized Sunglasses',  cat: 'Accessories',  price: '$85',  pic: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop', url: 'mystore.com/products/polarized-sunglasses' },
  { name: 'Wireless Headphones',   cat: 'Electronics',  price: '$199', pic: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop', url: 'mystore.com/products/wireless-headphones' },
];

// My Products — mapped from brand product list
export const MY_PRODUCTS = MOCK_PRODUCTS.map(p => ({
  name: p.name,
  cat: p.category.includes(' > ') ? p.category.split(' > ').pop() : p.category,
  price: '',
  pic: p.image,
  url: p.url,
}));

export const CHAT_PRODUCT_INFO = [
  { title: 'Ceramic Face Wash', audience: 'Women ages 20–35, skincare enthusiasts', sellingPoints: ['Deep cleanse without stripping moisture', 'Ceramide-infused for skin barrier repair', 'Gentle on sensitive & combination skin'], originalPrice: '$45.00', promoPrice: '$28.00', promoText: 'Limited time — save $17 today!', brandColors: ['#C4956A', '#F5EDE3', '#3D2B1F'] },
  { title: 'Rose Gold Watch', audience: 'Women 25–45, fashion-conscious professionals', sellingPoints: ['Swiss quartz movement for precision', 'Premium stainless steel case & strap', 'Water resistant up to 30m'], originalPrice: '$450.00', promoPrice: '$299.00', promoText: 'Holiday sale — $151 off, ends Sunday!', brandColors: ['#B76E79', '#F8E8EA', '#2C2C2C'] },
  { title: 'Minimalist Sneakers', audience: 'Streetwear fans, ages 18–35', sellingPoints: ['Lightweight EVA sole for all-day comfort', 'Breathable mesh upper stays cool', 'Versatile for casual & smart looks'], originalPrice: '$180.00', promoPrice: '$120.00', promoText: 'Flash sale — 33% off, today only!', brandColors: ['#F5F5F5', '#222222', '#CCCCCC'] },
  { title: 'Polarized Sunglasses', audience: 'Outdoor lovers, ages 22–45', sellingPoints: ['100% UV400 polarized protection', 'Lightweight TR-90 frame, ultra-durable', '8 colorway options available'], originalPrice: '$130.00', promoPrice: '$85.00', promoText: 'Summer deal — buy 2 get free shipping!', brandColors: ['#1A1A1A', '#C5A028', '#F0F0F0'] },
  { title: 'Wireless Headphones', audience: 'Music lovers & commuters, ages 18–40', sellingPoints: ['40-hour playtime per single charge', 'Active noise cancellation, 3 levels', 'Hi-Res Audio certified sound'], originalPrice: '$299.00', promoPrice: '$199.00', promoText: 'Limited stock — $100 off while it lasts!', brandColors: ['#1A1A2E', '#E94560', '#F5F5F5'] },
];

export const CHAT_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1570194065650-d99fb4b61aa6?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505944357431-27579db47558?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576426863848-c21f422e2869?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1613440591283-2ee2b0c37ea4?w=400&h=400&fit=crop',
];

// ─── Chat: Templates ──────────────────────────────────────
export const CHAT_TEMPLATES = [
  // Recommended
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', style: 'Minimal',    recommended: true },
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', style: 'Lifestyle',  recommended: true },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', style: 'Bold',      recommended: true },
  { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop', style: 'Sale',      recommended: true },
  { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: true },
  // Minimal
  { url: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=300&h=300&fit=crop', style: 'Minimal', recommended: false },
  { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop', style: 'Minimal', recommended: false },
  { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop', style: 'Minimal', recommended: false },
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', style: 'Minimal', recommended: false },
  { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop', style: 'Minimal', recommended: false },
  // Lifestyle
  { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop', style: 'Lifestyle', recommended: false },
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop', style: 'Lifestyle', recommended: false },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop', style: 'Lifestyle', recommended: false },
  { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop', style: 'Lifestyle', recommended: false },
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop', style: 'Lifestyle', recommended: false },
  // Bold
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', style: 'Bold', recommended: false },
  { url: 'https://images.unsplash.com/photo-1603217040830-17e6dafea4ac?w=300&h=300&fit=crop', style: 'Bold', recommended: false },
  { url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop', style: 'Bold', recommended: false },
  { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=300&fit=crop', style: 'Bold', recommended: false },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', style: 'Bold', recommended: false },
  // Fashion
  { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', style: 'Fashion', recommended: false },
  { url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=300&h=300&fit=crop', style: 'Fashion', recommended: false },
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop', style: 'Fashion', recommended: false },
  { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop', style: 'Fashion', recommended: false },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop', style: 'Fashion', recommended: false },
  // E-Commerce
  { url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: false },
  { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: false },
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: false },
  { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: false },
  { url: 'https://images.unsplash.com/photo-1583394293214-0d78e73e6a04?w=300&h=300&fit=crop', style: 'E-Commerce', recommended: false },
  // Sale
  { url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&h=300&fit=crop', style: 'Sale', recommended: false },
  { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop', style: 'Sale', recommended: false },
  { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=300&fit=crop', style: 'Sale', recommended: false },
  { url: 'https://images.unsplash.com/photo-1603217040830-17e6dafea4ac?w=300&h=300&fit=crop', style: 'Sale', recommended: false },
  { url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop', style: 'Sale', recommended: false },
  // Product
  { url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=300&h=300&fit=crop', style: 'Product', recommended: false },
  { url: 'https://images.unsplash.com/photo-1583394293214-0d78e73e6a04?w=300&h=300&fit=crop', style: 'Product', recommended: false },
  { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', style: 'Product', recommended: false },
  { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop', style: 'Product', recommended: false },
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', style: 'Product', recommended: false },
];

// ─── Chat: Suggestion chips ───────────────────────────────
export const CHAT_SUGGESTIONS = [
  'Add a "20% OFF" badge in the corner',
  'Use warm sunset tones for summer feel',
  'Include product name as headline text',
  'Luxury aesthetic with dark background',
  'Bright & colorful lifestyle shot',
  'Minimalist clean white background',
  'Add a limited-time offer banner',
  'Show product in an outdoor setting',
  'Use bold typography for the tagline',
];

// ─── Chat: Ratio options ──────────────────────────────────
export const CHAT_IMG_RATIO_OPTIONS = [
  { v: '1:1',    tip: 'Feed Posts' },
  { v: '4:5',    tip: 'Instagram Feeds' },
  { v: '9:16',   tip: 'Stories & Reels' },
  { v: '16:9',   tip: 'YouTube & Banners' },
  { v: '1.91:1', tip: 'Google Display Ads' },
];

export const CHAT_IMG_RATIO_MORE_OPTIONS = [
  { v: '3:4',  tip: 'Portrait' },
  { v: '4:3',  tip: 'Landscape' },
  { v: '2:3',  tip: 'Portrait' },
  { v: '3:2',  tip: 'Landscape' },
  { v: '5:4',  tip: 'Near Square' },
  { v: '21:9', tip: 'Ultrawide' },
];

// ─── History seed data ────────────────────────────────────
const now = Date.now();
const D = 1000 * 60 * 60 * 24;

export const HISTORY_SEED = [
  { id: 2, type: 'video', status: 'processing', prompt: 'Abstract fluid motion in purple and gold', productTitle: 'AirPods Pro Max', date: 'Today', timestamp: now, preview: null, ratio: '9:16', productUrl: 'mystore.com/products/airpods-pro-max' },
  { id: 1, type: 'image', status: 'completed', prompt: 'Modern minimalist living room with large windows', productTitle: 'Ceramic Face Wash', date: 'Today', timestamp: now - 30 * 60 * 1000, preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop', ratio: '1:1', imageCount: 4, isNew: true, timeLabel: '2:30 PM', productUrl: 'mystore.com/products/ceramic-face-wash' },
  { id: 3, type: 'image', status: 'completed', prompt: 'Futuristic city skyline at night, cyber lighting', productTitle: 'Running Shoes Pro', date: 'Today', timestamp: now - 120 * 60 * 1000, preview: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=800&fit=crop', ratio: '16:9', imageCount: 1, isNew: true, timeLabel: '1:00 PM', productUrl: 'mystore.com/products/running-shoes-pro' },
  { id: 4, type: 'image', status: 'completed', prompt: 'Organic skincare product shots on marble', productTitle: 'Hydrating Serum', date: 'Yesterday', timestamp: now - D, preview: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', ratio: '4:5', imageCount: 4, timeLabel: '9:15 AM', productUrl: 'mystore.com/products/hydrating-serum' },
  { id: 5, type: 'video', status: 'failed', prompt: 'Aerial view of coastline waves crashing', productTitle: 'Smart Watch Series 9', date: 'Yesterday', timestamp: now - D - 2 * 60 * 60 * 1000, preview: null, ratio: '16:9', timeLabel: '6:45 AM', productUrl: 'mystore.com/products/smart-watch-series-9' },
  { id: 6, type: 'image', status: 'completed', prompt: 'Japanese zen garden in autumn', productTitle: 'Matcha Powder Premium', date: 'Past 7 Days', timestamp: now - 5 * D, preview: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&h=800&fit=crop', ratio: '1:1', imageCount: 4, timeLabel: '3:20 PM', productUrl: 'mystore.com/products/matcha-powder' },
  { id: 7, type: 'image', status: 'completed', prompt: 'Premium metal water bottle on stone', productTitle: 'Steel Water Bottle', date: 'Past 30 Days', timestamp: now - 12 * D, preview: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=800&fit=crop', ratio: '4:5', imageCount: 1, timeLabel: '11:10 AM', productUrl: 'mystore.com/products/steel-water-bottle' },
];

// Example cases (shown at bottom of history sidebar)
export const EXAMPLE_CASES = [
  { id: 'ex1', preview: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', prompt: 'Hollow Platform Sandals', productUrl: 'yourstore.com/products/hollow-platform-slides', ratio: '1:1', imageCount: 1 },
  { id: 'ex2', preview: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop', prompt: 'Human Hair Topper', productUrl: 'yourstore.com/products/real-human-hair-topper', ratio: '1:1', imageCount: 1 },
  { id: 'ex3', preview: 'https://images.unsplash.com/photo-1583394293214-0d78e73e6a04?w=300&h=300&fit=crop', prompt: 'Fabric Storage Bin', productUrl: 'yourstore.com/products/fabric-storage-bin', ratio: '1:1', imageCount: 1 },
  { id: 'ex4', preview: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop', prompt: 'Camp Collar Shirt', productUrl: 'yourstore.com/products/camp-collar-shirt', ratio: '1:1', imageCount: 1 },
];

// ─── Shared UI Components ─────────────────────────────────

/** Tiny bordered rectangle representing an aspect ratio visually */
export function RatioBox({ v, className = '' }) {
  const parts = v.split(':').map(Number);
  const [rw, rh] = parts;
  const maxDim = 15;
  const scale = Math.min(maxDim / rw, maxDim / rh);
  const bw = Math.max(2, Math.round(rw * scale));
  const bh = Math.max(2, Math.round(rh * scale));
  return (
    <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${className}`}>
      <span className="border border-current rounded-[1px]" style={{ width: bw, height: bh }} />
    </span>
  );
}

/** AdsGo branded AI avatar SVG — uid prevents duplicate SVG filter IDs */
export function AiAvatar({ uid = 'a', size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="37" height="37" rx="18.5" fill="white"/>
      <rect x="1.5" y="1.5" width="37" height="37" rx="18.5" stroke="#F5F1FF" strokeWidth="3"/>
      <g clipPath={`url(#clip_${uid})`}>
        <g filter={`url(#f0_${uid})`}>
          <ellipse cx="20.0031" cy="31.1369" rx="6.3" ry="1.05" fill="#7033F5" fillOpacity="0.32"/>
        </g>
        <g filter={`url(#f1_${uid})`}>
          <ellipse cx="20.35" cy="31.4998" rx="3.85" ry="0.7" fill="#33F5C8" fillOpacity="0.23"/>
        </g>
        <g filter={`url(#f2_${uid})`}>
          <path d="M30.1958 20.0959C30.1958 23.1672 28.8728 25.9294 26.7656 27.8438C25.9081 28.6228 25.8302 29.5918 25.8333 30.719C25.8337 30.8476 25.7009 30.9349 25.5832 30.8829C24.9584 30.6066 23.3481 29.9368 22.783 30.1089C21.8173 30.4029 20.7925 30.561 19.7307 30.561C13.951 30.561 9.26562 25.8756 9.26562 20.0959C9.26562 14.3162 13.951 9.63086 19.7307 9.63086C25.5104 9.63086 30.1958 14.3162 30.1958 20.0959Z" fill={`url(#p0_${uid})`}/>
        </g>
        <g filter={`url(#f3_${uid})`}>
          <path d="M28.2596 20.5256C28.2596 23.9138 26.6723 26.6605 19.8938 26.6605C15.2735 26.6605 11.528 25.5879 11.528 20.5256C11.528 17.1373 12.9437 14.3906 19.8938 14.3906C26.8439 14.3906 28.2596 17.1373 28.2596 20.5256Z" fill={`url(#p1_${uid})`}/>
        </g>
        <path d="M19.8942 14.2432C23.3827 14.2432 25.5191 14.9316 26.7819 16.0781C28.0492 17.2289 28.4069 18.8135 28.4069 20.5254C28.4069 22.2409 28.0045 23.8243 26.7165 24.9736C25.433 26.1188 23.2981 26.8076 19.8942 26.8076C17.5791 26.8076 15.4529 26.5405 13.903 25.6182C12.3376 24.6866 11.3805 23.0999 11.3805 20.5254C11.3805 18.8135 11.7382 17.2289 13.0055 16.0781C14.2684 14.9315 16.4053 14.2432 19.8942 14.2432Z" stroke={`url(#p2_${uid})`} strokeWidth="0.294341"/>
        <g filter={`url(#f4_${uid})`}>
          <path d="M28.2596 20.5256C28.2596 23.9138 26.6723 26.6605 19.8938 26.6605C15.2735 26.6605 11.528 25.5879 11.528 20.5256C11.528 17.1373 12.9437 14.3906 19.8938 14.3906C26.8439 14.3906 28.2596 17.1373 28.2596 20.5256Z" fill={`url(#p3_${uid})`}/>
        </g>
        <path d="M19.8942 14.4639C23.362 14.4639 25.4309 15.1503 26.6335 16.2422C27.8337 17.3321 28.1862 18.8403 28.1862 20.5254C28.1862 22.2087 27.792 23.718 26.57 24.8086C25.3456 25.9012 23.2756 26.5869 19.8942 26.5869C17.5866 26.5869 15.5122 26.3179 14.0163 25.4277C12.5281 24.5421 11.6012 23.0349 11.6012 20.5254C11.6012 18.8404 11.9538 17.3321 13.154 16.2422C14.3566 15.1502 16.4261 14.4639 19.8942 14.4639Z" stroke={`url(#p4_${uid})`} strokeWidth="0.147171"/>
        <g filter={`url(#f5_${uid})`}>
          <rect x="15.1108" y="18.6885" width="2.01523" height="4.36634" rx="1.00762" fill={`url(#p5_${uid})`}/>
        </g>
        <g filter={`url(#f6_${uid})`}>
          <path fillRule="evenodd" clipRule="evenodd" d="M24.1649 19.1257C24.4797 19.4405 24.4797 19.9509 24.1649 20.2657L23.3914 21.0392L24.1649 21.8127C24.4797 22.1275 24.4797 22.6379 24.1649 22.9527C23.8501 23.2675 23.3397 23.2675 23.0249 22.9527L21.6814 21.6092C21.3666 21.2944 21.3666 20.784 21.6814 20.4692L23.0249 19.1257C23.3397 18.8109 23.8501 18.8109 24.1649 19.1257Z" fill={`url(#p6_${uid})`}/>
        </g>
        <path d="M30.2451 8.7002C29.9391 8.7002 29.9894 9.72846 29.5079 10.2115C29.0252 10.6936 27.998 10.6432 27.998 10.9496C27.998 11.2559 29.0252 11.2056 29.5079 11.6876C29.9894 12.1707 29.9391 13.199 30.2451 13.199C30.5512 13.199 30.5009 12.1707 30.9824 11.6876C31.465 11.2056 32.4922 11.2559 32.4922 10.9496C32.4922 10.6432 31.465 10.6936 30.9824 10.2115C30.5009 9.72846 30.5512 8.7002 30.2451 8.7002Z" fill={`url(#p7_${uid})`}/>
        <path d="M27.6178 7C27.4381 7 27.4677 7.60327 27.1848 7.8867C26.9014 8.16948 26.2982 8.13994 26.2982 8.31969C26.2982 8.49939 26.9014 8.46985 27.1848 8.75262C27.4677 9.03605 27.4381 9.63933 27.6178 9.63933C27.7975 9.63933 27.768 9.03605 28.0508 8.75262C28.3342 8.46985 28.9375 8.49939 28.9375 8.31969C28.9375 8.13994 28.3342 8.16948 28.0508 7.8867C27.768 7.60327 27.7975 7 27.6178 7Z" fill={`url(#p8_${uid})`}/>
      </g>
      <defs>
        <filter id={`f0_${uid}`} x="9.55498" y="25.9388" width="20.8963" height="10.3959" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="2.07407" result="effect1_foregroundBlur"/>
        </filter>
        <filter id={`f1_${uid}`} x="12.3519" y="26.6517" width="15.9963" height="9.69669" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="2.07407" result="effect1_foregroundBlur"/>
        </filter>
        <filter id={`f2_${uid}`} x="9.26562" y="9.63086" width="20.9301" height="22.4809" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1.21334"/><feGaussianBlur stdDeviation="0.606671"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id={`f3_${uid}`} x="11.2336" y="14.0967" width="17.3203" height="12.8584" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="2.64907" dy="0.588682"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id={`f4_${uid}`} x="11.528" y="14.3906" width="16.7316" height="12.2695" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="2.64907" dy="0.588682"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id={`f5_${uid}`} x="14.065" y="17.6426" width="4.10688" height="6.45787" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="0.522914"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.441754 0 0 0 0 0.0996028 0 0 0 0 1 0 0 0 0.5 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id={`f6_${uid}`} x="20.3995" y="17.8438" width="5.04734" height="6.39048" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="0.522914"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.441754 0 0 0 0 0.0996028 0 0 0 0 1 0 0 0 0.5 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <linearGradient id={`p0_${uid}`} x1="12.1473" y1="12.9675" x2="25.7995" y2="30.3221" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DFE5FF"/><stop offset="0.722134" stopColor="#7E5FF8"/><stop offset="1" stopColor="#C280FF"/>
        </linearGradient>
        <linearGradient id={`p1_${uid}`} x1="11.9534" y1="19.5141" x2="28.2596" y2="19.5141" gradientUnits="userSpaceOnUse">
          <stop stopColor="#332B42"/><stop offset="1" stopColor="#232A35"/>
        </linearGradient>
        <linearGradient id={`p2_${uid}`} x1="11.9534" y1="20.0813" x2="28.2596" y2="20.2231" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B3FF49" stopOpacity="0.5"/><stop offset="0.565" stopColor="#18ECFF" stopOpacity="0.5"/><stop offset="1" stopColor="#C28CFF"/>
        </linearGradient>
        <linearGradient id={`p3_${uid}`} x1="11.9534" y1="19.5141" x2="28.2596" y2="19.5141" gradientUnits="userSpaceOnUse">
          <stop stopColor="#332B42"/><stop offset="1" stopColor="#232A35"/>
        </linearGradient>
        <linearGradient id={`p4_${uid}`} x1="19.3266" y1="14.3906" x2="24.8566" y2="26.3013" gradientUnits="userSpaceOnUse">
          <stop/><stop offset="1" stopOpacity="0.11"/>
        </linearGradient>
        <linearGradient id={`p5_${uid}`} x1="16.1715" y1="18.5846" x2="17.4907" y2="22.882" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ACFF47"/><stop offset="0.49" stopColor="#4ECDFF"/><stop offset="1" stopColor="#7033F5"/>
        </linearGradient>
        <linearGradient id={`p6_${uid}`} x1="23.001" y1="18.7874" x2="23.9163" y2="23.2288" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ACFF47"/><stop offset="0.49" stopColor="#4ECDFF"/><stop offset="1" stopColor="#7033F5"/>
        </linearGradient>
        <linearGradient id={`p7_${uid}`} x1="32.4922" y1="10.2697" x2="27.998" y2="10.2681" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C3A2FE"/><stop offset="0.565" stopColor="#6424EF"/><stop offset="1" stopColor="#0D031F"/>
        </linearGradient>
        <linearGradient id={`p8_${uid}`} x1="28.9375" y1="7.92081" x2="26.2982" y2="7.91983" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C3A2FE"/><stop offset="0.565" stopColor="#6424EF"/><stop offset="1" stopColor="#0D031F"/>
        </linearGradient>
        <clipPath id={`clip_${uid}`}>
          <rect width="28" height="28" fill="white" transform="translate(6 6)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── Legacy constants (kept for backwards compat during migration) ────────────
export const SOURCES = [
  { id: 'url',     name: 'URL',          desc: 'Paste any product page link', status: 'none',        icon: 'globe' },
  { id: 'shopify', name: 'Shopify',       desc: 'mystore.myshopify.com',       status: 'connected',   icon: 'shop'  },
  { id: 'meta',    name: 'Facebook Feeds',desc: 'Not connected',               status: 'disconnected', icon: 'meta'  },
  { id: 'gmc',     name: 'Google GMC',    desc: 'Not connected',               status: 'disconnected', icon: 'google'},
];

export const PRODUCTS = [
  { name: 'Premium Wireless Headphones', cat: 'Electronics', price: '$89.99',  pic: 'https://picsum.photos/seed/headphones/300/300' },
  { name: 'Organic Face Serum',          cat: 'Skincare',    price: '$34.50',  pic: 'https://picsum.photos/seed/serum/300/300' },
  { name: 'Running Shoes Pro',           cat: 'Footwear',    price: '$129.00', pic: 'https://picsum.photos/seed/shoes/300/300' },
  { name: 'Smart Watch Elite',           cat: 'Wearables',   price: '$249.99', pic: 'https://picsum.photos/seed/watch/300/300' },
  { name: 'Yoga Mat Premium',            cat: 'Fitness',     price: '$59.00',  pic: 'https://picsum.photos/seed/yogamat/300/300' },
  { name: 'Coffee Maker Deluxe',         cat: 'Kitchen',     price: '$199.00', pic: 'https://picsum.photos/seed/coffee/300/300' },
];

export const PRODUCT_IMAGES = [
  { label: 'Front view', reason: 'Clean background, product centered — ideal for ad creatives' },
  { label: 'Side angle', reason: '' },
  { label: 'In use',     reason: '' },
  { label: 'Detail shot',reason: '' },
  { label: 'Packaging',  reason: '' },
  { label: 'Lifestyle',  reason: '' },
];

export const STYLES = [
  { id: 'minimal',   name: 'Minimal Clean', reason: 'High-performing style for product ads in social campaigns' },
  { id: 'lifestyle', name: 'Lifestyle',     reason: 'Great for lifestyle and aspirational positioning' },
  { id: 'bold',      name: 'Bold Impact',   reason: 'Eye-catching for competitive categories' },
];

export const SOURCE_ICONS = {
  globe: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  shop: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" />
    </svg>
  ),
  meta: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  google: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
    </svg>
  ),
};
