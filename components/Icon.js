// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' assert { type: 'css'};

import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Icon.css' assert { type: 'css' };

/** @type {Map<string, {path:string, viewBox:string}>} */
const svgAliasMap = new Map();
const unaliased = new Set();

const documentLoadedStyleSheets = new Set();

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
    _slottedText: 'string',
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
    forceFont: 'boolean',
    _linkLoaded: 'boolean',
    viewBox: { attr: 'viewBox' },
    fontClass: { empty: 'material-symbols-outlined' },
    fontLibrary: { empty: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' },
  })
  .observe({
    _svgAlias: {
      type: 'object',
      get({ _slottedText }) {
        if (!_slottedText) return null;
        const result = svgAliasMap.get(_slottedText.trim().toLowerCase());
        if (!result) {
          unaliased.add(_slottedText);
          console.warn(`Icon: No SVG alias for ${JSON.stringify([...unaliased])}`);
        }
        return result;
      },
    },
  })
  .observe({
    _computedSVGPath({ svgPath, _svgAlias }) {
      return svgPath || _svgAlias?.path;
    },
    _computedViewBox({ viewBox, _svgAlias }) {
      return viewBox ?? _svgAlias?.viewBox ?? '0 0 24 24';
    },
  })
  .observe({
    _showSlot: {
      type: 'boolean',
      get({ _slottedText, svg, _computedSVGPath, src }) {
        return _slottedText && !svg && !_computedSVGPath && !src;
      },
    },
  })
  .css(styles)
  .expressions({
    showSVG({ svg, _computedSVGPath }) {
      return Boolean(svg || _computedSVGPath);
    },

  })
  .html/* html */`
    <link _if={_showSlot} id=link rel=stylesheet href={fontLibrary} />
    <svg _if="{showSVG}" id=svg viewBox="{_computedViewBox}">
      <use id="use" _if="{svg}" href="{svg}" fill="currentColor"/>
      <path id="path" _if="{_computedSVGPath}" d="{_computedSVGPath}"/>
    </svg>
    <img _if={src} id=img
      disabled={disabled}
      alt={alt} src={src} srcset={srcset} sizes={sizes}
      crossorigin={crossOrigin} usemap={useMap} ismap={isMap}
      referrerpolicy={referrerPolicy} decoding={decoding} loading={loading}
      width={width} height={height}
    />
    <slot id=icon class={fontClass} hidden={!_showSlot} aria-hidden=true></slot>
  `
  .childEvents({
    icon: {
      slotchange() {
        this._slottedText = this.textContent;
      },
    },
    link: {
      /**
       * @param {{currentTarget: HTMLLinkElement}} event
       * @type {any}
       */
      load({ currentTarget }) {
        const { href, parentNode } = currentTarget;
        if (!parentNode) {
          console.warn('Icon: parentNode is blank');
        }
        if (documentLoadedStyleSheets.has(href)) return;
        console.debug('Icon: Checking if link also in document', href);
        for (const link of document.head.getElementsByTagName('link')) {
          if (link.href === href) {
            console.debug(`Icon: Found ${href} in document.`);
            documentLoadedStyleSheets.add(href);
            return;
          }
        }
        console.debug(`Icon: Adding ${href} to document.`);
        document.head.append(currentTarget.cloneNode());
        documentLoadedStyleSheets.add(href);
      },
    },
  }) {
  static get svgAliasMap() { return svgAliasMap; }

  static get svgUnaliased() { return unaliased; }

  /**
   * @param {string} name
   * @param {string} path
   * @param {string} [viewBox]
   */
  static addSVGAlias(name, path, viewBox = '0 0 24 24') {
    name = name.toLowerCase();
    if (path) {
      svgAliasMap.set(name, { path, viewBox });
    } else {
      svgAliasMap.delete(name);
    }
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
}

Icon.autoRegister('mdw-icon');
