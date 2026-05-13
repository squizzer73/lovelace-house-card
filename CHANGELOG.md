# Changelog

## [0.2.6] — 2026-05-13

### Fixed
- **Auto-trim empty space** — the flat grid canvas now sizes itself to the tight bounding box of the rooms actually placed on the floor, eliminating dead space above/below/beside rooms. Rooms placed mid-grid no longer leave large empty areas. The heatmap thermal layer and canvas sizing follow the same bounding box automatically.

---

## [0.2.5] — 2026-05-13

### Added
- **Camera detection indicators** — bind any number of `binary_sensor` detection entities to a room via the new **Camera Detections** section in the editor
- Five built-in detection types with icons and colours: `person` (cyan `mdi:walk`), `dog` (amber `mdi:dog`), `cat` (purple `mdi:cat`), `vehicle` (blue `mdi:car`), `package` (orange `mdi:package-variant`)
- **Flat view**: a row of small icons appears at the bottom of the room info card — dim when inactive, full colour with a pop-in animation when triggered; only shown if detections are configured on that room
- **Axo view**: coloured dots at the bottom of the recessed info card per detection type — lit when active, dim circle when idle; only shown if detections are configured
- Editor: **Camera Detections** section with Add / Remove buttons, type dropdown, and `binary_sensor` entity picker per detection

---

## [0.2.4] — 2026-05-13

### Added
- **Heating / TRV support** — bind a `climate.*` entity to any room via the new "Thermostat / TRV" picker in the editor
- **Heat-call indicator (flat view)** — `mdi:fire` icon in the room info card shows current temp / setpoint (`16.0°C / 20.0°C`); icon glows orange and pulses when the room is actively calling for heat (`hvac_action === 'heating'`, or current < setpoint − 0.5° as fallback)
- **Heat floor glow (axo view)** — warm amber bloom on the room floor when actively calling for heat, distinct from the light glow
- **Heating text in axo info card** — current → setpoint displayed in the recessed card; coloured orange when calling

---

## [0.2.3] — 2026-05-10

### Added
- **Axonometric dollhouse view** — rooms rendered as 3D boxes with illuminated top face and side wall panels; unlit rooms are dark, lit rooms glow with the light's actual RGB colour
- **Recessed info cards** — temperature, humidity and room name displayed on an inset card embossed into the axo room floor
- **Multi-floor vertical stacking** — upper floors visually float above lower floors with a configurable gap; the two floors overlap slightly for a natural dollhouse silhouette
- **Double-ring floor glow** — two blurred ellipses at the base of each lit room (outer 1.6× radius at 14% opacity, inner at 32%) for realistic light spill
- **MDI person icon in axo view** — SVG path rendered directly, matching the flat-view occupancy watermark
- **Sun-based ambient theming** — `sun.sun` elevation drives a subtle inset box-shadow: amber at golden hour (elevation 15°→−6°), blue-amber blend at dusk/dawn, deep blue at night
- **Occupancy pulse animation** — person icon scales in with a `0.7 s ease-out` keyframe animation on appearance

### Changed
- **Dark-by-default room colours** — rooms are dark grey/navy until a light is on, so illumination is immediately obvious; flat-view palette updated to muted dark tones
- **Flat grid tilt** — `rotateX(38deg) rotateY(0deg)` with `perspective-origin: 50% 50%` for a straight-on tilt without keystone distortion
- **Canvas sizing** — `ResizeObserver` caps canvas width so the rotated grid never bleeds outside the card wrapper
- **TV/wallboard text scaling** — all font sizes use `vw`-based `clamp()` (room name `clamp(0.8rem, 1.2vw, 1.8rem)`, data rows `clamp(0.75rem, 1.0vw, 1.5rem)`, icons `clamp(16px, 1.4vw, 26px)`) for legibility from across a room
- **Default wall height** reduced to `25` (was `80`) for a less exaggerated axo silhouette
- **Default floor gap** increased to `250` (was `150`) for clear floor separation

### Fixed
- SVG blur filters use inline `style="filter:blur()"` instead of `filter="url(#…)"` to avoid the HA `<base>` HTTPS bug
- Deploy command updated to write both `.js` and `.js.gz` so HA's service worker serves the latest build immediately

---

## [0.2.2] — 2026-05-08

### Added
- Axonometric view Phase 1: perspective SVG projection, wall panels, basic floor glow
- HTTPS SVG filter fix (inline `filter:blur()`)

---

## [0.2.1] — prior

### Added
- Occupancy watermark: centred person icon with asymmetric fade (0.5 s in, 7 s out)

---

## [0.2.0] — prior

### Added
- Heatmap thermal overlay: temperature colour ramp and seeded-PRNG humidity droplets
- Heatmap mode toggle in card header (off / temperature / humidity / combined)

---

## [0.1.9] — prior

### Added
- Light spill glow driven by `rgb_color` attribute with 400 ms transition
- Tap to toggle light / long-press for more-info dialog
- Room type icons (19 types, MDI watermark) and room type dropdown in editor

---

## [0.1.0–0.1.8] — prior

Initial builds: grid editor, multi-floor config, CSS 3D perspective floorplan, floating info cards, legend bar, entity pickers, HACS packaging.
