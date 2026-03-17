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

  /* ===== كواكب (أصغر + حركة ناعمة) ===== */
  const planets = Array.from({ length: 5 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 180 + Math.random() * 180, // أصغر وواضح
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    tone: Math.random() > 0.5 ? "white" : "red"
  }));

  /* ===== حلقات (حركة واضحة لكن ناعمة) ===== */
  const rings = Array.from({ length: 3 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    rx: 260 + Math.random() * 200,
    ry: 60 + Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    rot: Math.random(),
    rotSpeed: (Math.random() - 0.5) * 0.01
  }));

  /* ===== نجوم (تسبح) ===== */
  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6,
    a: Math.random() * 0.35 + 0.05,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2
  }));

  /* ===== شعارات (أسرع لكن متوازنة) ===== */
  const logos = Array.from({ length: 45 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 10 + Math.random() * 14,
    vx: (Math.random() - 0.5) * 0.9,
    vy: (Math.random() - 0.5) * 0.9,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    a: Math.random() * 0.3 + 0.1
  }));

  function wrap(o, pad = 100) {
    if (o.x < -pad) o.x = w + pad;
    if (o.x > w + pad) o.x = -pad;
    if (o.y < -pad) o.y = h + pad;
    if (o.y > h + pad) o.y = -pad;
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#02030a");
    g.addColorStop(1, "#03050c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars() {
    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      wrap(s, 10);

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
        grad.addColorStop(0, "rgba(220,230,255,0.25)");
        grad.addColorStop(1, "rgba(40,50,70,0.1)");
      } else {
        grad.addColorStop(0, "rgba(150,30,40,0.25)");
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
      wrap(r, 200);

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);

      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 2.5;

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
      wrap(l, 60);

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
