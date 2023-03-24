import { COLOR_KEYWORDS } from '../utils/color_keywords.js';
import { getScheme } from '../utils/hct/helper.js';
import { svgToCSSURL } from '../utils/svg.js';

/**
 * @typedef {Object} ThemeOptions
 * @prop {string} [color]
 * @prop {Iterable<[string,string?]>} [custom] Map()
 * @prop {'auto'|'light'|'dark'} [lightness='auto']
 * @return {string}
 */

/**
 * @param {string} shape
 * @return {string}
 */
function getShapeMaskSVG(shape) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">',
    `<defs><path id="a" d="${shape}"/></defs>`,
    '<use href="#a" transform="scale(.666)"/>',
    '<use href="#a" transform="translate(8) scale(.666)"/>',
    '<use href="#a" transform="matrix(.666 0 0 .666 0 8)"/>',
    '<use href="#a" transform="matrix(.666 0 0 .666 8 8)"/>',
    '<path d="M8 0h8v24H8Z"/><path d="M0 8h24v8H0Z"/>',
    '</svg>',
  ].join('');
}

/**
 * @param {string} shape
 * @param {'top-left'|'top-right'|'bottom-left'|'bottom-right'} corner
 * @param {boolean} [convex]
 * @return {string}
 */
function getShapeCornerSVGs(shape, corner, convex) {
  const path = `<path ${[
    `d="${shape}"`,
    'vector-effect="non-scaling-stroke"',
    `transform-origin="${corner.replace('-', ' ')}"`,
    'stroke-linejoin="miter"',
    'transform="scale(2)"',
    `stroke-width="${convex ? 4 : 2}px"`,
    'stroke="black"',
    'fill="none"',
  ].join(' ')}/>`;

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">',
    convex
      ? [
        '<mask id="m">',
        '<rect x="0" y="0" width="24" height="24" fill="white"/>',
        `<path d="${shape}" transform-origin="${corner.replace('-', ' ')}" transform="scale(2)"/>`,
        '</mask>',
        `<g mask="url(#m)">${path}</g>`,
      ].join('')
      : path,
    '</svg>',
  ].join('');
}

/**
 * @return {string}
 */
function getShapeEdgesSVGs() {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">',
    '<rect x="0" y="0" width="24" height="24" vector-effect="non-scaling-stroke" stroke-width="2px" stroke="black" fill="none"/>',
    '</svg>',
  ].join('');
}

const CIRCLE_PATH = 'M0 12A12 12 0 1012 0 12 12 0 000 12Z';
// const SQUIRCLE_PATH = 'M12 24C17.2583 24 20.1815 24 22.0908 22.0908 24 20.1815 24 17.2583 24 12 24 6.7417 24 3.8185 22.0908 1.9092 20.1815-0 17.2583-0 12-0 6.7417-0 3.8185-0 1.9092 1.9092-0 3.8185-0 6.7417-0 12-0 17.2583-0 20.1815 1.9092 22.0908 3.8185 24 6.7417 24 12 24Z';
const DIAMOND_PATH = 'M 0 12 12 0 24 12 12 24 Z';
const SQUIRCLE_PATH = 'M12 24C17.2583 24 20.1815 24 22.0908 22.0908 24 20.1815 24 17.2583 24 12 24 6.7417 24 3.8185 22.0908 1.9092 20.1815-0 17.2583-0 12-0 6.7417-0 3.8185-0 1.9092 1.9092-0 3.8185-0 6.7417-0 12-0 17.2583-0 20.1815 1.9092 22.0908 3.8185 24 6.7417 24 12 24Z';
const HALF_NOTCH_PATH = 'M0 6H6V0H18V6H24V18H18V24H6V18H0Z';

const SHAPE_ROUNDED_DEFAULT = {
  size: {
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '32px',
  },
  /** @type {string?} */
  mask: CIRCLE_PATH, // CIRCLE_PATH
  convex: false,
};

const SHAPE_CUT_DEFAULT = {
  ...SHAPE_ROUNDED_DEFAULT,
  size: {
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '32px',
  },
  mask: DIAMOND_PATH,
};

const SHAPE_SQUIRCLE_DEFAULT = {
  ...SHAPE_ROUNDED_DEFAULT,
  mask: SQUIRCLE_PATH,
};

const SP = 1 / 16;

const TYPOGRAPHY_DEFAULT = {
  face: {
    brand: '"Roboto Medium", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    plain: '"Roboto Regular", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    weight: {
      regular: 400,
      medium: 500,
    },
  },
  scale: {
    display: {
      large: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 64,
        fontSize: 57,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 52,
        fontSize: 45,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      small: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 44,
        fontSize: 36,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
    },
    headline: {
      large: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 40,
        fontSize: 32,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 36,
        fontSize: 28,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      small: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 32,
        fontSize: 24,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
    },
    title: {
      large: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 28,
        fontSize: 22,
        letterSpacing: 0,
        weight: 'var(--mdw-typeface__weight-medium)', // Figma style has regular
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 24,
        fontSize: 16,
        letterSpacing: 0.15,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      small: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        fontSize: 14,
        letterSpacing: 0.1,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
    },
    label: {
      large: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        fontSize: 14,
        letterSpacing: 0.1,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 16,
        fontSize: 12,
        letterSpacing: 0.5,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      small: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 16,
        fontSize: 11,
        letterSpacing: 0.5,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
    },
    body: {
      large: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 24,
        fontSize: 16,
        letterSpacing: 0.5, // Figma text has 0.15
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        fontSize: 14,
        letterSpacing: 0.25,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      small: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 16,
        fontSize: 12,
        letterSpacing: 0.4,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
    },
  },
};

/**
 * @param {typeof TYPOGRAPHY_DEFAULT} config
 * @return {string}
 */
export function generateTypographyCSS(config = TYPOGRAPHY_DEFAULT) {
  return /* css */ `
    :root {
      --mdw-typeface__brand: ${config.face.brand};
      --mdw-typeface__weight-regular: ${config.face.weight.regular};
      --mdw-typeface__weight-medium: ${config.face.weight.medium};
      --mdw-typeface__plain: ${config.face.plain};

      --mdw-typescale__display-large__font-family: ${config.scale.display.large.fontFamily};
      --mdw-typescale__display-large__line-height: calc(${config.scale.display.large.lineHeight} * 0.0625rem);
      --mdw-typescale__display-large__font-size: calc(${config.scale.display.large.fontSize} * 0.0625rem);
      --mdw-typescale__display-large__letter-spacing: calc(${config.scale.display.large.letterSpacing} * 0.0625rem);
      --mdw-typescale__display-large__font-weight: ${config.scale.display.large.weight};

      --mdw-typescale__display-medium__font-family: ${config.scale.display.medium.fontFamily};
      --mdw-typescale__display-medium__line-height: calc(${config.scale.display.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__display-medium__font-size: calc(${config.scale.display.medium.fontSize} * 0.0625rem);
      --mdw-typescale__display-medium__letter-spacing: calc(${config.scale.display.medium.letterSpacing} * 0.0625rem);
      --mdw-typescale__display-medium__font-weight: ${config.scale.display.medium.weight};

      --mdw-typescale__display-small__font-family: ${config.scale.display.small.fontFamily};
      --mdw-typescale__display-small__line-height: calc(${config.scale.display.small.lineHeight} * 0.0625rem);
      --mdw-typescale__display-small__font-size: calc(${config.scale.display.small.fontSize} * 0.0625rem);
      --mdw-typescale__display-small__letter-spacing: calc(${config.scale.display.small.letterSpacing} * 0.0625rem);
      --mdw-typescale__display-small__font-weight: ${config.scale.display.small.weight};

      --mdw-typescale__headline-large__font-family: ${config.scale.headline.large.fontFamily};
      --mdw-typescale__headline-large__line-height: calc(${config.scale.headline.large.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-large__font-size: calc(${config.scale.headline.large.fontSize} * 0.0625rem);
      --mdw-typescale__headline-large__letter-spacing: calc(${config.scale.headline.large.letterSpacing} * 0.0625rem);
      --mdw-typescale__headline-large__font-weight: ${config.scale.headline.large.weight};

      --mdw-typescale__headline-medium__font-family: ${config.scale.headline.medium.fontFamily};
      --mdw-typescale__headline-medium__line-height: calc(${config.scale.headline.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-medium__font-size: calc(${config.scale.headline.medium.fontSize} * 0.0625rem);
      --mdw-typescale__headline-medium__letter-spacing: calc(${config.scale.headline.medium.letterSpacing} * 0.0625rem);
      --mdw-typescale__headline-medium__font-weight: ${config.scale.headline.medium.weight};

      --mdw-typescale__headline-small__font-family: ${config.scale.headline.small.fontFamily};
      --mdw-typescale__headline-small__line-height: calc(${config.scale.headline.small.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-small__font-size: calc(${config.scale.headline.small.fontSize} * 0.0625rem);
      --mdw-typescale__headline-small__letter-spacing: calc(${config.scale.headline.small.letterSpacing} * 0.0625rem);
      --mdw-typescale__headline-small__font-weight: ${config.scale.headline.small.weight};

      --mdw-typescale__title-large__font-family: ${config.scale.title.large.fontFamily};
      --mdw-typescale__title-large__line-height: calc(${config.scale.title.large.lineHeight} * 0.0625rem);
      --mdw-typescale__title-large__font-size: calc(${config.scale.title.large.fontSize} * 0.0625rem);
      --mdw-typescale__title-large__letter-spacing: calc(${config.scale.title.large.letterSpacing} * 0.0625rem);
      --mdw-typescale__title-large__font-weight: ${config.scale.title.large.weight};

      --mdw-typescale__title-medium__font-family: ${config.scale.title.medium.fontFamily};
      --mdw-typescale__title-medium__line-height: calc(${config.scale.title.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__title-medium__font-size: calc(${config.scale.title.medium.fontSize} * 0.0625rem);
      --mdw-typescale__title-medium__letter-spacing: calc(${config.scale.title.medium.letterSpacing} * 0.0625rem);
      --mdw-typescale__title-medium__font-weight: ${config.scale.title.medium.weight};

      --mdw-typescale__title-small__font-family: ${config.scale.title.small.fontFamily};
      --mdw-typescale__title-small__line-height: calc(${config.scale.title.small.lineHeight} * 0.0625rem);
      --mdw-typescale__title-small__font-size: calc(${config.scale.title.small.fontSize} * 0.0625rem);
      --mdw-typescale__title-small__letter-spacing: calc(${config.scale.title.small.letterSpacing} * 0.0625rem);
      --mdw-typescale__title-small__font-weight: ${config.scale.title.small.weight};

      --mdw-typescale__label-large__font-family: ${config.scale.label.large.fontFamily};
      --mdw-typescale__label-large__line-height: calc(${config.scale.label.large.lineHeight} * 0.0625rem);
      --mdw-typescale__label-large__font-size: calc(${config.scale.label.large.fontSize} * 0.0625rem);
      --mdw-typescale__label-large__letter-spacing: calc(${config.scale.label.large.letterSpacing} * 0.0625rem);
      --mdw-typescale__label-large__font-weight: ${config.scale.label.large.weight};

      --mdw-typescale__label-medium__font-family: ${config.scale.label.medium.fontFamily};
      --mdw-typescale__label-medium__line-height: calc(${config.scale.label.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__label-medium__font-size: calc(${config.scale.label.medium.fontSize} * 0.0625rem);
      --mdw-typescale__label-medium__letter-spacing: calc(${config.scale.label.medium.letterSpacing} * 0.0625rem);
      --mdw-typescale__label-medium__font-weight: ${config.scale.label.medium.weight};

      --mdw-typescale__label-small__font-family: ${config.scale.label.small.fontFamily};
      --mdw-typescale__label-small__line-height: calc(${config.scale.label.small.lineHeight} * 0.0625rem);
      --mdw-typescale__label-small__font-size: calc(${config.scale.label.small.fontSize} * 0.0625rem);
      --mdw-typescale__label-small__letter-spacing: calc(${config.scale.label.small.letterSpacing} * 0.0625rem);
      --mdw-typescale__label-small__font-weight: ${config.scale.label.small.weight};

      --mdw-typescale__body-large__font-family: ${config.scale.body.large.fontFamily};
      --mdw-typescale__body-large__line-height: calc(${config.scale.body.large.lineHeight} * 0.0625rem);
      --mdw-typescale__body-large__font-size: calc(${config.scale.body.large.fontSize} * 0.0625rem);
      --mdw-typescale__body-large__letter-spacing: calc(${config.scale.body.large.letterSpacing} * 0.0625rem);
      --mdw-typescale__body-large__font-weight: ${config.scale.body.large.weight};

      --mdw-typescale__body-medium__font-family: ${config.scale.body.medium.fontFamily};
      --mdw-typescale__body-medium__line-height: calc(${config.scale.body.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__body-medium__font-size: calc(${config.scale.body.medium.fontSize} * 0.0625rem);
      --mdw-typescale__body-medium__letter-spacing: calc(${config.scale.body.medium.letterSpacing} * 0.0625rem);
      --mdw-typescale__body-medium__font-weight: ${config.scale.body.medium.weight};

      --mdw-typescale__body-small__font-family: ${config.scale.body.small.fontFamily};
      --mdw-typescale__body-small__line-height: calc(${config.scale.body.small.lineHeight} * 0.0625rem);
      --mdw-typescale__body-small__font-size: calc(${config.scale.body.small.fontSize} * 0.0625rem);
      --mdw-typescale__body-small__letter-spacing: calc(${config.scale.body.small.letterSpacing} * 0.0625rem);
      --mdw-typescale__body-small__font-weight: ${config.scale.body.small.weight};
      }`;
}

/** @return {string} */
export function generateTypographyGlobalCSS() {
  return /* css */ `
    :root {${['display', 'headline', 'title', 'label', 'body']
    .map((style) => ['large', 'medium', 'small']
      .map((size) => `--mdw-typescale__${style}-${size}__font: ${
        [
          `var(--mdw-typescale__${style}-${size}__font-weight)`,
          `var(--mdw-typescale__${style}-${size}__font-size)/var(--mdw-typescale__${style}-${size}__line-height)`,
          `var(--mdw-typescale__${style}-${size}__font-family)`,
        ].join(' ')
      };`).join('\n'))
    .join('\n')}}`;
}

/**
 * @param {typeof SHAPE_ROUNDED_DEFAULT} config
 * @return {string}
 */
export function generateShapeCSS(config = SHAPE_ROUNDED_DEFAULT) {
  return /* css */`
    :root {
      --mdw-shape__extra-small: ${config.size.extraSmall};
      --mdw-shape__small: ${config.size.small};
      --mdw-shape__medium: ${config.size.medium};
      --mdw-shape__large: ${config.size.large};
      --mdw-shape__extra-large: ${config.size.extraLarge};
      --mdw-shape__full: ${config.size.full};
      --mdw-shape__rounded: ${config.mask ? '0' : '1'};
      --mdw-shape__outline__background: ${config.mask ? 'currentColor' : 'transparent'};
      --mdw-shape__convex: ${config.convex ? '1' : '0'};
      --mdw-shape__mask-border-source: ${config.mask ? svgToCSSURL(getShapeMaskSVG(config.mask)) : 'none'};
      --mdw-shape__mask-image__top-left: ${config.mask ? svgToCSSURL(getShapeCornerSVGs(config.mask, 'top-left')) : 'none'};
      --mdw-shape__mask-image__top-right: ${config.mask ? svgToCSSURL(getShapeCornerSVGs(config.mask, 'top-right')) : 'none'};
      --mdw-shape__mask-image__bottom-right: ${config.mask ? svgToCSSURL(getShapeCornerSVGs(config.mask, 'bottom-right')) : 'none'};
      --mdw-shape__mask-image__bottom-left: ${config.mask ? svgToCSSURL(getShapeCornerSVGs(config.mask, 'bottom-left')) : 'none'};
      --mdw-shape__mask-image__edges: ${config.mask ? svgToCSSURL(getShapeEdgesSVGs()) : 'none'};
    }
  `;
}

/**
 * @param {string} content
 * @return {HTMLStyleElement } element
 */
function addStyle(content) {
  const element = document.createElement('style');
  element.textContent = content;
  document.head.append(element);
  return element;
}

/**
 * @param {ThemeOptions} options
 * @return {string}
 */
export function generateColorCSS({ color = '#6750A4', custom = [], lightness = 'light' }) {
  /** @type {[string,string][]} */
  const parsedColors = [...custom]
    .map(([name, hex]) => [name, COLOR_KEYWORDS.get(hex) || hex || COLOR_KEYWORDS.get(name)]);
  const scheme = getScheme(color, parsedColors);
  if (lightness === 'dark') {
    return scheme.dark;
  }
  return scheme.light;
}

/**
 * @param {ThemeOptions} options
 * @return {void}
 */
export function setupTheme({ color = '#6750A4', custom = [], lightness = 'auto' }) {
  /** @type {[string,string][]} */
  const parsedColors = [...custom]
    .map(([name, hex]) => [name, COLOR_KEYWORDS.get(hex) || hex || COLOR_KEYWORDS.get(name)]);
  const scheme = getScheme(color, parsedColors);
  if (lightness === 'dark') {
    addStyle(scheme.dark);
  } else {
    addStyle(scheme.light);
    if (lightness !== 'light') {
      addStyle(scheme.dark).media = '(prefers-color-scheme:dark)';
    }
  }
  addStyle(generateShapeCSS());
  addStyle(generateTypographyCSS());
}

/**
 * @param {URLSearchParams} searchParams
 * @return {ThemeOptions}
 */
export function themeOptionsFromSearchParams(searchParams) {
  const color = searchParams.get('color') || '#6750A4';

  /** @type {[string,string?][]} */
  const custom = searchParams.getAll('custom')
    .flatMap((c) => c.split(','))
    .map((c) => c.split(':'));

  const lightness = searchParams.get('lightness') ?? 'auto';
  return { color, custom, lightness };
}

/**
 * @param {ThemeOptions} options
 * @return {string}
 */
export function generateThemeCSS({ color = '#6750A4', custom = [], lightness = 'auto' }) {
  const shapeCss = generateShapeCSS();
  const typographyCss = generateTypographyCSS();
  let colorCss;
  if (lightness === 'light' || lightness === 'dark') {
    colorCss = generateColorCSS({ color, custom, lightness });
  } else {
    colorCss = `
    ${generateColorCSS({ color, custom, lightness: 'light' })}
    @media (prefers-color-scheme:dark) {
      :root { color-scheme: dark; }
      ${generateColorCSS({ color, custom, lightness: 'dark' })}
    }`;
  }
  return [
    shapeCss,
    typographyCss,
    colorCss,
  ].join('\n');
}
