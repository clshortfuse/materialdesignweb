import './CheckboxIcon.js';

import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(TouchTargetMixin)
  .set({
    stateLayer: true,
    type: 'checkbox',
  })
  .observe({
    icon: { value: 'check' },
    indeterminateIcon: { value: 'check_indeterminate_small' },
  })
  .expressions({
    _determinateIcon({ indeterminate, indeterminateIcon, icon }) {
      return (indeterminate ? indeterminateIcon : icon);
    },
    _iconSelectedState({ checked, indeterminate }) {
      return checked || indeterminate;
    },
  })
  .html`
    <div id=checkbox errored={erroredState} selected={checked}>
      <mdw-checkbox-icon id=icon errored={erroredState} disabled={disabledState}
        icon={_determinateIcon} selected={checked}>
      </mdw-checkbox-icon>
    </div>
    <slot id=slot></slot>
  `
  .rootEvents({
    click(event) {
      const { control } = this.refs;
      if (event.target !== control) {
        // Label-like click
        event.stopPropagation();
        control.click();
      }
    },
  })
  .on({
    indeterminateChanged(previous, current) {
      this._input.indeterminate = current;
    },
  })
  .recompose(({ refs: { checkbox, state, rippleContainer } }) => {
    checkbox.append(state, rippleContainer);
  })
  .css`
    /* https://m3.material.io/components/checkbox/specs */

    :host {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);

      display: inline-grid;
      align-items: baseline;
      gap: 12px;
      grid-auto-flow: column;
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

      line-height: 18px;
    }

    #control {
      grid-column: 1/1;

      cursor: inherit;
    }

    #state,
    #ripple-container {
      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;

      block-size: 40px;
      inline-size: 40px;

      transform: translateX(-50%) translateY(-50%);

      border-radius: 50%;
    }

    #checkbox {
      position: relative;

      display: inline-flex;

      grid-column: 1 / 1;

      pointer-events: none;

      transform: translateY(11.5%);

      color: rgb(var(--mdw-color__on-surface));
    }

    #checkbox[selected] {
      color: rgb(var(--mdw-bg));
    }

    #checkbox[disabled] {
      color: rgb(var(--mdw-color__on-surface));
    }

    #checkbox[errored] {
      color: rgb(var(--mdw-color__error));
    }

    :host(:empty) #checkbox {
      transform: none;
    }

    #icon {
      --mdw-ink: inherit;
      --mdw-bg: inherit;
      --disabled-opacity: 1;
    }
  `
  .autoRegister('mdw-checkbox');
