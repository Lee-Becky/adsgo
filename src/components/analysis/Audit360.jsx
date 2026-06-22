import { useEffect, useMemo, useRef, useState } from 'react'
import { GeoAuditWorldMap } from './GeoAuditWorldMap'
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  Circle,
  Compass,
  Copy,
  Download,
  Filter,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  LayoutTemplate,
  Layers2,
  Link2,
  Monitor,
  RefreshCw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Smile,
  Smartphone,
  ThumbsDown,
  ThumbsUp,
  Type,
  Video,
  X,
  MessageCircle
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const MAIN_TABS = [
  { id: 'metaDashboard', label: 'Meta Dashboard' },
  { id: 'targetingInsights', label: 'Targeting Insights' },
  { id: 'auctionInsights', label: 'Auction Insights' },
  { id: 'geoDemoInsights', label: 'Geo & Demo Insights' },
  { id: 'creativeInsights', label: 'Creative Insights' },
  { id: 'adCopyInsights', label: 'Ad Copy Insights' }
]

const RANGE_OPTIONS = [
  { id: 'last30', label: 'Last 30 days' },
  { id: 'last14', label: 'Last 14 days' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last3', label: 'Last 3 days' }
]

const FUNNEL_COLUMNS = [
  { key: 'spent', label: 'Amount Spent' },
  { key: 'roas', label: 'ROAS (All)' },
  { key: 'reg', label: 'Registration' },
  { key: 'cpp', label: 'Cost per Purchase' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'cpw', label: 'Cost per Website Purchase' }
]

const FUNNEL_ROWS = [
  {
    id: 'total',
    label: 'Total',
    bar: null,
    spent: 'US$775',
    roas: '0.00',
    reg: '18',
    cpp: 'US$193.74',
    revenue: 'US$0',
    cpw: 'US$193.74'
  },
  {
    id: 'prospecting',
    label: 'Acquisition Prospecting',
    bar: 'green',
    spent: 'US$775',
    roas: '0.00',
    reg: '18',
    cpp: 'US$193.74',
    revenue: 'US$0',
    cpw: 'US$193.74'
  },
  {
    id: 'reengagement',
    label: 'Acquisition Re-Engagement',
    bar: 'pink',
    spent: 'US$0',
    roas: '0.00',
    reg: '0',
    cpp: '-',
    revenue: 'US$0',
    cpw: '-'
  },
  {
    id: 'retargeting',
    label: 'Retargeting',
    bar: 'blue',
    spent: 'US$0',
    roas: '0.00',
    reg: '0',
    cpp: '-',
    revenue: 'US$0',
    cpw: '-'
  },
  {
    id: 'retention',
    label: 'Retention',
    bar: 'purple',
    spent: 'US$0',
    roas: '0.00',
    reg: '0',
    cpp: '-',
    revenue: 'US$0',
    cpw: '-'
  }
]

const barClass = {
  green: 'bg-success-500',
  pink: 'bg-pink-500',
  blue: 'bg-info-500',
  purple: 'bg-primary-500'
}

const SCORE_METRICS = ['ROAS', 'CPA', 'CTR']
const BAR_METRICS = ['Current', '7D Avg', 'MoM']
const TABLE_MODES = [
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'trend', label: 'Trend' },
  { id: 'alerts', label: 'Alerts' }
]

const META_METRICS = ['ROAS (All)', 'Amount Spent', 'Revenue']
const STRATEGY_DRILL_TABS = [
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'retargeting', label: 'Retargeting' },
  { id: 'retention', label: 'Retention' }
]
const STRATEGY_DRILL_SERIES = [
  { key: 'revenue', label: 'Revenue', color: '#4aa3ff' },
  { key: 'spent', label: 'Amount Spent', color: '#1f77c6' },
  { key: 'ctr', label: 'CTR', color: '#f4a6b7' },
  { key: 'cpm', label: 'CPM', color: '#6a5af9' }
]
const STRATEGY_DRILL_DATA = {
  acquisition: [
    { name: 'Feb 18', revenue: 110, spent: 160, ctr: 4, cpm: 190 },
    { name: 'Feb 22', revenue: 245, spent: 230, ctr: 4.5, cpm: 235 },
    { name: 'Mar 1', revenue: 230, spent: 215, ctr: 4.2, cpm: 228 },
    { name: 'Mar 8', revenue: 180, spent: 170, ctr: 3.8, cpm: 240 },
    { name: 'Mar 15', revenue: 55, spent: 45, ctr: 3.2, cpm: 205 }
  ],
  retargeting: [
    { name: 'Feb 18', revenue: 60, spent: 72, ctr: 2.8, cpm: 92 },
    { name: 'Feb 22', revenue: 90, spent: 106, ctr: 3.2, cpm: 118 },
    { name: 'Mar 1', revenue: 85, spent: 98, ctr: 3.0, cpm: 110 },
    { name: 'Mar 8', revenue: 76, spent: 88, ctr: 2.7, cpm: 104 },
    { name: 'Mar 15', revenue: 64, spent: 78, ctr: 2.5, cpm: 96 }
  ],
  retention: [
    { name: 'Feb 18', revenue: 40, spent: 48, ctr: 2.2, cpm: 72 },
    { name: 'Feb 22', revenue: 62, spent: 70, ctr: 2.6, cpm: 90 },
    { name: 'Mar 1', revenue: 58, spent: 66, ctr: 2.4, cpm: 86 },
    { name: 'Mar 8', revenue: 54, spent: 60, ctr: 2.3, cpm: 82 },
    { name: 'Mar 15', revenue: 46, spent: 52, ctr: 2.1, cpm: 76 }
  ]
}
const TOTAL_REVENUE_DATA = [
  { name: 'Feb 18', acquisition: 0.2, retargeting: 0.15, retention: 0.12, amountSpent: 110 },
  { name: 'Feb 22', acquisition: 0.22, retargeting: 0.16, retention: 0.13, amountSpent: 250 },
  { name: 'Mar 1', acquisition: 0.18, retargeting: 0.14, retention: 0.12, amountSpent: 220 },
  { name: 'Mar 8', acquisition: 0.17, retargeting: 0.13, retention: 0.11, amountSpent: 180 },
  { name: 'Mar 15', acquisition: 0.15, retargeting: 0.12, retention: 0.1, amountSpent: 55 }
]

function MetaColHeader({ label }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#1877F2] text-[10px] font-bold text-white"
        aria-hidden
      >
        f
      </span>
      <span className="truncate">{label}</span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />
    </div>
  )
}

const TAB_CONFIG = {
  targetingInsights: {
    title: 'Targeting Insights',
    kpis: [
      { label: 'Best Audience', value: 'Women 25-34', sub: 'ROAS 4.7' },
      { label: 'Wasted Spend', value: 'US$1,209', sub: '16.2% of spend' },
      { label: 'Top Interest Cluster', value: 'Beauty + Wellness', sub: 'CTR 2.98%' },
      { label: 'Scaling Segment', value: 'Lookalike 2%', sub: 'CPA US$12.2' }
    ],
    lineData: [
      { name: 'Prospecting', score: 2.9 },
      { name: 'LAL 1%', score: 4.1 },
      { name: 'LAL 2%', score: 4.4 },
      { name: 'Interest', score: 3.7 },
      { name: 'Retarget 7D', score: 5.2 }
    ],
    barTitle: 'Audience Size vs ROAS',
    barData: [
      { name: 'F 25-34', value: 4.7 },
      { name: 'M 25-34', value: 4.3 },
      { name: 'F 18-24', value: 1.8 },
      { name: 'M 35-44', value: 3.2 }
    ],
    pieData: [
      { name: 'Healthy Spend', value: 74, color: '#00b42a' },
      { name: 'Wasted Spend', value: 26, color: '#ff7d00' }
    ],
    table: [
      ['Audience', 'Spend', 'CPA', 'ROAS'],
      ['Female 25-34', 'US$1,845', 'US$11.8', '4.7'],
      ['Male 25-34', 'US$1,220', 'US$9.4', '4.3'],
      ['Female 18-24', 'US$1,090', 'US$22.1', '1.8'],
      ['Male 35-44', 'US$640', 'US$14.9', '3.2'],
      ['Female 35-44', 'US$530', 'US$13.8', '3.6'],
      ['Male 45-54', 'US$420', 'US$16.2', '2.9'],
      ['Female 45-54', 'US$360', 'US$15.4', '3.1'],
      ['Male 18-24', 'US$290', 'US$18.7', '2.4'],
      ['Unknown', 'US$180', 'US$20.5', '1.9']
    ],
    secondaryTable: [
      ['Interest', 'CTR', 'CVR', 'Spend'],
      ['Skincare', '2.9%', '6.2%', 'US$940'],
      ['Wellness', '3.1%', '7.0%', 'US$880'],
      ['Haircare', '2.1%', '4.3%', 'US$620'],
      ['Natural beauty', '2.7%', '5.6%', 'US$540'],
      ['Organic lifestyle', '2.4%', '5.1%', 'US$490'],
      ['Anti-aging', '1.8%', '3.7%', 'US$420'],
      ['Beauty devices', '2.2%', '4.9%', 'US$380']
    ]
  },
  auctionInsights: {
    title: 'Auction Insights',
    /** 与 Madgicx auction-analytics 参考页「Placement & Device · Dashboard View」一致 */
    placementDashboard: {
      devices: [
        { key: 'desktop', label: 'Desktop', icon: 'monitor', spend: 'US$112.5', spendPct: '14.56% of Spend', small: '0', roas: '0.00' },
        { key: 'mobile', label: 'Mobile', icon: 'phone', spend: 'US$660', spendPct: '85.44% of Spend', small: '0', roas: '0.00' }
      ],
      systems: [
        { key: 'ios', label: 'iOS', icon: 'apple', spend: 'US$263.74', spendPct: '39.95% of Spend', small: '0', roas: '0.00' },
        { key: 'android', label: 'Android', icon: 'android', spend: 'US$396', spendPct: '60.05% of Spend', small: '0', roas: '0.00' }
      ]
    },
    placementBreakdown: [
      { placement: 'Facebook Stories · iOS', spend: 'US$48', spendPct: '6.2%', roas: '0.00' },
      { placement: 'Instagram Feed · iOS', spend: 'US$312', spendPct: '40.2%', roas: '0.00' },
      { placement: 'Instagram Feed · Android', spend: 'US$198', spendPct: '25.5%', roas: '0.00' },
      { placement: 'Facebook Feed · Mobile', spend: 'US$217', spendPct: '28.1%', roas: '0.00' }
    ],
    campaignBudget: {
      cbo: { label: 'Campaign Budget Optimization', spend: 'US$0', spendPct: '0% of Spend' },
      abo: { label: 'Ad Set Budget Optimization', spend: 'US$775', spendPct: '100% of Spend' },
      cboTiers: [
        { label: 'Low budget ($0 - $0)', campaigns: 0, adSets: 0 },
        { label: 'Medium budget ($0 - $0)', campaigns: 0, adSets: 0 },
        { label: 'High budget (>$0)', campaigns: 0, adSets: 0 }
      ]
    },
    campaignObjective: {
      centerSpend: 'US$775',
      legend: [{ pct: '100%', spend: 'US$775', name: 'Outcome Sales', roas: '0.00' }],
      pie: [{ name: 'Outcome Sales', value: 100, color: '#7033F5' }],
      tableRows: [{ name: 'Outcome Sales', spend: 'US$775', pct: '100%', roas: '0.00' }]
    },
    adDelivery: {
      centerSpend: 'US$775',
      legend: [{ pct: '100%', spend: 'US$775', name: 'Purchase', roas: '0.00' }],
      pie: [{ name: 'Purchase', value: 100, color: '#1e3a8a' }],
      tableRows: [{ name: 'Purchase', spend: 'US$775', pct: '100%', roas: '0.00' }]
    },
    learningPhase: [
      { status: 'In learning', sub: '0 Ad Sets', tone: 'outline', spent: '—', roas: '—', reg: '—' },
      { status: 'Out of learning', sub: '0 Ad Sets', tone: 'solid', spent: '—', roas: '—', reg: '—' },
      { status: 'Limited learning', sub: '0 Ad Sets', tone: 'warn', spent: '—', roas: '—', reg: '—' }
    ],
    automaticBid: {
      summary: { label: 'Automatic', spend: 'US$775', spendPct: '100% of Spend' },
      bidRows: [{ type: 'Lowest Cost Without Cap', spent: 'US$775' }]
    },
    qualityRanking: [
      { status: 'Above average', ads: '0 Ads', spent: '—', roas: '—', reg: '—' },
      { status: 'Average', ads: '0 Ads', spent: '—', roas: '—', reg: '—' },
      { status: 'Bottom 35%', ads: '0 Ads', spent: '—', roas: '—', reg: '—' },
      { status: 'Bottom 20%', ads: '0 Ads', spent: '—', roas: '—', reg: '—' },
      { status: 'Bottom 10%', ads: '0 Ads', spent: '—', roas: '—', reg: '—' },
      { status: 'Yet to be ranked', ads: '0 Ads', spent: '—', roas: '—', reg: '—' }
    ],
    adTypes: [
      { key: 'normal', label: 'Normal ads', ads: '0 Ads', info: false },
      { key: 'dco', label: 'DCO (Dynamic Creative Optimization)', ads: '0 Ads', info: true },
      { key: 'mto', label: 'MTO (Multiple Text Optimization)', ads: '0 Ads', info: true },
      { key: 'dpa', label: 'DPA (Dynamic Product Ads)', ads: '0 Ads', info: true }
    ],
    heatmapDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    heatmapHours: Array.from({ length: 24 }, (_, i) => i),
    frequencyColumns: [
      { key: '1', label: '1 Time' },
      { key: '2', label: '2 Times' },
      { key: '3', label: '3 Times' },
      { key: '4', label: '4 Times' },
      { key: '5', label: '5 Times' },
      { key: '6-10', label: '6-10 Times' },
      { key: '11-15', label: '11-15 Times' }
    ],
    frequencyReach: ['2,189', '43', '19', '338', '5', '8', '—']
  },
  geoDemoInsights: {
    title: 'Geo & Demo Insights',
    /** Madgicx geo-demo-insights「Wasted Spend」 */
    wastedSpend: {
      centerTotal: 'US$775',
      centerLabel: 'Total Spend',
      donut: [{ name: 'No ROAS data', value: 100, color: '#d1d5db' }],
      upliftLine: '0.00% potential uplift for ROAS (All)',
      breakdown: [
        {
          key: 'noRoas',
          icon: 'help',
          label: 'Spend on Countries with no ROAS (All) yet',
          value: 'US$775'
        },
        {
          key: 'bad',
          icon: 'down',
          label: 'Bad performing Countries Spend',
          value: 'US$0'
        },
        {
          key: 'good',
          icon: 'up',
          label: 'Good Countries Spend',
          value: 'US$0'
        }
      ]
    },
    trendingCountries: [{ key: 'us', name: 'United States', flag: '🇺🇸', change: '—' }],
    internationalTiers: [
      {
        type: 'Top countries',
        copy: true,
        flag: '🇺🇸',
        change: '- US%',
        spent: 'US$775 (100% from total spend)',
        roas: '0.00',
        results: '18'
      },
      { type: 'Tier 1', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Tier 2', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Tier 3', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Tier 4', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' }
    ],
    internationalRegions: [
      {
        type: 'North America',
        change: '0%',
        spent: 'US$775 (100% from total spend)',
        roas: '0.00',
        results: '18'
      },
      { type: 'Europe', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Asia Pacific', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Latin America', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' },
      { type: 'Middle East & Africa', change: '0%', spent: 'US$0 (0% from total spend)', roas: '0.00', results: '0' }
    ],
    ageRows: [
      { age: '18-24', spent: 'US$37.24' },
      { age: '25-34', spent: 'US$106.05' },
      { age: '35-44', spent: 'US$213.8' },
      { age: '45-54', spent: 'US$170.84' },
      { age: '55-64', spent: 'US$189.34' },
      { age: '65+', spent: 'US$57.69' }
    ],
    genderRows: [
      { gender: 'Female', spent: 'US$387.50' },
      { gender: 'Male', spent: 'US$387.50' }
    ],
    ageGenderRows: [
      { cell: 'Female · 18-24', spent: 'US$37.24' },
      { cell: 'Male · 25-34', spent: 'US$106.05' },
      { cell: 'Female · 35-44', spent: 'US$120.00' },
      { cell: 'Male · 35-44', spent: 'US$93.80' }
    ],
    languageKpis: {
      bestTargeting: '0.00',
      bestCopy: '0.00',
      bestSpoken: '0.00'
    },
    languageTables: {
      targeting: [{ lang: 'All languages', ads: '17', spent: 'US$775', icon: 'globe' }],
      copy: [{ lang: 'All languages', ads: '17', spent: 'US$775', icon: 'globe' }],
      spoken: [{ lang: 'All languages', ads: '17', spent: 'US$775', icon: 'globe' }]
    }
  },
  creativeInsights: {
    /** Madgicx Creative Insights — format summary row */
    formatCards: [
      {
        id: 'image',
        title: 'Image',
        count: 20,
        spent: 'US$296.21',
        roas: '0.00',
        ctr: '1.71%',
        conv: '9.38',
        revenuePct: 0,
        spendPct: 38.2,
        empty: false,
        icon: 'image'
      },
      {
        id: 'short',
        title: 'Short Video',
        count: 0,
        empty: true,
        icon: 'video'
      },
      {
        id: 'medium',
        title: 'Medium Video',
        count: 8,
        spent: 'US$479',
        roas: '0.00',
        ctr: '2.94%',
        conv: '1.20',
        revenuePct: 0,
        spendPct: 61.8,
        empty: false,
        icon: 'video'
      },
      {
        id: 'long',
        title: 'Long Video',
        count: 0,
        spent: 'US$0',
        roas: '0.00',
        ctr: '0.00%',
        conv: '0.00',
        revenuePct: 0,
        spendPct: 0,
        empty: false,
        icon: 'video'
      },
      {
        id: 'carousel',
        title: 'Carousel',
        count: 0,
        spent: 'US$0',
        roas: '0.00',
        ctr: '0.00%',
        conv: '0.00',
        revenuePct: 0,
        spendPct: 0,
        empty: false,
        icon: 'carousel'
      },
      {
        id: 'dpa',
        title: 'DPA',
        count: 0,
        spent: 'US$0',
        roas: '0.00',
        ctr: '0.00%',
        conv: '0.00',
        revenuePct: 0,
        spendPct: 0,
        empty: false,
        icon: 'dpa'
      }
    ],
    /** Scatter: spend (x) vs revenue (y), Madgicx matrix */
    matrixPoints: [
      { id: 'c1', spend: 8, revenue: 0.4, kind: 'image' },
      { id: 'c2', spend: 14, revenue: 0.2, kind: 'video' },
      { id: 'c3', spend: 22, revenue: 1.1, kind: 'image' },
      { id: 'c4', spend: 28, revenue: 0.9, kind: 'video' },
      { id: 'c5', spend: 35, revenue: 1.8, kind: 'video' },
      { id: 'c6', spend: 42, revenue: 2.2, kind: 'image' },
      { id: 'c7', spend: 48, revenue: 1.4, kind: 'video' },
      { id: 'c8', spend: 55, revenue: 2.6, kind: 'image' },
      { id: 'c9', spend: 62, revenue: 1.2, kind: 'video' },
      { id: 'c10', spend: 68, revenue: 0.8, kind: 'image' },
      { id: 'c11', spend: 74, revenue: 0.5, kind: 'video' },
      { id: 'c12', spend: 82, revenue: 0.3, kind: 'image' },
      { id: 'c13', spend: 18, revenue: 0.15, kind: 'video' },
      { id: 'c14', spend: 90, revenue: 0.2, kind: 'video' }
    ],
    /** Horizontal gallery — 28 tiles, first metrics align with Madgicx a11y */
    galleryCreatives: [
      { rank: 1, revPct: '2', spendPct: '0', ratio: '1:1', video: false },
      { rank: 2, revPct: '0.1', spendPct: '0', ratio: '4:5', video: true },
      { rank: 3, revPct: '2', spendPct: '0', ratio: '1:1', video: false },
      { rank: 4, revPct: '3.8', spendPct: '0', ratio: '4:5', video: true },
      { rank: 5, revPct: '13', spendPct: '0', ratio: '1:1', video: true },
      { rank: 6, revPct: '0.1', spendPct: '0', ratio: '4:5', video: false },
      { rank: 7, revPct: '0.3', spendPct: '0', ratio: '1:1', video: true },
      { rank: 8, revPct: '0.6', spendPct: '0', ratio: '4:5', video: true },
      { rank: 9, revPct: '0', spendPct: '0', ratio: '1:1', video: false },
      { rank: 10, revPct: '4.2', spendPct: '0', ratio: '4:5', video: true },
      { rank: 11, revPct: '1.9', spendPct: '0', ratio: '1:1', video: false },
      { rank: 12, revPct: '1.8', spendPct: '0', ratio: '4:5', video: true },
      { rank: 13, revPct: '0.5', spendPct: '0', ratio: '1:1', video: true },
      { rank: 14, revPct: '0.1', spendPct: '0', ratio: '4:5', video: false },
      { rank: 15, revPct: '0.9', spendPct: '0', ratio: '1:1', video: true },
      { rank: 16, revPct: '0.5', spendPct: '0', ratio: '4:5', video: false },
      { rank: 17, revPct: '0.3', spendPct: '0', ratio: '1:1', video: true },
      { rank: 18, revPct: '0.7', spendPct: '0', ratio: '4:5', video: true },
      { rank: 19, revPct: '0.9', spendPct: '0', ratio: '1:1', video: false },
      { rank: 20, revPct: '4.3', spendPct: '0', ratio: '4:5', video: true },
      { rank: 21, revPct: '13.8', spendPct: '0', ratio: '1:1', video: true },
      { rank: 22, revPct: '2.3', spendPct: '0', ratio: '4:5', video: false },
      { rank: 23, revPct: '8.4', spendPct: '0', ratio: '1:1', video: true },
      { rank: 24, revPct: '7.6', spendPct: '0', ratio: '4:5', video: true },
      { rank: 25, revPct: '16.7', spendPct: '0', ratio: '1:1', video: false },
      { rank: 26, revPct: '4.9', spendPct: '0', ratio: '4:5', video: true },
      { rank: 27, revPct: '0.9', spendPct: '0', ratio: '1:1', video: true },
      { rank: 28, revPct: '7.2', spendPct: '0', ratio: '4:5', video: false }
    ],
    trendData: [
      { name: 'Feb 18', revenue: 110, spent: 160 },
      { name: 'Feb 22', revenue: 245, spent: 230 },
      { name: 'Mar 1', revenue: 230, spent: 215 },
      { name: 'Mar 8', revenue: 180, spent: 170 },
      { name: 'Mar 15', revenue: 55, spent: 45 }
    ],
    trendCreativePick: ['Creative 1', 'Creative 2', 'Creative 3', 'Creative 4', 'Creative 5'],
    aiTags: [
      { name: 'Money', revenuePct: 4.2, spendPct: 5.1 },
      { name: 'Hourglass', revenuePct: 4.2, spendPct: 4.8 },
      { name: 'Tweet', revenuePct: 3.8, spendPct: 4.0 },
      { name: 'Cell', revenuePct: 61.6, spendPct: 58.0 },
      { name: 'Phone', revenuePct: 62.1, spendPct: 59.2 },
      { name: 'Screenshot', revenuePct: 49, spendPct: 52 },
      { name: 'Label', revenuePct: 13.1, spendPct: 12.4 },
      { name: 'Price', revenuePct: 20.3, spendPct: 18.9 },
      { name: 'Chair', revenuePct: 13, spendPct: 11.2 }
    ],
    minSpendDefault: 0,
    maxSpendDefault: 775,
    creativesTotal: 28
  },
  adCopyInsights: {
    /** Copy length — Madgicx Short / Medium / Long */
    lengthCards: [
      {
        id: 'short',
        title: 'Short copy',
        count: 3,
        empty: true,
        hint: 'Very few short-copy ads in this account. Test more short primary text to learn what resonates.'
      },
      {
        id: 'medium',
        title: 'Medium copy',
        count: 44,
        spent: 'US$412',
        revenue: 'US$398',
        roas: '0.97',
        ctr: '2.14%',
        outboundCtr: '1.82%',
        revenuePct: 48.2,
        spendPct: 51.4,
        empty: false
      },
      {
        id: 'long',
        title: 'Long copy',
        count: 12,
        spent: 'US$363',
        revenue: 'US$401',
        roas: '1.10',
        ctr: '2.41%',
        outboundCtr: '2.05%',
        revenuePct: 51.8,
        spendPct: 48.6,
        empty: false
      }
    ],
    /** Assets chart — spend (x) vs revenue (y), quadrants per academy */
    matrixPoints: [
      { id: 'a1', spend: 12, revenue: 62, label: 'Copy A' },
      { id: 'a2', spend: 18, revenue: 58, label: 'Copy B' },
      { id: 'a3', spend: 28, revenue: 72, label: 'Copy C' },
      { id: 'a4', spend: 35, revenue: 38, label: 'Copy D' },
      { id: 'a5', spend: 48, revenue: 44, label: 'Copy E' },
      { id: 'a6', spend: 55, revenue: 28, label: 'Copy F' },
      { id: 'a7', spend: 62, revenue: 22, label: 'Copy G' },
      { id: 'a8', spend: 70, revenue: 18, label: 'Copy H' },
      { id: 'a9', spend: 22, revenue: 18, label: 'Copy I' },
      { id: 'a10', spend: 15, revenue: 14, label: 'Copy J' },
      { id: 'a11', spend: 78, revenue: 52, label: 'Copy K' },
      { id: 'a12', spend: 85, revenue: 48, label: 'Copy L' },
      { id: 'a13', spend: 40, revenue: 68, label: 'Copy M' },
      { id: 'a14', spend: 8, revenue: 24, label: 'Copy N' },
      { id: 'a15', spend: 92, revenue: 12, label: 'Copy O' }
    ],
    copyAssetsTotal: 18,
    copyAssets: [
      { rank: 1, preview: 'Stop scrolling — your skin will thank you in 7 days.', revPct: '12.4', spendPct: '8.2', ads: 6 },
      { rank: 2, preview: 'Free shipping ends tonight. Tap to claim your bundle.', revPct: '9.1', spendPct: '11.0', ads: 4 },
      { rank: 3, preview: 'Why 10k+ customers switched to our routine (real reviews).', revPct: '8.6', spendPct: '7.4', ads: 5 },
      { rank: 4, preview: 'Limited drop: the serum that sold out 3x this season.', revPct: '7.2', spendPct: '14.1', ads: 3 },
      { rank: 5, preview: 'Hydration that lasts 24h — dermatologist-tested formula.', revPct: '6.8', spendPct: '6.2', ads: 7 },
      { rank: 6, preview: 'Not sure where to start? Try our starter kit for US$29.', revPct: '5.9', spendPct: '9.8', ads: 2 },
      { rank: 7, preview: 'Before / after you can actually see. No filter.', revPct: '5.4', spendPct: '5.1', ads: 4 },
      { rank: 8, preview: 'Your cart is waiting — finish checkout in one tap.', revPct: '4.2', spendPct: '12.6', ads: 8 },
      { rank: 9, preview: 'Sensitive skin? Here is the routine we recommend first.', revPct: '3.9', spendPct: '4.4', ads: 5 },
      { rank: 10, preview: 'Sale: 30% off bestsellers. Code SKIN30 at checkout.', revPct: '3.1', spendPct: '6.9', ads: 6 },
      { rank: 11, preview: 'Join the club — members get early access + gifts.', revPct: '2.6', spendPct: '3.8', ads: 3 },
      { rank: 12, preview: 'Still thinking about it? Read what experts say inside.', revPct: '2.2', spendPct: '5.5', ads: 2 }
    ],
    allCopyTable: [
      { snippet: 'Stop scrolling — your skin will thank you…', roas: '1.24', spent: 'US$186', revenue: 'US$231', usage: '6 ads' },
      { snippet: 'Free shipping ends tonight. Tap to claim…', roas: '0.91', spent: 'US$242', revenue: 'US$220', usage: '4 ads' },
      { snippet: 'Why 10k+ customers switched to our routine…', roas: '1.08', spent: 'US$164', revenue: 'US$177', usage: '5 ads' },
      { snippet: 'Limited drop: the serum that sold out 3x…', roas: '0.62', spent: 'US$310', revenue: 'US$192', usage: '3 ads' },
      { snippet: 'Hydration that lasts 24h — dermatologist…', roas: '1.15', spent: 'US$128', revenue: 'US$147', usage: '7 ads' },
      { snippet: 'Not sure where to start? Try our starter kit…', roas: '0.71', spent: 'US$198', revenue: 'US$141', usage: '2 ads' },
      { snippet: 'Before / after you can actually see. No filter.', roas: '1.05', spent: 'US$112', revenue: 'US$118', usage: '4 ads' },
      { snippet: 'Your cart is waiting — finish checkout…', roas: '0.38', spent: 'US$276', revenue: 'US$105', usage: '8 ads' },
      { snippet: 'Sensitive skin? Here is the routine…', roas: '0.94', spent: 'US$119', revenue: 'US$112', usage: '5 ads' },
      { snippet: 'Sale: 30% off bestsellers. Code SKIN30…', roas: '0.52', spent: 'US$165', revenue: 'US$86', usage: '6 ads' }
    ],
    emojiRows: [
      { emoji: '🔥', label: 'Fire', revenuePct: 18.2, spendPct: 14.6, ads: '12' },
      { emoji: '✨', label: 'Sparkles', revenuePct: 14.1, spendPct: 11.2, ads: '9' },
      { emoji: '✅', label: 'Check', revenuePct: 9.4, spendPct: 10.8, ads: '7' },
      { emoji: '❤️', label: 'Heart', revenuePct: 6.2, spendPct: 8.1, ads: '5' },
      { emoji: '👇', label: 'Point down', revenuePct: 3.8, spendPct: 6.4, ads: '4' }
    ],
    linkRows: [
      { label: 'No link in primary text', revenuePct: 72.4, spendPct: 68.9, note: 'Most ads' },
      { label: 'With link in primary text', revenuePct: 27.6, spendPct: 31.1, note: 'Under-tested' },
      { label: 'Top URL: shop.example.com/sale', revenuePct: 12.8, spendPct: 9.2, note: '3 ads' }
    ],
    topPhrases: [
      { phrase: 'free shipping', revenuePct: 22.4, spendPct: 19.8, roas: '1.18' },
      { phrase: 'limited time', revenuePct: 16.2, spendPct: 21.4, roas: '0.82' },
      { phrase: 'shop now', revenuePct: 14.6, spendPct: 12.1, roas: '1.26' },
      { phrase: 'before and after', revenuePct: 11.9, spendPct: 8.6, roas: '1.45' },
      { phrase: 'dermatologist', revenuePct: 9.3, spendPct: 7.2, roas: '1.34' },
      { phrase: 'money back', revenuePct: 6.1, spendPct: 5.4, roas: '1.19' }
    ],
    aiTags: [
      { name: 'Urgency', revenuePct: 24.2, spendPct: 28.1 },
      { name: 'Social proof', revenuePct: 19.6, spendPct: 14.8 },
      { name: 'Benefit-led', revenuePct: 18.4, spendPct: 16.2 },
      { name: 'Question hook', revenuePct: 12.1, spendPct: 11.0 },
      { name: 'Discount / offer', revenuePct: 14.8, spendPct: 19.4 },
      { name: 'Brand voice', revenuePct: 10.9, spendPct: 10.5 }
    ],
    trendData: [
      { name: 'Feb 18', revenue: 88, spent: 102 },
      { name: 'Feb 22', revenue: 132, spent: 118 },
      { name: 'Mar 1', revenue: 124, spent: 128 },
      { name: 'Mar 8', revenue: 98, spent: 112 },
      { name: 'Mar 15', revenue: 76, spent: 94 }
    ],
    trendPick: ['Copy asset 1', 'Copy asset 2', 'Copy asset 3', 'Copy asset 4', 'Copy asset 5'],
    minSpendDefault: 0,
    maxSpendDefault: 620,
    /** Legacy table shapes — kept for InsightTabPanel if referenced elsewhere */
    table: [
      ['Copy angle', 'CTR', 'CVR', 'ROAS'],
      ['Problem -> Promise', '3.4%', '7.8%', '4.9'],
      ['Benefit listicle', '2.9%', '6.5%', '4.3'],
      ['Urgency pressure', '0.9%', '2.2%', '1.5'],
      ['UGC style', '2.6%', '6.8%', '4.6'],
      ['Authority claim', '2.3%', '5.1%', '3.9'],
      ['Price anchoring', '1.8%', '3.4%', '2.2'],
      ['Feature-heavy', '1.5%', '2.9%', '1.9'],
      ['Story-led', '2.7%', '6.2%', '4.4']
    ],
    secondaryTable: [
      ['CTA', 'Spend', 'CTR', 'CVR'],
      ['Shop now', 'US$1,980', '3.2%', '7.8%'],
      ['Learn more', 'US$760', '2.1%', '4.4%'],
      ['Get offer', 'US$540', '1.6%', '3.0%'],
      ['Claim now', 'US$420', '1.4%', '2.7%'],
      ['View details', 'US$380', '1.9%', '3.9%'],
      ['Try free', 'US$320', '2.4%', '5.1%'],
      ['See before/after', 'US$260', '2.7%', '5.6%']
    ]
  }
}

function InsightTabPanel({ tabId }) {
  const config = TAB_CONFIG[tabId]
  const [scoreMetric, setScoreMetric] = useState('ROAS')
  const [barMetric, setBarMetric] = useState('Current')
  const [primaryMode, setPrimaryMode] = useState('breakdown')
  const [secondaryMode, setSecondaryMode] = useState('breakdown')
  const headers = config.table[0]
  const body = config.table.slice(1)
  const secondaryHeaders = config.secondaryTable[0]
  const secondaryBody = config.secondaryTable.slice(1)
  const primaryRows = useMemo(() => {
    if (primaryMode === 'trend') return [...body].sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    if (primaryMode === 'alerts') return body.slice(0, 4)
    return body
  }, [body, primaryMode])
  const secondaryRows = useMemo(() => {
    if (secondaryMode === 'trend') return [...secondaryBody].sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    if (secondaryMode === 'alerts') return secondaryBody.slice(0, 4)
    return secondaryBody
  }, [secondaryBody, secondaryMode])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-[#F0F0F0] bg-white p-4 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
            <p className="text-xs font-medium text-neutral-500">{k.label}</p>
            <p className="mt-1 text-lg font-bold text-neutral-900">{k.value}</p>
            <p className="text-xs text-neutral-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-2 rounded-xl border border-[#F0F0F0] bg-white p-5 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[340px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">{config.title} Score Trend</h3>
            <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
              {SCORE_METRICS.map((metric) => (
                <button
                  key={metric}
                  type="button"
                  onClick={() => setScoreMetric(metric)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                    scoreMetric === metric ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={config.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#7033F5" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="xl:col-span-1 rounded-xl border border-[#F0F0F0] bg-white p-5 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[340px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">{config.barTitle}</h3>
            <select
              value={barMetric}
              onChange={(e) => setBarMetric(e.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-600 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {BAR_METRICS.map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={config.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#7033F5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="xl:col-span-1 rounded-xl border border-[#F0F0F0] bg-white p-5 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[340px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">Budget Quality</h3>
            <span className="text-xs text-neutral-500">Split</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={config.pieData} innerRadius={55} outerRadius={88} dataKey="value" paddingAngle={2}>
                  {config.pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {config.pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-neutral-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-neutral-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[430px]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] bg-neutral-50/50 px-5 py-4">
            <h3 className="text-base font-semibold text-neutral-900">{config.title} Breakdown</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
                {TABLE_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPrimaryMode(mode.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      primaryMode === mode.id ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 transition-all hover:border-primary-500 hover:text-primary-600"
              >
                Columns
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100">
                  {headers.map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {primaryRows.map((row) => (
                  <tr key={row[0]} className="border-b border-neutral-50 hover:bg-primary-50/30">
                    {row.map((cell, idx) => (
                      <td key={`${row[0]}-${idx}`} className={`px-5 py-2.5 ${idx === 0 ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[430px]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] bg-neutral-50/50 px-5 py-4">
            <h3 className="text-base font-semibold text-neutral-900">Secondary Breakdown</h3>
            <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
              {TABLE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSecondaryMode(mode.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    secondaryMode === mode.id ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100">
                  {secondaryHeaders.map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {secondaryRows.map((row) => (
                  <tr key={row[0]} className="border-b border-neutral-50 hover:bg-primary-50/30">
                    {row.map((cell, idx) => (
                      <td key={`${row[0]}-2-${idx}`} className={`px-5 py-2.5 ${idx === 0 ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function TargetingTabPanel() {
  const [scoreMetric, setScoreMetric] = useState('ROAS (All)')
  const [audTab, setAudTab] = useState('size')
  const [lalTab, setLalTab] = useState('pct')

  const audSizeRows = [
    ['More than 20M', '2 Ad Sets', 'US$133.13', '0.00', '4'],
    ['10M-20M', '0 Ad Sets', '-', '-', '-'],
    ['2M-10M', '0 Ad Sets', '-', '-', '-'],
    ['500K-2M', '0 Ad Sets', '-', '-', '-'],
    ['100K-500K', '0 Ad Sets', '-', '-', '-'],
    ['10K-100K', '0 Ad Sets', '-', '-', '-'],
    ['1K-10K', '0 Ad Sets', '-', '-', '-'],
    ['Less than 1K', '—', 'US$642', '0.00', '14']
  ]

  const lalRows = [
    ['3-4%', '2 Ad Sets', 'US$52.95', '0.00', '1'],
    ['0-1%', '2 Ad Sets', 'US$44.09', '0.00', '0'],
    ['0-0%', '—', 'US$678', '0.00', '17']
  ]

  const funnelRows = [
    { label: 'Total Account Performance', bold: true, pct: '', live: '1 / 17', spent: 'US$775', roas: '0.00', reg: '18', cpp: 'US$193.74' },
    { label: 'Total Prospecting', bold: true, pct: '100%', live: '1 / 17', spent: 'US$775', roas: '0.00', reg: '18', cpp: 'US$193.74' },
    { label: 'Broad Targeting', bold: false, pct: '', live: '1 / 13', spent: 'US$678', roas: '0.00', reg: '17', cpp: 'US$169.48' },
    { label: 'Lookalikes', bold: false, pct: '', live: '0 / 4', spent: 'US$97.04', roas: '0.00', reg: '1', cpp: '-' },
    { label: 'Interest Targeting', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Interests X Lookalikes', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Others', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Total Re-Engagement', bold: true, pct: '0%', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Social Media Engagers', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Ads Engagers', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Others', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Total Retargeting', bold: true, pct: '0%', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Visitors', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'High Intent Visitors', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Others', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Total Retention', bold: true, pct: '0%', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Pixel Based', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Email Based', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Pixel X Email based', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' },
    { label: 'Others', bold: false, pct: '', live: '0 / 0', spent: '-', roas: '-', reg: '-', cpp: '-' }
  ]

  const metaH = (t) => (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
      {t} <ChevronDown className="h-3 w-3 text-neutral-400" />
    </span>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50"><Filter className="h-4 w-4" />Filter Data</button>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-50"><SlidersHorizontal className="h-4 w-4" />Smart Filter</button>
          <input placeholder="Load filter preset" className="h-10 w-[176px] rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          <button type="button" disabled className="h-10 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-400">Save this view</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-lg font-semibold text-neutral-800">Top Landing Pages <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
            <button type="button" className="rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-50">See all 1 Landing Pages</button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-neutral-100 text-neutral-500"><th className="px-2 py-2 text-left font-semibold">Link</th><th className="px-2 py-2 text-left">{metaH('Amount Sp...')}</th><th className="px-2 py-2 text-left">{metaH('ROAS (All)')}</th></tr></thead>
              <tbody><tr className="border-b border-neutral-50"><td className="px-2 py-2"><p className="text-xs font-medium text-neutral-700">https://www.adsgo.ai/</p><button type="button" className="text-xs font-semibold text-primary-500">39 Ads</button></td><td className="px-2 py-2 font-semibold text-neutral-800">US$775</td><td className="px-2 py-2 font-semibold text-neutral-800">0.00</td></tr></tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-lg font-semibold text-neutral-800">Expand Interest &amp; Lookalike Expansion <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700"><span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>ROAS (All) <ChevronDown className="h-3 w-3 text-neutral-400" /></span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-neutral-100 p-px">
            <div className="bg-white p-3"><p className="text-sm font-semibold text-success-500">✓ Expand Interest</p><p className="mt-1 text-sm font-semibold text-success-500">✓ Lookalike Expansion</p><p className="mt-2 text-sm text-neutral-600">100% of Spend</p><button type="button" className="text-xs font-semibold text-primary-500">17 Ad Sets</button><p className="mt-1 text-3xl font-bold text-neutral-900">0.00</p></div>
            <div className="bg-white p-3"><p className="text-sm font-semibold text-error-500">✗ Expand Interest</p><p className="mt-1 text-sm font-semibold text-success-500">✓ Lookalike Expansion</p><p className="mt-2 text-sm text-neutral-500">You haven't launched these audiences yet</p></div>
            <div className="bg-white p-3"><p className="text-sm font-semibold text-success-500">✓ Expand Interest</p><p className="mt-1 text-sm font-semibold text-error-500">✗ Lookalike Expansion</p><p className="mt-2 text-xs text-primary-500">2 Ad Sets</p><p className="text-xs text-primary-500">2 Ad Sets</p><p className="text-xs text-primary-500">13 Ad Sets</p></div>
            <div className="bg-white p-3"><p className="text-sm font-semibold text-error-500">✗ Expand Interest</p><p className="mt-1 text-sm font-semibold text-error-500">✗ Lookalike Expansion</p><button type="button" className="mt-2 rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-semibold text-primary-600">Go to Madgicx Audiences</button></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-lg font-semibold text-neutral-800">Audience Size &amp; Potential Reach <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
          </div>
          <div className="border-b border-neutral-200 px-4"><div className="flex gap-4">{[{id:'size',l:'Audience Size'},{id:'reach',l:'Potential Reach'}].map(t=>(<button key={t.id} type="button" onClick={()=>setAudTab(t.id)} className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${audTab===t.id?'border-primary-500 text-primary-600':'border-transparent text-neutral-500 hover:text-neutral-700'}`}>{t.l}</button>))}</div></div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-[13px] text-neutral-700">
              <thead><tr className="border-b border-neutral-100 text-left text-neutral-500"><th className="pb-2">Audience Size</th><th className="pb-2">{metaH('Amount Sp...')}</th><th className="pb-2">{metaH('ROAS (All)')}</th><th className="pb-2">{metaH('Registration...')}</th></tr></thead>
              <tbody>{audSizeRows.map(r=>(<tr key={r[0]} className="border-b border-neutral-50 last:border-0"><td className="py-2"><span className="font-semibold">{r[0]}</span><br/><span className="text-xs text-primary-500">{r[1]}</span></td><td className="py-2">{r[2]}</td><td className="py-2">{r[3]}</td><td className="py-2">{r[4]}</td></tr>))}</tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
            <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
              <h3 className="text-lg font-semibold text-neutral-800">WiFi <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700"><span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>ROAS (All) <ChevronDown className="h-3 w-3 text-neutral-400" /></span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-neutral-100 p-px">
              <div className="bg-white p-4 text-center"><p className="text-sm font-semibold text-neutral-800">WiFi Only</p><p className="text-xs text-neutral-500">0% of Spend</p><p className="text-xs text-neutral-400">0 Ad Sets</p><p className="mt-2 text-3xl font-bold text-neutral-300">-</p></div>
              <div className="bg-white p-4 text-center"><p className="text-sm font-semibold text-neutral-800">Any Internet Connection</p><p className="text-xs text-neutral-500">100% of Spend</p><button type="button" className="text-xs font-semibold text-primary-500">17 Ad Sets</button><p className="mt-2 text-3xl font-bold text-neutral-900">0.00</p></div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
            <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
              <h3 className="text-lg font-semibold text-neutral-800">Lookalike &amp; Recency <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
            </div>
            <div className="border-b border-neutral-200 px-4"><div className="flex gap-4">{[{id:'pct',l:'Lookalike %'},{id:'rec',l:'Recency'},{id:'both',l:'Lookalike & Recency'}].map(t=>(<button key={t.id} type="button" onClick={()=>setLalTab(t.id)} className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${lalTab===t.id?'border-primary-500 text-primary-600':'border-transparent text-neutral-500 hover:text-neutral-700'}`}>{t.l}</button>))}</div></div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-[13px] text-neutral-700">
                <thead><tr className="border-b border-neutral-100 text-left text-neutral-500"><th className="pb-2">Lookalike %</th><th className="pb-2">{metaH('Amount Sp...')}</th><th className="pb-2">{metaH('ROAS (All)')}</th><th className="pb-2">{metaH('Registration...')}</th></tr></thead>
                <tbody>{lalRows.map(r=>(<tr key={r[0]} className="border-b border-neutral-50 last:border-0"><td className="py-2"><span className="font-semibold">{r[0]}</span><br/><span className="text-xs text-primary-500">{r[1]}</span></td><td className="py-2">{r[2]}</td><td className="py-2">{r[3]}</td><td className="py-2">{r[4]}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-lg font-semibold text-neutral-800">Targeting Insights Across the Full Funnel <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-neutral-400" /></h3>
          <button type="button" className="rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-semibold text-primary-600">Go to Madgicx Audiences</button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[920px] text-[13px] text-neutral-700">
            <thead><tr className="border-b border-neutral-100 text-left text-neutral-500"><th className="pb-2 w-16">% of spend</th><th className="pb-2">Audience Type</th><th className="pb-2">Live / Created</th><th className="pb-2">Amount Spent</th><th className="pb-2">{metaH('ROAS (All)')}</th><th className="pb-2">{metaH('Registrations...')}</th><th className="pb-2">{metaH('Cost per Pur...')}</th><th className="pb-2">Performance Overview <HelpCircle className="ml-0.5 inline h-3 w-3 text-neutral-400" /></th></tr></thead>
            <tbody>
              {funnelRows.map((r,i) => (
                <tr key={`${r.label}-${i}`} className={`border-b border-neutral-50 last:border-0 ${r.bold ? 'bg-neutral-50/50' : ''}`}>
                  <td className="py-2 text-xs text-neutral-500">{r.pct}</td>
                  <td className={`py-2 ${r.bold ? 'font-bold text-neutral-900' : 'pl-4'}`}>{r.label}</td>
                  <td className="py-2"><span className="text-primary-500">•</span> {r.live}</td>
                  <td className="py-2">{r.spent}</td>
                  <td className="py-2">{r.roas}</td>
                  <td className="py-2">{r.reg}</td>
                  <td className="py-2">{r.cpp}</td>
                  <td className="py-2"><div className="h-1.5 w-full rounded bg-neutral-200"><div className="h-full rounded bg-primary-400" style={{ width: r.bold && r.spent !== '-' ? '60%' : '0%' }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GeoDemoTabPanel() {
  const cfg = TAB_CONFIG.geoDemoInsights
  const ws = cfg.wastedSpend
  const [intlTab, setIntlTab] = useState('tiers')
  const [demoTab, setDemoTab] = useState('age')
  const [langSubTab, setLangSubTab] = useState('targeting')
  const [mapTierFilter, setMapTierFilter] = useState('top')

  const metaH = (t) => (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
      {t} <ChevronDown className="h-3 w-3 text-neutral-400" />
    </span>
  )

  const sortTh = (label) => (
    <span className="inline-flex items-center gap-1">
      <ArrowUpDown className="h-3 w-3 text-neutral-400" />
      {label}
    </span>
  )

  const WastedIcon = ({ kind }) => {
    if (kind === 'help') return <HelpCircle className="h-5 w-5 shrink-0 text-neutral-400" aria-hidden />
    if (kind === 'down') return <ThumbsDown className="h-5 w-5 shrink-0 text-orange-500" aria-hidden />
    return <ThumbsUp className="h-5 w-5 shrink-0 text-success-500" aria-hidden />
  }

  const langRows =
    langSubTab === 'targeting' ? cfg.languageTables.targeting : langSubTab === 'copy' ? cfg.languageTables.copy : cfg.languageTables.spoken

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50"
        >
          <Filter className="h-4 w-4" />
          Filter Data
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <input
            placeholder="Load filter preset"
            className="h-10 w-[200px] rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <button type="button" disabled className="h-10 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-400">
            Save this view
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Wasted Spend</h3>
          </div>
          <div className="p-4">
            <div className="relative mx-auto mb-6 h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ws.donut} dataKey="value" cx="50%" cy="50%" innerRadius={62} outerRadius={88} paddingAngle={0}>
                    {ws.donut.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-xl font-bold text-neutral-900">{ws.centerTotal}</p>
                <p className="text-xs font-medium text-neutral-500">{ws.centerLabel}</p>
              </div>
            </div>
            <ul className="space-y-3 text-[13px]">
              {ws.breakdown.map((row) => (
                <li key={row.key} className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <WastedIcon kind={row.icon} />
                    <span className="font-medium leading-snug text-neutral-800">
                      {row.label}
                      <Info className="ml-1 inline h-3.5 w-3.5 text-neutral-400" />
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden h-1.5 w-16 rounded bg-neutral-100 sm:block" />
                    <span className="font-semibold tabular-nums text-neutral-900">{row.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <span className="font-medium">{ws.upliftLine}</span>
            <Info className="h-4 w-4 shrink-0 text-neutral-400" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Trending Countries</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-[13px] text-neutral-800">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2">{sortTh('Country')}</th>
                </tr>
              </thead>
              <tbody>
                {cfg.trendingCountries.map((c) => (
                  <tr key={c.key} className="border-b border-neutral-50 bg-neutral-50/60 last:border-0">
                    <td className="py-3">
                      <span className="mr-2 text-lg" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="font-semibold">{c.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Maps</h3>
          <button
            type="button"
            className="rounded-lg border border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-50"
          >
            See All Locations
          </button>
        </div>
        <GeoAuditWorldMap tierFilter={mapTierFilter} onTierFilterChange={setMapTierFilter} />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-2 min-w-0 flex-1 rounded-full bg-gradient-to-r from-pink-300 via-violet-400 to-teal-400" />
          <Info className="h-4 w-4 shrink-0 text-neutral-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">International scaling</h3>
          </div>
          <div className="border-b border-neutral-200 px-4">
            <div className="flex gap-6">
              {[
                { id: 'tiers', label: 'Tiers' },
                { id: 'regions', label: 'Regions' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIntlTab(t.id)}
                  className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${
                    intlTab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[640px] text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs font-semibold text-neutral-500">
                  <th className="pb-2 pr-2">Type</th>
                  <th className="pb-2 pr-2">Change Overtime</th>
                  <th className="pb-2 pr-2">{metaH('Amount spent')}</th>
                  <th className="pb-2 pr-2">{metaH('ROAS (All)')}</th>
                  <th className="pb-2">{metaH('Results')}</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {(intlTab === 'tiers' ? cfg.internationalTiers : cfg.internationalRegions).map((row, i) => (
                  <tr key={`${row.type}-${i}`} className={i % 2 === 1 ? 'bg-neutral-50/70' : ''}>
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2">
                        {row.copy && (
                          <button type="button" className="text-neutral-400 hover:text-primary-600" aria-label="Copy">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <span className="inline-flex items-center gap-1 font-semibold">
                          {row.type}
                          <Info className="h-3 w-3 text-neutral-400" />
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className="inline-flex items-center gap-1.5">
                        {row.flag && <span className="text-base">{row.flag}</span>}
                        <span className="text-neutral-700">{row.change}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 font-medium">{row.spent}</td>
                    <td className="py-2.5 pr-2 tabular-nums">{row.roas}</td>
                    <td className="py-2.5 tabular-nums">{row.results}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Age &amp; Gender</h3>
          </div>
          <div className="border-b border-neutral-200 px-4">
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'age', label: 'Age' },
                { id: 'gender', label: 'Gender' },
                { id: 'both', label: 'Age & Gender' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDemoTab(t.id)}
                  className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${
                    demoTab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            {demoTab === 'age' && (
              <table className="w-full min-w-[280px] text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="pb-2">{sortTh('Age')}</th>
                    <th className="pb-2 text-right">{sortTh('Amount Sp.')}</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-800">
                  {cfg.ageRows.map((r) => (
                    <tr key={r.age} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2.5 font-semibold">{r.age}</td>
                      <td className="py-2.5 text-right font-medium">{r.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {demoTab === 'gender' && (
              <table className="w-full min-w-[280px] text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="pb-2">{sortTh('Gender')}</th>
                    <th className="pb-2 text-right">{sortTh('Amount Sp.')}</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-800">
                  {cfg.genderRows.map((r) => (
                    <tr key={r.gender} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2.5 font-semibold">{r.gender}</td>
                      <td className="py-2.5 text-right font-medium">{r.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {demoTab === 'both' && (
              <table className="w-full min-w-[280px] text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="pb-2">{sortTh('Age & Gender')}</th>
                    <th className="pb-2 text-right">{sortTh('Amount Sp.')}</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-800">
                  {cfg.ageGenderRows.map((r) => (
                    <tr key={r.cell} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2.5 font-semibold">{r.cell}</td>
                      <td className="py-2.5 text-right font-medium">{r.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Language</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 border-b border-neutral-100 p-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-100 bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-medium text-neutral-500">Best Targeting Language</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-neutral-900">{cfg.languageKpis.bestTargeting}</p>
          </div>
          <div className="rounded-lg border border-neutral-100 bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-medium text-neutral-500">Best Copy Language</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-neutral-900">{cfg.languageKpis.bestCopy}</p>
          </div>
          <div className="rounded-lg border border-neutral-100 bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-medium text-neutral-500">Best Spoken Country Language</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-neutral-900">{cfg.languageKpis.bestSpoken}</p>
          </div>
        </div>
        <div className="border-b border-neutral-200 px-4">
          <div className="flex flex-wrap gap-6">
            {[
              { id: 'targeting', label: 'Targeting Language' },
              { id: 'copy', label: 'Copy Language' },
              { id: 'spoken', label: 'Spoken Country Language' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setLangSubTab(t.id)}
                className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${
                  langSubTab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[400px] text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-neutral-500">
                <th className="pb-2">{sortTh('Language')}</th>
                <th className="pb-2">{sortTh('Number of ads')}</th>
                <th className="pb-2">{metaH('Amount Spent')}</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {langRows.map((r) => (
                <tr key={`${langSubTab}-${r.lang}`} className="border-b border-neutral-50 bg-neutral-50/50 last:border-0">
                  <td className="py-3">
                    <span className="mr-2 inline-flex text-neutral-500">
                      <Globe className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="font-semibold">{r.lang}</span>
                  </td>
                  <td className="py-3 font-medium">{r.ads}</td>
                  <td className="py-3 font-semibold">{r.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CreativeTabPanel() {
  const cfg = TAB_CONFIG.creativeInsights
  const [trendsOpen, setTrendsOpen] = useState(true)
  const [sortBy, setSortBy] = useState('Revenue (high first)')
  const [selectedCreativeKeys, setSelectedCreativeKeys] = useState(() => new Set())

  const toggleCreativeSel = (rank) => {
    setSelectedCreativeKeys((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank)
      else next.add(rank)
      return next
    })
  }

  const FormatKindIcon = ({ kind }) => {
    const cls = 'h-5 w-5 shrink-0 text-neutral-500'
    if (kind === 'image') return <ImageIcon className={cls} aria-hidden />
    if (kind === 'video') return <Video className={cls} aria-hidden />
    if (kind === 'carousel') return <LayoutGrid className={cls} aria-hidden />
    return <ShoppingBag className={cls} aria-hidden />
  }

  const metricRow = (label, value) => (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-md border border-neutral-100 bg-neutral-50/80 px-2 py-1.5 text-left text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
    >
      <span className="inline-flex items-center gap-1 text-neutral-600">
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[#1877F2] text-[7px] font-bold text-white">f</span>
        {label}
        <ChevronDown className="h-3 w-3 text-neutral-400" aria-hidden />
      </span>
      <span className="font-semibold tabular-nums text-neutral-900">{value}</span>
    </button>
  )

  const matrixShape = (props) => {
    const { cx, cy, payload } = props
    const fill = payload?.kind === 'video' ? '#7033F5' : '#ec4899'
    return (
      <g>
        <rect x={cx - 5} y={cy - 5} width={10} height={10} rx={1.5} fill={fill} opacity={0.92} />
        {payload?.kind === 'video' ? (
          <polygon points={`${cx - 2},${cy - 1} ${cx + 3},${cy + 1.5} ${cx - 2},${cy + 4}`} fill="white" />
        ) : (
          <circle cx={cx} cy={cy + 0.5} r={2} fill="white" />
        )}
      </g>
    )
  }

  const selectedCount = selectedCreativeKeys.size

  return (
    <div className="space-y-5">
      {/* Top: Filter + global metric toggles (Madgicx) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50"
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filter Data
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Amount Spent', 'ROAS (All)', 'Outbound CTR'].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm hover:border-neutral-400"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="rounded-lg border border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-600 shadow-sm hover:bg-primary-50"
          >
            Find Inspiration
          </button>
        </div>
      </div>

      {/* Format performance — 6 cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cfg.formatCards.map((c) => (
          <div
            key={c.id}
            className="flex min-h-[220px] flex-col rounded-xl border border-[#F0F0F0] bg-white p-3 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]"
          >
            <div className="mb-2 flex items-start gap-2">
              <FormatKindIcon kind={c.icon} />
              <h4 className="text-base font-semibold leading-tight text-neutral-900">
                {c.title}{' '}
                <span className="text-xs font-normal text-neutral-400">
                  ({c.count})
                </span>
              </h4>
            </div>
            {c.empty ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50/80 px-2 py-4 text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-100">
                  <Video className="h-6 w-6 text-neutral-300" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-neutral-800">Missing format</p>
                <p className="mt-1 text-[11px] leading-snug text-neutral-500">
                  You&apos;re not using this format in your ads. Test it to diversify performance.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50"
                >
                  Find Inspiration
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col gap-1.5">
                  {metricRow('Amount Spent', c.spent)}
                  {metricRow('ROAS (All)', c.roas)}
                  {metricRow('Outbound CTR', c.ctr)}
                  {metricRow('Conversion Rate (Purchases / Landing Page Views)', c.conv)}
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="bg-pink-400 transition-all"
                      style={{ width: `${Math.min(100, c.revenuePct + c.spendPct) > 0 ? (c.revenuePct / Math.max(0.01, c.revenuePct + c.spendPct)) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-neutral-400 transition-all"
                      style={{
                        width: `${Math.min(100, c.revenuePct + c.spendPct) > 0 ? (c.spendPct / Math.max(0.01, c.revenuePct + c.spendPct)) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-neutral-600">
                    <span className="text-pink-500">{c.revenuePct}% Revenue</span>
                    <span className="text-neutral-600">{c.spendPct}% Spend</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Graded by + spend sliders + actions */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#F0F0F0] bg-white px-4 py-3 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-neutral-600">Graded by:</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[8px] font-bold text-white">f</span>
            Revenue
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
          </button>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <span className="whitespace-nowrap">Min. Spend:</span>
            <input
              type="number"
              defaultValue={cfg.minSpendDefault}
              className="h-9 w-20 rounded-lg border border-neutral-300 px-2 text-xs font-semibold tabular-nums text-neutral-900"
            />
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <span className="whitespace-nowrap">Max. Spend:</span>
            <input
              type="number"
              defaultValue={cfg.maxSpendDefault}
              className="h-9 w-20 rounded-lg border border-neutral-300 px-2 text-xs font-semibold tabular-nums text-neutral-900"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Smart Filter
          </button>
          <button
            type="button"
            className="rounded-lg border border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            See All Creatives
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          disabled
          className="rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-400"
        >
          Open selected in Ads Launcher
        </button>
      </div>

      {/* Creative matrix — spend vs revenue */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="relative border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Creative performance</h3>
          <p className="text-xs text-neutral-500">Revenue vs amount spent — hover creatives below to highlight</p>
        </div>
        <div className="relative p-4">
          <div className="pointer-events-none absolute left-[12%] top-14 z-10 flex h-[calc(100%-5rem)] w-8 items-center justify-center">
            <span
              className="origin-center -rotate-90 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-pink-400/90"
              style={{ writingMode: 'vertical-rl' }}
            >
              Getting started
            </span>
          </div>
          <div className="pointer-events-none absolute right-[10%] top-14 z-10 flex h-[calc(100%-5rem)] w-8 items-center justify-center">
            <span
              className="origin-center -rotate-90 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-pink-400/90"
              style={{ writingMode: 'vertical-rl' }}
            >
              Overspend
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis
                  type="number"
                  dataKey="spend"
                  name="Spend"
                  domain={[0, 100]}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(v) => `US$${v}`}
                />
                <YAxis
                  type="number"
                  dataKey="revenue"
                  name="Revenue"
                  domain={[0, 3]}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(v) => `US$${v}`}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [typeof value === 'number' ? `US$${value}` : value, name === 'spend' ? 'Amount spent' : 'Revenue']}
                />
                <ReferenceArea x1={0} x2={22} y1={0} y2={3} fill="#fce7f3" fillOpacity={0.45} />
                <ReferenceArea x1={72} x2={100} y1={0} y2={3} fill="#fce7f3" fillOpacity={0.45} />
                <Scatter name="Creatives" data={cfg.matrixPoints} shape={matrixShape} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Creatives gallery */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-col gap-2 border-b border-[#F5F5F5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-sm font-semibold text-neutral-900">
            Creatives ({cfg.creativesTotal})
          </h5>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800"
              >
                <option>Revenue (high first)</option>
                <option>Revenue (low first)</option>
                <option>Amount spent (high first)</option>
                <option>Amount spent (low first)</option>
              </select>
            </label>
            <span className="text-xs font-semibold text-neutral-500">{selectedCount} selected</span>
          </div>
        </div>
        <div className="overflow-x-auto p-4 pb-2">
          <div className="flex w-max gap-3">
            {cfg.galleryCreatives.map((cr) => {
              const sel = selectedCreativeKeys.has(cr.rank)
              return (
                <button
                  key={cr.rank}
                  type="button"
                  onClick={() => toggleCreativeSel(cr.rank)}
                  className={`relative w-[132px] shrink-0 rounded-lg border bg-white p-2 text-left shadow-sm transition-all ${
                    sel ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white shadow">
                      {cr.rank}
                    </span>
                  </div>
                  <div className="mb-1 flex justify-between gap-1 text-[11px] font-bold tabular-nums">
                    <span className="text-pink-500">{cr.revPct}%</span>
                    <span className="text-teal-500">{cr.spendPct}%</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-neutral-400">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded border border-dashed border-neutral-300 text-[9px] font-semibold text-neutral-500">
                      {cr.ratio}
                    </span>
                    {cr.video ? (
                      <Video className="h-4 w-4 text-neutral-500" aria-hidden />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-neutral-500" aria-hidden />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-primary-600">Creative Preview</span>
                  <span className="absolute bottom-2 right-2 text-neutral-400">
                    <Search className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Creative Performance Trends */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Creative Performance Trends</h3>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-700">
              <input
                type="checkbox"
                checked={trendsOpen}
                onChange={() => setTrendsOpen((v) => !v)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <button type="button" className="text-neutral-400 hover:text-neutral-600" aria-label="Collapse section">
              <span className="block h-0.5 w-4 bg-current" />
            </button>
          </div>
        </div>
        {trendsOpen && (
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_190px]">
            <div className="h-64 rounded-lg border border-neutral-100 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cfg.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#c255d7" strokeWidth={2} dot={false} name="Revenue" />
                  <Line type="monotone" dataKey="spent" stroke="#9ca3af" strokeWidth={2} dot={false} name="Amount Spent" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-neutral-500">Compare creatives</p>
              <div className="max-h-56 space-y-2 overflow-y-auto text-sm text-neutral-700">
                {cfg.trendCreativePick.map((name) => (
                  <label key={name} className="flex cursor-pointer items-center justify-between rounded-md border border-neutral-100 px-2 py-1.5 hover:bg-neutral-50">
                    <span className="inline-flex items-center gap-2">
                      <input type="checkbox" defaultChecked={name === 'Creative 1'} className="rounded border-neutral-300 text-primary-600" />
                      {name}
                    </span>
                    <span className="h-6 w-6 shrink-0 rounded bg-neutral-200" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Tags — revenue (green) + spend (gray) */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">AI Tags</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50"
            >
              See All Tags
            </button>
            <button
              type="button"
              className="rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50"
            >
              See all AI tags (98 more)
            </button>
          </div>
        </div>
        <div className="p-4">
          <table className="w-full text-[13px] text-neutral-700">
            <tbody>
              {cfg.aiTags.map((row) => (
                <tr key={row.name} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2.5 font-medium text-neutral-900">{row.name}</td>
                  <td className="py-2.5">
                    <div className="flex h-2 w-full overflow-hidden rounded bg-neutral-200">
                      <div className="bg-success-500" style={{ width: `${Math.min(100, row.revenuePct)}%` }} />
                      <div className="bg-neutral-300" style={{ width: `${Math.min(100, row.spendPct)}%` }} />
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="font-semibold text-success-600">{row.revenuePct}%</span>
                    <span className="mx-1 text-neutral-300">|</span>
                    <span className="font-medium text-neutral-500">{row.spendPct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AuctionTabPanel() {
  const cfg = TAB_CONFIG.auctionInsights
  const [placementView, setPlacementView] = useState('dashboard')
  const [objectiveView, setObjectiveView] = useState('dashboard')
  const [deliveryView, setDeliveryView] = useState('dashboard')
  const [bidTab, setBidTab] = useState('all')
  const [cboBreakdownTab, setCboBreakdownTab] = useState('cbo')

  const metaH = (t) => (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
      {t} <ChevronDown className="h-3 w-3 text-neutral-400" />
    </span>
  )

  const sortableTh = (children) => (
    <span className="inline-flex items-center gap-1">
      {children}
      <ArrowUpDown className="h-3 w-3 text-neutral-400" />
    </span>
  )

  const SysIcon = ({ kind }) => {
    if (kind === 'monitor') return <Monitor className="h-5 w-5 text-neutral-600" aria-hidden />
    if (kind === 'phone') return <Smartphone className="h-5 w-5 text-neutral-600" aria-hidden />
    if (kind === 'apple') return <span className="text-lg" aria-hidden></span>
    if (kind === 'android')
      return (
        <span className="text-[10px] font-bold tracking-tight text-[#3DDC84]" aria-hidden>
          AND
        </span>
      )
    return null
  }

  const AuctionDonutCard = ({ title, centerSpend, pie, legendRows, view, setView, tableRows, tableFirstColLabel = 'Objective' }) => (
    <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
        <h3 className="text-base font-semibold text-neutral-900">
          {title} <Info className="ml-0.5 inline h-3.5 w-3.5 text-neutral-400" />
        </h3>
      </div>
      <div className="border-b border-neutral-200 px-4">
        <div className="flex gap-6">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'table', label: 'Table View' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${
                view === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {view === 'dashboard' ? (
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            <div className="relative mx-auto h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" cx="50%" cy="50%" innerRadius={58} outerRadius={80} paddingAngle={1}>
                    {pie.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-bold leading-tight text-neutral-900">{centerSpend}</p>
                <p className="text-[11px] font-medium text-neutral-500">Amount Spent</p>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-neutral-700">
                <span>Amount Spent</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
                  ROAS (All) <ChevronDown className="h-3 w-3 text-neutral-400" />
                </span>
              </div>
              {legendRows.map((row) => (
                <div
                  key={row.name}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/80 px-3 py-2 text-xs text-neutral-700"
                >
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: pie[0]?.color }} />
                  <span className="font-semibold text-neutral-900">
                    {row.pct} ({row.spend})
                  </span>
                  <span>{row.name}</span>
                  <span className="font-bold text-neutral-900">{row.roas}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-[13px] text-neutral-700">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2">{sortableTh(tableFirstColLabel)}</th>
                  <th className="pb-2">{metaH('Amount Sp...')}</th>
                  <th className="pb-2">% of spend</th>
                  <th className="pb-2">{metaH('ROAS (All)')}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.name} className="border-b border-neutral-50 last:border-0">
                    <td className="py-2 font-semibold">{r.name}</td>
                    <td className="py-2">{r.spend}</td>
                    <td className="py-2">{r.pct}</td>
                    <td className="py-2">{r.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const pd = cfg.placementDashboard

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50"
        >
          <Filter className="h-4 w-4" />
          Filter Data
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Smart Filter
          </button>
          <button type="button" disabled className="h-10 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-400">
            Save this view
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Placement & Device — Madgicx */}
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Placement &amp; Device</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
              ROAS (All) <ChevronDown className="h-3 w-3 text-neutral-400" />
            </span>
          </div>
          <div className="border-b border-neutral-200 px-4">
            <div className="flex gap-6">
              {[
                { id: 'dashboard', label: 'Dashboard View' },
                { id: 'breakdown', label: 'Breakdown View' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPlacementView(t.id)}
                  className={`border-b-2 pb-2 pt-2 text-xs font-semibold transition-all ${
                    placementView === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {placementView === 'dashboard' ? (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Devices</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pd.devices.map((d) => (
                      <div
                        key={d.key}
                        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 px-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <SysIcon kind={d.icon} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900">{d.label}</p>
                            <p className="text-xs text-neutral-600">{d.spend}</p>
                            <p className="text-[11px] text-neutral-500">{d.spendPct}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[10px] font-medium text-neutral-400">{d.small}</p>
                          <p className="text-2xl font-bold tabular-nums text-neutral-900">{d.roas}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">System</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pd.systems.map((d) => (
                      <div
                        key={d.key}
                        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 px-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <SysIcon kind={d.icon} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900">{d.label}</p>
                            <p className="text-xs text-neutral-600">{d.spend}</p>
                            <p className="text-[11px] text-neutral-500">{d.spendPct}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[10px] font-medium text-neutral-400">{d.small}</p>
                          <p className="text-2xl font-bold tabular-nums text-neutral-900">{d.roas}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-[13px] text-neutral-700">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-neutral-500">
                      <th className="pb-2">Placement</th>
                      <th className="pb-2">{metaH('Amount Sp...')}</th>
                      <th className="pb-2">% of spend</th>
                      <th className="pb-2">{metaH('ROAS (All)')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfg.placementBreakdown.map((r) => (
                      <tr key={r.placement} className="border-b border-neutral-50 last:border-0">
                        <td className="py-2 font-semibold">{r.placement}</td>
                        <td className="py-2">{r.spend}</td>
                        <td className="py-2">{r.spendPct}</td>
                        <td className="py-2">{r.roas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Type & Budget */}
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Campaign Type &amp; Budget</h3>
          </div>
          <div className="space-y-4 p-4">
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">{cfg.campaignBudget.cbo.label}</p>
              <p className="mt-1 text-lg font-bold text-neutral-900">{cfg.campaignBudget.cbo.spend}</p>
              <p className="text-xs text-neutral-500">{cfg.campaignBudget.cbo.spendPct}</p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">{cfg.campaignBudget.abo.label}</p>
              <p className="mt-1 text-lg font-bold text-neutral-900">{cfg.campaignBudget.abo.spend}</p>
              <p className="text-xs text-neutral-500">{cfg.campaignBudget.abo.spendPct}</p>
            </div>
            <div className="border-b border-neutral-200">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCboBreakdownTab('cbo')}
                  className={`border-b-2 pb-2 text-xs font-semibold transition-all ${
                    cboBreakdownTab === 'cbo' ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500'
                  }`}
                >
                  CBO Budget Breakdown
                </button>
              </div>
            </div>
            <div className="space-y-2 text-[13px] text-neutral-700">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[9px] font-bold text-white">f</span>
                Amount
              </div>
              {cfg.campaignBudget.cboTiers.map((tier) => (
                <div key={tier.label} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-100 px-3 py-2">
                  <span className="font-medium text-neutral-800">{tier.label}</span>
                  <span className="text-xs text-neutral-500">
                    {tier.campaigns} Campaigns · {tier.adSets} Ad Sets
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AuctionDonutCard
          title="Campaign Objective"
          centerSpend={cfg.campaignObjective.centerSpend}
          pie={cfg.campaignObjective.pie}
          legendRows={cfg.campaignObjective.legend}
          view={objectiveView}
          setView={setObjectiveView}
          tableRows={cfg.campaignObjective.tableRows}
          tableFirstColLabel="Objective"
        />
        <AuctionDonutCard
          title="Ad Delivery Optimization"
          centerSpend={cfg.adDelivery.centerSpend}
          pie={cfg.adDelivery.pie}
          legendRows={cfg.adDelivery.legend}
          view={deliveryView}
          setView={setDeliveryView}
          tableRows={cfg.adDelivery.tableRows}
          tableFirstColLabel="Optimization"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Learning Phase</h3>
          </div>
          <div className="p-4">
            <div className="mb-3 hidden min-w-[520px] grid-cols-[1fr_5rem_4rem_4rem] gap-2 border-b border-neutral-100 pb-2 text-left text-xs font-semibold text-neutral-500 sm:grid">
              <div>{sortableTh('Status')}</div>
              <div className="text-right">{metaH('Amount Sp...')}</div>
              <div className="text-right">{metaH('ROAS (All)')}</div>
              <div className="text-right">{metaH('Registra...')}</div>
            </div>
            <div className="space-y-2">
              {cfg.learningPhase.map((row) => (
                <div key={row.status} className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-3">
                  <div className="flex shrink-0 items-center justify-center">
                    {row.tone === 'outline' && <Circle className="h-5 w-5 text-success-500" strokeWidth={2} />}
                    {row.tone === 'solid' && <span className="block h-4 w-4 rounded-full bg-success-500" />}
                    {row.tone === 'warn' && <AlertTriangle className="h-5 w-5 text-warning-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900">{row.status}</p>
                    <p className="text-xs text-neutral-500">{row.sub}</p>
                  </div>
                  <div className="flex w-full gap-4 text-sm text-neutral-400 sm:w-auto sm:justify-end">
                    <span className="sm:w-20 sm:text-right">{row.spent}</span>
                    <span className="sm:w-16 sm:text-right">{row.roas}</span>
                    <span className="sm:w-16 sm:text-right">{row.reg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Automatic Bid vs Manual Bid</h3>
          </div>
          <div className="p-4">
            <div className="mb-4 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">{cfg.automaticBid.summary.label}</p>
              <p className="mt-1 text-lg font-bold text-neutral-900">{cfg.automaticBid.summary.spend}</p>
              <p className="text-xs text-neutral-500">{cfg.automaticBid.summary.spendPct}</p>
            </div>
            <div className="border-b border-neutral-200">
              <div className="flex gap-6">
                {[
                  { id: 'all', label: 'All Bids' },
                  { id: 'manual', label: 'Manual Bid' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBidTab(t.id)}
                    className={`border-b-2 pb-2 text-xs font-semibold transition-all ${
                      bidTab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[320px] text-[13px] text-neutral-700">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="pb-2">Bid Type</th>
                    <th className="pb-2">{metaH('Amount Sp...')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(bidTab === 'all' ? cfg.automaticBid.bidRows : []).map((r) => (
                    <tr key={r.type} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2 font-medium">{r.type}</td>
                      <td className="py-2 font-semibold">{r.spent}</td>
                    </tr>
                  ))}
                  {bidTab === 'manual' && (
                    <tr>
                      <td colSpan={2} className="py-6 text-center text-sm text-neutral-500">
                        No manual bid rows in this period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">
              Quality Ranking Rate <Info className="ml-0.5 inline h-3.5 w-3.5 text-neutral-400" />
            </h3>
          </div>
          <div className="overflow-x-auto p-0">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/80 text-left text-xs font-semibold text-neutral-500">
                  <th className="px-4 py-2">{sortableTh('Status')}</th>
                  <th className="px-4 py-2">{metaH('Amount S...')}</th>
                  <th className="px-4 py-2">{metaH('ROAS (All)')}</th>
                  <th className="px-4 py-2">{metaH('Registra...')}</th>
                </tr>
              </thead>
              <tbody>
                {cfg.qualityRanking.map((row, i) => (
                  <tr key={row.status} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-neutral-900">{row.status}</span>
                      <span className="ml-2 text-xs text-neutral-500">{row.ads}</span>
                    </td>
                    <td className="px-4 py-2.5 text-neutral-400">{row.spent}</td>
                    <td className="px-4 py-2.5 text-neutral-400">{row.roas}</td>
                    <td className="px-4 py-2.5 text-neutral-400">{row.reg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-900">Ad Type</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[320px] text-[13px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2">{sortableTh('Type')}</th>
                  <th className="pb-2">{metaH('A...')}</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {cfg.adTypes.map((row) => (
                  <tr key={row.key} className="border-b border-neutral-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {row.key === 'normal' && <LayoutTemplate className="h-4 w-4 text-neutral-500" />}
                        {row.key === 'dco' && <Layers2 className="h-4 w-4 text-neutral-500" />}
                        {row.key === 'mto' && <Type className="h-4 w-4 text-neutral-500" />}
                        {row.key === 'dpa' && <ShoppingBag className="h-4 w-4 text-neutral-500" />}
                        <span className="font-medium">{row.label}</span>
                        {row.info && <Info className="h-3.5 w-3.5 text-neutral-400" />}
                      </div>
                    </td>
                    <td className="py-3 text-neutral-500">{row.ads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hour × Day heatmap */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Performance by hour &amp; day</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[720px]">
            <div className="mb-1 grid gap-0.5" style={{ gridTemplateColumns: '48px repeat(24, minmax(0, 1fr))' }}>
              <div />
              {cfg.heatmapHours.map((h) => (
                <div key={h} className="text-center text-[9px] font-medium text-neutral-400">
                  {h}
                </div>
              ))}
            </div>
            {cfg.heatmapDays.map((day) => (
              <div key={day} className="mb-0.5 grid gap-0.5" style={{ gridTemplateColumns: '48px repeat(24, minmax(0, 1fr))' }}>
                <div className="flex items-center text-xs font-semibold text-neutral-600">{day}</div>
                {cfg.heatmapHours.map((h) => (
                  <div
                    key={`${day}-${h}`}
                    className="h-4 rounded-sm bg-neutral-100"
                    title={`${day} ${h}:00`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequency Breakdown */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">
            Frequency Breakdown <HelpCircle className="ml-0.5 inline h-3.5 w-3.5 text-neutral-400" />
          </h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[640px] border-separate border-spacing-2 text-[13px]">
            <thead>
              <tr>
                <th className="w-48 rounded-lg bg-neutral-100 px-3 py-2 text-left text-xs font-semibold text-neutral-600">
                  Number of times people have seen your ads
                </th>
                {cfg.frequencyColumns.map((c) => (
                  <th key={c.key} className="rounded-lg bg-neutral-100 px-2 py-2 text-center text-xs font-semibold text-neutral-600">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="rounded-lg border border-neutral-100 bg-white px-3 py-2 font-semibold text-neutral-900">Reach</td>
                {cfg.frequencyReach.map((v, i) => (
                  <td key={i} className="rounded-lg border border-neutral-100 bg-white px-2 py-2 text-center font-semibold text-neutral-800">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdCopyTabPanel() {
  const cfg = TAB_CONFIG.adCopyInsights
  const [sortBy, setSortBy] = useState('Revenue (high first)')
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
  const [trendsOpen, setTrendsOpen] = useState(true)
  const [allCopyOpen, setAllCopyOpen] = useState(true)

  const toggleSel = (rank) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank)
      else next.add(rank)
      return next
    })
  }

  const metaMetricBtn = (label, value) => (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-md border border-neutral-100 bg-neutral-50/80 px-2 py-1.5 text-left text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
    >
      <span className="inline-flex items-center gap-1 text-neutral-600">
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[#1877F2] text-[7px] font-bold text-white">f</span>
        {label}
        <ChevronDown className="h-3 w-3 text-neutral-400" aria-hidden />
      </span>
      <span className="font-semibold tabular-nums text-neutral-900">{value}</span>
    </button>
  )

  const sortTh = (label) => (
    <span className="inline-flex items-center gap-1">
      {label}
      <ArrowUpDown className="h-3 w-3 text-neutral-400" aria-hidden />
    </span>
  )

  const copyPointShapeFixed = (props) => {
    const { cx, cy } = props
    return (
      <g>
        <rect x={cx - 5} y={cy - 5} width={10} height={10} rx={2} fill="#7033F5" opacity={0.9} />
        <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" style={{ fontSize: 7, fontWeight: 700 }}>
          Aa
        </text>
      </g>
    )
  }

  const selectedCount = selectedKeys.size

  return (
    <div className="space-y-5">
      {/* Filter + KPI toggles — Madgicx */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50"
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filter Data
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              placeholder="Load filter preset"
              className="h-10 w-[200px] rounded-lg border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-400"
            />
            <button type="button" disabled className="h-10 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-400">
              Save this view
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['CTR', 'CVR', 'ROAS (All)', 'Amount Spent', 'Revenue'].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm hover:border-neutral-400"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Copy length — 3 cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {cfg.lengthCards.map((c) => (
          <div
            key={c.id}
            className="flex min-h-[200px] flex-col rounded-xl border border-[#F0F0F0] bg-white p-3 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]"
          >
            <div className="mb-2 flex items-start gap-2">
              <Type className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" aria-hidden />
              <h4 className="text-base font-semibold text-neutral-900">
                {c.title}{' '}
                <span className="text-xs font-normal text-neutral-400">({c.count})</span>
              </h4>
            </div>
            {c.empty ? (
              <div className="flex flex-1 flex-col justify-center rounded-lg border border-dashed border-warning-200 bg-warning-50/40 px-3 py-4 text-center">
                <p className="text-sm font-semibold text-warning-900">Limited data</p>
                <p className="mt-1 text-[11px] leading-snug text-warning-800/90">{c.hint}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col gap-1.5">
                  {metaMetricBtn('Amount Spent', c.spent)}
                  {metaMetricBtn('Revenue', c.revenue)}
                  {metaMetricBtn('ROAS (All)', c.roas)}
                  {metaMetricBtn('CTR (All)', c.ctr)}
                  {metaMetricBtn('Outbound CTR', c.outboundCtr)}
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="bg-success-500 transition-all"
                      style={{
                        width: `${(c.revenuePct / Math.max(0.01, c.revenuePct + c.spendPct)) * 100}%`
                      }}
                    />
                    <div
                      className="bg-neutral-400 transition-all"
                      style={{
                        width: `${(c.spendPct / Math.max(0.01, c.revenuePct + c.spendPct)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-neutral-600">
                    <span className="text-success-600">{c.revenuePct}% Revenue</span>
                    <span>{c.spendPct}% Spend</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Graded by + spend + Smart Filter + All pieces of copy */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#F0F0F0] bg-white px-4 py-3 shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-neutral-600">Graded by:</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#1877F2] text-[8px] font-bold text-white">f</span>
            Revenue
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
          </button>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <span className="whitespace-nowrap">Min. Spend:</span>
            <input
              type="number"
              defaultValue={cfg.minSpendDefault}
              className="h-9 w-20 rounded-lg border border-neutral-300 px-2 text-xs font-semibold tabular-nums"
            />
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <span className="whitespace-nowrap">Max. Spend:</span>
            <input
              type="number"
              defaultValue={cfg.maxSpendDefault}
              className="h-9 w-20 rounded-lg border border-neutral-300 px-2 text-xs font-semibold tabular-nums"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Smart Filter
          </button>
          <button
            type="button"
            className="rounded-lg border border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50"
          >
            All pieces of copy
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" disabled className="rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-400">
          Open selected in Ads Launcher
        </button>
      </div>

      {/* Assets chart — quadrants */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Assets chart</h3>
          <p className="text-xs text-neutral-500">Revenue vs amount spent — scalable (top left), core performers (top right), getting started (bottom left), overspend (bottom right)</p>
        </div>
        <div className="relative p-4">
          <div className="pointer-events-none absolute left-[18%] top-[22%] z-10 text-[9px] font-bold uppercase leading-tight text-success-600">
            Scalable
          </div>
          <div className="pointer-events-none absolute right-[14%] top-[22%] z-10 text-[9px] font-bold uppercase leading-tight text-teal-600">
            Core performers
          </div>
          <div className="pointer-events-none absolute bottom-[28%] left-[16%] z-10 text-[9px] font-bold uppercase leading-tight text-neutral-500">
            Getting started
          </div>
          <div className="pointer-events-none absolute bottom-[28%] right-[12%] z-10 text-[9px] font-bold uppercase leading-tight text-pink-500">
            Overspend
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis
                  type="number"
                  dataKey="spend"
                  domain={[0, 100]}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(v) => `US$${v}`}
                  name="Amount spent"
                />
                <YAxis
                  type="number"
                  dataKey="revenue"
                  domain={[0, 80]}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(v) => `US$${v}`}
                  name="Revenue"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const p = payload[0]?.payload
                    if (!p) return null
                    return (
                      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold text-neutral-900">{p.label}</p>
                        <p className="mt-1 text-neutral-600">
                          Amount spent: <span className="font-semibold tabular-nums">US${p.spend}</span>
                        </p>
                        <p className="text-neutral-600">
                          Revenue: <span className="font-semibold tabular-nums">US${p.revenue}</span>
                        </p>
                      </div>
                    )
                  }}
                />
                <ReferenceArea x1={0} x2={50} y1={40} y2={80} fill="#dcfce7" fillOpacity={0.55} />
                <ReferenceArea x1={50} x2={100} y1={40} y2={80} fill="#ccfbf1" fillOpacity={0.45} />
                <ReferenceArea x1={0} x2={50} y1={0} y2={40} fill="#f3f4f6" fillOpacity={0.85} />
                <ReferenceArea x1={50} x2={100} y1={0} y2={40} fill="#fce7f3" fillOpacity={0.55} />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 100, y: 80 }
                  ]}
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Scatter name="Copy assets" data={cfg.matrixPoints} shape={copyPointShapeFixed} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Copy assets strip */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-col gap-2 border-b border-[#F5F5F5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-sm font-semibold text-neutral-900">Copy assets ({cfg.copyAssetsTotal})</h5>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800"
              >
                <option>Revenue (high first)</option>
                <option>Revenue (low first)</option>
                <option>Amount spent (high first)</option>
                <option>Amount spent (low first)</option>
                <option>Order of creation</option>
              </select>
            </label>
            <span className="text-xs font-semibold text-neutral-500">{selectedCount} selected</span>
          </div>
        </div>
        <div className="overflow-x-auto p-4 pb-2">
          <div className="flex w-max gap-3">
            {cfg.copyAssets.map((row) => {
              const sel = selectedKeys.has(row.rank)
              return (
                <button
                  key={row.rank}
                  type="button"
                  onClick={() => toggleSel(row.rank)}
                  className={`relative w-[200px] shrink-0 rounded-lg border bg-white p-3 text-left shadow-sm transition-all ${
                    sel ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[11px] font-bold text-white shadow">
                    {row.rank}
                  </span>
                  <p className="line-clamp-3 pr-8 text-[11px] font-medium leading-snug text-neutral-800">{row.preview}</p>
                  <div className="mt-2 flex justify-between text-[11px] font-bold tabular-nums">
                    <span className="text-pink-500">{row.revPct}%</span>
                    <span className="text-teal-600">{row.spendPct}%</span>
                  </div>
                  <p className="mt-1 text-[10px] text-neutral-500">Used in {row.ads}</p>
                  <span className="mt-2 inline-block text-[11px] font-semibold text-primary-600">View breakdown</span>
                  <Search className="absolute bottom-3 right-3 h-3.5 w-3.5 text-neutral-400" aria-hidden />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* All pieces of copy — table */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">All pieces of copy</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllCopyOpen((v) => !v)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              {allCopyOpen ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
        {allCopyOpen && (
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[720px] text-[13px] text-neutral-700">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2 pr-4">{sortTh('Copy snippet')}</th>
                  <th className="pb-2">{sortTh('ROAS (All)')}</th>
                  <th className="pb-2">{sortTh('Amount Spent')}</th>
                  <th className="pb-2">{sortTh('Revenue')}</th>
                  <th className="pb-2">{sortTh('Usage')}</th>
                </tr>
              </thead>
              <tbody>
                {cfg.allCopyTable.map((r) => (
                  <tr key={r.snippet} className="border-b border-neutral-50 last:border-0">
                    <td className="max-w-[280px] py-2.5 font-semibold text-neutral-900">
                      <span className="line-clamp-2">{r.snippet}</span>
                    </td>
                    <td className="py-2.5 font-medium tabular-nums">{r.roas}</td>
                    <td className="py-2.5 tabular-nums">{r.spent}</td>
                    <td className="py-2.5 tabular-nums">{r.revenue}</td>
                    <td className="py-2.5 text-neutral-600">{r.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emoji + Link performance */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex items-center gap-2 border-b border-[#F5F5F5] px-4 py-3">
            <Smile className="h-4 w-4 text-neutral-500" aria-hidden />
            <h3 className="text-base font-semibold text-neutral-900">Emoji performance</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-[13px] text-neutral-700">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2">Emoji</th>
                  <th className="pb-2">Revenue / Spend</th>
                  <th className="pb-2 text-right">Ads</th>
                </tr>
              </thead>
              <tbody>
                {cfg.emojiRows.map((r) => (
                  <tr key={r.label} className="border-b border-neutral-50 last:border-0">
                    <td className="py-2.5">
                      <span className="text-lg" aria-hidden>
                        {r.emoji}
                      </span>{' '}
                      <span className="font-semibold text-neutral-900">{r.label}</span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex h-2 max-w-[200px] overflow-hidden rounded bg-neutral-200">
                        <div className="bg-success-500" style={{ width: `${Math.min(100, r.revenuePct)}%` }} />
                        <div className="bg-neutral-400" style={{ width: `${Math.min(100, r.spendPct)}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {r.revenuePct}% rev · {r.spendPct}% spend
                      </p>
                    </td>
                    <td className="py-2.5 text-right font-medium">{r.ads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
          <div className="flex items-center gap-2 border-b border-[#F5F5F5] px-4 py-3">
            <Link2 className="h-4 w-4 text-neutral-500" aria-hidden />
            <h3 className="text-base font-semibold text-neutral-900">Link performance</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-[13px] text-neutral-700">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-neutral-500">
                  <th className="pb-2">Primary text</th>
                  <th className="pb-2">Share</th>
                  <th className="pb-2 text-right">Note</th>
                </tr>
              </thead>
              <tbody>
                {cfg.linkRows.map((r) => (
                  <tr key={r.label} className="border-b border-neutral-50 last:border-0">
                    <td className="py-2.5 font-semibold text-neutral-900">{r.label}</td>
                    <td className="py-2.5">
                      <div className="flex h-2 max-w-[220px] overflow-hidden rounded bg-neutral-200">
                        <div className="bg-primary-500/80" style={{ width: `${Math.min(100, r.revenuePct)}%` }} />
                        <div className="bg-neutral-400" style={{ width: `${Math.min(100, r.spendPct)}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {r.revenuePct}% rev · {r.spendPct}% spend
                      </p>
                    </td>
                    <td className="py-2.5 text-right text-neutral-500">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top phrases */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Top phrases</h3>
          <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
            See All Tags
          </button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[560px] text-[13px] text-neutral-700">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-neutral-500">
                <th className="pb-2">{sortTh('Phrase')}</th>
                <th className="pb-2">{sortTh('ROAS (All)')}</th>
                <th className="pb-2">Revenue / Spend mix</th>
              </tr>
            </thead>
            <tbody>
              {cfg.topPhrases.map((r) => (
                <tr key={r.phrase} className="border-b border-neutral-50 last:border-0">
                  <td className="py-2.5 font-semibold text-neutral-900">&ldquo;{r.phrase}&rdquo;</td>
                  <td className="py-2.5 font-medium tabular-nums">{r.roas}</td>
                  <td className="py-2.5">
                    <div className="flex h-2 max-w-[240px] overflow-hidden rounded bg-neutral-200">
                      <div className="bg-success-500" style={{ width: `${Math.min(100, r.revenuePct)}%` }} />
                      <div className="bg-neutral-400" style={{ width: `${Math.min(100, r.spendPct)}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {r.revenuePct}% revenue · {r.spendPct}% spend
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy performance trends */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">Ad copy performance trends</h3>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={trendsOpen}
              onChange={() => setTrendsOpen((v) => !v)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
        {trendsOpen && (
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_190px]">
            <div className="h-64 rounded-lg border border-neutral-100 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cfg.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#c255d7" strokeWidth={2} dot={false} name="Revenue" />
                  <Line type="monotone" dataKey="spent" stroke="#9ca3af" strokeWidth={2} dot={false} name="Amount Spent" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-neutral-500">Compare copy assets</p>
              <div className="max-h-56 space-y-2 overflow-y-auto text-sm text-neutral-700">
                {cfg.trendPick.map((name) => (
                  <label key={name} className="flex cursor-pointer items-center justify-between rounded-md border border-neutral-100 px-2 py-1.5 hover:bg-neutral-50">
                    <span className="inline-flex items-center gap-2">
                      <input type="checkbox" defaultChecked={name === 'Copy asset 1'} className="rounded border-neutral-300 text-primary-600" />
                      {name}
                    </span>
                    <span className="h-6 w-6 shrink-0 rounded bg-neutral-200" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Tags — language */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">AI Tags</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50">
              See All Tags
            </button>
            <button type="button" className="rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50">
              See all AI tags (64 more)
            </button>
          </div>
        </div>
        <div className="p-4">
          <table className="w-full text-[13px] text-neutral-700">
            <tbody>
              {cfg.aiTags.map((row) => (
                <tr key={row.name} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2.5 font-medium text-neutral-900">{row.name}</td>
                  <td className="py-2.5">
                    <div className="flex h-2 w-full overflow-hidden rounded bg-neutral-200">
                      <div className="bg-success-500" style={{ width: `${Math.min(100, row.revenuePct)}%` }} />
                      <div className="bg-neutral-300" style={{ width: `${Math.min(100, row.spendPct)}%` }} />
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="font-semibold text-success-600">{row.revenuePct}%</span>
                    <span className="mx-1 text-neutral-300">|</span>
                    <span className="font-medium text-neutral-500">{row.spendPct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA breakdown — retained from original mock */}
      <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
        <div className="border-b border-[#F5F5F5] px-4 py-3">
          <h3 className="text-base font-semibold text-neutral-900">CTA breakdown</h3>
          <p className="text-xs text-neutral-500">Performance by call-to-action text</p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[480px] text-[13px] text-neutral-700">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-neutral-500">
                <th className="pb-2">{sortTh('CTA')}</th>
                <th className="pb-2">{sortTh('Spend')}</th>
                <th className="pb-2">{sortTh('CTR')}</th>
                <th className="pb-2">{sortTh('CVR')}</th>
              </tr>
            </thead>
            <tbody>
              {cfg.secondaryTable.slice(1).map((r) => (
                <tr key={r[0]} className="border-b border-neutral-50 last:border-0">
                  <td className="py-2 font-semibold">{r[0]}</td>
                  <td className="py-2">{r[1]}</td>
                  <td className="py-2">{r[2]}</td>
                  <td className="py-2">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const Audit360 = () => {
  const [activeTab, setActiveTab] = useState('metaDashboard')
  const [rangeId, setRangeId] = useState('last30')
  const [showRangeMenu, setShowRangeMenu] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showReportingModal, setShowReportingModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState('')
  const [email, setEmail] = useState('')
  const [sendTestDone, setSendTestDone] = useState(false)
  const [metaMetricA, setMetaMetricA] = useState('ROAS (All)')
  const [metaMetricB, setMetaMetricB] = useState('Amount Spent')
  const [drillTab, setDrillTab] = useState('acquisition')
  const rangeWrapRef = useRef(null)

  const rangeLabel = useMemo(() => RANGE_OPTIONS.find((r) => r.id === rangeId)?.label ?? 'Last 30 days', [rangeId])

  const dateRangeText = useMemo(() => {
    const end = new Date()
    const start = new Date(end)
    if (rangeId === 'last30') start.setDate(end.getDate() - 29)
    else if (rangeId === 'last14') start.setDate(end.getDate() - 13)
    else if (rangeId === 'last7') start.setDate(end.getDate() - 6)
    else start.setDate(end.getDate() - 2)
    const fmt = (d) =>
      `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
    return `${fmt(start)} - ${fmt(end)}`
  }, [rangeId])

  useEffect(() => {
    const onDoc = (e) => {
      if (rangeWrapRef.current && !rangeWrapRef.current.contains(e.target)) setShowRangeMenu(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const pushToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 2000)
  }

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    pushToast('Refreshing…')
    setTimeout(() => {
      setRefreshing(false)
      pushToast('Updated')
    }, 900)
  }

  const handleExport = () => {
    if (exporting) return
    setExporting(true)
    pushToast('Preparing PDF…')
    setTimeout(() => {
      setExporting(false)
      pushToast('Export queued')
    }, 1200)
  }

  const tabLabel = MAIN_TABS.find((t) => t.id === activeTab)?.label ?? ''
  return (
    <div className="relative min-h-full rounded-2xl bg-[#F7F8FA] p-6">
      {toast && (
        <div className="fixed top-20 right-8 z-50 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">360° Meta Audit</h1>
              <button
                type="button"
                onClick={() => pushToast('Context help')}
                className="rounded-lg p-1 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                aria-label="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">Funnel &amp; delivery audit</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-primary-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-primary-500' : ''}`} />
          </button>

          <div className="relative" ref={rangeWrapRef}>
            <button
              type="button"
              onClick={() => setShowRangeMenu((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary-500 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="hidden sm:inline">
                {rangeLabel} {dateRangeText}
              </span>
              <span className="sm:hidden">{rangeLabel}</span>
              <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${showRangeMenu ? 'rotate-180' : ''}`} />
            </button>
            {showRangeMenu && (
              <div className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRangeId(opt.id)
                      setShowRangeMenu(false)
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      rangeId === opt.id ? 'bg-primary-50 font-medium text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex flex-wrap gap-x-1 gap-y-1 overflow-x-auto pb-px" aria-label="Audit sections">
          {MAIN_TABS.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 ${
                  active
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'metaDashboard' && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <Filter className="h-4 w-4" />
            Filter Data
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={exporting}
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={() => setShowReportingModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Automated Reporting
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {activeTab === 'metaDashboard' && (
          <>
            <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/80">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500" />
                      {FUNNEL_COLUMNS.map((col) => (
                        <th key={col.key} className="px-3 py-3 text-right text-xs font-semibold text-neutral-700">
                          <MetaColHeader label={col.label} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FUNNEL_ROWS.map((row) => (
                      <tr key={row.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {row.bar ? (
                              <span className={`h-8 w-1 shrink-0 rounded-full ${barClass[row.bar]}`} aria-hidden />
                            ) : (
                              <span className="h-8 w-1 shrink-0 rounded-full bg-neutral-200" aria-hidden />
                            )}
                            <span className="font-medium text-neutral-900">{row.label}</span>
                          </div>
                        </td>
                        {FUNNEL_COLUMNS.map((col) => (
                          <td key={col.key} className="px-3 py-3 text-right tabular-nums text-neutral-800">
                            {row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
              <div className="flex flex-col gap-3 border-b border-[#F5F5F5] bg-neutral-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-neutral-900">Strategy Status Overview</h3>
                  <button
                    type="button"
                    onClick={() => pushToast('Dashboard guide')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-md px-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    How to use this dashboard
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={metaMetricA}
                    onChange={(e) => setMetaMetricA(e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {META_METRICS.map((metric) => (
                      <option key={metric}>{metric}</option>
                    ))}
                  </select>
                  <select
                    value={metaMetricB}
                    onChange={(e) => setMetaMetricB(e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {META_METRICS.map((metric) => (
                      <option key={metric}>{metric}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                {STRATEGY_DRILL_TABS.map((stage) => (
                  <div key={stage.id} className="rounded-lg border border-neutral-100 bg-white p-3">
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={STRATEGY_DRILL_DATA[stage.id]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                          <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                          <YAxis yAxisId="left" tick={{ fill: '#6B7280', fontSize: 10 }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#9CA3AF" strokeWidth={1.5} dot={false} fill="#e5e7eb" />
                          <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#9CA3AF" strokeWidth={1} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-2 text-center text-sm font-semibold text-neutral-800">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F5] bg-neutral-50/50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-neutral-900">Strategy Status Drilldown</h3>
                  <button
                    type="button"
                    onClick={() => pushToast('What is the Marketing Funnel?')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 transition-all hover:text-primary-700"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    What is the Marketing Funnel?
                  </button>
                </div>
                <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
                  {STRATEGY_DRILL_TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDrillTab(t.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                        drillTab === t.id ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[1fr_180px]">
                <div className="h-72 rounded-lg border border-neutral-100 bg-white p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={STRATEGY_DRILL_DATA[drillTab]}>
                      <defs>
                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="gradSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                      <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <Tooltip />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2} fill="url(#gradRevenue)" />
                      <Area yAxisId="left" type="monotone" dataKey="spent" stroke="#60a5fa" strokeWidth={2} fill="url(#gradSpent)" />
                      <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#f4a6b7" strokeWidth={1.5} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="cpm" stroke="#6a5af9" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {STRATEGY_DRILL_SERIES.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-[-2px_2px_16px_rgba(14,0,45,0.06)]">
              <div className="flex items-center justify-between border-b border-[#F5F5F5] bg-neutral-50/50 px-5 py-4">
                <span className="inline-flex rounded-md bg-orange-100 px-2 py-1 text-sm font-semibold text-orange-700">Total Revenue</span>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-teal-500" />
                    Acquisition
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-info-500" />
                    Retargeting
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-primary-500" />
                    Retention
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-[#f08c7c]" />
                    Amount Spent
                  </span>
                </div>
              </div>
              <div className="h-72 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TOTAL_REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="acquisition" stroke="#14b8a6" strokeWidth={1.8} dot={false} />
                    <Line type="monotone" dataKey="retargeting" stroke="#3b82f6" strokeWidth={1.8} dot={false} />
                    <Line type="monotone" dataKey="retention" stroke="#6366f1" strokeWidth={1.8} dot={false} />
                    <Line type="monotone" dataKey="amountSpent" stroke="#f08c7c" strokeWidth={2} strokeDasharray="8 6" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'targetingInsights' && <TargetingTabPanel />}
        {activeTab === 'auctionInsights' && <AuctionTabPanel />}
        {activeTab === 'geoDemoInsights' && <GeoDemoTabPanel />}
        {activeTab === 'creativeInsights' && <CreativeTabPanel />}
        {activeTab === 'adCopyInsights' && <AdCopyTabPanel />}
      </div>

      <p className="sr-only" aria-live="polite">
        {tabLabel}
      </p>

      <button
        type="button"
        onClick={() => pushToast('Messages')}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-label="Messages"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h4 className="text-base font-semibold text-neutral-900">Filter Data</h4>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="rounded-md p-1 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500">Ad account</span>
                <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>All connected</option>
                  <option>Primary account</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500">Campaign status</span>
                <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>Active</option>
                  <option>All</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500">Funnel stage</span>
                <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>All stages</option>
                  <option>Acquisition</option>
                  <option>Retargeting</option>
                  <option>Retention</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary-500 hover:bg-neutral-50 hover:text-primary-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFilterModal(false)
                  pushToast('Filters applied')
                }}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h4 className="text-base font-semibold text-neutral-900">Automated Reporting</h4>
              <button
                type="button"
                onClick={() => setShowReportingModal(false)}
                className="rounded-md p-1 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500">Send at (hour)</span>
                <input
                  defaultValue="09"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500">Frequency</span>
                <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold text-neutral-500">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 px-5 py-4">
              <button
                type="button"
                disabled={!email.trim()}
                onClick={() => {
                  setSendTestDone(true)
                  setTimeout(() => setSendTestDone(false), 1600)
                }}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary-500 hover:bg-neutral-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send a test email
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportingModal(false)}
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary-500 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportingModal(false)
                    pushToast('Schedule saved')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
                >
                  <Check className="h-4 w-4" />
                  Schedule
                </button>
              </div>
            </div>
            {sendTestDone && (
              <div className="border-t border-neutral-100 px-5 pb-4 text-xs text-success-700">Test email sent.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Audit360
