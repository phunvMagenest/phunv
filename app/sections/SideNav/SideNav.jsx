'use client';
import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Observe Hero to toggle visibility: hidden in Hero, visible in lower sections
    const heroEl = document.getElementById('hero');
    let heroObserver;
    if (heroEl) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          // If hero is more than 35% visible on screen, hide the side nav
          setIsVisible(!entry.isIntersecting || entry.intersectionRatio < 0.35);
        },
        { threshold: [0, 0.2, 0.35, 0.5, 0.8, 1] }
      );
      heroObserver.observe(heroEl);
    }

    // Fallback scroll listener in case IntersectionObserver needs initial check
    const handleScroll = () => {
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      if (window.scrollY > heroHeight * 0.65) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Observe all subsection elements for active status
    const sectionObservers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          { rootMargin: '-30% 0px -40% 0px' }
        );
        obs.observe(el);
        sectionObservers.push(obs);
      }
    });

    return () => {
      if (heroObserver) heroObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      sectionObservers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className={`side-nav-rail ${isVisible ? 'visible' : ''}`}
      aria-label="Section navigation indicator"
    >
      <nav className="side-nav-list">
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollToSection(e, id)}
              className={`side-nav-item ${isActive ? 'active' : ''}`}
              aria-label={`Scroll to ${label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="nav-label">{label}</span>
              <span className="nav-bar" />
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
