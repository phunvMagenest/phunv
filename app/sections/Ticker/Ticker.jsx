'use client';

export default function Ticker() {
  return (
    <section className="ticker-bar" aria-label="Specialization highlights">
      <div className="ticker-track">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="ticker-group" aria-hidden={i > 0}>
            <span>PRODUCTS</span>
            <span className="star">✦</span>
            <span>WEBSITES</span>
            <span className="star">✦</span>
            <span>DESIGN SYSTEMS</span>
            <span className="star">✦</span>
            <span>USER INTERFACES</span>
            <span className="star">✦</span>
            <span>3D WEB EXPERIENCES</span>
            <span className="star">✦</span>
            <span>INCLUSIVE SOLUTIONS</span>
            <span className="star">✦</span>
            <span>SMOOTH USER JOURNEYS</span>
            <span className="star">✦</span>
            <span>STUNNING PORTFOLIOS</span>
            <span className="star">✦</span>
            <span>HIGH PERFORMANCE</span>
            <span className="star">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
