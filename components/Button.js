import styles from './Button.css' assert { type: 'css' };
import Input from './Input.js';

export default class Button extends Input {
  static elementName = 'mdw-button';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=touch-target aria-hidden="true"></div>
      <div id=outline aria-hidden="true"></div>
      <mdw-icon id=icon aria-hidden="true" src="{src}">{icon}</mdw-icon>
    `,
  ];

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

  compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('icon'),
      fragment.getElementById('ripple'),
      fragment.getElementById('touch-target'),
      fragment.getElementById('outline'),
    );
    const control = fragment.getElementById('control');
    control.setAttribute('role', 'button');
    control.setAttribute('type', 'button');
    return fragment;
  }
}

Button.prototype.type = Button.idl('type', { default: 'button' });
Button.prototype.elevated = Button.idl('elevated', 'boolean');
Button.prototype.elevated = Button.idl('elevated', 'boolean');
Button.prototype.filled = Button.idl('filled', 'boolean');
Button.prototype.outlined = Button.idl('outlined', 'boolean');
Button.prototype.icon = Button.idl('icon');
