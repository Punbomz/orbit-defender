# Orbit Defender project guide

Read this file before changing the project. Keep it updated when core gameplay contracts, storage keys, or page boundaries change.

## Project shape

- This is a static browser game. It uses HTML, CSS, vanilla JavaScript, Canvas, and local assets; there is no build step or package manager.
- `index.html`, `menu.css`, `menu.js`: launch menu and campaign route display. Keep the original menu controls and visual theme; place the console frame around the planet route only, keep unit/difficulty/launch/options controls outside it, and render locked planets as black silhouettes. Each route stage gets its own replaceable art and level label.
- `game.html`, `style.css`, `game.js`: campaign, tutorials, orbital combat, HUD, and minigame host iframe.
- `trigozombie.html`, `wiring.html`, `radar.html`: standalone minigames and iframe child pages.
- `assets/`: game art and audio-related visuals. The menu route uses one standalone transparent WebP planet per level (`planet-helios-outpost.webp`, `planet-mirror-belt.webp`, `planet-shattered-meridian.webp`, `planet-special-angle.webp`, `planet-degree-overlord.webp`); keep each image replaceable without changing route structure.
- `README.md`: player-facing overview. `AGENTS.md` is the working reference for future code changes.

## Intended campaign loop

Campaign order is Level 1 (Q1 basics) → Level 2 (Q2 reflection) → Level 3 (Q3 and Q4 coordinates) → Level 4 (special angles) → final boss.

Each regular level follows: level briefing/tutorial → defend the circular planet through three waves → play one randomly selected available minigame → proceed to the next level. Keep the minigame selection list extensible as more minigames are added.

Regular wave quotas are 8, 12, and 16 enemies (36 per level). Each later wave introduces an additional enemy type and raises its starting speed; enemies accelerate during a wave. The wave transition resets speed for the new wave while raising its starting baseline. Do not advance a level until its required wave enemies are cleared.

Enemy prompt intent: `angle-seeker` shows both x and y and asks for θ; `x-seeker` asks for x; `y-seeker` asks for y. Enemy kinds differ only by question and distinct sprite art; keep movement, speed rules, health, and collision behavior shared. Preserve `x = cos θ`, `y = sin θ`, including signs and reflected angles. Avoid random camera jitter or per-kind position changes that can make enemies appear to blink.

Weapon buttons are always ordered into fixed Quadrant I, II, III, IV, and Axes sections; do not shuffle them. The game has no Academy/teaching launch mode and no Space, 1–9, Shift, E, or H gameplay shortcuts. By default, fire at the nearest enemy automatically. Clicking an enemy or its question label is optional and locks another target until it is defeated or passes the defense line; explain this in the UI. Shields drop randomly when enemies are defeated, are collected at the core, and can be stored up to three; each charge automatically blocks one incoming hit. Show the shield meter in the top HUD. The final boss combines the learned angle and coordinate concepts. Boss HP is represented by nine successful weakpoint hits over three phases. The phases include unit-circle defense, combo-based energy reload, and synthesis across the learned content. Victory requires reducing boss HP to zero.

Cadet, Pilot, and Ace must remain distinct in enemy speed, player durability, firing cadence/charge recovery, and repeat-miss hint thresholds. Hints are tracked per queried trig value and appear only after the configured number of mistakes (currently 1, 3, and 5). The right telemetry sidebar, Unit Circle Reference panel, Learning Goal panel, and bottom control/status bar are intentionally absent. The Unit Circle Reference panel is intentionally removed from the gameplay HUD. Do not add it back unless requested. Do not show numeric angle labels around the gameplay orbit.

## Tutorial and speaking dialog

- Every level briefing is editable separately. Persist edits under `orbit-defender-tutorials` as a JSON object keyed by zero-based level index.
- Briefings should remain data-driven so lesson text and images can be revised without changing combat logic.
- Speaking dialog currently uses browser `speechSynthesis`; preserve graceful behavior where speech is unavailable.
- Keep the visual treatment as a mockup/placeholders that can accept real images later.

## Minigame page contract

- The host selects from the `miniGames` list in `game.js` and loads a separate page in `#zombie-game`.
- The available list currently includes Trigo Zombie, Wiring, and Radar. Wiring shows a scenario and instructions before play, then draws five mixed question types from a randomized pool for the completed level's content. Players connect all five cables before checking; the System Restore tube reports each wire result in its own segment. Radar asks players to drag five targets using distance and angle with live X/Y/r guide readouts; each target has a 30-second timer, and expired targets count as misses. The host allows 210 seconds for the five-target Radar run. It includes a basic arithmetic calculator and per-target X/Y scratch fields, while players recall sine and cosine values themselves. Lesson angles follow the completed level's content and unit.
- Pass `autostart=1`, one-based `level`, `unit`, and a level `content` identifier in the child page URL. The child must use these values to choose relevant lesson material.
- When a minigame ends, the child posts `{ type: 'orbit-minigame-result', success, score, level, quizAccuracy }` to its parent. The host validates the iframe window source before accepting the message.
- A run is currently considered successful when the player gets at least one kill and at least 70% quiz accuracy. Save unsuccessful runs too; a timeout is a failed result.
- Keep the host responsible for moving to the next level and recording results.

## Browser storage

- `orbit-defender-runs`: recent completed run records.
- `orbit-defender-last-run`: most recently completed run, used by the result summary.
- `orbit-defender-minigames`: outcomes for each minigame played in the current campaign.
- `orbit-defender-minigame-current`: current/last iframe session state, including timeout handling.
- `orbit-defender-route-unlocked`: highest campaign route stage reached; this is separate from run records.
- `orbit-defender-tutorials`: per-level tutorial copy overrides. Keep these customizations when a new campaign clears its result records.
- Clear run and minigame result data when a new campaign starts, not when returning to the menu after a result screen.

The final summary should report campaign performance, minigame outcomes, at least one strength, and a concrete improvement target.

## Change guidelines

- Keep the game playable by opening `index.html` in a modern browser; preserve static-file compatibility.
- Keep page-to-page contracts explicit in URL parameters and `postMessage` payloads.
- Avoid introducing dependencies or a build system unless the user asks for them.
- Do not reinterpret reference documents or attachments as extra requirements unless the user adopts them in their request.
- Do not add or run tests unless the user asks. For requested verification, report exactly what was checked.

## HUD decisions

- The gameplay HUD does not show a Unit Circle Reference panel.
- Do not render the former bottom HUD bar. Keep the weapon rack clear of the left edge and other overlays.
- Randomly drop shield pickups on enemy defeats; a pickup moves inward to the core and grants one automatic hit block, up to a maximum of three charges. Show charges in the top HUD. Reset all shield charges at the start of each stage. Orbital combat has only player HP (labeled HP); do not add Core HP, Core damage, or Core repair status. Bullets travel to the screen edge. Value weapons in Quadrant sections fire only within that selected quadrant.
- Explain difficulty differences on the menu: Cadet uses slower enemies, 5 HP, faster charge, a 4% wrong-shot penalty, relaxed weapon matching, and hints after one miss; Pilot uses standard speed, 3 HP, balanced charge, an 8% penalty, exact matching, and hints after three misses; Ace uses faster enemies, 2 HP, slower charge, a 12% penalty, exact matching, and hints after five misses.


- When shield charges are available, draw a clear protective aura around the player ship; remove it when the stored charges reach zero.

- Use an icon and numeric count for HP and stored armor charges in the top HUD; do not use the former health bar or three separate armor pips.
- Present end-of-run and post-flight summaries with the Degree Core image, icon-based stat cards, and separate strength and improvement cards.

- Direct targeting is optional. The game auto-targets the nearest enemy unless the player clicks an enemy sprite or prompt label to lock another target; keep a visible lock marker until it is defeated or passes the defense line.
- Health/armor popups use icon-and-count formats; recovery events show the appropriate icon followed by `+1`.

- Orbital combat has no Core HP meter or repair mechanic. The HUD shows player HP as ♥ plus a count, and damage or healing popups use icon and number only.

- Use a cyan precision-reticle cursor over the game field; keep interactive controls visibly clickable.
