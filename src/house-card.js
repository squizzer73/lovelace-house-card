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

      .grid-wrapper {
        padding: 12px;
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .grid-canvas {
        position: relative;
        width: 100%;
        flex: 1;
        min-height: 80px;
      }

      /* ── Room cell — 3D raised tile ── */

      .room-cell {
        position: absolute;
        box-sizing: border-box;
        border-radius: 6px;
        overflow: hidden;
        cursor: default;
        transition: box-shadow 0.4s ease;
        /* Asymmetric borders: bright top/left, dark bottom/right */
        border-top: 1px solid rgba(255,255,255,0.18);
        border-left: 1px solid rgba(255,255,255,0.12);
        border-right: 1px solid rgba(0,0,0,0.28);
        border-bottom: 1px solid rgba(0,0,0,0.35);
        /* Drop shadow + inner highlight */
        box-shadow: 2px 3px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
        /* Depth gradient on top of inline background-color */
        background-image: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.1) 100%);
      }

      .room-cell.light-on {
        background-image: linear-gradient(145deg, rgba(255,235,100,0.48) 0%, rgba(255,185,30,0.22) 100%);
        box-shadow: 2px 3px 6px rgba(0,0,0,0.45),
                    inset 0 0 22px rgba(255,220,80,0.18),
                    0 0 12px rgba(255,200,50,0.14);
      }

      .room-cell.occupied {
        border-top-color: rgba(80,200,120,0.45);
        border-left-color: rgba(80,200,120,0.35);
      }

      /* ── Sensor info (top-left) ── */

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

      /* ── Occupancy dot (top-right) ── */

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

      /* ── Room name (bottom gradient overlay) ── */

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

    const classes = [
      'room-cell',
      lightOn ? 'light-on' : '',
      occupied ? 'occupied' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div
        class="${classes}"
        style="left:${left}; top:${top}; width:${width}; height:${height}; background-color:${room.color}22;"
      >
        ${(temp || humidity) ? html`
          <div class="room-info">
            ${temp ? html`<span class="room-temp">${temp}</span>` : ''}
            ${humidity ? html`<span class="room-humidity">💧 ${humidity}</span>` : ''}
          </div>
        ` : ''}
        ${occupied ? html`<div class="occupancy-dot"></div>` : ''}
        <div class="room-label">${room.name}</div>
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
