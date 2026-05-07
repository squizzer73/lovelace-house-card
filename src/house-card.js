import { LitElement, html, css } from 'lit';
import './house-card-editor.js';

class HouseCard extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      _hass: { type: Object },
      _activeFloor: { type: Number },
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

      /*
       * Perspective container. overflow:visible so 3D walls aren't clipped.
       * Extra bottom padding so front walls clear the ha-card boundary.
       */
      .grid-wrapper {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 18px 22px 56px 26px;
        min-height: 0;
        perspective: 1300px;
        perspective-origin: 38% -15%;
        overflow: visible;
      }

      /*
       * Floor plane — rotated to give overhead-left perspective.
       * No aspect-ratio here; flex:1 fills the wrapper so the card
       * uses all available space.
       */
      .grid-canvas {
        position: relative;
        flex: 1;
        width: 100%;
        min-height: 80px;
        background: rgba(10, 11, 20, 0.95);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform: rotateX(52deg) rotateY(18deg);
        overflow: visible;
      }

      /* ── Room 3D wrapper (owns absolute position + preserve-3d) ── */
      .room-3d {
        position: absolute;
        box-sizing: border-box;
        transform-style: preserve-3d;
      }

      /* ── Top face (what you look down onto) ── */
      .room-face {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border: 1px solid rgba(75, 80, 110, 0.38);
        background: rgba(30, 33, 52, 0.93);
      }

      .room-face.light-on {
        background: linear-gradient(150deg, rgba(90, 66, 14, 0.97), rgba(46, 31, 5, 0.99));
        border-color: rgba(175, 130, 32, 0.32);
      }

      /*
       * Front wall: pivots 90° from bottom edge toward viewer.
       * Height drives how "tall" the walls look.
       */
      .room-wall-front {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 36px;
        transform-origin: center bottom;
        transform: rotateX(-90deg);
        border-left: 1px solid rgba(255,255,255,0.03);
        border-right: 1px solid rgba(0,0,0,0.52);
        border-bottom: 2px solid rgba(0,0,0,0.75);
      }

      /*
       * Left wall: pivots 90° from left edge toward viewer
       * (visible due to rotateY on the canvas).
       */
      .room-wall-left {
        position: absolute;
        top: 0;
        left: -1px;
        bottom: 0;
        width: 36px;
        transform-origin: left center;
        transform: rotateY(-90deg);
        border-top: 1px solid rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(0,0,0,0.48);
        border-left: 2px solid rgba(0,0,0,0.7);
      }

      /* ── Floating info card (inside top face) ── */
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

  _renderFloor(floor) {
    if (!floor || !floor.cols || !floor.rows) {
      return html`<div class="no-floor">Floor not configured</div>`;
    }
    const rooms = floor.rooms || [];
    const cellWPct = 100 / floor.cols;
    const cellHPct = 100 / floor.rows;

    return html`
      <div class="grid-wrapper">
        <div class="grid-canvas">
          ${rooms.map(room => this._renderRoom(room, cellWPct, cellHPct))}
        </div>
      </div>
    `;
  }

  _renderRoom(room, cellWPct, cellHPct) {
    const lightOn  = room.entities?.light      ? this._isLightOn(room.entities.light)           : false;
    const occupied = room.entities?.occupancy  ? this._isOccupied(room.entities.occupancy)       : false;
    const temp     = room.entities?.temperature ? this._getTemperature(room.entities.temperature) : null;
    const humidity = room.entities?.humidity    ? this._getHumidity(room.entities.humidity)       : null;

    // Small inset gap so dark canvas shows through as wall separation.
    const gap = 0.6;
    const left   = `${room.col   * cellWPct + gap}%`;
    const top    = `${room.row   * cellHPct + gap}%`;
    const width  = `${room.width * cellWPct - gap * 2}%`;
    const height = `${room.height * cellHPct - gap * 2}%`;

    const faceClass = `room-face${lightOn ? ' light-on' : ''}`;
    const c = room.color;

    // Walls tinted with room colour; front wall lighter than left (standard arch shading).
    const frontWall = lightOn
      ? 'background:linear-gradient(to bottom,rgba(138,98,8,0.60),rgba(72,48,4,0.88));'
      : `background:linear-gradient(to bottom,${c}1c 0%,${c}06 100%),linear-gradient(to bottom,rgba(20,23,40,0.90),rgba(8,10,22,0.97));`;

    const leftWall = lightOn
      ? 'background:linear-gradient(to right,rgba(60,42,3,0.92),rgba(115,85,7,0.58));'
      : `background:linear-gradient(to right,${c}15 0%,${c}05 100%),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`;

    const lightColor  = lightOn  ? '#ffd700'               : 'rgba(135,135,148,0.55)';
    const personColor = occupied ? '#4cdf80'               : 'rgba(135,135,148,0.45)';
    const tempColor   = 'rgba(255,168,75,0.92)';
    const humColor    = 'rgba(85,178,255,0.92)';

    return html`
      <div class="room-3d" style="left:${left};top:${top};width:${width};height:${height};">

        <div class="${faceClass}" style="background-color:${c}0f;">

          <div class="room-info-card">

            <div class="info-header">
              <ha-icon icon="mdi:lightbulb"
                style="color:${lightColor};--mdc-icon-size:18px;flex-shrink:0;"></ha-icon>
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
        ${this._config.title ? html`
          <div class="card-header">${this._config.title}</div>` : ''}

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
          : html`${this._renderFloor(activeFloor)}${this._renderLegend()}`}
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
