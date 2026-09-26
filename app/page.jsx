'use client';
import { useState } from 'react';
import Hero from './sections/Hero';
import ThreeAmbient from './sections/ThreeAmbient';
import Ticker from './sections/Ticker';
import About from './sections/About';
import Statement from './sections/Statement';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import Expertise from './sections/Expertise';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import SideNav from './sections/SideNav';
import ScrollManager from './sections/ScrollManager';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [shot, setShot] = useState(false);
  const [fullGallery, setFullGallery] = useState(false);

  return (
    <div className={[loaded && 'loaded', shot && 'shot', fullGallery && 'full-gallery'].filter(Boolean).join(' ') || undefined}>
      {/* 1. Hero Section */}
      <Hero
        loaded={loaded}
        setLoaded={setLoaded}
        shot={shot}
        setShot={setShot}
        fullGallery={fullGallery}
        setFullGallery={setFullGallery}
      />

      {/* 2. Subsections below Hero */}
      <div className="portfolio-subsections-container">
        <ThreeAmbient />
        <Ticker />
        <About />
        <Statement />
        <Services />
        <Portfolio />
        <Expertise />
        <Experience />
        <Contact />
        <Footer />
      </div>

      {/* 3. Side Navigation Rail (hidden in Hero, visible in lower sections) */}
      <SideNav />

      {/* 4. Section-by-section wheel jumper & transition manager */}
      <ScrollManager />
    </div>
  );
}
