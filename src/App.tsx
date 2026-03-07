import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Markets from './sections/Markets';
import Tools from './sections/Tools';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import FloatingContact from './components/FloatingContact';

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
        <Services />
        <Markets />
        <Tools />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}

export default App;
