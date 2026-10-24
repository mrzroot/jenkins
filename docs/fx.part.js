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
