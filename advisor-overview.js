(()=>{'use strict';
const stages=[{title:'What was the problem?',description:'The initial brief focused on color, corners and spacing. Underneath, recurring visual and interaction patterns had drifted apart.',issues:['Typography without one consistent scale','Different color and styling decisions','No shared component baseline','Interaction patterns that varied by page'],file:'before',alt:'Original portal pages excerpted from the project film',caption:'Previous portal · original interface excerpt'},{title:'How did we unify it?',description:'Connect the visual refresh to a shared foundation, so the next page starts from the same decisions.',issues:['A common typography and color system','Reusable components and documented states','One baseline for design and engineering'],file:'foundation',alt:'Excerpt from the project film showing the design system structure and color palette',caption:'Shared foundation · design system and color'},{title:'What changed in the portal?',description:'Carry that language into the workspace, with clearer hierarchy and recognizable patterns across the portal.',issues:['A consistent workspace hierarchy','Shared components across product pages','Familiar workflows, clearer interactions'],file:'workspace',alt:'Excerpt from the project film showing the redesigned advisor dashboard',caption:'New portal · the advisor workspace'}];
const root=document.querySelector('.overview-lab');
if(!root)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:850px), (max-height:650px)');
const pin=root.querySelector('.overview-pin'),copy=root.querySelector('.overview-copy'),film=root.querySelector('.overview-film'),image=root.querySelector('#overview-film'),toggle=root.querySelector('#overview-motion'),caption=root.querySelector('#overview-film-caption');
const gallery=document.querySelector('.advisor-brand-showcase'),galleryWindow=gallery.querySelector('.advisor-brand-window');
const base='assets/advisor-redesign/opening-motion/';
let current=-1,visible=false,paused=reduced.matches,pending=false,morphActive=false,wall=null,lastMorph=-1;
let zoomGoal=0,zoomValue=0,zoomFrom=0,zoomStarted=0;
const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>v*v*(3-2*v);
copy.replaceChildren();
const panels=stages.map((stage,i)=>{
 const panel=document.createElement('div');panel.className='overview-stage-copy';
 const heading=document.createElement('h2');heading.textContent=stage.title;
 const description=document.createElement('p');description.textContent=stage.description;
 const list=document.createElement('ul');list.className='overview-stage-issues';for(const text of stage.issues){const li=document.createElement('li');li.textContent=text;list.append(li)}
 if(i===0){heading.id='overview-heading';description.id='overview-description';list.id='overview-issues'}
 panel.append(heading,description,list);panel.setAttribute('aria-hidden','true');panel.inert=true;copy.append(panel);return panel;
});
const media=document.createElement('div');media.className='overview-media';media.setAttribute('role','img');
const videos=stages.map(stage=>{const v=document.createElement('video');v.src=base+stage.file+'.mp4';v.poster=base+stage.file+'.jpg?v=9';v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-hidden','true');media.append(v);return v;});
image.replaceWith(media);
const overlay=document.createElement('div');overlay.className='overview-morph';overlay.setAttribute('aria-hidden','true');overlay.hidden=true;
const snapshot=document.createElement('canvas');snapshot.className='overview-morph-snapshot';overlay.append(snapshot);document.body.append(overlay);
function sync(){
 const run=visible&&!paused&&!reduced.matches&&!compact.matches&&!document.hidden&&!morphActive;
 videos.forEach((v,i)=>{if(i===current&&run){if(v.paused)v.play().catch(()=>{});}else if(!v.paused)v.pause();});
 const label=paused?'Play motion':'Pause motion';if(toggle.textContent!==label)toggle.textContent=label;
 toggle.setAttribute('aria-pressed',String(paused));
}
function show(index){
 if(index===current)return;current=index;
 panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);p.setAttribute('aria-hidden',String(i!==index));p.inert=i!==index;});
 videos.forEach((v,i)=>v.classList.toggle('is-active',i===index));
 media.setAttribute('aria-label',stages[index].alt);caption.textContent=stages[index].caption;sync();
}
function prepareWall(){
 if(wall)return;wall=galleryWindow.cloneNode(true);wall.classList.add('overview-morph-wall');wall.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));wall.querySelectorAll('img').forEach(i=>{i.alt='';i.loading='eager'});wall.setAttribute('aria-hidden','true');overlay.append(wall);
}
function beginMorph(){
 prepareWall();morphActive=true;gallery.classList.add('is-morphing');
 const originals=galleryWindow.querySelectorAll('.advisor-brand-track');wall.querySelectorAll('.advisor-brand-track').forEach((track,i)=>{track.style.animation='none';track.style.transform=getComputedStyle(originals[i]).transform;});
 const v=videos[2];snapshot.width=v.videoWidth||800;snapshot.height=v.videoHeight||450;const ctx=snapshot.getContext('2d');ctx.fillStyle='#f3f3f2';ctx.fillRect(0,0,snapshot.width,snapshot.height);
 if(v.readyState>=2)ctx.drawImage(v,0,0,snapshot.width,snapshot.height);
 else{const poster=new Image();poster.src=v.poster;if(poster.complete&&poster.naturalWidth)ctx.drawImage(poster,0,0,snapshot.width,snapshot.height);}
 overlay.style.width=innerWidth+'px';overlay.style.height=(innerHeight-96)+'px';overlay.hidden=false;sync();
}
function clearMorph(){
 if(!morphActive)return;
 overlay.hidden=true;film.style.opacity='';copy.style.opacity='';copy.style.visibility='';gallery.style.visibility='';gallery.classList.remove('is-morphing');morphActive=false;lastMorph=-1;sync();
}
function morph(amount,target){
 if(amount<=0||target.top<=97){clearMorph();return;}
 if(!morphActive)beginMorph();
 if(Math.abs(amount-lastMorph)<.0001)return;lastMorph=amount;
 // Read all geometry before writing. Only compositor transforms/opacity change each frame.
 const rect=media.getBoundingClientRect(),pinRect=pin.getBoundingClientRect();
 const start={x:rect.left,y:rect.top-pinRect.top+108,w:rect.width,h:rect.height};
 const t=smooth(amount),mix=(a,b)=>a+(b-a)*t;
 const x=mix(start.x,0),y=mix(start.y,96),w=mix(start.w,innerWidth),h=mix(start.h,innerHeight-96);
 overlay.style.transform=`translate3d(${x}px,${y}px,0) scale(${w/innerWidth},${h/(innerHeight-96)})`;
 wall.style.opacity=smooth(clamp((amount-.18)/.72));
 snapshot.style.opacity=1-smooth(clamp((amount-.55)/.45));
 film.style.opacity='0';copy.style.opacity=String(1-clamp(amount*7));copy.style.visibility=amount>.16?'hidden':'visible';gallery.style.visibility='hidden';
}
function update(){
 pending=false;const rest=compact.matches||reduced.matches;root.classList.toggle('is-live',!rest);root.classList.toggle('is-rest',rest);
 if(rest){clearMorph();show(0);sync();return;}
 const rect=root.getBoundingClientRect(),target=galleryWindow.getBoundingClientRect();
 const p=clamp((108-rect.top)/Math.max(1,root.offsetHeight-innerHeight+128));
 let next=p<.24?0:p<.48?1:2;
 // Small hysteresis prevents trackpad micro-reversals from flashing adjacent stages.
 if(current===0&&p<.255)next=0;if(current===1&&p>=.225&&p<.495)next=1;if(current===2&&p>=.465)next=2;
 if(rect.top<innerHeight&&target.bottom>96){
  show(next);
  const goal=p>=.72?1:p<.68?0:zoomGoal;
  if(goal!==zoomGoal){zoomFrom=zoomValue;zoomGoal=goal;zoomStarted=performance.now();}
  const elapsed=clamp((performance.now()-zoomStarted)/380);
  zoomValue=zoomFrom+(zoomGoal-zoomFrom)*(1-Math.pow(1-elapsed,3));
  morph(zoomValue,target);
  if(elapsed<1)schedule();
 }else{clearMorph();zoomGoal=zoomValue=zoomFrom=0;}
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
const staticStages=document.createElement('div');staticStages.className='overview-static-stages';
for(const stage of stages.slice(1)){const article=document.createElement('article');article.className='overview-static-stage';const img=document.createElement('img');img.src=base+stage.file+'.jpg?v=9';img.alt=stage.alt;img.width=800;img.height=450;const h=document.createElement('h3');h.textContent=stage.title;const p=document.createElement('p');p.textContent=stage.description;article.append(img,h,p);staticStages.append(article);}root.append(staticStages);
toggle.addEventListener('click',()=>{paused=!paused;sync();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.01}).observe(pin);
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{clearMorph();schedule();},{passive:true});
document.addEventListener('visibilitychange',sync);
reduced.addEventListener('change',()=>{paused=reduced.matches;sync();schedule();});compact.addEventListener('change',()=>{sync();schedule();});
if('requestIdleCallback' in window)requestIdleCallback(prepareWall,{timeout:1500});else setTimeout(prepareWall,500);
show(0);schedule();

})();
