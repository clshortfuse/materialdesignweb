// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' assert { type: 'css'};

import styles from './Icon.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'|'border'|'hspace'|'longDesc'|'lowsrc'|'name'|'vspace'} DeprecatedHTMLImageElementProperties */

/** @implements {Omit<HTMLImageElement,DeprecatedHTMLImageElementProperties>} */
export default class Icon extends Text {
  static { this.autoRegister(); }

  static elementName = 'mdw-icon';

  compose() {
    const composition = super.compose();
    const { html } = this;
    const { template } = composition;
    return composition.append(
      styles,
      html`
        <link rel=stylesheet href={fontLibrary} />
        <div id=icon class={fontClass} aria-hidden="true">
          <svg _if={svg} id=svg viewBox="0 0 24 24" id="svg">
            <use href="{svg}" fill="currentColor"/>
          </svg>
          <img _if={src} id=img
            alt={alt} src={src} srcset={srcset} sizes={sizes}
            crossorigin={crossOrigin} usemap={useMap} ismap={isMap}
            referrerpolicy={referrerPolicy} decoding={decoding} loading={loading}
            width={width} height={height}
          />
          ${template.getElementById('slot')}
        </div>
      `,
    );
  }

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

  get naturalWidth() { return /** @type {HTMLImageElement} */ (this.refs.img).naturalWidth; }

  get naturalHeight() { return /** @type {HTMLImageElement} */ (this.refs.img).naturalHeight; }

  get complete() { return /** @type {HTMLImageElement} */ (this.refs.img).complete; }

  get currentSrc() { return /** @type {HTMLImageElement} */ (this.refs.img).currentSrc; }

  get x() { return /** @type {HTMLImageElement} */ (this.refs.img).x; }

  get y() { return /** @type {HTMLImageElement} */ (this.refs.img).y; }

  get decode() { return /** @type {HTMLImageElement} */ (this.refs.img).decode; }
}

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

Icon.prototype.alt = Icon.idl('alt');
Icon.prototype.src = Icon.idl('src');
Icon.prototype.svg = Icon.idl('svg');
Icon.prototype.srcset = Icon.idl('srcset');
Icon.prototype.sizes = Icon.idl('sizes');
Icon.prototype.crossOrigin = Icon.idl('crossOrigin', { attr: 'crossorigin' });
Icon.prototype.useMap = Icon.idl('useMap', { attr: 'usemap' });
Icon.prototype.isMap = Icon.idl('isMap', { attr: 'ismap', type: 'boolean' });
Icon.prototype.referrerPolicy = Icon.idl('referrerPolicy', { attr: 'referrerpolicy' });
Icon.prototype.decoding = /** @type {'async'|'sync'|'auto'} */ (Icon.idl('decoding'));
Icon.prototype.loading = /** @type {'eager'|'lazy'} */ (Icon.idl('loading'));
Icon.prototype.width = Icon.idl('width', 'integer');
Icon.prototype.height = Icon.idl('height', 'integer');

Icon.prototype.fontClass = Icon.idl('fontClass', { empty: 'material-symbols-outlined' });
Icon.prototype.fontLibrary = Icon.idl('fontLibrary', { empty: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' });
