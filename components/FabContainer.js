import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLE_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .observe({
    hideBreakpoint: { value: 728 },
  })
  .observe({
    _styles: {
      ...ELEMENT_STYLE_TYPE,
      get({ hideBreakpoint }) {
        if (hideBreakpoint) {
          return `@media(min-width:${hideBreakpoint}px){:host{display:none}}`;
        }
        return undefined;
      },
    },
  })
  .html`<slot id=slot></slot>`
  .css`
    :host {
      display: grid;
      align-items: flex-end;
      grid-template:
        "fab" auto
        / auto;
      justify-content: flex-end;

      margin: 16px;

      pointer-events: none;

    }

    @media (min-width: 648px) {
      :host {
        margin: 24px;
      }
    }

    #slot {
      pointer-events: auto;
    }
  `
  .autoRegister('mdw-fab-container');
