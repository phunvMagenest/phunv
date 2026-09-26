'use client';
import { useEffect, useRef } from 'react';

const SECTION_IDS = [
  'hero',
  'about',
  'services',
  'portfolio',
  'expertise',
  'experience',
  'contact',
];

export default function ScrollManager() {
  const isLockedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // 1. IntersectionObserver for Entrance & Transition Effects
    const sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-in-view');
          } else {
            // Optional: fade out when far away
            if (entry.intersectionRatio < 0.1) {
              entry.target.classList.remove('section-in-view');
            }
          }
        });
      },
      {
        threshold: [0.15, 0.4, 0.7],
        rootMargin: '-5% 0px -5% 0px',
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Helper: find current section index based on viewport position
    const getCurrentSectionIndex = () => {
      const vh = window.innerHeight;
      const mid = vh * 0.45;
      let bestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= mid && rect.bottom >= mid) {
            return i;
          }
          const dist = Math.abs(rect.top);
          if (dist < minDistance) {
            minDistance = dist;
            bestIdx = i;
          }
        }
      }
      return bestIdx;
    };

    const scrollToSectionIndex = (targetIdx) => {
      const targetEl = document.getElementById(SECTION_IDS[targetIdx]);
      if (!targetEl) return;

      isLockedRef.current = true;
      lastTimeRef.current = performance.now();

      // Apply transition pulse to target section
      targetEl.classList.add('section-transitioning');
      setTimeout(() => {
        targetEl.classList.remove('section-transitioning');
      }, 900);

      // Smooth scroll to target section
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Unlock after transition settles
      setTimeout(() => {
        isLockedRef.current = false;
      }, 750);
    };

    // 2. Wheel event: strictly 1 wheel notch = 1 section jump
    const onWheel = (e) => {
      // Do not hijack scroll if a modal or lightbox dialog is currently open
      if (document.querySelector('.case-modal-overlay') || document.querySelector('.gx-lightbox')) {
        return;
      }

      // Always prevent native erratic micro-scroll
      e.preventDefault();

      const now = performance.now();

      // Ignore micro trackpad tremors
      if (Math.abs(e.deltaY) < 18) return;

      // If transition lock is active or within debounce cooldown, ignore extra wheel events
      if (isLockedRef.current || now - lastTimeRef.current < 750) {
        return;
      }

      const isDown = e.deltaY > 0;
      const currentIdx = getCurrentSectionIndex();
      const targetIdx = isDown ? currentIdx + 1 : currentIdx - 1;

      if (targetIdx < 0 || targetIdx >= SECTION_IDS.length) {
        lastTimeRef.current = now;
        return; // At boundaries
      }

      scrollToSectionIndex(targetIdx);
    };

    // 3. Keyboard navigation: PageUp, PageDown, ArrowUp, ArrowDown, Space
    const onKeyDown = (e) => {
      if (document.querySelector('.case-modal-overlay') || document.querySelector('.gx-lightbox')) {
        return;
      }
      // Ignore if typing inside form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', ' '].includes(e.key)) {
        const isDown = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';
        const currentIdx = getCurrentSectionIndex();
        const targetIdx = isDown ? currentIdx + 1 : currentIdx - 1;

        if (targetIdx >= 0 && targetIdx < SECTION_IDS.length) {
          e.preventDefault();
          scrollToSectionIndex(targetIdx);
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
