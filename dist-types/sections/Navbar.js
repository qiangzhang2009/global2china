import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [
    { name: '首页', href: '#hero' },
    { name: '服务项目', href: '#services' },
    { name: '智能决策', href: '#tools' },
    { name: '关于我们', href: '#about' },
];
const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];
export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };
    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
    return (_jsx("header", { className: cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', isScrolled
            ? 'navbar-glass shadow-lg'
            : 'bg-transparent'), children: _jsxs("nav", { className: "container mx-auto px-6 py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 group", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow", children: _jsx(Globe, { className: "w-7 h-7 text-white" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xl font-bold text-gray-900", children: "\u4E0A\u6D77\u5F20\u5C0F\u5F3A" }), _jsx("span", { className: "block text-xs text-gray-500 -mt-1 font-medium", children: "\u6D77\u5916\u4F18\u54C1\u00B7\u4E2D\u56FD\u4E0A\u5E02" })] })] }), _jsx("div", { className: "hidden lg:flex items-center gap-1", children: navigation.map((item) => (_jsx("a", { href: item.href, className: "px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all", children: item.name }, item.name))) }), _jsxs("div", { className: "hidden lg:flex items-center gap-4", children: [_jsxs("div", { className: "relative", ref: langRef, children: [_jsxs("button", { onClick: () => setIsLangOpen(!isLangOpen), className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-emerald-400 hover:bg-white transition-all shadow-sm", children: [_jsx("span", { className: "text-lg", children: currentLang.flag }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: currentLang.name }), _jsx(ChevronDown, { className: cn('w-4 h-4 text-gray-500 transition-transform', isLangOpen && 'rotate-180') })] }), _jsx("div", { className: cn('absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all', isLangOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'), children: _jsx("div", { className: "py-2 max-h-96 overflow-y-auto", children: languages.map((lang) => (_jsxs("button", { onClick: () => changeLanguage(lang.code), className: cn('w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors', i18n.language === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'), children: [_jsx("span", { className: "text-xl", children: lang.flag }), _jsx("span", { className: "font-medium", children: lang.name }), i18n.language === lang.code && (_jsx("span", { className: "ml-auto w-2 h-2 rounded-full bg-emerald-500" }))] }, lang.code))) }) })] }), _jsxs("a", { href: "#contact", className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5", children: [t('hero.cta'), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }), _jsx("button", { className: "lg:hidden p-2", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), children: isMobileMenuOpen ? (_jsx(X, { className: "w-6 h-6 text-gray-700" })) : (_jsx(Menu, { className: "w-6 h-6 text-gray-700" })) })] }), isMobileMenuOpen && (_jsx("div", { className: "lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4", children: _jsxs("div", { className: "flex flex-col gap-2", children: [navigation.map((item) => (_jsx("a", { href: item.href, className: "text-gray-700 hover:text-emerald-600 font-medium py-3 px-4 rounded-lg hover:bg-emerald-50", onClick: () => setIsMobileMenuOpen(false), children: item.name }, item.name))), _jsxs("div", { className: "mt-2 pt-4 border-t border-gray-100", children: [_jsx("div", { className: "text-sm text-gray-500 px-4 mb-2", children: "\u9009\u62E9\u8BED\u8A00" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: languages.slice(0, 9).map((lang) => (_jsxs("button", { onClick: () => {
                                                changeLanguage(lang.code);
                                                setIsMobileMenuOpen(false);
                                            }, className: cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', i18n.language === lang.code ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-600 hover:bg-emerald-50'), children: [_jsx("span", { children: lang.flag }), _jsx("span", { className: "font-medium", children: lang.name })] }, lang.code))) })] }), _jsxs("a", { href: "#contact", className: "flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-4 rounded-xl font-semibold mt-4", onClick: () => setIsMobileMenuOpen(false), children: [t('hero.cta'), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) }))] }) }));
}
