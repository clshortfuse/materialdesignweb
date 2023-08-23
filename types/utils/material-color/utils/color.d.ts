/**
 * Converts a color from RGB components to ARGB format.
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @return {number}
 */
export function argbFromRgb(red: number, green: number, blue: number): number;
/**
 * Converts a color from linear RGB components to ARGB format.
 * @param {number[]} linrgb
 * @return {number}
 */
export function argbFromLinrgb(linrgb: number[]): number;
/**
 * Returns the alpha component of a color in ARGB format.
 * @param {number} argb
 * @return {number}
 */
export function alphaFromArgb(argb: number): number;
/**
 * Returns the red component of a color in ARGB format.
 * @param {number} argb
 * @return {number}
 */
export function redFromArgb(argb: number): number;
/**
 * Returns the green component of a color in ARGB format.
 * @param {number} argb
 * @return {number}
 */
export function greenFromArgb(argb: number): number;
/**
 * Returns the blue component of a color in ARGB format.
 * @param {number} argb
 * @return {number}
 */
export function blueFromArgb(argb: number): number;
/**
 * Returns whether a color in ARGB format is opaque.
 * @param {number} argb
 * @return {boolean}
 */
export function isOpaque(argb: number): boolean;
/**
 * Converts a color from ARGB to XYZ.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {number}
 */
export function argbFromXyz(x: number, y: number, z: number): number;
/**
 * Converts a color from XYZ to ARGB.
 * @param {number} argb
 * @return {number[]}
 */
export function xyzFromArgb(argb: number): number[];
/**
 * Converts a color represented in Lab color space into an ARGB
 * integer.
 * @param {number} l
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function argbFromLab(l: number, a: number, b: number): number;
/**
 * Converts a color from ARGB representation to L*a*b*
 * representation.
 * @param {number} argb the ARGB representation of a color
 * @return {number[]} a Lab object representing the color
 */
export function labFromArgb(argb: number): number[];
/**
 * Converts an L* value to an ARGB representation.
 * @param {number} lstar L* in L*a*b*
 * @return {number} ARGB representation of grayscale color with lightness
 * matching L*
 */
export function argbFromLstar(lstar: number): number;
/**
 * Computes the L* value of a color in ARGB representation.
 * @param {number} argb ARGB representation of a color
 * @return {number} L*, from L*a*b*, coordinate of the color
 */
export function lstarFromArgb(argb: number): number;
/**
 * Converts an L* value to a Y value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 * @param {number} lstar L* in L*a*b*
 * @return {number} Y in XYZ
 */
export function yFromLstar(lstar: number): number;
/**
 * Converts a Y value to an L* value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 * @param {number} y Y in XYZ
 * @return {number} L* in L*a*b*
 */
export function lstarFromY(y: number): number;
/**
 * Linearizes an RGB component.
 * @param {number} rgbComponent 0 <= rgb_component <= 255, represents R/G/B
 * channel
 * @return {number} 0.0 <= output <= 100.0, color channel converted to
 * linear RGB space
 */
export function linearized(rgbComponent: number): number;
/**
 * Delinearizes an RGB component.
 * @param {number} rgbComponent 0.0 <= rgb_component <= 100.0, represents
 * linear R/G/B channel
 * @return {number} 0 <= output <= 255, color channel converted to regular
 * RGB space
 */
export function delinearized(rgbComponent: number): number;
/**
 * Returns the standard white point; white on a sunny day.
 * @return {number[]} The white point
 */
export function whitePointD65(): number[];
/**
 * RGBA component
 * @typedef Rgba
 * @prop {number} r Red value should be between 0-255
 * @prop {number} g Green value should be between 0-255
 * @prop {number} b Blue value should be between 0-255
 * @prop {number} a Alpha value should be between 0-255
 */
/**
 * Return RGBA from a given int32 color
 * @param {number} argb ARGB representation of a int32 color.
 * @return {Rgba} RGBA representation of a int32 color.
 */
export function rgbaFromArgb(argb: number): Rgba;
/**
 * Return int32 color from a given RGBA component
 * @param {Rgba} rgba RGBA representation of a int32 color.
 * @return {number} ARGB representation of a int32 color.
 */
export function argbFromRgba({ r, g, b, a }: Rgba): number;
/**
 * RGBA component
 */
export type Rgba = {
    /**
     * Red value should be between 0-255
     */
    r: number;
    /**
     * Green value should be between 0-255
     */
    g: number;
    /**
     * Blue value should be between 0-255
     */
    b: number;
    /**
     * Alpha value should be between 0-255
     */
    a: number;
};
//# sourceMappingURL=color.d.ts.map