import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink } from 'lucide-react';

const cases = [
  {
    id: 1,
    titleKey: 'cases.case1.title',
    categoryKey: 'cases.case1.category',
    image: '🛒',
    descKey: 'cases.case1.desc',
    resultKey: 'cases.case1.result',
  },
  {
    id: 2,
    titleKey: 'cases.case2.title',
    categoryKey: 'cases.case2.category',
    image: '💄',
    descKey: 'cases.case2.desc',
    resultKey: 'cases.case2.result',
  },
  {
    id: 3,
    titleKey: 'cases.case3.title',
    categoryKey: 'cases.case3.category',
    image: '💊',
    descKey: 'cases.case3.desc',
    resultKey: 'cases.case3.result',
  },
];

const Cases = () => {
  const { t } = useTranslation();

  return (
    <section id="cases" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('cases.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('cases.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Area */}
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-6xl">
                {item.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                  {t(item.categoryKey)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t(item.titleKey)}
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  {t(item.descKey)}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">{t('cases.result')}</span>
                    <span className="text-emerald-600 font-medium">{t(item.resultKey)}</span>
                  </div>
                  <a
                    href="#contact"
                    className="flex items-center gap-1 text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all"
                  >
                    {t('cases.viewDetails')} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;
