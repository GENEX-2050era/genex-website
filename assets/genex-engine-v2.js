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

  const starsFar = Array.from({ length: 180 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.0 + 0.2,
    a: Math.random() * 0.16 + 0.04,
    speed: Math.random() * 0.018 + 0.006,
    depth: 0.05 + Math.random() * 0.08,
    drift: Math.random() * Math.PI * 2
  }));

  const starsMid = Array.from({ length: 150 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.3,
    a: Math.random() * 0.24 + 0.07,
    speed: Math.random() * 0.028 + 0.010,
    depth: 0.10 + Math.random() * 0.12,
    drift: Math.random() * Math.PI * 2
  }));

  const starsNear = Array.from({ length: 95 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.2 + 0.5,
    a: Math.random() * 0.30 + 0.10,
    speed: Math.random() * 0.040 + 0.014,
    depth: 0.18 + Math.random() * 0.16,
    drift: Math.random() * Math.PI * 2
  }));

  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.6 + 0.8,
    a: Math.random() * 0.08 + 0.02,
    speed: Math.random() * 0.10 + 0.04,
    depth: 0.14 + Math.random() * 0.22,
    hue: Math.random() > 0.82 ? "red" : "white",
    drift: Math.random() * Math.PI * 2
  }));

  const planets = [
    { x: -0.05, y: 0.10, r: 480, ring: 1.14, depth: 0.18, color: "white", drift: 0.012 },
    { x: 0.90, y: 0.10, r: 880, ring: 1.18, depth: 0.34, color: "red", drift: 0.010 },
    { x: 0.02, y: 0.90, r: 940, ring: 1.24, depth: 0.40, color: "red", drift: 0.009 },
    { x: 1.03, y: 0.64, r: 540, ring: 1.15, depth: 0.22, color: "white", drift: 0.011 },
    { x: 0.56, y: 1.14, r: 680, ring: 1.17, depth: 0.26, color: "white", drift: 0.010 }
  ];

  const nebulae = [
    { x: 0.20, y: 0.18, r: 0.24, white: 0.010, red: 0.010, dx: 0.018, dy: 0.014 },
    { x: 0.56, y: 0.46, r: 0.30, white: 0.010, red: 0.010, dx: 0.014, dy: -0.012 },
    { x: 0.86, y: 0.78, r: 0.22, white: 0.008, red: 0.008, dx: -0.012, dy: 0.010 }
  ];

  const cores = [
    { x: 0.22, y: 0.22, r: 110, white: 0.028, red: 0.012, dx: 0.12, dy: 0.08, travelX: 0.22, travelY: 0.16 },
    { x: 0.72, y: 0.34, r: 90,  white: 0.020, red: 0.016, dx: -0.10, dy: 0.07, travelX: 0.20, travelY: 0.20 },
    { x: 0.44, y: 0.72, r: 120, white: 0.022, red: 0.012, dx: 0.08, dy: -0.11, travelX: 0.18, travelY: 0.18 }
  ];

  function drawBase() {
    const g = backCtx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#010209");
    g.addColorStop(0.25, "#02040b");
    g.addColorStop(0.60, "#02050d");
    g.addColorStop(1, "#010209");
    backCtx.fillStyle = g;
    backCtx.fillRect(0, 0, w, h);
  }

  function drawNebula(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";
    backCtx.filter = "blur(100px)";

    nebulae.forEach((n, i) => {
      const cx = w * n.x + Math.sin(t * n.dx + i) * w * 0.025 + mouse.x * 10;
      const cy = h * n.y + Math.cos(t * n.dy + i) * h * 0.025 + mouse.y * 8 + scrollCurrent * 26;
      const r = Math.min(w, h) * n.r;

      const grad = backCtx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
      grad.addColorStop(0, `rgba(255,255,255,${n.white})`);
      grad.addColorStop(0.32, `rgba(255,255,255,${n.white * 0.35})`);
      grad.addColorStop(0.60, `rgba(110,10,20,${n.red})`);
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
    backCtx.filter = "blur(18px)";

    cores.forEach((c, i) => {
      const x = (c.x + Math.sin(t * c.dx + i) * c.travelX) * w + mouse.x * 8;
      const y = (c.y + Math.cos(t * c.dy + i) * c.travelY) * h + mouse.y * 6 + scrollCurrent * 14;

      const grad = backCtx.createRadialGradient(x, y, 0, x, y, c.r);
      grad.addColorStop(0, `rgba(255,255,255,${c.white})`);
      grad.addColorStop(0.30, `rgba(255,255,255,${c.white * 0.45})`);
      grad.addColorStop(0.58, `rgba(120,14,24,${c.red})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      backCtx.fillStyle = grad;
      backCtx.beginPath();
      backCtx.arc(x, y, c.r, 0, Math.PI * 2);
      backCtx.fill();
    });

    backCtx.restore();
  }

  function drawStars(t, stars, crossEvery = 0) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    stars.forEach((s, i) => {
      const x = s.x * w + Math.sin(t * s.speed + s.drift) * 8 + mouse.x * 18 * s.depth;
      const y = s.y * h + Math.cos(t * s.speed + s.drift) * 8 + mouse.y * 14 * s.depth + scrollCurrent * 26 * s.depth;

      backCtx.beginPath();
      backCtx.arc(x, y, s.r, 0, Math.PI * 2);
      backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
      backCtx.fill();

      if (crossEvery && i % crossEvery === 0) {
        backCtx.beginPath();
        backCtx.moveTo(x - s.r * 2.0, y);
        backCtx.lineTo(x + s.r * 2.0, y);
        backCtx.moveTo(x, y - s.r * 2.0);
        backCtx.lineTo(x, y + s.r * 2.0);
        backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.18})`;
        backCtx.lineWidth = 0.5;
        backCtx.stroke();
      }
    });

    backCtx.restore();
  }

  function drawPlanetDetail(x, y, r, color) {
    const body = backCtx.createRadialGradient(x - r * 0.18, y - r * 0.18, r * 0.08, x, y, r * 0.66);

    if (color === "white") {
      body.addColorStop(0, "rgba(255,255,255,0.18)");
      body.addColorStop(0.25, "rgba(210,220,235,0.13)");
      body.addColorStop(0.60, "rgba(150,165,180,0.08)");
      body.addColorStop(1, "rgba(90,100,115,0.02)");
    } else {
      body.addColorStop(0, "rgba(160,34,46,0.20)");
      body.addColorStop(0.28, "rgba(118,18,30,0.15)");
      body.addColorStop(0.60, "rgba(80,10,18,0.09)");
      body.addColorStop(1, "rgba(40,4,10,0.03)");
    }

    backCtx.fillStyle = body;
    backCtx.beginPath();
    backCtx.arc(x, y, r * 0.66, 0, Math.PI * 2);
    backCtx.fill();

    backCtx.save();
    backCtx.globalAlpha = 0.14;
    for (let i = 0; i < 4; i++) {
      backCtx.beginPath();
      backCtx.ellipse(
        x + (i - 1.5) * r * 0.05,
        y + (i - 1.5) * r * 0.02,
        r * (0.42 - i * 0.04),
        r * (0.10 + i * 0.01),
        0.18,
        0,
        Math.PI * 2
      );
      backCtx.strokeStyle = color === "white" ? "rgba(255,255,255,0.18)" : "rgba(170,40,54,0.22)";
      backCtx.lineWidth = 1;
      backCtx.stroke();
    }
    backCtx.restore();
  }

  function drawPlanet(p, t, i) {
    const x = p.x * w + Math.sin(t * p.drift + i) * 14 + mouse.x * 18 * p.depth;
    const y = p.y * h + Math.cos(t * p.drift + i) * 12 + mouse.y * 12 * p.depth + scrollCurrent * 28 * p.depth;
    const r = p.r * (1 + Math.sin(t * 0.10 + i) * 0.004);
    const rot = Math.sin(t * 0.04 + i) * 0.26;

    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    const halo = backCtx.createRadialGradient(x, y, r * 0.08, x, y, r);
    const inner = backCtx.createRadialGradient(x, y, r * 0.05, x, y, r * 0.72);

    if (p.color === "white") {
      halo.addColorStop(0, "rgba(255,255,255,0.028)");
      halo.addColorStop(0.26, "rgba(255,255,255,0.016)");
      halo.addColorStop(0.60, "rgba(255,255,255,0.005)");
      halo.addColorStop(1, "rgba(255,255,255,0)");

      inner.addColorStop(0, "rgba(255,255,255,0.045)");
      inner.addColorStop(0.30, "rgba(255,255,255,0.014)");
      inner.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      halo.addColorStop(0, "rgba(90,8,20,0.040)");
      halo.addColorStop(0.26, "rgba(90,8,20,0.020)");
      halo.addColorStop(0.60, "rgba(90,8,20,0.006)");
      halo.addColorStop(1, "rgba(90,8,20,0)");

      inner.addColorStop(0, "rgba(132,12,28,0.060)");
      inner.addColorStop(0.30, "rgba(96,8,18,0.018)");
      inner.addColorStop(1, "rgba(96,8,18,0)");
    }

    backCtx.fillStyle = halo;
    backCtx.beginPath();
    backCtx.arc(x, y, r, 0, Math.PI * 2);
    backCtx.fill();

    backCtx.fillStyle = inner;
    backCtx.beginPath();
    backCtx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    backCtx.fill();

    drawPlanetDetail(x, y, r, p.color);

    backCtx.strokeStyle = p.color === "white"
      ? "rgba(255,255,255,0.04)"
      : "rgba(96,8,18,0.05)";
    backCtx.lineWidth = 1.1;

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

    for (let i = 0; i < 12; i++) {
      const px = (i / 12) * w + Math.sin(t * 0.08 + i) * 22 + mouse.x * 6;
      const py = h * (0.10 + (i % 4) * 0.20) + Math.cos(t * 0.10 + i) * 10 + mouse.y * 4;
      const len = 120 + (i % 3) * 36;

      const grad = frontCtx.createLinearGradient(px, py, px + len, py);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.34, "rgba(255,255,255,0.014)");
      grad.addColorStop(0.68, "rgba(90,8,18,0.014)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      frontCtx.strokeStyle = grad;
      frontCtx.lineWidth = 1;
      frontCtx.beginPath();
      frontCtx.moveTo(px, py);
      frontCtx.quadraticCurveTo(px + len * 0.5, py - 6, px + len, py + 1);
      frontCtx.stroke();
    }

    particles.forEach((p, i) => {
      const x = p.x * w + Math.sin(t * p.speed + p.drift + i) * 14 + mouse.x * 6 * p.depth;
      const y = p.y * h + Math.cos(t * p.speed + p.drift + i) * 12 + mouse.y * 5 * p.depth + scrollCurrent * 14 * p.depth;

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
    drawStars(t, starsFar, 0);
    drawStars(t, starsMid, 0);
    drawStars(t, starsNear, 12);
    drawPlanets(t);
    drawFrontLayer(t);
  }

  resize();
  animate();
})();
