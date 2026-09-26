'use client';

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#" className="footer-logo" onClick={scrollToTop}>Phu.</a>
          <p className="footer-copy">
            © 2026 Nguyen Van Phu. Built with Next.js 16 & Three.js.
          </p>
        </div>

        <div className="footer-links">
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
          <a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Services</a>
          <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')}>Portfolio</a>
          <a href="#expertise" onClick={(e) => scrollToSection(e, 'expertise')}>Expertise</a>
          <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')}>Experience</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
        </div>

        <div className="footer-actions">
          <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
