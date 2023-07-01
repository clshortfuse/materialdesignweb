export const CIRCLE_PATH = 'M0 12A12 12 0 1012 0 12 12 0 000 12Z';
export const DIAMOND_PATH = 'M 0 12 12 0 24 12 12 24 Z';
export const SQUIRCLE_PATH = 'M12 24C17.2583 24 20.1815 24 22.0908 22.0908 24 20.1815 24 17.2583 24 12 24 6.7417 24 3.8185 22.0908 1.9092 20.1815-0 17.2583-0 12-0 6.7417-0 3.8185-0 1.9092 1.9092-0 3.8185-0 6.7417-0 12-0 17.2583-0 20.1815 1.9092 22.0908 3.8185 24 6.7417 24 12 24Z';
export const HALF_NOTCH_PATH = 'M0 6H6V0H18V6H24V18H18V24H6V18H0Z';

export const SHAPE_ROUNDED_DEFAULT = {
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

export const SHAPE_CUT_DEFAULT = {
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

export const SHAPE_SQUIRCLE_DEFAULT = {
  ...SHAPE_ROUNDED_DEFAULT,
  mask: SQUIRCLE_PATH,
};
