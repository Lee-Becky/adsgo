import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

// --- SVG Icons Definition ---
const SvgIcons = () => (
  <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
    <symbol id="icon-Trend1" viewBox="0 0 1024 1024">
      <path d="M134.912 889.1904c0-12.288 11.776-22.2208 26.3168-22.2208h701.7472c14.4896 0 26.2656 9.9328 26.2656 22.2208 0 12.2368-11.776 22.1696-26.2656 22.1696H161.2288c-14.5408 0-26.3168-9.9328-26.3168-22.1696zM144.2304 517.632a22.528 22.528 0 0 1 20.736-4.864l145.92 35.5328c10.752 2.9696 18.3808 13.6192 18.3808 25.8048v177.5104c0 14.6944-10.8544 26.624-24.2176 26.624h-145.92c-13.3632 0-24.2176-11.9296-24.2176-26.624v-212.992a27.648 27.648 0 0 1 9.3184-20.992z m39.1168 55.0912v152.2688h97.4848v-130.048l-97.4848-22.2208zM608.6656 427.008c8.9088 4.608 14.336 12.8 14.336 21.6064v304.2816c0 13.9776-13.5168 25.344-30.208 25.344H431.36c-16.6912 0-30.208-11.3664-30.208-25.344v-236.6464c0-9.6256 6.4512-18.432 16.6912-22.6816l161.3312-67.6352a35.3792 35.3792 0 0 1 29.44 1.1264zM461.6704 531.968v195.584h100.864V489.6768l-100.864 42.2912zM877.7728 249.856c7.168 5.0176 11.4688 13.9264 11.4688 23.4496v477.3888c0 15.2064-10.8032 27.5456-24.1664 27.5456h-144.896c-13.312 0-24.1664-12.288-24.1664-27.5456v-403.968a28.16 28.16 0 0 1 13.3632-24.576l144.896-73.472a21.6576 21.6576 0 0 1 23.552 1.1776zM744.448 363.776v359.424h96.4096V317.7984l-96.4096 45.9264zM661.1968 140.6464c0-15.4624 11.776-28.0064 26.3168-28.0064h175.4624c12.1856 0 22.784 8.96 25.6 21.6064a28.672 28.672 0 0 1-13.824 31.488L313.344 464.6912a24.8832 24.8832 0 0 1-18.1248 2.0992l-140.3392-37.376c-14.1312-3.7376-22.6816-18.944-19.1488-33.9968 3.4816-15.0016 17.7664-24.1152 31.8976-20.3776l130.8672 34.816 452.9664-241.152h-63.9488c-14.5408 0-26.3168-12.544-26.3168-28.0576z" fill="#141414"></path>
    </symbol>
    <symbol id="icon-Check" viewBox="0 0 1024 1024">
      <path d="M938.665884 512.000427c0-117.759902-47.786627-224.42648-125.013229-301.653082A425.130312 425.130312 0 0 0 511.999573 85.334116c-117.759902 0-224.42648 47.786627-301.653082 125.013229A425.130312 425.130312 0 0 0 85.333262 512.000427c0 117.759902 47.786627 224.42648 125.013229301.653082A425.3696 425.3696 0 0 0 511.999573 938.666738v85.333262l-26.367978-0.682666a510.122242 510.122242 0 0 1-317.866401-132.266557l-17.749319-17.066652A510.378241 510.378241 0 0 1 0.682666 538.453738L0 512.000427a510.292908 510.292908 0 0 1 133.034556-344.23438l16.981319-17.919985A510.548908 510.548908 0 0 1 511.999573 0.000853l26.282645 0.682666a510.463575 510.463575 0 0 1 335.701054 149.333209A510.463575 510.463575 0 0 1 1023.999147 512.000427l-0.682666 26.367978a510.378241 510.378241 0 0 1-149.333209 335.61572A510.463575 510.463575 0 0 1 511.999573 1024v-85.333262c117.759902 0 224.42648-47.786627 301.653082-125.013229A425.130312 425.130312 0 0 0 938.665884 512.000427z"></path>
      <path d="M473.599605 712.106927a2340.691383 2340.691383 0 0 1 149.759876-178.517185 1584.638679 1584.638679 0 0 1 126.975894-125.439895c32.085307-28.586643 39.594634-36.693303 66.047945-58.197285l-30.122642-37.973302c-43.605297 26.026645-58.538618 38.229301-90.965257 59.562617-18.943984 12.373323-36.437303-52.991956 35.669304-16.383986 11.349324-33.279972 23.722647-51.199958 36.693302a2701.651082 2701.651082 0 0 0-109.141242 84.138597L385.365012 441.173819l-113.493239 85.077262L473.599605 712.106927z"></path>
    </symbol>
    <symbol id="icon-Outlined_Eye" viewBox="0 0 1024 1024">
      <path d="M201.472 295.7824C279.7568 228.1984 389.2736 172.8 512 172.8c122.7264 0 232.2432 55.3984 310.528 122.9824 39.2704 33.8944 71.4752 71.5264 94.1056 108.2368 22.2208 35.9424 36.9664 73.9328 36.9664 107.9808s-14.7456 72.0384-36.9664 108.032c-22.6304 36.6592-54.784 74.24-94.1056 108.1856-78.2848 67.584-187.8016 122.9824-310.528 122.9824-122.7264 0-232.2432-55.3984-310.528-122.9824-39.2704-33.8944-71.4752-71.5264-94.1056-108.2368-22.1696-35.9424-36.9664-73.9328-36.9664-107.9808s14.7968-72.0384 36.9664-108.032c22.6304-36.6592 54.784-74.24 94.1056-108.1856z m-39.6288 141.824c-19.3024 31.232-27.4432 57.2416-27.4432 74.3936 0 17.152 8.192 43.1616 27.4432 74.3936 18.7904 30.5152 46.592 63.2832 81.408 93.3888 69.9904 60.416 165.2736 107.4176 268.7488 107.4176 103.4752 0 198.7584-47.0016 268.6976-107.4176 34.8672-30.1056 62.6688-62.8736 81.4592-93.3888 19.3024-31.232 27.4432 57.2416 27.4432-74.3936 0-17.152-8.192-43.1616-27.4432-74.3936-18.7904-30.5152-46.592-63.2832-81.408-93.3888z"></path>
      <path d="M373.3504 512a138.6496 138.6496 0 1 1 277.2992 0 138.6496 138.6496 0 0 1-277.2992 0zM512 437.3504a74.6496 74.6496 0 1 0 0 149.2992 74.6496 74.6496 0 0 0 0-149.2992z"></path>
    </symbol>
    <symbol id="icon-a-Howtouse_" viewBox="0 0 1024 1024">
      <path d="M481.28 320A139.995429 139.995429 0 0 0 341.357714 179.931429H137.435429v557.348571H384c36.644571 0 70.363429 12.434286 97.28 33.353143V320z m61.44 576a30.72 30.72 0 1 1-61.44 0 97.28 97.28H106.788571a30.72 30.72 0 0 1-30.72-30.72V149.357714a30.72 30.72 0 0 1 30.72-30.72h234.642286A201.362286 201.362286 0 0 1 542.72 320v576z"></path>
      <path d="M481.28 896V320a201.362286 201.362286 0 0 1 201.435429-201.362286h234.642285a30.72 30.72 0 0 1 30.72 30.72V768a30.72 30.72 0 0 1-30.72 30.72H640a97.28 97.28 0 0 0-97.28 97.28 30.72 30.72 0 1 1-61.44 0z m61.44-125.220571a157.915429 157.915429 0 0 1 97.28-33.499429h246.637714V180.004571H682.715429A139.995429 139.995429 0 0 0 542.72 320v450.779429z"></path>
    </symbol>
    <symbol id="icon-Outlined_Earth" viewBox="0 0 1024 1024">
      <path d="M53.3504 512a458.6496 458.6496 0 1 1 917.2992 0 458.6496 458.6496 0 0 1-917.2992 0zM512 117.3504a394.6496 394.6496 0 1 0 0 789.2992 394.6496 394.6496 0 0 0 0-789.2992z"></path>
      <path d="M53.3504 512c0-17.664 14.336-32 32-32h853.2992a32 32 0 1 1 0 64H85.3504A32 32 0 0 1 53.3504 512z"></path>
      <path d="M422.2976 96.8704c24.2176-25.6 54.4768-43.52 89.7024-43.52 35.1744 0 65.536 17.92 89.7024 43.52 24.064 25.4976 44.3392 60.7232 60.672 101.5296 32.768 81.8688 52.2752 192.768 52.2752 313.6s-19.5072 231.7312-52.224 313.6c-16.384 40.8064-36.608 76.032-60.7744 101.5296-24.1664 25.6-54.4768 43.52-89.6512 43.52-35.2256 0-65.536-17.92-89.7024-43.52-24.064-25.4976-44.3392-60.7232-60.672-101.5296-32.768-81.8688-52.2752-313.6s19.5072-231.7312 52.224-313.6c16.384-40.8064 36.608-76.032 60.7232-101.5296zM421.0176 222.208c-29.0304 72.5504-47.6672 175.0016-47.6672 289.792s18.6368 217.2416 47.6672 289.792c14.5408 36.352 31.0784 63.6928 47.8208 81.3568 16.64 17.6128 31.232 23.552 43.1616 23.552 11.9296 0 26.5216-5.9392 43.1616-23.552 16.7424-17.664 33.28-44.9536 47.8208-81.3056 29.0304-72.6016 47.6672-175.0528 47.6672-289.8432 0-114.7904-18.6368-217.2416-47.6672-289.792-14.5408-36.352-31.0784-63.6928-47.8208-81.3568-16.64-17.6128-31.232-23.552-43.1616-23.552-11.9296 0-26.5216-5.9392-43.1616-23.552-16.7424 17.664-33.28-44.9536 47.8208 81.3568z"></path>
      <path d="M187.648 193.7408a32 32 0 0 1 45.2608 0A393.3184 393.3184 0 0 0 512 309.3504a393.3184 393.3184 0 0 0 279.04-115.6096 32 32 0 0 1 45.2608 45.2608A457.3184 457.3184 0 0 1 512 373.3504a457.3184 457.3184 0 0 1-324.352-134.3488 32 32 0 0 1 0-45.2608zM187.648 784.9984A457.3184 457.3184 0 0 1 512 650.6496a457.3184 457.3184 0 0 1 324.3008 134.3488 32 32 0 1 1-45.2096 45.2608A393.3184 393.3184 0 0 0 512 714.6496a393.3184 393.3184 0 0 0-279.04 115.6096 32 32 0 1 1-45.312-45.2608z"></path>
    </symbol>
    <symbol id="icon-Filled_Info1" viewBox="0 0 1024 1024">
      <path d="M512 53.3504a457.3184 457.3184 0 0 0-324.3008 134.2976A457.3184 457.3184 0 0 0 53.3504 512a457.3184 457.3184 0 0 0 134.3488 324.3008A457.3696 457.3696 0 0 0 512 970.6496a457.3696 457.3696 0 0 0 324.352-134.2976A457.3696 457.3696 0 0 0 970.6496 512a457.3696 457.3696 0 0 0-134.2976-324.352A457.3184 457.3184 0 0 0 512 53.3504z m53.3504 234.6496a53.3504 53.3504 0 1 1-106.7008 0 53.3504 53.3504 0 0 1 106.7008 0zM480 394.6496h42.6496c17.664 0 32 14.336 32 32v266.7008h42.7008a32 32 0 0 1 0 64H448a32 32 0 0 1 0-64h42.6496V458.6496h-10.6496a32 32 0 1 1 0-64z"></path>
    </symbol>
    <symbol id="icon-Outlined_Close01" viewBox="0 0 1024 1024">
      <path d="M276.0192 276.0192a32 32 0 0 1 45.2608 0l426.7008 426.7008a32 32 0 0 1-45.2608 45.2608L275.968 321.28a32 32 0 0 1 0-45.2608z"></path>
      <path d="M747.9808 276.0192a32 32 0 0 1 0 45.2608L321.28 748.032a32 32 0 1 1-45.2608-45.2608l426.7008-426.7008a32 32 0 0 1 45.2608 0z"></path>
    </symbol>
  </svg>
);

const Icon = ({ id, className, style }) => (
  <span role="img" className={`anticon ${className || ''}`} style={style}>
    <svg width="1em" height="1em" fill="currentColor">
      <use xlinkHref={`#${id}`} />
    </svg>
  </span>
);

// --- Mock Data (完全匹配 ad card.html) ---
const CAMPAIGN_CARDS = [
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

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
];

const AUDIENCE_INSIGHTS = [
  { name: 'Local Diners', tags: ['Neighborhood restaurants', 'Classic diners', 'Local comfort food', 'Family-owned eateries'], cpa: '2.8', spend: '455', campaigns: 11, value: 45 },
  { name: 'Fast Food Lovers', tags: ['Burger enthusiasts', 'Fried chicken fans', 'Street food lovers', 'Quick bites seekers', 'Pizza addicts'], cpa: '1.5', spend: '282', campaigns: 8, value: 30 },
  { name: 'Latino Community', tags: ['Hispanic culture', 'Latin music', 'Spanish language', 'Latino heritage', 'Latin American cuisine'], cpa: '2.2', spend: '101', campaigns: 9, value: 25 }
];

const PAGE_INSIGHTS = [
  { url: 'https://www.goodkarmasj.com/', cvr: '1.88%', spend: '325', campaigns: 3, value: 60 },
  { url: 'https://www.goodkarmasj.com/s/order', cvr: '1.72%', spend: '675', campaigns: 2, value: 40 }
];

const TOP_ADS = [
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

const SCATTER_DATA = [
  { x: 2.38, y: 7.8 }, { x: 6.95, y: 3.7 }, { x: 6.12, y: 5.6 },
  { x: 3.5, y: 6.2 }, { x: 4.8, y: 4.5 }, { x: 5.2, y: 5.1 },
  { x: 2.1, y: 8.5 }, { x: 7.5, y: 3.2 }, { x: 4.2, y: 5.8 }
];

const AdInsights = ({ onPageChange }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Meta');
  const [autoRegen, setAutoRegen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(true);
  const [expandedTags, setExpandedTags] = useState({});
  const [mediaOverlays, setMediaOverlays] = useState({});
  const [ctaDropdowns, setCtaDropdowns] = useState({});
  const [selectedCampaigns, setSelectedCampaigns] = useState({});
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState({});

  // Initialize selected campaigns
  useEffect(() => {
    const initialSelected = {};
    CAMPAIGN_CARDS.forEach(card => {
      initialSelected[card.id] = card.selected;
    });
    setSelectedCampaigns(initialSelected);
  }, []);

  // Handle auto-launch switch
  useEffect(() => {
    if (autoRegen) {
      // When auto-launch is enabled, set all campaigns to Published(Auto)
      const autoStatus = {};
      CAMPAIGN_CARDS.filter(card => card.id === '01' || card.id === '03' || card.id === '05').forEach(card => {
        // Only update if not already published
        if (!campaignStatus[card.id]) {
          autoStatus[card.id] = 'auto';
        }
      });
      if (Object.keys(autoStatus).length > 0) {
        setCampaignStatus(prev => ({ ...prev, ...autoStatus }));
      }
    }
  }, [autoRegen]);

  // 8秒后停止 AI 生成动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAiGenerating(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTags = (cardId) => {
    setExpandedTags(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const toggleMediaOverlay = (cardId) => {
    setMediaOverlays(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== cardId) newState[key] = false;
      });
      newState[cardId] = !newState[cardId];
      return newState;
    });
  };

  const toggleCTADropdown = (cardId) => {
    setCtaDropdowns(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== cardId) newState[key] = false;
      });
      newState[cardId] = !newState[cardId];
      return newState;
    });
  };

  const toggleCampaignSelection = (cardId) => {
    setSelectedCampaigns(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedCampaigns).filter(Boolean).length;
  };

  const handlePublish = (cardId) => {
    // Only update if not already published
    if (!campaignStatus[cardId]) {
      setCampaignStatus(prev => ({ ...prev, [cardId]: 'manual' }));
    }
  };

  const getCampaignStatus = (cardId) => {
    return campaignStatus[cardId];
  };

  return (
    <div className="min-h-screen bg-background p-6 font-sans" style={{ paddingBottom: isAiGenerating ? '110px' : '6px' }}>
      <SvgIcons />
      
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          
          {/* --- Top Panel - Platform Selector Only --- */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 flex justify-start">
              <div className="bg-gray-100 p-0.5 rounded-full flex gap-1">
              {['Meta', 'Google', 'TikTok', 'Bing'].map(p => {
                  const platformLogos = {
                    'Meta': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
                    'Google': 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
                    'TikTok': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
                    'Bing': 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256'
                  };
                  return (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedPlatform === p ? 'bg-white shadow-sm text-[#141414]' : 'text-[#8c8c8c] opacity-40 grayscale pointer-events-none'
                      }`}
                    >
                      <img src={platformLogos[p]} alt={p} className="w-6 h-6" />
                      {p}
                    </button>
                  );
              })}
              </div>
            </div>
          </div>

          {/* --- Insights Grid --- */}

          {/* --- AI Generation --- */}
          <div className="py-6 px-2">
            {/* Sub Header */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-[18px] rounded" style={{ background: 'linear-gradient(180deg, #8B5CF6, #4F46E5)' }}></div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Launch Recommendation</h2>
                <div className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                  <div className="flex items-center text-gray-700 text-sm font-semibold">
                    <img src="https://www.adsgo.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frobot-active.7003b4d8.png&w=256&q=75" alt="AI Robot" className="w-5 h-5 mr-1.5" />
                    Auto-launch:
                  </div>
                  <div 
                    className={`w-11 h-[22px] rounded-full p-[2px] cursor-pointer transition-colors ${autoRegen ? 'bg-[#7033f5]' : 'bg-gray-300'}`}
                    onClick={() => setAutoRegen(!autoRegen)}
                  >
                    <div className={`w-[18px] h-[18px] bg-white rounded-full transition-transform ${autoRegen ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-xs font-semibold ${autoRegen ? 'text-green-600' : 'text-gray-500'}`}>
                    {autoRegen ? 'Enabled - Recommended campaigns will be launched automatically.' : 'Disabled - Campaign needs to be launched manually'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onPageChange('drafts')}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#7033f5] hover:text-[#5b29cc] transition-colors group"
              >
                View All in Drafts 
                <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CAMPAIGN_CARDS.filter(card => card.id === '01' || card.id === '03' || card.id === '05').map((card) => {
                const isExpanded = expandedTags[card.id];
                const showMediaOverlay = mediaOverlays[card.id];
                const showCTADropdown = ctaDropdowns[card.id];
                
                const genderIconClass = card.gender === 'Male' ? 'fa-mars' : (card.gender === 'Female' ? 'fa-venus' : 'fa-venus-mars');
                const tagsArr = card.interests.split(',');
                const showExpandArrow = tagsArr.length > 4;
                
                return (
                  <div key={card.id} className="campaign-wrapper">
                    {/* Ad Card */}
                    <div className="ad-card">
                      
                      {/* Audience Info Section */}
                      <div className="ad-audience-top">
                        {card.id === '05' ? (
                          // Lookalike Audience 特殊显示
                          <>
                            <div className="aud-row-1-lookalike">
                              <span className="aud-name">{card.audience}</span>
                              <div className="aud-group aud-group-hover" title="类似受众 (US, 3% to 5%) - AdsGo已付费客户1222">
                                <span className="aud-content-tag aud-content-tag-long">类似受众 (US, 3% to 5%) - AdsGo已付费客户1222</span>
                              </div>
                            </div>
                            <div className="aud-row-2">
                              <i className="fas fa-bullseye aud-icon-interest"></i>
                              <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                                <div className="aud-tags-container">
                                  <span className="aud-pill-tag">Scaling up by using the highest potential lookalike audience</span>
                                </div>
                              </div>
                              <div 
                                onClick={() => toggleTags(card.id)}
                                className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}
                              >
                                <i className="fas fa-chevron-down"></i>
                              </div>
                            </div>
                          </>
                        ) : (
                          // 其他卡片正常显示
                          <>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="aud-name">{card.audience}</span>
                              <div className="aud-group">
                                <i className="fas fa-birthday-cake aud-icon-standalone"></i>
                                <span className="aud-content-tag">{card.age}</span>
                              </div>
                              <div className="aud-group">
                                <i className={`fas ${genderIconClass} aud-icon-standalone`}></i>
                                <span className="aud-content-tag">{card.gender}</span>
                              </div>
                            </div>
                            <div className="aud-row-2">
                              <i className="fas fa-bullseye aud-icon-interest"></i>
                              <div className={`aud-tags-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
                                <div className="aud-tags-container">
                                  {tagsArr.map((tag, idx) => (
                                    <span key={idx} className="aud-pill-tag">{tag.trim()}</span>
                                  ))}
                                </div>
                              </div>
                              {showExpandArrow && (
                                <div 
                                  onClick={() => toggleTags(card.id)}
                                  className={`aud-expand-btn ${isExpanded ? 'rotated' : ''}`}
                                >
                                  <i className="fas fa-chevron-down"></i>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Ad Header */}
                      <div className="ad-header">
                        <div className="ad-user-info">
                          <div className="ad-avatar"><i className="fas fa-asterisk"></i></div>
                          <div className="ad-text-box">
                            <h4>AdsGo.ai</h4>
                            <p>Sponsored · <i className="fas fa-globe-americas"></i></p>
                          </div>
                        </div>
                        {getCampaignStatus(card.id) ? (
                          // 显示发布状态
                          <div className="published-status">
                            {getCampaignStatus(card.id) === 'manual' ? (
                              <span className="status-badge status-manual">Published(Manual)</span>
                            ) : (
                              <span className="status-badge status-auto">Published(Auto)</span>
                            )}
                          </div>
                        ) : (
                          // 显示 Edit 和 Publish 按钮
                          <div className="ad-header-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => {
                                setSelectedCardId(card.id);
                                setEditDrawerOpen(true);
                              }}
                            >
                              <i className="fas fa-pen"></i> Edit
                            </button>
                            <button 
                              className="btn-publish-card"
                              onClick={() => handlePublish(card.id)}
                            >
                              Publish
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Ad Body Text */}
                      <div className="ad-body-text">
                        <span className="ad-line">{card.headline}</span>
                        <span className="ad-line">{card.text}</span>
                      </div>
                      
                      {/* Media Area */}
                      {card.hasImage ? (
                        <div className="ad-media-area media-filled">
                          <img 
                            src={IMAGE_POOL[card.currentImgIndex % IMAGE_POOL.length]} 
                            alt="Ad visual" 
                          />
                        </div>
                      ) : (
                        <div className="media-empty">
                          <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                          <div className="text-[10px]">Click to upload</div>
                        </div>
                      )}
                      
                      {/* CTA Section */}
                      <div className="ad-cta-section">
                        <div className="cta-left">
                          <h5>AdsGo.ai</h5>
                          <p>FREE Shipping</p>
                        </div>
                        <div className="cta-wrapper">
                          <button className="btn-shop-fixed">
                            {card.cta}
                          </button>
                        </div>
                      </div>
                      
                      {/* Social Stats */}
                      <div className="ad-social">
                        <span className="social-item"><i className="far fa-thumbs-up"></i> Like</span>
                        <span className="social-item"><i className="far fa-comment-alt"></i> Comment</span>
                        <span className="social-item"><i className="fas fa-share"></i> Share</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* More Recommendations Card - Always last in grid */}
              <div className="campaign-wrapper">
                <div 
                  onClick={() => onPageChange('drafts')}
                  className="ad-card more-recommendations-card cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[550px] p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7033f5] flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">View More Recommendations</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      See all {CAMPAIGN_CARDS.length} campaigns in Drafts
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#7033f5]">
                      Go to Drafts
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Insights Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 px-2">
            
            {/* Audience Insight */}
            <div className="min-w-0">
              <div className="text-gray-900 text-xl font-bold mb-4 pl-4 relative before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full before:bg-gradient-to-b before:from-[#c3a2fe] before:via-[#7135f4] before:to-[#0d031f] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2">
                Audience Insight
              </div>
              <div className="flex flex-col p-2 gap-2 bg-[#fafafa] border border-[#f5f5f5] rounded-2xl">
                <div className="flex flex-col p-3 px-4 gap-3 bg-white rounded-xl">
                  <div className="text-[#141414] text-base font-semibold">Spend Distribution</div>
                  <div className="w-full h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={AUDIENCE_INSIGHTS}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {AUDIENCE_INSIGHTS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#7033f5' : index === 1 ? '#c3a2fe' : '#ead9ff'} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-col p-3 px-4 gap-4 bg-white rounded-xl">
                  <div className="text-[#141414] text-base font-semibold">Top Audiences</div>
                  <div className="flex flex-col gap-5">
                    {AUDIENCE_INSIGHTS.map((item, i) => (
                      <div key={i} className={`flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0`}>
                        <div className="text-[#141414] text-sm font-medium">{item.name}</div>
                        <div className="flex gap-1 overflow-hidden">
                          {item.tags.map((t, j) => (
                            <span key={j} className="px-3 py-1 bg-[#f5f5f5] text-[#666] rounded-full text-sm whitespace-nowrap">{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                          <span className="text-[#7033f5] font-medium">{item.cpa} CPA</span>
                          <span className="text-[#8c8c8c]">${item.spend} spend · {item.campaigns} campaigns</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Insight */}
            <div className="min-w-0">
              <div className="text-gray-900 text-xl font-bold mb-4 pl-4 relative before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full before:bg-gradient-to-b before:from-[#c3a2fe] before:via-[#7135f4] before:to-[#0d031f] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2">
                Page Insight
              </div>
              <div className="flex flex-col p-2 gap-2 bg-gray-50 border border-border rounded-2xl">
                <div className="flex flex-col p-3 px-4 gap-3 bg-white rounded-xl">
                  <div className="text-[#141414] text-base font-semibold">Spend Distribution</div>
                  <div className="w-full h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PAGE_INSIGHTS}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PAGE_INSIGHTS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#7033f5' : '#c3a2fe'} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-col p-3 px-4 gap-4 bg-white rounded-xl">
                  <div className="text-[#141414] text-base font-semibold">Top Pages</div>
                  <div className="flex flex-col gap-5">
                    {PAGE_INSIGHTS.map((item, i) => (
                      <div key={i} className={`flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0`}>
                        <div className="text-[#141414] text-sm font-medium truncate">{item.url}</div>
                        <div className="flex items-center gap-2.5 text-sm">
                          <span className="text-[#5969f7] font-medium">{item.cvr} CVR</span>
                          <span className="text-[#8c8c8c]">${item.spend} spend · {item.campaigns} campaigns</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Creative Insight --- */}
          <div className="py-6 px-2">
            <div className="text-gray-900 text-xl font-bold mb-4 pl-4 relative before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full before:bg-gradient-to-b before:from-[#c3a2fe] before:via-[#7135f4] before:to-[#0d031f] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2">
              Creative Insight
            </div>
            <div className="flex flex-col p-2 gap-2 bg-gray-50 border border-border rounded-2xl">
              <div className="w-full bg-white p-4 rounded-xl">
                <div className="text-gray-900 text-base font-bold mb-3">Creative Performance</div>
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" dataKey="x" name="CTR" unit="%" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                      <YAxis type="number" dataKey="y" name="CPA" unit="$" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Ads" data={SCATTER_DATA} fill="#7033f5" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col w-full p-4 gap-4 bg-white rounded-xl">
                <div className="text-gray-900 text-base font-bold">Top Ads</div>
                <div className="flex gap-12 overflow-x-auto pb-4 no-scrollbar">
                  {TOP_ADS.map((ad, index) => (
                    <div key={ad.id} className="flex-1 min-w-[320px] max-w-[360px] relative first:before:hidden before:content-[''] before:block before:w-px before:h-[90%] before:border-l before:border-dashed before:border-[#d9d9d9] before:absolute before:top-1/2 before:left-[-24px] before:-translate-y-1/2">
                      <div className="flex items-center justify-center gap-2 mb-3 text-gray-500 text-sm">
                        <span className="text-[#78a100] font-medium">{ad.ctr} CTR</span>
                        <span></span>
                        <span>{ad.cpa} CPA</span>
                        <span>·</span>
                        <span>{ad.campaigns} campaigns</span>
                      </div>
                      <div className="rounded-2xl border border-primary/30 overflow-hidden bg-white">
                        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-gradient-to-r from-white to-[#f5f1ff] text-gray-900 text-base font-semibold">
                          <Icon id="icon-Outlined_Eye" className="text-xl font-medium" />
                          <span>Creative</span>
                        </div>
                        <div className="flex justify-between items-center px-2.5 py-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 p-1.5 flex justify-center items-center rounded-full border border-[#f5f5f5] bg-[#fafafa]">
                              <img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256" alt="" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-gray-900 text-sm font-bold truncate max-w-[200px]">Goodkarma</span>
                              <span className="text-gray-500 text-xs">Sponsored •</span>
                            </div>
                          </div>
                          <div className="flex gap-2.5 text-xl font-semibold">
                            <span>⋯</span>
                            <Icon id="icon-Outlined_Close01" />
                          </div>
                        </div>
                        <div className="px-2.5 pb-2 text-gray-900 text-xs font-medium leading-[17px] line-clamp-3">
                          {ad.primaryText}
                        </div>
                        <div className="w-full aspect-square bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${ad.mediaUrl})` }} />
                        <div className="p-3 flex justify-between items-center border-t border-border bg-gray-50 gap-3">
                          <div className="flex-1 flex flex-col gap-1 text-gray-900 text-sm max-w-[240px]">
                            <div className="font-bold truncate">{ad.footerBrand}</div>
                            <div className="text-gray-500 text-xs font-medium truncate">{ad.footerDesc}</div>
                          </div>
                          <div className="h-8 px-1.5 flex justify-center items-center text-gray-900 text-xs font-semibold rounded-md bg-gray-200">
                            Shop Now
                          </div>
                        </div>
                        <div className="ad-social">
                          <span className="social-item"><i className="far fa-thumbs-up"></i> Like</span>
                          <span className="social-item"><i className="far fa-comment-alt"></i> Comment</span>
                          <span className="social-item"><i className="fas fa-share"></i> Share</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Edit Drawer Modal */}
      {editDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setEditDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Edit Campaign {selectedCardId}</h3>
              <button 
                className="drawer-close-btn"
                onClick={() => setEditDrawerOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="drawer-body">
              <img 
                src="/ad edit.jpg" 
                alt="Ad Preview" 
                className="drawer-preview-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* 底部内联样式用于一些特殊效果 */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Ad Card Styles from ad card.html */
        :root {
          --primary: #7033f5;
          --primary-text: #7033f5;
          --text-dark: #111827;
          --text-gray: #6B7280;
          --bg-body: #F9FAFB;
          --bg-header: #FFFFFF;
          --border-color: #E5E7EB;
          --purple-light-bg: #F5F1FF; 
          --purple-tag-bg: #E0E7FF;
          --purple-tag-text: #7033f5;
          --skeleton-gray: #D1D5DB;
          --purple-btn-start: #8B5CF6;
          --purple-btn-end: #7033f5;
          --blue-upload-bg: #EFF6FF;
          --blue-upload-border: #BFDBFE;
        }

        .campaign-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.3s;
        }

        .campaign-wrapper.disabled .ad-card {
          opacity: 0.5;
          filter: grayscale(100%);
          pointer-events: none;
        }

        .ad-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: visible;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          font-size: 12px;
          position: relative;
        }

        .ad-audience-top {
          background: #F8F9FF;
          padding: 12px 14px;
          border-bottom: 1px solid #E0E7FF;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }

        .aud-row-1-lookalike {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          width: 100%;
        }

        .aud-row-1-lookalike .aud-name {
          flex-shrink: 0;
        }

        .aud-row-1-lookalike .aud-group {
          flex: 1;
          min-width: 0;
        }

        .aud-name {
          font-size: 12px;
          font-weight: 500;
          color: #9CA3AF;
          margin-right: 4px;
        }

        .aud-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .aud-icon-standalone {
          color: var(--primary);
          font-size: 14px;
        }

        .aud-content-tag {
          background: var(--purple-light-bg);
          border: 1px solid #E0E7FF;
          color: var(--purple-tag-text);
          font-weight: 700;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .aud-content-tag-long {
          background: var(--purple-light-bg);
          border: 1px solid #E0E7FF;
          color: var(--purple-tag-text);
          font-weight: 700;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 6px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
        }

        .aud-group-hover {
          position: relative;
        }

        .aud-group-hover .aud-content-tag-long:hover {
          position: relative;
          z-index: 10;
          overflow: visible;
          white-space: nowrap;
          max-width: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .aud-row-2 {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          position: relative;
        }

        .aud-icon-interest {
          margin-top: 5px;
          color: var(--primary);
          font-size: 14px;
          flex-shrink: 0;
        }

        .aud-tags-wrapper {
          flex: 1;
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .aud-tags-wrapper.collapsed {
          max-height: 26px;
        }

        .aud-tags-wrapper.expanded {
          max-height: 500px;
        }

        .aud-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .aud-pill-tag {
          background: var(--purple-light-bg);
          border: 1px solid #E0E7FF;
          color: var(--purple-tag-text);
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }

        .aud-expand-btn {
          cursor: pointer;
          color: #9CA3AF;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          transition: transform 0.2s;
          margin-top: 2px;
        }

        .aud-expand-btn:hover {
          background: #F3F4F6;
          color: var(--primary);
        }

        .aud-expand-btn.rotated {
          transform: rotate(180deg);
        }

        .ad-header {
          padding: 12px 12px 8px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .ad-user-info {
          display: flex;
          gap: 8px;
        }

        .ad-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          font-size: 16px;
        }

        .ad-text-box h4 {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.2;
        }

        .ad-text-box p {
          font-size: 11px;
          color: var(--text-gray);
          margin-top: 1px;
        }

        .ad-header-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          background: #F3F4F6;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-dark);
          cursor: default;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-publish-card {
          background: linear-gradient(90deg, #8B5CF6, #7033f5);
          border: none;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
          transition: all 0.2s;
        }

        .btn-publish-card:hover {
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
          transform: translateY(-1px);
        }

        .published-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-badge.status-manual {
          background: #F5F1FF;
          border: 1px solid #E0E7FF;
          color: #7033f5;
        }

        .status-badge.status-auto {
          background: #ECFDF5;
          border: 1px solid #D1FAE5;
          color: #059669;
        }

        .ad-body-text {
          padding: 4px 12px 12px;
          cursor: pointer;
          min-height: 60px;
          border: 1px solid transparent;
          border-radius: 8px;
          transition: all 0.2s;
          position: relative;
        }

        .ad-body-text:hover {
          background: #F9FAFB;
          border-color: #E5E7EB;
        }

        .ad-body-text.loading {
          cursor: default;
        }

        .ad-line {
          font-size: 13px;
          line-height: 1.4;
          color: var(--text-dark);
          margin-bottom: 4px;
          display: block;
        }

        .skeleton-loader {
          width: 100%;
          padding: 12px;
          background: var(--purple-light-bg);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 14px;
          background: var(--primary);
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .skeleton-bar {
          height: 10px;
          background: #D1D5DB;
          border-radius: 4px;
          opacity: 0.6;
          animation: pulse-gray 1.5s infinite ease-in-out;
        }

        .skeleton-bar.short {
          width: 70%;
        }

        @keyframes pulse-gray {
          0% { opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; }
        }

        .ad-media-area {
          width: 100%;
          aspect-ratio: 1;
          background: #F9FAFB;
          position: relative;
          border-top: 1px solid #F3F4F6;
          border-bottom: 1px solid #F3F4F6;
          overflow: hidden;
          cursor: pointer;
        }

        .media-filled {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .media-filled img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 10;
        }

        .media-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .btn-change-trigger {
          background: white;
          color: var(--text-dark);
          padding: 10px 20px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transform: scale(0.9);
          transition: transform 0.2s;
        }

        .media-overlay.active .btn-change-trigger {
          transform: scale(1);
        }

        .media-empty {
          margin: 0 12px 12px;
          height: calc(100% - 12px);
          border: 2px dashed #D1D5DB;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          color: var(--text-gray);
        }

        .ad-cta-section {
          background: #F9FAFB;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }

        .cta-left h5 {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .cta-left p {
          font-size: 11px;
          color: var(--text-gray);
          min-height: 14px;
          margin-top: 2px;
        }

        .cta-loading-box {
          background: var(--purple-light-bg);
          border-radius: 4px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100px;
          height: 20px;
        }

        .cta-skel-bar {
          height: 6px;
          width: 100%;
          background: #D1D5DB;
          border-radius: 2px;
          animation: pulse-gray 1.5s infinite;
        }

        .cta-wrapper {
          position: relative;
        }

        .btn-shop {
          background: white;
          border: 1px solid #D1D5DB;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cta-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          width: 140px;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          z-index: 50;
          display: none;
          overflow: hidden;
        }

        .cta-dropdown.active {
          display: block;
        }

        .cta-option {
          padding: 10px 12px;
          font-size: 12px;
          color: var(--text-dark);
          cursor: pointer;
          font-weight: 500;
        }

        .cta-option:hover {
          background: var(--bg-body);
          color: var(--primary);
        }

        .btn-shop-fixed {
          background: white;
          border: 1px solid #D1D5DB;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          cursor: default;
        }

        .ad-social {
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #F3F4F6;
          color: var(--text-gray);
        }

        .social-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        /* --- Drawer Modal Styles --- */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .drawer-content {
          width: 100%;
          max-width: 100%;
          height: 95vh;
          background: white;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .drawer-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #F3F4F6;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .drawer-close-btn:hover {
          background: #E5E7EB;
          color: #111827;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .drawer-preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* --- Consistent Card Height --- */
        .campaign-wrapper {
          height: 100%;
        }

        .ad-card {
          height: 100%;
          min-height: 550px;
          display: flex;
          flex-direction: column;
        }

        .ad-media-area {
          flex: 1;
          min-height: 200px;
        }

        .media-filled img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* --- Drawer Footer Styles --- */
        .drawer-footer {
          padding: 16px 24px;
          border-top: 1px solid #E5E7EB;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          background: white;
          flex-shrink: 0;
        }

        .drawer-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .drawer-btn-secondary {
          background: white;
          border: 1px solid #D1D5DB;
          color: #374151;
        }

        .drawer-btn-secondary:hover {
          background: #F9FAFB;
        }

        .drawer-btn-primary {
          background: linear-gradient(90deg, #8B5CF6, #7033f5);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .drawer-btn-primary:hover {
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default AdInsights;
