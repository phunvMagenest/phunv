'use client';
import { useState } from 'react';

const SERVICES = [
  {
    num: '01',
    title: 'Visual & Frontend Engineering',
    tagline: 'Pixel-perfect, high-performance web applications with fluid motion.',
    desc: 'Crafting responsive, delightful web interfaces with fluid typography, silky micro-animations, and intuitive user journeys. Turning complex specifications into lightweight, accessible, and high-performance digital products.',
    deliverables: [
      'Responsive Web Applications (Mobile, Tablet, Desktop)',
      'Silky Micro-interactions & Page Transitions',
      'Pixel-perfect Cross-browser & Retina Fidelity',
      'Touch & Gesture-first Mobile Engineering',
    ],
    tech: ['React 19', 'Next.js 16', 'Tailwind CSS', 'CSS Modules'],
  },
  {
    num: '02',
    title: '3D WebGL & Creative Development',
    tagline: 'Immersive WebGL interactive experiences and custom GLSL shaders.',
    desc: 'Engineering interactive 3D WebGL scenes, procedural lightings, camera kinematics, and custom GLSL shaders. Optimizing geometries, draw calls, and textures for consistent 60fps across low-end mobile and high-end desktop GPUs.',
    deliverables: [
      'Interactive 3D Product & Diorama Showcases',
      'Custom GLSL Shaders (Bloom, Refraction, Particles)',
      'Three.js Modular OOP Engine Scaffold',
      'Dynamic Performance Throttling for Mobile',
    ],
    tech: ['Three.js', 'WebGL', 'GLSL', 'Canvas 2D', 'GSAP'],
  },
  {
    num: '03',
    title: 'Design System & Component Architecture',
    tagline: 'Scalable UI token systems and modular component libraries.',
    desc: 'Architecting modular, accessible, and scalable design systems with atomic component hierarchies, theme tokens, and rigorous UI documentation to accelerate team velocity and maintain brand coherence across large platforms.',
    deliverables: [
      'Atomic Reusable Component Architecture',
      'Design Tokens (Spacing, Typography, Contrast Palettes)',
      'WCAG 2.1 AAA Accessibility Standards',
      'Figma-to-Code Synchronized DesignOps',
    ],
    tech: ['Figma', 'Storybook', 'Design Tokens', 'TypeScript'],
  },
  {
    num: '04',
    title: 'Performance & Core Web Vitals Optimization',
    tagline: 'Sub-second page speeds, 95+ Lighthouse scores, and zero jank.',
    desc: 'Auditing and supercharging web applications for sub-second First Contentful Paint (FCP), zero Cumulative Layout Shift (CLS), and instantaneous Interaction to Next Paint (INP). Implementing asset compression, lazy loading, and code splitting.',
    deliverables: [
      'Core Web Vitals Audit & Remediation (95+ score)',
      'Draco & WebP Asset Pipeline Compression',
      'Route Prefetching & Tree-shaking Optimizations',
      'GPU & VRAM Memory Profiling for WebGL',
    ],
    tech: ['Lighthouse', 'Turbopack', 'WebP/AVIF', 'Tree-shaking'],
  },
  {
    num: '05',
    title: 'Full-Stack Web Applications',
    tagline: 'Modern Next.js App Router, robust APIs, and real-time data.',
    desc: 'Building robust end-to-end full-stack applications with Next.js App Router, Server Actions, secure RESTful/GraphQL APIs, real-time WebSockets, and scalable database integrations.',
    deliverables: [
      'Server-Side Rendering (SSR) & Streaming SSR',
      'Secure Server Actions & RESTful/GraphQL APIs',
      'Database Schema Design & Query Optimization',
      'Role-based Authentication & Data Security',
    ],
    tech: ['Next.js App Router', 'Node.js', 'REST APIs', 'PostgreSQL'],
  },
  {
    num: '06',
    title: 'Heuristic Analysis & Code Auditing',
    tagline: 'Actionable usability, accessibility, and architectural reviews.',
    desc: 'Conducting thorough usability, accessibility, and code quality audits to eliminate architectural bottlenecks, visual inconsistencies, and UX friction points before production deployment.',
    deliverables: [
      'Heuristic UX & Usability Evaluation Reports',
      'WCAG AA Compliance Testing (Manual & Automated)',
      'Code Refactoring & Modernization Blueprints',
      'Responsive Mobile & Tablet Device Audits',
    ],
    tech: ['WCAG AA', 'Axe-core', 'ESLint/TypeScript', 'Usability Testing'],
  },
];

export default function Services() {
  const [openService, setOpenService] = useState(0);

  return (
    <section id="services" className="framer-section services-section">
      <div className="section-inner">
        <div className="section-title-wrap">
          <span className="gradient-eyebrow">Creative</span>
          <h2 className="section-heading">SERVICES</h2>
        </div>

        <div className="services-accordion">
          {SERVICES.map((srv, idx) => {
            const isOpen = openService === idx;
            return (
              <div
                key={srv.num}
                className={`service-card ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenService(isOpen ? -1 : idx)}
              >
                <div className="service-header">
                  <div className="service-title-left">
                    <span className="service-num">{srv.num}</span>
                    <h3 className="service-title">{srv.title}</h3>
                  </div>
                  <button
                    className="service-toggle-btn"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Collapse service details' : 'Expand service details'}
                  >
                    <svg
                      className="toggle-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  <div className="service-body">
                    <p className="service-desc">{srv.desc}</p>
                    <div className="service-deliverables">
                      <span className="deliverables-heading">Deliverables:</span>
                      <ul>
                        {srv.deliverables.map((item, i) => (
                          <li key={i}>
                            <span className="check">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="service-tech-tags">
                      {srv.tech.map((t) => (
                        <span key={t} className="tech-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
