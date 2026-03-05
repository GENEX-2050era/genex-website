// Reveal animation
const reveals = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting) en.target.classList.add("show");
  });
}, {threshold: 0.12});
reveals.forEach(el=>io.observe(el));

// i18n minimal (Arabic default)
const dict = {
  ar: {
    nav_home:"الرئيسية", nav_services:"الخدمات", nav_projects:"الأعمال", nav_request:"طلب جديد", nav_join:"انضم", nav_contact:"تواصل",
    cta_request:"اطلب الأتمتة", cta_explore:"استكشف الأعمال",
    tagline:"At GENEX we're not just imagining the future, we're building it"
  },
  en: {
    nav_home:"Home", nav_services:"Services", nav_projects:"Projects", nav_request:"New Request", nav_join:"Join", nav_contact:"Contact",
    cta_request:"Request Automation", cta_explore:"Explore Work",
    tagline:"At GENEX we're not just imagining the future, we're building it"
  }
};

function setLang(lang){
  const isAR = lang === "ar";
  document.documentElement.lang = isAR ? "ar" : "en";
  document.documentElement.dir  = isAR ? "rtl" : "ltr";

  const btnAR = document.getElementById("btnAR");
  const btnEN = document.getElementById("btnEN");
  if(btnAR && btnEN){
    btnAR.classList.toggle("active", isAR);
    btnEN.classList.toggle("active", !isAR);
  }

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    const val = dict[lang]?.[key];
    if(val !== undefined) el.textContent = val;
  });

  localStorage.setItem("genex_lang", lang);
}

const saved = localStorage.getItem("genex_lang") || "ar";
setLang(saved);

document.getElementById("btnAR")?.addEventListener("click", ()=>setLang("ar"));
document.getElementById("btnEN")?.addEventListener("click", ()=>setLang("en"));
const toggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if(toggle){
toggle.onclick = () => {
navLinks.classList.toggle("active");
};
}
