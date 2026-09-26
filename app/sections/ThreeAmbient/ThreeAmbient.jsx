'use client';
import { useEffect, useRef } from 'react';

// Lightweight, 60fps Three.js ambient background for portfolio sections
// Features floating glowing particles and a sleek morphing wireframe knot with smooth mouse parallax
export default function ThreeAmbient() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let dispose, dead = false;
    import('three').then((THREE) => {
      if (!dead && canvasRef.current) {
        dispose = initThreeAmbient(THREE, canvasRef.current);
      }
    });
    return () => {
      dead = true;
      dispose?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-ambient-canvas" aria-hidden="true" />;
}

function initThreeAmbient(THREE, canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
  } catch (e) {
    console.warn('WebGL not supported for ambient canvas:', e);
    return;
  }

  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 24;

  // Ambient lighting & subtle directional rim lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const pointLight1 = new THREE.PointLight(0xf85be1, 15, 50); // Pink accent
  pointLight1.position.set(10, 10, 8);
  const pointLight2 = new THREE.PointLight(0x9c6ffc, 15, 50); // Purple accent
  pointLight2.position.set(-10, -10, 8);
  scene.add(ambient, pointLight1, pointLight2);

  // 1. Sleek geometric knot / ring mesh
  const knotGeo = new THREE.TorusKnotGeometry(4.2, 0.85, 100, 16, 2, 3);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f2e,
    emissive: 0x221330,
    roughness: 0.35,
    metalness: 0.8,
    wireframe: true,
    wireframeLinewidth: 1,
    transparent: true,
    opacity: 0.3,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  knot.position.set(6, -2, -4);
  scene.add(knot);

  // 2. Luminous particle field
  const particleCount = 220;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const c1 = new THREE.Color(0xf85be1); // pink
  const c2 = new THREE.Color(0x9c6ffc); // purple
  const c3 = new THREE.Color(0xcaf76f); // lime

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;

    const chosenColor = Math.random() < 0.45 ? c1 : Math.random() < 0.85 ? c2 : c3;
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular point texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 32;
  pCanvas.height = 32;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 32, 32);

  const pTexture = new THREE.CanvasTexture(pCanvas);
  const particleMat = new THREE.PointsMaterial({
    size: 0.45,
    map: pTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Resize handling
  const resize = () => {
    if (!canvas || !canvas.parentElement) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse parallax interaction
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const onPointerMove = (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Scroll parallax
  let scrollY = 0;
  let targetScrollY = 0;
  const onScroll = () => {
    targetScrollY = window.scrollY * 0.0015;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = null;
  let isVisible = true;

  // IntersectionObserver to pause WebGL rendering when lower sections are out of view
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !raf && !still) {
        tick();
      }
    },
    { threshold: 0.01 }
  );
  observer.observe(canvas);

  const tick = () => {
    if (!isVisible || document.hidden) {
      raf = null;
      return;
    }
    raf = requestAnimationFrame(tick);

    // Smooth lerp for mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    scrollY += (targetScrollY - scrollY) * 0.05;

    // 3D rotations
    knot.rotation.x += 0.003;
    knot.rotation.y += 0.005;
    knot.position.y = -2 + Math.sin(Date.now() * 0.0008) * 0.8 - scrollY * 2;
    knot.position.x = 6 + mouse.x * 1.5;

    particles.rotation.y += 0.0008;
    particles.rotation.x = mouse.y * 0.15;
    particles.rotation.z = mouse.x * 0.15;

    camera.position.x = mouse.x * 1.2;
    camera.position.y = mouse.y * 1.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (isVisible && !raf && !still) {
      tick();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  renderer.render(scene, camera);
  if (!still) {
    raf = requestAnimationFrame(tick);
  }

  return () => {
    if (raf) cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    knotGeo.dispose();
    knotMat.dispose();
    particleGeo.dispose();
    particleMat.dispose();
    pTexture.dispose();
    renderer.dispose();
  };
}
