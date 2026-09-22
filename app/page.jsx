'use client';
import { useEffect, useRef, useState } from 'react';
import Light from './Light';
import Gallery from './Gallery';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [shot, setShot] = useState(false); // last frame reached: flash + gallery enters
  const [fullGallery, setFullGallery] = useState(false);
  const video = useRef(null);

  // Next.js fonts are already loaded; keep the short preloader beat
  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      if (video.current) {
        video.current.play().catch(() => {
          setShot(true);
        });
      }
    }, 1200);

    // Fallback: ensure gallery enters after intro beat even if video playback stalls
    const shotTimer = setTimeout(() => {
      setShot(true);
    }, 4200);

    return () => {
      clearTimeout(t);
      clearTimeout(shotTimer);
    };
  }, []);

  const showHero = (e) => { e.preventDefault(); setFullGallery(false); };
  const toggleWorks = (e) => { e.preventDefault(); setShot(true); setFullGallery((v) => !v); };

  return (
    <div className={[loaded && 'loaded', shot && 'shot', fullGallery && 'full-gallery'].filter(Boolean).join(' ') || undefined}>
      <div className="loader"><span>NGUYEN VAN PHU</span></div>

      <header>
        <a href="#" className="logo reveal" style={{ '--d': '.2s' }} onClick={showHero}>Phu.</a>
        <div className="reveal" style={{ '--d': '.3s' }}><small>Experience</small>2 Years</div>
        <div className="reveal" style={{ '--d': '.4s' }}><small>Based in</small>Ha Noi, Vietnam</div>
        <nav className="reveal" style={{ '--d': '.5s' }}>
          <a href="#" onClick={showHero}>About</a>
          <a href="#works" className={fullGallery ? 'active' : undefined} onClick={toggleWorks}>Works</a>
          <a href="#">Contact</a>
          <a href="#">Blog</a>
        </nav>
        <a href="#works" className="pill reveal" style={{ '--d': '.6s' }} onClick={toggleWorks}>
          {fullGallery ? 'Back to Hero' : 'Explore Works'}
        </a>
      </header>

      <section className="hero">
        <Light />

        {/* Infinite curved drag gallery */}
        <div className="gallery-stage">
          <Gallery revealed={shot} driftSpeed={28} />
        </div>

        {/* WebM carries an alpha channel so the ring shows behind the model; MP4 is the opaque fallback (Safari) */}
        <video ref={video} className={`portrait${rolling ? ' rolling' : ''}`} onPlaying={() => setRolling(true)} onEnded={() => setShot(true)} muted playsInline preload="auto" aria-hidden="true">
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
    </div>
  );
}
