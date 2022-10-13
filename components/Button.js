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
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputClick(event) {
    if (this.disabled) return;
    super.onInputClick(event);
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
    const input = fragment.getElementById('input');
    input.setAttribute('role', 'button');
    input.setAttribute('type', 'button');
    return fragment;
  }
}

Button.prototype.elevated = Button.idlBoolean('elevated');
Button.prototype.filled = Button.idlBoolean('filled');
Button.prototype.outlined = Button.idlBoolean('outlined');
Button.prototype.icon = Button.idl('icon');
