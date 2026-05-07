# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run build        # production build → dist/house-card.js
npm run dev          # watch mode (rebuilds on save)
npm run lint         # lint src/**/*.js with eslint
```

After building, copy `dist/house-card.js` to `/config/www/house-card.js` on the Home Assistant instance.

## Architecture

This is a HACS-compatible Lovelace custom card for Home Assistant, built with **Lit 3** and bundled by **Rollup**.

### Source files (`src/`)

- **`src/house-card.js`** — Main display card (`house-card` custom element). Extends `LitElement`. Receives `hass` (HA state object) and `_config` as properties. Renders a grid-based floorplan using percentage-positioned `div` elements; no canvas or SVG. Reads entity states via `this._hass.states[entityId]`. Registers itself in `window.customCards` for HA discovery.

- **`src/house-card-editor.js`** — Visual config editor (`house-card-editor` custom element). Returned by `HouseCard.getConfigElement()`. Manages a three-state internal UI (`floors` → `grid` → `room`) with mouse-drag room painting. Fires `config-changed` custom events (bubbling, composed) to communicate config updates back to HA.

### Build output

Rollup bundles both source files plus the Lit library into a single **`dist/house-card.js`** ES module. The root-level `house-card.js` is also a fully bundled artifact (minified).

### Config schema

```
{
  type: 'custom:house-card',
  title: string,
  floors: [{ id, name, cols, rows, rooms: [{ id, name, col, row, width, height, color, entities: { light?, occupancy?, temperature? } }] }]
}
```

Rooms use percentage-based positioning derived from `col/cols` and `row/rows`. The grid canvas uses `padding-bottom: (rows/cols * 100)%` to maintain aspect ratio, so the card scales automatically to any card width with no configuration.

### HA integration points

- `set hass(value)` — called by HA on every state change; triggers re-render
- `setConfig(config)` — called by HA when card config changes
- `static getConfigElement()` — returns editor element
- `static getStubConfig()` — returns a valid starting config with one empty ground floor (shown in card picker)
- Entity states checked: `light.*` (on/off), `binary_sensor.*` (on/off for occupancy), `sensor.*` (numeric state + `unit_of_measurement` attribute for temperature)

### Key implementation patterns

**Lit `css` template constraints:** Never interpolate plain JS strings into Lit's `css` tagged template — it throws a runtime error (`Value passed to 'css' function must be a 'css' function result`), which silently prevents `customElements.define` from being reached. Inline colour/value literals directly, or wrap with `unsafeCSS()`.

**Config-changed pattern:** The editor fires `config-changed` on every mutation (add/delete floor, add/delete room, update entity). The config object is always deep-cloned before mutation to avoid reference issues. This is the standard HA editor contract — HA catches the event and updates dashboard YAML in real time.

**Overlap detection:** On drag complete, the new rectangle is checked against all existing rooms using AABB intersection before prompting for a name. Overlapping drags are silently discarded.

**Room colour assignment:** Auto-assigned from an 8-colour palette (`ROOM_COLORS` array in `house-card-editor.js`) using modulo on current room count. Stored in the room config object; used for editor overlays.

**HACS release:** `.github/workflows/release.yml` auto-builds and attaches `dist/house-card.js` to any published GitHub release. HACS downloads this single file.

## Build status & roadmap

**Phase 1 (grid editor) — complete.** Floor tabs, grid size picker, click-drag room drawing, overlap detection, room colour assignment, delete rooms.

**Phase 2 (entity binding + runtime display) — complete.** Per-room entity binding in editor; runtime light/occupancy/temperature state display.

**Phase 3 — TODO:**

| Task | Notes |
|------|-------|
| `ha-entity-picker` swap | Replace the three text inputs in the ROOM editor state with `ha-entity-picker`. Import from `../../components/ha-entity-picker.js` — check HA version for correct import path. |
| Touch/pointer events | Grid painter uses `mousedown/mousemove/mouseup`. Add `pointerdown/pointermove/pointerup` equivalents for tablet/touchscreen. |
| Room rename | Add name input to the ROOM editor state — currently the name is fixed at creation time. |
| Side-by-side wallboard layout | Currently always shows tabs; add a mode where floors render side-by-side for large displays. |
| Light group support | Currently expects a single light entity; extend to handle `group` on/off aggregate. |

## Environment

HA instance runs on an M2 Mac Mini via Docker. After building, symlink or copy `dist/house-card.js` to `/config/www/house-card.js`, then add the resource in HA:

```yaml
resources:
  - url: /local/house-card.js
    type: module
```
