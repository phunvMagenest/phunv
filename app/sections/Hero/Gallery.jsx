'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// [title, year]; images in public/works/<slug>-{400,640,1200}.webp
const ITEMS = [
  ['Lunar Echo', 2024],
  ['Velvet Flux', 2023],
  ['Solar Veil', 2024],
  ['Crystal Dawn', 2023],
  ['Neon Mirage', 2024],
  ['Eternal Glow', 2024],
  ['Silent Orbit', 2025],
  ['Prism Haze', 2023],
  ['Echo Bloom', 2024],
  ['Radiant Void', 2025],
  ['Shadow Tide', 2024],
  ['Aurora Fold', 2024],
  ['Glass Reverie', 2024],
  ['Celestial Drift', 2025],
  ['Obsidian Flow', 2023],
].map(([title, year]) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  return { title, year, src: (w) => `/works/${slug}-${w}.webp` };
});

const ARC = (48 * Math.PI / 180) * 0.9; // max yaw at the viewport edge
const ARC_FADE = 0.9 * 0.4;
const PARALLAX_STRENGTH = 0.1;
const PARALLAX_EASE = 0.05;
const FRICTION = 0.958;
const MIN_THROW = 80;
const MAX_THROW = 2500;
const DRIFT_ANGLE = 35 * Math.PI / 180;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const ease = (v, t, k) => { const n = v + (t - v) * k; return Math.abs(n - t) < 0.1 ? t : n; };
// Returns prev itself once settled so React skips the re-render
const approach = (prev, target, k) => {
  const x = ease(prev.x, target.x, k), y = ease(prev.y, target.y, k);
  return x === prev.x && y === prev.y ? prev : { x, y };
};

export default function Gallery({ revealed = false, driftSpeed = 0 }) {
  const containerRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [targetPan, setTargetPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [targetParallax, setTargetParallax] = useState({ x: 0, y: 0 });
  const [inertia, setInertia] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [burstDone, setBurstDone] = useState(false);
  // Derived, not set in an effect: the burst class must land in the same commit as the parent's .shot,
  // or the gallery paints in its final layout for a frame before the animation starts
  const bursting = revealed && !burstDone;

  // Synchronous refs for the animation loop & pointer events
  const panRef = useRef(pan);
  panRef.current = pan;
  const targetPanRef = useRef(targetPan);
  targetPanRef.current = targetPan;
  const targetParallaxRef = useRef(targetParallax);
  targetParallaxRef.current = targetParallax;
  const inertiaRef = useRef(inertia);
  inertiaRef.current = inertia;
  const isDraggingRef = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const isInertiaActive = useRef(false);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartPan = useRef({ x: 0, y: 0 });
  const driftOnRef = useRef(false);
  const driftVelRef = useRef(0);

  // Reveal: cards burst out from screen center once; cleared after so cards mounted by panning don't replay it
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setBurstDone(true), 2600);
    // Burst settles at ~2.1s; hold 1.5s, then start the idle drift
    const d = setTimeout(() => {
      driftOnRef.current = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, 3600);
    return () => { clearTimeout(t); clearTimeout(d); };
  }, [revealed]);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setViewport({ w, h });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === 'Escape' && closeLightbox();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [selected]);

  // Animation loop: pan smoothing, idle drift, throw inertia, parallax
  useEffect(() => {
    let rafId, lastTick = 0, last = performance.now();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    }, { threshold: 0.01 });

    if (containerRef.current) observer.observe(containerRef.current);

    const onVis = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (isVisible && !rafId) {
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const tick = (now) => {
      if (!isVisible || document.hidden) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
      if (now - lastTick < 16) return;
      lastTick = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      setPan((p) => approach(p, targetPanRef.current, isDraggingRef.current ? 0.5 : 0.15));

      // Idle drift along DRIFT_ANGLE (up, left to right); eases in/out, pauses while the pointer is down
      const driftTarget = driftOnRef.current && !isPointerDownRef.current ? driftSpeed : 0;
      driftVelRef.current += (driftTarget - driftVelRef.current) * 0.02;
      if (driftVelRef.current > 0.05 && !isPointerDownRef.current) {
        const step = driftVelRef.current * dt;
        setTargetPan((p) => ({ x: p.x + Math.cos(DRIFT_ANGLE) * step, y: p.y - Math.sin(DRIFT_ANGLE) * step }));
      }

      if (isInertiaActive.current) {
        const v = velocityRef.current;
        const decay = FRICTION ** (dt * 60);
        v.x *= decay;
        v.y *= decay;
        if (Math.hypot(v.x, v.y) < 1) isInertiaActive.current = false;
        else setInertia((p) => ({ x: p.x + v.x * dt, y: p.y + v.y * dt }));
      }

      setParallax((p) => approach(p, targetParallaxRef.current, PARALLAX_EASE));
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [driftSpeed]);

  const onPointerDown = (e) => {
    // Fold any leftover throw into the pan so the grid doesn't jump
    const i = inertiaRef.current;
    if (i.x || i.y) {
      const p = { x: panRef.current.x + i.x, y: panRef.current.y + i.y };
      setPan(p);
      setTargetPan(p);
      setInertia({ x: 0, y: 0 });
      panRef.current = p;
    }
    isInertiaActive.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!isPointerDownRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTargetParallax({
        x: (rect.width / 2 - (e.clientX - rect.left)) * PARALLAX_STRENGTH,
        y: (rect.height / 2 - (e.clientY - rect.top)) * PARALLAX_STRENGTH,
      });
      return;
    }

    const now = performance.now();
    const dt = Math.max(0.001, (now - lastPointer.current.t) / 1000);
    const v = velocityRef.current;
    v.x = clamp((e.clientX - lastPointer.current.x) / dt, -MAX_THROW, MAX_THROW) * 0.6 + v.x * 0.4;
    v.y = clamp((e.clientY - lastPointer.current.y) / dt, -MAX_THROW, MAX_THROW) * 0.6 + v.y * 0.4;
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now };

    if (!isDraggingRef.current && Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y) > 8) {
      hasDraggedRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartPan.current = panRef.current;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
    if (isDraggingRef.current) {
      setTargetPan({
        x: dragStartPan.current.x + e.clientX - dragStartPos.current.x,
        y: dragStartPan.current.y + e.clientY - dragStartPos.current.y,
      });
    }
  };

  const onPointerUp = () => {
    isPointerDownRef.current = false;
    isInertiaActive.current = Math.hypot(velocityRef.current.x, velocityRef.current.y) >= MIN_THROW;
    isDraggingRef.current = false;
    setIsDragging(false);
    setTargetParallax({ x: 0, y: 0 });
    setTimeout(() => { hasDraggedRef.current = false; }, 100);
  };

  const openLightbox = (item) => {
    if (!hasDraggedRef.current) setSelected(item);
  };

  function closeLightbox() {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 300);
  }

  // Infinite grid: only the cells covering the viewport (+ margin) are rendered
  const vw = viewport.w || 1200;
  const vh = viewport.h || 800;
  const M = vw <= 640 ? 200 : 320; // cell size
  const totalX = pan.x + parallax.x + inertia.x;
  const totalY = pan.y + parallax.y + inertia.y;
  const minCol = Math.floor(-totalX / M) - 2;
  const maxCol = minCol + Math.ceil(vw / M) + 4;
  const minRow = Math.floor(-totalY / M) - 2;
  const maxRow = minRow + Math.ceil(vh / M) + 4;
  const radius = vw / (2 * Math.sin(ARC));
  const maxDist = Math.hypot(vw / 2, vh / 2);

  const cards = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const item = ITEMS[Math.abs((c + r * 3) % ITEMS.length)];
      const x = c * M + totalX;
      const y = r * M + totalY;
      // Bend the flat grid onto a horizontal cylinder facing the viewer
      const norm = (x + M / 2 - vw / 2) / (vw / 2);
      const angle = norm * ARC;
      const z = -radius * (Math.cos(angle) - 1);
      const dx = vw / 2 - (x + M / 2);
      const dy = vh / 2 - (y + M / 2);

      cards.push(
        <div
          key={`${c}-${r}`}
          className={bursting ? 'gx-card gx-burst' : 'gx-card'}
          style={{
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            '--delay': `${Math.min(1, Math.hypot(dx, dy) / maxDist) * 0.35}s`,
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-angle * 180 / Math.PI}deg)`,
            opacity: 1 - Math.min(1, Math.abs(norm)) * ARC_FADE,
          }}
          onClick={() => openLightbox(item)}
        >
          <div className="gx-img" style={{ backgroundImage: `url(${item.src(M <= 200 ? 400 : 640)})` }} />
          <div className="gx-meta"><b>{item.title}</b><span>{item.year}</span></div>
        </div>
      );
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className={isDragging ? 'gx dragging' : 'gx'}
        style={{ '--cell': `${M}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => setTargetParallax({ x: 0, y: 0 })}
      >
        <div className="gx-plane">{cards}</div>
        <div className="gx-vignette" />
      </div>

      {/* Portaled to <body>: the 3D ancestors (perspective) would otherwise trap it under the header */}
      {selected && createPortal(
        <div
          className={closing ? 'gx-lightbox closing' : 'gx-lightbox'}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={(e) => e.target === e.currentTarget && !closing && closeLightbox()}
        >
          <button className="gx-close" onClick={() => !closing && closeLightbox()} aria-label="Close">×</button>
          <figure>
            <img src={selected.src(1200)} alt={selected.title} />
            <figcaption>{selected.title} <span>({selected.year})</span></figcaption>
          </figure>
        </div>,
        document.body
      )}
    </>
  );
}
