// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import MDWContainer from '../container/MDWContainer.js';

import styles from './MDWIcon.css' assert { type: 'css' };

export default class MDWIcon extends MDWContainer {
  constructor() {
    super();
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.imageElement = this.shadowRoot.getElementById('image');
    // this.slotElement.remove();
    this.iconElement.className = MDWIcon.fontClassName;
    this.iconElement.appendChild(this.slotElement);
  }

  static imageElementAttributes = [
    'alt', 'crossorigin', 'decoding', 'fetchpriority',
    // 'height', 'width',
    // 'ismap',
    'loading', 'referrerpolicy',
    'sizes', 'src', 'srcset',
  ];

  static observedAttributes = [
    ...super.observedAttributes,
    'icon',
    ...MDWIcon.imageElementAttributes,
  ];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'icon':
        if (newValue) {
          this.iconElement.textContent = newValue;
        }
        break;
      default:
    }
    if (MDWIcon.imageElementAttributes.includes(name)) {
      if (newValue == null) {
        this.imageElement.removeAttribute(name);
      } else {
        this.imageElement.setAttribute(name, newValue);
      }
    }
  }

  static elementName = 'mdw-icon';

  static fontLibrary = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&text=search';

  static fontClassName = 'material-symbols-outlined';

  static get styles() {
    return [
      ...super.styles,
      new URL(this.fontLibrary),
      styles,
    ];
  }

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=icon aria-hidden="true">
        <img id=image aria-hidden="true"/>
      </div>
    `,
  ];
}
