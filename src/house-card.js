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
        justify-content: space-between;
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
       * Perspective wrapper: the "eye" sits above-left.
       * overflow: visible lets walls extend below/left of the canvas.
       */
      .grid-wrapper {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 20px 48px 32px;
        min-height: 0;
        perspective: 1400px;
        perspective-origin: 38% -20%;
        overflow: visible;
      }

      /*
       * The floor plane: rotated to create the perspective view.
       * rotateX tilts the top away; rotateY shows the left face.
       * transform-style: preserve-3d passes 3D context to children.
       */
      .grid-canvas {
        position: relative;
        width: 100%;
        flex: 1;
        min-height: 80px;
        background: rgba(16, 18, 32, 0.55);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform: rotateX(48deg) rotateY(14deg);
        overflow: visible;
      }

      /* ── Room 3D wrapper (owns position + preserve-3d) ── */
      .room-3d {
        position: absolute;
        box-sizing: border-box;
        transform-style: preserve-3d;
      }

      /* ── Top face (the floor/ceiling we look down onto) ── */
      .room-face {
        position: absolute;
        inset: 0;
        border-radius: 2px;
        overflow: hidden;
        cursor: default;
        border: 1px solid rgba(255,255,255,0.2);
        background-image: linear-gradient(155deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.07) 100%);
      }

      .room-face.light-on {
        background-image: linear-gradient(155deg, rgba(255,235,100,0.52) 0%, rgba(255,185,30,0.24) 100%);
        border-color: rgba(255,215,60,0.45);
        box-shadow: inset 0 0 24px rgba(255,215,60,0.18), 0 0 10px rgba(255,200,50,0.12);
      }

      .room-face.occupied {
        border-color: rgba(80,200,120,0.42);
      }

      /*
       * Front wall: sits at the bottom edge of the top face,
       * pivots 90° around the bottom edge to stand perpendicular to it.
       * This wall faces the viewer in the 3D scene.
       */
      .room-wall-front {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 22px;
        transform-origin: center bottom;
        transform: rotateX(-90deg);
        border-left: 1px solid rgba(255,255,255,0.04);
        border-right: 1px solid rgba(0,0,0,0.45);
        border-bottom: 2px solid rgba(0,0,0,0.6);
      }

      /*
       * Left wall: sits at the left edge of the top face,
       * pivots 90° around the left edge to stand perpendicular.
       * This wall is partially visible when rotateY > 0.
       */
      .room-wall-left {
        position: absolute;
        top: 0;
        left: -1px;
        bottom: 0;
        width: 22px;
        transform-origin: left center;
        transform: rotateY(-90deg);
        border-top: 1px solid rgba(255,255,255,0.04);
        border-bottom: 1px solid rgba(0,0,0,0.4);
        border-left: 2px solid rgba(0,0,0,0.55);
      }

      /* ── Sensor info (top-left of face) ── */
      .room-info {
        position: absolute;
        top: 5px;
        left: 6px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        pointer-events: none;
      }

      .room-temp {
        font-size: 0.82rem;
        font-weight: 700;
        color: rgba(255,255,255,0.95);
        text-shadow: 0 1px 4px rgba(0,0,0,0.85);
        line-height: 1;
      }

      .room-humidity {
        font-size: 0.72rem;
        font-weight: 600;
        color: rgba(140,210,255,0.92);
        text-shadow: 0 1px 4px rgba(0,0,0,0.85);
        line-height: 1;
      }

      /* ── Occupancy dot (top-right of face) ── */
      .occupancy-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #4cdf80;
        box-shadow: 0 0 0 2px rgba(76,223,128,0.3), 0 0 10px rgba(76,223,128,0.75);
        animation: occ-pulse 2s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes occ-pulse {
        0%, 100% {
          box-shadow: 0 0 0 2px rgba(76,223,128,0.3), 0 0 10px rgba(76,223,128,0.75);
        }
        50% {
          box-shadow: 0 0 0 4px rgba(76,223,128,0.15), 0 0 18px rgba(76,223,128,0.95);
        }
      }

      /* ── Room name (bottom gradient overlay on top face) ── */
      .room-label {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 6px 6px 5px;
        font-size: 0.72rem;
        font-weight: 600;
        color: rgba(255,255,255,0.93);
        text-align: center;
        text-shadow: 0 1px 4px rgba(0,0,0,0.95);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%);
        pointer-events: none;
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
        <div class="grid-canvas" style="aspect-ratio: ${floor.cols} / ${floor.rows};">
          ${rooms.map(room => this._renderRoom(room, cellWPct, cellHPct))}
        </div>
      </div>
    `;
  }

  _renderRoom(room, cellWPct, cellHPct) {
    const lightOn = room.entities?.light ? this._isLightOn(room.entities.light) : false;
    const occupied = room.entities?.occupancy ? this._isOccupied(room.entities.occupancy) : false;
    const temp = room.entities?.temperature ? this._getTemperature(room.entities.temperature) : null;
    const humidity = room.entities?.humidity ? this._getHumidity(room.entities.humidity) : null;

    const left = `${room.col * cellWPct}%`;
    const top = `${room.row * cellHPct}%`;
    const width = `${room.width * cellWPct}%`;
    const height = `${room.height * cellHPct}%`;

    const faceClasses = [
      'room-face',
      lightOn ? 'light-on' : '',
      occupied ? 'occupied' : '',
    ].filter(Boolean).join(' ');

    // Wall shading: front wall is medium-dark; left wall is darkest (more shadow).
    // Light-on rooms bleed warm amber onto the walls.
    const c = room.color;
    const frontWallStyle = lightOn
      ? 'background: linear-gradient(to bottom, rgba(165,115,12,0.52), rgba(85,52,6,0.78));'
      : `background: linear-gradient(to bottom, ${c}22 0%, ${c}08 100%), linear-gradient(to bottom, rgba(28,32,55,0.82), rgba(14,17,38,0.95));`;

    const leftWallStyle = lightOn
      ? 'background: linear-gradient(to right, rgba(75,48,5,0.82), rgba(140,95,10,0.5));'
      : `background: linear-gradient(to right, ${c}18 0%, ${c}06 100%), linear-gradient(to right, rgba(14,17,38,0.92), rgba(22,26,54,0.78));`;

    return html`
      <div class="room-3d" style="left:${left}; top:${top}; width:${width}; height:${height};">
        <div class="${faceClasses}" style="background-color:${c}1a;">
          ${(temp || humidity) ? html`
            <div class="room-info">
              ${temp ? html`<span class="room-temp">${temp}</span>` : ''}
              ${humidity ? html`<span class="room-humidity">💧 ${humidity}</span>` : ''}
            </div>
          ` : ''}
          ${occupied ? html`<div class="occupancy-dot"></div>` : ''}
          <div class="room-label">${room.name}</div>
        </div>
        <div class="room-wall-front" style="${frontWallStyle}"></div>
        <div class="room-wall-left" style="${leftWallStyle}"></div>
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
          <div class="card-header">${this._config.title}</div>
        ` : ''}

        ${showTabs ? html`
          <div class="floor-tabs">
            ${floors.map((floor, i) => html`
              <button
                class="floor-tab ${i === this._activeFloor ? 'active' : ''}"
                @click=${() => { this._activeFloor = i; }}
              >${floor.name || `Floor ${i + 1}`}</button>
            `)}
          </div>
        ` : ''}

        ${floors.length === 0
          ? html`<div class="no-floor">No floors configured. Click the edit button to get started.</div>`
          : this._renderFloor(activeFloor)
        }
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
