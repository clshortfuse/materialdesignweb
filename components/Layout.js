import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .html/* html */`
    <slot id=slot-top name=top></slot>
    <slot id=slot></slot>
  `
  .css`
    /* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

    :host {
      display: block;

      /* QOL */
      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
      
    }

    /* Pane Slot */
    #slot {
      display: flex;
      gap: 24px;

      justify-content: center;

      padding-inline: 16px;

      transition: padding-inline 100ms;
    }

    @media screen and (min-width: 648px) { #slot { padding-inline: 24px; } }
  `
  .autoRegister('mdw-layout');
