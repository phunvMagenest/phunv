'use client';

const TIMELINE = [
  {
    period: '2024 — Present',
    role: 'Full-Stack & 3D Web Developer',
    company: 'Independent & Client Projects',
    location: 'Ha Noi, Vietnam',
    desc: 'Engineering high-performance 3D web applications, custom WebGL experiences, and design systems for forward-thinking clients and startups. Delivering sub-second load times and fluid 60fps animations.',
    tags: ['Next.js 16', 'React 19', 'Three.js', 'WebGL', 'GLSL', 'Tailwind'],
  },
  {
    period: '2023 — 2024',
    role: 'Frontend & Interactive Engineer',
    company: 'Creative Tech Projects',
    location: 'Ha Noi, Vietnam',
    desc: 'Developed modular UI component libraries and interactive dashboards. Led performance optimization initiatives and responsive redesigns across desktop, tablet, and mobile breakpoints.',
    tags: ['React', 'TypeScript', 'Design Systems', 'CSS Tokens', 'REST APIs'],
  },
  {
    period: '2022 — 2023',
    role: 'Web Developer & UI Designer',
    company: 'Digital Solutions Studio',
    location: 'Ha Noi, Vietnam',
    desc: 'Built custom responsive web applications, landing pages, and interactive client portals. Implemented WCAG accessibility guidelines and cross-browser reliability.',
    tags: ['JavaScript', 'HTML5/CSS3', 'Figma', 'UI/UX', 'Animation'],
  },
  {
    period: 'Academic',
    role: 'Software Engineering & Computer Science',
    company: 'University Studies',
    location: 'Vietnam',
    desc: 'Deep theoretical and hands-on foundation in computer science, software architecture, data structures, algorithms, and interactive computer graphics.',
    tags: ['Computer Graphics', 'Software Architecture', 'Algorithms'],
  },
];

const TESTIMONIALS = [
  {
    quote: 'Phu brings a rare balance of engineering rigor and design sensitivity. His 3D WebGL work elevated our brand experience to an entirely new level.',
    author: 'Camilla',
    role: 'Product Lead • Digital Studio',
  },
  {
    quote: 'Incredible speed and meticulous attention to detail. Every interaction feels fluid, responsive, and thoroughly crafted for mobile and desktop alike.',
    author: 'Clement',
    role: 'Creative Director • Studio Arc',
  },
  {
    quote: 'The cleanest code and best-performing animations I have encountered. He transformed our complex interface into a buttery-smooth 60fps experience.',
    author: 'Brigitte',
    role: 'Senior Frontend Architect',
  },
  {
    quote: 'Working with Phu was effortless. He delivers on time, communicates with clarity, and takes full ownership of both design fidelity and code quality.',
    author: 'Isaac',
    role: 'Founder & Tech Lead',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="framer-section experience-section">
      <div className="section-inner">
        <div className="section-title-wrap">
          <span className="gradient-eyebrow">Milestones & Track Record</span>
          <h2 className="section-heading">EXPERIENCE</h2>
        </div>

        {/* Timeline Cards */}
        <div className="timeline-container">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="timeline-card">
              <div className="timeline-header">
                <div className="timeline-period-badge">{item.period}</div>
                <div className="timeline-titles">
                  <h3 className="timeline-role">{item.role}</h3>
                  <p className="timeline-company">{item.company} • <span className="location">{item.location}</span></p>
                </div>
              </div>
              <p className="timeline-desc">{item.desc}</p>
              <div className="timeline-tags">
                {item.tags.map((t) => (
                  <span key={t} className="timeline-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Client Testimonials */}
        <div className="testimonials-wrap">
          <p className="testimonials-title">What Collaborators & Clients Say</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p className="quote-text">{t.quote}</p>
                <div className="author-row">
                  <div className="author-avatar">{t.author[0]}</div>
                  <div>
                    <h4 className="author-name">{t.author}</h4>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
