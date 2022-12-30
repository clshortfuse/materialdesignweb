import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .css/* css */`
    :host {
      align-self: flex-end;
      padding-inline: 24px;
      margin-block: 24px;
    }
  `
  .html`<slot/>`
  .register('mdw-dialog-actions');
