/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexableMixin(Base) {
  return Base
    .observe({
      block: 'boolean',
      inline: 'boolean',
      row: 'boolean',
      x: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'} */
        value: 'start',
      },
      y: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'} */
        value: 'start',
      },
      gap: 'float',
      padding: 'float',
    })
    .css`
      /* https://css-tricks.com/snippets/css/a-guide-to-flexbox/ */

      :host{
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: flex-start;

      }

      :host(:where([inline])) {
        display: inline-flex;
      }

      :host(:where([block])) {
        display: block;
      }
      
      
      :host(:where([inline][block])) {
        display: inline-block;
      }

      :host(:where([row])) {
        flex-direction: row;
      }

      :host(:where([row][y="start"], [x="start"]:not([row])) {
        align-items: flex-start;
      }

      :host(:where([row][y="end"], [x="end"]:not([row])) {
        align-items: flex-end;
      }

      :host(:where([row][y="center"], [x="center"]:not([row])) {
        align-items: center;
      }

      :host(:where([row][y="between"], [x="between"]:not([row])) {
        align-items: space-between;
      }

      :host(:where([row][y="around"], [x="around"]:not([row])) {
        align-items: space-around;
      }

      :host(:where([row][y="stretch"], [x="stretch"]:not([row])) {
        align-items: stretch;
      }

      :host(:where([row][x="start"], [y="start"]:not([row]))) {
        justify-content: flex-start;
      }

      :host(:where([row][x="end"], [y="end"]:not([row]))) {
        justify-content: flex-end;
      }

      :host(:where([row][x="center"], [y="center"]:not([row]))) {
        justify-content: center;
      }

      :host(:where([row][x="between"], [y="between"]:not([row]))) {
        justify-content: space-between;
      }

      :host(:where([row][x="stretch"], [y="stretch"]:not([row]))) {
        justify-content: stretch;
      }

      :host(:where([wrap])) {
        flex-wrap: wrap;
      }

      :host(:where([wrap="reverse"])) {
        flex-wrap: wrap-reverse;
      }

      :host(:where([gap="4"])) {gap: 4px;}
      :host(:where([gap="8"])) {gap: 8px;}
      :host(:where([gap="12"])) {gap: 12px;}
      :host(:where([gap="16"])) {gap: 16px;}
      :host(:where([gap="20"])) {gap: 20px;}
      :host(:where([gap="24"])) {gap: 24px;}

      :host(:where([padding="4"])) {padding: 4px;}
      :host(:where([padding="8"])) {padding: 8px;}
      :host(:where([padding="12"])) {padding: 12px;}
      :host(:where([padding="16"])) {padding: 16px;}
      :host(:where([padding="20"])) {padding: 20px;}
      :host(:where([padding="24"])) {padding: 24px;}
      :host(:where([padding-x="4"])) {padding-inline: 4px;}
      :host(:where([padding-x="8"])) {padding-inline: 8px;}
      :host(:where([padding-x="12"])) {padding-inline: 12px;}
      :host(:where([padding-x="16"])) {padding-inline: 16px;}
      :host(:where([padding-x="20"])) {padding-inline: 20px;}
      :host(:where([padding-x="24"])) {padding-inline: 24px;}
      :host(:where([padding-y="4"])) {padding-block: 4px;}
      :host(:where([padding-y="8"])) {padding-block: 8px;}
      :host(:where([padding-y="12"])) {padding-block: 12px;}
      :host(:where([padding-y="16"])) {padding-block: 16px;}
      :host(:where([padding-y="20"])) {padding-block: 20px;}
      :host(:where([padding-y="24"])) {padding-block: 24px;}
    `;
}
