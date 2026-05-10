import { LitElement, html, css } from 'lit';
import { ROOM_TYPE_LABELS } from './constants.js';

/**
 * House Card Editor
 *
 * Editor state machine:
 *   'floors'   → manage floors list
 *   'grid'     → painting rooms on the grid for a floor
 *   'room'     → editing a specific room's name + entities
 */

const EDITOR_STATES = {
  FLOORS: 'floors',
  GRID: 'grid',
  ROOM: 'room',
};

// Colours offered in the room editor (future use, wired in now)
const ROOM_COLORS = [
  '#3d5a78', '#4d4870', '#2d5a40', '#6a4530',
  '#6a3055', '#2a5550', '#5a5020', '#6a4020',
];

class HouseCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _editorState: { type: String },
      _activeFloorIdx: { type: Number },
      _activeRoomId: { type: String },
      // Grid painting state
      _dragStart: { type: Object },
      _dragCurrent: { type: Object },
      _isDragging: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 4px 0;
      }

      /* ── Section headers ── */
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .back-btn {
        background: none;
        border: none;
        color: var(--primary-color, #4a90d9);
        cursor: pointer;
        font-size: 0.85rem;
        padding: 4px 0;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* ── Floors list ── */
      .floor-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .floor-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
        border-radius: 8px;
        border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
      }

      .floor-item-name {
        flex: 1;
        font-size: 0.9rem;
        color: var(--primary-text-color);
      }

      .floor-item-meta {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }

      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--secondary-text-color);
        border-radius: 4px;
        transition: color 0.2s, background 0.2s;
      }

      .icon-btn:hover {
        color: var(--primary-text-color);
        background: rgba(255,255,255,0.08);
      }

      .icon-btn.danger:hover {
        color: var(--error-color, #f44336);
        background: rgba(244,67,54,0.1);
      }

      .icon-btn.edit {
        color: var(--primary-color, #4a90d9);
      }

      /* ── Add floor form ── */
      .add-floor-form {
        display: grid;
        grid-template-columns: 1fr 80px 80px;
        gap: 8px;
        align-items: end;
        padding: 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.03));
        border-radius: 8px;
        border: 1px dashed var(--divider-color, rgba(255,255,255,0.15));
        margin-bottom: 16px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .form-label {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      input[type="text"],
      input[type="number"],
      select {
        background: var(--card-background-color, #1c1c1e);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 6px;
        color: var(--primary-text-color);
        padding: 6px 10px;
        font-size: 0.9rem;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      }

      input:focus, select:focus {
        border-color: var(--primary-color, #4a90d9);
      }

      /* ── Buttons ── */
      .btn {
        padding: 8px 14px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn-primary {
        background: var(--primary-color, #4a90d9);
        color: white;
      }

      .btn-primary:hover {
        filter: brightness(1.1);
      }

      .btn-secondary {
        background: var(--secondary-background-color, rgba(255,255,255,0.08));
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
      }

      .btn-secondary:hover {
        background: rgba(255,255,255,0.12);
      }

      .btn-danger {
        background: rgba(244,67,54,0.15);
        color: var(--error-color, #f44336);
        border: 1px solid rgba(244,67,54,0.3);
      }

      /* ── Grid painter ── */
      .grid-instructions {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-bottom: 12px;
        line-height: 1.5;
      }

      .grid-painter {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        margin-bottom: 16px;
        border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        border-radius: 8px;
        overflow: hidden;
        cursor: crosshair;
      }

      .grid-cell {
        position: absolute;
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.06);
        transition: background 0.1s;
      }

      .grid-cell.empty {
        background: rgba(255,255,255,0.02);
      }

      .grid-cell.preview {
        background: rgba(74, 144, 217, 0.25);
        border-color: rgba(74, 144, 217, 0.5);
      }

      .room-overlay {
        position: absolute;
        box-sizing: border-box;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: filter 0.2s;
        cursor: pointer;
      }

      .room-overlay:hover {
        filter: brightness(1.2);
        z-index: 10;
      }

      .room-overlay-name {
        font-size: 0.65rem;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        text-align: center;
        padding: 2px 4px;
        pointer-events: none;
      }

      .room-overlay-del {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
        background: rgba(244,67,54,0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .room-overlay:hover .room-overlay-del {
        opacity: 1;
      }

      /* ── Room name dialog ── */
      .room-name-dialog {
        margin: 12px 0;
        padding: 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
        border-radius: 8px;
        border: 1px solid var(--primary-color, #4a90d9);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .room-name-dialog-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .dialog-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      /* ── Room entity editor ── */
      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .entity-row:last-child {
        border-bottom: none;
      }

      .entity-type-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
      }

      .rooms-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }

      .room-list-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: var(--secondary-background-color, rgba(255,255,255,0.04));
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
      }

      .room-list-item:hover {
        border-color: var(--primary-color, #4a90d9);
        background: rgba(74,144,217,0.08);
      }

      .room-list-item .room-color-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .divider {
        height: 1px;
        background: var(--divider-color, rgba(255,255,255,0.08));
        margin: 16px 0;
      }

      .picker-loading {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        padding: 8px 0;
      }

      .hint {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        font-style: italic;
        margin-top: 4px;
      }
    `;
  }

  constructor() {
    super();
    this._editorState = EDITOR_STATES.FLOORS;
    this._activeFloorIdx = 0;
    this._activeRoomId = null;
    this._dragStart = null;
    this._dragCurrent = null;
    this._isDragging = false;
    this._pendingRoom = null; // { col, row, width, height } awaiting name
    this._pendingName = '';
    this._newFloorName = '';
    this._newFloorCols = 8;
    this._newFloorRows = 6;
  }

  setConfig(config) {
    this._config = { ...config };
  }

  async firstUpdated() {
    // ha-entity-picker is lazy-registered by HA. Force-load it now (on the
    // floors list render) so it's ready by the time the user drills into a room.
    if (!customElements.get('ha-entity-picker')) {
      const helpers = await window.loadCardHelpers();
      const card = await helpers.createCardElement({ type: 'entities', entities: [] });
      await card.constructor.getConfigElement();
    }
    // Re-render so any room view that rendered before the await resolved
    // upgrades its unknown tags into real pickers.
    this.requestUpdate();
  }

  _fireConfigChanged() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // ── Floor management ──────────────────────────────────────────────────

  _addFloor() {
    const name = this._newFloorName.trim() || `Floor ${(this._config.floors?.length || 0) + 1}`;
    const cols = Math.max(4, Math.min(16, parseInt(this._newFloorCols) || 8));
    const rows = Math.max(3, Math.min(12, parseInt(this._newFloorRows) || 6));
    const id = `floor_${Date.now()}`;

    this._config = {
      ...this._config,
      floors: [
        ...(this._config.floors || []),
        { id, name, cols, rows, rooms: [] },
      ],
    };
    this._newFloorName = '';
    this._newFloorCols = 8;
    this._newFloorRows = 6;
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _deleteFloor(idx) {
    const floors = [...(this._config.floors || [])];
    floors.splice(idx, 1);
    this._config = { ...this._config, floors };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _editFloor(idx) {
    this._activeFloorIdx = idx;
    this._editorState = EDITOR_STATES.GRID;
    this._pendingRoom = null;
    this.requestUpdate();
  }

  // ── Grid painting ─────────────────────────────────────────────────────

  _getActiveFloor() {
    return this._config.floors?.[this._activeFloorIdx] || null;
  }

  _getCellFromEvent(e, gridEl, floor) {
    const rect = gridEl.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const col = Math.floor(relX * floor.cols);
    const row = Math.floor(relY * floor.rows);
    return {
      col: Math.max(0, Math.min(floor.cols - 1, col)),
      row: Math.max(0, Math.min(floor.rows - 1, row)),
    };
  }

  _onGridMouseDown(e) {
    if (e.button !== 0) return;
    const floor = this._getActiveFloor();
    if (!floor) return;
    const gridEl = this.shadowRoot.querySelector('.grid-painter');
    const cell = this._getCellFromEvent(e, gridEl, floor);
    this._dragStart = cell;
    this._dragCurrent = cell;
    this._isDragging = true;
    e.preventDefault();
  }

  _onGridMouseMove(e) {
    if (!this._isDragging) return;
    const floor = this._getActiveFloor();
    if (!floor) return;
    const gridEl = this.shadowRoot.querySelector('.grid-painter');
    const cell = this._getCellFromEvent(e, gridEl, floor);
    this._dragCurrent = cell;
    this.requestUpdate();
  }

  _onGridMouseUp(e) {
    if (!this._isDragging) return;
    this._isDragging = false;
    const start = this._dragStart;
    const end = this._dragCurrent;

    const col = Math.min(start.col, end.col);
    const row = Math.min(start.row, end.row);
    const width = Math.abs(end.col - start.col) + 1;
    const height = Math.abs(end.row - start.row) + 1;

    // Check for overlap with existing rooms
    const floor = this._getActiveFloor();
    const overlaps = (floor.rooms || []).some(r =>
      col < r.col + r.width &&
      col + width > r.col &&
      row < r.row + r.height &&
      row + height > r.row
    );

    if (overlaps) {
      this._dragStart = null;
      this._dragCurrent = null;
      this.requestUpdate();
      return;
    }

    this._pendingRoom = { col, row, width, height };
    this._pendingName = '';
    this._dragStart = null;
    this._dragCurrent = null;
    this.requestUpdate();
  }

  _confirmRoom() {
    const name = this._pendingName.trim();
    if (!name || !this._pendingRoom) return;

    const floor = this._getActiveFloor();
    const colorIdx = (floor.rooms?.length || 0) % ROOM_COLORS.length;
    const newRoom = {
      id: `room_${Date.now()}`,
      name,
      color: ROOM_COLORS[colorIdx],
      ...this._pendingRoom,
      entities: {},
    };

    const floors = [...(this._config.floors || [])];
    floors[this._activeFloorIdx] = {
      ...floor,
      rooms: [...(floor.rooms || []), newRoom],
    };
    this._config = { ...this._config, floors };
    this._pendingRoom = null;
    this._pendingName = '';
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _cancelRoom() {
    this._pendingRoom = null;
    this._pendingName = '';
    this.requestUpdate();
  }

  _deleteRoom(roomId) {
    const floor = this._getActiveFloor();
    const floors = [...(this._config.floors || [])];
    floors[this._activeFloorIdx] = {
      ...floor,
      rooms: (floor.rooms || []).filter(r => r.id !== roomId),
    };
    this._config = { ...this._config, floors };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _editRoom(roomId) {
    this._activeRoomId = roomId;
    this._editorState = EDITOR_STATES.ROOM;
    this.requestUpdate();
  }

  // ── Room entity editor ────────────────────────────────────────────────

  _getActiveRoom() {
    const floor = this._getActiveFloor();
    return (floor?.rooms || []).find(r => r.id === this._activeRoomId) || null;
  }

  _updateRoomEntity(roomId, entityType, value) {
    const floor = this._getActiveFloor();
    const floors = [...(this._config.floors || [])];
    floors[this._activeFloorIdx] = {
      ...floor,
      rooms: (floor.rooms || []).map(r => {
        if (r.id !== roomId) return r;
        return { ...r, entities: { ...r.entities, [entityType]: value } };
      }),
    };
    this._config = { ...this._config, floors };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _updateRoomType(roomId, roomType) {
    const floor = this._getActiveFloor();
    const floors = [...(this._config.floors || [])];
    floors[this._activeFloorIdx] = {
      ...floor,
      rooms: (floor.rooms || []).map(r => r.id === roomId ? { ...r, room_type: roomType || undefined } : r),
    };
    this._config = { ...this._config, floors };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  _updateRoomName(roomId, name) {
    const floor = this._getActiveFloor();
    const floors = [...(this._config.floors || [])];
    floors[this._activeFloorIdx] = {
      ...floor,
      rooms: (floor.rooms || []).map(r => r.id === roomId ? { ...r, name } : r),
    };
    this._config = { ...this._config, floors };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  // ── Render helpers ────────────────────────────────────────────────────

  _getPreviewRect() {
    if (!this._dragStart || !this._dragCurrent) return null;
    const s = this._dragStart;
    const e = this._dragCurrent;
    return {
      col: Math.min(s.col, e.col),
      row: Math.min(s.row, e.row),
      width: Math.abs(e.col - s.col) + 1,
      height: Math.abs(e.row - s.row) + 1,
    };
  }

  _renderGridPainter(floor) {
    const cols = floor.cols;
    const rows = floor.rows;
    const cellWPct = 100 / cols;
    const cellHPct = 100 / rows;
    const aspectPct = (rows / cols) * 100;
    const preview = this._getPreviewRect();

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const inPreview = preview &&
          c >= preview.col && c < preview.col + preview.width &&
          r >= preview.row && r < preview.row + preview.height;

        cells.push(html`
          <div
            class="grid-cell ${inPreview ? 'preview' : 'empty'}"
            style="
              left:${c * cellWPct}%;
              top:${r * cellHPct}%;
              width:${cellWPct}%;
              height:${cellHPct}%;
            "
          ></div>
        `);
      }
    }

    const roomOverlays = (floor.rooms || []).map(room => html`
      <div
        class="room-overlay"
        style="
          left:${room.col * cellWPct}%;
          top:${room.row * cellHPct}%;
          width:${room.width * cellWPct}%;
          height:${room.height * cellHPct}%;
          background:${room.color}55;
          border-color:${room.color};
        "
        @click=${(e) => { e.stopPropagation(); this._editRoom(room.id); }}
      >
        <div class="room-overlay-name">${room.name}</div>
        <div
          class="room-overlay-del"
          @click=${(e) => { e.stopPropagation(); this._deleteRoom(room.id); }}
        >✕</div>
      </div>
    `);

    return html`
      <div
        class="grid-painter"
        style="padding-bottom:${aspectPct}%; position:relative;"
        @mousedown=${this._onGridMouseDown}
        @mousemove=${this._onGridMouseMove}
        @mouseup=${this._onGridMouseUp}
        @mouseleave=${() => { if(this._isDragging) this._onGridMouseUp(); }}
      >
        ${cells}
        ${roomOverlays}
      </div>
    `;
  }

  // ── Render states ─────────────────────────────────────────────────────

  _renderFloorsState() {
    const floors = this._config.floors || [];

    return html`
      <div class="section-header">
        <div class="section-title">Floors</div>
      </div>

      <div class="floor-list">
        ${floors.length === 0 ? html`
          <div class="hint">No floors yet — add one below.</div>
        ` : floors.map((floor, i) => html`
          <div class="floor-item">
            <div class="floor-item-name">${floor.name}</div>
            <div class="floor-item-meta">${floor.cols}×${floor.rows} · ${(floor.rooms || []).length} rooms</div>
            <button class="icon-btn edit" @click=${() => this._editFloor(i)} title="Edit layout">✏️</button>
            <button class="icon-btn danger" @click=${() => this._deleteFloor(i)} title="Delete floor">🗑</button>
          </div>
        `)}
      </div>

      <div class="add-floor-form">
        <div class="form-field">
          <label class="form-label">Floor Name</label>
          <input
            type="text"
            .value=${this._newFloorName}
            placeholder="e.g. Ground Floor"
            @input=${(e) => { this._newFloorName = e.target.value; }}
          />
        </div>
        <div class="form-field">
          <label class="form-label">Columns</label>
          <input
            type="number"
            .value=${this._newFloorCols}
            min="4" max="16"
            @input=${(e) => { this._newFloorCols = e.target.value; }}
          />
        </div>
        <div class="form-field">
          <label class="form-label">Rows</label>
          <input
            type="number"
            .value=${this._newFloorRows}
            min="3" max="12"
            @input=${(e) => { this._newFloorRows = e.target.value; }}
          />
        </div>
      </div>
      <button class="btn btn-primary" @click=${this._addFloor}>+ Add Floor</button>

      <div class="divider"></div>

      <div class="form-field">
        <label class="form-label">Card Title</label>
        <input
          type="text"
          .value=${this._config.title || ''}
          placeholder="My House"
          @input=${(e) => {
            this._config = { ...this._config, title: e.target.value };
            this._fireConfigChanged();
          }}
        />
      </div>
    `;
  }

  _renderGridState() {
    const floor = this._getActiveFloor();
    if (!floor) return html`<div>Floor not found</div>`;

    const rooms = floor.rooms || [];

    return html`
      <div class="section-header">
        <button class="back-btn" @click=${() => { this._editorState = EDITOR_STATES.FLOORS; this._pendingRoom = null; }}>
          ← Floors
        </button>
        <div class="section-title">${floor.name}</div>
      </div>

      <p class="grid-instructions">
        Click and drag on the grid to draw a room rectangle. Click a room to edit its entities. Hover a room and click ✕ to remove it.
      </p>

      ${this._renderGridPainter(floor)}

      ${this._pendingRoom ? html`
        <div class="room-name-dialog">
          <div class="room-name-dialog-title">Name this room (${this._pendingRoom.width}×${this._pendingRoom.height})</div>
          <div class="form-field">
            <input
              type="text"
              .value=${this._pendingName}
              placeholder="e.g. Lounge"
              autofocus
              @input=${(e) => { this._pendingName = e.target.value; }}
              @keydown=${(e) => { if (e.key === 'Enter') this._confirmRoom(); if (e.key === 'Escape') this._cancelRoom(); }}
            />
          </div>
          <div class="dialog-actions">
            <button class="btn btn-secondary" @click=${this._cancelRoom}>Cancel</button>
            <button class="btn btn-primary" @click=${this._confirmRoom}>Add Room</button>
          </div>
        </div>
      ` : ''}

      ${rooms.length > 0 ? html`
        <div class="divider"></div>
        <div class="section-title" style="margin-bottom:10px;">Rooms on this floor</div>
        <div class="rooms-list">
          ${rooms.map(room => html`
            <div class="room-list-item" @click=${() => this._editRoom(room.id)}>
              <div class="room-color-dot" style="background:${room.color};"></div>
              <div style="flex:1;font-size:0.88rem;">${room.name}</div>
              <div style="font-size:0.75rem;color:var(--secondary-text-color);">
                ${room.width}×${room.height}
                ${room.entities?.light || room.entities?.occupancy || room.entities?.temperature || room.entities?.humidity ? '· entities configured' : '· no entities'}
              </div>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }

  _renderRoomState() {
    const room = this._getActiveRoom();
    const floor = this._getActiveFloor();
    if (!room) return html`<div>Room not found</div>`;

    return html`
      <div class="section-header">
        <button class="back-btn" @click=${() => { this._editorState = EDITOR_STATES.GRID; this._activeRoomId = null; }}>
          ← ${floor?.name}
        </button>
        <div class="section-title">${room.name}</div>
      </div>

      <div class="form-field" style="margin-bottom:12px;">
        <label class="form-label">Room Name</label>
        <input
          type="text"
          .value=${room.name}
          @input=${(e) => this._updateRoomName(room.id, e.target.value)}
        />
      </div>

      <div class="form-field" style="margin-bottom:16px;">
        <label class="form-label">Room Type</label>
        <select
          .value=${room.room_type || ''}
          @change=${(e) => this._updateRoomType(room.id, e.target.value)}
        >
          <option value="">— None —</option>
          ${Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => html`
            <option value="${key}" ?selected=${room.room_type === key}>${label}</option>
          `)}
        </select>
      </div>

      <div class="section-title" style="margin-bottom:8px;">Entity Bindings</div>

      ${[
        { key: 'light', label: 'Light', domains: ['light'] },
        { key: 'occupancy', label: 'Occupancy', domains: ['binary_sensor'] },
        { key: 'temperature', label: 'Temperature', domains: ['sensor'] },
        { key: 'humidity', label: 'Humidity', domains: ['sensor'] },
      ].map(({ key, label, domains }) => html`
        <div class="entity-row">
          <div class="entity-type-label">${label}</div>
          ${customElements.get('ha-entity-picker')
            ? html`<ha-entity-picker
                .hass=${this.hass}
                .value=${room.entities?.[key] || ''}
                .includeDomains=${domains}
                allow-custom-entity
                @value-changed=${(e) => this._updateRoomEntity(room.id, key, e.detail.value)}
              ></ha-entity-picker>`
            : html`<div class="picker-loading">Loading…</div>`}
        </div>
      `)}
    `;
  }

  render() {
    if (!this._config) return html`<div>Loading...</div>`;

    switch (this._editorState) {
      case EDITOR_STATES.GRID: return this._renderGridState();
      case EDITOR_STATES.ROOM: return this._renderRoomState();
      default: return this._renderFloorsState();
    }
  }
}

customElements.define('house-card-editor', HouseCardEditor);
