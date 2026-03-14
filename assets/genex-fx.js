(function(){

const backCanvas = document.getElementById("backFxCanvas");
const frontCanvas = document.getElementById("frontFxCanvas");

if(!backCanvas || !frontCanvas){
console.log("GENEX FX canvas missing");
return;
}

const backCtx = backCanvas.getContext("2d");
const frontCtx = frontCanvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;

backCanvas.width = w;
backCanvas.height = h;

frontCanvas.width = w;
frontCanvas.height = h;

window.addEventListener("resize",()=>{
w = window.innerWidth;
h = window.innerHeight;

backCanvas.width = w;
backCanvas.height = h;

frontCanvas.width = w;
frontCanvas.height = h;
});

const stars = [];

for(let i=0;i<180;i++){
stars.push({
x:Math.random()*w,
y:Math.random()*h,
size:Math.random()*2,
speed:0.1+Math.random()*0.3
});
}

const shapes=[];

for(let i=0;i<12;i++){
shapes.push({
x:Math.random()*w,
y:Math.random()*h,
r:40+Math.random()*80,
rot:Math.random()*360,
speed:0.1+Math.random()*0.3
});
}

function drawStars(){

backCtx.clearRect(0,0,w,h);

const gradient = backCtx.createLinearGradient(0,0,0,h);

gradient.addColorStop(0,"#05070f");
gradient.addColorStop(1,"#090d18");

backCtx.fillStyle=gradient;
backCtx.fillRect(0,0,w,h);

stars.forEach(s=>{

s.y += s.speed;

if(s.y>h){
s.y=0;
s.x=Math.random()*w;
}

backCtx.beginPath();
backCtx.arc(s.x,s.y,s.size,0,Math.PI*2);

backCtx.fillStyle="rgba(255,255,255,0.8)";
backCtx.fill();

});

}

function drawShapes(){

frontCtx.clearRect(0,0,w,h);

shapes.forEach(s=>{

s.rot+=0.1;

const x = s.x + Math.sin(s.rot*0.01)*20;
const y = s.y + Math.cos(s.rot*0.01)*20;

const gradient = frontCtx.createRadialGradient(x,y,10,x,y,s.r);

gradient.addColorStop(0,"rgba(180,20,40,0.4)");
gradient.addColorStop(1,"rgba(180,20,40,0)");

frontCtx.fillStyle=gradient;

frontCtx.beginPath();
frontCtx.arc(x,y,s.r,0,Math.PI*2);
frontCtx.fill();

});

}

function animate(){

drawStars();
drawShapes();

requestAnimationFrame(animate);

}

animate();

})();
