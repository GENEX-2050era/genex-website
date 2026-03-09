document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const btnAR = document.getElementById("btnAR");
  const btnEN = document.getElementById("btnEN");

  const dict = {
    ar: {
      nav_home: "الرئيسية",
      nav_services: "الخدمات",
      nav_projects: "الأعمال",
      nav_request: "طلب جديد",
      nav_join: "انضم",
      nav_contact: "تواصل",
      cta_request: "اطلب الأتمتة",
      cta_explore: "استكشف الأعمال"
    },
    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_projects: "Projects",
      nav_request: "New Request",
      nav_join: "Join",
      nav_contact: "Contact",
      cta_request: "Request Automation",
      cta_explore: "Explore Work"
    }
  };

  function setLang(lang) {
    const isAR = lang === "ar";
    document.documentElement.lang = isAR ? "ar" : "en";
    document.documentElement.dir = isAR ? "rtl" : "ltr";

    if (btnAR && btnEN) {
      btnAR.classList.toggle("active", isAR);
      btnEN.classList.toggle("active", !isAR);
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = dict[lang]?.[key];
      if (val) el.textContent = val;
    });

    localStorage.setItem("genex_lang", lang);
  }

  const savedLang = localStorage.getItem("genex_lang") || "ar";
  setLang(savedLang);

  if (btnAR) btnAR.addEventListener("click", () => setLang("ar"));
  if (btnEN) btnEN.addEventListener("click", () => setLang("en"));
});
