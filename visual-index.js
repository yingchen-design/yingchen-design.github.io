(() => {
 'use strict';
 document.querySelectorAll('[data-visual-gallery]').forEach(root=>{
  const track=root.querySelector('.project-grid'),tools=root.querySelector('[data-visual-tools]'),controls=root.querySelector('.visual-carousel-controls');
  const cards=()=>[...track.querySelectorAll('.work-card')].filter(c=>!c.hidden);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='grid',index=0,position=0,target=0,step=1,width=1,frame=0,lastTime=0,drag=null,suppressClick=false;
  try{mode=localStorage.getItem('visual-gallery-view')==='carousel'?'carousel':'grid';}catch{}
  const requested=new URLSearchParams(location.search).get('view');if(['grid','carousel'].includes(requested))mode=requested;
  const active=()=>mode==='carousel'&&(root.dataset.visualGallery==='standalone'||document.body.classList.contains('visual-filter'));
  const mod=(n,m)=>((n%m)+m)%m;
  function update(){const list=cards();if(!list.length)return;index=mod(Math.round(position/step),list.length);list.forEach((c,i)=>c.classList.toggle('is-current',i===index));const caption=controls.querySelector('.visual-carousel-caption'),title=list[index].querySelector('h2').textContent;if(caption.textContent!==title)caption.textContent=title;controls.querySelectorAll('button').forEach(b=>b.disabled=list.length<2);}
  function paint(){const list=cards(),total=step*list.length;if(!total)return;const center=track.clientWidth/2;list.forEach((c,i)=>{const offset=mod(i*step-position+total/2,total)-total/2;c.style.transform=`translate3d(${center-width/2+offset}px,0,0)`;});update();}
  function tick(time){frame=0;if(!active())return;const dt=Math.min((time-lastTime)||16.67,40);lastTime=time;const delta=target-position;position+=reduced.matches?delta:delta*(1-Math.pow(.84,dt/16.67));if(Math.abs(target-position)<.1)position=target;paint();if(Math.abs(target-position)>.1)frame=requestAnimationFrame(tick);}
  function wake(){if(!frame){lastTime=0;frame=requestAnimationFrame(tick);}}
  function layout(){if(!active())return;const first=cards()[0];if(!first)return;const oldStep=step;width=first.offsetWidth;step=width+(innerWidth<601?28:50);position=position/oldStep*step;target=target/oldStep*step;paint();}
  function go(direction){target=Math.round(target/step)*step+direction*step;wake();}
  function view(value){mode=value;const on=root.dataset.visualGallery==='standalone'||document.body.classList.contains('visual-filter');root.classList.toggle('visual-carousel',on&&mode==='carousel');controls.hidden=!on||mode!=='carousel';tools.hidden=!on;root.querySelectorAll('[data-gallery-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryView===mode)));if(active()){track.tabIndex=0;track.setAttribute('aria-label','Visual projects. Drag, scroll or use arrow keys to browse.');cards().forEach(c=>c.querySelectorAll('img').forEach(img=>img.loading='eager'));layout();}else{cancelAnimationFrame(frame);frame=0;track.removeAttribute('tabindex');track.removeAttribute('aria-label');track.querySelectorAll('.work-card').forEach(c=>{c.style.removeProperty('transform');c.classList.remove('is-current');});}update();}
  root.querySelectorAll('[data-gallery-view]').forEach(b=>b.addEventListener('click',()=>{view(b.dataset.galleryView);try{localStorage.setItem('visual-gallery-view',mode);}catch{}}));
  controls.querySelector('[data-gallery-prev]').addEventListener('click',()=>go(-1));controls.querySelector('[data-gallery-next]').addEventListener('click',()=>go(1));
  track.addEventListener('wheel',e=>{if(!active()||e.ctrlKey)return;e.preventDefault();const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;target+=delta*(e.deltaMode===1?16:e.deltaMode===2?track.clientWidth:1);wake();},{passive:false});
  track.addEventListener('keydown',e=>{if(!active()||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home'||e.key==='End'){target=(e.key==='Home'?0:cards().length-1)*step;wake();}else go(e.key==='ArrowRight'?1:-1);});
  track.addEventListener('focusin',e=>{if(!active())return;const i=cards().indexOf(e.target.closest('.work-card'));if(i<0)return;const n=cards().length,total=n*step;const offset=mod(i*step-position+total/2,total)-total/2;if(Math.abs(offset)<track.clientWidth/2-width/2)return;target=position+offset;wake();});
  track.addEventListener('pointerdown',e=>{if(!active()||e.button!==0)return;target=position;drag={x:e.clientX,y:e.clientY,position,id:e.pointerId,lastX:e.clientX,time:performance.now(),velocity:0,moved:false};suppressClick=false;});
  track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8&&e.pointerType!=='mouse'){drag=null;return;}if(Math.abs(dx)<6&&!drag.moved)return;drag.moved=true;suppressClick=true;track.classList.add('dragging');track.setPointerCapture(e.pointerId);const now=performance.now();drag.velocity=(drag.lastX-e.clientX)/Math.max(8,now-drag.time);drag.lastX=e.clientX;drag.time=now;position=target=drag.position-dx;paint();});
  function end(e){if(!drag)return;const d=drag;drag=null;track.classList.remove('dragging');if(track.hasPointerCapture(d.id))track.releasePointerCapture(d.id);if(d.moved){const velocity=performance.now()-d.time<100?d.velocity:0;target=position+(reduced.matches||e.type==='pointercancel'?0:Math.max(-2*step,Math.min(2*step,velocity*240)));wake();}}
  track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);track.addEventListener('lostpointercapture',()=>{if(drag){drag=null;track.classList.remove('dragging');}});
  track.addEventListener('dragstart',e=>{if(active())e.preventDefault();});
  track.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
  controls.querySelector('.visual-carousel-hint').textContent='Drag or scroll to explore';
  document.addEventListener('portfolio-filter',()=>{position=target=0;view(mode);});new ResizeObserver(layout).observe(track);view(mode);
 });
})();
