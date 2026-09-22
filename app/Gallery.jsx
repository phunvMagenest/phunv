'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

export const DEFAULT_GALLERY_ITEMS = [
  {
    title: 'Lunar Echo',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/CPEKS4CgXGFyhqj1DYQFNBo.jpg?width=1200', alt: 'Lunar Echo' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Velvet Flux',
    year: 2023,
    image: { src: 'https://framerusercontent.com/images/MimYtXok2QjCTmxWFzndRXnyr8w.jpg?width=1200', alt: 'Velvet Flux' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Solar Veil',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/rYgbOPizz9o1HjV6KKxI3wzY.jpg?width=1200', alt: 'Solar Veil' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Crystal Dawn',
    year: 2023,
    image: { src: 'https://framerusercontent.com/images/SiyC3lDXAGRZ2oDtZEtg8wIjcs.jpeg?width=1200', alt: 'Crystal Dawn' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Neon Mirage',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/Ficw83TFEYJ0FkRaYmAn5NkjQ.jpg?width=1200', alt: 'Neon Mirage' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Eternal Glow',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/GHdK2nXWfWZ8Z9gSr1MjIf0Icwk.jpeg?width=1200', alt: 'Eternal Glow' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Silent Orbit',
    year: 2025,
    image: { src: 'https://framerusercontent.com/images/9dFMIrTq5ECvBNlxbImo9om7t3Q.jpg?width=1200', alt: 'Silent Orbit' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Prism Haze',
    year: 2023,
    image: { src: 'https://framerusercontent.com/images/h5A2Nuz95dg2CvfcJ4v27uUY.jpeg?width=1200', alt: 'Prism Haze' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Echo Bloom',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/G9SwAVpOlWqpMhz1NZIOWrtVlI.jpeg?width=1200', alt: 'Echo Bloom' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Radiant Void',
    year: 2025,
    image: { src: 'https://framerusercontent.com/images/kQoe6d6kzaRK2zHaHCiwdjVd5aM.jpeg?width=1200', alt: 'Radiant Void' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Shadow Tide',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/JUswf0twst07xCdaeXlLTkI7ac.jpeg?width=1200', alt: 'Shadow Tide' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Aurora Fold',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/6DIZwA8nh473LG2rl7PoWoL92s.jpeg?width=1200', alt: 'Aurora Fold' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Glass Reverie',
    year: 2024,
    image: { src: 'https://framerusercontent.com/images/sOMytaGcY2bEliK1l0M0cfv4TZQ.jpeg?width=1200', alt: 'Glass Reverie' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Celestial Drift',
    year: 2025,
    image: { src: 'https://framerusercontent.com/images/cZxWT29DW5PeJgrg7iruyOyj31Q.jpg?width=1200', alt: 'Celestial Drift' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  },
  {
    title: 'Obsidian Flow',
    year: 2023,
    image: { src: 'https://framerusercontent.com/images/I9N8uUCSecWR1NyNR8pqemQHjY8.jpg?width=1200', alt: 'Obsidian Flow' },
    hoverColor: 'rgba(110, 110, 110, 0.3)'
  }
];

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function scalePan(oldCellSize, newCellSize, anchorPoint, pan) {
  const rx = (anchorPoint.x - pan.x) / oldCellSize;
  const ry = (anchorPoint.y - pan.y) / oldCellSize;
  return {
    x: anchorPoint.x - rx * newCellSize,
    y: anchorPoint.y - ry * newCellSize
  };
}

function calculateArc({
  cellCenterX,
  cellCenterY,
  viewportW,
  viewportH,
  arcAxis = 'horizontal',
  arcMaxAngleDeg = 48,
  arcAmount = 0.9
}) {
  const c = degToRad(arcMaxAngleDeg) * Math.max(0, Math.min(1, arcAmount));
  if (c === 0) {
    return { z: 0, yawDeg: 0, pitchDeg: 0, edgeFactor: 0 };
  }

  if (arcAxis === 'horizontal') {
    const normX = (cellCenterX - viewportW / 2) / (viewportW / 2);
    const angle = normX * c;
    const sinC = Math.sin(Math.max(0.001, c));
    const radius = viewportW / (2 * sinC);
    const z = -radius * (Math.cos(angle) - 1);
    const yawDeg = -(angle * 180) / Math.PI;
    const edgeFactor = Math.min(1, Math.abs(normX));
    return { z, yawDeg, pitchDeg: 0, edgeFactor };
  } else {
    const normY = (cellCenterY - viewportH / 2) / (viewportH / 2);
    const angle = normY * c;
    const sinC = Math.sin(Math.max(0.001, c));
    const radius = viewportH / (2 * sinC);
    const z = -radius * (Math.cos(angle) - 1);
    const pitchDeg = (angle * 180) / Math.PI;
    const edgeFactor = Math.min(1, Math.abs(normY));
    return { z, yawDeg: 0, pitchDeg, edgeFactor };
  }
}

export default function Gallery({
  items = DEFAULT_GALLERY_ITEMS,
  cellSize = 320,
  backgroundColor = 'transparent',
  textColor = 'rgb(128, 128, 128)',
  cellPadding = 16,
  gap = 26,
  arcAmount = 0.9,
  arcMaxAngleDeg = 48,
  arcAxis = 'horizontal',
  edgeFade = 0,
  border = {
    width: 1,
    style: 'solid',
    color: 'rgb(38, 38, 38)',
    showTop: true,
    showBottom: false,
    showLeft: true,
    showRight: false
  },
  parallaxEnabled = true,
  parallaxStrength = 0.1,
  parallaxEase = 0.05,
  parallaxWhileDragging = true,
  inertiaEnabled = true,
  throwFriction = 0.958,
  throwVelocityScale = 1,
  throwMinSpeed = 80,
  throwMaxSpeed = 2500,
  defaultHoverColor = 'rgba(66, 66, 66, 0.18)',
  zoomValue = 1,
  revealed = false,
  driftSpeed = 0,
  driftAngleDeg = 35,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [targetPan, setTargetPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentCellSize, setCurrentCellSize] = useState(cellSize);
  const [targetCellSize, setTargetCellSize] = useState(cellSize);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [targetParallaxOffset, setTargetParallaxOffset] = useState({ x: 0, y: 0 });
  const [inertiaOffset, setInertiaOffset] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClosingLightbox, setIsClosingLightbox] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [burstDone, setBurstDone] = useState(false);
  // Derived, not set in an effect: the burst class must land in the same commit as the parent's .shot,
  // or the gallery paints in its final layout for a frame before the animation starts
  const bursting = revealed && !burstDone;

  // Reveal: cards burst out from screen center once; cleared after so cards mounted by panning don't replay it
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setBurstDone(true), 2600);
    // Burst settles at ~2.1s; hold 1.5s, then start the idle drift
    const d = setTimeout(() => {
      driftOnRef.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, 3600);
    return () => { clearTimeout(t); clearTimeout(d); };
  }, [revealed]);

  // Synchronous refs for smooth animation loops & events
  const panRef = useRef(pan);
  panRef.current = pan;
  const targetPanRef = useRef(targetPan);
  targetPanRef.current = targetPan;
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const parallaxOffsetRef = useRef(parallaxOffset);
  parallaxOffsetRef.current = parallaxOffset;
  const targetParallaxRef = useRef(targetParallaxOffset);
  targetParallaxRef.current = targetParallaxOffset;
  const inertiaOffsetRef = useRef(inertiaOffset);
  inertiaOffsetRef.current = inertiaOffset;

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const isInertiaActive = useRef(false);
  const pointerIdRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerStartPos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartPan = useRef({ x: 0, y: 0 });
  const zoomTimeout = useRef(null);
  const lastFrameTimeRef = useRef(performance.now());
  const driftOnRef = useRef(false);
  const driftVelRef = useRef(0);

  // Viewport resize tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      setViewport({ w: rect.width, h: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync cellSize when prop updates
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const anchor = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const scaled = scalePan(currentCellSize, cellSize, anchor, {
      x: panRef.current.x + (inertiaOffsetRef.current?.x || 0),
      y: panRef.current.y + (inertiaOffsetRef.current?.y || 0)
    });
    setTargetCellSize(cellSize);
    setTargetPan(scaled);
  }, [cellSize]);

  const commitInertiaToPan = useCallback(() => {
    const currentP = panRef.current;
    const currentI = inertiaOffsetRef.current || { x: 0, y: 0 };
    const newPan = {
      x: currentP.x + currentI.x,
      y: currentP.y + currentI.y
    };
    setPan(newPan);
    setTargetPan(newPan);
    setInertiaOffset({ x: 0, y: 0 });
    isInertiaActive.current = false;
  }, []);

  // Animation frame loop for continuous physics & smoothing
  useEffect(() => {
    let rafId;
    let lastTick = performance.now();

    const tick = (now) => {
      if (now - lastTick < 16) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      lastTick = now;
      const currentTime = performance.now();
      const dt = Math.min(0.05, (currentTime - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = currentTime;

      // Cell size zoom interpolation
      setCurrentCellSize((prev) => {
        const ease = isDraggingRef.current ? 0.25 : 0.15;
        const next = prev + (targetCellSize - prev) * ease;
        return Math.abs(next - targetCellSize) < 0.05 ? targetCellSize : next;
      });

      // Pan interpolation
      setPan((prev) => {
        const target = targetPanRef.current;
        const ease = isDraggingRef.current ? 0.5 : 0.15;
        const nextX = prev.x + (target.x - prev.x) * ease;
        const nextY = prev.y + (target.y - prev.y) * ease;
        return {
          x: Math.abs(nextX - target.x) < 0.1 ? target.x : nextX,
          y: Math.abs(nextY - target.y) < 0.1 ? target.y : nextY
        };
      });

      // Idle drift along driftAngleDeg (up, left to right); eases in/out, pauses while the pointer is down
      const driftTarget = driftOnRef.current && !isPointerDownRef.current ? driftSpeed : 0;
      driftVelRef.current += (driftTarget - driftVelRef.current) * 0.02;
      if (driftVelRef.current > 0.05 && !isPointerDownRef.current) {
        const a = degToRad(driftAngleDeg);
        const step = driftVelRef.current * dt;
        setTargetPan((prev) => ({ x: prev.x + Math.cos(a) * step, y: prev.y - Math.sin(a) * step }));
      }

      // Inertia throw decay
      if (inertiaEnabled && isInertiaActive.current) {
        const decay = throwFriction ** (dt * 60);
        velocityRef.current.x *= decay;
        velocityRef.current.y *= decay;
        if (Math.hypot(velocityRef.current.x, velocityRef.current.y) < 1) {
          const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x);
          velocityRef.current.x = Math.cos(angle) * 1e-4;
          velocityRef.current.y = Math.sin(angle) * 1e-4;
        }
        setInertiaOffset((prev) => ({
          x: prev.x + velocityRef.current.x * dt,
          y: prev.y + velocityRef.current.y * dt
        }));
      }

      // Parallax smoothing
      if (parallaxEnabled && (parallaxWhileDragging || !isDraggingRef.current)) {
        setParallaxOffset((prev) => {
          const target = targetParallaxRef.current;
          const nextX = prev.x + (target.x - prev.x) * parallaxEase;
          const nextY = prev.y + (target.y - prev.y) * parallaxEase;
          return {
            x: Math.abs(nextX - target.x) < 0.1 ? target.x : nextX,
            y: Math.abs(nextY - target.y) < 0.1 ? target.y : nextY
          };
        });
      } else {
        setParallaxOffset((prev) => {
          const nextX = prev.x + (0 - prev.x) * parallaxEase;
          const nextY = prev.y + (0 - prev.y) * parallaxEase;
          return {
            x: Math.abs(nextX) < 0.1 ? 0 : nextX,
            y: Math.abs(nextY) < 0.1 ? 0 : nextY
          };
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inertiaEnabled, throwFriction, targetCellSize, parallaxEnabled, parallaxWhileDragging, parallaxEase, driftSpeed, driftAngleDeg]);

  // Pointer event handlers
  const handlePointerDown = useCallback((e) => {
    if (isInertiaActive.current || (inertiaOffsetRef.current?.x || 0) !== 0 || (inertiaOffsetRef.current?.y || 0) !== 0) {
      commitInertiaToPan();
    }
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    setIsDragging(false);
    hasDraggedRef.current = false;
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragStartPan.current = panRef.current;

    if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
    zoomTimeout.current = setTimeout(() => {
      if (!isDraggingRef.current && isPointerDownRef.current) {
        const rect = containerRef.current?.getBoundingClientRect();
        const center = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
        const newSize = cellSize * zoomValue;
        const scaledPan = scalePan(currentCellSize, newSize, center, {
          x: panRef.current.x + (inertiaOffsetRef.current?.x || 0),
          y: panRef.current.y + (inertiaOffsetRef.current?.y || 0)
        });
        setTargetCellSize(newSize);
        setTargetPan(scaledPan);
      }
    }, 120);
  }, [cellSize, zoomValue, currentCellSize, commitInertiaToPan]);

  const handlePointerMove = useCallback((e) => {
    if (isPointerDownRef.current) {
      const now = performance.now();
      const dt = Math.max(0.001, (now - lastPointer.current.t) / 1000);
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      const vx = clamp((dx / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
      const vy = clamp((dy / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
      velocityRef.current.x = vx * 0.6 + velocityRef.current.x * 0.4;
      velocityRef.current.y = vy * 0.6 + velocityRef.current.y * 0.4;
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
    }

    const isInteracting = isPointerDownRef.current || isDragging;
    if (parallaxEnabled && (parallaxWhileDragging || !isDraggingRef.current) && containerRef.current && !isInteracting) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setTargetParallaxOffset({
        x: (centerX - relX) * parallaxStrength,
        y: (centerY - relY) * parallaxStrength
      });
    }

    if (!isPointerDownRef.current) return;

    const totalDx = e.clientX - pointerStartPos.current.x;
    const totalDy = e.clientY - pointerStartPos.current.y;

    if (!isDragging && Math.hypot(totalDx, totalDy) > 8) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      isDraggingRef.current = true;
      dragStartPan.current = panRef.current;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }

    if (isDraggingRef.current) {
      const dragDx = e.clientX - dragStartPos.current.x;
      const dragDy = e.clientY - dragStartPos.current.y;
      setTargetPan({
        x: dragStartPan.current.x + dragDx,
        y: dragStartPan.current.y + dragDy
      });
    }
  }, [isDragging, parallaxEnabled, parallaxWhileDragging, parallaxStrength, throwVelocityScale, throwMaxSpeed]);

  const handlePointerUp = useCallback(() => {
    isPointerDownRef.current = false;
    if (zoomTimeout.current) {
      clearTimeout(zoomTimeout.current);
      zoomTimeout.current = null;
    }
    const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
    if (inertiaEnabled && speed >= throwMinSpeed) {
      isInertiaActive.current = true;
    } else {
      isInertiaActive.current = false;
      setInertiaOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
    isDraggingRef.current = false;

    const rect = containerRef.current?.getBoundingClientRect();
    const center = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const scaledPan = scalePan(currentCellSize, cellSize, center, {
      x: panRef.current.x + (inertiaOffsetRef.current?.x || 0),
      y: panRef.current.y + (inertiaOffsetRef.current?.y || 0)
    });
    setTargetParallaxOffset({ x: 0, y: 0 });
    setTargetCellSize(cellSize);
    setTargetPan(scaledPan);

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  }, [cellSize, currentCellSize, inertiaEnabled, throwMinSpeed]);

  const handlePointerLeave = useCallback(() => {
    setTargetParallaxOffset({ x: 0, y: 0 });
  }, []);

  const openLightbox = useCallback((item, e) => {
    if (hasDraggedRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsClosingLightbox(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosingLightbox(false);
    }, 300);
  }, []);

  // Compute infinite visible grid items
  const M = currentCellSize;
  const totalX = pan.x + parallaxOffset.x + inertiaOffset.x;
  const totalY = pan.y + parallaxOffset.y + inertiaOffset.y;
  const vw = viewport.w || 1200;
  const vh = viewport.h || 800;

  const minCol = Math.floor(-totalX / M) - 2;
  const maxCol = minCol + Math.ceil(vw / M) + 4;
  const minRow = Math.floor(-totalY / M) - 2;
  const maxRow = minRow + Math.ceil(vh / M) + 4;

  const cards = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const itemIndex = Math.abs((c + r * 3) % items.length);
      const item = items[itemIndex];
      const posX = c * M + totalX;
      const posY = r * M + totalY;

      const { z, yawDeg, pitchDeg, edgeFactor } = calculateArc({
        cellCenterX: posX + M / 2,
        cellCenterY: posY + M / 2,
        viewportW: vw,
        viewportH: vh,
        arcAxis,
        arcMaxAngleDeg,
        arcAmount
      });

      const scale = 1 - edgeFactor * edgeFactor * edgeFade;
      const dx = vw / 2 - (posX + M / 2);
      const dy = vh / 2 - (posY + M / 2);
      const opacity = 1 - edgeFactor * arcAmount * 0.4;

      cards.push(
        <div
          key={`${c}-${r}`}
          className={bursting ? 'gx-burst' : undefined}
          style={{
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            '--delay': `${Math.min(1, Math.hypot(dx, dy) / Math.hypot(vw / 2, vh / 2)) * 0.35}s`,
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${M}px`,
            height: `${M}px`,
            borderTop: border.showTop ? `${border.width}px ${border.style} ${border.color}` : 'none',
            borderLeft: border.showLeft ? `${border.width}px ${border.style} ${border.color}` : 'none',
            borderRight: border.showRight ? `${border.width}px ${border.style} ${border.color}` : 'none',
            borderBottom: border.showBottom ? `${border.width}px ${border.style} ${border.color}` : 'none',
            backgroundColor: 'transparent',
            cursor: isDragging ? 'grabbing' : 'pointer',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            padding: `${cellPadding}px`,
            boxSizing: 'border-box',
            transformStyle: 'preserve-3d',
            transform: `translate3d(${posX}px, ${posY}px, ${z}px) rotateY(${yawDeg}deg) rotateX(${pitchDeg}deg) scale(${scale})`,
            opacity,
            willChange: isDragging ? 'transform' : 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = item.hoverColor || defaultHoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={(e) => openLightbox(item, e)}
        >
          <div
            style={{
              flex: 1,
              backgroundImage: `url(${item.image?.src || item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: `${gap}px`,
              borderRadius: '4px',
              userSelect: 'none',
              cursor: 'pointer'
            }}
          />
          <div
            style={{
              color: textColor,
              fontSize: '12px',
              fontFamily: 'monospace',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
              letterSpacing: '0.04em'
            }}
          >
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {item.title}
            </span>
            <span>{item.year}</span>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`gallery-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        willChange: isDragging ? 'transform' : 'auto',
        ...style
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* 3D Infinite Cylinder Card Space */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: isDragging ? 'transform' : 'auto'
        }}
      >
        {cards}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,1) 100%)'
        }}
      />

      {/* Fullscreen Lightbox Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            cursor: 'default',
            animation: isClosingLightbox ? 'galleryFadeOut 0.3s ease-out forwards' : 'galleryFadeIn 0.3s ease-out',
            pointerEvents: isClosingLightbox ? 'none' : 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isClosingLightbox) closeLightbox();
          }}
        >
          <style>{`
            @keyframes galleryFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes galleryFadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes galleryScaleIn {
              from { transform: scale(0.92); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes galleryScaleOut {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.95); opacity: 0; }
            }
          `}</style>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isClosingLightbox) closeLightbox();
            }}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '26px',
              fontWeight: '300',
              lineHeight: 1,
              transition: 'all 0.2s ease',
              zIndex: 100001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
            aria-label="Close"
          >
            ×
          </button>

          <div
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: isClosingLightbox ? 'galleryScaleOut 0.3s ease-out forwards' : 'galleryScaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.image?.src || selectedItem.image}
              alt={selectedItem.title}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(85vh - 80px)',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            />
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.12em',
                textAlign: 'center',
                userSelect: 'none'
              }}
            >
              {selectedItem.title} <span style={{ opacity: 0.5, marginLeft: '8px' }}>({selectedItem.year})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

