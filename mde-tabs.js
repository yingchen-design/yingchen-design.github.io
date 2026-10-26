// Separate tab groups keep the topic and interface-step selections independent.
document.querySelectorAll('[data-moon-tabs]').forEach(group => {
  const list = group.querySelector(':scope > [role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0, End: tabs.length - 1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next], true);
    });
  });
});
