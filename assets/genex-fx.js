(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  const body = document.body;
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

    function setActiveState(lang) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("genex_lang", lang);

      langButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });

      refreshAboutLabel();

      if (typeof window.applyGENEXLanguage === "function") {
        window.applyGENEXLanguage(lang);
      }
    }

    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveState(btn.dataset.lang || "ar");
      });
    });

    setActiveState(localStorage.getItem("genex_lang") || "ar");
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

        el.style.transform =
          `perspective(1400px) rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-4px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform =
          "perspective(1400px) rotateY(0deg) rotateX(0deg) translateY(0)";
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
        }, 340);
      });
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

    audio.volume = 0.14;
    audio.loop = true;

    const saved = localStorage.getItem("genex_music_enabled");

    async function playMusic() {
      try {
        await audio.play();
        btn.textContent = "♫";
        localStorage.setItem("genex_music_enabled", "true");
      } catch (_) {
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

  function initVisuals() {}

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

    const stars = Array.from({ length: 260 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.25,
      a: Math.random() * 0.34 + 0.06,
      speed: Math.random() * 0.08 + 0.02,
      depth: 0.12 + Math.random() * 0.20,
      drift: Math.random() * Math.PI * 2
    }));

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.2 + 0.8,
      a: Math.random() * 0.07 + 0.02,
      speed: Math.random() * 0.22 + 0.05,
      depth: 0.10 + Math.random() * 0.20,
      hue: Math.random() > 0.85 ? "red" : "white"
    }));

    const planets = [
      { x: 0.00, y: 0.14, r: 380, ring: 1.12, depth: 0.22, color: "white", drift: 0.09 },
      { x: 0.84, y: 0.12, r: 620, ring: 1.18, depth: 0.32, color: "red", drift: 0.07 },
      { x: 0.08, y: 0.82, r: 700, ring: 1.24, depth: 0.40, color: "red", drift: 0.06 },
      { x: 0.95, y: 0.64, r: 420, ring: 1.14, depth: 0.24, color: "white", drift: 0.08 },
      { x: 0.56, y: 1.08, r: 520, ring: 1.16, depth: 0.28, color: "white", drift: 0.07 }
    ];

    function drawBase() {
      const g = backCtx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#01030a");
      g.addColorStop(0.45, "#02050d");
      g.addColorStop(1, "#01030a");
      backCtx.fillStyle = g;
      backCtx.fillRect(0, 0, w, h);
    }

    function drawFog(t) {
      const fogs = [
        { x: 0.16, y: 0.18, r: 0.24, white: 0.020, red: 0.012, dx: 0.12, dy: 0.08 },
        { x: 0.56, y: 0.50, r: 0.26, white: 0.018, red: 0.010, dx: 0.10, dy: -0.06 },
        { x: 0.84, y: 0.78, r: 0.18, white: 0.014, red: 0.010, dx: -0.08, dy: 0.05 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";
      backCtx.filter = "blur(100px)";

      fogs.forEach((f, i) => {
        const cx = w * f.x + Math.sin(t * f.dx + i) * w * 0.016 + mouse.x * 10;
        const cy = h * f.y + Math.cos(t * f.dy + i) * h * 0.014 + mouse.y * 8 + scrollCurrent * 18;
        const r = Math.min(w, h) * f.r;

        const grad = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
        grad.addColorStop(0, `rgba(255,255,255,${f.white})`);
        grad.addColorStop(0.34, `rgba(255,255,255,${f.white * 0.35})`);
        grad.addColorStop(0.56, `rgba(110,10,20,${f.red})`);
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
        const x = s.x * w + Math.sin(t * s.speed + s.drift) * 7 + mouse.x * 16 * s.depth;
        const y = s.y * h + Math.cos(t * s.speed + s.drift) * 7 + mouse.y * 12 * s.depth + scrollCurrent * 22 * s.depth;

        backCtx.beginPath();
        backCtx.arc(x, y, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
        backCtx.fill();

        if (i % 16 === 0) {
          backCtx.beginPath();
          backCtx.moveTo(x - s.r * 1.8, y);
          backCtx.lineTo(x + s.r * 1.8, y);
          backCtx.moveTo(x, y - s.r * 1.8);
          backCtx.lineTo(x, y + s.r * 1.8);
          backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.12})`;
          backCtx.lineWidth = 0.5;
          backCtx.stroke();
        }
      });

      backCtx.restore();
    }

    function drawPlanet(p, t, i) {
      const x = p.x * w + Math.sin(t * p.drift + i) * 10 + mouse.x * 14 * p.depth;
      const y = p.y * h + Math.cos(t * p.drift + i) * 8 + mouse.y * 10 * p.depth + scrollCurrent * 24 * p.depth;
      const r = p.r * (1 + Math.sin(t * 0.22 + i) * 0.004);
      const rot = Math.sin(t * 0.05 + i) * 0.28;

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      const outer = backCtx.createRadialGradient(x, y, r * 0.08, x, y, r);
      const inner = backCtx.createRadialGradient(x, y, r * 0.06, x, y, r * 0.56);

      if (p.color === "white") {
        outer.addColorStop(0, "rgba(255,255,255,0.050)");
        outer.addColorStop(0.24, "rgba(255,255,255,0.026)");
        outer.addColorStop(0.60, "rgba(255,255,255,0.008)");
        outer.addColorStop(1, "rgba(255,255,255,0)");

        inner.addColorStop(0, "rgba(255,255,255,0.10)");
        inner.addColorStop(0.32, "rgba(255,255,255,0.030)");
        inner.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        outer.addColorStop(0, "rgba(86,8,18,0.075)");
        outer.addColorStop(0.24, "rgba(86,8,18,0.044)");
        outer.addColorStop(0.60, "rgba(86,8,18,0.014)");
        outer.addColorStop(1, "rgba(86,8,18,0)");

        inner.addColorStop(0, "rgba(122,12,24,0.16)");
        inner.addColorStop(0.32, "rgba(96,8,18,0.048)");
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

      backCtx.strokeStyle = p.color === "white"
        ? "rgba(255,255,255,0.03)"
        : "rgba(96,8,18,0.036)";
      backCtx.lineWidth = 1;

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * p.ring, r * 0.15, rot, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.beginPath();
      backCtx.ellipse(x, y, r * (p.ring * 0.78), r * 0.11, -rot * 0.7, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.restore();
    }

    function drawPlanets(t) {
      planets.forEach((p, i) => drawPlanet(p, t, i));
    }

    function drawFront(t) {
      frontCtx.clearRect(0, 0, w, h);
      frontCtx.save();
      frontCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < 8; i++) {
        const px = (i / 8) * w + Math.sin(t * 0.16 + i) * 16 + mouse.x * 4;
        const py = h * (0.14 + (i % 4) * 0.22) + Math.cos(t * 0.18 + i) * 6 + mouse.y * 3;
        const len = 80 + (i % 3) * 24;

        const grad = frontCtx.createLinearGradient(px, py, px + len, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.34, "rgba(255,255,255,0.010)");
        grad.addColorStop(0.68, "rgba(90,8,18,0.010)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + len * 0.5, py - 5, px + len, py + 1);
        frontCtx.stroke();
      }

      particles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + i) * 9 + mouse.x * 4 * p.depth;
        const y = p.y * h + Math.cos(t * p.speed + i) * 8 + mouse.y * 3 * p.depth + scrollCurrent * 10 * p.depth;

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
      drawFog(t);
      drawStars(t);
      drawPlanets(t);
      drawFront(t);
    }

    resize();
    animate();
  }

  refreshAboutLabel();
  initLanguageButtons();
  initAboutLabel();
  initHamburger();
  initReveal();
  initTilt();
  initTransitions();
  initMusic();
  initChat();
  initVisuals();
})();
