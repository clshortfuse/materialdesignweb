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

import ViewingConditions from './ViewingConditions.js';

/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */
export default class Cam16 {
  /**
   * @param {number} argb ARGB representation of a color.
   * @return {Cam16} CAM16 color, assuming the color was viewed in default viewing
   *     conditions.
   */
  static fromInt(argb) {
    return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
  }

  /**
   * @param {number} argb ARGB representation of a color.
   * @param {ViewingConditions} viewingConditions Information about the environment where the color
   *     was observed.
   * @return {Cam16} CAM16 color.
   */
  static fromIntInViewingConditions(argb, viewingConditions) {
    const red = (argb & 0x00_FF_00_00) >> 16;
    const green = (argb & 0x00_00_FF_00) >> 8;
    const blue = (argb & 0x00_00_00_FF);
    const redL = utils.linearized(red);
    const greenL = utils.linearized(green);
    const blueL = utils.linearized(blue);
    const x = 0.412_338_95 * redL + 0.357_620_64 * greenL + 0.180_510_42 * blueL;
    const y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
    const z = 0.019_321_41 * redL + 0.119_163_82 * greenL + 0.950_344_78 * blueL;

    const rC = 0.401_288 * x + 0.650_173 * y - 0.051_461 * z;
    const gC = -0.250_268 * x + 1.204_414 * y + 0.045_854 * z;
    const bC = -0.002_079 * x + 0.048_952 * y + 0.953_127 * z;

    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC;

    const rAF = ((viewingConditions.fl * Math.abs(rD)) / 100) ** 0.42;
    const gAF = ((viewingConditions.fl * Math.abs(gD)) / 100) ** 0.42;
    const bAF = ((viewingConditions.fl * Math.abs(bD)) / 100) ** 0.42;

    const rA = (math.signum(rD) * 400 * rAF) / (rAF + 27.13);
    const gA = (math.signum(gD) * 400 * gAF) / (gAF + 27.13);
    const bA = (math.signum(bD) * 400 * bAF) / (bAF + 27.13);

    const a = (11 * rA + -12 * gA + bA) / 11;
    const b = (rA + gA - 2 * bA) / 9;
    const u = (20 * rA + 20 * gA + 21 * bA) / 20;
    const p2 = (40 * rA + 20 * gA + bA) / 20;
    const atan2 = Math.atan2(b, a);
    const atanDegrees = (atan2 * 180) / Math.PI;
    const hue = atanDegrees < 0 ? atanDegrees + 360
      : (atanDegrees >= 360 ? atanDegrees - 360
        : atanDegrees);
    const hueRadians = (hue * Math.PI) / 180;

    const ac = p2 * viewingConditions.nbb;
    const j = 100
        * (ac / viewingConditions.aw) ** (viewingConditions.c * viewingConditions.z);
    const q = (4 / viewingConditions.c) * Math.sqrt(j / 100)
        * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue = 0.25 * (Math.cos((huePrime * Math.PI) / 180 + 2) + 3.8);
    const p1 = (50_000 / 13) * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305);
    const alpha = t ** 0.9
        * (1.64 - 0.29 ** viewingConditions.n) ** 0.73;
    const c = alpha * Math.sqrt(j / 100);
    const m = c * viewingConditions.fLRoot;
    const s = 50
        * Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4));
    const jstar = ((1 + 100 * 0.007) * j) / (1 + 0.007 * j);
    const mstar = (1 / 0.0228) * Math.log(1 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);

    return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
  }

  /**
   * @param {number} j CAM16 lightness
   * @param {number} c CAM16 chroma
   * @param {number} h CAM16 hue
   * @return {Cam16}
   */
  static fromJch(j, c, h) {
    return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
  }

  /**
   * @param {number} j CAM16 lightness
   * @param {number} c CAM16 chroma
   * @param {number} h CAM16 hue
   * @param {ViewingConditions} viewingConditions Information about the environment where the color
   *     was observed.
   */
  static fromJchInViewingConditions(j, c, h, viewingConditions) {
    const q = (4 / viewingConditions.c) * Math.sqrt(j / 100)
        * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
    const m = c * viewingConditions.fLRoot;
    const alpha = c / Math.sqrt(j / 100);
    const s = 50
        * Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4));
    const hueRadians = (h * Math.PI) / 180;
    const jstar = ((1 + 100 * 0.007) * j) / (1 + 0.007 * j);
    const mstar = (1 / 0.0228) * Math.log(1 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
  }

  /**
   * @param {number} jstar CAM16-UCS lightness.
   * @param {number} astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param {number} bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   * @return {Cam16}
   */
  static fromUcs(jstar, astar, bstar) {
    return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
  }

  /**
   * @param {number} jstar CAM16-UCS lightness.
   * @param {number} astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param {number} bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   * @param {ViewingConditions} viewingConditions Information about the environment where the color
   *     was observed.
   */
  static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
    const a = astar;
    const b = bstar;
    const m = Math.sqrt(a * a + b * b);
    const M = (Math.exp(m * 0.0228) - 1) / 0.0228;
    const c = M / viewingConditions.fLRoot;
    let h = Math.atan2(b, a) * (180 / Math.PI);
    if (h < 0) {
      h += 360;
    }
    const j = jstar / (1 - (jstar - 100) * 0.007);
    return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
  }

  /**
   * Given color expressed in XYZ and viewed in [viewingConditions], convert to
   * CAM16.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {ViewingConditions} viewingConditions
   * @return {Cam16}
   */
  static fromXyzInViewingConditions(x, y, z, viewingConditions) {
    // Transform XYZ to 'cone'/'rgb' responses

    const rC = 0.401_288 * x + 0.650_173 * y - 0.051_461 * z;
    const gC = -0.250_268 * x + 1.204_414 * y + 0.045_854 * z;
    const bC = -0.002_079 * x + 0.048_952 * y + 0.953_127 * z;

    // Discount illuminant
    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC;

    // chromatic adaptation
    const rAF = ((viewingConditions.fl * Math.abs(rD)) / 100) ** 0.42;
    const gAF = ((viewingConditions.fl * Math.abs(gD)) / 100) ** 0.42;
    const bAF = ((viewingConditions.fl * Math.abs(bD)) / 100) ** 0.42;
    const rA = (math.signum(rD) * 400 * rAF) / (rAF + 27.13);
    const gA = (math.signum(gD) * 400 * gAF) / (gAF + 27.13);
    const bA = (math.signum(bD) * 400 * bAF) / (bAF + 27.13);

    // redness-greenness
    const a = (11 * rA + -12 * gA + bA) / 11;
    // yellowness-blueness
    const b = (rA + gA - 2 * bA) / 9;

    // auxiliary components
    const u = (20 * rA + 20 * gA + 21 * bA) / 20;
    const p2 = (40 * rA + 20 * gA + bA) / 20;

    // hue
    const atan2 = Math.atan2(b, a);
    const atanDegrees = (atan2 * 180) / Math.PI;
    const hue = atanDegrees < 0 ? atanDegrees + 360
      : (atanDegrees >= 360 ? atanDegrees - 360
        : atanDegrees);
    const hueRadians = (hue * Math.PI) / 180;

    // achromatic response to color
    const ac = p2 * viewingConditions.nbb;

    // CAM16 lightness and brightness
    const J = 100
        * (ac / viewingConditions.aw) ** (viewingConditions.c * viewingConditions.z);
    const Q = (4 / viewingConditions.c) * Math.sqrt(J / 100)
        * (viewingConditions.aw + 4) * (viewingConditions.fLRoot);

    const huePrime = (hue < 20.14) ? hue + 360 : hue;
    const eHue = (1 / 4) * (Math.cos((huePrime * Math.PI) / 180 + 2) + 3.8);
    const p1 = (50_000 / 13) * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305);
    const alpha = t ** 0.9
        * (1.64 - 0.29 ** viewingConditions.n) ** 0.73;
    // CAM16 chroma, colorfulness, chroma
    const C = alpha * Math.sqrt(J / 100);
    const M = C * viewingConditions.fLRoot;
    const s = 50
        * Math.sqrt((alpha * viewingConditions.c) / (viewingConditions.aw + 4));

    // CAM16-UCS components
    const jstar = ((1 + 100 * 0.007) * J) / (1 + 0.007 * J);
    const mstar = Math.log(1 + 0.0228 * M) / 0.0228;
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
  }

  /**
   * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
   * the following combinations:
   *      -  {j or q} and {c, m, or s} and hue
   *      - jstar, astar, bstar
   * Prefer using a static method that constructs from 3 of those dimensions.
   * This constructor is intended for those methods to use to return all
   * possible dimensions.
   * @param {number} hue
   * @param {number} chroma informally, colorfulness / color intensity. like saturation
   *     in HSL, except perceptually accurate.
   * @param {number} j lightness
   * @param {number} q brightness; ratio of lightness to white point's lightness
   * @param {number} m colorfulness
   * @param {number} s saturation; ratio of chroma to white point's chroma
   * @param {number} jstar CAM16-UCS J coordinate
   * @param {number} astar CAM16-UCS a coordinate
   * @param {number} bstar CAM16-UCS b coordinate
   */
  constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
    /** @readonly */
    this.hue = hue;
    /** @readonly */
    this.chroma = chroma;
    /** @readonly */
    this.j = j;
    /** @readonly */
    this.q = q;
    /** @readonly */
    this.m = m;
    /** @readonly */
    this.s = s;
    /** @readonly */
    this.jstar = jstar;
    /** @readonly */
    this.astar = astar;
    /** @readonly */
    this.bstar = bstar;
  }

  /**
   * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
   * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
   * specification, and is used to measure distances between colors.
   * @param {Cam16} other
   * @return {number}
   */
  distance(other) {
    const dJ = this.jstar - other.jstar;
    const dA = this.astar - other.astar;
    const dB = this.bstar - other.bstar;
    const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
    const dE = 1.41 * dEPrime ** 0.63;
    return dE;
  }

  /**
   *  @return {number} ARGB representation of color, assuming the color was viewed in
   *     default viewing conditions, which are near-identical to the default
   *     viewing conditions for sRGB.
   */
  toInt() {
    return this.viewed(ViewingConditions.DEFAULT);
  }

  /**
   * @param {ViewingConditions} viewingConditions Information about the environment where the color
   *     will be viewed.
   * @return {number} ARGB representation of color
   */
  viewed(viewingConditions) {
    const alpha = this.chroma === 0 || this.j === 0
      ? 0
      : this.chroma / Math.sqrt(this.j / 100);

    const t = (alpha / (1.64 - 0.29 ** viewingConditions.n) ** 0.73) ** (1 / 0.9);
    const hRad = (this.hue * Math.PI) / 180;

    const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
    const ac = viewingConditions.aw
        * (this.j / 100) ** (1 / viewingConditions.c / viewingConditions.z);
    const p1 = eHue * (50_000 / 13) * viewingConditions.nc * viewingConditions.ncb;
    const p2 = ac / viewingConditions.nbb;

    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);

    const gamma = (23 * (p2 + 0.305) * t)
        / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
    const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
    const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;

    const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400 - Math.abs(rA)));
    const rC = math.signum(rA) * (100 / viewingConditions.fl)
        * rCBase ** (1 / 0.42);
    const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400 - Math.abs(gA)));
    const gC = math.signum(gA) * (100 / viewingConditions.fl)
        * gCBase ** (1 / 0.42);
    const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400 - Math.abs(bA)));
    const bC = math.signum(bA) * (100 / viewingConditions.fl)
        * bCBase ** (1 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];

    const x = 1.862_067_86 * rF - 1.011_254_63 * gF + 0.149_186_77 * bF;
    const y = 0.387_526_54 * rF + 0.621_447_44 * gF - 0.008_973_98 * bF;
    const z = -0.015_841_5 * rF - 0.034_122_94 * gF + 1.049_964_44 * bF;

    const argb = utils.argbFromXyz(x, y, z);
    return argb;
  }

  /**
   * XYZ representation of CAM16 seen in [viewingConditions].
   * @param {ViewingConditions} viewingConditions
   * @return {number[]}
   */
  xyzInViewingConditions(viewingConditions) {
    const alpha = (this.chroma === 0 || this.j === 0)
      ? 0
      : this.chroma / Math.sqrt(this.j / 100);

    const t = (alpha / (1.64 - 0.29 ** viewingConditions.n) ** 0.73) ** (1 / 0.9);
    const hRad = (this.hue * Math.PI) / 180;

    const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
    const ac = viewingConditions.aw
        * (this.j / 100) ** (1 / viewingConditions.c / viewingConditions.z);
    const p1 = eHue * (50_000 / 13) * viewingConditions.nc * viewingConditions.ncb;

    const p2 = (ac / viewingConditions.nbb);

    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);

    const gamma = (23 * (p2 + 0.305) * t)
        / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
    const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
    const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;

    const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400 - Math.abs(rA)));
    const rC = math.signum(rA) * (100 / viewingConditions.fl)
        * rCBase ** (1 / 0.42);
    const gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400 - Math.abs(gA)));
    const gC = math.signum(gA) * (100 / viewingConditions.fl)
        * gCBase ** (1 / 0.42);
    const bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400 - Math.abs(bA)));
    const bC = math.signum(bA) * (100 / viewingConditions.fl)
        * bCBase ** (1 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];

    const x = 1.862_067_86 * rF - 1.011_254_63 * gF + 0.149_186_77 * bF;
    const y = 0.387_526_54 * rF + 0.621_447_44 * gF - 0.008_973_98 * bF;
    const z = -0.015_841_5 * rF - 0.034_122_94 * gF + 1.049_964_44 * bF;

    return [x, y, z];
  }
}
