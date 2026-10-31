# Modern UI redesign (flat, design-token based)

Branch: `feat/modern-ui` · Date: 2026-10-31

## Goal
Give the whole frontend a clean, flat, modern look (Linear/Vercel style): generous
whitespace, thin borders, one violet-blue accent, rounded cards. Dark is the default
theme, light is equally polished. Behaviour is unchanged.

## Approach: design-token rebuild
Rebuild the token layer in `src/style/app.css`, then migrate every stylesheet to it.
Rejected: per-file CSS rewrite without tokens (leaves inconsistency), CSS framework
(needs HTML/TS churn and a new dependency).

## Scope
All screens: home / Connected Devices, stream dialog and toolbar (desktop and the
phone layout), settings, file manager, shell terminal, banners, dependency panel,
confirm dialogs. Out of scope: logic changes, new dependencies, new frameworks.

## Token system (`app.css`)
- Colour: 3 surface levels, 3 text levels, one accent, plus success / warning /
  danger / info. Same token names in `[data-theme="dark"]` and `[data-theme="light"]`.
- Type: modern system font stack; monospace only for serials, stats and terminal.
  6-step size scale.
- Space: 4px multiples. Radius: sm / md / lg. Shadow: 2 levels. Motion: duration +
  easing tokens (existing `prefers-reduced-motion` reset stays).
- Existing variable names stay as aliases of the new tokens so nothing breaks while
  files are migrated; aliases are removed once unused.
- All ~128 hard-coded colours in `src/style/*.css` are replaced with tokens.

## Components
Buttons (primary, secondary, ghost, danger, icon), inputs, toggles, cards, modal
frame/header, banners. One focus-ring style; touch targets at least 44px on coarse
pointers.

## Connected Devices card (action hierarchy)
Actions are tiered by importance:
1. **Connect** — large primary button, the visual focus of the card.
2. **Turn on / turn off** (sleep/wake) — same size as Connect, secondary style, icon
   plus label showing the current state (checking… / on / off).
3. **Disconnect** (network devices only) — small icon button, tooltip + `aria-label`.
4. **Configure stream** — least important (used once, defaults are kept): small gear
   icon button, tooltip + `aria-label`.
Device info becomes small-caps labels with values, a status dot shows device state.
Markup changes are limited to the buttons in
`src/app/googDevice/client/DeviceTracker.ts` and the configure entry in
`ConfigureScrcpy.ts`; handlers and logic are untouched.

## Stream dialog and toolbar
Thin-border vertical icon toolbar with accent-coloured active state; the phone layout
bottom bar uses the same tokens. The iPad/iPhone touch layer, `touch-action`, and
background-resume behaviour from `main` must not change.

## Verification
- Production build and existing unit tests pass.
- Screenshots of home and stream views in dark and light for review.
- Manual check on iPad (touch control still works, layout sane).

## Risks
- Large CSS surface (`modal.css` is 1355 lines): migrate file by file, build after each.
- Alias tokens must not mask a missed hard-coded colour: grep for raw colours at the end.
