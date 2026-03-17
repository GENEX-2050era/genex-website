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
    const btn = document.getElementById("mobileToggle");
    const nav = document.getElementById("mobileNav");

    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      btn.classList.toggle("is-open");
      nav.classList.toggle("open");
    });
  }

  function initReveal() {
    const items = qa(".genex-panel, .genex-card, .feature, .stat, .cta, .service-card, .job-card, .process-card, .capability-card");
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
        el.style.transform = `perspective(1400px) rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-4px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg) translateY(0)";
      });
    });
  }

  function initTransitions() {
    const transition = q("#pageTransition");
    if (!transition) return;

    qa('a[href], .btn[href], .apply-btn[href], .chat-link[href]').forEach((link) => {
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

  function initIntro() {}

  function initVisuals() {}

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
      const starter = async () => { await playMusic(); };
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
          مرحبًا بك في GENEX. هذه واجهة الشات المطور. الربط الخلفي مع API يحتاج endpoint حقيقي من السيرفر.
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

  refreshAboutLabel();
  initLanguageButtons();
  initAboutLabel();
  initHamburger();
  initReveal();
  initTilt();
  initTransitions();
  initIntro();
  initVisuals();
  initMusic();
  initChat();
})();
