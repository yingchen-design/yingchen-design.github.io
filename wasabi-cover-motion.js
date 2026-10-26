(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const covers = [...document.querySelectorAll('[data-wasabi-motion]')];
  const states = covers.map(cover => {
    const video = cover.querySelector('video');
    const trigger = cover.closest('a') || cover;
    let hovered = false, focused = false, visible = true;
    function update() {
      const active = (hovered || focused) && visible && !reduced.matches && !document.hidden;
      if (active) {
        video.play().then(() => {if (!video.paused) cover.classList.add('motion-playing');}).catch(() => {});
      } else {video.pause();cover.classList.remove('motion-playing');}
    }
    trigger.addEventListener('pointerenter', e => {if(e.pointerType === 'mouse'){hovered=true;update();}});
    trigger.addEventListener('pointerleave', () => {hovered=false;update();});
    trigger.addEventListener('focusin', () => {focused=true;update();});
    trigger.addEventListener('focusout', e => {if(!trigger.contains(e.relatedTarget)){focused=false;update();}});
    video.addEventListener('error',()=>{cover.classList.remove('motion-playing');});
    const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();});
    observer.observe(cover);
    return update;
  });
  reduced.addEventListener('change',()=>states.forEach(update=>update()));
  document.addEventListener('visibilitychange',()=>states.forEach(update=>update()));
})();
