/**
 *  A convenience class for retrieving colors that are constant in hue and
 *  chroma, but vary in tone.
 */
export default class TonalPalette {
    /**
     * @param {number} argb ARGB representation of a color
     * @return {TonalPalette} Tones matching that color's hue and chroma.
     */
    static fromInt(argb: number): TonalPalette;
    /**
     * @param {number} hue HCT hue
     * @param {number} chroma HCT chroma
     * @return {TonalPalette} Tones matching hue and chroma.
     */
    static fromHueAndChroma(hue: number, chroma: number): TonalPalette;
    /**
     * @private
     * @param {number} hue
     * @param {number} chroma
     */
    private constructor();
    hue: number;
    chroma: number;
    /**
     * @param {number} tone HCT tone, measured from 0 to 100.
     * @return  {number} ARGB representation of a color with that tone.
     */
    tone(tone: number): number;
    /**
     * @param {number} tone HCT tone.
     * @return {Hct} HCT representation of a color with that tone.
     */
    getHct(tone: number): Hct;
    #private;
}
import Hct from '../hct/Hct.js';
//# sourceMappingURL=TonalPalette.d.ts.map