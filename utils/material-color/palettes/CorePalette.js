/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Hct from '../hct/Hct.js';

import TonalPalette from './TonalPalette.js';

/**
 * Set of colors to generate a [CorePalette] from
 * @typedef CorePaletteColors
 * @prop {number} primary
 * @prop {number} [secondary]
 * @prop {number} [tertiary]
 * @prop {number} [neutral]
 * @prop {number} [neutralVariant]
 * @prop {number} [error]
 */

/**
 * An intermediate concept between the key color for a UI theme, and a full
 * color scheme. 5 sets of tones are generated, all except one use the same hue
 * as the key color, and all vary in chroma.
 */
export default class CorePalette {
  /**
   * @param {boolean} content
   * @param {CorePaletteColors} colors
   * @return {CorePalette}
   */
  static #createPaletteFromColors(content, colors) {
    const palette = new CorePalette(colors.primary, content);
    if (colors.secondary) {
      const p = new CorePalette(colors.secondary, content);
      palette.a2 = p.a1;
    }
    if (colors.tertiary) {
      const p = new CorePalette(colors.tertiary, content);
      palette.a3 = p.a1;
    }
    if (colors.error) {
      const p = new CorePalette(colors.error, content);
      palette.error = p.a1;
    }
    if (colors.neutral) {
      const p = new CorePalette(colors.neutral, content);
      palette.n1 = p.n1;
    }
    if (colors.neutralVariant) {
      const p = new CorePalette(colors.neutralVariant, content);
      palette.n2 = p.n2;
    }
    return palette;
  }

  /**
   * @param {number} argb ARGB representation of a color
   * @return {CorePalette}
   */
  static of(argb) {
    return new CorePalette(argb, false);
  }

  /**
   * @param {number} argb ARGB representation of a color
   * @return {CorePalette}
   */
  static contentOf(argb) {
    return new CorePalette(argb, true);
  }

  /**
   * Create a [CorePalette] from a set of colors
   * @param {CorePaletteColors} colors
   * @return {CorePalette}
   */
  static fromColors(colors) {
    return CorePalette.#createPaletteFromColors(false, colors);
  }

  /**
   * Create a content [CorePalette] from a set of colors
   * @param {CorePaletteColors} colors
   * @return {CorePalette}
   */
  static contentFromColors(colors) {
    return CorePalette.#createPaletteFromColors(true, colors);
  }

  /** @type {TonalPalette} */
  a1;

  /** @type {TonalPalette} */
  a2;

  /** @type {TonalPalette} */
  a3;

  /** @type {TonalPalette} */
  n1;

  /** @type {TonalPalette} */
  n2;

  /** @type {TonalPalette} */
  error;

  /**
   * @param {number} argb
   * @param {boolean} isContent
   */
  constructor(argb, isContent) {
    const hct = Hct.fromInt(argb);
    const { hue } = hct;
    const { chroma } = hct;
    if (isContent) {
      this.a1 = TonalPalette.fromHueAndChroma(hue, chroma);
      this.a2 = TonalPalette.fromHueAndChroma(hue, chroma / 3);
      this.a3 = TonalPalette.fromHueAndChroma(hue + 60, chroma / 2);
      this.n1 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 12, 4));
      this.n2 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 6, 8));
    } else {
      this.a1 = TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma));
      this.a2 = TonalPalette.fromHueAndChroma(hue, 16);
      this.a3 = TonalPalette.fromHueAndChroma(hue + 60, 24);
      this.n1 = TonalPalette.fromHueAndChroma(hue, 4);
      this.n2 = TonalPalette.fromHueAndChroma(hue, 8);
    }
    this.error = TonalPalette.fromHueAndChroma(25, 84);
  }
}
