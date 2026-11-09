(() => {
  const config = { mode: 'campaign', unit: 'degree', difficulty: 'pilot' };
  const launch = document.querySelector('#campaign-link');
  const routeStops = [...document.querySelectorAll('[data-route-stage]')];
  const renderRoute = () => {
    let unlockedThrough = 0;
    try { unlockedThrough = Math.max(0, Math.min(3, Number(localStorage.getItem('orbit-defender-route-unlocked')) || 0)); } catch (_) {}
    routeStops.forEach((stop, index) => {
      const unlocked = index <= unlockedThrough;
      stop.classList.toggle('locked', !unlocked);
      stop.classList.toggle('current', index === unlockedThrough);
      stop.setAttribute('aria-label', `${index === 3 ? 'บอส' : `ด่าน ${index + 1}`} ${unlocked ? (index === unlockedThrough ? 'ด่านปัจจุบัน ปลดล็อกแล้ว' : 'ปลดล็อกแล้ว') : 'ล็อกอยู่'}`);
    });
  };
  renderRoute();
  const sync = () => {
    const query = new URLSearchParams({ unit: config.unit, difficulty: config.difficulty });
    launch.href = `game.html?mode=${config.mode}&${query}`;
    document.querySelector('#launch-label').textContent = config.mode === 'academy' ? 'START ACADEMY TRAINING' : 'LAUNCH CAMPAIGN';
    document.querySelector('.launch-panel').dataset.mode = config.mode;
  };

  document.querySelectorAll('.mode-tab').forEach(button => button.addEventListener('click', () => {
    config.mode = button.dataset.mode;
    document.querySelectorAll('.mode-tab').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    sync();
  }));

  document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    config[button.dataset.group] = button.dataset.value;
    document.querySelectorAll(`[data-group="${button.dataset.group}"]`).forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    sync();
  }));

  document.querySelector('.academy-quick').addEventListener('click', () => {
    document.querySelector('.mode-tab[data-mode="academy"]').click();
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key.toLowerCase() === 'o') {
      const options = document.querySelector('.options-menu');
      options.open = !options.open;
    } else if (event.key.toLowerCase() === 'm') {
      document.querySelector(`.mode-tab[data-mode="${config.mode === 'campaign' ? 'academy' : 'campaign'}"]`).click();
    } else if (event.key === 'Enter' && !['A', 'BUTTON', 'SUMMARY'].includes(document.activeElement.tagName)) {
      launch.click();
    }
  });

  sync();
})();
