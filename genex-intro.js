window.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById("genexIntro");
  if (!intro) return;

  const page = document.body.getAttribute("data-page");
  const introEnabled = document.body.getAttribute("data-intro");

  // فقط الرئيسية
  if (page !== "index" || introEnabled !== "true") {
    intro.style.display = "none";
    return;
  }

  let closed = false;

  function closeIntro() {
    if (closed) return;
    closed = true;

    // إخفاء مباشر بدون الاعتماد على CSS
    intro.style.transition = "opacity .6s ease";
    intro.style.opacity = "0";

    setTimeout(function () {
      intro.style.display = "none";
    }, 600);
  }

  // إغلاق تلقائي
  setTimeout(closeIntro, 2200);

  // إغلاق عند الضغط
  intro.addEventListener("click", closeIntro);
});
