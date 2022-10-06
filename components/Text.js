import CustomElement from './CustomElement.js';
import styles from './Text.css' assert { type: 'css' };

/** @implements {HTMLSpanElement} */
export default class Text extends CustomElement {
  static elementName = 'mdw-text';

  static fragments = [
    ...super.fragments,
    /* html */`
      <slot id=slot></slot>
    `,
  ];

  static styles = [...super.styles, styles];

  constructor() {
    super();
    this.slotElement = /** @type {HTMLSlotElement} */ (this.shadowRoot.getElementById('slot'));
  }
}

Text.prototype.block = Text.idlBoolean('block');
Text.prototype.ink = Text.idlString('ink');
Text.prototype.typeStyle = Text.idlString('type-style');
