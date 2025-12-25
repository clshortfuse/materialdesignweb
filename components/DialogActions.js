import CustomElement from '../core/CustomElement.js';

/**
 * Dialog action regions contain primary and secondary actions for dialogs.
 * @see https://m3.material.io/components/dialogs/specs
 */
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
