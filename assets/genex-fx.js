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
      ".genex-panel, .genex-card, .feature, .stat, .cta, .service-card, .job-item, .value-card, .mission-card, .timeline-item, .info-item, .why-card, .about-card, .process-card, .principle-card, .capability-card, .job-card"
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
        el.style.transform = `perspective(1400px) rotateY(${px * 6}deg) rotateX(${py * -6}deg)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  function initTransitions() {
    const transition = q("#pageTransition");
    if (!transition) return;

    qa('a[href], .btn[href], .apply-btn[href], .quick-link[href], .chat-link[href]').forEach((link) => {
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

    function closeIntro() {
      intro.classList.add("hidden");
      sessionStorage.setItem("genex_intro_seen", "1");
    }

    if (document.readyState === "complete") {
      setTimeout(closeIntro, 5200);
    } else {
      window.addEventListener("load", () => {
        setTimeout(closeIntro, 5200);
      });
    }
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

    audio.volume = 0.14;
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollCurrent = 0;

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

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.35 + 0.22,
      a: Math.random() * 0.34 + 0.07,
      speed: Math.random() * 0.06 + 0.012,
      depth: 0.12 + Math.random() * 0.18,
      drift: Math.random() * Math.PI * 2
    }));

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.7,
      a: Math.random() * 0.08 + 0.02,
      speed: Math.random() * 0.20 + 0.04,
      depth: 0.10 + Math.random() * 0.20,
      hue: Math.random() > 0.9 ? "red" : "white"
    }));

    const planets = [
      { x: 0.06, y: 0.16, r: 380, ring: 1.14, depth: 0.26, color: "white", drift: 0.11 },
      { x: 0.76, y: 0.18, r: 560, ring: 1.22, depth: 0.42, color: "red", drift: 0.08 },
      { x: 0.16, y: 0.72, r: 620, ring: 1.28, depth: 0.48, color: "red", drift: 0.07 },
      { x: 0.84, y: 0.62, r: 420, ring: 1.16, depth: 0.30, color: "white", drift: 0.10 },
      { x: 0.54, y: 1.05, r: 500, ring: 1.18, depth: 0.34, color: "white", drift: 0.09 }
    ];

    function drawBase() {
      const g = backCtx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#02040a");
      g.addColorStop(0.50, "#04070f");
      g.addColorStop(1, "#03050b");
      backCtx.fillStyle = g;
      backCtx.fillRect(0, 0, w, h);
    }

    function drawFieldFog(t) {
      const fogs = [
        { x: 0.22, y: 0.20, r: 0.18, white: 0.025, red: 0.010, dx: 0.16, dy: 0.11 },
        { x: 0.60, y: 0.52, r: 0.22, white: 0.020, red: 0.010, dx: 0.12, dy: -0.08 },
        { x: 0.84, y: 0.74, r: 0.14, white: 0.018, red: 0.008, dx: -0.10, dy: 0.09 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";
      backCtx.filter = "blur(88px)";

      fogs.forEach((f, i) => {
        const cx = w * f.x + Math.sin(t * f.dx + i) * w * 0.02 + mouse.x * 10;
        const cy = h * f.y + Math.cos(t * f.dy + i) * h * 0.02 + mouse.y * 8 + scrollCurrent * 28;
        const r = Math.min(w, h) * f.r;

        const grad = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        grad.addColorStop(0, `rgba(255,255,255,${f.white})`);
        grad.addColorStop(0.26, `rgba(255,255,255,${f.white * 0.4})`);
        grad.addColorStop(0.44, `rgba(110,10,20,${f.red})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        backCtx.fillStyle = grad;
        backCtx.beginPath();
        backCtx.arc(cx, cy, r, 0, Math.PI * 2);
        backCtx.fill();
      });

      backCtx.restore();
    }

    function drawStars(t) {
      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      stars.forEach((s, i) => {
        const x = s.x * w + Math.sin(t * s.speed + s.drift) * 5 + mouse.x * 14 * s.depth;
        const y = s.y * h + Math.cos(t * s.speed + s.drift) * 5 + mouse.y * 10 * s.depth + scrollCurrent * 28 * s.depth;

        backCtx.beginPath();
        backCtx.arc(x, y, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
        backCtx.fill();

        if (i % 14 === 0) {
          backCtx.beginPath();
          backCtx.moveTo(x - s.r * 2, y);
          backCtx.lineTo(x + s.r * 2, y);
          backCtx.moveTo(x, y - s.r * 2);
          backCtx.lineTo(x, y + s.r * 2);
          backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.16})`;
          backCtx.lineWidth = 0.55;
          backCtx.stroke();
        }
      });

      backCtx.restore();
    }

    function drawPlanet(planet, t, i) {
      const x = planet.x * w + Math.sin(t * planet.drift + i) * 10 + mouse.x * 18 * planet.depth;
      const y = planet.y * h + Math.cos(t * planet.drift + i) * 8 + mouse.y * 12 * planet.depth + scrollCurrent * 36 * planet.depth;
      const r = planet.r * (1 + Math.sin(t * 0.30 + i) * 0.008);
      const rot = Math.sin(t * 0.07 + i) * 0.46;

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      const outer = backCtx.createRadialGradient(x, y, r * 0.05, x, y, r);
      const inner = backCtx.createRadialGradient(x, y, r * 0.04, x, y, r * 0.56);

      if (planet.color === "white") {
        outer.addColorStop(0, "rgba(255,255,255,0.055)");
        outer.addColorStop(0.20, "rgba(255,255,255,0.035)");
        outer.addColorStop(0.54, "rgba(255,255,255,0.010)");
        outer.addColorStop(1, "rgba(255,255,255,0)");

        inner.addColorStop(0, "rgba(255,255,255,0.15)");
        inner.addColorStop(0.28, "rgba(255,255,255,0.05)");
        inner.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        outer.addColorStop(0, "rgba(86,8,18,0.09)");
        outer.addColorStop(0.20, "rgba(86,8,18,0.06)");
        outer.addColorStop(0.54, "rgba(86,8,18,0.016)");
        outer.addColorStop(1, "rgba(86,8,18,0)");

        inner.addColorStop(0, "rgba(122,12,24,0.22)");
        inner.addColorStop(0.28, "rgba(96,8,18,0.07)");
        inner.addColorStop(1, "rgba(96,8,18,0)");
      }

      backCtx.fillStyle = outer;
      backCtx.beginPath();
      backCtx.arc(x, y, r, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.fillStyle = inner;
      backCtx.beginPath();
      backCtx.arc(x, y, r * 0.56, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.strokeStyle = planet.color === "white"
        ? "rgba(255,255,255,0.05)"
        : "rgba(96,8,18,0.06)";
      backCtx.lineWidth = 1;

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * planet.ring, r * 0.18, rot, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * (planet.ring * 0.76), r * 0.13, -rot * 0.7, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.restore();
    }

    function drawPlanets(t) {
      planets.forEach((planet, i) => drawPlanet(planet, t, i));
    }

    function drawFront(t) {
      frontCtx.clearRect(0, 0, w, h);
      frontCtx.save();
      frontCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < 8; i++) {
        const px = (i / 8) * w + Math.sin(t * 0.18 + i) * 18 + mouse.x * 6;
        const py = h * (0.14 + (i % 4) * 0.20) + Math.cos(t * 0.20 + i) * 7 + mouse.y * 4;
        const len = 90 + (i % 3) * 30;

        const grad = frontCtx.createLinearGradient(px, py, px + len, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.34, "rgba(255,255,255,0.015)");
        grad.addColorStop(0.68, "rgba(90,8,18,0.015)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + len * 0.5, py - 8, px + len, py + 2);
        frontCtx.stroke();
      }

      particles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + i) * 12 + mouse.x * 6 * p.depth;
        const y = p.y * h + Math.cos(t * p.speed + i) * 10 + mouse.y * 4 * p.depth + scrollCurrent * 18 * p.depth;
        frontCtx.beginPath();
        frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
        frontCtx.fillStyle = p.hue === "red"
          ? `rgba(90,8,18,${p.a})`
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

      backCtx.clearRect(0, 0, w, h);
      drawBase();
      drawFieldFog(t);
      drawStars(t);
      drawPlanets(t);
      drawFront(t);
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
