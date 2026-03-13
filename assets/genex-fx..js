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

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
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
      targetMouse.x = e.clientX / w;
      targetMouse.y = e.clientY / h;
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
    scene.fog = new THREE.FogExp2(0x05070f, 0.065);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const world = new THREE.Group();
    scene.add(world);

    const ambient = new THREE.AmbientLight(0xffffff, 0.92);
    scene.add(ambient);

    const crimsonLight = new THREE.PointLight(0xb41428, 18, 36, 2);
    crimsonLight.position.set(2.8, 2.2, 5.2);
    scene.add(crimsonLight);

    const whiteLight = new THREE.PointLight(0xffffff, 8, 24, 2);
    whiteLight.position.set(-2.0, 1.6, 4.8);
    scene.add(whiteLight);

    function phys(color, transmission = 0.18, opacity = 0.85) {
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.12,
        metalness: 0.12,
        transmission,
        transparent: true,
        opacity,
        clearcoat: 1,
        clearcoatRoughness: 0.10
      });
    }

    const objects = [];
    const shapes = new THREE.Group();
    world.add(shapes);

    function addShape(mesh, opts) {
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.set(opts.rx, opts.ry, opts.rz);
      mesh.userData = { ...opts };
      shapes.add(mesh);
      objects.push(mesh);
    }

    addShape(new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.22, 180, 24), phys(0xb41428, 0.06, 0.86)), {
      x:-3.4, y:1.9, z:-0.4, rx:0.5, ry:0.2, rz:0.2, speedA:0.8, speedB:0.6
    });

    addShape(new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), phys(0xffffff, 0.30, 0.58)), {
      x:-0.2, y:2.5, z:-1.4, rx:0.2, ry:0.4, rz:0.0, speedA:0.65, speedB:0.55
    });

    addShape(new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.18, 26, 160), phys(0xb41428, 0.12, 0.80)), {
      x:3.2, y:1.4, z:-0.8, rx:1.0, ry:0.2, rz:0.0, speedA:0.9, speedB:0.45
    });

    addShape(new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), phys(0xffffff, 0.24, 0.50)), {
      x:-3.6, y:-1.2, z:-1.8, rx:0.2, ry:0.6, rz:0.3, speedA:0.75, speedB:0.7
    });

    addShape(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.26, 6, 1, true), phys(0xb41428, 0.14, 0.78)), {
      x:-0.3, y:-1.1, z:-0.2, rx:1.2, ry:0.5, rz:0.2, speedA:0.55, speedB:0.45
    });

    addShape(new THREE.Mesh(new THREE.TorusKnotGeometry(0.68, 0.18, 150, 22, 3, 5), phys(0xffffff, 0.18, 0.56)), {
      x:3.0, y:-1.25, z:-1.1, rx:0.2, ry:0.2, rz:0.8, speedA:0.65, speedB:0.8
    });

    addShape(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), phys(0xffffff, 0.14, 0.42)), {
      x:1.4, y:3.0, z:-2.2, rx:0.3, ry:0.2, rz:0.1, speedA:0.52, speedB:0.61
    });

    addShape(new THREE.Mesh(new THREE.SphereGeometry(0.8, 28, 28), phys(0xb41428, 0.10, 0.54)), {
      x:-1.8, y:3.2, z:-2.0, rx:0.1, ry:0.1, rz:0.0, speedA:0.42, speedB:0.64
    });

    const rings = [];
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8 + i * 0.32, 0.012, 8, 220),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xb41428 : 0xffffff,
          transparent: true,
          opacity: i % 2 === 0 ? 0.13 : 0.09
        })
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.position.z = -2.8 - i * 0.16;
      ring.userData.offset = i * 0.42;
      world.add(ring);
      rings.push(ring);
    }

    const particleCount = 2600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.4 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const crimson = i % 5 === 0;
      particleColors[i * 3] = crimson ? 0.70 : 1.0;
      particleColors[i * 3 + 1] = crimson ? 0.08 : 1.0;
      particleColors[i * 3 + 2] = crimson ? 0.16 : 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.034,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
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
      base.addColorStop(0, '#05070f');
      base.addColorStop(1, '#090d18');
      backCtx.fillStyle = base;
      backCtx.fillRect(0, 0, w, h);

      const nebulae = [
        { x: 0.18, y: 0.18, r: 0.34, a: 0.28, dx: 0.7, dy: 0.5 },
        { x: 0.78, y: 0.16, r: 0.28, a: 0.16, dx: -0.5, dy: 0.42 },
        { x: 0.50, y: 0.72, r: 0.38, a: 0.22, dx: 0.38, dy: -0.36 },
        { x: 0.84, y: 0.64, r: 0.24, a: 0.12, dx: -0.6, dy: -0.45 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';
      backCtx.filter = 'blur(56px) saturate(155%)';

      nebulae.forEach((o, i) => {
        const cx = w * o.x + Math.sin(t * o.dx + i) * w * 0.06 + (mouse.x - 0.5) * 90;
        const cy = h * o.y + Math.cos(t * o.dy + i) * h * 0.06 + (mouse.y - 0.5) * 70 + scrollCurrent * 160;
        const r = Math.min(w, h) * o.r;
        const g = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${o.a * 0.74})`);
        g.addColorStop(0.28, `rgba(180,20,40,${o.a})`);
        g.addColorStop(0.7, `rgba(180,20,40,${o.a * 0.18})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        backCtx.fillStyle = g;
        backCtx.beginPath();
        backCtx.arc(cx, cy, r, 0, Math.PI * 2);
        backCtx.fill();
      });

      backCtx.restore();

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 11; i++) {
        const yBase = h * (0.08 + i * 0.085);
        const shift = Math.sin(t * 0.72 + i * 0.82) * 26;

        const grad = backCtx.createLinearGradient(0, yBase, w, yBase + shift);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.16, 'rgba(255,255,255,0.018)');
        grad.addColorStop(0.50, 'rgba(180,20,40,0.10)');
        grad.addColorStop(0.84, 'rgba(255,255,255,0.018)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        backCtx.strokeStyle = grad;
        backCtx.lineWidth = 1.15;
        backCtx.beginPath();

        for (let x = 0; x <= w; x += 18) {
          const y =
            yBase +
            Math.sin(x * 0.006 + t * 1.2 + i) * 18 +
            Math.cos(x * 0.003 + t * 0.76 + i) * 9 +
            shift +
            scrollCurrent * 54;

          if (x === 0) backCtx.moveTo(x, y);
          else backCtx.lineTo(x, y);
        }
        backCtx.stroke();
      }

      backCtx.restore();

      backCtx.save();
      backCtx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 180; i++) {
        const x = ((i * 131) % w) + Math.sin(t * 0.18 + i) * 8;
        const y = ((i * 83) % h) + Math.cos(t * 0.16 + i) * 8;
        const size = i % 7 === 0 ? 1.8 : 1.0;
        backCtx.beginPath();
        backCtx.arc(x, y, size, 0, Math.PI * 2);
        backCtx.fillStyle = i % 5 === 0 ? 'rgba(180,20,40,0.28)' : 'rgba(255,255,255,0.18)';
        backCtx.fill();
      }
      backCtx.restore();
    }

    function drawFrontFx(t) {
      frontCtx.clearRect(0, 0, w, h);

      frontCtx.save();
      frontCtx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 5; i++) {
        const cx = w * (0.12 + i * 0.18) + Math.sin(t * (0.45 + i * 0.08) + i) * 42;
        const cy = h * (0.16 + (i % 3) * 0.22) + Math.cos(t * (0.52 + i * 0.05) + i) * 30;
        const r = Math.min(w, h) * (0.10 + i * 0.03);

        const g = frontCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        g.addColorStop(0, 'rgba(255,255,255,0.05)');
        g.addColorStop(0.4, 'rgba(180,20,40,0.06)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        frontCtx.fillStyle = g;
        frontCtx.beginPath();
        frontCtx.arc(cx, cy, r, 0, Math.PI * 2);
        frontCtx.fill();
      }

      for (let i = 0; i < 20; i++) {
        const px = (i / 20) * w + Math.sin(t * 0.35 + i) * 44;
        const py = h * (0.12 + (i % 7) * 0.11) + Math.cos(t * 0.46 + i) * 12;
        const length = 110 + (i % 5) * 46;

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

      for (let i = 0; i < 80; i++) {
        const x = ((i * 97) % w) + Math.sin(t * 0.82 + i) * 24;
        const y = ((i * 67) % h) + Math.cos(t * 0.64 + i) * 20;
        const size = i % 5 === 0 ? 2.2 : 1.2;

        frontCtx.beginPath();
        frontCtx.arc(x, y, size, 0, Math.PI * 2);
        frontCtx.fillStyle = i % 4 === 0 ? 'rgba(180,20,40,0.24)' : 'rgba(255,255,255,0.18)';
        frontCtx.fill();
      }

      frontCtx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

      drawBackFx(t);
      drawFrontFx(t);

      camera.position.x = (mouse.x - 0.5) * 1.8;
      camera.position.y = -((mouse.y - 0.5) * 0.9) - scrollCurrent * 1.2;
      camera.position.z = 12 - scrollCurrent * 1.2;
      camera.lookAt(0, 0, 0);

      world.rotation.y = (mouse.x - 0.5) * 0.36 + Math.sin(t * 0.18) * 0.05;
      world.rotation.x = -((mouse.y - 0.5) * 0.18);
      world.position.y = -scrollCurrent * 0.72;

      objects.forEach((mesh, i) => {
        const u = mesh.userData;
        mesh.position.x = u.x + Math.sin(t * u.speedA + i) * 0.2 + (mouse.x - 0.5) * 0.85;
        mesh.position.y = u.y + Math.cos(t * u.speedB + i * 0.7) * 0.24 + (mouse.y - 0.5) * 0.42;
        mesh.rotation.x += 0.002 + (i * 0.0002);
        mesh.rotation.y += 0.003 + (i * 0.00025);
        mesh.rotation.z += 0.0012 + (i * 0.00012);
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
        pos[ix + 1] += Math.sin(t + i * 0.012) * 0.00062;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.03;
      particles.rotation.x = (mouse.y - 0.5) * 0.12;

      crimsonLight.position.x = 2.8 + Math.sin(t * 0.8) * 0.8;
      crimsonLight.position.y = 2.2 + Math.cos(t * 0.85) * 0.5;
      whiteLight.position.x = -2.0 + Math.cos(t * 0.68) * 0.75;
      whiteLight.position.y = 1.6 + Math.sin(t * 0.75) * 0.35;

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
