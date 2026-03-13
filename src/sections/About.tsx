import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, CheckCircle, Clock, Shield, Star, Users, Award, MapPin } from 'lucide-react';

const values = [
  { icon: Shield, titleKey: 'about.value1', descKey: 'about.values.desc1' },
  { icon: Clock, titleKey: 'about.value2', descKey: 'about.values.desc2' },
  { icon: CheckCircle, titleKey: 'about.value3', descKey: 'about.values.desc3' },
  { icon: Star, titleKey: 'about.value4', descKey: 'about.values.desc4' },
];

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-on-scroll">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>{t('about.subtitle')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {t('about.title')}
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('about.mission')}
            </p>

            <p className="text-lg text-gray-500 mb-10">
              {t('about.vision')}
            </p>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t(value.titleKey)}</div>
                    <div className="text-xs text-gray-500">{t(value.descKey)}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold mt-10 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all"
            >
              {t('common.contactUs')} <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right Visual */}
          <div className="relative animate-on-scroll">
            <div className="relative z-10">
              {/* Right side image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-6">
                <img src="/images/about-city.png" alt="" className="w-full h-56 object-cover object-center" />
              </div>
              {/* Main Card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {/* Market Cards */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl p-5 text-center">
                      <div className="text-4xl mb-2">🗾</div>
                      <div className="font-bold text-gray-900">{t('markets.japan')}</div>
                      <div className="text-xs text-gray-500">{t('markets.japan.desc')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-5 text-center">
                      <div className="text-4xl mb-2">🇪🇺</div>
                      <div className="font-bold text-gray-900">{t('markets.europe')}</div>
                      <div className="text-xs text-gray-500">{t('markets.europe.desc')}</div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl p-5 text-center">
                      <div className="text-4xl mb-2">🌏</div>
                      <div className="font-bold text-gray-900">{t('markets.southeast')}</div>
                      <div className="text-xs text-gray-500">{t('markets.southeast.desc')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-5 text-center">
                      <div className="text-4xl mb-2">🦘</div>
                      <div className="font-bold text-gray-900">{t('markets.australia')}</div>
                      <div className="text-xs text-gray-500">{t('markets.australia.desc')}</div>
                    </div>
                  </div>
                </div>

                {/* Service Tags */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      'about.serviceTag1',
                      'about.serviceTag2',
                      'about.serviceTag3',
                      'about.serviceTag4',
                      'about.serviceTag5'
                    ].map((tagKey, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {t(tagKey)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-90 shadow-xl flex items-center justify-center">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-90 shadow-xl flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-3xl opacity-30 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-30 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
