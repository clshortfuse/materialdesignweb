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
      // @ts-ignore Cast
      // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
      const el = /** @type {HTMLInputElement} */ (this);
      if (el.disabled) return;
      if (el.type !== 'submit') return;
      const { host } = this.getRootNode();
      if (host.disabled) return;
      const { value } = el;
      const form = host.elementInternals?.form;
      if (!form) return;
      host.elementInternals.setFormValue(value);
      if ((el.type ?? 'submit') !== 'submit') return;
      const duplicatedButton = /** @type {HTMLInputElement} */ (el.cloneNode());
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
