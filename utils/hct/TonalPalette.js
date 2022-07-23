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

import Hct from './Hct.js';

/**
 *  A convenience class for retrieving colors that are constant in hue and
 *  chroma, but vary in tone.
 */
export default class TonalPalette {
  /** @type {Map<number, number>} */
  #cache = new Map();

  /**
   * @param {number} argb ARGB representation of a color
   * @return {TonalPalette} Tones matching that color's hue and chroma.
   */
  static fromInt(argb) {
    const hct = Hct.fromInt(argb);
    return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
  }

  /**
   * @param {number} hue HCT hue
   * @param {number} chroma HCT chroma
   * @return {TonalPalette} Tones matching hue and chroma.
   */
  static fromHueAndChroma(hue, chroma) {
    return new TonalPalette(hue, chroma);
  }

  /**
   * @private
   * @param {number} hue
   * @param {number} chroma
   */
  constructor(hue, chroma) {
    this.hue = hue;
    this.chroma = chroma;
  }

  /**
   * @param {number} tone HCT tone, measured from 0 to 100.
   * @return  {number} ARGB representation of a color with that tone.
   */
  tone(tone) {
    let argb = this.#cache.get(tone);
    if (argb === undefined) {
      argb = Hct.from(this.hue, this.chroma, tone).toInt();
      this.#cache.set(tone, argb);
    }
    return argb;
  }
}
