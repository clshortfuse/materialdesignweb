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
export function solveToInt(hueDegrees: number, chroma: number, lstar: number): number;
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
export function solveToCam(hueDegrees: number, chroma: number, lstar: number): Cam16;
export const SCALED_DISCOUNT_FROM_LINRGB: number[][];
export const LINRGB_FROM_SCALED_DISCOUNT: number[][];
export const Y_FROM_LINRGB: number[];
export const CRITICAL_PLANES: number[];
import Cam16 from './Cam16.js';
//# sourceMappingURL=hctSolver.d.ts.map