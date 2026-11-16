# Orbit Defender project guide

Read this file before changing the project. Keep it updated when core gameplay contracts, storage keys, or page boundaries change.

## Project shape

- This is a static browser game. It uses HTML, CSS, vanilla JavaScript, Canvas, and local assets; there is no build step or package manager.
- `index.html`, `menu.css`, `menu.js`: cinematic launch screen and campaign route display. Keep mode, unit, difficulty, launch, and options controls outside the framed planet route; render locked planets as black silhouettes in both modes. Story Campaign follows the unlocked route. Level Practice only allows selecting stages up to the highest unlocked campaign stage. Use `ui-button-small.png` for compact choice controls and `ui-threat-card.png` for difficulty cards. The menu body background uses space art distinct from the banner so the same planet is not repeated. `assets/favicon.svg` is the game logomark favicon for all pages.
- `game.html`, `style.css`, `game.js`: campaign, tutorials, orbital combat, HUD, and minigame host iframe.
- `trigo_combat.html`, `wiring.html`, `radar.html`, `matching.html`, `satellite_radar.html`: standalone minigames and iframe child pages.
- `assets/`: game art and audio-related visuals. The menu route uses one standalone transparent WebP planet per level (`planet-helios-outpost.webp`, `planet-mirror-belt.webp`, `planet-shattered-meridian.webp`, `planet-special-angle.webp`, `planet-degree-overlord.webp`); keep each image replaceable without changing route structure. `ui-button-small.png` is an original transparent compact sci-fi button frame; `ui-threat-card.png` is an original transparent frame sized for Threat Level cards. `ui-console-frame.png` and `dialog-frame.png` are shared metallic cyan console borders; `orbit-interface.css` applies the Story2 PDF art direction to Story, Academy, combat, and all iframe minigames. `favicon.svg` uses the Orbit Defender orbital-ring mark. `visual-novel-character-trio.png` is original generated RGBA art with transparent background for NOVA (male pilot), ASTRA (ship AI), and NOX. `minigame-intercept-intro.webp` and `minigame-intercept-outro.webp` are character-free cinematic backgrounds used by `trigo_combat.html`; their matching PNG files are high-resolution source masters. `matching-navigation-intro.webp` and `matching-navigation-outro.webp` are character-free coordinate-recovery scenes owned by `matching.html`, with matching PNG source masters. `satellite-alignment-intro.webp` and `satellite-alignment-outro.webp` are character-free satellite-recovery scenes owned by `satellite_radar.html`, with matching PNG source masters. `radar-zerolock-intro.webp` and `radar-zerolock-outro.webp` are character-free interference and route-restoration scenes reused by `radar.html` and `wiring.html`, with matching PNG source masters. Keep dialogue text in HTML, never embedded in images.
- `README.md`: player-facing overview. `AGENTS.md` is the working reference for future code changes.

## Intended campaign loop

Campaign order is Level 1 (Q1 basics) → Level 2 (Q2 reflection) → Level 3 (Q3 and Q4 coordinates) → Level 4 (special angles) → final boss. Opening story establishes NOVA, ASTRA, and NOX's route-control motive; successful boss defeat plays the campaign ending dialogue before the result summary. Minigame transfer dialogue must stay destination-neutral because one of five minigames is selected randomly after each regular level.

The campaign opens with the STARFALL story and faction introductions. Each regular level follows: ship arrival cinematic → level story scene → level-specific learning brief → interactive tutorial with hands-on weapon drills → defend the circular planet through three waves → after-action story → one randomly selected available minigame and its story → ship departure and arrival cinematics → next level story. Orbital Intercept (`trigo_combat.html`), Card Matching (`matching.html`), Satellite Alignment (`satellite_radar.html`), Radar (`radar.html`), and Wiring (`wiring.html`) own their illustrated intro and result scenes; each iframe reports its result only after the player advances from the ending scene. The host handles campaign travel after that result. The final boss uses its own level story, learning brief, and three-phase defense, then ends with the campaign summary. Keep the minigame selection list extensible as more minigames are added. Menu Level Practice uses a ship arrival cinematic, the selected level story, learning brief, and tutorial before a no-progression practice flight.

Regular wave quotas are 8, 12, and 16 enemies (36 per level). Each later wave introduces an additional enemy type and raises its starting speed; enemies accelerate during a wave. The wave transition resets speed for the new wave while raising its starting baseline. Do not advance a level until its required wave enemies are cleared.

Enemy prompt intent: `angle-seeker` shows both x and y and asks for θ; `x-seeker` asks for x; `y-seeker` asks for y. Enemy kinds differ only by question and distinct sprite art; keep movement, speed rules, health, and collision behavior shared. Preserve `x = cos θ`, `y = sin θ`, including signs and reflected angles. Avoid random camera jitter or per-kind position changes that can make enemies appear to blink.

Weapon buttons are always ordered into fixed Quadrant I, II, III, IV, and Axes sections; do not shuffle them. The game has no Academy/teaching launch mode and no Space, 1–9, Shift, E, or H gameplay shortcuts. By default, fire at the nearest enemy automatically. Clicking an enemy or its question label is optional and locks another target until it is defeated or passes the defense line; explain this in the UI. Shields drop randomly when enemies are defeated, are collected at the core, and can be stored up to three; each charge automatically blocks one incoming hit. Show the shield meter in the top HUD. The final boss combines the learned angle and coordinate concepts. Boss HP is represented by nine successful weakpoint hits over three phases. The phases include unit-circle defense, combo-based energy reload, and synthesis across the learned content. Victory requires reducing boss HP to zero.

Cadet, Pilot, and Ace must remain distinct in enemy speed, player durability, firing cadence/charge recovery, and repeat-miss hint thresholds. Hints are tracked per queried trig value and appear only after the configured number of mistakes (currently 1, 3, and 5). The right telemetry sidebar, Unit Circle Reference panel, Learning Goal panel, and bottom control/status bar are intentionally absent. The Unit Circle Reference panel is intentionally removed from the gameplay HUD. Do not add it back unless requested. Do not show numeric angle labels around the gameplay orbit.

## Tutorial and speaking dialog

- Every level briefing is editable separately. Persist edits under `orbit-defender-tutorials` as a JSON object keyed by zero-based level index.
- Briefings should remain data-driven so lesson text and images can be revised without changing combat logic.
- Speaking dialog currently uses browser `speechSynthesis`; preserve graceful behavior where speech is unavailable.
- Story dialogue uses original generated character art (do not crop illustrations from the reference PDF). Show NOVA as a male pilot, ASTRA as the ship AI, and NOX as the antagonist. Keep all portraits hidden until that character's first spoken line, then reveal and animate them; narration keeps every character dim.
- Keep the visual treatment ready for replaceable art assets; avoid baking dialogue text into images.
- `game.js` owns the campaign, per-level tutorial drills, post-level stories, and route travel cinematics; `game.html` and `style.css` provide the host dialogue and cinematic layers. Each minigame may own its own story screens in its page; Orbital Intercept and Card Matching show their child-page intro before play and result before reporting to the host. Keep Story, learning, tutorial, orbital defense, and iframe minigames within the common cyan metal console direction defined in `assets/orbit-interface.css`, following the Story2 PDF reference. Stage arrival must finish before its story; after-action stories lead into the selected minigame; its ending story must finish before departure and arrival to the next planet.

## Minigame page contract

- The host selects from the `miniGames` list in `game.js` and loads a separate page in `#zombie-game`.
- The available list currently includes Orbital Intercept, Wiring, Radar, Card Matching, and Satellite Alignment; Satellite Alignment (`satellite_radar.html`) asks five coordinate-to-angle questions drawn only from angles taught by completed levels, using signed coordinates and the selected degree/radian unit; a level randomly selects one. It shows an illustrated Thai satellite-off-track story before play and an alignment outcome story after completion or timeout; the player advances from that story before the host records the result. Its 90-second timer starts after the intro. Card Matching (`matching.html`) creates five randomized sine, cosine, or tangent question-answer pairs using only angles from completed levels (`level` is one-based), honors the selected degree/radian unit, and succeeds only when all pairs are matched. It shows an illustrated Thai story before play and an outcome story after completion or timeout; the player advances from that story before the host records the result. Its 120-second timer starts after the intro, and the host shares the same timeout. Orbital Intercept has a short mission intro and no setup controls. Each run spawns exactly five enemy ships; player has three HP and wins only by clearing all five before they breach. Selecting a ship opens its assigned trig problem; a correct answer fires a projectile. Its question pool uses only completed-level content, based on one-based `level` (`1` = Quadrant I, `2` adds Quadrant II, `3+` allows Quadrants III and IV). Wiring (`wiring.html`) shows a Thai power-link failure story before play and a restoration outcome after completion or timeout; the player advances from that story before the host records the result. It draws five mixed question types from the level's completed content. Players connect all five cables before checking; the System Restore tube reports each wire result in its own segment. Radar (`radar.html`) presents an illustrated Thai Zero Lock interference story before play and a route-restoration outcome story after completion or timeout; the player advances from that story before the host records the result. It asks players to drag five targets using distance and angle with live X/Y/r guide readouts; each target has a 30-second timer, and expired targets count as misses. The host allows 210 seconds for the five-target Radar run. It includes a basic arithmetic calculator and per-target X/Y scratch fields, while players recall sine and cosine values themselves. Lesson angles follow the completed level's content and unit.
- Pass `autostart=1`, one-based `level`, `unit`, and a level `content` identifier in the child page URL. The child must use these values to choose relevant lesson material.
- Main menu game routes use `mode=campaign` or `mode=practice`; Level Practice also passes one-based `level` to `game.html`. Keep these host launch settings separate from the child minigame URL and result contract.
- When a minigame ends, the child posts `{ type: 'orbit-minigame-result', success, score, level, quizAccuracy }` to its parent. A child-owned result story may first post `{ type: 'orbit-minigame-story-wait' }` to pause the host timeout until the player continues. The host validates the iframe window source before accepting either message.
- Orbital Intercept passes only when all five enemies are cleared and quiz accuracy is at least 70%. Save unsuccessful runs too; a timeout is a failed result.
- Keep the host responsible for moving to the next level and recording results.

## Browser storage

- `orbit-defender-runs`: recent completed run records.
- `orbit-defender-last-run`: most recently completed run, used by the result summary.
- `orbit-defender-minigames`: outcomes for each minigame played in the current campaign.
- `orbit-defender-minigame-current`: current/last iframe session state, including timeout handling.
- `orbit-defender-route-unlocked`: highest campaign route stage reached; this is separate from run records.
- Level Practice may select only stage indexes at or below `orbit-defender-route-unlocked`; keep later route planets as silhouettes and prevent pointer, keyboard, and direct URL selection past that limit.
- `orbit-defender-tutorials`: per-level tutorial copy overrides. Keep these customizations when a new campaign clears its result records.
- `orbit-defender-settings`: saved menu preferences for music, effects, dialogue voice volume, and reduced motion. Pass settings to `game.html` in query parameters so they remain available with static `file://` launches.
- Clear run and minigame result data when a new campaign starts, not when returning to the menu after a result screen.
- Level Practice preserves campaign run, minigame, and route-unlock records; practice results do not create campaign run records.

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

