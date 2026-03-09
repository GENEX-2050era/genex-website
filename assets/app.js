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
      earlyDesc:
        "نفتح الآن المجال لأول العملاء الذين يرغبون في بناء أنظمة أتمتة وذكاء اصطناعي مع GENEX. هذه المرحلة مخصصة للشركات والمنشآت التي ترغب في أن تكون من أوائل الجهات التي تتبنى البنية التشغيلية الذكية.",
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
      earlyDesc:
        "We are now opening access to our first partners who want to build AI and automation systems with GENEX.",
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

    const activeBtn = document.querySelector(
      `.lang-switch button[data-lang="${lang}"]`
    );
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
    let groups = [];

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
      createGroups();
    }

    function createClusterPoints(cx, cy, size, count) {
      const pts = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.35, 0.35);
        const radius = rand(size * 0.25, size);
        pts.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius
        });
      }
      pts.push({ x: cx, y: cy });
      return pts;
    }

    function buildEdges(points) {
      const edges = [];
      const centerIndex = points.length - 1;

      for (let i = 0; i < points.length - 1; i++) {
        edges.push([centerIndex, i]);
      }

      for (let i = 0; i < points.length - 2; i++) {
        edges.push([i, i + 1]);
      }

      if (points.length > 3) {
        edges.push([0, points.length - 2]);
      }

      for (let i = 0; i < points.length - 3; i++) {
        if (Math.random() > 0.45) {
          edges.push([i, i + 2]);
        }
      }

      return edges;
    }

    function createGroups() {
      groups = [];

      const area = w * h;
      const groupCount = Math.max(10, Math.floor(area / 180000));

      for (let i = 0; i < groupCount; i++) {
        const cx = rand(40, w - 40);
        const cy = rand(100, h - 100);
        const size = rand(55, 130);
        const pointCount = Math.floor(rand(4, 7));
        const basePoints = createClusterPoints(cx, cy, size, pointCount);

        groups.push({
          x: 0,
          y: 0,
          baseX: cx,
          baseY: cy,
          driftX: rand(-18, 18),
          driftY: rand(-24, 24),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.0007, 0.0018),
          points: basePoints.map(function (p) {
            return {
              x: p.x - cx,
              y: p.y - cy
            };
          }),
          edges: buildEdges(basePoints)
        });
      }
    }

    function drawGroup(group, time, offset) {
      const floatX = Math.sin(time * group.speed + group.phase) * group.driftX;
      const floatY = Math.cos(time * group.speed + group.phase) * group.driftY;

      const points = group.points.map(function (p) {
        return {
          x: group.baseX + p.x + floatX,
          y: group.baseY + p.y + floatY + offset
        };
      });

      for (let i = 0; i < group.edges.length; i++) {
        const edge = group.edges[i];
        const a = points[edge[0]];
        const b = points[edge[1]];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle =
          i % 3 === 0
            ? "rgba(177,18,38,0.34)"
            : "rgba(255,255,255,0.20)";
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === points.length - 1 ? 2.8 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle =
          i % 3 === 0
            ? "rgba(255,255,255,0.92)"
            : "rgba(177,18,38,0.85)";
        ctx.fill();
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, w, h);

      const offset = -scrollYPos * 0.28;

      for (let i = 0; i < groups.length; i++) {
        drawGroup(groups[i], time, offset);
      }

      requestAnimationFrame(animate);
    }

    window.addEventListener("scroll", function () {
      scrollYPos = window.scrollY;
    });

    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);

    resize();
    requestAnimationFrame(animate);
    setTimeout(resize, 500);
  }
});
