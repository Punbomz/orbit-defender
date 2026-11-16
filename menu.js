(() => {
  const config = { mode: 'campaign', level: 1, unit: 'degree', difficulty: 'pilot' };
  const launch = document.querySelector('#campaign-link');
  const flightSetup = document.querySelector('#flight-setup-modal');
  const menuSoundToggle = document.querySelector('#menu-sound-toggle');
  let selectedSound = false;
  const routeStops = [...document.querySelectorAll('[data-route-stage]')];
  const getUnlockedThrough = () => {
    try { return Math.max(0, Math.min(3, Number(localStorage.getItem('orbit-defender-route-unlocked')) || 0)); }
    catch (_) { return 0; }
  };
  const isEndlessUnlocked = () => { try { return localStorage.getItem('orbit-defender-endless-unlocked') === 'true'; } catch (_) { return false; } };
  const renderRoute = () => {
    const unlockedThrough = getUnlockedThrough();
    const selectingPractice = config.mode === 'practice';
    const dailyMode = config.mode === 'daily';
    document.querySelector('.menu-shell').classList.toggle('practice-mode', selectingPractice || dailyMode);
    routeStops.forEach((stop, index) => {
      const unlocked = index <= unlockedThrough;
      const canSelect = selectingPractice && unlocked;
      stop.classList.toggle('locked', !unlocked);
      stop.classList.toggle('current', selectingPractice || dailyMode ? (selectingPractice ? canSelect : unlocked && index === getUnlockedThrough()) && config.level === index + 1 : index === unlockedThrough);
      stop.classList.toggle('practice-selected', (canSelect || dailyMode && unlocked) && config.level === index + 1);
      stop.tabIndex = canSelect ? 0 : -1;
      stop.setAttribute('role', canSelect ? 'button' : 'img');
      stop.setAttribute('aria-disabled', String(!canSelect));
      stop.setAttribute('aria-label', `${stop.dataset.routeName || (index === 3 ? 'บอส' : `ด่าน ${index + 1}`)} · ${selectingPractice ? (!unlocked ? 'ล็อกอยู่ · ไปถึงด่านก่อนหน้าเพื่อปลดล็อก' : (config.level === index + 1 ? 'เลือกสำหรับฝึกแล้ว' : 'เลือกฝึกด่านนี้')) : (unlocked ? (index === unlockedThrough ? 'ด่านสูงสุดที่ปลดล็อก' : 'ปลดล็อกแล้ว') : 'ล็อกอยู่')}`);
    });
  };
  renderRoute();
  const sync = () => {
    const endlessChoice = document.querySelector('[data-value="endless"]');
    const endlessUnlocked = isEndlessUnlocked();
    endlessChoice.disabled = !endlessUnlocked;
    endlessChoice.classList.toggle('locked', !endlessUnlocked);
    endlessChoice.querySelector('small').textContent = endlessUnlocked ? 'เอาตัวรอด · ศัตรูเพิ่มความยากต่อเนื่อง' : 'ปลดล็อกเมื่อชนะบอส';
    const dailyMode = config.mode === 'daily';
    const gameMode = dailyMode ? 'practice' : config.mode;
    if (dailyMode) config.level = getUnlockedThrough() + 1;
    const query = new URLSearchParams({ mode: gameMode, unit: config.unit, difficulty: config.difficulty });
    if (gameMode === 'practice') query.set('level', String(config.level));
    if (dailyMode) {
      const today = new Date();
      query.set('daily', `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    }
    query.set('maxLevel', String(getUnlockedThrough() + 1));
    query.set('music', String(savedSettings.musicVolume));
    query.set('effects', String(savedSettings.effectsVolume));
    query.set('voice', String(savedSettings.voiceVolume));
    query.set('reduceMotion', String(Boolean(savedSettings.reduceMotion)));
    launch.href = `game.html?${query}`;
    document.querySelector('#launch-mode-label').textContent = dailyMode ? `DAILY CHALLENGE · LEVEL ${String(config.level).padStart(2, '0')}` : config.mode === 'practice' ? `PRACTICE · LEVEL ${String(config.level).padStart(2, '0')}` : config.mode === 'endless' ? 'ENDLESS SURVIVAL' : 'STORY CAMPAIGN';
    document.querySelector('#launch-label').textContent = dailyMode ? 'START DAILY CHALLENGE' : config.mode === 'practice' ? 'START PRACTICE' : config.mode === 'endless' ? 'START ENDLESS' : 'START MISSION';
    document.querySelector('#route-context').textContent = dailyMode ? `DAILY FLIGHT · LEVEL ${String(config.level).padStart(2, '0')}` : config.mode === 'practice' ? `PRACTICE FLIGHT · LEVEL ${String(config.level).padStart(2, '0')}` : config.mode === 'endless' ? 'ENDLESS SURVIVAL · INFINITE WAVES' : 'HELIOS SYSTEM · ROUTE 01';
    document.querySelector('#route-help').textContent = dailyMode ? 'ภารกิจวันนี้ใช้ด่านสูงสุดที่ปลดล็อก · ผลการเล่นไม่บันทึกทับแคมเปญ' : config.mode === 'practice' ? `เลือก Tutorial และทดลองเล่นได้ถึงด่าน ${String(getUnlockedThrough()+1).padStart(2,'0')} ที่ไปถึงแล้ว` : config.mode === 'endless' ? 'กำจัดศัตรูให้ได้นานที่สุด · ความเร็วและจำนวนศัตรูเพิ่มขึ้นทุกเวฟ' : 'เส้นทางความคืบหน้า · ด่านที่ยังล็อกจะแสดงเป็นเงาดำ';
  };

  document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    config[button.dataset.group] = button.dataset.value;
    if (button.dataset.group === 'mode') {
      config.level = button.dataset.value === 'daily' ? getUnlockedThrough() + 1 : Math.min(config.level, getUnlockedThrough() + 1);
      renderRoute();
    }
    document.querySelectorAll(`[data-group="${button.dataset.group}"]`).forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    sync();
    updateMenuMusic();
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
      updateMenuMusic();
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

  const leaderboardDialog = document.getElementById('leaderboard-dialog');
  const mockPilots = [
    { name: 'NOVA · STARFALL ACE', score: 128450 },
    { name: 'NOX · NULL ARMADA', score: 112700 },
    { name: 'ASTRA · NAVIGATION AI', score: 98750 },
    { name: 'CAPTAIN LYRA · HELIOS', score: 86300 },
    { name: 'KAI · MIRROR SQUADRON', score: 72400 },
    { name: 'COMMANDER REN · OUTER RIM', score: 68120 },
    { name: 'MIRA · STARFALL WING', score: 59300 },
    { name: 'JUNO · ORBITAL GUARD', score: 51750 },
    { name: 'TAL · HELIOS SCOUT', score: 43800 },
    { name: 'VESPER · DEEP SPACE', score: 36120 }
  ];
  document.getElementById('leaderboard-open').addEventListener('click', () => {
    let personalBest = 0;
    try { personalBest = Number(localStorage.getItem('orbit-defender-endless-best')) || 0; } catch (_) {}
    document.getElementById('personal-best-score').textContent = personalBest.toLocaleString();
    const entries = [...mockPilots, ...(personalBest ? [{ name: 'YOU · DEGREE DEFENDER', score: personalBest, personal: true }] : [])]
      .sort((a, b) => b.score - a.score).slice(0, 10);
    const medalAssets = ['hall-medal-gold.png', 'hall-medal-silver.png', 'hall-medal-bronze.png'];
    document.getElementById('leaderboard-podium').innerHTML = entries.slice(0, 3).map((entry, index) => `<article class="podium-entry medal-${index + 1}${entry.personal ? ' personal-entry' : ''}" aria-label="อันดับ ${index + 1} ${entry.name} ${entry.score.toLocaleString()} คะแนน"><img class="podium-medal" src="assets/${medalAssets[index]}" alt="เหรียญอันดับ ${index + 1}"><small>อันดับ ${index + 1}</small><b>${entry.name}</b><strong>${entry.score.toLocaleString()}</strong></article>`).join('');
    document.getElementById('leaderboard-list').innerHTML = entries.slice(3).map((entry, index) => `<li class="${entry.personal ? 'personal-entry' : ''}"><span class="leader-rank">${String(index + 4).padStart(2, '0')}</span><b>${entry.name}</b><strong>${entry.score.toLocaleString()}</strong></li>`).join('');
    leaderboardDialog.showModal();
  });
  leaderboardDialog.addEventListener('click', event => { if (event.target === leaderboardDialog) leaderboardDialog.close(); });

  const menuMusic = new Audio();
  menuMusic.loop = true;
  menuMusic.preload = 'auto';
  let menuTrack = '';
  function updateMenuMusic() {
    const track = ['practice', 'daily'].includes(config.mode) ? 'levelselect' : 'mainmenu';
    if (track !== menuTrack) { menuTrack = track; menuMusic.src = `Music/${track}.ogg`; }
    menuMusic.volume = Math.max(0, Math.min(1, Number(savedSettings.musicVolume) / 100));
    menuMusic.play().catch(() => {});
  }
  // Carry the live menu audio state into the flight setup prompt before navigation unloads it.
  const checkpointForMenu = () => {
    if (config.mode !== 'campaign') return null;
    try {
      const saved = JSON.parse(localStorage.getItem('orbit-defender-campaign-checkpoint') || 'null');
      return saved && Number.isInteger(saved.level) && saved.level > 1 && saved.level <= 5 ? saved : null;
    } catch (_) { return null; }
  };
  const openFlightSetup = event => {
    event?.preventDefault();
    selectedSound = !menuMusic.paused && !menuMusic.muted && menuMusic.volume > 0;
    menuSoundToggle.setAttribute('aria-pressed', String(selectedSound));
    menuSoundToggle.textContent = selectedSound ? 'เปิดเสียงอยู่' : 'ปิดเสียงอยู่';
    const checkpoint = config.mode === 'campaign' ? checkpointForMenu() : null;
    document.querySelector('#menu-resume-options').hidden = !checkpoint;
    document.querySelector('#menu-launch-session').hidden = Boolean(checkpoint);
    if (checkpoint) {
      document.querySelector('#flight-setup-title').textContent = 'จะเล่นต่อหรือเริ่มใหม่?';
      document.querySelector('#flight-setup-copy').textContent = `พบความคืบหน้าที่เลเวล ${checkpoint.level} เลือกเล่นต่อจากเลเวลนี้หรือเริ่มแคมเปญใหม่`;
      document.querySelector('#menu-resume').textContent = `เล่นต่อ · เลเวล ${String(checkpoint.level).padStart(2, '0')}`;
    } else {
      document.querySelector('#flight-setup-title').textContent = 'เตรียมออกเดินทาง';
      document.querySelector('#flight-setup-copy').textContent = 'เลือกการตั้งค่าเสียงก่อนเริ่มภารกิจ';
    }
    flightSetup.showModal();
  };
  launch.addEventListener('click', openFlightSetup);
  document.querySelector('#flight-setup-close').addEventListener('click', () => flightSetup.close());
  menuSoundToggle.addEventListener('click', () => {
    selectedSound = !selectedSound;
    menuSoundToggle.setAttribute('aria-pressed', String(selectedSound));
    menuSoundToggle.textContent = selectedSound ? 'เปิดเสียงอยู่' : 'ปิดเสียงอยู่';
    if (selectedSound) updateMenuMusic(); else menuMusic.pause();
  });
  const launchFlight = resume => {
    const url = new URL(launch.href, location.href);
    url.searchParams.set('sound', selectedSound ? 'on' : 'off');
    url.searchParams.set('autoLaunch', '1');
    url.searchParams.set('resume', resume ? '1' : '0');
    location.href = url.href;
  };
  document.querySelector('#menu-launch-session').addEventListener('click', () => launchFlight(false));
  document.querySelector('#menu-resume').addEventListener('click', () => launchFlight(true));
  document.querySelector('#menu-restart').addEventListener('click', () => launchFlight(false));
  document.addEventListener('pointerdown', updateMenuMusic, { once: true });
  document.addEventListener('keydown', updateMenuMusic, { once: true });
  sync();
  updateMenuMusic();
})();
