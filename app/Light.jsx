'use client';
import { useEffect, useRef } from 'react';

// Studio backdrop lit by a soft spotlight from the top-right corner
export default function Light() {
  const el = useRef(null);

  // three.js loads in its own chunk so it never blocks the first paint
  useEffect(() => {
    let dispose, dead = false;
    import('three').then((THREE) => { if (!dead) dispose = setup(THREE, el.current); });
    return () => { dead = true; dispose?.(); };
  }, []);

  return <canvas ref={el} className="backdrop" aria-hidden="true" />;
}

function setup(THREE, canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
  } catch (err) {
    console.warn('WebGL is not available:', err);
    return;
  }
  renderer.setPixelRatio(.5);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);
  camera.position.z = 10;

  // Backdrop wall
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 30),
    new THREE.MeshStandardMaterial({ color: '#3a322c', roughness: 1 }),
  );
  scene.add(wall, new THREE.AmbientLight('#ffffff', .35));

  // Key light: top-right, warm, wide soft falloff
  const spot = new THREE.SpotLight('#ffe2c4', 60, 0, .75, 1, 1.2);
  spot.position.set(9, 7, 6);
  spot.target.position.set(2, 1, 0);
  scene.add(spot, spot.target);

  // Light shafts from an off-screen lamp at the top-right: no visible hotspot, only the beams
  const g = document.createElement('canvas');
  g.width = 64; g.height = 256;
  const ctx = g.getContext('2d');
  const along = ctx.createLinearGradient(0, 0, 0, 256); // fade in near the lamp, long fade out
  along.addColorStop(0, 'rgba(255,225,190,0)');
  along.addColorStop(.25, 'rgba(255,225,190,1)');
  along.addColorStop(1, 'rgba(255,225,190,0)');
  ctx.fillStyle = along;
  ctx.fillRect(0, 0, 64, 256);
  ctx.globalCompositeOperation = 'destination-in'; // soft edges across the beam
  const across = ctx.createLinearGradient(0, 0, 64, 0);
  across.addColorStop(0, 'rgba(0,0,0,0)');
  across.addColorStop(.5, 'rgba(0,0,0,1)');
  across.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, 64, 256);
  const map = Object.assign(new THREE.CanvasTexture(g), { colorSpace: THREE.SRGBColorSpace });

  const lamp = new THREE.Group();
  // [angle (rad, 0 = straight down), width, opacity]
  const beams = [[-.62, 2.2, .10], [-.78, 1.1, .14], [-.9, 3.2, .07], [-1.02, 1.4, .12], [-1.18, 2.4, .06]].map(([a, w, o]) => {
    const geo = new THREE.PlaneGeometry(w, 24).translate(0, -12, 0); // hinge at the lamp
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      map, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    m.rotation.z = a;
    m.userData = { a, o, phase: Math.random() * 6 };
    lamp.add(m);
    return m;
  });
  scene.add(lamp);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Park the lamp just outside the top-right corner of the visible frame
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 9;
    lamp.position.set(vh * camera.aspect / 2 + 1, vh / 2 + 1, 1);
  };
  resize();
  addEventListener('resize', resize);

  // Slow sway + shimmer of the shafts; static frame when reduced motion is requested
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf, last = -1e9;
  const tick = t => {
    if (!still) raf = requestAnimationFrame(tick);
    if (t - last < 33) return; // 30fps is plenty for a slow sway
    last = t;
    for (const b of beams) {
      const { a, o, phase } = b.userData;
      b.rotation.z = a + Math.sin(t / 3000 + phase) * .025;
      b.material.opacity = o * (.8 + Math.sin(t / 1700 + phase) * .2);
    }
    renderer.render(scene, camera);
  };
  tick(0);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
    renderer.dispose();
  };
}
