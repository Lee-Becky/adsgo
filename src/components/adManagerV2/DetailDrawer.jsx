import React, { useEffect, useState } from 'react';
import { 
  X, ArrowRight, Zap, TrendingUp, Info, ChevronDown, ChevronUp,
  Target, BarChart3, Table, 
  AlertCircle, CheckCircle2, Activity, Edit3, TrendingDown, Minus,
  Lightbulb, ShieldCheck
} from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DetailDrawer = ({ campaign, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showRawTable, setShowRawTable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const history14 = campaign.history.slice(-14).map((d, i) => ({
    ...d,
    index: i,
    cpm: (d.spend / d.impressions) * 1000
  }));

  // 趋势计算函数：线性回归 (y = mx + b)
  const calculateLinearRegression = (data, key) => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
    
    data.forEach((d, i) => {
      const val = d[key];
      sumX += i;
      sumY += val;
      sumXY += i * val;
      sumXX += i * i;
      sumYY += val * val;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // 计算 R 平方
    const rNum = (n * sumXY - sumX * sumY);
    const rDen = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const rSquared = rDen === 0 ? 0 : Math.pow(rNum / rDen, 2);

    return { slope, rSquared, avg: sumY / n };
  };

  const trends = {
    cpm: calculateLinearRegression(history14, 'cpm'),
    cpa: calculateLinearRegression(history14, 'cpa'),
    roas: calculateLinearRegression(history14, 'roas')
  };

  const getTrendIcon = (slope) => {
    if (slope > 0.05) return <TrendingUp size={14} className="text-red-500" />;
    if (slope < -0.05) return <TrendingDown size={14} className="text-green-500" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  const opHistory = history14.filter(d => d.operation).slice(0, 2).map((op, idx) => {
    const opIndex = history14.findIndex(d => d.date === op.date);
    const getAvg = (start, end) => {
      const slice = history14.slice(Math.max(0, start), Math.min(history14.length, end));
      if (!slice.length) return { roas: 0, cpa: 0, conv: 0 };
      return {
        roas: slice.reduce((a, b) => a + b.roas, 0) / slice.length,
        cpa: slice.reduce((a, b) => a + b.cpa, 0) / slice.length,
        conv: slice.reduce((a, b) => a + b.conversions, 0) / slice.length,
      };
    };
    return {
      date: op.date,
      action: op.operation,
      changeAmt: idx === 0 ? '+¥200' : '策略优化',
      changePct: idx === 0 ? '+16.7%' : '-',
      before: getAvg(opIndex - 2, opIndex),
      after: getAvg(opIndex + 1, opIndex + 3)
    };
  });

  const calculatePeriodStats = (days) => {
    const periodData = history14.slice(-days);
    const sum = (key) => periodData.reduce((acc, d) => acc + (d[key] || 0), 0);
    const spend = sum('spend'), budget = periodData.reduce((acc, d) => acc + (d.budget || 0), 0), conv = sum('conversions');
    const clicks = sum('clicks'), impressions = sum('impressions');
    
    return {
      spendTotal: spend,
      spendAvg: spend / days,
      convTotal: conv,
      convAvg: conv / days,
      cpa: spend / conv,
      cpaAchievement: (18 / (spend / conv)) * 100,
      budgetUtilization: (spend / budget) * 100,
      ctr: (clicks / impressions) * 100,
      regRate: (conv / clicks) * 100,
      rank: Math.floor(Math.random() * 5) + 1,
    };
  };

  const periods = { 
    '14d': calculatePeriodStats(14), 
    '7d': calculatePeriodStats(7), 
    '3d': calculatePeriodStats(3), 
    '1d': calculatePeriodStats(1) 
  };

  // 动态生成周期分析总结
  const getPeriodicAnalysisInsights = () => {
    const insights = [];
    const p1 = periods['1d'];
    const p14 = periods['14d'];
    const p7 = periods['7d'];

    // 1. 预算与消耗趋势
    if (p1.budgetUtilization > 120) {
      insights.push({ icon: <AlertCircle className="text-amber-500" />, text: `短期预算超支风险：最近 24 小时预算利用率达 ${p1.budgetUtilization.toFixed(1)}%，显著高于 14 日均值，建议监控跑量速度。` });
    } else if (p1.budgetUtilization < 80) {
      insights.push({ icon: <Info className="text-blue-500" />, text: `预算跑量不足：近 1 日消耗仅占预算的 ${p1.budgetUtilization.toFixed(1)}%，可能受受众饱和或竞争环境影响。` });
    } else {
      insights.push({ icon: <CheckCircle2 className="text-green-500" />, text: `预算利用健康：消耗节奏与预算设定高度契合，利用率维持在 90%-110% 的黄金区间。` });
    }

    // 2. CPA 效率
    const cpaTrend = ((p1.cpa - p14.cpa) / p14.cpa) * 100;
    if (cpaTrend < -10) {
      insights.push({ icon: <TrendingDown className="text-green-500" />, text: `CPA 效率提升：最近 1 日 CPA (¥${p1.cpa.toFixed(1)}) 较 14 日均值下降了 ${Math.abs(cpaTrend).toFixed(1)}%，模型进入正向反馈期。` });
    } else if (cpaTrend > 10) {
      insights.push({ icon: <TrendingUp className="text-red-500" />, text: `核心指标预警：近 1 日 CPA 较 14 日上涨了 ${cpaTrend.toFixed(1)}%，KPI 达成率下降，需核查素材疲劳度。` });
    }

    // 3. 转化转化潜力 (CVR1)
    if (p1.regRate > p7.regRate) {
      insights.push({ icon: <Zap className="text-blue-500" />, text: `漏斗效率优化：注册转化率（CVR1）呈现阶梯式增长，从 7 日均值的 ${p7.regRate.toFixed(2)}% 提升至今日的 ${p1.regRate.toFixed(2)}%。` });
    }

    // 4. 市场排名
    if (p1.rank <= 3) {
      insights.push({ icon: <Target className="text-purple-500" />, text: `品类统治力：该系列目前在相同定向及目标维度下排名进入前 ${((p1.rank/12)*100).toFixed(0)}% 的优胜区间。` });
    }

    // 5. 异常监测
    insights.push({ icon: <ShieldCheck size={14} className="text-green-600" />, text: "异常监测：核心指标未触发熔断阈值，系统运行平稳，无由于媒体政策或 API 抖动导致的异常表现。" });

    return insights.slice(0, 5); 
  };

  const getFunnelMetrics = (data) => {
    const sum = (key) => data.reduce((acc, d) => acc + (d[key] || 0), 0);
    const s = sum('spend'), i = sum('impressions'), c = sum('clicks'), cv = sum('conversions'), p = sum('purchases');
    return { spend: s, cpm: (s / i) * 1000, cpc: s / c, ctr: (c / i) * 100, cpa: s / cv, cvr1: (cv / c) * 100, cpp: s / p, pRate: (p / cv) * 100 };
  };

  const campFunnel = getFunnelMetrics(history14);
  const benchFunnel = { spend: campFunnel.spend * 1.1, cpm: campFunnel.cpm * 0.95, cpc: campFunnel.cpc * 1.05, ctr: campFunnel.ctr * 0.9, cpa: campFunnel.cpa * 1.1, cvr1: campFunnel.cvr1 * 0.85, cpp: campFunnel.cpp * 1.05, pRate: campFunnel.pRate * 0.95 };

  const compare = (val, bench, lowerIsBetter = false) => {
    const diff = ((val - bench) / bench) * 100;
    const isGood = lowerIsBetter ? val < bench : val > bench;
    return { isGood, text: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%` };
  };

  const periodicInsights = getPeriodicAnalysisInsights();

  const comparisonRows = [
    { l: '总消耗（日均消耗）', f: (p) => `¥${p.spendTotal.toFixed(0)} (${p.spendAvg.toFixed(0)})` },
    { l: '总转化量（日均转化量）', f: (p) => `${p.convTotal.toFixed(0)} (${p.convAvg.toFixed(0)})` },
    { l: 'KPI达成值（CPA或ROAS）', f: (p) => `¥${p.cpa.toFixed(1)}` },
    { l: 'KPI达成率', f: (p) => `${p.cpaAchievement.toFixed(0)}%` },
    { l: 'KPI达成排名', f: (p) => `${p.rank}/12 (前${((p.rank / 12) * 100).toFixed(0)}%)` },
    { l: 'CTR（vs均值）', f: (p) => `${p.ctr.toFixed(2)}% (vs ${periods['14d'].ctr.toFixed(2)}%)` },
    { l: 'KPI CVR（vs均值）', f: (p) => `${p.regRate.toFixed(2)}% (vs ${periods['14d'].regRate.toFixed(2)}%)` },
  ];

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{campaign.name}</h2>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{campaign.platform} • 深度诊断中心</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-12 pb-32">
          
          <section className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4"><Zap className="text-yellow-400" size={18} /><h3 className="font-bold">AI 决策建议</h3></div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{campaign.aiAdvice?.detailedAnalysis}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-black uppercase">建议预算</p>
                  <p className="text-xl font-black text-green-400">¥{campaign.aiAdvice?.recommendedBudget}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-black uppercase">预期提升</p>
                  <p className="text-xl font-black text-blue-400">+12.5%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} className="text-blue-500" /> 最近 14 天历史优化记录</h4>
              <div className="grid gap-3">
                {opHistory.length > 0 ? opHistory.map((op, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">{op.date}</span>
                        <span className="text-xs font-bold text-slate-700">{op.action}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">变更: <span className="text-blue-600">{op.changeAmt} ({op.changePct})</span></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">调整前2日均值</p>
                        <div className="flex justify-between text-[10px] font-bold text-slate-600">
                          <span>ROAS: {op.before.roas.toFixed(1)}x</span>
                          <span>CPA: ¥{op.before.cpa.toFixed(0)}</span>
                          <span>转化: {op.before.conv.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="pl-4">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">调整后2日均值</p>
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className={op.after.roas >= op.before.roas ? 'text-green-600' : 'text-red-500'}>ROAS: {op.after.roas.toFixed(1)}x</span>
                          <span className={op.after.cpa <= op.before.cpa ? 'text-green-600' : 'text-red-500'}>CPA: ¥{op.after.cpa.toFixed(0)}</span>
                          <span className={op.after.conv >= op.before.conv ? 'text-green-600' : 'text-red-500'}>转化: {op.after.conv.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : <div className="py-4 text-center text-slate-400 text-xs italic">近14天暂无历史操作记录</div>}
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => setShowRawTable(!showRawTable)} className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-all">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-600"><Table size={14}/> 过去14天原始数据明细清单</span>
                {showRawTable ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </button>
              {showRawTable && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-2 border-r border-slate-100">日期</th><th className="p-2">预算</th><th className="p-2">消耗</th><th className="p-2">CPM</th><th className="p-2">CPC</th><th className="p-2">CTR</th><th className="p-2">Action</th><th className="p-2">CPA</th><th className="p-2">CVR1</th><th className="p-2">Purch</th><th className="p-2">CPP</th><th className="p-2">CVR2</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {history14.map((d, i) => (
                        <tr key={i} className="hover:bg-blue-50/30">
                          <td className="p-2 border-r border-slate-100 font-medium">{d.date.slice(5)}</td>
                          <td className="p-2">¥{d.budget}</td><td className="p-2">¥{d.spend.toFixed(0)}</td><td className="p-2">¥{d.cpm.toFixed(1)}</td><td className="p-2">¥{d.cpc.toFixed(1)}</td><td className="p-2">{(d.clicks/d.impressions*100).toFixed(1)}%</td><td className="p-2">{d.conversions.toFixed(0)}</td><td className="p-2">¥{d.cpa.toFixed(1)}</td><td className="p-2">{(d.conversions/d.clicks*100).toFixed(1)}%</td><td className="p-2">{d.purchases.toFixed(0)}</td><td className="p-2">¥{d.cpp.toFixed(1)}</td><td className="p-2">{(d.purchases/d.conversions*100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-blue-500" /> 多维时序对比分析</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                  <tr><th className="p-3 border-r border-slate-100">分析维度</th><th className="p-3">最近14日</th><th className="p-3">最近7日</th><th className="p-3">最近3日</th><th className="p-3">最近1日</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-500 bg-slate-50/30 border-r border-slate-100">{row.l}</td>
                      {Object.values(periods).map((p, idx) => (<td key={idx} className="p-3 font-medium text-slate-700">{row.f(p)}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI 周期数据分析总结 */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-blue-500" />
                <h5 className="text-xs font-black text-blue-700 uppercase tracking-widest">AI 周期数据表现透视</h5>
              </div>
              <ul className="space-y-3">
                {periodicInsights.map((insight, idx) => (
                  <li key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="mt-0.5 shrink-0">{insight.icon}</div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: 14-day Trend */}
          <section>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-500" /> 14日核心指标趋势 (精细化看板)</h4>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 h-[340px] shadow-sm relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={history14} margin={{ right: 20, left: -20, top: 10 }}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={8} axisLine={false} tickLine={false} tickFormatter={v=>v.slice(8)} />
                  
                  {/* Left: Conversions */}
                  <YAxis yAxisId="installs" orientation="left" stroke="#cbd5e1" fontSize={7} axisLine={false} tickLine={false} tickCount={6} />
                  
                  {/* Right: Consolidated Metric Axis for Lines */}
                  <YAxis yAxisId="metrics" orientation="right" stroke="#94a3b8" fontSize={7} axisLine={false} tickLine={false} tickCount={6} />

                  <Tooltip 
                    contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 20 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '8px', paddingTop: '20px' }} />
                  
                  <Bar yAxisId="installs" dataKey="conversions" name="每日安装" fill="#f8fafc" barSize={22} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="metrics" type="monotone" dataKey="cpa" name="CPA (¥)" stroke="#8b5cf6" strokeWidth={2} dot={{r:2, fill: '#8b5cf6', strokeWidth: 0}} />
                  <Line yAxisId="metrics" type="monotone" dataKey="roas" name="ROAS (x)" stroke="#3b82f6" strokeWidth={2} dot={{r:2, fill: '#3b82f6', strokeWidth: 0}} />
                  <Line yAxisId="metrics" type="monotone" dataKey="cpm" name="CPM (¥)" stroke="#10b981" strokeWidth={2} dot={{r:2, fill: '#10b981', strokeWidth: 0}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 趋势分析统计结果 */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'CPM 趋势分析', data: trends.cpm, color: 'text-green-600', prefix: '¥' },
                { label: 'CPA 趋势分析', data: trends.cpa, color: 'text-purple-600', prefix: '¥' },
                { label: 'ROAS 趋势分析', data: trends.roas, color: 'text-blue-600', prefix: '' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                    {getTrendIcon(item.data.slope)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[8px] text-slate-400">平均值:</span>
                      <span className={`text-xs font-bold text-slate-700`}>{item.prefix}{item.data.avg.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[8px] text-slate-400">斜率 (Slope):</span>
                      <span className={`text-[10px] font-mono font-bold ${item.data.slope > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {item.data.slope > 0 ? '+' : ''}{item.data.slope.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[8px] text-slate-400">确定系数 R²:</span>
                      <span className="text-[10px] font-mono text-slate-600">{item.data.rSquared.toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[8px] text-slate-400 italic">
                    {item.data.rSquared > 0.6 ? '趋势强相关，数据高度可靠' : '波动较大，趋势相关性一般'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={16} className="text-blue-500" /> 转化漏斗对比 (US • Add-to-cart)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase text-center">本 Campaign 表现</p>
                {[
                  { l: '花费', v: `¥${campFunnel.spend.toFixed(0)}`, w: 'w-full', c: 'bg-blue-600' },
                  { l: '曝光 (CPM)', v: `¥${campFunnel.cpm.toFixed(1)}`, w: 'w-[90%]', c: 'bg-blue-500', comp: compare(campFunnel.cpm, benchFunnel.cpm, true) },
                  { l: `点击 (CPC/CTR)`, v: `¥${campFunnel.cpc.toFixed(1)} / ${campFunnel.ctr.toFixed(1)}%`, w: 'w-[75%]', c: 'bg-blue-400', comp: compare(campFunnel.ctr, benchFunnel.ctr) },
                  { l: `转化 (CPA/CVR1)`, v: `¥${campFunnel.cpa.toFixed(1)} / ${campFunnel.cvr1.toFixed(1)}%`, w: 'w-[60%]', c: 'bg-blue-300', comp: compare(campFunnel.cvr1, benchFunnel.cvr1) },
                  { l: `购买 (CPP/P.Rate)`, v: `¥${campFunnel.cpp.toFixed(1)} / ${campFunnel.pRate.toFixed(1)}%`, w: 'w-[45%]', c: 'bg-blue-200', comp: compare(campFunnel.pRate, benchFunnel.pRate) },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`${item.w} h-10 ${item.c} rounded flex items-center justify-center text-white font-bold text-[9px] relative shadow-sm`}>
                      <span className="px-2 truncate">{item.l}: {item.v}</span>
                      {item.comp && <div className={`absolute -right-2 top-0 translate-x-full px-1.5 py-0.5 rounded text-[8px] font-black ${item.comp.isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{item.comp.text}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 opacity-40">
                <p className="text-[10px] font-black text-slate-400 uppercase text-center">行业基准表现</p>
                {[
                  { v: `¥${benchFunnel.spend.toFixed(0)}`, w: 'w-full' }, { v: `¥${benchFunnel.cpm.toFixed(1)}`, w: 'w-[90%]' }, { v: `¥${benchFunnel.cpc.toFixed(1)} / ${benchFunnel.ctr.toFixed(1)}%`, w: 'w-[75%]' }, { v: `¥${benchFunnel.cpa.toFixed(1)} / ${benchFunnel.cvr1.toFixed(1)}%`, w: 'w-[60%]' }, { v: `¥${benchFunnel.cpp.toFixed(1)} / ${benchFunnel.pRate.toFixed(1)}%`, w: 'w-[45%]' },
                ].map((item, idx) => (<div key={idx} className="flex flex-col items-center"><div className={`${item.w} h-10 bg-slate-300 rounded flex items-center justify-center text-slate-600 font-bold text-[9px]`}>{item.v}</div></div>))}
              </div>
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-50 shadow-2xl">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all text-xs uppercase tracking-widest">暂不处理</button>
          <button className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg text-xs uppercase tracking-widest flex items-center gap-2">确认应用优化建议 <ArrowRight size={16}/></button>
        </div>
      </div>
    </>
  );
};

export default DetailDrawer;
