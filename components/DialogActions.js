import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .css`
    :host {
      align-self: flex-end;

      margin-block: 24px;
      padding-inline: 24px;
    }
  `
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-dialog-actions');
