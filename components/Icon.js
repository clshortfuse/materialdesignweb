// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Icon.css' assert { type: 'css' };

/** @typedef {'align'|'border'|'hspace'|'longDesc'|'lowsrc'|'name'|'vspace'} DeprecatedHTMLImageElementProperties */

/** @implements {Omit<HTMLImageElement,DeprecatedHTMLImageElementProperties>} */
export default class Icon extends Container {
  static elementName = 'mdw-icon';

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
        {icon}
        <img id=img aria-hidden="true"/>
      </div>
    `,
  ];

  static imageElementAttributes = [
    'alt', 'src', 'srcset',
    'sizes', 'crossorigin', 'usemap',
    'ismap', 'referrerpolicy',
    'decoding', 'loading',
  ];

  static fontLibrary = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&text=search';

  static fontClassName = 'material-symbols-outlined';

  /**
   * @param {number} [width]
   * @param {number} [height]
   */
  constructor(width, height) {
    super();
    if (width != null) {
      this.width = width;
    }
    if (height != null) {
      this.height = height;
    }
  }

  compose() {
    const fragment = super.compose();
    const icon = fragment.getElementById('icon');
    icon.className = Icon.fontClassName;
    icon.append(fragment.getElementById('slot'));
    return fragment;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    if (Icon.imageElementAttributes.includes(name)) {
      if (newValue == null) {
        this.refs.img.removeAttribute(name);
      } else {
        this.refs.img.setAttribute(name, newValue);
      }
    }
  }

  get naturalWidth() { return this.refs.img.naturalWidth; }

  get naturalHeight() { return this.refs.img.naturalHeight; }

  get complete() { return this.refs.img.complete; }

  get currentSrc() { return this.refs.img.currentSrc; }

  get x() { return this.refs.img.x; }

  get y() { return this.refs.img.y; }

  get decode() { return this.refs.img.decode; }
}

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

Icon.prototype.alt = Icon.idlString('alt');
Icon.prototype.src = Icon.idlString('src');
Icon.prototype.srcset = Icon.idlString('srcset');
Icon.prototype.sizes = Icon.idlString('sizes');
Icon.prototype.crossOrigin = Icon.idlString('crossorigin', 'crossOrigin');
Icon.prototype.useMap = Icon.idlString('usemap', 'useMap');
Icon.prototype.isMap = Icon.idlBoolean('ismap', 'isMap');
Icon.prototype.referrerPolicy = Icon.idlString('referrerpolicy', 'referrerPolicy');
Icon.prototype.decoding = /** @type {'async'|'sync'|'auto'} */ (Icon.idlString('decoding'));
Icon.prototype.loading = /** @type {'eager'|'lazy'} */ (Icon.idlString('loading'));
Icon.prototype.width = Icon.idlFloat('width');
Icon.prototype.height = Icon.idlFloat('height');

Icon.prototype.icon = Icon.idlString('icon');

Icon.prototype.refs = {
  ...Container.prototype.refs,
  ...Icon.addRefNames('icon', 'img'),
};
