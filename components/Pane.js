import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .html/* html */`
    <slot id=slot-top name=top></slot>
    <slot id=slot></slot>
  `
  .css/* css */`
    /* https://m2.material.io/design/layout/responsive-layout-grid.html#columns-gutters-and-margins */
    /*
    * Window breakpoints
    * Compact (0 <= width < 600px):
    *   * Single: 100vw - padding
    *   * Padding: 16px
    *   * Spacer: 0 (none)
    * Medium (600px <= width < 840px)
    *   * Single: 100vw - padding - (?navrail)
    *   * [Fixed]: 360px
    *   * [Flexable]: 100vw - 360px - spacer - padding
    *   * [Split] 50vw - ((padding + spacer) / 2)
    *   * Padding: 24px
    *   * Spacer: 24px
    * Expanded (840px <= width)
    *   * Single: 100vw - padding - (?navrail | ?navdrawer)
    *   * [Fixed] 360px
    *   * [Flexable] 100vw - 360px - spacer - padding - (?navrail | ?navdrawer)
    *   * [Split] 50vw - ((padding + spacer + (?navrail | ?navdrawer)) / 2)
    *   * Padding: 24px
    *   * Spacer: 24px
    *
    * | Screen size         | Margin  | Body    | Layout columns |
    * |---------------------|---------|---------|----------------|
    * | Extra-small (phone) |         |         |                |
    * | 0-631dp             | 16dp    | Scaling | 4              |
    * | 632 - 647           | Scaling | 600dp   | 8              |
    * | Small (tablet)      |         |         |                |
    * | 648-887             | 24dp    | Scaling | 8              |
    * | 888-1239            | Scaling | 840dp   | 12             |
    * | Medium (laptop)     |         |         |                |
    * | 1240-1439           | 200dp   | Scaling | 12             |
    * | Large (desktop)     |         |         |                |
    * | 1440+               | Scaling | 1040    | 12             |
    *
    *
    * Column count is pane-based, not window based requiring newly computed values.
    * Gutters are irrelevant to pane sizing.
    * Nav Rail is ~80px.
    * Nav Drawer is ~360px.
    * Padding and spacers are set by pane's parent.
    * Avoid using CSS Variables because panes are at top of document tree. https://bugs.chromium.org/p/chromium/issues/detail?id=1056209
    * Container queries would reduce code considerably.
    */

    /* Compact */
    :host {
      display: block;

      min-inline-size: var(--mdw-pane__min-width, auto);
      max-inline-size: var(--mdw-pane__max-width, none);
      flex: 1;
    }

    #slot {
      display: grid;
      align-content: flex-start;
      column-gap: 16px; /* Gutters */
      grid-auto-flow: row;
      grid-template-rows: auto auto;
      grid-template-columns: repeat(var(--mdw-pane__columns), 1fr);
      

      box-sizing: border-box;
      inline-size: 100%;
      max-inline-size: calc(var(--mdw-content__max-width) + (2*var(--mdw-content__padding)));

      margin-inline: auto;
      padding-inline: var(--mdw-content__padding);
    }

    #slot::slotted(*) { grid-column: auto / span calc(var(--mdw-pane__columns)) }
    #slot::slotted([col-span="1"]) { grid-column: auto / span 1; }
    #slot::slotted([col-span="2"]) { grid-column: auto / span min(2, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="3"]) { grid-column: auto / span min(3, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="4"]) { grid-column: auto / span min(4, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="5"]) { grid-column: auto / span min(5, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="6"]) { grid-column: auto / span min(6, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="7"]) { grid-column: auto / span min(7, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="8"]) { grid-column: auto / span min(8, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="9"]) { grid-column: auto / span min(9, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="10"]) { grid-column: auto / span min(10, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="11"]) { grid-column: auto / span min(11, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="12"]) { grid-column: auto / span min(12, var(--mdw-pane__columns)); }
    #slot::slotted([col-span="50%"]) { grid-column: auto / span max(calc(var(--mdw-pane__columns) / 2), 1); }
    #slot::slotted([col-span="25%"]) { grid-column: auto / span max(calc(var(--mdw-pane__columns) / 4), 1); }

  `
  .autoRegister('mdw-pane');
