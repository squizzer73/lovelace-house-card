# House Card

A visual house floorplan card for Home Assistant. Draw rooms on a configurable grid, bind entity states to each room, and view your home as either a flat overhead grid or a **3D axonometric dollhouse** — complete with light glow, occupancy indicators, temperature/humidity data, and time-of-day ambient lighting.

## Features

- **Grid-based room editor** — drag to draw rectangular rooms on a configurable grid per floor
- **Axonometric dollhouse view** — 3D perspective with illuminated wall panels, floor glow, and recessed info cards per room
- **Flat grid view** — clean overhead plan with CSS 3D tilt, per-room info cards, and light spill glow
- **Multi-floor support** — stacked dollhouse floors with visible separation; tab switching in flat mode
- **Light state** — rooms and wall panels glow with the light's actual RGB colour when on; dark otherwise
- **Occupancy indicator** — animated person icon appears when a motion/occupancy sensor is triggered; asymmetric fade-out (0.5 s in, 7 s out)
- **Temperature & humidity display** — sensor values shown on recessed in-room info cards
- **Heatmap thermal overlay** — colour-ramp temperature overlay and humidity droplets per room
- **Sun-based ambient theming** — subtle amber tint at golden hour, blue tint at night; driven by `sun.sun` elevation
- **TV/wallboard optimised** — `vw`-based `clamp()` font and icon sizing so text is legible from across the room
- **Room type icons** — 19 room types (bedroom, kitchen, lounge, etc.) with MDI watermark icons
- **Tap to toggle light / long-press for more-info**
- **HACS compatible**

## Installation via HACS

1. Open HACS → Frontend
2. Click the three-dot menu → Custom repositories
3. Add `squizzer73/lovelace-house-card` with category `Lovelace`
4. Install and reload

## Manual Installation

Copy `dist/house-card.js` to your `/config/www/community/lovelace-house-card/` directory, then add to your Lovelace resources:

```yaml
resources:
  - url: /hacsfiles/lovelace-house-card/house-card.js
    type: module
```

## Configuration

Add via the Lovelace UI editor (recommended) or manually:

```yaml
type: custom:house-card
title: My House
heatmap_mode: off          # off | temperature | humidity | combined
temperature_range: [16, 26]
humidity_floor: 50         # hide humidity droplets below this %

floors:
  - id: ground
    name: Ground Floor
    cols: 8
    rows: 6
    temperature_range: [14, 28]   # optional per-floor override
    rooms:
      - id: lounge
        name: Lounge
        col: 0
        row: 0
        width: 3
        height: 2
        color: '#3d5a78'
        room_type: lounge
        entities:
          light: light.lounge
          occupancy: binary_sensor.lounge_motion
          temperature: sensor.lounge_temperature
          humidity: sensor.lounge_humidity
      - id: kitchen
        name: Kitchen
        col: 3
        row: 0
        width: 2
        height: 2
        room_type: kitchen
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
| `color` | No | Room accent colour (hex); auto-assigned from palette if omitted |
| `room_type` | No | One of 19 types — drives watermark icon and default label |
| `heatmap` | No | Set `false` to opt this room out of the thermal overlay |
| `entities.light` | No | Light entity (supports `rgb_color` and `brightness` attributes) |
| `entities.climate` | No | Thermostat / TRV entity — shows current temp, setpoint, and heat-call indicator |
| `entities.occupancy` | No | Binary sensor for occupancy/motion |
| `entities.temperature` | No | Temperature sensor entity |
| `entities.humidity` | No | Humidity sensor entity |

### Room types

`bedroom`, `master_bedroom`, `bathroom`, `toilet`, `kitchen`, `lounge`, `living_room`, `dining`, `office`, `study`, `hall`, `entrance`, `landing`, `garage`, `garden`, `utility`, `conservatory`, `playroom`, `gym`

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build → dist/house-card.js
```

After building, deploy to the HA instance (network share must be mounted at `/Volumes/config`):

```bash
cp dist/house-card.js /Volumes/config/www/community/lovelace-house-card/house-card.js && \
gzip -9 -c dist/house-card.js > /Volumes/config/www/community/lovelace-house-card/house-card.js.gz
```
