export const TYPOGRAPHY_DEFAULT = {
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
