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

    const stars = Array.from({ length: 380 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.35,
      a: Math.random() * 0.6 + 0.14,
      speed: Math.random() * 0.1 + 0.03,
      drift: Math.random() * 20
    }));

    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.8 + 0.8,
      a: Math.random() * 0.18 + 0.05,
      speed: Math.random() * 0.24 + 0.06,
      hue: Math.random() > 0.5 ? "red" : "white"
    }));

    const nuclei = [
      { x:0.06, y:0.10, r:118, color:"red", depth:.24, drift:.15, ringA:1.16, ringB:.34 },
      { x:0.18, y:0.18, r:54, color:"white", depth:.12, drift:.28, ringA:.88, ringB:.24 },
      { x:0.32, y:0.08, r:86, color:"red", depth:.18, drift:.19, ringA:1.04, ringB:.29 },
      { x:0.46, y:0.16, r:62, color:"white", depth:.12, drift:.30, ringA:.90, ringB:.24 },
      { x:0.60, y:0.09, r:104, color:"red", depth:.20, drift:.16, ringA:1.12, ringB:.32 },
      { x:0.76, y:0.17, r:50, color:"white", depth:.10, drift:.31, ringA:.84, ringB:.22 },
      { x:0.90, y:0.10, r:92, color:"red", depth:.18, drift:.20, ringA:1.05, ringB:.30 },

      { x:0.10, y:0.38, r:58, color:"white", depth:.11, drift:.26, ringA:.86, ringB:.22 },
      { x:0.24, y:0.32, r:138, color:"red", depth:.28, drift:.14, ringA:1.18, ringB:.36 },
      { x:0.40, y:0.40, r:74, color:"white", depth:.13, drift:.27, ringA:.92, ringB:.25 },
      { x:0.56, y:0.31, r:122, color:"red", depth:.24, drift:.15, ringA:1.10, ringB:.34 },
      { x:0.72, y:0.40, r:56, color:"white", depth:.11, drift:.29, ringA:.86, ringB:.24 },
      { x:0.88, y:0.34, r:98, color:"red", depth:.19, drift:.18, ringA:1.04, ringB:.30 },

      { x:0.08, y:0.72, r:108, color:"red", depth:.21, drift:.18, ringA:1.12, ringB:.33 },
      { x:0.22, y:0.82, r:48, color:"white", depth:.09, drift:.31, ringA:.82, ringB:.20 },
      { x:0.36, y:0.70, r:94, color:"red", depth:.18, drift:.20, ringA:1.02, ringB:.28 },
      { x:0.50, y:0.80, r:54, color:"white", depth:.10, drift:.28, ringA:.85, ringB:.23 },
      { x:0.64, y:0.72, r:88, color:"red", depth:.17, drift:.19, ringA:1.00, ringB:.28 },
      { x:0.78, y:0.82, r:46, color:"white", depth:.09, drift:.27, ringA:.80, ringB:.20 },
      { x:0.92, y:0.72, r:84, color:"red", depth:.16, drift:.21, ringA:.98, ringB:.27 }
    ];

    function drawBaseBackground() {
      const base = backCtx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#05070f");
      base.addColorStop(1, "#090d18");
      backCtx.fillStyle = base;
      backCtx.fillRect(0, 0, w, h);
    }

    function drawNebula(t) {
      const nebulae = [
        { x:.14, y:.16, r:.40, red:.22, white:.16, dx:.52, dy:.34 },
        { x:.78, y:.14, r:.30, red:.14, white:.12, dx:-.38, dy:.28 },
        { x:.50, y:.66, r:.46, red:.20, white:.14, dx:.30, dy:-.24 },
        { x:.88, y:.60, r:.26, red:.12, white:.10, dx:-.44, dy:-.31 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";
      backCtx.filter = "blur(62px) saturate(158%)";

      nebulae.forEach((n, i) => {
        const cx = w * n.x + Math.sin(t * n.dx + i) * w * .05 + mouse.x * 34;
        const cy = h * n.y + Math.cos(t * n.dy + i) * h * .05 + mouse.y * 26 + scrollCurrent * 120;
        const r = Math.min(w, h) * n.r;

        const g = backCtx.createRadialGradient(cx, cy, r * .08, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${n.white})`);
        g.addColorStop(.18, `rgba(255,255,255,${n.white * .55})`);
        g.addColorStop(.34, `rgba(180,20,40,${n.red})`);
        g.addColorStop(.72, `rgba(180,20,40,${n.red * .16})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        backCtx.fillStyle = g;
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
        const x = s.x * w + Math.sin(t * s.speed + s.drift) * 8 + mouse.x * 14;
        const y = s.y * h + Math.cos(t * s.speed + s.drift) * 8 + mouse.y * 10 + scrollCurrent * 48;

        backCtx.beginPath();
        backCtx.arc(x, y, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
        backCtx.fill();

        if (i % 9 === 0) {
          backCtx.beginPath();
          backCtx.moveTo(x - s.r * 3, y);
          backCtx.lineTo(x + s.r * 3, y);
          backCtx.moveTo(x, y - s.r * 3);
          backCtx.lineTo(x, y + s.r * 3);
          backCtx.strokeStyle = `rgba(255,255,255,${s.a * .28})`;
          backCtx.lineWidth = .6;
          backCtx.stroke();
        }
      });

      backCtx.restore();
    }

    function drawSingleNucleus(n, t, i) {
      const x = n.x * w + Math.sin(t * n.drift + i) * 26 + mouse.x * 42 * n.depth;
      const y = n.y * h + Math.cos(t * n.drift + i) * 18 + mouse.y * 34 * n.depth + scrollCurrent * 95 * n.depth;
      const r = n.r * (1 + Math.sin(t * .8 + i) * .03);

      const outer = backCtx.createRadialGradient(x, y, r * .04, x, y, r);
      const mid = backCtx.createRadialGradient(x, y, r * .02, x, y, r * .55);

      if (n.color === "white") {
        outer.addColorStop(0, "rgba(255,255,255,.42)");
        outer.addColorStop(.18, "rgba(255,255,255,.22)");
        outer.addColorStop(.46, "rgba(255,255,255,.08)");
        outer.addColorStop(1, "rgba(255,255,255,0)");

        mid.addColorStop(0, "rgba(255,255,255,.98)");
        mid.addColorStop(.28, "rgba(255,255,255,.42)");
        mid.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        outer.addColorStop(0, "rgba(180,20,40,.34)");
        outer.addColorStop(.20, "rgba(180,20,40,.22)");
        outer.addColorStop(.52, "rgba(180,20,40,.08)");
        outer.addColorStop(1, "rgba(180,20,40,0)");

        mid.addColorStop(0, "rgba(210,36,60,.94)");
        mid.addColorStop(.28, "rgba(180,20,40,.42)");
        mid.addColorStop(1, "rgba(180,20,40,0)");
      }

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      backCtx.fillStyle = outer;
      backCtx.beginPath();
      backCtx.arc(x, y, r, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.fillStyle = mid;
      backCtx.beginPath();
      backCtx.arc(x, y, r * .56, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.strokeStyle = n.color === "white"
        ? "rgba(255,255,255,.12)"
        : "rgba(180,20,40,.18)";
      backCtx.lineWidth = 1;

      backCtx.beginPath();
      backCtx.ellipse(
        x,
        y,
        r * n.ringA,
        r * n.ringB,
        Math.sin(t * .22 + i) * .8,
        0,
        Math.PI * 2
      );
      backCtx.stroke();

      backCtx.beginPath();
      backCtx.ellipse(
        x,
        y,
        r * (n.ringA * .78),
        r * (n.ringB * .72),
        Math.cos(t * .18 + i) * .8,
        0,
        Math.PI * 2
      );
      backCtx.stroke();

      backCtx.restore();
    }

    function drawNuclei(t) {
      nuclei.forEach((n, i) => drawSingleNucleus(n, t, i));
    }

    function drawFront(t) {
      frontCtx.clearRect(0, 0, w, h);

      frontCtx.save();
      frontCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < 26; i++) {
        const px = (i / 26) * w + Math.sin(t * .32 + i) * 42;
        const py = h * (.10 + (i % 8) * .10) + Math.cos(t * .44 + i) * 14;
        const length = 110 + (i % 5) * 54;

        const grad = frontCtx.createLinearGradient(px, py, px + length, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(.30, "rgba(255,255,255,.04)");
        grad.addColorStop(.65, "rgba(180,20,40,.10)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + length * .5, py - 20, px + length, py + 2);
        frontCtx.stroke();
      }

      particles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + i) * 20 + mouse.x * 8;
        const y = p.y * h + Math.cos(t * p.speed + i) * 16 + mouse.y * 6;
        frontCtx.beginPath();
        frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
        frontCtx.fillStyle = p.hue === "red"
          ? `rgba(180,20,40,${p.a})`
          : `rgba(255,255,255,${p.a})`;
        frontCtx.fill();
      });

      frontCtx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);

      const t = performance.now() * 0.001;

      mouse.x += (mouseTarget.x - mouse.x) * 0.06;
      mouse.y += (mouseTarget.y - mouse.y) * 0.06;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

      backCtx.clearRect(0, 0, w, h);
      drawBaseBackground();
      drawNebula(t);
      drawStars(t);
      drawNuclei(t);
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
