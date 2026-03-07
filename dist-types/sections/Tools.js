import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, TrendingUp, Shield, Clock, Zap, Package, ArrowRight, Loader2, CheckCircle, BarChart3, Target, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeWithAI, PRODUCT_CATEGORIES, getProductTypeFromCategory, getCategoryContextForAI, MARKET_REGIONS, getMarketsByRegion, ANALYSIS_MODES, CHINA_REGIONS, USER_ROLES, BUSINESS_STAGES, } from '@/lib/aiAnalysis';
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
    const sectionRef = useRef(null);
    const currentLanguage = i18n.language || 'zh';
    // 分析模式：卖到中国 vs 从海外采购
    const [analysisMode, setAnalysisMode] = useState('sell-to-china');
    // 选择商品分类：一级、二级
    const [productLevel1, setProductLevel1] = useState(PRODUCT_CATEGORIES[0].id);
    const [productLevel2, setProductLevel2] = useState(PRODUCT_CATEGORIES[0].children[0].id);
    // 卖到中国模式：选择目标区域（中国哪个区域）
    const [chinaRegion, setChinaRegion] = useState('east-china');
    // 从海外采购模式：选择采购来源地区
    const [sourcingRegion, setSourcingRegion] = useState('east-asia');
    const [selectedMarket, setSelectedMarket] = useState('japan');
    const [userRoleId, setUserRoleId] = useState('');
    const [businessStageId, setBusinessStageId] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const currentProductCategory = PRODUCT_CATEGORIES.find((c) => c.id === productLevel1);
    const productLevel2Options = currentProductCategory?.children ?? [];
    const currentChinaRegion = CHINA_REGIONS.find((r) => r.id === chinaRegion);
    const currentSourcingRegion = MARKET_REGIONS.find((r) => r.id === sourcingRegion);
    const availableMarkets = getMarketsByRegion(sourcingRegion);
    const handleProductLevel1Change = (id) => {
        setProductLevel1(id);
        const cat = PRODUCT_CATEGORIES.find((c) => c.id === id);
        const firstChildId = cat?.children?.[0]?.id ?? '';
        setProductLevel2(firstChildId);
    };
    const handleChinaRegionChange = (regionId) => {
        setChinaRegion(regionId);
    };
    const handleSourcingRegionChange = (regionId) => {
        setSourcingRegion(regionId);
        const markets = getMarketsByRegion(regionId);
        const firstMarketId = markets[0]?.id ?? '';
        if (!markets.find((m) => m.id === selectedMarket)) {
            setSelectedMarket(firstMarketId);
        }
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
            const market = availableMarkets.find((m) => m.id === selectedMarket);
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
        // 等待追踪脚本加载的辅助函数
        const waitForTracker = (retries = 10) => {
            return new Promise((resolve) => {
                const check = (attempt) => {
                    if (window.zxqTrack) {
                        resolve(window.zxqTrack);
                    }
                    else if (attempt < retries) {
                        setTimeout(() => check(attempt + 1), 100);
                    }
                    else {
                        resolve(null);
                    }
                };
                check(0);
            });
        };
        // 开始分析，发送追踪事件
        const startTime = Date.now();
        const tracker = await waitForTracker();
        if (tracker) {
            tracker.toolStart('ai-analysis', {
                analysis_mode: analysisMode,
                product_type: productTypeForApi,
                target_region: analysisMode === 'sell-to-china' ? chinaRegion : sourcingRegion,
                selected_market: analysisMode === 'sourcing' ? selectedMarket : undefined,
                user_role: userRoleId,
                business_stage: businessStageId,
            });
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            let result;
            if (analysisMode === 'sell-to-china') {
                result = await analyzeWithAI(productTypeForApi, chinaRegion, 'sell-to-china', undefined, {
                    productName: getProductName(),
                    categoryLevel1Name: getCategoryLevel1Name(),
                    categoryLevel2Name: getCategoryLevel2Name(),
                    categoryContext: getCategoryContext(),
                    countryRegion: getCountryRegionName(),
                    userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
                    businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
                    language: currentLanguage,
                });
            }
            else {
                result = await analyzeWithAI(productTypeForApi, sourcingRegion, 'sourcing', sourcingRegion, {
                    productName: getProductName(),
                    categoryLevel1Name: getCategoryLevel1Name(),
                    categoryLevel2Name: getCategoryLevel2Name(),
                    categoryContext: getCategoryContext(),
                    countryName: getCountryName(),
                    countryRegion: getCountryRegionName(),
                    userRole: userRoleId ? USER_ROLES.find((r) => r.id === userRoleId)?.name : undefined,
                    businessStage: businessStageId ? BUSINESS_STAGES.find((s) => s.id === businessStageId)?.name : undefined,
                    language: currentLanguage,
                });
            }
            // 分析完成，发送追踪事件
            const duration = Date.now() - startTime;
            if (tracker) {
                tracker.toolComplete('ai-analysis', {
                    analysis_mode: analysisMode,
                    product_type: productTypeForApi,
                    target_region: analysisMode === 'sell-to-china' ? chinaRegion : sourcingRegion,
                    selected_market: analysisMode === 'sourcing' ? selectedMarket : undefined,
                    result_summary: result ? 'completed' : 'failed',
                }, duration);
            }
            setAnalysisResult(result);
        }
        catch (error) {
            console.error('Analysis error:', error);
            // 分析失败，发送追踪事件
            if (tracker) {
                tracker.toolAbandon('ai-analysis', 0, 1);
            }
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    return (_jsxs("section", { id: "tools", className: "py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden", ref: sectionRef, children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx("div", { className: "absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-100/50 to-emerald-100/50 rounded-full blur-3xl" })] }), _jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsxs("div", { className: "text-center mb-20 animate-on-scroll", children: [_jsxs("div", { className: "inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm", children: [_jsx(Sparkles, { className: "w-4 h-4" }), _jsx("span", { children: t('tools.poweredBy') })] }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight", style: { fontFamily: 'Noto Serif SC, serif' }, children: t('tools.title') }), _jsx("p", { className: "text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed", children: t('tools.subtitle') }), _jsx("div", { className: "w-32 h-1.5 bg-gradient-to-r from-violet-400 via-purple-500 to-emerald-400 mx-auto mt-8 rounded-full" })] }), _jsx("div", { className: "max-w-5xl mx-auto mb-20", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center", children: _jsx(Brain, { className: "w-7 h-7 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-white", children: t('tools.title') }), _jsx("p", { className: "text-violet-200 text-sm", children: t('tools.subtitle') })] })] }) }), _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Sparkles, { className: "w-5 h-5 text-violet-600" }), _jsx("label", { className: "text-sm font-semibold text-gray-700", children: t('tools.selectRequirement') })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: ANALYSIS_MODES.map((mode) => (_jsxs("button", { onClick: () => setAnalysisMode(mode.id), className: cn('p-4 rounded-xl border-2 transition-all text-left', analysisMode === mode.id
                                                            ? 'border-violet-500 bg-violet-50 shadow-md'
                                                            : 'border-gray-100 bg-gray-50 hover:border-violet-200'), children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-2xl", children: mode.icon }), _jsx("span", { className: cn('font-semibold', analysisMode === mode.id ? 'text-violet-700' : 'text-gray-700'), children: mode.name })] }), _jsx("p", { className: "text-xs text-gray-500", children: mode.desc })] }, mode.id))) })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("span", { className: "w-6 h-6 rounded-full bg-violet-400 text-white text-sm font-bold flex items-center justify-center", children: "0" }), _jsx("label", { className: "text-sm font-semibold text-gray-700", children: t('tools.getBetterSuggestions') }), _jsx("span", { className: "text-xs text-gray-400 font-normal", children: t('tools.optional') })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: t('tools.yourRole') }), _jsx("div", { className: "flex flex-wrap gap-2", children: USER_ROLES.map((role) => (_jsxs("button", { type: "button", onClick: () => setUserRoleId(userRoleId === role.id ? '' : role.id), className: cn('px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-1.5', userRoleId === role.id
                                                                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200'), children: [_jsx("span", { children: role.icon }), _jsx("span", { children: role.name })] }, role.id))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: t('tools.businessStage') }), _jsx("div", { className: "flex flex-wrap gap-2", children: BUSINESS_STAGES.map((stage) => (_jsxs("button", { type: "button", onClick: () => setBusinessStageId(businessStageId === stage.id ? '' : stage.id), className: cn('px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-1.5', businessStageId === stage.id
                                                                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200'), children: [_jsx("span", { children: stage.icon }), _jsx("span", { children: stage.name })] }, stage.id))) })] })] })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("span", { className: "w-6 h-6 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center", children: "1" }), _jsx("label", { className: "text-sm font-semibold text-gray-700", children: t('tools.selectCategory') })] }), _jsxs("div", { className: "mb-3", children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: t('tools.l1Category') }), _jsx("div", { className: "flex flex-wrap gap-2", children: PRODUCT_CATEGORIES.map((cat) => (_jsxs("button", { onClick: () => handleProductLevel1Change(cat.id), className: cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2', productLevel1 === cat.id
                                                                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'), children: [_jsx("span", { className: "text-base", children: cat.icon }), _jsx("span", { children: cat.name })] }, cat.id))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: t('tools.l2Category') }), _jsx("div", { className: "flex flex-wrap gap-2", children: productLevel2Options.map((item) => (_jsx("button", { onClick: () => setProductLevel2(item.id), className: cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2', productLevel2 === item.id
                                                                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'), children: item.name }, item.id))) })] })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("span", { className: "w-6 h-6 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center", children: "2" }), _jsx("label", { className: "text-sm font-semibold text-gray-700", children: analysisMode === 'sell-to-china' ? t('tools.targetRegion') : t('tools.sourcingRegion') })] }), analysisMode === 'sell-to-china' ? (_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: analysisMode === 'sell-to-china' ? t('tools.sellToChina.region') : t('tools.sourcing.region') }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: CHINA_REGIONS.map((region) => (_jsxs("button", { onClick: () => handleChinaRegionChange(region.id), className: cn('p-4 rounded-xl border-2 transition-all text-left', chinaRegion === region.id
                                                                    ? 'border-violet-500 bg-violet-50 shadow-md'
                                                                    : 'border-gray-100 bg-gray-50 hover:border-violet-200'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-lg", children: region.icon }), _jsx("span", { className: cn('font-semibold', chinaRegion === region.id ? 'text-violet-700' : 'text-gray-700'), children: region.name })] }), _jsx("div", { className: "text-xs text-gray-500 mb-1", children: region.cities }), _jsx("div", { className: "text-xs text-gray-400", children: region.desc })] }, region.id))) })] })) : (
                                                /* 从海外采购模式：选择从哪个地区采购 */
                                                _jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "text-xs text-gray-500 block mb-2", children: t('tools.sourcing.region') }), _jsx("div", { className: "flex flex-wrap gap-2", children: MARKET_REGIONS.map((region) => (_jsxs("button", { onClick: () => handleSourcingRegionChange(region.id), className: cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2', sourcingRegion === region.id
                                                                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'), children: [_jsx("span", { className: "text-base", children: region.icon }), _jsx("span", { children: region.name })] }, region.id))) })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-xs text-gray-500 block mb-2", children: [currentSourcingRegion?.name, t('tools.region.source')] }), _jsx("div", { className: "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3", children: availableMarkets.map((market) => (_jsxs("button", { onClick: () => setSelectedMarket(market.id), className: cn('px-3 py-3 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center gap-1 relative', selectedMarket === market.id
                                                                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-violet-200 hover:bg-violet-25'), children: [_jsx("span", { className: "text-xl", children: market.flag }), _jsx("span", { className: "text-xs", children: market.name }), market.tag && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] bg-violet-500 text-white rounded-full font-medium", children: market.tag }))] }, market.id))) })] })] }))] }), _jsx("button", { onClick: handleAnalyze, disabled: isAnalyzing, className: "w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), _jsx("span", { children: t('tools.analyzing') })] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-5 h-5" }), _jsx("span", { children: t('tools.startAnalysis') })] })) })] }), analysisResult && (_jsxs("div", { className: "border-t border-gray-100 p-8 bg-gradient-to-b from-white to-violet-50/30", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-emerald-500" }), _jsx("h4", { className: "text-lg font-bold text-gray-900", children: t('tools.analysisResult') }), _jsxs("span", { className: "text-xs text-gray-400 ml-2", children: ["(", analysisMode === 'sell-to-china' ? `${t('tools.target')}: ${currentChinaRegion?.name}` : `${t('tools.sourcingFrom')}: ${getCountryName() || currentSourcingRegion?.name}`, ")"] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(BarChart3, { className: "w-5 h-5 text-violet-600" }), _jsx("span", { className: "text-sm font-semibold text-gray-500", children: t('tools.demandAnalysis') })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-violet-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-violet-600 font-medium", children: "\u603B\u4F53\u8BC4\u4F30" }), _jsx("p", { className: "text-gray-900 text-sm mt-1", children: analysisResult.marketDemand?.overall })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-gray-500 font-medium", children: t('tools.regionAnalysis') }), _jsx("p", { className: "text-gray-900 text-sm mt-1", children: analysisResult.marketDemand?.regional })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-gray-500 font-medium", children: "\u76EE\u6807\u5BA2\u6237" }), _jsx("p", { className: "text-gray-900 text-sm mt-1", children: analysisResult.marketDemand?.targetCustomers })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Target, { className: "w-5 h-5 text-purple-600" }), _jsx("span", { className: "text-sm font-medium text-gray-500", children: "\u7ADE\u4E89\u5206\u6790" })] }), _jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "flex gap-1", children: [1, 2, 3].map((i) => (_jsx("div", { className: "w-3 h-3 rounded-full", style: {
                                                                            backgroundColor: i <= (analysisResult.competition?.level === '高' ? 3 : analysisResult.competition?.level === '中' ? 2 : 1)
                                                                                ? (analysisResult.competition?.level === '高' ? '#ef4444' : analysisResult.competition?.level === '中' ? '#f59e0b' : '#10b981')
                                                                                : '#e5e7eb'
                                                                        } }, i))) }), _jsx("span", { className: "font-semibold text-gray-900", children: analysisResult.competition?.level })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: t('tools.mainCompetitors') }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: analysisResult.competition?.mainCompetitors?.map((comp, idx) => (_jsx("span", { className: "px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs", children: comp }, idx))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: t('tools.differentiation') }), _jsx("p", { className: "text-xs text-gray-700 mt-1", children: analysisResult.competition?.differentiation })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-emerald-600" }), _jsx("span", { className: "text-sm font-medium text-gray-500", children: "\u5B9A\u4EF7\u7B56\u7565" })] }), _jsx("p", { className: "text-gray-900 font-bold text-lg mb-2", children: analysisResult.pricing?.recommendedRange }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: t('tools.costBreakdown') }), _jsx("span", { className: "text-gray-700", children: analysisResult.pricing?.costBreakdown })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: t('tools.profitMargin') }), _jsx("span", { className: "text-emerald-600 font-semibold", children: analysisResult.pricing?.margin })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Clock, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: "\u65F6\u95F4\u89C4\u5212" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-blue-600 font-medium", children: analysisMode === 'sell-to-china' ? '进口清关' : '采购到货' }), _jsx("p", { className: "text-gray-900 font-bold text-lg mt-1", children: analysisResult.timeline?.import })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-blue-600 font-medium", children: analysisMode === 'sell-to-china' ? '市场进入' : '首批上架' }), _jsx("p", { className: "text-gray-900 font-bold text-lg mt-1", children: analysisResult.timeline?.marketEntry })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-3", children: [_jsx("span", { className: "text-xs text-blue-600 font-medium", children: "\u6295\u8D44\u56DE\u62A5\u5468\u671F" }), _jsx("p", { className: "text-gray-900 font-bold text-lg mt-1", children: analysisResult.timeline?.roi })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-amber-600" }), _jsx("span", { className: "font-semibold text-gray-900", children: "\u98CE\u9669\u4E0E\u6311\u6218" })] }), _jsxs("span", { className: cn('px-3 py-1 rounded-full text-sm font-semibold', analysisResult.challenges?.level === '低' ? 'text-emerald-600 bg-emerald-100' :
                                                                analysisResult.challenges?.level === '中' ? 'text-amber-600 bg-amber-100' :
                                                                    'text-red-600 bg-red-100'), children: [analysisResult.challenges?.level, "\u98CE\u9669"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-500 mb-2 block", children: t('tools.challenges') }), _jsx("div", { className: "flex flex-wrap gap-2", children: analysisResult.challenges?.mainRisks?.map((risk, i) => (_jsx("span", { className: "px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium", children: risk }, i))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-500 mb-2 block", children: t('tools.suggestions') }), _jsx("div", { className: "flex flex-wrap gap-2", children: analysisResult.challenges?.mitigation?.map((item, i) => (_jsx("span", { className: "px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium", children: item }, i))) })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "font-semibold text-gray-900", children: "\u5408\u89C4\u8981\u6C42" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 mb-2 block", children: t('tools.requiredQualifications') }), _jsx("div", { className: "flex flex-wrap gap-1", children: analysisResult.compliance?.certifications?.map((cert, i) => (_jsx("span", { className: "px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium", children: cert }, i))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 mb-2 block", children: t('tools.labelRequirements') }), _jsx("div", { className: "flex flex-wrap gap-1", children: analysisResult.compliance?.labeling?.map((label, i) => (_jsx("span", { className: "px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium", children: label }, i))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500 mb-2 block", children: t('tools.testingRequirements') }), _jsx("div", { className: "flex flex-wrap gap-1", children: analysisResult.compliance?.testing?.map((test, i) => (_jsx("span", { className: "px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium", children: test }, i))) })] })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold", children: "\u884C\u52A8\u8BA1\u5212" })] }), _jsx("span", { className: "px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium", children: analysisResult.actionPlan?.priority })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-violet-200 text-xs mb-2 block", children: "\u4E0B\u4E00\u6B65\u884C\u52A8" }), _jsx("ul", { className: "space-y-1", children: analysisResult.actionPlan?.nextSteps?.map((step, i) => (_jsxs("li", { className: "text-sm flex items-start gap-2", children: [_jsxs("span", { className: "text-violet-300 font-bold", children: [i + 1, "."] }), _jsx("span", { children: step })] }, i))) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-violet-200 text-xs mb-2 block", children: "\u6210\u529F\u5173\u952E\u56E0\u7D20" }), _jsx("div", { className: "flex flex-wrap gap-2", children: analysisResult.actionPlan?.keySuccessFactors?.map((factor, i) => (_jsx("span", { className: "px-2 py-1 bg-white/20 backdrop-blur rounded text-xs", children: factor }, i))) })] })] })] }), analysisResult.contactUs && (_jsx("div", { className: "mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCBC" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-lg font-bold text-gray-900 mb-2", children: analysisResult.contactUs.title }), _jsx("p", { className: "text-gray-600 text-sm mb-4 leading-relaxed", children: analysisResult.contactUs.description }), _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("a", { href: "#contact", className: "inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all", children: [analysisResult.contactUs.cta, _jsx(ArrowRight, { className: "w-4 h-4" })] }), _jsx("span", { className: "text-xs text-gray-500", children: analysisResult.contactUs.事务所名称 })] })] })] }) }))] }))] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: tools.map((tool, index) => (_jsxs("div", { className: "group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-violet-200 animate-on-scroll", style: { animationDelay: `${index * 0.1}s` }, children: [_jsx("div", { className: cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500', tool.gradient), children: _jsx(tool.icon, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: t(tool.titleKey) }), _jsx("p", { className: "text-gray-500 mb-4 leading-relaxed", children: t(tool.descKey) }), _jsxs("a", { href: "#contact", className: "inline-flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all", children: [t('common.learnMore'), " ", _jsx(ArrowRight, { className: "w-4 h-4" })] })] }, tool.id))) })] })] }));
};
export default Tools;
