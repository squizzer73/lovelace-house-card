# House Card

A visual house floorplan card for Home Assistant. Build a stylised representation of your home using a grid-based room editor, then display entity states — lights, occupancy, temperature — directly on the floorplan.

## Features

- **Grid-based room editor** — draw rectangular rooms on a configurable grid per floor
- **Multi-floor support** — tab-based floor switching on mobile, side-by-side on wallboard
- **Light state** — rooms glow when lights are on
- **Occupancy indicator** — green dot when a motion/occupancy sensor is triggered
- **Temperature overlay** — displays current temperature sensor value in the room
- **Scales to card size** — works on mobile dashboards and large wallboard displays
- **HACS compatible**

## Installation via HACS

1. Open HACS → Frontend
2. Click the three-dot menu → Custom repositories
3. Add `squizzer73/lovelace-house-card` with category `Lovelace`
4. Install and reload

## Manual Installation

Copy `dist/house-card.js` to your `/config/www/` directory, then add to your Lovelace resources:

```yaml
resources:
  - url: /local/house-card.js
    type: module
```

## Configuration

Add via the Lovelace UI editor (recommended) or manually:

```yaml
type: custom:house-card
title: My House
floors:
  - id: ground
    name: Ground Floor
    cols: 8
    rows: 6
    rooms:
      - id: lounge
        name: Lounge
        col: 0
        row: 0
        width: 3
        height: 2
        color: '#4a90d9'
        entities:
          light: light.lounge
          occupancy: binary_sensor.lounge_motion
          temperature: sensor.lounge_temperature
      - id: kitchen
        name: Kitchen
        col: 3
        row: 0
        width: 2
        height: 2
        color: '#50c878'
        entities:
          light: light.kitchen
          occupancy: binary_sensor.kitchen_motion
```

## Room Configuration

| Key | Required | Description |
|-----|----------|-------------|
| `id` | Yes | Unique identifier |
| `name` | Yes | Display name |
| `col` | Yes | Starting column (0-indexed) |
| `row` | Yes | Starting row (0-indexed) |
| `width` | Yes | Width in grid cells |
| `height` | Yes | Height in grid cells |
| `color` | No | Room accent colour (hex) |
| `entities.light` | No | Light entity ID |
| `entities.occupancy` | No | Binary sensor for occupancy |
| `entities.temperature` | No | Temperature sensor entity ID |

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

Output is `dist/house-card.js` — copy to `/config/www/house-card.js`.
