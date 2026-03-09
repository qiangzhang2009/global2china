import { useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';

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
