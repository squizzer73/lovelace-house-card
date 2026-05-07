import { LitElement, html, css } from 'lit';
import './house-card-editor.js';

/**
 * House Card - Visual floorplan card for Home Assistant
 *
 * Config schema:
 * {
 *   type: 'custom:house-card',
 *   title: 'My House',
 *   floors: [
 *     {
 *       id: 'ground',
 *       name: 'Ground Floor',
 *       cols: 8,
 *       rows: 6,
 *       rooms: [
 *         {
 *           id: 'lounge',
 *           name: 'Lounge',
 *           col: 0, row: 0, width: 3, height: 2,
 *           color: '#4a90d9',
 *           entities: {
 *             light: 'light.lounge',
 *             occupancy: 'binary_sensor.lounge_motion',
 *             temperature: 'sensor.lounge_temperature',
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

const LIGHT_ON_COLOR = 'rgba(255, 220, 80, 0.35)';
const LIGHT_OFF_COLOR = 'rgba(255, 255, 255, 0.04)';
const OCCUPIED_COLOR = 'rgba(80, 200, 120, 0.25)';
const ROOM_BORDER = 'rgba(255,255,255,0.15)';

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
        font-family: var(--primary-font-family, sans-serif);
      }

      ha-card {
        overflow: hidden;
        padding: 0;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .floor-tabs {
        display: flex;
        gap: 4px;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
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
        padding: 16px;
        box-sizing: border-box;
      }

      .grid-canvas {
        position: relative;
        width: 100%;
      }

      .room-cell {
        position: absolute;
        box-sizing: border-box;
        border: 1px solid ${ROOM_BORDER};
        border-radius: 4px;
        overflow: hidden;
        transition: background 0.4s ease;
        cursor: default;
      }

      .room-cell.light-on {
        background: ${LIGHT_ON_COLOR};
        box-shadow: inset 0 0 12px rgba(255, 220, 80, 0.2);
      }

      .room-cell.light-off {
        background: ${LIGHT_OFF_COLOR};
      }

      .room-cell.occupied {
        border-color: rgba(80, 200, 120, 0.5);
      }

      .room-label {
        position: absolute;
        bottom: 4px;
        left: 6px;
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--primary-text-color);
        opacity: 0.8;
        pointer-events: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 8px);
      }

      .room-icons {
        position: absolute;
        top: 4px;
        right: 4px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }

      .room-temp {
        position: absolute;
        top: 4px;
        left: 6px;
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--primary-text-color);
        opacity: 0.85;
      }

      .occupancy-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #50c878;
        box-shadow: 0 0 6px rgba(80, 200, 120, 0.8);
      }

      .light-icon {
        color: #ffdc50;
        font-size: 0.8rem;
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
      floors: [
        {
          id: 'ground',
          name: 'Ground Floor',
          cols: 8,
          rows: 6,
          rooms: [],
        },
      ],
    };
  }

  _getEntityState(entityId) {
    if (!entityId || !this._hass) return null;
    return this._hass.states[entityId] || null;
  }

  _isLightOn(entityId) {
    const state = this._getEntityState(entityId);
    return state?.state === 'on';
  }

  _isOccupied(entityId) {
    const state = this._getEntityState(entityId);
    return state?.state === 'on';
  }

  _getTemperature(entityId) {
    const state = this._getEntityState(entityId);
    if (!state) return null;
    const val = parseFloat(state.state);
    if (isNaN(val)) return null;
    const unit = state.attributes?.unit_of_measurement || '°C';
    return `${val.toFixed(1)}${unit}`;
  }

  _renderFloor(floor) {
    if (!floor || !floor.cols || !floor.rows) return html`<div class="no-floor">Floor not configured</div>`;

    const rooms = floor.rooms || [];
    const cols = floor.cols;
    const rows = floor.rows;

    // We render the grid as a percentage-based positioned canvas
    // Each cell = (100/cols)% wide, (100/rows)% tall
    const cellWPct = 100 / cols;
    const cellHPct = 100 / rows;

    // Use a padding-bottom trick to maintain aspect ratio
    const aspectPct = (rows / cols) * 100;

    return html`
      <div class="grid-wrapper">
        <div class="grid-canvas" style="padding-bottom: ${aspectPct}%; position: relative;">
          ${rooms.map(room => this._renderRoom(room, cellWPct, cellHPct))}
        </div>
      </div>
    `;
  }

  _renderRoom(room, cellWPct, cellHPct) {
    const lightOn = room.entities?.light ? this._isLightOn(room.entities.light) : false;
    const occupied = room.entities?.occupancy ? this._isOccupied(room.entities.occupancy) : false;
    const temp = room.entities?.temperature ? this._getTemperature(room.entities.temperature) : null;

    const left = `${room.col * cellWPct}%`;
    const top = `${room.row * cellHPct}%`;
    const width = `${room.width * cellWPct}%`;
    const height = `${room.height * cellHPct}%`;

    const classes = [
      'room-cell',
      lightOn ? 'light-on' : 'light-off',
      occupied ? 'occupied' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div
        class="${classes}"
        style="left:${left}; top:${top}; width:${width}; height:${height};"
      >
        ${temp ? html`<div class="room-temp">${temp}</div>` : ''}
        <div class="room-icons">
          ${occupied ? html`<div class="occupancy-dot"></div>` : ''}
          ${lightOn ? html`<span class="light-icon">💡</span>` : ''}
        </div>
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
