/**
 * Functions for blending in HCT and CAM16.
 */
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
export function harmonize(designColor: number, sourceColor: number): number;
/**
 * Blend in CAM16-UCS space.
 * @param {number} from ARGB representation of color
 * @param {number} to ARGB representation of color
 * @param {number} amount how much blending to perform; 0.0 >= and <= 1.0
 * @return {number} from, blended towards to. Hue, chroma, and tone will
 * change.
 */
export function cam16Ucs(from: number, to: number, amount: number): number;
/**
 * Blends hue from one color into another. The chroma and tone of
 * the original color are maintained.
 * @param {number} from ARGB representation of color
 * @param {number} to ARGB representation of color
 * @param {number} amount how much blending to perform; 0.0 >= and <= 1.0
 * @return {number} from, with a hue blended towards to. Chroma and tone
 * are constant.
 */
export function hctHue(from: number, to: number, amount: number): number;
//# sourceMappingURL=blend.d.ts.map