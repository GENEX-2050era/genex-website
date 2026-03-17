(function () {
  const back = document.getElementById("backFxCanvas");
  const front = document.getElementById("frontFxCanvas");
  if (!back || !front) return;

  const ctx = back.getContext("2d", { alpha: true });
  const fctx = front.getContext("2d", { alpha: true });

  let w = innerWidth;
  let h = innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.6);

  const logo = new Image();
  logo.src = "./assets/logo.png";

  function resize() {
    w = innerWidth;
    h = innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);

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
  resize();

  function wrap(o, pad = 100) {
    if (o.x < -pad) o.x = w + pad;
    if (o.x > w + pad) o.x = -pad;
    if (o.y < -pad) o.y = h + pad;
    if (o.y > h + pad) o.y = -pad;
  }

  /* ===== ثابتة بدل العشوائية حتى يبقى اللون والمشهد متناسقين ===== */

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
    { x: 0.10, y: 0.14, r: 1.4, a: 0.06, vx: 0.16, vy: 0.09, hue: "white" },
    { x: 0.24, y: 0.20, r: 2.0, a: 0.07, vx: -0.12, vy: 0.10, hue: "red" },
    { x: 0.38, y: 0.16, r: 1.6, a: 0.05, vx: 0.10, vy: -0.12, hue: "white" },
    { x: 0.54, y: 0.22, r: 2.2, a: 0.07, vx: 0.14, vy: 0.08, hue: "white" },
    { x: 0.70, y: 0.18, r: 1.5, a: 0.06, vx: -0.10, vy: 0.14, hue: "red" },
    { x: 0.84, y: 0.24, r: 2.4, a: 0.08, vx: 0.12, vy: -0.10, hue: "white" },

    { x: 0.14, y: 0.42, r: 2.0, a: 0.07, vx: 0.10, vy: 0.10, hue: "white" },
    { x: 0.30, y: 0.36, r: 1.8, a: 0.06, vx: -0.14, vy: 0.08, hue: "red" },
    { x: 0.46, y: 0.44, r: 2.3, a: 0.07, vx: 0.08, vy: -0.12, hue: "white" },
    { x: 0.62, y: 0.38, r: 1.7, a: 0.05, vx: 0.14, vy: 0.10, hue: "white" },
    { x: 0.78, y: 0.46, r: 2.1, a: 0.07, vx: -0.10, vy: 0.12, hue: "red" },
    { x: 0.90, y: 0.40, r: 1.5, a: 0.05, vx: 0.12, vy: -0.08, hue: "white" },

    { x: 0.12, y: 0.66, r: 2.2, a: 0.08, vx: 0.10, vy: 0.14, hue: "white" },
    { x: 0.28, y: 0.74, r: 1.6, a: 0.05, vx: -0.12, vy: 0.08, hue: "red" },
    { x: 0.42, y: 0.82, r: 2.5, a: 0.08, vx: 0.14, vy: -0.10, hue: "white" },
    { x: 0.58, y: 0.70, r: 1.8, a: 0.06, vx: 0.10, vy: 0.12, hue: "white" },
    { x: 0.74, y: 0.84, r: 2.1, a: 0.07, vx: -0.08, vy: 0.14, hue: "red" },
    { x: 0.88, y: 0.76, r: 1.6, a: 0.05, vx: 0.12, vy: -0.10, hue: "white" }
  ].map(p => ({ ...p, x: p.x * w, y: p.y * h }));

  const logoParticles = [
    { x: 0.08, y: 0.12, size: 14, vx: 0.42, vy: 0.26, rot: 0.4, rotSpeed: 0.010, a: 0.16 },
    { x: 0.18, y: 0.26, size: 12, vx: -0.34, vy: 0.32, rot: 1.2, rotSpeed: -0.014, a: 0.14 },
    { x: 0.30, y: 0.14, size: 16, vx: 0.28, vy: -0.30, rot: 2.1, rotSpeed: 0.018, a: 0.18 },
    { x: 0.44, y: 0.20, size: 11, vx: 0.36, vy: 0.24, rot: 0.8, rotSpeed: 0.012, a: 0.13 },
    { x: 0.56, y: 0.10, size: 15, vx: -0.30, vy: 0.34, rot: 2.4, rotSpeed: -0.015, a: 0.15 },
    { x: 0.68, y: 0.24, size: 13, vx: 0.34, vy: -0.26, rot: 1.7, rotSpeed: 0.016, a: 0.16 },
    { x: 0.82, y: 0.16, size: 12, vx: -0.40, vy: 0.22, rot: 0.2, rotSpeed: -0.012, a: 0.14 },
    { x: 0.92, y: 0.28, size: 14, vx: 0.26, vy: -0.34, rot: 1.9, rotSpeed: 0.014, a: 0.17 },

    { x: 0.10, y: 0.48, size: 13, vx: 0.38, vy: 0.20, rot: 0.6, rotSpeed: 0.012, a: 0.16 },
    { x: 0.22, y: 0.40, size: 11, vx: -0.28, vy: 0.36, rot: 2.0, rotSpeed: -0.015, a: 0.13 },
    { x: 0.34, y: 0.54, size: 15, vx: 0.32, vy: -0.22, rot: 1.0, rotSpeed: 0.017, a: 0.18 },
    { x: 0.46, y: 0.46, size: 12, vx: 0.24, vy: 0.28, rot: 2.8, rotSpeed: 0.013, a: 0.15 },
    { x: 0.60, y: 0.56, size: 16, vx: -0.36, vy: 0.22, rot: 1.4, rotSpeed: -0.016, a: 0.17 },
    { x: 0.74, y: 0.42, size: 10, vx: 0.30, vy: -0.28, rot: 0.9, rotSpeed: 0.014, a: 0.12 },
    { x: 0.86, y: 0.52, size: 14, vx: -0.26, vy: 0.32, rot: 2.5, rotSpeed: -0.012, a: 0.16 },

    { x: 0.12, y: 0.76, size: 12, vx: 0.36, vy: 0.24, rot: 0.8, rotSpeed: 0.012, a: 0.14 },
    { x: 0.26, y: 0.88, size: 15, vx: -0.32, vy: 0.18, rot: 1.6, rotSpeed: -0.016, a: 0.17 },
    { x: 0.40, y: 0.78, size: 11, vx: 0.28, vy: -0.30, rot: 2.4, rotSpeed: 0.014, a: 0.13 },
    { x: 0.54, y: 0.92, size: 16, vx: 0.34, vy: 0.20, rot: 0.4, rotSpeed: 0.017, a: 0.18 },
    { x: 0.68, y: 0.82, size: 12, vx: -0.24, vy: 0.28, rot: 1.8, rotSpeed: -0.013, a: 0.14 },
    { x: 0.82, y: 0.90, size: 14, vx: 0.30, vy: -0.24, rot: 2.2, rotSpeed: 0.015, a: 0.16 }
  ].map(l => ({ ...l, x: l.x * w, y: l.y * h }));

  const planets = [
    { x: 0.12, y: 0.16, r: 250, vx: 0.14, vy: 0.10, tone: "white" },
    { x: 0.86, y: 0.14, r: 360, vx: -0.12, vy: 0.12, tone: "red" },
    { x: 0.10, y: 0.84, r: 390, vx: 0.10, vy: -0.08, tone: "red" },
    { x: 0.88, y: 0.72, r: 270, vx: -0.08, vy: -0.10, tone: "white" },
    { x: 0.56, y: 1.04, r: 310, vx: 0.08, vy: -0.12, tone: "white" }
  ].map(p => ({ ...p, x: p.x * w, y: p.y * h }));

  const rings = [
    { x: 0.56, y: 0.22, rx: 340, ry: 74, vx: 0.44, vy: 0.26, rot: 0.16, rotSpeed: 0.010 },
    { x: 0.38, y: 0.64, rx: 480, ry: 110, vx: -0.36, vy: 0.30, rot: -0.12, rotSpeed: -0.008 },
    { x: 0.80, y: 0.54, rx: 390, ry: 88, vx: -0.32, vy: -0.28, rot: 0.22, rotSpeed: 0.009 }
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
  }

  function drawStars() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    stars.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      wrap(s, 12);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();

      if (i % 10 === 0) {
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 1.8, s.y);
        ctx.lineTo(s.x + s.r * 1.8, s.y);
        ctx.moveTo(s.x, s.y - s.r * 1.8);
        ctx.lineTo(s.x, s.y + s.r * 1.8);
        ctx.strokeStyle = `rgba(255,255,255,${s.a * 0.10})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    ctx.restore();
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

    planets.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      wrap(p, p.r);

      drawPlanetBody(p.x, p.y, p.r, p.tone);
    });

    ctx.restore();
  }

  function drawRings() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    rings.forEach((r) => {
      r.x += r.vx;
      r.y += r.vy;
      r.rot += r.rotSpeed;
      wrap(r, r.rx + 40);

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);

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

      ctx.restore();
    });

    ctx.restore();
  }

  function drawFront() {
    fctx.clearRect(0, 0, w, h);
    fctx.save();
    fctx.globalCompositeOperation = "screen";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      wrap(p, 20);

      fctx.beginPath();
      fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fctx.fillStyle = p.hue === "red"
        ? `rgba(90,10,18,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      fctx.fill();
    });

    if (logoReady) {
      logoParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        wrap(p, 60);

        fctx.save();
        fctx.globalAlpha = p.a;
        fctx.translate(p.x, p.y);
        fctx.rotate(p.rot);
        fctx.drawImage(logo, -p.size / 2, -p.size / 2, p.size, p.size);
        fctx.restore();
      });
    }

    fctx.restore();
  }

  function animate() {
    requestAnimationFrame(animate);

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
