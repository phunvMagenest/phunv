'use client';

const BRANDS = [
  'SONY',
  'HBO',
  'VODAFONE',
  'MERCK',
  'AXN',
  'L’ORÉAL',
  'DHL',
  'STAR ALLIANCE',
  'DA VINCI',
  'YARA',
  'BADENTV',
];

export default function About() {
  return (
    <section id="about" className="framer-section about-section">
      <div className="section-inner">
        <div className="about-header">
          <div className="status-pill">
            <span className="pulse-dot" />
            <span>OPEN TO CREATE • AVAILABLE FOR WORK</span>
          </div>
          <h2 className="about-greeting">
            Hi, I’m <span className="text-white">Phu</span>
          </h2>
          <p className="about-role">Software Developer & 3D Web Creative</p>
        </div>

        <div className="about-content-grid">
          <div className="about-bio">
            <p className="lead-text">
              With 2+ years in visual web engineering and full-stack development, I am dedicated to creating digital products that balance mathematical precision, aesthetic poise, and peak runtime performance.
            </p>
            <p className="body-text">
              Shaping modular design systems, fine-tuning Core Web Vitals, and engineering real-time 3D WebGL experiences with Three.js have defined my craft. While bringing a clean design perspective and a relentless focus on accessibility, I am deeply adaptable to client brand guidelines, ensuring every solution feels distinct and frictionless.
            </p>
            <div className="signature-container">
              <span className="signature-text">Nguyen Van Phu</span>
            </div>
          </div>

          <div className="about-stats-card">
            <div className="stat-item">
              <span className="stat-number">2+</span>
              <span className="stat-label">Years of Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Curated Public Works</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">60<small>FPS</small></span>
              <span className="stat-label">Smooth Three.js WebGL</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100<small>%</small></span>
              <span className="stat-label">Responsive & Mobile-First</span>
            </div>
          </div>
        </div>

        {/* Trusted Brand / Partner Logos Slider */}
        <div className="brand-slider-wrapper">
          <p className="brand-slider-title">Collaborations & Industry References</p>
          <div className="brand-slider">
            <div className="brand-track">
              {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
                <div key={idx} className="brand-item">
                  <span>{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
