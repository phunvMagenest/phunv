'use client';
import { useEffect, useRef, useState } from 'react';
import Light from './Light';
import Gallery from './Gallery';

export default function Hero({ loaded, setLoaded, shot, setShot, fullGallery, setFullGallery }) {
  const [rolling, setRolling] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      if (video.current) {
        video.current.play().catch(() => {
          setShot(true);
        });
      }
    }, 1200);

    const shotTimer = setTimeout(() => {
      setShot(true);
    }, 4200);

    return () => {
      clearTimeout(t);
      clearTimeout(shotTimer);
    };
  }, [setLoaded, setShot]);

  const showHero = (e) => {
    e.preventDefault();
    setFullGallery(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWorks = (e) => {
    e.preventDefault();
    setShot(true);
    setFullGallery((v) => !v);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setFullGallery(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="loader"><span>NGUYEN VAN PHU</span></div>

      {/* Top Menu: position absolute, scrolls naturally with the hero (not fixed) */}
      <header>
        <a href="#" className="logo reveal" style={{ '--d': '.2s' }} onClick={showHero}>Phu.</a>
        <div className="reveal" style={{ '--d': '.3s' }}><small>Experience</small>2 Years</div>
        <div className="reveal" style={{ '--d': '.4s' }}><small>Based in</small>Ha Noi, Vietnam</div>
        <nav className="reveal" style={{ '--d': '.5s' }}>
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
          <a href="#works" className={fullGallery ? 'active' : undefined} onClick={toggleWorks}>Works</a>
          <a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Services</a>
          <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')}>Portfolio</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
        </nav>
        <a href="#works" className="pill reveal" style={{ '--d': '.6s' }} onClick={toggleWorks}>
          {fullGallery ? 'Back to Hero' : 'Explore Works'}
        </a>
      </header>

      {/* Original Hero Section */}
      <section id="hero" className="hero">
        <Light />

        {/* Infinite curved drag gallery */}
        <div className="gallery-stage">
          <Gallery revealed={shot} driftSpeed={28} />
        </div>

        {/* WebM carries an alpha channel so the ring shows behind the model; MP4 is the opaque fallback (Safari) */}
        <video
          ref={video}
          className={`portrait${rolling ? ' rolling' : ''}`}
          onPlaying={() => setRolling(true)}
          onEnded={() => setShot(true)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/sunglasses_walk_pose.webm" type="video/webm" />
          <source src="/sunglasses_walk_pose.mp4" type="video/mp4" />
        </video>
        <div className="vignette" />
        <div className="flash" />

        <div className="copy">
          <p className="eyebrow reveal" style={{ '--d': '.6s' }}>01 — SOFTWARE DEVELOPER</p>
          <h1>
            <span className="line"><span style={{ '--d': '.7s' }}>Software</span></span>
            <span className="line"><span style={{ '--d': '.85s' }}>Developer</span></span>
          </h1>
          <a href="#works" className="pill light reveal" style={{ '--d': '1s' }} onClick={toggleWorks}>
            Explore Works
          </a>
        </div>

        <div className="quote reveal" style={{ '--d': '1.15s' }}>
          “Software developer with <b>2 years of experience</b> dedicated to building clean, high-performance web applications.”
          <div className="sign">Nguyen Van Phu</div>
        </div>
      </section>
    </>
  );
}
