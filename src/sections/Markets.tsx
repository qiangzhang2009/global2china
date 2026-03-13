import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const markets = [
  {
    id: 'japan',
    nameKey: 'markets.japan',
    flag: '🇯🇵',
    descKey: 'markets.japan.desc',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:from-pink-400 hover:to-rose-500',
  },
  {
    id: 'europe',
    nameKey: 'markets.europe',
    flag: '🇪🇺',
    descKey: 'markets.europe.desc',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:from-blue-400 hover:to-indigo-500',
  },
  {
    id: 'southeast',
    nameKey: 'markets.southeast',
    flag: '🌏',
    descKey: 'markets.southeast.desc',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:from-yellow-400 hover:to-orange-500',
  },
  {
    id: 'australia',
    nameKey: 'markets.australia',
    flag: '🇦🇺',
    descKey: 'markets.australia.desc',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:from-green-400 hover:to-emerald-500',
  },
  {
    id: 'usa',
    nameKey: 'markets.usa',
    flag: '🇺🇸',
    descKey: 'markets.usa.desc',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:from-purple-400 hover:to-violet-500',
  },
  {
    id: 'korea',
    nameKey: 'markets.korea',
    flag: '🇰🇷',
    descKey: 'markets.korea.desc',
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
    hoverColor: 'hover:from-rose-400 hover:to-pink-500',
  },
  {
    id: 'newzealand',
    nameKey: 'markets.newzealand',
    flag: '🇳🇿',
    descKey: 'markets.newzealand.desc',
    color: 'from-teal-400 to-cyan-500',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:from-teal-400 hover:to-cyan-500',
  },
  {
    id: 'canada',
    nameKey: 'markets.canada',
    flag: '🇨🇦',
    descKey: 'markets.canada.desc',
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:from-red-400 hover:to-orange-500',
  },
];

const Markets = () => {
  const { t } = useTranslation();

  return (
    <section id="markets" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('markets.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('markets.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* 全球市场配图 */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-12 max-w-4xl mx-auto">
          <img src="/images/landscape-markets.png" alt="" className="w-full h-48 md:h-56 object-cover object-center" />
        </div>

        {/* 全球采购来源 */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl">🌍</span>
            <h3 className="text-xl font-bold text-gray-900">{t('markets.globalSourcing')}</h3>
            <span className="text-sm text-gray-500">({t('markets.globalSourcingDesc')})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market, index) => (
              <div
                key={market.id}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient - shows on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${market.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className={`relative ${market.bgColor} group-hover:bg-transparent p-6 min-h-[180px] flex flex-col justify-between transition-colors duration-500`}>
                  <div>
                    <div className="text-4xl mb-3">{market.flag}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                      {t(market.nameKey)}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                      {t(market.descKey)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>{t('common.learnMore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 目标销售区域 - 卖到中国 */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl">🏠</span>
            <h3 className="text-xl font-bold text-gray-900">{t('markets.targetRegions')}</h3>
            <span className="text-sm text-gray-500">({t('markets.targetRegionsDesc')})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'east-china', nameKey: 'markets.region.eastChina.name', citiesKey: 'markets.region.eastChina.cities', descKey: 'markets.region.eastChina.desc', icon: '🏙️', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50' },
              { id: 'south-china', nameKey: 'markets.region.southChina.name', citiesKey: 'markets.region.southChina.cities', descKey: 'markets.region.southChina.desc', icon: '🌴', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50' },
              { id: 'north-china', nameKey: 'markets.region.northChina.name', citiesKey: 'markets.region.northChina.cities', descKey: 'markets.region.northChina.desc', icon: '🏯', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50' },
              { id: 'southwest', nameKey: 'markets.region.southwest.name', citiesKey: 'markets.region.southwest.cities', descKey: 'markets.region.southwest.desc', icon: '🏔️', color: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
              { id: 'central', nameKey: 'markets.region.central.name', citiesKey: 'markets.region.central.cities', descKey: 'markets.region.central.desc', icon: '🏢', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50' },
              { id: 'national', nameKey: 'markets.region.national.name', citiesKey: 'markets.region.national.cities', descKey: 'markets.region.national.desc', icon: '🗺️', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50' },
            ].map((region, index) => (
              <div
                key={region.id}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 animate-on-scroll p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative ${region.bg} group-hover:bg-transparent p-4 min-h-[140px] flex flex-col justify-between transition-colors duration-500`}>
                  <div>
                    <div className="text-3xl mb-2">{region.icon}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-white transition-colors">{t(region.nameKey)}</h4>
                    <p className="text-xs text-gray-500 mb-1">{t(region.citiesKey)}</p>
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">{t(region.descKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
