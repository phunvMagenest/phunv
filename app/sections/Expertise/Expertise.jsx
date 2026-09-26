'use client';

const EXPERTISE_TAGS = [
  'Visual & UI Engineering',
  'Full-Stack Architecture',
  '3D Graphics & WebGL',
  'Design Systems & Tokens',
  'Performance & SEO (95+)',
  'Responsive & Mobile-First',
  'Touch & Gesture Interactions',
  'Accessibility (WCAG 2.1)',
  'Motion & Micro-interactions',
  'API & Database Design',
];

const TECH_STACK = [
  { name: 'Next.js 16', role: 'Full-Stack Framework', desc: 'App Router, Turbopack, Server Actions & Streaming SSR', badge: 'Core' },
  { name: 'React 19', role: 'UI Engine', desc: 'Concurrent rendering, modern hooks & server components', badge: 'Core' },
  { name: 'Three.js & WebGL', role: '3D Graphics', desc: 'Custom GLSL shaders, camera choreography, 60fps WebGL', badge: '3D' },
  { name: 'TypeScript', role: 'Language', desc: 'Strict static typing, robust enterprise architecture', badge: 'Code' },
  { name: 'Tailwind CSS', role: 'Styling', desc: 'Utility-first fluid layouts, CSS Grid & custom tokens', badge: 'Style' },
  { name: 'Figma', role: 'Design Tool', desc: 'Design systems, tokens, interactive prototyping & DesignOps', badge: 'Design' },
  { name: 'Node.js', role: 'Runtime', desc: 'RESTful/GraphQL API development & backend services', badge: 'Backend' },
  { name: 'Git & GitHub', role: 'Version Control', desc: 'CI/CD workflows, semantic versioning & PR reviews', badge: 'DevOps' },
];

export default function Expertise() {
  return (
    <section id="expertise" className="framer-section expertise-section">
      <div className="section-inner">
        <div className="section-title-wrap">
          <span className="gradient-eyebrow">My fields of</span>
          <h2 className="section-heading">EXPERTISE</h2>
        </div>

        <div className="expertise-grid">
          {/* Fields list */}
          <div className="expertise-left">
            <h3 className="sub-title">Disciplines & Domains</h3>
            <div className="expertise-tags-flow">
              {EXPERTISE_TAGS.map((tag) => (
                <div key={tag} className="expertise-pill">
                  <span className="dot" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
            <div className="expertise-callout">
              <p className="callout-quote">
                “Bridging the divide between high-end visual design and rigorous software architecture.”
              </p>
              <span className="callout-author">Nguyen Van Phu</span>
            </div>
          </div>

          {/* Tools & Tech Cards */}
          <div className="expertise-right">
            <h3 className="sub-title">Tools & Core Technologies</h3>
            <div className="tech-cards-grid">
              {TECH_STACK.map((item) => (
                <div key={item.name} className="tech-card">
                  <div className="tech-card-header">
                    <span className="tech-badge">{item.badge}</span>
                    <h4 className="tech-name">{item.name}</h4>
                  </div>
                  <span className="tech-role">{item.role}</span>
                  <p className="tech-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
