import styles from './Container.css' assert { type: 'css' };
import Text from './Text.js';

/** @implements {HTMLDivElement} */
export default class Container extends Text {
  constructor() {
    super();
    this.elevationElement = this.shadowRoot.getElementById('elevation');
  }

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'disabled',
    'shape-top', 'shape-bottom', 'shape-start', 'shape-end',
  ];

  static idlIntegerAttributes = [
    ...super.idlIntegerAttributes,
    'elevation',
  ];

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'color', 'bg', 'shape-style',
  ];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'disabled':
        if (newValue == null) {
          this.setAttribute('aria-disabled', 'false');
        } else {
          this.setAttribute('aria-disabled', 'true');
        }
        break;
      default:
    }
  }

  static elementName = 'mdw-container';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=elevation aria-hidden=true></div>
    `,
  ];
}
