# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run build        # production build → dist/house-card.js
npm run dev          # watch mode (rebuilds on save)
npm run lint         # lint src/**/*.js with eslint
```

After building, deploy to the HA instance (network share must be mounted first):

```bash
cp dist/house-card.js /Volumes/config/www/community/lovelace-house-card/house-card.js && gzip -9 -c dist/house-card.js > /Volumes/config/www/community/lovelace-house-card/house-card.js.gz
```

The share mounts at `/Volumes/config` (SMB). If it's not mounted, prompt the user to mount it before deploying. HACS downloads the card to `/Volumes/config/www/community/lovelace-house-card/`.

## Architecture

HACS-compatible Lovelace custom card for Home Assistant, built with **Lit 3** and bundled by **Rollup**.

### Source files (`src/`)

- **`src/house-card.js`** — Main display card (`house-card` custom element). Extends `LitElement`. Receives `hass` and `_config` as reactive properties. Renders a CSS 3D perspective floorplan (grid of `div` elements rotated with `rotateX(35deg) rotateY(6deg)`). Also contains an SVG thermal-heatmap overlay layer. Registers itself in `window.customCards` for HA discovery.

- **`src/house-card-editor.js`** — Visual config editor (`house-card-editor` custom element). Three-state UI: `floors` → `grid` → `room`. Grid state uses mouse-drag room painting. Room state has entity pickers (`ha-entity-picker`) and a room type dropdown. Fires `config-changed` events to HA.

- **`src/constants.js`** — Shared lookup tables: `ROOM_TYPE_ICONS` (room type key → MDI icon string) and `ROOM_TYPE_LABELS` (room type key → display label). 19 room types. Imported by both card and editor.

### Build output

Rollup bundles all source files plus Lit into a single **`dist/house-card.js`** ES module. HACS downloads this file from GitHub releases.

### Config schema

```yaml
type: custom:house-card
title: My House                  # optional
heatmap_mode: off                # off | temperature | humidity | combined
temperature_range: [16, 26]      # card-level default for thermal overlay
humidity_floor: 50               # hide humidity droplets below this %

floors:
  - id: ground
    name: Ground Floor
    cols: 8
    rows: 6
    temperature_range: [14, 28]  # per-floor override (optional)
    rooms:
      - id: room_1234567890
        name: Lounge
        col: 0
        row: 0
        width: 3
        height: 2
        color: '#4a90d9'         # hex, auto-assigned from 8-colour palette
        room_type: lounge        # optional — drives MDI watermark icon
        heatmap: false           # opt-out this room from thermal overlay
        entities:
          light: light.lounge_main
          occupancy: binary_sensor.lounge_pir_occupancy
          temperature: sensor.lounge_climate_temperature
          humidity: sensor.lounge_climate_humidity
```

Rooms use percentage-based positioning derived from `col/cols` and `row/rows`. The grid canvas uses `aspect-ratio: cols/rows` to maintain proportions at any card width.

### HA integration points

- `set hass(value)` — called by HA on every state change; `_hass` is a reactive property so Lit re-renders automatically
- `setConfig(config)` — called by HA when card config changes
- `static getConfigElement()` — returns the editor element
- `static getStubConfig()` — returns a valid starting config shown in the card picker
- Entity domains: `light.*` (on/off + `rgb_color` + `brightness`), `binary_sensor.*` (occupancy on/off), `sensor.*` (numeric temperature/humidity with `unit_of_measurement`)

### Key implementation patterns

**Lit `css` template constraints:** Never interpolate plain JS strings into the `css` tagged template — it throws at runtime and silently prevents `customElements.define`. Use inline literals or `unsafeCSS()`.

**Lit `svg` tag:** Used for the thermal SVG layer. Import alongside `html` and `css` from `'lit'`. Use `svg`...`` for SVG fragment content inside `<svg>` elements. SVG filter IDs use `this._uid` (random suffix set in constructor) to avoid collisions between multiple card instances on the same dashboard.

**Asymmetric CSS transitions:** The occupancy watermark uses two different `transition` durations — fast fade-in (0.5s) on `.occupied`, slow fade-out (7s) on the base class. When Lit adds the class the browser applies the short rule; when removed it falls back to the long rule. No JS timers needed.

**Light spill glow:** `box-shadow` on `.room-face` driven by the light entity's `rgb_color` attribute. Transition is on the box-shadow property separately (`0.4s ease`). `box-shadow` paints outside the element boundary so it is unaffected by `overflow: hidden` on the room face or by background-transparency changes in heatmap mode.

**Heatmap mode CSS override:** In heatmap mode, room face backgrounds become mostly transparent so the SVG thermal layer shows through. The inline `background-color` style on `.room-face` is overridden using `!important` on the `[data-heatmap]` attribute selector — the only reliable way to beat inline styles from CSS.

**Heatmap seeded PRNG:** Humidity droplet positions use `_mulberry32(seed)` seeded from `_hashCode(room.id)`. Positions are deterministic so the SVG diff is stable across every `hass` update — no jitter.

**Colour interpolation:** `_tempColour(t, [tMin, tMax])` walks a five-stop ramp. At `f=0` the loop hits `i=0` immediately; at `f=1` it hits the last segment and `k=1` gives the final stop colour exactly. The `stops.at(-1)` fallback after the loop is a safety net for floating-point edge cases only.

**Config-changed pattern:** The editor fires `config-changed` on every mutation. The config object is always spread/shallow-cloned before mutation to avoid reference issues. This is the standard HA editor contract.

**Overlap detection:** On drag complete the new rectangle is AABB-checked against all existing rooms. Overlapping drags are silently discarded.

**`ha-entity-picker` lazy loading:** HA registers this element lazily. `firstUpdated()` in the editor calls `window.loadCardHelpers()` to force registration, then `requestUpdate()`. A `customElements.get('ha-entity-picker')` guard in the template renders a "Loading…" placeholder until registration completes.

**Room colour assignment:** Auto-assigned from `ROOM_COLORS` (8 colours) using modulo on current room count. Stored in the room config object.

**HACS release:** `.github/workflows/release.yml` auto-builds and attaches `dist/house-card.js` to any published GitHub release.

## Feature status

| Feature | Status |
|---------|--------|
| Floor/grid editor (draw rooms by drag) | ✅ complete |
| Room entity binding (light, occupancy, temp, humidity) | ✅ complete |
| CSS 3D perspective floorplan | ✅ complete |
| Light spill glow (rgb_color, 400ms transition) | ✅ complete |
| Tap to toggle light / long-press more-info | ✅ complete |
| Room type icons (19 types, MDI watermark) | ✅ complete |
| Room type dropdown in editor | ✅ complete |
| Humidity entity + display | ✅ complete |
| Occupancy watermark (centred person icon, asymmetric fade) | ✅ complete |
| Heatmap overlay — temperature ramp | ✅ complete |
| Heatmap overlay — humidity droplets (seeded PRNG) | ✅ complete |
| Heatmap mode toggle in card header | ✅ complete |
| Touch/pointer events for grid painter | ⬜ todo |
| Room rename in editor | ⬜ todo |
| Side-by-side wallboard layout | ⬜ todo |
| Light group support | ⬜ todo |

## Environment

HA instance runs on an M2 Mac Mini via Docker. After building, copy `dist/house-card.js` to `/config/www/house-card.js`, then add the resource in HA:

```yaml
resources:
  - url: /local/house-card.js
    type: module
```
