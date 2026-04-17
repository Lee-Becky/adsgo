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
  AreaChart,
  Area,
} from 'recharts';
import {
  AUDIENCE_INSIGHTS,
  PAGE_INSIGHTS,
  TOP_ADS,
  SCATTER_DATA,
} from '../../constants/adInsightsData';
import { Icon, SvgIcons } from '../AdInsightsIcons';
import { Calendar, ChevronLeft, ChevronRight, BarChart3, Check } from 'lucide-react';

// --- Sub Components ---

const SectionTitle = ({ children }) => (
  <div className="text-gray-900 text-xl font-bold mb-4 pl-4 relative before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full before:bg-gradient-to-b before:from-[#c3a2fe] before:via-[#7135f4] before:to-[#0d031f] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2">
    {children}
  </div>
);

const InsightBlock = ({ title, data, renderListItem, chartColors }) => (
  <div className="min-w-0">
    <SectionTitle>{title}</SectionTitle>
    <div className="flex flex-col p-2 gap-2 bg-[#fafafa] border border-[#f5f5f5] rounded-2xl">
      <div className="flex flex-col p-3 px-4 gap-3 bg-white rounded-xl">
        <div className="text-[#141414] text-base font-semibold">Spend Distribution</div>
        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col p-3 px-4 gap-4 bg-white rounded-xl">
        <div className="text-[#141414] text-base font-semibold">
          {title.includes('Audience') ? 'Top Audiences' : 'Top Pages'}
        </div>
        <div className="flex flex-col gap-5">
          {data.map((item, i) => renderListItem(item, i))}
        </div>
      </div>
    </div>
  </div>
);

const AudienceListItem = ({ item, i }) => (
  <div key={i} className="flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0">
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
);

const PageListItem = ({ item, i }) => (
  <div key={i} className="flex flex-col gap-2 pb-5 border-b border-dashed border-[#d9d9d9] last:border-none last:pb-0">
    <div className="text-[#141414] text-sm font-medium truncate">{item.url}</div>
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-[#7033f5] font-medium">{item.cvr} CVR</span>
      <span className="text-[#8c8c8c]">${item.spend} spend</span>
    </div>
  </div>
);

const CreativeAdCard = ({ ad }) => (
  <div className="flex-1 min-w-[320px] max-w-[360px] relative first:before:hidden before:content-[''] before:block before:w-px before:h-[90%] before:border-l before:border-dashed before:border-[#d9d9d9] before:absolute before:top-1/2 before:left-[-24px] before:-translate-y-1/2">
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
);

// --- Main Component ---

const Analysis360 = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('Meta');
  const [dataPeriod, setDataPeriod] = useState('Last 7 days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('分析');
  const [selectedMetrics, setSelectedMetrics] = useState(['spend', 'roas']);

  // Initialize with Last 7 days
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const last7 = new Date(today);
    last7.setDate(last7.getDate() - 6);
    setCustomStartDate(last7.toISOString().split('T')[0]);
    setCustomEndDate(todayStr);
  }, []);

  const periodOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Last 3 days', value: 'Last 3 days' },
    { label: 'Last 7 days', value: 'Last 7 days' },
    { label: 'Last 14 days', value: 'Last 14 days' },
    { label: 'Last 30 days', value: 'Last 30 days' },
  ];

  const getPeriodDates = (period) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    switch (period) {
      case 'Today': return { start: todayStr, end: todayStr };
      case 'Last 3 days': { const d = new Date(today); d.setDate(d.getDate() - 2); return { start: d.toISOString().split('T')[0], end: todayStr }; }
      case 'Last 7 days': { const d = new Date(today); d.setDate(d.getDate() - 6); return { start: d.toISOString().split('T')[0], end: todayStr }; }
      case 'Last 14 days': { const d = new Date(today); d.setDate(d.getDate() - 13); return { start: d.toISOString().split('T')[0], end: todayStr }; }
      case 'Last 30 days': { const d = new Date(today); d.setDate(d.getDate() - 29); return { start: d.toISOString().split('T')[0], end: todayStr }; }
      default: return { start: '', end: '' };
    }
  };

  const handlePeriodClick = (period) => {
    setDataPeriod(period);
    const dates = getPeriodDates(period);
    setCustomStartDate(dates.start);
    setCustomEndDate(dates.end);
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="p-1" />);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isStart = dateStr === customStartDate;
      const isEnd = dateStr === customEndDate;
      const isInRange = customStartDate && customEndDate && dateStr > customStartDate && dateStr < customEndDate;
      days.push(
        <button
          key={day}
          onClick={() => {
            if (!customStartDate) { setCustomStartDate(dateStr); setDataPeriod('Custom'); }
            else if (!customEndDate && dateStr >= customStartDate) { setCustomEndDate(dateStr); setDataPeriod('Custom'); }
            else { setCustomStartDate(dateStr); setCustomEndDate(''); setDataPeriod('Custom'); }
          }}
          className="relative p-1 text-sm rounded hover:bg-primary/10 transition-colors"
        >
          {day}
          {isStart && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">S</span>}
          {isEnd && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">E</span>}
          {(isStart || isEnd) && <div className="absolute inset-0 bg-primary/20 rounded" />}
          {isInRange && <div className="absolute inset-0 bg-primary/5 rounded" />}
        </button>
      );
    }
    return days;
  };

  const getPlatformLogo = (platform) => {
    switch (platform) {
      case 'Google':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      case 'Meta':
        return <img src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=20" alt="Meta" width="20" height="20" className="inline-block" />;
      case 'TikTok':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000"/>
          </svg>
        );
      case 'Bing':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#00809D"/>
            <path d="M12 7v10M9 12h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return <span className="text-xs text-gray-600">{platform}</span>;
    }
  };

  // --- Ad Performance logic ---
  const metrics = [
    { key: 'spend',     label: 'Spend',      value: '$1,310', color: '#7033F5' },
    { key: 'cpm',       label: 'CPM',        value: '$8.50',  color: '#D946EF' },
    { key: 'ctr',       label: 'CTR',        value: '2.1%',   color: '#10B981' },
    { key: 'cost_conv', label: 'Cost/conv.', value: '$4.20',  color: '#F59E0B' },
    { key: 'roas',      label: 'ROAS',       value: '4.2',    color: '#3B82F6' },
  ];

  const handleMetricToggle = (key) => {
    setSelectedMetrics(prev => {
      if (prev.includes(key)) return prev.length === 1 ? prev : prev.filter(k => k !== key);
      return prev.length >= 5 ? prev : [...prev, key];
    });
  };

  const generateChartData = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: Math.floor(150 + Math.random() * 100),
        cpm: parseFloat((7 + Math.random() * 3).toFixed(2)),
        ctr: parseFloat((1.5 + Math.random() * 1.5).toFixed(1)),
        cost_conv: parseFloat((3 + Math.random() * 3).toFixed(2)),
        roas: parseFloat((3 + Math.random() * 3).toFixed(1)),
      };
    });
  };

  const [chartData] = useState(generateChartData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[140px]">
        <p className="text-xs font-semibold text-gray-500 mb-2 pb-2 border-b border-gray-100">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-gray-600">{entry.name}:</span>
              <span className="text-xs font-bold text-gray-900 ml-auto">
                {entry.name === 'Spend' || entry.name === 'CPM' || entry.name === 'Cost/conv.'
                  ? `$${entry.value}`
                  : entry.name === 'CTR' ? `${entry.value}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Daily Performance data ---
  const generateDailyPerformanceData = () => {
    const startDate = customStartDate ? new Date(customStartDate) : new Date();
    const endDate = customEndDate ? new Date(customEndDate) : new Date();
    const data = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const impressions = Math.floor(30000 + Math.random() * 40000);
      const clicks = Math.floor(impressions * (0.015 + Math.random() * 0.02));
      const spend = Math.floor(100 + Math.random() * 400);
      const cpm = (spend / impressions) * 1000;
      const cpc = spend / clicks;
      const ctr = (clicks / impressions) * 100;
      const event1s = Math.floor(clicks * (0.03 + Math.random() * 0.05));
      const event2s = Math.floor(clicks * (0.02 + Math.random() * 0.04));
      const event3s = Math.floor(clicks * (0.01 + Math.random() * 0.03));
      const purchaseValue = Math.floor(event3s * (15 + Math.random() * 10));
      data.push({
        date: cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dailyBudget: 200,
        spend: spend.toFixed(2),
        impressions,
        cpm: cpm.toFixed(2),
        clicks,
        cpc: cpc.toFixed(2),
        ctr: ctr.toFixed(2),
        event1s,
        cpaEvent1s: event1s > 0 ? (spend / event1s).toFixed(2) : '0.00',
        cvrEvent1s: clicks > 0 ? ((event1s / clicks) * 100).toFixed(2) : '0.00',
        event2s,
        cpaEvent2s: event2s > 0 ? (spend / event2s).toFixed(2) : '0.00',
        cvrEvent2s: clicks > 0 ? ((event2s / clicks) * 100).toFixed(2) : '0.00',
        event3s,
        cpaEvent3s: event3s > 0 ? (spend / event3s).toFixed(2) : '0.00',
        cvrEvent3s: clicks > 0 ? ((event3s / clicks) * 100).toFixed(2) : '0.00',
        purchaseValue,
        roas: spend > 0 ? (purchaseValue / spend).toFixed(2) : '0.00',
      });
      cur.setDate(cur.getDate() + 1);
    }
    return data.reverse();
  };

  const dailyData = generateDailyPerformanceData();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 font-sans">
      <SvgIcons />

      <div className="flex-1 flex flex-col gap-4">

        {/* ── Platform / Date Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 transition-all">
          <div className="flex items-center justify-between gap-4">
            {/* Platform Selector */}
            <div className="bg-gray-50 p-1 rounded-[20px] flex gap-1 w-fit border border-gray-100/50">
              {['Meta', 'Google', 'TikTok', 'Bing'].map(p => (
                <div key={p} className="relative group">
                  <button
                    onClick={() => p === 'Meta' && setSelectedPlatform(p)}
                    className={`
                      relative px-7 py-2 rounded-[16px] text-sm font-black transition-all duration-300 flex items-center gap-3
                      ${selectedPlatform === p
                        ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-gray-900 scale-[1.02] translate-y-[-1px]'
                        : 'text-gray-400 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-white/60 hover:translate-y-[-1px]'
                      }
                      ${p !== 'Meta' ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    {getPlatformLogo(p)}
                    <span className="tracking-tight">{p}</span>
                    {selectedPlatform === p && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                    )}
                  </button>
                  {p !== 'Meta' && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-10 shadow-xl pointer-events-none">
                      Coming soon
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Date Period Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 min-w-[220px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-gray-400" />
                  <span>{customStartDate && customEndDate ? `${formatDate(customStartDate)} – ${formatDate(customEndDate)}` : dataPeriod}</span>
                </div>
              </button>

              {showCalendar && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-20 w-96">
                  <div className="flex gap-4">
                    <div className="w-1/3 flex flex-col gap-1.5">
                      {periodOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handlePeriodClick(opt.value)}
                          className={`px-3 py-2 text-xs rounded-lg text-left transition-colors font-semibold ${
                            dataPeriod === opt.value ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={16} /></button>
                        <span className="font-semibold text-sm">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1 font-medium">
                        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button onClick={() => setShowCalendar(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={() => setShowCalendar(false)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Ad Performance Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BarChart3 className="text-primary" size={22} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Ad Performance</h2>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {metrics.map(metric => {
              const isSelected = selectedMetrics.includes(metric.key);
              return (
                <button
                  key={metric.key}
                  onClick={() => handleMetricToggle(metric.key)}
                  className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden text-left ${
                    isSelected ? 'shadow-lg' : 'border-border bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={isSelected ? {
                    borderColor: metric.color,
                    backgroundColor: `${metric.color}0d`,
                    boxShadow: `0 4px 16px ${metric.color}25`,
                  } : {}}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isSelected ? 'text-gray-700' : 'text-gray-400'}`}>
                      {metric.label}
                    </p>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: metric.color }} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 leading-tight">{metric.value}</p>
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: metric.color }}
                    >
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-5 h-[290px] min-h-[290px] min-w-0">
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  {selectedMetrics.map(key => {
                    const m = metrics.find(x => x.key === key);
                    return (
                      <linearGradient key={key} id={`g360-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity="0.18" />
                        <stop offset="95%" stopColor={m.color} stopOpacity="0" />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                {selectedMetrics.length <= 2 && selectedMetrics.map((key, idx) => (
                  <YAxis
                    key={key} yAxisId={key}
                    orientation={idx % 2 === 0 ? 'left' : 'right'}
                    tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => key === 'spend' || key === 'cpm' || key === 'cost_conv' ? `$${v}` : key === 'ctr' ? `${v}%` : v}
                  />
                ))}
                <RechartsTooltip content={<CustomTooltip />} />
                {selectedMetrics.map(key => {
                  const m = metrics.find(x => x.key === key);
                  return (
                    <Area
                      key={key} type="monotone" dataKey={key}
                      stroke={m.color} strokeWidth={2.5}
                      fillOpacity={1} fill={`url(#g360-${key})`}
                      yAxisId={key} name={m.label}
                      dot={false} activeDot={{ r: 5, stroke: 'white', strokeWidth: 2 }}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-3 justify-center">
              {selectedMetrics.map(key => {
                const m = metrics.find(x => x.key === key);
                return (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-xs font-semibold text-gray-500">{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tab Section ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">

          {/* Tab Header */}
          <div className="border-b border-gray-100 px-6 pt-1 flex">
            {['分析', '日报'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-4 text-sm font-bold transition-all mr-1 ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#7033f5] to-[#c3a2fe] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">

            {/* ── 分析 Tab ── */}
            {activeTab === '分析' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4 px-2">
                  <InsightBlock
                    title="Audience Insight"
                    data={AUDIENCE_INSIGHTS}
                    renderListItem={(item, i) => <AudienceListItem key={i} item={item} i={i} />}
                    chartColors={['#7033f5', '#c3a2fe', '#ead9ff']}
                  />
                  <InsightBlock
                    title="Page Insight"
                    data={PAGE_INSIGHTS}
                    renderListItem={(item, i) => <PageListItem key={i} item={item} i={i} />}
                    chartColors={['#7033f5', '#c3a2fe']}
                  />
                </div>

                <div className="py-4 px-2">
                  <SectionTitle>Creative Insight</SectionTitle>
                  <div className="flex flex-col p-2 gap-2 bg-gray-50 border border-border rounded-2xl">
                    <div className="w-full bg-white p-4 rounded-xl">
                      <div className="text-gray-900 text-base font-bold mb-3">Creative Performance</div>
                      <div className="w-full h-[280px] md:h-[320px]">
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
                      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                        {TOP_ADS.map(ad => (
                          <CreativeAdCard key={ad.id} ad={ad} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── 日报 Tab ── */}
            {activeTab === '日报' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-5">Daily Performance</h2>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">Daily Budget</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">Spend</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">Impressions</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">CPM</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 sticky top-0 bg-gray-50 whitespace-nowrap">Clicks</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">CPC <span className="font-normal text-gray-400 text-[10px]">(CTR)</span></th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">Event1s</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">CPA-E1 <span className="font-normal text-gray-400 text-[10px]">(CVR)</span></th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">Event2s</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">CPA-E2 <span className="font-normal text-gray-400 text-[10px]">(CVR)</span></th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">Event3s</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">CPA-E3 <span className="font-normal text-gray-400 text-[10px]">(CVR)</span></th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-500 sticky top-0 bg-gray-50 whitespace-nowrap">Purchase <span className="font-normal text-gray-400 text-[10px]">(ROAS)</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyData.map((row, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.date}</td>
                          <td className="py-3 px-4 text-gray-700">${row.dailyBudget}</td>
                          <td className="py-3 px-4 text-gray-700">${row.spend}</td>
                          <td className="py-3 px-4 text-gray-700">{row.impressions.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">${row.cpm}</td>
                          <td className="py-3 px-4 text-gray-700">{row.clicks.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">${row.cpc}<br /><span className="text-gray-400 text-xs">{row.ctr}%</span></td>
                          <td className="py-3 px-4 text-gray-700">{row.event1s}</td>
                          <td className="py-3 px-4 text-gray-700">${row.cpaEvent1s}<br /><span className="text-gray-400 text-xs">{row.cvrEvent1s}%</span></td>
                          <td className="py-3 px-4 text-gray-700">{row.event2s}</td>
                          <td className="py-3 px-4 text-gray-700">${row.cpaEvent2s}<br /><span className="text-gray-400 text-xs">{row.cvrEvent2s}%</span></td>
                          <td className="py-3 px-4 text-gray-700">{row.event3s}</td>
                          <td className="py-3 px-4 text-gray-700">${row.cpaEvent3s}<br /><span className="text-gray-400 text-xs">{row.cvrEvent3s}%</span></td>
                          <td className="py-3 px-4 text-gray-700">${row.purchaseValue}<br /><span className="text-gray-400 text-xs">{row.roas}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ad-social {
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #F3F4F6;
          color: #6B7280;
          overflow: hidden;
        }
        .social-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default Analysis360;
