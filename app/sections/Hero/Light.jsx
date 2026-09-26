'use client';
import { useEffect, useRef } from 'react';

// Studio backdrop lit by a soft spotlight from the top-right corner,
// optimized with Three.js dynamic DPR, IntersectionObserver RAF pausing, and FPS throttling
export default function Light() {
  const el = useRef(null);

  useEffect(() => {
    let dispose, dead = false;
    import('three').then((THREE) => {
      if (!dead && el.current) dispose = setup(THREE, el.current);
    });
    return () => {
      dead = true;
      dispose?.();
    };
  }, []);

  return <canvas ref={el} className="backdrop" aria-hidden="true" />;
}

function setup(THREE, canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
  } catch (err) {
    console.warn('WebGL is not available:', err);
    return;
  }

  // Dynamic DPR capped at 1.5 for retina smoothness without GPU strain
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 10;

  // Backdrop wall
  const wallGeo = new THREE.PlaneGeometry(60, 30);
  const wallMat = new THREE.MeshStandardMaterial({ color: '#2a221d', roughness: 1 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
  scene.add(wall, ambientLight);

  // Key light: top-right, warm, wide soft falloff
  const spot = new THREE.SpotLight('#ffe2c4', 65, 0, 0.75, 1, 1.2);
  spot.position.set(9, 7, 6);
  spot.target.position.set(2, 1, 0);
  scene.add(spot, spot.target);

  // Light shafts from an off-screen lamp at the top-right
  const g = document.createElement('canvas');
  g.width = 64;
  g.height = 256;
  const ctx = g.getContext('2d');
  const along = ctx.createLinearGradient(0, 0, 0, 256);
  along.addColorStop(0, 'rgba(255,225,190,0)');
  along.addColorStop(0.25, 'rgba(255,225,190,1)');
  along.addColorStop(1, 'rgba(255,225,190,0)');
  ctx.fillStyle = along;
  ctx.fillRect(0, 0, 64, 256);
  ctx.globalCompositeOperation = 'destination-in';
  const across = ctx.createLinearGradient(0, 0, 64, 0);
  across.addColorStop(0, 'rgba(0,0,0,0)');
  across.addColorStop(0.5, 'rgba(0,0,0,1)');
  across.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, 64, 256);

  const map = Object.assign(new THREE.CanvasTexture(g), { colorSpace: THREE.SRGBColorSpace });

  const lamp = new THREE.Group();
  const beamGeos = [];
  const beamMats = [];
  const beams = [[-0.62, 2.2, 0.11], [-0.78, 1.1, 0.15], [-0.9, 3.2, 0.08], [-1.02, 1.4, 0.13], [-1.18, 2.4, 0.07]].map(([a, w, o]) => {
    const geo = new THREE.PlaneGeometry(w, 24).translate(0, -12, 0);
    beamGeos.push(geo);
    const mMat = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      opacity: o,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    beamMats.push(mMat);
    const m = new THREE.Mesh(geo, mMat);
    m.rotation.z = a;
    m.userData = { a, o, phase: Math.random() * 6 };
    lamp.add(m);
    return m;
  });
  scene.add(lamp);

  const resize = () => {
    if (!canvas || !canvas.parentElement) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 9;
    lamp.position.set(vh * camera.aspect / 2 + 1, vh / 2 + 1, 1);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = null;
  let isVisible = true;
  let lastTime = performance.now();

  // Dynamic Performance Throttling: Pause render loop when canvas is scrolled off-screen
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !raf && !still) {
      lastTime = performance.now();
      tick(lastTime);
    }
  }, { threshold: 0.01 });

  observer.observe(canvas);

  const tick = (now) => {
    if (!isVisible || document.hidden) {
      raf = null;
      return;
    }
    raf = requestAnimationFrame(tick);
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Smooth sway & shimmer
    for (const b of beams) {
      const { a, o, phase } = b.userData;
      b.rotation.z = a + Math.sin(now * 0.00035 + phase) * 0.025;
      b.material.opacity = o * (0.85 + Math.sin(now * 0.0006 + phase) * 0.15);
    }
    renderer.render(scene, camera);
  };

  // Visibility change handler (tab switch)
  const onVisibilityChange = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (isVisible && !raf && !still) {
      lastTime = performance.now();
      tick(lastTime);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Initial paint & start
  renderer.render(scene, camera);
  if (!still) {
    raf = requestAnimationFrame(tick);
  }

  return () => {
    if (raf) cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    // Three.js resource clean-up
    wallGeo.dispose();
    wallMat.dispose();
    map.dispose();
    beamGeos.forEach(g => g.dispose());
    beamMats.forEach(m => m.dispose());
    renderer.dispose();
  };
}
