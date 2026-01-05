/**
 * Layout helper mixin providing flexbox utilities (gap, padding, axis).
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexboxMixin(Base) {
  return Base
    .observe({
      /** Set `display: block` on the host (boolean) */
      block: 'boolean',
      /** Use inline flex layout: `display: inline-flex` (boolean) */
      inline: 'boolean',
      /** Switch main axis to horizontal: `flex-direction: row` (boolean) */
      row: 'boolean',
      /**
       * Main-axis alignment / justification.
       * Allowed: 'start'|'center'|'end'|'between'|'around'|'stretch'|'baseline'.
       * Default: 'start'.
       */
      x: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'|'baseline'} */
        value: 'start',
      },
      /**
       * Cross-axis alignment / alignment of items.
       * Same allowed values as `x`. Default: 'start'.
       */
      y: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'|'baseline'} */
        value: 'start',
      },
      /** Gap between children. Accepts preset numeric strings (e.g. '8') mapped to px, or floats. */
      gap: 'float',
      /** Padding preset or numeric value (e.g. 'pane', '8', '16'). */
      padding: 'string',
    })
    .css`
      /* https://css-tricks.com/snippets/css/a-guide-to-flexbox/ */

      :host{
        display: flex;
        flex-direction: column;

        box-sizing: border-box;

      }

      :host(:is([inline])) {
        display: inline-flex;
      }

      :host(:is([block])) {
        display: block;
      }
      
      
      :host(:is([inline][block])) {
        display: inline-block;
      }

      :host(:is([row])) {
        flex-direction: row;
      }

      :host(:is([row][y="start"], [x="start"]:not([row]))) {
        align-items: flex-start;
      }

      :host(:is([row][y="end"], [x="end"]:not([row]))) {
        align-items: flex-end;
      }

      :host(:is([row][y="center"], [x="center"]:not([row]))) {
        align-items: center;
      }

      :host(:is([row][y="between"], [x="between"]:not([row]))) {
        align-items: space-between;
      }

      :host(:is([row][y="around"], [x="around"]:not([row]))) {
        align-items: space-around;
      }

      :host(:is([row][y="baseline"], [x="baseline"]:not([row]))) {
        align-items: baseline;
      }

      :host(:is([row][y="stretch"], [x="stretch"]:not([row]))) {
        align-items: stretch;
      }

      :host(:is([row][x="start"], [y="start"]:not([row]))) {
        justify-content: flex-start;
      }

      :host(:is([row][x="end"], [y="end"]:not([row]))) {
        justify-content: flex-end;
      }

      :host(:is([row][x="center"], [y="center"]:not([row]))) {
        justify-content: center;
      }

      :host(:is([row][x="between"], [y="between"]:not([row]))) {
        justify-content: space-between;
      }

      :host(:is([row][x="stretch"], [y="stretch"]:not([row]))) {
        justify-content: stretch;
      }

      :host(:is([wrap])) {
        flex-wrap: wrap;
      }

      :host(:is([wrap="reverse"])) {
        flex-wrap: wrap-reverse;
      }

      :host(:is([gap])) {gap: 0;}
      :host(:is([gap="4"])) {gap: 4px;}
      :host(:is([gap="8"])) {gap: 8px;}
      :host(:is([gap="12"])) {gap: 12px;}
      :host(:is([gap="16"])) {gap: 16px;}
      :host(:is([gap="20"])) {gap: 20px;}
      :host(:is([gap="24"])) {gap: 24px;}

      :host(:is([padding])) {padding: 0;}
      :host(:is([padding="pane"])) { padding: var(--mdw-pane__padding, 16px) }
      :host(:is([padding="4"])) {padding: 4px;}
      :host(:is([padding="8"])) {padding: 8px;}
      :host(:is([padding="12"])) {padding: 12px;}
      :host(:is([padding="16"])) {padding: 16px;}
      :host(:is([padding="20"])) {padding: 20px;}
      :host(:is([padding="24"])) {padding: 24px;}
      :host(:is([padding-x])) {padding-inline: 0;}
      :host(:is([padding-x="pane"])) {padding-inline: var(--mdw-pane__padding-inline, 16px);}
      :host(:is([padding-x="4"])) {padding-inline: 4px;}
      :host(:is([padding-x="8"])) {padding-inline: 8px;}
      :host(:is([padding-x="12"])) {padding-inline: 12px;}
      :host(:is([padding-x="16"])) {padding-inline: 16px;}
      :host(:is([padding-x="20"])) {padding-inline: 20px;}
      :host(:is([padding-x="24"])) {padding-inline: 24px;}
      :host(:is([padding-y])) {padding-block: 0;}
      :host(:is([padding-y="pane"])) {padding-block: var(--mdw-pane__padding-block, 16px);}
      :host(:is([padding-y="4"])) {padding-block: 4px;}
      :host(:is([padding-y="8"])) {padding-block: 8px;}
      :host(:is([padding-y="12"])) {padding-block: 12px;}
      :host(:is([padding-y="16"])) {padding-block: 16px;}
      :host(:is([padding-y="20"])) {padding-block: 20px;}
      :host(:is([padding-y="24"])) {padding-block: 24px;}

      
    `;
}
