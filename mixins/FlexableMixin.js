/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexableMixin(Base) {
  return Base
    .observe({
      flex: {
        type: 'string',
        empty: 'row',
        /** @type {'row'|'column'} */
        value: 'row',
      },
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
        box-sizing: border-box;
      }

      :host([flex]) {
        display:flex;
      }

      :host([flex="column"]) {
        flex-direction: column;
      }

      :host(:where([flex][y="start"], [flex="column"][x="start"])) {
        align-items: flex-start;
      }

      :host(:where([flex][y="end"], [flex="column"][x="end"])) {
        align-items: flex-end;
      }

      :host(:where([flex][y="center"], [flex="column"][x="center"])) {
        align-items: center;
      }

      :host(:where([flex][y="between"], [flex="column"][x="between"])) {
        align-items: space-between;
      }

      :host(:where([flex][y="around"], [flex="column"][x="around"])) {
        align-items: space-around;
      }

      :host(:where([flex][y="stretch"], [flex="column"][x="stretch"])) {
        align-items: stretch;
      }

      :host(:where([flex][x="start"], [flex="column"][y="start"])) {
        justify-content: flex-start;
      }

      :host(:where([flex][x="end"], [flex="column"][y="end"])) {
        justify-content: flex-end;
      }

      :host(:where([flex][x="center"], [flex="column"][y="center"])) {
        justify-content: center;
      }

      :host(:where([flex][x="between"], [flex="column"][y="between"])) {
        justify-content: space-between;
      }

      :host(:where([flex][x="stretch"], [flex="column"][y="stretch"])) {
        justify-content: stretch;
      }

      :host([wrap]) {
        flex-wrap: wrap;
      }

      :host([wrap="reverse"]) {
        flex-wrap: wrap-reverse;
      }

      :host([gap="4"]) {gap: 4px;}
      :host([gap="8"]) {gap: 8px;}
      :host([gap="12"]) {gap: 12px;}
      :host([gap="16"]) {gap: 16px;}
      :host([gap="20"]) {gap: 20px;}
      :host([gap="24"]) {gap: 24px;}

      :host([padding="4"]) {padding: 4px;}
      :host([padding="8"]) {padding: 8px;}
      :host([padding="12"]) {padding: 12px;}
      :host([padding="16"]) {padding: 16px;}
      :host([padding="20"]) {padding: 20px;}
      :host([padding="24"]) {padding: 24px;}
    `;
}
