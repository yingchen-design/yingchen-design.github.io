(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const figures = [...document.querySelectorAll('.advisor-animation')];
  function setPlaying(figure, playing) {
    const img = figure.querySelector('img');
    const button = figure.querySelector('button');
    if (button.getAttribute('aria-pressed') === String(playing)) return;
    img.src = playing ? img.dataset.animation : img.dataset.poster;
    button.setAttribute('aria-pressed', String(playing));
    button.textContent = playing ? 'Pause animation' : 'Play animation';
  }
  figures.forEach(figure => {
    figure.querySelector('button').addEventListener('click', () => {
      figure.dataset.manual = 'true';
      setPlaying(figure, figure.querySelector('button').getAttribute('aria-pressed') !== 'true');
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting) {
          setPlaying(target, false);
          delete target.dataset.manual;
        } else if (!reducedMotion.matches && !target.dataset.manual) {
          setPlaying(target, true);
        }
      });
    }, {threshold: 0.15});
    figures.forEach(figure => observer.observe(figure));
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) figures.forEach(figure => setPlaying(figure, false));
  });
})();
