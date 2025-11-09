import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero3 from '../components/home/Hero3';
import Features from '../components/home/Features';
import About from '../components/home/About';
import Services from '../components/home/Services';
import Portfolio from '../components/home/Portfolio';
import Testimonials from '../components/home/Testimonials';
import Process from '../components/home/Process';
import Stats from '../components/home/Stats';
import Newsletter from '../components/home/Newsletter';

gsap.registerPlugin(ScrollTrigger);

const Home3 = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      if (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="overflow-hidden">
      <Hero3 />
      <div ref={addToRefs}>
        <Features />
      </div>
      <div ref={addToRefs}>
        <About />
      </div>
      <div ref={addToRefs}>
        <Services />
      </div>
      <div ref={addToRefs}>
        <Stats />
      </div>
      <div ref={addToRefs}>
        <Portfolio />
      </div>
      <div ref={addToRefs}>
        <Testimonials />
      </div>
      <div ref={addToRefs}>
        <Process />
      </div>
      <div ref={addToRefs}>
        <Newsletter />
      </div>
    </div>
  );
};

export default Home3;
