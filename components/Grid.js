import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

import Box from './Box.js';

export default Box
  .extend()
  .mixin(ResizeObserverMixin)
  .observe({
    grid: 'boolean',
    columns: 'integer',
    _autoColumns: {
      type: 'integer',
      empty: 4,
    },
    _lastInlineSize: 'float',
  })
  .observe({
    _resizeObserverEnabled: {
      type: 'boolean',
      get({ columns }) {
        // Only use resize observer if using grid, not explicit columns
        // and CSS containers are not supported.
        return !columns;
      },
    },
    _computedColumns({ columns, _autoColumns }) {
      if (columns) return `${columns}`;
      if (_autoColumns) return `${_autoColumns}`;
      return null;
    },
  })
  .overrides({
    onResizeObserved(entry) {
      const { contentBoxSize } = entry;
      if (!contentBoxSize.length) return;
      const [{ inlineSize }] = contentBoxSize;
      this._lastInlineSize = inlineSize;
    },
  })
  .on({
    _lastInlineSizeChanged(oldValue, inlineSize) {
      if (inlineSize >= 840) {
        this._autoColumns = 12;
      } else if (inlineSize >= 600) {
        this._autoColumns = 8;
      } else {
        this._autoColumns = 4;
      }
    },
    connected() {
      this._lastInlineSize = this.clientWidth;
    },
  })
  .expressions({
    _isFlex({ block, grid }) {
      return !block && !grid;
    },
  })
  .observe({
    _styles({ _computedColumns }) {
      return `:host{grid-template-columns:repeat(${_computedColumns || 4},1fr)}`;
    },
  })
  .recompose(({ refs: { slot } }) => {
    slot.setAttribute('grid', '{grid}');
    slot.setAttribute('flex', '{_isFlex}');
    slot.setAttribute('columns', '{_computedColumns}');
  })
  .html`<style id=styles>{_styles}</style>`
  .recompose(({ refs: { styles } }) => {
    styles.parentNode.prepend(styles);
  })
  .css`
    :host {
      display: grid;
      column-gap: 16px; /* Gutters */
      grid-auto-flow: row;
      grid-template-columns: repeat(1fr, 4);
    }

    :host([y="start"]) { align-items: flex-start; }
    :host([y="end"]) { align-items: flex-end; }
    :host([y="center"]) { align-items: center; }
    :host([y="between"]) { align-items: space-between; }
    :host([y="around"]) { align-items: space-around; }
    :host([y="stretch"]) { align-items: stretch; }
    :host([x="start"]) { justify-content: flex-start; }
    :host([x="end"]) { justify-content: flex-end; }
    :host([x="center"]) { justify-content: center; }
    :host([x="between"]) { justify-content: space-between; }
    :host([x="stretch"]) { justify-content: stretch; }

    #slot {
      --mdw-grid__columns: 4;
      --mdw-grid__columns__4: 1;
      --mdw-grid__columns__8: 0;
      --mdw-grid__columns__12: 0;
    }

    #slot[columns="4"] {
      --mdw-grid__columns: 4;
      --mdw-grid__columns__4: 1;
      --mdw-grid__columns__8: 0;
      --mdw-grid__columns__12: 0;
    }

    #slot[columns="8"] {
      --mdw-grid__columns: 8;
      --mdw-grid__columns__4: 0;
      --mdw-grid__columns__8: 1;
      --mdw-grid__columns__12: 0;
    }

    #slot[columns="12"] {
      --mdw-grid__columns: 12;
      --mdw-grid__columns__4: 0;
      --mdw-grid__columns__8: 0;
      --mdw-grid__columns__12: 1;
    }

    ::slotted(*) {
      --mdw-grid__column-count: var(--mdw-grid__columns);
      --mdw-grid__column-count__4: var(--mdw-grid__column-count);
      --mdw-grid__column-count__8: var(--mdw-grid__column-count);
      --mdw-grid__column-count__12: var(--mdw-grid__column-count);
      grid-column: auto / span calc(
        (min(var(--mdw-grid__column-count__4), 4) * var(--mdw-grid__columns__4))
        + (min(var(--mdw-grid__column-count__8), 8) * var(--mdw-grid__columns__8))
        + (min(var(--mdw-grid__column-count__12), 12) * var(--mdw-grid__columns__12))
      );
    }
    ::slotted([col-span="1"]) { --mdw-grid__column-count: 1; }
    ::slotted([col-span="2"]) { --mdw-grid__column-count: 2; }
    ::slotted([col-span="3"]) { --mdw-grid__column-count: 3; }
    ::slotted([col-span="4"]) { --mdw-grid__column-count: 4; }
    ::slotted([col-span="5"]) { --mdw-grid__column-count: 5; }
    ::slotted([col-span="6"]) { --mdw-grid__column-count: 6; }
    ::slotted([col-span="7"]) { --mdw-grid__column-count: 7; }
    ::slotted([col-span="8"]) { --mdw-grid__column-count: 8; }
    ::slotted([col-span="9"]) { --mdw-grid__column-count: 9; }
    ::slotted([col-span="10"]) { --mdw-grid__column-count: 10; }
    ::slotted([col-span="11"]) { --mdw-grid__column-count: 11; }
    ::slotted([col-span="12"]) { --mdw-grid__column-count: 12; }
    
    ::slotted([col-span="25%"]) { --mdw-grid__column-count: calc(var(--mdw-grid__columns) / 4); }
    ::slotted([col-span="50%"]) { --mdw-grid__column-count: calc(var(--mdw-grid__columns) / 2); }
    ::slotted([col-span="100%"]) { --mdw-grid__column-count: calc(var(--mdw-grid__columns)); }

    ::slotted([col-span-4="1"]) { --mdw-grid__column-count__4: 1; }
    ::slotted([col-span-4="2"]) { --mdw-grid__column-count__4: 2; }
    ::slotted([col-span-4="3"]) { --mdw-grid__column-count__4: 3; }
    ::slotted([col-span-4="4"]) { --mdw-grid__column-count__4: 4; }
    ::slotted([col-span-8="1"]) { --mdw-grid__column-count__8: 1; }
    ::slotted([col-span-8="2"]) { --mdw-grid__column-count__8: 2; }
    ::slotted([col-span-8="3"]) { --mdw-grid__column-count__8: 3; }
    ::slotted([col-span-8="4"]) { --mdw-grid__column-count__8: 4; }
    ::slotted([col-span-8="5"]) { --mdw-grid__column-count__8: 5; }
    ::slotted([col-span-8="6"]) { --mdw-grid__column-count__8: 6; }
    ::slotted([col-span-8="7"]) { --mdw-grid__column-count__8: 7; }
    ::slotted([col-span-8="8"]) { --mdw-grid__column-count__8: 8; }
    ::slotted([col-span-12="1"]) { --mdw-grid__column-count__12: 1; }
    ::slotted([col-span-12="2"]) { --mdw-grid__column-count__12: 2; }
    ::slotted([col-span-12="3"]) { --mdw-grid__column-count__12: 3; }
    ::slotted([col-span-12="4"]) { --mdw-grid__column-count__12: 4; }
    ::slotted([col-span-12="5"]) { --mdw-grid__column-count__12: 5; }
    ::slotted([col-span-12="6"]) { --mdw-grid__column-count__12: 6; }
    ::slotted([col-span-12="7"]) { --mdw-grid__column-count__12: 7; }
    ::slotted([col-span-12="8"]) { --mdw-grid__column-count__12: 8; }
    ::slotted([col-span-12="9"]) { --mdw-grid__column-count__12: 9; }
    ::slotted([col-span-12="10"]) { --mdw-grid__column-count__12: 10; }
    ::slotted([col-span-12="11"]) { --mdw-grid__column-count__12: 11; }
    ::slotted([col-span-12="12"]) { --mdw-grid__column-count__12: 12; }

  `
  .autoRegister('mdw-grid');
