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

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
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
    let w = 0;
    let h = 0;
    let scrollYPos = 0;

    let cols = 0;
    let rows = 0;
    let spacing = 110;
    let nodes = [];

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function resize() {
      const doc = document.documentElement;
      const body = document.body;

      w = canvas.width = window.innerWidth;
      h = canvas.height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        doc.clientHeight,
        doc.scrollHeight,
        doc.offsetHeight
      );

      canvas.style.height = h + "px";
      buildMesh();
    }

    function buildMesh() {
      cols = Math.ceil(w / spacing) + 2;
      rows = Math.ceil(h / spacing) + 2;
      nodes = [];

      const seedShiftX = rand(-18, 18);
      const seedShiftY = rand(-18, 18);

      for (let y = 0; y < rows; y++) {
        let row = [];
        for (let x = 0; x < cols; x++) {
          row.push({
            baseX: x * spacing + (y % 2 ? spacing / 2 : 0) + seedShiftX,
            baseY: y * spacing + seedShiftY,
            offsetX: rand(-16, 16),
            offsetY: rand(-16, 16),
            phase: rand(0, Math.PI * 2),
            speed: rand(0.003, 0.008)
          });
        }
        nodes.push(row);
      }
    }

    function drawTriangle(a, b, c, offset) {
      ctx.beginPath();
      ctx.moveTo(a.baseX + a.offsetX, a.baseY + a.offsetY + offset);
      ctx.lineTo(b.baseX + b.offsetX, b.baseY + b.offsetY + offset);
      ctx.lineTo(c.baseX + c.offsetX, c.baseY + c.offsetY + offset);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const t = performance.now();
      const offset = -scrollYPos * 0.28;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = nodes[y][x];
          n.offsetX += Math.sin(t * n.speed + n.phase) * 0.03;
          n.offsetY += Math.cos(t * n.speed + n.phase) * 0.03;
        }
      }

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const a = nodes[y][x];
          const b = nodes[y][x + 1];
          const c = nodes[y + 1][x];
          const d = nodes[y + 1][x + 1];

          drawTriangle(a, b, c, offset);
          drawTriangle(b, d, c, offset);
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = nodes[y][x];
          const drawX = n.baseX + n.offsetX;
          const drawY = n.baseY + n.offsetY + offset;

          ctx.beginPath();
          ctx.arc(drawX, drawY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = (x + y) % 3 === 0
            ? "rgba(255,255,255,.92)"
            : "rgba(177,18,38,.85)";
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener("scroll", function () {
      scrollYPos = window.scrollY;
    });

    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);

    resize();
    draw();
    setTimeout(resize, 500);
  }
});
