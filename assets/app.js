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

  const dict = {
    ar: {
      home: "الرئيسية",
      services: "الخدمات",
      request: "طلب جديد",
      join: "انضم",
      contact: "تواصل",
      ask: "ابدأ مشروعك مع GENEX",
      heroBtn: "اكتشف خدمات GENEX",
      earlyTitle: "برنامج الشركاء الأوائل",
      earlyDesc: "نفتح الآن المجال لأول العملاء الذين يرغبون في بناء أنظمة أتمتة وذكاء اصطناعي مع GENEX. هذه المرحلة مخصصة للشركات والمنشآت التي ترغب في أن تكون من أوائل الجهات التي تتبنى البنية التشغيلية الذكية.",
      early1: "أولوية في دراسة الاحتياج والتصميم",
      early2: "حلول مخصصة بحسب طبيعة نشاطك",
      early3: "فرصة لبناء أول حالة نجاح مشتركة مع GENEX",
      footerText: "Autonomous AI Systems"
    },
    en: {
      home: "Home",
      services: "Services",
      request: "New Request",
      join: "Join",
      contact: "Contact",
      ask: "Start Your Project with GENEX",
      heroBtn: "Explore GENEX Services",
      earlyTitle: "Early Partners Program",
      earlyDesc: "We are now opening access to our first partners who want to build AI and automation systems with GENEX.",
      early1: "Priority in requirement study and system design",
      early2: "Tailored solutions based on your business model",
      early3: "Opportunity to build the first joint success case with GENEX",
      footerText: "Autonomous AI Systems"
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

  const canvas = document.getElementById("bgCanvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h;
    let points = [];
    let scrollYPos = 0;

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createPoints();
    }

    function createPoints() {
      const count = Math.floor(w / 90) + 20;
      points = [];

      for (let i = 0; i < count; i++) {
        points.push({
          x: rand(0, w),
          y: rand(90, h - 90),
          vx: rand(-0.22, 0.22),
          vy: rand(-0.22, 0.22)
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      const offset = -scrollYPos * 0.35;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 80 || p.y > h - 80) p.vy *= -1;

        const drawY = p.y + offset;

        ctx.beginPath();
        ctx.arc(p.x, drawY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,.88)" : "rgba(177,18,38,.82)";
        ctx.fill();
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 170) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y + offset);
            ctx.lineTo(b.x, b.y + offset);
            ctx.strokeStyle = d < 100 ? "rgba(177,18,38,.35)" : "rgba(255,255,255,.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    window.addEventListener("scroll", function () {
      scrollYPos = window.scrollY;
    });

    resize();
    animate();
    window.addEventListener("resize", resize);
  }
});
