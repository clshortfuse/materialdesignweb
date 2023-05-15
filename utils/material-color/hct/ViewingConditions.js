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

import * as utils from '../utils/color.js';
import * as math from '../utils/math.js';

/**
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 *
 * This class caches intermediate values of the CAM16 conversion process that
 * depend only on viewing conditions, enabling speed ups.
 */
export default class ViewingConditions {
  /** sRGB-like viewing conditions.  */
  static DEFAULT = ViewingConditions.make();

  /**
   * Create ViewingConditions from a simple, physically relevant, set of
   * parameters.
   * @param whitePoint White point, measured in the XYZ color space.
   *     default = D65, or sunny day afternoon
   * @param {number} adaptingLuminance The luminance of the adapting field. Informally,
   *     how bright it is in the room where the color is viewed. Can be
   *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
   *     or 200 lux.
   * @param {number} backgroundLstar The lightness of the area surrounding the color.
   *     measured by L* in L*a*b*. default = 50.0
   * @param {number} surround A general description of the lighting surrounding the
   *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
   *     dimly light room, like watching TV at home at night. 2.0 means there
   *     is no difference between the lighting on the color and around it.
   *     default = 2.0
   * @param {boolean} discountingIlluminant Whether the eye accounts for the tint of the
   *     ambient lighting, such as knowing an apple is still red in green light.
   *     default = false, the eye does not perform this process on
   *       self-luminous objects like displays.
   * @return {ViewingConditions}
   */
  static make(
    whitePoint = utils.whitePointD65(),
    adaptingLuminance = ((200 / Math.PI) * utils.yFromLstar(50)) / 100,
    backgroundLstar = 50,
    surround = 2,
    discountingIlluminant = false,
  ) {
    const xyz = whitePoint;
    const rW = xyz[0] * 0.401_288 + xyz[1] * 0.650_173 + xyz[2] * -0.051_461;
    const gW = xyz[0] * -0.250_268 + xyz[1] * 1.204_414 + xyz[2] * 0.045_854;
    const bW = xyz[0] * -0.002_079 + xyz[1] * 0.048_952 + xyz[2] * 0.953_127;
    const f = 0.8 + surround / 10;
    const c = f >= 0.9 ? math.lerp(0.59, 0.69, (f - 0.9) * 10)
      : math.lerp(0.525, 0.59, (f - 0.8) * 10);
    let d = discountingIlluminant
      ? 1
      : f * (1 - (1 / 3.6) * Math.exp((-adaptingLuminance - 42) / 92));
    d = d > 1 ? 1 : (d < 0 ? 0 : d);
    const nc = f;
    const rgbD = [
      d * (100 / rW) + 1 - d,
      d * (100 / gW) + 1 - d,
      d * (100 / bW) + 1 - d,
    ];
    const k = 1 / (5 * adaptingLuminance + 1);
    const k4 = k * k * k * k;
    const k4F = 1 - k4;
    const fl = k4 * adaptingLuminance
      + 0.1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance);
    const n = utils.yFromLstar(backgroundLstar) / whitePoint[1];
    const z = 1.48 + Math.sqrt(n);
    const nbb = 0.725 / n ** 0.2;
    const ncb = nbb;
    const rgbAFactors = [
      ((fl * rgbD[0] * rW) / 100) ** 0.42,
      ((fl * rgbD[1] * gW) / 100) ** 0.42,
      ((fl * rgbD[2] * bW) / 100) ** 0.42,
    ];
    const rgbA = [
      (400 * rgbAFactors[0]) / (rgbAFactors[0] + 27.13),
      (400 * rgbAFactors[1]) / (rgbAFactors[1] + 27.13),
      (400 * rgbAFactors[2]) / (rgbAFactors[2] + 27.13),
    ];
    const aw = (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
    return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, fl ** 0.25, z);
  }

  /**
   * Parameters are intermediate values of the CAM16 conversion process. Their
   * names are shorthand for technical color science terminology, this class
   * would not benefit from documenting them individually. A brief overview
   * is available in the CAM16 specification, and a complete overview requires
   * a color science textbook, such as Fairchild's Color Appearance Models.
   * @param {number} n
   * @param {number} aw
   * @param {number} nbb
   * @param {number} ncb
   * @param {number} c
   * @param {number} nc
   * @param {number[]} rgbD
   * @param {number} fl
   * @param {number} fLRoot
   * @param {number} z
   */
  constructor(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
    this.n = n;
    this.aw = aw;
    this.nbb = nbb;
    this.ncb = ncb;
    this.c = c;
    this.nc = nc;
    this.rgbD = rgbD;
    this.fl = fl;
    this.fLRoot = fLRoot;
    this.z = z;
  }
}
