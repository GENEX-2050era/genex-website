(function () {
  const intro = document.getElementById("genexIntro");
  if (!intro) return;

  const isIntroEnabled = document.body.getAttribute("data-intro") === "true";
  const isHomePage = document.body.getAttribute("data-page") === "index";

  if (!isIntroEnabled || !isHomePage) {
    intro.style.display = "none";
    return;
  }

  let closed = false;

  const closeIntro = () => {
    if (closed) return;
    closed = true;
    intro.classList.add("hidden");
    setTimeout(() => {
      intro.style.display = "none";
    }, 900);
  };

  window.addEventListener("load", () => {
    setTimeout(closeIntro, 2200);
  });

  intro.addEventListener("click", closeIntro, { once: true });
})();
