import { harmonize } from './blend.js';
import CorePalette from './palettes/CorePalette.js';
import Scheme from './scheme/Scheme.js';
import * as colorUtils from './utils/color.js';

/** @typedef {import("./palettes/TonalPalette.js").default} TonalPalette */

/**
 * @param {string} value
 * @return {number}
 */
function parseIntHex(value) {
  // tslint:disable-next-line:ban
  return Number.parseInt(value, 16);
}

/**
 * @param {string} hex String representing color as hex code. Accepts strings with or
 *     without leading #, and string representing the color using 3, 6, or 8
 *     hex characters.
 * @return {number} ARGB representation of color.
 */
function argbFromHex(hex) {
  hex = hex.replace('#', '');
  const isThree = hex.length === 3;
  const isSix = hex.length === 6;
  const isEight = hex.length === 8;
  if (!isThree && !isSix && !isEight) {
    throw new Error(`unexpected hex ${hex}`);
  }
  let r = 0;
  let g = 0;
  let b = 0;
  if (isThree) {
    r = parseIntHex(hex.slice(0, 1).repeat(2));
    g = parseIntHex(hex.slice(1, 2).repeat(2));
    b = parseIntHex(hex.slice(2, 3).repeat(2));
  } else if (isSix) {
    r = parseIntHex(hex.slice(0, 2));
    g = parseIntHex(hex.slice(2, 4));
    b = parseIntHex(hex.slice(4, 6));
  } else if (isEight) {
    r = parseIntHex(hex.slice(2, 4));
    g = parseIntHex(hex.slice(4, 6));
    b = parseIntHex(hex.slice(6, 8));
  }

  return (
    ((255 << 24) | ((r & 0x0_FF) << 16) | ((g & 0x0_FF) << 8) | (b & 0x0_FF))
      >>> 0);
}

/**
 * @param {number} argb ARGB representation of a color.
 * @return {string} Hex string representing color, ex. #ff0000 for red.
 */
function hexFromArgb(argb) {
  const r = colorUtils.redFromArgb(argb);
  const g = colorUtils.greenFromArgb(argb);
  const b = colorUtils.blueFromArgb(argb);
  const outParts = [r.toString(16), g.toString(16), b.toString(16)];

  // Pad single-digit output values
  for (const [i, part] of outParts.entries()) {
    if (part.length === 1) {
      outParts[i] = `0${part}`;
    }
  }

  return `#${outParts.join('')}`;
}

/**
 * @param {number} argb
 * @return {string}
 */
function cssVarFromArgb(argb) {
  return [
    colorUtils.redFromArgb(argb),
    colorUtils.greenFromArgb(argb),
    colorUtils.blueFromArgb(argb),
  ].join(',');
}

/**
 * @param {Scheme} scheme
 * @return {string}
 */
function cssVariablesFromScheme(scheme) {
  return /* css */`
    :root {
      --mdw-color__primary: ${cssVarFromArgb(scheme.primary)};
      --mdw-color__on-primary: ${cssVarFromArgb(scheme.onPrimary)};
      --mdw-color__primary-container: ${cssVarFromArgb(scheme.primaryContainer)};
      --mdw-color__on-primary-container: ${cssVarFromArgb(scheme.onPrimaryContainer)};
      --mdw-color__secondary: ${cssVarFromArgb(scheme.secondary)};
      --mdw-color__on-secondary: ${cssVarFromArgb(scheme.onSecondary)};
      --mdw-color__secondary-container: ${cssVarFromArgb(scheme.secondaryContainer)};
      --mdw-color__on-secondary-container: ${cssVarFromArgb(scheme.onSecondaryContainer)};
      --mdw-color__tertiary: ${cssVarFromArgb(scheme.tertiary)};
      --mdw-color__on-tertiary: ${cssVarFromArgb(scheme.onTertiary)};
      --mdw-color__tertiary-container: ${cssVarFromArgb(scheme.tertiaryContainer)};
      --mdw-color__on-tertiary-container: ${cssVarFromArgb(scheme.onTertiaryContainer)};
      --mdw-color__error: ${cssVarFromArgb(scheme.error)};
      --mdw-color__on-error: ${cssVarFromArgb(scheme.onError)};
      --mdw-color__error-container: ${cssVarFromArgb(scheme.errorContainer)};
      --mdw-color__on-error-container: ${cssVarFromArgb(scheme.onErrorContainer)};
      --mdw-color__background: ${cssVarFromArgb(scheme.background)};
      --mdw-color__on-background: ${cssVarFromArgb(scheme.onBackground)};
      --mdw-color__surface: ${cssVarFromArgb(scheme.surface)};
      --mdw-color__on-surface: ${cssVarFromArgb(scheme.onSurface)};
      --mdw-color__surface-dim: ${cssVarFromArgb(scheme.surfaceDim)};
      --mdw-color__surface-bright: ${cssVarFromArgb(scheme.surfaceBright)};
      --mdw-color__surface-container-lowest: ${cssVarFromArgb(scheme.surfaceContainerLowest)};
      --mdw-color__surface-container-low: ${cssVarFromArgb(scheme.surfaceContainerLow)};
      --mdw-color__surface-container: ${cssVarFromArgb(scheme.surfaceContainer)};
      --mdw-color__surface-container-high: ${cssVarFromArgb(scheme.surfaceContainerHigh)};
      --mdw-color__surface-container-highest: ${cssVarFromArgb(scheme.surfaceContainerHighest)};
      --mdw-color__on-surface-variant: ${cssVarFromArgb(scheme.onSurfaceVariant)};
      --mdw-color__outline: ${cssVarFromArgb(scheme.outline)};
      --mdw-color__outline-variant: ${cssVarFromArgb(scheme.outlineVariant)};
      --mdw-color__shadow: ${cssVarFromArgb(scheme.shadow)};
      --mdw-color__scrim: ${cssVarFromArgb(scheme.scrim)};
      --mdw-color__inverse-surface: ${cssVarFromArgb(scheme.inverseSurface)};
      --mdw-color__inverse-on-surface: ${cssVarFromArgb(scheme.inverseOnSurface)};
      --mdw-color__inverse-primary: ${cssVarFromArgb(scheme.inversePrimary)};
    }
  `;
}

/**
 * @param {string} name
 * @param {TonalPalette} tonalPalette
 * @param {boolean} [isDark]
 */
function cssVariablesFromCustom(name, tonalPalette, isDark) {
  return /* css */`
    :root {
      --mdw-color__${name}: ${cssVarFromArgb(tonalPalette.tone(isDark ? 80 : 40))};
      --mdw-color__on-${name}: ${cssVarFromArgb(tonalPalette.tone(isDark ? 20 : 100))};
      --mdw-color__${name}-container: ${cssVarFromArgb(tonalPalette.tone(isDark ? 30 : 90))};
      --mdw-color__on-${name}-container: ${cssVarFromArgb(tonalPalette.tone(isDark ? 90 : 10))};
    }
  `;
}

/**
 * @param {string} mainColor as hex
 * @param {Iterable<[string,string]>} [customColors]
 * @return {Record<string, string>}
 */
export function getScheme(mainColor, customColors = []) {
  const argbColor = argbFromHex(mainColor);
  const lightRules = [cssVariablesFromScheme(Scheme.light(argbColor))];
  const darkRules = [cssVariablesFromScheme(Scheme.dark(argbColor))];
  const lightContentRules = [cssVariablesFromScheme(Scheme.lightContent(argbColor))];
  const darkContentRules = [cssVariablesFromScheme(Scheme.darkContent(argbColor))];
  for (const [name, color] of customColors) {
    const argbCustom = argbFromHex(color);
    const blended = harmonize(argbCustom, argbColor);
    const { a1: tp } = CorePalette.of(blended);
    const { a1: ctp } = CorePalette.contentOf(blended);

    lightRules.push(cssVariablesFromCustom(name, tp));
    darkRules.push(cssVariablesFromCustom(name, tp, true));
    lightContentRules.push(cssVariablesFromCustom(name, ctp));
    darkContentRules.push(cssVariablesFromCustom(name, ctp, true));
  }
  return {
    light: lightRules.join('\n'),
    dark: darkRules.join('\n'),
    lightContent: lightContentRules.join('\n'),
    darkContent: darkContentRules.join('\n'),
  };
}
