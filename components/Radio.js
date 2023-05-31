/* https://m3.material.io/components/radio/specs */

import './RadioIcon.js';

import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(TouchTargetMixin)
  .extend()
  .set({
    type: 'radio',
    stateLayer: true,
  })
  .html`
    <div id=radio errored={erroredState} selected={checked}>
      <mdw-radio-icon id=icon errored={erroredState} disabled={disabledState}
        selected={checked} focused={focusedState} hovered={hoveredState}></mdw-radio-icon>
    </div>
    <slot id=slot></slot>
  `
  .on({
    composed() {
      const { radio, rippleContainer, state } = this.refs;
      radio.append(state, rippleContainer);
    },
    constructed() {
      this.shadowRoot.addEventListener('click', (event) => {
        const { control } = this.refs;
        if (event.target !== control) {
          // Label-like click
          event.stopPropagation();
          control.click();
        }
      });
    },
  })
  .css`
    /* stylelint-disable liberty/use-logical-spec */

    :host {
      --mdw-ink: var(--mdw-color__primary);
      --mdw-shape__size: var(--mdw-shape__full);
      display: inline-grid;
      align-items: baseline;
      gap: 12px;
      grid-auto-flow: column;
      grid-template-rows: minmax(20px, auto);
      grid-template-columns: 20px;
      justify-content: flex-start;

      cursor: pointer;

      transition: none 100ms cubic-bezier(0.4, 0.0, 1, 1);
    }

    :host(:disabled) {
      cursor: not-allowed;

      opacity: 0.38;
    }

    :host([internals-disabled]) {
      cursor: not-allowed;

      opacity: 0.38;
    }

    :host(:empty) {
      vertical-align: -11.5%;

      line-height: 20px;
    }

    #control {
      grid-column: 1/1;

      cursor: inherit;
    }

    #state {
      pointer-events: auto;
    }

    #state,
    #ripple-container {
      top: 50%;
      left: 50%;

      block-size: 40px;
      inline-size: 40px;

      transform: translateX(-50%) translateY(-50%);

      border-radius: 50%;
    }

    #radio {
      position: relative;

      display: inline-flex;

      grid-column: 1 / 1;

      pointer-events: none;

      transform: translateY(11.5%);

      color: rgb(var(--mdw-color__on-surface));
    }

    #radio[selected] {
      color: rgb(var(--mdw-ink));
    }

    #radio[disabled] {
      color: rgb(var(--mdw-color__on-surface));
    }

    #radio[errored] {
      color: rgb(var(--mdw-color__error));
    }

    :host(:empty) #radio {
      transform: none;
    }

    #icon {
      --mdw-ink: inherit;
      --disabled-opacity: 1;
    }
  `
  .autoRegister('mdw-radio');
