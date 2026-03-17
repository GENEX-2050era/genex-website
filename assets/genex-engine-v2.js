(function () {
  const backCanvas = document.getElementById("backFxCanvas");
  const frontCanvas = document.getElementById("frontFxCanvas");
  if (!backCanvas || !frontCanvas) return;

  const backCtx = backCanvas.getContext("2d");
  const frontCtx = frontCanvas.getContext("2d");

  let w = window.innerWidth;
  let h = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const mouse = { x: 0, y: 0 };
  const mouseTarget = { x: 0, y: 0 };
  let scrollTarget = 0;
  let scrollCurrent = 0;

  function resizeCanvas(canvas, ctx) {
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resizeCanvas(backCanvas, backCtx);
    resizeCanvas(frontCanvas, frontCtx);
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mouseTarget.x = (e.clientX / w) * 2 - 1;
    mouseTarget.y = (e.clientY / h) * 2 - 1;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollTarget = window.scrollY / maxScroll;
  }, { passive: true });

  const stars = Array.from({ length: 260 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.8 + 0.3,
    a: Math.random() * 0.28 + 0.06,
    speed: Math.random() * 0.04 + 0.01,
    depth: 0.10 + Math.random() * 0.16,
    drift: Math.random() * Math.PI * 2
  }));

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.4 + 0.7,
    a: Math.random() * 0.06 + 0.015,
    speed: Math.random() * 0.14 + 0.03,
    depth: 0.12 + Math.random() * 0.18,
    hue: Math.random() > 0.82 ? "red" : "white",
    drift: Math.random() * Math.PI * 2
  }));

  const planets = [
    { x: -0.04, y: 0.12, r: 520, ring: 1.16, depth: 0.18, color: "white", drift: 0.018 },
    { x: 0.87, y: 0.10, r: 950, ring: 1.20, depth: 0.34, color: "red", drift: 0.014 },
    { x: 0.04, y: 0.88, r: 980, ring: 1.24, depth: 0.42, color: "red", drift: 0.012 },
    { x: 1.04, y: 0.62, r: 560, ring: 1.16, depth: 0.22, color: "white", drift: 0.016 },
    { x: 0.54, y: 1.16, r: 700, ring: 1.18, depth: 0.26, color: "white", drift: 0.015 }
  ];

  const cores = [
    { x: 0.56, y: 0.24, r: 170, white: 0.060, red: 0.020, dx: 0.05, dy: 0.04 },
    { x: 0.34, y: 0.62, r: 120, white: 0.030, red: 0.030, dx: -0.03, dy: 0.05 }
  ];

  const nebulae = [
    { x: 0.18, y: 0.18, r: 0.30, white: 0.020, red: 0.014, dx: 0.035, dy: 0.026 },
    { x: 0.52, y: 0.46, r: 0.40, white: 0.016, red: 0.012, dx: 0.026, dy: -0.020 },
    { x: 0.84, y: 0.78, r: 0.28, white: 0.014, red: 0.010, dx: -0.020, dy: 0.016 }
  ];

  function drawBase() {
    const g = backCtx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#010209");
    g.addColorStop(0.28, "#02040b");
    g.addColorStop(0.62, "#02050d");
    g.addColorStop(1, "#010209");
    backCtx.fillStyle = g;
    backCtx.fillRect(0, 0, w, h);
  }

  function drawNebula(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";
    backCtx.filter = "blur(120px)";

    nebulae.forEach((n, i) => {
      const cx = w * n.x + Math.sin(t * n.dx + i) * w * 0.03 + mouse.x * 18;
      const cy = h * n.y + Math.cos(t * n.dy + i) * h * 0.03 + mouse.y * 14 + scrollCurrent * 34;
      const r = Math.min(w, h) * n.r;

      const grad = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
      grad.addColorStop(0, `rgba(255,255,255,${n.white})`);
      grad.addColorStop(0.30, `rgba(255,255,255,${n.white * 0.36})`);
      grad.addColorStop(0.58, `rgba(110,10,20,${n.red})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      backCtx.fillStyle = grad;
      backCtx.beginPath();
      backCtx.arc(cx, cy, r, 0, Math.PI * 2);
      backCtx.fill();
    });

    backCtx.restore();
  }

  function drawCores(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";
    backCtx.filter = "blur(28px)";

    cores.forEach((c, i) => {
      const x = c.x * w + Math.sin(t * c.dx + i) * 18 + mouse.x * 10;
      const y = c.y * h + Math.cos(t * c.dy + i) * 14 + mouse.y * 8 + scrollCurrent * 12;

      const grad = backCtx.createRadialGradient(x, y, 0, x, y, c.r);
      grad.addColorStop(0, `rgba(255,255,255,${c.white})`);
      grad.addColorStop(0.28, `rgba(255,255,255,${c.white * 0.45})`);
      grad.addColorStop(0.55, `rgba(120,14,24,${c.red})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      backCtx.fillStyle = grad;
      backCtx.beginPath();
      backCtx.arc(x, y, c.r, 0, Math.PI * 2);
      backCtx.fill();
    });

    backCtx.restore();
  }

  function drawStars(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    stars.forEach((s, i) => {
      const x = s.x * w + Math.sin(t * s.speed + s.drift) * 7 + mouse.x * 16 * s.depth;
      const y = s.y * h + Math.cos(t * s.speed + s.drift) * 7 + mouse.y * 12 * s.depth + scrollCurrent * 20 * s.depth;

      backCtx.beginPath();
      backCtx.arc(x, y, s.r, 0, Math.PI * 2);
      backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
      backCtx.fill();

      if (i % 15 === 0) {
        backCtx.beginPath();
        backCtx.moveTo(x - s.r * 2.2, y);
        backCtx.lineTo(x + s.r * 2.2, y);
        backCtx.moveTo(x, y - s.r * 2.2);
        backCtx.lineTo(x, y + s.r * 2.2);
        backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.14})`;
        backCtx.lineWidth = 0.5;
        backCtx.stroke();
      }
    });

    backCtx.restore();
  }

  function drawPlanet(p, t, i) {
    const x = p.x * w + Math.sin(t * p.drift + i) * 12 + mouse.x * 18 * p.depth;
    const y = p.y * h + Math.cos(t * p.drift + i) * 10 + mouse.y * 12 * p.depth + scrollCurrent * 28 * p.depth;
    const r = p.r * (1 + Math.sin(t * 0.12 + i) * 0.004);
    const rot = Math.sin(t * 0.04 + i) * 0.30;

    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    const outer = backCtx.createRadialGradient(x, y, r * 0.08, x, y, r);
    const inner = backCtx.createRadialGradient(x, y, r * 0.05, x, y, r * 0.56);

    if (p.color === "white") {
      outer.addColorStop(0, "rgba(255,255,255,0.05)");
      outer.addColorStop(0.24, "rgba(255,255,255,0.028)");
      outer.addColorStop(0.60, "rgba(255,255,255,0.010)");
      outer.addColorStop(1, "rgba(255,255,255,0)");

      inner.addColorStop(0, "rgba(255,255,255,0.13)");
      inner.addColorStop(0.30, "rgba(255,255,255,0.036)");
      inner.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      outer.addColorStop(0, "rgba(90,8,20,0.085)");
      outer.addColorStop(0.24, "rgba(90,8,20,0.05)");
      outer.addColorStop(0.60, "rgba(90,8,20,0.018)");
      outer.addColorStop(1, "rgba(90,8,20,0)");

      inner.addColorStop(0, "rgba(132,12,28,0.20)");
      inner.addColorStop(0.30, "rgba(96,8,18,0.060)");
      inner.addColorStop(1, "rgba(96,8,18,0)");
    }

    backCtx.fillStyle = outer;
    backCtx.beginPath();
    backCtx.arc(x, y, r, 0, Math.PI * 2);
    backCtx.fill();

    backCtx.fillStyle = inner;
    backCtx.beginPath();
    backCtx.arc(x, y, r * 0.56, 0, Math.PI * 2);
    backCtx.fill();

    backCtx.strokeStyle = p.color === "white"
      ? "rgba(255,255,255,0.03)"
      : "rgba(96,8,18,0.038)";
    backCtx.lineWidth = 1;

    backCtx.beginPath();
    backCtx.ellipse(x, y, r * p.ring, r * 0.15, rot, 0, Math.PI * 2);
    backCtx.stroke();

    backCtx.beginPath();
    backCtx.ellipse(x, y, r * (p.ring * 0.78), r * 0.11, -rot * 0.7, 0, Math.PI * 2);
    backCtx.stroke();

    backCtx.restore();
  }

  function drawPlanets(t) {
    planets.forEach((p, i) => drawPlanet(p, t, i));
  }

  function drawFrontLayer(t) {
    frontCtx.clearRect(0, 0, w, h);
    frontCtx.save();
    frontCtx.globalCompositeOperation = "screen";

    for (let i = 0; i < 10; i++) {
      const px = (i / 10) * w + Math.sin(t * 0.09 + i) * 18 + mouse.x * 5;
      const py = h * (0.12 + (i % 4) * 0.20) + Math.cos(t * 0.11 + i) * 8 + mouse.y * 4;
      const len = 110 + (i % 3) * 34;

      const grad = frontCtx.createLinearGradient(px, py, px + len, py);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.34, "rgba(255,255,255,0.012)");
      grad.addColorStop(0.68, "rgba(90,8,18,0.012)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      frontCtx.strokeStyle = grad;
      frontCtx.lineWidth = 1;
      frontCtx.beginPath();
      frontCtx.moveTo(px, py);
      frontCtx.quadraticCurveTo(px + len * 0.5, py - 6, px + len, py + 1);
      frontCtx.stroke();
    }

    particles.forEach((p, i) => {
      const x = p.x * w + Math.sin(t * p.speed + p.drift + i) * 11 + mouse.x * 5 * p.depth;
      const y = p.y * h + Math.cos(t * p.speed + p.drift + i) * 10 + mouse.y * 4 * p.depth + scrollCurrent * 12 * p.depth;

      frontCtx.beginPath();
      frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
      frontCtx.fillStyle = p.hue === "red"
        ? `rgba(90,8,18,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      frontCtx.fill();
    });

    frontCtx.restore();
  }

  function animate() {
    requestAnimationFrame(animate);

    const t = performance.now() * 0.001;
    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.05;

    backCtx.clearRect(0, 0, w, h);
    drawBase();
    drawNebula(t);
    drawCores(t);
    drawStars(t);
    drawPlanets(t);
    drawFrontLayer(t);
  }

  resize();
  animate();
})();
