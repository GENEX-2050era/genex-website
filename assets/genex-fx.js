import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

(function () {
  const body = document.body;
  const config = {
    intro: body.dataset.intro === 'true',
    music: body.dataset.music === 'true'
  };

  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  function refreshAboutLabel() {
    const lang = localStorage.getItem('genex_lang') || 'ar';
    qa('[data-nav-about]').forEach((link) => {
      link.textContent = lang === 'ar' ? 'عن جينكس' : 'About GENEX';
      link.setAttribute('href', './about.html');
      link.style.display = '';
      link.style.visibility = 'visible';
      link.style.opacity = '1';
      link.style.pointerEvents = 'auto';
    });
  }

  function initAboutNavLabel() {
    refreshAboutLabel();

    window.addEventListener('storage', refreshAboutLabel);
    document.addEventListener('DOMContentLoaded', refreshAboutLabel);

    qa('.lang-switch button').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(refreshAboutLabel, 0);
      });
    });
  }

  function initPageTransition() {
    const transition = q('#pageTransition');

    qa('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.hasAttribute('target')) return;

      link.addEventListener('click', function (e) {
        if (!transition) return;
        e.preventDefault();
        transition.classList.add('active');
        setTimeout(() => {
          window.location.href = this.getAttribute('href');
        }, 520);
      });
    });
  }

  function initIntro() {
    const intro = q('#genexIntro');
    if (!intro || !config.intro) return;

    const introSeen = sessionStorage.getItem('genex_intro_seen');
    if (introSeen) {
      intro.classList.add('hidden');
    } else {
      setTimeout(() => {
        intro.classList.add('hidden');
        sessionStorage.setItem('genex_intro_seen', '1');
      }, 2600);
    }
  }

  function initTilt() {
    qa('.tilt-card').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1400px) rotateY(${px * 8}deg) rotateX(${py * -8}deg) translateZ(0)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  function initMusic() {
    if (!config.music) return;

    const audio = q('#siteMusic');
    const btn = q('#musicToggle');
    if (!audio || !btn) return;

    audio.volume = 0.16;

    const saved = localStorage.getItem('genex_music_enabled');

    async function playMusic() {
      try {
        await audio.play();
        localStorage.setItem('genex_music_enabled', 'true');
        btn.textContent = '♫';
        btn.style.opacity = '1';
      } catch (e) {
        btn.textContent = '♪';
        btn.style.opacity = '.85';
      }
    }

    function pauseMusic() {
      audio.pause();
      localStorage.setItem('genex_music_enabled', 'false');
      btn.textContent = '♪';
      btn.style.opacity = '.85';
    }

    btn.addEventListener('click', () => {
      if (audio.paused) playMusic();
      else pauseMusic();
    });

    if (saved === 'true') {
      const startAfterInteraction = async () => {
        await playMusic();
      };
      window.addEventListener('click', startAfterInteraction, { once: true });
      window.addEventListener('touchstart', startAfterInteraction, { once: true });
      window.addEventListener('keydown', startAfterInteraction, { once: true });
    }
  }

  function initVisuals() {
    const backCanvas = q('#backFxCanvas');
    const frontCanvas = q('#frontFxCanvas');
    const webglCanvas = q('#webglCanvas');

    if (!backCanvas || !frontCanvas || !webglCanvas) return;

    const backCtx = backCanvas.getContext('2d');
    const frontCtx = frontCanvas.getContext('2d');

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollCurrent = 0;

    function resize2D() {
      w = window.innerWidth;
      h = window.innerHeight;

      [backCanvas, frontCanvas].forEach((canvas) => {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      });

      backCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frontCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize2D);

    window.addEventListener('mousemove', (e) => {
      mouseTarget.x = (e.clientX / w) * 2 - 1;
      mouseTarget.y = (e.clientY / h) * 2 - 1;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      scrollTarget = window.scrollY / maxScroll;
    }, { passive: true });

    const renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas,
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.055);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 140);
    camera.position.set(0, 0, 13);

    const world = new THREE.Group();
    scene.add(world);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const crimsonLight = new THREE.PointLight(0xb41428, 22, 44, 2);
    crimsonLight.position.set(3, 2.4, 5.5);
    scene.add(crimsonLight);

    const whiteLight = new THREE.PointLight(0xffffff, 8, 30, 2);
    whiteLight.position.set(-2.4, 1.8, 5.2);
    scene.add(whiteLight);

    const nucleiGroup = new THREE.Group();
    world.add(nucleiGroup);

    const nuclei = [];

    function nucleusMaterial(colorHex, opacity = 0.92) {
      return new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.12,
        metalness: 0.08,
        transmission: 0.12,
        transparent: true,
        opacity,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        emissive: colorHex,
        emissiveIntensity: colorHex === 0xffffff ? 0.8 : 0.45
      });
    }

    function glowMaterial(colorHex, opacity = 0.22) {
      return new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        depthWrite: false
      });
    }

    function ringMaterial(colorHex, opacity = 0.16) {
      return new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        depthWrite: false
      });
    }

    function createNucleus({
      x, y, z, scale, isWhite, orbitCount, seed
    }) {
      const group = new THREE.Group();
      const color = isWhite ? 0xffffff : 0x8f1222;

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 28, 28),
        nucleusMaterial(color, isWhite ? 0.95 : 0.90)
      );
      core.scale.setScalar(scale);

      const glow1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 28, 28),
        glowMaterial(color, isWhite ? 0.16 : 0.14)
      );
      glow1.scale.setScalar(scale * 1.7);

      const glow2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 28, 28),
        glowMaterial(color, isWhite ? 0.08 : 0.07)
      );
      glow2.scale.setScalar(scale * 2.35);

      group.add(glow2);
      group.add(glow1);
      group.add(core);

      const rings = [];

      for (let i = 0; i < orbitCount; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(scale * (1.25 + i * 0.38), scale * 0.015, 8, 160),
          ringMaterial(isWhite ? 0xffffff : 0xb41428, isWhite ? 0.10 : 0.12)
        );

        ring.rotation.x = (Math.PI / 2.2) + i * 0.35;
        ring.rotation.y = seed * 0.6 + i * 0.8;
        ring.rotation.z = seed * 0.4 + i * 0.45;
        group.add(ring);
        rings.push(ring);
      }

      group.position.set(x, y, z);

      nucleiGroup.add(group);
      nuclei.push({
        group,
        core,
        glow1,
        glow2,
        rings,
        baseX: x,
        baseY: y,
        baseZ: z,
        scale,
        isWhite,
        seed,
        driftA: 0.24 + (seed % 7) * 0.03,
        driftB: 0.20 + (seed % 5) * 0.035,
        driftC: 0.16 + (seed % 6) * 0.028
      });
    }

    const nucleusLayout = [
      { x:-5.8, y: 3.2, z:-4.8, scale:1.10, isWhite:false, orbitCount:2, seed:1 },
      { x:-2.4, y: 4.6, z:-6.4, scale:0.82, isWhite:true,  orbitCount:3, seed:2 },
      { x: 1.4, y: 4.1, z:-3.8, scale:1.25, isWhite:false, orbitCount:2, seed:3 },
      { x: 4.9, y: 3.0, z:-7.0, scale:0.72, isWhite:true,  orbitCount:3, seed:4 },

      { x:-6.4, y: 0.6, z:-8.6, scale:0.62, isWhite:true,  orbitCount:2, seed:5 },
      { x:-2.0, y: 1.4, z:-2.8, scale:1.42, isWhite:false, orbitCount:3, seed:6 },
      { x: 2.3, y: 0.3, z:-9.2, scale:0.58, isWhite:true,  orbitCount:2, seed:7 },
      { x: 5.8, y: 1.2, z:-4.2, scale:1.00, isWhite:false, orbitCount:2, seed:8 },

      { x:-5.2, y:-2.4, z:-3.4, scale:1.20, isWhite:false, orbitCount:2, seed:9 },
      { x:-1.3, y:-2.8, z:-7.8, scale:0.74, isWhite:true,  orbitCount:3, seed:10 },
      { x: 2.8, y:-2.2, z:-4.9, scale:1.08, isWhite:false, orbitCount:2, seed:11 },
      { x: 6.1, y:-3.0, z:-8.9, scale:0.60, isWhite:true,  orbitCount:2, seed:12 },

      { x:-3.8, y: 5.8, z:-10.6, scale:0.50, isWhite:true, orbitCount:2, seed:13 },
      { x: 3.9, y: 5.5, z:-10.2, scale:0.52, isWhite:false,orbitCount:2, seed:14 },
      { x:-7.2, y: 2.2, z:-11.6, scale:0.44, isWhite:true, orbitCount:1, seed:15 },
      { x: 7.0, y:-0.8, z:-11.2, scale:0.46, isWhite:false,orbitCount:1, seed:16 },

      { x:-6.8, y:-4.8, z:-12.4, scale:0.40, isWhite:true, orbitCount:1, seed:17 },
      { x:-0.2, y: 6.0, z:-12.0, scale:0.42, isWhite:false,orbitCount:1, seed:18 },
      { x: 6.7, y: 4.7, z:-12.8, scale:0.38, isWhite:true, orbitCount:1, seed:19 },
      { x: 4.6, y:-5.2, z:-12.0, scale:0.43, isWhite:false,orbitCount:1, seed:20 }
    ];

    nucleusLayout.forEach(createNucleus);

    const rings = [];
    for (let i = 0; i < 7; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.9 + i * 0.34, 0.012, 8, 230),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xb41428 : 0xffffff,
          transparent: true,
          opacity: i % 2 === 0 ? 0.13 : 0.08
        })
      );
      ring.rotation.x = Math.PI / 2.35;
      ring.position.z = -2.8 - i * 0.18;
      ring.userData.offset = i * 0.45;
      world.add(ring);
      rings.push(ring);
    }

    const particleCount = 3200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 10.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.75;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const crimson = i % 6 === 0;
      particleColors[i * 3] = crimson ? 0.70 : 1.0;
      particleColors[i * 3 + 1] = crimson ? 0.08 : 1.0;
      particleColors[i * 3 + 2] = crimson ? 0.16 : 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    function resizeWebGL() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', resizeWebGL);

    const clock = new THREE.Clock();

    function drawBackFx(t) {
      backCtx.clearRect(0, 0, w, h);

      const base = backCtx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, '#04060d');
      base.addColorStop(1, '#090d18');
      backCtx.fillStyle = base;
      backCtx.fillRect(0, 0, w, h);

      const nebulae = [
        { x: 0.16, y: 0.16, r: 0.36, a: 0.28, dx: 0.7, dy: 0.45 },
        { x: 0.78, y: 0.14, r: 0.30, a: 0.17, dx: -0.5, dy: 0.38 },
        { x: 0.52, y: 0.72, r: 0.40, a: 0.23, dx: 0.36, dy: -0.34 },
        { x: 0.84, y: 0.62, r: 0.26, a: 0.13, dx: -0.58, dy: -0.42 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';
      backCtx.filter = 'blur(60px) saturate(165%)';

      nebulae.forEach((o, i) => {
        const cx = w * o.x + Math.sin(t * o.dx + i) * w * 0.06 + mouse.x * 55;
        const cy = h * o.y + Math.cos(t * o.dy + i) * h * 0.06 + mouse.y * 40 + scrollCurrent * 160;
        const r = Math.min(w, h) * o.r;

        const g = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${o.a * 0.76})`);
        g.addColorStop(0.28, `rgba(180,20,40,${o.a})`);
        g.addColorStop(0.70, `rgba(180,20,40,${o.a * 0.16})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        backCtx.fillStyle = g;
        backCtx.beginPath();
        backCtx.arc(cx, cy, r, 0, Math.PI * 2);
        backCtx.fill();
      });

      backCtx.restore();

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 12; i++) {
        const yBase = h * (0.06 + i * 0.083);
        const shift = Math.sin(t * 0.7 + i * 0.8) * 28;

        const grad = backCtx.createLinearGradient(0, yBase, w, yBase + shift);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.14, 'rgba(255,255,255,0.02)');
        grad.addColorStop(0.50, 'rgba(180,20,40,0.12)');
        grad.addColorStop(0.86, 'rgba(255,255,255,0.02)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        backCtx.strokeStyle = grad;
        backCtx.lineWidth = 1.1;
        backCtx.beginPath();

        for (let x = 0; x <= w; x += 18) {
          const y =
            yBase +
            Math.sin(x * 0.006 + t * 1.15 + i) * 18 +
            Math.cos(x * 0.003 + t * 0.74 + i) * 10 +
            shift +
            scrollCurrent * 58;

          if (x === 0) backCtx.moveTo(x, y);
          else backCtx.lineTo(x, y);
        }

        backCtx.stroke();
      }

      backCtx.restore();

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 260; i++) {
        const x = ((i * 131) % w) + Math.sin(t * 0.18 + i) * 8;
        const y = ((i * 83) % h) + Math.cos(t * 0.16 + i) * 8;
        const size = i % 7 === 0 ? 1.9 : 1.0;
        backCtx.beginPath();
        backCtx.arc(x, y, size, 0, Math.PI * 2);
        backCtx.fillStyle = i % 5 === 0 ? 'rgba(180,20,40,0.30)' : 'rgba(255,255,255,0.18)';
        backCtx.fill();
      }
      backCtx.restore();
    }

    function drawFrontFx(t) {
      frontCtx.clearRect(0, 0, w, h);

      frontCtx.save();
      frontCtx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 6; i++) {
        const cx = w * (0.10 + i * 0.16) + Math.sin(t * (0.42 + i * 0.07) + i) * 46 + mouse.x * 22;
        const cy = h * (0.14 + (i % 3) * 0.22) + Math.cos(t * (0.50 + i * 0.05) + i) * 30 + mouse.y * 18;
        const r = Math.min(w, h) * (0.09 + i * 0.025);

        const g = frontCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        g.addColorStop(0, 'rgba(255,255,255,0.06)');
        g.addColorStop(0.4, 'rgba(180,20,40,0.06)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        frontCtx.fillStyle = g;
        frontCtx.beginPath();
        frontCtx.arc(cx, cy, r, 0, Math.PI * 2);
        frontCtx.fill();
      }

      for (let i = 0; i < 22; i++) {
        const px = (i / 22) * w + Math.sin(t * 0.35 + i) * 44;
        const py = h * (0.12 + (i % 7) * 0.11) + Math.cos(t * 0.46 + i) * 12;
        const length = 110 + (i % 5) * 48;

        const grad = frontCtx.createLinearGradient(px, py, px + length, py);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.35, 'rgba(255,255,255,0.055)');
        grad.addColorStop(0.65, 'rgba(180,20,40,0.10)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + length * 0.48, py - 18, px + length, py + 2);
        frontCtx.stroke();
      }

      for (let i = 0; i < 110; i++) {
        const x = ((i * 97) % w) + Math.sin(t * 0.82 + i) * 24;
        const y = ((i * 67) % h) + Math.cos(t * 0.64 + i) * 20;
        const size = i % 5 === 0 ? 2.4 : 1.2;

        frontCtx.beginPath();
        frontCtx.arc(x, y, size, 0, Math.PI * 2);
        frontCtx.fillStyle = i % 4 === 0 ? 'rgba(180,20,40,0.24)' : 'rgba(255,255,255,0.20)';
        frontCtx.fill();
      }

      frontCtx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      mouse.x += (mouseTarget.x - mouse.x) * 0.06;
      mouse.y += (mouseTarget.y - mouse.y) * 0.06;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

      drawBackFx(t);
      drawFrontFx(t);

      camera.position.x = mouse.x * 1.4;
      camera.position.y = -(mouse.y * 0.8) - scrollCurrent * 1.15;
      camera.position.z = 13 - scrollCurrent * 1.3;
      camera.lookAt(0, 0, 0);

      world.rotation.y = mouse.x * 0.22 + Math.sin(t * 0.16) * 0.04;
      world.rotation.x = -(mouse.y * 0.11);
      world.position.y = -scrollCurrent * 0.72;

      nuclei.forEach((item, i) => {
        const phase = t * item.driftA + item.seed * 0.9;

        item.group.position.x = item.baseX + Math.sin(phase) * (0.16 + item.scale * 0.06) + mouse.x * (0.22 + item.scale * 0.04);
        item.group.position.y = item.baseY + Math.cos(t * item.driftB + item.seed) * (0.18 + item.scale * 0.07) + mouse.y * (0.14 + item.scale * 0.03);
        item.group.position.z = item.baseZ + Math.sin(t * item.driftC + item.seed * 0.7) * 0.18;

        item.core.rotation.y += 0.006 + item.scale * 0.001;
        item.core.rotation.x += 0.004 + item.scale * 0.0008;

        const pulse = 1 + Math.sin(t * 1.2 + item.seed) * 0.05;
        item.core.scale.setScalar(item.scale * pulse);
        item.glow1.scale.setScalar(item.scale * 1.7 * (1 + Math.sin(t * 0.9 + item.seed) * 0.04));
        item.glow2.scale.setScalar(item.scale * 2.35 * (1 + Math.cos(t * 0.7 + item.seed) * 0.05));

        item.rings.forEach((ring, idx) => {
          ring.rotation.z += 0.004 + idx * 0.0008;
          ring.rotation.y += 0.0025 + idx * 0.0006;
          ring.rotation.x += 0.0014 + idx * 0.0005;
        });
      });

      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.10 + i * 0.02);
        ring.rotation.y = Math.sin(t * 0.25 + i) * 0.25;
        const s = 1 + Math.sin(t * 0.9 + ring.userData.offset) * 0.04;
        ring.scale.set(s, s, s);
      });

      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const x = pos[ix];
        const z = pos[ix + 2];
        pos[ix] = x * Math.cos(0.0007) - z * Math.sin(0.0007);
        pos[ix + 2] = x * Math.sin(0.0007) + z * Math.cos(0.0007);
        pos[ix + 1] += Math.sin(t + i * 0.012) * 0.00065;
      }
      particleGeo.attributes.position.needsUpdate = true;

      particles.rotation.y = t * 0.03;
      particles.rotation.x = mouse.y * 0.08;

      crimsonLight.position.x = 3 + Math.sin(t * 0.8) * 0.8;
      crimsonLight.position.y = 2.4 + Math.cos(t * 0.85) * 0.5;
      whiteLight.position.x = -2.2 + Math.cos(t * 0.68) * 0.75;
      whiteLight.position.y = 1.7 + Math.sin(t * 0.75) * 0.35;

      renderer.render(scene, camera);
    }

    resize2D();
    resizeWebGL();
    animate();
  }

  initAboutNavLabel();
  initPageTransition();
  initIntro();
  initTilt();
  initMusic();
  initVisuals();
})();
