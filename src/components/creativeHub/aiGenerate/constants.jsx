// ─── Image Helpers (Picsum seed-based) ───────────────────
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

// ─── Data ────────────────────────────────────────────────
export const SOURCES = [
  { id: 'url', name: 'URL', desc: 'Paste any product page link', status: 'none', icon: 'globe' },
  { id: 'shopify', name: 'Shopify', desc: 'mystore.myshopify.com', status: 'connected', icon: 'shop' },
  { id: 'meta', name: 'Facebook Feeds', desc: 'Not connected', status: 'disconnected', icon: 'meta' },
  { id: 'gmc', name: 'Google GMC', desc: 'Not connected', status: 'disconnected', icon: 'google' },
];

export const PRODUCTS = [
  { name: 'Premium Wireless Headphones', cat: 'Electronics', price: '$89.99', pic: 'https://picsum.photos/seed/headphones/300/300' },
  { name: 'Organic Face Serum', cat: 'Skincare', price: '$34.50', pic: 'https://picsum.photos/seed/serum/300/300' },
  { name: 'Running Shoes Pro', cat: 'Footwear', price: '$129.00', pic: 'https://picsum.photos/seed/shoes/300/300' },
  { name: 'Smart Watch Elite', cat: 'Wearables', price: '$249.99', pic: 'https://picsum.photos/seed/watch/300/300' },
  { name: 'Yoga Mat Premium', cat: 'Fitness', price: '$59.00', pic: 'https://picsum.photos/seed/yogamat/300/300' },
  { name: 'Coffee Maker Deluxe', cat: 'Kitchen', price: '$199.00', pic: 'https://picsum.photos/seed/coffee/300/300' },
];

export const PRODUCT_IMAGES = [
  { label: 'Front view', reason: 'Clean background, product centered — ideal for ad creatives' },
  { label: 'Side angle', reason: '' },
  { label: 'In use', reason: '' },
  { label: 'Detail shot', reason: '' },
  { label: 'Packaging', reason: '' },
  { label: 'Lifestyle', reason: '' },
];

export const STYLES = [
  { id: 'minimal', name: 'Minimal Clean', reason: 'High-performing style for product ads in social campaigns' },
  { id: 'lifestyle', name: 'Lifestyle', reason: 'Great for lifestyle and aspirational positioning' },
  { id: 'bold', name: 'Bold Impact', reason: 'Eye-catching for competitive categories' },
];

export const TEMPLATE_LIB = [
  { style: 'Minimal', id: 't1' }, { style: 'Minimal', id: 't2' }, { style: 'Minimal', id: 't3' },
  { style: 'Lifestyle', id: 't4' }, { style: 'Lifestyle', id: 't5' }, { style: 'Lifestyle', id: 't6' },
  { style: 'Bold', id: 't7' }, { style: 'Bold', id: 't8' }, { style: 'Bold', id: 't9' },
];

export const SUGGESTIONS = [
  'Add a "20% OFF" badge in the corner',
  'Use warm sunset tones for summer feel',
  'Include product name as headline text',
];

export const QTY_OPTIONS = [1, 3, 6];

export const RATIO_OPTIONS = [
  { v: '1:1', label: '1:1', tip: 'Feed posts' },
  { v: '4:5', label: '4:5', tip: 'Instagram feed' },
  { v: '9:16', label: '9:16', tip: 'Stories & Reels' },
  { v: '16:9', label: '16:9', tip: 'YouTube & banners' },
];

// ─── Source Icons (inline SVG - no exact lucide match) ───
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

// ─── Initial Gallery (pre-populated demo data) ──────────
export const INITIAL_GALLERY = [
  {
    id: 2,
    status: 'done',
    product: { name: 'Organic Face Serum', productIdx: 1, source: 'shopify' },
    image: { selectedIdx: 2 },
    template: { selectedStyle: 'lifestyle', styleName: 'Lifestyle' },
    settings: { quantity: 3, ratios: ['1:1', '9:16'] },
    createdAt: '2h ago',
    results: buildResultUrls(3, ['1:1', '9:16'], 100),
  },
  {
    id: 1,
    status: 'done',
    product: { name: 'Running Shoes Pro', productIdx: 2, source: 'shopify' },
    image: { selectedIdx: 0 },
    template: { selectedStyle: 'bold', styleName: 'Bold Impact' },
    settings: { quantity: 3, ratios: ['1:1', '4:5', '16:9'] },
    createdAt: 'Yesterday',
    results: buildResultUrls(3, ['1:1', '4:5', '16:9'], 200),
  },
];

// ─── Initial Step State (for new task reset) ─────────────
export const INITIAL_CARD1 = { phase: 'source-select', source: null, product: null, url: '' };
export const INITIAL_CARD2 = { selectedIdx: 0 };
export const INITIAL_CARD3 = { mode: 'ai', selectedStyle: 'minimal', browsing: false };
export const INITIAL_CARD4 = { requirements: '', quantity: 3, ratios: new Set(['1:1', '4:5', '9:16', '16:9']) };
