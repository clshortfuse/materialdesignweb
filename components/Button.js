import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';

import styles from './Button.css' assert { type: 'css' };
import Container from './Container.js';

export default class Button extends InputMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-button';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.getElementById('label').append(
      html`
        <mdw-icon id=icon aria-hidden="true" svg={svg} src="{src}">{icon}</mdw-icon>
        ${template.getElementById('ripple')}
        <div id=touch-target aria-hidden="true"></div>
        <div id=outline aria-hidden="true"></div>
      `,
    );
    const control = template.getElementById('control');
    control.setAttribute('role', 'button');
    control.setAttribute('type', 'button');
    return template;
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onControlClick(event) {
    if (this.disabled) return;
    super.onControlClick(event);
    if (event.defaultPrevented) return;
    if (this.type !== 'submit') return;
    /** @type {{host:Button}} */ // @ts-ignore Coerce
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
  }
}

Button.prototype.type = Button.idl('type', { default: 'button' });
Button.prototype.elevated = Button.idl('elevated', 'boolean');
Button.prototype.filled = Button.idl('filled', 'boolean');
Button.prototype.outlined = Button.idl('outlined', 'boolean');
Button.prototype.icon = Button.idl('icon');
Button.prototype.src = Button.idl('src');
Button.prototype.svg = Button.idl('svg');
