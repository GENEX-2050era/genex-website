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

  const starsFar = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.0 + 0.2,
    a: Math.random() * 0.16 + 0.04,
    speed: Math.random() * 0.022 + 0.006,
    depth: 0.05 + Math.random() * 0.08,
    drift: Math.random() * Math.PI * 2
  }));

  const starsMid = Array.from({ length: 150 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.25,
    a: Math.random() * 0.22 + 0.06,
    speed: Math.random() * 0.035 + 0.010,
    depth: 0.10 + Math.random() * 0.12,
    drift: Math.random() * Math.PI * 2
  }));

  const starsNear = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.0 + 0.3,
    a: Math.random() * 0.28 + 0.08,
    speed: Math.random() * 0.045 + 0.014,
    depth: 0.16 + Math.random() * 0.18,
    drift: Math.random() * Math.PI * 2
  }));

  const particles = Array.from({ length: 110 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.1 + 0.7,
    a: Math.random() * 0.06 + 0.015,
    speed: Math.random() * 0.20 + 0.04,
    depth: 0.12 + Math.random() * 0.20,
    hue: Math.random() > 0.84 ? "red" : "white",
    drift: Math.random() * Math.PI * 2
  }));

  const planets = [
    { x: -0.05, y: 0.14, r: 460, ring: 1.14, depth: 0.18, color: "white", drift: 0.020 },
    { x: 0.88, y: 0.10, r: 840, ring: 1.18, depth: 0.34, color: "red", drift: 0.016 },
    { x: 0.06, y: 0.88, r: 900, ring: 1.24, depth: 0.40, color: "red", drift: 0.014 },
    { x: 1.02, y: 0.62, r: 500, ring: 1.15, depth: 0.22, color: "white", drift: 0.018 },
    { x: 0.54, y: 1.14, r: 620, ring: 1.16, depth: 0.26, color: "white", drift: 0.017 }
  ];

  const nebulae = [
    { x: 0.16, y: 0.18, r: 0.30, white: 0.020, red: 0.014, dx: 0.035, dy: 0.026 },
    { x: 0.52, y: 0.46, r: 0.38, white: 0.016, red: 0.012, dx: 0.026, dy: -0.020 },
    { x: 0.84, y: 0.78, r: 0.26, white: 0.014, red: 0.010, dx: -0.020, dy: 0.016 }
  ];

  function drawBase() {
    const g = backCtx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#010209");
    g.addColorStop(0.30, "#02040b");
    g.addColorStop(0.65, "#02050d");
    g.addColorStop(1, "#010209");
    backCtx.fillStyle = g;
    backCtx.fillRect(0, 0, w, h);
  }

  function drawNebula(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";
    backCtx.filter = "blur(120px)";

    nebulae.forEach((n, i) => {
      const cx = w * n.x + Math.sin(t * n.dx + i) * w * 0.03 + mouse.x * 16;
      const cy = h * n.y + Math.cos(t * n.dy + i) * h * 0.03 + mouse.y * 12 + scrollCurrent * 34;
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

  function drawStars(t, stars, crossEvery = 0) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    stars.forEach((s, i) => {
      const x = s.x * w + Math.sin(t * s.speed + s.drift) * 6 + mouse.x * 18 * s.depth;
      const y = s.y * h + Math.cos(t * s.speed + s.drift) * 6 + mouse.y * 12 * s.depth + scrollCurrent * 22 * s.depth;

      backCtx.beginPath();
      backCtx.arc(x, y, s.r, 0, Math.PI * 2);
      backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
      backCtx.fill();

      if (crossEvery && i % crossEvery === 0) {
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
      outer.addColorStop(0, "rgba(255,255,255,0.045)");
      outer.addColorStop(0.24, "rgba(255,255,255,0.024)");
      outer.addColorStop(0.60, "rgba(255,255,255,0.008)");
      outer.addColorStop(1, "rgba(255,255,255,0)");

      inner.addColorStop(0, "rgba(255,255,255,0.11)");
      inner.addColorStop(0.30, "rgba(255,255,255,0.032)");
      inner.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      outer.addColorStop(0, "rgba(90,8,20,0.082)");
      outer.addColorStop(0.24, "rgba(90,8,20,0.048)");
      outer.addColorStop(0.60, "rgba(90,8,20,0.016)");
      outer.addColorStop(1, "rgba(90,8,20,0)");

      inner.addColorStop(0, "rgba(132,12,28,0.18)");
      inner.addColorStop(0.30, "rgba(96,8,18,0.056)");
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
    drawStars(t, starsFar, 0);
    drawStars(t, starsMid, 0);
    drawStars(t, starsNear, 14);
    drawPlanets(t);
    drawFrontLayer(t);
  }

  resize();
  animate();
})();
