// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Icon.css' assert { type: 'css' };

/** @implements {HTMLImageElement} */
export default class Icon extends Container {
  constructor() {
    super();
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.imageElement = /** @type {HTMLImageElement} */ (this.shadowRoot.getElementById('image'));
    // this.slotElement.remove();
    this.iconElement.className = Icon.fontClassName;
    this.iconElement.appendChild(this.slotElement);
  }

  static imageElementAttributes = [
    'alt', 'crossorigin', 'decoding', 'fetchpriority',
    // 'height', 'width',
    // 'ismap',
    'loading', 'referrerpolicy',
    'sizes', 'srcset',
  ];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...Icon.imageElementAttributes,
    ];
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'icon':
        if (newValue) {
          this.iconElement.textContent = newValue;
        }
        break;
      default:
    }
    if (Icon.imageElementAttributes.includes(name)) {
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

  get complete() {
    if (this.src == null && this.srcset == null) return true;
    if (this.srcset == null && this.src === '') return true;
    return (this.imageElement.complete);
  }
}

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

Icon.prototype.alt = Icon.idlString('alt');
Icon.prototype.src = Icon.idlString('src');
Icon.prototype.srcset = Icon.idlString('srcset');
Icon.prototype.sizes = Icon.idlString('sizes');
Icon.prototype.crossOrigin = Icon.idlString('crossorigin', 'crossOrigin');
Icon.prototype.useMap = Icon.idlString('usemap', 'useMap');
Icon.prototype.isMap = Icon.idlString('ismap', 'isMap');
Icon.prototype.referrerPolicy = Icon.idlString('referrerpolicy', 'referrerPolicy');
Icon.prototype.decoder = Icon.idlString('decoder');
Icon.prototype.loading = Icon.idlString('loading');

Icon.prototype.icon = Icon.idlString('icon');
