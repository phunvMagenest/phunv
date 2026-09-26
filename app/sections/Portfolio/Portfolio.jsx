'use client';
import { useState } from 'react';

const WORKS = [
  {
    title: 'Lunar Echo',
    year: 2024,
    category: '3D & WebGL',
    slug: 'lunar-echo',
    summary: 'Real-time 3D celestial orbital simulation with procedural lighting, atmospheric scattering, and interactive camera orbits.',
    description: 'An interactive 3D WebGL experience exploring orbital mechanics and lunar illumination. Built with custom GLSL lighting shaders and Three.js camera kinematics that gracefully adapt to device frame rates.',
    tags: ['Three.js', 'WebGL', 'GLSL', 'React 19'],
    metrics: '60 FPS on mobile • 0.5s load time • Procedural PBR',
  },
  {
    title: 'Velvet Flux',
    year: 2023,
    category: 'Design Systems',
    slug: 'velvet-flux',
    summary: 'Fluid, modular multi-brand design system with dynamic tokens, dark/light contrast palettes, and atomic components.',
    description: 'A design token architecture and atomic component library engineered for multi-brand scalability. Integrates automated accessibility checks, responsive layout rules, and seamless theme switching.',
    tags: ['Figma', 'CSS Tokens', 'Storybook', 'TypeScript'],
    metrics: '99.8% Test Coverage • WCAG AAA • 40+ Components',
  },
  {
    title: 'Solar Veil',
    year: 2024,
    category: 'Web Apps',
    slug: 'solar-veil',
    summary: 'High-throughput climate and solar radiation monitoring web dashboard with real-time streaming data visualizations.',
    description: 'Mission-critical web application that ingests streaming telemetry from solar arrays. Features GPU-accelerated timeseries graphs, dynamic threshold alerts, and offline caching via Service Workers.',
    tags: ['Next.js 16', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    metrics: '< 100ms latency • Real-time telemetry • PWA offline',
  },
  {
    title: 'Crystal Dawn',
    year: 2023,
    category: '3D & WebGL',
    slug: 'crystal-dawn',
    summary: 'Interactive procedural refraction and dispersion glass engine with physically-based transmission shaders.',
    description: 'Physically plausible real-time glass simulation in WebGL. Employs multi-pass screen space refraction, chromatic dispersion, and anisotropic roughness to render crystal objects with zero lag.',
    tags: ['Three.js', 'GLSL', 'PBR Shaders', 'WebGL'],
    metrics: 'Dynamic DPR • Multi-pass Bloom • 60 FPS',
  },
  {
    title: 'Neon Mirage',
    year: 2024,
    category: 'Experimental',
    slug: 'neon-mirage',
    summary: 'Audio-reactive generative visuals featuring dynamic chromatic aberration, bloom passes, and beat detection.',
    description: 'Synthesizing sound and light through real-time Fast Fourier Transform (FFT) analysis. Visualizes music frequencies into kinetic geometric waves with post-processing lens distortion.',
    tags: ['Web Audio API', 'GLSL', 'Canvas 2D', 'Three.js'],
    metrics: 'Real-time FFT • Reactive Bloom • GPU Shaders',
  },
  {
    title: 'Eternal Glow',
    year: 2024,
    category: 'Web Apps',
    slug: 'eternal-glow',
    summary: 'E-commerce luxury showcase site with micro-interactions, seamless transitions, and instant cart updates.',
    description: 'High-end digital flagship experience with fluid page transitions, 3D product previews, and instant optimistic checkout flows built on Next.js App Router.',
    tags: ['Next.js 16', 'React 19', 'Stripe', 'Tailwind CSS'],
    metrics: '99 Performance Score • Sub-second FCP • Smooth UX',
  },
  {
    title: 'Silent Orbit',
    year: 2025,
    category: '3D & WebGL',
    slug: 'silent-orbit',
    summary: 'Minimalist spatial audio and planetary trajectory navigator designed for calm, immersive exploration.',
    description: 'A serene spatial voyage simulating deep-space gravitation. Incorporates Web Audio binaural positioning, silky camera easing, and dynamic constellation linkages.',
    tags: ['Three.js', 'Spatial Audio', 'GSAP', 'WebGL'],
    metrics: '3D Soundstage • Procedural Physics • High Immersion',
  },
  {
    title: 'Prism Haze',
    year: 2023,
    category: 'Experimental',
    slug: 'prism-haze',
    summary: 'Algorithmic gradient mesh generator exploring spectral color synthesis and volumetric light caustics.',
    description: 'Generative color exploration generating fluid, mathematically pure gradient meshes using cubic Hermite splines and noise perturbations for branding backdrops.',
    tags: ['GLSL Fragment Shaders', 'Color Science', 'Math Art'],
    metrics: 'Infinite Resolution • Zero Asset Size • Pure Math',
  },
  {
    title: 'Echo Bloom',
    year: 2024,
    category: 'Design Systems',
    slug: 'echo-bloom',
    summary: 'Comprehensive accessible component library compliant with WCAG 2.1 AAA contrast and keyboard navigation.',
    description: 'Enterprise UI library focusing on full screen-reader compliance, fluid typography scales, high contrast modes, and rigorous focus-trap management across modal states.',
    tags: ['WCAG AAA', 'Radix Primitives', 'TypeScript', 'A11y'],
    metrics: '100% Screen Reader Tested • Keyboard First',
  },
  {
    title: 'Radiant Void',
    year: 2025,
    category: '3D & WebGL',
    slug: 'radiant-void',
    summary: 'Deep-space black hole gravitational lensing visualizer built with custom raymarched GLSL shaders.',
    description: 'Simulating general relativistic light bending around Schwarzschild black holes. Computes curved photon trajectories in real time using analytic raymarching algorithms.',
    tags: ['Raymarching', 'GLSL', 'Three.js', 'Astrophysics'],
    metrics: 'Physically accurate curvature • Shader optimization',
  },
  {
    title: 'Shadow Tide',
    year: 2024,
    category: 'Web Apps',
    slug: 'shadow-tide',
    summary: 'Editorial publishing platform with sub-second page transitions, dynamic typography, and offline support.',
    description: 'Clean reading platform tailored for tech essays and research papers. Implements instant client-side navigation, intelligent image prefetching, and dark-mode optimization.',
    tags: ['Next.js App Router', 'Edge Workers', 'PWA', 'Tailwind'],
    metrics: '100/100 Core Web Vitals • Instant Navigation',
  },
  {
    title: 'Aurora Fold',
    year: 2024,
    category: 'Experimental',
    slug: 'aurora-fold',
    summary: 'Kinetic ribbon physics simulation driven by cursor momentum and simulated wind forces.',
    description: 'An interactive ribbon mesh created with Verlet integration physics. Reacts dynamically to mouse swipes, touch flicks, and virtual air resistance.',
    tags: ['Verlet Physics', 'Three.js', 'Canvas API'],
    metrics: 'Organic Motion • Fluid Drag • Multi-touch',
  },
  {
    title: 'Glass Reverie',
    year: 2024,
    category: 'Design Systems',
    slug: 'glass-reverie',
    summary: 'Glassmorphism UI kit with hardware-accelerated backdrop blur, realistic rim lighting, and specular highlights.',
    description: 'Sleek dark-mode interface components engineered for modern fintech and Web3 apps. Features layered frosted glass surfaces that render smoothly on mobile GPUs.',
    tags: ['CSS Glassmorphism', 'Design Tokens', 'Figma', 'React'],
    metrics: 'Hardware Accelerated • No Lag Blur • Clean Tokens',
  },
  {
    title: 'Celestial Drift',
    year: 2025,
    category: '3D & WebGL',
    slug: 'celestial-drift',
    summary: 'Autonomous particle field navigating complex gravitational vectors with dynamic spring physics.',
    description: 'A 50,000-particle interactive galaxy rendered via InstancedBufferGeometry and custom vertex shaders, simulating n-body gravitational attractors in real time.',
    tags: ['Instanced Geometry', 'Three.js', 'Compute Shaders'],
    metrics: '50k Particles at 60 FPS • Instanced Mesh • WebGL',
  },
  {
    title: 'Obsidian Flow',
    year: 2023,
    category: 'Web Apps',
    slug: 'obsidian-flow',
    summary: 'High-security developer analytics portal featuring interactive query builders and dark-mode charting.',
    description: 'Data analytics hub enabling developers to inspect API latency, server error rates, and user funnels with instantaneous filtering and customizable dashboards.',
    tags: ['TypeScript', 'GraphQL', 'Next.js', 'Chart.js'],
    metrics: 'Instant Filtering • 10M+ Datapoints • Secure Auth',
  },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('All Works');
  const [selectedWork, setSelectedWork] = useState(null);

  const categories = ['All Works', '3D & WebGL', 'Web Apps', 'Design Systems', 'Experimental'];

  const filteredWorks = activeTab === 'All Works'
    ? WORKS
    : WORKS.filter(w => w.category === activeTab);

  return (
    <section id="portfolio" className="framer-section portfolio-section">
      <div className="section-inner">
        <div className="section-title-wrap">
          <span className="gradient-eyebrow">Explore some public works</span>
          <h2 className="section-heading">PORTFOLIO</h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="portfolio-tabs" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeTab === cat}
              className={`tab-pill ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="portfolio-grid">
          {filteredWorks.map((work) => (
            <article
              key={work.slug}
              className="project-card"
              onClick={() => setSelectedWork(work)}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWork(work)}
            >
              <div className="project-thumbnail-wrapper">
                <picture>
                  <source
                    srcSet={`/works/${work.slug}-1200.webp 1200w, /works/${work.slug}-640.webp 640w, /works/${work.slug}-400.webp 400w`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    type="image/webp"
                  />
                  <img
                    src={`/works/${work.slug}-640.webp`}
                    alt={work.title}
                    loading="lazy"
                    className="project-img"
                  />
                </picture>
                <div className="project-badge">{work.category}</div>
                <div className="project-hover-overlay">
                  <span className="explore-action">
                    Explore Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="project-info">
                <div className="project-title-row">
                  <h3 className="project-title">{work.title}</h3>
                  <span className="project-year">{work.year}</span>
                </div>
                <p className="project-summary">{work.summary}</p>
                <div className="project-tags">
                  {work.tags.map((t) => (
                    <span key={t} className="project-tag-pill">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study / Project Lightbox Modal */}
      {selectedWork && (
        <div
          className="case-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.title}
          onClick={(e) => e.target === e.currentTarget && setSelectedWork(null)}
        >
          <div className="case-modal-box">
            <button
              className="case-modal-close"
              onClick={() => setSelectedWork(null)}
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="case-modal-media">
              <picture>
                <source
                  srcSet={`/works/${selectedWork.slug}-1200.webp`}
                  type="image/webp"
                />
                <img
                  src={`/works/${selectedWork.slug}-640.webp`}
                  alt={selectedWork.title}
                  className="case-modal-img"
                />
              </picture>
            </div>

            <div className="case-modal-content">
              <div className="case-modal-top">
                <span className="case-category-pill">{selectedWork.category}</span>
                <span className="case-year">{selectedWork.year}</span>
              </div>
              <h2 className="case-modal-title">{selectedWork.title}</h2>
              <p className="case-modal-desc">{selectedWork.description}</p>

              <div className="case-metrics-box">
                <span className="metrics-label">Key Highlights:</span>
                <p className="metrics-text">{selectedWork.metrics}</p>
              </div>

              <div className="case-modal-tags">
                {selectedWork.tags.map((t) => (
                  <span key={t} className="case-tag-pill">{t}</span>
                ))}
              </div>

              <div className="case-modal-footer">
                <a
                  href="#contact"
                  className="case-inquire-btn"
                  onClick={() => setSelectedWork(null)}
                >
                  Discuss a Similar Project →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
