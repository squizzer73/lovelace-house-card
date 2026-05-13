import { LitElement, html, css, svg } from 'lit';
import { ROOM_TYPE_ICONS, DETECTION_TYPES } from './constants.js';
import './house-card-editor.js';

// ── Pure projection functions ────────────────────────────────────────────────
// Maps plan-space (x, y, z) to screen-space (sx, sy).
// x  = horizontal plan coordinate (col × cellSize, grows right)
// y  = depth plan coordinate (row × cellSize, grows "into" the scene)
// z  = vertical height above floor plane (grows upward → decreases sy)
// Increasing y shifts the point down-left in screen space, giving the
// classic axonometric "looking from above and to the right" appearance.
function project(x, y, z, opts) {
  const tilt  = opts?.tilt  ?? 0.55;
  const shear = opts?.shear ?? 0.15;
  return {
    sx: x - y * shear,
    sy: y * tilt - z,
  };
}

// Returns the four floor-plane corners of a room in screen space:
// [top-left, top-right, bottom-right, bottom-left]
function projectRoom(room, z, opts) {
  const x0 = room.col   * 100;
  const y0 = room.row   * 100;
  const x1 = x0 + room.width  * 100;
  const y1 = y0 + room.height * 100;
  return [
    project(x0, y0, z, opts),
    project(x1, y0, z, opts),
    project(x1, y1, z, opts),
    project(x0, y1, z, opts),
  ];
}

class HouseCard extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      _hass: { type: Object },
      _activeFloor: { type: Number },
      _activeHeatmapMode: { type: String },
      _activeLayout: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }

      ha-card {
        overflow: hidden;
        padding: 0;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px 14px 22px;
        overflow: hidden;
        perspective: 2400px;
        perspective-origin: 50% 50%;
      }

      .grid-canvas {
        position: relative;
        /* Width capped by JS (_sizeGridCanvas) so visual height fits wrapper */
        width: 100%;
        height: auto;
        min-height: 80px;
        background: rgba(10, 11, 20, 0.95);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform-origin: 50% 50%;
        transform: rotateX(38deg) rotateY(0deg);
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
        --mdc-icon-size: clamp(36px, 5vw, 80px);
        opacity: 0.13;
        pointer-events: none;
        color: white;
      }

      /* ── Heating indicator — flame icon pulses when actively calling for heat ── */
      @keyframes heat-call-pulse {
        0%   { opacity: 0.65; transform: scale(1.0); }
        50%  { opacity: 1.0;  transform: scale(1.15); }
        100% { opacity: 0.65; transform: scale(1.0); }
      }

      .heat-calling {
        animation: heat-call-pulse 2s ease-in-out infinite;
        color: #ff8c42 !important;
      }

      /* ── Detection icons — row of camera detection indicators ── */
      @keyframes detection-pop {
        0%   { opacity: 0;    transform: scale(1.4); }
        50%  { opacity: 1.0;  transform: scale(0.92); }
        100% { opacity: 1.0;  transform: scale(1.0); }
      }

      .detection-row {
        display: flex;
        align-items: center;
        gap: clamp(3px, 0.4vw, 7px);
      }

      .detection-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 5s ease-out;
      }

      .detection-icon-wrap.active {
        animation: detection-pop 0.5s ease-out forwards;
        transition: opacity 0.3s ease-in;
      }

      /* ── Occupancy watermark — centred person icon, fades with different durations ── */
      @keyframes occupancy-pulse {
        0%   { opacity: 0;    transform: translate(-50%, -50%) scale(1.5); }
        40%  { opacity: 0.30; transform: translate(-50%, -50%) scale(0.95); }
        100% { opacity: 0.22; transform: translate(-50%, -50%) scale(1.0); }
      }

      .occupancy-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-icon-size: 56px;
        opacity: 0;
        pointer-events: none;
        color: #4cdf80;
        transition: opacity 7s ease-out;
      }

      .occupancy-watermark.occupied {
        animation: occupancy-pulse 0.7s ease-out forwards;
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
        border-radius: clamp(8px, 1vw, 16px);
        padding: clamp(7px, 0.8vw, 16px) clamp(10px, 1.2vw, 22px);
        display: flex;
        flex-direction: column;
        gap: clamp(4px, 0.5vw, 10px);
        max-width: calc(100% - 14px);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: clamp(5px, 0.6vw, 10px);
      }

      .info-room-name {
        font-size: clamp(0.8rem, 1.2vw, 1.8rem);
        font-weight: 600;
        color: rgba(255,255,255,0.96);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: clamp(4px, 0.5vw, 8px);
        font-size: clamp(0.75rem, 1.0vw, 1.5rem);
        color: rgba(255,255,255,0.88);
        line-height: 1.3;
      }

      .info-header ha-icon,
      .info-row ha-icon {
        --mdc-icon-size: clamp(16px, 1.4vw, 26px);
        flex-shrink: 0;
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
        font-size: clamp(0.68rem, 1.4vw, 0.85rem);
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .heatmap-legend-hum {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: clamp(0.68rem, 1.4vw, 0.85rem);
        color: var(--secondary-text-color);
      }

      /* ── Legend bar ── */
      .legend {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: clamp(10px, 1.2vw, 22px);
        padding: clamp(5px, 0.5vw, 10px) 16px;
        font-size: clamp(0.72rem, 1.0vw, 1.2rem);
        color: var(--secondary-text-color);
        flex-shrink: 0;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: clamp(3px, 0.4vw, 8px);
        white-space: nowrap;
      }

      .legend-item ha-icon {
        --mdc-icon-size: clamp(13px, 1.1vw, 20px);
      }

      /* ── Axonometric / dollhouse view ── */
      .axo-wrapper {
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px 16px;
        overflow: hidden;
      }

      /*
       * max-width + max-height with aspect-ratio means the browser picks the
       * largest size that fits within BOTH the wrapper width and wrapper height.
       * This ensures two-floor SVGs shrink to fit the card rather than clipping.
       */
      .axo-svg {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        overflow: visible;
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
    this._activeLayout = null;
    // Tap / long-press state (non-reactive — no re-render needed)
    this._pressRoom = null;
    this._pressTimer = null;
    this._pressStartX = 0;
    this._pressStartY = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._gridRO = new ResizeObserver(() => this._sizeGridCanvas());
  }

  disconnectedCallback() {
    this._gridRO?.disconnect();
    this._gridROTarget = null;
    super.disconnectedCallback();
  }

  updated() {
    const wrapper = this.shadowRoot?.querySelector('.grid-wrapper');
    if (wrapper && wrapper !== this._gridROTarget) {
      this._gridRO?.disconnect();
      this._gridRO?.observe(wrapper);
      this._gridROTarget = wrapper;
    }
    this._sizeGridCanvas();
  }

  /**
   * Returns the tight bounding box of all rooms on a floor, in grid cells.
   * Falls back to the full floor dimensions if there are no rooms.
   * { minCol, minRow, usedCols, usedRows }
   */
  _floorBounds(floor) {
    const rooms = floor?.rooms || [];
    if (!rooms.length) {
      return { minCol: 0, minRow: 0, usedCols: floor?.cols || 1, usedRows: floor?.rows || 1 };
    }
    const minCol = Math.min(...rooms.map(r => r.col));
    const minRow = Math.min(...rooms.map(r => r.row));
    const maxCol = Math.max(...rooms.map(r => r.col + r.width));
    const maxRow = Math.max(...rooms.map(r => r.row + r.height));
    return { minCol, minRow, usedCols: maxCol - minCol, usedRows: maxRow - minRow };
  }

  _sizeGridCanvas() {
    const wrapper = this.shadowRoot?.querySelector('.grid-wrapper');
    const canvas  = this.shadowRoot?.querySelector('.grid-canvas');
    if (!wrapper || !canvas) return;
    const wW = wrapper.clientWidth;
    if (!wW) return;
    // Card now auto-sizes to content, so just fill the wrapper width.
    // The aspect-ratio CSS property handles the height automatically.
    canvas.style.width = wW + 'px';
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
   * Returns heating state for a climate / TRV entity.
   * { current, setpoint, unit, calling }
   *   calling = true when hvac_action === 'heating', or (current < setpoint - 0.5) as fallback
   */
  _getHeatingInfo(entityId) {
    const state = this._getEntityState(entityId);
    if (!state) return null;
    const attrs   = state.attributes || {};
    const current = parseFloat(attrs.current_temperature);
    const setpoint = parseFloat(attrs.temperature);
    if (isNaN(current) && isNaN(setpoint)) return null;
    const unit    = attrs.unit_of_measurement || '°C';
    const action  = attrs.hvac_action;
    const calling = action
      ? action === 'heating'
      : (!isNaN(current) && !isNaN(setpoint) && current < setpoint - 0.5);
    return { current: isNaN(current) ? null : current, setpoint: isNaN(setpoint) ? null : setpoint, unit, calling };
  }

  /**
   * Returns detection state for each configured detection entry.
   * [{ type, icon, color, active }]
   */
  _getDetections(detections) {
    if (!detections?.length) return [];
    return detections.map(d => {
      const def    = DETECTION_TYPES[d.type] || { icon: 'mdi:eye', color: '#94a3b8' };
      const active = this._getEntityState(d.entity)?.state === 'on';
      return { type: d.type, icon: def.icon, color: def.color, active };
    });
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
      || room.entities?.climate
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

  // ── Layout (flat / axonometric) helpers ──────────────────────────────────

  _getActiveLayout() {
    return this._activeLayout ?? (this._config.display?.layout ?? 'flat');
  }

  _cycleLayout() {
    this._activeLayout = this._getActiveLayout() === 'flat' ? 'axonometric' : 'flat';
  }

  _renderLayoutToggle() {
    const isAxo = this._getActiveLayout() === 'axonometric';
    return html`
      <button class="heatmap-toggle"
              @click=${this._cycleLayout}
              title="${isAxo ? 'Switch to flat plan view' : 'Switch to dollhouse view'}">
        <ha-icon icon="${isAxo ? 'mdi:floor-plan' : 'mdi:cube-outline'}"
                 style="color:${isAxo ? '#a78bfa' : 'rgba(135,135,148,0.55)'};--mdc-icon-size:20px;">
        </ha-icon>
      </button>
    `;
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

  _renderThermalLayer(floor, minCol = 0, minRow = 0, usedCols = null, usedRows = null) {
    const mode = this._getHeatmapMode();
    if (mode === 'off') return '';

    const showTemp = mode === 'temperature' || mode === 'combined';
    const showHum  = mode === 'humidity'    || mode === 'combined';
    const range    = floor.temperature_range || this._config.temperature_range || [16, 26];
    const humFloor = this._config.humidity_floor ?? 50;

    const vbCols = usedCols ?? floor.cols;
    const vbRows = usedRows ?? floor.rows;

    const enriched = (floor.rooms || [])
      .filter(r => r.heatmap !== false)
      .map(r => {
        const t = parseFloat(this._getEntityState(r.entities?.temperature)?.state);
        const h = parseFloat(this._getEntityState(r.entities?.humidity)?.state);
        // Offset room coordinates to the trimmed origin
        return { ...r,
          col: r.col - minCol, row: r.row - minRow,
          _temp: isNaN(t) ? null : t, _hum: isNaN(h) ? null : h };
      });

    return svg`
      <svg class="thermal-svg"
           viewBox="0 0 ${vbCols * 100} ${vbRows * 100}"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">

        ${showTemp ? svg`
          <g style="filter: blur(50px);">
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

  // ── Axonometric rendering — Phase 2 ──────────────────────────────────────

  _projectionOpts() {
    const d = this._config.display || {};
    return {
      tilt:  d.tilt  ?? 0.55,
      shear: d.shear ?? 0.15,
    };
  }

  _renderAxonometric(floors) {
    if (!floors || floors.length === 0) {
      return html`<div class="no-floor">No floors configured.</div>`;
    }

    const sorted = [...floors].sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    const opts   = this._projectionOpts();
    const d      = this._config.display || {};
    const wallH  = d.wall_height ?? 25;
    const gapH   = d.floor_gap   ?? 250;

    // z = 0 for ground floor, each higher level steps up by (wallH + gapH)
    const floorZs = sorted.map((floor, i) => ({
      floor,
      z: (floor.level ?? i) * (wallH + gapH),
    }));

    // Tight viewBox over all projected corners + wall bottoms
    const allPts = [];
    floorZs.forEach(({ floor, z }) => {
      const w = floor.cols * 100;
      const h = floor.rows * 100;
      [[0,0],[w,0],[w,h],[0,h]].forEach(([x,y]) => {
        allPts.push(project(x, y, z, opts));
        allPts.push(project(x, y, z - wallH, opts));
      });
    });

    const pad  = 50;
    const minX = Math.min(...allPts.map(p => p.sx)) - pad;
    const minY = Math.min(...allPts.map(p => p.sy)) - pad - 20;
    const maxX = Math.max(...allPts.map(p => p.sx)) + pad;
    const maxY = Math.max(...allPts.map(p => p.sy)) + pad;
    const vbW  = maxX - minX;
    const vbH  = maxY - minY;

    return html`
      <div class="axo-wrapper">
        <svg class="axo-svg"
             viewBox="${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}"
             preserveAspectRatio="xMidYMid meet"
             style="aspect-ratio:${(vbW / vbH).toFixed(4)};">
          ${floorZs.map(({ floor, z }, idx) => svg`
            ${this._renderFloorAxo(floor, z, opts, wallH)}
          `)}
          ${floorZs.slice(0, -1).map(({ floor, z }, idx) =>
            this._renderGapLabel(floor, z, floorZs[idx + 1].z, wallH, opts)
          )}
        </svg>
      </div>
    `;
  }

  // z1 = lower floor's z, z2 = upper floor's z (z2 > z1)
  _renderGapLabel(floor, z1, z2, wallH, opts) {
    const gapSize = z2 - z1 - wallH;
    if (gapSize < 40) return '';
    const w   = floor.cols * 100;
    const h   = floor.rows * 100;
    // Place label at vertical midpoint of the empty gap between the two floors,
    // toward the back-right of the scene so it doesn't overlap room labels.
    const midZ = z1 + wallH + gapSize * 0.5;
    const pt  = project(w * 0.72, h * 0.18, midZ, opts);
    return svg`
      <text x="${pt.sx.toFixed(2)}" y="${pt.sy.toFixed(2)}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="var(--primary-font-family, sans-serif)"
            font-size="8" letter-spacing="2"
            fill="rgba(255,255,255,0.22)">── BETWEEN FLOORS ──</text>
    `;
  }

  _renderFloorAxo(floor, z, opts, wallH) {
    if (!floor.cols || !floor.rows) return svg``;

    const w = floor.cols * 100;
    const h = floor.rows * 100;
    const corners = [
      project(0, 0, z, opts),
      project(w, 0, z, opts),
      project(w, h, z, opts),
      project(0, h, z, opts),
    ];
    const floorPts = corners.map(p => `${p.sx.toFixed(2)},${p.sy.toFixed(2)}`).join(' ');

    // Floor label above back edge
    const labelPt = project(w / 2, 0, z + 14, opts);

    // Painter's-algorithm order: back rooms first (ascending row then col)
    const sortedRooms = [...(floor.rooms || [])].sort((a, b) =>
      (a.row * 100 + a.col) - (b.row * 100 + b.col));

    return svg`
      <g class="floor-axo">
        <polygon points="${floorPts}"
                 fill="rgba(10,11,20,0.92)"
                 stroke="rgba(255,255,255,0.10)"
                 stroke-width="1"/>
        ${sortedRooms.map(room => this._renderRoomAxo(room, z, opts, wallH))}
        <text x="${labelPt.sx.toFixed(2)}" y="${(labelPt.sy - 4).toFixed(2)}"
              text-anchor="middle" dominant-baseline="auto"
              font-family="var(--primary-font-family, sans-serif)"
              font-size="10" font-weight="700" letter-spacing="2"
              fill="rgba(255,255,255,0.38)">
          ${(floor.name || 'Floor').toUpperCase()}
        </text>
      </g>
    `;
  }

  _renderRoomAxo(room, z, opts, wallH) {
    const corners = projectRoom(room, z, opts);
    const [c0, c1, c2, c3] = corners;

    // Wall bottom = each floor corner shifted down by wallH in screen-y
    const w0 = { sx: c0.sx, sy: c0.sy + wallH };
    const w1 = { sx: c1.sx, sy: c1.sy + wallH };
    const w2 = { sx: c2.sx, sy: c2.sy + wallH };
    const w3 = { sx: c3.sx, sy: c3.sy + wallH };

    const pts = arr => arr.map(p => `${p.sx.toFixed(2)},${p.sy.toFixed(2)}`).join(' ');

    const color      = room.color || '#4a90d9';
    const lightRgb   = room.entities?.light       ? this._getLightColor(room.entities.light)        : null;
    const occupied   = room.entities?.occupancy   ? this._isOccupied(room.entities.occupancy)        : false;
    const temp       = room.entities?.temperature ? this._getTemperature(room.entities.temperature)  : null;
    const humidity   = room.entities?.humidity    ? this._getHumidity(room.entities.humidity)        : null;
    const heating    = room.entities?.climate     ? this._getHeatingInfo(room.entities.climate)      : null;
    const detections = this._getDetections(room.entities?.detections);

    // Projected centroid
    const cx = (room.col + room.width  / 2) * 100;
    const cy = (room.row + room.height / 2) * 100;
    const ct = project(cx, cy, z, opts);

    // Text sizing proportional to room width — capped small so text never dominates
    const roomW    = room.width * 100;
    const nameSize = Math.max(10, Math.min(18, roomW / 12));
    const infoSize = Math.max(8,  Math.min(12, roomW / 18));

    const hasInfo    = !!(temp || humidity || heating || detections.length);
    const textTotalH = hasInfo ? nameSize + infoSize + 3 : nameSize;
    const nameY      = ct.sy - textTotalH / 2 + nameSize / 2;
    const infoY      = nameY + nameSize * 0.7 + 4;

    // Unlit rooms: neutral dark panels — no per-room colour until a light is on
    const faceFill   = lightRgb ? `rgba(${lightRgb},0.38)` : `rgba(28,32,52,0.88)`;
    const faceStroke = lightRgb ? `rgba(${lightRgb},0.70)` : `rgba(255,255,255,0.10)`;
    const frontFill  = lightRgb ? `rgba(${lightRgb},0.18)` : `rgba(12,15,28,0.90)`;
    const rightFill  = lightRgb ? `rgba(${lightRgb},0.12)` : `rgba(12,15,28,0.85)`;
    const backFill   = lightRgb ? `rgba(${lightRgb},0.08)` : `rgba(8,10,20,0.80)`;
    const leftFill   = lightRgb ? `rgba(${lightRgb},0.06)` : `rgba(8,10,20,0.75)`;

    // Glow ellipse dimensions
    const glowRx = roomW * 0.42;
    const glowRy = (room.height * 100) * 0.42 * (opts.tilt ?? 0.55);

    // Info card geometry — centred, recessed-look rect
    const cardPad    = infoSize * 0.7;
    const cardW      = Math.min(roomW * 0.85, nameSize * 6.5);
    // How many info rows: sensor line + heating line + detection dots line
    const infoLines  = ((temp || humidity) ? 1 : 0) + (heating ? 1 : 0) + (detections.length ? 1 : 0);
    const cardH      = hasInfo
      ? nameSize + infoLines * (infoSize * 1.3) + cardPad * 2 + 2
      : nameSize + cardPad * 2;
    const cardX      = ct.sx - cardW / 2;
    const cardY      = ct.sy - cardH / 2;
    // Text positions inside card
    const cardNameY  = hasInfo ? cardY + cardPad + nameSize * 0.5
                               : cardY + cardH / 2;
    const cardInfoY  = cardNameY + nameSize * 0.6 + infoSize * 0.65 + 2;

    const hasAction = !!(room.entities?.light || room.entities?.occupancy
      || room.entities?.temperature || room.entities?.humidity
      || room.entities?.climate || room.entities?.detections?.length);

    return svg`
      <g class="room-axo"
         pointer-events="all"
         style="${hasAction ? 'cursor:pointer' : ''}"
         @click=${hasAction ? () => this._handleRoomTap(room) : null}>

        <!-- Back wall -->
        <polygon points="${pts([c0, c1, w1, w0])}"
                 fill="${backFill}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Left wall -->
        <polygon points="${pts([c3, c0, w0, w3])}"
                 fill="${leftFill}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Floor face -->
        <polygon points="${pts(corners)}"
                 fill="${faceFill}" stroke="${faceStroke}" stroke-width="0.8"/>

        <!-- Light glow — double ring matching flat card style -->
        ${lightRgb ? svg`
          <ellipse cx="${ct.sx.toFixed(2)}" cy="${ct.sy.toFixed(2)}"
                   rx="${(glowRx * 1.6).toFixed(2)}" ry="${(glowRy * 1.6).toFixed(2)}"
                   fill="rgba(${lightRgb},0.14)"
                   style="filter:blur(22px);"
                   pointer-events="none"/>
          <ellipse cx="${ct.sx.toFixed(2)}" cy="${ct.sy.toFixed(2)}"
                   rx="${glowRx.toFixed(2)}" ry="${glowRy.toFixed(2)}"
                   fill="rgba(${lightRgb},0.32)"
                   style="filter:blur(10px);"
                   pointer-events="none"/>` : ''}

        <!-- Heat glow — warm amber floor bloom when actively calling for heat -->
        ${heating?.calling ? svg`
          <ellipse cx="${ct.sx.toFixed(2)}" cy="${ct.sy.toFixed(2)}"
                   rx="${(glowRx * 1.4).toFixed(2)}" ry="${(glowRy * 1.4).toFixed(2)}"
                   fill="rgba(255,100,20,0.12)"
                   style="filter:blur(28px);"
                   pointer-events="none"/>
          <ellipse cx="${ct.sx.toFixed(2)}" cy="${ct.sy.toFixed(2)}"
                   rx="${(glowRx * 0.7).toFixed(2)}" ry="${(glowRy * 0.7).toFixed(2)}"
                   fill="rgba(255,120,30,0.20)"
                   style="filter:blur(12px);"
                   pointer-events="none"/>` : ''}

        <!-- Front wall -->
        <polygon points="${pts([c3, c2, w2, w3])}"
                 fill="${frontFill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>

        <!-- Right wall -->
        <polygon points="${pts([c1, c2, w2, w1])}"
                 fill="${rightFill}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Recessed info card — shadow offset, then card, then top-edge highlight -->
        <rect x="${(cardX + 1).toFixed(2)}" y="${(cardY + 1).toFixed(2)}"
              width="${cardW.toFixed(2)}" height="${cardH.toFixed(2)}" rx="3"
              fill="rgba(0,0,0,0.45)" pointer-events="none"/>
        <rect x="${cardX.toFixed(2)}" y="${cardY.toFixed(2)}"
              width="${cardW.toFixed(2)}" height="${cardH.toFixed(2)}" rx="3"
              fill="rgba(0,0,0,0.38)" stroke="rgba(255,255,255,0.10)" stroke-width="0.6"
              pointer-events="none"/>
        <line x1="${(cardX + 2).toFixed(2)}" y1="${(cardY + 0.5).toFixed(2)}"
              x2="${(cardX + cardW - 2).toFixed(2)}" y2="${(cardY + 0.5).toFixed(2)}"
              stroke="rgba(255,255,255,0.22)" stroke-width="0.6" pointer-events="none"/>

        <!-- Occupancy person icon -->
        ${occupied ? svg`
          <g pointer-events="none"
             transform="translate(${(cardX + cardW - infoSize * 1.2).toFixed(2)},${(cardY + cardPad * 0.4).toFixed(2)}) scale(${(infoSize * 0.9 / 24).toFixed(4)})">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                  fill="rgba(76,223,128,0.90)"/>
          </g>` : ''}

        <!-- Room name -->
        <text x="${ct.sx.toFixed(2)}" y="${cardNameY.toFixed(2)}"
              text-anchor="middle" dominant-baseline="middle"
              font-family="var(--primary-font-family, sans-serif)"
              font-size="${nameSize.toFixed(1)}" font-weight="600"
              fill="rgba(255,255,255,${lightRgb ? '0.95' : '0.82'})"
              pointer-events="none">
          ${room.name || ''}
        </text>

        ${hasInfo ? (() => {
            const sensorText = [temp, humidity].filter(Boolean).join(' · ');
            const heatText   = heating
              ? (heating.current !== null ? `${heating.current.toFixed(1)}${heating.unit}` : '—') +
                (heating.setpoint !== null ? `→${heating.setpoint.toFixed(1)}${heating.unit}` : '')
              : null;
            const lines  = [sensorText || null, heatText].filter(Boolean);
            const lineH  = infoSize * 1.3;
            // If detections present, leave room for a dot row below the text lines
            const totalTextLines = lines.length + (detections.length ? 1 : 0);
            const startY = totalTextLines > 1 ? cardInfoY - lineH * (totalTextLines - 1) / 2 : cardInfoY;

            // Detection dots: small filled circles, one per configured detection
            const dotR    = Math.max(2.5, infoSize * 0.38);
            const dotGap  = dotR * 2.8;
            const dotsW   = detections.length * dotGap - dotGap * 0.2;
            const dotY    = startY + lines.length * lineH;
            const dotStartX = ct.sx - dotsW / 2 + dotR;

            return svg`
              ${lines.map((line, i) => svg`
                <text x="${ct.sx.toFixed(2)}" y="${(startY + i * lineH).toFixed(2)}"
                      text-anchor="middle" dominant-baseline="middle"
                      font-family="var(--primary-font-family, sans-serif)"
                      font-size="${infoSize.toFixed(1)}"
                      fill="${(line === heatText && heating?.calling) ? 'rgba(255,140,66,0.90)' : 'rgba(255,255,255,0.55)'}"
                      pointer-events="none">
                  ${line}
                </text>`)}
              ${detections.map((d, i) => svg`
                <circle cx="${(dotStartX + i * dotGap).toFixed(2)}" cy="${dotY.toFixed(2)}"
                        r="${dotR.toFixed(2)}"
                        fill="${d.active ? d.color : 'rgba(255,255,255,0.15)'}"
                        pointer-events="none"/>`)}`;
          })() : ''}
      </g>
    `;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  // Returns an inset box-shadow colour tint based on sun.sun elevation.
  // Night → cool blue cast; golden hour → warm amber; full day → neutral.
  _getSunStyle() {
    const sun = this._hass?.states?.['sun.sun'];
    const elevation = sun?.attributes?.elevation ?? null;
    if (elevation === null) return '';

    if (elevation >= 15) {
      // Full day — neutral, no tint
      return '';
    } else if (elevation >= -6) {
      // Golden hour / twilight — warm amber fades in as sun approaches horizon
      const t = (elevation + 6) / 21; // 0 at -6°, 1 at 15°
      const alpha = ((1 - t) * 0.28).toFixed(3);
      return `box-shadow:inset 0 0 140px rgba(255,120,30,${alpha});`;
    } else if (elevation >= -18) {
      // Civil + nautical twilight — deep amber fading to blue
      const t = (elevation + 18) / 12; // 0 at -18°, 1 at -6°
      const amberA = (t * 0.10).toFixed(3);
      const blueA  = ((1 - t) * 0.18).toFixed(3);
      return `box-shadow:inset 0 0 140px rgba(255,100,20,${amberA}),inset 0 0 100px rgba(20,40,120,${blueA});`;
    } else {
      // Deep night — cool blue/navy cast
      return `box-shadow:inset 0 0 100px rgba(20,40,120,0.18);`;
    }
  }

  _renderFloor(floor) {
    if (!floor || !floor.cols || !floor.rows) {
      return html`<div class="no-floor">Floor not configured</div>`;
    }
    const mode   = this._getHeatmapMode();
    const rooms  = floor.rooms || [];
    const sunStyle = this._getSunStyle();

    // Trim canvas to the tight bounding box of actual rooms
    const { minCol, minRow, usedCols, usedRows } = this._floorBounds(floor);
    const cellWPct = 100 / usedCols;
    const cellHPct = 100 / usedRows;

    return html`
      <div class="grid-wrapper">
        <div class="grid-canvas"
             style="aspect-ratio:${usedCols}/${usedRows};${sunStyle}"
             data-heatmap="${mode}">
          ${this._renderThermalLayer(floor, minCol, minRow, usedCols, usedRows)}
          ${rooms.map(room => this._renderRoom(room, cellWPct, cellHPct, minCol, minRow))}
        </div>
      </div>
    `;
  }

  _renderRoom(room, cellWPct, cellHPct, minCol = 0, minRow = 0) {
    const lightOn   = room.entities?.light       ? this._isLightOn(room.entities.light)            : false;
    const occupied  = room.entities?.occupancy  ? this._isOccupied(room.entities.occupancy)        : false;
    const temp      = room.entities?.temperature ? this._getTemperature(room.entities.temperature) : null;
    const humidity  = room.entities?.humidity   ? this._getHumidity(room.entities.humidity)        : null;
    const lightRgb  = room.entities?.light      ? this._getLightColor(room.entities.light)         : null;
    const heating   = room.entities?.climate    ? this._getHeatingInfo(room.entities.climate)      : null;
    const detections = this._getDetections(room.entities?.detections);

    const gap = 0.6;
    const left   = `${(room.col  - minCol) * cellWPct + gap}%`;
    const top    = `${(room.row  - minRow) * cellHPct + gap}%`;
    const width  = `${room.width * cellWPct - gap * 2}%`;
    const height = `${room.height * cellHPct - gap * 2}%`;

    const hasAction = !!(room.entities?.light || room.entities?.occupancy
      || room.entities?.temperature || room.entities?.humidity
      || room.entities?.climate || room.entities?.detections?.length);
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

          ${room.entities?.occupancy ? html`
            <ha-icon icon="mdi:account"
              class="occupancy-watermark ${occupied ? 'occupied' : ''}"></ha-icon>` : ''}

          <div class="room-info-card">
            <div class="info-header">
              <ha-icon icon="mdi:lightbulb"
                style="color:${lightIconColor};--mdc-icon-size:18px;flex-shrink:0;"></ha-icon>
              <span class="info-room-name">${room.name}</span>
            </div>

            ${temp ? html`
              <div class="info-row">
                <ha-icon icon="mdi:thermometer"
                  style="color:${tempColor};flex-shrink:0;"></ha-icon>
                <span>${temp}</span>
              </div>` : ''}

            ${humidity ? html`
              <div class="info-row">
                <ha-icon icon="mdi:water-percent"
                  style="color:${humColor};flex-shrink:0;"></ha-icon>
                <span>${humidity}</span>
              </div>` : ''}

            ${heating ? html`
              <div class="info-row">
                <ha-icon icon="mdi:fire"
                  class="${heating.calling ? 'heat-calling' : ''}"
                  style="color:${heating.calling ? '#ff8c42' : 'rgba(135,135,148,0.55)'};flex-shrink:0;"></ha-icon>
                <span>${heating.current !== null ? `${heating.current.toFixed(1)}${heating.unit}` : '—'}
                  ${heating.setpoint !== null ? `/ ${heating.setpoint.toFixed(1)}${heating.unit}` : ''}</span>
              </div>` : ''}

            ${room.entities?.occupancy ? html`
              <div class="info-row">
                <ha-icon icon="mdi:account"
                  style="color:${personColor};flex-shrink:0;"></ha-icon>
              </div>` : ''}

            ${detections.length ? html`
              <div class="detection-row">
                ${detections.map(d => html`
                  <div class="detection-icon-wrap ${d.active ? 'active' : ''}">
                    <ha-icon icon="${d.icon}"
                      style="color:${d.active ? d.color : 'rgba(135,135,148,0.35)'};
                             --mdc-icon-size:clamp(14px, 1.2vw, 22px);"></ha-icon>
                  </div>`)}
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

    const layout      = this._getActiveLayout();
    const floors      = this._config.floors || [];
    const activeFloor = floors[this._activeFloor];
    // In axonometric mode all floors render simultaneously — tabs make no sense
    const showTabs = floors.length > 1 && layout !== 'axonometric';

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title || ''}</span>
          ${this._renderLayoutToggle()}
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
          : layout === 'axonometric'
            ? this._renderAxonometric(floors)
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
