(function () {
  const back = document.getElementById("backFxCanvas");
  const front = document.getElementById("frontFxCanvas");
  if (!back || !front) return;

  const ctx = back.getContext("2d");
  const fctx = front.getContext("2d");

  let w = innerWidth, h = innerHeight;

  const logo = new Image();
  logo.src = "./assets/logo.png";

  function resize() {
    w = innerWidth;
    h = innerHeight;
    back.width = front.width = w;
    back.height = front.height = h;
  }
  addEventListener("resize", resize);
  resize();

  /* ===== كواكب (سباحة كاملة) ===== */
  const planets = Array.from({ length: 5 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 500 + Math.random() * 400, // أكبر بكثير
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    tone: Math.random() > 0.5 ? "white" : "red"
  }));

  /* ===== حلقات (تتحرك فعلياً عبر الصفحة) ===== */
  const rings = Array.from({ length: 4 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    rx: 400 + Math.random() * 300,
    ry: 80 + Math.random() * 60,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    rot: Math.random(),
    rotSpeed: (Math.random() - 0.5) * 0.02
  }));

  /* ===== نجوم ===== */
  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5,
    a: Math.random() * 0.2
  }));

  /* ===== شعارات سابحة (سريعة وعشوائية) ===== */
  const logos = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 8 + Math.random() * 18,
    vx: (Math.random() - 0.5) * 2.2, // سرعة أعلى
    vy: (Math.random() - 0.5) * 2.2,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    a: Math.random() * 0.35 + 0.1
  }));

  function wrap(obj, pad = 200) {
    if (obj.x < -pad) obj.x = w + pad;
    if (obj.x > w + pad) obj.x = -pad;
    if (obj.y < -pad) obj.y = h + pad;
    if (obj.y > h + pad) obj.y = -pad;
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#05070f");
    g.addColorStop(1, "#04060c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars() {
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
  }

  function drawPlanets() {
    planets.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      wrap(p, p.r);

      const grad = ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        p.r * 0.1,
        p.x,
        p.y,
        p.r
      );

      if (p.tone === "white") {
        grad.addColorStop(0, "rgba(230,235,255,0.25)");
        grad.addColorStop(1, "rgba(30,40,60,0.1)");
      } else {
        grad.addColorStop(0, "rgba(180,40,50,0.25)");
        grad.addColorStop(1, "rgba(40,10,15,0.1)");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRings() {
    rings.forEach(r => {
      r.x += r.vx;
      r.y += r.vy;
      r.rot += r.rotSpeed;
      wrap(r, 300);

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });
  }

  function drawLogos() {
    if (!logo.complete) return;

    logos.forEach(l => {
      l.x += l.vx;
      l.y += l.vy;
      l.rot += l.rotSpeed;
      wrap(l, 80);

      fctx.save();
      fctx.globalAlpha = l.a;
      fctx.translate(l.x, l.y);
      fctx.rotate(l.rot);
      fctx.drawImage(logo, -l.size / 2, -l.size / 2, l.size, l.size);
      fctx.restore();
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, w, h);
    fctx.clearRect(0, 0, w, h);

    drawBackground();
    drawStars();
    drawPlanets();
    drawRings();
    drawLogos();
  }

  animate();
})();
