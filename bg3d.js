/**
 * PhineX 3D Background Animation — Mobile-Ready Edition
 * Drop-in script: <script src="bg3d.js"></script> anywhere in <head> or <body>
 * ✓ Works when loaded from <head> (waits for DOM)
 * ✓ Three.js multi-CDN fallback (cdnjs → jsdelivr → unpkg)
 * ✓ Touch + gyroscope camera follow on mobile
 * ✓ Reduced particle/shape count on low-power devices
 * ✓ Responsive resize handler
 */
(function () {
  'use strict';

  /* ── Wait for DOM — safe to put in <head> ────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    /* ── 1. Inject canvas ─────────────────────────────────────── */
    if (document.getElementById('pxBgCanvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'pxBgCanvas';
    const target = document.querySelector('.left-panel') || document.body;
    const isInPanel = target !== document.body;
    canvas.style.cssText = isInPanel
      ? 'position:absolute;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;'
      : 'position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;';
    target.insertBefore(canvas, target.firstChild);

    /* ── 2. Load Three.js — multi-CDN fallback ────────────────── */
    const THREE_CDNS = [
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
      'https://unpkg.com/three@0.128.0/build/three.min.js'
    ];
    function loadThree(cb) {
      if (window.THREE) { cb(); return; }
      function tryNext(urls) {
        if (!urls.length) { console.warn('bg3d: Three.js failed on all CDNs'); return; }
        const s = document.createElement('script');
        s.src = urls[0];
        s.onload  = cb;
        s.onerror = () => tryNext(urls.slice(1));
        document.head.appendChild(s);
      }
      tryNext(THREE_CDNS);
    }
    loadThree(boot);
  }

  /* ── 3. Boot ─────────────────────────────────────────────────── */
  function boot() {
    const canvas = document.getElementById('pxBgCanvas');
    if (!canvas) return;

    /* window dimensions — canvas.clientWidth is 0 before first layout paint */
    const W = () => canvas.clientWidth  || window.innerWidth;
    const H = () => canvas.clientHeight || window.innerHeight;

    const isMobile   = window.innerWidth <= 768 || ('ontouchstart' in window);
    const isLowPower = isMobile && window.innerWidth <= 480;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 1000);
    camera.position.z = 55;

    /* ── Pointer / touch tracking ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('mousemove', e => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      mouse.tx = (t.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (t.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* Gyroscope on mobile */
    const gyro = { x: 0, y: 0 };
    if (isMobile && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        if (e.gamma != null) {
          gyro.y = Math.max(-1, Math.min(1,  e.gamma       / 30));
          gyro.x = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
        }
      }, { passive: true });
    }

    /* ── 4. WIREFRAME SHAPES ───────────────────────────────────── */
    const SHAPE_DEFS = [
      { geo: () => new THREE.IcosahedronGeometry(13, 1),        color: 0x39ff14, opacity: 0.065, pos: [-34, 13,-18], speed: [.00050,.00090,.00040] },
      { geo: () => new THREE.TorusGeometry(11, 0.55, 10, 52),   color: 0x00ffcc, opacity: 0.050, pos: [ 31,-10,-12], speed: [.00080,.00000,.00070] },
      { geo: () => new THREE.OctahedronGeometry(9, 1),          color: 0x00aaff, opacity: 0.040, pos: [  5, 23,-28], speed: [.00060,.00070,.00030] },
      { geo: () => new THREE.TorusKnotGeometry(5.5,1.2,90,12),  color: 0xff39a0, opacity: 0.045, pos: [-19,-19, -9], speed: [.00040,.00060,.00050] },
      { geo: () => new THREE.TetrahedronGeometry(9, 2),         color: 0xffaa00, opacity: 0.040, pos: [ 22, 19,-24], speed: [.00070,.00050,.00060] },
      { geo: () => new THREE.DodecahedronGeometry(7, 0),        color: 0xaa39ff, opacity: 0.038, pos: [ -9,-26,-16], speed: [.00030,.00080,.00045] },
      { geo: () => new THREE.ConeGeometry(6, 15, 8, 1, true),   color: 0x00ffff, opacity: 0.042, pos: [ 36, 21,-32], speed: [.00090,.00030,.00070] },
      { geo: () => new THREE.CylinderGeometry(3,9,13,7,1,true), color: 0xff6600, opacity: 0.038, pos: [-27,  6,-21], speed: [.00050,.00100,.00030] },
      { geo: () => new THREE.RingGeometry(7, 9, 32),            color: 0xffd700, opacity: 0.040, pos: [ 14,-28,-10], speed: [.00110,.00020,.00080] },
      { geo: () => new THREE.SphereGeometry(6, 8, 8),           color: 0xff0066, opacity: 0.035, pos: [-40, -8,-26], speed: [.00035,.00075,.00055] },
    ];
    const shapeLimit  = isLowPower ? 3 : isMobile ? 6 : 10;
    const shapeMeshes = SHAPE_DEFS.slice(0, shapeLimit).map(def => {
      const mat  = new THREE.MeshBasicMaterial({
        color: def.color, wireframe: true, transparent: true,
        opacity: def.opacity, blending: THREE.AdditiveBlending, depthWrite: false
      });
      const mesh = new THREE.Mesh(def.geo(), mat);
      mesh.position.set(...def.pos);
      scene.add(mesh);
      return { mesh, speed: def.speed, mat, base: def.opacity };
    });

    /* ── 5. PARTICLE NETWORK ───────────────────────────────────── */
    const N   = isLowPower ? 50 : isMobile ? 80 : 170;
    const SX  = 95, SY = 70, SZ = 55;
    const ptPos = new Float32Array(N * 3);
    const vel   = [];
    for (let i = 0; i < N; i++) {
      ptPos[i*3]   = (Math.random() - 0.5) * SX;
      ptPos[i*3+1] = (Math.random() - 0.5) * SY;
      ptPos[i*3+2] = (Math.random() - 0.5) * SZ;
      vel.push({ x:(Math.random()-.5)*.022, y:(Math.random()-.5)*.016, z:(Math.random()-.5)*.010 });
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
      color: 0x39ff14, size: isMobile ? 0.65 : 0.5,
      transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));

    const MAX_SEG = N * 10;
    const lPos = new Float32Array(MAX_SEG * 6);
    const lCol = new Float32Array(MAX_SEG * 6);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lGeo.setAttribute('color',    new THREE.BufferAttribute(lCol, 3));
    scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.40,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));
    const CONN   = isMobile ? 10 : 13;
    const C_NEON = new THREE.Color(0x39ff14);
    const C_CYAN = new THREE.Color(0x00ffcc);

    function updateNet() {
      let idx = 0;
      for (let i = 0; i < N; i++) {
        if (Math.abs(ptPos[i*3])   > SX/2) vel[i].x *= -1;
        if (Math.abs(ptPos[i*3+1]) > SY/2) vel[i].y *= -1;
        if (Math.abs(ptPos[i*3+2]) > SZ/2) vel[i].z *= -1;
        ptPos[i*3]   += vel[i].x;
        ptPos[i*3+1] += vel[i].y;
        ptPos[i*3+2] += vel[i].z;
        for (let j = i+1; j < N && idx < MAX_SEG; j++) {
          const dx = ptPos[i*3]-ptPos[j*3],
                dy = ptPos[i*3+1]-ptPos[j*3+1],
                dz = ptPos[i*3+2]-ptPos[j*3+2];
          const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (d < CONN) {
            const a = 1 - d/CONN;
            const c = d < CONN * 0.5 ? C_CYAN : C_NEON;
            lPos.set([ptPos[i*3],ptPos[i*3+1],ptPos[i*3+2],
                      ptPos[j*3],ptPos[j*3+1],ptPos[j*3+2]], idx*6);
            lCol.set([c.r*a,c.g*a,c.b*a, c.r*a,c.g*a,c.b*a], idx*6);
            idx++;
          }
        }
      }
      for (let k = idx; k < MAX_SEG; k++) lPos.fill(0, k*6, k*6+6);
      lGeo.attributes.position.needsUpdate = true;
      lGeo.attributes.color.needsUpdate    = true;
      lGeo.setDrawRange(0, idx * 2);
      ptGeo.attributes.position.needsUpdate = true;
    }

    /* ── 6. PULSING RINGS ──────────────────────────────────────── */
    const rGroup = new THREE.Group();
    rGroup.position.set(0, 0, -38);
    [[22,0x39ff14,0.050],[34,0x00ffcc,0.032],[48,0x00aaff,0.020],[60,0xaa39ff,0.014]]
    .forEach(([r, c, o]) => {
      const mat  = new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: o,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.18, isMobile ? 64 : 128), mat);
      ring.rotation.x = Math.PI / 2;
      rGroup.add(ring);
    });
    scene.add(rGroup);

    /* ── 7. BREATHING ORB ──────────────────────────────────────── */
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14, transparent: true, opacity: 0.045,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, isMobile ? 16 : 32, isMobile ? 16 : 32), orbMat
    );
    orb.position.set(0, 0, -5);
    scene.add(orb);

    /* ── 8. STAR FIELD ─────────────────────────────────────────── */
    const starCount = isLowPower ? 300 : isMobile ? 550 : 900;
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3]   = (Math.random() - 0.5) * 320;
      starPos[i*3+1] = (Math.random() - 0.5) * 220;
      starPos[i*3+2] = -90 + Math.random() * -140;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0x39ff14, size: isMobile ? 0.25 : 0.18,
      transparent: true, opacity: 0.20,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));

    /* ── 9. ANIMATION LOOP ─────────────────────────────────────── */
    let t = 0;
    (function animate() {
      requestAnimationFrame(animate);
      t += 0.01;

      const cx = isMobile ? gyro.y : mouse.tx;
      const cy = isMobile ? gyro.x : mouse.ty;
      mouse.x += (cx - mouse.x) * 0.045;
      mouse.y += (cy - mouse.y) * 0.045;
      camera.position.x += ( mouse.x * 7 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      updateNet();

      shapeMeshes.forEach(({ mesh, speed, mat, base }, i) => {
        mesh.rotation.x += speed[0];
        mesh.rotation.y += speed[1];
        mesh.rotation.z += speed[2];
        mat.opacity = base * (0.8 + 0.2 * Math.sin(t * 0.8 + i * 0.9));
      });

      rGroup.rotation.z += 0.0014;
      rGroup.children.forEach((r, i) => {
        r.material.opacity = 0.020 + Math.sin(t + i * 1.4) * 0.014;
      });

      const sc = 1 + Math.sin(t * 0.7) * 0.15;
      orb.scale.set(sc, sc, sc);
      orbMat.opacity = 0.030 + Math.sin(t * 0.7) * 0.018;

      renderer.render(scene, camera);
    })();

    /* ── Resize ─────────────────────────────────────────────────── */
    window.addEventListener('resize', () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    });
  }

})();