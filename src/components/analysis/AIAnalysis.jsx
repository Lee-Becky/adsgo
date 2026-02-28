import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowUp,
  Link,
  ChevronRight,
  Check
} from 'lucide-react';

const AIAnalysis = ({ selectedBrand, brandDetail, onUpdateDetail }) => {
  const navigate = useNavigate();
  const [url, setUrl] = React.useState(brandDetail.url || '');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisProgress, setAnalysisProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState([]);

  const analysisSteps = [
    {
      id: 'brand',
      title: '品牌识别',
      desc: '访问首页，提取品牌信息和行业分类',
      subtasks: ['访问首页', '提取品牌信息', '识别行业分类'],
      completedSubtasks: 2
    },
    {
      id: 'crawl',
      title: '页面抓取',
      desc: '发现并访问重要页面，提取结构化数据',
      subtasks: ['页面抓取', '数据提取'],
      completedSubtasks: 0
    },
    {
      id: 'competitor',
      title: '竞品分析',
      desc: '搜索同行业竞品，分析竞品特征',
      subtasks: ['搜索竞品', '特征分析'],
      completedSubtasks: 0
    },
    {
      id: 'comprehensive',
      title: 'AI综合分析',
      desc: 'LLM深度分析，生成完整客户画像',
      subtasks: ['LLM深度分析', '生成画像'],
      completedSubtasks: 0
    }
  ];

  React.useEffect(() => {
    setUrl(brandDetail.url || '');
  }, [brandDetail.url, selectedBrand]);

  React.useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setIsAnalyzing(false);
              onUpdateDetail({ url, isAnalyzed: true });
            }, 1000);
            return 100;
          }
          const next = prev + 1;
          
          // Update steps based on progress
          if (next < 25) setCurrentStep(0);
          else if (next < 50) setCurrentStep(1);
          else if (next < 75) setCurrentStep(2);
          else setCurrentStep(3);

          return next;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isAnalyzing, onUpdateDetail, url]);

  const handleStartAnalysis = () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep(0);
  };

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

  if (isAnalyzing) {
    return (
      <div className="absolute inset-0 bg-[#F8FAFC] z-10 flex flex-col overflow-hidden animate-in fade-in duration-500 rounded-3xl">
        {/* Top Status Bar */}
        <div className="h-14 flex items-center justify-center px-6 shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-700">
              {analysisProgress < 25 ? '正在识别品牌信息...' : 
               analysisProgress < 50 ? '正在抓取页面内容...' :
               analysisProgress < 75 ? '正在分析竞争对手...' :
               '正在生成客户画像...'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar */}
          <div className="w-[320px] flex flex-col p-6 shrink-0 overflow-y-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-900">生成进度</span>
                <span className="text-sm font-bold text-blue-600">{analysisProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-orange-400 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {analysisSteps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;

                return (
                  <div 
                    key={step.id}
                    className={`p-5 rounded-[24px] border transition-all duration-500 ${
                      isActive ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5' : 
                      isCompleted ? 'bg-white/40 border-slate-50' :
                      'bg-transparent border-transparent opacity-40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isCompleted ? 'bg-blue-50 text-blue-500' :
                        isActive ? 'bg-amber-50 text-amber-600 ring-4 ring-amber-50/50' :
                        'bg-slate-100 text-slate-300'
                      }`}>
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : 
                         isActive ? <RefreshCcw size={16} className="animate-spin" /> :
                         <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[15px] font-bold mb-1 transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.title}
                        </h4>
                        {isActive && (
                          <div className="animate-in slide-in-from-top-2 duration-500">
                            <p className="text-[12px] text-slate-400 leading-relaxed mb-4 font-medium">
                              {step.desc}
                            </p>
                            <div className="space-y-2.5">
                              {step.subtasks.map((task, taskIdx) => {
                                const isTaskCompleted = taskIdx < (analysisProgress % 25) / 8;
                                return (
                                  <div key={taskIdx} className="flex items-center gap-3 text-[12px] font-bold">
                                    {isTaskCompleted ? (
                                      <Check size={14} className="text-green-500" />
                                    ) : (
                                      <RefreshCcw size={14} className="text-amber-500 animate-spin" />
                                    )}
                                    <span className={isTaskCompleted ? 'text-slate-400' : 'text-slate-600'}>
                                      {task}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-8 flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-green-500 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedBrand}`} alt="" className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Name</span>
                <span className="text-sm font-black text-slate-700">{selectedBrand}</span>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 bg-slate-50/50 p-8 pt-4 overflow-hidden flex flex-col">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">浏览器实时预览</span>
            </div>
            
            <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative group/browser">
              {/* Browser Header */}
              <div className="h-14 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-1.5 bg-white rounded-t-xl border border-slate-100 border-b-white -mb-[17px] flex items-center gap-3 relative z-10">
                    <div className="w-3 h-3 bg-blue-500/10 rounded flex items-center justify-center">
                      <span className="text-[8px] font-bold text-blue-600">1</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Brand Page</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="flex-1 h-9 bg-white rounded-xl border border-slate-200 flex items-center px-4 gap-3 shadow-sm">
                  <Link size={14} className="text-slate-300" />
                  <span className="text-[12px] text-slate-400 font-bold truncate tracking-tight">{url}</span>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 p-8">
                  {/* Mock Website Content - High Fidelity */}
                  <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-1000">
                    <nav className="flex items-center justify-between mb-16 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-[12px] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <Sparkles size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tighter italic">AdsGo.ai</span>
                      </div>
                      <div className="flex items-center gap-8 text-[13px] font-bold text-slate-500">
                        <span className="hover:text-slate-900 transition-colors cursor-pointer">Features</span>
                        <span className="hover:text-slate-900 transition-colors cursor-pointer">Pricing</span>
                        <span className="hover:text-slate-900 transition-colors cursor-pointer">Resources</span>
                        <span className="hover:text-slate-900 transition-colors cursor-pointer">About</span>
                        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">Free Trial</button>
                      </div>
                    </nav>
                    
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-10 relative">
                      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl" />
                      
                      <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black tracking-[0.2em] border border-indigo-100 shadow-sm uppercase">
                        New: AI-Powered Campaign Analysis
                      </div>
                      
                      <h2 className="text-[64px] font-black text-slate-900 leading-[1] tracking-tight">
                        Turn $1 Into $4<br />
                        With <span className="text-indigo-600 relative inline-block">
                          AI Ads
                          <div className="absolute inset-x-0 -bottom-2 h-6 bg-yellow-200/60 -rotate-1 -z-10 rounded-sm" />
                        </span>
                      </h2>
                      
                      <p className="text-lg text-slate-500 font-bold max-w-xl mx-auto leading-relaxed">
                        The world's first AI ad agent that handles everything from research to creative automatically.
                      </p>
                      
                      <div className="flex items-center gap-6 pt-4">
                        <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0 active:scale-95">
                          Start Free Trial
                        </button>
                        <button className="px-10 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black flex items-center gap-3 hover:border-slate-200 transition-all hover:bg-slate-50 shadow-sm">
                          <img src="https://google.com/favicon.ico" className="w-5 h-5" alt="" />
                          Sign up with Google
                        </button>
                      </div>
                      
                      <div className="pt-16 grid grid-cols-4 gap-12 opacity-30 grayscale filter">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-6" alt="Amazon" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" alt="Google" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" className="h-6" alt="Meta" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_logo_2012.svg" className="h-6" alt="Microsoft" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* High Fidelity Scanner Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 animate-scan" />
                  <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan {
            animation: scan 3s linear infinite;
          }
        `}} />
      </div>
    );
  }

  if (!brandDetail.isAnalyzed) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-700">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-[56px] lg:text-[72px] font-black text-[#0F172A] leading-[1.1] tracking-tight">
              AI Marketing Strategy<br />
              Backed by
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Stop guessing. Our multi-agent system analyzes your product, competitors, and <span className="text-slate-900 font-bold">comprehensive industry data</span> to generate high-ROAS campaigns.
            </p>
          </div>

          {/* Input Area */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
              <div className="relative flex items-center bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-2 hover:border-slate-200 transition-all duration-300 group-focus-within:border-blue-200 group-focus-within:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.12)]">
                <div className="flex-1 flex items-center pl-6">
                  <div className="text-slate-300 group-focus-within:text-blue-500 transition-colors mr-4">
                    <Link size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.your-brand.com"
                    className="w-full bg-transparent border-none outline-none text-lg font-bold text-slate-700 placeholder:text-slate-300 py-4"
                  />
                </div>
                <button 
                  onClick={handleStartAnalysis}
                  disabled={!url.trim()}
                  className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2 transition-all duration-300 active:scale-95 ${
                    url.trim() 
                      ? 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-xl' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Start Analysis
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-8 pt-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Sparkles className="text-amber-400" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">开始营销分析</h1>
        <div className="flex items-center gap-3">
          <p className="text-gray-400 font-medium">当前品牌: <span className="text-slate-900 font-bold">{selectedBrand}</span></p>
          <button 
            onClick={() => navigate('/brandCenter/brandProfile')}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm flex items-center gap-1.5"
          >
            查看当前品牌画像
            <ChevronRight size={12} />
          </button>
        </div>
        <p className="text-gray-500 mt-2">选择功能快速开始，或直接输入问题</p>
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
