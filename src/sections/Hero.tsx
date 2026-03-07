import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Star, Zap, Globe, Package, TrendingUp } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background: image + overlay gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-shanghai.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(240,253,244,0.92) 0%, rgba(236,254,255,0.88) 30%, rgba(240,249,255,0.9) 70%, rgba(250,250,249,0.95) 100%)'
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-40 right-10 opacity-0 hidden lg:block z-10 animate-float">
        <div className="relative">
          <span className="text-8xl">🌏</span>
        </div>
      </div>

      <div className="absolute bottom-40 left-10 opacity-0 hidden lg:block z-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="relative">
          <span className="text-6xl">📦</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-xl rounded-full px-6 py-3 mb-6 shadow-xl border-2 border-emerald-400"
          >
            <div className="flex gap-1">
              <Star className="w-4 h-4 text-emerald-500 fill-current animate-pulse" />
              <Star className="w-4 h-4 text-teal-500 fill-current" />
              <Star className="w-4 h-4 text-emerald-500 fill-current animate-pulse" />
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {t('hero.badge')}
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            style={{ fontFamily: 'Noto Serif SC, serif' }}
          >
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <h2
            ref={descRef}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            {t('hero.subtitle')}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-500 mb-10 max-w-2xl">
            {t('hero.description')}
          </p>

          {/* CTA Buttons - Dual Entry */}
          <div ref={ctaRef} className="space-y-4">
            {/* 卖到中国入口 */}
            <button
              onClick={scrollToTools}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="text-xl">📈</span>
              我要把产品卖到中国
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* 从海外采购入口 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToServices}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-emerald-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                <span className="text-xl">🌍</span>
                从海外采购产品
              </button>
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:border-emerald-400 hover:text-emerald-600 transition-all"
              >
                联系我们
              </button>
            </div>
          </div>

          {/* Features */}
          <div ref={featuresRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">全球采购网络</div>
                <div className="text-sm text-gray-500">覆盖日本、欧洲、东南亚</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">一站式服务</div>
                <div className="text-sm text-gray-500">从选品到上架全流程</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">高效准入</div>
                <div className="text-sm text-gray-500">快速办理中国进口资质</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
