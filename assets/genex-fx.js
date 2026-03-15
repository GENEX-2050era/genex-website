const backCanvas = document.getElementById("backFxCanvas");
const frontCanvas = document.getElementById("frontFxCanvas");

const backCtx = backCanvas.getContext("2d");
const frontCtx = frontCanvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;

backCanvas.width = w;
backCanvas.height = h;

frontCanvas.width = w;
frontCanvas.height = h;

window.addEventListener("resize", () => {
w = window.innerWidth;
h = window.innerHeight;

backCanvas.width = w;
backCanvas.height = h;

frontCanvas.width = w;
frontCanvas.height = h;
});





/* =====================
   STARS
===================== */

const stars = [];

for(let i=0;i<180;i++){

stars.push({
x:Math.random()*w,
y:Math.random()*h,
z:Math.random()*1.5,
size:Math.random()*1.2
});

}



/* =====================
   GALAXY CORES
===================== */

const cores = [];

for(let i=0;i<12;i++){

cores.push({

x:Math.random()*w,
y:Math.random()*h,

radius:60 + Math.random()*120,

depth:0.2 + Math.random()*0.8,

speed:(Math.random()*0.0003)+0.00005,

color: Math.random() > 0.5
? "rgba(255,255,255,0.95)"
: "rgba(120,10,20,0.7)",

pulse: Math.random()*Math.PI*2

});

}




/* =====================
   PARTICLES
===================== */

const particles = [];

for(let i=0;i<60;i++){

particles.push({

x:Math.random()*w,
y:Math.random()*h,
size:1+Math.random()*2,
speed:0.05 + Math.random()*0.08

});

}





function drawBackground(){

backCtx.clearRect(0,0,w,h);


/* ===== dark base ===== */

const gradient = backCtx.createRadialGradient(
w/2,h/2,0,
w/2,h/2,w
);

gradient.addColorStop(0,"#070910");
gradient.addColorStop(1,"#020307");

backCtx.fillStyle = gradient;
backCtx.fillRect(0,0,w,h);





/* ===== stars ===== */

stars.forEach(s=>{

backCtx.fillStyle="rgba(255,255,255,0.8)";

backCtx.beginPath();
backCtx.arc(s.x,s.y,s.size*s.z,0,Math.PI*2);
backCtx.fill();

s.y += s.z*0.08;

if(s.y>h){

s.y=0;
s.x=Math.random()*w;

}

});





/* ===== galaxy cores ===== */

cores.forEach(c=>{

c.pulse += c.speed;

const r = c.radius + Math.sin(c.pulse)*8;

const g = backCtx.createRadialGradient(
c.x,c.y,0,
c.x,c.y,r
);

g.addColorStop(0,c.color);
g.addColorStop(0.4,"rgba(180,20,40,0.18)");
g.addColorStop(1,"rgba(0,0,0,0)");

backCtx.fillStyle=g;

backCtx.beginPath();
backCtx.arc(c.x,c.y,r,0,Math.PI*2);
backCtx.fill();

});





/* ===== particles ===== */

particles.forEach(p=>{

backCtx.fillStyle="rgba(255,255,255,0.25)";

backCtx.beginPath();
backCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
backCtx.fill();

p.y += p.speed;

if(p.y>h){

p.y=0;
p.x=Math.random()*w;

}

});

}






/* =====================
   FRONT GLOW
===================== */

function drawFront(){

frontCtx.clearRect(0,0,w,h);

const fog = frontCtx.createRadialGradient(
w/2,h/2,0,
w/2,h/2,w
);

fog.addColorStop(0,"rgba(255,255,255,0.03)");
fog.addColorStop(1,"rgba(0,0,0,0)");

frontCtx.fillStyle=fog;
frontCtx.fillRect(0,0,w,h);

}





function animate(){

drawBackground();
drawFront();

requestAnimationFrame(animate);

}

animate();





/* =====================
   PAGE TRANSITION
===================== */

const transition = document.getElementById("pageTransition");

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",(e)=>{

const href = link.getAttribute("href");

if(!href || href.startsWith("#")) return;

e.preventDefault();

transition.classList.add("active");

setTimeout(()=>{

window.location = href;

},350);

});

});





/* =====================
   LANGUAGE SWITCH
===================== */

document.querySelectorAll("[data-lang]").forEach(btn=>{

btn.addEventListener("click",()=>{

const lang = btn.dataset.lang;

if(lang==="ar"){

document.documentElement.dir="rtl";
document.documentElement.lang="ar";

}else{

document.documentElement.dir="ltr";
document.documentElement.lang="en";

}

});

});





/* =====================
   MOBILE MENU
===================== */

const toggle = document.querySelector(".mobile-toggle");
const nav = document.querySelector(".mobile-nav");

if(toggle){

toggle.addEventListener("click",()=>{

toggle.classList.toggle("is-open");
nav.classList.toggle("open");

});

}
