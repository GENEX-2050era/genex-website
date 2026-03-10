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
      hero_title_brand: "GENEX",
      hero_title_2: "حيث لا نتخيل المستقبل فقط",
      hero_title_3: "بل نبنيه.",
      hero_title_4: "أنظمة ذكاء اصطناعي مستقلة",

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
      service_card_1_desc: "وحدات آلية معززة بوكيل AI مستقل تتفاعل مع العملاء وتنفذ مهام حقيقية.",
      service_card_2_title: "أتمتة المنشآت",
      service_card_2_desc: "تح
