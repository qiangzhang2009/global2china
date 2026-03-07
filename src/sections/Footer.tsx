import { Globe, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Footer Top - CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-emerald-100 text-sm font-medium">{t('footer.cta.subtitle')}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('footer.cta.title')}
          </h3>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            {t('footer.cta.desc')}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {t('footer.cta.button')}
          </a>
        </div>
      </div>

      {/* Footer Main */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">{t('nav.brandName')}</span>
                <span className="block text-xs text-gray-400">{t('footer.companyType')}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{t('footer.location')}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.services.title')}</h4>
            <ul className="space-y-3">
              {[
                t('footer.services.item1'),
                t('footer.services.item2'),
                t('footer.services.item3'),
                t('footer.services.item4'),
                t('footer.services.item5'),
                t('footer.services.item6'),
              ].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.markets.title')}</h4>
            <ul className="space-y-3">
              {[
                { name: t('footer.markets.jp'), flag: '🇯🇵' },
                { name: t('footer.markets.eu'), flag: '🇪🇺' },
                { name: t('footer.markets.se'), flag: '🌏' },
                { name: t('footer.markets.au'), flag: '🦘' },
                { name: t('footer.markets.us'), flag: '🇺🇸' },
                { name: t('footer.markets.me'), flag: '🏜️' },
              ].map((item, index) => (
                <li key={index}>
                  <a href="#markets" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.links.title')}</h4>
            <ul className="space-y-3">
              {[
                { name: t('footer.links.about'), href: '#about' },
                { name: t('footer.links.services'), href: '#services' },
                { name: t('footer.links.markets'), href: '#markets' },
                { name: t('footer.links.tools'), href: '#tools' },
                { name: t('footer.links.contact'), href: '#contact' },
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
