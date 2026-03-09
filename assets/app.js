
document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // Mobile menu
  // =========================
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

  // =========================
  // Footer year
  // =========================
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // =========================
  // Translations
  // =========================
  const translations = {
    ar: {
      nav_home: "الرئيسية",
      nav_services: "الخدمات",
      nav_request: "طلب جديد",
      nav_join: "انضم",
      nav_contact: "تواصل",
      nav_cta: "ابدأ مشروعك مع GENEX",

      hero_title_1: "مرحبًا بك في",
      hero_title_2: "حيث لا نتخيل المستقبل فقط ... بل نبنيه",

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

      service_card_1_title: "وحدات آلية",
      service_card_1_desc: "وحدات آلية معززة بوكيل Ai متقدم تتفاعل مع العملاء وتنفذ مهام حقيقية.",
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

      services_page_title: "الخدمات",
      services_page_desc: "حلول GENEX مصممة لتحويل الخدمات التقليدية إلى أنظمة تشغيل ذكية وآلية.",
      services_1_title: "مساعدات ذكاء اصطناعي",
      services_1_desc: "مساعدات رقمية ذكية لخدمة العملاء، الردود، والمتابعة التشغيلية.",
      services_2_title: "أتمتة العمليات",
      services_2_desc: "تحويل المسارات والإجراءات اليدوية إلى تدفقات عمل آلية أكثر كفاءة.",
      services_3_title: "تحليل وتشغيل ذكي",
      services_3_desc: "لوحات متابعة ومؤشرات تشغيل تساعد الإدارة على اتخاذ قرارات أفضل.",
      services_4_title: "تكامل الأنظمة",
      services_4_desc: "ربط الأنظمة القائمة والأدوات الرقمية في بيئة عمل واحدة ومتناسقة.",
      services_5_title: "حلول مخصصة",
      services_5_desc: "بناء بنية أتمتة مصممة خصيصًا وفق طبيعة نشاط العميل واحتياجه.",
      services_6_title: "تطوير مستمر",
      services_6_desc: "نظام لا يتوقف عند التنفيذ بل يستمر في التحسين والتطوير مع الوقت.",

      request_page_title: "طلب جديد",
      request_page_desc: "أرسل احتياجك وسيتواصل معك فريق GENEX لدراسة المشروع.",
      request_company: "اسم الشركة / المنشأة",
      request_name: "الاسم",
      request_email: "البريد الإلكتروني",
      request_type: "نوع النشاط",
      request_details: "وصف الاحتياج",
      request_submit: "إرسال الطلب",
      request_side_title: "لماذا تبدأ الآن؟",
      request_side_desc: "هذه المرحلة مناسبة للشركات التي تريد أن تكون من أوائل الجهات التي تطبق أتمتة وذكاء اصطناعي فعلي مع GENEX، مع فرصة لتصميم حل مخصص منذ البداية.",
      placeholder_company: "اكتب اسم الشركة",
      placeholder_name: "اسمك",
      placeholder_email: "email@example.com",
      placeholder_type: "مثال: متجر / منشأة / جهة حكومية",
      placeholder_details: "اشرح ما الذي تريد أتمتته",

      join_page_title: "انضم إلى GENEX",
      join_page_desc: "نبحث عن أشخاص يملكون عقلية بناء، وتوجه قوي نحو الأتمتة والذكاء الاصطناعي.",
      join_name: "الاسم",
      join_email: "البريد الإلكتروني",
      join_speciality: "التخصص",
      join_about: "نبذة مختصرة",
      join_submit: "إرسال الطلب",
      join_side_title: "من نبحث عنه؟",
      join_side_desc: "نبحث عن أشخاص لديهم فضول تقني، سرعة تعلم، ورغبة في المساهمة في بناء أنظمة حقيقية تعيد تشكيل طريقة عمل المنشآت والخدمات.",
      placeholder_speciality: "مثال: AI / تطوير / تصميم",
      placeholder_about: "عرفنا عنك بشكل مختصر",

      contact_page_title: "تواصل معنا",
      contact_page_desc: "إذا لديك استفسار أو رغبة في الحديث عن مشروعك، يسعدنا التواصل معك.",
      contact_box_1_title: "البريد",
      contact_box_1_desc: "ضع هنا بريدك الرسمي لاحقًا مثل: contact@genex.com",
      contact_box_2_title: "الموقع",
      contact_box_2_desc: "السعودية — عن بعد / حضور حسب طبيعة المشروع.",
      contact_box_3_title: "الاستجابة",
      contact_box_3_desc: "نراجع الطلبات الجديدة ونتواصل عادة خلال 24 ساعة.",

      thank_title: "تم استلام طلبك",
      thank_desc: "وصلتنا رسالتك بنجاح. سيتواصل فريق GENEX معك قريبًا.",
      thank_btn: "العودة للرئيسية",

      footer_text: "Autonomous AI Systems",

      chat_welcome: "أهلاً بك، أنا مساعد GENEX. اسألني عن الأتمتة، الخدمات، أو كيف نبدأ مشروعك.",
      chat_placeholder: "اكتب سؤالك هنا...",
      chat_send: "إرسال"
    },

    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_request: "New Request",
      nav_join: "Join",
      nav_contact: "Contact",
      nav_cta: "Start Your Project with GENEX",

      hero_title_1: "Welcome To",
      hero_title_2: "Whare we're not just imagine the future ... We're building it",

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

      services_page_title: "Services",
      services_page_desc: "GENEX solutions are designed to transform traditional services into intelligent automated operating systems.",
      services_1_title: "AI Assistants",
      services_1_desc: "Intelligent assistants for customer support, replies, and operational follow-up.",
      services_2_title: "Process Automation",
      services_2_desc: "Transforming manual procedures into more efficient automated workflows.",
      services_3_title: "Operational Analytics",
      services_3_desc: "Dashboards and metrics that support better decisions.",
      services_4_title: "Systems Integration",
      services_4_desc: "Connecting existing systems and digital tools into one coordinated environment.",
      services_5_title: "Custom Solutions",
      services_5_desc: "Building automation architecture tailored to your business needs.",
      services_6_title: "Continuous Development",
      services_6_desc: "A system that continues improving after launch.",

      request_page_title: "New Request",
      request_page_desc: "Send your need and GENEX will review your project.",
      request_company: "Company / Organization Name",
      request_name: "Name",
      request_email: "Email",
      request_type: "Business Type",
      request_details: "Project Details",
      request_submit: "Submit Request",
      request_side_title: "Why start now?",
      request_side_desc: "This phase is ideal for organizations that want to be among the first to adopt real automation and AI with GENEX, with a custom-built solution from the start.",
      placeholder_company: "Enter company name",
      placeholder_name: "Your name",
      placeholder_email: "email@example.com",
      placeholder_type: "Example: retail / facility / government",
      placeholder_details: "Explain what you want to automate",

      join_page_title: "Join GENEX",
      join_page_desc: "We are looking for builders with a strong interest in automation and AI.",
      join_name: "Name",
      join_email: "Email",
      join_speciality: "Speciality",
      join_about: "Short Introduction",
      join_submit: "Submit",
      join_side_title: "Who are we looking for?",
      join_side_desc: "People with technical curiosity, learning speed, and a desire to help build real systems that reshape how services operate.",
      placeholder_speciality: "Example: AI / Development / Design",
      placeholder_about: "Tell us about yourself briefly",

      contact_page_title: "Contact Us",
      contact_page_desc: "If you have an inquiry or want to discuss your project, we'd be glad to hear from you.",
      contact_box_1_title: "Email",
      contact_box_1_desc: "Put your official email here later, e.g. contact@genex.com",
      contact_box_2_title: "Location",
      contact_box_2_desc: "Saudi Arabia — remote / onsite depending on project.",
      contact_box_3_title: "Response Time",
      contact_box_3_desc: "We typically review new requests and respond within 24 hours.",

      thank_title: "Your request was received",
      thank_desc: "We received your message successfully. The GENEX team will contact you soon.",
      thank_btn: "Back to Home",

      footer_text: "Autonomous AI Systems",

      chat_welcome: "Welcome, I'm the GENEX assistant. Ask me about automation, services, or how to start your project.",
      chat_placeholder: "Type your question here...",
      chat_send: "Send"
    }
  };

  function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("genex_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.placeholder = translations[lang][key];
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

  // =========================
  // DNA Background
  // =========================
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

    function distance(x1, y1, x2, y2) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
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

      const strandCount = Math.max(12, Math.floor((w * h) / 320000));
      const minGap = 170;

      let attempts = 0;
      while (strands.length < strandCount && attempts < strandCount * 50) {
        attempts++;

        const candidate = {
          x: rand(80, w - 80),
          y: rand(140, h - 140),
          len: rand(170, 280),
          amp: rand(12, 24),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.0008, 0.0016),
          driftX: rand(-16, 16),
          driftY: rand(-18, 18),
          links: Math.floor(rand(6, 10)),
          twist: rand(0.018, 0.028)
        };

        let overlaps = false;
        for (let i = 0; i < strands.length; i++) {
          const s = strands[i];
          const d = distance(candidate.x, candidate.y, s.x, s.y);
          const requiredGap = minGap + Math.max(candidate.len, s.len) * 0.25;
          if (d < requiredGap) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          strands.push(candidate);
        }
      }
    }

    function getStrandPoints(strand, time, offset) {
      const cx =
        strand.x + Math.sin(time * strand.speed + strand.phase) * strand.driftX;
      const cy =
        strand.y + Math.cos(time * strand.speed + strand.phase) * strand.driftY + offset;

      const pA = [];
      const pB = [];

      for (let i = 0; i <= strand.links; i++) {
        const t = i / strand.links;
        const yy = cy + (t - 0.5) * strand.len;
        const xx =
          Math.sin(time * 0.0011 + strand.phase + i * strand.twist * 42) * strand.amp;

        pA.push({ x: cx + xx, y: yy });
        pB.push({ x: cx - xx, y: yy });
      }

      return { pA, pB };
    }

    function drawStrand(points) {
      const pA = points.pA;
      const pB = points.pB;

      ctx.beginPath();
      for (let i = 0; i < pA.length; i++) {
        if (i === 0) ctx.moveTo(pA[i].x, pA[i].y);
        else ctx.lineTo(pA[i].x, pA[i].y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.26)";
      ctx.lineWidth = 1.15;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < pB.length; i++) {
        if (i === 0) ctx.moveTo(pB[i].x, pB[i].y);
        else ctx.lineTo(pB[i].x, pB[i].y);
      }
      ctx.strokeStyle = "rgba(177,18,38,0.34)";
      ctx.lineWidth = 1.15;
      ctx.stroke();

      for (let i = 0; i < pA.length; i++) {
        const a = pA[i];
        const b = pB[i];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle =
          i % 2 === 0
            ? "rgba(255,255,255,0.24)"
            : "rgba(177,18,38,0.24)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < pA.length; i++) {
        ctx.beginPath();
        ctx.arc(pA[i].x, pA[i].y, 2.05, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.94)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pB[i].x, pB[i].y, 2.05, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(177,18,38,0.88)";
        ctx.fill();
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, w, h);
      const offset = -scrollYPos * 0.26;

      for (let i = 0; i < strands.length; i++) {
        const points = getStrandPoints(strands[i], time, offset);
        drawStrand(points);
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

  // =========================
  // Chat
  // =========================
  const chatFab = document.getElementById("genexChatFab");
  const chatPanel = document.getElementById("genexChatPanel");
  const chatClose = document.getElementById("genexChatClose");
  const chatSend = document.getElementById("genexChatSend");
  const chatInput = document.getElementById("genexChatInput");
  const chatBody = document.getElementById("genexChatBody");

  function addChatMessage(text, role) {
    if (!chatBody) return;

    const msg = document.createElement("div");
    msg.className = "genex-chat-msg " + role;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(userText) {
    const text = userText.toLowerCase();

    if (
      text.includes("خدمة") ||
      text.includes("الخدمات") ||
      text.includes("services")
    ) {
      return savedLang === "en"
        ? "GENEX provides AI assistants, process automation, systems integration, and intelligent operational analytics."
        : "GENEX تقدم مساعدات ذكاء اصطناعي، أتمتة عمليات، تكامل أنظمة، وتحليل وتشغيل ذكي.";
    }

    if (
      text.includes("ابدأ") ||
      text.includes("طلب") ||
      text.includes("project") ||
      text.includes("start")
    ) {
      return savedLang === "en"
        ? "To start your project, go to the New Request page and share your business details and automation needs."
        : "لبداية مشروعك، انتقل إلى صفحة طلب جديد وشاركنا تفاصيل النشاط والاحتياج.";
    }

    if (
      text.includes("سعر") ||
      text.includes("تكلفة") ||
      text.includes("price") ||
      text.includes("cost")
    ) {
      return savedLang === "en"
        ? "Pricing depends on the automation scope, system size, and required integrations."
        : "التكلفة تعتمد على نوع الأتمتة، حجم النظام، والتكاملات المطلوبة.";
    }

    return savedLang === "en"
      ? "I can help explain GENEX services, how we work, and how to start your project."
      : "أستطيع مساعدتك في فهم خدمات GENEX، آلية العمل، وكيف تبدأ مشروعك معنا.";
  }

  if (chatFab && chatPanel) {
    chatFab.addEventListener("click", function () {
      chatPanel.classList.add("show");
    });
  }

  if (chatClose && chatPanel) {
    chatClose.addEventListener("click", function () {
      chatPanel.classList.remove("show");
    });
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener("click", function () {
      const value = chatInput.value.trim();
      if (!value) return;

      addChatMessage(value, "user");
      chatInput.value = "";

      setTimeout(function () {
        addChatMessage(botReply(value), "bot");
      }, 400);
    });
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (chatSend) {
          chatSend.click();
        }
      }
    });
  }
});
