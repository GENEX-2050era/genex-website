(function () {
  const backCanvas = document.getElementById("backFxCanvas");
  const frontCanvas = document.getElementById("frontFxCanvas");
  if (!backCanvas || !frontCanvas) return;

  const backCtx = backCanvas.getContext("2d", { alpha: true });
  const frontCtx = frontCanvas.getContext("2d", { alpha: true });

  let w = window.innerWidth;
  let h = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.8);

  const mouse = { x: 0, y: 0 };
  const mouseTarget = { x: 0, y: 0 };
  let scrollTarget = 0;
  let scrollCurrent = 0;

  const logoImg = new Image();
  logoImg.src = "./assets/logo.png";
  let logoReady = false;
  logoImg.onload = () => { logoReady = true; };

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
    dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    resizeCanvas(backCanvas, backCtx);
    resizeCanvas(frontCanvas, frontCtx);
  }

  window.addEventListener("resize", resize, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouseTarget.x = (e.clientX / w) * 2 - 1;
    mouseTarget.y = (e.clientY / h) * 2 - 1;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    mouseTarget.x = (t.clientX / w) * 2 - 1;
    mouseTarget.y = (t.clientY / h) * 2 - 1;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollTarget = window.scrollY / maxScroll;
  }, { passive: true });

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    a: Math.random() * 0.16 + 0.04,
    depth: 0.08 + Math.random() * 0.12,
    drift: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.018 + 0.006
  }));

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.6 + 0.8,
    a: Math.random() * 0.065 + 0.02,
    depth: 0.10 + Math.random() * 0.18,
    drift: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.030 + 0.010,
    hue: Math.random() > 0.84 ? "red" : "white"
  }));

  const logoParticles = Array.from({ length: 28 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 18 + 12,
    a: Math.random() * 0.12 + 0.04,
    depth: 0.08 + Math.random() * 0.18,
    drift: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.020 + 0.008,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.003
  }));

  const spheres = [
    { x: 0.08, y: 0.16, r: 230, depth: 0.14, drift: 0.010, tone: "white", vx: 0.06, vy: 0.04 },
    { x: 0.84, y: 0.14, r: 320, depth: 0.22, drift: 0.008, tone: "red",   vx: -0.04, vy: 0.05 },
    { x: 0.12, y: 0.82, r: 360, depth: 0.24, drift: 0.007, tone: "red",   vx: 0.05, vy: -0.03 },
    { x: 0.88, y: 0.70, r: 250, depth: 0.16, drift: 0.011, tone: "white", vx: -0.03, vy: -0.04 },
    { x: 0.54, y: 1.06, r: 290, depth: 0.18, drift: 0.009, tone: "white", vx: 0.02, vy: -0.05 }
  ];

  const rings = [
    { x: 0.54, y: 0.20, rx: 280, ry: 64, depth: 0.08, speed: 0.030, tilt: 0.14 },
    { x: 0.40, y: 0.66, rx: 360, ry: 86, depth: 0.10, speed: 0.024, tilt: -0.12 },
    { x: 0.78, y: 0.54, rx: 300, ry: 72, depth: 0.09, speed: 0.028, tilt: 0.20 }
  ];

  function drawBase() {
    const g = backCtx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#04060c");
    g.addColorStop(0.5, "#050812");
    g.addColorStop(1, "#04060c");
    backCtx.fillStyle = g;
    backCtx.fillRect(0, 0, w, h);
  }

  function drawFog(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";
    backCtx.filter = "blur(78px)";

    const fogs = [
      { x: 0.18, y: 0.18, r: 170, a: 0.008, tone: "white", dx: 0.008, dy: 0.006 },
      { x: 0.80, y: 0.30, r: 210, a: 0.008, tone: "red", dx: 0.006, dy: -0.006 },
      { x: 0.50, y: 0.74, r: 250, a: 0.007, tone: "white", dx: -0.006, dy: 0.006 }
    ];

    fogs.forEach((f, i) => {
      const x = f.x * w + Math.sin(t * f.dx + i) * 20 + mouse.x * 5;
      const y = f.y * h + Math.cos(t * f.dy + i) * 18 + mouse.y * 4 + scrollCurrent * 9;

      const grad = backCtx.createRadialGradient(x, y, 0, x, y, f.r);
      if (f.tone === "white") {
        grad.addColorStop(0, `rgba(170,190,220,${f.a})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        grad.addColorStop(0, `rgba(90,10,18,${f.a * 1.2})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
      }

      backCtx.fillStyle = grad;
      backCtx.beginPath();
      backCtx.arc(x, y, f.r, 0, Math.PI * 2);
      backCtx.fill();
    });

    backCtx.restore();
  }

  function drawStars(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    stars.forEach((s, i) => {
      const x = s.x * w + Math.sin(t * s.speed + s.drift) * 7 + mouse.x * 10 * s.depth;
      const y = s.y * h + Math.cos(t * s.speed + s.drift) * 7 + mouse.y * 7 * s.depth + scrollCurrent * 10 * s.depth;

      backCtx.beginPath();
      backCtx.arc(x, y, s.r, 0, Math.PI * 2);
      backCtx.fillStyle = `rgba(255,255,255,${s.a})`;
      backCtx.fill();

      if (i % 12 === 0) {
        backCtx.beginPath();
        backCtx.moveTo(x - s.r * 1.6, y);
        backCtx.lineTo(x + s.r * 1.6, y);
        backCtx.moveTo(x, y - s.r * 1.6);
        backCtx.lineTo(x, y + s.r * 1.6);
        backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.12})`;
        backCtx.lineWidth = 0.5;
        backCtx.stroke();
      }
    });

    backCtx.restore();
  }

  function drawSphereBody(x, y, r, tone) {
    const body = backCtx.createRadialGradient(
      x - r * 0.18,
      y - r * 0.18,
      r * 0.08,
      x,
      y,
      r * 0.58
    );

    if (tone === "white") {
      body.addColorStop(0, "rgba(228,235,244,0.18)");
      body.addColorStop(0.28, "rgba(176,188,208,0.11)");
      body.addColorStop(0.68, "rgba(88,100,120,0.06)");
      body.addColorStop(1, "rgba(18,24,34,0.03)");
    } else {
      body.addColorStop(0, "rgba(150,30,42,0.18)");
      body.addColorStop(0.28, "rgba(108,16,28,0.12)");
      body.addColorStop(0.68, "rgba(52,8,16,0.07)");
      body.addColorStop(1, "rgba(18,6,10,0.03)");
    }

    backCtx.fillStyle = body;
    backCtx.beginPath();
    backCtx.arc(x, y, r * 0.58, 0, Math.PI * 2);
    backCtx.fill();

    backCtx.save();
    backCtx.globalAlpha = 0.15;
    for (let i = 0; i < 4; i++) {
      backCtx.beginPath();
      backCtx.ellipse(
        x + (i - 1.5) * r * 0.04,
        y + (i - 1.5) * r * 0.018,
        r * (0.36 - i * 0.03),
        r * (0.08 + i * 0.01),
        0.16,
        0,
        Math.PI * 2
      );
      backCtx.strokeStyle = tone === "white"
        ? "rgba(255,255,255,0.16)"
        : "rgba(170,46,58,0.18)";
      backCtx.lineWidth = 1;
      backCtx.stroke();
    }
    backCtx.restore();

    backCtx.save();
    backCtx.globalAlpha = 0.16;
    backCtx.beginPath();
    backCtx.arc(x - r * 0.18, y - r * 0.20, r * 0.11, 0, Math.PI * 2);
    backCtx.fillStyle = "rgba(255,255,255,0.55)";
    backCtx.fill();
    backCtx.restore();
  }

  function drawSpheres(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    spheres.forEach((s, i) => {
      const x = s.x * w + Math.sin(t * s.drift + i * 1.3) * (s.vx * 220) + mouse.x * 10 * s.depth;
      const y = s.y * h + Math.cos(t * s.drift + i * 1.1) * (s.vy * 220) + mouse.y * 7 * s.depth + scrollCurrent * 8 * s.depth;

      const halo = backCtx.createRadialGradient(x, y, 0, x, y, s.r);
      if (s.tone === "white") {
        halo.addColorStop(0, "rgba(210,220,235,0.014)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        halo.addColorStop(0, "rgba(110,16,26,0.016)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
      }
      backCtx.fillStyle = halo;
      backCtx.beginPath();
      backCtx.arc(x, y, s.r, 0, Math.PI * 2);
      backCtx.fill();

      drawSphereBody(x, y, s.r, s.tone);
    });

    backCtx.restore();
  }

  function drawRings(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    rings.forEach((r, i) => {
      const x = r.x * w + Math.sin(t * r.speed + i) * 20 + mouse.x * 10 * r.depth;
      const y = r.y * h + Math.cos(t * r.speed + i) * 18 + mouse.y * 8 * r.depth + scrollCurrent * 8 * r.depth;
      const tilt = r.tilt + Math.sin(t * 0.16 + i) * 0.10;

      backCtx.strokeStyle = "rgba(255,255,255,0.09)";
      backCtx.lineWidth = 3.4;
      backCtx.beginPath();
      backCtx.ellipse(x, y, r.rx, r.ry, tilt, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.strokeStyle = "rgba(90,10,18,0.08)";
      backCtx.lineWidth = 2.2;
      backCtx.beginPath();
      backCtx.ellipse(x, y, r.rx * 0.82, r.ry * 0.72, -tilt * 0.85, 0, Math.PI * 2);
      backCtx.stroke();
    });

    backCtx.restore();
  }

  function drawFront(t) {
    frontCtx.clearRect(0, 0, w, h);
    frontCtx.save();
    frontCtx.globalCompositeOperation = "screen";

    particles.forEach((p, i) => {
      const x = p.x * w + Math.sin(t * p.speed + p.drift + i) * 18 + mouse.x * 4 * p.depth;
      const y = p.y * h + Math.cos(t * p.speed + p.drift + i) * 16 + mouse.y * 4 * p.depth + scrollCurrent * 12 * p.depth;

      frontCtx.beginPath();
      frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
      frontCtx.fillStyle = p.hue === "red"
        ? `rgba(90,10,18,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      frontCtx.fill();
    });

    if (logoReady) {
      logoParticles.forEach((p, i) => {
        const x = p.x * w + Math.sin(t * p.speed + p.drift + i) * 22 + mouse.x * 5 * p.depth;
        const y = p.y * h + Math.cos(t * p.speed + p.drift + i) * 18 + mouse.y * 4 * p.depth + scrollCurrent * 10 * p.depth;
        const size = p.size;
        const angle = p.rot + t * p.rotSpeed * 60;

        frontCtx.save();
        frontCtx.globalAlpha = p.a;
        frontCtx.translate(x, y);
        frontCtx.rotate(angle);
        frontCtx.drawImage(logoImg, -size / 2, -size / 2, size, size);
        frontCtx.restore();
      });
    }

    frontCtx.restore();
  }

  function animate() {
    requestAnimationFrame(animate);

    const t = performance.now() * 0.001;
    mouse.x += (mouseTarget.x - mouse.x) * 0.04;
    mouse.y += (mouseTarget.y - mouse.y) * 0.04;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.04;

    backCtx.clearRect(0, 0, w, h);
    drawBase();
    drawFog(t);
    drawStars(t);
    drawSpheres(t);
    drawRings(t);
    drawFront(t);
  }

  resize();
  animate();
})();
