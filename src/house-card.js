import { LitElement, html, css, svg } from 'lit';
import { ROOM_TYPE_ICONS } from './constants.js';
import './house-card-editor.js';

class HouseCard extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      _hass: { type: Object },
      _activeFloor: { type: Number },
      _activeHeatmapMode: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        font-family: var(--primary-font-family, sans-serif);
      }

      ha-card {
        overflow: hidden;
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-header {
        display: flex;
        align-items: center;
        padding: 12px 16px 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }

      .card-title {
        flex: 1;
      }

      .heatmap-toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .heatmap-toggle:hover {
        background: rgba(255,255,255,0.08);
      }

      .floor-tabs {
        display: flex;
        gap: 4px;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        flex-shrink: 0;
      }

      .floor-tab {
        padding: 6px 14px;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .floor-tab.active {
        color: var(--primary-text-color);
        border-bottom-color: var(--primary-color, #4a90d9);
        font-weight: 500;
      }

      .floor-tab:hover:not(.active) {
        color: var(--primary-text-color);
        background: rgba(255,255,255,0.05);
      }

      .grid-wrapper {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 16px 32px;
        min-height: 0;
        perspective: 2400px;
        perspective-origin: 50% 30%;
        overflow: visible;
      }

      .grid-canvas {
        position: relative;
        width: 100%;
        min-height: 80px;
        background: rgba(10, 11, 20, 0.95);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform: rotateX(35deg) rotateY(6deg);
        overflow: visible;
      }

      /* ── Thermal SVG overlay — sits behind all room divs ── */
      .thermal-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        border-radius: inherit;
        overflow: hidden;
      }

      /* ── Room 3D wrapper ── */
      .room-3d {
        position: absolute;
        box-sizing: border-box;
        transform-style: preserve-3d;
        z-index: 1;
      }

      /* ── Top face ── */
      .room-face {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border: 1px solid rgba(75, 80, 110, 0.38);
        background: rgba(30, 33, 52, 0.93);
        /*
         * Smooth the light-spill glow and background colour transitions.
         * box-shadow transition animates the glow in/out over 400ms.
         */
        transition: box-shadow 0.4s ease, background 0.4s ease;
        /* Prevent browser long-press context menu on touch devices */
        touch-action: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      .room-face.light-on {
        background: linear-gradient(150deg, rgba(90, 66, 14, 0.97), rgba(46, 31, 5, 0.99));
        border-color: rgba(175, 130, 32, 0.32);
      }

      .room-face.interactive {
        cursor: pointer;
      }

      /* ── Heatmap mode: fade room faces so thermal SVG shows through ── */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-face {
        background: rgba(5, 6, 14, 0.20) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
      }

      /* Preserve a subtle warm hint for lit rooms even in heatmap mode */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-face.light-on {
        background: linear-gradient(150deg, rgba(90, 66, 14, 0.35), rgba(46, 31, 5, 0.40)) !important;
        border-color: rgba(175, 130, 32, 0.32) !important;
      }

      /* Make info cards more opaque for legibility over the heatmap */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-info-card {
        background: rgba(5, 6, 14, 0.88);
      }

      /* Boost text legibility in heatmap mode */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .info-room-name,
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .info-row {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      }

      /* ── Room type icon — large semi-transparent watermark ── */
      .room-type-icon {
        position: absolute;
        bottom: 7px;
        right: 7px;
        --mdc-icon-size: 42px;
        opacity: 0.13;
        pointer-events: none;
        color: white;
      }

      /* ── Front wall ── */
      .room-wall-front {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 18px;
        transform-origin: center bottom;
        transform: rotateX(-90deg);
        border-left: 1px solid rgba(255,255,255,0.03);
        border-right: 1px solid rgba(0,0,0,0.52);
        border-bottom: 2px solid rgba(0,0,0,0.75);
      }

      /* ── Left wall ── */
      .room-wall-left {
        position: absolute;
        top: 0;
        left: -1px;
        bottom: 0;
        width: 18px;
        transform-origin: left center;
        transform: rotateY(-90deg);
        border-top: 1px solid rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(0,0,0,0.48);
        border-left: 2px solid rgba(0,0,0,0.7);
      }

      /* ── Floating info card ── */
      .room-info-card {
        position: absolute;
        top: 7px;
        left: 7px;
        background: rgba(5, 6, 14, 0.78);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 10px;
        padding: 7px 10px 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: calc(100% - 14px);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .info-room-name {
        font-size: 0.82rem;
        font-weight: 600;
        color: rgba(255,255,255,0.96);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.77rem;
        color: rgba(255,255,255,0.88);
        line-height: 1.3;
      }

      /* ── Heatmap legend bar ── */
      .heatmap-legend {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 16px 6px;
        flex-shrink: 0;
      }

      .heatmap-legend-temp {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }

      .heatmap-gradient-bar {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(to right,
          rgb(44,95,163),
          rgb(29,158,117),
          rgb(245,196,62),
          rgb(232,138,48),
          rgb(208,72,72));
      }

      .heatmap-legend-label {
        font-size: 0.7rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .heatmap-legend-hum {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        color: var(--secondary-text-color);
      }

      /* ── Legend bar ── */
      .legend {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 7px 16px 8px;
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        flex-shrink: 0;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }

      .no-floor {
        padding: 32px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 0.9rem;
      }
    `;
  }

  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._activeFloor = 0;
    this._activeHeatmapMode = null;
    // Unique suffix for SVG filter IDs — avoids collisions between card instances.
    this._uid = Math.random().toString(36).slice(2, 8);
    // Tap / long-press state (non-reactive — no re-render needed)
    this._pressRoom = null;
    this._pressTimer = null;
    this._pressStartX = 0;
    this._pressStartY = 0;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = config;
    this._activeFloor = 0;
  }

  set hass(hass) {
    this._hass = hass;
  }

  static getConfigElement() {
    return document.createElement('house-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'My House',
      floors: [{ id: 'ground', name: 'Ground Floor', cols: 8, rows: 6, rooms: [] }],
    };
  }

  // ── Entity helpers ────────────────────────────────────────────────────────

  _getEntityState(entityId) {
    if (!entityId || !this._hass) return null;
    return this._hass.states[entityId] || null;
  }

  _isLightOn(entityId) {
    return this._getEntityState(entityId)?.state === 'on';
  }

  _isOccupied(entityId) {
    return this._getEntityState(entityId)?.state === 'on';
  }

  _getTemperature(entityId) {
    const state = this._getEntityState(entityId);
    if (!state) return null;
    const val = parseFloat(state.state);
    if (isNaN(val)) return null;
    const unit = state.attributes?.unit_of_measurement || '°C';
    return `${val.toFixed(1)}${unit}`;
  }

  _getHumidity(entityId) {
    const state = this._getEntityState(entityId);
    if (!state) return null;
    const val = parseFloat(state.state);
    if (isNaN(val)) return null;
    return `${Math.round(val)}%`;
  }

  /**
   * Returns "r,g,b" from the light's rgb_color attribute when it's on,
   * or a warm-white fallback, or null if the light is off.
   */
  _getLightColor(entityId) {
    const state = this._getEntityState(entityId);
    if (!state || state.state !== 'on') return null;
    const rgb = state.attributes?.rgb_color;
    if (Array.isArray(rgb) && rgb.length === 3) return `${rgb[0]},${rgb[1]},${rgb[2]}`;
    return '255,210,150'; // warm white fallback
  }

  // ── Interaction handlers ──────────────────────────────────────────────────

  _handleRoomTap(room) {
    if (!this._hass || !room.entities?.light) return;
    this._hass.callService('light', 'toggle', { entity_id: room.entities.light });
  }

  _handleRoomLongPress(room) {
    // Open more-info for the most informative entity on this room.
    const entityId = room.entities?.light
      || room.entities?.occupancy
      || room.entities?.temperature
      || room.entities?.humidity;
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _onRoomPointerDown(e, room) {
    if (e.button !== undefined && e.button !== 0) return;
    // Prevent browser long-press menu and subsequent click event.
    e.preventDefault();
    e.stopPropagation();
    this._pressRoom = room;
    this._pressStartX = e.clientX;
    this._pressStartY = e.clientY;
    this._pressTimer = setTimeout(() => {
      this._pressTimer = null;
      this._pressRoom = null;
      this._handleRoomLongPress(room);
    }, 500);
  }

  _onRoomPointerUp(e) {
    if (!this._pressRoom) return;
    const room = this._pressRoom;
    const dx = Math.abs(e.clientX - this._pressStartX);
    const dy = Math.abs(e.clientY - this._pressStartY);
    clearTimeout(this._pressTimer);
    this._pressTimer = null;
    this._pressRoom = null;
    // Only treat as a tap if the pointer didn't move significantly.
    if (dx < 10 && dy < 10) this._handleRoomTap(room);
  }

  _onRoomPointerCancel() {
    clearTimeout(this._pressTimer);
    this._pressTimer = null;
    this._pressRoom = null;
  }

  // ── Heatmap helpers ───────────────────────────────────────────────────────

  _getHeatmapMode() {
    return this._activeHeatmapMode ?? (this._config?.heatmap_mode ?? 'off');
  }

  _cycleHeatmapMode() {
    const modes = ['off', 'temperature', 'humidity', 'combined'];
    const current = this._getHeatmapMode();
    this._activeHeatmapMode = modes[(modes.indexOf(current) + 1) % modes.length];
  }

  _renderHeatmapToggle() {
    const mode = this._getHeatmapMode();
    const modeMap = {
      off:         { icon: 'mdi:thermometer-off', color: 'rgba(135,135,148,0.55)', label: 'Thermal overlay: off' },
      temperature: { icon: 'mdi:thermometer',     color: '#ff8c42',               label: 'Thermal overlay: temperature' },
      humidity:    { icon: 'mdi:water-percent',   color: '#55b2ff',               label: 'Thermal overlay: humidity' },
      combined:    { icon: 'mdi:blur',            color: '#c084fc',               label: 'Thermal overlay: combined' },
    };
    const { icon, color, label } = modeMap[mode] || modeMap.off;
    return html`
      <button class="heatmap-toggle" @click=${this._cycleHeatmapMode} title="${label}">
        <ha-icon icon="${icon}" style="color:${color};--mdc-icon-size:20px;"></ha-icon>
      </button>
    `;
  }

  _tempColour(t, [tMin, tMax]) {
    const stops = [
      { f: 0.0, c: [44,  95,  163] },
      { f: 0.3, c: [29,  158, 117] },
      { f: 0.5, c: [245, 196, 62]  },
      { f: 0.7, c: [232, 138, 48]  },
      { f: 1.0, c: [208, 72,  72]  },
    ];
    const f = Math.max(0, Math.min(1, (t - tMin) / (tMax - tMin)));
    for (let i = 0; i < stops.length - 1; i++) {
      if (f <= stops[i + 1].f) {
        const k = (f - stops[i].f) / (stops[i + 1].f - stops[i].f);
        const c = stops[i].c.map((v, j) => Math.round(v + (stops[i + 1].c[j] - v) * k));
        return `rgb(${c[0]},${c[1]},${c[2]})`;
      }
    }
    return `rgb(${stops.at(-1).c.join(',')})`;
  }

  _hashCode(s) {
    let h = 0;
    for (const ch of s) h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
    return h;
  }

  _mulberry32(seed) {
    return () => {
      let t = seed = (seed + 0x6D2B79F5) | 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  _humidityDroplets(room, floorPct) {
    if (room._hum == null || room._hum < floorPct) return '';
    const rng = this._mulberry32(this._hashCode(room.id || ''));
    const density = Math.max(0, (room._hum - 35) / 65);
    const count = Math.round(density * room.width * room.height * 1.5);
    const out = [];
    for (let i = 0; i < count; i++) {
      const cx = (room.col + rng() * room.width) * 100;
      const cy = (room.row + rng() * room.height) * 100;
      const r  = 1.4 + rng() * 2.6;
      const o  = (0.35 + rng() * 0.35).toFixed(2);
      out.push(svg`<circle cx=${cx} cy=${cy} r=${r} fill="rgba(140,210,255,${o})"/>`);
    }
    return out;
  }

  _renderThermalLayer(floor) {
    const mode = this._getHeatmapMode();
    if (mode === 'off') return '';

    const showTemp = mode === 'temperature' || mode === 'combined';
    const showHum  = mode === 'humidity'    || mode === 'combined';
    const range    = floor.temperature_range || this._config.temperature_range || [16, 26];
    const humFloor = this._config.humidity_floor ?? 50;
    const filterId = `thermalBlur_${this._uid}`;

    const enriched = (floor.rooms || [])
      .filter(r => r.heatmap !== false)
      .map(r => {
        const t = parseFloat(this._getEntityState(r.entities?.temperature)?.state);
        const h = parseFloat(this._getEntityState(r.entities?.humidity)?.state);
        return { ...r, _temp: isNaN(t) ? null : t, _hum: isNaN(h) ? null : h };
      });

    return svg`
      <svg class="thermal-svg"
           viewBox="0 0 ${floor.cols * 100} ${floor.rows * 100}"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="${filterId}" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="42"/>
          </filter>
        </defs>

        ${showTemp ? svg`
          <g filter="url(#${filterId})">
            ${enriched.map(r => svg`
              <rect
                x=${r.col * 100} y=${r.row * 100}
                width=${r.width * 100} height=${r.height * 100}
                fill=${r._temp != null
                  ? this._tempColour(r._temp, range)
                  : 'rgba(80,80,90,0.35)'}
              />`)}
          </g>` : ''}

        ${showHum ? svg`
          <g>
            ${enriched.map(r => this._humidityDroplets(r, humFloor))}
          </g>` : ''}
      </svg>`;
  }

  _renderHeatmapLegend(floor) {
    const mode = this._getHeatmapMode();
    if (mode === 'off') return '';
    const showTemp = mode === 'temperature' || mode === 'combined';
    const showHum  = mode === 'humidity'    || mode === 'combined';
    const range    = floor?.temperature_range || this._config.temperature_range || [16, 26];

    return html`
      <div class="heatmap-legend">
        ${showTemp ? html`
          <div class="heatmap-legend-temp">
            <span class="heatmap-legend-label">${range[0]}°</span>
            <div class="heatmap-gradient-bar"></div>
            <span class="heatmap-legend-label">${range[1]}°</span>
          </div>` : ''}
        ${showHum ? html`
          <div class="heatmap-legend-hum">
            <ha-icon icon="mdi:water-percent" style="color:#55b2ff;--mdc-icon-size:12px;"></ha-icon>
            <span>Humidity</span>
          </div>` : ''}
      </div>
    `;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _renderFloor(floor) {
    if (!floor || !floor.cols || !floor.rows) {
      return html`<div class="no-floor">Floor not configured</div>`;
    }
    const mode = this._getHeatmapMode();
    const rooms = floor.rooms || [];
    const cellWPct = 100 / floor.cols;
    const cellHPct = 100 / floor.rows;

    return html`
      <div class="grid-wrapper">
        <div class="grid-canvas"
             style="aspect-ratio:${floor.cols}/${floor.rows};"
             data-heatmap="${mode}">
          ${this._renderThermalLayer(floor)}
          ${rooms.map(room => this._renderRoom(room, cellWPct, cellHPct))}
        </div>
      </div>
    `;
  }

  _renderRoom(room, cellWPct, cellHPct) {
    const lightOn  = room.entities?.light       ? this._isLightOn(room.entities.light)           : false;
    const occupied = room.entities?.occupancy   ? this._isOccupied(room.entities.occupancy)       : false;
    const temp     = room.entities?.temperature ? this._getTemperature(room.entities.temperature) : null;
    const humidity = room.entities?.humidity    ? this._getHumidity(room.entities.humidity)       : null;
    const lightRgb = room.entities?.light       ? this._getLightColor(room.entities.light)        : null;

    const gap = 0.6;
    const left   = `${room.col   * cellWPct + gap}%`;
    const top    = `${room.row   * cellHPct + gap}%`;
    const width  = `${room.width * cellWPct - gap * 2}%`;
    const height = `${room.height * cellHPct - gap * 2}%`;

    const hasAction = !!(room.entities?.light || room.entities?.occupancy
      || room.entities?.temperature || room.entities?.humidity);
    const faceClass = [
      'room-face',
      lightOn ? 'light-on' : '',
      hasAction ? 'interactive' : '',
    ].filter(Boolean).join(' ');

    const c = room.color;

    /*
     * Light spill: a double box-shadow — tight warm glow plus a wide low-opacity
     * halo. Colour comes from the light's actual rgb_color attribute so a warm
     * bedside lamp glows amber while kitchen spots glow cool white.
     * The CSS transition (400ms) on .room-face animates this smoothly.
     */
    const glowStyle = lightRgb
      ? `box-shadow:0 0 20px 8px rgba(${lightRgb},0.40),0 0 52px 22px rgba(${lightRgb},0.16);`
      : 'box-shadow:none;';

    // Wall shading — warm tint when lit, dark neutral when off.
    const frontWall = lightRgb
      ? `background:linear-gradient(to bottom,rgba(${lightRgb},0.28),rgba(${lightRgb},0.10)),linear-gradient(to bottom,rgba(20,23,40,0.82),rgba(8,10,22,0.96));`
      : `background:linear-gradient(to bottom,${c}1c 0%,${c}06 100%),linear-gradient(to bottom,rgba(20,23,40,0.90),rgba(8,10,22,0.97));`;

    const leftWall = lightRgb
      ? `background:linear-gradient(to right,rgba(${lightRgb},0.10),rgba(${lightRgb},0.24)),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`
      : `background:linear-gradient(to right,${c}15 0%,${c}05 100%),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`;

    const lightIconColor  = lightOn  ? '#ffd700'              : 'rgba(135,135,148,0.55)';
    const personColor     = occupied ? '#4cdf80'              : 'rgba(135,135,148,0.45)';
    const tempColor       = 'rgba(255,168,75,0.92)';
    const humColor        = 'rgba(85,178,255,0.92)';

    const roomIcon = ROOM_TYPE_ICONS[room.room_type];

    return html`
      <div class="room-3d" style="left:${left};top:${top};width:${width};height:${height};">

        <div
          class="${faceClass}"
          style="background-color:${c}0f;${glowStyle}"
          @pointerdown=${(e) => this._onRoomPointerDown(e, room)}
          @pointerup=${(e) => this._onRoomPointerUp(e)}
          @pointercancel=${() => this._onRoomPointerCancel()}
          @pointerleave=${() => this._onRoomPointerCancel()}
        >
          ${roomIcon ? html`
            <ha-icon icon="${roomIcon}" class="room-type-icon"></ha-icon>` : ''}

          <div class="room-info-card">
            <div class="info-header">
              <ha-icon icon="mdi:lightbulb"
                style="color:${lightIconColor};--mdc-icon-size:18px;flex-shrink:0;"></ha-icon>
              <span class="info-room-name">${room.name}</span>
            </div>

            ${temp ? html`
              <div class="info-row">
                <ha-icon icon="mdi:thermometer"
                  style="color:${tempColor};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
                <span>${temp}</span>
              </div>` : ''}

            ${humidity ? html`
              <div class="info-row">
                <ha-icon icon="mdi:water-percent"
                  style="color:${humColor};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
                <span>${humidity}</span>
              </div>` : ''}

            ${room.entities?.occupancy ? html`
              <div class="info-row">
                <ha-icon icon="mdi:account"
                  style="color:${personColor};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
              </div>` : ''}
          </div>
        </div>

        <div class="room-wall-front" style="${frontWall}"></div>
        <div class="room-wall-left"  style="${leftWall}"></div>

      </div>
    `;
  }

  _renderLegend() {
    const i = (icon, color) =>
      html`<ha-icon icon="${icon}" style="color:${color};--mdc-icon-size:14px;"></ha-icon>`;
    return html`
      <div class="legend">
        <div class="legend-item">${i('mdi:lightbulb','#ffd700')}<span>Light On</span></div>
        <div class="legend-item">${i('mdi:lightbulb','rgba(135,135,148,0.55)')}<span>Light Off</span></div>
        <div class="legend-item">${i('mdi:account','#4cdf80')}<span>Occupied</span></div>
        <div class="legend-item">${i('mdi:account','rgba(135,135,148,0.45)')}<span>Unoccupied</span></div>
      </div>
    `;
  }

  render() {
    if (!this._config) return html``;

    const floors = this._config.floors || [];
    const activeFloor = floors[this._activeFloor];
    const showTabs = floors.length > 1;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title || ''}</span>
          ${this._renderHeatmapToggle()}
        </div>

        ${showTabs ? html`
          <div class="floor-tabs">
            ${floors.map((floor, i) => html`
              <button
                class="floor-tab ${i === this._activeFloor ? 'active' : ''}"
                @click=${() => { this._activeFloor = i; }}
              >${floor.name || `Floor ${i + 1}`}</button>
            `)}
          </div>` : ''}

        ${floors.length === 0
          ? html`<div class="no-floor">No floors configured. Click the edit button to get started.</div>`
          : html`
            ${this._renderFloor(activeFloor)}
            ${this._renderHeatmapLegend(activeFloor)}
            ${this._renderLegend()}
          `}
      </ha-card>
    `;
  }
}

customElements.define('house-card', HouseCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'house-card',
  name: 'House Card',
  description: 'Visual floorplan card with grid-based room layout and entity state display.',
  preview: false,
});
