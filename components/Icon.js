// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' assert { type: 'css'};

import styles from './Icon.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'|'border'|'hspace'|'longDesc'|'lowsrc'|'name'|'vspace'} DeprecatedHTMLImageElementProperties */

/** @implements {Omit<HTMLImageElement,DeprecatedHTMLImageElementProperties>} */
export default class Icon extends Text {
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
      <div id=icon class={fontClass} aria-hidden="true">
        <img id=img aria-hidden="true" />
      </div>
    `,
  ];

  static get template() {
    const template = super.template;
    const icon = template.getElementById('icon');
    icon.append(template.getElementById('slot'));
    return template;
  }

  static imageElementAttributes = [
    'alt', 'src', 'srcset',
    'sizes', 'crossorigin', 'usemap',
    'ismap', 'referrerpolicy',
    'decoding', 'loading',
  ];

  static fontLibrary = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block';

  #icon = this.refs.icon;

  #img = /** @type {HTMLImageElement} */ (this.refs.img);

  /**
   * @param {number} [width]
   * @param {number} [height]
   */
  constructor(width, height) {
    super();

    if (this.src == null) {
      // Drop from DOM if not used (performance)
      this.#img.remove();
    }

    if (width != null) {
      this.width = width;
    }
    if (height != null) {
      this.height = height;
    }
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
        this.#img.removeAttribute(name);
      } else {
        this.#img.setAttribute(name, newValue);
      }
    }

    if (name === 'src') {
      if (oldValue == null) {
        this.#icon.append(this.#img);
      } else if (newValue == null) {
        this.#img.remove();
      }
    }
  }

  get naturalWidth() { return this.#img.naturalWidth; }

  get naturalHeight() { return this.#img.naturalHeight; }

  get complete() { return this.#img.complete; }

  get currentSrc() { return this.#img.currentSrc; }

  get x() { return this.#img.x; }

  get y() { return this.#img.y; }

  get decode() { return this.#img.decode; }
}

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

Icon.prototype.alt = Icon.idl('alt');
Icon.prototype.src = Icon.idl('src');
Icon.prototype.srcset = Icon.idl('srcset');
Icon.prototype.sizes = Icon.idl('sizes');
Icon.prototype.crossOrigin = Icon.idl('crossOrigin', { attr: 'crossorigin' });
Icon.prototype.useMap = Icon.idl('useMap', { attr: 'usemap' });
Icon.prototype.isMap = Icon.idl('isMap', { attr: 'ismap', type: 'boolean' });
Icon.prototype.referrerPolicy = Icon.idl('referrerPolicy', { attr: 'referrerpolicy' });
Icon.prototype.decoding = /** @type {'async'|'sync'|'auto'} */ (Icon.idl('decoding'));
Icon.prototype.loading = /** @type {'eager'|'lazy'} */ (Icon.idl('loading'));
Icon.prototype.width = Icon.idl('width', 'float');
Icon.prototype.height = Icon.idl('height', 'float');

Icon.prototype.fontClass = Icon.idl('fontClass', { reflect: false, default: 'material-symbols-outlined' });
