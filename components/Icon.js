// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' assert { type: 'css'};

import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import { svgAliasMap, unaliased } from '../services/svgAlias.js';

const documentLoadedStyleSheets = new Set();

/** @typedef {'align'|'border'|'hspace'|'longDesc'|'lowsrc'|'name'|'vspace'} DeprecatedHTMLImageElementProperties */

// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlimageelement

/** -implements {Omit<HTMLImageElement,DeprecatedHTMLImageElementProperties>} */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
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
    icon: 'string',
    disabled: 'boolean',
    alt: 'string',
    src: 'string',
    svg: 'string',
    svgPath: 'string',
    srcset: 'string',
    sizes: 'string',
    variation: 'string',
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
    viewBox: 'string',
    fontClass: { empty: 'material-symbols-outlined' },
    fontLibrary: { empty: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block' },
    _isConnected: 'boolean',
  })
  .observe({
    _svgAlias: {
      type: 'object',
      get({ icon, variation }) {
        if (!icon) return null;
        const iconName = icon.trim().toLowerCase();
        const suffix = variation ? `#${variation}` : '';

        const aliasName = `${iconName}${suffix}`;
        if (svgAliasMap.has(aliasName)) {
          return svgAliasMap.get(aliasName);
        }
        unaliased.add(aliasName);

        // Fallback to base version
        if (suffix && svgAliasMap.has(iconName)) {
          return svgAliasMap.get(iconName);
        }

        return null;
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
    _showFontIcon: {
      type: 'boolean',
      get({ icon, svg, _computedSVGPath, src }) {
        return icon && !svg && !_computedSVGPath && !src;
      },
    },
  })
  .expressions({
    showSVG({ svg, _computedSVGPath }) {
      return Boolean(svg || _computedSVGPath);
    },

  })
  .html`
    <link mdw-if={_showFontIcon} id=link rel=stylesheet href={fontLibrary} />
    <svg mdw-if="{showSVG}" id="svg" viewBox="{_computedViewBox}">
      <use id="use" mdw-if="{svg}" href="{svg}" fill="currentColor"/>
      <path id="path" mdw-if="{_computedSVGPath}" d="{_computedSVGPath}"/>
    </svg>
    <img mdw-if={src} id=img
      disabled={disabled}
      alt={alt} src={src} srcset={srcset} sizes={sizes}
      crossorigin={crossOrigin} usemap={useMap} ismap={isMap}
      referrerpolicy={referrerPolicy} decoding={decoding} loading={loading}
      width={width} height={height}
    />
    <span id=icon class={fontClass} hidden={!_showFontIcon} aria-hidden=true>{icon}</span>
  `
  .css`
    /* https://material.io/design/iconography/system-icons.html */

    :host {
      display: inline-block;
      vertical-align: -11.5%;

      block-size: 1em;
      inline-size: 1em;

      -webkit-user-select: none;
      user-select: none;

      font-variation-settings: 'FILL' 0;

      transition-duration: 200ms;
      /* stylelint-disable-next-line liberty/use-logical-spec -- Safari does not animate inline-size */
      transition-property: inline-size, width;
    }

    :host([variation="fill"]) {
      font-variation-settings: 'FILL' 1;
    }

    :host(:is([color],[ink])) {
      color: rgb(var(--mdw-ink));
    }

    #icon {
      /* Clip bounds in case font is not ready */
      display: block;
      overflow: clip;

      block-size: 1em;
      inline-size: 1em;

      font-size: inherit;
      font-variation-settings: inherit;

      transition-delay: 1ms;
      transition-duration: 200ms;

      transition-property: font-variation-settings;
    }

    #icon[hidden] {
      display: none;
    }

    #svg {
      display: block;

      block-size: inherit;
      inline-size: inherit;

      fill: currentColor;

      object-fit: cover;
    }

    #img {
      display: block;

      block-size: inherit;
      inline-size: inherit;

      object-fit: cover;

      transition-delay: 1ms;
      transition-duration: 200ms;
      transition-property: filter;
    }

    #img[disabled] {
      filter: grayscale();
    }

    .material-symbols-outlined {
      /* https://github.com/google/material-design-icons/issues/750 */
      direction: inherit;
    }

  `
  .childEvents({
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
        // console.debug('Icon: Checking if link also in document', href);
        for (const link of document.head.getElementsByTagName('link')) {
          if (link.href === href) {
            // console.debug(`Icon: Found ${href} in document.`);
            documentLoadedStyleSheets.add(href);
            return;
          }
        }
        // console.debug(`Icon: Adding ${href} to document.`);
        document.head.append(currentTarget.cloneNode());
        documentLoadedStyleSheets.add(href);
      },
    },
  })
  .extend((BaseClass) => class extends BaseClass {
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
  })
  .autoRegister('mdw-icon');
