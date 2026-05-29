import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';

const values = [
  { icon: Shield, titleKey: 'about.value1', descKey: 'about.values.desc1', color: 'bg-brand-navy' },
  { icon: Clock, titleKey: 'about.value2', descKey: 'about.values.desc2', color: 'bg-brand-teal' },
  { icon: CheckCircle2, titleKey: 'about.value3', descKey: 'about.values.desc3', color: 'bg-brand-gold' },
  { icon: Star, titleKey: 'about.value4', descKey: 'about.values.desc4', color: 'bg-rose-500' },
];

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neutral-50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="badge-premium bg-neutral-100 text-neutral-600 mb-8 inline-flex">
              {t('about.subtitle')}
            </span>

            <h2 className="text-4xl md:text-5xl font-display font-semibold text-brand-navy mb-6 tracking-tight leading-tight">
              {t('about.title')}
            </h2>

            <p className="text-lg text-neutral-600 mb-4 leading-relaxed">
              {t('about.mission')}
            </p>

            <p className="text-base text-neutral-500 mb-12 leading-relaxed">
              {t('about.vision')}
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-neutral-50 rounded-2xl p-5"
                >
                  <div className={`w-11 h-11 rounded-xl ${value.color} flex items-center justify-center flex-shrink-0`}>
                    <value.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy text-sm mb-1">{t(value.titleKey)}</div>
                    <div className="text-xs text-neutral-500 leading-relaxed">{t(value.descKey)}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="btn-brand inline-flex items-center gap-2"
            >
              {t('common.contactUs')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 mb-6">
              <img
                src="/images/about-city.png"
                alt="中国城市天际线 - Global2China业务覆盖全国"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-7 shadow-xl border border-neutral-200">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="stat-number text-3xl text-brand-navy mb-1">50+</div>
                  <div className="text-xs text-neutral-500 font-medium">{t('about.stat1')}</div>
                </div>
                <div className="text-center border-x border-neutral-100">
                  <div className="stat-number text-3xl text-brand-navy mb-1">20+</div>
                  <div className="text-xs text-neutral-500 font-medium">{t('about.stat2')}</div>
                </div>
                <div className="text-center">
                  <div className="stat-number text-3xl text-brand-navy mb-1">98%</div>
                  <div className="text-xs text-neutral-500 font-medium">{t('about.stat3')}</div>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-gold/10 rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-teal/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
