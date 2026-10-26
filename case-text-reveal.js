/* One-time text entrances. Reading order and complete text stay intact. */
(()=>{
 const release=()=>document.documentElement.classList.remove('case-intro-boot');
 if(!document.body.classList.contains('portfolio-case')||!('IntersectionObserver' in window)||!Element.prototype.animate){release();return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches){release();return;}
 const active=new Map();
 const targets=[...document.querySelectorAll('.case-hero h1,.case-statement,.hero-deck>p,.case-brief,.impact-strip,.section-grid')].filter(e=>!e.closest('.overview-lab,[data-ui],details')&&!e.querySelector('.overview-lab')&&e.textContent.trim());
 const show=e=>{
  if(!e.hasAttribute('data-text-pending'))return;
  e.removeAttribute('data-text-pending');
  const hero=!!e.closest('.case-hero');
  const delay=hero?(e.matches('h1')?0:e.matches('.case-statement')?90:170):0;
  const a=e.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:hero?840:760,delay,easing:'cubic-bezier(.2,0,.2,1)',fill:'backwards'});
  active.set(e,a);a.onfinish=()=>active.delete(e);a.oncancel=()=>active.delete(e);
 };
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);show(entry.target)}},{threshold:0,rootMargin:'0px 0px -28px 0px'});
 for(const e of targets){e.setAttribute('data-text-pending','');observer.observe(e);}
 release();
 const finish=()=>{observer.disconnect();for(const e of targets)e.removeAttribute('data-text-pending');for(const a of active.values())a.cancel();active.clear();};
 document.addEventListener('focusin',event=>{const e=event.target.closest('[data-text-pending]');if(e){observer.unobserve(e);e.removeAttribute('data-text-pending');}for(const [node,a]of active)if(node.contains(event.target))a.finish();});
 reduced.addEventListener('change',event=>{if(event.matches)finish()});
 addEventListener('beforeprint',finish);
 // Fail open if an unexpected runtime error interrupts initialization.
 addEventListener('pagehide',finish,{once:true});
})();
