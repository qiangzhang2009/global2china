import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Star, Globe, Package, TrendingUp } from 'lucide-react';
const Hero = () => {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const badgeRef = useRef(null);
    const featuresRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([badgeRef.current, titleRef.current, descRef.current, ctaRef.current, featuresRef.current], {
                opacity: 0,
                y: 30,
            });
            const tl = gsap.timeline({ delay: 0.3 });
            tl.to(badgeRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
            })
                .to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            }, '-=0.3')
                .to(descRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
            }, '-=0.4')
                .to(ctaRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
            }, '-=0.3')
                .to(featuresRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
            }, '-=0.4');
        }, heroRef);
        return () => ctx.revert();
    }, []);
    const scrollToContact = () => {
        const element = document.querySelector('#contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToTools = () => {
        const element = document.querySelector('#tools');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToServices = () => {
        const element = document.querySelector('#services');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (_jsxs("section", { id: "hero", ref: heroRef, className: "relative min-h-screen flex items-center overflow-hidden pt-20", children: [_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx("img", { src: "/images/hero-shanghai.png", alt: "", className: "absolute inset-0 w-full h-full object-cover object-center" }), _jsx("div", { className: "absolute inset-0 z-0", style: {
                            background: 'linear-gradient(180deg, rgba(240,253,244,0.92) 0%, rgba(236,254,255,0.88) 30%, rgba(240,249,255,0.9) 70%, rgba(250,250,249,0.95) 100%)'
                        } })] }), _jsx("div", { className: "absolute top-40 right-10 opacity-0 hidden lg:block z-10 animate-float", children: _jsx("div", { className: "relative", children: _jsx("span", { className: "text-8xl", children: "\uD83C\uDF0F" }) }) }), _jsx("div", { className: "absolute bottom-40 left-10 opacity-0 hidden lg:block z-10 animate-float", style: { animationDelay: '1s' }, children: _jsx("div", { className: "relative", children: _jsx("span", { className: "text-6xl", children: "\uD83D\uDCE6" }) }) }), _jsx("div", { className: "container mx-auto px-6 relative z-20", children: _jsxs("div", { className: "max-w-3xl", children: [_jsxs("div", { ref: badgeRef, className: "inline-flex items-center gap-3 bg-white/95 backdrop-blur-xl rounded-full px-6 py-3 mb-6 shadow-xl border-2 border-emerald-400", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx(Star, { className: "w-4 h-4 text-emerald-500 fill-current animate-pulse" }), _jsx(Star, { className: "w-4 h-4 text-teal-500 fill-current" }), _jsx(Star, { className: "w-4 h-4 text-emerald-500 fill-current animate-pulse" })] }), _jsx("span", { className: "text-sm font-semibold text-emerald-600", children: t('hero.badge') }), _jsx(Sparkles, { className: "w-4 h-4 text-emerald-500" })] }), _jsx("h1", { ref: titleRef, className: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6", style: { fontFamily: 'Noto Serif SC, serif' }, children: t('hero.title') }), _jsx("h2", { ref: descRef, className: "text-xl md:text-2xl text-gray-600 mb-8", children: t('hero.subtitle') }), _jsx("p", { className: "text-lg text-gray-500 mb-10 max-w-2xl", children: t('hero.description') }), _jsxs("div", { ref: ctaRef, className: "space-y-4", children: [_jsxs("button", { onClick: scrollToTools, className: "flex items-center justify-center gap-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDCC8" }), "\u6211\u8981\u628A\u4EA7\u54C1\u5356\u5230\u4E2D\u56FD", _jsx(ArrowRight, { className: "w-5 h-5" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("button", { onClick: scrollToServices, className: "flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-emerald-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all", children: [_jsx("span", { className: "text-xl", children: "\uD83C\uDF0D" }), "\u4ECE\u6D77\u5916\u91C7\u8D2D\u4EA7\u54C1"] }), _jsx("button", { onClick: scrollToContact, className: "flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:border-emerald-400 hover:text-emerald-600 transition-all", children: "\u8054\u7CFB\u6211\u4EEC" })] })] }), _jsxs("div", { ref: featuresRef, className: "mt-16 grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center", children: _jsx(Globe, { className: "w-6 h-6 text-emerald-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: "\u5168\u7403\u91C7\u8D2D\u7F51\u7EDC" }), _jsx("div", { className: "text-sm text-gray-500", children: "\u8986\u76D6\u65E5\u672C\u3001\u6B27\u6D32\u3001\u4E1C\u5357\u4E9A" })] })] }), _jsxs("div", { className: "flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center", children: _jsx(Package, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: "\u4E00\u7AD9\u5F0F\u670D\u52A1" }), _jsx("div", { className: "text-sm text-gray-500", children: "\u4ECE\u9009\u54C1\u5230\u4E0A\u67B6\u5168\u6D41\u7A0B" })] })] }), _jsxs("div", { className: "flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-6 h-6 text-orange-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: "\u9AD8\u6548\u51C6\u5165" }), _jsx("div", { className: "text-sm text-gray-500", children: "\u5FEB\u901F\u529E\u7406\u4E2D\u56FD\u8FDB\u53E3\u8D44\u8D28" })] })] })] })] }) })] }));
};
export default Hero;
