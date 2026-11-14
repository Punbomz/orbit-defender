(() => {
  const config = { unit: 'degree', difficulty: 'pilot' };
  const launch = document.querySelector('#campaign-link');
  const routeStops = [...document.querySelectorAll('[data-route-stage]')];
  const renderRoute = () => {
    let unlockedThrough = 0;
    try { unlockedThrough = Math.max(0, Math.min(4, Number(localStorage.getItem('orbit-defender-route-unlocked')) || 0)); } catch (_) {}
    routeStops.forEach((stop, index) => {
      const unlocked = index <= unlockedThrough;
      stop.classList.toggle('locked', !unlocked);
      stop.classList.toggle('current', index === unlockedThrough);
      stop.setAttribute('aria-label', `${stop.dataset.routeName || (index === 4 ? 'บอส' : `ด่าน ${index + 1}`)} · ${unlocked ? (index === unlockedThrough ? 'ด่านปัจจุบัน ปลดล็อกแล้ว' : 'ปลดล็อกแล้ว') : 'ล็อกอยู่'}`);
    });
  };
  renderRoute();
  const sync = () => {
    const query = new URLSearchParams({ mode: 'campaign', unit: config.unit, difficulty: config.difficulty });
    launch.href = `game.html?${query}`;
    document.querySelector('#launch-label').textContent = 'START MISSION';
  };

  document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    config[button.dataset.group] = button.dataset.value;
    document.querySelectorAll(`[data-group="${button.dataset.group}"]`).forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    sync();
  }));

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter' && !['A', 'BUTTON', 'SUMMARY'].includes(document.activeElement.tagName)) launch.click();
  });

  sync();
})();
