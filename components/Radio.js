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
  .on({
    composed({ html }) {
      const { label, rippleContainer, state, control, touchTarget } = this.refs;
      label.append(html`
        ${touchTarget}
        ${control}
        <div id=radio errored={erroredState} selected={checked}>
          <mdw-radio-icon id=icon errored={erroredState} disabled={disabledState}
            selected={checked} focused={focusedState} hovered={hoveredState}></mdw-radio-icon>
          ${state}
          ${rippleContainer}
        </div>
        <slot id=slot></slot>
      `);
    },
  })
  .css`
    /* https://m3.material.io/components/radio/specs */

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

    :host(:empty) {
      vertical-align: -11.5%;

      line-height: 20px;
    }

    :host(:empty) #radio {
      transform: none;
    }

    #control {
      grid-column: 1/1;

      cursor: inherit;
    }

    #label {
      cursor: inherit;
    }

    #label[disabled] {
      cursor: not-allowed;
    }

    #state {
      pointer-events: auto;
    }

    #state,
    #ripple-container {
      inset-block-start: 50%;
      inset-inline-start: 50%;

      block-size: 40px;
      inline-size: 40px;

      transform: translateX(-50%) translateY(-50%);

      border-radius: 50%;
    }

    :host([disabled]) {
      cursor: not-allowed;

      opacity: 0.38;
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

    #icon {
      --mdw-ink: inherit;
      --disabled-opacity: 1;
    }
  `
  .autoRegister('mdw-radio');
