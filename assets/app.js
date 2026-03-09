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
      heroTitle1: "في GENEX...",
      heroTitle2: "نحن لا نتخيّل المستقبل فقط،",
      heroTitle3: "بل نبنيه.",
      heroDesc: "GENEX تبني أنظمة ذكاء اصطناعي متقدمة لتحويل الخدمات التقليدية في المتاجر، والمنشآت الخاصة، والجهات الحكومية إلى عمليات آلية بالكامل، أكثر سرعة، وأكثر دقة، وأكثر قابلية للتوسع.",
      heroBtn: "اكتشف خدمات GENEX",
      kpi1Title: "تحول سريع",
      kpi1Desc: "من الفكرة إلى نموذج تشغيلي واضح خلال وقت قصير.",
      kpi2Title: "ذكاء قابل للتوسع",
      kpi2Desc: "أنظمة تنمو مع المنشأة وتتكامل مع أدواتها الحالية.",
      kpi3Title: "جاهزية مؤسسية",
      kpi3Desc: "حلول موثوقة مع وضوح في البنية والمراقبة.",
      whatTitle: "ماذا تقدم GENEX؟",
      whatDesc: "نبني حلول أتمتة وذكاء اصطناعي مصممة لتقليل الاعتماد على العمل اليدوي وتحويل العمليات إلى أنظمة ذكية مستقلة.",
      service1: "مساعدات ذكاء اصطناعي",
      service1d: "مساعدات رقمية تتفاعل مع العملاء وتنفذ مهام حقيقية.",
      service2: "أتمتة المنشآت",
      service2d: "تحويل الإجراءات اليومية إلى تدفقات عمل مؤتمتة وواضحة.",
      service3: "رؤية تشغيلية ذكية",
      service3d: "لوحات متابعة وتحليل تساعد على اتخاذ قرارات أسرع.",
      earlyTitle: "برنامج الشركاء الأوائل",
      earlyDesc: "نفتح الآن المجال لأول العملاء الذين يرغبون في بناء أنظمة أتمتة وذكاء اصطناعي مع GENEX. هذه المرحلة مخصصة للشركات والمنشآت التي ترغب في أن تكون من أوائل الجهات التي تتبنى البنية التشغيلية الذكية.",
      earlyPoint1: "أولوية في دراسة الاحتياج والتصميم",
      earlyPoint2: "حلول مخصصة بحسب طبيعة نشاطك",
      earlyPoint3: "فرصة لبناء أول حالة نجاح مشتركة مع GENEX",
      workTitle: "كيف نعمل؟",
      workDesc: "منهجية GENEX تركز على فهم الخدمة، تصميم الحل، ثم تحويله إلى نظام يعمل على أرض الواقع.",
      work1: "فهم التحدي",
      work1d: "تحليل العملية الحالية وتحديد نقاط التأخير والتكرار.",
      work2: "تصميم النظام",
      work2d: "بناء تصور واضح للحل المناسب من ناحية الأتمتة والذكاء الاصطناعي.",
      work3: "التنفيذ والتطوير",
      work3d: "تحويل التصور إلى تجربة فعلية قابلة للتشغيل والتحسين المستمر.",
      finalTitle: "ابدأ مع GENEX",
      finalDesc: "إذا كنت تبحث عن تحويل خدماتك أو منشأتك إلى بيئة تعتمد على الذكاء الاصطناعي والأتمتة، فابدأ من هنا.",
      finalBtn: "ابدأ مشروعك مع GENEX",
      footerText: "Autonomous AI Systems"
    },
    en: {
      home: "Home",
      services: "Services",
      request: "New Request",
      join: "Join",
      contact: "Contact",
      ask: "Start Your Project with GENEX",
      heroTitle1: "At GENEX...",
      heroTitle2: "we're not just imagining the future,",
      heroTitle3: "we're building it.",
      heroDesc: "GENEX builds advanced AI systems to transform traditional services across retail, private facilities, and government entities into fully automated operations that are faster, smarter, and more scalable.",
      heroBtn: "Explore GENEX Services",
      kpi1Title: "Rapid Transformation",
      kpi1Desc: "From concept to operational model in a short time.",
      kpi2Title: "Scalable Intelligence",
      kpi2Desc: "Systems designed to grow with your organization.",
      kpi3Title: "Enterprise Readiness",
      kpi3Desc: "Reliable solutions with clear architecture and monitoring.",
      whatTitle: "What does GENEX offer?",
      whatDesc: "We build AI and automation solutions that reduce manual dependency and transform operations into intelligent autonomous systems.",
      service1: "AI Assistants",
      service1d: "Digital assistants that interact with customers and execute real tasks.",
      service2: "Facility Automation",
      service2d: "Transforming daily procedures into clear automated workflows.",
      service3: "Operational Intelligence",
      service3d: "Dashboards and analytics for faster decision-making.",
      earlyTitle: "Early Partners Program",
      earlyDesc: "We are now opening access to our first partners who want to build AI and automation systems with GENEX. This phase is designed for organizations ready to adopt intelligent operational infrastructure early.",
      earlyPoint1: "Priority in requirement study and system design",
      earlyPoint2: "Tailored solutions based on your business model",
      earlyPoint3: "Opportunity to build the first joint success case with GENEX",
      workTitle: "How We Work",
      workDesc: "GENEX follows a process focused on understanding the challenge, designing the solution, then transforming it into a working system.",
      work1: "Understand the Challenge",
      work1d: "Analyze the current process and identify friction points.",
      work2: "Design the System",
      work2d: "Create the right automation and AI solution blueprint.",
      work3: "Build & Evolve",
      work3d: "Turn the concept into a live system with continuous improvement.",
      finalTitle: "Start with GENEX",
      finalDesc: "If you're ready to transform your services into an AI-driven automated environment, start here.",
      finalBtn: "Start Your Project with GENEX",
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

// ===== GENEX Geometric Background =====

const canvas = document.getElementById("bgCanvas");

if(canvas){

const ctx = canvas.getContext("2d");

let w,h;
let points=[];
let scrollY=0;

function resize(){

w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

createPoints();

}

function rand(min,max){
return Math.random()*(max-min)+min;
}

function createPoints(){

const count = Math.floor(w/90)+20;

points=[];

for(let i=0;i<count;i++){

points.push({

x:rand(0,w),
y:rand(80,h-80),
vx:rand(-0.2,0.2),
vy:rand(-0.2,0.2)

});

}

}

function animate(){

ctx.clearRect(0,0,w,h);

const offset = -scrollY*0.35;

for(let i=0;i<points.length;i++){

const p=points[i];

p.x+=p.vx;
p.y+=p.vy;

if(p.x<0||p.x>w) p.vx*=-1;
if(p.y<80||p.y>h-80) p.vy*=-1;

const drawY=p.y+offset;

ctx.beginPath();
ctx.arc(p.x,drawY,2.5,0,Math.PI*2);
ctx.fillStyle=i%3===0
? "rgba(255,255,255,.85)"
: "rgba(177,18,38,.8)";
ctx.fill();

}

for(let i=0;i<points.length;i++){

for(let j=i+1;j<points.length;j++){

const a=points[i];
const b=points[j];

const dx=a.x-b.x;
const dy=a.y-b.y;

const d=Math.sqrt(dx*dx+dy*dy);

if(d<170){

ctx.beginPath();

ctx.moveTo(a.x,a.y+offset);
ctx.lineTo(b.x,b.y+offset);

ctx.strokeStyle=d<100
? "rgba(177,18,38,.35)"
: "rgba(255,255,255,.18)";

ctx.lineWidth=1;
ctx.stroke();

}

}

}

requestAnimationFrame(animate);

}

window.addEventListener("scroll",()=>{

scrollY=window.scrollY;

});

resize();
animate();

window.addEventListener("resize",resize);

}
