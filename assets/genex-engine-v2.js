(function () {

  const back = document.getElementById("backFxCanvas");
  const front = document.getElementById("frontFxCanvas");
  if (!back || !front) return;

  const ctx = back.getContext("2d");
  const fctx = front.getContext("2d");

  let w = innerWidth;
  let h = innerHeight;

  let mouse = { x: w/2, y: h/2 };

  window.addEventListener("mousemove", e=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("touchmove", e=>{
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  });

  function resize(){
    w = innerWidth;
    h = innerHeight;
    back.width = front.width = w;
    back.height = front.height = h;
  }

  window.addEventListener("resize", resize);
  resize();

  function wrap(o, pad=120){
    if(o.x < -pad) o.x = w+pad;
    if(o.x > w+pad) o.x = -pad;
    if(o.y < -pad) o.y = h+pad;
    if(o.y > h+pad) o.y = -pad;
  }

  // 🌌 Stars
  const stars = Array.from({length:80},()=>({
    x: Math.random()*w,
    y: Math.random()*h,
    r: Math.random()*1.5,
    vx:(Math.random()-0.5)*0.2,
    vy:(Math.random()-0.5)*0.2
  }));

  // 🪐 Planets
  const planets = Array.from({length:5},(_,i)=>({
    x: Math.random()*w,
    y: Math.random()*h,
    r: 180 + Math.random()*200,
    vx:(Math.random()-0.5)*0.2,
    vy:(Math.random()-0.5)*0.2,
    depth:0.4 + Math.random()*0.6,
    red: i%2===0
  }));

  // 🔷 Particles
  const particles = Array.from({length:40},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    vx:(Math.random()-0.5)*0.5,
    vy:(Math.random()-0.5)*0.5
  }));

  function drawBackground(){
    ctx.fillStyle = "#02030a";
    ctx.fillRect(0,0,w,h);
  }

  function drawStars(){
    ctx.fillStyle="rgba(255,255,255,0.2)";
    stars.forEach(s=>{
      s.x+=s.vx;
      s.y+=s.vy;
      wrap(s,10);

      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawPlanets(){
    planets.forEach(p=>{
      // 🧠 Mouse depth interaction
      const dx = (mouse.x - w/2) * 0.002 * p.depth;
      const dy = (mouse.y - h/2) * 0.002 * p.depth;

      p.x += p.vx + dx;
      p.y += p.vy + dy;

      wrap(p, p.r);

      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      if(p.red){
        g.addColorStop(0,"rgba(120,20,30,0.25)");
        g.addColorStop(1,"transparent");
      }else{
        g.addColorStop(0,"rgba(255,255,255,0.25)");
        g.addColorStop(1,"transparent");
      }

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawParticles(){
    fctx.clearRect(0,0,w,h);

    particles.forEach(p=>{
      // 🧠 gravity toward mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;

      p.vx += dx * 0.00002;
      p.vy += dy * 0.00002;

      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      wrap(p,20);

      fctx.fillStyle="rgba(255,255,255,0.15)";
      fctx.fillRect(p.x,p.y,2,2);
    });
  }

  function animate(){
    requestAnimationFrame(animate);

    ctx.clearRect(0,0,w,h);
    drawBackground();
    drawStars();
    drawPlanets();
    drawParticles();
  }

  animate();

})();
