import CustomElement from '../core/CustomElement.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

/**
 * Snackbar container positions snackbars within the app window and manages
 * layout and pointer-events for stacked snackbars.
 * @see https://m3.material.io/components/snackbar/specs
 */
export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .html`
    <slot id=slot></slot>
  `
  .css`
    :host {
      display: grid;
      align-items: flex-end;
      grid-template:
        "snackbar" auto
        / minmax(auto, 60ch);
      
      justify-content: center;

      margin: 16px;

      pointer-events: none;

    }

    @media (min-width: 648px) {
      :host {
        grid-template-columns: minmax(auto, 1fr);

        margin: 24px;
      }
    }

    @media (min-width: 1248px) {
      :host {
        grid-template-columns: minmax(auto, 60ch);
        justify-content: flex-start;
      }
    }

    #slot {
      pointer-events: auto;
    }

  `
  .autoRegister('mdw-snackbar-container');
