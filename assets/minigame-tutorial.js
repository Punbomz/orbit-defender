(() => {
  'use strict';
  const setup = () => {
    const path = location.pathname.toLowerCase();
    const config = path.includes('trigo_combat')
      ? { target: '#screen-tutorial', title: 'วงโคจรสกัดกั้น', copy: '#tutorialCopy', action: '#tutorialNext', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">ยานลาดตระเวนเข้ามาใกล้!</div><div class="minigame-demo-row"><span class="minigame-demo-chip">sin 30° = ?</span><span>➜</span><span class="minigame-demo-chip answer">1/2</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">เลือกคำตอบ</span><span class="minigame-demo-chip">ยิงสกัด</span></div></div>' }
      : path.includes('wiring')
      ? { target: '#wiringTutorial', title: 'เชื่อมต่อสายพลังงาน', copy: '.astra-line', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">จับคู่โจทย์กับคำตอบ</div><div class="minigame-demo-row"><span class="minigame-demo-chip">sin 30°</span><span>〰➜</span><span class="minigame-demo-chip answer">1/2</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">(cos 30°, sin 30°)</span><span>〰➜</span><span class="minigame-demo-chip answer">(√3/2, 1/2)</span></div></div>' }
      : path.includes('radar.html')
      ? { target: '#intro', title: 'ซ่อมเรดาร์พิกัด', copy: '#introStory', fallback: 'Null Armada รบกวนเรดาร์ของ STARFALL ลากจุดไปยังตำแหน่งเป้าหมายโดยใช้พิกัด X และ Y เพื่อค้นหาตำแหน่งให้ถูกต้อง', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">ลากจุดไปยังตำแหน่งเป้าหมาย</div><div class="minigame-demo-orbit"></div><div class="minigame-demo-row"><span class="minigame-demo-chip">X = +6 km</span><span class="minigame-demo-chip answer">Y = +6 km</span></div></div>' }
      : path.includes('matching.html')
      ? { target: '#briefing', title: 'จับคู่ข้อมูลนำทาง', copy: '#briefText', action: '#begin', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">เปิดการ์ดเพื่อหาคู่ที่ตรงกัน</div><div class="minigame-demo-grid"><span>sin 30°</span><span>?</span><span>?</span><span>?</span><span>?</span><span>1/2</span><span>?</span><span>?</span></div></div>' }
      : { target: '#intro', title: 'ปรับแนวดาวเทียม', copy: '#introText', fallback: 'อ่านพิกัด X และ Y ที่ได้รับ แล้วเลือกมุมที่ตรงกันเพื่อปรับแนวดาวเทียมกลับเข้าสู่วงโคจร', action: '#start', demo: '<div class="minigame-demo-console"><div class="minigame-demo-title">อ่านพิกัด แล้วเลือกมุม</div><div class="minigame-demo-row"><span class="minigame-demo-chip">(X, Y)</span><span class="minigame-demo-chip answer">(√3/2, 1/2)</span></div><div class="minigame-demo-row"><span class="minigame-demo-chip">30°</span><span class="minigame-demo-chip">45°</span><span class="minigame-demo-chip answer">30° ✓</span></div></div>' };
    const target = document.querySelector(config.target);
    if (!target || document.querySelector('.minigame-tutorial-shell')) return;
    const show = () => {
    if (document.querySelector('.minigame-tutorial-shell')) return;
    let copy = target.querySelector(config.copy)?.textContent?.trim() || config.fallback || 'ทำตามคำแนะนำของ ASTRA เพื่อกู้คืนเส้นทาง';
    if (path.includes('trigo_combat')) copy = `ASTRA: ${copy}`;
    const shell = document.createElement('section'); shell.className = 'minigame-tutorial-shell'; shell.setAttribute('role','dialog'); shell.setAttribute('aria-modal','true');
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
    if (isVisible()) show();
    else { const observer = new MutationObserver(() => { if (isVisible()) { observer.disconnect(); show(); } }); const options={attributes:true,attributeFilter:['class','hidden','aria-hidden','style']}; observer.observe(target, options); if(target.parentElement) observer.observe(target.parentElement, options); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true }); else setup();
})();
