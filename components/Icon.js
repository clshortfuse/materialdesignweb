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

Icon.prototype.alt = Icon.idl('alt');
Icon.prototype.src = Icon.idl('src');
Icon.prototype.srcset = Icon.idl('srcset');
Icon.prototype.sizes = Icon.idl('sizes');
Icon.prototype.crossOrigin = Icon.idl('crossOrigin', { attr: 'crossorigin' });
Icon.prototype.useMap = Icon.idl('useMap', { attr: 'usemap' });
Icon.prototype.isMap = Icon.idlBoolean('isMap', { attr: 'ismap' });
Icon.prototype.referrerPolicy = Icon.idl('referrerPolicy', { attr: 'referrerpolicy' });
Icon.prototype.decoding = /** @type {'async'|'sync'|'auto'} */ (Icon.idl('decoding'));
Icon.prototype.loading = /** @type {'eager'|'lazy'} */ (Icon.idl('loading'));
Icon.prototype.width = Icon.idlFloat('width');
Icon.prototype.height = Icon.idlFloat('height');

Icon.prototype.refs = {
  ...Container.prototype.refs,
  ...Icon.addRefNames('img'),
};
