import CustomElement from '../core/CustomElement.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';

export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .observe({
    hideBreakpoint: { value: 728 },
  })
  .observe({
    _styles({ hideBreakpoint }) {
      if (hideBreakpoint) {
        return `@media (min-width: ${hideBreakpoint}px) {:host{--mdw-fab-container__display: none}}`;
      }
      return undefined;
    },
  })
  .html`
    <style id=styles>{_styles}</style>
    <slot id=slot></slot>
  `
  .css`
    :host {
      display: var(--mdw-fab-container__display, grid);
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
