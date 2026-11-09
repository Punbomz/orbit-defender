# Orbit Defender: Starfall Route — Visual Direction

## Game identity

A futuristic orbital-defense roguelike with a short star-system route and a trigonometry learning core. Each route alternates mouse-aimed Deep-Space Intercepts with planet-defense missions. At a Resupply Terminal, answer a question to reload while threats continue moving slowly. Preserve the learning loop: readable prompt → deliberate action → clear feedback.

## Palette

- Space background: midnight navy `#071026`
- Panels: deep navy `#111D3A`
- Friendly and primary interaction: cyan `#50E3E6`
- Salvage and angles: gold `#FFD166`
- Special systems: violet `#A37BFF`
- Hostile signals and damage: pink `#FF5D8F`
- Positive feedback and recovery: mint `#72F1B8`
- Main text: cool white `#EEF4FF`; secondary text: blue-gray `#94A6C9`

Keep backgrounds dark and calm. Use color with labels or symbols so game states remain readable without color alone.

## Screen structure

1. **Main menu (`index.html`)** — identity, route preview, learning unit and threat-level selection, campaign and Academy actions. Keep it in its own file, separate from gameplay.
2. **Mission Brief** — the next planet, its objective, pilot/core status, and launch action.
3. **Deep-Space Intercept** — ship, approaching threats, aim target, travel timer, ammo, travel Hull, accuracy, and Resupply action.
4. **Resupply Quiz** — one clear math question, answer feedback, ammo awarded, and a return-to-travel action. Threat movement slows while the terminal is open.
5. **Planet Defense** — open central orbital battlefield with persistent signal, coordinates, health, energy, wave progress, and combo.
6. **Rewards and Debrief** — Salvage choices, continuation or extraction, route status, and run summary.

Reuse the same panel, button, and typography system while making each phase easy to tell apart.

## Gameplay readability

- Intercept uses mouse aiming and clicks to fire. Show limited ammunition, travel Hull damage, accuracy, and remaining threats.
- Planet Defense uses separate Angle Cannon and Value Cannon groups. Show selected, locked, cooling, and low-energy states.
- Keep `x = cos θ`, `y = sin θ`, quadrant signs, target signal, and clear shot feedback visible during planet defense.
- Resupply question types can include coordinate selection, sine/cosine values, reading an angle from a unit-circle diagram, and placing a point at a target angle.
- Keep keyboard prompts alongside touch controls on small screens.

## Route and learning progression

Helios Outpost (Q1) → Mirror Belt (Q2) → Shattered Meridian (Q3/Q4) → Enemy Homeworld (boss). Intercepts connect planet missions; planet defense waves award Salvage. Increase route difficulty and math complexity gradually.
