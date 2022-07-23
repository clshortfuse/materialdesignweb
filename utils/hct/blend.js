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

// libmonet is designed to have a consistent API across platforms
// and modular components that can be moved around easily. Using a class as a
// namespace facilitates this.
//
// tslint:disable:class-as-namespace

import Cam16 from './Cam16.js';
import Hct from './Hct.js';
import * as colorUtils from './colorUtils.js';
import * as mathUtils from './mathUtils.js';

/**
 * Blend the design color's HCT hue towards the key color's HCT
 * hue, in a way that leaves the original color recognizable and
 * recognizably shifted towards the key color.
 * @param {number} designColor ARGB representation of an arbitrary color.
 * @param {number} sourceColor ARGB representation of the main theme color.
 * @return {number} The design color with a hue shifted towards the
 * system's color, a slightly warmer/cooler variant of the design
 * color's hue.
 */
export function harmonize(designColor, sourceColor) {
  const fromHct = Hct.fromInt(designColor);
  const toHct = Hct.fromInt(sourceColor);
  const differenceDegrees = mathUtils.differenceDegrees(fromHct.hue, toHct.hue);
  const rotationDegrees = Math.min(differenceDegrees * 0.5, 15);
  const outputHue = mathUtils.sanitizeDegreesDouble(
    fromHct.hue
        + rotationDegrees * mathUtils.rotationDirection(fromHct.hue, toHct.hue),
  );
  return Hct.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
}

/**
 * Blend in CAM16-UCS space.
 * @param {number} from ARGB representation of color
 * @param {number} to ARGB representation of color
 * @param {number} amount how much blending to perform; 0.0 >= and <= 1.0
 * @return {number} from, blended towards to. Hue, chroma, and tone will
 * change.
 */
export function cam16Ucs(from, to, amount) {
  const fromCam = Cam16.fromInt(from);
  const toCam = Cam16.fromInt(to);
  const fromJ = fromCam.jstar;
  const fromA = fromCam.astar;
  const fromB = fromCam.bstar;
  const toJ = toCam.jstar;
  const toA = toCam.astar;
  const toB = toCam.bstar;
  const jstar = fromJ + (toJ - fromJ) * amount;
  const astar = fromA + (toA - fromA) * amount;
  const bstar = fromB + (toB - fromB) * amount;
  return Cam16.fromUcs(jstar, astar, bstar).toInt();
}

/**
 * Blends hue from one color into another. The chroma and tone of
 * the original color are maintained.
 * @param {number} from ARGB representation of color
 * @param {number} to ARGB representation of color
 * @param {number} amount how much blending to perform; 0.0 >= and <= 1.0
 * @return {number} from, with a hue blended towards to. Chroma and tone
 * are constant.
 */
export function hctHue(from, to, amount) {
  const ucs = cam16Ucs(from, to, amount);
  const ucsCam = Cam16.fromInt(ucs);
  const fromCam = Cam16.fromInt(from);
  const blended = Hct.from(
    ucsCam.hue,
    fromCam.chroma,
    colorUtils.lstarFromArgb(from),
  );
  return blended.toInt();
}
