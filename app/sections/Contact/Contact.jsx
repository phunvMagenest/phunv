'use client';
import { useState } from 'react';

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ state: 'idle', msg: '' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ state: 'submitting', msg: 'Sending message...' });
    setTimeout(() => {
      setFormStatus({ state: 'success', msg: 'Thank you! Your message has been received. I will reply within 24 hours.' });
      e.target.reset();
    }, 800);
  };

  return (
    <section id="contact" className="contact-banner-section">
      <div className="contact-gradient-box">
        <div className="contact-inner">
          <div className="contact-left">
            <span className="contact-eyebrow">Let’s</span>
            <h2 className="contact-title">CONNECT</h2>
            <p className="contact-lead">
              Have a project in mind, an opportunity to discuss, or just want to say hi?
            </p>
            <p className="contact-sub">
              Drop me a message, I’d love to hear from you!
            </p>

            <div className="why-me-box">
              <h3 className="why-me-title">Why collaborate?</h3>
              <ul>
                <li>
                  <span className="bullet">✦</span> Multidisciplinary background bridging software engineering, 3D WebGL, and design systems.
                </li>
                <li>
                  <span className="bullet">✦</span> Uncompromising commitment to 60fps smoothness and mobile responsiveness.
                </li>
                <li>
                  <span className="bullet">✦</span> Transparent communication, clear deadlines, and production-ready code.
                </li>
              </ul>
            </div>

            <div className="direct-contact-pills">
              <a href="mailto:contact@phunguyen.dev" className="contact-pill-btn">
                <span>✉ contact@phunguyen.dev</span>
              </a>
              <span className="contact-pill-btn static">
                <span>📍 Ha Noi, Vietnam</span>
              </span>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="fullname">FULL NAME＊</label>
                <input
                  id="fullname"
                  type="text"
                  required
                  placeholder="Your Name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL＊</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your.email@company.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">MESSAGE＊</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, goals, or timeline..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={formStatus.state === 'submitting'}
              >
                {formStatus.state === 'submitting' ? 'SENDING...' : 'GET IN TOUCH →'}
              </button>

              {formStatus.msg && (
                <p className={`form-feedback ${formStatus.state}`}>
                  {formStatus.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
