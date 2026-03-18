(function () {
  const back = document.getElementById("backFxCanvas");
  const front = document.getElementById("frontFxCanvas");
  if (!back || !front) return;

  const ctx = back.getContext("2d", { alpha: true });
  const fctx = front.getContext("2d", { alpha: true });

  let w = window.innerWidth;
  let h = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.1);

  const mouse = {
    x: w * 0.5,
    y: h * 0.5,
    tx: w * 0.5,
    ty: h * 0.5
  };

  const scrollState = {
    y: window.scrollY || 0,
    ty: window.scrollY || 0
  };

  const scene = {
    x: w * 0.5,
    y: h * 0.35,
    tx: w * 0.5,
    ty: h * 0.35,
    intensity: 0.35,
    targetIntensity: 0.35
  };

  const hoverState = {
    active: false,
    x: w * 0.5,
    y: h * 0.5,
    tx: w * 0.5,
    ty: h * 0.5,
    power: 0,
    tPower: 0
  };

  let menuOpen = false;

  window.addEventListener("genex-menu-toggle", (e) => {
    menuOpen = !!(e && e.detail && e.detail.open);
    if (menuOpen) {
      hoverState.active = false;
      hoverState.tPower = 0;
    }
  });

  const logo = new Image();
  let logoReady = false;
  logo.onload = () => { logoReady = true; };
  logo.src = "./assets/logo.png";
  if (logo.complete) logoReady = true;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.1);

    back.width = Math.floor(w * dpr);
    back.height = Math.floor(h * dpr);
    front.width = Math.floor(w * dpr);
    front.height = Math.floor(h * dpr);

    back.style.width = `${w}px`;
    back.style.height = `${h}px`;
    front.style.width = `${w}px`;
    front.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function wrap(o, pad = 100) {
    if (o.x < -pad) o.x = w + pad;
    if (o.x > w + pad) o.x = -pad;
    if (o.y < -pad) o.y = h + pad;
    if (o.y > h + pad) o.y = -pad;
  }

  function sectionItems() {
    return [
      { el: document.querySelector(".hero"), power: 1.0 },
      { el: document.querySelector(".stats"), power: 0.9 },
      { el: document.querySelector(".grid-3"), power: 1.0 },
      { el: document.querySelector(".cta"), power: 1.1 }
    ].filter(item => item.el);
  }

  function getActiveSectionInfo() {
    const items = sectionItems();
    let best = null;
    let bestScore = -Infinity;

    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.abs(cx - w / 2) / w;
      const dy = Math.abs(cy - h / 2) / h;
      const visible = Math.max(0, Math.min(rect.bottom, h) - Math.max(rect.top, 0));
      const visRatio = clamp(visible / Math.max(1, Math.min(h, rect.height)), 0, 1);
      const score = visRatio * 1.8 - dx * 0.6 - dy * 1.1;

      if (score > bestScore) {
        bestScore = score;
        best = {
          x: cx,
          y: cy,
          intensity: clamp(visRatio * item.power, 0.2, 1)
        };
      }
    }

    return best || { x: w * 0.5, y: h * 0.35, intensity: 0.35 };
  }

  function bindHoverTargets() {
    const targets = document.querySelectorAll(".hero-copy, .hero-orb, .stat, .feature, .cta");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (menuOpen) return;
        const rect = el.getBoundingClientRect();
        hoverState.active = true;
        hoverState.tx = rect.left + rect.width / 2;
        hoverState.ty = rect.top + rect.height / 2;
        hoverState.tPower = 1;
      }, { passive: true });

      el.addEventListener("mousemove", (e) => {
        if (menuOpen) return;
        hoverState.active = true;
        hoverState.tx = e.clientX;
        hoverState.ty = e.clientY;
        hoverState.tPower = 1;
      }, { passive: true });

      el.addEventListener("mouseleave", () => {
        hoverState.active = false;
        hoverState.tPower = 0;
      }, { passive: true });
    });
  }

  window.addEventListener("resize", resize, { passive: true });

  window.addEventListener("mousemove", (e) => {
    if (menuOpen) return;
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (menuOpen) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    mouse.tx = t.clientX;
    mouse.ty = t.clientY;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    scrollState.ty = window.scrollY || 0;
  }, { passive: true });

  resize();
  bindHoverTargets();

  const stars = Array.from({ length: 34 }, (_, i) => ({
    x: (0.08 + (i * 0.073) % 0.9) * w,
    y: (0.10 + (i * 0.117) % 0.85) * h,
    r: 0.7 + (i % 3) * 0.35,
    a: 0.08 + (i % 4) * 0.025,
    vx: (i % 2 === 0 ? 0.018 : -0.016),
    vy: (i % 3 === 0 ? 0.012 : -0.010),
    tw: Math.random() * Math.PI * 2
  }));

  const particles = Array.from({ length: 14 }, (_, i) => ({
    x: ((0.12 + i * 0.061) % 0.95) * w,
    y: ((0.18 + i * 0.089) % 0.92) * h,
    r: 1.2 + (i % 3) * 0.5,
    a: 0.035 + (i % 4) * 0.01,
    hue: i % 5 === 0 ? "red" : "white",
    vx: (i % 2 === 0 ? 0.06 : -0.05),
    vy: (i % 3 === 0 ? 0.05 : -0.04),
    baseVX: (i % 2 === 0 ? 0.06 : -0.05),
    baseVY: (i % 3 === 0 ? 0.05 : -0.04)
  }));

  const logoParticles = [
    { x: 0.12, y: 0.14, size: 18, depth: 1.10, vx: 0.12, vy: 0.08, rot: 0.3, rotSpeed: 0.006, a: 0.22, baseVX: 0.12, baseVY: 0.08 },
    { x: 0.26, y: 0.26, size: 13, depth: 0.72, vx: -0.08, vy: 0.10, rot: 1.1, rotSpeed: -0.005, a: 0.16, baseVX: -0.08, baseVY: 0.10 },
    { x: 0.40, y: 0.18, size: 20, depth: 1.18, vx: 0.10, vy: -0.08, rot: 1.9, rotSpeed: 0.007, a: 0.23, baseVX: 0.10, baseVY: -0.08 },
    { x: 0.58, y: 0.12, size: 14, depth: 0.78, vx: -0.07, vy: 0.09, rot: 2.3, rotSpeed: -0.006, a: 0.17, baseVX: -0.07, baseVY: 0.09 },
    { x: 0.74, y: 0.24, size: 19, depth: 1.02, vx: 0.09, vy: -0.07, rot: 0.8, rotSpeed: 0.006, a: 0.21, baseVX: 0.09, baseVY: -0.07 },
    { x: 0.88, y: 0.18, size: 12, depth: 0.66, vx: -0.08, vy: 0.06, rot: 1.7, rotSpeed: -0.005, a: 0.15, baseVX: -0.08, baseVY: 0.06 },

    { x: 0.14, y: 0.52, size: 17, depth: 0.94, vx: 0.10, vy: 0.05, rot: 2.2, rotSpeed: 0.006, a: 0.20, baseVX: 0.10, baseVY: 0.05 },
    { x: 0.30, y: 0.42, size: 12, depth: 0.62, vx: -0.07, vy: 0.09, rot: 0.5, rotSpeed: -0.005, a: 0.14, baseVX: -0.07, baseVY: 0.09 },
    { x: 0.46, y: 0.56, size: 21, depth: 1.20, vx: 0.09, vy: -0.06, rot: 1.4, rotSpeed: 0.007, a: 0.24, baseVX: 0.09, baseVY: -0.06 },
    { x: 0.64, y: 0.46, size: 13, depth: 0.70, vx: 0.06, vy: 0.08, rot: 2.6, rotSpeed: 0.005, a: 0.15, baseVX: 0.06, baseVY: 0.08 },
    { x: 0.82, y: 0.54, size: 18, depth: 1.00, vx: -0.08, vy: 0.09, rot: 1.1, rotSpeed: -0.006, a: 0.20, baseVX: -0.08, baseVY: 0.09 },

    { x: 0.18, y: 0.82, size: 14, depth: 0.76, vx: 0.08, vy: 0.06, rot: 0.9, rotSpeed: 0.005, a: 0.16, baseVX: 0.08, baseVY: 0.06 },
    { x: 0.38, y: 0.76, size: 19, depth: 1.06, vx: -0.08, vy: 0.05, rot: 2.0, rotSpeed: -0.006, a: 0.21, baseVX: -0.08, baseVY: 0.05 },
    { x: 0.56, y: 0.88, size: 12, depth: 0.60, vx: 0.07, vy: -0.07, rot: 1.6, rotSpeed: 0.005, a: 0.14, baseVX: 0.07, baseVY: -0.07 },
    { x: 0.76, y: 0.80, size: 20, depth: 1.14, vx: 0.09, vy: 0.05, rot: 0.4, rotSpeed: 0.007, a: 0.23, baseVX: 0.09, baseVY: 0.05 }
  ].map(l => ({ ...l, x: l.x * w, y: l.y * h }));

  const planets = [
    { x: 0.12, y: 0.16, r: 170, vx: 0.045, vy: 0.035, ax: 0.00025, ay: 0.0002, tone: "white", depth: 0.34, scale: 1, pulse: Math.random() * Math.PI * 2 },
    { x: 0.86, y: 0.14, r: 240, vx: -0.04, vy: 0.04, ax: -0.00022, ay: 0.00025, tone: "red", depth: 0.52, scale: 1, pulse: Math.random() * Math.PI * 2 },
    { x: 0.10, y: 0.84, r: 255, vx: 0.04, vy: -0.03, ax: 0.00025, ay: -0.00018, tone: "red", depth: 0.56, scale: 1, pulse: Math.random() * Math.PI * 2 },
    { x: 0.88, y: 0.72, r: 185, vx: -0.03, vy: -0.04, ax: -0.00018, ay: -0.00022, tone: "white", depth: 0.38, scale: 1, pulse: Math.random() * Math.PI * 2 },
    { x: 0.56, y: 1.02, r: 210, vx: 0.03, vy: -0.04, ax: 0.0002, ay: -0.00025, tone: "white", depth: 0.44, scale: 1, pulse: Math.random() * Math.PI * 2 }
  ].map(p => ({ ...p, x: p.x * w, y: p.y * h }));

  const rings = [
    { x: 0.56, y: 0.22, rx: 250, ry: 56, vx: 0.07, vy: 0.04, rot: 0.16, rotSpeed: 0.0018, depth: 0.22 },
    { x: 0.38, y: 0.64, rx: 340, ry: 76, vx: -0.06, vy: 0.05, rot: -0.12, rotSpeed: -0.0014, depth: 0.18 },
    { x: 0.80, y: 0.54, rx: 280, ry: 62, vx: -0.05, vy: -0.04, rot: 0.22, rotSpeed: 0.0016, depth: 0.20 }
  ].map(r => ({ ...r, x: r.x * w, y: r.y * h }));

  function drawBackground(time) {
    const pulse = 0.5 + Math.sin(time * 0.00035) * 0.5;
    const activeX = hoverState.active ? hoverState.x : scene.x;
    const activeY = hoverState.active ? hoverState.y : scene.y;
    const activePower = scene.intensity + hoverState.power * 0.8;

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#02030a");
    g.addColorStop(0.55, "#03050b");
    g.addColorStop(1, "#02030a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const baseGlow = ctx.createRadialGradient(
      activeX,
      activeY,
      0,
      activeX,
      activeY,
      Math.max(w, h) * (0.28 + activePower * 0.18)
    );
    baseGlow.addColorStop(0, `rgba(120,16,26,${0.03 + activePower * 0.045 + pulse * 0.01})`);
    baseGlow.addColorStop(0.35, `rgba(80,10,18,${0.016 + activePower * 0.024})`);
    baseGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = baseGlow;
    ctx.fillRect(0, 0, w, h);

    const light = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(w, h) * 0.42);
    light.addColorStop(0, `rgba(255,255,255,${0.02 + activePower * 0.018})`);
    light.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawFog(time) {
    const breath = 1 + Math.sin(time * 0.00028) * 0.04;
    const activeX = hoverState.active ? hoverState.x : scene.x;
    const activeY = hoverState.active ? hoverState.y : scene.y;
    const boost = 1 + scene.intensity * 0.16 + hoverState.power * 0.26;

    const fogs = [
      { x: activeX * 0.72 + w * 0.14, y: activeY * 0.70 + h * 0.10, r: 150 * breath * boost, a: 0.015, tone: "white" },
      { x: activeX * 0.82 + w * 0.10, y: activeY * 0.40 + h * 0.18, r: 180 * breath * boost, a: 0.014, tone: "red" },
      { x: activeX * 0.55 + w * 0.22, y: activeY * 0.96 + h * 0.10, r: 220 * breath * boost, a: 0.012, tone: "white" }
    ];

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    fogs.forEach((f) => {
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      if (f.tone === "white") grad.addColorStop(0, `rgba(170,190,220,${f.a})`);
      else grad.addColorStop(0, `rgba(90,10,18,${f.a})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawStars(time) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;
    const anchorX = ((hoverState.active ? hoverState.x : scene.x) - w * 0.5) / w;
    const anchorY = ((hoverState.active ? hoverState.y : scene.y) - h * 0.5) / h;
    const power = scene.intensity + hoverState.power * 0.5;

    stars.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      s.tw += 0.015;
      wrap(s, 12);

      const twinkle = 0.82 + Math.sin(s.tw + time * 0.0012) * 0.18;
      const px = s.x + mx * 8 + anchorX * 14 * power;
      const py = s.y + my * 8 + anchorY * 14 * power;

      ctx.beginPath();
      ctx.arc(px, py, s.r * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(s.a + power * 0.018) * twinkle})`;
      ctx.fill();

      if (i % 12 === 0) {
        ctx.beginPath();
        ctx.moveTo(px - s.r * 1.6, py);
        ctx.lineTo(px + s.r * 1.6, py);
        ctx.moveTo(px, py - s.r * 1.6);
        ctx.lineTo(px, py + s.r * 1.6);
        ctx.strokeStyle = `rgba(255,255,255,${s.a * 0.08 * twinkle})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  function drawPlanetBody(x, y, r, tone, glowBoost) {
    const outer = ctx.createRadialGradient(x, y, 0, x, y, r);
    if (tone === "white") {
      outer.addColorStop(0, `rgba(220,230,245,${0.025 + glowBoost})`);
      outer.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      outer.addColorStop(0, `rgba(140,24,34,${0.028 + glowBoost})`);
      outer.addColorStop(1, "rgba(0,0,0,0)");
    }
    ctx.fillStyle = outer;
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
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(
        x + (i - 1.5) * r * 0.035,
        y + (i - 1.5) * r * 0.016,
        r * (0.38 - i * 0.03),
        r * (0.08 + i * 0.01),
        0.18,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = tone === "white"
        ? "rgba(255,255,255,0.14)"
        : "rgba(180,52,64,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.arc(x - r * 0.20, y - r * 0.22, r * 0.10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.48)";
    ctx.fill();
    ctx.restore();
  }

  function drawPlanets(time) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;
    const anchorX = ((hoverState.active ? hoverState.x : scene.x) - w * 0.5) / w;
    const anchorY = ((hoverState.active ? hoverState.y : scene.y) - h * 0.5) / h;
    const localPower = scene.intensity + hoverState.power * 0.85;

    planets.forEach((p, i) => {
      p.vx += Math.sin(time * 0.00025 + i) * p.ax;
      p.vy += Math.cos(time * 0.00022 + i * 1.2) * p.ay;

      p.vx += mx * 0.0009 * (1 + p.depth);
      p.vy += my * 0.0009 * (1 + p.depth);

      p.vx = Math.max(-0.09, Math.min(0.09, p.vx));
      p.vy = Math.max(-0.09, Math.min(0.09, p.vy));

      p.x += p.vx;
      p.y += p.vy;
      wrap(p, p.r);

      const focusBoost = 1 + localPower * 0.1;
      const breathe = 1 + Math.sin(time * 0.00045 + p.pulse) * 0.012;
      p.scale += ((focusBoost * breathe) - p.scale) * 0.05;

      const px = p.x + mx * 42 * p.depth + anchorX * 70 * p.depth * localPower;
      const py = p.y + my * 42 * p.depth + anchorY * 70 * p.depth * localPower;
      const pr = p.r * p.scale * (1 + localPower * 0.04);
      const glowBoost = (Math.sin(time * 0.0005 + i) * 0.5 + 0.5) * (0.005 + localPower * 0.014);

      drawPlanetBody(px, py, pr, p.tone, glowBoost);
    });

    ctx.restore();
  }

  function drawRings(time) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;
    const anchorX = ((hoverState.active ? hoverState.x : scene.x) - w * 0.5) / w;
    const anchorY = ((hoverState.active ? hoverState.y : scene.y) - h * 0.5) / h;
    const pulse = 1 + Math.sin(time * 0.0004) * (0.01 + hoverState.power * 0.035);
    const power = scene.intensity + hoverState.power * 0.9;

    rings.forEach((r, idx) => {
      r.x += r.vx;
      r.y += r.vy;
      r.rot += r.rotSpeed * (1 + power * 1.1);
      wrap(r, r.rx + 40);

      const px = r.x + mx * 24 * r.depth + anchorX * 55 * r.depth * power;
      const py = r.y + my * 24 * r.depth + anchorY * 55 * r.depth * power;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(r.rot);

      ctx.strokeStyle = `rgba(255,255,255,${0.085 + power * 0.085 + Math.sin(time * 0.0005 + idx) * 0.01})`;
      ctx.lineWidth = 2.4 + power * 1.0;
      ctx.beginPath();
      ctx.ellipse(0, 0, r.rx * pulse, r.ry * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(96,12,20,${0.065 + power * 0.06})`;
      ctx.lineWidth = 1.5 + power * 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, r.rx * 0.84 * pulse, r.ry * 0.72 * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  function drawFront(time) {
    fctx.clearRect(0, 0, w, h);
    fctx.save();
    fctx.globalCompositeOperation = "screen";

    const mx = (mouse.x - w * 0.5) / w;
    const my = (mouse.y - h * 0.5) / h;
    const anchorX = ((hoverState.active ? hoverState.x : scene.x) - w * 0.5) / w;
    const anchorY = ((hoverState.active ? hoverState.y : scene.y) - h * 0.5) / h;
    const power = scene.intensity + hoverState.power * 0.95;

    particles.forEach((p, idx) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const repel = dist < 140 ? (140 - dist) / 140 : 0;

      p.vx += p.baseVX * 0.0014 + (-dx / dist) * repel * 0.018;
      p.vy += p.baseVY * 0.0014 + (-dy / dist) * repel * 0.018;

      p.vx *= 0.982;
      p.vy *= 0.982;

      p.x += p.vx;
      p.y += p.vy;
      wrap(p, 20);

      const pulse = 0.92 + Math.sin(time * 0.001 + idx) * 0.08;
      const px = p.x + mx * 10 + anchorX * 26 * power;
      const py = p.y + my * 10 + anchorY * 26 * power;

      fctx.beginPath();
      fctx.arc(px, py, p.r * pulse * (1 + power * 0.12), 0, Math.PI * 2);
      fctx.fillStyle = p.hue === "red"
        ? `rgba(90,10,18,${p.a + power * 0.03})`
        : `rgba(255,255,255,${p.a + power * 0.034})`;
      fctx.fill();
    });

    if (logoReady) {
      logoParticles.forEach((p, idx) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const attract = dist < 180 ? (180 - dist) / 180 : 0;

        p.vx += p.baseVX * 0.0012 + (dx / dist) * attract * 0.004 * p.depth;
        p.vy += p.baseVY * 0.0012 + (dy / dist) * attract * 0.004 * p.depth;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        wrap(p, 70);

        const depthParallax = (18 + power * 18) * p.depth;
        const cinematicPulse = 1 + Math.sin(time * 0.0009 + idx) * (0.025 + power * 0.028);
        const drawSize = p.size * p.depth * cinematicPulse * (1 + power * 0.10);
        const px = p.x + mx * depthParallax + anchorX * 30 * p.depth * power;
        const py = p.y + my * depthParallax + anchorY * 30 * p.depth * power;

        fctx.save();
        fctx.globalAlpha = Math.min(0.4, p.a + 0.03 + power * 0.1);
        fctx.translate(px, py);
        fctx.rotate(p.rot);
        fctx.drawImage(logo, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        fctx.restore();
      });
    }

    fctx.restore();
  }

  function animate(time) {
    requestAnimationFrame(animate);

    if (!menuOpen) {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
    }

    scrollState.y += (scrollState.ty - scrollState.y) * 0.08;

    const active = getActiveSectionInfo();
    scene.tx = active.x;
    scene.ty = active.y;
    scene.targetIntensity = active.intensity;

    scene.x += (scene.tx - scene.x) * 0.05;
    scene.y += (scene.ty - scene.y) * 0.05;
    scene.intensity += (scene.targetIntensity - scene.intensity) * 0.06;

    hoverState.x += (hoverState.tx - hoverState.x) * 0.12;
    hoverState.y += (hoverState.ty - hoverState.y) * 0.12;
    hoverState.power += (hoverState.tPower - hoverState.power) * 0.12;

    ctx.clearRect(0, 0, w, h);
    drawBackground(time);
    drawFog(time);
    drawStars(time);
    drawPlanets(time);
    drawRings(time);
    drawFront(time);
  }

  animate(0);
})();
