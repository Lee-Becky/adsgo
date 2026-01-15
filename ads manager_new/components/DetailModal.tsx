
import React from 'react';
import { Campaign } from '../types';
import { GLOBAL_FUNNEL } from '../services/mockData';
import { X, ArrowRight, Zap, TrendingUp, Info } from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, ScatterChart, Scatter, Cell, AreaChart, Area
} from 'recharts';

interface DetailModalProps {
  campaign: Campaign;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ campaign, onClose }) => {
  // 图表 2: 漏斗计算
  const campaignFunnel = [
    { name: '总消耗', value: campaign.todayMetrics.spend },
    { name: '总曝光', value: campaign.todayMetrics.impressions },
    { name: '点击量', value: campaign.todayMetrics.clicks },
    { name: '成交量', value: campaign.todayMetrics.conversions },
    { name: '购买人数', value: Math.floor(campaign.todayMetrics.conversions * 0.8) }, 
  ];

  const getConversionRate = (step1: number, step2: number) => ((step2 / step1) * 100).toFixed(1) + '%';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* 页眉 */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-800">{campaign.name}</h2>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{campaign.platform}</span>
            </div>
            <p className="text-slate-500 text-sm">AI 深度表现分析与策略建议</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-8 overflow-y-auto space-y-10">
          
          {/* AI 策略概览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-yellow-400" size={20} />
                <h3 className="font-semibold text-lg">AI 战略总览</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {campaign.aiAdvice?.detailedAnalysis || "正在分析历史趋势和市场环境..."}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">建议预算</p>
                  <p className="text-xl font-bold text-green-400">¥{campaign.aiAdvice?.recommendedBudget}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">建议出价调整</p>
                  <p className="text-xl font-bold text-blue-400">+5.0%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500"/> 核心优化点
              </h3>
              <div className="space-y-4 flex-grow">
                {campaign.aiAdvice?.reasons.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">{i+1}</span>
                    <p className="text-sm text-slate-600">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 图表 1: 消耗 vs ROAS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-6">图表 1: 过去 14 天每日消耗与 ROAS 趋势</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={campaign.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} axisLine={false} tickLine={false} dy={10} />
                  <YAxis yAxisId="left" orientation="left" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} label={{ value: '消耗 (¥)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} label={{ value: 'ROAS (x)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="spend" name="每日消耗 (¥)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="roas" name="达成 ROAS (x)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine yAxisId="right" y={3.5} label={{ position: 'right', value: 'KPI 目标 (3.5x)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 图表 2: 漏斗分析 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="font-semibold text-slate-800 mb-8">图表 2: 转化漏斗分析 (当前广告系列 vs 整体均值)</h3>
            <div className="grid md:grid-cols-2 gap-12">
              {/* 当前广告系列漏斗 */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-6 flex items-center gap-2">本广告系列表现</h4>
                <div className="space-y-4">
                  {campaignFunnel.map((step, i) => {
                    const width = 100 - (i * 15);
                    const prevValue = i > 0 ? campaignFunnel[i-1].value : null;
                    // 简单判断性能色
                    const isPerformanceGood = step.value > (GLOBAL_FUNNEL[i].value / 10);
                    return (
                      <div key={step.name} className="relative">
                        <div 
                          className={`h-12 flex items-center px-4 rounded-lg text-white font-medium shadow-sm transition-all ${isPerformanceGood ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${width}%`, margin: '0 auto' }}
                        >
                          <span className="text-xs truncate">{step.name}: {step.value.toLocaleString()}</span>
                        </div>
                        {prevValue && (
                          <div className="text-center text-[10px] font-bold text-slate-400 py-1">
                            转化率: {getConversionRate(prevValue, step.value)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* 整体基准 */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-6 flex items-center gap-2">系统整体转化基准</h4>
                <div className="space-y-4 opacity-40">
                  {GLOBAL_FUNNEL.map((step, i) => {
                    const width = 100 - (i * 15);
                    const prevValue = i > 0 ? GLOBAL_FUNNEL[i-1].value : null;
                    return (
                      <div key={step.name} className="relative">
                        <div 
                          className="h-12 flex items-center px-4 rounded-lg bg-slate-400 text-white font-medium"
                          style={{ width: `${width}%`, margin: '0 auto' }}
                        >
                          <span className="text-xs truncate">{step.name}</span>
                        </div>
                        {prevValue && (
                           <div className="text-center text-[10px] font-bold text-slate-400 py-1">
                            基准率: {getConversionRate(prevValue, step.value)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 图表 3: CPA 效率排名 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <h3 className="font-semibold text-slate-800 mb-6">图表 3: 转化量与 CPA 效率排行 (对比所有 Campaign)</h3>
             <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={campaign.history}>
                    <defs>
                      <linearGradient id="colorCpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip labelFormatter={(v) => `日期: ${v}`} />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="cpa" name="每日 CPA (¥)" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCpa)" />
                    <ReferenceLine y={22} label={{ value: '账户平均 CPA', fill: '#94a3b8', fontSize: 10 }} stroke="#94a3b8" strokeDasharray="5 5" />
                    <ReferenceLine y={15} label={{ value: 'KPI 目标线', fill: '#22c55e', fontSize: 10 }} stroke="#22c55e" strokeDasharray="3 3" />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* 图表 4: 操作记录 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-6">图表 4: 历史操作记录与调整后表现变化</h3>
            <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-8">
               {campaign.history.filter(h => h.operation).map((op, i) => (
                 <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block min-w-[300px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400">{op.date}</span>
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded uppercase font-bold">手动优化</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mb-3">{op.operation}</p>
                      <div className="flex gap-4">
                        <div className="text-xs">
                          <p className="text-slate-400">调整后 ROAS 变化</p>
                          <p className="font-bold text-green-600">+12%</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-400">调整后转化提升</p>
                          <p className="font-bold text-blue-600">+8.5%</p>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
               <div className="text-center py-4 text-slate-400 text-sm flex items-center gap-2 justify-center">
                 <Info size={14}/> 更早的操作已归档
               </div>
            </div>
          </div>

          {/* 图表 5: 创意效率矩阵 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-semibold text-slate-800">图表 5: 创意效率矩阵 (点击率 CTR vs 转化率 CVR)</h3>
               <div className="flex gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 优秀素材</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> 待优化</span>
               </div>
             </div>
             <div className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="x" name="CTR" unit="%" fontSize={12} label={{ value: '点击率 CTR (%)', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="y" name="CVR" unit="%" fontSize={12} label={{ value: '转化率 CVR (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="素材表现" data={[
                      { x: 1.2, y: 3.5, name: '视频素材 A' },
                      { x: 2.5, y: 1.2, name: '静态素材 B' },
                      { x: 0.8, y: 4.8, name: '轮播素材 C' },
                      { x: 3.1, y: 4.2, name: '视频素材 D' },
                      { x: 1.8, y: 2.2, name: '静态素材 E' },
                    ]} fill="#3b82f6">
                      { [1,2,3,4,5].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#3b82f6'} />
                      ))}
                    </Scatter>
                 </ScatterChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* 页脚 */}
        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors">关闭</button>
          <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2">
            应用 AI 预算调整 <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
