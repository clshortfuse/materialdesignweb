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

/**
 * A color system built using CAM16 hue and chroma, and L* from
 * L*a*b*.
 *
 * Using L* creates a link between the color system, contrast, and thus
 * accessibility. Contrast ratio depends on relative luminance, or Y in the XYZ
 * color space. L*, or perceptual luminance can be calculated from Y.
 *
 * Unlike Y, L* is linear to human perception, allowing trivial creation of
 * accurate color tones.
 *
 * Unlike contrast ratio, measuring contrast in L* is linear, and simple to
 * calculate. A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0,
 * and a difference of 50 guarantees a contrast ratio >= 4.5.
 */

import * as utils from '../utils/color.js';

import Cam16 from './Cam16.js';
import ViewingConditions from './ViewingConditions.js';
import * as hctSolver from './hctSolver.js';

/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */
export default class Hct {
  /**
   * @param hue 0 <= hue < 360; invalid values are corrected.
   * @param chroma 0 <= chroma < ?; Informally, colorfulness. The color
   *     returned may be lower than the requested chroma. Chroma has a different
   *     maximum for any given hue and tone.
   * @param tone 0 <= tone <= 100; invalid values are corrected.
   * @return HCT representation of a color in default viewing conditions.
   */

  /**
   * @param {number} hue
   * @param {number} chroma
   * @param {number} tone
   * @return {Hct}
   */
  static from(hue, chroma, tone) {
    return new Hct(hctSolver.solveToInt(hue, chroma, tone));
  }

  /**
   * @param {number} argb ARGB representation of a color.
   * @return {Hct} HCT representation of a color in default viewing conditions
   */
  static fromInt(argb) {
    return new Hct(argb);
  }

  /** @type {number} */
  internalHue;

  /** @type {number} */
  internalChroma;

  /** @type {number} */
  internalTone;

  /** @param {number} argb */
  constructor(argb) {
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = utils.lstarFromArgb(argb);
    this.argb = argb;
  }

  /** @return {number} */
  toInt() {
    return this.argb;
  }

  /**
   * A number, in degrees, representing ex. red, orange, yellow, etc.
   * Ranges from 0 <= hue < 360.
   * @return {number}
   */
  get hue() {
    return this.internalHue;
  }

  /**
   * @param {number} newHue 0 <= newHue < 360; invalid values are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set hue(newHue) {
    this.setInternalState(
      hctSolver.solveToInt(
        newHue,
        this.internalChroma,
        this.internalTone,
      ),
    );
  }

  /** @return {number} */
  get chroma() {
    return this.internalChroma;
  }

  /**
   * @param {number} newChroma 0 <= newChroma < ?
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set chroma(newChroma) {
    this.setInternalState(
      hctSolver.solveToInt(
        this.internalHue,
        newChroma,
        this.internalTone,
      ),
    );
  }

  /**
   * Lightness. Ranges from 0 to 100.
   * @return {number}
   */
  get tone() {
    return this.internalTone;
  }

  /**
   * @param {number} newTone 0 <= newTone <= 100; invalid valids are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */
  set tone(newTone) {
    this.setInternalState(
      hctSolver.solveToInt(
        this.internalHue,
        this.internalChroma,
        newTone,
      ),
    );
  }

  /**
   * @private
   * @param {number} argb
   */
  setInternalState(argb) {
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = utils.lstarFromArgb(argb);
    this.argb = argb;
  }

  /**
   * Translates a color into different [ViewingConditions].
   *
   * Colors change appearance. They look different with lights on versus off,
   * the same color, as in hex code, on white looks different when on black.
   * This is called color relativity, most famously explicated by Josef Albers
   * in Interaction of Color.
   *
   * In color science, color appearance models can account for this and
   * calculate the appearance of a color in different settings. HCT is based on
   * CAM16, a color appearance model, and uses it to make these calculations.
   *
   * See [ViewingConditions.make] for parameters affecting color appearance.
   * @param {ViewingConditions} vc
   * @return {Hct}
   */
  inViewingConditions(vc) {
    // 1. Use CAM16 to find XYZ coordinates of color in specified VC.
    const cam = Cam16.fromInt(this.toInt());
    const viewedInVc = cam.xyzInViewingConditions(vc);

    // 2. Create CAM16 of those XYZ coordinates in default VC.
    const recastInVc = Cam16.fromXyzInViewingConditions(
      viewedInVc[0],
      viewedInVc[1],
      viewedInVc[2],
      ViewingConditions.make(),
    );

    // 3. Create HCT from:
    // - CAM16 using default VC with XYZ coordinates in specified VC.
    // - L* converted from Y in XYZ coordinates in specified VC.
    const recastHct = Hct.from(
      recastInVc.hue,
      recastInVc.chroma,
      utils.lstarFromY(viewedInVc[1]),
    );
    return recastHct;
  }
}
