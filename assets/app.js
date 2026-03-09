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

    function makeGroup(cx, cy, size, count) {
      const pts = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.5, 0.5);
        const radius = rand(size * 0.22, size);
        pts.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        });
      }

      pts.push({ x: 0, y: 0 });

      return {
        baseX: cx,
        baseY: cy,
        driftX: rand(-24, 24),
        driftY: rand(-26, 26),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.0008, 0.0018),
        points: pts,
        pulse: rand(0.2, 0.8)
      };
    }

    function createGroups() {
      groups = [];

      const area = w * h;
      const groupCount = Math.max(18, Math.floor(area / 120000));

      for (let i = 0; i < groupCount; i++) {
        groups.push(
          makeGroup(
            rand(40, w - 40),
            rand(120, h - 80),
            rand(45, 110),
            Math.floor(rand(4, 7))
          )
        );
      }
    }

    function getWorldPoints(group, time, offset) {
      const floatX = Math.sin(time * group.speed + group.phase) * group.driftX;
      const floatY = Math.cos(time * group.speed + group.phase) * group.driftY;

      return group.points.map(function (p, idx) {
        const wobble = idx === group.points.length - 1 ? 0 : Math.sin(time * 0.0015 + idx + group.phase) * group.pulse * 6;
        return {
          x: group.baseX + p.x + floatX + wobble,
          y: group.baseY + p.y + floatY + wobble + offset
        };
      });
    }

    function drawGroup(worldPoints) {
      const centerIndex = worldPoints.length - 1;

      for (let i = 0; i < worldPoints.length - 1; i++) {
        const a = worldPoints[centerIndex];
        const b = worldPoints[i];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < worldPoints.length - 2; i++) {
        const a = worldPoints[i];
        const b = worldPoints[i + 1];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(177,18,38,0.30)";
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      if (worldPoints.length > 3) {
        const a = worldPoints[0];
        const b = worldPoints[worldPoints.length - 2];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < worldPoints.length; i++) {
        const p = worldPoints[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === centerIndex ? 2.9 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0
          ? "rgba(255,255,255,0.95)"
          : "rgba(177,18,38,0.88)";
        ctx.fill();
      }
    }

    function connectGroups(groupPointsList) {
      for (let i = 0; i < groupPointsList.length; i++) {
        const aCenter = groupPointsList[i][groupPointsList[i].length - 1];

        let nearestIndex = -1;
        let nearestDist = Infinity;

        for (let j = 0; j < groupPointsList.length; j++) {
          if (i === j) continue;

          const bCenter = groupPointsList[j][groupPointsList[j].length - 1];
          const dx = aCenter.x - bCenter.x;
          const dy = aCenter.y - bCenter.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < nearestDist && d < 220) {
            nearestDist = d;
            nearestIndex = j;
          }
        }

        if (nearestIndex !== -1) {
          const bCenter = groupPointsList[nearestIndex][groupPointsList[nearestIndex].length - 1];

          const pulse = (Math.sin(performance.now() * 0.001 + i) + 1) / 2;
          const alpha = 0.08 + pulse * 0.18;

          ctx.beginPath();
          ctx.moveTo(aCenter.x, aCenter.y);
          ctx.lineTo(bCenter.x, bCenter.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, w, h);

      const offset = -scrollYPos * 0.28;
      const worldGroups = groups.map(function (group) {
        return getWorldPoints(group, time, offset);
      });

      for (let i = 0; i < worldGroups.length; i++) {
        drawGroup(worldGroups[i]);
      }

      connectGroups(worldGroups);

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
