import { COLOR_KEYWORDS } from '../../utils/color_keywords.js';
import { getScheme } from '../../utils/hct/helper.js';

/** @return {string} */
function cornerCutClipPath() {
  const TOP = 0;
  const END = '100%';
  const BOTTOM = '100%';
  const START = 0;

  const TOP_START_SIZE = 'var(--mdw-shape__size__top-start-size)';
  const TOP_END_SIZE = 'var(--mdw-shape__size__top-end-size)';
  const BOTTOM_START_SIZE = 'var(--mdw-shape__size__bottom-start-size)';
  const BOTTOM_END_SIZE = 'var(--mdw-shape__size__bottom-end-size)';

  const TOP_INSET = (size) => `min(${size},50%)`;
  const START_INSET = (size) => `min(${size},50%)`;
  const END_INSET = (size) => `calc(100% - min(${size},50%))`;
  const BOTTOM_INSET = (size) => `calc(100% - min(${size},50%))`;

  /**
   *     1           2
   *   ┌──────────────┐
   * 8 │              │ 3
   *   │              │
   *   │              │
   *   │              │
   * 7 │              │ 4
   *   └──────────────┘
   *    6            5
   */

  return `polygon(${
    [
      [TOP, TOP_INSET(TOP_START_SIZE)],

      [TOP, END_INSET(TOP_END_SIZE)],
      [TOP_INSET(TOP_END_SIZE), END],

      [BOTTOM_INSET(BOTTOM_END_SIZE), END],
      [BOTTOM, END_INSET(BOTTOM_END_SIZE)],

      [BOTTOM, START_INSET(BOTTOM_START_SIZE)],
      [BOTTOM_INSET(BOTTOM_START_SIZE), START],

      [TOP_INSET(TOP_START_SIZE), START],
    ].map((coordinates) => coordinates.join(' ')).join(', ')
  })`;
}

const SHAPE_ROUNDED_DEFAULT = {
  size: {
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '999px',
  },
  /** @type {string} */
  clipPath: undefined,
};

const SHAPE_CUT_DEFAULT = {
  size: {
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '999px',
  },
  clipPath: cornerCutClipPath(),
};

const SP = 1 / 16;

const TYPOGRAPHY_DEFAULT = {
  face: {
    brand: '"Roboto", sans-serif',
    plain: '"Roboto", sans-serif',
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
        letterSpacing: -0.25, // From Figma (Web: 0)
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
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 24,
        fontSize: 16,
        letterSpacing: 0.1, // From Figma (Web: 0.15)
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
        lineHeight: 16, // From Figma (Web: 6)
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
        letterSpacing: 0.5,
        weight: 'var(--mdw-typeface__weight-regular)', // From Figma (Web: Medium)
      },
      medium: {
        fontFamily: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        fontSize: 14,
        letterSpacing: 0.25,
        weight: 'var(--mdw-typeface__weight-regular)', // From Figma (Web: Medium)
      },
      small: {
        fontFamily: 'var(--mdw-typeface__brand)',
        lineHeight: 16,
        fontSize: 12,
        letterSpacing: 0.4,
        weight: 'var(--mdw-typeface__weight-regular)', // From Figma (Web: Medium)
      },
    },
  },
};

/**
 * @param {typeof TYPOGRAPHY_DEFAULT} config
 * @return {string}
 */
export function getTypographyStyle(config = TYPOGRAPHY_DEFAULT) {
  return /* css */`
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
    }
  `;
}

/**
 * @param {typeof SHAPE_ROUNDED_DEFAULT} config
 * @return {string}
 */
export function getShapeStyle(config = SHAPE_ROUNDED_DEFAULT) {
  return /* css */`
    :root {
      --mdw-shape__extra-small: ${config.size.extraSmall};
      --mdw-shape__small: ${config.size.small};
      --mdw-shape__medium: ${config.size.medium};
      --mdw-shape__large: ${config.size.large};
      --mdw-shape__extra-large: ${config.size.extraLarge};
      --mdw-shape__full: ${config.size.full};
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
 * @param {Object} options
 * @param {string} [options.color]
 * @param {Iterable<[string,string?]>} [options.custom] Map()
 * @param {'auto'|'light'|'dark'} [options.lightness='auto']
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

  addStyle(getShapeStyle());
  addStyle(getTypographyStyle());
}