import MDWComponent from '../component/MDWComponent.js';

import styles from './MDWText.css' assert { type: 'css' };

/** @implements {HTMLSpanElement} */
export default class MDWText extends MDWComponent {
  constructor() {
    super();
    this.slotElement = /** @type {HTMLSlotElement} */ (this.shadowRoot.getElementById('slot'));
  }

  static idlBooleanAttributes = [
    ...MDWComponent.idlBooleanAttributes,
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
