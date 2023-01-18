import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';

import styles from './Button.css' assert { type: 'css' };
import Container from './Container.js';

export default Container
  .mixin(InputMixin)
  .extend() // Override props
  .observe({
    type: { value: 'button' },
    elevated: 'boolean',
    filled: 'string',
    outlined: 'boolean',
    icon: 'string',
    src: 'string',
    svg: 'string',
  })
  .css(styles)
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <mdw-icon id=icon aria-hidden="true" svg={svg} src="{src}">{icon}</mdw-icon>
      ${$('#elevation')}
      <div id=outline aria-hidden="true"></div>
      <div id=touch-target aria-hidden="true"></div>
    `);
    const control = $('#control');
    control.setAttribute('role', 'button');
    control.setAttribute('type', 'button');
  })
  .events('#control', {
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
  })
  .autoRegister('mdw-button');
