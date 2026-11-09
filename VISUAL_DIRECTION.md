# Orbit Defender — Visual Direction

Use this guide for future interface, visual, and gameplay work in this project.

## Game identity
A futuristic orbital-defense roguelike shooter with a trigonometry learning core. Enemies stream inward in waves; pilots read the enemy signal, choose the matching Angle Cannon or Value Cannon, and fire. Runs advance through academy missions, escalating threats, a three-phase boss, and salvage upgrades. Preserve the learning loop: readable signal → weapon choice → shot → clear feedback.

## Palette
- Space background: midnight navy #071026
- Panels: deep navy #111D3A
- Player and primary interaction: cyan #50E3E6
- Angle markers and salvage rewards: gold #FFD166
- Rare systems and boss arc accents: violet #A37BFF
- Hostile signals and damage: alert pink #FF5D8F
- Positive feedback and recovery: mint #72F1B8
- Main text: cool white #EEF4FF; secondary text: blue-gray #94A6C9

Keep backgrounds dark and calm. Use one bright accent to direct attention at a time; pink is for danger, gold for choices/rewards, violet for rare or boss systems.

## Screen structure
1. Main menu: game identity, short premise, start-campaign action, and a separate Academy-training action.
2. Pre-flight: the selected mission, objective, difficulty, learning unit, pilot/core status, and a clear launch action.
3. Gameplay: open central orbital battlefield; persistent HUD panels frame the action and expose signal, coordinates, health, energy, wave progress, and combo.
4. Rewards/results: concise salvage choices, mission continuation/extraction, and run summary.

Keep each state visually distinct while reusing the same panel, button, and typography system. Avoid stacking setup controls on the main menu.

## Interface and combat
- Use dark glass-like panels, thin cyan borders, clipped or softly rounded corners, and restrained glow.
- Keep enemies, orbit paths, projectiles, labels, and Degree Core readable at a glance.
- Angle Cannon and Value Cannon are distinct weapon groups. Show selected, locked, and cooling/energy states clearly; retain direct-click and keyboard access.
- Use cyan for friendly/learning signals, gold for angles and rewards, violet for special systems, pink for incoming threats and damage.
- Keep learning telemetry visible in combat: x = cos θ, y = sin θ, quadrant signs, and the current target signal.
- Give every shot a clear result: match, mismatch, armor damage, shield block, or breach.
- Keep layouts legible on desktop and touch screens; preserve keyboard prompts alongside touch controls.

## Controls
1–9 fire a Value Cannon, clicking a weapon card fires that weapon, Space fires the current selection, Shift holds the shield, E scans, H requests a hint, Tab toggles the reference panel, and Esc pauses.
