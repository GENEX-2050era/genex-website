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
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ===== Language switch =====
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
