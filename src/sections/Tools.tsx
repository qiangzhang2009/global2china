import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Brain,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle,
  BarChart3,
  Target,
  Globe,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PRODUCT_CATEGORIES,
  getProductTypeFromCategory,
  getCategoryContextForAI,
  MARKET_REGIONS,
  getMarketsByRegion,
  ANALYSIS_MODES,
  CHINA_REGIONS,
  USER_ROLES,
  BUSINESS_STAGES,
  CORE_PAIN_POINTS,
  AnalysisMode,
  AnalysisResult,
} from '@/lib/aiAnalysis';
import { 
  trackClick, 
  trackAIStart, 
  trackAIComplete, 
  trackAIAbandon,
  trackSectionView 
} from '@/lib/tracking';

// 调用后端 API 进行 AI 分析
async function callAIAnalysisAPI(
  productType: string,
  targetRegion: string,
  mode: AnalysisMode,
  originRegion?: string,
  options?: {
    productName?: string;
    categoryLevel1Name?: string;
    categoryLevel2Name?: string;
    categoryContext?: string;
    countryName?: string;
    countryRegion?: string;
    userRole?: string;
    businessStage?: string;
    painPoints?: string[];
    language?: string;
  }
): Promise<AnalysisResult> {
  const response = await fetch('/api/ai-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productType,
      targetRegion,
      mode,
      originRegion,
      options,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'AI analysis failed');
  }

  // 解析 AI 返回的内容
  let content = data.result.content;
  
  // 如果 content 是字符串，尝试解析为 JSON
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      // 清理 AI 返回的内容
      let cleanedContent = content
        .replace(/```json\n?/g, '')  // 移除 ```json
        .replace(/```\n?/g, '')       // 移除 ```
        .replace(/^```[\s\S]*?```$/g, '') // 移除整块代码
        .replace(/「【】」/g, '')     // 移除特殊字符
        .replace(/【】/g, '')         // 移除【】
        .replace(/「」/g, '')         // 移除「」
        .replace(/\n/g, ' ')          // 替换换行为空格
        .replace(/,\s*}/g, '}')       // 修复 trailing comma
        .replace(/,\s*]/g, ']')       // 修复 trailing comma
        .trim();
      
      // 尝试提取 JSON 对象
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      // 如果解析失败，使用默认数据
      console.error('JSON parse error:', e);
      parsedContent = {
        marketDemand: {
          overall: content.substring(0, 200),
          regional: '',
          targetCustomers: '',
          growthTrend: ''
        }
      };
    }
  }

  // 确保返回的数据包含所有必要的字段
  return {
    ...parsedContent,
    content: content,
    productType: data.result.productType,
    targetRegion: data.result.targetRegion,
    mode: data.result.mode,
  };
}

gsap.registerPlugin(ScrollTrigger);

const tools = [
  {
    id: 'analysis',
    icon: Brain,
    titleKey: 'tools.analysis.title',
    descKey: 'tools.analysis.desc',
    gradient: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'compliance',
    icon: Shield,
    titleKey: 'tools.compliance.title',
    descKey: 'tools.compliance.desc',
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'supply',
    icon: Package,
    titleKey: 'tools.supply.title',
    descKey: 'tools.supply.desc',
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'profit',
    icon: TrendingUp,
    titleKey: 'tools.profit.title',
    descKey: 'tools.profit.desc',
    gradient: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'risk',
    icon: AlertTriangle,
    titleKey: 'tools.risk.title',
    descKey: 'tools.risk.desc',
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'timeline',
    icon: Clock,
    titleKey: 'tools.timeline.title',
    descKey: 'tools.timeline.desc',
    gradient: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
  },
];

const Tools = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentLanguage = i18n.language || 'zh';

  // 分析模式：卖到中国 vs 从海外采购
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('sell-to-china');
  // 选择商品分类：一级、二级
  const [productLevel1, setProductLevel1] = useState(PRODUCT_CATEGORIES[0].id);
  const [productLevel2, setProductLevel2] = useState(PRODUCT_CATEGORIES[0].children[0].id);
  // 卖到中国模式：选择目标区域（中国哪个区域）
  const [chinaRegion, setChinaRegion] = useState('east-china');
  // 从海外采购模式：选择采购来源地区
  const [sourcingRegion, setSourcingRegion] = useState('east-asia');
  const [selectedMarket, setSelectedMarket] = useState('japan');
  const [userRoleId, setUserRoleId] = useState<string>('');
  const [businessStageId, setBusinessStageId] = useState<string>('');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const currentProductCategory = PRODUCT_CATEGORIES.find((c) => c.id === productLevel1);
  const productLevel2Options = currentProductCategory?.children ?? [];
  const currentChinaRegion = CHINA_REGIONS.find((r) => r.id === chinaRegion);
  const currentSourcingRegion = MARKET_REGIONS.find((r) => r.id === sourcingRegion);
  const availableMarkets = getMarketsByRegion(sourcingRegion);

  const handleProductLevel1Change = (id: string) => {
    setProductLevel1(id);
    const cat = PRODUCT_CATEGORIES.find((c) => c.id === id);
    const firstChildId = cat?.children?.[0]?.id ?? '';
    setProductLevel2(firstChildId);
    trackClick('ai-analysis', 'select_category_l1', id);
  };

  const handleProductLevel2Change = (id: string) => {
    setProductLevel2(id);
    trackClick('ai-analysis', 'select_category_l2', id);
  };

  const handleChinaRegionChange = (regionId: string) => {
    setChinaRegion(regionId);
    trackClick('ai-analysis', 'select_china_region', regionId);
  };

  const handleSourcingRegionChange = (regionId: string) => {
    setSourcingRegion(regionId);
    const markets = getMarketsByRegion(regionId);
    const firstMarketId = markets[0]?.id ?? '';
    if (!markets.find((m: { id: string }) => m.id === selectedMarket)) {
      setSelectedMarket(firstMarketId);
    }
    trackClick('ai-analysis', 'select_sourcing_region', regionId);
  };

  const handleMarketChange = (marketId: string) => {
    setSelectedMarket(marketId);
    trackClick('ai-analysis', 'select_market', marketId);
  };

  const productTypeForApi = getProductTypeFromCategory(productLevel1, productLevel2);
  
  const currentProductL1 = PRODUCT_CATEGORIES.find(c => c.id === productLevel1);
  const currentProductL2 = currentProductL1?.children.find(c => c.id === productLevel2);
  
  const getProductName = () => currentProductL2?.name || currentProductL1?.name || '产品';
  const getCategoryLevel1Name = () => currentProductL1?.name || '';
  const getCategoryLevel2Name = () => currentProductL2?.name || getProductName();
  const getCategoryContext = () => getCategoryContextForAI(productLevel1, productLevel2);
  
  const getCountryName = () => {
    if (analysisMode === 'sourcing') {
      const market = availableMarkets.find((m: { id: string }) => m.id === selectedMarket);
      return market?.name || '';
    }
    return '';
  };
  
  const getCountryRegionName = () => {
    if (analysisMode === 'sourcing') {
      return currentSourcingRegion?.name || '';
    }
    return '';
  };

  const handleAnalyze = async () => {
    // 开始分析，发送追踪事件
    const startTime = Date.now();
    
    // 使用新的追踪工具发送AI分析开始事件
    await trackAIStart(analysisMode, {
      productType: productTypeForApi,
      productName: getProductName(),
      categoryLevel1: getCategoryLevel1Name(),
      categoryLevel2: getCategoryLevel2Name(),
      targetRegion: analysisMode === 'sell-to-china' ? chinaRegion : sourcingRegion,
      selectedMarket: analysisMode === 'sourcing' ? selectedMarket : undefined,
      userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
      businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
    });

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      let result;
      if (analysisMode === 'sell-to-china') {
        result = await callAIAnalysisAPI(
          productTypeForApi,
          chinaRegion,
          'sell-to-china',
          undefined,
          {
            productName: getProductName(),
            categoryLevel1Name: getCategoryLevel1Name(),
            categoryLevel2Name: getCategoryLevel2Name(),
            categoryContext: getCategoryContext(),
            countryRegion: getCountryRegionName(),
            userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
            businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
            painPoints: selectedPainPoints.length > 0 ? selectedPainPoints.map(id => CORE_PAIN_POINTS.find(p => p.id === id)?.name).filter(Boolean) : undefined,
            language: currentLanguage,
          }
        );
      } else {
        result = await callAIAnalysisAPI(
          productTypeForApi,
          sourcingRegion,
          'sourcing',
          sourcingRegion,
          {
            productName: getProductName(),
            categoryLevel1Name: getCategoryLevel1Name(),
            categoryLevel2Name: getCategoryLevel2Name(),
            categoryContext: getCategoryContext(),
            countryName: getCountryName(),
            countryRegion: getCountryRegionName(),
            userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
            businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
            painPoints: selectedPainPoints.length > 0 ? selectedPainPoints.map(id => CORE_PAIN_POINTS.find(p => p.id === id)?.name).filter(Boolean) : undefined,
            language: currentLanguage,
          }
        );
      }

      // 分析完成，发送追踪事件
      const duration = Date.now() - startTime;
      await trackAIComplete(analysisMode, duration, {
        productType: productTypeForApi,
        productName: getProductName(),
        categoryLevel1: getCategoryLevel1Name(),
        categoryLevel2: getCategoryLevel2Name(),
        targetRegion: analysisMode === 'sell-to-china' ? chinaRegion : sourcingRegion,
        selectedMarket: analysisMode === 'sourcing' ? selectedMarket : undefined,
        userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
        businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
        resultSummary: result ? 'completed' : 'failed',
        aiResultContent: result?.content,
        aiResultLength: result?.content?.length || 0,
      });

      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      // 分析失败，发送追踪事件
      await trackAIAbandon(analysisMode, 0, error instanceof Error ? error.message : 'unknown');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="tools" className="py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden" ref={sectionRef}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-100/50 to-emerald-100/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>{t('tools.poweredBy')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('tools.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            {t('tools.subtitle')}
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-violet-400 via-purple-500 to-emerald-400 mx-auto mt-8 rounded-full" />
        </div>

        {/* AI Analysis Tool */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Tool Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('tools.title')}</h3>
                  <p className="text-violet-200 text-sm">{t('tools.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Tool Body */}
            <div className="p-8">
              {/* 分析模式切换 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <label className="text-sm font-semibold text-gray-700">{t('tools.selectRequirement')}</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ANALYSIS_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setAnalysisMode(mode.id as AnalysisMode);
                        trackClick('ai-analysis', 'select_mode', mode.id);
                      }}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-left',
                        analysisMode === mode.id
                          ? 'border-violet-500 bg-violet-50 shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-violet-200'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{mode.icon}</span>
                        <span className={cn(
                          'font-semibold',
                          analysisMode === mode.id ? 'text-violet-700' : 'text-gray-700'
                        )}>{mode.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 您的身份与当前阶段（选填，帮助 AI 更精准） */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-violet-400 text-white text-sm font-bold flex items-center justify-center">0</span>
                  <label className="text-sm font-semibold text-gray-700">{t('tools.getBetterSuggestions')}</label>
                  <span className="text-xs text-gray-400 font-normal">{t('tools.optional')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-gray-500 block mb-2">{t('tools.yourRole')}</span>
                    <div className="flex flex-wrap gap-2">
                      {USER_ROLES.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setUserRoleId(userRoleId === role.id ? '' : role.id);
                            trackClick('ai-analysis', 'select_user_role', role.id);
                          }}
                          className={cn(
                            'px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-1.5',
                            userRoleId === role.id
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200'
                          )}
                        >
                          <span>{role.icon}</span>
                          <span>{role.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-2">{t('tools.businessStage')}</span>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_STAGES.map((stage) => (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => {
                            setBusinessStageId(businessStageId === stage.id ? '' : stage.id);
                            trackClick('ai-analysis', 'select_business_stage', stage.id);
                          }}
                          className={cn(
                            'px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-1.5',
                            businessStageId === stage.id
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200'
                          )}
                        >
                          <span>{stage.icon}</span>
                          <span>{stage.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 核心痛点/关注点选择 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center">?</span>
                    <label className="text-sm font-semibold text-gray-700">{t('tools.painPoints') || '核心关注点（可选）'}</label>
                    <span className="text-xs text-gray-400">{t('tools.painPointsHint') || '选择您最关心的问题，AI将重点分析'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CORE_PAIN_POINTS.map((point) => (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => {
                          setSelectedPainPoints(prev => 
                            prev.includes(point.id) 
                              ? prev.filter(id => id !== point.id)
                              : [...prev, point.id]
                          );
                          trackClick('ai-analysis', 'select_pain_point', point.id);
                        }}
                        className={cn(
                          'px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-1.5',
                          selectedPainPoints.includes(point.id)
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200'
                        )}
                      >
                        <span>{point.icon}</span>
                        <span>{point.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 选择商品分类：一级 -> 二级 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">1</span>
                  <label className="text-sm font-semibold text-gray-700">{t('tools.selectCategory')}</label>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-500 block mb-2">{t('tools.l1Category')}</span>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleProductLevel1Change(cat.id)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2',
                          productLevel1 === cat.id
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'
                        )}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-2">{t('tools.l2Category')}</span>
                  <div className="flex flex-wrap gap-2">
                    {productLevel2Options.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleProductLevel2Change(item.id)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2',
                          productLevel2 === item.id
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'
                        )}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 选择目标市场：根据模式显示不同内容 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">2</span>
                  <label className="text-sm font-semibold text-gray-700">
                    {analysisMode === 'sell-to-china' ? t('tools.targetRegion') : t('tools.sourcingRegion')}
                  </label>
                </div>

                {/* 卖到中国模式：选择想卖到中国的哪个区域 */}
                {analysisMode === 'sell-to-china' ? (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 block mb-2">{analysisMode === 'sell-to-china' ? t('tools.sellToChina.region') : t('tools.sourcing.region')}</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {CHINA_REGIONS.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => handleChinaRegionChange(region.id)}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            chinaRegion === region.id
                              ? 'border-violet-500 bg-violet-50 shadow-md'
                              : 'border-gray-100 bg-gray-50 hover:border-violet-200'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{region.icon}</span>
                            <span className={cn(
                              'font-semibold',
                              chinaRegion === region.id ? 'text-violet-700' : 'text-gray-700'
                            )}>{region.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{region.cities}</div>
                          <div className="text-xs text-gray-400">{region.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 从海外采购模式：选择从哪个地区采购 */
                  <>
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 block mb-2">{t('tools.sourcing.region')}</span>
                      <div className="flex flex-wrap gap-2">
                        {MARKET_REGIONS.map((region) => (
                          <button
                            key={region.id}
                        onClick={() => handleSourcingRegionChange(region.id)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2',
                              sourcingRegion === region.id
                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'
                            )}
                          >
                            <span className="text-base">{region.icon}</span>
                            <span>{region.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* 具体采购来源国家 */}
                    <div>
                      <span className="text-xs text-gray-500 block mb-2">
                        {currentSourcingRegion?.name}{t('tools.region.source')}
                      </span>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableMarkets.map((market: { id: string; name: string; flag: string; tag?: string }) => (
                          <button
                            key={market.id}
                            onClick={() => handleMarketChange(market.id)}
                            className={cn(
                              'px-3 py-3 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center gap-1 relative',
                              selectedMarket === market.id
                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'
                            )}
                          >
                            <span className="text-xl">{market.flag}</span>
                            <span className="text-xs">{market.name}</span>
                            {market.tag && (
                              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] bg-violet-500 text-white rounded-full font-medium">
                                {market.tag}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('tools.analyzing')}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>{t('tools.startAnalysis')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="border-t border-gray-100 p-8 bg-gradient-to-b from-white to-violet-50/30">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-lg font-bold text-gray-900">{t('tools.analysisResult')}</h4>
                  <span className="text-xs text-gray-400 ml-2">
                    ({analysisMode === 'sell-to-china' ? `${t('tools.target')}: ${currentChinaRegion?.name}` : `${t('tools.sourcingFrom')}: ${getCountryName() || currentSourcingRegion?.name}`})
                  </span>
                </div>

                {/* 市场需求分析 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-semibold text-gray-500">{t('tools.demandAnalysis')}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-violet-50 rounded-lg p-3">
                      <span className="text-xs text-violet-600 font-medium">总体评估</span>
                      <p className="text-gray-900 text-sm mt-1">{analysisResult.marketDemand?.overall}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 font-medium">{t('tools.regionAnalysis')}</span>
                        <p className="text-gray-900 text-sm mt-1">{analysisResult.marketDemand?.regional}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 font-medium">目标客户</span>
                        <p className="text-gray-900 text-sm mt-1">{analysisResult.marketDemand?.targetCustomers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 竞争分析与定价 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 竞争程度 */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-500">竞争分析</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: i <= (analysisResult.competition?.level === '高' ? 3 : analysisResult.competition?.level === '中' ? 2 : 1)
                                ? (analysisResult.competition?.level === '高' ? '#ef4444' : analysisResult.competition?.level === '中' ? '#f59e0b' : '#10b981')
                                : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{analysisResult.competition?.level}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">{t('tools.mainCompetitors')}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysisResult.competition?.mainCompetitors?.map((comp: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('tools.differentiation')}</span>
                        <p className="text-xs text-gray-700 mt-1">{analysisResult.competition?.differentiation}</p>
                      </div>
                    </div>
                  </div>

                  {/* 定价策略 */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-500">定价策略</span>
                    </div>
                    <p className="text-gray-900 font-bold text-lg mb-2">
                      {analysisResult.pricing?.recommendedRange}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('tools.costBreakdown')}</span>
                        <span className="text-gray-700">{analysisResult.pricing?.costBreakdown}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('tools.profitMargin')}</span>
                        <span className="text-emerald-600 font-semibold">{analysisResult.pricing?.margin}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 时间周期 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">时间规划</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-xs text-blue-600 font-medium">
                        {analysisMode === 'sell-to-china' ? '进口清关' : '采购到货'}
                      </span>
                      <p className="text-gray-900 font-bold text-lg mt-1">{analysisResult.timeline?.import}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-xs text-blue-600 font-medium">
                        {analysisMode === 'sell-to-china' ? '市场进入' : '首批上架'}
                      </span>
                      <p className="text-gray-900 font-bold text-lg mt-1">{analysisResult.timeline?.marketEntry}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-xs text-blue-600 font-medium">投资回报周期</span>
                      <p className="text-gray-900 font-bold text-lg mt-1">{analysisResult.timeline?.roi}</p>
                    </div>
                  </div>
                </div>

                {/* 风险评估 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-gray-900">风险与挑战</span>
                    </div>
                    <span className={cn('px-3 py-1 rounded-full text-sm font-semibold', 
                      analysisResult.challenges?.level === '低' ? 'text-emerald-600 bg-emerald-100' :
                      analysisResult.challenges?.level === '中' ? 'text-amber-600 bg-amber-100' :
                      'text-red-600 bg-red-100'
                    )}>
                      {analysisResult.challenges?.level}风险
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">{t('tools.challenges')}</span>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.challenges?.mainRisks?.map((risk: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                            {risk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">{t('tools.suggestions')}</span>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.challenges?.mitigation?.map((item: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 合规要求 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">合规要求</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 mb-2 block">{t('tools.requiredQualifications')}</span>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.compliance?.certifications?.map((cert: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 mb-2 block">{t('tools.labelRequirements')}</span>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.compliance?.labeling?.map((label: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 mb-2 block">{t('tools.testingRequirements')}</span>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.compliance?.testing?.map((test: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 行动建议 */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold">行动计划</span>
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                      {analysisResult.actionPlan?.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-violet-200 text-xs mb-2 block">下一步行动</span>
                      <ul className="space-y-1">
                        {analysisResult.actionPlan?.nextSteps?.map((step: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-violet-300 font-bold">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-violet-200 text-xs mb-2 block">成功关键因素</span>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.actionPlan?.keySuccessFactors?.map((factor: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 联系我们区块 */}
                {analysisResult.contactUs && (
                  <div className="mt-8">
                    {/* 价值引导主标题 */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {currentLanguage === 'zh' ? '我们能为您做什么？' : 'What We Can Do For You?'}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {currentLanguage === 'zh' 
                          ? '从产品准入到市场销售，我们提供全流程服务' 
                          : 'From product compliance to market sales, we provide full-process services'}
                      </p>
                    </div>

                    {/* 四大核心价值卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* 问题 - 我们能解决的问题 */}
                      {analysisResult.contactUs.valueProposition?.problems && (
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5 border border-red-100">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">😰</span>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {currentLanguage === 'zh' ? '您可能面临的问题' : 'Problems You May Face'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {analysisResult.contactUs.valueProposition.problems.slice(0, 4).map((problem, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-red-400 mt-0.5">•</span>
                                {problem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 服务 - 我们提供的服务 */}
                      {analysisResult.contactUs.valueProposition?.services && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🛠️</span>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {currentLanguage === 'zh' ? '我们提供的服务' : 'Services We Provide'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {analysisResult.contactUs.valueProposition.services.slice(0, 4).map((service, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-blue-500 mt-0.5">✓</span>
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 价值 - 用户获得的价值 */}
                      {analysisResult.contactUs.valueProposition?.benefits && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">✨</span>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {currentLanguage === 'zh' ? '您将获得的价值' : 'Value You Will Get'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {analysisResult.contactUs.valueProposition.benefits.slice(0, 4).map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-green-500 mt-0.5">★</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 流程 - 服务流程 */}
                      {analysisResult.contactUs.valueProposition?.process && (
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🚀</span>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {currentLanguage === 'zh' ? '服务流程' : 'Service Process'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {analysisResult.contactUs.valueProposition.process.slice(0, 4).map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {idx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* 行动号召 */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">💼</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {analysisResult.contactUs.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {analysisResult.contactUs.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <a
                              href="#contact"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                            >
                              {analysisResult.contactUs.cta}
                              <ArrowRight className="w-4 h-4" />
                            </a>
                            <span className="text-xs text-gray-500">
                              {analysisResult.contactUs.事务所名称}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tools Grid - Temporarily hidden */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-violet-200 animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500',
                tool.gradient
              )}>
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t(tool.titleKey)}
              </h3>
              <p className="text-gray-500 mb-4 leading-relaxed">
                {t(tool.descKey)}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all"
              >
                {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Tools;
