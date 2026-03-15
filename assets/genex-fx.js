import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

(function(){

const q=s=>document.querySelector(s)
const qa=s=>document.querySelectorAll(s)

/* mobile menu */

function initHamburger(){

qa(".mobile-toggle").forEach(btn=>{

if(!btn.querySelector("span")){
btn.innerHTML=`<span></span><span></span><span></span>`
}

const nav=q("#mobileNav")

btn.onclick=()=>{
btn.classList.toggle("is-open")
if(nav)nav.classList.toggle("open")
}

})

}

/* scroll reveal */

function initReveal(){

const els=[...qa(".genex-panel,.genex-card,.feature,.stat,.cta")]

const obs=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.classList.add("in-view")
}
})
},{threshold:.15})

els.forEach(el=>{
el.classList.add("reveal-on-scroll")
obs.observe(el)
})

}

/* tilt */

function initTilt(){

qa(".tilt-card").forEach(el=>{

el.onmousemove=e=>{
const r=el.getBoundingClientRect()
const x=(e.clientX-r.left)/r.width-.5
const y=(e.clientY-r.top)/r.height-.5
el.style.transform=`perspective(1200px) rotateY(${x*6}deg) rotateX(${y*-6}deg)`
}

el.onmouseleave=()=>{
el.style.transform="perspective(1200px) rotateY(0) rotateX(0)"
}

})

}

/* page transition */

function initTransitions(){

const t=q("#pageTransition")

qa("a[href]").forEach(a=>{

const h=a.getAttribute("href")

if(!h)return
if(h.startsWith("#"))return
if(a.target)return

a.onclick=e=>{
e.preventDefault()

t.classList.add("active")

setTimeout(()=>{
location.href=h
},400)

}

})

}

/* chat */

function initChat(){

if(q("#chatToggle"))return

const btn=document.createElement("button")
btn.id="chatToggle"
btn.textContent="💬"

const panel=document.createElement("div")
panel.id="chatPanel"

panel.innerHTML=`
<strong>GENEX Connect</strong>
<p style="margin:10px 0;opacity:.8">تواصل معنا مباشرة.</p>
<a href="./contact.html">صفحة التواصل</a>
`

document.body.append(btn,panel)

btn.onclick=()=>{
panel.classList.toggle("open")
}

}

/* music */

function initMusic(){

const audio=q("#siteMusic")

if(!audio)return

const btn=document.createElement("button")
btn.id="musicToggle"
btn.textContent="♪"

document.body.append(btn)

audio.volume=.15

btn.onclick=()=>{

if(audio.paused){
audio.play()
btn.textContent="♫"
}
else{
audio.pause()
btn.textContent="♪"
}

}

window.addEventListener("click",()=>{
audio.play().catch(()=>{})
},{once:true})

}

/* background particles */

function initVisuals(){

const canvas=q("#backFxCanvas")

if(!canvas)return

const ctx=canvas.getContext("2d")

let w=canvas.width=window.innerWidth
let h=canvas.height=window.innerHeight

window.onresize=()=>{
w=canvas.width=window.innerWidth
h=canvas.height=window.innerHeight
}

const stars=[]

for(let i=0;i<120;i++){
stars.push({
x:Math.random()*w,
y:Math.random()*h,
r:Math.random()*1.5
})
}

function draw(){

ctx.clearRect(0,0,w,h)

ctx.fillStyle="white"

stars.forEach(s=>{
ctx.beginPath()
ctx.arc(s.x,s.y,s.r,0,Math.PI*2)
ctx.fill()
})

requestAnimationFrame(draw)

}

draw()

}

/* init */

initHamburger()
initReveal()
initTilt()
initTransitions()
initChat()
initMusic()
initVisuals()

})();
