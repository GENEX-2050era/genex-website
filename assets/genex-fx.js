(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  const body = document.body;
  const introEnabled = body.dataset.intro === "true";
  const musicEnabled = body.dataset.music !== "false";

  function refreshAboutLabel() {
    const lang = localStorage.getItem("genex_lang") || "ar";
    qa("[data-nav-about]").forEach((link) => {
      link.textContent = lang === "ar" ? "عن جينكس" : "About GENEX";
      link.setAttribute("href", "./about.html");
    });
  }

  function initLanguageButtons() {
    const langButtons = qa(".lang-switch button");
    if (!langButtons.length) return;

    function applyDocumentDirection(lang) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("genex_lang", lang);

      langButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });

      refreshAboutLabel();
    }

    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyDocumentDirection(btn.dataset.lang || "ar");
      });
    });

    applyDocumentDirection(localStorage.getItem("genex_lang") || "ar");
  }

  function initAboutLabel() {
    refreshAboutLabel();
    window.addEventListener("storage", refreshAboutLabel);
  }

  function initHamburger() {
    qa(".mobile-toggle").forEach((btn) => {
      if (!btn.querySelector(".line")) {
        btn.innerHTML = `
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        `;
      }

      const nav = q("#mobileNav");
      btn.addEventListener("click", () => {
        btn.classList.toggle("is-open");
        if (nav) nav.classList.toggle("open");
      });
    });
  }

  function initReveal() {
    const items = qa(
      ".genex-panel, .genex-card, .feature, .stat, .cta, .service-card, .job-item, .value-card, .mission-card, .timeline-item, .info-item, .why-card, .about-card, .process-card"
    );

    const unique = [...new Set(items)];
    unique.forEach((el) => el.classList.add("reveal-on-scroll"));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    unique.forEach((el) => observer.observe(el));
  }

  function initTilt() {
    qa(".tilt-card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1400px) rotateY(${px * 7}deg) rotateX(${py * -7}deg)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  function initTransitions() {
    const transition = q("#pageTransition");
    if (!transition) return;

    qa('a[href]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (link.hasAttribute("target")) return;

      link.addEventListener("click", function (e) {
        e.preventDefault();
        transition.classList.add("active");
        setTimeout(() => {
          window.location.href = this.getAttribute("href");
        }, 420);
      });
    });
  }

  function initIntro() {
    const intro = q("#genexIntro");
    if (!intro || !introEnabled) return;

    const seen = sessionStorage.getItem("genex_intro_seen");
    if (seen) {
      intro.classList.add("hidden");
      return;
    }

    window.addEventListener("load", () => {
      setTimeout(() => {
        intro.classList.add("hidden");
        sessionStorage.setItem("genex_intro_seen", "1");
      }, 2200);
    });
  }

  function initMusic() {
    if (!musicEnabled) return;

    const audio = q("#siteMusic");
    if (!audio) return;

    let btn = q("#musicToggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "musicToggle";
      btn.setAttribute("aria-label", "Toggle music");
      btn.textContent = "♪";
      document.body.appendChild(btn);
    }

    audio.volume = 0.16;
    audio.loop = true;

    const saved = localStorage.getItem("genex_music_enabled");

    async function playMusic() {
      try {
        await audio.play();
        btn.textContent = "♫";
        localStorage.setItem("genex_music_enabled", "true");
      } catch (e) {
        btn.textContent = "♪";
      }
    }

    function pauseMusic() {
      audio.pause();
      btn.textContent = "♪";
      localStorage.setItem("genex_music_enabled", "false");
    }

    btn.addEventListener("click", () => {
      if (audio.paused) playMusic();
      else pauseMusic();
    });

    if (saved !== "false") {
      const starter = async () => {
        await playMusic();
      };
      window.addEventListener("click", starter, { once: true });
      window.addEventListener("touchstart", starter, { once: true });
      window.addEventListener("keydown", starter, { once: true });
    }
  }

  function initChat() {
    if (q("#chatToggle")) return;

    const btn = document.createElement("button");
    btn.id = "chatToggle";
    btn.setAttribute("aria-label", "Open chat");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M20 14a4 4 0 0 1-4 4H9l-5 3V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z"/>
      </svg>
    `;

    const panel = document.createElement("div");
    panel.id = "chatPanel";
    panel.innerHTML = `
      <div class="chat-head">
        <strong>GENEX Connect</strong>
        <button class="chat-close" aria-label="Close chat">×</button>
      </div>
      <div class="chat-body">
        <div class="chat-bubble">
          مرحبًا بك في GENEX. اختر طريقة التواصل السريعة المناسبة لك.
        </div>
        <div class="chat-actions">
          <a class="chat-link" href="./contact.html">فتح صفحة التواصل</a>
          <a class="chat-link" href="./request.html">إرسال طلب مشروع</a>
          <a class="chat-link" href="mailto:contact@genex-era.com">contact@genex-era.com</a>
        </div>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const closeBtn = panel.querySelector(".chat-close");

    btn.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      panel.classList.remove("open");
    });
  }

  function initVisuals() {
    const backCanvas = q("#backFxCanvas");
    const frontCanvas = q("#frontFxCanvas");
    if (!backCanvas || !frontCanvas) return;

    const backCtx = backCanvas.getContext("2d");
    const frontCtx = frontCanvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let cameraDrift = 0;

    function resizeCanvas(canvas, ctx) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      resizeCanvas(backCanvas, backCtx);
      resizeCanvas(frontCanvas, frontCtx);
    }

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouseTarget.x = (e.clientX / w) * 2 - 1;
      mouseTarget.y = (e.clientY / h) * 2 - 1;
    }, { passive: true });

    window.addEventListener("scroll", () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      scrollTarget = window.scrollY / maxScroll;
    }, { passive: true });

    const starsFar = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.25,
      a: Math.random() * 0.35 + 0.08,
      drift: Math.random() * 20,
      speed: Math.random() * 0.05 + 0.01,
      depth: 0.12 + Math.random() * 0.08
    }));

    const starsMid = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.35,
      a: Math.random() * 0.45 + 0.12,
      drift: Math.random() * 20,
      speed: Math.random() * 0.07 + 0.02,
      depth: 0.18 + Math.random() * 0.14
    }));

    const starsNear = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2 + 0.45,
      a: Math.random() * 0.55 + 0.16,
      drift: Math.random() * 20,
      speed: Math.random() * 0.1 + 0.03,
      depth: 0.28 + Math.random() * 0.20
    }));

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.4 + 0.8,
      a: Math.random() * 0.16 + 0.04,
      speed: Math.random() * 0.22 + 0.05,
      hue: Math.random() > 0.65 ? "red" : "white",
      depth: 0.12 + Math.random() * 0.3
    }));

    const galaxies = [
      { x:0.07, y:0.10, r:130, color:"red", depth:.30, drift:.11, ringA:1.22, ringB:.30, glow:0.18 },
      { x:0.19, y:0.21, r:48, color:"white", depth:.14, drift:.18, ringA:.82, ringB:.20, glow:0.22 },
      { x:0.32, y:0.08, r:78, color:"red", depth:.20, drift:.13, ringA:1.02, ringB:.26, glow:0.16 },
      { x:0.46, y:0.18, r:58, color:"white", depth:.15, drift:.20, ringA:.88, ringB:.22, glow:0.24 },
      { x:0.60, y:0.09, r:112, color:"red", depth:.26, drift:.12, ringA:1.12, ringB:.28, glow:0.18 },
      { x:0.74, y:0.17, r:44, color:"white", depth:.12, drift:.18, ringA:.80, ringB:.20, glow:0.22 },
      { x:0.90, y:0.11, r:90, color:"red", depth:.22, drift:.14, ringA:1.02, ringB:.26, glow:0.14 },

      { x:0.10, y:0.38, r:52, color:"white", depth:.12, drift:.19, ringA:.84, ringB:.20, glow:0.20 },
      { x:0.25, y:0.31, r:150, color:"red", depth:.34, drift:.10, ringA:1.26, ringB:.32, glow:0.18 },
      { x:0.42, y:0.40, r:66, color:"white", depth:.16, drift:.17, ringA:.90, ringB:.22, glow:0.22 },
      { x:0.57, y:0.30, r:124, color:"red", depth:.28, drift:.11, ringA:1.14, ringB:.28, glow:0.16 },
      { x:0.72, y:0.42, r:50, color:"white", depth:.13, drift:.20, ringA:.84, ringB:.20, glow:0.20 },
      { x:0.88, y:0.35, r:94, color:"red", depth:.22, drift:.13, ringA:1.00, ringB:.25, glow:0.14 },

      { x:0.08, y:0.71, r:118, color:"red", depth:.26, drift:.12, ringA:1.14, ringB:.28, glow:0.16 },
      { x:0.22, y:0.84, r:40, color:"white", depth:.10, drift:.18, ringA:.76, ringB:.18, glow:0.18 },
      { x:0.36, y:0.70, r:84, color:"red", depth:.20, drift:.14, ringA:1.00, ringB:.24, glow:0.14 },
      { x:0.50, y:0.82, r:48, color:"white", depth:.11, drift:.18, ringA:.82, ringB:.20, glow:0.18 },
      { x:0.65, y:0.72, r:76, color:"red", depth:.19, drift:.15, ringA:.96, ringB:.24, glow:0.13 },
      { x:0.79, y:0.84, r:42, color:"white", depth:.10, drift:.19, ringA:.76, ringB:.18, glow:0.18 },
      { x:0.92, y:0.73, r:72, color:"red", depth:.18, drift:.14, ringA:.94, ringB:.22, glow:0.12 }
    ];

    function drawBaseBackground() {
      const base = backCtx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#04060c");
      base.addColorStop(0.55, "#070a12");
      base.addColorStop(1, "#05070f");
      backCtx.fillStyle = base;
      backCtx.fillRect(0, 0, w, h);
    }

    function drawCinematicFog(t) {
      const fogs = [
        { x:.18, y:.14, r:.28, red:.10, white:.06, dx:.18, dy:.12 },
        { x:.52, y:.58, r:.34, red:.08, white:.05, dx:.14, dy:-.10 },
        { x:.82, y:.26, r:.22, red:.07, white:.05, dx:-.12, dy:.10 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";
      backCtx.filter = "blur(72px) saturate(130%)";

      fogs.forEach((f, i) => {
        const cx = w * f.x + Math.sin(t * f.dx + i) * w * 0.03 + mouse.x * 18;
        const cy = h * f.y + Math.cos(t * f.dy + i) * h * 0.03 + mouse.y * 14 + scrollCurrent * 60;
        const r = Math.min(w, h) * f.r;

        const g = backCtx.createRadialGradient(cx, cy, r * 0.04, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${f.white})`);
        g.addColorStop(0.26, `rgba(255,255,255,${f.white * 0.45})`);
        g.addColorStop(0.42, `rgba(180,20,40,${f.red})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        backCtx.fillStyle = g;
        backCtx.beginPath();
        backCtx.arc(cx, cy, r, 0, Math.PI * 2);
        backCtx.fill();
      });

      backCtx.restore();
    }

    function drawStarLayer(list, t, crossChance) {
      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      list.forEach((s, i) => {
        const mx = mouse.x * 28 * s.depth;
        const my = mouse.y * 20 * s.depth;
        const sx = s.x * w + Math.sin(t * s.speed + s.drift) * 7 + mx;
        const sy = s.y * h + Math.cos(t * s.speed + s.drift) * 7 + my + scrollCurrent * 46 * s.depth;

        backCtx.beginPath();
        backCtx.arc(sx, sy, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
        backCtx.fill();

        if (i % crossChance === 0) {
          backCtx.beginPath();
          backCtx.moveTo(sx - s.r * 2.5, sy);
          backCtx.lineTo(sx + s.r * 2.5, sy);
          backCtx.moveTo(sx, sy - s.r * 2.5);
          backCtx.lineTo(sx, sy + s.r * 2.5);
          backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.24})`;
          backCtx.lineWidth = 0.6;
          backCtx.stroke();
        }
      });

      backCtx.restore();
    }

    function drawGalaxyCore(galaxy, t, i) {
      const px = mouse.x * 44 * galaxy.depth;
      const py = mouse.y * 32 * galaxy.depth;
      const x = galaxy.x * w + Math.sin(t * galaxy.drift + i) * 22 + px;
      const y = galaxy.y * h + Math.cos(t * galaxy.drift + i * 1.3) * 16 + py + scrollCurrent * 88 * galaxy.depth;
      const r = galaxy.r * (1 + Math.sin(t * 0.55 + i) * 0.028);
      const twist = Math.sin(t * 0.12 + i) * 0.7 + cameraDrift * 0.2;

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      const outer = backCtx.createRadialGradient(x, y, r * 0.04, x, y, r);
      const inner = backCtx.createRadialGradient(x, y, r * 0.02, x, y, r * 0.52);

      if (galaxy.color === "white") {
        outer.addColorStop(0, "rgba(255,255,255,0.26)");
        outer.addColorStop(0.2, "rgba(255,255,255,0.16)");
        outer.addColorStop(0.46, "rgba(255,255,255,0.06)");
        outer.addColorStop(1, "rgba(255,255,255,0)");

        inner.addColorStop(0, "rgba(255,255,255,0.98)");
        inner.addColorStop(0.26, "rgba(255,255,255,0.42)");
        inner.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        outer.addColorStop(0, "rgba(145,14,28,0.24)");
        outer.addColorStop(0.22, "rgba(120,10,20,0.18)");
        outer.addColorStop(0.48, "rgba(120,10,20,0.06)");
        outer.addColorStop(1, "rgba(120,10,20,0)");

        inner.addColorStop(0, "rgba(165,20,34,0.86)");
        inner.addColorStop(0.28, "rgba(120,10,20,0.30)");
        inner.addColorStop(1, "rgba(120,10,20,0)");
      }

      backCtx.fillStyle = outer;
      backCtx.beginPath();
      backCtx.arc(x, y, r, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.fillStyle = inner;
      backCtx.beginPath();
      backCtx.arc(x, y, r * 0.54, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.strokeStyle = galaxy.color === "white"
        ? `rgba(255,255,255,${galaxy.glow})`
        : `rgba(120,10,20,${galaxy.glow})`;
      backCtx.lineWidth = 1;

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * galaxy.ringA, r * galaxy.ringB, twist, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * (galaxy.ringA * 0.76), r * (galaxy.ringB * 0.74), -twist * 0.7, 0, Math.PI * 2);
      backCtx.stroke();

      if (galaxy.color === "white") {
        backCtx.beginPath();
        backCtx.arc(x, y, r * 0.12, 0, Math.PI * 2);
        backCtx.fillStyle = "rgba(255,255,255,0.9)";
        backCtx.fill();
      }

      backCtx.restore();
    }

    function drawGalaxies(t) {
      galaxies.forEach((g, i) => drawGalaxyCore(g, t, i));
    }

    function drawFront(t) {
      frontCtx.clearRect(0, 0, w, h);

      frontCtx.save();
      frontCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < 18; i++) {
        const px = (i / 18) * w + Math.sin(t * 0.24 + i) * 38 + mouse.x * 8;
        const py = h * (0.12 + (i % 6) * 0.13) + Math.cos(t * 0.28 + i) * 12 + mouse.y * 6;
        const length = 120 + (i % 4) * 48;

        const grad = frontCtx.createLinearGradient(px, py, px + length, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.32, "rgba(255,255,255,0.03)");
        grad.addColorStop(0.68, "rgba(120,10,20,0.06)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + length * 0.5, py - 14, px + length, py + 2);
        frontCtx.stroke();
      }

      particles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + i) * 18 + mouse.x * 10 * p.depth;
        const y = p.y * h + Math.cos(t * p.speed + i) * 16 + mouse.y * 8 * p.depth + scrollCurrent * 34 * p.depth;
        frontCtx.beginPath();
        frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
        frontCtx.fillStyle = p.hue === "red"
          ? `rgba(120,10,20,${p.a})`
          : `rgba(255,255,255,${p.a})`;
        frontCtx.fill();
      });

      frontCtx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);

      const t = performance.now() * 0.001;

      mouse.x += (mouseTarget.x - mouse.x) * 0.05;
      mouse.y += (mouseTarget.y - mouse.y) * 0.05;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.05;
      cameraDrift = Math.sin(t * 0.08) * 0.8;

      backCtx.clearRect(0, 0, w, h);
      drawBaseBackground();
      drawCinematicFog(t);
      drawStarLayer(starsFar, t, 13);
      drawGalaxies(t);
      drawStarLayer(starsMid, t, 9);
      drawFront(t);
      drawStarLayer(starsNear, t, 7);
    }

    resize();
    animate();
  }

  initLanguageButtons();
  initAboutLabel();
  initHamburger();
  initReveal();
  initTilt();
  initTransitions();
  initIntro();
  initMusic();
  initChat();
  initVisuals();
})();
