import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLE_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

/**
 * Container for Floating Action Buttons (FAB) used to position FABs.
 * @see https://m3.material.io/components/floating-action-button/specs
 */
export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .observe({
    /** Hide the FAB container at this min-width (pixels). */
    hideBreakpoint: { value: 728 },
  })
  .observe({
    /**
     * Computed element styles. Generates a media query that hides the
     * container when `hideBreakpoint` is set.
     */
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
