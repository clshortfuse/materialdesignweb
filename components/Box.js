import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Containers are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .extend()
  .observe({
    inline: 'boolean',
    grid: 'boolean',
    block: {
      type: 'boolean',
      empty: true,
    },
  })
  .css/* css */`
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
      display: grid;
      column-gap: 16px; /* Gutters */
      grid-auto-flow: row;
      grid-template-columns: repeat(var(--mdw-grid__columns), 1fr);
    }

    #slot[grid]::slotted(*) { grid-column: auto / span calc(var(--mdw-grid__columns)) }
    #slot[grid]::slotted([col-span="1"]) { grid-column: auto / span 1; }
    #slot[grid]::slotted([col-span="2"]) { grid-column: auto / span min(2, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="3"]) { grid-column: auto / span min(3, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="4"]) { grid-column: auto / span min(4, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="5"]) { grid-column: auto / span min(5, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="6"]) { grid-column: auto / span min(6, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="7"]) { grid-column: auto / span min(7, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="8"]) { grid-column: auto / span min(8, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="9"]) { grid-column: auto / span min(9, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="10"]) { grid-column: auto / span min(10, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="11"]) { grid-column: auto / span min(11, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="12"]) { grid-column: auto / span min(12, var(--mdw-grid__columns)); }
    #slot[grid]::slotted([col-span="50%"]) { grid-column: auto / span max(calc(var(--mdw-grid__columns) / 2), 1); }
    #slot[grid]::slotted([col-span="25%"]) { grid-column: auto / span max(calc(var(--mdw-grid__columns) / 4), 1); }

  `
  .html/* html */`<slot id=slot type-style={typeStyle} grid={grid}></slot>`
  .autoRegister('mdw-box');
