import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

(function () {
  const html = document.documentElement;
  const body = document.body;

  const config = {
    page: body.dataset.page || '',
    intro: body.dataset.intro === 'true',
    music: body.dataset.music === 'true'
  };

  function q(selector) {
    return document.querySelector(selector);
  }

  function qa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function initAboutNavLabel() {
    const update = () => {
      const lang = localStorage.getItem('genex_lang') || 'ar';
      qa('[data-nav-about]').forEach((link) => {
        link.textContent = lang === 'ar' ? 'عن جينكس' : 'About GENEX';
        link.setAttribute('href', './about.html');
        link.style.display = '';
        link.style.visibility = 'visible';
        link.style.opacity = '1';
      });
    };

    update();
    window.addEventListener('storage', update);
    document.addEventListener('DOMContentLoaded', update);
  }

  function initPageTransition() {
    const transition = q('#pageTransition');
    if (!transition) return;

    qa('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.hasAttribute('target')) return;

      link.addEventListener('click', function (e) {
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
    let mouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };
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
    scene.fog = new THREE.FogExp2(0x05070f, 0.075);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
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

    addShape(new THREE.Mesh(new THREE.TorusKnotGeometry(0.85, 0.20, 180, 24), phys(0xb41428, 0.06, 0.86)), {
      x:-3.1
