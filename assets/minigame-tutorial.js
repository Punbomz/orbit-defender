(() => {
  'use strict';
  const setup = () => {
    const path = location.pathname.toLowerCase();
    const mergeTarget = Number(document.body.dataset.trigoGoal) || 30;
    const mergeUnit = document.body.dataset.trigoUnit === 'radian' ? 'radian' : 'degree';
    const mergeLimit = Number(document.body.dataset.trigoMoveLimit) || 2;
    const mergeLabels = {15: ['15°', 'π/12'], 30: ['30°', 'π/6'], 60: ['60°', 'π/3'], 120: ['120°', '2π/3'], 240: ['240°', '4π/3']};
    const mergeAngle = value => mergeLabels[value]?.[mergeUnit === 'radian' ? 1 : 0] || `${value}°`;
    const mergeSteps = [15, 30, 60, 120, 240].slice(0, [15, 30, 60, 120, 240].indexOf(mergeTarget)).map(value => `<div class="minigame-demo-row"><span class="minigame-demo-chip">${mergeAngle(value)} + ${mergeAngle(value)}</span><span>➜</span><span class="minigame-demo-chip answer">${mergeAngle(value * 2)}</span></div>`).join('');
    const mergeDemo = `<div class="minigame-demo-console"><div class="minigame-demo-title">ไทล์มุมเท่ากันบวกกัน</div>${mergeSteps}<div class="minigame-demo-title">เป้าหมาย ${mergeAngle(mergeTarget)} · ไม่เกิน ${mergeLimit} moves</div></div>`;
    const config = path.includes('trigo_combat')
      ? { target: '#screen-tutorial', title: 'วงโคจรสกัดกั้น', copy: '#tutorialCopy', action: '#tutorialNext', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">ยานลาดตระเวนเข้ามาใกล้!</div><div class="minigame-demo-row"><span class="minigame-demo-chip">sin 30° = ?</span><span>➜</span><span class="minigame-demo-chip answer">1/2</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">เลือกคำตอบ</span><span class="minigame-demo-chip">ยิงสกัด</span></div></div>' }
      : path.includes('wiring')
      ? { target: '#wiringTutorial', title: 'เชื่อมต่อสายพลังงาน', copy: '.astra-line', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">จับคู่โจทย์กับคำตอบ</div><div class="minigame-demo-row"><span class="minigame-demo-chip">sin 30°</span><span>〰➜</span><span class="minigame-demo-chip answer">1/2</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">(cos 30°, sin 30°)</span><span>〰➜</span><span class="minigame-demo-chip answer">(√3/2, 1/2)</span></div></div>' }
      : path.includes('radar.html')
      ? { target: '#intro', title: 'ซ่อมเรดาร์พิกัด', copy: '#introStory', fallback: 'Null Armada รบกวนเรดาร์ของ STARFALL ลากจุดไปยังตำแหน่งเป้าหมายโดยใช้พิกัด X และ Y เพื่อค้นหาตำแหน่งให้ถูกต้อง', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">ลากจุดไปยังตำแหน่งเป้าหมาย</div><div class="minigame-demo-orbit"></div><div class="minigame-demo-row"><span class="minigame-demo-chip">X = +6 km</span><span class="minigame-demo-chip answer">Y = +6 km</span></div></div>' }
      : path.includes('matching.html')
      ? { target: '#briefing', title: 'จับคู่ข้อมูลนำทาง', copy: '#briefText', action: '#begin', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">เปิดการ์ดเพื่อหาคู่ที่ตรงกัน</div><div class="minigame-demo-grid"><span>sin 30°</span><span>?</span><span>?</span><span>?</span><span>?</span><span>1/2</span><span>?</span><span>?</span></div></div>' }
      : path.includes('trigo_merge.html')
      ? { target: '#intro', title: 'Trigo Merge · กู้คืนข้อมูลมุม', copy: '#introText', action: '#start', demo: mergeDemo }
      : path.includes('light_path.html')
      ? { target: '#intro', title: 'Light Path · ปรับแนวลำแสง', copy: '#introText', action: '#start', demo: '<div class="minigame-demo-console lp-demo"><div class="minigame-demo-title">ตัวอย่าง · Reflector A</div><div class="lp-demo-layout"><div class="lp-orbit"><svg viewBox="0 0 180 180" role="img" aria-label="ลำแสงหมุนจาก 0 องศาขึ้นไปที่ 90 องศา"><circle class="lp-orbit-ring" cx="90" cy="90" r="66"/><path class="lp-axis" d="M16 90H164M90 16V164"/><path class="lp-ray" d="M90 90H156"/><circle class="lp-origin" cx="90" cy="90" r="4"/><circle class="lp-handle" cx="156" cy="90" r="7"/><text x="96" y="25">y</text><text x="157" y="104">x</text></svg><span class="lp-angle-chip">90°</span></div><div class="lp-demo-instructions"><div class="lp-target"><small>โจทย์</small><strong>sin θ = 1</strong></div><div class="lp-step"><b>1</b><span>ลากจุดแสงขึ้นไปที่ <strong>90°</strong></span></div><div class="lp-step"><b>2</b><span>กดปุ่ม <strong>ล็อกองศา</strong></span></div></div></div><div class="lp-route"><span class="lp-node active">A</span><i></i><span class="lp-node">B</span><i></i><span class="lp-node">C</span><b>แสงวิ่งต่อ · สถานีถัดไปเปิดทีละจุด</b></div></div>' }
      : { target: '#intro', title: 'ปรับแนวดาวเทียม', copy: '#introText', fallback: 'อ่านพิกัด X และ Y ที่ได้รับ แล้วเลือกมุมที่ตรงกันเพื่อปรับแนวดาวเทียมกลับเข้าสู่วงโคจร', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">อ่านพิกัด แล้วเลือกมุม</div><div class="minigame-demo-row"><span class="minigame-demo-chip">(X, Y)</span><span class="minigame-demo-chip answer">(√3/2, 1/2)</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">30°</span><span class="minigame-demo-chip">45°</span><span class="minigame-demo-chip answer">30° ✓</span></div></div>' };
    const target = document.querySelector(config.target);
    if (!target || document.querySelector('.minigame-tutorial-shell')) return;
    const show = () => {
    if (document.querySelector('.minigame-tutorial-shell')) return;
    let copy = target.querySelector(config.copy)?.textContent?.trim() || config.fallback || 'ทำตามคำแนะนำของ ASTRA เพื่อกู้คืนเส้นทาง';
    if (path.includes('trigo_combat')) copy = `ASTRA: ${copy}`;
    const shell = document.createElement('section'); shell.className = 'minigame-tutorial-shell'; if (path.includes('trigo_merge.html')) shell.classList.add('trigo-merge-tutorial'); if (path.includes('light_path.html')) shell.classList.add('light-path-tutorial'); shell.setAttribute('role','dialog'); shell.setAttribute('aria-modal','true');
    shell.dataset.level = new URLSearchParams(location.search).get('level') || '1';
    shell.innerHTML = `<header class="minigame-tutorial-heading"><small>STARFALL ROUTE · MINIGAME TUTORIAL</small><h1>${config.title}</h1><b>ASTRA TRAINING · MINIGAME INSTRUCTIONS</b></header><div class="minigame-tutorial-astra" role="img" aria-label="ASTRA ผู้ช่วยประจำยาน"></div><article class="minigame-tutorial-dialog"><div class="minigame-tutorial-dialog-head"><small>ASTRA · FLIGHT INSTRUCTOR</small><b></b></div><p></p><div class="minigame-tutorial-controls"><button class="minigame-tutorial-prev" type="button" disabled>← ก่อนหน้า</button><button class="minigame-tutorial-continue" type="button">เริ่มภารกิจ →</button></div></article><section class="minigame-tutorial-example"><small>ตัวอย่างการเล่น</small><div class="minigame-tutorial-demo">${config.demo}</div></section>`;
    shell.querySelector('p').textContent = copy;
    shell.style.setProperty('--minigame-planet', `url("assets/${['planet-helios-outpost.webp','planet-mirror-belt.webp','planet-shattered-meridian.webp'][Math.max(0,Math.min(2,Number(shell.dataset.level)-1))]}")`);
    shell.querySelector('.minigame-tutorial-dialog-head b').textContent = 'คำแนะนำ';
    document.body.append(shell);
    shell.querySelector('.minigame-tutorial-continue').addEventListener('click', () => {
      const original = document.querySelector(config.action);
      if (original) original.click();
      shell.remove();
      if (path.includes('trigo_combat')) requestAnimationFrame(() => { if (target.getClientRects().length && !target.classList.contains('hidden')) show(); });
    });
    };
    const isVisible = () => !!(target.getClientRects().length && getComputedStyle(target).visibility !== 'hidden' && getComputedStyle(target).display !== 'none');
    // These pages use their opening-story element as the tutorial target and
    // its next button as the gameplay action. Wait for the player to finish
    // the story, then show the shared tutorial before allowing that action.
    const storyFirst = path.includes('matching.html') || path.includes('radar.html') || path.includes('satellite_radar.html') || path.includes('trigo_merge.html') || path.includes('light_path.html');
    if (storyFirst) {
      const introNext = document.querySelector(config.action);
      introNext?.addEventListener('click', event => {
        if (document.querySelector('.minigame-tutorial-shell')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        target.hidden = true;
        target.classList.add('hidden');
        target.style.display = 'none';
        document.body.classList.remove('story-locked');
        show();
      }, true);
    } else if (isVisible()) show();
    else { const observer = new MutationObserver(() => { if (isVisible()) { observer.disconnect(); show(); } }); const options={attributes:true,attributeFilter:['class','hidden','aria-hidden','style']}; observer.observe(target, options); if(target.parentElement) observer.observe(target.parentElement, options); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true }); else setup();
})();
