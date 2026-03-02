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
  Check,
  X,
  Square,
  Globe,
  History,
  FileText,
  Calendar,
  ExternalLink,
  Eye,
  Download,
  Filter,
  Swords,
  ChevronDown,
  TrendingUp,
  PieChart,
  Users,
  Clock,
  Building2,
  Minus,
  Maximize2
} from 'lucide-react';

const AIAnalysis = ({ selectedBrand, brandDetail, onUpdateDetail }) => {
  const navigate = useNavigate();
  const [url, setUrl] = React.useState(brandDetail.url || '');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(!brandDetail.isAnalyzed && !brandDetail.url);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = React.useState(false);
  const [isProcessMinimized, setIsProcessMinimized] = React.useState(false);
  const [previewReport, setPreviewReport] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState('全部类型');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = React.useState(false);
  const [isMarketAnalyzing, setIsMarketAnalyzing] = React.useState(false);
  const [hasNewReport, setHasNewReport] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisProgress, setAnalysisProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const isMinimizedRef = React.useRef(isProcessMinimized);
  React.useEffect(() => {
    isMinimizedRef.current = isProcessMinimized;
  }, [isProcessMinimized]);

  const reportCategories = [
    "全部类型", "市场分析", "竞品分析", "受众分析", "投放策略", "产品分析", "ROAS预测"
  ];

  const mockHistoryData = [
    { id: 1, type: '竞品分析', title: '竞争对手策略与差异化机会', time: '3 天前', icon: <Swords size={12} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { id: 2, type: '市场分析', title: '2024年全球电商市场趋势报告', time: '5 天前', icon: <BarChart3 size={12} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 3, type: '受众分析', title: '目标受众行为特征与媒体偏好', time: '1 周前', icon: <UserCircle size={12} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 4, type: '投放策略', title: 'Meta与Google广告投放预算分配建议', time: '2 周前', icon: <Compass size={12} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: 5, type: '产品分析', title: '产品卖点提炼与用户反馈分析', time: '1 个月前', icon: <Box size={12} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { id: 6, type: 'ROAS预测', title: 'Q1季度投放效果预测与ROAS模拟', time: '1 个月前', icon: <LineChart size={12} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  const filteredHistory = selectedCategory === '全部类型' 
    ? mockHistoryData 
    : mockHistoryData.filter(item => item.type === selectedCategory);

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
    // 只有当品牌既没有分析过，也没有 URL（即完全为空）时，才自动弹出初始化弹窗
    if (!brandDetail.isAnalyzed && !brandDetail.url) {
      setIsUpdateModalOpen(true);
    } else {
      setIsUpdateModalOpen(false);
    }
  }, [brandDetail.url, selectedBrand, brandDetail.isAnalyzed]);

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
    setIsUpdateModalOpen(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep(0);
  };

  const handleStartMarketGeneration = () => {
    setIsMarketModalOpen(false);
    setIsMarketAnalyzing(true);
    setIsProcessModalOpen(true);
    setIsProcessMinimized(false);
    
    // Simulate generation process
    setTimeout(() => {
      setIsMarketAnalyzing(false);
      const currentMinimized = isMinimizedRef.current;
      setIsProcessModalOpen(false);
      setHasNewReport(true);
      
      if (!currentMinimized) {
        setPreviewReport(mockHistoryData[1]);
      }
    }, 8000);
  };

  const stages = [
    {
      id: 1,
      title: "洞察阶段",
      subtitle: "了解市场、竞品 and 产品",
      cards: [
        {
          id: 'market-research',
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
      subtitle: "定义目标受众 and 投放方案",
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
      subtitle: "生成素材 and 方案",
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
      subtitle: "预测效果 and 实时追踪",
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
            </div>
          </div>

          <div className="flex-1 bg-slate-50/50 p-8 pt-4 overflow-hidden flex flex-col">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-black text-slate-400 tracking-widest">浏览器实时预览</span>
            </div>
            
            <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative group/browser">
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
              
              <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 p-8">
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
                      
                      <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black tracking-[0.2em] border border-indigo-100 shadow-sm">
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


  return (
    <div className="relative min-h-screen">
      <div className="fixed top-24 right-10 z-30">
        <button 
          onClick={() => {
            setIsHistoryModalOpen(true);
            setHasNewReport(false);
          }}
          className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all flex items-center gap-4 active:scale-95 border-4 border-white"
        >
          <History size={22} strokeWidth={3} className="group-hover:rotate-[-10deg] transition-transform" />
          <span className="text-base tracking-tight">历史报告记录</span>
          
          {hasNewReport && (
            <div className="absolute -top-4 -right-3 px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full animate-bounce shadow-lg shadow-rose-500/40 whitespace-nowrap border-2 border-white">
              NEW REPORT
            </div>
          )}
        </button>
      </div>

      <div className={`bg-gray-50/30 p-8 pt-12 animate-in fade-in duration-500 min-h-screen`}>
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <p className="text-gray-400 text-[11px] font-black tracking-[0.2em]">
              当前品牌
            </p>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{selectedBrand}</h1>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/brandCenter/brandProfile')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm flex items-center gap-1.5 tracking-tighter"
                >
                  品牌画像
                  <ChevronRight size={10} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-500 font-bold text-sm">选择功能快速开始</p>
        </div>

        <div className="max-w-[1400px] mx-auto space-y-16">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-amber-100/50 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm border border-amber-200/50">
                  {stage.id}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{stage.title}</h2>
                <span className="text-gray-400 text-sm">{stage.subtitle}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stage.cards.map((card, idx) => {
                  const isAnalyzed = brandDetail.isAnalyzed;
                  const isDisabled = !isAnalyzed && !card.isCore;
                  const isSpecialBrandCard = card.id === 'brand-init';
                  const isMarketResearch = card.id === 'market-research';

                  return (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (isDisabled || (isMarketResearch && isMarketAnalyzing)) return;
                        if (isSpecialBrandCard) setIsUpdateModalOpen(true);
                        if (isMarketResearch && isAnalyzed) setIsMarketModalOpen(true);
                      }}
                      className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 ${
                        isDisabled
                          ? 'opacity-40 grayscale cursor-not-allowed border-gray-100' 
                          : (isMarketResearch && isMarketAnalyzing)
                            ? 'border-blue-100 shadow-sm'
                            : 'shadow-sm hover:shadow-xl hover:border-blue-100 cursor-pointer border-gray-100'
                      } ${isSpecialBrandCard && !isAnalyzed ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                    >
                      {card.badge && (
                        <div className="absolute top-4 right-4 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                          <Zap size={10} fill="currentColor" />
                          {card.badge}
                        </div>
                      )}

                      <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {card.desc}
                      </p>

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

                      {isMarketResearch && isMarketAnalyzing && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl z-10 flex flex-col items-center justify-center animate-in fade-in duration-300 overflow-hidden">
                          {isProcessMinimized ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsProcessModalOpen(true);
                                setIsProcessMinimized(false);
                              }}
                              className="flex flex-col items-center justify-center group/eye"
                            >
                              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover/eye:scale-110 group-hover/eye:bg-blue-100 transition-all shadow-sm">
                                <Eye size={24} />
                              </div>
                              <span className="text-xs font-black text-blue-600 mt-2 tracking-tighter">正在分析中...</span>
                            </button>
                          ) : (
                            <>
                              <RefreshCcw className="text-blue-600 animate-spin mb-2" size={24} />
                              <span className="text-xs font-bold text-blue-600 tracking-tighter">正在分析中...</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isUpdateModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[500px] flex flex-col animate-in zoom-in-95 duration-300 mx-6">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Create Brand Profile</h4>
              </div>
              {(brandDetail.isAnalyzed || isAnalyzing || brandDetail.url) && (
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="p-10 space-y-8">
              <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-600">i</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-indigo-900 leading-relaxed">
                  AI预计需要2-3分钟后自动完成品牌画像的分析创建
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <Globe size={12} />
                  Brand Url
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. https://www.adsgo.ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold transition-all text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 focus:bg-white outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleStartAnalysis}
                  disabled={!url.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 ${
                    url.trim() 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check size={18} strokeWidth={3} />
                  Start Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMarketModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[440px] flex flex-col animate-in zoom-in-95 duration-300 mx-6">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BarChart3 size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">市场调研报告</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                整合 World Bank、Google Trends、YouTube、Reddit 等平台数据，生成包含市场规模、增长趋势、区域分析、竞争格局、消费者触媒习惯的完整市场报告
              </p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                  <Building2 size={14} className="text-slate-400" />
                  Adsgo
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                  <Clock size={14} />
                  2-5 分钟
                </div>
              </div>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsMarketModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleStartMarketGeneration}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  开始生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isProcessModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[800px] flex flex-col animate-in zoom-in-95 duration-300 mx-6">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight">市场调研报告</h4>
                  <p className="text-[11px] text-slate-400 font-bold tracking-widest">{selectedBrand}</p>
                </div>
              </div>
              
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIsProcessModalOpen(false);
                  setIsProcessMinimized(true);
                }}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 group relative"
              >
                <Minus size={18} className="group-hover:scale-110 transition-transform" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  最小化
                </div>
              </button>
              <button 
                onClick={() => {
                  setIsProcessModalOpen(false);
                  setIsMarketAnalyzing(false);
                }}
                className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500 group relative"
              >
                <Square size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  停止分析
                </div>
              </button>
            </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
                <div>
                  <h5 className="font-black text-slate-900">正在生成市场调研</h5>
                  <p className="text-xs text-slate-400 font-bold mt-1">AI 多智能体协作分析中...</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-slate-900">📊 市场分析</span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md tracking-tighter">15%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold">搜索 企业服务/SaaS 行业数据，共 19 个维度（最近12个月）</p>
                  </div>
                  <RefreshCcw size={16} className="text-amber-500 animate-spin" />
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm opacity-60">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Compass size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-slate-900">🎯 任务协调</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold">启动 市场分析 模块</p>
                  </div>
                  <RefreshCcw size={16} className="text-slate-300 animate-spin" />
                </div>
              </div>

              <div className="pt-4 space-y-4 relative">
                <div className="absolute left-3 top-6 bottom-4 w-0.5 bg-slate-100" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-white">
                    <RefreshCcw size={12} className="animate-spin" />
                  </div>
                  <p className="text-xs font-black text-slate-900">开始分析...</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-white">
                    <RefreshCcw size={12} className="animate-spin" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">🎯 任务协调</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">启动 市场分析 模块</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-white">
                    <RefreshCcw size={12} className="animate-spin" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">📊 市场分析</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">为 Adsgo 分析市场环境 | 当前状态 | 地区: global</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[900px] flex flex-col animate-in zoom-in-95 duration-300 mx-6">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                  <History size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">历史报告记录</h4>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${isCategoryDropdownOpen ? 'bg-white border-indigo-500 text-indigo-600 shadow-lg shadow-indigo-500/10' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-200'}`}
                  >
                    <Filter size={14} className={isCategoryDropdownOpen ? 'text-indigo-500' : 'text-slate-400'} />
                    <span>{selectedCategory}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 min-w-[160px] bg-white border border-slate-100 rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {reportCategories.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-[11px] font-bold transition-colors ${selectedCategory === cat ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 tracking-widest w-[150px]">类型</th>
                    <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 tracking-widest">标题</th>
                    <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 tracking-widest w-[120px]">时间</th>
                    <th className="px-8 py-4 text-right text-[11px] font-black text-slate-400 tracking-widest w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredHistory.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 ${report.bg} ${report.color} ${report.border} border rounded-lg text-[11px] font-black whitespace-nowrap`}>
                          {report.icon}
                          {report.type}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-700 leading-relaxed">{report.title}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-400">{report.time}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setPreviewReport(report)}
                            className="p-2 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all border border-amber-100"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-slate-400 bg-white hover:bg-slate-50 rounded-lg transition-all border border-slate-200">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {previewReport && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[50] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
          <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 mx-6 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${previewReport.bg} ${previewReport.color} rounded-2xl shadow-sm`}>
                  {previewReport.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">{previewReport.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Calendar size={12} /> {previewReport.time}</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{previewReport.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(previewReport.url || 'https://www.adsgo.ai', '_blank')}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group relative"
                >
                  <ExternalLink size={22} />
                  <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    新标签页打开
                  </div>
                </button>
                <button className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group relative">
                  <Download size={24} />
                  <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    导出报告
                  </div>
                </button>
                <button 
                  onClick={() => setPreviewReport(null)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-indigo-500" size={20} />
                  <h5 className="font-black text-slate-900 text-lg">分析摘要</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: '市场健康度', value: '优秀', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: '竞争强度', value: '中等', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '增长潜力', value: '+24%', color: 'text-blue-600', bg: 'bg-blue-50' }
                  ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} p-6 rounded-3xl border border-white shadow-sm`}>
                      <p className="text-xs font-bold text-slate-400 tracking-widest mb-2">{stat.label}</p>
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  基于对该品牌近期市场表现的深度学习分析，我们发现其在社交媒体渠道的品牌提及率显著提升。竞品对比显示，品牌在“高性价比”和“设计感”两个维度的差异化优势明显，建议在下一阶段投放中加大针对年轻受众的视觉素材投入。
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="text-indigo-500" size={20} />
                  <h5 className="font-black text-slate-900 text-lg">受众画像洞察</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-400">核心受众分布</p>
                    <div className="space-y-3">
                      {[
                        { label: '18-24 岁', percent: 45 },
                        { label: '25-34 岁', percent: 35 },
                        { label: '35-44 岁', percent: 15 },
                        { label: '其他', percent: 5 },
                      ].map(item => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-600 px-1">
                            <span>{item.label}</span>
                            <span>{item.percent}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-indigo-50/30 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                      <PieChart className="text-indigo-600" size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">受众偏好：视频素材 {'〉'} 轮播素材 {'〉'} 单图</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">AI 建议增加 TikTok 短视频风格的素材投放，CTR 预计可提升 30%</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
