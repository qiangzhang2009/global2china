import { useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import { trackPageView, trackScrollDepth, trackSectionView } from './lib/tracking';

// 懒加载下面不需要首屏渲染的组件
const Services = lazy(() => import('./sections/Services'));
const Tools = lazy(() => import('./sections/Tools'));
const About = lazy(() => import('./sections/About'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));
const FloatingContact = lazy(() => import('./components/FloatingContact'));

// 加载占位组件
const LoadingPlaceholder = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

gsap.registerPlugin(ScrollTrigger);

function App() {
  // 页面浏览追踪
  useEffect(() => {
    trackPageView('首页');
  }, []);

  // 滚动深度追踪
  useEffect(() => {
    let maxScrollPercent = 0;
    const scrollThresholds = [25, 50, 75, 100];
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // 更新最大滚动深度
      if (scrollPercent > maxScrollPercent) {
        maxScrollPercent = scrollPercent;
      }
      
      // 检查是否达到新的阈值
      scrollThresholds.forEach((threshold) => {
        if (maxScrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 区块浏览追踪
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'tools', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const sectionName = sectionIds.find(id => sectionId.includes(id)) || sectionId;
            trackSectionView(sectionId, sectionName);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.animate-on-scroll');

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<LoadingPlaceholder />}>
          <Services />
          {/* <Markets /> */}
          <Tools />
          <About />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <FloatingContact />
      </Suspense>
    </div>
  );
}

export default App;
