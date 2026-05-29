import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
        .fromTo(titleRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(actionsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(statsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToTools = () => {
    document.querySelector('#tools')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollDown = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: '50+', label: t('hero.stat1') },
    { value: '20+', label: t('hero.stat2') },
    { value: '1000+', label: t('hero.stat3') },
  ];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Layered Background — sophisticated minimalism */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-shanghai.png"
          alt="上海天际线 - Global2China跨境贸易咨询服务"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Elegant gradient overlay — warm cream to white */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(248,247,244,0.97) 0%, rgba(248,247,244,0.92) 40%, rgba(240,244,243,0.88) 70%, rgba(255,255,255,0.95) 100%)'
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(var(--neutral-800) 1px, transparent 1px),
              linear-gradient(90deg, var(--neutral-800) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* Decorative elements — minimal, geometric */}
      <div className="absolute top-32 right-12 opacity-[0.06] hidden xl:block z-10">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="159" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="160" cy="160" r="120" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="160" cy="160" r="80" stroke="currentColor" strokeWidth="0.5" />
          <line x1="1" y1="160" x2="319" y2="160" stroke="currentColor" strokeWidth="0.5" />
          <line x1="160" y1="1" x2="160" y2="319" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-50" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="opacity-0 inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-neutral-200 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse-subtle" />
            <span className="text-sm font-medium text-brand-navy tracking-tight">
              {t('hero.badge')}
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="opacity-0 text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-brand-navy leading-[1.08] mb-6 tracking-tight"
          >
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="opacity-0 text-lg md:text-xl text-neutral-500 mb-4 max-w-2xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </p>

          {/* Description */}
          <p className="text-base text-neutral-400 mb-10 max-w-xl leading-relaxed">
            {t('hero.description')}
          </p>

          {/* Actions */}
          <div ref={actionsRef} className="opacity-0 flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={scrollToTools}
              className="btn-brand inline-flex items-center gap-3 text-base px-8 py-4 shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              {t('hero.ctaPrimary')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToContact}
              className="btn-ghost inline-flex items-center gap-3 text-base px-8 py-4"
            >
              {t('hero.ctaSecondary')}
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="opacity-0 flex items-center gap-10 mt-16 pt-10 border-t border-neutral-200">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="stat-number text-3xl md:text-4xl text-brand-navy">{stat.value}</div>
                <div className="text-sm text-neutral-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollDown}
      >
        <span className="text-xs font-medium text-neutral-400 tracking-widest uppercase">{t('hero.scroll')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-neutral-400 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-neutral-600 animate-[slideDown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
