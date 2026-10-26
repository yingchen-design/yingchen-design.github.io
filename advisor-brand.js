(() => {
  const showcase = document.querySelector('.advisor-brand-showcase');
  if (!showcase) return;
  const button = showcase.querySelector('.brand-motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  function update() {
    showcase.classList.toggle('is-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Play motion' : 'Pause motion';
  }
  button.addEventListener('click', () => { paused = !paused; update(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; update(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      showcase.classList.toggle('is-offscreen', !entry.isIntersecting);
    }).observe(showcase);
  }
  // Each repeated sequence must cover the viewport even at the loop boundary.
  const viewport = showcase.querySelector('.advisor-brand-window');
  const tracks = [...showcase.querySelectorAll('.advisor-brand-track')].map(track => ({
    track,
    cards: [...track.querySelector('.advisor-brand-group').children].map(card => card.cloneNode(true))
  }));
  function buildLoops() {
    tracks.forEach(({track, cards}) => {
      const group = document.createElement('div');
      group.className = 'advisor-brand-group';
      cards.forEach(card => group.append(card.cloneNode(true)));
      track.replaceChildren(group);
      const unitHeight = group.offsetHeight;
      if (!unitHeight) return;
      const copies = Math.max(1, Math.ceil((viewport.clientHeight + 400) / unitHeight));
      for (let i = 1; i < copies; i++) {
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.querySelector('img').alt = '';
          group.append(clone);
        });
      }
      const distance = group.offsetHeight;
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.querySelectorAll('img').forEach(img => { img.alt = ''; });
      track.append(duplicate);
      track.style.setProperty('--brand-distance', `${-distance}px`);
      // Equal pixels per second, regardless of the sequence length.
      track.style.setProperty('--brand-duration', `${distance / 20}s`);
    });
  }
  buildLoops();
  if ('ResizeObserver' in window) new ResizeObserver(buildLoops).observe(viewport);
  else window.addEventListener('resize', buildLoops);
  update();
})();
