(function () {
  const back = document.getElementById("backFxCanvas");
  const front = document.getElementById("frontFxCanvas");
  if (!back || !front) return;

  const ctx = back.getContext("2d", { alpha: true });
  const fctx = front.getContext("2d", { alpha: true });

  let w = innerWidth;
  let h = innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const mouse = {
    x: w * 0.5,
    y: h * 0.5,
    tx: w * 0.5,
    ty: h * 0.5
  };

  const logo = new Image();
  let logoReady = false;
  logo.onload = () => { logoReady = true; };
  logo.src = "./assets/logo.png";
  if (logo.complete) logoReady = true;

  function resize() {
    w = innerWidth;
    h = innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    back.width = Math.floor(w * dpr);
    back.height = Math.floor(h * dpr);
    front.width = Math.floor(w * dpr);
    front.height = Math.floor(h * dpr);

    back.style.width = front.style.width = w + "px";
    back.style.height = front.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  addEventListener("resize", resize);

  addEventListener("mousemove", (e) => {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  }, { passive: true });

  addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    mouse.tx = t.clientX;
    mouse.ty = t.clientY;
  }, { passive: true });

  resize();

  function wrap(o, pad = 100) {
    if (o.x < -pad) o.x = w + pad;
    if (o.x > w + pad) o.x = -pad;
    if (o.y < -pad) o.y = h + pad;
    if (o.y > h + pad) o.y = -pad;
  }

  const stars = [
    { x: 0.06, y: 0.08, r: 1.0, a: 0.12, vx: 0.03, vy: 0.01 },
    { x: 0.14, y: 0.16, r: 1.4, a: 0.16, vx: 0.02, vy: 0.03 },
    { x: 0.22, y: 0.22, r: 0.9, a: 0.10, vx: 0.01, vy: 0.02 },
    { x: 0.28, y: 0.10, r: 1.2, a: 0.15, vx: 0.03, vy: 0.02 },
    { x: 0.34, y: 0.18, r: 1.5, a: 0.18, vx: 0.02, vy: 0.01 },
    { x: 0.42, y: 0.12, r: 0.8, a: 0.11, vx: 0.02, vy: 0.02 },
    { x: 0.50, y: 0.20, r: 1.1, a: 0.12, vx: 0.01, vy: 0.03 },
    { x: 0.58, y: 0.14, r: 1.4, a: 0.16, vx: 0.03, vy: 0.01 },
    { x: 0.66, y: 0.09, r: 0.9, a: 0.12, vx: 0.02, vy: 0.02 },
    { x: 0.74, y: 0.16, r: 1.2, a: 0.15, vx: 0.02, vy: 0.03 },
    { x: 0.82, y: 0.12, r: 1.6, a: 0.18, vx: 0.01, vy: 0.02 },
    { x: 0.90, y: 0.18, r: 1.0, a: 0.12, vx: 0.02, vy: 0.01 },
    { x: 0.10, y: 0.30, r: 1.3, a: 0.14, vx: 0.03, vy: 0.02 },
    { x: 0.18, y: 0.38, r: 1.0, a: 0.12, vx: 0.01, vy: 0.03 },
    { x: 0.26, y: 0.28, r: 1.7, a: 0.18, vx: 0.02, vy: 0.01 },
    { x: 0.36, y: 0.34, r: 0.8, a: 0.10, vx: 0.02, vy: 0.02 },
    { x: 0.46, y: 0.30, r: 1.2, a: 0.14, vx: 0.03, vy: 0.01 },
    { x: 0.56, y: 0.38, r: 1.5, a: 0.18, vx: 0.02, vy: 0.02 },
    { x: 0.66, y: 0.28, r: 0.9, a: 0.10, vx: 0.01, vy: 0.03 },
    { x: 0.76, y: 0.34, r: 1.1, a: 0.14, vx: 0.03, vy: 0.02 },
    { x: 0.86, y: 0.30, r: 1.6, a: 0.18, vx: 0.02, vy: 0.01 },
    { x: 0.94, y: 0.38, r: 0.8, a: 0.10, vx: 0.01, vy: 0.02 },
    { x: 0.08, y: 0.50, r: 1.1, a: 0.13, vx: 0.02, vy: 0.03 },
    { x: 0.16, y: 0.58, r: 1.5, a: 0.17, vx: 0.03, vy: 0.02 },
    { x: 0.24, y: 0.46, r: 0.9, a: 0.10, vx: 0.02, vy: 0.01 },
    { x: 0.32, y: 0.54, r: 1.2, a: 0.14, vx: 0.01, vy: 0.03 },
    { x: 0.40, y: 0.50, r: 1.6, a: 0.18, vx: 0.03, vy: 0.01 },
    { x: 0.48, y: 0.58, r: 1.0, a: 0.12, vx: 0.02, vy: 0.02 },
    { x: 0.58, y: 0.46, r: 1.4, a: 0.15, vx: 0.01, vy: 0.03 },
    { x: 0.68, y: 0.56, r: 0.8, a: 0.10, vx: 0.02, vy: 0.01 },
    { x: 0.78, y: 0.48, r: 1.3, a: 0.15, vx: 0.03, vy: 0.02 },
    { x: 0.88, y: 0.56, r: 1.7, a: 0.19, vx: 0.01, vy: 0.02 },
    { x: 0.06, y: 0.72, r: 1.0, a: 0.11, vx: 0.02, vy: 0.01 },
    { x: 0.14, y: 0.82, r: 1.4, a: 0.16, vx: 0.03, vy: 0.02 },
    { x: 0.22, y: 0.90, r: 0.8, a: 0.10, vx: 0.01, vy: 0.03 },
    { x: 0.30, y: 0.76, r: 1.2, a: 0.14, vx: 0.02, vy: 0.02 },
    { x: 0.40, y: 0.86, r: 1.6, a: 0.18, vx: 0.03, vy: 0.01 },
    { x: 0.50, y: 0.92, r: 0.9, a: 0.12, vx: 0.02, vy: 0.03 },
    { x: 0.60, y: 0.78, r: 1.4, a: 0.16, vx: 0.01, vy: 0.02 },
    { x: 0.70, y: 0.88, r: 0.8, a: 0.10, vx: 0.03, vy: 0.01 },
    { x: 0.80, y: 0.94, r: 1.2, a: 0.14, vx: 0.02, vy: 0.02 },
    { x: 0.92, y: 0.84, r: 1.6, a: 0.18, vx: 0.01, vy: 0.03 }
  ].map(s => ({ ...s, x: s.x * w, y: s.y * h }));

  const particles = [
    { x: 0.10, y: 0.14, r: 1.4, a: 0.06, vx: 0.16, vy: 0.09, hue: "white", baseVX: 0.16, baseVY: 0.09 },
    { x: 0.24, y: 0.20, r: 2.0, a: 0.07, vx: -0.12, vy: 0.10, hue: "red", baseVX: -0.12, baseVY: 0.10 },
    { x: 0.38, y: 0.16, r: 1.6, a: 0.05, vx: 0.10, vy: -0.12, hue: "white", baseVX: 0.10, baseVY: -0.12 },
    { x: 0.54, y: 0.22, r: 2.2, a: 0.07, vx: 0.14, vy: 0.08, hue: "white", baseVX: 0.14, baseVY: 0.08 },
    { x: 0.70, y: 0.18, r: 1.5, a: 0.06, vx: -0.10, vy: 0.14, hue: "red", baseVX: -0.10, baseVY: 0.14 },
    { x: 0.84, y: 0.24, r: 2.4, a: 0.08, vx: 0.12, vy: -0.10, hue: "white", baseVX: 0.12, baseVY: -0.10 },
    { x: 0.14, y: 0.42, r: 2.0, a: 0.07, vx: 0.10, vy: 0.10, hue: "white", baseVX: 0.10, baseVY: 0.10 },
    { x: 0.30, y: 0.36, r: 1.8, a: 0.06, vx: -0.14, vy: 0.08, hue: "red", baseVX: -0.14, baseVY: 0.08 },
    { x: 0.46, y: 0.44, r: 2.3, a: 0.07, vx: 0.08, vy: -0.12, hue: "white", baseVX: 0.08, baseVY: -0.12 },
    { x: 0.62, y: 0.38, r: 1.7, a: 0.05, vx: 0.14, vy: 0.10, hue: "white", baseVX: 0.14, baseVY: 0.10 },
    { x: 0.78, y: 0.46, r: 2.1, a: 0.07, vx: -0.10, vy: 0.12, hue: "red", baseVX: -0.10, baseVY: 0.12 },
    { x: 0.90, y: 0.40, r: 1.5, a: 0.05, vx: 0.12, vy: -0.08, hue: "white", baseVX: 0.12, baseVY: -0.08 },
    { x: 0.12, y: 0.66, r: 2.2, a: 0.08, vx: 0.10, vy: 0.14, hue: "white", baseVX: 0.10, baseVY: 0.14 },
    { x: 0.28, y: 0.74, r: 1.6, a: 0.05, vx: -0.12, vy: 0.08, hue: "red", baseVX: -0.12, baseVY: 0.08 },
    { x: 0.42, y: 0.82, r: 2.5, a: 0.08, vx: 0.14, vy: -0.10, hue: "white", baseVX: 0.14, baseVY: -0.10 },
    { x: 0.58, y: 0.70, r: 1.8, a: 0.06, vx: 0.10, vy: 0.12, hue: "white", baseVX: 0.10, baseVY: 0.12 },
    { x: 0.74, y: 0.84, r: 2.1, a: 0.07, vx: -0.08, vy: 0.14, hue: "red", baseVX: -0.08, baseVY: 0.14 },
    { x: 0.88, y: 0.76, r: 1.6, a: 0.05, vx: 0.12, vy: -0.10, hue: "white", baseVX: 0.12, baseVY: -0.10 }
  ].map(p => ({ ...p, x: p.x * w, y: p.y * h }));

  const logoParticles = [
    { x: 0.08, y: 0.12, size: 24, vx: 0.42, vy: 0.26, rot: 0.4, rotSpeed: 0.010, a: 0.22, depth: 1.00, baseVX: 0.42, baseVY: 0.26 },
    { x: 0.18, y: 0.26, size: 21, vx: -0.34, vy: 0.32, rot: 1.2, rotSpeed: -0.014, a: 0.20, depth: 0.90, baseVX: -0.34, baseVY: 0.32 },
    { x: 0.30, y: 0.14, size: 26, vx: 0.28, vy: -0.30, rot: 2.1, rotSpeed: 0.018, a: 0.24, depth: 1.10, baseVX: 0.28, baseVY: -0.30 },
    { x: 0.44, y: 0.20, size: 20, vx: 0.36, vy: 0.24, rot: 0.8, rotSpeed: 0.012, a: 0.18, depth: 0.80, baseVX: 0.36, baseVY: 0.24 },
    { x: 0.56, y: 0.10, size: 25, vx: -0.30, vy: 0.34, rot: 2.4, rotSpeed: -0.015, a: 0.20, depth: 1.00, baseVX: -0.30, baseVY: 0.34 },
    { x: 0.68, y: 0.24, size: 22, vx: 0.34, vy: -0.26, rot: 1.7, rotSpeed: 0.016, a: 0.22, depth: 0.92, baseVX: 0.34, baseVY: -0.26 },
    { x: 0.82, y: 0.16, size: 21, vx: -0.40, vy: 0.22, rot: 0.2, rotSpeed: -0.012, a: 0.19, depth: 0.86, baseVX: -0.40, baseVY: 0.22 },
    { x: 0.92, y: 0.28, size: 24, vx: 0.26, vy: -0.34, rot: 1.9, rotSpeed: 0.014, a: 0.23, depth: 1.04, baseVX: 0.26, baseVY: -0.34 },

    { x: 0.10, y: 0.48, size: 23, vx: 0.38, vy: 0.20, rot: 0.6, rotSpeed: 0.012, a: 0.21, depth: 0.96, baseVX: 0.38, baseVY: 0.20 },
    { x: 0.22, y: 0.40, size: 20, vx: -0.28, vy: 0.36, rot: 2.0, rotSpeed: -0.015, a: 0.18, depth: 0.82, baseVX: -0.28, baseVY: 0.36 },
    { x: 0.34, y: 0.54, size: 25, vx: 0.32, vy: -0.22, rot: 1.0, rotSpeed: 0.017, a: 0.24, depth: 1.08, baseVX: 0.32, baseVY: -0.22 },
    { x: 0.46, y: 0.46, size: 21, vx: 0.24, vy: 0.28, rot: 2.8, rotSpeed: 0.013, a: 0.20, depth: 0.90, baseVX: 0.24, baseVY: 0.28 },
    { x: 0.60, y: 0.56, size: 26, vx: -0.36, vy: 0.22, rot: 1.4, rotSpeed: -0.016, a: 0.24, depth: 1.12, baseVX: -0.36, baseVY: 0.22 },
    { x: 0.74, y: 0.42, size: 19, vx: 0.30, vy: -0.28, rot: 0.9, rotSpeed: 0.014, a: 0.17, depth: 0.78, baseVX: 0.30, baseVY: -0.28 },
    { x: 0.86, y: 0.52, size: 24, vx: -0.26, vy: 0.32, rot: 2.5, rotSpeed: -0.012, a: 0.22, depth: 0.98, baseVX: -0.26, baseVY: 0.32 },

    { x: 0.12, y: 0.76, size: 21, vx: 0.36, vy: 0.24, rot: 0.8, rotSpeed: 0.012, a: 0.19, depth: 0.88, baseVX: 0.36, baseVY: 0.24 },
    { x: 0.26, y: 0.88, size: 25, vx: -0.32, vy: 0.18, rot: 1.6, rotSpeed: -0.016, a: 0.23, depth: 1.06, baseVX: -0.32, baseVY: 0.18 },
    { x: 0.40, y: 0.78, size: 20, vx: 0.28, vy: -0.30, rot: 2.4, rotSpeed: 0.014, a: 0.18, depth: 0.82, baseVX: 0.28, baseVY: -0.30 },
    { x: 0.54, y: 0.92, size: 26, vx: 0.34, vy: 0.20, rot: 0.4, rotSpeed: 0.017, a: 0.24, depth: 1.12, baseVX: 0.34, baseVY: 0.20 },
    { x: 0.68, y: 0.82, size: 21, vx: -0.24, vy: 0.28, rot: 1.8, rotSpeed: -0.013, a: 0.19, depth: 0.90, baseVX: -0.24, baseVY: 0.28 },
    { x: 0.82, y: 0.90, size: 24, vx: 0.30, vy: -0.24, rot: 2.2, rotSpeed: 0.015, a: 0.22, depth: 1.00, baseVX: 0.30, baseVY: -0.24 }
  ].map(l => ({ ...l, x: l.x * w, y: l.y * h }));

  const planets = [
    { x: 0.12, y: 0.16, r: 250, vx: 0.12, vy: 0.09, ax: 0.0007, ay: 0.0005, tone: "white", depth: 0.30 },
    { x: 0.86, y: 0.14, r: 360, vx: -0.10, vy: 0.10, ax: -0.0005, ay: 0.0007, tone: "red", depth: 0.50 },
    { x: 0.10, y: 0.84, r: 390, vx: 0.09, vy: -0.07, ax: 0.0006, ay: -0.0005, tone: "red", depth: 0.56 },
    { x: 0.88, y: 0.72, r: 270, vx: -0.07, vy: -0.09, ax: -0.0004, ay: -0.0006, tone: "white", depth: 0.36 },
    { x: 0.56, y: 1.04, r: 310, vx: 0.07, vy: -0.10, ax: 0.0005, ay: -0.0007, tone: "white", depth: 0.42 }
  ].map(p => ({ ...p, x: p.x * w, y: p.y * h }));

  const rings = [
    { x: 0.56, y: 0.22, rx: 340, ry: 74, vx: 0.18, vy: 0.10, rot: 0.16, rotSpeed: 0.0038, depth: 0.20 },
    { x: 0.38, y: 0.64, rx: 480, ry: 110, vx: -0.15, vy: 0.12, rot: -0.12, rotSpeed: -0.0030, depth: 0.16 },
    { x: 0.80, y: 0.54, rx: 390, ry: 88, vx: -0.13, vy: -0.11, rot: 0.22, rotSpeed: 0.0034, depth: 0.18 }
  ].map(r => ({ ...r, x: r.x * w, y: r.y * h }));

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#02030a");
    g.addColorStop(0.55, "#03050b");
    g.addColorStop(1, "#02030a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const subtle = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.8);
    subtle.addColorStop(0, "rgba(110,12,20,0.045)");
    subtle.addColorStop(0.6, "rgba(60,8,16,0.018)");
    subtle.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = subtle;
    ctx.fillRect(0, 0, w, h);

    const lx = mouse.x;
    const ly = mouse.y;
    const light = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.55);
    light.addColorStop(0, "rgba(255,255,255,0.05)");
    light.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawFog() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(72px)";

    const fogs = [
      { x: w * 0.20, y: h * 0.20, r: 160, a: 0.006, tone: "white" },
      { x: w * 0.80, y: h * 0.28, r: 200, a: 0.006, tone: "red" },
      { x: w * 0.54, y: h * 0.74, r: 240, a: 0.005, tone: "white" }
    ];

    fogs.forEach((f) => {
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      if (f.tone === "white") grad.addColorStop(0, `rgba(170,190,220,${f.a})`);
      else grad.addColorStop(0, `rgba(90,10,18,${f.a * 1.2})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawStars() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;

    stars.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      wrap(s, 12);

      const px = s.x + mx * 12;
      const py = s.y + my * 12;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();

      if (i % 10 === 0) {
        ctx.beginPath();
        ctx.moveTo(px - s.r * 1.8, py);
        ctx.lineTo(px + s.r * 1.8, py);
        ctx.moveTo(px, py - s.r * 1.8);
        ctx.lineTo(px, py + s.r * 1.8);
        ctx.strokeStyle = `rgba(255,255,255,${s.a * 0.10})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  function drawPlanetBody(x, y, r, tone) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    if (tone === "white") {
      glow.addColorStop(0, "rgba(220,230,245,0.030)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      glow.addColorStop(0, "rgba(140,24,34,0.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
    }
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(
      x - r * 0.22,
      y - r * 0.20,
      r * 0.08,
      x,
      y,
      r * 0.64
    );

    if (tone === "white") {
      grad.addColorStop(0, "rgba(232,238,246,0.22)");
      grad.addColorStop(0.30, "rgba(180,192,212,0.14)");
      grad.addColorStop(0.68, "rgba(88,102,124,0.08)");
      grad.addColorStop(1, "rgba(18,24,34,0.04)");
    } else {
      grad.addColorStop(0, "rgba(160,34,46,0.24)");
      grad.addColorStop(0.30, "rgba(112,18,30,0.16)");
      grad.addColorStop(0.68, "rgba(56,10,18,0.09)");
      grad.addColorStop(1, "rgba(18,6,10,0.04)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.64, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(
        x + (i - 2) * r * 0.035,
        y + (i - 2) * r * 0.016,
        r * (0.40 - i * 0.025),
        r * (0.08 + i * 0.01),
        0.18,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = tone === "white"
        ? "rgba(255,255,255,0.16)"
        : "rgba(180,52,64,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(x - r * 0.20, y - r * 0.22, r * 0.10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.54)";
    ctx.fill();
    ctx.restore();
  }

  function drawPlanets() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;

    planets.forEach((p, i) => {
      p.vx += Math.sin(performance.now() * 0.0003 + i) * p.ax;
      p.vy += Math.cos(performance.now() * 0.00028 + i * 1.2) * p.ay;

      p.vx += mx * 0.0016 * (1 + p.depth);
      p.vy += my * 0.0016 * (1 + p.depth);

      p.vx = Math.max(-0.17, Math.min(0.17, p.vx));
      p.vy = Math.max(-0.17, Math.min(0.17, p.vy));

      p.x += p.vx;
      p.y += p.vy;
      wrap(p, p.r);

      const px = p.x + mx * 80 * p.depth;
      const py = p.y + my * 80 * p.depth;
      const depthBlur = (1 - Math.min(1, p.depth + 0.35)) * 5;

      ctx.save();
      ctx.filter = `blur(${depthBlur}px)`;
      drawPlanetBody(px, py, p.r, p.tone);
      ctx.restore();
    });

    ctx.restore();
  }

  function drawRings() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;

    rings.forEach((r) => {
      r.x += r.vx;
      r.y += r.vy;
      r.rot += r.rotSpeed;
      wrap(r, r.rx + 40);

      const px = r.x + mx * 55 * r.depth;
      const py = r.y + my * 55 * r.depth;
      const blur = (1 - (r.depth + 0.6)) * 2.5;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(r.rot);
      ctx.filter = `blur(${Math.max(0, blur)}px)`;

      ctx.strokeStyle = "rgba(255,255,255,0.11)";
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(96,12,20,0.08)";
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.ellipse(0, 0, r.rx * 0.84, r.ry * 0.72, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.filter = "none";
      ctx.restore();
    });

    ctx.restore();
  }

  function drawFront() {
    fctx.clearRect(0, 0, w, h);
    fctx.save();
    fctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;

    particles.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const repel = dist < 180 ? (180 - dist) / 180 : 0;

      p.vx += p.baseVX * 0.002 + (-dx / dist) * repel * 0.05;
      p.vy += p.baseVY * 0.002 + (-dy / dist) * repel * 0.05;

      p.vx *= 0.985;
      p.vy *= 0.985;

      p.x += p.vx;
      p.y += p.vy;
      wrap(p, 20);

      const px = p.x + mx * 20;
      const py = p.y + my * 20;

      fctx.beginPath();
      fctx.arc(px, py, p.r, 0, Math.PI * 2);
      fctx.fillStyle = p.hue === "red"
        ? `rgba(90,10,18,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      fctx.fill();
    });

    if (logoReady) {
      logoParticles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const attract = dist < 220 ? (220 - dist) / 220 : 0;

        p.vx += p.baseVX * 0.0015 + (dx / dist) * attract * 0.01 * p.depth;
        p.vy += p.baseVY * 0.0015 + (dy / dist) * attract * 0.01 * p.depth;

        p.vx *= 0.987;
        p.vy *= 0.987;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        wrap(p, 80);

        const drawSize = p.size * p.depth;
        const px = p.x + mx * 34 * p.depth;
        const py = p.y + my * 34 * p.depth;
        const blur = (1 - Math.min(1.05, p.depth)) * 3;

        fctx.save();
        fctx.globalAlpha = Math.min(0.34, p.a + 0.04);
        fctx.translate(px, py);
        fctx.rotate(p.rot);
        fctx.filter = `blur(${Math.max(0, blur)}px)`;
        fctx.drawImage(logo, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        fctx.filter = "none";
        fctx.restore();
      });
    }

    fctx.restore();
  }

  function animate() {
    requestAnimationFrame(animate);

    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawFog();
    drawStars();
    drawPlanets();
    drawRings();
    drawFront();
  }

  animate();
})();
