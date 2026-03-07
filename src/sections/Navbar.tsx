import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { nameKey: 'nav.home', href: '#hero' },
  { nameKey: 'nav.services', href: '#services' },
  { nameKey: 'nav.tools', href: '#tools' },
  { nameKey: 'nav.about', href: '#about' },
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
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'navbar-glass shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">{t('nav.brandName')}</span>
              <span className="block text-xs text-gray-500 -mt-1 font-medium">{t('nav.brandSlogan')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <a
                key={item.nameKey}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all"
              >
                {t(item.nameKey)}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-emerald-400 hover:bg-white transition-all shadow-sm"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium text-gray-700">{currentLang.name}</span>
                <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', isLangOpen && 'rotate-180')} />
              </button>

              {/* Language Dropdown */}
              <div className={cn(
                'absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all',
                isLangOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              )}>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors',
                        i18n.language === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                      )}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {i18n.language === lang.code && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-emerald-600 font-medium py-3 px-4 rounded-lg hover:bg-emerald-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              {/* Mobile Language Selector */}
              <div className="mt-2 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 px-4 mb-2">选择语言</div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.slice(0, 9).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        i18n.language === lang.code ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-600 hover:bg-emerald-50'
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-4 rounded-xl font-semibold mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
