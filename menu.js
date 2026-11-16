(() => {
  const config = { mode: 'campaign', level: 1, unit: 'degree', difficulty: 'pilot' };
  const launch = document.querySelector('#campaign-link');
  const routeStops = [...document.querySelectorAll('[data-route-stage]')];
  const getUnlockedThrough = () => {
    try { return Math.max(0, Math.min(4, Number(localStorage.getItem('orbit-defender-route-unlocked')) || 0)); }
    catch (_) { return 0; }
  };
  const renderRoute = () => {
    const unlockedThrough = getUnlockedThrough();
    document.querySelector('.menu-shell').classList.toggle('practice-mode', config.mode === 'practice');
    routeStops.forEach((stop, index) => {
      const unlocked = index <= unlockedThrough;
      const canSelect = config.mode === 'practice' && unlocked;
      stop.classList.toggle('locked', !unlocked);
      stop.classList.toggle('current', config.mode === 'practice' ? canSelect && config.level === index + 1 : index === unlockedThrough);
      stop.classList.toggle('practice-selected', canSelect && config.level === index + 1);
      stop.tabIndex = canSelect ? 0 : -1;
      stop.setAttribute('role', canSelect ? 'button' : 'img');
      stop.setAttribute('aria-disabled', String(!canSelect));
      stop.setAttribute('aria-label', `${stop.dataset.routeName || (index === 4 ? 'บอส' : `ด่าน ${index + 1}`)} · ${config.mode === 'practice' ? (!unlocked ? 'ล็อกอยู่ · ไปถึงด่านก่อนหน้าเพื่อปลดล็อก' : (config.level === index + 1 ? 'เลือกสำหรับฝึกแล้ว' : 'เลือกฝึกด่านนี้')) : (unlocked ? (index === unlockedThrough ? 'ด่านสูงสุดที่ปลดล็อก' : 'ปลดล็อกแล้ว') : 'ล็อกอยู่')}`);
    });
  };
  renderRoute();
  const sync = () => {
    const query = new URLSearchParams({ mode: config.mode, unit: config.unit, difficulty: config.difficulty });
    if (config.mode === 'practice') query.set('level', String(config.level));
    query.set('maxLevel', String(getUnlockedThrough() + 1));
    query.set('music', String(savedSettings.musicVolume));
    query.set('effects', String(savedSettings.effectsVolume));
    query.set('voice', String(savedSettings.voiceVolume));
    query.set('reduceMotion', String(Boolean(savedSettings.reduceMotion)));
    launch.href = `game.html?${query}`;
    document.querySelector('#launch-mode-label').textContent = config.mode === 'practice' ? `PRACTICE · LEVEL ${String(config.level).padStart(2, '0')}` : 'STORY CAMPAIGN';
    document.querySelector('#launch-label').textContent = config.mode === 'practice' ? 'START PRACTICE' : 'START MISSION';
    document.querySelector('#route-context').textContent = config.mode === 'practice' ? `PRACTICE FLIGHT · LEVEL ${String(config.level).padStart(2, '0')}` : 'HELIOS SYSTEM · ROUTE 01';
    document.querySelector('#route-help').textContent = config.mode === 'practice' ? `เลือก Tutorial และทดลองเล่นได้ถึงด่าน ${String(getUnlockedThrough()+1).padStart(2,'0')} ที่ไปถึงแล้ว` : 'เส้นทางความคืบหน้า · ด่านที่ยังล็อกจะแสดงเป็นเงาดำ';
  };

  document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    config[button.dataset.group] = button.dataset.value;
    if (button.dataset.group === 'mode') {
      config.level = Math.min(config.level, getUnlockedThrough() + 1);
      renderRoute();
    }
    document.querySelectorAll(`[data-group="${button.dataset.group}"]`).forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    sync();
  }));

  routeStops.forEach((stop, index) => {
    const choose = () => {
      if (config.mode !== 'practice' || index > getUnlockedThrough()) return;
      config.level = index + 1;
      renderRoute();
      sync();
    };
    stop.addEventListener('click', choose);
    stop.addEventListener('keydown', event => {
      if (config.mode === 'practice' && index <= getUnlockedThrough() && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); choose(); }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter' && !['A', 'BUTTON', 'SUMMARY'].includes(document.activeElement.tagName)) launch.click();
  });

  const settingsKey = 'orbit-defender-settings';
  const defaults = { musicVolume: 45, effectsVolume: 70, voiceVolume: 80, reduceMotion: false };
  let savedSettings = { ...defaults };
  try { savedSettings = { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || '{}') }; } catch (_) {}
  const persistSettings = () => { try { localStorage.setItem(settingsKey, JSON.stringify(savedSettings)); } catch (_) {} };
  [['music-volume','musicVolume'],['effects-volume','effectsVolume'],['voice-volume','voiceVolume']].forEach(([id,key]) => {
    const slider = document.getElementById(id), output = document.getElementById(`${id}-value`);
    slider.value = Math.max(0, Math.min(100, Number(savedSettings[key]) || 0));
    output.value = `${slider.value}%`;
    output.textContent = `${slider.value}%`;
    slider.addEventListener('input', () => {
      savedSettings[key] = Number(slider.value);
      output.value = `${slider.value}%`;
      output.textContent = `${slider.value}%`;
      persistSettings();
      sync();
    });
  });
  const motionToggle = document.getElementById('reduce-motion');
  motionToggle.checked = Boolean(savedSettings.reduceMotion);
  document.documentElement.classList.toggle('reduce-motion', motionToggle.checked);
  motionToggle.addEventListener('change', () => {
    savedSettings.reduceMotion = motionToggle.checked;
    document.documentElement.classList.toggle('reduce-motion', motionToggle.checked);
    persistSettings();
    sync();
  });
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  const syncFullscreenButton = () => { fullscreenButton.innerHTML = document.fullscreenElement ? '<span>⛶</span> ออกจากเต็มจอ' : '<span>⛶</span> เต็มจอ'; };
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) { fullscreenButton.title = 'เบราว์เซอร์นี้ไม่อนุญาตให้เปิดโหมดเต็มจอ'; }
    syncFullscreenButton();
  });
  document.addEventListener('fullscreenchange', syncFullscreenButton);

  sync();
})();
