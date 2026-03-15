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

  function initAboutLabel() {
    refreshAboutLabel();
    window.addEventListener("storage", refreshAboutLabel);
    qa(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () => setTimeout(refreshAboutLabel, 0));
    });
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
      ".genex-panel, .genex-card, .feature, .stat, .cta, .service-card, .job-item, .value-card, .mission-card, .timeline-item, .info-item, .why-card"
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

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.08 + 0.02
    }));

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.2 + 0.8,
      a: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.2 + 0.05
    }));

    const nuclei = [
      { x:0.10, y:0.16, r:100, color:"red", depth:.18, drift:.25 },
      { x:0.28, y:0.22, r:54, color:"white", depth:.12, drift:.40 },
      { x:0.47, y:0.13, r:76, color:"red", depth:.16, drift:.35 },
      { x:0.76, y:0.18, r:46, color:"white", depth:.10, drift:.28 },

      { x:0.16, y:0.48, r:58, color:"white", depth:.10, drift:.22 },
      { x:0.36, y:0.41, r:128, color:"red", depth:.20, drift:.30 },
      { x:0.58, y:0.46, r:52, color:"white", depth:.10, drift:.26 },
      { x:0.82, y:0.40, r:90, color:"red", depth:.17, drift:.24 },

      { x:0.08, y:0.76, r:92, color:"red", depth:.16, drift:.30 },
      { x:0.29, y:0.72, r:48, color:"white", depth:.10, drift:.34 },
      { x:0.54, y:0.80, r:84, color:"red", depth:.15, drift:.22 },
      { x:0.78, y:0.74, r:44, color:"white", depth:.08, drift:.28 }
    ];

    function drawNebula(t) {
      backCtx.clearRect(0, 0, w, h);

      const base = backCtx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#05070f");
      base.addColorStop(1, "#090d18");
      backCtx.fillStyle = base;
      backCtx.fillRect(0, 0, w, h);

      const nebulae = [
        { x:.18, y:.15, r:.36, a:.22, dx:.6, dy:.45 },
        { x:.78, y:.14, r:.30, a:.14, dx:-.4, dy:.34 },
        { x:.52, y:.68, r:.42, a:.18, dx:.34, dy:-.28 },
        { x:.84, y:.62, r:.24, a:.11, dx:-.44, dy:-.36 }
      ];

      backCtx.save();
      backCtx.globalCompositeOperation = "screen";
      backCtx.filter = "blur(54px) saturate(150%)";

      nebulae.forEach((n, i) => {
        const cx = w * n.x + Math.sin(t * n.dx + i) * w * .05 + mouse.x * 30;
        const cy = h * n.y + Math.cos(t * n.dy + i) * h * .05 + mouse.y * 24 + scrollCurrent * 110;
        const r = Math.min(w, h) * n.r;

        const g = backCtx.createRadialGradient(cx, cy, r * .08, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${n.a * .6})`);
        g.addColorStop(.28, `rgba(180,20,40,${n.a})`);
        g.addColorStop(.72, `rgba(180,20,40,${n.a * .16})`);
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
        const x = s.x * w + Math.sin(t * s.speed + i) * 6 + mouse.x * 10;
        const y = s.y * h + Math.cos(t * s.speed + i) * 6 + mouse.y * 8 + scrollCurrent * 40;
        backCtx.beginPath();
        backCtx.arc(x, y, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
        backCtx.fill();
      });

      backCtx.restore();
    }

    function drawNuclei(t) {
      backCtx.save();
      backCtx.globalCompositeOperation = "screen";

      nuclei.forEach((n, i) => {
        const x = n.x * w + Math.sin(t * n.drift + i) * 24 + mouse.x * 40 * n.depth;
        const y = n.y * h + Math.cos(t * n.drift + i) * 18 + mouse.y * 30 * n.depth + scrollCurrent * 90 * n.depth;
        const r = n.r;

        const outer = backCtx.createRadialGradient(x, y, r * .05, x, y, r);
        if (n.color === "white") {
          outer.addColorStop(0, "rgba(255,255,255,.35)");
          outer.addColorStop(.18, "rgba(255,255,255,.18)");
          outer.addColorStop(.52, "rgba(255,255,255,.06)");
          outer.addColorStop(1, "rgba(255,255,255,0)");
        } else {
          outer.addColorStop(0, "rgba(180,20,40,.30)");
          outer.addColorStop(.22, "rgba(180,20,40,.18)");
          outer.addColorStop(.56, "rgba(180,20,40,.08)");
          outer.addColorStop(1, "rgba(180,20,40,0)");
        }

        backCtx.fillStyle = outer;
        backCtx.beginPath();
        backCtx.arc(x, y, r, 0, Math.PI * 2);
        backCtx.fill();

        backCtx.lineWidth = 1;
        backCtx.strokeStyle = n.color === "white"
          ? "rgba(255,255,255,.10)"
          : "rgba(180,20,40,.16)";

        backCtx.beginPath();
        backCtx.ellipse(x, y, r * .82, r * .26, Math.sin(t * .2 + i), 0, Math.PI * 2);
        backCtx.stroke();

        backCtx.beginPath();
        backCtx.ellipse(x, y, r * 1.08, r * .32, Math.cos(t * .18 + i), 0, Math.PI * 2);
        backCtx.stroke();
      });

      backCtx.restore();
    }

    function drawFront(t) {
      frontCtx.clearRect(0, 0, w, h);

      frontCtx.save();
      frontCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < 20; i++) {
        const px = (i / 20) * w + Math.sin(t * .35 + i) * 40;
        const py = h * (.12 + (i % 7) * .11) + Math.cos(t * .46 + i) * 12;
        const length = 100 + (i % 5) * 46;

        const grad = frontCtx.createLinearGradient(px, py, px + length, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(.35, "rgba(255,255,255,.04)");
        grad.addColorStop(.65, "rgba(180,20,40,.08)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        frontCtx.strokeStyle = grad;
        frontCtx.lineWidth = 1;
        frontCtx.beginPath();
        frontCtx.moveTo(px, py);
        frontCtx.quadraticCurveTo(px + length * .48, py - 18, px + length, py + 2);
        frontCtx.stroke();
      }

      particles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + i) * 18;
        const y = p.y * h + Math.cos(t * p.speed + i) * 14;
        frontCtx.beginPath();
        frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
        frontCtx.fillStyle = i % 4 === 0 ? `rgba(180,20,40,${p.a})` : `rgba(255,255,255,${p.a})`;
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

      drawNebula(t);
      drawStars(t);
      drawNuclei(t);
      drawFront(t);
    }

    resize();
    animate();
  }

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
