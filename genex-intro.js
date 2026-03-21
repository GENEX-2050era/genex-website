window.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById("genexIntro");
  if (!intro) return;

  const page = document.body.getAttribute("data-page");
  const introEnabled = document.body.getAttribute("data-intro");

  if (page !== "index" || introEnabled !== "true") {
    intro.remove();
    return;
  }

  let closed = false;

  function closeIntro() {
    if (closed) return;
    closed = true;

    intro.classList.add("hidden");

    setTimeout(function () {
      intro.style.display = "none";
    }, 900);
  }

  setTimeout(closeIntro, 2200);
  intro.addEventListener("click", closeIntro, { once: true });
});
