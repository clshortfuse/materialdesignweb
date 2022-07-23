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

import Cam16 from './Cam16.js';
import ViewingConditions from './ViewingConditions.js';
import * as colorUtils from './colorUtils.js';
import * as mathUtils from './mathUtils.js';

/**
 * A class that solves the HCT equation.
 */
// libmonet is designed to have a consistent API across platforms
// and modular components that can be moved around easily. Using a class as a
// namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace

export const SCALED_DISCOUNT_FROM_LINRGB = [
  [
    0.001_200_833_568_784_504,
    0.002_389_694_492_170_889,
    0.000_279_574_288_586_112_4,
  ],
  [
    0.000_589_108_665_137_599_9,
    0.002_978_550_257_343_875_8,
    0.000_327_066_610_400_839_8,
  ],
  [
    0.000_101_466_924_916_405_72,
    0.000_536_421_435_918_669_4,
    0.003_297_940_177_071_207_6,
  ],
];

export const LINRGB_FROM_SCALED_DISCOUNT = [
  [
    1373.219_870_959_423_1,
    -1100.425_119_075_482_1,
    -7.278_681_089_101_213,
  ],
  [
    -271.815_969_077_903,
    559.658_046_594_073_3,
    -32.460_474_827_911_94,
  ],
  [
    1.962_289_959_966_566_6,
    -57.173_814_538_844_006,
    308.723_319_781_238_5,
  ],
];

export const Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];

export const CRITICAL_PLANES = [
  0.015_176_349_177_441_876, 0.045_529_047_532_325_624, 0.075_881_745_887_209_38,
  0.106_234_444_242_093_13, 0.136_587_142_596_976_85, 0.166_939_840_951_860_62,
  0.197_292_539_306_744_34, 0.227_645_237_661_628_1, 0.257_997_936_016_511_9,
  0.288_350_634_371_395_63, 0.318_830_090_443_053_2, 0.350_925_934_958_123,
  0.384_831_493_309_642_6, 0.420_574_803_010_494_66, 0.458_183_274_052_838,
  0.497_683_725_027_402_3, 0.539_102_415_980_638_1, 0.582_465_078_404_089_8,
  0.627_796_942_691_410_7, 0.675_122_763_349_862_3, 0.724_466_842_212_892_1,
  0.775_853_049_866_786, 0.829_304_845_476_233, 0.884_845_295_169_849_8,
  0.942_497_089_126_609, 1.002_282_557_486_903_9, 1.064_223_685_197_357_7,
  1.128_342_125_885_829_7, 1.194_659_214_852_212_8, 1.263_195_981_251_186_4,
  1.333_973_159_534_903_4, 1.407_011_200_216_447, 1.482_330_280_008_641_5,
  1.559_950_311_387_327_2, 1.639_890_951_623_367_7, 1.722_171_611_323_410_5,
  1.806_811_462_515_637_7, 1.893_829_446_313_407_3, 1.983_244_280_186_685_2,
  2.075_074_464_868_551, 2.169_338_290_921_623_4, 2.266_053_844_987_206_3,
  2.365_239_015_737_95, 2.466_911_499_553_200_7, 2.571_088_805_934_576_4,
  2.677_788_262_677_978_5, 2.787_027_020_816_925_7, 2.898_822_059_350_997,
  3.013_190_189_772_090_7, 3.130_148_060_400_286_3, 3.249_712_160_540_222_6,
  3.371_898_824_468_108_7, 3.496_724_235_258_794_6, 3.624_204_428_461_639,
  3.754_355_295_633_311, 3.887_192_587_735_158, 4.022_731_918_402_185,
  4.160_988_767_090_289, 4.301_978_482_107_941, 4.445_716_283_538_092,
  4.592_217_266_055_746, 4.741_496_401_646_282, 4.893_568_542_229_298,
  5.048_448_422_192_488, 5.206_150_660_839_72, 5.366_689_764_757_337_5,
  5.530_080_130_102_386_5, 5.696_336_044_816_294, 5.865_471_690_767_354,
  6.037_501_145_825_082, 6.212_438_385_869_475, 6.390_297_286_737_924,
  6.571_091_626_112_461, 6.754_835_085_349_804_5, 6.941_541_251_256_611,
  7.131_223_617_812_143, 7.323_895_587_840_543, 7.519_570_474_634_666_5,
  7.718_261_503_533_434_5, 7.919_981_813_454_504, 8.124_744_458_384_042,
  8.332_562_408_825_165, 8.543_448_553_206_703, 8.757_415_699_253_682,
  8.974_476_575_321_063, 9.194_643_831_691_977, 9.417_930_041_841_839,
  9.644_347_703_669_503, 9.873_909_240_696_694, 10.106_627_003_236_781,
  10.342_513_269_534_024, 10.581_580_246_874_27, 10.823_840_072_668_1,
  11.069_304_815_507_364, 11.317_986_476_196_008, 11.569_896_988_756_009,
  11.825_048_221_409_341, 12.083_451_977_536_606, 12.345_119_996_613_247,
  12.610_063_955_123_938, 12.878_295_467_455_942, 13.149_826_086_772_048,
  13.424_667_305_863_72, 13.702_830_557_985_108, 13.984_327_217_668_513,
  14.269_168_601_521_828, 14.557_365_969_008_56, 14.848_930_523_210_871,
  15.143_873_411_576_273, 15.442_205_726_648_32, 15.743_938_506_781_891,
  16.049_082_736_843_37, 16.357_649_348_896_34, 16.669_649_222_873_04,
  16.985_093_187_232_053, 17.303_992_019_602_69, 17.626_356_447_416_25,
  17.952_197_148_524_76, 18.281_524_751_807_332, 18.614_349_837_764_564,
  18.950_682_939_101_38, 19.290_534_541_298_456, 19.633_915_083_172_692,
  19.980_834_957_426_89, 20.331_304_511_189_067, 20.685_334_046_541_502,
  21.042_933_821_039_977, 21.404_114_048_223_256, 21.768_884_898_113_22,
  22.137_256_497_705_877, 22.509_238_931_453_28, 22.884_842_241_736_916,
  23.264_076_429_332_462, 23.646_951_453_866_3, 24.033_477_234_264_016,
  24.423_663_649_190_83, 24.817_520_537_484_558, 25.215_057_698_580_89,
  25.616_284_892_931_38, 26.021_211_842_414_342, 26.429_848_230_738_664,
  26.842_203_703_840_827, 27.258_287_870_275_353, 27.678_110_301_598_522,
  28.101_680_532_745_97, 28.529_008_062_403_893, 28.960_102_353_374_22,
  29.394_972_832_933_96, 29.833_628_893_188_45, 30.276_079_891_419_332,
  30.722_335_150_426_627, 31.172_403_958_865_512, 31.626_295_571_577_85,
  32.084_019_209_918_37, 32.545_584_062_075_92, 33.010_999_283_389_665,
  33.480_273_996_660_3, 33.953_417_292_456_834, 34.430_438_229_418_264,
  34.911_345_834_551_085, 35.396_149_103_522_07, 35.884_857_000_946_71,
  36.377_478_460_673_49, 36.874_022_386_063_82, 37.374_497_650_267_89,
  37.878_913_096_496_59, 38.387_277_538_289_26, 38.899_599_759_777_85,
  39.415_888_515_946_97, 39.936_152_532_890_54, 40.460_400_508_064_545,
  40.988_641_110_536_29, 41.520_882_981_230_194, 42.057_134_733_170_16,
  42.597_404_951_718_396, 43.141_702_194_811_224, 43.690_034_993_191_3,
  44.242_411_850_636_97, 44.798_841_244_188_324, 45.359_331_624_370_17,
  45.923_891_415_412_09, 46.492_529_015_465_52, 47.065_252_796_817_916,
  47.642_071_106_104_09, 48.222_992_264_514_68, 48.808_024_568_002_054,
  49.397_176_287_483_3, 49.990_455_669_040_8, 50.587_870_934_119_984,
  51.189_430_279_724_725, 51.795_141_878_610_14, 52.405_013_879_472_88,
  53.019_054_407_139_2, 53.637_271_562_750_364, 54.259_673_423_945_976,
  54.886_268_045_044_93, 55.517_063_457_223_934, 56.152_067_668_694_24,
  56.791_288_664_875_74, 57.434_734_408_569_16, 58.082_412_840_126_21,
  58.734_331_877_617_365, 59.390_499_416_998_07, 60.050_923_332_272_51,
  60.715_611_475_655_585, 61.384_571_677_733_11, 62.057_811_747_619_894,
  62.735_339_473_115_9, 63.417_162_620_860_914, 64.103_288_936_486_92,
  64.793_726_144_769_21, 65.488_481_949_775_29, 66.187_564_035_012_24,
  66.890_980_063_572_58, 67.598_737_678_278_08, 68.310_844_501_822_22,
  69.027_308_136_910_93, 69.748_136_166_401_64, 70.473_336_153_441_07,
  71.202_915_641_601_04, 71.936_882_155_013_12, 72.675_243_198_501_72,
  73.418_006_257_715_42, 74.165_178_799_257_33, 74.916_768_270_813_6,
  75.672_782_101_280_72, 76.433_227_700_891_46, 77.198_112_461_339_3,
  77.967_443_755_901_67, 78.741_228_939_561_74, 79.519_475_349_129_04,
  80.302_190_303_358_69, 81.089_381_103_069_34, 81.881_055_031_259_99,
  82.677_219_353_225_41, 83.477_881_316_670_6, 84.283_048_151_823_72,
  85.092_727_071_548_08, 85.906_925_271_453_02, 86.725_649_930_003_43,
  87.548_908_208_628_19, 88.376_707_251_827_7, 89.209_054_187_280_1,
  90.045_956_125_946_55, 90.887_420_162_175_18, 91.733_453_373_804_38,
  92.584_062_822_264_91, 93.439_255_552_680_66, 94.299_038_593_969_02,
  95.163_418_958_939_69, 96.032_403_644_392_74, 96.905_999_631_215_9,
  97.784_213_884_480_44, 98.667_053_353_536_6, 99.554_524_972_107_76,
];

/**
 * Sanitizes a small enough angle in radians.
 * @param {number} angle An angle in radians; must not deviate too much
 * from 0.
 * @return {number} A coterminal angle between 0 and 2pi.
 */
function sanitizeRadians(angle) {
  return (angle + Math.PI * 8) % (Math.PI * 2);
}

/**
 * Delinearizes an RGB component, returning a floating-point
 * number.
 * @param {number} rgbComponent 0.0 <= rgb_component <= 100.0, represents
 * linear R/G/B channel
 * @return {number} 0.0 <= output <= 255.0, color channel converted to
 * regular RGB space
 */
function trueDelinearized(rgbComponent) {
  const normalized = rgbComponent / 100;
  let delinearized = 0;
  delinearized = normalized <= 0.003_130_8 ? normalized * 12.92 : 1.055 * normalized ** (1 / 2.4) - 0.055;
  return delinearized * 255;
}

/**
 * @param {number} component
 * @return {number}
 */
function chromaticAdaptation(component) {
  const af = Math.abs(component) ** 0.42;
  return mathUtils.signum(component) * 400 * af / (af + 27.13);
}

/**
 * Returns the hue of a linear RGB color in CAM16.
 * @param {number[]} linrgb The linear RGB coordinates of a color.
 * @return {number} The hue of the color in CAM16, in radians.
 */
function hueOf(linrgb) {
  const scaledDiscount = mathUtils.matrixMultiply(linrgb, SCALED_DISCOUNT_FROM_LINRGB);
  const rA = chromaticAdaptation(scaledDiscount[0]);
  const gA = chromaticAdaptation(scaledDiscount[1]);
  const bA = chromaticAdaptation(scaledDiscount[2]);
  // redness-greenness
  const a = (11 * rA + -12 * gA + bA) / 11;
  // yellowness-blueness
  const b = (rA + gA - 2 * bA) / 9;
  return Math.atan2(b, a);
}

/**
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {boolean}
 */
function areInCyclicOrder(a, b, c) {
  const deltaAB = sanitizeRadians(b - a);
  const deltaAC = sanitizeRadians(c - a);
  return deltaAB < deltaAC;
}

/**
 * Solves the lerp equation.
 * @param {number} source The starting number.
 * @param {number} mid The number in the middle.
 * @param {number} target The ending number.
 * @return {number} A number t such that lerp(source, target, t) = mid.
 */
function intercept(source, mid, target) {
  return (mid - source) / (target - source);
}

/**
 *
 * @param {number[]} source
 * @param {number} t
 * @param {number[]} target
 * @return {[number,number,number]}
 */
function lerpPoint(source, t, target) {
  return [
    source[0] + (target[0] - source[0]) * t,
    source[1] + (target[1] - source[1]) * t,
    source[2] + (target[2] - source[2]) * t,
  ];
}

/**
 * Intersects a segment with a plane.
 * @param {number[]} source The coordinates of point A.
 * @param {number} coordinate The R-, G-, or B-coordinate of the plane.
 * @param {number[]} target The coordinates of point B.
 * @param {number} axis The axis the plane is perpendicular with. (0: R, 1:
 * G, 2: B)
 * @return {number[]} The intersection point of the segment AB with the plane
 * R=coordinate, G=coordinate, or B=coordinate
 */
function setCoordinate(source, coordinate, target, axis) {
  const t = intercept(source[axis], coordinate, target[axis]);
  return lerpPoint(source, t, target);
}

/**
 * @param {number} x
 * @return {boolean}
 */
function isBounded(x) {
  return x >= 0 && x <= 100;
}

/**
 * Returns the nth possible vertex of the polygonal intersection.
 * @param {number} y The Y value of the plane
 * @param {number} n The zero-based index of the point. 0 <= n <= 11.
 * @return {number[]} The nth possible vertex of the polygonal intersection
 * of the y plane and the RGB cube, in linear RGB coordinates, if
 * it exists. If this possible vertex lies outside of the cube,
 * [-1.0, -1.0, -1.0] is returned.
 */
function nthVertex(y, n) {
  const kR = Y_FROM_LINRGB[0];
  const kG = Y_FROM_LINRGB[1];
  const kB = Y_FROM_LINRGB[2];
  const coordA = n % 4 <= 1 ? 0 : 100;
  const coordB = n % 2 === 0 ? 0 : 100;
  if (n < 4) {
    const g = coordA;
    const b = coordB;
    const r = (y - g * kG - b * kB) / kR;
    if (isBounded(r)) {
      return [r, g, b];
    }
    return [-1, -1, -1];
  }
  if (n < 8) {
    const b = coordA;
    const r = coordB;
    const g = (y - r * kR - b * kB) / kG;
    if (isBounded(g)) {
      return [r, g, b];
    }
    return [-1, -1, -1];
  }
  const r = coordA;
  const g = coordB;
  const b = (y - r * kR - g * kG) / kB;
  if (isBounded(b)) {
    return [r, g, b];
  }
  return [-1, -1, -1];
}

/**
 * Finds the segment containing the desired color.
 * @param {number} y The Y value of the color.
 * @param {number} targetHue The hue of the color.
 * @return {[number[], number[]]} A list of two sets of linear RGB coordinates, each
 * corresponding to an endpoint of the segment containing the
 * desired color.
 */
function bisectToSegment(y, targetHue) {
  let left = [-1, -1, -1];
  let right = left;
  let leftHue = 0;
  let rightHue = 0;
  let initialized = false;
  let uncut = true;

  for (let n = 0; n < 12; n++) {
    const mid = nthVertex(y, n);
    if (mid[0] < 0) {
      continue;
    }
    const midHue = hueOf(mid);
    if (!initialized) {
      left = mid;
      right = mid;
      leftHue = midHue;
      rightHue = midHue;
      initialized = true;
      continue;
    }
    if (uncut || areInCyclicOrder(leftHue, midHue, rightHue)) {
      uncut = false;
      if (areInCyclicOrder(leftHue, targetHue, midHue)) {
        right = mid;
        rightHue = midHue;
      } else {
        left = mid;
        leftHue = midHue;
      }
    }
  }
  return [left, right];
}

/**
 *
 * @param {number[]} a
 * @param {number[]} b
 * @return {number[]}
 */
function midpoint(a, b) {
  return [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2,
  ];
}

/**
 * @param {number} x
 * @return {number}
 */
function criticalPlaneBelow(x) {
  return Math.floor(x - 0.5);
}

/**
 * @param {number} x
 * @return {number}
 */
function criticalPlaneAbove(x) {
  return Math.ceil(x - 0.5);
}

/**
 * Finds a color with the given Y and hue on the boundary of the
 * cube.
 * @param {number} y The Y value of the color.
 * @param {number} targetHue The hue of the color.
 * @return {number[]} The desired color, in linear RGB coordinates.
 */
function bisectToLimit(y, targetHue) {
  const segment = bisectToSegment(y, targetHue);
  let left = segment[0];
  let leftHue = hueOf(left);
  let right = segment[1];
  for (let axis = 0; axis < 3; axis++) {
    if (left[axis] !== right[axis]) {
      let lPlane = -1;
      let rPlane = 255;
      if (left[axis] < right[axis]) {
        lPlane = criticalPlaneBelow(
          trueDelinearized(left[axis]),
        );
        rPlane = criticalPlaneAbove(
          trueDelinearized(right[axis]),
        );
      } else {
        lPlane = criticalPlaneAbove(
          trueDelinearized(left[axis]),
        );
        rPlane = criticalPlaneBelow(
          trueDelinearized(right[axis]),
        );
      }
      for (let i = 0; i < 8; i++) {
        if (Math.abs(rPlane - lPlane) <= 1) {
          break;
        } else {
          const mPlane = Math.floor((lPlane + rPlane) / 2);
          const midPlaneCoordinate = CRITICAL_PLANES[mPlane];
          const mid = setCoordinate(left, midPlaneCoordinate, right, axis);
          const midHue = hueOf(mid);
          if (areInCyclicOrder(leftHue, targetHue, midHue)) {
            right = mid;
            rPlane = mPlane;
          } else {
            left = mid;
            leftHue = midHue;
            lPlane = mPlane;
          }
        }
      }
    }
  }
  return midpoint(left, right);
}

/**
 * @param {number} adapted
 * @return {number}
 */
function inverseChromaticAdaptation(adapted) {
  const adaptedAbs = Math.abs(adapted);
  const base = Math.max(0, 27.13 * adaptedAbs / (400 - adaptedAbs));
  return mathUtils.signum(adapted) * base ** (1 / 0.42);
}

/**
 * Finds a color with the given hue, chroma, and Y.
 * @param {number} hueRadians The desired hue in radians.
 * @param {number} chroma The desired chroma.
 * @param {number} y The desired Y.
 * @return {number} The desired color as a hexadecimal integer, if found; 0
 * otherwise.
 */
function findResultByJ(hueRadians, chroma, y) {
  // Initial estimate of j.
  let j = Math.sqrt(y) * 11;
  // ===========================================================
  // Operations inlined from Cam16 to avoid repeated calculation
  // ===========================================================
  const viewingConditions = ViewingConditions.DEFAULT;
  const tInnerCoeff = 1 / (1.64 - 0.29 ** viewingConditions.n) ** 0.73;
  const eHue = 0.25 * (Math.cos(hueRadians + 2) + 3.8);
  const p1 = eHue * (50_000 / 13) * viewingConditions.nc * viewingConditions.ncb;
  const hSin = Math.sin(hueRadians);
  const hCos = Math.cos(hueRadians);
  for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
    // ===========================================================
    // Operations inlined from Cam16 to avoid repeated calculation
    // ===========================================================
    const jNormalized = j / 100;
    const alpha = chroma === 0 || j === 0 ? 0 : chroma / Math.sqrt(jNormalized);
    const t = (alpha * tInnerCoeff) ** (1 / 0.9);
    const ac = viewingConditions.aw
           * jNormalized ** (1 / viewingConditions.c / viewingConditions.z);
    const p2 = ac / viewingConditions.nbb;
    const gamma = 23 * (p2 + 0.305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
    const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
    const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;
    const rCScaled = inverseChromaticAdaptation(rA);
    const gCScaled = inverseChromaticAdaptation(gA);
    const bCScaled = inverseChromaticAdaptation(bA);
    const linrgb = mathUtils.matrixMultiply(
      [rCScaled, gCScaled, bCScaled],
      LINRGB_FROM_SCALED_DISCOUNT,
    );
      // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================
    if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
      return 0;
    }
    const kR = Y_FROM_LINRGB[0];
    const kG = Y_FROM_LINRGB[1];
    const kB = Y_FROM_LINRGB[2];
    const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
    if (fnj <= 0) {
      return 0;
    }
    if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
      if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
        return 0;
      }
      return colorUtils.argbFromLinrgb(linrgb);
    }
    // Iterates with Newton method,
    // Using 2 * fn(j) / j as the approximation of fn'(j)
    j -= (fnj - y) * j / (2 * fnj);
  }
  return 0;
}

/**
 * Finds an sRGB color with the given hue, chroma, and L*, if
 * possible.
 * @param {number} hueDegrees The desired hue, in degrees.
 * @param {number} chroma The desired chroma.
 * @param {number} lstar The desired L*.
 * @return {number} A hexadecimal representing the sRGB color. The color
 * has sufficiently close hue, chroma, and L* to the desired
 * values, if possible; otherwise, the hue and L* will be
 * sufficiently close, and chroma will be maximized.
 */
export function solveToInt(hueDegrees, chroma, lstar) {
  if (chroma < 0.0001 || lstar < 0.0001 || lstar > 99.9999) {
    return colorUtils.argbFromLstar(lstar);
  }
  hueDegrees = mathUtils.sanitizeDegreesDouble(hueDegrees);
  const hueRadians = hueDegrees / 180 * Math.PI;
  const y = colorUtils.yFromLstar(lstar);
  const exactAnswer = findResultByJ(hueRadians, chroma, y);
  if (exactAnswer !== 0) {
    return exactAnswer;
  }
  const linrgb = bisectToLimit(y, hueRadians);
  return colorUtils.argbFromLinrgb(linrgb);
}

/**
 * Finds an sRGB color with the given hue, chroma, and L*, if
 * possible.
 * @param {number} hueDegrees The desired hue, in degrees.
 * @param {number} chroma The desired chroma.
 * @param {number} lstar The desired L*.
 * @return {Cam16} An CAM16 object representing the sRGB color. The color
 * has sufficiently close hue, chroma, and L* to the desired
 * values, if possible; otherwise, the hue and L* will be
 * sufficiently close, and chroma will be maximized.
 */
export function solveToCam(hueDegrees, chroma, lstar) {
  return Cam16.fromInt(solveToInt(hueDegrees, chroma, lstar));
}
