import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

const SUPPORTS_CSS_CONTAINERS = CSS.supports('container', 'x');

/**
 * Containers are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    inline: 'boolean',
    grid: 'boolean',
    block: {
      type: 'boolean',
      empty: true,
    },
    columns: 'integer',
    _autoColumns: {
      type: 'integer',
      empty: SUPPORTS_CSS_CONTAINERS ? null : 4,
    },
  })
  .observe({
    _resizeObserverEnabled: {
      type: 'boolean',
      get({ grid, columns }) {
        // Only use resize observer if using grid, not explicit columns
        // and CSS containers are not supported.
        return !SUPPORTS_CSS_CONTAINERS && grid && !columns;
      },
    },
  })
  .overrides({
    onResizeObserved(entry) {
      const { borderBoxSize } = entry;
      if (!borderBoxSize.length) return;
      const [{ inlineSize }] = borderBoxSize;
      if (inlineSize >= 840) {
        this._autoColumns = 12;
      } else if (inlineSize >= 600) {
        this._autoColumns = 8;
      } else {
        this._autoColumns = 4;
      }
    },
  })
  .css`
    :host {
      display: block;
    }
    
    :host([inline]) {
      display: inline-block;
    }
    
    :host([flex]:where([inline])) {
      display: inline-flex;
    }

    :host([color]) {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }

    :host(:is([color="none"],[color="transparent"])) {
      background-color: transparent;
      color: inherit;
    }
    
    :host([ink]) {
      color: rgb(var(--mdw-ink));
    }
    
    :host([type-style]) {
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }
    
    #slot {
      /* Passthrough from parent */
      block-size: inherit;
      inline-size: inherit;
    }

    :host([grid]) {
      --mdw-grid__columns: 4;
      --mdw-grid__columns__4: 1;
      --mdw-grid__columns__8: 0;
      --mdw-grid__columns__12: 0;
      display: grid;
      column-gap: 16px; /* Gutters */
      /*
       * Due to container not affecting self, at least one full width element
       * is required to reflect real column count.
       * Alternative is to use resize observer on host.
       */
      grid-auto-columns: 1fr;
      grid-auto-flow: row;
      container: mdw-box / inline-size;
    }

    @container mdw-box (width >= 600px) {
      #slot[grid] {
        --mdw-grid__columns: 8;
        --mdw-grid__columns__4: 0;
        --mdw-grid__columns__8: 1;
      }
    }

    @container mdw-box (width >= 840px) {
      #slot[grid] {
        --mdw-grid__columns: 12;
        --mdw-grid__columns__4: 0;
        --mdw-grid__columns__8: 0;
        --mdw-grid__columns__12: 1;
      }
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
      --mdw-grid__columns: 8;
      --mdw-grid__columns__4: 0;
      --mdw-grid__columns__8: 0;
      --mdw-grid__columns__12: 1;
    }

    #slot[grid]::slotted(*) {
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
    #slot[grid]::slotted([col-span="1"]) { --mdw-grid__column-count: 1; }
    #slot[grid]::slotted([col-span="2"]) { --mdw-grid__column-count: 2; }
    #slot[grid]::slotted([col-span="3"]) { --mdw-grid__column-count: 3; }
    #slot[grid]::slotted([col-span="4"]) { --mdw-grid__column-count: 4; }
    #slot[grid]::slotted([col-span="5"]) { --mdw-grid__column-count: 5; }
    #slot[grid]::slotted([col-span="6"]) { --mdw-grid__column-count: 6; }
    #slot[grid]::slotted([col-span="7"]) { --mdw-grid__column-count: 7; }
    #slot[grid]::slotted([col-span="8"]) { --mdw-grid__column-count: 8; }
    #slot[grid]::slotted([col-span="9"]) { --mdw-grid__column-count: 9; }
    #slot[grid]::slotted([col-span="10"]) { --mdw-grid__column-count: 10; }
    #slot[grid]::slotted([col-span="11"]) { --mdw-grid__column-count: 11; }
    #slot[grid]::slotted([col-span="12"]) { --mdw-grid__column-count: 12; }
    
    #slot[grid]::slotted([col-span="25%"]) { --mdw-grid__column-count: calc(var(--mdw-grid__columns) / 4); }
    #slot[grid]::slotted([col-span="50%"]) { --mdw-grid__column-count: calc(var(--mdw-grid__columns) / 2); }

    #slot[grid]::slotted([col-span-4="1"]) { --mdw-grid__column-count__4: 1; }
    #slot[grid]::slotted([col-span-4="2"]) { --mdw-grid__column-count__4: 2; }
    #slot[grid]::slotted([col-span-4="3"]) { --mdw-grid__column-count__4: 3; }
    #slot[grid]::slotted([col-span-4="4"]) { --mdw-grid__column-count__4: 4; }
    #slot[grid]::slotted([col-span-8="1"]) { --mdw-grid__column-count__8: 1; }
    #slot[grid]::slotted([col-span-8="2"]) { --mdw-grid__column-count__8: 2; }
    #slot[grid]::slotted([col-span-8="3"]) { --mdw-grid__column-count__8: 3; }
    #slot[grid]::slotted([col-span-8="4"]) { --mdw-grid__column-count__8: 4; }
    #slot[grid]::slotted([col-span-8="5"]) { --mdw-grid__column-count__8: 5; }
    #slot[grid]::slotted([col-span-8="6"]) { --mdw-grid__column-count__8: 6; }
    #slot[grid]::slotted([col-span-8="7"]) { --mdw-grid__column-count__8: 7; }
    #slot[grid]::slotted([col-span-8="8"]) { --mdw-grid__column-count__8: 8; }
    #slot[grid]::slotted([col-span-12="1"]) { --mdw-grid__column-count__12: 1; }
    #slot[grid]::slotted([col-span-12="2"]) { --mdw-grid__column-count__12: 2; }
    #slot[grid]::slotted([col-span-12="3"]) { --mdw-grid__column-count__12: 3; }
    #slot[grid]::slotted([col-span-12="4"]) { --mdw-grid__column-count__12: 4; }
    #slot[grid]::slotted([col-span-12="5"]) { --mdw-grid__column-count__12: 5; }
    #slot[grid]::slotted([col-span-12="6"]) { --mdw-grid__column-count__12: 6; }
    #slot[grid]::slotted([col-span-12="7"]) { --mdw-grid__column-count__12: 7; }
    #slot[grid]::slotted([col-span-12="8"]) { --mdw-grid__column-count__12: 8; }
    #slot[grid]::slotted([col-span-12="9"]) { --mdw-grid__column-count__12: 9; }
    #slot[grid]::slotted([col-span-12="10"]) { --mdw-grid__column-count__12: 10; }
    #slot[grid]::slotted([col-span-12="11"]) { --mdw-grid__column-count__12: 11; }
    #slot[grid]::slotted([col-span-12="12"]) { --mdw-grid__column-count__12: 12; }

  `
  .expressions({
    _computedColumns({ columns, _autoColumns }) {
      if (columns) return `${columns}`;
      if (_autoColumns) return `${_autoColumns}`;
      return null;
    },
  })
  .html`<slot id=slot type-style={typeStyle} grid={grid} columns={_computedColumns}></slot>`
  .autoRegister('mdw-box');
