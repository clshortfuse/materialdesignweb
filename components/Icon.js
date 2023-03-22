// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' assert { type: 'css'};

import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Icon.css' assert { type: 'css' };

/** @typedef {'align'|'border'|'hspace'|'longDesc'|'lowsrc'|'name'|'vspace'} DeprecatedHTMLImageElementProperties */

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

/** @implements {Omit<HTMLImageElement,DeprecatedHTMLImageElementProperties>} */
export default class Icon extends CustomElement
  .mixin(ThemableMixin)
  .extend()
  .define({
    _img() { return /** @type {HTMLImageElement} */ (this.refs.img); },
  })
  .define({
    naturalWidth() { return this._img.naturalWidth; },
    naturalHeight() { return this._img.naturalHeight; },
    complete() { return this._img.complete; },
    currentSrc() { return this._img.currentSrc; },
    x() { return this._img.x; },
    y() { return this._img.y; },
    decode() { return this._img.decode; },
  })
  .observe({
    disabled: 'boolean',
    alt: 'string',
    src: 'string',
    svg: 'string',
    svgPath: 'string',
    srcset: 'string',
    sizes: 'string',
    crossOrigin: { attr: 'crossorigin' },
    useMap: { attr: 'usemap' },
    isMap: { type: 'boolean', attr: 'ismap' },
    referrerPolicy: { attr: 'referrerpolicy' },
    decoding: { value: /** @type {'async'|'sync'|'auto'} */ (null) },
    loading: { value: /** @type {'eager'|'lazy'} */ (null) },
    width: 'integer',
    height: 'integer',
    fontClass: { empty: 'material-symbols-outlined' },
    fontLibrary: { empty: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' },
  })
  .css(styles)
  .expressions({
    showSVG({ svg, svgPath }) {
      return Boolean(svg || svgPath);
    },
  })
  .html/* html */`
    <link rel=stylesheet href={fontLibrary} />
    <svg _if="{showSVG}" id="svg" viewBox="0 0 24 24" id="svg">
      <use id="use" _if="{svg}" href="{svg}" fill="currentColor"/>
      <path id="path" _if="{svgPath}" d="{svgPath}"/>
    </svg>
    <img _if={src} id=img
      disabled={disabled}
      alt={alt} src={src} srcset={srcset} sizes={sizes}
      crossorigin={crossOrigin} usemap={useMap} ismap={isMap}
      referrerpolicy={referrerPolicy} decoding={decoding} loading={loading}
      width={width} height={height}
    />
    <slot id=icon class={fontClass} aria-hidden=true></slot>
  ` {
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
}

Icon.autoRegister('mdw-icon');
