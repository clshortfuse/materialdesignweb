import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';

import styles from './Button.css' assert { type: 'css' };
import Container from './Container.js';

export default Container
  .mixin(StateMixin)
  .mixin(InputMixin)
  .mixin(RippleMixin)
  .mixin(SurfaceMixin)
  .extend()
  .set({
    stateLayer: true,
  })
  .observe({
    type: { value: 'button' },
    elevated: 'boolean',
    filled: 'string',
    outlined: 'boolean',
    icon: 'string',
    src: 'string',
    svg: 'string',
  })
  .observe({
    elevation: {
      type: 'integer',
      get({ elevated }) {
        if (elevated) return 2;
        return null;
      },
    },
  })
  .css(styles)
  .html/* html */`
    <mdw-icon id=icon disabled={disabledState} aria-hidden="true" svg={svg} src="{src}">{icon}<slot id=svg name=svg slot=svg></slot></mdw-icon>
    <div id=touch-target aria-hidden="true"></div>
  `
  .on('composed', ({ $ }) => {
    const slot = $('#slot');
    slot.setAttribute('disabled', '{disabledState}');
    const label = $('#label');
    label.setAttribute('elevated', '{elevated}');
    label.setAttribute('filled', '{filled}');
    label.setAttribute('disabled', '{disabledState}');
    label.setAttribute('outlined', '{outlined}');

    const control = $('#control');
    control.setAttribute('role', 'button');
    control.setAttribute('type', 'button');
  })
  .childEvents({
    control: {
    /**
     * Duplicates button for form submission
     * @see https://github.com/WICG/webcomponents/issues/814
     * @param {{currentTarget:HTMLInputElement}} event
     * @type {any}
     */
      '~click'({ currentTarget }) {
        if (currentTarget.disabled) return;
        if (currentTarget.type !== 'submit') return;
        if (this.disabled) return;
        const { value } = currentTarget;
        const form = this.elementInternals?.form;
        if (!form) return;
        this.elementInternals.setFormValue(value);
        if ((currentTarget.type ?? 'submit') !== 'submit') return;
        const duplicatedButton = /** @type {HTMLInputElement} */ (currentTarget.cloneNode());
        duplicatedButton.hidden = true;
        form.append(duplicatedButton);
        if ('requestSubmit' in form) {
          form.requestSubmit(duplicatedButton);
        } else {
          duplicatedButton.click();
        }
        duplicatedButton.remove();
      },
    },
  })
  .autoRegister('mdw-button');
