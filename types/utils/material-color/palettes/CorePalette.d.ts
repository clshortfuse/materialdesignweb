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
    static "__#2@#createPaletteFromColors"(content: boolean, colors: CorePaletteColors): CorePalette;
    /**
     * @param {number} argb ARGB representation of a color
     * @return {CorePalette}
     */
    static of(argb: number): CorePalette;
    /**
     * @param {number} argb ARGB representation of a color
     * @return {CorePalette}
     */
    static contentOf(argb: number): CorePalette;
    /**
     * Create a [CorePalette] from a set of colors
     * @param {CorePaletteColors} colors
     * @return {CorePalette}
     */
    static fromColors(colors: CorePaletteColors): CorePalette;
    /**
     * Create a content [CorePalette] from a set of colors
     * @param {CorePaletteColors} colors
     * @return {CorePalette}
     */
    static contentFromColors(colors: CorePaletteColors): CorePalette;
    /**
     * @param {number} argb
     * @param {boolean} isContent
     */
    constructor(argb: number, isContent: boolean);
    /** @type {TonalPalette} */
    a1: TonalPalette;
    /** @type {TonalPalette} */
    a2: TonalPalette;
    /** @type {TonalPalette} */
    a3: TonalPalette;
    /** @type {TonalPalette} */
    n1: TonalPalette;
    /** @type {TonalPalette} */
    n2: TonalPalette;
    /** @type {TonalPalette} */
    error: TonalPalette;
}
/**
 * Set of colors to generate a [CorePalette] from
 */
export type CorePaletteColors = {
    primary: number;
    secondary?: number;
    tertiary?: number;
    neutral?: number;
    neutralVariant?: number;
    error?: number;
};
import TonalPalette from './TonalPalette.js';
//# sourceMappingURL=CorePalette.d.ts.map