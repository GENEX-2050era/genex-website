document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // language
  const dict = {
    ar: {
      home: "الرئيسية",
      services: "الخدمات",
      projects: "الأعمال",
      request: "طلب جديد",
      join: "انضم",
      contact: "تواصل",
      explore: "استكشف الأعمال",
      ask: "اطلب الأتمتة"
    },
    en: {
      home: "Home",
      services: "Services",
      projects: "Projects",
      request: "New Request",
      join: "Join",
      contact: "Contact",
      explore: "Explore Work",
      ask: "Request Automation"
    }
  };

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("genex_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[lang] && dict[lang][key]) {
        el.textContent = dict[lang][key];
      }
    });

    document.querySelectorAll(".lang-switch button").forEach(btn => {
      btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(`.lang-switch button[data-lang="${lang}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  const savedLang = localStorage.getItem("genex_lang") || "ar";
  setLang(savedLang);

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const lang = btn.getAttribute("data-lang");
      setLang(lang);
    });
  });

  // animated geometric background
  const canvas = document.getElementById("bgCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, points;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createPoints();
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createPoints() {
      const count = Math.max(18, Math.floor(w / 90));
      points = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.25, 0.25),
        r: rand(2, 4)
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // nodes
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.85)" : "rgba(177,18,38,0.8)";
        ctx.fill();
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 180) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = d < 100
              ? "rgba(177,18,38,0.35)"
              : "rgba(255,255,255,0.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize);
  }
});
