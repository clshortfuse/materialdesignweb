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
    filled: 'boolean',
    outlined: 'boolean',
    icon: 'string',
    src: 'string',
    svg: 'string',
  })
  .css(styles)
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <mdw-icon id=icon aria-hidden="true" svg={svg} src="{src}">{icon}</mdw-icon>
      ${$('#ripple')}
      <div id=touch-target aria-hidden="true"></div>
      <div id=outline aria-hidden="true"></div>
    `);
    const control = $('#control');
    control.setAttribute('role', 'button');
    control.setAttribute('type', 'button');
  })
  .events('#control', {
    '~click'() {
      if (this.disabled) return;
      if (this.type !== 'submit') return;
      const { host } = this.getRootNode();
      if (host.disabled) return;
      const { value } = this;
      const form = host.elementInternals?.form;
      if (!form) return;
      host.elementInternals.setFormValue(value);
      if ((this.type ?? 'submit') !== 'submit') return;
      const duplicatedButton = /** @type {HTMLButtonElement} */ (this.cloneNode());
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
