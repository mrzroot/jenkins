/* shared helpers for the per-project identity scripts (no dependencies) */
(function(){'use strict';
var d=document,R=d.documentElement;
var FX=window.FX={
 reduce:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),
 $:function(s,c){return(c||d).querySelector(s)},
 $$:function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))},
 mouse:{x:-1e3,y:-1e3,px:.5,py:.5},
 /* add .rv and reveal on scroll */
 reveal:function(sel,cls){cls=cls||'in';var els=FX.$$(sel);els.forEach(function(e){e.classList.add('rv')});
  if(FX.reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add(cls)});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add(cls);io.unobserve(x.target)}})},{rootMargin:'0px 0px -6% 0px'});els.forEach(function(e,i){e.style.setProperty('--i',i%6);io.observe(e)})},
 /* canvas loop: sizes to its box, pauses offscreen / hidden tab; draw(ctx,w,h,t,dt,m) with m = mouse in canvas px */
 loop:function(cv,draw,o){o=o||{};var ctx=cv.getContext('2d'),w=0,h=0,dpr=1,raf=0,on=false,vis=true,last=0,t0=performance.now(),m={x:-1e3,y:-1e3,in:false};
  function size(){var r=cv.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(o.dpr||2,window.devicePixelRatio||1);cv.width=Math.max(1,Math.round(w*dpr));cv.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);if(o.resize)o.resize(w,h)}
  function fr(now){if(!on)return;var t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000||.016);last=now;ctx.setTransform(dpr,0,0,dpr,0,0);draw(ctx,w,h,t,dt,m);raf=requestAnimationFrame(fr)}
  function go(){if(on||FX.reduce||d.hidden||!vis)return;on=true;last=performance.now();raf=requestAnimationFrame(fr)}
  function stop(){on=false;cancelAnimationFrame(raf)}
  size();addEventListener('resize',function(){size();if(!on){ctx.setTransform(dpr,0,0,dpr,0,0);draw(ctx,w,h,0,0,m)}});
  var host=o.host||cv.parentElement;host.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;m.in=true},{passive:true});host.addEventListener('pointerleave',function(){m.in=false;m.x=m.y=-1e3});
  if(FX.reduce){draw(ctx,w,h,o.still||2,0,m)}else{
   if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;vis?go():stop()},{threshold:0}).observe(cv);else go();
   d.addEventListener('visibilitychange',function(){d.hidden?stop():go()});draw(ctx,w,h,0,0,m)}
  return{size:size,draw:function(){draw(ctx,w,h,(performance.now()-t0)/1000,0,m)},ctx:ctx};},
 /* create an absolutely positioned canvas as the first child of host */
 layer:function(host,cls){var cv=d.createElement('canvas');cv.className='fx '+(cls||'');cv.setAttribute('aria-hidden','true');cv.setAttribute('role','presentation');if(getComputedStyle(host).position==='static')host.style.position='relative';host.insertBefore(cv,host.firstChild);return cv},
 css:function(n){return getComputedStyle(R).getPropertyValue(n).trim()},
 rnd:function(a,b){return a+Math.random()*(b-a)},
 theme:function(){return R.getAttribute('data-theme')==='dark'?'dark':'light'}
};
addEventListener('pointermove',function(e){FX.mouse.x=e.clientX;FX.mouse.y=e.clientY;FX.mouse.px=e.clientX/innerWidth;FX.mouse.py=e.clientY/innerHeight},{passive:true});
R.classList.add('fxjs');
})();

(function(){var hero=FX.$('.hero');if(!hero)return;var cv=document.createElement('canvas');cv.className='cad';cv.setAttribute('aria-hidden','true');hero.insertBefore(cv,hero.firstChild);
var pts=[],pen=0;
cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect();pts.push({x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()});if(pts.length>6)pts.shift()});
function ink(){return FX.theme()==='dark'?'255,255,255':'10,52,144'}
FX.loop(cv,function(c,w,h,t,dt,m){var I=ink(),D=FX.theme()==='dark';c.clearRect(0,0,w,h);
 c.lineWidth=1;
 /* major grid */ c.strokeStyle='rgba('+I+',.07)';c.beginPath();for(var x=0;x<w;x+=120){c.moveTo(x,0);c.lineTo(x,h)}for(var y=0;y<h;y+=120){c.moveTo(0,y);c.lineTo(w,y)}c.stroke();
 /* drafting: compass circles + construction arcs drawn progressively */
 var cx=w*.78,cy=h*.5,R=Math.min(w,h)*.42,p=(t%14)/14,prog=Math.min(1,p*2.2);
 c.strokeStyle='rgba('+I+',.28)';c.setLineDash([6,5]);
 [1,.72,.45].forEach(function(k,i){var a=Math.max(0,Math.min(1,prog*3-i));c.beginPath();c.arc(cx,cy,Math.max(0,R*k),-1.57,-1.57+6.283*a);c.stroke()});
 c.setLineDash([]);
 c.strokeStyle='rgba('+I+',.2)';for(var i=0;i<12;i++){var a=i*Math.PI/6+t*.03,l=R*(.7+.3*(i%2));var q=Math.max(0,Math.min(1,prog*12-i));c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*l*q,cy+Math.sin(a)*l*q);c.stroke()}
 /* compass pen tip */
 var pa=-1.57+6.283*(t*.18%1);c.fillStyle=D?'#ffe27a':'#0b4fd0';c.beginPath();c.arc(cx+Math.cos(pa)*R,cy+Math.sin(pa)*R,3,0,6.3);c.fill();
 /* dimension line across bottom */
 var dy=h-34,x0=w*.06,x1=w*.94;c.strokeStyle='rgba('+I+',.5)';c.beginPath();c.moveTo(x0,dy);c.lineTo(x1,dy);c.moveTo(x0,dy-8);c.lineTo(x0,dy+8);c.moveTo(x1,dy-8);c.lineTo(x1,dy+8);c.stroke();
 c.fillStyle='rgba('+I+',.75)';c.font='700 13px "Barlow Condensed",monospace';c.textAlign='center';c.fillText(Math.round((x1-x0)*2.54)/10+' MM · 1:1',w/2,dy-6);c.textAlign='left';
 /* title block */
 c.strokeStyle='rgba('+I+',.5)';var bx=w-190,by=h-110;if(w>700){c.strokeRect(bx-20,by-6,170,56);c.beginPath();c.moveTo(bx-20,by+22);c.lineTo(bx+150,by+22);c.stroke();c.fillStyle='rgba('+I+',.8)';c.fillText('JENKINSFILE',bx-12,by+14);c.fillText('SHEET 1 / 1 · REV A',bx-12,by+40)}
 /* user measurements */
 pts.forEach(function(q,i){var age=(performance.now()-q.t)/1000;c.fillStyle=D?'#ffe27a':'#0b4fd0';c.beginPath();c.arc(q.x,q.y,4,0,6.3);c.fill();c.strokeStyle=D?'rgba(255,226,122,.9)':'rgba(11,79,208,.9)';c.beginPath();c.arc(q.x,q.y,4+Math.min(30,age*50),0,6.3);c.globalAlpha=Math.max(0,1-age*1.5);c.stroke();c.globalAlpha=1;
  if(i>0){var a=pts[i-1];c.setLineDash([4,4]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(q.x,q.y);c.stroke();c.setLineDash([]);var d=Math.hypot(q.x-a.x,q.y-a.y);c.fillStyle=D?'#ffe27a':'#0b4fd0';c.font='700 13px "Barlow Condensed",monospace';c.fillText((d*.2646).toFixed(1)+' mm',(a.x+q.x)/2+6,(a.y+q.y)/2-6)}});
 /* crosshair */
 if(m.in){c.strokeStyle='rgba('+I+',.35)';c.beginPath();c.moveTo(m.x,0);c.lineTo(m.x,h);c.moveTo(0,m.y);c.lineTo(w,m.y);c.stroke();c.fillStyle='rgba('+I+',.9)';c.font='700 12px "Barlow Condensed",monospace';c.fillText('X '+Math.round(m.x)+'  Y '+Math.round(m.y),Math.min(w-110,m.x+10),Math.max(14,m.y-8))}
},{still:3,dpr:1.5,host:hero});
})();
