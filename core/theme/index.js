import { COLOR_KEYWORDS } from '../../utils/color_keywords.js';
import { harmonize } from '../../utils/hct/blend.js';
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
    full: '100vh',
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
    full: '100vh',
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
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 64,
        size: 57,
        tracking: -0.25, // From Figma (Web: 0)
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 52,
        size: 45,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      small: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 44,
        size: 36,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
    },
    headline: {
      large: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 40,
        size: 32,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 36,
        size: 28,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      small: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 32,
        size: 24,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
    },
    title: {
      large: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 28,
        size: 22,
        tracking: 0,
        weight: 'var(--mdw-typeface__weight-regular)',
      },
      medium: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 24,
        size: 16,
        tracking: 0.1, // From Figma (Web: 0.15)
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      small: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        size: 14,
        tracking: 0.1,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
    },
    label: {
      large: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        size: 14,
        tracking: 0.1,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      medium: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 16,
        size: 12,
        tracking: 0.5,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
      small: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 16, // From Figma (Web: 6)
        size: 11,
        tracking: 0.5,
        weight: 'var(--mdw-typeface__weight-medium)',
      },
    },
    body: {
      large: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 24,
        size: 16,
        tracking: 0.5,
        weight: 'var(--mdw-typeface__weight-regular)', // From Figma (Web: Medium)
      },
      medium: {
        font: 'var(--mdw-typeface__plain)',
        lineHeight: 20,
        size: 14,
        tracking: 0.25,
        weight: 'var(--mdw-typeface__weight-regular)', // From Figma (Web: Medium)
      },
      small: {
        font: 'var(--mdw-typeface__brand)',
        lineHeight: 16,
        size: 12,
        tracking: 0.4,
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

      --mdw-typescale__display-large__font: ${config.scale.display.large.font};
      --mdw-typescale__display-large__line-height: calc(${config.scale.display.large.lineHeight} * 0.0625rem);
      --mdw-typescale__display-large__size: calc(${config.scale.display.large.size} * 0.0625rem);
      --mdw-typescale__display-large__tracking: calc(${config.scale.display.large.tracking} * 0.0625rem);
      --mdw-typescale__display-large__weight: ${config.scale.display.large.weight};
      --mdw-typescale__display-medium__font: ${config.scale.display.medium.font};
      --mdw-typescale__display-medium__line-height: calc(${config.scale.display.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__display-medium__size: calc(${config.scale.display.medium.size} * 0.0625rem);
      --mdw-typescale__display-medium__tracking: calc(${config.scale.display.medium.tracking} * 0.0625rem);
      --mdw-typescale__display-medium__weight: ${config.scale.display.medium.weight};
      --mdw-typescale__display-small__font: ${config.scale.display.small.font};
      --mdw-typescale__display-small__line-height: calc(${config.scale.display.small.lineHeight} * 0.0625rem);
      --mdw-typescale__display-small__size: calc(${config.scale.display.small.size} * 0.0625rem);
      --mdw-typescale__display-small__tracking: calc(${config.scale.display.small.tracking} * 0.0625rem);
      --mdw-typescale__display-small__weight: ${config.scale.display.small.weight};

      --mdw-typescale__headline-large__font: ${config.scale.headline.large.font};
      --mdw-typescale__headline-large__line-height: calc(${config.scale.headline.large.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-large__size: calc(${config.scale.headline.large.size} * 0.0625rem);
      --mdw-typescale__headline-large__tracking: calc(${config.scale.headline.large.tracking} * 0.0625rem);
      --mdw-typescale__headline-large__weight: ${config.scale.headline.large.weight};
      --mdw-typescale__headline-medium__font: ${config.scale.headline.medium.font};
      --mdw-typescale__headline-medium__line-height: calc(${config.scale.headline.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-medium__size: calc(${config.scale.headline.medium.size} * 0.0625rem);
      --mdw-typescale__headline-medium__tracking: calc(${config.scale.headline.medium.tracking} * 0.0625rem);
      --mdw-typescale__headline-medium__weight: ${config.scale.headline.medium.weight};
      --mdw-typescale__headline-small__font: ${config.scale.headline.small.font};
      --mdw-typescale__headline-small__line-height: calc(${config.scale.headline.small.lineHeight} * 0.0625rem);
      --mdw-typescale__headline-small__size: calc(${config.scale.headline.small.size} * 0.0625rem);
      --mdw-typescale__headline-small__tracking: calc(${config.scale.headline.small.tracking} * 0.0625rem);
      --mdw-typescale__headline-small__weight: ${config.scale.headline.small.weight};

      --mdw-typescale__title-large__font: ${config.scale.title.large.font};
      --mdw-typescale__title-large__line-height: calc(${config.scale.title.large.lineHeight} * 0.0625rem);
      --mdw-typescale__title-large__size: calc(${config.scale.title.large.size} * 0.0625rem);
      --mdw-typescale__title-large__tracking: calc(${config.scale.title.large.tracking} * 0.0625rem);
      --mdw-typescale__title-large__weight: ${config.scale.title.large.weight};
      --mdw-typescale__title-medium__font: ${config.scale.title.medium.font};
      --mdw-typescale__title-medium__line-height: calc(${config.scale.title.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__title-medium__size: calc(${config.scale.title.medium.size} * 0.0625rem);
      --mdw-typescale__title-medium__tracking: calc(${config.scale.title.medium.tracking} * 0.0625rem);
      --mdw-typescale__title-medium__weight: ${config.scale.title.medium.weight};
      --mdw-typescale__title-small__font: ${config.scale.title.small.font};
      --mdw-typescale__title-small__line-height: calc(${config.scale.title.small.lineHeight} * 0.0625rem);
      --mdw-typescale__title-small__size: calc(${config.scale.title.small.size} * 0.0625rem);
      --mdw-typescale__title-small__tracking: calc(${config.scale.title.small.tracking} * 0.0625rem);
      --mdw-typescale__title-small__weight: ${config.scale.title.small.weight};

      --mdw-typescale__label-large__font: ${config.scale.label.large.font};
      --mdw-typescale__label-large__line-height: calc(${config.scale.label.large.lineHeight} * 0.0625rem);
      --mdw-typescale__label-large__size: calc(${config.scale.label.large.size} * 0.0625rem);
      --mdw-typescale__label-large__tracking: calc(${config.scale.label.large.tracking} * 0.0625rem);
      --mdw-typescale__label-large__weight: ${config.scale.label.large.weight};
      --mdw-typescale__label-medium__font: ${config.scale.label.medium.font};
      --mdw-typescale__label-medium__line-height: calc(${config.scale.label.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__label-medium__size: calc(${config.scale.label.medium.size} * 0.0625rem);
      --mdw-typescale__label-medium__tracking: calc(${config.scale.label.medium.tracking} * 0.0625rem);
      --mdw-typescale__label-medium__weight: ${config.scale.label.medium.weight};
      --mdw-typescale__label-small__font: ${config.scale.label.small.font};
      --mdw-typescale__label-small__line-height: calc(${config.scale.label.small.lineHeight} * 0.0625rem);
      --mdw-typescale__label-small__size: calc(${config.scale.label.small.size} * 0.0625rem);
      --mdw-typescale__label-small__tracking: calc(${config.scale.label.small.tracking} * 0.0625rem);
      --mdw-typescale__label-small__weight: ${config.scale.label.small.weight};

      --mdw-typescale__body-large__font: ${config.scale.body.large.font};
      --mdw-typescale__body-large__line-height: calc(${config.scale.body.large.lineHeight} * 0.0625rem);
      --mdw-typescale__body-large__size: calc(${config.scale.body.large.size} * 0.0625rem);
      --mdw-typescale__body-large__tracking: calc(${config.scale.body.large.tracking} * 0.0625rem);
      --mdw-typescale__body-large__weight: ${config.scale.body.large.weight};

      --mdw-typescale__body-medium__font: ${config.scale.body.medium.font};
      --mdw-typescale__body-medium__line-height: calc(${config.scale.body.medium.lineHeight} * 0.0625rem);
      --mdw-typescale__body-medium__size: calc(${config.scale.body.medium.size} * 0.0625rem);
      --mdw-typescale__body-medium__tracking: calc(${config.scale.body.medium.tracking} * 0.0625rem);
      --mdw-typescale__body-medium__weight: ${config.scale.body.medium.weight};

      --mdw-typescale__body-small__font: ${config.scale.body.small.font};
      --mdw-typescale__body-small__line-height: calc(${config.scale.body.small.lineHeight} * 0.0625rem);
      --mdw-typescale__body-small__size: calc(${config.scale.body.small.size} * 0.0625rem);
      --mdw-typescale__body-small__tracking: calc(${config.scale.body.small.tracking} * 0.0625rem);
      --mdw-typescale__body-small__weight: ${config.scale.body.small.weight};
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
