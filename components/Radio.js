import Input from './Input.js';
import styles from './Radio.css' assert { type: 'css' };

export default class Radio extends Input {
  static elementName = 'mdw-radio';

  static fragments = [...super.fragments,
  /* html */ `
    <div id=icon></div>
  `];

  static styles = [...super.styles, styles];

  constructor() {
    super();
    if (!this.hasAttribute('type')) {
      this.type = 'radio';
      this.attributeChangedCallback('type', null, 'radio');
    }
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.iconElement.append(
      this.rippleElement,
      this.overlayElement,
    );
    this.labelElement.append(this.iconElement);
  }
}
