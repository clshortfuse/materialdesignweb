import CustomElement from './CustomElement.js';
import styles from './Text.css' assert { type: 'css' };

/** @implements {HTMLSpanElement} */
export default class Text extends CustomElement {
  constructor() {
    super();
    this.slotElement = /** @type {HTMLSlotElement} */ (this.shadowRoot.getElementById('slot'));
  }

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'block',
  ];

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'ink',
    'type-style',
  ];

  static elementName = 'mdw-text';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <slot id=slot></slot>
    `,
  ];
}
