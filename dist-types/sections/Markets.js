import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
const markets = [
    {
        id: 'japan',
        name: '日本',
        flag: '🇯🇵',
        desc: '高品质消费品、化妆品、保健品',
        descEn: 'High-quality consumer goods, cosmetics, health products',
        color: 'from-pink-400 to-rose-500',
        bgColor: 'bg-pink-50',
        hoverColor: 'hover:from-pink-400 hover:to-rose-500',
    },
    {
        id: 'europe',
        name: '欧洲',
        flag: '🇪🇺',
        desc: '奢侈品、母婴用品、葡萄酒',
        descEn: 'Luxury goods, baby products, wine',
        color: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-blue-50',
        hoverColor: 'hover:from-blue-400 hover:to-indigo-500',
    },
    {
        id: 'southeast',
        name: '东南亚',
        flag: '🌏',
        desc: '热带水果、特色食品、纺织品',
        descEn: 'Tropical fruits, specialty foods, textiles',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-50',
        hoverColor: 'hover:from-yellow-400 hover:to-orange-500',
    },
    {
        id: 'australia',
        name: '澳大利亚',
        flag: '🇦🇺',
        desc: '保健品、奶粉、乳制品',
        descEn: 'Health products, milk powder, dairy products',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-50',
        hoverColor: 'hover:from-green-400 hover:to-emerald-500',
    },
    {
        id: 'usa',
        name: '美国',
        flag: '🇺🇸',
        desc: '科技产品、健康食品、日用品',
        descEn: 'Technology products, healthy food, daily necessities',
        color: 'from-purple-400 to-violet-500',
        bgColor: 'bg-purple-50',
        hoverColor: 'hover:from-purple-400 hover:to-violet-500',
    },
    {
        id: 'korea',
        name: '韩国',
        flag: '🇰🇷',
        desc: '美妆产品、电子产品、时尚服饰',
        descEn: 'Beauty products, electronics, fashion apparel',
        color: 'from-rose-400 to-pink-500',
        bgColor: 'bg-rose-50',
        hoverColor: 'hover:from-rose-400 hover:to-pink-500',
    },
    {
        id: 'newzealand',
        name: '新西兰',
        flag: '🇳🇿',
        desc: '优质乳制品、保健品、蜂蜜',
        descEn: 'Premium dairy, health products, honey',
        color: 'from-teal-400 to-cyan-500',
        bgColor: 'bg-teal-50',
        hoverColor: 'hover:from-teal-400 hover:to-cyan-500',
    },
    {
        id: 'canada',
        name: '加拿大',
        flag: '🇨🇦',
        desc: '冰酒、枫糖浆、农产品',
        descEn: 'Ice wine, maple syrup, agricultural products',
        color: 'from-red-400 to-orange-500',
        bgColor: 'bg-red-50',
        hoverColor: 'hover:from-red-400 hover:to-orange-500',
    },
];
const Markets = () => {
    const { t } = useTranslation();
    return (_jsxs("section", { id: "markets", className: "py-24 bg-white relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    } }) }), _jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsxs("div", { className: "text-center mb-16 animate-on-scroll", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", style: { fontFamily: 'Noto Serif SC, serif' }, children: t('markets.title') }), _jsx("p", { className: "text-xl text-gray-500 max-w-2xl mx-auto", children: t('markets.subtitle') }), _jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-6 rounded-full" })] }), _jsx("div", { className: "rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-12 max-w-4xl mx-auto", children: _jsx("img", { src: "/images/landscape-markets.png", alt: "", className: "w-full h-48 md:h-56 object-cover object-center" }) }), _jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [_jsx("span", { className: "text-2xl", children: "\uD83C\uDF0D" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "\u5168\u7403\u91C7\u8D2D\u6765\u6E90" }), _jsx("span", { className: "text-sm text-gray-500", children: "(\u4ECE\u8FD9\u4E9B\u56FD\u5BB6/\u5730\u533A\u8FDB\u53E3)" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: markets.map((market, index) => (_jsxs("div", { className: "group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 animate-on-scroll", style: { animationDelay: `${index * 0.1}s` }, children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${market.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500` }), _jsxs("div", { className: `relative ${market.bgColor} group-hover:bg-transparent p-6 min-h-[180px] flex flex-col justify-between transition-colors duration-500`, children: [_jsxs("div", { children: [_jsx("div", { className: "text-4xl mb-3", children: market.flag }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300", children: t(`markets.${market.id}`) }), _jsx("p", { className: "text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300", children: t(`markets.${market.id}.desc`) })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0", children: [_jsx("span", { children: t('common.learnMore') }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }, market.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [_jsx("span", { className: "text-2xl", children: "\uD83C\uDFE0" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "\u76EE\u6807\u9500\u552E\u533A\u57DF" }), _jsx("span", { className: "text-sm text-gray-500", children: "(\u60A8\u7684\u4EA7\u54C1\u60F3\u5356\u5230\u4E2D\u56FD\u54EA\u91CC\uFF1F)" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                                    { id: 'east-china', name: '华东地区', cities: '上海、江苏、浙江', desc: '经济发达，消费力强，进口商品认可度高', icon: '🏙️', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50' },
                                    { id: 'south-china', name: '华南地区', cities: '广东、福建、广西', desc: '对外贸易活跃，物流便利，渠道丰富', icon: '🌴', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50' },
                                    { id: 'north-china', name: '华北地区', cities: '北京、天津、河北', desc: '政治文化中心，高端消费市场', icon: '🏯', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50' },
                                    { id: 'southwest', name: '西南地区', cities: '四川、重庆、云南', desc: '新兴消费市场，增长潜力大', icon: '🏔️', color: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
                                    { id: 'central', name: '华中地区', cities: '湖北、湖南、河南', desc: '人口众多，市场潜力大', icon: '🏢', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50' },
                                    { id: 'national', name: '全国范围', cities: '覆盖全国', desc: '全渠道布局，最大化市场覆盖', icon: '🗺️', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50' },
                                ].map((region, index) => (_jsxs("div", { className: "group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 animate-on-scroll p-6", style: { animationDelay: `${index * 0.1}s` }, children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${region.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500` }), _jsx("div", { className: `relative ${region.bg} group-hover:bg-transparent p-4 min-h-[140px] flex flex-col justify-between transition-colors duration-500`, children: _jsxs("div", { children: [_jsx("div", { className: "text-3xl mb-2", children: region.icon }), _jsx("h4", { className: "text-lg font-bold text-gray-900 mb-1 group-hover:text-white transition-colors", children: region.name }), _jsx("p", { className: "text-xs text-gray-500 mb-1", children: region.cities }), _jsx("p", { className: "text-sm text-gray-600 group-hover:text-white/90 transition-colors", children: region.desc })] }) })] }, region.id))) })] })] })] }));
};
export default Markets;
