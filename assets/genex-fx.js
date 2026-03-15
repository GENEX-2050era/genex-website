(function(){

const q=(s)=>document.querySelector(s);
const qa=(s)=>Array.from(document.querySelectorAll(s));

function initHamburger(){

qa(".mobile-toggle").forEach(btn=>{

if(!btn.querySelector(".line")){
btn.innerHTML=
'<span class="line"></span><span class="line"></span><span class="line"></span>';
}

const nav=q("#mobileNav");

btn.addEventListener("click",()=>{

btn.classList.toggle("is-open");

if(nav)nav.classList.toggle("open");

});

});

}

function initTransitions(){

const transition=q("#pageTransition");

if(!transition)return;

qa("a[href]").forEach(link=>{

const href=link.getAttribute("href");

if(!href)return;
if(href.startsWith("#"))return;

link.addEventListener("click",function(e){

e.preventDefault();

transition.classList.add("active");

setTimeout(()=>{
window.location.href=this.getAttribute("href");
},300);

});

});

}

function initVisuals(){

const canvas=q("#backFxCanvas");

if(!canvas)return;

const ctx=canvas.getContext("2d");

let w=window.innerWidth;
let h=window.innerHeight;

function resize(){
w=canvas.width=window.innerWidth;
h=canvas.height=window.innerHeight;
}

window.addEventListener("resize",resize);

const stars=Array.from({length:200},()=>({
x:Math.random()*w,
y:Math.random()*h,
r:Math.random()*1.5
}));

function draw(){

ctx.clearRect(0,0,w,h);

ctx.fillStyle="white";

stars.forEach(s=>{
ctx.beginPath();
ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
ctx.fill();
});

requestAnimationFrame(draw);

}

resize();
draw();

}

initHamburger();
initTransitions();
initVisuals();

})();
