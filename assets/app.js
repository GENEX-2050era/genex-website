document.addEventListener("DOMContentLoaded", function () {
  // ===== Mobile menu =====
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

  // ===== Footer year =====
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ===== Translations =====
  const translations = {
    ar: {
      nav_home: "الرئيسية",
      nav_services: "الخدمات",
      nav_request: "طلب جديد",
      nav_join: "انضم",
      nav_contact: "تواصل",
      nav_cta: "ابدأ مشروعك مع GENEX",

      hero_title_1: "في GENEX...",
      hero_title_2: "نحن لا نتخيّل المستقبل فقط،",
      hero_title_3: "بل نبنيه.",
      hero_desc: "GENEX تبني أنظمة ذكاء اصطناعي متقدمة لتحويل الخدمات التقليدية في المتاجر، والمنشآت الخاصة، والجهات الحكومية إلى عمليات آلية بالكامل، أكثر سرعة، وأكثر دقة، وأكثر قابلية للتوسع.",
      hero_btn: "اكتشف خدمات GENEX",

      kpi_1_title: "تحول سريع",
      kpi_1_desc: "من الفكرة إلى نموذج تشغيلي واضح خلال وقت قصير.",
      kpi_2_title: "ذكاء قابل للتوسع",
      kpi_2_desc: "أنظمة تنمو مع المنشأة وتتكامل مع أدواتها الحالية.",
      kpi_3_title: "جاهزية مؤسسية",
      kpi_3_desc: "حلول موثوقة مع وضوح في البنية والمراقبة.",

      what_title: "ماذا تقدم GENEX؟",
      what_desc: "نبني حلول أتمتة وذكاء اصطناعي مصممة لتقليل الاعتماد على العمل اليدوي وتحويل العمليات إلى أنظمة ذكية مستقلة.",

      service_card_1_title: "مساعدات ذكاء اصطناعي",
      service_card_1_desc: "مساعدات رقمية تتفاعل مع العملاء وتنفذ مهام حقيقية.",
      service_card_2_title: "أتمتة المنشآت",
      service_card_2_desc: "تحويل الإجراءات اليومية إلى تدفقات عمل مؤتمتة وواضحة.",
      service_card_3_title: "رؤية تشغيلية ذكية",
      service_card_3_desc: "لوحات متابعة وتحليل تساعد على اتخاذ قرارات أسرع.",

      early_title: "برنامج الشركاء الأوائل",
      early_desc: "نفتح الآن المجال لأول العملاء الذين يرغبون في بناء أنظمة أتمتة وذكاء اصطناعي مع GENEX. هذه المرحلة مخصصة للشركات والمنشآت التي ترغب في أن تكون من أوائل الجهات التي تتبنى البنية التشغيلية الذكية.",
      early_1: "أولوية في دراسة الاحتياج والتصميم",
      early_2: "حلول مخصصة بحسب طبيعة نشاطك",
      early_3: "فرصة لبناء أول حالة نجاح مشتركة مع GENEX",

      how_title: "كيف نعمل؟",
      how_desc: "منهجية GENEX تركز على فهم الخدمة، تصميم الحل، ثم تحويله إلى نظام يعمل على أرض الواقع.",
      how_1_title: "فهم التحدي",
      how_1_desc: "تحليل العملية الحالية وتحديد نقاط التأخير والتكرار.",
      how_2_title: "تصميم النظام",
      how_2_desc: "بناء تصور واضح للحل المناسب من ناحية الأتمتة والذكاء الاصطناعي.",
      how_3_title: "التنفيذ والتطوير",
      how_3_desc: "تحويل التصور إلى تجربة فعلية قابلة للتشغيل والتحسين المستمر.",

      final_title: "ابدأ مع GENEX",
      final_desc: "إذا كنت تبحث عن تحويل خدماتك أو منشأتك إلى بيئة تعتمد على الذكاء الاصطناعي والأتمتة، فابدأ من هنا.",
      final_btn: "ابدأ مشروعك مع GENEX",

      footer_text: "Autonomous AI Systems"
    },

    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_request: "New Request",
      nav_join: "Join",
      nav_contact: "Contact",
      nav_cta: "Start Your Project with GENEX",

      hero_title_1: "At GENEX...",
      hero_title_2: "we're not just imagining the future,",
      hero_title_3: "we're building it.",
      hero_desc: "GENEX builds advanced AI systems to transform traditional services across retail, private facilities, and government entities into fully automated operations that are faster, smarter, and more scalable.",
      hero_btn: "Explore GENEX Services",

      kpi_1_title: "Rapid Transformation",
      kpi_1_desc: "From concept to operational model in a short time.",
      kpi_2_title: "Scalable Intelligence",
      kpi_2_desc: "Systems designed to grow with your organization.",
      kpi_3_title: "Enterprise Readiness",
      kpi_3_desc: "Reliable solutions with clear architecture and monitoring.",

      what_title: "What does GENEX offer?",
      what_desc: "We build AI and automation solutions that reduce manual dependency and transform operations into intelligent autonomous systems.",

      service_card_1_title: "AI Assistants",
      service_card_1_desc: "Digital assistants that interact with customers and execute real tasks.",
      service_card_2_title: "Facility Automation",
      service_card_2_desc: "Transforming daily procedures into clear automated workflows.",
      service_card_3_title: "Operational Intelligence",
      service_card_3_desc: "Dashboards and analytics for faster decision-making.",

      early_title: "Early Partners Program",
      early_desc: "We are now opening access to our first partners who want to build AI and automation systems with GENEX. This phase is designed for organizations ready to adopt intelligent operational infrastructure early.",
      early_1: "Priority in requirement study and system design",
      early_2: "Tailored solutions based on your business model",
      early_3: "Opportunity to build the first joint success case with GENEX",

      how_title: "How We Work",
      how_desc: "GENEX follows a process focused on understanding the challenge, designing the solution, then transforming it into a working system.",
      how_1_title: "Understand the Challenge",
      how_1_desc: "Analyze the current process and identify friction points.",
      how_2_title: "Design the System",
      how_2_desc: "Create the right automation and AI solution blueprint.",
      how_3_title: "Build & Evolve",
      how_3_desc: "Turn the concept into a live system with continuous improvement.",

      final_title: "Start with GENEX",
      final_desc: "If you're ready to transform your services into an AI-driven automated environment, start here.",
      final_btn: "Start Your Project with GENEX",

      footer_text: "Autonomous AI Systems"
    }
  };

  function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("genex_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }

  const savedLang = localStorage.getItem("genex_lang") || "ar";
  applyTranslations(savedLang);

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".lang-switch button").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      applyTranslations(btn.getAttribute("data-lang"));
    });
  });

  // ===== DNA Background =====
  const canvas = document.getElementById("bgCanvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let scrollYPos = 0;
    let strands = [];

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
      createStrands();
    }

    function createStrands() {
      strands = [];
      const strandCount = Math.max(12, Math.floor((w * h) / 240000));

      for (let i = 0; i < strandCount; i++) {
        strands.push({
          x: rand(60, w - 60),
          y: rand(120, h - 120),
          len: rand(180, 320),
          amp: rand(12, 26),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.0008, 0.0018),
          driftX: rand(-22, 22),
          driftY: rand(-28, 28),
          links: Math.floor(rand(6, 10)),
          twist: rand(0.018, 0.03)
        });
      }
    }

    function getStrandPoints(strand, time, offset) {
      const cx = strand.x + Math.sin(time * strand.speed + strand.phase) * strand.driftX;
      const cy = strand.y + Math.cos(time * strand.speed + strand.phase) * strand.driftY + offset;

      const pA = [];
      const pB = [];

      for (let i = 0; i <= strand.links; i++) {
        const t = i / strand.links;
        const yy = cy + (t - 0.5) * strand.len;
        const xx = Math.sin(time * 0.0012 + strand.phase + i * strand.twist * 40) * strand.amp;

        pA.push({ x: cx + xx, y: yy });
        pB.push({ x: cx - xx, y: yy });
      }

      return { pA, pB };
    }

    function drawStrand(points, time, strand) {
      const pA = points.pA;
      const pB = points.pB;

      ctx.beginPath();
      for (let i = 0; i < pA.length; i++) {
        if (i === 0) ctx.moveTo(pA[i].x, pA[i].y);
        else ctx.lineTo(pA[i].x, pA[i].y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.26)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < pB.length; i++) {
        if (i === 0) ctx.moveTo(pB[i].x, pB[i].y);
        else ctx.lineTo(pB[i].x, pB[i].y);
      }
      ctx.strokeStyle = "rgba(177,18,38,0.34)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      for (let i = 0; i < pA.length; i++) {
        const pulse = (Math.sin(time * 0.002 + strand.phase + i) + 1) / 2;
        const shift = pulse > 0.66 ? 1 : 0;
        const a = pA[i];
        const b = pB[Math.min(i + shift, pB.length - 1)];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = pulse > 0.66
          ? "rgba(255,255,255,0.32)"
          : "rgba(177,18,38,0.24)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < pA.length; i++) {
        ctx.beginPath();
        ctx.arc(pA[i].x, pA[i].y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pB[i].x, pB[i].y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(177,18,38,0.88)";
        ctx.fill();
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, w, h);
      const offset = -scrollYPos * 0.28;

      for (let i = 0; i < strands.length; i++) {
        const points = getStrandPoints(strands[i], time, offset);
        drawStrand(points, time, strands[i]);
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
