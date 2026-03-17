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
    buildMesh();
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
    r: Math.random() * 1.5 + 0.3,
    a: Math.random() * 0.18 + 0.04,
    depth: 0.08 + Math.random() * 0.12,
    drift: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.006
  }));

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2 + 0.8,
    a: Math.random() * 0.05 + 0.015,
    depth: 0.10 + Math.random() * 0.16,
    drift: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.018 + 0.006
  }));

  const nodes = [
    { x: 0.18, y: 0.20, r: 120, tone: "white", depth: 0.12, dx: 0.010, dy: 0.012 },
    { x: 0.78, y: 0.24, r: 180, tone: "red",   depth: 0.16, dx: 0.008, dy: -0.010 },
    { x: 0.28, y: 0.74, r: 160, tone: "white", depth: 0.14, dx: -0.009, dy: 0.007 },
    { x: 0.74, y: 0.78, r: 210, tone: "red",   depth: 0.18, dx: 0.007, dy: 0.008 }
  ];

  const rings = [
    { x: 0.54, y: 0.22, rx: 220, ry: 52, depth: 0.08, speed: 0.012, tilt: 0.14 },
    { x: 0.42, y: 0.64, rx: 280, ry: 68, depth: 0.10, speed: 0.010, tilt: -0.12 }
  ];

  let mesh = [];

  function buildMesh() {
    const spacing = Math.max(100, Math.min(150, w / 11));
    const cols = Math.ceil(w / spacing) + 3;
    const rows = Math.ceil(h / spacing) + 3;
    mesh = [];

    for (let y = -1; y < rows; y++) {
      for (let x = -1; x < cols; x++) {
        mesh.push({
          x: x * spacing,
          y: y * spacing,
          phase: Math.random() * Math.PI * 2,
          amp: 4 + Math.random() * 5
        });
      }
    }
  }

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
    backCtx.filter = "blur(80px)";

    const fogs = [
      { x: 0.16, y: 0.18, r: 180, a: 0.010, tone: "white", dx: 0.008, dy: 0.006 },
      { x: 0.82, y: 0.28, r: 220, a: 0.010, tone: "red", dx: 0.006, dy: -0.006 },
      { x: 0.52, y: 0.72, r: 260, a: 0.008, tone: "white", dx: -0.006, dy: 0.006 }
    ];

    fogs.forEach((f, i) => {
      const x = f.x * w + Math.sin(t * f.dx + i) * 24 + mouse.x * 6;
      const y = f.y * h + Math.cos(t * f.dy + i) * 20 + mouse.y * 4 + scrollCurrent * 10;

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

  function drawMesh(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    const spacing = Math.max(100, Math.min(150, w / 11));
    const cols = Math.ceil(w / spacing) + 3;

    for (let i = 0; i < mesh.length; i++) {
      const p = mesh[i];
      const x = p.x + Math.sin(t * 0.30 + p.phase) * p.amp + mouse.x * 7;
      const y = p.y + Math.cos(t * 0.28 + p.phase) * p.amp + mouse.y * 5 + scrollCurrent * 7;

      const right = mesh[i + 1];
      const down = mesh[i + cols];

      if (right && Math.abs(right.y - p.y) < 2) {
        const xr = right.x + Math.sin(t * 0.30 + right.phase) * right.amp + mouse.x * 7;
        const yr = right.y + Math.cos(t * 0.28 + right.phase) * right.amp + mouse.y * 5 + scrollCurrent * 7;
        backCtx.beginPath();
        backCtx.moveTo(x, y);
        backCtx.lineTo(xr, yr);
        backCtx.strokeStyle = "rgba(255,255,255,0.045)";
        backCtx.lineWidth = 1;
        backCtx.stroke();
      }

      if (down) {
        const xd = down.x + Math.sin(t * 0.30 + down.phase) * down.amp + mouse.x * 7;
        const yd = down.y + Math.cos(t * 0.28 + down.phase) * down.amp + mouse.y * 5 + scrollCurrent * 7;
        backCtx.beginPath();
        backCtx.moveTo(x, y);
        backCtx.lineTo(xd, yd);
        backCtx.strokeStyle = "rgba(255,255,255,0.04)";
        backCtx.lineWidth = 1;
        backCtx.stroke();
      }

      backCtx.beginPath();
      backCtx.arc(x, y, 1.1, 0, Math.PI * 2);
      backCtx.fillStyle = "rgba(255,255,255,0.10)";
      backCtx.fill();
    }

    backCtx.restore();
  }

  function drawNodes(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    nodes.forEach((n, i) => {
      const x = n.x * w + Math.sin(t * n.dx + i) * 18 + mouse.x * 10 * n.depth;
      const y = n.y * h + Math.cos(t * n.dy + i) * 16 + mouse.y * 7 * n.depth + scrollCurrent * 10 * n.depth;

      const halo = backCtx.createRadialGradient(x, y, 0, x, y, n.r);
      if (n.tone === "white") {
        halo.addColorStop(0, "rgba(210,220,235,0.020)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        halo.addColorStop(0, "rgba(110,16,26,0.024)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
      }
      backCtx.fillStyle = halo;
      backCtx.beginPath();
      backCtx.arc(x, y, n.r, 0, Math.PI * 2);
      backCtx.fill();

      const core = backCtx.createRadialGradient(x - 10, y - 10, 0, x, y, n.r * 0.42);
      if (n.tone === "white") {
        core.addColorStop(0, "rgba(220,228,240,0.14)");
        core.addColorStop(0.4, "rgba(120,135,160,0.08)");
        core.addColorStop(1, "rgba(20,24,32,0.02)");
      } else {
        core.addColorStop(0, "rgba(150,34,46,0.16)");
        core.addColorStop(0.4, "rgba(70,10,18,0.08)");
        core.addColorStop(1, "rgba(16,6,10,0.02)");
      }

      backCtx.fillStyle = core;
      backCtx.beginPath();
      backCtx.arc(x, y, n.r * 0.42, 0, Math.PI * 2);
      backCtx.fill();
    });

    backCtx.restore();
  }

  function drawRings(t) {
    backCtx.save();
    backCtx.globalCompositeOperation = "screen";

    rings.forEach((r, i) => {
      const x = r.x * w + Math.sin(t * r.speed + i) * 14 + mouse.x * 8 * r.depth;
      const y = r.y * h + Math.cos(t * r.speed + i) * 12 + mouse.y * 6 * r.depth + scrollCurrent * 8 * r.depth;
      const tilt = r.tilt + Math.sin(t * 0.08 + i) * 0.06;

      backCtx.strokeStyle = "rgba(255,255,255,0.07)";
      backCtx.lineWidth = 3;
      backCtx.beginPath();
      backCtx.ellipse(x, y, r.rx, r.ry, tilt, 0, Math.PI * 2);
      backCtx.stroke();

      backCtx.strokeStyle = "rgba(90,10,18,0.06)";
      backCtx.lineWidth = 2;
      backCtx.beginPath();
      backCtx.ellipse(x, y, r.rx * 0.84, r.ry * 0.76, -tilt * 0.9, 0, Math.PI * 2);
      backCtx.stroke();
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
        backCtx.strokeStyle = `rgba(255,255,255,${s.a * 0.14})`;
        backCtx.lineWidth = 0.5;
        backCtx.stroke();
      }
    });

    backCtx.restore();
  }

  function drawFront(t) {
    frontCtx.clearRect(0, 0, w, h);
    frontCtx.save();
    frontCtx.globalCompositeOperation = "screen";

    particles.forEach((p, i) => {
      const x = p.x * w + Math.sin(t * p.speed + p.drift + i) * 12 + mouse.x * 4 * p.depth;
      const y = p.y * h + Math.cos(t * p.speed + p.drift + i) * 10 + mouse.y * 4 * p.depth + scrollCurrent * 10 * p.depth;

      frontCtx.beginPath();
      frontCtx.arc(x, y, p.r, 0, Math.PI * 2);
      frontCtx.fillStyle = p.hue === "red"
        ? `rgba(90,10,18,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      frontCtx.fill();
    });

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
    drawMesh(t);
    drawNodes(t);
    drawRings(t);
    drawStars(t);
    drawFront(t);
  }

  resize();
  animate();
})();
