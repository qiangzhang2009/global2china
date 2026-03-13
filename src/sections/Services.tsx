import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Shield, Factory, Store, Truck, Palette, ArrowRight, Check, FileCheck, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 服务分类：按客户类型分组
const services = {
  // 卖到中国服务 - 针对海外厂家/品牌方
  sellToChina: [
    {
      icon: Shield,
      titleKey: 'services.compliance.title',
      descKey: 'services.compliance.desc',
      gradient: 'from-violet-400 to-purple-500',
      featuresKeys: ['services.feature1', 'services.feature2', 'services.feature3'],
    },
    {
      icon: FileCheck,
      titleKey: 'services.customs.title',
      descKey: 'services.customs.desc',
      gradient: 'from-amber-400 to-orange-500',
      featuresKeys: ['services.feature4', 'services.feature5', 'services.feature6'],
    },
    {
      icon: Palette,
      titleKey: 'services.brand.title',
      descKey: 'services.brand.desc',
      gradient: 'from-pink-400 to-rose-500',
      featuresKeys: ['services.feature7', 'services.feature8', 'services.feature9'],
    },
    {
      icon: Store,
      titleKey: 'services.channel.title',
      descKey: 'services.channel.desc',
      gradient: 'from-orange-400 to-red-500',
      featuresKeys: ['services.feature10', 'services.feature11', 'services.feature12'],
    },
  ],
  // 从海外采购服务 - 针对中国采购商/进口商
  sourcing: [
    {
      icon: ShoppingCart,
      titleKey: 'services.selection.title',
      descKey: 'services.selection.desc',
      gradient: 'from-emerald-400 to-teal-500',
      featuresKeys: ['services.feature13', 'services.feature14', 'services.feature15'],
    },
    {
      icon: Factory,
      titleKey: 'services.procurement.title',
      descKey: 'services.procurement.desc',
      gradient: 'from-blue-400 to-indigo-500',
      featuresKeys: ['services.feature16', 'services.feature17', 'services.feature18'],
    },
    {
      icon: Truck,
      titleKey: 'services.logistics.title',
      descKey: 'services.logistics.desc',
      gradient: 'from-cyan-400 to-blue-500',
      featuresKeys: ['services.feature19', 'services.feature20', 'services.feature21'],
    },
    {
      icon: ClipboardCheck,
      titleKey: 'services.quality.title',
      descKey: 'services.quality.desc',
      gradient: 'from-lime-400 to-green-500',
      featuresKeys: ['services.feature22', 'services.feature23', 'services.feature24'],
    },
  ],
};

const Services = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="py-28 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('services.subtitle')}
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 mx-auto mt-8 rounded-full" />
        </div>

        {/* Services: 卖到中国服务 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📈</span>
            <h3 className="text-xl font-bold text-gray-900">{t('services.sellToChinaTitle')}</h3>
            <span className="text-sm text-gray-500">({t('services.sellToChinaDesc')})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.sellToChina.map((service, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-violet-200 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                  {t(service.descKey)}
                </p>
                <ul className="space-y-2 mb-4">
                  {(service.featuresKeys || []).map((featureKey: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm group-hover:gap-3 transition-all"
                >
                  {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Services: 从海外采购服务 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🌍</span>
            <h3 className="text-xl font-bold text-gray-900">{t('services.sourcingTitle')}</h3>
            <span className="text-sm text-gray-500">({t('services.sourcingDesc')})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.sourcing.map((service, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                  {t(service.descKey)}
                </p>
                <ul className="space-y-2 mb-4">
                  {(service.featuresKeys || []).map((featureKey: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all"
                >
                  {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
