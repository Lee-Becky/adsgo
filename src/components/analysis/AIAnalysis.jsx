import React from 'react';
import { 
  BarChart3, 
  Target, 
  Box, 
  Search, 
  UserCircle, 
  Compass, 
  ShoppingCart, 
  Presentation, 
  LineChart, 
  Bell, 
  RefreshCcw,
  Zap,
  Sparkles,
  ArrowUp
} from 'lucide-react';

const AIAnalysis = () => {
  const stages = [
    {
      id: 1,
      title: "洞察阶段",
      subtitle: "了解市场、竞品和产品",
      cards: [
        {
          icon: <BarChart3 className="text-blue-500" size={24} />,
          iconBg: "bg-blue-50",
          title: "市场调研",
          desc: "市场规模、区域分析、品牌竞争格局、细分市场",
          tags: ["市场规模", "区域分析", "趋势洞察"]
        },
        {
          icon: <Target className="text-orange-500" size={24} />,
          iconBg: "bg-orange-50",
          title: "竞品分析",
          desc: "竞争对手定位、产品对比、营销策略、差异化机会",
          tags: ["品牌对比", "策略拆解", "差异化"]
        },
        {
          icon: <Box className="text-emerald-500" size={24} />,
          iconBg: "bg-emerald-50",
          title: "产品分析",
          desc: "从 Amazon、YouTube 评测、社区讨论采集用户真实反馈",
          tags: ["用户评价", "YouTube评测", "卖点提炼"]
        },
        {
          icon: <Search className="text-amber-500" size={24} />,
          iconBg: "bg-amber-50",
          title: "广告情报",
          desc: "实时搜索竞品在 Meta、TikTok、Google 投放的广告创意",
          tags: ["Meta广告库", "TikTok CC", "Google透明度"],
          badge: "HOT"
        }
      ]
    },
    {
      id: 2,
      title: "策略阶段",
      subtitle: "定义目标受众和投放方案",
      cards: [
        {
          icon: <UserCircle className="text-green-500" size={24} />,
          iconBg: "bg-green-50",
          title: "受众洞察",
          desc: "目标人群画像、媒体偏好、广告定向参数建议",
          tags: ["人群画像", "FB定向", "Google关键词"]
        },
        {
          icon: <Compass className="text-orange-400" size={24} />,
          iconBg: "bg-orange-50",
          title: "投放策略",
          desc: "地域推荐、平台选择、预算分配、投放节奏规划",
          tags: ["地域推荐", "预算分配", "行业基准"]
        }
      ]
    },
    {
      id: 3,
      title: "执行阶段",
      subtitle: "生成素材和方案",
      cards: [
        {
          icon: <ShoppingCart className="text-cyan-500" size={24} />,
          iconBg: "bg-cyan-50",
          title: "Product Feed",
          desc: "Google Shopping Feed智能生成，SEO优化标题",
          tags: ["SEO优化", "批量生成", "CSV导出"]
        },
        {
          icon: <Presentation className="text-indigo-500" size={24} />,
          iconBg: "bg-indigo-50",
          title: "案例PPT",
          desc: "一键生成专业营销案例演示文稿",
          tags: ["PPT生成", "案例包装", "一键导出"]
        }
      ]
    },
    {
      id: 4,
      title: "监控阶段",
      subtitle: "预测效果和实时追踪",
      cards: [
        {
          icon: <LineChart className="text-amber-600" size={24} />,
          iconBg: "bg-amber-50",
          title: "效果预测",
          desc: "ML 预测 CPA/CTR/CVR，行业基准对比，投放建议",
          tags: ["ML预测", "平台对比", "优化建议"]
        },
        {
          icon: <Bell className="text-rose-400" size={24} />,
          iconBg: "bg-rose-50",
          title: "动态监控",
          desc: "订阅品牌/竞品动态，定时邮件推送市场情报",
          tags: ["每日简报", "竞品动态", "邮件推送"]
        },
        {
          icon: <RefreshCcw className="text-teal-500" size={24} />,
          iconBg: "bg-teal-50",
          title: "投放复盘",
          desc: "基于真实投放数据，自动生成周/月复盘报告",
          tags: ["周报", "月报", "效果对比"]
        },
        {
          icon: <Bell className="text-red-500" size={24} />,
          iconBg: "bg-red-50",
          title: "异常预警",
          desc: "实时监控投放指标，异常自动诊断并邮件预警",
          tags: ["实时监控", "AI诊断", "邮件预警"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8 pt-12">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Sparkles className="text-amber-400" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">开始营销分析</h1>
        <p className="text-gray-500 text-lg">选择功能快速开始，或直接输入问题，可先访问 http://172.30.134.140:8000/ 使用</p>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-[1400px] mx-auto space-y-16">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-6">
            {/* Stage Title */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-amber-100/50 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm border border-amber-200/50">
                {stage.id}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{stage.title}</h2>
              <span className="text-gray-400 text-sm">{stage.subtitle}</span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stage.cards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer"
                >
                  {/* Badge */}
                  {card.badge && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                      <Zap size={10} fill="currentColor" />
                      {card.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {card.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                    {card.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Padding for floating input */}
      <div className="h-40" />

      {/* Floating Chat Input */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[1000px] px-6 z-50">
        <div className="relative group">
          {/* Main Input Container */}
          <div className="flex items-center bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2 pr-2 hover:border-blue-200 transition-all duration-300">
            {/* Sparkle Icon */}
            <div className="pl-4 pr-3">
              <Sparkles className="text-amber-500" size={20} />
            </div>

            {/* Input Field */}
            <input 
              type="text" 
              placeholder="输入你的问题..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm py-3"
            />

            {/* Send Button */}
            <button className="w-10 h-10 bg-orange-500 text-white rounded-[16px] flex items-center justify-center shadow-lg hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-200">
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
