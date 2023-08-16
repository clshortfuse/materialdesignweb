import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .html`
    <slot id=slot></slot>
  `
  .css`
    :host {
      display: grid;
      align-items: flex-end;
      grid-template:
        "fab" auto
        / auto;
      justify-content: flex-end;

      margin: 16px;

    }

    @media (min-width: 648px) {
      :host {
        margin: 24px;
      }
    }
  `
  .autoRegister('mdw-fab-container');
